import { defineRpcFunction } from 'devframe';
import * as v from 'valibot';
import { describable } from './agent-schema.ts';
import { lstatSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  IGNORED_DIRS,
  skipRegex,
  skipString,
  sourceRoots,
  startsRegex,
  stripComments,
} from './source-scan.ts';

const RouteSchema = v.object({
  path: v.string(),
  component: v.optional(v.string()),
  redirectTo: v.optional(v.string()),
  title: v.optional(v.string()),
  hasChildren: v.boolean(),
  file: v.string(),
});

type ExtractedRoute = v.InferOutput<typeof RouteSchema>;

export const getRoutes = defineRpcFunction({
  name: 'get-routes',
  type: 'query',
  jsonSerializable: true,
  args: [],
  returns: describable(v.array(RouteSchema)),
  agent: {
    description:
      'List Angular routes extracted from route configuration files in the workspace. Call before suggesting navigation changes or analyzing the app structure.',
    title: 'List Angular routes',
  },
  setup: (ctx) => ({
    handler: async () => extractRoutes(ctx.cwd),
  }),
});

export function extractRoutes(cwd: string): ExtractedRoute[] {
  const routes: ExtractedRoute[] = [];
  for (const root of sourceRoots(cwd)) findRouteFiles(root, cwd, routes);
  return routes;
}

function findRouteFiles(dir: string, cwd: string, routes: ExtractedRoute[]) {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = join(dir, entry);
    try {
      const stats = lstatSync(full);
      // Not followed: a link can point anywhere, including outside the workspace.
      if (stats.isSymbolicLink()) continue;
      if (stats.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.toLowerCase())) findRouteFiles(full, cwd, routes);
        continue;
      }
    } catch {
      continue;
    }

    if (!entry.match(/\.routes\.ts$|routing\.module\.ts$/)) continue;

    try {
      const content = readFileSync(full, 'utf-8');
      const relPath = relative(cwd, full).replaceAll('\\', '/');

      for (const body of objectLiterals(stripComments(content))) {
        const props = topLevelProps(body);
        const path = stringLiteral(props.get('path'));
        if (path === undefined) continue;
        routes.push({
          path,
          component: routeComponent(props),
          redirectTo: routeRedirectTo(props),
          title: routeTitle(props),
          // `loadChildren` has children too, it just loads them lazily.
          hasChildren: props.has('children') || props.has('loadChildren'),
          file: relPath,
        });
      }
    } catch {
      // skip unreadable files
    }
  }
}

function decodeEscapes(s: string): string {
  return s.replace(
    /\\(?:(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2})|([nrtbfv0\\])|(\r\n|[\r\n\u2028\u2029])|(.))/g,
    (
      _: string,
      hex: string | undefined,
      char: string | undefined,
      lineCont: string | undefined,
      anyChar: string | undefined,
    ) => {
      if (hex) return String.fromCharCode(parseInt(hex.slice(1), 16));
      if (char) {
        switch (char) {
          case 'n':
            return '\n';
          case 'r':
            return '\r';
          case 't':
            return '\t';
          case 'b':
            return '\b';
          case 'f':
            return '\f';
          case 'v':
            return '\v';
          case '0':
            return '\0';
          case '\\':
            return '\\';
          default:
            return char;
        }
      }
      if (lineCont) return '';
      return anyChar ?? '';
    },
  );
}

function stringLiteral(v?: string): string | undefined {
  if (!v) return undefined;
  const quote = v[0];
  if (quote !== "'" && quote !== '"' && quote !== '`') return undefined;
  if (skipString(v, 0) !== v.length - 1) return undefined;
  if (quote === '`' && /(^|[^\\])(?:\\\\)*\$\{/.test(v)) return undefined;
  return decodeEscapes(v.slice(1, -1));
}

function routeRedirectTo(props: Map<string, string>): string | undefined {
  const val = props.get('redirectTo');
  if (val === undefined) return undefined;
  const literal = stringLiteral(val);
  return literal !== undefined ? literal : '(dynamic)';
}

function routeTitle(props: Map<string, string>): string | undefined {
  const val = props.get('title');
  if (val === undefined) return undefined;
  const literal = stringLiteral(val);
  return literal !== undefined ? literal : '(dynamic)';
}

function routeComponent(props: Map<string, string>): string | undefined {
  const eager = props.get('component')?.match(/^(\w+)/)?.[1];
  if (eager) return eager;
  return props.get('loadComponent')?.match(/\.then\(\s*\(?\s*(\w+)\s*\)?\s*=>\s*\1\.(\w+)/)?.[2];
}

type Bracket = { ch: string; at: number; routeArray: boolean; routeObject: boolean };

// An array holds routes when it is the route configuration itself (a top-level
// array, or one passed to provideRouter/forRoot/forChild) or a `children` array.
// Any other array is metadata, so objects inside it are never routes.
const ROUTE_ARRAY = /(?:\bchildren\s*:|\b(?:provideRouter|forRoot|forChild)\s*\()\s*$/;

function objectLiterals(source: string): string[] {
  const spans: [number, number][] = [];
  const open: Bracket[] = [];
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '/' && startsRegex(source, i)) i = skipRegex(source, i);
    else if (ch === '"' || ch === "'" || ch === '`') i = skipString(source, i);
    else if ('([{'.includes(ch)) {
      const parent = open.at(-1);
      open.push({
        ch,
        at: i,
        routeArray:
          ch === '[' && (!parent || ROUTE_ARRAY.test(source.slice(Math.max(0, i - 64), i))),
        routeObject: ch === '{' && parent?.ch === '[' && parent.routeArray,
      });
    } else if (')]}'.includes(ch)) {
      const closed = open.pop();
      if (ch === '}' && closed?.routeObject) spans.push([closed.at, i]);
    }
  }
  return spans.sort((a, b) => a[0] - b[0]).map(([start, end]) => source.slice(start + 1, end));
}

function topLevelProps(body: string): Map<string, string> {
  const props = new Map<string, string>();
  const add = (text: string) => {
    const prop = text.match(/^\s*(\w+)\s*:\s*([\s\S]*?)\s*$/);
    if (prop) props.set(prop[1], prop[2]);
  };
  let depth = 0;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === '/' && startsRegex(body, i)) i = skipRegex(body, i);
    else if (ch === '"' || ch === "'" || ch === '`') i = skipString(body, i);
    else if ('([{'.includes(ch)) depth++;
    else if (')]}'.includes(ch)) depth--;
    else if (ch === ',' && depth === 0) {
      add(body.slice(start, i));
      start = i + 1;
    }
  }
  add(body.slice(start));
  return props;
}

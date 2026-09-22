import { defineRpcFunction } from 'devframe';
import * as v from 'valibot';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { skipString, stripComments } from './source-scan.ts';

const RouteSchema = v.object({
  path: v.string(),
  component: v.optional(v.string()),
  hasChildren: v.boolean(),
  file: v.string(),
});

export const getRoutes = defineRpcFunction({
  name: 'get-routes',
  type: 'query',
  jsonSerializable: true,
  args: [],
  returns: v.array(RouteSchema),
  agent: {
    description:
      'List Angular routes extracted from route configuration files in the workspace. Call before suggesting navigation changes or analyzing the app structure.',
    title: 'List Angular routes',
  },
  setup: (ctx) => ({
    handler: async () => extractRoutes(ctx.cwd),
  }),
});

function extractRoutes(cwd: string) {
  const routes: { path: string; component?: string; hasChildren: boolean; file: string }[] = [];
  findRouteFiles(join(cwd, 'src'), cwd, routes);
  return routes;
}

function findRouteFiles(
  dir: string,
  cwd: string,
  routes: { path: string; component?: string; hasChildren: boolean; file: string }[],
) {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = join(dir, entry);
    try {
      if (statSync(full).isDirectory()) {
        if (entry !== 'node_modules') findRouteFiles(full, cwd, routes);
        continue;
      }
    } catch {
      continue;
    }

    if (!entry.match(/\.routes\.ts$|routing\.module\.ts$/)) continue;

    try {
      const content = readFileSync(full, 'utf-8');
      const relPath = relative(cwd, full);

      for (const body of objectLiterals(stripComments(content))) {
        const props = topLevelProps(body);
        const path = props.get('path')?.match(/^['"`]([^'"`]*)['"`]$/)?.[1];
        if (path === undefined) continue;
        routes.push({
          path,
          component: routeComponent(props),
          hasChildren: props.has('children'),
          file: relPath,
        });
      }
    } catch {
      // skip unreadable files
    }
  }
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
    if (ch === '"' || ch === "'" || ch === '`') i = skipString(source, i);
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
    if (ch === '"' || ch === "'" || ch === '`') i = skipString(body, i);
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

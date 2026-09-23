import { defineRpcFunction } from 'devframe';
import * as v from 'valibot';
import { describable } from './agent-schema.ts';
import { lstatSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  IGNORED_DIRS,
  classScopes,
  maskStrings,
  matchDelimiter,
  sourceRoots,
  stripComments,
} from './source-scan.ts';

const ComponentSchema = v.object({
  selector: v.string(),
  kind: v.string(),
  file: v.string(),
  inputs: v.array(v.string()),
  outputs: v.array(v.string()),
  isStandalone: v.boolean(),
});

export const getComponents = defineRpcFunction({
  name: 'get-components',
  type: 'query',
  jsonSerializable: true,
  args: [],
  returns: describable(v.array(ComponentSchema)),
  agent: {
    description:
      'Discover Angular components and directives by scanning source files for @Component and @Directive decorators. Returns each selector with its kind, inputs, outputs, and file path. Call this to understand the component architecture.',
    title: 'List Angular components',
  },
  setup: (ctx) => ({
    handler: async () => scanComponents(ctx.cwd),
  }),
});

interface ComponentInfo {
  selector: string;
  /** `component` or `directive`: the scan covers both. */
  kind: string;
  file: string;
  inputs: string[];
  outputs: string[];
  isStandalone: boolean;
}

function scanComponents(cwd: string): ComponentInfo[] {
  const components: ComponentInfo[] = [];
  for (const root of sourceRoots(cwd)) walk(root, cwd, components);
  return components;
}

function walk(dir: string, cwd: string, out: ComponentInfo[]) {
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
        if (!IGNORED_DIRS.has(entry.toLowerCase())) walk(full, cwd, out);
        continue;
      }
    } catch {
      continue;
    }

    if (!entry.endsWith('.ts') || entry.endsWith('.spec.ts')) continue;

    try {
      out.push(...componentsIn(readFileSync(full, 'utf-8'), relative(cwd, full)));
    } catch {
      // skip
    }
  }
}

function componentsIn(content: string, relPath: string): ComponentInfo[] {
  const source = stripComments(content);
  // A decorator or a declaration quoted inside a template is not code.
  const code = maskStrings(source);

  const components: ComponentInfo[] = [];
  const scopes = classScopes(code, source);
  scopes.forEach((scope, i) => {
    if (!scope.component) return;
    const body = code.slice(scope.start, scope.end);
    const decorator = precedingDecorator(code, scopes[i - 1]?.end ?? 0, scope.start);
    components.push({
      selector: scope.component,
      kind: decorator.name,
      file: relPath,
      inputs: [...names(body, INPUT), ...names(body, INPUT_DECORATOR)],
      outputs: [...names(body, OUTPUT), ...names(body, OUTPUT_DECORATOR)],
      isStandalone: !/\bstandalone\s*:\s*false\b/.test(decorator.args),
    });
  });
  return components;
}

function names(body: string, pattern: RegExp): string[] {
  pattern.lastIndex = 0;
  return [...body.matchAll(pattern)].map((match) => match[1]);
}

// `name = input(`, `name = input<T>(` and `name = input.required(`, optionally
// behind a modifier or a type annotation, as in `readonly name: InputSignal<T> =`.
const INPUT =
  /(?<![\w$#.])(?:this\.)?(#?[$\w]+)\s*(?::[^=;\n]{0,120})?=\s*(?:input|model)(?:\.required)?\s*[<(]/g;
const OUTPUT = /(?<![\w$#.])(?:this\.)?(#?[$\w]+)\s*(?::[^=;\n]{0,120})?=\s*output\s*[<(]/g;
// A member can carry modifiers and an accessor keyword before its name:
// `@Input() set value(v)` declares `value`, not `set`.
const MEMBER_PREFIX = String.raw`(?:(?:readonly|public|private|protected|override|declare|static|abstract|get|set|async)\s+)*`;
const INPUT_DECORATOR = new RegExp(
  String.raw`@Input\([^)]*\)\s+` + MEMBER_PREFIX + String.raw`([$\w]+)`,
  'g',
);
const OUTPUT_DECORATOR = new RegExp(
  String.raw`@Output\([^)]*\)\s+` + MEMBER_PREFIX + String.raw`([$\w]+)`,
  'g',
);

/**
 * The `@Component`/`@Directive` that precedes a class, with its own argument
 * list, so a `standalone: false` written anywhere else between two classes is
 * not read as this one's.
 */
function precedingDecorator(
  code: string,
  from: number,
  until: number,
): { name: 'component' | 'directive'; args: string } {
  const region = code.slice(from, until);
  const component = region.lastIndexOf('@Component');
  const directive = region.lastIndexOf('@Directive');
  const at = Math.max(component, directive);
  const name = directive > component ? 'directive' : 'component';
  if (at === -1) return { name, args: '' };

  const open = code.indexOf('(', from + at);
  if (open === -1 || open >= until) return { name, args: '' };
  return { name, args: code.slice(open, matchDelimiter(code, open, '(', ')') + 1) };
}

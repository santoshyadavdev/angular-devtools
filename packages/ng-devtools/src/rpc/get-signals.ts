import { defineRpcFunction } from 'devframe';
import * as v from 'valibot';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { lineAt, maskStrings, skipString, stripComments } from './source-scan.ts';

const SignalEntrySchema = v.object({
  name: v.string(),
  kind: v.string(),
  file: v.string(),
  line: v.number(),
  component: v.optional(v.string()),
});

export const getSignals = defineRpcFunction({
  name: 'get-signals',
  type: 'query',
  jsonSerializable: true,
  args: [],
  returns: v.array(SignalEntrySchema),
  agent: {
    description:
      'Scan source files for signal(), computed(), linkedSignal(), and effect() declarations. Returns name, kind, file, and line number. Call this to understand the reactive architecture before suggesting changes.',
    title: 'List Angular signals from source',
  },
  setup: (ctx) => ({
    handler: async () => scanSignals(join(ctx.cwd, 'src'), ctx.cwd),
  }),
});

interface SignalEntry {
  name: string;
  kind: string;
  file: string;
  line: number;
  component?: string;
}

interface ClassScope {
  start: number;
  end: number;
  component?: string;
}

const KINDS: Record<string, string> = {
  signal: 'signal',
  computed: 'computed',
  linkedSignal: 'linkedSignal',
  effect: 'effect',
  resource: 'resource',
  input: 'input (signal)',
  output: 'output (signal)',
  model: 'model (signal)',
  viewChild: 'viewChild (signal)',
  viewChildren: 'viewChildren (signal)',
  contentChild: 'contentChild (signal)',
  contentChildren: 'contentChildren (signal)',
};

// One pass over the file: `name = fn(` or `name = fn.required(`, with the
// optional `.required` part of the same match so a required input is not also
// reported as a plain input. The name may be a private field and may carry a
// single line type annotation, as in `readonly total: Signal<number> =`. A
// `this.` prefix is a declaration too, but any other member assignment, as in
// `store.count = signal(0)`, is not, hence the lookbehind.
const SIGNAL_CALL = new RegExp(
  String.raw`(?<![\w$#.])(?:this\.)?(#?[$\w]+)\s*(?::[^=;\n]+)?=\s*(${Object.keys(KINDS).join('|')})(\.required)?\s*[<(]`,
  'g',
);

function scanSignals(dir: string, cwd: string): SignalEntry[] {
  const entries: SignalEntry[] = [];
  walk(dir, cwd, entries);
  return entries;
}

function walk(dir: string, cwd: string, out: SignalEntry[]) {
  let items: string[];
  try {
    items = readdirSync(dir);
  } catch {
    return;
  }

  for (const item of items) {
    const full = join(dir, item);
    try {
      if (statSync(full).isDirectory()) {
        if (item !== 'node_modules') walk(full, cwd, out);
        continue;
      }
    } catch {
      continue;
    }

    if (!item.endsWith('.ts') || item.endsWith('.spec.ts') || item.endsWith('.d.ts')) continue;

    try {
      out.push(...signalsIn(readFileSync(full, 'utf-8'), relative(cwd, full)));
    } catch {
      // skip
    }
  }
}

function signalsIn(content: string, relPath: string): SignalEntry[] {
  const source = stripComments(content);
  // A declaration quoted inside a template or a string is not code. Masking
  // keeps the length, so offsets into the two strings stay interchangeable.
  const code = maskStrings(source);
  const scopes = classScopes(code, source);

  const entries: SignalEntry[] = [];
  SIGNAL_CALL.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = SIGNAL_CALL.exec(code)) !== null) {
    const at = match.index;
    const [, name, fn, required] = match;
    entries.push({
      name,
      kind: required ? `${fn}.required (signal)` : KINDS[fn],
      file: relPath,
      line: lineAt(code, at),
      component: scopes.find((scope) => at >= scope.start && at < scope.end)?.component,
    });
  }
  return entries;
}

/**
 * The span of every class in the file, each with the selector of the
 * `@Component` or `@Directive` decorating it, so that a signal is reported
 * against the class that declares it rather than the first selector in the
 * file.
 */
function classScopes(code: string, source: string): ClassScope[] {
  const scopes: ClassScope[] = [];
  const declaration = /\bclass\s+\w+/g;
  let previousEnd = 0;
  let match: RegExpExecArray | null;
  // `code` has string contents masked out, so a class written inside a
  // template cannot open a scope; `source` still holds the selector to read.
  while ((match = declaration.exec(code)) !== null) {
    const bodyStart = classBodyStart(code, match.index + match[0].length);
    if (bodyStart === -1) break;
    const end = matchDelimiter(code, bodyStart, '{', '}');
    scopes.push({
      start: match.index,
      end,
      component: decoratorSelector(
        code.slice(previousEnd, match.index),
        source.slice(previousEnd, match.index),
      ),
    });
    previousEnd = end;
    declaration.lastIndex = end;
  }
  return scopes;
}

/**
 * The first `{` that opens the class body, skipping the braces a generic
 * parameter list can hold, as in `class Panel<T extends { id: string }> {`.
 */
function classBodyStart(code: string, from: number): number {
  let angle = 0;
  for (let i = from; i < code.length; i++) {
    const ch = code[i];
    if (ch === '"' || ch === "'" || ch === '`') i = skipString(code, i);
    else if (ch === '<') angle++;
    else if (ch === '>' && angle > 0) angle--;
    else if (ch === '{' && angle === 0) return i;
  }
  return -1;
}

/**
 * The selector of the last `@Component`/`@Directive` decorator in `code`, read
 * out of `source` at the same offsets. The decorator is located in the masked
 * copy so that one written inside a template cannot be picked up, and the
 * selector is read from the unmasked copy, where its value survives.
 */
function decoratorSelector(code: string, source: string): string | undefined {
  const at = Math.max(code.lastIndexOf('@Component('), code.lastIndexOf('@Directive('));
  if (at === -1) return undefined;
  const open = code.indexOf('(', at);
  const args = source.slice(open, matchDelimiter(code, open, '(', ')'));
  return args.match(/selector:\s*['"`]([^'"`]+)['"`]/)?.[1];
}

function matchDelimiter(source: string, open: number, start: string, end: string): number {
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    const ch = source[i];
    if (ch === '"' || ch === "'" || ch === '`') i = skipString(source, i);
    else if (ch === start) depth++;
    else if (ch === end && --depth === 0) return i;
  }
  return source.length;
}

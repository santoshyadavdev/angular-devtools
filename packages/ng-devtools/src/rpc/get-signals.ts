import { defineRpcFunction } from 'devframe';
import * as v from 'valibot';
import { describable } from './agent-schema.ts';
import { lstatSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  IGNORED_DIRS,
  classScopes,
  lineCounter,
  maskStrings,
  sourceRoots,
  stripComments,
} from './source-scan.ts';

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
  returns: describable(v.array(SignalEntrySchema)),
  agent: {
    description:
      'Scan source files for signal(), computed(), linkedSignal(), and effect() declarations. Returns name, kind, file, and line number. Call this to understand the reactive architecture before suggesting changes.',
    title: 'List Angular signals from source',
  },
  setup: (ctx) => ({
    handler: async () => scanSignals(ctx.cwd),
  }),
});

interface SignalEntry {
  name: string;
  kind: string;
  file: string;
  line: number;
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
  String.raw`(?<![\w$#.])(?:this\.)?(#?[$\w]+)\s*(?::(?:[^=;\n]|=>){0,120})?=\s*(${Object.keys(KINDS).join('|')})(\.required)?\s*[<(]`,
  'g',
);

function scanSignals(cwd: string): SignalEntry[] {
  const entries: SignalEntry[] = [];
  for (const root of sourceRoots(cwd)) walk(root, cwd, entries);
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
      const stats = lstatSync(full);
      // Not followed: a link can point anywhere, including outside the workspace.
      if (stats.isSymbolicLink()) continue;
      if (stats.isDirectory()) {
        if (!IGNORED_DIRS.has(item.toLowerCase())) walk(full, cwd, out);
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
  const lineAt = lineCounter(code);

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
      line: lineAt(at),
      component: scopes.find((scope) => at >= scope.start && at < scope.end)?.component,
    });
  }
  return entries;
}

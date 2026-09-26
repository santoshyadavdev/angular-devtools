import { defineRpcFunction } from 'devframe';
import * as v from 'valibot';
import { describable } from './agent-schema.ts';
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  IGNORED_DIRS,
  classScopes,
  lineCounter,
  maskStrings,
  sourceRoots,
  stripComments,
} from './source-scan.ts';

const PipeSchema = v.object({
  name: v.string(),
  className: v.string(),
  file: v.string(),
  line: v.number(),
  isStandalone: v.boolean(),
  isPure: v.boolean(),
});

export const getPipes = defineRpcFunction({
  name: 'get-pipes',
  type: 'query',
  jsonSerializable: true,
  args: [],
  returns: describable(v.array(PipeSchema)),
  agent: {
    description:
      'Discover Angular pipes by scanning source files for @Pipe decorators. Returns each pipe name, its class, purity and standalone status, and file location. Call this to understand what data-transformation logic is available to templates.',
    title: 'List Angular pipes',
  },
  setup: (ctx) => ({
    handler: async () => scanPipes(ctx.cwd),
  }),
});

interface PipeInfo {
  name: string;
  className: string;
  file: string;
  line: number;
  isStandalone: boolean;
  /** A pipe is pure unless its decorator says otherwise. */
  isPure: boolean;
}

function scanPipes(cwd: string): PipeInfo[] {
  const pipes: PipeInfo[] = [];
  for (const root of sourceRoots(cwd)) walk(root, cwd, pipes);
  return pipes;
}

function walk(dir: string, cwd: string, out: PipeInfo[]) {
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
      out.push(...pipesIn(readFileSync(full, 'utf-8'), relative(cwd, full)));
    } catch {
      // skip
    }
  }
}

function pipesIn(content: string, relPath: string): PipeInfo[] {
  const source = stripComments(content);
  // A decorator quoted inside a template is not code.
  const code = maskStrings(source);
  const lineAt = lineCounter(code);

  const pipes: PipeInfo[] = [];
  for (const scope of classScopes(code, source)) {
    if (scope.kind !== 'pipe' || !scope.pipeName || !scope.className) continue;
    pipes.push({
      name: scope.pipeName,
      className: scope.className,
      file: relPath,
      line: lineAt(scope.start),
      isStandalone: !/\bstandalone\s*:\s*false\b/.test(scope.decoratorArgs ?? ''),
      isPure: !/\bpure\s*:\s*false\b/.test(scope.decoratorArgs ?? ''),
    });
  }
  return pipes;
}

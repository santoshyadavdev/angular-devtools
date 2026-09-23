import { defineRpcFunction } from 'devframe';
import {
  IGNORED_DIRS,
  lineCounter,
  maskStrings,
  matchDelimiter,
  sourceRoots,
  stripComments,
} from './source-scan.ts';
import * as v from 'valibot';
import { describable } from './agent-schema.ts';
import { lstatSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ProviderEntrySchema = v.object({
  token: v.string(),
  source: v.string(),
  file: v.string(),
  line: v.number(),
  providedIn: v.optional(v.string()),
  type: v.string(),
});

export const getProviders = defineRpcFunction({
  name: 'get-providers',
  type: 'query',
  jsonSerializable: true,
  args: [],
  returns: describable(v.array(ProviderEntrySchema)),
  agent: {
    description:
      'Scan source files for DI providers: @Injectable services, inject() calls, and providers arrays. Returns token, file, and where it is provided. Call this to understand the DI architecture.',
    title: 'List Angular DI providers from source',
  },
  setup: (ctx) => ({
    handler: async () => scanProviders(ctx.cwd),
  }),
});

const DECORATOR_KEYWORDS = new Set([
  'Component',
  'NgModule',
  'Injectable',
  'Directive',
  'Pipe',
  'Service',
  'Input',
  'Output',
  'Inject',
  'Optional',
  'Self',
  'SkipSelf',
  'Host',
]);

// Maps provide*() helper functions to the tokens they register
const PROVIDE_FN_TO_TOKEN: Record<string, string> = {
  provideHttpClient: 'HttpClient',
  provideRouter: 'Router',
  provideAnimations: 'AnimationDriver',
  provideAnimationsAsync: 'AnimationDriver',
  provideClientHydration: 'ClientHydration',
  provideZoneChangeDetection: 'NgZone',
  provideExperimentalZonelessChangeDetection: 'ChangeDetection (zoneless)',
  provideBrowserGlobalErrorListeners: 'ErrorHandler',
  provideServiceWorker: 'ServiceWorker',
  provideExperimentalCheckNoChanges: 'CheckNoChanges',
  providePlatformInitializer: 'PlatformInitializer',
  provideAppInitializer: 'AppInitializer',
  provideEnvironmentInitializer: 'EnvironmentInitializer',
};

interface ProviderEntry {
  token: string;
  source: string;
  file: string;
  line: number;
  providedIn?: string;
  type: string;
}

function scanProviders(cwd: string): ProviderEntry[] {
  const entries: ProviderEntry[] = [];
  for (const root of sourceRoots(cwd)) walk(root, cwd, entries);
  return entries;
}

function walk(dir: string, cwd: string, out: ProviderEntry[]) {
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
      const source = stripComments(readFileSync(full, 'utf-8'));
      // Identifiers quoted in a string are not providers, so match against
      // masked source. Masking keeps the length, so offsets still line up.
      const code = maskStrings(source);
      const relPath = relative(cwd, full);
      const lineAt = lineCounter(code);

      // @Injectable({ ... }) or @Service, matched in two steps: the decorator
      // name, then the class that follows it. Walking the argument list with a
      // bracket matcher keeps a comment or a trailing comma in there from
      // sending a single pattern into catastrophic backtracking.
      for (const decorator of code.matchAll(/@(Injectable|Service)\b/g)) {
        const at = decorator.index;
        let after = at + decorator[0].length;
        let args = '';

        const parenAt = code.indexOf('(', after);
        if (parenAt !== -1 && code.slice(after, parenAt).trim() === '') {
          const close = matchDelimiter(code, parenAt, '(', ')');
          // The value of `providedIn` is a string, so it is read from the
          // source rather than the copy with string contents masked out.
          args = source.slice(parenAt, close + 1);
          after = close + 1;
        }

        DECLARATION.lastIndex = after;
        const declaration = DECLARATION.exec(code);
        if (!declaration) continue;

        const isService = decorator[1] === 'Service';
        out.push({
          token: declaration[1],
          source: 'class',
          file: relPath,
          line: lineAt(at),
          // @Service defaults to providedIn: 'root'
          providedIn:
            /providedIn\s*:\s*['"`](\w+)['"`]/.exec(args)?.[1] ?? (isService ? 'root' : undefined),
          type: 'injectable',
        });
      }

      // inject(Token) calls — covers `x = inject(T)`, `readonly x = inject(T)`, `private x = inject<T>()`
      for (const match of code.matchAll(
        /(?<![\w$])(?:(?:private|protected|public|readonly)\s+)*(\w+)\s*=\s*inject\s*(?:<[^>]*>)?\s*\(\s*(\w+)/g,
      )) {
        out.push({
          token: match[2],
          source: match[1],
          file: relPath,
          line: lineAt(match.index!),
          type: 'injection',
        });
      }

      // Constructor injection — @Inject(Token) or typed parameter
      for (const match of code.matchAll(
        /@Inject\(\s*(\w+)\s*\)\s*(?:private|protected|public|readonly|\s)*(\w+)/g,
      )) {
        out.push({
          token: match[1],
          source: match[2],
          file: relPath,
          line: lineAt(match.index!),
          type: 'injection',
        });
      }

      // provide*() calls in app config — provideHttpClient(), provideRouter(), etc.
      for (const match of code.matchAll(/\b(provide\w+)\s*\(/g)) {
        const fnName = match[1];
        const token = PROVIDE_FN_TO_TOKEN[fnName];
        if (token) {
          out.push({
            token,
            source: fnName + '()',
            file: relPath,
            line: lineAt(match.index!),
            providedIn: 'root',
            type: 'root-provider',
          });
        }
      }

      // providers: [...] in every @Component / @Directive / @NgModule
      for (const providersMatch of code.matchAll(/providers\s*:\s*\[/g)) {
        const openAt = providersMatch.index + providersMatch[0].lastIndexOf('[');
        const blockStart = openAt + 1;
        // A nested array, as in `useValue: [1, 2]`, must not end the list.
        const block = code.slice(blockStart, matchDelimiter(code, openAt, '[', ']'));

        for (const tokenMatch of block.matchAll(/\b([A-Z]\w+)\b/g)) {
          const token = tokenMatch[1];
          if (DECORATOR_KEYWORDS.has(token)) continue;
          out.push({
            token,
            source: 'providers array',
            file: relPath,
            line: lineAt(blockStart + tokenMatch.index),
            type: 'provider',
          });
        }
      }
    } catch {
      // skip
    }
  }
}

/** Sticky, so the class after a decorator is found however far it sits. */
const DECLARATION = /\s*(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+(\w+)/y;

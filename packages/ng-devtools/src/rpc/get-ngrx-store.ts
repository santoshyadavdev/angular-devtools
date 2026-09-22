import { defineRpcFunction } from 'devframe';
import * as v from 'valibot';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const NgrxStoreEntrySchema = v.object({
  name: v.string(),
  kind: v.picklist([
    'action',
    'reducer',
    'effect',
    'selector',
    'feature',
    'store-setup',
    'signal-store',
    'signal-state',
    'signal-method',
  ]),
  file: v.string(),
  line: v.number(),
  detail: v.optional(v.string()),
});

export const getNgrxStore = defineRpcFunction({
  name: 'get-ngrx-store',
  type: 'query',
  jsonSerializable: true,
  args: [],
  returns: v.array(NgrxStoreEntrySchema),
  agent: {
    description:
      'Scan source files for NgRx store patterns: actions, reducers, effects, selectors, features, and store setup. Returns name, kind, file, and line number. Call this to understand the NgRx state management architecture.',
    title: 'List NgRx store entries from source',
  },
  setup: (ctx) => ({
    handler: async () => scanNgrxStore(join(ctx.cwd, 'src'), ctx.cwd),
  }),
});

interface NgrxStoreEntry {
  name: string;
  kind:
    | 'action'
    | 'reducer'
    | 'effect'
    | 'selector'
    | 'feature'
    | 'store-setup'
    | 'signal-store'
    | 'signal-state'
    | 'signal-method';
  file: string;
  line: number;
  detail?: string;
}

const NGRX_PATTERNS: { pattern: RegExp; kind: NgrxStoreEntry['kind'] }[] = [
  // Actions
  { pattern: /export\s+const\s+(\w+)\s*=\s*createAction\s*\(/g, kind: 'action' },
  { pattern: /(\w+)\s*=\s*createActionGroup\s*\(/g, kind: 'action' },

  // Reducers
  { pattern: /export\s+const\s+(\w+)\s*=\s*createReducer\s*\(/g, kind: 'reducer' },

  // Effects
  { pattern: /([\w$]+)\s*=\s*createEffect\s*\(/g, kind: 'effect' },

  // Selectors
  { pattern: /export\s+const\s+(\w+)\s*=\s*createSelector\s*\(/g, kind: 'selector' },
  {
    pattern: /export\s+const\s+(\w+)\s*=\s*createFeatureSelector\s*[<(]/g,
    kind: 'selector',
  },

  // Features (createFeature)
  { pattern: /export\s+const\s+(\w+)\s*=\s*createFeature\s*\(/g, kind: 'feature' },

  // Store setup
  { pattern: /(provideStore)\s*\(/g, kind: 'store-setup' },
  { pattern: /(provideState)\s*\(/g, kind: 'store-setup' },
  { pattern: /(provideEffects)\s*\(/g, kind: 'store-setup' },
  { pattern: /StoreModule\.(forRoot|forFeature)\s*\(/g, kind: 'store-setup' },
  { pattern: /EffectsModule\.(forRoot|forFeature)\s*\(/g, kind: 'store-setup' },

  // NgRx Signals
  { pattern: /(?:export\s+)?const\s+(\w+)\s*=\s*signalStore\s*\(/g, kind: 'signal-store' },
  { pattern: /(?:export\s+)?const\s+(\w+)\s*=\s*signalState\s*[<(]/g, kind: 'signal-state' },
  { pattern: /export\s+const\s+(\w+)\s*=\s*signalMethod\s*[<(]/g, kind: 'signal-method' },
];

function scanNgrxStore(dir: string, cwd: string): NgrxStoreEntry[] {
  const entries: NgrxStoreEntry[] = [];
  walk(dir, cwd, entries);
  // Deduplicate by name+file+line (guards against overlapping patterns)
  const seen = new Set<string>();
  return entries.filter((e) => {
    const key = `${e.name}:${e.file}:${e.line}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function walk(dir: string, cwd: string, out: NgrxStoreEntry[]) {
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
      const content = readFileSync(full, 'utf-8');

      // Quick check: skip files that don't reference ngrx
      if (
        !content.includes('@ngrx/') &&
        !content.includes('createAction') &&
        !content.includes('createReducer') &&
        !content.includes('createEffect') &&
        !content.includes('createSelector') &&
        !content.includes('createFeature') &&
        !content.includes('signalStore') &&
        !content.includes('signalState')
      ) {
        continue;
      }

      const relPath = relative(cwd, full);

      for (const { pattern, kind } of NGRX_PATTERNS) {
        pattern.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(content)) !== null) {
          const lineNum = content.substring(0, match.index).split('\n').length;
          const name = match[1];

          // For StoreModule/EffectsModule, use the full match as name
          const displayName =
            kind === 'store-setup' &&
            (match[0].includes('StoreModule') || match[0].includes('EffectsModule'))
              ? match[0].replace(/\s*\($/, '')
              : name;

          out.push({
            name: displayName,
            kind,
            file: relPath,
            line: lineNum,
          });
        }
      }
    } catch {
      // skip unreadable files
    }
  }
}

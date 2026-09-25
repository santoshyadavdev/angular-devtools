import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fixtureDir } from './fixture-dir.ts';
import { scan } from './scan.ts';
import { describe, expect, it } from 'vitest';
import { getNgrxStore } from '../get-ngrx-store.ts';

async function storeFor(source: string) {
  const dir = fixtureDir('ng-devtools-ngrx-');
  mkdirSync(join(dir, 'src'));
  writeFileSync(join(dir, 'src', 'store.ts'), source);
  return scan(getNgrxStore, dir);
}

describe('get-ngrx-store', () => {
  it('reads a signal store', async () => {
    const entries = await storeFor(
      `export const ProductStore = signalStore(withState({ items: [] }));`,
    );
    expect(entries.map((e) => [e.name, e.line])).toEqual([['ProductStore', 1]]);
  });

  it('reads a file whose only ngrx marker is the import', async () => {
    const entries = await storeFor(
      [
        "import { provideStore } from '@ngrx/store';",
        'export const appConfig = { providers: [provideStore({})] };',
      ].join('\n'),
    );
    expect(entries.map((e) => e.name)).toContain('provideStore');
  });

  it('ignores a commented out store', async () => {
    const entries = await storeFor(
      [
        '// export const OldStore = signalStore(withState({ a: 1 }))',
        'export const ProductStore = signalStore(withState({ items: [] }));',
      ].join('\n'),
    );
    expect(entries.map((e) => e.name)).toEqual(['ProductStore']);
  });

  it('ignores a store written inside a template string', async () => {
    const entries = await storeFor(
      [
        'const docs = `export const DocsStore = signalStore(withState({}))`;',
        'export const ProductStore = signalStore(withState({ items: [] }));',
      ].join('\n'),
    );
    expect(entries.map((e) => e.name)).toEqual(['ProductStore']);
  });
});

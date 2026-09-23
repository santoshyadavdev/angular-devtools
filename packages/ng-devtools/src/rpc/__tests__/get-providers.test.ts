import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fixtureDir } from './fixture-dir.ts';
import { describe, expect, it } from 'vitest';
import { getProviders } from '../get-providers.ts';

async function providersFor(source: string) {
  const dir = fixtureDir('ng-devtools-providers-');
  mkdirSync(join(dir, 'src'));
  writeFileSync(join(dir, 'src', 'app.ts'), source);
  const { handler } = getProviders.setup({ cwd: dir } as never);
  return handler();
}

describe('get-providers', () => {
  it('reads a providers array', async () => {
    const providers = await providersFor(`
      @Component({
        providers: [{ provide: PANEL_TITLE, useValue: 'a title' }, FeatureCatalog],
      })
      class Panel {}
    `);
    expect(providers.map((p) => p.token)).toEqual(['PANEL_TITLE', 'FeatureCatalog']);
  });

  it('reads the whole providers array when one entry holds an array', async () => {
    const providers = await providersFor(
      [
        '@Component({',
        '  providers: [{ provide: TOKENS, useValue: [1, 2] }, LateService],',
        '})',
        'class Panel {}',
      ].join('\n'),
    );
    expect(providers.map((p) => p.token)).toEqual(['TOKENS', 'LateService']);
  });

  it('reads a decorator whose argument list holds a comment', async () => {
    const providers = await providersFor(
      ['@Injectable({', '  /** docs */', "  providedIn: 'root',", '})', 'class Api {}'].join('\n'),
    );
    expect(providers).toEqual([
      expect.objectContaining({ token: 'Api', providedIn: 'root', line: 1 }),
    ]);
  });

  it('does not read identifiers quoted inside a string', async () => {
    const providers = await providersFor(`
      @Component({
        providers: [{ provide: PANEL_TITLE, useValue: 'Element level providers' }],
      })
      class Panel {}
    `);
    expect(providers.map((p) => p.token)).toEqual(['PANEL_TITLE']);
  });

  it('does not read commented out providers', async () => {
    const providers = await providersFor(`
      @Component({
        providers: [
          // { provide: OldToken, useValue: 1 },
          NewToken,
        ],
      })
      class Panel {}
    `);
    expect(providers.map((p) => p.token)).toEqual(['NewToken']);
  });

  it('reads every providers array in a file, with each token on its own line', async () => {
    const providers = await providersFor(
      [
        '@Component({',
        '  providers: [',
        '    FirstToken,',
        '  ],',
        '})',
        'class First {}',
        '',
        '@Component({',
        '  providers: [SecondToken],',
        '})',
        'class Second {}',
      ].join('\n'),
    );
    expect(providers.map((p) => [p.token, p.line])).toEqual([
      ['FirstToken', 3],
      ['SecondToken', 9],
    ]);
  });

  it('keeps providedIn and the line of each entry', async () => {
    const providers = await providersFor(
      `
@Injectable({ providedIn: 'root' })
class Settings {}`,
    );
    expect(providers).toEqual([
      expect.objectContaining({ token: 'Settings', providedIn: 'root', line: 2 }),
    ]);
  });

  it('reads inject() calls', async () => {
    const providers = await providersFor(`
      class Panel {
        readonly settings = inject(ExampleSettings);
      }
    `);
    expect(providers).toContainEqual(
      expect.objectContaining({ token: 'ExampleSettings', source: 'settings' }),
    );
  });

  it('reads the stable zoneless and check-no-changes providers', async () => {
    const providers = await providersFor(`
      export const appConfig = {
        providers: [provideZonelessChangeDetection(), provideCheckNoChangesConfig({ exhaustive: true })],
      };
    `);
    expect(providers.map((p) => p.token)).toEqual(['ChangeDetection (zoneless)', 'CheckNoChanges']);
  });
});

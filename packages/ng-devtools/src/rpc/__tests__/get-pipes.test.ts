import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fixtureDir } from './fixture-dir.ts';
import { scan } from './scan.ts';
import { describe, expect, it } from 'vitest';
import { getPipes } from '../get-pipes.ts';

async function pipesFor(source: string) {
  const dir = fixtureDir('ng-devtools-pipes-');
  mkdirSync(join(dir, 'src'));
  writeFileSync(join(dir, 'src', 'app.ts'), source);
  return scan(getPipes, dir);
}

describe('get-pipes', () => {
  it('reports a pure, standalone pipe by default', async () => {
    const [pipe] = await pipesFor(`
      @Pipe({ name: 'appTruncate' })
      export class TruncatePipe implements PipeTransform {
        transform(value: string) { return value; }
      }
    `);
    expect(pipe).toEqual(
      expect.objectContaining({
        name: 'appTruncate',
        className: 'TruncatePipe',
        isPure: true,
        isStandalone: true,
      }),
    );
  });

  it('reads an impure pipe', async () => {
    const [pipe] = await pipesFor(`
      @Pipe({ name: 'appTimeAgo', pure: false })
      export class TimeAgoPipe implements PipeTransform {
        transform(value: number) { return value; }
      }
    `);
    expect(pipe.isPure).toBe(false);
  });

  it('reads a non-standalone pipe', async () => {
    const [pipe] = await pipesFor(`
      @Pipe({ name: 'legacyFormat', standalone: false })
      export class LegacyFormatPipe implements PipeTransform {
        transform(value: string) { return value; }
      }
    `);
    expect(pipe.isStandalone).toBe(false);
  });

  it('reads a non-standalone pipe declared and exported by its NgModule', async () => {
    const pipes = await pipesFor(`
      @Pipe({ name: 'appLegacyFormat', standalone: false })
      export class LegacyFormatPipe implements PipeTransform {
        transform(value: string) { return value; }
      }

      @NgModule({
        declarations: [LegacyFormatPipe],
        exports: [LegacyFormatPipe],
      })
      export class LegacyFormatModule {}
    `);
    // The NgModule itself carries no @Pipe decorator, so only the pipe is
    // reported: a class merely declaring or exporting one is not one.
    expect(pipes.map((p) => [p.name, p.className, p.isStandalone])).toEqual([
      ['appLegacyFormat', 'LegacyFormatPipe', false],
    ]);
  });

  it('reads a non-standalone pipe whatever order it and its NgModule come in', async () => {
    const pipes = await pipesFor(`
      @NgModule({
        declarations: [LegacyFormatPipe],
        exports: [LegacyFormatPipe],
      })
      export class LegacyFormatModule {}

      @Pipe({ name: 'appLegacyFormat', standalone: false })
      export class LegacyFormatPipe implements PipeTransform {
        transform(value: string) { return value; }
      }
    `);
    expect(pipes.map((p) => p.name)).toEqual(['appLegacyFormat']);
  });

  it('reports every pipe in a file', async () => {
    const pipes = await pipesFor(`
      @Pipe({ name: 'appTruncate' })
      export class TruncatePipe implements PipeTransform {
        transform(value: string) { return value; }
      }

      @Pipe({ name: 'appTimeAgo', pure: false })
      export class TimeAgoPipe implements PipeTransform {
        transform(value: number) { return value; }
      }
    `);
    expect(pipes.map((p) => p.name)).toEqual(['appTruncate', 'appTimeAgo']);
  });

  it('does not report a component or directive as a pipe', async () => {
    const pipes = await pipesFor(`
      @Component({ selector: 'app-card', template: '' })
      export class Card {}

      @Directive({ selector: '[appHighlight]' })
      export class Highlight {}
    `);
    expect(pipes).toEqual([]);
  });

  it('ignores a pipe that is commented out', async () => {
    const pipes = await pipesFor(`
      // @Pipe({ name: 'appOld' })
      // export class OldPipe {}

      @Pipe({ name: 'appNew' })
      export class NewPipe implements PipeTransform {
        transform(value: string) { return value; }
      }
    `);
    expect(pipes.map((p) => p.name)).toEqual(['appNew']);
  });

  it('ignores a decorator quoted inside a template', async () => {
    const pipes = await pipesFor(
      '@Component({\n' +
        "  selector: 'app-docs',\n" +
        "  template: `<pre>@Pipe({ name: 'fake' })</pre>`,\n" +
        '})\n' +
        'export class Docs {}\n' +
        '\n' +
        "@Pipe({ name: 'appReal' })\n" +
        'export class RealPipe implements PipeTransform {\n' +
        '  transform(value: string) { return value; }\n' +
        '}\n',
    );
    expect(pipes.map((p) => p.name)).toEqual(['appReal']);
  });

  it('reports the file and line of the pipe class', async () => {
    const [pipe] = await pipesFor(
      [
        '/**',
        ' * Formats things.',
        ' */',
        "@Pipe({ name: 'appFormat' })",
        'export class FormatPipe {',
        '}',
      ].join('\n'),
    );
    expect(pipe.file).toBe('src/app.ts');
    expect(pipe.line).toBe(5);
  });
});

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fixtureDir } from './fixture-dir.ts';
import { scan } from './scan.ts';
import { describe, expect, it } from 'vitest';
import { getComponents } from '../get-components.ts';

async function componentsFor(source: string) {
  const dir = fixtureDir('ng-devtools-components-');
  mkdirSync(join(dir, 'src'));
  writeFileSync(join(dir, 'src', 'widgets.ts'), source);
  return scan(getComponents, dir);
}

describe('get-components', () => {
  it('reports every component in a file with its own members', async () => {
    const components = await componentsFor(`
      @Component({ selector: 'app-alpha', template: '' })
      export class Alpha {
        count = input<number>(0)
        changed = output<string>()
      }

      @Component({ selector: 'app-beta', template: '', standalone: false })
      export class Beta {
        label = input.required<string>()
      }
    `);
    expect(components).toEqual([
      expect.objectContaining({
        selector: 'app-alpha',
        inputs: ['count'],
        outputs: ['changed'],
        isStandalone: true,
      }),
      expect.objectContaining({
        selector: 'app-beta',
        inputs: ['label'],
        outputs: [],
        isStandalone: false,
      }),
    ]);
  });

  it('reads inputs declared without a type argument', async () => {
    const [component] = await componentsFor(`
      @Component({ selector: 'app-card', template: '' })
      export class Card {
        title = input('')
        size = input.required()
        expanded = model(false)
        closed = output()
      }
    `);
    expect(component.inputs).toEqual(['title', 'size', 'expanded']);
    expect(component.outputs).toEqual(['closed']);
  });

  it('marks a directive apart from a component', async () => {
    const found = await componentsFor(`
      @Component({ selector: 'app-card', template: '' })
      export class Card {}

      @Directive({ selector: '[appHighlight]' })
      export class Highlight {}
    `);
    expect(found.map((c) => [c.selector, c.kind])).toEqual([
      ['app-card', 'component'],
      ['[appHighlight]', 'directive'],
    ]);
  });

  it('ignores a component that is commented out', async () => {
    const components = await componentsFor(`
      // @Component({ selector: 'app-old', template: '' })
      // export class Old {}

      @Component({ selector: 'app-new', template: '' })
      export class New {}
    `);
    expect(components.map((c) => c.selector)).toEqual(['app-new']);
  });

  it('ignores declarations quoted inside a template', async () => {
    const [component] = await componentsFor(`
      @Component({
        selector: 'app-docs',
        template: \`<pre>title = input('quoted')</pre>\`,
      })
      export class Docs {
        real = input('')
      }
    `);
    expect(component.selector).toBe('app-docs');
    expect(component.inputs).toEqual(['real']);
  });

  it('still reads decorator based members', async () => {
    const [component] = await componentsFor(`
      @Component({ selector: 'app-legacy', template: '' })
      export class Legacy {
        @Input('aliased') name: string;
        @Output() saved = new EventEmitter<void>();
      }
    `);
    expect(component.inputs).toEqual(['name']);
    expect(component.outputs).toEqual(['saved']);
  });
});

// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { collectSignalGraph } from '../overlay.ts';

function installNg() {
  const components = new Set(['APP-ROOT', 'APP-SHELL', 'APP-PAGE', 'APP-CARD']);
  (window as any).ng = {
    getComponent: (el: Element) => (components.has(el.tagName) ? {} : null),
    getInjector: (el: Element) => el,
    ɵgetSignalGraph: (el: Element) => ({
      nodes: [{ id: '1', kind: 'signal', label: el.tagName.toLowerCase(), epoch: 1 }],
      edges: [],
    }),
  };
}

describe('collectSignalGraph target', () => {
  afterEach(() => {
    delete (window as any).ng;
  });

  it('follows the component under the deepest router outlet', () => {
    document.body.innerHTML = `
      <app-root ng-version="22.0.0">
        <router-outlet></router-outlet><app-shell>
          <router-outlet></router-outlet><app-page><app-card></app-card></app-page>
        </app-shell>
      </app-root>`;
    installNg();
    expect(collectSignalGraph()?.componentSelector).toBe('app-page');
  });

  it('prefers an explicit target', () => {
    document.body.innerHTML = `
      <app-root ng-version="22.0.0">
        <router-outlet></router-outlet><app-page><app-card></app-card></app-page>
      </app-root>`;
    installNg();
    expect(collectSignalGraph('app-card')?.componentSelector).toBe('app-card');
  });

  it('falls back when the target is missing or invalid', () => {
    document.body.innerHTML = `<app-root ng-version="22.0.0"></app-root>`;
    installNg();
    expect(collectSignalGraph('app-gone')?.componentSelector).toBe('app-root');
    expect(collectSignalGraph('[[bad')?.componentSelector).toBe('app-root');
  });
});

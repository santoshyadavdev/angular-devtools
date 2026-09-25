import { describe, expect, it } from 'vitest';
import {
  injectorTreeFor,
  injectorTreeWithEnvironment,
  mergeSignalGraphs,
  type AngularDebugApi,
} from '../overlay-core.ts';
import {
  angularRootHost,
  collectNativeScriptTree,
  nativeScriptComponentHosts,
  nativeScriptRoot,
  nativeViewAdapter,
  renderedView,
  selectorOf,
  topmostView,
  type NativeView,
} from '../overlay-nativescript-views.ts';

/** A stand-in for a `@nativescript/core` view: children come from `eachChildView`. */
function view(typeName: string, children: NativeView[] = [], extra: Partial<NativeView> = {}) {
  const v: NativeView = {
    typeName,
    parent: null,
    eachChildView: (callback) => {
      for (const child of children) if (callback(child) === false) break;
    },
    ...extra,
  };
  for (const child of children) child.parent = v;
  return v;
}

function component(selector: string, fields: Record<string, unknown> = {}) {
  class Cmp {
    static ɵcmp = { selectors: [[selector]] };
  }
  return Object.assign(new Cmp(), fields);
}

function debugApi(components: Map<NativeView, unknown>): AngularDebugApi<NativeView> {
  return { getComponent: (host) => components.get(host) ?? null };
}

describe('NativeScript component tree', () => {
  // AppHostView(ns-app) > GridLayout > ProxyViewContainer(page-router-outlet) > Frame > Page
  //   > ProxyViewContainer(ns-person) > StackLayout > Label
  const label = view('Label');
  const personHost = view('ProxyViewContainer', [view('StackLayout', [label])], {
    customCSSName: 'ns-person',
  });
  const page = view('Page', [personHost]);
  const frame = view('Frame', [page]);
  const outlet = view('ProxyViewContainer', [frame], { customCSSName: 'page-router-outlet' });
  const grid = view('GridLayout', [outlet]);
  const appHost = view('AppHostView', [grid]);

  const components = new Map<NativeView, unknown>([
    [appHost, component('ns-app')],
    [personHost, component('ns-person', { name: 'Ada', count: 2 })],
  ]);
  const ng = debugApi(components);

  it('nests components through layouts, frames and pages', () => {
    const nodes = collectNativeScriptTree(appHost, ng);
    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toMatchObject({ selector: 'ns-app', tagName: 'AppHostView' });
    expect(nodes[0].children).toHaveLength(1);
    expect(nodes[0].children[0]).toMatchObject({
      selector: 'ns-person',
      tagName: 'ProxyViewContainer',
      inputs: { name: 'Ada', count: 2 },
    });
  });

  it('keeps ids stable across collections', () => {
    const first = collectNativeScriptTree(appHost, ng);
    const second = collectNativeScriptTree(appHost, ng);
    expect(second[0].id).toBe(first[0].id);
    expect(second[0].children[0].id).toBe(first[0].children[0].id);
  });

  it('lists component hosts parents first', () => {
    expect(nativeScriptComponentHosts(appHost, ng)).toEqual([appHost, personHost]);
  });

  it('climbs to the top of the parent chain from the root view Angular hands out', () => {
    expect(topmostView(grid)).toBe(appHost);
    expect(topmostView(label)).toBe(appHost);
  });

  it('starts at the root component host Angular names, even when it is not a parent', () => {
    const detachedGrid = view('GridLayout', [view('Label')]);
    const detachedHost = view('AppHostView');
    const app = component('ns-app');
    const withRoots: AngularDebugApi<NativeView> = {
      getComponent: (host) => (host === detachedHost ? app : null),
      getRootComponents: () => [app],
      getHostElement: (c) => (c === app ? detachedHost : null),
    };
    expect(angularRootHost(withRoots, detachedGrid)).toBe(detachedHost);
    expect(nativeScriptRoot(withRoots, detachedGrid)).toBe(detachedHost);
    expect(nativeScriptRoot(ng, detachedGrid)).toBe(detachedGrid);
  });

  it('draws highlights on the first view below a proxy container', () => {
    expect(renderedView(personHost).typeName).toBe('StackLayout');
    expect(renderedView(label)).toBe(label);
  });

  it('names a host by its component selector, then by the template element name', () => {
    expect(selectorOf(personHost, component('ns-x'))).toBe('ns-x');
    expect(selectorOf(personHost, {})).toBe('ns-person');
    expect(selectorOf(label, null)).toBe('label');
    // An attribute selector has no element name to report.
    const attr = { constructor: { ɵcmp: { selectors: [['', 'nsHighlight', '']] } } };
    expect(selectorOf(label, attr)).toBe('label');
  });

  it('gives injector nodes ids that do not change between reports', () => {
    const injectors = new Map<NativeView, object>([
      [appHost, { name: 'app' }],
      [personHost, { name: 'person' }],
    ]);
    const withInjectors: AngularDebugApi<NativeView> = {
      ...ng,
      getInjector: (host) => injectors.get(host) ?? null,
      ɵgetInjectorMetadata: (injector) => (injector ? { type: 'element' } : null),
      ɵgetInjectorProviders: () => [{ token: { name: 'PersonService' }, useClass: {} }],
    };
    const first = injectorTreeFor(withInjectors, appHost, nativeViewAdapter, new WeakSet());
    const second = injectorTreeFor(withInjectors, appHost, nativeViewAdapter, new WeakSet());
    expect(first).not.toBeNull();
    expect(first!.injector).toMatchObject({ type: 'element', name: 'ns-app', providerCount: 1 });
    expect(first!.children[0].injector.name).toBe('ns-person');
    expect(second!.injector.id).toBe(first!.injector.id);
    expect(second!.children[0].injector.id).toBe(first!.children[0].injector.id);
  });

  it('reports a host once even though every getInjector call returns a new object', () => {
    const withInjectors: AngularDebugApi<NativeView> = {
      ...ng,
      getInjector: (host) => (components.has(host) ? { host } : null),
      ɵgetInjectorMetadata: () => ({ type: 'element' }),
      ɵgetInjectorProviders: () => [],
    };
    const visited = new WeakSet<object>();
    const roots = [appHost, personHost]
      .map((host) => injectorTreeFor(withInjectors, host, nativeViewAdapter, visited))
      .filter((node) => node !== null);
    expect(roots).toHaveLength(1);
    expect(roots[0]!.children.map((c) => c.injector.name)).toEqual(['ns-person']);
  });

  it('places the environment injectors above the element tree, outermost first', () => {
    const app = { source: 'Environment Injector' };
    const platform = { source: 'Platform: core' };
    const nullInjector = {};
    const withEnvironment: AngularDebugApi<NativeView> = {
      ...ng,
      getInjector: (host) => (components.has(host) ? { host } : null),
      ɵgetInjectorMetadata: (injector) =>
        injector === app || injector === platform
          ? { type: 'environment', source: (injector as { source: string }).source }
          : injector === nullInjector
            ? { type: 'null' }
            : { type: 'element' },
      ɵgetInjectorProviders: (injector) =>
        injector === app
          ? [{ token: { name: 'PersonService' } }, { token: { name: 'Router' } }]
          : [],
      ɵgetInjectorResolutionPath: (injector) => [injector, app, platform, nullInjector],
    };
    const tree = injectorTreeWithEnvironment(
      withEnvironment,
      appHost,
      nativeViewAdapter,
      new WeakSet(),
    );
    expect(tree!.injector).toMatchObject({ type: 'environment', name: 'Platform: core' });
    expect(tree!.children[0].injector).toMatchObject({
      type: 'environment',
      name: 'Environment Injector',
      providerCount: 2,
    });
    expect(tree!.children[0].providers.map((p) => p.token)).toEqual(['PersonService', 'Router']);
    expect(tree!.children[0].children[0].injector.name).toBe('ns-app');
  });
});

describe('mergeSignalGraphs', () => {
  const node = (id: string) => ({ id, kind: 'signal', epoch: 0, value: null, watched: false });

  it('returns nothing for no graphs and the graph itself for one', () => {
    expect(mergeSignalGraphs([])).toBeNull();
    const only = { nodes: [node('1')], edges: [], componentSelector: 'ns-app' };
    expect(mergeSignalGraphs([only])).toBe(only);
  });

  it('renumbers edges into one node list and drops nodes shared between graphs', () => {
    const merged = mergeSignalGraphs([
      {
        nodes: [node('1'), node('2')],
        edges: [{ consumer: 1, producer: 0 }],
        componentSelector: 'ns-app',
      },
      {
        nodes: [node('2'), node('3')],
        edges: [
          { consumer: 1, producer: 0 },
          { consumer: 1, producer: 0 },
        ],
        componentSelector: 'ns-person',
      },
    ]);
    expect(merged!.nodes.map((n) => n.id)).toEqual(['1', '2', '3']);
    expect(merged!.edges).toEqual([
      { consumer: 1, producer: 0 },
      { consumer: 2, producer: 1 },
    ]);
    expect(merged!.componentSelector).toBe('ns-app, ns-person');
  });
});

import { connectDevframe } from 'devframe/client';
import {
  injectorTreeFor,
  ngrxStoreStateFrom,
  safeSerialize,
  signalGraphFor,
  walkComponentTree,
  type AngularDebugApi as DebugApi,
  type CollectedInjector,
  type CollectedSignalGraph,
  type ComponentTreeNode,
  type HostAdapter,
} from './overlay-core.ts';

export type { ComponentTreeNode } from './overlay-core.ts';

let highlightEl: HTMLElement | null = null;

export async function initOverlay(options: { baseURL?: string | string[] } = {}) {
  // `connectDevframe()` alone looks for the connection next to the page, which
  // misses the documented `/__ng-devtools/` mount in a host app.
  const rpc = await connectDevframe({ baseURL: options.baseURL ?? ['./', '/__ng-devtools/'] });
  const my = rpc.scope('ng-devtools');

  async function pushTree() {
    const tree = collectComponentTree();
    await my.rpc.call('push-component-tree', tree);
  }

  async function pushSignalGraph() {
    const graph = collectSignalGraph();
    if (graph) await my.rpc.call('push-signal-graph', graph);
  }

  async function pushInjectorTree() {
    const tree = collectInjectorTree();
    if (tree.length) await my.rpc.call('push-injector-tree', tree);
  }

  async function pushNgrxState() {
    const data = collectNgrxState();
    if (data) await my.rpc.call('push-ngrx-state', data);
  }

  pushTree();
  pushSignalGraph();
  pushInjectorTree();
  pushNgrxState();

  const interval = setInterval(() => {
    pushTree();
    pushSignalGraph();
    pushInjectorTree();
    pushNgrxState();
  }, 3000);

  my.rpc.register({
    name: 'highlight-in-page',
    type: 'event',
    jsonSerializable: true,
    handler: (selector: string) => {
      clearHighlight();
      // The selector comes from an agent, so it may not be valid CSS.
      let el: Element | null = null;
      try {
        el = document.querySelector(selector);
      } catch {
        return;
      }
      if (el instanceof HTMLElement) showHighlight(el);
    },
  });

  return () => {
    clearInterval(interval);
    clearHighlight();
  };
}

export type AngularDebugApi = DebugApi<Element>;

const domAdapter: HostAdapter<Element> = {
  children: (el) => Array.from(el.children),
  id: generateId,
  tagName: (el) => el.tagName.toLowerCase(),
  selector: (el) => el.tagName.toLowerCase(),
};

function findAngularElements(): Element[] {
  const versionEls = Array.from(document.querySelectorAll('[ng-version]'));
  const allEls = Array.from(document.querySelectorAll('*'));
  const hostEls = allEls.filter((el) =>
    Array.from(el.attributes).some((a) => a.name.startsWith('_nghost')),
  );
  return Array.from(new Set([...versionEls, ...hostEls]));
}

export function collectComponentTree() {
  const nodes: ComponentTreeNode[] = [];
  const allRoots = findAngularElements();
  const roots = allRoots.filter(
    (root) => !allRoots.some((other) => other !== root && other.contains(root)),
  );

  // Use Angular's debug utilities if available
  const ng = getNg();
  if (ng?.getComponent) {
    if (roots.length > 0) {
      for (const root of roots) {
        walkAngularTree(root, nodes, ng);
      }
    } else if (typeof document !== 'undefined' && document.body) {
      walkAngularTree(document.body, nodes, ng);
    }
  } else {
    // Fallback: walk DOM for Angular component host elements
    if (typeof document !== 'undefined' && document.body) {
      walkDom(document.body, nodes);
    }
  }

  return nodes;
}

export function walkAngularTree(el: Element, out: ComponentTreeNode[], ng: AngularDebugApi) {
  walkComponentTree(el, out, ng, domAdapter);
}

function walkDom(el: Element, out: ComponentTreeNode[]) {
  const tagName = el.tagName.toLowerCase();
  const isComponent =
    tagName.includes('-') || Array.from(el.attributes).some((a) => a.name.startsWith('_nghost'));

  if (isComponent) {
    const node: ComponentTreeNode = {
      id: generateId(el),
      selector: tagName,
      tagName,
      children: [],
    };
    for (const child of el.children) {
      walkDom(child, node.children);
    }
    out.push(node);
  } else {
    for (const child of el.children) {
      walkDom(child, out);
    }
  }
}

let idCounter = 0;
function generateId(el: Element) {
  const existing = el.getAttribute('data-ng-devtools-id');
  if (existing) return existing;
  const id = `ngdt-${++idCounter}`;
  el.setAttribute('data-ng-devtools-id', id);
  return id;
}

// Highlight overlay
function showHighlight(el: HTMLElement) {
  clearHighlight();
  const rect = el.getBoundingClientRect();
  highlightEl = document.createElement('div');
  Object.assign(highlightEl.style, {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    background: 'rgba(104, 182, 255, 0.25)',
    border: '2px solid rgba(104, 182, 255, 0.8)',
    borderRadius: '4px',
    pointerEvents: 'none',
    zIndex: '2147483647',
    transition: 'all 0.15s ease',
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(highlightEl);
  setTimeout(clearHighlight, 2000);
}

function clearHighlight() {
  highlightEl?.remove();
  highlightEl = null;
}

// --- Signal Graph collection using Angular's debug API ---

function getNg(): AngularDebugApi | undefined {
  return (window as unknown as { ng?: AngularDebugApi }).ng;
}

function componentRoots(): Element[] {
  return Array.from(document.querySelectorAll('[ng-version], [_nghost-ng-c]'));
}

function collectSignalGraph(): CollectedSignalGraph | null {
  const ng = getNg();
  if (!ng?.ɵgetSignalGraph) return null;

  // Get the first component root and its injector
  for (const root of componentRoots()) {
    const graph = signalGraphFor(ng, root, domAdapter);
    if (graph) return graph;
  }
  return null;
}

// --- DI Injector Tree collection ---

function collectInjectorTree(): CollectedInjector[] {
  const ng = getNg();
  if (!ng?.getInjector || !ng?.ɵgetInjectorMetadata) return [];

  const roots: CollectedInjector[] = [];
  const visited = new WeakSet<object>();
  for (const el of componentRoots()) {
    const node = injectorTreeFor(ng, el, domAdapter, visited);
    if (node) roots.push(node);
  }
  return roots;
}

// --- NgRx Store state collection via Redux DevTools protocol ---

const ngrxActionLog: { type: string; payload?: unknown; timestamp: number }[] = [];
const MAX_ACTION_LOG = 50;
let reduxDevToolsSubscribed = false;

function collectNgrxState(): {
  state: unknown;
  actions: { type: string; payload?: unknown; timestamp: number }[];
  connected: boolean;
} | null {
  const win = window as any;

  // Try Redux DevTools Extension connection
  if (!reduxDevToolsSubscribed) {
    subscribeToReduxDevTools();
  }

  // Try to get state from the NgRx store via Angular's DI
  const storeState = getNgrxStoreState();
  if (storeState !== undefined) {
    return { state: storeState, actions: ngrxActionLog.slice(), connected: true };
  }

  // Check if we have actions from Redux DevTools subscription
  if (ngrxActionLog.length > 0) {
    return {
      state: win.__NGRX_DEVTOOLS_LAST_STATE__ ?? null,
      actions: ngrxActionLog.slice(),
      connected: true,
    };
  }

  return null;
}

function getNgrxStoreState(): unknown | undefined {
  const ng = getNg();
  if (!ng?.getInjector) return undefined;
  return ngrxStoreStateFrom(ng, componentRoots());
}

function subscribeToReduxDevTools() {
  const win = window as any;

  // Hook into __REDUX_DEVTOOLS_EXTENSION__ if it exists
  const ext = win.__REDUX_DEVTOOLS_EXTENSION__;
  if (!ext) return;

  reduxDevToolsSubscribed = true;

  // Wrap the connect method to intercept NgRx connections
  const originalConnect = ext.connect?.bind(ext);
  if (originalConnect) {
    ext.connect = function (...args: unknown[]) {
      const connection = originalConnect(...args);

      // Intercept send calls to capture actions
      const originalSend = connection.send?.bind(connection);
      if (originalSend) {
        connection.send = function (action: unknown, state: unknown) {
          captureAction(action);
          win.__NGRX_DEVTOOLS_LAST_STATE__ = safeSerialize(state);
          return originalSend(action, state);
        };
      }

      // Intercept init to capture initial state
      const originalInit = connection.init?.bind(connection);
      if (originalInit) {
        connection.init = function (state: unknown) {
          win.__NGRX_DEVTOOLS_LAST_STATE__ = safeSerialize(state);
          return originalInit(state);
        };
      }

      return connection;
    };
  }

  // Also try to subscribe to existing connections
  if (typeof ext.subscribe === 'function') {
    try {
      ext.subscribe((message: any) => {
        try {
          if (message?.type === 'ACTION' || message?.type === 'DISPATCH') {
            captureAction(message.payload);
          }
          if (message?.state) {
            win.__NGRX_DEVTOOLS_LAST_STATE__ = safeSerialize(
              typeof message.state === 'string' ? JSON.parse(message.state) : message.state,
            );
          }
        } catch {
          // ignore malformed messages
        }
      });
    } catch {
      // subscription not supported
    }
  }
}

function captureAction(action: unknown) {
  if (!action) return;
  const entry = {
    type: (action as any).type ?? String(action),
    payload: safeSerialize((action as any).payload ?? (action as any)),
    timestamp: Date.now(),
  };
  ngrxActionLog.push(entry);
  if (ngrxActionLog.length > MAX_ACTION_LOG) {
    ngrxActionLog.splice(0, ngrxActionLog.length - MAX_ACTION_LOG);
  }
}

// Auto-init when loaded as a script (skip during test environment)
if (
  typeof document !== 'undefined' &&
  !(typeof process !== 'undefined' && process.env?.['VITEST'])
) {
  initOverlay().catch(console.error);
  import('./popup.ts').then((m) => m.createDevtoolsPopup()).catch(console.error);
}

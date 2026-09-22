import { connectDevframe } from 'devframe/client';

let highlightEl: HTMLElement | null = null;

export async function initOverlay() {
  const rpc = await connectDevframe();
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
      const el = document.querySelector(selector);
      if (el instanceof HTMLElement) showHighlight(el);
    },
  });

  // On-demand signal graph for a specific component
  my.rpc.register({
    name: 'get-signal-graph-for',
    type: 'query',
    jsonSerializable: true,
    handler: (selector: string) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      return getSignalGraphForElement(el);
    },
  });

  // On-demand DI providers for a specific component
  my.rpc.register({
    name: 'get-providers-for',
    type: 'query',
    jsonSerializable: true,
    handler: (selector: string) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      return getProvidersForElement(el);
    },
  });

  return () => {
    clearInterval(interval);
    clearHighlight();
  };
}

function collectComponentTree() {
  const nodes: ComponentTreeNode[] = [];
  const roots = document.querySelectorAll('[ng-version], [_nghost-ng-c]');

  // Use Angular's debug utilities if available
  const ng = (window as any).ng;
  if (ng?.getComponent) {
    for (const root of roots) {
      walkAngularTree(root, nodes, ng);
    }
  } else {
    // Fallback: walk DOM for Angular component host elements
    walkDom(document.body, nodes);
  }

  return nodes;
}

interface ComponentTreeNode {
  id: string;
  selector: string;
  tagName: string;
  children: ComponentTreeNode[];
  inputs?: Record<string, unknown>;
}

function walkAngularTree(el: Element, out: ComponentTreeNode[], ng: any) {
  const component = ng.getComponent(el);
  if (!component) return;

  const node: ComponentTreeNode = {
    id: generateId(el),
    selector: el.tagName.toLowerCase(),
    tagName: el.tagName.toLowerCase(),
    children: [],
    inputs: tryGetInputs(component),
  };

  for (const child of el.querySelectorAll(':scope > *')) {
    walkAngularTree(child, node.children, ng);
  }

  out.push(node);
}

function walkDom(el: Element, out: ComponentTreeNode[]) {
  const tagName = el.tagName.toLowerCase();
  const isComponent = tagName.includes('-') || el.hasAttribute('_nghost-ng-c');

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

function tryGetInputs(component: any): Record<string, unknown> | undefined {
  try {
    const inputs: Record<string, unknown> = {};
    for (const key of Object.keys(component)) {
      const val = component[key];
      if (typeof val === 'function' && val.name === 'signalValueFn') {
        inputs[key] = val();
      } else if (typeof val !== 'function') {
        inputs[key] = val;
      }
    }
    return Object.keys(inputs).length > 0 ? inputs : undefined;
  } catch {
    return undefined;
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

function getNg(): any {
  return (window as any).ng;
}

function collectSignalGraph() {
  const ng = getNg();
  if (!ng?.ɵgetSignalGraph) return null;

  // Get the first component root and its injector
  const roots = document.querySelectorAll('[ng-version], [_nghost-ng-c]');
  for (const root of roots) {
    const graph = getSignalGraphForElement(root);
    if (graph) return graph;
  }
  return null;
}

function getSignalGraphForElement(el: Element) {
  const ng = getNg();
  if (!ng?.ɵgetSignalGraph || !ng?.getInjector) return null;

  try {
    const injector = ng.getInjector(el);
    if (!injector) return null;

    const raw = ng.ɵgetSignalGraph(injector);
    if (!raw) return null;

    return {
      nodes: raw.nodes.map((n: any) => ({
        id: n.id,
        kind: n.kind ?? 'unknown',
        label: n.label,
        epoch: n.epoch ?? 0,
        value: serializeValue(n.value),
        watched: n.watched ?? false,
      })),
      edges: raw.edges ?? [],
      componentSelector: el.tagName.toLowerCase(),
    };
  } catch {
    return null;
  }
}

function serializeValue(val: unknown): unknown {
  if (val === undefined || val === null) return val;
  if (typeof val === 'function') return `[Function: ${val.name || 'anonymous'}]`;
  if (typeof val === 'symbol') return val.toString();
  if (typeof val === 'bigint') return val.toString();
  if (typeof val === 'object') {
    try {
      return JSON.parse(JSON.stringify(val));
    } catch {
      return String(val);
    }
  }
  return val;
}

// --- DI Injector Tree collection ---

interface CollectedInjector {
  injector: { id: string; type: string; name: string; providerCount: number };
  providers: { token: string; type: string; isViewProvider: boolean }[];
  children: CollectedInjector[];
}

function collectInjectorTree(): CollectedInjector[] {
  const ng = getNg();
  if (!ng?.getInjector || !ng?.ɵgetInjectorMetadata) return [];

  const roots: CollectedInjector[] = [];
  const visited = new WeakSet();
  const componentEls = document.querySelectorAll('[ng-version], [_nghost-ng-c]');

  for (const el of componentEls) {
    try {
      const injector = ng.getInjector(el);
      if (!injector || visited.has(injector)) continue;
      visited.add(injector);

      const node = serializeInjectorNode(ng, injector, el, visited);
      if (node) roots.push(node);
    } catch {
      // skip
    }
  }
  return roots;
}

function serializeInjectorNode(
  ng: any,
  injector: any,
  el: Element,
  visited: WeakSet<object>,
): CollectedInjector | null {
  try {
    const metadata = ng.ɵgetInjectorMetadata?.(injector);
    if (!metadata) return null;

    const providers = getInjectorProvidersList(ng, injector);
    const children: CollectedInjector[] = [];

    // Walk child components
    for (const child of el.querySelectorAll(':scope > *')) {
      try {
        const childInjector = ng.getInjector(child);
        if (!childInjector || visited.has(childInjector) || childInjector === injector) continue;
        visited.add(childInjector);
        const childNode = serializeInjectorNode(ng, childInjector, child, visited);
        if (childNode) children.push(childNode);
      } catch {
        // skip
      }
    }

    return {
      injector: {
        id: `inj-${el.tagName.toLowerCase()}-${Math.random().toString(36).slice(2, 8)}`,
        type: metadata.type ?? 'unknown',
        name:
          metadata.type === 'element'
            ? el.tagName.toLowerCase()
            : (metadata.source?.toString?.() ?? 'Environment'),
        providerCount: providers.length,
      },
      providers,
      children,
    };
  } catch {
    return null;
  }
}

function getInjectorProvidersList(ng: any, injector: any) {
  if (!ng.ɵgetInjectorProviders) return [];
  try {
    const raw = ng.ɵgetInjectorProviders(injector) ?? [];
    return raw.map((p: any) => ({
      token: p.token?.name ?? p.token?.toString?.() ?? 'unknown',
      type: inferProviderType(p),
      isViewProvider: p.isViewProvider ?? false,
    }));
  } catch {
    return [];
  }
}

function inferProviderType(p: any): string {
  if (p.useClass) return 'class';
  if (p.useValue !== undefined) return 'value';
  if (p.useFactory) return 'factory';
  if (p.useExisting) return 'existing';
  return 'class';
}

function getProvidersForElement(el: Element) {
  const ng = getNg();
  if (!ng?.getInjector || !ng?.ɵgetInjectorProviders) return null;

  try {
    const injector = ng.getInjector(el);
    if (!injector) return null;

    const providers = getInjectorProvidersList(ng, injector);
    const resolutionPath = ng.ɵgetInjectorResolutionPath?.(injector) ?? [];

    return {
      providers,
      resolutionPath: resolutionPath.map((inj: any) => {
        const meta = ng.ɵgetInjectorMetadata?.(inj);
        return {
          type: meta?.type ?? 'unknown',
          name:
            meta?.type === 'element'
              ? (meta.source?.tagName?.toLowerCase?.() ?? 'element')
              : 'environment',
        };
      }),
    };
  } catch {
    return null;
  }
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

  const roots = document.querySelectorAll('[ng-version], [_nghost-ng-c]');
  for (const root of roots) {
    try {
      const injector = ng.getInjector(root);
      if (!injector) continue;

      // Try to get the NgRx Store service from the injector
      // NgRx Store has a `select` method and an internal `state` observable
      const allProviders = ng.ɵgetInjectorProviders?.(injector) ?? [];
      for (const p of allProviders) {
        const token = p.token;
        if (!token) continue;

        // Check if this is the NgRx Store token
        const tokenName = token.name ?? token.toString?.() ?? '';
        if (tokenName === 'Store') {
          try {
            const store = injector.get(token);
            // NgRx Store keeps current state accessible via its internal state
            // Use a synchronous snapshot via getValue() on the underlying BehaviorSubject
            if (store && typeof store.getValue === 'function') {
              return safeSerialize(store.getValue());
            }
            // Alternative: check for the internal state property
            if (store?._state?.getValue) {
              return safeSerialize(store._state.getValue());
            }
          } catch {
            // not resolvable at this injector level
          }
        }
      }
    } catch {
      // skip
    }
  }
  return undefined;
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
        if (message.type === 'ACTION' || message.type === 'DISPATCH') {
          captureAction(message.payload);
        }
        if (message.state) {
          win.__NGRX_DEVTOOLS_LAST_STATE__ = safeSerialize(
            typeof message.state === 'string' ? JSON.parse(message.state) : message.state,
          );
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

function safeSerialize(val: unknown): unknown {
  if (val === undefined || val === null) return val;
  try {
    return JSON.parse(JSON.stringify(val));
  } catch {
    return String(val);
  }
}

// Auto-init when loaded as a script
if (typeof document !== 'undefined') {
  initOverlay().catch(console.error);
  import('./popup.ts').then((m) => m.createDevtoolsPopup()).catch(() => {});
}

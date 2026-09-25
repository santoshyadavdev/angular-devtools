import { connectDevframe } from 'devframe/client';
import {
  collectForms,
  diffForms,
  findFieldElement,
  findForms,
  formIdFor,
  propertyHolding,
  serializeControl,
  watchControlEvents,
  type CollectedForm,
  type FormEvent,
  type FormFieldNode,
  type FoundForm,
} from './forms.ts';

let highlightEl: HTMLElement | null = null;
let highlightTimer: ReturnType<typeof setTimeout> | undefined;
let highlightFrame = 0;
const MAX_FORM_EVENTS = 200;
const FORMS_HEARTBEAT_MS = 5000;
const DIFFED_FOR_ALL: FormEvent['type'][] = [
  'value',
  'status',
  'touched',
  'dirty',
  'added',
  'removed',
];

const PAGE_ID_KEY = 'ng-devtools-page-id';

function storedPageId(): string | null {
  try {
    return sessionStorage.getItem(PAGE_ID_KEY);
  } catch {
    return null;
  }
}

function storePageId(id: string) {
  try {
    sessionStorage.setItem(PAGE_ID_KEY, id);
  } catch {
    return;
  }
}

async function claimPageId(): Promise<{ id: string; release: () => void }> {
  const fresh = Math.random().toString(36).slice(2, 6);
  let id = storedPageId() ?? fresh;
  if (typeof BroadcastChannel === 'undefined') {
    storePageId(id);
    return { id, release: () => {} };
  }
  const channel = new BroadcastChannel('ng-devtools-page-ids');
  let onTaken = () => {};
  channel.onmessage = (message) => {
    if (message.data?.claim === id) channel.postMessage({ taken: id });
    if (message.data?.taken === id) onTaken();
  };
  const taken = await new Promise<boolean>((resolve) => {
    const timer = setTimeout(() => resolve(false), 150);
    onTaken = () => {
      clearTimeout(timer);
      resolve(true);
    };
    channel.postMessage({ claim: id });
  });
  onTaken = () => {};
  if (taken) id = fresh;
  storePageId(id);
  return { id, release: () => channel.close() };
}

function isFieldTarget(target: unknown): target is { formId: string; path: string } {
  const t = target as { formId?: unknown; path?: unknown } | null;
  return (
    typeof t?.formId === 'string' &&
    typeof t.path === 'string' &&
    t.formId.length < 50 &&
    t.path.length < 500
  );
}

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

  const { id: pageId, release: releasePageId } = await claimPageId();
  const idOf = (root: object) => `${formIdFor(root)}@${pageId}`;
  let lastForms: CollectedForm[] = [];
  let lastPayload = '';
  let lastPushAt = 0;
  const formEvents: FormEvent[] = [];
  const watched = new Map<object, { formId: string; stop: () => void }>();
  const lastStatus = new Map<string, string>();
  const lastValue = new Map<string, string>();
  let foundById = new Map<string, FoundForm>();
  let fieldElements = new WeakMap<object, Element>();

  let eventSeq = 0;

  function recordFormEvent(input: FormEvent) {
    const event = { ...input, seq: ++eventSeq };
    if (event.type === 'value') {
      const key = `${event.formId}:${event.path}`;
      if (lastValue.get(key) === event.detail) return;
      lastValue.set(key, event.detail ?? '');
    }
    if (event.type === 'status') {
      const key = `${event.formId}:${event.path}`;
      const status = event.detail?.split('→').pop()?.trim() ?? '';
      if (lastStatus.get(key) === status) return;
      lastStatus.set(key, status);
    }
    const last = formEvents[formEvents.length - 1];
    if (
      event.type === 'value' &&
      last?.type === 'value' &&
      last.formId === event.formId &&
      last.path === event.path
    ) {
      formEvents[formEvents.length - 1] = event;
      return;
    }
    formEvents.push(event);
    if (formEvents.length > MAX_FORM_EVENTS) {
      formEvents.splice(0, formEvents.length - MAX_FORM_EVENTS);
    }
  }

  function seedStatuses(formId: string, node: FormFieldNode) {
    lastStatus.set(`${formId}:${node.path}`, node.status);
    for (const child of node.children ?? []) seedStatuses(formId, child);
  }

  function watchRoots(found: FoundForm[]) {
    const live = new Set<object>();
    for (const form of found) {
      if (form.kind === 'signal') continue;
      live.add(form.root);
      if (watched.has(form.root)) continue;
      const formId = idOf(form.root);
      const stop = watchControlEvents(
        form.root,
        formId,
        (event) => {
          if (event.type !== 'touched' && event.type !== 'dirty') recordFormEvent(event);
        },
        {
          elements: () => fieldElements,
          rootKey: form.property ?? propertyHolding(form) ?? '',
          submitted: () => form.directive?.['submitted'],
        },
      );
      if (!stop) continue;
      watched.set(form.root, { formId, stop });
      seedStatuses(formId, serializeControl(form.root, fieldElements));
    }
    for (const [root, { formId, stop }] of watched) {
      if (live.has(root)) continue;
      stop();
      watched.delete(root);
      for (const map of [lastStatus, lastValue]) {
        for (const key of map.keys()) {
          if (key.startsWith(`${formId}:`)) map.delete(key);
        }
      }
    }
  }

  async function pushForms() {
    try {
      const ng = getNg();
      if (!ng?.getDirectives) return;
      const found = findForms(ng, document.querySelectorAll('*'));
      foundById = new Map(found.forms.map((form) => [idOf(form.root), form]));
      fieldElements = found.elements;
      watchRoots(found.forms);
      const forms = collectForms(found, idOf);
      const streamed = new Set(Array.from(watched.values(), ({ formId }) => formId));
      for (const event of diffForms(lastForms, forms)) {
        if (!streamed.has(event.formId) || DIFFED_FOR_ALL.includes(event.type)) {
          recordFormEvent(event);
        }
      }
      lastForms = forms;
      const payload = JSON.stringify({ forms, events: formEvents });
      if (payload === lastPayload && Date.now() - lastPushAt < FORMS_HEARTBEAT_MS) return;
      lastPayload = payload;
      lastPushAt = Date.now();
      await my.rpc.call('push-forms', { pageId, forms, events: formEvents });
    } catch {
      return;
    }
  }

  pushTree();
  pushSignalGraph();
  pushInjectorTree();
  pushNgrxState();
  pushForms();

  const interval = setInterval(() => {
    pushTree();
    pushSignalGraph();
    pushInjectorTree();
    pushNgrxState();
    pushForms();
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

  my.rpc.register({
    name: 'highlight-form-field',
    type: 'event',
    jsonSerializable: true,
    handler: (target: { formId: string; path: string } | null) => {
      clearHighlight();
      const ng = getNg();
      if (!isFieldTarget(target) || !ng?.getDirectives) return;
      const found = foundById.get(target.formId);
      if (!found) return;
      try {
        const el = findFieldElement(
          ng,
          document.querySelectorAll('*'),
          found,
          target.path,
          fieldElements,
        );
        if (el instanceof HTMLElement) showHighlight(el);
      } catch {
        return;
      }
    },
  });

  const leave = () => void my.rpc.call('forget-forms-page', pageId).catch(() => {});
  addEventListener('pagehide', leave);

  return () => {
    clearInterval(interval);
    removeEventListener('pagehide', leave);
    for (const { stop } of watched.values()) stop();
    releasePageId();
    watched.clear();
    clearHighlight();
  };
}

export interface AngularDebugApi {
  getComponent(el: Element): unknown;
  getInjector?(el: Element): unknown;
  ɵgetSignalGraph?(injector: unknown): unknown;
}

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
  const ng = (window as unknown as { ng?: AngularDebugApi }).ng;
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

export interface ComponentTreeNode {
  id: string;
  selector: string;
  tagName: string;
  children: ComponentTreeNode[];
  inputs?: Record<string, unknown>;
}

export function walkAngularTree(el: Element, out: ComponentTreeNode[], ng: AngularDebugApi) {
  const component = ng.getComponent(el);

  if (component) {
    const node: ComponentTreeNode = {
      id: generateId(el),
      selector: el.tagName.toLowerCase(),
      tagName: el.tagName.toLowerCase(),
      children: [],
      inputs: tryGetInputs(component),
    };

    for (const child of el.children) {
      walkAngularTree(child, node.children, ng);
    }

    out.push(node);
  } else {
    for (const child of el.children) {
      walkAngularTree(child, out, ng);
    }
  }
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

function isSignal(val: unknown): val is () => unknown {
  if (typeof val !== 'function') return false;
  if (val.name === 'signalValueFn') return true;
  const symbols = Object.getOwnPropertySymbols(val);
  return symbols.some((s) => s.description === 'SIGNAL' || s.toString().includes('SIGNAL'));
}

function tryGetInputs(component: unknown): Record<string, unknown> | undefined {
  if (!component || typeof component !== 'object') return undefined;
  try {
    const inputs: Record<string, unknown> = {};
    const comp = component as Record<string, unknown>;
    for (const key of Object.keys(comp)) {
      const val = comp[key];
      if (isSignal(val)) {
        try {
          inputs[key] = serializeValue(val());
        } catch {
          // skip
        }
      } else if (typeof val !== 'function') {
        inputs[key] = serializeValue(val);
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
  highlightEl = document.createElement('div');
  Object.assign(highlightEl.style, {
    position: 'fixed',
    background: 'rgba(104, 182, 255, 0.25)',
    border: '2px solid rgba(104, 182, 255, 0.8)',
    borderRadius: '4px',
    pointerEvents: 'none',
    zIndex: '2147483647',
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(highlightEl);
  const follow = () => {
    if (!highlightEl) return;
    const rect = el.getBoundingClientRect();
    Object.assign(highlightEl.style, {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
    highlightFrame = requestAnimationFrame(follow);
  };
  follow();
  highlightTimer = setTimeout(clearHighlight, 2000);
}

function clearHighlight() {
  clearTimeout(highlightTimer);
  cancelAnimationFrame(highlightFrame);
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
            if (!store || typeof store.subscribe !== 'function') continue;
            // Subscribe once to capture the synchronous initial emission
            let snapshot: unknown;
            const sub = store.subscribe((val: unknown) => {
              snapshot = val;
            });
            sub.unsubscribe();
            if (snapshot !== undefined) return safeSerialize(snapshot);
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

function safeSerialize(val: unknown): unknown {
  if (val === undefined || val === null) return val;
  try {
    return JSON.parse(JSON.stringify(val));
  } catch {
    return String(val);
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

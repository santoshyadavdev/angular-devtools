// Collectors shared by the overlays. Each reads Angular's debug API through a
// HostAdapter, so the DOM overlay and the NativeScript overlay differ only in
// how a host is named and how its children are listed.

/** The subset of the `ng` global the overlays read. */
export interface AngularDebugApi<H = unknown> {
  getComponent(host: H): unknown;
  getInjector?(host: H): unknown;
  getRootComponents?(hostOrDirective: unknown): unknown[];
  getHostElement?(componentOrDirective: unknown): H | null;
  ɵgetSignalGraph?(injector: unknown): RawSignalGraph | null | undefined;
  ɵgetInjectorMetadata?(injector: unknown): InjectorMetadata | null | undefined;
  ɵgetInjectorProviders?(injector: unknown): RawProvider[] | null | undefined;
  ɵgetInjectorResolutionPath?(injector: unknown): unknown[] | null | undefined;
}

interface RawSignalGraph {
  nodes: {
    id: string;
    kind?: string;
    label?: string;
    epoch?: number;
    value?: unknown;
    watched?: boolean;
  }[];
  edges?: { consumer: number; producer: number }[];
}

interface InjectorMetadata {
  type?: string;
  source?: unknown;
}

interface RawProvider {
  token?: unknown;
  isViewProvider?: boolean;
  useClass?: unknown;
  useValue?: unknown;
  useFactory?: unknown;
  useExisting?: unknown;
}

/** How a platform exposes the tree Angular rendered into. */
export interface HostAdapter<H> {
  /** Direct children, in render order. */
  children(host: H): H[];
  /** An id that stays the same for a host from one collection to the next. */
  id(host: H): string;
  /** What the host is: a tag name, or a native view type. */
  tagName(host: H): string;
  /** The selector of the component rendered on the host. */
  selector(host: H, component: unknown): string;
}

export interface ComponentTreeNode {
  id: string;
  selector: string;
  tagName: string;
  children: ComponentTreeNode[];
  inputs?: Record<string, unknown>;
}

export interface CollectedSignalGraph {
  nodes: {
    id: string;
    kind: string;
    label?: string;
    epoch: number;
    value: unknown;
    watched: boolean;
  }[];
  edges: { consumer: number; producer: number }[];
  componentSelector: string;
}

export interface CollectedProvider {
  token: string;
  type: string;
  isViewProvider: boolean;
}

export interface CollectedInjector {
  injector: { id: string; type: string; name: string; providerCount: number };
  providers: CollectedProvider[];
  children: CollectedInjector[];
}

/** The component on a host, or null when there is none or the host is not Angular's. */
export function componentOf<H>(ng: AngularDebugApi<H>, host: H): unknown {
  try {
    return ng.getComponent(host) ?? null;
  } catch {
    return null;
  }
}

/**
 * Append the component subtree under `host` to `out`. A host without a
 * component contributes nothing itself, so components nested in plain
 * wrapper elements or layouts still end up under their nearest component.
 */
export function walkComponentTree<H>(
  host: H,
  out: ComponentTreeNode[],
  ng: AngularDebugApi<H>,
  adapter: HostAdapter<H>,
) {
  const component = componentOf(ng, host);
  if (component) {
    const node: ComponentTreeNode = {
      id: adapter.id(host),
      selector: adapter.selector(host, component),
      tagName: adapter.tagName(host),
      children: [],
      inputs: tryGetInputs(component),
    };
    for (const child of adapter.children(host)) {
      walkComponentTree(child, node.children, ng, adapter);
    }
    out.push(node);
  } else {
    for (const child of adapter.children(host)) {
      walkComponentTree(child, out, ng, adapter);
    }
  }
}

/** Every host under `host` that carries a component, parents before children. */
export function componentHosts<H>(
  host: H,
  ng: AngularDebugApi<H>,
  adapter: HostAdapter<H>,
  out: H[] = [],
): H[] {
  if (componentOf(ng, host)) out.push(host);
  for (const child of adapter.children(host)) componentHosts(child, ng, adapter, out);
  return out;
}

export function isSignal(val: unknown): val is () => unknown {
  if (typeof val !== 'function') return false;
  if (val.name === 'signalValueFn') return true;
  const symbols = Object.getOwnPropertySymbols(val);
  return symbols.some((s) => s.description === 'SIGNAL' || s.toString().includes('SIGNAL'));
}

export function tryGetInputs(component: unknown): Record<string, unknown> | undefined {
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

export function serializeValue(val: unknown): unknown {
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

export function safeSerialize(val: unknown): unknown {
  if (val === undefined || val === null) return val;
  try {
    return JSON.parse(JSON.stringify(val));
  } catch {
    return String(val);
  }
}

// --- Signal graph ---

/** The signal graph reachable from the component on `host`. */
export function signalGraphFor<H>(
  ng: AngularDebugApi<H>,
  host: H,
  adapter: HostAdapter<H>,
): CollectedSignalGraph | null {
  if (!ng.ɵgetSignalGraph || !ng.getInjector) return null;
  try {
    const injector = ng.getInjector(host);
    if (!injector) return null;
    const raw = ng.ɵgetSignalGraph(injector);
    if (!raw) return null;
    return {
      nodes: raw.nodes.map((n) => ({
        id: n.id,
        kind: n.kind ?? 'unknown',
        label: n.label,
        epoch: n.epoch ?? 0,
        value: serializeValue(n.value),
        watched: n.watched ?? false,
      })),
      edges: raw.edges ?? [],
      componentSelector: adapter.selector(host, componentOf(ng, host)),
    };
  } catch {
    return null;
  }
}

/**
 * One graph out of several. Angular gives every signal node an id that is
 * stable across calls, so a node two components both depend on appears once,
 * while edges, which index into each graph's own node list, are renumbered.
 */
export function mergeSignalGraphs(graphs: CollectedSignalGraph[]): CollectedSignalGraph | null {
  if (graphs.length === 0) return null;
  if (graphs.length === 1) return graphs[0];

  const nodes: CollectedSignalGraph['nodes'] = [];
  const indexOf = new Map<string, number>();
  const edges: CollectedSignalGraph['edges'] = [];
  const seenEdges = new Set<string>();
  const selectors: string[] = [];

  for (const graph of graphs) {
    const local: number[] = [];
    for (const node of graph.nodes) {
      let index = indexOf.get(node.id);
      if (index === undefined) {
        index = nodes.length;
        nodes.push(node);
        indexOf.set(node.id, index);
      }
      local.push(index);
    }
    for (const edge of graph.edges) {
      const consumer = local[edge.consumer];
      const producer = local[edge.producer];
      if (consumer === undefined || producer === undefined) continue;
      const key = `${consumer}>${producer}`;
      if (seenEdges.has(key)) continue;
      seenEdges.add(key);
      edges.push({ consumer, producer });
    }
    if (!selectors.includes(graph.componentSelector)) selectors.push(graph.componentSelector);
  }

  return { nodes, edges, componentSelector: selectors.join(', ') };
}

// --- DI injector tree ---

/**
 * The injector on `host` with the injectors of the hosts below it. `visited`
 * holds hosts, not injectors, and is shared across roots: `getInjector` makes
 * a new object on every call, so a host reached from two roots is what has to
 * be recognised.
 */
export function injectorTreeFor<H>(
  ng: AngularDebugApi<H>,
  host: H,
  adapter: HostAdapter<H>,
  visited: WeakSet<object>,
): CollectedInjector | null {
  if (!ng.getInjector || !ng.ɵgetInjectorMetadata) return null;
  const key = host as unknown as object;
  if (visited.has(key)) return null;
  visited.add(key);
  try {
    const injector = ng.getInjector(host);
    if (!injector || typeof injector !== 'object') return null;
    return injectorNode(ng, injector, host, adapter, visited);
  } catch {
    return null;
  }
}

/**
 * `injectorTreeFor`, with the environment injectors the host resolves through
 * placed above it, outermost first: the platform, then the application. That
 * is where root providers live, so a tree without them shows no services.
 */
export function injectorTreeWithEnvironment<H>(
  ng: AngularDebugApi<H>,
  host: H,
  adapter: HostAdapter<H>,
  visited: WeakSet<object>,
): CollectedInjector | null {
  let node = injectorTreeFor(ng, host, adapter, visited);
  if (!node || !ng.ɵgetInjectorResolutionPath || !ng.getInjector) return node;

  let path: unknown[];
  try {
    path = ng.ɵgetInjectorResolutionPath(ng.getInjector(host)) ?? [];
  } catch {
    return node;
  }
  // The path runs from the host outwards, so each environment injector wraps
  // what was built so far.
  for (const injector of path) {
    if (!injector || typeof injector !== 'object' || visited.has(injector)) continue;
    let metadata: InjectorMetadata | null | undefined;
    try {
      metadata = ng.ɵgetInjectorMetadata?.(injector);
    } catch {
      continue;
    }
    if (metadata?.type !== 'environment') continue;
    visited.add(injector);
    const providers = injectorProviders(ng, injector);
    const source = metadata.source as { toString?: () => string } | null | undefined;
    node = {
      injector: {
        id: environmentId(injector),
        type: 'environment',
        name: source?.toString?.() ?? 'Environment',
        providerCount: providers.length,
      },
      providers,
      children: [node],
    };
  }
  return node;
}

const environmentIds = new WeakMap<object, string>();
let environmentCounter = 0;
function environmentId(injector: object): string {
  let id = environmentIds.get(injector);
  if (!id) {
    id = `inj-env-${++environmentCounter}`;
    environmentIds.set(injector, id);
  }
  return id;
}

function injectorNode<H>(
  ng: AngularDebugApi<H>,
  injector: object,
  host: H,
  adapter: HostAdapter<H>,
  visited: WeakSet<object>,
): CollectedInjector | null {
  try {
    const metadata = ng.ɵgetInjectorMetadata?.(injector);
    if (!metadata) return null;

    const providers = injectorProviders(ng, injector);
    const children: CollectedInjector[] = [];
    childInjectorNodes(ng, host, adapter, visited, children);

    const source = metadata.source as { toString?: () => string } | null | undefined;
    return {
      injector: {
        id: `inj-${adapter.id(host)}`,
        type: metadata.type ?? 'unknown',
        name:
          metadata.type === 'element'
            ? adapter.selector(host, componentOf(ng, host))
            : (source?.toString?.() ?? 'Environment'),
        providerCount: providers.length,
      },
      providers,
      children,
    };
  } catch {
    return null;
  }
}

/**
 * Append the nearest injectors below `host` to `out`. A host that brings no
 * injector of its own, such as a frame or page a router outlet created outside
 * the renderer, is looked through, so the components inside it are still found.
 */
function childInjectorNodes<H>(
  ng: AngularDebugApi<H>,
  host: H,
  adapter: HostAdapter<H>,
  visited: WeakSet<object>,
  out: CollectedInjector[],
) {
  for (const child of adapter.children(host)) {
    const key = child as unknown as object;
    if (visited.has(key)) continue;
    visited.add(key);
    let injector: unknown = null;
    try {
      injector = ng.getInjector?.(child);
    } catch {
      // not Angular's
    }
    if (
      injector &&
      typeof injector === 'object' &&
      ng.ɵgetInjectorMetadata?.(injector)?.type !== 'null'
    ) {
      const node = injectorNode(ng, injector, child, adapter, visited);
      if (node) out.push(node);
    } else {
      childInjectorNodes(ng, child, adapter, visited, out);
    }
  }
}

export function injectorProviders<H>(
  ng: AngularDebugApi<H>,
  injector: unknown,
): CollectedProvider[] {
  if (!ng.ɵgetInjectorProviders) return [];
  try {
    const raw = ng.ɵgetInjectorProviders(injector) ?? [];
    return raw.map((p) => ({
      token: tokenName(p.token),
      type: inferProviderType(p),
      isViewProvider: p.isViewProvider ?? false,
    }));
  } catch {
    return [];
  }
}

function tokenName(token: unknown): string {
  const named = token as { name?: unknown; toString?: () => string } | null | undefined;
  if (typeof named?.name === 'string') return named.name;
  return named?.toString?.() ?? 'unknown';
}

function inferProviderType(p: RawProvider): string {
  if (p.useClass) return 'class';
  if (p.useValue !== undefined) return 'value';
  if (p.useFactory) return 'factory';
  if (p.useExisting) return 'existing';
  return 'class';
}

// --- NgRx store ---

/**
 * The current NgRx store state, read through the first host whose injector
 * provides `Store`, or undefined when no host does.
 */
export function ngrxStoreStateFrom<H>(ng: AngularDebugApi<H>, hosts: H[]): unknown {
  if (!ng.getInjector || !ng.ɵgetInjectorProviders) return undefined;

  for (const host of hosts) {
    try {
      const injector = ng.getInjector(host) as { get?: (token: unknown) => unknown } | null;
      if (!injector?.get) continue;

      for (const p of ng.ɵgetInjectorProviders(injector) ?? []) {
        if (!p.token || tokenName(p.token) !== 'Store') continue;
        try {
          const store = injector.get(p.token) as {
            subscribe?: (next: (value: unknown) => void) => { unsubscribe(): void };
          } | null;
          if (typeof store?.subscribe !== 'function') continue;
          // The store replays its current state synchronously to a new subscriber.
          let snapshot: unknown;
          const sub = store.subscribe((val) => {
            snapshot = val;
          });
          sub.unsubscribe();
          if (snapshot !== undefined) return safeSerialize(snapshot);
        } catch {
          // not resolvable at this injector level
        }
      }
    } catch {
      // skip
    }
  }
  return undefined;
}

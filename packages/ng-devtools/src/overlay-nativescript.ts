// The overlay for a NativeScript Angular app. It reports the same live data as
// the browser overlay, over the app's network connection to a devtools server
// running on the developer's machine.
//
// Call `initNativeScriptOverlay()` before `runNativeScriptAngularApp()`, and
// give the runtime a `WebSocket` global first (for example by importing
// `@valor/nativescript-websockets` in `polyfills.ts`).
//
// The app's own TypeScript compiles this file and the views module, and a
// relative import that names a `.ts` extension is an error there unless the
// app's tsconfig opts in, so these two files import without one.

import { Application, isAndroid } from '@nativescript/core';
import { connectDevframe } from 'devframe/client';
import {
  componentOf,
  injectorTreeWithEnvironment,
  mergeSignalGraphs,
  ngrxStoreStateFrom,
  signalGraphFor,
  type AngularDebugApi,
  type CollectedInjector,
  type CollectedSignalGraph,
} from './overlay-core';
import {
  collectNativeScriptTree,
  nativeScriptComponentHosts,
  nativeScriptRoot,
  nativeViewAdapter,
  renderedView,
  type NativeView,
} from './overlay-nativescript-views';

export interface NativeScriptOverlayOptions {
  /** Absolute URL of the devtools server. Defaults to `defaultDevtoolsBaseURL()`. */
  baseURL?: string;
  /** How often the app reports, in milliseconds. */
  intervalMs?: number;
  /** How long to wait before trying the server again after a failure, in milliseconds. */
  retryMs?: number;
}

/**
 * Where a simulator or emulator finds a devtools server on the machine that
 * runs it. A physical device needs the machine's LAN address instead.
 */
export function defaultDevtoolsBaseURL(port = 9999): string {
  // The Android emulator reaches its host at 10.0.2.2; the iOS simulator shares
  // the host's loopback interface.
  return `http://${isAndroid ? '10.0.2.2' : 'localhost'}:${port}/`;
}

export function initNativeScriptOverlay(options: NativeScriptOverlayOptions = {}): () => void {
  const baseURL = options.baseURL ?? defaultDevtoolsBaseURL();
  gateInjectorProfiler();
  installWebShims(baseURL);

  if (typeof WebSocket === 'undefined') {
    console.warn(
      '[ng-devtools] No WebSocket global. Import @valor/nativescript-websockets in polyfills.ts before starting the overlay.',
    );
    return () => {};
  }
  ensureWebSocketStates();

  // The server and the app restart independently of each other, and the
  // devframe client has no reconnect of its own, so a session that fails or
  // drops is replaced after a pause for as long as the overlay is alive.
  const intervalMs = options.intervalMs ?? 3000;
  const retryMs = options.retryMs ?? 5000;
  let disposed = false;
  let session: (() => void) | undefined;
  let retry: ReturnType<typeof setTimeout> | undefined;
  let unreachable = false;

  const again = () => {
    session?.();
    session = undefined;
    if (disposed || retry) return;
    retry = setTimeout(() => {
      retry = undefined;
      start();
    }, retryMs);
  };
  const start = () => {
    connect(baseURL, intervalMs, again).then(
      (dispose) => {
        if (disposed) {
          dispose();
          return;
        }
        session = dispose;
        unreachable = false;
        console.log(`[ng-devtools] Connected to the devtools server at ${baseURL}`);
      },
      () => {
        if (!unreachable) {
          console.warn(
            `[ng-devtools] Could not reach the devtools server at ${baseURL}; retrying every ${retryMs}ms.`,
          );
        }
        unreachable = true;
        again();
      },
    );
  };
  start();

  return () => {
    disposed = true;
    clearTimeout(retry);
    session?.();
    session = undefined;
  };
}

async function connect(baseURL: string, intervalMs: number, onDisconnected: () => void) {
  // SSE is out: the NativeScript fetch has no streaming body.
  // Closing the socket on purpose also fires the close event.
  let closing = false;
  const rpc = await connectDevframe({
    baseURL,
    transport: 'websocket',
    simpleAuth: false,
    otpParam: false,
    webmcp: false,
    wsOptions: {
      onDisconnected: () => {
        if (!closing) onDisconnected();
      },
    },
  });
  const my = rpc.scope('ng-devtools');
  let hosts: NativeView[] = [];

  async function report() {
    const ng = angularDebugApi();
    const rootView = Application.getRootView() as NativeView | undefined;
    if (!ng || !rootView) return;

    const root = nativeScriptRoot(ng, rootView);
    hosts = nativeScriptComponentHosts(root, ng);
    await my.rpc.call('push-component-tree', collectNativeScriptTree(root, ng));

    const graphs = hosts
      .map((host) => signalGraphFor(ng, host, nativeViewAdapter))
      .filter((graph): graph is CollectedSignalGraph => graph !== null);
    const graph = mergeSignalGraphs(graphs);
    if (graph) await my.rpc.call('push-signal-graph', graph);

    const visited = new WeakSet<object>();
    const injectors = hosts
      .map((host) => injectorTreeWithEnvironment(ng, host, nativeViewAdapter, visited))
      .filter((node): node is CollectedInjector => node !== null);
    if (injectors.length) await my.rpc.call('push-injector-tree', injectors);

    const state = ngrxStoreStateFrom(ng, hosts);
    if (state !== undefined) {
      await my.rpc.call('push-ngrx-state', { state, actions: [], connected: true });
    }
  }

  const tick = () => {
    if (rpc.status !== 'connected' && rpc.status !== 'connecting') return;
    report().catch((error) => console.warn('[ng-devtools] report failed', error));
  };
  tick();
  const interval = setInterval(tick, intervalMs);

  my.rpc.register({
    name: 'highlight-in-page',
    type: 'event',
    jsonSerializable: true,
    handler: (selector: string) => {
      const ng = angularDebugApi();
      if (!ng) return;
      for (const host of hosts) {
        if (nativeViewAdapter.selector(host, componentOf(ng, host)) === selector) {
          flash(renderedView(host));
        }
      }
    },
  });

  return () => {
    closing = true;
    clearInterval(interval);
    rpc.close();
  };
}

function angularDebugApi(): AngularDebugApi<NativeView> | undefined {
  const ng = (globalThis as { ng?: AngularDebugApi<NativeView> }).ng;
  return typeof ng?.getComponent === 'function' ? ng : undefined;
}

const flashing = new WeakMap<
  NativeView,
  { borderWidth: unknown; borderColor: unknown; timer: ReturnType<typeof setTimeout> }
>();

/** Outline a view for two seconds, keeping the border it had for when that ends. */
function flash(view: NativeView) {
  const active = flashing.get(view);
  if (active) clearTimeout(active.timer);
  const { borderWidth, borderColor } = active ?? view;
  view.borderWidth = 2;
  view.borderColor = '#68b6ff';
  const timer = setTimeout(() => {
    flashing.delete(view);
    view.borderWidth = borderWidth;
    view.borderColor = borderColor;
  }, 2000);
  flashing.set(view, { borderWidth, borderColor, timer });
}

/**
 * Angular wires its injector profiler, which backs the provider lists the DI
 * inspector shows, only when `window` exists as the platform is created, so a
 * `window` is defined here and removed once the profiler is in place. The
 * moment is read off the `ng` global: core publishes `getComponent` right
 * after wiring the profiler, and `getComponent` is the sentinel rather than
 * the `ng` object itself because the router publishes its own utilities onto
 * that object earlier, while `provideRouter()` evaluates.
 */
function gateInjectorProfiler() {
  const g = globalThis as Record<string, unknown>;
  if ('window' in g || 'ng' in g) return;
  Object.defineProperty(g, 'window', { configurable: true, get: () => g });
  const removeWindow = () => {
    if (Object.getOwnPropertyDescriptor(g, 'window')?.get) delete g['window'];
  };
  Object.defineProperty(g, 'ng', {
    configurable: true,
    enumerable: true,
    get: () => undefined,
    set(value: unknown) {
      Object.defineProperty(g, 'ng', {
        configurable: true,
        enumerable: true,
        writable: true,
        value,
      });
      if (!value || typeof value !== 'object') {
        removeWindow();
        return;
      }
      Object.defineProperty(value, 'getComponent', {
        configurable: true,
        enumerable: true,
        get: () => undefined,
        set(fn: unknown) {
          Object.defineProperty(value, 'getComponent', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: fn,
          });
          removeWindow();
        },
      });
    },
  });
}

/**
 * `devframe/client` reads `location` and `navigator` as bare globals when it
 * resolves the socket URL and identifies the client. A NativeScript runtime has
 * neither, so the server's address stands in for the page's.
 */
function installWebShims(baseURL: string) {
  const g = globalThis as Record<string, unknown>;
  if (typeof g['location'] === 'undefined') {
    const url = new URL(baseURL);
    g['location'] = {
      href: url.href,
      origin: url.origin,
      protocol: url.protocol,
      host: url.host,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: '',
      hash: '',
    };
  }
  if (typeof g['navigator'] === 'undefined') {
    g['navigator'] = { userAgent: `NativeScript/${isAndroid ? 'android' : 'ios'}` };
  }
}

/**
 * The transport compares `readyState` with the constants on the `WebSocket`
 * constructor, which a polyfill may only define on its instances.
 */
function ensureWebSocketStates() {
  const states = WebSocket as unknown as Record<string, number>;
  states['CONNECTING'] ??= 0;
  states['OPEN'] ??= 1;
  states['CLOSING'] ??= 2;
  states['CLOSED'] ??= 3;
}

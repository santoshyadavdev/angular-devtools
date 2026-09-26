import {
  MAX_DEPTH,
  clip,
  componentName,
  keyName,
  nameOf,
  noteErrorHandler,
  noteFailedCall,
  noteRun,
  noteWarning,
  read,
  redactMessage,
  redactUrl,
  resolveKeys,
  serializeRoute,
  setCaller,
  type ActiveRoute,
  type AnyRecord,
  type NavigationRecord,
} from './router.ts';

export interface PreloadRecord {
  path: string;
  startedAt: number;
  ms?: number;
  failed?: boolean;
}

export type RouterAction =
  | {
      action: 'navigate';
      url?: string;
      pattern?: string;
      params?: Record<string, string>;
      extras?: { replaceUrl?: boolean; skipLocationChange?: boolean };
      waitFor?: 'navigation' | 'stable';
    }
  | { action: 'abort' }
  | { action: 'replay'; id: number }
  | { action: 'probe'; url: string }
  | { action: 'instrument'; on: boolean }
  | { action: 'resolve-lazy'; id: string };

const GUARD_KINDS = ['canActivate', 'canActivateChild', 'canDeactivate', 'canMatch', 'canLoad'];
const GUARD_METHODS: Record<string, string> = {
  canActivate: 'canActivate',
  canActivateChild: 'canActivateChild',
  canDeactivate: 'canDeactivate',
  canMatch: 'canMatch',
  canLoad: 'canLoad',
};
const WAIT_MS = 10_000;

function stackCaller(): string | undefined {
  const stack = read(() => new Error().stack ?? '', '');
  const frames = stack
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^at |@/.test(line))
    .slice(2)
    .filter((line) => !/@angular|node_modules|zone\.js|rxjs/i.test(line));
  const frame = frames[0];
  if (!frame) return undefined;
  const match = frame.match(/^at\s+([^\s(]+)/) ?? frame.match(/^([^@]+)@/);
  return match ? match[1] : clip(frame, 80);
}

function describeElement(element: Element): string {
  const text = clip((element.textContent ?? '').replace(/\s+/g, ' ').trim(), 40);
  return `${element.tagName.toLowerCase()}${text ? ` "${text}"` : ''}`;
}

/**
 * Records who starts each navigation (a RouterLink click, or the code that
 * called navigate/navigateByUrl) and keeps calls that throw before a
 * navigation starts as failed records. Returns the uninstall function.
 */
export function captureCallers(router: AnyRecord, navigations: NavigationRecord[]): () => void {
  const originals: Record<string, AnyRecord> = {};
  let fromClick = false;
  let depth = 0;
  for (const method of ['navigate', 'navigateByUrl']) {
    const original = read(() => router[method] as AnyRecord, null);
    if (typeof original !== 'function') continue;
    originals[method] = original;
    router[method] = function (this: unknown, ...args: unknown[]) {
      if (!fromClick && depth === 0) {
        const caller = stackCaller();
        setCaller(`${method}()${caller ? ` from ${caller}` : ''}`);
      }
      fromClick = false;
      depth++;
      try {
        return (original as unknown as (...a: unknown[]) => unknown).apply(this, args);
      } catch (error) {
        const target = read(
          () => (typeof args[0] === 'string' ? args[0] : JSON.stringify(args[0])) ?? '',
          '',
        );
        noteFailedCall(navigations, target, error, Date.now());
        throw error;
      } finally {
        depth--;
      }
    };
  }
  const onClick = (event: Event) => {
    const target = event.target as Element | null;
    const link = target?.closest?.('a, button, [routerlink], [routerLink]');
    if (!link) return;
    fromClick = true;
    setCaller(`RouterLink ${describeElement(link)}`, true);
    queueMicrotask(() => {
      setTimeout(() => (fromClick = false));
    });
  };
  if (typeof document !== 'undefined') document.addEventListener('click', onClick, true);
  return () => {
    for (const [method, original] of Object.entries(originals)) router[method] = original;
    if (typeof document !== 'undefined') document.removeEventListener('click', onClick, true);
  };
}

/**
 * Keeps what the navigation error handler did with a failed navigation, and
 * router warnings logged during a navigation.
 */
export function captureDiagnostics(router: AnyRecord, navigations: NavigationRecord[]): () => void {
  const transitions = read(() => router['navigationTransitions'] as AnyRecord, null);
  const handler = read(() => transitions?.['navigationErrorHandler'] as AnyRecord, null);
  if (transitions && typeof handler === 'function') {
    transitions['navigationErrorHandler'] = function (this: unknown, error: unknown) {
      const result = (handler as unknown as (e: unknown) => unknown).call(this, error);
      const redirect = read(() => (result as AnyRecord)?.['redirectTo'], undefined);
      noteErrorHandler(
        navigations,
        redirect
          ? `error handler redirected to ${read(() => String(router['serializeUrl'](redirect)), '?')}`
          : `error handler returned ${result === undefined ? 'nothing (error rethrown to the navigation promise)' : typeof result}`,
      );
      return result;
    };
  }
  const logger = read(() => router['console'] as AnyRecord, null);
  const warn = read(() => logger?.['warn'] as AnyRecord, null);
  if (logger && typeof warn === 'function') {
    logger['warn'] = function (this: unknown, message: unknown, ...rest: unknown[]) {
      noteWarning(navigations, String(message));
      return (warn as unknown as (...a: unknown[]) => unknown).call(this, message, ...rest);
    };
  }
  return () => {
    if (transitions && handler) transitions['navigationErrorHandler'] = handler;
    if (logger && warn) logger['warn'] = warn;
  };
}

/**
 * Wraps the preloading strategy so preloads are recorded, including the ones
 * that run between navigations.
 */
export function capturePreloads(
  preloader: AnyRecord | null,
  preloads: PreloadRecord[],
  onChange: () => void,
): () => void {
  const strategy = read(() => preloader?.['preloadingStrategy'] as AnyRecord, null);
  const preload = read(() => strategy?.['preload'] as AnyRecord, null);
  if (!strategy || typeof preload !== 'function') return () => {};
  strategy['preload'] = function (this: unknown, route: AnyRecord, load: () => AnyRecord) {
    const wrapped = () => {
      const record: PreloadRecord = {
        path: read(() => String(route?.['path'] ?? ''), '') || '(root)',
        startedAt: Date.now(),
      };
      preloads.push(record);
      if (preloads.length > 50) preloads.splice(0, preloads.length - 50);
      const started = performance.now();
      const result = load();
      const done = (failed: boolean) => {
        record.ms = Math.round(performance.now() - started);
        if (failed) record.failed = true;
        onChange();
      };
      return read(
        () =>
          typeof (result as AnyRecord)?.['subscribe'] === 'function'
            ? observe(
                result,
                () => done(false),
                () => done(true),
              )
            : result,
        result,
      );
    };
    return (preload as unknown as (r: unknown, l: unknown) => unknown).call(this, route, wrapped);
  };
  return () => {
    strategy['preload'] = preload;
  };
}

function sameKind(
  source: AnyRecord,
  subscribe: (observer: AnyRecord) => { unsubscribe(): void },
): AnyRecord {
  const Ctor = read(() => source['constructor'] as new (fn: unknown) => AnyRecord, null);
  if (typeof Ctor === 'function' && typeof source['pipe'] === 'function') {
    return new Ctor((subscriber: AnyRecord) => {
      const subscription = subscribe(subscriber);
      return () => subscription.unsubscribe();
    });
  }
  const interop: AnyRecord = { subscribe };
  const symbol =
    (typeof Symbol === 'function' && (Symbol as AnyRecord)['observable']) || '@@observable';
  interop[symbol] = () => interop;
  return interop;
}

function observe(source: AnyRecord, onComplete: () => void, onError: () => void): AnyRecord {
  return sameKind(source, (observer) =>
    source['subscribe']({
      next: (value: unknown) => observer['next']?.(value),
      error: (error: unknown) => {
        onError();
        observer['error']?.(error);
      },
      complete: () => {
        onComplete();
        observer['complete']?.();
      },
    }),
  );
}

function describeResult(result: unknown, router: AnyRecord): string {
  if (result === true) return 'true';
  if (result === false) return 'false';
  const redirect = read(() => (result as AnyRecord)?.['redirectTo'], undefined);
  if (redirect)
    return `RedirectCommand to ${read(() => String(router['serializeUrl'](redirect)), '?')}`;
  if (
    read(
      () =>
        typeof (result as AnyRecord)?.['toString'] === 'function' &&
        'root' in (result as AnyRecord),
      false,
    )
  ) {
    return `UrlTree ${read(() => String(router['serializeUrl'](result)), '?')}`;
  }
  return result === undefined ? 'undefined' : typeof result;
}

function track(result: unknown, record: (value: unknown, threw?: unknown) => void): unknown {
  if (result && typeof (result as AnyRecord)['then'] === 'function') {
    return (result as Promise<unknown>).then(
      (value) => {
        record(value);
        return value;
      },
      (error) => {
        record(undefined, error);
        throw error;
      },
    );
  }
  if (result && typeof (result as AnyRecord)['subscribe'] === 'function') {
    let last: unknown;
    const source = result as AnyRecord;
    return sameKind(source, (observer) =>
      source['subscribe']({
        next: (value: unknown) => {
          last = value;
          observer['next']?.(value);
        },
        error: (error: unknown) => {
          record(undefined, error);
          observer['error']?.(error);
        },
        complete: () => {
          record(last);
          observer['complete']?.();
        },
      }),
    );
  }
  record(result);
  return result;
}

const WRAPPED = '__ngDevtoolsOriginal';

interface Wrapping {
  restore: (() => void)[];
}

function wrapFunction(
  original: AnyRecord,
  label: { guard: string; kind: string; route: string },
  router: AnyRecord,
  navigations: NavigationRecord[],
): AnyRecord {
  const wrapped = function (this: unknown, ...args: unknown[]) {
    const started = performance.now();
    const record = (value: unknown, threw?: unknown) =>
      noteRun(navigations, {
        ...label,
        result: threw
          ? `threw ${redactMessage(String((threw as AnyRecord)?.['message'] ?? threw))}`
          : describeResult(value, router),
        ms: Math.round(performance.now() - started),
      });
    try {
      return track((original as unknown as (...a: unknown[]) => unknown).apply(this, args), record);
    } catch (error) {
      record(undefined, error);
      throw error;
    }
  };
  (wrapped as AnyRecord)[WRAPPED] = original;
  Object.defineProperty(wrapped, 'name', { value: nameOf(original) });
  return wrapped as unknown as AnyRecord;
}

function isClass(entry: unknown, method: string): boolean {
  return read(() => typeof (entry as AnyRecord)['prototype']?.[method] === 'function', false);
}

function instrumentRoutes(
  routes: AnyRecord[],
  parent: string,
  router: AnyRecord,
  navigations: NavigationRecord[],
  wrapping: Wrapping,
  depth: number,
) {
  if (!Array.isArray(routes) || depth > MAX_DEPTH) return;
  for (const route of routes) {
    const path = `${parent}/${read(() => String(route['path'] ?? ''), '')}`.replace(/\/+/g, '/');
    for (const kind of GUARD_KINDS) {
      const list = read(() => route[kind] as unknown[], null);
      if (!Array.isArray(list)) continue;
      list.forEach((entry, index) => {
        const method = GUARD_METHODS[kind];
        if (isClass(entry, method)) {
          const proto = (entry as AnyRecord)['prototype'];
          const original = proto[method];
          if (original[WRAPPED]) return;
          proto[method] = wrapFunction(
            original,
            { guard: nameOf(entry), kind, route: path },
            router,
            navigations,
          );
          wrapping.restore.push(() => (proto[method] = original));
        } else if (typeof entry === 'function' && !(entry as AnyRecord)[WRAPPED]) {
          const label =
            nameOf(entry) === 'anonymous function' ? `${kind}[${index}]` : nameOf(entry);
          list[index] = wrapFunction(
            entry as AnyRecord,
            { guard: label, kind, route: path },
            router,
            navigations,
          );
          wrapping.restore.push(() => (list[index] = entry));
        }
      });
    }
    const resolve = read(() => route['resolve'] as AnyRecord, null);
    for (const key of resolveKeys(resolve)) {
      const entry = (resolve as AnyRecord)[key as string];
      const label = { guard: `${keyName(key)}: ${nameOf(entry)}`, kind: 'resolve', route: path };
      if (isClass(entry, 'resolve')) {
        const proto = entry['prototype'];
        const original = proto['resolve'];
        if (original[WRAPPED]) continue;
        proto['resolve'] = wrapFunction(original, label, router, navigations);
        wrapping.restore.push(() => (proto['resolve'] = original));
      } else if (typeof entry === 'function' && !entry[WRAPPED]) {
        (resolve as AnyRecord)[key as string] = wrapFunction(entry, label, router, navigations);
        wrapping.restore.push(() => ((resolve as AnyRecord)[key as string] = entry));
      }
    }
    instrumentRoutes(
      read(() => route['children'] as AnyRecord[], []),
      path,
      router,
      navigations,
      wrapping,
      depth + 1,
    );
    instrumentRoutes(
      read(() => route['_loadedRoutes'] as AnyRecord[], []),
      path,
      router,
      navigations,
      wrapping,
      depth + 1,
    );
  }
}

/**
 * Opt-in: wraps every guard and resolver in the live config so each run is
 * recorded with its verdict and time. Call again after the config changes to
 * cover newly loaded routes. The returned function unwraps everything.
 */
export function instrument(router: AnyRecord, navigations: NavigationRecord[]): () => void {
  const wrapping: Wrapping = { restore: [] };
  instrumentRoutes(
    read(() => router['config'] as AnyRecord[], []),
    '',
    router,
    navigations,
    wrapping,
    0,
  );
  return () => {
    for (const restore of wrapping.restore.reverse()) restore();
  };
}

export function isSafeUrl(url: unknown): url is string {
  return (
    typeof url === 'string' &&
    url.startsWith('/') &&
    !url.startsWith('//') &&
    !/^\/*[a-z][a-z0-9+.-]*:/i.test(url) &&
    !url.includes('[redacted]') &&
    url.length <= 2000
  );
}

export function fillPattern(pattern: string, params: Record<string, string> = {}): string | null {
  let missing = false;
  const url = pattern.replace(/:([A-Za-z0-9_]+)/g, (_, name: string) => {
    const value = params[name];
    if (value === undefined || value === '') {
      missing = true;
      return `:${name}`;
    }
    return encodeURIComponent(value);
  });
  return missing ? null : url.startsWith('/') ? url : `/${url}`;
}

function waitForNavigation(
  navigations: NavigationRecord[],
  id: number,
  stable: boolean,
): Promise<NavigationRecord | undefined> {
  return new Promise((resolve) => {
    const started = Date.now();
    const tick = () => {
      const record = navigations.find((n) => n.id === id);
      if (record && record.outcome !== 'pending') {
        if (stable) setTimeout(() => resolve(record), 300);
        else resolve(record);
        return;
      }
      if (Date.now() - started > WAIT_MS) return resolve(record);
      setTimeout(tick, 50);
    };
    tick();
  });
}

function navigationIdOf(router: AnyRecord): number {
  return read(() => Number(router['navigationTransitions']['navigationId']), -1);
}

function summarize(record: NavigationRecord | undefined): Record<string, unknown> {
  if (!record) return { outcome: 'unknown (no navigation recorded within 10s)' };
  return {
    id: record.id,
    outcome: record.outcome,
    url: record.url,
    finalUrl: record.finalUrl,
    code: record.code,
    reason: record.reason,
  };
}

function findConfig(router: AnyRecord, id: string): AnyRecord | null {
  let routes = read(() => router['config'] as AnyRecord[], []);
  let found: AnyRecord | null = null;
  for (const part of id.split('.')) {
    const index = Number(part);
    if (!Number.isInteger(index)) return null;
    found = routes?.[index] ?? null;
    if (!found) return null;
    routes = [
      ...read(() => (found!['children'] as AnyRecord[]) ?? [], []),
      ...read(() => (found!['_loadedRoutes'] as AnyRecord[]) ?? [], []),
    ];
  }
  return found;
}

function probe(router: AnyRecord, navigations: NavigationRecord[], url: string): Promise<unknown> {
  const transitions = read(() => router['navigationTransitions'] as AnyRecord, null);
  const events = read(() => transitions?.['events'] as AnyRecord, null);
  if (!events || typeof router['currentNavigation'] !== 'function') {
    return Promise.resolve({
      error: 'This Angular version cannot abort navigations, so the exact probe is unavailable.',
    });
  }
  if (router['currentNavigation']())
    return Promise.resolve({ error: 'A navigation is in progress; try again when it finishes.' });
  return new Promise((resolve) => {
    let targetId = -1;
    let matched: ActiveRoute | null = null;
    const subscription = events['subscribe']((event: AnyRecord) => {
      if (event['id'] !== targetId) return;
      if (event['type'] === 4) {
        matched = read(() => serializeRoute(event['state']['root']), null);
        read(() => router['currentNavigation']()?.['abort']?.(), undefined);
      }
      if ([1, 2, 3, 16].includes(event['type'])) {
        subscription.unsubscribe();
        const record = navigations.find((n) => n.id === targetId);
        if (record) record.probe = true;
        resolve(
          matched
            ? { matched: true, route: matched }
            : {
                matched: false,
                reason:
                  record?.reason ??
                  read(() => String(event['error']?.['message'] ?? event['reason'] ?? ''), ''),
              },
        );
      }
    });
    setCaller('probe from DevTools', true);
    const promise = read(
      () => router['navigateByUrl'](url, { skipLocationChange: true }) as Promise<unknown>,
      null,
    );
    targetId = navigationIdOf(router);
    promise?.catch?.(() => {});
    setTimeout(() => {
      subscription.unsubscribe();
      resolve({ error: 'The probe did not finish within 10s.' });
    }, WAIT_MS);
  });
}

async function resolveLazy(router: AnyRecord, id: string): Promise<unknown> {
  const route = findConfig(router, id);
  if (!route) return { error: `No route with id ${id}.` };
  if (read(() => !!route['_loadedRoutes'], false)) return { error: 'Already loaded.' };
  const load = read(() => route['loadChildren'] as AnyRecord, null);
  if (typeof load !== 'function') return { error: 'Not a loadChildren route.' };
  const injector = read(() => router['injector'] as AnyRecord, null);
  const run = () => (load as unknown as () => unknown)();
  const result = await Promise.resolve(
    typeof injector?.['runInContext'] === 'function' ? injector['runInContext'](run) : run(),
  );
  const routes = read(() => ((result as AnyRecord)?.['default'] ?? result) as unknown, null);
  if (!Array.isArray(routes))
    return {
      error:
        'loadChildren returned an NgModule; only route arrays can be read without registering them.',
    };
  const list = (routes as AnyRecord[]).map((child) => ({
    path: read(() => String(child['path'] ?? ''), ''),
    component: read(
      () => (child['component'] ? componentName(child['component']) : undefined),
      undefined,
    ),
    redirectTo: read(
      () => (typeof child['redirectTo'] === 'string' ? child['redirectTo'] : undefined),
      undefined,
    ),
    lazy: read(() => !!child['loadChildren'] || !!child['loadComponent'], false),
  }));
  return {
    id,
    routes: list.slice(0, 200),
    note: 'Read without registering: the router will load it again when a navigation needs it.',
  };
}

/**
 * Runs a DevTools-requested router action in the page. Navigation only
 * accepts same-origin relative URLs and never replays redacted ones.
 */
export async function runAction(
  router: AnyRecord,
  navigations: NavigationRecord[],
  request: RouterAction,
  setInstrumented: (on: boolean) => void,
): Promise<unknown> {
  switch (request.action) {
    case 'navigate': {
      const url =
        request.url ?? (request.pattern ? fillPattern(request.pattern, request.params) : null);
      if (!url) return { error: 'Give a url, or a pattern with a value for every :param.' };
      if (!isSafeUrl(url))
        return { error: 'Only same-origin relative URLs starting with "/" can be navigated to.' };
      const extras: AnyRecord = {};
      if (request.extras?.replaceUrl) extras['replaceUrl'] = true;
      if (request.extras?.skipLocationChange) extras['skipLocationChange'] = true;
      setCaller('navigate from DevTools', true);
      const promise = read(() => router['navigateByUrl'](url, extras) as Promise<unknown>, null);
      promise?.catch?.(() => {});
      const id = navigationIdOf(router);
      return summarize(await waitForNavigation(navigations, id, request.waitFor === 'stable'));
    }
    case 'abort': {
      const current = read(() => router['currentNavigation']?.() as AnyRecord, null);
      if (!current) return { error: 'No navigation is in progress.' };
      if (typeof current['abort'] !== 'function')
        return { error: 'This Angular version cannot abort navigations.' };
      current['abort']();
      return { aborted: current['id'] };
    }
    case 'replay': {
      const record = navigations.find((n) => n.id === request.id);
      if (!record) return { error: `No navigation #${request.id} in the recent list.` };
      if (!isSafeUrl(record.url))
        return {
          error: 'This navigation cannot be replayed: its URL is redacted or not relative.',
        };
      const extras: AnyRecord = {};
      if (record.extras?.includes('replaceUrl')) extras['replaceUrl'] = true;
      if (record.extras?.includes('skipLocationChange')) extras['skipLocationChange'] = true;
      setCaller(`replay of #${record.id} from DevTools`, true);
      const promise = read(
        () => router['navigateByUrl'](record.url, extras) as Promise<unknown>,
        null,
      );
      promise?.catch?.(() => {});
      const id = navigationIdOf(router);
      const result = await waitForNavigation(navigations, id, false);
      return {
        original: summarize(record),
        replay: summarize(result),
        same: record.outcome === result?.outcome && record.finalUrl === result?.finalUrl,
      };
    }
    case 'probe':
      if (!isSafeUrl(request.url))
        return { error: 'Only same-origin relative URLs starting with "/" can be probed.' };
      return probe(router, navigations, request.url);
    case 'instrument':
      setInstrumented(!!request.on);
      return { instrumented: !!request.on };
    case 'resolve-lazy':
      return resolveLazy(router, request.id);
    default:
      return { error: 'Unknown action.' };
  }
}

export function isRouterAction(value: unknown): value is RouterAction {
  const action = read(() => (value as AnyRecord)?.['action'] as string, '');
  return ['navigate', 'abort', 'replay', 'probe', 'instrument', 'resolve-lazy'].includes(action);
}

export { redactUrl };

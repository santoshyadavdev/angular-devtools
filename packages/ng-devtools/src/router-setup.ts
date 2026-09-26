import { nameOf, providerOf, read, type AnyRecord, type RouterDebugApi } from './router.ts';

export interface RouterOption {
  name: string;
  value: string;
  set: boolean;
}

export interface RouterSetup {
  mode: 'full' | 'events-only';
  setupKind: 'provideRouter' | 'forRoot or other';
  routers: number;
  angularVersion?: string;
  options: RouterOption[];
  features: Record<string, string>;
  strategies: Record<string, string>;
  baseHref?: string;
  hydrated?: number;
}

const OPTION_DEFAULTS: [string, string][] = [
  ['onSameUrlNavigation', 'ignore'],
  ['paramsInheritanceStrategy', 'always'],
  ['urlUpdateStrategy', 'deferred'],
  ['canceledNavigationResolution', 'replace'],
  ['defaultQueryParamsHandling', 'replace'],
  ['resolveNavigationPromiseOnError', 'false'],
  ['scrollPositionRestoration', 'disabled'],
  ['anchorScrolling', 'disabled'],
  ['initialNavigation', 'enabledNonBlocking'],
];

function strategyName(value: unknown): string {
  return nameOf(value).replace(/^_+/, '') || 'unknown';
}

export function preloaderOf(ng: RouterDebugApi, root: Element | null): AnyRecord | null {
  const injector = root ? read(() => ng.getInjector?.(root), undefined) : undefined;
  if (!injector) return null;
  return providerOf(ng, injector, 'RouterPreloader', (value) =>
    read(() => !!(value as AnyRecord)?.['preloadingStrategy'], false),
  );
}

function scrollerOf(ng: RouterDebugApi, root: Element | null): AnyRecord | null {
  const injector = root ? read(() => ng.getInjector?.(root), undefined) : undefined;
  if (!injector) return null;
  return providerOf(ng, injector, 'RouterScroller', (value) =>
    read(() => !!(value as AnyRecord)?.['options'], false),
  );
}

export function detectSetup(
  ng: RouterDebugApi,
  router: AnyRecord,
  routers: number,
  root: Element | null,
): RouterSetup {
  const options = read(() => (router['options'] as AnyRecord) ?? {}, {});
  const scroller = scrollerOf(ng, root);
  const scrollOptions = read(() => (scroller?.['options'] as AnyRecord) ?? {}, {});
  const transitions = read(() => router['navigationTransitions'] as AnyRecord, null);
  const effective: Record<string, unknown> = {
    ...options,
    onSameUrlNavigation: read(() => router['onSameUrlNavigation'], options['onSameUrlNavigation']),
    paramsInheritanceStrategy: read(
      () => transitions?.['paramsInheritanceStrategy'],
      options['paramsInheritanceStrategy'],
    ),
    urlUpdateStrategy: read(() => router['urlUpdateStrategy'], options['urlUpdateStrategy']),
    scrollPositionRestoration:
      scrollOptions['scrollPositionRestoration'] ?? options['scrollPositionRestoration'],
    anchorScrolling: scrollOptions['anchorScrolling'] ?? options['anchorScrolling'],
  };
  const list: RouterOption[] = OPTION_DEFAULTS.map(([name, fallback]) => {
    const value = effective[name];
    return {
      name,
      value: value === undefined ? fallback : String(value),
      set: options[name] !== undefined,
    };
  });

  const features: Record<string, string> = {};
  features['componentInputBinding'] = read(() => router['componentInputBindingEnabled'], false)
    ? 'on'
    : 'off';
  features['viewTransitions'] = read(() => !!transitions?.['createViewTransition'], false)
    ? 'on'
    : 'off';
  features['navigationErrorHandler'] = read(() => !!transitions?.['navigationErrorHandler'], false)
    ? 'on'
    : 'off';
  features['routerResources'] = read(() => !!transitions?.['routerResourcesFeature'], false)
    ? 'on'
    : 'off';
  features['injectorCleanup'] = read(() => !!router['injectorCleanup'], false) ? 'on' : 'off';
  const preloader = preloaderOf(ng, root);
  features['preloading'] = preloader
    ? strategyName(read(() => preloader['preloadingStrategy'], null))
    : 'off';
  features['scroller'] = scroller ? 'on' : 'off';
  features['debugTracing'] = read(() => !!options['enableTracing'], false) ? 'on' : 'off';

  const strategies: Record<string, string> = {
    locationStrategy: strategyName(read(() => router['location']['_locationStrategy'], null)),
    titleStrategy: strategyName(read(() => transitions?.['titleStrategy'], null)),
    routeReuseStrategy: strategyName(read(() => router['routeReuseStrategy'], null)),
    urlHandlingStrategy: strategyName(read(() => router['urlHandlingStrategy'], null)),
    urlSerializer: strategyName(read(() => router['urlSerializer'], null)),
  };
  if (/Ionic/i.test(strategies['routeReuseStrategy'])) features['ionic'] = 'detected';

  const setup: RouterSetup = {
    mode: 'full',
    setupKind:
      typeof (globalThis as AnyRecord)['ng']?.['ɵgetRouterInstance'] === 'function'
        ? 'provideRouter'
        : 'forRoot or other',
    routers,
    options: list,
    features,
    strategies,
  };
  const version = read(
    () => document.querySelector('[ng-version]')?.getAttribute('ng-version') ?? undefined,
    undefined,
  );
  if (version) setup.angularVersion = version;
  const external = read(() => String(router['location']['prepareExternalUrl']('/')), '');
  if (external) setup.baseHref = external;
  const hydrated = read(
    () => (globalThis as AnyRecord)['ngDevMode']?.['hydratedComponents'] as number | undefined,
    undefined,
  );
  if (typeof hydrated === 'number' && hydrated > 0) setup.hydrated = hydrated;
  if (!(ng as AnyRecord)['ɵgetInjectorProviders']) setup.mode = 'events-only';
  return setup;
}

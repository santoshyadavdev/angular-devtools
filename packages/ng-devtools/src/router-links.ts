import {
  clip,
  componentName,
  fullPathOf,
  read,
  redactUrl,
  type AnyRecord,
  type RouterDebugApi,
} from './router.ts';

export interface OutletInfo {
  outlet: string;
  route?: string;
  component?: string;
  element?: string;
  devtoolsId?: string;
  activated: boolean;
  detached?: boolean;
  inputs?: { input: string; source: string }[];
  children?: OutletInfo[];
}

export interface LinkInfo {
  text: string;
  href?: string;
  active?: boolean;
  linkActive?: boolean;
  activeClasses?: string[];
  exact?: boolean;
  ariaCurrent?: string;
  element?: string;
}

const MAX_OUTLETS = 100;
const MAX_LINKS = 100;

function elementOf(outlet: AnyRecord | null): Element | null {
  return read(
    () => (outlet?.['activated']?.['location']?.['nativeElement'] as Element) ?? null,
    null,
  );
}

function boundInputs(
  component: unknown,
  snapshot: AnyRecord | null,
): OutletInfo['inputs'] | undefined {
  const inputs = read(() => (component as AnyRecord)?.['ɵcmp']?.['inputs'] as AnyRecord, null);
  if (!inputs || !snapshot) return undefined;
  const params = read(() => (snapshot['params'] as AnyRecord) ?? {}, {});
  const query = read(() => (snapshot['queryParams'] as AnyRecord) ?? {}, {});
  const data = read(() => (snapshot['data'] as AnyRecord) ?? {}, {});
  const out = Object.keys(inputs).map((input) => ({
    input,
    source: input in data ? 'data' : input in params ? 'param' : input in query ? 'query' : 'unset',
  }));
  return out.length ? out.slice(0, 40) : undefined;
}

/**
 * The router's outlet tree from its root ChildrenOutletContexts: which route
 * and component each outlet shows, and with input binding, where each input
 * of the routed component gets its value.
 */
export function outletsOf(router: AnyRecord): OutletInfo[] {
  const bindingOn = read(() => !!router['componentInputBindingEnabled'], false);
  let count = 0;
  const visit = (contexts: AnyRecord | null, depth: number): OutletInfo[] => {
    const map = read(() => contexts?.['contexts'] as Map<string, AnyRecord>, null);
    if (!map || depth > 12) return [];
    const out: OutletInfo[] = [];
    for (const [name, context] of map) {
      if (++count > MAX_OUTLETS) break;
      const outlet = read(() => context['outlet'] as AnyRecord | null, null);
      const snapshot = read(() => context['route']?.['snapshot'] as AnyRecord, null);
      const activated = read(() => !!outlet?.['isActivated'], false);
      const info: OutletInfo = { outlet: name, activated };
      if (snapshot) info.route = fullPathOf(snapshot);
      if (activated) {
        const instance = read(() => outlet?.['component'], null);
        const type = read(() => (instance as AnyRecord)?.['constructor'], null);
        if (type) info.component = componentName(type);
        const element = elementOf(outlet);
        if (element) {
          info.element = element.tagName.toLowerCase();
          const id = element.getAttribute('data-ng-devtools-id');
          if (id) info.devtoolsId = id;
        }
        if (bindingOn) {
          const inputs = boundInputs(type, snapshot);
          if (inputs) info.inputs = inputs;
        }
      }
      if (read(() => !!context['attachRef'], false)) info.detached = true;
      const children = visit(
        read(() => context['children'] as AnyRecord, null),
        depth + 1,
      );
      if (children.length) info.children = children;
      out.push(info);
    }
    return out;
  };
  return visit(
    read(() => router['navigationTransitions']['rootContexts'] as AnyRecord, null),
    0,
  );
}

function isRouterLink(value: unknown): value is AnyRecord {
  return read(() => 'urlTree' in (value as AnyRecord) && !!(value as AnyRecord)['router'], false);
}

function isLinkActive(value: unknown): value is AnyRecord {
  return read(
    () =>
      'routerLinkActiveOptions' in (value as AnyRecord) &&
      typeof (value as AnyRecord)['isActive'] === 'boolean',
    false,
  );
}

/**
 * RouterLink and RouterLinkActive directives on the page: where each link
 * points, whether the router considers it active and what RouterLinkActive
 * decided, so the two can be compared.
 */
export function linksOf(ng: RouterDebugApi, router: AnyRecord): LinkInfo[] {
  if (typeof document === 'undefined' || !ng.getDirectives) return [];
  const elements = Array.from(document.querySelectorAll('a, button, [routerlink], [routerLink]'));
  const out: LinkInfo[] = [];
  for (const element of elements) {
    if (out.length >= MAX_LINKS) break;
    const directives = read(() => ng.getDirectives?.(element) ?? [], []);
    const link = directives.find(isRouterLink);
    const active = directives.find(isLinkActive);
    if (!link && !active) continue;
    const info: LinkInfo = {
      text: clip((element.textContent ?? '').replace(/\s+/g, ' ').trim(), 60),
      element: element.tagName.toLowerCase(),
    };
    const tree = read(() => link?.['urlTree'], null);
    if (tree) {
      info.href = redactUrl(read(() => String(router['serializeUrl'](tree)), ''));
      const exact = read(
        () => !!(active?.['routerLinkActiveOptions'] as AnyRecord)?.['exact'],
        false,
      );
      info.active = read(() => !!router['isActive'](tree, exact), false);
    }
    if (active) {
      info.linkActive = read(() => !!active['isActive'], false);
      const classes = read(() => active['classes'] as string[], []);
      if (classes.length) info.activeClasses = classes.slice(0, 5);
      const options = read(() => active['routerLinkActiveOptions'] as AnyRecord, null);
      if (options && 'exact' in options) info.exact = !!options['exact'];
      const aria = read(() => active['ariaCurrentWhenActive'] as string | undefined, undefined);
      if (aria !== undefined) info.ariaCurrent = String(aria);
    }
    out.push(info);
  }
  return out;
}

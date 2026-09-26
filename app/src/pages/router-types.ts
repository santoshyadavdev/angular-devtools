import type { DevframeRpcClient } from 'devframe/client';

export interface ActiveRoute {
  path: string;
  url: string;
  outlet: string;
  component?: string;
  title?: string;
  ownTitle?: boolean;
  params: Record<string, unknown>;
  data: Record<string, unknown>;
  paramSources?: Record<string, string>;
  dataSources?: Record<string, string>;
  guards?: Record<string, string[]>;
  resolvers?: string[];
  lazy?: boolean;
  children: ActiveRoute[];
}

export interface GuardRun {
  guard: string;
  kind: string;
  route: string;
  result: string;
  ms: number;
}

export interface NavigationRecord {
  id: number;
  url: string;
  trigger: string;
  startedAt: number;
  endedAt?: number;
  outcome: string;
  finalUrl?: string;
  from?: string;
  extras?: string[];
  caller?: string;
  phases?: Record<string, number>;
  redirectedFrom?: number;
  redirectTo?: string;
  redirectKind?: string;
  guards?: { names: string[]; passed?: boolean; ms?: number };
  resolvers?: { names: string[]; ms?: number };
  checked?: { activate: string[]; deactivate: string[] };
  runs?: GuardRun[];
  lazyLoaded?: string[];
  reused?: string[];
  requests?: { count: number; urls: string[] };
  warnings?: string[];
  errorCode?: string;
  errorHandler?: string;
  scroll?: string;
  title?: string;
  reason?: string;
  code?: string;
  beforeConnect?: boolean;
  earlier?: number;
  probe?: boolean;
}

export interface RouteNode {
  id: string;
  path: string;
  fullPath: string;
  kind: string;
  component?: string;
  redirectTo?: string;
  pathMatch?: string;
  outlet?: string;
  lazy?: 'unloaded' | 'loaded';
  matcher?: string;
  guards?: Record<string, string[]>;
  resolvers?: string[];
  title?: string;
  providers?: number;
  children?: RouteNode[];
}

export interface OutletInfo {
  outlet: string;
  route?: string;
  component?: string;
  element?: string;
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
  exact?: boolean;
  ariaCurrent?: string;
}

export interface RouterSetup {
  mode: 'full' | 'events-only';
  setupKind: string;
  routers: number;
  angularVersion?: string;
  options: { name: string; value: string; set: boolean }[];
  features: Record<string, string>;
  strategies: Record<string, string>;
  baseHref?: string;
  hydrated?: number;
}

export interface RouterPage {
  pageId: string;
  reportedAt: number;
  changedAt?: number;
  snapshot: {
    url: string;
    queryParams: Record<string, unknown>;
    fragment: string | null;
    root: ActiveRoute;
    browserUrl?: string;
    urlDrift?: boolean;
    title?: string;
    pending?: { id: number; url: string };
  } | null;
  navigations: NavigationRecord[];
  generation?: number;
  config?: RouteNode[];
  activeIds?: string[];
  setup?: RouterSetup;
  outlets?: OutletInfo[];
  links?: LinkInfo[];
  preloads?: { path: string; startedAt: number; ms?: number; failed?: boolean }[];
  instrumented?: boolean;
}

export interface LintFinding {
  rule: string;
  severity: 'error' | 'warning' | 'info';
  route: string;
  message: string;
  fix: string;
  angular: string;
}

export function routerCall<T>(
  client: DevframeRpcClient | null,
  name: string,
  arg?: unknown,
): Promise<T | null> {
  if (!client) return Promise.resolve(null);
  const rpc = client.scope('ng-devtools').rpc as unknown as {
    call: (name: string, ...args: unknown[]) => Promise<unknown>;
  };
  return rpc.call(name, ...(arg === undefined ? [] : [arg])).then(
    (value) => value as T,
    () => null,
  );
}

export function routerAction(
  client: DevframeRpcClient | null,
  pageId: string | undefined,
  request: Record<string, unknown>,
): Promise<Record<string, unknown> | null> {
  return routerCall<Record<string, unknown>>(client, 'request-router-action', { pageId, request });
}

export const SHARED_STYLES = `
  .muted {
    color: #a1a1aa;
    font-size: 13px;
  }
  code {
    font-family: monospace;
    color: #d4d4d8;
    overflow-wrap: anywhere;
  }
  .tag {
    display: inline-block;
    margin: 0 4px 4px 0;
    padding: 1px 6px;
    border: 1px solid #52525b;
    border-radius: 4px;
    color: #d4d4d8;
    font-size: 11px;
    font-family: monospace;
  }
  .badge {
    padding: 1px 6px;
    border-radius: 4px;
    background: #3f3f46;
    color: #e4e4e7;
    font-size: 11px;
    font-weight: 600;
  }
  .badge[data-tone='good'] {
    background: #14532d;
    color: #bbf7d0;
  }
  .badge[data-tone='warn'] {
    background: #713f12;
    color: #fef08a;
  }
  .badge[data-tone='bad'] {
    background: #7f1d1d;
    color: #fecaca;
  }
  button.small {
    padding: 3px 10px;
    background: #3f3f46;
    border: none;
    border-radius: 6px;
    color: #e4e4e7;
    cursor: pointer;
    font-size: 12px;
  }
  button.small:hover {
    background: #52525b;
  }
  button.small:focus-visible,
  input:focus-visible,
  select:focus-visible,
  .table-scroll:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  input.field {
    padding: 6px 10px;
    background: #18181b;
    border: 1px solid #52525b;
    border-radius: 6px;
    color: #e4e4e7;
    font-size: 13px;
  }
  .table-scroll {
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  th {
    text-align: left;
    padding: 6px 12px;
    color: #a1a1aa;
    font-size: 12px;
    border-bottom: 1px solid #27272a;
  }
  td {
    padding: 8px 12px;
    border-bottom: 1px solid #1e1e22;
    vertical-align: top;
  }
  h3 {
    margin: 0 0 8px;
    font-size: 14px;
    color: #e4e4e7;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
`;

export function tone(outcome: string): string {
  if (outcome === 'succeeded') return 'good';
  if (outcome === 'redirected' || outcome === 'pending' || outcome === 'skipped') return 'warn';
  if (outcome === 'cancelled' || outcome === 'failed') return 'bad';
  return '';
}

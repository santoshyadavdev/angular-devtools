import type { RemoteAssets } from 'devframe';
import { defineDevframe } from 'devframe';
import { getRoutes } from './rpc/get-routes.ts';
import { getComponents } from './rpc/get-components.ts';
import { getBuildMeta } from './rpc/build-meta.ts';
import { getSignals } from './rpc/get-signals.ts';
import { getProviders } from './rpc/get-providers.ts';
import { getNgrxStore } from './rpc/get-ngrx-store.ts';
import type { NgrxRuntimeAction } from './types.ts';
import {
  explainFormsText,
  formsResourceText,
  currentForms,
  expirePages,
  inspectFormsText,
  isPageReport,
  mergePageReport,
  type PageReport,
  type FormsState,
  type InspectFormsArgs,
} from './rpc/forms-tools.ts';
import {
  currentRouter,
  expireRouterPages,
  explainNavigationText,
  inspectRouteText,
  isRouterReport,
  mergeRouterReport,
  routerResourceText,
  type RouterPage,
  type RouterState,
} from './rpc/router-tools.ts';
import {
  explainRenderModeText,
  exportNavigationText,
  lintRoutes,
  lintRoutesText,
  listRoutesText,
  matchUrl,
  routerConfigText,
} from './rpc/router-config-tools.ts';
import { extractRoutes } from './rpc/get-routes.ts';
import { scanServerRoutes } from './rpc/server-routes.ts';

import pkg from '../package.json' with { type: 'json' };

const clientAssets: RemoteAssets = {
  package: pkg.name,
  version: pkg.version,
  path: 'dist/public',
};

const ngDevtools = defineDevframe({
  id: 'ng-devtools',
  name: 'Angular DevTools',
  version: pkg.version,
  packageName: pkg.name,
  description: 'Inspect Angular component trees, signals, and routes at dev and build time.',
  homepage: 'https://github.com/santoshyadavdev/angular-devtools',
  icon: 'ph:angular-logo-duotone',
  importMetaUrl: import.meta.url,
  clientAssets,

  async setup(ctx) {
    const my = ctx.scope('ng-devtools');

    my.rpc.register(getRoutes);
    my.rpc.register(getComponents);
    my.rpc.register(getSignals);
    my.rpc.register(getProviders);
    my.rpc.register(getNgrxStore);
    my.rpc.register(getBuildMeta);

    const componentTree = await my.rpc.sharedState('component-tree', {
      initialValue: {
        nodes: [],
        selectedId: null,
        highlightedId: null,
      },
    });

    await my.rpc.sharedState('routes', {
      initialValue: {
        routes: [],
        activeRoute: null,
      },
    });

    const signalGraphState = await my.rpc.sharedState('signal-graph', {
      initialValue: {
        graph: null as any,
        selectedNodeId: null as string | null,
      },
    });

    const injectorTreeState = await my.rpc.sharedState('injector-tree', {
      initialValue: {
        roots: [] as any[],
        selectedInjectorId: null as string | null,
      },
    });

    const ngrxStoreState = await my.rpc.sharedState('ngrx-store', {
      initialValue: {
        state: null as unknown,
        actions: [] as NgrxRuntimeAction[],
        connected: false,
      },
    });

    const formPages = new Map<string, PageReport & { reportedAt: number }>();
    const formsState = await my.rpc.sharedState('forms', {
      initialValue: { forms: [], events: [], reportedAt: 0 } as FormsState,
    });

    const applyForms = (next: FormsState) =>
      formsState.mutate((draft) => {
        draft.forms = next.forms;
        draft.events = next.events;
        draft.reportedAt = next.reportedAt;
      });

    my.rpc.register({
      name: 'push-forms',
      type: 'action',
      jsonSerializable: true,
      handler: (report: unknown) => {
        if (!isPageReport(report)) return;
        applyForms(mergePageReport(formPages, report));
      },
    });

    const routerPages = new Map<string, RouterPage>();
    const routerState = await my.rpc.sharedState('router', {
      initialValue: { pages: [] } as RouterState,
    });

    const applyRouter = (next: RouterState) =>
      routerState.mutate((draft) => {
        draft.pages = next.pages;
      });

    my.rpc.register({
      name: 'push-router',
      type: 'action',
      jsonSerializable: true,
      handler: (report: unknown) => {
        if (!isRouterReport(report)) return;
        try {
          applyRouter(mergeRouterReport(routerPages, report));
        } catch {
          routerPages.delete(report.pageId);
        }
      },
    });

    const pendingActions = new Map<string, (result: unknown) => void>();
    let actionSeq = 0;

    const requestRouterAction = (pageId: string | undefined, request: unknown) =>
      new Promise<unknown>((resolve) => {
        const requestId = `a${++actionSeq}`;
        const timer = setTimeout(() => {
          pendingActions.delete(requestId);
          resolve({ error: 'No page answered within 15s. Is the app open in a browser?' });
        }, 15_000);
        timer.unref?.();
        pendingActions.set(requestId, (result) => {
          clearTimeout(timer);
          pendingActions.delete(requestId);
          resolve(result);
        });
        void my.rpc.broadcast({
          method: 'router-action',
          args: [{ requestId, pageId, request }],
          optional: true,
        });
      });

    my.rpc.register({
      name: 'router-action-result',
      type: 'action',
      jsonSerializable: true,
      handler: (message: { requestId?: unknown; result?: unknown }) => {
        if (typeof message?.requestId !== 'string') return;
        pendingActions.get(message.requestId)?.(message.result);
      },
    });

    my.rpc.register({
      name: 'request-router-action',
      type: 'action',
      jsonSerializable: true,
      handler: (message: { pageId?: string; request?: unknown }) =>
        requestRouterAction(
          typeof message?.pageId === 'string' ? message.pageId : undefined,
          message?.request,
        ),
    });

    const pageFor = (pageId: unknown) => {
      const state = routerState.value() as RouterState;
      return typeof pageId === 'string'
        ? state.pages.find((p) => p.pageId === pageId)
        : (state.pages.find((p) => p.snapshot) ?? state.pages[0]);
    };

    my.rpc.register({
      name: 'router-lint',
      type: 'query',
      jsonSerializable: true,
      handler: (pageId: unknown) => {
        const page = pageFor(pageId);
        return page?.config ? lintRoutes(page) : [];
      },
    });

    my.rpc.register({
      name: 'router-match',
      type: 'query',
      jsonSerializable: true,
      handler: (message: { pageId?: unknown; url?: unknown }) => {
        const page = pageFor(message?.pageId);
        if (!page?.config || typeof message?.url !== 'string') return null;
        return matchUrl(page.config, message.url.slice(0, 2000));
      },
    });

    my.rpc.register({
      name: 'router-export',
      type: 'query',
      jsonSerializable: true,
      handler: (message: { pageId?: unknown; id?: unknown }) =>
        exportNavigationText(routerState.value() as RouterState, {
          page: typeof message?.pageId === 'string' ? message.pageId : undefined,
          id: typeof message?.id === 'number' ? message.id : undefined,
        }),
    });

    my.rpc.register({
      name: 'forget-router-page',
      type: 'action',
      jsonSerializable: true,
      handler: (pageId: string) => {
        if (typeof pageId === 'string' && routerPages.delete(pageId)) {
          applyRouter(currentRouter(routerPages));
        }
      },
    });

    const expiry = setInterval(() => {
      const next = expirePages(formPages);
      if (next) applyForms(next);
      const nextRouter = expireRouterPages(routerPages);
      if (nextRouter) applyRouter(nextRouter);
    }, 5000);
    expiry.unref?.();

    my.rpc.register({
      name: 'forget-forms-page',
      type: 'action',
      jsonSerializable: true,
      handler: (pageId: string) => {
        if (typeof pageId === 'string' && formPages.delete(pageId)) {
          applyForms(currentForms(formPages));
        }
      },
    });

    my.rpc.register({
      name: 'request-form-highlight',
      type: 'action',
      jsonSerializable: true,
      handler: (target: { formId: string; path: string } | null) => {
        void my.rpc.broadcast({
          method: 'highlight-form-field',
          args: [target],
          optional: true,
        });
      },
    });

    my.rpc.register({
      name: 'push-component-tree',
      type: 'action',
      jsonSerializable: true,
      handler: (nodes: unknown[]) => {
        componentTree.mutate((draft) => {
          draft.nodes = nodes as any;
        });
      },
    });

    my.rpc.register({
      name: 'select-component',
      type: 'action',
      jsonSerializable: true,
      handler: (id: string | null) => {
        componentTree.mutate((draft) => {
          draft.selectedId = id;
        });
      },
    });

    my.rpc.register({
      name: 'push-signal-graph',
      type: 'action',
      jsonSerializable: true,
      handler: (graph: unknown) => {
        signalGraphState.mutate((draft) => {
          draft.graph = graph as any;
        });
      },
    });

    my.rpc.register({
      name: 'push-injector-tree',
      type: 'action',
      jsonSerializable: true,
      handler: (roots: unknown[]) => {
        injectorTreeState.mutate((draft) => {
          draft.roots = roots as any;
        });
      },
    });

    my.rpc.register({
      name: 'push-ngrx-state',
      type: 'action',
      jsonSerializable: true,
      handler: (data: { state: unknown; actions: NgrxRuntimeAction[]; connected: boolean }) => {
        ngrxStoreState.mutate((draft) => {
          draft.state = data.state;
          draft.actions = data.actions;
          draft.connected = data.connected;
        });
      },
    });

    // Agent resources
    ctx.agent.registerResource({
      id: 'ng-devtools:component-tree',
      name: 'Angular Component Tree',
      description:
        'Component hierarchy last reported by a connected page, as JSON. Empty when no page is connected.',
      mimeType: 'application/json',
      read: () => ({ text: JSON.stringify(componentTree.value(), null, 2) }),
    });

    ctx.agent.registerResource({
      id: 'ng-devtools:signal-graph',
      name: 'Angular Signal Graph',
      description:
        'Live signal dependency graph: nodes (signal, computed, effect, linkedSignal) and edges (producer→consumer). Read this to understand reactive data flow.',
      mimeType: 'application/json',
      read: () => ({ text: JSON.stringify(signalGraphState.value(), null, 2) }),
    });

    ctx.agent.registerResource({
      id: 'ng-devtools:injector-tree',
      name: 'Angular Injector Tree',
      description:
        'DI injector hierarchy last reported by a connected page, with providers at each level. Empty when no page is connected.',
      mimeType: 'application/json',
      read: () => ({ text: JSON.stringify(injectorTreeState.value(), null, 2) }),
    });

    ctx.agent.registerResource({
      id: 'ng-devtools:ngrx-store',
      name: 'NgRx Store State',
      description:
        'NgRx store state and recent actions last reported by a connected page. Empty when no page is connected.',
      mimeType: 'application/json',
      read: () => ({ text: JSON.stringify(ngrxStoreState.value(), null, 2) }),
    });

    ctx.agent.registerResource({
      id: 'ng-devtools:forms',
      name: 'Angular Forms',
      description:
        "Every form a connected page last reported (Signal Forms, reactive and template-driven), with each field's value, status, touched, dirty and errors, plus recent changes. Empty when no page is connected.",
      mimeType: 'application/json',
      read: () => ({ text: formsResourceText(formsState.value() as FormsState) }),
    });

    ctx.agent.registerResource({
      id: 'ng-devtools:router',
      name: 'Angular Router',
      description:
        'The active route tree (params, data, guards, resolvers) and recent navigations of each connected page. Empty when no page is connected.',
      mimeType: 'application/json',
      read: () => ({ text: routerResourceText(routerState.value() as RouterState) }),
    });

    // Agent tools
    ctx.agent.registerTool({
      id: 'ng-devtools:highlight',
      description: 'Highlight a component in the running Angular app by its selector.',
      safety: 'action',
      inputSchema: {
        type: 'object',
        properties: {
          selector: {
            type: 'string',
            description: 'CSS selector of the component to highlight, e.g. app-root.',
          },
        },
        required: ['selector'],
      },
      handler: async (args: { selector: string }) => {
        if (!componentTree.value().nodes.length) {
          return {
            markdown: `No component tree has been reported, so nothing was highlighted. This is what a page that has never connected reports, and also what a connected page reports when its components are not readable. Live data needs a page: connect through the MCP endpoint of the server that runs the app, with the app open in a browser. The stdio server has no page attached and only ever reports this.`,
          };
        }
        await ctx.rpc.invokeLocal('ng-devtools:select-component' as any, args.selector);
        void my.rpc.broadcast({
          method: 'highlight-in-page',
          args: [args.selector],
          optional: true,
        });
        return {
          markdown: `Sent a highlight request for \`${args.selector}\`. It only shows if the selector matches an element on the page.`,
        };
      },
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:inspect-signals',
      description:
        'Get the signal graph the running page last reported: signal nodes (signal, computed, linkedSignal, effect) and their dependency edges. The page reports one graph, for its root component, so a selector that does not match it returns what is available instead.',
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: {
          selector: {
            type: 'string',
            description: 'CSS selector of the component to inspect, e.g. app-root.',
          },
        },
        required: ['selector'],
      },
      handler: async (args: { selector: string }) => {
        // `broadcast` resolves with nothing, so the page cannot answer a
        // question. Read the graph the overlay pushes into shared state.
        const graph = signalGraphState.value().graph;
        if (!graph) {
          return {
            markdown: `No signal graph available. Live data needs a page: connect through the MCP endpoint of the server that runs the app, with the app open in a browser. The stdio server has no page attached and only ever reports this.`,
          };
        }
        const json = JSON.stringify(graph, null, 2);
        if (graph.componentSelector && graph.componentSelector !== args.selector) {
          return {
            markdown: `No signal graph for \`${args.selector}\`. The live graph covers \`${graph.componentSelector}\`:\n\n${json}`,
          };
        }
        return { markdown: json };
      },
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:inspect-providers',
      description:
        'Get the DI injector hierarchy the running page last reported, with the providers at each level. The page reports the whole tree rather than one component, so the selector only labels the answer.',
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: {
          selector: {
            type: 'string',
            description:
              'Optional CSS selector, e.g. app-root. It only labels the answer: the page reports the whole tree either way.',
          },
        },
      },
      handler: async (args: { selector?: string }) => {
        const roots = injectorTreeState.value().roots;
        if (!roots.length) {
          return {
            markdown: `No injector data available. Live data needs a page: connect through the MCP endpoint of the server that runs the app, with the app open in a browser. The stdio server has no page attached and only ever reports this.`,
          };
        }
        const scope = args.selector ? `, not filtered to \`${args.selector}\`` : '';
        return {
          markdown: `This is the injector tree for the whole page${scope}:\n\n${JSON.stringify(roots, null, 2)}`,
        };
      },
    });

    const noRouter = `No router state has been reported. Live data needs a page: connect through the MCP endpoint of the server that runs the app, with the app open in a browser. The stdio server has no page attached and only ever reports this.`;
    const pageProperty = {
      type: 'string',
      description: 'Page id, when more than one tab reports. Defaults to the most recent.',
    };

    const defaultPageId = () => {
      const state = routerState.value() as RouterState;
      return (state.pages.find((p) => p.snapshot) ?? state.pages[0])?.pageId;
    };

    ctx.agent.registerTool({
      id: 'ng-devtools:inspect-route',
      description:
        'The route the running page is on right now: URL (and the browser URL when it differs), query params, fragment, document title, any navigation in flight, the active route tree (component, params and data with where each value comes from, own or inherited title, guards, resolvers) and the outlet tree with router-bound inputs. Pass `selector` (a component class, element tag or link text) to see the route a component was rendered for, or whether a link counts as active. Secret-looking values are redacted.',
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: {
          page: pageProperty,
          selector: {
            type: 'string',
            description:
              'Component class name, element tag or link text to explain instead of the whole route.',
          },
        },
      },
      handler: async (args: { page?: string; selector?: string }) => {
        const state = routerState.value() as RouterState;
        if (!state.pages.length) return { markdown: noRouter };
        return { markdown: inspectRouteText(state, args) };
      },
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:explain-navigation',
      description:
        'Recent navigations on the running page, newest first, each as a full story: from and to, who started it (link, code, back/forward), extras, redirect chain and loops, per-phase timing, guards and resolvers (with each verdict when instrumentation is on), lazy loads, reused components, HTTP requests, scroll, title, and the cancel or error reason with a plain-language meaning and the NG0 error explained. Use it for "why did this navigation not work", "why was I redirected" or, with perf, "why is navigation slow".',
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: {
          page: pageProperty,
          url: {
            type: 'string',
            description: 'Only navigations whose URL or final URL contains this text.',
          },
          id: { type: 'integer', description: 'Only the navigation with this id.' },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 50,
            description: 'How many navigations to return (default 5, at most 50).',
          },
          perf: {
            type: 'boolean',
            description: 'Summarize the slowest navigations and preloads instead.',
          },
        },
      },
      handler: async (args: {
        page?: string;
        url?: string;
        limit?: number;
        perf?: boolean;
        id?: number;
      }) => {
        const state = routerState.value() as RouterState;
        if (!state.pages.length) return { markdown: noRouter };
        return { markdown: explainNavigationText(state, args) };
      },
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:list-routes',
      description:
        "The router's live route config (not just the active route): every route with its full path, component or redirect, lazy state, outlet, guards, resolvers, title, the source file it is declared in and an example URL, with the active routes marked. Pass `match` to predict which route a URL matches (or the nearest routes when it matches none), `audit` for the guards protecting each page, or `filter` to narrow by path or component.",
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: {
          page: pageProperty,
          match: {
            type: 'string',
            description: 'A URL such as /users/42 to match against the config.',
          },
          audit: { type: 'boolean', description: 'List the guards that protect each page.' },
          filter: {
            type: 'string',
            description: 'Only routes whose path or component contains this text.',
          },
        },
      },
      handler: async (args: {
        page?: string;
        match?: string;
        audit?: boolean;
        filter?: string;
      }) => {
        const state = routerState.value() as RouterState;
        if (!state.pages.length) return { markdown: noRouter };
        let sources: { path: string; component?: string; redirectTo?: string; file: string }[] = [];
        try {
          sources = extractRoutes(ctx.cwd);
        } catch {
          sources = [];
        }
        return { markdown: listRoutesText(state, args, sources) };
      },
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:lint-routes',
      description:
        "Checks the live route config for mistakes: routes after '**', a :param route shadowing a literal one, duplicate paths, empty-path redirects without pathMatch 'full', redirect cycles, deprecated class guards and canLoad, lazy chunks downloaded before canActivate rejects, missing or duplicate titles, param/input name typos, RouterLinkActive without aria-current, emails in URLs and return URLs taken from query params. Each finding says whether Angular throws, warns or stays silent, and how to fix it.",
      safety: 'read',
      inputSchema: { type: 'object', properties: { page: pageProperty } },
      handler: async (args: { page?: string }) => {
        const state = routerState.value() as RouterState;
        if (!state.pages.length) return { markdown: noRouter };
        return { markdown: lintRoutesText(state, args) };
      },
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:router-config',
      description:
        'How the router is set up on the running page: provideRouter or forRoot, Angular version, effective options with which are set and which are defaults (onSameUrlNavigation, paramsInheritanceStrategy, urlUpdateStrategy, canceledNavigationResolution, scrolling, initial navigation), enabled features (input binding, view transitions, error handler, preloading strategy, scroller, resources), strategies (location, title, reuse, URL handling), base href, hydration and whether per-guard instrumentation is on.',
      safety: 'read',
      inputSchema: { type: 'object', properties: { page: pageProperty } },
      handler: async (args: { page?: string }) => {
        const state = routerState.value() as RouterState;
        if (!state.pages.length) return { markdown: noRouter };
        return { markdown: routerConfigText(state, args) };
      },
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:export-navigation',
      description:
        'A markdown repro for one navigation (default: the latest that did not succeed): Angular version, router options and features, how it started, the full redirect chain with every detail from explain-navigation, and the relevant slice of the route config. Secret-looking values stay redacted.',
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: { page: pageProperty, id: { type: 'integer', description: 'Navigation id.' } },
      },
      handler: async (args: { page?: string; id?: number }) => {
        const state = routerState.value() as RouterState;
        if (!state.pages.length) return { markdown: noRouter };
        return { markdown: exportNavigationText(state, args) };
      },
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:explain-render-mode',
      description:
        "Which ServerRoute (from the workspace's *.routes.server.ts) and render mode (Server, Client, Prerender) a URL gets, plus server entries that match no client route and the render mode of every client route.",
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: {
          page: pageProperty,
          url: { type: 'string', description: 'URL to check; defaults to the page URL.' },
        },
      },
      handler: async (args: { page?: string; url?: string }) => {
        const state = routerState.value() as RouterState;
        let entries: ReturnType<typeof scanServerRoutes> = [];
        try {
          entries = scanServerRoutes(ctx.cwd);
        } catch {
          entries = [];
        }
        return { markdown: explainRenderModeText(state, entries, args) };
      },
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:navigate',
      description:
        'Acts on the running app\'s router (development only). action "navigate" goes to `url` (same-origin, starting with "/") or to `pattern` with `params` (e.g. /users/:id with {"id":"7"}), optionally with replaceUrl or skipLocationChange, and waits for the outcome; "abort" stops the navigation in flight; "replay" re-runs navigation `id` and compares the outcome; "probe" runs the real matcher for `url` without navigating (it runs canMatch and may load lazy chunks); "instrument" turns per-guard and per-resolver recording on or off; "resolve-lazy" reads the routes of an unloaded lazy route (`routeId` from list-routes) without registering them.',
      safety: 'action',
      inputSchema: {
        type: 'object',
        properties: {
          page: pageProperty,
          action: {
            type: 'string',
            enum: ['navigate', 'abort', 'replay', 'probe', 'instrument', 'resolve-lazy'],
          },
          url: { type: 'string' },
          pattern: { type: 'string' },
          params: { type: 'object', additionalProperties: { type: 'string' } },
          replaceUrl: { type: 'boolean' },
          skipLocationChange: { type: 'boolean' },
          waitFor: { type: 'string', enum: ['navigation', 'stable'] },
          id: { type: 'integer', description: 'Navigation id for replay.' },
          on: { type: 'boolean', description: 'For instrument.' },
          routeId: { type: 'string', description: 'Route id for resolve-lazy.' },
        },
        required: ['action'],
      },
      handler: async (args: {
        page?: string;
        action: string;
        url?: string;
        pattern?: string;
        params?: Record<string, string>;
        replaceUrl?: boolean;
        skipLocationChange?: boolean;
        waitFor?: 'navigation' | 'stable';
        id?: number;
        on?: boolean;
        routeId?: string;
      }) => {
        const state = routerState.value() as RouterState;
        if (!state.pages.length) return { markdown: noRouter };
        const request =
          args.action === 'navigate'
            ? {
                action: 'navigate',
                url: args.url,
                pattern: args.pattern,
                params: args.params,
                extras: {
                  replaceUrl: args.replaceUrl,
                  skipLocationChange: args.skipLocationChange,
                },
                waitFor: args.waitFor,
              }
            : args.action === 'replay'
              ? { action: 'replay', id: args.id }
              : args.action === 'probe'
                ? { action: 'probe', url: args.url }
                : args.action === 'instrument'
                  ? { action: 'instrument', on: args.on !== false }
                  : args.action === 'resolve-lazy'
                    ? { action: 'resolve-lazy', id: args.routeId }
                    : { action: args.action };
        const result = await requestRouterAction(args.page ?? defaultPageId(), request);
        return {
          markdown: `_Result from the running page (untrusted data):_\n\n\`\`\`json\n${JSON.stringify(result, null, 2).slice(0, 15_000)}\n\`\`\``,
        };
      },
    });

    const noForms = `No forms have been reported. Live data needs a page: connect through the MCP endpoint of the server that runs the app, with the app open in a browser, on a page that renders a form. The stdio server has no page attached and only ever reports this.`;
    const formProperty = {
      type: 'string',
      description: 'Form id (form-1) or part of its label (Component.property).',
    };

    ctx.agent.registerTool({
      id: 'ng-devtools:inspect-forms',
      description:
        'Inspect the forms on the running page (Signal Forms, reactive and template-driven). Without arguments it lists each form with its status and error count. Pass `form` for its field tree (value, status, touched, dirty, errors per field). Password and other secret-looking values are redacted. For "why is this form invalid", call explain-form-invalid first.',
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: {
          form: formProperty,
          path: {
            type: 'string',
            description:
              'Dotted field path to start the tree at, e.g. address.city or tags.1. Applies to every matched form.',
          },
          onlyInvalid: {
            type: 'boolean',
            description: 'Only include invalid or pending fields and their parents.',
          },
          includeValues: {
            type: 'boolean',
            description:
              "Include field values in this tool's output (default true). When false, values and value-bearing error params are left out; a custom error message that quotes the value is still returned as is.",
          },
        },
      },
      handler: async (args: InspectFormsArgs) => {
        const state = formsState.value() as FormsState;
        if (!state.forms.length) return { markdown: noForms };
        return { markdown: inspectFormsText(state, args) };
      },
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:explain-form-invalid',
      description:
        'Explain why forms on the running page are invalid: each failing field with its current value, the validator that failed, its message and whether it was touched, plus fields waiting on async validators and disabled reasons. Without `form` it covers every form that is invalid or waiting on async validation.',
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: { form: formProperty },
      },
      handler: async (args: { form?: string }) => {
        const state = formsState.value() as FormsState;
        if (!state.forms.length) return { markdown: noForms };
        return { markdown: explainFormsText(state, args) };
      },
    });
  },
});

export default ngDevtools;

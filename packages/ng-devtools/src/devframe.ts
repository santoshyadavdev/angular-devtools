import type { RemoteAssets } from 'devframe';
import { defineDevframe } from 'devframe';
import { getRoutes } from './rpc/get-routes.ts';
import { getComponents } from './rpc/get-components.ts';
import { getBuildMeta } from './rpc/build-meta.ts';
import { getSignals } from './rpc/get-signals.ts';
import { getProviders } from './rpc/get-providers.ts';
import { getNgrxStore } from './rpc/get-ngrx-store.ts';
import type { NgrxRuntimeAction } from './types.ts';

import pkg from '../package.json' with { type: 'json' };

const clientAssets: RemoteAssets = {
  package: '@santoshyadavdev/ng-devtools-assets',
  version: pkg.version,
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
  },
});

export default ngDevtools;

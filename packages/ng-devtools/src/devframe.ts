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
  explainCustomControlText,
  explainFieldText,
  explainSubmitText,
  fieldOwner,
  exportFormText,
  formDiffText,
  formHistoryText,
  formPayloadText,
  latestMarker,
  lintFormsFor,
  lintFormsText,
  waitSatisfied,
  type WaitUntil,
} from './rpc/forms-explain.ts';
import { findFormSource, sourceText } from './rpc/forms-source.ts';

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
      initialValue: { forms: [], events: [], reportedAt: 0, setupErrors: [] } as FormsState,
    });

    const applyForms = (next: FormsState) =>
      formsState.mutate((draft) => {
        draft.forms = next.forms;
        draft.events = next.events;
        draft.reportedAt = next.reportedAt;
        draft.setupErrors = next.setupErrors ?? [];
        draft.instrumented = next.instrumented ?? [];
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

    const expiry = setInterval(() => {
      const next = expirePages(formPages);
      if (next) applyForms(next);
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

    const pendingFormActions = new Map<string, (result: unknown) => void>();
    let formActionSeq = 0;

    const requestFormAction = (request: Record<string, unknown>, timeoutMs = 15_000) =>
      new Promise<Record<string, unknown>>((resolve) => {
        const requestId = `f${++formActionSeq}`;
        const formId = typeof request['formId'] === 'string' ? request['formId'] : undefined;
        const explicit = typeof request['page'] === 'string' ? request['page'] : undefined;
        const pageId = explicit ?? (formId?.includes('@') ? formId.split('@')[1] : undefined);
        const { page: _page, ...payload } = request;
        const timer = setTimeout(() => {
          pendingFormActions.delete(requestId);
          resolve({
            ok: false,
            error: `No page answered within ${Math.round(timeoutMs / 1000)}s. Is the app open in a browser, with that form on screen?`,
          });
        }, timeoutMs);
        timer.unref?.();
        pendingFormActions.set(requestId, (result) => {
          clearTimeout(timer);
          pendingFormActions.delete(requestId);
          resolve(
            (result && typeof result === 'object'
              ? result
              : { ok: false, error: 'Empty answer.' }) as Record<string, unknown>,
          );
        });
        void my.rpc.broadcast({
          method: 'form-action',
          args: [{ requestId, pageId, request: payload }],
          optional: true,
        });
      });

    my.rpc.register({
      name: 'form-action-result',
      type: 'action',
      jsonSerializable: true,
      handler: (message: { requestId?: unknown; result?: unknown }) => {
        if (typeof message?.requestId !== 'string') return;
        pendingFormActions.get(message.requestId)?.(message.result);
      },
    });

    my.rpc.register({
      name: 'request-form-action',
      type: 'action',
      jsonSerializable: true,
      handler: (request: unknown) =>
        request && typeof request === 'object'
          ? requestFormAction(request as Record<string, unknown>)
          : { ok: false, error: 'Bad request.' },
    });

    my.rpc.register({
      name: 'forms-lint',
      type: 'query',
      jsonSerializable: true,
      handler: (args: { form?: unknown; page?: unknown } | null) =>
        lintFormsFor(formsState.value() as FormsState, {
          form: typeof args?.form === 'string' ? args.form : undefined,
          page: typeof args?.page === 'string' ? args.page : undefined,
        }),
    });

    my.rpc.register({
      name: 'forms-owners',
      type: 'query',
      jsonSerializable: true,
      handler: () =>
        (formsState.value() as FormsState).forms.map((form) => ({
          formId: form.id,
          label: form.label,
          file: findFormSource(ctx.cwd, form.owner, form.property)?.form?.file ?? null,
        })),
    });

    my.rpc.register({
      name: 'forms-explain',
      type: 'query',
      jsonSerializable: true,
      handler: (args: { kind?: unknown; form?: unknown; path?: unknown } | null) => {
        const state = formsState.value() as FormsState;
        const target = {
          form: typeof args?.form === 'string' ? args.form : undefined,
          path: typeof args?.path === 'string' ? args.path : undefined,
        };
        switch (args?.kind) {
          case 'submit':
            return explainSubmitText(state, target);
          case 'payload':
            return formPayloadText(state, target);
          case 'fixture':
            return exportFormText(state, { ...target, format: 'fixture' });
          default:
            return explainFieldText(state, target);
        }
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
          page: {
            type: 'string',
            description: 'Page id (the part after @ in a form id) when several tabs are connected.',
          },
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
        properties: {
          form: formProperty,
          page: {
            type: 'string',
            description: 'Page id (the part after @ in a form id) when several tabs are connected.',
          },
        },
      },
      handler: async (args: { form?: string; page?: string }) => {
        const state = formsState.value() as FormsState;
        if (!state.forms.length) return { markdown: noForms };
        return { markdown: explainFormsText(state, args) };
      },
    });

    const pageProperty = {
      type: 'string',
      description: 'Page id (the part after @ in a form id) when several tabs are connected.',
    };
    const pathProperty = {
      type: 'string',
      description:
        'Dotted field path, e.g. address.city or items.0.qty. Empty for the form itself.',
    };
    const withForms =
      <A>(fn: (state: FormsState, args: A) => string) =>
      async (args: A) => {
        const state = formsState.value() as FormsState;
        if (!state.forms.length) return { markdown: noForms };
        return { markdown: fn(state, args ?? ({} as A)) };
      };
    const str = (value: unknown) => (typeof value === 'string' ? value : undefined);

    ctx.agent.registerTool({
      id: 'ng-devtools:explain-field',
      description:
        'Explain one form field: value, flags, every error with where it comes from (validator, template attribute, cross-field rule and which ancestor, async, parse, server/submission, setErrors), why validation is skipped (hidden, disabled, readonly), inherited disabled reasons, uncommitted or debounced input, stale validity, rules and validator names, the binding (accessor or [formField]) and DOM facts (label, visible error text, drift). Pass `selector` instead of form/path to start from a CSS selector.',
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: {
          form: formProperty,
          path: pathProperty,
          selector: { type: 'string', description: 'CSS selector of an input bound to a field.' },
          page: pageProperty,
        },
      },
      handler: async (args: { form?: string; path?: string; selector?: string; page?: string }) => {
        const state = formsState.value() as FormsState;
        if (!state.forms.length) return { markdown: noForms };
        let target = { form: args?.form, path: args?.path, page: args?.page };
        if (args?.selector) {
          const located = await requestFormAction(
            { action: 'locate', selector: args.selector, page: args.page },
            5000,
          );
          if (!located['ok']) return { markdown: String(located['error'] ?? 'Not found.') };
          target = {
            form: str(located['formId']),
            path: str(located['path']) ?? '',
            page: undefined,
          };
        }
        const owner = fieldOwner(state, target);
        const source = owner
          ? sourceText(findFormSource(ctx.cwd, owner.owner, owner.property, owner.path))
          : '';
        return { markdown: explainFieldText(state, target, Date.now(), source) };
      },
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:explain-submit',
      description:
        'Explain what submitting a form will do and why it might do nothing: Signal Forms submit() dry-run (action present, ignoreValidators, already submitting), ngSubmit semantics for reactive and template forms, DOM reasons (no submit button, type="button", disabled button, directive not on a <form>, native validation), blocking and pending fields, and recent submits with their outcome (ran, blocked, threw).',
      safety: 'read',
      inputSchema: { type: 'object', properties: { form: formProperty, page: pageProperty } },
      handler: withForms(explainSubmitText),
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:form-payload',
      description:
        'Show what a form would send: form.value vs getRawValue() with the disabled fields form.value drops (reactive), or the hidden/disabled/readonly fields Signal Forms keeps in the value without validating them, plus which fields the user changed.',
      safety: 'read',
      inputSchema: { type: 'object', properties: { form: formProperty, page: pageProperty } },
      handler: withForms(formPayloadText),
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:form-history',
      description:
        'Timeline of form changes: value (with previous value and repeat count), status, submit (ran, blocked, threw), added and removed fields, each tagged with its origin (user, code, devtools). Filter by form, path, type, origin or `since` (a marker from an earlier call). Returns the current marker.',
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: {
          form: formProperty,
          path: pathProperty,
          type: {
            type: 'string',
            enum: [
              'value',
              'status',
              'touched',
              'dirty',
              'submit',
              'reset',
              'added',
              'removed',
              'moved',
              'validators',
            ],
          },
          origin: { type: 'string', enum: ['user', 'code', 'devtools', 'binding'] },
          since: { type: 'number', description: 'Only events after this marker.' },
          limit: { type: 'number', description: 'Max events (default 50, max 200).' },
          page: pageProperty,
        },
      },
      handler: withForms(formHistoryText),
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:form-diff',
      description:
        'Net change of a form since a marker: each field whose value or status ended different, with from → to and how many changes happened in between. Get a marker from form-history, inspect-forms or a form-action result, act, then call this.',
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: {
          form: formProperty,
          since: {
            type: 'number',
            description: 'Marker to diff from (default: everything buffered).',
          },
          page: pageProperty,
        },
      },
      handler: withForms(formDiffText),
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:lint-forms',
      description:
        'Deterministic checks on live forms: stale validity after validator changes, stuck PENDING, unreachable submit, missing submission action, hidden fields still rendered, view out of sync with the model, [disabled] on reactive controls, required-but-unbound fields, NG01xxx setup errors, and model-aware accessibility (missing label, aria-invalid desync, required not exposed, error text not shown or not linked, no focus after invalid submit).',
      safety: 'read',
      inputSchema: { type: 'object', properties: { form: formProperty, page: pageProperty } },
      handler: async (args: { form?: string; page?: string }) => {
        const state = formsState.value() as FormsState;
        if (!state.forms.length && !state.setupErrors?.length) return { markdown: noForms };
        return { markdown: lintFormsText(state, args ?? {}) };
      },
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:explain-custom-control',
      description:
        'Explain how a field is bound to its element (built-in accessor, custom ControlValueAccessor, custom control, [formField]) and what is wrong with it: value drift, missing setDisabledState, touched never set, captured NG01xxx setup errors.',
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: { form: formProperty, path: pathProperty, page: pageProperty },
      },
      handler: withForms(explainCustomControlText),
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:export-form',
      description:
        'Export a form as a JSON snapshot (tree, status, raw value) or as a test fixture (setValue / signal model plus the expected status) with a repro header. Secret values stay [redacted].',
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: {
          form: formProperty,
          format: { type: 'string', enum: ['snapshot', 'fixture'] },
          page: pageProperty,
        },
      },
      handler: withForms(exportFormText),
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:wait-for-form',
      description:
        'Wait until a form is settled (no pending async validation, debounce or submit in flight), valid, not pending, or submitted after a marker. Resolves as soon as the condition holds, or reports the state on timeout.',
      safety: 'read',
      inputSchema: {
        type: 'object',
        properties: {
          form: formProperty,
          until: { type: 'string', enum: ['settled', 'valid', 'not-pending', 'submitted'] },
          since: { type: 'number', description: 'Marker for `submitted`.' },
          timeoutMs: { type: 'number', description: 'Default 5000, max 30000.' },
          page: pageProperty,
        },
      },
      handler: async (args: {
        form?: string;
        until?: WaitUntil;
        since?: number;
        timeoutMs?: number;
        page?: string;
      }) => {
        const timeout = Math.min(Math.max(Number(args?.timeoutMs) || 5000, 100), 30_000);
        const start = Date.now();
        while (true) {
          const state = formsState.value() as FormsState;
          if (waitSatisfied(state, args ?? {})) {
            return {
              markdown: `Condition \`${args?.until ?? 'settled'}\` holds after ${Date.now() - start}ms. Marker: ${latestMarker(state)}.\n\n${explainFormsText(state, { form: args?.form, page: args?.page })}`,
            };
          }
          if (Date.now() - start >= timeout) {
            return {
              markdown: `Timed out after ${timeout}ms waiting for \`${args?.until ?? 'settled'}\`.\n\n${explainFormsText(state, { form: args?.form, page: args?.page })}`,
            };
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      },
    });

    const actionText = (result: Record<string, unknown>, state: FormsState) => {
      const lines = [
        result['ok']
          ? `Done: ${String(result['message'] ?? '')}`
          : `Refused: ${String(result['error'] ?? result['message'] ?? 'failed')}`,
      ];
      const skipped = Array.isArray(result['skipped'])
        ? (result['skipped'] as { path: string; reason: string }[])
        : [];
      if (skipped.length)
        lines.push(`Skipped: ${skipped.map((s) => `\`${s.path}\` ${s.reason}`).join('; ')}.`);
      if (typeof result['status'] === 'string') lines.push(`Form status now: ${result['status']}.`);
      const invalid = Array.isArray(result['invalid']) ? (result['invalid'] as string[]) : [];
      if (invalid.length)
        lines.push(`Fields with errors: ${invalid.map((p) => `\`${p || '(form)'}\``).join(', ')}.`);
      if (typeof result['expression'] === 'string') lines.push(`Console: ${result['expression']}`);
      if (typeof result['snapshot'] === 'string')
        lines.push(`Snapshot id: ${result['snapshot']} (use with restore).`);
      lines.push(
        `Marker: ${latestMarker(state)}. Call form-diff with since set to the marker you had before this action to see what changed.`,
      );
      return lines.join('\n');
    };

    ctx.agent.registerTool({
      id: 'ng-devtools:form-action',
      description:
        'Act on a live form (dev mode). Actions: set-value (mode code or user; user goes through the input like typing), mark-touched, mark-untouched, mark-dirty, mark-pristine, touch-all, revalidate (Signal Forms: reloads async/HTTP validation), reset, enable, disable (reactive only), submit, focus, focus-first-invalid, store-as-global ($form in the page console), snapshot, restore, instrument (value true or false: record the calling code of form changes, validator changes and template updates per keystroke, shown by form-history). reset, submit and restore need confirm: true. Secret, hidden and readonly fields are never written; disabled reactive fields need force.',
      safety: 'action',
      inputSchema: {
        type: 'object',
        required: ['action', 'form'],
        properties: {
          action: {
            type: 'string',
            enum: [
              'set-value',
              'mark-touched',
              'mark-untouched',
              'mark-dirty',
              'mark-pristine',
              'touch-all',
              'revalidate',
              'reset',
              'enable',
              'disable',
              'submit',
              'focus',
              'focus-first-invalid',
              'store-as-global',
              'snapshot',
              'restore',
              'instrument',
            ],
          },
          form: { type: 'string', description: 'Full form id, e.g. form-1@ab12.' },
          path: pathProperty,
          value: { description: 'New value for set-value.' },
          mode: { type: 'string', enum: ['code', 'user'] },
          confirm: { type: 'boolean' },
          force: { type: 'boolean' },
          snapshot: { type: 'string', description: 'Snapshot id for restore.' },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const state = formsState.value() as FormsState;
        if (!state.forms.length) return { markdown: noForms };
        const form = str(args?.['form']);
        const match = state.forms.find((f) => f.id === form || f.id.split('@')[0] === form);
        if (!match)
          return {
            markdown: `No form ${form ?? ''}. Forms: ${state.forms.map((f) => f.id).join(', ')}.`,
          };
        const { form: _form, ...rest } = args;
        const result = await requestFormAction({ ...rest, formId: match.id });
        return { markdown: actionText(result, formsState.value() as FormsState) };
      },
    });

    ctx.agent.registerTool({
      id: 'ng-devtools:fill-form',
      description:
        'Fill several fields at once, by dotted path, through the inputs like a user would (so parsing, dirty and touched run for real). Reports written and skipped fields (secret, hidden, readonly, disabled, missing) and the resulting status. Optionally submits afterwards (needs confirm: true).',
      safety: 'action',
      inputSchema: {
        type: 'object',
        required: ['form', 'values'],
        properties: {
          form: { type: 'string', description: 'Full form id, e.g. form-1@ab12.' },
          values: { type: 'object', description: 'Map of field path to value.' },
          mode: { type: 'string', enum: ['code', 'user'] },
          submit: { type: 'boolean' },
          confirm: { type: 'boolean' },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const state = formsState.value() as FormsState;
        if (!state.forms.length) return { markdown: noForms };
        const form = str(args?.['form']);
        const match = state.forms.find((f) => f.id === form || f.id.split('@')[0] === form);
        if (!match)
          return {
            markdown: `No form ${form ?? ''}. Forms: ${state.forms.map((f) => f.id).join(', ')}.`,
          };
        const result = await requestFormAction({
          action: 'fill',
          formId: match.id,
          values: args['values'],
          mode: args['mode'],
          submit: args['submit'],
          confirm: args['confirm'],
        });
        return { markdown: actionText(result, formsState.value() as FormsState) };
      },
    });
  },
});

export default ngDevtools;

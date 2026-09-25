// The NativeScript side of the overlay that needs no NativeScript import:
// Angular renders into `@nativescript/core` views instead of DOM elements, and
// these helpers let the shared collectors walk that view tree.

import {
  componentHosts,
  walkComponentTree,
  type AngularDebugApi,
  type ComponentTreeNode,
  type HostAdapter,
} from './overlay-core';

/**
 * The part of a `@nativescript/core` View the overlay touches. Structural, so
 * this file compiles and tests without the framework installed.
 */
export interface NativeView {
  readonly typeName: string;
  parent?: NativeView | null;
  eachChildView?(callback: (child: NativeView) => boolean): void;
  /** The element name a template used when it is not a registered view. */
  customCSSName?: string;
  borderWidth?: unknown;
  borderColor?: unknown;
}

export function viewChildren(view: NativeView): NativeView[] {
  const out: NativeView[] = [];
  view.eachChildView?.((child) => {
    out.push(child);
    return true;
  });
  return out;
}

/** The view at the top of the parent chain. */
export function topmostView(view: NativeView): NativeView {
  let current = view;
  while (current.parent) current = current.parent;
  return current;
}

/**
 * The host of the root component of the application that rendered `view`.
 * NativeScript makes the root component's template content the app's root
 * view and leaves the host above it without a parent link, so the host is
 * asked for through Angular rather than found by climbing.
 */
export function angularRootHost(
  ng: AngularDebugApi<NativeView>,
  view: NativeView,
): NativeView | null {
  try {
    for (const component of ng.getRootComponents?.(view) ?? []) {
      const host = ng.getHostElement?.(component);
      if (host) return host;
    }
  } catch {
    // the view was not rendered by Angular
  }
  return null;
}

/** Where a walk of the app should start, given the view NativeScript reports as root. */
export function nativeScriptRoot(ng: AngularDebugApi<NativeView>, view: NativeView): NativeView {
  return angularRootHost(ng, view) ?? topmostView(view);
}

/**
 * The selector of a component from its definition, so a host reports
 * `ns-person` whether the renderer gave it a proxy container or a real view.
 */
export function selectorOf(view: NativeView, component: unknown): string {
  const definition = (component as { constructor?: { ɵcmp?: { selectors?: unknown[][] } } } | null)
    ?.constructor?.ɵcmp;
  const first = definition?.selectors?.[0]?.[0];
  if (typeof first === 'string' && first) return first;
  return view.customCSSName ?? view.typeName.toLowerCase();
}

const ids = new WeakMap<NativeView, string>();
let idCounter = 0;

export const nativeViewAdapter: HostAdapter<NativeView> = {
  children: viewChildren,
  id: (view) => {
    let id = ids.get(view);
    if (!id) {
      id = `ngdt-${++idCounter}`;
      ids.set(view, id);
    }
    return id;
  },
  tagName: (view) => view.typeName,
  selector: selectorOf,
};

export function collectNativeScriptTree(
  root: NativeView | null | undefined,
  ng: AngularDebugApi<NativeView>,
): ComponentTreeNode[] {
  const nodes: ComponentTreeNode[] = [];
  if (root) walkComponentTree(root, nodes, ng, nativeViewAdapter);
  return nodes;
}

export function nativeScriptComponentHosts(
  root: NativeView | null | undefined,
  ng: AngularDebugApi<NativeView>,
): NativeView[] {
  return root ? componentHosts(root, ng, nativeViewAdapter) : [];
}

/**
 * The first view under `view` that draws something. A component host is
 * usually a ProxyViewContainer, which has no native view of its own.
 */
export function renderedView(view: NativeView): NativeView {
  let current = view;
  while (current.typeName === 'ProxyViewContainer') {
    const [first] = viewChildren(current);
    if (!first) break;
    current = first;
  }
  return current;
}

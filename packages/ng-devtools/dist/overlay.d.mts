//#region src/overlay.d.ts
export declare function initOverlay(options?: {
  baseURL?: string | string[];
}): Promise<() => void>;
export interface AngularDebugApi {
  getComponent(el: Element): unknown;
  getInjector?(el: Element): unknown;
  ɵgetSignalGraph?(injector: unknown): unknown;
}
export declare function collectComponentTree(): ComponentTreeNode[];
export interface ComponentTreeNode {
  id: string;
  selector: string;
  tagName: string;
  children: ComponentTreeNode[];
  inputs?: Record<string, unknown>;
}
export declare function walkAngularTree(el: Element, out: ComponentTreeNode[], ng: AngularDebugApi): void;
//#endregion
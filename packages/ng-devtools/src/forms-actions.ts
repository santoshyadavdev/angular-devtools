import {
  directivesOf,
  findFieldElement,
  isAbstractControl,
  nodeAt,
  serializeFormValue,
  type FormsDebugApi,
  type FoundForm,
} from './forms.ts';
import { redactReason } from './forms-privacy.ts';
import { fieldPath, submitSetup } from './forms-read.ts';

type AnyRecord = Record<string, any>;

export const FORM_ACTIONS = [
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
  'fill',
  'locate',
  'instrument',
  'pick',
] as const;

export type FormActionName = (typeof FORM_ACTIONS)[number];

export const CONFIRM_ACTIONS: FormActionName[] = ['reset', 'submit', 'restore'];

export interface FormActionRequest {
  action: FormActionName;
  formId?: string;
  path?: string;
  value?: unknown;
  values?: Record<string, unknown>;
  mode?: 'code' | 'user';
  confirm?: boolean;
  force?: boolean;
  submit?: boolean;
  snapshot?: string;
  selector?: string;
}

export interface Skipped {
  path: string;
  reason: string;
}

export interface FormActionResult {
  ok: boolean;
  message: string;
  error?: string;
  skipped?: Skipped[];
  status?: string;
  invalid?: string[];
  expression?: string;
  snapshot?: string;
  formId?: string;
  path?: string;
}

export interface ActionContext {
  ng: FormsDebugApi & { applyChanges?: (component: unknown) => void };
  forms: Map<string, FoundForm>;
  elements: WeakMap<object, Element>;
  all: () => Iterable<Element>;
}

let devtoolsDepth = 0;

export function isDevtoolsAction(): boolean {
  return devtoolsDepth > 0;
}

const snapshots = new Map<string, { formId: string; value: unknown; shape: string }>();
let snapshotSeq = 0;

function read<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export function isFormAction(value: unknown): value is FormActionRequest {
  if (!value || typeof value !== 'object') return false;
  const request = value as Partial<FormActionRequest>;
  return (
    typeof request.action === 'string' &&
    (FORM_ACTIONS as readonly string[]).includes(request.action) &&
    (request.formId === undefined ||
      (typeof request.formId === 'string' && request.formId.length < 80)) &&
    (request.path === undefined ||
      (typeof request.path === 'string' && request.path.length < 500)) &&
    (request.selector === undefined ||
      (typeof request.selector === 'string' && request.selector.length < 500)) &&
    (request.values === undefined ||
      (typeof request.values === 'object' &&
        request.values !== null &&
        Object.keys(request.values).length <= 200))
  );
}

function fail(error: string): FormActionResult {
  return { ok: false, message: error, error };
}

function shapeOf(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(shapeOf).join(',')}]`;
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return `{${Object.keys(value)
      .sort()
      .map((k) => `${k}:${shapeOf((value as AnyRecord)[k])}`)
      .join(',')}}`;
  }
  return '';
}

function rawValue(found: FoundForm, node: AnyRecord): unknown {
  if (found.kind === 'signal') return read(() => node['value'](), undefined);
  return read(
    () => node['getRawValue'](),
    read(() => node['value'], undefined),
  );
}

function lastKey(path: string, found: FoundForm): string {
  return path ? path.split('.').pop()! : '';
}

function isSecretPath(path: string): boolean {
  return path.split('.').some((key) => !!redactReason(key));
}

function elementFor(ctx: ActionContext, found: FoundForm, path: string): Element | null {
  return read(() => findFieldElement(ctx.ng, ctx.all(), found, path, ctx.elements), null);
}

function refusal(
  ctx: ActionContext,
  found: FoundForm,
  node: AnyRecord,
  path: string,
  force = false,
): string | null {
  const element = elementFor(ctx, found, path);
  if (isSecretPath(path) || (element && redactReason(lastKey(path, found), element))) {
    return 'looks secret (password, token, card…); DevTools never writes secret fields';
  }
  if (found.kind === 'signal') {
    if (read(() => node['hidden'](), false)) return 'is hidden';
    if (read(() => node['readonly'](), false)) return 'is readonly';
    if (read(() => node['disabled'](), false)) return 'is disabled by a disabled() rule';
    return null;
  }
  if (!force && read(() => node['disabled'], false)) return 'is disabled (pass force to write it)';
  return null;
}

function nativeWrite(element: Element, value: unknown): boolean {
  if (element instanceof HTMLInputElement) {
    if (element.type === 'file') return false;
    if (element.type === 'checkbox') {
      element.checked = !!value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    if (element.type === 'radio') {
      const scope = element.form ?? element.ownerDocument;
      const target = Array.from(scope.querySelectorAll('input[type="radio"]')).find(
        (radio) =>
          (radio as HTMLInputElement).name === element.name &&
          (radio as HTMLInputElement).value === String(value),
      ) as HTMLInputElement | undefined;
      if (!target) return false;
      target.checked = true;
      target.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    element.value = value == null ? '' : String(value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  if (element instanceof HTMLTextAreaElement) {
    element.value = value == null ? '' : String(value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }
  if (element instanceof HTMLSelectElement) {
    element.value = value == null ? '' : String(value);
    element.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  return false;
}

function writeValue(
  ctx: ActionContext,
  found: FoundForm,
  path: string,
  value: unknown,
  mode: 'code' | 'user',
  force: boolean,
): string | null {
  const node = nodeAt(found, path, true);
  if (!node) return 'does not exist';
  const refused = refusal(ctx, found, node, path, force);
  if (refused) return refused;
  const current = rawValue(found, node);
  if (current && typeof current === 'object' && shapeOf(current) !== shapeOf(value)) {
    if (!value || typeof value !== 'object') return 'is a group or array; pass an object or array';
  }
  const leaf = !current || typeof current !== 'object' || current instanceof Date;
  const element = leaf ? elementFor(ctx, found, path) : null;
  const viaDom = element && (mode === 'user' || found.kind === 'template');
  if (viaDom && nativeWrite(element, value)) {
    if (mode === 'user') element.dispatchEvent(new Event('blur'));
    return null;
  }
  if (found.kind === 'template' && leaf) {
    const dir = directivesOf(node);
    if (!dir || typeof dir['viewToModelUpdate'] !== 'function') {
      return 'is an ngModel without a native input; set the component property instead';
    }
    node['setValue'](value);
    dir['viewToModelUpdate'](value);
    return null;
  }
  if (found.kind === 'signal') {
    if (mode === 'user' && typeof node['controlValue']?.set === 'function') {
      node['controlValue'].set(value);
      node['markAsDirty']?.();
    } else node['value'].set(value);
    return null;
  }
  if (Array.isArray(current) || !leaf) node['patchValue'](value);
  else node['setValue'](value);
  if (mode === 'user') {
    node['markAsDirty']?.();
    node['markAsTouched']?.();
  }
  return null;
}

function invalidPaths(found: FoundForm): string[] {
  const out: string[] = [];
  const visit = (node: AnyRecord, path: string, depth: number) => {
    if (depth > 12 || out.length > 50) return;
    if (found.kind === 'signal') {
      const children = read(() => node['structure'].materializedChildren() as AnyRecord[], []);
      const ownErrors = read(() => (node['errors']() as unknown[]).length, 0);
      if (ownErrors) out.push(path);
      for (const child of children) {
        const key = String(read(() => child['keyInParent'](), ''));
        visit(child, path ? `${path}.${key}` : key, depth + 1);
      }
      return;
    }
    const errors = read(() => node['errors'], null);
    if (errors && Object.keys(errors).length) out.push(path);
    const controls = read(() => node['controls'], null);
    if (!controls) return;
    const entries: [string, AnyRecord][] = Array.isArray(controls)
      ? controls.map((c, i) => [String(i), c])
      : Object.entries(controls);
    for (const [key, child] of entries) visit(child, path ? `${path}.${key}` : key, depth + 1);
  };
  visit(found.root, '', 0);
  return out;
}

function statusOf(found: FoundForm): string {
  if (found.kind === 'signal') {
    const root = found.root;
    if (read(() => root['pending'](), false)) return 'PENDING';
    if (read(() => root['invalid'](), false)) return 'INVALID';
    return 'VALID';
  }
  return String(read(() => found.root['status'], 'VALID'));
}

async function settle(ctx: ActionContext, found: FoundForm, timeout = 2000) {
  read(() => found.owner && ctx.ng.applyChanges?.(found.owner), undefined);
  const start = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 30));
  while (statusOf(found) === 'PENDING' && Date.now() - start < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  read(() => found.owner && ctx.ng.applyChanges?.(found.owner), undefined);
}

function directiveWith(ctx: ActionContext, element: Element | undefined, method: string) {
  if (!element) return null;
  const directives = read(() => ctx.ng.getDirectives(element) ?? [], [] as unknown[]);
  return (directives.find((d) => typeof (d as AnyRecord)?.[method] === 'function') ??
    null) as AnyRecord | null;
}

function expressionFor(found: FoundForm, path: string): string {
  if (!path) return '$form';
  if (found.kind === 'signal') {
    return `$form${path
      .split('.')
      .map((key) => (/^\d+$/.test(key) ? `[${key}]` : `.${key}`))
      .join('')}`;
  }
  return `$form.get('${path.replace(/'/g, "\\'")}')`;
}

function locate(ctx: ActionContext, selector: string): FormActionResult {
  let target: Element | null = null;
  try {
    target = document.querySelector(selector);
  } catch {
    return fail(`${selector} is not a valid CSS selector.`);
  }
  if (!target) return fail(`Nothing on the page matches ${selector}.`);
  return locateElement(ctx, target) ?? fail(`${selector} is not bound to a form field.`);
}

export function locateElement(ctx: ActionContext, target: Element): FormActionResult | null {
  const directives = read(() => ctx.ng.getDirectives(target) ?? [], [] as unknown[]) as AnyRecord[];
  for (const [formId, found] of ctx.forms) {
    for (const dir of directives) {
      const state = read(() => dir['state']?.() as AnyRecord | undefined, undefined);
      if (state && read(() => state['structure'].root, null) === found.root) {
        return { ok: true, message: 'Found', formId, path: fieldPath(state) };
      }
      const control = read(() => dir['control'] as unknown, undefined);
      if (isAbstractControl(control) && read(() => control['root'], null) === found.root) {
        return { ok: true, message: 'Found', formId, path: controlPath(found.root, control) };
      }
    }
  }
  return null;
}

function controlPath(root: AnyRecord, target: AnyRecord): string {
  const keys: string[] = [];
  let current: AnyRecord | null = target;
  for (let guard = 0; current && current !== root && guard < 64; guard++) {
    const parent: AnyRecord | null = read(() => current!['parent'], null);
    if (!parent) break;
    const controls = read(() => parent['controls'], {});
    const key = Array.isArray(controls)
      ? String(controls.indexOf(current))
      : Object.keys(controls).find((k) => controls[k] === current);
    keys.unshift(key ?? '?');
    current = parent;
  }
  return keys.join('.');
}

export async function runFormAction(
  ctx: ActionContext,
  request: FormActionRequest,
): Promise<FormActionResult> {
  if (request.action === 'locate') {
    if (!request.selector) return fail('Pass a CSS selector.');
    return locate(ctx, request.selector);
  }
  const found = request.formId ? ctx.forms.get(request.formId) : ctx.forms.values().next().value;
  if (!found) return fail(`No form ${request.formId ?? ''} on this page.`);
  if (CONFIRM_ACTIONS.includes(request.action) || (request.action === 'fill' && request.submit)) {
    if (request.confirm !== true) {
      return fail(`${request.action} changes app state; call again with confirm: true.`);
    }
  }
  const path = request.path ?? '';
  devtoolsDepth++;
  try {
    const result = await perform(ctx, found, request, path);
    if (result.ok && !['focus', 'store-as-global', 'snapshot'].includes(request.action)) {
      await settle(ctx, found);
    }
    return { ...result, status: statusOf(found), invalid: invalidPaths(found).slice(0, 20) };
  } catch (error) {
    return fail(String((error as Error)?.message ?? error).slice(0, 300));
  } finally {
    devtoolsDepth--;
  }
}

async function perform(
  ctx: ActionContext,
  found: FoundForm,
  request: FormActionRequest,
  path: string,
): Promise<FormActionResult> {
  const signal = found.kind === 'signal';
  const node = () => nodeAt(found, path, true);
  const need = () => {
    const n = node();
    if (!n) throw new Error(`No field at ${path || '(form)'}.`);
    return n;
  };
  switch (request.action) {
    case 'set-value': {
      const problem = writeValue(
        ctx,
        found,
        path,
        request.value,
        request.mode ?? 'code',
        !!request.force,
      );
      return problem
        ? { ...fail(`${path || '(form)'} ${problem}.`), skipped: [{ path, reason: problem }] }
        : { ok: true, message: `Set ${path || '(form)'}.` };
    }
    case 'fill': {
      const skipped: Skipped[] = [];
      let written = 0;
      for (const [fieldPathKey, value] of Object.entries(request.values ?? {})) {
        const problem = writeValue(ctx, found, fieldPathKey, value, request.mode ?? 'user', false);
        if (problem) skipped.push({ path: fieldPathKey, reason: problem });
        else written++;
      }
      let message = `Wrote ${written} field(s)${skipped.length ? `, skipped ${skipped.length}` : ''}.`;
      if (request.submit) {
        await settle(ctx, found);
        const submitted = await perform(ctx, found, { ...request, action: 'submit' }, '');
        message += ` ${submitted.message}`;
      }
      return { ok: written > 0 || !skipped.length, message, skipped };
    }
    case 'mark-touched':
    case 'mark-untouched':
    case 'mark-dirty':
    case 'mark-pristine': {
      const n = need();
      const method = {
        'mark-touched': 'markAsTouched',
        'mark-untouched': 'markAsUntouched',
        'mark-dirty': 'markAsDirty',
        'mark-pristine': 'markAsPristine',
      }[request.action];
      if (signal && read(() => n['nodeState']['isNonInteractive'](), false)) {
        return {
          ok: false,
          message: `${path || '(form)'} is hidden, disabled or readonly, so Signal Forms ignores touched and dirty on it.`,
        };
      }
      n[method]();
      return { ok: true, message: `${method} on ${path || '(form)'}.` };
    }
    case 'touch-all': {
      const n = need();
      if (signal) n['markAsTouched']();
      else n['markAllAsTouched']();
      return { ok: true, message: 'Marked every interactive field as touched.' };
    }
    case 'revalidate': {
      const n = need();
      if (signal) {
        if (typeof n['reloadValidation'] !== 'function')
          return fail('This Angular version has no reloadValidation.');
        n['reloadValidation']();
        return { ok: true, message: 'Reloaded async validation (HTTP validators fire again).' };
      }
      n['updateValueAndValidity']();
      return { ok: true, message: `Revalidated ${path || '(form)'}.` };
    }
    case 'reset': {
      need()['reset']();
      return { ok: true, message: `Reset ${path || '(form)'}.` };
    }
    case 'enable':
    case 'disable': {
      if (signal) {
        return fail(
          'Signal Forms fields are disabled by disabled() rules in the schema, not imperatively. Change the rule or the value it reads.',
        );
      }
      const n = need();
      if (found.kind === 'template' && path) {
        const dir = directivesOf(n);
        if (dir) {
          return fail(
            'This field uses ngModel, which syncs disabled from its [disabled] input on the next change detection. Change the bound property instead.',
          );
        }
      }
      n[request.action]();
      return {
        ok: true,
        message: `${request.action === 'enable' ? 'Enabled' : 'Disabled'} ${path || '(form)'}.`,
      };
    }
    case 'submit': {
      if (signal) {
        const setup = submitSetup(found.root);
        const formRoot = directiveWith(ctx, found.formElement, 'onSubmit');
        if (formRoot) {
          formRoot['onSubmit'](new Event('submit', { cancelable: true }));
          return {
            ok: true,
            message: setup.willRun
              ? 'Submitted through the form root; the action runs.'
              : 'Submitted through the form root; the form is invalid, so the action did not run (fields are now touched).',
          };
        }
        return fail(
          setup.hasAction
            ? 'This Signal Form has no [formRoot] element to submit through. Call submit(form) from app code.'
            : 'This Signal Form has no submission action (NG01915 on submit). Add { submission: { action } } to form().',
        );
      }
      const el = found.formElement;
      if (el instanceof HTMLFormElement) {
        if (!el.noValidate && !el.checkValidity()) {
          return fail(
            'The browser would block this submit: native validation fails and the form has no novalidate.',
          );
        }
        el.requestSubmit();
        return {
          ok: true,
          message: 'Submitted the <form> (ngSubmit fires even when the form is invalid).',
        };
      }
      const dir = found.directive;
      if (dir && typeof dir['onSubmit'] === 'function') {
        dir['onSubmit'](new Event('submit', { cancelable: true }));
        return {
          ok: true,
          message: 'Called onSubmit on the form directive (it is not on a <form>).',
        };
      }
      return fail('No form element or form directive to submit.');
    }
    case 'focus': {
      const el = elementFor(ctx, found, path);
      if (!(el instanceof HTMLElement))
        return fail(`${path || '(form)'} is not bound to an element.`);
      el.scrollIntoView?.({ block: 'center' });
      el.focus();
      return { ok: true, message: `Focused ${path || '(form)'}.` };
    }
    case 'focus-first-invalid': {
      const candidates = invalidPaths(found)
        .map((p) => ({ path: p, el: elementFor(ctx, found, p) }))
        .filter((c): c is { path: string; el: HTMLElement } => c.el instanceof HTMLElement);
      candidates.sort((a, b) =>
        a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      );
      const first = candidates[0];
      if (!first) return fail('No invalid field is bound to an element.');
      first.el.scrollIntoView?.({ block: 'center' });
      first.el.focus();
      return { ok: true, message: `Focused ${first.path}.`, path: first.path };
    }
    case 'store-as-global': {
      const target = signal ? read(() => found.root['fieldTree'], found.root) : found.root;
      const w = window as unknown as AnyRecord;
      w['$form'] = target;
      w['$control'] = signal ? read(() => nodeAt(found, path, true)?.['fieldTree'], null) : node();
      const expression = expressionFor(found, path);
      return {
        ok: true,
        message:
          `Stored as $form in the page console. ${path ? `The field is ${expression} (also $control).` : ''}`.trim(),
        expression,
      };
    }
    case 'snapshot': {
      const value = rawValue(found, found.root);
      const id = `s${++snapshotSeq}`;
      snapshots.set(id, {
        formId: request.formId ?? '',
        value: structuredCloneSafe(value),
        shape: shapeOf(value),
      });
      if (snapshots.size > 20) snapshots.delete(snapshots.keys().next().value!);
      return { ok: true, message: `Saved snapshot ${id}.`, snapshot: id };
    }
    case 'restore': {
      const saved = request.snapshot ? snapshots.get(request.snapshot) : undefined;
      if (!saved)
        return fail(`No snapshot ${request.snapshot ?? ''} (snapshots live until reload).`);
      if (shapeOf(rawValue(found, found.root)) !== saved.shape) {
        return fail(
          'The form structure changed since the snapshot (arrays or groups differ), so it cannot be restored.',
        );
      }
      if (signal) found.root['value'].set(structuredCloneSafe(saved.value));
      else found.root['patchValue'](saved.value);
      return { ok: true, message: `Restored snapshot ${request.snapshot}.` };
    }
    default:
      return fail('Unknown action.');
  }
}

function structuredCloneSafe<T>(value: T): T {
  try {
    return structuredClone(value);
  } catch {
    return serializeFormValue(value) as T;
  }
}

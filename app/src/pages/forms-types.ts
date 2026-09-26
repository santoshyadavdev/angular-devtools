import type { DevframeRpcClient } from 'devframe/client';

export type FieldStatus = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';

export interface FormFieldError {
  kind: string;
  message: string;
  source?: string;
  from?: string;
}

export interface FormFieldNode {
  key: string;
  path: string;
  type: 'group' | 'array' | 'control';
  status: FieldStatus;
  touched: boolean;
  dirty: boolean;
  required?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  disabledReasons?: string[];
  updateOn?: 'blur' | 'submit';
  materialized?: false;
  bound: boolean;
  constraints?: Record<string, number | string>;
  submitting?: boolean;
  debouncing?: boolean;
  validators?: { sync: boolean; async: boolean };
  defaultValue?: unknown;
  accessor?: string;
  value?: unknown;
  errors: FormFieldError[];
  children?: FormFieldNode[];
  truncated?: number;
  skipped?: string;
  stale?: string[];
  uncommitted?: unknown;
  changed?: boolean;
  redacted?: string;
  pendingSince?: number;
  dom?: { errorShown?: boolean; drift?: string | true; labelled?: boolean };
}

export interface CollectedForm {
  id: string;
  kind: 'signal' | 'reactive' | 'template';
  owner: string;
  property?: string;
  label: string;
  submitted?: boolean;
  submit?: { hasAction: boolean; willRun: boolean; submitting: boolean };
  submitDom?: { reasons: string[] };
  root: FormFieldNode;
}

export interface FormEvent {
  formId: string;
  path: string;
  type: string;
  detail?: string;
  timestamp: number;
  seq?: number;
  origin?: string;
  prev?: string;
  count?: number;
  outcome?: string;
  caller?: string;
  ms?: number;
  renders?: number;
  rendered?: string[];
}

export interface FormLintFinding {
  rule: string;
  severity: 'error' | 'warning' | 'info';
  form: string;
  label: string;
  path?: string;
  message: string;
  fix: string;
}

export interface FormActionResult {
  ok: boolean;
  message?: string;
  error?: string;
  skipped?: { path: string; reason: string }[];
  status?: string;
  snapshot?: string;
  expression?: string;
}

export const KIND_LABELS: Record<CollectedForm['kind'], string> = {
  signal: 'Signal Forms',
  reactive: 'Reactive',
  template: 'Template-driven',
};

export const SOURCE_LABELS: Record<string, string> = {
  own: 'validator',
  directive: 'template attribute',
  tree: 'cross-field rule',
  async: 'async',
  parse: 'parse',
  submission: 'server',
  schema: 'schema',
  manual: 'setErrors',
};

export function formsCall<T>(
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

export async function formAction(
  client: DevframeRpcClient | null,
  request: Record<string, unknown>,
): Promise<FormActionResult> {
  const result = await formsCall<FormActionResult>(client, 'request-form-action', request);
  return result ?? { ok: false, error: 'The devtools server did not answer.' };
}

export function actionMessage(result: FormActionResult): string {
  const text = result.ok ? (result.message ?? 'Done.') : (result.error ?? 'Failed.');
  const skipped = result.skipped?.length
    ? ` Skipped: ${result.skipped.map((s) => `${s.path} (${s.reason})`).join(', ')}.`
    : '';
  return `${text}${skipped}${result.status ? ` Status: ${result.status}.` : ''}`;
}

export function plain(text: string | null): string {
  return (text ?? '')
    .replace(/^_Labels, paths.*_\n\n/, '')
    .replace(/`/g, '')
    .replace(/\*\*/g, '');
}

export const FORMS_STYLES = `
  .muted {
    color: #a1a1aa;
  }
  .small {
    padding: 4px 10px;
    border: 1px solid #52525b;
    border-radius: 6px;
    background: #18181b;
    color: #e4e4e7;
    font-size: 12px;
    cursor: pointer;
  }
  .small:hover {
    border-color: var(--accent);
  }
  .small:focus-visible,
  .field-input:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  .field-input {
    padding: 4px 8px;
    background: #18181b;
    border: 1px solid #52525b;
    border-radius: 6px;
    color: #e4e4e7;
    font-size: 13px;
  }
  .explain {
    margin: 0;
    padding: 10px;
    border: 1px solid #27272a;
    border-radius: 6px;
    color: #e4e4e7;
    font-size: 12px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    font-family: ui-monospace, monospace;
  }
  .tag {
    display: inline-block;
    margin: 0 4px 2px 0;
    padding: 0 5px;
    border: 1px solid #3f3f46;
    border-radius: 4px;
    color: #d4d4d8;
    font-size: 11px;
  }
  .tag[data-tone='warn'] {
    border-color: #a16207;
    color: #fef08a;
  }
  .tag[data-tone='bad'] {
    border-color: #b91c1c;
    color: #fecaca;
  }
  .status {
    min-height: 1.2em;
    margin: 0;
    color: #d4d4d8;
    font-size: 13px;
  }
`;

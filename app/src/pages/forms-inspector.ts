import { Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import type { DevframeRpcClient } from 'devframe/client';

type FieldStatus = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';

interface FormFieldError {
  kind: string;
  message: string;
}

interface FormFieldNode {
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
}

interface CollectedForm {
  id: string;
  kind: 'signal' | 'reactive' | 'template';
  owner: string;
  property?: string;
  label: string;
  submitted?: boolean;
  root: FormFieldNode;
}

interface FormEvent {
  formId: string;
  path: string;
  type: string;
  detail?: string;
  timestamp: number;
  seq?: number;
}

interface FormsSnapshot {
  forms?: CollectedForm[];
  events?: FormEvent[];
}

interface FieldRow {
  node: FormFieldNode;
  depth: number;
}

const KIND_LABELS: Record<CollectedForm['kind'], string> = {
  signal: 'Signal Forms',
  reactive: 'Reactive',
  template: 'Template-driven',
};

function countErrors(node: FormFieldNode): number {
  return node.errors.length + (node.children ?? []).reduce((sum, c) => sum + countErrors(c), 0);
}

function countFields(node: FormFieldNode): number {
  return 1 + (node.children ?? []).reduce((sum, c) => sum + countFields(c), 0);
}

@Component({
  selector: 'app-forms-inspector',
  imports: [JsonPipe],
  template: `
    @if (!rpc()) {
      <p class="empty">Connecting…</p>
    } @else if (failed()) {
      <p class="empty">Could not load forms from the devtools server. Reload to try again.</p>
    } @else if (loading()) {
      <p class="empty">Loading forms…</p>
    } @else if (!forms().length) {
      <div class="empty">
        <p>No forms on the page yet.</p>
        <p class="muted">
          Open a page that renders a form. Signal Forms, reactive and template-driven forms all show
          up here, in development builds.
        </p>
      </div>
    } @else {
      <div class="layout">
        <ul class="form-list" aria-label="Forms on the page">
          @for (form of forms(); track form.id) {
            <li>
              <button
                type="button"
                class="form-item"
                [class.active]="form.id === selected()?.id"
                [attr.aria-current]="form.id === selected()?.id ? 'true' : null"
                (click)="selectForm(form.id)"
              >
                <span class="dot" [attr.data-status]="form.root.status" aria-hidden="true"></span>
                <span class="label">{{ form.label }}</span>
                <span class="kind"
                  >{{ kindLabel(form.kind) }} · {{ form.id }}
                  <span class="sr-only">, {{ form.root.status }}</span></span
                >
                @if (counts().get(form.id)?.errors; as count) {
                  <span class="count">{{ count }}<span class="sr-only"> errors</span></span>
                }
              </button>
            </li>
          }
        </ul>

        @if (selected(); as form) {
          <section class="detail" [attr.aria-label]="form.label">
            <div class="summary">
              <span class="badge" [attr.data-status]="form.root.status">{{
                form.root.status
              }}</span>
              <span>{{ form.root.dirty ? 'dirty' : 'pristine' }}</span>
              <span>{{ form.root.touched ? 'touched' : 'untouched' }}</span>
              @if (form.submitted !== undefined) {
                <span>{{ form.submitted ? 'submitted' : 'not submitted' }}</span>
              }
              @if (form.root.submitting) {
                <span>submitting</span>
              }
              <span class="muted"
                >{{ counts().get(form.id)?.fields }} fields,
                {{ counts().get(form.id)?.errors }} errors</span
              >
            </div>

            <input
              class="filter"
              type="search"
              placeholder="Filter fields by path"
              aria-label="Filter fields by path"
              [value]="filter()"
              (input)="onFilter($event)"
            />

            <div class="table-scroll" role="region" aria-label="Fields" tabindex="0">
              <table class="fields">
                <thead>
                  <tr>
                    <th scope="col">Field</th>
                    <th scope="col">Value</th>
                    <th scope="col">Status</th>
                    <th scope="col">State</th>
                    <th scope="col">Errors</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of rows(); track row.node.path) {
                    <tr
                      [class.invalid]="row.node.errors.length"
                      (mouseenter)="highlight(form.id, row.node.path)"
                      (mouseleave)="highlight(null, '')"
                    >
                      <th scope="row" [style.padding-left.px]="8 + row.depth * 16">
                        <button
                          type="button"
                          class="field"
                          [attr.aria-label]="
                            'Highlight ' + (row.node.path || 'the form') + ' on the page'
                          "
                          (focus)="highlight(form.id, row.node.path)"
                          (blur)="highlight(null, '')"
                        >
                          {{ row.node.key || '(form)' }}
                        </button>
                        <span class="type">{{ row.node.type }}</span>
                      </th>
                      <td class="value">
                        @if (row.node.type === 'control') {
                          <code>{{ row.node.value | json }}</code>
                          @if (row.node.defaultValue !== undefined) {
                            <div class="muted">
                              resets to <code>{{ row.node.defaultValue | json }}</code>
                            </div>
                          }
                        }
                      </td>
                      <td>
                        @if (row.node.materialized === false) {
                          <span class="muted">not created yet</span>
                        } @else {
                          <span class="badge" [attr.data-status]="row.node.status">{{
                            row.node.status
                          }}</span>
                        }
                      </td>
                      <td class="flags">
                        @if (row.node.touched) {
                          <span>touched</span>
                        }
                        @if (row.node.dirty) {
                          <span>dirty</span>
                        }
                        @if (row.node.required) {
                          <span>required</span>
                        }
                        @if (row.node.readonly) {
                          <span>readonly</span>
                        }
                        @if (row.node.hidden) {
                          <span>hidden</span>
                        }
                        @if (row.node.updateOn) {
                          <span>updates on {{ row.node.updateOn }}</span>
                        }
                        @if (row.node.debouncing) {
                          <span>debouncing</span>
                        }
                        @if (row.node.validators?.sync) {
                          <span>validators</span>
                        }
                        @if (row.node.validators?.async) {
                          <span>async validator</span>
                        }
                        @for (rule of constraintList(row.node); track rule) {
                          <span>{{ rule }}</span>
                        }
                        @if (row.node.accessor) {
                          <span>{{ row.node.accessor }}</span>
                        }
                        @for (reason of row.node.disabledReasons ?? []; track $index) {
                          <span>disabled: {{ reason }}</span>
                        }
                      </td>
                      <td class="errors">
                        @for (error of row.node.errors; track $index) {
                          <div>
                            {{ errorText(row.node, error) }}
                            <code class="kind-tag">{{ error.kind }}</code>
                          </div>
                        }
                      </td>
                    </tr>
                    @if (row.node.truncated) {
                      <tr>
                        <td colspan="5" class="muted" [style.padding-left.px]="24 + row.depth * 16">
                          {{ row.node.truncated }} more fields under
                          {{ row.node.path || 'the form' }} not shown
                        </td>
                      </tr>
                    }
                  } @empty {
                    <tr>
                      <td colspan="5" class="muted">No field path matches "{{ filter() }}".</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <h2>Recent changes</h2>
            @if (selectedEvents().length) {
              <ol class="events">
                @for (event of selectedEvents(); track event.formId + '#' + event.seq) {
                  <li>
                    <time>{{ time(event.timestamp) }}</time>
                    <code>{{ event.path || '(form)' }}</code>
                    <span class="event-type">{{ event.type }}</span>
                    @if (event.detail) {
                      <span class="muted">{{ event.detail }}</span>
                    }
                  </li>
                }
              </ol>
            } @else {
              <p class="muted">No changes yet. Type into the form to see them here.</p>
            }
          </section>
        }
      </div>
    }
  `,
  styles: `
    .layout {
      display: grid;
      grid-template-columns: minmax(200px, 260px) minmax(0, 1fr);
      gap: 16px;
    }
    @media (max-width: 720px) {
      .layout {
        grid-template-columns: 1fr;
      }
    }
    .form-list {
      display: grid;
      gap: 4px;
      align-content: start;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .form-item {
      width: 100%;
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-areas: 'dot label count' '. kind kind';
      gap: 2px 8px;
      align-items: center;
      padding: 8px 10px;
      border: 1px solid #27272a;
      border-radius: 6px;
      background: transparent;
      color: #e4e4e7;
      text-align: left;
      cursor: pointer;
    }
    .form-item.active {
      border-color: var(--accent);
      background: #18181b;
    }
    .form-item .dot {
      grid-area: dot;
    }
    .form-item .label {
      grid-area: label;
      overflow-wrap: anywhere;
      font-size: 13px;
    }
    .form-item .kind {
      grid-area: kind;
      color: #a1a1aa;
      font-size: 12px;
    }
    .form-item .count {
      grid-area: count;
      padding: 0 6px;
      border-radius: 999px;
      background: #7f1d1d;
      color: #fecaca;
      font-size: 12px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
    }
    .dot[data-status='INVALID'] {
      background: #ef4444;
    }
    .dot[data-status='PENDING'] {
      background: #eab308;
    }
    .dot[data-status='DISABLED'] {
      background: #71717a;
    }
    .detail {
      display: grid;
      gap: 12px;
      min-width: 0;
    }
    .summary {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 14px;
      align-items: center;
      color: #d4d4d8;
      font-size: 13px;
    }
    .badge {
      padding: 1px 6px;
      border-radius: 4px;
      background: #14532d;
      color: #bbf7d0;
      font-size: 11px;
      font-weight: 600;
    }
    .badge[data-status='INVALID'] {
      background: #7f1d1d;
      color: #fecaca;
    }
    .badge[data-status='PENDING'] {
      background: #713f12;
      color: #fef08a;
    }
    .badge[data-status='DISABLED'] {
      background: #3f3f46;
      color: #e4e4e7;
    }
    .filter {
      padding: 8px 12px;
      background: #18181b;
      border: 1px solid #52525b;
      border-radius: 6px;
      color: #e4e4e7;
      font-size: 14px;
    }
    .filter:focus-visible,
    .form-item:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .table-scroll {
      overflow-x: auto;
    }
    .table-scroll:focus-visible,
    .field:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .field {
      padding: 0;
      border: none;
      background: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    .fields {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .fields th,
    .fields td {
      padding: 6px 8px;
      border-bottom: 1px solid #27272a;
      text-align: left;
      vertical-align: top;
    }
    .fields thead th {
      color: #a1a1aa;
      font-weight: 500;
    }
    .fields tbody th {
      color: #e4e4e7;
      font-weight: 500;
      white-space: nowrap;
    }
    .fields tbody tr:hover {
      background: #18181b;
    }
    .type {
      margin-left: 6px;
      color: #a1a1aa;
      font-size: 11px;
      font-weight: 400;
    }
    .value code,
    .errors code,
    .events code {
      color: #c4b5fd;
      overflow-wrap: anywhere;
    }
    .flags span {
      display: inline-block;
      margin: 0 4px 2px 0;
      padding: 0 5px;
      border: 1px solid #3f3f46;
      border-radius: 4px;
      color: #d4d4d8;
      font-size: 11px;
    }
    .errors div {
      color: #fca5a5;
    }
    .kind-tag {
      margin-left: 6px;
      color: #a1a1aa;
      font-size: 11px;
    }
    h2 {
      margin: 8px 0 0;
      color: #d4d4d8;
      font-size: 14px;
    }
    .events {
      display: grid;
      gap: 4px;
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 13px;
    }
    .events li {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      color: #d4d4d8;
    }
    .events time {
      color: #a1a1aa;
      font-variant-numeric: tabular-nums;
    }
    .event-type {
      color: #93c5fd;
    }
    .muted {
      color: #a1a1aa;
    }
    .empty {
      padding: 32px;
      text-align: center;
      color: #d4d4d8;
    }
  `,
})
export class FormsInspector {
  rpc = input<DevframeRpcClient | null>(null);

  readonly forms = signal<CollectedForm[]>([]);
  readonly events = signal<FormEvent[]>([]);
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly selectedId = signal<string | null>(null);
  readonly filter = signal('');

  private unsubscribe: (() => void) | null = null;
  private readonly destroyRef = inject(DestroyRef);

  readonly counts = computed(
    () =>
      new Map(
        this.forms().map((form) => [
          form.id,
          { fields: countFields(form.root), errors: countErrors(form.root) },
        ]),
      ),
  );

  readonly selected = computed(() => {
    const forms = this.forms();
    return forms.find((f) => f.id === this.selectedId()) ?? forms[0] ?? null;
  });

  readonly rows = computed(() => {
    const form = this.selected();
    if (!form) return [];
    const query = this.filter().toLowerCase();
    const rows: FieldRow[] = [];
    const visit = (node: FormFieldNode, depth: number): boolean => {
      const at = rows.length;
      let keep = !query || node.path.toLowerCase().includes(query);
      for (const child of node.children ?? []) keep = visit(child, depth + 1) || keep;
      if (keep) rows.splice(at, 0, { node, depth });
      return keep;
    };
    visit(form.root, 0);
    return rows;
  });

  readonly selectedEvents = computed(() => {
    const id = this.selected()?.id;
    return this.events()
      .filter((e) => e.formId === id)
      .slice(-50)
      .reverse();
  });

  constructor() {
    effect(() => {
      const client = this.rpc();
      if (client) this.load(client);
    });
    this.destroyRef.onDestroy(() => {
      this.unsubscribe?.();
      this.highlight(null, '');
    });
  }

  async load(client: DevframeRpcClient) {
    this.loading.set(true);
    this.failed.set(false);
    try {
      const state = await client.scope('ng-devtools').rpc.sharedState('forms');
      if (this.destroyRef.destroyed) return;
      const apply = (value: unknown) => {
        const snapshot = value as FormsSnapshot | undefined;
        this.forms.set(snapshot?.forms ?? []);
        this.events.set(snapshot?.events ?? []);
      };
      apply(state.value());
      this.unsubscribe?.();
      this.unsubscribe = state.on('updated', apply);
    } catch {
      this.failed.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  selectForm(id: string) {
    this.selectedId.set(id);
    this.filter.set('');
  }

  onFilter(event: Event) {
    this.filter.set((event.target as HTMLInputElement).value);
  }

  highlight(formId: string | null, path: string) {
    const client = this.rpc();
    if (!client) return;
    void client
      .scope('ng-devtools')
      .rpc.callEvent('request-form-highlight', formId ? { formId, path } : null);
  }

  kindLabel(kind: CollectedForm['kind']) {
    return KIND_LABELS[kind];
  }

  constraintList(node: FormFieldNode) {
    return Object.entries(node.constraints ?? {}).map(([name, value]) => `${name} ${value}`);
  }

  errorText(node: FormFieldNode, error: FormFieldError) {
    return /^[a-z]/.test(error.message)
      ? `${node.key || 'The form'} ${error.message}`
      : error.message;
  }

  time(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }
}

import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { JsonPipe } from '@angular/common';
import type { DevframeRpcClient } from 'devframe/client';
import { FormsFieldDetail } from './forms-field-detail';
import { FormsLint, FormsSubmit } from './forms-report';
import { FormsTimeline } from './forms-timeline';
import {
  FORMS_STYLES,
  KIND_LABELS,
  SOURCE_LABELS,
  actionMessage,
  formAction,
  type CollectedForm,
  type FormEvent,
  type FormFieldError,
  type FormFieldNode,
} from './forms-types';

type Tab = 'fields' | 'timeline' | 'submit' | 'lint';
type Chip = 'invalid' | 'dirty' | 'touched' | 'disabled' | 'hidden-error';

const TABS: { id: Tab; label: string }[] = [
  { id: 'fields', label: 'Fields' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'submit', label: 'Submit' },
  { id: 'lint', label: 'Lint' },
];

const CHIPS: { id: Chip; label: string }[] = [
  { id: 'invalid', label: 'Invalid' },
  { id: 'dirty', label: 'Dirty' },
  { id: 'touched', label: 'Touched' },
  { id: 'disabled', label: 'Disabled' },
  { id: 'hidden-error', label: 'Error not shown' },
];

function matchesChip(node: FormFieldNode, chip: Chip): boolean {
  switch (chip) {
    case 'invalid':
      return node.errors.length > 0;
    case 'dirty':
      return node.dirty && node.type === 'control';
    case 'touched':
      return node.touched && node.type === 'control';
    case 'disabled':
      return node.status === 'DISABLED';
    case 'hidden-error':
      return node.dom?.errorShown === false;
  }
}

interface FormsSnapshot {
  forms?: CollectedForm[];
  events?: FormEvent[];
  instrumented?: string[];
}

interface FieldRow {
  node: FormFieldNode;
  depth: number;
}

function countErrors(node: FormFieldNode): number {
  return node.errors.length + (node.children ?? []).reduce((sum, c) => sum + countErrors(c), 0);
}

function countFields(node: FormFieldNode): number {
  return 1 + (node.children ?? []).reduce((sum, c) => sum + countFields(c), 0);
}

@Component({
  selector: 'app-forms-inspector',
  imports: [JsonPipe, FormsFieldDetail, FormsTimeline, FormsSubmit, FormsLint],
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

            <div class="actions" role="group" aria-label="Form actions">
              <button type="button" class="small" (click)="act('touch-all')">Touch all</button>
              <button type="button" class="small" (click)="act('revalidate')">Revalidate</button>
              <button type="button" class="small" (click)="act('focus-first-invalid')">
                Focus first invalid
              </button>
              <button type="button" class="small" (click)="pick()">Pick field on page</button>
              <button type="button" class="small" (click)="act('snapshot')">Snapshot</button>
              @if (snapshot()) {
                <button type="button" class="small" (click)="confirmAct('restore')">
                  {{ armed() === 'restore' ? 'Confirm restore' : 'Restore ' + snapshot() }}
                </button>
              }
              <button type="button" class="small" (click)="confirmAct('reset')">
                {{ armed() === 'reset' ? 'Confirm reset' : 'Reset' }}
              </button>
              <button type="button" class="small" (click)="confirmAct('submit')">
                {{ armed() === 'submit' ? 'Confirm submit' : 'Submit' }}
              </button>
            </div>
            <p class="status" role="status">{{ message() }}</p>

            <div class="tabs" role="tablist" aria-label="Form views" (keydown)="onKey($event)">
              @for (tab of tabs; track tab.id) {
                <button
                  type="button"
                  role="tab"
                  [id]="'forms-tab-' + tab.id"
                  [attr.aria-selected]="tab.id === tab_()"
                  [attr.aria-controls]="'forms-panel-' + tab.id"
                  [attr.tabindex]="tab.id === tab_() ? 0 : -1"
                  (click)="tab_.set(tab.id)"
                >
                  {{ tab.label }}
                </button>
              }
            </div>
            <div
              class="panel"
              role="tabpanel"
              [id]="'forms-panel-' + tab_()"
              [attr.aria-labelledby]="'forms-tab-' + tab_()"
            >
              @switch (tab_()) {
                @case ('fields') {
                  <fieldset class="chips">
                    <legend class="sr-only">Show only fields that are</legend>
                    @for (chip of chips; track chip.id) {
                      <label>
                        <input
                          type="checkbox"
                          [checked]="active().has(chip.id)"
                          (change)="toggleChip(chip.id)"
                        />
                        {{ chip.label }}
                      </label>
                    }
                  </fieldset>
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
                                [attr.aria-pressed]="row.node.path === fieldPath()"
                                (focus)="highlight(form.id, row.node.path)"
                                (blur)="highlight(null, '')"
                                (click)="fieldPath.set(row.node.path)"
                              >
                                {{ row.node.key || '(form)' }}
                              </button>
                              <span class="type">{{ row.node.type }}</span>
                            </th>
                            <td class="value">
                              @if (row.node.type === 'control') {
                                <code>{{ row.node.value | json }}</code>
                                @if (row.node.uncommitted !== undefined) {
                                  <div class="muted">
                                    typed <code>{{ row.node.uncommitted | json }}</code
                                    >, not in the model yet
                                  </div>
                                }
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
                                <span>{{
                                  row.node.changed === false ? 'dirty, unchanged' : 'dirty'
                                }}</span>
                              }
                              @if (row.node.skipped) {
                                <span>not validated ({{ row.node.skipped }})</span>
                              }
                              @if (row.node.stale?.length) {
                                <span class="warn">stale: {{ row.node.stale!.join(', ') }}</span>
                              }
                              @if (row.node.dom?.drift !== undefined) {
                                <span class="warn">view out of sync</span>
                              }
                              @if (row.node.redacted) {
                                <span>redacted ({{ row.node.redacted }})</span>
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
                                  @if (error.source) {
                                    <span class="source">{{ sourceText(error) }}</span>
                                  }
                                </div>
                              }
                              @if (row.node.errors.length && row.node.dom?.errorShown === false) {
                                <div class="unseen">not shown to the user</div>
                              }
                            </td>
                          </tr>
                          @if (row.node.truncated) {
                            <tr>
                              <td
                                colspan="5"
                                class="muted"
                                [style.padding-left.px]="24 + row.depth * 16"
                              >
                                {{ row.node.truncated }} more fields under
                                {{ row.node.path || 'the form' }} not shown
                              </td>
                            </tr>
                          }
                        } @empty {
                          <tr>
                            <td colspan="5" class="muted">
                              No field path matches "{{ filter() }}".
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>

                  @if (selectedNode(); as node) {
                    <app-forms-field-detail
                      [form]="form"
                      [node]="node"
                      [version]="version()"
                      [rpc]="rpc()"
                    />
                  }
                }
                @case ('timeline') {
                  <app-forms-timeline
                    [events]="selectedEvents()"
                    [recording]="recording()"
                    (record)="setRecording($event)"
                  />
                }
                @case ('submit') {
                  <app-forms-submit [formId]="form.id" [version]="version()" [rpc]="rpc()" />
                }
                @case ('lint') {
                  <app-forms-lint [formId]="form.id" [version]="version()" [rpc]="rpc()" />
                }
              }
            </div>
          </section>
        }
      </div>
    }
  `,
  styles: `
    ${FORMS_STYLES}
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .tabs {
      display: flex;
      gap: 4px;
      border-bottom: 1px solid #27272a;
    }
    .tabs [role='tab'] {
      padding: 6px 12px;
      border: none;
      border-bottom: 2px solid transparent;
      background: none;
      color: #d4d4d8;
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    .tabs [role='tab'][aria-selected='true'] {
      border-bottom-color: var(--accent);
      color: #fafafa;
    }
    .tabs [role='tab']:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .panel {
      display: grid;
      gap: 12px;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 0;
      padding: 0;
      border: 0;
      color: #d4d4d8;
      font-size: 13px;
    }
    .field[aria-pressed='true'] {
      color: var(--accent);
      text-decoration: underline;
    }
    .flags span.warn {
      border-color: #a16207;
      color: #fef08a;
    }
    .source {
      margin-left: 6px;
      color: #a1a1aa;
      font-size: 11px;
    }
    .unseen {
      color: #fde68a !important;
      font-size: 11px;
    }
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
    .errors code {
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
  focus = input<string | null>(null);

  readonly forms = signal<CollectedForm[]>([]);
  readonly events = signal<FormEvent[]>([]);
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly selectedId = signal<string | null>(null);
  readonly instrumented = signal<string[]>([]);
  readonly recording = computed(() => {
    const id = this.selected()?.id ?? '';
    return this.instrumented().some((page) => id.endsWith(`@${page}`));
  });
  readonly filter = signal('');
  readonly tabs = TABS;
  readonly chips = CHIPS;
  readonly tab_ = signal<Tab>('fields');
  readonly active = signal(new Set<Chip>());
  readonly fieldPath = signal<string | null>(null);
  readonly version = signal(0);
  readonly message = signal('');
  readonly armed = signal<string | null>(null);
  readonly snapshot = signal<string | null>(null);

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
    const chips = Array.from(this.active());
    const rows: FieldRow[] = [];
    const visit = (node: FormFieldNode, depth: number): boolean => {
      const at = rows.length;
      let keep =
        (!query || node.path.toLowerCase().includes(query)) &&
        chips.every((chip) => matchesChip(node, chip));
      for (const child of node.children ?? []) keep = visit(child, depth + 1) || keep;
      if (keep) rows.splice(at, 0, { node, depth });
      return keep;
    };
    visit(form.root, 0);
    return rows;
  });

  readonly selectedNode = computed(() => {
    const path = this.fieldPath();
    const form = this.selected();
    if (path === null || !form) return null;
    const find = (node: FormFieldNode): FormFieldNode | null =>
      node.path === path ? node : ((node.children ?? []).map(find).find(Boolean) ?? null);
    return find(form.root);
  });

  readonly selectedEvents = computed(() => {
    const id = this.selected()?.id;
    return this.events()
      .filter((e) => e.formId === id)
      .slice(-200);
  });

  constructor() {
    effect(() => {
      const client = this.rpc();
      if (client) this.load(client);
    });
    effect(() => {
      const focus = this.focus();
      if (focus) untracked(() => this.selectForm(focus));
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
        this.instrumented.set(snapshot?.instrumented ?? []);
        this.version.update((v) => v + 1);
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

  async pick() {
    const form = this.selected();
    if (!form) return;
    this.message.set('Click a field in the app (Esc cancels).');
    const result = await formAction(this.rpc(), { action: 'pick', formId: form.id });
    const picked = result as typeof result & { formId?: string; path?: string };
    if (!result.ok || !picked.formId) {
      this.message.set(actionMessage(result));
      return;
    }
    this.selectForm(picked.formId);
    this.tab_.set('fields');
    this.fieldPath.set(picked.path ?? '');
    this.message.set(`Picked ${picked.path || '(form)'}.`);
  }

  async setRecording(on: boolean) {
    const form = this.selected();
    if (!form) return;
    const result = await formAction(this.rpc(), {
      action: 'instrument',
      formId: form.id,
      value: on,
    });
    this.message.set(actionMessage(result));
  }

  selectForm(id: string) {
    this.selectedId.set(id);
    this.filter.set('');
    this.fieldPath.set(null);
    this.snapshot.set(null);
    this.armed.set(null);
  }

  toggleChip(chip: Chip) {
    this.active.update((set) => {
      const next = new Set(set);
      if (next.has(chip)) next.delete(chip);
      else next.add(chip);
      return next;
    });
  }

  async act(action: string, extra: Record<string, unknown> = {}) {
    const form = this.selected();
    if (!form) return;
    this.armed.set(null);
    const result = await formAction(this.rpc(), { action, formId: form.id, ...extra });
    if (result.snapshot) this.snapshot.set(result.snapshot);
    this.message.set(actionMessage(result));
  }

  confirmAct(action: 'reset' | 'submit' | 'restore') {
    if (this.armed() !== action) {
      this.armed.set(action);
      this.message.set(`Press "Confirm ${action}" to ${action} the form in the app.`);
      return;
    }
    void this.act(action, { confirm: true, snapshot: this.snapshot() ?? undefined });
  }

  onKey(event: KeyboardEvent) {
    const order = this.tabs.map((tab) => tab.id);
    const index = order.indexOf(this.tab_());
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % order.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + order.length) % order.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = order.length - 1;
    else return;
    event.preventDefault();
    this.tab_.set(order[next]);
    const host = event.currentTarget as HTMLElement;
    queueMicrotask(() => host.querySelector<HTMLElement>(`#forms-tab-${order[next]}`)?.focus());
  }

  sourceText(error: FormFieldError) {
    const label = SOURCE_LABELS[error.source ?? ''] ?? error.source ?? '';
    return error.from !== undefined ? `${label} on ${error.from || 'the form'}` : label;
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
}

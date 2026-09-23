import { Component, input, signal, effect, computed } from '@angular/core';
import { JsonPipe } from '@angular/common';
import type { DevframeRpcClient } from 'devframe/client';

interface NgrxStoreEntry {
  name: string;
  kind:
    | 'action'
    | 'reducer'
    | 'effect'
    | 'selector'
    | 'feature'
    | 'store-setup'
    | 'signal-store'
    | 'signal-state'
    | 'signal-method';
  file: string;
  line: number;
  detail?: string;
}

interface NgrxRuntimeAction {
  type: string;
  payload?: unknown;
  timestamp: number;
}

interface NgrxRuntimeState {
  state: unknown;
  actions: NgrxRuntimeAction[];
  connected: boolean;
}

const KIND_COLORS: Record<string, string> = {
  action: '#f59e0b',
  reducer: '#a78bfa',
  effect: '#fb923c',
  selector: '#60a5fa',
  feature: '#34d399',
  'store-setup': '#94a3b8',
  'signal-store': '#e879f9',
  'signal-state': '#22d3ee',
  'signal-method': '#fb7185',
};

@Component({
  selector: 'app-store-inspector',
  imports: [JsonPipe],
  template: `
    <div class="toolbar">
      <input
        type="text"
        placeholder="Filter by name or kind…"
        [value]="filter()"
        (input)="filter.set($any($event.target).value)"
      />
      <div class="toggle-group">
        <button [class.active]="mode() === 'source'" (click)="mode.set('source')">Source</button>
        <button [class.active]="mode() === 'runtime'" (click)="mode.set('runtime')">
          Runtime
          @if (runtimeState()?.connected) {
            <span class="live-dot"></span>
          }
        </button>
      </div>
    </div>

    @if (mode() === 'source') {
      @if (sourceEntries().length === 0) {
        <div class="empty">
          <p class="muted">No NgRx store patterns found.</p>
          <p class="hint">
            No createAction, createReducer, createEffect, createSelector, or createFeature calls
            found in source. Make sure your app uses &#64;ngrx/store.
          </p>
        </div>
      } @else {
        <div class="legend">
          @for (entry of kindLegend; track entry.kind) {
            <span class="legend-item">
              <span class="dot" [style.background]="entry.color"></span>
              {{ entry.kind }}
            </span>
          }
        </div>

        <div class="summary">
          @for (group of groupedEntries(); track group.kind) {
            <span class="summary-badge" [style.border-color]="kindColor(group.kind)">
              {{ group.count }} {{ group.kind }}{{ group.count !== 1 ? 's' : '' }}
            </span>
          }
        </div>

        <div class="nodes">
          @for (entry of filteredEntries(); track entry.name + entry.file + entry.line) {
            <div class="node-card">
              <div class="node-header">
                <span class="kind-badge" [style.background]="kindColor(entry.kind)">
                  {{ entry.kind }}
                </span>
                <span class="node-label">{{ entry.name }}</span>
              </div>
              <div class="node-meta">
                {{ entry.file }}:{{ entry.line }}
                @if (entry.detail) {
                  · {{ entry.detail }}
                }
              </div>
            </div>
          }
        </div>
      }
    }

    @if (mode() === 'runtime') {
      @if (!runtimeState()?.connected) {
        <div class="empty">
          <p class="muted">No NgRx store connection detected.</p>
          <p class="hint">
            Runtime inspection requires &#64;ngrx/store-devtools to be configured in your app. The
            store devtools use the Redux DevTools protocol to expose state.
          </p>
        </div>
      } @else {
        <div class="runtime-layout">
          <section class="state-panel">
            <h3>Current State</h3>
            <pre class="state-tree">{{ runtimeState()?.state | json }}</pre>
          </section>

          <section class="actions-panel">
            <h3>
              Recent Actions
              <span class="action-count">{{ filteredActions().length }}</span>
            </h3>
            <div class="action-list">
              @for (action of filteredActions(); track $index) {
                <div
                  class="action-card"
                  [class.selected]="selectedAction() === action"
                  (click)="selectedAction.set(action)"
                >
                  <div class="action-type">{{ action.type }}</div>
                  <div class="action-time">{{ formatTime(action.timestamp) }}</div>
                </div>
              } @empty {
                <p class="muted">No actions dispatched yet.</p>
              }
            </div>
          </section>
        </div>

        @if (selectedAction()) {
          <aside class="detail-panel">
            <h3>{{ selectedAction()!.type }}</h3>
            <dl>
              <dt>Type</dt>
              <dd>{{ selectedAction()!.type }}</dd>
              <dt>Time</dt>
              <dd>{{ formatTime(selectedAction()!.timestamp) }}</dd>
              @if (selectedAction()!.payload !== undefined) {
                <dt>Payload</dt>
                <dd>
                  <pre>{{ selectedAction()!.payload | json }}</pre>
                </dd>
              }
            </dl>
          </aside>
        }
      }
    }
  `,
  styles: `
    .toolbar {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }
    input {
      flex: 1;
      padding: 8px 12px;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 6px;
      color: #e4e4e7;
      font-size: 14px;
      outline: none;
    }
    input:focus {
      border-color: var(--accent);
    }
    .toggle-group {
      display: flex;
      border: 1px solid #27272a;
      border-radius: 6px;
      overflow: hidden;
    }
    .toggle-group button {
      padding: 6px 14px;
      border: none;
      background: transparent;
      color: #a1a1aa;
      cursor: pointer;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .toggle-group button.active {
      background: #3f3f46;
      color: #fff;
    }
    .live-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4ade80;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.4;
      }
    }
    .empty {
      text-align: center;
      padding: 48px 16px;
    }
    .muted {
      color: #71717a;
      font-size: 14px;
    }
    .hint {
      color: #52525b;
      font-size: 12px;
      margin-top: 8px;
    }
    .legend {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #a1a1aa;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .summary {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .summary-badge {
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 99px;
      border: 1px solid;
      color: #e4e4e7;
    }
    .nodes {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .node-card {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
      padding: 12px 16px;
      transition: border-color 0.15s;
    }
    .node-card:hover {
      border-color: #3f3f46;
    }
    .node-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .kind-badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      color: #fff;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .node-label {
      font-family: monospace;
      font-size: 14px;
      color: #e4e4e7;
    }
    .node-meta {
      font-size: 12px;
      color: #71717a;
      margin-top: 4px;
    }
    .runtime-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .state-panel,
    .actions-panel {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 10px;
      padding: 16px;
    }
    h3 {
      font-size: 13px;
      text-transform: uppercase;
      color: #71717a;
      margin-bottom: 12px;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .action-count {
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 99px;
      background: #3f3f46;
      color: #a1a1aa;
    }
    .state-tree {
      font-family: monospace;
      font-size: 12px;
      color: #a1a1aa;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 500px;
      overflow: auto;
    }
    .action-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 500px;
      overflow: auto;
    }
    .action-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #09090b;
      border: 1px solid #27272a;
      border-radius: 6px;
      cursor: pointer;
      transition: border-color 0.15s;
    }
    .action-card:hover {
      border-color: #3f3f46;
    }
    .action-card.selected {
      border-color: var(--accent);
    }
    .action-type {
      font-family: monospace;
      font-size: 13px;
      color: #e4e4e7;
    }
    .action-time {
      font-size: 11px;
      color: #71717a;
    }
    .detail-panel {
      margin-top: 16px;
      background: #18181b;
      border: 1px solid var(--accent);
      border-radius: 10px;
      padding: 16px;
    }
    dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 6px 12px;
      font-size: 14px;
    }
    dt {
      color: #a1a1aa;
    }
    dd {
      color: #e4e4e7;
    }
    pre {
      font-family: monospace;
      font-size: 12px;
      white-space: pre-wrap;
      word-break: break-all;
    }
  `,
})
export class StoreInspector {
  rpc = input<DevframeRpcClient | null>(null);

  filter = signal('');
  mode = signal<'source' | 'runtime'>('source');
  sourceEntries = signal<NgrxStoreEntry[]>([]);
  runtimeState = signal<NgrxRuntimeState | null>(null);
  selectedAction = signal<NgrxRuntimeAction | null>(null);

  readonly kindLegend = Object.entries(KIND_COLORS).map(([kind, color]) => ({ kind, color }));

  filteredEntries = computed(() => {
    const f = this.filter().toLowerCase();
    return this.sourceEntries().filter(
      (e) => e.name.toLowerCase().includes(f) || e.kind.toLowerCase().includes(f),
    );
  });

  groupedEntries = computed(() => {
    const entries = this.sourceEntries();
    const groups = new Map<string, number>();
    for (const e of entries) {
      groups.set(e.kind, (groups.get(e.kind) ?? 0) + 1);
    }
    return [...groups.entries()].map(([kind, count]) => ({ kind, count }));
  });

  filteredActions = computed(() => {
    const f = this.filter().toLowerCase();
    const actions = this.runtimeState()?.actions ?? [];
    // Show newest first
    const sorted = [...actions].reverse();
    if (!f) return sorted;
    return sorted.filter((a) => a.type.toLowerCase().includes(f));
  });

  constructor() {
    effect(() => {
      const client = this.rpc();
      if (!client) return;
      const my = client.scope('ng-devtools');

      my.rpc
        .call('get-ngrx-store')
        .then((entries: NgrxStoreEntry[]) => {
          this.sourceEntries.set(entries);
          if (entries.length === 0) this.mode.set('runtime');
        })
        .catch(() => this.sourceEntries.set([]));

      // Subscribe to runtime state
      my.rpc.sharedState('ngrx-store').then((state: any) => {
        if (state?.subscribe) {
          state.subscribe((val: NgrxRuntimeState) => this.runtimeState.set(val));
        }
      });
    });
  }

  kindColor(kind: string) {
    return KIND_COLORS[kind] ?? '#71717a';
  }

  formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString();
  }
}

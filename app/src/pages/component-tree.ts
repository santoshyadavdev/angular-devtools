import { Component, input, signal, effect } from '@angular/core';
import { JsonPipe } from '@angular/common';
import type { DevframeRpcClient } from 'devframe/client';

interface ComponentInfo {
  selector: string;
  file: string;
  inputs: string[];
  outputs: string[];
  isStandalone: boolean;
}

interface ProviderEntry {
  token: string;
  source: string;
  file: string;
  line: number;
  providedIn?: string;
  type: string;
}

@Component({
  selector: 'app-component-tree',
  imports: [JsonPipe],
  template: `
    <div class="toolbar">
      <input
        type="text"
        placeholder="Filter components…"
        [value]="filter()"
        (input)="filter.set($any($event.target).value)"
      />
      <button (click)="refresh()">Refresh</button>
    </div>

    @if (loading()) {
      <p class="muted">Scanning components…</p>
    } @else if (filtered().length === 0) {
      <p class="muted">No components found.</p>
    } @else {
      <ul class="component-list" role="list">
        @for (comp of filtered(); track comp.selector) {
          <li class="component-item" [class.expanded]="isSelected(comp)">
            <button class="component-toggle" [attr.aria-expanded]="isSelected(comp)" (click)="select(comp)">
              <div class="selector">&lt;{{ comp.selector }}&gt;</div>
              <div class="file">{{ comp.file }}</div>
            </button>
            @if (isSelected(comp)) {
              <div class="inline-detail">
                <dl>
                  <dt>File</dt>
                  <dd>{{ comp.file }}</dd>
                  <dt>Standalone</dt>
                  <dd>{{ comp.isStandalone ? 'Yes' : 'No' }}</dd>
                </dl>
                @if (comp.inputs.length) {
                  <h4>Inputs</h4>
                  <ul class="prop-list" role="list">
                    @for (inp of comp.inputs; track inp) {
                      <li class="prop-chip input-chip">{{ inp }}</li>
                    }
                  </ul>
                }
                @if (comp.outputs.length) {
                  <h4>Outputs</h4>
                  <ul class="prop-list" role="list">
                    @for (out of comp.outputs; track out) {
                      <li class="prop-chip output-chip">{{ out }}</li>
                    }
                  </ul>
                }
                @if (selectedProviders().length) {
                  <h4>Injected Providers</h4>
                  <ul class="provider-list" role="list">
                    @for (p of selectedProviders(); track p.token + p.line) {
                      <li class="provider-item">
                        <span class="provider-token">{{ p.token }}</span>
                        <span class="provider-type">{{ p.type }}</span>
                        @if (p.source && p.source !== 'class' && p.source !== 'providers array') {
                          <span class="provider-source">→ {{ p.source }}</span>
                        }
                      </li>
                    }
                  </ul>
                } @else {
                  <p class="no-providers">No injected providers detected.</p>
                }
              </div>
            }
          </li>
        }
      </ul>
    }
  `,
  styles: `
    .toolbar {
      display: flex;
      gap: 8px;
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
    button {
      padding: 8px 16px;
      background: #3f3f46;
      border: none;
      border-radius: 6px;
      color: #e4e4e7;
      cursor: pointer;
      font-size: 13px;
    }
    button:hover {
      background: #52525b;
    }
    .muted {
      color: #71717a;
      font-size: 14px;
    }
    .component-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .component-item {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
      padding: 0;
      transition: border-color 0.15s;
    }
    .component-item:has(.component-toggle:hover) {
      border-color: var(--accent);
    }
    .component-item.expanded {
      border-color: var(--accent);
    }
    .component-toggle {
      display: block;
      width: 100%;
      padding: 12px 16px;
      background: none;
      border: none;
      color: inherit;
      text-align: left;
      cursor: pointer;
      font: inherit;
    }
    .selector {
      font-family: monospace;
      font-size: 15px;
      color: var(--accent);
      font-weight: 600;
    }
    .file {
      font-size: 12px;
      color: #71717a;
      margin-top: 2px;
    }
    .io {
      font-size: 13px;
      color: #a1a1aa;
      margin-top: 4px;
    }
    .io .label {
      color: #71717a;
    }
    .inline-detail {
      padding: 0 16px 12px;
      border-top: 1px solid #27272a;
      margin-top: 0;
      padding-top: 12px;
    }
    .prop-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }
    .prop-chip {
      font-family: monospace;
      font-size: 12px;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .input-chip {
      background: #1e3a5f;
      color: #93c5fd;
    }
    .output-chip {
      background: #3b1d1d;
      color: #fca5a5;
    }
    dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 4px 12px;
      font-size: 13px;
      margin-bottom: 16px;
    }
    dt {
      color: #71717a;
    }
    dd {
      color: #e4e4e7;
    }
    h4 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #71717a;
      margin-bottom: 8px;
    }
    .provider-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .provider-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: #09090b;
      border: 1px solid #27272a;
      border-radius: 6px;
      font-size: 13px;
    }
    .provider-token {
      font-family: monospace;
      color: #e4e4e7;
      font-weight: 600;
    }
    .provider-type {
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 4px;
      background: #3f3f46;
      color: #a1a1aa;
    }
    .provider-source {
      font-size: 12px;
      color: #71717a;
    }
    .no-providers {
      font-size: 13px;
      color: #52525b;
    }
  `,
})
export class ComponentTree {
  rpc = input<DevframeRpcClient | null>(null);

  components = signal<ComponentInfo[]>([]);
  allProviders = signal<ProviderEntry[]>([]);
  filter = signal('');
  loading = signal(false);
  selected = signal<ComponentInfo | null>(null);
  selectedProviders = signal<ProviderEntry[]>([]);

  filtered = signal<ComponentInfo[]>([]);

  constructor() {
    effect(() => {
      const q = this.filter().toLowerCase();
      const all = this.components();
      this.filtered.set(q ? all.filter((c) => c.selector.includes(q) || c.file.includes(q)) : all);
    });

    effect(() => {
      const client = this.rpc();
      if (client) this.refresh();
    });
  }

  async refresh() {
    const client = this.rpc();
    if (!client) return;
    this.loading.set(true);
    try {
      const my = client.scope('ng-devtools');
      const [comps, providers] = await Promise.all([
        my.rpc.call('get-components') as Promise<ComponentInfo[]>,
        my.rpc.call('get-providers') as Promise<ProviderEntry[]>,
      ]);
      this.components.set(comps);
      this.allProviders.set(providers);
      const sel = this.selected();
      if (sel) {
        const refreshed = comps.find((c) => c.selector === sel.selector);
        if (refreshed) {
          this.selected.set(refreshed);
          this.selectedProviders.set(providers.filter((p) => p.file === refreshed.file));
        } else {
          this.selected.set(null);
          this.selectedProviders.set([]);
        }
      }
    } finally {
      this.loading.set(false);
    }
  }

  isSelected(comp: ComponentInfo): boolean {
    return this.selected()?.selector === comp.selector;
  }

  select(comp: ComponentInfo) {
    if (this.isSelected(comp)) {
      this.selected.set(null);
      this.selectedProviders.set([]);
      return;
    }
    this.selected.set(comp);
    this.selectedProviders.set(this.allProviders().filter((p) => p.file === comp.file));
    const client = this.rpc();
    if (client) {
      client.scope('ng-devtools').rpc.callEvent('select-component', comp.selector);
    }
  }
}

import { Component, input, signal, effect } from '@angular/core';
import type { DevframeRpcClient } from 'devframe/client';

interface PipeInfo {
  name: string;
  className: string;
  file: string;
  line: number;
  isStandalone: boolean;
  isPure: boolean;
}

@Component({
  selector: 'app-pipes-inspector',
  template: `
    <div class="toolbar">
      <input
        type="text"
        placeholder="Filter pipes…"
        [value]="filter()"
        (input)="filter.set($any($event.target).value)"
      />
      <button (click)="refresh()">Refresh</button>
    </div>

    @if (loading()) {
      <p class="muted">Scanning pipes…</p>
    } @else if (filtered().length === 0) {
      <p class="muted">No pipes found.</p>
    } @else {
      <ul class="pipe-list" role="list">
        @for (p of filtered(); track p.file + p.name) {
          <li class="pipe-item" [class.expanded]="isSelected(p)">
            <button class="pipe-toggle" [attr.aria-expanded]="isSelected(p)" (click)="select(p)">
              <div class="name-row">
                <span class="badge" [class.impure]="!p.isPure">{{
                  p.isPure ? 'pure' : 'impure'
                }}</span>
                <span class="name">{{ p.name }}</span>
                @if (!p.isStandalone) {
                  <span class="badge module">module</span>
                }
              </div>
              <div class="file">{{ p.file }}:{{ p.line }}</div>
            </button>
            @if (isSelected(p)) {
              <div class="inline-detail">
                <dl>
                  <dt>Class</dt>
                  <dd>{{ p.className }}</dd>
                  <dt>File</dt>
                  <dd>{{ p.file }}:{{ p.line }}</dd>
                  <dt>Standalone</dt>
                  <dd>{{ p.isStandalone ? 'Yes' : 'No' }}</dd>
                  <dt>Pure</dt>
                  <dd>{{ p.isPure ? 'Yes' : 'No' }}</dd>
                </dl>
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
    .pipe-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .pipe-item {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
      padding: 0;
      transition: border-color 0.15s;
    }
    .pipe-item:has(.pipe-toggle:hover) {
      border-color: var(--accent);
    }
    .pipe-item.expanded {
      border-color: var(--accent);
    }
    .pipe-toggle {
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
    .name-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .name {
      font-family: monospace;
      font-size: 15px;
      color: var(--accent);
      font-weight: 600;
    }
    .badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      background: #14532d;
      color: #4ade80;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge.impure {
      background: #7c2d12;
      color: #fdba74;
    }
    .badge.module {
      background: #3f3f46;
      color: #a1a1aa;
    }
    .file {
      font-size: 12px;
      color: #71717a;
      margin-top: 2px;
    }
    .inline-detail {
      padding: 0 16px 12px;
      border-top: 1px solid #27272a;
      margin-top: 0;
      padding-top: 12px;
    }
    dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 4px 12px;
      font-size: 13px;
    }
    dt {
      color: #71717a;
    }
    dd {
      color: #e4e4e7;
    }
  `,
})
export class PipesInspector {
  rpc = input<DevframeRpcClient | null>(null);

  pipes = signal<PipeInfo[]>([]);
  filter = signal('');
  loading = signal(false);
  selected = signal<PipeInfo | null>(null);

  filtered = signal<PipeInfo[]>([]);

  constructor() {
    effect(() => {
      const q = this.filter().toLowerCase();
      const all = this.pipes();
      this.filtered.set(
        q
          ? all.filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.className.toLowerCase().includes(q) ||
                p.file.includes(q),
            )
          : all,
      );
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
      const pipes = (await my.rpc.call('get-pipes')) as PipeInfo[];
      this.pipes.set(pipes);
      const sel = this.selected();
      if (sel) {
        const refreshed = pipes.find((p) => p.name === sel.name && p.file === sel.file);
        this.selected.set(refreshed ?? null);
      }
    } finally {
      this.loading.set(false);
    }
  }

  isSelected(pipe: PipeInfo): boolean {
    const sel = this.selected();
    return sel !== null && sel.name === pipe.name && sel.file === pipe.file;
  }

  select(pipe: PipeInfo) {
    this.selected.set(this.isSelected(pipe) ? null : pipe);
  }
}

import { Component, input, signal, effect } from '@angular/core';
import type { DevframeRpcClient } from 'devframe/client';

interface RouteInfo {
  path: string;
  component?: string;
  hasChildren: boolean;
  file: string;
}

@Component({
  selector: 'app-route-inspector',
  template: `
    <div class="toolbar">
      <input
        type="text"
        placeholder="Filter routes…"
        [value]="filter()"
        (input)="filter.set($any($event.target).value)"
      />
      <button (click)="refresh()">Refresh</button>
    </div>

    @if (loading()) {
      <p class="muted">Scanning routes…</p>
    } @else if (filtered().length === 0) {
      <p class="muted">No routes found.</p>
    } @else {
      <table role="table">
        <thead>
          <tr>
            <th>Path</th>
            <th>Component</th>
            <th>File</th>
            <th>Children</th>
          </tr>
        </thead>
        <tbody>
          @for (route of filtered(); track route.path + route.file) {
            <tr>
              <td class="path">/{{ route.path }}</td>
              <td>{{ route.component ?? '—' }}</td>
              <td class="file">{{ route.file }}</td>
              <td>{{ route.hasChildren ? 'Yes' : '—' }}</td>
            </tr>
          }
        </tbody>
      </table>
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
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    thead {
      position: sticky;
      top: 0;
    }
    th {
      text-align: left;
      padding: 8px 12px;
      background: #18181b;
      color: #71717a;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #27272a;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #1e1e22;
    }
    tr:hover td {
      background: #18181b;
    }
    .path {
      font-family: monospace;
      color: var(--accent);
      font-weight: 500;
    }
    .file {
      font-size: 12px;
      color: #71717a;
    }
  `,
})
export class RouteInspector {
  rpc = input<DevframeRpcClient | null>(null);

  routes = signal<RouteInfo[]>([]);
  filter = signal('');
  loading = signal(false);

  filtered = signal<RouteInfo[]>([]);

  constructor() {
    effect(() => {
      const q = this.filter().toLowerCase();
      const all = this.routes();
      this.filtered.set(q ? all.filter((r) => r.path.includes(q) || r.file.includes(q)) : all);
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
      const result = (await my.rpc.call('get-routes')) as RouteInfo[];
      this.routes.set(result);
    } finally {
      this.loading.set(false);
    }
  }
}

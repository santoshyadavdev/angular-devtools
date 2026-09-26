import { Component, input, signal, effect, computed } from '@angular/core';
import type { DevframeRpcClient } from 'devframe/client';
import { LiveRoute } from './live-route';

interface RouteInfo {
  path: string;
  component?: string;
  redirectTo?: string;
  title?: string;
  hasChildren: boolean;
  file: string;
}

@Component({
  selector: 'app-route-inspector',
  imports: [LiveRoute],
  template: `
    <app-live-route [rpc]="rpc()" />

    <h2 class="config-heading">Route config</h2>
    <div class="toolbar">
      <input
        type="text"
        aria-label="Filter routes"
        placeholder="Filter routes…"
        [value]="filter()"
        (input)="onFilterInput($event)"
      />
      <button type="button" (click)="refresh()">Refresh</button>
    </div>

    @if (loading()) {
      <p class="muted">Scanning routes…</p>
    } @else if (filtered().length === 0) {
      <p class="muted">No routes found.</p>
    } @else {
      <table role="table">
        <thead>
          <tr>
            <th scope="col">Path</th>
            <th scope="col">Component / Target</th>
            <th scope="col">Title</th>
            <th scope="col">File</th>
            <th scope="col">Children</th>
          </tr>
        </thead>
        <tbody>
          @for (route of filtered(); track $index) {
            <tr>
              <td class="path">/{{ route.path }}</td>
              <td>
                @if (route.redirectTo !== undefined) {
                  <span class="redirect">➜ {{ route.redirectTo }}</span>
                } @else {
                  {{ route.component ?? '—' }}
                }
              </td>
              <td>{{ route.title ?? '—' }}</td>
              <td class="file">{{ route.file }}</td>
              <td>{{ route.hasChildren ? 'Yes' : '—' }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: `
    .config-heading {
      margin: 0 0 8px;
      font-size: 15px;
      color: #e4e4e7;
    }
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
      color: #a1a1aa;
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
      color: #a1a1aa;
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
    .redirect {
      font-family: monospace;
      color: #38bdf8;
    }
    .file {
      font-size: 12px;
      color: #a1a1aa;
    }
  `,
})
export class RouteInspector {
  rpc = input<DevframeRpcClient | null>(null);

  routes = signal<RouteInfo[]>([]);
  filter = signal('');
  loading = signal(false);

  filtered = computed(() => {
    const q = this.filter().toLowerCase().trim();
    const all = this.routes();
    if (!q) return all;
    return all.filter(
      (r) =>
        r.path.toLowerCase().includes(q) ||
        (r.component && r.component.toLowerCase().includes(q)) ||
        (r.redirectTo && r.redirectTo.toLowerCase().includes(q)) ||
        (r.title && r.title.toLowerCase().includes(q)) ||
        r.file.toLowerCase().includes(q),
    );
  });

  constructor() {
    effect(() => {
      const client = this.rpc();
      if (client) this.refresh();
    });
  }

  onFilterInput(event: Event) {
    const target = event.target as HTMLInputElement | null;
    this.filter.set(target?.value ?? '');
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

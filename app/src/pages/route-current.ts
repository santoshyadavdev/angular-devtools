import { Component, computed, input, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import type { DevframeRpcClient } from 'devframe/client';
import {
  SHARED_STYLES,
  routerAction,
  type ActiveRoute,
  type OutletInfo,
  type RouterPage,
} from './router-types';

interface RouteRow {
  route: ActiveRoute;
  depth: number;
}

interface OutletRow {
  outlet: OutletInfo;
  depth: number;
}

@Component({
  selector: 'app-route-current',
  imports: [JsonPipe],
  template: `
    @if (page().snapshot; as snapshot) {
      <p class="url">
        <code>{{ snapshot.url }}</code>
      </p>
      @if (snapshot.urlDrift && snapshot.browserUrl) {
        <p class="note" role="note">
          The browser shows <code>{{ snapshot.browserUrl }}</code
          >, not the router URL (skipLocationChange, browserUrl, a failed navigation or code that
          changed history).
        </p>
      }
      @if (snapshot.pending; as pending) {
        <div class="pending" role="status">
          Navigating to <code>{{ pending.url }}</code> (#{{ pending.id }})
          <button type="button" class="small" (click)="abort()">Abort</button>
        </div>
      }
      @if (message()) {
        <p class="muted" role="status">{{ message() }}</p>
      }
      <dl class="facts">
        @if (snapshot.title) {
          <dt>Document title</dt>
          <dd>{{ snapshot.title }}</dd>
        }
        @if (hasKeys(snapshot.queryParams)) {
          <dt>Query params</dt>
          <dd>
            <code>{{ snapshot.queryParams | json }}</code>
          </dd>
        }
        @if (snapshot.fragment) {
          <dt>Fragment</dt>
          <dd>
            <code>{{ snapshot.fragment }}</code>
          </dd>
        }
      </dl>

      <h3>Active routes</h3>
      <div class="table-scroll" role="region" aria-label="Active routes" tabindex="0">
        <table>
          <thead>
            <tr>
              <th scope="col">Route</th>
              <th scope="col">Component</th>
              <th scope="col">Params</th>
              <th scope="col">Data</th>
              <th scope="col">Guards and resolvers</th>
            </tr>
          </thead>
          <tbody>
            @for (row of rows(); track $index) {
              <tr>
                <td class="path" [style.padding-left.px]="12 + row.depth * 16">
                  {{ row.depth === 0 && !row.route.path ? '(root)' : '/' + row.route.path }}
                  @if (row.route.outlet !== 'primary') {
                    <span class="tag">{{ row.route.outlet }}</span>
                  }
                  @if (row.route.lazy) {
                    <span class="tag">lazy</span>
                  }
                  @if (row.route.title) {
                    <div class="sub">
                      title {{ row.route.title
                      }}{{ row.route.ownTitle === false ? ' (inherited)' : '' }}
                    </div>
                  }
                </td>
                <td>{{ row.route.component ?? '—' }}</td>
                <td>
                  @for (entry of entries(row.route.params); track entry[0]) {
                    <div>
                      <code>{{ entry[0] }}: {{ entry[1] | json }}</code>
                      @if (row.route.paramSources?.[entry[0]] === 'inherited') {
                        <span class="tag">inherited</span>
                      }
                    </div>
                  } @empty {
                    —
                  }
                </td>
                <td>
                  @for (entry of entries(row.route.data); track entry[0]) {
                    <div class="data">
                      <code>{{ entry[0] }}: {{ entry[1] | json }}</code>
                      @if (row.route.dataSources?.[entry[0]]; as source) {
                        <span class="tag">{{ source }}</span>
                      }
                    </div>
                  } @empty {
                    —
                  }
                </td>
                <td>
                  @for (guard of guardList(row.route); track guard) {
                    <span class="tag">{{ guard }}</span>
                  }
                  @for (resolver of row.route.resolvers ?? []; track resolver) {
                    <span class="tag">resolve {{ resolver }}</span>
                  }
                  @if (!guardList(row.route).length && !row.route.resolvers) {
                    —
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (outletRows().length) {
        <h3>Outlets</h3>
        <ul class="outlets">
          @for (row of outletRows(); track $index) {
            <li [style.padding-left.px]="row.depth * 16">
              <span class="tag">{{ row.outlet.outlet }}</span>
              @if (row.outlet.activated) {
                <code>{{ row.outlet.component ?? '?' }}</code> for
                <code>{{ row.outlet.route ?? '?' }}</code>
              } @else {
                <span class="muted">not activated</span>
              }
              @if (row.outlet.detached) {
                <span class="tag">detached by reuse strategy</span>
              }
              @for (bound of boundInputs(row.outlet); track bound.input) {
                <span class="tag">input {{ bound.input }} ← {{ bound.source }}</span>
              }
            </li>
          }
        </ul>
      }
    } @else {
      <p class="muted">This page reports no Router.</p>
    }
  `,
  styles: `
    ${SHARED_STYLES}
    :host {
      display: grid;
      gap: 12px;
    }
    .url code {
      font-size: 14px;
      color: var(--accent);
    }
    .note {
      margin: 0;
      padding: 8px 10px;
      border-left: 3px solid #fef08a;
      background: #27272a;
      color: #e4e4e7;
      font-size: 13px;
    }
    .pending {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      font-size: 13px;
      color: #fef08a;
    }
    .facts {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 4px 12px;
      margin: 0;
      font-size: 13px;
    }
    dt {
      color: #a1a1aa;
    }
    dd {
      margin: 0;
      color: #e4e4e7;
    }
    .path {
      font-family: monospace;
      color: var(--accent);
      white-space: nowrap;
    }
    .sub {
      font-family: inherit;
      color: #a1a1aa;
      font-size: 12px;
      white-space: normal;
    }
    .data {
      max-width: 360px;
    }
    .outlets {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 6px;
      font-size: 13px;
      color: #e4e4e7;
    }
  `,
})
export class RouteCurrent {
  page = input.required<RouterPage>();
  rpc = input<DevframeRpcClient | null>(null);

  readonly message = signal('');

  readonly rows = computed(() => {
    const rows: RouteRow[] = [];
    const visit = (route: ActiveRoute, depth: number) => {
      rows.push({ route, depth });
      for (const child of route.children) visit(child, depth + 1);
    };
    const root = this.page().snapshot?.root;
    if (root) visit(root, 0);
    return rows;
  });

  readonly outletRows = computed(() => {
    const rows: OutletRow[] = [];
    const visit = (outlets: OutletInfo[], depth: number) => {
      for (const outlet of outlets) {
        rows.push({ outlet, depth });
        if (outlet.children) visit(outlet.children, depth + 1);
      }
    };
    visit(this.page().outlets ?? [], 0);
    return rows;
  });

  hasKeys(value: Record<string, unknown>) {
    return Object.keys(value).length > 0;
  }

  entries(value: Record<string, unknown>) {
    return Object.entries(value);
  }

  guardList(route: ActiveRoute) {
    return Object.entries(route.guards ?? {}).flatMap(([kind, names]) =>
      names.map((name) => `${kind} ${name}`),
    );
  }

  boundInputs(outlet: OutletInfo) {
    return (outlet.inputs ?? []).filter((input) => input.source !== 'unset');
  }

  async abort() {
    const result = await routerAction(this.rpc(), this.page().pageId, { action: 'abort' });
    this.message.set(
      result?.['error'] ? String(result['error']) : `Aborted navigation #${result?.['aborted']}`,
    );
  }
}

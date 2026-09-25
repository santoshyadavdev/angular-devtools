import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { connectDevframe, type DevframeRpcClient } from 'devframe/client';
import { Dashboard } from './pages/dashboard';
import { ComponentTree } from './pages/component-tree';
import { RouteInspector } from './pages/route-inspector';
import { SignalInspector } from './pages/signal-inspector';
import { DiInspector } from './pages/di-inspector';
import { StoreInspector } from './pages/store-inspector';

type Tab = 'dashboard' | 'components' | 'routes' | 'signals' | 'injectors' | 'store';

@Component({
  selector: 'app-root',
  imports: [Dashboard, ComponentTree, RouteInspector, SignalInspector, DiInspector, StoreInspector],
  template: `
    <header>
      <div class="brand">
        <!-- The Angular shield, from the wordmark on angular.dev. -->
        <svg width="20" height="22" viewBox="0 0 223 236" fill="url(#ng-logo)" aria-hidden="true">
          <defs>
            <linearGradient
              id="ng-logo"
              x1="49"
              x2="226"
              y1="214"
              y2="130"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#E40035" />
              <stop offset=".24" stop-color="#F60A48" />
              <stop offset=".352" stop-color="#F20755" />
              <stop offset=".494" stop-color="#DC087D" />
              <stop offset=".745" stop-color="#9717E7" />
              <stop offset="1" stop-color="#6C00F5" />
            </linearGradient>
          </defs>
          <path
            d="m222.077 39.192-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z"
          />
        </svg>
        <span>Angular DevTools</span>
      </div>
      <nav>
        @for (t of tabs; track t.id) {
          <button [class.active]="tab() === t.id" (click)="switchTab(t.id)">{{ t.label }}</button>
        }
      </nav>
      <span class="status" [class.connected]="connected()">
        {{ connected() ? 'Connected' : 'Connecting…' }}
      </span>
    </header>
    <main>
      @switch (tab()) {
        @case ('dashboard') {
          <app-dashboard [rpc]="rpc()" (navigate)="switchTab($event)" />
        }
        @case ('components') {
          <app-component-tree [rpc]="rpc()" />
        }
        @case ('routes') {
          <app-route-inspector [rpc]="rpc()" />
        }
        @case ('signals') {
          <app-signal-inspector [rpc]="rpc()" />
        }
        @case ('injectors') {
          <app-di-inspector [rpc]="rpc()" />
        }
        @case ('store') {
          <app-store-inspector [rpc]="rpc()" />
        }
      }
    </main>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 16px;
      background: #18181b;
      border-bottom: 1px solid #27272a;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: var(--accent);
    }
    .brand span {
      color: var(--accent);
      white-space: nowrap;
    }
    nav {
      display: flex;
      gap: 4px;
      flex: 1;
    }
    nav button {
      padding: 6px 14px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: #a1a1aa;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.15s;
    }
    nav button:hover {
      background: #27272a;
      color: #e4e4e7;
    }
    nav button.active {
      background: #3f3f46;
      color: #fff;
    }
    .status {
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 99px;
      background: #44403c;
      color: #a8a29e;
    }
    .status.connected {
      background: #14532d;
      color: #4ade80;
    }
    main {
      flex: 1;
      overflow: auto;
      padding: 16px;
    }
  `,
})
export class App implements OnInit, OnDestroy {
  readonly tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard' },
    { id: 'components' as Tab, label: 'Components' },
    { id: 'routes' as Tab, label: 'Routes' },
    { id: 'signals' as Tab, label: 'Signals' },
    { id: 'injectors' as Tab, label: 'Injectors' },
    { id: 'store' as Tab, label: 'Store' },
  ];

  tab = signal<Tab>('dashboard');
  rpc = signal<DevframeRpcClient | null>(null);
  connected = signal(false);

  ngOnInit() {
    // Deep link: read tab from hash
    const params = new URLSearchParams(location.hash.replace(/^#/, ''));
    const hashTab = params.get('tab');
    if (hashTab && this.tabs.some((t) => t.id === hashTab)) {
      this.tab.set(hashTab as Tab);
    }

    const baseURL = detectBaseURL();
    connectDevframe(baseURL ? { baseURL } : {}).then((client) => {
      this.rpc.set(client);
      this.connected.set(true);
      client.events.on('connection:status', (status) => {
        this.connected.set(status === 'connected');
      });
    });
  }

  ngOnDestroy() {
    // cleanup handled by devframe client
  }

  switchTab(id: Tab) {
    this.tab.set(id);
    history.replaceState(history.state, '', `#tab=${id}`);
  }
}

// Chrome extension passes ?baseURL=...; the Vite bridge mounts the connection
// at /__ng-devtools/ beside a page served from /; the standalone server and the
// Express mount serve it next to the page.
function sameOrigin(value: string): boolean {
  try {
    return new URL(value, location.href).origin === location.origin;
  } catch {
    return false;
  }
}

function detectBaseURL(): string | string[] | undefined {
  const params = new URLSearchParams(location.search);
  const fromQuery = params.get('baseURL');
  // Same origin only: any page can open this URL, and this value decides where
  // the panel opens its RPC channel.
  // `new URL` throws on a malformed value, and this runs before the connection
  // is made, so an unhandled throw would leave the panel blank.
  if (fromQuery && sameOrigin(fromQuery)) {
    return fromQuery;
  }

  if (location.pathname.includes('__ng-devtools')) return undefined;
  return ['./', '/__ng-devtools/'];
}

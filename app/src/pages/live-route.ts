import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import type { DevframeRpcClient } from 'devframe/client';
import { RouteCurrent } from './route-current';
import { RouteLint } from './route-lint';
import { RouteSetup } from './route-setup';
import { RouteTimeline } from './route-timeline';
import { RouteTree } from './route-tree';
import type { RouterPage } from './router-types';

const TABS = [
  { id: 'current', label: 'Current' },
  { id: 'navigations', label: 'Navigations' },
  { id: 'routes', label: 'Routes' },
  { id: 'setup', label: 'Setup' },
  { id: 'lint', label: 'Lint' },
] as const;

type TabId = (typeof TABS)[number]['id'];

@Component({
  selector: 'app-live-route',
  imports: [RouteCurrent, RouteLint, RouteSetup, RouteTimeline, RouteTree],
  template: `
    @if (failed()) {
      <p class="muted">Could not load the live router state.</p>
    } @else if (loading()) {
      <p class="muted">Loading the live router state…</p>
    } @else if (page(); as current) {
      @if (pages().length > 1) {
        <label class="page-pick">
          Page
          <select (change)="pickPage($event)">
            @for (p of pages(); track p.pageId) {
              <option [value]="p.pageId" [selected]="p.pageId === current.pageId">
                {{ p.snapshot?.url ?? p.pageId }} ({{ p.pageId }})
              </option>
            }
          </select>
        </label>
      }
      <div class="tabs" role="tablist" aria-label="Router views" (keydown)="onKey($event)">
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            role="tab"
            [id]="'router-tab-' + tab.id"
            [attr.aria-selected]="tab.id === selected()"
            [attr.aria-controls]="'router-panel-' + tab.id"
            [attr.tabindex]="tab.id === selected() ? 0 : -1"
            (click)="selected.set(tab.id)"
          >
            {{ tab.label }}
            @if (tab.id === 'navigations' && problems() > 0) {
              <span class="count" [attr.aria-label]="problems() + ' problem navigations'">{{
                problems()
              }}</span>
            }
          </button>
        }
      </div>
      <div
        class="panel"
        role="tabpanel"
        [id]="'router-panel-' + selected()"
        [attr.aria-labelledby]="'router-tab-' + selected()"
      >
        @switch (selected()) {
          @case ('current') {
            <app-route-current [page]="current" [rpc]="rpc()" />
          }
          @case ('navigations') {
            <app-route-timeline [page]="current" [rpc]="rpc()" />
          }
          @case ('routes') {
            <app-route-tree [page]="current" [rpc]="rpc()" />
          }
          @case ('setup') {
            <app-route-setup [page]="current" />
          }
          @case ('lint') {
            <app-route-lint [page]="current" [rpc]="rpc()" />
          }
        }
      </div>
    } @else {
      <p class="muted">No page is reporting router state yet. Open the app in a browser.</p>
    }
  `,
  styles: `
    :host {
      display: grid;
      gap: 12px;
      margin-bottom: 28px;
    }
    .muted {
      color: #a1a1aa;
      font-size: 13px;
    }
    .page-pick {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      font-size: 13px;
      color: #d4d4d8;
    }
    select {
      max-width: 100%;
      min-width: 0;
      padding: 4px 8px;
      background: #18181b;
      border: 1px solid #52525b;
      border-radius: 6px;
      color: #e4e4e7;
    }
    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      border-bottom: 1px solid #27272a;
    }
    [role='tab'] {
      padding: 6px 12px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: #a1a1aa;
      cursor: pointer;
      font-size: 13px;
    }
    [role='tab'][aria-selected='true'] {
      color: #e4e4e7;
      border-bottom-color: var(--accent);
    }
    [role='tab']:focus-visible,
    select:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .count {
      margin-left: 4px;
      padding: 0 5px;
      border-radius: 8px;
      background: #7f1d1d;
      color: #fecaca;
      font-size: 11px;
    }
  `,
})
export class LiveRoute {
  rpc = input<DevframeRpcClient | null>(null);

  readonly tabs = TABS;
  readonly selected = signal<TabId>('current');
  readonly pages = signal<RouterPage[]>([]);
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly pageId = linkedSignal<RouterPage[], string | null>({
    source: this.pages,
    computation: (pages, previous) =>
      previous?.value && pages.some((p) => p.pageId === previous.value)
        ? previous.value
        : (pages.find((p) => p.snapshot)?.pageId ?? pages[0]?.pageId ?? null),
  });

  private unsubscribe: (() => void) | null = null;
  private readonly destroyRef = inject(DestroyRef);

  readonly page = computed(() => {
    const pages = this.pages();
    return pages.find((p) => p.pageId === this.pageId()) ?? pages[0] ?? null;
  });

  readonly problems = computed(
    () =>
      (this.page()?.navigations ?? []).filter(
        (nav) => !nav.probe && ['failed', 'cancelled', 'redirected'].includes(nav.outcome),
      ).length,
  );

  constructor() {
    effect(() => {
      const client = this.rpc();
      if (client) this.load(client);
    });
    this.destroyRef.onDestroy(() => this.unsubscribe?.());
  }

  async load(client: DevframeRpcClient) {
    this.loading.set(true);
    this.failed.set(false);
    try {
      const state = await client.scope('ng-devtools').rpc.sharedState('router');
      if (this.destroyRef.destroyed) return;
      const apply = (value: unknown) => {
        this.pages.set((value as { pages?: RouterPage[] } | undefined)?.pages ?? []);
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

  pickPage(event: Event) {
    this.pageId.set((event.target as HTMLSelectElement).value);
  }

  onKey(event: KeyboardEvent) {
    const order = this.tabs.map((tab) => tab.id);
    const index = order.indexOf(this.selected());
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % order.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + order.length) % order.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = order.length - 1;
    else return;
    event.preventDefault();
    this.selected.set(order[next]);
    const host = event.currentTarget as HTMLElement;
    queueMicrotask(() => host.querySelector<HTMLElement>(`#router-tab-${order[next]}`)?.focus());
  }
}

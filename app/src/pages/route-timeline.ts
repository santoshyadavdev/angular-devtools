import { Component, computed, input, signal } from '@angular/core';
import type { DevframeRpcClient } from 'devframe/client';
import {
  SHARED_STYLES,
  routerAction,
  routerCall,
  tone,
  type NavigationRecord,
  type RouterPage,
} from './router-types';

const PHASES = ['recognize', 'guards', 'resolve', 'activate'] as const;
const PHASE_COLORS: Record<string, string> = {
  recognize: '#60a5fa',
  guards: '#f59e0b',
  resolve: '#a78bfa',
  activate: '#34d399',
};

@Component({
  selector: 'app-route-timeline',
  template: `
    <div class="toolbar">
      <label class="check">
        <input
          type="checkbox"
          [checked]="page().instrumented"
          (change)="toggleInstrument($event)"
        />
        Record each guard and resolver
      </label>
      <input
        class="field"
        type="text"
        aria-label="Filter navigations by URL"
        placeholder="Filter by URL"
        [value]="filter()"
        (input)="filter.set($any($event.target).value)"
      />
      <label class="check">
        <input
          type="checkbox"
          [checked]="onlyProblems()"
          (change)="onlyProblems.set($any($event.target).checked)"
        />
        Only problems
      </label>
      <button type="button" class="small" (click)="exportJson()">Export JSON</button>
    </div>
    @if (message()) {
      <p class="muted" role="status">{{ message() }}</p>
    }
    <div class="legend" aria-hidden="true">
      @for (phase of phases; track phase) {
        <span><i [style.background]="color(phase)"></i>{{ phase }}</span>
      }
    </div>
    @if (items().length) {
      <ol class="navs">
        @for (nav of items(); track nav.id) {
          <li>
            <div class="head">
              @if (!nav.beforeConnect) {
                <time>{{ time(nav.startedAt) }}</time>
              }
              <span class="muted">#{{ nav.id }}</span>
              <code>{{ nav.url }}</code>
              @if (nav.finalUrl && nav.finalUrl !== nav.url) {
                <span aria-hidden="true">→</span>
                <span class="visually-hidden">redirected to</span>
                <code>{{ nav.finalUrl }}</code>
              }
              <span class="badge" [attr.data-tone]="tone(nav.outcome)">{{ nav.outcome }}</span>
              @if (nav.beforeConnect) {
                <span class="muted">{{
                  nav.endedAt === undefined && nav.outcome !== 'pending'
                    ? 'before DevTools connected'
                    : 'started before DevTools connected'
                }}</span>
              } @else if (nav.phases?.['total'] !== undefined) {
                <span class="muted">{{ nav.phases?.['total'] }}ms</span>
              } @else if (nav.endedAt !== undefined) {
                <span class="muted">{{ nav.endedAt - nav.startedAt }}ms</span>
              }
              @if (nav.probe) {
                <span class="tag">probe</span>
              }
            </div>
            @if (bars(nav).length) {
              <div class="bar" role="img" [attr.aria-label]="barLabel(nav)">
                @for (bar of bars(nav); track bar.phase) {
                  <span
                    [style.width.%]="bar.width"
                    [style.background]="color(bar.phase)"
                    [attr.title]="bar.phase + ' ' + bar.ms + 'ms'"
                  ></span>
                }
              </div>
            }
            <dl class="details">
              @if (nav.from) {
                <dt>From</dt>
                <dd>
                  <code>{{ nav.from }}</code>
                </dd>
              }
              @if (nav.caller) {
                <dt>Started by</dt>
                <dd>{{ nav.caller }} ({{ nav.trigger }})</dd>
              }
              @if (nav.extras?.length) {
                <dt>Extras</dt>
                <dd>{{ nav.extras?.join(', ') }}</dd>
              }
              @if (nav.redirectedFrom !== undefined) {
                <dt>Redirect of</dt>
                <dd>#{{ nav.redirectedFrom }}</dd>
              }
              @if (nav.redirectTo) {
                <dt>Redirects to</dt>
                <dd>
                  <code>{{ nav.redirectTo }}</code> ({{ nav.redirectKind }})
                </dd>
              }
              @if (nav.guards && (nav.guards.names.length || nav.guards.passed === false)) {
                <dt>Guards</dt>
                <dd>{{ nav.guards.names.join(', ') || 'none' }}: {{ guardResult(nav) }}</dd>
              }
              @if (nav.runs?.length) {
                <dt>Runs</dt>
                <dd>
                  @for (run of nav.runs; track $index) {
                    <div>
                      <code>{{ run.guard }}</code> {{ run.kind }} on <code>{{ run.route }}</code
                      >: <strong [class.bad]="isBad(run.result)">{{ run.result }}</strong> ({{
                        run.ms
                      }}ms)
                    </div>
                  }
                </dd>
              }
              @if (nav.checked && (nav.checked.activate.length || nav.checked.deactivate.length)) {
                <dt>Checked</dt>
                <dd>
                  @if (nav.checked.deactivate.length) {
                    leaving {{ nav.checked.deactivate.join(', ') }};
                  }
                  entering {{ nav.checked.activate.join(', ') || 'nothing new' }}
                </dd>
              }
              @if (nav.resolvers?.names?.length) {
                <dt>Resolvers</dt>
                <dd>{{ nav.resolvers?.names?.join(', ') }}</dd>
              }
              @if (nav.lazyLoaded?.length) {
                <dt>Lazy loaded</dt>
                <dd>{{ nav.lazyLoaded?.join(', ') }}</dd>
              }
              @if (nav.reused?.length) {
                <dt>Reused</dt>
                <dd>
                  {{ nav.reused?.join(', ') }} (component kept, only inputs and params change)
                </dd>
              }
              @if (nav.requests) {
                <dt>HTTP</dt>
                <dd>{{ nav.requests.count }} request(s): {{ nav.requests.urls.join(', ') }}</dd>
              }
              @if (nav.scroll) {
                <dt>Scroll</dt>
                <dd>{{ nav.scroll }}</dd>
              }
              @if (nav.title) {
                <dt>Title after</dt>
                <dd>{{ nav.title }}</dd>
              }
              @if (nav.warnings?.length) {
                <dt>Warnings</dt>
                <dd>{{ nav.warnings?.join(' · ') }}</dd>
              }
              @if (nav.reason || nav.code) {
                <dt>Reason</dt>
                <dd class="reason">{{ [nav.code, nav.reason].filter(Boolean).join(': ') }}</dd>
              }
              @if (nav.errorCode) {
                <dt>Error</dt>
                <dd class="reason">{{ nav.errorCode }}</dd>
              }
              @if (nav.errorHandler) {
                <dt>Error handler</dt>
                <dd>{{ nav.errorHandler }}</dd>
              }
              @if (nav.earlier) {
                <dt>Earlier</dt>
                <dd>{{ nav.earlier }} navigation(s) before DevTools connected</dd>
              }
            </dl>
            <div class="actions">
              <button
                type="button"
                class="small"
                (click)="replay(nav)"
                [attr.aria-label]="'Replay navigation ' + nav.id"
              >
                Replay
              </button>
              <button
                type="button"
                class="small"
                (click)="copy(nav)"
                [attr.aria-label]="'Copy repro for navigation ' + nav.id"
              >
                Copy repro
              </button>
            </div>
          </li>
        }
      </ol>
    } @else {
      <p class="muted">
        No navigations since DevTools connected; earlier ones are not visible. Click a link in the
        app.
      </p>
    }
  `,
  styles: `
    ${SHARED_STYLES}
    :host {
      display: grid;
      gap: 10px;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 14px;
      align-items: center;
      font-size: 13px;
      color: #e4e4e7;
    }
    .check {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .legend {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #a1a1aa;
    }
    .legend i {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 4px;
      border-radius: 2px;
    }
    .navs {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 8px;
    }
    .navs > li {
      padding: 10px;
      border: 1px solid #27272a;
      border-radius: 6px;
      font-size: 13px;
    }
    .head {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    time {
      color: #a1a1aa;
      font-size: 12px;
    }
    .bar {
      display: flex;
      height: 6px;
      margin: 8px 0 4px;
      border-radius: 3px;
      overflow: hidden;
      background: #27272a;
    }
    .bar span {
      display: block;
      min-width: 2px;
    }
    .details {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 3px 12px;
      margin: 6px 0 0;
      font-size: 12px;
    }
    dt {
      color: #a1a1aa;
    }
    dd {
      margin: 0;
      color: #e4e4e7;
      overflow-wrap: anywhere;
    }
    .reason,
    .bad {
      color: #fecaca;
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }
  `,
})
export class RouteTimeline {
  page = input.required<RouterPage>();
  rpc = input<DevframeRpcClient | null>(null);

  readonly phases = PHASES;
  readonly filter = signal('');
  readonly onlyProblems = signal(false);
  readonly message = signal('');

  readonly items = computed(() => {
    const needle = this.filter().toLowerCase();
    return [...this.page().navigations]
      .reverse()
      .filter(
        (nav) =>
          (!needle ||
            nav.url.toLowerCase().includes(needle) ||
            !!nav.finalUrl?.toLowerCase().includes(needle)) &&
          (!this.onlyProblems() || !['succeeded', 'pending'].includes(nav.outcome)),
      );
  });

  tone(outcome: string) {
    return tone(outcome);
  }

  color(phase: string) {
    return PHASE_COLORS[phase];
  }

  bars(nav: NavigationRecord) {
    const total = nav.phases?.['total'];
    if (!total) return [];
    return PHASES.filter((phase) => (nav.phases?.[phase] ?? 0) > 0).map((phase) => ({
      phase,
      ms: nav.phases![phase],
      width: Math.max(1, (nav.phases![phase] / total) * 100),
    }));
  }

  barLabel(nav: NavigationRecord) {
    return `Phases: ${this.bars(nav)
      .map((bar) => `${bar.phase} ${bar.ms}ms`)
      .join(', ')}`;
  }

  guardResult(nav: NavigationRecord) {
    const passed = nav.guards?.passed;
    if (passed === true) return 'passed';
    if (passed === false) return nav.outcome === 'redirected' ? 'redirected' : 'blocked';
    return nav.outcome === 'pending' ? 'running' : `did not finish, navigation ${nav.outcome}`;
  }

  isBad(result: string) {
    return result === 'false' || /^(UrlTree|RedirectCommand|threw)/.test(result);
  }

  time(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }

  async toggleInstrument(event: Event) {
    const on = (event.target as HTMLInputElement).checked;
    const result = await routerAction(this.rpc(), this.page().pageId, { action: 'instrument', on });
    this.message.set(
      result?.['error']
        ? String(result['error'])
        : on
          ? 'Recording each guard and resolver.'
          : 'Stopped recording guards and resolvers.',
    );
  }

  async replay(nav: NavigationRecord) {
    this.message.set(`Replaying #${nav.id}…`);
    const result = await routerAction(this.rpc(), this.page().pageId, {
      action: 'replay',
      id: nav.id,
    });
    if (!result || result['error']) {
      this.message.set(String(result?.['error'] ?? 'Replay failed.'));
      return;
    }
    const replay = result['replay'] as { outcome?: string } | undefined;
    this.message.set(
      `Replay of #${nav.id}: ${replay?.outcome ?? 'unknown'}${result['same'] ? ' (same as before)' : ' (different from before)'}.`,
    );
  }

  async copy(nav: NavigationRecord) {
    const text = await routerCall<string>(this.rpc(), 'router-export', {
      pageId: this.page().pageId,
      id: nav.id,
    });
    if (!text) {
      this.message.set('Could not build the repro.');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      this.message.set(`Copied a markdown repro of #${nav.id}.`);
    } catch {
      this.message.set('The clipboard is not available here.');
    }
  }

  exportJson() {
    const blob = new Blob([JSON.stringify(this.page().navigations, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `navigations-${this.page().pageId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

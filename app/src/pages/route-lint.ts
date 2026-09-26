import { Component, computed, effect, input, signal, untracked } from '@angular/core';
import type { DevframeRpcClient } from 'devframe/client';
import { SHARED_STYLES, routerCall, type LintFinding, type RouterPage } from './router-types';

@Component({
  selector: 'app-route-lint',
  template: `
    <div class="toolbar">
      <button type="button" class="small" (click)="run()">Check again</button>
      <span class="muted"
        >Checks the live config, links and recent navigations. Lazy routes that have not loaded are
        skipped.</span
      >
    </div>
    @if (loading()) {
      <p class="muted">Checking…</p>
    } @else if (findings().length) {
      <ul class="findings">
        @for (finding of findings(); track $index) {
          <li>
            <div class="head">
              <span
                class="badge"
                [attr.data-tone]="
                  finding.severity === 'error'
                    ? 'bad'
                    : finding.severity === 'warning'
                      ? 'warn'
                      : ''
                "
                >{{ finding.severity }}</span
              >
              <code>{{ finding.rule }}</code>
              <code class="route">{{ finding.route }}</code>
            </div>
            <p>{{ finding.message }}</p>
            <p class="fix">
              Fix: {{ finding.fix }}
              <span class="muted"
                >(Angular
                {{
                  finding.angular === 'throws'
                    ? 'throws'
                    : finding.angular === 'warns'
                      ? 'warns'
                      : 'does not warn'
                }})</span
              >
            </p>
          </li>
        }
      </ul>
    } @else {
      <p class="muted">No route config problems found.</p>
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
      gap: 10px;
      align-items: center;
    }
    .findings {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 8px;
    }
    .findings li {
      padding: 10px;
      border: 1px solid #27272a;
      border-radius: 6px;
      font-size: 13px;
      color: #e4e4e7;
    }
    .head {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    .route {
      color: var(--accent);
    }
    p {
      margin: 6px 0 0;
    }
    .fix {
      color: #d4d4d8;
    }
  `,
})
export class RouteLint {
  page = input.required<RouterPage>();
  rpc = input<DevframeRpcClient | null>(null);

  readonly findings = signal<LintFinding[]>([]);
  readonly loading = signal(false);
  private readonly key = computed(
    () => `${this.page().pageId}:${this.page().generation}:${this.page().navigations.length}`,
  );

  constructor() {
    effect(() => {
      this.key();
      untracked(() => void this.run());
    });
  }

  async run() {
    this.loading.set(true);
    this.findings.set(
      (await routerCall<LintFinding[]>(this.rpc(), 'router-lint', this.page().pageId)) ?? [],
    );
    this.loading.set(false);
  }
}

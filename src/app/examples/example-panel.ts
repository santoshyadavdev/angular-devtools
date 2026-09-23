import { Component, contentChild, contentChildren } from '@angular/core';
import { StatCard } from './stat-card';

/** Projects cards, so the Signals tab has content queries to show. */
@Component({
  selector: 'app-example-panel',
  template: `
    <section class="panel">
      <h3>Projected cards</h3>
      <div class="slot">
        <ng-content />
      </div>
      <p class="summary">
        {{ cards().length }} projected card(s); the first is
        <strong>{{ firstCard()?.label() ?? 'none' }}</strong>
      </p>
    </section>
  `,
  styles: `
    .panel {
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 16px;
      background: var(--surface);
    }
    h3 {
      margin: 0 0 12px;
      font-size: 16px;
    }
    .slot {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
    .summary {
      margin: 12px 0 0;
      color: var(--muted);
      font-size: 14px;
    }
  `,
})
export class ExamplePanel {
  readonly firstCard = contentChild(StatCard);
  readonly cards = contentChildren(StatCard);
}

import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  template: `
    <article class="card">
      <button type="button" class="head" [attr.aria-expanded]="expanded()" (click)="toggle()">
        <span class="label">{{ label() }}</span>
        <span class="value">{{ value() }}</span>
      </button>
      @if (expanded()) {
        <p class="hint">{{ hint() }}</p>
        <button type="button" class="refresh" (click)="refreshed.emit()">Refresh</button>
      }
    </article>
  `,
  styles: `
    .card {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      background: var(--surface);
    }
    .head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
      width: 100%;
      padding: 0;
      border: 0;
      background: none;
      font: inherit;
      color: var(--ink);
      cursor: pointer;
    }
    .label {
      font-weight: 600;
    }
    .value {
      font-variant-numeric: tabular-nums;
      font-size: 20px;
    }
    .hint {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 14px;
    }
    .refresh {
      margin-top: 8px;
      padding: 4px 10px;
      border: 1px solid var(--line-strong);
      border-radius: 6px;
      background: var(--surface);
      cursor: pointer;
    }
    :focus-visible {
      outline: 2px solid var(--brand);
      outline-offset: 2px;
    }
  `,
})
export class StatCard {
  /** Required, so the Components tab shows a required input. */
  readonly label = input.required<string>();
  readonly value = input(0);
  readonly hint = input('Click the card to collapse it.');

  /** Two way bound, so the Signals tab shows a model. */
  readonly expanded = model(false);

  readonly refreshed = output<void>();

  protected toggle() {
    this.expanded.update((open) => !open);
  }
}

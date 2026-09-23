import { Component, input } from '@angular/core';

/** Shared frame for an example page: a title, a lead and what to look for. */
@Component({
  selector: 'app-example-page',
  template: `
    <section>
      <header>
        <h2>{{ heading() }}</h2>
        <p class="lead"><ng-content select="[lead]" /></p>
      </header>

      <aside class="hint">
        <span class="tab">{{ tab() }}</span>
        <span><ng-content select="[hint]" /></span>
      </aside>

      <ng-content />
    </section>
  `,
  styles: `
    section {
      display: grid;
      gap: 20px;
      padding: 24px 0 48px;
    }
    header {
      display: grid;
      gap: 6px;
    }
    h2 {
      margin: 0;
      font-size: 22px;
      color: var(--ink);
      letter-spacing: -0.01em;
    }
    .lead {
      margin: 0;
      max-width: 68ch;
      color: var(--muted);
    }
    .hint {
      display: flex;
      align-items: baseline;
      gap: 10px;
      padding: 10px 14px;
      border: 1px solid var(--line);
      border-left: 3px solid var(--line-strong);
      border-radius: 6px;
      background: var(--subtle);
      color: var(--muted);
      font-size: 14px;
    }
    .tab {
      flex: none;
      padding: 1px 8px;
      border: 1px solid var(--line-strong);
      border-radius: 4px;
      background: var(--surface);
      color: var(--muted);
      font-weight: 500;
      font-size: 12px;
      white-space: nowrap;
    }
  `,
})
export class ExamplePage {
  readonly heading = input.required<string>();
  /** The DevTools tab this page feeds. */
  readonly tab = input.required<string>();
}

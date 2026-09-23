import { Component, inject } from '@angular/core';
import { PANEL_FEATURE, PANEL_TITLE } from './di-tokens';

/** Provides its own PANEL_TITLE, so the injector tree has two levels to show. */
@Component({
  selector: 'app-di-child',
  providers: [{ provide: PANEL_TITLE, useValue: 'Overridden in the child injector' }],
  template: `
    <div class="child">
      <h3>Child injector</h3>
      <dl>
        <dt>PANEL_TITLE</dt>
        <dd>{{ title }}</dd>
        <dt>PANEL_FEATURE (inherited)</dt>
        <dd>{{ features.length }} entries from the parent</dd>
      </dl>
    </div>
  `,
  styles: `
    .child {
      border: 1px dashed var(--line-strong);
      border-radius: 8px;
      padding: 16px;
      background: var(--subtle);
    }
    h3 {
      margin: 0 0 10px;
      font-size: 15px;
      color: var(--ink);
    }
    dl {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 4px 16px;
      margin: 0;
      font-size: 14px;
    }
    dt {
      color: var(--muted);
    }
    dd {
      margin: 0;
      color: var(--ink);
    }
  `,
})
export class DiChild {
  protected readonly title = inject(PANEL_TITLE);
  protected readonly features = inject(PANEL_FEATURE);
}

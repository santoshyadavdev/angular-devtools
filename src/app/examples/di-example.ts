import { Component, inject } from '@angular/core';
import { DiChild } from './di-child';
import { ExamplePage } from './example-page';
import { ExampleSettings } from './example-settings';
import { FeatureCatalog, PANEL_FEATURE, PANEL_TITLE, type PanelFeature } from './di-tokens';

@Component({
  selector: 'app-di-example',
  imports: [DiChild, ExamplePage],
  providers: [
    { provide: PANEL_TITLE, useValue: 'Provided by the parent element injector' },
    { provide: PANEL_FEATURE, useValue: { name: 'highlight' }, multi: true },
    { provide: PANEL_FEATURE, useValue: { name: 'inspect' }, multi: true },
    {
      provide: FeatureCatalog,
      useFactory: (features: readonly PanelFeature[]) => new FeatureCatalog(features),
      deps: [PANEL_FEATURE],
    },
  ],
  template: `
    <app-example-page heading="Dependency injection" tab="Injectors">
      <ng-container lead>
        This page provides tokens at two levels: the parent below, and a child that overrides one of
        them. That is an injector hierarchy rather than a single flat list.
      </ng-container>
      <ng-container hint>
        Expand the element injectors and compare <code>PANEL_TITLE</code> at each level.
      </ng-container>

      <div class="parent">
        <h3>Parent injector</h3>
        <dl>
          <dt>PANEL_TITLE (useValue)</dt>
          <dd>{{ title }}</dd>
          <dt>PANEL_FEATURE (multi)</dt>
          <dd>{{ features.length }} entries: {{ catalog.names }}</dd>
          <dt>FeatureCatalog (useFactory)</dt>
          <dd>built from the multi token</dd>
          <dt>ExampleSettings (root singleton)</dt>
          <dd>{{ settings.refreshes() }} refresh(es) recorded</dd>
        </dl>

        <app-di-child />
      </div>
    </app-example-page>
  `,
  styles: `
    .parent {
      display: grid;
      gap: 16px;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 16px;
      background: var(--surface);
    }
    h3 {
      margin: 0;
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
    code {
      background: var(--subtle);
      border-radius: 4px;
      padding: 1px 5px;
    }
  `,
})
export class DiExample {
  protected readonly title = inject(PANEL_TITLE);
  protected readonly features = inject(PANEL_FEATURE);
  protected readonly catalog = inject(FeatureCatalog);
  protected readonly settings = inject(ExampleSettings);
}

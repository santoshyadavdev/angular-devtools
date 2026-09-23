import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, type Data } from '@angular/router';

/** Shows the data and the URL of whichever child route rendered it. */
@Component({
  selector: 'app-route-panel',
  template: `
    <h3>{{ title() }}</h3>
    <p>
      Rendered by <code>/{{ path() }}</code
      >, with route data <code>{{ data() }}</code
      >.
    </p>
  `,
  styles: `
    :host {
      display: block;
    }
    h3 {
      margin: 0 0 6px;
      font-size: 15px;
      color: var(--ink);
    }
    p {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
    }
    code {
      background: var(--subtle);
      border-radius: 4px;
      padding: 1px 5px;
      color: var(--ink);
    }
  `,
})
export class RoutePanel {
  private readonly route = inject(ActivatedRoute);

  private readonly snapshot = toSignal(this.route.data, { initialValue: {} as Data });
  // `route.url` only carries this level's segments, so a child route would
  // render `/summary` for `/examples/routes/summary`.
  private readonly segments = toSignal(this.route.url, { initialValue: [] });
  private readonly fullPath = this.route.pathFromRoot
    .map((route) => route.snapshot.url.map((segment) => segment.path).join('/'))
    .filter(Boolean)
    .join('/');

  readonly title = computed(() => String(this.snapshot()['title'] ?? 'Route'));
  readonly path = computed(() => {
    // Read so the panel still updates when this level's segments change.
    this.segments();
    return this.fullPath;
  });
  readonly data = computed(() => JSON.stringify(this.snapshot()));
}

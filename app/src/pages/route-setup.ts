import { Component, input } from '@angular/core';
import { SHARED_STYLES, type RouterPage } from './router-types';

@Component({
  selector: 'app-route-setup',
  template: `
    @if (page().setup; as setup) {
      @if (setup.mode === 'events-only') {
        <p class="note" role="note">
          Events-only mode: this build has no debug utils (production build or unusual setup), so
          the route config, lint and actions are limited.
        </p>
      }
      <dl class="facts">
        <dt>Set up with</dt>
        <dd>
          {{ setup.setupKind
          }}{{ setup.routers > 1 ? ', ' + setup.routers + ' routers on the page' : '' }}
        </dd>
        @if (setup.angularVersion) {
          <dt>Angular</dt>
          <dd>{{ setup.angularVersion }}</dd>
        }
        @if (setup.baseHref) {
          <dt>Base href</dt>
          <dd>
            <code>{{ setup.baseHref }}</code>
          </dd>
        }
        @if (setup.hydrated) {
          <dt>Hydration</dt>
          <dd>{{ setup.hydrated }} component(s) hydrated from server HTML</dd>
        }
      </dl>
      <h3>Options</h3>
      <div class="table-scroll" role="region" aria-label="Router options" tabindex="0">
        <table>
          <thead>
            <tr>
              <th scope="col">Option</th>
              <th scope="col">Value</th>
              <th scope="col">Source</th>
            </tr>
          </thead>
          <tbody>
            @for (option of setup.options; track option.name) {
              <tr>
                <td>
                  <code>{{ option.name }}</code>
                </td>
                <td>
                  <code>{{ option.value }}</code>
                </td>
                <td>
                  <span class="badge" [attr.data-tone]="option.set ? 'warn' : ''">{{
                    option.set ? 'set' : 'default'
                  }}</span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <h3>Features</h3>
      <ul class="chips">
        @for (feature of entries(setup.features); track feature[0]) {
          <li>
            <span class="badge" [attr.data-tone]="feature[1] === 'off' ? '' : 'good'"
              >{{ feature[0] }}: {{ feature[1] }}</span
            >
          </li>
        }
      </ul>
      <h3>Strategies</h3>
      <dl class="facts">
        @for (strategy of entries(setup.strategies); track strategy[0]) {
          <dt>{{ strategy[0] }}</dt>
          <dd>
            <code>{{ strategy[1] }}</code>
          </dd>
        }
      </dl>
    } @else {
      <p class="muted">The page has not reported its router setup yet.</p>
    }
  `,
  styles: `
    ${SHARED_STYLES}
    :host {
      display: grid;
      gap: 12px;
    }
    .note {
      margin: 0;
      padding: 8px 10px;
      border-left: 3px solid #fef08a;
      background: #27272a;
      color: #e4e4e7;
      font-size: 13px;
    }
    .facts {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 4px 12px;
      margin: 0;
      font-size: 13px;
    }
    dt {
      color: #a1a1aa;
    }
    dd {
      margin: 0;
      color: #e4e4e7;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
  `,
})
export class RouteSetup {
  page = input.required<RouterPage>();

  entries(value: Record<string, string>) {
    return Object.entries(value);
  }
}

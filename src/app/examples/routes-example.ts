import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ExamplePage } from './example-page';

@Component({
  selector: 'app-routes-example',
  imports: [ExamplePage, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <app-example-page heading="Nested routes" tab="Routes">
      <ng-container lead>
        This page has children of its own, route <code>data</code>, a redirect, a route with a param
        and a resolver, a guard that redirects, a guard that blocks and a resolver that fails.
      </ng-container>
      <ng-container hint>
        Click through the links and watch the current route and the navigation timeline in the
        Routes tab.
      </ng-container>

      <nav class="sub" aria-label="Route example">
        <a routerLink="summary" routerLinkActive="active" ariaCurrentWhenActive="page">Summary</a>
        <a routerLink="details" routerLinkActive="active" ariaCurrentWhenActive="page">Details</a>
        <a routerLink="users/7" routerLinkActive="active" ariaCurrentWhenActive="page">User 7</a>
        <a routerLink="admin" routerLinkActive="active" ariaCurrentWhenActive="page">Admin</a>
        <a routerLink="locked" routerLinkActive="active" ariaCurrentWhenActive="page">Locked</a>
        <a routerLink="broken" routerLinkActive="active" ariaCurrentWhenActive="page">Broken</a>
      </nav>

      <div class="outlet">
        <router-outlet />
      </div>
    </app-example-page>
  `,
  styles: `
    .sub {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .sub a {
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: var(--muted);
      text-decoration: none;
    }
    .sub a:hover {
      background: var(--subtle);
      color: var(--ink);
    }
    .sub a.active {
      background: var(--brand-soft);
      color: var(--brand);
    }
    .sub a:focus-visible {
      outline: 2px solid var(--brand);
      outline-offset: 2px;
    }
    .outlet {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 16px;
      background: var(--surface);
    }
  `,
})
export class RoutesExample {}

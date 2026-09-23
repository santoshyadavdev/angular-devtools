import { Routes } from '@angular/router';

/**
 * Deliberately varied: children, grandchildren, a redirect, route data and a
 * lazily loaded child configuration, so the Routes inspector has something to
 * show beyond a flat list.
 */
export const examplesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./examples-overview').then((m) => m.ExamplesOverview),
    data: { title: 'Overview' },
  },
  {
    path: 'signals',
    loadComponent: () => import('./signals-example').then((m) => m.SignalsExample),
    data: { title: 'Signals', inspector: 'signals' },
  },
  {
    path: 'components',
    loadComponent: () => import('./components-example').then((m) => m.ComponentsExample),
    data: { title: 'Components', inspector: 'components' },
  },
  {
    path: 'di',
    loadComponent: () => import('./di-example').then((m) => m.DiExample),
    data: { title: 'Injectors', inspector: 'injectors' },
  },
  {
    path: 'routes',
    loadComponent: () => import('./routes-example').then((m) => m.RoutesExample),
    data: { title: 'Routes', inspector: 'routes' },
    children: [
      { path: '', redirectTo: 'summary', pathMatch: 'full' },
      {
        path: 'summary',
        loadComponent: () => import('./route-panel').then((m) => m.RoutePanel),
        data: { title: 'Summary', depth: 3 },
      },
      {
        path: 'details',
        loadComponent: () => import('./route-panel').then((m) => m.RoutePanel),
        data: { title: 'Details', depth: 3 },
      },
    ],
  },
  { path: 'injectors', redirectTo: 'di', pathMatch: 'full' },
];

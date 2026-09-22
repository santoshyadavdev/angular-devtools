import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home').then((m) => m.Home) },
  { path: 'about', loadComponent: () => import('./pages/about').then((m) => m.About) },
  {
    path: 'products',
    loadComponent: () => import('./products/product-list').then((m) => m.ProductList),
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./products/product-detail').then((m) => m.ProductDetail),
  },
];

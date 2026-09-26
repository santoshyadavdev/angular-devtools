// @vitest-environment jsdom
import '@angular/compiler';
import { Component, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { expect, it } from 'vitest';
import { findRouter, type RouterDebugApi } from '../router.ts';

class Root {}
Component({ selector: 'app-root', template: '' })(Root);

it('finds the router of a RouterModule.forRoot app through the injector chain', async () => {
  document.body.innerHTML = '<app-root></app-root>';
  const app = await bootstrapApplication(Root, {
    providers: [
      provideZonelessChangeDetection(),
      importProvidersFrom(RouterModule.forRoot([{ path: '', component: Root }])),
    ],
  });
  const published = (globalThis as { ng?: RouterDebugApi }).ng!;
  const ng: RouterDebugApi = {
    getInjector: published.getInjector,
    ɵgetInjectorResolutionPath: published.ɵgetInjectorResolutionPath,
    ɵgetInjectorProviders: published.ɵgetInjectorProviders,
  };
  expect(published.ɵgetRouterInstance).toBeUndefined();
  expect(findRouter(ng, [document.querySelector('app-root')!])).toBe(app.injector.get(Router));
  app.destroy();
});

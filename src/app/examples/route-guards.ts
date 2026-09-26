import { inject } from '@angular/core';
import { Router, type CanActivateFn, type ResolveFn } from '@angular/router';

export const adminGuard: CanActivateFn = () =>
  inject(Router).parseUrl('/examples/routes/summary?from=admin');

export const lockedGuard: CanActivateFn = () => false;

export const userResolver: ResolveFn<{ id: string; name: string }> = (route) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ id: route.paramMap.get('id') ?? '', name: 'Ada Lovelace' }), 300),
  );

export const brokenResolver: ResolveFn<never> = () => {
  throw new Error('report service is down');
};

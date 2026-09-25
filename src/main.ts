import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Load the devtools overlay (which also opens the popup) in development only
bootstrapApplication(App, appConfig)
  .then((ref) => {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      return ref.whenStable().then(() => import('@santoshyadavdev/ng-devtools/overlay'));
    }
    return undefined;
  })
  .catch((err) => console.error(err));

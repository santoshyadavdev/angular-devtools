import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

// Load the devtools popup in development only
if (typeof window !== 'undefined' && isDevMode()) {
  import('@santoshyadavdev/ng-devtools/popup').then(
    (m) => m.createDevtoolsPopup(),
    () => {},
  );
}

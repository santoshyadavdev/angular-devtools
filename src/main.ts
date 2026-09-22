import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

// Load the devtools popup in development
if (typeof window !== 'undefined') {
  import('@santoshyadavdev/ng-devtools/popup').then(
    (m) => m.createDevtoolsPopup(),
    () => {},
  );
}

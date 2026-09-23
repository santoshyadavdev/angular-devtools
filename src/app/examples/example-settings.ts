import { Service, signal } from '@angular/core';

/** A root singleton, so the injector tree has an environment provider to show. */
@Service()
export class ExampleSettings {
  readonly refreshes = signal(0);

  recordRefresh() {
    this.refreshes.update((count) => count + 1);
  }
}

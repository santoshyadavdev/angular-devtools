import { initOverlay } from './overlay.ts';

export * from './overlay.ts';

// Auto-init when loaded as a script (skip during test environment)
if (
  typeof document !== 'undefined' &&
  !(typeof process !== 'undefined' && process.env?.['VITEST'])
) {
  initOverlay().catch(console.error);
  import('./popup.ts').then((m) => m.createDevtoolsPopup()).catch(console.error);
}

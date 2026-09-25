/**
 * NativeScript Polyfills
 */

// Gives the runtime a WebSocket global, which the ng-devtools overlay needs.
import '@valor/nativescript-websockets';

// Install @nativescript/core polyfills (XHR, setTimeout, requestAnimationFrame)
import '@nativescript/core/globals';
// Install @nativescript/angular specific polyfills
import '@nativescript/angular/polyfills';

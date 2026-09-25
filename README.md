# Angular DevTools

Inspect Angular component trees, signals, dependency injection, and routes — at dev time, build time, or through a coding agent. Built with [Devframe](https://devfra.me) so the same tool runs as an embedded panel, standalone CLI, static report, MCP server, or Chrome DevTools extension.

## Features

- **Component inspector** — discover components, inputs, outputs, and source files; view injected providers per component
- **Signal graph** — visualize signal, computed, linkedSignal, effect nodes and their dependency edges (Angular 19+)
- **DI inspector** — browse the injector hierarchy (element and environment) with providers at each level (Angular 17+)
- **Route inspector** — list registered routes from source
- **NgRx Store inspector** — detect `@ngrx/store` (actions, reducers, effects, selectors) and `@ngrx/signals` (`signalStore`, `signalState`, `signalMethod`) patterns from source; live state & action log via Redux DevTools protocol
- **Build metadata** — Angular version, TypeScript version, SSR status
- **In-page popup** — floating devtools panel with dock modes (float, bottom, right), drag, resize, and localStorage persistence
- **Agent-native** — all inspectors exposed as MCP tools and resources
- **Deep linking** — URL hash navigates to a specific tab (`#tab=signals`)
- **Page overlay** — highlights components in the running app

## Install

```sh
npm install @santoshyadavdev/ng-devtools devframe
```

For MCP agent support, also install the optional peer:

```sh
npm install @devframes/agentic
```

## How to Use

### Embedded in an Angular app (Express SSR)

Add the devframe middleware to your Express server:

```ts
// server.ts
import { initDevframe } from 'devframe/initiate';
import ngDevtools from '@santoshyadavdev/ng-devtools/devframe';

const devtools = initDevframe(ngDevtools, { base: '/__ng-devtools/' });
app.use(devtools.nodeMiddleware);
```

Open `http://localhost:4000/__ng-devtools/` to see the devtools UI.

### Standalone CLI

```sh
# Dev server with live RPC
npx @santoshyadavdev/ng-devtools dev

# Static report (offline HTML)
npx @santoshyadavdev/ng-devtools build --outDir dist-report

# MCP server for coding agents
npx @santoshyadavdev/ng-devtools mcp
```

### MCP Server for Coding Agents

**Claude Desktop** — add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ng-devtools": {
      "command": "npx",
      "args": ["@santoshyadavdev/ng-devtools", "mcp"]
    }
  }
}
```

**VS Code** — add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "ng-devtools": {
      "command": "npx",
      "args": ["@santoshyadavdev/ng-devtools", "mcp"]
    }
  }
}
```

When embedded in Express, the MCP endpoint is also available over HTTP at `/__ng-devtools/__mcp`.

#### Agent Tools

MCP clients see these with an underscore, as `ng-devtools_get-routes`.

| Tool                            | Description                                                 |
| ------------------------------- | ----------------------------------------------------------- |
| `ng-devtools:get-routes`        | List Angular routes from source                             |
| `ng-devtools:get-components`    | Discover components and directives, with inputs and outputs |
| `ng-devtools:get-signals`       | Signal declarations from source                             |
| `ng-devtools:get-providers`     | DI providers from source                                    |
| `ng-devtools:build-meta`        | Angular/TS versions, SSR status                             |
| `ng-devtools:highlight`         | Highlight a component in the page                           |
| `ng-devtools:inspect-signals`   | Signal graph a connected page reported                      |
| `ng-devtools:inspect-providers` | Injector tree a connected page reported                     |
| `ng-devtools:get-ngrx-store`    | Scan source for NgRx store patterns                         |

#### Agent Resources

| Resource                     | Content                      |
| ---------------------------- | ---------------------------- |
| `ng-devtools:component-tree` | Live component hierarchy     |
| `ng-devtools:signal-graph`   | Signal dependency graph      |
| `ng-devtools:injector-tree`  | DI injector hierarchy        |
| `ng-devtools:ngrx-store`     | Live NgRx state & action log |

### Vite DevTools Dock

Mount as a dock panel inside Vite DevTools:

```ts
// vite.config.ts
import { viteDevframeHub } from '@devframes/vite/hub';
import { createUi } from '@devframes/hub-ui';
import ngDevtools from '@santoshyadavdev/ng-devtools/devframe';

export default defineConfig({
  plugins: [
    viteDevframeHub({
      devframes: [ngDevtools],
      ui: createUi({ branding: { productName: 'Angular DevTools' } }),
    }),
  ],
});
```

### Chrome DevTools Extension

See the [Chrome Extension](#chrome-devtools-extension-1) section below for how to package this as a Chrome extension.

### Browser Overlay

The overlay runs inside the user's Angular page and collects live component, signal, DI, and NgRx data. Importing the module starts it, so in most apps that import is all that is needed:

```ts
import '@santoshyadavdev/ng-devtools/overlay';
```

It looks for the devframe connection next to the page and then at
`/__ng-devtools/`.

`initOverlay` is exported for a devtools mounted somewhere else. Importing the
module has already started an overlay on the default URLs by then, so dispose of
that one before starting another, or the page ends up with two connections and
two polling intervals:

```ts
import { initOverlay } from '@santoshyadavdev/ng-devtools/overlay';

const dispose = await initOverlay({ baseURL: '/__my-devtools/' });
```

### In-Page Popup

The devtools can appear as a floating popup directly on your page — no browser extension needed:

```ts
import { createDevtoolsPopup } from '@santoshyadavdev/ng-devtools/popup';

createDevtoolsPopup();
```

This adds a purple FAB button (bottom-right) that opens the full devtools UI in an iframe. Supports three dock modes (float, bottom, right), dragging, resizing, and persists position via localStorage. The popup is automatically loaded in development when using the demo app.

## NativeScript

The same devtools work inside a NativeScript Angular app. The app has no DOM, so a
separate overlay walks the native view tree through Angular's debug API and reports
over a WebSocket to a devtools server running on your machine. The component tree,
signal graph, injector tree (including environment injectors and their providers),
the highlight tool and the MCP surface all work; the source scanners run against
the app's `src/`.

### Set up an app

```sh
npm install @santoshyadavdev/ng-devtools @valor/nativescript-websockets
```

```ts
// src/polyfills.ts — first import, so the runtime has a WebSocket global
import '@valor/nativescript-websockets';
```

```ts
// src/main.ts — before runNativeScriptAngularApp()
import { initNativeScriptOverlay } from '@santoshyadavdev/ng-devtools/overlay-nativescript';

if (__DEV__) {
  initNativeScriptOverlay();
}
```

`initNativeScriptOverlay()` must run before Angular bootstraps: the DI inspector
relies on Angular's injector profiler, which Angular only wires while it creates
the platform. The overlay connects to `http://localhost:9999/` on the iOS
simulator and `http://10.0.2.2:9999/` on the Android emulator; pass
`{ baseURL }` for a physical device, and allow plain HTTP to that address in
`Info.plist` / `AndroidManifest.xml`.

### Run the devtools server

```sh
cd my-nativescript-app
npx @santoshyadavdev/ng-devtools dev --host 0.0.0.0 --no-auth
```

Then open `http://localhost:9999/` for the UI, or point an MCP client at
`http://localhost:9999/__mcp`.

### Example app

`app-nativescript/` is a `ns create --ng` project wired up this way, with a small
showcase component (signals, a computed, an effect and a component-level
provider). Tested on the iOS simulator; Android has not been verified yet.

```sh
pnpm devtools:nativescript   # devtools server scanning app-nativescript/src
cd app-nativescript && ns debug ios --no-hmr
```

## Demo App

The repository includes a demo Angular app (`src/`) that showcases the devtools with a product catalog built using `@ngrx/signals`:

- **Home** — simple counter with `signal()`
- **Products** — product list and detail pages powered by a `signalStore` with `withState`, `withComputed`, and `withMethods`
- **About** — static page

Run `pnpm start` and click the purple FAB button to open the devtools popup and see all inspectors in action.

## Development

```sh
# Install dependencies
pnpm install

# Dev server for the devtools UI (with live RPC)
pnpm devtools:dev

# Build the devtools UI SPA
pnpm devtools:build

# Build assets into the publishable package
pnpm devtools:build-pkg

# Run the Angular host app (includes in-page devtools popup)
pnpm start
```

## Publishing

The devtool ships as two npm packages:

| Package                               | Contents                                               |
| ------------------------------------- | ------------------------------------------------------ |
| `@santoshyadavdev/ng-devtools`        | Node-side logic, RPC, CLI, overlay, popup              |
| `@santoshyadavdev/ng-devtools-assets` | Built SPA (served at runtime via CDN or local install) |

```sh
# Build assets, then publish both
pnpm devtools:publish
```

Keep versions in sync — the tool references the assets package by exact version.

## Chrome DevTools Extension

To distribute this as a Chrome DevTools extension, you need a thin Chrome extension shell that opens the devtools UI in a DevTools panel. The built SPA already works standalone — the extension just embeds it.

### 1. Create the extension scaffold

Create an `extension/` directory:

```
extension/
  manifest.json
  devtools.html
  devtools.js
  panel.html
```

### 2. `extension/manifest.json`

```json
{
  "manifest_version": 3,
  "name": "Angular DevTools",
  "version": "0.0.1",
  "description": "Inspect Angular components, signals, DI, and routes.",
  "devtools_page": "devtools.html",
  "permissions": ["scripting"],
  "host_permissions": ["<all_urls>"],
  "icons": {
    "128": "icon-128.png"
  }
}
```

### 3. `extension/devtools.html` and `extension/devtools.js`

```html
<!-- devtools.html -->
<!doctype html>
<script src="devtools.js"></script>
```

```js
// devtools.js — creates the panel in Chrome DevTools
chrome.devtools.panels.create('Angular', 'icon-128.png', 'panel.html');
```

### 4. `extension/panel.html`

This is where the built SPA loads. Copy the built assets (`dist/devtools-ui/`) into the extension and point `panel.html` at the SPA's `index.html`:

```html
<!-- panel.html — the devtools SPA loads here -->
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <iframe src="ui/index.html" style="width:100%;height:100vh;border:none;"></iframe>
  </body>
</html>
```

### 5. Build the extension

```sh
# Build the devtools SPA
pnpm devtools:build

# Copy into the extension
mkdir -p extension/ui
cp -r dist/devtools-ui/* extension/ui/
```

### 6. Load in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `extension/` directory
4. Open DevTools on any Angular app → the **Angular** panel appears

### 7. Publish to Chrome Web Store

1. Zip the `extension/` directory
2. Go to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Click **New item** → upload the zip
4. Fill in the listing details and submit for review

### Connecting the extension to the running app

The extension panel loads the SPA in static mode by default. To connect it to a live dev server for real-time RPC, the extension's content script or background service worker needs to detect the devframe's `__connection.json` on the inspected page and pass the connection to the panel. This is the same pattern the official Angular DevTools Chrome extension uses — a content script bridges the inspected page and the DevTools panel via `chrome.runtime.connect`.

## License

MIT

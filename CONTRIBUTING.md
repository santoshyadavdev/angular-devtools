# Contributing to Angular DevTools

Thanks for your interest in contributing! This guide covers how to set up the project and submit changes.

## Prerequisites

- Node.js 24+
- pnpm 10+

## Setup

```sh
git clone https://github.com/santoshyadavdev/angular-devtools.git
cd angular-devtools
pnpm install
```

## Project Structure

```
app/                          # Devtools UI SPA (Angular + Vite)
  src/app.ts                  # Root component with tab navigation
  src/pages/                  # Dashboard, Components, Routes, Signals, Injectors
  vite.config.ts              # Vite config with Analog Angular plugin
packages/
  ng-devtools/                # Publishable npm package
    src/devframe.ts           # defineDevframe() — tool definition
    src/overlay.ts            # Client script running in user's page
    src/rpc/                  # Node-side RPC functions
extension/                    # Chrome DevTools extension
src/                          # Angular host app (demo/playground)
```

## Development

```sh
# Devtools UI with live RPC
pnpm devtools:dev

# Build the devtools SPA
pnpm devtools:build

# Run the Angular host app
pnpm start

# Build Chrome extension
pnpm extension:build
```

## Making Changes

### Adding a new RPC function

1. Create the function in `packages/ng-devtools/src/rpc/`
2. Register it in `packages/ng-devtools/src/devframe.ts`
3. Call it from the UI in `app/src/pages/`

### Adding a new tab

1. Create a component in `app/src/pages/`
2. Import and add it to `app/src/app.ts` (imports array, tabs array, template switch)
3. Add a card to `app/src/pages/dashboard.ts`

### Adding agent tools

Add `agent: { description }` to any RPC function, or use `ctx.agent.registerTool()` in the devframe setup.

## Code Style

- Follow the conventions in `AGENTS.md`
- Use `signal()`, `computed()`, `input()`, `output()` — not decorators
- Use `@if`/`@for`/`@switch` control flow — not structural directives
- Keep components small with inline templates where practical

## Testing

```sh
pnpm test            # host app
pnpm test:devtools   # devtools package
pnpm typecheck       # host app + specs, devtools UI, devtools package + its tests
pnpm format:check
```

## Submitting a PR

1. Fork and create a branch from `main`
2. Make your changes
3. Verify `pnpm devtools:build` succeeds
4. If you changed `app/`, run `pnpm extension:build && pnpm devtools:build-pkg` and commit `extension/ui` and `packages/ng-devtools-assets/dist`. CI fails when they are stale
5. Test with `pnpm devtools:dev`
6. Open a PR against `main`

import { join } from 'node:path';
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { devframeViteBridge } from '@devframes/vite/single';
import ngDevtools from '@santoshyadavdev/ng-devtools/devframe';

export default defineConfig({
  base: './',
  root: import.meta.dirname,
  build: { outDir: '../dist/devtools-ui', emptyOutDir: true },
  optimizeDeps: {
    entries: [],
    exclude: [
      '@angular/core',
      '@angular/common',
      '@angular/platform-browser',
      '@angular/compiler',
      '@angular/router',
    ],
  },
  plugins: [
    angular({ tsconfig: join(import.meta.dirname, 'tsconfig.json') }),
    devframeViteBridge(ngDevtools, { base: '/__ng-devtools/', auth: false }),
  ],
});

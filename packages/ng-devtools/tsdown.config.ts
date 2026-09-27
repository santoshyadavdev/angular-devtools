import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/devframe.ts', 'src/popup.ts', 'src/overlay.ts', 'src/overlay-auto.ts'],
  format: 'esm',
  platform: 'node',
  dts: true,
});

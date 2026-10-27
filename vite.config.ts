/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { mdFoundation } from './scripts/vite-plugin-md-foundation.ts';

export default defineConfig({
  plugins: [
    mdFoundation(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  build: {
    // Browser policy: Baseline features are used natively, not lowered.
    // light-dark() needs Chrome/Edge 123, Firefox 120, Safari 17.5; :has() needs Firefox 121.
    cssTarget: ['chrome123', 'edge123', 'firefox121', 'safari17.5'],
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});

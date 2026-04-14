import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 4200,
    https: {
      key: readFileSync(resolve(__dirname, 'ssl/localhost-key.pem')),
      cert: readFileSync(resolve(__dirname, 'ssl/localhost.pem')),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/__tests__/**/*.{js,ts,vue}'],
    exclude: ['src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/stores/**'],
      thresholds: {
        perFile: true,
        lines: 75,
      },
    },
  },
});

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
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 75,
      },
    },
  },
});

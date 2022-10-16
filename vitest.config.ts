import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#': fileURLToPath(new URL('./src/router', import.meta.url)),
    },
  },
  test: {
    coverage: {
      reporter: ['html', 'lcov'],
      all: true,
      exclude: [
        'node_modules/**',
        'test/**',
        'src/index.ts',
        '.eslintrc.js',
        'vitest.config.ts',
        '**/*.d.ts',
        'scripts/**',
      ],
    },
    globalSetup: './test/global_setup.ts',
  },
});

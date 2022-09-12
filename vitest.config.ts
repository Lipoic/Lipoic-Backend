import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    coverage: {
      reporter: ['html', 'lcov'],
      all: true,
      exclude: [
        'node_modules/**',
        'dist/**',
        'test/**',
        '.eslintrc.js',
        'vitest.config.ts',
      ],
    },
  },
});

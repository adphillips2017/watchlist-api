import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/db.ts',
        'src/models/',
        'src/constants/',
        'src/index.ts',
        'src/controllers/notFound.controller.ts'
      ],
    },
    globals: true
  }
});
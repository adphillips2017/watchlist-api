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
        'src/db.ts', // Database initialization might be fully mocked, so often excluded
        'src/models/', // Models (interfaces/types) don't have executable code
        'src/constants/', // Constants don't have executable code
        'src/index.ts', // Main server entry file; often not tested directly for coverage
        'src/controllers/notFound.controller.ts', // Simple 404 handler
      ],
    },
    globals: true
  }
});
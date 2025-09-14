import { defineConfig, type UserConfig } from 'vite';
import path from 'path';

export default defineConfig((): UserConfig => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/mocks',

  resolve: {
    alias: {
      '@org/models': path.resolve(__dirname, '../models/src/index.ts'),
      '@org/enums': path.resolve(__dirname, '../enums/src/index.ts'),
      '@org/constants': path.resolve(__dirname, '../constants/src/index.ts'),
      '@org/config': path.resolve(__dirname, '../config/src/index.ts'),
      '@org/api': path.resolve(__dirname, '../api/src/index.ts'),
      '@org/store': path.resolve(__dirname, '../store/src/index.ts'),
      '@org/ui': path.resolve(__dirname, '../ui/src/index.ts'),
      '@org/mocks': path.resolve(__dirname, '../mocks/src/index.ts'),
      '@org/utils': path.resolve(__dirname, '../utils/src/index.ts'),
      '@org/storage': path.resolve(__dirname, '../storage/src/index.ts'),
      '@org/hooks': path.resolve(__dirname, '../hooks/src/index.ts'),
      '@org/icons': path.resolve(__dirname, '../icons/src/index.ts'),
      '@org/validation': path.resolve(__dirname, '../validation/src/index.ts'),
      '@org/i18n': path.resolve(__dirname, '../i18n/src/index.ts'),
      '@org/testing': path.resolve(__dirname, '../testing/src/index.ts'),
    }
  },

  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'HemaMocks',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [
        'vite',
        'express',
        'cors',
        'fast-glob',
        'node:path',
        'node:url',
        'node:querystring',
        'node:http'
      ]
    },
    outDir: 'dist',
    emptyOutDir: true
  },

  plugins: [],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  test: {
    name: '@hema-web-monorepo/mocks',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));

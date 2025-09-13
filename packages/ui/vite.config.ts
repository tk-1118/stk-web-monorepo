/// <reference types='vitest' />
import { defineConfig, type UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import * as path from 'path';

export default defineConfig((): UserConfig => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/ui',

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

  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: '@hema-web-monorepo/ui',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es' as const],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [],
    },
  },
  test: {
    name: '@hema-web-monorepo/ui',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));

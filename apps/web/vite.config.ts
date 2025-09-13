/// <reference types='vitest' />
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'

export default defineConfig((): UserConfig => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/web',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  resolve: {
    alias: {
      '@org/models': path.resolve(__dirname, '../../packages/models/src/index.ts'),
      '@org/enums': path.resolve(__dirname, '../../packages/enums/src/index.ts'),
      '@org/constants': path.resolve(__dirname, '../../packages/constants/src/index.ts'),
      '@org/config': path.resolve(__dirname, '../../packages/config/src/index.ts'),
      '@org/api': path.resolve(__dirname, '../../packages/api/src/index.ts'),
      '@org/store': path.resolve(__dirname, '../../packages/store/src/index.ts'),
      '@org/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@org/mocks': path.resolve(__dirname, '../../packages/mocks/src/index.ts'),
      '@org/utils': path.resolve(__dirname, '../../packages/utils/src/index.ts'),
      '@org/storage': path.resolve(__dirname, '../../packages/storage/src/index.ts'),
      '@org/hooks': path.resolve(__dirname, '../../packages/hooks/src/index.ts'),
      '@org/icons': path.resolve(__dirname, '../../packages/icons/src/index.ts'),
      '@org/validation': path.resolve(__dirname, '../../packages/validation/src/index.ts'),
      '@org/i18n': path.resolve(__dirname, '../../packages/i18n/src/index.ts'),
      '@org/testing': path.resolve(__dirname, '../../packages/testing/src/index.ts'),
    }
  },
  plugins: [
    vue(),
    // 自动导入 Vue API
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: true
    }),
    // 自动导入组件
    Components({
      dts: true
    }),
    // TODO: Mock 中间件稍后添加
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    name: '@hema-web-monorepo/web',
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

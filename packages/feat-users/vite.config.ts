/// <reference types='vitest' />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/feat-users',
  plugins: [
    vue(),
    // 自动导入 Element Plus API
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: true
    }),
    // 自动导入 Element Plus 组件
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true
    }),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../dist/packages/feat-users',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'feat-users',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus'
      ],
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/feat-users',
      provider: 'v8',
    },
  },
})

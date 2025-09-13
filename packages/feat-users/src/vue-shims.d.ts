/**
 * Vue 组件类型声明
 * 为 .vue 文件提供 TypeScript 支持
 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

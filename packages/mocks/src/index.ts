/**
 * Mock 系统统一导出
 * 提供完整的 Mock 数据解决方案
 */

// 核心类型定义
export * from './types'

// 工具函数
export * from './utils'

// 注册与汇聚机制
export * from './registry'

// 中间件
export * from './middleware'

// Vite 插件
export * from './plugin.vite'

// 独立服务器
export * from './server'

// 向后兼容的导出
export { createMockMiddleware as mockMiddleware } from './middleware'
export { ViteMockPlugin as MockPlugin } from './plugin.vite'

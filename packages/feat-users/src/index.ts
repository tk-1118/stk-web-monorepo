/**
 * 用户管理领域特性包主入口文件
 * 统一导出路由、组件、状态管理和工具函数
 */

// 导出路由配置
export { usersRoutes as routes } from './routes'

// 导出状态管理
export { useUsersStore } from './store/users.store'

// 导出 API 服务
export { usersApi } from './api/users.service'

// 导出组件
// export { default as UserCard } from './components/UserCard.vue'

// 导出国际化配置
export { zhUsers } from './i18n/zh'
export { enUsers } from './i18n/en'

// 导出 Mock 数据（开发环境使用）
export { mockUsers, mockUserActivities, mockUsersApi } from './mocks/users.mock'

// 导出类型定义
// export type { Props as UserCardProps } from './components/UserCard.vue'

/**
 * 用户管理模块安装器
 * 提供统一的模块安装和配置方法
 */
import type { Router } from 'vue-router'
import type { App } from 'vue'
import { usersRoutes } from './routes'

/** 安装选项接口 */
export interface InstallOptions {
  /** 是否启用 Mock 数据 */
  enableMock?: boolean
  /** 路由前缀 */
  routePrefix?: string
  /** 国际化语言 */
  locale?: 'zh' | 'en'
}

/**
 * 安装用户管理模块
 * @param app Vue 应用实例
 * @param router 路由实例
 * @param options 安装选项
 */
export function install(app: App, router: Router, options: InstallOptions = {}) {
  const { enableMock = false, routePrefix = '', locale = 'zh' } = options

  // 注册路由
  usersRoutes.forEach(route => {
    // 如果设置了路由前缀，则添加前缀
    if (routePrefix) {
      route.path = `${routePrefix}${route.path}`
    }
    router.addRoute(route)
  })

  // 如果启用 Mock 数据，则配置 Mock 拦截器
  if (enableMock && typeof window !== 'undefined') {
    console.log('[feat-users] Mock 数据已启用')
    // 这里可以配置 Mock.js 或其他 Mock 工具
  }

  // 配置国际化
  if (locale) {
    console.log(`[feat-users] 国际化语言设置为: ${locale}`)
  }

  console.log('[feat-users] 用户管理模块安装完成')
}

/**
 * 默认导出安装器
 */
export default {
  install
}

/**
 * 应用外壳路由配置
 * 实现插件化路由注册，支持领域特性包的路由动态挂载
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../pages/home.vue'

// 导入领域特性包的路由
import { routes as usersRoutes } from '@hema-web-monorepo/feat-users'

/** 基础路由配置（应用外壳层面的路由） */
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: '首页',
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/404',
    name: 'notFound',
    component: () => import('../pages/not-found.vue'),
    meta: {
      title: '页面未找到',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

/** 领域特性路由集合 */
const featureRoutes: RouteRecordRaw[] = [
  ...usersRoutes
  // 未来可以添加更多领域特性包的路由
  // ...ordersRoutes,
  // ...productsRoutes
]

/** 合并所有路由 */
const allRoutes: RouteRecordRaw[] = [
  ...baseRoutes,
  ...featureRoutes
]

/** 创建路由实例 */
const router = createRouter({
  history: createWebHistory(),
  routes: allRoutes
})

/**
 * 全局前置守卫 - 鉴权处理
 */
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 盒马Web管理系统`
  }

  // 检查是否需要登录
  const requiresAuth = to.meta?.requiresAuth !== false
  const isAuthenticated = checkAuthentication() // 这里应该检查实际的登录状态

  if (requiresAuth && !isAuthenticated) {
    // 需要登录但未登录，跳转到登录页
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

/**
 * 全局后置钩子 - 页面加载完成处理
 */
router.afterEach((to, from) => {
  // 可以在这里添加页面访问统计、埋点等逻辑
  console.log(`路由跳转: ${from.path} -> ${to.path}`)
})

/**
 * 检查用户认证状态
 * TODO: 实现真实的认证逻辑
 */
function checkAuthentication(): boolean {
  // 这里应该检查 token、session 等认证信息
  // 暂时返回 true，表示已登录
  return true
}

/**
 * 动态添加路由的工具函数
 * 用于运行时动态注册新的领域特性路由
 */
export function addFeatureRoutes(routes: RouteRecordRaw[]) {
  routes.forEach(route => {
    router.addRoute(route)
  })
}

/**
 * 获取所有已注册的路由
 */
export function getAllRoutes() {
  return router.getRoutes()
}

export default router

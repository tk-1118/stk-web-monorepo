/**
 * 运行时 Mock 中间件工厂
 * 提供无状态的中间件工厂，支持动态路由获取和热更新
 */
import type { Connect } from 'vite'
import { createMockContext, readBody, delay, logMockRequest, matchPath } from './utils'
import type { MockRoute } from './types'

/**
 * Mock 中间件工厂配置选项
 */
export interface MockMiddlewareFactoryOptions {
  /** 获取当前路由的函数（支持热更新） */
  getRoutes: () => MockRoute[]
  /** 仅匹配指定前缀的路径（如 '/api'） */
  base?: string
  /** 是否启用请求日志 */
  log?: boolean
  /** 自定义错误处理函数 */
  onError?: (error: Error, req: any, res: any) => void
}

/**
 * 创建 Mock 中间件工厂
 * 支持动态路由获取，实现热更新功能
 *
 * @param options 中间件配置选项
 * @returns Connect 中间件函数
 */
export function mockMiddlewareFactory(options: MockMiddlewareFactoryOptions): Connect.NextHandleFunction {
  const {
    getRoutes,
    base = '/api',
    log = true,
    onError
  } = options

  return async (req, res, next) => {
    try {
      const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
      const method = (req.method || 'GET').toUpperCase()

      // 检查是否匹配 base 路径
      if (base && !url.pathname.startsWith(base)) {
        return next()
      }

      // 处理 OPTIONS 预检请求
      if (method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        res.statusCode = 200
        res.end()
        return
      }

      // 获取当前路由（支持热更新）
      const routes = getRoutes()

      // 查找匹配的路由
      for (const route of routes) {
        if (route.method !== method) continue

        const matchResult = matchPath(route.path, url.pathname)

        if (matchResult) {
          try {
            // 创建上下文对象
            const ctx = createMockContext(req, res, url)

            // 设置路径参数（正则匹配时）
            if (Array.isArray(matchResult)) {
              ctx.params = matchResult
            }

            // 读取请求体（非 GET 请求）
            if (method !== 'GET' && method !== 'HEAD') {
              ctx.body = await readBody(req)
            }

            // 应用延迟（如果配置了）
            if (route.delayMs && route.delayMs > 0) {
              await delay(route.delayMs)
            }

            // 执行处理函数
            const result = await route.handler(req, res, ctx)

            // 如果响应已经发送，直接返回
            if (res.headersSent) {
              if (log) {
                logMockRequest(method, url.pathname)
              }
              return
            }

            // 发送响应
            const status = route.status ?? 200
            ctx.reply(status, result, route.headers)

            // 记录日志
            if (log) {
              logMockRequest(method, url.pathname)
            }

            return
          } catch (error) {
            console.error(`[mock-middleware] 处理路由失败 ${method} ${url.pathname}:`, error)

            if (onError) {
              onError(error as Error, req, res)
              return
            }

            // 发送错误响应
            if (!res.headersSent) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.end(JSON.stringify({
                error: 'Mock 处理失败',
                message: (error as Error).message,
                code: 500
              }))
            }
            return
          }
        }
      }

      // 没有匹配的路由，继续下一个中间件
      next()
    } catch (error) {
      console.error('[mock-middleware] 中间件执行失败:', error)
      if (onError) {
        onError(error as Error, req, res)
      } else {
        next(error)
      }
    }
  }
}

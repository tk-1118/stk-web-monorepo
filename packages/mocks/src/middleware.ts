/**
 * Mock 中间件实现
 * 提供 Connect/Express 兼容的中间件，用于拦截和处理 API 请求
 */
import type { Connect } from 'vite'
import { collectMocks, type CollectOptions } from './registry'
import { createMockContext, readBody, parseEnvList, delay, logMockRequest, matchPath } from './utils'
import type { MockRoute, NamespacedMocks } from './types'

/**
 * Mock 中间件配置选项
 */
export interface MiddlewareOptions extends CollectOptions {
  /** 仅匹配指定前缀的路径（如 '/api'） */
  base?: string
  /** 是否启用请求日志 */
  log?: boolean
  /** 是否启用详细日志 */
  verbose?: boolean
  /** 自定义错误处理函数 */
  onError?: (error: Error, req: any, res: any) => void
}

/**
 * 创建 Mock 中间件
 * 支持 Vite 开发服务器和 Express 应用
 *
 * @param options 中间件配置选项
 * @returns Connect 中间件函数
 */
export function createMockMiddleware(options: MiddlewareOptions = {}): Connect.NextHandleFunction {
  let routes: Array<MockRoute & { feature: string }> = []
  let isInitialized = false
  let initPromise: Promise<void> | null = null

  /**
   * 初始化 Mock 路由
   * 确保路由只被加载一次
   */
  async function initialize(): Promise<void> {
    if (isInitialized) return
    if (initPromise) return initPromise

    initPromise = (async () => {
      try {
        if (options.verbose) {
          console.log('[mock-middleware] 开始初始化 Mock 中间件...')
        }

        // 从环境变量读取配置
        const envInclude = parseEnvList(process.env.VITE_MOCK_INCLUDE)
        const envExclude = parseEnvList(process.env.VITE_MOCK_EXCLUDE)

        const collectOptions: CollectOptions = {
          ...options,
          include: envInclude ?? options.include,
          exclude: envExclude ?? options.exclude,
          verbose: options.verbose
        }

        // 收集所有 Mock 配置
        const mockConfigs = await collectMocks(collectOptions)

        // 展平所有路由并添加 feature 标识
        routes = mockConfigs.flatMap((config: NamespacedMocks) =>
          config.routes.map(route => ({
            ...route,
            feature: config.feature
          }))
        )

        isInitialized = true

        if (options.verbose) {
          console.log(`[mock-middleware] 初始化完成，共加载 ${routes.length} 个 Mock 路由`)
          routes.forEach(route => {
            console.log(`  - [${route.feature}] ${route.method} ${route.path}`)
          })
        }
      } catch (error) {
        console.error('[mock-middleware] 初始化失败:', error)
        if (options.onError) {
          options.onError(error as Error, null, null)
        }
      }
    })()

    return initPromise
  }

  /**
   * 中间件处理函数
   */
  return async (req, res, next) => {
    try {
      // 确保已初始化
      await initialize()

      const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
      const method = (req.method || 'GET').toUpperCase()

      // 检查是否匹配 base 路径
      if (options.base && !url.pathname.startsWith(options.base)) {
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
              if (options.log) {
                logMockRequest(method, url.pathname, route.feature)
              }
              return
            }

            // 发送响应
            const status = route.status ?? 200
            ctx.reply(status, result, route.headers)

            // 记录日志
            if (options.log) {
              logMockRequest(method, url.pathname, route.feature)
            }

            return
          } catch (error) {
            console.error(`[mock-middleware] 处理路由失败 [${route.feature}] ${method} ${url.pathname}:`, error)

            if (options.onError) {
              options.onError(error as Error, req, res)
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
      if (options.onError) {
        options.onError(error as Error, req, res)
      } else {
        next(error)
      }
    }
  }
}

/**
 * 创建 Mock 中间件的便捷函数
 * 使用默认配置
 */
export function mockMiddleware(options: MiddlewareOptions = {}): Connect.NextHandleFunction {
  return createMockMiddleware({
    base: '/api',
    log: true,
    ...options
  })
}

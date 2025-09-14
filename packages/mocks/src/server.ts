/**
 * 独立 Mock 服务器
 * 提供独立运行的 Mock API 服务，可供移动端和后端同事使用
 */
import express from 'express'
import cors from 'cors'
import { createMockMiddleware, type MiddlewareOptions } from './middleware'
import { parseEnvList } from './utils'

/**
 * Mock 服务器配置选项
 */
export interface MockServerOptions extends MiddlewareOptions {
  /** 服务器端口号 */
  port?: number
  /** 服务器主机地址 */
  host?: string
  /** 是否启用 CORS */
  cors?: boolean
  /** 自定义 CORS 配置 */
  corsOptions?: cors.CorsOptions
  /** 静态文件目录（可选） */
  staticDir?: string
  /** 服务器启动回调 */
  onStart?: (port: number, host: string) => void
}

/**
 * 创建 Mock 服务器
 *
 * @param options 服务器配置选项
 * @returns Express 应用实例
 */
export function createMockServer(options: MockServerOptions = {}): express.Application {
  const {
    port = Number(process.env.MOCK_PORT ?? 3001),
    host = process.env.MOCK_HOST ?? 'localhost',
    cors: enableCors = true,
    corsOptions = {},
    staticDir,
    onStart,
    ...middlewareOptions
  } = options

  const app = express()

  // 启用 CORS
  if (enableCors) {
    app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      ...corsOptions
    }))
  }

  // 解析 JSON 请求体
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  // 静态文件服务（可选）
  if (staticDir) {
    app.use(express.static(staticDir))
  }

  // 健康检查端点
  app.get('/health', (req: express.Request, res: express.Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    })
  })

  // Mock API 信息端点
  app.get('/mock-info', async (req: express.Request, res: express.Response) => {
    try {
      const { collectMocks } = await import('./registry')
      const mockConfigs = await collectMocks({
        ...middlewareOptions,
        include: parseEnvList(process.env.VITE_MOCK_INCLUDE) ?? middlewareOptions.include,
        exclude: parseEnvList(process.env.VITE_MOCK_EXCLUDE) ?? middlewareOptions.exclude
      })

      const info = {
        features: mockConfigs.map(config => ({
          name: config.feature,
          routes: config.routes.length
        })),
        totalRoutes: mockConfigs.reduce((sum, config) => sum + config.routes.length, 0),
        environment: {
          VITE_MOCK_INCLUDE: process.env.VITE_MOCK_INCLUDE,
          VITE_MOCK_EXCLUDE: process.env.VITE_MOCK_EXCLUDE,
          NODE_ENV: process.env.NODE_ENV
        }
      }

      res.json(info)
    } catch (error) {
      res.status(500).json({
        error: '获取 Mock 信息失败',
        message: (error as Error).message
      })
    }
  })

  // 注册 Mock 中间件
  const mockMiddleware = createMockMiddleware({
    base: '/api',
    log: true,
    verbose: true,
    ...middlewareOptions
  })

  app.use(mockMiddleware)

  // 404 处理
  app.use('*', (req: express.Request, res: express.Response) => {
    res.status(404).json({
      error: 'API 不存在',
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    })
  })

  // 错误处理中间件
  app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[mock-server] 服务器错误:', error)

    if (res.headersSent) {
      return next(error)
    }

    res.status(500).json({
      error: '服务器内部错误',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  })

  return app
}

/**
 * 启动 Mock 服务器
 *
 * @param options 服务器配置选项
 * @returns Promise<void>
 */
export async function startMockServer(options: MockServerOptions = {}): Promise<void> {
  const {
    port = Number(process.env.MOCK_PORT ?? 3001),
    host = process.env.MOCK_HOST ?? 'localhost',
    onStart
  } = options

  const app = createMockServer(options)

  return new Promise((resolve, reject) => {
    const server = app.listen(port, host, () => {
      const serverUrl = `http://${host}:${port}`

      console.log('🚀 Mock 服务器启动成功!')
      console.log(`📍 服务地址: ${serverUrl}`)
      console.log(`🔍 健康检查: ${serverUrl}/health`)
      console.log(`📊 Mock 信息: ${serverUrl}/mock-info`)
      console.log('⏹️  按 Ctrl+C 停止服务器')

      if (onStart) {
        onStart(port, host)
      }

      resolve()
    })

    server.on('error', (error) => {
      console.error('❌ Mock 服务器启动失败:', error)
      reject(error)
    })

    // 优雅关闭
    process.on('SIGINT', () => {
      console.log('\n🛑 正在关闭 Mock 服务器...')
      server.close(() => {
        console.log('✅ Mock 服务器已关闭')
        process.exit(0)
      })
    })

    process.on('SIGTERM', () => {
      console.log('\n🛑 收到终止信号，正在关闭 Mock 服务器...')
      server.close(() => {
        console.log('✅ Mock 服务器已关闭')
        process.exit(0)
      })
    })
  })
}

/**
 * CLI 启动入口
 * 当直接运行此文件时启动服务器
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  startMockServer().catch(error => {
    console.error('启动 Mock 服务器失败:', error)
    process.exit(1)
  })
}

/**
 * Vite Mock 插件
 * 为 Vite 开发服务器提供 Mock 数据支持，支持 TypeScript 文件热更新
 */
import type { Plugin, ViteDevServer } from 'vite'
import type { MockRoute } from './types'
import { collectMocksWithVite } from './registry'
import { mockMiddlewareFactory } from './runtime-middleware'

/**
 * Vite Mock 插件配置选项
 */
export interface ViteMockPluginOptions {
  /** 自定义扫描模式，默认扫描 .mock.ts 文件 */
  globs?: string[]
  /** 仅启用指定的 Feature（按 feature 名称过滤） */
  include?: string[]
  /** 排除指定的 Feature */
  exclude?: string[]
  /** 仅匹配指定前缀的路径（如 '/api'） */
  base?: string
  /** 是否启用请求日志 */
  log?: boolean
  /** 是否启用插件，默认在开发环境启用 */
  enabled?: boolean
  /** 插件名称，用于调试 */
  name?: string
}

/**
 * 创建 Vite Mock 插件
 * 在开发服务器中集成 Mock 中间件，支持 TypeScript 文件热更新
 *
 * @param options 插件配置选项
 * @returns Vite 插件对象
 */
export function createViteMockPlugin(options: ViteMockPluginOptions = {}): Plugin {
  const {
    enabled = process.env.VITE_USE_MOCK === 'true' || process.env.NODE_ENV !== 'production',
    name = 'vite-mock-plugin',
    globs = ['packages/feat-*/mocks/**/*.mock.ts', 'packages/feat-*/mocks/**/*.mock.js'],
    base = '/api',
    log = true,
    include,
    exclude
  } = options

  let routes: MockRoute[] = []
  let serverRef: ViteDevServer | null = null

  /**
   * 重新加载 Mock 路由
   */
  async function reloadRoutes(server: ViteDevServer) {
    try {
      const envInclude = parseEnvList(process.env.VITE_MOCK_INCLUDE) ?? include
      const envExclude = parseEnvList(process.env.VITE_MOCK_EXCLUDE) ?? exclude

      const collected = await collectMocksWithVite(server, {
        globs,
        include: envInclude,
        exclude: envExclude,
        verbose: true
      })

      routes = collected.flatMap(x => x.routes)
      server.config.logger.info(`[${name}] 已加载 ${routes.length} 个 Mock 路由`)
    } catch (error) {
      server.config.logger.error(`[${name}] 加载 Mock 路由失败:`, error)
    }
  }

  return {
    name,
    apply: (config, { command }) => {
      // 只在开发模式下应用
      return enabled && command === 'serve'
    },
    async configureServer(server: ViteDevServer) {
      if (!enabled) {
        console.log(`[${name}] Mock 插件已禁用`)
        return
      }

      serverRef = server
      console.log(`[${name}] 正在配置 Mock 中间件...`)

      // 初始加载 Mock 路由
      await reloadRoutes(server)

      // 创建并注册 Mock 中间件（使用闭包读取最新 routes）
      const middleware = mockMiddlewareFactory({
        base,
        log,
        getRoutes: () => routes,
        onError: (error, req, res) => {
          server.config.logger.error(`[${name}] Mock 处理失败:`, error)
        }
      })

      // 在内部中间件之前添加 Mock 中间件
      server.middlewares.use(middleware)

      // 监听 Mock 文件变更，自动重载
      const shouldReload = (file: string) => {
        const normalizedFile = file.replace(/\\/g, '/')
        return globs.some(pattern => {
          const regex = new RegExp(
            pattern
              .replace(/\*\*/g, '.*')
              .replace(/\*/g, '[^/]*')
              .replace(/\./g, '\\.')
          )
          return regex.test(normalizedFile)
        })
      }

      const handleFileChange = (file: string) => {
        if (shouldReload(file)) {
          console.log(`[${name}] 检测到 Mock 文件变更: ${file}`)
          reloadRoutes(server).catch(err =>
            server.config.logger.error(`[${name}] 重新加载失败:`, err)
          )
        }
      }

      server.watcher.on('add', handleFileChange)
      server.watcher.on('change', handleFileChange)
      server.watcher.on('unlink', handleFileChange)

      console.log(`[${name}] Mock 中间件配置完成`)
    },
    configResolved(config) {
      if (enabled) {
        console.log(`[${name}] Mock 插件已启用`)
        console.log(`[${name}] 扫描模式:`, globs)
        console.log(`[${name}] 环境变量:`)
        console.log(`  - VITE_USE_MOCK: ${process.env.VITE_USE_MOCK}`)
        console.log(`  - VITE_MOCK_INCLUDE: ${process.env.VITE_MOCK_INCLUDE || '(未设置)'}`)
        console.log(`  - VITE_MOCK_EXCLUDE: ${process.env.VITE_MOCK_EXCLUDE || '(未设置)'}`)
        console.log(`  - NODE_ENV: ${process.env.NODE_ENV}`)
      }
    }
  }
}

/**
 * 解析环境变量列表
 */
function parseEnvList(envValue?: string): string[] | undefined {
  if (!envValue) return undefined
  return envValue.split(',').map(item => item.trim()).filter(Boolean)
}

/**
 * Vite Mock 插件的便捷导出
 * 使用默认配置
 */
export function ViteMockPlugin(options: ViteMockPluginOptions = {}): Plugin {
  return createViteMockPlugin(options)
}

/**
 * 默认导出，兼容不同的导入方式
 */
export default ViteMockPlugin

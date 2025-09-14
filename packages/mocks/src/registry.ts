/**
 * Mock 汇聚与注册机制
 * 使用 Vite 的 ssrLoadModule 自动发现和加载各 Feature 的 Mock 配置
 */
import type { ViteDevServer } from 'vite'
import fg from 'fast-glob'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import type { NamespacedMocks } from './types'

/**
 * Mock 收集配置选项
 */
export interface CollectOptions {
  /** 项目根目录，默认为当前工作目录 */
  root?: string
  /** 自定义扫描模式，默认扫描 packages/feat-* 下的 .mock.ts 文件 */
  globs?: string[]
  /** 仅启用指定的 Feature（按 feature 名称过滤） */
  include?: string[]
  /** 排除指定的 Feature */
  exclude?: string[]
  /** 是否启用详细日志 */
  verbose?: boolean
}

/**
 * 使用 Vite 的 ssrLoadModule 加载 TS/ESM 源码
 * 不再使用 Node 原生 import，避免 TS 解析问题
 *
 * @param server Vite 开发服务器实例
 * @param options 收集配置选项
 * @returns 所有 Feature 的 Mock 配置数组
 */
export async function collectMocksWithVite(
  server: ViteDevServer,
  options: CollectOptions = {}
): Promise<NamespacedMocks[]> {
  const {
    globs = ['packages/feat-*/mocks/**/*.mock.ts', 'packages/feat-*/mocks/**/*.mock.js'],
    include,
    exclude,
    verbose = false,
    root: customRoot
  } = options

  // 如果指定了自定义根目录，使用它；否则尝试找到 monorepo 根目录
  let root = customRoot || server.config.root || process.cwd()

  // 如果当前目录是 apps/web，向上查找到 monorepo 根目录
  if (root.endsWith('/apps/web') || root.endsWith('\\apps\\web')) {
    root = path.resolve(root, '../..')
  }

  if (verbose) {
    console.log('[mock-registry] 开始收集 Mock 配置（Vite 模式）...')
    console.log('[mock-registry] 扫描模式:', globs)
    console.log('[mock-registry] 项目根目录:', root)
  }

  // 扫描匹配的 .mock.ts 文件
  const files = await fg(globs, {
    cwd: root,
    absolute: true,
    ignore: ['**/*.d.ts', '**/node_modules/**']
  })

  if (verbose) {
    console.log(`[mock-registry] 发现 ${files.length} 个 Mock 文件:`)
    files.forEach(file => console.log(`  - ${file}`))
  }

  const mockConfigs: NamespacedMocks[] = []

  // 逐个加载 Mock 文件
  for (const filePath of files) {
    try {
      // 只收集 .mock.ts/.mock.js 文件
      const file = filePath.replace(/\\/g, '/')
      if (!/\.mock\.(t|j)sx?$/.test(file)) {
        if (verbose) {
          console.log(`[mock-registry] 跳过非 Mock 文件: ${filePath}`)
        }
        continue
      }

      // 使用 Vite 的 ssrLoadModule 加载 TS 文件
      const module = await server.ssrLoadModule(filePath)

      // 允许 default 是单个 NamespacedMocks 或数组
      const value = module?.default
      const mockConfigArray: NamespacedMocks[] = Array.isArray(value) ? value : value ? [value] : []

      for (const mockConfig of mockConfigArray) {
        if (!mockConfig?.feature || !Array.isArray(mockConfig?.routes)) {
          if (verbose) {
            console.warn(`[mock-registry] 跳过无效的 Mock 配置: ${filePath}`)
          }
          continue
        }

        // 应用 include/exclude 过滤
        if (include?.length && !include.includes(mockConfig.feature)) {
          if (verbose) {
            console.log(`[mock-registry] 跳过未包含的 Feature: ${mockConfig.feature}`)
          }
          continue
        }

        if (exclude?.length && exclude.includes(mockConfig.feature)) {
          if (verbose) {
            console.log(`[mock-registry] 跳过被排除的 Feature: ${mockConfig.feature}`)
          }
          continue
        }

        mockConfigs.push(mockConfig)

        if (verbose) {
          console.log(`[mock-registry] 成功加载 Feature "${mockConfig.feature}" 的 ${mockConfig.routes.length} 个 Mock 路由`)
        }
      }
    } catch (error) {
      console.error(`[mock-registry] 加载 Mock 文件失败: ${filePath}`, error)
    }
  }

  if (verbose) {
    console.log(`[mock-registry] Mock 配置收集完成，共加载 ${mockConfigs.length} 个 Feature`)
  }

  return mockConfigs
}

/**
 * 收集所有 Feature 的 Mock 配置（原有的 Node.js 版本，用于独立服务器）
 * 通过文件系统扫描自动发现和加载 Mock 文件
 *
 * @param options 收集配置选项
 * @returns 所有 Feature 的 Mock 配置数组
 */
export async function collectMocks(options: CollectOptions = {}): Promise<NamespacedMocks[]> {
  const {
    root = process.cwd(),
    globs = [
      'packages/feat-*/mocks/**/*.{ts,js,mjs,cjs}',
      'packages/feat-*/src/mocks/**/*.{ts,js,mjs,cjs}'
    ],
    include,
    exclude,
    verbose = false
  } = options

  if (verbose) {
    console.log('[mock-registry] 开始收集 Mock 配置...')
    console.log('[mock-registry] 扫描模式:', globs)
    console.log('[mock-registry] 项目根目录:', root)
  }

  // 扫描匹配的文件
  const files = await fg(globs, {
    cwd: root,
    absolute: true,
    ignore: ['**/*.d.ts', '**/node_modules/**']
  })

  if (verbose) {
    console.log(`[mock-registry] 发现 ${files.length} 个 Mock 文件:`)
    files.forEach(file => console.log(`  - ${file}`))
  }

  const mockConfigs: NamespacedMocks[] = []

  // 逐个加载 Mock 文件
  for (const filePath of files) {
    try {
      const fileUrl = pathToFileURL(path.resolve(filePath)).href
      const module = await import(fileUrl)

      // 尝试从默认导出或命名导出中获取 Mock 配置
      const mockConfig: NamespacedMocks | undefined =
        module.default ?? module.mocks ?? module.mockConfig

      if (!mockConfig?.feature || !Array.isArray(mockConfig?.routes)) {
        if (verbose) {
          console.warn(`[mock-registry] 跳过无效的 Mock 文件: ${filePath}`)
        }
        continue
      }

      // 应用 include/exclude 过滤
      if (include?.length && !include.includes(mockConfig.feature)) {
        if (verbose) {
          console.log(`[mock-registry] 跳过未包含的 Feature: ${mockConfig.feature}`)
        }
        continue
      }

      if (exclude?.length && exclude.includes(mockConfig.feature)) {
        if (verbose) {
          console.log(`[mock-registry] 跳过被排除的 Feature: ${mockConfig.feature}`)
        }
        continue
      }

      mockConfigs.push(mockConfig)

      if (verbose) {
        console.log(`[mock-registry] 成功加载 Feature "${mockConfig.feature}" 的 ${mockConfig.routes.length} 个 Mock 路由`)
      }
    } catch (error) {
      console.error(`[mock-registry] 加载 Mock 文件失败: ${filePath}`, error)
    }
  }

  if (verbose) {
    console.log(`[mock-registry] Mock 配置收集完成，共加载 ${mockConfigs.length} 个 Feature`)
  }

  return mockConfigs
}

/**
 * 获取所有已注册的 Feature 列表
 *
 * @param options 收集配置选项
 * @returns Feature 名称数组
 */
export async function getRegisteredFeatures(options: CollectOptions = {}): Promise<string[]> {
  const mockConfigs = await collectMocks(options)
  return mockConfigs.map(config => config.feature)
}

/**
 * 获取指定 Feature 的 Mock 配置
 *
 * @param featureName Feature 名称
 * @param options 收集配置选项
 * @returns 指定 Feature 的 Mock 配置，如果不存在则返回 undefined
 */
export async function getFeatureMocks(
  featureName: string,
  options: CollectOptions = {}
): Promise<NamespacedMocks | undefined> {
  const mockConfigs = await collectMocks({
    ...options,
    include: [featureName]
  })

  return mockConfigs.find(config => config.feature === featureName)
}

/**
 * 验证 Mock 配置的有效性
 *
 * @param mockConfig Mock 配置对象
 * @returns 验证结果和错误信息
 */
export function validateMockConfig(mockConfig: any): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!mockConfig) {
    errors.push('Mock 配置不能为空')
    return { valid: false, errors }
  }

  if (!mockConfig.feature || typeof mockConfig.feature !== 'string') {
    errors.push('Feature 名称必须是非空字符串')
  }

  if (!Array.isArray(mockConfig.routes)) {
    errors.push('routes 必须是数组')
  } else {
    mockConfig.routes.forEach((route: any, index: number) => {
      if (!route.method || typeof route.method !== 'string') {
        errors.push(`路由 ${index}: method 必须是字符串`)
      }

      if (!route.path) {
        errors.push(`路由 ${index}: path 不能为空`)
      }

      if (!route.handler || typeof route.handler !== 'function') {
        errors.push(`路由 ${index}: handler 必须是函数`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

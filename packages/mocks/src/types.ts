/**
 * Mock 系统核心类型定义
 * 提供统一的 Mock 数据结构和类型约束
 */
import type { IncomingMessage, ServerResponse } from 'http'

/** HTTP 请求方法类型 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'

/**
 * Mock 上下文对象
 * 提供请求处理过程中的所有必要信息和工具方法
 */
export interface MockContext {
  /** 原始 HTTP 请求对象 */
  req: IncomingMessage
  /** 原始 HTTP 响应对象 */
  res: ServerResponse
  /** 解析后的 URL 对象 */
  url: URL
  /** 路径参数（当使用正则表达式路径时） */
  params?: RegExpMatchArray
  /** 查询参数对象 */
  query: Record<string, any>
  /** 请求体数据 */
  body?: any
  /** 响应工具方法 */
  reply: (status: number, payload: any, headers?: Record<string, string>) => void
}

/**
 * Mock 处理函数类型
 * 可以返回数据或 Promise，支持异步处理
 */
export type MockHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  ctx: MockContext
) => any | Promise<any>

/**
 * Mock 路由配置接口
 * 定义单个 API 路由的 Mock 行为
 */
export interface MockRoute {
  /** HTTP 方法 */
  method: HttpMethod
  /** 路径匹配规则，支持字符串或正则表达式 */
  path: string | RegExp
  /** 处理函数 */
  handler: MockHandler
  /** 模拟延迟时间（毫秒） */
  delayMs?: number
  /** 响应状态码，默认 200 */
  status?: number
  /** 自定义响应头 */
  headers?: Record<string, string>
}

/**
 * 命名空间化的 Mock 配置
 * 将 Mock 路由与特定的 Feature 关联
 */
export interface NamespacedMocks {
  /** Feature 名称，用于标识和过滤 */
  feature: string
  /** 该 Feature 的所有 Mock 路由 */
  routes: MockRoute[]
}

/**
 * 定义 Mock 配置的工具函数
 * 用于在各个 Feature 中声明 Mock 数据
 *
 * @param feature Feature 名称
 * @param routes Mock 路由配置数组
 * @returns 命名空间化的 Mock 配置
 */
export function defineMocks(feature: string, routes: MockRoute[]): NamespacedMocks {
  return { feature, routes }
}

/**
 * Mock 系统工具函数
 * 提供请求解析、响应处理等通用功能
 */
import { parse } from 'node:querystring'
import type { IncomingMessage, ServerResponse } from 'http'
import type { MockContext } from './types'

/**
 * 读取请求体数据
 * 支持 JSON 和表单数据的自动解析
 *
 * @param req HTTP 请求对象
 * @returns 解析后的请求体数据
 */
export async function readBody(req: IncomingMessage): Promise<any> {
  return await new Promise<any>((resolve) => {
    const chunks: Buffer[] = []

    req.on('data', (chunk) => {
      chunks.push(chunk)
    })

    req.on('end', () => {
      const rawBody = Buffer.concat(chunks).toString('utf8')

      if (!rawBody) {
        return resolve(undefined)
      }

      try {
        // 尝试解析为 JSON
        resolve(JSON.parse(rawBody))
      } catch {
        try {
          // 尝试解析为表单数据
          resolve(parse(rawBody))
        } catch {
          // 返回原始字符串
          resolve(rawBody)
        }
      }
    })
  })
}

/**
 * 创建 Mock 上下文对象
 * 封装请求信息和响应工具方法
 *
 * @param req HTTP 请求对象
 * @param res HTTP 响应对象
 * @param url 解析后的 URL 对象
 * @returns Mock 上下文对象
 */
export function createMockContext(
  req: IncomingMessage,
  res: ServerResponse,
  url: URL
): MockContext {
  return {
    req,
    res,
    url,
    query: Object.fromEntries(url.searchParams.entries()),
    reply: (status: number, payload: any, headers?: Record<string, string>) => {
      res.statusCode = status

      // 设置自定义响应头
      if (headers) {
        for (const [key, value] of Object.entries(headers)) {
          res.setHeader(key, value)
        }
      }

      // 设置默认响应头
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

      // 发送响应
      res.end(JSON.stringify(payload))
    }
  }
}

/**
 * 从环境变量解析列表
 * 支持逗号分隔的字符串转换为数组
 *
 * @param envValue 环境变量值
 * @returns 解析后的字符串数组，如果为空则返回 undefined
 */
export function parseEnvList(envValue?: string): string[] | undefined {
  if (!envValue) {
    return undefined
  }

  return envValue
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

/**
 * 延迟执行工具函数
 * 用于模拟网络延迟
 *
 * @param ms 延迟时间（毫秒）
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 日志输出工具函数
 * 统一 Mock 系统的日志格式
 *
 * @param method HTTP 方法
 * @param path 请求路径
 * @param feature Feature 名称（可选）
 */
export function logMockRequest(method: string, path: string, feature?: string): void {
  const timestamp = new Date().toISOString()
  const featureInfo = feature ? ` [${feature}]` : ''
  console.log(`[${timestamp}] [mock]${featureInfo} ${method} ${path}`)
}

/**
 * 路径匹配工具函数
 * 支持字符串和正则表达式的路径匹配
 *
 * @param pattern 路径模式（字符串或正则表达式）
 * @param pathname 要匹配的路径
 * @returns 匹配结果，字符串匹配返回 true/false，正则匹配返回匹配数组或 null
 */
export function matchPath(pattern: string | RegExp, pathname: string): boolean | RegExpMatchArray | null {
  if (typeof pattern === 'string') {
    return pathname === pattern
  }

  return pathname.match(pattern)
}

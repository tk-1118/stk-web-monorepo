/**
 * 应用配置模块
 * 提供全局配置参数，包括 API 基础地址等
 */
export const AppConfig = {
  /** API 基础地址，从环境变量获取，默认为 /api */
  apiBaseUrl: import.meta.env.VITE_API_BASE ?? '/api'
}

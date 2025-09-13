/**
 * HTTP 客户端配置
 * 基于 axios 封装的 HTTP 请求客户端
 */
import axios from 'axios'
import { AppConfig } from '../../config/dist/index.js'

/** HTTP 客户端实例 */
export const http = axios.create({
  baseURL: AppConfig.apiBaseUrl,
  timeout: 15000
})

// 响应拦截器：简化响应数据结构
http.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err)
)

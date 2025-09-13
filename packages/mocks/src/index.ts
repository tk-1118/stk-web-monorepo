/**
 * Mock 数据中间件
 * 为开发环境提供模拟数据服务
 */
import { users } from './routes/user'

/** Mock 中间件函数 */
export function mockMiddleware() {
  return (req: any, res: any, next: any) => {
    // 处理用户列表请求
    if (req.url?.startsWith('/api/users')) {
      const data = users()
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(data))
      return
    }
    next()
  }
}

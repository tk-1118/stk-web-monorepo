# Mock 系统

基于"分治 + 汇聚"架构的现代化 Mock 数据解决方案，支持 Vite 插件和独立服务器两种模式。

## 🎯 设计理念

- **领域内聚**: Mock 数据定义在各 Feature 内，就近维护
- **统一汇聚**: 基础能力沉到 packages/mocks，自动汇聚各 Feature 的 Mock
- **灵活控制**: 支持按环境变量选择启/停哪些 Feature 的 Mock
- **多端共用**: 支持 Vite 插件（前端）和独立服务（移动端/后端）

## 📁 目录结构

```
packages/mocks/                 # Mock 系统核心
├── src/
│   ├── types.ts               # 核心类型定义
│   ├── utils.ts               # 工具函数
│   ├── registry.ts            # Mock 汇聚机制
│   ├── middleware.ts          # Connect/Express 中间件
│   ├── plugin.vite.ts         # Vite 插件
│   ├── server.ts              # 独立服务器
│   └── index.ts               # 统一导出

packages/feat-users/            # Feature 示例
├── mocks/
│   └── index.ts               # Feature 的 Mock 定义
└── src/...
```

## 🚀 快速开始

### 1. 在 Feature 中定义 Mock

在 `packages/feat-users/mocks/index.ts` 中：

```typescript
import { defineMocks, type MockRoute } from '@hema-web-monorepo/mocks'

const routes: MockRoute[] = [
  {
    method: 'GET',
    path: '/api/users',
    handler: async (req, res, ctx) => {
      const { page = '1', size = '10' } = ctx.query
      
      return {
        data: {
          data: mockUsers.slice(0, Number(size)),
          total: mockUsers.length,
          page: Number(page),
          size: Number(size)
        },
        message: '获取用户列表成功',
        code: 200
      }
    }
  },
  {
    method: 'GET',
    path: /^\/api\/users\/(\d+)$/,
    handler: async (req, res, ctx) => {
      const id = ctx.params?.[1]
      const user = mockUsers.find(u => u.id === id)
      
      if (!user) {
        return { data: null, message: '用户不存在', code: 404 }
      }
      
      return { data: user, message: '获取用户详情成功', code: 200 }
    }
  }
]

export default defineMocks('feat-users', routes)
```

### 2. 在 Vite 中使用（推荐）

在 `apps/web/vite.config.ts` 中：

```typescript
import { ViteMockPlugin } from '@hema-web-monorepo/mocks'

export default defineConfig({
  plugins: [
    vue(),
    ViteMockPlugin({
      base: '/api',
      log: true,
      verbose: process.env.NODE_ENV === 'development'
    })
  ]
})
```

### 3. 环境变量配置

创建 `.env.development` 文件：

```bash
# 启用 Mock 服务
VITE_USE_MOCK=true

# 仅启用指定的 Feature（可选）
VITE_MOCK_INCLUDE=feat-users,feat-orders

# 排除指定的 Feature（可选）
VITE_MOCK_EXCLUDE=feat-analytics
```

### 4. 独立服务器模式

启动独立 Mock 服务器：

```bash
# 构建 Mock 包
pnpm nx run mocks:build

# 启动服务器
pnpm nx run mocks:serve

# 或者直接运行
node -e "require('./dist/packages/mocks').startMockServer()"
```

## 📖 API 文档

### MockRoute 接口

```typescript
interface MockRoute {
  method: HttpMethod                    // HTTP 方法
  path: string | RegExp                 // 路径匹配规则
  handler: MockHandler                  // 处理函数
  delayMs?: number                      // 模拟延迟（毫秒）
  status?: number                       // 响应状态码，默认 200
  headers?: Record<string, string>      // 自定义响应头
}
```

### MockContext 对象

处理函数接收的上下文对象：

```typescript
interface MockContext {
  req: IncomingMessage                  // 原始请求对象
  res: ServerResponse                   // 原始响应对象
  url: URL                              // 解析后的 URL
  params?: RegExpMatchArray             // 路径参数（正则匹配时）
  query: Record<string, any>            // 查询参数
  body?: any                            // 请求体数据
  reply: (status, payload, headers?) => void  // 响应工具方法
}
```

## 🔧 高级用法

### 路径匹配

支持字符串和正则表达式两种路径匹配方式：

```typescript
// 字符串匹配
{ path: '/api/users', ... }

// 正则表达式匹配（支持参数提取）
{ path: /^\/api\/users\/(\d+)$/, ... }

// 在处理函数中获取参数
handler: (req, res, ctx) => {
  const userId = ctx.params?.[1]  // 获取第一个捕获组
}
```

### 延迟和错误模拟

```typescript
{
  method: 'POST',
  path: '/api/users',
  delayMs: 1000,  // 模拟 1 秒延迟
  handler: (req, res, ctx) => {
    // 模拟错误
    if (Math.random() < 0.1) {
      ctx.reply(500, { error: '服务器错误' })
      return
    }
    
    return { data: newUser, code: 200 }
  }
}
```

### 条件启用 Feature

```typescript
// 仅在开发环境启用某些 Feature
ViteMockPlugin({
  include: process.env.NODE_ENV === 'development' 
    ? ['feat-users', 'feat-orders'] 
    : ['feat-users']
})
```

## 🛠️ 开发工具

### Mock 信息端点

独立服务器提供以下端点：

- `GET /health` - 健康检查
- `GET /mock-info` - Mock 配置信息

### 日志输出

启用详细日志：

```typescript
ViteMockPlugin({
  log: true,      // 启用请求日志
  verbose: true   // 启用详细日志
})
```

## 🔍 故障排除

### 常见问题

1. **Mock 不生效**
   - 检查 `VITE_USE_MOCK` 环境变量
   - 确认路径匹配规则是否正确
   - 查看控制台日志

2. **找不到 Mock 文件**
   - 确认文件路径符合扫描模式
   - 检查导出格式是否正确

3. **类型错误**
   - 确保安装了所有依赖
   - 检查 TypeScript 配置

### 调试技巧

```typescript
// 启用详细日志查看加载过程
ViteMockPlugin({
  verbose: true
})

// 在处理函数中添加调试信息
handler: (req, res, ctx) => {
  console.log('Mock 请求:', ctx.url.pathname, ctx.query)
  // ...
}
```

## 📝 最佳实践

1. **Mock 数据组织**
   - 将复杂的 Mock 数据提取到单独文件
   - 使用 TypeScript 确保类型安全
   - 保持 Mock 数据与真实 API 的一致性

2. **性能优化**
   - 避免在 Mock 处理函数中执行重计算
   - 合理使用延迟模拟网络情况
   - 大数据集使用分页

3. **团队协作**
   - 在 Feature 内维护自己的 Mock
   - 使用环境变量控制不同环境的 Mock 行为
   - 定期同步 Mock 数据与后端 API

## 🚀 部署

### 构建

```bash
pnpm nx run mocks:build
```

### 独立部署

```bash
# 启动生产服务器
NODE_ENV=production MOCK_PORT=3001 node dist/packages/mocks/server.js
```

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY dist/packages/mocks ./
EXPOSE 3001
CMD ["node", "server.js"]
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进 Mock 系统！

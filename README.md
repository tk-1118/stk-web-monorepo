# Hema Web Monorepo

基于 Nx 的现代化前端 Monorepo 项目，集成 Vue3、TypeScript、Element Plus 等技术栈。

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发环境

```bash
# 启动开发服务器
pnpm run dev
# 或者
pnpm run serve
# 或者
pnpm start
```

访问 http://localhost:4200 查看应用

### 构建项目

```bash
# 构建所有项目（包括子包和应用）
pnpm run build

# 只构建 Web 应用
pnpm run build:web

# 只构建子包（不包括应用）
pnpm run build:packages
```

## 📦 项目结构

```
hema-web-monorepo/
├── apps/
│   ├── web/                    # Vue3 主应用
│   └── web-e2e/               # E2E 测试
├── packages/
│   ├── models/                 # 数据模型
│   ├── enums/                  # 枚举定义
│   ├── constants/              # 常量定义
│   ├── config/                 # 配置管理
│   ├── api/                    # API 服务
│   ├── store/                  # Pinia 状态管理
│   ├── ui/                     # UI 组件库
│   ├── mocks/                  # Mock 数据
│   ├── utils/                  # 工具函数
│   ├── storage/                # 存储管理
│   ├── hooks/                  # Vue Composition API Hooks
│   ├── icons/                  # 图标组件
│   ├── validation/             # 数据验证
│   ├── i18n/                   # 国际化
│   └── testing/                # 测试工具
└── README.md
```

## 🛠️ 可用脚本

### 开发相关

| 命令 | 描述 |
|------|------|
| `pnpm run dev` | 启动开发服务器 |
| `pnpm run serve` | 启动开发服务器（别名） |
| `pnpm start` | 启动开发服务器（别名） |

### 构建相关

| 命令 | 描述 |
|------|------|
| `pnpm run build` | 构建所有项目 |
| `pnpm run build:web` | 只构建 Web 应用 |
| `pnpm run build:packages` | 只构建子包 |

### 测试相关

| 命令 | 描述 |
|------|------|
| `pnpm run test` | 运行所有测试 |
| `pnpm run test:web` | 运行 Web 应用测试 |
| `pnpm run e2e` | 运行 E2E 测试 |

### 代码质量

| 命令 | 描述 |
|------|------|
| `pnpm run lint` | 运行 ESLint 检查 |
| `pnpm run lint:fix` | 运行 ESLint 并自动修复 |

### Nx 相关

| 命令 | 描述 |
|------|------|
| `pnpm run graph` | 查看项目依赖图 |
| `pnpm run affected:build` | 构建受影响的项目 |
| `pnpm run affected:test` | 测试受影响的项目 |
| `pnpm run affected:lint` | 检查受影响的项目 |
| `pnpm run clean` | 清理缓存和构建产物 |

## 🎯 核心功能

### 🎨 主题系统
- 支持明暗模式切换
- CSS 变量驱动的主题系统
- Element Plus 官方暗黑主题集成

### 📡 数据管理
- Pinia 状态管理
- Axios HTTP 客户端
- MockJS 开发环境数据模拟

### 🔧 开发体验
- 路径别名 `@org/*` 统一导入
- 自动导入 Vue API 和组件
- ESLint 模块边界规则
- TypeScript 严格类型检查
- Hot Module Replacement (HMR)

### 📱 UI 组件
- Element Plus UI 组件库
- 自定义组件库 `@org/ui`
- 图标组件 `@org/icons`
- 响应式设计

## 🏗️ 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite + Nx
- **样式**: Sass + CSS Variables
- **UI 库**: Element Plus
- **状态管理**: Pinia
- **HTTP 客户端**: Axios
- **测试**: Vitest + Cypress
- **代码规范**: ESLint + Prettier
- **包管理**: pnpm

## 📖 开发指南

### 添加新的子包

```bash
# 创建新的库
pnpm nx g @nx/js:library my-new-lib --directory=packages --bundler=vite

# 创建新的 Vue 组件库
pnpm nx g @nx/vue:library my-vue-lib --directory=packages --bundler=vite --style=scss
```

### 路径别名使用

在代码中可以使用 `@org/*` 路径别名：

```typescript
// 导入模型
import type { User } from '@org/models'

// 导入 API 服务
import { UserService } from '@org/api'

// 导入 Hooks
import { useFetch, useTheme } from '@org/hooks'

// 导入 UI 组件
import { AppHeader } from '@org/ui'
```

### 添加新的依赖

```bash
# 添加到工作区根目录
pnpm add -w package-name

# 添加到特定包
pnpm add package-name --filter @hema-web-monorepo/web
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

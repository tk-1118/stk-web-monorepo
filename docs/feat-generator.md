# feat-xxx 功能模块生成器

## 概述

feat-xxx 生成器是一个专为 AI 智能体设计的自动化工具，用于快速生成标准化的功能模块。该生成器基于现有的 `feat-users` 模块结构，能够创建包含完整 CRUD 功能、状态管理、国际化和 Mock 数据的功能模块。

## 特性

- 🚀 **快速生成**: 一键生成完整的功能模块
- 📦 **标准化结构**: 基于最佳实践的模块结构
- 🎨 **现代化 UI**: 使用 Element Plus 的美观界面
- 🌐 **国际化支持**: 内置中英文语言包
- 🔄 **状态管理**: 集成 Pinia 状态管理
- 🧪 **Mock 数据**: 开发环境模拟数据
- 📱 **响应式设计**: 适配各种屏幕尺寸
- 🔧 **TypeScript**: 完整的类型定义支持

## 安装和设置

生成器已集成到项目中，无需额外安装。确保项目依赖已安装：

```bash
pnpm install
```

## 使用方法

### 基本用法

```bash
# 使用 npm script（推荐）
pnpm gen:feat <featName> [options]

# 或直接调用脚本
node scripts/generate-feat.js <featName> [options]
```

### 参数说明

#### 必需参数

- `<featName>`: 功能模块名称
  - 只能包含小写字母、数字和连字符
  - 必须以字母开头
  - 示例: `products`, `user-profiles`, `blog-posts`

#### 可选参数

- `--entity=<name>`: 实体名称（默认为 featName 的单数形式）
- `--chinese=<name>`: 中文名称（默认为 featName）
- `--with-api`: 生成 API 服务文件
- `--no-mock`: 不生成 Mock 数据文件
- `--no-i18n`: 不生成国际化文件
- `--no-store`: 不生成状态管理文件

### 使用示例

#### 示例 1: 创建产品管理模块

```bash
pnpm gen:feat products --entity=Product --chinese=产品 --with-api
```

生成的模块结构：
```
packages/feat-products/
├── src/
│   ├── api/products.service.ts      # API 服务
│   ├── components/ProductCard.vue   # 产品卡片组件
│   ├── pages/                       # 页面组件
│   │   ├── ProductLayout.vue
│   │   ├── ProductList.vue
│   │   ├── ProductDetail.vue
│   │   ├── ProductCreate.vue
│   │   └── ProductEdit.vue
│   ├── store/products.store.ts      # 状态管理
│   ├── i18n/                        # 国际化
│   │   ├── zh.ts
│   │   └── en.ts
│   ├── mocks/products.mock.ts       # Mock 数据
│   ├── routes.ts                    # 路由配置
│   └── index.ts                     # 模块入口
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.mjs
```

#### 示例 2: 创建用户档案模块

```bash
pnpm gen:feat user-profiles --entity=UserProfile --chinese=用户档案
```

#### 示例 3: 创建博客文章模块

```bash
pnpm gen:feat blog-posts --entity=BlogPost --chinese=博客文章 --with-api
```

#### 示例 4: 创建通知模块（精简版）

```bash
pnpm gen:feat notifications --chinese=通知 --no-mock --no-i18n
```

## 生成的模块结构

### 目录结构

```
packages/feat-{name}/
├── src/
│   ├── api/                    # API 服务层
│   │   └── {name}.service.ts
│   ├── components/             # 组件
│   │   └── {Entity}Card.vue
│   ├── pages/                  # 页面组件
│   │   ├── {Entity}Layout.vue  # 布局页面
│   │   ├── {Entity}List.vue    # 列表页面
│   │   ├── {Entity}Detail.vue  # 详情页面
│   │   ├── {Entity}Create.vue  # 创建页面
│   │   └── {Entity}Edit.vue    # 编辑页面
│   ├── store/                  # 状态管理
│   │   └── {name}.store.ts
│   ├── i18n/                   # 国际化
│   │   ├── zh.ts              # 中文语言包
│   │   └── en.ts              # 英文语言包
│   ├── mocks/                  # Mock 数据
│   │   └── {name}.mock.ts
│   ├── routes.ts              # 路由配置
│   ├── index.ts               # 模块入口
│   └── vue-shims.d.ts         # Vue 类型声明
├── package.json               # 包配置
├── tsconfig.json             # TypeScript 配置
├── tsconfig.lib.json         # 库构建配置
├── vite.config.ts            # Vite 配置
└── eslint.config.mjs         # ESLint 配置
```

### 核心文件说明

#### API 服务 (`api/{name}.service.ts`)

提供完整的 CRUD API 接口：

```typescript
// 自动生成的 API 服务示例
export class ProductsApiService {
  async getList(params: QueryProductsRequest): Promise<ProductsListResponse>
  async getById(id: string): Promise<Product>
  async create(data: CreateProductRequest): Promise<Product>
  async update(data: UpdateProductRequest): Promise<Product>
  async delete(id: string): Promise<void>
  async batchDelete(ids: string[]): Promise<void>
  async updateStatus(id: string, status: Product['status']): Promise<Product>
}
```

#### 状态管理 (`store/{name}.store.ts`)

使用 Pinia 的响应式状态管理：

```typescript
// 自动生成的状态管理示例
export const useProductsStore = defineStore('products', () => {
  // 状态
  const productsList = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const listLoading = ref(false)
  
  // 操作方法
  async function fetchProductsList(params?: QueryProductsRequest)
  async function fetchProductDetail(id: string)
  async function createProduct(data: CreateProductRequest)
  async function updateProduct(data: UpdateProductRequest)
  async function deleteProduct(id: string)
  
  return {
    productsList,
    currentProduct,
    listLoading,
    fetchProductsList,
    fetchProductDetail,
    createProduct,
    updateProduct,
    deleteProduct
  }
})
```

#### 路由配置 (`routes.ts`)

自动配置的路由规则：

```typescript
// 自动生成的路由配置示例
export const productsRoutes: RouteRecordRaw[] = [
  {
    path: '/products',
    name: 'ProductsLayout',
    component: () => import('./pages/ProductLayout.vue'),
    children: [
      {
        path: '/list',
        name: 'ProductList',
        component: () => import('./pages/ProductList.vue')
      },
      {
        path: ':id',
        name: 'ProductDetail',
        component: () => import('./pages/ProductDetail.vue')
      },
      {
        path: 'create',
        name: 'ProductCreate',
        component: () => import('./pages/ProductCreate.vue')
      },
      {
        path: ':id/edit',
        name: 'ProductEdit',
        component: () => import('./pages/ProductEdit.vue')
      }
    ]
  }
]
```

## 在主应用中使用生成的模块

### 1. 安装模块依赖

生成模块后，运行以下命令安装依赖：

```bash
pnpm install
```

### 2. 在主应用中导入和注册

```typescript
// 在主应用的 main.ts 或路由配置中
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import productsModule from '@hema-web-monorepo/feat-products'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes: []
})

// 安装产品模块
productsModule.install(app, router, {
  enableMock: true,        // 启用 Mock 数据
  routePrefix: '/admin',   // 路由前缀
  locale: 'zh'            // 语言设置
})

app.use(router)
app.mount('#app')
```

### 3. 使用模块组件

```vue
<template>
  <div>
    <!-- 使用生成的组件 -->
    <ProductCard
      :product="product"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ProductCard, useProductsStore } from '@hema-web-monorepo/feat-products'

const productsStore = useProductsStore()

function handleView(product) {
  // 处理查看逻辑
}

function handleEdit(product) {
  // 处理编辑逻辑
}

function handleDelete(product) {
  // 处理删除逻辑
}
</script>
```

## AI 智能体使用指南

### 推荐的生成流程

1. **分析需求**: 确定功能模块的名称、实体和业务逻辑
2. **生成模块**: 使用生成器创建基础模块
3. **自定义开发**: 根据具体需求修改生成的代码
4. **集成测试**: 在主应用中测试模块功能

### 命名规范建议

- **功能模块名**: 使用复数形式，如 `products`, `orders`, `users`
- **实体名称**: 使用单数形式，如 `Product`, `Order`, `User`
- **中文名称**: 简洁明了，如 `产品`, `订单`, `用户`

### 常用生成命令模板

```bash
# 电商相关
pnpm gen:feat products --entity=Product --chinese=产品 --with-api
pnpm gen:feat orders --entity=Order --chinese=订单 --with-api
pnpm gen:feat categories --entity=Category --chinese=分类 --with-api

# 用户管理
pnpm gen:feat user-profiles --entity=UserProfile --chinese=用户档案 --with-api
pnpm gen:feat user-roles --entity=UserRole --chinese=用户角色 --with-api

# 内容管理
pnpm gen:feat blog-posts --entity=BlogPost --chinese=博客文章 --with-api
pnpm gen:feat news-articles --entity=NewsArticle --chinese=新闻文章 --with-api

# 系统管理
pnpm gen:feat system-logs --entity=SystemLog --chinese=系统日志 --with-api
pnpm gen:feat notifications --entity=Notification --chinese=通知 --with-api
```

## 自定义和扩展

### 修改模板

模板文件位于 `scripts/templates/feat/` 目录下，可以根据项目需求进行自定义：

- 修改页面布局和样式
- 添加新的组件模板
- 调整 API 接口结构
- 自定义状态管理逻辑

### 添加新的生成选项

在 `scripts/generate-feat.js` 中可以添加新的命令行选项：

```javascript
// 添加新选项
case 'with-charts':
  options.withCharts = true
  break
```

### 扩展生成器功能

可以在生成器中添加更多功能：

- 自动生成测试文件
- 集成更多 UI 组件库
- 添加数据可视化组件
- 生成 API 文档

## 故障排除

### 常见问题

1. **模块名称冲突**
   ```
   错误: feat-products 模块已存在
   解决: 使用不同的模块名称或删除现有模块
   ```

2. **依赖安装失败**
   ```
   错误: 依赖安装失败，请手动运行 pnpm install
   解决: 手动执行 pnpm install 命令
   ```

3. **TypeScript 类型错误**
   ```
   错误: 类型定义不匹配
   解决: 检查生成的类型定义，确保与项目配置一致
   ```

### 调试技巧

1. **查看生成日志**: 生成器会输出详细的操作日志
2. **检查模板文件**: 确认模板文件是否正确
3. **验证配置**: 检查 TypeScript 和 Vite 配置是否正确

## 最佳实践

### 代码规范

1. **遵循项目约定**: 使用项目统一的代码风格
2. **添加注释**: 为关键业务逻辑添加详细注释
3. **类型安全**: 充分利用 TypeScript 的类型检查
4. **错误处理**: 添加适当的错误处理和用户提示

### 性能优化

1. **懒加载**: 使用路由懒加载减少初始包大小
2. **组件缓存**: 合理使用 Vue 的 keep-alive
3. **数据分页**: 大量数据使用分页或虚拟滚动
4. **状态管理**: 避免不必要的响应式数据

### 可维护性

1. **模块化设计**: 保持模块的独立性和可复用性
2. **文档完善**: 为复杂逻辑编写文档
3. **测试覆盖**: 编写单元测试和集成测试
4. **版本管理**: 使用语义化版本管理

## 更新和维护

### 更新生成器

当需要更新生成器时：

1. 修改模板文件
2. 更新生成器脚本
3. 测试新功能
4. 更新文档

### 迁移现有模块

如果需要将现有模块迁移到新的生成器结构：

1. 备份现有代码
2. 使用生成器创建新模块
3. 迁移业务逻辑
4. 测试功能完整性

## 贡献指南

欢迎为 feat-xxx 生成器贡献代码：

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证，详见 LICENSE 文件。

---

**注意**: 这个生成器是为 AI 智能体设计的，旨在提高开发效率和代码一致性。在使用过程中，请根据具体项目需求进行适当的自定义和调整。

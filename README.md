# 盒马Web管理系统 - 领域特性包架构

## 🏗️ 项目概述

本项目采用"应用外壳 + 领域特性包（Feature Lib）"的微前端架构设计，基于 Nx Monorepo 构建，实现了高度模块化、可扩展的企业级管理系统。

### 核心理念

- **领域驱动设计（DDD）**：按业务领域拆分功能模块
- **插件化架构**：支持功能模块的热插拔和独立部署
- **边界约束**：通过 ESLint 规则强制模块边界，防止跨领域依赖
- **共享资源**：通用组件、工具函数、类型定义统一管理

## 📁 项目结构

```
hema-web-monorepo/
├── apps/                           # 应用外壳
│   └── web/                        # 主应用
│       ├── src/
│       │   ├── pages/              # 应用级页面（登录、404等）
│       │   ├── router/             # 插件化路由配置
│       │   ├── layouts/            # 顶层布局组件
│       │   └── main.ts             # 应用入口
│       ├── package.json
│       └── vite.config.ts
├── packages/                       # 共享包和领域特性包
│   ├── feat-users/                 # 用户管理领域特性包
│   │   ├── src/
│   │   │   ├── pages/              # 用户相关页面
│   │   │   ├── components/         # 用户专用组件
│   │   │   ├── store/              # 用户状态管理
│   │   │   ├── api/                # 用户API服务
│   │   │   ├── i18n/               # 用户模块国际化
│   │   │   ├── mocks/              # 用户Mock数据
│   │   │   ├── routes.ts           # 用户路由配置
│   │   │   └── index.ts            # 统一导出
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── api/                        # 共享API工具
│   ├── ui/                         # 共享UI组件
│   ├── models/                     # 共享数据模型
│   ├── enums/                      # 共享枚举定义
│   ├── constants/                  # 共享常量
│   ├── utils/                      # 共享工具函数
│   ├── hooks/                      # 共享Vue Hooks
│   ├── store/                      # 共享状态管理
│   ├── i18n/                       # 共享国际化
│   ├── icons/                      # 共享图标
│   ├── validation/                 # 共享验证规则
│   ├── storage/                    # 共享存储工具
│   ├── config/                     # 共享配置
│   ├── mocks/                      # 共享Mock工具
│   └── testing/                    # 共享测试工具
├── nx.json                         # Nx配置和项目标签
├── eslint.config.mjs              # ESLint配置和边界约束
├── package.json                    # 根包配置
├── pnpm-workspace.yaml            # pnpm工作区配置
└── tsconfig.base.json             # TypeScript基础配置
```

## 🎯 架构原则

### 1. 应用外壳职责
- **布局管理**：顶层布局、菜单、权限守卫
- **路由框架**：插件化路由注册和管理
- **全局样式**：主题、通用样式
- **鉴权守卫**：登录验证、权限控制
- **应用级页面**：登录、404、欢迎页等

### 2. 领域特性包职责
- **自包含性**：包含该领域的完整功能
- **页面组件**：领域相关的所有页面
- **业务组件**：领域专用的组件（不放通用UI）
- **状态管理**：领域内的Pinia Store
- **API适配**：封装调用共享API
- **国际化**：领域相关的文本
- **Mock数据**：开发和测试用的模拟数据
- **路由导出**：供应用外壳注册的路由

### 3. 边界约束规则
```javascript
// ESLint配置中的依赖约束
{
  "sourceTag": "scope:feature", 
  "onlyDependOnLibsWithTags": ["scope:shared", "scope:dev"]
},
{
  "sourceTag": "feature:users", 
  "notDependOnLibsWithTags": ["feature:orders"]
}
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- pnpm >= 8
- Vue 3 + TypeScript

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
# 启动主应用
pnpm dev

# 构建所有包
pnpm build

# 构建特定包
pnpm nx build feat-users

# 运行测试
pnpm test

# 代码检查
pnpm lint
```

## 📦 创建新的领域特性包

### 1. 使用Nx生成器创建包结构
```bash
pnpm nx g @nx/vue:library feat-orders --directory=packages --bundler=vite --style=scss
```

### 2. 创建标准目录结构
```bash
mkdir -p packages/feat-orders/src/{pages,components,store,api,i18n,mocks}
```

### 3. 配置package.json
```json
{
  "name": "@hema-web-monorepo/feat-orders",
  "version": "0.0.1",
  "type": "module",
  "main": "../../dist/packages/feat-orders/index.js",
  "module": "../../dist/packages/feat-orders/index.js",
  "types": "../../dist/packages/feat-orders/index.d.ts",
  "exports": {
    ".": {
      "types": "../../dist/packages/feat-orders/index.d.ts",
      "import": "../../dist/packages/feat-orders/index.js"
    }
  },
  "files": [
    "dist"
  ],
  "dependencies": {
    "vue": "^3.5.21",
    "vue-router": "^4.5.1",
    "pinia": "^3.0.3",
    "element-plus": "^2.11.2"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.4",
    "typescript": "~5.9.2",
    "vite": "^7.1.5",
    "vue-tsc": "^2.2.8",
    "@hema-web-monorepo/api": "workspace:*",
    "@hema-web-monorepo/models": "workspace:*"
  }
}
```

### 4. 更新nx.json添加项目标签
```json
{
  "feat-orders": {
    "tags": ["type:lib", "scope:feature", "feature:orders"]
  }
}
```

### 5. 更新ESLint边界约束
```javascript
{
  "sourceTag": "feature:orders",
  "notDependOnLibsWithTags": ["feature:users"]
}
```

### 6. 创建路由配置
```typescript
// packages/feat-orders/src/routes.ts
import type { RouteRecordRaw } from 'vue-router'

export const ordersRoutes: RouteRecordRaw[] = [
  {
    path: '/orders',
    component: () => import('./pages/OrderLayout.vue'),
    children: [
      { 
        path: '', 
        name: 'OrderList', 
        component: () => import('./pages/OrderList.vue') 
      }
    ]
  }
]
```

### 7. 创建主入口文件
```typescript
// packages/feat-orders/src/index.ts
export { ordersRoutes as routes } from './routes'
export { useOrdersStore } from './store/orders.store'
// ... 其他导出
```

### 8. 配置 Vite 构建和 Element Plus 自动导入
```typescript
// packages/feat-orders/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入 Element Plus API
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: true
    }),
    // 自动导入 Element Plus 组件
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true
    }),
    // ... 其他插件
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'feat-orders',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue', 
        'vue-router', 
        'pinia', 
        'element-plus'
        // 注意：不要将 @element-plus/icons-vue 设为外部依赖
        // 共享包依赖放在 devDependencies 中，让 Vite 打包进去
      ],
    },
  },
})
```

**重要**：需要在 package.json 中添加自动导入相关依赖：
```json
{
  "devDependencies": {
    "unplugin-vue-components": "^0.27.4",
    "unplugin-auto-import": "^0.18.3"
  }
}
```

### 9. 配置主应用的 Element Plus 自动导入
同样需要在主应用中配置自动导入：
```typescript
// apps/web/vite.config.ts
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: true
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true
    }),
  ],
})
```

### 10. 更新应用外壳依赖
```json
// apps/web/package.json
{
  "dependencies": {
    "@hema-web-monorepo/feat-orders": "workspace:*"
  }
}
```

### 11. 在应用外壳中注册路由
```typescript
// apps/web/src/router/index.ts
import { routes as ordersRoutes } from '@hema-web-monorepo/feat-orders'

const featureRoutes: RouteRecordRaw[] = [
  ...usersRoutes,
  ...ordersRoutes  // 添加新的领域路由
]
```

## 🎨 页面开发规范

### 页面命名规范
- **格式**：`<Domain><Action>.vue`
- **示例**：`UserList.vue`、`OrderEdit.vue`、`ProductDetail.vue`

### 页面结构模板
```vue
<!--
  页面描述
  功能说明和业务逻辑描述
-->
<template>
  <div class="page-container">
    <!-- 页面内容 -->
  </div>
</template>

<script setup lang="ts">
/**
 * 页面组件名称
 * 详细的功能描述和使用说明
 */

// 导入依赖
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 状态定义
const loading = ref(false)

// 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 24px;
  // 页面样式
}
</style>
```

### 组件开发规范
```vue
<script setup lang="ts">
/**
 * 组件名称
 * 组件功能描述和使用场景
 */

// 组件属性接口
interface Props {
  /** 属性描述 */
  propName: string
  /** 可选属性 */
  optionalProp?: number
}

// 组件事件接口
interface Emits {
  /** 事件描述 */
  (e: 'eventName', payload: any): void
}

// 定义属性和事件
const props = withDefaults(defineProps<Props>(), {
  optionalProp: 0
})

const emit = defineEmits<Emits>()
</script>
```

## 🔧 状态管理规范

### Store结构模板
```typescript
/**
 * 领域状态管理
 * 负责该领域的数据获取、缓存和状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDomainStore = defineStore('domain', () => {
  // 状态定义
  const list = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const totalCount = computed(() => list.value.length)

  // 异步操作
  const fetchData = async () => {
    loading.value = true
    error.value = null
    
    try {
      // API调用
      const response = await api.getData()
      list.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '操作失败'
      console.error('操作失败:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    list,
    loading,
    error,
    
    // 计算属性
    totalCount,
    
    // 方法
    fetchData
  }
})
```

## 🌐 API服务规范

### API服务模板
```typescript
/**
 * 领域API服务
 * 封装该领域相关的HTTP请求
 */
import { http } from '@hema-web-monorepo/api'

interface ApiResponse<T> {
  data: T
  message: string
  code: number
}

class DomainApiService {
  private readonly baseUrl = '/api/domain'

  /**
   * 获取列表数据
   * @param params 查询参数
   */
  async getList(params?: any): Promise<ApiResponse<any[]>> {
    const response = await http.get<ApiResponse<any[]>>(this.baseUrl, { params })
    return response.data
  }

  /**
   * 创建数据
   * @param data 创建数据
   */
  async create(data: any): Promise<ApiResponse<any>> {
    const response = await http.post<ApiResponse<any>>(this.baseUrl, data)
    return response.data
  }
}

export const domainApi = new DomainApiService()
```

## 🎭 Mock数据规范

### Mock服务模板
```typescript
/**
 * 领域Mock数据
 * 提供开发和测试用的模拟数据
 */

// 模拟数据
export const mockData = [
  {
    id: '1',
    name: '示例数据',
    // ... 其他字段
  }
]

// Mock API服务
export class MockApiService {
  /**
   * 模拟网络延迟
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 模拟API响应
   */
  async getData() {
    await this.delay(300)
    return {
      data: mockData,
      message: '获取成功',
      code: 200
    }
  }
}

export const mockApi = new MockApiService()
```

## 🌍 国际化规范

### 国际化配置模板
```typescript
/**
 * 领域国际化配置
 * 定义该领域相关的多语言文本
 */

export const zhDomain = {
  // 通用文本
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存'
  },

  // 领域相关
  domain: {
    title: '领域管理',
    
    // 字段标签
    fields: {
      name: '名称',
      status: '状态'
    },

    // 操作提示
    actions: {
      createSuccess: '创建成功',
      createError: '创建失败'
    },

    // 表单验证
    validations: {
      nameRequired: '请输入名称'
    }
  }
}
```

## 🧪 测试规范

### 单元测试模板
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Component from './Component.vue'

describe('Component', () => {
  it('should render correctly', () => {
    const wrapper = mount(Component, {
      props: {
        // 测试属性
      }
    })
    
    expect(wrapper.exists()).toBe(true)
  })

  it('should emit event when clicked', async () => {
    const wrapper = mount(Component)
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

## 📋 开发检查清单

### 创建新功能时
- [ ] 确定功能属于哪个领域
- [ ] 在正确的feat-*包中创建页面/组件
- [ ] 添加适当的业务注释和文档
- [ ] 实现状态管理（如需要）
- [ ] 创建API服务（如需要）
- [ ] 添加国际化文本
- [ ] 创建Mock数据（如需要）
- [ ] 更新路由配置
- [ ] 编写单元测试
- [ ] 检查ESLint边界约束

### 代码审查时
- [ ] 检查模块边界是否正确
- [ ] 验证组件复用性
- [ ] 确认状态管理合理性
- [ ] 检查API错误处理
- [ ] 验证国际化完整性
- [ ] 确认测试覆盖率

## 🚨 常见问题与解决方案

### Q: 如何判断功能应该放在哪个包？
A: 
- 业务页面 → 对应的feat-*包
- 通用组件 → @org/ui包
- 工具函数 → @org/utils包
- 数据模型 → @org/models包

### Q: 不同领域需要共享数据怎么办？
A: 
- 上提到@org/models定义共享类型
- 通过@org/api提供共享接口
- 避免直接跨领域依赖

### Q: 如何处理跨领域的页面跳转？
A: 
- 使用vue-router的编程式导航
- 通过路由名称而非相对路径
- 在应用外壳层统一管理路由

### Q: 构建时出现"Failed to resolve entry for package"错误？
A: 检查 feat-* 包的 package.json 配置：
```json
{
  "main": "../../dist/packages/feat-xxx/index.js",
  "module": "../../dist/packages/feat-xxx/index.js",
  "types": "../../dist/packages/feat-xxx/index.d.ts",
  "exports": {
    ".": {
      "types": "../../dist/packages/feat-xxx/index.d.ts",
      "import": "../../dist/packages/feat-xxx/index.js"
    }
  }
}
```

### Q: 构建时出现"Rollup failed to resolve import"错误？
A: 检查依赖配置策略：
1. **运行时依赖**：放在 `dependencies` 中，设为 `external`
2. **构建时依赖**：放在 `devDependencies` 中，让 Vite 打包
3. **共享包依赖**：使用 `workspace:*` 协议

```json
{
  "dependencies": {
    "vue": "^3.5.21",
    "element-plus": "^2.11.2"
  },
  "devDependencies": {
    "@hema-web-monorepo/api": "workspace:*",
    "@hema-web-monorepo/models": "workspace:*"
  }
}
```

### Q: TypeScript 类型错误如何解决？
A: 
1. 确保共享包的类型定义正确
2. 添加 Vue 组件类型声明文件
3. 检查 tsconfig 引用配置

```typescript
// src/vue-shims.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

### Q: Element Plus 组件无法识别或自动导入失败？
A: 确保正确配置了自动导入插件：

1. **安装必要依赖**：
```bash
pnpm add -D unplugin-vue-components unplugin-auto-import
```

2. **配置 Vite**：
```typescript
// vite.config.ts
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: true
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true
    }),
  ],
})
```

3. **检查生成的文件**：构建后应该生成 `components.d.ts` 和 `auto-imports.d.ts`

### Q: 模板中出现解构错误 "Cannot destructure property 'row' of 'undefined'"？
A: 在 Element Plus 表格模板中使用可选链操作符：

```vue
<template>
  <!-- 错误写法 -->
  <el-table-column>
    <template #default="{ row }">
      {{ row.name }}
    </template>
  </el-table-column>

  <!-- 正确写法 -->
  <el-table-column>
    <template #default="{ row }">
      {{ row?.name || '-' }}
    </template>
  </el-table-column>
</template>
```

### Q: 开发服务器启动后 Element Plus 样式不生效？
A: 检查以下几点：

1. **清除缓存**：删除 `node_modules/.vite` 和自动导入文件
2. **重新安装依赖**：`pnpm install`
3. **重新构建包**：`pnpm nx build feat-<domain>`
4. **检查配置**：确保主应用和 feat-* 包都配置了自动导入

## 🔧 故障排除指南

### Element Plus 相关问题

#### 问题：组件无法识别
**症状**：`<el-button>` 等组件显示为未知元素
**解决步骤**：
1. 检查是否安装了自动导入插件
2. 验证 `vite.config.ts` 配置
3. 删除缓存重新构建
4. 检查生成的 `components.d.ts` 文件

#### 问题：样式不生效
**症状**：组件功能正常但样式缺失
**解决步骤**：
1. 确保 Element Plus 在 `dependencies` 中
2. 检查主应用是否正确配置了自动导入
3. 清除 Vite 缓存：`rm -rf node_modules/.vite`

#### 问题：构建时类型错误
**症状**：`Property 'ElMessage' does not exist`
**解决步骤**：
1. 确保 `auto-imports.d.ts` 文件存在
2. 在 `tsconfig.json` 中包含自动导入文件
3. 重新构建包

### 包构建相关问题

#### 问题：入口点解析失败
**症状**：`Failed to resolve entry for package`
**解决步骤**：
1. 检查 `package.json` 的 `main`、`module`、`types` 字段
2. 确保构建输出路径正确
3. 验证 `exports` 字段配置

#### 问题：依赖解析失败
**症状**：`Rollup failed to resolve import`
**解决步骤**：
1. 检查依赖是否在正确的 `dependencies` 或 `devDependencies` 中
2. 验证 `external` 配置
3. 使用 `workspace:*` 协议引用内部包

### 开发环境问题

#### 问题：热重载不工作
**症状**：修改代码后页面不更新
**解决步骤**：
1. 重启开发服务器
2. 检查文件监听配置
3. 清除浏览器缓存

#### 问题：路由无法访问
**症状**：404 错误或路由不匹配
**解决步骤**：
1. 检查路由配置是否正确导出
2. 验证主应用是否正确导入路由
3. 检查路由路径是否冲突

### 性能优化建议

#### 构建优化
- 使用 `pnpm nx build --parallel` 并行构建
- 配置合适的 `external` 依赖
- 启用代码分割和懒加载

#### 开发体验优化
- 配置 IDE 的 TypeScript 支持
- 使用 ESLint 和 Prettier 保持代码一致性
- 配置 Git hooks 进行代码检查

## 📚 相关资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Element Plus 组件库](https://element-plus.org/)
- [Pinia 状态管理](https://pinia.vuejs.org/)
- [Nx Monorepo 工具](https://nx.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)
- [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)

---

## 🤖 AI开发助手使用指南

本项目专门为AI智能体开发进行了优化，AI可以通过以下方式快速理解和开发项目：

1. **阅读本README**：了解整体架构和开发规范
2. **查看示例代码**：参考feat-users包的完整实现
3. **遵循命名规范**：使用标准的文件和组件命名
4. **使用模板代码**：复制粘贴上述模板进行快速开发
5. **检查边界约束**：确保不违反ESLint规则

AI在开发时应该：
- 优先查看现有的feat-users实现作为参考
- 严格遵循目录结构和命名规范
- 为每个文件添加详细的业务注释
- 确保新功能放在正确的包中
- 测试功能完整性和边界约束

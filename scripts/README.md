# feat-xxx 功能模块生成器

## 快速开始

```bash
# 创建产品管理模块
pnpm gen:feat products --entity=Product --chinese=产品 --with-api

# 创建用户档案模块
pnpm gen:feat user-profiles --entity=UserProfile --chinese=用户档案

# 查看帮助信息
pnpm gen:feat --help
```

## 参数说明

- `<featName>`: 功能模块名称（必需）
- `--entity=<name>`: 实体名称
- `--chinese=<name>`: 中文名称
- `--with-api`: 生成 API 服务文件
- `--no-mock`: 不生成 Mock 数据
- `--no-i18n`: 不生成国际化文件
- `--no-store`: 不生成状态管理文件

## 生成内容

- ✅ 完整的 CRUD 页面组件
- ✅ Pinia 状态管理
- ✅ API 服务接口
- ✅ 路由配置
- ✅ 国际化文本
- ✅ Mock 数据
- ✅ TypeScript 类型定义
- ✅ Element Plus 自动导入配置

详细文档请参考：[../docs/feat-generator.md](../docs/feat-generator.md)

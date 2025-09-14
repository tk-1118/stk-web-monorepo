#!/usr/bin/env node

/**
 * feat-xxx 功能模块生成器
 * 用于动态生成新的功能模块，支持 AI 智能体自动化创建
 *
 * 使用方法:
 * node scripts/generate-feat.js <featName> [options]
 *
 * 示例:
 * node scripts/generate-feat.js products --entity=Product --chinese=产品
 * node scripts/generate-feat.js orders --entity=Order --chinese=订单 --with-api
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

/**
 * 生成器配置类
 * 管理所有生成相关的配置和选项
 */
class FeatGeneratorConfig {
  constructor(featName, options = {}) {
    this.featName = featName
    this.entityName = options.entity || this.capitalize(featName.replace(/s$/, ''))
    this.chineseName = options.chinese || featName
    this.withApi = options.withApi || false
    this.withMock = options.withMock !== false // 默认生成 mock
    this.withI18n = options.withI18n !== false // 默认生成国际化
    this.withStore = options.withStore !== false // 默认生成状态管理
    this.autoIntegrate = options.autoIntegrate !== false // 默认自动集成到 apps/web

    // 路径配置
    this.rootDir = process.cwd()
    this.packagesDir = path.join(this.rootDir, 'packages')
    this.featDir = path.join(this.packagesDir, `feat-${featName}`)
    this.srcDir = path.join(this.featDir, 'src')
    this.templatesDir = path.join(this.rootDir, 'scripts', 'templates', 'feat')
  }

  /**
   * 首字母大写
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  /**
   * 驼峰命名转换
   */
  toCamelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  }

  /**
   * 帕斯卡命名转换
   */
  toPascalCase(str) {
    return this.capitalize(this.toCamelCase(str))
  }
}

/**
 * 文件模板生成器
 * 负责根据模板生成具体的文件内容
 */
class TemplateGenerator {
  constructor(config) {
    this.config = config
  }

  /**
   * 替换模板变量
   */
  replaceTemplateVars(content) {
    const vars = {
      '{{FEAT_NAME}}': this.config.featName,
      '{{FEAT_NAME_PASCAL}}': this.config.toPascalCase(this.config.featName),
      '{{FEAT_NAME_CAMEL}}': this.config.toCamelCase(this.config.featName),
      '{{ENTITY_NAME}}': this.config.entityName,
      '{{ENTITY_NAME_LOWER}}': this.config.entityName.toLowerCase(),
      '{{CHINESE_NAME}}': this.config.chineseName,
      '{{CURRENT_YEAR}}': new Date().getFullYear().toString(),
      '{{CURRENT_DATE}}': new Date().toISOString().split('T')[0]
    }

    let result = content
    Object.entries(vars).forEach(([key, value]) => {
      result = result.replace(new RegExp(key, 'g'), value)
    })

    // 处理条件性导出和导入
    if (this.config.withApi) {
      // 启用 API 导出
      result = result.replace(
        '// export { {{FEAT_NAME_CAMEL}}Api } from \'./api/{{FEAT_NAME}}.service\'',
        `export { ${this.config.toCamelCase(this.config.featName)}Api } from './api/${this.config.featName}.service'`
      )

      // 启用 API 导入 - 只导入 API，不导入实体类型（避免与本地定义冲突）
      const apiImportPattern = `// import { ${this.config.toCamelCase(this.config.featName)}Api, type ${this.config.entityName}, type Query${this.config.toPascalCase(this.config.featName)}Request } from '../api/${this.config.featName}.service'`
      const apiImportReplacement = `import { ${this.config.toCamelCase(this.config.featName)}Api } from '../api/${this.config.featName}.service'`
      result = result.replace(apiImportPattern, apiImportReplacement)

      // 启用真实 API 调用
      const apiCallPattern = `// const response = await ${this.config.toCamelCase(this.config.featName)}Api.getList(queryParams)`
      const apiCallReplacement = `const response = await ${this.config.toCamelCase(this.config.featName)}Api.getList(params)`
      result = result.replace(apiCallPattern, apiCallReplacement)

      // 替换模拟数据相关的引用
      result = result.replace(/mockResponse/g, 'response')

      // 替换所有对 API 的引用
      result = result.replace(/Parameters<typeof userProfilesApi/g, `Parameters<typeof ${this.config.toCamelCase(this.config.featName)}Api`)
      result = result.replace(/await userProfilesApi/g, `await ${this.config.toCamelCase(this.config.featName)}Api`)
    }

    return result
  }

  /**
   * 从模板生成文件
   */
  generateFromTemplate(templatePath, outputPath) {
    if (!fs.existsSync(templatePath)) {
      console.warn(`⚠️  模板文件不存在: ${templatePath}`)
      return false
    }

    const templateContent = fs.readFileSync(templatePath, 'utf-8')
    const generatedContent = this.replaceTemplateVars(templateContent)

    // 确保输出目录存在
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(outputPath, generatedContent, 'utf-8')
    console.log(`✅ 生成文件: ${path.relative(this.config.rootDir, outputPath)}`)
    return true
  }
}

/**
 * Web 应用集成器
 * 负责将生成的 feat 模块自动集成到 apps/web 中
 */
class WebAppIntegrator {
  constructor(config) {
    this.config = config
    this.webAppDir = path.join(this.config.rootDir, 'apps', 'web')
    this.webPackageJsonPath = path.join(this.webAppDir, 'package.json')
    this.webRouterPath = path.join(this.webAppDir, 'src', 'router', 'index.ts')
    this.webViteConfigPath = path.join(this.webAppDir, 'vite.config.ts')
  }

  /**
   * 更新 web 应用的 package.json，添加新的 feat 依赖
   */
  updateWebPackageJson() {
    if (!fs.existsSync(this.webPackageJsonPath)) {
      console.warn('⚠️  未找到 apps/web/package.json，跳过依赖更新')
      return false
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(this.webPackageJsonPath, 'utf-8'))
      const featPackageName = `@hema-web-monorepo/feat-${this.config.featName}`

      // 检查依赖是否已存在
      if (packageJson.dependencies && packageJson.dependencies[featPackageName]) {
        console.log(`ℹ️  依赖 ${featPackageName} 已存在，跳过添加`)
        return true
      }

      // 添加新的依赖
      if (!packageJson.dependencies) {
        packageJson.dependencies = {}
      }

      packageJson.dependencies[featPackageName] = 'workspace:*'

      // 按字母顺序排序依赖
      const sortedDependencies = {}
      Object.keys(packageJson.dependencies)
        .sort()
        .forEach(key => {
          sortedDependencies[key] = packageJson.dependencies[key]
        })
      packageJson.dependencies = sortedDependencies

      // 写回文件
      fs.writeFileSync(this.webPackageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8')
      console.log(`✅ 已更新 apps/web/package.json，添加依赖: ${featPackageName}`)
      return true
    } catch (error) {
      console.warn(`⚠️  更新 apps/web/package.json 失败: ${error.message}`)
      return false
    }
  }

  /**
   * 更新 web 应用的路由配置，添加新的 feat 路由
   */
  updateWebRouter() {
    if (!fs.existsSync(this.webRouterPath)) {
      console.warn('⚠️  未找到 apps/web/src/router/index.ts，跳过路由更新')
      return false
    }

    try {
      let routerContent = fs.readFileSync(this.webRouterPath, 'utf-8')
      const featPackageName = `@hema-web-monorepo/feat-${this.config.featName}`
      const routesVariableName = `${this.config.toCamelCase(this.config.featName)}Routes`

      // 检查导入是否已存在
      const importStatement = `import { routes as ${routesVariableName} } from '${featPackageName}'`
      if (routerContent.includes(importStatement)) {
        console.log(`ℹ️  路由导入 ${routesVariableName} 已存在，跳过添加`)
        return true
      }

      // 1. 添加导入语句
      const existingImportMatch = routerContent.match(/import { routes as \w+Routes } from '@hema-web-monorepo\/feat-\w+'/)

      if (existingImportMatch) {
        // 在最后一个 feat 导入语句后添加新的导入
        const lastImportIndex = routerContent.lastIndexOf('import { routes as')
        const lineEnd = routerContent.indexOf('\n', lastImportIndex)
        routerContent = routerContent.slice(0, lineEnd + 1) + importStatement + '\n' + routerContent.slice(lineEnd + 1)
      } else {
        // 在用户路由导入后添加
        const usersImportIndex = routerContent.indexOf("import { routes as usersRoutes } from '@hema-web-monorepo/feat-users'")
        if (usersImportIndex !== -1) {
          const lineEnd = routerContent.indexOf('\n', usersImportIndex)
          routerContent = routerContent.slice(0, lineEnd + 1) + importStatement + '\n' + routerContent.slice(lineEnd + 1)
        }
      }

      // 2. 在 featureRoutes 数组中添加新路由 - 改进的逻辑
      // 检查路由是否已存在
      if (routerContent.includes(`...${routesVariableName}`)) {
        console.log(`ℹ️  路由 ${routesVariableName} 已存在于 featureRoutes 中，跳过添加`)
        return true
      }

      // 查找 featureRoutes 数组的定义
      const featureRoutesPattern = /const featureRoutes: RouteRecordRaw\[\] = \[([\s\S]*?)\]/
      const featureRoutesMatch = routerContent.match(featureRoutesPattern)

      if (featureRoutesMatch) {
        const arrayContent = featureRoutesMatch[1]

        // 查找注释行的位置，在注释前插入新路由
        const commentPattern = /(\s*)(\/\/ 未来可以添加更多领域特性包的路由)/
        const commentMatch = arrayContent.match(commentPattern)

        let newArrayContent
        if (commentMatch) {
          // 在注释前添加新路由
          const beforeComment = arrayContent.substring(0, arrayContent.indexOf(commentMatch[0]))
          const afterComment = arrayContent.substring(arrayContent.indexOf(commentMatch[0]))

          // 确保在最后一个路由后添加逗号和新路由
          const trimmedBefore = beforeComment.trim()
          const needsComma = trimmedBefore && !trimmedBefore.endsWith(',')
          const comma = needsComma ? ',' : ''

          newArrayContent = `${beforeComment}${comma}\n  ...${routesVariableName}\n  ${afterComment}`
        } else {
          // 如果没有注释，直接在数组末尾添加
          const trimmedContent = arrayContent.trim()
          const needsComma = trimmedContent && !trimmedContent.endsWith(',')
          const comma = needsComma ? ',' : ''

          newArrayContent = `${arrayContent}${comma}\n  ...${routesVariableName}\n  // 未来可以添加更多领域特性包的路由\n`
        }

        // 替换整个数组定义
        const newArrayDefinition = `const featureRoutes: RouteRecordRaw[] = [${newArrayContent}]`
        routerContent = routerContent.replace(featureRoutesPattern, newArrayDefinition)
      }

      // 写回文件
      fs.writeFileSync(this.webRouterPath, routerContent, 'utf-8')
      console.log(`✅ 已更新 apps/web/src/router/index.ts，添加路由: ${routesVariableName}`)
      return true
    } catch (error) {
      console.warn(`⚠️  更新路由配置失败: ${error.message}`)
      return false
    }
  }

  /**
   * 更新 web 应用的 vite.config.ts，添加新的 feat 模块别名
   */
  updateWebViteConfig() {
    if (!fs.existsSync(this.webViteConfigPath)) {
      console.warn('⚠️  未找到 apps/web/vite.config.ts，跳过 Vite 配置更新')
      return false
    }

    try {
      let viteConfigContent = fs.readFileSync(this.webViteConfigPath, 'utf-8')
      const featPackageName = `@hema-web-monorepo/feat-${this.config.featName}`
      const aliasKey = featPackageName
      const aliasValue = `path.resolve(__dirname, '../../dist/packages/feat-${this.config.featName}/index.js')`

      // 检查别名是否已存在
      const aliasPattern = new RegExp(`'${featPackageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*path\\.resolve`)
      if (aliasPattern.test(viteConfigContent)) {
        console.log(`ℹ️  Vite 别名 ${aliasKey} 已存在，跳过添加`)
        return true
      }

      // 构建新的别名行
      const newAliasLine = `      '${aliasKey}': ${aliasValue},`

      // 查找现有的 feat 别名位置
      const existingFeatAliasPattern = /'@hema-web-monorepo\/feat-[\w-]+': path\.resolve\(__dirname, '\.\.\/\.\.\/dist\/packages\/feat-[\w-]+\/index\.js'\),/g
      const existingFeatAliases = [...viteConfigContent.matchAll(existingFeatAliasPattern)]

      if (existingFeatAliases.length > 0) {
        // 在最后一个 feat 别名后添加新别名
        const lastMatch = existingFeatAliases[existingFeatAliases.length - 1]
        const lastMatchEnd = lastMatch.index + lastMatch[0].length
        const lineEnd = viteConfigContent.indexOf('\n', lastMatchEnd)
        viteConfigContent = viteConfigContent.slice(0, lineEnd + 1) + newAliasLine + '\n' + viteConfigContent.slice(lineEnd + 1)
      } else {
        // 在 alias 对象的结束括号前添加
        const aliasEndPattern = /(\s+)}\s*\n\s*}/
        const aliasEndMatch = viteConfigContent.match(aliasEndPattern)
        if (aliasEndMatch) {
          const insertPosition = aliasEndMatch.index
          viteConfigContent = viteConfigContent.slice(0, insertPosition) +
            `${aliasEndMatch[1]}${newAliasLine}\n${aliasEndMatch[1]}` +
            viteConfigContent.slice(insertPosition)
        }
      }

      // 写回文件
      fs.writeFileSync(this.webViteConfigPath, viteConfigContent, 'utf-8')
      console.log(`✅ 已更新 apps/web/vite.config.ts，添加别名: ${aliasKey}`)
      return true
    } catch (error) {
      console.warn(`⚠️  更新 Vite 配置失败: ${error.message}`)
      return false
    }
  }

  /**
   * 执行完整的 web 应用集成
   */
  integrate() {
    console.log('🔗 开始集成到 apps/web...')

    const packageJsonUpdated = this.updateWebPackageJson()
    const routerUpdated = this.updateWebRouter()
    const viteConfigUpdated = this.updateWebViteConfig()

    if (packageJsonUpdated && routerUpdated && viteConfigUpdated) {
      console.log('✅ 成功集成到 apps/web')
      return true
    } else {
      console.log('⚠️  部分集成失败，请手动检查和修复')
      return false
    }
  }
}

/**
 * feat 模块生成器主类
 * 协调整个生成过程
 */
class FeatGenerator {
  constructor(config) {
    this.config = config
    this.templateGenerator = new TemplateGenerator(config)
    this.webAppIntegrator = new WebAppIntegrator(config)
  }

  /**
   * 检查是否已存在同名模块
   */
  checkExistence() {
    if (fs.existsSync(this.config.featDir)) {
      throw new Error(`❌ feat-${this.config.featName} 模块已存在`)
    }
  }

  /**
   * 创建目录结构
   */
  createDirectoryStructure() {
    const dirs = [
      this.config.featDir,
      this.config.srcDir,
      path.join(this.config.srcDir, 'api'),
      path.join(this.config.srcDir, 'components'),
      path.join(this.config.srcDir, 'pages'),
      path.join(this.config.srcDir, 'store'),
      path.join(this.config.srcDir, 'i18n'),
      path.join(this.config.srcDir, 'mocks')
    ]

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        console.log(`📁 创建目录: ${path.relative(this.config.rootDir, dir)}`)
      }
    })
  }

  /**
   * 生成配置文件
   */
  generateConfigFiles() {
    const configFiles = [
      { template: 'package.json.template', output: 'package.json' },
      { template: 'tsconfig.json.template', output: 'tsconfig.json' },
      { template: 'tsconfig.lib.json.template', output: 'tsconfig.lib.json' },
      { template: 'vite.config.ts.template', output: 'vite.config.ts' },
      { template: 'eslint.config.mjs.template', output: 'eslint.config.mjs' }
    ]

    configFiles.forEach(({ template, output }) => {
      const templatePath = path.join(this.config.templatesDir, template)
      const outputPath = path.join(this.config.featDir, output)
      this.templateGenerator.generateFromTemplate(templatePath, outputPath)
    })
  }

  /**
   * 生成源代码文件
   */
  generateSourceFiles() {
    const sourceFiles = [
      { template: 'src/index.ts.template', output: 'src/index.ts' },
      { template: 'src/routes.ts.template', output: 'src/routes.ts' },
      { template: 'src/vue-shims.d.ts.template', output: 'src/vue-shims.d.ts' }
    ]

    // API 服务文件
    if (this.config.withApi) {
      sourceFiles.push({
        template: 'src/api/service.ts.template',
        output: `src/api/${this.config.featName}.service.ts`
      })
    }

    // 状态管理文件
    if (this.config.withStore) {
      sourceFiles.push({
        template: 'src/store/store.ts.template',
        output: `src/store/${this.config.featName}.store.ts`
      })
    }

    // 国际化文件
    if (this.config.withI18n) {
      sourceFiles.push(
        { template: 'src/i18n/zh.ts.template', output: 'src/i18n/zh.ts' },
        { template: 'src/i18n/en.ts.template', output: 'src/i18n/en.ts' }
      )
    }

    // Mock 数据文件
    if (this.config.withMock) {
      sourceFiles.push({
        template: 'src/mocks/mock.ts.template',
        output: `src/mocks/${this.config.featName}.mock.ts`
      })
    }

    sourceFiles.forEach(({ template, output }) => {
      const templatePath = path.join(this.config.templatesDir, template)
      const outputPath = path.join(this.config.featDir, output)
      this.templateGenerator.generateFromTemplate(templatePath, outputPath)
    })
  }

  /**
   * 生成页面组件
   */
  generatePageComponents() {
    const pages = [
      { name: 'Layout', chinese: '布局' },
      { name: 'List', chinese: '列表' },
      { name: 'Detail', chinese: '详情' },
      { name: 'Create', chinese: '创建' },
      { name: 'Edit', chinese: '编辑' }
    ]

    pages.forEach(({ name, chinese }) => {
      const templatePath = path.join(this.config.templatesDir, `src/pages/Page${name}.vue.template`)
      const outputPath = path.join(this.config.srcDir, 'pages', `${this.config.toPascalCase(this.config.featName)}${name}.vue`)

      // 临时设置页面特定变量
      const originalChineseName = this.config.chineseName
      this.config.chineseName = `${this.config.chineseName}${chinese}`

      this.templateGenerator.generateFromTemplate(templatePath, outputPath)

      // 恢复原始中文名称
      this.config.chineseName = originalChineseName
    })
  }

  /**
   * 生成基础组件
   */
  generateComponents() {
    const componentTemplate = path.join(this.config.templatesDir, 'src/components/Component.vue.template')
    const componentOutput = path.join(this.config.srcDir, 'components', `${this.config.toPascalCase(this.config.featName)}Card.vue`)

    this.templateGenerator.generateFromTemplate(componentTemplate, componentOutput)
  }

  /**
   * 安装依赖
   */
  installDependencies() {
    console.log('📦 安装依赖...')
    try {
      execSync('pnpm install', {
        cwd: this.config.rootDir,
        stdio: 'inherit'
      })
      console.log('✅ 依赖安装完成')
    } catch (error) {
      console.warn('⚠️  依赖安装失败，请手动运行 pnpm install:', error.message)
    }
  }

  /**
   * 执行完整的生成流程
   */
  async generate() {
    console.log(`🚀 开始生成 feat-${this.config.featName} 模块...`)
    console.log(`📋 配置信息:`)
    console.log(`   - 功能名称: ${this.config.featName}`)
    console.log(`   - 实体名称: ${this.config.entityName}`)
    console.log(`   - 中文名称: ${this.config.chineseName}`)
    console.log(`   - 包含 API: ${this.config.withApi ? '是' : '否'}`)
    console.log(`   - 包含 Mock: ${this.config.withMock ? '是' : '否'}`)
    console.log(`   - 包含国际化: ${this.config.withI18n ? '是' : '否'}`)
    console.log(`   - 包含状态管理: ${this.config.withStore ? '是' : '否'}`)
    console.log(`   - 自动集成到 Web: ${this.config.autoIntegrate ? '是' : '否'}`)
    console.log('')

    try {
      // 1. 检查是否已存在
      this.checkExistence()

      // 2. 创建目录结构
      this.createDirectoryStructure()

      // 3. 生成配置文件
      this.generateConfigFiles()

      // 4. 生成源代码文件
      this.generateSourceFiles()

      // 5. 生成页面组件
      this.generatePageComponents()

      // 6. 生成基础组件
      this.generateComponents()

      // 7. 安装依赖
      this.installDependencies()

      // 8. 自动集成到 apps/web（如果启用）
      if (this.config.autoIntegrate) {
        const integrationSuccess = this.webAppIntegrator.integrate()
        if (integrationSuccess) {
          console.log('')
          console.log('🔄 重新安装依赖以应用集成更改...')
          this.installDependencies()
        }
      }

      console.log('')
      console.log(`🎉 feat-${this.config.featName} 模块生成完成！`)
      console.log(`📁 模块路径: ${path.relative(this.config.rootDir, this.config.featDir)}`)

      if (this.config.autoIntegrate) {
        console.log('✅ 已自动集成到 apps/web')
        console.log('')
        console.log('📝 后续步骤:')
        console.log('   1. pnpm dev  # 启动开发服务器')
        console.log(`   2. 访问 /${this.config.featName} 路径测试功能`)
        console.log('   3. 根据需要自定义业务逻辑')
      } else {
        console.log('')
        console.log('📝 后续步骤:')
        console.log(`   1. cd ${path.relative(this.config.rootDir, this.config.featDir)}`)
        console.log('   2. pnpm build  # 构建模块')
        console.log('   3. 在主应用中导入和使用该模块')
      }

    } catch (error) {
      console.error('❌ 生成失败:', error.message)
      process.exit(1)
    }
  }
}

/**
 * 命令行参数解析器
 */
class CommandLineParser {
  static parse(args) {
    const featName = args[2]
    if (!featName) {
      throw new Error('请提供功能模块名称')
    }

    // 验证命名规范
    if (!/^[a-z][a-z0-9-]*$/.test(featName)) {
      throw new Error('功能模块名称只能包含小写字母、数字和连字符，且必须以字母开头')
    }

    const options = {}

    // 解析选项参数
    for (let i = 3; i < args.length; i++) {
      const arg = args[i]
      if (arg.startsWith('--')) {
        const [key, value] = arg.substring(2).split('=')
        switch (key) {
          case 'entity':
            options.entity = value
            break
          case 'chinese':
            options.chinese = value
            break
          case 'with-api':
            options.withApi = true
            break
          case 'no-mock':
            options.withMock = false
            break
          case 'no-i18n':
            options.withI18n = false
            break
          case 'no-store':
            options.withStore = false
            break
          case 'no-auto-integrate':
            options.autoIntegrate = false
            break
          default:
            console.warn(`⚠️  未知选项: --${key}`)
        }
      }
    }

    return { featName, options }
  }

  static showHelp() {
    console.log(`
feat-xxx 功能模块生成器

使用方法:
  node scripts/generate-feat.js <featName> [options]

参数:
  featName              功能模块名称 (必需，只能包含小写字母、数字和连字符)

选项:
  --entity=<name>       实体名称 (默认为 featName 的单数形式)
  --chinese=<name>      中文名称 (默认为 featName)
  --with-api           生成 API 服务文件
  --no-mock            不生成 Mock 数据文件
  --no-i18n            不生成国际化文件
  --no-store           不生成状态管理文件
  --no-auto-integrate  不自动集成到 apps/web (默认会自动集成)

示例:
  node scripts/generate-feat.js products --entity=Product --chinese=产品
  node scripts/generate-feat.js orders --entity=Order --chinese=订单 --with-api
  node scripts/generate-feat.js notifications --chinese=通知 --no-mock --no-i18n
  node scripts/generate-feat.js analytics --chinese=数据分析 --no-auto-integrate

AI 智能体使用示例:
  node scripts/generate-feat.js blog-posts --entity=BlogPost --chinese=博客文章 --with-api
  node scripts/generate-feat.js user-profiles --entity=UserProfile --chinese=用户档案
  node scripts/generate-feat.js dashboard --chinese=仪表盘 --with-api --no-auto-integrate
`)
  }
}

// 主程序入口
async function main() {
  try {
    // 显示帮助信息
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
      CommandLineParser.showHelp()
      return
    }

    // 解析命令行参数
    const { featName, options } = CommandLineParser.parse(process.argv)

    // 创建配置和生成器
    const config = new FeatGeneratorConfig(featName, options)
    const generator = new FeatGenerator(config)

    // 执行生成
    await generator.generate()

  } catch (error) {
    console.error('❌ 错误:', error.message)
    console.log('')
    CommandLineParser.showHelp()
    process.exit(1)
  }
}

// 运行主程序
if (require.main === module) {
  main()
}

module.exports = {
  FeatGeneratorConfig,
  TemplateGenerator,
  WebAppIntegrator,
  FeatGenerator,
  CommandLineParser
}

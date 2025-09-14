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

      // 启用 API 导入 - 需要在变量替换后进行
      const apiImportPattern = `// import { ${this.config.toCamelCase(this.config.featName)}Api, type ${this.config.entityName}, type Query${this.config.toPascalCase(this.config.featName)}Request } from '../api/${this.config.featName}.service'`
      const apiImportReplacement = `import { ${this.config.toCamelCase(this.config.featName)}Api, type ${this.config.entityName}, type Query${this.config.toPascalCase(this.config.featName)}Request } from '../api/${this.config.featName}.service'`
      result = result.replace(apiImportPattern, apiImportReplacement)

      // 启用真实 API 调用
      const apiCallPattern = `// const response = await ${this.config.toCamelCase(this.config.featName)}Api.getList(queryParams)`
      const apiCallReplacement = `const response = await ${this.config.toCamelCase(this.config.featName)}Api.getList(queryParams)`
      result = result.replace(apiCallPattern, apiCallReplacement)

      // 替换其他 API 调用
      result = result.replace(/\/\/ TODO: 实现 API 调用[\s\S]*?\/\/ 模拟数据[\s\S]*?mockResponse = \{[\s\S]*?\}/g,
        `const response = await ${this.config.toCamelCase(this.config.featName)}Api.getList(queryParams)`)

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
 * feat 模块生成器主类
 * 协调整个生成过程
 */
class FeatGenerator {
  constructor(config) {
    this.config = config
    this.templateGenerator = new TemplateGenerator(config)
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
      console.warn('⚠️  依赖安装失败，请手动运行 pnpm install')
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

      console.log('')
      console.log(`🎉 feat-${this.config.featName} 模块生成完成！`)
      console.log(`📁 模块路径: ${path.relative(this.config.rootDir, this.config.featDir)}`)
      console.log('')
      console.log('📝 后续步骤:')
      console.log(`   1. cd ${path.relative(this.config.rootDir, this.config.featDir)}`)
      console.log('   2. pnpm build  # 构建模块')
      console.log('   3. 在主应用中导入和使用该模块')

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

示例:
  node scripts/generate-feat.js products --entity=Product --chinese=产品
  node scripts/generate-feat.js orders --entity=Order --chinese=订单 --with-api
  node scripts/generate-feat.js notifications --chinese=通知 --no-mock --no-i18n

AI 智能体使用示例:
  node scripts/generate-feat.js blog-posts --entity=BlogPost --chinese=博客文章 --with-api
  node scripts/generate-feat.js user-profiles --entity=UserProfile --chinese=用户档案
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
  FeatGenerator,
  CommandLineParser
}

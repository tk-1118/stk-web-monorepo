<!--
  首页组件
  应用外壳的主页面，提供系统概览和快速导航
-->
<template>
  <div class="home-page">
    <!-- 页面头部 -->
    <div class="home-header">
      <h1>禾码Web管理系统</h1>
      <p>欢迎使用基于领域特性包架构的管理系统</p>
    </div>

    <!-- 快速导航卡片 -->
    <div class="home-navigation">
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="nav-card" shadow="hover" @click="navigateToUsers">
            <div class="nav-card-content">
              <div class="nav-card-icon">
                <el-icon size="48"><User /></el-icon>
              </div>
              <div class="nav-card-info">
                <h3>用户管理</h3>
                <p>管理系统用户，包括创建、编辑、删除等操作</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 系统统计 -->
    <div class="home-stats">
      <el-card>
        <template #header>
          <h3>系统概览</h3>
        </template>

        <el-row :gutter="24">
          <el-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-value">{{ mockStats.users }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 架构说明 -->
    <div class="home-architecture">
      <el-card>
        <template #header>
          <h3>架构特性</h3>
        </template>

        <el-row :gutter="24">
          <el-col :xs="24" :md="12">
            <div class="feature-item">
              <h4>🏗️ 领域驱动设计</h4>
              <p>按业务领域拆分功能模块，每个 feat-* 包自包含页面、组件、状态管理等</p>
            </div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="feature-item">
              <h4>🔌 插件化路由</h4>
              <p>支持动态注册领域路由，实现模块的热插拔和独立部署</p>
            </div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="feature-item">
              <h4>🚧 边界约束</h4>
              <p>通过 ESLint 规则强制模块边界，防止跨领域依赖</p>
            </div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="feature-item">
              <h4>📦 共享资源</h4>
              <p>通用组件、工具函数、类型定义统一管理在 shared 包中</p>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, ShoppingCart, Box, Setting } from '@element-plus/icons-vue'

/**
 * 首页组件
 * 提供系统概览、快速导航和架构说明
 */

// 路由实例
const router = useRouter()

// 模拟统计数据
const mockStats = ref({
  users: '1,234',
  orders: '5,678',
  products: '2,345',
  revenue: '¥12,345'
})

/**
 * 导航到用户管理
 */
const navigateToUsers = () => {
  router.push('/users')
}
</script>

<style scoped lang="scss">
.home-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f5f7fa;
}

.home-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0 0 12px 0;
    font-size: 36px;
    font-weight: 700;
    color: #303133;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    margin: 0;
    font-size: 18px;
    color: #606266;
  }
}

.home-navigation {
  margin-bottom: 40px;

  .nav-card {
    height: 200px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;

    &:hover:not(.nav-card--disabled) {
      transform: translateY(-4px);
      border-color: #409eff;
      box-shadow: 0 8px 25px rgba(64, 158, 255, 0.2);
    }

    &--disabled {
      cursor: not-allowed;
      opacity: 0.6;

      &:hover {
        transform: none;
        box-shadow: none;
      }
    }

    .nav-card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      height: 100%;
      padding: 20px;
    }

    .nav-card-icon {
      margin-bottom: 16px;
      color: #409eff;
    }

    .nav-card-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;

      h3 {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }

      p {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: #606266;
        line-height: 1.5;
      }
    }
  }
}

.home-stats {
  margin-bottom: 40px;

  .stat-item {
    text-align: center;
    padding: 20px;

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #409eff;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: #909399;
    }
  }
}

.home-architecture {
  .feature-item {
    padding: 20px;
    border-radius: 8px;
    background: #f8f9fa;
    margin-bottom: 16px;
    height: 120px;
    display: flex;
    flex-direction: column;

    h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    p {
      margin: 0;
      font-size: 14px;
      color: #606266;
      line-height: 1.5;
      flex: 1;
    }
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: 16px;
  }

  .home-header {
    padding: 24px 16px;

    h1 {
      font-size: 28px;
    }

    p {
      font-size: 16px;
    }
  }

  .nav-card {
    height: 160px !important;

    .nav-card-content {
      padding: 16px;
    }

    .nav-card-icon {
      margin-bottom: 12px;

      .el-icon {
        font-size: 36px !important;
      }
    }

    .nav-card-info {
      h3 {
        font-size: 16px;
      }

      p {
        font-size: 13px;
      }
    }
  }

  .stat-item {
    padding: 16px;

    .stat-value {
      font-size: 24px;
    }
  }

  .feature-item {
    height: auto !important;
    padding: 16px;

    h4 {
      font-size: 15px;
    }

    p {
      font-size: 13px;
    }
  }
}
</style>

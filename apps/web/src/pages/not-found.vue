<!--
  404 页面未找到
  当用户访问不存在的路由时显示此页面
-->
<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="not-found-image">
        <div class="error-code">404</div>
        <div class="error-icon">🔍</div>
      </div>

      <div class="not-found-content">
        <h1>页面未找到</h1>
        <p>抱歉，您访问的页面不存在或已被移除。</p>

        <div class="not-found-actions">
          <el-button type="primary" @click="goHome">
            <el-icon><House /></el-icon>
            返回首页
          </el-button>
          <el-button @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回上页
          </el-button>
        </div>
      </div>

      <div class="not-found-suggestions">
        <h3>您可以尝试：</h3>
        <ul>
          <li>检查网址是否正确</li>
          <li>返回上一页重新操作</li>
          <li>访问我们的首页</li>
          <li>联系系统管理员</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { House, ArrowLeft } from '@element-plus/icons-vue'

/**
 * 404 页面未找到组件
 * 提供友好的错误提示和导航选项
 */

// 路由实例
const router = useRouter()

/**
 * 返回首页
 */
const goHome = () => {
  router.push('/')
}

/**
 * 返回上一页
 */
const goBack = () => {
  // 如果有历史记录则返回，否则跳转到首页
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style lang="scss" scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  padding: 20px;
}

.not-found-container {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.not-found-image {
  position: relative;
  margin-bottom: 40px;

  .error-code {
    font-size: 120px;
    font-weight: 700;
    color: #e6e8eb;
    line-height: 1;
    margin-bottom: 20px;
  }

  .error-icon {
    font-size: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: float 3s ease-in-out infinite;
  }
}

.not-found-content {
  margin-bottom: 40px;

  h1 {
    font-size: 32px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 16px 0;
  }

  p {
    font-size: 18px;
    color: #606266;
    margin: 0 0 32px 0;
    line-height: 1.6;
  }
}

.not-found-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.not-found-suggestions {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: left;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 16px 0;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    color: #606266;
    line-height: 1.8;

    li {
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0px);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-10px);
  }
}

@media (max-width: 768px) {
  .not-found-image {
    .error-code {
      font-size: 80px;
    }

    .error-icon {
      font-size: 40px;
    }
  }

  .not-found-content {
    h1 {
      font-size: 24px;
    }

    p {
      font-size: 16px;
    }
  }

  .not-found-actions {
    flex-direction: column;
    align-items: center;

    .el-button {
      width: 200px;
    }
  }
}
</style>

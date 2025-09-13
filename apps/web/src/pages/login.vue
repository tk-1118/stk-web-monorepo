<!--
  登录页面
  提供用户登录功能，支持用户名密码登录
-->
<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>盒马Web管理系统</h1>
        <p>欢迎登录</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            clearable
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="loginForm.remember">
            记住我
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            style="width: 100%"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p>&copy; 2024 盒马Web管理系统. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

/**
 * 登录页面组件
 * 提供用户登录功能和表单验证
 */

// 路由实例
const router = useRouter()
const route = useRoute()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

/**
 * 处理登录
 */
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()

    loading.value = true

    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))

    // TODO: 实现真实的登录逻辑
    // const response = await authApi.login(loginForm)
    // localStorage.setItem('token', response.token)

    ElMessage.success('登录成功')

    // 跳转到目标页面或首页
    const redirectPath = (route.query.redirect as string) || '/'
    router.push(redirectPath)
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message || '登录失败')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    margin: 0 0 8px 0;
    font-size: 28px;
    font-weight: 600;
    color: #303133;
  }

  p {
    margin: 0;
    font-size: 16px;
    color: #909399;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.login-footer {
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;

  p {
    margin: 0;
    font-size: 14px;
    color: #909399;
  }
}
</style>

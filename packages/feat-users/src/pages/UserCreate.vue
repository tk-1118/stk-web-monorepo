<!--
  创建用户页面
  提供用户创建表单，包含表单验证和提交功能
-->
<template>
  <div class="user-create">
    <!-- 页面头部 -->
    <div class="user-create__header">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回列表
      </el-button>
      <h2>创建用户</h2>
    </div>

    <!-- 创建表单 -->
    <el-card class="user-create__card">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        @submit.prevent="handleSubmit"
      >
        <!-- 基本信息 -->
        <div class="user-create__section">
          <h3>基本信息</h3>

          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="formData.username"
              placeholder="请输入用户名"
              clearable
            />
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入真实姓名"
              clearable
            />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="formData.email"
              type="email"
              placeholder="请输入邮箱地址"
              clearable
            />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="formData.phone"
              placeholder="请输入手机号码"
              clearable
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
              show-password
              clearable
            />
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              show-password
              clearable
            />
          </el-form-item>
        </div>

        <!-- 角色权限 -->
        <div class="user-create__section">
          <h3>角色权限</h3>

          <el-form-item label="用户角色" prop="role">
            <el-select
              v-model="formData.role"
              placeholder="请选择用户角色"
              style="width: 100%"
            >
              <el-option label="普通用户" value="user" />
              <el-option label="经理" value="manager" />
              <el-option label="管理员" value="admin" />
            </el-select>
          </el-form-item>

          <el-form-item label="用户状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio value="active">正常</el-radio>
              <el-radio value="inactive">禁用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="用户组">
            <el-select
              v-model="formData.groups"
              multiple
              placeholder="请选择用户组"
              style="width: 100%"
            >
              <el-option label="开发组" value="development" />
              <el-option label="测试组" value="testing" />
              <el-option label="运维组" value="operations" />
              <el-option label="产品组" value="product" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 个人信息 -->
        <div class="user-create__section">
          <h3>个人信息</h3>

          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="handleAvatarUpload"
            >
              <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>

          <el-form-item label="个人简介">
            <el-input
              v-model="formData.bio"
              type="textarea"
              :rows="4"
              placeholder="请输入个人简介"
            />
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <div class="user-create__actions">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            创建用户
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules, type UploadProps } from 'element-plus'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '../store/users.store'

/**
 * 创建用户页面组件
 * 提供完整的用户创建表单和验证功能
 */

// 路由实例
const router = useRouter()

// 用户状态管理
const usersStore = useUsersStore()
const { loading } = storeToRefs(usersStore)

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  username: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  status: 'active' as 'active' | 'inactive',
  groups: [] as string[],
  avatar: '',
  bio: ''
})

// 自定义验证器
const validateConfirmPassword = (rule: any, value: string, callback: Function) => {
  if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ]
}

/**
 * 返回用户列表
 */
const handleBack = () => {
  router.push('/users')
}

/**
 * 重置表单
 */
const handleReset = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    status: 'active',
    groups: [],
    avatar: '',
    bio: ''
  })
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 准备提交数据
    const submitData = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
      status: formData.status,
      groups: formData.groups,
      avatar: formData.avatar,
      bio: formData.bio
    }

    await usersStore.createUser(submitData)
    ElMessage.success('用户创建成功')
    router.push('/users')
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message || '创建用户失败')
    }
  }
}

/**
 * 头像上传前验证
 */
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

/**
 * 处理头像上传
 */
const handleAvatarUpload = (options: any) => {
  // 这里应该实现真实的文件上传逻辑
  // 现在只是模拟
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.avatar = e.target?.result as string
  }
  reader.readAsDataURL(options.file)
}
</script>

<style lang="scss" scoped>
.user-create {
  padding: 24px;

  &__header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
  }

  &__card {
    max-width: 800px;
  }

  &__section {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid #ebeef5;

    &:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
    }

    h3 {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    padding-top: 24px;
    border-top: 1px solid #ebeef5;
  }
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}
</style>

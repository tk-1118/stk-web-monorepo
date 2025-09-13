<!--
  编辑用户页面
  提供用户信息编辑表单，支持数据回填和更新
-->
<template>
  <div class="user-edit">
    <!-- 加载状态 -->
    <div v-if="loading && !currentUser" class="user-edit__loading">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 编辑表单 -->
    <div v-else-if="currentUser" class="user-edit__content">
      <!-- 页面头部 -->
      <div class="user-edit__header">
        <el-button @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          返回详情
        </el-button>
        <h2>编辑用户 - {{ currentUser.name }}</h2>
      </div>

      <!-- 编辑表单 -->
      <el-card class="user-edit__card">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          @submit.prevent="handleSubmit"
        >
          <!-- 基本信息 -->
          <div class="user-edit__section">
            <h3>基本信息</h3>

            <el-form-item label="用户ID">
              <el-input :value="currentUser.id" disabled />
            </el-form-item>

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
          </div>

          <!-- 角色权限 -->
          <div class="user-edit__section">
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
          <div class="user-edit__section">
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

          <!-- 密码修改 -->
          <div class="user-edit__section">
            <h3>密码修改</h3>
            <el-alert
              title="留空则不修改密码"
              type="info"
              :closable="false"
              style="margin-bottom: 16px"
            />

            <el-form-item label="新密码" prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                placeholder="请输入新密码（留空不修改）"
                show-password
                clearable
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="formData.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                show-password
                clearable
              />
            </el-form-item>
          </div>

          <!-- 操作按钮 -->
          <div class="user-edit__actions">
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" :loading="loading" @click="handleSubmit">
              保存修改
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>

    <!-- 错误状态 -->
    <div v-else class="user-edit__error">
      <el-result
        icon="warning"
        title="用户不存在"
        sub-title="请检查用户ID是否正确"
      >
        <template #extra>
          <el-button type="primary" @click="handleBack">
            返回列表
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules, type UploadProps } from 'element-plus'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '../store/users.store'

/**
 * 编辑用户页面组件
 * 提供用户信息编辑功能，支持数据回填和验证
 */

// 路由实例
const route = useRoute()
const router = useRouter()

// 用户状态管理
const usersStore = useUsersStore()
const { currentUser, loading } = storeToRefs(usersStore)

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
  if (formData.password && value !== formData.password) {
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
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ]
}

/**
 * 获取用户详情并填充表单
 */
const fetchUserDetail = async () => {
  const userId = route.params.id as string
  if (!userId) {
    ElMessage.error('用户ID不能为空')
    handleBack()
    return
  }

  try {
    await usersStore.fetchUserById(userId)
  } catch (error) {
    ElMessage.error('获取用户详情失败')
  }
}

/**
 * 填充表单数据
 */
const fillFormData = () => {
  if (currentUser.value) {
    Object.assign(formData, {
      username: currentUser.value.username,
      name: currentUser.value.name,
      email: currentUser.value.email,
      phone: currentUser.value.phone || '',
      password: '',
      confirmPassword: '',
      role: currentUser.value.role,
      status: currentUser.value.status,
      groups: currentUser.value.groups || [],
      avatar: currentUser.value.avatar || '',
      bio: currentUser.value.bio || ''
    })
  }
}

/**
 * 返回用户详情页
 */
const handleBack = () => {
  if (currentUser.value) {
    router.push(`/users/${currentUser.value.id}`)
  } else {
    router.push('/users')
  }
}

/**
 * 重置表单
 */
const handleReset = () => {
  fillFormData()
  formRef.value?.clearValidate()
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value || !currentUser.value) return

  try {
    await formRef.value.validate()

    // 准备提交数据
    const submitData: any = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      groups: formData.groups,
      avatar: formData.avatar,
      bio: formData.bio
    }

    // 如果设置了新密码，则包含密码字段
    if (formData.password) {
      submitData.password = formData.password
    }

    await usersStore.updateUser(currentUser.value.id, submitData)
    ElMessage.success('用户信息更新成功')
    router.push(`/users/${currentUser.value.id}`)
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message || '更新用户信息失败')
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

// 监听用户数据变化，自动填充表单
watch(currentUser, (newUser) => {
  if (newUser) {
    fillFormData()
  }
}, { immediate: true })

// 组件挂载时获取数据
onMounted(() => {
  fetchUserDetail()
})
</script>

<style lang="scss" scoped>
.user-edit {
  padding: 24px;

  &__loading {
    padding: 24px;
  }

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

  &__error {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
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

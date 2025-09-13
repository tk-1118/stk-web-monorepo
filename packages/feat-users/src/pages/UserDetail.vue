<!--
  用户详情页面
  展示用户的详细信息，包括基本信息、权限设置等
-->
<template>
  <div class="user-detail">
    <!-- 加载状态 -->
    <div v-if="loading" class="user-detail__loading">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 用户详情内容 -->
    <div v-else-if="currentUser" class="user-detail__content">
      <!-- 操作按钮 -->
      <div class="user-detail__actions">
        <el-button @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          返回列表
        </el-button>
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon>
          编辑用户
        </el-button>
        <el-button
          :type="currentUser.status === 'active' ? 'warning' : 'success'"
          @click="handleToggleStatus"
        >
          {{ currentUser.status === 'active' ? '禁用用户' : '启用用户' }}
        </el-button>
      </div>

      <!-- 用户基本信息 -->
      <el-card class="user-detail__card">
        <template #header>
          <div class="user-detail__card-header">
            <h3>基本信息</h3>
          </div>
        </template>

        <div class="user-detail__info">
          <div class="user-detail__avatar">
            <el-avatar :size="120" :src="currentUser.avatar">
              {{ currentUser.name?.charAt(0) }}
            </el-avatar>
            <div class="user-detail__status">
              <el-tag
                :type="currentUser.status === 'active' ? 'success' : 'danger'"
                size="large"
              >
                {{ currentUser.status === 'active' ? '正常' : '禁用' }}
              </el-tag>
            </div>
          </div>

          <div class="user-detail__fields">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="用户ID">
                {{ currentUser.id }}
              </el-descriptions-item>
              <el-descriptions-item label="用户名">
                {{ currentUser.username }}
              </el-descriptions-item>
              <el-descriptions-item label="姓名">
                {{ currentUser.name }}
              </el-descriptions-item>
              <el-descriptions-item label="邮箱">
                {{ currentUser.email }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号">
                {{ currentUser.phone || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="角色">
                <el-tag :type="getRoleTagType(currentUser.role)">
                  {{ getRoleLabel(currentUser.role) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                {{ formatDate(currentUser.createdAt) }}
              </el-descriptions-item>
              <el-descriptions-item label="更新时间">
                {{ formatDate(currentUser.updatedAt) }}
              </el-descriptions-item>
              <el-descriptions-item label="最后登录">
                {{ currentUser.lastLoginAt ? formatDate(currentUser.lastLoginAt) : '从未登录' }}
              </el-descriptions-item>
              <el-descriptions-item label="登录次数">
                {{ currentUser.loginCount || 0 }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </el-card>

      <!-- 用户权限信息 -->
      <el-card class="user-detail__card">
        <template #header>
          <div class="user-detail__card-header">
            <h3>权限信息</h3>
          </div>
        </template>

        <div class="user-detail__permissions">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户组">
              <el-tag v-for="group in currentUser.groups" :key="group" class="mr-2">
                {{ group }}
              </el-tag>
              <span v-if="!currentUser.groups?.length">无</span>
            </el-descriptions-item>
            <el-descriptions-item label="权限列表">
              <el-tag
                v-for="permission in currentUser.permissions"
                :key="permission"
                type="info"
                class="mr-2 mb-2"
              >
                {{ permission }}
              </el-tag>
              <span v-if="!currentUser.permissions?.length">无特殊权限</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>

      <!-- 用户活动记录 -->
      <el-card class="user-detail__card">
        <template #header>
          <div class="user-detail__card-header">
            <h3>活动记录</h3>
          </div>
        </template>

        <div class="user-detail__activities">
          <el-timeline>
            <el-timeline-item
              v-for="activity in userActivities"
              :key="activity.id"
              :timestamp="formatDate(activity.createdAt)"
              placement="top"
            >
              <el-card>
                <h4>{{ activity.title }}</h4>
                <p>{{ activity.description }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>

          <div v-if="!userActivities.length" class="user-detail__no-data">
            <el-empty description="暂无活动记录" />
          </div>
        </div>
      </el-card>
    </div>

    <!-- 错误状态 -->
    <div v-else class="user-detail__error">
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '../store/users.store'

/**
 * 用户详情页面组件
 * 展示用户的完整信息和操作历史
 */

// 路由实例
const route = useRoute()
const router = useRouter()

// 用户状态管理
const usersStore = useUsersStore()
const { currentUser, loading } = storeToRefs(usersStore)

// 用户活动记录（模拟数据）
const userActivities = ref([
  {
    id: '1',
    title: '用户登录',
    description: '从 IP 192.168.1.100 登录系统',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: '修改密码',
    description: '用户修改了登录密码',
    createdAt: '2024-01-14T15:20:00Z'
  },
  {
    id: '3',
    title: '更新资料',
    description: '用户更新了个人资料信息',
    createdAt: '2024-01-13T09:15:00Z'
  }
])

/**
 * 获取用户详情
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
 * 返回用户列表
 */
const handleBack = () => {
  router.push('/users')
}

/**
 * 编辑用户
 */
const handleEdit = () => {
  if (currentUser.value) {
    router.push(`/users/${currentUser.value.id}/edit`)
  }
}

/**
 * 切换用户状态
 */
const handleToggleStatus = async () => {
  if (!currentUser.value) return

  const action = currentUser.value.status === 'active' ? '禁用' : '启用'
  const newStatus = currentUser.value.status === 'active' ? 'inactive' : 'active'

  try {
    await ElMessageBox.confirm(
      `确定要${action}这个用户吗？`,
      `确认${action}`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await usersStore.updateUser(currentUser.value.id, { status: newStatus })
    ElMessage.success(`${action}成功`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`${action}失败`)
    }
  }
}

/**
 * 获取角色标签类型
 */
const getRoleTagType = (role: string) => {
  const typeMap: Record<string, string> = {
    admin: 'danger',
    manager: 'warning',
    user: 'info'
  }
  return typeMap[role] || 'info'
}

/**
 * 获取角色标签文本
 */
const getRoleLabel = (role: string) => {
  const labelMap: Record<string, string> = {
    admin: '管理员',
    manager: '经理',
    user: '普通用户'
  }
  return labelMap[role] || role
}

/**
 * 格式化日期
 */
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

// 组件挂载时获取数据
onMounted(() => {
  fetchUserDetail()
})
</script>

<style lang="scss" scoped>
.user-detail {
  padding: 24px;

  &__loading {
    padding: 24px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }

  &__card {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__card-header {
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }

  &__info {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }

  &__avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  &__status {
    text-align: center;
  }

  &__fields {
    flex: 1;
  }

  &__permissions {
    .mr-2 {
      margin-right: 8px;
    }

    .mb-2 {
      margin-bottom: 8px;
    }
  }

  &__activities {
    max-height: 400px;
    overflow-y: auto;
  }

  &__no-data {
    text-align: center;
    padding: 40px 0;
  }

  &__error {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }
}
</style>

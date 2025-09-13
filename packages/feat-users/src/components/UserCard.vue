<!--
  用户卡片组件
  用于展示用户基本信息的卡片组件，可复用于不同场景
-->
<template>
  <el-card class="user-card" :class="{ 'user-card--clickable': clickable }" @click="handleClick">
    <!-- 用户头像和基本信息 -->
    <div class="user-card__header">
      <el-avatar :size="size" :src="user.avatar" class="user-card__avatar">
        {{ user.name?.charAt(0) }}
      </el-avatar>

      <div class="user-card__info">
        <h3 class="user-card__name">{{ user.name }}</h3>
        <p class="user-card__username">@{{ user.username }}</p>
        <p class="user-card__email">{{ user.email }}</p>
      </div>

      <div class="user-card__status">
        <el-tag :type="user.status === 'active' ? 'success' : 'danger'" size="small">
          {{ user.status === 'active' ? '正常' : '禁用' }}
        </el-tag>
      </div>
    </div>

    <!-- 用户角色和权限 -->
    <div class="user-card__content">
      <div class="user-card__role">
        <el-tag :type="getRoleTagType(user.role)" size="small">
          {{ getRoleLabel(user.role) }}
        </el-tag>
      </div>

      <div v-if="user.groups?.length" class="user-card__groups">
        <span class="user-card__label">用户组：</span>
        <el-tag
          v-for="group in user.groups"
          :key="group"
          type="info"
          size="small"
          class="user-card__group-tag"
        >
          {{ group }}
        </el-tag>
      </div>

      <div v-if="showStats" class="user-card__stats">
        <div class="user-card__stat">
          <span class="user-card__stat-label">登录次数：</span>
          <span class="user-card__stat-value">{{ user.loginCount || 0 }}</span>
        </div>
        <div class="user-card__stat">
          <span class="user-card__stat-label">最后登录：</span>
          <span class="user-card__stat-value">
            {{ user.lastLoginAt ? formatDate(user.lastLoginAt) : '从未登录' }}
          </span>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div v-if="showActions" class="user-card__actions">
      <el-button size="small" @click.stop="handleView">
        查看
      </el-button>
      <el-button size="small" type="primary" @click.stop="handleEdit">
        编辑
      </el-button>
      <el-button size="small" type="danger" @click.stop="handleDelete">
        删除
      </el-button>
    </div>

    <!-- 自定义插槽 -->
    <div v-if="$slots.extra" class="user-card__extra">
      <slot name="extra" :user="user" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@hema-web-monorepo/models'

/**
 * 用户卡片组件
 * 提供用户信息的卡片展示，支持多种配置和自定义操作
 */

// 组件属性
interface Props {
  /** 用户数据 */
  user: User
  /** 头像大小 */
  size?: number
  /** 是否可点击 */
  clickable?: boolean
  /** 是否显示统计信息 */
  showStats?: boolean
  /** 是否显示操作按钮 */
  showActions?: boolean
}

// 组件事件
interface Emits {
  /** 点击卡片事件 */
  (e: 'click', user: User): void
  /** 查看用户事件 */
  (e: 'view', user: User): void
  /** 编辑用户事件 */
  (e: 'edit', user: User): void
  /** 删除用户事件 */
  (e: 'delete', user: User): void
}

// 定义属性和事件
const props = withDefaults(defineProps<Props>(), {
  size: 60,
  clickable: false,
  showStats: true,
  showActions: true
})

const emit = defineEmits<Emits>()

/**
 * 处理卡片点击
 */
const handleClick = () => {
  if (props.clickable) {
    emit('click', props.user)
  }
}

/**
 * 处理查看操作
 */
const handleView = () => {
  emit('view', props.user)
}

/**
 * 处理编辑操作
 */
const handleEdit = () => {
  emit('edit', props.user)
}

/**
 * 处理删除操作
 */
const handleDelete = () => {
  emit('delete', props.user)
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
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<style lang="scss" scoped>
.user-card {
  transition: all 0.3s ease;

  &--clickable {
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 16px;
  }

  &__avatar {
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__username {
    margin: 0 0 4px 0;
    font-size: 14px;
    color: #909399;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__email {
    margin: 0;
    font-size: 14px;
    color: #606266;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__status {
    flex-shrink: 0;
  }

  &__content {
    margin-bottom: 16px;
  }

  &__role {
    margin-bottom: 12px;
  }

  &__groups {
    margin-bottom: 12px;
  }

  &__label {
    font-size: 14px;
    color: #606266;
    margin-right: 8px;
  }

  &__group-tag {
    margin-right: 8px;
    margin-bottom: 4px;
  }

  &__stats {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__stat {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  &__stat-label {
    color: #909399;
  }

  &__stat-value {
    color: #303133;
    font-weight: 500;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 16px;
    border-top: 1px solid #ebeef5;
  }

  &__extra {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #ebeef5;
  }
}
</style>

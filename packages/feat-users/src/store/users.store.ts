/**
 * 用户管理状态管理
 * 负责用户数据的获取、缓存和状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@hema-web-monorepo/models'
import { usersApi } from '../api/users.service'

/** 分页查询参数接口 */
interface PaginationParams {
  page?: number
  size?: number
  keyword?: string
}

/** 分页响应接口 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  size: number
}

/**
 * 用户管理 Store
 * 提供用户数据的统一管理和操作方法
 */
export const useUsersStore = defineStore('users', () => {
  // 状态定义
  const list = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0) // 修改为响应式变量，存储服务器返回的总数

  // 计算属性
  const activeUsers = computed(() => list.value.filter(user => user.status === 'active'))

  /**
   * 获取用户列表
   * @param params 查询参数
   */
  const fetchUsers = async (params?: PaginationParams) => {
    loading.value = true
    error.value = null

    try {
      const response = await usersApi.getUsers(params)
      // 确保数据结构正确，并提供默认值
      const paginatedData = response.data
      list.value = Array.isArray(paginatedData.data) ? paginatedData.data : []
      totalCount.value = paginatedData.total || 0
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取用户列表失败'
      console.error('获取用户列表失败:', err)
      // 出错时重置数据
      list.value = []
      totalCount.value = 0
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取用户详情
   * @param id 用户ID
   */
  const fetchUserById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await usersApi.getUserById(id)
      currentUser.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取用户详情失败'
      console.error('获取用户详情失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建用户
   * @param userData 用户数据
   */
  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    error.value = null

    try {
      const response = await usersApi.createUser(userData)
      list.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建用户失败'
      console.error('创建用户失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新用户
   * @param id 用户ID
   * @param userData 用户数据
   */
  const updateUser = async (id: string, userData: Partial<User>) => {
    loading.value = true
    error.value = null

    try {
      const response = await usersApi.updateUser(id, userData)
      const index = list.value.findIndex(user => user.id === id)
      if (index !== -1) {
        list.value[index] = response.data
      }
      if (currentUser.value?.id === id) {
        currentUser.value = response.data
      }
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新用户失败'
      console.error('更新用户失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除用户
   * @param id 用户ID
   */
  const deleteUser = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await usersApi.deleteUser(id)
      list.value = list.value.filter(user => user.id !== id)
      if (currentUser.value?.id === id) {
        currentUser.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除用户失败'
      console.error('删除用户失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 清空当前用户
   */
  const clearCurrentUser = () => {
    currentUser.value = null
  }

  /**
   * 重置状态
   */
  const reset = () => {
    list.value = []
    currentUser.value = null
    loading.value = false
    error.value = null
    totalCount.value = 0
  }

  return {
    // 状态
    list,
    currentUser,
    loading,
    error,
    totalCount, // 现在是响应式变量而不是计算属性

    // 计算属性
    activeUsers,

    // 方法
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    clearCurrentUser,
    reset
  }
})

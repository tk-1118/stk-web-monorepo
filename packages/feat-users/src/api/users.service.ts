/**
 * 用户管理 API 服务
 * 封装用户相关的 HTTP 请求，提供统一的接口调用方法
 */
import { http } from '@hema-web-monorepo/api'
import type { User } from '@hema-web-monorepo/models'

/** API 响应基础接口 */
interface ApiResponse<T> {
  data: T
  message: string
  code: number
}

/** 分页查询参数接口 */
interface PaginationParams {
  page?: number
  size?: number
  keyword?: string
}

/** 分页响应接口 */
interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  size: number
}

/**
 * 用户管理 API 服务类
 * 提供用户 CRUD 操作的 HTTP 接口封装
 */
class UsersApiService {
  private readonly baseUrl = '/users'

  /**
   * 获取用户列表
   * @param params 查询参数
   * @returns 用户列表响应
   */
  async getUsers(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    const response = await http.get<ApiResponse<PaginatedResponse<User>>>(this.baseUrl, {
      params: {
        page: params?.page || 1,
        size: params?.size || 10,
        keyword: params?.keyword || ''
      }
    })
    return response.data
  }

  /**
   * 根据ID获取用户详情
   * @param id 用户ID
   * @returns 用户详情响应
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * 创建新用户
   * @param userData 用户数据
   * @returns 创建的用户响应
   */
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> {
    const response = await http.post<ApiResponse<User>>(this.baseUrl, userData)
    return response.data
  }

  /**
   * 更新用户信息
   * @param id 用户ID
   * @param userData 更新的用户数据
   * @returns 更新后的用户响应
   */
  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await http.put<ApiResponse<User>>(`${this.baseUrl}/${id}`, userData)
    return response.data
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 删除操作响应
   */
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * 批量删除用户
   * @param ids 用户ID数组
   * @returns 批量删除操作响应
   */
  async batchDeleteUsers(ids: string[]): Promise<ApiResponse<void>> {
    const response = await http.delete<ApiResponse<void>>(`${this.baseUrl}/batch`, {
      data: { ids }
    })
    return response.data
  }

  /**
   * 更新用户状态
   * @param id 用户ID
   * @param status 新状态
   * @returns 更新状态响应
   */
  async updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<ApiResponse<User>> {
    const response = await http.patch<ApiResponse<User>>(`${this.baseUrl}/${id}/status`, { status })
    return response.data
  }
}

/** 导出用户 API 服务实例 */
export const usersApi = new UsersApiService()

/**
 * 用户管理模块 Mock 数据
 * 提供用户相关的模拟数据和 API 响应
 */
import type { User } from '@hema-web-monorepo/models'

/** 模拟用户数据 */
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    name: '系统管理员',
    email: 'admin@example.com',
    phone: '13800138001',
    role: 'admin',
    status: 'active',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    bio: '系统管理员，负责整个系统的管理和维护工作。',
    groups: ['development', 'operations'],
    permissions: ['user:read', 'user:write', 'user:delete', 'system:admin'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    lastLoginAt: '2024-01-15T10:30:00Z',
    loginCount: 156
  },
  {
    id: '2',
    username: 'manager001',
    name: '张经理',
    email: 'zhang.manager@example.com',
    phone: '13800138002',
    role: 'manager',
    status: 'active',
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    bio: '部门经理，负责团队管理和项目协调工作。',
    groups: ['product', 'testing'],
    permissions: ['user:read', 'user:write', 'project:manage'],
    createdAt: '2024-01-02T08:00:00Z',
    updatedAt: '2024-01-14T16:20:00Z',
    lastLoginAt: '2024-01-14T16:20:00Z',
    loginCount: 89
  },
  {
    id: '3',
    username: 'developer001',
    name: '李开发',
    email: 'li.developer@example.com',
    phone: '13800138003',
    role: 'user',
    status: 'active',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    bio: '前端开发工程师，专注于 Vue.js 和 TypeScript 开发。',
    groups: ['development'],
    permissions: ['user:read', 'project:read'],
    createdAt: '2024-01-03T09:00:00Z',
    updatedAt: '2024-01-13T14:15:00Z',
    lastLoginAt: '2024-01-13T14:15:00Z',
    loginCount: 234
  },
  {
    id: '4',
    username: 'tester001',
    name: '王测试',
    email: 'wang.tester@example.com',
    phone: '13800138004',
    role: 'user',
    status: 'active',
    avatar: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48png.png',
    bio: '测试工程师，负责产品质量保证和自动化测试。',
    groups: ['testing'],
    permissions: ['user:read', 'test:write'],
    createdAt: '2024-01-04T10:00:00Z',
    updatedAt: '2024-01-12T11:30:00Z',
    lastLoginAt: '2024-01-12T11:30:00Z',
    loginCount: 167
  },
  {
    id: '5',
    username: 'designer001',
    name: '陈设计',
    email: 'chen.designer@example.com',
    phone: '13800138005',
    role: 'user',
    status: 'inactive',
    avatar: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png',
    bio: 'UI/UX 设计师，专注于用户体验设计和界面优化。',
    groups: ['product'],
    permissions: ['user:read', 'design:write'],
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-11T09:45:00Z',
    lastLoginAt: '2024-01-10T15:20:00Z',
    loginCount: 45
  },
  {
    id: '6',
    username: 'operator001',
    name: '刘运维',
    email: 'liu.operator@example.com',
    phone: '13800138006',
    role: 'user',
    status: 'active',
    avatar: 'https://cube.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0899b9apng.png',
    bio: '运维工程师，负责系统部署、监控和维护工作。',
    groups: ['operations'],
    permissions: ['user:read', 'system:monitor'],
    createdAt: '2024-01-06T12:00:00Z',
    updatedAt: '2024-01-10T13:25:00Z',
    lastLoginAt: '2024-01-10T13:25:00Z',
    loginCount: 78
  }
]

/** 模拟用户活动记录 */
export const mockUserActivities = [
  {
    id: '1',
    userId: '1',
    title: '用户登录',
    description: '从 IP 192.168.1.100 登录系统',
    type: 'login',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    title: '修改密码',
    description: '用户修改了登录密码',
    type: 'security',
    createdAt: '2024-01-14T15:20:00Z'
  },
  {
    id: '3',
    userId: '1',
    title: '更新资料',
    description: '用户更新了个人资料信息',
    type: 'profile',
    createdAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    userId: '2',
    title: '创建项目',
    description: '创建了新项目"电商系统重构"',
    type: 'project',
    createdAt: '2024-01-14T16:20:00Z'
  },
  {
    id: '5',
    userId: '3',
    title: '提交代码',
    description: '向主分支提交了 15 个文件的修改',
    type: 'development',
    createdAt: '2024-01-13T14:15:00Z'
  }
]

/**
 * 用户 Mock API 服务类
 * 模拟后端 API 的响应行为
 */
export class MockUsersApi {
  private users: User[] = [...mockUsers]
  private activities = [...mockUserActivities]

  /**
   * 模拟获取用户列表
   */
  async getUsers(params?: { page?: number; size?: number; keyword?: string }) {
    // 模拟网络延迟
    await this.delay(300)

    const { page = 1, size = 10, keyword = '' } = params || {}

    // 搜索过滤
    let filteredUsers = this.users
    if (keyword) {
      const searchTerm = keyword.toLowerCase()
      filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        (user.phone && user.phone.includes(searchTerm))
      )
    }

    // 分页处理
    const total = filteredUsers.length
    const startIndex = (page - 1) * size
    const endIndex = startIndex + size
    const data = filteredUsers.slice(startIndex, endIndex)

    return {
      data: {
        data,
        total,
        page,
        size
      },
      message: '获取用户列表成功',
      code: 200
    }
  }

  /**
   * 模拟根据ID获取用户详情
   */
  async getUserById(id: string) {
    await this.delay(200)

    const user = this.users.find(u => u.id === id)
    if (!user) {
      throw new Error('用户不存在')
    }

    return {
      data: user,
      message: '获取用户详情成功',
      code: 200
    }
  }

  /**
   * 模拟创建用户
   */
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    await this.delay(500)

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: undefined,
      loginCount: 0
    }

    this.users.unshift(newUser)

    return {
      data: newUser,
      message: '创建用户成功',
      code: 200
    }
  }

  /**
   * 模拟更新用户
   */
  async updateUser(id: string, userData: Partial<User>) {
    await this.delay(400)

    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error('用户不存在')
    }

    const updatedUser = {
      ...this.users[index],
      ...userData,
      updatedAt: new Date().toISOString()
    }

    this.users[index] = updatedUser

    return {
      data: updatedUser,
      message: '更新用户成功',
      code: 200
    }
  }

  /**
   * 模拟删除用户
   */
  async deleteUser(id: string) {
    await this.delay(300)

    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error('用户不存在')
    }

    this.users.splice(index, 1)

    return {
      data: null,
      message: '删除用户成功',
      code: 200
    }
  }

  /**
   * 模拟批量删除用户
   */
  async batchDeleteUsers(ids: string[]) {
    await this.delay(600)

    this.users = this.users.filter(user => !ids.includes(user.id))

    return {
      data: null,
      message: '批量删除用户成功',
      code: 200
    }
  }

  /**
   * 获取用户活动记录
   */
  async getUserActivities(userId: string) {
    await this.delay(200)

    const userActivities = this.activities.filter(activity => activity.userId === userId)

    return {
      data: userActivities,
      message: '获取用户活动记录成功',
      code: 200
    }
  }

  /**
   * 模拟网络延迟
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/** 导出 Mock API 实例 */
export const mockUsersApi = new MockUsersApi()

/**
 * 用户管理功能 Mock 配置
 * 使用新的零汇总文件、纯 TS 即插即用方案
 */
import { defineMocks, type MockRoute } from '@hema-web-monorepo/mocks'
import { mockUsers } from '../src/mocks/users.mock'
import type { User } from '@hema-web-monorepo/models'

/**
 * 用户相关的 Mock 路由配置
 */
const routes: MockRoute[] = [
  // 获取用户列表
  {
    method: 'GET',
    path: '/api/users',
    handler: async (req, res, ctx) => {
      console.log('[feat-users] 处理用户列表请求:', ctx.query)

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300))

      const { page = '1', size = '10', keyword = '' } = ctx.query

      // 搜索过滤
      let filteredUsers = [...mockUsers]
      if (keyword) {
        const searchTerm = keyword.toLowerCase()
        filteredUsers = mockUsers.filter(user =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.username.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          (user.phone && user.phone.includes(searchTerm))
        )
      }

      // 分页处理
      const pageNum = Number(page)
      const pageSize = Number(size)
      const total = filteredUsers.length
      const startIndex = (pageNum - 1) * pageSize
      const endIndex = startIndex + pageSize
      const data = filteredUsers.slice(startIndex, endIndex)

      const result = {
        data: {
          data,
          total,
          page: pageNum,
          size: pageSize
        },
        message: '获取用户列表成功',
        code: 200
      }

      console.log('[feat-users] 返回用户列表:', `${data.length} 个用户`)
      return result
    }
  },

  // 根据ID获取用户详情
  {
    method: 'GET',
    path: /^\/api\/users\/(\d+)$/,
    handler: async (req, res, ctx) => {
      console.log('[feat-users] 处理用户详情请求:', ctx.params)

      await new Promise(resolve => setTimeout(resolve, 200))

      const id = ctx.params?.[1]
      if (!id) {
        return {
          data: null,
          message: '用户ID不能为空',
          code: 400
        }
      }

      const user = mockUsers.find(u => u.id === id)
      if (!user) {
        return {
          data: null,
          message: '用户不存在',
          code: 404
        }
      }

      const result = {
        data: user,
        message: '获取用户详情成功',
        code: 200
      }

      console.log('[feat-users] 返回用户详情:', user.name)
      return result
    }
  },

  // 创建用户
  {
    method: 'POST',
    path: '/api/users',
    handler: async (req, res, ctx) => {
      console.log('[feat-users] 处理创建用户请求:', ctx.body)

      await new Promise(resolve => setTimeout(resolve, 500))

      const userData = ctx.body as Omit<User, 'id' | 'createdAt' | 'updatedAt'>

      if (!userData.username || !userData.name || !userData.email) {
        return {
          data: null,
          message: '用户名、姓名和邮箱不能为空',
          code: 400
        }
      }

      // 检查用户名是否已存在
      const existingUser = mockUsers.find(u => u.username === userData.username)
      if (existingUser) {
        return {
          data: null,
          message: '用户名已存在',
          code: 409
        }
      }

      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: undefined,
        loginCount: 0
      }

      // 模拟添加到数据库
      mockUsers.unshift(newUser)

      return {
        data: newUser,
        message: '创建用户成功',
        code: 200
      }
    }
  },

  // 更新用户
  {
    method: 'PUT',
    path: /^\/api\/users\/(\d+)$/,
    handler: async (req, res, ctx) => {
      await new Promise(resolve => setTimeout(resolve, 400))

      const id = ctx.params?.[1]
      const userData = ctx.body as Partial<User>

      if (!id) {
        return {
          data: null,
          message: '用户ID不能为空',
          code: 400
        }
      }

      const userIndex = mockUsers.findIndex(u => u.id === id)
      if (userIndex === -1) {
        return {
          data: null,
          message: '用户不存在',
          code: 404
        }
      }

      const updatedUser = {
        ...mockUsers[userIndex],
        ...userData,
        updatedAt: new Date().toISOString()
      }

      // 模拟更新数据库
      mockUsers[userIndex] = updatedUser

      return {
        data: updatedUser,
        message: '更新用户成功',
        code: 200
      }
    }
  },

  // 删除用户
  {
    method: 'DELETE',
    path: /^\/api\/users\/(\d+)$/,
    handler: async (req, res, ctx) => {
      await new Promise(resolve => setTimeout(resolve, 300))

      const id = ctx.params?.[1]
      if (!id) {
        return {
          data: null,
          message: '用户ID不能为空',
          code: 400
        }
      }

      const userIndex = mockUsers.findIndex(u => u.id === id)
      if (userIndex === -1) {
        return {
          data: null,
          message: '用户不存在',
          code: 404
        }
      }

      // 模拟从数据库删除
      mockUsers.splice(userIndex, 1)

      return {
        data: null,
        message: '删除用户成功',
        code: 200
      }
    }
  }
]

/**
 * 导出用户功能的 Mock 配置
 * 使用 defineMocks 函数进行声明式定义
 */
export default defineMocks('feat-users', routes)

/**
 * 数据模型定义
 * 定义应用中使用的所有数据类型和接口
 */

/** 用户数据模型 */
export interface User {
  /** 用户ID */
  id: string
  /** 用户名 */
  username: string
  /** 用户姓名 */
  name: string
  /** 邮箱地址 */
  email: string
  /** 手机号码 */
  phone?: string
  /** 用户角色 */
  role: 'admin' | 'manager' | 'user'
  /** 用户状态 */
  status: 'active' | 'inactive'
  /** 头像URL */
  avatar?: string
  /** 个人简介 */
  bio?: string
  /** 用户组 */
  groups?: string[]
  /** 权限列表 */
  permissions?: string[]
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 最后登录时间 */
  lastLoginAt?: string
  /** 登录次数 */
  loginCount?: number
}

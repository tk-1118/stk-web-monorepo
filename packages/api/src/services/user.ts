/**
 * 用户相关 API 服务
 * 提供用户数据的增删改查操作
 */
import { http } from '../http'
import type { User } from '../../../models/src/index'

/** 用户服务 */
export const UserService = {
  /** 获取用户列表 */
  list: (): Promise<User[]> => http.get('/users')
}

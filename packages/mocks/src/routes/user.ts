/**
 * 用户相关 Mock 数据
 * 生成模拟的用户数据用于开发测试
 */
import Mock from 'mockjs'

/** 生成用户列表 Mock 数据 */
export function users() {
  return Mock.mock({
    'list|5-10': [{
      'id|+1': 1,
      name: '@cname'
    }]
  }).list
}

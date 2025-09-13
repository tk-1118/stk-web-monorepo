/**
 * 用户管理领域路由配置
 * 定义用户相关页面的路由规则，支持懒加载和代码分割
 */
import type { RouteRecordRaw } from 'vue-router'

/** 用户管理路由配置 */
export const usersRoutes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'UsersLayout',
    component: () => import('./pages/UserLayout.vue'),
    meta: {
      title: '用户管理',
      requiresAuth: true
    },
    children: [
      {
        path: '/list',
        name: 'UserList',
        component: () => import('./pages/UserList.vue'),
        meta: {
          title: '用户列表',
          breadcrumb: '用户列表'
        }
      },
      {
        path: ':id',
        name: 'UserDetail',
        component: () => import('./pages/UserDetail.vue'),
        meta: {
          title: '用户详情',
          breadcrumb: '用户详情'
        }
      },
      {
        path: 'create',
        name: 'UserCreate',
        component: () => import('./pages/UserCreate.vue'),
        meta: {
          title: '创建用户',
          breadcrumb: '创建用户'
        }
      },
      {
        path: ':id/edit',
        name: 'UserEdit',
        component: () => import('./pages/UserEdit.vue'),
        meta: {
          title: '编辑用户',
          breadcrumb: '编辑用户'
        }
      }
    ]
  }
]

/**
 * 路由配置
 * 定义应用的页面路由
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../pages/home.vue'

/** 路由配置 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})

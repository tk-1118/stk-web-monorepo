<!--
  用户管理布局组件
  为用户管理模块提供统一的布局结构和导航
-->
<template>
  <div class="user-layout">
    <!-- 页面头部 -->
    <div class="user-layout__header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentRoute?.meta?.breadcrumb">
          {{ currentRoute.meta.breadcrumb }}
        </el-breadcrumb-item>
      </el-breadcrumb>

      <h1 class="user-layout__title">
        {{ currentRoute?.meta?.title || '用户管理' }}
      </h1>
    </div>

    <!-- 主要内容区域 -->
    <div class="user-layout__content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

/**
 * 用户管理布局组件
 * 提供面包屑导航和页面标题
 */

// 获取当前路由信息
const route = useRoute()

// 计算当前路由
const currentRoute = computed(() => route)
</script>

<style lang="scss" scoped>
.user-layout {
  padding: 24px;
  min-height: 100vh;
  background-color: #f5f5f5;

  &__header {
    margin-bottom: 24px;
    padding: 16px 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &__title {
    margin: 12px 0 0 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }

  &__content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
}
</style>

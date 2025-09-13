<template>
  <div :class="{ dark: isDark }">
    <AppHeader @toggle="toggle" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { AppHeader } from '@org/ui'
import { useTheme } from '@org/hooks'

// 主题管理逻辑
const { isDark, toggle, init } = useTheme()

// 初始化主题
onMounted(() => init())
</script>

<style scoped lang="scss">
/* 应用根组件样式 */
</style>

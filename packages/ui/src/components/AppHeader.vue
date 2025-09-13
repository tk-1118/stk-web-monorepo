<!--
  应用头部组件
  提供主题切换按钮和导航功能
-->
<template>
  <header class="app-header">
    <div class="app-header__content">
      <h1 class="app-header__title">Hema Web Monorepo</h1>
      <el-button @click="$emit('toggle')" type="primary">
        切换主题
      </el-button>
    </div>
  </header>
</template>

<script setup lang="ts">
// 定义组件事件
defineEmits<{
  toggle: []
}>()
</script>

<style scoped lang="scss">
.app-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color);

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  &__title {
    margin: 0;
    font-size: 1.5rem;
    color: var(--text-color);
  }
}
</style>

<!--
  首页组件
  展示用户列表数据，演示完整的数据流
-->
<template>
  <section class="home-page">
    <el-card class="home-card">
      <template #header>
        <h3>用户列表</h3>
      </template>

      <div class="home-actions">
        <el-button @click="run" :loading="loading" type="primary">
          加载用户数据
        </el-button>
      </div>

      <el-table
        :data="data || []"
        v-if="!loading && data?.length"
        class="home-table"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" />
      </el-table>

      <el-empty
        v-if="!loading && (!data || data.length === 0)"
        description="暂无数据"
      />
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { useFetch } from '@org/hooks'
import { UserService } from '@org/api'

// 使用自定义 Hook 获取用户数据
const { data, loading, run } = useFetch(() => UserService.list())
</script>

<style scoped lang="scss">
.home-page {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.home-card {
  .home-actions {
    margin-bottom: 16px;
  }

  .home-table {
    width: 100%;
  }
}
</style>

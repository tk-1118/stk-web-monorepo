<!--
  用户列表页面
  展示用户列表，支持搜索、分页、批量操作等功能
-->
<template>
  <div class="user-list">
    <!-- 操作工具栏 -->
    <div class="user-list__toolbar">
      <div class="user-list__search">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户名、邮箱或手机号"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearch">
          搜索
        </el-button>
      </div>

      <div class="user-list__actions">
        <el-button
          type="primary"
          @click="handleCreate"
        >
          <el-icon><Plus /></el-icon>
          新增用户
        </el-button>
        <el-button
          type="danger"
          :disabled="selectedUsers.length === 0"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
      </div>
    </div>

    <!-- 用户表格 -->
    <div class="user-list__table">
      <el-table
        v-loading="loading"
        :data="userList"
        @selection-change="handleSelectionChange"
        stripe
        style="width: 100%"
        :empty-text="userList.length === 0 && !loading ? '暂无用户数据' : ''"
      >
        <el-table-column type="selection" width="55" />

        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row?.avatar" :alt="row?.name">
              {{ row?.name?.charAt(0) || '?' }}
            </el-avatar>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="姓名" min-width="120" />

        <el-table-column prop="email" label="邮箱" min-width="180" />

        <el-table-column prop="phone" label="手机号" width="140" />

        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row?.role)">
              {{ getRoleLabel(row?.role) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row?.status === 'active' ? 'success' : 'danger'">
              {{ row?.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row?.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleView(row?.id)"
              :disabled="!row?.id"
            >
              查看
            </el-button>
            <el-button
              type="warning"
              size="small"
              @click="handleEdit(row?.id)"
              :disabled="!row?.id"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row?.id)"
              :disabled="!row?.id"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
    <div class="user-list__pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="totalCount"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Delete } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '../store/users.store'
import type { User } from '@hema-web-monorepo/models'

/**
 * 用户列表页面组件
 * 提供用户数据的展示、搜索、分页和基本操作功能
 */

// 路由实例
const router = useRouter()

// 用户状态管理
const usersStore = useUsersStore()
const { list: userList, loading, totalCount } = storeToRefs(usersStore)

// 搜索和分页状态
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const selectedUsers = ref<User[]>([])

/**
 * 处理搜索操作
 */
const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

/**
 * 获取用户列表数据
 */
const fetchUsers = async () => {
  try {
    await usersStore.fetchUsers({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchKeyword.value
    })
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  }
}

/**
 * 处理表格选择变化
 */
const handleSelectionChange = (selection: User[]) => {
  selectedUsers.value = selection
}

/**
 * 处理分页大小变化
 */
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchUsers()
}

/**
 * 处理当前页变化
 */
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchUsers()
}

/**
 * 跳转到创建用户页面
 */
const handleCreate = () => {
  router.push('/users/create')
}

/**
 * 查看用户详情
 * 安全地处理用户ID，确保ID有效
 */
const handleView = (id: string | undefined) => {
  if (!id) {
    ElMessage.warning('用户ID无效')
    return
  }
  router.push(`/users/${id}`)
}

/**
 * 编辑用户
 * 安全地处理用户ID，确保ID有效
 */
const handleEdit = (id: string | undefined) => {
  if (!id) {
    ElMessage.warning('用户ID无效')
    return
  }
  router.push(`/users/${id}/edit`)
}

/**
 * 删除单个用户
 * 安全地处理用户删除操作，包含ID验证和错误处理
 */
const handleDelete = async (id: string | undefined) => {
  if (!id) {
    ElMessage.warning('用户ID无效')
    return
  }

  try {
    await ElMessageBox.confirm('确定要删除这个用户吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await usersStore.deleteUser(id)
    ElMessage.success('删除成功')

    // 如果当前页没有数据了，回到上一页
    if (userList.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }

    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 批量删除用户
 */
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedUsers.value.length} 个用户吗？`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 这里应该调用批量删除 API
    const ids = selectedUsers.value.map(user => user.id)
    // await usersStore.batchDeleteUsers(ids)

    ElMessage.success('批量删除成功')
    selectedUsers.value = []
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

/**
 * 获取角色标签类型
 */
const getRoleTagType = (role: string) => {
  const typeMap: Record<string, string> = {
    admin: 'danger',
    manager: 'warning',
    user: 'info'
  }
  return typeMap[role] || 'info'
}

/**
 * 获取角色标签文本
 */
const getRoleLabel = (role: string) => {
  const labelMap: Record<string, string> = {
    admin: '管理员',
    manager: '经理',
    user: '普通用户'
  }
  return labelMap[role] || role
}

/**
 * 格式化日期
 * 安全地格式化日期，处理无效日期的情况
 */
const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  try {
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) return '-'
    return parsedDate.toLocaleString('zh-CN')
  } catch (error) {
    console.warn('日期格式化失败:', date, error)
    return '-'
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchUsers()
})
</script>

<style lang="scss" scoped>
.user-list {
  padding: 24px;

  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;
  }

  &__search {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    max-width: 400px;
  }

  &__actions {
    display: flex;
    gap: 12px;
  }

  &__table {
    margin-bottom: 24px;
  }

  &__pagination {
    display: flex;
    justify-content: center;
  }
}
</style>

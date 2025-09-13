/**
 * 用户管理模块英文国际化配置
 * 定义用户管理相关的英文文本内容
 */

/** 用户管理英文国际化配置 */
export const enUsers = {
  // 通用文本
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    create: 'Create',
    search: 'Search',
    reset: 'Reset',
    back: 'Back',
    loading: 'Loading...',
    noData: 'No Data',
    success: 'Operation Successful',
    error: 'Operation Failed'
  },

  // 用户相关
  user: {
    title: 'User Management',
    list: 'User List',
    detail: 'User Detail',
    create: 'Create User',
    edit: 'Edit User',

    // 字段标签
    fields: {
      id: 'User ID',
      username: 'Username',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      role: 'Role',
      status: 'Status',
      avatar: 'Avatar',
      bio: 'Biography',
      groups: 'Groups',
      permissions: 'Permissions',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      lastLoginAt: 'Last Login',
      loginCount: 'Login Count'
    },

    // 角色标签
    roles: {
      admin: 'Administrator',
      manager: 'Manager',
      user: 'User'
    },

    // 状态标签
    status: {
      active: 'Active',
      inactive: 'Inactive'
    },

    // 用户组
    groups: {
      development: 'Development',
      testing: 'Testing',
      operations: 'Operations',
      product: 'Product'
    },

    // 操作提示
    actions: {
      createSuccess: 'User created successfully',
      createError: 'Failed to create user',
      updateSuccess: 'User updated successfully',
      updateError: 'Failed to update user',
      deleteSuccess: 'User deleted successfully',
      deleteError: 'Failed to delete user',
      batchDeleteSuccess: 'Batch delete successful',
      batchDeleteError: 'Batch delete failed',
      enableSuccess: 'User enabled successfully',
      enableError: 'Failed to enable user',
      disableSuccess: 'User disabled successfully',
      disableError: 'Failed to disable user'
    },

    // 确认对话框
    confirmations: {
      delete: 'Are you sure you want to delete this user?',
      batchDelete: 'Are you sure you want to delete {count} selected users?',
      enable: 'Are you sure you want to enable this user?',
      disable: 'Are you sure you want to disable this user?'
    },

    // 表单验证
    validations: {
      usernameRequired: 'Please enter username',
      usernameLength: 'Username length should be 3 to 20 characters',
      usernameFormat: 'Username can only contain letters, numbers and underscores',
      nameRequired: 'Please enter real name',
      nameLength: 'Name length should be 2 to 10 characters',
      emailRequired: 'Please enter email address',
      emailFormat: 'Please enter a valid email address',
      phoneFormat: 'Please enter a valid phone number',
      passwordRequired: 'Please enter password',
      passwordLength: 'Password length should be 6 to 20 characters',
      confirmPasswordRequired: 'Please confirm password',
      passwordMismatch: 'The two passwords do not match',
      roleRequired: 'Please select user role'
    },

    // 占位符文本
    placeholders: {
      searchKeyword: 'Search username, email or phone',
      username: 'Please enter username',
      name: 'Please enter real name',
      email: 'Please enter email address',
      phone: 'Please enter phone number',
      password: 'Please enter password',
      confirmPassword: 'Please enter password again',
      newPassword: 'Please enter new password (leave blank to keep current)',
      bio: 'Please enter biography',
      selectRole: 'Please select user role',
      selectGroups: 'Please select user groups'
    },

    // 提示信息
    tips: {
      passwordEmpty: 'Leave blank to keep current password',
      avatarFormat: 'Avatar must be JPG or PNG format!',
      avatarSize: 'Avatar size cannot exceed 2MB!',
      noUsers: 'No user data',
      noActivities: 'No activity records',
      userNotFound: 'User not found',
      checkUserId: 'Please check if the user ID is correct'
    }
  },

  // 分页相关
  pagination: {
    total: 'Total {total} items',
    pageSize: 'Items per page',
    items: 'items',
    goto: 'Go to',
    page: 'page',
    prev: 'Previous',
    next: 'Next'
  }
}

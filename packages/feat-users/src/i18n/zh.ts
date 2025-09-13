/**
 * 用户管理模块中文国际化配置
 * 定义用户管理相关的中文文本内容
 */

/** 用户管理中文国际化配置 */
export const zhUsers = {
  // 通用文本
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    view: '查看',
    create: '创建',
    search: '搜索',
    reset: '重置',
    back: '返回',
    loading: '加载中...',
    noData: '暂无数据',
    success: '操作成功',
    error: '操作失败'
  },

  // 用户相关
  user: {
    title: '用户管理',
    list: '用户列表',
    detail: '用户详情',
    create: '创建用户',
    edit: '编辑用户',

    // 字段标签
    fields: {
      id: '用户ID',
      username: '用户名',
      name: '姓名',
      email: '邮箱',
      phone: '手机号',
      password: '密码',
      confirmPassword: '确认密码',
      role: '角色',
      status: '状态',
      avatar: '头像',
      bio: '个人简介',
      groups: '用户组',
      permissions: '权限',
      createdAt: '创建时间',
      updatedAt: '更新时间',
      lastLoginAt: '最后登录',
      loginCount: '登录次数'
    },

    // 角色标签
    roles: {
      admin: '管理员',
      manager: '经理',
      user: '普通用户'
    },

    // 状态标签
    status: {
      active: '正常',
      inactive: '禁用'
    },

    // 用户组
    groups: {
      development: '开发组',
      testing: '测试组',
      operations: '运维组',
      product: '产品组'
    },

    // 操作提示
    actions: {
      createSuccess: '用户创建成功',
      createError: '用户创建失败',
      updateSuccess: '用户更新成功',
      updateError: '用户更新失败',
      deleteSuccess: '用户删除成功',
      deleteError: '用户删除失败',
      batchDeleteSuccess: '批量删除成功',
      batchDeleteError: '批量删除失败',
      enableSuccess: '用户启用成功',
      enableError: '用户启用失败',
      disableSuccess: '用户禁用成功',
      disableError: '用户禁用失败'
    },

    // 确认对话框
    confirmations: {
      delete: '确定要删除这个用户吗？',
      batchDelete: '确定要删除选中的 {count} 个用户吗？',
      enable: '确定要启用这个用户吗？',
      disable: '确定要禁用这个用户吗？'
    },

    // 表单验证
    validations: {
      usernameRequired: '请输入用户名',
      usernameLength: '用户名长度在 3 到 20 个字符',
      usernameFormat: '用户名只能包含字母、数字和下划线',
      nameRequired: '请输入真实姓名',
      nameLength: '姓名长度在 2 到 10 个字符',
      emailRequired: '请输入邮箱地址',
      emailFormat: '请输入正确的邮箱地址',
      phoneFormat: '请输入正确的手机号码',
      passwordRequired: '请输入密码',
      passwordLength: '密码长度在 6 到 20 个字符',
      confirmPasswordRequired: '请确认密码',
      passwordMismatch: '两次输入的密码不一致',
      roleRequired: '请选择用户角色'
    },

    // 占位符文本
    placeholders: {
      searchKeyword: '搜索用户名、邮箱或手机号',
      username: '请输入用户名',
      name: '请输入真实姓名',
      email: '请输入邮箱地址',
      phone: '请输入手机号码',
      password: '请输入密码',
      confirmPassword: '请再次输入密码',
      newPassword: '请输入新密码（留空不修改）',
      bio: '请输入个人简介',
      selectRole: '请选择用户角色',
      selectGroups: '请选择用户组'
    },

    // 提示信息
    tips: {
      passwordEmpty: '留空则不修改密码',
      avatarFormat: '头像只能是 JPG 或 PNG 格式!',
      avatarSize: '头像大小不能超过 2MB!',
      noUsers: '暂无用户数据',
      noActivities: '暂无活动记录',
      userNotFound: '用户不存在',
      checkUserId: '请检查用户ID是否正确'
    }
  },

  // 分页相关
  pagination: {
    total: '共 {total} 条',
    pageSize: '每页显示',
    items: '条',
    goto: '前往',
    page: '页',
    prev: '上一页',
    next: '下一页'
  }
}

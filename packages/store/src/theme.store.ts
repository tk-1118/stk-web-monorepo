/**
 * 主题状态管理
 * 管理应用的明暗主题切换状态
 */
import { defineStore } from 'pinia'

/** 主题状态管理 Store */
export const useThemeStore = defineStore('theme', {
  state: () => ({
    /** 是否为暗黑主题 */
    isDark: (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) ?? false
  }),

  actions: {
    /** 切换主题 */
    toggle() {
      this.isDark = !this.isDark
    },

    /** 初始化主题设置 */
    init() {
      // 可以在这里添加从本地存储读取主题设置的逻辑
    }
  }
})

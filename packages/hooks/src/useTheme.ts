/**
 * 主题管理 Hook
 * 封装主题切换相关逻辑
 */
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../store/dist/index.js'

/** 主题管理 Hook */
export function useTheme() {
  const store = useThemeStore()
  const { isDark } = storeToRefs(store)

  return {
    /** 是否为暗黑主题 */
    isDark,
    /** 切换主题 */
    toggle: () => store.toggle(),
    /** 初始化主题 */
    init: () => store.init()
  }
}

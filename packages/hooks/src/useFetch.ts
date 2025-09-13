/**
 * 数据获取 Hook
 * 封装异步数据请求的通用逻辑
 */
import { ref } from 'vue'

/** 数据获取 Hook */
export function useFetch<T>(fn: () => Promise<T>) {
  /** 响应数据 */
  const data = ref<T | null>(null)
  /** 加载状态 */
  const loading = ref<boolean>(false)
  /** 错误信息 */
  const error = ref<any>(null)

  /** 执行请求 */
  const run = async (): Promise<T | null> => {
    loading.value = true
    error.value = null
    try {
      const result = await fn()
      data.value = result
      return result
    }
    catch (e) {
      error.value = e
      throw e
    }
    finally {
      loading.value = false
    }
  }

  return {
    data: data as any,
    loading: loading as any,
    error: error as any,
    run
  }
}

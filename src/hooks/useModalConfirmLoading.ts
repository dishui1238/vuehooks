import { ref } from 'vue'

export function useModalConfirmLoading() {
  const confirmLoading = ref(false)
  const withLoading = (func: ()=> Promise<void>) => async () => {
    try {
      confirmLoading.value = true
      await func()
    } finally {
      confirmLoading.value = false
    }
  }
  return {
    confirmLoading, withLoading,
  }
}

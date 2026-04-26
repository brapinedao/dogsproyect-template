import { ref } from 'vue'

const isLoading = ref(false)

export function useMainLoader() {
  function openMainLoader(value: boolean): void {
    isLoading.value = value
  }

  return { isLoading, openMainLoader }
}

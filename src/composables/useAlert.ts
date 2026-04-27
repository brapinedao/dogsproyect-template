import { ref } from 'vue'

const alert = ref<{ type: 'positive' | 'negative'; message: string } | null>(null)

export function useAlert() {
  function showPositive(message: string) {
    alert.value = { type: 'positive', message }
    setTimeout(() => (alert.value = null), 3000)
  }
  function showNegative(message: string) {
    alert.value = { type: 'negative', message }
    setTimeout(() => (alert.value = null), 3000)
  }
  return { alert, showPositive, showNegative }
}

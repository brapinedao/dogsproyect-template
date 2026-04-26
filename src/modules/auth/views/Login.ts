import { ref } from 'vue'
import router from '@/router'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'

function useLogin() {
  const authStore = useAuthStore()

  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const errorMessage = ref('')

  async function onSubmit(): Promise<void> {
    loading.value = true
    errorMessage.value = ''

    const success = await authStore._login({
      email: email.value,
      password: password.value,
    })

    loading.value = false

    if (success) {
      await router.push({ name: 'pets-list' })
    } else {
      errorMessage.value = 'Credenciales inválidas. Por favor, intenta de nuevo.'
    }
  }

  return { email, password, loading, errorMessage, onSubmit }
}

export default useLogin()

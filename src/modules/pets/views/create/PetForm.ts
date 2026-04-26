import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePetsStore } from '@/modules/pets/store/usePetsStore'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { useMainLoader } from '@/composables/useMainLoader'

function usePetForm() {
  const router = useRouter()
  const petsStore = usePetsStore()
  const authStore = useAuthStore()
  const { openMainLoader } = useMainLoader()

  const name = ref('')
  const breed = ref('')
  const dateOfBirth = ref('')
  const loading = ref(false)
  const errorMessage = ref('')

  async function onSubmit(): Promise<void> {
    errorMessage.value = ''
    loading.value = true
    openMainLoader(true)

    const success = await petsStore._createPet({
      name: name.value,
      breed: breed.value,
      dateOfBirth: `${dateOfBirth.value}T00:00:00.000Z`,
      ownerId: authStore.user!.id,
    })

    loading.value = false
    openMainLoader(false)

    if (success) {
      await router.push({ name: 'pets-list' })
    } else {
      errorMessage.value = 'No se pudo registrar la mascota. Intenta de nuevo.'
    }
  }

  function goBack(): void {
    router.push({ name: 'pets-list' })
  }

  return { name, breed, dateOfBirth, loading, errorMessage, onSubmit, goBack }
}

export default usePetForm

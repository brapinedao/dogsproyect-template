import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePetsStore } from '@/modules/pets/store/usePetsStore'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { useMainLoader } from '@/composables/useMainLoader'

function usePetEdit() {
  const route = useRoute()
  const router = useRouter()
  const petsStore = usePetsStore()
  const authStore = useAuthStore()
  const { openMainLoader } = useMainLoader()

  const name = ref('')
  const breed = ref('')
  const dateOfBirth = ref('')
  const loading = ref(false)
  const fetching = ref(true)
  const errorMessage = ref('')

  onMounted(async () => {
    fetching.value = true
    const petId = Number(route.params['id'])
    const result = await petsStore._getPetById(petId)
    fetching.value = false

    if (result) {
      name.value = result.name
      breed.value = result.breed
      dateOfBirth.value = result.dateOfBirth.split('T')[0] ?? ''
    }
  })

  async function onSubmit(): Promise<void> {
    errorMessage.value = ''
    loading.value = true
    openMainLoader(true)

    const petId = Number(route.params['id'])
    const success = await petsStore._updatePet(petId, {
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
      errorMessage.value = 'No se pudo actualizar la mascota. Intenta de nuevo.'
    }
  }

  function goBack(): void {
    router.push({ name: 'pets-list' })
  }

  return { name, breed, dateOfBirth, loading, fetching, errorMessage, onSubmit, goBack }
}

export default usePetEdit

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePetsStore } from '@/modules/pets/store/usePetsStore'
import type { Pet } from '@/modules/pets/store/usePetsStore'
import { useMainLoader } from '@/composables/useMainLoader'

function usePetDetail() {
  const route = useRoute()
  const router = useRouter()
  const petsStore = usePetsStore()
  const { openMainLoader } = useMainLoader()

  const pet = ref<Pet | null>(null)
  const loading = ref(false)

  async function _load(): Promise<void> {
    loading.value = true
    openMainLoader(true)
    const id = Number(route.params.id)
    const result = await petsStore._getPetById(id)
    pet.value = result || null
    loading.value = false
    openMainLoader(false)
  }

  function goBack(): void {
    router.push({ name: 'pets-list' })
  }

  onMounted(_load)

  return { pet, loading, goBack }
}

export default usePetDetail

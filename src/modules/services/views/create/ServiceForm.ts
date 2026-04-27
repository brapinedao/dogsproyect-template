import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useServicesStore } from '@/modules/services/store/useServicesStore'
import { useMainLoader } from '@/composables/useMainLoader'

const CATEGORY_OPTIONS = [
  { label: 'Salud', value: 0 },
  { label: 'Estética', value: 1 },
  { label: 'Nutrición', value: 2 },
  { label: 'Guardería', value: 3 },
  { label: 'Servicios Funerarios', value: 4 },
]

const CATEGORY_ROUTE_MAP: Record<string, number> = {
  Health: 0,
  Aesthetics: 1,
  Nutrition: 2,
  Daycare: 3,
  Funeral: 4,
}

function useServiceForm() {
  const router = useRouter()
  const route = useRoute()
  const servicesStore = useServicesStore()
  const { openMainLoader } = useMainLoader()

  const routeCategory = route.query['category'] as string | undefined
  const defaultCategory =
    routeCategory !== undefined && CATEGORY_ROUTE_MAP[routeCategory] !== undefined
      ? CATEGORY_ROUTE_MAP[routeCategory]
      : null

  const name = ref('')
  const category = ref<number | null>(defaultCategory)
  const cost = ref('')
  const durationInMinutes = ref('')
  const loading = ref(false)
  const errorMessage = ref('')

  async function onSubmit(): Promise<void> {
    errorMessage.value = ''
    if (
      category.value === null ||
      !cost.value ||
      isNaN(Number(cost.value)) ||
      !durationInMinutes.value ||
      isNaN(Number(durationInMinutes.value))
    ) {
      errorMessage.value = 'Por favor completa todos los campos.'
      return
    }
    loading.value = true
    openMainLoader(true)

    const success = await servicesStore._createService({
      name: name.value,
      category: category.value,
      cost: Number(cost.value),
      durationInMinutes: Number(durationInMinutes.value),
    })

    loading.value = false
    openMainLoader(false)

    if (success) {
      const backQuery = routeCategory ? `?category=${routeCategory}` : ''
      await router.push(`/services${backQuery}`)
    } else {
      errorMessage.value = 'No se pudo registrar el servicio. Intenta de nuevo.'
    }
  }

  function goBack(): void {
    const backQuery = routeCategory ? `?category=${routeCategory}` : ''
    router.push(`/services${backQuery}`)
  }

  return {
    name,
    category,
    cost,
    durationInMinutes,
    loading,
    errorMessage,
    categoryOptions: CATEGORY_OPTIONS,
    onSubmit,
    goBack,
  }
}

export default useServiceForm

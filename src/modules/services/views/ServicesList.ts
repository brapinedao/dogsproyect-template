import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServicesStore } from '@/modules/services/store/useServicesStore'
import type { Service } from '@/modules/services/store/useServicesStore'
import { useMainLoader } from '@/composables/useMainLoader'
import type { QTableColumn } from 'quasar'

const CATEGORY_ID_MAP: Record<string, number> = {
  Health: 0,
  Aesthetics: 1,
  Nutrition: 2,
  Daycare: 3,
  Funeral: 4,
}

const CATEGORY_ID_LABELS: Record<number, string> = {
  0: 'Salud',
  1: 'Estética',
  2: 'Nutrición',
  3: 'Guardería',
  4: 'Servicios Funerarios',
}

const CATEGORY_ROUTE_LABELS: Record<string, string> = {
  Health: 'Salud',
  Aesthetics: 'Estética',
  Nutrition: 'Nutrición',
  Daycare: 'Guardería',
  Funeral: 'Servicios Funerarios',
}

export function getCategoryLabel(category: number): string {
  return CATEGORY_ID_LABELS[category] ?? 'Sin categoría'
}

export function formatCurrency(value: number): string {
  return '$' + new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value)
}

const CATEGORY_COLORS: Record<number, string> = {
  0: 'red-6',
  1: 'purple-5',
  2: 'green-6',
  3: 'orange-6',
  4: 'grey-7',
}

function categoryColor(cat: number): string {
  return CATEGORY_COLORS[cat] ?? 'grey-5'
}
function useServicesList() {
  const route = useRoute()
  const router = useRouter()
  const servicesStore = useServicesStore()
  const { openMainLoader } = useMainLoader()

  const allRows = ref<Service[]>([])
  const rows = ref<Service[]>([])
  const loading = ref(false)

  const rowsPerPage = ref(5)
  const page = ref(1)

  const totalRows = computed(() => rows.value.length)
  const pagesCount = computed(() => Math.max(1, Math.ceil(totalRows.value / rowsPerPage.value)))
  const rangeStart = computed(() =>
    totalRows.value === 0 ? 0 : (page.value - 1) * rowsPerPage.value + 1,
  )
  const rangeEnd = computed(() => Math.min(page.value * rowsPerPage.value, totalRows.value))
  const pagedRows = computed(() =>
    rows.value.slice((page.value - 1) * rowsPerPage.value, page.value * rowsPerPage.value),
  )

  const changeRowsPerPage = (val: number) => {
    rowsPerPage.value = val
    page.value = 1
  }

  const columns: QTableColumn[] = [
    { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
    { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
    { name: 'category', label: 'Categoría', field: 'category', align: 'left', sortable: true },
    { name: 'cost', label: 'Precio', field: 'cost', align: 'right', sortable: true },
    {
      name: 'durationInMinutes',
      label: 'Duración (min)',
      field: 'durationInMinutes',
      align: 'center',
      sortable: true,
    },
  ]

  const tableProps = { rows, loading, columns }

  const categoryLabel = computed<string>(() => {
    const cat = route.query['category'] as string | undefined
    return cat ? (CATEGORY_ROUTE_LABELS[cat] ?? 'Servicios') : 'Todos los Servicios'
  })

  function applyFilter(): void {
    const cat = route.query['category'] as string | undefined
    if (!cat) {
      rows.value = allRows.value
      return
    }
    const catId = CATEGORY_ID_MAP[cat]
    rows.value =
      catId !== undefined ? allRows.value.filter((s) => s.category === catId) : allRows.value
    page.value = 1
  }

  async function _getResources(): Promise<void> {
    openMainLoader(true)
    loading.value = true
    await servicesStore._getServices()
    allRows.value = servicesStore.services
    applyFilter()
    loading.value = false
    openMainLoader(false)
  }

  function goToCreate(): void {
    const cat = route.query['category'] as string | undefined
    const query = cat ? `?category=${cat}` : ''
    router.push(`/services/new${query}`)
  }

  onMounted(_getResources)

  watch(() => route.query['category'], applyFilter)

  onBeforeUnmount(() => {
    servicesStore._resetKeys()
  })

  return {
    tableProps,
    categoryLabel,
    rowsPerPage,
    page,
    totalRows,
    pagesCount,
    rangeStart,
    rangeEnd,
    pagedRows,

    categoryColor,
    changeRowsPerPage,
    goToCreate,
  }
}

export default useServicesList

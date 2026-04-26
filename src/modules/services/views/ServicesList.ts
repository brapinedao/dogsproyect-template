import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useServicesStore } from '@/modules/services/store/useServicesStore'
import type { Service } from '@/modules/services/store/useServicesStore'
import { useMainLoader } from '@/composables/useMainLoader'
import type { QTableColumn } from 'quasar'

const CATEGORY_ID_MAP: Record<string, number> = {
  Health: 1,
  Aesthetics: 2,
  Nutrition: 3,
  Daycare: 4,
  Funeral: 5,
}

const CATEGORY_ID_LABELS: Record<number, string> = {
  1: 'Salud',
  2: 'Estética',
  3: 'Nutrición',
  4: 'Guardería',
  5: 'Servicios Funerarios',
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
  1: 'red-6',
  2: 'purple-5',
  3: 'green-6',
  4: 'orange-6',
  5: 'grey-7',
}

function categoryColor(cat: number): string {
  return CATEGORY_COLORS[cat] ?? 'grey-5'
}
function useServicesList() {
  const route = useRoute()
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
  }
}

export default useServicesList

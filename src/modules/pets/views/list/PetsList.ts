import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { usePetsStore } from '@/modules/pets/store/usePetsStore'
import type { Pet } from '@/modules/pets/store/usePetsStore'
import { useMainLoader } from '@/composables/useMainLoader'
import type { QTableColumn } from 'quasar'

function usePetsList() {
  const petsStore = usePetsStore()
  const { openMainLoader } = useMainLoader()

  const rows = ref<Pet[]>([])
  const loading = ref(false)

  const columns: QTableColumn[] = [
    { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
    { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
    { name: 'breed', label: 'Raza', field: 'breed', align: 'left', sortable: true },
    {
      name: 'dateOfBirth',
      label: 'Fecha de nacimiento',
      field: 'dateOfBirth',
      align: 'center',
      sortable: true,
    },
    {
      name: 'ownerFullName',
      label: 'Propietario',
      field: 'ownerFullName',
      align: 'left',
      sortable: true,
    },
    { name: 'actions', label: 'Acciones', field: 'actions', align: 'center', sortable: false },
  ]

  const tableProps = { rows, loading, columns }

  const rowsPerPage = ref(5)
  const page = ref(1)

  const totalRows = computed(() => tableProps.rows.value.length)
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

  const _getResources = async (): Promise<void> => {
    openMainLoader(true)
    loading.value = true

    await petsStore._getPets()
    rows.value = petsStore.pets

    loading.value = false
    openMainLoader(false)
  }

  onMounted(async () => {
    await _getResources()
  })

  const deleteTarget = ref<number | null>(null)
  const deleteLoading = ref(false)

  const confirmDelete = (id: number): void => {
    deleteTarget.value = id
  }

  const cancelDelete = (): void => {
    deleteTarget.value = null
  }

  const executeDelete = async (): Promise<void> => {
    if (deleteTarget.value === null) return
    deleteLoading.value = true
    openMainLoader(true)
    const success = await petsStore._deletePet(deleteTarget.value)
    deleteLoading.value = false
    openMainLoader(false)
    deleteTarget.value = null
    if (success) await _getResources()
  }

  onBeforeUnmount(() => {
    petsStore._resetKeys()
  })

  return {
    tableProps,
    rowsPerPage,
    page,
    totalRows,
    pagesCount,
    rangeStart,
    rangeEnd,
    pagedRows,
    changeRowsPerPage,
    deleteTarget,
    deleteLoading,
    confirmDelete,
    cancelDelete,
    executeDelete,
  }
}

export default usePetsList

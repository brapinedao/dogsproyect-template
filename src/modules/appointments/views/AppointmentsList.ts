import { useRouter } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAppointmentsStore } from '@/modules/appointments/store/useAppointmentsStore'
import type { Appointment } from '@/modules/appointments/store/useAppointmentsStore'
import { usePetsStore } from '@/modules/pets/store/usePetsStore'
import { useServicesStore } from '@/modules/services/store/useServicesStore'
import { useMainLoader } from '@/composables/useMainLoader'
import type { QTableColumn } from 'quasar'

const STATUS_LABELS: Record<string, string> = {
  Pending: 'Pendiente',
  Confirmed: 'Confirmada',
  Completed: 'Completada',
  Cancelled: 'Cancelada',
}

const STATUS_COLORS: Record<string, string> = {
  Pending: 'orange-6',
  Confirmed: 'blue-6',
  Completed: 'positive',
  Cancelled: 'negative',
}

export function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status
}

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? 'grey-5'
}

export function formatDateTime(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const date = d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  return `${date} ${time}`
}

function useAppointmentsList() {
  const router = useRouter()
  function goToMedicalRecord(petId: number, appointmentId: number) {
    router.push({ path: `/medical-records/${petId}`, query: { appointmentId } })
  }
  const appointmentsStore = useAppointmentsStore()
  const petsStore = usePetsStore()
  const servicesStore = useServicesStore()
  const { openMainLoader } = useMainLoader()

  // ── Table ──────────────────────────────────────────────────
  const rows = ref<Appointment[]>([])
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
    { name: 'petName', label: 'Mascota', field: 'petName', align: 'left', sortable: true },
    { name: 'serviceName', label: 'Servicio', field: 'serviceName', align: 'left', sortable: true },
    {
      name: 'scheduledDate',
      label: 'Fecha',
      field: 'scheduledDate',
      align: 'center',
      sortable: true,
    },
    { name: 'status', label: 'Estado', field: 'status', align: 'center', sortable: true },
    { name: 'actions', label: 'Acciones', field: 'actions', align: 'center', sortable: false },
  ]

  const tableProps = { rows, loading, columns }

  // ── Dialog ─────────────────────────────────────────────────
  const showDialog = ref(false)
  const dialogMode = ref<'create' | 'edit'>('create')
  const formLoading = ref(false)
  const formError = ref('')
  const editingId = ref<number | null>(null)

  const formPetId = ref<number | null>(null)
  const formServiceId = ref<number | null>(null)
  const formDate = ref('')
  const formStatus = ref('Pending')

  const petOptions = computed(() => petsStore.pets.map((p) => ({ label: p.name, value: p.id })))

  const serviceOptions = computed(() =>
    servicesStore.services.map((s) => ({ label: s.name, value: s.id })),
  )

  function openDialog(): void {
    dialogMode.value = 'create'
    editingId.value = null
    formPetId.value = null
    formServiceId.value = null
    formDate.value = ''
    formStatus.value = 'Pending'
    formError.value = ''
    showDialog.value = true
  }

  async function handleEdit(row: Appointment): Promise<void> {
    dialogMode.value = 'edit'
    editingId.value = row.id
    formDate.value = row.scheduledDate ? row.scheduledDate.slice(0, 16) : ''
    formStatus.value = row.status
    formPetId.value = petsStore.pets.find((p) => p.name === row.petName)?.id ?? null
    formServiceId.value = servicesStore.services.find((s) => s.name === row.serviceName)?.id ?? null
    formError.value = ''
    showDialog.value = true
  }

  async function onSubmit(): Promise<void> {
    if (!formPetId.value || !formServiceId.value || !formDate.value) {
      formError.value = 'Todos los campos son obligatorios.'
      return
    }
    formError.value = ''
    formLoading.value = true
    openMainLoader(true)

    let success: boolean

    if (dialogMode.value === 'edit' && editingId.value !== null) {
      success = await appointmentsStore._updateAppointment(editingId.value, {
        scheduledDate: new Date(formDate.value).toISOString(),
        petId: formPetId.value,
        serviceId: formServiceId.value,
      })
    } else {
      success = await appointmentsStore._createAppointment({
        scheduledDate: new Date(formDate.value).toISOString(),
        status: formStatus.value,
        petId: formPetId.value,
        serviceId: formServiceId.value,
      })
    }

    formLoading.value = false
    openMainLoader(false)

    if (success) {
      showDialog.value = false
      await _getResources()
    } else {
      formError.value = 'No se pudo guardar la cita. Intenta de nuevo.'
    }
  }

  // ── Delete ─────────────────────────────────────────────────
  const deleteTarget = ref<number | null>(null)
  const deleteLoading = ref(false)

  const confirmDelete = (id: number) => {
    deleteTarget.value = id
  }
  const cancelDelete = () => {
    deleteTarget.value = null
  }

  const executeDelete = async (): Promise<void> => {
    if (deleteTarget.value === null) return
    deleteLoading.value = true
    openMainLoader(true)
    await appointmentsStore._deleteAppointment(deleteTarget.value)
    deleteLoading.value = false
    openMainLoader(false)
    deleteTarget.value = null
    await _getResources()
  }

  // ── Status actions ─────────────────────────────────────────
  const statusActionLoading = ref<number | null>(null)
  const completedNotice = ref(false)

  async function handleCancelAppointment(id: number): Promise<void> {
    statusActionLoading.value = id
    openMainLoader(true)
    await appointmentsStore._patchStatus(id, 'Cancelled')
    openMainLoader(false)
    statusActionLoading.value = null
    await _getResources()
  }

  async function handleComplete(id: number): Promise<void> {
    statusActionLoading.value = id
    openMainLoader(true)
    const ok = await appointmentsStore._patchStatus(id, 'Completed')
    openMainLoader(false)
    statusActionLoading.value = null
    if (ok) {
      completedNotice.value = true
      await _getResources()
    }
  }

  // ── Resources ──────────────────────────────────────────────
  async function _getResources(): Promise<void> {
    openMainLoader(true)
    loading.value = true
    await Promise.all([
      appointmentsStore._getAppointments(),
      petsStore._getAllPets(),
      servicesStore._getServices(),
    ])
    rows.value = appointmentsStore.appointments
    loading.value = false
    openMainLoader(false)
  }

  onMounted(_getResources)

  onBeforeUnmount(() => {
    appointmentsStore._resetKeys()
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
    showDialog,
    dialogMode,
    formLoading,
    formError,
    formPetId,
    formServiceId,
    formDate,
    formStatus,
    petOptions,
    serviceOptions,
    openDialog,
    handleEdit,
    onSubmit,
    deleteTarget,
    deleteLoading,
    confirmDelete,
    cancelDelete,
    executeDelete,
    statusActionLoading,
    completedNotice,
    handleCancelAppointment,
    handleComplete,
    goToMedicalRecord,
  }
}

export default useAppointmentsList

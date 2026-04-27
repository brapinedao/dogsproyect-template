import { computed, onMounted, onBeforeUnmount } from 'vue'
import { usePetsStore } from '../../pets/store/usePetsStore'
import { useServicesStore } from '../../services/store/useServicesStore'
import { useAppointmentsStore } from '../../appointments/store/useAppointmentsStore'
import { useMainLoader } from '@/composables/useMainLoader'

function useDashboard() {
  const petsStore = usePetsStore()
  const servicesStore = useServicesStore()
  const appointmentsStore = useAppointmentsStore()
  const { openMainLoader, isLoading } = useMainLoader()

  const _getResources = async () => {
    openMainLoader(true)
    await Promise.all([
      petsStore._getPets(),
      servicesStore._getServices(),
      appointmentsStore._getAppointments(),
    ])
    openMainLoader(false)
  }

  onMounted(_getResources)

  onBeforeUnmount(() => {
    petsStore._resetKeys()
    servicesStore._resetKeys()
    appointmentsStore._resetKeys()
  })

  const totalPets = computed(() => petsStore.pets.length)
  const totalServices = computed(() => servicesStore.services.length)

  const today = new Date().toISOString().split('T')[0]
  const appointmentsToday = computed(
    () =>
      appointmentsStore.appointments.filter((a) => a.scheduledDate.split('T')[0] === today).length,
  )

  const pendingAppointments = computed(
    () => appointmentsStore.appointments.filter((a) => a.status === 'Scheduled').length,
  )

  // Chart data for appointments by status
  const appointmentsByStatus = computed(() => {
    const statusCount: Record<'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled', number> = {
      Scheduled: 0,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
    }
    appointmentsStore.appointments.forEach((a) => {
      if (a.status in statusCount) statusCount[a.status as keyof typeof statusCount]++
    })
    return statusCount
  })

  // Chart data for services by category
  const servicesByCategory = computed(() => {
    const categories = ['Salud', 'Estética', 'Nutrición', 'Guardería', 'Funerarios']
    const counts = [0, 0, 0, 0, 0]
    servicesStore.services.forEach((s) => {
      if (typeof s.category === 'number' && s.category >= 0 && s.category < counts.length)
        counts[s.category]!++
    })
    return categories.map((label, i) => ({ label, value: counts[i] }))
  })

  const recentAppointments = computed(() =>
    [...appointmentsStore.appointments]
      .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
      .slice(0, 5),
  )

  return {
    totalPets,
    totalServices,
    appointmentsToday,
    pendingAppointments,
    appointmentsByStatus,
    servicesByCategory,
    recentAppointments,
    _getResources,
    isLoading,
  }
}

export default useDashboard

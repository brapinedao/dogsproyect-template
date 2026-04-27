<template>
  <div class="dashboard pawcontrol-bg q-pa-md">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-3" v-for="card in summaryCards" :key="card.label">
        <q-card class="dashboard-card" flat bordered>
          <div class="q-pa-md flex flex-center column items-center">
            <q-avatar :color="card.color" size="48px" class="q-mb-sm shadow-2">
              <component :is="card.icon" :size="28" />
            </q-avatar>
            <div class="dashboard-value text-dark">{{ card.value }}</div>
            <div class="dashboard-label text-grey-7">{{ card.label }}</div>
          </div>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <div class="q-pa-md">
            <div class="text-h6 q-mb-sm">Actividad Reciente</div>
            <q-list separator>
              <q-item v-for="a in recentAppointments" :key="a.id">
                <q-item-section>
                  <div class="text-weight-bold text-dark">{{ a.petName }}</div>
                  <div class="text-caption text-grey-8">{{ a.scheduledDate.split('T')[0] }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-badge
                    :color="statusColor(a.status)"
                    :label="a.status"
                    rounded
                    class="text-white"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <div class="q-pa-md">
            <div class="text-h6 q-mb-sm">Servicios por Categoría</div>
            <div v-for="cat in servicesByCategory" :key="cat.label" class="q-mb-sm">
              <div class="row items-center">
                <div class="col-4">{{ cat.label }}</div>
                <div class="col-8">
                  <q-linear-progress
                    :value="(cat.value ?? 0) / maxCategoryValue"
                    color="primary"
                    track-color="grey-3"
                    rounded
                    class="q-mt-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card flat bordered>
          <div class="q-pa-md">
            <div class="text-h6 q-mb-sm">Citas por Estado</div>
            <div class="row items-center q-gutter-md">
              <div v-for="status in statusList" :key="status" class="col">
                <div class="text-subtitle2 q-mb-xs">{{ statusLabel(status) }}</div>
                <q-linear-progress
                  :value="
                    appointmentsByStatus[status as keyof typeof appointmentsByStatus] /
                    maxStatusValue
                  "
                  :color="statusColor(status)"
                  track-color="grey-3"
                  rounded
                  class="q-mt-xs"
                />
                <div class="text-caption">
                  {{ appointmentsByStatus[status as keyof typeof appointmentsByStatus] }}
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useDashboard from './Dashboard'
import { Dog, Calendar, Briefcase, Clock, LayoutDashboard } from 'lucide-vue-next'

const {
  totalPets,
  totalServices,
  appointmentsToday,
  pendingAppointments,
  appointmentsByStatus,
  servicesByCategory,
  recentAppointments,
} = useDashboard()

const summaryCards = [
  {
    label: 'Total Mascotas',
    value: totalPets,
    icon: Dog,
    color: 'deep-purple-4',
  },
  {
    label: 'Citas Hoy',
    value: appointmentsToday,
    icon: Calendar,
    color: 'indigo-6',
  },
  {
    label: 'Servicios Activos',
    value: totalServices,
    icon: Briefcase,
    color: 'primary',
  },
  {
    label: 'Citas Pendientes',
    value: pendingAppointments,
    icon: Clock,
    color: 'negative',
  },
]

const maxCategoryValue = computed(() => {
  // Asegura que todos los valores sean number
  return Math.max(...servicesByCategory.value.map((c) => c.value ?? 0), 1)
})
const maxStatusValue = computed(() => {
  return Math.max(...Object.values(appointmentsByStatus.value), 1)
})

const statusList = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled']

function statusLabel(status: string) {
  switch (status) {
    case 'Scheduled':
      return 'Pendiente'
    case 'Confirmed':
      return 'Confirmada'
    case 'Completed':
      return 'Completada'
    case 'Cancelled':
      return 'Cancelada'
    default:
      return status
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'Scheduled':
      return 'info' // Consistente con la vista de citas
    case 'Confirmed':
      return 'primary'
    case 'Completed':
      return 'positive'
    case 'Cancelled':
      return 'negative'
    default:
      return 'grey-6'
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
}
.dashboard-card {
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.08);
  background: #fff;
  color: #1b0f42;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
.dashboard-card:hover {
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.16);
  transform: translateY(-2px) scale(1.02);
}
.dashboard-value {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 2px;
}
.dashboard-label {
  font-size: 1.1rem;
  opacity: 0.7;
}
</style>

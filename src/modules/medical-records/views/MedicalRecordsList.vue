<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePetsStore } from '@/modules/pets/store/usePetsStore'
import { useMedicalRecordsStore } from '@/modules/medical-records/store/useMedicalRecordsStore'
import { PawPrint, ClipboardList } from 'lucide-vue-next'
import { useMainLoader } from '@/composables/useMainLoader'

const petsStore = usePetsStore()
const medicalRecordsStore = useMedicalRecordsStore()
const router = useRouter()
const { openMainLoader } = useMainLoader()
const loading = ref(false)

// Mapa petId -> última historia clínica
const lastRecords = ref<Record<number, { date?: string; notes?: string }>>({})

onMounted(async () => {
  loading.value = true
  openMainLoader(true)
  await petsStore._getPets()
  // Para cada mascota, consulta la última historia clínica
  const promises = petsStore.pets.map(async (pet) => {
    await medicalRecordsStore._getHistoryByPet(pet.id)
    const history = medicalRecordsStore.currentPetHistory
    if (history.length > 0) {
      // Tomar la última por fecha (o la última del array)
      const last = [...history].sort(
        (a, b) => new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime(),
      )[0]
      if (last) {
        lastRecords.value[pet.id] = { date: last.date, notes: last.notes }
      }
    }
  })
  await Promise.all(promises)
  loading.value = false
  openMainLoader(false)
})

function goToHistory(petId: number) {
  router.push(`/medical-records/${petId}`)
}
</script>

<template>
  <q-page class="q-pa-lg pawcontrol-bg">
    <q-card flat class="q-mb-lg q-pa-md flex row items-center header-card">
      <ClipboardList :size="28" class="text-primary q-mr-md" />
      <span class="text-h6 text-weight-bold">Historias Clínicas</span>
    </q-card>
    <q-card flat class="q-pa-md">
      <q-table
        :rows="petsStore.pets"
        :columns="[
          { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
          { name: 'breed', label: 'Raza', field: 'breed', align: 'left', sortable: true },
          {
            name: 'dateOfBirth',
            label: 'Nacimiento',
            field: 'dateOfBirth',
            align: 'center',
            sortable: true,
          },
          {
            name: 'lastRecordDate',
            label: 'Última historia',
            field: 'lastRecordDate',
            align: 'center',
          },
          {
            name: 'lastRecordNotes',
            label: 'Notas adicionales',
            field: 'lastRecordNotes',
            align: 'left',
          },
          { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
        ]"
        :loading="loading"
        row-key="id"
        flat
        hide-pagination
        no-data-label="No hay mascotas registradas"
        loading-label="Cargando mascotas..."
        class="pets-table"
      >
        <template #body-cell-dateOfBirth="props">
          <q-td :props="props" class="text-center">
            <span>{{ formatDate(props.row.dateOfBirth) }}</span>
          </q-td>
        </template>
        <template #body-cell-lastRecordDate="props">
          <q-td :props="props" class="text-center">
            <span>
              {{
                lastRecords[props.row.id]?.date
                  ? formatDate(lastRecords[props.row.id]?.date ?? '')
                  : '-'
              }}
            </span>
          </q-td>
        </template>
        <template #body-cell-lastRecordNotes="props">
          <q-td :props="props">
            <span>{{ lastRecords[props.row.id]?.notes || '-' }}</span>
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn color="primary" flat dense round size="sm" @click="goToHistory(props.row.id)">
              <ClipboardList :size="16" />
              <q-tooltip>Ver historia clínica</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script lang="ts">
function formatDate(date?: string | null): string {
  if (!date) return ''
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.pawcontrol-bg {
  background: #f4f6f9;
  min-height: 100%;
}
.header-card {
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
}
</style>

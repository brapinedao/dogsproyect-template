<script setup lang="ts">
import {
  CalendarDays,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Pencil,
  XCircle,
  CheckCircle,
  FilePlus,
  Trash2,
} from 'lucide-vue-next'
import useAppointmentsList, {
  getStatusLabel,
  getStatusColor,
  formatDateTime,
} from './AppointmentsList'

const {
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
} = useAppointmentsList()

const statusOptions = [
  { label: 'Pendiente', value: 'Pending' },
  { label: 'Confirmada', value: 'Confirmed' },
  { label: 'Completada', value: 'Completed' },
  { label: 'Cancelada', value: 'Cancelled' },
]
</script>

<template>
  <q-page class="q-pa-lg pawcontrol-bg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center no-wrap">
        <CalendarDays :size="24" class="text-primary q-mr-sm" />
        <span class="text-h6 text-weight-bold page-title">Agenda de Citas</span>
      </div>
      <q-btn unelevated color="primary" size="sm" style="border-radius: 8px" @click="openDialog">
        <Plus :size="16" class="q-mr-xs" />
        Nueva cita
      </q-btn>
    </div>

    <q-card flat class="appointments-card">
      <q-card-section class="row items-center q-pb-sm">
        <q-space />
        <q-input
          model-value=""
          dense
          outlined
          placeholder="Buscar cita..."
          class="col-3"
          bg-color="white"
          no-error-icon
        >
          <template #prepend><Search :size="15" class="text-grey-5" /></template>
        </q-input>
      </q-card-section>

      <q-separator />

      <q-table
        :rows="pagedRows"
        :columns="tableProps.columns"
        :loading="tableProps.loading.value"
        :pagination="{ rowsPerPage: 0 }"
        row-key="id"
        flat
        hide-pagination
        no-data-label="No hay citas registradas"
        loading-label="Cargando citas..."
        class="appointments-table"
      >
        <template #loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template #no-data="{ message }">
          <div class="full-width column flex-center q-pa-xl text-grey-5">
            <CalendarDays :size="42" class="q-mb-sm" />
            <span class="text-subtitle2">{{ message }}</span>
          </div>
        </template>

        <!-- Date slot -->
        <template #body-cell-scheduledDate="props">
          <q-td :props="props" class="text-center">
            <div class="row items-center justify-center no-wrap q-gutter-xs">
              <Clock :size="13" class="text-grey-5" />
              <span>{{ formatDateTime(props.row.scheduledDate) }}</span>
            </div>
          </q-td>
        </template>

        <!-- Status slot -->
        <template #body-cell-status="props">
          <q-td :props="props" class="text-center">
            <q-badge
              :label="getStatusLabel(props.row.status)"
              :color="getStatusColor(props.row.status)"
              class="status-badge"
            />
          </q-td>
        </template>

        <!-- Actions slot -->
        <template #body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <div class="row items-center justify-center no-wrap q-gutter-xs">
              <!-- Edit: only if Pending or Confirmed -->
              <q-btn
                v-if="props.row.status === 'Pending' || props.row.status === 'Confirmed'"
                flat
                dense
                round
                size="sm"
                :disable="statusActionLoading === props.row.id"
                @click="handleEdit(props.row)"
              >
                <Pencil :size="15" class="text-grey-7" />
                <q-tooltip>Editar cita</q-tooltip>
              </q-btn>

              <!-- Cancel -->
              <q-btn
                v-if="props.row.status !== 'Cancelled' && props.row.status !== 'Completed'"
                flat
                dense
                round
                size="sm"
                :loading="statusActionLoading === props.row.id"
                @click="handleCancelAppointment(props.row.id)"
              >
                <XCircle :size="15" class="text-negative" />
                <q-tooltip>Cancelar cita</q-tooltip>
              </q-btn>

              <!-- Complete -->
              <q-btn
                v-if="props.row.status === 'Pending' || props.row.status === 'Confirmed'"
                flat
                dense
                round
                size="sm"
                :loading="statusActionLoading === props.row.id"
                @click="handleComplete(props.row.id)"
              >
                <CheckCircle :size="15" class="text-positive" />
                <q-tooltip>Marcar como completada</q-tooltip>
              </q-btn>

              <!-- Medical record: only if Completed -->
              <q-btn v-if="props.row.status === 'Completed'" flat dense round size="sm">
                <FilePlus :size="15" class="text-blue-6" />
                <q-tooltip>Crear historia clínica</q-tooltip>
              </q-btn>

              <!-- Delete -->
              <q-btn
                flat
                dense
                round
                size="sm"
                :disable="props.row.status === 'Completed'"
                @click="confirmDelete(props.row.id)"
              >
                <Trash2 :size="15" class="text-grey-5" />
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>

      <!-- Custom pagination -->
      <div v-if="totalRows > 0" class="row items-center justify-end q-pa-sm q-gutter-xs">
        <span class="text-caption text-grey-6">Filas por página</span>
        <div class="row items-center no-wrap rpp-select">
          <span class="text-caption text-weight-medium q-mr-xs">{{ rowsPerPage }}</span>
          <ChevronDown :size="13" class="text-grey-6" />
          <q-menu fit auto-close>
            <q-list dense>
              <q-item
                v-for="opt in [5, 10, 25]"
                :key="opt"
                clickable
                @click="changeRowsPerPage(opt)"
              >
                <q-item-section>{{ opt }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <span class="text-caption text-grey-6 q-mx-sm">
          {{ rangeStart }}–{{ rangeEnd }} de {{ totalRows }}
        </span>
        <q-btn flat dense round :disable="page <= 1" @click="page--">
          <ChevronLeft :size="16" />
        </q-btn>
        <q-btn flat dense round :disable="page >= pagesCount" @click="page++">
          <ChevronRight :size="16" />
        </q-btn>
      </div>
    </q-card>

    <!-- ── Create / Edit Dialog ─────────────────────────────── -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 420px; border-radius: 12px">
        <q-card-section class="row items-center q-pb-sm">
          <div class="row items-center no-wrap">
            <CalendarDays :size="20" class="text-primary q-mr-sm" />
            <span class="text-subtitle1 text-weight-bold" style="color: #1b0f42">
              {{ dialogMode === 'create' ? 'Nueva Cita' : 'Editar Cita' }}
            </span>
          </div>
          <q-space />
          <q-btn flat round dense v-close-popup>
            <span style="font-size: 18px; color: #9ca3af">✕</span>
          </q-btn>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-md">
          <q-form class="q-gutter-md" @submit.prevent="onSubmit">
            <!-- Mascota -->
            <q-select
              v-model="formPetId"
              :options="petOptions"
              label="Mascota"
              emit-value
              map-options
              dense
              outlined
              hide-dropdown-icon
              no-error-icon
            >
              <template #append>
                <ChevronDown :size="16" class="text-grey-5" />
              </template>
            </q-select>

            <!-- Servicio -->
            <q-select
              v-model="formServiceId"
              :options="serviceOptions"
              label="Servicio"
              emit-value
              map-options
              dense
              outlined
              hide-dropdown-icon
              no-error-icon
            >
              <template #append>
                <ChevronDown :size="16" class="text-grey-5" />
              </template>
            </q-select>

            <!-- Fecha y hora -->
            <div>
              <div class="text-caption text-grey-7 q-mb-xs">Fecha y hora</div>
              <input v-model="formDate" type="datetime-local" class="date-input" required />
            </div>

            <!-- Estado (only on create) -->
            <q-select
              v-if="dialogMode === 'create'"
              v-model="formStatus"
              :options="statusOptions"
              label="Estado"
              emit-value
              map-options
              dense
              outlined
              hide-dropdown-icon
              no-error-icon
            >
              <template #append>
                <ChevronDown :size="16" class="text-grey-5" />
              </template>
            </q-select>

            <div v-if="formError" class="text-negative text-caption">{{ formError }}</div>

            <div class="row q-gutter-sm q-mt-xs">
              <q-btn flat label="Cancelar" color="grey-7" :disable="formLoading" v-close-popup />
              <q-btn
                unelevated
                color="primary"
                :label="dialogMode === 'create' ? 'Guardar cita' : 'Actualizar cita'"
                type="submit"
                :loading="formLoading"
                style="border-radius: 8px"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- ── Delete Confirmation ──────────────────────────────── -->
    <q-dialog :model-value="deleteTarget !== null" persistent>
      <q-card style="min-width: 360px; border-radius: 12px">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold" style="color: #1b0f42">Eliminar cita</div>
          <div class="text-body2 text-grey-7 q-mt-sm">
            ¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            :disable="deleteLoading"
            @click="cancelDelete"
          />
          <q-btn
            unelevated
            color="negative"
            label="Eliminar"
            :loading="deleteLoading"
            style="border-radius: 8px"
            @click="executeDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ── Completed notice ─────────────────────────────────── -->
    <q-dialog v-model="completedNotice">
      <q-card style="min-width: 340px; border-radius: 12px">
        <q-card-section class="row items-center no-wrap">
          <CheckCircle :size="28" class="text-positive q-mr-sm" />
          <div>
            <div class="text-subtitle1 text-weight-bold" style="color: #1b0f42">
              Cita completada
            </div>
            <div class="text-body2 text-grey-7 q-mt-xs">
              Ya puede crear la historia clínica para esta mascota.
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            unelevated
            color="primary"
            label="Entendido"
            v-close-popup
            style="border-radius: 8px"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
.pawcontrol-bg {
  background-color: #f4f6f9;
  min-height: 100%;
}
.page-title {
  color: #1b0f42;
}
.appointments-card {
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
}
.appointments-table {
  border-radius: 0 0 12px 12px;
}
.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}
.rpp-select {
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}
.rpp-select:hover {
  background: rgba(0, 0, 0, 0.05);
}
.date-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  background: #ffffff;
  outline: none;
}
.date-input:focus {
  border-color: #7c3aed;
}
</style>

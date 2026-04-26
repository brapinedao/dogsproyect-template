<script setup lang="ts">
import {
  PawPrint,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-vue-next'
import usePetsList from './PetsList'

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
  deleteTarget,
  deleteLoading,
  confirmDelete,
  cancelDelete,
  executeDelete,
} = usePetsList()
</script>

<template>
  <q-page class="q-pa-lg pawcontrol-bg">
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center no-wrap">
        <PawPrint :size="24" class="text-primary q-mr-sm" />
        <span class="text-h6 text-weight-bold" style="color: #1b0f42">Gestión de Mascotas</span>
      </div>
      <q-btn
        unelevated
        color="primary"
        label="Agregar"
        size="sm"
        style="border-radius: 8px"
        :to="{ name: 'pets-create' }"
      />
    </div>

    <q-card flat class="pets-card">
      <q-card-section class="row items-center q-pb-sm">
        <q-space />
        <q-input
          model-value=""
          dense
          outlined
          placeholder="Buscar nombre"
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
        no-data-label="No hay mascotas registradas"
        loading-label="Cargando mascotas..."
        class="pets-table"
      >
        <template #loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template #no-data="{ message }">
          <div class="full-width column flex-center q-pa-xl text-grey-5">
            <PawPrint :size="42" class="q-mb-sm" />
            <span class="text-subtitle2">{{ message }}</span>
          </div>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn
              flat
              round
              dense
              size="sm"
              class="action-btn action-btn--view"
              :to="{ name: 'pets-detail', params: { id: props.row.id } }"
            >
              <Eye :size="16" />
              <q-tooltip>Ver</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              size="sm"
              class="action-btn action-btn--edit q-mx-xs"
              :to="{ name: 'pets-edit', params: { id: props.row.id } }"
            >
              <Pencil :size="16" />
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              size="sm"
              class="action-btn action-btn--delete"
              @click="confirmDelete(props.row.id)"
            >
              <Trash2 :size="16" />
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>

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

    <!-- Confirmación eliminar -->
    <q-dialog :model-value="deleteTarget !== null" persistent>
      <q-card style="min-width: 320px; border-radius: 12px">
        <q-card-section class="q-pb-sm">
          <div class="text-subtitle1 text-weight-bold" style="color: #1b0f42">
            ¿Eliminar mascota?
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">Esta acción no se puede deshacer.</div>
        </q-card-section>
        <q-card-actions align="right" class="q-pt-none q-pb-md q-pr-md">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            :disable="deleteLoading"
            @click="cancelDelete"
          />
          <q-btn
            unelevated
            label="Eliminar"
            color="negative"
            :loading="deleteLoading"
            style="border-radius: 8px"
            @click="executeDelete"
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
.pets-card {
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
}
.pets-table {
  border-radius: 0 0 12px 12px;
}
.rpp-select {
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}
.rpp-select:hover {
  background: rgba(0, 0, 0, 0.05);
}
.action-btn {
  opacity: 0.7;
  transition:
    opacity 0.15s,
    color 0.15s;
}
.action-btn:hover {
  opacity: 1;
}
.action-btn--view:hover {
  color: #4f46e5;
}
.action-btn--edit:hover {
  color: #0ea5e9;
}
.action-btn--delete:hover {
  color: #ef4444;
}
</style>

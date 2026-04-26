<script setup lang="ts">
import {
  Scissors,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-vue-next'
import useServicesList, { getCategoryLabel, formatCurrency } from './ServicesList'

const {
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
} = useServicesList()
</script>

<template>
  <q-page class="q-pa-lg pawcontrol-bg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center no-wrap">
        <Scissors :size="24" class="text-primary q-mr-sm" />
        <span class="text-h6 text-weight-bold page-title">{{ categoryLabel }}</span>
      </div>
      <q-btn
        unelevated
        color="primary"
        label="Nuevo servicio"
        size="sm"
        style="border-radius: 8px"
      />
    </div>

    <q-card flat class="services-card">
      <q-separator />

      <q-table
        :rows="pagedRows"
        :columns="tableProps.columns"
        :loading="tableProps.loading.value"
        :pagination="{ rowsPerPage: 0 }"
        row-key="id"
        flat
        hide-pagination
        no-data-label="No hay servicios registrados"
        loading-label="Cargando servicios..."
        class="services-table"
      >
        <template #loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template #no-data="{ message }">
          <div class="full-width column flex-center q-pa-xl text-grey-5">
            <Scissors :size="42" class="q-mb-sm" />
            <span class="text-subtitle2">{{ message }}</span>
          </div>
        </template>

        <!-- Category slot -->
        <template #body-cell-category="props">
          <q-td :props="props">
            <q-badge
              :label="getCategoryLabel(props.row.category)"
              :color="categoryColor(props.row.category)"
              class="category-badge"
            />
          </q-td>
        </template>

        <!-- Price slot -->
        <template #body-cell-cost="props">
          <q-td :props="props" class="text-right">
            <span class="price-text">{{ formatCurrency(props.row.cost ?? 0) }}</span>
          </q-td>
        </template>

        <!-- Actions slot -->
        <template #body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn flat round dense size="sm" class="action-btn action-btn--view">
              <Eye :size="16" />
              <q-tooltip>Ver</q-tooltip>
            </q-btn>
            <q-btn flat round dense size="sm" class="action-btn action-btn--edit q-mx-xs">
              <Pencil :size="16" />
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat round dense size="sm" class="action-btn action-btn--delete">
              <Trash2 :size="16" />
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
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
.services-card {
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
}
.services-table {
  border-radius: 0 0 12px 12px;
}
.category-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
}
.price-text {
  font-weight: 600;
  color: #1b0f42;
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

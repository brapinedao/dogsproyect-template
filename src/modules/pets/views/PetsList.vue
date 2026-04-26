<script setup lang="ts">
import { Dog } from 'lucide-vue-next'
import petsListComposable from './PetsList'

const { tableProps } = petsListComposable
</script>

<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-lg">
      <Dog :size="28" class="text-primary q-mr-sm" />
      <span class="text-h5 text-weight-bold text-grey-9">Gestión de Mascotas</span>
    </div>

    <q-table
      :rows="tableProps.rows.value"
      :columns="tableProps.columns"
      :loading="tableProps.loading.value"
      row-key="id"
      flat
      bordered
      no-data-label="No hay mascotas registradas"
      loading-label="Cargando mascotas..."
      rows-per-page-label="Filas por página"
      class="pets-table"
    >
      <template #loading>
        <q-inner-loading showing color="primary" />
      </template>

      <template #no-data="{ message }">
        <div class="full-width column flex-center q-pa-xl text-grey-6">
          <Dog :size="48" class="q-mb-md" />
          <span class="text-subtitle1">{{ message }}</span>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<style scoped>
.pets-table {
  border-radius: 12px;
}
</style>

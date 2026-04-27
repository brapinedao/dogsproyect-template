<script setup lang="ts">
import { Scissors, ArrowLeft } from 'lucide-vue-next'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import useServiceForm from './ServiceForm'

const {
  name,
  category,
  cost,
  durationInMinutes,
  loading,
  errorMessage,
  categoryOptions,
  onSubmit,
  goBack,
} = useServiceForm()
</script>

<template>
  <q-page class="q-pa-lg pawcontrol-bg">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense class="q-mr-sm text-grey-7" @click="goBack">
        <ArrowLeft :size="20" />
      </q-btn>
      <div class="row items-center no-wrap">
        <Scissors :size="24" class="text-primary q-mr-sm" />
        <span class="text-h6 text-weight-bold page-title">Nuevo Servicio</span>
      </div>
    </div>

    <!-- Form card -->
    <q-card flat class="form-card q-pa-lg" style="max-width: 560px">
      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <BaseInput
          v-model="name"
          label="Nombre del servicio"
          placeholder="Ej: Basic Grooming"
          :rules="[(v) => !!v || 'El nombre es requerido']"
        />

        <q-select
          v-model="category"
          :options="categoryOptions"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          label="Categoría"
          outlined
          dense
          :rules="[(v) => v !== null || 'La categoría es requerida']"
        />

        <BaseInput
          v-model="cost"
          label="Costo (COP)"
          placeholder="Ej: 65000"
          type="text"
          :rules="[
            (v) => (!!v && !isNaN(Number(v)) && Number(v) > 0) || 'El costo debe ser mayor a 0',
          ]"
        />

        <BaseInput
          v-model="durationInMinutes"
          label="Duración (minutos)"
          placeholder="Ej: 40"
          type="text"
          :rules="[
            (v) => (!!v && !isNaN(Number(v)) && Number(v) > 0) || 'La duración debe ser mayor a 0',
          ]"
        />

        <BaseAlert v-if="errorMessage" :message="errorMessage" type="error" />

        <div class="row q-gutter-sm q-mt-sm">
          <BaseButton label="Cancelar" variant="outline" @click="goBack" />
          <BaseButton label="Guardar servicio" type="submit" :loading="loading" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<style scoped>
.pawcontrol-bg {
  background-color: #f4f6f9;
  min-height: 100%;
}
.form-card {
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
}
.page-title {
  color: #1b0f42;
}
</style>

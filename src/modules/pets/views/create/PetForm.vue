<script setup lang="ts">
import { PawPrint, ArrowLeft } from 'lucide-vue-next'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import usePetForm from './PetForm'

const { name, breed, dateOfBirth, loading, errorMessage, onSubmit, goBack } = usePetForm()
</script>

<template>
  <q-page class="q-pa-lg pawcontrol-bg">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense class="q-mr-sm text-grey-7" @click="goBack">
        <ArrowLeft :size="20" />
      </q-btn>
      <div class="row items-center no-wrap">
        <PawPrint :size="24" class="text-primary q-mr-sm" />
        <span class="text-h6 text-weight-bold" style="color: #1b0f42">Nueva Mascota</span>
      </div>
    </div>

    <!-- Form card -->
    <q-card flat class="form-card q-pa-lg" style="max-width: 560px">
      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <BaseInput
          v-model="name"
          label="Nombre"
          placeholder="Ej: Milo"
          :rules="[(v) => !!v || 'El nombre es requerido']"
        />

        <BaseInput
          v-model="breed"
          label="Raza"
          placeholder="Ej: Golden Retriever"
          :rules="[(v) => !!v || 'La raza es requerida']"
        />

        <div>
          <div class="text-caption text-grey-7 q-mb-xs">Fecha de nacimiento</div>
          <input
            v-model="dateOfBirth"
            type="date"
            class="date-input"
            required
          />
        </div>

        <BaseAlert v-if="errorMessage" :message="errorMessage" type="error" />

        <div class="row q-gutter-sm q-mt-sm">
          <BaseButton label="Cancelar" variant="outline" @click="goBack" />
          <BaseButton label="Guardar mascota" type="submit" :loading="loading" />
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
.date-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s;
}
.date-input:focus {
  border-color: #7c3aed;
}
</style>

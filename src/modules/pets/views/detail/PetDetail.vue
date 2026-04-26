<script setup lang="ts">
import { PawPrint, ArrowLeft } from 'lucide-vue-next'
import usePetDetail from './PetDetail'

const { pet, loading, goBack } = usePetDetail()

function formatDate(iso: string): string {
  if (!iso) return '—'
  return iso.split('T')[0]!.split('-').reverse().join('/')
}
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
        <span class="text-h6 text-weight-bold" style="color: #1b0f42">Detalle de Mascota</span>
      </div>
    </div>

    <q-card flat class="detail-card q-pa-lg" style="max-width: 560px">
      <div v-if="loading" class="column flex-center q-pa-xl">
        <q-spinner color="primary" size="36px" />
      </div>

      <template v-else-if="pet">
        <div class="detail-field">
          <span class="detail-label">Nombre</span>
          <span class="detail-value">{{ pet.name }}</span>
        </div>
        <q-separator class="q-my-sm" />

        <div class="detail-field">
          <span class="detail-label">Raza</span>
          <span class="detail-value">{{ pet.breed }}</span>
        </div>
        <q-separator class="q-my-sm" />

        <div class="detail-field">
          <span class="detail-label">Fecha de nacimiento</span>
          <span class="detail-value">{{ formatDate(pet.dateOfBirth) }}</span>
        </div>
        <q-separator class="q-my-sm" />

        <div class="detail-field">
          <span class="detail-label">Propietario</span>
          <span class="detail-value">{{ pet.ownerFullName }}</span>
        </div>
        <q-separator class="q-my-sm" />

        <div class="detail-field">
          <span class="detail-label">Correo propietario</span>
          <span class="detail-value">{{ pet.ownerEmail }}</span>
        </div>

        <div class="q-mt-lg">
          <q-btn
            unelevated
            color="primary"
            label="Finalizar"
            style="border-radius: 8px"
            @click="goBack"
          />
        </div>
      </template>

      <div v-else class="text-grey-6 text-center q-pa-xl">No se encontró la mascota.</div>
    </q-card>
  </q-page>
</template>

<style scoped>
.pawcontrol-bg {
  background-color: #f4f6f9;
  min-height: 100%;
}
.detail-card {
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
}
.detail-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;
}
.detail-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9ca3af;
}
.detail-value {
  font-size: 15px;
  color: #1b0f42;
  font-weight: 500;
}
</style>

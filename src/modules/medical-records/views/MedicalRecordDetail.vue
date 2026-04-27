<script setup lang="ts">
import { FileText, Stethoscope, PlusCircle } from 'lucide-vue-next'
import useMedicalRecordDetail from './MedicalRecordDetail'
import { useAlert } from '@/composables/useAlert'

const {
  pet,
  petId,
  showDialog,
  form,
  formError,
  submitting,
  appointmentId,
  openDialogDialog,
  handleSaveEntry,
  medicalRecordsStore,
  downloadPDF,
} = useMedicalRecordDetail()

const { alert } = useAlert()
</script>

<template>
  <q-page id="medical-record-detail" class="q-pa-lg pawcontrol-bg">
    <q-banner
      v-if="alert"
      :class="alert.type === 'positive' ? 'bg-green-2 text-green-10' : 'bg-red-2 text-red-10'"
      class="q-mb-md"
    >
      {{ alert.message }}
    </q-banner>
    <!-- Header -->
    <q-card flat class="q-mb-lg q-pa-md flex row items-center justify-between header-card no-print">
      <div class="row items-center">
        <Stethoscope :size="28" class="text-primary q-mr-md" />
        <div>
          <div class="text-h6 text-weight-bold">{{ pet?.name }}</div>
          <div class="text-subtitle2 text-grey-7">
            {{ pet?.breed }}<span v-if="pet"> • {{ getAge(pet.dateOfBirth) }}</span>
          </div>
        </div>
      </div>
      <div class="row items-center q-gutter-sm">
        <q-btn color="primary" unelevated @click="downloadPDF">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-printer q-mr-xs"
          >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H18V14H6v4z" />
            <rect x="6" y="14" width="12" height="4" />
            <rect x="6" y="9" width="12" height="5" />
          </svg>
          Imprimir
        </q-btn>
        <q-btn color="primary" unelevated @click="openDialogDialog()">
          <PlusCircle :size="18" class="q-mr-xs" />Agregar Entrada
        </q-btn>
      </div>
    </q-card>

    <!-- Print-only layout tipo ficha (solo fichas, sin tabla) -->
    <div class="print-layout">
      <div class="print-header">
        <div class="clinic-name">DogsProyect</div>
        <div class="print-date">
          {{
            new Date().toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          }}
        </div>
      </div>
      <div class="pet-info">
        <div><b>Nombre:</b> {{ pet?.name }}</div>
        <div><b>Especie:</b> Canina</div>
        <div><b>Raza:</b> {{ pet?.breed }}</div>
        <div><b>Edad:</b> {{ getAge(pet?.dateOfBirth) }}</div>
      </div>
    </div>

    <!-- Timeline -->
    <q-timeline color="primary" layout="dense" class="q-mb-xl no-print">
      <q-timeline-entry
        v-for="record in medicalRecordsStore.currentPetHistory?.slice().reverse() ?? []"
        :key="record.id"
      >
        <template #title>
          <div class="row items-center">
            <FileText :size="18" class="q-mr-xs" />
            <span class="text-weight-bold">{{ formatDate(record.date) }}</span>
          </div>
        </template>
        <template #subtitle>
          <span class="text-primary">{{ record.professionalName }}</span>
        </template>
        <div>
          <div class="text-weight-bold">Diagnóstico:</div>
          <div>{{ record.diagnosis ?? '' }}</div>
          <div class="text-weight-bold q-mt-sm">Tratamiento:</div>
          <div>{{ record.treatment ?? '' }}</div>
          <div class="text-weight-bold q-mt-sm">Medicamento:</div>
          <div>{{ record.medication ?? '' }}</div>
          <div v-if="record.notes" class="q-mt-sm">
            <div class="text-weight-bold">Notas:</div>
            <div>{{ record.notes }}</div>
          </div>
        </div>
      </q-timeline-entry>
    </q-timeline>

    <!-- Dialogo para nueva entrada -->
    <q-dialog v-model="showDialog" class="no-print">
      <q-card style="min-width: 400px; max-width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6"><PlusCircle :size="18" class="q-mr-xs" />Nueva Entrada Clínica</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="handleSaveEntry">
            <q-input
              v-model="form.diagnosis"
              type="textarea"
              label="Diagnóstico"
              :rules="[(v) => !!v || 'El diagnóstico es obligatorio']"
              autogrow
              class="q-mb-md"
            />
            <q-input
              v-model="form.treatment"
              type="textarea"
              label="Tratamiento"
              :rules="[(v) => !!v || 'El tratamiento es obligatorio']"
              autogrow
              class="q-mb-md"
            />
            <q-input
              v-model="form.medication"
              type="textarea"
              label="Medicamento"
              autogrow
              class="q-mb-md"
            />
            <q-input
              v-model="form.notes"
              type="textarea"
              label="Notas adicionales"
              autogrow
              class="q-mb-md"
            />
            <div v-if="formError" class="text-negative q-mb-md">{{ formError }}</div>
            <div class="row q-gutter-sm q-mt-sm">
              <q-btn flat label="Cancelar" @click="showDialog = false" />
              <q-btn color="primary" label="Guardar" type="submit" :loading="submitting" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
function getAge(dateOfBirth?: string | null): string {
  if (!dateOfBirth) return ''
  const birth = new Date(dateOfBirth)
  if (isNaN(birth.getTime())) return ''
  const now = new Date()
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  if (months < 0) {
    years--
    months += 12
  }
  return `${years} años${months > 0 ? `, ${months} meses` : ''}`
}
function formatDate(date?: string | null): string {
  if (!date) return ''
  // Soporta tanto "04/04/2026" como ISO
  const d = date.includes('/') ? date.split('/').reverse().join('-') : date
  const parsed = new Date(d)
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
  .header-card {
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
  }

  /* Print styles */
  @media print {
    body * {
      display: none !important;
    }
    #medical-record-detail .print-layout {
      display: block !important;
      position: static !important;
      visibility: visible !important;
      margin: 0 auto;
      max-width: 800px;
      color: #222;
      font-family: 'Arial', sans-serif;
      background: #fff;
      padding: 32px;
      box-shadow: none !important;
      z-index: 9999;
    }
  }

  .print-layout {
    display: none;
  }
  .print-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #222;
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
  .clinic-name {
    font-size: 2rem;
    font-weight: bold;
    letter-spacing: 1px;
  }
  .print-date {
    font-size: 1rem;
  }
  .pet-info {
    margin-bottom: 24px;
    font-size: 1.1rem;
  }
  .records-fichas {
    margin-bottom: 32px;
  }
  .record-ficha {
    border: 1px solid #aaa;
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 18px;
    background: #fff;
    page-break-inside: avoid;
  }
  .record-ficha-header {
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 1.1rem;
  }
  .signature-section {
    margin-top: 48px;
    font-size: 1.1rem;
  }
  .signature-line {
    border-bottom: 1px solid #222;
    width: 300px;
    height: 32px;
    margin-top: 16px;
  }
}
</style>

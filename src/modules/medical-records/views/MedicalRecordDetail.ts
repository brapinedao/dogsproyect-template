import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useMedicalRecordsStore } from '@/modules/medical-records/store/useMedicalRecordsStore'
import { usePetsStore } from '@/modules/pets/store/usePetsStore'
import { useMainLoader } from '@/composables/useMainLoader'
import { useAlert } from '@/composables/useAlert'

export default function useMedicalRecordDetail() {
  const route = useRoute()
  const medicalRecordsStore = useMedicalRecordsStore()
  const petsStore = usePetsStore()
  const { openMainLoader } = useMainLoader()
  const { showPositive, showNegative } = useAlert()

  const showDialog = ref(false)
  const form = ref({
    diagnosis: '',
    treatment: '',
    medication: '',
    notes: '',
  })
  const formError = ref('')
  const submitting = ref(false)
  const appointmentId = ref<number | null>(null)

  const petId = computed(() => Number(route.params.petId))
  const pet = ref<any>(null)

  async function ensurePetLoaded() {
    let found = petsStore.pets.find((p) => p.id === petId.value)
    if (!found) {
      const result = await petsStore._getPetById(petId.value)
      found =
        result && 'data' in result
          ? (result.data as import('@/modules/pets/store/usePetsStore').Pet)
          : undefined
      if (found) petsStore.pets.push(found)
    }
    if (found) {
      pet.value = found
    }
  }
  async function loadResources() {
    openMainLoader(true)
    await Promise.all([ensurePetLoaded(), medicalRecordsStore._getHistoryByPet(petId.value)])
    openMainLoader(false)
  }
  onMounted(() => {
    if (route.query.appointmentId) {
      appointmentId.value = Number(route.query.appointmentId)
    }
    loadResources()
  })

  function openDialogDialog(aId?: number) {
    appointmentId.value = aId ?? null
    form.value = { diagnosis: '', treatment: '', medication: '', notes: '' }
    formError.value = ''
    showDialog.value = true
  }

  async function handleSaveEntry() {
    formError.value = ''
    if (!form.value.diagnosis || !form.value.treatment) {
      formError.value = 'Diagnóstico y tratamiento son obligatorios.'
      return
    }
    submitting.value = true
    openMainLoader(true)
    const success = await medicalRecordsStore._createEntry({
      petId: petId.value,
      appointmentId: appointmentId.value ?? 0,
      diagnosis: form.value.diagnosis,
      treatment: form.value.treatment,
      medication: form.value.medication,
      notes: form.value.notes,
    })
    openMainLoader(false)
    submitting.value = false
    if (success) {
      showDialog.value = false
      showPositive('Registro clínico guardado')
      await medicalRecordsStore._getHistoryByPet(petId.value)
    } else {
      showNegative('No se pudo guardar el registro clínico.')
    }
  }

  function downloadPDF() {
    window.print()
  }

  // Eliminado: onMounted(loadResources)
  onBeforeUnmount(() => {
    medicalRecordsStore._resetKeys()
  })

  return {
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
  }
}

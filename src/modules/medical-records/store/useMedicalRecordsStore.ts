import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosInstance from '@/api/axiosInstance'
import { API_URLS } from '@/constants/apis'

export interface MedicalRecord {
  id: number
  petId: number
  appointmentId: number
  diagnosis: string
  treatment: string
  medication?: string
  notes?: string
  date?: string
  createdAt?: string
  professionalName?: string
}

export interface MedicalRecordCreatePayload {
  petId: number
  appointmentId: number
  diagnosis: string
  treatment: string
  medication?: string
  notes?: string
}

export const useMedicalRecordsStore = defineStore('medicalRecords', () => {
  const currentPetHistory = ref<MedicalRecord[]>([])

  async function _getHistoryByPet(petId: number): Promise<void> {
    const { data } = await axiosInstance.get<MedicalRecord[]>(
      `${API_URLS.MEDICAL_RECORDS.BY_PET}/${petId}`,
    )
    currentPetHistory.value = data
  }

  async function _createEntry(payload: MedicalRecordCreatePayload): Promise<boolean> {
    try {
      await axiosInstance.post(API_URLS.MEDICAL_RECORDS.CREATE, payload)
      return true
    } catch {
      return false
    }
  }

  function _resetKeys(): void {
    currentPetHistory.value = []
  }

  return {
    currentPetHistory,
    _getHistoryByPet,
    _createEntry,
    _resetKeys,
  }
})

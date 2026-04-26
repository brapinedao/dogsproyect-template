import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosInstance from '@/api/axiosInstance'
import { API_URLS } from '@/constants/apis'

export interface Appointment {
  id: number
  scheduledDate: string
  status: string
  petName: string
  serviceName: string
}

export interface CreateAppointmentPayload {
  scheduledDate: string
  status: string
  petId: number
  serviceId: number
}

export interface UpdateAppointmentPayload {
  scheduledDate: string
  petId: number
  serviceId: number
}

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref<Appointment[]>([])

  async function _getAppointments(): Promise<Appointment[] | false> {
    try {
      const { data } = await axiosInstance.get<Appointment[]>(API_URLS.APPOINTMENTS.BASE)
      appointments.value = data
      return data
    } catch {
      return false
    }
  }

  async function _getAppointmentById(id: number): Promise<Appointment | false> {
    try {
      const { data } = await axiosInstance.get<Appointment>(API_URLS.APPOINTMENTS.BY_ID(id))
      return data
    } catch {
      return false
    }
  }

  async function _createAppointment(payload: CreateAppointmentPayload): Promise<boolean> {
    try {
      await axiosInstance.post(API_URLS.APPOINTMENTS.CREATE, payload)
      return true
    } catch {
      return false
    }
  }

  async function _updateAppointment(
    id: number,
    payload: UpdateAppointmentPayload,
  ): Promise<boolean> {
    try {
      await axiosInstance.put(API_URLS.APPOINTMENTS.UPDATE(id), payload)
      return true
    } catch {
      return false
    }
  }

  async function _patchStatus(id: number, status: string): Promise<boolean> {
    try {
      await axiosInstance.patch(API_URLS.APPOINTMENTS.PATCH_STATUS(id), { status })
      return true
    } catch {
      return false
    }
  }

  async function _deleteAppointment(id: number): Promise<boolean> {
    try {
      await axiosInstance.delete(API_URLS.APPOINTMENTS.DELETE(id))
      return true
    } catch {
      return false
    }
  }

  function _resetKeys(): void {
    appointments.value = []
  }

  return {
    appointments,
    _getAppointments,
    _getAppointmentById,
    _createAppointment,
    _updateAppointment,
    _patchStatus,
    _deleteAppointment,
    _resetKeys,
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosInstance from '@/api/axiosInstance'
import { API_URLS } from '@/constants/apis'

export interface Service {
  id: number
  name: string
  category: number
  cost: number
  durationInMinutes: number
}

export const useServicesStore = defineStore('services', () => {
  const services = ref<Service[]>([])

  async function _getServices(): Promise<Service[] | false> {
    try {
      const { data } = await axiosInstance.get<Service[]>(API_URLS.SERVICES.BASE)
      services.value = data
      return data
    } catch {
      return false
    }
  }

  function _resetKeys(): void {
    services.value = []
  }

  return { services, _getServices, _resetKeys }
})

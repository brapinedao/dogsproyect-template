import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosInstance from '@/api/axiosInstance'
import { API_URLS } from '@/constants/apis'

export interface Pet {
  id: number
  name: string
  breed: string
  age: number
  ownerName: string
}

export const usePetsStore = defineStore('pets', () => {
  const pets = ref<Pet[]>([])

  async function _getPets(): Promise<Pet[] | false> {
    try {
      const { data } = await axiosInstance.get<Pet[]>(API_URLS.PETS.BASE)
      pets.value = data
      return data
    } catch {
      return false
    }
  }

  return { pets, _getPets }
})

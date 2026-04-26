import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosInstance from '@/api/axiosInstance'
import { API_URLS } from '@/constants/apis'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'

export interface Pet {
  id: number
  name: string
  breed: string
  dateOfBirth: string
  ownerId: string
  ownerFullName: string
  ownerEmail: string
}

export interface CreatePetPayload {
  name: string
  breed: string
  dateOfBirth: string
  ownerId: string
}

export type UpdatePetPayload = CreatePetPayload

export const usePetsStore = defineStore('pets', () => {
  const pets = ref<Pet[]>([])

  const _getAllPets = async (): Promise<Pet[] | false> => {
    try {
      const { data } = await axiosInstance.get<Pet[]>(API_URLS.PETS.ALL)
      pets.value = data
      return data
    } catch {
      return false
    }
  }

  const _getPets = async (): Promise<Pet[] | false> => {
    const authStore = useAuthStore()
    const userId = authStore.user?.id
    if (!userId) return false
    try {
      const { data } = await axiosInstance.get<Pet[]>(API_URLS.PETS.BY_OWNER(userId))
      pets.value = data
      return data
    } catch {
      return false
    }
  }

  const _createPet = async (payload: CreatePetPayload): Promise<boolean> => {
    try {
      await axiosInstance.post(API_URLS.PETS.CREATE, payload)
      return true
    } catch {
      return false
    }
  }

  const _getPetById = async (id: number): Promise<Pet | false> => {
    try {
      const { data } = await axiosInstance.get<Pet>(API_URLS.PETS.BY_ID(id))
      return data
    } catch {
      return false
    }
  }

  const _updatePet = async (id: number, payload: UpdatePetPayload): Promise<boolean> => {
    try {
      await axiosInstance.put(API_URLS.PETS.UPDATE(id), payload)
      return true
    } catch {
      return false
    }
  }

  const _deletePet = async (id: number): Promise<boolean> => {
    try {
      await axiosInstance.delete(API_URLS.PETS.DELETE(id))
      return true
    } catch {
      return false
    }
  }

  const _resetKeys = (): void => {
    pets.value = []
  }

  return {
    pets,
    _getAllPets,
    _getPets,
    _createPet,
    _getPetById,
    _updatePet,
    _deletePet,
    _resetKeys,
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosInstance from '@/api/axiosInstance'
import { API_URLS } from '@/constants/apis'

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  token: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref<boolean>(!!token.value)

  async function _login(payload: LoginPayload): Promise<boolean> {
    try {
      const { data } = await axiosInstance.post<LoginResponse>(API_URLS.AUTH.LOGIN, payload)
      token.value = data.token
      isAuthenticated.value = true
      localStorage.setItem('token', data.token)
      return true
    } catch {
      token.value = null
      isAuthenticated.value = false
      return false
    }
  }

  function _logout(): void {
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return { token, isAuthenticated, _login, _logout }
})

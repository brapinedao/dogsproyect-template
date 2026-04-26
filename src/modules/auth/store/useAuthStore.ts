import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosInstance from '@/api/axiosInstance'
import { API_URLS } from '@/constants/apis'

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  id: string
  userName: string
  fullName: string
  token: string
  expiresAtUtc: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
}

const USER_KEY = 'auth_user'

function _loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref<boolean>(!!token.value)
  const user = ref<AuthUser | null>(_loadStoredUser())

  async function _login(payload: LoginPayload): Promise<boolean> {
    try {
      const { data } = await axiosInstance.post<LoginResponse>(API_URLS.AUTH.LOGIN, payload)
      token.value = data.token
      isAuthenticated.value = true
      user.value = { id: data.id, name: data.fullName, email: data.userName }
      localStorage.setItem('token', data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
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
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem(USER_KEY)
  }

  return { token, isAuthenticated, user, _login, _logout }
})

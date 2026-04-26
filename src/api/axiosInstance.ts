import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_URLS } from '@/constants/apis'

const axiosInstance = axios.create({
  baseURL: API_URLS.BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT from localStorage
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// Response interceptor — global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status

    if (status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default axiosInstance

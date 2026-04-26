const BASE_URL = 'http://localhost:5281/api'

export const API_URLS = {
  BASE: BASE_URL,

  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
  },

  PETS: {
    BASE: `${BASE_URL}/pets`,
  },

  SERVICES: {
    BASE: `${BASE_URL}/services`,
  },

  APPOINTMENTS: {
    BASE: `${BASE_URL}/appointments`,
  },
} as const

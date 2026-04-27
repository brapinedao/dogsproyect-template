const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export const API_URLS = {
  BASE: BASE_URL,

  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
  },

  PETS: {
    ALL: `${BASE_URL}/Pets`,
    BY_OWNER: (userId: string) => `${BASE_URL}/Pets/owner/${userId}`,
    BY_ID: (id: number) => `${BASE_URL}/Pets/${id}`,
    CREATE: `${BASE_URL}/Pets`,
    UPDATE: (id: number) => `${BASE_URL}/Pets/${id}`,
    DELETE: (id: number) => `${BASE_URL}/Pets/${id}`,
  },

  SERVICES: {
    BASE: `${BASE_URL}/services`,
    CREATE: `${BASE_URL}/services`,
    BY_ID: (id: number) => `${BASE_URL}/services/${id}`,
  },

  APPOINTMENTS: {
    BASE: `${BASE_URL}/appointments`,
    CREATE: `${BASE_URL}/appointments`,
    BY_ID: (id: number) => `${BASE_URL}/appointments/${id}`,
    UPDATE: (id: number) => `${BASE_URL}/appointments/${id}`,
    PATCH_STATUS: (id: number) => `${BASE_URL}/appointments/${id}/status`,
    DELETE: (id: number) => `${BASE_URL}/appointments/${id}`,
  },

  MEDICAL_RECORDS: {
    BY_PET: `${BASE_URL}/medicalrecords/pet`,
    CREATE: `${BASE_URL}/medicalrecords`,
  },
} as const

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/modules/auth/views/Login.vue'),
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'medical-records',
          name: 'medical-records-list',
          component: () => import('@/modules/medical-records/views/MedicalRecordsList.vue'),
        },
        {
          path: 'pets',
          name: 'pets-list',
          component: () => import('@/modules/pets/views/list/PetsList.vue'),
        },
        {
          path: 'pets/new',
          name: 'pets-create',
          component: () => import('@/modules/pets/views/create/PetForm.vue'),
        },
        {
          path: 'pets/:id/view',
          name: 'pets-detail',
          component: () => import('@/modules/pets/views/detail/PetDetail.vue'),
        },
        {
          path: 'pets/:id/edit',
          name: 'pets-edit',
          component: () => import('@/modules/pets/views/edit/PetEdit.vue'),
        },
        {
          path: 'services',
          name: 'services-list',
          component: () => import('@/modules/services/views/ServicesList.vue'),
        },
        {
          path: 'services/new',
          name: 'services-create',
          component: () => import('@/modules/services/views/create/ServiceForm.vue'),
        },
        {
          path: 'appointments',
          name: 'appointments-list',
          component: () => import('@/modules/appointments/views/AppointmentsList.vue'),
        },
        {
          path: 'medical-records/:petId',
          name: 'medical-record-detail',
          component: () => import('@/modules/medical-records/views/MedicalRecordDetail.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

// Navigation guard
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    return { name: 'login' }
  }
})

export default router

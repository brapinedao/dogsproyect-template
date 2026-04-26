<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  setTimeout(() => {
    if (authStore.isAuthenticated) {
      router.replace({ name: 'pets-list' })
    } else {
      router.replace({ name: 'login' })
    }
  }, 3000)
})

function goBack() {
  if (authStore.isAuthenticated) {
    router.replace({ name: 'pets-list' })
  } else {
    router.replace({ name: 'login' })
  }
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-card">
      <span class="not-found-code">404</span>
      <h1 class="not-found-title">Página no encontrada</h1>
      <p class="not-found-message">
        La ruta que buscas no existe. Serás redirigido automáticamente.
      </p>
      <q-btn unelevated color="primary" label="Volver ahora" @click="goBack" />
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.not-found-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: white;
  border-radius: 16px;
  padding: 48px 64px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.not-found-code {
  font-size: 96px;
  font-weight: 700;
  color: #1976d2;
  line-height: 1;
}

.not-found-title {
  font-size: 24px;
  font-weight: 600;
  color: #212121;
  margin: 0;
}

.not-found-message {
  font-size: 15px;
  color: #757575;
  margin: 0;
}
</style>

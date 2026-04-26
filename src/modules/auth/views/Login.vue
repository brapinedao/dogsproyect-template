<script setup lang="ts">
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-vue-next'
import loginComposable from './Login'

const { email, password, loading, errorMessage, onSubmit } = loginComposable
</script>

<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="login-card q-pa-lg shadow-3">
      <q-card-section class="text-center q-pb-sm">
        <q-avatar size="64px" color="primary" text-color="white" class="q-mb-md">
          <LogIn :size="32" />
        </q-avatar>
        <div class="text-h5 text-weight-bold text-grey-9">Canine Management</div>
        <div class="text-subtitle2 text-grey-6">Inicia sesión para continuar</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <!-- Email -->
          <q-input
            v-model="email"
            type="email"
            label="Correo electrónico"
            outlined
            dense
            :rules="[(val) => !!val || 'El correo es requerido']"
            lazy-rules
          >
            <template #prepend>
              <Mail :size="18" class="text-grey-6" />
            </template>
          </q-input>

          <!-- Password -->
          <q-input
            v-model="password"
            type="password"
            label="Contraseña"
            outlined
            dense
            :rules="[(val) => !!val || 'La contraseña es requerida']"
            lazy-rules
          >
            <template #prepend>
              <Lock :size="18" class="text-grey-6" />
            </template>
          </q-input>

          <!-- Error message -->
          <q-banner v-if="errorMessage" class="text-negative bg-red-1 rounded-borders" dense>
            <template #avatar>
              <AlertCircle :size="18" />
            </template>
            {{ errorMessage }}
          </q-banner>

          <!-- Submit -->
          <q-btn
            type="submit"
            label="Iniciar sesión"
            color="primary"
            class="full-width q-mt-sm"
            size="md"
            unelevated
            :loading="loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
}
</style>

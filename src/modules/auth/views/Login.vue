<script setup lang="ts">
import { Mail, Lock, PawPrint } from 'lucide-vue-next'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import loginComposable from './Login'

const { email, password, loading, errorMessage, onSubmit } = loginComposable
</script>

<template>
  <div class="login-page row items-stretch">
    <!-- ── Left: branding panel ─────────────────────────── -->
    <div class="login-brand col-xs-12 col-sm-5 column flex-center">
      <PawPrint :size="64" class="brand-icon q-mb-md" />
      <div class="text-h4 text-weight-bold text-white">PawControl</div>
      <div class="text-subtitle1 text-white opacity-70 q-mt-xs">Sistema de Gestión Canina</div>
    </div>

    <!-- ── Right: form panel ───────────────────────────── -->
    <div class="login-form-panel col-xs-12 col-sm-7 column flex-center">
      <q-card flat class="login-card q-pa-xl">
        <q-card-section class="q-pb-sm">
          <div class="text-h5 text-weight-bold login-title">Bienvenido</div>
          <div class="text-subtitle2 text-grey-6 q-mt-xs">Inicia sesión en tu cuenta</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="onSubmit" class="q-gutter-md">
            <BaseInput
              v-model="email"
              label="Login"
              type="email"
              placeholder="email@pawcontrol.com"
              :icon="Mail"
              :rules="[(val) => !!val || 'El correo es requerido']"
            />

            <BaseInput
              v-model="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              :icon="Lock"
              :rules="[(val) => !!val || 'La contraseña es requerida']"
            />

            <div class="text-right">
              <span class="text-caption text-primary cursor-pointer">
                ¿Olvidaste tu contraseña?
              </span>
            </div>

            <BaseAlert v-if="errorMessage" :message="errorMessage" type="error" />

            <BaseButton label="Iniciar sesión" type="submit" :loading="loading" full-width />
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
}

.login-brand {
  background: linear-gradient(145deg, #1b0f42 0%, #4f46e5 100%);
  padding: 48px 32px;
}

.brand-icon {
  color: #a78bfa;
}

.login-form-panel {
  background-color: #f4f6f9;
  padding: 48px 24px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.06);
}

.login-title {
  color: #1b0f42;
}
</style>

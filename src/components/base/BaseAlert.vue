<script setup lang="ts">
import { markRaw } from 'vue'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    message: string
    type?: 'error' | 'success' | 'info' | 'warning'
  }>(),
  { type: 'error' },
)

const config = {
  error: { icon: markRaw(AlertCircle), bg: 'bg-red-1', text: 'text-negative' },
  success: { icon: markRaw(CheckCircle), bg: 'bg-green-1', text: 'text-positive' },
  info: { icon: markRaw(Info), bg: 'bg-blue-1', text: 'text-info' },
  warning: { icon: markRaw(AlertTriangle), bg: 'bg-orange-1', text: 'text-warning' },
} as const

const current = config[props.type]
</script>

<template>
  <q-banner :class="[current.bg, current.text, 'rounded-borders']" dense>
    <template #avatar>
      <component :is="current.icon" :size="16" />
    </template>
    {{ message }}
  </q-banner>
</template>

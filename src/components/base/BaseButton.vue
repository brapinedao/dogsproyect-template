<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    type?: 'button' | 'submit' | 'reset'
    color?: string
    loading?: boolean
    disabled?: boolean
    fullWidth?: boolean
    variant?: 'filled' | 'outline' | 'flat'
  }>(),
  {
    type: 'button',
    color: 'primary',
    loading: false,
    disabled: false,
    fullWidth: false,
    variant: 'filled',
  },
)

defineEmits<{ click: [] }>()
</script>

<template>
  <q-btn
    :type="type"
    :label="label"
    :color="color"
    :loading="loading"
    :disable="disabled"
    :class="{ 'full-width': fullWidth }"
    :unelevated="variant === 'filled'"
    :outline="variant === 'outline'"
    :flat="variant === 'flat'"
    size="md"
    class="base-btn"
    @click="$emit('click')"
  />
</template>

<style scoped>
.base-btn {
  border-radius: 8px;
}
</style>

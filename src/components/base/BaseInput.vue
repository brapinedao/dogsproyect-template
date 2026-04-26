<script setup lang="ts">
import { computed, markRaw } from 'vue'
import type { Component } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    type?: 'text' | 'email' | 'password'
    icon?: Component
    rules?: ((val: string) => true | string)[]
    disabled?: boolean
  }>(),
  {
    type: 'text',
    rules: () => [],
    disabled: false,
  },
)

defineEmits<{ 'update:modelValue': [value: string] }>()

const safeIcon = computed(() => (props.icon ? markRaw(props.icon as object) : undefined))
</script>

<template>
  <div>
    <div v-if="label" class="base-input__label text-caption text-weight-medium text-grey-7 q-mb-xs">
      {{ label }}
    </div>
    <q-input
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :rules="rules"
      :disable="disabled"
      outlined
      dense
      lazy-rules
      no-error-icon
      bg-color="white"
      @update:model-value="(val) => $emit('update:modelValue', val as string)"
    >
      <template v-if="safeIcon" #prepend>
        <component :is="safeIcon" :size="17" class="text-grey-5" />
      </template>
    </q-input>
  </div>
</template>

<style scoped>
.base-input__label {
  display: block;
}
</style>

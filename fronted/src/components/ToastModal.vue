<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" @click.self="close">
    <div class="bg-obl-surface border border-obl-border-default rounded-obl-lg p-obl-6 w-full max-w-md mx-obl-4">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 text-2xl" :style="{ color: type === 'error' ? '#e05252' : type === 'success' ? '#4ade80' : 'var(--accent)' }">
          {{ type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️' }}
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold mb-2" style="color: var(--text-primary);">{{ title }}</h3>
          <p class="text-sm" style="color: var(--text-secondary);">{{ message }}</p>
        </div>
        <button @click="close" class="text-obl-muted hover:text-obl-accent transition-colors text-xl leading-none">✕</button>
      </div>
      <div class="mt-6 flex justify-end">
        <button @click="close" class="btn btn-primary btn-sm">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const title = ref('')
const message = ref('')
const type = ref('info')
let resolveCallback = null

const show = (opts) => {
  title.value = opts.title || 'Уведомление'
  message.value = opts.message || ''
  type.value = opts.type || 'info'
  visible.value = true

  return new Promise((resolve) => {
    resolveCallback = resolve
  })
}

const close = () => {
  visible.value = false
  if (resolveCallback) {
    resolveCallback()
    resolveCallback = null
  }
}

// Глобальный доступ
window.$toast = {
  show,
  info: (msg, title = 'Информация') => show({ title, message: msg, type: 'info' }),
  success: (msg, title = 'Успешно') => show({ title, message: msg, type: 'success' }),
  error: (msg, title = 'Ошибка') => show({ title, message: msg, type: 'error' })
}

defineExpose({ show, close })
</script>

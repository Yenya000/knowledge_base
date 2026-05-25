<template>
  <div class="min-h-screen bg-obl-base text-obl-primary flex items-center justify-center p-obl-4 font-sans antialiased">
    <div class="w-full max-w-md card">
      
      <div class="text-center mb-obl-8">
        <span class="label">// Secure Access</span>
        <h1 class="text-3xl font-extrabold tracking-tight mt-obl-2">OBLIVION <span class="text-obl-accent">|</span> BASE</h1>
        <p class="text-xs font-mono text-obl-muted mt-obl-1">системный интерфейс авторизации</p>
      </div>

      <div class="divider mb-obl-6">AUTH_REQUIRED</div>

      <div v-if="errorMessage" class="mb-obl-4 p-obl-3 bg-red-900/20 border border-red-500/40 rounded-obl-sm text-xs font-mono text-red-400">
        [ERROR]: {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-obl-4">
        <div class="input-group">
          <label for="employeeId" class="input-label">ID Сотрудника</label>
          <input id="employeeId" v-model="employeeId" type="text" class="input font-mono" placeholder="OBL-XXXX" required />
        </div>

        <div class="input-group">
          <label for="password" class="input-label">Пароль доступа</label>
          <input id="password" v-model="password" type="password" class="input" placeholder="••••••••" required />
        </div>

        <button type="submit" class="btn btn-primary btn-full btn-lg mt-obl-2">
          Инициализировать вход
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api' 

const router = useRouter()
const employeeId = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    errorMessage.value = ''
    
    // Метод axios.post шлет ID и пароль на бэкенд Насти
    const response = await api.post('/auth/login', {
      employeeId: employeeId.value,
      password: password.value
    })

    // Ловит в ответе JWT-токен и сохраняет его в localStorage
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('userRole', response.data.role) // Сохраняем роль для проверок

    // Перенаправляет пользователя в личный кабинет (СТРОГО ПО ПЛАНУ)
    router.push('/profile')

  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Ошибка авторизации'
  }
}
</script>
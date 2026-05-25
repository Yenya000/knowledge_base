<template>
  <div class="min-h-screen bg-obl-base text-obl-primary p-obl-8 font-sans antialiased flex items-center justify-center">
    
    <div class="w-full max-w-md card">
      <div class="text-center mb-obl-6">
        <span class="label">// Личный кабинет</span>
        <h1 class="text-2xl font-extrabold tracking-tight mt-obl-2">ПРОФИЛЬ СОТРУДНИКА</h1>
        <p class="text-xs font-mono text-obl-muted mt-obl-1">база данных персонала корпорации</p>
      </div>

      <div class="divider mb-obl-6">SYS_STATUS: ACTIVE</div>

      <div class="space-y-obl-4 bg-obl-elevated/30 p-obl-4 rounded-obl-sm border border-obl-border-subtle mb-obl-6 font-mono text-sm">
        <div class="flex justify-between border-b border-obl-border-subtle/40 pb-obl-2">
          <span class="text-obl-muted">Статус доступа:</span>
          <span class="text-green-400 font-bold">[AUTHORIZED]</span>
        </div>
        
        <div class="flex justify-between border-b border-obl-border-subtle/40 pb-obl-2">
          <span class="text-obl-muted">Текущая роль в системе:</span>
          <span class="text-obl-accent uppercase font-bold">{{ userRole }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-obl-muted">Токен сессии:</span>
          <span class="text-obl-faint text-xs truncate max-w-[180px]">{{ sessionToken }}</span>
        </div>
      </div>

      <div class="space-y-obl-3">
        <router-link 
          v-if="userRole === 'admin'" 
          to="/admin" 
          class="btn btn-primary btn-full text-center block"
        >
          Перейти в Панель управления
        </router-link>

        <router-link 
          to="/" 
          class="btn btn-ghost btn-full text-center block"
        >
          Вернуться в Справочный центр
        </router-link>

        <button 
          @click="handleLogout" 
          class="btn btn-subtle btn-full mt-obl-2"
        >
          Завершить сессию ([ESC])
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Достаем данные авторизации из localStorage
const userRole = ref(localStorage.getItem('userRole') || 'user')
const sessionToken = ref(localStorage.getItem('token') || 'Отсутствует')

// Функция очистки веб-хранилища и редиректа на Login
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  
  // Выкидываем на форму входа — теперь роутер обратно не пустит
  router.push('/login')
}
</script>
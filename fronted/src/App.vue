<template>
  <div id="app" class="min-h-screen bg-ob-base text-ob-text font-sans antialiased flex flex-col">
    
    <header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-ob-base/80 border-b border-ob-border h-14">
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-between h-full">
        
        <div class="flex gap-3 items-center">
          <div class="w-6 h-6 bg-ob-accent" style="clip-path: polygon(50% 0%,85% 15%,100% 50%,85% 85%,50% 100%,15% 85%,0% 50%,15% 15%)"></div>
          <span class="font-bold">OBLIVIONE</span>
          <span class="font-bold text-ob-accent">|</span>
          <span class="font-bold">BASE</span>
        </div>

        <nav class="hidden md:flex gap-8">
          <RouterLink to="/" class="text-sm text-ob-accent">База знаний</RouterLink>
          <RouterLink to="/" class="text-sm text-ob-muted hover:text-ob-text transition-all duration-200">Регламенты</RouterLink>
          <RouterLink to="/" class="text-sm text-ob-muted hover:text-ob-text transition-all duration-200">FAQ</RouterLink>
          <RouterLink to="/" class="text-sm text-ob-muted hover:text-ob-text transition-all duration-200">Шаблоны</RouterLink>
        </nav>

        <div class="flex items-center gap-3">
          <button 
            v-if="isLoggedIn" 
            @click="logout"
            class="border border-ob-accent text-ob-accent hover:bg-ob-accent hover:text-ob-base transition-all duration-200 text-sm font-bold px-4 py-1.5 rounded"
          >
            Выйти
          </button>
          <RouterLink 
            v-else 
            to="/login" 
            class="border border-ob-accent text-ob-accent hover:bg-ob-accent hover:text-ob-base transition-all duration-200 text-sm font-bold px-4 py-1.5 rounded"
          >
            Войти
          </RouterLink>

          <RouterLink to="/profile" class="bg-ob-accent text-ob-base hover:opacity-90 transition-all duration-200 text-sm font-bold px-4 py-1.5 rounded">
            Мой кабинет
          </RouterLink>
        </div>
      </div>
    </header>

    <main class="w-full flex-grow pt-14">
      <router-view />
    </main>

    <footer class="border-t border-ob-border mt-auto">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-xs text-ob-muted font-mono">© 2026 Oblivione Group</span>
        </div>
        <div class="flex items-center gap-6">
          <RouterLink to="#" class="text-xs text-ob-muted hover:text-ob-text transition-all duration-200">Политика</RouterLink>
          <RouterLink to="#" class="text-xs text-ob-muted hover:text-ob-text transition-all duration-200">Контакты</RouterLink>
          <RouterLink to="#" class="text-xs text-ob-muted hover:text-ob-text transition-all duration-200">Docs</RouterLink>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(!!localStorage.getItem('token'))

// Следим за сменой страницы: как только пользователь перемещается по сайту,
// мы обновляем статус авторизации в шапке
watch(
  () => route.path,
  () => {
    isLoggedIn.value = !!localStorage.getItem('token')
  }
)

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  isLoggedIn.value = false
  router.push('/login')
}
</script>
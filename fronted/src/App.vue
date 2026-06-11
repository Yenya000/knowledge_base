<template>
  <div id="app" class="min-h-screen bg-obl-base text-obl-primary font-sans antialiased flex flex-col">

    <header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-obl-base/80 border-b border-obl-border-subtle h-14">
      <div class="max-w-7xl mx-auto px-obl-6 flex items-center justify-between h-full">

        <RouterLink to="/" class="flex gap-obl-3 items-center">
          <div class="w-6 h-6 bg-obl-accent" style="clip-path: polygon(50% 0%,85% 15%,100% 50%,85% 85%,50% 100%,15% 85%,0% 50%,15% 15%)"></div>
          <span class="font-bold text-primary">OBLIVIONE</span>
          <span class="font-bold text-obl-accent">|</span>
          <span class="font-bold text-primary">BASE</span>
        </RouterLink>

        <nav class="hidden md:flex gap-obl-8">
          <RouterLink to="/" class="text-sm transition-all duration-200" :class="isActiveSection('/') ? 'text-obl-accent' : 'text-obl-muted hover:text-obl-primary'">База знаний</RouterLink>
          <RouterLink to="/reglamenty" class="text-sm transition-all duration-200" :class="isActiveSection('/reglamenty') ? 'text-obl-accent' : 'text-obl-muted hover:text-obl-primary'">Регламенты</RouterLink>
          <RouterLink to="/faq" class="text-sm transition-all duration-200" :class="isActiveSection('/faq') ? 'text-obl-accent' : 'text-obl-muted hover:text-obl-primary'">FAQ</RouterLink>
          <RouterLink to="/" class="text-sm transition-all duration-200" :class="isActiveSection('/templates') ? 'text-obl-accent' : 'text-obl-muted hover:text-obl-primary'">Шаблоны</RouterLink>
        </nav>

        <div class="flex items-center gap-obl-3">
          <button v-if="isLoggedIn" @click="logout" class="btn btn-ghost btn-sm mobile-hidden">
            Выйти
          </button>
          <RouterLink v-else to="/login" class="btn btn-ghost btn-sm mobile-hidden">
            Войти
          </RouterLink>
          <RouterLink to="/profile" class="btn btn-primary btn-sm mobile-hidden">
            Мой кабинет
          </RouterLink>

          <!-- Кнопка гамбургер (только mobile) -->
          <button class="md:hidden btn btn-subtle btn-sm" @click="mobileMenuOpen = !mobileMenuOpen">
            ☰
          </button>
        </div>
      </div>
    </header>

    <!-- Мобильное меню -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden fixed top-14 left-0 right-0 z-40 slide-down"
      style="background: var(--bg-nav); border-bottom: 1px solid var(--border-subtle)"
    >
      <nav class="flex flex-col px-6 py-4 gap-4">
        <RouterLink to="/" class="text-sm transition-all duration-200" :class="isActiveSection('/') ? 'text-obl-accent' : 'text-obl-muted'" @click="mobileMenuOpen = false">База знаний</RouterLink>
        <RouterLink to="/reglamenty" class="text-sm transition-all duration-200" :class="isActiveSection('/reglamenty') ? 'text-obl-accent' : 'text-obl-muted'" @click="mobileMenuOpen = false">Регламенты</RouterLink>
        <RouterLink to="/faq" class="text-sm transition-all duration-200" :class="isActiveSection('/faq') ? 'text-obl-accent' : 'text-obl-muted'" @click="mobileMenuOpen = false">FAQ</RouterLink>
        <RouterLink to="/" class="text-sm transition-all duration-200" :class="isActiveSection('/templates') ? 'text-obl-accent' : 'text-obl-muted'" @click="mobileMenuOpen = false">Шаблоны</RouterLink>
        <div class="pt-2 border-t border-obl-border-subtle flex gap-3">
          <button v-if="isLoggedIn" @click="logout" class="btn btn-ghost btn-sm">
            Выйти
          </button>
          <RouterLink v-else to="/login" class="btn btn-ghost btn-sm" @click="mobileMenuOpen = false">
            Войти
          </RouterLink>
          <RouterLink to="/profile" class="btn btn-primary btn-sm" @click="mobileMenuOpen = false">
            Мой кабинет
          </RouterLink>
        </div>
      </nav>
    </div>

    <main class="w-full flex-grow pt-14">
      <router-view />
    </main>

    <footer class="border-t border-obl-border-subtle mt-auto">
      <div class="max-w-7xl mx-auto px-obl-6 py-obl-4 flex items-center justify-between">
        <span class="text-xs text-obl-muted font-mono">© 2026 Oblivione Group</span>
        <div class="flex items-center gap-obl-6">
          <RouterLink to="#" class="text-xs text-obl-muted hover:text-obl-primary transition-all duration-200">Политика</RouterLink>
          <RouterLink to="#" class="text-xs text-obl-muted hover:text-obl-primary transition-all duration-200">Контакты</RouterLink>
          <RouterLink to="#" class="text-xs text-obl-muted hover:text-obl-primary transition-all duration-200">Docs</RouterLink>
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
const mobileMenuOpen = ref(false)

watch(
  () => route.path,
  () => {
    isLoggedIn.value = !!localStorage.getItem('token')
    mobileMenuOpen.value = false
  }
)

const isActiveSection = (section: string) => {
  if (section === '/') return route.path === '/' || route.path.startsWith('/article')
  return route.path === section
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  isLoggedIn.value = false
  mobileMenuOpen.value = false
  router.push('/login')
}
</script>

<template>
  <div id="app" class="min-h-screen bg-obl-base text-obl-primary font-sans antialiased">
    
    <nav class="bg-obl-elevated/80 backdrop-blur-md border-b border-obl-border-subtle px-obl-8 py-obl-4 flex items-center justify-between sticky top-0 z-50">
      <div class="flex items-center gap-obl-6">
        <router-link to="/" class="font-mono text-xs tracking-widest text-obl-muted hover:text-obl-accent transition-colors">
          // OBLIVION_CORE
        </router-link>
        
        <div class="flex items-center gap-obl-4 text-sm font-medium">
          <router-link 
            to="/" 
            class="hover:text-obl-accent transition-colors" 
            active-class="text-obl-accent"
          >
            Главная
          </router-link>
          
          <router-link 
            to="/profile" 
            class="hover:text-obl-accent transition-colors" 
            active-class="text-obl-accent"
          >
            Личный кабинет
          </router-link>
        </div>
      </div>

      <div>
        <router-link 
          to="/admin" 
          class="text-xs font-mono px-obl-3 py-obl-1 rounded-obl-sm bg-red-900/10 border border-red-500/20 text-red-400 hover:bg-red-900/30 transition-all"
          active-class="border-red-500/60 bg-red-900/40"
        >
          [ADMIN_PANEL]
        </router-link>
      </div>
    </nav>

    <main class="w-full">
      <router-view />
    </main>

  </div>
</template>

<script setup lang="ts">
// Скрипт пока пустой, всё управление идет через роутер
</script>

<style>
/* Все глобальные стили боди у нас уже лежат в global.css и подтягиваются через Tailwind.
  Поэтому тег <style> оставляем абсолютно чистым, чтобы не дублировать код.
*/
</style>
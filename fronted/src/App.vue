<template>
  <div id="app" class="min-h-screen bg-obl-base text-obl-primary font-sans antialiased">
    
    <nav class="w-full bg-obl-elevated/80 backdrop-blur-md border-b border-obl-border-subtle px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      
      <div class="flex items-center gap-8 flex-shrink-0">
        <router-link to="/" class="font-mono text-xs tracking-widest text-obl-muted hover:text-obl-accent transition-colors">
          // OBLIVION_CORE
        </router-link>
        
        <div class="flex items-center gap-6 text-sm font-medium">
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

      <div class="flex-shrink-0">
        <router-link 
          to="/admin" 
          class="text-xs font-mono px-3 py-1 rounded-sm bg-red-900/10 border border-red-500/20 text-red-400 hover:bg-red-900/30 transition-all"
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
// Вся логика роутинга лежит в index.ts
</script>

<style>

</style>
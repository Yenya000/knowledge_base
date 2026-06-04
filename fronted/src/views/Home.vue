
<template>
  <section class="px-6 py-20 max-w-7xl mx-auto">
    
    <!-- Заголовок  -->
    <div class="mb-8">
      <p class="font-mono uppercase tracking-widest text-xs text-ob-accent mb-3">// KNOWLEDGE BASE - OBLIVIONE GROUP</p>
      <h1 class="text-4xl font-extrabold leading-tight mb-3">
        Всё, что нужно <br>знать –
        <span class="text-ob-accent">здесь</span>
      </h1>
      <p class="text-sm text-ob-muted">Инструкции, регламенты, шаблоны и документация компании</p>
    </div>

    <!-- Поисковая строка (ДОБАВЛЕН v-model) -->
    <!-- добавлен двусторонний binding для поиска -->
    <div class="flex items-center border border-ob-border bg-ob-surface rounded-lg px-4 h-11 max-w-lg">
      <input 
        v-model="searchQuery"
        type="text" 
        class="!border-0 !bg-transparent !p-0 outline-none flex-1 text-sm text-ob-text placeholder:text-ob-muted" 
        placeholder="Поиск по базе знаний...">
      <span class="text-xs text-ob-muted font-mono border border-ob-border px-2 rounded">⌘K</span>
    </div>

    <!-- Теги (ДИНАМИЧЕСКИЕ) -->
    <!-- категории загружаются из массива, добавлен active-класс -->
    <div class="flex gap-2 mt-6 flex-wrap">
      <button 
        @click="selectedCategory = ''" 
        :class="selectedCategory === '' ? 'border-ob-accent text-ob-accent bg-ob-accent/10' : 'border-ob-border text-ob-muted hover:border-ob-accent hover:text-ob-accent'"
        class="text-xs px-3 py-1 rounded-full border transition-all duration-200">
        Все
      </button>
      <button 
        v-for="cat in categories" 
        :key="cat"
        @click="selectedCategory = cat"
        :class="selectedCategory === cat ? 'border-ob-accent text-ob-accent bg-ob-accent/10' : 'border-ob-border text-ob-muted hover:border-ob-accent hover:text-ob-accent'"
        class="text-xs px-3 py-1 rounded-full border transition-all duration-200">
        {{ cat }}
      </button>
    </div>

    <!-- Статистика (ДИНАМИЧЕСКАЯ из бэкенда) -->
    <!-- цифры теперь берутся из реальных данных -->
    <div class="flex gap-6 mt-8 pb-6 border-b border-ob-border font-mono text-xs text-ob-muted">
      <div><span class="text-ob-accent font-bold">{{ articles.length }}</span> статьи</div>
      <div><span class="text-ob-accent font-bold">{{ categories.length }}</span> раздела</div>
      <div><span class="text-ob-accent font-bold">{{ recentArticles.length }}</span> обновлено за неделю</div>
    </div>

    <!-- НОВЫЙ БЛОК: Недавно обновленные  -->
    <div v-if="recentArticles.length > 0" class="mt-8 mb-12">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-ob-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="text-xs font-mono text-ob-accent uppercase tracking-wider">// Недавно обновленные</span>
        </div>
        <span class="text-xs text-ob-muted font-mono">за последние 7 дней</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <router-link 
          v-for="article in recentArticles.slice(0, 5)" 
          :key="article.id"
          :to="`/article/${article.id}`"
          class="bg-ob-surface/50 hover:bg-ob-surface border border-ob-border-subtle hover:border-ob-border-default rounded-lg p-3 transition-all duration-200 group">
          <div class="text-[10px] font-mono text-ob-accent uppercase tracking-widest mb-1 truncate">{{ article.category_name || 'General' }}</div>
          <h4 class="text-sm font-semibold text-ob-text mb-1 line-clamp-2 group-hover:text-ob-accent transition-colors">{{ article.title }}</h4>
          <div class="text-[10px] text-ob-muted font-mono mt-2">{{ formatRelativeDate(article.updated_at) }}</div>
        </router-link>
      </div>
    </div>

    <!-- Состояние загрузки для недавно обновленных -->
    <div v-if="recentLoading" class="mt-8 mb-12">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 border-2 border-ob-accent border-t-transparent rounded-full animate-spin"></div>
        <span class="text-xs text-ob-muted font-mono">Загрузка обновлений...</span>
      </div>
    </div>

    <!-- Карточки статей (ДИНАМИЧЕСКИЕ) -->
    <!-- карточки теперь рендерятся из данных бэкенда -->
    <div class="grid mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ob-border">
      
      <router-link 
        v-for="article in filteredArticles" 
        :key="article.id"
        :to="`/article/${article.id}`"
        class="bg-ob-surface p-5 hover:bg-ob-surface/80 transition-all duration-200 flex flex-col">
        <div class="text-xs font-mono text-ob-accent uppercase tracking-widest mb-2">{{ article.category_name || 'General' }}</div>
        <h3 class="text-base font-semibold text-ob-text mb-2 line-clamp-2">{{ article.title }}</h3>
        <p class="text-sm text-ob-muted leading-relaxed mb-4 flex-1 line-clamp-3">{{ article.content }}</p>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-ob-accent opacity-50 inline-block"></span>
            <span class="text-xs text-ob-muted font-mono">{{ formatRelativeDate(article.updated_at) }}</span>
          </div>
          <span class="text-ob-accent text-sm">→</span>
        </div>
      </router-link>

      <!-- Состояние когда нет статей -->
      <div v-if="filteredArticles.length === 0 && !loading" class="col-span-full bg-ob-surface p-12 text-center">
        <p class="text-ob-muted font-mono text-sm">Статьи не найдены</p>
      </div>

    </div>
  </section>
</template>

<script setup>


import { ref, onMounted, computed } from 'vue'
import api from '../api'

// ========== ДАННЫЕ ==========
const articles = ref([])
const categories = ref(['IT', 'HR', 'Финансы', 'Маркетинг', 'Юридический'])
const searchQuery = ref('')
const selectedCategory = ref('')
const loading = ref(true)
const recentArticles = ref([])
const recentLoading = ref(true)

// ========== ЗАГРУЗКА СТАТЕЙ ИЗ БЭКЕНДА ==========
const fetchArticles = async () => {
  loading.value = true
  try {
    const res = await api.get('/articles')
    articles.value = res.data
  } catch (e) {
    console.error('Ошибка загрузки статей:', e)
  } finally {
    loading.value = false
  }
}

// ========== НОВАЯ ФУНКЦИЯ: ЗАГРУЗКА НЕДАВНО ОБНОВЛЕННЫХ  ==========
const fetchRecentArticles = async () => {
  recentLoading.value = true
  try {
    const res = await api.get('/articles/recent')
    recentArticles.value = res.data.slice(0, 5)
  } catch (e) {
    console.error('Ошибка загрузки недавно обновленных статей:', e)
    recentArticles.value = []
  } finally {
    recentLoading.value = false
  }
}

// ========== НОВАЯ ФУНКЦИЯ: ФОРМАТИРОВАНИЕ ОТНОСИТЕЛЬНОЙ ДАТЫ ==========
const formatRelativeDate = (dateString) => {
  if (!dateString) return 'Дата неизвестна'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'сегодня'
  if (diffDays === 1) return 'вчера'
  if (diffDays < 7) return `${diffDays} дня назад`
  if (diffDays < 14) return 'неделю назад'
  
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

// ========== ФИЛЬТРАЦИЯ СТАТЕЙ ==========
const filteredArticles = computed(() => {
  return articles.value.filter(a => {
    const matchesCat = !selectedCategory.value || a.category_name === selectedCategory.value
    const matchesSearch = !searchQuery.value || a.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCat && matchesSearch
  })
})

// ========== ЗАГРУЗКА ПРИ МОНТИРОВАНИИ ==========
onMounted(async () => {
  await Promise.all([
    fetchArticles(),
    fetchRecentArticles()
  ])
})
</script>

<style scoped>
/* Анимация спиннера - только для загрузки */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>
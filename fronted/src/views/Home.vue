<template>
  <section class="px-4 py-8 sm:px-6 md:px-8 md:py-12 max-w-7xl mx-auto">
    <div class="mb-obl-8">
      <p class="label mb-obl-3">// KNOWLEDGE BASE - OBLIVIONE GROUP</p>
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-obl-3">
        Всё, что нужно <br>знать — <span class="text-obl-accent">здесь</span>
      </h1>
      <p class="text-sm text-obl-secondary">Инструкции, регламенты, шаблоны и документация компании</p>
    </div>

    <!-- Поиск -->
    <div class="w-full sm:max-w-lg">
      <input v-model="searchQuery" type="search" class="input" placeholder="Поиск по базе знаний..." />
    </div>

    <!-- Статистика -->
    <div class="flex flex-wrap gap-4 mt-obl-6 text-xs font-mono text-obl-muted">
      <span><span class="text-obl-primary font-bold">{{ articles.length }}</span> статей</span>
      <span><span class="text-obl-primary font-bold">{{ categories.length }}</span> разделов</span>
      <span><span class="text-obl-primary font-bold">{{ recentCount }}</span> обновлено за неделю</span>
    </div>

    <!-- Фильтры -->
    <div class="flex gap-2 mt-obl-6 flex-wrap">
      <button class="tag" :class="{ active: selectedCategory === '' }" @click="selectedCategory = ''">Все</button>
      <button
        v-for="cat in categories"
        :key="cat"
        class="tag"
        :class="{ active: selectedCategory === cat }"
        @click="selectedCategory = cat"
      >{{ cat }}</button>
    </div>

    <!-- Карточки -->
    <div class="grid mt-obl-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-obl-6">

      <!-- Скелетон загрузки -->
      <template v-if="loading">
        <div v-for="i in 6" :key="i" class="card animate-pulse">
          <div class="h-3 bg-[var(--bg-elevated)] rounded w-16 mb-3"></div>
          <div class="h-4 bg-[var(--bg-elevated)] rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-[var(--bg-elevated)] rounded w-full mb-1"></div>
          <div class="h-3 bg-[var(--bg-elevated)] rounded w-2/3"></div>
        </div>
      </template>

      <!-- Статьи -->
      <template v-else>
        <router-link
          v-for="article in filteredArticles"
          :key="article.id"
          :to="`/article/${article.id}`"
          class="card flex flex-col group article-card"
        >
          <div class="flex-1">
            <div class="text-[10px] font-mono text-obl-accent uppercase tracking-widest mb-obl-3">
              {{ article.category_name || 'General' }}
            </div>
            <h3 class="text-base font-semibold text-obl-primary mb-obl-2">{{ article.title }}</h3>
            <p class="text-sm text-obl-secondary leading-relaxed line-clamp-3">{{ article.content }}</p>
          </div>
          <div class="mt-obl-4 pt-obl-2 border-t border-obl-border-subtle flex justify-between items-center">
            <span class="text-[10px] font-mono text-obl-muted">• {{ timeAgo(article.updated_at) }}</span>
            <span class="arrow text-obl-accent text-sm transition-transform duration-200">→</span>
          </div>
        </router-link>
      </template>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api'

const articles = ref([])
const categories = ref(['IT', 'HR', 'Финансы', 'Маркетинг'])
const searchQuery = ref('')
const selectedCategory = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/articles')
    articles.value = res.data
    const cats = new Set(res.data.map(a => a.category_name).filter(Boolean))
    if (cats.size > 0) categories.value = Array.from(cats)
  } catch (e) {
    console.error('Ошибка загрузки:', e)
  } finally {
    loading.value = false
  }
})

const filteredArticles = computed(() => {
  return articles.value.filter(a => {
    const matchesCat = !selectedCategory.value || a.category_name === selectedCategory.value
    const matchesSearch = !searchQuery.value || a.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCat && matchesSearch
  })
})

const recentCount = computed(() => {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return articles.value.filter(a => new Date(a.updated_at).getTime() > weekAgo).length
})

function timeAgo(dateStr) {
  if (!dateStr) return 'давно'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'сегодня'
  if (days === 1) return '1 день назад'
  if (days < 5) return `${days} дня назад`
  if (days < 21) return `${days} дней назад`
  const weeks = Math.floor(days / 7)
  return `${weeks} нед. назад`
}
</script>

<style scoped>
.article-card {
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.article-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-default);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
.article-card:hover .arrow {
  transform: translateX(3px);
}

/* Минимальная высота тегов на мобильных */
.tag {
  min-height: 28px;
}
</style>

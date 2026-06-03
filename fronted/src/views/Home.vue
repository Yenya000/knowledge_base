<template>
  <!-- Хедер удален, так как он теперь в App.vue -->
  <section class="px-6 py-12 max-w-7xl mx-auto">
    <div class="mb-8">
      <p class="font-mono uppercase tracking-widest text-xs text-ob-accent mb-3">// KNOWLEDGE BASE - OBLIVIONE GROUP</p>
      <h1 class="text-4xl font-extrabold leading-tight mb-3">Всё, что нужно <br>знать – <span class="text-ob-accent">здесь</span></h1>
    </div>

    <!-- Поиск -->
    <div class="flex items-center border border-ob-border bg-ob-surface rounded-lg px-4 h-11 max-w-lg">
      <input v-model="searchQuery" type="text" class="!border-0 !bg-transparent !p-0 outline-none flex-1 text-sm text-ob-text placeholder:text-ob-muted" placeholder="Поиск по базе знаний...">
    </div>

    <!-- Теги -->
    <div class="flex gap-2 mt-6 flex-wrap">
      <button @click="selectedCategory = ''" :class="selectedCategory === '' ? 'bg-ob-accent text-ob-base' : 'border-ob-border text-ob-muted'" class="text-xs px-3 py-1 rounded-full border hover:border-ob-accent transition-all duration-200">Все</button>
      <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat" :class="selectedCategory === cat ? 'bg-ob-accent text-ob-base' : 'border-ob-border text-ob-muted'" class="text-xs px-3 py-1 rounded-full border hover:border-ob-accent transition-all duration-200">
        {{ cat }}
      </button>
    </div>

    <!-- Карточки -->
    <div class="grid mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ob-border">
      <router-link 
        v-for="article in filteredArticles" 
        :key="article.id" 
        :to="`/article/${article.id}`"
        class="bg-ob-surface p-5 hover:bg-ob-surface/80 transition-all duration-200 flex flex-col"
      >
        <div class="text-xs font-mono text-ob-accent uppercase tracking-widest mb-2">{{ article.category_name || 'General' }}</div>
        <h3 class="text-base font-semibold text-ob-text mb-2">{{ article.title }}</h3>
        <p class="text-sm text-ob-muted leading-relaxed mb-4 flex-1 line-clamp-3">{{ article.content }}</p>
        <div class="text-ob-accent text-sm">→</div>
      </router-link>
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

onMounted(async () => {
  try {
    const res = await api.get('/articles')
    articles.value = res.data
  } catch (e) {
    console.error('Ошибка загрузки:', e)
  }
})

const filteredArticles = computed(() => {
  return articles.value.filter(a => {
    const matchesCat = !selectedCategory.value || a.category_name === selectedCategory.value
    const matchesSearch = !searchQuery.value || a.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCat && matchesSearch
  })
})
</script>
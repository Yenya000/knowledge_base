<template>
  <div class="min-h-screen bg-obl-base text-obl-primary p-obl-8 font-sans antialiased">
    <header class="mb-obl-10 border-b border-obl-border-subtle pb-obl-4 flex items-center justify-between">
      <div>
        <span class="label">// Справочный центр</span>
        <h1 class="text-2xl font-extrabold tracking-tight mt-obl-1">OBLIVION | BASE</h1>
      </div>
      <div class="flex items-center gap-obl-3">
        <router-link to="/admin" class="btn btn-ghost btn-sm">Админка</router-link>
        <router-link to="/profile" class="btn btn-subtle btn-sm">Профиль</router-link>
      </div>
    </header>

    <section class="mb-obl-8 flex flex-col md:flex-row gap-obl-4 items-center justify-between">
      <div class="w-full md:w-1/3 flex gap-obl-2">
        <input v-model="searchQuery" type="search" class="input" placeholder="Поиск по названию..." />
      </div>

      <div class="flex flex-wrap gap-obl-2">
        <button class="tag" :class="{ active: selectedCategory === '' }" @click="selectedCategory = ''">Все</button>
        <button v-for="cat in categories" :key="cat" class="tag" :class="{ active: selectedCategory === cat }" @click="selectedCategory = cat">
          {{ cat }}
        </button>
      </div>
    </section>

    <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-obl-6">
      <article v-for="article in filteredArticles" :key="article.id" class="card flex flex-col justify-between group">
        <div>
          <div class="flex items-center justify-between mb-obl-3">
            <span class="text-[10px] font-mono px-obl-2 py-0.5 rounded-obl-sm bg-obl-elevated border border-obl-border-default text-obl-accent uppercase">
              {{ article.category_name || 'Без категории' }}
            </span>
          </div>
          <h3 class="text-md font-bold text-obl-primary mb-obl-2">{{ article.title }}</h3>
          <p class="text-sm text-obl-secondary line-clamp-3 mb-obl-4">{{ article.content }}</p>
        </div>
        <!-- Теги пока не приходят с бэка, можно убрать или оставить заглушку -->
        <div class="flex flex-wrap gap-obl-1 pt-obl-2 border-t border-obl-border-subtle">
          <span class="text-[10px] font-mono text-obl-muted">#{{ article.category_name?.toLowerCase() || 'general' }}</span>
        </div>
      </article>
    </main>
  </div>
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
    const response = await api.get('/articles')
    articles.value = response.data
    // Извлекаем уникальные категории из полученных статей
    const cats = new Set(articles.value.map(a => a.category_name).filter(Boolean))
    if (cats.size > 0) categories.value = Array.from(cats)
  } catch (error) {
    console.error('Ошибка загрузки статей:', error)
    // Заглушки, если сервер не отвечает
    articles.value = [
      { id: 1, title: 'Настройка корпоративного VPN WireGuard', category_name: 'IT', content: 'Инструкция по настройке...' },
      { id: 2, title: 'Как оформить ДМС сотрудника', category_name: 'HR', content: 'Информация о страховке...' }
    ]
  }
})

const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    const matchesCategory = !selectedCategory.value || article.category_name === selectedCategory.value
    const cleanQuery = searchQuery.value.trim().toLowerCase()
    const matchesSearch = !cleanQuery || article.title.toLowerCase().includes(cleanQuery)
    return matchesCategory && matchesSearch
  })
})
</script>
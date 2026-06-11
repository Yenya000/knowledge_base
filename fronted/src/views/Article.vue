

<template>
  <div class="min-h-screen bg-obl-base text-obl-primary font-sans antialiased">
    <div class="max-w-4xl mx-auto px-obl-6 py-obl-8">
      
      <!-- ХЛЕБНЫЕ КРОШКИ (пункт 4) -->
      <nav class="flex items-center gap-obl-2 text-sm font-mono mb-obl-6 flex-wrap">
        <router-link to="/" class="text-obl-muted hover:text-obl-accent transition-colors duration-200">
          Главная
        </router-link>
        <span class="text-obl-faint">/</span>
        <router-link 
          v-if="article.category_name" 
          :to="`/?category=${encodeURIComponent(article.category_name)}`" 
          class="text-obl-muted hover:text-obl-accent transition-colors duration-200"
        >
          {{ article.category_name }}
        </router-link>
        <span v-else class="text-obl-muted">Категория</span>
        <span class="text-obl-faint">/</span>
        <span class="text-obl-accent truncate">{{ article.title || 'Загрузка...' }}</span>
      </nav>

      <!-- СОСТОЯНИЕ ЗАГРУЗКИ -->
      <div v-if="loading" class="card text-center py-obl-12">
        <div class="loading-spinner mx-auto mb-obl-4"></div>
        <p class="text-obl-muted font-mono text-sm">Загрузка статьи...</p>
      </div>

      <!-- СОСТОЯНИЕ ОШИБКИ -->
      <div v-else-if="error" class="card border-red-500/40 bg-red-900/10 text-center py-obl-12">
        <div class="text-red-400 text-4xl mb-obl-4">⚠️</div>
        <p class="text-red-400 font-mono text-sm">{{ error }}</p>
        <button @click="fetchArticle" class="btn btn-primary mt-obl-6">
          Попробовать снова
        </button>
      </div>

      <!-- СОДЕРЖИМОЕ СТАТЬИ -->
      <article v-else class="card hover:border-obl-border-default transition-all duration-300">
        
        <!-- Верхняя панель: категория + просмотры -->
        <div class="flex items-center justify-between mb-obl-4 flex-wrap gap-obl-3">
          <span class="label px-obl-2 py-obl-1 bg-obl-elevated/50 rounded-obl-sm">
            {{ article.category_name || 'Без категории' }}
          </span>
          
          <div class="flex items-center gap-obl-3 text-obl-muted font-mono text-xs">
            <!-- Иконка просмотров -->
            <div class="flex items-center gap-obl-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{{ article.views || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- ЗАГОЛОВОК -->
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-obl-6 leading-tight">
          {{ article.title }}
        </h1>

        <!-- МЕТА-ИНФОРМАЦИЯ: автор и даты -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-obl-4 pb-obl-6 mb-obl-6 border-b border-obl-border-subtle">
          <!-- Блок автора -->
          <div class="flex items-center gap-obl-3">
            <div class="w-10 h-10 rounded-full bg-obl-elevated border border-obl-border-default flex items-center justify-center">
              <span class="text-obl-accent font-mono text-sm font-bold">
                {{ getAuthorInitials(article.author_employee_id) }}
              </span>
            </div>
            <div>
              <p class="text-obl-primary font-medium">{{ article.author_employee_id || 'Неизвестный автор' }}</p>
              <p class="text-obl-muted text-xs font-mono">
                {{ formatDate(article.created_at) }}
              </p>
            </div>
          </div>
          
          <!-- Дата обновления (если отличается) -->
          <div v-if="article.updated_at && article.updated_at !== article.created_at" 
               class="flex items-center gap-obl-2 text-xs font-mono text-obl-muted bg-obl-elevated/30 px-obl-3 py-obl-1 rounded-obl-pill">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Обновлено: {{ formatDate(article.updated_at) }}</span>
          </div>
        </div>

        <!-- ТЕЛО СТАТЬИ с форматированием -->
        <div class="prose prose-invert max-w-none">
          <div class="whitespace-pre-wrap text-obl-secondary leading-relaxed font-sans">
            {{ article.content }}
          </div>
        </div>

        <!-- ТЕГИ (заглушка для будущего, пункт 3.4 ТЗ) -->
        <div v-if="article.tags && article.tags.length" class="mt-obl-8 pt-obl-6 border-t border-obl-border-subtle">
          <h3 class="text-sm font-mono text-obl-muted mb-obl-3 uppercase tracking-wider">Теги</h3>
          <div class="flex flex-wrap gap-obl-2">
            <span v-for="tag in article.tags" :key="tag" 
                  class="tag text-xs px-obl-3 py-obl-1">
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- КНОПКА НАЗАД -->
        <div class="mt-obl-8 pt-obl-6 border-t border-obl-border-subtle">
          <router-link to="/" class="btn btn-subtle inline-flex items-center gap-obl-2 group transition-all duration-200">
            <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к списку статей
          </router-link>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
/**
 * КОМПОНЕНТ: Article.vue
 * АВТОР: Мирук Анна
 * ЗАДАЧА: Страница отдельной статьи
 * 
 * ВЫПОЛНЕННЫЕ ЗАДАЧИ:
 * 1. GET-запрос к бэкенду /api/articles/:id
 * 2. Отображение заголовка, содержимого, категории
 * 3. Отображение автора, даты создания и обновления
 * 4. Отображение количества просмотров (views)
 * 5. Хлебные крошки (пункт 4 ТЗ)
 * 6. Состояния загрузки и обработка ошибок
 */

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api'

const route = useRoute()
const article = ref({})
const loading = ref(true)
const error = ref('')

/**
 * Получение инициалов автора для аватара
 * @param {string} authorId - ID автора (например OBL-0001)
 * @returns {string} - первые две буквы в верхнем регистре
 */
const getAuthorInitials = (authorId) => {
  if (!authorId) return '??'
  // Берем первые 2 символа или заменяем
  const initials = authorId.replace('OBL-', '').substring(0, 2)
  return initials.toUpperCase()
}

/**
 * Форматирование даты в читаемый вид
 * @param {string} dateString - ISO строка даты
 * @returns {string} - отформатированная дата
 */
const formatDate = (dateString) => {
  if (!dateString) return 'Дата неизвестна'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

/**
 * Загрузка статьи с сервера
 * GET-запрос на /api/articles/:id
 * Бэкенд автоматически увеличивает счетчик просмотров
 */
const fetchArticle = async () => {
  loading.value = true
  error.value = ''
  
  const articleId = route.params.id
  
  try {
    const response = await api.get(`/articles/${articleId}`)
    article.value = response.data
  } catch (err) {
    console.error('Ошибка загрузки статьи:', err)
    
    if (err.response?.status === 404) {
      error.value = 'Статья не найдена'
    } else if (err.response?.status === 401) {
      error.value = 'Требуется авторизация'
    } else {
      error.value = 'Не удалось загрузить статью. Проверьте соединение с сервером.'
    }
  } finally {
    loading.value = false
  }
}

// Загружаем статью при монтировании компонента
onMounted(() => {
  fetchArticle()
})
</script>

<style scoped>
/* Анимация загрузки - в стилях Oblivion */
.loading-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid var(--border-default);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
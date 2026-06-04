<template>
  <div class="min-h-screen">
    <div class="pt-14 flex max-w-7xl mx-auto">

      <!-- Сайдбар -->
      <aside class="hidden md:block w-52 flex-shrink-0 min-h-screen pt-8 pr-4"
             style="border-right: 0.5px solid var(--border-subtle);">
        <div class="mb-6">
          <div class="label mb-3">Разделы</div>
          <div v-for="cat in categories" :key="cat"
               class="text-sm py-1.5 cursor-pointer transition-all duration-200"
               :style="{ color: cat === article.category_name ? 'var(--accent)' : 'var(--text-muted)' }">
            › {{ cat }}
          </div>
        </div>

        <!-- В этом разделе -->
        <div class="mt-6">
          <div class="label mb-3">В этом разделе</div>
          <div v-for="rel in relatedArticles" :key="rel.id" class="py-1.5">
            <RouterLink
              :to="`/article/${rel.id}`"
              class="text-sm cursor-pointer transition-all duration-200 block"
              :style="{ color: String(route.params.id) === String(rel.id) ? 'var(--accent)' : 'var(--text-muted)' }"
            >› {{ rel.title }}</RouterLink>
          </div>
        </div>
      </aside>

      <!-- Контент -->
      <main class="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8 max-w-3xl min-w-0">

        <!-- Хлебные крошки + кнопки экспорта -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div class="flex items-center gap-2 text-xs font-mono min-w-0" style="color: var(--text-muted)">
            <RouterLink to="/" style="color: var(--text-muted)" class="flex-shrink-0">База знаний</RouterLink>
            <span class="flex-shrink-0">›</span>
            <span class="flex-shrink-0">{{ article.category_name || '...' }}</span>
            <span class="flex-shrink-0">›</span>
            <span class="truncate" style="color: var(--text-primary)">{{ article.title || '...' }}</span>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button @click="downloadPDF" class="btn btn-ghost btn-sm">↓ PDF</button>
            <button @click="downloadWord" class="btn btn-subtle btn-sm">↓ Word</button>
          </div>
        </div>

        <!-- Скелетон при загрузке -->
        <div v-if="!article.title" class="animate-pulse space-y-3 mb-6">
          <div class="h-8 rounded w-3/4" style="background: var(--bg-elevated);"></div>
          <div class="h-4 rounded w-1/2" style="background: var(--bg-elevated);"></div>
        </div>

        <!-- Заголовок -->
        <h1 v-else class="text-3xl font-extrabold leading-tight mb-4" style="letter-spacing: -0.02em;">
          {{ article.title }}
        </h1>

        <!-- Мета -->
        <div class="flex items-center gap-6 text-xs font-mono pb-6 mb-6"
             style="color: var(--text-muted); border-bottom: 0.5px solid var(--border-subtle);">
          <span>автор: {{ article.author || 'Неизвестен' }}</span>
          <span>обновлено {{ formatDate(article.updated_at) }}</span>
          <span>~{{ readTime }} мин. чтения</span>
        </div>

        <!-- Тело статьи -->
        <div class="article-body" v-html="article.content || 'Загрузка...'"></div>

        <!-- Теги -->
        <div v-if="article.tags && article.tags.length"
             class="flex flex-wrap gap-2 mt-8 pt-6"
             style="border-top: 0.5px solid var(--border-subtle);">
          <span v-for="tag in article.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>

        <!-- Кнопка назад -->
        <div class="mt-8">
          <button @click="$router.back()" class="text-sm font-mono transition-all duration-200"
                  style="color: var(--text-muted)">
            ← Назад
          </button>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api'

const route = useRoute()
const article = ref({})
const categories = ref(['IT', 'HR', 'Финансы', 'Маркетинг', 'Юридический'])

const relatedArticles = ref([
  { id: 1, title: 'Онбординг' },
  { id: 2, title: 'Отпуска' },
  { id: 3, title: 'Оценка сотрудников' },
  { id: 4, title: 'Кодекс поведения' },
])

function formatDate(dateStr) {
  if (!dateStr) return '...'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diff <= 0) return 'сегодня'
  if (diff === 1) return '1 день назад'
  if (diff < 5) return `${diff} дня назад`
  if (diff < 21) return `${diff} дней назад`
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

const readTime = computed(() => {
  if (!article.value.content) return 1
  const words = article.value.content.replace(/<[^>]*>/g, '').split(' ').length
  return Math.max(1, Math.round(words / 200))
})

onMounted(async () => {
  try {
    const res = await api.get(`/articles/${route.params.id}`)
    article.value = res.data
  } catch (e) {
    article.value = {
      title: 'Онбординг нового сотрудника',
      category_name: 'HR',
      author: 'Анна М.',
      updated_at: '4 дня назад',
      content: '<p>Этот документ описывает процесс адаптации нового сотрудника в компании Oblivione Group.</p><h2>01. До первого дня</h2><p>HR-менеджер отправляет приветственное письмо со ссылкой на базу знаний.</p><h2>02. Первый день</h2><p>Получение пропуска, знакомство с командой.</p>',
      tags: ['онбординг', 'hr', 'новый-сотрудник']
    }
  }
})

const downloadPDF = async () => {
  try {
    const res = await api.get(`/articles/${route.params.id}/export/pdf`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a')
    a.href = url
    a.download = `article-${route.params.id}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    alert('Ошибка скачивания PDF')
  }
}

const downloadWord = async () => {
  try {
    const res = await api.get(`/articles/${route.params.id}/export/word`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a')
    a.href = url
    a.download = `article-${route.params.id}.docx`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    alert('Ошибка скачивания Word')
  }
}
</script>

<style scoped>
.article-body :deep(h2) {
  font-size: 15px;
  font-weight: 600;
  color: var(--accent);
  margin: 1.5rem 0 0.6rem;
  letter-spacing: 0.04em;
}
.article-body :deep(p) {
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.8;
}
.article-body :deep(pre),
.article-body :deep(code) {
  background: var(--bg-elevated);
  border: 0.5px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: 0.875rem 1rem;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0.75rem 0;
  line-height: 1.7;
  display: block;
}
</style>

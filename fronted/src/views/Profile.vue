<template>
  <div class="min-h-screen pt-14 flex max-w-7xl mx-auto">

    <!-- ===================== SIDEBAR (скрыт на мобильных) ===================== -->
    <aside
      class="hidden md:flex flex-col w-48 flex-shrink-0 min-h-screen pt-8 pr-6"
      style="border-right: 0.5px solid var(--border-subtle);"
    >
      <!-- Аватар + мета -->
      <div class="flex flex-col items-center text-center mb-6">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mb-3 select-none"
          style="background: var(--bg-elevated); border: 1px solid var(--border-default); color: var(--accent); font-family: var(--font-mono);"
        >
          {{ initials }}
        </div>
        <span class="text-sm font-bold leading-tight" style="color: var(--text-primary);">Полынский Дмитрий</span>
        <span
          class="text-[10px] mt-1 uppercase tracking-widest"
          style="font-family: var(--font-mono); color: var(--text-muted);"
        >UI/UX · FRONTEND</span>
        <span
          class="text-[10px] mt-0.5"
          style="font-family: var(--font-mono); color: var(--text-faint);"
        >ID: OBL-0042</span>
      </div>

      <div class="divider mb-4"></div>

      <!-- Навигация -->
      <nav class="flex flex-col gap-0.5">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="flex items-center gap-2 text-left px-3 py-2 rounded text-xs w-full transition-all duration-150"
          :class="activeSection === item.id ? 'nav-item-active' : 'nav-item'"
          :style="item.destructive ? 'color: #e05252;' : ''"
          @click="activeSection = item.id"
        >
          {{ item.label }}
        </button>

        <!-- Только для admin -->
        <RouterLink
          v-if="userRole === 'admin'"
          to="/admin"
          class="flex items-center gap-2 px-3 py-2 rounded text-xs w-full transition-all duration-150"
          style="color: var(--accent); background: var(--accent-dim);"
        >
          Панель управления
        </RouterLink>

      </nav>
    </aside>

    <!-- ===================== MAIN ===================== -->
    <main class="flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-8 min-w-0">

      <!-- Мобильная шапка профиля (только mobile, вместо сайдбара) -->
      <div class="md:hidden flex items-center gap-4 mb-6 pb-6" style="border-bottom: 0.5px solid var(--border-subtle);">
        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
             style="background: var(--bg-elevated); border: 1px solid var(--border-default); color: var(--accent); font-family: var(--font-mono);">
          {{ initials }}
        </div>
        <div class="min-w-0">
          <p class="text-sm font-bold truncate" style="color: var(--text-primary);">Полынский Дмитрий</p>
          <p class="text-[10px] uppercase tracking-widest" style="font-family: var(--font-mono); color: var(--text-muted);">UI/UX · FRONTEND · OBL-0042</p>
        </div>
        <RouterLink v-if="userRole === 'admin'" to="/admin" class="btn btn-ghost btn-sm ml-auto flex-shrink-0">Админ</RouterLink>
        <button @click="handleLogout" class="btn btn-subtle btn-sm flex-shrink-0" :class="userRole === 'admin' ? '' : 'ml-auto'">Выйти</button>
      </div>

      <!-- ---- Секция 1: Учётная запись ---- -->
      <section class="mb-10">
        <p class="label mb-2">// УЧЁТНАЯ ЗАПИСЬ</p>
        <h2 class="text-xl font-bold mb-6" style="color: var(--text-primary);">Данные сотрудника</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- ФИО -->
          <div class="data-card">
            <span class="data-label">ФИО</span>
            <span class="data-value">{{ userName }}</span>
          </div>

          <!-- ID сотрудника -->
          <div class="data-card">
            <span class="data-label">ID СОТРУДНИКА</span>
            <span class="data-value" style="font-family: var(--font-mono);">{{ userId }}</span>
          </div>

          <!-- Отдел -->
          <div class="data-card">
            <span class="data-label">ОТДЕЛ</span>
            <span class="data-value">Разработка · UI/UX</span>
          </div>

          <!-- Email -->
          <div class="data-card">
            <span class="data-label">EMAIL</span>
            <span class="data-value text-sm" style="font-family: var(--font-mono); word-break: break-all;">d.polynskiy@oblivione.ru</span>
          </div>

          <!-- Роль -->
          <div class="data-card">
            <span class="data-label">РОЛЬ</span>
            <div class="mt-1">
              <button class="btn btn-ghost btn-sm">&#9998; Редактор</button>
            </div>
          </div>

          <!-- Статус -->
          <div class="data-card">
            <span class="data-label">СТАТУС</span>
            <div class="flex items-center gap-2 mt-2">
              <span
                class="w-2 h-2 rounded-full flex-shrink-0"
                style="background: #4ade80;"
              ></span>
              <span class="text-sm font-semibold" style="color: #4ade80;">Активен</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ---- Секция 2: Активность ---- -->
      <section class="mb-10">
        <p class="label mb-2">// АКТИВНОСТЬ</p>
        <h2 class="text-xl font-bold mb-6" style="color: var(--text-primary);">Последние действия</h2>

        <div class="flex flex-col gap-3 mb-8">
          <div
            v-for="item in recentActivity"
            :key="item.title"
            class="flex items-center gap-3 px-4 py-3 rounded transition-all duration-150"
            style="border: 1px solid var(--border-subtle); background: var(--bg-surface);"
          >
            <!-- Иконка -->
            <div
              class="w-8 h-8 rounded flex-shrink-0"
              style="background: var(--bg-elevated);"
            ></div>

            <!-- Текст -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ item.title }}</p>
              <p class="text-xs mt-0.5" style="color: var(--text-muted);">
                {{ item.action }} · {{ item.time }}
              </p>
            </div>

            <!-- Категория -->
            <span class="tag flex-shrink-0">{{ item.cat }}</span>
          </div>
        </div>

        <!-- Избранные статьи -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold" style="color: var(--text-primary);">Избранное</h3>
          <button class="btn btn-subtle btn-sm">Смотреть все</button>
        </div>

        <div class="flex flex-col gap-2">
          <div
            v-for="fav in favorites"
            :key="fav.id"
            class="flex items-center gap-3 px-4 py-3 rounded cursor-pointer transition-all duration-150"
            style="border: 1px solid var(--border-subtle); background: var(--bg-surface);"
          >
            <span class="text-sm" style="color: var(--text-secondary);">{{ fav.title }}</span>
          </div>
        </div>
      </section>

      <!-- ---- Секция 3: Дополнительно ---- -->
      <section>
        <p class="label mb-2">// ДОПОЛНИТЕЛЬНО</p>
        <h2 class="text-xl font-bold mb-6" style="color: var(--text-primary);">Действия</h2>

        <div class="flex flex-col gap-4">

          <!-- Предложение -->
          <div class="action-card">
            <div class="flex items-center justify-between mb-1">
              <p class="text-sm font-semibold" style="color: var(--text-primary);">Предложение</p>
              <button
                class="text-xs font-mono transition-all duration-150"
                style="color: var(--text-muted);"
                @click="showSuggestion = !showSuggestion"
              >{{ showSuggestion ? '✕ закрыть' : '+ написать' }}</button>
            </div>
            <p class="text-xs mb-3" style="color: var(--text-muted);">Предложить улучшение базы знаний</p>
            <div v-if="showSuggestion" class="flex flex-col gap-2">
              <textarea
                v-model="suggestionText"
                class="input min-h-[80px] resize-none text-sm"
                placeholder="Опишите ваше предложение..."
              ></textarea>
              <button class="btn btn-ghost btn-sm self-end" @click="submitSuggestion">Отправить</button>
            </div>
          </div>

          <!-- Сообщить о нарушении -->
          <div class="action-card">
            <div class="flex items-center justify-between mb-1">
              <p class="text-sm font-semibold" style="color: var(--text-primary);">Сообщить о нарушении</p>
              <button
                class="text-xs font-mono transition-all duration-150"
                style="color: var(--text-muted);"
                @click="showComplaint = !showComplaint"
              >{{ showComplaint ? '✕ закрыть' : '+ написать' }}</button>
            </div>
            <p class="text-xs mb-3" style="color: var(--text-muted);">Анонимная форма для обращений</p>
            <div v-if="showComplaint" class="flex flex-col gap-2">
              <textarea
                v-model="complaintText"
                class="input min-h-[80px] resize-none text-sm"
                placeholder="Опишите ситуацию..."
              ></textarea>
              <button class="btn btn-ghost btn-sm self-end" @click="submitComplaint">Отправить</button>
            </div>
          </div>

          <!-- Мои предложения -->
          <div class="action-card">
            <p class="text-sm font-semibold mb-1" style="color: var(--text-primary);">Мои предложения</p>
            <p class="text-xs mb-4" style="color: var(--text-muted);">История поданных предложений</p>
            <div class="flex flex-col items-center py-4 gap-2" style="border: 1px dashed var(--border-default); border-radius: var(--radius-sm);">
              <p class="text-xs font-mono" style="color: var(--text-faint);">Предложений пока нет</p>
            </div>
          </div>

        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeSection = ref('profile')

const userName = ref('Полынский Дмитрий Алексеевич')
const userRole = ref(localStorage.getItem('userRole') || 'editor')
const userId = ref('OBL-0042')

const initials = computed(() => {
  const parts = userName.value.split(' ')
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
})

const navItems = [
  { id: 'profile',   icon: '', label: 'Мой профиль' },
  { id: 'favorites', icon: '', label: 'Избранное' },
]

const recentActivity = ref([
  { title: 'Настройка рабочего окружения',    action: 'Просмотрено',   time: '2 дня назад',    cat: 'IT' },
  { title: 'Регламент отпусков и больничных', action: 'Просмотрено',   time: '3 дня назад',    cat: 'HR' },
  { title: 'Гайдлайн бренда Oblivione',       action: 'Отредактировано', time: '1 неделю назад', cat: 'Маркетинг' },
])

const favorites = ref([
  { id: 1, title: 'Настройка рабочего окружения' },
  { id: 2, title: 'Регламент отпусков и больничных' },
  { id: 3, title: 'Структура команды разработки' },
])

const showSuggestion = ref(false)
const showComplaint = ref(false)
const suggestionText = ref('')
const complaintText = ref('')

const submitSuggestion = () => {
  suggestionText.value = ''
  showSuggestion.value = false
}

const submitComplaint = () => {
  complaintText.value = ''
  showComplaint.value = false
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  router.push('/login')
}

</script>

<style scoped>
.data-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.data-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.data-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
}

.action-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  transition: border-color 0.15s ease;
}

.action-card:hover {
  border-color: var(--border-accent);
}

.nav-item {
  color: var(--text-muted);
  font-family: var(--font-sans);
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--bg-elevated);
}

.nav-item-active {
  color: var(--accent);
  background: var(--accent-dim);
  font-family: var(--font-sans);
}
</style>

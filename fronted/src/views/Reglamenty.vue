<template>
  <section class="px-4 py-8 sm:px-6 md:px-8 md:py-12 max-w-7xl mx-auto">

    <!-- Шапка секции -->
    <div class="mb-8">
      <p class="label mb-3">// РЕГЛАМЕНТЫ</p>
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3">
        Регламенты и стандарты
      </h1>
      <p class="text-sm" style="color: var(--text-secondary);">Обязательные к изучению документы компании</p>
    </div>

    <!-- Фильтры -->
    <div class="flex gap-2 flex-wrap mb-8">
      <button
        class="tag"
        :class="{ active: selectedCat === '' }"
        @click="selectedCat = ''"
      >Все</button>
      <button
        v-for="cat in categories"
        :key="cat"
        class="tag"
        :class="{ active: selectedCat === cat }"
        @click="selectedCat = cat"
      >{{ cat }}</button>
    </div>

    <!-- Счётчик результатов -->
    <p class="text-[11px] font-mono mb-6" style="color: var(--text-muted);">
      {{ filtered.length }} {{ filtered.length === 1 ? 'документ' : filtered.length < 5 ? 'документа' : 'документов' }}
    </p>

    <!-- Сетка карточек -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="card reglament-card flex flex-col cursor-pointer"
      >
        <div class="flex-1">
          <!-- Категория -->
          <div
            class="text-[10px] font-mono uppercase tracking-widest mb-3"
            style="color: var(--accent);"
          >{{ item.cat }}</div>

          <!-- Заголовок -->
          <h3 class="text-sm font-semibold mb-2 leading-snug" style="color: var(--text-primary);">
            {{ item.title }}
          </h3>

          <!-- Описание -->
          <p class="text-xs leading-relaxed line-clamp-2 text-muted">{{ item.desc }}</p>
        </div>

        <!-- Нижняя строка -->
        <div
          class="mt-4 pt-3 flex items-center justify-between"
          style="border-top: 1px solid var(--border-subtle);"
        >
          <span class="text-[10px] font-mono" style="color: var(--text-muted);">{{ item.date }}</span>
          <span
            class="text-[10px] font-mono font-semibold"
            :style="item.status === 'Актуален' ? 'color: #4ade80;' : 'color: #facc15;'"
          >{{ item.status }}</span>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div
      v-if="filtered.length === 0"
      class="flex flex-col items-center py-16 gap-3"
    >
      <p class="text-sm font-mono" style="color: var(--text-faint);">Нет документов в категории «{{ selectedCat }}»</p>
      <button class="btn btn-subtle btn-sm" @click="selectedCat = ''">Сбросить фильтр</button>
    </div>

  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const categories = ['HR', 'IT', 'Финансы', 'Безопасность']

const selectedCat = ref('')

const reglamenty = ref([
  { id: 1, title: 'Регламент адаптации новых сотрудников',  cat: 'HR',          date: '15 мая 2026',      status: 'Актуален',    desc: 'Порядок онбординга, первые 30/60/90 дней, ответственные лица.' },
  { id: 2, title: 'Политика информационной безопасности',   cat: 'IT',          date: '1 июня 2026',      status: 'Актуален',    desc: 'Правила работы с корпоративными данными, паролями и устройствами.' },
  { id: 3, title: 'Регламент предоставления отпусков',      cat: 'HR',          date: '10 апреля 2026',   status: 'Актуален',    desc: 'Порядок подачи заявлений, сроки согласования, компенсации.' },
  { id: 4, title: 'Финансовый регламент командировок',      cat: 'Финансы',     date: '20 марта 2026',    status: 'Актуален',    desc: 'Нормы суточных, авансовые отчёты, сроки возмещения расходов.' },
  { id: 5, title: 'Регламент работы службы поддержки IT',   cat: 'IT',          date: '5 мая 2026',       status: 'Актуален',    desc: 'SLA, приоритеты заявок, контакты и время реакции.' },
  { id: 6, title: 'Кодекс корпоративной этики',             cat: 'HR',          date: '1 января 2026',    status: 'Актуален',    desc: 'Ценности компании, нормы поведения, дресс-код.' },
  { id: 7, title: 'Регламент закупок и тендеров',           cat: 'Финансы',     date: '12 февраля 2026',  status: 'На ревизии',  desc: 'Процедуры выбора поставщиков, согласование договоров.' },
  { id: 8, title: 'Политика защиты персональных данных',    cat: 'Безопасность', date: '3 июня 2026',     status: 'Актуален',    desc: 'GDPR, обработка данных сотрудников и клиентов.' },
  { id: 9, title: 'Регламент удалённой работы',             cat: 'HR',          date: '28 апреля 2026',   status: 'Актуален',    desc: 'Правила работы из дома, требования к оборудованию и связи.' },
])

const filtered = computed(() =>
  selectedCat.value
    ? reglamenty.value.filter(r => r.cat === selectedCat.value)
    : reglamenty.value
)
</script>

<style scoped>
.reglament-card {
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.reglament-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-default);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.tag {
  min-height: 28px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

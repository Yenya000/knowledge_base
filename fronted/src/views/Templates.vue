<template>
  <section class="px-4 py-8 sm:px-6 md:px-8 md:py-12 max-w-7xl mx-auto">

    <!-- Шапка -->
    <div class="mb-8">
      <p class="label mb-3">// ШАБЛОНЫ</p>
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3">
        Готовые <span class="text-obl-accent">шаблоны</span> документов
      </h1>
      <p class="text-sm text-obl-secondary">Скачайте и используйте в работе</p>
    </div>

    <!-- Поиск -->
    <div class="w-full sm:max-w-md mb-6">
      <input 
        v-model="searchQuery" 
        type="search" 
        class="input" 
        placeholder="Поиск шаблонов..." 
      />
    </div>

    <!-- Фильтры по категориям -->
    <div class="flex gap-2 flex-wrap mb-8">
      <button 
        class="tag" 
        :class="{ active: selectedCat === '' }" 
        @click="selectedCat = ''"
      >
        Все
      </button>
      <button 
        v-for="cat in categories" 
        :key="cat" 
        class="tag" 
        :class="{ active: selectedCat === cat }" 
        @click="selectedCat = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Результатов: X -->
    <p class="text-[11px] font-mono mb-6 text-obl-muted">
      {{ filteredTemplates.length }} {{ declension(filteredTemplates.length) }}
    </p>

    <!-- Сетка карточек (как у статей) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="item in filteredTemplates" 
        :key="item.id" 
        class="card flex flex-col group cursor-pointer transition-all duration-200 article-card"
        @click="openModal(item)"
      >
        <div class="flex-1">
          <!-- Категория -->
          <div class="text-[10px] font-mono text-obl-accent uppercase tracking-widest mb-3">
            {{ item.cat }}
          </div>
          <!-- Заголовок -->
          <h3 class="text-base font-semibold text-obl-primary mb-2 group-hover:text-obl-accent transition-colors">
            {{ item.title }}
          </h3>
          <!-- Описание -->
          <p class="text-sm text-obl-secondary leading-relaxed line-clamp-3">
            {{ item.description }}
          </p>
        </div>
        <!-- Нижняя часть: формат и размер -->
        <div class="mt-4 pt-3 flex justify-between items-center border-t border-obl-border-subtle">
          <span class="text-[10px] font-mono text-obl-muted">
            {{ item.format }} · {{ item.size }}
          </span>
          <span class="arrow text-obl-accent text-sm transition-transform duration-200">→</span>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div v-if="filteredTemplates.length === 0" class="flex flex-col items-center py-16 gap-3">
      <p class="text-sm font-mono text-obl-faint">Шаблонов не найдено</p>
      <button class="btn btn-subtle btn-sm" @click="selectedCat = ''; searchQuery = ''">
        Сбросить фильтр
      </button>
    </div>

    <!-- Модальное окно -->
    <Transition name="modal">
      <div 
        v-if="selectedItem" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.7); backdrop-blur: 4px;"
        @click.self="closeModal"
      >
        <div class="bg-obl-surface border border-obl-border-default rounded-obl-lg w-full max-w-lg max-h-[85vh] flex flex-col">
          
          <!-- Заголовок -->
          <div class="flex items-start justify-between gap-4 p-6 pb-4 border-b border-obl-border-subtle">
            <div class="flex-1">
              <div class="text-[10px] font-mono text-obl-accent uppercase tracking-widest mb-2">
                {{ selectedItem.cat }}
              </div>
              <h2 class="text-xl font-bold text-obl-primary">{{ selectedItem.title }}</h2>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-[10px] font-mono text-obl-muted">{{ selectedItem.format }} · {{ selectedItem.size }}</span>
              </div>
            </div>
            <button class="btn btn-subtle btn-sm text-xl leading-none px-2 py-1" @click="closeModal">✕</button>
          </div>

          <!-- Содержимое -->
          <div class="p-6 overflow-y-auto flex-1">
            <p class="text-sm text-obl-secondary mb-4">{{ selectedItem.description }}</p>
            
            <div class="bg-obl-elevated rounded-obl-md p-4 mb-4">
              <p class="text-xs font-mono text-obl-muted mb-2">Включает:</p>
              <ul class="text-xs text-obl-secondary space-y-1 list-disc list-inside">
                <li v-for="inc in selectedItem.includes" :key="inc">{{ inc }}</li>
              </ul>
            </div>
            
            <button class="btn btn-primary w-full" @click="downloadTemplate(selectedItem)">
              Скачать {{ selectedItem.format }}
            </button>
          </div>

        </div>
      </div>
    </Transition>

  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedCat = ref('')
const selectedItem = ref(null)

const categories = ['HR', 'IT', 'Финансы', 'Маркетинг', 'Юридический']

const templates = ref([
  {
    id: 1,
    title: 'Должностная инструкция',
    cat: 'HR',
    description: 'Готовый шаблон должностной инструкции для любой позиции',
    format: 'DOCX',
    size: '48 KB',
    includes: ['Общие положения', 'Должностные обязанности', 'Права и ответственность', 'Квалификационные требования']
  },
  {
    id: 2,
    title: 'Заявление на отпуск',
    cat: 'HR',
    description: 'Стандартная форма заявления на ежегодный оплачиваемый отпуск',
    format: 'DOCX',
    size: '32 KB',
    includes: ['Шапка с реквизитами', 'Основной текст заявления', 'Дата и подпись']
  },
  {
    id: 3,
    title: 'Трудовой договор',
    cat: 'Юридический',
    description: 'Типовая форма трудового договора с сотрудником',
    format: 'DOCX',
    size: '76 KB',
    includes: ['Предмет договора', 'Права и обязанности сторон', 'Оплата труда', 'Ответственность', 'Реквизиты']
  },
  {
    id: 4,
    title: 'Акт выполненных работ',
    cat: 'Финансы',
    description: 'Акт приёма-передачи выполненных работ/услуг',
    format: 'DOCX',
    size: '41 KB',
    includes: ['Перечень работ', 'Стоимость', 'Подписи сторон']
  },
  {
    id: 5,
    title: 'Презентация (шаблон)',
    cat: 'Маркетинг',
    description: 'Корпоративный шаблон презентации в стиле Oblivione',
    format: 'PPTX',
    size: '1.2 MB',
    includes: ['Титульный слайд', 'Слайд с целями', 'Слайд с данными', 'Слайд с выводами', 'Благодарность']
  },
  {
    id: 6,
    title: 'Заявка в IT-поддержку',
    cat: 'IT',
    description: 'Форма для подачи заявки в техническую поддержку',
    format: 'DOCX',
    size: '28 KB',
    includes: ['Описание проблемы', 'Срочность', 'Контакты', 'Приоритет']
  },
  {
    id: 7,
    title: 'Авансовый отчёт',
    cat: 'Финансы',
    description: 'Типовая форма для отчёта по командировкам и расходам',
    format: 'XLSX',
    size: '54 KB',
    includes: ['Суммы расходов', 'Приложение чеков', 'Курс валют', 'Итоговая сумма']
  },
  {
    id: 8,
    title: 'NDA (Соглашение о конфиденциальности)',
    cat: 'Юридический',
    description: 'Двустороннее соглашение о неразглашении информации',
    format: 'DOCX',
    size: '39 KB',
    includes: ['Предмет соглашения', 'Обязательства сторон', 'Срок действия', 'Ответственность']
  },
  {
    id: 9,
    title: 'Онбординг-план',
    cat: 'HR',
    description: 'План адаптации нового сотрудника (30-60-90 дней)',
    format: 'XLSX',
    size: '67 KB',
    includes: ['Задачи по неделям', 'Ответственные', 'Дедлайны', 'Чек-лист']
  }
])

const filteredTemplates = computed(() => {
  let result = templates.value
  
  if (selectedCat.value) {
    result = result.filter(t => t.cat === selectedCat.value)
  }
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.description.toLowerCase().includes(q) ||
      t.cat.toLowerCase().includes(q)
    )
  }
  
  return result
})

const declension = (count) => {
  if (count % 10 === 1 && count % 100 !== 11) return 'шаблон'
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'шаблона'
  return 'шаблонов'
}

const openModal = (item) => {
  selectedItem.value = item
}

const closeModal = () => {
  selectedItem.value = null
}

const downloadTemplate = (item) => {
  alert(`Скачивание шаблона "${item.title}" пока в разработке.\nФайл: ${item.format}`)
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && selectedItem.value) {
    closeModal()
  }
})
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

.tag {
  transition: all 0.2s ease;
  min-height: 28px;
}

/* Анимация модального окна */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .bg-obl-surface,
.modal-leave-active .bg-obl-surface {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .bg-obl-surface,
.modal-leave-to .bg-obl-surface {
  transform: scale(0.95) translateY(-8px);
  opacity: 0;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
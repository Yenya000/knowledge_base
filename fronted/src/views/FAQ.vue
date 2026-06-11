<template>
  <section class="px-4 py-8 sm:px-6 md:px-8 md:py-12 max-w-7xl mx-auto">

    <!-- Шапка -->
    <div class="mb-8">
      <p class="label mb-3">// FAQ</p>
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3">
        Часто задаваемые вопросы
      </h1>
      <p class="text-sm text-obl-secondary">Ответы на популярные вопросы сотрудников</p>
    </div>

    <!-- Фильтры по категориям -->
    <div class="flex gap-2 flex-wrap">
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

    <!-- Аккордеон -->
    <div class="max-w-3xl mt-8">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="accordion-item"
      >
        <button @click="toggle(item.id)" class="accordion-header">
          <span>{{ item.q }}</span>
          <span class="accordion-icon">{{ openId === item.id ? '−' : '+' }}</span>
        </button>
        <div class="accordion-content" :class="{ open: openId === item.id }">
          <div class="accordion-content-inner">
            <div class="accordion-body">{{ item.a }}</div>
          </div>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-if="filtered.length === 0" class="py-12 text-center text-sm text-obl-muted font-mono">
        Вопросов в этой категории нет
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const openId = ref(null)
const selectedCat = ref('')

const toggle = (id) => {
  openId.value = openId.value === id ? null : id
}

const categories = ['HR', 'IT', 'Финансы', 'Общее']

const faqItems = ref([
  { id: 1, cat: 'HR', q: 'Как подать заявление на отпуск?', a: 'Заявление подаётся через HR-портал не позднее чем за 14 дней. Перейдите в раздел «Отпуска», заполните форму и отправьте на согласование руководителю.' },
  { id: 2, cat: 'IT', q: 'Как получить доступ к корпоративной почте?', a: 'Обратитесь в IT-поддержку через портал или напишите на it@oblivione.ru. Укажите ваш ID сотрудника. Доступ предоставляется в течение 1 рабочего дня.' },
  { id: 3, cat: 'Финансы', q: 'Когда выплачивается зарплата?', a: 'Зарплата выплачивается два раза в месяц: аванс — 15-го числа, основная часть — последнего рабочего дня месяца.' },
  { id: 4, cat: 'HR', q: 'Как оформить больничный?', a: 'Уведомите руководителя в день отсутствия до 10:00. Электронный больничный лист передаётся автоматически через СФР. Бумажный вариант нужно сдать в HR в течение 3 дней после выхода.' },
  { id: 5, cat: 'IT', q: 'Что делать если забыл пароль?', a: 'Перейдите на страницу входа и нажмите «Забыли пароль». Ссылка для сброса придёт на корпоративную почту. Если доступа к почте нет — обратитесь в IT-поддержку лично.' },
  { id: 6, cat: 'Общее', q: 'Как связаться с HR-отделом?', a: 'Email: hr@oblivione.ru. Телефон: доб. 101. Кабинет: 214. Приёмные часы: пн-пт с 10:00 до 17:00.' },
  { id: 7, cat: 'Финансы', q: 'Как получить справку 2-НДФЛ?', a: 'Запрос подаётся через HR-портал в разделе «Документы». Срок изготовления — 3 рабочих дня. Справка выдаётся в бухгалтерии или отправляется на email.' },
  { id: 8, cat: 'Общее', q: 'Где найти корпоративные шаблоны документов?', a: 'Все шаблоны находятся в разделе «Шаблоны» базы знаний. Там есть шаблоны писем, презентаций, договоров и других документов.' },
  { id: 9, cat: 'HR', q: 'Как узнать о корпоративных мероприятиях?', a: 'Анонсы публикуются в корпоративном Telegram-канале и на главной странице портала. Также HR рассылает письма за 3-5 дней до события.' },
  { id: 10, cat: 'IT', q: 'Как подключиться к VPN?', a: 'Скачайте клиент Cisco AnyConnect с IT-портала. Сервер: vpn.oblivione.ru. Логин и пароль — те же что для корпоративной почты. При проблемах — тикет в IT-поддержку.' },
])

const filtered = computed(() =>
  selectedCat.value
    ? faqItems.value.filter(f => f.cat === selectedCat.value)
    : faqItems.value
)

</script>

<style scoped>
.accordion-item {
  border-bottom: 0.5px solid var(--border-subtle);
}

.accordion-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  gap: 16px;
}

.accordion-header:hover {
  color: var(--accent);
}

.accordion-icon {
  font-size: 18px;
  color: var(--accent);
  flex-shrink: 0;
  font-family: var(--font-mono);
  transition: transform 0.2s;
}

.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
}

.accordion-content.open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.accordion-content-inner {
  overflow: hidden;
  min-height: 0;
}

.accordion-body {
  padding-bottom: 16px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
}

/* Минимальная высота тегов на мобильных */
.tag {
  min-height: 28px;
}
</style>

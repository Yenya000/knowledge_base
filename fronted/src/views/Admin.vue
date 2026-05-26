<template>
  <div class="min-h-screen bg-obl-base text-obl-primary p-obl-8 font-sans antialiased">
    
    <header class="mb-obl-10 border-b border-obl-border-subtle pb-obl-4 flex items-center justify-between">
      <div>
        <span class="label">// Панель управления</span>
        <h1 class="text-2xl font-extrabold tracking-tight mt-obl-1">OBLIVION <span class="text-obl-accent">|</span> BASE</h1>
      </div>
      <a href="/" class="btn btn-subtle btn-sm">На главную</a>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-obl-8 items-start">
      
      <section class="lg:col-span-5 card">
        <h2 class="text-lg font-bold mb-obl-6 text-obl-primary flex items-center gap-obl-2">
          <span class="text-obl-accent">#</span> Добавление новой статьи
        </h2>

        <form @submit.prevent="createArticle" class="space-y-obl-4">
          <div class="input-group">
            <label for="title" class="input-label">Заголовок статьи</label>
            <input 
              id="title" 
              v-model="articleData.title" 
              type="text" 
              class="input" 
              placeholder="Например: Регламент настройки VPN" 
              required 
            />
          </div>

          <div class="input-group">
            <label for="category" class="input-label">Категория</label>
            <select id="category" v-model="articleData.category" class="input" required>
              <option value="" disabled>Выберите раздел...</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Финансы">Финансы</option>
            </select>
          </div>

          <div class="input-group">
            <label for="tags" class="input-label">Теги</label>
            <input 
              id="tags" 
              v-model="articleData.tags" 
              type="text" 
              class="input" 
              placeholder="vpn, безопасность, доступ" 
            />
          </div>

          <div class="input-group">
            <label for="content" class="input-label">Содержимое статьи</label>
            <textarea 
              id="content" 
              v-model="articleData.content" 
              class="input min-h-[150px] resize-none" 
              placeholder="Текст статьи..." 
              required
            ></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-full mt-obl-2">
            Опубликовать статью
          </button>
        </form>
      </section>

      <section class="lg:col-span-7 card">
        <h2 class="text-lg font-bold mb-obl-6 text-obl-primary flex items-center gap-obl-2">
          <span class="text-obl-accent">#</span> Управление ролями сотрудников
        </h2>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-obl-border-default text-obl-muted text-[11px] uppercase tracking-wider font-mono">
                <th class="pb-obl-3 pl-obl-2">ID</th>
                <th class="pb-obl-3">Имя сотрудника</th>
                <th class="pb-obl-3">Роль</th>
                <th class="pb-obl-3 text-right pr-obl-2">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-obl-border-subtle text-sm">
              <tr v-for="user in usersList" :key="user.id" class="hover:bg-obl-elevated/40 transition-colors">
                <td class="py-obl-4 pl-obl-2 font-mono text-obl-muted">{{ user.id }}</td>
                <td class="py-obl-4 font-medium text-obl-primary">{{ user.name }}</td>
                <td class="py-obl-4">
                  <span class="text-xs font-mono px-obl-2 py-0.5 rounded-obl-sm bg-obl-elevated border border-obl-border-default text-obl-accent">
                    {{ user.role }}
                  </span>
                </td>
                <td class="py-obl-4 text-right pr-obl-2">
                  <div class="inline-flex gap-obl-1">
                    <button 
                      @click="changeRole(user.id, 'admin')" 
                      :disabled="user.role === 'admin'"
                      class="btn btn-ghost btn-sm text-[10px]"
                    >
                      Admin
                    </button>
                    <button 
                      @click="changeRole(user.id, 'editor')" 
                      :disabled="user.role === 'editor'"
                      class="btn btn-subtle btn-sm text-[10px]"
                    >
                      Editor
                    </button>
                    <button 
                      @click="changeRole(user.id, 'user')" 
                      :disabled="user.role === 'user'"
                      class="btn btn-subtle btn-sm text-[10px]"
                    >
                      User
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api' // Поднимаемся из папки views и забираем api.js

const articleData = ref({
  title: '',
  category: '',
  tags: '',
  content: ''
})

const usersList = ref([
  { id: 1, name: 'Мирук Анна', role: 'admin' },
  { id: 2, name: 'Полынский Дмитрий', role: 'editor' },
  { id: 3, name: 'Нилова Светлана', role: 'user' },
  { id: 4, name: 'Крутикова Анастасия', role: 'user' },
  { id: 5, name: 'Грядова Ксения', role: 'user' }
])

// Переписываем функцию на отправку реального POST-запроса по плану
const createArticle = async () => {
  try {
    // Формируем чистый JSON для бэкенда девочек
    const payload = {
      title: articleData.value.title,
      category: articleData.value.category,
      content: articleData.value.content,
      // Превращаем строку с запятыми в массив, очищая пробелы
      tags: articleData.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    }

    // Шлем POST-запрос на Светин эндпоинт. Интерцептор сам прикрепит токен!
    await api.post('/articles', payload)
    
    alert('Статья успешно опубликована и сохранена в базу!')
    
    // Очищаем форму после успешной отправки
    articleData.value = { title: '', category: '', tags: '', content: '' }

  } catch (error) {
    console.error('Ошибка при создании статьи:', error)
    alert('Не удалось опубликовать статью: ' + (error.response?.data?.message || 'нет связи с сервером'))
  }
}

// Заготовка под будущее обновление ролей на бэкенде
const changeRole = async (userId, newRole) => {
  const user = usersList.value.find(u => u.id === userId)
  if (user) {
    // Пока меняем локально, но фронт готов слать PATCH/PUT запрос
    user.role = newRole
  }
}
</script>
<template>
  <div>
    <h1>Панель администратора // OBLIVION BASE</h1>
    <hr />

    <section>
      <h2>🚀 Добавление новой статьи</h2>
      
      <form @submit.prevent="createArticle">
        <div>
          <label for="title">Заголовок статьи:</label>
          <input 
            id="title"
            v-model="articleData.title" 
            type="text" 
            placeholder="Например: Инструкция по настройке VPN" 
            required 
          />
        </div>

        <div>
          <label for="category">Категория:</label>
          <select id="category" v-model="articleData.category" required>
            <option value="" disabled>Выберите раздел...</option>
            <option value="IT">IT / Технический отдел</option>
            <option value="HR">HR / Кадры</option>
            <option value="Финансы">Финансы / Бухгалтерия</option>
          </select>
        </div>

        <div>
          <label for="tags">Теги (через запятую):</label>
          <input 
            id="tags"
            v-model="articleData.tags" 
            type="text" 
            placeholder="vpn, инструкции, доступы" 
          />
        </div>

        <div>
          <label for="content">Содержимое статьи:</label>
          <textarea 
            id="content"
            v-model="articleData.content" 
            placeholder="Введите основной текст статьи в формате Markdown или обычным текстом..." 
            required
          ></textarea>
        </div>

        <button type="submit">Опубликовать статью</button>
      </form>
    </section>

    <hr />

    <section>
      <h2>👥 Управление ролями сотрудников</h2>
      
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя сотрудника</th>
            <th>Текущая роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersList" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td><strong>{{ user.role }}</strong></td>
            <td>
              <button @click="changeRole(user.id, 'admin')" :disabled="user.role === 'admin'">
                Сделать админом
              </button>
              <button @click="changeRole(user.id, 'editor')" :disabled="user.role === 'editor'">
                Сделать редактором
              </button>
              <button @click="changeRole(user.id, 'user')" :disabled="user.role === 'user'">
                Сбросить до юзера
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Реактивный объект для сбора данных из формы новой статьи
const articleData = ref({
  title: '',
  category: '',
  tags: '',
  content: ''
})

// Тестовый массив сотрудников для проверки работы таблицы (имитация базы данных)
const usersList = ref([
  { id: 1, name: 'Мирук Анна', role: 'admin' },
  { id: 2, name: 'Полынский Дмитрий', role: 'editor' },
  { id: 3, name: 'Нилова Светлана', role: 'user' },
  { id: 4, name: 'Крутикова Анастасия', role: 'user' },
  { id: 5, name: 'Грядова Ксения', role: 'user' }
])

// Функция обработки отправки формы статьи
const createArticle = () => {
  console.log('--- Отправка новой статьи на бэкенд ---')
  console.log('Данные формы:', {
    title: articleData.value.title,
    category: articleData.value.category,
    content: articleData.value.content,
    // Разбиваем строку тегов через запятую в чистый массив строк
    tags: articleData.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
  })
  
  alert('Статья успешно сформирована в консоли! На очереди интеграция с API.')
  
  // Очистка формы после отправки
  articleData.value = { title: '', category: '', tags: '', content: '' }
}

// Функция изменения роли сотрудника в таблице
const changeRole = (userId, newRole) => {
  const user = usersList.value.find(u => u.id === userId)
  if (user) {
    user.role = newRole
    console.log(`Пользователю с ID ${userId} присвоена новая роль: ${newRole}`)
  }
}
</script>
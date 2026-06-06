<template>
  <div class="min-h-screen bg-obl-base text-obl-primary p-obl-8 font-sans antialiased">
    
    <!-- ХЕДЕР -->
    <header class="mb-obl-10 border-b border-obl-border-subtle pb-obl-4 flex items-center justify-between">
      <div>
        <span class="label">// Панель управления</span>
        <h1 class="text-2xl font-extrabold tracking-tight mt-obl-1">OBLIVION | BASE</h1>
      </div>
      <nav class="flex items-center gap-obl-2 text-sm font-mono">
        <RouterLink to="/" class="text-obl-muted hover:text-obl-accent transition-colors">Главная</RouterLink>
        <span class="text-obl-faint">/</span>
        <span class="text-obl-accent">Админ-панель</span>
      </nav>
    </header>

    <!-- ========== БЛОК 1: УПРАВЛЕНИЕ СОТРУДНИКАМИ (ТОЛЬКО ДЛЯ АДМИНА) ========== -->
    <div v-if="userRole === 'admin'" class="mb-obl-10">
      <section class="card">
        <h2 class="text-lg font-bold mb-obl-6 text-obl-primary flex items-center gap-obl-2">
          <span class="text-obl-accent">#</span> Управление сотрудниками
        </h2>

        <div class="flex justify-between items-center mb-obl-4">
          <div class="text-xs text-obl-muted font-mono">
            Нажмите на заголовок колонки для сортировки ↑↓
          </div>
          <button @click="openAddUserModal" class="btn btn-primary btn-sm">
            + Добавить сотрудника
          </button>
        </div>

        <div class="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 bg-obl-surface">
              <tr class="border-b border-obl-border-default text-obl-muted text-[11px] uppercase tracking-wider font-mono">
                <th class="pb-obl-3 pl-obl-2 cursor-pointer hover:text-ob-accent transition-colors" @click="toggleUserSort('employee_id')">
                  ID сотрудника
                  <span class="ml-obl-1">
                    <span v-if="userSortField === 'employee_id'">{{ userSortOrder === 'asc' ? '↑' : '↓' }}</span>
                    <span v-else class="opacity-30">↕</span>
                  </span>
                </th>
                <th class="pb-obl-3 cursor-pointer hover:text-ob-accent transition-colors" @click="toggleUserSort('first_name')">
                  Имя и фамилия
                  <span class="ml-obl-1">
                    <span v-if="userSortField === 'first_name'">{{ userSortOrder === 'asc' ? '↑' : '↓' }}</span>
                    <span v-else class="opacity-30">↕</span>
                  </span>
                </th>
                <th class="pb-obl-3 cursor-pointer hover:text-ob-accent transition-colors" @click="toggleUserSort('email')">
                  Email
                  <span class="ml-obl-1">
                    <span v-if="userSortField === 'email'">{{ userSortOrder === 'asc' ? '↑' : '↓' }}</span>
                    <span v-else class="opacity-30">↕</span>
                  </span>
                </th>
                <th class="pb-obl-3 cursor-pointer hover:text-ob-accent transition-colors" @click="toggleUserSort('role')">
                  Роль
                  <span class="ml-obl-1">
                    <span v-if="userSortField === 'role'">{{ userSortOrder === 'asc' ? '↑' : '↓' }}</span>
                    <span v-else class="opacity-30">↕</span>
                  </span>
                </th>
                <th class="pb-obl-3 text-right pr-obl-2">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-obl-border-subtle text-sm">
              <tr v-for="user in sortedUsers" :key="user.id" class="hover:bg-obl-elevated/40 transition-colors">
                <td class="py-obl-4 pl-obl-2 font-mono text-obl-muted">{{ user.employee_id }}</td>
                <td class="py-obl-4 font-medium text-obl-primary">{{ user.first_name }} {{ user.last_name }}</td>
                <td class="py-obl-4 text-obl-muted">{{ user.email || '—' }}</td>
                <td class="py-obl-4">
                  <span class="text-xs font-mono px-obl-2 py-0.5 rounded-obl-sm bg-obl-elevated border border-obl-border-default" :class="{
                    'text-ob-accent': user.role === 'admin',
                    'text-green-400': user.role === 'editor',
                    'text-ob-muted': user.role === 'user'
                  }">
                    {{ user.role }}
                  </span>
                </td>
                <td class="py-obl-4 text-right pr-obl-2">
                  <div class="inline-flex gap-obl-1">
                    <button @click="changeRole(user.id, 'admin')" :disabled="user.role === 'admin'" class="btn btn-ghost btn-sm text-[10px]">Admin</button>
                    <button @click="changeRole(user.id, 'editor')" :disabled="user.role === 'editor'" class="btn btn-subtle btn-sm text-[10px]">Editor</button>
                    <button @click="changeRole(user.id, 'user')" :disabled="user.role === 'user'" class="btn btn-subtle btn-sm text-[10px]">User</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- ========== БЛОК 2: ДОБАВЛЕНИЕ + УПРАВЛЕНИЕ СТАТЬЯМИ ========== -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-obl-8">
      
      <!-- ЛЕВАЯ КОЛОНКА: ДОБАВЛЕНИЕ СТАТЬИ -->
      <section class="card h-fit">
        <h2 class="text-lg font-bold mb-obl-6 text-obl-primary flex items-center gap-obl-2">
          <span class="text-obl-accent">#</span> Добавление новой статьи
        </h2>

        <form @submit.prevent="createArticle" class="space-y-obl-4">
          <div class="input-group">
            <label for="title" class="input-label">Заголовок статьи</label>
            <input id="title" v-model="articleData.title" type="text" class="input" placeholder="Например: Регламент настройки VPN" required />
          </div>

          <div class="input-group">
            <label for="category" class="input-label">Категория</label>
            <select id="category" v-model="articleData.category" class="input" required>
              <option value="" disabled>Выберите раздел...</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Финансы">Финансы</option>
              <option value="Маркетинг">Маркетинг</option>
            </select>
          </div>

          <div class="input-group">
            <label for="content" class="input-label">Содержимое статьи</label>
            <textarea id="content" v-model="articleData.content" class="input min-h-[150px] resize-none" placeholder="Текст статьи..." required></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-full mt-obl-2">
            Опубликовать статью
          </button>
        </form>
      </section>

      <!-- ПРАВАЯ КОЛОНКА: УПРАВЛЕНИЕ СТАТЬЯМИ -->
      <section class="card h-fit">
        <h2 class="text-lg font-bold mb-obl-6 text-obl-primary flex items-center gap-obl-2">
          <span class="text-obl-accent">#</span> Управление статьями
        </h2>

        <div class="grid grid-cols-2 gap-obl-4 mb-obl-4">
          <div>
            <label class="input-label text-xs">Фильтр по категории</label>
            <select v-model="filterCategory" class="input text-sm">
              <option value="">Все категории</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Финансы">Финансы</option>
              <option value="Маркетинг">Маркетинг</option>
            </select>
          </div>
          <div>
            <label class="input-label text-xs">Поиск по заголовку</label>
            <input v-model="searchTitle" type="text" class="input text-sm" placeholder="Введите заголовок..." />
          </div>
        </div>

        <div class="text-xs text-obl-muted font-mono mb-obl-2">
          Нажмите на заголовок колонки для сортировки ↑↓
        </div>

        <div v-if="articlesLoading" class="text-center py-obl-8">
          <div class="loading-spinner mx-auto mb-obl-4"></div>
          <p class="text-obl-muted font-mono text-sm">Загрузка статей...</p>
        </div>

        <div v-else class="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 bg-obl-surface">
              <tr class="border-b border-obl-border-default text-obl-muted text-[11px] uppercase tracking-wider font-mono">
                <th class="pb-obl-3 pl-obl-2 cursor-pointer hover:text-ob-accent transition-colors" @click="toggleArticleSort('id')">
                  ID
                  <span class="ml-obl-1">
                    <span v-if="articleSortField === 'id'">{{ articleSortOrder === 'asc' ? '↑' : '↓' }}</span>
                    <span v-else class="opacity-30">↕</span>
                  </span>
                </th>
                <th class="pb-obl-3 cursor-pointer hover:text-ob-accent transition-colors" @click="toggleArticleSort('title')">
                  Заголовок
                  <span class="ml-obl-1">
                    <span v-if="articleSortField === 'title'">{{ articleSortOrder === 'asc' ? '↑' : '↓' }}</span>
                    <span v-else class="opacity-30">↕</span>
                  </span>
                </th>
                <th class="pb-obl-3 cursor-pointer hover:text-ob-accent transition-colors" @click="toggleArticleSort('category_name')">
                  Категория
                  <span class="ml-obl-1">
                    <span v-if="articleSortField === 'category_name'">{{ articleSortOrder === 'asc' ? '↑' : '↓' }}</span>
                    <span v-else class="opacity-30">↕</span>
                  </span>
                </th>
                <th class="pb-obl-3 text-center cursor-pointer hover:text-ob-accent transition-colors" @click="toggleArticleSort('views')">
                  Просмотры
                  <span class="ml-obl-1">
                    <span v-if="articleSortField === 'views'">{{ articleSortOrder === 'asc' ? '↑' : '↓' }}</span>
                    <span v-else class="opacity-30">↕</span>
                  </span>
                </th>
                <th class="pb-obl-3 text-right pr-obl-2">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-obl-border-subtle text-sm">
              <tr v-for="article in sortedFilteredArticles" :key="article.id" class="hover:bg-obl-elevated/40 transition-colors">
                <td class="py-obl-4 pl-obl-2 font-mono text-obl-muted">{{ article.id }}</td>
                <td class="py-obl-4 font-medium text-obl-primary max-w-[200px] truncate" :title="article.title">{{ article.title }}</td>
                <td class="py-obl-4">
                  <span class="text-xs font-mono px-obl-2 py-0.5 rounded-obl-sm bg-obl-elevated border border-obl-border-default">
                    {{ article.category_name || 'Без категории' }}
                  </span>
                </td>
                <td class="py-obl-4 text-center font-mono text-obl-muted">{{ article.views || 0 }}</td>
                <td class="py-obl-4 text-right pr-obl-2">
                  <div class="inline-flex gap-obl-2">
                    <button @click="openEditModal(article)" class="btn btn-ghost btn-sm text-[10px]">✎ Ред.</button>
                    <button @click="confirmDelete(article)" class="btn btn-subtle btn-sm text-[10px] text-red-400 hover:text-red-300">✕ Уд.</button>
                  </div>
                </td>
              </tr>
              <tr v-if="sortedFilteredArticles.length === 0">
                <td colspan="5" class="text-center py-obl-8 text-obl-muted font-mono">Статьи не найдены</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- Модальное окно редактирования -->
    <Transition name="modal">
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" @click.self="closeEditModal">
      <div class="bg-obl-surface border border-obl-border-default rounded-obl-lg p-obl-6 w-full max-w-2xl mx-obl-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-obl-6">
          <h3 class="text-lg font-bold text-obl-primary">Редактирование статьи</h3>
          <button @click="closeEditModal" class="text-obl-muted hover:text-obl-accent transition-colors">✕</button>
        </div>
        <form @submit.prevent="updateArticle" class="space-y-obl-4">
          <div class="input-group">
            <label class="input-label">Заголовок</label>
            <input v-model="editForm.title" type="text" class="input" required />
          </div>
          <div class="input-group">
            <label class="input-label">Категория</label>
            <select v-model="editForm.category" class="input" required>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Финансы">Финансы</option>
              <option value="Маркетинг">Маркетинг</option>
            </select>
          </div>
          <div class="input-group">
            <label class="input-label">Содержимое</label>
            <textarea v-model="editForm.content" class="input min-h-[200px] resize-none" required></textarea>
          </div>
          <div class="flex gap-obl-3 justify-end mt-obl-6">
            <button type="button" @click="closeEditModal" class="btn btn-subtle">Отмена</button>
            <button type="submit" class="btn btn-primary" :disabled="editLoading">{{ editLoading ? 'Сохранение...' : 'Сохранить изменения' }}</button>
          </div>
        </form>
      </div>
    </div>
    </Transition>

    <!-- Модальное окно добавления сотрудника -->
    <Transition name="modal">
    <div v-if="showAddUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" @click.self="closeAddUserModal">
      <div class="bg-obl-surface border border-obl-border-default rounded-obl-lg p-obl-6 w-full max-w-md mx-obl-4">
        <div class="flex items-center justify-between mb-obl-6">
          <h3 class="text-lg font-bold text-obl-primary">Добавление сотрудника</h3>
          <button @click="closeAddUserModal" class="text-obl-muted hover:text-obl-accent transition-colors">✕</button>
        </div>
        <form @submit.prevent="addUser" class="space-y-obl-4">
          <div class="input-group">
            <label class="input-label">ID сотрудника (OBL-XXXX)</label>
            <input v-model="newUser.employee_id" type="text" class="input font-mono" placeholder="OBL-XXXX" required />
          </div>
          <div class="input-group">
            <label class="input-label">Имя</label>
            <input v-model="newUser.first_name" type="text" class="input" required />
          </div>
          <div class="input-group">
            <label class="input-label">Фамилия</label>
            <input v-model="newUser.last_name" type="text" class="input" required />
          </div>
          <div class="input-group">
            <label class="input-label">Email</label>
            <input v-model="newUser.email" type="email" class="input" required />
          </div>
          <div class="input-group">
            <label class="input-label">Пароль</label>
            <input v-model="newUser.password" type="password" class="input" placeholder="••••••••" required />
          </div>
          <div class="input-group">
            <label class="input-label">Роль</label>
            <select v-model="newUser.role" class="input" required>
              <option value="user">Сотрудник (user)</option>
              <option value="editor">Редактор (editor)</option>
              <option value="admin">Администратор (admin)</option>
            </select>
          </div>
          <div class="flex gap-obl-3 justify-end mt-obl-6">
            <button type="button" @click="closeAddUserModal" class="btn btn-subtle">Отмена</button>
            <button type="submit" class="btn btn-primary" :disabled="addUserLoading">{{ addUserLoading ? 'Добавление...' : 'Добавить сотрудника' }}</button>
          </div>
        </form>
      </div>
    </div>
    </Transition>

    <!-- Модальное окно подтверждения удаления -->
    <Transition name="modal">
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" @click.self="closeDeleteConfirm">
      <div class="bg-obl-surface border border-obl-border-default rounded-obl-lg p-obl-6 w-full max-w-md mx-obl-4">
        <div class="text-center">
          <div class="text-red-400 text-4xl mb-obl-4">⚠️</div>
          <h3 class="text-lg font-bold text-obl-primary mb-obl-2">Удалить статью?</h3>
          <p class="text-obl-muted text-sm mb-obl-6">Вы уверены? Это действие нельзя отменить.</p>
          <div class="flex gap-obl-3 justify-center">
            <button @click="closeDeleteConfirm" class="btn btn-subtle">Отмена</button>
            <button @click="deleteArticle" class="btn btn-primary bg-red-600 hover:bg-red-700">Удалить</button>
          </div>
        </div>
      </div>
    </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../api'

const userRole = ref(localStorage.getItem('userRole') || 'user')

const categoryToId = { 'IT': 2, 'HR': 1, 'Финансы': 3, 'Маркетинг': 4 }
const idToCategory = { 1: 'HR', 2: 'IT', 3: 'Финансы', 4: 'Маркетинг' }

// СОРТИРОВКА СОТРУДНИКОВ
const userSortField = ref('employee_id')
const userSortOrder = ref('asc')
const toggleUserSort = (field) => {
  if (userSortField.value === field) {
    userSortOrder.value = userSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    userSortField.value = field
    userSortOrder.value = 'asc'
  }
}
const sortedUsers = computed(() => {
  const list = [...usersList.value]
  return list.sort((a, b) => {
    let valA = a[userSortField.value] || ''
    let valB = b[userSortField.value] || ''
    if (typeof valA === 'number') {
      return userSortOrder.value === 'asc' ? valA - valB : valB - valA
    }
    valA = String(valA).toLowerCase()
    valB = String(valB).toLowerCase()
    const comparison = valA.localeCompare(valB)
    return userSortOrder.value === 'asc' ? comparison : -comparison
  })
})

// СОРТИРОВКА СТАТЕЙ
const articleSortField = ref('id')
const articleSortOrder = ref('asc')
const toggleArticleSort = (field) => {
  if (articleSortField.value === field) {
    articleSortOrder.value = articleSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    articleSortField.value = field
    articleSortOrder.value = 'asc'
  }
}

const filterCategory = ref('')
const searchTitle = ref('')
const filteredArticles = computed(() => {
  let result = articlesList.value
  if (filterCategory.value) {
    result = result.filter(a => a.category_name === filterCategory.value)
  }
  if (searchTitle.value) {
    const query = searchTitle.value.toLowerCase()
    result = result.filter(a => a.title.toLowerCase().includes(query))
  }
  return result
})
const sortedFilteredArticles = computed(() => {
  const list = [...filteredArticles.value]
  return list.sort((a, b) => {
    let valA = a[articleSortField.value] || ''
    let valB = b[articleSortField.value] || ''
    if (typeof valA === 'number') {
      return articleSortOrder.value === 'asc' ? valA - valB : valB - valA
    }
    valA = String(valA).toLowerCase()
    valB = String(valB).toLowerCase()
    const comparison = valA.localeCompare(valB)
    return articleSortOrder.value === 'asc' ? comparison : -comparison
  })
})

const articleData = ref({ title: '', category: '', content: '' })
const articlesList = ref([])
const articlesLoading = ref(true)
const showEditModal = ref(false)
const editForm = ref({ id: null, title: '', category: '', content: '' })
const editLoading = ref(false)
const showDeleteConfirm = ref(false)
const deleteTarget = ref(null)
const usersList = ref([])
const showAddUserModal = ref(false)
const addUserLoading = ref(false)
const newUser = ref({ employee_id: '', first_name: '', last_name: '', email: '', password: '', role: 'user' })

const loadArticles = async () => {
  articlesLoading.value = true
  try {
    const response = await api.get('/articles')
    articlesList.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки статей:', error)
    articlesList.value = []
  } finally {
    articlesLoading.value = false
  }
}

const loadUsers = async () => {
  try {
    const response = await api.get('/users')
    usersList.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error)
    usersList.value = []
  }
}

const createArticle = async () => {
  if (!articleData.value.category) {
    alert('Пожалуйста, выберите категорию')
    return
  }
  const categoryId = categoryToId[articleData.value.category]
  if (!categoryId) {
    alert('Неизвестная категория')
    return
  }
  try {
    await api.post('/articles', {
      title: articleData.value.title,
      content: articleData.value.content,
      category_id: categoryId
    })
    alert('Статья успешно опубликована!')
    articleData.value = { title: '', category: '', content: '' }
    loadArticles()
  } catch (error) {
    console.error('Ошибка при создании статьи:', error)
    alert('Не удалось опубликовать статью: ' + (error.response?.data?.error || 'нет связи с сервером'))
  }
}

const openEditModal = (article) => {
  editForm.value = {
    id: article.id,
    title: article.title,
    category: article.category_name || idToCategory[article.category_id] || 'IT',
    content: article.content
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = { id: null, title: '', category: '', content: '' }
}

const updateArticle = async () => {
  editLoading.value = true
  try {
    const categoryId = categoryToId[editForm.value.category]
    await api.put(`/articles/${editForm.value.id}`, {
      title: editForm.value.title,
      content: editForm.value.content,
      category_id: categoryId
    })
    alert('Статья успешно обновлена!')
    closeEditModal()
    loadArticles()
  } catch (error) {
    console.error('Ошибка обновления статьи:', error)
    alert('Не удалось обновить статью: ' + (error.response?.data?.error || 'ошибка сервера'))
  } finally {
    editLoading.value = false
  }
}

const confirmDelete = (article) => {
  deleteTarget.value = article
  showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  deleteTarget.value = null
}

const deleteArticle = async () => {
  if (!deleteTarget.value) return
  try {
    await api.delete(`/articles/${deleteTarget.value.id}`)
    alert('Статья удалена!')
    closeDeleteConfirm()
    loadArticles()
  } catch (error) {
    console.error('Ошибка удаления статьи:', error)
    alert('Не удалось удалить статью: ' + (error.response?.data?.error || 'ошибка сервера'))
  }
}

const changeRole = async (userId, newRole) => {
  try {
    await api.patch(`/users/${userId}/role`, { role: newRole })
    const user = usersList.value.find(u => u.id === userId)
    if (user) user.role = newRole
    alert(`Роль изменена на ${newRole}`)
  } catch (error) {
    console.error('Ошибка изменения роли:', error)
    alert('Не удалось изменить роль: ' + (error.response?.data?.error || 'ошибка сервера'))
  }
}

const openAddUserModal = () => {
  newUser.value = { employee_id: '', first_name: '', last_name: '', email: '', password: '', role: 'user' }
  showAddUserModal.value = true
}

const closeAddUserModal = () => {
  showAddUserModal.value = false
}

const addUser = async () => {
  addUserLoading.value = true
  try {
    await api.post('/auth/register', {
      employee_id: newUser.value.employee_id,
      password: newUser.value.password,
      role: newUser.value.role,
      email: newUser.value.email,
      first_name: newUser.value.first_name,
      last_name: newUser.value.last_name
    })
    alert('Сотрудник успешно добавлен!')
    closeAddUserModal()
    loadUsers()
  } catch (error) {
    console.error('Ошибка добавления сотрудника:', error)
    alert('Не удалось добавить сотрудника: ' + (error.response?.data?.error || 'ошибка сервера'))
  } finally {
    addUserLoading.value = false
  }
}

onMounted(() => {
  loadArticles()
  if (userRole.value === 'admin') {
    loadUsers()
  }
})
</script>

<style scoped>
.loading-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid var(--border-default);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: var(--border-subtle);
  border-radius: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: var(--border-default);
  border-radius: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: var(--accent-dim);
}

/* Анимация модальных окон */
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
</style>
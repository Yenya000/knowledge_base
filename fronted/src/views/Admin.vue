<template>
  <div class="min-h-screen bg-obl-base text-obl-primary font-sans antialiased">
    
    <!-- ХЕДЕР как у Димы -->
    <section class="px-4 py-8 sm:px-6 md:px-8 md:py-12 max-w-7xl mx-auto">
      <div class="mb-obl-8 text-center sm:text-left">
        <p class="label mb-obl-3">// ПАНЕЛЬ УПРАВЛЕНИЯ</p>
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-obl-3">
          Управление <span class="text-obl-accent">сотрудниками</span>
        </h1>
        <p class="text-sm text-obl-secondary">Добавление, изменение ролей и удаление пользователей</p>
      </div>

      <!-- Хлебные крошки -->
      <nav class="flex items-center gap-obl-2 text-sm font-mono mb-obl-8">
        <RouterLink to="/" class="text-obl-muted hover:text-obl-accent transition-colors">Главная</RouterLink>
        <span class="text-obl-faint">/</span>
        <span class="text-obl-accent">Админ-панель</span>
      </nav>

      <!-- Управление сотрудниками -->
      <div class="card">
        <div class="flex justify-between items-center mb-obl-6 flex-wrap gap-obl-4">
          <h2 class="text-lg font-bold text-obl-primary flex items-center gap-obl-2">
            <span class="text-obl-accent">#</span> Список сотрудников
          </h2>
          <button @click="openAddUserModal" class="btn btn-primary btn-sm">
            + Добавить сотрудника
          </button>
        </div>

        <div class="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 bg-obl-surface">
              <tr class="border-b border-obl-border-default text-obl-muted text-[11px] uppercase tracking-wider font-mono">
                <th class="pb-obl-3 pl-obl-2 cursor-pointer hover:text-ob-accent" @click="toggleUserSort('employee_id')">
                  ID сотрудника <span v-if="userSortField === 'employee_id'">{{ userSortOrder === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="pb-obl-3 cursor-pointer hover:text-ob-accent" @click="toggleUserSort('first_name')">
                  Имя и фамилия <span v-if="userSortField === 'first_name'">{{ userSortOrder === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="pb-obl-3 cursor-pointer hover:text-ob-accent" @click="toggleUserSort('email')">
                  Email <span v-if="userSortField === 'email'">{{ userSortOrder === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="pb-obl-3 cursor-pointer hover:text-ob-accent" @click="toggleUserSort('role')">
                  Роль <span v-if="userSortField === 'role'">{{ userSortOrder === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="pb-obl-3 text-right pr-obl-2">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-obl-border-subtle text-sm">
              <tr v-for="user in sortedUsers" :key="user.id" class="hover:bg-obl-elevated/40 transition-colors">
                <td class="py-obl-4 pl-obl-2 font-mono">{{ user.employee_id }}</td>
                <td class="py-obl-4 font-medium">{{ user.first_name }} {{ user.last_name }}</td>
                <td class="py-obl-4 text-obl-muted">{{ user.email || '—' }}</td>
                <td class="py-obl-4">
                  <span class="text-xs font-mono px-obl-2 py-0.5 rounded-obl-sm bg-obl-elevated border" :class="{
                    'text-ob-accent border-ob-accent': user.role === 'admin',
                    'text-green-400 border-green-400': user.role === 'editor',
                    'text-obl-muted border-obl-border-default': user.role === 'user'
                  }">
                    {{ user.role }}
                  </span>
                </td>
                <td class="py-obl-4 text-right pr-obl-2">
                  <div class="inline-flex gap-obl-1">
                    <button @click="changeRole(user.id, 'admin')" :disabled="user.role === 'admin'" class="btn btn-ghost btn-sm">Admin</button>
                    <button @click="changeRole(user.id, 'editor')" :disabled="user.role === 'editor'" class="btn btn-subtle btn-sm">Editor</button>
                    <button @click="changeRole(user.id, 'user')" :disabled="user.role === 'user'" class="btn btn-subtle btn-sm">User</button>
                  </div>
                </td>
              </tr>
              <tr v-if="sortedUsers.length === 0">
                <td colspan="5" class="text-center py-obl-8 text-obl-muted">Нет сотрудников</td>
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
        <div class="flex justify-between items-center mb-obl-6">
          <h3 class="text-lg font-bold">Добавление сотрудника</h3>
          <button @click="closeAddUserModal" class="text-obl-muted hover:text-obl-accent">✕</button>
        </div>
        <form @submit.prevent="addUser" class="space-y-obl-4">
          <input v-model="newUser.employee_id" type="text" class="input" placeholder="OBL-XXXX" required />
          <input v-model="newUser.first_name" type="text" class="input" placeholder="Имя" required />
          <input v-model="newUser.last_name" type="text" class="input" placeholder="Фамилия" required />
          <input v-model="newUser.email" type="email" class="input" placeholder="Email" required />
          <input v-model="newUser.password" type="password" class="input" placeholder="Пароль" required />
          <select v-model="newUser.role" class="input" required>
            <option value="user">Сотрудник</option>
            <option value="editor">Редактор</option>
            <option value="admin">Администратор</option>
          </select>
          <div class="flex gap-obl-3 justify-end">
            <button type="button" @click="closeAddUserModal" class="btn btn-subtle">Отмена</button>
            <button type="submit" class="btn btn-primary" :disabled="addUserLoading">{{ addUserLoading ? 'Добавление...' : 'Добавить' }}</button>
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
if (userRole.value !== 'admin') {
  window.location.href = '/'
}

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

const usersList = ref([])
const sortedUsers = computed(() => {
  const list = [...usersList.value]
  return list.sort((a, b) => {
    let valA = a[userSortField.value] || ''
    let valB = b[userSortField.value] || ''
    if (typeof valA === 'number') {
      return userSortOrder.value === 'asc' ? valA - valB : valB - valA
    }
    return userSortOrder.value === 'asc' 
      ? String(valA).localeCompare(String(valB)) 
      : String(valB).localeCompare(String(valA))
  })
})

const loadUsers = async () => {
  try {
    const res = await api.get('/users')
    usersList.value = res.data
  } catch (e) {
    console.error('Ошибка загрузки пользователей:', e)
    usersList.value = []
  }
}

const changeRole = async (userId, newRole) => {
  try {
    await api.patch(`/users/${userId}/role`, { role: newRole })
    const user = usersList.value.find(u => u.id === userId)
    if (user) user.role = newRole
    alert(`Роль изменена на ${newRole}`)
  } catch (e) {
    alert('Ошибка: ' + (e.response?.data?.error || 'ошибка сервера'))
  }
}

const showAddUserModal = ref(false)
const addUserLoading = ref(false)
const newUser = ref({ employee_id: '', first_name: '', last_name: '', email: '', password: '', role: 'user' })

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
    alert('Сотрудник добавлен!')
    closeAddUserModal()
    loadUsers()
  } catch (e) {
    alert('Ошибка: ' + (e.response?.data?.error || 'ошибка сервера'))
  } finally {
    addUserLoading.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
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
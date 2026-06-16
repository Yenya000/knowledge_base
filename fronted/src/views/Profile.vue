<template>
  <div class="min-h-screen pt-14 flex max-w-7xl mx-auto">

    <!-- ===================== SIDEBAR ===================== -->
    <aside
      class="hidden md:flex flex-col w-48 flex-shrink-0 min-h-screen pt-8 pr-6"
      style="border-right: 0.5px solid var(--border-subtle);"
    >
      <div class="flex flex-col items-center text-center mb-6">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mb-3 select-none"
          style="background: var(--bg-elevated); border: 1px solid var(--border-default); color: var(--accent); font-family: var(--font-mono);"
        >
          {{ initials }}
        </div>
        <span class="text-sm font-bold leading-tight" style="color: var(--text-primary);">{{ userName }}</span>
        <span
          class="text-[10px] mt-1 uppercase tracking-widest"
          style="font-family: var(--font-mono); color: var(--text-muted);"
        >{{ userRoleText }}</span>
        <span
          class="text-[10px] mt-0.5"
          style="font-family: var(--font-mono); color: var(--text-faint);"
        >ID: {{ userData.employee_id }}</span>
      </div>

      <div class="divider mb-4"></div>

      <nav class="flex flex-col gap-0.5">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="flex items-center gap-2 text-left px-3 py-2 rounded text-xs w-full transition-all duration-150"
          :class="activeSection === item.id ? 'nav-item-active' : 'nav-item'"
          @click="scrollToSection(item.id)"
        >
          {{ item.label }}
        </button>

        <button
          v-if="userRole === 'admin' || userRole === 'editor'"
          class="flex items-center gap-2 text-left px-3 py-2 rounded text-xs w-full transition-all duration-150"
          :class="activeSection === 'articles' ? 'nav-item-active' : 'nav-item'"
          @click="activeSection = 'articles'"
        >
          Управление статьями
        </button>

        <button
          v-if="userRole === 'admin'"
          class="flex items-center gap-2 text-left px-3 py-2 rounded text-xs w-full transition-all duration-150"
          :class="activeSection === 'employees' ? 'nav-item-active' : 'nav-item'"
          @click="activeSection = 'employees'"
        >
          Сотрудники
        </button>
      </nav>
    </aside>

    <!-- ===================== MAIN ===================== -->
    <main class="flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-8 min-w-0">

      <div class="md:hidden mb-6 pb-6" style="border-bottom: 0.5px solid var(--border-subtle);">
        <!-- Строка 1: аватар + имя + выйти -->
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
               style="background: var(--bg-elevated); border: 1px solid var(--border-default); color: var(--accent); font-family: var(--font-mono);">
            {{ initials }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold truncate" style="color: var(--text-primary);">{{ userName }}</p>
            <p class="text-[10px] uppercase tracking-widest" style="font-family: var(--font-mono); color: var(--text-muted);">{{ userRoleText }} · {{ userData.employee_id }}</p>
          </div>
          <button @click="handleLogout" class="btn btn-subtle btn-sm flex-shrink-0">Выйти</button>
        </div>
        <!-- Строка 2: навигация (только для admin/editor) -->
        <div v-if="userRole === 'admin' || userRole === 'editor'" class="flex gap-2 flex-wrap">
          <button
            @click="activeSection = 'profile'"
            class="btn btn-sm"
            :class="activeSection === 'profile' || activeSection === 'favorites' ? 'btn-primary' : 'btn-subtle'"
          >Профиль</button>
          <button
            v-if="userRole === 'admin' || userRole === 'editor'"
            @click="activeSection = 'articles'"
            class="btn btn-sm"
            :class="activeSection === 'articles' ? 'btn-primary' : 'btn-subtle'"
          >Статьи</button>
          <button
            v-if="userRole === 'admin'"
            @click="activeSection = 'employees'"
            class="btn btn-sm"
            :class="activeSection === 'employees' ? 'btn-primary' : 'btn-subtle'"
          >Сотрудники</button>
        </div>
      </div>

      <!-- ========== СЕКЦИЯ: УЧЁТНАЯ ЗАПИСЬ ========== -->
      <section v-if="activeSection === 'profile' || activeSection === 'favorites'" class="mb-10">
        <p class="label mb-2">// УЧЁТНАЯ ЗАПИСЬ</p>
        <h2 class="text-xl font-bold mb-6" style="color: var(--text-primary);">Данные сотрудника</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="data-card">
            <span class="data-label">ФИО</span>
            <span class="data-value">{{ userData.first_name }} {{ userData.last_name }}</span>
          </div>
          <div class="data-card">
            <span class="data-label">ID СОТРУДНИКА</span>
            <span class="data-value" style="font-family: var(--font-mono);">{{ userData.employee_id }}</span>
          </div>
          <div class="data-card">
            <span class="data-label">ОТДЕЛ</span>
            <span class="data-value">{{ userRole === 'admin' ? 'Управление' : userRole === 'editor' ? 'Редакция' : 'Разработка' }}</span>
          </div>
          <div class="data-card">
            <span class="data-label">EMAIL</span>
            <span class="data-value text-sm" style="font-family: var(--font-mono); word-break: break-all;">{{ userData.email }}</span>
          </div>
          <div class="data-card">
            <span class="data-label">РОЛЬ</span>
            <div class="mt-1">
              <span class="text-sm font-semibold" :style="{ color: userRole === 'admin' ? 'var(--accent)' : userRole === 'editor' ? '#4ade80' : 'var(--text-muted)' }">
                {{ userRoleText }}
              </span>
            </div>
          </div>
          <div class="data-card">
            <span class="data-label">СТАТУС</span>
            <div class="flex items-center gap-2 mt-2">
              <span class="w-2 h-2 rounded-full flex-shrink-0" style="background: #4ade80;"></span>
              <span class="text-sm font-semibold" style="color: #4ade80;">Активен</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== СЕКЦИЯ: УПРАВЛЕНИЕ СТАТЬЯМИ ========== -->
      <section v-if="activeSection === 'articles' && (userRole === 'admin' || userRole === 'editor')" class="mb-10">
        <p class="label mb-2">// УПРАВЛЕНИЕ СТАТЬЯМИ</p>
        <h2 class="text-xl font-bold mb-6" style="color: var(--text-primary);">Добавление новой статьи</h2>

        <form @submit.prevent="createArticle" class="space-y-obl-4 mb-10">
          <div class="input-group">
            <label class="input-label">Заголовок статьи</label>
            <input v-model="articleData.title" type="text" class="input" placeholder="Например: Регламент настройки VPN" required />
          </div>
          <div class="input-group">
            <label class="input-label">Категория</label>
            <select v-model="articleData.category" class="input" required>
              <option value="" disabled>Выберите раздел...</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Финансы">Финансы</option>
              <option value="Маркетинг">Маркетинг</option>
            </select>
          </div>
          <div class="input-group">
            <label class="input-label">Содержимое статьи</label>
            <textarea v-model="articleData.content" class="input min-h-[150px] resize-none" placeholder="Текст статьи..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-full" :disabled="articleLoading">{{ articleLoading ? 'Публикация...' : 'Опубликовать статью' }}</button>
        </form>

        <h2 class="text-xl font-bold mb-6" style="color: var(--text-primary);">Редактирование и удаление</h2>

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

        <div v-if="articlesLoading" class="text-center py-obl-8">
          <div class="loading-spinner mx-auto mb-obl-4"></div>
          <p class="text-obl-muted font-mono text-sm">Загрузка статей...</p>
        </div>

        <div v-else class="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0" style="background: var(--bg-surface);">
              <tr class="border-b" style="border-color: var(--border-default);">
                <th class="pb-obl-3 pl-obl-2 cursor-pointer" style="color: var(--text-muted); font-size: 11px;" @click="toggleArticleSort('id')">ID</th>
                <th class="pb-obl-3 cursor-pointer" style="color: var(--text-muted); font-size: 11px;" @click="toggleArticleSort('title')">Заголовок</th>
                <th class="pb-obl-3 cursor-pointer" style="color: var(--text-muted); font-size: 11px;" @click="toggleArticleSort('category_name')">Категория</th>
                <th class="pb-obl-3 text-center cursor-pointer" style="color: var(--text-muted); font-size: 11px;" @click="toggleArticleSort('views')">Просмотры</th>
                <th class="pb-obl-3 text-right pr-obl-2" style="color: var(--text-muted); font-size: 11px;">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="article in sortedFilteredArticles" :key="article.id" class="hover:bg-obl-elevated/40 transition-colors">
                <td class="py-obl-4 pl-obl-2 font-mono" style="color: var(--text-muted);">{{ article.id }}</td>
                <td class="py-obl-4 font-medium" style="color: var(--text-primary);">{{ article.title }}</td>
                <td class="py-obl-4"><span class="text-xs font-mono px-obl-2 py-0.5 rounded-obl-sm" style="background: var(--bg-elevated); border: 1px solid var(--border-default);">{{ article.category_name || 'Без категории' }}</span></td>
                <td class="py-obl-4 text-center font-mono" style="color: var(--text-muted);">{{ article.views || 0 }}</td>
                <td class="py-obl-4 text-right pr-obl-2">
                  <div class="inline-flex gap-obl-2">
                    <button @click="openEditModal(article)" class="btn btn-ghost btn-sm text-[10px]">✎ Ред.</button>
                    <button @click="confirmDelete(article)" class="btn btn-subtle btn-sm text-[10px]" style="color: #e05252;">✕ Уд.</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ========== СЕКЦИЯ: СОТРУДНИКИ ========== -->
      <section v-if="activeSection === 'employees' && userRole === 'admin'" class="mb-10">
        <p class="label mb-2">// УПРАВЛЕНИЕ СОТРУДНИКАМИ</p>
        <h2 class="text-xl font-bold mb-6" style="color: var(--text-primary);">Список сотрудников</h2>

        <div class="flex justify-end mb-obl-4">
          <button @click="openAddUserModal" class="btn btn-primary btn-sm">
            + Добавить сотрудника
          </button>
        </div>

        <div v-if="usersLoading" class="text-center py-obl-8">
          <div class="loading-spinner mx-auto mb-obl-4"></div>
          <p class="text-obl-muted font-mono text-sm">Загрузка сотрудников...</p>
        </div>

        <div v-else class="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0" style="background: var(--bg-surface);">
              <tr class="border-b" style="border-color: var(--border-default);">
                <th class="pb-obl-3 pl-obl-2 cursor-pointer" style="color: var(--text-muted); font-size: 11px;" @click="toggleUserSort('employee_id')">ID сотрудника <span v-if="userSortField === 'employee_id'">{{ userSortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                <th class="pb-obl-3 cursor-pointer" style="color: var(--text-muted); font-size: 11px;" @click="toggleUserSort('first_name')">Имя и фамилия <span v-if="userSortField === 'first_name'">{{ userSortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                <th class="pb-obl-3 cursor-pointer" style="color: var(--text-muted); font-size: 11px;" @click="toggleUserSort('email')">Email <span v-if="userSortField === 'email'">{{ userSortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                <th class="pb-obl-3 cursor-pointer" style="color: var(--text-muted); font-size: 11px;" @click="toggleUserSort('role')">Роль <span v-if="userSortField === 'role'">{{ userSortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                <th class="pb-obl-3 text-right pr-obl-2" style="color: var(--text-muted); font-size: 11px;">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in sortedUsers" :key="user.id" class="hover:bg-obl-elevated/40 transition-colors">
                <td class="py-obl-4 pl-obl-2 font-mono" style="color: var(--text-muted);">{{ user.employee_id }}</td>
                <td class="py-obl-4 font-medium" style="color: var(--text-primary);">{{ user.first_name }} {{ user.last_name }}</td>
                <td class="py-obl-4" style="color: var(--text-muted);">{{ user.email || '—' }}</td>
                <td class="py-obl-4"><span class="text-xs font-mono px-obl-2 py-0.5 rounded-obl-sm" :style="{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }" :class="{ 'text-ob-accent': user.role === 'admin', 'text-green-400': user.role === 'editor' }">{{ user.role }}</span></td>
                <td class="py-obl-4 text-right pr-obl-2">
                  <div class="inline-flex gap-obl-1">
                    <button @click="changeRole(user.id, 'admin')" :disabled="user.role === 'admin'" class="btn btn-ghost btn-sm text-[10px]">Admin</button>
                    <button @click="changeRole(user.id, 'editor')" :disabled="user.role === 'editor'" class="btn btn-subtle btn-sm text-[10px]">Editor</button>
                    <button @click="changeRole(user.id, 'user')" :disabled="user.role === 'user'" class="btn btn-subtle btn-sm text-[10px]">User</button>
                    <!-- 👇 НОВАЯ КНОПКА УДАЛЕНИЯ -->
                    <button @click="confirmDeleteUser(user)" class="btn btn-subtle btn-sm text-[10px]" style="color: #e05252;">✕ Уд.</button>
                  </div>
                </td>
              </tr>
              <tr v-if="sortedUsers.length === 0"><td colspan="5" class="text-center py-obl-8" style="color: var(--text-muted);">Нет сотрудников</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ========== СЕКЦИЯ: АКТИВНОСТЬ (только для profile/favorites) ========== -->
      <template v-if="activeSection === 'profile' || activeSection === 'favorites'">
        <section class="mb-10">
          <p class="label mb-2">// АКТИВНОСТЬ</p>
          <h2 class="text-xl font-bold mb-6" style="color: var(--text-primary);">Последние действия</h2>
          <div class="flex flex-col gap-3 mb-8">
            <div v-for="item in recentActivity" :key="item.title" class="flex items-center gap-3 px-4 py-3 rounded transition-all duration-150" style="border: 1px solid var(--border-subtle); background: var(--bg-surface);">
              <div class="w-8 h-8 rounded flex-shrink-0" style="background: var(--bg-elevated);"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ item.title }}</p>
                <p class="text-xs mt-0.5" style="color: var(--text-muted);">{{ item.action }} · {{ item.time }}</p>
              </div>
              <span class="tag flex-shrink-0">{{ item.cat }}</span>
            </div>
          </div>

          <!-- ========== ИЗБРАННОЕ ========== -->
          <div id="favorites-section" class="mb-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold" style="color: var(--text-primary);">Избранное</h3>
              <button @click="loadFavorites" class="btn btn-subtle btn-sm">Обновить</button>
            </div>

            <div v-if="favoritesLoading" class="text-center py-4">
              <div class="loading-spinner mx-auto mb-2"></div>
              <p class="text-xs text-obl-muted font-mono">Загрузка...</p>
            </div>

            <div v-else-if="favoritesList.length === 0" class="text-center py-8">
              <p class="text-obl-muted font-mono">Нет избранных статей</p>
              <p class="text-xs text-obl-faint mt-2">Нажмите ★ на странице статьи, чтобы добавить</p>
            </div>

            <div v-else class="flex flex-col gap-2">
              <router-link 
                v-for="fav in favoritesList" 
                :key="fav.id"
                :to="`/article/${fav.id}`"
                class="flex items-center justify-between gap-3 px-4 py-3 rounded cursor-pointer transition-all duration-150"
                style="border: 1px solid var(--border-subtle); background: var(--bg-surface);"
              >
                <div class="flex-1 min-w-0">
                  <div class="text-[10px] font-mono text-obl-accent uppercase tracking-widest mb-1">
                    {{ fav.category_name || 'Без категории' }}
                  </div>
                  <span class="text-sm truncate block" style="color: var(--text-secondary);">{{ fav.title }}</span>
                </div>
                <button @click.prevent="removeFromFavorites(fav.id)" class="btn btn-subtle btn-sm" style="color: #e05252;">✕ Удалить</button>
              </router-link>
            </div>
          </div>
        </section>

        <section>
          <p class="label mb-2">// ДОПОЛНИТЕЛЬНО</p>
          <h2 class="text-xl font-bold mb-6" style="color: var(--text-primary);">Действия</h2>
          <div class="flex flex-col gap-4">
            <div class="action-card">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-semibold" style="color: var(--text-primary);">Предложение</p>
                <button class="text-xs font-mono transition-all duration-150" style="color: var(--text-muted);" @click="showSuggestion = !showSuggestion">{{ showSuggestion ? '✕ закрыть' : '+ написать' }}</button>
              </div>
              <p class="text-xs mb-3" style="color: var(--text-muted);">Предложить улучшение базы знаний</p>
              <div v-if="showSuggestion" class="flex flex-col gap-2">
                <textarea v-model="suggestionText" class="input min-h-[80px] resize-none text-sm" placeholder="Опишите ваше предложение..."></textarea>
                <button class="btn btn-ghost btn-sm self-end" @click="submitSuggestion">Отправить</button>
              </div>
            </div>

            <div class="action-card">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-semibold" style="color: var(--text-primary);">Сообщить о нарушении</p>
                <button class="text-xs font-mono transition-all duration-150" style="color: var(--text-muted);" @click="showComplaint = !showComplaint">{{ showComplaint ? '✕ закрыть' : '+ написать' }}</button>
              </div>
              <p class="text-xs mb-3" style="color: var(--text-muted);">Анонимная форма для обращений</p>
              <div v-if="showComplaint" class="flex flex-col gap-2">
                <textarea v-model="complaintText" class="input min-h-[80px] resize-none text-sm" placeholder="Опишите ситуацию..."></textarea>
                <button class="btn btn-ghost btn-sm self-end" @click="submitComplaint">Отправить</button>
              </div>
            </div>

            <div class="action-card">
              <p class="text-sm font-semibold mb-1" style="color: var(--text-primary);">Мои предложения</p>
              <p class="text-xs mb-4" style="color: var(--text-muted);">История поданных предложений</p>
              <div class="flex flex-col items-center py-4 gap-2" style="border: 1px dashed var(--border-default); border-radius: var(--radius-sm);">
                <p class="text-xs font-mono" style="color: var(--text-faint);">Предложений пока нет</p>
              </div>
            </div>
          </div>
        </section>
      </template>

    </main>
  </div>

  <!-- Модальные окна -->
  <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" @click.self="closeEditModal">
    <div class="bg-obl-surface border border-obl-border-default rounded-obl-lg p-obl-6 w-full max-w-2xl mx-obl-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-obl-6">
        <h3 class="text-lg font-bold" style="color: var(--text-primary);">Редактирование статьи</h3>
        <button @click="closeEditModal" class="text-obl-muted hover:text-obl-accent transition-colors">✕</button>
      </div>
      <form @submit.prevent="updateArticle" class="space-y-obl-4">
        <div class="input-group"><label class="input-label">Заголовок</label><input v-model="editForm.title" type="text" class="input" required /></div>
        <div class="input-group"><label class="input-label">Категория</label><select v-model="editForm.category" class="input" required><option value="IT">IT</option><option value="HR">HR</option><option value="Финансы">Финансы</option><option value="Маркетинг">Маркетинг</option></select></div>
        <div class="input-group"><label class="input-label">Содержимое</label><textarea v-model="editForm.content" class="input min-h-[200px] resize-none" required></textarea></div>
        <div class="flex gap-obl-3 justify-end mt-obl-6"><button type="button" @click="closeEditModal" class="btn btn-subtle">Отмена</button><button type="submit" class="btn btn-primary" :disabled="editLoading">{{ editLoading ? 'Сохранение...' : 'Сохранить изменения' }}</button></div>
      </form>
    </div>
  </div>

  <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" @click.self="closeDeleteConfirm">
    <div class="bg-obl-surface border border-obl-border-default rounded-obl-lg p-obl-6 w-full max-w-md mx-obl-4 text-center">
      <div class="text-red-400 text-4xl mb-obl-4">⚠️</div>
      <h3 class="text-lg font-bold mb-obl-2" style="color: var(--text-primary);">Удалить статью?</h3>
      <p class="text-obl-muted text-sm mb-obl-6">Вы уверены? Это действие нельзя отменить.</p>
      <div class="flex gap-obl-3 justify-center"><button @click="closeDeleteConfirm" class="btn btn-subtle">Отмена</button><button @click="deleteArticle" class="btn btn-primary" style="background: #e05252; border-color: #e05252;">Удалить</button></div>
    </div>
  </div>

  <div v-if="showAddUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" @click.self="closeAddUserModal">
    <div class="bg-obl-surface border border-obl-border-default rounded-obl-lg p-obl-6 w-full max-w-md mx-obl-4">
      <div class="flex justify-between items-center mb-obl-6"><h3 class="text-lg font-bold" style="color: var(--text-primary);">Добавление сотрудника</h3><button @click="closeAddUserModal" class="text-obl-muted hover:text-obl-accent">✕</button></div>
      <form @submit.prevent="addUser" class="space-y-obl-4">
        <input v-model="newUser.employee_id" type="text" class="input" placeholder="OBL-XXXX" required />
        <input v-model="newUser.first_name" type="text" class="input" placeholder="Имя" required />
        <input v-model="newUser.last_name" type="text" class="input" placeholder="Фамилия" required />
        <input v-model="newUser.email" type="email" class="input" placeholder="Email" required />
        <input v-model="newUser.password" type="password" class="input" placeholder="Пароль" required />
        <select v-model="newUser.role" class="input" required><option value="user">Сотрудник (user)</option><option value="editor">Редактор (editor)</option><option value="admin">Администратор (admin)</option></select>
        <div class="flex gap-obl-3 justify-end"><button type="button" @click="closeAddUserModal" class="btn btn-subtle">Отмена</button><button type="submit" class="btn btn-primary" :disabled="addUserLoading">{{ addUserLoading ? 'Добавление...' : 'Добавить' }}</button></div>
      </form>
    </div>
  </div>

  <!-- Модальное окно подтверждения удаления сотрудника -->
  <div v-if="showDeleteUserConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" @click.self="closeDeleteUserConfirm">
    <div class="bg-obl-surface border border-obl-border-default rounded-obl-lg p-obl-6 w-full max-w-md mx-obl-4">
      <div class="flex justify-between items-center mb-obl-6">
        <h3 class="text-lg font-bold" style="color: var(--text-primary);">Удаление сотрудника</h3>
        <button @click="closeDeleteUserConfirm" class="text-obl-muted hover:text-obl-accent transition-colors">✕</button>
      </div>
      <div class="text-center">
        <div class="text-red-400 text-4xl mb-obl-4">⚠️</div>
        <p class="text-obl-primary text-sm mb-obl-2">
          Вы действительно хотите удалить сотрудника?
        </p>
        <p class="text-obl-accent font-mono text-sm mb-obl-6">
          {{ userToDelete?.first_name }} {{ userToDelete?.last_name }} ({{ userToDelete?.employee_id }})
        </p>
        <p class="text-obl-muted text-xs mb-obl-6">Это действие нельзя отменить.</p>
        <div class="flex gap-obl-3 justify-end">
          <button @click="closeDeleteUserConfirm" class="btn btn-subtle">Отмена</button>
          <button @click="deleteUser" class="btn btn-primary bg-red-600 hover:bg-red-700" :disabled="deleteUserLoading">
            {{ deleteUserLoading ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()
const activeSection = ref('profile')

// ========== ДАННЫЕ ПОЛЬЗОВАТЕЛЯ ==========
const userData = ref({ first_name: '', last_name: '', employee_id: '', email: '', role: '' })
const userRole = computed(() => userData.value.role || localStorage.getItem('userRole') || 'user')
const userName = computed(() => `${userData.value.first_name || ''} ${userData.value.last_name || ''}`.trim() || 'Пользователь')
const userRoleText = computed(() => userRole.value === 'admin' ? 'АДМИНИСТРАТОР' : userRole.value === 'editor' ? 'РЕДАКТОР' : 'СОТРУДНИК')
const initials = computed(() => `${(userData.value.first_name?.[0] || '')}${(userData.value.last_name?.[0] || '')}`.toUpperCase() || 'U')

const navItems = [{ id: 'profile', label: 'Мой профиль' }, { id: 'favorites', label: 'Избранное' }]

// ========== СКРОЛЛ К ИЗБРАННОМУ ==========
const scrollToSection = (sectionId) => {
  activeSection.value = sectionId

  setTimeout(() => {
    if (sectionId === 'favorites') {
      const element = document.getElementById('favorites-section')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, 100)
}

const loadUserData = async () => {
  try {
    const res = await api.get('/profile')
    userData.value = res.data
    localStorage.setItem('userRole', res.data.role)
  } catch (e) {
    console.error('Ошибка загрузки профиля:', e)
  }
}

// ========== УПРАВЛЕНИЕ СТАТЬЯМИ ==========
const categoryToId = { 'IT': 2, 'HR': 1, 'Финансы': 3, 'Маркетинг': 4 }
const idToCategory = { 1: 'HR', 2: 'IT', 3: 'Финансы', 4: 'Маркетинг' }

const articleData = ref({ title: '', category: '', content: '' })
const articleLoading = ref(false)
const articlesList = ref([])
const articlesLoading = ref(true)
const filterCategory = ref('')
const searchTitle = ref('')
const articleSortField = ref('id')
const articleSortOrder = ref('asc')
const showEditModal = ref(false)
const editForm = ref({ id: null, title: '', category: '', content: '' })
const editLoading = ref(false)
const showDeleteConfirm = ref(false)
const deleteTarget = ref(null)

const loadArticles = async () => {
  articlesLoading.value = true
  try {
    const res = await api.get('/articles')
    articlesList.value = res.data
  } catch (e) {
    articlesList.value = []
  } finally {
    articlesLoading.value = false
  }
}

const toggleArticleSort = (field) => {
  if (articleSortField.value === field) articleSortOrder.value = articleSortOrder.value === 'asc' ? 'desc' : 'asc'
  else { articleSortField.value = field; articleSortOrder.value = 'asc' }
}

const filteredArticles = computed(() => {
  let result = articlesList.value
  if (filterCategory.value) result = result.filter(a => a.category_name === filterCategory.value)
  if (searchTitle.value) { const q = searchTitle.value.toLowerCase(); result = result.filter(a => a.title.toLowerCase().includes(q)) }
  return result
})

const sortedFilteredArticles = computed(() => {
  const list = [...filteredArticles.value]
  return list.sort((a, b) => {
    let valA = a[articleSortField.value] || '', valB = b[articleSortField.value] || ''
    if (typeof valA === 'number') return articleSortOrder.value === 'asc' ? valA - valB : valB - valA
    return articleSortOrder.value === 'asc' ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA))
  })
})

const createArticle = async () => {
  if (!articleData.value.category) { alert('Выберите категорию'); return }
  const categoryId = categoryToId[articleData.value.category]
  articleLoading.value = true
  try {
    await api.post('/articles', { title: articleData.value.title, content: articleData.value.content, category_id: categoryId })
    alert('Статья опубликована!')
    articleData.value = { title: '', category: '', content: '' }
    loadArticles()
  } catch (e) { alert('Ошибка: ' + (e.response?.data?.error || 'нет связи')) }
  finally { articleLoading.value = false }
}

const openEditModal = (article) => { editForm.value = { id: article.id, title: article.title, category: article.category_name || idToCategory[article.category_id] || 'IT', content: article.content }; showEditModal.value = true }
const closeEditModal = () => { showEditModal.value = false }
const updateArticle = async () => {
  editLoading.value = true
  try {
    await api.put(`/articles/${editForm.value.id}`, { title: editForm.value.title, content: editForm.value.content, category_id: categoryToId[editForm.value.category] })
    alert('Статья обновлена!'); closeEditModal(); loadArticles()
  } catch (e) { alert('Ошибка: ' + (e.response?.data?.error || 'ошибка сервера')) }
  finally { editLoading.value = false }
}

const confirmDelete = (article) => { deleteTarget.value = article; showDeleteConfirm.value = true }
const closeDeleteConfirm = () => { showDeleteConfirm.value = false; deleteTarget.value = null }
const deleteArticle = async () => {
  if (!deleteTarget.value) return
  try { await api.delete(`/articles/${deleteTarget.value.id}`); alert('Статья удалена!'); closeDeleteConfirm(); loadArticles() }
  catch (e) { alert('Ошибка: ' + (e.response?.data?.error || 'ошибка сервера')) }
}

// ========== УПРАВЛЕНИЕ СОТРУДНИКАМИ ==========
const usersList = ref([])
const usersLoading = ref(true)
const userSortField = ref('employee_id')
const userSortOrder = ref('asc')
const showAddUserModal = ref(false)
const addUserLoading = ref(false)
const newUser = ref({ employee_id: '', first_name: '', last_name: '', email: '', password: '', role: 'user' })
const showDeleteUserConfirm = ref(false)
const userToDelete = ref(null)
const deleteUserLoading = ref(false)

const loadUsers = async () => {
  usersLoading.value = true
  try { const res = await api.get('/users'); usersList.value = res.data }
  catch (e) { usersList.value = [] }
  finally { usersLoading.value = false }
}

const toggleUserSort = (field) => {
  if (userSortField.value === field) userSortOrder.value = userSortOrder.value === 'asc' ? 'desc' : 'asc'
  else { userSortField.value = field; userSortOrder.value = 'asc' }
}

const sortedUsers = computed(() => {
  const list = [...usersList.value]
  return list.sort((a, b) => {
    let valA = a[userSortField.value] || '', valB = b[userSortField.value] || ''
    if (typeof valA === 'number') return userSortOrder.value === 'asc' ? valA - valB : valB - valA
    return userSortOrder.value === 'asc' ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA))
  })
})

const changeRole = async (userId, newRole) => {
  try { await api.patch(`/users/${userId}/role`, { role: newRole }); const user = usersList.value.find(u => u.id === userId); if (user) user.role = newRole; alert(`Роль изменена на ${newRole}`) }
  catch (e) { alert('Ошибка: ' + (e.response?.data?.error || 'ошибка сервера')) }
}

const openAddUserModal = () => { newUser.value = { employee_id: '', first_name: '', last_name: '', email: '', password: '', role: 'user' }; showAddUserModal.value = true }
const closeAddUserModal = () => { showAddUserModal.value = false }

const addUser = async () => {
  addUserLoading.value = true
  try {
    await api.post('/auth/register', { employee_id: newUser.value.employee_id, password: newUser.value.password, role: newUser.value.role, email: newUser.value.email, first_name: newUser.value.first_name, last_name: newUser.value.last_name })
    alert('Сотрудник добавлен!'); closeAddUserModal(); loadUsers()
  } catch (e) { alert('Ошибка: ' + (e.response?.data?.error || 'ошибка сервера')) }
  finally { addUserLoading.value = false }
}

const confirmDeleteUser = (user) => {
  if (user.employee_id === 'OBL-0001') { alert('Нельзя удалить главного администратора!'); return }
  if (user.id === userData.value.id) { alert('Нельзя удалить самого себя'); return }
  userToDelete.value = user
  showDeleteUserConfirm.value = true
}

const closeDeleteUserConfirm = () => { showDeleteUserConfirm.value = false; userToDelete.value = null }

const deleteUser = async () => {
  if (!userToDelete.value) return
  deleteUserLoading.value = true
  try {
    await api.delete(`/users/${userToDelete.value.id}`)
    alert('Сотрудник удалён')
    closeDeleteUserConfirm()
    loadUsers()
  } catch (e) {
    alert('Ошибка: ' + (e.response?.data?.error || 'ошибка сервера'))
  } finally {
    deleteUserLoading.value = false
  }
}

// ========== ИЗБРАННОЕ ==========
const favoritesList = ref([])
const favoritesLoading = ref(false)

const loadFavorites = async () => {
  favoritesLoading.value = true
  try {
    const res = await api.get('/favorites')
    favoritesList.value = res.data
  } catch (e) {
    console.error('Ошибка загрузки избранного:', e)
    favoritesList.value = []
  } finally {
    favoritesLoading.value = false
  }
}

const removeFromFavorites = async (articleId) => {
  try {
    await api.delete(`/favorites/${articleId}`)
    await loadFavorites()
    alert('Статья удалена из избранного')
  } catch (e) {
    alert('Ошибка: ' + (e.response?.data?.error || 'не удалось удалить'))
  }
}

const goToArticle = (id) => {
  router.push(`/article/${id}`)
}

// ========== АКТИВНОСТЬ ==========
const recentActivity = ref([])

const loadRecentActivity = async () => {
  try {
    const res = await api.get('/articles/recent')
    recentActivity.value = res.data.slice(0, 3).map(article => ({
      title: article.title,
      action: 'Просмотрено',
      time: formatRelativeDate(article.updated_at),
      cat: article.category_name || 'Общее'
    }))
  } catch (e) {
    console.error('Ошибка загрузки активности:', e)
    recentActivity.value = []
  }
}

const formatRelativeDate = (dateString) => {
  if (!dateString) return 'давно'
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'сегодня'
  if (diffDays === 1) return 'вчера'
  if (diffDays < 7) return `${diffDays} дня назад`
  if (diffDays < 14) return 'неделю назад'
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

// ========== ПРЕДЛОЖЕНИЯ И ЖАЛОБЫ ==========
const showSuggestion = ref(false)
const showComplaint = ref(false)
const suggestionText = ref('')
const complaintText = ref('')
const proposalsList = ref([])
const proposalsLoading = ref(false)

const submitSuggestion = async () => {
  if (!suggestionText.value.trim()) {
    alert('Введите текст предложения')
    return
  }
  try {
    await api.post('/proposals', {
      title: 'Предложение от ' + userData.value.employee_id,
      content: suggestionText.value,
      category_id: 1
    })
    alert('Спасибо за предложение!')
    suggestionText.value = ''
    showSuggestion.value = false
  } catch (e) {
    alert('Ошибка: ' + (e.response?.data?.error || 'не удалось отправить'))
  }
}

const submitComplaint = async () => {
  if (!complaintText.value.trim()) {
    alert('Введите текст жалобы')
    return
  }
  try {
    await api.post('/complaints', {
      text: complaintText.value
    })
    alert('Жалоба отправлена анонимно')
    complaintText.value = ''
    showComplaint.value = false
  } catch (e) {
    alert('Ошибка: ' + (e.response?.data?.error || 'не удалось отправить'))
  }
}

const loadProposals = async () => {
  proposalsLoading.value = true
  try {
    const res = await api.get('/proposals/my')
    proposalsList.value = res.data
  } catch (e) {
    console.error('Ошибка загрузки предложений:', e)
    proposalsList.value = []
  } finally {
    proposalsLoading.value = false
  }
}

const getStatusText = (status) => {
  const map = {
    pending: 'На рассмотрении',
    in_progress: 'В работе',
    approved: 'Принято ✅',
    rejected: 'Отклонено ❌'
  }
  return map[status] || status
}

const getStatusClass = (status) => {
  const map = {
    pending: 'text-ob-accent border-ob-accent',
    in_progress: 'text-blue-400 border-blue-400',
    approved: 'text-green-400 border-green-400',
    rejected: 'text-red-400 border-red-400'
  }
  return map[status] || ''
}

// ========== ВЫХОД ==========
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  router.push('/login')
}

// ========== ЗАГРУЗКА ПРИ МОНТИРОВАНИИ ==========
onMounted(() => {
  loadUserData()
  loadArticles()
  loadRecentActivity()
  if (userRole.value === 'admin') loadUsers()
  loadFavorites()
})
</script>

<style scoped>
.data-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; }
.data-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px; }
.data-value { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); line-height: 1.4; }
.action-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; transition: border-color 0.15s ease; }
.action-card:hover { border-color: var(--border-accent); }
.nav-item { color: var(--text-muted); font-family: var(--font-sans); }
.nav-item:hover { color: var(--text-primary); background: var(--bg-elevated); }
.nav-item-active { color: var(--accent); background: var(--accent-dim); font-family: var(--font-sans); }
.loading-spinner { width: 32px; height: 32px; border: 2px solid var(--border-default); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.overflow-y-auto::-webkit-scrollbar { width: 6px; height: 6px; }
.overflow-y-auto::-webkit-scrollbar-track { background: var(--border-subtle); border-radius: 4px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 4px; }
</style>

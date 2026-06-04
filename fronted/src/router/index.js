// ИЗМЕНЕНИЕ: Добавлен маршрут для страницы отдельной статьи /article /: id

import { createRouter, createWebHistory } from 'vue-router'

// Импортируем компоненты
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import Profile from '../views/Profile.vue'
import Article from '../views/Article.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/article/:id',
    name: 'article',
    component: Article,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    // НОВЫЙ МАРШРУТ для страницы статьи
    path: '/article/:id',
    name: 'article',
    component: Article,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Глобальный навигационный гвард
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' })
  }

  if (to.meta.guestOnly && token) {
    return next({ name: 'profile' })
  }

  if (to.meta.requiresAdmin && userRole !== 'admin') {
    alert('Доступ ограничен. Требуются права администратора.')
    return next({ name: 'profile' })
  }

  next()
})

export default router
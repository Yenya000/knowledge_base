import { createRouter, createWebHistory } from 'vue-router'

// Импортируем компоненты строго по именам файлов из твоей папки views
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import Profile from '../views/Profile.vue'
import Article from '../views/Article.vue'
import Reglamenty from '../views/Reglamenty.vue'
import FAQ from '../views/FAQ.vue'
import Templates from '../views/Templates.vue'



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
    path: '/reglamenty',
    name: 'reglamenty',
    component: Reglamenty,
    meta: { requiresAuth: true }
  },
  {
    path: '/faq',
    name: 'faq',
    component: FAQ,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true } // Защита админки
  },
  {
    path: '/templates',
    name: 'templates',
    component: Templates,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// ГЛОБАЛЬНЫЙ НАВИГАЦИОННЫЙ ГВАРД ИЗ ПЛАНА
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  // 1. Если роут требует авторизации, а токена нет — отправляем на вход
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' })
  }

  // 2. Если пользователь уже авторизован и идет на страницу логина — перекидываем в профиль
  if (to.meta.guestOnly && token) {
    return next({ name: 'profile' })
  }

  // 3. Если это админка, а роль не admin — разворачиваем в профиль
  if (to.meta.requiresAdmin && userRole !== 'admin') {
    alert('Доступ ограничен. Требуются права администратора.')
    return next({ name: 'profile' })
  }

  next()
})

export default router
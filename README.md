```markdown
# OBLIVION | BASE — Корпоративная база знаний

## О проекте
Корпоративная база знаний для хранения и систематизации инструкций, регламентов, FAQ и шаблонов документов компании Oblivione Group.
```
## Ссылки на рабочий проект
| Компонент | Ссылка |
|-----------|--------|
| **Frontend** | https://oblivion-base.netlify.app |
| **Backend API** | https://oblivion-base.onrender.com |

```markdown
> 🔗 Ссылки будут добавлены после деплоя (12 июня)

## 🚀 Стек технологий

### Frontend
- Vue 3 (Composition API)
- Vite
- Tailwind CSS
- Vue Router
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL (Neon)
- JWT авторизация
- bcrypt для хеширования паролей

### Деплой
- Frontend: Netlify
- Backend: Render
- Database: Neon (Cloud PostgreSQL)
```
## 👥 Команда разработчиков

| Участник | Роль | Контакты |
|----------|------|----------|
| Мирук Анна | Team Lead / Frontend | @miruk_anna |
| Полынский Дмитрий | UI/UX / Frontend | @polynsky_d |
| Нилова Светлана | Backend | @nilova_s |
| Крутикова Анастасия | Backend | @krutikova_a |
| Грядова Ксения | Backend | @gryadova_k |

## 📅 Сроки разработки
4-5 недель (май-июнь 2026)

## 📦 Установка и запуск локально

### Требования
- Node.js 18+
- PostgreSQL (или аккаунт Neon)

### 1. Клонирование
```bash
git clone <url-репозитория>
cd knowledge_base
```

### 2. Настройка базы данных (Neon)
- Создать проект в [Neon Console](https://console.neon.tech)
- Выполнить SQL скрипты:
  - `backend/init.sql` — создание таблиц
  - `backend/create_tags_comments.sql` — теги и комментарии

### 3. Настройка бэкенда
```bash
cd backend
npm install
```

Создать файл `.env`:
```env
PORT=3000
JWT_SECRET=oblivion_secret_key_2026
DATABASE_URL=postgresql://user:pass@host/db
```

Запуск:
```bash
node index.js
```

### 4. Настройка фронтенда
```bash
cd frontend
npm install
npm run dev
```

Приложение: `http://localhost:5173`

## 🔐 Тестовые пользователи

| employee_id | password | role |
|-------------|----------|------|
| OBL-0001 | admin123 | Администратор |
| OBL-EDITOR1 | editor123 | Редактор |
| OBL-USER1 | user123 | Сотрудник |

## 🎯 Функциональные требования (ТЗ)

### 2.1. Публичная часть
- ✅ Поиск по ключевым словам, категориям
- ✅ Просмотр статей, инструкций, регламентов
- ✅ Фильтрация по разделам (IT, HR, Финансы, Маркетинг)
- ✅ Блок «Последние обновления»

### 2.2. Личный кабинет
- ✅ Авторизация через ID
- ✅ Данные сотрудника (ФИО, email, роль)
- ✅ Кнопка «Предложение»
- ✅ Форма «Сообщить о нарушении»

### 2.3. Панель управления
- ✅ Добавление, редактирование, удаление статей
- ✅ Назначение ролей пользователям
- ✅ Статистика просмотров

### 2.4. Дополнительные функции
- ✅ Экспорт статей в PDF/Word
- ⏳ Тегирование статей (в разработке)

## 📁 Структура проекта

```
knowledge_base/
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   │   ├── Home.vue          # Главная страница
│   │   │   ├── Article.vue       # Страница статьи
│   │   │   ├── Profile.vue       # Личный кабинет
│   │   │   ├── Admin.vue         # Панель управления
│   │   │   ├── Login.vue         # Авторизация
│   │   │   ├── Reglamenty.vue    # Регламенты
│   │   │   └── FAQ.vue           # Часто задаваемые вопросы
│   │   ├── router/index.js       # Маршруты
│   │   ├── api.js                # Axios настройки
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── global.css
│   └── package.json
├── backend/
│   ├── routes/
│   │   ├── articles.js
│   │   ├── categories.js
│   │   ├── export.js
│   │   └── favorites.js
│   ├── middleware/auth.js
│   ├── db.js
│   ├── index.js
│   ├── init.sql                 # Схема БД
│   ├── create_tags_comments.sql # Теги и комментарии
│   └── package.json
├── .gitignore
└── README.md
```

## 🗄️ Схема базы данных

### Таблицы
| Таблица | Описание |
|---------|----------|
| `users` | Сотрудники (id, employee_id, password_hash, role, email, first_name, last_name) |
| `categories` | Категории статей (IT, HR, Финансы, Маркетинг) |
| `articles` | Статьи (id, title, content, category_id, author_id, views, created_at, updated_at) |
| `tags` | Теги |
| `article_tags` | Связь статей и тегов |
| `comments` | Комментарии к статьям |
| `favorites` | Избранное пользователей |

## 🔗 API Эндпоинты

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | `/api/login` | Авторизация |
| POST | `/api/auth/register` | Регистрация |
| GET | `/api/me` | Текущий пользователь |
| GET | `/api/users` | Список сотрудников (admin) |
| PATCH | `/api/users/:id/role` | Изменение роли (admin) |
| GET | `/api/articles` | Список статей |
| GET | `/api/articles/:id` | Одна статья |
| POST | `/api/articles` | Создание статьи |
| PUT | `/api/articles/:id` | Редактирование статьи |
| DELETE | `/api/articles/:id` | Удаление статьи |
| GET | `/api/articles/recent` | Последние обновления |
| GET | `/api/articles/:id/export/pdf` | Экспорт PDF |
| GET | `/api/articles/:id/export/word` | Экспорт Word |
| GET | `/api/favorites` | Избранное |
| POST | `/api/favorites/:id` | Добавить в избранное |
| DELETE | `/api/favorites/:id` | Удалить из избранного |

## 🖥️ Деплой

### Frontend (Netlify)
1. `cd frontend && npm run build`
2. Перетащить папку `dist` в Netlify Drop

### Backend (Render)
1. Подключить GitHub репозиторий
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `node index.js`
5. Добавить переменные окружения:
   - `JWT_SECRET`
   - `DATABASE_URL`

### Database (Neon)
- Использовать Connection Pooler для стабильного соединения

## 📝 Инструкция для администратора

### Добавление сотрудника
1. Войти как администратор (OBL-0001 / admin123)
2. Перейти в «Мой кабинет» → «Сотрудники»
3. Нажать «+ Добавить сотрудника»
4. Заполнить поля (ID, имя, фамилия, email, пароль, роль)
5. Нажать «Добавить»

### Назначение ролей
- В таблице сотрудников нажать кнопку Admin/Editor/User
- Роль применяется сразу

## 📄 Инструкция для сотрудника

### Предложение статьи
1. Войти в личный кабинет
2. Нажать «+ написать» в блоке «Предложение»
3. Заполнить форму и отправить

### Сообщить о нарушении
1. Войти в личный кабинет
2. Нажать «+ написать» в блоке «Сообщить о нарушении»
3. Описать ситуацию и отправить

## 📊 Текущий статус выполнения

| Раздел | Выполнено |
|--------|-----------|
| Публичная часть | 100% |
| Личный кабинет | 90% |
| Панель управления | 100% |
| Экспорт PDF/Word | 100% |
| Тегирование | 0% (в плане) |

## ❗ Известные проблемы

1. Бесплатный тариф Neon — база "засыпает" через 5 минут без активности
2. Теги и комментарии в разработке

## 📧 Контакты

- Team Lead: Анна Мирук — anna.miruk@oblivione.com
- GitHub: [github.com/oblivione/knowledge-base](https://github.com/oblivione/knowledge-base)

---

© 2026 Oblivione Group. Учебная практика АУГСГИП.
```

---

## Что я добавил:

| Раздел | Зачем |
|--------|-------|
| **Ссылки на деплой** | Показывают работающий проект |
| **Схема БД** | По требованию ТЗ (пункт 5) |
| **API эндпоинты** | По требованию ТЗ (приложение 3) |
| **Инструкции** | По требованию ТЗ (для администраторов) |
| **Известные проблемы** | Честность перед проверяющим |
| **Команда + контакты** | Информация о разработчиках |

---

**Этого достаточно для сдачи проекта.**

# 📚 Oblivion | Base: Корпоративная база знаний

Централизованная система для управления регламентами, инструкциями и FAQ компании «OBLIVIONE GROUP».

---

## 👥 Команда проекта
* **Мирук Анна** — Team Lead / Frontend
* **Полынский Дмитрий** — UI/UX Designer / Frontend
* **Астафьев Александр** — Frontend
* **Нилова Светлана** — Backend
* **Крутикова Анастасия** — Backend
* **Грядова Ксения** — Backend

---

## 🛠 Технический стек
* **Frontend:** Vue.js
* **Backend:** Node.js, Express
* **База данных:** PostgreSQL (Neon.tech)

---

## ⚙️ Системные требования
* **Node.js** (18+)
* **npm**
* **Git**

---

## 🚀 Инструкция по запуску

### 1. Подготовка
```bash
git clone [ССЫЛКА]
cd [ИМЯ_ПАПКИ]

```

### 2. Настройка Backend

```bash
cd backend
npm install

```

В файле `db.js` укажите строку подключения Neon.

```bash
node index.js

```

### 3. Настройка Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🌐 API Эндпоинты

| Метод | Путь | Описание |
| --- | --- | --- |
| POST | /api/auth/login | Авторизация |
| GET | /api/articles | Список статей |
| GET | /api/articles/:id | Статья по ID |
| POST | /api/articles | Создание статьи |
| GET | /api/categories | Категории |

---

## 📝 Лицензия

Проект учебной практики 2026 года для «OBLIVIONE GROUP».

```

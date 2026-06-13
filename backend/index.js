require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');
const articlesRouter = require('./routes/articles');
const categoriesRouter = require('./routes/categories');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = 3000;
const exportRouter = require('./routes/export');
const favoritesRouter = require('./routes/favorites');
const tagsRouter = require('./routes/tags');
const commentsRouter = require('./routes/comments');
const JWT_SECRET = process.env.JWT_SECRET || 'oblivion_secret_key_2026';

// ========== НАСТРОЙКА CORS ==========
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ========== ПОДКЛЮЧЕНИЕ РОУТОВ ==========
app.use('/api/articles', exportRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/comments', commentsRouter);

// ========== РЕГИСТРАЦИЯ ==========
app.post('/api/auth/register', async (req, res) => {
    const { employee_id, password, role = 'user', email, first_name, last_name } = req.body;

    if (!employee_id || !password) {
        return res.status(400).json({ error: 'логин и пароль обязательны' });
    }

    try {
        const existing = await db.query(
            'SELECT id FROM users WHERE employee_id = $1',
            [employee_id]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Пользователь с таким логином уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            `INSERT INTO users (employee_id, password_hash, role, email, first_name, last_name) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING id, employee_id, role, created_at`,
            [employee_id, hashedPassword, role, email || null, first_name || null, last_name || null]
        );

        res.status(201).json({
            message: 'Пользователь успешно создан',
            user: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ========== ЛОГИН ==========
app.post('/api/login', async (req, res) => {
    const { employee_id, password } = req.body;

    try {
        const result = await db.query(
            'SELECT id, employee_id, password_hash, role FROM users WHERE employee_id = $1',
            [employee_id]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        const token = jwt.sign(
            { id: user.id, employee_id: user.employee_id, role: user.role },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token, role: user.role, employee_id: user.employee_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ========== ЗАЩИЩЁННЫЙ ПРОФИЛЬ ==========
app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, employee_id, role, first_name, last_name, email, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ========== СПИСОК ВСЕХ СОТРУДНИКОВ (ТОЛЬКО АДМИНУ) ==========
app.get('/api/users', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещён. Только для администраторов.' });
    }

    try {
        const result = await db.query(
            `SELECT id, employee_id, first_name, last_name, email, role, created_at 
             FROM users 
             ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ========== ИЗМЕНЕНИЕ РОЛИ (ТОЛЬКО АДМИНУ) ==========
app.patch('/api/users/:id/role', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещён. Только для администраторов.' });
    }

    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ['admin', 'editor', 'user'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Недопустимая роль. Допустимые: admin, editor, user' });
    }

    if (id === req.user.id) {
        return res.status(400).json({ error: 'Нельзя изменить роль самому себе' });
    }

    try {
        const result = await db.query(
            'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, employee_id, role, created_at',
            [role, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json({
            message: 'Роль успешно обновлена',
            user: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ========== УДАЛЕНИЕ СОТРУДНИКА (ТОЛЬКО АДМИНУ) ==========
app.delete('/api/users/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещён. Только для администраторов.' });
    }

    const { id } = req.params;

    if (id === req.user.id) {
        return res.status(400).json({ error: 'Нельзя удалить самого себя' });
    }

    const adminCheck = await db.query('SELECT employee_id FROM users WHERE id = $1', [id]);
    if (adminCheck.rows[0]?.employee_id === 'OBL-0001') {
        return res.status(400).json({ error: 'Нельзя удалить главного администратора' });
    }

    try {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.json({ message: 'Пользователь удалён' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ========== ПОЛУЧЕНИЕ ДАННЫХ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ (/api/me) ==========
app.get('/api/me', authMiddleware, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, employee_id, email, first_name, last_name, role, created_at FROM users WHERE id = $1',
            [req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Ошибка /api/me:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ========== ОСНОВНЫЕ РОУТЫ ==========
app.use('/api/articles', articlesRouter);
app.use('/api/categories', categoriesRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
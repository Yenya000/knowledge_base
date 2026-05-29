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
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// ========== РЕГИСТРАЦИЯ ==========
app.post('/api/auth/register', async (req, res) => {
    const { employee_id, password, role = 'user' } = req.body;

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
            `INSERT INTO users (employee_id, password_hash, role) 
             VALUES ($1, $2, $3) 
             RETURNING id, employee_id, role, created_at`,
            [employee_id, hashedPassword, role]
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
            'SELECT employee_id, role, created_at FROM users WHERE id = $1',
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

// ========== РОУТЫ ==========
app.use('/api/articles', articlesRouter);
app.use('/api/categories', categoriesRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
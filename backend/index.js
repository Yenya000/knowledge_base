const express = require('express');
const cors = require('cors');  
const jwt = require('jsonwebtoken');
const db = require('./db');
const articlesRouter = require('./routes/articles');
const categoriesRouter = require('./routes/categories');
const { authMiddleware } = require('./middleware/auth');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'oblivion_secret_key_2026';

// ========== ЛОГИН (по employee_id) ==========
app.post('/api/login', async (req, res) => {
    const { employee_id, password } = req.body;

    try {
        const result = await db.query(
            'SELECT id, employee_id, password_hash, role FROM users WHERE employee_id = $1',
            [employee_id]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Неверный employee_id или пароль' });
        }

        // Прямое сравнение (пароль в БД хранится открыто, как в вашем db.js: 'admin123')
        if (password !== user.password_hash) {
            return res.status(401).json({ error: 'Неверный employee_id или пароль' });
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
app.get('/api/profile', authMiddleware, (req, res) => {
    res.json({
        message: 'Защищённые данные профиля',
        user: req.user
    });
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
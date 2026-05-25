const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const app = express();

app.use(express.json());

const JWT_SECRET = 'oblivion_secret_key_2026';

// ========== EMAIL ==========
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT id, email, password_hash, role FROM users WHERE email = $1',
            [email]
        );
        
        const user = result.rows[0];
        
        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        if (password !== user.password_hash) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token, role: user.role, email: user.email });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ========== ЗАЩИЩЁННЫЙ РОУТ ==========
const { authMiddleware } = require('./middleware/auth');

app.get('/api/profile', authMiddleware, (req, res) => {
    res.json({ 
        message: 'Это защищённые данные профиля',
        user: req.user 
    });
});

// ========== СУЩЕСТВУЮЩИЕ РОУТЫ ==========
app.use('/api/categories', require('./routes/categories'));
app.use('/api/articles', require('./routes/articles'));

app.get('/', (req, res) => {
    res.send('Hello World');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
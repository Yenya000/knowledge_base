const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('../middleware/auth');

// Простой кэш в памяти
let articlesCache = {
    data: null,
    timestamp: 0,
    ttl: 30 * 10000, 
};

// Все статьи с именем категории и данными автора (employee_id, role)
router.get('/', async (req, res) => {
    try {
        const now = Date.now();
        // Если кэш свежий — отдаём из памяти
        if (articlesCache.data && (now - articlesCache.timestamp) < articlesCache.ttl) {
            return res.json(articlesCache.data);
        }

        const result = await pool.query(`
            SELECT 
                articles.*, 
                categories.name AS category_name,
                users.employee_id AS author_employee_id,
                users.role AS author_role
            FROM articles
            LEFT JOIN categories ON articles.category_id = categories.id
            LEFT JOIN users ON articles.author_id = users.id
            ORDER BY articles.updated_at DESC
        `);

        // Сохраняем в кэш
        articlesCache.data = result.rows;
        articlesCache.timestamp = now;

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Последние 10 статей (без кэша, можно добавить отдельно при желании)
router.get('/recent', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                articles.*, 
                categories.name AS category_name,
                users.employee_id AS author_employee_id
            FROM articles
            LEFT JOIN categories ON articles.category_id = categories.id
            LEFT JOIN users ON articles.author_id = users.id
            ORDER BY articles.updated_at DESC
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Одна статья по ID (с категорией и автором)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT 
                articles.*, 
                categories.name AS category_name,
                users.employee_id AS author_employee_id,
                users.role AS author_role
            FROM articles
            LEFT JOIN categories ON articles.category_id = categories.id
            LEFT JOIN users ON articles.author_id = users.id
            WHERE articles.id = $1
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Статья не найдена' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// СОЗДАНИЕ СТАТЬИ (требуется авторизация)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content, category_id } = req.body;
        const author_id = req.user.id; // UUID из токена

        if (!title || !content || !category_id) {
            return res.status(400).json({ error: 'Не хватает полей: title, content, category_id' });
        }

        // Проверяем существование категории
        const catCheck = await pool.query('SELECT id FROM categories WHERE id = $1', [category_id]);
        if (catCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Категория с таким id не найдена' });
        }

        // Проверяем, что автор (user) существует в БД
        const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [author_id]);
        if (userCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Автор с таким id не найден' });
        }

        const result = await pool.query(`
            INSERT INTO articles (title, content, category_id, author_id, created_at, updated_at)
            VALUES ($1, $2, $3, $4, NOW(), NOW())
            RETURNING *
        `, [title, content, category_id, author_id]);

        const newArticle = result.rows[0];

        // Добираем имя категории и employee_id автора для ответа
        const extra = await pool.query(`
            SELECT categories.name AS category_name, users.employee_id AS author_employee_id
            FROM categories, users
            WHERE categories.id = $1 AND users.id = $2
        `, [newArticle.category_id, newArticle.author_id]);

        // Сбрасываем кэш списка статей, чтобы новая статья сразу появилась
        articlesCache.data = null;
        articlesCache.timestamp = 0;

        res.status(201).json({
            ...newArticle,
            category_name: extra.rows[0]?.category_name || null,
            author_employee_id: extra.rows[0]?.author_employee_id || null
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при создании статьи' });
    }
});

module.exports = router;
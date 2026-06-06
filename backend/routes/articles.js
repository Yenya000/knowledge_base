const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, adminOrEditorMiddleware } = require('../middleware/auth');

// Простой кэш в памяти
let articlesCache = {
    data: null,
    timestamp: 0,
    ttl: 30 * 1000,
};

// Все статьи с фильтрацией, поиском, пагинацией и фильтром по тегам
router.get('/', async (req, res) => {
    try {
        const { category, search, tag, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        if (tag) {
            const tagQuery = `
                SELECT 
                    articles.*, 
                    categories.name AS category_name,
                    users.employee_id AS author_employee_id,
                    users.role AS author_role,
                    COALESCE(array_agg(tags.name) FILTER (WHERE tags.name IS NOT NULL), '{}') AS tags
                FROM articles
                LEFT JOIN categories ON articles.category_id = categories.id
                LEFT JOIN users ON articles.author_id = users.id
                LEFT JOIN article_tags ON articles.id = article_tags.article_id
                LEFT JOIN tags ON article_tags.tag_id = tags.id
                WHERE tags.name ILIKE $1
                GROUP BY articles.id, categories.name, users.employee_id, users.role
                ORDER BY articles.updated_at DESC
                LIMIT $2 OFFSET $3
            `;
            const result = await db.query(tagQuery, [`%${tag}%`, limit, offset]);
            return res.json(result.rows);
  
        }

        const useCache = !category && !search && page == 1 && limit == 20;
        const now = Date.now();
        if (useCache && articlesCache.data && (now - articlesCache.timestamp) < articlesCache.ttl) {
            return res.json(articlesCache.data);
        }

        let query = `
            SELECT 
                articles.*, 
                categories.name AS category_name,
                users.employee_id AS author_employee_id,
                users.role AS author_role
            FROM articles
            LEFT JOIN categories ON articles.category_id = categories.id
            LEFT JOIN users ON articles.author_id = users.id
        `;
        const conditions = [];
        const params = [];

        if (category) {
            if (isNaN(category)) {
                conditions.push(`categories.name ILIKE $${params.length + 1}`);
                params.push(category);
            } else {
                conditions.push(`articles.category_id = $${params.length + 1}`);
                params.push(parseInt(category));
            }
        }

        if (search) {
            conditions.push(
                `(articles.title ILIKE $${params.length + 1} OR articles.content ILIKE $${params.length + 1})`
            );
            params.push(`%${search}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY articles.updated_at DESC';
        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        if (useCache) {
            articlesCache.data = result.rows;
            articlesCache.timestamp = now;
        }

        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка получения статей:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Последние 10 статей (можно передать ?limit=)
router.get('/recent', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const result = await db.query(`
            SELECT 
                articles.*, 
                categories.name AS category_name,
                users.employee_id AS author_employee_id
            FROM articles
            LEFT JOIN categories ON articles.category_id = categories.id
            LEFT JOIN users ON articles.author_id = users.id
            ORDER BY articles.updated_at DESC
            LIMIT $1
        `, [limit]);
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка получения последних статей:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Одна статья по ID (счётчик просмотров)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Увеличиваем счётчик просмотров
        await db.query(`UPDATE articles SET views = views + 1 WHERE id = $1`, [id]);

        const result = await db.query(`
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
        console.error('Ошибка получения статьи:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// СОЗДАНИЕ СТАТЬИ (требуется авторизация)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content, category_id } = req.body;
        const author_id = req.user.id;

        if (!title || !content || !category_id) {
            return res.status(400).json({ error: 'Не хватает полей: title, content, category_id' });
        }

        const catCheck = await db.query('SELECT id FROM categories WHERE id = $1', [category_id]);
        if (catCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Категория с таким id не найдена' });
        }

        const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [author_id]);
        if (userCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Автор с таким id не найден' });
        }

        const result = await db.query(`
            INSERT INTO articles (title, content, category_id, author_id, created_at, updated_at, views)
            VALUES ($1, $2, $3, $4, NOW(), NOW(), 0)
            RETURNING *
        `, [title, content, category_id, author_id]);

        const newArticle = result.rows[0];

        const extra = await db.query(`
            SELECT categories.name AS category_name, users.employee_id AS author_employee_id
            FROM categories, users
            WHERE categories.id = $1 AND users.id = $2
        `, [newArticle.category_id, newArticle.author_id]);

        // Сбрасываем кэш
        articlesCache.data = null;
        articlesCache.timestamp = 0;

        res.status(201).json({
            ...newArticle,
            category_name: extra.rows[0]?.category_name || null,
            author_employee_id: extra.rows[0]?.author_employee_id || null
        });
    } catch (err) {
        console.error('Ошибка создания статьи:', err);
        res.status(500).json({ error: 'Ошибка при создании статьи' });
    }
});

// РЕДАКТИРОВАНИЕ СТАТЬИ (только admin или editor)
router.put('/:id', authMiddleware, adminOrEditorMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category_id } = req.body;

        if (!title && !content && !category_id) {
            return res.status(400).json({ error: 'Не передано ни одного поля для обновления' });
        }

        // Проверяем существование статьи
        const articleCheck = await db.query('SELECT id FROM articles WHERE id = $1', [id]);
        if (articleCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Статья не найдена' });
        }

        // Если передан category_id, проверяем его существование
        if (category_id) {
            const catCheck = await db.query('SELECT id FROM categories WHERE id = $1', [category_id]);
            if (catCheck.rows.length === 0) {
                return res.status(400).json({ error: 'Категория с таким id не найдена' });
            }
        }

        // Формируем динамический запрос
        const updates = [];
        const params = [];
        let paramIndex = 1;

        if (title) {
            updates.push(`title = $${paramIndex++}`);
            params.push(title);
        }
        if (content) {
            updates.push(`content = $${paramIndex++}`);
            params.push(content);
        }
        if (category_id) {
            updates.push(`category_id = $${paramIndex++}`);
            params.push(category_id);
        }
        updates.push(`updated_at = NOW()`);

        params.push(id);
        const query = `
            UPDATE articles 
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;

        const result = await db.query(query, params);
        const updatedArticle = result.rows[0];

        // Получаем дополнительные данные (имя категории, employee_id автора)
        const extra = await db.query(`
            SELECT categories.name AS category_name, users.employee_id AS author_employee_id
            FROM categories, users
            WHERE categories.id = $1 AND users.id = $2
        `, [updatedArticle.category_id, updatedArticle.author_id]);

        // Сбрасываем кэш
        articlesCache.data = null;
        articlesCache.timestamp = 0;

        res.json({
            ...updatedArticle,
            category_name: extra.rows[0]?.category_name || null,
            author_employee_id: extra.rows[0]?.author_employee_id || null
        });
    } catch (err) {
        console.error('Ошибка редактирования статьи:', err);
        res.status(500).json({ error: 'Ошибка при редактировании статьи' });
    }
});

// УДАЛЕНИЕ СТАТЬИ (только admin или editor)
router.delete('/:id', authMiddleware, adminOrEditorMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const articleCheck = await db.query('SELECT id FROM articles WHERE id = $1', [id]);
        if (articleCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Статья не найдена' });
        }

        await db.query('DELETE FROM articles WHERE id = $1', [id]);

        // Сбрасываем кэш
        articlesCache.data = null;
        articlesCache.timestamp = 0;

        res.status(200).json({ message: 'Статья успешно удалена' });
    } catch (err) {
        console.error('Ошибка удаления статьи:', err);
        res.status(500).json({ error: 'Ошибка при удалении статьи' });
    }
});

module.exports = router;
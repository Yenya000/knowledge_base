const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

// Все роуты избранного требуют авторизации
router.use(authMiddleware);

// GET /api/favorites — список избранного текущего пользователя
router.get('/', async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await db.query(`
            SELECT 
                articles.*, 
                categories.name AS category_name,
                favorites.created_at AS favorited_at
            FROM favorites
            JOIN articles ON favorites.article_id = articles.id
            LEFT JOIN categories ON articles.category_id = categories.id
            WHERE favorites.user_id = $1
            ORDER BY favorites.created_at DESC
        `, [userId]);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка получения избранного' });
    }
});

// POST /api/favorites/:article_id — добавить статью в избранное
router.post('/:article_id', async (req, res) => {
    const userId = req.user.id;
    const { article_id } = req.params;

    try {
        // Проверяем, существует ли статья
        const articleCheck = await db.query('SELECT id FROM articles WHERE id = $1', [article_id]);
        if (articleCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Статья не найдена' });
        }

        // Добавляем в избранное (если ещё не добавлено)
        await db.query(`
            INSERT INTO favorites (user_id, article_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, article_id) DO NOTHING
        `, [userId, article_id]);

        res.status(201).json({ message: 'Статья добавлена в избранное' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка добавления в избранное' });
    }
});

// DELETE /api/favorites/:article_id — удалить из избранного
router.delete('/:article_id', async (req, res) => {
    const userId = req.user.id;
    const { article_id } = req.params;

    try {
        const result = await db.query(`
            DELETE FROM favorites
            WHERE user_id = $1 AND article_id = $2
        `, [userId, article_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Статья не найдена в избранном' });
        }

        res.json({ message: 'Статья удалена из избранного' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка удаления из избранного' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// ПОЛУЧЕНИЕ ТЕГОВ 
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tags ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка получения тегов' });
    }
});

// ДОБАВЛЕНИЕ ТЕГА К СТАТЬЕ
router.post('/articles/:id/tags', authMiddleware, roleMiddleware('editor'), async (req, res) => {
    const articleId = req.params.id;
    const { tag_id } = req.body;

    if (!tag_id) {
        return res.status(400).json({ error: 'Необходимо указать tag_id' });
    }

    try {
        const articleExists = await db.query('SELECT id FROM articles WHERE id = $1', [articleId]);
        if (articleExists.rows.length === 0) {
            return res.status(404).json({ error: 'Статья не найдена' });
        }

        const tagExists = await db.query('SELECT id FROM tags WHERE id = $1', [tag_id]);
        if (tagExists.rows.length === 0) {
            return res.status(404).json({ error: 'Тег не найден' });
        }

        await db.query(
            `INSERT INTO article_tags (article_id, tag_id)
             VALUES ($1, $2)
             ON CONFLICT (article_id, tag_id) DO NOTHING`,
            [articleId, tag_id]
        );

        res.status(201).json({ message: 'Тег добавлен к статье' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка добавления тега' });
    }
});

// УДАЛЕНИЕ ТЕГА
router.delete('/articles/:id/tags/:tag_id', authMiddleware, roleMiddleware('editor'), async (req, res) => {
    const articleId = req.params.id;
    const tagId = req.params.tag_id;

    try {
        const result = await db.query(
            'DELETE FROM article_tags WHERE article_id = $1 AND tag_id = $2',
            [articleId, tagId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Связь статьи с тегом не найдена' });
        }

        res.json({ message: 'Тег удалён из статьи' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка удаления тега' });
    }
});

module.exports = router;
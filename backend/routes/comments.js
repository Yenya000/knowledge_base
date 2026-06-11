const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

// ПОЛУЧЕНИЕ КОММЕНТАРИЕВ
router.get('/articles/:id/comments', async (req, res) => {
    const articleId = req.params.id;

    try {
        const result = await db.query(
            `SELECT c.*, u.employee_id AS author_employee_id
             FROM comments c
             LEFT JOIN users u ON c.user_id = u.id
             WHERE c.article_id = $1
             ORDER BY c.created_at ASC`,
            [articleId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка получения комментариев' });
    }
});

// ДОБАВЛЕНИЕ КОММЕНТАРИЯ К СТАТЬЕ
router.post('/articles/:id/comments', authMiddleware, async (req, res) => {
    const articleId = req.params.id;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Текст комментария обязателен' });
    }

    try {
        const articleExists = await db.query('SELECT id FROM articles WHERE id = $1', [articleId]);
        if (articleExists.rows.length === 0) {
            return res.status(404).json({ error: 'Статья не найдена' });
        }

        const result = await db.query(
            `INSERT INTO comments (article_id, user_id, text, created_at)
             VALUES ($1, $2, $3, NOW())
             RETURNING id, article_id, user_id, text, created_at`,
            [articleId, userId, text]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка добавления комментария' });
    }
});

// УДАЛЕНИЕ КОММЕНТАРИЯ
router.delete('/comments/:id', authMiddleware, async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        const comment = await db.query('SELECT user_id FROM comments WHERE id = $1', [commentId]);

        if (comment.rows.length === 0) {
            return res.status(404).json({ error: 'Комментарий не найден' });
        }

        const isAuthor = comment.rows[0].user_id === userId;
        const isAdmin = userRole === 'admin';

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({ error: 'Недостаточно прав для удаления комментария' });
        }

        await db.query('DELETE FROM comments WHERE id = $1', [commentId]);
        res.json({ message: 'Комментарий удалён' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка удаления комментария' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Все статьи с возможностью фильтрации (пока можно без, просто список)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM articles ORDER BY updated_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Последние обновления (просто первые 10 статей, отсортированных по updated_at)
router.get('/recent', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM articles ORDER BY updated_at DESC LIMIT 10'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Одна статья по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Статья не найдена' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
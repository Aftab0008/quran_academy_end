const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comments ORDER BY id DESC');
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load comments' });
  }
});

router.post('/', async (req, res) => {
  const { name, comment } = req.body;
  try {
    await pool.query('INSERT INTO comments (name, comment) VALUES ($1, $2)', [name, comment]);
    res.status(201).json({ message: 'Comment added' });
  } catch {
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

module.exports = router;

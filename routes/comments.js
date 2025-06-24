const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all comments
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comments ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching comments:', err.message);
    res.status(500).json({ error: 'Failed to load comments' });
  }
});

// POST a new comment
router.post('/', async (req, res) => {
  const { name, comment } = req.body;

  if (!name || !comment) {
    return res.status(400).json({ error: 'Name and comment are required' });
  }

  try {
    await pool.query(
      'INSERT INTO comments (name, comment) VALUES ($1, $2)',
      [name, comment]
    );
    res.status(201).json({ message: '✅ Comment added' });
  } catch (err) {
    console.error('❌ Error posting comment:', err.message);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

module.exports = router;

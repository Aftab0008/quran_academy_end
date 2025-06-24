const express = require('express');
const router = express.Router();
const pool = require('../db');
const axios = require('axios');
require('dotenv').config();

// ✅ GET all booked classes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM classes ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching classes:', err.message);
    res.status(500).json({ error: 'Failed to fetch class bookings' });
  }
});

// ✅ POST new class booking + WhatsApp alert
router.post('/', async (req, res) => {
  const { name, category, date, contact } = req.body;

  if (!name || !category || !date || !contact) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await pool.query(
      'INSERT INTO classes (name, category, date, contact) VALUES ($1, $2, $3, $4)',
      [name, category, date, contact]
    );

    const messageBody = `📖 *New Class Booking* \n👤 Name: ${name}\n🧾 Course: ${category}\n📅 Date: ${date}\n📞 Contact: ${contact}`;

    // ✅ WhatsApp alert via Meta Graph API
    await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: process.env.ADMIN_WHATSAPP_NUMBER,
        type: 'text',
        text: { body: messageBody },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(201).json({ message: '✅ Class booked & WhatsApp sent' });
  } catch (err) {
    console.error('❌ Booking or WhatsApp error:', err.message);
    res.status(500).json({ error: 'Failed to book class' });
  }
});

// ✅ DELETE class by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid class ID' });
  }

  try {
    const result = await pool.query('DELETE FROM classes WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json({ message: '🗑 Class deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting class:', err.message);
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

module.exports = router;

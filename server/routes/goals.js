const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get all goals
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM goals WHERE user_id=$1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add goal
router.post('/', authMiddleware, async (req, res) => {
  const { title, target_amount, current_amount, deadline } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO goals (user_id, title, target_amount, current_amount, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, title, target_amount, current_amount || 0, deadline || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update goal
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, target_amount, current_amount, deadline } = req.body;
  try {
    const result = await pool.query(
      'UPDATE goals SET title=$1, target_amount=$2, current_amount=$3, deadline=$4 WHERE id=$5 AND user_id=$6 RETURNING *',
      [title, target_amount, current_amount, deadline || null, id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete goal
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM goals WHERE id=$1 AND user_id=$2', [id, req.user.id]);
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

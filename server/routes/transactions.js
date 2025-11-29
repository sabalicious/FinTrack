const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get all transactions for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT t.*, c.name AS category_name, c.type AS category_type FROM transactions t LEFT JOIN categories c ON t.category_id=c.id WHERE t.user_id=$1 ORDER BY t.created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add transaction
router.post('/', authMiddleware, async (req, res) => {
  const { amount, category_id, note } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO transactions (user_id, amount, category_id, note) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, amount, category_id || null, note || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update transaction
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { amount, category_id, note } = req.body;
  try {
    const result = await pool.query(
      'UPDATE transactions SET amount=$1, category_id=$2, note=$3 WHERE id=$4 AND user_id=$5 RETURNING *',
      [amount, category_id || null, note || null, id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM transactions WHERE id=$1 AND user_id=$2', [id, req.user.id]);
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

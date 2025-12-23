const express = require('express');
const router = express.Router();
const pool = require('../db');
const knex = require('../knex');
const authMiddleware = require('../middleware/authMiddleware');

// Get all debts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rows = await knex('debts').where({ user_id: req.user.id }).orderBy('created_at', 'desc');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create debt
router.post('/', authMiddleware, async (req, res) => {
  const { person_name, amount, type, description, due_date } = req.body;
  try {
    const inserted = await knex('debts')
      .insert({ user_id: req.user.id, person_name, amount, type, description, due_date })
      .returning('*');
    res.json(inserted[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update debt (mark as paid or edit)
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { person_name, amount, type, description, due_date, is_paid } = req.body;
  try {
    const updated = await knex('debts')
      .where({ id, user_id: req.user.id })
      .update({ person_name, amount, type, description, due_date, is_paid })
      .returning('*');
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete debt
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await knex('debts').where({ id, user_id: req.user.id }).del();
    res.json({ message: 'Debt deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

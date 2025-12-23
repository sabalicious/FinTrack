const express = require('express');
const router = express.Router();
const pool = require('../db');
const knex = require('../knex');
const authMiddleware = require('../middleware/authMiddleware');

// Get all goals for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rows = await knex('goals').where({ user_id: req.user.id }).orderBy('created_at', 'desc');

    const goals = rows.map(goal => ({
      ...goal,
      target_amount: parseFloat(goal.target_amount),
      current_amount: parseFloat(goal.current_amount),
      id: goal.id.toString(),
    }));

    res.json(goals);
  } catch (err) {
    console.error('❌ Error in GET /goals:', err.message);
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Add goal
router.post('/', authMiddleware, async (req, res) => {
  const { title, target_amount, current_amount, deadline } = req.body;
  try {
    const inserted = await knex('goals')
      .insert({ user_id: req.user.id, title, target_amount, current_amount: current_amount || 0, created_at: knex.fn.now() })
      .returning('*');

    const goal = inserted[0];
    res.json({
      ...goal,
      target_amount: parseFloat(goal.target_amount),
      current_amount: parseFloat(goal.current_amount),
      id: goal.id.toString(),
    });
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
    const updated = await knex('goals')
      .where({ id, user_id: req.user.id })
      .update({ title, target_amount, current_amount })
      .returning('*');

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Goal not found or access denied' });
    }

    const goal = updated[0];
    res.json({
      ...goal,
      target_amount: parseFloat(goal.target_amount),
      current_amount: parseFloat(goal.current_amount),
      id: goal.id.toString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete goal
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await knex('goals').where({ id, user_id: req.user.id }).del().returning('id');

    if (deleted.length === 0) {
      return res.status(404).json({ error: 'Goal not found or access denied' });
    }
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

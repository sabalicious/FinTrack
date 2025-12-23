const express = require('express');
const router = express.Router();
const pool = require('../db');
const knex = require('../knex');
const authMiddleware = require('../middleware/authMiddleware');

// Get all notes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rows = await knex('notes as n')
      .select('n.*', 'g.title as goal_title')
      .leftJoin('goals as g', 'n.related_goal_id', 'g.id')
      .where('n.user_id', req.user.id)
      .orderBy([{ column: 'n.is_completed', order: 'asc' }, { column: 'n.due_date', order: 'asc' }, { column: 'n.created_at', order: 'desc' }]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create note
router.post('/', authMiddleware, async (req, res) => {
  const { title, content, type, priority, related_goal_id, due_date } = req.body;
  try {
    const inserted = await knex('notes')
      .insert({ user_id: req.user.id, title, content, type, priority, related_goal_id, due_date })
      .returning('*');
    res.json(inserted[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update note
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, content, type, priority, related_goal_id, due_date, is_completed } = req.body;
  try {
    const updated = await knex('notes')
      .where({ id, user_id: req.user.id })
      .update({ title, content, type, priority, related_goal_id, due_date, is_completed })
      .returning('*');
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete note
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await knex('notes').where({ id, user_id: req.user.id }).del();
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

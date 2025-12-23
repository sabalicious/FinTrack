const express = require('express');
const router = express.Router();
const pool = require('../db');
const knex = require('../knex');
const authMiddleware = require('../middleware/authMiddleware');

// Get all templates
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rows = await knex('transaction_templates as t')
      .select('t.*', 'c.name as category_name')
      .leftJoin('categories as c', 't.category_id', 'c.id')
      .where('t.user_id', req.user.id)
      .andWhere('t.is_active', true)
      .orderBy([{ column: 't.usage_count', order: 'desc' }, { column: 't.created_at', order: 'desc' }]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create template
router.post('/', authMiddleware, async (req, res) => {
  const { name, amount, type, category_id } = req.body;
  try {
    const inserted = await knex('transaction_templates')
      .insert({ user_id: req.user.id, name, amount, type, category_id })
      .returning('*');
    res.json(inserted[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Increment usage count
router.post('/:id/use', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await knex('transaction_templates')
      .where({ id, user_id: req.user.id })
      .increment('usage_count', 1)
      .returning('*');
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete template
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await knex('transaction_templates').where({ id, user_id: req.user.id }).del();
    res.json({ message: 'Template deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

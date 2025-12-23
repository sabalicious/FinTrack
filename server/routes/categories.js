const express = require('express');
const router = express.Router();
const pool = require('../db');
const knex = require('../knex');
const authMiddleware = require('../middleware/authMiddleware');

// Get categories
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rows = await knex('categories').select('*').orderBy('name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add category
router.post('/', authMiddleware, async (req, res) => {
  const { name, type } = req.body;
  try {
    const inserted = await knex('categories')
      .insert({ name, type })
      .returning('*');
    res.json(inserted[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update category
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;
  try {
    const updated = await knex('categories')
      .where({ id })
      .update({ name, type })
      .returning('*');
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete category
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await knex('categories').where({ id }).del();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

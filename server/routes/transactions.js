const express = require('express');
const router = express.Router();
const pool = require('../db');
const knex = require('../knex');
const authMiddleware = require('../middleware/authMiddleware');

// Get all transactions for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rows = await knex('transactions as t')
      .select('t.*', 'c.name as category_name')
      .leftJoin('categories as c', 't.category_id', 'c.id')
      .where('t.user_id', req.user.id)
      .orderBy('t.date_created', 'desc');

    const transactions = rows.map(tx => ({
      ...tx,
      amount: parseFloat(tx.amount),
      id: tx.id.toString(),
    }));

    res.json(transactions);
  } catch (err) {
    console.error('❌ Error in GET /transactions:', err.message);
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Add transaction
router.post('/', authMiddleware, async (req, res) => {
  const { title, amount, type, date, category_id, account_id, currency_id } = req.body;
  
  try {
    const inserted = await knex('transactions')
      .insert({
        user_id: req.user.id,
        title,
        amount,
        type,
        date_created: knex.fn.now(),
        category_id: category_id || null,
        account_id: account_id || null,
        currency_id: currency_id || null,
      })
      .returning('*');

    const tx = inserted[0];
    res.json({
      ...tx,
      amount: parseFloat(tx.amount),
      id: tx.id.toString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update transaction
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, amount, type, date, category_id, account_id, currency_id } = req.body;
  
  try {
    const updated = await knex('transactions')
      .where({ id, user_id: req.user.id })
      .update({
        title,
        amount,
        type,
        category_id: category_id || null,
        account_id: account_id || null,
        currency_id: currency_id || null,
      })
      .returning('*');

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Transaction not found or access denied' });
    }

    const tx = updated[0];
    res.json({
      ...tx,
      amount: parseFloat(tx.amount),
      id: tx.id.toString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await knex('transactions')
      .where({ id, user_id: req.user.id })
      .del()
      .returning('id');

    if (deleted.length === 0) {
      return res.status(404).json({ error: 'Transaction not found or access denied' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

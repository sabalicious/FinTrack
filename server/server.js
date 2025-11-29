require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());


// ==================== Auth Middleware ====================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// ==================== Transactions Routes ====================
app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY date_created DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { title, amount, type, date } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO transactions (title, amount, type, date_created) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, amount, type, date || new Date()]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Получить все цели
app.get('/api/goals', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM goals ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Добавить цель
app.post('/api/goals', async (req, res) => {
  const { title, target_amount } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO goals (title, target_amount, current_amount, created_at) VALUES ($1, $2, 0, NOW()) RETURNING *',
      [title, target_amount]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Обновить цель
app.put('/api/goals/:id', async (req, res) => {
  const { id } = req.params;
  const { title, target_amount, current_amount } = req.body;
  try {
    const result = await pool.query(
      'UPDATE goals SET title=$1, target_amount=$2, current_amount=$3 WHERE id=$4 RETURNING *',
      [title, target_amount, current_amount, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Удалить цель
app.delete('/api/goals/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM goals WHERE id=$1', [id]);
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

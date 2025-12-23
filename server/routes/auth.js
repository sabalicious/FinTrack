const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const knex = require('../knex');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

// Validation middleware
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Update profile (username/email)
const validateProfile = [
  body('username')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  return null;
};

// Register
router.post('/register', validateRegister, async (req, res) => {
  // Check for validation errors
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  const { email, password, username } = req.body;
  try {
    const check = await knex('users').where(function () {
      this.where('email', email).orWhere('username', username);
    });
    if (check.length > 0) return res.status(400).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const inserted = await knex('users')
      .insert({ email, password_hash: hash, username })
      .returning(['id', 'email', 'username']);

    const userId = inserted[0].id;

    // Create default categories for new user
    const defaultCategories = [
      { name: 'Продукты', type: 'expense' },
      { name: 'Транспорт', type: 'expense' },
      { name: 'Развлечения', type: 'expense' },
      { name: 'Здоровье', type: 'expense' },
      { name: 'Образование', type: 'expense' },
      { name: 'Коммунальные услуги', type: 'expense' },
      { name: 'Одежда', type: 'expense' },
      { name: 'Зарплата', type: 'income' },
      { name: 'Подработка', type: 'income' },
      { name: 'Инвестиции', type: 'income' }
    ];

    for (const cat of defaultCategories) {
      await knex('categories').insert({ name: cat.name, type: cat.type });
    }

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: inserted[0], token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  // Check for validation errors
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  const { email, password } = req.body;
  try {
    const user = await knex('users').where({ email }).first();
    if (!user) return res.status(400).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Wrong password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, email: user.email, username: user.username }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update current user profile
router.put('/me', authMiddleware, validateProfile, async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  const { username, email } = req.body;

  try {
    // Ensure username/email unique if provided
    if (username) {
      const checkUsername = await knex('users').where('username', username).andWhereNot('id', req.user.id);
      if (checkUsername.length > 0) return res.status(400).json({ error: 'Username already taken' });
    }

    if (email) {
      const checkEmail = await knex('users').where('email', email).andWhereNot('id', req.user.id);
      if (checkEmail.length > 0) return res.status(400).json({ error: 'Email already in use' });
    }

    const updateObj = {};
    if (username) updateObj.username = username;
    if (email) updateObj.email = email;

    if (Object.keys(updateObj).length === 0) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    const updated = await knex('users')
      .where({ id: req.user.id })
      .update(updateObj)
      .returning(['id', 'email', 'username']);

    res.json({ user: updated[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

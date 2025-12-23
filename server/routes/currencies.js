const express = require('express');
const router = express.Router();
const pool = require('../db');
const knex = require('../knex');
const authMiddleware = require('../middleware/authMiddleware');

// Get all currencies
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rows = await knex('currencies').where({ is_active: true }).orderBy('code');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single currency
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const row = await knex('currencies').where({ id: req.params.id }).first();
    if (!row) return res.status(404).json({ error: 'Currency not found' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update currency rates from external API
router.post('/update-rates', authMiddleware, async (req, res) => {
  try {
    console.log('📊 Fetching currency rates from external API...');
    
    // Fetch rates from external API (using RUB as base)
    const response = await fetch('https://open.er-api.com/v6/latest/RUB');
    
    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }
    
    const data = await response.json();
    const rates = data.rates;

    if (!rates || Object.keys(rates).length === 0) {
      throw new Error('No rates returned from API');
    }

    // Get all active currencies from DB
    const currencies = await knex('currencies').select('id', 'code').where({ is_active: true });

    // Update each currency's exchange rate
    let updatedCount = 0;
    for (const currency of currencies) {
      const rate = rates[currency.code];
      
      if (rate && rate > 0) {
        await knex('currencies').where({ id: currency.id }).update({ exchange_rate: 1 / rate });
        updatedCount++;
        console.log(`✅ Updated ${currency.code}: ${(1 / rate).toFixed(4)} RUB`);
      }
    }

    res.json({
      success: true,
      message: `Updated ${updatedCount} currencies`,
      updatedCount,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ Error updating rates:', err.message);
    res.status(500).json({ error: 'Failed to update rates: ' + err.message });
  }
});

module.exports = router;

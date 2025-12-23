// Disable console logs
require('./disableConsole');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pool = require('./db');

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is not set');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Standard middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Rate limiting for auth endpoints (max 5 requests per 15 minutes per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests
  message: 'Too many login/register attempts, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// ==================== Routes ====================
// Импортируем роуты из отдельных файлов
const authRouter = require('./routes/auth');
const transactionsRouter = require('./routes/transactions');
const goalsRouter = require('./routes/goals');
const categoriesRouter = require('./routes/categories');
const currenciesRouter = require('./routes/currencies');
const statsRouter = require('./routes/stats');
const debtsRouter = require('./routes/debts');
const templatesRouter = require('./routes/templates');
const notesRouter = require('./routes/notes');

// Подключаем роуты
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/currencies', currenciesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/debts', debtsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/notes', notesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Auto-update currency rates on server start and every 24 hours
const updateCurrencyRates = async () => {
  try {
    console.log('🔄 Updating currency rates from external API...');
    const response = await fetch('https://open.er-api.com/v6/latest/RUB');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const rates = data.rates;

    if (!rates || Object.keys(rates).length === 0) {
      throw new Error('No rates returned');
    }

    // Get all active currencies from DB
    const currenciesResult = await pool.query('SELECT id, code FROM currencies WHERE is_active = true');
    const currencies = currenciesResult.rows;

    // Update each currency's exchange rate
    let updatedCount = 0;
    for (const currency of currencies) {
      const rate = rates[currency.code];
      if (rate && rate > 0) {
        await pool.query(
          'UPDATE currencies SET exchange_rate = $1 WHERE id = $2',
          [1 / rate, currency.id]
        );
        updatedCount++;
      }
    }
    
    console.log(`✅ Updated ${updatedCount} currency rates`);
  } catch (err) {
    console.error('❌ Failed to update currency rates:', err.message);
  }
};

// Update rates on startup
updateCurrencyRates();

// Update rates every 24 hours (86400000 ms)
setInterval(updateCurrencyRates, 24 * 60 * 60 * 1000);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

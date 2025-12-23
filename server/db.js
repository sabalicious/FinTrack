require('dotenv').config();
const { Pool } = require('pg');

// Use DATABASE_URL if available, otherwise construct connection string from individual env vars
const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'fintrack',
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
    });

module.exports = pool;

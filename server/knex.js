require('dotenv').config();
const env = process.env;

const knex = require('knex')({
  client: 'pg',
  connection: env.DATABASE_URL || {
    host: env.DB_HOST || 'localhost',
    user: env.DB_USER || 'postgres',
    password: env.DB_PASSWORD,
    database: env.DB_NAME || 'fintrack',
    port: env.DB_PORT || 5432,
  },
  pool: { min: 0, max: 10 },
});

module.exports = knex;

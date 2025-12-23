#!/usr/bin/env node

require('dotenv').config();
const pool = require('./db');

pool.query(`
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name='transactions' 
  ORDER BY ordinal_position
`).then(r => {
  console.log('Transactions table columns:');
  console.log(JSON.stringify(r.rows, null, 2));
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});

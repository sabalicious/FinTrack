#!/usr/bin/env node

/**
 * Debug script - directly query transactions and show raw response
 */

require('dotenv').config();
const pool = require('./db');

async function debug() {
  try {
    const userId = '1ecfb8b0-58b2-4f4c-91f7-cf86b816d64f';
    
    console.log('📊 Raw query result from database:\n');
    
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id=$1 ORDER BY date_created DESC',
      [userId]
    );
    
    console.log('Number of rows:', result.rows.length);
    console.log('\nFull result object:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n\nFormatted rows:');
    result.rows.forEach((row, idx) => {
      console.log(`\n[${idx}]`);
      Object.keys(row).forEach(key => {
        console.log(`  ${key}: ${JSON.stringify(row[key])} (${typeof row[key]})`);
      });
    });
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

debug();

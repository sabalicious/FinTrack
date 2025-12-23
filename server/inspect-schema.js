#!/usr/bin/env node

/**
 * Inspect current database schema
 */

require('dotenv').config();
const pool = require('./db');

async function inspectSchema() {
  try {
    console.log('📊 Database Schema Inspection\n');

    // Get all tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('Tables:', tables.rows.map(t => t.table_name).join(', '), '\n');

    // For each table, get columns
    for (const table of tables.rows) {
      const tableName = table.table_name;
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);

      console.log(`\n🔹 ${tableName.toUpperCase()}`);
      console.log('─'.repeat(60));
      columns.rows.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`  ${col.column_name.padEnd(20)} ${col.data_type.padEnd(15)} ${nullable}${defaultVal}`);
      });

      // Get constraints
      const constraints = await pool.query(`
        SELECT constraint_type, constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = $1
      `, [tableName]);

      if (constraints.rows.length > 0) {
        console.log('\n  Constraints:');
        constraints.rows.forEach(c => {
          console.log(`    - ${c.constraint_type}: ${c.constraint_name}`);
        });
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

inspectSchema();

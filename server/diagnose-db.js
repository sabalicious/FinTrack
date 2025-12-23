#!/usr/bin/env node

/**
 * Database diagnostic script
 * Checks if transactions table exists and has data
 */

require('dotenv').config();
const pool = require('./db');

async function diagnose() {
  console.log('🔍 Diagnosing database...\n');

  try {
    // Check 1: Database connection
    console.log('1️⃣ Testing database connection:');
    const connTest = await pool.query('SELECT NOW()');
    console.log(`   ✅ Connected to database\n`);

    // Check 2: Check if users table exists
    console.log('2️⃣ Checking users table:');
    const usersCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'users'
      )
    `);
    console.log(`   ✅ Users table exists: ${usersCheck.rows[0].exists}\n`);

    // Check 3: Check if transactions table exists
    console.log('3️⃣ Checking transactions table:');
    const transactionsCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'transactions'
      )
    `);
    console.log(`   ✅ Transactions table exists: ${transactionsCheck.rows[0].exists}\n`);

    if (!transactionsCheck.rows[0].exists) {
      console.log('   ❌ Transactions table does not exist!');
      process.exit(1);
    }

    // Check 4: Check transactions table structure
    console.log('4️⃣ Checking transactions table structure:');
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'transactions'
      ORDER BY ordinal_position
    `);
    console.log('   Columns:');
    structure.rows.forEach(col => {
      console.log(`     - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
    });
    console.log();

    // Check 5: Check if user_id column exists
    console.log('5️⃣ Checking if user_id column exists:');
    const userIdCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'transactions' AND column_name = 'user_id'
      )
    `);
    console.log(`   ✅ user_id column exists: ${userIdCheck.rows[0].exists}\n`);

    // Check 6: Count users
    console.log('6️⃣ Counting users:');
    const usersCount = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`   Users in database: ${usersCount.rows[0].count}\n`);

    // Check 7: Count transactions
    console.log('7️⃣ Counting transactions:');
    const transCount = await pool.query('SELECT COUNT(*) as count FROM transactions');
    console.log(`   Transactions in database: ${transCount.rows[0].count}\n`);

    // Check 8: List first 5 transactions (with all columns)
    console.log('8️⃣ First 5 transactions:');
    const transactions = await pool.query('SELECT * FROM transactions LIMIT 5');
    if (transactions.rows.length === 0) {
      console.log('   (No transactions yet)\n');
    } else {
      console.log(JSON.stringify(transactions.rows, null, 2));
      console.log();
    }

    // Check 9: List users
    console.log('9️⃣ All users:');
    const users = await pool.query('SELECT id, email FROM users');
    if (users.rows.length === 0) {
      console.log('   (No users yet)\n');
    } else {
      users.rows.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id})`);
      });
      console.log();
    }

    // Check 10: Try a filtered query (with first user)
    if (users.rows.length > 0) {
      console.log('🔟 Test query with first user:');
      const firstUserId = users.rows[0].id;
      const userTransactions = await pool.query(
        'SELECT * FROM transactions WHERE user_id = $1',
        [firstUserId]
      );
      console.log(`   Transactions for user ${firstUserId}: ${userTransactions.rows.length}\n`);
    }

    console.log('✅ Diagnosis complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during diagnosis:');
    console.error(err.message);
    process.exit(1);
  }
}

diagnose();

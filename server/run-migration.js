#!/usr/bin/env node

/**
 * Migration runner script
 * Run migrations against the database
 * Usage: node run-migration.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  
  // Check if migrations directory exists
  if (!fs.existsSync(migrationsDir)) {
    console.log('❌ Migrations directory does not exist');
    process.exit(1);
  }
  
  // Read all .sql files from migrations directory
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  if (migrationFiles.length === 0) {
    console.log('✅ No migrations to run');
    process.exit(0);
  }
  
  console.log(`Found ${migrationFiles.length} migration(s)\n`);
  
  try {
    for (const migrationFile of migrationFiles) {
      const filePath = path.join(migrationsDir, migrationFile);
      const migrationSQL = fs.readFileSync(filePath, 'utf8');
      
      console.log(`⏳ Running: ${migrationFile}`);
      
      try {
        await pool.query(migrationSQL);
        console.log(`✅ Completed: ${migrationFile}\n`);
      } catch (err) {
        console.error(`❌ Failed: ${migrationFile}`);
        console.error(`Error: ${err.message}\n`);
        throw err;
      }
    }
    
    console.log('✅ All migrations completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Migration failed:');
    console.error(err);
    process.exit(1);
  }
}

runMigrations();

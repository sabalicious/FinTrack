#!/usr/bin/env node

/**
 * Test full transaction endpoint with type conversions
 */

const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function makeAuthenticatedRequest(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/transactions',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data,
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function test() {
  console.log('🧪 Testing /api/transactions with type conversions\n');

  try {
    const userId = '1ecfb8b0-58b2-4f4c-91f7-cf86b816d64f';
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    console.log(`📡 Making request to /api/transactions...\n`);
    const res = await makeAuthenticatedRequest(token);
    
    console.log(`Status: ${res.status}\n`);

    if (res.status === 200) {
      const data = JSON.parse(res.body);
      
      console.log(`✅ Got ${data.length} transactions\n`);
      console.log(`First 3 transactions:\n`);
      
      data.slice(0, 3).forEach((tx, idx) => {
        console.log(`[${idx}]`);
        console.log(`  id: ${tx.id} (type: ${typeof tx.id})`);
        console.log(`  title: ${tx.title}`);
        console.log(`  amount: ${tx.amount} (type: ${typeof tx.amount})`);
        console.log(`  type: ${tx.type}`);
        console.log(`  date_created: ${tx.date_created}`);
        console.log();
      });

      // Check types
      const firstTx = data[0];
      const allGood = 
        typeof firstTx.id === 'string' &&
        typeof firstTx.amount === 'number' &&
        typeof firstTx.title === 'string' &&
        typeof firstTx.type === 'string';

      if (allGood) {
        console.log('✅ All types are correct!');
      } else {
        console.log('❌ Type mismatch detected:');
        console.log(`  id is ${typeof firstTx.id}, expected string`);
        console.log(`  amount is ${typeof firstTx.amount}, expected number`);
      }
    } else {
      console.log(`❌ Error: ${res.body}`);
    }

  } catch (err) {
    console.error('❌ Test error:', err.message);
    process.exit(1);
  }
}

test();

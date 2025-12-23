#!/usr/bin/env node

/**
 * Test adding a transaction
 */

const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function makeAuthenticatedRequest(method, path, token, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
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
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  console.log('🧪 Testing add transaction\n');

  try {
    const userId = '1ecfb8b0-58b2-4f4c-91f7-cf86b816d64f';
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Test 1: Add transaction
    console.log('1️⃣ Adding new transaction...\n');
    const newTx = {
      title: 'Test Transaction',
      amount: 99.99,
      type: 'income'
    };

    let res = await makeAuthenticatedRequest('POST', '/api/transactions', token, newTx);
    console.log(`Status: ${res.status}`);
    
    if (res.status === 200) {
      const data = JSON.parse(res.body);
      console.log(`✅ Successfully added transaction!`);
      console.log(`\nResponse:`);
      console.log(JSON.stringify(data, null, 2));
      
      // Verify types
      console.log(`\nType verification:`);
      console.log(`  id: ${typeof data.id} (value: ${data.id})`);
      console.log(`  amount: ${typeof data.amount} (value: ${data.amount})`);
      console.log(`  title: ${typeof data.title} (value: ${data.title})`);
    } else {
      console.log(`❌ Error: ${res.body}`);
    }

    // Test 2: Fetch all transactions
    console.log(`\n\n2️⃣ Fetching all transactions...\n`);
    res = await makeAuthenticatedRequest('GET', '/api/transactions', token);
    console.log(`Status: ${res.status}`);
    
    if (res.status === 200) {
      const data = JSON.parse(res.body);
      console.log(`✅ Got ${data.length} transactions`);
      console.log(`\nFirst transaction:`);
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log(`❌ Error: ${res.body}`);
    }

  } catch (err) {
    console.error('❌ Test error:', err.message);
    process.exit(1);
  }
}

test();

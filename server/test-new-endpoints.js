#!/usr/bin/env node

/**
 * Test all new API endpoints
 */

const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function makeRequest(method, path, token, body = null) {
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
  console.log('🧪 Testing new API endpoints\n');

  try {
    const userId = '1ecfb8b0-58b2-4f4c-91f7-cf86b816d64f';
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Test 1: Get currencies
    console.log('1️⃣ GET /api/currencies');
    let res = await makeRequest('GET', '/api/currencies', token);
    console.log(`   Status: ${res.status}`);
    let currencies = [];
    let usdCurrency = null;
    
    if (res.status === 200) {
      currencies = JSON.parse(res.body);
      usdCurrency = currencies.find(c => c.code === 'USD');
      console.log(`   ✅ Got ${currencies.length} currencies\n`);
    } else {
      console.log(`   ❌ Error: ${res.body}\n`);
      return;
    }

    if (!usdCurrency) {
      console.log(`   ❌ No USD currency found\n`);
      return;
    }

    // Test 2: Create account
    console.log('2️⃣ POST /api/accounts (Create account)');
    
    const createAccountBody = {
      name: 'Test Account',
      type: 'debit',
      currency_id: usdCurrency.id,
      initial_balance: 1000
    };

    res = await makeRequest('POST', '/api/accounts', token, createAccountBody);
    console.log(`   Status: ${res.status}`);
    if (res.status === 201) {
      const account = JSON.parse(res.body);
      console.log(`   ✅ Account created: ${account.name}\n`);
      
      // Test 3: Get all accounts
      console.log('3️⃣ GET /api/accounts');
      res = await makeRequest('GET', '/api/accounts', token);
      console.log(`   Status: ${res.status}`);
      if (res.status === 200) {
        const accounts = JSON.parse(res.body);
        console.log(`   ✅ Got ${accounts.length} accounts\n`);
      }

      // Test 4: Get dashboard stats
      console.log('4️⃣ GET /api/stats');
      res = await makeRequest('GET', '/api/stats', token);
      console.log(`   Status: ${res.status}`);
      if (res.status === 200) {
        const stats = JSON.parse(res.body);
        console.log(`   ✅ Dashboard stats:`);
        console.log(`      Total Balance: ${stats.summary.totalBalance}`);
        console.log(`      Income: ${stats.summary.totalIncome}`);
        console.log(`      Expense: ${stats.summary.totalExpense}`);
        console.log(`      Recent Transactions: ${stats.recentTransactions.length}\n`);
      }
    } else {
      console.log(`   ❌ Error: ${res.body}\n`);
    }

    console.log('✅ All tests completed!');
  } catch (err) {
    console.error('❌ Test error:', err.message);
    process.exit(1);
  }
}

test();

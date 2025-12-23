#!/usr/bin/env node

/**
 * Quick test script for API endpoints
 */

const http = require('http');

function makeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
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
          headers: res.headers
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing API endpoints...\n');

  // Test 1: Health check
  console.log('1️⃣ Testing health endpoint:');
  let res = await makeRequest('GET', '/health', null);
  console.log(`   Status: ${res.status}`);
  console.log(`   Response: ${res.body}\n`);

  // Test 2: Register with weak password (should fail validation)
  console.log('2️⃣ Testing register with weak password (should fail):');
  res = await makeRequest('POST', '/api/auth/register', {
    email: 'test@example.com',
    password: 'weak'
  });
  console.log(`   Status: ${res.status}`);
  console.log(`   Response: ${res.body}\n`);

  // Test 3: Register with invalid email (should fail validation)
  console.log('3️⃣ Testing register with invalid email (should fail):');
  res = await makeRequest('POST', '/api/auth/register', {
    email: 'notanemail',
    password: 'ValidPass123'
  });
  console.log(`   Status: ${res.status}`);
  console.log(`   Response: ${res.body}\n`);

  // Test 4: Register with valid credentials (should succeed)
  console.log('4️⃣ Testing register with valid credentials (should succeed):');
  res = await makeRequest('POST', '/api/auth/register', {
    email: 'validuser@example.com',
    password: 'ValidPass123'
  });
  console.log(`   Status: ${res.status}`);
  const registerResponse = JSON.parse(res.body);
  console.log(`   Response: ${res.body}\n`);

  if (registerResponse.token) {
    const userToken = registerResponse.token;

    // Test 5: Try to get transactions without auth (should fail)
    console.log('5️⃣ Testing get transactions without auth (should fail):');
    res = await makeRequest('GET', '/api/transactions', null);
    console.log(`   Status: ${res.status}`);
    console.log(`   Response: ${res.body}\n`);

    // Test 6: Get transactions with valid auth
    console.log('6️⃣ Testing get transactions with valid auth (should succeed):');
    const authOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/transactions',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      }
    };

    res = await new Promise((resolve, reject) => {
      const req = http.request(authOptions, (res) => {
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
    console.log(`   Status: ${res.status}`);
    console.log(`   Response: ${res.body}\n`);
  }

  console.log('✅ Tests completed!');
}

runTests().catch(err => {
  console.error('❌ Test error:', err.message);
  process.exit(1);
});

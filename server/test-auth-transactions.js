#!/usr/bin/env node

/**
 * Test authenticated GET request to transactions endpoint
 * Simulates what frontend does
 */

const http = require('http');

// We'll use the first user from database
const firstUserId = '1ecfb8b0-58b2-4f4c-91f7-cf86b816d64f';

// For this test, we need a valid JWT token
// Let's create one using jsonwebtoken
const jwt = require('jsonwebtoken');
require('dotenv').config();

function createTestToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

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
  console.log('🧪 Testing authenticated GET /api/transactions\n');

  try {
    // Create a valid JWT token
    console.log(`1️⃣ Creating JWT token for user ${firstUserId}`);
    const token = createTestToken(firstUserId);
    console.log(`   Token: ${token.substring(0, 30)}...\n`);

    // Make the request
    console.log(`2️⃣ Making GET request to /api/transactions with token`);
    const res = await makeAuthenticatedRequest(token);
    console.log(`   Status: ${res.status}`);
    console.log(`   Response:\n${res.body}\n`);

    if (res.status === 200) {
      try {
        const data = JSON.parse(res.body);
        console.log(`✅ Success! Got ${data.length} transactions`);
      } catch (e) {
        console.log(`⚠️ Response is not JSON`);
      }
    } else {
      console.log(`❌ Error status: ${res.status}`);
    }

  } catch (err) {
    console.error('❌ Test error:', err.message);
    process.exit(1);
  }
}

test();

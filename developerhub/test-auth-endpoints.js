// TauCore™ Developer Hub - Authentication Endpoints Test
// This script tests all authentication endpoints

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

// Test data
const testUser = {
  email: 'test@tauos.org',
  username: 'testuser',
  fullName: 'Test User',
  password: 'testpassword123'
};

const testLogin = {
  email: 'test@tauos.org',
  password: 'testpassword123'
};

async function testEndpoint(method, endpoint, data = null, headers = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    console.log(`${method} ${endpoint}: ${response.status}`);
    console.log('Response:', JSON.stringify(result, null, 2));
    console.log('---');
    
    return { response, result };
  } catch (error) {
    console.error(`❌ Error testing ${method} ${endpoint}:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Testing TauCore™ Authentication Endpoints...\n');
  
  // Test 1: Register a new user
  console.log('1. Testing user registration...');
  const registerResult = await testEndpoint('POST', '/api/auth/register', testUser);
  
  if (registerResult && registerResult.result.success) {
    console.log('✅ Registration successful');
  } else {
    console.log('❌ Registration failed');
  }
  
  // Test 2: Login with the new user
  console.log('2. Testing user login...');
  const loginResult = await testEndpoint('POST', '/api/auth/login', testLogin);
  
  let accessToken = null;
  if (loginResult && loginResult.result.success) {
    console.log('✅ Login successful');
    accessToken = loginResult.result.tokens.accessToken;
  } else {
    console.log('❌ Login failed');
  }
  
  // Test 3: Get current user info
  if (accessToken) {
    console.log('3. Testing get current user...');
    const meResult = await testEndpoint('GET', '/api/auth/me', null, {
      'Authorization': `Bearer ${accessToken}`
    });
    
    if (meResult && meResult.result.success) {
      console.log('✅ Get user info successful');
    } else {
      console.log('❌ Get user info failed');
    }
  }
  
  // Test 4: Test refresh token
  if (accessToken) {
    console.log('4. Testing token refresh...');
    const refreshResult = await testEndpoint('POST', '/api/auth/refresh', {
      refreshToken: loginResult.result.tokens.refreshToken
    });
    
    if (refreshResult && refreshResult.result.success) {
      console.log('✅ Token refresh successful');
    } else {
      console.log('❌ Token refresh failed');
    }
  }
  
  // Test 5: Logout
  if (accessToken) {
    console.log('5. Testing logout...');
    const logoutResult = await testEndpoint('POST', '/api/auth/logout', null, {
      'Authorization': `Bearer ${accessToken}`
    });
    
    if (logoutResult && logoutResult.result.success) {
      console.log('✅ Logout successful');
    } else {
      console.log('❌ Logout failed');
    }
  }
  
  console.log('\n🎉 Authentication tests complete!');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`);
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking if development server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Development server is not running!');
    console.log('Please start the server with: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ Development server is running');
  await runTests();
}

main().catch(console.error);

// Script to fix TauMail login issue
// This will test the database connection and create the user if needed

const https = require('https');

const BASE_URL = 'https://tauos.vercel.app';

async function testDatabase() {
  console.log('🔍 Testing database connection...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/test-db`);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Database connection successful');
      console.log('📊 Current time:', result.currentTime);
      console.log('🔑 Database URL:', result.databaseUrl);
    } else {
      console.log('❌ Database connection failed');
      console.log('📝 Error:', result.error);
      console.log('📝 Details:', result.details);
    }
  } catch (error) {
    console.log('❌ Failed to test database:', error.message);
  }
}

async function testUser() {
  console.log('\n👤 Testing if user exists...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/test-user`);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ User found:', result.user.email);
      console.log('📊 User details:', result.user);
    } else {
      console.log('❌ User not found:', result.message);
      console.log('🔧 Need to create user...');
      
      // Create the user
      await createUser();
    }
  } catch (error) {
    console.log('❌ Failed to test user:', error.message);
  }
}

async function createUser() {
  console.log('\n👤 Creating user saleena@tauos.org...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'saleena@tauos.org',
        password: 'Saleena@132',
        username: 'saleena',
        fullName: 'Saleena User'
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ User created successfully');
      console.log('📊 User details:', result.user);
    } else {
      console.log('❌ Failed to create user');
      console.log('📝 Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Failed to create user:', error.message);
  }
}

async function testLogin() {
  console.log('\n🔐 Testing login...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/taumail/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'saleena@tauos.org',
        password: 'Saleena@132'
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful');
      console.log('🎫 Token received:', result.token ? 'Yes' : 'No');
      console.log('👤 User:', result.user);
    } else {
      console.log('❌ Login failed');
      console.log('📝 Error:', result.error);
      console.log('📊 Status:', response.status);
    }
  } catch (error) {
    console.log('❌ Failed to test login:', error.message);
  }
}

async function main() {
  console.log('🚀 TauMail Login Fix Script');
  console.log('============================');
  
  await testDatabase();
  await testUser();
  await testLogin();
  
  console.log('\n✅ Script completed!');
  console.log('🔗 Test TauMail login at: https://tauos.vercel.app/taumail');
}

main().catch(console.error);

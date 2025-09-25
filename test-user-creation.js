// Test script to check and create user saleena@tauos.org
const bcrypt = require('bcryptjs');

async function testUserCreation() {
  const baseUrl = 'https://tauos.vercel.app'; // Replace with your actual Vercel URL
  
  console.log('🔍 Testing TauOS User Creation...');
  
  // Test 1: Check if user exists by trying to login
  console.log('\n1. Testing login for saleena@tauos.org...');
  try {
    const loginResponse = await fetch(`${baseUrl}/api/tauid/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'saleena@tauos.org',
        password: 'Saleena@132'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ User saleena@tauos.org exists and login successful!');
      console.log('Response:', loginData);
    } else {
      console.log('❌ Login failed:', loginData.message);
      
      // Test 2: Create user if login failed
      console.log('\n2. Creating user saleena@tauos.org...');
      try {
        const registerResponse = await fetch(`${baseUrl}/api/tauid/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'saleena@tauos.org',
            password: 'Saleena@132',
            username: 'saleena',
            fullName: 'Saleena TauOS'
          })
        });
        
        const registerData = await registerResponse.json();
        
        if (registerResponse.ok) {
          console.log('✅ User created successfully!');
          console.log('Response:', registerData);
        } else {
          console.log('❌ User creation failed:', registerData.message);
        }
      } catch (error) {
        console.error('❌ Error creating user:', error.message);
      }
    }
  } catch (error) {
    console.error('❌ Error testing login:', error.message);
  }
}

testUserCreation();

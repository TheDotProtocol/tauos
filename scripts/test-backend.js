// Test script for TauMail backend
process.env.JWT_SECRET = "tauos-super-secret-key-for-local-development";
process.env.DATABASE_URL = "postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres";

const app = require('./api/index.js');

// Test registration
async function testRegistration() {
    console.log('Testing registration...');
    const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'testuser2',
            email: 'test2@tauos.org',
            password: 'Test@123',
            fullName: 'Test User 2'
        })
    });
    const result = await response.json();
    console.log('Registration result:', result);
}

// Test login
async function testLogin() {
    console.log('Testing login...');
    const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'test2@tauos.org',
            password: 'Test@123'
        })
    });
    const result = await response.json();
    console.log('Login result:', result);
    return result.token;
}

// Test sent emails
async function testSentEmails(token) {
    console.log('Testing sent emails...');
    const response = await fetch('http://localhost:3001/api/emails/sent', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    console.log('Sent emails result:', result);
}

// Run tests
async function runTests() {
    try {
        await testRegistration();
        const token = await testLogin();
        if (token) {
            await testSentEmails(token);
        }
    } catch (error) {
        console.error('Test error:', error);
    }
}

runTests();

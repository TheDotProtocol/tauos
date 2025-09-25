const nodemailer = require("nodemailer");
const net = require('net');

console.log("🔍 Testing SMTP After GCP VM Restart");
console.log("====================================\n");

// Test network connectivity first
async function testConnectivity() {
  const host = 'mailserver.tauos.org';
  const ports = [25, 587, 465];
  
  console.log(`Testing network connectivity to ${host}...\n`);
  
  for (const port of ports) {
    try {
      await new Promise((resolve, reject) => {
        const socket = net.createConnection(port, host);
        
        const timeout = setTimeout(() => {
          socket.destroy();
          reject(new Error('Connection timeout'));
        }, 5000);
        
        socket.on('connect', () => {
          clearTimeout(timeout);
          socket.destroy();
          resolve();
        });
        
        socket.on('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
      
      console.log(`✅ Port ${port} - Connection successful`);
    } catch (error) {
      console.log(`❌ Port ${port} - ${error.message}`);
    }
  }
}

// Test SMTP authentication
async function testSMTP() {
  console.log("\n🔐 Testing SMTP Authentication...\n");
  
  const configs = [
    { name: "Port 587 (Submission)", port: 587, secure: false, requireTLS: true },
    { name: "Port 465 (SMTPS)", port: 465, secure: true },
    { name: "Port 25 (Standard)", port: 25, secure: false }
  ];
  
  for (const { name, port, secure, requireTLS } of configs) {
    console.log(`Testing: ${name}`);
    
    try {
      const config = {
        host: 'mailserver.tauos.org',
        port,
        secure,
        auth: {
          user: 'noreply@tauos.org',
          pass: ''
        },
        tls: {
          rejectUnauthorized: false
        }
      };
      
      if (requireTLS) config.requireTLS = true;
      
      const transporter = nodemailer.createTransport(config);
      await transporter.verify();
      
      console.log(`✅ ${name} - SMTP Ready!`);
      console.log(`🎉 Use this configuration in your apps\n`);
      return config;
      
    } catch (error) {
      console.log(`❌ ${name} - ${error.message}`);
    }
  }
  
  return null;
}

// Run tests
async function runTests() {
  await testConnectivity();
  const workingConfig = await testSMTP();
  
  if (workingConfig) {
    console.log("🔧 Update your app.js SMTP config with:");
    console.log(JSON.stringify(workingConfig, null, 2));
  } else {
    console.log("\n❌ VM still not responding. Check GCP Console:");
    console.log("https://console.cloud.google.com/compute/instances?project=zinc-crow-468305-m3");
  }
}

runTests(); 
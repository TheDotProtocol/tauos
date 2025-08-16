const nodemailer = require('nodemailer');

// Debug SMTP Connection Issues
async function debugSMTPConnection() {
  console.log('🔍 Debugging SMTP Connection Issues...\n');

  // Test different SMTP configurations
  const configs = [
    {
      name: 'TauOS SMTP (mailserver.tauos.org)',
      config: {
        host: 'mailserver.tauos.org',
        port: 587,
        secure: false,
        auth: {
          user: 'noreply@tauos.org',
          pass: process.env.SMTP_PASS || 'test'
        },
        tls: {
          rejectUnauthorized: false
        },
        requireTLS: true
      }
    },
    {
      name: 'TauOS SMTP (IP Address)',
      config: {
        host: '34.30.189.200',
        port: 587,
        secure: false,
        auth: {
          user: 'noreply@tauos.org',
          pass: process.env.SMTP_PASS || 'test'
        },
        tls: {
          rejectUnauthorized: false
        },
        requireTLS: true
      }
    },
    {
      name: 'TauOS SMTP (No TLS)',
      config: {
        host: 'mailserver.tauos.org',
        port: 587,
        secure: false,
        auth: {
          user: 'noreply@tauos.org',
          pass: process.env.SMTP_PASS || 'test'
        },
        requireTLS: false
      }
    }
  ];

  for (const { name, config } of configs) {
    console.log(`\n🔍 Testing: ${name}`);
    console.log('Config:', {
      host: config.host,
      port: config.port,
      user: config.auth.user,
      pass: config.auth.pass ? '***' : 'not_set',
      secure: config.secure,
      requireTLS: config.requireTLS
    });

    try {
      const transporter = nodemailer.createTransport(config);
      
      console.log('Testing connection...');
      await transporter.verify();
      console.log('✅ Connection successful!');
      
      console.log('Testing email send...');
      const info = await transporter.sendMail({
        from: 'noreply@tauos.org',
        to: 'test@example.com',
        subject: 'SMTP Debug Test',
        text: 'This is a debug test email.'
      });
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', info.messageId);
      
    } catch (error) {
      console.log('❌ Failed:', error.message);
      console.log('Error details:', {
        code: error.code,
        command: error.command,
        response: error.response
      });
    }
  }

  // Test DNS resolution
  console.log('\n🌐 DNS Resolution Test:');
  const dns = require('dns');
  
  try {
    const addresses = await dns.promises.resolve4('mailserver.tauos.org');
    console.log('mailserver.tauos.org resolves to:', addresses);
  } catch (error) {
    console.log('DNS resolution failed:', error.message);
  }

  // Test network connectivity
  console.log('\n🌐 Network Connectivity Test:');
  const net = require('net');
  
  const testConnection = (host, port) => {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      const timeout = setTimeout(() => {
        socket.destroy();
        resolve(false);
      }, 5000);
      
      socket.connect(port, host, () => {
        clearTimeout(timeout);
        socket.destroy();
        resolve(true);
      });
      
      socket.on('error', () => {
        clearTimeout(timeout);
        resolve(false);
      });
    });
  };

  const hosts = [
    { host: 'mailserver.tauos.org', port: 587 },
    { host: '34.30.189.200', port: 587 },
    { host: 'mailserver.tauos.org', port: 25 }
  ];

  for (const { host, port } of hosts) {
    const connected = await testConnection(host, port);
    console.log(`${host}:${port} - ${connected ? '✅ Connected' : '❌ Failed'}`);
  }
}

// Run the debug
debugSMTPConnection().catch(console.error); 
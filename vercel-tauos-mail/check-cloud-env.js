const https = require('https');

async function checkCloudEnvironment() {
    console.log('🔍 Checking TauCloud Environment Variables...\n');
    
    const url = 'https://cloud.tauos.org/api/debug/public';
    
    try {
        const response = await new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({ status: res.statusCode, data }));
            }).on('error', reject);
        });
        
        if (response.status === 200) {
            const env = JSON.parse(response.data);
            console.log('✅ TauCloud Environment Variables Status:');
            console.log(`   DATABASE_URL: ${env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
            console.log(`   JWT_SECRET: ${env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
            console.log(`   SMTP_USER: ${env.SMTP_USER ? '✅ Set' : '❌ Missing'}`);
            console.log(`   SMTP_PASS: ${env.SMTP_PASS ? '✅ Set' : '❌ Missing'}`);
            console.log(`   MAILTRAP_USER: ${env.MAILTRAP_USER ? '✅ Set' : '❌ Missing'}`);
            console.log(`   MAILTRAP_PASS: ${env.MAILTRAP_PASS ? '✅ Set' : '❌ Missing'}`);
            console.log(`   SMTP_HOST: ${env.SMTP_HOST ? '✅ Set' : '❌ Missing'}`);
            console.log(`   SMTP_PORT: ${env.SMTP_PORT ? '✅ Set' : '❌ Missing'}`);
            
            if (!env.SMTP_USER || !env.SMTP_PASS) {
                console.log('\n❌ SMTP credentials are missing in TauCloud!');
                console.log('   Please set these in Vercel dashboard for TauCloud project:');
                console.log('   - SMTP_USER=noreply');
                console.log('   - SMTP_PASS=TauOS2024!Secure');
                console.log('   - SMTP_HOST=34.30.189.200');
                console.log('   - SMTP_PORT=587');
            } else {
                console.log('\n✅ TauCloud SMTP credentials are set!');
            }
        } else {
            console.log(`❌ Failed to check TauCloud environment: ${response.status}`);
            console.log('   Response:', response.data);
        }
    } catch (error) {
        console.log(`❌ Error checking TauCloud environment: ${error.message}`);
    }
}

checkCloudEnvironment(); 
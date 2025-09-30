const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  ssl: {
    rejectUnauthorized: false
  }
});

async function testInbox() {
  try {
    console.log('🔍 Testing inbox database...');
    
    // Check if incoming_emails table exists and has data
    const result = await pool.query(`
      SELECT COUNT(*) as total_emails 
      FROM incoming_emails
    `);
    
    console.log('📊 Total emails in database:', result.rows[0].total_emails);
    
    // Get recent emails
    const emails = await pool.query(`
      SELECT id, from_email, subject, received_at 
      FROM incoming_emails 
      ORDER BY received_at DESC 
      LIMIT 5
    `);
    
    console.log('📧 Recent emails:');
    emails.rows.forEach(email => {
      console.log(`- ${email.from_email}: ${email.subject} (${email.received_at})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testInbox();

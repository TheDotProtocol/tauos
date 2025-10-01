import { Pool } from 'pg';

// UNIFIED DATABASE CONNECTION - SINGLE SOURCE OF TRUTH
// This ensures both webhook and API use the EXACT same database instance
// CACHE BUSTING: Force fresh connection
export const unifiedPool = new Pool({
  connectionString: 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // Force fresh connection
  allowExitOnIdle: true,
  // Cache busting
  application_name: `taumail-${Date.now()}-${Math.random()}`
});

// Database connection test function
export async function testDatabaseConnection() {
  try {
    const result = await unifiedPool.query('SELECT current_database(), current_user, version()');
    console.log('🔍 UNIFIED DATABASE INFO:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.log('🔍 Database connection test failed:', error.message);
    throw error;
  }
}

// Ensure incoming_emails table exists
export async function ensureIncomingEmailsTable() {
  try {
    await unifiedPool.query(`
      CREATE TABLE IF NOT EXISTS incoming_emails (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        from_email VARCHAR(255) NOT NULL,
        sender_name VARCHAR(255),
        subject TEXT,
        body TEXT,
        body_text TEXT,
        body_html TEXT,
        received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        is_read BOOLEAN DEFAULT FALSE,
        is_spam BOOLEAN DEFAULT FALSE,
        headers JSONB,
        attachments JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ incoming_emails table ensured');
  } catch (error) {
    console.log('⚠️ Table creation warning:', error.message);
  }
}

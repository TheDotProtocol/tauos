import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Email addresses to create
const emailAddresses = [
  {
    email: 'noreply@tauos.org',
    name: 'TauOS No Reply',
    description: 'Automated system emails',
    type: 'system'
  },
  {
    email: 'info@tauos.org',
    name: 'TauOS Information',
    description: 'General information and inquiries',
    type: 'support'
  },
  {
    email: 'hello@tauos.org',
    name: 'TauOS Hello',
    description: 'Welcome and onboarding emails',
    type: 'welcome'
  },
  {
    email: 'press@tauos.org',
    name: 'TauOS Press',
    description: 'Media and press inquiries',
    type: 'media'
  },
  {
    email: 'support@tauos.org',
    name: 'TauOS Support',
    description: 'Technical support and help',
    type: 'support'
  },
  {
    email: 'admin@tauos.org',
    name: 'TauOS Admin',
    description: 'Administrative functions',
    type: 'admin'
  },
  {
    email: 'alerts@tauos.org',
    name: 'TauOS Alerts',
    description: 'System alerts and notifications',
    type: 'system'
  },
  {
    email: 'notifications@tauos.org',
    name: 'TauOS Notifications',
    description: 'User notifications',
    type: 'system'
  },
  {
    email: 'errors@tauos.org',
    name: 'TauOS Errors',
    description: 'Error reporting and tracking',
    type: 'system'
  }
];

export async function POST(request: NextRequest) {
  try {
    const client = await pool.connect();
    
    // Create email addresses in the database
    for (const emailData of emailAddresses) {
      try {
        // Check if email already exists
        const existingEmail = await client.query(
          'SELECT id FROM email_addresses WHERE email = $1',
          [emailData.email]
        );

        if (existingEmail.rows.length === 0) {
          // Insert new email address
          await client.query(`
            INSERT INTO email_addresses (email, name, description, type, created_at, updated_at)
            VALUES ($1, $2, $3, $4, NOW(), NOW())
          `, [emailData.email, emailData.name, emailData.description, emailData.type]);
          
          console.log(`✅ Created email address: ${emailData.email}`);
        } else {
          console.log(`⚠️ Email address already exists: ${emailData.email}`);
        }
      } catch (error) {
        console.error(`❌ Error creating email ${emailData.email}:`, error);
      }
    }

    client.release();

    return NextResponse.json({
      success: true,
      message: 'Email addresses setup completed',
      addresses: emailAddresses.map(addr => addr.email)
    });

  } catch (error) {
    console.error('Error setting up email addresses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to setup email addresses' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect();
    
    // Get all email addresses
    const result = await client.query(`
      SELECT email, name, description, type, created_at
      FROM email_addresses
      ORDER BY type, email
    `);

    client.release();

    return NextResponse.json({
      success: true,
      addresses: result.rows
    });

  } catch (error) {
    console.error('Error fetching email addresses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch email addresses' },
      { status: 500 }
    );
  }
}

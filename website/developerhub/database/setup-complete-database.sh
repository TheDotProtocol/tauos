#!/bin/bash

# TauCore™ Complete Database Setup Script
# Clean slate rebuild for all TauOS applications

set -e  # Exit on any error

echo "🚀 Starting TauCore™ Complete Database Setup..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_environment() {
    print_status "Checking environment variables..."
    
    if [ -z "$DATABASE_URL" ]; then
        print_error "DATABASE_URL environment variable is not set"
        print_status "Please set DATABASE_URL in your .env file or environment"
        exit 1
    fi
    
    print_success "Environment variables are set"
}

# Check if PostgreSQL is accessible
check_database_connection() {
    print_status "Checking database connection..."
    
    if ! psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
        print_error "Cannot connect to database"
        print_status "Please check your DATABASE_URL and ensure PostgreSQL is running"
        exit 1
    fi
    
    print_success "Database connection successful"
}

# Install required dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ ! -f "package.json" ]; then
        print_status "Creating package.json..."
        cat > package.json << EOF
{
  "name": "tauos-complete-database-setup",
  "version": "1.0.0",
  "description": "TauOS Complete Database Setup Script",
  "main": "test-complete-setup.js",
  "scripts": {
    "test": "node test-complete-setup.js",
    "setup": "bash setup-complete-database.sh"
  },
  "dependencies": {
    "pg": "^8.11.3",
    "dotenv": "^16.3.1"
  }
}
EOF
    fi
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing npm packages..."
        npm install
    fi
    
    print_success "Dependencies installed"
}

# Run complete database schema setup
setup_complete_database_schema() {
    print_status "Setting up complete database schema..."
    
    # Run complete hybrid schema
    if psql "$DATABASE_URL" -f hybrid-schema-complete.sql; then
        print_success "Complete hybrid schema created successfully"
    else
        print_error "Failed to create complete hybrid schema"
        exit 1
    fi
}

# Run complete seed data
setup_complete_seed_data() {
    print_status "Setting up complete seed data..."
    
    if psql "$DATABASE_URL" -f hybrid-seed-complete.sql; then
        print_success "Complete seed data created successfully"
    else
        print_error "Failed to create complete seed data"
        exit 1
    fi
}

# Run comprehensive database tests
run_comprehensive_database_tests() {
    print_status "Running comprehensive database tests..."
    
    if node test-complete-setup.js; then
        print_success "All database tests passed"
    else
        print_error "Some database tests failed"
        print_status "Please check the test output above for details"
        exit 1
    fi
}

# Create environment configuration
create_environment_config() {
    print_status "Creating environment configuration..."
    
    cat > .env.example << EOF
# TauCore™ Complete Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/tauos
JWT_SECRET=your-jwt-secret-key-here
BCRYPT_ROUNDS=12

# SMTP Configuration (Vultr + SendGrid)
SMTP_HOST=smtp.tauos.org
SMTP_PORT=587
SMTP_USER=saleena@tauos.org
SMTP_PASS=Saleena@132
SMTP_SECURE=false

# SendGrid Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=saleena@tauos.org

# Email Configuration
EMAIL_DOMAIN=tauos.org
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760

# Logging
LOG_LEVEL=info
NODE_ENV=development
EOF
    
    print_success "Environment configuration created"
}

# Create email test script
create_email_test_script() {
    print_status "Creating email test script..."
    
    cat > test-email-flow.js << 'EOF'
#!/usr/bin/env node

/**
 * TauCore™ Email Flow Test Script
 * Tests the complete email flow from TauOS to Gmail
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testEmailFlow() {
    try {
        console.log('🧪 Testing Email Flow: TauOS → Gmail');
        console.log('=====================================');
        
        // Create test email
        const emailResult = await pool.query(`
            INSERT INTO emails (user_id, from_email, to_email, subject, body, html_body, message_id, is_sent, delivery_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `, [
            '11111111-1111-1111-1111-111111111111',
            'saleena@tauos.org',
            'saleenafalcon@gmail.com',
            'Welcome to TauOS!',
            'Welcome to TauOS! This is a test email to verify the system is working correctly.',
            '<h1>Welcome to TauOS!</h1><p>This is a test email to verify the system is working correctly.</p><p>Best regards,<br>Saleena Falcon<br>CEO, TauOS</p>',
            '<welcome-test@tauos.org>',
            false,
            'pending'
        ]);
        
        const emailId = emailResult.rows[0].id;
        console.log(`✅ Test email created with ID: ${emailId}`);
        
        // Queue the email
        const queueResult = await pool.query('SELECT queue_email_for_delivery($1)', [emailId]);
        const queueId = queueResult.rows[0].queue_email_for_delivery;
        console.log(`✅ Email queued with ID: ${queueId}`);
        
        // Process the email queue
        const processResult = await pool.query('SELECT process_email_queue()');
        const processedCount = processResult.rows[0].process_email_queue;
        console.log(`✅ Email queue processed: ${processedCount} emails`);
        
        // Check email status
        const statusResult = await pool.query('SELECT * FROM emails WHERE id = $1', [emailId]);
        const email = statusResult.rows[0];
        
        console.log('\n📧 Email Status:');
        console.log(`   From: ${email.from_email}`);
        console.log(`   To: ${email.to_email}`);
        console.log(`   Subject: ${email.subject}`);
        console.log(`   Status: ${email.delivery_status}`);
        console.log(`   Sent: ${email.is_sent}`);
        
        if (email.is_sent && email.delivery_status === 'sent') {
            console.log('\n🎉 Email flow test PASSED!');
            console.log('📧 Email sent from saleena@tauos.org to saleenafalcon@gmail.com');
            console.log('✅ Check your Gmail inbox for the test email');
            console.log('✅ Reply to the email to test incoming email flow');
        } else {
            console.log('\n⚠️  Email flow test needs attention');
            console.log('📧 Email was created but may need SMTP configuration');
        }
        
    } catch (error) {
        console.error('❌ Email flow test failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

testEmailFlow();
EOF
    
    chmod +x test-email-flow.js
    print_success "Email test script created"
}

# Create monitoring script
create_monitoring_script() {
    print_status "Creating database monitoring script..."
    
    cat > monitor-complete-database.js << 'EOF'
#!/usr/bin/env node

/**
 * TauCore™ Complete Database Monitoring Script
 * Monitors the complete hybrid database performance and health
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function monitorCompleteDatabase() {
    try {
        console.log('🔍 TauCore™ Complete Database Monitoring');
        console.log('========================================');
        
        // Get database metrics
        const metricsResult = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM organizations) as total_organizations,
                (SELECT COUNT(*) FROM emails) as total_emails,
                (SELECT COUNT(*) FROM cloud_files) as total_files,
                (SELECT COUNT(*) FROM projects) as total_projects,
                (SELECT COUNT(*) FROM store_apps) as total_apps,
                (SELECT COUNT(*) FROM browser_bookmarks) as total_bookmarks,
                (SELECT COUNT(*) FROM ai_conversations) as total_ai_conversations,
                (SELECT COUNT(*) FROM user_sessions WHERE expires_at > NOW()) as active_sessions,
                pg_size_pretty(pg_database_size(current_database())) as database_size
        `);
        
        const metrics = metricsResult.rows[0];
        
        console.log('\n📊 Database Metrics:');
        console.log(`Total Users: ${metrics.total_users}`);
        console.log(`Total Organizations: ${metrics.total_organizations}`);
        console.log(`Total Emails: ${metrics.total_emails}`);
        console.log(`Total Files: ${metrics.total_files}`);
        console.log(`Total Projects: ${metrics.total_projects}`);
        console.log(`Total Apps: ${metrics.total_apps}`);
        console.log(`Total Bookmarks: ${metrics.total_bookmarks}`);
        console.log(`Total AI Conversations: ${metrics.total_ai_conversations}`);
        console.log(`Active Sessions: ${metrics.active_sessions}`);
        console.log(`Database Size: ${metrics.database_size}`);
        
        // Get table sizes
        const tableSizesResult = await pool.query(`
            SELECT 
                schemaname,
                tablename,
                pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
            LIMIT 10
        `);
        
        console.log('\n📈 Table Sizes:');
        tableSizesResult.rows.forEach(table => {
            console.log(`${table.tablename}: ${table.size}`);
        });
        
        // Get connection info
        const connectionResult = await pool.query(`
            SELECT 
                count(*) as active_connections,
                max(now() - state_change) as oldest_connection
            FROM pg_stat_activity 
            WHERE state = 'active'
        `);
        
        console.log('\n🔗 Connection Info:');
        console.log(`Active Connections: ${connectionResult.rows[0].active_connections}`);
        console.log(`Oldest Connection: ${connectionResult.rows[0].oldest_connection}`);
        
        // Get email queue status
        const emailQueueResult = await pool.query(`
            SELECT 
                status,
                COUNT(*) as count
            FROM email_queues
            GROUP BY status
        `);
        
        if (emailQueueResult.rows.length > 0) {
            console.log('\n📧 Email Queue Status:');
            emailQueueResult.rows.forEach(queue => {
                console.log(`${queue.status}: ${queue.count} emails`);
            });
        }
        
        // Get recent activity
        const recentActivityResult = await pool.query(`
            SELECT 
                'email' as type,
                created_at,
                'New email' as description
            FROM emails 
            ORDER BY created_at DESC 
            LIMIT 5
            UNION ALL
            SELECT 
                'file' as type,
                created_at,
                'New file uploaded' as description
            FROM cloud_files 
            ORDER BY created_at DESC 
            LIMIT 5
            ORDER BY created_at DESC 
            LIMIT 10
        `);
        
        if (recentActivityResult.rows.length > 0) {
            console.log('\n🔄 Recent Activity:');
            recentActivityResult.rows.forEach(activity => {
                console.log(`${activity.type}: ${activity.description} (${activity.created_at})`);
            });
        }
        
        console.log('\n✅ Complete database monitoring completed');
        
    } catch (error) {
        console.error('❌ Monitoring failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

monitorCompleteDatabase();
EOF
    
    chmod +x monitor-complete-database.js
    print_success "Complete database monitoring script created"
}

# Create backup script
create_backup_script() {
    print_status "Creating database backup script..."
    
    cat > backup-complete-database.sh << 'EOF'
#!/bin/bash

# TauCore™ Complete Database Backup Script
# Creates a backup of the complete TauOS database

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="tauos_complete_backup_${TIMESTAMP}.sql"

echo "🚀 Starting complete database backup..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
echo "📦 Creating backup: $BACKUP_FILE"
pg_dump "$DATABASE_URL" > "${BACKUP_DIR}/${BACKUP_FILE}"

# Compress backup
echo "🗜️  Compressing backup..."
gzip "${BACKUP_DIR}/${BACKUP_FILE}"

echo "✅ Complete backup completed: ${BACKUP_DIR}/${BACKUP_FILE}.gz"
EOF
    
    chmod +x backup-complete-database.sh
    print_success "Complete database backup script created"
}

# Main setup function
main() {
    echo "🚀 TauCore™ Complete Database Setup"
    echo "===================================="
    echo ""
    
    # Check environment
    check_environment
    
    # Check database connection
    check_database_connection
    
    # Install dependencies
    install_dependencies
    
    # Setup complete database schema
    setup_complete_database_schema
    
    # Setup complete seed data
    setup_complete_seed_data
    
    # Run comprehensive database tests
    run_comprehensive_database_tests
    
    # Create additional scripts
    create_environment_config
    create_email_test_script
    create_monitoring_script
    create_backup_script
    
    echo ""
    echo "🎉 TauCore™ Complete Database Setup Complete!"
    echo "============================================"
    echo ""
    echo "✅ Complete hybrid schema created"
    echo "✅ Master user (saleena@tauos.org) created"
    echo "✅ SMTP configuration ready"
    echo "✅ All applications integrated"
    echo "✅ All tests passed"
    echo ""
    echo "📁 Additional files created:"
    echo "   - .env.example (environment configuration)"
    echo "   - test-email-flow.js (email flow testing)"
    echo "   - monitor-complete-database.js (database monitoring)"
    echo "   - backup-complete-database.sh (database backup)"
    echo ""
    echo "🚀 Your complete TauOS database is ready for production!"
    echo ""
    echo "Next steps:"
    echo "1. Copy .env.example to .env and configure your settings"
    echo "2. Test email flow: node test-email-flow.js"
    echo "3. Monitor database: node monitor-complete-database.js"
    echo "4. Set up automated backups with backup-complete-database.sh"
    echo "5. Proceed to Phase 2: TauMail Integration"
    echo ""
    echo "🎯 CRITICAL TEST: Send email from saleena@tauos.org to saleenafalcon@gmail.com"
    echo "📧 Then reply from Gmail to test incoming email flow"
    echo ""
}

# Run main function
main "$@"

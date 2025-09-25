#!/bin/bash

# TauCore™ Hybrid Database Setup Script
# Complete database setup for TauOS ecosystem

set -e  # Exit on any error

echo "🚀 Starting TauCore™ Hybrid Database Setup..."
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
  "name": "tauos-database-setup",
  "version": "1.0.0",
  "description": "TauOS Database Setup Script",
  "main": "test-database-setup.js",
  "scripts": {
    "test": "node test-database-setup.js",
    "setup": "bash setup-hybrid-database.sh"
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

# Run database schema setup
setup_database_schema() {
    print_status "Setting up database schema..."
    
    # Run hybrid schema
    if psql "$DATABASE_URL" -f hybrid-schema.sql; then
        print_success "Hybrid schema created successfully"
    else
        print_error "Failed to create hybrid schema"
        exit 1
    fi
    
    # Run connection optimization
    if psql "$DATABASE_URL" -f connection-optimization.sql; then
        print_success "Connection optimization applied"
    else
        print_error "Failed to apply connection optimization"
        exit 1
    fi
    
    # Run SMTP configuration
    if psql "$DATABASE_URL" -f smtp-configuration.sql; then
        print_success "SMTP configuration applied"
    else
        print_error "Failed to apply SMTP configuration"
        exit 1
    fi
}

# Run seed data
setup_seed_data() {
    print_status "Setting up seed data..."
    
    if psql "$DATABASE_URL" -f hybrid-seed.sql; then
        print_success "Seed data created successfully"
    else
        print_error "Failed to create seed data"
        exit 1
    fi
}

# Run database tests
run_database_tests() {
    print_status "Running database tests..."
    
    if node test-database-setup.js; then
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
# TauCore™ Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/tauos
JWT_SECRET=your-jwt-secret-key-here
BCRYPT_ROUNDS=12

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false

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

# Create database backup script
create_backup_script() {
    print_status "Creating database backup script..."
    
    cat > backup-database.sh << 'EOF'
#!/bin/bash

# TauCore™ Database Backup Script
# Creates a backup of the TauOS database

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="tauos_backup_${TIMESTAMP}.sql"

echo "🚀 Starting database backup..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
echo "📦 Creating backup: $BACKUP_FILE"
pg_dump "$DATABASE_URL" > "${BACKUP_DIR}/${BACKUP_FILE}"

# Compress backup
echo "🗜️  Compressing backup..."
gzip "${BACKUP_DIR}/${BACKUP_FILE}"

echo "✅ Backup completed: ${BACKUP_DIR}/${BACKUP_FILE}.gz"
EOF
    
    chmod +x backup-database.sh
    print_success "Database backup script created"
}

# Create database restore script
create_restore_script() {
    print_status "Creating database restore script..."
    
    cat > restore-database.sh << 'EOF'
#!/bin/bash

# TauCore™ Database Restore Script
# Restores a backup of the TauOS database

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file>"
    echo "Example: $0 backups/tauos_backup_20241201_120000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

echo "🚀 Starting database restore..."

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Restore database
echo "📦 Restoring from backup: $BACKUP_FILE"
if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | psql "$DATABASE_URL"
else
    psql "$DATABASE_URL" < "$BACKUP_FILE"
fi

echo "✅ Database restore completed"
EOF
    
    chmod +x restore-database.sh
    print_success "Database restore script created"
}

# Create monitoring script
create_monitoring_script() {
    print_status "Creating database monitoring script..."
    
    cat > monitor-database.js << 'EOF'
#!/usr/bin/env node

/**
 * TauCore™ Database Monitoring Script
 * Monitors database performance and health
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function monitorDatabase() {
    try {
        console.log('🔍 TauCore™ Database Monitoring');
        console.log('================================');
        
        // Get database metrics
        const metricsResult = await pool.query('SELECT get_database_metrics()');
        const metrics = JSON.parse(metricsResult.rows[0].get_database_metrics);
        
        console.log('\n📊 Database Metrics:');
        console.log(`Total Users: ${metrics.total_users}`);
        console.log(`Total Emails: ${metrics.total_emails}`);
        console.log(`Total Files: ${metrics.total_files}`);
        console.log(`Total Projects: ${metrics.total_projects}`);
        console.log(`Active Sessions: ${metrics.active_sessions}`);
        console.log(`Database Size: ${metrics.database_size}`);
        
        console.log('\n📈 Table Sizes:');
        metrics.table_sizes.forEach(table => {
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
        
        // Get slow queries
        const slowQueriesResult = await pool.query(`
            SELECT 
                query,
                mean_time,
                calls,
                total_time
            FROM pg_stat_statements 
            ORDER BY mean_time DESC 
            LIMIT 5
        `);
        
        if (slowQueriesResult.rows.length > 0) {
            console.log('\n🐌 Slow Queries:');
            slowQueriesResult.rows.forEach((query, index) => {
                console.log(`${index + 1}. ${query.query.substring(0, 100)}...`);
                console.log(`   Mean Time: ${query.mean_time}ms`);
                console.log(`   Calls: ${query.calls}`);
            });
        }
        
        console.log('\n✅ Database monitoring completed');
        
    } catch (error) {
        console.error('❌ Monitoring failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

monitorDatabase();
EOF
    
    chmod +x monitor-database.js
    print_success "Database monitoring script created"
}

# Main setup function
main() {
    echo "🚀 TauCore™ Hybrid Database Setup"
    echo "=================================="
    echo ""
    
    # Check environment
    check_environment
    
    # Check database connection
    check_database_connection
    
    # Install dependencies
    install_dependencies
    
    # Setup database schema
    setup_database_schema
    
    # Setup seed data
    setup_seed_data
    
    # Run database tests
    run_database_tests
    
    # Create additional scripts
    create_environment_config
    create_backup_script
    create_restore_script
    create_monitoring_script
    
    echo ""
    echo "🎉 TauCore™ Hybrid Database Setup Complete!"
    echo "=========================================="
    echo ""
    echo "✅ Database schema created"
    echo "✅ Connection optimization applied"
    echo "✅ SMTP configuration applied"
    echo "✅ Seed data created"
    echo "✅ All tests passed"
    echo ""
    echo "📁 Additional files created:"
    echo "   - .env.example (environment configuration)"
    echo "   - backup-database.sh (database backup script)"
    echo "   - restore-database.sh (database restore script)"
    echo "   - monitor-database.js (database monitoring script)"
    echo ""
    echo "🚀 Your TauOS database is ready for production!"
    echo ""
    echo "Next steps:"
    echo "1. Copy .env.example to .env and configure your settings"
    echo "2. Test your SMTP configuration"
    echo "3. Run 'node monitor-database.js' to monitor performance"
    echo "4. Set up automated backups with 'backup-database.sh'"
    echo ""
}

# Run main function
main "$@"

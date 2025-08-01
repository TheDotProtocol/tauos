const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const dns = require('dns').promises;
const axios = require('axios');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Company Registration API
class CompanyRegistrationAPI {
  
  // Register new company
  async registerCompany(req, res) {
    try {
      const {
        company_name,
        domain,
        admin_email,
        contact_info,
        settings = {}
      } = req.body;

      // Validate required fields
      if (!company_name || !domain || !admin_email) {
        return res.status(400).json({
          error: 'Missing required fields: company_name, domain, admin_email'
        });
      }

      // Validate domain format
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(domain)) {
        return res.status(400).json({
          error: 'Invalid domain format'
        });
      }

      // Check if domain already exists
      const existingDomain = await pool.query(
        'SELECT id FROM domains WHERE domain = $1',
        [domain]
      );

      if (existingDomain.rows.length > 0) {
        return res.status(409).json({
          error: 'Domain already registered'
        });
      }

      // Validate domain ownership via DNS
      const dnsValidation = await this.validateDomainOwnership(domain, admin_email);
      if (!dnsValidation.valid) {
        return res.status(400).json({
          error: 'Domain ownership validation failed',
          details: dnsValidation.reason
        });
      }

      // Create company record
      const companyResult = await pool.query(
        `INSERT INTO companies (name, domain, admin_email, contact_info, settings)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [company_name, domain, admin_email, contact_info, settings]
      );

      const companyId = companyResult.rows[0].id;

      // Create domain record
      const domainSettings = {
        mx_records: [`mail.${domain}`],
        spf_record: `v=spf1 mx a ip4:172.20.0.0/16 ~all`,
        dkim_selector: 'taumail',
        dmarc_policy: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}; ruf=mailto:dmarc@${domain}`,
        quota: settings.quota || 5368709120, // 5GB default
        max_attachment_size: settings.max_attachment_size || 26214400, // 25MB default
        spam_threshold: settings.spam_threshold || 5.0,
        enabled: true
      };

      await pool.query(
        `INSERT INTO domains (company_id, domain, mx_records, spf_record, dkim_selector, 
         dmarc_policy, quota, max_attachment_size, spam_threshold, enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          companyId,
          domain,
          domainSettings.mx_records,
          domainSettings.spf_record,
          domainSettings.dkim_selector,
          domainSettings.dmarc_policy,
          domainSettings.quota,
          domainSettings.max_attachment_size,
          domainSettings.spam_threshold,
          domainSettings.enabled
        ]
      );

      // Create admin user
      const adminPassword = this.generateSecurePassword();
      const passwordHash = await bcrypt.hash(adminPassword, 12);

      await pool.query(
        `INSERT INTO users (company_id, email, password_hash, role, quota, settings)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          companyId,
          admin_email,
          passwordHash,
          'admin',
          domainSettings.quota,
          { is_admin: true }
        ]
      );

      // Generate SSL certificate
      await this.generateSSLCertificate(domain);

      // Send welcome email
      await this.sendWelcomeEmail(admin_email, domain, adminPassword);

      res.status(201).json({
        message: 'Company registered successfully',
        company_id: companyId,
        domain: domain,
        admin_email: admin_email,
        dns_instructions: this.generateDNSInstructions(domain),
        temporary_password: adminPassword
      });

    } catch (error) {
      console.error('Company registration error:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Validate domain ownership
  async validateDomainOwnership(domain, adminEmail) {
    try {
      // Check if admin email domain matches
      const emailDomain = adminEmail.split('@')[1];
      if (emailDomain !== domain) {
        return {
          valid: false,
          reason: 'Admin email domain must match the registered domain'
        };
      }

      // Check DNS records
      const mxRecords = await dns.resolveMx(domain);
      if (mxRecords.length === 0) {
        return {
          valid: false,
          reason: 'No MX records found for domain'
        };
      }

      // Check if we can send verification email
      try {
        await this.sendVerificationEmail(adminEmail, domain);
        return { valid: true };
      } catch (error) {
        return {
          valid: false,
          reason: 'Cannot send verification email to admin address'
        };
      }

    } catch (error) {
      return {
        valid: false,
        reason: 'DNS validation failed'
      };
    }
  }

  // Generate SSL certificate
  async generateSSLCertificate(domain) {
    try {
      // Use Let's Encrypt certbot
      const { exec } = require('child_process');
      
      return new Promise((resolve, reject) => {
        exec(`certbot certonly --webroot --webroot-path=/var/www/html --email admin@tauos.org --agree-tos --no-eff-email -d ${domain}`, (error, stdout, stderr) => {
          if (error) {
            console.error('SSL certificate generation failed:', error);
            reject(error);
          } else {
            console.log('SSL certificate generated for:', domain);
            resolve(stdout);
          }
        });
      });
    } catch (error) {
      console.error('SSL certificate generation error:', error);
      throw error;
    }
  }

  // Generate DNS instructions
  generateDNSInstructions(domain) {
    return {
      mx_records: [
        {
          type: 'MX',
          name: domain,
          value: `mail.${domain}`,
          priority: 10
        }
      ],
      spf_record: {
        type: 'TXT',
        name: domain,
        value: 'v=spf1 mx a ip4:172.20.0.0/16 ~all'
      },
      dkim_record: {
        type: 'TXT',
        name: 'taumail._domainkey',
        value: 'v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY'
      },
      dmarc_record: {
        type: 'TXT',
        name: '_dmarc',
        value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}; ruf=mailto:dmarc@${domain}`
      }
    };
  }

  // Send welcome email
  async sendWelcomeEmail(email, domain, password) {
    try {
      const emailContent = `
        Welcome to TauMail!
        
        Your company domain ${domain} has been successfully registered.
        
        Admin Email: ${email}
        Temporary Password: ${password}
        
        Please change your password after first login.
        
        DNS Configuration Required:
        Please configure the following DNS records for your domain:
        
        MX Record:
        ${domain} → mail.${domain} (Priority: 10)
        
        SPF Record:
        ${domain} → v=spf1 mx a ip4:172.20.0.0/16 ~all
        
        DMARC Record:
        _dmarc.${domain} → v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}
        
        Access your email at: https://mail.${domain}
        
        Best regards,
        The TauMail Team
      `;

      // Send email using local SMTP
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransporter({
        host: 'localhost',
        port: 25,
        secure: false
      });

      await transporter.sendMail({
        from: 'noreply@tauos.org',
        to: email,
        subject: 'Welcome to TauMail',
        text: emailContent
      });

    } catch (error) {
      console.error('Welcome email error:', error);
      // Don't fail registration if email fails
    }
  }

  // Send verification email
  async sendVerificationEmail(email, domain) {
    try {
      const verificationCode = Math.random().toString(36).substring(2, 8);
      
      const emailContent = `
        TauMail Domain Verification
        
        Verification Code: ${verificationCode}
        
        Please use this code to verify your domain ownership.
        
        If you didn't request this verification, please ignore this email.
      `;

      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransporter({
        host: 'localhost',
        port: 25,
        secure: false
      });

      await transporter.sendMail({
        from: 'noreply@tauos.org',
        to: email,
        subject: 'TauMail Domain Verification',
        text: emailContent
      });

    } catch (error) {
      console.error('Verification email error:', error);
      throw error;
    }
  }

  // Generate secure password
  generateSecurePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Get company info
  async getCompany(req, res) {
    try {
      const { company_id } = req.params;

      const result = await pool.query(
        `SELECT c.*, d.domain, d.quota, d.max_attachment_size, d.spam_threshold
         FROM companies c
         LEFT JOIN domains d ON c.id = d.company_id
         WHERE c.id = $1`,
        [company_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: 'Company not found'
        });
      }

      res.json(result.rows[0]);

    } catch (error) {
      console.error('Get company error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // Update company settings
  async updateCompany(req, res) {
    try {
      const { company_id } = req.params;
      const { name, contact_info, settings } = req.body;

      const result = await pool.query(
        `UPDATE companies 
         SET name = COALESCE($1, name),
             contact_info = COALESCE($2, contact_info),
             settings = COALESCE($3, settings),
             updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [name, contact_info, settings, company_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: 'Company not found'
        });
      }

      res.json(result.rows[0]);

    } catch (error) {
      console.error('Update company error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // Delete company
  async deleteCompany(req, res) {
    try {
      const { company_id } = req.params;

      // Check if company exists
      const company = await pool.query(
        'SELECT * FROM companies WHERE id = $1',
        [company_id]
      );

      if (company.rows.length === 0) {
        return res.status(404).json({
          error: 'Company not found'
        });
      }

      // Delete associated data
      await pool.query('DELETE FROM users WHERE company_id = $1', [company_id]);
      await pool.query('DELETE FROM domains WHERE company_id = $1', [company_id]);
      await pool.query('DELETE FROM companies WHERE id = $1', [company_id]);

      res.json({
        message: 'Company deleted successfully'
      });

    } catch (error) {
      console.error('Delete company error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}

// Initialize API
const api = new CompanyRegistrationAPI();

// Routes
router.post('/companies', api.registerCompany.bind(api));
router.get('/companies/:company_id', api.getCompany.bind(api));
router.put('/companies/:company_id', api.updateCompany.bind(api));
router.delete('/companies/:company_id', api.deleteCompany.bind(api));

module.exports = router; 
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Pool } from 'pg';
import Redis from 'redis';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Redis connection
const redis = Redis.createClient({
  url: process.env.REDIS_URL,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  attachments: z.array(z.string()).optional(),
});

// Authentication middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Database initialization
const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS emails (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        message_id VARCHAR(255) UNIQUE,
        from_email VARCHAR(255) NOT NULL,
        to_email VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        body TEXT NOT NULL,
        html_body TEXT,
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_read BOOLEAN DEFAULT FALSE,
        is_starred BOOLEAN DEFAULT FALSE,
        folder VARCHAR(50) DEFAULT 'inbox',
        labels TEXT[],
        attachments JSONB,
        headers JSONB
      );

      CREATE TABLE IF NOT EXISTS email_folders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) DEFAULT 'custom',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
      CREATE INDEX IF NOT EXISTS idx_emails_folder ON emails(folder);
      CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at);
    `);
  } finally {
    client.release();
  }
};

// Email service
class EmailService {
  private transporter: nodemailer.Transporter;
  private imap: Imap;

  constructor() {
    // SMTP configuration
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'admin@tauos.org',
        pass: process.env.SMTP_PASSWORD || 'password',
      },
    });

    // IMAP configuration
    this.imap = new Imap({
      user: process.env.IMAP_USER || 'admin@tauos.org',
      password: process.env.IMAP_PASSWORD || 'password',
      host: process.env.IMAP_HOST || 'localhost',
      port: parseInt(process.env.IMAP_PORT || '993'),
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });
  }

  async sendEmail(emailData: any, userId: number) {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER || 'admin@tauos.org',
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.body,
        html: emailData.html || emailData.body,
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      // Save to sent folder
      await this.saveEmail({
        user_id: userId,
        message_id: result.messageId,
        from_email: mailOptions.from,
        to_email: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
        html_body: emailData.html,
        folder: 'sent',
        labels: emailData.labels || [],
        attachments: emailData.attachments || [],
      });

      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async fetchEmails(userId: number, folder: string = 'inbox') {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => {
        this.imap.openBox(folder, false, (err, box) => {
          if (err) {
            reject(err);
            return;
          }

          const fetch = this.imap.seq.fetch('1:*', {
            bodies: '',
            struct: true,
          });

          const emails: any[] = [];

          fetch.on('message', (msg, seqno) => {
            const email: any = {};

            msg.on('body', (stream, info) => {
              simpleParser(stream, (err, parsed) => {
                if (err) {
                  console.error('Error parsing email:', err);
                  return;
                }

                email.from = parsed.from?.text || '';
                email.to = parsed.to?.text || '';
                email.subject = parsed.subject || '';
                email.body = parsed.text || '';
                email.html = parsed.html || '';
                email.date = parsed.date;
                email.messageId = parsed.messageId;
                email.attachments = parsed.attachments || [];

                // Save to database
                this.saveEmail({
                  user_id: userId,
                  message_id: email.messageId,
                  from_email: email.from,
                  to_email: email.to,
                  subject: email.subject,
                  body: email.body,
                  html_body: email.html,
                  folder: folder,
                  headers: parsed.headers,
                  attachments: email.attachments,
                });

                emails.push(email);
              });
            });
          });

          fetch.once('error', (err) => {
            reject(err);
          });

          fetch.once('end', () => {
            this.imap.end();
            resolve(emails);
          });
        });
      });

      this.imap.once('error', (err) => {
        reject(err);
      });

      this.imap.connect();
    });
  }

  private async saveEmail(emailData: any) {
    const client = await pool.connect();
    try {
      await client.query(`
        INSERT INTO emails (
          user_id, message_id, from_email, to_email, subject, 
          body, html_body, folder, labels, attachments, headers
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (message_id) DO NOTHING
      `, [
        emailData.user_id,
        emailData.message_id,
        emailData.from_email,
        emailData.to_email,
        emailData.subject,
        emailData.body,
        emailData.html_body,
        emailData.folder,
        emailData.labels,
        JSON.stringify(emailData.attachments),
        JSON.stringify(emailData.headers),
      ]);
    } finally {
      client.release();
    }
  }
}

const emailService = new EmailService();

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const client = await pool.connect();
    try {
      // Check if user exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const result = await client.query(
        'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, passwordHash, name]
      );

      const user = result.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      // Store token in Redis
      await redis.setEx(`token:${user.id}`, 86400, token);

      res.json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Invalid registration data' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, email, password_hash, name FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      // Store token in Redis
      await redis.setEx(`token:${user.id}`, 86400, token);

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: 'Invalid login data' });
  }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    await redis.del(`token:${req.user.userId}`);
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Email routes
app.get('/api/emails', authenticateToken, async (req, res) => {
  try {
    const { folder = 'inbox', page = 1, limit = 20, search } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const client = await pool.connect();
    try {
      let query = `
        SELECT * FROM emails 
        WHERE user_id = $1 AND folder = $2
      `;
      const params = [req.user.userId, folder];

      if (search) {
        query += ` AND (subject ILIKE $3 OR body ILIKE $3 OR from_email ILIKE $3)`;
        params.push(`%${search}%`);
      }

      query += ` ORDER BY received_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await client.query(query, params);

      res.json({
        emails: result.rows,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: result.rows.length,
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

app.get('/api/emails/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM emails WHERE id = $1 AND user_id = $2',
        [id, req.user.userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Email not found' });
      }

      // Mark as read
      await client.query(
        'UPDATE emails SET is_read = true WHERE id = $1',
        [id]
      );

      res.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({ error: 'Failed to fetch email' });
  }
});

app.post('/api/emails', authenticateToken, async (req, res) => {
  try {
    const emailData = emailSchema.parse(req.body);

    const result = await emailService.sendEmail(emailData, req.user.userId);

    res.json({
      message: 'Email sent successfully',
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.put('/api/emails/:id/star', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { starred } = req.body;

    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE emails SET is_starred = $1 WHERE id = $2 AND user_id = $3',
        [starred, id, req.user.userId]
      );

      res.json({ message: 'Email starred status updated' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating email star status:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

app.delete('/api/emails/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE emails SET folder = \'trash\' WHERE id = $1 AND user_id = $2',
        [id, req.user.userId]
      );

      res.json({ message: 'Email moved to trash' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ error: 'Failed to delete email' });
  }
});

// Folder routes
app.get('/api/folders', authenticateToken, async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM email_folders WHERE user_id = $1 ORDER BY name',
        [req.user.userId]
      );

      res.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

// Sync emails
app.post('/api/sync', authenticateToken, async (req, res) => {
  try {
    const emails = await emailService.fetchEmails(req.user.userId, 'inbox');
    
    res.json({
      message: 'Emails synced successfully',
      count: emails.length,
    });
  } catch (error) {
    console.error('Error syncing emails:', error);
    res.status(500).json({ error: 'Failed to sync emails' });
  }
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    await initDatabase();
    await redis.connect();
    
    app.listen(PORT, () => {
      console.log(`🐢 TauMail API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 
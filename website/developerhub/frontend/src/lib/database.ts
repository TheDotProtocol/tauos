import { Pool } from 'pg';

// Database connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'taucore_devhub',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// User repository
export const userRepository = {
  async findByEmail(email: string) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email.toLowerCase()]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  },

  async findByUsername(username: string) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  },

  async findById(id: string) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  },

  async create(userData: {
    email: string;
    username: string;
    fullName: string;
    passwordHash: string;
    emailVerificationToken?: string;
    emailVerificationExpiresAt?: Date;
  }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO users (email, username, full_name, password_hash, email_verification_token, email_verification_expires_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          userData.email,
          userData.username,
          userData.fullName,
          userData.passwordHash,
          userData.emailVerificationToken,
          userData.emailVerificationExpiresAt,
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async update(id: string, updateData: Partial<{
    fullName: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
    isEmailVerified: boolean;
    isTwoFactorEnabled: boolean;
    lastLoginAt: string;
  }>) {
    const client = await pool.connect();
    try {
      const fields = Object.keys(updateData).map((key, index) => 
        `${key} = $${index + 2}`
      ).join(', ');
      
      const values = Object.values(updateData);
      const result = await client.query(
        `UPDATE users SET ${fields} WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async delete(id: string) {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM users WHERE id = $1', [id]);
      return true;
    } finally {
      client.release();
    }
  }
};

// Session repository
export const sessionRepository = {
  async create(sessionData: {
    userId: string;
    sessionId: string;
    ipAddress?: string;
    userAgent?: string;
    rememberMe?: boolean;
    expiresAt: Date;
  }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO sessions (user_id, session_id, ip_address, user_agent, remember_me, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          sessionData.userId,
          sessionData.sessionId,
          sessionData.ipAddress,
          sessionData.userAgent,
          sessionData.rememberMe,
          sessionData.expiresAt,
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async findBySessionId(sessionId: string) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM sessions WHERE session_id = $1 AND expires_at > NOW()',
        [sessionId]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  },

  async delete(sessionId: string) {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM sessions WHERE session_id = $1', [sessionId]);
      return true;
    } finally {
      client.release();
    }
  },

  async deleteAllForUser(userId: string) {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
      return true;
    } finally {
      client.release();
    }
  },

  async cleanupExpired() {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM sessions WHERE expires_at < NOW()');
      return true;
    } finally {
      client.release();
    }
  }
};

// Login attempts repository
export const loginAttemptRepository = {
  async log(attemptData: {
    userId?: string;
    email: string;
    ipAddress?: string;
    userAgent?: string;
    success: boolean;
    failureReason?: string;
  }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO login_attempts (user_id, email, ip_address, user_agent, success, failure_reason)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          attemptData.userId,
          attemptData.email,
          attemptData.ipAddress,
          attemptData.userAgent,
          attemptData.success,
          attemptData.failureReason,
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async getRecentFailedAttempts(email: string, minutes: number = 15) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM login_attempts 
         WHERE email = $1 AND success = false 
         AND attempted_at > NOW() - INTERVAL '${minutes} minutes'
         ORDER BY attempted_at DESC`,
        [email]
      );
      return result.rows;
    } finally {
      client.release();
    }
  },

  async getRecentAttemptsByIp(ipAddress: string, minutes: number = 15) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM login_attempts 
         WHERE ip_address = $1 
         AND attempted_at > NOW() - INTERVAL '${minutes} minutes'
         ORDER BY attempted_at DESC`,
        [ipAddress]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
};

// Project repository
export const projectRepository = {
  async create(projectData: {
    userId: string;
    name: string;
    description?: string;
    repositoryUrl?: string;
    isPublic?: boolean;
  }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO projects (user_id, name, description, repository_url, is_public)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          projectData.userId,
          projectData.name,
          projectData.description,
          projectData.repositoryUrl,
          projectData.isPublic,
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async findByUserId(userId: string) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  },

  async findById(id: string) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM projects WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  },

  async update(id: string, updateData: Partial<{
    name: string;
    description: string;
    repositoryUrl: string;
    isPublic: boolean;
  }>) {
    const client = await pool.connect();
    try {
      const fields = Object.keys(updateData).map((key, index) => 
        `${key} = $${index + 2}`
      ).join(', ');
      
      const values = Object.values(updateData);
      const result = await client.query(
        `UPDATE projects SET ${fields} WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async delete(id: string) {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM projects WHERE id = $1', [id]);
      return true;
    } finally {
      client.release();
    }
  }
};

// Close the pool when the application shuts down
process.on('SIGINT', () => {
  pool.end();
});

process.on('SIGTERM', () => {
  pool.end();
});

export default pool;
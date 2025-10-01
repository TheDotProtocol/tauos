import { NextRequest } from 'next/server';

// 🛡️ ENTERPRISE INPUT VALIDATION & SANITIZATION
// Implements all pen-test recommendations for input security

export class InputValidationSecurity {
  // 🔍 SQL INJECTION PROTECTION
  static validateSQLInput(input: string): { valid: boolean; sanitized: string; errors: string[] } {
    const errors: string[] = [];
    let sanitized = input;
    
    // Dangerous SQL patterns
    const dangerousPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(--|\/\*|\*\/)/,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(\b(OR|AND)\s+['"]\s*=\s*['"])/i,
      /(UNION\s+SELECT)/i,
      /(DROP\s+TABLE)/i,
      /(DELETE\s+FROM)/i,
      /(INSERT\s+INTO)/i,
      /(UPDATE\s+SET)/i,
      /(ALTER\s+TABLE)/i,
      /(CREATE\s+TABLE)/i,
      /(EXEC\s+\w+)/i,
      /(SCRIPT\s+\w+)/i
    ];
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(input)) {
        errors.push(`Dangerous SQL pattern detected: ${pattern.source}`);
        sanitized = sanitized.replace(pattern, '[FILTERED]');
      }
    }
    
    return { valid: errors.length === 0, sanitized, errors };
  }

  // 🚨 XSS PROTECTION
  static sanitizeHTML(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/&/g, '&amp;');
  }

  // 📧 EMAIL VALIDATION
  static validateEmail(email: string): { valid: boolean; sanitized: string; errors: string[] } {
    const errors: string[] = [];
    let sanitized = email.toLowerCase().trim();
    
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) {
      errors.push('Invalid email format');
    }
    
    // Length check
    if (sanitized.length > 255) {
      errors.push('Email too long');
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(sanitized)) {
        errors.push('Suspicious content in email');
        sanitized = sanitized.replace(pattern, '[FILTERED]');
      }
    }
    
    return { valid: errors.length === 0, sanitized, errors };
  }

  // 🔐 PASSWORD VALIDATION
  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common weak passwords
    const weakPasswords = [
      'password', '123456', 'password123', 'admin', 'qwerty',
      'letmein', 'welcome', 'monkey', 'dragon', 'master',
      '123456789', 'abc123', 'password1', 'admin123'
    ];
    
    if (weakPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common, please choose a stronger password');
    }
    
    return { valid: errors.length === 0, errors };
  }

  // 📝 USERNAME VALIDATION
  static validateUsername(username: string): { valid: boolean; sanitized: string; errors: string[] } {
    const errors: string[] = [];
    let sanitized = username.trim();
    
    if (sanitized.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    if (sanitized.length > 20) {
      errors.push('Username must be less than 20 characters');
    }
    
    // Only allow alphanumeric, hyphens, and underscores
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(sanitized)) {
      errors.push('Username can only contain letters, numbers, hyphens, and underscores');
    }
    
    // Check for reserved usernames
    const reservedUsernames = [
      'admin', 'administrator', 'root', 'system', 'api',
      'www', 'mail', 'ftp', 'support', 'help'
    ];
    
    if (reservedUsernames.includes(sanitized.toLowerCase())) {
      errors.push('Username is reserved');
    }
    
    return { valid: errors.length === 0, sanitized, errors };
  }

  // 📄 FILE UPLOAD VALIDATION
  static validateFileUpload(file: { name: string; type: string; size: number }): { 
    valid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];
    
    // Allowed file types
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'text/csv',
      'application/zip', 'application/x-zip-compressed'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not allowed');
    }
    
    // File size limit (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('File too large (max 10MB)');
    }
    
    // Check for executable extensions
    const executableExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (executableExtensions.includes(fileExtension)) {
      errors.push('Executable files not allowed');
    }
    
    // Check for double extensions (potential malware)
    const doubleExtensions = /\.\w+\.\w+$/;
    if (doubleExtensions.test(file.name.toLowerCase())) {
      errors.push('Files with double extensions not allowed');
    }
    
    return { valid: errors.length === 0, errors };
  }

  // 🌐 URL VALIDATION
  static validateURL(url: string): { valid: boolean; sanitized: string; errors: string[] } {
    const errors: string[] = [];
    let sanitized = url.trim();
    
    try {
      const urlObj = new URL(sanitized);
      
      // Only allow HTTP and HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        errors.push('Only HTTP and HTTPS URLs are allowed');
      }
      
      // Check for suspicious domains
      const suspiciousDomains = [
        'bit.ly', 'tinyurl.com', 'short.link', 't.co'
      ];
      
      if (suspiciousDomains.some(domain => urlObj.hostname.includes(domain))) {
        errors.push('Shortened URLs not allowed');
      }
      
    } catch (error) {
      errors.push('Invalid URL format');
    }
    
    return { valid: errors.length === 0, sanitized, errors };
  }

  // 🔍 COMPREHENSIVE INPUT SANITIZATION
  static sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      // Remove null bytes
      let sanitized = input.replace(/\0/g, '');
      
      // Remove control characters except newlines and tabs
      sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      
      // Trim whitespace
      sanitized = sanitized.trim();
      
      return sanitized;
    }
    
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item));
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const key in input) {
        sanitized[key] = this.sanitizeInput(input[key]);
      }
      return sanitized;
    }
    
    return input;
  }

  // 🚨 SUSPICIOUS PATTERN DETECTION
  static detectSuspiciousPatterns(input: string): { 
    suspicious: boolean; 
    patterns: string[] 
  } {
    const patterns: string[] = [];
    
    const suspiciousPatterns = [
      { pattern: /<script/i, name: 'Script tag' },
      { pattern: /javascript:/i, name: 'JavaScript protocol' },
      { pattern: /vbscript:/i, name: 'VBScript protocol' },
      { pattern: /onload=/i, name: 'Event handler' },
      { pattern: /onerror=/i, name: 'Event handler' },
      { pattern: /eval\(/i, name: 'Eval function' },
      { pattern: /document\.cookie/i, name: 'Cookie access' },
      { pattern: /window\.location/i, name: 'Location access' },
      { pattern: /alert\(/i, name: 'Alert function' },
      { pattern: /\.\.\//, name: 'Directory traversal' },
      { pattern: /union.*select/i, name: 'SQL injection' },
      { pattern: /or\s+1\s*=\s*1/i, name: 'SQL injection' }
    ];
    
    for (const { pattern, name } of suspiciousPatterns) {
      if (pattern.test(input)) {
        patterns.push(name);
      }
    }
    
    return { suspicious: patterns.length > 0, patterns };
  }
}

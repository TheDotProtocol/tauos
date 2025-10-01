export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerify {
  code: string;
  backupCode?: string;
}

export interface SessionData {
  userId: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
  sessionId: string;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginNotifications: boolean;
  suspiciousActivity: boolean;
  allowedIPs: string[];
  blockedIPs: string[];
}

export interface LoginAttempt {
  id: string;
  userId?: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
  timestamp: string;
  location?: {
    country: string;
    city: string;
    region: string;
  };
}

export interface SecurityEvent {
  id: string;
  userId: string;
  type: 'login' | 'logout' | 'password_change' | 'two_factor_enabled' | 'two_factor_disabled' | 'suspicious_activity';
  description: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

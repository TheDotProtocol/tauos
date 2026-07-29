/** Tau IDE production environment validation — run at startup / status checks */

export type EnvValidation = {
  valid: boolean;
  production: boolean;
  errors: string[];
  warnings: string[];
};

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function validateTauIdeEnv(): EnvValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const production = isProduction();

  if (!process.env.DATABASE_URL) {
    if (production) errors.push('DATABASE_URL is required in production');
    else warnings.push('DATABASE_URL not set — cloud sync disabled');
  }

  if (!process.env.JWT_SECRET && !process.env.JWT_SECRET_SSO && !process.env.JWT_SECRET_TAUID) {
    if (production) errors.push('JWT_SECRET (or JWT_SECRET_SSO / JWT_SECRET_TAUID) is required');
    else warnings.push('JWT signing secret not configured');
  }

  if (production) {
    if (!process.env.TAU_IDE_SECRETS_KEY) {
      errors.push('TAU_IDE_SECRETS_KEY is required in production');
    } else if (process.env.TAU_IDE_SECRETS_KEY.length < 32) {
      errors.push('TAU_IDE_SECRETS_KEY must be at least 32 characters');
    }
    if (process.env.TAU_IDE_SECRETS_KEY === 'tau-ide-dev-key-change-in-production') {
      errors.push('TAU_IDE_SECRETS_KEY must not use the development default');
    }
  } else if (!process.env.TAU_IDE_SECRETS_KEY) {
    warnings.push('TAU_IDE_SECRETS_KEY not set — using derived dev key (not for production)');
  }

  const hasAiKey = Boolean(
    process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY ||
    process.env.GEMINI_API_KEY || process.env.OLLAMA_BASE_URL
  );
  if (!hasAiKey) warnings.push('No AI provider keys configured — Architect uses fallback responses');

  return { valid: errors.length === 0, production, errors, warnings };
}

export function assertProductionEnv(): void {
  const v = validateTauIdeEnv();
  if (v.production && !v.valid) {
    throw new Error(`Tau IDE env validation failed: ${v.errors.join('; ')}`);
  }
}

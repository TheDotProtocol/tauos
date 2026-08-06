export type OAuthProviderId = 'google' | 'github';

export type OAuthProviderConfig = {
  id: OAuthProviderId;
  label: string;
  authUrl: string;
  tokenUrl: string;
  userUrl: string;
  scope: string;
  clientId?: string;
  clientSecret?: string;
};

export const OAUTH_PROVIDERS: Record<OAuthProviderId, OAuthProviderConfig> = {
  google: {
    id: 'google',
    label: 'Google',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    scope: 'openid email profile',
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  },
  github: {
    id: 'github',
    label: 'GitHub',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userUrl: 'https://api.github.com/user',
    scope: 'read:user user:email',
    clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
    clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
  },
};

export function getOAuthProvider(id: string): OAuthProviderConfig | null {
  if (id !== 'google' && id !== 'github') return null;
  const provider = OAUTH_PROVIDERS[id];
  if (!provider.clientId || !provider.clientSecret) return null;
  return provider;
}

export function oauthRedirectUri(providerId: OAuthProviderId): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}/api/auth/oauth/${providerId}/callback`;
}

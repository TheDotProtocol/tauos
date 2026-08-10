import { TAUMAIL_API_BASE_URL } from '../config/env';

/** Resolve Tau ID / TauMail avatar paths to a full URL for React Native Image. */
export function resolveAvatarUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = TAUMAIL_API_BASE_URL.replace(/\/$/, '');
  return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`;
}

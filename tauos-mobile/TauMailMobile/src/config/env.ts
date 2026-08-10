/** TauMail Mobile API base URL — set at build time or via .env */
export const TAUMAIL_API_BASE_URL =
  process.env.TAUMAIL_API_BASE_URL?.replace(/\/$/, '') || 'https://www.tauos.org';

/** Helpers for Tau Mail compose / reply / forward navigation */

export function replySubject(subject: string): string {
  const s = subject?.trim() || '';
  return /^re:/i.test(s) ? s : `Re: ${s}`;
}

export function forwardSubject(subject: string): string {
  const s = subject?.trim() || '';
  return /^fwd:/i.test(s) ? s : `Fwd: ${s}`;
}

export function buildQuotedReplyBody(from: string, time: string, body: string): string {
  const quote = (body || '').split('\n').map((line) => `> ${line}`).join('\n');
  return `\n\nOn ${time}, ${from} wrote:\n${quote}`;
}

export function buildForwardBody(from: string, time: string, subject: string, body: string): string {
  return `\n\n---------- Forwarded message ----------\nFrom: ${from}\nDate: ${time}\nSubject: ${subject}\n\n${body || ''}`;
}

export function mailComposeHref(opts: {
  to?: string;
  subject?: string;
  body?: string;
  cc?: string;
}): string {
  const params = new URLSearchParams();
  if (opts.to) params.set('to', opts.to);
  if (opts.cc) params.set('cc', opts.cc);
  if (opts.subject) params.set('subject', opts.subject);
  if (opts.body) params.set('body', opts.body);
  const q = params.toString();
  return q ? `/taumail/compose?${q}` : '/taumail/compose';
}

export function extractEmailAddress(fromField: string): string {
  if (!fromField) return '';
  const match = fromField.match(/<([^>]+)>/);
  if (match) return match[1].trim();
  if (fromField.includes('@')) return fromField.trim();
  return fromField.trim();
}

export function isExternalRecipient(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  return Boolean(domain && domain !== 'tauos.org');
}

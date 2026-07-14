import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import { isProductionDeploy } from '@/lib/db-pool';

export type SendMailInput = {
  from: { email: string; name?: string };
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  inReplyTo?: string;
  references?: string;
};

export type SendMailResult = {
  messageId: string;
  transport: 'smtp' | 'sendgrid' | 'dev';
  accepted?: string[];
  rejected?: string[];
  envelopeFrom?: string;
};

function isExternalAddress(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  return Boolean(domain && domain !== 'tauos.org');
}

function recipientList(to: string | string[]): string[] {
  const raw = Array.isArray(to) ? to : [to];
  return raw.flatMap((r) => String(r).split(',')).map((e) => e.trim()).filter(Boolean);
}

/** Prefer SendGrid for Gmail/external when API key exists — Vultr SMTP lacks DKIM alignment. */
function shouldUseSendGrid(input: SendMailInput): boolean {
  if (!process.env.SENDGRID_API_KEY) return false;
  if (process.env.MAIL_TRANSPORT === 'sendgrid') return true;
  const recipients = recipientList(input.to);
  // External recipients always use SendGrid (DKIM) even when MAIL_TRANSPORT=smtp
  if (recipients.some(isExternalAddress)) return true;
  if (process.env.MAIL_TRANSPORT === 'smtp') return false;
  return false;
}

function usePhoneSmtp(input?: SendMailInput): boolean {
  if (input && shouldUseSendGrid(input)) return false;
  if (process.env.MAIL_TRANSPORT === 'smtp') return true;
  if (process.env.MAIL_TRANSPORT === 'sendgrid') return false;
  if (process.env.PHONE_MAIL_SERVER === 'true') return true;

  // Production Vultr relay — prefer SMTP when fully configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return true;
  }

  return Boolean(process.env.SMTP_HOST && !process.env.SENDGRID_API_KEY);
}

function getSmtpAuthUser(): string | undefined {
  const user = process.env.SMTP_USER?.trim();
  if (!user) return undefined;
  if (user.includes('@')) return user;

  // Postfix saslpasswd2 stores users as user@realm (e.g. taumail-relay@mail.tauos.org)
  const realm = process.env.SMTP_REALM?.trim() || process.env.SMTP_AUTH_DOMAIN?.trim();
  return realm ? `${user}@${realm}` : user;
}

function getSmtpTransport() {
  const host = process.env.SMTP_HOST || process.env.PHONE_SMTP_HOST || '127.0.0.1';
  const port = Number(process.env.SMTP_PORT || process.env.PHONE_SMTP_PORT || 2525);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = getSmtpAuthUser();
  const pass = process.env.SMTP_PASS?.trim();

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    tls: { rejectUnauthorized: false },
  });
}

export async function sendMail(input: SendMailInput): Promise<SendMailResult> {
  const fromHeader = input.from.name
    ? `"${input.from.name}" <${input.from.email}>`
    : input.from.email;

  // Envelope sender must match SMTP-auth domain for relay deliverability (SPF alignment)
  const envelopeFrom =
    process.env.SMTP_ENVELOPE_FROM?.trim() ||
    process.env.MAIL_FROM?.trim() ||
    input.from.email;

  const headers: Record<string, string> = {};
  if (input.inReplyTo) headers['In-Reply-To'] = input.inReplyTo;
  if (input.references) headers['References'] = input.references;

  if (usePhoneSmtp(input)) {
    const transport = getSmtpTransport();
    const info = await transport.sendMail({
      from: fromHeader,
      sender: envelopeFrom !== input.from.email ? envelopeFrom : undefined,
      replyTo: input.replyTo || input.from.email,
      to: input.to,
      cc: input.cc,
      bcc: input.bcc,
      subject: input.subject,
      text: input.text,
      html: input.html,
      headers,
      envelope: {
        from: envelopeFrom,
        to: Array.isArray(input.to) ? input.to : [input.to],
      },
    });

    if (info.rejected?.length) {
      throw new Error(`SMTP rejected recipients: ${info.rejected.join(', ')}`);
    }

    return {
      messageId: info.messageId || `smtp-${Date.now()}`,
      transport: 'smtp',
      accepted: info.accepted,
      rejected: info.rejected,
      envelopeFrom,
    };
  }

  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const [response] = await sgMail.send({
      to: input.to,
      from: { email: input.from.email, name: input.from.name },
      subject: input.subject,
      text: input.text,
      html: input.html || input.text,
      cc: input.cc,
      bcc: input.bcc,
      replyTo: input.replyTo || input.from.email,
      headers: {
        ...(input.inReplyTo ? { 'In-Reply-To': input.inReplyTo } : {}),
        ...(input.references ? { References: input.references } : {}),
      },
    });
    return {
      messageId: response.headers['x-message-id'] || `sg-${Date.now()}`,
      transport: 'sendgrid',
      envelopeFrom: input.from.email,
    };
  }

  if (isProductionDeploy()) {
    throw new Error('Mail service not configured');
  }

  console.warn('[mail-transport] dev mode — email not sent:', {
    from: input.from.email,
    to: input.to,
    subject: input.subject,
  });
  return { messageId: `dev-${Date.now()}`, transport: 'dev' };
}

export async function checkMailServerHealth(): Promise<{
  ok: boolean;
  transport: string;
  host?: string;
  port?: number;
  error?: string;
}> {
  const transport = usePhoneSmtp() ? 'smtp' : process.env.SENDGRID_API_KEY ? 'sendgrid' : 'dev';
  if (transport !== 'smtp') {
    return { ok: transport === 'sendgrid' || !isProductionDeploy(), transport };
  }

  const host = process.env.SMTP_HOST || process.env.PHONE_SMTP_HOST || '127.0.0.1';
  const port = Number(process.env.SMTP_PORT || process.env.PHONE_SMTP_PORT || 2525);

  try {
    const transporter = getSmtpTransport();
    await transporter.verify();
    return { ok: true, transport, host, port };
  } catch (err) {
    return {
      ok: false,
      transport,
      host,
      port,
      error: err instanceof Error ? err.message : 'SMTP verify failed',
    };
  }
}

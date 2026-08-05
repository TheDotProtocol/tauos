import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import { isProductionDeploy } from '@/lib/db-pool';
import { isAllowedMailDomain, parseEmailAddress } from '@/config/mail-domains';

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
  attachments?: Array<{
    filename: string;
    contentType: string;
    content: string;
  }>;
};

export type SendMailResult = {
  messageId: string;
  transport: 'smtp' | 'sendgrid' | 'sendgrid-smtp' | 'dev';
  accepted?: string[];
  rejected?: string[];
  envelopeFrom?: string;
};

function isExternalAddress(email: string): boolean {
  const parsed = parseEmailAddress(email);
  if (!parsed) return true;
  return !isAllowedMailDomain(parsed.domain);
}

function hasExternalRecipients(input: SendMailInput): boolean {
  return recipientList(input.to).some(isExternalAddress);
}

function recipientList(to: string | string[]): string[] {
  const raw = Array.isArray(to) ? to : [to];
  return raw.flatMap((r) => String(r).split(',')).map((e) => e.trim()).filter(Boolean);
}

function usePhoneSmtp(input?: SendMailInput): boolean {
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

function sendGridErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const body = (err as { response?: { body?: { errors?: Array<{ message?: string }> } } }).response?.body;
    const messages = body?.errors?.map((e) => e.message).filter(Boolean);
    if (messages?.length) return messages.join('; ');
  }
  return err instanceof Error ? err.message : 'SendGrid send failed';
}

function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST || process.env.PHONE_SMTP_HOST);
}

function toMailAttachments(input: SendMailInput) {
  return (input.attachments ?? []).map((a) => ({
    filename: a.filename,
    content: Buffer.from(a.content, 'base64'),
    contentType: a.contentType,
  }));
}

function toSendGridAttachments(input: SendMailInput) {
  return (input.attachments ?? []).map((a) => ({
    filename: a.filename,
    type: a.contentType,
    content: a.content,
    disposition: 'attachment' as const,
  }));
}

/** Domains verified in SendGrid. From addresses on other domains relay via tauos.org. */
function getSendGridAuthenticatedDomains(): string[] {
  const raw =
    process.env.SENDGRID_AUTHENTICATED_DOMAINS?.trim() ||
    process.env.SENDGRID_AUTHENTICATED_DOMAIN?.trim() ||
    'tauos.org,taumail.org';
  return raw
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
}

function isSendGridAuthenticatedFrom(email: string): boolean {
  const parsed = parseEmailAddress(email);
  if (!parsed) return false;
  return getSendGridAuthenticatedDomains().includes(parsed.domain);
}

type ResolvedSendGridFrom = {
  fromEmail: string;
  fromName: string;
  replyTo: string;
  /** User's real mailbox when From is relayed through an authenticated domain */
  userEmail?: string;
  relayed: boolean;
};

function resolveSendGridFrom(input: SendMailInput): ResolvedSendGridFrom {
  const userEmail = input.from.email;
  const userName = input.from.name || userEmail.split('@')[0];
  const replyTo = input.replyTo || userEmail;

  if (isSendGridAuthenticatedFrom(userEmail)) {
    return { fromEmail: userEmail, fromName: userName, replyTo, relayed: false };
  }

  const relayEmail =
    process.env.SENDGRID_FROM_EMAIL?.trim() ||
    process.env.MAIL_FROM?.trim() ||
    'noreply@tauos.org';

  return {
    fromEmail: relayEmail,
    fromName: userName,
    replyTo,
    userEmail,
    relayed: true,
  };
}

async function sendViaSmtp(input: SendMailInput): Promise<SendMailResult> {
  const fromHeader = input.from.name
    ? `"${input.from.name}" <${input.from.email}>`
    : input.from.email;

  // User-sent mail: envelope matches From so Gmail shows the sender identity, not a relay noreply.
  const envelopeFrom = input.from.email;

  const headers: Record<string, string> = {};
  if (input.inReplyTo) headers['In-Reply-To'] = input.inReplyTo;
  if (input.references) headers['References'] = input.references;

  const transport = getSmtpTransport();
  const info = await transport.sendMail({
    from: fromHeader,
    replyTo: input.replyTo || input.from.email,
    to: input.to,
    cc: input.cc,
    bcc: input.bcc,
    subject: input.subject,
    text: input.text,
    html: input.html,
    headers,
    attachments: toMailAttachments(input),
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

async function sendViaSendGrid(input: SendMailInput): Promise<SendMailResult> {
  const apiKey = process.env.SENDGRID_API_KEY?.trim();
  if (!apiKey) throw new Error('SendGrid API key not configured');

  sgMail.setApiKey(apiKey);

  const resolved = resolveSendGridFrom(input);

  const [response] = await sgMail.send({
    to: input.to,
    from: { email: resolved.fromEmail, name: resolved.fromName },
    subject: input.subject,
    text: input.text,
    html: input.html || input.text,
    cc: input.cc,
    bcc: input.bcc,
    replyTo: resolved.replyTo,
    attachments: toSendGridAttachments(input),
    headers: {
      ...(input.inReplyTo ? { 'In-Reply-To': input.inReplyTo } : {}),
      ...(input.references ? { References: input.references } : {}),
      ...(resolved.userEmail ? { 'X-Tau-Mail-Sender': resolved.userEmail } : {}),
    },
  });

  return {
    messageId: response.headers['x-message-id'] || `sg-${Date.now()}`,
    transport: 'sendgrid',
    envelopeFrom: resolved.fromEmail,
  };
}

async function sendViaSendGridSmtp(input: SendMailInput): Promise<SendMailResult> {
  const apiKey = process.env.SENDGRID_API_KEY?.trim();
  if (!apiKey) throw new Error('SendGrid API key not configured');

  const resolved = resolveSendGridFrom(input);
  const fromHeader = resolved.fromName
    ? `"${resolved.fromName}" <${resolved.fromEmail}>`
    : resolved.fromEmail;

  const headers: Record<string, string> = {};
  if (input.inReplyTo) headers['In-Reply-To'] = input.inReplyTo;
  if (input.references) headers['References'] = input.references;
  if (resolved.userEmail) headers['X-Tau-Mail-Sender'] = resolved.userEmail;

  const transport = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: { user: 'apikey', pass: apiKey },
  });

  const info = await transport.sendMail({
    from: fromHeader,
    replyTo: resolved.replyTo,
    to: input.to,
    cc: input.cc,
    bcc: input.bcc,
    subject: input.subject,
    text: input.text,
    html: input.html,
    headers,
    attachments: toMailAttachments(input),
  });

  if (info.rejected?.length) {
    throw new Error(`SendGrid SMTP rejected recipients: ${info.rejected.join(', ')}`);
  }

  return {
    messageId: info.messageId || `sg-smtp-${Date.now()}`,
    transport: 'sendgrid-smtp',
    accepted: info.accepted,
    rejected: info.rejected,
    envelopeFrom: resolved.fromEmail,
  };
}

async function deliverExternalMail(input: SendMailInput): Promise<SendMailResult> {
  const apiKey = process.env.SENDGRID_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      'External delivery requires SENDGRID_API_KEY. The Vultr mail server cannot reach Gmail (outbound port 25 is blocked).',
    );
  }

  try {
    return await sendViaSendGrid(input);
  } catch (err) {
    const sgError = sendGridErrorMessage(err);
    console.error('[mail-transport] SendGrid API failed:', sgError);
    try {
      return await sendViaSendGridSmtp(input);
    } catch (smtpErr) {
      const relayError = smtpErr instanceof Error ? smtpErr.message : 'SendGrid SMTP failed';
      throw new Error(`SendGrid delivery failed: ${sgError}. SMTP relay: ${relayError}`);
    }
  }
}

export async function sendMail(input: SendMailInput): Promise<SendMailResult> {
  const external = hasExternalRecipients(input);

  if (external) {
    return deliverExternalMail(input);
  }

  if (usePhoneSmtp(input)) {
    return sendViaSmtp(input);
  }

  if (process.env.SENDGRID_API_KEY) {
    return sendViaSendGrid(input);
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

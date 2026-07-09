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
};

export type SendMailResult = {
  messageId: string;
  transport: 'smtp' | 'sendgrid' | 'dev';
};

function usePhoneSmtp(): boolean {
  return (
    process.env.MAIL_TRANSPORT === 'smtp' ||
    process.env.PHONE_MAIL_SERVER === 'true' ||
    Boolean(process.env.SMTP_HOST && !process.env.SENDGRID_API_KEY)
  );
}

function getSmtpTransport() {
  const host = process.env.SMTP_HOST || process.env.PHONE_SMTP_HOST || '127.0.0.1';
  const port = Number(process.env.SMTP_PORT || process.env.PHONE_SMTP_PORT || 2525);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

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

  if (usePhoneSmtp()) {
    const transport = getSmtpTransport();
    const info = await transport.sendMail({
      from: fromHeader,
      to: input.to,
      cc: input.cc,
      bcc: input.bcc,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    return { messageId: info.messageId || `smtp-${Date.now()}`, transport: 'smtp' };
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
    });
    return {
      messageId: response.headers['x-message-id'] || `sg-${Date.now()}`,
      transport: 'sendgrid',
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

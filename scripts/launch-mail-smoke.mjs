#!/usr/bin/env node
/**
 * Production mail smoke — outbound send via Tau Mail API.
 * Usage: npm run mail:smoke -- --base=https://www.tauos.org --to=you@gmail.com
 *
 * Requires env or flags: --email --password for a @tauos.org account,
 * or set MAIL_SMOKE_EMAIL / MAIL_SMOKE_PASSWORD in .env.local
 */
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { randomBytes } from 'crypto';

for (const f of ['.env.local', '.env']) {
  if (existsSync(f)) dotenv.config({ path: f });
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

const base = args.base || process.env.E2E_BASE_URL || 'https://www.tauos.org';
const to = args.to || process.env.MAIL_SMOKE_TO;
const email = args.email || process.env.MAIL_SMOKE_EMAIL;
const password = args.password || process.env.MAIL_SMOKE_PASSWORD;

async function json(path, opts = {}) {
  const res = await fetch(`${base}${path}`, opts);
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

async function main() {
  console.log(`\nMail smoke — ${base}\n`);

  const status = await json('/api/platform/status');
  const mailCheck = status.body?.checks?.mail;
  console.log('Platform mail check:', mailCheck);
  if (!mailCheck?.ok) {
    console.error('Mail transport not healthy on production');
    process.exit(1);
  }

  let token = args.token;
  let fromEmail = email;

  if (!token) {
    if (!email || !password) {
      console.log('No credentials — registering ephemeral smoke user...');
      const suffix = randomBytes(3).toString('hex');
      fromEmail = `mail-smoke-${suffix}@tauos.org`;
      const reg = await json('/api/taumail/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: `mailsmoke${suffix}`,
          email: fromEmail,
          password: 'MailSmokeTest123!',
          fullName: 'Mail Smoke Test',
        }),
      });
      if (!reg.ok) {
        console.error('Register failed:', reg.status, reg.body);
        process.exit(1);
      }
      token = reg.body.token;
    } else {
      const login = await json('/api/taumail/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!login.ok) {
        console.error('Login failed:', login.status, login.body);
        process.exit(1);
      }
      token = login.body.token;
      fromEmail = email;
    }
  }

  const recipient = to || fromEmail;
  const subject = `TAU CORE Mail smoke ${new Date().toISOString()}`;
  const body = 'Public Beta launch smoke test — if you receive this, outbound mail works.';

  const send = await json('/api/taumail/emails/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to: recipient, subject, body }),
  });

  if (!send.ok) {
    console.error('Send failed:', send.status, send.body);
    process.exit(1);
  }

  console.log('✓ Outbound send OK');
  console.log('  From:', send.body.from || fromEmail);
  console.log('  To:', recipient);
  console.log('  Transport:', send.body.transport);
  console.log('  MessageId:', send.body.messageId);
  console.log('\nInbound: send a reply to', fromEmail, 'and check /taumail/inbox\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

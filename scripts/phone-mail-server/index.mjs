#!/usr/bin/env node
/**
 * Tau Mail — phone / local SMTP node
 * Receives mail for 5 hosted domains and forwards to the Next.js inbound API.
 * Also relays outbound mail from the app back into local inboxes when the
 * recipient is on a hosted domain.
 */
import dotenv from 'dotenv';
import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';

dotenv.config({ path: '.env.local' });
dotenv.config();

const HOSTED_DOMAINS = [
  'tauos.org',
  'taumail.org',
  'thearholdings.group',
  'estayshotels.com',
  'globaldotbank.com',
  'onenumbr.com',
  'kibouor.com',
  'tauphones.com',
  'easaanfoundation.com',
  'projectgrayscale.com',
  'thedotprotocol.com',
  'asktrabaajo.com',
];

const LISTEN_HOST = process.env.PHONE_SMTP_LISTEN_HOST || '0.0.0.0';
const LISTEN_PORT = Number(process.env.PHONE_SMTP_PORT || process.env.SMTP_PORT || 2525);
const NEXT_APP_URL = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
const INBOUND_URL = `${NEXT_APP_URL}/api/taumail/smtp/incoming`;

function extractAddresses(addressField) {
  if (!addressField) return [];
  const list = Array.isArray(addressField) ? addressField : [addressField];
  return list
    .flatMap((entry) => entry?.value || [])
    .map((v) => v.address?.toLowerCase())
    .filter(Boolean);
}

function domainOf(email) {
  return email.split('@')[1]?.toLowerCase();
}

async function deliverToApp({ to, from, subject, text, html }) {
  const res = await fetch(INBOUND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to,
      from,
      subject,
      text: text || '',
      html: html || text || '',
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `Inbound API ${res.status}`);
  }
  return body;
}

const server = new SMTPServer({
  authOptional: true,
  disabledCommands: ['AUTH'],
  size: 10 * 1024 * 1024,
  banner: 'Tau Mail Phone Node — TAU CORE',

  onRcptTo(address, session, callback) {
    const domain = domainOf(address.address.toLowerCase());
    if (HOSTED_DOMAINS.includes(domain)) {
      return callback();
    }
    // Allow relay from local app (no auth in dev)
    if (session.envelope.mailFrom?.address) {
      return callback();
    }
    return callback(new Error(`550 Domain not hosted: ${domain}`));
  },

  onData(stream, session, callback) {
    simpleParser(stream)
      .then(async (parsed) => {
        const from =
          parsed.from?.value?.[0]?.address ||
          session.envelope.mailFrom?.address ||
          'unknown@localhost';
        const subject = parsed.subject || '(no subject)';
        const text = parsed.text || '';
        const html = parsed.html || '';
        const recipients = [
          ...extractAddresses(parsed.to),
          ...extractAddresses(parsed.cc),
          ...extractAddresses(parsed.bcc),
          ...(session.envelope.rcptTo || []).map((r) => r.address.toLowerCase()),
        ];
        const unique = [...new Set(recipients)];

        const localRecipients = unique.filter((addr) =>
          HOSTED_DOMAINS.includes(domainOf(addr))
        );

        if (localRecipients.length === 0) {
          console.log(`📤 External relay (dev log only): ${from} -> ${unique.join(', ')}`);
          console.log(`   Subject: ${subject}`);
          return callback();
        }

        for (const to of localRecipients) {
          const result = await deliverToApp({ to, from, subject, text, html });
          console.log(`✅ Delivered ${from} -> ${to} (id: ${result.emailId})`);
        }
        callback();
      })
      .catch((err) => {
        console.error('Parse/deliver error:', err.message);
        callback(err);
      });
  },
});

server.on('error', (err) => {
  console.error('SMTP server error:', err);
});

server.listen(LISTEN_PORT, LISTEN_HOST, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  Tau Mail Phone Node — TAU CORE™                     ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log(`  Listening:  ${LISTEN_HOST}:${LISTEN_PORT}`);
  console.log(`  Inbound API: ${INBOUND_URL}`);
  console.log(`  Domains (${HOSTED_DOMAINS.length}):`);
  HOSTED_DOMAINS.forEach((d) => console.log(`    • @${d}`));
  console.log('');
});

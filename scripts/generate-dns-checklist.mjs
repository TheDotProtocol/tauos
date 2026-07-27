#!/usr/bin/env node
/**
 * Print DNS records for Squarespace / any registrar.
 * Usage: VULTR_MAIL_IP=149.28.156.7 npm run mail:dns-checklist
 */
import { MAIL_ORGANIZATIONS } from './mail-domains-data.mjs';

const mailIp = process.env.VULTR_MAIL_IP || process.env.MAIL_SERVER_IP || '149.28.156.7';

console.log(`# Tau Mail DNS — 12 domains (Squarespace)`);
console.log(`# Mail server IP: ${mailIp}`);
console.log(`# Generated ${new Date().toISOString()}\n`);
console.log('## Vultr (once)');
console.log(`Reverse DNS (PTR) for ${mailIp} → mail.tauos.org\n`);

for (const d of MAIL_ORGANIZATIONS) {
  const host = d.mxHost.replace(`.${d.domain}`, '') || 'mail';
  console.log(`--- ${d.label} (@${d.domain}) ---`);
  console.log(`Host: mail     Type: A      → ${mailIp}`);
  console.log(`Host: @         Type: MX     → ${d.mxHost}  Priority 10`);
  console.log(`Host: @         Type: TXT    → v=spf1 ip4:${mailIp} include:sendgrid.net ~all`);
  console.log(`Host: _dmarc    Type: TXT    → v=DMARC1; p=none; rua=mailto:dmarc@${d.domain}`);
  console.log(`Host: default._domainkey  Type: TXT → (DKIM from VPS OpenDKIM — add after server setup)`);
  console.log('');
}

console.log('## Verify');
console.log('dig MX tauos.org +short');
console.log('dig A mail.tauos.org +short\n');

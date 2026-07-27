/** Production Tau Mail hosted domains (Vultr Postfix edge). */
export const MAIL_DOMAINS = [
  {
    domain: 'tauos.org',
    label: 'Tau OS',
    organization: 'Tau Core Inc.',
    mxHost: 'mail.tauos.org',
    comingSoon: false,
  },
  {
    domain: 'taumail.org',
    label: 'Tau Mail',
    organization: 'Tau Mail',
    mxHost: 'mail.taumail.org',
    comingSoon: false,
  },
  {
    domain: 'thearholdings.group',
    label: 'AR Holdings',
    organization: 'AR Holdings Group Corporation',
    mxHost: 'mail.thearholdings.group',
    comingSoon: false,
  },
  {
    domain: 'estayshotels.com',
    label: 'eStays Hotels',
    organization: 'eStays Hotels',
    mxHost: 'mail.estayshotels.com',
    comingSoon: false,
  },
  {
    domain: 'globaldotbank.com',
    label: 'Global Dot Bank',
    organization: 'Global Dot Bank',
    mxHost: 'mail.globaldotbank.com',
    comingSoon: false,
  },
  {
    domain: 'onenumbr.com',
    label: 'One Numbr',
    organization: 'One Numbr',
    mxHost: 'mail.onenumbr.com',
    comingSoon: false,
  },
  {
    domain: 'kibouor.com',
    label: 'Kibouor',
    organization: 'Kibouor',
    mxHost: 'mail.kibouor.com',
    comingSoon: false,
  },
  {
    domain: 'tauphones.com',
    label: 'Tau Phones',
    organization: 'Tau Phones LLC',
    mxHost: 'mail.tauphones.com',
    comingSoon: false,
  },
  {
    domain: 'easaanfoundation.com',
    label: 'Easaan Foundation',
    organization: 'Easaan Foundation',
    mxHost: 'mail.easaanfoundation.com',
    comingSoon: false,
  },
  {
    domain: 'projectgrayscale.com',
    label: 'Project Grayscale',
    organization: 'Project Grayscale',
    mxHost: 'mail.projectgrayscale.com',
    comingSoon: false,
  },
  {
    domain: 'thedotprotocol.com',
    label: 'The Dot Protocol',
    organization: 'The Dot Protocol',
    mxHost: 'mail.thedotprotocol.com',
    comingSoon: false,
  },
  {
    domain: 'asktrabaajo.com',
    label: 'AskTrabaajo',
    organization: 'AskTrabaajo',
    mxHost: 'mail.asktrabaajo.com',
    comingSoon: false,
  },
] as const;

export type MailDomain = (typeof MAIL_DOMAINS)[number]['domain'];

export const DEFAULT_MAIL_DOMAIN: MailDomain = 'tauos.org';

/** ~5 mailboxes per domain × 12 domains */
export const PLANNED_MAILBOXES_PER_DOMAIN = 5;

export function isAllowedMailDomain(domain: string): domain is MailDomain {
  return MAIL_DOMAINS.some((d) => d.domain === domain.toLowerCase());
}

export function isRegisterableMailDomain(domain: string): boolean {
  const config = getDomainConfig(domain);
  return Boolean(config && !config.comingSoon);
}

export function parseEmailAddress(email: string): { local: string; domain: string } | null {
  const match = email.toLowerCase().trim().match(/^([^@\s]+)@([^@\s]+)$/);
  if (!match) return null;
  return { local: match[1], domain: match[2] };
}

export function getDomainConfig(domain: string) {
  return MAIL_DOMAINS.find((d) => d.domain === domain.toLowerCase());
}

export function getAllMxHosts(): string[] {
  return Array.from(new Set(MAIL_DOMAINS.map((d) => d.mxHost)));
}

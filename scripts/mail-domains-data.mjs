/** Shared mail domain list for setup, DNS checklist, and docs. */
export const MAIL_ORGANIZATIONS = [
  { name: 'Tau Core Inc.', domain: 'tauos.org', label: 'Tau OS', mxHost: 'mail.tauos.org' },
  { name: 'Tau Mail', domain: 'taumail.org', label: 'Tau Mail', mxHost: 'mail.taumail.org' },
  { name: 'AR Holdings Group Corporation', domain: 'thearholdings.group', label: 'AR Holdings', mxHost: 'mail.thearholdings.group' },
  { name: 'eStays Hotels', domain: 'estayshotels.com', label: 'eStays Hotels', mxHost: 'mail.estayshotels.com' },
  { name: 'Global Dot Bank', domain: 'globaldotbank.com', label: 'Global Dot Bank', mxHost: 'mail.globaldotbank.com' },
  { name: 'One Numbr', domain: 'onenumbr.com', label: 'One Numbr', mxHost: 'mail.onenumbr.com' },
  { name: 'Kibouor', domain: 'kibouor.com', label: 'Kibouor', mxHost: 'mail.kibouor.com' },
  { name: 'Tau Phones LLC', domain: 'tauphones.com', label: 'Tau Phones', mxHost: 'mail.tauphones.com' },
  { name: 'Easaan Foundation', domain: 'easaanfoundation.com', label: 'Easaan Foundation', mxHost: 'mail.easaanfoundation.com' },
  { name: 'Project Grayscale', domain: 'projectgrayscale.com', label: 'Project Grayscale', mxHost: 'mail.projectgrayscale.com' },
  { name: 'The Dot Protocol', domain: 'thedotprotocol.com', label: 'The Dot Protocol', mxHost: 'mail.thedotprotocol.com' },
  { name: 'AskTrabaajo', domain: 'asktrabaajo.com', label: 'AskTrabaajo', mxHost: 'mail.asktrabaajo.com' },
];

export const MAIL_DOMAIN_NAMES = MAIL_ORGANIZATIONS.map((o) => o.domain);

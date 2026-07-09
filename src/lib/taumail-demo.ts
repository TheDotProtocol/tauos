export const DEMO_TOKEN = 'tauos-demo-local-preview';

export const DEMO_CREDENTIALS = {
  email: 'demo@tauos.org',
  password: 'demo-preview',
} as const;

export type DemoUser = {
  id: number;
  username: string;
  email: string;
  fullName: string;
  domain: string;
};

export type DemoInboxEmail = {
  id: number;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread: boolean;
  starred: boolean;
  label?: string;
};

export type DemoSentEmail = {
  id: number;
  recipient_email: string;
  subject: string;
  body: string;
  sent_at: string;
};

export const DEMO_USER: DemoUser = {
  id: 9001,
  username: 'demo',
  email: 'demo@tauos.org',
  fullName: 'Tau Core Demo',
  domain: 'tauos.org',
};

export const DEMO_INBOX: DemoInboxEmail[] = [
  {
    id: 1,
    from: 'Tau Core Inc.',
    fromEmail: 'welcome@tauos.org',
    subject: 'Welcome to Tau Mail on TAU CORE™',
    preview: 'Your privacy-native inbox is ready. End-to-end encryption, zero tracking, and full control over your data.',
    body: `Hello Tau Core Demo,

Welcome to Tau Mail — the privacy-native email experience built on TAU CORE™.

Your @tauos.org address is active. Here is what you get out of the box:

• End-to-end encryption for every message
• Zero telemetry and zero ad tracking
• Multi-domain support across Tau Core properties
• Open IMAP/SMTP compatibility

Explore your inbox, compose a message, and review the dashboard metrics — this is a local preview with sample data.

— Tau Core Inc.`,
    time: 'Today, 9:12 AM',
    unread: true,
    starred: true,
    label: 'Important',
  },
  {
    id: 2,
    from: 'AR Holdings Group',
    fromEmail: 'partnerships@thearholdings.group',
    subject: 'Enterprise mail onboarding — @thearholdings.group',
    preview: 'We have provisioned your corporate mailbox on the Tau Mail node. Review the domain settings when ready.',
    body: `Hi Demo,

Your enterprise mailbox namespace @thearholdings.group is configured on the Tau Mail phone node.

Next steps for production:
1. Confirm MX records for mail.thearholdings.group
2. Assign mailboxes to your team
3. Enable MDM policy for mobile clients

This preview shows how cross-domain mail appears in your unified inbox.

— AR Holdings Group Corporation`,
    time: 'Today, 8:40 AM',
    unread: true,
    starred: false,
  },
  {
    id: 3,
    from: 'The Dot Protocol',
    fromEmail: 'team@thedotprotocol.com',
    subject: 'Protocol update — secure relay active',
    preview: 'The Dot Protocol mail relay is online. Inbound and outbound routes are verified on the local node.',
    body: `Demo,

The Dot Protocol domain (@thedotprotocol.com) is connected to the Tau Mail relay.

Status:
• Inbound webhook: active
• Outbound SMTP: phone node @ 127.0.0.1:2525
• Spam filter: Rspamd (production)

Reply to this thread to test compose flow in preview mode.

— The Dot Protocol Team`,
    time: 'Yesterday, 4:18 PM',
    unread: false,
    starred: false,
  },
  {
    id: 4,
    from: 'Tau Mail',
    fromEmail: 'noreply@taumail.org',
    subject: 'Security digest — no suspicious logins',
    preview: 'Your weekly security summary: 0 failed logins, encryption keys healthy, privacy score 98/100.',
    body: `Weekly Security Digest

Account: demo@tauos.org
Privacy score: 98/100
Failed login attempts: 0
Active sessions: 1 (this device)

All systems nominal. Tau Mail never scans message content for ads or analytics.

— Tau Mail Security`,
    time: 'Yesterday, 11:00 AM',
    unread: false,
    starred: false,
  },
  {
    id: 5,
    from: 'Tau Core Foundation',
    fromEmail: 'foundation@taucore.org',
    subject: 'Coming soon — @taucore.org mailboxes',
    preview: 'We are preparing taucore.org domain mail. Registration will open once DNS is live.',
    body: `Hello,

The @taucore.org domain is reserved for Tau Core Foundation mail but is not yet publicly available.

You will receive another notice when registration opens. No action needed for now.

— Tau Core Foundation`,
    time: 'Mon, Jun 12',
    unread: false,
    starred: false,
  },
];

export const DEMO_SENT: DemoSentEmail[] = [
  {
    id: 101,
    recipient_email: 'team@thedotprotocol.com',
    subject: 'Re: Protocol update — secure relay active',
    body: 'Thanks for the update. The local preview inbox looks great — ready for the UI overhaul next.',
    sent_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 102,
    recipient_email: 'partnerships@thearholdings.group',
    subject: 'Tau Mail multi-domain preview',
    body: 'Sharing a preview of the unified Tau Mail UI across all hosted domains. Feedback welcome.',
    sent_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const DEMO_DRAFTS = [
  {
    id: 201,
    to: 'welcome@tauos.org',
    subject: 'UI overhaul notes',
    body: 'Draft: outline navigation, reading pane, and compose toolbar improvements...',
    updated_at: new Date().toISOString(),
  },
];

export const DEMO_SPAM = [
  {
    id: 301,
    from: 'prize-winner@fake-deals.net',
    subject: 'You have won!!!',
    preview: 'Click here to claim your prize immediately...',
    time: 'Jun 10',
    unread: false,
    starred: false,
  },
];

export const DEMO_TRASH = [
  {
    id: 401,
    from: 'old-newsletter@marketing.io',
    subject: 'Unsubscribe confirmation',
    preview: 'You have been removed from our mailing list.',
    time: 'Jun 8',
    deleted_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

export function isDemoModeEnabled(): boolean {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_TAUMAIL_DEMO === 'true'
  );
}

export function isDemoSession(token: string | null): boolean {
  return token === DEMO_TOKEN;
}

export function isDemoLogin(email: string, password: string): boolean {
  return (
    isDemoModeEnabled() &&
    email.toLowerCase().trim() === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  );
}

export function startDemoSession(): void {
  localStorage.setItem('tauos_user', JSON.stringify({
    id: DEMO_USER.id,
    username: DEMO_USER.username,
    email: DEMO_USER.email,
    fullName: DEMO_USER.fullName,
  }));
  localStorage.setItem('tauos_token', DEMO_TOKEN);
  localStorage.setItem('tauos_demo_mode', 'true');
}

export function clearDemoSession(): void {
  localStorage.removeItem('tauos_user');
  localStorage.removeItem('tauos_token');
  localStorage.removeItem('tauos_demo_mode');
}

export function getDemoInbox(): DemoInboxEmail[] {
  return DEMO_INBOX.map((e) => ({ ...e }));
}

export function getDemoSent(): DemoSentEmail[] {
  return DEMO_SENT.map((e) => ({ ...e }));
}

export function getDemoDrafts() {
  return DEMO_DRAFTS.map((e) => ({ ...e }));
}

export function getDemoSpam() {
  return DEMO_SPAM.map((e) => ({ ...e }));
}

export function getDemoTrash() {
  return DEMO_TRASH.map((e) => ({ ...e }));
}

export function mapDemoInboxForList() {
  return getDemoInbox().map((email) => ({
    id: email.id,
    from: email.from,
    subject: email.subject,
    preview: email.preview,
    time: email.time,
    unread: email.unread,
    starred: email.starred,
    body: email.body,
    from_email: email.fromEmail,
  }));
}

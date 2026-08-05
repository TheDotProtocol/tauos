import { productHref } from './product-routes';

export type ProductPageContent = {
  slug: string;
  name: string;
  tagline: string;
  heroSubtext: string;
  problem: { title: string; body: string };
  solution: { title: string; body: string };
  benefits: { title: string; description: string }[];
  features: string[];
  privacy: { title: string; body: string };
  faq: { q: string; a: string }[];
  download?: { label: string; href: string };
  cta: { primary: string; secondary?: string };
};

const template = (
  slug: string,
  name: string,
  tagline: string,
  extras: Partial<ProductPageContent> = {}
): ProductPageContent => ({
  slug,
  name,
  tagline,
  heroSubtext: extras.heroSubtext ?? `Part of the Tau platform. One identity. Built for privacy.`,
  problem: extras.problem ?? {
    title: 'The world wasn\'t built for you',
    body: 'Most tools were designed to harvest attention, sell ads, or lock you in. Tau exists because people deserve technology that respects them.',
  },
  solution: extras.solution ?? {
    title: `Meet ${name}`,
    body: `${name} is designed as a calm, premium experience inside the Tau ecosystem — connected to your Tau ID, protected by default, and built to last.`,
  },
  benefits: extras.benefits ?? [
    { title: 'One Identity', description: 'Sign in once with Tau ID across the platform.' },
    { title: 'Privacy First', description: 'Your data is yours. Telemetry is minimal by design.' },
    { title: 'Beautiful & Calm', description: 'Interfaces that feel intentional, not overwhelming.' },
  ],
  features: extras.features ?? [
    'Works across Tau Core and Tau Phone',
    'Encrypted where it matters',
    'No ads. No data mining.',
    'Designed for real people',
  ],
  privacy: extras.privacy ?? {
    title: 'Privacy is not an upgrade',
    body: 'Tau products are built with transparency, user choice, and security by design. We explain what we collect — and default to collecting less.',
  },
  faq: extras.faq ?? [
    { q: 'Is this available today?', a: 'Many Tau products are in public beta. Check the Download Center for what you can try now.' },
    { q: 'Do I need Tau ID?', a: 'Yes. One Tau identity connects every product in the ecosystem.' },
  ],
  download: extras.download,
  cta: extras.cta ?? { primary: 'Join Tau', secondary: 'Download' },
});

export const txpProducts: Record<string, ProductPageContent> = {
  'tau-core': template('tau-core', 'Tau Core OS', 'The operating system for human dignity.', {
    heroSubtext: 'Communication, productivity, AI, privacy, and security — unified.',
    problem: {
      title: 'Computing became fragmented',
      body: 'Too many apps. Too many accounts. Too many companies watching. Tau Core brings it back together.',
    },
    solution: {
      title: 'One platform. Your rules.',
      body: 'Tau Core is the foundation — an OS and ecosystem designed for people who want power without surrendering privacy.',
    },
    features: ['Privacy dashboard', 'On-device AI', 'Unified Tau apps', 'Open standards', 'No telemetry by default'],
    download: { label: 'Download Preview', href: '/downloads' },
  }),
  'tau-phone': template('tau-phone', 'Tau Phone', 'Your phone. Your rules.', {
    heroSubtext: 'Hardware and software designed together for privacy.',
    benefits: [
      { title: 'Kill Switch Ready', description: 'Hardware controls for camera, mic, and radios.' },
      { title: 'Tau OS Native', description: 'Not Android with a skin — a platform.' },
      { title: 'Premium Materials', description: 'Titanium aesthetic. Timeless design.' },
    ],
    download: { label: 'Join Waitlist', href: '/contact' },
  }),
  'tau-talk': template('tau-talk', 'Tau Talk', 'Message without being the product.', {
    heroSubtext: 'End-to-end encrypted messaging. Public beta on Android.',
    problem: {
      title: 'Messaging became surveillance',
      body: 'Free apps cost your privacy. Tau Talk is encrypted messaging tied to your @username — no phone number required.',
    },
    solution: {
      title: 'Talk with trust',
      body: 'Register with email OTP. Share photos, files, and locations on OpenStreetMap. Voice and video with Tau WebRTC.',
    },
    features: ['E2E encrypted messages', 'Email OTP signup', 'Attachments & location', 'Voice & video calls', 'Live photo during calls'],
    download: { label: 'Download Android Beta', href: '/downloads/TauTalk-1.0.0-beta.apk' },
    faq: [
      { q: 'Is Tau Talk on iPhone?', a: 'Use browser chat at /tautalk/chat until native iOS ships.' },
      { q: 'Do I need a phone number?', a: 'No. Register with Gmail or any email you own.' },
    ],
  }),
  'tau-mail': template('tau-mail', 'Tau Mail', 'Email that respects you.', {
    download: { label: 'Open Tau Mail', href: '/taumail' },
  }),
  'tau-cloud': template('tau-cloud', 'Tau Cloud', 'Your files. Your keys.', {
    download: { label: 'Open Tau Cloud', href: '/taucloud' },
  }),
  'tau-ai': template('tau-ai', 'Tau AI', 'A mentor. Not another chatbot.', {
    heroSubtext: 'Helps you understand. Never judges. Always explains.',
    problem: {
      title: 'AI became opaque',
      body: 'Black boxes that hallucinate confidence. Tau AI is built to reason with you — honestly.',
    },
    solution: {
      title: 'Intelligence with integrity',
      body: 'On-device where possible. Transparent when cloud-assisted. A collaborator, not a replacement for thinking.',
    },
    benefits: [
      { title: 'Teacher', description: 'Explains concepts at your pace.' },
      { title: 'Collaborator', description: 'Works with your documents and projects.' },
      { title: 'Honest', description: 'Says when it does not know.' },
    ],
  }),
  'tau-browser': template('tau-browser', 'Tau Browser', 'Browse without being tracked.', {
    download: { label: 'Open Tau Browser', href: '/taubrowser' },
  }),
  'tau-drive': template('tau-drive', 'Tau Drive', 'Sync without surrender.', {}),
  'tau-shield': template('tau-shield', 'Tau Shield', 'Security by design.', {
    features: ['Threat monitoring', 'App permissions', 'Network controls', 'Family safety tools'],
  }),
  'tau-pay': template('tau-pay', 'Tau Pay', 'Payments without surveillance.', {}),
  'tau-id': template('tau-id', 'Tau ID', 'One identity. Infinite possibilities.', {
    download: { label: 'Create Tau ID', href: '/tauid/register' },
  }),
  'tau-business-os': template('tau-business-os', 'Tau Business OS', 'Run your business anywhere.', {
    heroSubtext: 'Windows. macOS. Linux. Android. iPhone. Tau Phone. One secure experience.',
    features: ['Cross-platform', 'Unified admin', 'Role-based access', 'Business apps suite'],
  }),
  'project-grayscale': template('project-grayscale', 'Project Grayscale', 'Mission control for organizations.', {
    heroSubtext: 'Business intelligence, research, cybersecurity, planning, and AI executive support.',
    benefits: [
      { title: 'Mission Control', description: 'One workspace for decisions.' },
      { title: 'AI Executive Board', description: 'Structured reasoning for leaders.' },
      { title: 'Analytics', description: 'See what matters, not noise.' },
    ],
  }),
  'tau-developer': template('tau-developer', 'Tau Developer Console', 'Start with an idea. End with a product.', {
    heroSubtext: 'AI-assisted development, integrated design system, deployment, and security.',
    download: { label: 'Developer Hub', href: '/developers' },
  }),
  asktrabaajo: template('asktrabaajo', 'AskTrabaajo', 'Work intelligence for modern teams.', {}),
  'global-dot-bank': template('global-dot-bank', 'Global Dot Bank', 'Banking reimagined for the Tau era.', {}),
  onenumbr: template('onenumbr', 'OneNumbr', 'Unified communications for everyone.', {}),
  'tau-market': template('tau-market', 'Tau Market', 'Apps built for the Tau ecosystem.', {
    download: { label: 'Tau Store', href: '/taustore' },
  }),
};

export const productSlugs = Object.keys(txpProducts);

export const ecosystemNodes = [
  { id: 'talk', label: 'Tau Talk', href: productHref('tau-talk') },
  { id: 'mail', label: 'Tau Mail', href: productHref('tau-mail') },
  { id: 'cloud', label: 'Tau Cloud', href: productHref('tau-cloud') },
  { id: 'ai', label: 'Tau AI', href: productHref('tau-ai') },
  { id: 'phone', label: 'Tau Phone', href: productHref('tau-phone') },
  { id: 'browser', label: 'Tau Browser', href: productHref('tau-browser') },
  { id: 'shield', label: 'Tau Shield', href: productHref('tau-shield') },
  { id: 'developer', label: 'Tau Developer', href: productHref('tau-developer') },
  { id: 'grayscale', label: 'Project Grayscale', href: productHref('project-grayscale') },
  { id: 'bank', label: 'Global Dot Bank', href: productHref('global-dot-bank') },
  { id: 'ask', label: 'AskTrabaajo', href: productHref('asktrabaajo') },
  { id: 'onenumbr', label: 'OneNumbr', href: productHref('onenumbr') },
];

export const builtForAudiences = [
  { title: 'Creators', story: 'Build your audience without feeding an algorithm your soul. Tau gives you tools that stay out of your way.' },
  { title: 'Students', story: 'Learn deeply with AI that explains — not AI that writes essays for you to turn in blindly.' },
  { title: 'Families', story: 'Share photos, messages, and calendars with privacy defaults that protect the people you love.' },
  { title: 'Developers', story: 'One design system, one identity layer, one deployment story. Ship faster without compromising ethics.' },
  { title: 'Businesses', story: 'Run operations on a platform you control — not a stack of SaaS bills and vendor lock-in.' },
  { title: 'Enterprises', story: 'Compliance, security, and scale — without treating employees like data points.' },
];

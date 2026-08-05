/**
 * TXP V1 — Homepage story chapters
 * Human copy. Keynote rhythm. One voice.
 */

export const txpStory = {
  hero: {
    eyebrow: 'Welcome to Tau',
    headline: 'Join Tau.',
    headlineAccent: 'Build Your World.',
    body: 'Your phone, your mail, your files, your conversations — connected by one identity you actually own. No tracking. No lock-in. Just tools that work together, quietly, for you.',
    ctaPrimary: 'Join Tau',
    ctaSecondary: 'Download',
    ctaTertiary: 'Explore the ecosystem',
  },

  why: {
    eyebrow: 'Chapter Two',
    title: 'Why Tau Exists',
    subtitle:
      'Most of us live inside a dozen apps, a dozen passwords, and a dozen companies that know more about us than we’re comfortable admitting. Tau started with a simpler question: what if it didn’t have to be this way?',
    pillars: [
      {
        title: 'One Identity',
        body: 'Sign in once. Show up everywhere. Your name, your keys, your preferences — yours alone.',
      },
      {
        title: 'One Platform',
        body: 'Talk, mail, cloud, browser, and AI that share the same respect for your privacy.',
      },
      {
        title: 'Room to Grow',
        body: 'Start with what you need today. Add what matters tomorrow — without starting over.',
      },
    ],
  },

  ecosystem: {
    eyebrow: 'The Ecosystem',
    title: 'One Platform. Infinite Possibilities.',
    subtitle:
      'Every product in the Tau universe connects through Tau Core — the foundation everything else is built on. Each one stands on its own. Together, they become something greater.',
    explore: 'Explore',
  },

  privacy: {
    eyebrow: 'Privacy · Intelligence · Trust',
    title: 'Privacy should never be an upgrade.',
    subtitle: 'It should be the default — not a setting buried three menus deep.',
    pillars: [
      {
        title: 'Transparency',
        body: 'We tell you what we collect, why we collect it, and what we do not.',
      },
      {
        title: 'Your Choice',
        body: 'Strong defaults that protect you. Controls that stay in your hands.',
      },
      {
        title: 'Security by Design',
        body: 'Encryption and isolation built in from the first line of code.',
      },
      {
        title: 'Minimal Data',
        body: 'We do not sell your attention. We do not profile your behaviour.',
      },
      {
        title: 'Respect',
        body: 'You are a person, not a product. That principle does not bend.',
      },
    ],
  },

  ai: {
    eyebrow: 'Meet Tau AI',
    title: 'Not another chatbot.',
    titleAccent: 'A thinking partner.',
    body: 'Tau AI is here to help you understand — not to replace your judgment. It explains, it reasons, it collaborates. It never pretends to know you better than you know yourself.',
    points: [
      'Helps you learn — never judges.',
      'Explains its reasoning when you ask.',
      'Runs on-device when it can. Transparent when it cannot.',
    ],
    prompt: 'How can I help you understand this?',
  },

  builtFor: {
    eyebrow: 'Built For People',
    title: 'Technology for real life.',
    subtitle: 'Tau is not built for one type of person. It is built for the life you are actually living.',
  },

  developers: {
    eyebrow: 'The Future of Building',
    title: 'Start with an idea. Ship with confidence.',
    subtitle:
      'One design system. One identity layer. One place to document, develop, and deploy. Tau gives builders the same care we give everyone else — clarity, privacy, and tools that stay out of your way.',
    cta: 'Open Developer Console',
    href: '/developers',
  },

  grayscale: {
    eyebrow: 'Project Grayscale',
    title: 'Mission control for organizations.',
    subtitle:
      'Research, planning, cybersecurity, analytics, and decision support — brought together in one calm, intelligent workspace. Built for teams who need clarity, not noise.',
    cta: 'Learn about Grayscale',
    href: '/products/project-grayscale',
  },

  philosophy: {
    eyebrow: 'Our Beliefs',
    title: 'The Tau Philosophy',
    intro:
      'These are not marketing lines. They are the principles we return to when decisions get hard — the constitution of everything we build.',
    principles: [
      'Technology should make people more capable.',
      'Technology should never intimidate.',
      'Technology should explain itself.',
      'Technology should protect people by default.',
      'Technology should respect privacy as a human right.',
      'Technology should help people build — not depend.',
    ],
  },

  join: {
    eyebrow: 'Chapter Eight',
    title: 'Join Tau.',
    subtitle:
      'Take Tau with you today. Public beta builds are available for Android. Desktop previews are rolling out. Your world is waiting.',
    cta: 'Go to Download Center',
  },
} as const;

/** Ecosystem groups — each product gets room to breathe. */
export const ecosystemGroups = [
  {
    title: 'Connect',
    description: 'Stay close to the people who matter.',
    products: [
      { id: 'talk', label: 'Tau Talk', description: 'Messages and calls that stay between you and them.', href: '/tautalk' },
      { id: 'mail', label: 'Tau Mail', description: 'Email that respects your inbox — and your privacy.', href: '/taumail' },
      { id: 'onenumbr', label: 'OneNumbr', description: 'One number for how you actually communicate.', href: '/products/onenumbr' },
    ],
  },
  {
    title: 'Create & Store',
    description: 'Your files, your browser, your cloud.',
    products: [
      { id: 'cloud', label: 'Tau Cloud', description: 'Files you control, encrypted end to end.', href: '/taucloud' },
      { id: 'browser', label: 'Tau Browser', description: 'Browse without being followed.', href: '/taubrowser' },
      { id: 'market', label: 'Tau Market', description: 'Apps built for the Tau way of living.', href: '/taustore' },
    ],
  },
  {
    title: 'Platform',
    description: 'The foundation everything rests on.',
    products: [
      { id: 'core', label: 'Tau Core OS', description: 'The operating system at the heart of Tau.', href: '/desktop' },
      { id: 'phone', label: 'Tau Phone', description: 'Hardware designed around your rules.', href: '/mobile' },
      { id: 'id', label: 'Tau ID', description: 'One identity across every Tau product.', href: '/tauid' },
      { id: 'shield', label: 'Tau Shield', description: 'Security woven into every layer.', href: '/products/tau-shield' },
    ],
  },
  {
    title: 'Intelligence',
    description: 'AI that serves you — not advertisers.',
    products: [
      { id: 'ai', label: 'Tau AI', description: 'A mentor that explains, never judges.', href: '/tauai' },
      { id: 'developer', label: 'Tau Developer', description: 'Build and ship on your terms.', href: '/developers' },
      { id: 'ask', label: 'AskTrabaajo', description: 'Work intelligence that respects your time.', href: '/products/asktrabaajo' },
    ],
  },
  {
    title: 'Business',
    description: 'For teams building something that lasts.',
    products: [
      { id: 'grayscale', label: 'Project Grayscale', description: 'Mission control for modern organizations.', href: '/products/project-grayscale' },
      { id: 'bank', label: 'Global Dot Bank', description: 'Banking reimagined for a connected world.', href: '/products/global-dot-bank' },
      { id: 'business', label: 'Tau Business OS', description: 'Run your company on infrastructure you trust.', href: '/products/tau-business-os' },
    ],
  },
] as const;

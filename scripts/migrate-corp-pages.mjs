#!/usr/bin/env node
/**
 * Strips duplicate corp header/footer from marketing inner pages and wraps content
 * in MarketingPageShell. Run: node scripts/migrate-corp-pages.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const APP = path.join(ROOT, 'src/app');

const PAGE_META = {
  'about/page.tsx': {
    title: 'About TAU CORE™',
    subtitle:
      'We built TAU CORE with one idea in mind: technology should belong to people, not the other way around.',
    stripHero: true,
  },
  'contact/page.tsx': {
    title: 'Contact',
    subtitle: 'Reach Tau Core Inc. — support, partnerships, and press.',
    stripHero: true,
  },
  'developers/page.tsx': {
    title: 'Developers',
    subtitle: 'Build on Tau OS with SDKs, APIs, and open documentation.',
    stripHero: true,
  },
  'governance/page.tsx': {
    title: 'Governance',
    subtitle: 'How Tau Core Inc. stewards the TAU CORE ecosystem.',
    stripHero: true,
  },
  'help/page.tsx': {
    title: 'Help Center',
    subtitle: 'Guides and answers for Tau OS and TAU CORE apps.',
    stripHero: true,
  },
  'careers/page.tsx': {
    title: 'Careers',
    subtitle: 'Help build the future of privacy-first computing at Tau Core Inc.',
    stripHero: true,
  },
  'press/page.tsx': {
    title: 'Press',
    subtitle: 'News, media assets, and announcements from Tau Core Inc.',
    stripHero: true,
  },
  'investors/page.tsx': {
    title: 'Investors',
    subtitle: 'Tau Core Inc. — building the TAU CORE platform.',
    stripHero: true,
  },
  'resources/page.tsx': {
    title: 'Resources',
    subtitle: 'Documentation, downloads, and learning materials.',
    stripHero: true,
  },
  'status/page.tsx': {
    title: 'System Status',
    subtitle: 'Live status for Tau Core Inc. services.',
    stripHero: true,
  },
  'pricing/page.tsx': {
    title: 'Pricing',
    subtitle: 'Simple, transparent plans for the TAU CORE ecosystem.',
    stripHero: true,
  },
  'legal/privacy/page.tsx': {
    title: 'Privacy Policy',
    subtitle: 'How Tau Core Inc. protects your data.',
    stripHero: false,
  },
  'legal/terms/page.tsx': {
    title: 'Terms of Service',
    subtitle: 'Terms governing use of Tau Core Inc. products.',
    stripHero: false,
  },
  'legal/cookies/page.tsx': {
    title: 'Cookie Policy',
    subtitle: 'How we use cookies across TAU CORE properties.',
    stripHero: false,
  },
  'legal/dpa/page.tsx': {
    title: 'Data Processing Agreement',
    subtitle: 'Enterprise data processing terms from Tau Core Inc.',
    stripHero: false,
  },
  'legal/acceptable-use/page.tsx': {
    title: 'Acceptable Use',
    subtitle: 'Rules for using TAU CORE services responsibly.',
    stripHero: false,
  },
  'tauid/page.tsx': {
    title: 'Tau ID',
    subtitle: 'Your sovereign identity across the TAU CORE ecosystem.',
    stripHero: true,
    appShell: true,
  },
  'taustore/page.tsx': {
    title: 'Tau Store',
    subtitle: 'Curated, privacy-scored apps for Tau OS.',
    stripHero: true,
    appShell: true,
  },
  'taubrowser/page.tsx': {
    title: 'Tau Browser',
    subtitle: 'Privacy-first browsing built into the TAU CORE stack.',
    stripHero: true,
    appShell: true,
  },
  'desktop/page.tsx': {
    title: 'Tau OS Desktop',
    subtitle: 'Privacy-first desktop operating system from Tau Core Inc.',
    stripHero: true,
    appShell: false,
  },
  'mobile/page.tsx': {
    title: 'Tau Mobile',
    subtitle: 'Your phone. Your rules. Mobile OS from Tau Core Inc.',
    stripHero: true,
    appShell: false,
  },
  'tauai/page.tsx': {
    title: 'Tau AI',
    subtitle: 'On-device intelligence that serves you — not advertisers.',
    stripHero: true,
    appShell: false,
  },
};

const IMPORT_LINE = `import MarketingPageShell from '@/components/marketing/MarketingPageShell';\n`;

function stripHeader(src) {
  return src.replace(
    /\{\/\* Header \*\/\}[\s\S]*?<\/header>\s*/m,
    ''
  );
}

function stripFooter(src) {
  return src.replace(
    /\{\/\* Footer \*\/\}[\s\S]*?<\/footer>\s*/m,
    ''
  );
}

function stripHeroSection(src) {
  return src.replace(
    /\{\/\* Hero Section \*\/\}[\s\S]*?<\/section>\s*/m,
    ''
  );
}

function wrapPage(relPath, meta) {
  const filePath = path.join(APP, relPath);
  if (!fs.existsSync(filePath)) {
    console.warn('skip missing', relPath);
    return;
  }

  let src = fs.readFileSync(filePath, 'utf8');
  if (src.includes('MarketingPageShell')) {
    console.log('already migrated', relPath);
    return;
  }

  src = stripHeader(src);
  src = stripFooter(src);
  if (meta.stripHero) src = stripHeroSection(src);

  src = src
    .replace(/TauCore™/g, 'TAU CORE™')
    .replace(/TauCore/g, 'TAU CORE')
    .replace(/© 2025 Tau Foundation & Tau LLC\. All rights reserved\./g, '© Tau Core Inc. All rights reserved.')
    .replace(/The Tau Foundation/g, 'Tau Core Inc.')
    .replace(/Tau Foundation/g, 'Tau Core Inc.')
    .replace(/Tau LLC/g, 'Tau Core Inc.')
    .replace(/Tau OS/g, 'Tau OS')
    .replace(/TauOS/g, 'Tau OS');

  if (!src.includes("MarketingPageShell")) {
    src = src.replace(/^('use client';\n\n)?/m, (m) => `${m || ''}${IMPORT_LINE}`);
  }

  src = src.replace(
    /return \(\s*<div className="min-h-screen[^"]*">/,
    `return (
    <MarketingPageShell
      title="${meta.title}"
      subtitle="${meta.subtitle}"
    >`
  );

  src = src.replace(/\s*<\/div>\s*\);\s*\}\s*$/, `
    </MarketingPageShell>
  );
}
`);

  fs.writeFileSync(filePath, src);
  console.log('migrated', relPath);
}

for (const [rel, meta] of Object.entries(PAGE_META)) {
  wrapPage(rel, meta);
}

console.log('done');

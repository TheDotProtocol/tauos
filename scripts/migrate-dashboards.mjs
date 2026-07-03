#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const APP = path.resolve(import.meta.dirname, '../src/app');

const PAGES = [
  {
    file: 'taumail/dashboard/page.tsx',
    title: 'Tau Mail',
    subtitle: 'Private email dashboard — Tau Core Inc.',
    mailNav: true,
  },
  {
    file: 'taumail/inbox/page.tsx',
    title: 'Tau Mail',
    subtitle: 'Inbox',
    mailNav: true,
  },
  {
    file: 'taumail/sent/page.tsx',
    title: 'Tau Mail',
    subtitle: 'Sent mail',
    mailNav: true,
  },
  {
    file: 'taumail/drafts/page.tsx',
    title: 'Tau Mail',
    subtitle: 'Drafts',
    mailNav: true,
  },
  {
    file: 'taumail/spam/page.tsx',
    title: 'Tau Mail',
    subtitle: 'Spam folder',
    mailNav: true,
  },
  {
    file: 'taumail/trash/page.tsx',
    title: 'Tau Mail',
    subtitle: 'Trash',
    mailNav: true,
  },
  {
    file: 'taumail/compose/page.tsx',
    title: 'Tau Mail',
    subtitle: 'Compose message',
    mailNav: true,
  },
  {
    file: 'taucloud/dashboard/page.tsx',
    title: 'Tau Cloud',
    subtitle: 'Your encrypted files — zero-knowledge storage.',
    fullWidth: true,
  },
  {
    file: 'taucloud/search/page.tsx',
    title: 'Tau Cloud',
    subtitle: 'Search your files',
    fullWidth: true,
  },
  {
    file: 'taucloud/settings/page.tsx',
    title: 'Tau Cloud',
    subtitle: 'Cloud settings',
    fullWidth: true,
  },
  {
    file: 'tauid/dashboard/page.tsx',
    title: 'Tau ID',
    subtitle: 'Manage your sovereign digital identity.',
    userField: 'full_name|username|email',
  },
  {
    file: 'taustore/dashboard/page.tsx',
    title: 'Tau Store',
    subtitle: 'Privacy-scored apps for Tau OS.',
  },
  {
    file: 'taubrowser/dashboard/page.tsx',
    title: 'Tau Browser',
    subtitle: 'Privacy-first browsing.',
    fullWidth: true,
  },
];

const IMPORTS = `import DashboardShell from '@/components/apps/DashboardShell';
`;

const MAIL_IMPORT = `import TauMailSubNav from '@/components/apps/TauMailSubNav';
`;

function stripHeader(src) {
  return src.replace(/\{\/\* Header \*\/\}[\s\S]*?<\/header>\s*/m, '');
}

function stripLoadingBlock(src) {
  return src.replace(
    /if \(!isLoggedIn\) \{[\s\S]*?return \([\s\S]*?<\/div>\s*\);\s*\}/m,
    ''
  ).replace(
    /if \(isLoading\) \{[\s\S]*?return \([\s\S]*?<\/div>\s*\);\s*\}/m,
    ''
  );
}

function stripOuterContainer(src) {
  return src
    .replace(/<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">\s*/g, '')
    .replace(/<main className="max-w-6xl mx-auto px-4 py-8">\s*/g, '');
}

function migrate(meta) {
  const filePath = path.join(APP, meta.file);
  if (!fs.existsSync(filePath)) {
    console.warn('skip', meta.file);
    return;
  }

  let src = fs.readFileSync(filePath, 'utf8');
  if (src.includes('DashboardShell')) {
    console.log('already', meta.file);
    return;
  }

  src = stripLoadingBlock(src);
  src = stripHeader(src);
  src = stripOuterContainer(src);

  const importBlock = meta.mailNav ? IMPORTS + MAIL_IMPORT : IMPORTS;
  src = src.replace(/^('use client';\n\n)?/m, (m) => `${m || ''}${importBlock}`);

  const userLabel = meta.userField
    ? `{user?.full_name || user?.username || user?.email}`
    : `{user?.email}`;

  const shellOpen = `<DashboardShell
      title="${meta.title}"
      subtitle="${meta.subtitle}"
      userLabel={${userLabel.replace(/^\{|\}$/g, '')}}
      onLogout={handleLogout}
      loading={!isLoggedIn${meta.userField ? '' : ''}}
      ${meta.fullWidth ? 'fullWidth' : ''}
    >
      ${meta.mailNav ? '<TauMailSubNav />' : ''}`;

  // Fix loading prop - for tauid uses isLoading
  const loadingExpr = meta.file.includes('tauid/')
    ? 'loading={isLoading}'
    : 'loading={!isLoggedIn}';

  const open = `<DashboardShell
      title="${meta.title}"
      subtitle="${meta.subtitle}"
      userLabel={${meta.userField ? 'user?.full_name || user?.username || user?.email' : 'user?.email'}}
      onLogout={handleLogout}
      ${meta.file.includes('tauid/') ? loadingExpr : 'loading={!isLoggedIn}'}
      ${meta.fullWidth ? 'fullWidth' : ''}
    >
      ${meta.mailNav ? '<TauMailSubNav />' : ''}`;

  src = src.replace(
    /return \(\s*<div className="min-h-screen bg-black text-white">/,
    `return (
    ${open}`
  );

  // Close extra div from old wrapper — last closing before );
  src = src.replace(/\n    <\/div>\n  \);\n\}$/, '\n    </DashboardShell>\n  );\n}');

  fs.writeFileSync(filePath, src);
  console.log('migrated', meta.file);
}

for (const meta of PAGES) migrate(meta);
console.log('done');

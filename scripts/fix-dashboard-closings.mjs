#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const APP = path.resolve(import.meta.dirname, '../src/app');

const FILES = [
  'taumail/inbox/page.tsx',
  'taumail/sent/page.tsx',
  'taumail/trash/page.tsx',
  'taumail/drafts/page.tsx',
  'taumail/spam/page.tsx',
  'taumail/compose/page.tsx',
  'taucloud/search/page.tsx',
  'taucloud/settings/page.tsx',
  'taustore/dashboard/page.tsx',
  'taubrowser/dashboard/page.tsx',
  'tauid/dashboard/page.tsx',
];

function fixUseClientOrder(src) {
  if (src.includes("'use client'") && !src.startsWith("'use client'")) {
    src = src.replace(/^import DashboardShell[^\n]+\n/m, '');
    if (!src.startsWith("'use client'")) {
      src = src.replace(/^('use client';\n)/, "$1\nimport DashboardShell from '@/components/apps/DashboardShell';\n");
    } else {
      src = `'use client';\n\nimport DashboardShell from '@/components/apps/DashboardShell';\n${src.replace(/^'use client';\n\n?/, '')}`;
    }
  }
  return src;
}

function stripDuplicateHeader(src) {
  return src.replace(
    /\s*<header className="bg-gray-900\/50 backdrop-blur-xl border-b border-gray-800">[\s\S]*?<\/header>\s*/,
    '\n'
  );
}

function fixLoadingProp(src) {
  if (src.includes('loading={!isLoggedIn}') && !src.includes('isLoggedIn')) {
    return src.replace('loading={!isLoggedIn}', 'loading={!user}');
  }
  return src;
}

function removeEarlyUserLoading(src) {
  return src.replace(
    /\s*if \(!user\) \{\s*return \(\s*<div className="min-h-screen bg-black text-white flex items-center justify-center">[\s\S]*?<\/div>\s*\);\s*\}\s*/m,
    '\n'
  );
}

function closeDashboardShell(src) {
  if (!src.includes('<DashboardShell') || src.includes('</DashboardShell>')) {
    src = src.replace(/\s*<\/main>\s*\n\s*<\/DashboardShell>/, '\n    </DashboardShell>');
    return src;
  }

  src = src.replace(/\s*<\/main>\s*/g, '\n');

  // Drop orphaned wrapper closings immediately before the component return ends.
  src = src.replace(
    /(\n\s*<\/div>\s*){1,4}(\n\s*\);\s*\n\})$/,
    '\n    </DashboardShell>$2'
  );

  return src;
}

for (const rel of FILES) {
  const filePath = path.join(APP, rel);
  if (!fs.existsSync(filePath)) continue;

  let src = fs.readFileSync(filePath, 'utf8');
  const before = src;

  src = fixUseClientOrder(src);
  src = stripDuplicateHeader(src);
  src = fixLoadingProp(src);
  src = removeEarlyUserLoading(src);
  src = closeDashboardShell(src);

  if (src !== before) {
    fs.writeFileSync(filePath, src);
    console.log('fixed', rel);
  }
}

console.log('done');

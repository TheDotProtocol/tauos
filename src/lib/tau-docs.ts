import fs from 'fs';
import path from 'path';

export type DocSource = 'taucore' | 'dev';

export type DocCatalogEntry = {
  slug: string;
  title: string;
  file: string;
  source: DocSource;
  description?: string;
  section: string;
};

/** Public TauCore documentation suite (community edition). */
const TAU_CORE_SUITE: Omit<DocCatalogEntry, 'section'>[] = [
  { slug: 'technical-whitepaper', title: 'Technical Whitepaper', file: '02_TauCore_Technical_Whitepaper.md', source: 'taucore', description: 'Architecture, privacy AI, and performance' },
  { slug: 'product-guide', title: 'Product Guide', file: '03_TauCore_Product_Guide.md', source: 'taucore', description: 'Desktop, mobile, cloud, and app usage' },
  { slug: 'privacy-security', title: 'Privacy & Security', file: '04_TauCore_Privacy_Security_Documentation.md', source: 'taucore', description: 'GDPR, SOC2, ISO 27001 compliance' },
  { slug: 'developer-documentation', title: 'Developer Documentation', file: '05_TauCore_Developer_Documentation.md', source: 'taucore', description: 'TauScript, APIs, and integration patterns' },
  { slug: 'installation-guides', title: 'Installation Guides', file: '06_TauCore_Installation_Guides.md', source: 'taucore', description: 'Windows, macOS, Linux, Android, iOS setup' },
  { slug: 'sla-disaster-recovery', title: 'SLA & Disaster Recovery', file: '07_TauCore_SLA_Disaster_Recovery_Policy.md', source: 'taucore', description: 'Uptime, DR, and support escalation' },
  { slug: 'faq', title: 'FAQ & Knowledge Base', file: '08_TauCore_FAQ_Knowledge_Base.md', source: 'taucore', description: 'Common questions and troubleshooting' },
  { slug: 'release-notes-v1', title: 'Release Notes v1.0', file: '11_TauCore_Release_Notes_v1.0.md', source: 'taucore', description: 'Features, fixes, and roadmap' },
];

/** Curated dev docs from /docs (local only — not pushed to GitHub). */
const DEV_DOCS: Omit<DocCatalogEntry, 'section'>[] = [
  { slug: 'api-reference', title: 'API Reference', file: 'API.md', source: 'dev', description: 'Tau platform API overview' },
  { slug: 'deployment-guide', title: 'Deployment Guide', file: 'DEPLOYMENT.md', source: 'dev', description: 'Production deployment steps' },
  { slug: 'complete-setup', title: 'Complete Setup Guide', file: 'COMPLETE_SETUP_GUIDE.md', source: 'dev', description: 'End-to-end environment setup' },
  { slug: 'postgresql-setup', title: 'PostgreSQL Setup', file: 'POSTGRESQL_SETUP_GUIDE.md', source: 'dev', description: 'Database configuration' },
  { slug: 'integration-status', title: 'Integration Status', file: 'INTEGRATION_STATUS.md', source: 'dev', description: 'Ecosystem integration tracker' },
  { slug: 'design-system', title: 'Design System', file: 'DESIGN_SYSTEM.md', source: 'dev', description: 'TXP tokens and components' },
  { slug: 'governance', title: 'Governance', file: 'GOVERNANCE.md', source: 'dev', description: 'Open standards and governance' },
  { slug: 'public-rollout', title: 'Public Rollout Status', file: 'PUBLIC_ROLLOUT_STATUS.md', source: 'dev', description: 'Beta and launch status' },
  { slug: 'tautalk-phase2', title: 'TauTalk Phase 2 Guide', file: 'tautalk-phase2-guide.md', source: 'dev', description: 'Android beta and WebRTC rollout' },
  { slug: 'taumail-infrastructure', title: 'TauMail Infrastructure', file: 'taumail-independent-infrastructure.md', source: 'dev', description: 'Mail stack architecture' },
  { slug: 'taucloud-phase1', title: 'Tau Cloud Phase 1', file: 'phase-1-taucloud.md', source: 'dev', description: 'Cloud storage rollout' },
  { slug: 'why-tauos', title: 'Why Choose Tau OS', file: 'why-choose-tauos.md', source: 'dev', description: 'Positioning and differentiation' },
];

export const docSections: { title: string; description: string; slugs: string[] }[] = [
  {
    title: 'Getting Started',
    description: 'Installation, setup, and quick orientation',
    slugs: ['installation-guides', 'complete-setup', 'product-guide', 'faq'],
  },
  {
    title: 'Platform & Architecture',
    description: 'Technical depth for builders and evaluators',
    slugs: ['technical-whitepaper', 'integration-status', 'design-system'],
  },
  {
    title: 'Products',
    description: 'Mail, cloud, talk, and ecosystem guides',
    slugs: ['product-guide', 'taumail-infrastructure', 'taucloud-phase1', 'tautalk-phase2'],
  },
  {
    title: 'Developers',
    description: 'APIs, deployment, and developer tooling',
    slugs: ['developer-documentation', 'api-reference', 'deployment-guide', 'postgresql-setup'],
  },
  {
    title: 'Security & Privacy',
    description: 'Compliance, privacy, and enterprise trust',
    slugs: ['privacy-security', 'production-readiness', 'sla-disaster-recovery', 'governance'],
  },
  {
    title: 'Release & Community',
    description: 'Release notes and community resources',
    slugs: ['release-notes-v1', 'public-rollout', 'why-tauos'],
  },
];

function docBase(source: DocSource): string {
  return source === 'taucore'
    ? path.join(process.cwd(), 'src/app/docs')
    : path.join(process.cwd(), 'docs');
}

export function allDocEntries(): DocCatalogEntry[] {
  const entries: DocCatalogEntry[] = [];
  for (const section of docSections) {
    for (const slug of section.slugs) {
      const meta = [...TAU_CORE_SUITE, ...DEV_DOCS].find((d) => d.slug === slug);
      if (!meta) continue;
      const filePath = path.join(docBase(meta.source), meta.file);
      if (!fs.existsSync(filePath)) continue;
      if (entries.some((e) => e.slug === slug)) continue;
      entries.push({ ...meta, section: section.title });
    }
  }
  return entries;
}

export function getDocBySlug(slug: string): (DocCatalogEntry & { content: string }) | null {
  const meta = [...TAU_CORE_SUITE, ...DEV_DOCS].find((d) => d.slug === slug);
  if (!meta) return null;
  const filePath = path.join(docBase(meta.source), meta.file);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  const section = docSections.find((s) => s.slugs.includes(slug))?.title ?? 'Documentation';
  return { ...meta, section, content };
}

export function getDocsForHub() {
  return docSections.map((section) => ({
    ...section,
    docs: section.slugs
      .map((slug) => {
        const meta = [...TAU_CORE_SUITE, ...DEV_DOCS].find((d) => d.slug === slug);
        if (!meta) return null;
        if (!fs.existsSync(path.join(docBase(meta.source), meta.file))) return null;
        return { ...meta, href: `/docs/${slug}` };
      })
      .filter(Boolean) as Array<Omit<DocCatalogEntry, 'section'> & { href: string }>,
  })).filter((s) => s.docs.length > 0);
}

import { productHref } from './product-routes';

export type NavLink = { label: string; href: string; description?: string };

export type MegaMenuColumn = {
  title: string;
  links: NavLink[];
};

export const txpNav = {
  primary: [
    { id: 'products', label: 'Products' },
    { id: 'business', label: 'Business' },
    { id: 'developers', label: 'Developers' },
    { id: 'enterprise', label: 'Enterprise' },
    { id: 'downloads', label: 'Downloads', href: '/downloads' },
    { id: 'about', label: 'About', href: '/about' },
  ],
  megaMenus: {
    products: {
      title: 'Tau Core',
      columns: [
        {
          title: 'Platform',
          links: [
            { label: 'Tau Core OS', href: productHref('tau-core'), description: 'The foundation' },
            { label: 'Tau Phone', href: productHref('tau-phone'), description: 'Your device. Your rules.' },
            { label: 'Tau ID', href: productHref('tau-id'), description: 'One identity everywhere' },
            { label: 'Tau Shield', href: productHref('tau-shield'), description: 'Security by design' },
          ],
        },
        {
          title: 'Connect & Create',
          links: [
            { label: 'Tau Talk', href: productHref('tau-talk'), description: 'Encrypted messaging' },
            { label: 'Tau Mail', href: productHref('tau-mail'), description: 'Private email' },
            { label: 'Tau Cloud', href: productHref('tau-cloud'), description: 'Your files, your keys' },
            { label: 'Tau Browser', href: productHref('tau-browser'), description: 'Browse without tracking' },
          ],
        },
        {
          title: 'Intelligence',
          links: [
            { label: 'Tau AI', href: productHref('tau-ai'), description: 'Mentor, not chatbot' },
            { label: 'Tau Drive', href: productHref('tau-drive'), description: 'Sync with privacy' },
            { label: 'Tau Market', href: productHref('tau-market'), description: 'Apps for Tau' },
            { label: 'Tau Pay', href: productHref('tau-pay'), description: 'Payments without surveillance' },
          ],
        },
      ] satisfies MegaMenuColumn[],
    },
    business: {
      title: 'Business',
      columns: [
        {
          title: 'Workspaces',
          links: [
            { label: 'Tau Business OS', href: productHref('tau-business-os'), description: 'Run anywhere' },
            { label: 'Project Grayscale', href: productHref('project-grayscale'), description: 'Mission control' },
            { label: 'AskTrabaajo', href: productHref('asktrabaajo'), description: 'Work intelligence' },
            { label: 'Enterprise Dashboard', href: '/enterprise', description: 'Organization overview' },
          ],
        },
        {
          title: 'Finance & Identity',
          links: [
            { label: 'Global Dot Bank', href: productHref('global-dot-bank'), description: 'Banking reimagined' },
            { label: 'OneNumbr', href: productHref('onenumbr'), description: 'Unified communications' },
            { label: 'Business Security', href: '/enterprise/security', description: 'Protect your org' },
          ],
        },
      ] satisfies MegaMenuColumn[],
    },
    developers: {
      title: 'Developers',
      columns: [
        {
          title: 'Build',
          links: [
            { label: 'Tau Developer Console', href: productHref('tau-developer'), description: 'Ship on Tau' },
            { label: 'Documentation', href: '/docs', description: 'Guides & references' },
            { label: 'SDK', href: '/developers', description: 'Libraries & tools' },
            { label: 'API', href: '/docs', description: 'Integrate with Tau' },
          ],
        },
        {
          title: 'Design & Standards',
          links: [
            { label: 'Design System', href: '/design-system', description: 'TXP V1 tokens & components' },
            { label: 'Downloads', href: '/downloads', description: 'SDKs & previews' },
            { label: 'Roadmap', href: '/#roadmap', description: 'Where we are going' },
            { label: 'Open Standards', href: '/governance', description: 'Open by principle' },
          ],
        },
      ] satisfies MegaMenuColumn[],
    },
    enterprise: {
      title: 'Enterprise',
      columns: [
        {
          title: 'Trust',
          links: [
            { label: 'Privacy', href: '/legal/privacy', description: 'Your data stays yours' },
            { label: 'Security', href: '/enterprise/security', description: 'Defense in depth' },
            { label: 'Compliance', href: '/legal/dpa', description: 'Enterprise readiness' },
          ],
        },
        {
          title: 'Solutions',
          links: [
            { label: 'Solutions', href: '/enterprise', description: 'Industry use cases' },
            { label: 'Partners', href: '/contact', description: 'Work with Tau' },
            { label: 'Case Studies', href: '/resources', description: 'Real outcomes' },
          ],
        },
      ] satisfies MegaMenuColumn[],
    },
  },
  actions: {
    join: { label: 'Join Tau', href: '/tauid/register' },
    download: { label: 'Download', href: '/downloads' },
  },
} as const;

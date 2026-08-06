import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  FolderGit2,
  Code2,
  BookOpen,
  PackageOpen,
  KeyRound,
  Rocket,
  BarChart3,
  CreditCard,
  Store,
  Puzzle,
  Terminal,
  GitBranch,
  Workflow,
  Brain,
  Settings,
} from 'lucide-react';

export type TauDevNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  sidebar?: boolean;
  extended?: boolean;
};

const EXTENDED_ROUTE_PREFIXES = [
  '/developers/tauscript',
  '/developers/git',
  '/developers/cicd',
  '/developers/architect',
  '/developers/settings',
];

export function sidebarNavForPath(pathname: string): TauDevNavItem[] {
  const extended = EXTENDED_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const primary = TAU_DEV_NAV.filter((n) => n.sidebar);
  if (!extended) return primary;
  return [...primary, ...TAU_DEV_NAV.filter((n) => n.extended)];
}

/** Primary sidebar (Figma) + full platform routes */
export const TAU_DEV_NAV: TauDevNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/developers/dashboard', icon: LayoutDashboard, sidebar: true },
  { id: 'projects', label: 'Projects', href: '/developers/projects', icon: FolderGit2, sidebar: true },
  { id: 'ide', label: 'Tau IDE', href: '/developers/workspace', icon: Code2, sidebar: true },
  { id: 'docs', label: 'Documentation', href: '/developers/docs', icon: BookOpen, sidebar: true },
  { id: 'sdks', label: 'SDKs', href: '/developers/sdks', icon: PackageOpen, sidebar: true },
  { id: 'api-keys', label: 'API Keys', href: '/developers/api-keys', icon: KeyRound, sidebar: true },
  { id: 'deployments', label: 'Deployments', href: '/developers/deployments', icon: Rocket },
  { id: 'analytics', label: 'Analytics', href: '/developers/analytics', icon: BarChart3 },
  { id: 'billing', label: 'Billing', href: '/developers/billing', icon: CreditCard },
  { id: 'marketplace', label: 'Marketplace', href: '/developers/marketplace', icon: Store },
  { id: 'extensions', label: 'Extensions', href: '/developers/extensions', icon: Puzzle },
  { id: 'tauscript', label: 'TauScript', href: '/developers/tauscript', icon: Terminal, extended: true },
  { id: 'git', label: 'Git', href: '/developers/git', icon: GitBranch, extended: true },
  { id: 'cicd', label: 'CI/CD', href: '/developers/cicd', icon: Workflow, extended: true },
  { id: 'architect', label: 'AI Architect', href: '/developers/architect', icon: Brain, extended: true },
  { id: 'settings', label: 'Settings', href: '/developers/settings', icon: Settings, extended: true },
];

export function titleForPath(pathname: string): string {
  const item = TAU_DEV_NAV.find((n) => pathname === n.href || pathname.startsWith(`${n.href}/`));
  if (!item) return 'Developer Platform';
  if (item.id === 'dashboard') return 'Developer Dashboard';
  if (item.id === 'projects') return 'Developer Projects';
  if (item.id === 'ide') return 'Tau IDE';
  if (item.id === 'docs') return 'Documentation & SDK Reference';
  if (item.id === 'sdks') return 'Developer SDK Reference';
  if (item.id === 'api-keys') return 'Developer API Gateway Keys';
  if (item.id === 'deployments') return 'Deployment Pipeline';
  if (item.id === 'analytics') return 'Developer Analytics';
  if (item.id === 'billing') return 'Billing & Subscription';
  if (item.id === 'marketplace') return 'Platform Marketplace';
  if (item.id === 'extensions') return 'Installed Extensions';
  if (item.id === 'tauscript') return 'TauScript Language Hub';
  if (item.id === 'git') return 'Git Repository Management';
  if (item.id === 'cicd') return 'CI/CD Pipeline Configurations';
  if (item.id === 'architect') return 'AI-Powered Architecture Assistant';
  if (item.id === 'settings') return 'Ecosystem Settings & Profile';
  return item.label;
}

export function activeNavId(pathname: string): string | null {
  const match = TAU_DEV_NAV.find((n) => pathname === n.href || pathname.startsWith(`${n.href}/`));
  return match?.id ?? null;
}

'use client';

import type { ReactNode } from 'react';
import { Loader2, LogOut, User } from 'lucide-react';
import AppShell from '@/components/apps/AppShell';

type DashboardShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  userLabel?: string | null;
  onLogout: () => void;
  toolbar?: ReactNode;
  loading?: boolean;
  /** Use full-bleed layout (cloud/browser dashboards) */
  fullWidth?: boolean;
};

export default function DashboardShell({
  children,
  title,
  subtitle,
  userLabel,
  onLogout,
  toolbar,
  loading = false,
  fullWidth = false,
}: DashboardShellProps) {
  return (
    <AppShell title={title} subtitle={subtitle} variant={fullWidth ? 'marketing' : 'app'}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        {toolbar ? <div className="flex flex-wrap items-center gap-3">{toolbar}</div> : <span />}
        <div className="flex items-center gap-4 ml-auto">
          {userLabel ? (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4 shrink-0" />
              <span className="truncate max-w-[220px]">{userLabel}</span>
            </span>
          ) : null}
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      ) : (
        children
      )}
    </AppShell>
  );
}

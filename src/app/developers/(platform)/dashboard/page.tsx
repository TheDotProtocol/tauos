'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperDashboardContent from '@/components/tau-developer/DeveloperDashboardContent';

export default function DashboardPage() {
  return (
    <PlatformShell title="Developer Dashboard">
      <DeveloperDashboardContent />
    </PlatformShell>
  );
}

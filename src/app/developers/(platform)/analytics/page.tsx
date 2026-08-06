'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperAnalyticsContent from '@/components/tau-developer/DeveloperAnalyticsContent';

export default function AnalyticsPage() {
  return (
    <PlatformShell title="Developer Analytics">
      <DeveloperAnalyticsContent />
    </PlatformShell>
  );
}

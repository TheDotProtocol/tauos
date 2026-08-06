'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperDeploymentsContent from '@/components/tau-developer/DeveloperDeploymentsContent';

export default function DeploymentsPage() {
  return (
    <PlatformShell title="Deployment Pipeline">
      <DeveloperDeploymentsContent />
    </PlatformShell>
  );
}

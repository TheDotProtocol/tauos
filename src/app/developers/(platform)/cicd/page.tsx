'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperCicdContent from '@/components/tau-developer/DeveloperCicdContent';

export default function CicdPage() {
  return (
    <PlatformShell title="CI/CD Pipeline Configurations">
      <DeveloperCicdContent />
    </PlatformShell>
  );
}

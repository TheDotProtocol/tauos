'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperArchitectContent from '@/components/tau-developer/DeveloperArchitectContent';

export default function ArchitectPage() {
  return (
    <PlatformShell title="AI-Powered Architecture Assistant">
      <DeveloperArchitectContent />
    </PlatformShell>
  );
}

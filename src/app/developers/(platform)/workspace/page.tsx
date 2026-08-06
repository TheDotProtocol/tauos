'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperIdeContent from '@/components/tau-developer/DeveloperIdeContent';

export default function WorkspacePage() {
  return (
    <PlatformShell title="Tau IDE">
      <DeveloperIdeContent />
    </PlatformShell>
  );
}

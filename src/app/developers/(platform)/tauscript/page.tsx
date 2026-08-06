'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperTauScriptContent from '@/components/tau-developer/DeveloperTauScriptContent';

export default function TauScriptPage() {
  return (
    <PlatformShell title="TauScript Language Hub">
      <DeveloperTauScriptContent />
    </PlatformShell>
  );
}

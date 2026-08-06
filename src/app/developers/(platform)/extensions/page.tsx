'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperExtensionsContent from '@/components/tau-developer/DeveloperExtensionsContent';

export default function ExtensionsPage() {
  return (
    <PlatformShell title="Installed Extensions">
      <DeveloperExtensionsContent />
    </PlatformShell>
  );
}

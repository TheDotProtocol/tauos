'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperSettingsContent from '@/components/tau-developer/DeveloperSettingsContent';

export default function SettingsPage() {
  return (
    <PlatformShell title="Ecosystem Settings & Profile">
      <DeveloperSettingsContent />
    </PlatformShell>
  );
}

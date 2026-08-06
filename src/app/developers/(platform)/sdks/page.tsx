'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperSdksContent from '@/components/tau-developer/DeveloperSdksContent';

export default function SdksPage() {
  return (
    <PlatformShell title="Developer SDK Reference">
      <DeveloperSdksContent />
    </PlatformShell>
  );
}

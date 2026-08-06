'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperApiKeysContent from '@/components/tau-developer/DeveloperApiKeysContent';

export default function ApiKeysPage() {
  return (
    <PlatformShell title="Developer API Gateway Keys">
      <DeveloperApiKeysContent />
    </PlatformShell>
  );
}

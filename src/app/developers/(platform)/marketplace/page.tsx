'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperMarketplaceContent from '@/components/tau-developer/DeveloperMarketplaceContent';

export default function MarketplacePage() {
  return (
    <PlatformShell title="Platform Marketplace">
      <DeveloperMarketplaceContent />
    </PlatformShell>
  );
}

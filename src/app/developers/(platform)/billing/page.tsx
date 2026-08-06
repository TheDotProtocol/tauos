'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperBillingContent from '@/components/tau-developer/DeveloperBillingContent';

export default function BillingPage() {
  return (
    <PlatformShell title="Billing & Subscription">
      <DeveloperBillingContent />
    </PlatformShell>
  );
}

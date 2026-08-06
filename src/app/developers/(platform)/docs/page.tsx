'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperDocumentationContent from '@/components/tau-developer/DeveloperDocumentationContent';

export default function DocsPage() {
  return (
    <PlatformShell title="Documentation & SDK Reference">
      <DeveloperDocumentationContent />
    </PlatformShell>
  );
}

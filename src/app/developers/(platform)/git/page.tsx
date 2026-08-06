'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperGitContent from '@/components/tau-developer/DeveloperGitContent';

export default function GitPage() {
  return (
    <PlatformShell title="Git Repository Management">
      <DeveloperGitContent />
    </PlatformShell>
  );
}

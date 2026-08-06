'use client';

import PlatformShell from '@/components/tau-ide/PlatformShell';
import DeveloperProjectsContent from '@/components/tau-developer/DeveloperProjectsContent';

export default function ProjectsPage() {
  return (
    <PlatformShell title="Developer Projects">
      <DeveloperProjectsContent />
    </PlatformShell>
  );
}

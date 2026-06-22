import SubPageLayout from "@/layouts/SubPageLayout";
import { AboutContent } from "@/pages/content/AboutContent";
import { BetaContent } from "@/pages/content/BetaContent";
import { DevelopersContent } from "@/pages/content/DevelopersContent";
import { GovernanceContent } from "@/pages/content/GovernanceContent";
import { ContactContent } from "@/pages/content/ContactContent";
import { LegalContent } from "@/pages/content/LegalContent";
import { PrivacyContent } from "@/pages/content/PrivacyContent";
import { DocsContent } from "@/pages/content/DocsContent";
import { TauScriptContent } from "@/pages/content/TauScriptContent";

export function AboutPage() {
  return (
    <SubPageLayout className="pt-0 bg-transparent p-0">
      <AboutContent />
    </SubPageLayout>
  );
}

export function BetaPage() {
  return (
    <SubPageLayout className="pt-0 bg-transparent p-0">
      <BetaContent />
    </SubPageLayout>
  );
}

export function DevelopersPage() {
  return (
    <SubPageLayout className="pt-0 bg-transparent p-0">
      <DevelopersContent />
    </SubPageLayout>
  );
}

export function GovernancePage() {
  return (
    <SubPageLayout className="pt-0 bg-transparent p-0">
      <GovernanceContent />
    </SubPageLayout>
  );
}

export function ContactPage() {
  return (
    <SubPageLayout className="pt-0 bg-transparent p-0">
      <ContactContent />
    </SubPageLayout>
  );
}

export function LegalPage() {
  return (
    <SubPageLayout className="pt-0 bg-transparent p-0">
      <LegalContent />
    </SubPageLayout>
  );
}

export function PrivacyPage() {
  return (
    <SubPageLayout className="pt-0 bg-transparent p-0">
      <PrivacyContent />
    </SubPageLayout>
  );
}

export function DocsPage() {
  return (
    <SubPageLayout className="pt-20 min-h-screen bg-transparent text-inherit p-0">
      <DocsContent />
    </SubPageLayout>
  );
}

export function TauScriptPage() {
  return (
    <SubPageLayout className="pt-0 bg-transparent p-0">
      <TauScriptContent />
    </SubPageLayout>
  );
}

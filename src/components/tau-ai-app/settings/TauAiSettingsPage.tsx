'use client';

import { useState } from 'react';
import TauAiAppShell from '@/components/tau-ai-app/shared/TauAiAppShell';
import { TauAiPageHeader } from '@/components/tau-ai-app/shared/TauAiTopBar';
import TauAiToggle from '@/components/tau-ai-app/shared/TauAiToggle';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';

const SETTINGS_SECTIONS = [
  'Memory',
  'Privacy',
  'Models',
  'Extensions',
  'Voice',
  'Notifications',
  'Languages',
  'Accessibility',
  'Connected Services',
] as const;

type SettingsSection = (typeof SETTINGS_SECTIONS)[number];

const PRIVACY_TOGGLES = [
  {
    title: 'Local Processing Only',
    description: 'Force all AI models to run exclusively on-device without network handshakes.',
    defaultOn: true,
  },
  {
    title: 'End-to-End Encryption',
    description: 'Encrypt zero-knowledge backups and files stored within the local cluster.',
    defaultOn: true,
  },
  {
    title: 'Anonymous Analytics',
    description: 'Share telemetry reports back to the core nodes to help optimize compiler pipelines.',
    defaultOn: false,
  },
] as const;

const CONNECTED_SERVICES = [
  { name: 'Tau Mail', status: 'Connected', online: true },
  { name: 'Tau Cloud', status: 'Connected', online: true },
  { name: 'Tau Browser', status: 'Not Connected', online: false },
] as const;

export default function TauAiSettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('Privacy');
  const [toggles, setToggles] = useState(PRIVACY_TOGGLES.map((t) => t.defaultOn));

  return (
    <TauAiAppShell active="settings">
      <TauAiPageHeader
        title="Settings"
        subtitle="Manage your personal AI environment preferences"
      />

      <div className="flex min-h-0 w-full flex-1 gap-[40px]">
        <nav className="flex w-[280px] shrink-0 flex-col gap-[8px]">
          {SETTINGS_SECTIONS.map((section) => {
            const isActive = activeSection === section;
            return (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`rounded-[8px] border px-[16px] py-[12px] text-left text-[14px] ${
                  isActive
                    ? 'border-[rgba(212,168,67,0.16)] bg-[rgba(212,168,67,0.16)] font-semibold text-[#d4a843]'
                    : 'border-transparent font-normal text-[#999]'
                }`}
              >
                {section}
              </button>
            );
          })}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col gap-[24px]">
          {activeSection === 'Privacy' ? (
            <>
              <div className="flex w-full flex-col gap-[20px] rounded-[12px] border border-[#222] bg-[#111] p-[24px]">
                <h2 className="text-[16px] font-bold text-[#d4a843]">Data Privacy</h2>
                <div className="flex flex-col gap-[16px]">
                  {PRIVACY_TOGGLES.map((row, i) => (
                    <div key={row.title}>
                      <div className="flex items-center justify-between gap-[16px]">
                        <div className="max-w-[500px]">
                          <p className="text-[14px] font-semibold text-white">{row.title}</p>
                          <p className="text-[12px] text-[#999]">{row.description}</p>
                        </div>
                        <TauAiToggle
                          checked={toggles[i]}
                          onChange={(v) =>
                            setToggles((prev) => prev.map((p, idx) => (idx === i ? v : p)))
                          }
                        />
                      </div>
                      {i < PRIVACY_TOGGLES.length - 1 ? (
                        <div className="mt-[16px] h-px bg-[#222]" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-col gap-[16px] rounded-[12px] border border-[#222] bg-[#111] p-[24px]">
                <h2 className="text-[16px] font-bold text-[#d4a843]">Data Retention</h2>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="flex items-center gap-[12px] rounded-[8px] border border-[#222] bg-black px-[16px] py-[10px] text-[14px] text-white"
                  >
                    30 days
                    <TauAiIcon src={tauAiAssets.icons.arrowDown} size={14} />
                  </button>
                  <button
                    type="button"
                    className="rounded-[20px] border border-[#991b1b] px-[20px] py-[10px] text-[13px] font-semibold text-[#f87171]"
                    title="UI only — backend integration pending"
                  >
                    Clear All Data
                  </button>
                </div>
              </div>

              <div className="flex w-full flex-col gap-[16px] rounded-[12px] border border-[#222] bg-[#111] p-[24px]">
                <h2 className="text-[16px] font-bold text-[#d4a843]">Connected Services</h2>
                <div className="flex flex-col gap-[12px]">
                  {CONNECTED_SERVICES.map((svc) => (
                    <div key={svc.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-[12px]">
                        <span
                          className={`size-[6px] rounded-[3px] ${svc.online ? 'bg-[#4ade80]' : 'bg-[#999]'}`}
                        />
                        <span className="text-[14px] font-medium text-white">{svc.name}</span>
                        <span className="text-[12px] text-[#999]">({svc.status})</span>
                      </div>
                      <button type="button" className="text-[13px] font-semibold text-[#d4a843]">
                        Manage
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-[16px]">
                <button
                  type="button"
                  className="rounded-[20px] border border-[#d4a843] px-[20px] py-[10px] text-[13px] font-semibold text-[#d4a843]"
                >
                  Export My Data
                </button>
                <button
                  type="button"
                  className="rounded-[20px] border border-[#991b1b] px-[20px] py-[10px] text-[13px] font-semibold text-[#f87171]"
                >
                  Delete Account
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-[12px] border border-[rgba(212,168,67,0.16)] bg-[#111] p-[24px] text-[14px] text-[#999]">
              <p className="font-semibold text-white">{activeSection}</p>
              <p className="mt-[8px]">
                Figma-faithful subnav item — settings persistence and backend wiring pending (AI-9
                batch 2 boundary).
              </p>
            </div>
          )}
        </div>
      </div>
    </TauAiAppShell>
  );
}

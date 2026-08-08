'use client';

import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';

export function TauAiEngineStatus() {
  return (
    <div className="flex items-center gap-[8px] rounded-[20px] border border-[rgba(212,168,67,0.16)] bg-[#111] px-[12px] py-[6px]">
      <span className="size-[6px] shrink-0 rounded-[3px] bg-[#d4a843]" />
      <span className="whitespace-nowrap text-[12px] font-semibold text-[#d4a843]">TAU ENGINE: LOCAL</span>
    </div>
  );
}

type TauAiTopBarProps = {
  showBell?: boolean;
  right?: React.ReactNode;
};

export function TauAiTopBar({ showBell = true, right }: TauAiTopBarProps) {
  return (
    <div className="flex w-full shrink-0 items-center justify-end gap-[16px]">
      {showBell ? (
        <button
          type="button"
          className="flex size-[40px] items-center justify-center rounded-[20px] border border-[#222] bg-[#111]"
          aria-label="Notifications"
        >
          <TauAiIcon src={tauAiAssets.icons.bell} size={18} />
        </button>
      ) : null}
      {right ?? <TauAiEngineStatus />}
    </div>
  );
}

type TauAiPageHeaderProps = {
  title: string;
  subtitle?: string;
  showBell?: boolean;
  right?: React.ReactNode;
};

export function TauAiPageHeader({ title, subtitle, showBell = true, right }: TauAiPageHeaderProps) {
  return (
    <div className="flex w-full shrink-0 items-center justify-between">
      <div className="flex flex-col gap-[4px]">
        <h1 className="text-[28px] font-bold text-white">{title}</h1>
        {subtitle ? <p className="text-[14px] text-[#999]">{subtitle}</p> : null}
      </div>
      <TauAiTopBar showBell={showBell} right={right} />
    </div>
  );
}

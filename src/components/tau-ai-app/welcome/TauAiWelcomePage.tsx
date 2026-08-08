'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { outfit } from '@/lib/website/fonts';
import { tauAiAssets } from '@/lib/tau-ai-app/assets';
import { tauAiWelcomeTasks } from '@/lib/tau-ai-app/demo-data';
import { useTauAiSession } from '@/lib/tau-ai-app/session-context';
import TauAiIcon from '@/components/tau-ai-app/shared/TauAiIcon';
import TauAiLogo from '@/components/tau-ai-app/shared/TauAiLogo';

export default function TauAiWelcomePage() {
  const router = useRouter();
  const { isLoggedIn } = useTauAiSession();

  const handleGetStarted = () => {
    router.push(isLoggedIn ? '/tau-ai-app/home' : '/tau-ai-app/auth');
  };

  return (
    <div
      className={`${outfit.className} flex size-full min-h-screen flex-col items-center justify-between bg-black p-[48px] text-white`}
      data-name="tau-ai-welcome"
    >
      <div className="flex w-[960px] max-w-full shrink-0 flex-col items-center gap-[48px]">
        <TauAiLogo variant="lockup" width={320} height={140} />

        <div className="flex w-full shrink-0 flex-col items-center gap-[16px] text-center">
          <h1 className="text-[40px] font-bold leading-normal text-white">
            Welcome to <span className="text-[#d4a843]">Tau AI</span>
          </h1>
          <p className="text-[18px] font-medium uppercase leading-normal text-[#d4a843]">
            Intelligent. Private. Yours.
          </p>
        </div>

        <div className="flex w-full shrink-0 gap-[16px]">
          {tauAiWelcomeTasks.map((task) => (
            <div
              key={task.title}
              className="flex min-w-0 flex-1 flex-col gap-[12px] rounded-[12px] border border-[rgba(212,168,67,0.16)] bg-[#111] p-[24px]"
            >
              <TauAiIcon src={tauAiAssets.icons.sparkle} size={24} />
              <div className="flex w-full flex-col gap-[4px]">
                <p className="whitespace-nowrap text-[16px] font-semibold text-white">{task.title}</p>
                <p className="text-[13px] leading-[18px] text-[#999]">{task.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleGetStarted}
          className="flex h-[56px] shrink-0 items-center justify-center rounded-[30px] bg-gradient-to-r from-[#f0d78c] via-[#d4a843] to-[#b8922e] px-[48px] py-[16px] text-[16px] font-bold text-black"
        >
          {isLoggedIn ? 'Continue to Tau AI' : 'Get Started'}
        </button>

        {!isLoggedIn ? (
          <p className="text-[14px] text-[#999]">
            Already have a Tau ID?{' '}
            <Link href="/tau-ai-app/auth" className="font-semibold text-[#d4a843] hover:underline">
              Sign in
            </Link>
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-[8px] rounded-[20px] border border-[#222] bg-[#111] px-[20px] py-[10px]">
        <TauAiIcon src={tauAiAssets.icons.shield} size={14} />
        <p className="whitespace-nowrap text-[12px] text-[#999]">
          Your data stays yours. Always private. Always encrypted.
        </p>
      </div>
    </div>
  );
}

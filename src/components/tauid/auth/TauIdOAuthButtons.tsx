'use client';

import Link from 'next/link';

type TauIdOAuthButtonsProps = {
  redirectTo?: string;
};

export default function TauIdOAuthButtons({ redirectTo = '/tauid/dashboard' }: TauIdOAuthButtonsProps) {
  const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/tauid/dashboard';

  return (
    <div className="space-y-3">
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#222228]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#121214] px-2 text-[#71717a]">Or continue with</span>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={`/api/auth/oauth/google?redirect=${encodeURIComponent(safeRedirect)}`}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#222228] bg-[#0d0d0f] px-4 py-3 text-sm font-medium text-white transition-colors hover:border-[rgba(255,184,0,0.3)]"
        >
          Google
        </Link>
        <Link
          href={`/api/auth/oauth/github?redirect=${encodeURIComponent(safeRedirect)}`}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#222228] bg-[#0d0d0f] px-4 py-3 text-sm font-medium text-white transition-colors hover:border-[rgba(255,184,0,0.3)]"
        >
          GitHub
        </Link>
      </div>
    </div>
  );
}

import TauWebsiteNavigation from '@/components/website/layout/Navigation';
import TauWebsiteFooter from '@/components/website/layout/Footer';
import { geistSans, geistMono, instrumentSerif, inter, outfit } from '@/lib/website/fonts';
import { clsx } from 'clsx';
import '../website.css';

type WebsiteShellProps = {
  children: React.ReactNode;
  variant?: 'default' | 'product';
  bare?: boolean;
  className?: string;
};

export default function WebsiteShell({
  children,
  variant = 'default',
  bare = false,
  className,
}: WebsiteShellProps) {
  return (
    <div
      className={clsx(
        'tau-website',
        geistSans.className,
        geistMono.variable,
        instrumentSerif.variable,
        inter.variable,
        outfit.variable,
        'min-h-screen antialiased',
        variant === 'product' ? 'bg-[#080809]' : 'bg-[#0a0a0b]',
        className,
      )}
    >
      {!bare && <TauWebsiteNavigation />}
      <main className="relative text-white">{children}</main>
      {!bare && <TauWebsiteFooter />}
    </div>
  );
}

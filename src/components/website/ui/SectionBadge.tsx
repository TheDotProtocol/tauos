import { instrumentSerif } from '@/lib/website/fonts';

type SectionBadgeProps = {
  number: string;
  label: string;
};

/** Figma section badge — gold pill + gold uppercase label */
export default function SectionBadge({ number, label }: SectionBadgeProps) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="rounded bg-[#d4af37] px-2.5 py-1 text-[10px] font-bold uppercase text-[#0a0a0b]">
        {number}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wide text-[#d4af37]">
        {label}
      </span>
    </div>
  );
}

export function SectionHeadline({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`${instrumentSerif.className} text-white ${className}`}>
      {children}
    </h2>
  );
}

type SectionLabelProps = {
  children: React.ReactNode;
};

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-0.5 w-3 bg-[#d4af37]" aria-hidden />
      <p className="text-[13px] font-bold uppercase tracking-wide text-[#d4af37]">{children}</p>
    </div>
  );
}

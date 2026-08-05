type ProductSectionHeaderProps = {
  badge: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  muted?: boolean;
};

export default function ProductSectionHeader({
  badge,
  title,
  description,
  align = 'center',
  muted = false,
}: ProductSectionHeaderProps) {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex flex-col gap-4 ${alignClass}`}>
      <p className="text-sm font-bold uppercase tracking-wide text-[#d4af37]">{badge}</p>
      <h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl text-white">{title}</h2>
      {description && (
        <p className={`max-w-[640px] text-base leading-relaxed ${muted ? 'text-[#8e8e93]' : 'text-[#a0a0a0]'}`}>
          {description}
        </p>
      )}
    </div>
  );
}

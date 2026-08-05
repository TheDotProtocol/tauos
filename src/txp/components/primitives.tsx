import { cn } from '@/lib/utils';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
};

/** Full-width responsive container — matches About page (max-w-7xl). */
export function TxpContainer({ children, className, wide }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-8 lg:px-10',
        wide ? 'max-w-[90rem]' : 'max-w-7xl',
        className
      )}
    >
      {children}
    </div>
  );
}

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'elevated' | 'void';
};

export function TxpSection({ children, className, id, variant = 'default' }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden',
        'py-[var(--txp-section-y)]',
        variant === 'elevated' && 'bg-[hsl(var(--txp-surface-1))]',
        variant === 'void' && 'bg-black',
        className
      )}
    >
      {children}
    </section>
  );
}

type HeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  wide?: boolean;
};

export function TxpGradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r from-yellow-400 via-[#FFD700] to-orange-500 bg-clip-text text-transparent',
        className
      )}
    >
      {children}
    </span>
  );
}

export function TxpSectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
  wide = false,
}: HeadingProps) {
  return (
    <div
      className={cn(
        'mb-16 md:mb-20 lg:mb-24',
        wide ? 'max-w-4xl' : 'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        align === 'left' && 'text-left',
        className
      )}
    >
      {eyebrow ? (
        <p className="text-yellow-400/90 text-xs sm:text-sm font-medium tracking-[0.28em] uppercase mb-5 md:mb-6">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          'font-bold tracking-tight text-white leading-[1.06]',
          'text-[clamp(2.25rem,5vw,4.5rem)]',
          subtitle ? 'mb-6 md:mb-8' : ''
        )}
      >
        <TxpGradientText>{title}</TxpGradientText>
      </h2>
      {subtitle ? (
        <p
          className={cn(
            'text-gray-300/95 leading-[1.75]',
            'text-[clamp(1.0625rem,2vw,1.375rem)]',
            'max-w-[42rem]',
            align === 'center' && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/** Subtle chapter divider — keynote page turn. */
export function TxpChapterRule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'mx-auto h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-yellow-400/35 to-transparent',
        className
      )}
    />
  );
}

export function TxpLead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'text-[clamp(1.125rem,2.2vw,1.5rem)] text-gray-300 leading-[1.8] max-w-[36rem]',
        className
      )}
    >
      {children}
    </p>
  );
}

export function TxpGoldAccent({ children }: { children: React.ReactNode }) {
  return <span className="text-yellow-400 font-semibold">{children}</span>;
}

export function TxpGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute rounded-full blur-[120px] bg-yellow-400/10', className)}
    />
  );
}

export function TxpGlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border backdrop-blur-xl p-6 md:p-8 h-full',
        'bg-gray-900/30 border-gray-800',
        'hover:border-yellow-400/30 transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TxpSplitSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center', className)}>
      {children}
    </div>
  );
}

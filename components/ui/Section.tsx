import type { ReactNode } from 'react';

import { cn } from '@/lib/format';

type SectionTone = 'white' | 'mist' | 'ink';

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: SectionTone;
  ariaLabelledby?: string;
};

const tones: Record<SectionTone, string> = {
  white: 'bg-bg-0 text-ink-0',
  mist: 'bg-bg-1 text-ink-0',
  ink: 'bg-ink-0 text-white',
};

export default function Section({
  id,
  children,
  className,
  tone = 'white',
  ariaLabelledby,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn('section', tones[tone], className)}
    >
      {children}
    </section>
  );
}

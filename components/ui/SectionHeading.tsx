import type { ReactNode } from 'react';

import { cn } from '@/lib/format';

import Reveal from './Reveal';

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
  aside?: ReactNode;
  id?: string;
  className?: string;
  tone?: 'light' | 'dark';
};

export default function SectionHeading({
  index,
  eyebrow,
  title,
  lede,
  aside,
  id,
  className,
  tone = 'light',
}: SectionHeadingProps) {
  return (
    <div className={cn('grid gap-8 lg:grid-cols-12 lg:gap-12', className)}>
      <Reveal className="lg:col-span-7">
        <div className="mb-5 flex items-center gap-4">
          <span className={cn('section-index', tone === 'dark' && 'text-bg-2')}>{index}</span>
          <span
            className={cn(
              'h-px w-12 bg-line',
              tone === 'dark' && 'bg-white/20',
            )}
            aria-hidden="true"
          />
          <span className={cn('eyebrow', tone === 'dark' && 'text-bg-2')}>{eyebrow}</span>
        </div>
        <h2
          id={id}
          className={cn('section-title', tone === 'dark' && 'text-white')}
        >
          {title}
        </h2>
      </Reveal>
      {(lede || aside) && (
        <Reveal className="lg:col-span-5 lg:pt-12" delay={0.08}>
          {lede && (
            <p className={cn('lede', tone === 'dark' && 'text-bg-2')}>{lede}</p>
          )}
          {aside}
        </Reveal>
      )}
    </div>
  );
}

import AnimatedNumber from '@/components/ui/AnimatedNumber';
import Reveal from '@/components/ui/Reveal';
import { everestData } from '@/lib/data';
import { cn } from '@/lib/format';

export default function Stats() {
  return (
    <section id="stats" aria-labelledby="stats-title" className="relative z-20 -mt-8 pb-2 md:-mt-12">
      <div className="shell">
        <h2 id="stats-title" className="sr-only">
          Эверест в цифрах
        </h2>
        <Reveal>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line shadow-lift lg:grid-cols-4">
            {everestData.stats.map((stat, index) => (
              <div
                key={stat.id}
                className={cn(
                  'group bg-bg-0 p-5 transition-colors duration-500 hover:bg-bg-1 sm:p-6 md:p-8',
                  index === 3 && 'col-span-2 lg:col-span-1',
                )}
              >
                <dt className="mb-5 flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] text-accent">
                  <span>0{index + 1}</span>
                  <span className="h-px w-5 bg-line" aria-hidden="true" />
                  <span>{stat.label}</span>
                </dt>
                <dd>
                  <span className="number-display text-[clamp(1.8rem,2.8vw,2.9rem)]">
                    <AnimatedNumber
                      value={stat.value}
                      decimals={stat.decimals}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </span>
                  <p className="mt-4 max-w-[15rem] text-[11px] leading-5 text-ink-1">{stat.note}</p>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

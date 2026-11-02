'use client';

import { motion, useReducedMotion } from 'framer-motion';

import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { everestData } from '@/lib/data';
import { cn, formatMoney } from '@/lib/format';

const cost = everestData.cost;
const chartMax = Math.max(...cost.breakdown.map((item) => item.max));

export default function CostSection() {
  const reduced = useReducedMotion();

  return (
    <section id="cost" aria-labelledby="cost-title" className="section bg-bg-1">
      <div className="shell">
        <SectionHeading
          index="06"
          eyebrow={cost.eyebrow}
          title={cost.title}
          lede={cost.intro}
          id="cost-title"
          aside={
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-line bg-bg-0 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-1" aria-hidden="true" />
              ориентиры на {cost.year} год
            </div>
          }
        />

        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-5" delay={0.02}>
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-lg bg-ink-0 p-7 text-white md:p-9">
              <div
                className="pointer-events-none absolute -right-10 -top-12 h-56 w-56 rounded-full border border-white/10"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -right-2 -top-4 h-40 w-40 rounded-full border border-white/10"
                aria-hidden="true"
              />
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-bg-2/70">
                  {cost.total.label}
                </p>
                <p className="mt-8 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-display text-[clamp(1.6rem,2.7vw,2.6rem)] font-semibold leading-tight tracking-[-0.06em]">
                  <span className="whitespace-nowrap">{formatMoney(cost.total.min)}</span>
                  <span className="text-bg-2/50">—</span>
                  <span className="whitespace-nowrap">{formatMoney(cost.total.max)}</span>
                </p>
                <p className="mt-6 max-w-sm text-sm leading-7 text-bg-2/80">{cost.total.note}</p>
              </div>
              <div className="mt-12 flex items-center justify-between border-t border-white/15 pt-4 text-[9px] uppercase tracking-[0.16em] text-bg-2/60">
                <span>полный пакет</span>
                <span>USD · {cost.year}</span>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-2">
            {cost.routes.map((item, index) => (
              <Reveal
                key={item.id}
                delay={0.05 + index * 0.04}
                className={cn(index === cost.routes.length - 1 && 'sm:col-span-2')}
              >
                <article className="card flex h-full flex-col justify-between p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift md:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.16em] text-accent">
                        {item.country}
                      </p>
                      <h3 className="mt-2 font-display text-lg font-semibold tracking-[-0.02em] text-ink-0">
                        {item.label}
                      </h3>
                    </div>
                    <span className="font-display text-[10px] font-semibold tracking-[0.14em] text-accent">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="mt-8">
                    <p className="font-display text-2xl font-semibold tracking-[-0.04em] text-ink-0">
                      {formatMoney(item.min)}
                      <span className="mx-1.5 text-ink-2">—</span>
                      {formatMoney(item.max)}
                    </p>
                    <p className="mt-2 text-[11px] leading-5 text-ink-1">{item.note}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-16 md:mt-24">
          <div className="rounded-lg border border-line bg-bg-0 p-6 md:p-9">
            <div className="flex flex-col justify-between gap-4 border-b border-line pb-5 md:flex-row md:items-end">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink-0">
                Из чего складывается южный пакет
              </h3>
              <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
                оценка на сезон {cost.year} · USD
              </p>
            </div>

            <div className="mt-8 space-y-7">
              {cost.breakdown.map((item, index) => {
                const start = (item.min / chartMax) * 100;
                const width = ((item.max - item.min) / chartMax) * 100;
                return (
                  <div key={item.id} className="group">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <div className="flex items-baseline gap-3">
                        <span className="font-display text-[10px] font-semibold tracking-[0.12em] text-accent">
                          0{index + 1}
                        </span>
                        <span className="text-sm font-medium text-ink-0">{item.label}</span>
                      </div>
                      <span className="font-display text-xs font-semibold tabular-nums text-ink-0">
                        {formatMoney(item.min)} — {formatMoney(item.max)}
                      </span>
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-bg-2/70">
                      <motion.div
                        className="relative h-full rounded-full bg-ink-1/60 transition-colors duration-300 group-hover:bg-ink-0"
                        style={{ marginLeft: `${start}%`, width: `${Math.max(width, 1.5)}%` }}
                        initial={reduced ? false : { scaleX: 0 }}
                        whileInView={reduced ? undefined : { scaleX: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.9, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <p className="mt-2 max-w-2xl text-[11px] leading-5 text-ink-1">{item.note}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between border-t border-line pt-3 text-[9px] uppercase tracking-[0.14em] text-accent">
              <span>0</span>
              <span>$10 000</span>
              <span>$20 000</span>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-8">
          <div className="grid gap-4 md:grid-cols-3">
            {cost.notes.map((note, index) => (
              <div key={note} className="border-l border-line pl-4">
                <span className="font-display text-[10px] font-semibold tracking-[0.12em] text-accent">
                  0{index + 1}
                </span>
                <p className="mt-2 text-[11px] leading-6 text-ink-1">{note}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

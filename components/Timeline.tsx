'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import StatusChip from '@/components/ui/StatusChip';
import { everestData, sourceById } from '@/lib/data';
import type { Source } from '@/lib/schema';
import { cn } from '@/lib/format';

const items = everestData.history;

export default function Timeline() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string>('1953');
  const [hoverId, setHoverId] = useState<string | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      if (line.current) line.current.style.transform = 'scaleY(1)';
      return;
    }

    let cleanup: (() => void) | undefined;
    const setup = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      if (!root.current || !line.current) return;

      const context = gsap.context(() => {
        gsap.fromTo(
          line.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top 72%',
              end: 'bottom 68%',
              scrub: 0.7,
            },
          },
        );
      }, root);

      requestAnimationFrame(() => ScrollTrigger.refresh());
      cleanup = () => context.revert();
    };

    void setup();
    return () => cleanup?.();
  }, [reduced]);

  return (
    <section id="history" aria-labelledby="history-title" className="section bg-bg-1">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="История"
          title="Сто лет на одном гребне"
          lede="От разведки 1921 года до коммерческих экспедиций и спора о том, кто был первым. Каждая точка отмечена по степени достоверности."
          id="history-title"
          aside={
            <div className="mt-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-accent">
              <span className="h-px w-10 bg-line" aria-hidden="true" />
              {items.length} точек · 1921–2024
            </div>
          }
        />

        <div ref={root} className="relative mt-14 md:mt-20">
          <div
            className="absolute bottom-3 left-[15px] top-3 w-px bg-line md:left-[143px]"
            aria-hidden="true"
          >
            <div ref={line} className="timeline-line h-full w-px origin-top bg-ink-0" />
          </div>

          <ol className="space-y-1">
            {items.map((entry, index) => {
              const isOpen = openId === entry.id;
              const isActive = isOpen || hoverId === entry.id || (!openId && index === 0);
              const sources = entry.sourceIds
                .map((id) => sourceById.get(id))
                .filter((source): source is Source => source !== undefined);

              return (
                <li
                  key={entry.id}
                  className="relative grid grid-cols-[32px_1fr] gap-4 md:grid-cols-[120px_48px_1fr] md:gap-0"
                  onMouseEnter={() => setHoverId(entry.id)}
                  onMouseLeave={() => setHoverId(null)}
                >
                  <div className="hidden pr-8 pt-7 text-right md:block">
                    <p className="font-display text-lg font-semibold tracking-[-0.03em] text-ink-0">
                      {entry.year}
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-accent">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                  </div>

                  <div className="relative flex justify-center pt-7 md:block">
                    <button
                      type="button"
                      className="timeline-node relative z-10"
                      data-active={isActive}
                      aria-label={`Открыть событие ${entry.year}: ${entry.title}`}
                      aria-expanded={isOpen}
                      aria-controls={`history-panel-${entry.id}`}
                      onClick={() => setOpenId(isOpen ? '' : entry.id)}
                      onFocus={() => setHoverId(entry.id)}
                      onBlur={() => setHoverId(null)}
                    />
                  </div>

                  <div className="pb-4">
                    <div className="timeline-card" data-open={isOpen}>
                      <button
                        type="button"
                        className="w-full text-left"
                        aria-expanded={isOpen}
                        aria-controls={`history-panel-${entry.id}`}
                        onClick={() => setOpenId(isOpen ? '' : entry.id)}
                      >
                        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                          <span className="text-[10px] uppercase tracking-[0.16em] text-accent">
                            {entry.date}
                          </span>
                          <span className="h-3 w-px bg-line" aria-hidden="true" />
                          <span className="text-[10px] uppercase tracking-[0.16em] text-ink-1">
                            {entry.route}
                          </span>
                          <StatusChip status={entry.status} label={entry.statusLabel} className="ml-auto" />
                        </div>
                        <h3 className="font-display text-xl font-semibold leading-snug tracking-[-0.03em] text-ink-0 md:text-[1.65rem]">
                          {entry.title}
                        </h3>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-1">{entry.summary}</p>
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-1">
                          <span>{isOpen ? 'Свернуть' : 'Подробнее'}</span>
                          <span
                            className={cn(
                              'inline-flex h-6 w-6 items-center justify-center rounded-full border border-line transition-transform duration-300',
                              isOpen && 'rotate-45',
                            )}
                            aria-hidden="true"
                          >
                            +
                          </span>
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`history-panel-${entry.id}`}
                            initial={reduced ? false : { height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={reduced ? undefined : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-5 border-t border-line pt-5">
                              <p className="text-sm leading-7 text-ink-1">{entry.detail}</p>
                              <p className="mt-4 text-xs leading-6 text-ink-1">
                                <span className="font-medium text-ink-0">Участники: </span>
                                {entry.participants}
                              </p>
                              {sources.length > 0 && (
                                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                                  <span className="text-[9px] uppercase tracking-[0.16em] text-accent">
                                    Источники
                                  </span>
                                  {sources.map((source) => (
                                    <a
                                      key={source.id}
                                      href={source.url}
                                      target="_blank"
                                      rel="noreferrer noopener"
                                      className="inline-flex items-center gap-1 text-[11px] text-ink-1 underline decoration-line underline-offset-2 transition-colors hover:text-ink-0"
                                    >
                                      {source.title}
                                      <ArrowUpRight size={10} strokeWidth={1.5} aria-hidden="true" />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <Reveal className="mt-8 border-t border-line pt-6 md:ml-[168px]">
          <p className="max-w-2xl text-xs leading-6 text-ink-1">
            Даты и формулировки сверены с Himalayan Database и первичными отчётами. Спорные
            эпизоды не превращены в уверенные утверждения: статус указан у каждого события.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

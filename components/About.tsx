import Image from 'next/image';

import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import StatusChip from '@/components/ui/StatusChip';
import { everestData } from '@/lib/data';
import { withBase } from '@/lib/withBase';

export default function About() {
  const { about, heightHistory, peak } = everestData;

  return (
    <Section id="mountain" tone="white" ariaLabelledby="mountain-title">
      <div className="shell">
        <SectionHeading
          index="02"
          eyebrow={about.eyebrow}
          title={about.title}
          lede={about.statement}
          id="mountain-title"
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:col-span-8">
            {about.cards.map((card, index) => (
              <Reveal key={card.id} delay={index * 0.06} distance={0}>
                <article className="group h-full bg-bg-0 p-6 transition-colors duration-500 hover:bg-bg-1 md:p-8">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="mono-label">{card.label}</span>
                    <span className="font-display text-[10px] font-semibold tracking-[0.16em] text-line">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="max-w-xs font-display text-xl font-semibold leading-snug tracking-[-0.025em] text-ink-0 md:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-ink-1">{card.text}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="lg:col-span-4" delay={0.12}>
            <figure className="h-full">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-bg-1">
                <Image
                  src={withBase('/images/everest-portrait.avif')}
                  alt="Эверест с юго-запада, вид с Кала-Паттар: западное плечо и вершина над ледником Кхумбу"
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover grayscale transition-transform duration-[1200ms] ease-mountain hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-0/55 via-transparent to-transparent" aria-hidden="true" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-[10px] uppercase tracking-[0.16em] text-white/75">
                  Кала-Паттар · 5 644 м
                </figcaption>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-5">
                {peak.names.slice(1).map((name) => (
                  <div key={name.name}>
                    <p className="font-display text-sm font-semibold text-ink-0">{name.name}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-accent">{name.language}</p>
                  </div>
                ))}
              </div>
            </figure>
          </Reveal>
        </div>

        <Reveal className="mt-20 md:mt-28">
          <div className="flex flex-col justify-between gap-4 border-b border-line pb-5 md:flex-row md:items-end">
            <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink-0 md:text-2xl">
              Высота: как менялось число
            </h3>
            <p className="max-w-md text-xs leading-5 text-ink-1">
              Разные методы давали разные значения — особенно когда измеряли снег, а не скалу.
            </p>
          </div>
          <ol className="grid gap-8 pt-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
            {heightHistory.map((entry) => (
              <li key={entry.year} className="border-t border-line pt-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-xs font-semibold tracking-[0.1em] text-accent">
                    {entry.year}
                  </span>
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-accent"
                    aria-hidden="true"
                    title={entry.status === 'disputed' ? 'Оспаривается' : 'Подтверждено'}
                  />
                </div>
                <p className="mt-3 font-display text-lg font-semibold tracking-[-0.02em] text-ink-0">
                  {entry.value}
                </p>
                <p className="mt-2 text-[11px] leading-5 text-ink-1">{entry.method}</p>
                <details className="group mt-3">
                  <summary className="cursor-pointer list-none text-[10px] font-medium uppercase tracking-[0.14em] text-accent">
                    Контекст
                  </summary>
                  <p className="mt-2 text-[11px] leading-5 text-ink-1">{entry.note}</p>
                </details>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-16 md:mt-24">
          <div className="grid gap-px overflow-hidden rounded-lg border border-ink-0/10 bg-white/10 sm:grid-cols-3">
            {about.altitudeFacts.map((fact) => (
              <div key={fact.label} className="bg-ink-0 p-6 text-white md:p-8">
                <p className="font-display text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                  {fact.value}
                </p>
                <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.18em] text-bg-2">
                  {fact.label}
                </p>
                <p className="mt-3 text-xs leading-6 text-bg-2/80">{fact.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.14em] text-accent">
          <span>Статусы:</span>
          <StatusChip status="confirmed" />
          <StatusChip status="disputed" />
          <span className="normal-case tracking-normal text-ink-1">
            Спорные утверждения отмечены и объяснены в разделе «Знания».
          </span>
        </div>
      </div>
    </Section>
  );
}

import Image from 'next/image';

import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import StatusChip from '@/components/ui/StatusChip';
import { everestData } from '@/lib/data';
import type { Person } from '@/lib/schema';
import { withBase } from '@/lib/withBase';

const people = everestData.people;

function PersonCard({ person, index }: { person: Person; index: number }) {
  return (
    <article className="group flex h-full flex-col bg-bg-0">
      <div className="relative aspect-[3/2] overflow-hidden bg-bg-1">
        <Image
          src={withBase(person.photo)}
          alt={person.photoAlt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          style={{ objectPosition: person.photoPosition }}
          className="object-cover grayscale transition-[filter,transform] duration-700 ease-mountain group-hover:scale-[1.015] group-hover:grayscale-0"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-0/75 via-ink-0/10 to-transparent" />
        <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-ink-0/55 font-display text-xs font-semibold tracking-[0.06em] text-white backdrop-blur">
          {person.initials}
        </span>
        <span className="absolute right-5 top-5 rounded-full bg-ink-0/55 px-2.5 py-1 font-display text-[10px] font-semibold tracking-[0.16em] text-white backdrop-blur">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.14em]">
          <span className="text-accent">{person.country}</span>
          <span className="h-1 w-1 rounded-full bg-line" aria-hidden="true" />
          <span className="text-ink-1">{person.route}</span>
        </div>

        <h3 className="mt-5 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink-0">
          {person.name}
        </h3>
        <p className="mt-1 font-display text-xs font-medium tracking-[0.08em] text-accent">
          {person.years}
        </p>
        <p className="mt-3 text-sm leading-6 text-ink-1">{person.role}</p>
        <p className="mt-5 text-sm leading-7 text-ink-1">{person.bio}</p>

        <div className="mt-auto pt-6">
          <div className="border-t border-line pt-4">
            <p className="text-[9px] uppercase tracking-[0.16em] text-accent">Известен</p>
            <p className="mt-2 text-xs leading-6 text-ink-0">{person.knownFor}</p>
          </div>
          {person.note && (
            <div className="mt-4 flex items-start gap-3 rounded border border-line bg-bg-1 px-3 py-3">
              {person.status && <StatusChip status={person.status} />}
              <p className="text-[11px] leading-5 text-ink-1">{person.note}</p>
            </div>
          )}
          <a
            href={person.photoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-5 flex items-start gap-1.5 text-[9px] leading-4 text-ink-1 transition-colors hover:text-ink-0"
          >
            <span aria-hidden="true">Фото:</span>
            <span>
              {person.photoCredit} · {person.photoLicense}
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}


export default function PeopleSection() {
  return (
    <section id="people" aria-labelledby="people-title" className="section bg-bg-0">
      <div className="shell">
        <SectionHeading
          index="04"
          eyebrow="Люди"
          title="Лица, которые сделали историю"
          lede="Альпинисты, шерпы, гиды и писатели. Десять биографий, без которых разговор об Эвересте превращается в набор дат."
          id="people-title"
          aside={
            <div className="mt-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-accent">
              <span className="h-px w-10 bg-line" aria-hidden="true" />
              {people.length} человек · 1886–2026
            </div>
          }
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2 lg:mt-20">
          {people.map((person, index) => (
            <Reveal key={person.id} delay={(index % 2) * 0.05} distance={0}>
              <PersonCard person={person} index={index} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 border-t border-line pt-5">
          <p className="max-w-3xl text-[11px] leading-6 text-ink-1">
            Биографии — краткие редакционные справки. Спорные эпизоды (прежде всего восхождение
            Мэллори и Ирвина 1924 года) отмечены отдельно. Фотографии — Wikimedia Commons;
            автор и лицензия указаны на каждой карточке. Полные ссылки — в разделе «Знания».
          </p>
        </Reveal>
      </div>
    </section>
  );
}

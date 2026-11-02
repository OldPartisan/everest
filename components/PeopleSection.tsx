import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import StatusChip from '@/components/ui/StatusChip';
import { everestData } from '@/lib/data';
import type { Person } from '@/lib/schema';

const people = everestData.people;

function PersonCard({ person, index }: { person: Person; index: number }) {
  return (
    <article className="flex h-full flex-col bg-bg-0 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line font-display text-sm font-semibold tracking-[0.06em] text-ink-0">
            {person.initials}
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-accent">{person.country}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-ink-1">{person.route}</p>
          </div>
        </div>
        <span className="font-display text-[10px] font-semibold tracking-[0.16em] text-accent">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3 className="mt-7 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink-0">
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
            Мэллори и Ирвина 1924 года) отмечены отдельно; полные ссылки — в разделе «Знания».
          </p>
        </Reveal>
      </div>
    </section>
  );
}

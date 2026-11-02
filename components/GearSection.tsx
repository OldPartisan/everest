import GearIcon from '@/components/GearIcon';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { everestData } from '@/lib/data';

const gear = everestData.gear;
const itemCount = gear.groups.reduce((total, group) => total + group.items.length, 0);

export default function GearSection() {
  return (
    <section id="gear" aria-labelledby="gear-title" className="section bg-bg-0">
      <div className="shell">
        <SectionHeading
          index="06"
          eyebrow={gear.eyebrow}
          title={gear.title}
          lede={gear.intro}
          id="gear-title"
          aside={
            <div className="mt-7 flex items-center gap-4 text-[10px] uppercase tracking-[0.16em] text-accent">
              <span className="h-px w-10 bg-line" aria-hidden="true" />
              {itemCount} предметов · {gear.groups.length} групп
            </div>
          }
        />

        <Reveal className="mt-12 md:mt-16">
          <div className="space-y-12 md:space-y-16">
            {gear.groups.map((group, groupIndex) => (
              <div key={group.id} className="border-t border-line pt-6 md:pt-8">
                <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-3">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-[10px] font-semibold tracking-[0.12em] text-accent">
                        0{groupIndex + 1}
                      </span>
                      <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink-0">
                        {group.label}
                      </h3>
                    </div>
                    <p className="mt-3 max-w-xs text-xs leading-6 text-ink-1">{group.caption}</p>
                  </div>

                  <div className="grid grid-cols-2 overflow-hidden rounded bg-bg-0 sm:grid-cols-3 lg:col-span-9 xl:grid-cols-4">
                    {group.items.map((item) => (
                      <article
                        key={item.id}
                        tabIndex={0}
                        aria-describedby={`gear-note-${item.id}`}
                        className="gear-item group relative flex min-h-[142px] flex-col justify-between border-b border-r border-line bg-bg-0 p-4 transition-colors duration-300 hover:bg-bg-1 focus-visible:bg-bg-1 md:p-5"
                      >
                        <GearIcon
                          name={item.icon}
                          className="h-7 w-7 text-ink-1 transition-transform duration-500 ease-mountain group-hover:-translate-y-0.5 group-hover:text-ink-0"
                        />
                        <p className="mt-5 max-w-[12rem] text-xs font-medium leading-5 text-ink-0">
                          {item.name}
                        </p>
                        <p className="mt-2 text-[10px] leading-5 text-ink-1 lg:hidden">
                          {item.note}
                        </p>
                        <div className="gear-tooltip" role="tooltip" id={`gear-note-${item.id}`}>
                          {item.note}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-10">
          <p className="max-w-3xl text-[11px] leading-6 text-ink-1">
            Наведите курсор или сфокусируйтесь на карточке, чтобы прочитать пояснение. На сенсорных
            экранах пояснение показано под названием. Снаряжение — не гарантия безопасности:
            подготовка, акклиматизация и решения на горе важнее.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

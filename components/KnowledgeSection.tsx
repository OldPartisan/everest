import { ArrowUpRight } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { everestData } from '@/lib/data';
import { cn } from '@/lib/format';
import type { Source } from '@/lib/schema';

const kindLabels: Record<Source['kind'], string> = {
  database: 'База данных',
  official: 'Официально',
  news: 'СМИ',
  archive: 'Архив',
  tertiary: 'Справочно',
  book: 'Книга',
};

const factStatus: Record<string, string> = {
  corrected: 'исправлено',
  clarified: 'уточнено',
};

function formatUpdated(value: string): string {
  const [year, month] = value.split('-');
  const months = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
  ];
  const monthIndex = Number(month) - 1;
  const monthName = months[monthIndex];
  return monthName && year ? `${monthName} ${year}` : value;
}

export default function KnowledgeSection() {
  return (
    <section id="knowledge" aria-labelledby="knowledge-title" className="section bg-bg-0">
      <div className="shell">
        <SectionHeading
          index="09"
          eyebrow="Словарь и источники"
          title="Язык высоты. Архив фактов."
          lede="Короткий словарь, который помогает читать репортажи с горы, и открытый список источников — с оговорками, а не безоговорочными истинами."
          id="knowledge-title"
          aside={
            <div className="mt-7 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-accent">
              <span className="h-px w-10 bg-line" aria-hidden="true" />
              данные: {formatUpdated(everestData.meta.updated)}
            </div>
          }
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink-0">
                Глоссарий
              </h3>
              <span className="text-[10px] uppercase tracking-[0.16em] text-accent">
                {everestData.glossary.length} терминов
              </span>
            </div>
            <div className="mt-2">
              {everestData.glossary.map((entry) => (
                <details key={entry.term} className="accordion-item">
                  <summary>
                    <span>{entry.term}</span>
                    <span className="mr-6 hidden text-[9px] font-normal uppercase tracking-[0.14em] text-accent sm:inline">
                      определение
                    </span>
                  </summary>
                  <div className="accordion-body">{entry.definition}</div>
                </details>
              ))}
            </div>
          </div>

          <aside className="space-y-12 lg:col-span-5">
            <Reveal>
              <div className="rounded-lg border border-line bg-bg-1 p-5 md:p-6">
                <p className="eyebrow">Метод</p>
                <p className="mt-4 text-sm leading-7 text-ink-1">
                  Мы отделяем подтверждённое от спорного, указываем год для денег и статистики и
                  даём ссылки на первичные источники там, где это возможно. Если данные
                  расходятся — это видно.
                </p>
                <div className="mt-5 grid gap-2 border-t border-line pt-4 text-[10px] uppercase tracking-[0.12em] text-ink-1">
                  <span>01 · дата и участники</span>
                  <span>02 · маршрут и контекст</span>
                  <span>03 · статус достоверности</span>
                </div>
              </div>
            </Reveal>

            <div>
              <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink-0">
                  Проверка фактов
                </h3>
                <span className="text-[10px] uppercase tracking-[0.14em] text-accent">
                  {everestData.factChecks.length}
                </span>
              </div>
              <div className="mt-2">
                {everestData.factChecks.map((check) => (
                  <details key={check.claim} className="accordion-item">
                    <summary>
                      <span className="pr-2">{check.claim}</span>
                    </summary>
                    <div className="accordion-body">
                      <span
                        className={cn(
                          'mb-2 inline-flex rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-[0.12em]',
                          check.status === 'corrected'
                            ? 'border-ink-0 bg-ink-0 text-white'
                            : 'border-line bg-bg-1 text-ink-1',
                        )}
                      >
                        {factStatus[check.status]}
                      </span>
                      <p>{check.correction}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink-0">
                  Источники
                </h3>
                <span className="text-[10px] uppercase tracking-[0.14em] text-accent">
                  {everestData.sources.length}
                </span>
              </div>
              <ul className="mt-2">
                {everestData.sources.map((source) => (
                  <li key={source.id} className="border-b border-line">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-start justify-between gap-4 py-4"
                    >
                      <span>
                        <span className="block text-xs font-medium leading-5 text-ink-0 group-hover:text-accent">
                          {source.title}
                        </span>
                        <span className="mt-1 block text-[10px] leading-5 text-ink-1">
                          {source.publisher} · {kindLabels[source.kind]}
                        </span>
                        <span className="mt-1 block text-[10px] leading-5 text-ink-1">
                          {source.note}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={13}
                        strokeWidth={1.5}
                        className="mt-1 shrink-0 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <Reveal className="mt-12 border-t border-line pt-5">
          <div className="grid gap-4 text-[10px] leading-5 text-ink-1 md:grid-cols-3">
            <p>
              <span className="font-medium text-ink-0">Оговорка. </span>
              {everestData.meta.disclaimer}
            </p>
            <p>
              <span className="font-medium text-ink-0">Лицензии. </span>
              {everestData.meta.license}
            </p>
            <p>
              <span className="font-medium text-ink-0">Обновление. </span>
              Данные о стоимости, разрешениях и статистике — на {formatUpdated(everestData.meta.updated)}.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

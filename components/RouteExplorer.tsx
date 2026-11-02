'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Box, ChevronRight, Map as MapIcon, Mountain } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useInView } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';

import Everest3D from '@/components/Everest3D';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { everestData } from '@/lib/data';
import { cn, formatAltitude } from '@/lib/format';
import type { Route } from '@/lib/schema';

const RoutesMap = dynamic(() => import('@/components/RoutesMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-bg-1">
      <span className="text-[10px] uppercase tracking-[0.2em] text-accent">Загружаем карту…</span>
    </div>
  ),
});

const campTypeLabel: Record<string, string> = {
  base: 'BC',
  camp: 'лагерь',
  col: 'седло',
  summit: 'вершина',
};

export default function RouteExplorer() {
  const [routeId, setRouteId] = useState<Route['id']>('south');
  const [campId, setCampId] = useState<string | null>(null);
  const [panel, setPanel] = useState<'map' | '3d'>('3d');
  const mapFrame = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapFrame, { once: true, margin: '320px 0px' });
  const reduced = useReducedMotion();

  const route = useMemo(
    () => (routeId === 'south' ? everestData.routes.south : everestData.routes.north),
    [routeId],
  );
  const camp = useMemo(
    () => route.camps.find((item) => item.id === campId) ?? null,
    [campId, route.camps],
  );

  const changeRoute = (next: Route['id']) => {
    setRouteId(next);
    setCampId(null);
  };

  return (
    <section id="routes" aria-labelledby="routes-title" className="section bg-bg-0">
      <div className="shell">
        <SectionHeading
          index="05"
          eyebrow={everestData.routes.eyebrow}
          title={everestData.routes.title}
          lede={everestData.routes.intro}
          id="routes-title"
          aside={
            <div className="mt-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-accent">
              <span className="h-px w-10 bg-line" aria-hidden="true" />
              Юг · Непал / Север · Тибет
            </div>
          }
        />

        <Reveal className="mt-12 md:mt-16" delay={0.05}>
          <div className="flex flex-col justify-between gap-5 border-y border-line py-4 md:flex-row md:items-center">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Выбор маршрута">
              {([everestData.routes.south, everestData.routes.north] as const).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={routeId === item.id}
                  onClick={() => changeRoute(item.id)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded border px-4 py-2.5 text-xs font-medium transition-all duration-300',
                    routeId === item.id
                      ? 'border-ink-0 bg-ink-0 text-white'
                      : 'border-line bg-bg-0 text-ink-1 hover:border-ink-1 hover:text-ink-0',
                  )}
                >
                  <span className="font-display text-[10px] tracking-[0.12em]">
                    {item.id === 'south' ? 'S' : 'N'}
                  </span>
                  {item.name}
                </button>
              ))}
            </div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
              {route.country} · {route.season}
            </p>
          </div>

          <noscript>
            <p className="mt-5 rounded border border-line bg-bg-1 px-4 py-3 text-xs leading-5 text-ink-1">
              Интерактивная карта, 3D-модель и параллакс требуют JavaScript. Список лагерей и
              текстовые описания ниже доступны без него.
            </p>
          </noscript><div className="mt-5 flex gap-2 md:hidden" role="group" aria-label="Переключение карты и 3D">
            <button
              type="button"
              aria-pressed={panel === 'map'}
              onClick={() => setPanel('map')}
              className={cn(
                'inline-flex flex-1 items-center justify-center gap-2 rounded border px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em]',
                panel === 'map' ? 'border-ink-0 bg-ink-0 text-white' : 'border-line text-ink-1',
              )}
            >
              <MapIcon size={13} strokeWidth={1.5} aria-hidden="true" />
              Карта
            </button>
            <button
              type="button"
              aria-pressed={panel === '3d'}
              onClick={() => setPanel('3d')}
              className={cn(
                'inline-flex flex-1 items-center justify-center gap-2 rounded border px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em]',
                panel === '3d' ? 'border-ink-0 bg-ink-0 text-white' : 'border-line text-ink-1',
              )}
            >
              <Box size={13} strokeWidth={1.5} aria-hidden="true" />
              3D-рельеф
            </button>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2" role="group" aria-label="Карта и 3D-модель маршрута">
            <div
              ref={mapFrame}
              className={cn(
                'map-frame relative h-[400px] md:h-[510px]',
                panel === '3d' && 'hidden md:block',
              )}
            >
              {mapInView ? (
                <RoutesMap
                  route={route}
                  activeCampId={campId}
                  onSelectCamp={(id) => setCampId((current) => (current === id ? null : id))}
                  visible
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-bg-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-accent">Карта загрузится при прокрутке</span>
                </div>
              )}
              <div className="pointer-events-none absolute left-4 top-4 z-[500] inline-flex items-center gap-2 rounded-full border border-ink-0/10 bg-white/85 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-ink-0 backdrop-blur">
                <MapIcon size={11} strokeWidth={1.5} aria-hidden="true" />
                Карта · схема
              </div>
            </div>
            <div
              className={cn(
                'h-[400px] md:h-[510px]',
                panel === 'map' && 'hidden md:block',
              )}
            >
              <Everest3D
                route={route}
                activeCampId={campId}
                onSelectCamp={(id) => setCampId((current) => (current === id ? null : id))}
                visible={panel === '3d'}
              />
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-[11px] leading-5 text-ink-1">{everestData.routes.mapNote}</p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink-0">
                Лагеря
              </h3>
              <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
                {route.camps.length} точек
              </p>
            </div>

            <div className="grid sm:grid-cols-2">
              {route.camps.map((item) => {
                const active = item.id === campId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCampId(active ? null : item.id)}
                    aria-pressed={active}
                    className={cn(
                      'group flex min-h-[84px] items-center justify-between gap-4 border-b border-line px-1 py-4 text-left transition-colors duration-300',
                      active ? 'bg-bg-1' : 'hover:bg-bg-1/60',
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold uppercase',
                          active
                            ? 'border-ink-0 bg-ink-0 text-white'
                            : 'border-line bg-bg-0 text-ink-1 group-hover:border-ink-1',
                        )}
                      >
                        {item.type === 'summit' ? (
                          <Mountain size={12} strokeWidth={1.5} aria-hidden="true" />
                        ) : (
                          item.shortName
                        )}
                      </span>
                      <span>
                        <span className="block font-display text-sm font-semibold text-ink-0">
                          {item.name}
                        </span>
                        <span className="mt-0.5 block text-[10px] uppercase tracking-[0.12em] text-accent">
                          {campTypeLabel[item.type]}
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-display text-xs font-semibold tabular-nums text-ink-0">
                        {formatAltitude(item.altitude)} м
                      </span>
                      <ChevronRight
                        size={13}
                        strokeWidth={1.5}
                        className={cn(
                          'text-accent transition-transform',
                          active && 'rotate-90 text-ink-0',
                        )}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 min-h-[148px] rounded-lg border border-line bg-bg-1 p-5 md:p-6">
              <AnimatePresence mode="wait" initial={false}>
                {camp ? (
                  <motion.div
                    key={camp.id}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-display text-lg font-semibold text-ink-0">{camp.name}</h4>
                      <span className="font-display text-sm font-semibold text-accent">
                        {formatAltitude(camp.altitude)} м
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ink-1">{camp.summary}</p>
                    <p className="mt-3 text-xs leading-6 text-ink-1">{camp.detail}</p>
                  </motion.div>
                ) : (
                  <motion.p
                    key="empty"
                    initial={false}
                    className="text-sm leading-6 text-ink-1"
                  >
                    Выберите лагерь на карте, в 3D-сцене или в списке — карта приблизится, а камера
                    покажет точку на рельефе.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border-b border-line pb-4">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink-0">
                Характер маршрута
              </h3>
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-accent">
                {route.subtitle}
              </p>
            </div>

            <p className="mt-5 text-sm leading-7 text-ink-1">{route.summary}</p>

            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line">
              <div className="bg-bg-0 p-4">
                <dt className="text-[9px] uppercase tracking-[0.14em] text-accent">Сезон</dt>
                <dd className="mt-2 text-xs leading-5 text-ink-0">{route.season}</dd>
              </div>
              <div className="bg-bg-0 p-4">
                <dt className="text-[9px] uppercase tracking-[0.14em] text-accent">Длина</dt>
                <dd className="mt-2 text-xs leading-5 text-ink-0">{route.length}</dd>
              </div>
              <div className="col-span-2 bg-bg-0 p-4">
                <dt className="text-[9px] uppercase tracking-[0.14em] text-accent">Сложность</dt>
                <dd className="mt-2 text-xs leading-5 text-ink-0">{route.difficulty}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[11px] leading-5 text-ink-1">{route.successNote}</p>

            <div className="mt-8 space-y-0">
              {route.features.map((feature, index) => (
                <div key={feature.title} className="border-t border-line py-5">
                  <div className="flex gap-4">
                    <span className="font-display text-[10px] font-semibold tracking-[0.1em] text-accent">
                      0{index + 1}
                    </span>
                    <div>
                      <h4 className="font-display text-sm font-semibold text-ink-0">{feature.title}</h4>
                      <p className="mt-2 text-xs leading-6 text-ink-1">{feature.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Reveal className="mt-16 md:mt-24">
          <div className="rounded-lg border border-line bg-bg-1 p-6 md:p-8">
            <div className="flex flex-col justify-between gap-3 border-b border-line pb-5 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">{everestData.logistics.eyebrow}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-ink-0">
                  {everestData.logistics.title}
                </h3>
              </div>
              <p className="max-w-sm text-[11px] leading-5 text-ink-1">
                Бюрократия — часть маршрута. Проверяйте правила перед сезоном: они меняются.
              </p>
            </div>
            <div className="mt-6 grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {everestData.logistics.items.map((item) => (
                <div key={item.label} className="bg-bg-0 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[9px] uppercase tracking-[0.14em] text-accent">
                      {item.label}
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.12em] text-accent">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-4 font-display text-xl font-semibold tracking-[-0.03em] text-ink-0">
                    {item.value}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-ink-1">{item.text}</p>
                </div>
              ))}
            </div>
            <ul className="mt-5 grid gap-2 text-[11px] leading-5 text-ink-1 md:grid-cols-3">
              {everestData.logistics.notes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

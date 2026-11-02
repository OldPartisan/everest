'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BookOpen, Film, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';

import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { everestData } from '@/lib/data';
import { cn } from '@/lib/format';
import type { CultureItem } from '@/lib/schema';
import { withBase } from '@/lib/withBase';

type Filter = 'all' | 'book' | 'film';

const culture = everestData.culture;

function CultureCover({ item, compact = false }: { item: CultureItem; compact?: boolean }) {
  const isLongWord = item.coverWord.length >= 6;
  if (item.cover) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded border border-line bg-ink-0',
          compact ? 'h-52 w-40 shrink-0' : 'aspect-[4/5] w-full',
        )}
      >
        <Image
          src={withBase(item.cover)}
          alt={`Обложка: ${item.title}`}
          fill
          sizes={compact ? '160px' : '(min-width: 1024px) 292px, 264px'}
          className="object-cover object-center transition-transform duration-700 ease-mountain group-hover:scale-[1.025]"
        />
      </div>
    );
  }
  return (
    <div
      className={cn(
        'culture-cover relative flex flex-col justify-between overflow-hidden rounded border border-line p-5',
        compact ? 'h-52 w-40 shrink-0' : 'aspect-[4/5] w-full',
      )}
    >
      <div className="relative z-10 flex items-center justify-between text-[9px] font-medium uppercase tracking-[0.18em] text-ink-1">
        <span>{item.kind === 'book' ? 'Книга' : 'Фильм'}</span>
        <span>{item.year}</span>
      </div>
      <div className="relative z-10">
        <p
          className={cn(
            'font-display font-semibold uppercase leading-[0.82] tracking-[-0.06em] text-ink-0',
            compact
              ? 'text-2xl'
              : isLongWord
                ? 'text-[clamp(1.9rem,3.4vw,2.8rem)]'
                : 'text-[clamp(2.4rem,5vw,4.2rem)]',
          )}
        >
          {item.coverWord}
        </p>
        <p className="mt-4 max-w-full text-[10px] font-medium uppercase leading-4 tracking-[0.1em] text-ink-1">
          {item.kind === 'book' ? item.author : item.director}
        </p>
      </div>
      <div className="relative z-10 flex items-end justify-between gap-3 text-[9px] uppercase tracking-[0.12em] text-ink-1">
        <span className="max-w-[80%] normal-case tracking-normal">{item.title}</span>
        <span aria-hidden="true">↗</span>
      </div>
    </div>
  );
}

function CultureCard({
  item,
  onOpen,
  index,
}: {
  item: CultureItem;
  onOpen: (item: CultureItem) => void;
  index: number;
}) {
  const reduced = useReducedMotion();

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty('--tilt-y', `${(x - 0.5) * 9}deg`);
    event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - y) * 7}deg`);
  };

  const reset = (target: HTMLButtonElement) => {
    target.style.setProperty('--tilt-y', '0deg');
    target.style.setProperty('--tilt-x', '0deg');
  };

  return (
    <button
      type="button"
      className="tilt-card group flex h-full w-full flex-col text-left"
      onPointerMove={onPointerMove}
      onPointerLeave={(event) => reset(event.currentTarget)}
      onBlur={(event) => reset(event.currentTarget)}
      onClick={() => onOpen(item)}
      aria-haspopup="dialog"
      aria-label={`Открыть описание: ${item.title}`}
    >
      <CultureCover item={item} />
      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-semibold leading-snug tracking-[-0.02em] text-ink-0">
            {item.title}
          </h3>
          <span className="mt-1 font-display text-[9px] font-semibold tracking-[0.12em] text-accent">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-ink-1">{item.originalTitle}</p>
        {item.platform && (
          <p className="mt-1 text-[10px] leading-5 text-accent">
            {item.year} · {item.platform} · {item.runtime}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.themes.slice(0, 2).map((theme) => (
            <span
              key={theme}
              className="rounded-full border border-line px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-ink-1"
            >
              {theme}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

function CultureModal({ item, onClose }: { item: CultureItem; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panel.current) return;
      const focusable = Array.from(
        panel.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="modal-backdrop fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? undefined : { opacity: 0 }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="culture-modal-title"
        initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? undefined : { opacity: 0, y: 12, scale: 0.99 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="modal-panel"
      >
        <button
          ref={closeButton}
          type="button"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-bg-0 text-ink-1 transition-colors hover:border-ink-0 hover:text-ink-0"
          onClick={onClose}
          aria-label="Закрыть описание"
        >
          <X size={16} strokeWidth={1.5} />
        </button>

        <div className="grid gap-6 md:grid-cols-[170px_1fr] md:gap-8">
          <CultureCover item={item} compact />
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.18em] text-accent">
              {item.kind === 'book' ? 'Книга' : 'Фильм'} · {item.year}
            </p>
            <h2
              id="culture-modal-title"
              className="mt-3 pr-8 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink-0 md:text-3xl"
            >
              {item.title}
            </h2>
            <p className="mt-1 text-xs text-ink-1">{item.originalTitle}</p>

            <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-line py-4">
              <div>
                <dt className="text-[9px] uppercase tracking-[0.14em] text-accent">
                  {item.kind === 'book' ? 'Автор' : 'Режиссёр'}
                </dt>
                <dd className="mt-1 text-xs leading-5 text-ink-0">
                  {item.kind === 'book' ? item.author : item.director}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] uppercase tracking-[0.14em] text-accent">Год</dt>
                <dd className="mt-1 text-xs text-ink-0">{item.year}</dd>
              </div>
            </dl>

            <p className="mt-5 text-sm leading-7 text-ink-1">{item.description}</p>

            {(item.platform || item.cast || item.award) && (
              <dl className="mt-5 space-y-3 border-t border-line pt-4 text-xs leading-5">
                {item.platform && (
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-[9px] uppercase tracking-[0.12em] text-accent">Платформа</dt>
                    <dd className="text-ink-0">{item.platform}</dd>
                  </div>
                )}
                {item.release && (
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-[9px] uppercase tracking-[0.12em] text-accent">Премьера</dt>
                    <dd className="text-ink-0">{item.release}</dd>
                  </div>
                )}
                {item.runtime && (
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-[9px] uppercase tracking-[0.12em] text-accent">Время</dt>
                    <dd className="text-ink-0">{item.runtime}</dd>
                  </div>
                )}
                {item.cast && (
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-[9px] uppercase tracking-[0.12em] text-accent">В ролях</dt>
                    <dd className="text-ink-0">{item.cast.join(' · ')}</dd>
                  </div>
                )}
                {item.award && (
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-[9px] uppercase tracking-[0.12em] text-accent">Награда</dt>
                    <dd className="text-ink-0">{item.award}</dd>
                  </div>
                )}
              </dl>
            )}

            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-accent transition-colors hover:text-ink-0"
              >
                Страница фильма ↗
              </a>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {item.themes.map((theme) => (
                <span
                  key={theme}
                  className="rounded-full border border-line bg-bg-1 px-2.5 py-1 text-[9px] uppercase tracking-[0.1em] text-ink-1"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CultureSection() {
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<CultureItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const items = useMemo(() => {
    if (filter === 'book') return culture.books;
    if (filter === 'film') return culture.films;
    return [...culture.books, ...culture.films];
  }, [filter]);

  const filters: Array<{ id: Filter; label: string; icon: typeof BookOpen }> = [
    { id: 'all', label: `Все · ${culture.books.length + culture.films.length}`, icon: BookOpen },
    { id: 'book', label: 'Книги', icon: BookOpen },
    { id: 'film', label: 'Фильмы', icon: Film },
  ];

  return (
    <section id="culture" aria-labelledby="culture-title" className="section bg-bg-1">
      <div className="shell">
        <SectionHeading
          index="08"
          eyebrow={culture.eyebrow}
          title={culture.title}
          lede={culture.intro}
          id="culture-title"
        />

        <div className="mt-10 flex flex-col justify-between gap-5 border-y border-line py-4 md:flex-row md:items-center">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            {filters.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 rounded border px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.12em] transition-colors',
                    filter === item.id
                      ? 'border-ink-0 bg-ink-0 text-white'
                      : 'border-line bg-bg-0 text-ink-1 hover:border-ink-1 hover:text-ink-0',
                  )}
                >
                  <Icon size={12} strokeWidth={1.5} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-accent" aria-live="polite">
            {items.length} материалов
          </p>
        </div>

        <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => (
            <CultureCard key={item.id} item={item} index={index} onOpen={setSelected} />
          ))}
        </div>

        <p className="mt-8 text-[10px] leading-5 text-ink-1">
          Обложки — авторская серия проекта, созданная для этого лонгрида, а не официальные
          издательские обложки или постеры.
        </p>
      </div>

      {mounted &&
        selected &&
        createPortal(
          <AnimatePresence>
            <CultureModal item={selected} onClose={() => setSelected(null)} />
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}

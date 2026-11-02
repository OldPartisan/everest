'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Film, X } from 'lucide-react';
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
      className="culture-slide tilt-card group flex w-[264px] shrink-0 flex-col text-left sm:w-[292px]"
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
  const rail = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<CultureItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => setMounted(true), []);

  const items = useMemo(() => {
    if (filter === 'book') return culture.books;
    if (filter === 'film') return culture.films;
    return [...culture.books, ...culture.films];
  }, [filter]);

  const scroll = (direction: 1 | -1) => {
    const node = rail.current;
    if (!node) return;
    node.scrollBy({ left: direction * Math.min(node.clientWidth * 0.82, 620), behavior: reduced ? 'auto' : 'smooth' });
  };

  const changeFilter = (next: Filter) => {
    setFilter(next);
    rail.current?.scrollTo({ left: 0, behavior: 'auto' });
  };

  const filters: Array<{ id: Filter; label: string; icon: typeof BookOpen }> = [
    { id: 'all', label: `Все · ${culture.books.length + culture.films.length}`, icon: BookOpen },
    { id: 'book', label: 'Книги', icon: BookOpen },
    { id: 'film', label: 'Фильмы', icon: Film },
  ];

  return (
    <section id="culture" aria-labelledby="culture-title" className="section bg-bg-1">
      <div className="shell">
        <SectionHeading
          index="07"
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
                  onClick={() => changeFilter(item.id)}
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

          <div className="flex items-center gap-2">
            <span className="mr-2 text-[9px] uppercase tracking-[0.16em] text-accent">
              листайте
            </span>
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-bg-0 text-ink-1 transition-colors hover:border-ink-0 hover:text-ink-0"
              aria-label="Прокрутить назад"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-bg-0 text-ink-1 transition-colors hover:border-ink-0 hover:text-ink-0"
              aria-label="Прокрутить вперёд"
            >
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div
          ref={rail}
          className="culture-rail -mx-6 mt-7 flex gap-5 overflow-x-auto px-6 pb-3 md:-mx-10 md:px-10 lg:-mx-12 lg:px-12"
          role="region"
          aria-label="Карусель книг и фильмов"
          tabIndex={0}
        >
          {items.map((item, index) => (
            <CultureCard key={item.id} item={item} index={index} onOpen={setSelected} />
          ))}
        </div>

        <Reveal className="mt-16 md:mt-24">
          <div className="grid overflow-hidden rounded-lg border border-line bg-bg-0 lg:grid-cols-12">
            <div className="relative min-h-[320px] lg:col-span-5">
              <Image
                src={withBase('/images/khumbu-glacier.avif')}
                alt="Ледник Кхумбу и западная стена массива Эвереста, вид с запада"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-0/60 via-transparent to-transparent" aria-hidden="true" />
              <p className="absolute bottom-5 left-5 right-5 text-[9px] uppercase tracking-[0.16em] text-white/80">
                Кхумбу · место работы и дом
              </p>
            </div>
            <div className="p-6 md:p-9 lg:col-span-7">
              <p className="eyebrow">Культура шерпов</p>
              <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink-0 md:text-3xl">
                {culture.sherpa.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-ink-1">{culture.sherpa.text}</p>
              <ul className="mt-6 space-y-3 border-t border-line pt-5">
                {culture.sherpa.facts.map((fact) => (
                  <li key={fact} className="flex gap-3 text-xs leading-6 text-ink-1">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {fact}
                  </li>
                ))}
              </ul>
              <a
                href="#knowledge"
                className="link-underline mt-7 text-xs font-medium"
              >
                Источники и оговорки
                <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {selected && <CultureModal item={selected} onClose={() => setSelected(null)} />}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}

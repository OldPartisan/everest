'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/format';
import { navItems, REPO_URL } from '@/lib/site';

const sectionIds = navItems.map((item) => item.href.slice(1));

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 40);

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(scrollable > 0 ? Math.min(100, Math.max(0, (y / scrollable) * 100)) : 0);

    if (y < 180) {
      setActive('');
      return;
    }

    const probe = window.innerHeight * 0.32;
    let current = '';
    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      if (rect.top <= probe && rect.bottom > probe) {
        current = id;
        break;
      }
    }
    setActive(current);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const darkText = scrolled || open;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
          darkText
            ? 'border-b border-line bg-bg-0/95 text-ink-0 backdrop-blur-md'
            : 'border-b border-transparent text-white',
        )}
      >
        <div className="shell flex h-[72px] items-center justify-between gap-6 md:h-20">
          <a
            href="#top"
            className="group inline-flex items-baseline gap-3"
            aria-label="Эверест — к началу страницы"
            onClick={() => setOpen(false)}
          >
            <span className="font-display text-[13px] font-semibold tracking-[0.22em] md:text-sm">
              ЭВЕРЕСТ
            </span>
            <span
              className={cn(
                'font-sans text-[10px] tracking-[0.16em] transition-colors',
                darkText ? 'text-accent' : 'text-white/60',
              )}
            >
              8848,86
            </span>
          </a>

          <nav aria-label="Основная навигация" className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => {
              const id = item.href.slice(1);
              const isActive = active === id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'relative py-2 text-[12px] font-medium tracking-[0.05em] transition-opacity duration-300',
                    isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100',
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-current transition-transform duration-300',
                      isActive && 'scale-x-100',
                    )}
                    aria-hidden="true"
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                'hidden text-[11px] font-medium tracking-[0.04em] transition-opacity hover:opacity-60 sm:inline-flex',
                darkText ? 'text-ink-1' : 'text-white/70',
              )}
            >
              GitHub ↗
            </a>
            <button
              type="button"
              aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded border transition-colors lg:hidden',
                darkText ? 'border-line text-ink-0' : 'border-white/30 text-white',
              )}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-current opacity-0" aria-hidden="true" />
        <div
          className={cn(
            'absolute bottom-0 left-0 h-px transition-[width] duration-150',
            darkText ? 'bg-ink-0' : 'bg-white/60',
          )}
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-bg-0 px-6 pb-10 pt-24 lg:hidden"
          >
            <nav aria-label="Мобильная навигация" className="flex h-full flex-col">
              <div className="flex-1">
                {navItems.map((item, index) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b border-line py-5 font-display text-2xl font-medium tracking-[-0.02em] text-ink-0"
                  >
                    <span>{item.label}</span>
                    <span className="font-sans text-[10px] tracking-[0.16em] text-accent">
                      0{index + 1}
                    </span>
                  </a>
                ))}
              </div>
              <div className="mt-10 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-ink-1">
                <span>8 848,86 м</span>
                <span>27°59′17″ N</span>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

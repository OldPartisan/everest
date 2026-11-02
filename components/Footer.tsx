import { ArrowUp, ArrowUpRight } from 'lucide-react';

import { everestData } from '@/lib/data';
import { navItems, REPO_URL } from '@/lib/site';

export default function SiteFooter() {
  const { meta, peak, imageCredits } = everestData;
  const updatedLabel = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(
    new Date(`${meta.updated}-01T00:00:00Z`),
  );

  return (
    <footer className="bg-ink-0 text-white [&_a:focus-visible]:outline-white [&_summary:focus-visible]:outline-white">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-bg-2/50">27°59′17″ N · 86°55′31″ E</p>
            <p className="mt-6 font-display text-[clamp(2.8rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[0.02em]">
              ЭВЕРЕСТ
            </p>
            <p className="mt-3 font-display text-sm tracking-[0.08em] text-bg-2/70">
              {peak.names[1]?.name} · {peak.names[2]?.name}
            </p>
            <p className="mt-8 max-w-sm text-xs leading-6 text-bg-2/70">
              {peak.heightDisplay} {peak.unit} над уровнем моря. Образовательный проект об истории,
              географии и людях высочайшей вершины Земли.
            </p>
          </div>

          <nav aria-label="Навигация в подвале" className="lg:col-span-3">
            <p className="text-[9px] uppercase tracking-[0.18em] text-bg-2/50">Разделы</p>
            <ul className="mt-5 space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="footer-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="text-[9px] uppercase tracking-[0.18em] text-bg-2/50">Проект</p>
            <ul className="mt-5 space-y-2.5">
              <li>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="footer-link inline-flex items-center gap-1.5"
                >
                  GitHub · oldpartisan/everest
                  <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href="#knowledge" className="footer-link">
                  Источники и глоссарий
                </a>
              </li>
              <li>
                <a
                  href="https://www.himalayandatabase.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="footer-link inline-flex items-center gap-1.5"
                >
                  Himalayan Database
                  <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href="#top" className="footer-link inline-flex items-center gap-1.5">
                  Наверх
                  <ArrowUp size={12} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-6 border-t border-white/15 pt-6 md:flex-row md:items-end">
          <div>
            <p className="font-display text-sm font-medium tracking-[0.02em] text-bg-2/85">
              Сделано с уважением к горе.
            </p>
            <p className="mt-2 max-w-lg text-[10px] leading-5 text-bg-2/50">
              Код — MIT. Тексты и подборка данных — CC BY 4.0. Фотографии — по лицензиям авторов.
              Данные: {updatedLabel}.
            </p>
          </div>
          <p className="text-[9px] uppercase tracking-[0.16em] text-bg-2/40">
            © {new Date().getFullYear()} · Everest Field Notes
          </p>
        </div>

        <details className="group mt-8 border-t border-white/10 pt-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[9px] uppercase tracking-[0.16em] text-bg-2/55 transition-colors hover:text-bg-2/90">
            Фотографии и лицензии
            <span className="text-sm font-light transition-transform group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          <ul className="mt-5 grid gap-3 text-[10px] leading-5 text-bg-2/55 sm:grid-cols-2 lg:grid-cols-3">
            {imageCredits.map((credit) => (
              <li key={credit.file}>
                <a
                  href={credit.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline decoration-white/20 underline-offset-2 hover:text-bg-2"
                >
                  {credit.title}
                </a>{' '}
                — {credit.author}, {credit.license}. {credit.note}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[10px] leading-5 text-bg-2/40">
            Картографические данные © OpenStreetMap contributors. Рельеф — SRTM / NASA & USGS, public
            domain. Схема маршрутов не является навигационным треком.
          </p>
        </details>
      </div>
    </footer>
  );
}

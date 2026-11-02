import { ArrowLeft, Compass } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[82svh] items-center overflow-hidden bg-bg-1 pb-24 pt-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 75% 30%, rgba(255,255,255,0.9), transparent 50%), repeating-linear-gradient(115deg, transparent 0 46px, rgba(100,116,139,0.08) 46px 47px)',
        }}
      />
      <div className="shell relative">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-accent">
            <Compass size={14} strokeWidth={1.5} aria-hidden="true" />
            Ошибка навигации · 404
          </div>
          <p className="mt-8 font-display text-[clamp(5rem,16vw,12rem)] font-semibold leading-[0.8] tracking-[-0.07em] text-ink-0">
            404
          </p>
          <h1 className="mt-8 font-display text-3xl font-semibold leading-tight tracking-[-0.04em] text-ink-0 md:text-4xl">
            Этот траверс не существует
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-ink-1">
            Страница потерялась где-то между Северным седлом и Западным цирком. Вернитесь на
            главную — там есть карта, 3D-рельеф и вся история.
          </p>
          <Link href="/" className="button-primary mt-8">
            <ArrowLeft size={15} strokeWidth={1.5} aria-hidden="true" />
            На главную
          </Link>
        </div>
        <div className="pointer-events-none mt-16 flex items-end gap-1 opacity-30" aria-hidden="true">
          {Array.from({ length: 32 }).map((_, index) => (
            <span
              key={index}
              className="block w-2 shrink-0 rounded-t-sm bg-ink-1"
              style={{ height: `${18 + ((index * 37) % 90)}px` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

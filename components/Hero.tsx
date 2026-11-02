'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useEffect, useRef, type CSSProperties } from 'react';

import MountainRidges from '@/components/MountainRidges';
import TopoLines from '@/components/ui/TopoLines';
import { everestData } from '@/lib/data';
import { withBase } from '@/lib/withBase';

const ease = [0.22, 1, 0.36, 1] as const;

const intro = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

// The H1 is the LCP candidate. Keep it painted while the rest fades in.
const titleItem = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const far = useRef<HTMLDivElement>(null);
  const near = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let cleanup: (() => void) | undefined;

    const setup = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      if (!root.current || !media.current) return;
      const context = gsap.context(() => {
        gsap.to(media.current, {
          yPercent: 11,
          scale: 1.045,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
        if (far.current) {
          gsap.to(far.current, {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
        if (near.current) {
          gsap.to(near.current, {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
        if (content.current) {
          gsap.to(content.current, {
            yPercent: -6,
            opacity: 0.45,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: '35% top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      }, root);

      requestAnimationFrame(() => ScrollTrigger.refresh());
      cleanup = () => context.revert();
    };

    void setup();
    return () => cleanup?.();
  }, [reduced]);

  const { peak, about } = everestData;
  const deathZone = about.altitudeFacts[0];
  const firstAscentYear = peak.firstAscent.dateLabel.split(' ').at(-1) ?? peak.firstAscent.date.slice(0, 4);

  return (
    <section id="top" ref={root} className="relative isolate min-h-[100svh] overflow-hidden bg-ink-0 text-white">
      <div
        ref={media}
        className="hero-media hero-photo absolute inset-0 -z-20"
        role="img"
        aria-label="Северо-восточная стена Эвереста и Западный плечевой гребень над ледником Кхумбу"
        style={
          {
            '--hero-desktop': `url("${withBase('/images/hero-everest-1800.avif')}")`,
            '--hero-mobile': `url("${withBase('/images/hero-everest-1200.avif')}")`,
          } as CSSProperties
        }
      />
      <div className="hero-shade absolute inset-0 -z-10" aria-hidden="true" />
      <div className="grain absolute inset-0 -z-[5] opacity-40" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.13]" aria-hidden="true">
        <TopoLines className="h-full w-full" />
      </div>

      <div ref={far} className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
        <MountainRidges />
      </div>

      <div className="hero-fog pointer-events-none absolute inset-x-0 bottom-[14%] z-[3] h-56 animate-fog" aria-hidden="true" />

      <div ref={content} className="relative z-10 flex min-h-[100svh] flex-col pb-8 pt-28 md:pb-10 md:pt-32">
        <div className="shell flex-1">
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="flex items-start justify-between gap-6 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70"
          >
            <span>01 / Введение</span>
            <span className="text-right">
              <span className="sm:hidden">
                {peak.coordinates.lat.toFixed(2)}° N · {peak.coordinates.lng.toFixed(2)}° E
              </span>
              <span className="hidden sm:inline">{peak.coordinates.dms}</span>
            </span>
          </motion.div>

          <motion.div
            variants={intro}
            initial={reduced ? false : 'hidden'}
            animate="visible"
            className="mt-auto pb-10 pt-24 md:pb-14 md:pt-28"
          >
            <motion.p variants={item} className="mb-5 text-[11px] uppercase tracking-[0.26em] text-white/65">
              {peak.location.range}
            </motion.p>
            <motion.h1 variants={titleItem} className="hero-title">
              ЭВЕРЕСТ
            </motion.h1>
            <motion.div
              variants={item}
              className="mt-5 flex flex-col gap-2 border-t border-white/25 pt-5 sm:flex-row sm:items-end sm:justify-between"
            >
              <p className="font-display text-sm font-medium tracking-[0.08em] text-white/90 md:text-base">
                {peak.names[1]?.name} · {peak.names[2]?.name}
              </p>
              <p className="text-right">
                <span className="block font-sans text-[9px] font-medium uppercase tracking-[0.16em] text-white/55">
                  над уровнем моря
                </span>
                <span className="mt-1 block font-display text-lg font-semibold tracking-[0.03em] text-white md:text-xl">
                  {peak.heightDisplay} {peak.unit}
                </span>
              </p>
            </motion.div>
          </motion.div>

          <div ref={near} className="relative">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease }}
              className="grid gap-8 border-t border-white/20 pt-6 md:grid-cols-[1fr_auto] md:items-end"
            >
              <p className="max-w-md text-sm leading-7 text-white/85">
                Высочайшая точка Земли над уровнем моря — и один из самых внимательно
                задокументированных, спорных и дорогих маршрутов в мире.
              </p>
              <a
                href="#stats"
                className="group inline-flex w-fit items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white"
              >
                Смотреть дальше
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 transition-colors group-hover:border-white/60">
                  <ArrowDown size={14} strokeWidth={1.5} className="animate-drift" />
                </span>
              </a>
            </motion.div>

            <div className="mt-7 grid grid-cols-3 gap-4 border-t border-white/15 pt-5 text-white/70">
              <div>
                <p className="font-display text-sm font-semibold tracking-wide text-white">{firstAscentYear}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/70">первое подтверждённое</p>
              </div>
              <div>
                <p className="font-display text-sm font-semibold tracking-wide text-white">{peak.routesCount}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/70">классических маршрута</p>
              </div>
              <div>
                <p className="font-display text-sm font-semibold tracking-wide text-white">{deathZone?.value}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/70">{deathZone?.label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

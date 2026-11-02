'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { Box, Play } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { Route } from '@/lib/schema';
import { withBase } from '@/lib/withBase';

const MountainScene = dynamic(() => import('@/components/MountainScene'), {
  ssr: false,
  loading: () => (
    <div className="canvas-loader absolute inset-0 flex items-center justify-center">
      <span className="text-[10px] uppercase tracking-[0.2em] text-accent">Собираем рельеф…</span>
    </div>
  ),
});

type Everest3DProps = {
  route: Route;
  activeCampId: string | null;
  onSelectCamp: (campId: string) => void;
  visible?: boolean;
};

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    if (process.env.NODE_ENV !== 'production') {
      console.error('3D scene failed', error, info);
    }
  }

  override render(): ReactNode {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function Fallback({
  onEnable,
  mobile,
  unsupported,
  message,
}: {
  onEnable?: () => void;
  mobile: boolean;
  unsupported: boolean;
  message?: string;
}) {
  return (
    <div className="absolute inset-0">
      <Image
        src={withBase('/images/khumbu-glacier.avif')}
        alt="Резервное изображение массива Эвереста над ледником Кхумбу"
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-0/80 via-ink-0/20 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-ink-0/45 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur">
          <Box size={11} strokeWidth={1.5} aria-hidden="true" />
          3D-рельеф
        </span>
        <span className="text-[9px] uppercase tracking-[0.16em] text-white/65">SRTM · 8 849 м</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        <p className="max-w-sm font-display text-lg font-semibold leading-snug text-white">
          Массив Эвереста в объёме
        </p>
        <p className="mt-2 max-w-sm text-xs leading-6 text-white/70">
          {message ??
            (unsupported
              ? 'WebGL недоступен в этом браузере. Показан резервный вид.'
              : mobile
                ? 'На мобильном 3D выключено по умолчанию — чтобы не тратить батарею и трафик.'
                : 'Модель загрузится при приближении к секции.')}
        </p>
        {!unsupported && onEnable && (
          <button
            type="button"
            aria-label="Включить интерактивную 3D-модель"
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-ink-0/5 text-white transition-colors hover:bg-ink-0/20"
            onClick={onEnable}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-ink-0/40 shadow-lift backdrop-blur transition-transform duration-500 hover:scale-105">
              <Play size={22} strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
            </span>
            <span className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
              Включить 3D
            </span>
            <span className="text-[9px] uppercase tracking-[0.16em] text-white/60">
              интерактивный рельеф
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function Everest3D({ route, activeCampId, onSelectCamp, visible = true }: Everest3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '240px 0px' });
  const reduced = useReducedMotion();
  const [supported, setSupported] = useState<boolean | null>(null);
  const [mobile, setMobile] = useState(false);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const updateMobile = () => setMobile(query.matches);
    updateMobile();
    query.addEventListener('change', updateMobile);

    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl');
      setSupported(Boolean(gl));
    } catch {
      setSupported(false);
    }

    return () => query.removeEventListener('change', updateMobile);
  }, []);

  const auto = supported === true && !mobile && inView;
  const enabled = manual || auto;

  useEffect(() => {
    if (visible && supported === true) setManual(true);
  }, [supported, visible]);

  return (
    <div
      ref={ref}
      className={`relative h-full min-h-[320px] w-full overflow-hidden rounded-lg border border-line ${
        enabled ? 'bg-ink-0' : 'bg-bg-1'
      }`}
      role="group"
      aria-label={`Трёхмерная модель массива Эвереста и ${route.name.toLowerCase()}`}
    >
      {enabled ? (
        <>
          <SceneBoundary
            fallback={
              <Fallback
                mobile={mobile}
                unsupported
                message="Не удалось запустить 3D в этом браузере. Показан резервный вид."
              />
            }
          >
            <MountainScene route={route} activeCampId={activeCampId} onSelectCamp={onSelectCamp} />
          </SceneBoundary>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink-0/55 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur">
              <Box size={11} strokeWidth={1.5} aria-hidden="true" />
              3D · режим просмотра
            </span>
            <span className="text-[9px] uppercase tracking-[0.16em] text-white/55">SRTM · DEM · верт. ×4</span>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink-0/55 to-transparent p-4 pt-14">
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/85">
              Перетащите · колесо · выберите лагерь
            </p>
            {reduced && <p className="text-[9px] text-white/60">уменьшенное движение</p>}
          </div>
        </>
      ) : (
        <Fallback
          mobile={mobile}
          unsupported={supported === false}
          onEnable={() => setManual(true)}
        />
      )}
      <span className="sr-only">
        Интерактивная трёхмерная модель. Вращайте сцену мышью или жестами; выбирайте лагеря в
        списке ниже, чтобы приблизить камеру.
      </span>
      {!visible && <span className="sr-only">3D-панель скрыта на мобильном устройстве.</span>}
    </div>
  );
}

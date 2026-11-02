type RidgeLayerProps = {
  className: string;
  color: string;
  depth: string;
  d: string;
};

function RidgeLayer({ className, color, depth, d }: RidgeLayerProps) {
  return (
    <svg
      viewBox="0 0 1440 600"
      preserveAspectRatio="none"
      aria-hidden="true"
      data-depth={depth}
      className={className}
      style={{ color }}
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * Three translucent ridge bands at the foot of the hero.
 * They move at different rates via GSAP; the mask keeps the transition soft.
 */
export default function MountainRidges() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[34%] [mask-image:linear-gradient(to_top,black_18%,rgba(0,0,0,0.82)_48%,transparent_100%)]"
      aria-hidden="true"
    >
      <RidgeLayer
        className="absolute inset-x-0 bottom-0 h-[100%] opacity-30"
        color="#e2e8f0"
        depth="-3"
        d="M0 430 84 386l58 18 74-54 48 34 62-22 44 50 90-28 62 64 82-32 54 28 88-82 58 30 78-14 72 58 76-42 56 26 82-62 70 34 60-20 92 68 64-24 76 16 44 42V600H0Z"
      />
      <RidgeLayer
        className="absolute inset-x-0 bottom-0 h-[78%] opacity-45"
        color="#cbd5e1"
        depth="-6"
        d="M0 470 72 428l50 22 66-66 58 44 62-12 40 58 84-30 52 38 76-18 54 42 84-96 68 34 70-20 60 58 86-38 72 20 58-36 74 58 64-22 84 24 56-12 52 34V600H0Z"
      />
      <RidgeLayer
        className="absolute inset-x-0 bottom-0 h-[55%] opacity-65"
        color="#64748b"
        depth="-10"
        d="M0 512 90 482l46 12 62-38 58 30 72-18 46 36 78-16 58 26 74-32 54 20 72-18 66 40 76-24 62 18 86-34 74 26 58-12 82 32 60-18 68 12 60 22V600H0Z"
      />
    </div>
  );
}

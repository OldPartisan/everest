import { cn } from '@/lib/format';

type TopoLinesProps = {
  className?: string;
};

export default function TopoLines({ className }: TopoLinesProps) {
  return (
    <svg
      viewBox="0 0 1440 720"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('topo-lines', className)}
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="0.75" vectorEffect="non-scaling-stroke">
        <path d="M-60 184C120 120 254 210 382 182s220-96 380-52 240 144 400 120 270-88 398-48" />
        <path d="M-60 234C118 168 260 262 386 232s220-92 376-48 244 142 404 118 268-84 374-44" />
        <path d="M-60 286C116 218 266 314 392 282s218-88 372-44 246 140 406 116 266-82 370-40" />
        <path d="M-60 338C114 268 272 366 398 332s216-84 368-40 248 138 408 114 264-80 366-36" />
        <path d="M-60 390C112 318 278 418 404 382s214-80 364-36 250 136 410 112 262-78 362-32" />
        <path d="M-60 442C110 368 284 470 410 432s212-76 360-32 252 134 412 110 260-76 358-28" />
        <path d="M-60 494C108 418 290 522 416 482s210-72 356-28 254 132 414 108 258-74 354-24" />
        <path d="M-60 546C106 468 296 574 422 532s208-68 352-24 256 130 416 106 256-72 350-20" />
      </g>
      <g stroke="currentColor" strokeWidth="0.55" vectorEffect="non-scaling-stroke" opacity="0.6">
        <path d="M168 0c72 96 36 204 96 286s150 90 170 190 10 164 42 244" />
        <path d="M1272 0c-72 96-36 204-96 286s-150 90-170 190-10 164-42 244" />
        <path d="M720 0c-24 102 12 178-8 268s-58 134-42 212 54 140 44 240" />
      </g>
    </svg>
  );
}

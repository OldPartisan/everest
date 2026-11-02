import type { ReactNode } from 'react';

const icons: Record<string, ReactNode> = {
  'down-jacket': (
    <>
      <path d="M9 4 6 6 4 9l2 3v8h12v-8l2-3-2-3-3-2" />
      <path d="M9 4c.6 1.5 1.6 2.2 3 2.2S14.4 5.5 15 4" />
      <path d="M8 10h8M8 13h8M8 16h8" />
    </>
  ),
  shirt: (
    <>
      <path d="m8 4-4 3 2 3 2-1v11h8V9l2 1 2-3-4-3-2 2h-4L8 4Z" />
      <path d="M10 4c.3 1.1 1 1.6 2 1.6S13.7 5.1 14 4" />
    </>
  ),
  mitten: (
    <>
      <path d="M8 13V7a2 2 0 0 1 4 0v4-2a2 2 0 0 1 4 0v5a6 6 0 0 1-6 6h-1a5 5 0 0 1-5-5v-2a2 2 0 0 1 4 0Z" />
      <path d="M8 13v4M12 13v4M16 13v3" />
    </>
  ),
  balaclava: (
    <>
      <path d="M6 20v-4a6 6 0 0 1 12 0v4" />
      <path d="M7 12a5 5 0 0 1 10 0v3H7v-3Z" />
      <path d="M9.5 13.5h1.5M13 13.5h1.5" />
      <path d="M10 16.5h4" />
    </>
  ),
  boot: (
    <>
      <path d="M7 3h5v8l5 4 3 1v4H4v-4l3-1V3Z" />
      <path d="M4 16h16M7 19v2M17 19v2M8.5 7h2M8.5 10h2" />
    </>
  ),
  crampons: (
    <>
      <path d="M6 7h9l3 4-2 3H8L6 11V7Z" />
      <path d="M5 8H3v4h3M9 14l-1 5M13 14l1 5M17 14v5M6 14H4M20 14h-2" />
      <path d="M8 10h6" />
    </>
  ),
  gaiters: (
    <>
      <path d="M8 3h8v12l3 2v3H5v-3l3-2V3Z" />
      <path d="M8 7h8M5 17h14" />
    </>
  ),
  harness: (
    <>
      <path d="M5 8h14v4H5V8Z" />
      <path d="M8 12v3a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-3" />
      <path d="M5 10H3M21 10h-2M9 8V5h6v3" />
    </>
  ),
  ascender: (
    <>
      <path d="M12 3v18" />
      <path d="M8 6h7l2 4-2 4H8V6Z" />
      <path d="M8 10h9M10 14l2 2" />
    </>
  ),
  descender: (
    <>
      <path d="M7 4h4v7a3 3 0 1 0 3 3" />
      <path d="M7 14h6a3 3 0 1 0-3-3" />
      <path d="M4 20c3-3 6-5 10-5" />
    </>
  ),
  carabiner: (
    <>
      <path d="M8 4h5a6 6 0 0 1 0 12H9a5 5 0 0 1 0-10h2" />
      <path d="M10 8v4" />
    </>
  ),
  'ice-axe': (
    <>
      <path d="m8 5 12 14" />
      <path d="M6 3 4 7l3 2 2-4-3-2ZM18 17l2 2-1 2-3-2 2-2Z" />
      <path d="M12 7 9 4M14 9l-3-3" />
    </>
  ),
  helmet: (
    <>
      <path d="M4 15a8 8 0 0 1 16 0v2H4v-2Z" />
      <path d="M4 16h16M8 15v-3M16 15v-3M12 7v8" />
    </>
  ),
  oxygen: (
    <>
      <path d="M7 3h5v12H7V3Z" />
      <path d="M8.5 3V1.5h2V3M9 6h1M9 9h1" />
      <path d="M12 7h4a3 3 0 0 1 3 3v3" />
      <path d="M17 13h4v4h-4v-4ZM18 17v4" />
    </>
  ),
  'sleeping-bag': (
    <>
      <path d="M7 4h10v13a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V4Z" />
      <path d="M7 8h10M7 12h10M7 16h10" />
      <path d="M9 4c.3 1.2 1.3 1.8 3 1.8S14.7 5.2 15 4" />
    </>
  ),
  stove: (
    <>
      <path d="M9 14h6v7H9v-7ZM7 21h10" />
      <path d="M12 12c-2-2 1-3 0-5 2 1 3 3 2 5M10 14h4" />
      <path d="m7 18-3 1M17 18l3 1" />
    </>
  ),
  radio: (
    <>
      <path d="M7 6h10v15H7V6ZM10 3v3" />
      <path d="M9 9h2M9 12h2M9 15h2" />
      <path d="M14 9v9M17 9v9" />
    </>
  ),
  glasses: (
    <>
      <path d="M3 10h6l2 4h2l2-4h6" />
      <path d="M3 10a4 4 0 1 0 6 0M15 10a4 4 0 1 0 6 0" />
      <path d="M11 13h2" />
    </>
  ),
  sunscreen: (
    <>
      <path d="M9 8h6v13H9V8ZM10 8V5h4v3M10 5V3h4v2" />
      <path d="M12 12h1M12 15h1M12 18h1" />
    </>
  ),
  poles: (
    <>
      <path d="m8 3-2 18M16 3l2 18" />
      <path d="M6 5h4M14 5h4M5 10h4M15 10h4" />
      <path d="M5 18h5M14 18h5" />
    </>
  ),
};

type GearIconProps = {
  name: string;
  className?: string;
};

export default function GearIcon({ name, className }: GearIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name] ?? icons['ice-axe']}
    </svg>
  );
}

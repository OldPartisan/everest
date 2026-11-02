import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import type { ReactNode } from 'react';

import SiteFooter from '@/components/Footer';
import SiteHeader from '@/components/SiteHeader';
import { everestData } from '@/lib/data';
import { withBase } from '@/lib/withBase';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site';

import './globals.css';

const ogImage = `${SITE_URL}images/og-everest.jpg`;

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  weight: ['500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — 8 848,86 м · история, маршруты, 3D`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: 'Everest Field Notes',
  authors: [{ name: 'OldPartisan', url: 'https://github.com/oldpartisan' }],
  creator: 'OldPartisan',
  publisher: 'OldPartisan',
  category: 'education',
  keywords: [
    'Эверест',
    'Джомолунгма',
    'Сагарматха',
    'Everest',
    'Гималаи',
    'история восхождений',
    'маршруты Эвереста',
    '3D Эверест',
    'стоимость экспедиции',
    'Himalayan Database',
  ],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: `${SITE_URL}favicon.svg`, type: 'image/svg+xml' },
      { url: `${SITE_URL}favicon-32.png`, sizes: '32x32', type: 'image/png' },
    ],
    shortcut: `${SITE_URL}favicon-32.png`,
    apple: [{ url: `${SITE_URL}apple-touch-icon.png`, sizes: '512x512', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — высочайшая вершина Земли`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Эверест: чёрно-белая панорама вершины и надпись «Эверест. 8 848,86 м»',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — высочайшая вершина Земли`,
    description: SITE_DESCRIPTION,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
  colorScheme: 'light',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      url: SITE_URL,
      name: 'Everest Field Notes',
      description: SITE_DESCRIPTION,
      inLanguage: 'ru-RU',
      publisher: {
        '@type': 'Person',
        name: 'OldPartisan',
        url: 'https://github.com/oldpartisan',
      },
    },
    {
      '@type': 'Mountain',
      '@id': `${SITE_URL}#everest`,
      name: 'Эверест',
      alternateName: everestData.peak.names.map((item) => item.name),
      description:
        'Высочайшая гора Земли над уровнем моря, 8 848,86 м. Расположена на границе Непала и Тибетского автономного района Китая.',
      height: {
        '@type': 'QuantitativeValue',
        value: everestData.peak.height,
        unitCode: 'MTR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: everestData.peak.coordinates.lat,
        longitude: everestData.peak.coordinates.lng,
        elevation: everestData.peak.height,
      },
      url: SITE_URL,
      image: ogImage,
      isAccessibleForFree: true,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <link rel="manifest" href={withBase('/manifest.webmanifest')} />
        <link
          rel="preload"
          as="image"
          href={withBase('/images/hero-everest-960.avif')}
          media="(max-width: 767px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href={withBase('/images/hero-everest-1800.avif')}
          media="(min-width: 768px)"
          fetchPriority="high"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Перейти к содержанию
        </a>
        <noscript>
          <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-white/15 bg-ink-0 px-5 py-3 text-center text-xs leading-5 text-bg-2">
            Для интерактивной 3D-модели, карты и параллакса нужен JavaScript. Текст, таблицы и
            источники доступны без него.
          </div>
        </noscript>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <script
          type="application/ld+json"
          // JSON-LD is generated solely from trusted local data.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </body>
    </html>
  );
}

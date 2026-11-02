# Эверест · Everest Field Notes

Премиальный образовательный лонгрид о высочайшей вершине Земли: история восхождений, разбор
маршрутов, интерактивная карта, 3D-рельеф из SRTM, стоимость экспедиции 2025, снаряжение,
культура и проверяемые источники.

**Публичный URL:** [https://oldpartisan.github.io/everest](https://oldpartisan.github.io/everest)
**Репозиторий:** [github.com/oldpartisan/everest](https://github.com/oldpartisan/everest)

---

## Стек

- **Next.js 14 (App Router)** + TypeScript, статический экспорт `output: 'export'`.
- **Tailwind CSS 3** + CSS-переменные, шрифты Inter/Montserrat через `next/font` (self-hosted).
- **Framer Motion** — появление секций, счётчики, раскрытие таймлайна, модальные окна.
- **GSAP ScrollTrigger** — параллакс hero и «прорисовка» линии таймлайна.
- **React Three Fiber + Drei** — 3D-модель массива Эвереста (GLB, SRTM/DEM), маршрут и лагеря.
- **Leaflet + OpenStreetMap** — карта без API-ключей, grayscale-стилизация, flyTo по лагерям.
- **Zod** — валидация JSON-данных на этапе сборки.
- Деплой — **GitHub Pages**, ветка `gh-pages`; готовый workflow для Actions лежит в `docs/github-actions-deploy.yml`.

## Быстрый старт

```bash
npm install
npm run dev
# http://localhost:3000/  — в dev basePath отключён
```

Node.js **20+** (проверено на 20 и 24).

### Production-сборка

```bash
NODE_ENV=production npm run build
# результат: ./out
```

`next build` сам выставляет `NODE_ENV=production`; явное указание оставлено для предсказуемости.

### Локальный просмотр production-сборки

В production все ассеты используют префикс `/everest`. Для корректного просмотра добавлен
мини-сервер, который монтирует `out` в `/everest/`:

```bash
npm run build
npm run preview
# http://localhost:3000/everest/
```

`npm run serve` (`npx serve out`) оставлен для «сырого» просмотра статики; при открытии на нём
нужно учитывать, что production-пути ожидают префикс `/everest`.

### Проверки

```bash
npm run lint
npm run build
```

Сборка должна завершиться без предупреждений о SSR, ISR, API routes или next/image optimization.
Все страницы помечены как `○ (Static)`.

---

## Почему статический экспорт и как учтён basePath

GitHub Pages отдаёт только статические файлы, поэтому:

1. `next.config.js` включает `output: 'export'` — Next создаёт `/out`, без Node-сервера.
2. В production задаются `basePath: '/everest'` и `assetPrefix: '/everest/'`. В dev оба пустые,
   поэтому `npm run dev` работает на корне.
3. `next/image` работает в режиме `unoptimized`, изображения лежат в `public/images`.
4. `public/.nojekyll` отключает Jekyll и сохраняет папку `_next`.
5. `app/not-found.tsx` статически экспортируется в `out/404.html`.
6. Для публичных файлов используется хелпер `withBase()` из `lib/withBase.ts`, потому что
   произвольные строки `src="/images/..."` Next не всегда префиксует автоматически.
   Проверено в собранном HTML: пути имеют ровно один префикс `/everest/`.
7. `app/sitemap.ts`, `app/robots.ts` и статический `public/manifest.webmanifest` учитывают
   production-домен. Ссылка на manifest добавлена в `<head>` вручную, чтобы не потерять
   `basePath`.
8. Внутренние ссылки — нативные `href="#..."`; для страницы 404 используется `next/link`.
9. `app/layout.tsx` задаёт абсолютные canonical/OG-URL, поэтому соцсети видят корректную картинку.

---

## Структура

```text
.
├── app/
│   ├── globals.css          # токены, типографика, Leaflet, 3D-подписи, motion
│   ├── layout.tsx           # metadata, OG, JSON-LD, шрифты, header/footer
│   ├── page.tsx             # сборка секций
│   ├── not-found.tsx        # кастомная 404 → out/404.html
│   ├── robots.ts
│   ├── sitemap.ts
├── components/
│   ├── Hero.tsx
│   ├── Stats.tsx
│   ├── About.tsx
│   ├── Timeline.tsx
│   ├── RouteExplorer.tsx    # маршруты, лагеря, карта + 3D
│   ├── RoutesMap.tsx        # Leaflet
│   ├── Everest3D.tsx        # lazy-обёртка, WebGL-fallback, мобильный режим
│   ├── MountainScene.tsx    # R3F-сцена, GLB, камера, маршрут
│   ├── MountainRidges.tsx
│   ├── CostSection.tsx
│   ├── GearSection.tsx
│   ├── GearIcon.tsx
│   ├── CultureSection.tsx
│   ├── KnowledgeSection.tsx
│   ├── SiteHeader.tsx
│   ├── Footer.tsx
│   └── ui/
│       ├── Section.tsx
│       ├── SectionHeading.tsx
│       ├── Reveal.tsx
│       ├── AnimatedNumber.tsx
│       ├── StatusChip.tsx
│       └── TopoLines.tsx
├── data/
│   └── everest.json         # единственный источник фактов
├── lib/
│   ├── data.ts              # типизированные селекторы
│   ├── schema.ts            # Zod-схема
│   ├── site.ts
│   ├── format.ts
│   └── withBase.ts
├── public/
│   ├── .nojekyll
│   ├── images/
│   ├── models/everest.glb
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   └── manifest.webmanifest
├── scripts/
│   ├── generate_model.py    # SRTM → компактный GLB
│   └── preview.mjs          # локальный preview с /everest
├── docs/
│   ├── research.md
│   └── github-actions-deploy.yml
├── next.config.js
├── tailwind.config.ts
├── package.json
├── package-lock.json
├── LICENSE
└── README.md
```

---

## Данные и достоверность

`data/everest.json` — единственный источник чисел и фактов. Схема проверяется Zod при импорте:
если структура нарушена, сборка падает. В JSX нет захардкоженных исторических дат и цен.

В данных есть отдельные поля:

- `status` / `statusLabel` — подтверждено, оспаривается, не подтверждено;
- `sourceIds` — ссылки на записи из `sources`;
- `factChecks` — исправленные формулировки;
- `imageCredits` — лицензии фотографий.

Принципиальные уточнения:

- высота — **8 848,86 м** (совместное решение Непала и Китая, 8 декабря 2020);
- первое **подтверждённое** восхождение — 29 мая 1953, Хиллари и Тенцинг;
- восхождение Мэллори и Ирвина 1924 года **не доказано**;
- в 2024 году найдены **частичные останки** Ирвина (ботинок и ступня с именной биркой);
- **Западный гребень впервые пройден в 1963 году** (Хорнбайн и Унзольд), а не в 2011-м;
  в 2011-м Апа Шерпа совершил 21-е восхождение и завершил карьеру;
- Непал поднял весенний сбор за разрешение с **$11 000** до **$15 000** с 1 сентября 2025;
- с 2025 года действует запрет соло-восхождений на восьмитысячники и правило «1 гид на 2 клиентов».

Все источники и оговорки перечислены в `data/everest.json` и на сайте в секции «Знания».

## 3D-модель

`public/models/everest.glb` — компактная (≈1,9 МБ) модель рельефа, собранная из SRTM 1 arc-second
(NASA/USGS, public domain). Скрипт воспроизводит её из двух тайлов:

```bash
# N27E086.hgt и N28E086.hgt — публичные тайлы SRTM
python3 scripts/generate_model.py /path/N27E086.hgt /path/N28E086.hgt
```

Модель использует сглаженные нормали, вершинные цвета «снег/скала» и лёгкое затухание к краям.
Вертикальное преувеличение ≈4× подписано в интерфейсе. Это визуализация, а не навигационный
трек.

## Производительность и доступность

- 3D и Leaflet загружаются лениво при приближении к секции; на мобильных 3D по умолчанию
  заменено изображением с кнопкой «Включить 3D».
- Есть fallback при отсутствии WebGL и error boundary для сцены.
- `prefers-reduced-motion` отключает параллакс, счётчики и тяжёлые переходы.
- Семантические `section`/`h1–h3`, skip-link, focus-visible, `aria-expanded`, `aria-pressed`,
  `aria-controls`, модальное окно с фокус-ловушкой и Escape.
- Фотографии — WebP, шрифты — локальные WOFF2, без внешних запросов к Google Fonts.
- OpenGraph 1200×630, canonical, JSON-LD, sitemap, robots.

## Аудит

Lighthouse на **живом GitHub Pages**:

| Режим | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobile | **99** | **100** | 96 | **100** |
| Desktop | **99** | **100** | **100** | **100** |

- axe-core (WCAG 2.1 AA): **0** нарушений на 1440 и 360 px.
- Горизонтальный скролл: 360 / 390 / 768 / 1024 / 1440 px — без переполнения.
- Проверены маршруты, переключение карты/3D, модальные окна, меню, reduced-motion, 404.
- Mobile Best Practices 96 — единственное замечание Lighthouse касается размера мелких
  uppercase-подписей (декоративная типографика), не ошибка доступности.

3D и карта намеренно не входят в критический путь первой отрисовки.

## Деплой на GitHub Pages

Текущая публикация: **ветка `gh-pages`**, источник Pages — `Deploy from a branch` →
`gh-pages` / `/ (root)`. Сайт: **https://oldpartisan.github.io/everest/**.

Почему не Actions в этом запуске: токен среды публикации не имел OAuth-scope `workflow`,
поэтому GitHub отклонил push файла `.github/workflows/deploy.yml`. Код, workflow-шаблон и
инструкция готовы; для перехода на Actions достаточно:

1. Взять токен/аккаунт с правом `workflow`.
2. Скопировать `docs/github-actions-deploy.yml` в `.github/workflows/deploy.yml`.
3. **Settings → Pages → Source: GitHub Actions**.
4. Push в `main` — workflow выполнит:
   `checkout → setup-node 20 → npm ci → npm run build → configure-pages →
   upload-pages-artifact (./out) → deploy-pages`.

Резервный вариант (использован сейчас): `out/` опубликован в ветке `gh-pages`.
`public/.nojekyll` включён, кастомная 404 собирается в `out/404.html` и отдаётся GitHub Pages
для несуществующих путей.

## Лицензии

- Код — MIT.
- Тексты и подборка данных — CC BY 4.0.
- Фотографии — CC BY 4.0 / CC BY-SA 2.5, авторы указаны в футере и `imageCredits`.
- SRTM — NASA/USGS, public domain.
- Карта — © OpenStreetMap contributors, ODbL.

---

Сделано с уважением к горе.

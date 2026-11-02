import { z } from 'zod';

const ConfidenceSchema = z.enum(['confirmed', 'disputed', 'unconfirmed']);

const PersonSchema = z.object({
  id: z.string(),
  name: z.string(),
  initials: z.string(),
  years: z.string(),
  role: z.string(),
  country: z.string(),
  route: z.string(),
  bio: z.string(),
  knownFor: z.string(),
  photo: z.string(),
  photoAlt: z.string(),
  photoCredit: z.string(),
  photoLicense: z.string(),
  photoUrl: z.string().url(),
  photoPosition: z.string().optional(),
  note: z.string().optional(),
  status: ConfidenceSchema.optional(),
  sourceIds: z.array(z.string()),
});

const SourceRefSchema = z.object({
  id: z.string(),
  title: z.string(),
  publisher: z.string(),
  kind: z.enum(['database', 'official', 'news', 'archive', 'tertiary', 'book']),
  url: z.string().url(),
  note: z.string(),
});

const NameSchema = z.object({
  name: z.string(),
  script: z.string(),
  language: z.string(),
  meaning: z.string(),
  note: z.string(),
});

const StatSchema = z.object({
  id: z.string(),
  value: z.number(),
  decimals: z.number().int().min(0).max(2),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  label: z.string(),
  note: z.string(),
});

const HistoryItemSchema = z.object({
  id: z.string(),
  year: z.number(),
  date: z.string(),
  title: z.string(),
  route: z.string(),
  participants: z.string(),
  summary: z.string(),
  detail: z.string(),
  status: ConfidenceSchema,
  statusLabel: z.string(),
  sourceIds: z.array(z.string()),
});

const CampSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  altitude: z.number(),
  lat: z.number(),
  lng: z.number(),
  type: z.enum(['base', 'camp', 'col', 'summit']),
  summary: z.string(),
  detail: z.string(),
});

const GeometryPointSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  alt: z.number(),
});

const RouteSchema = z.object({
  id: z.enum(['south', 'north']),
  name: z.string(),
  subtitle: z.string(),
  country: z.string(),
  season: z.string(),
  length: z.string(),
  difficulty: z.string(),
  successNote: z.string(),
  summary: z.string(),
  features: z.array(z.object({ title: z.string(), text: z.string() })),
  camps: z.array(CampSchema),
  geometry: z.array(GeometryPointSchema),
});

const CostRangeSchema = z.object({
  id: z.string(),
  label: z.string(),
  country: z.string(),
  min: z.number(),
  max: z.number(),
  note: z.string(),
});

const CostItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  min: z.number(),
  max: z.number(),
  note: z.string(),
});

const GearItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  note: z.string(),
});

const GearGroupSchema = z.object({
  id: z.string(),
  label: z.string(),
  caption: z.string(),
  items: z.array(GearItemSchema),
});

const CultureItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  originalTitle: z.string(),
  author: z.string().optional(),
  director: z.string().optional(),
  year: z.number(),
  kind: z.enum(['book', 'film']),
  coverWord: z.string(),
  cover: z.string().optional(),
  description: z.string(),
  themes: z.array(z.string()),
  runtime: z.string().optional(),
  platform: z.string().optional(),
  release: z.string().optional(),
  cast: z.array(z.string()).optional(),
  award: z.string().optional(),
  featured: z.boolean().optional(),
  url: z.string().url().optional(),
});

const SourceSchema = SourceRefSchema;

const ImageCreditSchema = z.object({
  file: z.string(),
  title: z.string(),
  author: z.string(),
  license: z.string(),
  url: z.string().url(),
  note: z.string(),
});

export const EverestDataSchema = z.object({
  meta: z.object({
    title: z.string(),
    subtitle: z.string(),
    updated: z.string(),
    dataYear: z.number(),
    canonical: z.string().url(),
    repo: z.string().url(),
    license: z.string(),
    disclaimer: z.string(),
  }),
  peak: z.object({
    name: z.string(),
    nameEn: z.string(),
    height: z.number(),
    heightDisplay: z.string(),
    unit: z.string(),
    heightSince: z.number(),
    heightNote: z.string(),
    names: z.array(NameSchema),
    coordinates: z.object({ lat: z.number(), lng: z.number(), dms: z.string() }),
    location: z.object({
      countries: z.array(z.string()),
      range: z.string(),
      nepal: z.string(),
      china: z.string(),
      borderNote: z.string(),
    }),
    firstAscent: z.object({
      date: z.string(),
      dateLabel: z.string(),
      climbers: z.array(z.string()),
      expedition: z.string(),
      route: z.string(),
      status: ConfidenceSchema,
      note: z.string(),
    }),
    summitCount: z.number(),
    summitCountYear: z.number(),
    summitCountNote: z.string(),
    annualAttempts: z.number(),
    annualAttemptsYear: z.number(),
    annualAttemptsNote: z.string(),
    deaths: z.number(),
    deathsYear: z.number(),
    deathsNote: z.string(),
    routesCount: z.number(),
  }),
  stats: z.array(StatSchema),
  about: z.object({
    eyebrow: z.string(),
    title: z.string(),
    statement: z.string(),
    cards: z.array(
      z.object({ id: z.string(), label: z.string(), title: z.string(), text: z.string() }),
    ),
    altitudeFacts: z.array(z.object({ value: z.string(), label: z.string(), text: z.string() })),
  }),
  heightHistory: z.array(
    z.object({
      year: z.number(),
      value: z.string(),
      approx: z.boolean(),
      method: z.string(),
      note: z.string(),
      status: ConfidenceSchema,
    }),
  ),
  history: z.array(HistoryItemSchema),
  people: z.array(PersonSchema),
  routes: z.object({
    eyebrow: z.string(),
    title: z.string(),
    intro: z.string(),
    mapNote: z.string(),
    south: RouteSchema,
    north: RouteSchema,
  }),
  logistics: z.object({
    eyebrow: z.string(),
    title: z.string(),
    items: z.array(
      z.object({ label: z.string(), value: z.string(), text: z.string(), status: z.string() }),
    ),
    notes: z.array(z.string()),
  }),
  cost: z.object({
    eyebrow: z.string(),
    title: z.string(),
    intro: z.string(),
    year: z.number(),
    total: z.object({ label: z.string(), min: z.number(), max: z.number(), note: z.string() }),
    routes: z.array(CostRangeSchema),
    breakdown: z.array(CostItemSchema),
    notes: z.array(z.string()),
  }),
  gear: z.object({
    eyebrow: z.string(),
    title: z.string(),
    intro: z.string(),
    groups: z.array(GearGroupSchema),
  }),
  culture: z.object({
    eyebrow: z.string(),
    title: z.string(),
    intro: z.string(),
    books: z.array(CultureItemSchema),
    films: z.array(CultureItemSchema),
    sherpa: z.object({
      title: z.string(),
      text: z.string(),
      facts: z.array(z.string()),
    }),
  }),
  glossary: z.array(z.object({ term: z.string(), definition: z.string() })),
  factChecks: z.array(
    z.object({
      claim: z.string(),
      correction: z.string(),
      status: z.enum(['corrected', 'clarified']),
    }),
  ),
  sources: z.array(SourceSchema),
  imageCredits: z.array(ImageCreditSchema),
});

export type EverestData = z.infer<typeof EverestDataSchema>;
export type Stat = z.infer<typeof StatSchema>;
export type HistoryItem = z.infer<typeof HistoryItemSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Route = z.infer<typeof RouteSchema>;
export type Camp = z.infer<typeof CampSchema>;
export type CostRange = z.infer<typeof CostRangeSchema>;
export type CostItem = z.infer<typeof CostItemSchema>;
export type GearGroup = z.infer<typeof GearGroupSchema>;
export type GearItem = z.infer<typeof GearItemSchema>;
export type CultureItem = z.infer<typeof CultureItemSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type ImageCredit = z.infer<typeof ImageCreditSchema>;
export type Name = z.infer<typeof NameSchema>;

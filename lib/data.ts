import rawData from '@/data/everest.json';
import { EverestDataSchema, type Camp, type Route } from '@/lib/schema';

export const everestData = EverestDataSchema.parse(rawData);

export const routes: Route[] = [everestData.routes.south, everestData.routes.north];

export const sourceById = new Map(everestData.sources.map((source) => [source.id, source]));

export function getRoute(routeId: Route['id']): Route {
  return routeId === 'north' ? everestData.routes.north : everestData.routes.south;
}

export function getCamp(route: Route, campId: string | null): Camp | null {
  if (!campId) return null;
  return route.camps.find((camp) => camp.id === campId) ?? null;
}

export const cultureItems = [...everestData.culture.books, ...everestData.culture.films];

export const imageCreditByFile = new Map(
  everestData.imageCredits.map((credit) => [credit.file, credit]),
);

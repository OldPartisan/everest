const numberFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

const integerFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatNumber(value: number, decimals = 0): string {
  if (decimals === 0) return integerFormatter.format(Math.round(value));
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${formatNumber(value / 1_000_000, 1)} млн`;
  if (value >= 1_000) return `${formatNumber(value / 1_000, 1)} тыс.`;
  return numberFormatter.format(value);
}

export function formatAltitude(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? formatNumber(rounded) : formatNumber(rounded, 2);
}

export function formatMoney(value: number): string {
  return `$${formatNumber(value)}`;
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

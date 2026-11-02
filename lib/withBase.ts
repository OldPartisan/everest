const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Prefixes a public asset with the GitHub Pages base path in production.
 * Inline SVG data URLs and external URLs are returned unchanged.
 */
export function withBase(path: string): string {
  if (!path.startsWith('/')) return path;
  if (!basePath) return path;
  if (path.startsWith(`${basePath}/`)) return path;
  return `${basePath}${path}`;
}

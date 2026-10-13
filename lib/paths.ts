/**
 * GitHub Pages project sites are served under a base path (/elevar). next/link
 * and next/image get that prefix automatically, but raw URLs — <video poster>,
 * plain <a href>, manifest icons — do not, so they 404 in production without
 * this helper. Dev keeps an empty prefix.
 */
const BASE_PATH = process.env.NODE_ENV === 'production' ? '/elevar' : '';

/** Prefixes a root-relative path with the deployment base path. */
export function withBasePath(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_PATH}${path}`;
}

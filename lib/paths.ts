/** Add the active deployment's path prefix to root-relative static assets. */
const BASE_PATH = process.env.NEXT_PUBLIC_SITE_BASE_PATH ??
  (process.env.NODE_ENV === 'production' ? '/elevar' : '');
const VIDEO_BASE_URL = process.env.NEXT_PUBLIC_VIDEO_BASE_URL ?? '';

/** Prefix static asset paths for GitHub Pages and route video media when configured. */
export function withBasePath(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (VIDEO_BASE_URL && path.toLowerCase().endsWith('.mp4')) {
    return `${VIDEO_BASE_URL}${path}`;
  }
  return `${BASE_PATH}${path}`;
}

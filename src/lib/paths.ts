/** Prefix a site-relative path with the Astro base (needed on GitHub Pages). */
export function withBase(path: string, base = import.meta.env.BASE_URL) {
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith(base)) {
    return path;
  }

  return `${base}${path.replace(/^\//, '')}`;
}

export function isExternalUrl(path: string) {
  return path.startsWith('http://') || path.startsWith('https://');
}

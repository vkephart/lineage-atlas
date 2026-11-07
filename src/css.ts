import type { CSSProperties } from 'react';

const cache = new Map<string, CSSProperties>();

/**
 * Parse a CSS declaration string ("a:b;c:d") into a React style object.
 * Results are memoised, so static strings cost one parse for the app's lifetime.
 * This keeps the ported component close to the design prototype's inline styles.
 */
export function css(decl: string): CSSProperties {
  let o = cache.get(decl);
  if (o) return o;
  o = {};
  for (const part of decl.split(';')) {
    const i = part.indexOf(':');
    if (i < 0) continue;
    const prop = part.slice(0, i).trim();
    const val = part.slice(i + 1).trim();
    if (!prop) continue;
    const key = prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    (o as Record<string, string>)[key] = val;
  }
  cache.set(decl, o);
  return o;
}

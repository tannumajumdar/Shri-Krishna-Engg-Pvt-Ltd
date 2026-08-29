export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Wraps `value` into the half-open range [min, max) — used by the marquee loop. */
export function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

export function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

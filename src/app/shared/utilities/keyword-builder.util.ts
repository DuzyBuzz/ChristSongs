import { slugify } from './slug.util';

export function buildSearchKeywords(...values: readonly string[]): string[] {
  const keywords = new Set<string>();

  values
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .forEach((value) => {
      const slug = slugify(value);

      if (slug) {
        keywords.add(slug);
      }

      value
        .toLowerCase()
        .split(/\s+/)
        .filter((fragment) => fragment.length >= 2)
        .forEach((fragment) => keywords.add(fragment));
    });

  return [...keywords];
}
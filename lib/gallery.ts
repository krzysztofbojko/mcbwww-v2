import fs from "node:fs";
import path from "node:path";

const IMAGE = /\.(jpe?g|png|webp|avif|gif)$/i;

/**
 * Photo files in `public/gallery`, read at build time (the gallery page is static).
 * Image extensions only, sorted alphabetically; a missing directory yields [].
 */
export function getGalleryImages(): string[] {
  // A literal path (not a parameter) so the build traces only this folder, not the whole project.
  const dir = path.join(process.cwd(), "public/gallery");
  try {
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((file) => IMAGE.test(file))
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

/**
 * Lays the files out in the curated rows (`layout`), dropping names that no longer exist,
 * then appends any uncurated files in rows of three so a newly added photo still appears.
 */
export function arrangeGallery(files: string[], layout: string[][]): string[][] {
  const available = new Set(files);
  const used = new Set<string>();
  const rows: string[][] = [];
  for (const row of layout) {
    const kept = row.filter((f) => available.has(f) && !used.has(f));
    kept.forEach((f) => used.add(f));
    if (kept.length > 0) rows.push(kept);
  }
  const rest = files.filter((f) => !used.has(f));
  for (let i = 0; i < rest.length; i += 3) rows.push(rest.slice(i, i + 3));
  return rows;
}

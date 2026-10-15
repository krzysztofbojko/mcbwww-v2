import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOTS = ["app", "components", "lib", "content", "i18n"];

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return sourceFiles(p);
    return /\.(ts|tsx)$/.test(d.name) ? [p] : [];
  });
}

const clientFiles = ROOTS.flatMap(sourceFiles).filter((f) =>
  /^\s*(?:\/\/[^\n]*\n\s*)*["']use client["']/.test(fs.readFileSync(f, "utf8")),
);

/** Module specifiers of static and dynamic imports and re-exports. */
function specifiers(src: string): string[] {
  return [...src.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g)].map((m) => m[1]);
}

// Barrels pull every module they re-export into the client chunk: all content data (projects, publications, …)
// or every UI primitive (Section → Reveal → motion). Client components import leaf modules instead.
const BARRELS = [/^@\/content(?:\/index)?$/, /^@\/components\/ui(?:\/index)?$/];

describe("client components avoid barrels", () => {
  it("finds the client components", () => {
    expect(clientFiles.length).toBeGreaterThanOrEqual(9);
    expect(clientFiles).toContain(path.join("components", "sections", "NavLinks.tsx"));
    expect(clientFiles).toContain(path.join("components", "ui", "Reveal.tsx"));
  });

  it.each(clientFiles)("%s imports no @/content or @/components/ui barrel", (file) => {
    const dir = path.dirname(file);
    const bad = specifiers(fs.readFileSync(file, "utf8")).filter((s) => {
      if (BARRELS.some((re) => re.test(s))) return true;
      if (!s.startsWith(".")) return false;
      // Relative paths that land on a barrel (e.g. "../ui", "./index" inside components/ui).
      const resolved = path.normalize(path.join(dir, s)).replace(/\/index$/, "");
      return resolved === "content" || resolved === path.join("components", "ui");
    });
    expect(bad).toEqual([]);
  });
});

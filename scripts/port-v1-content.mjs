// One-off migration: generates content/{equipment,projects,publications}.json from the v1 JSON files.
// Usage: node scripts/port-v1-content.mjs /path/to/mcb-website
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const v1 = process.argv[2];
if (!v1) {
  console.error("Usage: node scripts/port-v1-content.mjs <path-to-v1-repo>");
  process.exit(1);
}
const out = join(dirname(fileURLToPath(import.meta.url)), "..", "content");

// Must stay identical to slugify in content/index.ts.
const slugify = (s) =>
  s
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const readJson = (f) => JSON.parse(readFileSync(join(v1, "lib", f), "utf8"));
const write = (f, data) => writeFileSync(join(out, f), JSON.stringify(data, null, 2) + "\n");
const defined = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== ""));

// Equipment
const used = new Map();
const equipment = readJson("infrastructureData.json").map((i) => {
  const base = slugify(i.name);
  const n = (used.get(base) ?? 0) + 1;
  used.set(base, n);
  return defined({
    slug: n === 1 ? base : `${base}-${n}`,
    serviceSlug: slugify(i.serviceTitle),
    clusterId: i.clusterId,
    name: i.name,
    fullName: i.fullName,
    manufacturer: i.manufacturer,
    specs: i.specs ?? [],
    isFlagship: Boolean(i.isFlagship),
    flagshipHighlight: i.flagshipHighlight ? { pl: i.flagshipHighlight } : undefined,
  });
});
write("equipment.json", equipment);

// Projects
write(
  "projects.json",
  readJson("projekty.json").map((p) =>
    defined({
      id: p.id,
      status: p.status,
      title: p.tytul,
      funding: p.zrodlo_finansowania,
      budget: p.budzet,
      lead: p.kierownik,
      period: p.czas_realizacji,
      summary: p.streszczenie,
      description: p.opis,
    }),
  ),
);

// Publications
write(
  "publications.json",
  readJson("publikacje.json").map((p) =>
    defined({
      id: p.id,
      year: p.rok,
      text: p.tekst_czysty,
      impactFactor: p.if,
      mnisw: p.mnisw,
      doi: p.doi,
      url: p.link_url,
      scholarUrl: p.scholar_url,
    }),
  ),
);

console.log(`equipment: ${equipment.length}`);

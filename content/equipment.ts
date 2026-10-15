/**
 * Client-safe slice of the content: clusters, services, equipment and the pure helpers over them.
 * Client components import from here (not from "@/content", which also pulls projects, publications and experts
 * into the bundle). content/index.ts re-exports everything below, so server code is unchanged.
 */
import type { ClusterId, Equipment, Service } from "./types";
import { clusters } from "./clusters";
import { services } from "./services";
import equipmentJson from "./equipment.json";

export type * from "./types";
export { clusters, services };

export const equipment = equipmentJson as Equipment[];

/** Strips diacritics (incl. ł, which NFD does not decompose) and lowercases. */
function fold(s: string): string {
  return s
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function slugify(s: string): string {
  return fold(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getEquipment(slug: string): Equipment | undefined {
  return equipment.find((e) => e.slug === slug);
}

export function servicesByCluster(id: ClusterId): Service[] {
  return services.filter((s) => s.clusterId === id);
}

export function equipmentForService(slug: string): Equipment[] {
  return equipment.filter((e) => e.serviceSlug === slug);
}

/**
 * Specs worth showing. v1 filled `specs` of some items with a single placeholder word that merely
 * repeats the service name („Preparatyka”, „Wytwarzanie”, „Informatyka”…). A spec is a placeholder when it
 * is one word, contains no digit, and equals (ignoring case and diacritics) a word of the item's service title.
 * Such items are shown without a spec list (name + manufacturer), per docs/design/direction.md.
 */
export function meaningfulSpecs(item: Equipment): string[] {
  const service = getService(item.serviceSlug);
  const titleWords = new Set(
    service ? [service.title.pl, service.title.en ?? ""].flatMap((t) => fold(t).split(/[^a-z0-9]+/)).filter(Boolean) : [],
  );
  return item.specs.filter((spec) => {
    const s = spec.trim();
    const isPlaceholder = !/\s/.test(s) && !/\d/.test(s) && titleWords.has(fold(s));
    return s.length > 0 && !isPlaceholder;
  });
}

export interface EquipmentQuery {
  clusterId?: ClusterId;
  /** Keep items of any of these services; empty or absent = no service filter. */
  serviceSlugs?: string[];
  flagshipOnly?: boolean;
  /** Free text, matched diacritic-insensitively against name, full name, manufacturer and specs. */
  query?: string;
}

export function filterEquipment(items: Equipment[], q: EquipmentQuery): Equipment[] {
  const needle = q.query ? fold(q.query.trim()) : "";
  const inServices = q.serviceSlugs && q.serviceSlugs.length > 0 ? new Set(q.serviceSlugs) : null;
  return items.filter((e) => {
    if (q.clusterId && e.clusterId !== q.clusterId) return false;
    if (inServices && !inServices.has(e.serviceSlug)) return false;
    if (q.flagshipOnly && !e.isFlagship) return false;
    if (!needle) return true;
    return [e.name, e.fullName, e.manufacturer ?? "", ...e.specs].some((f) => fold(f).includes(needle));
  });
}

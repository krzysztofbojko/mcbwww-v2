import type { Cluster, ClusterId, Equipment, Expert, Project, Publication, Service } from "./types";
import { clusters } from "./clusters";
import { services } from "./services";
import { experts } from "./experts";
import { site } from "./site";
import equipmentJson from "./equipment.json";
import projectsJson from "./projects.json";
import publicationsJson from "./publications.json";

export type * from "./types";
export { clusters, services, experts, site };

export const equipment = equipmentJson as Equipment[];
export const projects = projectsJson as Project[];
export const publications = publicationsJson as Publication[];

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

/** Empty array means the general MCB contact (UI shows site.email / site.phone). */
export function resolveExperts(service: Service): Expert[] {
  return service.expertIds.flatMap((id) => experts.find((e) => e.id === id) ?? []);
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

export function filterEquipment(items: Equipment[], q: { clusterId?: ClusterId; query?: string }): Equipment[] {
  const needle = q.query ? fold(q.query.trim()) : "";
  return items.filter((e) => {
    if (q.clusterId && e.clusterId !== q.clusterId) return false;
    if (!needle) return true;
    return [e.name, e.fullName, e.manufacturer ?? "", ...e.specs].some((f) => fold(f).includes(needle));
  });
}

export type { Cluster };

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

export function filterEquipment(items: Equipment[], q: { clusterId?: ClusterId; query?: string }): Equipment[] {
  const needle = q.query ? fold(q.query.trim()) : "";
  return items.filter((e) => {
    if (q.clusterId && e.clusterId !== q.clusterId) return false;
    if (!needle) return true;
    return [e.name, e.fullName, e.manufacturer ?? "", ...e.specs].some((f) => fold(f).includes(needle));
  });
}

export type { Cluster };

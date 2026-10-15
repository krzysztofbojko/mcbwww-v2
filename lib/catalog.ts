import { clusters, getService, type ClusterId, type Equipment } from "@/content";

/** Catalog filter state. It lives in the query string: ?klaster=&usluga=&usluga=&wiodace=1&q= */
export interface CatalogFilter {
  clusterId?: ClusterId;
  serviceSlugs: string[];
  flagshipOnly: boolean;
  query: string;
}

export const emptyFilter: CatalogFilter = { clusterId: undefined, serviceSlugs: [], flagshipOnly: false, query: "" };

export const PARAM = { cluster: "klaster", service: "usluga", flagship: "wiodace", query: "q" } as const;

interface ReadableParams {
  get(name: string): string | null;
  getAll(name: string): string[];
}

function isClusterId(v: string | null): v is ClusterId {
  return v !== null && clusters.some((c) => c.id === v);
}

/** Reads the filter from the URL, dropping anything unknown (and services outside the chosen cluster). */
export function parseCatalogParams(params: ReadableParams): CatalogFilter {
  const c = params.get(PARAM.cluster);
  const clusterId = isClusterId(c) ? c : undefined;
  const serviceSlugs = [...new Set(params.getAll(PARAM.service))].filter((slug) => {
    const s = getService(slug);
    return s !== undefined && (!clusterId || s.clusterId === clusterId);
  });
  return {
    clusterId,
    serviceSlugs,
    flagshipOnly: params.get(PARAM.flagship) === "1",
    query: params.get(PARAM.query) ?? "",
  };
}

/** The query string for a filter ("" when nothing is set), in a stable parameter order. */
export function catalogSearch(f: CatalogFilter): string {
  const p = new URLSearchParams();
  if (f.clusterId) p.set(PARAM.cluster, f.clusterId);
  for (const s of f.serviceSlugs) p.append(PARAM.service, s);
  if (f.flagshipOnly) p.set(PARAM.flagship, "1");
  if (f.query.trim()) p.set(PARAM.query, f.query);
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

/** Choosing a cluster keeps only the selected services that belong to it. */
export function withCluster(f: CatalogFilter, clusterId: ClusterId | undefined): CatalogFilter {
  return {
    ...f,
    clusterId,
    serviceSlugs: clusterId ? f.serviceSlugs.filter((s) => getService(s)?.clusterId === clusterId) : f.serviceSlugs,
  };
}

export function toggleService(f: CatalogFilter, slug: string): CatalogFilter {
  const has = f.serviceSlugs.includes(slug);
  return { ...f, serviceSlugs: has ? f.serviceSlugs.filter((s) => s !== slug) : [...f.serviceSlugs, slug] };
}

/** Number shown on the mobile „Filtry · n” button. The text query is visible in the field, so it is not counted. */
export function activeFilterCount(f: CatalogFilter): number {
  return (f.clusterId ? 1 : 0) + f.serviceSlugs.length + (f.flagshipOnly ? 1 : 0);
}

/** Flagship instruments first (mockup 05), otherwise the content order. Stable, non-mutating. */
export function flagshipFirst(items: Equipment[]): Equipment[] {
  return [...items.filter((e) => e.isFlagship), ...items.filter((e) => !e.isFlagship)];
}

import type { Expert, Project, Publication, Service } from "./types";
import { experts } from "./experts";
import { site } from "./site";
import { equipmentPhotos, type EquipmentPhoto } from "./equipment-photos";
import projectsJson from "./projects.json";
import publicationsJson from "./publications.json";

export type * from "./types";
export type { EquipmentPhoto };
export { experts, site };
/** Client components import these from "@/content/equipment" directly to keep projects/publications out of the bundle. */
export {
  clusters,
  services,
  equipment,
  slugify,
  getService,
  getEquipment,
  servicesByCluster,
  equipmentForService,
  meaningfulSpecs,
  filterEquipment,
  type EquipmentQuery,
} from "./equipment";

export const projects = projectsJson as Project[];
export const publications = publicationsJson as Publication[];

/** A photograph of the instrument itself, when one is known; otherwise undefined. */
export function equipmentPhoto(slug: string): EquipmentPhoto | undefined {
  return equipmentPhotos[slug];
}

/** Empty array means the general MCB contact (UI shows site.email / site.phone). */
export function resolveExperts(service: Service): Expert[] {
  return service.expertIds.flatMap((id) => experts.find((e) => e.id === id) ?? []);
}

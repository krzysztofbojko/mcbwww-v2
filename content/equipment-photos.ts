import type { L } from "./types";

export interface EquipmentPhoto {
  src: string;
  alt: L;
  caption: L;
  /** object-position keeping the source watermark out of the crop. */
  position?: string;
}

/**
 * Photographs that show the instrument itself (not just its laboratory). Only add an entry when the photo is
 * known to be of this exact instrument; every other card uses its service's plate with an honest caption.
 */
export const equipmentPhotos: Record<string, EquipmentPhoto> = {
  "piec-lukowy-edmund-buhler-am-500": {
    src: "/gallery/HA705863-scaled.jpg",
    alt: {
      pl: "Dłoń w rękawicy umieszcza próbkę na miedzianej płycie tyglowej pieca łukowego",
      en: "A gloved hand places a sample on the copper crucible plate of the arc furnace",
    },
    caption: {
      pl: "Wsad na miedzianej płycie tyglowej pieca łukowego.",
      en: "A charge on the copper crucible plate of the arc furnace.",
    },
    position: "58% 70%",
  },
};

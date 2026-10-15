import type { L } from "./types";

export interface GalleryPhoto {
  /** What the photograph shows, for screen readers. */
  alt: L;
  /** Short plate caption („Ryc. N …”). */
  caption: L;
  /**
   * object-position of the grid crop. Source photos carry a burned-in „MCB UKSW” mark in one corner:
   * the crop is anchored to the opposite edge so the mark falls outside the plate. The lightbox shows the full photo.
   */
  position?: string;
}

/**
 * Plate aspect per row kind: landscape plates are cropped wide (cuts the corner mark), portraits 5:6.
 * band: for rows that include an already wide source (DSC07368 is 1.68:1), so the crop still clears the mark.
 */
export const galleryAspect = { wide: "7 / 4", band: "15 / 8", portrait: "5 / 6", default: "3 / 2" } as const;

export interface GalleryRow {
  aspect: keyof typeof galleryAspect;
  files: string[];
}

/** Curated order of `public/gallery`. Files missing here are appended in rows of three (lib/gallery arrangeGallery). */
export const galleryRows: GalleryRow[] = [
  { aspect: "wide", files: ["HA705863-scaled.jpg", "DSC_7033-1-scaled.jpg"] },
  {
    aspect: "portrait",
    files: ["DSC1230w-1367x2048-1-e1667394782487.jpg", "DSC1274w-768x1149-1.jpg", "image13.jpg"],
  },
  { aspect: "band", files: ["image0.jpg", "DSC_7049-1-scaled.jpg", "DSC07368.jpg"] },
  { aspect: "wide", files: ["dsc9810-1024x684-1.jpg", "dsc9825-1024x684-1.jpg"] },
];

export const galleryPhotos: Record<string, GalleryPhoto> = {
  "HA705863-scaled.jpg": {
    alt: {
      pl: "Dłoń w rękawicy pęsetą układa próbkę na miedzianej płycie tyglowej pieca łukowego",
      en: "A gloved hand places a sample with tweezers on the copper hearth plate of an arc furnace",
    },
    caption: { pl: "Wsad na płycie tyglowej pieca łukowego.", en: "Charge on the hearth plate of the arc furnace." },
    position: "50% 75%",
  },
  "DSC_7033-1-scaled.jpg": {
    alt: {
      pl: "Stalowa komora z dwoma wziernikami, manometrem i panelem sterowania",
      en: "Steel chamber with two sight glasses, a pressure gauge and a control panel",
    },
    caption: { pl: "Komora procesowa w laboratorium materiałowym.", en: "Process chamber in the materials lab." },
    position: "50% 100%",
  },
  "DSC1230w-1367x2048-1-e1667394782487.jpg": {
    alt: {
      pl: "Rząd szaf serwerowych z napisem CATO w serwerowni",
      en: "A row of server cabinets lettered CATO in the server room",
    },
    caption: { pl: "Klaster obliczeniowy CATO.", en: "The CATO computing cluster." },
    position: "50% 40%",
  },
  "DSC1274w-768x1149-1.jpg": {
    alt: {
      pl: "Otwarta szafa serwerowa z węzłami obliczeniowymi i okablowaniem",
      en: "An open server cabinet with compute nodes and cabling",
    },
    caption: { pl: "Węzły obliczeniowe klastra CATO.", en: "Compute nodes of the CATO cluster." },
    position: "50% 45%",
  },
  "image13.jpg": {
    alt: {
      pl: "Mikroskop cyfrowy z głowicą optyczną nad stolikiem pomiarowym, widok z boku",
      en: "Digital microscope with its optical head over the measuring stage, side view",
    },
    caption: { pl: "Mikroskop cyfrowy, widok z boku.", en: "Digital microscope, side view." },
    position: "50% 100%",
  },
  "image0.jpg": {
    alt: {
      pl: "Mikroskop cyfrowy Keyence VHX i monitor z obrazem powierzchni próbki",
      en: "Keyence VHX digital microscope and a monitor showing the sample surface",
    },
    caption: { pl: "Obrazowanie powierzchni próbki.", en: "Imaging a sample surface." },
    position: "50% 100%",
  },
  "DSC_7049-1-scaled.jpg": {
    alt: {
      pl: "Waga analityczna Radwag z odczytem 100,9148 g",
      en: "Radwag analytical balance reading 100.9148 g",
    },
    caption: { pl: "Waga analityczna.", en: "Analytical balance." },
    position: "50% 100%",
  },
  "DSC07368.jpg": {
    alt: {
      pl: "Badacz w fartuchu analizuje model 3D na dwóch monitorach",
      en: "A researcher in a lab coat works on a 3D model across two monitors",
    },
    caption: { pl: "Obróbka skanów 3D.", en: "Processing 3D scans." },
    position: "50% 0%",
  },
  "dsc9810-1024x684-1.jpg": {
    alt: {
      pl: "Wydruk 3D modelu szczęki z zębami na czarnym tle",
      en: "3D-printed model of a jaw with teeth on a black background",
    },
    caption: { pl: "Model szczęki z druku 3D.", en: "3D-printed jaw model." },
  },
  "dsc9825-1024x684-1.jpg": {
    alt: {
      pl: "Wydruk 3D czaszki gryzonia obok monety jednozłotowej dla skali",
      en: "3D-printed rodent skull next to a one-złoty coin for scale",
    },
    caption: { pl: "Czaszka gryzonia z druku 3D, obok moneta 1 zł.", en: "3D-printed rodent skull beside a 1 zł coin." },
  },
};

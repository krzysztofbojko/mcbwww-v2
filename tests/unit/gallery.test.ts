import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { arrangeGallery, getGalleryImages } from "@/lib/gallery";

describe("getGalleryImages", () => {
  it("lists the ten v1 photos, image files only, sorted", () => {
    const images = getGalleryImages();
    expect(images).toHaveLength(10);
    expect(images.every((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))).toBe(true);
    expect(images).toEqual([...images].sort((a, b) => a.localeCompare(b)));
    expect(images).toContain("HA705863-scaled.jpg");
  });
  it("returns [] for a missing directory", () => {
    const spy = vi.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(getGalleryImages()).toEqual([]);
    spy.mockRestore();
  });
});

describe("arrangeGallery", () => {
  const layout = [
    ["b.jpg", "a.jpg"],
    ["c.jpg", "missing.jpg", "d.jpg"],
  ];
  it("follows the curated rows and drops files that no longer exist", () => {
    const rows = arrangeGallery(["a.jpg", "b.jpg", "c.jpg", "d.jpg"], layout);
    expect(rows).toEqual([
      ["b.jpg", "a.jpg"],
      ["c.jpg", "d.jpg"],
    ]);
  });
  it("appends uncurated files in rows of three, in input order", () => {
    const rows = arrangeGallery(["a.jpg", "b.jpg", "x1.jpg", "x2.jpg", "x3.jpg", "x4.jpg"], layout);
    expect(rows).toEqual([["b.jpg", "a.jpg"], ["x1.jpg", "x2.jpg", "x3.jpg"], ["x4.jpg"]]);
  });
  it("never repeats a file listed twice in the layout", () => {
    expect(arrangeGallery(["a.jpg"], [["a.jpg"], ["a.jpg"]])).toEqual([["a.jpg"]]);
  });
});

describe("gallery content", () => {
  it("every photo on disk has a description and every curated file exists", async () => {
    const { galleryPhotos, galleryRows } = await import("@/content/gallery");
    const files = getGalleryImages();
    expect(files.filter((f) => !galleryPhotos[f])).toEqual([]);
    expect(galleryRows.flatMap((r) => r.files).filter((f) => !files.includes(f))).toEqual([]);
    expect(arrangeGallery(files, galleryRows.map((r) => r.files)).flat().sort()).toEqual([...files].sort());
  });
});

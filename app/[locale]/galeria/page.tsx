import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { galleryAspect, galleryPhotos, galleryRows } from "@/content/gallery";
import { pageMetadata } from "@/lib/seo";
import { getDictionary, isLocale, t } from "@/i18n";
import { arrangeGallery, getGalleryImages } from "@/lib/gallery";
import { Heading, Section } from "@/components/ui";
import { GalleryGrid, type GalleryItem } from "@/components/sections/GalleryGrid";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata({ locale, path: "/galeria", title: dict.gallery.title, description: dict.gallery.metaDescription });
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const s = dict.gallery;

  // Read public/gallery at build time; curated rows first, any new photo appended in rows of three.
  const files = getGalleryImages();
  const aspectOf = (file: string) => {
    const row = galleryRows.find((r) => r.files.includes(file));
    return galleryAspect[row?.aspect ?? "default"];
  };
  const arranged = arrangeGallery(
    files,
    galleryRows.map((r) => r.files),
  );
  const rows: GalleryItem[][] = arranged.map((row, r) =>
    row.map((file, j) => {
      const n = arranged.slice(0, r).flat().length + j + 1;
      const meta = galleryPhotos[file];
      return {
        src: `/gallery/${file}`,
        alt: meta ? t(meta.alt, locale) : s.fallbackAlt.replace("{n}", String(n)),
        caption: meta ? t(meta.caption, locale) : "",
        aspect: aspectOf(file),
        position: meta?.position ?? "50% 50%",
      };
    }),
  );

  return (
    <main id="main">
      <Section tone="paper" space="loose" aria-labelledby="gallery-title" className="md:pt-20">
        <div className="grid-12 gap-y-5">
          <Heading as="h1" size="l" id="gallery-title" className="col-span-12 md:col-span-7">
            {s.title}
          </Heading>
          <p className="col-span-12 m-0 max-w-[30em] text-body text-ink-muted md:col-span-5 md:col-start-8 md:pt-3 lg:col-span-4 lg:col-start-9">
            {s.lede}
          </p>
        </div>
        <GalleryGrid rows={rows} locale={locale} strings={s} />
      </Section>
    </main>
  );
}

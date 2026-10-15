import type { ReactNode } from "react";
import Image from "next/image";
import type { Locale } from "@/i18n";
import { cn } from "./cn";

export interface FigureProps {
  src: string;
  alt: string;
  /** Plate number shown as „Ryc. N” (EN: „Fig. N”). Omit, with no caption, for an uncaptioned plate (cluster index). */
  number?: number;
  caption?: ReactNode;
  /** CSS aspect-ratio of the plate, e.g. "3 / 2", "3 / 4". The photo is cropped to fit. */
  aspect?: string;
  /** object-position for the crop, used to keep the source watermark out of frame. */
  position?: string;
  /** next/image sizes hint; defaults to a half-width plate. */
  sizes?: string;
  /** Above-the-fold LCP plate (hero). */
  preload?: boolean;
  locale?: Locale;
  className?: string;
}

/** Photograph captioned like a scientific plate. Square, no shadow, paper-deep while loading. */
export function Figure({
  src,
  alt,
  number,
  caption,
  aspect = "3 / 2",
  position = "50% 50%",
  sizes = "(min-width: 768px) 50vw, 100vw",
  preload,
  locale = "pl",
  className,
}: FigureProps) {
  const label = locale === "en" ? "Fig." : "Ryc.";
  return (
    <figure className={cn("m-0", className)}>
      <div className="relative w-full overflow-hidden bg-paper-deep" style={{ aspectRatio: aspect }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </div>
      {number !== undefined || caption ? (
        <figcaption className="mt-3 flex gap-3 text-small text-ink-muted">
          {number !== undefined ? (
            <span className="whitespace-nowrap font-display italic text-ink">
              {label} {number}
            </span>
          ) : null}
          {caption ? <span>{caption}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { Dictionary, Locale } from "@/i18n";
import { Figure, cn } from "@/components/ui";

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  /** Plate crop in the grid (the lightbox shows the full photo). */
  aspect: string;
  position: string;
}

export interface GalleryGridProps {
  /** Curated rows of two or three plates; numbering runs through the rows. */
  rows: GalleryItem[][];
  locale: Locale;
  strings: Dictionary["gallery"];
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * „Ryc. N” plates in rows of two or three. Each plate is a link to the full photo (works without JS);
 * with JS it opens a modal <dialog> viewer: ←/→ step through, Esc closes, Tab stays inside,
 * and focus returns to the plate of the photo last shown.
 */
export function GalleryGrid({ rows, locale, strings: s }: GalleryGridProps) {
  const items = rows.flat();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [index, setIndex] = useState<number | null>(null);
  const indexRef = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const label = locale === "en" ? "Fig." : "Ryc.";
  const plateName = (i: number) => [`${label} ${i + 1}`, items[i].caption].filter(Boolean).join(". ");

  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + items.length) % items.length)),
    [items.length],
  );

  function open(i: number, e: MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks (new tab, download) through to the plain image link.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setIndex(i);
    dialogRef.current?.showModal();
  }

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      const last = indexRef.current;
      setIndex(null);
      if (last !== null) linkRefs.current[last]?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // Lock page scroll while the viewer covers it.
  const isOpen = index !== null;
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [isOpen]);

  function onKeyDown(e: KeyboardEvent<HTMLDialogElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "Tab") {
      const nodes = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // A click on the dark backdrop area (outside the photo and controls) closes the viewer.
  function onDialogClick(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.backdrop !== undefined) close();
  }

  const rowStart = rows.map((_, r) => rows.slice(0, r).reduce((sum, row) => sum + row.length, 0));
  const current = index === null ? null : items[index];

  return (
    <>
      <div className="mt-12 flex flex-col gap-y-10 md:mt-16 md:gap-y-14">
        {rows.map((row, r) => (
          <ul key={r} className="grid-12 m-0 list-none gap-y-10 p-0">
            {row.map((item, j) => {
              const i = rowStart[r] + j;
              const span = row.length >= 3 ? "md:col-span-4" : "md:col-span-6";
              return (
                <li key={item.src} className={cn("group relative col-span-12", span)}>
                  <Figure
                    src={item.src}
                    alt={item.alt}
                    number={i + 1}
                    caption={item.caption}
                    aspect={item.aspect}
                    position={item.position}
                    sizes={row.length >= 3 ? "(min-width: 768px) 33vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                    locale={locale}
                    className="[&_figcaption_span]:transition-colors group-hover:[&_figcaption_span:first-child]:text-burgundy"
                  />
                  <a
                    ref={(el) => {
                      linkRefs.current[i] = el;
                    }}
                    href={item.src}
                    onClick={(e) => open(i, e)}
                    aria-label={s.open.replace("{label}", plateName(i))}
                    aria-haspopup="dialog"
                    className="absolute inset-0 outline-offset-4"
                  />
                </li>
              );
            })}
          </ul>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={s.dialogLabel}
        data-tone="ink"
        onKeyDown={onKeyDown}
        onClick={onDialogClick}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-ink p-0 text-paper backdrop:bg-ink"
      >
        {current && index !== null ? (
          <div className="flex h-full flex-col px-gutter pt-4 pb-5 md:pb-6">
            <div className="flex items-center justify-between gap-4">
              <span className="spec text-steel-light" aria-live="polite">
                {s.counter.replace("{i}", String(index + 1)).replace("{n}", String(items.length))}
              </span>
              <button
                type="button"
                ref={closeRef}
                onClick={close}
                className="inline-flex cursor-pointer items-center gap-2 py-2 text-ui text-paper transition-colors hover:text-ink-subtle"
              >
                {s.close}
                <X aria-hidden className="size-4" strokeWidth={1.5} />
              </button>
            </div>

            <div data-backdrop className="relative my-4 min-h-0 flex-1">
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <div className="flex items-end justify-between gap-6">
              <p className="m-0 flex max-w-[60ch] gap-3 text-small text-ink-subtle">
                <span className="whitespace-nowrap font-display text-paper italic">
                  {label} {index + 1}
                </span>
                <span>{current.caption}</span>
              </p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={s.prev}
                  className="inline-flex size-11 cursor-pointer items-center justify-center border border-ink-subtle text-paper transition-colors hover:bg-paper hover:text-ink"
                >
                  <ArrowLeft aria-hidden className="size-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={s.next}
                  className="inline-flex size-11 cursor-pointer items-center justify-center border border-ink-subtle text-paper transition-colors hover:bg-paper hover:text-ink"
                >
                  <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

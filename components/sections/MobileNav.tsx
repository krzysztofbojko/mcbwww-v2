"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/i18n";
import { Button, Container, cn } from "@/components/ui";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { isCurrent, type NavItem } from "./nav";

export interface MobileNavProps {
  locale: Locale;
  items: NavItem[];
  homeHref: string;
  cta: { href: string; label: string };
  labels: { menu: string; close: string; title: string; nav: string; home: string; language: string };
  languageNames: Record<Locale, string>;
  contact: { phone: string; email: string };
  className?: string;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen menu below the lg breakpoint, built on a modal <dialog>:
 * the rest of the page is inert, Esc closes it (native cancel), Tab / Shift+Tab wrap inside it,
 * and focus returns to the „Menu” button on close.
 */
export function MobileNav({ locale, items, homeHref, cta, labels, languageNames, contact, className }: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "";

  const close = useCallback(() => dialogRef.current?.close(), []);

  function show() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setOpen(true);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setOpen(false);
      openerRef.current?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // Any link inside the menu (nav, CTA, contact, language) closes it; navigation then proceeds.
  function closeOnLink(e: MouseEvent<HTMLDialogElement>) {
    if ((e.target as HTMLElement).closest("a")) close();
  }

  // Lock page scroll while the menu covers it.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  // Leaving the breakpoint with the menu open: close it so the desktop header is usable.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = () => mq.matches && close();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [close]);

  function trapFocus(e: KeyboardEvent<HTMLDialogElement>) {
    if (e.key !== "Tab") return;
    const nodes = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !e.currentTarget.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div className={className}>
      <button
        ref={openerRef}
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-2 py-2 text-ui text-ink"
      >
        {labels.menu}
        <Menu aria-hidden className="size-4" strokeWidth={1.5} />
      </button>

      <dialog
        ref={dialogRef}
        aria-label={labels.title}
        onKeyDown={trapFocus}
        onClick={closeOnLink}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto border-0 bg-paper p-0 text-ink backdrop:bg-ink/40"
      >
        <Container className="flex min-h-full flex-col">
          <div className="flex items-center justify-between py-4">
            <Link
              href={homeHref}
              aria-label={labels.home}
              className="font-display text-statement font-bold text-burgundy no-underline"
            >
              MCB
            </Link>
            <button
              type="button"
              onClick={close}
              className="inline-flex cursor-pointer items-center gap-2 py-2 text-ui text-ink"
            >
              {labels.close}
              <X aria-hidden className="size-4" strokeWidth={1.5} />
            </button>
          </div>

          <nav aria-label={labels.nav} className="mt-6">
            <ul className="m-0 list-none border-t border-ink p-0">
              {items.map((item) => {
                const current = isCurrent(pathname, item.href);
                return (
                  <li key={item.href} className="border-b border-rule">
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "block py-3 font-display text-display-m font-medium no-underline transition-colors hover:text-burgundy",
                        current && "text-burgundy",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-8 flex flex-col gap-6 pb-10">
            <Button variant="primary" href={cta.href} arrow block>
              {cta.label}
            </Button>
            <div className="flex items-baseline justify-between gap-4 text-small text-ink-muted">
              <p className="m-0">
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-ink">
                  {contact.phone}
                </a>
                <br />
                <a href={`mailto:${contact.email}`} className="text-ink">
                  {contact.email}
                </a>
              </p>
              <LocaleSwitcher locale={locale} label={labels.language} names={languageNames} />
            </div>
          </div>
        </Container>
      </dialog>
    </div>
  );
}

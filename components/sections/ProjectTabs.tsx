"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/components/ui/cn";

export interface ProjectTab {
  /** Also the panel's element id and URL hash, e.g. „zrealizowane”. */
  id: string;
  label: string;
  count: number;
  content: ReactNode;
}

/**
 * Status tabs over server-rendered panels.
 * Without JavaScript (and before hydration) the tab row is a list of in-page links and every panel is shown,
 * each under its own heading. Once mounted it becomes an ARIA tablist (←/→/Home/End, roving tabindex),
 * only the selected panel is shown, and the selection is kept in the URL hash.
 */
export function ProjectTabs({ tabs, label }: { tabs: ProjectTab[]; label: string }) {
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const fromHash = window.location.hash.slice(1);
    // One-time switch from the no-JS markup to tabs; the hash can only be read after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnhanced(true);
    if (tabs.some((t) => t.id === fromHash)) setActive(fromHash);
  }, [tabs]);

  function select(id: string, focus = false) {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
    if (focus) tabRefs.current[id]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = tabs.findIndex((t) => t.id === active);
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : -1;
    if (next < 0) return;
    e.preventDefault();
    select(tabs[next].id, true);
  }

  const tabClass = (selected: boolean) =>
    cn(
      "-mb-px inline-flex cursor-pointer items-baseline gap-2.5 border-b-2 pt-1 pb-3 font-display text-statement font-medium no-underline transition-colors",
      selected ? "border-burgundy text-burgundy" : "border-transparent text-ink hover:text-burgundy",
    );

  const counter = (n: number) => <span className="spec text-steel">{n}</span>;

  return (
    <div data-tabs={enhanced ? "on" : "off"}>
      {enhanced ? (
        <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex gap-8 border-b border-ink">
          {tabs.map((t) => {
            const selected = t.id === active;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[t.id] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={selected}
                aria-controls={t.id}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(t.id)}
                className={tabClass(selected)}
              >
                {t.label}
                {counter(t.count)}
              </button>
            );
          })}
        </div>
      ) : (
        <nav aria-label={label}>
          <ul className="m-0 flex list-none gap-8 border-b border-ink p-0">
            {tabs.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className={tabClass(false)}>
                  {t.label}
                  {counter(t.count)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {tabs.map((t) => (
        <section
          key={t.id}
          id={t.id}
          role={enhanced ? "tabpanel" : undefined}
          aria-labelledby={enhanced ? `tab-${t.id}` : `${t.id}-title`}
          hidden={enhanced && t.id !== active}
          className="scroll-mt-24 not-first-of-type:mt-16 in-data-[tabs=on]:mt-0"
        >
          <h2 id={`${t.id}-title`} className="mt-10 mb-0 text-display-m in-data-[tabs=on]:sr-only">
            {t.label}
          </h2>
          {t.content}
        </section>
      ))}
    </div>
  );
}

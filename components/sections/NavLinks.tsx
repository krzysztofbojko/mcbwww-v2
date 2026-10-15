"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui/cn";
import { isCurrent, type NavItem } from "./nav";

/** Desktop navigation row. The current section is underlined in burgundy (mockup `.nav a.link[aria-current]`). */
export function NavLinks({ items, label, className }: { items: NavItem[]; label: string; className?: string }) {
  const pathname = usePathname() ?? "";
  return (
    <nav aria-label={label} className={className}>
      <ul className="m-0 flex list-none items-center gap-6 p-0 xl:gap-8">
        {items.map((item) => {
          const current = isCurrent(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "text-ui transition-colors hover:text-burgundy",
                  current
                    ? "underline decoration-burgundy decoration-2 underline-offset-[0.45em]"
                    : "no-underline",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

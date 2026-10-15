import { Button, Container, Spec } from "@/components/ui";

/** Sticky ink bar „Usługa · Aparatura · Ekspert” with the enquiry action (mockup 03). Sticky, not animated. */
export function ServicePath({
  label,
  links,
  equipmentCount,
  cta,
}: {
  label: string;
  links: { service: string; equipment: string; expert: string };
  equipmentCount: number;
  cta: { href: string; label: string };
}) {
  const linkCls = "shrink-0 text-ink-subtle no-underline transition-colors hover:text-paper";
  return (
    <nav aria-label={label} data-tone="ink" data-sticky-path className="sticky top-0 z-10 bg-ink text-paper">
      <Container className="flex min-h-[52px] items-center gap-4 overflow-x-auto text-ui whitespace-nowrap md:min-h-[60px] md:gap-6">
        <a href="#usluga" className={linkCls}>
          {links.service}
        </a>
        <a href="#aparatura" className={linkCls}>
          {links.equipment}
          <Spec className="ml-1.5 text-steel-light">{equipmentCount}</Spec>
        </a>
        <a href="#ekspert" className={linkCls}>
          {links.expert}
        </a>
        <Button variant="primary" href={cta.href} className="ml-auto max-md:hidden">
          {cta.label}
        </Button>
      </Container>
    </nav>
  );
}

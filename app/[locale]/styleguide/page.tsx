import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clusters, equipmentForService, getEquipment, servicesByCluster } from "@/content";
import { isLocale, t } from "@/i18n";
import { contrast } from "@/lib/contrast";
import {
  Button,
  Container,
  Eyebrow,
  Figure,
  Heading,
  Reveal,
  Rule,
  Section,
  Spec,
  SpecList,
  Tag,
  cn,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "System projektowy",
  robots: { index: false, follow: false },
};

const palette = [
  { name: "paper", hex: "#F4F1EB", role: "Tło", on: "#1B1917" },
  { name: "paper-deep", hex: "#E9E4DA", role: "Całe pola: klastry, ekspert", on: "#1B1917" },
  { name: "ink", hex: "#1B1917", role: "Tekst, stopka, pasek ścieżki", on: "#F4F1EB" },
  { name: "ink-muted", hex: "#5A544C", role: "Tekst drugorzędny", on: "#F4F1EB" },
  { name: "rule", hex: "#CFC8BB", role: "Linie w tabelach i kartach", on: "#1B1917" },
  { name: "burgundy", hex: "#7C1E2D", role: "Jedyny akcent: akcja, numery, linki", on: "#F4F1EB" },
  { name: "burgundy-deep", hex: "#5C1420", role: "Hover, wciśnięcie", on: "#F4F1EB" },
  { name: "burgundy-tint", hex: "#E9CFD2", role: "Tekst drugorzędny na bordo", on: "#7C1E2D" },
  { name: "steel", hex: "#4F5B66", role: "Wartości techniczne, liczniki", on: "#F4F1EB" },
  { name: "steel-wash", hex: "#DFE3E6", role: "Pole karty parametrów", on: "#1B1917" },
];

const textPairs: Array<[string, string, string, string]> = [
  ["ink", "#1B1917", "paper", "#F4F1EB"],
  ["burgundy", "#7C1E2D", "paper", "#F4F1EB"],
  ["ink-muted", "#5A544C", "paper", "#F4F1EB"],
  ["steel", "#4F5B66", "steel-wash", "#DFE3E6"],
  ["paper", "#F4F1EB", "burgundy", "#7C1E2D"],
  ["burgundy-tint", "#E9CFD2", "burgundy", "#7C1E2D"],
];

function apparatus(n: number): string {
  if (n === 1) return "1 aparat";
  const d = n % 10;
  const dd = n % 100;
  return d >= 2 && d <= 4 && !(dd >= 12 && dd <= 14) ? `${n} aparaty` : `${n} aparatów`;
}

function SwatchRow() {
  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-8 p-0 md:grid-cols-5">
      {palette.map((c) => (
        <li key={c.name}>
          <div
            className={cn(
              "flex aspect-[4/3] items-end p-3 font-display text-[1.75rem] leading-none",
              (c.name === "paper" || c.name === "paper-deep") && "border border-rule",
            )}
            style={{ background: c.hex, color: c.on }}
          >
            Aa
          </div>
          <p className="mt-3 text-ui font-medium">{c.name}</p>
          <p className="spec text-steel">{c.hex}</p>
          <p className="mt-1 text-small text-ink-muted">{c.role}</p>
        </li>
      ))}
    </ul>
  );
}

export default async function Styleguide({ params }: { params: Promise<{ locale: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const cluster = clusters[0];
  const clusterServices = servicesByCluster(cluster.id);
  const furnace = getEquipment("piec-lukowy-edmund-buhler-am-500");

  return (
    <main>
      {/* Intro */}
      <Container className="grid-12 gap-y-6 pt-16 pb-16 md:pt-24 md:pb-24">
        <nav aria-label="Okruszki" className="col-span-12 flex flex-wrap gap-3 text-small text-ink-muted">
          <span>Dev</span>
          <span aria-hidden>/</span>
          <span>Styleguide</span>
        </nav>
        <Heading as="h1" size="l" className="col-span-12 md:col-span-8">
          System projektowy MCB UKSW
        </Heading>
        <p className="col-span-12 max-w-[30em] text-statement md:col-span-7">
          Tokeny, kroje i prymitywy, z których składamy wszystkie strony. Katalog laboratorium: rycina, karta
          parametrów, numer klastra.
        </p>
      </Container>

      {/* Colour */}
      <Section tone="deep" aria-labelledby="sg-colour">
        <div className="grid-12 mb-12 items-end gap-y-4">
          <Heading as="h2" size="m" id="sg-colour" className="col-span-12 md:col-span-6">
            Kolor
          </Heading>
          <p className="col-span-12 max-w-[34em] text-ink-muted md:col-span-6">
            Jedno tło, jeden atrament, jeden akcent i jeden szary do danych. Bordo nigdy nie jest ozdobą.
          </p>
        </div>
        <SwatchRow />
        <table className="mt-16 w-full border-collapse text-ui">
          <thead>
            <tr>
              <th className="border-b border-ink pr-4 pb-2 text-left text-small font-normal text-ink-muted">Tekst</th>
              <th className="border-b border-ink pr-4 pb-2 text-left text-small font-normal text-ink-muted">Tło</th>
              <th className="border-b border-ink pb-2 text-right text-small font-normal text-ink-muted">Kontrast</th>
            </tr>
          </thead>
          <tbody>
            {textPairs.map(([fg, fgHex, bg, bgHex]) => (
              <tr key={`${fg}-${bg}`}>
                <td className="border-b border-rule py-3 pr-4">{fg}</td>
                <td className="border-b border-rule py-3 pr-4">{bg}</td>
                <td className="border-b border-rule py-3 text-right">
                  <span className="spec">{contrast(fgHex, bgHex).toFixed(1).replace(".", ",")}:1</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* Type */}
      <Section aria-labelledby="sg-type">
        <div className="grid-12 gap-y-6">
          <Heading as="h2" size="m" id="sg-type" className="col-span-12 md:col-span-4">
            Typografia
          </Heading>
          <div className="col-span-12 flex flex-col gap-10 md:col-span-8">
            <div>
              <p className="mb-2 text-small text-ink-muted">display-xl · Brygada 1918 500 · tylko H1 strony głównej</p>
              <Heading as="p" size="xl">
                Nauka, którą można zamówić.
              </Heading>
            </div>
            <div>
              <p className="mb-2 text-small text-ink-muted">display-l · H1 strony</p>
              <Heading as="p" size="l">
                Wytwarzanie przyrostowe metali (druk 3D)
              </Heading>
            </div>
            <div>
              <p className="mb-2 text-small text-ink-muted">display-m · H2 sekcji</p>
              <Heading as="p" size="m">
                Kto prowadzi usługę
              </Heading>
            </div>
            <div>
              <p className="mb-2 text-small text-ink-muted">display-s · H3 w wierszach i kartach</p>
              <Heading as="p" size="s">
                Drukarka 3D do metalu Aconity mini
              </Heading>
            </div>
            <div>
              <p className="mb-2 text-small text-ink-muted">statement · Schibsted Grotesk · lead</p>
              <p className="max-w-[30em] text-statement">
                Drukujemy części z metalu metodą topienia laserowego w złożu proszku: dobieramy parametry dla nowych
                stopów, kompozytów metal-ceramika i proszków dostarczonych przez Państwa.
              </p>
            </div>
            <div>
              <p className="mb-2 text-small text-ink-muted">body · 17 px · miara 45–75 znaków</p>
              <p className="max-w-[38em]">
                Laboratoria UKSW w Dziekanowie Leśnym przyjmują zlecenia z przemysłu: od analizy pękniętej części po
                druk 3D nowego stopu. Każda usługa prowadzi do konkretnej aparatury i do osoby, która za nią
                odpowiada. Zażółć gęślą jaźń.
              </p>
            </div>
            <div>
              <p className="mb-2 text-small text-ink-muted">small · podpisy, metadane</p>
              <p className="text-small text-ink-muted">ul. Marii Konopnickiej 1, Dziekanów Leśny</p>
            </div>
            <div>
              <p className="mb-2 text-small text-ink-muted">spec · JetBrains Mono · tylko dane</p>
              <p className="flex flex-wrap gap-x-6 gap-y-2">
                <Spec className="text-ink">do 3500°C</Spec>
                <Spec className="text-ink">siła do 50 kN</Spec>
                <Spec>{apparatus(4)}</Spec>
                <Spec>{apparatus(5)}</Spec>
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section tone="deep" aria-labelledby="sg-buttons">
        <div className="grid-12 gap-y-6">
          <Heading as="h2" size="m" id="sg-buttons" className="col-span-12 md:col-span-4">
            Przyciski
          </Heading>
          <div className="col-span-12 flex flex-wrap items-center gap-x-6 gap-y-5 md:col-span-8">
            <Button href={`/${locale}/kontakt`} variant="primary">
              Zapytaj o badanie
            </Button>
            <Button href={`/${locale}/kontakt`} variant="primary" arrow>
              Zapytaj o tę usługę
            </Button>
            <Button variant="ghost">Filtry · 1</Button>
            <Button href="#sg-figure" variant="link">
              Karta aparatu
            </Button>
            <Button variant="primary" disabled>
              Wysyłanie…
            </Button>
          </div>
        </div>
      </Section>
      <Section tone="burgundy" aria-label="Przycisk na polu bordo">
        <div className="flex flex-wrap items-center gap-6">
          <Button variant="inverse" arrow type="submit">
            Wyślij zapytanie
          </Button>
          <p className="max-w-[30em] text-small text-burgundy-tint">
            inverse: jedyny przycisk na polu bordo (kontakt). Fokus na ciemnych polach zmienia kolor na papierowy.
          </p>
        </div>
      </Section>
      <Section tone="ink" space="none" aria-label="Pasek ścieżki">
        <div className="flex min-h-[60px] items-center gap-4 overflow-x-auto whitespace-nowrap text-ui md:gap-6">
          <a href="#sg-buttons" aria-current="true" className="text-paper underline decoration-burgundy-tint underline-offset-[0.45em]">
            Usługa
          </a>
          <a href="#sg-spec" className="text-ink-subtle no-underline hover:text-paper">
            Aparatura <span className="spec ml-1 text-steel-light">4</span>
          </a>
          <a href="#sg-cluster" className="text-ink-subtle no-underline hover:text-paper">
            Ekspert
          </a>
          <Button href={`/${locale}/kontakt`} variant="primary" className="ml-auto max-md:hidden">
            Zapytaj o tę usługę
          </Button>
        </div>
      </Section>

      {/* Cluster numeral + index row */}
      <Section tone="deep" aria-labelledby="sg-cluster">
        <div className="grid-12 mb-12 items-end gap-y-4">
          <Heading as="h2" size="m" id="sg-cluster" className="col-span-12 md:col-span-6">
            Numer klastra
          </Heading>
          <p className="col-span-12 text-small text-ink-muted md:col-span-6">
            <Eyebrow number={cluster.number}>{t(cluster.title, locale)}</Eyebrow>
            <span className="ml-3">— wariant w okruszkach</span>
          </p>
        </div>
        <Rule tone="ink" />
        <Reveal>
          <div className="grid-12 gap-y-4 border-b border-rule pt-6 pb-8 md:pt-8 md:pb-12">
            <Eyebrow number={cluster.number} size="index" className="col-span-3 md:col-span-2" />
            <div className="col-span-12 md:col-span-4">
              <Heading as="h3" size="s" className="mb-4">
                {t(cluster.title, locale)}
              </Heading>
              <p className="max-w-[30em] text-ink-muted">{t(cluster.description, locale)}</p>
              <Button href={`/${locale}/uslugi`} variant="link" className="mt-6 text-ui">
                Cały klaster
              </Button>
            </div>
            <ul className="col-span-12 m-0 list-none self-start border-t border-rule p-0 md:col-span-4">
              {clusterServices.map((s) => (
                <li key={s.slug}>
                  <a
                    href={`/${locale}/uslugi/${s.slug}`}
                    className="group flex items-baseline gap-4 border-b border-rule py-[9px] no-underline"
                  >
                    <span className="flex-1 transition-colors group-hover:text-burgundy group-hover:underline">
                      {t(s.title, locale)}
                    </span>
                    <Spec>{apparatus(equipmentForService(s.slug).length)}</Spec>
                  </a>
                </li>
              ))}
            </ul>
            <Figure
              src="/images/oferta/druk3d-metale.png"
              alt="Iskry podczas topienia laserowego proszku metalu"
              aspect="3 / 4"
              sizes="(min-width: 768px) 16vw, 33vw"
              className="col-span-4 col-start-9 row-start-1 md:col-span-2 md:col-start-11"
            />
          </div>
        </Reveal>
      </Section>

      {/* Figure */}
      <Section aria-labelledby="sg-figure">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 md:col-span-4">
            <Heading as="h2" size="m" id="sg-figure">
              Rycina
            </Heading>
            <p className="mt-4 max-w-[26em] text-ink-muted">
              Fotografia podpisana jak w katalogu. Kadr ustawiamy tak, by ukryć znak wodny ze zdjęć źródłowych.
            </p>
          </div>
          <Figure
            src="/gallery/HA705863-scaled.jpg"
            alt="Dłoń w rękawicy umieszcza próbkę na miedzianej płycie tyglowej pieca łukowego"
            number={1}
            aspect="3 / 2"
            position="50% 100%"
            sizes="(min-width: 768px) 60vw, 100vw"
            className="col-span-12 md:col-span-7 md:col-start-6"
            caption={
              <>
                Wsad na miedzianej płycie tyglowej pieca łukowego Edmund Bühler AM 500.{" "}
                <a href="#sg-spec" className="text-burgundy">
                  Karta aparatu
                </a>
              </>
            }
          />
        </div>
      </Section>

      {/* Datasheet */}
      <Section tone="steel" aria-labelledby="sg-spec">
        <Heading as="h2" size="m" id="sg-spec">
          Karta parametrów
        </Heading>
        <div className="grid-12 mt-12 gap-y-5 border-t border-ink pt-8">
          <div className="col-span-12 md:col-span-5">
            <Tag>Aparat wiodący</Tag>
            <Heading as="h3" size="s" className="mt-3">
              {furnace?.name ?? "Piec łukowy Edmund Bühler AM 500"}
            </Heading>
            <p className="mt-4 max-w-[24em]">
              {furnace?.flagshipHighlight ? t(furnace.flagshipHighlight, locale) : null}.
            </p>
            <Button href="#sg-spec" variant="link" className="mt-5">
              Karta aparatu
            </Button>
          </div>
          <SpecList
            tone="steel"
            topRule="none"
            className="col-span-12 md:col-span-6 md:col-start-7"
            items={[
              { label: "Temperatura", value: "do 3500°C", emphasis: true },
              { label: "Masa wsadu", value: "do 500 g" },
              { label: "Atmosfera", value: "argon (ochronna)" },
              { label: "Tygle", value: "płyty tyglowe Cu, różne wersje" },
              { label: "Producent", value: "Edmund Bühler GmbH", text: true },
            ]}
          />
        </div>
        <div className="grid-12 mt-16 gap-y-4">
          <p className="col-span-12 text-small text-ink-muted md:col-span-4">
            SpecList z danych (<code className="spec">specs: string[]</code>)
          </p>
          <SpecList tone="steel" className="col-span-12 md:col-span-6 md:col-start-7" items={furnace?.specs ?? []} />
        </div>
      </Section>

      {/* Motion */}
      <Section space="loose" aria-labelledby="sg-motion">
        <div className="grid-12 gap-y-6">
          <div className="col-span-12 md:col-span-4">
            <Heading as="h2" size="m" id="sg-motion">
              Ruch
            </Heading>
            <p className="mt-4 max-w-[26em] text-ink-muted">
              Jedno wejście: 18 px i przezroczystość, 700 ms, kolejno co 70 ms. Bez JS i przy ograniczonym ruchu treść
              stoi na miejscu.
            </p>
          </div>
          <ol className="col-span-12 m-0 list-none border-t border-ink p-0 md:col-span-8">
            {clusters.map((c, i) => (
              <li key={c.id}>
                <Reveal delay={i * 0.07}>
                  <div className="flex items-baseline gap-4 border-b border-rule py-4">
                    <Eyebrow number={c.number} />
                    <span>{t(c.title, locale)}</span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </main>
  );
}

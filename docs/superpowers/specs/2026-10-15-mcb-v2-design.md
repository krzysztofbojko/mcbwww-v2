# MCB WWW v2 — projekt i plan wdrożenia

## Kontekst
Obecna strona MCB UKSW (`/Users/krzysztofbojko/DATA/mcb-website`, Next.js 16 + Tailwind v4, Docker) działa, ale:
- wygląda generycznie (szare tło `bg-gray-50` + niebieski `#0077CC`, szablonowe karty),
- oferta jest nieczytelna dla klienta biznesowego (trudno dojść od problemu → usługa → aparatura → ekspert),
- kod jest nieuporządkowany (duplikaty komponentów w root, `lib/data.ts.before-*`, brak gita, PDF-y 36 MB w katalogu projektu, adres odbiorcy wpisany na sztywno, niezabezpieczony HTML w mailu kontaktowym),
- brak EN i słabe SEO.

Cel v2: **nowy wygląd + port treści** w nowym repo `https://github.com/krzysztofbojko/mcbwww-v2.git` (repo istnieje, jest puste).

Decyzje użytkownika:
- zakres: redesign + przeniesienie i uporządkowanie istniejącej treści (bez CMS, bez nowych modułów),
- styl: **editorial-naukowy** (ciepła biel/papier, serif display + grotesk, bordo UKSW jako akcent, duże zdjęcia laboratoriów, spokojny ruch),
- i18n: **architektura PL/EN od startu**; treść PL pełna, EN dochodzi stopniowo (na start: nawigacja, UI, strona główna, nazwy klastrów),
- deploy: **Docker** (Next standalone + docker-compose), jak w v1.

## Wybrane podejście
Nowa aplikacja Next.js (App Router, TS, Tailwind v4) budowana od zera w czystym repo. Z v1 przenosimy tylko **dane i zdjęcia**, nie komponenty.
Odrzucone: kopia v1 z nowymi stylami (przeniosłaby bałagan), Astro/statyczny eksport (formularz i API wymagałyby zmiany modelu wdrożenia).

## Architektura
```
mcbwww-v2/
  app/[locale]/            # pl (domyślny), en — layout, page, oferta, oferta/[slug],
                           # infrastruktura, infrastruktura/[slug], projekty, publikacje,
                           # galeria, kontakt
  app/api/contact/route.ts # Resend + captcha (port z v1, z escape'owaniem HTML i odbiorcą z env)
  app/sitemap.ts, robots.ts
  content/                 # typowane dane (port z v1/lib): clusters.ts, services.ts,
                           # equipment.json, experts.ts, projects.json, publications.json
  i18n/                    # config locales, słowniki pl.json/en.json, getDictionary()
  lib/                     # captcha.ts (port), gallery.ts (port), seo.ts (metadata/hreflang/JSON-LD)
  components/              # ui/ (prymitywy), sections/ (sekcje stron)
  public/images, public/gallery  # zdjęcia z v1, zoptymalizowane (next/image)
  DESIGN.md                # system projektowy (tokeny, typografia, komponenty)
  docs/superpowers/specs/  # spec projektu
  Dockerfile, docker-compose.yml, .env.example
```
- **Routing i18n**: `proxy`/middleware przekierowuje `/` → `/pl`; `generateStaticParams` dla obu locale; `hreflang` + canonical w metadata.
- **Model danych (kluczowe dla czytelnej oferty)**: jedna typowana warstwa, w której usługa ↔ aparatura ↔ ekspert są powiązane przez id. Strona usługi pokazuje: co robimy → na czym (aparatura) → z kim rozmawiać (ekspert + CTA do formularza z wybranym tematem). Katalog aparatury: filtrowanie po klastrze + wyszukiwanie (client component, dane statyczne).
- Pola tłumaczalne jako `{ pl: string; en?: string }` z fallbackiem do PL.
- **SEO**: SSG wszystkich stron, `generateMetadata`, sitemap z alternates, JSON-LD (`ResearchOrganization`, `Service`).

## Kierunek wizualny (editorial-naukowy)
- Paleta: papier `#F7F4EE`-ish, atrament prawie czarny, bordo UKSW jako jedyny mocny akcent, chłodna szarość do danych technicznych.
- Typografia: serif display (np. Fraunces / Newsreader) do nagłówków, grotesk (np. Inter Tight / Geist) do treści, mono do specyfikacji aparatury.
- Kompozycja: duże fotografie laboratoriów z v1, asymetryczne układy redakcyjne, numerowane klastry (01–04), specyfikacje jak „karta katalogowa”.
- Ruch: subtelny (reveal przy scrollu, `prefers-reduced-motion` respektowane), bez ozdobników z v1 typu ScrollProgressBar/PartnerTicker o ile nie wnoszą wartości.
- Tokeny dokładnie dobierane w fazie projektowej (impeccable), zapisane w `DESIGN.md`.

## Użycie skilli i MCP
| Etap | Narzędzie |
|---|---|
| Spec + plan | `superpowers:brainstorming` (ten etap) → spec w repo → `superpowers:writing-plans` |
| Art direction, tokeny, typografia | `impeccable` (shape/build), uzupełniająco `taste-skill` (anty-szablonowość) |
| Makiety kluczowych sekcji przed kodem | `imagegen-frontend-web` (hero, oferta, karta aparatury) — do akceptacji |
| Pojedyncze komponenty (filtr, nawigacja mobilna) | `21st-ui` — tylko gdy przyspiesza, dopasowane do tokenów |
| Weryfikacja wizualna | **Playwright MCP**: screenshoty desktop/mobile każdej strony, porównanie z makietami |
| Review | `web-interface-guidelines`, agent `impeccable-finish-reviewer`, `superpowers:requesting-code-review` |
| Dokumentacja systemu | agent `impeccable-documenter` → `DESIGN.md` |
| Wykonanie | `superpowers:subagent-driven-development` lub `executing-plans`, `verification-before-completion` |

GitHub MCP nie działa w tej sesji (błąd autoryzacji) — push przez zwykły `git` po HTTPS.

## Kroki wdrożenia
1. **Repo**: `git clone` pustego `mcbwww-v2` do `/Users/krzysztofbojko/DATA/mcbwww-v2`; scaffold Next.js 16 + TS + Tailwind v4 + ESLint; `.gitignore` (bez `.env`, bez PDF-ów), `.env.example`; zapis spec do `docs/superpowers/specs/2026-10-15-mcb-v2-design.md`; pierwszy commit.
2. **Content**: port `lib/data.ts`, `infrastructureData.json`, `projekty.json`, `publikacje.json`, galerii i zdjęć z v1 do `content/` + `public/`, z typami, slugami i powiązaniami usługa↔aparatura↔ekspert (ekspert wyciągnięty z pola `contact`). Skrypt walidujący spójność powiązań.
3. **i18n**: locale config, słowniki, routing `[locale]`, przełącznik języka, fallback PL.
4. **Design system**: makiety (imagegen) → akceptacja użytkownika → tokeny w `globals.css` (`@theme`), fonty przez `next/font`, prymitywy UI.
5. **Strony**: layout (nawigacja, stopka), strona główna, oferta + strona usługi, katalog aparatury z filtrem + karta aparatu, projekty, publikacje (filtr po roku), galeria, kontakt.
6. **Kontakt API**: port Resend + captcha; escape HTML; `CONTACT_TO` z env; walidacja; temat z query param.
7. **SEO**: metadata, hreflang, sitemap, robots, JSON-LD, OG image.
8. **Docker**: Dockerfile standalone + docker-compose (port z v1).
9. **Review i polish**: impeccable critique/polish, web-interface-guidelines, a11y (kontrast, focus, alt), performance.
10. **Push** na `main` w `mcbwww-v2` (commity per etap).

## Weryfikacja
- `npm run lint`, `npm run build` bez błędów; `tsc --noEmit`.
- Skrypt walidacji contentu: każda usługa ma ≥1 aparat i eksperta, brak osieroconych id.
- Playwright MCP: przejście po wszystkich trasach `/pl/*` i `/en/*` (200, brak błędów konsoli), screenshoty 1440px i 390px, test filtra aparatury, test formularza (tryb bez klucza Resend → oczekiwany błąd obsłużony w UI).
- `docker compose up --build` → strona działa na `localhost:3000`.
- Sprawdzenie `sitemap.xml`, `hreflang`, metadanych w źródle strony.

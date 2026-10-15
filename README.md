# MCB UKSW – strona Międzywydziałowego Centrum Badawczego (v2)

Strona centrum badawczego MCB UKSW oparta na Next.js 16 (App Router), React 19, TypeScript i Tailwind CSS v4. Dwa języki (`/pl`, `/en`), katalog aparatury, usługi badawcze, formularz kontaktowy z captchą.

## Wymagania

- Node.js 20.9 lub nowszy (obraz Docker używa Node 22 LTS)
- npm

## Uruchomienie lokalne

```bash
npm install
cp .env.example .env   # uzupełnij wartości
npm run dev
```

Aplikacja działa pod http://localhost:3000 (`/` przekierowuje na `/pl`). Build produkcyjny: `npm run build && npm start`.

## Zmienne środowiskowe

Wzór w `.env.example`; plik `.env` nie jest commitowany.

| Zmienna | Do czego służy |
| --- | --- |
| `SITE_URL` | Publiczny adres strony (np. `https://mcb.uksw.edu.pl`), używany w canonical, hreflang, sitemap, robots i Open Graph. **Na produkcji musi być ustawiona.** |
| `RESEND_API_KEY` | Klucz API Resend, przez który wysyłane są zapytania z formularza kontaktowego. |
| `CONTACT_TO` | Adresy odbiorców zapytań (jeden lub kilka, rozdzielone przecinkami). |
| `CONTACT_FROM` | Nadawca wiadomości, np. `MCB UKSW <formularz@twoja-domena.pl>`. Domena musi być zweryfikowana w Resend (rekordy SPF/DKIM). |
| `CAPTCHA_SECRET` | Sekret podpisujący tokeny captchy. Czytany przy każdym żądaniu, nie jest wbudowywany w build. Bez niego na produkcji `/api/captcha` i `/api/contact` odpowiadają 503. |

Brak `RESEND_API_KEY`, `CONTACT_TO` lub `CONTACT_FROM` powoduje odpowiedź 503 `not_configured` z `/api/contact`.

## Docker

```bash
cp .env.example .env            # uzupełnij wartości (bez .env kontener też wstanie, ale formularz zwróci 503)
docker compose up --build -d    # http://localhost:3000
docker compose down
```

Obraz (wieloetapowy, Node 22 Alpine) korzysta z `output: "standalone"`, działa jako użytkownik bez uprawnień roota, a `WORKDIR` to korzeń buildu standalone, dzięki czemu obrazek Open Graph znajduje font `assets/fonts/Brygada1918.ttf` (dołączany do trace przez `outputFileTracingIncludes` w `next.config.ts`).

## Testy

- `npm test` – testy jednostkowe (Vitest, `tests/unit`)
- `npm run e2e` – testy end-to-end (Playwright, `tests/e2e`). Przy pierwszym uruchomieniu: `npx playwright install chromium`. Konfiguracja sama buduje i startuje aplikację (`npm run build && npm start`) albo użyje serwera już działającego na porcie 3000.
- `npm run lint`, `npm run typecheck` – ESLint i TypeScript

Pełna weryfikacja: `npm run lint && npm run typecheck && npm test && npm run build && npm run e2e`.

## Migracja treści z v1

Dane aparatury, projektów i publikacji (`content/equipment.json`, `projects.json`, `publications.json`) zostały wygenerowane jednorazowo ze starej strony:

```bash
node scripts/port-v1-content.mjs /sciezka/do/mcb-website
```

Usługi, klastry, eksperci i galeria są w plikach TypeScript w `content/`.

## Struktura projektu

```
app/                 trasy (App Router); [locale]/ to wszystkie strony, api/ to captcha i contact
  global-not-found.tsx  404 dla adresów spoza [locale]
components/ui/       prymitywy interfejsu (Button, Heading, Section, ...)
components/sections/ sekcje stron (nagłówek, katalog, formularz, ...)
content/             treści: usługi, klastry, aparatura, projekty, publikacje, eksperci
i18n/                konfiguracja języków i słowniki (pl.json, en.json)
lib/                 logika: katalog, kontakt, captcha, SEO, galeria
proxy.ts             przekierowania języka (np. / do /pl)
assets/fonts/        font Brygada 1918 (licencja SIL OFL w OFL.txt) używany przez obrazek OG
tests/unit, tests/e2e
docs/design/         kierunek wizualny i makiety
```

## Dokumentacja projektowa

- `docs/design/direction.md` – kierunek wizualny, paleta, typografia, zasady
- `docs/design/mockups/` – makiety odniesienia
- `docs/superpowers/specs`, `docs/superpowers/plans` – specyfikacja i plan wdrożenia
- `/pl/styleguide` – podgląd tokenów i komponentów

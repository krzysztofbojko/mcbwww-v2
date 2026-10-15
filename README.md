# MCB UKSW – strona Międzywydziałowego Centrum Badawczego (v2)

Strona centrum badawczego MCB UKSW oparta na Next.js 16, React 19, TypeScript i Tailwind CSS v4.

## Wymagania

- Node.js 20.9 lub nowszy
- npm

## Uruchomienie

```bash
npm install
cp .env.example .env   # uzupełnij wartości
npm run dev
```

Aplikacja będzie dostępna pod adresem http://localhost:3000.

## Skrypty

- `npm run dev` – serwer deweloperski
- `npm run build` – build produkcyjny (`output: "standalone"`)
- `npm run start` – uruchomienie builda
- `npm run lint` – ESLint
- `npm run typecheck` – sprawdzenie typów (`tsc --noEmit`)
- `npm test` – testy jednostkowe (Vitest)
- `npm run e2e` – testy end-to-end (Playwright)

## Zmienne środowiskowe

Zobacz `.env.example`: `RESEND_API_KEY`, `CAPTCHA_SECRET`, `CONTACT_TO`, `CONTACT_FROM`, `SITE_URL`. Plik `.env` nie jest commitowany.

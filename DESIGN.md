---
name: MCB UKSW
description: Strona Multidyscyplinarnego Centrum Badawczego UKSW złożona jak katalog laboratorium.
colors:
  paper: "#f4f1eb"
  paper-deep: "#e9e4da"
  ink: "#1b1917"
  ink-muted: "#5a544c"
  ink-subtle: "#b9b2a7"
  rule: "#cfc8bb"
  rule-steel: "#bfc6cc"
  burgundy: "#7c1e2d"
  burgundy-deep: "#5c1420"
  burgundy-tint: "#e9cfd2"
  steel: "#4f5b66"
  steel-wash: "#dfe3e6"
  steel-light: "#9aa6b0"
typography:
  display-xl:
    fontFamily: "Brygada 1918, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.75rem, 6.4vw, 6rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  display-l:
    fontFamily: "Brygada 1918, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.25rem, 4.2vw, 4rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  display-m:
    fontFamily: "Brygada 1918, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(1.625rem, 2.6vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  display-s:
    fontFamily: "Brygada 1918, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(1.5rem, 2.2vw, 2.125rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  statement:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.1875rem, 1.6vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.42
  body:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  ui:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.45
  small:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
  spec:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0"
    fontFeature: "\"tnum\", \"zero\""
  figure-label:
    fontFamily: "Brygada 1918, Iowan Old Style, Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: "0px"
spacing:
  gutter: "clamp(16px, 2.6vw, 40px)"
  grid-gap: "16px"
  grid-gap-md: "24px"
  section: "64px"
  section-md: "96px"
  section-loose-end: "144px"
  container: "1440px"
components:
  button-primary:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.paper}"
    typography: "{typography.ui}"
    rounded: "{rounded.none}"
    padding: "15px 22px"
  button-primary-hover:
    backgroundColor: "{colors.burgundy-deep}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.none}"
    padding: "14px 21px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-inverse:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.burgundy}"
    typography: "{typography.ui}"
    rounded: "{rounded.none}"
    padding: "15px 22px"
  button-link:
    textColor: "{colors.burgundy}"
    typography: "{typography.ui}"
  button-link-hover:
    textColor: "{colors.burgundy-deep}"
  section-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "{spacing.section}"
  section-deep:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    padding: "{spacing.section}"
  section-steel:
    backgroundColor: "{colors.steel-wash}"
    textColor: "{colors.ink}"
    padding: "{spacing.section}"
  section-burgundy:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.paper}"
    padding: "{spacing.section}"
  section-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "{spacing.section}"
  spec-value:
    textColor: "{colors.ink}"
    typography: "{typography.spec}"
  spec-count:
    textColor: "{colors.steel}"
    typography: "{typography.spec}"
  flagship-label:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.paper}"
    typography: "{typography.small}"
    rounded: "{rounded.none}"
    padding: "1px 6px"
  form-field-on-burgundy:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 0 10px"
  path-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.ui}"
    height: "60px"
---

# Design System: MCB UKSW

## Overview

**Creative North Star: „Katalog laboratorium”**

Strona jest złożona jak dobrze wydany katalog instytutu naukowego. Fotografie aparatury są podpisane jak ryciny („Ryc. 1”, w wersji angielskiej „Fig. 1”), parametry stoją w kartach katalogowych z liniami włosowymi i cyframi w kroju mono, a cztery klastry oznaczone numerami 01–04 tworzą spis treści. Ton jest akademicki i drukowany, a nie „technologiczny”: ciepły papier, jeden atrament, jedno bordo UKSW.

Gęstość jest umiarkowana: duże nagłówki w kroju szeryfowym, spokojny tekst 15–17 px i dużo powietrza między sekcjami. Sekcje oddziela zmiana tonu tła, nigdy linia. Kompozycja opiera się na siatce 12 kolumn, ale każda sekcja ma własną kotwicę: nagłówek na całą szerokość w hero, wiersze spisu treści w klastrach, odwrócony układ rycina–treść na stronie usługi, układ 2/3 + 1/3 w karcie aparatu, tryb „operacyjny” w katalogu i pole w całości w bordo w kontakcie.

Każda strona prowadzi do następnego kroku: problem, usługa, aparatura, osoba i zapytanie. Ten łańcuch widać w nawigacji ścieżki na stronie usługi i w jednej bordowej akcji na ekranie.

**Key Characteristics:**
- Kwadratowe narożniki wszędzie, brak cieni w spoczynku, brak gradientów i rozmyć.
- Jeden mocny akcent (bordo) na akcji, numerach klastrów, linkach i polu kontaktu.
- Mono wyłącznie dla danych: parametrów, liczników, DOI.
- Rycina z podpisem jako podstawowy nośnik fotografii.
- Linie włosowe tylko w tabelach, indeksach i kartach parametrów.

## Colors

Paleta ról, nie ozdób: jedno tło, jeden atrament, jeden akcent i jedna szarość techniczna, każde z odcieniem pomocniczym na własnym polu.

### Primary
- **Bordo UKSW** (`burgundy`): jedyny mocny akcent. Główny przycisk, numery klastrów 01–04, linki tekstowe, zaznaczenie tekstu, pierścień fokusu na jasnych polach, pole kontaktu wypełnione w całości. Nigdy jako dekoracja ani kolor w środku nagłówka.
- **Bordo głębokie** (`burgundy-deep`): stan hover/pressed przycisku głównego i linków, tło komunikatu błędu na polu bordo.
- **Bordo przygaszone** (`burgundy-tint`): tekst drugorzędny, etykiety i placeholdery na polu bordo (placeholder z 80% krycia, nadal ≥4,5:1).

### Secondary
- **Stal** (`steel`): wartości techniczne i liczniki („5 aparatów”, numery zakresu usługi), drugorzędne linki w paskach aparatury.
- **Stal jasna** (`steel-wash`): pole karty parametrów i tabel aparatury (sekcja „Aparatura” usługi, „W tej samej usłudze”, „Aparatura wiodąca” na stronie głównej).
- **Linia stalowa** (`rule-steel`): linie włosowe na polu `steel-wash`.
- **Stal świetlista** (`steel-light`): liczniki na polu atramentu (pasek ścieżki, licznik w przeglądarce zdjęć).

### Neutral
- **Papier** (`paper`): tło całej strony i tekst na polach ciemnych. Także `theme-color` przeglądarki.
- **Papier głęboki** (`paper-deep`): całe pola tonalne (klastry, zachęta na końcu strony głównej), blok eksperta w karcie aparatu, wiersze aparatury wiodącej w katalogu, tło ryciny w trakcie ładowania.
- **Atrament** (`ink`): tekst, stopka, pasek ścieżki, przeglądarka zdjęć, mocna górna linia tabel i indeksów.
- **Atrament przygaszony** (`ink-muted`): wyłącznie tekst drugorzędny i placeholdery na jasnych polach.
- **Atrament subtelny** (`ink-subtle`): tekst drugorzędny wyłącznie na polu atramentu (stopka, pasek ścieżki). Na papierze ma 1,9:1 i nie wolno go tam używać.
- **Linia** (`rule`): linie włosowe 1 px w tabelach, indeksach i kartach parametrów.

### Named Rules
**Zasada jednego bordo.** Na ekranie jest jedna wypełniona akcja bordo (w nagłówku „Zapytaj o badanie”, w treści przycisk zapytania). Wyjątek to pole kontaktu, które jest w całości bordo, więc akcja na nim jest odwrócona (papier na bordo).

**Zasada pola, nie linii.** Sekcje rozdziela zmiana tła (`paper` → `paper-deep` → `steel-wash` → `burgundy`/`ink`). Linia pojawia się tylko wewnątrz tabeli, indeksu albo karty parametrów.

**Zasada tonu pola.** Każdy ciemny kontener ustawia `data-tone="ink"` lub `data-tone="burgundy"`. Pierścień fokusu i zaznaczenie przełączają się wtedy na papier, a tekst drugorzędny bierze odcień z tego pola (`ink-subtle`, `burgundy-tint`), nigdy szarość z jasnej palety.

## Typography

**Display Font:** Brygada 1918 (z Iowan Old Style, Georgia)
**Body Font:** Schibsted Grotesk (z Helvetica Neue, Arial)
**Label/Mono Font:** JetBrains Mono (z ui-monospace, SF Mono, Menlo), tylko dane

**Character:** Brygada 1918 to rewitalizacja polskiego kroju z 1918 roku. Daje drukowany, akademicki głos z dobrze narysowanymi polskimi znakami i mocnymi cyframi w numerach klastrów. Schibsted Grotesk jest spokojnym groteskiem prasowym do tekstu i interfejsu. JetBrains Mono z cyframi tabelarycznymi i przekreślonym zerem pojawia się tylko tam, gdzie stoi wartość pomiarowa.

Wszystkie trzy kroje ładuje `next/font/google` z podzbiorami `latin` i `latin-ext` oraz `display: swap`. Brygada ma też kursywę, używaną wyłącznie w oznaczeniu „Ryc. N”.

### Hierarchy
- **Display XL** (500, `display-xl`, 1,02): tylko H1 strony głównej („Nauka, którą można zamówić.”).
- **Display L** (500, `display-l`, 1,02): H1 podstron i H2 dużych sekcji strony głównej, nazwisko eksperta na stronie usługi.
- **Display M** (500, `display-m`, 1,1): H2 sekcji podstron („Zakres usługi”, „Aparatura”, „Kto prowadzi usługę”), lata w publikacjach, nazwa aparatu wiodącego, pozycje menu mobilnego.
- **Display S** (500, `display-s`, 1,08): nazwy klastrów w spisie treści, nazwiska w bloku eksperta i liście ekspertów, adres na polu kontaktu, komunikat pustego katalogu.
- **Statement** (400, `statement`, 1,42): lead pod nagłówkiem, cytat Rektora (w kroju display), tytuły projektów, zakładki statusu projektów.
- **Body** (400, 17 px, 1,55): tekst ciągły, pola formularza, leady podstron w `ink-muted`.
- **UI** (400–500, 15 px, 1,45): nawigacja, przyciski, komórki tabel, listy usług, etykiety filtrów.
- **Small** (400, 14 px, 1,4): podpisy rycin, metadane, etykiety pól, liczniki tekstowe.
- **Spec** (400, 14 px mono, `tnum` + `zero`): parametry aparatury, budżety, okresy, IF i punkty MNiSW, DOI, liczniki aparatów.

Nagłówki h1–h3 mają globalnie `text-wrap: balance` i tracking −0,025 em; akapity, elementy list i podpisy mają `text-wrap: pretty`. Miara tekstu jest ograniczana w `em`/`ch` (np. 30–38 em dla leadów, 62–70 ch dla opisów).

### Named Rules
**Zasada mono tylko dla danych.** JetBrains Mono stoi wyłącznie przy wartościach mierzalnych i licznikach. Nigdy na etykietach, w nawigacji ani jako „techniczny” kostium.

**Zasada kursywy dla ryciny.** Kursywa Brygady oznacza tylko „Ryc. N” / „Fig. N”. Nagłówki są zawsze proste, bez kursywy i bez koloru w środku.

**Zasada zdaniowej wielkości liter.** Polskie tytuły, nazwy usług i role ekspertów są pisane zdaniowo („Wytwarzanie przyrostowe metali (druk 3D)”, „Ekspert – druk 3D, analiza struktury”); wersaliki zostają tylko dla skrótów (HPC, CATO, UX).

## Layout

Kontener ma maksymalnie 1440 px i płynny margines `gutter` (16–40 px). Wewnątrz każda kompozycja używa siatki 12 kolumn (`grid-12`) z odstępem 16 px, a od 768 px 24 px. Na telefonie wszystko składa się do jednej kolumny, a fotografie wpuszczone w krawędź (hero, rycina usługi, rycina aparatu) wychodzą na pełną szerokość ekranu przez ujemny margines `-mx-gutter`, podczas gdy podpis zachowuje margines.

Pionowy rytm sekcji: 64 px na telefonie i 96 px od 768 px. Sekcje zamykające („loose”) mają u dołu 96 px, a od 768 px 144 px. Między nagłówkiem a treścią sekcji jest 48–64 px, w obrębie grupy 12–24 px.

Punkty przełamania: 768 px (`md`) to przejście na układ wielokolumnowy; 1024 px (`lg`) to pełna nawigacja w nagłówku (poniżej menu pełnoekranowe), karta parametrów projektów obok tekstu i szersze układy 2/3 + 1/3; 1280 px (`xl`) dokłada pełną nazwę Centrum przy znaku „MCB”.

Kotwice kompozycyjne:
1. **Hero**: H1 na 12 kolumn, pod nim lead i lista problemów (4–5 kolumn) oraz rycina na 7–8 kolumn wpuszczona w prawą krawędź ekranu.
2. **Spis klastrów**: wiersze numer (2 kol.) · nazwa i opis (4) · usługi z liczbą aparatów (4) · pionowa rycina 3:4 (2).
3. **Usługa**: rycina 420:596 na 4 kolumnach po lewej, tytuł i numerowany zakres na 7 po prawej; pod spodem przyklejony pasek ścieżki.
4. **Karta aparatu**: ryciny i opis na 7 kolumnach, karta parametrów z blokiem eksperta na 4–5.
5. **Katalog**: pole wyszukiwania na całą szerokość, filtry w 3 kolumnach, wyniki w 9; na telefonie filtry pod przyciskiem „Filtry”.
6. **Kontakt**: fotografia budynku na pełną szerokość (1440:515, na telefonie 3:2), pole bordo z danymi (5 kol.) i formularzem (6 kol.).

**Zasada przyklejonej ścieżki.** Gdy na stronie jest pasek ścieżki (`data-sticky-path`), dokument dostaje `scroll-padding-top: 4.5rem`, żeby kotwice i element z fokusem nie chowały się pod paskiem.

## Elevation & Depth

System jest płaski. Skale `shadow`, `inset-shadow`, `drop-shadow`, `text-shadow` i `blur` są w `@theme` wyzerowane, więc przypadkowe narzędzia nie generują cieni. Głębię budują wyłącznie tony pól (papier, papier głęboki, stal, bordo, atrament) i mocna linia atramentu na górze tabel. Jedyny „cień” w kodzie to wewnętrzna kreska 1 px pod polem wyszukiwania w stanie fokusu, która pogrubia jego linię do 2 px; to wskaźnik stanu, nie głębia.

**Zasada płaskości.** Żaden element nie ma cienia w spoczynku ani po najechaniu. Hover zmienia kolor (160 ms), nie skalę i nie wysokość.

## Shapes

Wszystkie narożniki są kwadratowe: fotografie, przyciski, pola formularza, chipy filtrów, przełącznik „tylko wiodąca”, ramka skrótu klawiszowego. Skala `radius` jest wyzerowana w `@theme`. Pola formularzy to sama dolna linia (pole wiadomości ma pełną ramkę 1 px). Ikony pochodzą z `lucide-react` i mają jedną grubość kreski 1,5 (2 w chipie filtra i znaczniku zgody).

## Components

### Buttons
Płaskie, kwadratowe, jedno wypełnienie; strzałka (`ArrowRight`, 16 px) tylko przy akcjach prowadzących dalej.
- **Shape:** kwadrat (0 px), tekst `ui` w wadze 500.
- **Primary:** bordo z tekstem papieru, 15 × 22 px. Jedna na ekran.
- **Hover / Focus:** hover `burgundy-deep` (160 ms, `cubic-bezier(0.16, 1, 0.3, 1)`); fokus to obrys 2 px w bordo z odsunięciem 3 px (na polach ciemnych w kolorze papieru).
- **Ghost:** ramka 1 px atramentu, hover odwraca na atrament z papierem.
- **Inverse:** papier z tekstem bordo, na polu bordo (formularz kontaktu).
- **Link:** podkreślony tekst bordo (podkreślenie 1 px, odsunięcie 0,3 em), hover pogrubia podkreślenie do 2 px.
- **Block:** wariant na całą szerokość ze strzałką przy prawej krawędzi (menu mobilne, blok eksperta).

### Rycina (Figure)
Sygnatura systemu. Fotografia przycięta do zadanych proporcji (`aspect`, `position` trzymają znak wodny źródła poza kadrem) na tle `paper-deep`, pod nią podpis `small`: kursywa „Ryc. N” w atramencie i opis w `ink-muted`. Rycina bez własnej fotografii aparatu pokazuje ilustrację usługi (`/images/oferta/*.png`) z podpisem, który mówi to wprost; ilustracja nigdy nie jest podpisywana jako fotografia z laboratorium. Tylko obraz LCP strony dostaje `preload` (hero, rycina usługi lub aparatu, budynek w kontakcie, pierwsza rycina galerii); reszta ładuje się leniwie.

### Numer klastra (Eyebrow)
Cyfry Brygady w bordo z `lnum`/`tnum`. Dwa rozmiary: wbudowany przy nazwie klastra (okruszki, filtry, karta parametrów) i indeksowy (44 px, od 768 px `clamp(3rem, 6vw, 5.5rem)`) na początku wiersza spisu klastrów. To identyfikator klastra, nie etykieta nad nagłówkiem.

### Karta parametrów (SpecList)
Lista wierszy z liniami włosowymi: etykieta w `ink-muted` w kolumnie 11 em, wartość w mono. Górna krawędź to mocna linia atramentu (karta samodzielna) albo linia włosowa. Pierwsza wartość aparatu wiodącego może być wyróżniona (22 px, bordo), raz na kartę. Wartości tekstowe (usługa, klaster) przechodzą na krój tekstowy. Pozycje z v1 bez prawdziwych parametrów są filtrowane przez `meaningfulSpecs` i pokazują notę o potwierdzeniu parametrów przez eksperta.

### Tabele i indeksy
Górna linia atramentu, wiersze rozdzielone `rule` (na stali `rule-steel`), nagłówki kolumn w `small`/`ink-muted`. Na telefonie wiersze tabeli aparatury układają się w siatkę: nazwa na całą szerokość, producent i parametry pod spodem, link „Karta” po prawej. Cała powierzchnia wiersza katalogu jest klikalna (link z `after:inset-0`), hover lekko barwi tło.

### Inputs / Fields
- **Style:** przezroczyste tło, dolna linia 1 px (`paper/60` na bordo), tekst `body`, zero zaokrągleń. Pole wyszukiwania katalogu ma duży szeryfowy krój (18–28 px) i linię atramentu na całą szerokość.
- **Focus:** obrys fokusu z tonu pola; pole wyszukiwania zmienia linię na bordo o grubości 2 px.
- **Error:** linia pola pogrubiona do 2 px, komunikat pod polem z małym kwadratowym znacznikiem, zbiorczy komunikat w ramce 1 px na `burgundy-deep` ogłaszany przez `role="status"`.
- **Select:** natywny, bez wyglądu systemowego, z narysowanym szewronem; opcje mają jawne tło papieru i atrament.
- **Checkbox / radio:** natywne z `accent-color` bordo (filtry) albo narysowany kwadrat z ikoną `Check` (zgoda na polu bordo); etykieta i kontrolka mają jeden obszar kliknięcia.

### Navigation
- **Nagłówek:** znak „MCB” (Brygada 700, bordo) z nazwą Centrum, sześć pozycji (Oferta, Infrastruktura, Projekty, Publikacje, Galeria, Kontakt), przełącznik PL / EN i jedna akcja bordo. Bieżąca sekcja jest podkreślona bordo (2 px, odsunięcie 0,45 em) i ma `aria-current="page"`.
- **Menu mobilne (poniżej 1024 px):** modalny `<dialog>` na całym ekranie na papierze, pozycje w `display-m` oddzielone liniami, akcja jako przycisk blokowy, telefon, e-mail i przełącznik języka na dole. Esc zamyka, Tab krąży w środku, fokus wraca do przycisku „Menu”.
- **Pasek ścieżki usługi:** przyklejony pasek atramentu (52/60 px) z kotwicami „Usługa · Aparatura · Ekspert” w `ink-subtle`, licznikiem aparatów w `steel-light` i akcją bordo po prawej (na telefonie ukrytą).
- **Stopka:** pole atramentu z adresem, nawigacją, kontaktem, partnerami w jednym zdaniu i przełącznikiem języka; na końcu słowo „MCB UKSW” na całą szerokość (`min(18vw, 16.5rem)`).

### Ruch (Reveal)
Jedno wejście treści: podniesienie o 18 px i przezroczystość, 700 ms, `cubic-bezier(0.16, 1, 0.3, 1)`, kolejne elementy co 60–90 ms, jednorazowo i tylko dla treści, która startuje poniżej pierwszego ekranu. Stan domyślny jest widoczny; bez JS i przy `prefers-reduced-motion: reduce` nic się nie porusza.

## Do's and Don'ts

### Do:
- **Do** podpisuj każdą fotografię w treści jako rycinę („Ryc. N” / „Fig. N”) i pisz w podpisie prawdę o tym, co widać.
- **Do** oddzielaj sekcje zmianą tła z palety, a linie włosowe (`rule`, 1 px) trzymaj w tabelach, indeksach i kartach parametrów.
- **Do** stawiaj wartości pomiarowe w mono (`spec`), a etykiety w kroju tekstowym.
- **Do** używaj `burgundy` dla jednej wypełnionej akcji na ekranie i dla numerów klastrów 01–04.
- **Do** na ciemnych polach ustaw `data-tone`, żeby fokus i zaznaczenie przełączyły się na papier.
- **Do** trzymaj kontrast tekstu i placeholderów co najmniej 4,5:1 (pary sprawdza `tests/unit/tokens.test.ts`).
- **Do** daj `preload` tylko obrazowi LCP strony, a `sizes` licz z liczby kolumn siatki.

### Don't:
- **Don't** stawiaj małej etykiety nad nagłówkiem (eyebrow/kicker). Status („Aparat wiodący tej usługi”) idzie pod nazwą.
- **Don't** zaokrąglaj narożników, nie dodawaj cieni, gradientów, rozmyć ani poświat.
- **Don't** używaj kolorowej krawędzi z jednej strony (2 px i więcej) na kartach, alertach i elementach list.
- **Don't** używaj `ink-subtle` ani `steel-light` na jasnych polach.
- **Don't** wstawiaj glifów Unicode ani emoji jako ikon (także natywnego trójkąta `<details>`); ikony pochodzą z `lucide-react`, kreska 1,5.
- **Don't** buduj sekcji z rzędów kart „ikona + nagłówek + tekst”, liczników „90+ / 3,7 PB”, karuzel logo ani pasków postępu przewijania.
- **Don't** pisz polskich tytułów Wielkimi Literami Każdego Słowa.
- **Don't** obiecuj, że formularz trafia „bezpośrednio do eksperta”: zapytania czyta biuro MCB.

# MCB UKSW v2 — kierunek wizualny

Makiety: `docs/design/mockups/` (HTML + PNG 1440 px i 390 px). Tokeny: `docs/design/mockups/tokens.css`. Z nich powstanie `@theme` w Task 4b.

## Idea

**Katalog laboratorium.** Strona działa jak dobrze złożony katalog instytutu naukowego: duże fotografie aparatury podpisane jak ryciny („Ryc. 1”), parametry podane jak w karcie katalogowej, klastry z numerami 01–04 jako spis treści. Każda strona prowadzi do następnego kroku: problem, potem usługa, aparatura i na końcu konkretny ekspert z nazwiska. Strona główna zaczyna od listy problemów („Od czego zaczynamy?”), a nie od nazw działów.

## Paleta

Kolory pełnią role: jedno tło, jeden atrament, jeden akcent i jeden szary do danych technicznych. Bordo pojawia się na akcji, numerach klastrów, linkach i w jednej sekcji wypełnionej w całości (kontakt). Nigdzie nie jest ozdobą.

| Token | Hex | Rola |
|---|---|---|
| `paper` | `#F4F1EB` | tło, ciepła biel papieru o niskim nasyceniu |
| `paper-deep` | `#E9E4DA` | całe pola (sekcja klastrów, blok eksperta, wiersze aparatury wiodącej) |
| `ink` | `#1B1917` | tekst, stopka, pasek ścieżki |
| `ink-muted` | `#5A544C` | tylko tekst drugorzędny |
| `rule` | `#CFC8BB` | linie włosowe, wyłącznie w tabelach i kartach parametrów |
| `burgundy` | `#7C1E2D` | jedyny mocny akcent (UKSW) |
| `burgundy-deep` | `#5C1420` | hover/pressed |
| `burgundy-tint` | `#E9CFD2` | tekst drugorzędny na polu bordo |
| `steel` | `#4F5B66` | wartości techniczne, liczniki |
| `steel-wash` | `#DFE3E6` | pole karty parametrów / aparatury |

Kontrast (WCAG):
- ink / paper **15,6:1**; ink / paper-deep 13,8:1; ink / steel-wash 13,6:1
- burgundy / paper **9,0:1**; burgundy / paper-deep 8,0:1
- paper / burgundy (tekst na polu bordo) 9,0:1; burgundy-tint / burgundy 6,9:1
- ink-muted / paper 6,6:1; steel / paper 6,2:1; steel / steel-wash 5,4:1

Wszystkie pary tekstowe są powyżej 4,5:1.

## Typografia

- **Display: Brygada 1918** (serif, Google Fonts, latin-ext). To rewitalizacja polskiego kroju z 1918 r. Daje akademicki, „drukowany” ton, którego nie ma w domyślnych serifach generatorów (Playfair, Fraunces itd.). Polskie znaki (ą, ę, ł, ż) są dobrze rysowane, a cyfry są naturalnie mocne w numerach 01–04. Używany w wadze 500, bez kursywy w nagłówkach. Kursywa jest zarezerwowana dla oznaczeń „Ryc.”.
- **Tekst: Schibsted Grotesk** (grotesk o rodowodzie prasowym, latin-ext). Spokojny i czytelny przy 17 px. Ma charakter, ale nie jest ani Interem, ani DM Sans.
- **Dane: JetBrains Mono**, wyłącznie dla wartości parametrów (`do 3500°C`, `siła do 50 kN`) i liczników, z cyframi tabelarycznymi. Nigdy na etykiety, nawigację ani ozdobę.
- Skala: `display-xl` clamp(44–96 px, tylko H1 strony głównej), `display-l` (36–64 px), `display-m` (26–40 px), statement (19–24 px), body 17 px, small 14 px. Na stronie widać najwyżej pięć rozmiarów.
- Nagłówki mają najwyżej dwie linie na desktopie. Wyjątek to długie nazwy z danych na telefonie (np. „Wytwarzanie Przyrostowe Metali (Druk 3D)” zajmuje 3 linie przy 390 px). Treść ma miarę 45–75 znaków.

## Kompozycja

Każda sekcja ma inną kotwicę kompozycyjną:

1. **Hero.** Nagłówek na pełną szerokość, pod nim lewa kolumna (lead + lista problemów) i fotografia wpuszczona do prawej krawędzi ekranu z podpisem ryciny. To nie jest szablon „tekst z lewej, zdjęcie z prawej”: H1 dominuje nad obiema kolumnami.
2. **Klastry.** Spis treści w wierszach na polu `paper-deep`: numer, opis, lista usług z liczbą aparatów, pionowa rycina. Bez kart.
3. **Usługa.** Rycina po lewej, treść po prawej (odwrócony układ klasyczny). Pod spodem ciemny pasek ścieżki „Usługa · Aparatura · Ekspert” (przyklejany przy przewijaniu) z akcją. Aparatura leży na polu `steel-wash` jako karta parametrów i tabela, a ekspert z nazwiska ma bezpośredni przycisk zapytania.
4. **Karta aparatu.** Dwie trzecie szerokości zajmują ryciny, jedna trzecia to karta parametrów z opiekunem. Niżej tabela pozostałej aparatury tej samej usługi z prawdziwymi parametrami.
5. **Katalog.** Tryb „operacyjny”: duże pole wyszukiwania (serif), filtry w lewej kolumnie (klaster, usługa, tylko wiodąca), tabela wyników z parametrami w mono. Aparatura wiodąca idzie na początek, wyróżniona tonem tła. Na telefonie filtry chowają się pod przyciskiem.
6. **Kontakt.** Fotografia budynku na pełną szerokość, pod nią pole w całości w bordo z formularzem, a na końcu stopka z nazwą „MCB UKSW” na całą szerokość.

Zasady: kwadratowe narożniki wszędzie (zdjęcia, przyciski, pola). Brak cieni na elementach w spoczynku i brak gradientów. Linie włosowe tylko w tabelach i listach parametrów. Sekcje rozdziela zmiana tonu tła, nie linia. Fotografie są przycinane tak, żeby nie było widać znaku wodnego „MCB UKSW” obecnego na zdjęciach źródłowych.

## Ruch

- Spokojny. Jedno wejście treści sekcji (podniesienie o 18 px + przezroczystość, 700 ms, `cubic-bezier(0.16,1,0.3,1)`), elementy w sekcji wchodzą kolejno co 60–90 ms, jednorazowo.
- Domyślny stan jest widoczny. Bez JS i przy `prefers-reduced-motion: reduce` treść jest od razu na miejscu, bez przesunięć.
- Hover to zmiana koloru (160 ms), bez skalowania. Pasek ścieżki na stronie usługi jest przyklejany (sticky), nie animowany.
- Nie będzie pasków postępu przewijania, karuzel logo, liczników „odliczających” liczby ani paralaksy.

## Czego świadomie unikamy

- Dekoracji z v1: paska postępu, tickerów z logo partnerów, animowanych liczników, rzędów kart z ikonami, sekcji „liczby” w stylu 90+ / 3,7 PB / 56. Partnerzy występują jednym zdaniem.
- Małych etykiet nad nagłówkami (eyebrow), wersalików z rozstrzeleniem, pigułek-odznak, kursywy lub koloru jako „akcentu” w nagłówku.
- Monospace jako kostiumu „technicznego”: mono służy tylko danym.
- Placeholderów zamiast parametrów: pozycje, w których `specs` zawiera słowa w rodzaju „Projektowanie”, „Wytwarzanie”, „Informatyka”, pokazujemy bez parametrów (nazwa + producent + zastosowanie).
- Szkła, rozmyć, poświat i półokrągłych „miękkich” przycisków 9–16 px.

## Decyzje do potwierdzenia przy akceptacji

- Tytuły w danych są pisane Wielkimi Literami („Inżynieria Materiałowa i Wytwarzanie”). Makiety pokazują je tak, jak są w `content/`. Polska typografia lepiej znosi zapis zdaniowy („Inżynieria materiałowa i wytwarzanie”), który można ujednolicić w treści.
- Kopie interfejsu w makietach („Nauka, którą można zamówić.”, lista problemów na stronie głównej, „Opisz problem. Resztę dobierzemy.”) to propozycje redakcyjne do zatwierdzenia.

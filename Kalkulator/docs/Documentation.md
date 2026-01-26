# Documentation – szczegółowy opis kodu narzędzi Wrath & Glory

## 1. Cel i ogólny opis
Aplikacja to **zestaw statycznych stron HTML i CSS** do planowania rozwoju postaci w systemie Wrath & Glory. Nie ma backendu ani procesu budowania – cała logika działa **po stronie przeglądarki** w skryptach osadzonych w HTML. Wszystkie strony można uruchomić lokalnie z dysku.

Najważniejsze pliki:
- `index.html` – strona startowa z nawigacją.
- `KalkulatorXP.html` – kalkulator kosztów XP.
- `TworzeniePostaci.html` – arkusz tworzenia postaci z walidacjami i przełącznikiem języka.
- `kalkulatorxp.css` – wspólne style dla kalkulatora i arkusza.
- `HowToUse/pl.pdf` i `HowToUse/en.pdf` – instrukcje PDF otwierane z poziomu arkusza.

## 2. Zależności zewnętrzne i assety
### 2.1. Fonty
- Wszystkie strony (`index.html`, `KalkulatorXP.html`, `TworzeniePostaci.html`) korzystają z lokalnego stosu fontów, bez zewnętrznych CDN:
  - `Consolas`, `Fira Code`, `Source Code Pro`, `monospace`.

### 2.2. Obraz
- `Skull.png` – logo na stronie startowej (`index.html`).

### 2.3. Instrukcje PDF
- `HowToUse/pl.pdf` oraz `HowToUse/en.pdf` – otwierane przyciskiem **Instrukcja / Manual** w `TworzeniePostaci.html`.

## 3. `index.html` – strona startowa
### 3.1. Struktura
- `<main>` z logo (`.logo`) oraz sekcją przycisków `.actions`.
- Dwa linki (`.btn`) prowadzą do:
  - `KalkulatorXP.html`
  - `TworzeniePostaci.html`
- `<title>` ustawiony na `Kozie Liczydła` (tytuł karty przeglądarki).

### 3.2. Style (inline)
`index.html` ma wbudowany CSS w `<style>`:
- Zmienne CSS w `:root`:
  - `--bg`: radial gradients + kolor bazowy `#031605`.
  - `--panel`: `#000` (tło panelu).
  - `--border`: `#16c60c` (zielona ramka).
  - `--text`: `#9cf09c` (zielony tekst).
  - `--accent`: `#16c60c`.
  - `--accent-dark`: `#0d7a07`.
  - `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
  - `--radius`: `10px`.
- Układ:
  - `body` – centrowanie zawartości i pełna wysokość ekranu.
  - `main` – panel z obramowaniem i `box-shadow` (efekt „glow”).
- Przyciski `.btn`:
  - Tło: półprzezroczysta zieleń (`rgba(22, 198, 12, ...)`).
  - Interakcje: `:hover` podbija cień, `:active` przyciemnia tło.

### 3.3. Logika
Brak JavaScript – strona jest czysto statyczna.

## 4. `kalkulatorxp.css` – wspólne style
Plik stosowany przez `KalkulatorXP.html` i częściowo przez `TworzeniePostaci.html`.

### 4.1. Paleta i zmienne CSS
W `:root` zdefiniowano:
- Tła i panele:
  - `--bg: #031605`
  - `--bg-grad`: radialne gradienty + `#031605`
  - `--panel: #000`
  - `--panel2: #000`
- Kolory tekstu:
  - `--text: #9cf09c`
  - `--text2: #4FAF4F`
  - `--muted: #4a8b4a`
  - `--code: #D2FAD2`
  - `--red: #d74b4b`
- Obramowania i podziały:
  - `--border: #16c60c`
  - `--accent: #16c60c`
  - `--accent-dark: #0d7a07`
  - `--b: rgba(22,198,12,.35)`
  - `--b2: rgba(22,198,12,.2)`
  - `--div: rgba(22,198,12,.18)`
- Tła pomocnicze:
  - `--hbg: rgba(22,198,12,.06)`
  - `--zebra: rgba(22,198,12,.04)`
  - `--hover: rgba(22,198,12,.08)`
- Efekty:
  - `--glow: 0 0 25px rgba(22, 198, 12, 0.45)`
  - `--glowH: 0 0 18px rgba(22, 198, 12, 0.35)`
- Układ:
  - `--header-row-height: 36px`

### 4.2. Najważniejsze komponenty
- **Topbar** (`.topbar`, `.brand`, `.sigil`, `.title`): pasek nagłówka z ikoną „⟦⟧”, gradientowym tłem i konsolowym fontem.
- **Buttony** (`.btn`, `.btn.primary`, `.btn.secondary`): uppercase, letter-spacing, zielone akcenty, efekty hover.
- **Panele** (`.panel`, `.panelHeader`, `.panelBody`): obramowane sekcje z nagłówkiem i zawartością.
- **Tabele** (`.dataTable`): zebra striping, hover, uppercase nagłówki, `box-shadow`.
- **Komórki kosztu XP** (`.dataTable td.cost`): wartości wyrównane do środka w pionie i poziomie.
- **Inputy** (`.input`): ciemne tło, jasny tekst, focus ring.
- **Layout** (`.main`, `.workspace`, `.tableWrap`, `.calcGrid`): dwukolumnowy układ z responsywnością w `@media (max-width: 980px)`.

### 4.3. Klasa `attribute-high`
W `TworzeniePostaci.html` skrypt dodaje klasę `attribute-high` dla wartości atrybutów > 8. Styl nie jest zdefiniowany w CSS – to rezerwa na przyszłe wyróżnienie.

## 5. `KalkulatorXP.html` – kalkulator XP
### 5.1. Struktura HTML
- **Nagłówek** `.topbar` z:
  - tytułem w `.brand` i `.title`,
  - przyciskiem **Resetuj wartości** (`#btnReset`).
- **Panel boczny** `.panel` z instrukcją i polem sumy (`#totalXp`).
- **Część robocza** `.workspace`:
  - tabela **Atrybuty** (`#attributesTable`),
  - tabela **Umiejętności** (`#skillsTable`).

### 5.2. Zakresy i walidacja
- Atrybuty: `min=0`, `max=12`.
- Umiejętności: `min=0`, `max=8`.
- Dodatkowo skrypt wymusza zakresy w funkcji `clampValue`.

### 5.3. Słowniki kosztów XP
```js
const attributeCosts = {
  0: 0, 1: 0, 2: 4, 3: 10, 4: 20, 5: 35, 6: 55, 7: 80, 8: 110, 9: 145, 10: 185, 11: 230, 12: 280
};
const skillCosts = {
  0: 0, 1: 2, 2: 6, 3: 12, 4: 20, 5: 30, 6: 42, 7: 56, 8: 72
};
```

### 5.4. Funkcje JavaScript i przepływ danych
1. **`clampValue(value, min, max)`**
   - Konwertuje wejście na liczbę (`parseInt`).
   - Zastępuje `NaN` wartością minimalną.
   - Ogranicza zakres do `[min, max]`.
2. **`calculateRowCost(current, target, costs)`**
   - Jeśli `target <= current`, koszt = 0.
   - W przeciwnym razie oblicza różnicę `costs[target] - costs[current]`.
3. **`recalcTable(tableId, costs, min, max)`**
   - Iteruje po wierszach tabeli `#attributesTable` lub `#skillsTable`.
   - Waliduje inputy, uzupełnia poprawione wartości.
   - Wylicza koszt wiersza i sumuje do `subtotal`.
4. **`recalcAll()`**
   - Sumuje koszty z obu tabel.
   - Aktualizuje `#totalXp`.

### 5.5. Zdarzenia
- `input` i `change` na wszystkich polach → `recalcAll()`.
- Kliknięcie `#btnReset` → zeruje pola i przelicza sumę.

## 6. `TworzeniePostaci.html` – arkusz tworzenia postaci
### 6.1. Struktura HTML
- **Kontener** `.wrapper` (ustawiony względem, z cieniem i obramowaniem).
- **Przełącznik języka** `.language-switcher` z:
  - `<select id="languageSelect">` (PL/EN),
  - `<button id="manualButton">` (otwiera PDF).
- Sekcje:
  - **Pula XP** (`#xpPool`, `#xpRemaining`).
  - **Atrybuty** – tabela 7 pól (`attr_S`, `attr_Wt`, `attr_Zr`, `attr_I`, `attr_SW`, `attr_Int`, `attr_Ogd`).
  - **Umiejętności** – 18 pól w 2 kolumnach (`skill_Column1Row1..9`, `skill_Column2Row1..9`).
  - **Talenty…** – 10 par pól (`talent_name_1..10`, `talent_cost_1..10`).
  - **Komunikaty**: `#errorMessage`.

### 6.2. Style inline w pliku
`TworzeniePostaci.html` rozszerza `kalkulatorxp.css`:
- `body` – padding `24px 14px`, tło `var(--bg-grad)`, `letter-spacing: .04em` (font dziedziczony z CSS).
- `.wrapper` – maksymalna szerokość `min(1100px, 96vw)`, obramowanie `1px solid var(--b)`, `box-shadow`.
- `.language-switcher` – pozycjonowanie absolutne w prawym górnym rogu.
- `.table` – obramowania, zebra, hover, `box-shadow: var(--glow)`, nagłówki z gradientem `rgba(22,198,12,...)`.
- `input`, `select`, `textarea` – spójne tło, `border: 1px solid var(--b)`, focus ring.
- `.footer` – subtelny tekst w stopce, `letter-spacing: .08em`.

### 6.3. Słowniki kosztów XP
```js
const attributeCosts = {
  1: 0, 2: 4, 3: 10, 4: 20, 5: 35, 6: 55, 7: 80, 8: 110, 9: 145, 10: 185, 11: 230, 12: 280
};
const skillCosts = {
  0: 0, 1: 2, 2: 6, 3: 12, 4: 20, 5: 30, 6: 42, 7: 56, 8: 72
};
```

### 6.4. Tłumaczenia i UI (obiekt `translations`)
- `translations.pl` i `translations.en` zawierają:
  - etykiety i nagłówki (`labels`),
  - nazwy atrybutów (`attributes`),
  - nazwy umiejętności w dwóch kolumnach (`skillsColumn1`, `skillsColumn2`),
  - komunikaty błędów (`errors`).
- Komunikat o zmianie języka (`languageChangeWarning`) jest wyświetlany w aktualnym języku przed resetem danych.

### 6.5. Funkcje JavaScript i logika działania
1. **`updateLanguage(lang)`**
   - Ustawia `currentLanguage`.
   - Podmienia teksty w UI (`pageTitle`, nagłówki tabel, przycisk manuala, stopka).
   - Aktualizuje etykiety atrybutów i umiejętności w obu kolumnach.
   - Ustawia `xpRemainingLabel` z wartością `100` w znaczniku `<strong id="xpRemaining">`.
2. **`resetAll()`**
   - Ustawia domyślne wartości: `xpPool=100`, atrybuty=1, umiejętności=0, talenty=0.
   - Czyści nazwy talentów.
   - Wywołuje `recalcXP()`.
3. **`recalcXP()`**
   - Waliduje `xpPool` (brak limitu górnego, brak wartości ujemnych).
   - Dla atrybutów:
     - zakres `1–12`,
     - sumuje koszt z `attributeCosts`,
     - dodaje klasę `attribute-high` przy wartości > 8.
   - Dla umiejętności:
     - zakres `0–8`,
     - sumuje koszt z `skillCosts`.
   - Dla talentów:
     - wartości `>= 0`, sumowane bez tabel kosztów.
   - Oblicza `xpRemaining = xpPool - (attr + skills + talents)`.
   - Gdy `xpRemaining < 0` → wyświetla błąd o przekroczeniu puli.
   - Gdy `xpRemaining >= 0` → uruchamia `checkSkillTree()`.
4. **`displayError(msg)`**
   - Aktualizuje treść `#errorMessage`.
5. **`checkSkillTree()`**
   - Liczy liczbę aktywnych umiejętności (`> 0`).
   - Weryfikuje zasadę: jeśli jakaś umiejętność ma poziom > 1, liczba aktywnych umiejętności musi być ≥ temu poziomowi.
   - Gdy zasada nie jest spełniona i XP jest w normie, wyświetla komunikat o „Drzewie Nauki”.
6. **`attachDefaultOnBlur(selector, defaultValue)`**
   - Na zdarzeniu `blur` przywraca wartość domyślną, jeśli pole jest puste lub `NaN`.
   - Używana dla `#xpPool`, atrybutów, umiejętności i kosztów talentów.
7. **`adjustTalentFontSize(el)`**
   - Dynamicznie zmniejsza rozmiar czcionki w polach `textarea.talent-name`,
     aby dłuższy tekst mieścił się w polu (`min 10px`).

### 6.6. Zdarzenia i interakcje
- Zmiana języka (`#languageSelect`):
  - wyświetla `confirm()` z ostrzeżeniem,
  - po potwierdzeniu uruchamia `updateLanguage()` i `resetAll()`;
  - po anulowaniu przywraca poprzedni wybór.
- Wszystkie pola `input`:
  - na `input` i `change` → `recalcXP()`.
- Pola talentów (`textarea.talent-name`):
  - na `input` → `adjustTalentFontSize()`.
- Przycisk `#manualButton`:
  - otwiera `HowToUse/${currentLanguage}.pdf` w nowej karcie (`window.open` z `noopener`).

### 6.7. Domyślne wartości po starcie
- `currentLanguage = 'pl'`.
- `xpPool = 100`.
- Atrybuty = 1, umiejętności = 0, talenty = 0.
- `updateLanguage()` + `recalcXP()` uruchamiane po `DOMContentLoaded`.

## 7. Jak odtworzyć aplikację 1:1 (checklista)
1. Utwórz cztery pliki: `index.html`, `KalkulatorXP.html`, `TworzeniePostaci.html`, `kalkulatorxp.css`.
2. Skopiuj wszystkie zmienne CSS i style z `kalkulatorxp.css` oraz inline z `index.html` i `TworzeniePostaci.html`.
3. Dodaj logo `Skull.png` i folder `HowToUse` z plikami `pl.pdf` i `en.pdf`.
4. Upewnij się, że w `KalkulatorXP.html` i `TworzeniePostaci.html` znajduje się link do `kalkulatorxp.css` (fonty są lokalne, bez Google Fonts).
5. Skopiuj identyczne struktury tabel, identyfikatory (`id`) i klasy CSS.
6. Upewnij się, że skrypty JS działają na tych samych `id` i klasach (`.current`, `.target`, `#totalXp`, `#xpPool`, `#xpRemaining`, itd.).
7. Zachowaj zakresy `min/max` i wartości domyślne w polach formularzy.
8. Sprawdź w przeglądarce:
   - automatyczne przeliczanie kosztów,
   - resetowanie danych,
   - poprawne błędy (pula XP / Drzewo Nauki),
   - działanie przełącznika języka i manuala.

## 8. Struktura katalogów (referencja)
```
.
├── docs/
│   ├── README.md
│   └── Documentation.md
├── HowToUse/
│   ├── pl.pdf
│   └── en.pdf
├── Old/
│   ├── HowToUse_Org.pdf
│   └── Kalkulator_Org.html
├── index.html
├── KalkulatorXP.html
├── TworzeniePostaci.html
└── kalkulatorxp.css
```

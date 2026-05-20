# Documentation – szczegółowy opis kodu narzędzi Wrath & Glory

## 1. Cel i ogólny opis
Aplikacja to **zestaw statycznych stron HTML/CSS/JS** do planowania rozwoju postaci w systemie Wrath & Glory. Logika interfejsu i obliczeń działa po stronie przeglądarki, a moduł Tworzenie Postaci korzysta dodatkowo z Firestore do zapisu/odczytu danych postaci między urządzeniami.

Najważniejsze pliki:
- `index.html` – strona startowa z nawigacją.
- `KalkulatorXP.html` – kalkulator kosztów XP.
- `TworzeniePostaci.html` – arkusz tworzenia postaci z walidacjami i przełącznikiem języka.
- `kalkulatorxp.css` – wspólne style dla kalkulatora i arkusza.
- `HowToUse/pl.pdf` i `HowToUse/en.pdf` – instrukcje PDF otwierane z poziomu arkusza.

## 1.0.1. Tabela „Maksymalne wartości atrybutów”
Tabela maksymalnych wartości atrybutów jest dostępna w arkuszu tworzenia postaci i prezentuje limity rasowe dla ośmiu atrybutów.

Wyrównanie pierwszej kolumny z nazwami ras działa w dwóch miejscach:
- `kalkulatorxp.css`: reguła `.referenceTable tbody th:first-child { text-align: left; }` ustawia lewostronne wyrównanie nazw ras w tabeli referencyjnej.
- `TworzeniePostaci.html`: reguła `.species-max-table td:first-child` utrzymuje lewostronne wyrównanie pierwszej kolumny oraz `font-weight: 600`.

Zakres działania obejmuje wyłącznie kolumnę z nazwami ras. Komórki liczbowe pozostają wyrównane centralnie zgodnie z regułami bazowymi tabel.

## 1.1. Terminologia PL: PD
Polski interfejs używa skrótu **PD** jako odpowiednika angielskiego **XP**. Dotyczy to etykiet widocznych dla użytkownika, tytułów, opisów puli punktów i komunikatów walidacyjnych.

Logika obliczeń, nazwy plików i odnośniki techniczne pozostają oparte na istniejących nazwach modułów, na przykład `KalkulatorXP.html`.

Warstwa angielska używa skrótu **XP**.

## 1.2. `TworzeniePostaci.html` — Szybkość i tabela maksimów ras
Arkusz tworzenia postaci obsługuje osiem atrybutów:
- Siła / Strength,
- Wytrzymałość / Toughness,
- Zręczność / Agility,
- Inicjatywa / Initiative,
- Siła Woli / Willpower,
- Intelekt / Intellect,
- Ogłada / Fellowship,
- Szybkość / Speed.

Atrybut `attr_Speed` jest częścią formularza, resetu danych i przeliczania kosztów. Etykiety atrybutów są obsługiwane przez tłumaczenia PL/EN.

Tabela maksymalnych wartości atrybutów jest dostępna z poziomu arkusza tworzenia postaci jako modal. Przycisk otwierający modal używa tego samego stylu wizualnego co przyciski `Instrukcja` / `Manual` i `Strona Główna` / `Main Page`.

Dane tabeli są osadzone w kodzie modułu i renderowane dynamicznie dla aktualnego języka interfejsu.

## 1.2.1. Domyślna wartość `Szybkość` = 6
Pole `#attr_Speed` ma domyślną wartość `6` przy pierwszym wejściu na stronę.

Funkcja `resetAll()` przywraca wartości formularza do stanu początkowego i ustawia `attr_Speed` na `6`.

Funkcja `recalcXP()` korzysta z bieżącej wartości wpisanej przez użytkownika, waliduje zakres `1..12`, aktualizuje koszt i stosuje odpowiednie klasy wizualne.

## 2. Zależności zewnętrzne i assety
### 2.1. Fonty
- Wszystkie strony (`index.html`, `KalkulatorXP.html`, `TworzeniePostaci.html`) korzystają z lokalnego stosu fontów, bez zewnętrznych CDN:
  - `Consolas`, `Fira Code`, `Source Code Pro`, `monospace`.

### 2.2. Obraz
- `Skull.png` – logo na stronie startowej (`index.html`).
- `Skull.png` ma natywne proporcje `1024 × 1536` i te wartości są jawnie wpisane do znacznika `<img>` (`width` i `height`), żeby przeglądarka mogła zarezerwować miejsce przed pobraniem bitmapy.
- `Koza.gif` – animacja wyświetlana jako overlay po kliknięciu tajnego przycisku na stronie startowej (`index.html`).

### 2.3. Instrukcje PDF
- `HowToUse/pl.pdf` oraz `HowToUse/en.pdf` – otwierane przyciskiem **Instrukcja / Manual** w `TworzeniePostaci.html`.

## 3. `index.html` – strona startowa
### 3.1. Struktura
- `<main>` z logo (`.logo`) oraz sekcją przycisków `.actions`.
- Dwa linki (`.btn`) prowadzą do:
  - `KalkulatorXP.html`
  - `TworzeniePostaci.html`
- Pod siatką `.actions` zawiera kontener wyrównujący do prawej (`.secretCtaWrap`) z przyciskiem:
  - `<button id="secretButton" class="btn secretCta">Tajny przycisk!</button>`
- Pod panelem `<main>` zawiera nakładkę:
  - `<div id="secretOverlay" class="secret-overlay">` z dialogiem `.secret-dialog`,
  - `<img src="Koza.gif">` oraz przyciskiem zamknięcia `#secretCloseButton`.
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
- Logo `.logo`:
  - `max-width: clamp(220px, 40vw, 320px)`,
  - `width: 100%`,
  - `height: auto` (jawne zachowanie proporcji),
  - atrybuty HTML: `width="1024"` i `height="1536"` (rezerwacja miejsca i stabilniejszy pierwszy layout).
- Przyciski `.btn`:
  - Tło: półprzezroczysta zieleń (`rgba(22, 198, 12, ...)`).
  - Interakcje: `:hover` podbija cień, `:active` przyciemnia tło.
- Kontener `.secretCtaWrap`:
  - `display: flex`, `justify-content: flex-end`, `width: 100%`, `margin-top: 4px` – ustawia „Tajny przycisk!” w prawym dolnym obszarze panelu, analogicznie do CTA push w module Main.
- Przycisk `.btn.secretCta`:
  - Styl 1:1 jak przycisk `Włącz powiadomienia` z `Main/index.html`: kompaktowy rozmiar, kształt `pill` (`border-radius: 999px`), szerokość auto, mały padding i font (`11px`).
  - Czerwona paleta CTA: `#ff3b30`, `rgba(255, 59, 48, ...)`, jasny tekst `#ffe5e3`, dedykowane stany `:hover` i `:active`.
- Nakładka GIF:
  - `.secret-overlay` to pełnoekranowa warstwa `position: fixed; inset: 0;` z tłem `rgba(0, 0, 0, 0.8)`.
  - `.secret-overlay.is-open` przełącza widoczność (`display: flex`).
  - `.secret-dialog` zachowuje estetykę modułu: zielona ramka, czarne tło i `box-shadow: var(--glow)`.
  - Obraz ograniczono do `max-height: 70vh` i `max-width: min(92vw, 640px)` dla responsywności.
  - `.secret-close` ma `margin: 10px 0 0 auto` oraz `width: auto`, dzięki czemu przycisk **Zamknij** jest przypięty do prawego dolnego rogu okna GIF-a (zamiast pełnej szerokości).

### 3.3. Logika
`index.html` zawiera teraz lekki skrypt JS sterujący overlayem:
1. **Pobranie referencji DOM**
   - `#secretButton`, `#secretOverlay`, `#secretCloseButton`.
2. **`toggleSecretOverlay(forceOpen)`**
   - Gdy `forceOpen` jest podane (`true/false`), wymusza stan.
   - W przeciwnym razie działa jako toggle.
   - Przełącza klasę `.is-open` i aktualizuje `aria-hidden`.
3. **Zdarzenia zamknięcia/otwarcia**
   - kliknięcie `#secretButton` → otwórz/zamknij overlay,
   - kliknięcie `#secretCloseButton` → zamknij,
   - kliknięcie w tło overlay (poza dialogiem) → zamknij,
   - klawisz `Escape` przy otwartym overlayu → zamknij.

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
- W `div.actions` zawiera link-przycisk `#btnMainPage` (`<a class="btn secondary" href="../Main/index.html">`). Etykieta jest tłumaczona dynamicznie: `Strona Główna` (PL) / `Main Page` (EN).
- **Nagłówek** `.topbar` z:
  - tytułem w `.brand` i `.title`,
  - przełącznikiem języka (`.language-switcher` + `#languageSelect`),
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
- W `.language-switcher` zawiera przycisk `#backToMainButton`, który prowadzi do `../Main/index.html` i jest tłumaczony w `translations.labels.backToMainButton`.
- **Kontener** `.wrapper` (ustawiony względem, z cieniem i obramowaniem).
- **Przełącznik języka** `.language-switcher` z:
  - `<select id="languageSelect">` (PL/EN),
  - `<button id="manualButton">` (otwiera PDF).
- Sekcje:
  - **Pula XP** (`#xpPool`, `#xpRemaining`).
  - **Atrybuty** – tabela 8 pól (`attr_S`, `attr_Wt`, `attr_Zr`, `attr_I`, `attr_SW`, `attr_Int`, `attr_Ogd`, `attr_Speed`).
  - **Umiejętności** – 18 pól w 2 kolumnach (`skill_Column1Row1..9`, `skill_Column2Row1..9`).
  - **Talenty…** – 20 par pól (`talent_name_1..20`, `talent_cost_1..20`), w układzie 2 kolumny po 10 pozycji.
  - **Komunikaty**: `#errorMessage`.

### 6.1a. Modal „Maksymalne wartości atrybutów”
Modal maksymalnych wartości atrybutów znajduje się w `TworzeniePostaci.html`.

Elementy modalu:
- przycisk `#showSpeciesMaxButton` w obszarze `.language-switcher`,
- overlay `#speciesMaxModal`,
- dialog `.species-max-modal__dialog`,
- nagłówek `#speciesMaxModalTitle`,
- przycisk zamknięcia `#closeSpeciesMaxButton`,
- tabela `#speciesMaxTable`.

Etykieta przycisku jest tłumaczona:
- PL: „Maksymalne wartości atrybutów”,
- EN: „Maximum attribute values”.

Renderer `renderSpeciesMaxTable()` buduje `thead` i `tbody` dynamicznie dla aktualnego języka. Dane tabeli pochodzą z tablicy `maxAttributeRows` oraz słowników `races` i `maxAttributes` w obiekcie tłumaczeń.

### 6.2. Style inline w pliku
`TworzeniePostaci.html` rozszerza `kalkulatorxp.css`:
- `body` – padding `24px 14px`, tło `var(--bg-grad)`, `letter-spacing: .04em` (font dziedziczony z CSS).
- `.wrapper` – maksymalna szerokość `min(1100px, 96vw)`, obramowanie `1px solid var(--b)`, `box-shadow`.
- `.language-switcher` – pozycjonowanie absolutne w prawym górnym rogu.
- `.table` – obramowania, zebra, hover, `box-shadow: var(--glow)`, nagłówki z gradientem `rgba(22,198,12,...)`.
- `input`, `select`, `textarea` – spójne tło, `border: 1px solid var(--b)`, focus ring.
- `.footer` – subtelny tekst w stopce, `letter-spacing: .08em`.
- `.species-max-modal*` – zestaw klas modala: przyciemnione tło, centrowany dialog, przewijanie i responsywne ograniczenie wysokości; tabela dziedziczy istniejące style `.table` (zebra/hover) i wymusza wyśrodkowanie wszystkich komórek.

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
   - Ustawia etykietę przycisku `#btnMainPage` na `Strona Główna` (PL) lub `Main Page` (EN).
   - Ustawia `currentLanguage`.
   - Podmienia teksty w UI (`pageTitle`, nagłówki tabel, przycisk manuala, stopka).
   - Aktualizuje etykiety atrybutów (1..8) i umiejętności w obu kolumnach.
  - Aktualizuje etykietę przycisku i tytuł modala maksimów ras; jeśli modal jest otwarty, renderuje tabelę ponownie dla nowego języka.
   - Ustawia `xpRemainingLabel` z wartością `155` w znaczniku `<strong id="xpRemaining">`.
2. **`resetAll()`**
   - Ustawia domyślne wartości: `xpPool=155`, atrybuty=1 dla `attr_S`, `attr_Wt`, `attr_Zr`, `attr_I`, `attr_SW`, `attr_Int`, `attr_Ogd`, a następnie nadpisuje `attr_Speed=6`; umiejętności=0, talenty=0.
   - Czyści nazwy talentów.
   - Zakres pól talentów jest kontrolowany przez stałą `TALENT_COUNT = 20`.
   - Wywołuje `recalcXP()`.
3. **`recalcXP()`**
   - Waliduje `xpPool` (brak limitu górnego, brak wartości ujemnych).
   - Dla atrybutów (8 pól, z `attr_Speed`):
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
- Modal maksimów ras:
  - `#showSpeciesMaxButton` otwiera overlay i renderuje tabelę,
  - `#closeSpeciesMaxButton`, kliknięcie tła overlay lub `Escape` zamyka modal.

### 6.7. Domyślne wartości po starcie
- `currentLanguage = 'pl'`.
- `xpPool = 155`.
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

## 9. – tajny przycisk i overlay GIF w `index.html`
Wdrożono rekomendowane rozwiązanie z analizy:
1. Przeniesiono i wystylizowano **Tajny przycisk!** jako kompaktowy czerwony CTA po prawej stronie pod siatką `.actions` (jak przycisk powiadomień w Main).
2. Zawiera modalny overlay z `Koza.gif`.
3. Zawiera pełną obsługę zamykania (przycisk, kliknięcie tła, `Escape`) i atrybut `aria-hidden`.
4. Przesunięto przycisk **Zamknij** z lewego dolnego obszaru na prawy dolny róg okna GIF-a (`.secret-close`).
5. Zachowano pozycję `Kalkulator XP` względem `Tworzenie Postaci` (przyciski pozostają obok siebie w jednej linii).

### Dlaczego to działa
- Funkcja nie zmienia głównej siatki `.actions`, więc układ podstawowej nawigacji pozostaje stabilny.
- Overlay działa niezależnie od flow dokumentu (`position: fixed`) i nie wypycha elementów panelu.
- Ograniczenia rozmiaru obrazu zapobiegają wyjściu GIF-a poza viewport na mniejszych ekranach.

5.5. **Nawigacja do modułu Main**
   - `#backToMainButton` ma nasłuchiwacz `click`, który wykonuje `window.location.href = "../Main/index.html"`.

## 10. – tabela maksymalnych wartości atrybutów w `KalkulatorXP.html`

### 10.1. Zakres funkcjonalny
Wdrożono wariant informacyjny opisany w analizie: pod istniejącymi tabelami **Atrybuty** i **Umiejętności** zawiera trzecią kartę (`.referenceCard`) zawierającą statyczną tabelę referencyjną z maksymalnymi wartościami 8 atrybutów dla 10 ras.

Najważniejsze założenia:
1. Dane maksimów atrybutów są zaszyte w kodzie JS (brak odczytu z `MaxAttributes.md` i `Labels.md` w runtime).
2. Nazwy ras i atrybutów są lokalizowane przez ten sam system tłumaczeń PL/EN co pozostałe etykiety kalkulatora.
3. Nie zawiera osobnej informacji o limicie umiejętności = 8 (zgodnie z bieżącą decyzją funkcjonalną).
4. Nie ustawiono logiki walidacji pól wejściowych ani algorytmu liczenia XP.

### 10.2. Zmiany w HTML (`KalkulatorXP.html`)
W `div.calcGrid` zawiera nową sekcję:
- `<section class="calcCard referenceCard">`
- nagłówek `#maxAttributesTitle`
- kontener `.referenceTableWrap`
- tabelę `#maxAttributesTable`, której `<thead>` i `<tbody>` są budowane dynamicznie przez JS.

Ta sekcja znajduje się po kartach **Atrybuty** i **Umiejętności**, więc wizualnie trafia dokładnie pod nie.

### 10.3. Zmiany w JS (`KalkulatorXP.html`)
Zawiera nowe struktury danych:
- `attributeMaximumRows` – 10 rekordów ras (`race_1..race_10`) i tablice 8 wartości (`Attribute_1..Attribute_8`).
- `attributeKeys` – stabilna lista kluczy `attribute_1..attribute_8` używana do budowy nagłówków kolumn.

Obejmuje `translations`:
- `labels.maxAttributesTitle`
- `races.*` (10 etykiet)
- `attributes.*` (8 etykiet)

Zawiera funkcję:
- `renderMaxAttributesTable(lang)`
  - pobiera słownik tłumaczeń dla aktywnego języka,
  - buduje dynamicznie `thead` i `tbody` tabeli referencyjnej (pierwsza komórka nagłówka jest celowo pusta, bez etykiety „Rasa/Species”),
  - wpisuje wynik do `#maxAttributesTable` przez `innerHTML`.

Ustawiono `applyLanguage(lang)`:
- aktualizuje `#maxAttributesTitle`,
- wywołuje `renderMaxAttributesTable(lang)` po podmianie etykiet, dzięki czemu tabela referencyjna natychmiast przełącza nazwy PL/EN.

### 10.6. Korekta nazewnictwa
Zastosowano korektę copywritingu w sekcji referencyjnej `KalkulatorXP.html`:
1. Tytuł sekcji skrócono z:
   - `Maksymalne wartości atrybutów (informacyjne)` → `Maksymalne wartości atrybutów`,
   - `Maximum attribute values (reference)` → `Maximum attribute values`.
2. Usunięto tłumaczeniowy klucz `labels.raceHeader` i podpis pierwszej kolumny tabeli (`Rasa / Species`), pozostawiając samą listę ras jako wartości wierszy.

### 10.4. Zmiany w CSS (`kalkulatorxp.css`)
Dodane klasy:
- `.referenceCard { grid-column: 1 / -1; }`
  - wymusza pełną szerokość karty referencyjnej pod dwoma kartami wejściowymi.
- `.referenceTableWrap { padding: 10px; }`
  - separuje tabelę od krawędzi karty.
- `.referenceTable { table-layout: fixed; }`
  - stabilizuje szerokości kolumn.
- Wyrównanie centralne:
  - `.referenceTable thead th`, `.referenceTable tbody th`, `.referenceTable td { text-align: center; vertical-align: middle; }`
- `.referenceTable tbody th` używa `color: var(--code)` i `font-weight: 600` dla czytelności nazw ras.

Zebra striping działa przez istniejącą regułę globalną:
- `.dataTable tbody tr:nth-child(even) { background: var(--zebra); }`

### 10.5. Spójność i odtwarzalność 1:1
Aby odtworzyć aktualny interfejs kalkulatora 1:1:
1. Zachowaj strukturę `calcGrid` z trzema kartami (Atrybuty, Umiejętności, tabela referencyjna).
2. Skopiuj wartości `attributeMaximumRows` dokładnie w tej samej kolejności ras i atrybutów.
3. Utrzymaj klucze tłumaczeń (`race_1..race_10`, `attribute_1..attribute_8`) bez lokalizowania kluczy technicznych.
4. Wywołuj `renderMaxAttributesTable(lang)` zawsze po zmianie języka.
5. Pozostaw dotychczasowe limity inputów: atrybuty `0..12`, umiejętności `0..8`.
## 9. Uzupełnienie: komplet wartości kolorów (1:1)
Poniżej pełna paleta używana przez trzy strony modułu:
- `--bg`: `#031605`.
- `--bg-grad`: radial gradient `rgba(0,255,128,0.06)` + radial gradient `rgba(0,255,128,0.08)` + `#031605`.
- `--panel`: `#000`; `--panel2`: `#000`.
- `--text`: `#9cf09c`; `--text2`: `#4FAF4F`; `--muted`: `#4a8b4a`; `--code`: `#D2FAD2`; `--red`: `#d74b4b`.
- `--border`: `#16c60c`; `--accent`: `#16c60c`; `--accent-dark`: `#0d7a07`.
- `--b`: `rgba(22,198,12,.35)`; `--b2`: `rgba(22,198,12,.2)`; `--div`: `rgba(22,198,12,.18)`.
- `--hbg`: `rgba(22,198,12,.06)`; `--zebra`: `rgba(22,198,12,.04)`; `--hover`: `rgba(22,198,12,.08)`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`; `--glowH`: `0 0 18px rgba(22, 198, 12, 0.35)`.
- Tajny przycisk (CTA czerwone): `#ff3b30`, `rgba(255,59,48,0.2)`, `#ffe5e3`, glow `0 0 14px rgba(255,59,48,0.35)`.

## 10. Uzupełnienie: pełna lista funkcji runtime
- `index.html`: `toggleSecretOverlay(forceOpen)`.
- `KalkulatorXP.html`: `clampValue`, `calculateRowCost`, `recalcTable`, `recalcAll`, `renderMaxAttributesTable`, `applyLanguage`.
- `TworzeniePostaci.html`: `updateLanguage`, `renderSpeciesMaxTable`, `resetAll`, `recalcXP`, `displayError`, `checkSkillTree`, `attachDefaultOnBlur`, `adjustTalentFontSize`, `toggleSpeciesMaxModal`.

## 1.3. `TworzeniePostaci.html` – stabilizacja modala potwierdzenia i skalowanie `Modal_Icon.png`
- W stylach inline sekcji `confirm-modal` ustawiono kontener `.confirm-modal__media` na stałą wysokość `192px` (`height` + `min-height`), aby wymusić rezerwację miejsca na grafikę jeszcze przed pełnym wczytaniem bitmapy.
- Klasa `.confirm-modal__image` została ustawiona na `height: 192px`, `width: auto`, `max-width: 100%`, `object-fit: contain`; to zachowuje proporcje nowego pliku `Modal_Icon.png` i utrzymuje docelową wysokość zgodną z poprzednią ikoną referencyjną `Modal_Icon_old.png`.
- W znaczniku `<img id="confirmModalImage">` zawiera atrybuty `width="1980"` i `height="2048"` (natywny rozmiar nowego pliku) oraz `decoding="async"`, aby przeglądarka mogła uprzednio obliczyć proporcje i utrzymać stabilny layout modala podczas ładowania obrazu.

## 17. Firebase i nawigacja
- Funkcja zapisu/odczytu postaci w `TworzeniePostaci.html` wymaga poprawnej konfiguracji Firebase (`Kalkulator/config/firebase-config.js`) oraz aktywnej bazy Firestore.
- Minimalna procedura wdrożeniowa obejmuje: utworzenie projektu Firebase, rejestrację aplikacji web, utworzenie Firestore Database oraz skonfigurowanie reguł dostępu.
- Przyciski `Strona Główna / Main Page` (w `KalkulatorXP.html` i `TworzeniePostaci.html`) należy w docelowym wdrożeniu aplikacji zweryfikować pod kątem poprawnego `href`/adresu docelowego.
## Izolacja danych między grupami
- `TworzeniePostaci.html` zawiera komentarze `WAŻNE/IMPORTANT` przy:
  - ładowaniu `config/firebase-config.js`,
  - nawigacji `window.location.href = '../Main/index.html'`.
- Wdrożenie:
  1. osobny Firebase per grupa (Firestore dla zapisu postaci),
  2. weryfikacja ścieżki powrotu do modułu Main zgodnie z topologią serwera grupy.


## Dodawanie nowej wersji językowej (PL)

To jest mapa miejsc, które trzeba zaktualizować przy dodaniu kolejnego języka (np. FR/DE):

1. **Kod modułu**: znajdź obiekt/słownik tłumaczeń (`translations`) oraz funkcję przełączającą język (`applyLanguage` / `updateLanguage`).
2. **Selektor języka**: jeśli moduł ma menu języka, dopisz nową opcję w `<select>` i upewnij się, że po zmianie języka odświeżane są wszystkie etykiety oraz komunikaty.
3. **Treści stałe bez przełącznika**: w modułach bez menu językowego (np. Main) ręcznie zaktualizuj napisy przycisków i opisy.
4. **Instrukcje/PDF**: jeśli moduł otwiera instrukcję zależną od języka, dodaj odpowiedni plik dla nowego języka.
5. **Test użytkownika**: przejdź cały moduł po zmianie języka i sprawdź: przyciski, statusy, błędy, komunikaty potwierdzeń, puste stany, eksport/druk.

Miejsca w kodzie zostały oznaczone komentarzem: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.


## Adding a new language version (EN)

This is the update map for adding another language (for example FR/DE):

1. **Module code**: find the translation dictionary/object (`translations`) and language switch function (`applyLanguage` / `updateLanguage`).
2. **Language selector**: if the module has a language menu, add a new `<select>` option and make sure all labels/messages refresh after switching.
3. **Static texts without selector**: in modules without a language menu (for example Main), manually update button and description texts.
4. **Manuals/PDF files**: if the module opens language-specific manuals, add the matching file for the new language.
5. **User flow check**: test the whole module after switching language: buttons, statuses, errors, confirmations, empty states, export/print.

Code locations are marked with the comment: **`MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT`**.

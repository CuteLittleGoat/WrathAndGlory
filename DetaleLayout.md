# Detale layoutu i stylu — pełna dokumentacja modułów

Ten plik jest **głównym źródłem prawdy** dla całego projektu: zawiera komplet informacji o użytych fontach, kolorach, tłach, ramkach, cieniach, układach oraz wyjątkach formatowania we wszystkich modułach.

---

## Wspólny komponent — przełącznik języka

Przełącznik języka (select PL/EN) istnieje w modułach: **GeneratorNazw**, **GeneratorNPC**,
**DataVault**, **Kalkulator PD (KalkulatorXP)**, **Prosty Kreator Postaci**, **Zaawansowany Kreator
Postaci**, **Audio** oraz **DiceRoller**.

**We wszystkich tych modułach przełącznik jest ukryty w interfejsie.** Ukrywa go jedna wspólna klasa
CSS `language-switcher--hidden` z regułą `display: none !important`. Cała warstwa tłumaczeń pozostaje
aktywna, a domyślnym językiem interfejsu jest **polski**.

### Jak pokazać przełącznik

Wystarczy usunąć klasę `language-switcher--hidden` z elementu wskazanego niżej. Nic więcej nie trzeba
zmieniać — reguła CSS może zostać w pliku, bo bez tej klasy nie ma na co działać. W każdym pliku HTML
nad tym elementem stoi komentarz `MIEJSCE ZMIANY WIDOCZNOŚCI PRZEŁĄCZNIKA JĘZYKA / LANGUAGE SWITCHER
VISIBILITY CHANGE POINT`.

| Moduł | Plik | Element z klasą do usunięcia |
| --- | --- | --- |
| GeneratorNazw | `GeneratorNazw/index.html` | `<div class="language-switcher language-switcher--hidden">` |
| GeneratorNPC | `GeneratorNPC/index.html` | `<div class="language-switcher language-switcher--hidden">` |
| DataVault | `DataVault/index.html` | `<div class="language-switcher language-switcher--hidden">` |
| Kalkulator PD | `Kalkulator/KalkulatorXP.html` | `<div class="language-switcher language-switcher--hidden">` |
| Prosty Kreator Postaci | `Kalkulator/TworzeniePostaci.html` | `<select id="languageSelect" class="language-switcher--hidden">` |
| Zaawansowany Kreator Postaci | `Kalkulator/TworzeniePostaci_v2.html` | `<select id="languageSelect" class="language-switcher--hidden">` |
| Audio | `Audio/index.html` | dwa kontenery `<div class="language-switcher language-switcher--hidden">` — panel użytkownika i panel admina; trzeba usunąć klasę w obu miejscach, jeśli oba przełączniki mają być widoczne |
| DiceRoller | `DiceRoller/index.html` | `<select id="languageSelect" class="language-switcher--hidden">` |

Klasa stoi na kontenerze tam, gdzie kontener zawiera wyłącznie select, a na samym `<select>` tam,
gdzie kontener trzyma także przyciski nawigacyjne lub link do strony głównej — dzięki temu ukrycie
przełącznika nie zabiera tych przycisków i nie zostawia po sobie pustego odstępu.

### Styl selecta, gdy jest widoczny

- tło: **#0b0b0b** (ciemne, spójne z motywem konsolowym),
- obramowanie: `1px solid --b` / `--border` (zależnie od modułu),
- tekst: `--text` (zielony),
- focus: delikatny glow (`box-shadow` w zieleni).

Panel GM Infoczytnika (`Infoczytnik/GM_test.html`) ma własny wybór języka wiadomości i nie korzysta
z tej klasy — jest widoczny.

---

## Moduł — Main

### 1) Fonty i typografia
#### 1.1 Fonty lokalne (bez Google Fonts)
- Stos bazowy dla całego UI: **"Consolas", "Fira Code", "Source Code Pro", monospace** (ustawiony na `*`).

#### 1.2 Zasady użycia fontów
- Ten sam stos obowiązuje w całym module (brak innych fontów lokalnych lub zewnętrznych).
- Tekst tytułów i przycisków jest pogrubiony (`font-weight: 600`) i zachowuje terminalowy styl.
- Rozmiary:
  - przyciski: `font-size: 15px`.
  - teksty pomocnicze `.note`: `font-size: 13px`.

### 2) Kolory, tła, ramki, cienie
#### 2.1 Zmienne CSS (źródło prawdy)
- `--bg`: **radialne gradienty** + kolor bazowy `#031605`:
  - `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  - `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  - `#031605`
- `--panel`: `#000` (tło głównej karty).
- `--border`: `#16c60c` (ramki panelu i przycisków).
- `--text`: `#9cf09c` (kolor tekstu).
- `--accent`: `#16c60c`.
- `--accent-dark`: `#0d7a07`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--radius`: `10px`.

#### 2.2 Dodatkowe wartości kolorów (literalne)
- Tła przycisków: `rgba(22, 198, 12, 0.08)` (normal), `rgba(22, 198, 12, 0.14)` (hover), `rgba(22, 198, 12, 0.22)` (active).
- Cień hover na przycisku: `0 0 18px rgba(22, 198, 12, 0.3)`.
- Czerwony wariant CTA `.btn.secretCta` (przyciski `Galaktyka` i `Gilead`):
  - obramowanie: `#ff3b30`,
  - tło: `rgba(255, 59, 48, 0.2)` (normal), `rgba(255, 59, 48, 0.28)` (hover), `rgba(255, 59, 48, 0.36)` (active),
  - tekst: `#ffe5e3`,
  - poświata: `0 0 14px rgba(255, 59, 48, 0.35)` (normal), `0 0 16px rgba(255, 59, 48, 0.45)` (hover).

### 3) Layout i elementy UI
- `body`: flex, centrowanie w pionie i poziomie, padding `24px`.
- `main`: karta o szerokości `min(860px, 100%)`, tło `--panel`, ramka `2px` `--border`, cień `--glow`, zaokrąglenia `--radius`, padding `32px 32px 28px`.
- `.actions`: grid z kolumnami `repeat(auto-fit, minmax(220px, 1fr))` i odstępem `18px 20px`.
- `.btn`: blokowy przycisk z animacją `transform` i `background` przy hover/active.
- `.secretCtaWrap`: pasek pod siatką `.actions`, `width: 100%`, `display: flex`, `justify-content: space-between`, `align-items: center`, `gap: 10px`, `margin-top: 4px`; rozsuwa dwa przyciski CTA do przeciwległych dolnych rogów karty — `Galaktyka` do lewego, `Gilead` do prawego.
- `.btn.secretCta`: kompaktowy „pill” — `width: auto`, `border-radius: 999px`, `padding: 6px 10px`, `font-size: 11px`, `line-height: 1.1`, `font-weight: 700`, `letter-spacing: 0.2px`.

### 4) Zwijanie/rozwijanie > 9 linii
- Brak funkcjonalności clamp w module Main.

### 5) Wyjątki i formatowanie specjalne
- W `Main/index.html` przyciski `Galaktyka` i `Gilead` (`.btn.secretCta`) są wyjątkiem kolorystycznym: używają czerwonej palety CTA zamiast zielonej palety nawigacyjnej. Są jedynymi elementami wyrównanymi do bocznych krawędzi karty pod siatką modułów — `Galaktyka` do lewej, `Gilead` do prawej — i tworzą układ lustrzany o identycznym wyglądzie.
- W `Kalkulator/index.html` dodano wyjątek kolorystyczny:
  - przycisk `.btn.secret` celowo używa czerwonej palety, aby odróżniał się od zielonych przycisków nawigacyjnych.
  - wartości kolorów:
    - obramowanie: `#ff5a5a`,
    - tło: `rgba(255, 90, 90, 0.12)` (normal), `rgba(255, 90, 90, 0.20)` (hover), `rgba(255, 90, 90, 0.28)` (active),
    - tekst: `#ffd8d8`.
- Dla funkcji „tajnego przycisku” zastosowano overlay pełnoekranowy:
  - tło: `rgba(0, 0, 0, 0.8)`,
  - warstwa: `position: fixed; inset: 0; z-index: 1000`,
  - dialog zachowuje standard modułu Main (`--border`, `--glow`, tło `#000`).

---

## Moduł — GeneratorNazw

### 1) Fonty i typografia
#### 1.1 Fonty lokalne (bez Google Fonts)
- Stos bazowy dla całego UI: **"Consolas", "Fira Code", "Source Code Pro", monospace** (ustawiony globalnie na `*`).

#### 1.2 Zasady użycia fontów
- Ten sam stos w całym module (brak innych fontów).
- Etykiety (`label`) mają `font-size: 12px`.
- Treść wyników (`.results`) ma `font-size: 15px`, `line-height: 1.55`.

### 2) Kolory, tła, ramki, cienie
#### 2.1 Zmienne CSS (źródło prawdy)
- `--bg`: `#031605`.
- `--bg-grad`: radialne gradienty + `#031605`.
- `--panel`: `#000`.
- `--panel-soft`: `rgba(22, 198, 12, 0.06)`.
- `--text`: `#9cf09c`.
- `--muted`: `#4a8b4a`.
- `--border`: `#16c60c`.
- `--accent`: `#16c60c`.
- `--accent-dark`: `#0d7a07`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--divider`: `rgba(22, 198, 12, 0.18)`.

#### 2.2 Kolory elementów UI
- `input` i `button`: tło `--panel-soft`, obwódka `1px solid --border`.
- `select`: tło **ciemne** `--panel` (celowo, by pasowało do przełącznika językowego z modułu Kalkulator).
- `select option`: tło `--panel`, kolor `--text`.
- Focus ring: `box-shadow: 0 0 0 2px rgba(22, 198, 12, 0.2)`.

### 3) Layout i elementy UI
- `body`: tło `--bg-grad`, kolor tekstu `--text`.
- `.wrap`: `width: min(1100px, 100%)`, `padding: 28px 20px 40px`.
- `.panel`: czarne tło `--panel`, ramka `2px solid --border`, `border-radius: 12px`, `box-shadow: --glow`.
- `.grid`: 4‑kolumnowy układ (`1.2fr 1fr 1fr 140px`), przy wąskim ekranie jedna kolumna.
- `.btn`: `max-width: 220px`, tło `rgba(22, 198, 12, 0.08)`, hover/active z mocniejszym tłem i cieniem.
- `.pill`: tło `rgba(0, 0, 0, 0.35)`, obwódka `--border`, `border-radius: 999px`.

### 4) Zwijanie/rozwijanie > 9 linii
- Brak funkcjonalności clamp w module GeneratorNazw.

### 5) Wyjątki i formatowanie specjalne
- Wyniki są prezentowane jako lista wierszy z prefiksem `•`, renderowane w `.results` z `white-space: pre-wrap`.

---

## Moduł — DataVault

### 1) Fonty i typografia
#### 1.1 Fonty lokalne (bez Google Fonts)
- **Consolas**, **Fira Code**, **Source Code Pro** — stos bazowy dla całego UI.

#### 1.2 Zasady użycia fontów
- **Tekst bazowy (`body`)**: "Consolas", "Fira Code", "Source Code Pro", monospace.
- **Nagłówki i elementy akcentowane** (`.title`, `.panelHeader`, `.tab`, `.btn`, `.popoverTitle`, `.modalTitle`): ten sam stos co reszta UI.
- **Zmienne**: `--head` w `:root` przechowuje ten sam stos i jest używany w tytułach menu filtrów.
- **Wielkości tekstu**:
  - teksty w tabelach: `font-size: 13px` (`.dataTable`).
  - tagi cech: `font-size: 11px`.
  - opisy pomocnicze: `font-size: 11–12px`.
- **Układ liter**: większość elementów UI jest **uppercase** z podwyższonym `letter-spacing`.

### 2) Paleta kolorów i efekty
#### 2.1 Zmienne CSS (źródło prawdy)
- `--bg`: `#031605` (kolor bazowy tła).
- `--bg-grad`: radialne gradienty + `#031605` (tło `body`).
- `--panel`: `#000` (tła paneli).
- `--panel2`: `#000` (tła modalu i popover).
- `--text`: `#9cf09c` (kolor podstawowy tekstu).
- `--text2`: `#4FAF4F` (tekst drugorzędny: hinty, opisy).
- `--muted`: `#4a8b4a` (tekst przygaszony).
- `--code`: `#D2FAD2` (wyróżnienia i „jaśniejsze” elementy).
- `--red`: `#d74b4b` (kolor ostrzeżeń/akcentów na czerwono).
- `--border`: `#16c60c` (ramki i akcenty).
- `--accent`: `#16c60c`, `--accent-dark`: `#0d7a07`.
- `--text-old`: `#7f9b7f` — kolor archiwalny dla starych wpisów i kontrolki widoczności starych wpisów Bestiariusza.

#### 2.2 Obwódki, cienie i tła pomocnicze
- `--b`: `rgba(22,198,12,.35)` — obwódki aktywne.
- `--b2`: `rgba(22,198,12,.2)` — delikatne obwódki.
- `--div`: `rgba(22,198,12,.18)` — linie podziału.
- `--hbg`: `rgba(22,198,12,.06)` — tła nagłówków.
- `--zebra-odd`: `rgba(22,198,12,.02)` — tło nieparzystych wierszy tabel.
- `--zebra-even`: `rgba(22,198,12,.12)` — tło parzystych (jaśniejszych) wierszy tabel; odpowiada poprzedniemu kolorowi hover.
- `--hover`: `rgba(22,198,12,.16)` — hover w tabeli; taki sam jak stan zaznaczenia wiersza.
- `--row-selected`: `rgba(22,198,12,.16)` — podświetlenie całego zaznaczonego wiersza.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)` — mocniejszy glow.
- `--glowH`: `0 0 18px rgba(22, 198, 12, 0.35)` — dodatkowy glow dla tytułów.

#### 2.3 Dodatkowe wartości kolorów (literalne)
- `rgba(207,245,220,.7)` — kolor `.sortMark` (znacznik sortowania).
- `rgba(207,245,220,.92)` — kolor treści `.popoverBody`.
- `rgba(0,0,0,.55)` — tło overlay w modalach.
- `#E6B35C` — kolor `.compareDiff` (wyróżnienia w porównaniach).
- Aktywny przycisk filtra kolumny (`.filterBtn.filter-active`) używa:
  - tła `rgba(255,70,70,.20)`,
  - czerwonej zewnętrznej poświaty `0 0 10px rgba(255,85,85,.40)` + obwódki `0 0 0 1px rgba(255,85,85,.30)`,
  - dodatkowego znacznika `●` (`::after`) w kolorze `rgb(255,120,120)`.
- Zakładki powiązane z checkboxem „Czy wyświetlić zakładki dotyczące tworzenia postaci?” mają tekst w kolorze `#D2FAD2` (`--code`) z `opacity: .9`, aby były jaśniejsze niż standardowe zakładki, i są widoczne tylko po zaznaczeniu tego checkboxa. Dotyczy: `Tabela Rozmiarów`, `Gatunki`, `Archetypy`, `Premie Frakcji`, `Słowa Kluczowe Frakcji`, `Pakiety Wyniesienia`, `Specjalne Bonusy Frakcji`, `Implanty Astartes`, `Zakony Pierwszego Powołania`.
- Checkbox „Czy wyświetlić zakładki dotyczące zasad walki?” oraz zakładki `Trafienia Krytyczne`, `Groza Osnowy`, `Skrót Zasad`, `Tryby Ognia`, `Kary do ST` mają tekst w kolorze `#d74b4b` (`--red`).
- Kontrolka DataVault „Czy wyświetlić zdezaktualizowane wpisy?” dla starych wpisów Bestiariusza używa koloru archiwalnego `var(--text-old)` / `#7f9b7f`: kontener i etykieta mają pełną nieprzezroczystość (`opacity: 1`), a zaznaczony checkbox używa `accent-color: var(--text-old)`.

### 2.4 Ikona nagłówka DataVault (stabilność layoutu)
- W bloku `.brand` w `.topbar` używany jest stały kontener `.sigil` o rozmiarze `48px × 48px` z zielonym tłem i obramowaniem.
- Wewnątrz renderowany jest obraz `.sigilIcon` (`DataVault/Icon.png`) skalowany do pełnego pola (`width:100%`, `height:100%`) z `display: block`, `object-fit: contain`, bez ucinania grafiki.
- Znacznik `<img>` zawiera jawne `width` i `height`, a stały rozmiar slotu ogranicza skoki interfejsu podczas ładowania zasobu.

### 3) Zasady formatowania tekstu i wyjątki
- We wszystkich zakładkach DataVault kolumny `Podręcznik` i `Strona` mają globalnie wymuszone parametry: `Podręcznik` (min 17ch, lewo, standardowe łamanie), `Strona` (min 6ch, lewo, standardowe łamanie, brak max-width).
- Zakładka DataVault `Notatki` ma własne szerokości kolumn: `Nazwa` min 26ch, `Opis` min 56ch, `Podręcznik` min 17ch oraz `Strona` min 6ch z wyrównaniem do środka; długie wartości w tych kolumnach mogą zawijać się do kolejnych linii.
- Wartości kolumny `Strona` mają kolor `--code` (`#D2FAD2`), taki sam jak referencje `(str.)` (`.ref`).
#### 3.1 Zwykły tekst i łamanie linii
- Komórki używają `.celltext`:
  - `white-space: pre-wrap` (zachowanie nowych linii z danych).
  - `line-height: 1.45`.
  - `word-break: normal` i `overflow-wrap: normal`.

#### 3.2 Wyjątki i style inline (markery w danych)
Aplikacja obsługuje specjalne markery formatowania w danych (`app.js` → `formatInlineHTML`):
- `{{RED}}...{{/RED}}` → czerwony tekst (`.inline-red`, `color: var(--red)`).
- `{{B}}...{{/B}}` → pogrubienie (`.inline-bold`).
- `{{I}}...{{/I}}` → kursywa (`.inline-italic`).

#### 3.3 Wyjątki na czerwony kolor (reguły logiczne)
- **Słowa kluczowe** mają kolor czerwony (`.keyword-red`):
  - Dotyczy kolumny `Słowa Kluczowe` w arkuszach: `Bestiariusz`, `Archetypy`, `Psionika`, `Augumentacje`, `Ekwipunek`, `Pancerze`, `Bronie`, `Pakiety Wyniesienia`.
  - Dotyczy kolumny `Nazwa` w arkuszu `Slowa_Kluczowe`.
- **Ręczne markery** `{{RED}}` w danych wymuszają czerwony kolor niezależnie od kolumny.

#### 3.4 Wyjątki na przecinki
- Dla arkuszy z listą słów kluczowych (`KEYWORD_SHEETS_COMMA_NEUTRAL`), przecinki w kolumnie `Słowa Kluczowe` są neutralne:
  - przecinki renderowane są jako `<span class="keyword-comma">,</span>`.
  - `.keyword-comma` ma kolor bazowy `var(--text)`, podczas gdy reszta tekstu w tej komórce pozostaje czerwona.

#### 3.5 Wyjątki na `(str.)` / `(str)` / `(strona)`
- Fragmenty tekstu w nawiasach, które zawierają `str`, `str.`, lub `strona`, są automatycznie oznaczane klasą `.ref`.
- `.ref` ma jaśniejszy kolor (`var(--code)`), co wizualnie odróżnia referencje do stron.
- Reguła działa **nawet wewnątrz stylów inline** (`{{RED}}`, `{{B}}`, `{{I}}`).

#### 3.6 Formatowanie wierszy specjalnych
- Linie zaczynające się od `*[n]` (np. `*[3]`) są wyróżniane klasą `.caretref` i jaśniejszym kolorem `var(--code)`.

#### 3.6a Sygnalizacja aktywnych filtrów kolumnowych
- Aktywny filtr (tekstowy lub listowy) oznacza:
  - podświetlenie nagłówka kolumny (`thead tr:first-child th.filter-active`) z jasnoczerwoną linią dolną (`inset 0 -2px 0 rgba(255,85,85,.40)`) i czerwonym gradientem tła (`rgba(255,70,70,.18)` → `rgba(255,70,70,.07)`),
  - aktywny stan przycisku filtra (`.filterBtn.filter-active`) z kropką `●`.
- W drugim wierszu nagłówka komórka odpowiadająca kolumnie wyboru `✓` (`th.noFilterCell`) jest celowo pusta — usunięto placeholder „filtr...”, bo ta kolumna nie posiada filtra.

#### 3.7 Specjalne formatowanie kolumny `Zasięg`
- Wartości `Zasięg` są dzielone po `/` i składane na nowo.
- Separatory `/` są wyróżnione klasą `.slash` (jasny kolor `var(--code)`).

### 4) Zwijanie i rozwijanie treści (clamp > 9 linii)

Mechanizm działa na **faktycznej wysokości wyrenderowanego tekstu** (bez wstępnego skracania po liczbie `\n`).

#### 4.1 Wykrycie clampowalnych komórek
Po renderze uruchamiany jest `ResizeObserver`, który:
- mierzy realną liczbę linii: `scrollHeight / lineHeight`;
- jeśli liczba linii **> 9**, komórka dostaje klasę `.clampable`.

#### 4.2 Render i stan UI
Dla komórki `.clampable`:
- `max-height` ustawiane jest na `lineHeight * 9`,
- `overflow` ustawiane jest na `hidden`,
- dodawany jest hint `.clampHint` z tekstem:
  - „Kliknij aby rozwinąć” (domyślnie),
  - „Kliknij aby zwinąć” (po rozwinięciu).

#### 4.3 Interakcja
- Kliknięcie komórki przełącza stan w `view.expandedCells`.
- Stan jest zapamiętywany per klucz: `sheet|rowid|col`.
- Zmiana wysokości treści automatycznie przelicza clamp dzięki `ResizeObserver`.

### 5) Wymagania szerokości kolumn (min-width)

Wszystkie wymogi szerokości kolumn są ustawiane w `style.css` przy pomocy selektorów:
`table[data-sheet="..."] th[data-col="..."]` i `td[data-col="..."]`.
Poniżej pełna lista **1:1**.

#### 5.1 Archetypy
- `Nazwa`: **28ch**
- `Frakcja`: **24ch**
- `Poziom`: **6ch** (wycentrowane)
- `Podręcznik`: **14ch**
- `Strona`: **7ch** (wycentrowane)

#### 5.2 Bestiariusz
- `Umiejętności`: **28ch**
- `Atak`: **50ch**
- `Premie`: **60ch**
- `Zdolności`: **60ch**
- `Zdolności Hordy`: **60ch**
- `Opcje Hordy`: **60ch**

#### 5.3 Cechy / Stany / Slowa_Kluczowe
- `Nazwa`: **26ch**
- `Typ`: **14ch**
- `Opis`: **56ch**

#### 5.4 Augumentacje / Ekwipunek
- `Nazwa`: **28ch**
- `Typ`: **16ch**
- `Dostępność`: **14ch**
- `Koszt`: **12ch**
- `Koszt IM`: **12ch**
- `Efekt`: **48ch**
- `Opis`: **48ch**
- `Słowa Kluczowe`: **28ch**

#### 5.5 Psionika
- `Nazwa`: **26ch**
- `Typ`: **18ch**
- `ST`: **9ch** (wycentrowane)
- `Koszt PD`: **9ch** (wycentrowane)
- `Zasięg`: **14ch**
- `Aktywacja`: **20ch**
- `Czas Trwania`: **20ch**
- `Wiele Celów`: **26ch**
- `Wzmocnienie`: **26ch**
- `Słowa Kluczowe`: **26ch**
- `Efekt`: **48ch**

#### 5.6 Modlitwy
- `Nazwa`: **28ch**
- `Koszt PD`: **9ch** (wycentrowane)
- `Wymagania`: **26ch**
- `Efekt`: **54ch**

#### 5.7 Talenty
- `Nazwa`: **28ch**
- `Koszt PD`: **9ch** (wycentrowane)
- `Wymagania`: **32ch**
- `Opis`: **36ch**
- `Efekt`: **46ch**

#### 5.8 Bronie
- `Nazwa`: **30ch**
- `Typ`: **16ch**
- `Rodzaj`: **16ch**
- `DK`: **8ch**
- `PP`: **8ch**
- `Obrażenia`: **8ch**
- `Szybkostrzelność`: **8ch**
- `Podręcznik`: **8ch**
- `Strona`: **8ch** (wycentrowane)
- `Zasięg`: **18ch** (bez zawijania, `white-space: nowrap`)
- `Dostępność`: **14ch**
- `Koszt`: **12ch**
- `Koszt IM`: **12ch**
- `Słowa Kluczowe`: **28ch**
- `Cechy`: **32ch**

#### 5.9 Pancerze
- `Nazwa`: **30ch**
- `Typ`: **14ch**
- `Podręcznik`: **14ch**
- `Strona`: **8ch** (wycentrowane)
- `WP`: **8ch** (wycentrowane)
- `Dostępność`: **14ch**
- `Koszt`: **12ch**
- `Koszt IM`: **12ch**
- `Słowa Kluczowe`: **26ch**
- `Cechy`: **32ch**

#### 5.10 Hordy
- `Nazwa zasady`: **26ch**
- `Opis zasady`: **60ch**
- `Przykład`: **60ch**

#### 5.11 Kary do ST
- `Ile celów/akcji`: **20ch** (wycentrowane)
- `Kara do ST`: **20ch** (wycentrowane)

### 6) Wymagania układu (layout)
- **Siatka główna**: `main` jest gridem z kolumnami `360px` (panel filtrów) i `1fr` (workspace).
- **Responsywność**: poniżej `980px` layout przechodzi na jedną kolumnę (panel nad tabelą).
- **Sticky nagłówki**: nagłówki tabeli są sticky (`position: sticky`) z offsetem drugiego wiersza `top: var(--header-row-height)`.
- **Checkbox w panelu filtrów**: `.checkboxRow` ma uppercase i kolor bazowy `--text2`, natomiast opis `.checkboxLabel` jest jaśniejszy (`color: var(--code)`, `opacity: .9`). Wariant `.checkboxRow--combat` wymusza czerwony tekst `--red` i czerwony akcent (`accent-color: var(--red)`).

### 7) Stosowanie tych zasad w innych zakładkach
Jeżeli w przyszłości dodasz nową zakładkę lub kolumny, zasady są następujące:
1. **Najpierw zdefiniuj min-width** w `style.css` (sekcja „Column tweaks”).
2. **Dopasuj formatowanie danych** w `app.js` (np. wyjątki na czerwony kolor, przecinki, zakresy).
3. Upewnij się, że nowe kolumny respektują **reguły clampowania** (>9 linii).


## Moduł — GeneratorNPC

### 1) Fonty i typografia
#### 1.1 Fonty lokalne
- UI główne: **"Consolas", "Fira Code", "Source Code Pro", monospace**.
- Karta eksportowana/drukowana (HTML generowany w JS): **"Times New Roman", "Liberation Serif", serif**.

#### 1.2 Zasady użycia fontów
- Interfejs: uppercase + `letter-spacing` (nagłówki, przyciski, taby, labelki).
- Karta eksportowana: klasyczny układ papierowy, nagłówki uppercase i pogrubione.

### 2) Kolory, tła, ramki, cienie
#### 2.1 Zmienne CSS (UI główne)
- `--bg`: `#031605`.
- `--bg-grad`: radialne gradienty + `#031605`:
  - `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  - `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  - `#031605`
- `--panel`, `--panel2`: `#000`.
- `--text`: `#9cf09c`.
- `--text2`: `#4FAF4F`.
- `--muted`: `#4a8b4a`.
- `--code`: `#D2FAD2`.
- `--red`: `#d74b4b`.
- `--border`: `#16c60c`.
- `--accent`: `#16c60c`, `--accent-dark`: `#0d7a07`.
- `--text-old`: `#7f9b7f` — kolor archiwalny synchronizowany z DataVault dla starych wpisów Bestiariusza i kontrolki ich widoczności.
- `--b`: `rgba(22, 198, 12, 0.35)`.
- `--b2`: `rgba(22, 198, 12, 0.2)`.
- `--div`: `rgba(22, 198, 12, 0.18)`.
- `--hbg`: `rgba(22, 198, 12, 0.06)`.
- `--zebra`: `rgba(22, 198, 12, 0.04)`.
- `--hover`: `rgba(22, 198, 12, 0.08)`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--glowH`: `0 0 18px rgba(22, 198, 12, 0.35)`.
- Dodatkowe tła w panelach/sekcjach: `rgba(22, 198, 12, 0.03)`, `rgba(22, 198, 12, 0.04)`, `rgba(22, 198, 12, 0.05)`, `rgba(22, 198, 12, 0.06)`, `rgba(22, 198, 12, 0.08)`, `rgba(22, 198, 12, 0.14)`, `rgba(22, 198, 12, 0.18)`.
- Akcenty UI w module: `rgba(111, 227, 140, 0.06)` i `rgba(111, 227, 140, 0.1)` (specjalne tła w sekcjach).

#### 2.2 Kolory karty eksportowanej (print HTML)
- Tło `body`: `#fff`.
- Tekst bazowy: `#111`.
- Nagłówki i belki: `#2c2c2c` (tło), `#fff` (tekst).
- Linie/ramki: `#111`.
- Pasy wierszy: `#f1f1f1` (nagłówki), `#e9e9e9` (naprzemienne wpisy), `#d0d0d0` (separatory wpisów).
- Sekcja kwadratów „Ż”/„T”:
  - tło siatki jest przezroczyste (bez czarnego wypełnienia po prawej stronie),
  - każde pole ma obramowanie `1px solid #111`,
  - pola „T” mają wypełnienie `#e9e9e9`, pola „Ż” pozostają białe (`#fff`).

### 3) Wyjątki formatowania i specjalne reguły tekstu
- **Markery inline** w danych:
  - `{{RED}}...{{/RED}}` → `.inline-red` (czerwony tekst, UI główne: `var(--red)`, karta: `#111`).
  - `{{B}}...{{/B}}` → `.inline-bold`.
  - `{{I}}...{{/I}}` → `.inline-italic`.
- **Słowa kluczowe** (`.keyword-red`) — kolumny z `Słowa Kluczowe` są na czerwono.
- **Wyjątki na przecinki**: w arkuszach `Bestiariusz`, `Psionika`, `Augumentacje`, `Ekwipunek`, `Pancerze`, `Bronie` przecinki w kolumnie `Słowa Kluczowe` dostają klasę `.keyword-comma` z kolorem bazowym.
- **`*[n]` na początku linii** → `.caretref` (jasny kolor).
- **`Zasięg`**: separator `/` wyróżniony `.slash`.
- **Referencje do stron** (`str`, `str.`, `strona`) → `.ref` (podkreślenie i jaśniejszy kolor).

### 4) Zwijanie/rozwijanie > 9 linii
- Stała `CLAMP_LINES = 9`.
- Komórki z > 10 liniami danych stają się kandydatami do clampa.
- `ResizeObserver` mierzy `scrollHeight / lineHeight`:
  - jeśli > 9 → `.is-clampable`, `max-height = lineHeight * 9`, `overflow: hidden`.
  - hint `.clamp-hint`: „Kliknij aby rozwinąć” / „Kliknij aby zwinąć”.
- Stan ekspansji zapisany w `state.expandedCells` dla klucza `sheet|rowId|col`.

### 5) Layout i elementy UI
- Górny pasek (`.topbar`) sticky, z `flex-wrap: wrap` i odstępem `12px 18px`; kontener przycisków `.actions` również może zawijać przyciski.
- Panele boczne i workspace działają w układzie `grid` (`360px` + `minmax(0, 1fr)`). `.layout` ma `width: 100%` i `max-width: 100%`, `.workspace` ma `min-width: 0`, a `.card` ma `min-width: 0`, `max-width: 100%` i `overflow-x: auto`, dlatego szerokie tabele przewijają się lokalnie wewnątrz kart zamiast rozszerzać cały dokument.
- Panele z `box-shadow: var(--glow)` i `border: 1px solid var(--div)`.
- Tabele: zebra i hover oparte o `--zebra` i `--hover`.
- Przyciski **Edytuj/Zapisz** przy edytowalnych polach tekstowych podglądu bazowego (`Umiejętności`, `Słowa Kluczowe`) używają klasy `.editable-text-button`: tekst i obramowanie mają `var(--code)` / `#D2FAD2`, czyli ten sam kolor co numery stron w DataVault, z pełną nieprzezroczystością `opacity: 1`; reguła nie zmienia pozostałych przycisków pobocznych.
- Kontrolka „Czy wyświetlić zdezaktualizowane wpisy?” w GeneratorNPC jest celowo zsynchronizowana wizualnie z analogiczną kontrolką DataVault. Selektory `.bestiary-show-old-toggle` i `.bestiary-show-old-toggle span` ustawiają tekst na `var(--text-old)` / `#7f9b7f` oraz `opacity: 1`, a selektor `#bestiary-show-old` ustawia zaznaczony checkbox przez `accent-color: var(--text-old)` / `#7f9b7f`. Reguły są zawężone do tej jednej kontrolki i nie zmieniają checkboxów modułów aktywnych, selecta Bestiariusza ani koloru zdezaktualizowanych opcji.
- Sekcja „Źródło danych” w panelu bocznym (`.panel-data-source`) ma celowo mniejszą typografię (`.data-source-text`: `font-size: 0.82rem`, `line-height: 1.55`) i wymuszone zawijanie długiego linku (`.data-source-link`: `overflow-wrap: anywhere`, `word-break: break-word`), aby URL `data.json` nie wychodził poza ramkę.

---

## Moduł — Kalkulator

Moduł składa się ze strony startowej oraz narzędzi otwieranych z przycisków:
- `index.html` (landing),
- `KalkulatorXP.html` (kalkulator XP),
- `TworzeniePostaci.html` (prosty kreator postaci),
- `TworzeniePostaci_v2.html` (zaawansowany kreator postaci wskazywany przez landing).
Wspólny styl bazowy pochodzi z `kalkulatorxp.css`, a dodatkowe style inline są w `index.html` i `TworzeniePostaci.html`.

### 1) Fonty i typografia
#### 1.1 Fonty lokalne
- **"Consolas", "Fira Code", "Source Code Pro", monospace** — cały UI.

#### 1.2 Zasady użycia fontów
- Uppercase + `letter-spacing` w nagłówkach, panelach, tabach.
- `title` i `panelHeader` wyróżnione `text-shadow: var(--glowH)`.

### 2) Kolory, tła, ramki, cienie
#### 2.1 Zmienne CSS (kalkulatorxp.css)
- `--bg`: `#031605`.
- `--bg-grad`: radialne gradienty + `#031605`:
  - `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  - `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  - `#031605`
- `--panel`, `--panel2`: `#000`.
- `--text`: `#9cf09c`.
- `--text2`: `#4FAF4F`.
- `--muted`: `#4a8b4a`.
- `--code`: `#D2FAD2`.
- `--red`: `#d74b4b`.
- `--border`: `#16c60c`.
- `--accent`: `#16c60c`, `--accent-dark`: `#0d7a07`.
- `--b`: `rgba(22,198,12,.35)`.
- `--b2`: `rgba(22,198,12,.2)`.
- `--div`: `rgba(22,198,12,.18)`.
- `--hbg`: `rgba(22,198,12,.06)`.
- `--zebra`: `rgba(22,198,12,.04)`.
- `--hover`: `rgba(22,198,12,.08)`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--glowH`: `0 0 18px rgba(22, 198, 12, 0.35)`.

#### 2.2 Dodatkowe wartości kolorów (literalne)
- Tła kart, nagłówków i tabów: `rgba(22,198,12,.03)`, `rgba(22,198,12,.04)`, `rgba(22,198,12,.05)`, `rgba(22,198,12,.06)`, `rgba(22,198,12,.08)`, `rgba(22,198,12,.10)`, `rgba(22,198,12,.12)`.
- Cienie i obrysy focus: `rgba(22,198,12,.18)`.
- Kolor wskaźnika `.caret`: `rgba(22,198,12,.65)`.
- Hover w przyciskach landing page: `rgba(22, 198, 12, 0.14)` oraz `rgba(22, 198, 12, 0.22)`.
- Cień hover: `0 0 18px rgba(22, 198, 12, 0.3)`.

### 3) Layout i elementy UI
- `index.html`: identyczny układ bazowy jak Main (karta centralna, grid przycisków); w lewej kolumnie pierwszego wiersza jest `Kalkulator PD`, a w prawej kolumnie pionowy stos zawiera `Prosty Kreator Postaci` oraz bezpośrednio pod nim `Zaawansowany Kreator Postaci`.
- `KalkulatorXP.html`:
  - `.main`: grid `360px` + `1fr`.
  - `.panel`, `.workspace`: ramki `1px solid var(--b)` + `box-shadow` z inset.
  - `.dataTable`: `font-size: 13px`, zebra i hover z `--zebra`/`--hover`.
- `TworzeniePostaci.html`:
  - `.wrapper`: max szerokość `1100px`, panel z `border-radius: 10px`.
  - `.table`: gradient w nagłówkach i zebra w wierszach.
  - `textarea` bez możliwości zmiany rozmiaru (`resize: none`).
  - `.language-switcher`: prawy górny panel akcji ustawiony absolutnie; zawiera przyciski instrukcji, powrotu i tabeli maksimów. Select języka w tym panelu jest ukryty (`display: none`) oraz wyłączony z kolejności klawiatury, więc nie zajmuje miejsca w layoucie.
  - `.species-max-footnotes`: subtelny przypis pod tabelą maksymalnych wartości atrybutów, `margin-top: 8px`, `color: var(--text2)`, `font-size: .9rem`, `line-height: 1.4`; element nie zmienia układu modalu poza dodaniem krótkiego tekstu pod tabelą.

### 4) Zwijanie/rozwijanie > 9 linii
- Brak clampowania treści w module Kalkulator.

### 5) Wyjątki i formatowanie specjalne
- `.error-message` w `TworzeniePostaci.html` używa koloru `var(--red)`.
- **Podpis autora w stopce obu kreatorów to celowy easter egg.** Reguła `.footer`
  w `Kalkulator/TworzeniePostaci.html` i `Kalkulator/TworzeniePostaci_v2.html` ma
  `font-size: 1px`, `line-height: 1` oraz `-webkit-text-size-adjust: none` i `text-size-adjust: none`.
  Na ekranie linia „Wykonane przez Spaczoną Inteligencję” jest tylko smużką i nie da się jej
  przeczytać, ale tekst nadal istnieje w treści strony: można go zaznaczyć, skopiować i wkleić
  do notatnika, gdzie odczytuje się go normalnie.
  - Rozmiar jest ustawiony w arkuszu stylów, a przełącznik języka podmienia wyłącznie sam tekst,
    więc wersja polska i angielska („Made by Abominable Intelligence”) są tak samo małe —
    rozmiar nie zależy od języka.
  - `text-size-adjust: none` jest tu konieczny: bez niego przeglądarki telefonów powiększają małe
    teksty i linia stałaby się czytelna dokładnie tam, gdzie ma pozostać ukryta.
  - Pozostałe właściwości stopki (kolor `var(--muted)`, kursywa w kreatorze zaawansowanym,
    `letter-spacing: .08em`, wyrównanie) zostają bez zmian — zmieniony jest tylko rozmiar.

---

## Moduł — DiceRoller

### 1) Fonty i typografia
#### 1.1 Fonty lokalne
- Stos bazowy: **"Consolas", "Fira Code", "Source Code Pro", monospace**.

#### 1.2 Zasady użycia fontów
- Nagłówek `h1`: `font-size: 30px`, uppercase, `letter-spacing: 0.05em`.
- Podtytuł i podsumowania używają przygaszonego koloru `--muted`.

### 2) Kolory, tła, ramki, cienie
#### 2.1 Zmienne CSS
- `--bg`: radialne gradienty + `#031605`:
  - `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  - `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  - `#031605`
- `--panel`: `#000`.
- `--border`: `#16c60c`.
- `--text`: `#9cf09c`.
- `--accent`: `#16c60c`, `--accent-dark`: `#0d7a07`.
- `--muted`: `rgba(156, 240, 156, 0.7)`.
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--radius`: `10px`.
- Kolory kości:
  - `--white-die`: `#f6f6f6`, `--white-pip`: `#111111`.
  - `--red-die`: `#c01717`, `--red-pip`: `#ffffff`.

#### 2.2 Dodatkowe wartości kolorów (literalne)
- Cienie kości: `rgba(0, 0, 0, 0.2)` i `rgba(0, 0, 0, 0.35)`.
- Obramowania kości: `#1c1c1c` (białe kości), `#650909` (czerwone kości).
- Fokus inputów: `box-shadow: 0 0 0 2px rgba(22, 198, 12, 0.25)`.
- Podsumowanie `.summary`: tło `rgba(22, 198, 12, 0.08)`, ramka `rgba(22, 198, 12, 0.4)`.
- Hover/active przycisku: `rgba(22, 198, 12, 0.14)` / `rgba(22, 198, 12, 0.22)`.
- Przełącznik języka (`.language-switcher select`): tło `var(--bg)` (`#031605` pod gradientami).

### 3) Layout i elementy UI
- Aplikacja centrowana jak w Main (`body` flex + padding `24px`).
- `.panel`: grid z `repeat(auto-fit, minmax(220px, 1fr))`.
- Kości: kwadraty `68px` (mobile `58px`), animacja `@keyframes roll`.

### 4) Zwijanie/rozwijanie > 9 linii
- Brak clampowania treści w module DiceRoller.

### 5) Wyjątki i formatowanie specjalne
- Brak wyjątków tekstowych; specjalne style dotyczą tylko kości i wyników.

---

## Moduł — Audio

### 1) Fonty i typografia
#### 1.1 Fonty lokalne
- **"Consolas", "Fira Code", "Source Code Pro", monospace**.

#### 1.2 Zasady użycia fontów
- Tytuł `.title`: uppercase, `letter-spacing: 0.08em`, `font-size: clamp(22px, 3vw, 28px)`.
- Podtytuł `.subtitle`: `font-size: 15px`, `opacity: 0.9`.

### 2) Kolory, tła, ramki, cienie
#### 2.1 Zmienne CSS (identyczne jak w Main)
- `--bg`: radialne gradienty + `#031605`:
  - `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  - `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  - `#031605`
- `--panel`: `#000`.
- `--border`: `#16c60c`.
- `--text`: `#9cf09c`.
- `--accent`: `#16c60c`, `--accent-dark`: `#0d7a07`.
- `--danger`: `#ff5f5f` (czerwony akcent).
- `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--radius`: `10px`.

### 3) Layout i elementy UI
- Układ karty identyczny jak Main (`width: min(860px, 100%)`, centrowanie, box-shadow `--glow`).
- Karty sampli w widoku użytkownika i w panelu „Główny widok” admina:
  - nazwa i tag mają klasę `.sample-trigger` (kursor `pointer`),
  - aktywne odtwarzanie dodaje `.is-playing`, co barwi `.sample-trigger` na `--danger`,
  - suwak głośności to `.volume-slider` (`width: 100%`, `accent-color: --accent`).
- Przycisk `.loop-btn` znajduje się wyłącznie w zwykłym widoku użytkownika uruchomionym bez `?admin=1`; aktywny stan pętli ma klasę `.is-looping` i `aria-pressed="true"`, czerwone tło `rgba(255, 95, 95, 0.22)`, obramowanie `--danger`, tekst `#ffd6d6` oraz cień `0 0 12px rgba(255, 95, 95, 0.35)`.

### 4) Zwijanie/rozwijanie > 9 linii
- Brak clampowania treści w module Audio.

### 5) Wyjątki i formatowanie specjalne
- `.group-count`: czerwony licznik w nawiasie dla zgrupowanych plików audio (`color: var(--danger)`).
- `.sample-alias`: alias w nawiasie ma jaśniejszy kolor `#D2FAD2`.

### 6) Bramka dostępu do archiwum
- Moduł korzysta ze wspólnego arkusza `shared/access-gate.css`, tego samego co `DataVault` i `GeneratorNPC` — podpiętego w `<head>` przez `<link rel="stylesheet" href="../shared/access-gate.css">`.
- Znaczniki bramki są zgodne ze wzorcem DataVault: `#accessGate` → `.accessGate__card` → `.accessGate__iconSlot` (ikona `../IkonaPowiadomien2.png`, 72×72) → nagłówek → opis → `#accessForm` z siatką `.accessGate__credentials` → `.accessGate__error`.
- Widoczność sterowana atrybutem `hidden` (`.accessGate[hidden] { display: none; }`), a nie klasą.
- Do arkusza modułu dodano klasę `.btn.primary`, której Audio wcześniej nie miało: `background: var(--text)`, `color: #031605`, `border-color: rgba(22, 198, 12, 0.35)`, `:hover` z `filter: brightness(1.08)`. Bez niej przycisk „Rozpocznij Rytuał” byłby obrysowany zamiast wypełnionego i odbiegałby od DataVault.
- Kolor tekstu przycisku podany literalnie jako `#031605`, ponieważ `--bg` w tym module jest gradientem i nie nadaje się na wartość `color`. Wartość `#031605` to baza tego gradientu, ta sama, której DataVault używa w `--bg`.
- Bramka pojawia się **automatycznie** po otwarciu modułu, gdy nie ma ważnej sesji. Jako nakładka `position: fixed` z `z-index: 9999` zasłania wtedy pasek narzędzi admina — zachowanie identyczne jak w `DataVault`.
- Audio ma w bramce dodatkowy przycisk `#accessSkip` („Pomiń”), którego `DataVault` nie ma. Klasa `.accessGate__skip` jest zdefiniowana **w arkuszu modułu, nie w `shared/access-gate.css`**, właśnie dlatego, że tylko Audio ma bramkę możliwą do pominięcia.
- Przycisk „Pomiń” używa zwykłej klasy `.btn` (obrys), w kontraście do wypełnionego `.btn.primary` przycisku zatwierdzenia — akcja podstawowa pozostaje wizualnie ważniejsza.
- Rozmieszczenie w siatce `.accessGate__credentials`: „Pomiń” w `grid-column: 1; grid-row: 2; justify-self: start`, naprzeciwko `.accessGate__submit` w kolumnie 2. Poniżej `640px` (ten sam punkt łamania co w `shared/access-gate.css`, gdzie siatka zwija się do jednej kolumny) przycisk przechodzi na `grid-row: 4` pod przyciskiem zatwierdzenia i rozciąga się na całą szerokość. Użycie innego punktu łamania powodowałoby nachodzenie przycisków w zakresie 521–640 px.

### 7) Status dostępu do archiwum
- W pasku statusów admina doszedł `#libraryStatus` obok `#manifestStatus`, `#firebaseStatus` i `#favoritesStatus`.
- **Zasada kolorystyczna: czerwień wyłącznie dla błędów.** Stan poprawny — zarówno „Archiwum: zablokowane”, jak i „Archiwum: odblokowane” — korzysta z domyślnego zielonego wyglądu `.status-pill`, bez klasy modyfikującej. Zablokowane archiwum jest stanem poprawnym, a nie awarią.
- Jedyny stan wyróżniony to `.status-pill.is-error`, używany przy „Archiwum: błąd wczytywania”:
  - `border-color: var(--danger)` (`#ff5f5f`),
  - `color: #ffd6d6`,
  - `background: rgba(255, 95, 95, 0.12)`.
- Wszystkie trzy wartości pochodzą z palety modułu Audio udokumentowanej wyżej — tej samej, której używa aktywny `.loop-btn`. Do bramki nie wprowadzono żadnego koloru spoza tej palety.
- Szczegół błędu trafia do atrybutu `title` pastylki, więc jest dostępny po najechaniu kursorem, bez zaśmiecania paska statusów.
- Pastylka `#manifestStatus` również ma stan błędu: przy nieudanym pobraniu `AudioManifest.json` dostaje klasę `.status-pill.is-error` i tekst „Manifest: błąd listy publicznej”, a pełny komunikat trafia do atrybutu `title`. Zasada „czerwień wyłącznie dla błędów” jest zachowana — nieudane pobranie pliku jest awarią, a nie stanem poprawnym.
- W pasku statusów admina jest też `#builderStatus` — stan generatora manifestów. Obowiązuje ta sama zasada kolorystyczna: zielono dla „gotowy”, „przetwarzanie pliku” i wyniku „N publicznych / M chronionych”, `.status-pill.is-error` wyłącznie dla stanu „Generator: błąd”. Pełna treść błędu trafia do atrybutu `title`.
- Przycisk `#unlockLibrary` w toolbarze admina oraz `#unlockLibraryUser` w panelu nawigacji widoku użytkownika; oba używają standardowej klasy `.btn` i mają jedną, stałą etykietę „Odblokuj archiwum”.
- **Przycisku blokowania nie ma.** Po odblokowaniu archiwum oba przyciski są ukrywane atrybutem `hidden`, zamiast zmieniać etykietę na „Zablokuj archiwum”. Odblokowane archiwum jest stanem docelowym, więc przycisk, który do niego prowadzi, przestaje być potrzebny.
- Przycisk `#buildManifests` w toolbarze admina (generator manifestów z XLSX) używa standardowej klasy `.btn` i istnieje wyłącznie w widoku `?admin=1` — w widoku użytkownika jest usuwany razem z całą sekcją `admin-only`.

### 8) Podział języka komunikatów
- Panel `?admin=1` jest narzędziem technicznym, dlatego statusy, etykiety przycisków i komunikaty diagnostyczne są napisane językiem zwykłym i konkretnym: „Archiwum: zablokowane”, „Odblokuj archiwum”, „Bramka nie znalazła manifestu archiwum (HTTP 404)…”.
- Językiem lore Warhammera 40k pozostaje wyłącznie **okno bramki dostępu** — tytuł, opis, etykieta „Litania Dostępu”, przycisk „Rozpocznij Rytuał” oraz dwa komunikaty dotyczące samego hasła (nie wypowiedziano Litanii, Litania odrzucona). Jest to celowe: okno jest wspólne z modułem `DataVault` i ma wyglądać oraz brzmieć identycznie.
- Komunikaty o awarii infrastruktury (brak manifestu, brak połączenia z bramką, wygaśnięcie sesji) są techniczne również w oknie bramki, ponieważ służą do diagnozy, a nie do budowania klimatu.
- Do tej samej kategorii należą etykieta „Pomiń”, komunikat wyjaśniający otwarcie bramki po kliknięciu pozycji „(brak w manifeście)” oraz wszystkie komunikaty generatora manifestów (brak kolumn, duplikat kolumny, brak wierszy). Mówią wprost, co zrobić z plikiem, i nie używają języka lore.

---

## Moduł — Infoczytnik

## 2026-04-23 — Infoczytnik (test): etykiety fontów + preload
- `Infoczytnik/GM_test.html`: dropdown **Font** używa teraz etykiet tekstowych `ID. Frakcja - Nazwa fontu` i renderuje je jednolitym fontem UI (bez stylowania fragmentów opcji).
- `Infoczytnik/GM_test.html` i `Infoczytnik/Infoczytnik_test.html`: rozszerzono import Google Fonts o brakujące rodziny: `IBM Plex Serif`, `Open Sans`, `Noto Serif`, `DM Serif Display`, `IBM Plex Sans Condensed`, `Exo 2`.
- Dodano preload webfontów przez `document.fonts.load(...)` (manifestowe fonty w GM + lista stała na ekranie gracza), aby przełączenie fontu i pierwszy render były natychmiastowe optycznie.

## 2026-03-31 — Infoczytnik (domyślny preset GM)
- Zmieniono domyślny preset formularza w `GM_test.html` (`DEFAULT_FORM_STATE`) na konfigurację startową sesji:
  - tło `7. Litannie Zaginionych`,
  - logo `1. Mechanicus`,
  - filler set `1. Mechanicus`,
  - audio wiadomości `1. Text-On-Screen`,
  - checkboxy: `Logo=OFF`, `Prostokąt cienia=OFF`, `Flicker=OFF`, `Audio=ON`,
  - `Ilość linii fillerów=3`, `Wysokość Prefix/Suffix=2`,
  - typografia i kolory domyślne: treść `#00ff66 / 20px`, prefix+suffix `#ffffff / 12px`.


Moduł składa się z dwóch stron oraz strony startowej:
- **Infoczytnik.html** — ekran graczy (Data-Slate),
- **GM.html** — panel prowadzącego,
- **index.html** — menu wyboru wersji (produkcyjnych i testowych), spójne stylistycznie z modułem Main.

### 1) Fonty i typografia
#### 1.1 Fonty zewnętrzne (Google Fonts)
Załadowane fonty (używane zależnie od frakcji):
- Share Tech Mono
- Cinzel (400/700)
- Rajdhani (400/600)
- Black Ops One
- Staatliches
- Orbitron (400/700)
- Questrial
- Russo One

#### 1.2 Fonty lokalne i fallbacki
- Domyślny stos: **Calibri, Arial, sans-serif** (`--font`).
- Fallback w panelu GM: **Arial, sans-serif**.
- Teksty techniczne i podgląd: **Consolas, "Courier New", monospace**.

#### 1.3 Zasady użycia fontów
- `Infoczytnik.html`: rozmiary dynamiczne przez `clamp(...)`:
  - `--msg-font-size: clamp(18px, 3.4vw, 32px)`.
  - `--prefix-font-size: clamp(12px, 2.0vw, 16px)`.
  - `--suffix-font-size: clamp(12px, 2.0vw, 16px)`.
  - `--filler-gap: clamp(12px, 2vw, 18px)`.
- `GM.html`: UI panelowy, nagłówki `font-size: 20px`, labelki `font-size: 13px`, podglądy `font-size: 12–16px`.
- `index.html`: stos monospace `"Consolas", "Fira Code", "Source Code Pro", monospace` ustawiony globalnie w `*`.

### 2) Kolory, tła, ramki, cienie
#### 2.1 Infoczytnik.html (ekran graczy)
- Akcent bazowy: `--accent = #00ff66`.
- Tło globalne i panelu: `#000`.
- Tekst prefix/suffix: `rgba(255,255,255,.88)` i `rgba(255,255,255,.86)`.
- Overlay CRT:
  - linie skanowania: `rgba(255,255,255,.06)` + przezroczystości `rgba(0,0,0,0)`.
  - vignette: `rgba(0,0,0,.70)` i `rgba(255,255,255,.04)`.
  - tło odblokowania dźwięku: `rgba(0,0,0,.88)`.
- Cienie tekstu: `0 2px 6px rgba(0,0,0,.70)` oraz zielony glow `0 0 18px rgba(0,255,120,.18)`.
- Logo: `filter: drop-shadow(0 2px 6px rgba(0,0,0,.7))`.

#### 2.2 GM.html (panel prowadzącego)
- Zmienne: `--text: #eaeaea`, `--muted: #bdbdbd`, `--accent: #ffd27a`, `--border: #2a2a2a`, `--panel: rgba(18,18,18,.92)`.
- Tło strony: `linear-gradient(180deg, #070707, #0f0f0f)`.
- Przycisk podstawowy: `linear-gradient(180deg, #3a2a12, #1c1408)` + ramka `rgba(255,210,122,.35)`.
- Przycisk ostrzegawczy: `linear-gradient(180deg, #1c0c0c, #120606)` + ramka `rgba(255,120,120,.25)`, tekst `#ffb3b3`.
- Pola input: tło `#0f0f0f`.
- Podglądy i chipy: `#cfcfcf`, `#ddd`, `rgba(255,255,255,.08)`, `rgba(255,255,255,.14)`, `rgba(255,255,255,.18)`.
- Dodatkowe kolory w UI GM:
  - `#1d1d1d` (przyciski), `#777` (miniLabel), `rgba(0,0,0,.18/.25/.35)` (panele i podglądy).
  - Kolory szybkich chipów i pickerów: `#00ff66`, `#ff3333`, `#d4af37`, `#ffffff`.

#### 2.3 index.html (menu wyboru wersji)
- Paleta zgodna z modułem Main:
  - `--bg`: radialne gradienty + `#031605`.
  - `--panel`: `#000`.
  - `--border`: `#16c60c`.
  - `--text`: `#9cf09c`.
  - `--accent`: `#16c60c`, `--accent-dark`: `#0d7a07`.
  - `--glow`: `0 0 25px rgba(22, 198, 12, 0.45)`.
  - `--radius`: `12px`.
- Notatki i opisy:
  - teksty pomocnicze: `rgba(156, 240, 156, 0.75)`,
  - kod w notatkach: `#b6ffb6`.

### 3) Layout i elementy UI
- Ekran graczy:
  - `layout-img` to **PNG** z `assets/layouts/<frakcja>/`.
  - `screen` ma pozycję i padding sterowane zmiennymi `--screen-*` oraz `clamp(14px, 2.4vw, 24px)`.
  - CRT overlay (`.crt::before` i `.crt::after`) generuje efekt skanowania i vignette.
- Panel GM:
  - `.wrap` max `980px`, karta `.card` z cieniem `0 10px 30px rgba(0,0,0,.35)`.
  - Układ kolumn przez `.row` i `.col` (flex + wrap).
- `index.html`:
  - `body` centrowany flexem, padding `24px`.
  - `main` o szerokości `min(880px, 100%)`, z ramką `2px` i cieniem `--glow`.
  - Sekcje `.section` z delikatnym tłem `rgba(22, 198, 12, 0.04)` i obwódką `rgba(22, 198, 12, 0.45)`.
  - Przyciski `.btn` dziedziczą neonowy styl (border `2px`, tła z `rgba(22, 198, 12, 0.08/0.14/0.22)`).

### 4) Zwijanie/rozwijanie > 9 linii
- Brak clampowania treści w Infoczytniku.

### 5) Wyjątki i formatowanie specjalne
- Brak wyjątków formatowania tekstu (poza dynamicznym doborem fontów i kolorów przez GM).
- Kolor treści, prefixu i suffixu może być zmieniany przez GM (w tym wartości typu `#RRGGBB` i `rgba(...)`).

---

## Uwaga końcowa
Każda modyfikacja stylu w dowolnym module **musi** być odzwierciedlona w tym pliku, aby zachować spójne, kompletne źródło prawdy dla stylów całej aplikacji.

## Aktualizacja 2026-03-13 — Main: wyróżniony przycisk Web Push

- W `Main/index.html` dodano czerwony wariant przycisku CTA (`.pushCta`) dla akcji **Włącz powiadomienia**.
- Parametry wizualne nowego wariantu:
  - obramowanie: `#ff3b30`
  - tło: `rgba(255, 59, 48, 0.2)`
  - tekst: `#ffe5e3`
  - poświata: `0 0 18px rgba(255, 59, 48, 0.45)`
- W stanie `:hover` i `:active` rośnie intensywność czerwonego tła oraz poświaty, aby CTA odróżniało się od standardowych zielonych przycisków modułów.

## Aktualizacja 2026-03-13 — korekta CTA push i spacingu fillerów

- `Main/index.html`: przycisk **Włącz powiadomienia** (`.pushCta`) zmieniono na kompaktowy, "pill" i przypięto do prawego dolnego rogu (`position: fixed; right:14px; bottom:14px`).
- `Infoczytnik/GM_test.html`: podgląd `livePreview` dla prefix/suffix renderuje nowe linie przez `white-space: pre-line`.
- `Infoczytnik/Infoczytnik_test.html`: układ odstępów fillerów oparto o dwa równe gapy (`--gap-prefix-to-msg`, `--gap-msg-to-suffix`) oraz odseparowano wpływ logo na wysokość sekcji prefixu (logo pozycjonowane absolutnie).

## Aktualizacja 2026-03-28 — nowe layouty pisma (Infoczytnik)

- Dodano dwa nowe layouty w module **Infoczytnik**:
  - `pismo_odreczne` z fontem **Caveat** (`assets/layouts/Pismo_odreczne/Pergamin.jpg`),
  - `pismo_ozdobne` z fontem **Great Vibes** (`assets/layouts/Pismo_ozdobne/Pergamin.jpg`).
- Dla obu layoutów wprowadzono tryb ograniczony:
  - prefix i suffix są wyłączone (brak losowania, brak fallbacków),
  - logo jest wymuszone jako wyłączone,
  - efekt flicker jest wymuszony jako wyłączony,
  - dźwięk `Message.mp3` nie jest odtwarzany.
- Zachowano aktywne opcje stylu tekstu:
  - kolor fontu wiadomości,
  - rozmiar fontu wiadomości i prefix/suffix (w praktyce dla tych layoutów dotyczy wizualnie treści wiadomości).
- Dźwięk **Ping** pozostaje aktywny także dla layoutów pisma.

## Aktualizacja layoutu PWA — 2026-03-29 (Main)

- W `Main/index.html` viewport został rozszerzony do `viewport-fit=cover` dla poprawnej współpracy z obszarami systemowymi Androida.
- Dodano komplet meta `theme-color` (domyślny + wariant `light` i `dark`) oraz `color-scheme: dark`, aby stabilizować ciemny wygląd elementów systemowych.
- Dodano bazowe ciemne tło na `html, body` (`#031605`) oraz dolny `safe-area` padding: `calc(24px + env(safe-area-inset-bottom, 0px))`.
- Celem zmiany jest ograniczenie przypadków jasnego paska systemowego przy uruchamianiu aplikacji jako PWA na Androidzie/tabletach.

## Aktualizacja 2026-03-30 — Infoczytnik (test)
- `GM_test.html` i `Infoczytnik_test.html` przeszły na model niezależnych dropdownów.
- Zachowano spójny fallback fontów: `Calibri, Arial, sans-serif` dla każdego wyboru `Font`.
- Podgląd GM renderuje tło + logo + treść na jednym komponencie preview.
- Kolor głównej treści i kolor Prefix+Suffix są niezależne (oddzielne pola i walidacja).

## Aktualizacja 2026-03-31 — Infoczytnik (test, kolory/fonty/fillery)
- `GM_test.html`:
  - sekcje kolorów (treść i fillery) mają układ `HEX + Picker` w jednym rzędzie, pod spodem szybkie kolory i dalej pole rozmiaru fontu;
  - dodano szybkie kolory: **Zielony** `#00ff66`, **Czerwony** `#ff3333`, **Złoty** `#d4af37`, **Biały** `#ffffff`;
  - kolory działają w trybie **HEX-only** (`#RGB` i `#RRGGBB`), usunięto domyślne RGBA dla Prefix/Suffix;
  - pickery kolorów aktualizują pola tekstowe na eventach `input` i `change`;
  - `fillerLineCount` rerolluje fillery natychmiast po zmianie wartości (bez konieczności zmiany zestawu);
  - usunięto komunikat „Flicker aktywny (opcjonalny)” — hint pokazuje tylko ostrzeżenie przy wyłączonym prostokącie cienia.
- Kontrakt GM → Infoczytnik:
  - `msgFontSize`, `prefixFontSize`, `suffixFontSize` są przekazywane jako **number** (bez `px`).
- `Infoczytnik_test.html`:
  - doładowuje ten sam zestaw Google Fonts co panel GM, więc wybór fontu jest zgodny między preview i ekranem gracza;
  - domyślny kolor Prefix/Suffix ustawiony na `#ffffff`.

## Aktualizacja 2026-04-17 — Status `old` i przekreślenia

### Nowy token koloru (DataVault + GeneratorNPC)
- Dodano kolor archiwalny: `--text-old: #7f9b7f`.
- Zastosowanie:
  - rekordy oznaczone `Status=old` w DataVault (kolor bazowy wiersza),
  - pola `LP`, `Nazwa`, `Typ` w podglądzie bazowym GeneratorNPC,
  - kontrolka „Czy wyświetlić zdezaktualizowane wpisy?” w GeneratorNPC i DataVault (`var(--text-old)` / `#7f9b7f`, `opacity: 1`, `accent-color: var(--text-old)` dla zaznaczonego checkboxa),
  - teksty przekreślone (`{{S}}...{{/S}}`) jako kolor domyślny przekreślenia.

### Priorytet kolorów
- Czerwony (`{{RED}}`) ma wyższy priorytet niż styl archiwalny i przekreślenie.
- Segment `{{RED}}{{S}}...{{/S}}{{/RED}}` pozostaje czerwony, ale jest przekreślony.

### Szerokość kolumny „Klucz” (GeneratorNPC)
- W tabeli `data-sheet="Bestiariusz"` ustawiono `table-layout: auto`, aby Firefox nie rozdmuchiwał lokalnego przewijania tabeli Bestiariusza do nienaturalnych szerokości.
- Pierwsza kolumna (`Klucz`) ma stabilną szerokość: `25ch` (`width/min-width/max-width`).
- Druga kolumna (`Wartość`) pozostaje elastyczna i dopasowuje się do treści oraz dostępnej przestrzeni karty.

## Aktualizacja 2026-04-20 — korekta DataVault (kolumny i layout)
- Zaktualizowano opis zakładek tworzenia postaci o `Pakiety Wyniesienia`.
- Poprawiono globalny opis kolumny `Strona`: wyrównanie jest `left` (nie `center`).
- Uzupełniono listę arkuszy z neutralnym przecinkiem w `Słowa Kluczowe` o `Archetypy` i `Pakiety Wyniesienia`.
- Urealniono opis clampa do aktualnej implementacji opartej wyłącznie o pomiar renderu (`ResizeObserver`).

## Aktualizacja 2026-04-23 — Kalkulator: styl i pozycja „Tajny przycisk!”
- W `Kalkulator/index.html` przycisk **Tajny przycisk!** otrzymał ten sam wariant CTA co `Main/index.html` (**Włącz powiadomienia**):
  - obramowanie: `#ff3b30`,
  - tło: `rgba(255, 59, 48, 0.2)`,
  - tekst: `#ffe5e3`,
  - poświata: `0 0 14px rgba(255, 59, 48, 0.35)`.
- Zmieniono geometrię przycisku na kompaktowy „pill”:
  - `border-radius: 999px`,
  - `width: auto`,
  - `padding: 6px 10px`,
  - `font-size: 11px`, `line-height: 1.1`.
- Zmieniono położenie przycisku:
  - przeniesienie z prawej kolumny siatki `.actions` do osobnego kontenera `.secretCtaWrap`,
  - wyrównanie do prawej (`justify-content: flex-end`) pod główną siatką nawigacji.

## Aktualizacja 2026-04-27 – modal potwierdzenia (Kalkulator/TworzeniePostaci)
- Zmieniono asset grafiki modala na `/Kalkulator/Modal_Icon.png`.
- Dla przycisku potwierdzającego (`Tak` / `Yes`) ustawiono czerwony wariant kolorystyczny:
  - obramowanie: `rgba(190,40,40,.75)`
  - tło: `rgba(110,20,20,.7)`
  - hover: `rgba(150,28,28,.8)`
  - tekst: `#ffdada`
- Utrzymano ciemne tło modala i zielony motyw ramki, aby zachować spójność stylistyczną modułu.


## Aktualizacja 2026-05-12 — usunięcie CTA powiadomień z Main
- `Main/index.html`: usunięto czerwony przycisk `Włącz powiadomienia` oraz jego dedykowane style `.pushCta*`.
- Układ ekranu głównego pozostał oparty o siatkę kart modułów bez dodatkowego elementu CTA pod listą modułów.

## 🇵🇱 Okno hasła — Litania Dostępu
- Wspólny overlay hasła (`shared/access-gate.css`) używa siatki 2-kolumnowej.
- Arkusz jest współdzielony przez moduły `DataVault`, `GeneratorNPC` oraz `Audio`.
- Lewa kolumna: etykieta „Litania Dostępu” (wyrównanie do lewej).
- Prawa kolumna: pole hasła, a pod nim przycisk zatwierdzenia wyrównany do prawej.
- Breakpoint mobilny: `max-width: 640px`, układ jednokolumnowy.
- Kolor etykiety „Litania Dostępu” jest celowo ciemniejszy niż treść komunikatu: `var(--muted, #4a8b4a)`.
- Wyjątek modułu `Audio`: bramka ma dodatkowy przycisk „Pomiń” (`.accessGate__skip`) w lewej kolumnie drugiego wiersza, naprzeciwko przycisku zatwierdzenia. Klasa jest zdefiniowana w arkuszu modułu `Audio`, a nie we wspólnym arkuszu, ponieważ tylko tam bramkę można pominąć. Mobilnie przycisk przechodzi na czwarty wiersz siatki, przy tym samym punkcie łamania `640px`.

## 🇬🇧 Password window — Litany of Access
- Shared password overlay (`shared/access-gate.css`) uses a 2-column grid.
- The stylesheet is shared by the `DataVault`, `GeneratorNPC` and `Audio` modules.
- Left column: “Litany of Access” label (left-aligned).
- Right column: password field, with submit button below aligned to the right.
- Mobile breakpoint: `max-width: 640px`, single-column layout.
- The “Litany of Access” label is intentionally darker than the message body text: `var(--muted, #4a8b4a)`.
- `Audio` module exception: its gate carries an extra “Skip” button (`.accessGate__skip`) in the left cell of the second row, opposite the submit button. The class is defined in the `Audio` module stylesheet rather than the shared one, because only there may the gate be skipped. On mobile the button moves to the grid's fourth row, at the same `640px` breakpoint.

## Moduł — Infoczytnik (aktualizacja 2026-05-28)
- W panelu GM (`Infoczytnik/GM_test.html`) dodano blok **Kolor logo** pomiędzy polami **Logo** i **Zestaw fillerów**.
- Domyślna barwa logo: `#ffffff`.
- W stanie wyłączonego checkboxa **Logo** panel koloru logo przechodzi do stanu nieaktywnego (wyszarzenie + blokada kliknięcia).
- Podgląd GM i ekran odbiorcy renderują logo jako maskę PNG, a kolor jest kontrolowany przez jednolity fill (bez gradientu).

## DataVault — aktualny wygląd zakładek pojazdów i zasad walki

DataVault używa trzech palet zakładek:

- zwykłe zakładki pozostają zielone i korzystają z dotychczasowych zmiennych `--text`, `--code`, `--b`, `--b2` oraz zielonego aktywnego glow;
- zakładki zasad walki (`Trafienia Krytyczne`, `Groza Osnowy`, `Skrót Zasad`, `Tryby Ognia`, `Kary do ST`) mają czerwony tekst, czerwone aktywne obramowanie i czerwony glow;
- zakładki pojazdów (`Role W Pojeździe`, `Akcje Pojazdu`, `Stany Pojazdów`, `Cechy Pojazdów`, `Pojazdy`, `Bronie Pojazdów`, `Ekwipunek Pojazdów`, `Uszkodzenia Pojazdów`, `Eksplozje Pojazdów`) mają stalowo-srebrny tekst, stalowo-srebrne aktywne obramowanie i stalowo-srebrny glow; `Uszkodzenia Pojazdów` i `Eksplozje Pojazdów` są widoczne tylko w trybie admina po zaznaczeniu checkboxa pojazdów.

Paleta pojazdów jest oparta o zmienne CSS: `--steel`, `--steel-bright`, `--steel-muted`, `--steel-border`, `--steel-glow`, `--steel-bg` oraz `--steel-bg-active`. Checkbox widoczności zakładek pojazdów używa stalowo-srebrnego tekstu i `accent-color` dopasowanego do tej palety.

## DataVault — szerokości kolumn pojazdów

W arkuszu `Pojazdy` kolumna `Koszt IM` jest zwykłą widoczną kolumną kosztową. Ma minimalną szerokość **8ch**, tekst wyśrodkowany i standardowe łamanie tekstu. Nie wymusza `white-space: nowrap` i nie ma osobnego `max-width`.

## DataVault — vehicle column widths

In the `Pojazdy` sheet, the `Koszt IM` column is a normal visible cost column. It has a **8ch** minimum width, centered text, and standard text wrapping. It does not force `white-space: nowrap` and has no separate `max-width`.

## App Check — brak wpływu na wygląd (DataVault, GeneratorNPC, Audio)

Moduły `DataVault`, `GeneratorNPC` i `Audio` uruchamiają App Check w oparciu o reCAPTCHA Enterprise.
Odnotowuję to tutaj wyłącznie po to, żeby było gdzie sprawdzić, że **wygląd tych modułów jest
dokładnie taki sam jak bez App Check**:

- reCAPTCHA działa w trybie niewidocznym — nie pojawia się ani plakietka „protected by reCAPTCHA”,
  ani żadne okno z obrazkami czy pytaniem „czy jesteś robotem”;
- SDK Firebase dokłada do `<body>` pojedynczy pusty kontener `div#fire_app_check_<nazwa-aplikacji>`
  z ustawionym na sztywno `display: none`. Element nie zajmuje miejsca, nie ma stylów w arkuszach
  modułów i nie wpływa na układ;
- biblioteka reCAPTCHA jest wczytywana znacznikiem `<script defer>`, więc nie wstrzymuje rysowania
  strony.

Sprawdzone pomiarem: zrzuty ekranu wszystkich trzech modułów przy 1440 × 900 px przed zmianą i po
zmianie są identyczne co do bajtu — również wtedy, gdy biblioteka reCAPTCHA jest zablokowana.

## App Check — no visual impact (DataVault, GeneratorNPC, Audio)

The `DataVault`, `GeneratorNPC` and `Audio` modules activate App Check backed by reCAPTCHA
Enterprise. This is recorded here only so there is a place to confirm that **these modules look
exactly the same as they did without App Check**:

- reCAPTCHA runs in invisible mode — there is no "protected by reCAPTCHA" badge and no image
  challenge or "are you a robot" dialog;
- the Firebase SDK appends a single empty `div#fire_app_check_<app-name>` container to `<body>`
  with a hard-coded `display: none`. It takes no space, has no styles in the module stylesheets and
  does not affect layout;
- the reCAPTCHA library is loaded with a `<script defer>` tag, so it does not block page rendering.

Verified by measurement: screenshots of all three modules at 1440 × 900 px before and after the
change are byte-identical — including the case where the reCAPTCHA library is blocked.

## Infoczytnik — panel GM: sekcja „Ulubione wiadomości"

Sekcja stoi pod rzędem przycisków wysyłki, a nad polem `Log importu`, i korzysta wyłącznie ze
zmiennych oraz klas już obecnych w panelu — nie wprowadza nowych kolorów ani fontów.

- pierwszy wiersz (`.favRow`) to elastyczny układ z odstępem 10 px: lista wyboru zajmuje dwa razy
  więcej miejsca niż pole nazwy (`flex: 2 1 240px` wobec `flex: 1 1 180px`), a przy wąskim ekranie
  pole nazwy schodzi pod listę;
- drugi wiersz to zwykły `.btnrow` z dodatkową klasą `.favBtnRow`, która zmniejsza minimalną
  szerokość przycisku ze 160 px do 130 px — siedem przycisków mieści się wtedy w dwóch rzędach na
  komputerze zamiast w trzech;
- przycisk `Usuń` używa istniejącej klasy `warn` (czerwonawy gradient), pozostałe są neutralne;
- podpowiedź pod przyciskami to istniejąca klasa `.small` w kolorze `--muted`;
- przyciski nieczynne (brak zaznaczonej pozycji) korzystają z domyślnego wyglądu `:disabled`
  przeglądarki — nie ma dla nich osobnej reguły.

## Infoczytnik — GM panel: the "Ulubione wiadomości" section

The section sits below the send button row and above the `Log importu` field, and uses only
variables and classes already present in the panel — it introduces no new colours or fonts.

- the first row (`.favRow`) is a flexible layout with a 10 px gap: the select takes twice the space
  of the name field (`flex: 2 1 240px` against `flex: 1 1 180px`), and on a narrow screen the name
  field drops below the select;
- the second row is a plain `.btnrow` with an extra `.favBtnRow` class that lowers the minimum button
  width from 160 px to 130 px — seven buttons then fit in two rows on a computer instead of three;
- the `Usuń` button uses the existing `warn` class (reddish gradient), the rest are neutral;
- the hint below the buttons uses the existing `.small` class in the `--muted` colour;
- disabled buttons (no entry selected) use the browser's default `:disabled` look — there is no
  separate rule for them.

## GeneratorNPC — „Podgląd bazowy" mieści się na szerokość ekranu

Karta `Podgląd bazowy` (tabela klucz/wartość z arkusza Bestiariusz) nie ma poziomego paska
przewijania na żadnej szerokości ekranu. Tekst w kolumnie `Wartość` zawija się w komórce.

Aktualny stan reguł w `GeneratorNPC/style.css`:

- `.data-table` nadal ma `min-width: max-content` — to jest zachowanie szerokich tabel
  wielokolumnowych (`Wybór Broni`: 10 kolumn, `Wybór Psioniki`: 8 kolumn), gdzie przewijanie w bok
  wewnątrz karty jest potrzebne i zostaje;
- `.data-table[data-sheet="Bestiariusz"]` ma `min-width: 0` i `width: 100%`, więc podgląd bazowy
  dopasowuje się do karty;
- `.celltext` ma `overflow-wrap: break-word` przy `word-break: normal` — łamią się tylko bardzo
  długie pojedyncze wyrazy, zwykłe słowa nadal łamią się po spacjach;
- przy `max-width: 640px` wiersze i komórki podglądu bazowego stają się blokami: klucz ląduje nad
  wartością jako mała etykieta (`0.75rem`, wersaliki, `letter-spacing: 0.08em`, kolor `--text2`),
  a wartość zajmuje całą szerokość. Nagłówek tabeli jest wtedy ukryty, a wiersze rozdziela
  `1px solid var(--div)`.

Pionowe zwijanie komórek powyżej dziewięciu linii wraz z podpowiedzią „kliknij aby rozwinąć"
działa bez zmian.

Zmierzony nadmiar szerokości karty (treść szersza niż karta) przy najdłuższej pojedynczej linii
z Bestiariusza: **4482 px przy 360 px szerokości ekranu, 3402 px przy 1440 px i 2922 px przy 1920 px
spada do 0 px na każdej z tych szerokości.** Szerokie tabele wielokolumnowe mają po zmianie
identyczne szerokości kolumn i identyczne przewijanie jak wcześniej.

## GeneratorNPC — the "base preview" fits the screen width

The `Podgląd bazowy` card (the key/value table from the Bestiary sheet) has no horizontal scrollbar
at any screen width. Text in the `Wartość` column wraps inside its cell.

Current state of the rules in `GeneratorNPC/style.css`:

- `.data-table` still has `min-width: max-content` — that is the behaviour of the wide multi-column
  tables (weapon picker: 10 columns, psychic picker: 8 columns), where sideways scrolling inside the
  card is needed and stays;
- `.data-table[data-sheet="Bestiariusz"]` has `min-width: 0` and `width: 100%`, so the base preview
  fits its card;
- `.celltext` has `overflow-wrap: break-word` with `word-break: normal` — only very long single words
  break, ordinary words still break at spaces;
- at `max-width: 640px` the base preview rows and cells become blocks: the key lands above the value
  as a small label (`0.75rem`, uppercase, `letter-spacing: 0.08em`, colour `--text2`) and the value
  takes the full width. The table header is hidden and rows are separated by `1px solid var(--div)`.

Vertical clamping of cells above nine lines, together with the "click to expand" hint, is unchanged.

Measured card overflow (content wider than the card) for the longest single Bestiary line:
**4482 px at a 360 px screen, 3402 px at 1440 px and 2922 px at 1920 px drops to 0 px at every one of
those widths.** After the change the wide multi-column tables have identical column widths and
identical scrolling.

## DataVault — okno „Porównaj zaznaczone"

Tabela w oknie porównania korzysta z klasy `compareTable`:

- odstęp wewnętrzny komórki: **8 px** (wcześniej tabela rysowała się w stylu domyślnym przeglądarki),
- linia rozdzielająca wiersze: `1px solid var(--div)`,
- nagłówki: kolor `--code` na tle `rgba(22, 198, 12, .04)`,
- tła naprzemienne: `--zebra-odd` i `--zebra-even`, wiersz pod kursorem: `--hover`,
- zawartość komórek wyrównana do góry (`vertical-align: top`).

Zmierzony odstęp między treścią sąsiednich kolumn: **4 px → 16 px**. Okno nie wyróżnia kolorem pól,
które się różnią.

## DataVault — the "Compare selected" window

The table in the comparison window uses the `compareTable` class:

- cell padding: **8 px** (previously the table fell back to the browser default styling),
- row separator: `1px solid var(--div)`,
- headers: `--code` colour on an `rgba(22, 198, 12, .04)` background,
- alternating backgrounds: `--zebra-odd` and `--zebra-even`, hovered row: `--hover`,
- cell content aligned to the top (`vertical-align: top`).

Measured gap between the contents of neighbouring columns: **4 px → 16 px**. The window does not
colour-highlight fields that differ.

## DataVault — przyklejone nagłówki i układ kart na telefonie

### Komputer i tablet (powyżej 720 px)

Przewija się **panel tabeli**, nie cała strona. Nazwy kolumn i pola filtrów zostają na wierzchu.

- `.app`: `height: 100dvh; min-height: 100dvh`,
- `.main`, `.workspace`, `.tableWrap`, `.tableFrame`: `min-height: 0`,
- `.tableViewport`: `flex: 1; overflow: auto` — to jest jedyny przewijany pojemnik,
- `.dataTable thead th`: `background-color: var(--panel)` pod gradientem
  `linear-gradient(180deg, rgba(22,198,12,.08), rgba(22,198,12,.03))`, `z-index: 3`,
- `.dataTable thead tr:nth-child(2) th`: `background-color: var(--panel)` pod jednolitym
  `rgba(22,198,12,.05)`, `z-index: 2`, `top: var(--header-row-height)`,
- `--header-row-height`: wpisywana pomiarem na element tabeli przez `buildTableSkeleton()`. Wartość
  `36px` w `:root` jest tylko zapasem przed pierwszym pomiarem. Zmierzone wysokości: **40 px** przy
  nazwach w jednej linii, **59 px** przy dwóch, **78 px** przy trzech,
- kolumna zaznaczania: `5ch` zamiast `8ch` — odzyskane 23 px idzie do kolumn z treścią.

### Telefon (720 px i mniej)

Wiersz tabeli staje się kartą. Przewija się cała strona, nagłówek jest ukryty.

- `.app`: `height: auto; min-height: 100dvh`,
- `.tableViewport`: `overflow-x: hidden; padding: 8px`,
- `.dataTable`: bez ramki i bez cienia; `thead` ukryty,
- karta (`tbody tr`): `1px solid var(--div)`, `border-radius: 6px`, `margin-bottom: 10px`,
  `padding: 8px 10px`, `box-shadow: 0 0 10px rgba(22,198,12,.10)`,
- komórka: siatka `minmax(8ch, 30%) minmax(0, 1fr)` z odstępem 10 px; etykieta z `attr(data-col)`
  w kolorze `--text2`, `0.72rem`, wersaliki, `letter-spacing: .08em`,
- komórka zaznaczania: na górze karty, wyrównana do prawej, oddzielona linią `1px solid var(--div)`.

### Zmierzony efekt

| Co | Przed | Po |
| --- | --- | --- |
| Panel tabeli przewija się (1440 px) | nie | tak |
| Przewija się cała strona (1440 px) | tak | nie |
| Nagłówek widoczny po przewinięciu o 400 px (1440 px) | nie, −242 px poza ekranem | tak, 158 px od góry |
| Nachodzenie filtrów na nagłówek | 23 px | 0 px |
| Tło nagłówka | przezroczyste | nieprzezroczyste |
| Nadmiar poziomy na telefonie 390 px | 1621 px | 0 px |
| Szerokość kolumny zaznaczania | 63 px | 39 px |

## DataVault — sticky headers and the phone card layout

### Computer and tablet (above 720 px)

The **table panel** scrolls, not the whole page. Column names and filter fields stay on top.

- `.app`: `height: 100dvh; min-height: 100dvh`,
- `.main`, `.workspace`, `.tableWrap`, `.tableFrame`: `min-height: 0`,
- `.tableViewport`: `flex: 1; overflow: auto` — the only scrolling container,
- `.dataTable thead th`: `background-color: var(--panel)` under the
  `linear-gradient(180deg, rgba(22,198,12,.08), rgba(22,198,12,.03))` gradient, `z-index: 3`,
- `.dataTable thead tr:nth-child(2) th`: `background-color: var(--panel)` under a flat
  `rgba(22,198,12,.05)`, `z-index: 2`, `top: var(--header-row-height)`,
- `--header-row-height`: written by measurement onto the table element by `buildTableSkeleton()`. The
  `36px` value in `:root` is only a fallback before the first measurement. Measured heights: **40 px**
  with names on one line, **59 px** on two, **78 px** on three,
- selection column: `5ch` instead of `8ch` — the reclaimed 23 px go to the content columns.

### Phone (720 px and below)

A table row becomes a card. The page scrolls and the header is hidden.

- `.app`: `height: auto; min-height: 100dvh`,
- `.tableViewport`: `overflow-x: hidden; padding: 8px`,
- `.dataTable`: no border and no shadow; `thead` hidden,
- the card (`tbody tr`): `1px solid var(--div)`, `border-radius: 6px`, `margin-bottom: 10px`,
  `padding: 8px 10px`, `box-shadow: 0 0 10px rgba(22,198,12,.10)`,
- the cell: a `minmax(8ch, 30%) minmax(0, 1fr)` grid with a 10 px gap; the label from
  `attr(data-col)` in `--text2`, `0.72rem`, uppercase, `letter-spacing: .08em`,
- the selection cell: at the top of the card, right-aligned, separated by a `1px solid var(--div)` line.

### Measured effect

| What | Before | After |
| --- | --- | --- |
| Table panel scrolls (1440 px) | no | yes |
| Whole page scrolls (1440 px) | yes | no |
| Header visible after a 400 px scroll (1440 px) | no, −242 px off screen | yes, 158 px from the top |
| Filter row overlapping the header | 23 px | 0 px |
| Header background | transparent | opaque |
| Horizontal overflow on a 390 px phone | 1621 px | 0 px |
| Selection column width | 63 px | 39 px |

## Poprawki responsywności pozostałych modułów

### Prosty Kreator Postaci (`Kalkulator/TworzeniePostaci.html`)

- `.wrapper`: `width: min(1100px, 100%)`. Zapis `96vw` odnosił się do szerokości ekranu, a nie do
  miejsca pozostałego po marginesie wewnętrznym `body`, więc na wąskim ekranie strona się rozjeżdżała;
- każda z trzech tabel (atrybuty, umiejętności, talenty) jest w `<div class="table-wrap">`
  z `overflow-x: auto` — ten sam układ, który działa w Zaawansowanym Kreatorze;
- punkt łamania `max-width: 760px`: `body` dostaje `padding: 12px 8px`, `.wrapper` `padding: 14px`,
  `.language-switcher` przechodzi z `position: absolute` na `static` i układa przyciski w wiersz nad
  tytułem, a tabele dostają `min-width` (atrybuty 560 px, umiejętności i talenty po 520 px).

Zmierzone: nadmiar szerokości strony **187 px przy 320 px ekranu, 147 px przy 360 px i 117 px przy
390 px spada do 0 px**. Pionowe nachodzenie bloku przycisków na tytuł: **96 px → 0 px**. Przy 768 px
i szerzej układ jest bez zmian.

### Kalkulator PD (`Kalkulator/KalkulatorXP.html`)

Poprawka dotyczy **tabeli maksymalnych wartości atrybutów**, a nie siatki `.calcGrid` — siatka
zostaje nietknięta.

- `.referenceTableWrap`: `overflow-x: auto`,
- `.referenceTable`: `min-width: 520px`,
- `.referenceTable thead th`: `overflow-wrap: anywhere`, `padding: 10px 4px`, `letter-spacing: .03em`.

Wąski padding i mniejszy odstęp między literami dają nagłówkom więcej miejsca w komórce o narzuconej
szerokości. Przy 1440 px sześć z ośmiu nazw atrybutów mieści się w jednym wierszu; `Wytrzymałość`
i `Inteligencja` nadal się zawijają, bo brakuje im około 14 px, ale żaden nagłówek nie wychodzi poza
swoją komórkę.

Zmierzone przepełnienie nagłówków (tekst szerszy od komórki): przy 360 px `Wytrzymałość`
i `Inteligencja` przekraczały komórkę o **82 px** przy dostępnych 33 px, a przy 1440 px o **4 px**.
Po zmianie **żaden nagłówek nie wychodzi poza swoją komórkę na żadnej z badanych szerokości**
(320, 360, 390, 768, 1440 px).

### Główne siatki przycisków — Main, menu Kalkulatora, DiceRoller, panel testowy Infoczytnika

`repeat(auto-fit, minmax(220px, 1fr))` zamienione na `repeat(auto-fit, minmax(min(220px, 100%), 1fr))`
(w panelu testowym Infoczytnika: 200 px).

Zmierzone przy 320 px: element siatki szerszy od pojemnika o **16 px → 0 px** (Main, menu
Kalkulatora, DiceRoller). **Od 360 px w górę zrzuty ekranu przed i po są identyczne co do bajtu**
przy 360, 390, 768, 1024 i 1440 px.

### Panel testowy Infoczytnika (`Infoczytnik/index.html`)

`.note code` dostaje `overflow-wrap: anywhere`. Adres strony to jeden ciąg bez spacji i był
największym pojedynczym źródłem nadmiaru w całej aplikacji.

Zmierzone: nadmiar szerokości strony **200 px przy 320 px, 160 px przy 360 px i 130 px przy 390 px
spada do 0 px**.

### Panel GM Infoczytnika (`Infoczytnik/GM_test.html`)

- `.col`: `min-width: min(280px, 100%)`,
- `.importRow`: dochodzi `flex-wrap: wrap`,
- `.pair`: `minmax(0, 1fr) minmax(0, 1fr)`.

Zmierzone przy 320 px: kolumna szersza od wiersza o **26 px → 0 px**. Przy 360 px i wyżej bez zmian.

### GeneratorNazw

- `.grid`: `minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr) 140px`,
- `.results`: dochodzi `overflow-wrap: anywhere`.

Zmierzone szerokości kolumn siatki przy 360, 390, 960, 1024, 1100 i 1440 px są identyczne przed
i po — obie reguły są zabezpieczeniem na wypadek dłuższej zawartości, a nie zmianą dzisiejszego układu.

### Dymek z opisem cechy — DataVault i GeneratorNPC

Poniżej 720 px dymek jest panelem wysuwanym od dolnej krawędzi: `left: 0; right: 0; bottom: 0`,
`width: 100%`, `max-height: 50dvh`, `border-radius: 12px 12px 0 0` oraz dolny margines wewnętrzny
powiększony o `env(safe-area-inset-bottom)`.

W GeneratorNPC dochodzi nagłówek dymka z przyciskiem zamknięcia (`.popover__header`,
`.popover__close`) — wcześniej dymka nie dało się zamknąć inaczej niż stuknięciem obok. Klawisz
Escape też go zamyka, tak jak w DataVault.

Zmierzone przy 390 px: wysokość dymka **77% → 50% wysokości ekranu** w GeneratorNPC i **51% → 46%**
w DataVault; w obu dymek przylega do dolnej krawędzi zamiast wisieć nad wierszem, którego dotyczy.
Przy 1440 px geometria dymka jest identyczna przed i po.

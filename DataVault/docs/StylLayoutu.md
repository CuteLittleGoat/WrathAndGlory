# Styl i layout — Administratum Data Vault

Dokument opisuje **1:1 zasady stylu i formatowania** dla modułu DataVault: fonty, kolory, formatowanie tekstu (w tym wyjątki), zachowanie zwijania/rozwijania oraz wymagania szerokości kolumn. Wszystko poniżej odpowiada dokładnie implementacji w `style.css` oraz `app.js`.

---

## 1) Fonty i typografia

### 1.1 Fonty ładowane z Google Fonts
- **Orbitron** (wagi 500 i 600) — używany w elementach nagłówkowych i przyciskach.
- **Share Tech Mono** — font bazowy dla większości tekstów.

### 1.2 Zasady użycia fontów
- **Tekst bazowy (`body`)**: `"Share Tech Mono", Calibri, monospace`.
- **Nagłówki i elementy akcentowane** (`.title`, `.panelHeader`, `.tab`, `.btn`, `.popoverTitle`, `.modalTitle`): `"Orbitron", "Share Tech Mono", Calibri, sans-serif`.
- **Wielkości tekstu**:
  - teksty w tabelach: `font-size: 13px` (`.dataTable`).
  - tagi cech: `font-size: 11px`.
  - opisy pomocnicze: `font-size: 11–12px`.
- **Układ liter**: większość elementów UI jest **uppercase** z podwyższonym `letter-spacing`.

---

## 2) Paleta kolorów i efekty

### 2.1 Zmienne CSS (źródło prawdy)
Wszystkie kolory są definiowane w `:root` w `style.css`:
- `--bg`: `#050607` (tło globalne).
- `--panel`: `#070A0B` (tła paneli).
- `--panel2`: `#0A0F0E` (tła modalu i popover).
- `--text`: `#6FE38C` (kolor podstawowy tekstu).
- `--text2`: `#4FB070` (tekst drugorzędny: hinty, opisy).
- `--muted`: `#2F6F4A` (tekst przygaszony).
- `--code`: `#CFF5DC` (wyróżnienia i „jaśniejsze” elementy).
- `--red`: `#d74b4b` (kolor ostrzeżeń/akcentów na czerwono).

### 2.2 Obwódki, cienie i tła pomocnicze
- `--b`: `rgba(111,227,140,.22)` — obwódki aktywne.
- `--b2`: `rgba(111,227,140,.12)` — delikatne obwódki.
- `--div`: `rgba(111,227,140,.10)` — linie podziału.
- `--hbg`: `rgba(111,227,140,.06)` — tła nagłówków.
- `--zebra`: `rgba(111,227,140,.03)` — naprzemienne wiersze.
- `--hover`: `rgba(111,227,140,.05)` — hover w tabeli.
- `--glow`: `0 0 6px rgba(111,227,140,.18)` — subtelny glow.
- `--glowH`: `0 0 10px rgba(111,227,140,.25)` — mocniejszy glow.

---

## 3) Zasady formatowania tekstu i wyjątki

### 3.1 Zwykły tekst i łamanie linii
- Komórki używają `.celltext`:
  - `white-space: pre-wrap` (zachowanie nowych linii z danych).
  - `line-height: 1.45`.
  - `word-break: normal` i `overflow-wrap: normal`.

### 3.2 Wyjątki i style inline (markery w danych)
Aplikacja obsługuje specjalne markery formatowania w danych (`app.js` → `formatInlineHTML`):
- `{{RED}}...{{/RED}}` → czerwony tekst (`.inline-red`, `color: var(--red)`).
- `{{B}}...{{/B}}` → pogrubienie (`.inline-bold`).
- `{{I}}...{{/I}}` → kursywa (`.inline-italic`).

### 3.3 Wyjątki na czerwony kolor (reguły logiczne)
- **Słowa kluczowe** mają kolor czerwony (`.keyword-red`):
  - Dotyczy kolumny `Słowa Kluczowe` w arkuszach: `Bestiariusz`, `Psionika`, `Augumentacje`, `Ekwipunek`, `Pancerze`, `Bronie`.
  - Dotyczy kolumny `Nazwa` w arkuszu `Slowa_Kluczowe`.
- **Ręczne markery** `{{RED}}` w danych wymuszają czerwony kolor niezależnie od kolumny.

### 3.4 Wyjątki na przecinki
- Dla arkuszy z listą słów kluczowych (`KEYWORD_SHEETS_COMMA_NEUTRAL`), przecinki w kolumnie `Słowa Kluczowe` są neutralne:
  - przecinki renderowane są jako `<span class="keyword-comma">,</span>`.
  - `.keyword-comma` ma kolor bazowy `var(--text)`, podczas gdy reszta tekstu w tej komórce pozostaje czerwona.

### 3.5 Wyjątki na `(str.)` / `(str)` / `(strona)`
- Fragmenty tekstu w nawiasach, które zawierają `str`, `str.`, lub `strona`, są automatycznie oznaczane klasą `.ref`.
- `.ref` ma jaśniejszy kolor (`var(--code)`), co wizualnie odróżnia referencje do stron.
- Reguła działa **nawet wewnątrz stylów inline** (`{{RED}}`, `{{B}}`, `{{I}}`).

### 3.6 Formatowanie wierszy specjalnych
- Linie zaczynające się od `*[n]` (np. `*[3]`) są wyróżniane klasą `.caretref` i jaśniejszym kolorem `var(--code)`.

### 3.7 Specjalne formatowanie kolumny `Zasięg`
- Wartości `Zasięg` są dzielone po `/` i składane na nowo.
- Separatory `/` są wyróżnione klasą `.slash` (jasny kolor `var(--code)`).

---

## 4) Zwijanie i rozwijanie treści (clamp > 9 linii)

Mechanizm działa **dwustopniowo**:

### 4.1 Wstępne wykrycie po liczbie linii danych
- Dla każdej komórki liczona jest liczba linii po `\n`.
- Jeśli jest **więcej niż 10 linii**, komórka jest traktowana jako potencjalnie „clampowalna”.
- W tym trybie:
  - renderowany jest skrót do **pierwszych 9 linii**,
  - na końcu dodawany jest hint „Kliknij aby rozwinąć”.

### 4.2 Weryfikacja po faktycznej wysokości (linijki wizualne)
Po renderze uruchamia się `ResizeObserver`, który:
- mierzy realną liczbę linii: `scrollHeight / lineHeight`;
- jeśli liczba linii **> 9**, to:
  - zawartość jest obcięta do `max-height = lineHeight * 9`,
  - `overflow` ustawiane jest na `hidden`,
  - dopinany jest `.clampHint` z tekstem:
    - „Kliknij aby rozwinąć” (domyślnie),
    - „Kliknij aby zwinąć” (po rozwinięciu).

### 4.3 Mechanika kliknięcia
- Kliknięcie w komórkę z klasą `.clampable` przełącza stan w `view.expandedCells`.
- Stan jest zapamiętywany per klucz: `sheet|rowid|col`.
- Po przełączeniu następuje **natychmiastowy re-render** treści dla tej komórki.

---

## 5) Wymagania szerokości kolumn (min-width)

Wszystkie wymogi szerokości kolumn są ustawiane w `style.css` przy pomocy selektorów:
`table[data-sheet="..."] th[data-col="..."]` i `td[data-col="..."]`.
Poniżej pełna lista **1:1**.

### 5.1 Archetypy
- `Nazwa`: **28ch**
- `Frakcja`: **24ch**
- `Poziom`: **6ch** (wycentrowane)
- `Podręcznik`: **14ch**
- `Strona`: **7ch** (wycentrowane)

### 5.2 Bestiariusz
- `Umiejętności`: **28ch**
- `Atak`: **50ch**
- `Premie`: **60ch**
- `Zdolności`: **60ch**
- `Zdolności Hordy`: **60ch**
- `Opcje Hordy`: **60ch**

### 5.3 Cechy / Stany / Slowa_Kluczowe
- `Nazwa`: **26ch**
- `Typ`: **14ch**
- `Opis`: **56ch**

### 5.4 Augumentacje / Ekwipunek
- `Nazwa`: **28ch**
- `Typ`: **16ch**
- `Dostępność`: **14ch**
- `Koszt`: **12ch**
- `Koszt IM`: **12ch**
- `Efekt`: **48ch**
- `Opis`: **48ch**
- `Słowa Kluczowe`: **28ch**

### 5.5 Psionika
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

### 5.6 Modlitwy
- `Nazwa`: **28ch**
- `Koszt PD`: **9ch** (wycentrowane)
- `Wymagania`: **26ch**
- `Efekt`: **54ch**

### 5.7 Talenty
- `Nazwa`: **28ch**
- `Koszt PD`: **9ch** (wycentrowane)
- `Wymagania`: **32ch**
- `Opis`: **36ch**
- `Efekt`: **46ch**

### 5.8 Bronie
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

### 5.9 Pancerze
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

---

## 6) Wymagania układu (layout)

- **Siatka główna**: `main` jest gridem z kolumnami `360px` (panel filtrów) i `1fr` (workspace).
- **Responsywność**: poniżej `980px` layout przechodzi na jedną kolumnę (panel nad tabelą).
- **Sticky nagłówki**: nagłówki tabeli są sticky (`position: sticky`) z offsetem drugiego wiersza `top: var(--header-row-height)`.

---

## 7) Stosowanie tych zasad w innych zakładkach

Jeżeli w przyszłości dodasz nową zakładkę lub kolumny, zasady są następujące:
1. **Najpierw zdefiniuj min-width** w `style.css` (sekcja „Column tweaks”).
2. **Dopasuj formatowanie danych** w `app.js` (np. wyjątki na czerwony kolor, przecinki, zakresy).
3. Upewnij się, że nowe kolumny respektują **reguły clampowania** (>9 linii).

Dokument jest **docelowym źródłem prawdy** dla wyglądu DataVault i powinien być aktualizowany przy każdej zmianie stylu, formatowania lub układu.

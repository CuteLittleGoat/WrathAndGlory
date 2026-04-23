# Analiza modułu Infoczytnik — panel GM (fonty frakcji)

## Prompt użytkownika (oryginał)

> Przeprowadź analizę modułu Infoczytnik.
>
> W panelu GM w polu wyboru fontu nazwa frakcji powinna być pisana takim fontem jaki jest do niej przypisany. Obecnie wygląda to tak jakby wszystkie nazwy były pisane tym samym fontem, tylko "6. Adeptus Ministorum" czasem się wyświetla jakby był większy niż pozostałe (załączam screen).
>
> Nowym działaniem oczekiwanym jest, żeby obok nazwy frakcji, po myślniku była nazwa użytego fontu. Nazwa użytego fontu ma być zapisana danym fontem.
> Przykładowo:
> 1. Adeptus Mechanicus - Share Tech Mono
> 2. Inquisition - Cinzel
> 3. Astra Militarum - Rajdhani
> 4. Administratum - IBM Plex Serif
> 5. Adeptus Arbites - Open Sans
> 6. Adeptus Ministorum - Noto Serif
> 7. Adepta Sororitas - DM Serif Display
> 8. Adeptus Astartes - IBM Plex Sans Condensed
> 9. Imperial Navy - Exo 2
> 10. Khorne - Black Ops One
> 11. Nurgle - Staatliches
> 12. Tzeentch - Orbitron
> 13. Slaanesh - Questrial
> 14. Chaos Undivided - Russo One
> 15. Pismo Odręczne - Caveat
> 16. Pismo Ozdobne - Great Vibes
>
> Część do znaku "-" ma być pisana zwykłym fontem a część po znaku "-" (czyli nazwa fontu) ma być pisana danym fontem.
>
> Dodatkowo sprawdź czy wszystkie fonty są prawidłowo przypisane. Przy wyborze niektórych w panelu GM na podglądzie wyświetla się domyślny font a nie ten, który miał być przypisany.
>
> Przeprowadź pełną analizę wprowadzenia takiego rozwiązania.

---

## Zakres analizy

Przeanalizowano:
- renderowanie listy fontów w `Infoczytnik/GM_test.html`,
- źródło mapowania fontów w `Infoczytnik/assets/data/data.json`,
- dostępność fontów (import Google Fonts) w `GM_test.html`, `Infoczytnik_test.html` i `Infoczytnik.html`.

## Stan obecny — ustalenia

### 1) Dane mapowania frakcja → font są poprawne

W `assets/data/data.json` mapowanie 1–16 odpowiada dokładnie liście oczekiwanej przez użytkownika (Adeptus Mechanicus → Share Tech Mono, …, Pismo Ozdobne → Great Vibes).

Wniosek: problem nie wynika z błędnej konfiguracji rekordów `fonts[]`, tylko z renderowania / ładowania krojów.

### 2) W select-cie font jest ustawiany na całej opcji

W `GM_test.html` funkcja `fillSelect(...)` ustawia dla `<option>`:
- `opt.textContent = "{id}. {name}"`
- `opt.style.fontFamily = ...` (gdy podany `styleFont`).

To znaczy: obecnie cała linia opcji jest jednym stylem, bez możliwości odrębnego formatowania fragmentu przed i po myślniku.

### 3) Wymaganie „część przed '-' zwykłym fontem, po '-' fontem docelowym” jest niewykonalne w natywnym `<select><option>`

Technicznie natywne `<option>` nie pozwala na bezpieczne, przenośne formatowanie tylko części tekstu (np. `<span>` z innym `font-family`) — tekst opcji jest renderowany przez kontrolkę systemową i stylowanie bywa mocno ograniczone oraz niespójne między przeglądarkami/OS.

Wniosek: aby spełnić wymaganie 1:1, trzeba przejść na **custom dropdown/listbox** (HTML+CSS+JS), a nie natywny `<select>`.

### 4) Część fontów nie jest importowana, dlatego podgląd wraca do fallback

W `GM_test.html`, `Infoczytnik_test.html` i `Infoczytnik.html` import Google Fonts obejmuje tylko:
- Share Tech Mono, Cinzel, Rajdhani,
- Black Ops One, Staatliches, Orbitron, Questrial, Russo One,
- Caveat, Great Vibes.

Brak importu dla:
- IBM Plex Serif,
- Open Sans,
- Noto Serif,
- DM Serif Display,
- IBM Plex Sans Condensed,
- Exo 2.

Skutek: dla rekordów 4, 5, 6, 7, 8, 9 przeglądarka używa fallback (np. Calibri/Arial/serif), co tłumaczy zgłoszenie, że „niektóre wybory pokazują domyślny font” także na podglądzie.

### 5) Dlaczego „6. Adeptus Ministorum” wygląda czasem na większy

`Adeptus Ministorum` mapuje do `Noto Serif`, ale ten font nie jest importowany. Browser przełącza się na fallback serif o innych metrykach (x-height/ascender/line box), przez co wizualnie opcja może wydawać się większa niż sąsiednie.

Dodatkowo renderowanie listy `<option>` jest natywne i różni się między platformami, więc efekt może być niestabilny („czasem”).

---

## Analiza wykonalności nowego rozwiązania

## Cel funkcjonalny

Wiersz na liście ma wyglądać jak:

`{id}. {Frakcja} - {Nazwa fontu}`

z regułą:
- fragment `id + frakcja + " - "` = font bazowy UI (np. Inter/Arial),
- fragment `{Nazwa fontu}` = `font-family` przypisany do pozycji.

## Wymagane zmiany architektoniczne

### A) Warstwa danych

- Obecny model danych jest wystarczający (`id`, `name`, `font`).
- Opcjonalnie można dodać pole pochodne (tylko runtime):
  - `displayLabelLeft = "{id}. {name} - "`
  - `displayLabelRight = "{font}"`

### B) Warstwa UI (kluczowa)

Zastąpić natywny `<select id="fontSelect">` komponentem custom:
- przycisk trigger (wybrana wartość),
- panel listy (`role="listbox"`),
- elementy opcji (`role="option"`) z dwoma `<span>`:
  - `<span class="font-left">{id}. {name} - </span>`
  - `<span class="font-right" style="font-family: ...">{font}</span>`

Rekomendacja kompatybilności:
- zachować ukryty natywny `<select>` jako „source of truth” dla obecnej logiki `getPayload`, `restoreDefaults`, listenerów,
- custom UI synchronizować dwukierunkowo z `el.fontSelect.value`.

### C) Ładowanie fontów

Należy rozszerzyć import Google Fonts we wszystkich trzech plikach runtime:
- `Infoczytnik/GM_test.html`
- `Infoczytnik/Infoczytnik_test.html`
- `Infoczytnik/Infoczytnik.html`

O brakujące rodziny:
- IBM Plex Serif
- Open Sans
- Noto Serif
- DM Serif Display
- IBM Plex Sans Condensed
- Exo 2

Bez tego nawet poprawny custom dropdown i podgląd będą pokazywać fallback.

### D) Dostępność (a11y)

Custom listbox musi obsłużyć:
- klawisze: `ArrowUp`, `ArrowDown`, `Enter`, `Escape`, `Home`, `End`,
- fokus i `aria-activedescendant`,
- zamknięcie po kliknięciu poza komponentem,
- właściwe oznaczenia `aria-expanded`, `aria-selected`.

---

## Weryfikacja „czy fonty są prawidłowo przypisane”

### Wynik

- **Przypisania w danych: poprawne (16/16).**
- **Wyświetlanie końcowe: częściowo niepoprawne** z powodu brakujących importów fontów.

### Lista rekordów wymagających doimportowania fontów

- 4 Administratum → IBM Plex Serif (brak importu)
- 5 Adeptus Arbites → Open Sans (brak importu)
- 6 Adeptus Ministorum → Noto Serif (brak importu)
- 7 Adepta Sororitas → DM Serif Display (brak importu)
- 8 Adeptus Astartes → IBM Plex Sans Condensed (brak importu)
- 9 Imperial Navy → Exo 2 (brak importu)

---

## Ryzyka i wpływ zmian

1. **Ryzyko UI:** custom dropdown jest bardziej złożony niż `<select>` (obsługa klawiatury, focus management).
2. **Ryzyko wydajności:** więcej rodzin fontów = większy payload CSS/font files (można ograniczyć wagi i style).
3. **Ryzyko regresji:** trzeba dopilnować pełnej synchronizacji z istniejącą logiką `restoreDefaults`, `renderPreview`, `getPayload`.
4. **Ryzyko wizualne:** różne metryki krojów; warto ustalić stałą wysokość wiersza listy i `line-height`.

---

## Rekomendowany plan wdrożenia

1. **Etap 1 (naprawa krytyczna):** doimportować brakujące fonty w 3 plikach HTML.
2. **Etap 2 (UI):** wdrożyć custom listbox tylko dla fontów, z dwuczęściowym renderowaniem etykiety.
3. **Etap 3 (integracja):** zachować kompatybilność z obecnym payloadem (`fontId`, `fontPreset`) i logiką preview.
4. **Etap 4 (testy):**
   - test ręczny 16 opcji (czy prawa część jest właściwym krojem),
   - test podglądu po wyborze każdej opcji,
   - test klawiatury i screen reader semantics,
   - test w Chromium + Firefox.

---

## Kryteria akceptacji (proponowane)

1. Lista fontów pokazuje tekst: `id. Frakcja - Nazwa fontu`.
2. Część po `-` ma font zgodny z `fonts[i].font`.
3. Część przed `-` ma stały font UI.
4. Podgląd wiadomości używa dokładnie tego samego fontu co wybrana pozycja.
5. Dla pozycji 1–16 nie występuje fallback (poza celowym fallbackiem awaryjnym przy braku sieci).

---

## Podsumowanie analizy

- Problem zgłoszony przez użytkownika został potwierdzony.
- Źródło problemu jest dwojakie:
  1) ograniczenia natywnego `<select>` (brak możliwości mieszanego stylowania w ramach jednej opcji),
  2) niepełny import wymaganych rodzin fontów.
- Wdrożenie oczekiwanego efektu 1:1 wymaga custom dropdown/listbox + uzupełnienia importów fontów.

---

## Aktualizacja analizy — 2026-04-23 (nowe wymaganie)

## Prompt użytkownika (uzupełnienie kontekstu)

> Przeczytaj i zaktualizuj analizę Analizy/2026-04-23_infoczytnik_analiza_fonty_panel_gm.md  
> Nic nie kasuj tylko dodaj nowe wymaganie.  
> Rezygnuję z wymagania dotyczącego, żeby na liście rozwijanej część nazwy była prezentowana specjalnym fontem.  
> Niech będzie format {id}. {Frakcja} - {Nazwa fontu}, ale wszystko standardowym fontem.  
> Zwracam uwagę, że zgodnie z Infoczytnik/AGENTS.md pkt.4 nie możesz zmieniać pliku Infoczytnik/Infoczytnik.html.  
> Wszystkie zmiany mają być na plikach "GM_test.html" oraz "Infoczytnik_test.html".  
> Należy też naprawić problem z wyświetlaniem fontów na podglądzie poprzez doimportowanie brakujących fontów.  
> DODATKOWO: Przy zmianie fontu przez menu rozwijane trzeba poczekać ok. 1-2sek aż na podglądzie się to zaktualizuje.  
> Czy można jakoś sprawić, że zmiana fontu na podglądzie będzie natychmiastowa?

### Zmiana wymagań funkcjonalnych (nadpisanie wcześniejszego celu UI)

1. **Lista rozwijana ma mieć etykietę tekstową wyłącznie w standardowym foncie UI**:
   - format: `{id}. {Frakcja} - {Nazwa fontu}`,
   - bez renderowania fragmentu `{Nazwa fontu}` dedykowanym krojem.
2. **Nie ma już wymagania na „mieszane fonty” w ramach pojedynczej opcji**.
3. W konsekwencji **natywny `<select>` jest wystarczający** dla listy (custom listbox nie jest już konieczny z powodów funkcjonalnych).

### Ograniczenie zakresu plików do modyfikacji

Zgodnie z doprecyzowaniem użytkownika i zasadą z `Infoczytnik/AGENTS.md`:
- **nie modyfikować** `Infoczytnik/Infoczytnik.html`,
- wykonywać zmiany wyłącznie w:
  - `Infoczytnik/GM_test.html`,
  - `Infoczytnik/Infoczytnik_test.html`.

### Nowe wymaganie techniczne — natychmiastowa aktualizacja podglądu fontu

Aktualne opóźnienie ~1–2 s po zmianie fontu wynika z „cold load” webfontu (font pobierany dopiero przy pierwszym użyciu na podglądzie).  
Wymaganie: **zmiana ma być odczuwalnie natychmiastowa**.

#### Rekomendowane rozwiązanie (bez zmiany architektury UI)

1. **Uzupełnić import o brakujące rodziny** (co najmniej w `GM_test.html` i `Infoczytnik_test.html`):
   - IBM Plex Serif,
   - Open Sans,
   - Noto Serif,
   - DM Serif Display,
   - IBM Plex Sans Condensed,
   - Exo 2.
2. **Wstępnie załadować fonty po starcie panelu GM**:
   - iteracja po `fonts[]`,
   - `document.fonts.load('16px "Nazwa Fontu"')` dla każdej rodziny,
   - opcjonalnie `await Promise.all(...)` przed pierwszą interakcją użytkownika.
3. **Natychmiastowy optyczny update podglądu**:
   - na `change` ustaw `fontFamily` od razu,
   - wymuś repaint/reflow (np. odczyt `offsetWidth` lub użycie `requestAnimationFrame`),
   - nie czekać na kolejne zdarzenia asynchroniczne, jeśli nie są wymagane.
4. **Dodatkowa optymalizacja ładowania**:
   - `rel="preconnect"` do `fonts.googleapis.com` i `fonts.gstatic.com`,
   - import tylko potrzebnych wag (bez nadmiarowych stylów),
   - w miarę możliwości `font-display: swap` (jeśli fonty będą hostowane lokalnie / przez `@font-face`).

### Zaktualizowane kryteria akceptacji

1. W dropdownie każda opcja ma format: `{id}. {Frakcja} - {Nazwa fontu}` i cały tekst jest w standardowym foncie UI.
2. Na podglądzie po wyborze opcji zastosowany jest właściwy font przypisany do frakcji.
3. Podgląd aktualizuje się natychmiast (bez odczuwalnego opóźnienia 1–2 s przy typowych warunkach sieciowych po inicjalnym preloadzie).
4. Zakres zmian kodu ogranicza się do `GM_test.html` oraz `Infoczytnik_test.html`.

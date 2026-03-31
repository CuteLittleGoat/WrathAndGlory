# Analiza planowanych zmian — `GM_test.html` (moduł Infoczytnik)

**Data analizy:** 2026-03-31  
**Zakres:** analiza techniczna bez zmian w kodzie  
**Moduł:** `Infoczytnik` (`GM_test.html`, `Infoczytnik_test.html`)

## Prompt użytkownika (zachowanie kontekstu)

> Przeprowadź analizę planowanych zmian GM_test.html w module Infoczytnik
> Wyniki zapisz w nowym pliku w Analizy/
>
> Rzeczy do poprawy:
>
> 1. Informacja "Flicker aktywny (opcjonalny)." pojawia się niezależnie od stanu checkboxa Flicker. Usuń tę informację.
> Zostaw jednak "Flicker wymaga włączonego prostokąta cienia." jeżeli checkbox "Prostokąt cienia" jest wyłączony.
>
> 2. Panel "Ilość linii fillerów" nie działa. Niezależnie od tego ile ustalę linii w panelu GM to Infoczytnik wyświetla tylko 3 linie fillerów (3x prefix + 3x suffix). Żeby zmieniła się ilość linii muszę zmienić zestaw fillerów w dropmenu.
>
> 3. Nie działa zmiana wielkości fontu zarówno fillerów jak i treści wiadomości
>
> 4. Nie działa zmiana fontu. Na podglądzie w panelu GM się wyświetla w innym foncie, ale na infoczytniku nie zmienia się.
>
> 5. Nie działa zmiana koloru fillerów przez naciśnięcie paska z wyborem koloru (Picker). Działa tylko przez ręczne wpisanie parametrów RGBA. To też będzie do zmiany. Nie chcę RGBA tylko HEX
>
> 6. Dodaj (do tekstu i fillerów) przyciski szybkiego wyboru kolorów: Zielony, Czerwony, Złoty i Biały.
> Wzór masz w Infoczytnik/GM_backup.html
>
> 7. Pasek zmiany kolorów (Picker) oraz pole do wpisania rgba ustaw obok siebie a nie jedno pod drugim.
> Zrób podobnie jak w Infoczytnik/GM_backup.html
> czyli:
>
> HEX	Picker
> Zielony, Czerwony, Złoty, Biały
> Wielkość fontu
>
> Taki sam układ dla fillerów i treści wiadomości.

---

## 1) Diagnoza stanu obecnego

### 1.1 Flicker — komunikat informacyjny
- W `syncFlickerDependency()` tekst hintu jest ustawiany na:
  - `"Flicker wymaga włączonego prostokąta cienia."` gdy `movingOverlay=false`,
  - `"Flicker aktywny (opcjonalny)."` w przeciwnym razie.
- Efekt: informacja o „aktywnym flickerze” pojawia się nawet jeśli sam checkbox `Flicker` jest odznaczony.

**Wniosek:** Twoja uwaga jest trafna — obecny komunikat myli stan funkcji z samą dostępnością opcji.

### 1.2 „Ilość linii fillerów” — dlaczego stale 3 linie
- `fillerLineCount` wpływa na liczbę linii wyłącznie w `rerollFillers()`.
- Zdarzenie zmiany pola `fillerLineCount` aktualnie wywołuje tylko `renderPreview()`, nie losuje ponownie tablic `fillerState.prefixLines/suffixLines`.
- Ponowne losowanie jest podpięte tylko pod:
  - zmianę `fillerSelect`,
  - przycisk „Wylosuj fillery”.

**Wniosek:** to dokładnie tłumaczy obserwację „zawsze 3 linie, dopóki nie zmienię zestawu”.

### 1.3 Rozmiar fontu wiadomości i fillerów — dlaczego brak efektu
- GM wysyła w payloadzie:
  - `msgFontSize: "20px"`,
  - `prefixFontSize: "12px"`, `suffixFontSize: "12px"`.
- Infoczytnik w `applyStyles()` robi `clamp(d.msgFontSize, ...)` i `clamp(d.prefixFontSize, ...)`, czyli oczekuje wartości liczbowej.
- `Number("20px")` daje `NaN`, więc `clamp(...)` wpada w wartości domyślne (20 i 12).

**Wniosek:** brak zmiany font-size wynika z niezgodności formatu danych (`px-string` vs `number`).

### 1.4 Zmiana fontu — preview działa, ekran Infoczytnika nie
- GM ładuje fonty przez Google Fonts (`<link ... family=...>`), więc podgląd w panelu działa.
- `Infoczytnik_test.html` nie ma analogicznego linku do Google Fonts.
- Infoczytnik ustawia `--font` na nazwę z payloadu, ale bez załadowania zasobu przeglądarka przechodzi na fallback.

**Wniosek:** problem nie jest w samym payloadzie, tylko w braku załadowania fontów po stronie wyświetlacza.

### 1.5 Picker koloru fillerów i przejście na HEX-only
- Obecnie pole `psColorText` domyślnie jest w `rgba(...)`, a `normalizeColor()` akceptuje dowolny string.
- Picker ustawia `psColorText` tylko przez event `input`; brak osobnego `change` może dawać problemy w części urządzeń/przeglądarek.
- Wymóg biznesowy: wycofać RGBA i zostać przy HEX.

**Wniosek:** należy uszczelnić walidację do `#RRGGBB` (+ opcjonalnie `#RGB`) i zsynchronizować picker na `input` oraz `change`.

---

## 2) Zakres zmian potrzebnych do wdrożenia

### 2.1 Punkt 1 (Flicker hint)
1. Usunąć stały tekst „Flicker aktywny (opcjonalny).”.
2. W stanie aktywnego `movingOverlay`:
   - pozostawić hint pusty **albo** ukryć element.
3. W stanie `movingOverlay=false`:
   - pokazywać tylko ostrzeżenie: „Flicker wymaga włączonego prostokąta cienia.”.

### 2.2 Punkt 2 (Ilość linii fillerów)
1. Podpiąć `rerollFillers()` pod zmianę `fillerLineCount` (event `input` i `change`).
2. Opcjonalnie: przy każdej zmianie `fillersEnabled` też przeliczać stan fillerów.
3. Utrzymać zasadę unikalności przez `.slice(0,count)` po przetasowaniu.

### 2.3 Punkt 3 (font-size)
Są 2 poprawne ścieżki; rekomendowana jest A:

**A (rekomendowana):**
- GM wysyła liczby (`msgFontSize`, `prefixFontSize`, `suffixFontSize`) bez sufiksu `px`.
- Infoczytnik bez zmian semantycznych konsumuje wartości liczbowe przez obecny `clamp`.

**B (alternatywa):**
- Infoczytnik parsuje stringi `px` (np. regexem).
- Mniej spójne, bo miesza formaty danych.

### 2.4 Punkt 4 (font family)
1. Dodać do `Infoczytnik_test.html` ten sam zestaw `<link rel="preconnect">` + `<link href="https://fonts.googleapis.com/...">` co w GM (lub ich podzbiór zgodny z manifestem).
2. Utrzymać fallback systemowy.
3. Sprawdzić, czy `fontPreset` w `data.json` odpowiada realnym family-name.

### 2.5 Punkt 5 (HEX zamiast RGBA + sprawny picker)
1. Zmienić domyślne wartości pól kolorów na HEX (`#RRGGBB`).
2. Dodać walidator HEX (na wejściu i przed wysyłką payloadu).
3. Zmienić hinty UI z „rgba” na „HEX”.
4. Eventy pickera: obsłużyć zarówno `input`, jak i `change`.

### 2.6 Punkt 6 (szybkie kolory)
1. Dodać chipsy/przyciski jak w `GM_backup.html` dla **obu** sekcji:
   - treść wiadomości,
   - prefix/suffix.
2. Kolory:
   - Zielony `#00ff66`
   - Czerwony `#ff3333`
   - Złoty `#d4af37`
   - Biały `#ffffff`
3. Kliknięcie chipa powinno aktualizować:
   - pole text HEX,
   - picker,
   - live preview.

### 2.7 Punkt 7 (układ sekcji kolorów)
Dla obu bloków („treść” i „fillery”) docelowo:
1. rząd: `HEX | Picker` (obok siebie),
2. rząd: przyciski szybkich kolorów,
3. rząd: pole „Wielkość fontu”.

Układ wzorować na `GM_backup.html` (spójność UX).

---

## 3) Spójność danych GM ↔ Infoczytnik (kontrakt payloadu)

Aby uniknąć podobnych regresji:

1. Ustalić stały kontrakt typu:
   - `msgFontSize`, `prefixFontSize`, `suffixFontSize` → **number**,
   - `messageColor`, `prefixColor`, `suffixColor` → **HEX string**.
2. Dodać lekką normalizację wejścia po obu stronach (GM i Infoczytnik) zamiast „dowolnego stringu”.
3. Utrzymać kompatybilność wsteczną na czas migracji (np. przez parser `"20px" -> 20`), ale docelowo trzymać jeden format.

---

## 4) Proponowany test plan po wdrożeniu (manualny)

1. **Flicker hint**
   - wyłącz `Prostokąt cienia` → pokazuje ostrzeżenie,
   - włącz `Prostokąt cienia` → brak tekstu „aktywny (opcjonalny)”.
2. **Liczba linii fillerów**
   - ustaw 1..5 bez zmiany zestawu → na ekranie dokładnie tyle linii prefix/suffix.
3. **Font size**
   - zmień rozmiar treści i fillerów, wyślij kilka wiadomości → natychmiastowy efekt na Infoczytniku.
4. **Font family**
   - przełącz 3–4 różne fonty z listy i porównaj z preview GM.
5. **Kolory HEX**
   - wybór z pickera i wpis ręczny HEX mają dawać identyczny efekt,
   - niepoprawne wartości nie powinny być wysyłane (fallback lub blokada).
6. **Szybkie przyciski kolorów**
   - każdy chip aktualizuje oba kontrolki i podgląd.
7. **Layout panelu**
   - w obu sekcjach kolejność: `HEX + Picker` → `przyciski` → `font size`.

---

## 5) Ryzyka i uwagi

1. Po przejściu na HEX-only stare dokumenty Firestore z `rgba(...)` mogą wymagać fallbacku odczytu (okres przejściowy).
2. Dodatkowe ładowanie fontów w Infoczytniku zwiększy liczbę requestów przy starcie (akceptowalne, ale warto cache’ować).
3. Po zmianie kontraktu payloadu warto jednocześnie zaktualizować oba pliki testowe, żeby nie rozjechać wersji funkcjonalnych.

---

## 6) Podsumowanie priorytetów implementacji

**Krytyczne (najpierw):**
1. Naprawa kontraktu font-size (number zamiast `px-string`).
2. Naprawa `fillerLineCount` (reroll na zmianę liczby).
3. Doładowanie fontów po stronie `Infoczytnik_test.html`.

**Następnie UX/UI:**
4. Flicker hint — usunięcie błędnego komunikatu.
5. HEX-only + stabilny picker (`input` + `change`).
6. Szybkie kolory i układ sekcji wg `GM_backup.html`.


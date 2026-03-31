# Analiza problemu: picker koloru przestaje działać dla `#ffffff`

Data: 2026-03-31
Moduł: `Infoczytnik`
Zakres analizy: `Infoczytnik/GM_test.html`

## Prompt użytkownika (oryginał)
> Przeprowadziłem testy i znalazłem kolejny błąd. Nie wprowadzaj dalszych zmian w kodzie. Przygotuj plik z analizą problemu i zapisz go w Analizy/
>
> Jest problem z białym kolorem #ffffff
> Jeżeli ten kolor jest wybrany to nie działa ten przycisk do zmiany koloru. Jeżeli jest wybrany inny (np. zielony poprzez przycisk). to panel wyboru koloru działa prawidłowo.
> Treść wiadomości domyślnie była zielona a fillery białe. Dlatego nie było widać na pierwszy rzut oka błędu w części dla wyboru tekstu. Teraz jak poprzez przycisk wybrałem biały kolor treści wiadomości to Picker (tak się to nazywa?) przestał działać. Nie sprawdzałem wszystkich innych kolorów.
>
> Sprawdź kod modułu i poszukaj przyczyny błędu.

---

## Co sprawdziłem w kodzie
Przeanalizowane elementy:
- `normalizeHexColor(v, fallback)`
- `isFullHexColor(v)`
- `resolveHexColor(textValue, pickerValue, fallback)`
- `renderPreview()`
- handlery:
  - `messageColorPicker` (`input`/`change`)
  - `psColorPicker` (`input`/`change`)
  - `messageColorText` (`blur`)
  - `psColorText` (`blur`)

## Najbardziej prawdopodobna przyczyna

### 1) Źródło prawdy koloru jest „warunkowe” i zależy od pola tekstowego
Aktualnie `resolveHexColor(...)` działa tak:
- jeśli `textValue` jest pełnym HEX (`#RGB` / `#RRGGBB`) → bierze **textValue**,
- w przeciwnym razie → bierze `pickerValue`.

To oznacza, że gdy pole tekstowe ma poprawne `#ffffff`, system uznaje je za nadrzędne nad pickerem.

### 2) Zależność od zdarzeń `input/change` z natywnego pickera
Aby picker realnie „przejął” kontrolę, handler pickera musi najpierw przepisać `picker.value` do pola tekstowego.
Jeżeli w danym środowisku/budowie przeglądarki natywne okno wyboru koloru:
- nie emituje `input` podczas przeciągania,
- i/lub emituje `change` dopiero w specyficznym momencie,

to przez większość interakcji `textValue` zostaje `#ffffff`, a `renderPreview()` dalej wybiera biały jako źródło prawdy.

Efekt z perspektywy użytkownika:
- „picker nie działa”,
- szczególnie widoczne dla stanu startowego białego (`#ffffff`), bo tekst jest poprawny i stale wygrywa w `resolveHexColor`.

### 3) Dlaczego dla innych kolorów może wydawać się, że działa
Jeśli wcześniej kolor zostanie zmieniony chipem/HEX-em, zmienia się sekwencja zdarzeń i użytkownik trafia w ścieżkę, gdzie wartość tekstowa zostaje nadpisana pickerem (lub zmiana jest lepiej widoczna w podglądzie). W praktyce maskuje to błąd zależności od kolejności eventów i priorytetu `textValue`.

---

## Wniosek techniczny
Problem nie wygląda na błąd samego formatu `#ffffff`, tylko na **logikę synchronizacji dwóch źródeł wartości (text + picker)** oraz **zależność od niestabilnych eventów natywnego dialogu koloru**.

Biel jest po prostu najbardziej „wrażliwym” przypadkiem startowym, bo:
- jest domyślna dla Prefix/Suffix,
- jest poprawnym pełnym HEX, więc stale ma priorytet,
- łatwo sprawia wrażenie, że picker „utknął”.

---

## Rekomendowany kierunek poprawki (bez wdrażania w tym kroku)
1. Wprowadzić jawny „aktywny kanał edycji” (ostatnio zmieniał użytkownik: text czy picker) i to nim sterować priorytetem.
2. Albo trzymać pojedynczy stan koloru (`stateColor`) niezależny od inputów, a pola tylko synchronizować z tym stanem.
3. W `renderPreview()` nie ustalać koloru na podstawie samego `textValue` bez kontekstu ostatniego zdarzenia.
4. Dodać diagnostykę eventów dla `type=color` (czy i kiedy w danej przeglądarce lecą `input`/`change`).

---

## Podsumowanie
Najbardziej prawdopodobna przyczyna: konflikt priorytetu `textValue` (`#ffffff`) vs `pickerValue` i zależność od tego, czy natywny picker wyemituje zdarzenie w oczekiwanym momencie. To daje objaw „picker działa pośrednio / dopiero po innych akcjach”, który użytkownik zaobserwował.

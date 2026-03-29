# Analiza modułu Infoczytnik — stały prostokąt (nieprzesuwający się przy scrollu) i zawsze widoczny po zaznaczeniu checkboxa

Data: 2026-03-29  
Moduł: `Infoczytnik`

## Prompt użytkownika
> Przeczytaj analizy:\nAnalizy/2026-03-28_analiza_infoczytnik_prostokat_z_cieniem.md\nAnalizy/2026-03-28_analiza_infoczytnik_scrollujacy_prostokat_checkbox_i_rename_layoutow.md\n\nChciałbym żeby ten prostokąt zachowywał się inaczej.\nChcę, żeby ten prostokąt był zawsze w tym samym miejscu.\nChcę, żeby jak użytkownik będzie scrollować tekst, to prostokąt nie będzie zmieniać swojej pozycji.\nChcę, żeby (jeżeli jest zaznaczony checkbox) to ten prostokąt będzie zawsze widoczny.\n\nObecnie wygląda tak, że prostokąt jest tylko w pierwszych liniach tekstu.\nJak przesuwam tekst to prostokąt przesuwa się w górę ekranu.\n\nPrzeprowadź pełną analizę tego rozwiązania. Zapisz co należy zmienić w kodzie, aby osiągnąć taki efekt.

---

## 1) Wniosek główny (krótko)
Aktualna implementacja w `Infoczytnik_test.html` realizuje „prostokąt cienia” jako pseudo-element **wewnątrz przewijanej treści** (`.contentLayer.with-overlay::before`).
Dlatego prostokąt przesuwa się razem z treścią i po przewinięciu znika z pola widzenia (zostaje „u góry dokumentu”).

Aby osiągnąć wymagany efekt, prostokąt trzeba renderować jako warstwę przypiętą do viewportu czytnika (`.screen`), a nie do treści (`.contentLayer`).

---

## 2) Diagnoza obecnego stanu (dlaczego dzieje się to, co na screenach)

### 2.1 Aktualna warstwa overlay jest przypięta do treści
Obecnie:
- `.screen` ma `overflow:auto` (to kontener scrolla).
- `.contentLayer` jest dzieckiem `.screen` i zawiera tekst.
- overlay jest rysowany przez `.contentLayer.with-overlay::before`.

Skutek:
- overlay jest częścią przewijanego dokumentu,
- więc przy scrollowaniu przesuwa się razem z treścią,
- wrażenie użytkownika: „prostokąt jest tylko na początku tekstu”.

### 2.2 Checkbox już steruje widocznością, ale dla złej warstwy
W JS:
- `setOverlayState()` przełącza klasę `with-overlay` na `contentLayer`.
- To poprawnie włącza/wyłącza efekt, ale ponieważ efekt jest na warstwie treści, nie spełnia nowego wymagania „zawsze w tym samym miejscu”.

### 2.3 Flicker jest zależny od overlay
Flicker jest przypięty do tej samej pseudo-warstwy co prostokąt. Logika `no-flicker` działa poprawnie koncepcyjnie, ale też na warstwie treści.

---

## 3) Docelowe zachowanie (zgodnie z nowym wymaganiem)

1. Prostokąt cienia jest **stały względem okna czytnika** (nie zmienia pozycji przy scrollu).
2. Jeśli checkbox „Prostokąt cienia” jest zaznaczony, prostokąt jest **zawsze widoczny**.
3. Jeśli checkbox odznaczony — prostokąt jest ukryty.
4. Flicker działa tylko wtedy, gdy prostokąt jest widoczny (jak obecnie logicznie), ale animuje warstwę stałą.
5. Dla layoutów restricted (`pismo_odreczne`, `pismo_ozdobne`) pozostaje: overlay i flicker wyłączone + kontrolki zablokowane.

---

## 4) Co dokładnie zmienić w kodzie

## 4.1 `Infoczytnik/Infoczytnik_test.html` — CSS

### A) Przenieść overlay z `.contentLayer` na `.screen`
**Teraz (do usunięcia/zastąpienia):**
- `.contentLayer.with-overlay::before` (sekcja CSS ok. linii 141–152)
- `.screen.no-flicker .contentLayer.with-overlay::before` (ok. 154–156)

**Docelowo:**
- nowy selektor: `.screen.with-overlay::after` (lub `::before`)
- pozycjonowanie absolutne względem `.screen` (`position:absolute; inset:-2%`)
- `pointer-events:none`
- ten sam gradient + opacity
- `animation: flickerBg 9s infinite`
- `z-index` tak, żeby warstwa była nad tłem, ale pod tekstem

### B) Ustawić kontekst pozycjonowania i warstw
- `.screen` powinien mieć `position:relative` (aktualnie nie ma jawnie).
- Tekst musi pozostać nad overlayem (`.contentLayer` i dzieci z wyższym `z-index`, albo overlay z niższym, zależnie od przyjętego układu).

### C) Usunąć/uprościć reguły zależne od `.contentLayer.with-overlay`
Po migracji overlayu do `.screen` klasa `with-overlay` na `contentLayer` jest zbędna.

---

## 4.2 `Infoczytnik/Infoczytnik_test.html` — JS

### A) Zmienić miejsce przełączania klasy overlay
W `setOverlayState(shouldShowOverlay, shouldFlicker)`:
- **zamiast** `el.contentLayer.classList.toggle("with-overlay", ...)`
- przełączać klasę na `el.screen`, np. `el.screen.classList.toggle("with-overlay", shouldShowOverlay === true)`.

### B) Logika flickera zostaje, ale na warstwie `.screen`
Obecna logika:
- gdy `shouldFlicker === false` lub `shouldShowOverlay === false` => `no-flicker`.
To jest poprawne i można ją zostawić, zmieniając tylko CSS target.

### C) Odczyt flag z Firestore można zostawić
Ten fragment jest już zgodny z wymaganiem checkbox + restricted:
- `movingOverlay = restricted ? false : (d.movingOverlay !== false)`
- `flicker = movingOverlay ? (...) : false`
Nie wymaga zmiany funkcjonalnej.

---

## 4.3 `Infoczytnik/GM_test.html`
W tym pliku logika jest już zgodna z Twoim celem:
- checkbox `movingOverlay` istnieje i domyślnie jest zaznaczony,
- odznaczenie `movingOverlay` automatycznie odznacza `flicker`,
- w restricted layoutach oba są wymuszone na `false` i `disabled`,
- wartości zapisują się do `dataslate/current`.

Wniosek: **tu nie trzeba zmiany logiki**, ewentualnie tylko kosmetyczna zmiana etykiety (np. z „Prostokąt cienia” na „Stały prostokąt cienia”), jeśli chcesz doprecyzować UX.

---

## 5) Tabela zmian „Plik / Linia / Jak jest / Jak powinno być”

| Plik | Linia(e) (obecnie) | Jak jest | Jak powinno być |
|---|---:|---|---|
| `Infoczytnik/Infoczytnik_test.html` | 141–152 | `.contentLayer.with-overlay::before` rysuje prostokąt i flicker na warstwie przewijanej treści | Usunąć ten wariant i dodać `.screen.with-overlay::after` (warstwa stała względem okna czytnika) |
| `Infoczytnik/Infoczytnik_test.html` | 154–156 | `.screen.no-flicker .contentLayer.with-overlay::before { animation:none; }` | Zmienić na `.screen.no-flicker::after` lub `.screen.no-flicker.with-overlay::after { animation:none; }` |
| `Infoczytnik/Infoczytnik_test.html` | 119–132 | `.screen` nie ma jawnego `position:relative` | Dodać `position:relative`, aby pseudo-element był kotwiczony do `.screen` |
| `Infoczytnik/Infoczytnik_test.html` | 409–416 | `setOverlayState()` przełącza `with-overlay` na `contentLayer` | Przełączać `with-overlay` na `screen`; `no-flicker` zostawić na `screen` |
| `Infoczytnik/Infoczytnik_test.html` | 237 | `contentLayer with-overlay` ustawione domyślnie w HTML | Usunąć `with-overlay` z `contentLayer` (klasa niepotrzebna po migracji) |
| `Infoczytnik/Infoczytnik_test.html` | 543–547 | Odczyt `movingOverlay`/`flicker` i `setOverlayState()` | Bez zmian funkcjonalnych; tylko nowy CSS target w `setOverlayState()` |
| `Infoczytnik/GM_test.html` | 214–215, 792–799, 649–651, 711–713 | Checkbox + wymuszanie wyłączenia flickera już wdrożone | Bez zmian funkcjonalnych (opcjonalnie doprecyzowanie labelki) |

---

## 6) Dlaczego to rozwiąże problem użytkownika
Po przeniesieniu overlayu na pseudo-element `.screen`:
- scrolluje się tylko treść (`.contentLayer`),
- overlay pozostaje przypięty do viewportu (`.screen`),
- więc prostokąt jest stale w tym samym miejscu,
- i jeśli checkbox jest zaznaczony, jest widoczny przez cały czas (nie znika po przewinięciu).

To dokładnie odpowiada zgłoszonemu objawowi i oczekiwanemu efektowi.

---

## 7) Ryzyka i testy po wdrożeniu

### Ryzyka
1. Z-index: overlay może przykryć tekst, jeśli warstwy nie będą poprawnie ustawione.
2. `position:relative` na `.screen` jest krytyczne dla poprawnego kotwiczenia pseudo-elementu.
3. W pergaminach restricted trzeba sprawdzić, że overlay nie pojawia się mimo danych wejściowych wymuszonych ręcznie.

### Minimalny zestaw testów
1. Długi tekst + `movingOverlay=true`: przewijanie nie porusza prostokąta.
2. Długi tekst + `movingOverlay=false`: prostokąt nie renderuje się wcale.
3. `movingOverlay=false` + próba zaznaczenia flicker: flicker ma pozostać wyłączony.
4. Layout `pismo_odreczne`/`pismo_ozdobne`: oba checkboxy disabled i overlay niewidoczny.
5. Krótki tekst: brak regresji (układ i logo pozostają poprawne).

---

## 8) Podsumowanie końcowe
Problem wynika z tego, że „prostokąt” został wcześniej celowo przeniesiony na warstwę przewijaną (`contentLayer`), co teraz jest sprzeczne z nowym wymaganiem UX.

Najmniejsza i najbezpieczniejsza zmiana:
- przywrócić render overlayu jako warstwy kotwiczonej do `.screen`,
- zostawić obecny checkbox `movingOverlay` jako przełącznik widoczności,
- zostawić obecną logikę zależności `movingOverlay -> flicker` i restricted layout.

To daje dokładnie efekt: prostokąt jest stały podczas scrolla i zawsze widoczny, kiedy checkbox jest zaznaczony.

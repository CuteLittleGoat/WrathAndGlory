# Data analizy
2026-05-13

# Temat analizy
Poprawa układu okna wpisywania hasła („Litania Dostępu”) w dwóch modułach: `DataVault` i `GeneratorNPC`.

# Oryginalny pełny prompt użytkownika
Przeprowadź analizę poprawy okna do wpisywania hasła. Okno występuje w dwóch modułach. Chciałbym, żeby między tekst "Litania Dostępu" był wyrównany do lewej. Pole do wpisania hasła ma być wyrównane do prawej. W ten sposób będzie wizualnie przerwa między tymi polami. Przycisk do zatwierdzenia ma być pod polem do wpisania hasła z prawej strony.

# Zakres analizy
- Identyfikacja miejsc, w których występuje wspólne okno hasła.
- Sprawdzenie, czy oba moduły używają wspólnego stylu i tej samej struktury HTML.
- Ocena, jak wdrożyć układ:
  - etykieta „Litania Dostępu” po lewej,
  - pole hasła po prawej,
  - przycisk zatwierdzenia pod polem, po prawej.
- Ocena wpływu na responsywność i spójność między modułami.

# Ustalenia
## 1) Moduły i pliki objęte zmianą
Okno hasła występuje w:
- `DataVault/index.html`
- `GeneratorNPC/index.html`

W obu miejscach używany jest ten sam fragment struktury formularza:
- `<form id="accessForm">`
- `<label class="field">`
- `<span data-i18n="accessPasswordLabel">Litania Dostępu</span>`
- `<input id="accessPassword" ...>`
- `<button class="btn primary" ...>`

## 2) Wspólne źródło stylowania
Oba moduły opierają wygląd overlayu na pliku:
- `shared/access-gate.css`

To najważniejszy punkt: zmiana CSS w tym pliku może jednocześnie poprawić oba moduły, bez duplikowania poprawek.

## 3) Problem obecnego układu
Aktualny HTML ustawia etykietę i pole hasła jako elementy wewnątrz jednego `label.field`, a przycisk jest obok (w tym samym rzędzie wizualnym przy domyślnym flow/stylach globalnych modułu). Efekt nie zapewnia czytelnego rozdzielenia „lewa/prawa” ani umieszczenia przycisku pod inputem po prawej.

## 4) Zalecany docelowy układ
Najstabilniejsze rozwiązanie:
- Dodać osobny kontener layoutu dla sekcji logowania (np. `.accessGate__credentials`).
- W nim utworzyć siatkę 2-kolumnową:
  - kolumna lewa: etykieta (wyrównanie do lewej),
  - kolumna prawa: input (wyrównanie do prawej, pełna szerokość kolumny).
- Przycisk umieścić w drugim wierszu, prawej kolumnie (pod inputem).

Przykładowe rozmieszczenie logiczne (bez pełnego wdrożenia kodu):
- wiersz 1, kolumna 1: „Litania Dostępu”
- wiersz 1, kolumna 2: pole hasła
- wiersz 2, kolumna 2: przycisk „Rozpocznij Rytuał”

## 5) Responsywność
Dla szerokości mobilnych należy przewidzieć breakpoint (np. ~640px):
- przejście do układu jednokolumnowego,
- etykieta nad polem,
- przycisk pod polem, nadal wyrównany do prawej lub rozciągnięty (decyzja UX).

Bez takiego breakpointu na małym ekranie prawa kolumna może stać się zbyt wąska.

## 6) Wpływ na logikę JS
Zmiana dotyczy wyłącznie warstwy HTML/CSS, o ile zachowane pozostaną identyfikatory:
- `#accessForm`
- `#accessPassword`
- `#accessError`

Obecna logika autoryzacji w `DataVault/app.js` i `GeneratorNPC/index.html` nie wymaga modyfikacji przy zachowaniu powyższych selektorów.

# Rekomendacje
1. Wdrożyć poprawkę centralnie przez `shared/access-gate.css`, aby zachować 1 źródło prawdy dla dwóch modułów.
2. W obu plikach HTML (`DataVault/index.html`, `GeneratorNPC/index.html`) dodać minimalny kontener układu dla etykiety/inputu/przycisku, zamiast polegać na przypadkowym flow.
3. Dodać regułę responsive (mobile fallback).
4. Po wdrożeniu ręcznie sprawdzić oba moduły:
   - desktop: lewa etykieta + prawa kolumna input/przycisk,
   - mobile: czytelny pionowy układ,
   - brak regresji overlayu i komunikatów błędu.

# Ryzyka
- Nadpisanie globalnej klasy `.field` używanej gdzie indziej może wywołać efekty uboczne.
- Jeśli w `GeneratorNPC/index.html` istnieje więcej niż jedna kopia markupu bramki (plik zawiera sekcje duplikowane), poprawka musi objąć wszystkie aktywne warianty renderowane przez runtime.
- Przy zbyt agresywnym `width` inputu mogą pojawić się overflowy na bardzo wąskich ekranach.

# Następne kroki
- Krok 1: Potwierdzić preferencję mobilną (przycisk po prawej vs. pełna szerokość).
- Krok 2: Wdrożyć HTML/CSS w obu modułach + `shared/access-gate.css`.
- Krok 3: Zaktualizować dokumentacje modułów (`docs/README.md`, `docs/Documentation.md`) zgodnie z zasadami repo.
- Krok 4: Wykonać test wizualny obu modułów i potwierdzić identyczny efekt.

## Zmiany wykonane w kodzie

### Plik: `DataVault/index.html`
Lokalizacja: sekcja `#accessGate` → `#accessForm`

Było:
```html
<form id="accessForm"><label class="field"><span data-i18n="accessPasswordLabel">Litania Dostępu</span><input id="accessPassword" type="password" autocomplete="current-password"></label><button class="btn primary" type="submit" data-i18n="accessUnlockButton">Rozpocznij Rytuał</button></form>
```

Jest:
```html
<form id="accessForm"><div class="accessGate__credentials"><label class="field accessGate__label" for="accessPassword"><span data-i18n="accessPasswordLabel">Litania Dostępu</span></label><input id="accessPassword" class="accessGate__password" type="password" autocomplete="current-password"><button class="btn primary accessGate__submit" type="submit" data-i18n="accessUnlockButton">Rozpocznij Rytuał</button></div></form>
```

### Plik: `GeneratorNPC/index.html`
Lokalizacja: sekcja `#accessGate` → `#accessForm` (oba wystąpienia markupu w pliku)

Było:
```html
<form id="accessForm"><label class="field"><span data-i18n="accessPasswordLabel">Litania Dostępu</span><input id="accessPassword" type="password" autocomplete="current-password"></label><button class="btn primary" type="submit" data-i18n="accessUnlockButton">Rozpocznij Rytuał</button></form>
```

Jest:
```html
<form id="accessForm"><div class="accessGate__credentials"><label class="field accessGate__label" for="accessPassword"><span data-i18n="accessPasswordLabel">Litania Dostępu</span></label><input id="accessPassword" class="accessGate__password" type="password" autocomplete="current-password"><button class="btn primary accessGate__submit" type="submit" data-i18n="accessUnlockButton">Rozpocznij Rytuał</button></div></form>
```

### Plik: `shared/access-gate.css`
Lokalizacja: nowe reguły `.accessGate__credentials`, `.accessGate__label`, `.accessGate__password`, `.accessGate__submit` + media query `@media (max-width:640px)`

Było:
```css
Brak dedykowanego układu 2-kolumnowego dla etykiety/pola/przycisku.
```

Jest:
```css
Dodany układ CSS Grid wymuszający: etykieta po lewej, pole po prawej, przycisk pod polem po prawej oraz fallback mobilny.
```

# Analiza: dodanie przycisku powrotu do `Main/index.html`

## Prompt użytkownika

> „Przeprowadź analizę i zapisz jej wyniki. Chciałbym w stronach:
> DataVault/index.html
> Kalkulator/KalkulatorXP.html
> Kalkulator/TworzeniePostaci.html
> DiceRoller/index.html
> dodać przycisk przenoszący do strony Main/index.html (w widoku użytkownika a nie admina).
> Przeprowadź pełną analizę kodu aplikacji. Zaproponuj rozwiązania.
> Zadbaj o to, żeby przycisk był stylistycznie zgodny z resztą aplikacji.”

## Zakres analizy

Przeanalizowano:
- strukturę HTML i istniejące strefy akcji (`topbar`, `language-switcher`, przyciski funkcjonalne),
- sposób internacjonalizacji (PL/EN) i miejsca, gdzie trzeba dodać etykietę nowego przycisku,
- wspólne zasady stylu (paleta, fonty, klasy `.btn`, hover/focus),
- logikę „admin vs user” w DataVault.

Pliki sprawdzone:
- `DataVault/index.html`
- `DataVault/style.css`
- `DataVault/app.js`
- `Kalkulator/KalkulatorXP.html`
- `Kalkulator/kalkulatorxp.css`
- `Kalkulator/TworzeniePostaci.html`
- `DiceRoller/index.html`
- `DiceRoller/style.css`
- `DiceRoller/script.js`

## Wnioski z analizy architektury

### 1) DataVault (ma wyraźny podział admin/user)

- Tryb admin jest rozpoznawany przez query param `?admin=1` (`ADMIN_MODE` w `DataVault/app.js`).
- W interfejsie istnieje wspólna sekcja akcji (`.actions`) i klasy przycisków (`.btn`, `.btn.secondary`).
- To najlepsze miejsce na dodanie przycisku „Powrót do Main” dla usera.

**Implikacja:**
- przycisk powinien być **widoczny tylko gdy `ADMIN_MODE === false`**,
- w adminie może być ukryty (np. `display:none`) lub w ogóle niewstrzykiwany,
- etykieta przycisku powinna wejść do `translations` (PL/EN), aby był zgodny z obecnym i18n.

### 2) KalkulatorXP (spójny layout topbar/actions)

- Strona używa `kalkulatorxp.css`, ma gotową sekcję `.actions` z `language-switcher` i `#btnReset`.
- Istnieją gotowe style przycisku (`.btn.secondary`) pasujące do estetyki modułu.
- Tłumaczenia są inline (obiekt `translations` w HTML), więc nowy label powinien zostać dodany tam.

**Implikacja:**
- najniższe ryzyko: dodać `<a class="btn secondary" ...>` albo `<button class="btn secondary" ...>` obok resetu,
- dla `<button>` potrzebny listener `window.location.href = '../Main/index.html'`,
- dla `<a>` wystarczy `href`, ale trzeba pamiętać o stylu linku jak button (np. `text-decoration:none; display:inline-flex; align-items:center;`).

### 3) TworzeniePostaci (odmienna struktura: `wrapper + language-switcher`)

- Brak `topbar`; akcje są w prawym górnym rogu w `.language-switcher`.
- Już istnieje tam dodatkowy przycisk `#manualButton` (obok selecta), więc UX-owo to naturalne miejsce.
- Tłumaczenia są bardzo szczegółowe i obejmują etykiety przycisków (`manualButton`).

**Implikacja:**
- dodać drugi przycisk (np. `#backToMainButton`) bez zmiany układu całej strony,
- rozszerzyć `translations.pl.labels` i `translations.en.labels` o `backToMainButton`,
- w `updateLanguage()` podmieniać jego tekst analogicznie do `manualButton`.

### 4) DiceRoller (oddzielny system klas, bez `.btn`)

- W module jest własny styl przycisków (`.roll`) oraz pozycjonowany `.language-switcher`.
- Dla spójności modułu lepiej **nie kopiować bezpośrednio** klas `.btn` z innych modułów,
  tylko użyć stylu lokalnego: np. nowa klasa `.nav-button` oparta o te same tokeny kolorów.
- Tłumaczenia są w `DiceRoller/script.js` i już obsługują dynamiczne podmiany etykiet.

**Implikacja:**
- dodać element przy language-switcher lub pod nagłówkiem (bardziej czytelne na mobile),
- dopisać label PL/EN i aktualizację tekstu w `updateLanguage()`.

## Spójność stylistyczna (kluczowe zasady)

Wspólny „język wizualny” repo:
- font monospace (`Consolas/Fira Code/Source Code Pro`),
- neonowa zieleń (`#16c60c`) + ciemne tło,
- uppercase + tracking liter dla akcji,
- wyraźne obramowanie, hover i focus glow.

Rekomendacja globalna dla przycisku powrotu:
1. wariant **secondary/outline** (nie primary),
2. etykieta krótsza: `Powrót do Main` / `Back to Main`,
3. zawsze focus-ring dla klawiatury,
4. `aria-label` zgodny z językiem.

## Rekomendowane rozwiązanie (docelowe)

### A. Mechanika nawigacji

- Link docelowy: `../Main/index.html` (ze wszystkich 4 wskazanych stron).
- Preferencja techniczna: element `<a href="../Main/index.html">` stylizowany jak button.
  - Zaleta: natywna nawigacja, mniej JS, lepsza semantyka.

### B. Widok user/admin (DataVault)

- Przycisk pokazywać tylko w trybie user (czyli bez `?admin=1`).
- W adminie brak przycisku, aby nie „rozpraszać” flow aktualizacji danych.

### C. i18n

Dodać klucz w każdym module:
- PL: `Powrót do Main`
- EN: `Back to Main`

Miejsca aktualizacji:
- DataVault: `translations` + mapowanie `data-i18n`.
- KalkulatorXP: inline `translations` i `applyLanguage()`.
- TworzeniePostaci: `translations` + `updateLanguage()`.
- DiceRoller: `translations` w `script.js` + `updateLanguage()`.

### D. Styl i layout

- DataVault + KalkulatorXP: użyć istniejących `.btn.secondary`.
- TworzeniePostaci: styl analogiczny do `#manualButton` (ta sama wysokość i obramowanie).
- DiceRoller: dodać klasę lokalną (`.nav-button`) bazującą na stylu `.roll`, ale mniej akcentowaną.

## Proponowany plan wdrożenia (bez modyfikacji kodu na tym etapie)

1. Dodać przyciski/linki do 4 plików HTML w miejscach zgodnych z obecnym UI.
2. Rozszerzyć tłumaczenia PL/EN o etykietę przycisku.
3. W DataVault warunkowo ukryć przycisk dla admina (`ADMIN_MODE`).
4. Dodać/uzupełnić style dla linka-buttona tam, gdzie brak odpowiedniej klasy.
5. Zweryfikować responsywność (<980 px) i nawigację klawiaturą.

## Ryzyka i punkty kontrolne

- **Ryzyko i18n:** brak klucza tłumaczenia zostawi „martwy” tekst po zmianie języka.
- **Ryzyko UI mobilnego:** dodatkowy przycisk w prawym górnym rogu może zawijać układ (szczególnie TworzeniePostaci, DiceRoller).
- **Ryzyko semantyczne:** użycie `<button>` do nawigacji bez JS fallback.
- **Ryzyko DataVault:** przypadkowe wyświetlenie przycisku w adminie (wymaganie użytkownika: user-only).

## Kryteria akceptacji dla przyszłej implementacji

1. We wszystkich 4 stronach użytkownik widzi przycisk „Powrót do Main / Back to Main”.
2. Kliknięcie zawsze otwiera `../Main/index.html`.
3. W DataVault przycisk nie jest widoczny w `?admin=1`.
4. Styl przycisku jest zgodny z lokalnym modułem (bez wizualnego „odstawania”).
5. Zmiana języka aktualizuje etykietę przycisku bez odświeżania.


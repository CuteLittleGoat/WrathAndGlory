# Analiza modułu Main – przesunięcie przycisków podczas startu

## Prompt użytkownika

> Przeprowadź analizę modułu Main.  
> Przy uruchamianiu strony najpierw ładują się przyciski a potem dopiero doczytuje obrazek.  
> Przez to przez chwilę cała ramka jest krótsza a po załadowaniu obrazka się rozszerza.  
> Wizualnie wygląda to, że przyciski chwilę po załadowaniu strony się przesuwają.  
> Zbadaj możliwości co można zrobić, żeby uniknąć tego efektu.

## Zakres analizy

Analiza dotyczy pliku `Main/index.html` i zachowania układu podczas pierwszego renderu (tzw. layout shift / CLS).

## Ustalenia techniczne

1. Logo jest renderowane jako:
   ```html
   <img class="logo" src="wrath-glory-logo-warhammer.png" alt="Logo Wrath &amp; Glory">
   ```
   Obraz **nie ma atrybutów `width` i `height`**.
2. Styl `.logo` ustawia:
   - `width: 100%`
   - `max-width: clamp(220px, 40vw, 320px)`
   ale nie rezerwuje wysokości przed pobraniem bitmapy.
3. Przeglądarka najpierw układa przyciski, a po poznaniu rzeczywistych proporcji obrazka rozszerza wysokość kontenera `<main>`, co wizualnie przesuwa elementy.
4. Rzeczywisty rozmiar pliku PNG: **1366 × 768** (proporcja ~16:9).

## Dlaczego to się dzieje

To klasyczny przypadek niestabilnego layoutu (CLS): element zastępczy obrazka nie ma znanego ratio przy pierwszym układaniu dokumentu, więc miejsce jest „doliczane” dopiero po wczytaniu zasobu.

## Możliwe rozwiązania (od najbardziej zalecanego)

### Opcja A (rekomendowana): dodać `width` i `height` do `<img>`

Przykład:
```html
<img
  class="logo"
  src="wrath-glory-logo-warhammer.png"
  alt="Logo Wrath &amp; Glory"
  width="1366"
  height="768"
>
```

- Plusy:
  - Najprostsze i najbardziej standardowe rozwiązanie.
  - Przeglądarka zna proporcje od razu i rezerwuje poprawną wysokość.
  - Nie wymaga zmian JS.
- Ryzyka:
  - Praktycznie brak, przy obecnym CSS (`width: 100%`, `max-width`) obraz nadal będzie responsywny.

### Opcja B: wymusić ratio kontenera przez CSS (`aspect-ratio`)

Przykład:
```css
.logo {
  width: 100%;
  max-width: clamp(220px, 40vw, 320px);
  aspect-ratio: 1366 / 768;
  height: auto;
  display: block;
}
```

- Plusy:
  - Też stabilizuje layout.
- Minusy:
  - Wymaga pilnowania ratio w CSS, jeśli logo się zmieni.
  - Mniej „samodokumentujące” niż `width`/`height` w samym `<img>`.

### Opcja C: stała/minimalna wysokość dla `main`

Przykład:
```css
main { min-height: ... }
```

- Plusy:
  - Może ukryć przesunięcie.
- Minusy:
  - To obejście, a nie naprawa przyczyny.
  - Trudniej dobrać wartość dla różnych viewportów.

### Opcja D: placeholder/skeleton lub tło

- Plusy:
  - Lepsze UX percepcyjnie.
- Minusy:
  - Większa złożoność.
  - Nadal warto łączyć z A/B, bo sama „maska” nie usuwa przyczyny CLS.

## Rekomendacja końcowa

Najlepiej wdrożyć **Opcję A** (atrybuty `width`/`height` na logo). Dla dodatkowej czytelności można dołożyć także `height: auto` w `.logo` (obecnie i tak działa poprawnie przy `width: 100%`, ale zapis jawny bywa pomocny).

## Priorytet wdrożenia

Wysoki UX / niski koszt: to mała zmiana, która usuwa widoczne „skakanie” interfejsu na starcie.

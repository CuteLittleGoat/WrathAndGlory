# Analiza: Infoczytnik — różnica wizualnej wielkości tekstu (`Pismo odręczne` vs `Adeptus Mechanicus`)

Data: 2026-03-30

## Prompt użytkownika

> Przeprowadź analizę modułu Infoczytnik.
> Załączam kilka screenów.
> a1.jpg - ustawienia panelu GM z ustawionym Layout Mechanicus i testową wiadomością.
> a2.jpg - widok efektu a1 w Infoczytniku
> b1.jpg - ustawienia panelu GM z ustawionym Layout Pismo Odręczne i testową wiadomością.
> b2.jpg - widok efektu b1 w Infoczytniku
>
> Wyjaśnij mi, czemu w przypadku layoutu "Pismo Odręczne" tekst jest wyraźnie wizualnie mniejszy niż w layout "Adeptus Mechanicus"?
> Sprawdź w jaki sposób można to wyrównać.

## Zakres sprawdzenia

Przeanalizowano pliki:
- `Infoczytnik/GM_test.html`
- `Infoczytnik/Infoczytnik_test.html`

## Ustalenia techniczne

1. **Rozmiar px jest przekazywany identycznie niezależnie od layoutu.**
   - W panelu GM rozmiar wiadomości jest brany z inputa i zapisywany jako ten sam `msgFontSize` (np. `20px`) dla każdego layoutu.
   - W Infoczytniku ten sam `msgFontSize` trafia do CSS zmiennej `--msg-font-size`, a `.msg` używa `font-size: var(--msg-font-size)`.

2. **Kluczowa różnica to font przypisany do layoutu.**
   - `mechanicus` używa: `"Share Tech Mono"`.
   - `pismo_odreczne` używa: `"Caveat"`.

3. **Efekt „mniejszego tekstu” jest głównie skutkiem metryk fontu, nie błędu px.**
   - `Caveat` ma mniejszą wysokość optyczną znaków (x-height / cap-height) przy tej samej wartości `font-size`.
   - Dodatkowo cieńsze i bardziej „pisane” kreski obniżają percepcję wielkości.
   - Dlatego `20px` w `Caveat` wygląda wyraźnie mniejszo niż `20px` w `Share Tech Mono`.

4. **W kodzie nie ma obecnie kompensacji per-layout.**
   - System stosuje wspólne `msgFontSize` bez mnożnika zależnego od layoutu/fontu.

## Dlaczego na screenach różnica jest duża

- W `Adeptus Mechanicus` litery są grubsze, bardziej techniczne i „blokowe” (Share Tech Mono).
- W `Pismo odręczne` litery są smukłe, pochylone i mają mniejszą optyczną „masę” (Caveat).
- W praktyce użytkownik odbiera to jako mniejszy tekst, mimo identycznych 20px.

## Jak wyrównać (warianty)

### Wariant A (rekomendowany): mnożnik skali fontu zależny od layoutu

Dodać mapę skali, np.:
- `mechanicus: 1.00`
- `pismo_odreczne: 1.25` (start)
- `pismo_ozdobne: 1.35` (start)

Następnie używać:
- `--msg-font-size-effective = calc(var(--msg-font-size) * var(--msg-font-scale))`

I analogicznie w live preview GM, aby panel GM i Infoczytnik pokazywały ten sam efekt.

**Plusy:**
- Minimalna ingerencja w UX (suwak/px pozostaje ten sam).
- Stabilne i przewidywalne wyrównanie między layoutami.

### Wariant B: osobne domyślne rozmiary startowe per layout

Przy zmianie layoutu automatycznie ustawiać inne domyślne wartości inputa (np. dla `pismo_odreczne` 24 zamiast 20).

**Minus:**
- Rozmiar zależy od historii przełączeń layoutu i może być mniej intuicyjny.

### Wariant C: `font-size-adjust`

Użyć `font-size-adjust` do normalizacji wysokości małych liter między fontami.

**Minus:**
- Zależność od wsparcia przeglądarki i metryk danego fontu; zwykle mniej przewidywalne niż ręczny mnożnik.

## Proponowany punkt startowy kalibracji

- `pismo_odreczne`: **1.25**
- `pismo_ozdobne`: **1.35–1.45**

Dalej korekta „na oko” po 2–3 testach na docelowym ekranie.

## Wniosek końcowy

Problem nie wynika z błędnego zapisu/odczytu `px`, tylko z różnic metryk i optycznej czytelności fontów (`Share Tech Mono` vs `Caveat`).
Najbardziej praktyczne i stabilne wyrównanie: dodać **per-layout font scale** (mnożnik) i stosować go spójnie zarówno w GM preview, jak i w Infoczytniku.

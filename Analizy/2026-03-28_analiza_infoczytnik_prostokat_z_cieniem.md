# Analiza modułu Infoczytnik — „prostokąt z cieniami”

Data: 2026-03-28  
Moduł: `Infoczytnik`

## Prompt użytkownika
> Przeprowadź analizę modułu Infoczytnik.  
> Po wygraniu jasnego tła zobaczyłem, że jest jakiś dziwny prostokąt wyświetlany. Załączam screen. Co to jest? Chodzi mi o ten prostokąt z cieniami w rogu.

## Wniosek (krótko)
To **nie jest błąd renderowania przeglądarki**, tylko celowo dodana warstwa wizualna „ekranu czytnika” (`.screen` + pseudo-element `.screen::after`).

## Skąd bierze się ten prostokąt
1. Obszar czytanego tekstu jest osobnym kontenerem `.screen`, pozycjonowanym procentowo wewnątrz panelu (`top/right/bottom/left`).
2. Na tym kontenerze jest pseudo-element `.screen::after`, który rysuje:
   - półprzezroczyste przyciemnienie,
   - radialny gradient (winieta / cienie przy krawędziach),
   - animację migotania (`flickerBg`).
3. Przy jasnym tle pergaminowym ta warstwa jest wyraźnie widoczna jako duży prostokąt z cieniowanymi rogami/krawędziami — dokładnie jak na screenie.

## Konkretne miejsca w kodzie
- Rozmiar i położenie prostokąta wynikają z `--screen-top/right/bottom/left` w `:root`.
- Sam prostokąt to kontener `.screen`.
- Cienie i półprzezroczysta „nakładka” to `.screen::after` (`radial-gradient(... rgba(0,0,0,.70) ...)` + `rgba(255,255,255,.04)` + `opacity:.65`).
- Dodatkowo efekt może „oddychać” przez animację `flickerBg`.

## Czy to można uznać za błąd?
Z perspektywy kodu: **to zachowanie zamierzone** (stylizacja CRT/ekranu).  
Z perspektywy UX dla jasnych layoutów: może wyglądać jak artefakt, bo kontrast prostokąta jest duży.

## Opcje korekty (bez wdrażania zmian w tej analizie)
- Zmniejszyć `opacity` w `.screen::after` (np. 0.65 → 0.35–0.45).
- Osłabić gradient (np. końcowe `rgba(0,0,0,.70)` zmienić na 0.35–0.5).
- Wyłączyć tę nakładkę tylko dla jasnych layoutów (np. pergamin), zostawiając dla ciemnych.
- Alternatywnie całkiem wyłączyć pseudo-element dla wybranego trybu.

## Podsumowanie
„Dziwny prostokąt” to warstwa CSS odpowiedzialna za klimat „ekranu” i vignette. Nie jest to obcy element ani uszkodzony asset, tylko efekt graficzny zdefiniowany w stylach modułu Infoczytnik.

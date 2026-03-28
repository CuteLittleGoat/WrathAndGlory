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

---

## Rozszerzenie analizy (2026-03-28)

### Prompt użytkownika (rozszerzenie)
> Rozbuduj analizę Analizy/2026-03-28_analiza_infoczytnik_prostokat_z_cieniem.md  
> Czy można zrobić, żeby ten element przewijał się a nie był "przyklejony"?  
> Czy można go usunąć? Czy automatycznie usunie to efekt Flicker?

### Odpowiedź skrócona
- **Tak**, można zrobić, żeby „prostokąt” przewijał się razem z treścią, ale wymaga to zmiany struktury warstw (overlay nie może być pseudo-elementem przypiętym do `.screen`).
- **Tak**, można go usunąć całkowicie.
- **Tak**, usunięcie tego elementu **automatycznie usunie flicker**, bo flicker jest przypisany właśnie do tej nakładki (`.screen::after`).

### Dlaczego teraz wygląda jak „przyklejony”
W obecnym kodzie `.screen` jest kontenerem przewijanym (`overflow:auto`), a „prostokąt z cieniem” jest pseudo-elementem `.screen::after` pozycjonowanym absolutnie na całej powierzchni `.screen`.
To powoduje efekt stałej maski/vignette nad treścią: treść się przesuwa, ale nakładka pozostaje w miejscu względem okna czytnika.

### Technicznie: gdzie jest powiązanie z flickerem
- Flicker jest realizowany animacją `@keyframes flickerBg`.
- Ta animacja jest przypięta bezpośrednio do `.screen::after` (`animation: flickerBg 9s infinite`).
- Dodatkowo istnieje tryb wyłączenia migotania przez klasę `.screen.no-flicker::after { animation: none; }`.

Wniosek: jeśli usuniesz `.screen::after` (albo ukryjesz `content`), to nie ma już warstwy, która animuje się w `flickerBg`.

### Opcje wdrożeniowe
1. **Zostawić warstwę, ale bez flicker**
   - Najmniej inwazyjnie: wymusić stan `no-flicker`.
   - Efekt: prostokąt/cienie zostają, migotanie znika.

2. **Usunąć tylko flicker, zostawić cienie**
   - Usunąć `animation` z `.screen::after`.
   - Efekt: statyczny prostokąt bez pulsowania.

3. **Usunąć cały prostokąt z cieniem**
   - Wyłączyć/usunąć `.screen::after`.
   - Efekt: znika i cieniowanie, i flicker.

4. **Sprawić, aby warstwa „przewijała się” razem z treścią**
   - Trzeba przenieść efekt z pseudo-elementu kontenera `.screen` do elementu osadzonego w samym strumieniu przewijanej treści (np. wrapper wewnątrz `.screen`).
   - To jest możliwe, ale zmienia logikę wizualną (z „maski ekranu” na „dekorację treści”).

### Odpowiedź na Twoje pytania (1:1)
- **Czy można, żeby się przewijał, a nie był przyklejony?** — **Tak, można**, ale wymaga przebudowy warstwy (nie tylko drobnej korekty jednej wartości CSS).
- **Czy można go usunąć?** — **Tak**.
- **Czy automatycznie usunie to Flicker?** — **Tak**, bo flicker jest częścią tej samej nakładki (`.screen::after`).

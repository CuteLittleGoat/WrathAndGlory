# Analiza: Infoczytnik_test.html — rozjazd layoutu po przewijaniu na mobile

## Prompt użytkownika
> Przeprowadź analizę pliku Infoczytnik_test.html  
> Wpisałem w panelu GM wiadomość.  
> Kilka razy przesunąłem obrazek w górę i dół na urządzeniu mobilnym. Wszystko się rozjechało. Załączam dwa screeny. Dodatkowo na PC wygląda to inaczej niż na telefonie. Czemu?

## Zakres analizy
- Plik: `Infoczytnik/Infoczytnik_test.html`
- Analiza przyczyn różnicy mobile vs PC oraz "rozjeżdżania" po przesuwaniu/scrolowaniu.

## Główna diagnoza

### 1) Dynamiczny viewport na mobile (`100vh` + `innerHeight`)
W pliku layout jest oparty o wysokość viewportu:
- `.screen { height: 100vh; }`
- Funkcja `fitOverlayToBackground()` liczy pozycję i rozmiar nakładki (`overlay`) na podstawie `window.innerHeight` i `window.innerWidth`.
- Na mobile pasek adresu i UI przeglądarki chowają się/pokazują przy przewijaniu gestami, co zmienia **efektywne** `innerHeight`.
- Dodatkowo nasłuch `window.addEventListener('resize', fitOverlayToBackground)` powoduje ponowne przeliczenie overlay po każdej takiej zmianie viewportu.

Efekt: podczas kilku ruchów góra/dół na telefonie overlay jest wielokrotnie przeliczany i może wyglądać jak „rozjechany” względem oczekiwania użytkownika.

### 2) Niezależny scroll wewnątrz `overlayScroll`
Wiadomość jest renderowana w kontenerze:
- `.overlayScroll { overflow-y: auto; height: 100%; }`

To oznacza, że treść scrolluje się wewnątrz obszaru overlay. Na mobile gesty pionowe mogą jednocześnie:
- przewijać wewnętrzny kontener,
- uruchamiać zachowanie przeglądarki zmieniające UI (adres bar),
- wywoływać `resize` i ponowne obliczenia geometrii.

### 3) Różnice PC vs telefon są oczekiwane przy obecnym algorytmie
Pozycja overlay jest liczona procentowo (`CONTENT_RECTS_BY_BACKGROUND_ID`) względem **przeskalowanego obrazu** (`object-fit: contain` + obliczenia `scale`, `rw`, `rh`, `frameTop`, `frameLeft`).

Na PC i telefonie różni się:
- proporcja viewportu,
- realny obszar roboczy (UI przeglądarki na mobile),
- często skala i anti-aliasing/font rendering.

W konsekwencji ten sam procentowy rect i te same fonty (`clamp` z `vw`) wizualnie dają inny rezultat na desktopie i mobile.

## Co dokładnie pasuje do załączonych screenów
- Widoczna różnica pozycji dolnego segmentu i marginesów między dwoma ujęciami jest spójna z przeliczeniem layoutu po zmianie wysokości viewportu (mobile browser UI).
- Przy dłuższym tekście i aktywnym scrollu efekt jest bardziej zauważalny, bo użytkownik wykonuje więcej gestów pionowych.

## Ryzyka konstrukcyjne w obecnej implementacji
1. Użycie `100vh` zamiast stabilnego viewportu mobilnego (`dvh/svh` lub fix przez `visualViewport`) może powodować skoki.
2. Przeliczanie geometrii tylko na `resize` bez „stabilizacji” (debounce / ignorowanie mikro-zmian UI) zwiększa podatność na jitter.
3. Mieszanie przewijania wewnętrznego kontenera i dynamicznej zmiany viewportu utrudnia powtarzalny układ.

## Rekomendacje (bez wdrażania zmian w tym kroku)
1. Przejść z `height: 100vh` na bardziej stabilny wariant mobilny (`100dvh` z fallbackiem).
2. Rozważyć nasłuch `visualViewport` i aktualizację layoutu dopiero po ustabilizowaniu wysokości (krótki debounce).
3. Ograniczyć liczbę przeliczeń `fitOverlayToBackground()` przy drobnych zmianach wysokości UI przeglądarki.
4. Zweryfikować, czy scroll ma być wyłącznie wewnątrz overlay, czy globalnie zablokowany, aby uniknąć konkurencji gestów.
5. Dla spójności PC/mobile rozważyć osobne profile `CONTENT_RECTS` dla typów proporcji (np. tall mobile vs desktop widescreen).

## Wniosek końcowy
Problem nie wygląda na losowy błąd renderowania, tylko na konsekwencję obecnego modelu layoutu opartego o dynamiczny viewport mobilny i częste rekalkulacje po `resize`. Różnica wyglądu PC vs telefon wynika z odmiennych proporcji i zachowania viewportu mobilnego podczas gestów przewijania.

---

## Rozszerzenie analizy (2026-03-31) — różnica „niebieskiej ramki” PC vs mobile

## Prompt użytkownika (uzupełnienie kontekstu)
> Przeczytaj i rozbuduj analizę (dodaj nowe informacje bez usuwania starych) Analizy/2026-03-31_analiza_infoczytnik_test_mobile_scroll_rozjazd.md
>
> Załączam dwa screeny. Jeden z wersji mobilnej a drugi z PC. Ten sam testowy tekst wpisany w panelu GM. Czemu na PC wygląda to jakby pole wyznaczone przez niebieską ramkę (szczegóły w Analizy/NiebieskaRamka.md) było niżej? Czy da się to jakoś wyrównać, żeby na PC, telefonie i tablecie zawsze wyglądało to tak samo?

## Co dodatkowo wynika z obecnego kodu `Infoczytnik_test.html`

### A) Wrażenie „ramka jest niżej” to zwykle suma 3 niezależnych zjawisk

1. **Skalowanie obrazu tła przez `object-fit: contain` i `fitOverlayToBackground()`**
   - Overlay jest liczony procentowo względem obrazu po skalowaniu (`rw`, `rh`, `frameTop`, `frameLeft`).
   - Gdy proporcje okna różnią się między urządzeniami, punkt startowy (`top`) i wielkość overlay mogą mieć inny wynik po zaokrągleniach (`Math.round`).
   - To daje małe, ale widoczne przesunięcia między platformami.

2. **Typografia zależna od `vw` (viewport width), nie od realnej szerokości overlay**
   - `.prefix/.suffix` używają `font-size: clamp(12px, 2vw, 20px)`.
   - `.msg` używa `font-size: clamp(16px, 2.8vw, 34px)`.
   - Na PC (szerszy viewport) fonty są większe, więc wizualnie treść „schodzi niżej”, mimo że geometryczny prostokąt overlay może być policzony poprawnie.

3. **Pionowe odstępy jako procent wysokości overlay**
   - `.overlayScroll` ma `padding: 2.5% 3.5%` i `gap: 2.5%`.
   - Na większym obszarze procentowy padding/gap to więcej pikseli, więc pierwszy wiersz treści startuje niżej.

W praktyce użytkownik odbiera to jako „niebieska ramka jest niżej”, choć często to **wewnętrzna kompozycja treści** wygląda niżej.

### B) Dodatkowy efekt mobilny: zmienny viewport podczas gestu

Na telefonie `window.innerHeight` zmienia się przy chowaniu/pokazywaniu UI przeglądarki. Ponieważ `fitOverlayToBackground()` jest odpalane na `resize`, top/height overlay potrafią się rekalkulować w trakcie sesji. To potęguje wrażenie niestabilności względem desktopu.

## Czy da się wyrównać wygląd PC / telefon / tablet?

**Tak, da się znacząco wyrównać** (w praktyce „prawie identycznie”), ale trzeba przyjąć jeden model skalowania.

### Zalecany model spójności (najskuteczniejszy)

1. **Skalować typografię i odstępy od wymiarów overlay, nie od viewportu**
   - Zamiast `vw`, użyć zmiennych CSS ustawianych z JS po `fitOverlayToBackground()`:
     - `--overlayW`, `--overlayH`, `--overlayMin`.
   - Przykładowo liczyć font i spacing od `--overlayMin`.

2. **Ograniczyć procentowe pionowe odstępy zależne od wysokości**
   - `padding-top`, `gap`, `min-height` top/bottom band ustalić w bardziej stabilny sposób:
     - np. z relacji do `line-height` lub do `--overlayMin` z clampami.

3. **Ustabilizować viewport mobilny**
   - rozważyć `100dvh` (z fallbackiem) i/lub aktualizację geometrii przez `visualViewport` + debounce,
   - ignorować mikro-zmiany wysokości (np. < 4–8 px), które wynikają z animacji paska przeglądarki.

4. **Trzymać jednolite metryki tekstu**
   - jawne `line-height` dla prefix/msg/suffix,
   - unikać zależności od domyślnych metryk systemowych fontów.

### Czego nie da się zagwarantować 1:1 absolutnie

Nawet po poprawkach mogą zostać subtelne różnice (1–2 px) przez:
- inny silnik renderowania fontów (desktop vs mobile),
- różne DPR (device pixel ratio),
- zaokrąglenia subpikseli.

To normalne. Celem powinno być **spójne pozycjonowanie funkcjonalne** i bardzo małe odchylenie wizualne.

## Szybki test diagnostyczny, który potwierdzi przyczynę

Aby potwierdzić, że problem jest głównie typograficzno-odstępowy (a nie sama geometria ramki), wystarczy tymczasowo:
1. ustawić stałe fonty `px` (bez `vw`),
2. ustawić stałe `padding-top` i `gap` w `px`,
3. porównać PC i mobile.

Jeżeli „opadanie” treści zniknie lub mocno się zmniejszy, przyczyna została potwierdzona.

## Wniosek rozszerzony

Różnica z Twoich screenów jest zgodna z aktualną implementacją: overlay jest poprawnie liczony procentowo, ale zawartość wewnątrz jest skalowana i odsuwana regułami zależnymi od viewportu (`vw`, `%`, dynamiczny `innerHeight`). Dlatego na PC wygląda jakby obszar „niebieskiej ramki” był niżej. Da się to wyrównać, jeśli skala fontów/odstępów zostanie przeniesiona z viewportu na sam overlay i zostanie ustabilizowany mechanizm przeliczania na mobile.

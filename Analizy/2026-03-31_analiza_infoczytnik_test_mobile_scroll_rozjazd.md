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

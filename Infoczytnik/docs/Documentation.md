## Aktualizacja 2026-04-22 — nowe pole robocze dla tła `Pergamin`
1. W `Infoczytnik_test.html` zaktualizowano preset `CONTENT_RECTS_BY_BACKGROUND_ID` dla `backgroundId=9` (`Pergamin`) na podstawie nowego pliku `assets/ramki/Pergamin_ramka.png`.
2. Nowe wartości obszaru (`x,y,w,h`) to: `0.0771, 0.1302, 0.8672, 0.6973`.
3. Współrzędne zostały wyznaczone z bounding boxa niebieskiej ramki (`minX=79`, `minY=200`, `maxX=966`, `maxY=1270`) dla obrazu `1024x1536`, zgodnie z metodą opisaną w `assets/data/NiebieskaRamka.md`.
4. Zaktualizowano `INF_VERSION` w `GM_test.html` i `Infoczytnik_test.html` do `2026-04-22_15-28-38` (czas lokalny PL), aby wymusić odświeżenie cache zasobów po zmianie.

# Infoczytnik — Documentation (test files)

## Aktualizacja 2026-04-23 — dropdown fontów GM + preload webfontów
1. W `GM_test.html` zmieniono budowanie etykiet opcji fontów: `buildOptionLabel(item, 'font')` zwraca teraz format `ID. Frakcja - Nazwa fontu`; cały tekst opcji jest renderowany standardowym fontem UI (bez stylowania per-opcja).
2. Rozszerzono import Google Fonts w `GM_test.html` oraz `Infoczytnik_test.html` o brakujące rodziny: `IBM Plex Serif`, `Open Sans`, `Noto Serif`, `DM Serif Display`, `IBM Plex Sans Condensed`, `Exo 2`.
3. W `GM_test.html` dodano preload manifestowych fontów (`preloadManifestFonts`) oparty o `document.fonts.load(...)` oraz natychmiastową aplikację rodziny przy zmianie selecta (`applySelectedFontToPreview()` + repaint), co eliminuje odczuwalne opóźnienie 1–2 s w mini-podglądzie.
4. W `Infoczytnik_test.html` dodano preload stałej listy rodzin (`PRELOAD_FONT_FAMILIES` + `preloadKnownFonts`), żeby pierwsze użycie fontu na ekranie gracza również było szybsze.
5. Zaktualizowano `INF_VERSION` w `GM_test.html` i `Infoczytnik_test.html` do `2026-04-23_11-55-45` (czas lokalny PL).

## Zakres
Dokument opisuje aktualny stan `GM_test.html` i `Infoczytnik_test.html` po przebudowie na niezależne dropdowny i manifest JSON.



## Aktualizacja 2026-04-02 — autoformat `+++` podczas importu XLSX -> JSON
1. W `GM_test.html` rozszerzono importer manifestu o funkcje `formatFillerLine(...)` i `formatFillerLines(...)`, które podczas mapowania arkusza `fillers` automatycznie opakowują każdą linię `prefixes` i `suffixes` do formatu `+++ TEKST +++`.
2. Dodano zabezpieczenie przed podwójnym opakowaniem: jeżeli linia już jest w formacie `+++ ... +++`, importer pozostawia ją bez zmian.
3. Reguła formatowania działa na etapie `DataSlate_manifest.xlsx -> data.json`, więc GM preview i payload runtime korzystają już z gotowych, sformatowanych wartości z manifestu.
4. Podniesiono `INF_VERSION` w `GM_test.html` i `Infoczytnik_test.html` do `2026-04-02_16-55-00` (czas lokalny PL).
5. Wygenerowano nowy `assets/data/data.json` i zasilono nim aplikację; wszystkie rekordy `fillers.prefixes/suffixes` zapisano jako `+++ ... +++`.


## Aktualizacja 2026-04-02 — Litannie Zagubionych + nowe tło WnG + regeneracja data.json
1. W `assets/data/DataSlate_manifest.xlsx` i `assets/data/Mapowanie.xlsx` nazwa tła `Litannie Zaginionych` została zastąpiona nazwą `Litannie Zagubionych`; runtime korzysta teraz z pliku `assets/backgrounds/Litannie_Zagubionych.png`.
2. Dodano nowe tło `WnG` (`backgroundId=10`) i rozszerzono mapę `CONTENT_RECTS_BY_BACKGROUND_ID` w `Infoczytnik_test.html` o wpis: `10:{ x:0.1214, y:0.0962, w:0.7385, h:0.8081 }`.
3. Zmieniono domyślny preset panelu GM: `DEFAULT_FORM_STATE.backgroundId` ustawiono na `10` (`WnG`).
4. Utworzono plik `assets/data/NiebieskaRamka.md` dokumentujący algorytm wyliczania `x,y,w,h` z plików `*_ramka.png` (detekcja niebieskiej ramki + normalizacja do wymiaru obrazu).
5. Wygenerowano od nowa `assets/data/data.json` z aktualnego `assets/data/DataSlate_manifest.xlsx` — sekcja `backgrounds` zawiera teraz 10 rekordów i poprawioną nazwę `Litannie Zagubionych`.
6. Podniesiono `INF_VERSION` w `GM_test.html` i `Infoczytnik_test.html` do `2026-04-02_14-27-24`.




## Aktualizacja 2026-03-31 — podgląd „Treść / Tło” (nowe wymaganie)
1. W `GM_test.html` zastąpiono etykiety trybu podglądu: `Wycinek`/`Całość` -> `Treść`/`Tło` (radio: `previewModeContent`, `previewModeBackground`).
2. Zmieniono semantykę trybów:
   - `content` (Treść, domyślny) renderuje warstwę tekstową (prefix/wiadomość/suffix + opcjonalne logo) na technicznym tle, bez grafiki tła.
   - `background` (Tło) renderuje tylko pojedynczą miniaturę aktualnie wybranego pliku tła (`previewBackgroundThumb`) z obrotem `rotate(-90deg)`.
3. Dodano klasy stanu `preview-mode-content` i `preview-mode-background`, które sterują widocznością warstw podglądu i eliminują efekt wielu miniatur.
4. `DEFAULT_FORM_STATE.previewMode` zmieniono z `crop` na `content`.
5. `loadSavedPreviewMode()` migruje stare wartości localStorage: `crop -> content`, `full -> background`; klucz pozostaje `infoczytnik.gm.previewMode`.
6. Podniesiono `INF_VERSION` w `GM_test.html` i `Infoczytnik_test.html` do `2026-03-31_22-55-00`.
7. Dopracowano wygląd miniatury trybu `Tło`: w stanie `preview-mode-background` usunięto wewnętrzny padding podglądu (`padding:0`), a `previewBackgroundThumb` skaluje się do pełnej wysokości pola (`height:100%`, `width:auto`), dzięki czemu miniatura dochodzi do górnej i dolnej krawędzi bez deformacji (z wolnym miejscem po bokach).

## Aktualizacja 2026-03-31 — wyrównanie przycisku „Aktualizuj dane z XLSX”
1. W `GM_test.html` zmieniono styl kontenera `importRow` z `align-items:stretch` na `align-items:center`, aby elementy w wierszu logu importu były centrowane pionowo.
2. W klasie `.importUpdateBtn` dodano `align-self:center`, dzięki czemu przycisk pozostaje po prawej stronie pola `Log importu`, ale jest wyrównany do środka tego pola.
3. Wysokość przycisku pozostała zależna od globalnego stylu `button` (tak jak w pozostałych przyciskach panelu), więc wizualnie ma tę samą wysokość co reszta przycisków akcji.
4. Podniesiono `INF_VERSION` w `GM_test.html` i `Infoczytnik_test.html` do `2026-03-31_15-18-03`.

## Aktualizacja 2026-03-31 — przełączany tryb podglądu tła (Wycinek / Całość)
1. W `GM_test.html` dodano nowy wiersz sterowania `Podgląd: Wycinek / Całość` (radio buttons `previewModeCrop`, `previewModeFull`) umieszczony bezpośrednio nad `livePreviewBox`.
2. Dodano obsługę trybu podglądu:
   - `getPreviewMode()` odczytuje aktywny wybór (`crop` / `full`),
   - `setPreviewMode(mode)` przełącza `background-size` mini-podglądu (`cover` dla `Wycinek`, `contain` dla `Całość`) i synchronizuje stan kontrolek,
   - `loadSavedPreviewMode()` odtwarza ostatnio używany tryb po odświeżeniu.
3. Dodano trwałość wyboru w `localStorage` pod kluczem `infoczytnik.gm.previewMode`; panel pamięta preferencję GM między sesjami przeglądarki.
4. `DEFAULT_FORM_STATE` rozszerzono o `previewMode:'crop'`; `restoreDefaults()` przywraca ten domyślny tryb i od razu aplikuje go do mini-podglądu.
5. Podniesiono `INF_VERSION` w `GM_test.html` i `Infoczytnik_test.html` do `2026-03-31_15-02-48`.

## Aktualizacja 2026-03-31 — nowy `assets/data/data.json` z `assets/data/DataSlate_manifest.xlsx`
1. Wygenerowano od nowa plik `Infoczytnik/assets/data/data.json` na podstawie zaktualizowanego arkusza `Infoczytnik/assets/data/DataSlate_manifest.xlsx`.
2. Zmiany danych obejmują:
   - nowe i przemianowane frakcje w sekcji `fonts` (łącznie 16 rekordów),
   - nowe i przemianowane zestawy w sekcji `fillers` (łącznie 14 rekordów),
   - przemapowane identyfikatory zgodnie z manifestem XLSX.
3. Zachowano założenie użytkowe dotyczące presetów: identyfikatory elementów domyślnych (`logoId=1`, `fillerId=1`, `fontId=1`) nadal istnieją, więc domyślna konfiguracja modułu nie wymaga zmian w logice.
4. Zakres zmiany obejmuje dane runtime (`data.json`) i dokumentację; bez zmian w `GM_test.html` / `Infoczytnik_test.html`.

## Aktualizacja 2026-04-01 — przycisk importu DataSlate_manifest.xlsx w GM_test
1. W `GM_test.html` dodano obok pola `Log importu` nowy układ `importRow`: log zajmuje ~1/2 wcześniejszej szerokości, a z prawej strony jest przycisk `Aktualizuj dane z XLSX`.
2. Dodano stałą `MANIFEST_XLSX_PATH = "assets/data/DataSlate_manifest.xlsx"` oraz klientowy importer oparty o SheetJS (`xlsx.full.min.js` z CDN).
3. Przycisk uruchamia `updateDataFromXlsx()`:
   - pobiera zawsze stały plik wsadowy `Infoczytnik/assets/data/DataSlate_manifest.xlsx` (`fetch + cache: no-store`),
   - mapuje arkusze `backgrounds`, `logos`, `audios`, `fonts`, `fillers` do struktury runtime manifestu,
   - aktualizuje dropdowny i podgląd na żywo,
   - generuje i pobiera nowy plik `data.json` (do ręcznej podmiany w `Infoczytnik/assets/data/data.json`).
4. `importLog` raportuje błędy mapowania (np. brak arkusza / niepełny rekord) i nadal pokazuje `Brak błędów importu.` przy pustej liście.
5. Podniesiono `INF_VERSION` w `GM_test.html` i `Infoczytnik_test.html` do `2026-04-01_00-15-00`.

## Aktualizacja 2026-03-31 — domyślne ustawienia panelu GM
1. W `GM_test.html` zmieniono `DEFAULT_FORM_STATE` tak, aby panel startował z presetem:
   - `backgroundId=10` (WnG),
   - `logoId=1` (Mechanicus),
   - `fillerId=1` (Mechanicus),
   - `audioId=1` (Text-On-Screen),
   - `showLogo=false`, `movingOverlay=false`, `flicker=false`,
   - `audioEnabled=true`, `fillersEnabled=true`,
   - `fillerLineCount=3`, `fillerBandLines=2`,
   - `messageColor=#00ff66`, `msgFontSize=20`,
   - `prefixSuffixColor=#ffffff`, `psFontSize=12`,
   - treść komunikatu po resecie: pusta (`''`).
2. `restoreDefaults()` automatycznie odczytuje te wartości, więc przycisk „Przywróć domyślne” i inicjalne uruchomienie formularza ustawiają identyczny stan.
3. Podniesiono `INF_VERSION` w `GM_test.html` i `Infoczytnik_test.html` do `2026-03-31_21-45-00`.

## Aktualizacja 2026-03-31 — DataSlate_manifest.xlsx (zamiana kolejności logo)
1. Zaktualizowano sekcję `logos` w `assets/data/data.json` zgodnie z nowym plikiem `DataSlate_manifest.xlsx`.
2. Nowa kolejność i mapowanie ID:
   - `id=1` → `Mechanicus` (`assets/logos/Mechanicus.png`),
   - `id=2` → `Inkwizycja` (`assets/logos/Inquisition.png`).
3. Zakres zmiany obejmuje wyłącznie dane manifestu (bez zmian logiki JS/HTML).

## Aktualizacja 2026-03-31 — porządkowanie po analizie pickera `#ffffff`
1. Usunięto warstwę eksperymentalną `colorEditSource` (`text` vs `picker`) z `GM_test.html`.
2. `resolveHexColor(...)` wróciło do prostszego kontraktu 3-parametrowego (`textValue`, `pickerValue`, `fallback`) bez przełączania priorytetu źródła.
3. `renderPreview()`, `getPayload()` i handlery kolorów korzystają ponownie z jednolitej ścieżki synchronizacji (`text` + `picker`) bez dodatkowego stanu.
4. Podniesiono `INF_VERSION` w `GM_test.html` i `Infoczytnik_test.html` do `2026-03-31_14-40-38`.

## Aktualizacja 2026-03-31 — GM/Infoczytnik (wdrożenie rekomendacji)
0. **Poprawka UX panelu kolorów fillerów (GM)**:
   - Dodano `isFullHexColor(v)` do rozróżniania pełnego HEX (`#RGB`/`#RRGGBB`) od wpisu częściowego.
   - Dodano `resolveHexColor(textValue,pickerValue,fallback)`, które priorytetowo bierze poprawny HEX z pola tekstowego, a przy wartości niepełnej korzysta z aktualnej wartości pickera.
   - `renderPreview()` nie nadpisuje już pola tekstowego koloru Prefix/Suffix fallbackiem podczas wpisywania częściowego kodu (to samo zachowanie zastosowano także dla koloru treści, dla spójności).
   - Poprawiono przypadek zgłoszony przez użytkownika: dla `Prefix + Suffix` picker działa od razu nawet gdy pole HEX jest chwilowo niepoprawne (np. `#fffff`), więc zmienia się zarówno podgląd, jak i pasek „Kolor|Pełny”.
   - Walidacja i normalizacja ręcznie wpisanego HEX dla `messageColorText` i `psColorText` dzieje się na `blur`, co pozwala wpisać kod ręcznie „od zera” bez wymogu kliknięcia chipa szybkiego koloru.
   - Pickery (`messageColorPicker`, `psColorPicker`) nadal synchronizują tekst i preview na `input` oraz `change`.
1. **Kontrakt font-size**:
   - `GM_test.html` wysyła `msgFontSize`, `prefixFontSize`, `suffixFontSize` jako liczby (bez `px`).
   - `Infoczytnik_test.html` konsumuje je przez istniejący `clamp(...)` i mapuje na CSS custom properties `--msgBasePx`, `--psBasePx`.
2. **Flicker hint**:
   - `syncFlickerDependency()` pokazuje tylko ostrzeżenie „Flicker wymaga włączonego prostokąta cienia.” gdy `movingOverlay=false`.
   - W stanie `movingOverlay=true` hint jest pusty (usunięto komunikat „Flicker aktywny (opcjonalny)”).
3. **Ilość linii fillerów**:
   - `fillerLineCount` wywołuje `rerollFillers()` na `input` i `change`.
   - `fillersEnabled` również wywołuje `rerollFillers()` po zmianie, dzięki czemu liczba linii i stan włączenia fillerów odświeżają tablice `fillerState` bez ręcznej zmiany zestawu.
4. **Kolory — HEX only**:
   - Wprowadzono `normalizeHexColor(v,fallback)` akceptujące wyłącznie `#RGB` i `#RRGGBB` (normalizacja do lowercase `#rrggbb`).
   - Usunięto domyślne RGBA dla Prefix/Suffix i zastąpiono je `#ffffff`.
   - Payload wysyła `messageColor`, `prefixColor`, `suffixColor` wyłącznie jako HEX.
5. **Synchronizacja pickerów**:
   - Obsługiwane eventy `input` i `change` dla `messageColorPicker` oraz `psColorPicker`.
   - Każde renderowanie podglądu synchronizuje `text + picker` do wartości znormalizowanej.
6. **Szybkie kolory (chips)**:
   - Dodano dla sekcji treści i fillerów: Zielony `#00ff66`, Czerwony `#ff3333`, Złoty `#d4af37`, Biały `#ffffff`.
   - Kliknięcie chipa aktualizuje pole tekstowe HEX, picker i live preview.
7. **Układ sekcji kolorów (GM)**:
   - Dla obu sekcji zastosowano kolejność:
     - rząd `HEX + Picker` (obok siebie),
     - rząd przycisków szybkich kolorów,
     - rząd pola rozmiaru fontu.
8. **Fonty na ekranie gracza**:
   - `Infoczytnik_test.html` otrzymał ten sam zestaw linków Google Fonts co `GM_test.html` (`preconnect` + `css2?family=...`), aby `fontPreset` był renderowany zgodnie z podglądem GM.

## Pliki i dane
- `Infoczytnik/assets/data/data.json` — runtime manifest (backgrounds, logos, audios, fonts, fillers, importLog).
- `Infoczytnik/GM_test.html` — panel GM zapisujący dokument `dataslate/current`.
- `Infoczytnik/Infoczytnik_test.html` — ekran gracza nasłuchujący `dataslate/current`.

## Model danych Firestore (`dataslate/current`)
Zapisywane pola:
- `type`: `message | ping | clear`
- `backgroundId`, `backgroundFile`
- `logoId`, `logoFile`
- `fillerId`, `fillerSet`
- `fontId`, `fontPreset`
- `messageAudioId`, `messageAudioFile`
- `fillersEnabled`, `audioEnabled`, `showLogo`, `movingOverlay`, `flicker`
- `prefixLines[]`, `suffixLines[]`, `fillerLineCount`
- `fillerBandLines` (wysokość górnej i dolnej strefy prefix/suffix wyrażona w liniach)
- `messageColor`, `prefixColor`, `suffixColor`
- `msgFontSize`, `prefixFontSize`, `suffixFontSize`
- `pingUrl`, `nonce`, `ts`

## GM_test.html — logika
1. Ładowanie `assets/data/data.json` i zapełnienie 5 dropdownów.
2. Walidacja domyślnych ID przez fallback do pierwszego rekordu listy.
3. Losowanie unikalnych fillerów (`rerollFillers`) z wybranego zestawu.
4. `syncFlickerDependency()` wymusza regułę: gdy `movingOverlay=false`, to `flicker=false` i `flicker.disabled=true` + komunikat informacyjny.
5. Preview renderuje dwa niezależne cele podglądu: `Treść` (warstwa tekstowa bez grafiki tła) albo `Tło` (jedna miniatura wybranego tła obrócona o 90°).
6. `getPayload()` wymusza regułę bezpieczeństwa również na poziomie danych (`flicker` nigdy nie idzie jako `true`, jeśli `movingOverlay` jest wyłączony).
7. `Wyczyść komunikat` czyści wyłącznie `textarea#message`.
8. `Przywróć domyślne` resetuje formularz do `DEFAULT_FORM_STATE` i wysyła dokument `type=clear`.
9. Pole `Log importu` pokazuje komunikaty z `manifest.importLog`.
10. Przycisk `Aktualizuj dane z XLSX` przetwarza lokalny plik `assets/data/DataSlate_manifest.xlsx` w przeglądarce i pobiera nowy `data.json` do ręcznej podmiany.

## Infoczytnik_test.html — logika
1. Subskrypcja `onSnapshot` dokumentu `dataslate/current`.
2. `ping` -> odtwarza zawsze `assets/audios/ping/Ping.mp3`.
3. `message` -> renderuje tekst + fillery + styl; audio wiadomości działa tylko przy `audioEnabled !== false`.
4. `clear` -> czyści prefix, treść i suffix bez resetu całej strony.
5. Font ma wspólny fallback: `Calibri, Arial, sans-serif`.
6. Overlay używa struktury stref:
   - `topBand` (prefix + slot logo),
   - `msg` (treść wiadomości),
   - `bottomBand` (suffix).
7. `overlayScroll` przewija się tylko pionowo (`overflow-y:auto`, `overflow-x:hidden`), więc:
   - obszar cienia (`overlay`) jest nieruchomy,
   - prefix/logo znikają przy scrollu w dół,
   - suffix pojawia się przy dolnych partiach treści.
8. Reguły łamania linii są jawnie ustawione (`white-space:pre-wrap`, `word-break:normal`, `overflow-wrap:normal`, `hyphens:manual`) dla prefix/msg/suffix.
9. `fillerBandLines` steruje symetryczną wysokością `topBand` i `bottomBand` przez zmienną CSS `--fillerBandLines`.
10. Overlay jest dynamicznie dopasowywany w dwóch krokach:
   - najpierw liczony jest prostokąt renderowanego tła (`object-fit:contain`) na podstawie `naturalWidth/naturalHeight` i viewportu,
   - następnie stosowany jest preset obszaru roboczego zależny od `backgroundId` (`CONTENT_RECTS_BY_BACKGROUND_ID`), co ogranicza tekst do „ekranu” wewnątrz ramki.
11. Funkcja `fitOverlayToBackground()`:
   - ustawia `left/top/width/height` overlay do obszaru roboczego dla aktywnego tła,
   - ustawia rozmiar slotu logo (`--logoSize`) zależnie od szerokości obszaru roboczego,
   - uruchamia się po `load` obrazka, przy `resize` okna i po każdej zmianie layoutu.
12. `overlay.shadow::after` ma `inset:0`, więc cień pokrywa dokładnie cały obszar overlay; wiadomość, fillery i logo pozostają w tym samym polu co prostokąt cienia.
13. Typografia i spacing są liczone od rozmiaru overlay zamiast `vw/%`:
   - `--msgBasePx` oraz `--psBasePx` (z Firestore) definiują bazę typografii,
   - finalny `font-size` używa `clamp(..., calc(basePx * --overlayScale), ...)`,
   - `--overlayPadY`, `--overlayPadX`, `--overlayGap` są wyliczane z geometrii overlay i trzymane w granicach `min/max`.
14. Wprowadzono stabilizację viewportu mobilnego:
   - `.screen` używa `height:100vh; height:100dvh`,
   - geometrię przelicza `scheduleFitOverlay()` oparty o `requestAnimationFrame + debounce`,
   - obsługiwane są zdarzenia `resize`, `orientationchange` oraz `visualViewport.resize/scroll`,
   - mikro-zmiany (`<2px` szerokości i `<6px` wysokości) są ignorowane, aby zredukować jitter po gestach przewijania.

15. Presety `CONTENT_RECTS_BY_BACKGROUND_ID` zostały przeliczone ponownie na podstawie plików `assets/ramki/*_ramka.png` (mapowanie z `assets/data/Mapowanie.xlsx`). Aktualne wartości (`x,y,w,h`) to:
   - `1 DataSlate_01`: `0.0642, 0.0762, 0.8707, 0.8124`
   - `2 DataSlate_02`: `0.1255, 0.0924, 0.7091, 0.7574`
   - `3 DataSlate_03`: `0.1048, 0.1435, 0.8094, 0.6745`
   - `4 DataSlate_04`: `0.1123, 0.1481, 0.7745, 0.7262`
   - `5 DataSlate_05`: `0.0329, 0.0242, 0.9362, 0.9325`
   - `6 DataSlate_Inq`: `0.1004, 0.0450, 0.8246, 0.7801`
   - `7 Litannie_Zagubionych`: `0.1987, 0.1254, 0.6207, 0.7643`
   - `8 Notatnik`: `0.0361, 0.0280, 0.9248, 0.9447`
   - `9 Pergamin`: `0.0537, 0.0293, 0.8955, 0.9499`
   - `10 WnG`: `0.1214, 0.0962, 0.7385, 0.8081`

## Style / UX
- Fonty Google: Share Tech Mono, Cinzel, Rajdhani, Black Ops One, Staatliches, Orbitron, Questrial, Russo One, Caveat, Great Vibes.
- Preview GM ma mini-podgląd tła i logo.
- Checkbox `Fillery` blokuje `Ilość linii fillerów` i pokazuje komunikat o stanie.
- Układ tekstu na ekranie gracza jest mieszany: prefix/suffix centralnie, treść wiadomości do lewej, cały blok osadzony od górnej krawędzi warstwy overlay i ograniczony do obszaru roboczego zdefiniowanego dla danego tła; cień i logo są liczone względem tego samego obszaru.
- Wysokości odstępów pionowych i skala typografii są normalizowane do wymiaru overlay, dzięki czemu PC/mobile/tablet mają bliższy wizualnie układ startowy treści.
- Długi prefix nie nachodzi na logo, ponieważ `topBand` używa siatki z dedykowanym slotem logo; przy ukrytym logo aktywuje się wariant `topBand.no-logo` z jedną kolumną pełnej szerokości.

## Uwagi implementacyjne
- Produkcyjne pliki (`GM.html`, `Infoczytnik.html`) nie były modyfikowane.
- Manifest runtime to JSON; XLSX pozostaje źródłem wejściowym do generacji JSON.

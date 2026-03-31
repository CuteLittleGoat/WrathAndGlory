# Infoczytnik — Documentation (test files)

## Zakres
Dokument opisuje aktualny stan `GM_test.html` i `Infoczytnik_test.html` po przebudowie na niezależne dropdowny i manifest JSON.


## Aktualizacja 2026-03-31 — DataSlate_manifest.xlsx (zamiana kolejności logo)
1. Zaktualizowano sekcję `logos` w `assets/data/data.json` zgodnie z nowym plikiem `DataSlate_manifest.xlsx`.
2. Nowa kolejność i mapowanie ID:
   - `id=1` → `Mechanicus` (`assets/logos/Mechanicus.png`),
   - `id=2` → `Inkwizycja` (`assets/logos/Inquisition.png`).
3. Zakres zmiany obejmuje wyłącznie dane manifestu (bez zmian logiki JS/HTML).

## Aktualizacja 2026-03-31 — poprawka pickera dla `#ffffff`
1. **Aktywny kanał edycji koloru (`text` vs `picker`)**:
   - Dodano stan `colorEditSource = { message: 'text', ps: 'text' }`.
   - Zdarzenia `input/change` na polach tekstowych ustawiają aktywne źródło na `text`.
   - Zdarzenia `input/change` na pickerach ustawiają aktywne źródło na `picker`.
2. **Rozszerzenie `resolveHexColor(...)`**:
   - Funkcja przyjmuje nowy parametr `preferText` i potrafi liczyć kolor zarówno z priorytetem pola tekstowego, jak i pickera.
   - `renderPreview()` i `getPayload()` używają priorytetu zgodnego z ostatnim kanałem edycji.
3. **Stabilizacja scenariusza „biały start”**:
   - Przy wartości `#ffffff` (szczególnie dla Prefix/Suffix) picker nie jest już nadpisywany przez stale poprawny HEX z pola tekstowego.
   - Po ruchu pickera kolor jest traktowany jako źródło prawdy i od razu synchronizowany do pola tekstowego oraz preview.
4. **Reset domyślny**:
   - `restoreDefaults()` resetuje `colorEditSource` do `text` dla obu sekcji kolorów.
5. **Wersjonowanie plików testowych**:
   - Podniesiono `INF_VERSION` w `GM_test.html` i `Infoczytnik_test.html` do `2026-03-31_14-20-00`.

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
5. Preview renderuje jednocześnie tło, logo, font, prefix/suffix i treść.
6. `getPayload()` wymusza regułę bezpieczeństwa również na poziomie danych (`flicker` nigdy nie idzie jako `true`, jeśli `movingOverlay` jest wyłączony).
7. `Wyczyść komunikat` czyści wyłącznie `textarea#message`.
8. `Przywróć domyślne` resetuje formularz do `DEFAULT_FORM_STATE` i wysyła dokument `type=clear`.
9. Pole `Log importu` pokazuje komunikaty z `manifest.importLog`.

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

15. Presety `CONTENT_RECTS_BY_BACKGROUND_ID` zostały przeliczone ponownie na podstawie plików `assets/ramki/*_ramka.png` (mapowanie z `Draft/Mapowanie.xlsx`). Aktualne wartości (`x,y,w,h`) to:
   - `1 DataSlate_01`: `0.0642, 0.0762, 0.8707, 0.8124`
   - `2 DataSlate_02`: `0.1255, 0.0924, 0.7091, 0.7574`
   - `3 DataSlate_03`: `0.1048, 0.1435, 0.8094, 0.6745`
   - `4 DataSlate_04`: `0.1123, 0.1481, 0.7745, 0.7262`
   - `5 DataSlate_05`: `0.0329, 0.0242, 0.9362, 0.9325`
   - `6 DataSlate_Inq`: `0.1004, 0.0450, 0.8246, 0.7801`
   - `7 Litannie_Zaginionych`: `0.1987, 0.1254, 0.6207, 0.7643`
   - `8 Notatnik`: `0.0361, 0.0280, 0.9248, 0.9447`
   - `9 Pergamin`: `0.0537, 0.0293, 0.8955, 0.9499`

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

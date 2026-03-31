# Infoczytnik — Documentation (test files)

## Zakres
Dokument opisuje aktualny stan `GM_test.html` i `Infoczytnik_test.html` po przebudowie na niezależne dropdowny i manifest JSON.

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
13. Dodano przełącznik diagnostyczny `DIAGNOSTIC_FIXED_TYPO_SPACING_TEST` (w `Infoczytnik_test.html`):
   - gdy `true`, nakładane są stałe wartości testowe:
     - `prefix/suffix` font: `16px`,
     - `msg` font: `24px`,
     - `overlayScroll` `padding-top`: `14px`,
     - `overlayScroll` `gap`: `14px`,
   - gdy `false`, aktywne są wartości bazowe (`clamp`/`%`).
14. Technicznie test działa przez:
   - klasę `overlay.diagnostic-fixed-typo-spacing`,
   - zmienne CSS `--diagPrefixSuffixSize`, `--diagMsgSize`, `--diagPaddingTop`, `--diagGap`,
   - fallback do standardowych reguł, więc wyłączenie testu nie wymaga cofania przebudowy CSS.

## Style / UX
- Fonty Google: Share Tech Mono, Cinzel, Rajdhani, Black Ops One, Staatliches, Orbitron, Questrial, Russo One, Caveat, Great Vibes.
- Preview GM ma mini-podgląd tła i logo.
- Checkbox `Fillery` blokuje `Ilość linii fillerów` i pokazuje komunikat o stanie.
- Układ tekstu na ekranie gracza jest mieszany: prefix/suffix centralnie, treść wiadomości do lewej, cały blok osadzony od górnej krawędzi warstwy overlay i ograniczony do obszaru roboczego zdefiniowanego dla danego tła; cień i logo są liczone względem tego samego obszaru.
- Długi prefix nie nachodzi na logo, ponieważ `topBand` używa siatki z dedykowanym slotem logo; przy ukrytym logo aktywuje się wariant `topBand.no-logo` z jedną kolumną pełnej szerokości.

## Uwagi implementacyjne
- Produkcyjne pliki (`GM.html`, `Infoczytnik.html`) nie były modyfikowane.
- Manifest runtime to JSON; XLSX pozostaje źródłem wejściowym do generacji JSON.

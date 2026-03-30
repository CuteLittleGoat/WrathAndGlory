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
- `messageColor`, `prefixColor`, `suffixColor`
- `msgFontSize`, `prefixFontSize`, `suffixFontSize`
- `pingUrl`, `nonce`, `ts`

## GM_test.html — logika
1. Ładowanie `assets/data/data.json` i zapełnienie 5 dropdownów.
2. Walidacja domyślnych ID przez fallback do pierwszego rekordu listy.
3. Losowanie unikalnych fillerów (`rerollFillers`) z wybranego zestawu.
4. Preview renderuje jednocześnie tło, logo, font, prefix/suffix i treść.
5. `Wyczyść komunikat` czyści wyłącznie `textarea#message`.
6. `Przywróć domyślne` resetuje formularz do `DEFAULT_FORM_STATE` i wysyła dokument `type=clear`.
7. Pole `Log importu` pokazuje komunikaty z `manifest.importLog`.

## Infoczytnik_test.html — logika
1. Subskrypcja `onSnapshot` dokumentu `dataslate/current`.
2. `ping` -> odtwarza zawsze `assets/audios/ping/Ping.mp3`.
3. `message` -> renderuje tekst + fillery + styl; audio wiadomości działa tylko przy `audioEnabled !== false`.
4. `clear` -> czyści prefix, treść i suffix bez resetu całej strony.
5. Font ma wspólny fallback: `Calibri, Arial, sans-serif`.
6. Kontener overlay jest wyrównany do górnej krawędzi (`align-items:flex-start`), dzięki czemu blok tekstu rozpoczyna się od góry obszaru roboczego.
7. W bloku wiadomości:
   - `prefix` i `suffix` mają `text-align:center`,
   - `msg` ma `text-align:left`,
   - kontener `.box` używa `align-items:stretch`, aby wyrównania tekstu działały niezależnie dla każdej sekcji.
8. Overlay jest dynamicznie dopasowywany do realnie widocznego obszaru tła (`object-fit:contain`) przez funkcję `fitOverlayToBackground()`. Funkcja:
   - wylicza docelowy prostokąt renderowanego tła na podstawie `naturalWidth/naturalHeight` i rozmiaru viewportu,
   - ustawia `left/top/width/height` overlay tak, aby tekst nie wychodził poza ramkę layoutu,
   - uruchamia się po `load` obrazka oraz przy `resize` okna.

## Style / UX
- Fonty Google: Share Tech Mono, Cinzel, Rajdhani, Black Ops One, Staatliches, Orbitron, Questrial, Russo One, Caveat, Great Vibes.
- Preview GM ma mini-podgląd tła i logo.
- Checkbox `Fillery` blokuje `Ilość linii fillerów` i pokazuje komunikat o stanie.
- Układ tekstu na ekranie gracza jest mieszany: prefix/suffix centralnie, treść wiadomości do lewej, cały blok osadzony od górnej krawędzi warstwy overlay i ograniczony do obszaru widocznej ramki.

## Uwagi implementacyjne
- Produkcyjne pliki (`GM.html`, `Infoczytnik.html`) nie były modyfikowane.
- Manifest runtime to JSON; XLSX pozostaje źródłem wejściowym do generacji JSON.

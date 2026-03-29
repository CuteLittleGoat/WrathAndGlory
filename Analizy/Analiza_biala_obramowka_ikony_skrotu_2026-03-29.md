# Aktualizacja analizy: biała obramówka ikony po utworzeniu skrótu

## Prompt użytkownika
"Zaktualizuj analizę: Analizy/Analiza_biala_obramowka_ikony_skrotu_2026-03-29.md
Czy obecna ikona może być poprawnie użyta i trzeba tylko coś w kodzie plików zmienić, czy muszę przygotować całkowicie nową ikonę?"

## Zweryfikowany stan plików
- `manifest.webmanifest`:
  - ikona `192x192` wskazuje `./IkonaGlowna.png` z `purpose: "any"`,
  - ikona `512x512` wskazuje **ten sam plik** `./IkonaGlowna.png` z `purpose: "any maskable"`.
- `Main/index.html` poprawnie podpina manifest przez `<link rel="manifest" href="../manifest.webmanifest">`.
- Nagłówek PNG (`IHDR`) dla `IkonaGlowna.png` wskazuje `color_type = 2` (RGB bez kanału alfa), czyli plik nie jest przygotowany jako dedykowana ikona maskowalna.

## Odpowiedź na pytanie
### Krótko
**Sama zmiana kodu/manifestu może częściowo poprawić sytuację, ale nie da pewnego efektu na wszystkich launcherach.**
Aby docelowo i przewidywalnie pozbyć się białej obramówki/tła, **powinieneś przygotować nową, dedykowaną ikonę maskowalną**.

### Co da się zrobić bez nowej grafiki
Możesz tymczasowo:
1. Usunąć `maskable` z wpisu używającego `IkonaGlowna.png` (zostawić tylko `purpose: "any"`),
2. Wyczyścić cache (service worker/Chrome),
3. Usunąć i utworzyć skrót ponownie.

To czasem zmniejsza artefakty, ale na części urządzeń i launcherów obramówka nadal może się pojawić (bo launcher i tak nakłada własny kształt/tło dla skrótu).

### Co jest poprawnym rozwiązaniem docelowym
Przygotować **nową ikonę maskowalną** (osobny plik, np. `IkonaGlowna-maskable-512.png`) i użyć w manifeście osobno:
- `purpose: "any"` → zwykła ikona,
- `purpose: "maskable"` → nowa ikona zaprojektowana pod safe-zone.

## Wniosek końcowy
Jeśli zależy Ci na stabilnym, poprawnym wyglądzie skrótu/PWA na różnych Android launcherach, **potrzebna jest nowa ikona maskowalna**. Sama zmiana kodu może tylko częściowo pomóc i nie gwarantuje usunięcia białej obramówki.

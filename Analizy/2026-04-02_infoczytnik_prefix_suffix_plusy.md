# Analiza: Infoczytnik — brak automatycznego `+++` dla prefix/suffix

## Prompt użytkownika
> Przeprowadź analizę modułu Infoczytnik.
> W panelu GM użytkownik może wybrać zestaw prefixów i suffixów. Zestawy te są definiowane w Infoczytnik/assets/data/DataSlate_manifest.xlsx i przerabiane na Infoczytnik/assets/data/data.json
>
> Jednak jest problem z wyświetlaniem. Miały one automatycznie mieć dodawane trzy znaki plus przed i po tekście.
> Przykładowo:
> +++ TEKST +++
>
> W Infoczytnik/assets/data/DataSlate_manifest.xlsx zestawy mam zapisane tylko jako tekst. Aplikacja sama miała dostawiać znaki plus.
> Sprawdź czemu tak się nie dzieje.

## Wynik analizy

### 1) Import z XLSX nie dodaje `+++`
W `GM_test.html` importer mapuje `fillers.prefixes` i `fillers.suffixes` przez `toStringArray(...)`, który:
- rozdziela wpis po nowej linii lub `|`,
- robi `trim()`,
- usuwa puste wartości,
- **nie dopisuje żadnych znaków** przed/po treści.

W praktyce wartości są przenoszone 1:1 jako sam tekst.

### 2) Render podglądu GM też nie dodaje `+++`
W `renderPreview()` do podglądu trafia bezpośrednio:
- `fillerState.prefixLines.join('\n')`
- `fillerState.suffixLines.join('\n')`
bez żadnego formatowania/obudowania.

### 3) Ekran gracza (Infoczytnik) też nie dodaje `+++`
W `Infoczytnik_test.html` funkcja `applyMessage(d)` składa prefix/suffix i ustawia `textContent` bez transformacji. Czyli to, co przyjdzie z GM, wyświetla się literalnie.

### 4) Potwierdzenie w runtime data
W `Infoczytnik/assets/data/data.json` wpisy fillerów są obecnie zapisane bez plusów (np. `"INCOMING DATA FEED"`, `"PRAISE THE OMNISSIAH"`).

### 5) Dlaczego mogło powstać wrażenie, że „miało działać automatycznie”
W starszych plikach backup (`GM_backup.html`, `Infoczytnik_backup.html`) wpisy były zapisane już **z** `+++` w samych danych (hardcoded). Wtedy wyglądało to jak automatyczne formatowanie, ale w rzeczywistości plusy były częścią tekstu źródłowego.

## Przyczyna źródłowa
Brak warstwy formatowania `prefix/suffix -> "+++ ${tekst} +++"` w całym aktualnym przepływie:
- import XLSX -> JSON,
- losowanie i preview w GM,
- render na ekranie gracza.

## Rekomendacja naprawy (kierunek)
Najczyściej dodać pojedynczą funkcję formatującą (np. `formatFillerLine`) i użyć jej:
1. w `GM_test.html` przy budowie `fillerState` (preview + payload),
2. albo alternatywnie tylko w `Infoczytnik_test.html` przy renderze (mniej zmian, ale preview w GM nadal bez plusów),
3. ewentualnie przy generowaniu `data.json` (utrata „czystego” źródła bez plusów).

Preferowany wariant: formatowanie w runtime GM + gracz, z zabezpieczeniem przed podwójnym dodaniem, gdyby wpis już miał `+++`.

## Wniosek końcowy
To nie jest błąd pojedynczego pliku danych. To brak implementacji automatycznego ozdabiania linii w obecnej wersji logiki modułu.

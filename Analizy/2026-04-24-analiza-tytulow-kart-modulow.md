# Analiza tytułów kart przeglądarki dla modułów WrathAndGlory

## Prompt użytkownika
> Przeprowadź analizę wszystkich modułów. Wypisz mi jaka nazwa się wyświetla jako tytuł karty w każdej ze stron jakie może otworzyć użytkownik.

## Zakres analizy
Przeanalizowano moduły widoczne z poziomu `Main/index.html` oraz strony podrzędne, do których użytkownik może przejść z poziomu ekranów modułów (linki nawigacyjne między stronami `.html`).

## Wyniki

| Moduł | Strona (plik) | Tytuł karty (`<title>`) |
|---|---|---|
| Main | `Main/index.html` | `Kozi Przybornik` |
| DataVault | `DataVault/index.html` | `Administratum Data Vault` |
| GeneratorNazw | `GeneratorNazw/index.html` | `Generator Nazw` |
| GeneratorNPC | `GeneratorNPC/index.html` | `Generator NPC` |
| Audio | `Audio/index.html` | `Kozie Audio` |
| DiceRoller | `DiceRoller/index.html` | `DiceRoller - Wrath & Glory` |
| Kalkulator | `Kalkulator/index.html` | `Kozie Liczydła` |
| Kalkulator | `Kalkulator/KalkulatorXP.html` | `Kalkulator PD` |
| Kalkulator | `Kalkulator/TworzeniePostaci.html` | `Wrath & Glory` |
| Infoczytnik | `Infoczytnik/index.html` | `DataSlate panel testowy` |
| Infoczytnik | `Infoczytnik/GM.html` | `Infoczytnik - panel GM` |
| Infoczytnik | `Infoczytnik/Infoczytnik.html` | `Infoczytnik` |
| Infoczytnik (test) | `Infoczytnik/GM_test.html` | `Infoczytnik - panel GM` |
| Infoczytnik (test) | `Infoczytnik/Infoczytnik_test.html` | `Infoczytnik` |

## Uwagi
- W module Infoczytnik istnieją także pliki backup (`GM_backup.html`, `Infoczytnik_backup.html`) z tymi samymi tytułami co wersje produkcyjne, ale nie są podlinkowane w panelu startowym modułu.
- W repozytorium występują też pliki archiwalne (np. `Kalkulator/Old/...`, `WebView_FCM_Cloudflare_Worker/Archiwalne/...`) — nie zostały ujęte jako standardowe strony modułów.

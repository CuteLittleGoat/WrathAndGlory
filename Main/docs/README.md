# 🇵🇱 Instrukcja użytkownika — Main (PL)

## Do czego służy Main

`Main` to strona startowa całego pakietu narzędzi `Wrath & Glory`.

Służy jako centrum uruchamiania pozostałych modułów. Z jednego miejsca możesz przejść do:

- Infoczytnika,
- Skarbca Danych,
- Kalkulatora,
- Rzutu kośćmi,
- Mapy,
- Obrazków,
- a w trybie admina także do Generatora Nazw, Generatora NPC i Audio.

## Jak otworzyć

Widok standardowy:

```text
Main/index.html
```

Widok admina:

```text
Main/index.html?admin=1
```

Widok standardowy jest przeznaczony do zwykłego używania podczas sesji.

Widok admina pokazuje dodatkowe narzędzia i linkuje wybrane moduły w ich trybach rozszerzonych.

## Widok standardowy

W trybie standardowym zobaczysz:

- logo aplikacji,
- przycisk `Infoczytnik`,
- przycisk `Skarbiec Danych`,
- przycisk `Obrazki`,
- przycisk `Mapa`,
- przycisk `Kalkulator`,
- przycisk `Rzut kośćmi`.

To jest najprostszy widok dla gracza albo prowadzącego, który nie potrzebuje paneli administracyjnych.

## Widok admina

W trybie admina zobaczysz dodatkowo:

- `Generator Nazw`,
- `Generator NPC`,
- `Audio`,
- krótkie notatki o wejściu do paneli admina w obsługiwanych modułach.

W trybie admina link `Infoczytnik` prowadzi do strony wyboru wersji produkcyjnej/testowej Infoczytnika.

W trybie admina link `Skarbiec Danych` otwiera DataVault z parametrem:

```text
?admin=1
```

## Co robią przyciski

| Przycisk | Działanie |
| --- | --- |
| `Infoczytnik` | Otwiera ekran komunikatów fabularnych albo stronę wyboru Infoczytnika w trybie admina. |
| `Skarbiec Danych` | Otwiera DataVault, czyli przeglądarkę prywatnych danych. |
| `Generator Nazw` | Otwiera generator nazw. Widoczny tylko w trybie admina. |
| `Generator NPC` | Otwiera generator kart NPC. Widoczny tylko w trybie admina. |
| `Audio` | Otwiera panel dźwięków. Widoczny tylko w trybie admina. |
| `Obrazki` | Otwiera zewnętrzny link do obrazków w nowej karcie. |
| `Mapa` | Otwiera zewnętrzny link do mapy w nowej karcie. |
| `Kalkulator` | Otwiera moduł kalkulatorów. |
| `Rzut kośćmi` | Otwiera DiceRoller. |

## Linki zewnętrzne: Mapa i Obrazki

Przyciski `Mapa` i `Obrazki` są linkami zewnętrznymi.

Otwierają się w nowej karcie.

Ich adresy są pobierane dynamicznie z pliku:

```text
Main/ZmienneHiperlacza.md
```

Jeżeli linki nie działają, prawdopodobnie ten plik jest niedostępny albo nie zawiera poprawnych adresów.

## Praca podczas sesji

Najprostszy sposób użycia:

1. Otwórz `Main/index.html`.
2. Zostaw Main jako centrum sterowania.
3. Otwieraj potrzebne moduły kliknięciem.
4. Do Mapy i Obrazków przechodź w osobnych kartach.
5. Wracaj do Main, gdy chcesz zmienić narzędzie.

W trybie prowadzącego możesz zamiast tego otworzyć:

```text
Main/index.html?admin=1
```

Dzięki temu masz szybki dostęp do narzędzi administracyjnych.

## Różnica między przejściami lokalnymi i nową kartą

Większość modułów otwiera się w tej samej karcie.

`Mapa` i `Obrazki` otwierają się w nowej karcie, ponieważ są linkami zewnętrznymi.

## Czyszczenie starych Service Workerów

Strona Main automatycznie próbuje wyrejestrować stare Service Workery.

Dzięki temu pakiet narzędzi działa jako aplikacja online i nie powinien korzystać z przestarzałej wersji zapisanej w cache przeglądarki.

Jeżeli mimo tego widzisz starą wersję strony, odśwież ją ręcznie skrótem:

```text
Ctrl + F5
```

albo wyczyść dane strony w przeglądarce.

## Typowe problemy i co zrobić

| Problem | Możliwa przyczyna | Co zrobić |
| --- | --- | --- |
| Nie widać `Generator Nazw`, `Generator NPC` albo `Audio` | Otwarty jest widok standardowy. | Dopisz do adresu `?admin=1`. |
| `Mapa` albo `Obrazki` nie otwierają poprawnej strony | Brak albo błędna konfiguracja w `ZmienneHiperlacza.md`. | Zgłoś adminowi albo popraw konfigurację linków. |
| Przycisk prowadzi do starej wersji modułu | Przeglądarka trzyma cache. | Odśwież przez `Ctrl + F5`. |
| Infoczytnik otwiera inny ekran niż oczekiwano | Tryb standardowy i admin prowadzą do innych punktów Infoczytnika. | Użyj `Main/index.html?admin=1`, jeśli potrzebujesz wyboru GM/test/produkcja. |
| Skarbiec Danych nie pokazuje panelu admina | Otwarty jest zwykły link DataVault. | Otwórz Main w trybie admina albo dopisz `?admin=1` w DataVault. |

## Krótki workflow

1. Otwórz `Main/index.html`.
2. Kliknij potrzebny moduł.
3. Użyj nowej karty dla Mapy albo Obrazków.
4. Wróć do Main, aby uruchomić kolejne narzędzie.
5. Otwórz `Main/index.html?admin=1`, gdy potrzebujesz dodatkowych narzędzi.

---

# 🇬🇧 User guide — Main (EN)

## What Main is for

`Main` is the start page for the whole `Wrath & Glory` toolkit.

It is the launch center for other modules. From one place you can open:

- Infoczytnik,
- DataVault,
- Calculator,
- DiceRoller,
- Map,
- Images,
- and, in admin mode, Name Generator, NPC Generator, and Audio.

## How to open

Standard view:

```text
Main/index.html
```

Admin view:

```text
Main/index.html?admin=1
```

Standard view is meant for normal session use.

Admin view shows additional tools and links selected modules in their extended modes.

## Standard view

In standard mode you will see:

- application logo,
- `Infoczytnik` button,
- `DataVault` button,
- `Images` button,
- `Map` button,
- `Calculator` button,
- `DiceRoller` button.

This is the simplest view for a player or GM who does not need administrative panels.

## Admin view

In admin mode you will additionally see:

- `Name Generator`,
- `NPC Generator`,
- `Audio`,
- short notes about opening admin panels in supported modules.

In admin mode, `Infoczytnik` opens the Infoczytnik production/test selection page.

In admin mode, `DataVault` opens DataVault with parameter:

```text
?admin=1
```

## Button actions

| Button | Action |
| --- | --- |
| `Infoczytnik` | Opens the narrative message screen or Infoczytnik selection page in admin mode. |
| `DataVault` | Opens DataVault, the private data browser. |
| `Name Generator` | Opens the name generator. Visible only in admin mode. |
| `NPC Generator` | Opens the NPC card generator. Visible only in admin mode. |
| `Audio` | Opens the sound panel. Visible only in admin mode. |
| `Images` | Opens an external images link in a new tab. |
| `Map` | Opens an external map link in a new tab. |
| `Calculator` | Opens calculator module. |
| `DiceRoller` | Opens DiceRoller. |

## External links: Map and Images

`Map` and `Images` are external links.

They open in a new tab.

Their URLs are loaded dynamically from:

```text
Main/ZmienneHiperlacza.md
```

If these links do not work, this file is probably missing or does not contain valid URLs.

## Session use

Simplest usage:

1. Open `Main/index.html`.
2. Keep Main as your control center.
3. Open needed modules with one click.
4. Use separate tabs for Map and Images.
5. Return to Main when switching tools.

For GM/admin work, open instead:

```text
Main/index.html?admin=1
```

This gives quick access to administrative tools.

## Difference between local navigation and new tab

Most modules open in the same tab.

`Map` and `Images` open in a new tab because they are external links.

## Old Service Worker cleanup

Main automatically tries to unregister old Service Workers.

This helps the toolkit work as an online application and avoid stale versions cached by the browser.

If you still see an old page version, hard-refresh it with:

```text
Ctrl + F5
```

or clear site data in the browser.

## Common problems and what to do

| Problem | Possible cause | What to do |
| --- | --- | --- |
| `Name Generator`, `NPC Generator`, or `Audio` are not visible | Standard view is open. | Add `?admin=1` to the URL. |
| `Map` or `Images` opens the wrong page | Missing or wrong configuration in `ZmienneHiperlacza.md`. | Contact admin or fix link configuration. |
| A button opens an old module version | Browser cache is stale. | Refresh with `Ctrl + F5`. |
| Infoczytnik opens a different screen than expected | Standard and admin modes link to different Infoczytnik entry points. | Use `Main/index.html?admin=1` if you need GM/test/production selection. |
| DataVault does not show admin panel | Normal DataVault link is open. | Open Main in admin mode or add `?admin=1` in DataVault. |

## Quick workflow

1. Open `Main/index.html`.
2. Click the module you need.
3. Use a new tab for Map or Images.
4. Return to Main to open another tool.
5. Open `Main/index.html?admin=1` when you need additional tools.

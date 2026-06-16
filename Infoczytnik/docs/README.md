# 🇵🇱 Instrukcja użytkownika — Infoczytnik (PL)

## Do czego służy Infoczytnik

`Infoczytnik` służy do wyświetlania graczom klimatycznych komunikatów fabularnych na osobnym ekranie.

Prowadzący używa panelu GM, aby wysyłać na ekran graczy:

- teksty fabularne,
- ostrzeżenia,
- komunikaty systemowe,
- sygnały dźwiękowe,
- tła,
- logo frakcji lub organizacji,
- efekty wizualne.

Najwygodniejszy układ podczas sesji to dwa osobne ekrany albo dwa urządzenia:

- jedno dla prowadzącego,
- jedno widoczne dla graczy.

## Jak otworzyć moduł

Najprościej otwórz stronę wyboru:

```text
Infoczytnik/index.html
```

Na stronie wyboru dostępne są:

- wersje produkcyjne,
- wersje testowe.

## Wersja produkcyjna

Do normalnego prowadzenia sesji używaj wersji produkcyjnej:

```text
Infoczytnik/GM.html
Infoczytnik/Infoczytnik.html
```

`GM.html` to panel prowadzącego.

`Infoczytnik.html` to ekran graczy.

## Wersja testowa

Do sprawdzania zmian albo testowania używaj wersji testowej:

```text
Infoczytnik/GM_test.html
Infoczytnik/Infoczytnik_test.html
```

Wersje testowe są przeznaczone do prób i nie powinny zastępować wersji produkcyjnej podczas właściwej sesji, chyba że prowadzący świadomie tak zdecyduje.

## Przygotowanie ekranu graczy

1. Otwórz `Infoczytnik/Infoczytnik.html` na ekranie widocznym dla graczy.
2. Kliknij raz ekran Infoczytnika, żeby odblokować audio w przeglądarce.
3. Zostaw ten ekran otwarty.
4. Nie odświeżaj go bez potrzeby podczas sesji.

Kliknięcie ekranu jest ważne, ponieważ przeglądarki często blokują automatyczne odtwarzanie dźwięku, dopóki użytkownik nie wykona pierwszej interakcji.

## Przygotowanie panelu GM

1. Otwórz `Infoczytnik/GM.html` na komputerze prowadzącego.
2. Sprawdź, czy panel ma połączenie z Firebase.
3. Wybierz tło.
4. Wybierz logo.
5. Wybierz font.
6. Ustaw kolory i rozmiary tekstu.
7. Zdecyduj, czy mają działać logo, fillery, flicker i audio.
8. Wyślij krótką wiadomość testową.
9. Sprawdź, czy pojawiła się na ekranie graczy.

## Szybki start — pierwsza wiadomość

1. W panelu GM wybierz `Tło`.
2. Wybierz `Logo`.
3. Wybierz `Font`.
4. Opcjonalnie wybierz `Audio wiadomości`.
5. Włącz albo wyłącz przełączniki efektów.
6. Wpisz tekst w polu komunikatu.
7. Kliknij `Wyślij`.
8. Sprawdź ekran graczy.

Jeżeli wiadomość się nie pojawia, odśwież oba ekrany i wyślij ją ponownie.

## Najważniejsze przyciski panelu GM

| Przycisk | Działanie |
| --- | --- |
| `Wyślij` | Publikuje aktualny komunikat na ekranie graczy. |
| `Ping` | Odtwarza krótki sygnał dźwiękowy bez zmiany treści komunikatu. |
| `Wyczyść komunikat` | Czyści pole wpisywania tekstu w panelu GM. |
| `Przywróć domyślne` | Przywraca domyślne ustawienia panelu. |
| `Aktualizuj dane z XLSX` | Odświeża dane źródłowe modułu z przygotowanego manifestu. |

## Pole komunikatu

W polu komunikatu wpisujesz treść, którą zobaczą gracze.

Dobre praktyki:

- wysyłaj krótsze wiadomości zamiast jednej bardzo długiej,
- dziel większe komunikaty na kilka ekranów,
- używaj prostych zdań,
- unikaj zbyt małego fontu,
- po zmianie tła sprawdź czytelność tekstu.

## Tło

Tło wpływa na klimat komunikatu.

Używaj tła odpowiedniego do sceny, np.:

- imperialne komunikaty,
- ostrzeżenia techniczne,
- transmisje wojskowe,
- zakłócone dane,
- raporty z pola walki.

Po zmianie tła wyślij krótką wiadomość testową, żeby sprawdzić, czy tekst jest czytelny.

## Logo

Logo może być widoczne albo ukryte.

W panelu GM możesz:

- wybrać logo,
- włączyć lub wyłączyć jego widoczność,
- ustawić kolor logo, jeżeli panel oferuje taką opcję.

Wyłącz logo, jeżeli chcesz prosty komunikat bez symbolu albo jeśli logo zasłania klimat konkretnej sceny.

## Font i kolory

Panel GM pozwala dobrać wygląd komunikatu.

Najczęściej zmieniane ustawienia:

- font,
- kolor tekstu wiadomości,
- rozmiar tekstu wiadomości,
- kolor prefixu i suffixu,
- rozmiar prefixu i suffixu,
- kolor logo.

Ustawienia dobieraj do tła. Jasny tekst może być nieczytelny na jasnym tle, a zbyt ciemny tekst może zniknąć na ciemnym tle.

## Fillery

Fillery to dodatkowe linie i znaki techniczne, które budują klimat ekranu danych.

Możesz ustawić:

- czy fillery są włączone,
- liczbę linii fillerów,
- wysokość strefy prefixu i suffixu.

Włącz fillery, gdy chcesz uzyskać efekt transmisji, terminala albo zaszumionego dataslate'u.

Wyłącz je, gdy komunikat ma być czysty i łatwy do przeczytania.

## Flicker

`Flicker` dodaje efekt migotania.

Dobrze działa przy:

- awariach,
- transmisjach alarmowych,
- zakłóceniach,
- komunikatach z uszkodzonych systemów.

Wyłącz flicker, jeżeli gracze mają czytać dłuższy tekst.

## Audio

Panel może wysyłać dźwięk wiadomości oraz sygnał `Ping`.

Aby audio działało:

1. Włącz audio w panelu GM.
2. Kliknij raz ekran Infoczytnika na urządzeniu graczy.
3. Sprawdź głośność systemową.
4. Wyślij testowy ping albo testową wiadomość z audio.

Jeżeli dźwięk nie działa, najczęściej ekran graczy nie został kliknięty po załadowaniu strony albo przeglądarka blokuje autoplay.

## Ping

`Ping` służy do natychmiastowego zwrócenia uwagi graczy.

Nie zmienia tekstu komunikatu. Odtwarza tylko sygnał dźwiękowy na ekranie graczy.

Używaj go oszczędnie, żeby nie stracił efektu.

## Tryb podglądu

Panel GM może oferować tryby podglądu, np.:

- podgląd treści,
- podgląd tła.

Podgląd treści pomaga sprawdzić, jak będzie wyglądał finalny komunikat.

Podgląd tła pomaga dobrać tło i logo bez rozpraszania tekstem.

## Wyczyść komunikat

`Wyczyść komunikat` czyści pole tekstowe w panelu GM.

Nie musi usuwać ostatniej wiadomości z ekranu graczy. Służy przede wszystkim do przygotowania nowej wiadomości w panelu.

## Przywróć domyślne

`Przywróć domyślne` przydaje się, gdy po wielu eksperymentach układ przestaje być czytelny.

Przycisk przywraca bazowy zestaw ustawień panelu GM.

Po przywróceniu domyślnych wyślij krótką wiadomość testową.

## Aktualizuj dane z XLSX

`Aktualizuj dane z XLSX` służy do odświeżenia źródeł danych używanych przez panel, np. list teł, logo, fontów, fillerów albo audio.

To funkcja utrzymaniowa. Podczas normalnej sesji zwykle nie trzeba jej używać.

Użyj jej przed sesją albo podczas testów, jeżeli zasoby zostały zmienione.

## Jak pracować podczas sesji

1. Przygotuj ekran graczy i kliknij go raz, aby odblokować audio.
2. Otwórz panel GM.
3. Dobierz styl do sceny.
4. Wyślij krótką wiadomość testową.
5. Wysyłaj właściwe komunikaty w krótkich porcjach.
6. Używaj `Ping`, gdy chcesz przyciągnąć uwagę.
7. Zmieniaj tło i logo przy zmianie rodzaju transmisji.
8. Przy dłuższych tekstach wyłącz mocne efekty, które utrudniają czytanie.

## Typowe problemy i co zrobić

| Problem | Możliwa przyczyna | Co zrobić |
| --- | --- | --- |
| Wiadomość nie pojawia się na ekranie graczy | Brak połączenia, stara sesja albo problem Firebase. | Odśwież panel GM i ekran graczy, potem wyślij ponownie. |
| Dźwięk nie działa | Przeglądarka blokuje autoplay albo audio jest wyłączone. | Kliknij raz ekran graczy, włącz `Audio`, sprawdź głośność. |
| Ping nie działa | Ekran graczy nie ma odblokowanego audio. | Kliknij ekran Infoczytnika i spróbuj ponownie. |
| Tekst jest nieczytelny | Złe tło, kolor albo rozmiar fontu. | Zmień kolor, zwiększ font albo wybierz inne tło. |
| Komunikat jest za długi | Tekst nie mieści się dobrze w obszarze. | Podziel go na kilka krótszych wiadomości. |
| Wygląd różni się na projektorze | Inna rozdzielczość albo skalowanie przeglądarki. | Przetestuj ekran przed sesją i używaj krótszych tekstów. |
| Panel nie reaguje po długim czasie | Strona lub połączenie mogły się zawiesić. | Odśwież panel GM i ekran graczy. |
| Zasób z listy nie wygląda poprawnie | Dane źródłowe mogły być nieaktualne. | Użyj `Aktualizuj dane z XLSX` przed sesją albo zgłoś adminowi. |

## Krótki workflow podczas sesji

1. Otwórz `Infoczytnik/index.html`.
2. Otwórz ekran graczy i panel GM.
3. Kliknij raz ekran graczy, żeby odblokować audio.
4. W panelu GM wybierz tło, logo i font.
5. Włącz albo wyłącz efekty.
6. Wpisz krótką wiadomość.
7. Kliknij `Wyślij`.
8. Użyj `Ping`, jeżeli gracze mają natychmiast spojrzeć na ekran.
9. Przy zmianie sceny zmień styl i wyślij kolejny komunikat.

---

# 🇬🇧 User guide — Infoczytnik (EN)

## What Infoczytnik is for

`Infoczytnik` displays atmospheric narrative messages to players on a separate screen.

The GM uses the GM panel to send to the player screen:

- narrative text,
- warnings,
- system messages,
- audio cues,
- backgrounds,
- faction or organization logos,
- visual effects.

The most convenient session setup is two separate screens or two devices:

- one for the GM,
- one visible to players.

## How to open the module

The simplest way is to open the selection page:

```text
Infoczytnik/index.html
```

The selection page provides:

- production versions,
- test versions.

## Production version

For normal play, use the production version:

```text
Infoczytnik/GM.html
Infoczytnik/Infoczytnik.html
```

`GM.html` is the GM panel.

`Infoczytnik.html` is the player screen.

## Test version

For checking changes or testing, use the test version:

```text
Infoczytnik/GM_test.html
Infoczytnik/Infoczytnik_test.html
```

Test versions are meant for trials and should not replace production versions during the real session unless the GM deliberately decides to do so.

## Preparing the player screen

1. Open `Infoczytnik/Infoczytnik.html` on the screen visible to players.
2. Click the Infoczytnik screen once to unlock browser audio.
3. Leave this screen open.
4. Do not refresh it during the session unless needed.

Clicking the screen is important because browsers often block automatic audio until the user performs the first interaction.

## Preparing the GM panel

1. Open `Infoczytnik/GM.html` on the GM computer.
2. Check whether the panel is connected to Firebase.
3. Choose background.
4. Choose logo.
5. Choose font.
6. Set text colors and sizes.
7. Decide whether logo, fillers, flicker, and audio should be active.
8. Send a short test message.
9. Check whether it appears on the player screen.

## Quick start — first message

1. In the GM panel, choose `Background`.
2. Choose `Logo`.
3. Choose `Font`.
4. Optionally choose `Message audio`.
5. Enable or disable effect toggles.
6. Enter message text.
7. Click `Send`.
8. Check the player screen.

If the message does not appear, refresh both screens and send it again.

## Main GM panel buttons

| Button | Action |
| --- | --- |
| `Send` | Publishes the current message to the player screen. |
| `Ping` | Plays a short audio cue without changing message text. |
| `Clear message` | Clears the text input in the GM panel. |
| `Restore defaults` | Restores default panel settings. |
| `Update data from XLSX` | Refreshes module source data from the prepared manifest. |

## Message field

The message field is where you enter text players will see.

Best practices:

- send shorter messages instead of one very long one,
- split larger messages into several screens,
- use simple sentences,
- avoid very small font,
- after changing background, check text readability.

## Background

Background changes the mood of the message.

Use a background suitable for the scene, for example:

- imperial messages,
- technical warnings,
- military transmissions,
- corrupted data,
- battlefield reports.

After changing background, send a short test message to check readability.

## Logo

Logo can be visible or hidden.

In the GM panel you can:

- choose logo,
- enable or disable its visibility,
- set logo color if the panel offers that option.

Disable logo if you want a simple message without a symbol or if the logo does not fit the scene.

## Font and colors

The GM panel lets you adjust message appearance.

Most commonly changed settings:

- font,
- message text color,
- message text size,
- prefix and suffix color,
- prefix and suffix size,
- logo color.

Match settings to the background. Bright text may be unreadable on bright backgrounds, and dark text may disappear on dark backgrounds.

## Fillers

Fillers are extra technical lines and characters that build the data-screen mood.

You can set:

- whether fillers are enabled,
- filler line count,
- prefix and suffix area height.

Enable fillers when you want a transmission, terminal, or noisy dataslate effect.

Disable them when the message should be clean and easy to read.

## Flicker

`Flicker` adds a blinking effect.

It works well for:

- failures,
- alarm transmissions,
- interference,
- messages from damaged systems.

Disable flicker if players need to read a longer text.

## Audio

The panel can send message audio and a `Ping` signal.

For audio to work:

1. Enable audio in the GM panel.
2. Click the Infoczytnik player screen once.
3. Check system volume.
4. Send a test ping or test message with audio.

If audio does not work, the player screen most likely was not clicked after loading or the browser blocks autoplay.

## Ping

`Ping` immediately draws player attention.

It does not change message text. It only plays a sound on the player screen.

Use it sparingly so it keeps its effect.

## Preview mode

The GM panel may offer preview modes, for example:

- content preview,
- background preview.

Content preview helps check the final message appearance.

Background preview helps choose background and logo without text distraction.

## Clear message

`Clear message` clears the text field in the GM panel.

It does not necessarily remove the last message from the player screen. It is mainly used to prepare a new message in the panel.

## Restore defaults

`Restore defaults` is useful when the layout stops being readable after many experiments.

The button restores the base GM panel settings.

After restoring defaults, send a short test message.

## Update data from XLSX

`Update data from XLSX` refreshes source data used by the panel, such as lists of backgrounds, logos, fonts, fillers, or audio.

This is a maintenance function. During normal play, it is usually not needed.

Use it before a session or during tests if assets have changed.

## In-session workflow

1. Prepare the player screen and click it once to unlock audio.
2. Open the GM panel.
3. Pick a style for the scene.
4. Send a short test message.
5. Send real messages in short pieces.
6. Use `Ping` when you want attention.
7. Change background and logo when the type of transmission changes.
8. For longer texts, disable strong effects that make reading harder.

## Common problems and what to do

| Problem | Possible cause | What to do |
| --- | --- | --- |
| Message does not appear on player screen | No connection, stale session, or Firebase issue. | Refresh GM panel and player screen, then send again. |
| Audio does not play | Browser blocks autoplay or audio is disabled. | Click player screen once, enable `Audio`, check volume. |
| Ping does not play | Player screen audio is not unlocked. | Click the Infoczytnik screen and try again. |
| Text is unreadable | Wrong background, color, or font size. | Change color, increase font, or choose another background. |
| Message is too long | Text does not fit the display area well. | Split it into several shorter messages. |
| Appearance differs on projector | Different resolution or browser scaling. | Test the screen before play and use shorter texts. |
| Panel stops responding after a long time | Page or connection may have stalled. | Refresh GM panel and player screen. |
| A listed asset looks wrong | Source data may be outdated. | Use `Update data from XLSX` before play or contact admin. |

## Quick session workflow

1. Open `Infoczytnik/index.html`.
2. Open player screen and GM panel.
3. Click the player screen once to unlock audio.
4. In the GM panel, choose background, logo, and font.
5. Enable or disable effects.
6. Enter a short message.
7. Click `Send`.
8. Use `Ping` if players should immediately look at the screen.
9. When the scene changes, change style and send the next message.

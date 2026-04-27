# Wrath & Glory / Kozi przybornik

Strona główna projektu. Służy jako menu startowe do uruchamiania modułów Wrath & Glory.

## 🇵🇱 Instrukcja dla użytkownika (PL)

### Co zobaczysz po otwarciu strony
- Logo i siatkę przycisków modułów.
- W widoku zwykłym: Infoczytnik, Skarbiec Danych, Obrazki, Mapa, Kalkulator, Rzut kośćmi.
- W widoku administratora (`?admin=1`): dodatkowo Generator Nazw, Generator NPC i Audio.
- Czerwony przycisk **Włącz powiadomienia** pod siatką modułów.

### Jak uruchomić
1. Otwórz `Main/index.html`.
2. Jeśli chcesz widok administratora, dopisz do adresu: `?admin=1`.
3. Kliknij przycisk wybranego modułu.

### Co robi każdy element
- **Infoczytnik** – przejście do czytnika informacji (w adminie do menu modułu).
- **Skarbiec Danych (DataVault)** – baza danych sesyjnych.
- **Generator nazw** (admin) – losowanie nazw.
- **Generator NPC** (admin) – budowanie kart NPC.
- **Audio** (admin) – panel audio.
- **Obrazki** – otwiera kanał obrazków.
- **Mapa** – otwiera pokój mapy.
- **Kalkulator** – przejście do kalkulatora postaci/XP.
- **Rzut kośćmi** – moduł kości.
- **Włącz powiadomienia** – uruchamia zgodę przeglądarki i zapisuje subskrypcję push.

### Ważne zachowanie linków
- Linki modułów aplikacji otwierają się w tym samym oknie.
- Linki zewnętrzne (Mapa, Obrazki) otwierają nową kartę.

### Gdzie zmienić linki Mapa/Obrazki
- Edytuj plik: `Main/ZmienneHiperlacza.md`.
- Format wpisów:
  - `Mapa: https://...`
  - `Obrazki: https://...`

### PWA i powiadomienia
- Aplikacja korzysta z `manifest.webmanifest` i `service-worker.js`.
- Instalowana PWA startuje od `Main/index.html` (widok użytkownika).
- Przy braku internetu PWA działa online-first i pokazuje komunikat o wymaganym połączeniu.
- Powiadomienie push otwiera domyślnie `Infoczytnik/Infoczytnik.html`.

### Lokalny start
```bash
python -m http.server 8000
```
Potem otwórz: `http://localhost:8000/Main/index.html`.

---

## 🇬🇧 User instructions (EN)

### What you see on open
- A logo and a module button grid.
- In user view: DataSlate, DataVault, Images, Map, Calculator, DiceRoller.
- In admin view (`?admin=1`): plus Name Generator, NPC Generator, and Audio.
- A red **Enable notifications** button below the module grid.

### How to start
1. Open `Main/index.html`.
2. If you need admin view, append `?admin=1` to the URL.
3. Click the module you want.

### What each element does
- **DataSlate** – opens the information reader (in admin mode: module menu).
- **DataVault** – session data vault.
- **Name Generator** (admin) – name generation.
- **NPC Generator** (admin) – NPC card generation.
- **Audio** (admin) – audio panel.
- **Images** – opens the images channel.
- **Map** – opens the map room.
- **Calculator** – opens character/XP calculators.
- **DiceRoller** – dice module.
- **Enable notifications** – asks browser permission and stores a push subscription.

### Important link behavior
- App-module links open in the same window.
- External links (Map, Images) open in a new tab.

### Where to change Map/Images links
- Edit: `Main/ZmienneHiperlacza.md`.
- Entry format:
  - `Mapa: https://...`
  - `Obrazki: https://...`

### PWA and push notifications
- The app uses `manifest.webmanifest` and `service-worker.js`.
- Installed PWA starts at `Main/index.html` (user view).
- The app uses online-first behavior and shows an internet-required message when offline.
- Push notifications open `Infoczytnik/Infoczytnik.html` by default.

### Run locally
```bash
python -m http.server 8000
```
Then open: `http://localhost:8000/Main/index.html`.

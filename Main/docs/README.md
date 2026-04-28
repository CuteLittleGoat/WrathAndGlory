# Main — instrukcja użytkownika / User Guide

## 🇵🇱 Instrukcja dla użytkownika (PL)

### Do czego służy strona Main
Moduł **Main** to ekran startowy całego pakietu Wrath & Glory. Z tego miejsca uruchamiasz pozostałe moduły jednym kliknięciem.

### Jak otworzyć
1. Otwórz `Main/index.html`.
2. Jeśli potrzebujesz trybu rozszerzonego, dopisz do adresu `?admin=1`.

### Co zobaczysz w trybie standardowym
- Logo aplikacji.
- Siatkę przycisków modułów podstawowych.
- Czerwony przycisk **Włącz powiadomienia**.

### Co dodatkowo zobaczysz w trybie admin (`?admin=1`)
- Dodatkowe przyciski modułów: **Generator Nazw**, **Generator NPC**, **Audio**.
- Linki do modułów otwierają wersje rozszerzone tam, gdzie to obsługiwane.

### Co robi każdy przycisk
- **Infoczytnik** – przejście do modułu komunikatów.
- **Skarbiec Danych** – otwiera DataVault.
- **Generator Nazw** (admin) – uruchamia generator nazw.
- **Generator NPC** (admin) – uruchamia generator kart NPC.
- **Audio** (admin) – uruchamia moduł dźwięków.
- **Obrazki** – otwiera zewnętrzny link do kanału obrazków.
- **Mapa** – otwiera zewnętrzny link do mapy.
- **Kalkulator** – otwiera moduł kalkulatora.
- **Rzut kośćmi** – otwiera DiceRoller.
- **Włącz powiadomienia** – prosi przeglądarkę o zgodę i zapisuje subskrypcję.

### Jak korzystać podczas sesji
1. Otwórz Main jako „centrum sterowania”.
2. Wejdź do potrzebnego modułu jednym kliknięciem.
3. Wracaj do Main, gdy przełączasz się między narzędziami.
4. Jeśli prowadzisz sesję online i chcesz alerty, uruchom **Włącz powiadomienia**.

### Wskazówki
- **Mapa** i **Obrazki** otwierają się w nowej karcie.
- Pozostałe moduły działają jak zwykłe przejścia w ramach aplikacji.
- Gdy potrzebujesz opcji administracyjnych, zawsze sprawdź, czy adres kończy się na `?admin=1`.

---

### Ważne przy kopiowaniu modułu Main na inny serwer
Jeżeli kopiujesz aplikację dla innej grupy lub na inną domenę/serwer, **musisz zaktualizować linki zewnętrzne** używane przez przyciski **Mapa** i **Obrazki**.

Kroki:
1. Otwórz plik `Main/ZmienneHiperlacza.md`.
2. Podmień adresy URL dla pozycji odpowiadających mapie i obrazkom na nowe adresy docelowe.
3. Zapisz plik.
4. Odśwież `Main/index.html` i kliknij **Mapa** oraz **Obrazki**.
5. Sprawdź, czy otwierają właściwe strony dla nowej grupy.

---

## Konfiguracja dla wielu grup (oddzielne serwery)
Przy kopiowaniu modułu **Main** dla nowej grupy:
- Ustaw własne adresy dla **Mapa** i **Obrazki** w pliku `Main/ZmienneHiperlacza.md`.
- Sprawdź w `Main/index.html`, czy wszystkie odnośniki do modułów wskazują poprawne lokalizacje na nowym serwerze.
- Po zmianach odśwież stronę i kliknij każdy przycisk, aby potwierdzić poprawną nawigację.

---

## 🇬🇧 User instructions (EN)

### What Main is for
The **Main** module is the launcher for the whole Wrath & Glory toolkit. Open other modules from here with one click.

### How to open
1. Open `Main/index.html`.
2. For extended mode, append `?admin=1`.

### What you see in standard mode
- App logo.
- Grid of core module buttons.
- Red **Enable notifications** button.

### Extra in admin mode (`?admin=1`)
- Additional module buttons: **Name Generator**, **NPC Generator**, **Audio**.
- Where supported, links open extended/admin-capable module entry points.

### What each button does
- **Infoczytnik** – opens message display module.
- **DataVault** – opens knowledge/data browser.
- **Name Generator** (admin) – opens naming tool.
- **NPC Generator** (admin) – opens NPC card builder.
- **Audio** (admin) – opens sound effects module.
- **Images** – opens external images channel.
- **Map** – opens external map room.
- **Calculator** – opens calculator module.
- **DiceRoller** – opens dice module.
- **Enable notifications** – requests browser permission and stores push subscription.

### Session workflow suggestion
1. Keep Main open as your control center.
2. Open modules as needed with single clicks.
3. Return to Main when switching tools.
4. If you rely on alerts, enable notifications at session start.

### Tips
- **Map** and **Images** open in a new tab.
- Other modules open as standard in-app navigation.
- For admin-only options, verify URL includes `?admin=1`.

### Important when copying Main to another server
If you copy the app for a different group or another domain/server, you **must update external links** used by **Map** and **Images** buttons.

Steps:
1. Open `Main/ZmienneHiperlacza.md`.
2. Replace URLs for map/images entries with new target links.
3. Save the file.
4. Refresh `Main/index.html` and click **Map** and **Images**.
5. Confirm they open correct destinations for the new group.
## Multi-group setup (separate servers)
When copying the **Main** module for a new group:
- Set group-specific **Map** and **Images** URLs in `Main/ZmienneHiperlacza.md`.
- Verify in `Main/index.html` that all module links point to valid locations on the new server.
- Refresh the page and click every button to confirm navigation works correctly.

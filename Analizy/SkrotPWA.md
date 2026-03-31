# Analiza: skrót mobilny (`?admin=1`) oraz biała obramówka ikony
Data: 2026-03-31

## Prompt użytkownika
"Przeczytaj analizy:
Analizy/Analiza_biala_obramowka_ikony_skrotu_2026-03-29.md
Analizy/Analiza_skrot_vs_pwa_main_2026-03-29.md

Następnie przygotuj nową i nazwij ją \"SkrotPWA.md\".

Stan obecny:
1. Przez urządzenie mobilne wchodzę na stronę https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html
2. Tworzę skrót do strony (tworzy się ikona z białą obramówką)
3. Klikam na skrót i otwiera mi się strona https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html
4. Kasuję skrót
5. Przez urządzenie mobilne wchodzę na stronę https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html?admin=1
6. Tworzę skrót do strony (tworzy się ikona z białą obramówką)
7. Klikam na skrót i otwiera mi się strona https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html

Trzeba poprawić dwie rzeczy:

A. Jak tworzę skrót do strony z parametrem ?admin=1 to zapisany skrót musi się otwierać też z tym parametrem.
B. Zmień kod tak, żeby ikona nie tworzyła się z białą obramówką. Wcześniej (na tym samym pliku ikony) to działało.

Nie wprowadzaj zmian w kodzie. Przygotuj pełną analizę przyczyny błędów i sposobów ich rozwiązania."

---

## Materiał wejściowy i stan obecny (zweryfikowany)

1. W `manifest.webmanifest` aktualnie ustawione jest:
   - `start_url: "./Main/index.html"` (czyli tryb user, bez `?admin=1`),
   - dwa wpisy ikonowe dla `IkonaGlowna.png`:
     - `192x192`, `purpose: "any"`,
     - `512x512`, `purpose: "any maskable"`.
2. `Main/index.html` wykrywa admina wyłącznie po parametrze URL (`admin=1`) i dynamicznie pokazuje/ukrywa elementy admin-only.
3. `service-worker.js` ma fallback cache z `ignoreSearch: true` (dotyczy odpowiedzi offline, nie zmienia samego URL widocznego w pasku adresu).
4. `IkonaGlowna.png` ma PNG `color_type = 2` (RGB bez kanału alfa), 1024x1024.

---

## Problem A: skrót utworzony z `?admin=1` uruchamia wersję bez parametru

## Diagnoza przyczyny
To zachowanie jest spójne z mechaniką Android/Chrome dla stron z manifestem + service workerem:

- Na wielu urządzeniach opcja „Dodaj do ekranu głównego” nie tworzy już prostego bookmarka URL 1:1, tylko skrót typu „web app shortcut” oparty o manifest.
- Taki skrót często startuje z `manifest.start_url`, a nie z bieżącego URL strony, z której był tworzony.
- Ponieważ `start_url` jest obecnie `./Main/index.html`, skrót uruchamia user-view nawet jeśli był dodany na `...index.html?admin=1`.

Innymi słowy: **parametr admin nie „ginie” w JS aplikacji — jest nadpisany już na etapie sposobu uruchomienia skrótu przez launcher/przeglądarkę.**

## Czy `service-worker.js` jest główną przyczyną A?
Raczej nie jako przyczyna podstawowa.

- `ignoreSearch: true` może wpływać na to, która odpowiedź HTML jest zwracana offline,
- ale nie tłumaczy samodzielnie sytuacji, że skrót otwiera się od razu pod URL bez query.
- Głównym źródłem jest mechanika skrótu „app-like” i użycie `start_url`.

## Sposoby rozwiązania A

### Opcja A1 (najczystsza funkcjonalnie): jawny przycisk „Utwórz skrót admin” przez oddzielny URL/entry
Podejście:
- Rozdzielić punkt wejścia user/admin na poziomie adresów, np.:
  - user: `Main/index.html`
  - admin: `Main/admin.html` (lub `Main/index_admin.html`)
- Wtedy skrót ma stabilny, jednoznaczny adres bez query-param.

Plusy:
- najwyższa przewidywalność na różnych launcherach,
- najmniej zależne od niuansów `start_url`.

Minusy:
- wymaga utrzymania dodatkowego entrypointu.

### Opcja A2: dwa osobne manifesty (user i admin)
Podejście:
- userowy manifest z `start_url: ./Main/index.html`,
- adminowy manifest z `start_url: ./Main/index.html?admin=1`,
- podmiana `<link rel="manifest">` zależnie od bieżącego trybu.

Plusy:
- logicznie spójne z PWA.

Minusy:
- zachowanie „create shortcut” nadal częściowo zależne od konkretnej przeglądarki,
- większa złożoność i cache invalidation manifestów.

### Opcja A3: pozostawić jeden manifest (PWA zawsze user) + wymusić „klasyczny bookmark” dla admin
Podejście:
- Nie polegać na systemowym „Dodaj do ekranu głównego” dla admina.
- Dać instrukcję: w adminie zapisać URL jako zakładkę i dopiero z zakładki utworzyć skrót (na niektórych launcherach).

Plusy:
- brak przebudowy kodu.

Minusy:
- słabsze UX, niepewne między urządzeniami.

## Rekomendacja dla A
Jeśli wymaganie brzmi twardo: „skrót z admina zawsze ma uruchamiać admina”, **najpewniejsze jest A1 (oddzielny adres admin entrypoint)**. To minimalizuje zależność od heurystyk Chrome/launchera i od `start_url`.

---

## Problem B: biała obramówka ikony skrótu

## Diagnoza przyczyny
Obecna konfiguracja ikon zwiększa ryzyko białej obwódki/tła:

1. Ten sam plik `IkonaGlowna.png` jest użyty zarówno dla `purpose: "any"`, jak i `purpose: "any maskable"`.
2. Plik `IkonaGlowna.png` nie ma kanału alfa (`color_type = 2`, RGB), więc launcher nie ma „transparentnego marginesu” i może stosować własne wypełnienie/tło.
3. Ikona maskowalna powinna być przygotowana graficznie pod safe-zone (zwykle centralny motyw + margines bezpieczeństwa), a nie „ta sama bitmapa co any”.

To wyjaśnia, czemu „wcześniej działało”: różne wersje Chrome/Android/launchera mogły inaczej interpretować tę samą konfigurację. Obecnie pipeline ikon (masking/adaptive icon) jest bardziej restrykcyjny.

## Sposoby rozwiązania B

### Opcja B1 (docelowa, zalecana): dedykowana ikona maskowalna
- Przygotować osobny plik np. `IkonaGlowna-maskable-512.png`:
  - RGBA (z alpha),
  - projekt zgodny z safe-zone dla maskable icons,
  - rozmiar 512x512.
- W manifeście:
  - `purpose: "any"` -> zwykła ikona,
  - `purpose: "maskable"` -> nowy dedykowany plik.

### Opcja B2 (tymczasowa): usunąć `maskable`
- Zostawić tylko `purpose: "any"`.
- Często redukuje artefakty, ale nie daje gwarancji na wszystkich launcherach.

### Opcja B3: poprawić samą obecną bitmapę
- Nawet przy tym samym motywie graficznym przygotować nowy eksport z alpha i bez „twardych” krawędzi przy brzegu.
- To nadal słabsze niż pełna dedykowana maskable, ale lepsze niż obecny RGB bez alpha.

## Rekomendacja dla B
**B1** – osobna, poprawnie zaprojektowana ikona maskowalna + pozostawienie zwykłej ikony `any`.

---

## Plan testów po wdrożeniu poprawek (checklista)

1. Wyczyścić dane PWA i cache:
   - usunąć skróty,
   - odinstalować PWA,
   - wyczyścić dane witryny dla domeny GitHub Pages.
2. Test A (user):
   - otworzyć `.../Main/index.html`,
   - dodać skrót,
   - potwierdzić, że otwiera user URL.
3. Test A (admin):
   - otworzyć adres admin entrypoint (docelowy mechanizm),
   - dodać skrót,
   - potwierdzić, że otwiera admin URL.
4. Test PWA install:
   - zainstalować aplikację,
   - potwierdzić, że startuje zawsze w user.
5. Test B (ikona):
   - porównać ikonę skrótu/PWA na min. 2 urządzeniach lub 2 launcherach (np. Pixel Launcher + Samsung One UI),
   - potwierdzić brak białej obwódki.

---

## Podsumowanie końcowe

1. **Przyczyna A:** skrót mobilny jest uruchamiany przez mechanikę web-app/manifest i finalnie startuje z `start_url`, dlatego traci `?admin=1`.
2. **Przyczyna B:** ikona deklarowana jako maskowalna używa pliku, który nie jest przygotowany jako maskable (RGB bez alpha, brak dedykowanego safe-zone), co skutkuje białą obwódką/tłem na części launcherów.
3. **Najbardziej stabilna ścieżka naprawy:**
   - dla A: oddzielny, jednoznaczny entrypoint URL dla admina (zachować PWA start user),
   - dla B: nowa dedykowana ikona maskowalna + rozdzielenie wpisów `any`/`maskable`.

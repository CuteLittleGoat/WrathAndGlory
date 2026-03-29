# Analiza: biała obramówka ikony po utworzeniu skrótu

## Prompt użytkownika
"Przeprowadź analizę i odpowiedz na pytanie: czemu po utworzeniu skrótu do strony ikona wyświetla się w białej obramowce?"

## Zakres analizy
- `manifest.webmanifest`
- `Main/index.html`
- właściwości plików ikon: `IkonaGlowna.png`, `IkonaPowiadomien.png`

## Ustalenia techniczne
1. Strona główna ładuje manifest: `Main/index.html` zawiera `<link rel="manifest" href="../manifest.webmanifest">`.
2. Manifest ma ikonę oznaczoną jako `purpose: "any maskable"`, ale wskazuje ten sam plik (`IkonaGlowna.png`) co zwykła ikona.
3. `IkonaGlowna.png` jest plikiem PNG bez kanału alfa (RGB, pełne tło), więc nie jest przygotowana jako dedykowana ikona maskowalna.
4. Android/Chrome przy tworzeniu skrótu (szczególnie „dodaj do ekranu głównego” jako skrót przeglądarkowy) może renderować ikonę w kształcie narzuconym przez launcher (np. koło) i dodać tło/obwódkę ochronną, gdy obraz nie spełnia zasad safe-zone dla ikon maskowalnych.

## Odpowiedź na pytanie „dlaczego jest biała obramówka?”
Biała obramówka nie wynika z CSS strony, tylko z mechanizmu systemowego renderowania ikony skrótu przez launcher Androida/Chrome. Dzieje się tak, gdy ikona użyta do skrótu nie jest poprawnie przygotowana jako maskowalna (adaptive/maskable), albo gdy skrót jest tworzony w trybie, który i tak stosuje własną ramkę/tło.

## Rekomendacje
1. Przygotować osobny plik ikony maskowalnej (np. `IkonaGlowna-maskable-512.png`) z:
   - pełnym tłem sięgającym krawędzi,
   - głównym motywem w safe-zone (środkowe ~80%).
2. W manifeście zostawić dwa osobne wpisy:
   - `purpose: "any"` dla zwykłej ikony,
   - `purpose: "maskable"` dla dedykowanej ikony maskowalnej.
3. Po zmianie wyczyścić cache PWA/Chrome i usunąć stary skrót z ekranu, potem utworzyć go ponownie.
4. Testować dwa scenariusze osobno:
   - instalacja PWA,
   - zwykły skrót przeglądarkowy (mogą wyglądać inaczej na części launcherów).

## Wniosek końcowy
Źródłem białej obramówki jest sposób, w jaki launcher Androida komponuje ikonę skrótu (adaptive icon treatment), a nie błąd layoutu strony. Najbardziej prawdopodobna przyczyna to brak dedykowanej, poprawnie zaprojektowanej ikony maskowalnej używanej przez manifest.

# DiceRoller — dokumentacja techniczna

## 1. Cel modułu
`DiceRoller` to frontendowy moduł do symulowania testów kości w systemie Wrath & Glory. Aplikacja:
- pobiera trzy wartości wejściowe od użytkownika,
- wykonuje losowanie wyników kości (1–6),
- przelicza punkty sukcesu,
- wyznacza status testu (sukces/porażka),
- oblicza możliwe przeniesienie (shift),
- wyświetla podsumowanie w języku PL lub EN.

## 2. Zakres technologiczny
- HTML + CSS + JavaScript (bez frameworków).
- Brak backendu.
- Brak integracji z Firebase/Firestore/Auth.
- Brak lokalnej bazy danych (brak `localStorage`/`sessionStorage` dla wyników).

> Odtworzenie 1:1 wymaga wyłącznie odtworzenia trzech plików modułu i ich wzajemnych odwołań.

## 3. Struktura plików
- `DiceRoller/index.html` — struktura widoku i kontenery na dane.
- `DiceRoller/style.css` — layout, motyw, style pól/przycisków, kości i animacje.
- `DiceRoller/script.js` — logika walidacji, tłumaczeń, rzutu i podsumowania.
- `DiceRoller/docs/README.md` — instrukcja użytkownika (PL/EN).
- `DiceRoller/docs/Documentation.md` — niniejsza dokumentacja techniczna.

## 4. HTML — architektura widoku (`index.html`)
### 4.1 Kluczowe sekcje
- `main.app` — główny kontener modułu.
- `.language-switcher` — przełącznik języka + przycisk powrotu do modułu Main.
- `header.app__header` — tytuł i podtytuł.
- `section.panel` — trzy pola liczbowe + przycisk rzutu.
- `section.results` — kontener kości i panel podsumowania.

### 4.2 Wejścia użytkownika
Pola typu `number`:
- `#difficulty` — stopień trudności,
- `#pool` — pula kości,
- `#wrath` — liczba kości furii.

Wszystkie pola mają ograniczenia 1–99 i są dodatkowo walidowane w JS.

## 5. CSS — layout i styl (`style.css`)
### 5.1 Motyw
Moduł używa zielonego motywu terminalowego spójnego z resztą projektu:
- ciemne tło,
- zielone obramowania i akcenty,
- monospace’owe fonty,
- glow na aktywnych elementach.

### 5.2 Układ
- Kontener `.app` ma centralne pozycjonowanie i stałą maksymalną szerokość.
- Panel `.panel` działa jako responsywny grid.
- Na ekranach mobilnych przełącznik języka przechodzi do układu statycznego.

### 5.3 Kości i animacja
- Kość (`.die`) ma wariant biały i czerwony.
- Każda kość renderuje 7 punktów (`.pip`) + znak zapytania (`.die__question`).
- Klasy `face-1` … `face-6` sterują widocznymi punktami.
- W trakcie `rolling` punkty są ukryte, a widoczny jest znak zapytania.

## 6. JavaScript — logika aplikacji (`script.js`)
### 6.1 Stałe i stan
Najważniejsze stałe:
- zakres wejść: 1–99,
- domyślne wartości: `difficulty=3`, `pool=2`, `wrath=1`,
- czas animacji rzutu: ~900 ms.

Stan obejmuje:
- aktualny język,
- bieżące wartości pól,
- wynik ostatniego rzutu (prezentowany w DOM).

### 6.2 Warstwa i18n
Obiekt tłumaczeń zawiera etykiety i komunikaty dla PL/EN.
Zmiana języka:
1. aktualizuje teksty interfejsu,
2. ustawia `lang` dokumentu,
3. resetuje pola i panel wyników.

### 6.3 Walidacja danych wejściowych
- Funkcje pomocnicze „clamp/sanitize” wymuszają zakres 1–99.
- Reguła relacyjna: `wrath <= pool`.
- Walidacja wywoływana przy zmianie pól oraz przed wykonaniem rzutu.

### 6.4 Algorytm rzutu
1. Tworzenie `pool` elementów kości w DOM.
2. Oznaczenie pierwszych `wrath` kości jako czerwone.
3. Start animacji.
4. Po zakończeniu animacji losowanie wartości 1–6 dla każdej kości.
5. Obliczenie punktów:
   - 1–3 => 0 pkt,
   - 4–5 => 1 pkt,
   - 6 => 2 pkt.
6. Obliczenie sukcesu: `totalPoints >= difficulty`.
7. Obliczenie przeniesienia:
   - `margin = totalPoints - difficulty`,
   - `totalSixes = liczba wyrzuconych 6`,
   - `possibleShift = min(totalSixes, floor(margin / 2))`, ale nie mniej niż 0.
8. Render podsumowania tekstowego.

### 6.5 Logika kości furii
- **Komplikacja Furii**: występuje, gdy przynajmniej jedna czerwona kość ma wynik 1.
- **Krytyczna Furia**: występuje, gdy wszystkie czerwone kości mają wynik 6.
- Jeśli czerwonych kości brak, komunikaty furii nie są wyświetlane.

## 7. Integracje zewnętrzne
- Brak komunikacji HTTP do API biznesowego.
- Brak Firebase.
- Brak plików konfiguracyjnych środowiska.

## 8. Odtworzenie modułu 1:1 (checklista)
1. Odtwórz strukturę katalogu `DiceRoller/`.
2. Wstaw pliki `index.html`, `style.css`, `script.js` z tymi samymi selektorami i identyfikatorami.
3. Zachowaj:
   - trzy pola wejściowe (difficulty/pool/wrath),
   - przycisk rzutu,
   - kontener kości,
   - kontener podsumowania,
   - przełącznik języka i przycisk powrotu.
4. Odwzoruj mapowanie punktów i wzór przeniesienia.
5. Odwzoruj animację z ukryciem punktów i widocznym `?`.
6. Zweryfikuj działanie w PL i EN.

## 9. Test regresji po zmianach
Minimalny zestaw testów manualnych:
1. Ustaw `difficulty=3`, `pool=2`, `wrath=1`, wykonaj rzut — brak błędów w konsoli.
2. Ustaw `pool=2`, wpisz `wrath=5` — wartość furii zostaje skorygowana do 2.
3. Zmień język PL -> EN — etykiety zmieniają się i formularz resetuje.
4. Sprawdź mobilnie (<600 px) — układ pozostaje czytelny i responsywny.

## 10. Firebase / Node.js bootstrap
Dla tego modułu **nie dotyczy**:
- brak Firebase,
- brak wymaganej struktury kolekcji,
- brak skryptu Node.js do bootstrapu danych.
## 11. Specyfikacja wizualna 1:1 (dokładne wartości, bez skrótów)
Poniższa sekcja zastępuje ogólne opisy typu „ciemne tło / zielone akcenty” konkretnymi parametrami:

### 11.1. Kolory i efekty
- Tło strony (`--bg`) to 3 warstwy:  
  `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%),`  
  `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%),`  
  `#031605`.
- Tło panelu: `#000`.
- Główna ramka i akcent: `#16c60c`.
- Ciemniejszy akcent focus/active: `#0d7a07`.
- Tekst podstawowy: `#9cf09c`.
- Tekst pomocniczy (`--muted`): `rgba(156, 240, 156, 0.7)`.
- Glow panelu: `0 0 25px rgba(22, 198, 12, 0.45)`.
- Focus ring pól/selectów: `0 0 0 2px rgba(22, 198, 12, 0.25)`.
- Hover przycisku rzutu: `background: rgba(22, 198, 12, 0.14)`, cień `0 0 18px rgba(22, 198, 12, 0.3)`.
- Active przycisku rzutu: `background: rgba(22, 198, 12, 0.22)`.

### 11.2. Kolory kości
- Kość zwykła: tło `#f6f6f6`, oczka `#111111`, obramowanie `#1c1c1c`.
- Kość furii: tło `#c01717`, oczka `#ffffff`, obramowanie `#650909`.
- Cień kości: `inset 0 0 10px rgba(0, 0, 0, 0.2), 0 6px 14px rgba(0, 0, 0, 0.35)`.

### 11.3. Typografia i rozmiary
- Globalny stos fontów: `"Consolas", "Fira Code", "Source Code Pro", monospace`.
- `h1`: `30px`, uppercase, `letter-spacing: 0.05em`.
- Label pól: `13px`, `font-weight: 600`, uppercase.
- Wejścia liczbowe: `16px`.
- Przycisk rzutu: `15px`, `font-weight: 600`, uppercase.

## 12. Mapa funkcji JS (pełna lista odpowiedzialności)
- `clampValue(value, min, max)` – ogranicza liczby do zakresu 1..99.
- `sanitizeField(input)` – normalizuje pojedyncze pole (`parseInt` + clamp + zapis do DOM).
- `syncPoolAndWrath()` – pilnuje reguły `wrath <= pool`.
- `createDieElement(isWrath)` – buduje strukturę DOM pojedynczej kości (7 oczek + znak `?`).
- `setDieFace(die, value)` – przełącza klasę `face-1..face-6`.
- `rollDie()` – zwraca liczbę losową 1..6.
- `scoreValue(value)` – mapuje wynik kości na punkty (1-3=0, 4-5=1, 6=2).
- `buildSummary(payload)` – renderuje pełne podsumowanie testu (nagłówek, furia, shift, lista kości).
- `resetState()` – resetuje formularz i panel wyników do wartości domyślnych.
- `updateLanguage(lang)` – podmienia wszystkie etykiety PL/EN i resetuje stan.
- `handleRoll()` – orkiestracja całego rzutu: walidacja, animacja, losowanie, obliczenia, render.

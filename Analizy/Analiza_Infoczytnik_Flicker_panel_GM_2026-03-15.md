# Analiza modułu „Infoczytnik” — checkbox „Flicker” w panelu GM

## Prompt użytkownika
> „Przeprowadź analizę modułu "Infoczytnik". Sprawdź mi działanie checkbox "Flicker" w panelu GM. Co on robi? Co miał robić? Czy prawidłowo działa? Nie zmieniaj kodu. Przeprowadź analizę.”

## Zakres analizy
- Pliki przeanalizowane:
  - `Infoczytnik/GM_test.html`
  - `Infoczytnik/Infoczytnik_test.html`
  - `Infoczytnik/docs/README.md`
  - `Infoczytnik/docs/Documentation.md`
- Brak zmian w kodzie modułu (wyłącznie analiza).

## Co robi checkbox „Flicker” (stan faktyczny)
1. W panelu GM istnieje checkbox `#flicker`, domyślnie zaznaczony (`checked`).
2. Jego wartość jest zapisywana do Firestore jako pole `flicker: true/false` przy akcjach:
   - **Wyślij** (`type: "message"`)
   - **Wyczyść ekran** (`type: "clear"`)
   - **Ping** (`type: "ping"`)
3. W widoku gracza (`Infoczytnik_test.html`) pole `flicker` jest odczytywane z dokumentu Firestore i mapowane na:
   - `true` (lub brak pola) => efekt flicker **włączony**
   - `false` => efekt flicker **wyłączony**
4. Przełączenie odbywa się funkcją `setFlickerState(shouldFlicker)`:
   - dla `false`: dodanie klasy `.no-flicker` do `#screen`
   - dla `true`: usunięcie klasy `.no-flicker`
5. Warstwa CSS odpowiedzialna za efekt:
   - `.screen::after` ma `animation: flickerBg 9s infinite`
   - `.screen.no-flicker::after` ma `animation: none`

## Bardzo dokładny opis efektu CRT powiązanego z checkboxem „Flicker”

Poniżej rozdzielam cały „look CRT” na osobne warstwy, bo to ważne: checkbox `Flicker` nie wyłącza wszystkich efektów CRT — wyłącza wyłącznie jedną warstwę (migotanie jasności na `.screen::after`).

### 1) Pełny stack efektów CRT w `Infoczytnik_test.html`
Wizualizacja „ekranu CRT” jest złożeniem kilku nakładających się warstw:

1. **Scanlines + powolny ruch** na `.crt::before`:
   - `repeating-linear-gradient(...)` tworzy poziome prążki.
   - `animation: scanMove 12s linear infinite` przesuwa pattern pionowo.
   - To daje efekt „płynięcia” linii skanowania, niezależny od checkboxa.

2. **Stała winieta / glow panelu** na `.crt::after`:
   - mieszanka radialnego gradientu i półprzezroczystej bieli.
   - buduje przyciemnienie rogów i lekki „szklisty” nalot.
   - też niezależne od checkboxa.

3. **Warstwa flicker na obszarze treści** `.screen::after`:
   - to właśnie ta warstwa jest kontrolowana checkboxem.
   - ma własny radialny gradient + białą poświatę.
   - kluczowe: zmienia **opacity** w czasie przez `@keyframes flickerBg`.

4. **Treść (`prefix`, `msg`, `suffix`) ponad overlayami**:
   - dzięki `z-index` elementy tekstowe są rysowane nad warstwą `.screen::after`.
   - flicker więc wizualnie „oddycha” całym obszarem ekranu, ale nie przykrywa czytelności tekstu.

### 2) Co dokładnie animuje `flickerBg`
Animacja ma cykl **9 sekund** i jest zapętlona (`infinite`).

Deklaracja klatek:
- `0%, 92%, 100% { opacity: .65 }`
- `93% { opacity: .55 }`
- `95% { opacity: .72 }`
- `97% { opacity: .60 }`

Interpretacja:
- Przez zdecydowaną większość cyklu overlay ma stabilną jasność (`0.65`).
- W końcówce cyklu pojawia się sekwencja krótkich „szarpnięć” jasności:
  - szybkie przygaszenie (`0.55`),
  - potem podbicie (`0.72`),
  - i lekkie cofnięcie (`0.60`),
  - powrót do stanu bazowego (`0.65`).
- Daje to subtelny, nieregularnie odczuwany „CRT flicker pulse”, a nie ciągłe agresywne miganie.

### 3) Co robi checkbox od strony semantyki i DOM
- Checkbox nie manipuluje samymi keyframes i nie zmienia stylu inline.
- Jedyna operacja to togglowanie klasy `no-flicker` na elemencie `#screen`.
- To oznacza:
  - HTML struktura się nie zmienia,
  - pseudo-element `.screen::after` dalej istnieje,
  - zmienia się tylko jego właściwość `animation` (`flickerBg` vs `none`).

Praktyczny skutek:
- **Flicker ON**: overlay pulsuje wg keyframes.
- **Flicker OFF**: overlay pozostaje statyczny (z ostatnio wynikającą opacnością bazową z reguły `.screen::after`), bez zmian w czasie.

### 4) Czego checkbox NIE kontroluje
To kluczowe dla poprawnej oceny:
- Nie kontroluje `.crt::before` (scanlines + `scanMove`).
- Nie kontroluje `.crt::after` (winieta/glow ramki CRT).
- Nie kontroluje cienia tekstu (`text-shadow`) ani typografii.

Czyli po wyłączeniu checkboxa ekran nadal wygląda „CRT-like”, ale bez dynamicznego migotania jasności warstwy `.screen::after`.

### 5) Zakres działania i moment zastosowania
Checkbox działa **pośrednio przez Firestore**:
- stan jest publikowany przy `sendMessage`, `ping`, `clear`;
- gracz widzi zmianę po odebraniu snapshotu i wywołaniu `setFlickerState`.

Nie ma live-bindu on-change na samym checkboxie, więc:
- kliknięcie bez akcji wysyłającej nie spowoduje natychmiastowego efektu po stronie gracza.

## Co „miał robić” (intencja z UI i dokumentacji)
- Z punktu widzenia użytkownika checkbox „Flicker” ma pełnić funkcję przełącznika efektu CRT flicker na ekranie gracza (on/off).
- Dokumentacja użytkownika (`README`) opisuje to jako opcjonalne „Włącz/wyłącz ... efekt flicker”.
- Dokumentacja techniczna (`Documentation`) również opisuje dokładnie ten mechanizm (`setFlickerState`, `.screen.no-flicker::after`).

Wniosek: zamierzona funkcja to globalne sterowanie animacją flicker w renderze Infoczytnika.

## Czy działa prawidłowo?
### Odpowiedź krótka
- **Tak — działa prawidłowo funkcjonalnie**, tj. poprawnie zapisuje stan i poprawnie przełącza animację flicker po stronie ekranu gracza.

### Doprecyzowanie (ważny niuans UX)
- Zmiana samego checkboxa w panelu GM **nie wysyła się automatycznie** (brak listenera, który natychmiast robi zapis).
- Nowy stan jest zastosowany dopiero po wykonaniu akcji wysyłającej dane do Firestore: **Wyślij / Ping / Wyczyść ekran**.
- To oznacza, że jeśli MG tylko kliknie checkbox i nic więcej nie zrobi, na ekranie gracza nic się nie zmieni.

To zachowanie jest spójne z aktualną implementacją, ale część użytkowników może oczekiwać natychmiastowego efektu „live toggle”.

## Ocena końcowa
- **Implementacja logiczna: poprawna.**
- **Zgodność z dokumentacją: poprawna.**
- **Techniczny zakres checkboxa: poprawny, ale ograniczony do warstwy `.screen::after` (nie całego pipeline CRT).**
- **Potencjalne źródło nieporozumień: brak natychmiastowej synchronizacji po samym kliknięciu checkboxa (bez wysyłki).**

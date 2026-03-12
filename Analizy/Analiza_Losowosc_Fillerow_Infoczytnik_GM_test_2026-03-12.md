# Analiza modyfikacji: sekcja „Losowość fillerów” w `Infoczytnik/GM_test.html`

## Prompt użytkownika
> Przeprowadź analizę modyfikacji sekcji "Losowość fillerów" w Infoczytnik/GM_test.html
>
> W pliku Infoczytnik/docs/Prefixy_i_Suffixy.txt mam nowy spis prefixów i suffixów dla każdej z frakcji.
> One zawsze będą losowe, więc panel do wyboru konkretnego prefixu i suffixu jest niepotrzebny.
> Zamiast tego dodaj "ilość linii fillerów" ze strzałkami wyboru od 1 do 5 (tak jak teraz wybiera się numer prefixu i suffixu).
> Domyślna wartość 3
> Wybór jakiejś wartości spowoduje wylosowanie tylu unikatowych prefixów i tylu unikatowych suffixów z puli dla danej frakcji (danego template) - ważne, żeby się nie powtarzały.
> Obok zrób przycisk "wylosuj ponownie". Jego naciśnięcie ma spowodować wylosowanie ponownie prefixów i suffixów.
> Wylosowane prefixy i suffixy mają być widoczne w podglądzie w panelu GM. Dokładnie te same będą musiały być wysłane do panelu graczy.
> Przeprowadź analizę wprowadzenia tej funkcjonalności.

---

## 1) Stan obecny (as-is)

1. W `GM_test.html` sekcja „Losowość fillerów” ma przełącznik „Losuj automatycznie” oraz ręczne pola `Prefix` i `Suffix` (indeksy 1..N).  
2. `computePreview()` przy włączonym auto losuje **po jednym** indeksie prefix/suffix (`rand1to`), a przy ręcznym trybie używa wartości pól.  
3. `sendMessage()` ponownie losuje indeksy (gdy auto aktywne), więc to co wysłane może różnić się od tego, co chwilę wcześniej było w preview GM (potencjalna niespójność UX).  
4. Do Firestore wysyłane są tylko `prefixIndex` i `suffixIndex`; panel gracza (`Infoczytnik_test.html`) rekonstruuje tekst po indeksach.

Wniosek: obecny model jest jednowierszowy (1 prefix + 1 suffix) i indeksowy, a nie listowy.

---

## 2) Zakres wymaganej zmiany (to-be)

Zgodnie z wymaganiem użytkownika:

1. Usunięcie manualnego wyboru numeru `Prefix/Suffix` i samego przełącznika „Losuj automatycznie” (losowość ma być zawsze aktywna).  
2. Dodanie nowego kontrolera `ilość linii fillerów` (input number/spinner) z zakresem `1..5`, domyślnie `3`.  
3. Dodanie przycisku `Wylosuj ponownie`, który przebudowuje zestaw fillerów bez zmiany pozostałych ustawień.  
4. Losowanie dla wybranej frakcji:
   - `N` unikatowych prefixów,
   - `N` unikatowych suffixów,
   - bez powtórzeń w obrębie odpowiednio prefixów i suffixów.
5. Dokładnie ten sam zestaw ma być:
   - widoczny w preview GM,
   - wysłany do gracza,
   - wyświetlony po stronie `Infoczytnik_test.html`.

---

## 3) Kluczowe decyzje projektowe

### A. Model danych przesyłanych do Firestore
Najbezpieczniej przejść z modelu indeksowego na jawny model tekstowy/listowy:

- `fillerLineCount: number` (1..5)
- `prefixLines: string[]`
- `suffixLines: string[]`
- (opcjonalnie dla kompatybilności tymczasowej) pozostawić stare pola `prefixIndex/suffixIndex` jako fallback.

**Dlaczego tak:** gwarantuje 1:1 zgodność między preview GM i panelem gracza (ten sam payload, brak ponownego losowania po drodze).

### B. Moment losowania
Losowanie powinno następować **wyłącznie w momentach kontrolowanych**:

- zmiana frakcji,
- zmiana `ilość linii fillerów`,
- klik `Wylosuj ponownie`,
- inicjalizacja ekranu.

I wynik losowania przechowywany w stanie (np. `state.currentFillers`) używanym jednocześnie przez preview i `sendMessage()`.

### C. Algorytm unikatowego losowania
Dla każdej puli (prefix/suffix):

1. Kopia tablicy,
2. Fisher-Yates shuffle,
3. `slice(0, N)`.

To daje unikatowość bez złożonych pętli i jest stabilne wydajnościowo.

---

## 4) Zmiany UI/UX do wykonania

1. W panelu „Losowość fillerów”:
   - usunąć checkbox „Losuj automatycznie”,
   - usunąć inputy `Prefix` i `Suffix`,
   - dodać input `Ilość linii fillerów` (`min=1`, `max=5`, `value=3`),
   - dodać przycisk `Wylosuj ponownie`.
2. Opis pomocniczy (`randomHint`) zaktualizować na nową logikę (brak trybu ręcznego).
3. W preview GM pokazać wiele linii:
   - prefixy jako blok wielu linii nad wiadomością,
   - suffixy jako blok wielu linii pod wiadomością.

Uwaga implementacyjna: istniejące elementy `livePreviewPrefix` i `livePreviewSuffix` są pojedynczymi `<span>`. Dla wielu linii wygodniej użyć kontenerów i renderu przez `\n` + `white-space: pre-line` lub przez wiele `<div>/<span>`.

---

## 5) Zmiany logiki w `GM_test.html`

1. Zastąpić obecną logikę `computePreview()` tak, aby:
   - nie losowała „na żądanie” przy każdym wywołaniu bez pamięci,
   - korzystała z aktualnie wylosowanego stanu.
2. Dodać funkcję np. `rerollFillers()`:
   - pobiera aktywną frakcję,
   - bierze `N` z kontrolki,
   - losuje 2 zbiory unikatowe (prefix/suffix),
   - zapisuje do stanu,
   - odświeża preview.
3. `sendMessage()` ma wysyłać **aktualny stan wylosowany** (`prefixLines/suffixLines`) bez dodatkowego losowania.
4. Listener’y zdarzeń:
   - `faction change` -> `rerollFillers()`
   - `fillerLineCount input/change` -> walidacja + `rerollFillers()`
   - `reroll button click` -> `rerollFillers()`

---

## 6) Zmiany po stronie `Infoczytnik_test.html`

1. Odbiór nowego payloadu:
   - jeżeli istnieją `prefixLines/suffixLines`, renderować je jako wieloliniowe bloki,
   - fallback do starego trybu indeksowego dla kompatybilności wstecznej.
2. Aktualna funkcja `showMessage(prefix, text, suffix)` jest 1-liniowa — potrzebna adaptacja do wersji wieloliniowej (np. `showMessage(prefixBlock, text, suffixBlock)`).
3. Trzeba zadbać o zachowanie styli (`--prefix-font-size`, `--suffix-font-size`, kolory) dla wszystkich linii w blokach.

---

## 7) Zależność od `Prefixy_i_Suffixy.txt`

Plik zawiera rozszerzone listy prefixów/suffixów per frakcja i powinien być źródłem aktualnych treści.  
W praktyce wymagane będzie zsynchronizowanie stałych `FILLERS` w:

- `Infoczytnik/GM_test.html`,
- `Infoczytnik/Infoczytnik_test.html`.

Dodatkowo warto rozważyć wyniesienie wspólnego źródła danych (jeden plik JS/JSON ładowany przez oba panele), aby uniknąć rozjazdów.

---

## 8) Ryzyka i punkty kontrolne

1. **Niespójność GM vs gracz** — jeśli losowanie nadal będzie uruchamiane oddzielnie w `sendMessage()`, wynik się rozjedzie.  
2. **Regresja layoutu** — więcej linii może powodować przepełnienie obszaru wiadomości (szczególnie przy większym foncie).  
3. **Kompatybilność danych** — starsze wiadomości/formaty dokumentu Firestore powinny nadal dać się wyświetlić.  
4. **i18n** — nowe etykiety/przyciski muszą wejść do słowników PL/EN.

---

## 9) Proponowany plan wdrożenia (kolejność)

1. Refaktor modelu danych fillerów w `GM_test.html` (stan + `rerollFillers`).
2. Zmiana UI sekcji „Losowość fillerów” i tłumaczeń PL/EN.
3. Adaptacja preview GM do wieloliniowych bloków.
4. Zmiana payloadu w `sendMessage()` na `prefixLines/suffixLines`.
5. Adaptacja `Infoczytnik_test.html` do odbioru i renderu wieloliniowego + fallback legacy.
6. Synchronizacja list fillerów z `docs/Prefixy_i_Suffixy.txt`.
7. Testy manualne end-to-end (GM -> Firestore -> Gracz), w tym scenariusze: N=1, N=3, N=5, zmiana frakcji, reroll wielokrotny.

---

## 10) Kryteria akceptacji

1. Brak manualnego wyboru pojedynczych indeksów Prefix/Suffix.  
2. Jest kontrolka `ilość linii fillerów` 1..5, domyślnie 3.  
3. Jest przycisk `Wylosuj ponownie`.  
4. Wylosowane prefixy i suffixy są unikatowe w obrębie danego wysłania.  
5. Preview w GM pokazuje dokładnie to, co po wysłaniu widzi gracz.  
6. Działa dla wszystkich frakcji/template.  
7. Działa dwujęzyczność dla nowych elementów UI.


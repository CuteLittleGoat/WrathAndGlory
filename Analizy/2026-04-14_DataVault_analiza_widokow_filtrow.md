# Analiza modułu DataVault — widoki filtrów (2026-04-14)

## Prompt użytkownika

> Przeprowadź analizę modułu DataVault.
>
> Chcę:
>
> 1. Zmienić nazwę przycisku "Reset Widoku" na "Pełen Widok".
> 2. Dodać obok nowy przycisk "Widok Domyślny".
>
> 3. Aplikacja (zarówno w widoku użytkownika jak i admina) uruchamiałaby się w "Widoku Domyślnym". Widok domyślny miałby zaznaczone filtry w niektórych kolumnach w niektórych zakładkach (lista będzie dodana później z możliwością rozbudowy/edycji).
>
> 4. Kliknięcie w przycisk "Pełen Widok" zresetowałoby widok tabel odsłaniając wszystkie dane (tak jakby wszystkie checkboxy w filtrach były zaznaczone).
> 5. Kliknięcie w przycisk "Widok Domyślny" zresetowałby widok tabel ukrywając niektóre dane (zgodnie z definicjami zapisanymi w pkt3)
>
> 6. Użytkownik w dalszym ciągu będzie mieć pełną dowolność filtrowania i sortowania danych w tabelach.
> 7. Stan checboxów (zaznaczony/odznaczony) musi się zapisywać między przechodzeniem między zakładkami, ale w obrębie użytkownika. Po resecie aplikacji/przeglądarki wróci stan domyślny. Celem jest, żeby dwóch użytkowników na dwóch różnych urządzeniach mogło korzystać z aplikacji i ustawiać filtry niezależnie od siebie - do czasu resetu urządzenia.
> Przykładowo:
> Użytkownik 1 - w zakładce Ekwipunek ustawia filtr w kolumnie TYP na "Ulepszenia Broni"
> Użytkownik 2 (na swoim urządzeniu, niezależnym od tego na którym pracuje Użytkownik 1) - w zakładce Ekwipunek ustawia filtr w kolumnie TYP na "Amunicja"
>
> Następnie Użytkownik 1 przechodzi na zakładkę Archetypy a Użytkownik 2 przechodzi na zakładkę Cechy.
>
> Następnie Użytkownik 1 i Użytkownik 2 przechodzą na zakładkę Ekwipunek.
> Użytkownik 1 - wciąż ma filtr w kolumnie TYP na "Ulepszenia Broni"
> Użytkownik 2 (na swoim urządzeniu, niezależnym od tego na którym pracuje Użytkownik 1) - wciąż ma filtr w kolumnie TYP na "Amunicja"
>
> Sprawdź czy takie rozwiązanie w obecnym modelu jest możliwe.

---

## Wynik analizy (skrót)

Tak — rozwiązanie jest możliwe w obecnym modelu aplikacji i nie wymaga przebudowy architektury (wystarczy rozszerzenie obecnego stanu `view` oraz logiki przełączania zakładek i resetów).

## Co jest teraz

1. Jest jeden przycisk resetu `btnReset` i jedna akcja „twardego” resetu widoku (czyści sortowanie, wyszukiwarkę globalną, filtry tekstowe, filtry checkboxowe, zaznaczenia, rozwinięcia komórek). To już jest blisko semantyki przyszłego „Pełen Widok”.
2. Przy zmianie zakładki (`selectSheet`) aktualny stan filtrów i sortowania jest zerowany (`view.filtersText = {}`, `view.filtersSet = {}`, itd.), więc dziś filtr nie utrzymuje się między zakładkami.
3. Tryb admin/user działa w tym samym kodzie (flaga `ADMIN_MODE` z URL), więc mechanizm widoków może działać identycznie w obu trybach.

## Wymagania vs możliwość realizacji

### 1) Zmiana etykiety „Reset Widoku” -> „Pełen Widok”

Możliwe bez ryzyka: to zmiana i18n + tekstu przycisku i tytułu.

### 2) Dodanie nowego przycisku „Widok Domyślny”

Możliwe: w topbarze jest już grupa przycisków; dodanie drugiego przycisku obok obecnego resetu jest proste.

### 3) Start aplikacji zawsze w „Widoku Domyślnym”

Możliwe: po załadowaniu `data.json` i po wyborze pierwszej zakładki można zastosować predefiniowane filtry per-zakładka/per-kolumna.

### 4) „Pełen Widok” = wszystkie wartości zaznaczone

Możliwe i spójne z obecnym kodem, bo logika filtra listowego już interpretuje „wszystko zaznaczone” jako brak ograniczenia (`view.filtersSet[col] = null`).

### 5) „Widok Domyślny” = konkretne ukrycia wg definicji

Możliwe: można trzymać konfigurację domyślną np. jako obiekt mapujący `sheet -> column -> allowedValues` i z niego odtwarzać `filtersSet`.

### 6) Zachowanie pełnej swobody filtrowania/sortowania

Możliwe: po zastosowaniu widoku domyślnego użytkownik może dalej modyfikować filtry lokalnie, bo obecny model filtrów jest interaktywny i reaguje na zmiany UI.

### 7) Trwałość tylko w obrębie użytkownika/urządzenia do restartu

Możliwe i zgodne z wymaganiem „po resecie przeglądarki wraca domyślny” pod warunkiem użycia `sessionStorage` (a nie `localStorage`).

- `sessionStorage` jest izolowane per karta/sesja przeglądarki i urządzenie.
- Dwaj użytkownicy na dwóch urządzeniach będą mieli całkowicie niezależne stany.
- Po zamknięciu przeglądarki/sesji stan znika, więc wraca domyślny.

## Minimalny zakres zmian technicznych

1. **UI/i18n**
   - zmiana klucza/etykiety „Reset widoku” -> „Pełen Widok” (PL) i „Full View” (EN),
   - dodanie przycisku `btnDefaultView` + tłumaczeń i tooltipów.

2. **Model stanu**
   - zastąpienie „jednego globalnego stanu tabeli” przez stan per zakładka, np.:
     - `viewBySheet[sheetKey] = { filtersText, filtersSet, sort, global? }`.
   - przy `selectSheet(name)` odczyt stanu tej zakładki zamiast zerowania.

3. **Definicja widoku domyślnego**
   - dodać obiekt konfiguracyjny (łatwy do rozbudowy), np. `DEFAULT_VIEW_CONFIG`.
   - funkcja `applyDefaultViewToAllSheets()` oraz `applyFullViewToAllSheets()`.

4. **Persistencja sesyjna**
   - serializacja stanu filtrów/sortowania do `sessionStorage` przy każdej zmianie,
   - deserializacja przy starcie,
   - walidacja względem aktualnych kolumn/wartości (na wypadek zmiany `data.json`).

5. **Spójność admin/user**
   - ten sam mechanizm dla obu trybów; różnica tylko w liście widocznych zakładek.

## Ryzyka i uwagi

1. Nazwy zakładek/kolumn pochodzą z danych i mogą się zmieniać — konfigurację domyślną trzeba oprzeć na stabilnych kluczach (np. znormalizowane nazwy `canonKey`).
2. Dla dużych zakładek częste zapisy do `sessionStorage` warto lekko debounce’ować.
3. Trzeba jasno zdefiniować, czy „Widok Domyślny” resetuje też:
   - sortowanie,
   - wyszukiwanie globalne,
   - filtry tekstowe,
   - zaznaczenia do porównania.
   (Rekomendacja: tak, reset pełny do profilu domyślnego).

## Odpowiedź na pytanie „czy to możliwe w obecnym modelu?”

**Tak, jest możliwe.** Obecny model DataVault już ma fundamenty (stan `view`, filtry checkboxowe, reset, wspólny kod admin/user). Brakuje głównie:
- stanu per-zakładka,
- dwóch trybów resetu („Pełen” i „Domyślny”),
- persistencji sesyjnej (`sessionStorage`),
- konfigurowalnej mapy domyślnych filtrów.

To są zmiany ewolucyjne, nie re-architektura.

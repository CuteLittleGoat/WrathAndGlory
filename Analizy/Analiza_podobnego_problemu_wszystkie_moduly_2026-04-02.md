# Analiza ryzyka problemu „kliknięta zakładka, ale ta sama treść” dla całego repozytorium WrathAndGlory

## Prompt użytkownika (pełny kontekst)
Przeczytaj analizę: Analizy/Odswiezanie.md
I przeprowadź pełną analizę kodu aplikacji (wszystkich modułów).
Analiza Analizy/Odswiezanie.md dotyczy problemu w innej aplikacji. Jest tam problem polegajacy na tym, że jak użytkownik klika zakładki (które miały wyświetlać różne tabele) to widać, że zakładka jest kliknięta, ale aplikacja wyświetla wszędzie takie same tabele z taką samą zawartością.
Analiza Analizy/Odswiezanie.md bada ten problem i sugeruje rozwiązanie.

Przeczytaj ją bardzo wnikliwie a następnie sprawdź kod aplikacji (wszystkie moduły) i sprawdź czy podobny problem może tutaj wystąpić.

---

## Co zostało przeanalizowane
- `Analizy/Odswiezanie.md` (wzorzec problemu i mechanika błędu).
- Moduły frontendowe:
  - `Main`
  - `DataVault`
  - `GeneratorNPC`
  - `Audio`
  - `Infoczytnik`
  - `GeneratorNazw`
  - `DiceRoller`
  - `Kalkulator`
- Warstwa PWA/SW:
  - `service-worker.js` (globalny dla repo).

---

## Wniosek ogólny (krótko)
**Tak, podobny objaw jest możliwy w tym repo, ale nie z jednego źródła i nie we wszystkich modułach.**

1. **Scenariusz cache/SW z analizy referencyjnej (Odswiezanie.md) jest tu obecnie dużo mniej prawdopodobny** niż w tamtym przypadku, bo globalny SW działa jako **network-first z fallbackiem offline**, a nie cache-first dla wszystkich GET.
2. **Najbardziej realny „lokalny odpowiednik” objawu „wszędzie to samo” występuje w module `GeneratorNPC`**, ale z innego powodu: fallbackowa logika wyszukiwania kolekcji (`getCollection`/`findCollectionInNode`) może zwrócić ten sam pierwszy znaleziony zbiór rekordów dla wielu sekcji, jeżeli heurystyka dopasowania nazw sekcji nie trafi poprawnie.
3. `DataVault` (jedyny moduł z klasycznymi zakładkami tabel) ma logikę przełączania zaimplementowaną poprawnie i ma zabezpieczenie `renderToken` przeciwko wyścigom renderowania.

---

## Ocena per moduł

## 1) Main
- To launcher modułów + rejestracja SW.
- Brak przełączania wielu tabel w ramach jednego widoku.
- Nie znaleziono mechanizmu zakładek, który mógłby pokazać „aktywną zakładkę, ale tę samą tabelę”.

**Ocena ryzyka:** niskie.

---

## 2) DataVault (najważniejszy moduł pod kątem „zakładek tabel”)

### Co działa poprawnie
- Zakładki są budowane dynamicznie (`initUI`) i każda zakładka wywołuje `selectSheet(name)`.
- `selectSheet`:
  - ustawia `currentSheet`,
  - resetuje sort/filtry/zaznaczenia,
  - buduje nowy szkielet tabeli,
  - uruchamia `renderBody()`.
- Aktywność zakładki jest aktualizowana jawnie po nazwie (`.tab.active`).
- Rendering jest chunkowany i chroniony `renderToken`, co zabezpiecza przed nadpisaniem nowego widoku przez starszy render asynchroniczny.

### Co to oznacza dla badanego problemu
- W aktualnym kodzie **nie widać** błędu klasy „klik działa, ale zawsze ten sam dataset w tabeli” wynikającego z logiki przełączania.
- Mechanika jest deterministyczna i ma zabezpieczenie przed race condition.

**Ocena ryzyka:** niskie.

---

## 3) GeneratorNPC (największe ryzyko „podobnego” objawu)

To nie są klasyczne zakładki, ale wiele modułów-sekcji z osobnymi tabelami. Tu pojawia się analogiczne ryzyko „wszędzie to samo”.

### Kluczowy punkt ryzyka
Logika pobierania kolekcji z `data.json` opiera się na funkcjach:
- `getCollection(db, keywords)`
- `findCollectionInNode(node, keywords, visited)`
- `extractRecords(section)`

W `findCollectionInNode` dla tablic istnieje fallback:
- po nieudanym dopasowaniu sekcji po słowach kluczowych,
- kod iteruje sekcje i potrafi zwrócić **pierwsze niepuste `records`**, niezależnie od tego, czy to właściwa sekcja dla bieżących keywords.

Skutek uboczny:
- jeśli struktura/etykiety danych wejściowych zmienią się tak, że matching nazw sekcji nie zadziała,
- kolejne wywołania `getCollection` (dla broni, pancerzy, ekwipunku, itd.) mogą dostać ten sam fallbackowy zbiór,
- objaw użytkownika będzie bardzo podobny do opisanego: „różne sekcje pokazują to samo”.

### Dodatkowy czynnik ryzyka architektonicznego
`GeneratorNPC` czyta wspólny `DataVault/data.json`, więc każde odchylenie schematu nazw sekcji lub struktury może propagować problem do kilku tabel naraz.

**Ocena ryzyka:** średnie (w normalnych danych zwykle działa; przy zmianie struktury danych możliwa regresja o objawie „wszędzie to samo”).

---

## 4) Audio
- Ma przełączanie widoków użytkownika (`main`/`favorites`) i listy, ale renderuje różne kontenery i listy jawnie.
- Nie ma wzorca „jedna wspólna tabela podmieniana zakładkami” analogicznego do problemu z Odswiezanie.

**Ocena ryzyka:** niskie.

---

## 5) Infoczytnik
- `Infoczytnik.html`: pojedynczy widok odczytu, aktualizowany przez Firestore `onSnapshot`.
- `GM.html`: panel konfiguracji/preview, ale nie „system zakładek tabel” jak w analizowanym incydencie.
- Dodatkowo jest auto-cache-busting wersją (`?v=...`) po stronie `Infoczytnik.html`, co ogranicza ryzyko niespójnej wersji tej konkretnej strony.

**Ocena ryzyka:** niskie.

---

## 6) GeneratorNazw
- Generator proceduralny bez zakładek tabel i bez wielowidokowego renderu danych z wielu arkuszy.

**Ocena ryzyka:** bardzo niskie.

---

## 7) DiceRoller
- Brak zakładek i brak wielosekcyjnych tabel.

**Ocena ryzyka:** bardzo niskie.

---

## 8) Kalkulator
- Strony statyczne/formularzowe, bez dynamicznego przełączania wielu tabel przez panel zakładek.

**Ocena ryzyka:** bardzo niskie.

---

## Warstwa PWA/SW vs analiza z Odswiezanie.md

W analizie referencyjnej problem był mocno związany z cache-first i niespójnością wersji app-shell.

W tym repo (aktualny stan):
- globalny `service-worker.js` używa **fetch z sieci jako pierwszej próby**,
- dopiero przy błędzie sieciowym robi fallback do cache (`caches.match`).

To istotnie zmniejsza ryzyko dokładnie tego samego scenariusza „stary JS + nowy HTML” jako głównej przyczyny.

**Wniosek:** mechanizm z Odswiezanie.md nie znika całkowicie (zawsze istnieje pewne ryzyko cache/platformy), ale **nie jest tutaj dominującym podejrzanym**.

---

## Czy „ten sam typ problemu” może wystąpić tutaj?

## Tak, ale głównie w dwóch wariantach

1. **GeneratorNPC / mapowanie kolekcji z heurystyką fallbackową**
   - najbardziej realistyczny odpowiednik objawu „różne sekcje pokazują to samo”.

2. **Warstwa dystrybucji/cache (niższe ryzyko niż w analizie referencyjnej)**
   - możliwe różnice środowiskowe między urządzeniami/PWA vs karta,
   - ale przy obecnym network-first to mniej prawdopodobne jako główne źródło.

---

## Zalecane testy diagnostyczne (bez zmian kodu)

1. **GeneratorNPC — test rozróżnialności sekcji**
   - po załadowaniu danych sprawdzić, czy liczności `state.armor/state.weapons/state.equipment/...` różnią się sensownie,
   - porównać pierwsze rekordy każdej kolekcji (czy nie są identyczne referencyjnie lub semantycznie).

2. **GeneratorNPC — test odporności na zmianę schematu**
   - uruchomić na kontrolnie zmodyfikowanym JSON (inna nazwa sekcji, drobne różnice kluczy),
   - potwierdzić, czy heurystyka nie wpada w „pierwszą lepszą” kolekcję.

3. **DataVault — test zakładek smoke**
   - przejść wszystkie zakładki i potwierdzić zmianę:
     - nazwy kolumn,
     - liczby wierszy,
     - zestawu danych.

4. **PWA/cache — test środowiskowy**
   - na urządzeniu mobilnym i desktop:
     - hard refresh,
     - clear storage,
     - porównanie zachowania modułów po świeżym starcie.

---

## Finalny werdykt

- **Wprost ten sam problem jak w Odswiezanie.md (głównie cache-first SW) nie jest tu obecnie najbardziej prawdopodobny.**
- **Najbardziej podobny technicznie efekt „wszędzie to samo” może pojawić się w `GeneratorNPC`,** jeśli dopasowanie kolekcji do sekcji nie zadziała i uruchomi się fallback zwracający pierwszy pasujący zbiór rekordów.
- `DataVault` (moduł stricte „zakładkowy”) ma obecną logikę przełączania i renderu zaprojektowaną poprawnie; ryzyko analogicznego błędu jest tam niskie.

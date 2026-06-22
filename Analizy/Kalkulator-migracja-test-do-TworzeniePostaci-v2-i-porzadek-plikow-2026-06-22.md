# Analiza migracji `test.html` do `TworzeniePostaci_v2.html` i uporządkowania plików Kalkulatora

**Data analizy:** 2026-06-22  
**Repozytorium:** `CuteLittleGoat/WrathAndGlory`  
**Moduł:** `Kalkulator`  
**Status:** analiza przed implementacją; w ramach tego zadania nie zmieniono kodu aplikacji

---

## Oryginalny pełny prompt użytkownika

> Sprawdziłem zapis i odczyt w pliku "test.html". Zapisuje się i wczytuje prawidłowo z Firebase. Przyciski "zapisz lokalnie", "wczytaj lokalnie" oraz "reset" nie są potrzebne. Układ przycisków w "test.html" ma być podobny jak w pliku produkcyjnym "TworzeniePostaci.html".
> Z tym, że dwa nowe przyciski "Cechy i zasady specjalne" oraz "Eksportuj PDF" mają być obok napisu "Atrybuty".
> Trzeba usunąć też żółty komunikat "Zapisano w Firebase: character_builder/test-v2. Produkcyjny dokument current nie został zmieniony." i zastąpić go modalem jak w "TworzeniePostaci.html" (załączam screena).
> Kasujemy też dopisek " — test" przy tytule "Tworzenie Postaci".
> Zmieniamy też nazwę pliku z test.html na "TworzeniePostaci_v2.html" - trzeba to poprawić też w innych plikach, które odnoszą się do starej nazwy "test.html".
> Trzeba przeprowadzić analizę modyfikacji "test" na "TworzeniePostaci_v2.html".
> Docelowo oba kalkulatory będą utrzymywane równolegle.
> Z pliku index.html będzie przejście do starej lub nowej wersji.
>
> Przeprowadź też analizę zrobienia porządku w plikach związanych z testami. Czy potrzebny jest dodatkowy loader?
> Chciałbym, żeby TworzeniePostaci_v2.html było możliwie małą i lekką aplikacją.
> Wyniki analizy zapisz w nowym pliku w folderze Analizy/

Do promptu dołączono dwa zrzuty ekranu przedstawiające układ produkcyjnego `TworzeniePostaci.html` oraz modal potwierdzenia zapisu.

---

## 1. Zakres analizy

Analiza obejmuje:

- zmianę statusu wersji testowej na równolegle utrzymywaną wersję 2;
- zmianę punktu wejścia z `Kalkulator/test.html` na `Kalkulator/TworzeniePostaci_v2.html`;
- zmianę układu przycisków;
- usunięcie lokalnego zapisu, lokalnego odczytu oraz resetu;
- zastąpienie technicznego komunikatu Firebase modalem zgodnym wizualnie i funkcjonalnie z wersją produkcyjną;
- ocenę zasadności `test-loader.js` i `test-core.html`;
- ocenę obecnego podziału odpowiedzialności między plikami;
- propozycję docelowej lekkiej architektury;
- identyfikację aktywnych odwołań do nazw testowych;
- ocenę wpływu zmian na starą wersję `TworzeniePostaci.html` i jej dokument Firestore.

---

## 2. Aktualny stan techniczny

### 2.1. Produkcyjna wersja 1

Plik:

```text
Kalkulator/TworzeniePostaci.html
```

korzysta z dokumentu Firestore:

```text
character_builder/current
```

Wersja produkcyjna ma własny układ przycisków, własny modal potwierdzeń i osobny schemat zapisu.

### 2.2. Obecna wersja testowa

Aktualny punkt wejścia:

```text
Kalkulator/test.html
```

jest tylko małą stroną startową. Ładuje:

```text
Kalkulator/test-loader.js
```

Loader pobiera:

```text
Kalkulator/test-core.html
```

następnie modyfikuje jego treść przez wyszukiwanie dokładnych ciągów tekstowych, dodaje biblioteki Firebase, przyciski Firebase i skrypt:

```text
Kalkulator/test-firebase.js
```

Na końcu zastępuje cały bieżący dokument przez `document.open()`, `document.write()` i `document.close()`.

### 2.3. Firebase wersji testowej

Obecna wersja testowa korzysta z dokumentu:

```text
character_builder/test-v2
```

oraz zapisuje metadane:

```text
schemaVersion: 2
module: Kalkulator/test
```

Izolacja od wersji produkcyjnej działa prawidłowo. Test użytkownika potwierdził, że zapis i odczyt z Firebase działają.

### 2.4. Lokalny zapis

`test-core.html` nadal zawiera logikę `localStorage`, w tym klucz:

```text
wng-test-character-calculator-v1
```

oraz przyciski:

```text
Zapisz lokalnie
Wczytaj lokalnie
Reset
```

Po potwierdzeniu prawidłowego działania Firebase ta druga ścieżka zapisu nie jest już potrzebna.

### 2.5. Eksport PDF

Plik:

```text
Kalkulator/vendor/pdf-lib.min.js
```

nie jest obecnie wyłącznie biblioteką vendor. Zawiera jednocześnie:

- loader CDN dla `pdf-lib`;
- loader CDN dla `fontkit`;
- adres fontu Noto Sans;
- modyfikację `window.open`;
- całą logikę zbierania danych z formularza;
- obliczenia cech;
- mapowanie pól PDF;
- układ kolumnowy tekstu;
- obsługę podglądu i eksportu PDF.

Nazwa pliku sugeruje czystą bibliotekę zewnętrzną, ale faktyczna odpowiedzialność jest znacznie szersza. Jest to jeden z głównych punktów wymagających uporządkowania.

---

## 3. Wniosek główny

`test-loader.js` nie jest potrzebny w docelowej wersji `TworzeniePostaci_v2.html`.

Aktualny loader był użyteczny jako tymczasowa warstwa pozwalająca dołączyć Firebase do zachowanego pliku testowego bez bezpośredniej przebudowy dużego HTML. Po uznaniu wersji za osobną, stale utrzymywaną aplikację jego zalety znikają.

Loader nie zmniejsza rzeczywistej aplikacji. Mały `test.html` pobiera później `test-loader.js`, `test-core.html`, Firebase oraz kod PDF. Łączna ilość pobranych i przetworzonych danych jest większa, a nie mniejsza.

Dodatkowo loader:

- dodaje osobne żądanie sieciowe po HTML;
- opóźnia zbudowanie właściwego interfejsu;
- wymaga chwilowej strony „Uruchamianie wersji testowej…”;
- używa kruchego mechanizmu `replaceExactlyOnce` zależnego od dokładnej postaci HTML;
- może przestać działać po zwykłym przeformatowaniu kodu;
- nadpisuje cały dokument przez `document.write`;
- utrudnia diagnostykę błędów i śledzenie kolejności ładowania;
- nie daje korzyści użytkowej w stabilnej wersji 2.

**Rekomendacja:** właściwy dokument HTML powinien być bezpośrednim punktem wejścia. Nie należy tworzyć kolejnego loadera strony.

Dopuszczalna jest natomiast mała funkcja leniwego ładowania ciężkich zależności, szczególnie bibliotek PDF. Taka funkcja powinna znajdować się w module eksportu PDF, a nie w osobnym ogólnym loaderze HTML.

---

## 4. Zalecana docelowa struktura plików

### 4.1. Wariant rekomendowany

```text
Kalkulator/
├── TworzeniePostaci.html
├── TworzeniePostaci_v2.html
├── TworzeniePostaci_v2-core.js
├── TworzeniePostaci_v2-firebase.js
├── TworzeniePostaci_v2-pdf.js
├── kalkulatorxp.css
├── config/
│   ├── firebase-config.js
│   ├── firestore.rules
│   └── FirebaseV2README.md
├── pdf/
│   ├── pl.pdf
│   └── en.pdf
└── vendor/
    ├── pdf-lib.min.js
    ├── fontkit.umd.min.js
    └── NotoSans-Regular.ttf
```

Znaczenie plików:

| Plik | Odpowiedzialność |
| --- | --- |
| `TworzeniePostaci_v2.html` | struktura interfejsu, modale, przyciski i odwołania do skryptów |
| `TworzeniePostaci_v2-core.js` | obliczenia PD, tabele, dynamiczne talenty, zasady specjalne, stan interfejsu |
| `TworzeniePostaci_v2-firebase.js` | wyłącznie zapis, odczyt, walidacja schematu i komunikacja z Firestore |
| `TworzeniePostaci_v2-pdf.js` | wyłącznie generowanie i podgląd PDF |
| `vendor/pdf-lib.min.js` | niezmodyfikowana biblioteka `pdf-lib` |
| `vendor/fontkit.umd.min.js` | niezmodyfikowana biblioteka `fontkit` |

Taki podział nie zwiększa rzeczywistego ciężaru aplikacji. Przeciwnie, pozwala przeglądarce buforować pliki oraz ładować część PDF dopiero wtedy, gdy użytkownik kliknie eksport.

### 4.2. Wariant minimalnej liczby plików

Możliwe jest pozostawienie logiki podstawowej wewnątrz `TworzeniePostaci_v2.html` i użycie tylko dwóch skryptów zewnętrznych:

```text
TworzeniePostaci_v2.html
TworzeniePostaci_v2-firebase.js
TworzeniePostaci_v2-pdf.js
```

Wariant ten ma mniej plików, ale większy i trudniejszy w utrzymaniu HTML. Nie jest rekomendowany jako rozwiązanie długoterminowe.

### 4.3. Znaczenie słowa „mała”

Mały plik HTML nie oznacza automatycznie małej aplikacji. Obecny `test.html` jest bardzo mały, ale tylko dlatego, że właściwa aplikacja jest pobierana później przez loader.

Dla użytkownika ważniejsze są:

- łączna liczba pobranych bajtów;
- liczba żądań koniecznych przed pokazaniem interfejsu;
- brak blokującego `document.write`;
- opóźnione ładowanie ciężkich funkcji;
- brak dublowania logiki zapisu;
- brak nieużywanych funkcji testowych.

---

## 5. Plan zmian nazw i usuwania plików testowych

### 5.1. Docelowe mapowanie

| Stan obecny | Stan docelowy | Działanie |
| --- | --- | --- |
| `test.html` | `TworzeniePostaci_v2.html` | utworzyć właściwy punkt wejścia, a stary plik usunąć po testach |
| `test-core.html` | zawartość rozdzielona między `TworzeniePostaci_v2.html` i `TworzeniePostaci_v2-core.js` | usunąć po migracji |
| `test-loader.js` | brak odpowiednika | usunąć |
| `test-firebase.js` | `TworzeniePostaci_v2-firebase.js` | zmienić nazwę, komentarze, stałe modułu i komunikaty |
| kod eksportu w `vendor/pdf-lib.min.js` | `TworzeniePostaci_v2-pdf.js` | przenieść kod aplikacyjny poza katalog `vendor` |
| `vendor/pdf-lib.min.js` | właściwa biblioteka vendor | pozostawić tylko kod biblioteki |

W GitHub zmiana nazwy jest technicznie realizowana jako utworzenie nowego pliku i usunięcie starego. Usunięcie starych plików powinno nastąpić dopiero po potwierdzeniu, że bezpośrednie wejście `TworzeniePostaci_v2.html` działa.

### 5.2. Pliki historyczne w `Analizy/`

Nie należy masowo zmieniać nazw w starych analizach i changelogach z 19 czerwca. Opisują one rzeczywisty historyczny etap `test.html`.

Nowa analiza powinna być traktowana jako dokument nadrzędny dla kolejnego etapu. Aktualizacji wymagają bieżące dokumentacje użytkowe i techniczne, a nie wszystkie historyczne raporty.

---

## 6. Zmiany interfejsu

### 6.1. Nagłówek strony

Widoczny nagłówek powinien zostać zmieniony z:

```text
Tworzenie Postaci — test
```

na:

```text
Tworzenie Postaci
```

W tytule karty przeglądarki można użyć:

```text
Wrath & Glory — Tworzenie Postaci v2
```

Nie powinno być widocznych określeń „test”, „testowe” ani technicznej nazwy dokumentu Firebase.

### 6.2. Górny układ

Układ ma nawiązywać do `TworzeniePostaci.html`:

- po lewej tytuł, pula PD i pozostałe PD;
- bezpośrednio pod pulą PD przyciski `Zapisz` i `Wczytaj`;
- po prawej przyciski `Instrukcja`, `Strona Główna` i `Maksymalne wartości atrybutów`;
- nie dodawać pozornego przełącznika języka, dopóki wersja 2 nie ma pełnej obsługi drugiego języka.

Przyciski Firebase powinny mieć neutralne etykiety użytkowe:

```text
Zapisz
Wczytaj
```

Nie powinny zawierać dopisku `Firebase`, `test-v2` ani ścieżki Firestore.

### 6.3. Przyciski przy nagłówku Atrybuty

Nagłówek sekcji powinien mieć wspólny wiersz:

```text
ATRYBUTY                           [Cechy i zasady specjalne] [Eksportuj PDF]
```

Rekomendowany układ techniczny:

```html
<div class="section-heading-row">
  <h2 class="section-title">Atrybuty</h2>
  <div class="section-heading-actions">
    <button type="button" id="openCharacterRulesModalButton">Cechy i zasady specjalne</button>
    <button type="button" id="exportCharacterPdfButton">Eksportuj PDF</button>
  </div>
</div>
```

Na wąskim ekranie przyciski powinny zawijać się pod nagłówek zamiast zmniejszać tabelę Atrybutów.

### 6.4. Usunięcie lokalnych akcji

Należy całkowicie usunąć:

```text
Zapisz lokalnie
Wczytaj lokalnie
Reset
```

Usunięcie powinno obejmować nie tylko HTML, lecz także:

- stałą `storageKey`;
- funkcje zapisu do `localStorage`;
- funkcje odczytu z `localStorage`;
- event listenery lokalnego zapisu i odczytu;
- logikę przycisku reset;
- komunikaty związane z lokalnym zapisem;
- dokumentację lokalnego fallbacku.

Pozostawienie niewidocznej logiki nie ma uzasadnienia i niepotrzebnie zwiększa kod oraz liczbę możliwych źródeł stanu.

---

## 7. Modal zapisu i odczytu

### 7.1. Wymagane zachowanie

Kliknięcie `Zapisz` powinno:

1. otworzyć modal potwierdzenia zgodny z produkcyjnym `TworzeniePostaci.html`;
2. wyświetlić tytuł `Potwierdzenie zapisu`;
3. wyświetlić pytanie `Czy na pewno chcesz zapisać aktualny stan postaci?`;
4. pokazać ilustrację `Modal_Icon.png`;
5. udostępnić przyciski `Tak` i `Nie`;
6. po potwierdzeniu wykonać zapis do dokumentu wersji 2;
7. po sukcesie otworzyć modal informacyjny z komunikatem `Stan postaci został zapisany.`;
8. po błędzie otworzyć modal z czytelnym komunikatem błędu.

Analogicznie powinien działać przycisk `Wczytaj`.

### 7.2. Usuwany komunikat

Należy usunąć komunikat:

```text
Zapisano w Firebase: character_builder/test-v2. Produkcyjny dokument current nie został zmieniony.
```

Ścieżka dokumentu Firestore jest szczegółem technicznym i nie powinna być prezentowana użytkownikowi w głównym interfejsie. Może pozostać w komunikacie `console.info` przeznaczonym do diagnostyki.

### 7.3. Pole `warningMessage`

Obecnie `test-firebase.js` wykorzystuje górne pole `warningMessage` do komunikatów Firebase. Po przejściu na modale należy sprawdzić, czy pole ma jeszcze inne aktywne zastosowanie.

Jeżeli nie jest używane przez obliczenia, powinno zostać usunięte. Ostrzeżenia cech pochodnych pozostają w `derivedWarnings`, a techniczne ostrzeżenia PDF pozostają w ukrytym logu PDF.

---

## 8. Firebase i równoległe utrzymywanie dwóch kalkulatorów

### 8.1. Izolacja

Docelowy układ powinien zachować pełną izolację:

```text
TworzeniePostaci.html     -> character_builder/current
TworzeniePostaci_v2.html  -> osobny dokument wersji 2
```

Zmiany w wersji 2 nie powinny odczytywać ani zapisywać `character_builder/current`.

### 8.2. Docelowa nazwa dokumentu

Obecna nazwa:

```text
character_builder/test-v2
```

jest bezpieczna technicznie, ale po zmianie statusu aplikacji staje się myląca.

Rekomendowana docelowa nazwa:

```text
character_builder/v2
```

Alternatywnie można użyć `character_builder/current-v2`, lecz krótsze `v2` jest wystarczająco jednoznaczne przy pozostawieniu starego dokumentu `current`.

### 8.3. Migracja danych

Zmiana dokumentu Firestore nie jest automatycznym przemianowaniem. Firestore wymaga zapisania kopii danych pod nowym identyfikatorem.

Najbezpieczniejszy przebieg:

1. najpierw przebudować stronę i usunąć loader, pozostawiając tymczasowo `test-v2`;
2. potwierdzić działanie interfejsu, PDF i zapisu;
3. dodać regułę dla `character_builder/v2`;
4. skopiować potrzebne dane z `test-v2` do `v2` albo wykonać pierwszy nowy zapis;
5. zmienić `DOCUMENT_NAME` na `v2`;
6. zmienić pole `module` na:

```text
Kalkulator/TworzeniePostaci_v2
```

7. po potwierdzeniu usunąć dostęp do `test-v2` i opcjonalnie sam dokument testowy.

Jeżeli istniejący zapis testowy ma zostać zachowany, przejściowa wersja może akceptować oba identyfikatory modułu podczas jednego odczytu. Po ponownym zapisie powinna zapisać już nową wartość. Kod migracyjny powinien zostać później usunięty, aby finalna aplikacja pozostała prosta.

### 8.4. Reguły Firestore

Aktualne reguły pozwalają na:

```text
character_builder/current
character_builder/test-v2
```

Przejście na `character_builder/v2` wymaga zmiany i ponownego wdrożenia reguł. Sama zmiana pliku w repozytorium nie aktualizuje reguł aktywnych w Firebase.

---

## 9. Lekkie ładowanie zależności

### 9.1. Rdzeń aplikacji

HTML, CSS i podstawowe obliczenia powinny ładować się natychmiast. Rdzeń nie powinien czekać na PDF ani Firebase.

Skrypty podstawowe powinny korzystać z `defer` albo modułów ES:

```html
<script src="./TworzeniePostaci_v2-core.js" defer></script>
<script src="./TworzeniePostaci_v2-firebase.js" defer></script>
<script src="./TworzeniePostaci_v2-pdf.js" defer></script>
```

### 9.2. PDF

Biblioteki PDF i font są najcięższą częścią wersji 2. Nie są potrzebne użytkownikowi, który tylko liczy PD lub zapisuje postać.

Rekomendacja:

- nie ładować `pdf-lib`, `fontkit` i fontu w `<head>`;
- załadować je dopiero po pierwszym kliknięciu `Eksportuj PDF`;
- po pierwszym załadowaniu zachować gotową obietnicę, aby kolejne eksporty nie pobierały zależności ponownie;
- używać plików lokalnych z `vendor`, jeżeli aplikacja ma działać przewidywalnie bez CDN.

Do tego nie jest potrzebny osobny `test-loader.js`. Wystarczy mała funkcja `ensurePdfDependencies()` w `TworzeniePostaci_v2-pdf.js`.

### 9.3. Firebase

Firebase można:

- ładować przez zwykłe skrypty `defer`, co jest prostsze;
- albo ładować dopiero po kliknięciu `Zapisz` lub `Wczytaj`, co zmniejsza początkowy transfer.

Dla możliwie lekkiego startu rekomendowane jest leniwe ładowanie Firebase wewnątrz `TworzeniePostaci_v2-firebase.js`. Nie wymaga to ogólnego loadera strony.

---

## 10. Aktywne odwołania do starej nazwy

Podczas implementacji trzeba sprawdzić i zaktualizować aktywne pliki zawierające odniesienia do `test.html`, `Kalkulator/test`, `test-v2` lub nazw testowych.

### 10.1. Pliki aplikacji

```text
Kalkulator/test.html
Kalkulator/test-loader.js
Kalkulator/test-core.html
Kalkulator/test-firebase.js
Kalkulator/vendor/pdf-lib.min.js
```

### 10.2. Dokumentacja aktywna

```text
Kalkulator/config/FirebaseTestREADME.md
Kalkulator/docs/README.md
Kalkulator/docs/Documentation.md
Kalkulator/config/FirebaseREADME.md
DetaleLayout.md
```

`FirebaseTestREADME.md` powinien zostać zastąpiony dokumentem opisującym stałą wersję 2, np.:

```text
Kalkulator/config/FirebaseV2README.md
```

albo jego treść powinna zostać włączona do głównego `FirebaseREADME.md`.

### 10.3. Nawigacja

Plik:

```text
Kalkulator/index.html
```

obecnie prowadzi tylko do `TworzeniePostaci.html`. Docelowo powinien udostępniać dwa jednoznaczne wejścia, np.:

```text
Tworzenie Postaci — wersja klasyczna
Tworzenie Postaci v2
```

Zmiana `index.html` powinna nastąpić dopiero po pełnym teście bezpośredniego `TworzeniePostaci_v2.html`.

### 10.4. Historyczne analizy

Stare pliki w `Analizy/` mogą zachować historyczne nazwy. Nie są aktywnymi zależnościami aplikacji.

---

## 11. Zakres uprawnień potrzebny do przyszłej implementacji

Obecnie wskazany zakres edycji obejmuje:

```text
Analizy/*
Kalkulator/vendor/pdf-lib.min.js
Kalkulator/test.html
Kalkulator/test-firebase.js
Kalkulator/test-core.html
Kalkulator/test-loader.js
```

Pełne wdrożenie rekomendowanej architektury wymagałoby dodatkowo zezwolenia na tworzenie lub modyfikowanie:

```text
Kalkulator/TworzeniePostaci_v2.html
Kalkulator/TworzeniePostaci_v2-core.js
Kalkulator/TworzeniePostaci_v2-firebase.js
Kalkulator/TworzeniePostaci_v2-pdf.js
Kalkulator/index.html
Kalkulator/config/firestore.rules
Kalkulator/config/FirebaseTestREADME.md lub FirebaseV2README.md
Kalkulator/docs/README.md
Kalkulator/docs/Documentation.md
DetaleLayout.md
```

Wymóg aktualizacji dokumentacji i `DetaleLayout.md` wynika ze standardów repozytorium, ponieważ planowana zmiana dotyczy zarówno działania modułu, Firebase, jak i układu interfejsu.

---

## 12. Zalecana kolejność implementacji

### Etap 1 — bezpieczna konsolidacja

1. Utworzyć `TworzeniePostaci_v2.html` z właściwej zawartości `test-core.html`.
2. Dołączyć Firebase bezpośrednio, bez `test-loader.js`.
3. Zachować tymczasowo dokument `character_builder/test-v2`.
4. Usunąć z interfejsu lokalny zapis, lokalny odczyt i reset.
5. Usunąć powiązaną logikę `localStorage`.
6. Usunąć dopisek `— test`.
7. Ustawić układ przycisków zgodnie z wymaganiem.
8. Dodać modale zapisu, odczytu, sukcesu i błędu.
9. Potwierdzić działanie Firebase i PDF.

### Etap 2 — porządek w plikach

1. Przenieść logikę rdzenia do `TworzeniePostaci_v2-core.js`.
2. Zmienić `test-firebase.js` na `TworzeniePostaci_v2-firebase.js`.
3. Przenieść logikę eksportu z `vendor/pdf-lib.min.js` do `TworzeniePostaci_v2-pdf.js`.
4. Przywrócić katalogowi `vendor` znaczenie katalogu czystych zależności.
5. Dodać leniwe ładowanie zależności PDF.
6. Usunąć `test-loader.js`, `test-core.html` i stary `test.html`.

### Etap 3 — przejście z testowego dokumentu Firebase

1. Dodać `character_builder/v2` do reguł.
2. Przenieść lub ponownie zapisać dane.
3. Zmienić stałe Firebase i pole `module`.
4. Przetestować izolację od `character_builder/current`.
5. Usunąć regułę oraz dokument `test-v2`, gdy nie będą już potrzebne.

### Etap 4 — równoległa publikacja

1. Zaktualizować `Kalkulator/index.html`.
2. Dodać osobne wejścia do wersji klasycznej i wersji 2.
3. Zaktualizować dokumentację użytkową i techniczną.
4. Zaktualizować `DetaleLayout.md`.

---

## 13. Testy kontrolne po wdrożeniu

| Test | Oczekiwany wynik |
| --- | --- |
| Otwarcie `TworzeniePostaci.html` | stara wersja działa bez zmian |
| Zapis w starej wersji | zmienia wyłącznie `character_builder/current` |
| Otwarcie `TworzeniePostaci_v2.html` | strona pokazuje właściwy interfejs bez ekranu loadera |
| Zapis w wersji 2 | zmienia wyłącznie dokument wersji 2 |
| Wczytanie w wersji 2 | odtwarza wszystkie pola, dynamiczne talenty i zasady specjalne |
| Anulowanie zapisu | nie wykonuje zapisu |
| Sukces zapisu | pokazuje modal, nie żółty komunikat techniczny |
| Błąd Firebase | pokazuje modal błędu i nie niszczy stanu formularza |
| Układ desktop | `Zapisz` i `Wczytaj` są pod pulą PD, akcje nawigacyjne po prawej |
| Układ sekcji Atrybuty | nowe przyciski są obok nagłówka |
| Układ mobilny | przyciski zawijają się bez nachodzenia na nagłówek i tabelę |
| Eksport PDF | biblioteki są ładowane na żądanie, PDF działa jak wcześniej |
| Brak `localStorage` | aplikacja nie zapisuje ani nie odczytuje lokalnego klucza testowego |
| Bezpośredni adres v2 | aplikacja działa bez `test-loader.js` i `test-core.html` |
| Równoległe karty przeglądarki | zapis v1 nie nadpisuje v2 i odwrotnie |

---

## 14. Ryzyka

### 14.1. Jednoczesna zmiana interfejsu, nazw plików i Firestore

Wykonanie wszystkiego w jednym kroku zwiększa trudność znalezienia przyczyny ewentualnego błędu. Dlatego rekomendowana jest migracja etapowa.

### 14.2. Zmiana pola `module`

Jeżeli kod zacznie oczekiwać `Kalkulator/TworzeniePostaci_v2`, a istniejący dokument nadal zawiera `Kalkulator/test`, stary zapis zostanie odrzucony przez walidację. Trzeba świadomie wykonać migrację albo zaakceptować utratę testowego zapisu.

### 14.3. Reguły Firebase

Zmiana ścieżki dokumentu bez wcześniejszego wdrożenia reguł spowoduje błędy `permission-denied`.

### 14.4. Kod w `vendor/pdf-lib.min.js`

Bez rozdzielenia kodu łatwo omyłkowo zastąpić logikę eksportu podczas podmiany biblioteki vendor. Obecny plik powinien zostać uporządkowany przed dalszym rozwijaniem eksportu.

### 14.5. Usunięcie plików zbyt wcześnie

`test-loader.js`, `test-core.html` i `test.html` należy usunąć dopiero po potwierdzeniu bezpośredniego działania nowego punktu wejścia.

---

## 15. Rekomendacja końcowa

Należy przekształcić obecną wersję testową w samodzielną aplikację `TworzeniePostaci_v2.html`, utrzymywaną równolegle ze starą wersją.

Docelowo:

```text
TworzeniePostaci.html     -> wersja klasyczna, bez zmian
TworzeniePostaci_v2.html  -> nowa wersja z zasadami specjalnymi i eksportem PDF
```

Nie należy zachowywać `test-loader.js` ani `test-core.html` w finalnej architekturze. Loader nie zmniejsza aplikacji i zwiększa liczbę punktów awarii.

Największe realne zmniejszenie i uproszczenie aplikacji zapewnią:

- usunięcie całej logiki `localStorage` i resetu;
- bezpośrednie uruchamianie `TworzeniePostaci_v2.html`;
- rozdzielenie rdzenia, Firebase i PDF;
- przeniesienie kodu aplikacyjnego poza `vendor/pdf-lib.min.js`;
- leniwe ładowanie Firebase i przede wszystkim zależności PDF;
- usunięcie wszystkich widocznych określeń testowych;
- migracja dokumentu Firestore z `test-v2` do docelowego `v2` po zakończeniu testów strukturalnych.

Tak przygotowana wersja 2 będzie prostsza w utrzymaniu, szybsza przy pierwszym otwarciu i bezpiecznie odseparowana od działającej wersji klasycznej.
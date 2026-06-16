# Audyt instrukcji dokumentacji Markdown

**Data audytu:** 2026-06-16  
**Repozytorium:** `CuteLittleGoat/WrathAndGlory`  
**Gałąź docelowa:** `main`  
**Plik wynikowy:** `Analizy/AudytInstrukcji.md`  
**Język raportu:** polski  
**Zakres zmian:** raport audytu; bez poprawiania audytowanych plików dokumentacji  

---

## 1. Oryginalny prompt użytkownika

> Będziesz pracować na repo WrathAndGlory.  
> Będziesz przeprowadzać audyt plików dokumentacji *.md  
> Nie bierz pod uwagę plików w folderze Analizy oraz plików DetaleLayout.md, DoZrobienia.md, Kolumny.md
>
> Każdy moduł ma pliki: README.md i Documentation.md  
> Niektóre moduły mają plik: FirebaseREADME.md
>
> Założenia plików:
>
> 1. Pliki "README.md" mają być instrukcją dla użytkownika. Mają dokładnie i prostym językiem opisywać wszystkie funkcje aplikacji. Mają opisywać co można kliknąć i co się stanie po kliknięciu. Celem pliku jest utworzenie instrukcji, która będzie zrozumiała dla użytkownika i pozwoli na pracę z danym modułem.
>
> 2. Pliki "Documentation.md" mają być instrukcją dla programisty. Mają dokładnie i szczegółowo opisywać wszystkie użyte funkcje, mechanizmy, strukturę Firebase (jeżeli moduł korzysta), skrypt Node.js do utworzenia struktury, wszystkie zasady formatowania, zasady importu itp. w zależności od modułu. Ma to być bardzo dokładna instrukcja opisująca wszystko co związane z działaniem modułu. Celem pliku jest utworzenie pełnego repozytorium dotyczącego kodu modułu, które będzie zrozumiałe dla programisty i pozwoli na odtworzenie aplikacji mając do dyspozycji tylko plik Documentation.md
>
> 3. Pliki FirebaseREADME.md mają być prostą instrukcją opisującą jak połączyć moduł z Firebase. Ma zawierać skrypt Node.js do utworzenia struktury, ma zawierać informacje dotyczącą uzyskania danych do wklejenia w shared/firebase-config.js
>
> Założenia dotyczące README.md i Documentation.md są też opisane w AGENTS.md, np. to, że wszystkie instrukcje muszą być w dwóch językach.
>
> Chcę, żebyś utworzył mi plik Analizy/AudytInstrukcji.md i zapisał tam wnioski, które pliki należy poprawić (zakładam, że wszystkie) i co należy w nich poprawić.
>
> Przed wykonaniem zadania zadaj mi teraz pytania doprecyzowujące, żebyśmy dobrze rozumieli cel zadania.

---

## 2. Doprecyzowania użytkownika

Użytkownik doprecyzował:

1. Na tym etapie należy utworzyć tylko plik audytu, bez poprawiania samych plików `README.md`, `Documentation.md`, `FirebaseREADME.md`.
2. Raport ma zostać zapisany na `main`.
3. Audyt ma obejmować wszystkie dokumenty, także root `README.md`, jeżeli istnieje.
4. Zgodność z dwujęzycznością PL/EN należy oceniać rygorystycznie. Wszystkie pliki mają być w całości w dwóch językach.
5. Jeżeli moduł korzystający z Firebase nie ma `FirebaseREADME.md`, jest to błąd krytyczny i należy go zaznaczyć w audycie.
6. Dokumentację trzeba porównać z aktualnym kodem aplikacji. Każdy moduł należy sprawdzać bardzo dokładnie.
7. Raport ma być bardzo szczegółowy.
8. W raporcie można przygotować zalecenia treści.
9. `AGENTS.md` można traktować jako nadrzędne źródło zasad audytu.
10. Wynik audytu ma być tylko po polsku.

---

## 3. Zakres audytu

Audyt obejmuje dokumentację Markdown modułów w repozytorium `WrathAndGlory`.

Z audytu wyłączono zgodnie z poleceniem użytkownika:

- cały folder `Analizy/`, z wyjątkiem niniejszego pliku wynikowego,
- `DetaleLayout.md`,
- `DoZrobienia.md`,
- `Kolumny.md`.

Audyt uwzględnia dokumenty modułowe:

- `README.md`,
- `Documentation.md`,
- `FirebaseREADME.md`, jeżeli moduł korzysta z Firebase albo posiada taki plik.

Dodatkowo uwzględniono `shared/FirebaseREADME.md`, ponieważ jest powiązany ze wspólną konfiguracją Firebase używaną przez część modułów.

---

## 4. Pliki objęte audytem

Audyt obejmuje następujące pliki:

- `Main/docs/README.md`
- `Main/docs/Documentation.md`
- `DiceRoller/docs/README.md`
- `DiceRoller/docs/Documentation.md`
- `GeneratorNazw/docs/README.md`
- `GeneratorNazw/docs/Documentation.md`
- `Kalkulator/docs/README.md`
- `Kalkulator/docs/Documentation.md`
- `Kalkulator/config/FirebaseREADME.md`
- `DataVault/docs/README.md`
- `DataVault/docs/Documentation.md`
- `DataVault/docs/ZasadyFormatowania.md`
- brakujący `DataVault/config/FirebaseREADME.md`
- `GeneratorNPC/docs/README.md`
- `GeneratorNPC/docs/Documentation.md`
- `GeneratorNPC/config/FirebaseREADME.md`
- `Audio/docs/README.md`
- `Audio/docs/Documentation.md`
- `Audio/config/FirebaseREADME.md`
- `Infoczytnik/docs/README.md`
- `Infoczytnik/docs/Documentation.md`
- `Infoczytnik/config/FirebaseREADME.md`
- `shared/FirebaseREADME.md`

Nie znaleziono głównego/root `README.md` w katalogu głównym repozytorium. Nie jest to traktowane jako błąd krytyczny, ponieważ użytkownik wskazał „jeżeli istnieje”. Rekomendowane jest jednak utworzenie root `README.md` jako indeksu repozytorium i mapy modułów.

---

## 5. Wymagania dotyczące plików z dokumentacją

Poniższe wymagania wynikają z promptu użytkownika oraz z zasad zapisanych w `AGENTS.md`. Należy je traktować jako kryteria przebudowy dokumentacji modułów.

---

### 5.1. Wymagania wspólne dla dokumentacji modułów

Każdy moduł powinien mieć co najmniej:

- `docs/README.md`,
- `docs/Documentation.md`.

Jeżeli moduł nie ma któregoś z tych plików, należy go utworzyć.

Dokumentacja musi:

- opisywać aktualny stan modułu,
- być zgodna z aktualnym kodem,
- być zgodna z aktualną strukturą repozytorium,
- być zgodna z aktualnymi źródłami danych,
- uwzględniać aktualne zależności między modułami,
- uwzględniać aktualne zależności między plikami,
- być aktualizowana po każdej zmianie kodu,
- umożliwiać użytkownikowi lub programiście pracę z aktualną wersją aplikacji.

Nie wolno zakładać, że:

- lista modułów jest stała,
- sposób ładowania danych jest stały,
- integracje Firebase są takie same jak wcześniej,
- pliki testowe są nadal głównym punktem działania modułu,
- dokumentacja opisująca starszy stan nadal jest poprawna.

Przy każdej większej zmianie należy sprawdzić aktualny kod i dopiero na tej podstawie aktualizować dokumentację.

---

### 5.2. Dokumentacja nie jest changelogiem

Pliki `README.md` i `Documentation.md` nie powinny być historią zmian.

Nie należy dopisywać informacji w stylu:

- „dodano nową funkcję”,
- „zmieniono zachowanie”,
- „wcześniej działało inaczej”,
- „stara wersja używała innego rozwiązania”,
- „obecnie po zmianie...”,
- „aktualizacja z dnia...”.

Wyjątek: taka informacja może zostać, jeżeli jest konieczna do zrozumienia aktualnego działania modułu lub procesu migracji danych.

Docelowo dokumentacja ma opisywać **stan aktualny**, a nie drogę dojścia do niego.

Jeżeli w obecnych plikach są sekcje dopisane jak changelog, należy je przepisać i włączyć do właściwych rozdziałów dokumentacji.

---

### 5.3. Wymagania językowe PL/EN

Wszystkie instrukcje użytkowe i techniczne muszą być w dwóch pełnych wersjach językowych:

- polskiej,
- angielskiej.

Wersja polska musi być kompletna sama w sobie.

Wersja angielska musi być kompletna sama w sobie.

Nie wystarcza:

- krótkie streszczenie po angielsku,
- jedna końcowa sekcja po angielsku,
- tłumaczenie tylko najważniejszych punktów,
- angielski opis wyłącznie nowych funkcji,
- pojedyncze angielskie komentarze techniczne.

Nie należy mieszać języków sekcja po sekcji.

Nie należy tworzyć układu:

- najpierw akapit po polsku,
- potem bezpośrednio jego tłumaczenie po angielsku,
- potem kolejny akapit po polsku,
- potem jego tłumaczenie.

Zalecany układ:

1. pełna część polska,
2. pełna część angielska.

Przy każdej wersji językowej powinna znajdować się flaga/emotka językowa, zgodnie z zasadami z `AGENTS.md`.

Przykład docelowego układu:

~~~markdown
# 🇵🇱 Instrukcja dla użytkownika (PL)

Pełna treść po polsku.

---

# 🇬🇧 User instructions (EN)

Full English version.
~~~

Ta sama zasada dotyczy dokumentacji technicznej:

~~~markdown
# 🇵🇱 Dokumentacja techniczna (PL)

Pełna dokumentacja techniczna po polsku.

---

# 🇬🇧 Technical documentation (EN)

Full technical documentation in English.
~~~

---

### 5.4. Wymagania dla plików `README.md`

`README.md` ma być instrukcją użytkownika.

Odbiorcą `README.md` jest osoba, która nie musi znać programowania i chce po prostu korzystać z modułu.

Język powinien być prosty, praktyczny i użytkowy.

`README.md` musi wyjaśniać:

- do czego służy dany moduł,
- jak uruchomić moduł,
- jaki plik albo link należy otworzyć,
- co użytkownik widzi po wejściu do modułu,
- jakie sekcje znajdują się na ekranie,
- co można kliknąć,
- gdzie znajdują się przyciski,
- co stanie się po kliknięciu każdego przycisku,
- jak działają pola formularzy,
- jak działają listy wyboru,
- jak działają checkboxy i przełączniki,
- jak działają suwaki, filtry, zakładki, modale i popovery,
- jak działa każda funkcja dostępna dla użytkownika,
- jak działa każda ważna mechanika modułu,
- co oznaczają komunikaty statusu,
- co oznaczają komunikaty błędów,
- co oznaczają puste stany,
- co użytkownik powinien zrobić w typowych sytuacjach,
- co użytkownik powinien zrobić, jeżeli pojawi się błąd,
- co użytkownik powinien zrobić, jeżeli dane się nie wczytają,
- jak działa tryb użytkownika,
- jak działa tryb admina, jeżeli moduł taki tryb posiada,
- które funkcje są widoczne tylko dla admina,
- które funkcje są widoczne tylko dla zwykłego użytkownika,
- jakie są ograniczenia pól i wyborów,
- jakie są skutki resetu,
- jakie są skutki zmiany języka,
- jakie są skutki zapisu,
- jakie są skutki wczytania danych,
- jakie są skutki importu,
- jakie są skutki eksportu,
- jakie są skutki odświeżenia,
- jakie są skutki usunięcia danych,
- czy dana akcja jest odwracalna,
- czy dana akcja wpływa tylko lokalnie, czy zapisuje dane w Firebase.

`README.md` powinien być instrukcją typu „kliknij X, stanie się Y”.

Przykładowy poziom szczegółowości:

- „Kliknij **Reset**, aby wyczyścić obecne ustawienia i wrócić do wartości domyślnych.”
- „Kliknij **Zapisz**, aby zapisać aktualny stan w Firebase.”
- „Jeżeli Firebase nie jest skonfigurowany, aplikacja użyje zapisu lokalnego w przeglądarce.”
- „Jeżeli lista jest pusta, oznacza to, że nie dodano jeszcze żadnych elementów.”

`README.md` nie powinien być głównym miejscem dla szczegółów implementacyjnych.

Do `README.md` nie należy przenosić nadmiernie szczegółowych informacji o:

- wewnętrznych funkcjach JavaScript,
- strukturach obiektów,
- parserach,
- szczegółach SDK,
- pełnych payloadach Firebase,
- regułach bezpieczeństwa Firebase,
- skryptach Node.js,
- technicznych zależnościach między plikami.

Takie informacje powinny znajdować się w `Documentation.md` albo `FirebaseREADME.md`.

Wyjątek: jeżeli użytkownik musi znać jakąś techniczną informację, aby używać modułu, można ją krótko opisać w README prostym językiem.

---

### 5.5. Wymagania dla plików `Documentation.md`

`Documentation.md` ma być pełną dokumentacją techniczną modułu.

Odbiorcą `Documentation.md` jest programista albo agent odtwarzający aplikację.

Celem `Documentation.md` jest to, aby osoba mająca tylko ten plik była w stanie odtworzyć moduł 1:1.

`Documentation.md` musi opisywać:

- cel modułu,
- zakres modułu,
- punkty wejścia,
- tryby uruchomienia,
- tryb użytkownika,
- tryb admina,
- strukturę katalogów,
- strukturę plików,
- odpowiedzialność każdego pliku,
- zależności między plikami,
- zależności między modułami,
- zewnętrzne biblioteki,
- zewnętrzne SDK,
- importy,
- pliki konfiguracyjne,
- pliki danych,
- pliki assetów,
- HTML,
- CSS,
- JavaScript,
- style i layouty,
- kolory,
- fonty,
- odstępy,
- szerokości,
- wysokości,
- breakpointy,
- responsywność,
- elementy UI,
- identyfikatory elementów,
- klasy CSS,
- atrybuty `data-*`,
- stan aplikacji,
- obiekty stanu,
- funkcje JavaScript,
- event listenery,
- obsługę kliknięć,
- walidacje,
- komunikaty błędów,
- komunikaty statusu,
- puste stany,
- algorytmy,
- obliczenia,
- mechaniki interfejsu,
- format danych wejściowych,
- format danych wyjściowych,
- import danych,
- eksport danych,
- zasady formatowania danych,
- transformacje danych,
- fallbacki,
- cache,
- localStorage/sessionStorage, jeżeli występuje,
- Firebase, jeżeli moduł korzysta,
- strukturę Firebase,
- skrypty Node.js lub inne skrypty odtwarzające strukturę danych,
- procedury odtworzenia modułu,
- testy kontrolne,
- testy regresyjne,
- znane ograniczenia aktualnej wersji.

Jeżeli moduł korzysta z Firebase, `Documentation.md` musi zawierać sekcję techniczną opisującą:

- z jakiej usługi Firebase korzysta moduł,
- który plik konfiguracyjny jest używany,
- jaką aplikację Firebase inicjalizuje kod,
- jakie kolekcje, dokumenty lub ścieżki są używane,
- jaki payload jest zapisywany,
- jaki payload jest odczytywany,
- jakie są fallbacki,
- jakie błędy mogą wystąpić,
- jakie testy trzeba wykonać po konfiguracji.

Jeżeli dokument zawiera fragment kodu, fragment musi być opisany:

- co robi,
- gdzie jest używany,
- dlaczego jest potrzebny,
- jakie dane przyjmuje,
- jakie dane zwraca,
- jakie są skutki uboczne.

`Documentation.md` powinien być szczegółowy, ale uporządkowany. Nie powinien być zbiorem luźnych notatek dopisywanych na końcu.

---

### 5.6. Wymagania dla plików `FirebaseREADME.md`

`FirebaseREADME.md` ma być prostą instrukcją połączenia modułu z Firebase.

Odbiorcą jest osoba, która chce skonfigurować Firebase dla modułu.

`FirebaseREADME.md` powinien zawierać:

- nazwę modułu,
- informację, do czego moduł używa Firebase,
- informację, czy Firebase jest wymagany, czy opcjonalny,
- informację, czy moduł ma fallback bez Firebase,
- listę używanych usług Firebase,
- instrukcję utworzenia projektu Firebase,
- instrukcję rejestracji aplikacji web,
- instrukcję uzyskania konfiguracji Firebase,
- informację, do którego pliku wkleić konfigurację,
- przykładową strukturę pliku konfiguracyjnego z placeholderami,
- informację, których danych nie wolno commitować,
- pełną strukturę kolekcji, dokumentów, ścieżek albo węzłów bazy,
- pełny model danych zapisywany przez aktualny kod,
- pełny model danych odczytywany przez aktualny kod,
- opis wymaganych pól,
- opis pól opcjonalnych,
- opis timestampów,
- opis identyfikatorów dokumentów,
- opis zachowania przy braku danych,
- opis zachowania przy błędnej konfiguracji,
- skrypt Node.js do utworzenia lub zainicjalizowania struktury danych,
- instrukcję instalacji zależności do skryptu,
- instrukcję uruchomienia skryptu,
- przykładowe reguły bezpieczeństwa,
- procedurę testu połączenia,
- procedurę testu zapisu,
- procedurę testu odczytu,
- typowe błędy i ich znaczenie.

Jeżeli moduł korzysta z Firebase i nie ma własnego `FirebaseREADME.md`, jest to błąd krytyczny.

Wyjątek jest dopuszczalny tylko wtedy, gdy:

- moduł jawnie korzysta ze wspólnej konfiguracji Firebase,
- istnieje wspólny plik dokumentacji Firebase,
- dokumentacja modułu wyraźnie odsyła do tego wspólnego pliku,
- z dokumentacji jasno wynika, gdzie skonfigurować Firebase dla danego modułu.

---

### 5.7. Wymagania dotyczące `DetaleLayout.md`

`DetaleLayout.md` był wyłączony z tego audytu zgodnie z poleceniem użytkownika, ale jego wymagania są istotne przy dalszych pracach.

Jeżeli zmiana dotyczy wyglądu aplikacji, należy zaktualizować `DetaleLayout.md`.

Dotyczy to zmian w:

- fontach,
- kolorach,
- ikonach,
- tłach,
- ramkach,
- cieniach,
- odstępach,
- szerokościach,
- wysokościach,
- responsywności,
- układzie elementów,
- wyglądzie przycisków,
- wyglądzie formularzy,
- wyglądzie komunikatów.

`DetaleLayout.md` powinien opisywać aktualny wygląd aplikacji, a nie historię zmian.

---

### 5.8. Wymagania dotyczące komentarzy w kodzie

Chociaż komentarze w kodzie nie są plikami Markdown, wpływają na spójność dokumentacji technicznej.

Pliki kodu powinny zawierać dokładne komentarze po polsku i po angielsku.

Dotyczy to szczególnie:

- `*.html`,
- `*.js`,
- `*.css`.

Komentarze powinny:

- wyjaśniać funkcję danego fragmentu,
- opisywać rzeczywiste zachowanie,
- być aktualne,
- nie powtarzać tylko nazwy zmiennej,
- nie opisywać starego zachowania.

Komentarze należy aktualizować razem z kodem.

---

### 5.9. Wymagania dotyczące plików analitycznych

Jeżeli zadanie dotyczy analizy, wynik należy zapisać w folderze `Analizy`.

Plik analityczny powinien zawierać:

- datę analizy,
- temat analizy,
- pełny oryginalny prompt użytkownika,
- zakres analizy,
- wnioski,
- rekomendacje,
- ryzyka,
- następne kroki.

Folderu `Analizy` nie należy opisywać w dokumentacji użytkowej i technicznej modułów, chyba że użytkownik wyraźnie o to poprosi albo analiza jest częścią wykonywanego zadania.

Jeżeli później kod jest zmieniany na podstawie pliku analitycznego, do tego pliku należy dopisać sekcję opisującą wykonane zmiany.

---

### 5.10. Wymagania dotyczące danych wrażliwych

W dokumentacji nie wolno zapisywać realnych danych wrażliwych.

Dotyczy to między innymi:

- haseł,
- tokenów,
- sekretów API,
- prywatnych kluczy,
- danych logowania,
- realnych konfiguracji produkcyjnych,
- wartości, które pozwalają uzyskać dostęp do prywatnych usług.

Jeżeli dokumentacja pokazuje konfigurację, należy używać placeholderów.

Dokumentacja powinna jasno wskazywać, gdzie użytkownik ma samodzielnie wkleić własne wartości.

---

## 6. Kryteria oceny audytu

Każdy audytowany plik był oceniany według następujących pytań:

1. Czy plik istnieje?
2. Czy odpowiada swojej roli?
3. Czy jest zgodny z aktualnym kodem?
4. Czy jest pełny?
5. Czy jest zrozumiały dla docelowego odbiorcy?
6. Czy jest w pełni dwujęzyczny?
7. Czy nie miesza języków sekcja po sekcji?
8. Czy nie jest changelogiem?
9. Czy opisuje wszystkie funkcje modułu?
10. Czy opisuje wszystkie przyciski i skutki kliknięcia?
11. Czy opisuje komunikaty, błędy i puste stany?
12. Czy opisuje tryb admina, jeżeli istnieje?
13. Czy opisuje Firebase, jeżeli moduł go używa?
14. Czy opisuje fallbacki, jeżeli istnieją?
15. Czy pozwala użytkownikowi korzystać z modułu?
16. Czy pozwala programiście odtworzyć moduł?

---

## 7. Wniosek główny

Założenie użytkownika, że prawdopodobnie wszystkie pliki wymagają poprawy, potwierdza się.

Wszystkie audytowane moduły wymagają poprawek dokumentacji.

Najczęstsze problemy:

- brak pełnej wersji angielskiej,
- mieszanie instrukcji użytkownika z dokumentacją techniczną,
- rozjazd dokumentacji z aktualnym kodem,
- zbyt ogólne README,
- zbyt chaotyczne Documentation,
- brak kompletnego opisu Firebase,
- opis starych mechanizmów,
- dopiski przypominające changelog,
- brak pełnego opisu przycisków, pól, filtrów, modalów i komunikatów,
- brak opisu fallbacków,
- brak jasnego rozdzielenia trybu użytkownika i admina.

Największe problemy krytyczne dotyczą modułów:

- `Infoczytnik`,
- `DataVault`,
- `GeneratorNPC`,
- `Kalkulator`.

---

## 8. Pliki do poprawy

Do poprawy wskazuję:

- `Main/docs/README.md`
- `Main/docs/Documentation.md`
- `DiceRoller/docs/README.md`
- `DiceRoller/docs/Documentation.md`
- `GeneratorNazw/docs/README.md`
- `GeneratorNazw/docs/Documentation.md`
- `Kalkulator/docs/README.md`
- `Kalkulator/docs/Documentation.md`
- `Kalkulator/config/FirebaseREADME.md`
- `DataVault/docs/README.md`
- `DataVault/docs/Documentation.md`
- `DataVault/docs/ZasadyFormatowania.md`
- brakujący `DataVault/config/FirebaseREADME.md`
- `GeneratorNPC/docs/README.md`
- `GeneratorNPC/docs/Documentation.md`
- `GeneratorNPC/config/FirebaseREADME.md`
- `Audio/docs/README.md`
- `Audio/docs/Documentation.md`
- `Audio/config/FirebaseREADME.md`
- `Infoczytnik/docs/README.md`
- `Infoczytnik/docs/Documentation.md`
- `Infoczytnik/config/FirebaseREADME.md`
- `shared/FirebaseREADME.md`

---

## 9. Priorytety

### 9.1. Priorytet krytyczny

- `Infoczytnik`
- `DataVault`
- `GeneratorNPC`
- `Kalkulator`

Powód:

- istotne integracje Firebase,
- złożone modele danych,
- dokumentacja częściowo niezgodna z aktualnym kodem,
- brakujące albo niepełne FirebaseREADME,
- duży wpływ błędnej dokumentacji na możliwość odtworzenia modułu.

### 9.2. Priorytet wysoki

- `Audio`
- `Main`
- `GeneratorNazw`

Powód:

- braki w opisach użytkowych,
- brak pełnej dwujęzyczności,
- potrzeba uporządkowania dokumentacji technicznej.

### 9.3. Priorytet średni/wysoki

- `DiceRoller`

Powód:

- moduł jest prostszy,
- dokumentacja nadal wymaga pełnej wersji EN i dokładniejszego opisu zachowania UI.

---

## 10. Najważniejsze zalecenia globalne

1. Każdy `README.md` przepisać jako instrukcję użytkownika.
2. Każdy `README.md` ma odpowiadać na pytania: co widzę, co mogę kliknąć, co się stanie po kliknięciu.
3. Każdy `Documentation.md` uzupełnić jako pełną dokumentację techniczną.
4. Do każdego `Documentation.md` dodać pełną wersję EN.
5. Dokumenty Firebase ujednolicić i dopasować do aktualnego kodu.
6. Utworzyć dokument Firebase dla `DataVault` albo jawnie opisać, że korzysta z dokumentacji wspólnej w `shared`.
7. Usunąć z dokumentacji charakter changeloga.
8. Opisywać aktualny stan modułu, a nie historię zmian.
9. Rozdzielić instrukcje użytkownika od dokumentacji technicznej.
10. Każdy moduł opisać jako aktualną aplikację, z aktualnymi punktami wejścia.
11. W każdej dokumentacji dopisać komunikaty błędów, puste stany i fallbacki.
12. W każdej dokumentacji modułów z Firebase dopisać test połączenia i strukturę danych.
13. Przy każdym module dopisać procedurę testów kontrolnych po zmianach dokumentacji.

---

## 11. Uwagi modułowe

---

### 11.1. Main

#### Aktualne zachowanie

`Main` jest stroną główną uruchamiającą pozostałe moduły.

Kod obsługuje:

- kafle modułów,
- tryb admina przez `?admin=1`,
- ukrywanie elementów admin-only poza trybem admina,
- różne linki do Infoczytnika zależnie od trybu,
- dodanie `?admin=1` do DataVault w trybie admina,
- dynamiczne linki do obrazków i mapy,
- czyszczenie cache i service workerów.

#### `Main/docs/README.md`

Do poprawy:

- opisać każdy kafel,
- opisać, co stanie się po kliknięciu każdego kafla,
- opisać, które kafle są widoczne tylko dla admina,
- opisać tryb admina,
- opisać różne zachowanie linku do Infoczytnika,
- opisać dynamiczne linki do obrazków i mapy,
- opisać fallback, jeżeli link dynamiczny nie zostanie pobrany,
- dodać pełną wersję EN.

#### `Main/docs/Documentation.md`

Do poprawy:

- dodać pełną wersję EN,
- opisać strukturę `Main/index.html`,
- opisać mechanizm `?admin=1`,
- opisać usuwanie elementów admin-only,
- opisać dynamiczne linki,
- opisać czyszczenie cache,
- uporządkować numerację,
- usunąć charakter luźnych dopisków.

---

### 11.2. DiceRoller

#### Aktualne zachowanie

`DiceRoller` obsługuje:

- ST,
- pulę kości,
- kości Furii,
- rzut,
- animację wyniku,
- sukces,
- porażkę,
- komplikację,
- krytyczną Furię,
- przeniesienie,
- reset po zmianie języka.

#### `DiceRoller/docs/README.md`

Do poprawy:

- dopisać instrukcję krok po kroku,
- opisać wszystkie pola,
- opisać przycisk rzutu,
- opisać automatyczną korektę wartości,
- opisać ograniczenie kości Furii do puli kości,
- opisać wynik rzutu,
- opisać reset po zmianie języka,
- dodać pełną wersję EN.

#### `DiceRoller/docs/Documentation.md`

Do poprawy:

- dodać pełną wersję EN,
- opisać algorytm rzutu,
- opisać walidację pól,
- opisać animację,
- opisać interpretację kości Furii,
- sprawdzić opis sytuacji bez czerwonych kości, bo UI wymusza co najmniej jedną kość Furii,
- dodać testy regresji.

---

### 11.3. GeneratorNazw

#### Aktualne zachowanie

`GeneratorNazw` obsługuje:

- kategorie nazw,
- opcje w ramach kategorii,
- seed,
- losowanie bez seeda,
- liczbę wyników,
- limit wyników,
- generowanie,
- kopiowanie,
- automatyczne generowanie po zmianie kategorii lub opcji.

#### `GeneratorNazw/docs/README.md`

Do poprawy:

- dopisać listę kategorii,
- dopisać listę opcji,
- wyjaśnić seed prostym językiem,
- opisać powtarzalność wyników z seedem,
- opisać limit wyników,
- opisać automatyczne generowanie,
- opisać kopiowanie wyniku,
- opisać błąd schowka,
- dodać pełną wersję EN.

#### `GeneratorNazw/docs/Documentation.md`

Do poprawy:

- dodać pełną wersję EN,
- opisać strukturę `DATA`,
- opisać RNG,
- opisać helpery,
- opisać walidację nazw,
- opisać każdy generator domenowy,
- wskazać, że moduł nie korzysta z Firebase,
- uporządkować numerację.

---

### 11.4. Kalkulator

#### Aktualne zachowanie

`Kalkulator` składa się z kilku widoków:

- ekran startowy,
- `KalkulatorXP.html`,
- `TworzeniePostaci.html`.

Moduł obsługuje:

- kalkulator kosztów PD,
- tabelę maksymalnych atrybutów,
- reset,
- zmianę języka,
- tworzenie postaci,
- pulę PD,
- atrybuty,
- umiejętności,
- talenty,
- zasadę Drzewa Nauki,
- PDF instrukcji,
- modale,
- zapis i wczytanie stanu.

#### `Kalkulator/docs/README.md`

Do poprawy:

- opisać ekran startowy,
- opisać przyciski wejścia do narzędzi,
- opisać tajny modal z kozą,
- opisać Kalkulator PD,
- opisać Tworzenie Postaci,
- opisać pola PD,
- opisać atrybuty,
- opisać umiejętności,
- opisać talenty,
- opisać zasadę Drzewa Nauki,
- opisać instrukcję PDF,
- opisać zapis i wczytanie,
- opisać modale potwierdzeń,
- opisać skutki zmiany języka,
- dodać pełną wersję EN.

#### `Kalkulator/docs/Documentation.md`

Do poprawy:

- dodać pełną wersję EN,
- opisać każdy plik HTML osobno,
- opisać tabele kosztów,
- opisać sposób liczenia kosztów PD,
- opisać Drzewo Nauki,
- opisać walidację,
- opisać modale,
- opisać Firestore payload,
- dodać testy kontrolne.

#### `Kalkulator/config/FirebaseREADME.md`

Do poprawy krytycznej:

- dopasować strukturę `character_builder/current` do aktualnego kodu,
- opisać zapisywane pola,
- opisać dane języka,
- opisać podsumowanie PD,
- opisać walidacje,
- opisać atrybuty,
- opisać umiejętności,
- opisać talenty,
- opisać snapshot formularza,
- zaktualizować skrypt inicjalizujący,
- dodać test zapisu i odczytu.

---

### 11.5. DataVault

#### Aktualne zachowanie

`DataVault` obsługuje:

- ekran dostępu K.O.Z.A.,
- prywatne dane z Firebase,
- wspólny loader Firebase,
- tryb admina,
- generowanie plików danych,
- import danych,
- filtry globalne,
- filtry kolumn,
- sortowanie,
- zakładki,
- grupy zakładek,
- widok pełny,
- widok domyślny,
- porównywanie rekordów,
- popover,
- ukrywanie wpisów zdezaktualizowanych,
- parser XLSX,
- zasady formatowania.

#### `DataVault/docs/README.md`

Do poprawy krytycznej:

- przepisać na prostą instrukcję użytkownika,
- ograniczyć szczegóły techniczne,
- opisać ekran K.O.Z.A.,
- opisać błędy dostępu,
- opisać wyszukiwarkę,
- opisać zakładki,
- opisać checkboxy grup zakładek,
- opisać sortowanie,
- opisać filtry kolumn,
- opisać menu filtrów,
- opisać `Pełen Widok`,
- opisać `Widok Domyślny`,
- opisać `Porównaj zaznaczone`,
- opisać tryb admina,
- opisać generowanie plików danych z perspektywy użytkownika,
- dodać pełną wersję EN.

#### `DataVault/docs/Documentation.md`

Do poprawy:

- dodać pełną wersję EN,
- uporządkować sekcje bieżącej logiki,
- usunąć charakter changeloga,
- opisać wspólny loader Firebase,
- opisać ścieżkę danych prywatnych,
- opisać wrapper importu,
- opisać parser XLSX,
- opisać format danych,
- opisać zasady formatowania,
- opisać tryb admina,
- opisać grupy zakładek,
- opisać testy regresji.

#### `DataVault/docs/ZasadyFormatowania.md`

Do poprawy:

- sprawdzić zgodność z aktualnym parserem,
- sprawdzić zgodność z aktualnymi formatterami,
- zdecydować, czy dokument ma mieć pełną wersję EN,
- utrzymać dokument jako specjalistyczny dokument techniczny,
- nie przenosić szczegółów do README użytkownika.

#### Brak `DataVault/config/FirebaseREADME.md`

To błąd krytyczny.

Moduł korzysta z Firebase, więc powinien mieć własny `FirebaseREADME.md`, chyba że zostanie formalnie przyjęte, że dokumentem właściwym jest `shared/FirebaseREADME.md`.

Rekomendacja:

- utworzyć `DataVault/config/FirebaseREADME.md`,
- opisać w nim konfigurację DataVault,
- odesłać do `shared/FirebaseREADME.md` dla części wspólnej,
- jasno opisać, które elementy są wspólne, a które specyficzne dla DataVault.

---

### 11.6. GeneratorNPC

#### Aktualne zachowanie

`GeneratorNPC` korzysta z:

- prywatnych danych DataVault,
- wspólnego Firebase,
- osobnego mechanizmu ulubionych NPC,
- Firestore albo fallbacku lokalnego.

Moduł obsługuje:

- ekran K.O.Z.A.,
- wybór rekordu Bestiariusza,
- checkbox zdezaktualizowanych wpisów,
- notatki,
- moduły aktywne,
- broń,
- pancerz,
- augumentacje,
- ekwipunek,
- talenty,
- psionikę,
- modlitwy,
- opisy cech,
- pełne opisy,
- edycję części danych bazowych,
- ulubione,
- aliasy,
- zmianę kolejności,
- generowanie karty.

#### `GeneratorNPC/docs/README.md`

Do poprawy:

- opisać ekran dostępu,
- opisać ładowanie danych,
- opisać statusy,
- opisać wybór Bestiariusza,
- opisać checkbox zdezaktualizowanych wpisów,
- opisać notatki,
- opisać moduły aktywne,
- opisać przełączniki opisów,
- opisać ulubione,
- opisać aliasy,
- opisać odświeżanie,
- opisać wczytywanie,
- opisać usuwanie,
- opisać zmianę kolejności,
- opisać fallback lokalny,
- opisać generowanie karty,
- dodać pełną wersję EN.

#### `GeneratorNPC/docs/Documentation.md`

Do poprawy:

- dodać pełną wersję EN,
- opisać prywatne dane DataVault,
- opisać osobne ulubione NPC,
- rozdzielić dwie warstwy Firebase,
- opisać model danych ulubionych,
- opisać snapshot NPC,
- opisać funkcje JavaScript,
- opisać testy kontrolne.

#### `GeneratorNPC/config/FirebaseREADME.md`

Do poprawy krytycznej:

- opisać nie tylko ulubione,
- dodać zależność od wspólnej konfiguracji prywatnych danych,
- opisać, co jest w `shared/firebase-config.js`,
- opisać, co jest w konfiguracji modułu,
- opisać fallback lokalny,
- dodać testy zapisu i odczytu.

---

### 11.7. Audio

#### Aktualne zachowanie

`Audio` obsługuje:

- tryb użytkownika,
- tryb admina,
- manifest XLSX,
- tagi,
- filtrowanie tagów,
- popup filtra,
- wyszukiwarkę,
- aliasy,
- listy ulubionych,
- widok główny,
- suwak głośności,
- loop,
- odtwarzanie wielu dźwięków,
- Firestore,
- localStorage fallback.

#### `Audio/docs/README.md`

Do poprawy:

- opisać tryb użytkownika,
- opisać tryb admina,
- opisać manifest,
- opisać filtr tagów,
- opisać popup filtra,
- opisać wyszukiwarkę,
- opisać aliasy,
- opisać czyszczenie aliasów,
- opisać ulubione,
- opisać widok główny,
- opisać suwak głośności,
- opisać loop,
- opisać puste stany,
- opisać działanie bez Firebase,
- dodać pełną wersję EN.

#### `Audio/docs/Documentation.md`

Do poprawy:

- dodać pełną wersję EN,
- opisać strukturę manifestu,
- opisać tagi,
- opisać grupowanie wariantów,
- opisać odtwarzanie,
- opisać WebAudio,
- opisać Firestore,
- opisać localStorage fallback,
- opisać testy admin/user.

#### `Audio/config/FirebaseREADME.md`

Do poprawy:

- opisać pełny model `audio/favorites`,
- opisać listy ulubionych,
- opisać widok główny,
- opisać aliasy,
- opisać fallback lokalny,
- opisać testy konfiguracji.

---

### 11.8. Infoczytnik

#### Aktualne zachowanie

`Infoczytnik` ma:

- `index.html`,
- produkcyjny `GM.html`,
- produkcyjny `Infoczytnik.html`,
- testowy `GM_test.html`,
- testowy `Infoczytnik_test.html`.

Moduł obsługuje:

- Firestore `dataslate/current`,
- wersjonowanie/cache-busting,
- tła,
- ramki,
- logo,
- kolor logo,
- fillery,
- fonty,
- audio,
- kolory tekstu,
- rozmiary fontów,
- podgląd,
- wysyłkę wiadomości,
- ping,
- czyszczenie komunikatu,
- przywracanie domyślnych,
- losowanie fillerów,
- aktualizację danych z XLSX,
- ekran odbiorcy dla graczy.

#### `Infoczytnik/docs/README.md`

Do poprawy krytycznej:

- opisać aktualny `index.html`,
- opisać wersje produkcyjne,
- opisać wersje testowe,
- opisać różnicę między GM a ekranem gracza,
- opisać każdy przycisk GM,
- opisać wysyłkę,
- opisać ping,
- opisać czyszczenie,
- opisać domyślne ustawienia,
- opisać losowanie fillerów,
- opisać aktualizację z XLSX,
- opisać wymóg kliknięcia ekranu gracza dla audio,
- przenieść technikalia do `Documentation.md`,
- dodać pełną wersję EN.

#### `Infoczytnik/docs/Documentation.md`

Do poprawy krytycznej:

- przestać traktować pliki `_test` jako jedyne główne punkty rozwoju,
- opisać aktualne pliki produkcyjne,
- opisać aktualne pliki testowe,
- opisać aktualny payload `dataslate/current`,
- opisać wersjonowanie,
- opisać cache-busting,
- opisać import XLSX,
- opisać render gracza,
- opisać audio,
- opisać logoColor,
- naprawić numerację,
- scalić dopisane sekcje,
- dodać pełną wersję EN.

#### `Infoczytnik/config/FirebaseREADME.md`

Do poprawy krytycznej:

- opisać pełny model `dataslate/current`,
- uwzględnić tło,
- uwzględnić logo,
- uwzględnić kolor logo,
- uwzględnić fillery,
- uwzględnić font,
- uwzględnić audio,
- uwzględnić kolory,
- uwzględnić rozmiary fontów,
- uwzględnić ping,
- uwzględnić clear,
- uwzględnić timestamp,
- zaktualizować skrypt inicjalizujący,
- dodać test GM-gracz.

---

### 11.9. `shared/FirebaseREADME.md`

`shared/FirebaseREADME.md` powinien być jasnym dokumentem wspólnej warstwy prywatnych danych dla:

- `DataVault`,
- `GeneratorNPC`.

Do poprawy:

- jasno wskazać, które moduły używają tego dokumentu,
- rozdzielić konfigurację wspólną od konfiguracji modułów `Audio`, `Infoczytnik`, `Kalkulator`,
- opisać wspólny plik konfiguracyjny,
- opisać przepływ ładowania prywatnych danych,
- opisać autoryzację,
- opisać ścieżkę danych,
- opisać typowe błędy konfiguracji,
- opisać test logowania,
- opisać test odczytu danych.

---

## 12. Rekomendowany plan napraw

### Etap 1 — standard dokumentacji

Przyjąć jeden wzorzec dla:

- `README.md`,
- `Documentation.md`,
- `FirebaseREADME.md`.

Wzorzec powinien wymuszać:

- pełną część PL,
- pełną część EN,
- brak układu sekcja PL / sekcja EN / sekcja PL / sekcja EN,
- brak changeloga,
- opis aktualnego stanu.

### Etap 2 — dokumenty Firebase i błędy krytyczne

Najpierw poprawić:

1. `Infoczytnik/config/FirebaseREADME.md`
2. `Infoczytnik/docs/Documentation.md`
3. `Kalkulator/config/FirebaseREADME.md`
4. `GeneratorNPC/config/FirebaseREADME.md`
5. brakujący `DataVault/config/FirebaseREADME.md`

### Etap 3 — README dużych modułów

Następnie przepisać:

1. `DataVault/docs/README.md`
2. `GeneratorNPC/docs/README.md`
3. `Infoczytnik/docs/README.md`
4. `Kalkulator/docs/README.md`
5. `Audio/docs/README.md`

### Etap 4 — Documentation dużych modułów

Następnie uzupełnić:

1. `DataVault/docs/Documentation.md`
2. `GeneratorNPC/docs/Documentation.md`
3. `Kalkulator/docs/Documentation.md`
4. `Audio/docs/Documentation.md`

### Etap 5 — prostsze moduły

Na końcu uporządkować:

1. `Main`
2. `GeneratorNazw`
3. `DiceRoller`

### Etap 6 — root README

Rozważyć utworzenie root `README.md` jako mapy repozytorium:

- lista modułów,
- krótki opis każdego modułu,
- linki do dokumentacji użytkowej,
- linki do dokumentacji technicznej,
- informacja o dokumentach Firebase,
- informacja o zasadach z `AGENTS.md`.

---

## 13. Ryzyka

1. **Ryzyko dalszej niespójności dokumentacji**  
   Bez wspólnego szablonu każdy moduł będzie poprawiany inaczej.

2. **Ryzyko nieaktualnej dokumentacji Firebase**  
   Jeżeli FirebaseREADME nie zostaną dopasowane do kodu, moduły mogą zostać odtworzone z błędną strukturą danych.

3. **Ryzyko braku pełnej dwujęzyczności**  
   Dokumenty nadal nie spełnią wymagań, jeżeli zostaną uzupełnione tylko po polsku.

4. **Ryzyko pomieszania dokumentacji użytkowej z techniczną**  
   README pozostaną zbyt trudne dla użytkownika, jeżeli będą zawierały zbyt dużo szczegółów implementacyjnych.

5. **Ryzyko utrwalenia starych punktów wejścia**  
   Największe w `Infoczytnik`, gdzie dokumentacja może nadal zbyt mocno koncentrować się na plikach `_test`.

6. **Ryzyko niejasnej konfiguracji shared Firebase**  
   Dotyczy `DataVault` i `GeneratorNPC`. Trzeba jasno oddzielić konfigurację wspólną od modułowej.

7. **Ryzyko braku testów regresji w dokumentacji**  
   Bez testów kontrolnych trudno będzie sprawdzić, czy opisany moduł rzeczywiście działa zgodnie z dokumentacją.

---

## 14. Następne kroki

1. Zatwierdzić standard struktury dokumentów.
2. Utworzyć albo formalnie powiązać `DataVault/config/FirebaseREADME.md`.
3. Poprawić dokumentacje Firebase modułów krytycznych.
4. Zaktualizować `Infoczytnik/docs/Documentation.md` względem aktualnego kodu produkcyjnego.
5. Przepisać README największych modułów jako instrukcje użytkownika.
6. Dodać pełne wersje EN do wszystkich dokumentacji technicznych.
7. Uporządkować dokumenty prostszych modułów.
8. Rozważyć root `README.md`.

---

## 15. Aktualizacja po rozpoczęciu prac nad dokumentacją

**Data aktualizacji:** 2026-06-16  
**Zakres aktualizacji:** opis wykonanych prac po audycie  
**Status:** rozpoczęto realizację planu napraw dokumentacji  

Po przygotowaniu audytu rozpoczęto właściwe prace porządkujące dokumentację repozytorium. Pierwsze działania nie polegały jeszcze na masowej poprawie wszystkich plików modułów, tylko na przygotowaniu wspólnego standardu oraz rozpoczęciu pracy od dokumentów krytycznych wskazanych w audycie.

---

### 15.1. Utworzenie pliku `docs-standard.md`

Utworzono nowy plik: `docs-standard.md`.

Commit: `c983190800cf62c518f4ecbf4ee4975beee9c70c`.

Plik `docs-standard.md` został utworzony jako wspólny standard dokumentacji modułów w repozytorium `WrathAndGlory`.

Celem tego pliku jest ujednolicenie dalszych prac nad dokumentacją, tak aby każdy moduł był opisywany według tego samego schematu i z tym samym poziomem szczegółowości.

Plik zawiera standard dla:

- `docs/README.md`,
- `docs/Documentation.md`,
- `config/FirebaseREADME.md`.

W `docs-standard.md` zapisano między innymi:

- zasady ogólne dokumentacji,
- wymóg opisywania aktualnego stanu modułu,
- zakaz traktowania dokumentacji jako changeloga,
- wymóg pełnej wersji polskiej i pełnej wersji angielskiej,
- zalecany układ językowy,
- standard instrukcji użytkownika `README.md`,
- standard dokumentacji technicznej `Documentation.md`,
- standard instrukcji konfiguracji `FirebaseREADME.md`,
- checklistę przed zatwierdzeniem dokumentacji,
- zalecaną kolejność dalszych prac.

Użytkownik zaakceptował przygotowany szablon.

Wniosek: Etap 1 planu napraw, czyli przyjęcie wspólnego standardu dokumentacji, został rozpoczęty i praktycznie wykonany.

---

### 15.2. Sprawdzenie pliku `AGENTS.md`

Przed dalszymi pracami sprawdzono plik `AGENTS.md`.

Celem sprawdzenia było ustalenie:

- czy jego treść jest zgodna z obecnym projektem,
- czy nadrzędne instrukcje nie blokują poprawiania dokumentacji,
- czy są w nim ograniczenia, które trzeba uwzględniać podczas dalszych prac.

Wniosek ze sprawdzenia:

- `AGENTS.md` jest zasadniczo zgodny z obecnym projektem,
- nie blokuje prac nad poprawą dokumentacji,
- wspiera przyjęty kierunek prac,
- potwierdza rolę `README.md` jako instrukcji użytkownika,
- potwierdza rolę `Documentation.md` jako dokumentacji technicznej,
- potwierdza wymóg pełnego układu PL/EN,
- potwierdza zasadę, że dokumentacja ma opisywać aktualny stan, a nie historię zmian.

Zidentyfikowano jednak ważne ograniczenia organizacyjne:

1. Nie wolno edytować żadnych plików `AGENTS.md`.
2. Nie należy commitować zmian bez wyraźnej prośby użytkownika.
3. Przy module `DataVault` trzeba zachować szczególną ostrożność, zwłaszcza przy zmianach parserów, generatorów i fallbacków.
4. Przy zmianach wyglądu aplikacji trzeba aktualizować `DetaleLayout.md`.
5. Przed edycją konkretnego folderu warto sprawdzić, czy nie ma lokalnego `AGENTS.md`.

Wniosek: można kontynuować prace nad dokumentacją, ale nie należy modyfikować `AGENTS.md`.

---

### 15.3. Aktualizacja `Infoczytnik/config/FirebaseREADME.md`

Zgodnie z priorytetami wskazanymi w audycie rozpoczęto prace od dokumentów krytycznych Firebase.

Zaktualizowano plik `Infoczytnik/config/FirebaseREADME.md`.

Commit: `5e9add68a4280c960c3f3f6d8087025442564024`.

Powód wyboru tego pliku jako pierwszego:

- audyt oznaczył dokumentację Firebase modułu `Infoczytnik` jako krytyczną,
- stary `FirebaseREADME.md` nie opisywał pełnego aktualnego modelu `dataslate/current`,
- aktualny kod `GM.html` zapisuje znacznie więcej pól niż opisywała poprzednia wersja dokumentacji,
- ekran gracza `Infoczytnik.html` zależy od aktualnego payloadu Firestore.

W ramach aktualizacji opisano:

- do czego `Infoczytnik` używa Firebase,
- że moduł korzysta z Firestore,
- że aktualny kod nie używa Realtime Database, Authentication ani Storage,
- że Firebase jest wymagany do komunikacji GM-gracz,
- że moduł nie ma pełnego fallbacku offline dla tej komunikacji,
- plik konfiguracyjny `Infoczytnik/config/firebase-config.js`,
- sposób uzyskania danych z Firebase Console,
- strukturę Firestore `dataslate/current`,
- typy akcji w polu `type`: `message`, `ping`, `clear`,
- pełny model danych dokumentu `dataslate/current`,
- skrypt Node.js inicjalizujący dokument,
- sposób uruchomienia skryptu,
- przykładowe reguły Firestore,
- test połączenia,
- typowe błędy i ich rozwiązania.

Dokument został przygotowany zgodnie z przyjętym standardem:

- pełna wersja polska,
- pełna wersja angielska,
- brak realnych prywatnych wartości konfiguracyjnych,
- użycie placeholderów,
- opis aktualnego stanu modułu,
- brak formy changeloga.

Wniosek: pierwszy krytyczny dokument Firebase został poprawiony.

---

### 15.4. Zmiana statusu planu napraw

Po wykonaniu powyższych prac status etapów z sekcji „Rekomendowany plan napraw” wygląda następująco.

#### Etap 1 — standard dokumentacji

Status: wykonany w wersji roboczej i zaakceptowany przez użytkownika.

Wykonano:

- utworzono `docs-standard.md`,
- opisano standard dla `README.md`,
- opisano standard dla `Documentation.md`,
- opisano standard dla `FirebaseREADME.md`,
- dodano checklistę akceptacji dokumentacji.

#### Etap 2 — dokumenty Firebase i błędy krytyczne

Status: rozpoczęty.

Wykonano:

- zaktualizowano `Infoczytnik/config/FirebaseREADME.md`.

Pozostało:

- `Infoczytnik/docs/Documentation.md`,
- `Kalkulator/config/FirebaseREADME.md`,
- `GeneratorNPC/config/FirebaseREADME.md`,
- brakujący `DataVault/config/FirebaseREADME.md`.

---

### 15.5. Rekomendowany następny krok

Następnym krokiem powinno być przygotowanie `Infoczytnik/docs/Documentation.md`.

Uzasadnienie:

- audyt wskazuje `Infoczytnik/docs/Documentation.md` jako dokument krytyczny,
- `Infoczytnik/config/FirebaseREADME.md` został już dopasowany do aktualnego modelu Firestore,
- naturalnym kolejnym krokiem jest opisanie pełnej technicznej dokumentacji modułu względem aktualnych plików produkcyjnych i testowych,
- dokumentacja techniczna `Infoczytnik` powinna jasno rozdzielać `GM.html`, `Infoczytnik.html`, `GM_test.html`, `Infoczytnik_test.html` oraz zasady wynikające z lokalnego `Infoczytnik/AGENTS.md`.

Po ukończeniu `Infoczytnik/docs/Documentation.md` należy przejść do kolejnych dokumentów Firebase:

1. `Kalkulator/config/FirebaseREADME.md`,
2. `GeneratorNPC/config/FirebaseREADME.md`,
3. `DataVault/config/FirebaseREADME.md`.

---

### 15.6. Zaktualizowana lista wykonanych prac

Wykonano:

- utworzono `docs-standard.md`,
- zaakceptowano standard dokumentacji,
- sprawdzono zgodność `AGENTS.md` z obecnym celem projektu,
- potwierdzono, że `AGENTS.md` nie blokuje prac nad dokumentacją,
- zaktualizowano `Infoczytnik/config/FirebaseREADME.md`.

Do wykonania w najbliższej kolejności:

- przygotować `Infoczytnik/docs/Documentation.md`,
- następnie poprawić pozostałe krytyczne dokumenty Firebase,
- następnie przejść do README dużych modułów.

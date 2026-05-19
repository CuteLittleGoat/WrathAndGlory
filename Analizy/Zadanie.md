Masz dostęp do repozytorium `CuteLittleGoat/WrathAndGlory` i uprawnienia do edycji.

Cel zadania: popraw wyłącznie pliki dokumentacyjne repozytorium tak, aby opisywały aktualny stan działającej aplikacji.

Bardzo ważne: sam kod aplikacji działa poprawnie. Nie naprawiaj kodu, nie refaktoryzuj kodu, nie zmieniaj logiki działania modułów, nie poprawiaj HTML/CSS/JS/Python, nie zmieniaj konfiguracji produkcyjnych i nie zmieniaj plików danych używanych przez aplikację.

Zadanie dotyczy tylko modyfikacji dokumentacji.

Jeżeli dokumentacja jest sprzeczna z kodem, popraw dokumentację, a nie kod.

Jeżeli kod działa inaczej niż dokumentacja opisuje, uznaj kod za źródło prawdy i dostosuj dokumentację do aktualnego kodu.

Nie twórz, nie usuwaj i nie przenoś plików. Modyfikuj tylko istniejące pliki dokumentacyjne wskazane w tej instrukcji.

## 1. Pliki, które można edytować

Możesz edytować wyłącznie poniższe pliki dokumentacyjne, o ile wymagają aktualizacji:

- `Main/docs/README.md`
- `Main/docs/Documentation.md`

- `DataVault/docs/README.md`
- `DataVault/docs/Documentation.md`
- `DataVault/docs/ZasadyFormatowania.md`

- `GeneratorNPC/docs/README.md`
- `GeneratorNPC/docs/Documentation.md`
- `GeneratorNPC/config/FirebaseREADME.md`

- `Kalkulator/docs/README.md`
- `Kalkulator/docs/Documentation.md`
- `Kalkulator/config/FirebaseREADME.md`

- `Infoczytnik/docs/README.md`
- `Infoczytnik/docs/Documentation.md`
- `Infoczytnik/config/FirebaseREADME.md`

- `Audio/docs/README.md`
- `Audio/docs/Documentation.md`
- `Audio/config/FirebaseREADME.md`
- `Audio/Disclaimer.md`

- `GeneratorNazw/docs/README.md`
- `GeneratorNazw/docs/Documentation.md`
- `GeneratorNazw/docs/Logika.md`

- `DiceRoller/docs/README.md`
- `DiceRoller/docs/Documentation.md`

- `shared/FirebaseREADME.md`

Nie edytuj żadnych innych plików.

## 2. Pliki ignorowane

Całkowicie zignoruj poniższe pliki. Nie analizuj ich, nie poprawiaj ich i nie ujmuj ich w podsumowaniu jako wymagających zmian:

- `DetaleLayout.md`
- `Analizy/Cleanup.md`
- `DoZrobienia.md`
- `Kolumny.md`

Nie traktuj poniższych plików jako dokumentacji do edycji:

- `Main/ZmienneHiperlacza.md`
- `Infoczytnik/assets/data/NiebieskaRamka.md`

Uwaga: `Main/ZmienneHiperlacza.md` jest używany przez `Main/index.html` jako plik konfiguracyjny do dynamicznego podstawiania linków „Mapa” i „Obrazki”. Nie edytuj tego pliku w ramach tego zadania. Dokumentacja modułu Main powinna jednak opisywać, do czego ten plik służy i jaki ma format.

## 3. Ogólne zasady aktualizacji dokumentacji

1. Przed edycją dokumentacji sprawdź aktualny stan kodu modułu, którego dokumentację poprawiasz.

2. Nie zakładaj, że dokumentacja jest aktualna.

3. Dokumentacja ma opisywać aktualny stan repozytorium.

4. Dokumentacja nie może być changelogiem.

5. Usuń albo przeredaguj sformułowania historyczne, takie jak:
   - „dodano”
   - „zmieniono”
   - „wcześniej”
   - „obecnie po zmianie”
   - „nowa wersja”
   - „stara wersja”
   - „po migracji”
   - „zostało rozszerzone”
   - „wprowadzono”
   - „usunięto”
   - „przeniesiono”

6. Zamiast historii zmian opisz aktualny stan.

7. `README.md` ma być instrukcją użytkownika:
   - do czego służy moduł;
   - jak go uruchomić;
   - co kliknąć;
   - co powinno się stać po kliknięciu;
   - co oznaczają przyciski, pola, komunikaty i widoki;
   - jak postępować w typowych sytuacjach;
   - co zrobić przy błędach albo pustych stanach.

8. `Documentation.md` ma być dokumentacją techniczną:
   - struktura plików;
   - style i layout;
   - funkcje JavaScript;
   - logika działania;
   - struktura danych;
   - integracje Firebase;
   - zależności między plikami;
   - procedura odtworzenia modułu;
   - istotne testy regresyjne.

9. Dokumenty użytkowe mają mieć dwie pełne wersje językowe:
   - pełna sekcja polska;
   - pełna sekcja angielska.

10. Nie mieszaj języka polskiego i angielskiego sekcja po sekcji.

11. Nie twórz układu typu:
   - sekcja po polsku;
   - od razu ta sama sekcja po angielsku;
   - kolejna sekcja po polsku;
   - kolejna sekcja po angielsku.

12. Poprawny układ dla instrukcji użytkownika:
   - najpierw pełna instrukcja PL;
   - potem pełna instrukcja EN.

13. Jeżeli dokument mówi, że coś działa w określony sposób, potwierdź to w aktualnym kodzie.

14. Nie opisuj funkcji, które nie istnieją w kodzie.

15. Jeżeli funkcja istnieje w kodzie, ale jest celowo ukryta w interfejsie, dokumentacja ma to jasno rozróżniać:
   - użytkownik nie widzi tej funkcji w aktualnym interfejsie;
   - mechanizm jest przygotowany w kodzie;
   - funkcja została celowo wyłączona albo ukryta;
   - dokumentacja techniczna ma wskazywać, gdzie i jak można ją ponownie włączyć.

16. Dotyczy to w szczególności przełącznika języka. Jeżeli w kodzie istnieje mechanizm przełączania języka, ale przełącznik jest ukryty, nie usuwaj informacji o tej funkcji z dokumentacji.

17. W przypadku ukrytego przełącznika języka dokumentacja ma jasno opisywać:
   - że mechanizm przełączania języka jest gotowy w kodzie;
   - że przełącznik jest obecnie celowo wyłączony albo ukryty w interfejsie;
   - że zwykły użytkownik nie widzi tego przełącznika;
   - gdzie dokładnie w kodzie znajduje się element przełącznika;
   - jaka klasa CSS, atrybut albo reguła ukrywa przełącznik;
   - co dokładnie trzeba zmienić, żeby przełącznik pojawił się w interfejsie.

18. W `README.md` nie pisz użytkownikowi, że ma kliknąć albo używać przełącznika języka, którego obecnie nie widzi.

19. W `Documentation.md` opisz technicznie, jak przełącznik języka jest ukryty i jak właściciel repozytorium może go ponownie pokazać.

20. Jeżeli przełącznik jest ukryty przez klasę `language-switcher--hidden`, opisz w dokumentacji, że ponowne pokazanie przełącznika wymaga usunięcia klasy `language-switcher--hidden` z odpowiedniego elementu HTML albo zmiany powiązanej reguły CSS, zgodnie z faktycznym kodem danego modułu.

21. W dokumentacji technicznej podaj konkretną lokalizację:
   - plik;
   - nazwę selektora;
   - nazwę klasy;
   - najbliższy nagłówek, komentarz albo fragment kodu pozwalający łatwo znaleźć miejsce zmiany.

22. Jeżeli dokładny numer linii może się zmienić, nie opieraj instrukcji wyłącznie na numerze linii. Podaj również selektor, klasę albo charakterystyczny fragment kodu.

23. Nie zmieniaj kodu, żeby pokazać przełącznik języka. To zadanie dotyczy wyłącznie dokumentacji.

24. Rozróżniaj:
   - Firestore;
   - Firebase Realtime Database;
   - lokalny JSON;
   - plik importu;
   - eksport/backup;
   - fallback;
   - dane produkcyjne używane przez aplikację.

25. Nie traktuj Firestore i Firebase Realtime Database jako tego samego mechanizmu.

26. Nie dopisuj do dokumentacji informacji o zmianach wykonanych w ramach tego zadania. Dokumentacja po poprawce ma wyglądać tak, jakby od początku opisywała aktualny stan aplikacji.

## 4. Main

Sprawdź i popraw wyłącznie dokumentację:

- `Main/docs/README.md`
- `Main/docs/Documentation.md`

Porównaj dokumentację z aktualnym kodem i plikami używanymi przez moduł:

- `Main/index.html`
- `manifest.webmanifest`
- `service-worker.js`, jeżeli istnieje
- `Main/ZmienneHiperlacza.md`

Nie modyfikuj plików:

- `Main/index.html`
- `manifest.webmanifest`
- `service-worker.js`
- `Main/ZmienneHiperlacza.md`

Wykryty problem:

- dokumentacja Main może opisywać rootowy `service-worker.js` jako globalny mechanizm cache/fetch i sugerować tryb offline;
- aktualny `Main/index.html` zawiera mechanizm online-only i wyrejestrowuje stare Service Workery;
- `Main/ZmienneHiperlacza.md` jest używany przez `Main/index.html` jako plik konfiguracyjny dla linków „Mapa” i „Obrazki”, więc dokumentacja powinna opisywać jego rolę, ale sam plik nie powinien być zmieniany.

Zadanie:

1. Popraw opis PWA, manifestu i Service Workera w dokumentacji.
2. Opisz aktualny stan: aplikacja działa online-only, jeśli kod nadal wyrejestrowuje Service Workery.
3. Nie pisz, że aplikacja działa offline, jeśli aktualny kod tego nie wspiera.
4. Jeżeli manifest PWA nadal istnieje, opisz go jako element instalacji/trybu standalone, a nie dowód obsługi offline.
5. Opisz w dokumentacji rolę `Main/ZmienneHiperlacza.md`:
   - plik jest używany przez `Main/index.html`;
   - zawiera linki dla przycisków „Mapa” i „Obrazki”;
   - oczekiwany format wpisów to linie zaczynające się od `Mapa:` i `Obrazki:`;
   - brak pliku, brak wpisu albo błędny format powoduje, że dynamiczne linki nie zostaną poprawnie podstawione.
6. W `README.md` opisz użytkownikowi:
   - do czego służy strona główna;
   - czym różni się widok zwykły od widoku administratora;
   - jak wejść w tryb administratora;
   - które przyciski są widoczne dla zwykłego użytkownika;
   - które przyciski są widoczne dla administratora;
   - jak działają linki do mapy i obrazków;
   - co zrobić, jeśli link mapy albo obrazków nie działa.
7. W `Documentation.md` opisz technicznie:
   - strukturę `Main/index.html`;
   - obsługę parametru `admin=1`;
   - dynamiczne ładowanie linków z `Main/ZmienneHiperlacza.md`;
   - aktualny mechanizm PWA/online-only;
   - brak bezpośredniej integracji Firebase, jeżeli kod tego nie używa.

## 5. DataVault

Sprawdź i popraw wyłącznie dokumentację:

- `DataVault/docs/README.md`
- `DataVault/docs/Documentation.md`
- `DataVault/docs/ZasadyFormatowania.md`

Porównaj dokumentację z aktualnym kodem:

- `DataVault/index.html`
- `DataVault/app.js`
- `DataVault/build_json.py`
- `DataVault/xlsxCanonicalParser.js`
- `shared/firebase-data-loader.js`
- `shared/FirebaseREADME.md`

Nie modyfikuj kodu ani plików danych DataVault.

Wykryty problem:

- część dokumentacji może nadal opisywać `data.json` jako bieżące produkcyjne źródło danych;
- obecna architektura korzysta z mechanizmów Firebase i prywatnego ładowania danych;
- trzeba odróżnić narzędzia importu/generowania danych od aktualnego źródła danych aplikacji.

Zadanie:

1. Sprawdź aktualny kod DataVault i ustal faktyczne źródło danych.
2. Ustal, czy DataVault pobiera dane z:
   - Firebase Realtime Database;
   - Firestore;
   - lokalnego JSON;
   - pliku statycznego;
   - fallbacku;
   - innego mechanizmu.
3. Jeżeli `Repozytorium.xlsx`, `build_json.py`, `xlsxCanonicalParser.js`, `data.json` albo `firebase-import.json` pełnią rolę narzędzi importu, generowania, eksportu lub backupu, opisz je jako takie.
4. Nie opisuj `data.json` jako aktualnego produkcyjnego źródła danych, jeżeli aktualny kod tak nie działa.
5. Popraw opis `firebase-import.json`, jeśli jest używany jako plik importu do Firebase.
6. Sprawdź, czy moduł ma przygotowany mechanizm przełączania języka, który jest celowo ukryty. Jeśli tak, opisz to zgodnie z zasadami z sekcji ogólnej.
7. W `README.md` wyjaśnij użytkownikowi:
   - jak uruchomić DataVault;
   - czym różni się widok zwykły od admina;
   - jak korzystać z tabel;
   - jak działają zakładki;
   - jak działają filtry;
   - jak działa wyszukiwanie;
   - jak działa sortowanie;
   - jak działa podgląd szczegółów;
   - jak działa porównywanie rekordów;
   - co zrobić przy braku danych albo błędzie ładowania;
   - czy przełącznik języka jest obecnie widoczny dla użytkownika.
8. W `Documentation.md` opisz technicznie:
   - strukturę plików modułu;
   - zależności od wspólnych plików;
   - faktyczne źródło danych;
   - strukturę danych;
   - parsery;
   - eksport/import;
   - integrację Firebase;
   - fallbacki;
   - zasady formatowania tekstu;
   - mechanikę filtrów, sortowania, zakładek i modali;
   - mechanizm przełączania języka, jeśli istnieje w kodzie, wraz ze wskazaniem, jak jest ukryty i jak można go ponownie pokazać.
9. `ZasadyFormatowania.md` popraw tylko wtedy, gdy opisuje nieaktualne markery, kolory, wyjątki formatowania albo zasady renderowania danych.

## 6. GeneratorNPC

Sprawdź i popraw wyłącznie dokumentację:

- `GeneratorNPC/docs/README.md`
- `GeneratorNPC/docs/Documentation.md`
- `GeneratorNPC/config/FirebaseREADME.md`

Porównaj dokumentację z aktualnym kodem:

- `GeneratorNPC/index.html`
- `shared/firebase-data-loader.js`
- `shared/FirebaseREADME.md`

Nie modyfikuj kodu GeneratorNPC.

Wykryty problem:

- dokumentacja może nadal opisywać `../DataVault/data.json` albo `DATA_URL = "../DataVault/data.json"` jako aktualne główne źródło danych;
- dokumentacja miesza opis publicznego JSON, prywatnych danych Firebase i zapisu ulubionych;
- trzeba oddzielić dane główne NPC od ulubionych/zapisów użytkownika;
- mechanizm przełączania języka może być przygotowany w kodzie, ale celowo ukryty w interfejsie.

Zadanie:

1. Sprawdź aktualny kod `GeneratorNPC/index.html`.
2. Ustal, skąd moduł pobiera dane główne do generowania NPC.
3. Ustal, gdzie zapisuje ulubione albo zapisane wyniki użytkownika.
4. Ustal, czy moduł używa:
   - Firestore;
   - Firebase Realtime Database;
   - wspólnego loadera;
   - lokalnego JSON;
   - fallbacku;
   - kilku mechanizmów naraz.
5. Usuń albo przeredaguj nieaktualne wzmianki o `DATA_URL = "../DataVault/data.json"`, jeśli kod już tego nie używa.
6. Sprawdź, czy przełącznik języka jest ukryty przez klasę `language-switcher--hidden`, atrybut albo regułę CSS.
7. W `README.md` opisz użytkownikowi:
   - jak uruchomić moduł;
   - jak wygenerować NPC;
   - jakie opcje można wybrać;
   - jak działają filtry;
   - jak działają ulubione albo zapisy, jeśli są dostępne;
   - co zrobić, jeśli dane nie załadują się poprawnie;
   - że przełącznik języka nie jest obecnie widoczny, jeśli jest celowo ukryty.
8. W `Documentation.md` opisz technicznie:
   - źródło danych głównych;
   - strukturę danych;
   - integrację Firebase;
   - mechanizm ulubionych/zapisów;
   - fallbacki;
   - zależności od wspólnych plików;
   - funkcje generujące wynik;
   - renderowanie karty NPC;
   - gdzie znajduje się mechanizm przełączania języka;
   - jaka klasa, atrybut albo reguła CSS ukrywa przełącznik;
   - co dokładnie trzeba zmienić, aby przełącznik pojawił się w interfejsie.
9. Nie zmieniaj kodu, żeby pokazać przełącznik języka.

## 7. Kalkulator

Sprawdź i popraw wyłącznie dokumentację:

- `Kalkulator/docs/README.md`
- `Kalkulator/docs/Documentation.md`
- `Kalkulator/config/FirebaseREADME.md`

Porównaj dokumentację z aktualnym kodem:

- `Kalkulator/index.html`
- `Kalkulator/TworzeniePostaci.html`
- pliki w `Kalkulator/config/`

Nie modyfikuj kodu Kalkulatora.

Wykryty problem:

- `Kalkulator/docs/Documentation.md` mówi, że aplikacja nie ma backendu i działa wyłącznie lokalnie w przeglądarce;
- aktualny `TworzeniePostaci.html` ładuje Firebase App oraz Firebase Firestore;
- kod zawiera funkcje zapisu i odczytu stanu postaci z Firebase/Firestore.

Zadanie:

1. Popraw dokumentację techniczną, żeby nie mówiła, że Kalkulator nie ma backendu, jeśli aktualny kod używa Firebase/Firestore.
2. Rozróżnij:
   - obliczenia XP/PD wykonywane lokalnie w przeglądarce;
   - zapis stanu postaci;
   - wczytywanie stanu postaci;
   - konfigurację Firebase;
   - zachowanie przy błędzie Firebase.
3. Sprawdź, czy moduł ma przygotowany mechanizm przełączania języka, który jest celowo ukryty. Jeśli tak, opisz to zgodnie z zasadami z sekcji ogólnej.
4. W `README.md` opisz użytkownikowi:
   - jak wejść do kalkulatora;
   - jak używać kreatora postaci;
   - jak działają pola XP/PD;
   - jak działają atrybuty;
   - jak działają umiejętności;
   - jak działają talenty;
   - jak działa zapis;
   - jak działa wczytywanie;
   - co się stanie, gdy Firebase nie jest skonfigurowany albo zapis się nie uda;
   - jak otworzyć instrukcję PDF, jeśli moduł ją udostępnia;
   - czy przełącznik języka jest obecnie widoczny dla użytkownika.
5. W `Documentation.md` opisz technicznie:
   - strukturę plików;
   - kalkulacje XP/PD;
   - walidacje;
   - modale potwierdzeń;
   - integrację Firestore;
   - konfigurację Firebase;
   - zapis i odczyt stanu postaci;
   - fallbacki i obsługę błędów;
   - mechanizm przełączania języka, jeśli istnieje w kodzie, wraz ze wskazaniem, jak jest ukryty i jak można go ponownie pokazać.
6. Usuń sekcje changelogowe.
7. Nie pisz „dodano przycisk”, „zmieniono XP na PD” ani podobnych historii. Opisz aktualny interfejs.

## 8. Infoczytnik

Sprawdź i popraw wyłącznie dokumentację:

- `Infoczytnik/docs/README.md`
- `Infoczytnik/docs/Documentation.md`
- `Infoczytnik/config/FirebaseREADME.md`

Porównaj dokumentację z aktualnym kodem:

- `Infoczytnik/GM_test.html`
- `Infoczytnik/Infoczytnik_test.html`

Nie modyfikuj kodu Infoczytnika.

Nie edytuj:

- `Infoczytnik/GM.html`
- `Infoczytnik/Infoczytnik.html`
- `Infoczytnik/GM_backup.html`
- `Infoczytnik/Infoczytnik_backup.html`
- `Infoczytnik/GM_test.html`
- `Infoczytnik/Infoczytnik_test.html`

Wykryty problem:

- `Infoczytnik/docs/Documentation.md` może mieć nieaktualną wartość `INF_VERSION`;
- aktualny `GM_test.html` i `Infoczytnik_test.html` mają wersję `INF_VERSION = "2026-04-30_12-00-51"`;
- dokumentacja wspomina strukturę z `aliases`, co wygląda na możliwy copy-paste albo nieaktualny opis;
- trzeba sprawdzić aktualny payload w Firestore i opisać tylko realne pola używane przez moduł.

Zadanie:

1. Sprawdź aktualne `INF_VERSION` w obu plikach testowych.
2. Popraw dokumentację tak, aby wersja zgadzała się z kodem.
3. Sprawdź aktualną strukturę danych zapisywaną i odczytywaną przez moduł.
4. Usuń albo przeredaguj opis `aliases`, jeśli aktualny kod go nie używa.
5. Sprawdź, czy moduł ma przygotowany mechanizm przełączania języka, który jest celowo ukryty. Jeśli tak, opisz to zgodnie z zasadami z sekcji ogólnej.
6. W `README.md` opisz użytkownikowi:
   - do czego służy Infoczytnik;
   - czym różni się panel GM od ekranu gracza;
   - jak wysłać wiadomość;
   - jak wybrać frakcję/layout;
   - jak działają dźwięki;
   - jak działa uzbrajanie audio po stronie odbiornika;
   - jak działa tryb debug;
   - co zrobić, jeśli wiadomość albo dźwięk się nie pojawia;
   - czy przełącznik języka jest obecnie widoczny dla użytkownika.
7. W `Documentation.md` opisz technicznie:
   - strukturę plików testowych;
   - ograniczenia edycji plików produkcyjnych i backupów bez ich modyfikowania;
   - `INF_VERSION`;
   - strukturę danych w Firestore;
   - funkcje wysyłania i odbioru wiadomości;
   - obsługę audio;
   - obsługę layoutów;
   - debug overlay;
   - fallbacki;
   - testy regresyjne;
   - mechanizm przełączania języka, jeśli istnieje w kodzie, wraz ze wskazaniem, jak jest ukryty i jak można go ponownie pokazać.
8. Nie zmieniaj żadnych plików HTML Infoczytnika. To zadanie dotyczy wyłącznie dokumentacji.

## 9. Audio

Sprawdź i popraw wyłącznie dokumentację:

- `Audio/docs/README.md`
- `Audio/docs/Documentation.md`
- `Audio/config/FirebaseREADME.md`
- `Audio/Disclaimer.md`

Porównaj dokumentację z aktualnym kodem:

- `Audio/index.html`
- pliki w `Audio/config/`
- katalogi z plikami audio, jeżeli są używane przez moduł

Nie modyfikuj kodu Audio ani plików audio.

Wykryty problem:

- mechanizm przełączania języka może być przygotowany w kodzie, ale celowo ukryty w interfejsie;
- dokumentacja powinna jasno mówić, że użytkownik obecnie nie widzi przełącznika, jeżeli jest ukryty;
- dokumentacja techniczna powinna wskazywać, gdzie znajduje się kod przełącznika i co trzeba zmienić, aby go pokazać;
- trzeba sprawdzić aktualny sposób wyboru języka, tryb admina i integrację Firebase;
- trzeba upewnić się, że dokumentacja nie opisuje starych lub niedostępnych funkcji jako dostępnych dla użytkownika.

Zadanie:

1. Sprawdź, czy przełącznik języka jest widoczny dla użytkownika.
2. Jeżeli jest ukryty, nie usuwaj informacji o mechanizmie językowym. Opisz, że funkcja jest przygotowana, ale celowo wyłączona w interfejsie.
3. Sprawdź, jak działa tryb zwykły i tryb administratora.
4. Sprawdź, czy Audio używa Firebase, Firestore, Realtime Database albo plików konfiguracyjnych.
5. W `README.md` opisz użytkownikowi:
   - do czego służy moduł Audio;
   - jak uruchomić dźwięki;
   - czym różni się widok zwykły od admina;
   - jak dodawać albo wybierać dźwięki, jeśli interfejs to wspiera;
   - jak działają kategorie;
   - jak działają komunikaty błędów;
   - co zrobić, jeśli przeglądarka blokuje odtwarzanie;
   - że przełącznik języka nie jest obecnie widoczny, jeśli jest celowo ukryty.
6. W `Documentation.md` opisz technicznie:
   - strukturę plików;
   - logikę odtwarzania;
   - źródła plików audio;
   - integrację Firebase, jeśli występuje;
   - konfigurację;
   - obsługę trybu admin;
   - fallbacki i błędy;
   - gdzie znajduje się mechanizm przełączania języka;
   - jaka klasa, atrybut albo reguła CSS ukrywa przełącznik;
   - co dokładnie trzeba zmienić, aby przełącznik pojawił się w interfejsie.
7. `Audio/Disclaimer.md` popraw tylko wtedy, gdy zawiera nieaktualne lub niejasne informacje względem aktualnego działania modułu.
8. Nie zmieniaj kodu, żeby pokazać przełącznik języka.

## 10. GeneratorNazw

Sprawdź i popraw wyłącznie dokumentację:

- `GeneratorNazw/docs/README.md`
- `GeneratorNazw/docs/Documentation.md`
- `GeneratorNazw/docs/Logika.md`

Porównaj dokumentację z aktualnym kodem:

- `GeneratorNazw/index.html`

Nie modyfikuj kodu GeneratorNazw.

Wykryty problem:

- mechanizm przełączania języka może być przygotowany w kodzie, ale celowo ukryty w interfejsie, np. przez klasę `language-switcher--hidden`;
- dokumentacja powinna opisywać ten stan jako gotową, ale wyłączoną funkcję, a nie jako błąd.

Zadanie:

1. Sprawdź aktualny interfejs.
2. Sprawdź, czy przełącznik języka jest ukryty przez klasę `language-switcher--hidden`, atrybut albo regułę CSS.
3. Jeżeli przełącznik języka jest ukryty, opisz, że:
   - mechanizm przełączania języka jest przygotowany;
   - przełącznik jest obecnie celowo ukryty w interfejsie;
   - użytkownik obecnie go nie widzi;
   - właściciel repozytorium może go pokazać przez usunięcie odpowiedniej klasy albo zmianę reguły CSS.
4. W `README.md` opisz użytkownikowi:
   - do czego służy generator;
   - jak wybrać płeć/typ/imiona/nazwiska, jeśli takie opcje istnieją;
   - jak wygenerować wynik;
   - jak czytać listę wyników;
   - co zrobić, jeśli wynik się nie pojawia;
   - że przełącznik języka nie jest obecnie widoczny, jeśli jest celowo ukryty.
5. W `Documentation.md` opisz technicznie:
   - strukturę pliku;
   - dane wejściowe;
   - listy nazw;
   - funkcje losujące;
   - renderowanie wyników;
   - obsługę języka, jeśli istnieje;
   - style i layout;
   - gdzie znajduje się mechanizm przełączania języka;
   - jaka klasa, atrybut albo reguła CSS ukrywa przełącznik;
   - co dokładnie trzeba zmienić, aby przełącznik pojawił się w interfejsie.
6. `Logika.md` nie może być sprzeczny z aktualnym kodem. Jeżeli zawiera stare założenia, popraw go albo ogranicz jego treść do aktualnej logiki.
7. Nie zmieniaj kodu, żeby pokazać przełącznik języka.

## 11. DiceRoller

Sprawdź i popraw wyłącznie dokumentację:

- `DiceRoller/docs/README.md`
- `DiceRoller/docs/Documentation.md`

Porównaj dokumentację z aktualnym kodem:

- `DiceRoller/index.html`
- `DiceRoller/script.js`
- `DiceRoller/style.css`, jeśli istnieje

Nie modyfikuj kodu DiceRoller.

Zadanie:

1. Sprawdź aktualną funkcjonalność rzutu kośćmi.
2. Sprawdź, czy moduł ma przygotowany mechanizm przełączania języka, który jest celowo ukryty. Jeśli tak, opisz to zgodnie z zasadami z sekcji ogólnej.
3. W `README.md` opisz użytkownikowi:
   - jak wykonać rzut;
   - jakie kości albo pule są obsługiwane;
   - jak czytać wynik;
   - czy są modyfikatory;
   - czy są automatyczne sukcesy/porażki/ikony;
   - co zrobić przy błędnym wejściu;
   - czy przełącznik języka jest obecnie widoczny dla użytkownika.
4. W `Documentation.md` opisz technicznie:
   - strukturę plików;
   - parser wejścia;
   - funkcje losujące;
   - strukturę wyniku;
   - renderowanie historii;
   - obsługę błędów;
   - style i layout;
   - mechanizm przełączania języka, jeśli istnieje w kodzie, wraz ze wskazaniem, jak jest ukryty i jak można go ponownie pokazać.
5. Usuń historię zmian, jeśli występuje.
6. Nie opisuj funkcji, których nie ma w aktualnym kodzie.
7. Nie zmieniaj kodu, żeby pokazać przełącznik języka.

## 12. Shared Firebase

Sprawdź i popraw wyłącznie dokumentację:

- `shared/FirebaseREADME.md`

Porównaj dokumentację z aktualnym kodem:

- `shared/firebase-data-loader.js`
- `shared/firebase-config.js`, jeśli istnieje
- moduły korzystające ze wspólnego loadera

Nie modyfikuj kodu wspólnego loadera ani konfiguracji.

Zadanie:

1. Sprawdź, czy wspólny loader korzysta z Firebase Realtime Database, Firestore, czy obu mechanizmów.
2. Opisz dokładnie, do czego służy wspólny loader.
3. Opisz:
   - wymagane pola konfiguracji;
   - sposób uwierzytelniania;
   - źródło danych;
   - strukturę danych;
   - błędy i komunikaty;
   - moduły, które korzystają z loadera.
4. Nie pisz ogólnie „Firebase”, jeśli trzeba rozróżnić Firestore i Realtime Database.
5. Usuń nieaktualne wzmianki o plikach importu albo lokalnych JSON-ach jako produkcyjnym źródle danych, jeżeli aktualny loader tak nie działa.

## 13. Pliki FirebaseREADME w modułach

Sprawdź i popraw wyłącznie dokumentację:

- `Kalkulator/config/FirebaseREADME.md`
- `GeneratorNPC/config/FirebaseREADME.md`
- `Infoczytnik/config/FirebaseREADME.md`
- `Audio/config/FirebaseREADME.md`

Porównaj każdy plik z aktualnym kodem danego modułu.

Nie modyfikuj plików konfiguracyjnych Firebase ani kodu modułów.

Zadanie:

1. Ustal, czy moduł korzysta z:
   - Firestore;
   - Firebase Realtime Database;
   - Authentication;
   - plików lokalnych;
   - fallbacków.
2. Popraw nazewnictwo usług Firebase.
3. Nie mieszaj Firestore i Realtime Database.
4. Opisz konfigurację potrzebną użytkownikowi albo administratorowi.
5. Usuń informacje o nieistniejących plikach, kolekcjach, ścieżkach albo funkcjach.
6. Nie dodawaj historii zmian.

## 14. Kontrola jakości po poprawkach

Po edycji wykonaj kontrolę dokumentacji.

Wyszukaj w edytowanych plikach dokumentacyjnych wystąpienia:

- `wcześniej`
- `dodano`
- `zmieniono`
- `stara wersja`
- `nowa wersja`
- `po migracji`
- `DATA_URL`
- `../DataVault/data.json`
- `nie ma backendu`
- `offline`
- `Service Worker`
- `Firestore`
- `Realtime Database`
- `language-switcher--hidden`
- `przełącznik języka`
- `language switcher`

Dla każdego wystąpienia oceń, czy jest aktualne i potrzebne.

Usuń albo przeredaguj nieaktualne fragmenty.

Sprawdź, czy README użytkowe mają pełną sekcję PL i pełną sekcję EN.

Sprawdź, czy dokumenty techniczne nie są tylko listą zmian.

Sprawdź, czy dokumentacja nie myli Firestore z Firebase Realtime Database.

Sprawdź, czy dokumentacja poprawnie rozróżnia:
- funkcje dostępne dla użytkownika;
- funkcje istniejące w kodzie, ale celowo ukryte w interfejsie.

Jeżeli przełącznik języka jest ukryty, dokumentacja ma mówić:
- że użytkownik obecnie go nie widzi;
- że mechanizm jest przygotowany;
- gdzie w kodzie jest ukryty;
- jaka klasa, atrybut albo reguła CSS go ukrywa;
- co trzeba zmienić, żeby go pokazać.

Sprawdź, czy nie zmieniono żadnych plików spoza listy dozwolonych plików dokumentacyjnych.

## 15. Oczekiwany rezultat

Po zakończeniu dokumentacja ma być spójna z aktualnym kodem.

Użytkownik czytający README powinien wiedzieć, jak korzystać z modułu.

Programista czytający Documentation powinien wiedzieć, jak moduł działa technicznie i jak go odtworzyć.

Dokumentacja nie powinna zawierać historii zmian, nieaktualnych źródeł danych ani nieistniejących funkcji.

Jeżeli funkcja istnieje w kodzie, ale jest celowo ukryta w interfejsie, dokumentacja ma to jasno opisywać i wskazywać, jak właściciel repozytorium może ją ponownie włączyć przez zmianę odpowiedniej klasy, selektora, atrybutu albo reguły CSS.

Kod aplikacji, konfiguracje produkcyjne i pliki danych mają pozostać bez zmian.

## Sekcja planistyczna — zakres aktualizacji dokumentacji (etap bez edycji dokumentacji)

Data przygotowania planu: 2026-05-19

### Cel etapu
Na tym etapie wykonujemy wyłącznie plan realizacji. Nie edytujemy jeszcze żadnego pliku dokumentacji, kodu, konfiguracji ani danych. Celem jest precyzyjne wskazanie, które pliki dokumentacyjne trzeba później zweryfikować i jakiego typu korekty będą wymagane na podstawie aktualnego kodu.

### Pliki dokumentacyjne wymagające sprawdzenia/aktualizacji

#### Main
- `Main/docs/README.md`
- `Main/docs/Documentation.md`

Zakres planowanych zmian:
- Ujednolicenie opisu modułu Main jako strony startowej uruchamiającej moduły.
- Weryfikacja i doprecyzowanie trybu zwykłego oraz trybu administratora (`admin=1`) zgodnie z rzeczywistą logiką.
- Poprawny opis dynamicznych linków „Mapa” i „Obrazki” opartych o `Main/ZmienneHiperlacza.md` (bez edycji samego pliku konfiguracyjnego).
- Usunięcie/przeredagowanie nieaktualnych treści o globalnym mechanizmie Service Worker/offline, jeśli nie odpowiadają stanowi kodu.

Pliki kodu/referencyjne do weryfikacji:
- `Main/index.html`
- `manifest.webmanifest`
- `service-worker.js` (jeśli istnieje)
- `Main/ZmienneHiperlacza.md` (tylko odczyt)

#### DataVault
- `DataVault/docs/README.md`
- `DataVault/docs/Documentation.md`
- `DataVault/docs/ZasadyFormatowania.md` (tylko jeśli obecne zasady są niezgodne z aktualnym renderowaniem)

Zakres planowanych zmian:
- Rozdzielenie opisu produkcyjnego źródła danych od plików narzędziowych/importowych (`Repozytorium.xlsx`, `build_json.py`, `xlsxCanonicalParser.js`, `data.json`, `firebase-import.json`).
- Korekta opisu integracji Firebase (precyzyjne nazwy usług i faktyczny przepływ danych).
- Doprecyzowanie mechanik interfejsu: zakładki, filtry, sortowanie, wyszukiwanie, szczegóły, porównywanie rekordów.
- Weryfikacja opisu mechanizmu językowego (w tym ewentualnego ukrycia przełącznika).

Pliki kodu/referencyjne do weryfikacji:
- `DataVault/index.html`
- `DataVault/app.js`
- `DataVault/build_json.py`
- `DataVault/xlsxCanonicalParser.js`
- `shared/firebase-data-loader.js`
- `shared/FirebaseREADME.md`

#### GeneratorNPC
- `GeneratorNPC/docs/README.md`
- `GeneratorNPC/docs/Documentation.md`
- `GeneratorNPC/config/FirebaseREADME.md`

Zakres planowanych zmian:
- Usunięcie/przeredagowanie nieaktualnych odwołań do `DATA_URL = "../DataVault/data.json"`, jeżeli kod ich już nie używa.
- Jasne rozdzielenie: źródło danych głównych NPC vs zapisy/ulubione użytkownika.
- Doprecyzowanie użycia wspólnego loadera i usług Firebase.
- Weryfikacja mechanizmu przełącznika języka (w tym ukrycia w UI, jeśli dotyczy).

Pliki kodu/referencyjne do weryfikacji:
- `GeneratorNPC/index.html`
- `shared/firebase-data-loader.js`
- `shared/FirebaseREADME.md`

#### Kalkulator
- `Kalkulator/docs/README.md`
- `Kalkulator/docs/Documentation.md`
- `Kalkulator/config/FirebaseREADME.md`

Zakres planowanych zmian:
- Usunięcie twierdzeń, że moduł „nie ma backendu”, jeśli kod używa Firebase/Firestore.
- Rozdzielenie opisu lokalnych obliczeń XP/PD od zapisu/odczytu stanu postaci.
- Doprecyzowanie ścieżek błędów i fallbacków przy problemach z Firebase.
- Weryfikacja opisu przełącznika języka (w tym jego ewentualnego ukrycia).

Pliki kodu/referencyjne do weryfikacji:
- `Kalkulator/index.html`
- `Kalkulator/TworzeniePostaci.html`
- pliki w `Kalkulator/config/`

#### Infoczytnik
- `Infoczytnik/docs/README.md`
- `Infoczytnik/docs/Documentation.md`
- `Infoczytnik/config/FirebaseREADME.md`

Zakres planowanych zmian:
- Synchronizacja `INF_VERSION` z wartościami występującymi w plikach testowych.
- Weryfikacja realnej struktury payloadu i usunięcie/przeredagowanie opisu `aliases`, jeśli nie jest używane.
- Doprecyzowanie różnic między panelem GM i ekranem gracza, audio, debug overlay oraz obsługą błędów.
- Weryfikacja mechanizmu przełączania języka (w tym ukrycia przełącznika, jeśli dotyczy).

Pliki kodu/referencyjne do weryfikacji:
- `Infoczytnik/GM_test.html`
- `Infoczytnik/Infoczytnik_test.html`

#### Audio
- `Audio/docs/README.md`
- `Audio/docs/Documentation.md`
- `Audio/config/FirebaseREADME.md`
- `Audio/Disclaimer.md` (tylko jeśli treść jest nieaktualna względem działania)

Zakres planowanych zmian:
- Doprecyzowanie działania trybu zwykłego i administratora.
- Aktualizacja opisu źródeł audio i konfiguracji/fallbacków.
- Precyzyjny opis integracji Firebase (jeśli występuje) bez mieszania usług.
- Weryfikacja opisu mechanizmu językowego i statusu widoczności przełącznika.

Pliki kodu/referencyjne do weryfikacji:
- `Audio/index.html`
- pliki w `Audio/config/`
- katalogi audio używane przez moduł

#### GeneratorNazw
- `GeneratorNazw/docs/README.md`
- `GeneratorNazw/docs/Documentation.md`
- `GeneratorNazw/docs/Logika.md`

Zakres planowanych zmian:
- Uzgodnienie dokumentacji z rzeczywistymi opcjami generatora i sposobem prezentacji wyników.
- Weryfikacja logiki losowania oraz opisu danych wejściowych/list nazw.
- Sprawdzenie, czy przełącznik języka jest celowo ukryty i techniczny opis sposobu jego ponownego pokazania.

Pliki kodu/referencyjne do weryfikacji:
- `GeneratorNazw/index.html`

#### DiceRoller
- `DiceRoller/docs/README.md`
- `DiceRoller/docs/Documentation.md`

Zakres planowanych zmian:
- Uaktualnienie opisu parsera wejścia, mechaniki rzutu, prezentacji wyników i historii.
- Korekta opisu błędów walidacyjnych i ograniczeń wejścia.
- Weryfikacja mechanizmu przełączania języka (jeśli istnieje), wraz z informacją o ewentualnym ukryciu w UI.

Pliki kodu/referencyjne do weryfikacji:
- `DiceRoller/index.html`
- `DiceRoller/script.js`
- `DiceRoller/style.css` (jeśli istnieje)

#### Shared
- `shared/FirebaseREADME.md`

Zakres planowanych zmian:
- Precyzyjne określenie roli wspólnego loadera danych i modułów zależnych.
- Rozróżnienie Firestore i Realtime Database zgodnie z faktycznym kodem.
- Usunięcie/przeredagowanie nieaktualnych odniesień do lokalnych JSON-ów jako produkcyjnego źródła danych (jeśli niezgodne ze stanem bieżącym).

Pliki kodu/referencyjne do weryfikacji:
- `shared/firebase-data-loader.js`
- `shared/firebase-config.js` (jeśli istnieje)
- moduły korzystające ze wspólnego loadera

### Informacje do usunięcia, przeredagowania lub doprecyzowania (globalnie)
W późniejszym etapie aktualizacji dokumentacji trzeba będzie:
- usunąć język changelogowy („dodano”, „zmieniono”, „wcześniej”, „stara/nowa wersja”, „po migracji” itd.),
- usunąć niezgodne z kodem opisy źródeł danych,
- doprecyzować rozróżnienie: Firestore vs Realtime Database,
- doprecyzować różnicę między funkcjami dostępnymi dla użytkownika a funkcjami przygotowanymi w kodzie, ale ukrytymi w UI,
- utrzymać kompletny układ językowy dokumentów użytkowych: najpierw pełna sekcja PL, następnie pełna sekcja EN,
- potwierdzić, że każda opisana funkcja faktycznie istnieje i działa w aktualnym kodzie.

### Pliki, które należy pominąć zgodnie z listą ignorowanych
Zgodnie z wytycznymi analizy, w planie i późniejszej realizacji należy pominąć:
- `DetaleLayout.md`
- `Analizy/Cleanup.md`
- `DoZrobienia.md`
- `Kolumny.md`

Dodatkowo nie traktujemy jako dokumentacji do edycji:
- `Main/ZmienneHiperlacza.md`
- `Infoczytnik/assets/data/NiebieskaRamka.md`

### Ograniczenia bieżącego etapu
- Na tym etapie **nie edytujemy** żadnego pliku dokumentacyjnego modułów.
- Na tym etapie **nie zmieniamy** żadnego kodu, konfiguracji ani danych.
- Bieżący krok kończy się wyłącznie dopisaniem planu do `Analizy/Zadanie.md`.

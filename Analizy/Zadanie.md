Masz dostęp do repozytorium `CuteLittleGoat/WrathAndGlory` i uprawnienia do edycji.

Cel zadania: popraw dokumentację repozytorium tak, aby opisywała aktualny stan aplikacji, a nie historię zmian. Zadanie dotyczy wyłącznie dokumentacji, instrukcji użytkownika i plików README/Documentation/FirebaseREADME/Disclaimer wskazanych lub wynikających z modułów.

Nie zmieniaj kodu aplikacji, logiki działania modułów, konfiguracji produkcyjnych ani plików danych, chyba że użytkownik osobno o to poprosi.

## 1. Najważniejsze zasady

1. Przed edycją sprawdź aktualny stan kodu modułu, którego dokumentację poprawiasz.

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

14. Nie opisuj funkcji, które nie istnieją w interfejsie.

15. Nie pisz użytkownikowi, że ma użyć przełącznika języka, jeśli w aktualnym kodzie przełącznik jest ukryty albo niedostępny.

16. Rozróżniaj:
   - Firestore;
   - Firebase Realtime Database;
   - lokalny JSON;
   - plik importu;
   - eksport/backup;
   - fallback;
   - dane produkcyjne używane przez aplikację.

17. Nie traktuj Firestore i Firebase Realtime Database jako tego samego mechanizmu.

18. Po zakończeniu zadania wypisz:
   - które pliki zostały zmienione;
   - jakie nieaktualne informacje usunięto;
   - jakie aktualne zachowania opisano;
   - które miejsca wymagały decyzji właściciela;
   - czego celowo nie edytowano.

## 2. Pliki ignorowane

Całkowicie zignoruj poniższe pliki. Nie analizuj ich, nie poprawiaj ich i nie ujmuj ich w podsumowaniu jako wymagających zmian:

- `DetaleLayout.md`
- `Analizy/Cleanup.md`
- `DoZrobienia.md`
- `Kolumny.md`

Nie traktuj jako dokumentacji użytkowej poniższych plików danych albo konfiguracji:

- `Main/ZmienneHiperlacza.md`
- `Infoczytnik/assets/data/NiebieskaRamka.md`

Nie przerabiaj ich na dokumentację.

## 3. Main

Sprawdź i popraw:

- `Main/docs/README.md`
- `Main/docs/Documentation.md`

Porównaj z aktualnym kodem:

- `Main/index.html`
- `manifest.webmanifest`
- `service-worker.js`, jeżeli istnieje

Wykryty problem:

- dokumentacja Main opisuje rootowy `service-worker.js` jako globalny mechanizm cache/fetch i sugeruje tryb offline;
- aktualny `Main/index.html` zawiera mechanizm online-only i wyrejestrowuje stare Service Workery przez `navigator.serviceWorker.getRegistrations().then(...unregister())`.

Zadanie:

1. Popraw opis PWA, manifestu i Service Workera.
2. Opisz aktualny stan: aplikacja działa online-only, jeśli kod nadal wyrejestrowuje Service Workery.
3. Nie pisz, że aplikacja działa offline, jeśli aktualny kod tego nie wspiera.
4. Jeżeli manifest PWA nadal istnieje, opisz go jako element instalacji/trybu standalone, a nie dowód obsługi offline.
5. W `README.md` opisz użytkownikowi:
   - do czego służy strona główna;
   - czym różni się widok zwykły od widoku administratora;
   - jak wejść w tryb administratora;
   - które przyciski są widoczne dla zwykłego użytkownika;
   - które przyciski są widoczne dla administratora;
   - jak działają linki do mapy i obrazków;
   - co zrobić, jeśli link mapy albo obrazków nie działa.
6. W `Documentation.md` opisz technicznie:
   - strukturę `Main/index.html`;
   - obsługę parametru `admin=1`;
   - dynamiczne ładowanie linków z `ZmienneHiperlacza.md`;
   - aktualny mechanizm PWA/online-only;
   - brak bezpośredniej integracji Firebase, jeżeli kod tego nie używa.

## 4. DataVault

Sprawdź i popraw:

- `DataVault/docs/README.md`
- `DataVault/docs/Documentation.md`
- `DataVault/docs/ZasadyFormatowania.md`

Porównaj z aktualnym kodem:

- `DataVault/index.html`
- `DataVault/app.js`
- `DataVault/build_json.py`
- `DataVault/xlsxCanonicalParser.js`
- `shared/firebase-data-loader.js`
- `shared/FirebaseREADME.md`

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
6. W `README.md` wyjaśnij użytkownikowi:
   - jak uruchomić DataVault;
   - czym różni się widok zwykły od admina;
   - jak korzystać z tabel;
   - jak działają zakładki;
   - jak działają filtry;
   - jak działa wyszukiwanie;
   - jak działa sortowanie;
   - jak działa podgląd szczegółów;
   - jak działa porównywanie rekordów;
   - co zrobić przy braku danych albo błędzie ładowania.
7. W `Documentation.md` opisz technicznie:
   - strukturę plików modułu;
   - zależności od wspólnych plików;
   - faktyczne źródło danych;
   - strukturę danych;
   - parsery;
   - eksport/import;
   - integrację Firebase;
   - fallbacki;
   - zasady formatowania tekstu;
   - mechanikę filtrów, sortowania, zakładek i modali.
8. `ZasadyFormatowania.md` popraw tylko wtedy, gdy opisuje nieaktualne markery, kolory, wyjątki formatowania albo zasady renderowania danych.

## 5. GeneratorNPC

Sprawdź i popraw:

- `GeneratorNPC/docs/README.md`
- `GeneratorNPC/docs/Documentation.md`
- `GeneratorNPC/config/FirebaseREADME.md`

Porównaj z aktualnym kodem:

- `GeneratorNPC/index.html`
- `shared/firebase-data-loader.js`
- `shared/FirebaseREADME.md`

Wykryty problem:

- dokumentacja może nadal opisywać `../DataVault/data.json` albo `DATA_URL = "../DataVault/data.json"` jako aktualne główne źródło danych;
- dokumentacja miesza opis publicznego JSON, prywatnych danych Firebase i zapisu ulubionych;
- trzeba oddzielić dane główne NPC od ulubionych/zapisów użytkownika.

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
6. W `README.md` opisz użytkownikowi:
   - jak uruchomić moduł;
   - jak wygenerować NPC;
   - jakie opcje można wybrać;
   - jak działają filtry;
   - jak działają ulubione albo zapisy, jeśli są dostępne;
   - co zrobić, jeśli dane nie załadują się poprawnie.
7. W `Documentation.md` opisz technicznie:
   - źródło danych głównych;
   - strukturę danych;
   - integrację Firebase;
   - mechanizm ulubionych/zapisów;
   - fallbacki;
   - zależności od wspólnych plików;
   - funkcje generujące wynik;
   - renderowanie karty NPC.
8. Jeżeli przełącznik języka jest ukryty w aktualnym kodzie, nie opisuj go jako elementu dostępnego dla użytkownika.

## 6. Kalkulator

Sprawdź i popraw:

- `Kalkulator/docs/README.md`
- `Kalkulator/docs/Documentation.md`
- `Kalkulator/config/FirebaseREADME.md`

Porównaj z aktualnym kodem:

- `Kalkulator/index.html`
- `Kalkulator/TworzeniePostaci.html`
- pliki w `Kalkulator/config/`

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
3. W `README.md` opisz użytkownikowi:
   - jak wejść do kalkulatora;
   - jak używać kreatora postaci;
   - jak działają pola XP/PD;
   - jak działają atrybuty;
   - jak działają umiejętności;
   - jak działają talenty;
   - jak działa zapis;
   - jak działa wczytywanie;
   - co się stanie, gdy Firebase nie jest skonfigurowany albo zapis się nie uda;
   - jak otworzyć instrukcję PDF, jeśli moduł ją udostępnia.
4. W `Documentation.md` opisz technicznie:
   - strukturę plików;
   - kalkulacje XP/PD;
   - walidacje;
   - modale potwierdzeń;
   - integrację Firestore;
   - konfigurację Firebase;
   - zapis i odczyt stanu postaci;
   - fallbacki i obsługę błędów.
5. Usuń sekcje changelogowe.
6. Nie pisz „dodano przycisk”, „zmieniono XP na PD” ani podobnych historii. Opisz aktualny interfejs.

## 7. Infoczytnik

Sprawdź i popraw:

- `Infoczytnik/docs/README.md`
- `Infoczytnik/docs/Documentation.md`
- `Infoczytnik/config/FirebaseREADME.md`

Porównaj z aktualnym kodem:

- `Infoczytnik/GM_test.html`
- `Infoczytnik/Infoczytnik_test.html`

Nie edytuj:

- `Infoczytnik/GM.html`
- `Infoczytnik/Infoczytnik.html`
- `Infoczytnik/GM_backup.html`
- `Infoczytnik/Infoczytnik_backup.html`

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
5. W `README.md` opisz użytkownikowi:
   - do czego służy Infoczytnik;
   - czym różni się panel GM od ekranu gracza;
   - jak wysłać wiadomość;
   - jak wybrać frakcję/layout;
   - jak działają dźwięki;
   - jak działa uzbrajanie audio po stronie odbiornika;
   - jak działa tryb debug;
   - co zrobić, jeśli wiadomość albo dźwięk się nie pojawia.
6. W `Documentation.md` opisz technicznie:
   - strukturę plików testowych;
   - aktualne ograniczenia edycji plików produkcyjnych i backupów bez ich modyfikowania;
   - `INF_VERSION`;
   - strukturę danych w Firestore;
   - funkcje wysyłania i odbioru wiadomości;
   - obsługę audio;
   - obsługę layoutów;
   - debug overlay;
   - fallbacki;
   - testy regresyjne.
7. Nie zmieniaj plików produkcyjnych ani backupów.

## 8. Audio

Sprawdź i popraw:

- `Audio/docs/README.md`
- `Audio/docs/Documentation.md`
- `Audio/config/FirebaseREADME.md`
- `Audio/Disclaimer.md`

Porównaj z aktualnym kodem:

- `Audio/index.html`
- pliki w `Audio/config/`
- katalogi z plikami audio, jeżeli są używane przez moduł

Wykryty problem:

- część README może opisywać przełącznik języka jako dostępny w prawym górnym rogu, mimo że w kodzie przełącznik może być ukryty;
- trzeba sprawdzić aktualny sposób wyboru języka, tryb admina i integrację Firebase;
- trzeba upewnić się, że dokumentacja nie opisuje starych lub niedostępnych funkcji.

Zadanie:

1. Sprawdź, czy przełącznik języka jest widoczny dla użytkownika.
2. Jeżeli jest ukryty, usuń z README instrukcje każące użytkownikowi go używać.
3. Sprawdź, jak działa tryb zwykły i tryb administratora.
4. Sprawdź, czy Audio używa Firebase, Firestore, Realtime Database albo plików konfiguracyjnych.
5. W `README.md` opisz użytkownikowi:
   - do czego służy moduł Audio;
   - jak uruchomić dźwięki;
   - czym różni się widok zwykły od admina;
   - jak dodawać albo wybierać dźwięki, jeśli interfejs to wspiera;
   - jak działają kategorie;
   - jak działają komunikaty błędów;
   - co zrobić, jeśli przeglądarka blokuje odtwarzanie.
6. W `Documentation.md` opisz technicznie:
   - strukturę plików;
   - logikę odtwarzania;
   - źródła plików audio;
   - integrację Firebase, jeśli występuje;
   - konfigurację;
   - obsługę trybu admin;
   - fallbacki i błędy.
7. `Audio/Disclaimer.md` popraw tylko wtedy, gdy zawiera nieaktualne lub niejasne informacje względem aktualnego działania modułu.

## 9. GeneratorNazw

Sprawdź i popraw:

- `GeneratorNazw/docs/README.md`
- `GeneratorNazw/docs/Documentation.md`
- `GeneratorNazw/docs/Logika.md`, jeżeli istnieje i jest aktualną dokumentacją modułu

Porównaj z aktualnym kodem:

- `GeneratorNazw/index.html`

Wykryty problem:

- README może opisywać przełącznik języka jako dostępny dla użytkownika, mimo że w kodzie przełącznik może być ukryty klasą `language-switcher--hidden`.

Zadanie:

1. Sprawdź aktualny interfejs.
2. Jeżeli przełącznik języka jest ukryty, usuń z README instrukcję używania go.
3. W `README.md` opisz użytkownikowi:
   - do czego służy generator;
   - jak wybrać płeć/typ/imiona/nazwiska, jeśli takie opcje istnieją;
   - jak wygenerować wynik;
   - jak czytać listę wyników;
   - co zrobić, jeśli wynik się nie pojawia.
4. W `Documentation.md` opisz technicznie:
   - strukturę pliku;
   - dane wejściowe;
   - listy nazw;
   - funkcje losujące;
   - renderowanie wyników;
   - obsługę języka, jeśli istnieje;
   - style i layout.
5. `Logika.md` nie może być sprzeczny z aktualnym kodem. Jeżeli zawiera stare założenia, popraw go albo wyraźnie ogranicz do aktualnej logiki.

## 10. DiceRoller

Sprawdź i popraw:

- `DiceRoller/docs/README.md`
- `DiceRoller/docs/Documentation.md`

Porównaj z aktualnym kodem:

- `DiceRoller/index.html`
- `DiceRoller/script.js`
- `DiceRoller/style.css`, jeśli istnieje

Zadanie:

1. Sprawdź aktualną funkcjonalność rzutu kośćmi.
2. W `README.md` opisz użytkownikowi:
   - jak wykonać rzut;
   - jakie kości albo pule są obsługiwane;
   - jak czytać wynik;
   - czy są modyfikatory;
   - czy są automatyczne sukcesy/porażki/ikony;
   - co zrobić przy błędnym wejściu.
3. W `Documentation.md` opisz technicznie:
   - strukturę plików;
   - parser wejścia;
   - funkcje losujące;
   - strukturę wyniku;
   - renderowanie historii;
   - obsługę błędów;
   - style i layout.
4. Usuń historię zmian, jeśli występuje.
5. Nie opisuj funkcji, których nie ma w aktualnym kodzie.

## 11. Shared Firebase

Sprawdź i popraw:

- `shared/FirebaseREADME.md`

Porównaj z aktualnym kodem:

- `shared/firebase-data-loader.js`
- `shared/firebase-config.js`, jeśli istnieje
- moduły korzystające ze wspólnego loadera

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

## 12. Pliki FirebaseREADME w modułach

Sprawdź i popraw:

- `Kalkulator/config/FirebaseREADME.md`
- `GeneratorNPC/config/FirebaseREADME.md`
- `Infoczytnik/config/FirebaseREADME.md`
- `Audio/config/FirebaseREADME.md`

Zadanie:

1. Porównaj każdy plik z aktualnym kodem danego modułu.
2. Ustal, czy moduł korzysta z:
   - Firestore;
   - Firebase Realtime Database;
   - Authentication;
   - plików lokalnych;
   - fallbacków.
3. Popraw nazewnictwo usług Firebase.
4. Nie mieszaj Firestore i Realtime Database.
5. Opisz konfigurację potrzebną użytkownikowi albo administratorowi.
6. Usuń informacje o nieistniejących plikach, kolekcjach, ścieżkach albo funkcjach.
7. Nie dodawaj historii zmian.

## 13. Pozostałe pliki dokumentacyjne wykryte w repozytorium

Poza plikami wymienionymi wyżej wyszukaj dokumentację po wzorcach:

- `docs/README.md`
- `docs/Documentation.md`
- `FirebaseREADME.md`
- `README.md`
- `Disclaimer.md`

Popraw tylko te pliki, które są rzeczywiście dokumentacją użytkową, techniczną lub konfiguracyjną.

Nie poprawiaj plików z listy ignorowanych.

Nie poprawiaj plików danych ani treści fabularnych, które tylko mają rozszerzenie `.md`.

## 14. Kontrola jakości po poprawkach

Po edycji wykonaj kontrolę:

1. Wyszukaj w dokumentacji wystąpienia:
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

2. Dla każdego wystąpienia oceń, czy jest aktualne i potrzebne.

3. Usuń albo przeredaguj nieaktualne fragmenty.

4. Sprawdź, czy README użytkowe mają pełną sekcję PL i pełną sekcję EN.

5. Sprawdź, czy dokumenty techniczne nie są tylko listą zmian.

6. Sprawdź, czy dokumentacja nie opisuje funkcji ukrytych albo niedostępnych w interfejsie.

7. Sprawdź, czy dokumentacja nie myli Firestore z Firebase Realtime Database.

8. Sprawdź, czy nie zmieniono plików z listy ignorowanych.

## 15. Oczekiwany rezultat

Po zakończeniu dokumentacja ma być spójna z aktualnym kodem.

Użytkownik czytający README powinien wiedzieć, jak korzystać z modułu.

Programista czytający Documentation powinien wiedzieć, jak moduł działa technicznie i jak go odtworzyć.

Dokumentacja nie powinna zawierać historii zmian, nieaktualnych źródeł danych, nieistniejących funkcji ani instrukcji używania ukrytych elementów interfejsu.

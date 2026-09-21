1. poprawić tooltipy w DataVault (miejsce wyświetlania)
2. Poprawić brak polskich liter w "Repozytorium"
3. Sprawdzić efekt Flicker w Infoczytniku
4. Sprawdzić poprawność pliku AGENTS.md - zwłaszcza punkt 14 (czy lokalizacje są nadal aktualne?)
5. Przeprowadzić audyt stanu kodu repo zawierających demo aplikacji:
   a. rpg-dataslate-relay = to jest moduł DataSlate. Zawiera również wersję Offline do szykowania screenów zamiast aplikacji do wyświetlania na urządzeniu graczy.
   b. WnG_offline_calculator = uproszczony moduł Kalkulator bez połączenia z Firebase.
   c. WnG_Tools = komplet modułów z połączeniem z Firebase (na testowym koncie). Demo aplikacji. Jak ktoś chce używać przy swoim stole to może skopiować kod i podpiąć własny Firebase. Moduły są domyślnie po angielsku z opcją zmiany języka (przełącznik, który w repo WrathAndGlory istnieje w kodzie, ale jest domyślnie ukryty i ustawiony na polski).
6. Po wprowadzeniu zmian opisanych w Analizy/audyt-kodu-aplikacji-2026-09-10.md i Analizy/responsywnosc-aplikacji-2026-09-10.html wprowadzić zmiany w repo dotyczących demo aplikacji:
   a. WnG_offline_calculator - tylko responsywność
   b. rpg-dataslate-relay - responsywność i listy ulubionych
   c. WnG_Tools - responsywność i poprawa kodu. W przypadku kalkulatora nie robimy wersji zaawansowanej.
7. Sprawdzić jeszcze raz czy repo z demo aplikacji zawierają najnowszą i najbardziej aktualną wersję modułów (z zastrzeżeniem wyjątków z punktów poniżej).
8. Przyciski "Gilead" i "Galaktyka" w module Main zostają tylko w repo WrathAndGlory. W repo z demo aplikacji nie dodajemy tych przycisków.
9. W demo aplikacji moduł Audio opiera się na jawnym pliku XLSX Audio/AudioManifest.xlsx - tę zasadę dla demo zostawiamy. W demie nie ma prywatnych danych i nie ma potrzeby robienia bramki z hasłem.
10. W demo aplikacji istnieje przykładowe pliki w DataVault/SampleFiles - pliki te nie zawierają chronionych danych. To tylko template do późniejszego uzupełnienia.
11. [WYKONANE w repo WrathAndGlory — pozostaje część dotycząca repo z demo] W repo WrathAndGlory we wszystkich modułach ukryć przełącznik zmiany języka. W repo dotyczących demo aplikacji (pkt6) przełącznik wersji językowej ma być widoczny i domyślnie angielski.
12. W repo dotyczących demo aplikacji dopisać do dokumentacji, że reguły dotyczące RULES są ustawione bez żadnych zabezpieczeń w ramach demonstracji. Jak ktoś chce skopiować kod to jest zalecane wprowadzenie jakiejś formy zabezpieczenia, np App Check lub jakieś bardziej rozbudowane np. login i hasło.

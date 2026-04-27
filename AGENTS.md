Repozytorium "WrathAndGlory" jest zbiorem modułów (aplikacji).
Każdy moduł jest w osobnym folderze.
Moduł "Main" zawiera stronę główną służącą do uruchamiania kolejnych modułów.
Niektóre moduły korzystają z tych samych plików (np. DataVault i GeneratorNPC korzystają z tego samego data.json z tej samej lokalizacji).
Ilość modułów może się zmieniać.

1. Po każdej zmianie kodu któregokolwiek z modułów zmodyfikuj pliki docs/Documentation.md oraz docs/README.md w odpowiednim folderze
2. Pliki README.md mają zawierać szczegółową informację dla użytkownika. Co i gdzie klikać, co powinno się stać, jak działa każdy z modułów. Instrukcja powinna być napisana w języku polskim i angielskim. Instrukcja nie powinna zawierać technicznego języka tylko użytkowe informacje dla użytkownika, który się nie zna na programowaniu. Ma to być dokładna instrukcja po przeczytaniu której dowolna osoba będzie w stanie w pełni korzystać z danego modułu.
3. Pliki Documentation.md mają zawierać szczegółową instrukcję techniczną. Mają tu być zawarte wszystkie informacje o stylach, funkcjach, sposobach obliczeń, integracji z Firebase, strukturę plików Firebase, skrypt node.js do utworzenia stosownej struktury itd. Ma to być pełna informacja techniczna służąca do odtworzenia aplikacji 1:1 w przypadku utraty plików. Język może być techniczny. Celem dokumentu jest to, że dowolny programista mając do dyspozycji tylko plik Documentation.md będzie w stanie odtworzyć cały moduł.
4. Pliki README.md i Documentation.md mają zawierać aktualne dane, bez zapisów historycznych. Te pliki nie mają mieć za zadanie byciem changelog.
5. Jeżeli zmiana dotyczy fontu, kolorów itp. to należy też zaktualizować plik DetaleLayout.md w głównym folderze
6. Jeżeli polecenie użytkownika nie dotyczy zmiany kodu a tylko analizy to wnioski zapisz w folderze Analizy w nowoutworzonym pliku o odekwatnej nazwie do przeprowadzanej analizy
7. Jeżeli zapisujesz plik z wynikami analizy to w pliku uwzględnij prompt użytkownika, żeby zachować kontekst zapisanych odpowiedzi
8. Folderu Analizy nie uwzględniaj w żadnych dokumentacjach i instrukcjach
9. Jeżeli polecenie użytkownika dotyczy zmiany w kodzie w oparciu o plik z analizą to po realizacji zadania należy zaktualizować plik z analizą o o sekcję ze wszystkimi zmianami w kodzie w każdym z plików w formacie cytując dokładne linie kodu przed i po zmianie np: Plik Second/app.js Linia 24 Było: return false; Jest: return true;

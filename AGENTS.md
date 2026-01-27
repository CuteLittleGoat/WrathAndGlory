Repozytorium "WrathAndGlory" jest zbiorem modułów (aplikacji).
Każdy moduł jest w osobnym folderze.
Moduł "Main" zawiera stronę główną służącą do uruchamiania kolejnych modułów.
Niektóre moduły korzystają z tych samych plików (np. DataVault i GeneratorNPC korzystają z tego samego data.json z tej samej lokalizacji).
Ilość modułów może się zmieniać.

1. Po każdej zmianie kodu któregokolwiek z modułów zmodyfikuj pliki docs/Documentation.md oraz docs/README.md w odpowiednim folderze
2. Plik README.md ma zawierać instrukcję obsługi dla użytkownika
3. Plik README.md ma zawierać te same instrukcję w języku polskim i angielskim
4. Plik Documentation.md ma zawierać dokładny opis kodu. Wszystkich funkcji, użytych styli, fontów, zasad działania poszczególnych elementów itp.
5. Plik Documentation.md ma służyć do tego, żeby inny użytkownik tylko czytając dokumentację mógł odtworzyć aplikację 1:1
6. Jeżeli zmiana dotyczy fontu, kolorów itp. to należy też zaktualizować plik DetaleLayout.md w głównym folderze
7. Po każdej zmianie kodu należy w głównej ścieżce utworzyć plik "Test_Checklist.md"
8. Plik Test_Checklist.md ma zawierać informacje dla użytkownika co należy sprawdzić, żeby zatwierdzić ostatnio wprowadzoną zmianę. Jeżeli zmiana kodu mogła wpłynąć na jakąś funkcjonalność (nawet pośrednio) to należy w tej instrukcji zapisać, że użytkownik ma to sprawdzić
9. Przy okazji każdej zmiany cała zawartość pliku Test_Checklist.md ma być kasowana i pisana od nowa uwzględniając tylko najnowszą zmianę kodu któregkolwiek z modułów
10. Jeżeli zmiana nie dotyczy funkcjonalności a tylko analizy to nic nie należy zmianiać w pliku Test_Checklist.md

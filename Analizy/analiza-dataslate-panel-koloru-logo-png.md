# Data analizy
2026-05-28

# Temat analizy
Rozbudowa modułu DataSlate (Infoczytnik): możliwość sterowania kolorem logo PNG w panelu GM przy zasobach tymczasowo umieszczonych w `Infoczytnik/Draft/Loga` oraz docelowo w `Infoczytnik/assets/logos` i `DataSlate_manifest.xlsx`.

# Oryginalny pełny prompt użytkownika
Przeprowadź analizę rozbudowy modułu DataSlate.
W Infoczytnik/Draft/Loga są pliki png, które docelowo będą nowymi logo do wyboru.
Docelowo będą wgrane do Infoczytnik/assets/logos i będą opisane w pliku DataSlate_manifest.xlsx

Tymczasowo, na potrzeby analizy są w Infoczytnik/Draft/Log

Chciałbym, żeby przy wyborze logo w panelu GM był też panel do obsługi koloru logo - taki sam jak przy fontach. Czy da się tak zrobić dla plików png obecnie zapisanych w lokalizacji Infoczytnik/Draft/Loga ?

# Zakres analizy
1. Sprawdzenie, jak obecnie ładowane są loga i kolory w panelu GM (`GM_test.html`) i w ekranie odbiorcy (`Infoczytnik_test.html`).
2. Ocena, czy da się dodać „panel koloru logo” dla PNG i jakie są konsekwencje techniczne.
3. Ocena, czy tymczasowa lokalizacja `Infoczytnik/Draft/Loga` nadaje się do testowego użycia bez migracji do `assets/logos`.
4. Przygotowanie wariantów wdrożenia oraz ryzyk jakościowych.

# Wnioski
## 1) Krótka odpowiedź
Tak — **da się** dodać panel koloru logo dla plików PNG już teraz (w tym dla plików z `Infoczytnik/Draft/Loga`), ale sposób realizacji zależy od typu grafik:
- jeśli PNG są monochromatyczne (najlepiej białe/czarne z przezroczystością), kolorowanie będzie proste i przewidywalne;
- jeśli PNG są wielokolorowe/cieniowane, „podmiana koloru” nie będzie 1:1 jak w przypadku fontu i trzeba zastosować filtrację (gorsza kontrola) albo przygotować oddzielne wersje logo.

## 2) Stan obecny modułu
- Wybór logo jest oparty o manifest (`logos[].file`) i przypisanie ścieżki do `img.src`.
- Ekran odbiorcy również renderuje logo przez `<img>` + `src`.
- Kolory istnieją obecnie tylko dla tekstu wiadomości i prefix/suffix (pole tekstowe + color picker + chipy).

To oznacza, że architektura już ma gotowy wzorzec UX dla „panelu koloru”, ale logo jest aktualnie traktowane jako obraz bez warstwy kolorystycznej.

## 3) Czy lokalizacja `Infoczytnik/Draft/Loga` zadziała teraz?
Tak, jeśli ścieżki w manifeście wskazują bezpośrednio na ten folder (np. `Draft/Loga/Aquila.png`) i pliki są serwowane statycznie przez ten sam host.

Do analizy wystarczy to rozwiązanie tymczasowe. Na produkcję i porządek repo i tak lepiej docelowo przejść na `assets/logos` i spójne wpisy w `DataSlate_manifest.xlsx`.

## 4) Realne opcje kolorowania PNG
### Opcja A — CSS `filter` na `<img>`
- Plusy: szybkie wdrożenie, brak canvas.
- Minusy: trudne dokładne odwzorowanie koloru HEX; wyniki zależne od bazowego koloru logo.

### Opcja B — Canvas z „tintowaniem” alpha-maski (rekomendowana)
- Mechanika: wczytać PNG, narysować na canvas, nałożyć wybrany kolor tylko na obszary nieprzezroczyste, wynik wysłać jako DataURL.
- Plusy: przewidywalny kolor (blisko „tak samo jak font”), pełna kontrola.
- Minusy: trochę więcej kodu i obsługa cache wyników dla wydajności.

### Opcja C — Przygotowanie wielu wersji logo (na kolor) bez runtime tint
- Plusy: zero logiki kolorowania w JS.
- Minusy: dużo plików i gorsza skalowalność.

## 5) Co znaczy „taki sam panel jak przy fontach”
UX-owo można zrobić praktycznie 1:1:
- pole HEX + color picker + chipy presetów;
- zapis do payloadu (np. `logoColor`);
- podgląd live w panelu GM;
- zastosowanie tego samego koloru po stronie odbiorcy.

Jedyna różnica: tekst używa natywnego CSS `color`, a logo PNG wymaga dodatkowej warstwy transformacji (filter/canvas).

# Rekomendacje
1. **Wdrożyć opcję B (canvas tint) jako domyślną** dla logo w DataSlate.
2. Dodać do manifestu opcjonalne pole, np.:
   - `tintable: true/false` albo
   - `logoMode: mono|fullcolor`.
3. Kolorowanie uruchamiać tylko dla `tintable=true`; dla `fullcolor` wyświetlać oryginał.
4. Na etapie przejściowym dopuścić wpisy `Draft/Loga/*.png` w manifeście testowym.
5. Przy migracji do `assets/logos` nie zmieniać kontraktu payloadu (`logoFile`, `logoColor`), aby uniknąć regresji.

# Ewentualne ryzyka
1. **Niejednolity efekt kolorowania** dla wielokolorowych PNG (szczególnie przy filtrach CSS).
2. **Wydajność** przy częstych zmianach koloru/logo bez cache renderu (canvas).
3. **CORS/tainted canvas** jeśli kiedyś logo będą ładowane z obcej domeny bez poprawnych nagłówków.
4. **Czytelność na tle** — niektóre kolory logo mogą zlewać się z tłem, więc warto dodać minimalny kontrast lub obrys.

# Ewentualne następne kroki
1. Przygotować krótką listę logo „tintowalnych” (mono) i „nietintowalnych” (fullcolor).
2. Wykonać implementację testową tylko w:
   - `Infoczytnik/GM_test.html`
   - `Infoczytnik/Infoczytnik_test.html`
3. Dodać `logoColor` do payloadu i snapshotu danych.
4. Zweryfikować poprawność na aktualnych plikach z `Infoczytnik/Draft/Loga`.
5. Po akceptacji: przepiąć ścieżki na `assets/logos` + uzupełnić `DataSlate_manifest.xlsx`.

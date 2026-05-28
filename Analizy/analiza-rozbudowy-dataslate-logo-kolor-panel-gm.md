# Data analizy
2026-05-28

# Temat analizy
Rozbudowa modułu DataSlate/Infoczytnik o panel koloru logo w GM oraz ocena możliwości kolorowania PNG z lokalizacji `Infoczytnik/Draft/Loga`.

# Oryginalny pełny prompt użytkownika
Przeprowadź analizę rozbudowy modułu DataSlate.
W Infoczytnik/Draft/Loga są pliki png, które docelowo będą nowymi logo do wyboru.
Docelowo będą wgrane do Infoczytnik/assets/logos i będą opisane w pliku DataSlate_manifest.xlsx

Tymczasowo, na potrzeby analizy są w Infoczytnik/Draft/Loga

Chciałbym, żeby przy wyborze logo w panelu GM był też panel do obsługi koloru logo - taki sam jak przy fontach. Czy da się tak zrobić dla plików png obecnie zapisanych w lokalizacji Infoczytnik/Draft/Loga ?

Sprawdź pliki w Infoczytnik/Draft/Loga i zaproponuj rozwiązanie. Docelowo interesuje mnie, żeby loga były w jednym kolorze - bez gradientu itp.

# Zakres analizy
1. Sprawdzenie aktualnych plików logo w `Infoczytnik/Draft/Loga`.
2. Sprawdzenie, jak obecnie GM i ekran odbiorcy renderują logo (`GM_test.html`, `Infoczytnik_test.html`).
3. Ocena, czy da się dodać panel koloru logo analogiczny do panelu koloru fontów.
4. Ocena zgodności obecnych plików PNG z celem „jeden kolor, bez gradientu”.

# Stan obecny (technicznie)
- W `GM_test.html` istnieje wybór logo (`#logoSelect`) oraz system wyboru kolorów dla treści/prefixu przez `input[type=color]`, pole tekstowe HEX i gotowe „chipy” kolorów.
- W podglądzie GM logo jest renderowane jako `<img id="previewLogo">` przez ustawienie `src` na plik logo.
- W `Infoczytnik_test.html` logo odbiorcy też jest renderowane jako `<img id="logo">` z `src = d.logoFile`.
- Obecny pipeline logo jest oparty o klasyczne wyświetlenie PNG jako obrazka, bez runtime kolorowania.

# Wyniki sprawdzenia plików PNG w `Infoczytnik/Draft/Loga`
Wszystkie pliki są PNG RGBA 8-bit, non-interlaced. Rozdzielczości:
- 800x800: `Apothecary`, `Aquila`, `Astra_Militarum`, `Chaos`, `Khorne`, `Mechanicus`, `Nurgle`, `Slaanesh`, `Sororitas`, `Tzeentch`
- 435x435: `Administratum`, `Inquisition`, `Medicae`, `Navigator`

Analiza zawartości kolorów (unikalne RGB w pikselach nieprzezroczystych):
- 1 kolor RGB (najłatwiejsze do „tint”): `Apothecary`, `Aquila`, `Astra_Militarum`, `Mechanicus`, `Slaanesh`
- 2–6 kolorów RGB (nadal realne do unifikacji): `Nurgle` (2), `Khorne` (6)
- wielokolorowe (dużo odcieni/szczegółów): `Administratum` (224), `Chaos` (184), `Inquisition` (29), `Medicae` (22), `Navigator` (291), `Sororitas` (68), `Tzeentch` (122)

Wniosek: część plików już praktycznie jest „maską” (jeden kolor + antyaliasing przez alpha), ale część ma wielokolorowe wnętrze i po prostym kolorowaniu może utracić czytelność detalu lub dać niejednolity efekt.

# Czy da się dodać panel koloru logo „jak przy fontach”?
Tak, da się.

## Najbezpieczniejsza architektura (rekomendowana)
Zamiast wyświetlać logo jako czyste `<img>`, użyć PNG jako maski alfa:
- element logo dostaje `background-color: var(--logoColor)`
- `mask-image: url(...)` oraz `-webkit-mask-image: url(...)`
- `mask-size: contain`, `mask-repeat: no-repeat`, `mask-position: center`

Efekt:
- kolor finalny kontroluje pojedyncza wartość HEX z panelu GM,
- brak gradientu z definicji (jednolity fill),
- antyaliasing krawędzi zostaje dzięki kanałowi alpha,
- rozwiązanie działa niezależnie od tego, czy źródłowy PNG jest biały, czarny czy wielokolorowy (liczy się maska/przezroczystość).

## Dlaczego nie sam `filter` CSS na `<img>`
- `filter`/`hue-rotate` nie daje stabilnego i precyzyjnego „jeden kolor HEX” dla wszystkich wejściowych kolorów,
- trudniej uzyskać powtarzalny efekt między różnymi logami,
- to podejście bardziej „kreatywne” niż kontrolowane produkcyjnie.

# Propozycja zmian funkcjonalnych
1. Dodać do panelu GM sekcję „Kolor logo” analogiczną do fontów:
   - pole tekstowe HEX,
   - color picker,
   - opcjonalne presety (chipy).
2. Rozszerzyć payload wiadomości o `logoColor` (np. domyślnie `#ffffff`).
3. W podglądzie GM i ekranie odbiorcy renderować logo jako element maskowany PNG.
4. Utrzymać fallback:
   - jeśli mask nie jest wspierany, pokazać klasyczne `<img>` bez kolorowania albo z prostym trybem awaryjnym.
5. W `DataSlate_manifest.xlsx` dodać kolumnę kontrolną, np. `logoTintMode`:
   - `mask-mono` (docelowy tryb jednokolorowy),
   - `raw` (awaryjnie: klasyczny obraz).

# Ocena względem celu „jednokolorowe logo, bez gradientu”
- Cel jest osiągalny już teraz dla plików z `Infoczytnik/Draft/Loga`.
- Warunek jakościowy: najlepiej, by docelowe pliki logo miały czyste kształty i sensowny alpha edge.
- Dla wielokolorowych plików końcowy efekt i tak będzie jednokolorowy (bo maska), ale drobny detal zależny od jasności RGB może zniknąć — jeśli detal ma być zachowany, trzeba przygotować wersje stricte „maskowe” (wysoki kontrast sylwetki + transparentne tło).

# Ryzyka
1. **Czytelność detalu**: przy wymuszeniu jednego koloru drobne elementy z wielobarwnych logotypów mogą stać się mniej widoczne.
2. **Spójność assetów**: mieszane źródła (część logo „mask-ready”, część nie) dadzą nierówny efekt wizualny.
3. **Kompatybilność**: CSS mask działa szeroko, ale warto mieć fallback dla nietypowych środowisk webview.

# Rekomendacje
1. Przyjąć tryb „logo jako maska + jednolity `logoColor`” jako standard DataSlate.
2. Przed migracją do `Infoczytnik/assets/logos` przygotować/zweryfikować wszystkie PNG jako „mask-friendly”.
3. Wprowadzić walidację przy imporcie z `DataSlate_manifest.xlsx`:
   - ostrzeżenie, gdy plik ma podejrzanie dużo unikalnych kolorów i może nie być idealny do maskowania.
4. Zachować domyślny kolor logo (np. biały) oraz gotowe presety zgodne z presetami kolorów fontów.

# Ewentualne następne kroki
1. Przygotować techniczny plan wdrożenia (konkretne sekcje zmian w `GM_test.html` i `Infoczytnik_test.html`).
2. Dodać panel „Kolor logo” i pole `logoColor` do payloadu testowego.
3. Przepiąć renderer logo na CSS mask i przetestować wszystkie PNG z `Infoczytnik/Draft/Loga`.
4. Po akceptacji efektu przenieść assety do `Infoczytnik/assets/logos` i uzupełnić `DataSlate_manifest.xlsx`.

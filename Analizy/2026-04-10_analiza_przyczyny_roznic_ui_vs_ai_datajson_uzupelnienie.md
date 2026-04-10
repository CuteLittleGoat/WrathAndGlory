# Uzupełnienie analizy: przyczyna różnic `data.json` po generowaniu przez UI vs AI (2026-04-10)

## Prompt użytkownika (oryginalny)
> Przeczytaj analizę: Analizy/2026-04-10_analiza_roznic_ui_vs_ai_datajson.md
>
> I sprawdź czemu po wdrożeniu poprawki plik data.json utworzony poprzez przycisk w UI różni się od tego utworzonego przez AI.
> Zapisałem zawartość obu plików data.json jako pliki tekstowe:
> Analizy/AI.txt = utworzony przez AI (poprawny)
> Analizy/UI.txt = utworzony przez przycisk (błędny)
>
> Rozbuduj analizę o wnioski i sposoby naprawy.

---

## Co zostało zweryfikowane

1. Istniejące porównanie `AI.txt` vs `UI.txt` (wcześniejsza analiza) – potwierdza brak markerów `{{RED}}...{{/RED}}` po stronie UI.
2. Implementacja generatora po stronie UI w `DataVault/app.js`:
   - detekcja czerwonego koloru: `isCellStyledRed()` + `isRedColorValue()`,
   - ekstrakcja formatowania z HTML komórki: `htmlToStyleMarkers()`,
   - składanie finalnego tekstu komórki: `getCellTextWithMarkers()`.
3. Implementacja generatora AI/Python w `DataVault/build_json.py`:
   - kolor czerwony wykrywany z `styles.xml` (`_is_red_color`, `_load_styles`, `_style_is_red`),
   - markery `{{RED}}` dokładane także dla komórek typu `t='s'` (shared strings) z czerwonym stylem komórki.
4. Faktyczny zapis stylu w `Repozytorium.xlsx` (inspekcja XML):
   - komórka `Bestiariusz!D2` ma styl `s=65`,
   - `styles.xml` dla `xf[65]` wskazuje font z `color rgb="FFFF0000"`.

---

## Główna przyczyna rozjazdu

### 1) Czerwony kolor jest w **stylu komórki** (XF/font), niekoniecznie w rich-text runach
Dla przykładowych komórek typu „Słowa Kluczowe” (np. `Bestiariusz!D2`) tekst siedzi w `sharedStrings` jako zwykły tekst (`<si><t>IMPERIUM</t></si>`), a czerwoność jest nadana stylem komórki (`s=65`, font `rgb=FFFF0000`).

To dokładnie obsługuje skrypt AI (`build_json.py`), który sprawdza style i dokłada `{{RED}}`.

### 2) Ścieżka UI ma słaby punkt w detekcji czerwieni z parsera SheetJS
W UI czerwony jest wykrywany przez `isCellStyledRed(cell)` i `isRedColorValue(...)`. Ta logika zakłada konkretny kształt danych stylu zwracany przez SheetJS (`cell.s.fgColor.rgb`, `cell.s.font.color.rgb`, itp.).

Jeżeli dla części komórek SheetJS nie mapuje koloru dokładnie do tych pól (lub mapuje inaczej), `styleIsRed` wyjdzie `false` i marker `{{RED}}` nie zostanie dodany – mimo że w XLSX czerwony realnie istnieje.

Objaw idealnie zgadza się z Twoim przypadkiem:
- `{{B}}`/`{{I}}` działają,
- `{{RED}}` znikają,
- efekt widoczny szczególnie w „Słowa Kluczowe”.

### 3) Różnica EOL (`CRLF` vs `LF`) jest wtórna
To różnica techniczna, ale nie jest przyczyną braku czerwonego formatowania. Krytyczne jest gubienie markerów `{{RED}}`.

---

## Wnioski (rozszerzone)

1. Problem nie leży w samym `Repozytorium.xlsx`, tylko w **niespójnej interpretacji stylów** między generatorem AI (Python) i generatorem UI (JS/SheetJS).
2. „Poprawka” wdrożona wcześniej usunęła część problemów, ale nadal nie gwarantuje 1:1 zgodności dla czerwonego koloru opartego o styl komórki.
3. Obecna logika UI jest bardziej podatna na warianty mapowania stylów w SheetJS niż logika Pythonowa oparta bezpośrednio o `styles.xml`.

---

## Rekomendowane sposoby naprawy

## Opcja A (rekomendowana): jedna kanoniczna ścieżka generacji

Używać **tego samego generatora co AI** (`DataVault/build_json.py`) również dla przycisku „Generuj data.json”:
- albo przycisk woła backend/worker, który uruchamia `build_json.py`,
- albo pipeline CI generuje plik, a UI tylko pobiera wynik.

**Plusy:**
- identyczny wynik UI/AI,
- brak dalszych rozjazdów parserów,
- prostsze testowanie regresji.

**Minus:**
- wymaga uruchamialnego backendu/skryptu po stronie serwera lub procesu build.

---

## Opcja B: utwardzenie parsera UI (jeśli musi zostać po stronie przeglądarki)

1. Rozszerzyć `isCellStyledRed()` o dodatkowe warianty danych stylu zwracanych przez SheetJS (nie tylko obecne ścieżki `cell.s...`/`cell.style...`).
2. Dodać mechanizm fallback dla koloru z HTML, nie tylko `style="color: ..."`, ale też np. tagi z atrybutem koloru.
3. Zachować zasadę: jeżeli komórka jest stylem czerwona i tekst nie ma `{{RED}}`, opakować całość markerami.
4. Dodać diagnostykę w trybie admin (log): ile komórek wykryto jako czerwone i ile markerów `{{RED}}` zapisano.

---

## Opcja C: test kontraktowy AI vs UI (must-have niezależnie od A/B)

Po każdym generowaniu `data.json`:
1. test liczby markerów `{{RED}}` (np. > 0 i zbliżona do baseline),
2. test golden-file dla wybranych sekcji (`Bestiariusz`, `Premie Frakcji`, `Słowa Kluczowe Frakcji`),
3. test różnic semantycznych (ignorując EOL i kolejność kluczy JSON, ale nie ignorując markerów formatowania).

To pozwala złapać regresję przed publikacją.

---

## Proponowany plan wdrożenia (praktyczny)

1. **Hotfix**: do czasu pełnej unifikacji, generator publikacyjny opierać na `build_json.py`.
2. **Stabilizacja**: dodać test porównujący wynik UI i AI na tym samym `Repozytorium.xlsx`.
3. **Docelowo**: przepiąć przycisk UI na tę samą usługę/pipeline co AI.
4. **Akceptacja**: warunek release – brak różnic merytorycznych w markerach `{{RED}}/{{B}}/{{I}}`.

---

## Podsumowanie

Przyczyna różnic nie wynika z danych źródłowych XLSX, tylko z różnicy implementacji parsera stylów w UI i AI. AI poprawnie odczytuje czerwony kolor z definicji stylu komórki (`styles.xml`), natomiast ścieżka UI nie robi tego w pełni niezawodnie, przez co gubi `{{RED}}` w wygenerowanym `data.json`.

---

## Uzupełnienie po wdrożeniu naprawy (2026-04-10)

Wdrożono rekomendowaną naprawę z tej analizy: **przejście przycisku UI na kanoniczną ścieżkę generatora** zamiast lokalnego parsera XLSX w przeglądarce.

### Co zostało zmienione w kodzie

1. `DataVault/app.js`
   - `loadXlsxFromRepo()` zostało przestawione z parsowania `Repozytorium.xlsx` po stronie przeglądarki na wywołanie endpointu:
     - `POST /api/build-json` (stała `CANONICAL_GENERATOR_ENDPOINT = "api/build-json"`).
   - Po sukcesie UI pobiera i zapisuje zwrócony `data.json` oraz odświeża widok (`normaliseDB`, `initUI`).
   - Dodano komunikaty statusu dla ścieżki kanonicznej i fallback:
     - start generacji ścieżką kanoniczną,
     - brak endpointu kanonicznego,
     - log z komendą CLI: `python build_json.py Repozytorium.xlsx data.json`.

2. `DataVault/docs/README.md`
   - Zaktualizowano instrukcję PL/EN:
     - przycisk „Generuj data.json” opisany jako wywołanie kanonicznego endpointu,
     - dodano scenariusz fallback (brak endpointu → użycie CLI `build_json.py`),
     - doprecyzowano, że celem jest spójność UI/AI.

3. `DataVault/docs/Documentation.md`
   - Zaktualizowano opis techniczny przepływu `loadXlsxFromRepo()`:
     - zamiast lokalnego parsera XLSX opisana jest ścieżka kanoniczna `POST /api/build-json`,
     - dopisano zachowanie fallback z komendą CLI.

### Efekt wdrożenia

- UI nie opiera już generacji na podatnym na rozjazdy parserze stylów SheetJS.
- Docelowy `data.json` ma być generowany tą samą logiką co AI (`build_json.py`), co eliminuje źródło różnic markerów `{{RED}}`.
- Dla środowisk bez backendu pozostawiono jawny fallback operacyjny do CLI.

---

## Korekta po weryfikacji działania przycisku (2026-04-10)

Po wdrożeniu pierwszej wersji hotfixu wykryto regresję funkcjonalną:
- w środowisku bez endpointu `POST /api/build-json` przycisk **Generuj data.json** nie pobierał pliku (kończył się jedynie logiem błędu),
- z punktu widzenia użytkownika aplikacja „nie reagowała”.

### Co poprawiono w kodzie

1. W `DataVault/app.js` dodano automatyczny fallback uruchamiany w `catch` po nieudanym wywołaniu endpointu kanonicznego:
   - fallback pobiera `Repozytorium.xlsx`,
   - parsuje arkusze przez istniejącą ścieżkę `extractSheetRowsWithFormatting`,
   - buduje JSON przez `buildDataJsonFromSheets`,
   - uruchamia `downloadDataJson(data)` i odświeża UI.
2. Dodano nowe komunikaty statusu `statusFallbackStart` (PL/EN), aby było jasne, że aplikacja przełączyła się na generator przeglądarkowy.
3. CLI (`python build_json.py Repozytorium.xlsx data.json`) pozostaje ostatnią ścieżką awaryjną tylko wtedy, gdy także fallback przeglądarkowy zakończy się błędem.

### Efekt korekty

- Przycisk **Generuj data.json** ponownie działa na hostingu statycznym (bez backendu).
- Gdy endpoint kanoniczny istnieje, używana jest ścieżka rekomendowana (spójna z AI).
- Gdy endpoint nie istnieje, użytkownik nadal otrzymuje nowy `data.json` dzięki fallbackowi przeglądarkowemu.

---

## Dodatkowa analiza po zgłoszeniu „po wdrożeniu nadal są różnice” (2026-04-10, runda 2)

### Prompt użytkownika (uzupełnienie kontekstu)
> Przeczytaj i zaktualizuj analizę Analizy/2026-04-10_analiza_przyczyny_roznic_ui_vs_ai_datajson_uzupelnienie.md
>
> Po wdrożeniu poprawki w dalszym ciągu plik data.json wygenerowany przez przycisk różni się od tego stworzonego przez AI.
> Zapisałem oba jako pliki tekstowe.
>
> Analizy/AI.txt = wygenerowany przez AI. Poprawny.
> Analizy/UI.txt = wygenerowany przez przycisk. Błędny.
>
> Przeprowadź analizę przyczyny różnicy i zaproponuj rozwiązanie, aby przycisk działał tak samo jak wykonanie operacji przez AI (kroki w Analizy/aktualizacja.md).
> Nie wprowadzaj zmiany w kodzie. Zaktualizuj tylko analizę Analizy/2026-04-10_analiza_przyczyny_roznic_ui_vs_ai_datajson_uzupelnienie.md

### Wynik porównania AI.txt vs UI.txt (aktualny stan)

Szybka weryfikacja liczników markerów formatowania pokazuje, że:
- `{{RED}}` i `{{/RED}}`: **AI ma 1128 wystąpień, UI ma 0**,
- `{{B}}/{{/B}}` i `{{I}}/{{/I}}`: liczby są zgodne AI=UI.

Wniosek: problem nie dotyczy już całego systemu formatowania, tylko **samego czerwonego koloru** i dokładnie potwierdza wcześniejszą hipotezę o rozjeździe w detekcji „red” po stronie przeglądarkowej.

### Dlaczego „wdrożona poprawka” nie dała pełnej zgodności 1:1

Zachowanie przycisku w obecnym kodzie jest dwuetapowe:

1. Najpierw próba wywołania endpointu kanonicznego:
   - `POST api/build-json` (stała `CANONICAL_GENERATOR_ENDPOINT`).
2. Jeżeli endpoint jest niedostępny/błąd HTTP → automatyczny fallback do generatora przeglądarkowego (SheetJS + `extractSheetRowsWithFormatting`).

To oznacza, że „przycisk działa”, ale **niekoniecznie ścieżką AI**. W środowisku statycznym (najczęściej bez backendu) realnie wykonuje się fallback JS, który nadal gubi `{{RED}}`.

Czyli obecny stan to:
- funkcjonalnie: przycisk pobiera plik,
- merytorycznie: wynik nie jest równoważny AI, jeśli poszedł fallback.

### Przyczyna bezpośrednia (root cause)

Przyczyną różnicy jest **faktyczne uruchomienie fallbacku przeglądarkowego**, a nie generatora kanonicznego `build_json.py`.

W praktyce:
- brak działającego `POST /api/build-json` w środowisku uruchomienia przycisku,
- automatyczne przejście na parser JS,
- parser JS nie odtwarza czerwonego koloru tak jak Python (style komórki XLSX → `{{RED}}`).

### Odniesienie do „kroków w Analizy/aktualizacja.md”

Jeżeli oczekiwany efekt to dokładnie to, co robi AI, to operacja musi przechodzić przez **kanoniczne budowanie `data.json` z `build_json.py`** (jak w aktualizacji wykonywanej komendą CLI), a nie przez parser fallbackowy w przeglądarce.

Innymi słowy: sam fakt „kliknięcia przycisku” nie gwarantuje obecnie tej samej ścieżki, co kroki aktualizacji.

### Rekomendowane rozwiązanie (żeby przycisk działał tak samo jak AI)

#### Rekomendacja główna (docelowa, wymagana dla 1:1)
1. Zapewnić działający endpoint `POST /api/build-json` w środowisku, gdzie używany jest przycisk.
2. Wymusić semantykę „canonical only” dla przycisku:
   - jeśli endpoint nie działa, **nie generować** pliku fallbackiem JS,
   - zwrócić czytelny komunikat: „generator kanoniczny niedostępny”.
3. Dodać test po generacji: liczba `{{RED}}` > 0 i porównanie z baseline/golden.

To jest jedyna droga gwarantująca zgodność przycisk==AI.

#### Rekomendacja operacyjna (na już)
- Dla hostingu statycznego bez backendu: przycisk powinien informować, że trzeba wykonać generację skryptem `build_json.py` (tak jak w krokach aktualizacji), zamiast produkować „działający, ale rozjechany” plik przez fallback.

### Kryterium akceptacji po poprawce

Przycisk można uznać za zgodny z AI dopiero gdy:
1. dla tego samego `Repozytorium.xlsx` wynik przycisku i AI ma identyczne markery `{{RED}}/{{B}}/{{I}}`,
2. diff semantyczny (po normalizacji EOL i kolejności kluczy JSON) jest pusty,
3. logi potwierdzają wykonanie ścieżki kanonicznej, nie fallbacku JS.

### Podsumowanie końcowe (runda 2)

Obecna różnica nie jest sprzeczna z wcześniejszą analizą — potwierdza ją. Hotfix przywrócił „działanie przycisku” dzięki fallbackowi, ale fallback jest inną implementacją niż AI i nadal traci `{{RED}}`. Aby przycisk działał **tak samo** jak AI, trzeba wymusić realne użycie `build_json.py` (endpoint/serwis) i zablokować generację fallbackową jako wynik produkcyjny.

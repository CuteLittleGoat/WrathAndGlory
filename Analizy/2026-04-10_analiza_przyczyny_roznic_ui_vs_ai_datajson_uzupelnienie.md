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

---

## Dodatkowa analiza po zgłoszeniu „przycisk nie reaguje” (2026-04-10, runda 3)

### Prompt użytkownika (uzupełnienie kontekstu)
> Przeczytaj analizę Analizy/2026-04-10_analiza_przyczyny_roznic_ui_vs_ai_datajson_uzupelnienie.md
>
> Po wprowadzeniu ostatniej poprawki przycisk "Generuj data.json" nie reaguje. Sprawdź przyczynę oraz zaproponuj naprawę. Poprzednio został zrobiony fallback, ale utworzony w ten sposób plik nie jest zgodny z tym generowanym przez asystenta AI. Przeprowadź analizę czemu przycisk nie działa i co należy zrobić, żeby działał i żeby wygenerowany plik data.json był identyczny jak ten stworzony przez asystenta AI.
> Nie wprowadzaj zmian w kodzie tylko rozbuduj analizę.
>
> Nie twórz nowego pliku z analizą tylko dodaj te wnioski do Analizy/2026-04-10_analiza_przyczyny_roznic_ui_vs_ai_datajson_uzupelnienie.md
>
> Dodatkowo zapisz mi tam, czy jako użytkownik muszę gdzieś (w ustawieniach Github?) coś ustawić. Strona ma działać na github.

### Ustalenie stanu po „ostatniej poprawce”

Aktualna implementacja przycisku w `DataVault/app.js` działa obecnie w trybie **canonical-only**:
1. kliknięcie wywołuje `POST api/build-json`,
2. jeśli endpoint nie odpowie, kod wpada do `catch`, loguje komunikat błędu i podpowiada CLI,
3. nie ma już automatycznego fallbacku JS, który generował plik po stronie przeglądarki.

Wniosek: jeśli uruchamiasz DataVault jako czysty GitHub Pages (statyczny hosting), przycisk nie pobierze `data.json`, bo endpoint `POST /api/build-json` nie istnieje na samym GitHub Pages.

### Dlaczego użytkownik widzi „brak reakcji”

Komunikaty statusu i błędu są zapisywane głównie do konsoli (`console.info`/`console.error`), a nie do wyraźnego panelu statusu w UI.

Z perspektywy użytkownika końcowego wygląda to jak „nic się nie dzieje”, mimo że technicznie zapytanie kończy się błędem HTTP/404 lub błędem sieciowym.

### Co zrobić, żeby było jednocześnie:
1) „przycisk działa”,
2) wynik jest 1:1 jak AI.

#### Docelowo (rekomendowane)
- Zapewnić działający backend/worker z endpointem `POST /api/build-json` używającym dokładnie tej samej logiki co `build_json.py`.
- Zachować politykę **canonical-only** (bez fallbacku SheetJS dla produkcyjnej generacji).
- Dodać widoczny komunikat w UI (toast/banner/modal) o sukcesie/błędzie, zamiast tylko logów w konsoli.

To jedyny wariant dający jednocześnie klikalny workflow i pełną zgodność z AI.

#### Operacyjnie „na już” (bez backendu)
- Na samym GitHub Pages nie uzyskasz dynamicznego `POST /api/build-json` bez dodatkowej usługi.
- W takim środowisku generację produkcyjną trzeba wykonywać poza przeglądarką: `python build_json.py Repozytorium.xlsx data.json` i dopiero podmieniać plik w repo.

### Odpowiedź na pytanie: „czy muszę coś ustawić w GitHub?”

**Tak — ale to zależy od docelowego trybu działania:**

1. **Jeśli chcesz tylko hostować stronę statycznie** (bez generowania przyciskiem):
   - wystarczy standardowe włączenie GitHub Pages dla repozytorium (branch/folder z publikacją),
   - to nie uruchomi endpointu `POST /api/build-json`; przycisk generacji nie będzie działał „backendowo”.

2. **Jeśli chcesz, żeby przycisk generował `data.json` na stronie hostowanej na GitHub**:
   - samymi ustawieniami GitHub Pages tego nie osiągniesz,
   - potrzebujesz dodatkowej warstwy wykonawczej (np. API/worker), którą przycisk wywoła.

3. **Najprostsza praktyka na GitHub bez backendu**:
   - generować `data.json` lokalnie (CLI) albo przez GitHub Actions,
   - commit/push wygenerowanego pliku do repo,
   - GitHub Pages serwuje już gotowy `data.json`.

### Kryteria akceptacji po wdrożeniu

1. Przycisk kończy się pobraniem pliku lub jednoznacznym komunikatem błędu w UI (nie tylko w konsoli).
2. Dla tego samego `Repozytorium.xlsx` wynik przycisku == wynik AI/CLI (w tym markery `{{RED}}`).
3. Logi potwierdzają ścieżkę kanoniczną, a nie fallback parsera przeglądarkowego.

### Podsumowanie (runda 3)

Aktualny brak reakcji wynika z tego, że po ostatniej zmianie przycisk wymaga endpointu kanonicznego, którego GitHub Pages sam z siebie nie zapewnia. To naprawia problem jakości (unikanie niezgodnego fallbacku), ale bez backendu powoduje niedziałanie przycisku w praktyce. Aby mieć jednocześnie działanie i zgodność 1:1 z AI, trzeba uruchomić endpoint kanoniczny poza samym GitHub Pages albo przejść na proces generacji `data.json` poza UI (CLI/Actions).

---

## Dodatkowe uzupełnienie: odpowiedź na pytanie o GitHub + docelowy model działania (2026-04-10, runda 4)

### Prompt użytkownika (uzupełnienie kontekstu)
> Przeczytaj i rozbuduj analizę Analizy/2026-04-10_analiza_przyczyny_roznic_ui_vs_ai_datajson_uzupelnienie.md
>
> Odpowiem na pytanie z sekcji "Odpowiedź na pytanie: „czy muszę coś ustawić w GitHub?”
>
> Działaniem docelowym jest utworzenie pliku data.json przez naciśnięcie przycisku w UI.
> Użytkownik ręcznie potem się zaloguje do github i wgra aktualny plik data.json.
> Tak samo jak obecnie ręcznie loguje się i uploaduje plik Repozytorium.xlsx
>
> Aplikacja ma przygotować plik i umożliwić pobranie go na dysk twardy urządzenia. Aplikacja będzie hostowana na Github.
>
> Uzupełnij plik z analizę o te informacje i następnie napisz czy, aby zachować tę funkcjonalność muszę coś jeszcze ustawić w Github.
> Dopisz do analizy co należy zmienić w kodzie, żeby uzyskać taki efekt, że poprzez naciśnięcie przycisku "Generuj data.json" tworzy się plik identyczny z tym co utworzył asystent AI.
> Analizy/AI.txt = zawartość pliku data.json utworzonego przez AI (poprawny).
> Analizy/UI.txt = zawartość pliku data.json utworzonego przez przycisk (błędny).
> Analizy/aktualizacja.md = kroki wykonane przez asystenta AI.

### Doprecyzowanie wymagań (na podstawie powyższego)
Docelowy przepływ ma być **w 100% po stronie użytkownika i przeglądarki**:
1. Użytkownik klika **„Generuj data.json”**.
2. Aplikacja lokalnie tworzy plik `data.json`.
3. Aplikacja udostępnia pobranie pliku na dysk.
4. Użytkownik samodzielnie loguje się do GitHub i ręcznie uploaduje `data.json`.

Czyli: bez automatycznego pushowania do repozytorium przez aplikację.

### Odpowiedź na pytanie: „czy muszę coś ustawić w GitHub?”

**Krótko: nie, do samej funkcji „wygeneruj + pobierz plik lokalnie” nie musisz dodawać żadnych specjalnych ustawień GitHub.**

Wystarczy, że:
- repozytorium/strona jest dostępna (np. GitHub Pages),
- aplikacja potrafi odczytać `Repozytorium.xlsx` i wygenerować JSON w przeglądarce,
- przeglądarka może wykonać standardowy download (Blob + `a[download]`).

To działanie nie wymaga:
- GitHub Tokenów,
- GitHub Apps,
- GitHub Actions,
- uprawnień zapisu do repo z poziomu UI.

#### Co ewentualnie warto mieć w GitHub (opcjonalnie, nie jest wymagane)
1. **GitHub Pages** włączone dla hostingu aplikacji.
2. Dobre praktyki procesowe: branch protection / PR review / historia zmian (to organizacyjne, nie techniczne wymaganie generatora).
3. Opcjonalny workflow walidujący JSON po ręcznym uploadzie (np. lint/format) — ale to dodatki, nie warunek działania przycisku.

### Dlaczego obecny przycisk daje inny wynik niż AI

Z porównania `Analizy/AI.txt` i `Analizy/UI.txt` wynika, że obecnie rozjazd dotyczy głównie markerów czerwonego tekstu `{{RED}}...{{/RED}}` (AI je ma, UI je gubi). To oznacza różnicę w logice odczytu stylu czerwonego koloru z XLSX.

W aktualnym modelu fallback JS opiera się na mapowaniu stylów przez warstwę parsera arkusza, a nie na bezpośredniej analizie `styles.xml` tak jak generator AI (`build_json.py`).

### Co zmienić w kodzie, aby przycisk tworzył plik identyczny z AI (bez backendu, na GitHub Pages)

Żeby zachować hosting statyczny i nadal mieć 1:1 z AI, trzeba przenieść do JS **kanoniczną logikę Pythona**, zamiast polegać na uproszczonym odczycie stylów.

#### Zmiana architektoniczna (rekomendowana)
Utrzymać przycisk jako generator przeglądarkowy, ale:
1. Odczytywać XLSX jako ZIP (`ArrayBuffer` + `JSZip`).
2. Parsować bezpośrednio XML-e:
   - `xl/styles.xml`,
   - `xl/sharedStrings.xml`,
   - `xl/worksheets/sheet*.xml`.
3. Dla każdej komórki używać identycznej logiki jak w `build_json.py`:
   - mapowanie `styleIndex (s)` -> `xf` -> `fontId` -> `color`,
   - detekcja czerwieni z wartości typu `FFFF0000` oraz wariantów równoważnych,
   - dla `shared strings` i zwykłych stringów doklejanie `{{RED}}...{{/RED}}`, jeśli styl komórki jest czerwony,
   - zachowanie dotychczasowej obsługi `{{B}}`/`{{I}}`.
4. Dopiero z tak zebranych danych budować finalne struktury JSON (tak samo jak dziś: porządek arkuszy, mapowanie kolumn, `_meta`, itd.).

#### Minimalny zakres zmian implementacyjnych
1. Wydzielić nowy moduł np. `DataVault/xlsxCanonicalParser.js`:
   - `loadStylesXml(...)`,
   - `isStyleRed(styleIndex, stylesDoc)`,
   - `resolveSharedString(idx, sharedStringsDoc)`,
   - `extractCellTextWithCanonicalFormatting(cellNode, styleInfo, sharedStrings)`.
2. W `DataVault/app.js` podmienić ścieżkę kliknięcia **Generuj data.json**:
   - zamiast bazowania na obecnym uproszczonym wykrywaniu czerwieni,
   - użyć nowego parsera kanonicznego.
3. Zostawić download lokalny bez zmian (to jest zgodne z Twoim procesem ręcznego uploadu do GitHub).
4. Dodać test porównawczy „golden”:
   - ten sam `Repozytorium.xlsx` -> wynik JS == wynik referencyjny AI,
   - twardy warunek zgodności liczników `{{RED}}`, `{{B}}`, `{{I}}`.

### Kryterium „gotowe” dla Twojego scenariusza

Funkcjonalność można uznać za domkniętą, gdy jednocześnie:
1. Kliknięcie przycisku zawsze tworzy `data.json` do pobrania lokalnie.
2. Wygenerowany plik jest semantycznie identyczny z wynikiem AI (`Analizy/AI.txt`).
3. Użytkownik nadal wykonuje ręczny upload do GitHub (bez zmian procesu).
4. Brak dodatkowych wymagań konfiguracyjnych po stronie GitHub poza standardowym hostingiem strony.

### Podsumowanie odpowiedzi dla użytkownika

- **Czy musisz coś dodatkowo ustawiać w GitHub?**
  - **Nie**, jeśli celem jest tylko: „kliknij -> wygeneruj -> pobierz lokalnie -> ręcznie wgraj na GitHub”.
- **Co trzeba zmienić w kodzie, żeby wynik był identyczny jak AI?**
  - Przenieść do UI kanoniczną logikę parsowania XLSX ze `styles.xml` (jak w `build_json.py`) i przestać polegać na niepełnej detekcji czerwieni z obecnej ścieżki fallback.

---

## Uzupełnienie po ponownym porównaniu plików po ostatniej poprawce (2026-04-10)

Wykonano ponowne porównanie `Analizy/AI.txt` i `Analizy/UI.txt` na świeżo wygenerowanym pliku z przycisku.

### Wynik
- Pliki różnią się w porównaniu surowym (tekst/bajty),
- ale po porównaniu semantycznym JSON (`json.loads(...)`) są **identyczne merytorycznie**,
- różnice dotyczą reprezentacji (głównie kolejności kluczy, np. `Zasięg` ↔ `Cechy` w części rekordów `Bronie`).

### Decyzja
Zgodnie z kryterium funkcjonalnym: **poprawka działa** (UI generuje te same dane co AI).

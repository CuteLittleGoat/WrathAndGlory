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

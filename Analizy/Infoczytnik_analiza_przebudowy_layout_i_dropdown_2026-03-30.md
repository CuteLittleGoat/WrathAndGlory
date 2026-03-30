# Analiza modułu Infoczytnik — przebudowa layoutu na niezależne dropdowny

**Data aktualizacji analizy:** 2026-03-30  
**Moduł:** Infoczytnik (`GM.html` + `Infoczytnik.html`)  
**Zakres tej aktualizacji:** wyłącznie analiza (bez zmian kodu)

## Prompt użytkownika (zachowanie kontekstu)

> Zaktualizuj analizę: Analizy/Infoczytnik_analiza_przebudowy_layout_i_dropdown_2026-03-30.md  
> Nie wprowadzaj zmian w kodzie. Zaktualizuj tylko plik z analizą.  
>  
> 1. Nie przewiduję potrzeby fallbacków ani migracji plików. Przygotujemy wszystko od zera.  
>  
> 2. 6) Najważniejszy punkt: skąd brać listę plików do dropdownów? = Opcja A (najprostsza, bez rozbudowy Firebase): manifest JSON/JS  
> Oczekiwanym rozwiązaniem będzie plik manifestu w postaci pliku xlsx. Jeżeli jest taki techniczny wymóg to możesz zrobić skrpyt przerabiający go na json i zasilający stronę.  
> Podobne mechanizmy istnieją w modułach DataVault oraz Audio.  
>  
> Pozostałe opcje skasuj z analizy. Nie będziemy ich rozważać. Jeżeli będzie wymagany plik data.json to przygotuj też przycisk, który spowoduje przygotowanie takiego pliku i jego import (podobny mechanizm jest w module DataVault).  
>  
> 3. Przygotuj analizę czy da się zrobić listę prefixów i suffixów w pliku DataSlate_manifest.xlsx  
> W Infoczytnik/DataSlate_manifest.xlsx masz przykład.  
>  
> Sprawdź czy taka forma pliku z manifestem jest wystarczająca.  
> Zawiera on arkusze z danymi wsadowymi. "backgrounds", "logos", "audios" zawieają kolumny:  
> WyswietlanaNazwa = nazwa jaka ma się wyświetlić w panelu  
> Link = link do folderu z plikiem  
> NazwaPliku = nazwa pliku z daną grafiką/dźwiękiem  
>  
> W zakładce "fonts":  
> WyswietlanaNazwa = nazwa jaka ma się wyświetlić w panelu  
> NazwaFontu = nazwa fontu  
>  
> W zakładce "fillers"  
> WyświetlanaNazwa = nazwa jaka ma się wyświetlać w panelu  
> Prefix = lista prefixów oddzielona średnikiem  
> Suffix = lista suffixów oddzielona średnikiem  
>  
> Aplikacja będzie musiała sama sobie dodać "+++" na początku i końcu każdej linii.  
> Sprawdź też czy wypisałem i uporządkowałem wszystko co obecnie jest zaszyte w kodzie.  
>  
> W zakładkach "background", "logos" i "audios" użyłem obecnej struktury katalogów. Docelowo będzie ona zmieniona.  
>  
> Czy potrzebne będą jeszcze jakieś zakładki w pliku z manifestem?

---

## 1) Decyzje architektoniczne na ten etap (ostateczne)

1. **Brak fallbacków i brak migracji** — wdrożenie „od zera”, bez utrzymywania starego modelu `faction` jako planu przejściowego.  
2. **Jedyny rozważany mechanizm źródła dropdownów:** manifest oparty o `DataSlate_manifest.xlsx`.  
3. **Firebase bez rozbudowy pod listing plików** — listy opcji mają wynikać z manifestu, nie z dynamicznego skanowania katalogów.

---

## 2) Najważniejszy punkt: skąd brać listę plików do dropdownów?

### Ostateczna odpowiedź
Źródłem prawdy ma być **`Infoczytnik/DataSlate_manifest.xlsx`**, a aplikacja (lub prosty skrypt build/deploy) ma generować z niego JSON używany przez panel GM i ekran gracza.

### Rekomendowany przepływ
1. Edycja danych przez człowieka w `DataSlate_manifest.xlsx`.  
2. Skrypt (Node/Python) czyta arkusze i zapisuje np. `Infoczytnik/data/data.json` (lub `asset-manifest.json`).  
3. Przycisk w GM typu „Importuj/Odśwież manifest” uruchamia import gotowego JSON (analogicznie do podejścia z DataVault).

To spełnia wymaganie: **manifest edytowalny w XLSX + zasilanie strony przez JSON**.

---

## 3) Czy lista prefixów/suffixów w XLSX jest możliwa?

**Tak, jest możliwa i technicznie poprawna** przy założonym formacie:
- `Prefix`: wartości rozdzielone `;`
- `Suffix`: wartości rozdzielone `;`
- parser robi `split(';')`, `trim()`, odrzuca puste elementy.

### Wymóg formatowania „+++ ... +++”
Dane w XLSX mogą pozostać „czyste” (bez plusów), a aplikacja przy renderze ma doklejać:
- `+++ ${tekst} +++`

Dzięki temu jeden format danych obsłuży zarówno obecne, jak i przyszłe zestawy fillerów.

---

## 4) Weryfikacja `Infoczytnik/DataSlate_manifest.xlsx` (stan pliku)

Na podstawie odczytu arkuszy:
- Arkusze istnieją: `backgrounds`, `logos`, `audios`, `fonts`, `fillers`.
- Struktura kolumn jest zgodna z założeniem użytkownika.
- Zakładka `fillers` zawiera zestawy: Mechanicus, Inquisition, Militarum, Khorne, Nurgle, Tzeentch, Slaanesh, Chaos Undivided.

### Ocena wystarczalności obecnego pliku
**Format jest dobry jako baza**, ale **zawartość jest jeszcze niepełna** względem aktualnie zaszytego kodu:

1. **`backgrounds`** — obecnie tylko 2 rekordy (`Główny`, `Notatnik`), a w kodzie layoutów jest więcej wariantów (m.in. Inquisition, Militarum, Khorne, Nurgle, Tzeentch, Slaanesh, Chaos Undivided, Pismo odręczne, Pismo ozdobne).  
2. **`fonts`** — obecnie 2 rekordy (Share Tech Mono, Caveat), a w kodzie jest pełna mapa fontów dla wszystkich layoutów.  
3. **`audios`** — obecnie 1 rekord (`Message.mp3`), brak listy wariantów (jeśli mają istnieć).  
4. **`logos`** — obecnie 2 rekordy i to odpowiada temu, co faktycznie jest teraz w kodzie (Inquisition, Mechanicus).

Wniosek: **schema XLSX jest wystarczająca, ale trzeba uzupełnić rekordy**, jeżeli celem jest pełne odwzorowanie aktualnych możliwości bez utraty opcji.

---

## 5) Czy wszystko „zaszyte w kodzie” zostało wypisane i uporządkowane?

Poniżej checklista aktualnego hardcodu, który trzeba przenieść do manifestu/JSON:

1. **Lista layoutów/faction w GM** (10 opcji):  
   `mechanicus`, `inquisition`, `militarum`, `khorne`, `nurgle`, `tzeentch`, `slaanesh`, `chaos_undivided`, `pismo_odreczne`, `pismo_ozdobne`.
2. **Mapa teł (`LAYOUT_BG`)** po stronie Infoczytnika.  
3. **Mapa fontów (`FONT_STACK`)** po stronie GM i Infoczytnika (duplikacja).  
4. **Mapa fillerów (`LAYOUTS` / `FILLERS`)** po stronie GM i Infoczytnika (duplikacja).  
5. **Mapa logo (`LOGO`)** po stronie Infoczytnika (aktualnie 2 logo).  
6. **Ścieżki audio domyślnego ping/message** (hardcoded).  
7. **Reguły „restricted layout”** dla `pismo_odreczne` i `pismo_ozdobne`.

### Co to oznacza praktycznie
Żeby manifest był kompletnym źródłem danych, trzeba przenieść do JSON:
- listy opcji dropdown,
- mapowanie displayName ↔ plik/font/filler-set,
- ewentualne flagi zachowania (np. czy wariant ma ograniczenia).

---

## 6) Czy potrzebne są dodatkowe zakładki w XLSX?

### Minimalnie wymagane (aby nie blokować wdrożenia)
Obecne 5 zakładek wystarczy, **jeśli** zachowania logiczne (np. restricted layout, domyślny ping, flagi UI) zostaną chwilowo zapisane w kodzie.

### Rekomendowane (aby usunąć dalszy hardcode)
Dodać 2 nowe zakładki:

1. **`rules`**  
   Proponowane kolumny:  
   - `Klucz` (np. `pismo_odreczne`)  
   - `DisableLogo` (true/false)  
   - `DisableFillers` (true/false)  
   - `DisableMessageAudio` (true/false)  
   - `DisableShadowBox` (true/false)  
   - `DisableFlicker` (true/false)

2. **`settings`**  
   Proponowane kolumny:  
   - `Key` (np. `PingAudioPath`)  
   - `Value` (np. `assets/audios/ping/Ping.mp3`)

To pozwoli wyjąć z kodu reguły specjalne i ścieżki globalne.

---

## 7) Struktura linków w arkuszach a docelowa zmiana katalogów

Ponieważ docelowo struktura katalogów ma się zmienić, kolumna `Link` jest prawidłowa (elastyczna), ale warto przyjąć zasadę:
- `Link` zawsze wskazuje folder docelowy,
- `NazwaPliku` zawsze zawiera pełną nazwę z rozszerzeniem,
- finalny URL składany przez aplikację: `Link + NazwaPliku` (z normalizacją `/`).

Dzięki temu zmiana struktury katalogów nie wymaga zmian kodu, tylko aktualizacji manifestu.

---

## 8) Rekomendacja końcowa (po aktualizacji wymagań)

1. Zostawić **wyłącznie ścieżkę XLSX → JSON** jako oficjalne źródło dropdownów.  
2. Uzupełnić rekordy w `backgrounds` i `fonts`, aby pokryć aktualny stan kodu.  
3. Wdrożyć parser fillerów (`;`) + automatyczne dodawanie `+++ ... +++` w aplikacji.  
4. Dodać przycisk w GM do importu/odświeżenia wygenerowanego `data.json`.  
5. Rozważyć dodanie zakładek `rules` i `settings`, jeśli celem jest pełne usunięcie hardcodu z JS.

To podejście realizuje wskazaną przez Ciebie decyzję: **bez fallbacków, bez migracji, bez rozbudowy Firebase, z manifestem XLSX jako bazą sterującą**.

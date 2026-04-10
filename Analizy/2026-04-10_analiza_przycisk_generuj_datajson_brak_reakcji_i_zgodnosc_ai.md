# Analiza: przycisk „Generuj data.json” nie reaguje + jak uzyskać plik 1:1 zgodny z AI (2026-04-10)

## Prompt użytkownika (oryginalny)
> Przeczytaj analizę Analizy/2026-04-10_analiza_przyczyny_roznic_ui_vs_ai_datajson_uzupelnienie.md
>
> Po wprowadzeniu ostatniej poprawki przycisk "Generuj data.json" nie reaguje. Sprawdź przyczynę oraz zaproponuj naprawę. Poprzednio został zrobiony fallback, ale utworzony w ten sposób plik nie jest zgodny z tym generowanym przez asystenta AI. Przeprowadź analizę czemu przycisk nie działa i co należy zrobić, żeby działał i żeby wygenerowany plik data.json był identyczny jak ten stworzony przez asystenta AI.
> Nie wprowadzaj zmian w kodzie tylko rozbuduj analizę.

---

## Zakres weryfikacji

Przeanalizowano:
1. Poprzednią analizę: `Analizy/2026-04-10_analiza_przyczyny_roznic_ui_vs_ai_datajson_uzupelnienie.md`.
2. Aktualną implementację przycisku i ścieżki generowania w `DataVault/app.js`.
3. UI `DataVault/index.html` pod kątem tego, czy użytkownik widzi status/błąd po kliknięciu.
4. Obecność infrastruktury endpointu kanonicznego `POST /api/build-json` w repozytorium.

---

## Ustalenia techniczne (aktualny stan)

### 1) Przycisk jest obecnie „canonical-only”
Funkcja `loadXlsxFromRepo()` po kliknięciu przycisku próbuje wyłącznie:
- `fetch("api/build-json", { method: "POST" ... })`.

Jeżeli endpoint zwróci błąd HTTP albo nie istnieje, kod wpada do `catch`, ustawia status błędu i loguje informację o CLI (`python build_json.py Repozytorium.xlsx data.json`).

Kluczowe: **w aktualnym kodzie nie ma już fallbacku JS, który generował plik w przeglądarce**.

Wniosek: jeśli `/api/build-json` nie działa w danym środowisku (np. statyczny hosting), przycisk nie pobierze pliku.

### 2) Dla użytkownika wygląda to jak „brak reakcji”
`setStatus()` i `logLine()` zapisują komunikaty do konsoli (`console.info`/`console.error`), ale UI nie ma osobnego widocznego panelu statusów/błędów.

W praktyce użytkownik może kliknąć przycisk i nie zobaczyć żadnej zmiany na ekranie (poza ewentualnym brakiem pobrania), mimo że błąd został zarejestrowany w konsoli devtools.

### 3) Brak endpointu w repo = brak możliwości działania przycisku na statyku
W repo występuje skrypt kanoniczny `DataVault/build_json.py`, ale nie ma implementacji backendowego endpointu `POST /api/build-json`.

To oznacza, że bez dodatkowej warstwy serwerowej przycisk nie ma gdzie wysłać żądania i kończy w błędzie.

---

## Dlaczego nie można wrócić do starego fallbacku JS (jeśli celem jest 1:1 z AI)

Poprzednia analiza trafnie wykazała, że fallback przeglądarkowy (SheetJS) nie daje pełnej zgodności ze ścieżką AI/Python dla markerów `{{RED}}`.

Zatem:
- fallback JS może przywracać „działanie kliknięcia” (plik się pobiera),
- ale jednocześnie psuje warunek kluczowy: **identyczność data.json względem AI**.

Czyli problem ma dwa poziomy:
1. funkcjonalny („czy przycisk coś robi?”),
2. jakościowy („czy wynik jest 1:1 taki jak AI?”).

Fallback JS rozwiązuje #1 kosztem #2, więc nie spełnia celu biznesowego.

---

## Root cause (przyczyna główna)

Bezpośrednia przyczyna obecnego zgłoszenia „przycisk nie reaguje”:
1. Ostatnia poprawka usunęła fallback JS i zostawiła wyłącznie tryb kanoniczny (`POST /api/build-json`).
2. W środowisku uruchomieniowym przycisku endpoint nie jest dostępny.
3. Błąd jest komunikowany tylko do konsoli, więc użytkownik odbiera to jako brak reakcji.

To jest spójne z celem jakościowym (unikanie niezgodnego fallbacku), ale niespójne z UX (brak widocznego feedbacku) i z oczekiwaniem „przycisk ma działać”.

---

## Co należy zrobić, aby przycisk działał i dawał wynik identyczny z AI

## Wariant docelowy (rekomendowany)

1. **Uruchomić kanoniczny endpoint** `POST /api/build-json` (backend/worker) wykorzystujący dokładnie `build_json.py` lub jego 1:1 port.
2. **Zostawić politykę canonical-only** dla przycisku (bez fallbacku JS do produkcyjnej generacji).
3. **Dodać widoczny komunikat UI** (toast/banner/modal w interfejsie, nie tylko console) dla:
   - startu generacji,
   - sukcesu (pobrano plik),
   - błędu endpointu + jasna instrukcja co dalej.
4. **Dodać walidację zgodności po stronie endpointu/pipeline**:
   - liczba markerów `{{RED}}` > 0,
   - test porównawczy/golden dla krytycznych sekcji,
   - opcjonalnie checksum/wersjonowanie wygenerowanego artefaktu.

Efekt: przycisk realnie działa i zawsze zwraca plik zgodny z AI.

## Wariant przejściowy (gdy brak backendu)

Jeżeli środowisko musi pozostać statyczne:
1. Przycisk nie powinien udawać pełnej generacji.
2. Po kliknięciu powinien pokazać **jawny komunikat blokujący**: 
   - „Brak endpointu kanonicznego, generacja z UI niedostępna w tym środowisku”.
3. Jedyną ścieżką publikacyjną powinno być CLI:
   - `python build_json.py Repozytorium.xlsx data.json`.

To nie daje „generacji z przycisku” w sensie pobrania pliku, ale utrzymuje 1:1 zgodność danych i eliminuje ciche błędy jakości.

---

## Kryteria akceptacji naprawy

Naprawę uznać za zamkniętą dopiero gdy:
1. Kliknięcie przycisku w docelowym środowisku kończy się pobraniem `data.json` (lub czytelnym komunikatem błędu w UI, nie tylko w konsoli).
2. Wygenerowany plik z przycisku i plik AI/CLI są semantycznie identyczne (po normalizacji EOL/kolejności kluczy).
3. Liczniki markerów `{{RED}}`, `{{B}}`, `{{I}}` są zgodne z baseline.
4. Logi techniczne potwierdzają przejście przez ścieżkę kanoniczną, nie fallback SheetJS.

---

## Podsumowanie

Przycisk wygląda na „nieaktywny”, ponieważ działa wyłącznie w trybie canonical-only, a endpoint `POST /api/build-json` nie jest dostępny w aktualnym środowisku, a błąd trafia głównie do konsoli. To nie jest już błąd parsera fallbackowego, tylko brak infrastruktury kanonicznej i brak widocznego feedbacku w UI.

Aby spełnić oba warunki jednocześnie (działanie przycisku + plik 1:1 jak AI), trzeba zapewnić działający endpoint kanoniczny i utrzymać brak fallbacku JS jako źródła produkcyjnego `data.json`.

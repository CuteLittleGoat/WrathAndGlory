# Ocena pliku `Analizy/Test.xlsx` jako nowego manifestu dla modułu Infoczytnik (2026-04-29)

## Prompt użytkownika (kontekst)

> Przeczytaj plik Analizy/Hardcoded_URL_Audyt_2026-04-28.md
> Przygotowałem nowy plik Analizy/Test.xlsx
> Sprawdź czy może on być nowym manifestem dla modułu Infoczytnik. Czy w takiej formie mają być linki?

---

## Zakres analizy

Przeanalizowano:
- `Analizy/Hardcoded_URL_Audyt_2026-04-28.md` (ustalenia dot. hardcoded URL i rekomendacji dla Infoczytnik),
- `Analizy/Test.xlsx` (struktura arkuszy i wartości ścieżek).

---

## Wniosek krótki

**Tak — `Analizy/Test.xlsx` może być nowym manifestem dla Infoczytnik**, bo ma poprawną, czytelną strukturę danych (ID, nazwa, ścieżka/parametr) i linki do assetów są zapisane w zalecanej formie **ścieżek względnych**.

**Tak — w takiej formie linki powinny być zapisane** dla wariantu niezależnego od domeny autora (kopie/instancje przenośne).

---

## Co jest poprawne w `Test.xlsx`

### 1) Ścieżki do plików są względne, a nie absolutne

W arkuszach `backgrounds`, `logos`, `audios` kolumna `Plik` zawiera wpisy typu:
- `assets/backgrounds/DataSlate_01.png`
- `assets/logos/Mechanicus.png`
- `assets/audios/Message.mp3`

To jest właściwy kierunek zgodny z wcześniejszą analizą hardcoded URL (odejście od `https://cutelittlegoat.github.io/...`).

### 2) Struktura arkuszy jest spójna i łatwa do mapowania

Plik ma logiczny podział:
- `backgrounds` (ID, Nazwa, Plik),
- `logos` (ID, Nazwa, Plik),
- `audios` (ID, Nazwa, Plik),
- `fonts` (ID, Nazwa, Font),
- `fillers` (ID, Nazwa, Prefix, Suffix).

To jest dobry format wejściowy do generatora JSON (`data.json`) używanego przez frontend.

---

## Uwaga techniczna o formacie ścieżek

W poprzedniej analizie dla `data.json` pojawiał się przykład `../backgrounds/...` (ścieżka liczona względem `assets/data/data.json`).

W `Test.xlsx` masz `assets/backgrounds/...` — to **też może być poprawne**, ale pod warunkiem, że:
1. kod modułu interpretuje te ścieżki względem katalogu głównego modułu (`Infoczytnik/`), albo
2. pipeline eksportu XLSX→JSON normalizuje je do formatu oczekiwanego przez frontend.

Czyli: format z `Test.xlsx` jest dobry, **jeśli jest zgodny z tym, jak frontend buduje URL zasobów**.

---

## Czy „tak mają być linki”?

Dla celu publikacyjnego / przenośnego: **tak, linki powinny być względne** (bez domeny). 

Praktyczna reguła:
- ✅ preferowane: ścieżki względne (`assets/...` lub `../...` — zależnie od logiki parsera),
- ❌ niezalecane: pełne URL absolutne do konkretnego hostingu autora (`https://...`).

---

## Checklista przed wdrożeniem

Aby potwierdzić, że ten manifest jest gotowy produkcyjnie:

1. Wygenerować finalny `Infoczytnik/assets/data/data.json` z `Test.xlsx`.
2. Otworzyć moduł i sprawdzić ładowanie wszystkich:
   - teł,
   - logo,
   - audio.
3. Zweryfikować w DevTools brak błędów 404.
4. Zweryfikować brak starych domen autora w wygenerowanym `data.json`.

---

## Konkluzja końcowa

`Analizy/Test.xlsx` jest sensownym kandydatem na nowy manifest Infoczytnik i zawiera linki w dobrym, nowoczesnym kierunku (względnym). Kluczowe jest tylko dopięcie zgodności formatu ścieżek (`assets/...` vs `../...`) z rzeczywistą logiką odczytu w module i potwierdzenie tego testem runtime po eksporcie do `data.json`.

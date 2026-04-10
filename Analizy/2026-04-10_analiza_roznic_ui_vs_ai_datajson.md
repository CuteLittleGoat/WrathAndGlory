# Analiza różnic: `Analizy/data.json` (UI) vs `DataVault/data.json` (AI) — 2026-04-10

## Prompt użytkownika (oryginalny)
> Przygotuj nową analizę i zapisz jej wynik w nowym pliku.
> Przeczytaj pliki:
> Analizy/2026-04-10_analiza_datavault_mechanika_aktualizacji.md
> Analizy/aktualizacja.md
>
> Jest problem z aktualizacją danych poprzez przycisk w widoku admina.
> Mam przygotowany plik Repozytorium.xlsx
>
> I teraz kroki jakie wykonuję:
> 1. Klikam "Aktualizuj dane".
> 2. Tworzy się nowy plik data.json (kopia w Analizy/data.json)
> 3. W zakładkach nie działa kolorowanie na czerwono. Załączam screen 01.jpg jako przykład, ale ten problem występuje też w innych zakładkach.
> 4. Korzystam z asystenta AI do wygenerowania nowego pliku data.json i aktualizacji danych.
> 5. Kroki jakie AI wykonuje są opisane w Analizy/aktualizacja.md
> 6. Po przeładowaniu strony formatowanie jest prawidłowe. Działają warunki na czerwony kolor, warunki na "str.", pogrubienie i inne. Załączam przykładowy screen 02.jpg
>
> W obu przypadkach (ręczna aktualizacja i korzystanie z asystenta AI) był ten sam plik źródłowy Repozytorium.xlsx, więc musi być jakaś różnica w generowaniu data.json. Porównaj załączony plik (wygenerowany przez przycisk w UI) oraz DataVault/data.json (wygenerowany przez AI).
>
> Sprawdź czemu się różnią. Zaproponuj poprawę, żeby przycisk działał poprawnie (czyli dał taki data.json jak wygenerowany przez AI zgodnie z opisem w Analizy/aktualizacja.md)

---

## Przeczytane materiały wejściowe
- `Analizy/2026-04-10_analiza_datavault_mechanika_aktualizacji.md`
- `Analizy/aktualizacja.md`
- `Analizy/data.json` (plik z przycisku UI)
- `DataVault/data.json` (plik wygenerowany przez AI)

## Wynik porównania plików JSON

### 1) Główna różnica krytyczna: brak markerów czerwonego koloru w pliku z UI
- `Analizy/data.json`:
  - `{{RED}}`: **0**
  - `{{/RED}}`: **0**
- `DataVault/data.json`:
  - `{{RED}}`: **1128**
  - `{{/RED}}`: **1128**

To jest bezpośrednia przyczyna braku czerwonego formatowania po aktualizacji wykonanej przyciskiem.

### 2) Liczba różnic i ich charakter
Łącznie wykryto **1120** różnic wartości tekstowych, z czego:
- **687**: brak opakowania `{{RED}}...{{/RED}}` w pliku z UI,
- **381**: różnice tylko w znakach nowej linii (`CRLF` vs `LF`),
- **52**: inne różnice uboczne (np. `1,000` vs `1000`, drobne różnice cytowania, miejscami układ przejść linii przy markerach).

### 3) Co jest zgodne
- Markery `{{B}}/{{/B}}` i `{{I}}/{{/I}}` są obecne w obu plikach w tej samej liczbie (odpowiednio 815 i 214 par).
- Reguły związane z `str.` występują w obu plikach (212 wystąpień).

Wniosek: problem praktyczny, który widzisz w UI, dotyczy przede wszystkim kanału koloru czerwonego.

---

## Dlaczego pliki różnią się mimo tego samego `Repozytorium.xlsx`
Na podstawie wcześniejszej analizy mechaniki (`2026-04-10_analiza_datavault_mechanika_aktualizacji.md`) i aktualnego porównania:

1. Ścieżka AI (opisana w `Analizy/aktualizacja.md`) wykorzystuje generator, który zachowuje warunki dla czerwonego tekstu i zapisuje je jako markery `{{RED}}`.
2. Ścieżka przycisku „Aktualizuj dane” w Twoim przebiegu (plik `Analizy/data.json`) nie zapisała tych markerów, więc renderer nie miał czego pokolorować.
3. To tłumaczy obserwację ze screenów:
   - po aktualizacji przez UI: brak czerwonego,
   - po aktualizacji przez AI i reloadzie: czerwony wraca.

---

## Proponowana poprawa (żeby przycisk dawał wynik jak AI)

### Wariant rekomendowany (najbezpieczniejszy)
Ujednolicić generator danych i sprawić, żeby przycisk „Aktualizuj dane” korzystał z **tej samej logiki co generator AI** (ten sam parser / ten sam pipeline), zamiast mieć osobną implementację mapowania stylów.

**Efekt:** jedna ścieżka generacji = brak rozjazdów między `data.json` z UI i `data.json` z AI.

### Wariant alternatywny (jeśli zostaje parser w JS)
Dodać testy regresyjne dla generowania `data.json` po kliknięciu przycisku:
- test obecności `{{RED}}` dla kontrolnych komórek,
- test równoważności wybranych sekcji względem wzorca z generatora AI,
- test normalizacji liczb i nowych linii.

---

## Minimalna lista kontrolna po wdrożeniu poprawki
1. Wgrać ten sam `Repozytorium.xlsx`.
2. Wygenerować JSON przyciskiem UI.
3. Sprawdzić liczbę markerów `{{RED}}` (powinna być > 0, docelowo zgodna z referencją).
4. Otworzyć zakładkę „Premie Frakcji” i potwierdzić czerwony kolor (np. `[DOWOLNE]`).
5. Wykonać szybkie porównanie z referencyjnym `DataVault/data.json`.

---

## Konkluzja
Masz rację: oba przypadki startują z tego samego XLSX, ale kończą się różnym `data.json`.
Kluczowa różnica to brak markerów `{{RED}}` w JSON-ie wygenerowanym przyciskiem UI (`Analizy/data.json`), co bezpośrednio psuje czerwone formatowanie w aplikacji.

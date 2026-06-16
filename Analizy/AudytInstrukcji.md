# Audyt instrukcji dokumentacji Markdown

**Data:** 2026-06-16
**Repozytorium:** `CuteLittleGoat/WrathAndGlory`
**Gałąź:** `main`

## Założenia

Audyt dotyczy dokumentacji modułów w repozytorium `WrathAndGlory`. Nie obejmuje folderu `Analizy` ani plików `DetaleLayout.md`, `DoZrobienia.md`, `Kolumny.md`.

Raport jest po polsku. Na tym etapie nie poprawiano istniejących instrukcji.

## Wniosek główny

Wszystkie sprawdzone moduły wymagają poprawek dokumentacji. Najczęstsze problemy to brak pełnej wersji angielskiej, mieszanie instrukcji użytkownika z dokumentacją techniczną oraz rozjazd dokumentacji z aktualnym kodem.

## Pliki do poprawy

- `Main/docs/README.md`
- `Main/docs/Documentation.md`
- `DiceRoller/docs/README.md`
- `DiceRoller/docs/Documentation.md`
- `GeneratorNazw/docs/README.md`
- `GeneratorNazw/docs/Documentation.md`
- `Kalkulator/docs/README.md`
- `Kalkulator/docs/Documentation.md`
- `Kalkulator/config/FirebaseREADME.md`
- `DataVault/docs/README.md`
- `DataVault/docs/Documentation.md`
- `DataVault/docs/ZasadyFormatowania.md`
- brakujący `DataVault/config/FirebaseREADME.md`
- `GeneratorNPC/docs/README.md`
- `GeneratorNPC/docs/Documentation.md`
- `GeneratorNPC/config/FirebaseREADME.md`
- `Audio/docs/README.md`
- `Audio/docs/Documentation.md`
- `Audio/config/FirebaseREADME.md`
- `Infoczytnik/docs/README.md`
- `Infoczytnik/docs/Documentation.md`
- `Infoczytnik/config/FirebaseREADME.md`
- `shared/FirebaseREADME.md`

## Priorytety

1. Krytyczne: `Infoczytnik`, `DataVault`, `GeneratorNPC`, `Kalkulator`.
2. Wysokie: `Audio`, `Main`, `GeneratorNazw`.
3. Średnie/wysokie: `DiceRoller`.

## Najważniejsze zalecenia

- Każdy `README.md` przepisać jako instrukcję użytkownika: co widać, co można kliknąć i co się stanie po kliknięciu.
- Każdy `Documentation.md` uzupełnić jako pełną dokumentację programisty oraz dodać pełną wersję angielską.
- Dokumenty Firebase ujednolicić i dopasować do aktualnego kodu.
- Utworzyć dokument Firebase dla `DataVault` albo jawnie opisać, że korzysta z dokumentacji wspólnej w `shared`.
- Usunąć z dokumentacji charakter changeloga i opisywać aktualny stan modułu.

## Uwagi modułowe

### Main

Opisać tryb admina, kafle widoczne tylko dla admina, dynamiczne linki do obrazków i mapy oraz różne ścieżki otwierania Infoczytnika.

### DiceRoller

Dopisać walidację pól, reset po zmianie języka, opis kości Furii, komplikacji, krytycznej Furii i przeniesienia.

### GeneratorNazw

Dopisać listę kategorii i opcji, seed, limit wyników, automatyczne generowanie oraz kopiowanie wyniku.

### Kalkulator

Opisać ekran startowy, Kalkulator PD, Tworzenie Postaci, modale, instrukcję PDF, zapis i wczytanie stanu oraz zasadę Drzewa Nauki.

### DataVault

README przepisać na prostą instrukcję użytkownika. Documentation uporządkować i opisać aktualny mechanizm prywatnych danych. Brakuje modułowego FirebaseREADME.

### GeneratorNPC

Opisać ekran dostępu, ładowanie danych, moduły aktywne, ulubione, aliasy, zapis lokalny awaryjny i generowanie karty.

### Audio

Opisać panel filtrów tagów, popup filtra, aliasy, listy ulubionych, suwak głośności, loop i tryb admina/użytkownika.

### Infoczytnik

Dokumentacja wymaga krytycznej aktualizacji: aktualny moduł ma wersje produkcyjne i testowe, a dokumenty nadal za mocno skupiają się na plikach `_test`. Trzeba opisać pełny aktualny model danych `dataslate/current`.

### shared

`shared/FirebaseREADME.md` powinien jasno wskazywać, że dotyczy wspólnej warstwy danych używanej przez `DataVault` i `GeneratorNPC`.

## Następne kroki

1. Przyjąć wspólny szablon dla `README.md`, `Documentation.md`, `FirebaseREADME.md`.
2. Najpierw poprawić dokumentację krytyczną i Firebase.
3. Następnie przepisać README największych modułów.
4. Na końcu uzupełnić pełne wersje angielskie i uporządkować prostsze moduły.

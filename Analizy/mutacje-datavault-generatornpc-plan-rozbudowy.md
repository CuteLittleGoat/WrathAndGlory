# Zakładka „Mutacje” — DataVault i GeneratorNPC: analiza rozbudowy i plan pracy

> **Data analizy:** 2 listopada 2026
> **Moduły:** `DataVault` (generator danych i wyświetlanie zakładki), `GeneratorNPC` (nowy moduł aktywny), dokumentacja wspólna (`DetaleLayout.md`, `Kolumny.md`, instrukcje Firebase)
> **Stan kodu:** commit `4295ed5` (gałąź `main`)
> **Plik wejściowy:** załączony `Repozytorium.xlsx` — 10 038 088 B, SHA-256 `e3ebb94b446eac953fffba5660c143dee64fc0520e4bb6d1fc7a6b52357290e3`, 39 arkuszy
> **Charakter dokumentu:** analiza i plan pracy. Kod, dane i konfiguracja nie zostały zmienione. Wszystkie pomiary wykonano na kopiach w katalogu tymczasowym sesji.
> **Odpowiedź w skrócie:** generator danych (`build_json.py` i ścieżka w przeglądarce) **obsługuje nową zakładkę bez żadnej zmiany w kodzie** — obie ścieżki dają bajtowo identyczny `data.json` z 34 rekordami „Mutacji” na właściwym miejscu w kolejności. **Trzeba jednak oczyścić plik XLSX:** arkusz „Mutacje” ma w środku ponad milion pustych, sformatowanych wierszy, przez które generowanie trwa ok. 35–50 s zamiast ok. 1 s, a plik waży 10 MB zamiast 0,6 MB. Wyświetlanie zakładki w DataVault to jedna linia w `app.js` i blok reguł CSS. W GeneratorNPC nowy moduł „Mutacje” powstaje przez powielenie wzorca „Modlitw” w ok. 15 miejscach `index.html` i dwóch regułach CSS.

---

## Spis treści

1. [Prompt użytkownika (pełny)](#1-prompt-użytkownika-pełny)
2. [Zakres analizy](#2-zakres-analizy)
3. [Podsumowanie](#3-podsumowanie)
4. [Zakładka „Mutacje” w nowym pliku XLSX](#4-zakładka-mutacje-w-nowym-pliku-xlsx)
5. [DataVault — generator danych](#5-datavault--generator-danych)
6. [DataVault — wyświetlanie zakładki](#6-datavault--wyświetlanie-zakładki)
7. [GeneratorNPC — nowy moduł „Mutacje”](#7-generatornpc--nowy-moduł-mutacje)
8. [Dokumentacja do aktualizacji](#8-dokumentacja-do-aktualizacji)
9. [Plan pracy](#9-plan-pracy)
10. [Testy akceptacyjne](#10-testy-akceptacyjne)
11. [Ryzyka](#11-ryzyka)
12. [Decyzje do podjęcia](#12-decyzje-do-podjęcia)
13. [Obserwacje poboczne (poza zakresem)](#13-obserwacje-poboczne-poza-zakresem)
14. [Następne kroki](#14-następne-kroki)
15. [Załącznik — metoda pomiarów](#15-załącznik--metoda-pomiarów)

---

## 1. Prompt użytkownika (pełny)

> @"/root/.claude/uploads/a92192ab-b41a-578e-ab2b-83d523e19803/3ccf5e6c-Repozytorium.xlsx" Potrzebuję analizy rozbudowy aplikacji. Nic nie zmieniaj w kodzie. Przygotuj tylko analizę oraz zapisz ją w Analizy/ na gałęzi Main.
>
> Przeanalizuj kod modułu DataVault w repo "WrathAndGlory".
> Załączam zaktualizowany plik Repozytorium.xlsx - na jego podstawie mają powstać nowe pliki JSON.
>
> Dodałem nową zakładkę "Mutacje".
> Znajduje się ona między "Specjalne Bonusy Frakcji" a "Implanty Astartes".
> Zakładka "Mutacje" ma być powiązana z checkboxem "Czy wyświetlić zakładki dotyczące tworzenia postaci?" (ma być widoczna tylko jak checkbox jest zaznaczony i ma mieć kolor jak inne z danej grupy).
>
> Ustal szerokości kolumn, żeby pasowały i były podobne jak w innych zakładkach.
> Zadbaj o wyrównanie itd.
>
> Zaplanuj aktualizację kodu aplikacji, żeby generator obsłużył nową zakładkę oraz, żeby się wyświetlała w prawidłowy sposób.
>
> Następnie przeanalizuj kod modułu GeneratorNPC.
> Chcę, żeby nowa zakładka "Mutacje" działała jak "moduły aktywne" np. "Psionika" czy "Modlitwy".
> "Mutacje" mają się znajdować pod "Modlitwy" na liście.
> Na wygenerowanej karcie ma się utworzyć nowa sekcja "Mutacje". Podobnie jak w przypadku pozostałych kart ma być checkbox "czy dodać pełen opis". Kliknięcie ma wyświetlić zawartość kolumny "Efekt".
>
> Pamiętaj w planie o aktualizacji dokumentacji.
>
> Przeprowadź analizę powyższej rozbudowy i przygotuj plan pracy (wszystko w jednym pliku w Analizy/ na gałęzi Main).

---

## 2. Zakres analizy

Przeanalizowano:

- załączony `Repozytorium.xlsx` — strukturę pakietu XLSX, arkusz „Mutacje” (nagłówki, wartości, formatowanie, rozmiar XML), kolejność arkuszy;
- `DataVault/xlsxCanonicalParser.js`, `DataVault/build_json.py`, `DataVault/app.js` (`buildDataJsonFromSheets`, `normaliseDB`, `initUI`, grupy zakładek, sortowanie, grupowanie kart na telefonie, formatowanie komórek) oraz `DataVault/style.css` (reguły kolumn, reguły globalne, kolory zakładek);
- `GeneratorNPC/index.html` (cały przepływ modułów aktywnych: HTML, tłumaczenia, stan, filtry list, tabele podglądu, ulubione, reset, generowanie karty, ładowanie danych) oraz `GeneratorNPC/style.css`;
- dokumentację: `DataVault/docs/*`, `GeneratorNPC/docs/*`, `GeneratorNPC/config/FirebaseREADME.md`, `shared/FirebaseREADME.md`, `DetaleLayout.md`, `Kolumny.md`.

Wykonano pomiary (rozdz. 15):

- uruchomienie `build_json.py` na załączonym pliku i na kopii z usuniętymi pustymi wierszami;
- uruchomienie ścieżki przeglądarkowej (`xlsxCanonicalParser.js` + `buildDataJsonFromSheets()` z `app.js`) w Chromium na obu plikach;
- porównanie wyników bajt po bajcie;
- wyrenderowanie makiety tabeli DataVault z prawdziwym `style.css` i proponowanymi regułami przy szerokościach 1920 px i 1366 px;
- symulację podziału sekcji karty GeneratorNPC na paski (`splitEntries`).

Poza zakresem: zmiany w kodzie, import do Firebase, folder `WebView_FCM_Cloudflare_Worker/`, pliki `AGENTS.md`.

---

## 3. Podsumowanie

| # | Wniosek | Skutek dla planu |
| --- | --- | --- |
| 1 | Arkusz „Mutacje” leży w pliku między „Specjalne Bonusy Frakcji” a „Implanty Astartes” i ma 34 rekordy w 7 kolumnach widocznych (`Rzut k66`, `Stopień Nasilenia Mutacji`, `Nazwa`, `Opis`, `Efekt`, `Podręcznik`, `Strona`) + techniczną `LP`. | Kolejność zakładek ustawia się sama (z `_meta.sheetOrder`). |
| 2 | Generator danych jest uniwersalny: każdy arkusz XLSX trafia do `data.json` bez konfiguracji. Python i przeglądarka dają **identyczny** plik (SHA-256 `846efd69…cdcdd3`). | **Brak zmian** w `build_json.py`, `xlsxCanonicalParser.js` i `buildDataJsonFromSheets()`. |
| 3 | ⚠️ Arkusz „Mutacje” zawiera w XML **1 048 535 wierszy** (34 z danymi, reszta to puste komórki E:F z formatowaniem). XML arkusza ma 107,8 MB. | **Krok obowiązkowy:** usunąć puste wiersze w Excelu przed generowaniem (rozdz. 5.4). Po oczyszczeniu: 0,6 MB pliku, ~1 s generowania, wynik identyczny. |
| 4 | Widoczność zakładki pod checkboxem „tworzenia postaci” i jej jasnozielony kolor wynikają z jednego zbioru `CHARACTER_CREATION_SHEETS` w `app.js`. | Dopisać `"Mutacje"` do zbioru — nic więcej w logice. |
| 5 | Bez reguł CSS kolumny „Mutacji” dostają szerokość automatyczną, odmienną od reszty zakładek. | Dodać blok reguł: `Rzut k66` 6ch/środek/bez łamania, `Stopień…` 22ch, `Nazwa` 26ch, `Opis` i `Efekt` po 56ch; `Podręcznik`/`Strona` z reguły globalnej (rozdz. 6.3). Zmierzone na makiecie. |
| 6 | Sortowanie, filtry, filtr globalny, porównywanie, zwijanie długich komórek, odnośniki `(str. …)` i znaczniki `{{RED}}`/`{{B}}` działają dla nowej zakładki automatycznie. | Brak zmian. |
| 7 | Na telefonie „Mutacje” nie zostaną pogrupowane (brak kolumny `Typ`/`Rodzaj`). | Opcjonalnie: grupowanie po `Stopień Nasilenia Mutacji` (rozdz. 6.5, decyzja D3). |
| 8 | Moduły „Psionika” i „Modlitwy” w GeneratorNPC są zbudowane z tych samych klocków; „Modlitwy” mają dokładnie kolumny `Nazwa` + `Efekt`, czyli to, czego oczekuje nowy moduł. | Nowy moduł `mutations` jako kopia wzorca `prayers` w ok. 15 miejscach `index.html` + 2 reguły CSS (rozdz. 7.2). |
| 9 | Karta: przy wyłączonym „pełnym opisie” sekcja „Mutacje” pokazuje same nazwy, przy włączonym — `Nazwa — Efekt: …`. To dokładnie zachowanie „Modlitw”. | Spełnia wymaganie „kliknięcie ma wyświetlić zawartość kolumny Efekt”. |
| 10 | Dwa rekordy to odsyłacze („Rzut na tabeli pomniejszych/ciężkich mutacji”, `Opis` i `Efekt` = `-`). | Rekomendacja: ukryć je tylko w GeneratorNPC (decyzja D2). |
| 11 | GeneratorNPC wymaga obecności każdego swojego arkusza. Po dopisaniu „Mutacji” jako wymaganych moduł przestanie działać, dopóki w Firebase są stare dane. | **Kolejność wdrożenia:** najpierw import nowych danych do Firebase, potem kod GeneratorNPC (rozdz. 7.7). |
| 12 | Ulubione zapisane przed zmianą wczytają się poprawnie (brak pola `mutationsIds` = brak mutacji). | Brak migracji. |

---

## 4. Zakładka „Mutacje” w nowym pliku XLSX

### 4.1 Struktura

| Kolumna | Rola | Długość wartości (min / śr. / maks., znaki) |
| --- | --- | --- |
| `LP` | kolejność techniczna, ukrywana w UI (`HIDDEN_COLUMNS`) | — |
| `Rzut k66` | zakres rzutu, np. `11-16`, `61+`, `64+` | 3 / 5 / 5 |
| `Stopień Nasilenia Mutacji` | `Subtelne mutacje` (9), `Pomniejsze mutacje` (8), `Ciężkie mutacje` (17) | 15 / 16 / 18 |
| `Nazwa` | nazwa mutacji | 4 / 13 / 35 |
| `Opis` | opis fabularny, często z dopiskiem `(Mutacja Wyrzutków)` i pustą linią | 1 / 315 / 666 |
| `Efekt` | efekt mechaniczny, w 7 rekordach z podtabelami w wielu liniach | 1 / 456 / 2776 |
| `Podręcznik` | zawsze `Podręcznik Główny` | 17 / 17 / 17 |
| `Strona` | 288–295 | 3 / 3 / 3 |

Pozycja w kolejności arkuszy: **12. z 39**, między `Specjalne Bonusy Frakcji` a `Implanty Astartes` — zgodnie z opisem w prompcie.

`columnOrder` wygenerowany dla arkusza: `["Rzut k66", "Stopień Nasilenia Mutacji", "Nazwa", "Opis", "Efekt", "Podręcznik", "Strona"]` (bez `LP`).

### 4.2 Formatowanie z Excela

Generator przenosi formatowanie do znaczników. W „Mutacjach” występują:

- `{{RED}}CHAOS{{/RED}}`, `{{RED}}PSIONIK{{/RED}}` — słowa kluczowe na czerwono (np. „Dodatkowe kończyny”, „Odmieniec”);
- `{{B}}…{{/B}}` — pogrubione nagłówki podtabel, np. `1: {{B}}Głowa{{/B}}`, `{{B}}Efekt{{/B}}: …`;
- odnośniki `[Podręcznik Główny (str. 201)]` — renderery DataVault i GeneratorNPC nadają im klasę `ref`.

Znaczniki pojawiają się w 18 rekordach (17 × `Efekt`, 1 × `Opis`). Żaden nie przechodzi przez złamanie linii — reguły `wrapWithMarkers` / `_wrap_with_markers` działają poprawnie. Żadna komórka nie dała pustej pary znaczników.

### 4.3 ⚠️ Milion pustych, sformatowanych wierszy

W pliku `xl/worksheets/sheet12.xml` (arkusz „Mutacje”):

- znacznik `<dimension ref="A1:H1048535"/>`,
- **1 048 535 elementów `<row>`** — wiersze 36–1 048 535 zawierają wyłącznie puste komórki `E` i `F` ze stylem `s="98"` (bez wartości),
- rozmiar XML: **107 821 656 B** (dla porównania cały `sharedStrings.xml` ma 1,6 MB, a największy inny arkusz 0,36 MB).

Najpewniej kolumny `E:F` („Opis”, „Efekt”) zostały sformatowane w całości (np. zawijanie tekstu na zaznaczeniu całych kolumn albo wklejenie formatu), a Excel zapisał formatowanie osobno w każdym wierszu.

Dane wyjściowe są poprawne, bo oba parsery pomijają wiersze bez wartości (`rowsToRecords` / `rows_to_records`). Problemem jest koszt — rozdz. 5.2.

### 4.4 Drobne uwagi do danych (do ewentualnej poprawy w Excelu)

| Rekord | Kolumna | Fragment | Uwaga |
| --- | --- | --- | --- |
| LP 23 „Głód kanibala” | `Efekt` | `…wszystkich Testów.Kara zostaje usunięta…` | brak spacji po kropce |
| LP 28 „Otyłość” | `Opis` | `…twój wzrost zwiększa sięo ok. 5%…` | sklejone „się o” |
| LP 13 „Brutal” | `Rzut k66` | `34-43` | jedyny zakres obejmujący dwie „dziesiątki” w tabeli pomniejszych mutacji (w subtelnych są osobno `34-36` i `41-43`); warto potwierdzić z podręcznikiem (str. 290) |

Nie wpływają one na działanie kodu.

---

## 5. DataVault — generator danych

### 5.1 Jak działa generowanie

Ścieżki, które muszą dawać ten sam wynik (`AGENTS.md` §14):

1. **Przeglądarka (tryb admina):** `index.html?admin=1` → „Generuj pliki danych” → `loadXlsxFromRepo()` → `XlsxCanonicalParser.loadXlsxMinimal()` (JSZip + DOMParser) → `buildDataJsonFromSheets()` → pobranie `data.json` i `firebase-import.json`.
2. **Wiersz poleceń:** `python DataVault/build_json.py Repozytorium.xlsx data.json`.
3. **Firebase:** `firebase-import.json` = `data.json` zapisany jako tekst w `datavault/live.dataJson`.

Obie implementacje iterują po **wszystkich** arkuszach z `xl/workbook.xml`, w kolejności z pliku, i specjalnie traktują wyłącznie: `Cechy`, `Stany`, `Stany Pojazdów`, `Cechy Pojazdów` (słowniki `_meta`) oraz `Bronie`, `Bronie Pojazdów`, `Pancerze`, `Pojazdy` (scalanie `Zasięg N` / `Cecha N`). „Mutacje” nie mają kolumn `Zasięg N` ani `Cecha N`, więc przechodzą bez przekształceń.

### 5.2 Test na załączonym pliku

| Ścieżka | Plik oryginalny (1 048 535 wierszy w „Mutacjach”) | Plik oczyszczony (35 wierszy) | Wynik |
| --- | --- | --- | --- |
| `build_json.py` (Python 3, kontener sesji) | **32–37 s**, szczyt pamięci **1 752 MB** | **0,7 s**, szczyt pamięci **40 MB** | identyczny w obu przypadkach |
| przeglądarka (Chromium, parser + `buildDataJsonFromSheets()` z `app.js`) | **51,6 s** samego parsowania, strona zablokowana przez cały ten czas, sterta JS po zakończeniu ok. 459 MB | **1,35 s**, sterta JS ok. 34 MB | identyczny z Pythonem |
| rozmiar pliku XLSX | 10 038 088 B | 578 564 B | — |

Wszystkie cztery wygenerowane pliki `data.json` są **bajtowo identyczne**: 1 376 258 B, SHA-256 `846efd6958a186a43473d5bba8e70c852eee56dd8d34a34dbf48a75cc5cdcdd3`. Zawierają 39 arkuszy, w tym `Mutacje` = 34 rekordy.

Na słabszym laptopie lub tablecie ścieżka przeglądarkowa z oryginalnym plikiem może trwać dłużej, przeglądarka może zaproponować zamknięcie „niereagującej strony”, a w skrajnym przypadku karta może się zawiesić z braku pamięci (DOMParser buduje drzewo z ok. 3 mln elementów).

### 5.3 Wniosek

**Generator nie wymaga zmian w kodzie.** Wymaga tylko oczyszczenia pliku XLSX. To podejście ma zerowe ryzyko dla zgodności trzech ścieżek, bo żaden parser nie jest ruszany.

### 5.4 Jak oczyścić plik w Excelu (krok obowiązkowy przed generowaniem)

1. Otwórz `Repozytorium.xlsx` i przejdź do zakładki **Mutacje**.
2. Kliknij szary numer wiersza **36** po lewej stronie (pierwszy wiersz pod danymi).
3. Naciśnij **Ctrl + Shift + Strzałka w dół** — zaznaczą się wszystkie wiersze od 36 do końca arkusza.
4. Kliknij zaznaczenie prawym przyciskiem i wybierz **Usuń** (nie „Wyczyść zawartość” — ta zostawia formatowanie, które jest przyczyną problemu).
5. Kliknij komórkę **A1** i zapisz plik (**Ctrl + S**).
6. Sprawdzenie: naciśnij **Ctrl + End** — kursor powinien trafić do komórki **H35**. Jeśli trafia dalej, zamknij plik, otwórz go ponownie i powtórz sprawdzenie. Rozmiar pliku powinien spaść z ok. 10 MB do ok. 0,6 MB.
7. Na przyszłość: formatowanie (np. zawijanie tekstu) nakładaj na zakres z danymi (np. `E2:F35`), a nie na całe kolumny.

Ten sam test **Ctrl + End** warto wykonać w każdej zakładce przed generowaniem — pozostałe arkusze mają najwyżej ok. 1 000 wierszy, więc obecnie nie stanowią problemu.

### 5.5 Opcjonalne utwardzenie parserów (osobne zadanie, nie jest potrzebne do „Mutacji”)

Gdyby taki plik miał się powtarzać, można rozważyć osobne zadanie:

- w `xlsxCanonicalParser.js`: usunięcie z tekstu XML elementów `<row>` bez `<v>`/`<is>` **przed** `DOMParser` (koszt jest w budowie drzewa DOM, nie w pętli po wierszach);
- w `build_json.py`: `ElementTree.iterparse` zamiast `fromstring` (strumieniowo, bez 1,7 GB w pamięci);
- ewentualnie ostrzeżenie w konsoli/statusie, gdy arkusz ma > 10 000 wierszy XML.

Każda taka zmiana dotyka plików objętych `AGENTS.md` §14 i wymaga porównania wyniku obu ścieżek na pełnym pliku (np. tą samą metodą co w rozdz. 15). Uwaga na przypadek brzegowy: wiersz nagłówka musi zostać zachowany nawet wtedy, gdy byłby pusty, inaczej zmieni się wynik dla takiego arkusza. Rekomendacja: **nie robić tego w ramach „Mutacji”**, wystarczy oczyszczenie pliku.

---

## 6. DataVault — wyświetlanie zakładki

### 6.1 Grupa „tworzenie postaci” i kolor zakładki

Mechanizm (`DataVault/app.js`):

- `CHARACTER_CREATION_SHEETS` (linie 331–341) → `CHARACTER_CREATION_SHEET_KEYS` (porównanie przez `canonKey`) → `isCharacterCreationSheet(name)`;
- `initUI()` (linie ok. 1415–1445) ukrywa zakładki grupy, gdy `uiState.showCharacterTabs` jest `false` (checkbox `toggleCharacterTabs`, „Czy wyświetlić zakładki dotyczące tworzenia postaci?”), a widocznym nadaje klasę `tab--character`;
- kolor daje `style.css`: `.tab.tab--character{color:var(--code); background:var(--character-bg); …}` i wariant `.active` (linie 1355–1358).

**Zmiana:** dopisać `"Mutacje"` do zbioru. Proponowany kształt (pozycja w zbiorze odpowiada kolejności w XLSX, choć o kolejności zakładek i tak decyduje `_meta.sheetOrder`):

```js
// --- Zakładki grupy „tworzenie postaci” / Character-creation tab group ---
// PL: Zakładki z tego zbioru są widoczne tylko po zaznaczeniu checkboxa toggleCharacterTabs
//     i dostają klasę tab--character (jasnozielony kolor). Kolejność na pasku zakładek pochodzi
//     z _meta.sheetOrder, czyli z kolejności arkuszy w Repozytorium.xlsx.
// EN: Tabs in this set are shown only when the toggleCharacterTabs checkbox is ticked and get the
//     tab--character class (light green colour). Their order on the tab bar comes from
//     _meta.sheetOrder, i.e. the sheet order in Repozytorium.xlsx.
const CHARACTER_CREATION_SHEETS = new Set([
  "Tabela Rozmiarów",
  "Gatunki",
  "Archetypy",
  "Premie z Przeszłości Frakcji",
  "Słowa Kluczowe Frakcji",
  "Pakiety Wyniesienia",
  "Specjalne Bonusy Frakcji",
  "Mutacje",
  "Implanty Astartes",
  "Zakony Pierwszego Powołania",
]);
```

Co robi: włącza „Mutacje” do grupy tworzenia postaci. Gdzie: `DataVault/app.js`. Dlaczego: to jedyne źródło przynależności do grupy — z niego wynikają jednocześnie widoczność pod checkboxem i kolor zakładki.

Zakładka **nie** trafia do `ADMIN_ONLY_SHEETS` — będzie widoczna także w zwykłym widoku użytkownika (po zaznaczeniu checkboxa), tak jak pozostałe zakładki tej grupy.

### 6.2 Kolejność zakładek

`getSheetOrder()` używa `_meta.sheetOrder`, a ten pochodzi z kolejności arkuszy w XLSX. Po imporcie nowych danych pasek zakładek pokaże: `… SPECJALNE BONUSY FRAKCJI · MUTACJE · IMPLANTY ASTARTES …`. Nie trzeba nic zmieniać.

### 6.3 Szerokości i wyrównanie kolumn

Wzorce z innych zakładek (z `DataVault/style.css`):

- `Rzut k66` w `Trafienia Krytyczne`, `Groza Osnowy`, `Uszkodzenia Pojazdów`: `min-width:6ch; text-align:center; white-space:nowrap`;
- `Nazwa`: 26ch w niemal wszystkich zakładkach;
- długie opisy: 56ch (`Opis` w `Zakony Pierwszego Powołania`, `Specjalne Bonusy Frakcji`, `Notatki`; `Opis` i `Efekt` jednocześnie w `Obrzędy`; `Efekt` w `Talenty`, `Modlitwy`, `Psionika`);
- kolumny kategorii („Typ”, „Rodzaj”): 14–22ch;
- `Podręcznik` 17ch i `Strona` 6ch — wymuszone globalnie dla wszystkich zakładek (linie 1203–1219).

**Propozycja:**

| Kolumna | min-width | Wyrównanie | Łamanie | Uzasadnienie |
| --- | --- | --- | --- | --- |
| `Rzut k66` | 6ch | środek | bez łamania (`nowrap`) | identycznie jak pozostałe tabele k66 |
| `Stopień Nasilenia Mutacji` | **22ch** | lewo | standard | najdłuższa wartość „Pomniejsze mutacje” mieści się w 1 linii, nagłówek w 2 liniach; przy 20ch nagłówek łamał się na 3 linie (zmierzone) |
| `Nazwa` | 26ch | lewo | standard | standard modułu |
| `Opis` | 56ch | lewo | standard | jak `Obrzędy` |
| `Efekt` | 56ch | lewo | standard | najważniejsza i najdłuższa kolumna (śr. 456, maks. 2776 znaków); długie komórki zwijają się powyżej 9 linii |
| `Podręcznik` | 17ch | lewo | standard | reguła globalna — **bez własnej reguły** |
| `Strona` | 6ch | lewo | standard | reguła globalna — **bez własnej reguły** (tak samo wygląda dziś w `Archetypy`, `Pakiety Wyniesienia`, `Obrzędy`) |

Pomiar na makiecie (prawdziwy `style.css` + reguły poniżej, Chromium):

| Okno | Szerokość tabeli | Dostępne miejsce | Przewijanie w bok |
| --- | --- | --- | --- |
| 1920 × 1080 | 1694 px | 1702 px | **nie** — tabela mieści się w całości |
| 1366 × 768 | ok. 1586 px | 1148 px | tak — tak samo jak dziś `Specjalne Bonusy Frakcji` (1292 px), `Obrzędy` (1825 px) i `Archetypy` (2398 px) przy tej szerokości |

Proponowany blok CSS — wstawić w `DataVault/style.css` bezpośrednio po bloku `/* Specjalne Bonusy Frakcji */` (kończy się ok. linii 945), przed `/* Cechy / Stany / Słowa kluczowe */`:

```css
/* Mutacje — szerokości i wyrównania kolumn zakładki / Mutations — tab column widths and alignments */
/* Rzut k66: wąska, wyśrodkowana, bez łamania — jak w Trafieniach Krytycznych i Grozie Osnowy
   k66 roll: narrow, centred, no wrapping — as in Critical Hits and Perils of the Warp */
.tableWrap table[data-sheet="Mutacje"] th[data-col="Rzut k66"],
.tableWrap table[data-sheet="Mutacje"] td[data-col="Rzut k66"]{min-width:6ch; text-align:center; white-space:nowrap}
/* Stopień: 22ch mieści „Pomniejsze mutacje” w jednej linii, a nagłówek w dwóch
   Severity: 22ch fits "Pomniejsze mutacje" on one line and the header on two */
.tableWrap table[data-sheet="Mutacje"] th[data-col="Stopień Nasilenia Mutacji"],
.tableWrap table[data-sheet="Mutacje"] td[data-col="Stopień Nasilenia Mutacji"]{min-width:22ch; text-align:left}
.tableWrap table[data-sheet="Mutacje"] th[data-col="Nazwa"],
.tableWrap table[data-sheet="Mutacje"] td[data-col="Nazwa"]{min-width:26ch; text-align:left}
/* Opis i Efekt: standardowa szerokość długich opisów, jak w zakładce Obrzędy
   Description and Effect: the standard width for long texts, as in the Rites tab */
.tableWrap table[data-sheet="Mutacje"] th[data-col="Opis"],
.tableWrap table[data-sheet="Mutacje"] td[data-col="Opis"],
.tableWrap table[data-sheet="Mutacje"] th[data-col="Efekt"],
.tableWrap table[data-sheet="Mutacje"] td[data-col="Efekt"]{min-width:56ch; text-align:left}
/* Podręcznik i Strona nie mają tu reguł: działa globalne wymuszenie (17ch / 6ch, do lewej)
   Podręcznik and Strona have no rules here: the global override applies (17ch / 6ch, left) */
```

**Uwaga o wyrównaniu `Strona`:** gdyby `Strona` w „Mutacjach” miała być wyśrodkowana (jak w `Notatki` i zakładkach pojazdów), reguła musi stać **za** blokiem `/* Globalne wymuszenie … */` (po linii 1219). Reguła postawiona wcześniej nie działa, bo ma tę samą specyficzność co reguła globalna, a późniejsza wygrywa — zmierzono to na makiecie dla `Obrzędy` i `Archetypy` (rozdz. 13). Rekomendacja: zostawić lewe wyrównanie z reguły globalnej, spójne z resztą zakładek grupy tworzenia postaci.

Zrzut makiety (1920 px) potwierdził: wyśrodkowane zakresy k66, `Stopień` w jednej linii, równe kolumny `Opis`/`Efekt`, `Podręcznik Główny` w dwóch liniach jak w innych zakładkach.

### 6.4 Co zadziała samo, bez zmian

| Funkcja | Dlaczego działa |
| --- | --- |
| Domyślne sortowanie | `getDefaultSort()` sortuje po kolumnie `LP` → kolejność: subtelne (11-16…61+), pomniejsze, ciężkie — dokładnie jak w tabeli z podręcznika. |
| Filtry kolumnowe i listowe | Budowane z `columnOrder`; filtr listowy `Stopień Nasilenia Mutacji` pokaże 3 wartości. |
| Filtr globalny | `passesFilters()` przeszukuje wszystkie widoczne kolumny. |
| Porównywanie, zaznaczenia | Niezależne od arkusza. |
| Zwijanie > 9 linii | `renderRow()` dla każdej komórki — „Aberracja”, „Dodatkowe kończyny” będą zwinięte z podpowiedzią rozwinięcia. |
| Formatowanie | `formatTextHTML()` obsługuje `{{RED}}`, `{{B}}`, odnośniki `(str. …)`. |
| Widok Domyślny / Pełen Widok | Brak wpisu w `DEFAULT_VIEW_CONFIG` = brak domyślnych filtrów — wszystkie 34 rekordy widoczne. |
| Telefon (karty) | Etykiety z `data-col` działają dla każdej zakładki; `Rzut k66` zachowuje `nowrap`. |
| `sessionStorage` | Nowa zakładka dostaje stan domyślny przy pierwszym otwarciu (`restoreSheetView`). |

### 6.5 Opcjonalnie: grupowanie kart na telefonie

`groupingColumnFor()` (linia 2318) wybiera kolumnę z `DEFAULT_VIEW_CONFIG`, potem `Typ`, potem `Rodzaj`. „Mutacje” nie mają żadnej z nich, więc na telefonie będą płaską listą 34 kart. Naturalną kategorią jest `Stopień Nasilenia Mutacji`.

Dwa sposoby:

- **(a) wpis w `DEFAULT_VIEW_CONFIG`** z trzema wartościami — działa, ale widok domyślny ukryłby każdą przyszłą wartość spoza listy. **Odradzane.**
- **(b) mała mapa wyjątków** — rekomendowane, jeśli grupowanie ma powstać:

```js
// --- Kolumny grupujące dla zakładek bez kolumny „Typ” i „Rodzaj” / Grouping columns for sheets without a "Typ" or "Rodzaj" column ---
// PL: Wskazuje kolumnę, po której układ kart na telefonie grupuje wiersze, gdy zakładka nie ma
//     wpisu w DEFAULT_VIEW_CONFIG ani kolumny Typ/Rodzaj. Nie zmienia widoku domyślnego ani filtrów.
// EN: Names the column the phone card layout groups rows by when a sheet has no DEFAULT_VIEW_CONFIG
//     entry and no Typ/Rodzaj column. It changes neither the default view nor the filters.
const GROUPING_COLUMN_OVERRIDES = { "Mutacje": "Stopień Nasilenia Mutacji" };

function groupingColumnFor(sheetName, cols){
  const config = getDefaultConfigForSheet(sheetName);
  if (config){
    const configured = cols.find(col => canonKey(col) in config);
    if (configured) return configured;
  }
  const override = Object.entries(GROUPING_COLUMN_OVERRIDES)
    .find(([sheet]) => canonKey(sheet) === canonKey(sheetName))?.[1];
  if (override){
    const col = cols.find(c => canonKey(c) === canonKey(override));
    if (col) return col;
  }
  return cols.find(col => canonKey(col) === canonKey("Typ"))
      || cols.find(col => canonKey(col) === canonKey("Rodzaj"))
      || null;
}
```

Grupy powstają po sortowaniu, więc ich kolejność to: Subtelne → Pomniejsze → Ciężkie. 34 wiersze > `GROUPING_MIN_ROWS` (12), więc grupowanie się włączy. Decyzja D3.

### 6.6 Czego celowo nie zmieniać

- `KEYWORD_SHEETS_COMMA_NEUTRAL`, `KEYWORD_SHEET_ALL_RED` — „Mutacje” nie mają kolumny `Słowa Kluczowe`.
- `ADMIN_ONLY_SHEETS` — zakładka ma być dostępna w trybie użytkownika.
- `DEFAULT_VIEW_CONFIG` — brak powodu do domyślnego filtrowania.
- `transformSheet()` / `normaliseDB()` — „Mutacje” nie wymagają scalania kolumn.

---

## 7. GeneratorNPC — nowy moduł „Mutacje”

### 7.1 Wzorzec: jak działają „Psionika” i „Modlitwy”

Każdy moduł dodatkowy składa się z tych samych klocków, powiązanych kluczem (`psionics`, `prayers`):

1. checkbox `data-module-toggle="<klucz>"` w panelu „Moduły aktywne”;
2. karta `div.card[data-module-section="<klucz>"]` z checkboxem `#<klucz>-full-details` („Czy dodać pełen opis?”), polem filtra `#<klucz>-filter`, listą `select#<klucz>[multiple]` i tabelą podglądu `table.data-table[data-sheet="<Arkusz>"]`;
3. tłumaczenia PL/EN (`labels`, `cardSections`, `messages`);
4. kolekcja `state.<klucz>`, ładowana z wymaganego arkusza przez `getRequiredCollection()`;
5. obiekt filtra listy w `listFilters` i wpis w `MODULE_LIST_KEYS`;
6. tablica kolumn podglądu (`prayersColumns = ["Nazwa", "Efekt"]`) i funkcja `render<Klucz>Table()`;
7. obsługa w ulubionych (`modules.<klucz>Ids`, `toggles.fullDetails.<klucz>`), w Resecie i w generowaniu karty (`buildModuleEntries()` → `moduleEntries`).

„Modlitwy” mają dokładnie te kolumny, których wymaga nowy moduł (`Nazwa` + `Efekt`), dlatego są wzorcem 1:1. Proponowany klucz modułu: **`mutations`**, arkusz: **`Mutacje`**.

### 7.2 Punkty styku w `GeneratorNPC/index.html`

| # | Miejsce (stan na `4295ed5`) | Co dodać dla `mutations` |
| --- | --- | --- |
| 1 | Panel „Moduły aktywne”, po checkboxie `prayers` (linie 94–98) | `<label class="checkbox"><input type="checkbox" data-module-toggle="mutations" /><span data-i18n="moduleMutations">Mutacje — lista mutacji.</span></label>` — domyślnie **niezaznaczony**, jak Psionika i Modlitwy |
| 2 | Obszar roboczy, po karcie `prayers` (linie 354–382) | karta `data-module-section="mutations"`: nagłówek `Wybór Mutacji`, `#mutations-full-details`, `#mutations-filter`, `select#mutations[multiple][size=15]`, `table.data-table[data-sheet="Mutacje"]` z nagłówkami `Nazwa` / `Efekt` i `tbody#mutations-table-body` |
| 3 | Referencje DOM (linie 446, 454, 473) | `mutationsSelect`, `mutationsTableBody`, `mutationsFullDetailsToggle` |
| 4 | `translations.pl.labels` (ok. 512, 573–577) | `moduleMutations`, `mutationsSectionTitle`, `mutationsLabel`, `mutationsDetailsToggle`, `mutationsHeaderName`, `mutationsHeaderEffect` |
| 5 | `translations.pl.cardSections` (ok. 616) | `mutations: "Mutacje"` |
| 6 | `translations.pl.messages` (ok. 630, 646) | `selectMutations: "Wybierz mutacje..."`; `loadSummary` + `, Mutacje ({mutations})` |
| 7 | `translations.en.*` (ok. 682, 743–747, 786, 800, 816) | odpowiedniki EN (tabela w 7.3) |
| 8 | `applyLanguage()` (ok. 868, 899) | `updatePlaceholder(mutationsSelect, t.messages.selectMutations)`; `mutations: state.mutations.length` w `loadSummary` |
| 9 | `state` (ok. 973) | `mutations: []` |
| 10 | `listFilters` + `MODULE_LIST_KEYS` (1584–1586) | `mutations: createListFilter("mutations", { getRecords: () => state.mutations, placeholderKey: "selectMutations" })`; dopisać `"mutations"` na końcu `MODULE_LIST_KEYS` |
| 11 | Kolumny i render (2110, 2189–2199) | `const mutationsColumns = ["Nazwa", "Efekt"];` + `renderMutationsTable()` |
| 12 | `buildFavoritePayload()` (2548, 2563) | `mutationsIds: getSelectedIndices(mutationsSelect)`; `fullDetails.mutations: mutationsFullDetailsToggle.checked` |
| 13 | `applyFavorite()` (2644, 2652, 2660) | `refreshModuleOptions("mutations", { selectedIndices: payload.modules?.mutationsIds \|\| [] })`; przywrócenie checkboxa pełnego opisu; `renderMutationsTable()` |
| 14 | Zdarzenia i Reset (3229, 3264–3292) | `mutationsSelect` → `change` → `renderMutationsTable`; w Resecie: odznaczenie opcji, `defaultChecked` checkboxa, `renderMutationsTable()` |
| 15 | Generowanie karty (3354, 3385–3393) | `selectedMutations`; nowy wpis w `moduleEntries` **po** `prayers` |
| 16 | `loadPrivateGeneratorData()` (3427, 3432) | `state.mutations = …getRequiredCollection(data, "Mutacje")…`; `renderMutationsTable()` |
| 17 | Komentarze z liczbami list (870–872, 1541–1548) | „osiem pól filtra” → „dziewięć”, „siedem list modułów” → „osiem” (PL i EN) |

`GeneratorNPC/style.css` — po regułach `Modlitwy` (linie 604–610):

```css
/* Mutacje — szerokości kolumn podglądu, takie same jak w Modlitwach / Mutations — preview column widths, the same as Prayers */
.data-table[data-sheet="Mutacje"] .min-col-nazwa {
  min-width: 28ch;
}

.data-table[data-sheet="Mutacje"] .min-col-efekt {
  min-width: 54ch;
}
```

`getColumnClass("Nazwa")` = `min-col-nazwa`, `getColumnClass("Efekt")` = `min-col-efekt` — klasy są nadawane automatycznie przez `renderOrderedTable`.

### 7.3 Teksty interfejsu (PL / EN)

| Klucz | PL | EN |
| --- | --- | --- |
| `labels.moduleMutations` | Mutacje — lista mutacji. | Mutations — mutation list. |
| `labels.mutationsSectionTitle` | Wybór Mutacji | Mutation selection |
| `labels.mutationsLabel` | Mutacje (wielokrotny wybór) | Mutations (multi-select) |
| `labels.mutationsDetailsToggle` | Czy dodać pełen opis? | Include full description? |
| `labels.mutationsHeaderName` | Nazwa | Name |
| `labels.mutationsHeaderEffect` | Efekt | Effect |
| `cardSections.mutations` | Mutacje | Mutations |
| `messages.selectMutations` | Wybierz mutacje... | Select mutations... |
| `messages.loadSummary` (dopisek) | `, Mutacje ({mutations})` | `, Mutations ({mutations})` |

Komunikat pustej tabeli w `renderMutationsTable()`: „Wybierz mutację, aby zobaczyć parametry.” — tak jak w pozostałych modułach jest on wpisany na stałe po polsku (to istniejący wzorzec, nie nowa niespójność).

### 7.4 Kluczowe fragmenty kodu

Ładowanie danych (z rekomendowanym w D2 pominięciem odsyłaczy):

```js
// --- Mutacje: wymagany arkusz DataVault / Mutations: a required DataVault sheet ---
// PL: Kolejność jak w tabeli z podręcznika — sortRecords() najpierw porównuje LP. Wiersze-odsyłacze
//     („Rzut na tabeli pomniejszych/ciężkich mutacji”) nie mają efektu (Efekt = "-"), więc nie trafiają
//     na listę — na karcie NPC nie niosłyby żadnej informacji.
// EN: Order as in the rulebook table — sortRecords() compares LP first. Redirect rows ("Rzut na tabeli
//     pomniejszych/ciężkich mutacji") have no effect (Efekt = "-"), so they are left off the list —
//     on an NPC card they would carry no information.
state.mutations = sortByName(getRequiredCollection(data, "Mutacje"))
  .filter((record) => hasMeaningfulValue(getRecordValue(record, "Efekt")));
```

Tabela podglądu:

```js
// --- Tabela podglądu wybranych mutacji / Preview table of the selected mutations ---
const renderMutationsTable = () => {
  const selected = getSelectedIndices(mutationsSelect);
  renderOrderedTable({
    tableBody: mutationsTableBody,
    records: state.mutations,
    selectedIndices: selected,
    columns: mutationsColumns,
    sheetName: "Mutacje",
    emptyMessage: "Wybierz mutację, aby zobaczyć parametry.",
  });
};
```

Sekcja karty (dopisana na końcu `moduleEntries`, czyli pod „Modlitwami”):

```js
// Sekcja „Mutacje” na karcie: same nazwy albo „Nazwa — Efekt: …” po zaznaczeniu pełnego opisu
// The "Mutations" card section: names only, or "Name — Efekt: …" when the full description is ticked
{
  label: sectionLabels.mutations,
  value: buildModuleEntries(selectedMutations, mutationsColumns, {
    includeFull: mutationsFullDetailsToggle.checked,
  }),
},
```

### 7.5 Jak będzie wyglądać sekcja „Mutacje” na karcie

- Sekcja pojawia się tylko wtedy, gdy wybrano co najmniej jedną mutację (`hasMeaningfulValue(entry.value)`), pod sekcją „Modlitwy”, a nad „Notatkami”.
- **Pełny opis wyłączony:** każda wybrana mutacja to osobny pasek z nazwą (paski naprzemiennie podbarwione).
- **Pełny opis włączony:** `Nazwa — Efekt: <treść kolumny Efekt>` z zachowanym formatowaniem (czerwone słowa kluczowe, pogrubienia, odnośniki).
- Podział na paski robi `splitEntries()`: linia zaczynająca się od wzorca `…: ` (do 40 znaków), `… —` albo `[n]` rozpoczyna nowy pasek. To ten sam mechanizm co dziś w Psionice (17 takich linii) i Talentach (6). W „Mutacjach” dotyczy to podtabel w 6 rekordach — symulacja:

| Mutacja | Liczba pasków przy pełnym opisie | Przykładowe paski |
| --- | --- | --- |
| Aberracja | 13 | `Aberracja — Efekt: …`, `1: Equidae (Koń) …`, `Efekt: Otrzymujesz premię …` |
| Dodatkowe kończyny | 12 | `Dodatkowe kończyny — Efekt: …`, `1: Głowa …`, `Efekt: Raz na sesję …` |
| Wizje | 5 | `Wizje — Efekt: …`, `1: Mroczna przyszłość: …`, `2-3: Fałszywe proroctwo: …` |
| Żrąca żółć | 5 | `… — Efekt: …`, `Obrażenia: 8`, `DK: 1`, `Zasięg: 2`, `Cechy: …` |
| Rogi, kolce, kły i pazury | 3 | `… — Efekt: …`, `Obrażenia: (S)+5`, `DK: Ranga` |
| Człowiek-ryba | 3 | `… — Efekt: …`, `Koszt: 3`, `Dostępność: 1` |

Efekt: podtabele są czytelnie rozbite na wiersze, ale naprzemienne tło może sugerować, że to osobne pozycje. Zachowanie jest spójne z pozostałymi modułami; ewentualna zmiana („jeden rekord = jeden pasek”) dotyczyłaby wszystkich modułów karty i jest poza zakresem (rozdz. 13).

### 7.6 Ulubione — zgodność wstecz

- Ulubione zapisane przed zmianą nie mają `modules.mutationsIds` → `applyFavorite()` przekaże `[]`, czyli brak wybranych mutacji (bieżący wybór mutacji zostanie wyczyszczony — poprawnie).
- Brak klucza `mutations` w `toggles.moduleVisibility` → checkbox modułu zostaje w bieżącym stanie (istniejąca logika `hasOwnProperty`).
- Brak `toggles.fullDetails.mutations` → `Boolean(undefined)` = `false`.
- Nowe ulubione zapisują `mutationsIds` jako **indeksy** w `state.mutations` — tak jak pozostałe moduły (znane ograniczenie opisane w dokumentacji: zmiana kolejności lub zawartości arkusza może przesunąć zapisany wybór). Filtr odsyłaczy z D2 jest deterministyczny, więc indeksy są stabilne, dopóki arkusz się nie zmieni.
- Model dokumentu Firestore `generatorNpc/favorites` nie wymaga zmian (payload jest dowolnym obiektem).

### 7.7 Wymagany arkusz i kolejność wdrożenia

`getRequiredCollection()` rzuca `GENERATORNPC_REQUIRED_SHEET_MISSING:Mutacje`, gdy arkusza nie ma w danych z Firebase. Skutki dla kolejności:

| Stan | DataVault | GeneratorNPC |
| --- | --- | --- |
| Stary kod + nowe dane | „MUTACJE” widoczna jako zwykła zakładka (bez koloru grupy, zawsze widoczna) | działa jak dotąd (nadmiarowy arkusz jest ignorowany) |
| Nowy kod DataVault + stare dane | bez zmian (brak arkusza = brak zakładki) | — |
| Nowy kod GeneratorNPC + stare dane | — | **nie działa**: komunikat „W danych DataVault brakuje wymaganego arkusza GeneratorNPC: Mutacje.” |

**Bezpieczna kolejność:** (1) oczyszczenie XLSX → (2) wygenerowanie i import `firebase-import.json` → (3) wdrożenie kodu. Kod DataVault może iść wcześniej bez szkody; kod GeneratorNPC **dopiero po** imporcie. Najprościej: jeden commit z kodem obu modułów i dokumentacją, wypchnięty po imporcie danych. Alternatywa (decyzja D4): traktować „Mutacje” jako arkusz opcjonalny — wtedy kolejność nie ma znaczenia, ale moduł odbiega od wzorca pozostałych.

### 7.8 Zachowanie istniejące, które przejmie nowy moduł

Generowanie karty nie sprawdza checkboxów „Moduły aktywne” — bierze zaznaczone pozycje ze wszystkich list, także z ukrytych kart. Instrukcja użytkownika GeneratorNPC twierdzi zaś, że „wyłączony moduł … nie jest brany pod uwagę przy generowaniu karty”. „Mutacje” powielą obecne zachowanie kodu. Rozbieżność opisana w rozdz. 13 jako osobna decyzja; w dokumentacji „Mutacji” należy opisać faktyczne zachowanie.

---

## 8. Dokumentacja do aktualizacji

Zgodnie z `AGENTS.md` §1–§8 i §15 (pełne wersje PL i EN, bez wpisów w stylu changelogu, opis stanu po zmianie).

### 8.1 DataVault

| Plik | Sekcje (PL i EN) | Co dopisać |
| --- | --- | --- |
| `DataVault/docs/Documentation.md` | „Struktura plików modułu” (opis `style.css`) | wzmianka o konfiguracji kolumn zakładki `Mutacje` |
| | „Grupy zakładek → Tworzenie postaci” / „Character creation” | `Mutacje` między `Specjalne Bonusy Frakcji` a `Implanty Astartes` |
| | „Generowanie danych z XLSX” / „Kanoniczny parser XLSX” | parser czyta każdy element `<row>`, także pusty sformatowany; arkusz z ~1 mln takich wierszy wydłuża generowanie do ~1 min i zużywa dużo pamięci; procedura kontroli Ctrl + End |
| | „Grupowanie kart w układzie telefonu” | tylko przy D3: `GROUPING_COLUMN_OVERRIDES` i kolejność sprawdzania kolumn |
| | „Testy kontrolne” / „Control tests” | wiersze testów z rozdz. 10.1 |
| `DataVault/docs/README.md` | „Zakładki” / „Tabs” oraz „Przełączniki grup zakładek” / odpowiednik EN | lista zakładek grupy tworzenia postaci z `Mutacje`; zakładka pojawia się po zaznaczeniu checkboxa i ma jasnozielony kolor; co zawiera i jak ją czytać (k66, stopień nasilenia) |
| | „Generowanie plików danych — tylko admin” / EN | przed generowaniem sprawdź Ctrl + End w każdej zakładce; co oznacza długie oczekiwanie i co wtedy zrobić |
| | „Na telefonie tabela wygląda inaczej” / EN | tylko przy D3: karty „Mutacji” pogrupowane wg stopnia nasilenia |
| `DataVault/docs/ZasadyFormatowania.md` | — | brak zmian (Mutacje używają standardowego formatowania) |

### 8.2 GeneratorNPC

| Plik | Sekcje (PL i EN) | Co dopisać |
| --- | --- | --- |
| `GeneratorNPC/docs/Documentation.md` | „Cel modułu” | dodawanie mutacji |
| | „Źródło danych runtime” → „Wymagane arkusze” | `Mutacje` |
| | „Kolekcje danych w stanie aplikacji” | `state.mutations` ← `Mutacje`, sortowanie po `LP`/nazwie, pominięcie odsyłaczy (jeśli D2) |
| | „Workspace”, „Moduły aktywne” (tabela toggle) | `Wybór Mutacji`; toggle `mutations` |
| | „Filtry nazw list wyboru” | klucz `mutations`; `listFilters` = dziewięć obiektów; `MODULE_LIST_KEYS` = osiem kluczy |
| | „Reguły `min-col-*`” | reguły `Mutacje` (28ch / 54ch) |
| | „Moduły dodatkowe” | mutacje; pełny opis = kolumna `Efekt` |
| | „Model `payload` ulubionego” | `modules.mutationsIds`, `toggles.fullDetails.mutations`; zgodność ze starymi wpisami |
| | „Generowanie karty do druku” | krok zbierania mutacji, sekcja `Mutacje` pod `Modlitwy` |
| | „i18n” | nowe klucze z rozdz. 7.3 |
| | „Fallbacki i błędy” | brak arkusza `Mutacje` w danych |
| | „Procedura odtworzenia”, „Testy kontrolne” | uzupełnienie o moduł i testy z rozdz. 10.2 |
| `GeneratorNPC/docs/README.md` | „Źródło danych”, „Obszar roboczy”, „Gdzie jest pole wyszukiwania” | `Mutacje` / `Wybór Mutacji` / lista `Mutacje` |
| | „Moduły aktywne” (tabela) | wiersz „Mutacje — dodaje mutacje jako osobną sekcję karty” |
| | „Augumentacje, ekwipunek, talenty, psionika i modlitwy” | rozszerzyć o mutacje; co robi „Czy dodać pełen opis?” (nazwa vs nazwa + efekt) |
| | „Generowanie karty”, „Typowe komunikaty i co zrobić” | sekcja „Mutacje” na karcie; komunikat o brakującym arkuszu `Mutacje` (= trzeba zaimportować nowe dane) |
| `GeneratorNPC/config/FirebaseREADME.md` | listy wymaganych arkuszy (PL ok. 52–61, test ok. 371; EN ok. 452–461) | `Mutacje` |

### 8.3 Pliki wspólne

| Plik | Co dopisać |
| --- | --- |
| `DetaleLayout.md` | DataVault §2 (linia 329): `Mutacje` na liście zakładek tworzenia postaci; DataVault §5: nowa podsekcja „Mutacje” z szerokościami z rozdz. 6.3; GeneratorNPC §5: `Mutacje` na liście filtrów nazw (linia 622) i szerokości podglądu 28ch / 54ch |
| `Kolumny.md` | sekcja `## Mutacje` po `## Specjalne Bonusy Frakcji`, w formacie pozostałych tabel (kolumna / min-width / max-width / wyrównanie / łamanie) |
| `shared/FirebaseREADME.md` | linie 229 i 690: `Mutacje` na liście arkuszy wymaganych przez GeneratorNPC |

Komentarze w kodzie: każdy nowy blok w `app.js`, `style.css`, `index.html` z komentarzem PL + EN (§7). Komentarze z liczbami list w GeneratorNPC muszą zostać poprawione razem z kodem.

---

## 9. Plan pracy

| Krok | Kto | Czynność | Pliki | Weryfikacja |
| --- | --- | --- | --- | --- |
| 0 | użytkownik | Oczyścić arkusz „Mutacje” (rozdz. 5.4), opcjonalnie poprawić literówki z 4.4. | `Repozytorium.xlsx` (lokalnie) | Ctrl + End → H35; plik ~0,6 MB |
| 1 | agent | DataVault: `"Mutacje"` w `CHARACTER_CREATION_SHEETS` + komentarz PL/EN. | `DataVault/app.js` | zakładka w grupie, kolor, widoczność |
| 2 | agent | DataVault: blok CSS kolumn „Mutacji”. | `DataVault/style.css` | makieta / podgląd 1920 i 1366 px |
| 3 | agent | (D3) `GROUPING_COLUMN_OVERRIDES` w `groupingColumnFor()`. | `DataVault/app.js` | telefon: 3 grupy |
| 4 | agent | GeneratorNPC: punkty 1–17 z rozdz. 7.2 + filtr odsyłaczy (D2). | `GeneratorNPC/index.html` | testy 10.2 |
| 5 | agent | GeneratorNPC: reguły `min-col-*` dla `Mutacje`. | `GeneratorNPC/style.css` | szerokości podglądu |
| 6 | agent | Dokumentacja z rozdz. 8 (PL + EN). | 8 plików `.md` | przegląd: brak opisów nieaktualnych |
| 7 | agent | Kontrola zgodności generatorów na oczyszczonym pliku: `build_json.py` vs przeglądarka. | — (bez zmian w generatorze) | identyczne SHA-256 |
| 8 | użytkownik | Tryb admina DataVault → „Generuj pliki danych” → import `firebase-import.json` w root Realtime Database. | Firebase Console | DataVault pokazuje „MUTACJE” |
| 9 | agent / użytkownik | Wdrożenie kodu (commit na `main`) **po** kroku 8. | — | testy 10.1 i 10.2 na produkcji |

Szacunek objętości zmian: DataVault ok. 15–35 linii (zależnie od D3), GeneratorNPC ok. 90–110 linii HTML/JS + ok. 8 linii CSS, dokumentacja — kilkanaście sekcji w 8 plikach.

---

## 10. Testy akceptacyjne

### 10.1 DataVault

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Zgodność generatorów | Na oczyszczonym pliku: `python DataVault/build_json.py Repozytorium.xlsx data-python.json` oraz „Generuj pliki danych” w adminie. | Pliki identyczne co do bajtu; `sheets.Mutacje` ma 34 rekordy; `_meta.sheetOrder[11] === "Mutacje"`. |
| Czas generowania | „Generuj pliki danych” na oczyszczonym pliku. | Pobieranie plików startuje po kilku sekundach, strona nie zamarza. |
| Widoczność | Checkbox „tworzenia postaci” odznaczony / zaznaczony. | Zakładka „MUTACJE” ukryta / widoczna. |
| Kolor | Zaznacz checkbox, kliknij zakładkę. | Kolor jak „Specjalne Bonusy Frakcji” i „Implanty Astartes” (zwykły i aktywny). |
| Kolejność | Zaznacz checkbox. | `… SPECJALNE BONUSY FRAKCJI · MUTACJE · IMPLANTY ASTARTES …` |
| Kolumny | Otwórz zakładkę na 1920 px. | 7 kolumn bez `LP`; k66 wyśrodkowany w jednej linii; `Stopień` w jednej linii; tabela bez przewijania w bok. |
| Sortowanie | Otwórz zakładkę. | Kolejność LP: subtelne 11-16 … 61+, pomniejsze, ciężkie 11-12 … 64+. |
| Filtr listowy | Filtr kolumny `Stopień Nasilenia Mutacji`. | 3 wartości; wybór zawęża tabelę. |
| Formatowanie | Wiersz „Dodatkowe kończyny”. | `CHAOS` na czerwono, `Głowa`, `Efekt` pogrubione; komórka zwinięta z możliwością rozwinięcia. |
| Telefon | Szerokość < 720 px. | Karty z etykietami kolumn; przy D3 — 3 grupy w kolejności nasilenia. |
| Regresja | Pozostałe zakładki grupy i reszta modułu. | Bez zmian. |

### 10.2 GeneratorNPC

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Start z nowymi danymi | Otwórz moduł po imporcie. | Status „Załadowano: … Modlitwy (13), Mutacje (32).” (34 przy rezygnacji z D2). |
| Pozycja w panelu | „Moduły aktywne”. | Checkbox „Mutacje — lista mutacji.” bezpośrednio pod „Modlitwy”, domyślnie odznaczony. |
| Karta wyboru | Zaznacz checkbox modułu. | Karta „Wybór Mutacji” pod „Wybór Modlitw”, z polem filtra, listą i checkboxem „Czy dodać pełen opis?”. |
| Lista | Rozwiń listę. | Mutacje w kolejności LP; brak „Rzut na tabeli …” (przy D2). |
| Filtr | Wpisz `skora`. | „Jedwabna skóra”, „Zwierzęca skóra”; etykieta listy niebieska. |
| Podgląd | Wybierz 2 mutacje. | Tabela `Nazwa` / `Efekt`, długie efekty zwinięte powyżej 9 linii. |
| Karta — bez opisu | Generuj kartę. | Sekcja „MUTACJE” pod „MODLITWY”, same nazwy. |
| Karta — z opisem | Zaznacz „Czy dodać pełen opis?”, generuj. | `Nazwa — Efekt: …` z formatowaniem. |
| Ulubione — nowe | Zapisz NPC z mutacjami, Reset, Wczytaj. | Mutacje i checkbox pełnego opisu odtworzone. |
| Ulubione — stare | Wczytaj wpis sprzed zmiany. | Wczytuje się bez błędu, bez mutacji. |
| Reset | Kliknij „Reset”. | Lista mutacji bez zaznaczeń, filtr pusty, checkboxy domyślne. |
| Język EN | Przełącz język (po odkryciu przełącznika). | Teksty z tabeli 7.3. |
| Stare dane | (tylko test lokalny) dane bez arkusza „Mutacje”. | Czytelny komunikat o brakującym arkuszu. |

---

## 11. Ryzyka

| Ryzyko | Prawdopodobieństwo | Skutek | Ograniczenie |
| --- | --- | --- | --- |
| Generowanie z nieoczyszczonego pliku | wysokie, jeśli krok 0 zostanie pominięty | ~1 min zamrożonej strony, możliwe zawieszenie karty na słabszym sprzęcie; dane poprawne | rozdz. 5.4; opis w README; opcjonalnie 5.5 |
| Wdrożenie kodu GeneratorNPC przed importem danych | średnie | GeneratorNPC nie ładuje danych dla nikogo | kolejność z 7.7 lub D4 |
| Ponowne sformatowanie całych kolumn w Excelu | średnie | problem z 4.3 wraca | punkt 7 w 5.4; kontrola Ctrl + End |
| Zmiana arkusza „Mutacje” po zapisaniu ulubionych | niskie | ulubiony NPC wskaże inne mutacje (indeksy) | istniejące, udokumentowane ograniczenie wszystkich modułów |
| Długie efekty na karcie (Aberracja ~2,8 tys. znaków) | niskie | dłuższa karta do druku | świadomy wybór pełnego opisu; domyślnie wyłączony |
| Rozjazd dokumentacji | niskie | opis niezgodny z kodem | lista z rozdz. 8 jako checklista |

---

## 12. Decyzje do podjęcia

| # | Pytanie | Rekomendacja |
| --- | --- | --- |
| D1 | Oczyścić XLSX czy utwardzać parsery? | **Oczyścić XLSX** (zero zmian w generatorze). Utwardzenie ewentualnie osobnym zadaniem. |
| D2 | Czy w GeneratorNPC pokazywać odsyłacze „Rzut na tabeli pomniejszych/ciężkich mutacji”? | **Ukryć** (tylko w GeneratorNPC; w DataVault zostają, bo są częścią tabeli k66). |
| D3 | Czy na telefonie grupować karty „Mutacji” wg stopnia nasilenia? | **Tak**, przez `GROUPING_COLUMN_OVERRIDES` — mała zmiana, spójna z grupowaniem innych zakładek. Można pominąć bez szkody. |
| D4 | „Mutacje” jako arkusz wymagany czy opcjonalny w GeneratorNPC? | **Wymagany** (jak pozostałe moduły) + kolejność wdrożenia z 7.7. |
| D5 | Wyrównanie `Strona` w „Mutacjach”? | **Do lewej** (reguła globalna, jak reszta grupy). Środek tylko z regułą za blokiem globalnym. |

---

## 13. Obserwacje poboczne (poza zakresem)

Nie są potrzebne do „Mutacji”; zebrane, bo wyszły przy analizie:

1. **Martwe reguły `Strona` w DataVault.** Reguły `text-align:center` dla `Strona` w `Bestiariusz`, `Archetypy`, `Pakiety Wyniesienia`, `Bronie`, `Pancerze` i `Obrzędy` oraz reguła `min-width:11ch; text-align:center; white-space:nowrap` w `Skrót Zasad` stoją przed globalnym blokiem (linie 1203–1219) i są przez niego nadpisywane — zmierzone: we wszystkich tych zakładkach `Strona` ma 6ch, wyrównanie do lewej i zwykłe łamanie; wyśrodkowanie działa tylko w `Notatki` i zakładkach pojazdów (reguły stoją za blokiem globalnym). `Kolumny.md` podaje dla `Obrzędy` „środek”, a dla `Skrót Zasad` 11ch, co nie odpowiada wyglądowi.
2. **`DetaleLayout.md`, DataVault §5** opisuje szerokości niezgodne z `DataVault/style.css` (np. `Archetypy/Nazwa` 28ch vs 26ch w CSS, `Modlitwy/Efekt` 54ch vs 56ch, `Bronie/Podręcznik` 8ch vs 17ch); część wartości odpowiada raczej GeneratorNPC. Warto to uporządkować osobno.
3. **Nazwa „Premie Frakcji”** w `DetaleLayout.md` (linia 329) i `Kolumny.md` — arkusz nazywa się dziś `Premie z Przeszłości Frakcji`.
4. **`Kolumny.md`** zawiera sekcje „Aktualizacja 2026-04-17/20” w stylu changelogu.
5. **GeneratorNPC — ukryte moduły na karcie.** `README.md` mówi, że wyłączony moduł nie jest brany pod uwagę przy generowaniu karty, ale kod (`generateButton`) bierze zaznaczenia ze wszystkich list niezależnie od checkboxów. Trzeba zdecydować: poprawić kod (pomijać moduły wyłączone) albo instrukcję.
6. **Paski na karcie.** Linie typu `Efekt: …`, `1: …` wewnątrz jednego rekordu tworzą osobne paski (Psionika, Talenty, Augumentacje, a po zmianie także Mutacje). Ewentualna zmiana („jeden rekord = jeden pasek”) dotyczy wszystkich modułów karty.

---

## 14. Następne kroki

1. Podjąć decyzje D1–D5 (rekomendacje w rozdz. 12).
2. Oczyścić arkusz „Mutacje” w `Repozytorium.xlsx` (rozdz. 5.4), opcjonalnie poprawić literówki z 4.4.
3. Zlecić implementację kroków 1–7 z rozdz. 9 (kod + dokumentacja).
4. Wygenerować dane w trybie admina i zaimportować `firebase-import.json`.
5. Wdrożyć kod i przejść testy z rozdz. 10.
6. Ewentualnie osobne zadania z rozdz. 5.5 i 13.

---

## 15. Załącznik — metoda pomiarów

Wszystkie pliki robocze powstały w katalogu tymczasowym sesji i nie są częścią repozytorium.

- **Kopia oczyszczona:** skrypt usunął z `xl/worksheets/sheet12.xml` elementy `<row>` bez `<v>` i `<is>` (zostało 35 wierszy) i ustawił `<dimension ref="A1:H35"/>`; pozostałe części pakietu skopiowane bez zmian. Kopia służyła wyłącznie do pomiarów — plik źródłowy należy oczyścić w Excelu (rozdz. 5.4).
- **Python:** `python3 DataVault/build_json.py <plik.xlsx> <wynik.json>` (kod z repozytorium bez zmian); czas i szczytowe RSS zmierzone przez `resource.getrusage`.
- **Przeglądarka:** Chromium (Playwright, tryb bez okna); do strony wstrzyknięto JSZip 3.10.1 (ta sama wersja co w `index.html`), `DataVault/xlsxCanonicalParser.js` bez zmian oraz funkcje `replacePolishQuotes`, `norm`, `mergeTraits`, `mergeRange`, `buildDataJsonFromSheets` wycięte 1:1 z `DataVault/app.js`; wynik zapisany przez `JSON.stringify(data, null, 2)` — jak w `downloadJsonFile()`.
- **Porównanie:** `cmp` i SHA-256 czterech plików `data.json` (Python/przeglądarka × oryginał/kopia oczyszczona) — wszystkie identyczne.
- **Makieta tabeli:** strona z `DataVault/style.css` (bez zmian) + proponowany blok CSS, struktura DOM jak w `buildTableSkeleton()` / `renderRow()` (`.tableWrap > .tableFrame > .tableViewport > table.dataTable[data-sheet]`, `td[data-col] > .celltext`), dane z wygenerowanego `data.json`; odczyt `getComputedStyle` i `getBoundingClientRect` przy 1920 × 1080 i 1366 × 768.
- **Paski karty:** odwzorowanie `splitEntries()` (to samo wyrażenie regularne) na tekście `Nazwa — Efekt: …` budowanym jak w `buildModuleEntries()`.

Czasy zmierzono w kontenerze chmurowym (Linux); na komputerze użytkownika wartości bezwzględne będą inne, proporcje (dziesiątki sekund vs ~1 s) — podobne.

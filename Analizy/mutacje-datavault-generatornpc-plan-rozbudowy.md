# Zakładka „Mutacje” — DataVault i GeneratorNPC: analiza rozbudowy i plan pracy

> **Data analizy:** 2 listopada 2026 (wersja 1: analiza i pytania; wersja 2 tego samego dnia: dopisane decyzje użytkownika, nowe ustalenia i plan w etapach)
> **Moduły:** `DataVault` (generator danych, wyświetlanie zakładki, porządki w CSS), `GeneratorNPC` (nowy moduł aktywny, błąd wyłączonych modułów, domyślne checkboxy), dokumentacja wspólna (`DetaleLayout.md`, `Kolumny.md`, instrukcje Firebase)
> **Stan kodu:** commit `0eacdc5` (gałąź `main`; kod modułów bez zmian od `4295ed5`)
> **Plik wejściowy:** załączony `Repozytorium.xlsx` — 10 038 088 B, SHA-256 `e3ebb94b446eac953fffba5660c143dee64fc0520e4bb6d1fc7a6b52357290e3`, 39 arkuszy
> **Charakter dokumentu:** analiza i plan pracy. Kod, dane i konfiguracja nie zostały zmienione. Wszystkie pomiary wykonano na kopiach w katalogu tymczasowym sesji.
> **Analiza powiązana:** `Analizy/datavault-parser-xlsx-puste-wiersze-wydajnosc.md` — poprawa parsera XLSX (decyzja D1, osobne zadanie).
> **Odpowiedź w skrócie:**
> - **Mutacje:** generator danych obsługuje nową zakładkę bez zmian w kodzie (Python i przeglądarka dają bajtowo identyczny `data.json`), po oczyszczeniu pliku XLSX z miliona pustych wierszy. W DataVault: jedna linia w `app.js`, blok CSS i grupowanie kart na telefonie. W GeneratorNPC: nowy moduł według wzorca „Modlitw”, wszystkie 34 rekordy.
> - **Pilny błąd GeneratorNPC:** odznaczenie modułu tylko chowa jego kartę — wybór zostaje i trafia na kartę NPC. Dotyczy wszystkich modułów, także Broni i Pancerza. Plan: odznaczenie czyści moduł, generowanie pomija moduły wyłączone, ulubione nie przenoszą ukrytego wyboru, wszystkie moduły domyślnie wyłączone.
> - **Porządki:** 49 linii martwych lub zdublowanych reguł CSS w DataVault da się usunąć bez zmiany wyglądu ani o piksel (zmierzone). `Kolumny.md` ma 132 rozbieżności z faktycznym wyglądem, `DetaleLayout.md` §5 — 57 na 86 wpisów; oba pliki do przepisania na podstawie audytu (załącznik B).
> - **Dwa pytania otwarte** — rozdz. 16.

---

## Spis treści

1. [Prompty użytkownika (pełne)](#1-prompty-użytkownika-pełne)
2. [Zakres analizy](#2-zakres-analizy)
3. [Podsumowanie](#3-podsumowanie)
4. [Decyzje użytkownika](#4-decyzje-użytkownika)
5. [Zakładka „Mutacje” w nowym pliku XLSX](#5-zakładka-mutacje-w-nowym-pliku-xlsx)
6. [DataVault — generator danych](#6-datavault--generator-danych)
7. [DataVault — wyświetlanie zakładki „Mutacje”](#7-datavault--wyświetlanie-zakładki-mutacje)
8. [DataVault — martwe reguły CSS](#8-datavault--martwe-reguły-css)
9. [`Kolumny.md` i `DetaleLayout.md` — audyt i poprawa](#9-kolumnymd-i-detalelayoutmd--audyt-i-poprawa)
10. [GeneratorNPC — nowy moduł „Mutacje”](#10-generatornpc--nowy-moduł-mutacje)
11. [GeneratorNPC — wyłączony moduł na karcie i domyślne checkboxy](#11-generatornpc--wyłączony-moduł-na-karcie-i-domyślne-checkboxy)
12. [Dokumentacja do aktualizacji](#12-dokumentacja-do-aktualizacji)
13. [Plan pracy](#13-plan-pracy)
14. [Testy akceptacyjne](#14-testy-akceptacyjne)
15. [Ryzyka](#15-ryzyka)
16. [Pytania otwarte](#16-pytania-otwarte)
17. [Pozostałe obserwacje](#17-pozostałe-obserwacje)
18. [Następne kroki](#18-następne-kroki)
19. [Załącznik A — metoda pomiarów](#19-załącznik-a--metoda-pomiarów)
20. [Załącznik B — wzorcowa tabela kolumn DataVault](#20-załącznik-b--wzorcowa-tabela-kolumn-datavault)

---

## 1. Prompty użytkownika (pełne)

### 1.1 Prompt otwierający (2 listopada 2026)

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

### 1.2 Odpowiedzi użytkownika na pytania z wersji 1 (2 listopada 2026)

> Moje odpowiedzi na pytania (dopisz je do analizy):
>
> D1 - na tę chwilę poprawię plik XLSX. Przygotuj nową analizę dotyczącą poprawy parsera (będzie to osobne zadanie).
> D2 - Zostaw. Tabela "Mutacje" może być później rozbudowywana, zmieniana itd. - potem takie wyjątki będą powodować problemy.
> D3 - Zgodnie z Twoją rekomendacją, żeby zachować spójność aplikacji.
> D4 - Zgodnie z rekomendacją.
> D5 - Zgodnie z rekomendacją, żeby zachować spójność aplikacji.
>
> Dodatkowe obserwacje:
>
> 1. Martwe reguły - popraw i pamiętaj o zachowaniu spójności aplikacji.
> 2. DetaleLayout.md, DataVault §5 - popraw.
> 3. Nazwa „Premie Frakcji” - popraw.
> 4. Kolumny.md - popraw
> 5. GeneratorNPC — ukryte moduły na karcie. - Nie jestem pewien czy rozumiem. Opiszę jakie zachowanie jest oczekiwane.
>
> A. Otwieram moduł Generator NPC
> B. Wybieram przeciwnika (np. Mutant, LP=7)
> C. Nic nie zmieniam. Aktywny jest tylko checkbox "Broń".
> D. Klikam "Generuj kartę".
> E. Tworzy się karta potwora o standardowych statystykach.
> F. Klikam checkbox "Psionika" i wybieram kilka zaklęć.
> G. Klikam "Generuj kartę". Tworzy się karta potwora z dodaną sekcją "Psionika" na końcu.
> H. Odznaczam checkbox "Psionika" i klikam "Generuj kartę". Tworzy się potwór z wybranymi w pkt G czarami. To jest błąd. Po odznaczeniu checkboxa sekcja "Psionika" powinna zniknąć z wygenerowanej karty.
> I. Klikam checkbox "Psionika" - mam zaznaczone te czary, które wybrałem w pkt F. Wygląda to tak jakby odznaczenie checkboxa nie kasowało wyboru i dlatego się generuje sekcja "Psionika" nawet jeżeli checkbox jest odznaczony. Jest to do pilnej poprawy.
>
> 6. Paski na karcie - zachowaj spójność w wyglądzie wygenerowanej karty.
>
> DODATKOWO jedna zmiana. Przy opisie kroków w pkt C napisałem, że Aktywny jest tylko checkbox "Broń". Chcę to zmienić. Niech domyślnie wszystkie checkboxy będą wyłączone.
>
> Zaktualizuj analizę. Masz jeszcze jakieś pytania?

---

## 2. Zakres analizy

Wersja 1 (bez zmian w zakresie):

- załączony `Repozytorium.xlsx` — struktura pakietu, arkusz „Mutacje”, kolejność arkuszy;
- `DataVault`: `xlsxCanonicalParser.js`, `build_json.py`, `app.js`, `style.css`;
- `GeneratorNPC`: `index.html`, `style.css` — cały przepływ modułów aktywnych;
- dokumentacja modułów, `GeneratorNPC/config/FirebaseREADME.md`, `shared/FirebaseREADME.md`, `DetaleLayout.md`, `Kolumny.md`;
- pomiary obu ścieżek generowania, makieta tabeli, symulacja pasków karty.

Wersja 2 — dodatkowo:

- **przepływ modułów aktywnych w GeneratorNPC** pod kątem scenariusza A–I z rozdz. 1.2 (przełączniki, generowanie karty, Reset, ulubione, nadpisania Broni i Pancerza);
- **audyt obliczonych stylów** wszystkich 39 zakładek DataVault w Chromium (szerokość minimalna, maksymalna, wyrównanie, łamanie — dla nagłówka i komórki) przy 1920 px i 400 px;
- **audyt reguł CSS** — każda reguła „zakładka + kolumna” sprawdzona, czy jej deklaracje działają, czy są nadpisane albo dotyczą nieistniejących kolumn;
- porównanie audytu z `Kolumny.md` i z `DetaleLayout.md` §5;
- warianty uporządkowanego `style.css` zbudowane na kopiach i sprawdzone audytem (zero różnic w wyglądzie);
- osobna analiza parsera XLSX (decyzja D1).

Poza zakresem: zmiany w kodzie, import do Firebase, folder `WebView_FCM_Cloudflare_Worker/`, pliki `AGENTS.md`.

---

## 3. Podsumowanie

| # | Wniosek | Skutek dla planu |
| --- | --- | --- |
| 1 | Arkusz „Mutacje” leży w pliku między „Specjalne Bonusy Frakcji” a „Implanty Astartes”: 34 rekordy, 7 widocznych kolumn + `LP`. | Kolejność zakładek ustawia się sama. |
| 2 | Generator danych jest uniwersalny; Python i przeglądarka dają **identyczny** `data.json` (SHA-256 `846efd69…cdcdd3`). | Brak zmian w generatorze. |
| 3 | ⚠️ Arkusz „Mutacje” ma w XML **1 048 535 wierszy** (34 z danymi). | Użytkownik czyści plik (D1); poprawa parsera — osobna analiza. |
| 4 | Widoczność pod checkboxem „tworzenia postaci” i kolor zakładki daje jeden zbiór `CHARACTER_CREATION_SHEETS`. | Dopisać `"Mutacje"`. |
| 5 | Szerokości „Mutacji” ustalone i zmierzone na makiecie: k66 6ch/środek/bez łamania, `Stopień` 22ch, `Nazwa` 26ch, `Opis` i `Efekt` 56ch, `Podręcznik`/`Strona` z reguły globalnej (do lewej, D5). | Blok CSS. |
| 6 | Na telefonie karty „Mutacji” będą pogrupowane według stopnia nasilenia (D3). | `GROUPING_COLUMN_OVERRIDES`. |
| 7 | „Mutacje” w GeneratorNPC jako kopia wzorca „Modlitw”; wszystkie 34 rekordy, bez wyjątków (D2); arkusz wymagany (D4). | ok. 17 miejsc w `index.html` + 2 reguły CSS; import danych przed wdrożeniem kodu GeneratorNPC. |
| 8 | **Błąd (pilny):** przełącznik modułu tylko chowa kartę modułu; generowanie bierze zaznaczenia ze wszystkich list. Dotyczy 7 modułów, także Broni (ukryta broń nadpisuje ataki) i Pancerza (ukryty pancerz nadpisuje WP). Ulubione zapisują i odtwarzają ukryty wybór. | Odznaczenie czyści moduł, generowanie pomija wyłączone moduły, ulubione bez ukrytego wyboru (rozdz. 11). |
| 9 | Domyślnie zaznaczony jest tylko przełącznik „Broń”. | Usunąć `checked` — wszystkie moduły domyślnie wyłączone; Reset przywraca ten stan. |
| 10 | W DataVault 10 reguł/deklaracji kolumn nie działa (nadpisane albo dla nieistniejących kolumn), 4 deklaracje `max-width:auto` są niepoprawne, 7 reguł `Podręcznik` dubluje regułę globalną, 2 reguły zakładek „tworzenia postaci” są nadpisane. | Usunięcie 49 + 7 linii; zero zmian w wyglądzie (zmierzone). |
| 11 | `Strona` jest wyśrodkowana tylko w `Notatki` i 7 zakładkach pojazdów, wszędzie indziej — do lewej. | Pytanie P2 (spójność). |
| 12 | `Kolumny.md`: 132 rozbieżności, brak 4 zakładek, nazwa „Premie Frakcji”, sekcje w stylu changelogu, błędna szerokość kolumny `✓`. `DetaleLayout.md` §5 (DataVault): 57 z 86 wpisów błędnych, część wartości pochodzi z GeneratorNPC. | Przepisać oba na podstawie audytu (załącznik B). |
| 13 | Paski na karcie: zachowanie bez zmian, wspólne dla wszystkich modułów (decyzja użytkownika, pkt 6). | Brak zmian w `splitEntries()`. |

---

## 4. Decyzje użytkownika

| # | Pytanie z wersji 1 | Decyzja | Skutek w planie |
| --- | --- | --- | --- |
| D1 | Oczyścić XLSX czy utwardzać parsery? | Na razie oczyścić XLSX; poprawa parsera osobnym zadaniem. | Krok 3.0 planu; analiza `Analizy/datavault-parser-xlsx-puste-wiersze-wydajnosc.md`. |
| D2 | Ukryć w GeneratorNPC odsyłacze „Rzut na tabeli … mutacji”? | **Zostawić** — tabela będzie rozbudowywana, wyjątki sprawiałyby problemy. | Wszystkie 34 rekordy, bez filtra (rozdz. 10). |
| D3 | Grupować karty „Mutacji” na telefonie? | Tak, zgodnie z rekomendacją (spójność). | `GROUPING_COLUMN_OVERRIDES` (rozdz. 7.5). |
| D4 | „Mutacje” jako arkusz wymagany w GeneratorNPC? | Tak, zgodnie z rekomendacją. | Kolejność wdrożenia: import danych → kod GeneratorNPC (rozdz. 10.7). |
| D5 | Wyrównanie `Strona` w „Mutacjach”? | Do lewej, zgodnie z rekomendacją (spójność). | Bez własnej reguły — reguła globalna. |

| # | Obserwacja z wersji 1 | Decyzja | Rozdział |
| --- | --- | --- | --- |
| 1 | Martwe reguły `Strona` | Poprawić z zachowaniem spójności. | 8 (+ pytanie P2) |
| 2 | `DetaleLayout.md`, DataVault §5 | Poprawić. | 9.3 |
| 3 | Nazwa „Premie Frakcji” | Poprawić. | 9.4 |
| 4 | `Kolumny.md` | Poprawić. | 9.2 |
| 5 | Wyłączone moduły na karcie GeneratorNPC | Błąd do pilnej poprawy (scenariusz A–I). | 11 (+ pytanie P1) |
| 6 | Paski na karcie | Zachować spójny wygląd — bez zmian. | 10.5 |
| — | Domyślne checkboxy GeneratorNPC | Wszystkie domyślnie wyłączone. | 11.5 |

---

## 5. Zakładka „Mutacje” w nowym pliku XLSX

### 5.1 Struktura

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

Pozycja w kolejności arkuszy: **12. z 39**. `columnOrder`: `["Rzut k66", "Stopień Nasilenia Mutacji", "Nazwa", "Opis", "Efekt", "Podręcznik", "Strona"]`.

Dwa rekordy są odsyłaczami do kolejnej tabeli: „Rzut na tabeli pomniejszych mutacji” (LP 9) i „Rzut na tabeli ciężkich mutacji” (LP 17), z `Opis` i `Efekt` = `-`. Zgodnie z D2 zostają we wszystkich widokach.

### 5.2 Formatowanie z Excela

Znaczniki w 18 rekordach (17 × `Efekt`, 1 × `Opis`): `{{RED}}CHAOS{{/RED}}`, `{{RED}}PSIONIK{{/RED}}`, pogrubione nagłówki podtabel (`1: {{B}}Głowa{{/B}}`, `{{B}}Efekt{{/B}}: …`), odnośniki `[Podręcznik Główny (str. 201)]`. Żadna para znaczników nie przechodzi przez złamanie linii; brak pustych par.

### 5.3 Milion pustych, sformatowanych wierszy

`xl/worksheets/sheet12.xml`: `<dimension ref="A1:H1048535"/>`, 1 048 535 elementów `<row>` (wiersze 36+ to puste komórki `E:F` ze stylem `s="98"`), 107,8 MB XML. Dane wychodzą poprawne, ale generowanie trwa dziesiątki sekund (rozdz. 6.2). Instrukcja oczyszczenia — rozdz. 6.4.

### 5.4 Drobne uwagi do danych (do ewentualnej poprawy w Excelu)

| Rekord | Kolumna | Fragment | Uwaga |
| --- | --- | --- | --- |
| LP 23 „Głód kanibala” | `Efekt` | `…wszystkich Testów.Kara zostaje usunięta…` | brak spacji po kropce |
| LP 28 „Otyłość” | `Opis` | `…twój wzrost zwiększa sięo ok. 5%…` | sklejone „się o” |
| LP 13 „Brutal” | `Rzut k66` | `34-43` | jedyny zakres obejmujący dwie „dziesiątki” w tabeli pomniejszych mutacji; warto potwierdzić z podręcznikiem (str. 290) |

---

## 6. DataVault — generator danych

### 6.1 Jak działa generowanie

Ścieżki, które muszą dawać ten sam wynik (`AGENTS.md` §14): przeglądarka (`index.html?admin=1` → „Generuj pliki danych”), `python DataVault/build_json.py Repozytorium.xlsx data.json` i `firebase-import.json` (= `data.json` jako tekst w `datavault/live.dataJson`). Obie implementacje iterują po wszystkich arkuszach w kolejności z pliku; specjalnie traktują tylko `Cechy`, `Stany`, `Stany Pojazdów`, `Cechy Pojazdów` (słowniki `_meta`) i `Bronie`, `Bronie Pojazdów`, `Pancerze`, `Pojazdy` (scalanie kolumn). „Mutacje” przechodzą bez przekształceń.

### 6.2 Test na załączonym pliku

| Ścieżka | Plik oryginalny (1 048 535 wierszy w „Mutacjach”) | Plik oczyszczony (35 wierszy) | Wynik |
| --- | --- | --- | --- |
| `build_json.py` | 32–37 s, szczyt pamięci 1 752 MB | 0,7 s, 40 MB | identyczny |
| przeglądarka (Chromium) | 51,6 s, strona zablokowana | 1,35 s | identyczny z Pythonem |
| rozmiar XLSX | 10 038 088 B | 578 564 B | — |

Wszystkie pliki `data.json`: 1 376 258 B, SHA-256 `846efd6958a186a43473d5bba8e70c852eee56dd8d34a34dbf48a75cc5cdcdd3`, 39 arkuszy, `Mutacje` = 34 rekordy.

### 6.3 Wniosek

Generator nie wymaga zmian w kodzie. Wymaga oczyszczenia pliku XLSX (D1). Zabezpieczenie parsera przed takimi plikami opisuje osobna analiza `Analizy/datavault-parser-xlsx-puste-wiersze-wydajnosc.md` (prototyp: przeglądarka 51,6 s → 5,0 s, Python ~35 s → 4,0 s, wynik identyczny).

### 6.4 Jak oczyścić plik w Excelu (krok obowiązkowy przed generowaniem)

1. Otwórz `Repozytorium.xlsx` i przejdź do zakładki **Mutacje**.
2. Kliknij szary numer wiersza **36** (pierwszy wiersz pod danymi).
3. Naciśnij **Ctrl + Shift + Strzałka w dół** — zaznaczą się wiersze od 36 do końca arkusza.
4. Prawy przycisk na zaznaczeniu → **Usuń** (nie „Wyczyść zawartość” — ta zostawia formatowanie).
5. Kliknij **A1** i zapisz (**Ctrl + S**).
6. Sprawdzenie: **Ctrl + End** → kursor w **H35**. Jeśli trafia dalej, zamknij i otwórz plik, sprawdź ponownie. Plik powinien zmaleć z ok. 10 MB do ok. 0,6 MB.
7. Na przyszłość formatowanie nakładaj na zakres z danymi (np. `E2:F35`), nie na całe kolumny.

Test **Ctrl + End** warto wykonać w każdej zakładce przed generowaniem.

---

## 7. DataVault — wyświetlanie zakładki „Mutacje”

### 7.1 Grupa „tworzenie postaci” i kolor zakładki

`CHARACTER_CREATION_SHEETS` (`DataVault/app.js`, linie 331–341) → `isCharacterCreationSheet()` → `initUI()` ukrywa zakładki grupy przy odznaczonym `toggleCharacterTabs` i nadaje widocznym klasę `tab--character`; kolor z `style.css` (linie 1355–1358).

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

Zakładka nie trafia do `ADMIN_ONLY_SHEETS` — jest dostępna także w trybie użytkownika (po zaznaczeniu checkboxa), jak cała grupa.

### 7.2 Kolejność zakładek

`getSheetOrder()` korzysta z `_meta.sheetOrder` → po imporcie: `… SPECJALNE BONUSY FRAKCJI · MUTACJE · IMPLANTY ASTARTES …`. Bez zmian w kodzie.

### 7.3 Szerokości i wyrównanie kolumn (ustalone)

| Kolumna | min-width | Wyrównanie | Łamanie | Uzasadnienie |
| --- | --- | --- | --- | --- |
| `Rzut k66` | 6ch | środek | bez łamania | jak w `Trafienia Krytyczne`, `Groza Osnowy`, `Uszkodzenia Pojazdów` |
| `Stopień Nasilenia Mutacji` | 22ch | lewo | standard | „Pomniejsze mutacje” w 1 linii, nagłówek w 2 (przy 20ch — 3 linie, zmierzone) |
| `Nazwa` | 26ch | lewo | standard | standard modułu |
| `Opis` | 56ch | lewo | standard | jak `Obrzędy` |
| `Efekt` | 56ch | lewo | standard | najdłuższa kolumna (śr. 456, maks. 2776 znaków); zwijanie powyżej 9 linii |
| `Podręcznik` | 17ch | lewo | standard | reguła globalna (bez własnej reguły) |
| `Strona` | 6ch | lewo | standard | reguła globalna (D5) |

Pomiar na makiecie: przy 1920 × 1080 tabela ma 1694 px przy 1702 px miejsca — bez przewijania w bok; przy 1366 × 768 — ok. 1586 px wobec 1148 px, z przewijaniem jak w `Specjalne Bonusy Frakcji`, `Obrzędy`, `Archetypy`.

Blok CSS — w `DataVault/style.css` po bloku `/* Specjalne Bonusy Frakcji */`, przed `/* Cechy / Stany / Słowa kluczowe */`:

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

### 7.4 Co zadziała samo

Domyślne sortowanie po `LP` (subtelne → pomniejsze → ciężkie), filtry kolumnowe i listowe (`Stopień…` = 3 wartości), filtr globalny, porównywanie, zwijanie > 9 linii, znaczniki i odnośniki, Widok Domyślny / Pełen Widok (brak wpisu w `DEFAULT_VIEW_CONFIG`), etykiety kart na telefonie, stan w `sessionStorage`.

### 7.5 Grupowanie kart na telefonie (D3)

`groupingColumnFor()` (linia 2318) sprawdza `DEFAULT_VIEW_CONFIG`, potem `Typ`, potem `Rodzaj`. „Mutacje” nie mają żadnej z tych kolumn, więc dochodzi mapa wyjątków:

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

Kolejność grup wynika z sortowania (Subtelne → Pomniejsze → Ciężkie); 34 wiersze > `GROUPING_MIN_ROWS` (12). Mapa działa także dla przyszłych wartości kolumny — nie zawiera listy stopni, więc rozbudowa tabeli (D2) jej nie zepsuje.

### 7.6 Czego celowo nie zmieniać

`KEYWORD_SHEETS_COMMA_NEUTRAL`, `KEYWORD_SHEET_ALL_RED`, `ADMIN_ONLY_SHEETS`, `DEFAULT_VIEW_CONFIG`, `transformSheet()`, `normaliseDB()`.

---

## 8. DataVault — martwe reguły CSS

### 8.1 Metoda

Każda reguła `style.css` postaci `.tableWrap table[data-sheet="X"] th|td[data-col="Y"]` (poza regułami telefonu w `@media`) została porównana z faktycznym, obliczonym stylem komórki na stronie z wszystkimi 39 zakładkami. Deklaracja jest „martwa”, gdy przeglądarka jej nie stosuje: nadpisuje ją reguła stojąca niżej o tej samej szczegółowości, dotyczy nieistniejącej kolumny albo ma niepoprawną wartość.

### 8.2 Wyniki

| Linie `style.css` | Reguła | Dlaczego nie działa | Działanie |
| --- | --- | --- | --- |
| 790–791 | `Bestiariusz` → `Rozmiar` w grupie `min-width:3ch` | nadpisana przez 804–805 (`7ch`) | usunąć `Rozmiar` z tej grupy |
| 808–809 | `Bestiariusz` → `Strona` `6ch; center` | nadpisana przez blok globalny (1211–1217) — wyrównanie wychodzi do lewej | usunąć |
| 848–849 | `Archetypy` → `Strona` | jw. | usunąć |
| 870–871 | `Pakiety Wyniesienia` → `Strona` | jw. | usunąć |
| 1092–1096 | `Obrzędy` → `Strona` | jw. | usunąć |
| 1129–1130 | `Bronie` → `Strona` | jw. | usunąć |
| 1163–1164 | `Pancerze` → `Strona` | jw. | usunąć |
| 1183–1184 | `Skrót Zasad` → `Strona` `11ch; center; nowrap` | wszystkie trzy deklaracje nadpisane (wychodzi 6ch, do lewej, z łamaniem); wartości mają maks. 3 znaki, więc 6ch wystarcza | usunąć |
| 830–831 | `Archetypy` → `Koszt XP` | kolumna nie istnieje (w danych jest `Koszt PD`, obsłużony w tej samej regule) | usunąć dwa selektory |
| 1023–1024 | `Psionika` → `Opis` | kolumna nie istnieje | usunąć dwa selektory |
| 1214, 1226, 1233, 1247 | `max-width:auto` (globalna `Strona`, `Notatki`) | `max-width` nie przyjmuje `auto` — przeglądarka odrzuca deklarację | usunąć |
| 806–807, 846–847, 868–869, 1086–1090, 1127–1128, 1161–1162, 1237–1243 | `Podręcznik` w `Bestiariusz`, `Archetypy`, `Pakiety Wyniesienia`, `Obrzędy`, `Bronie`, `Pancerze`, `Notatki` | działają, ale są identyczne z regułą globalną (17ch, do lewej) | usunąć — jedno źródło prawdy |
| 324–330 | `.tab.tab--character{opacity:.9}` i `.tab.tab--character.active{color}` | nadpisane przez 1355 i 1358 (`opacity:1`, ten sam kolor) | usunąć |

### 8.3 Weryfikacja: wygląd bez zmian

Na kopiach `style.css` zbudowano warianty i porównano obliczone style wszystkich kolumn wszystkich zakładek (nagłówek i komórka: szerokość minimalna i maksymalna, wyrównanie, łamanie):

| Wariant | Usunięte linie | Różnice przy 1920 px | Różnice przy 400 px (telefon) |
| --- | --- | --- | --- |
| A — martwe reguły kolumn + `max-width:auto` | 27 | **0** | — |
| A+ — A oraz zdublowane reguły `Podręcznik` | 49 | **0** | **0** |
| reguły zakładek `.tab--character` (324–330) | 7 | **0** (kolor, przezroczystość, tło, ramka, cień) | — |

Usunięcie 56 linii nie zmienia więc wyglądu ani o piksel.

### 8.4 Spójność: `Strona` w `Notatki` i zakładkach pojazdów (pytanie P2)

Po porządkach `Strona` jest do lewej we wszystkich zakładkach **oprócz** `Notatki` i siedmiu zakładek pojazdów (`Role W Pojeździe`, `Akcje Pojazdu`, `Stany Pojazdów`, `Cechy Pojazdów`, `Pojazdy`, `Bronie Pojazdów`, `Ekwipunek Pojazdów`) — tam reguły stoją za blokiem globalnym i wyśrodkowanie działa.

- **Wariant B (rekomendowany, spójność z D5):** usunąć również te dwie reguły → `Strona` do lewej w całej aplikacji, jedna reguła globalna. Zmierzone: zmienia się wyłącznie wyrównanie `Strona` (nagłówek i komórka) w tych 8 zakładkach — 16 różnic, nic poza tym.
- **Wariant A+:** zostawić wyśrodkowanie w tych 8 zakładkach (stan dzisiejszy, bez zmian w wyglądzie).

### 8.5 Zabezpieczenie przed powrotem problemu

Nad blokiem globalnym `Podręcznik`/`Strona` dopisać komentarz PL/EN: reguły tych dwóch kolumn ustawia wyłącznie ten blok; reguła zakładki postawiona wyżej w pliku nie zadziała (ta sama szczegółowość, późniejsza reguła wygrywa); wyjątek trzeba stawiać poniżej bloku i opisać w `DetaleLayout.md`.

---

## 9. `Kolumny.md` i `DetaleLayout.md` — audyt i poprawa

### 9.1 Źródło prawdy

Oba pliki należy przepisać na podstawie **audytu obliczonych stylów**, nie lektury CSS — reguły nadpisują się kaskadą i odczyt „na oko” prowadzi do takich błędów jak dziś. Załącznik B zawiera wzorcową tabelę stanu docelowego (po porządkach z rozdz. 8 i po dodaniu „Mutacji”; `Strona` w `Notatki`/pojazdach według odpowiedzi na P2).

### 9.2 `Kolumny.md` — 132 rozbieżności

| Rodzaj | Przykłady |
| --- | --- |
| ok. 110 × „auto”, choć CSS ustala szerokość | `Bestiariusz/Premie` (60ch), `Archetypy/Ekwipunek` (46ch), `Talenty/Efekt` (56ch), wszystkie `Typ` (14ch), `Nazwa` (26ch) |
| złe wyrównanie | statystyki `Bestiariusz` (`S`, `Wt`, …, `Szybkość`) — w dokumencie „lewo”, faktycznie środek; `Koszt PD` w `Talenty` i `Modlitwy` — faktycznie środek; `Obrzędy/Strona` — w dokumencie „środek”, faktycznie lewo |
| zła szerokość | `Bestiariusz/Rozmiar` 3ch → 7ch; `Skrót Zasad/Strona` 11ch → 6ch |
| brak informacji o braku łamania | `Rzut k66` w `Trafienia Krytyczne` i `Groza Osnowy` |
| brakujące sekcje | `Premie z Przeszłości Frakcji` (w dokumencie pod starą nazwą „Premie Frakcji”), `Mutacje`, `Uszkodzenia Pojazdów`, `Eksplozje Pojazdów`; brak kolumny `Typ` w `Bestiariusz` |
| błędny wstęp | kolumna `✓` ma 5ch, nie 8ch |
| historia zmian | sekcje „Aktualizacja 2026-04-17”, „Aktualizacja 2026-04-20” |
| dwa formaty | zakładki pojazdów opisane listami, pozostałe tabelami |

Plan: przepisać cały plik — jeden format tabelaryczny dla 39 zakładek w kolejności z `_meta.sheetOrder`, wartości z załącznika B, bez sekcji historycznych, ze wstępem opisującym regułę globalną `Podręcznik`/`Strona` i kolumnę `✓` (5ch).

### 9.3 `DetaleLayout.md` — DataVault §5 i sąsiednie fragmenty

Audyt §5 „Wymagania szerokości kolumn (min-width)”: **57 z 86** wpisów nie odpowiada wyglądowi DataVault. Część wartości pochodzi z tabel podglądu **GeneratorNPC** (np. `Modlitwy` 28ch/54ch, `Talenty` 28ch/46ch, `Augumentacje/Ekwipunek` `Nazwa` 28ch i `Efekt` 48ch, `Psionika` `ST` 9ch, `Bronie/Nazwa` 30ch) — DataVault ma tam odpowiednio 26ch/56ch, 26ch/56ch, 26ch i 26ch, 10ch, 26ch.

Plan:

1. **DataVault §5** — przepisać na pełną listę wszystkich zakładek (wstęp sekcji zapowiada „pełną listę 1:1”) z wartościami z załącznika B, spójną z `Kolumny.md`.
2. **GeneratorNPC** — w sekcji modułu dodać podsekcję „Szerokości kolumn tabel podglądu” z wartościami z `GeneratorNPC/style.css`:
   - `Bestiariusz` (podgląd bazowy): kolumna klucza 25ch;
   - `Bronie`: `Nazwa` 30ch; `Obrażenia`, `DK`, `PP`, `Szybkostrzelność`, `Podręcznik`, `Strona` 8ch; `Zasięg` 18ch; `Cechy` 32ch;
   - `Pancerze`: `Nazwa` 30ch; `Podręcznik` 14ch; `Strona`, `WP` 8ch; `Cechy` 32ch;
   - `Augumentacje`, `Ekwipunek`: `Nazwa` 28ch; `Efekt` 48ch;
   - `Talenty`: `Nazwa` 28ch; `Efekt` 46ch;
   - `Psionika`: `Nazwa` 26ch; `ST` 9ch; `Zasięg` 14ch; `Aktywacja`, `Czas trwania` 20ch; `Wiele Celów`, `Wzmocnienie` 26ch; `Efekt` 48ch;
   - `Modlitwy` i (nowe) `Mutacje`: `Nazwa` 28ch; `Efekt` 54ch.
3. **DataVault §2** (linia 329) — lista zakładek tworzenia postaci: `Premie z Przeszłości Frakcji` zamiast „Premie Frakcji”, dopisać `Mutacje`; opis wyglądu zgodny z faktycznym: tekst `var(--code)`, tło `var(--character-bg)` (`rgba(210,250,210,.05)`), ramka `rgba(210,250,210,.20)`, **`opacity: 1`** (nie `.9`); aktywna — tło `var(--character-bg-active)`, ramka `var(--character-border)`, poświata `0 0 0 2px rgba(210,250,210,.16), 0 0 18px var(--character-glow)`.
4. **DataVault §3** (linie 339–340) — opis reguły globalnej `Podręcznik`/`Strona` i wyjątków po decyzji P2.
5. **DataVault §6** — „Siatka główna: … `360px` (panel filtrów)”: w `DataVault/style.css` panel ma **180px** (`grid-template-columns:180px 1fr`).
6. **DataVault §7** — dopisać zasadę z rozdz. 8.5 (wyjątki `Podręcznik`/`Strona` tylko pod blokiem globalnym) i zasadę „wartości w dokumentacji z audytu obliczonych stylów”.
7. Sekcja „Aktualizacja 2026-04-20 — korekta DataVault (kolumny i layout)” — to wpis w stylu historii zmian; jej treść jest już w sekcjach głównych → usunąć (`AGENTS.md` §8: plik opisuje aktualny wygląd).

### 9.4 Nazwa „Premie Frakcji”

W repozytorium (poza `Analizy/`) występuje w dwóch miejscach: `DetaleLayout.md:329` i `Kolumny.md:118`. Obie poprawki wchodzą w 9.2 i 9.3.

---

## 10. GeneratorNPC — nowy moduł „Mutacje”

### 10.1 Wzorzec

Moduły dodatkowe składają się z tych samych klocków, powiązanych kluczem: przełącznik `data-module-toggle`, karta `data-module-section` (checkbox opisu, pole filtra, lista, tabela podglądu), tłumaczenia, `state.<klucz>`, `listFilters`/`MODULE_LIST_KEYS`, tablica kolumn i `render…Table()`, ulubione, Reset, `moduleEntries`. „Modlitwy” mają dokładnie kolumny `Nazwa` + `Efekt`, więc są wzorcem 1:1. Klucz modułu: **`mutations`**, arkusz: **`Mutacje`**.

### 10.2 Punkty styku w `GeneratorNPC/index.html`

| # | Miejsce (stan na `0eacdc5`) | Co dodać dla `mutations` |
| --- | --- | --- |
| 1 | Panel „Moduły aktywne”, po `prayers` (linie 94–98) | `<label class="checkbox"><input type="checkbox" data-module-toggle="mutations" /><span data-i18n="moduleMutations">Mutacje — lista mutacji.</span></label>` — bez `checked` |
| 2 | Obszar roboczy, po karcie `prayers` (linie 354–382) | karta `data-module-section="mutations"`: `Wybór Mutacji`, `#mutations-full-details`, `#mutations-filter`, `select#mutations[multiple][size=15]`, `table.data-table[data-sheet="Mutacje"]` (`Nazwa` / `Efekt`), `tbody#mutations-table-body` |
| 3 | Referencje DOM (446, 454, 473) | `mutationsSelect`, `mutationsTableBody`, `mutationsFullDetailsToggle` |
| 4 | `translations.pl.labels` (ok. 512, 573–577) | `moduleMutations`, `mutationsSectionTitle`, `mutationsLabel`, `mutationsDetailsToggle`, `mutationsHeaderName`, `mutationsHeaderEffect` |
| 5 | `translations.pl.cardSections` (ok. 616) | `mutations: "Mutacje"` |
| 6 | `translations.pl.messages` (ok. 630, 646) | `selectMutations`; `loadSummary` + `, Mutacje ({mutations})` |
| 7 | `translations.en.*` (ok. 682, 743–747, 786, 800, 816) | odpowiedniki EN (10.3) |
| 8 | `applyLanguage()` (ok. 868, 899) | `updatePlaceholder(mutationsSelect, …)`; `mutations: state.mutations.length` |
| 9 | `state` (ok. 973) | `mutations: []` |
| 10 | `listFilters` + `MODULE_LIST_KEYS` (1584–1586) | `mutations: createListFilter("mutations", { getRecords: () => state.mutations, placeholderKey: "selectMutations" })`; `"mutations"` na końcu `MODULE_LIST_KEYS` |
| 11 | Kolumny i render (2110, 2189–2199) | `const mutationsColumns = ["Nazwa", "Efekt"];` + `renderMutationsTable()` |
| 12 | `buildFavoritePayload()` (2548, 2563) | `mutationsIds`; `fullDetails.mutations` |
| 13 | `applyFavorite()` (2644, 2652, 2660) | odtworzenie wyboru, checkboxa opisu, `renderMutationsTable()` |
| 14 | Zdarzenia i Reset (3229, 3264–3292) | `change` → `renderMutationsTable`; czyszczenie w Resecie |
| 15 | Generowanie karty (3354, 3385–3393) | `selectedMutations`; wpis w `moduleEntries` **po** `prayers` |
| 16 | `loadPrivateGeneratorData()` (3427, 3432) | `state.mutations = sortByName(getRequiredCollection(data, "Mutacje"));` + render |
| 17 | Komentarze z liczbami list (870–872, 1541–1548) | „osiem pól filtra” → „dziewięć”, „siedem list modułów” → „osiem” (PL i EN) |

Jeżeli najpierw powstanie mapa `MODULE_CONTROLS` z rozdz. 11.4 (Etap 1), punkty 12–15 sprowadzają się do dopisania jednego wpisu do mapy.

`GeneratorNPC/style.css`, po regułach `Modlitwy` (linie 604–610):

```css
/* Mutacje — szerokości kolumn podglądu, takie same jak w Modlitwach / Mutations — preview column widths, the same as Prayers */
.data-table[data-sheet="Mutacje"] .min-col-nazwa {
  min-width: 28ch;
}

.data-table[data-sheet="Mutacje"] .min-col-efekt {
  min-width: 54ch;
}
```

### 10.3 Teksty interfejsu (PL / EN)

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

Komunikat pustej tabeli „Wybierz mutację, aby zobaczyć parametry.” — wpisany po polsku jak w pozostałych modułach (istniejący wzorzec).

### 10.4 Kluczowe fragmenty kodu

```js
// --- Mutacje: wymagany arkusz DataVault, wszystkie rekordy / Mutations: a required DataVault sheet, all records ---
// PL: Kolejność jak w tabeli z podręcznika — sortRecords() najpierw porównuje LP. Bez wyjątków dla
//     pojedynczych rekordów: arkusz będzie rozbudowywany, a lista ma pokazywać go w całości.
// EN: Order as in the rulebook table — sortRecords() compares LP first. No exceptions for single
//     records: the sheet will grow, and the list is meant to show it in full.
state.mutations = sortByName(getRequiredCollection(data, "Mutacje"));
```

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

Odsyłacze „Rzut na tabeli …” (D2) zachowają się jak każdy rekord: na karcie pojawi się ich nazwa; przy pełnym opisie nic więcej, bo `Efekt` = `-` nie jest wartością znaczącą (`hasMeaningfulValue`).

### 10.5 Sekcja „Mutacje” na karcie i paski (decyzja: bez zmian)

- Sekcja pojawia się, gdy moduł jest **włączony** (rozdz. 11) i wybrano co najmniej jedną mutację; stoi pod „Modlitwami”, nad „Notatkami”.
- Bez pełnego opisu: paski z nazwami. Z pełnym opisem: `Nazwa — Efekt: …` z formatowaniem.
- `splitEntries()` dzieli tekst na paski także w środku rekordu (linie `…: `, `… —`, `[n]`). W „Mutacjach” dotyczy to 6 rekordów z podtabelami — np. „Aberracja” (13 pasków), „Dodatkowe kończyny” (12), „Wizje” (5), „Żrąca żółć” (5), „Rogi, kolce, kły i pazury” (3), „Człowiek-ryba” (3). Ten sam mechanizm działa dziś w Psionice, Talentach i Augumentacjach. Zgodnie z decyzją użytkownika (obserwacja 6) **wygląd karty pozostaje spójny — mechanizm się nie zmienia**.

### 10.6 Ulubione — zgodność wstecz

Brak `modules.mutationsIds` → brak wybranych mutacji; brak klucza `mutations` w `toggles.moduleVisibility` → przełącznik według bieżącego stanu (a po zmianach z rozdz. 11 — bez wyboru, jeśli moduł jest wyłączony); brak `toggles.fullDetails.mutations` → `false`. Model Firestore bez zmian. Indeksy w `mutationsIds` — jak w innych modułach (znane ograniczenie przy zmianie arkusza).

### 10.7 Kolejność wdrożenia (D4)

| Stan | DataVault | GeneratorNPC |
| --- | --- | --- |
| Stary kod + nowe dane | „MUTACJE” jako zwykła zakładka (zawsze widoczna, bez koloru grupy) | działa jak dotąd |
| Nowy kod DataVault + stare dane | bez zmian | — |
| Nowy kod GeneratorNPC + stare dane | — | **nie działa**: „W danych DataVault brakuje wymaganego arkusza GeneratorNPC: Mutacje.” |

Kolejność: oczyszczenie XLSX → generowanie i import `firebase-import.json` → kod GeneratorNPC dla „Mutacji”. Kod DataVault może iść wcześniej.

---

## 11. GeneratorNPC — wyłączony moduł na karcie i domyślne checkboxy

### 11.1 Przyczyna błędu ze scenariusza A–I

Kod potwierdza opis użytkownika:

| Krok | Co dzieje się w kodzie |
| --- | --- |
| F — zaznaczenie „Psionika” | `change` na przełączniku wywołuje tylko `updateModuleVisibility()` — karta `data-module-section="psionics"` traci klasę `is-hidden`. |
| H — odznaczenie „Psionika” | ta sama funkcja dodaje klasę `is-hidden`. **Nic nie czyści listy `#psionics`** — zaznaczone opcje zostają w ukrytej karcie. |
| H — „Generuj kartę” | obsługa przycisku (od linii 3342) bierze `getSelectedRecords(state.psionics, getSelectedIndices(psionicsSelect))` dla każdego modułu, **nie sprawdzając przełączników**. Sekcja „Psionika” trafia na kartę. |
| I — ponowne zaznaczenie | karta wraca z dawnym wyborem, bo nikt go nie usunął. |

Ten sam mechanizm dotyczy wszystkich modułów:

- **Broń** — ukryta, wybrana broń nadal zastępuje ataki z Bestiariusza (`buildWeaponOverride`);
- **Pancerz** — ukryty pancerz nadal nadpisuje WP i cechy (`getArmorOverrides`);
- **Augumentacje, Ekwipunek, Talenty, Psionika, Modlitwy** (i przyszłe **Mutacje**) — ukryty wybór dodaje sekcję na karcie.

Dodatkowo **ulubione** zapisują wybór także z modułów wyłączonych (`buildFavoritePayload()` czyta wszystkie listy), a `applyFavorite()` go odtwarza — wczytanie takiego wpisu odtwarza ukryty wybór i błąd wraca.

Instrukcja użytkownika (`GeneratorNPC/docs/README.md`, rozdział „Moduły aktywne”) opisuje zachowanie oczekiwane („Wyłączony moduł … nie jest brany pod uwagę przy generowaniu karty”), więc to błąd kodu, nie instrukcji.

### 11.2 Zachowanie docelowe (rekomendowane — pytanie P1)

1. **Odznaczenie modułu czyści moduł** do stanu jak po Resecie: brak zaznaczeń na liście, puste pole filtra (i zgaszona niebieska etykieta), checkbox „Czy dodać pełen opis?” / „opisy cech” w stanie domyślnym, pusta tabela podglądu.
2. **Generowanie pomija moduły wyłączone** — niezależnie od tego, co jest na liście (bezpiecznik). Wyłączona Broń = ataki z Bestiariusza; wyłączony Pancerz = WP i cechy z Bestiariusza.
3. **Ulubione:** zapisują wybór tylko z modułów włączonych; przy wczytaniu wybór trafia tylko do modułów, które są włączone w tym ulubionym. Stare wpisy z „ukrytym” wyborem przestają go wskrzeszać.
4. **Domyślnie wszystkie moduły wyłączone** (11.5).

Scenariusz użytkownika po zmianie:

| Krok | Wynik |
| --- | --- |
| A–B | Moduł otwarty, wybrany „Mutant” (LP 7). |
| C | Wszystkie przełączniki „Moduły aktywne” odznaczone (nowa wartość domyślna). |
| D–E | Karta ze standardowymi statystykami i atakami z Bestiariusza. |
| F–G | Zaznaczenie „Psionika”, wybór mocy → karta z sekcją „Psionika” na końcu. |
| H | Odznaczenie „Psionika” czyści wybór → karta **bez** sekcji „Psionika”. |
| I | Ponowne zaznaczenie „Psionika” → pusta lista, trzeba wybrać od nowa. |

Wariant alternatywny (gdyby odpowiedź na P1 brzmiała „nie czyścić”): odznaczenie tylko chowa kartę i wyłącza moduł z generowania (punkt 2), a wybór czeka ukryty. Wtedy w kroku I wracają dawne moce i po ponownym zaznaczeniu znów trafiają na kartę; ulubione muszą wtedy jawnie pomijać moduły wyłączone. Rekomendacja: wariant z czyszczeniem — to, co widać na ekranie, jest dokładnie tym, co trafi na kartę i do ulubionych.

### 11.3 Gdzie zmiany

| Miejsce w `GeneratorNPC/index.html` | Zmiana |
| --- | --- |
| przełącznik `weapon` (linia 72) | usunąć `checked` |
| podpięcie `change` przełączników (linie 3230–3232) | przy odznaczeniu wywołać `clearModule(key)`, potem `updateModuleVisibility()` |
| obsługa „Generuj kartę” (3342–3400) | rekordy modułu tylko dla `isModuleActive(key)`, w przeciwnym razie `[]` (także Broń i Pancerz) |
| `buildFavoritePayload()` (2531–2566) | `…Ids` tylko dla modułów włączonych |
| `applyFavorite()` (2606–2661) | po ustawieniu przełączników: `selectedIndices` tylko dla modułów włączonych w ulubionym |
| nowe: `MODULE_CONTROLS`, `isModuleActive()`, `clearModule()` | 11.4 |

Reset nie wymaga zmian: przywraca `defaultChecked`, a po usunięciu `checked` będzie to „wszystko wyłączone”.

### 11.4 Proponowany kod

```js
// --- Kontrolki modułów aktywnych w jednym miejscu / Active-module controls in one place ---
// PL: Dla każdego modułu: lista wyboru, checkbox opisu i funkcja rysująca tabelę podglądu. Z mapy
//     korzystają: odznaczenie modułu, generowanie karty i ulubione — dzięki temu żaden moduł nie
//     zostanie pominięty, a nowy moduł dopisuje się w jednym miejscu.
// EN: For every module: its selection list, its description checkbox and its preview-table renderer.
//     Used by module unticking, card generation and favourites — so no module can be skipped, and a
//     new module is added in one place.
const MODULE_CONTROLS = {
  weapon: { select: weaponSelect, detailsToggle: weaponTraitDescriptionsToggle, render: renderWeaponTable },
  armor: { select: armorSelect, detailsToggle: armorTraitDescriptionsToggle, render: renderArmorTable },
  augmentations: { select: augmentationsSelect, detailsToggle: augmentationsFullDetailsToggle, render: renderAugmentationsTable },
  equipment: { select: equipmentSelect, detailsToggle: equipmentFullDetailsToggle, render: renderEquipmentTable },
  talents: { select: talentsSelect, detailsToggle: talentsFullDetailsToggle, render: renderTalentsTable },
  psionics: { select: psionicsSelect, detailsToggle: psionicsFullDetailsToggle, render: renderPsionicsTable },
  prayers: { select: prayersSelect, detailsToggle: prayersFullDetailsToggle, render: renderPrayersTable },
  // mutations: { select: mutationsSelect, detailsToggle: mutationsFullDetailsToggle, render: renderMutationsTable },
};

// --- Czy moduł jest włączony w „Moduły aktywne” / Whether a module is ticked in "Active modules" ---
const isModuleActive = (key) =>
  moduleToggles.some((toggle) => toggle.dataset.moduleToggle === key && toggle.checked);

// --- Wyczyszczenie modułu do stanu jak po Resecie / Clearing a module to its post-Reset state ---
// PL: Wywoływane przy odznaczeniu modułu. Wyłączony moduł nie może trzymać ukrytego wyboru, bo ten
//     trafiałby na kartę i do ulubionych, choć użytkownik go nie widzi.
// EN: Called when a module is unticked. A disabled module must not keep a hidden selection, because it
//     would reach the card and favourites even though the user cannot see it.
const clearModule = (key) => {
  const controls = MODULE_CONTROLS[key];
  const list = listFilters[key];
  if (!controls || !list) return;
  list.input.value = "";
  updateListFilterIndicator(list);
  refreshModuleOptions(key, { selectedIndices: [] });
  controls.detailsToggle.checked = controls.detailsToggle.defaultChecked;
  controls.render();
};

moduleToggles.forEach((toggle) => {
  toggle.addEventListener("change", () => {
    if (!toggle.checked) {
      clearModule(toggle.dataset.moduleToggle);
    }
    updateModuleVisibility();
  });
});

// --- Wybrane rekordy tylko z modułów włączonych / Selected records only from enabled modules ---
// PL: Bezpiecznik generowania karty: moduł wyłączony działa jak moduł bez wyboru.
// EN: Card-generation safety net: a disabled module behaves like a module with no selection.
const getActiveModuleRecords = (key, records) =>
  isModuleActive(key) ? getSelectedRecords(records, getSelectedIndices(MODULE_CONTROLS[key].select)) : [];
// np. / e.g.: const selectedPsionics = getActiveModuleRecords("psionics", state.psionics);
```

W `applyFavorite()`:

```js
// Wybór z ulubionego trafia tylko do modułów włączonych w tym ulubionym
// A favourite's selection goes only to modules enabled in that favourite
Object.keys(MODULE_CONTROLS).forEach((key) => {
  const ids = isModuleActive(key) ? (payload.modules?.[`${key}Ids`] || []) : [];
  refreshModuleOptions(key, { selectedIndices: ids });
});
```

(Nazwy pól `payload.modules` już dziś mają postać `${klucz}Ids`: `weaponIds`, `armorIds`, …, `prayersIds`.)

### 11.5 Wszystkie moduły domyślnie wyłączone

- Zmiana: `<input type="checkbox" checked data-module-toggle="weapon" />` → bez `checked`. Pozostałe przełączniki i wszystkie checkboxy opisów (`…-full-details`, `…-trait-descriptions`) oraz „Czy wyświetlić zdezaktualizowane wpisy?” już dziś są domyślnie odznaczone.
- Skutek: po otwarciu modułu i po Resecie obszar roboczy pokazuje tylko „Podgląd bazowy Bestiariusza”; karta bez włączonych modułów ma ataki, WP i cechy z Bestiariusza (to już dziś działa — puste nadpisania zwracają `null`).
- Ulubione zapisują stan przełączników, więc wczytanie wpisu włączy moduły, które były w nim włączone.

### 11.6 Kolejność

Zmiana nie zależy od danych ani od „Mutacji” — może (i zgodnie z prośbą „do pilnej poprawy” powinna) wejść jako pierwsza, osobnym commitem. Moduł „Mutacje” dopisuje się potem jako jeden wpis w `MODULE_CONTROLS`.

---

## 12. Dokumentacja do aktualizacji

Zgodnie z `AGENTS.md` §1–§8 i §15 (pełne wersje PL i EN, opis stanu po zmianie, bez historii zmian).

### 12.1 Etap 1 — GeneratorNPC: wyłączone moduły i domyślne checkboxy

| Plik | Sekcje (PL i EN) | Co opisać |
| --- | --- | --- |
| `GeneratorNPC/docs/README.md` | „Moduły aktywne” | wszystkie moduły domyślnie wyłączone; odznaczenie chowa moduł i **kasuje jego wybór**, filtr i opis; wyłączony moduł nie trafia na kartę (Broń/Pancerz — dane z Bestiariusza) |
| | „Tworzenie NPC krok po kroku” | krok włączania modułów; uwaga, że odznaczenie kasuje wybór |
| | „Reset”, „Wczytywanie ulubionego” | Reset = wszystko wyłączone; ulubione odtwarzają tylko moduły, które były włączone |
| `GeneratorNPC/docs/Documentation.md` | „Moduły aktywne” | `MODULE_CONTROLS`, `isModuleActive()`, `clearModule()`, obsługa `change`, domyślne `defaultChecked = false` |
| | „Generowanie karty do druku” | pomijanie modułów wyłączonych (`getActiveModuleRecords`) |
| | „Ulubione NPC”, „Model `payload` ulubionego” | zapis i odczyt tylko dla modułów włączonych; zgodność ze starymi wpisami |
| | „Testy kontrolne” | scenariusz A–I (14.1) |

### 12.2 Etap 2 — porządki w DataVault i dokumentach wyglądu

| Plik | Co zmienić |
| --- | --- |
| `DataVault/style.css` | rozdz. 8 (kod; komentarze PL/EN przy bloku globalnym) |
| `DataVault/docs/Documentation.md` (PL i EN) | opis reguły globalnej `Podręcznik`/`Strona` jako jedynego źródła tych kolumn (rozdział o tabeli i renderowaniu / stylach) i wyjątków po P2 |
| `Kolumny.md` | przepisać całość (9.2) |
| `DetaleLayout.md` | DataVault §2, §3, §5, §6, §7, usunięcie sekcji „Aktualizacja 2026-04-20”; GeneratorNPC — szerokości tabel podglądu (9.3) |

### 12.3 Etap 3 — „Mutacje”

| Plik | Sekcje (PL i EN) | Co dopisać |
| --- | --- | --- |
| `DataVault/docs/Documentation.md` | „Struktura plików modułu”, „Grupy zakładek → Tworzenie postaci”, „Grupowanie kart w układzie telefonu” (`GROUPING_COLUMN_OVERRIDES`), „Generowanie danych z XLSX” (kontrola Ctrl + End), „Testy kontrolne” | `Mutacje` |
| `DataVault/docs/README.md` | „Zakładki”, „Przełączniki grup zakładek”, „Na telefonie tabela wygląda inaczej”, „Generowanie plików danych — tylko admin” | zakładka w grupie tworzenia postaci; grupowanie wg stopnia nasilenia; sprawdzenie Ctrl + End przed generowaniem |
| `GeneratorNPC/docs/Documentation.md` | „Cel modułu”, „Wymagane arkusze”, „Kolekcje danych”, „Workspace”, „Moduły aktywne”, „Filtry nazw list wyboru” (dziewięć obiektów, osiem kluczy), „Reguły `min-col-*`”, „Moduły dodatkowe”, „Model `payload`” (`mutationsIds`, `fullDetails.mutations`), „Generowanie karty”, „i18n”, „Fallbacki i błędy”, „Procedura odtworzenia”, „Testy kontrolne” | moduł `mutations` |
| `GeneratorNPC/docs/README.md` | „Źródło danych”, „Obszar roboczy”, „Gdzie jest pole wyszukiwania”, „Moduły aktywne”, „Augumentacje, ekwipunek, talenty, psionika i modlitwy” (+ mutacje), „Generowanie karty”, „Typowe komunikaty i co zrobić” | moduł „Mutacje”, pełny opis = kolumna `Efekt`, komunikat o brakującym arkuszu |
| `GeneratorNPC/config/FirebaseREADME.md` | listy wymaganych arkuszy (PL ok. 52–61 i 371, EN ok. 452–461) | `Mutacje` |
| `shared/FirebaseREADME.md` | linie 229 i 690 | `Mutacje` |
| `DetaleLayout.md` | DataVault §2 i §5; GeneratorNPC — lista filtrów nazw (linia 622) i szerokości podglądu | `Mutacje` |
| `Kolumny.md` | sekcja `Mutacje` (w ramach przepisania z Etapu 2) | — |

`DataVault/docs/ZasadyFormatowania.md` — bez zmian.

---

## 13. Plan pracy

Etapy są niezależne i każdy idzie osobnym commitem. Etap 1 ma najwyższy priorytet.

### Etap 1 — pilny: GeneratorNPC, wyłączone moduły i domyślne checkboxy

| Krok | Czynność | Pliki |
| --- | --- | --- |
| 1.1 | `MODULE_CONTROLS`, `isModuleActive()`, `clearModule()`, nowa obsługa `change` przełączników. | `GeneratorNPC/index.html` |
| 1.2 | Generowanie karty przez `getActiveModuleRecords()` dla 7 modułów (Broń i Pancerz także). | jw. |
| 1.3 | Ulubione: zapis i odczyt tylko dla modułów włączonych. | jw. |
| 1.4 | Usunięcie `checked` z przełącznika „Broń”. | jw. |
| 1.5 | Dokumentacja z 12.1. | `GeneratorNPC/docs/*` |
| 1.6 | Testy 14.1. | — |

Nie zależy od danych — można wdrożyć od razu.

### Etap 2 — porządki: martwe reguły CSS i dokumenty wyglądu

| Krok | Czynność | Pliki |
| --- | --- | --- |
| 2.1 | Usunięcie 56 linii z rozdz. 8.2 (+ reguły `Notatki`/pojazdów, jeśli P2 = wariant B), komentarz z 8.5. | `DataVault/style.css` |
| 2.2 | Audyt obliczonych stylów przed i po (metoda z załącznika A): 0 różnic (albo tylko 16 różnic `Strona` przy wariancie B). | — |
| 2.3 | Przepisanie `Kolumny.md` i fragmentów `DetaleLayout.md` z 9.2–9.4. | `Kolumny.md`, `DetaleLayout.md` |
| 2.4 | Dokumentacja z 12.2. | `DataVault/docs/Documentation.md` |

### Etap 3 — „Mutacje”

| Krok | Kto | Czynność | Pliki |
| --- | --- | --- | --- |
| 3.0 | użytkownik | Oczyszczenie arkusza (6.4), opcjonalnie literówki z 5.4. | `Repozytorium.xlsx` |
| 3.1 | agent | `"Mutacje"` w `CHARACTER_CREATION_SHEETS`; blok CSS z 7.3; `GROUPING_COLUMN_OVERRIDES` z 7.5. | `DataVault/app.js`, `DataVault/style.css` |
| 3.2 | agent | Kontrola zgodności generatorów na oczyszczonym pliku (identyczne SHA-256). | — |
| 3.3 | użytkownik | „Generuj pliki danych” w adminie → import `firebase-import.json` w root Realtime Database. | Firebase Console |
| 3.4 | agent | GeneratorNPC: moduł `mutations` (10.2), wpis w `MODULE_CONTROLS`, CSS. **Po kroku 3.3.** | `GeneratorNPC/index.html`, `GeneratorNPC/style.css` |
| 3.5 | agent | Dokumentacja z 12.3, sekcja `Mutacje` w `Kolumny.md` i `DetaleLayout.md`. | 8 plików `.md` |
| 3.6 | — | Testy 14.3 i 14.4. | — |

### Etap 4 — osobne zadanie: parser XLSX

Według `Analizy/datavault-parser-xlsx-puste-wiersze-wydajnosc.md`.

---

## 14. Testy akceptacyjne

### 14.1 Etap 1 — GeneratorNPC

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Domyślne przełączniki | Otwórz moduł; potem kliknij Reset. | Wszystkie przełączniki „Moduły aktywne” odznaczone; widać tylko podgląd bazowy. |
| Scenariusz A–I | Kroki z rozdz. 1.2 („Mutant”, LP 7; Psionika). | H: karta bez sekcji „Psionika”; I: pusta lista Psioniki. |
| Broń wyłączona | Włącz Broń, wybierz broń, wyłącz Broń, generuj. | Ataki z Bestiariusza. |
| Pancerz wyłączony | Włącz Pancerz, wybierz pancerz, wyłącz, generuj. | WP i cechy z Bestiariusza. |
| Czyszczenie filtra i opisu | Wpisz frazę w filtrze modułu, zaznacz „Czy dodać pełen opis?”, wyłącz i włącz moduł. | Pole filtra puste, etykieta zielona, checkbox opisu odznaczony. |
| Ulubione — nowe | Zapisz NPC z Psioniką; wyłącz Psionikę; zapisz drugi wpis; wczytaj oba. | Pierwszy: Psionika włączona z mocami; drugi: Psionika wyłączona, bez wyboru. |
| Ulubione — stare z ukrytym wyborem | Wczytaj wpis zapisany przed poprawką, w którym moduł był wyłączony, a wybór zapisany. | Moduł wyłączony, bez wyboru; karta bez sekcji. |
| Regresja | Pozostałe funkcje (filtry nazw, nadpisania Bestiariusza, trackery, druk). | Bez zmian. |

### 14.2 Etap 2 — porządki

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Wygląd bez zmian | Audyt obliczonych stylów 39 zakładek przy 1920 px i 400 px przed i po. | 0 różnic (wariant A+) albo tylko `Strona` w 8 zakładkach (wariant B). |
| Zakładki grupy | Zaznacz checkbox tworzenia postaci. | Kolor, tło i poświata zakładek bez zmian. |
| Dokumenty | Porównanie `Kolumny.md` i `DetaleLayout.md` §5 z audytem. | 0 rozbieżności; brak „Premie Frakcji”; brak sekcji historycznych. |

### 14.3 Etap 3 — DataVault

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Zgodność generatorów | `build_json.py` i „Generuj pliki danych” na oczyszczonym pliku. | Pliki identyczne; `Mutacje` = 34; `_meta.sheetOrder[11] === "Mutacje"`. |
| Widoczność i kolor | Checkbox tworzenia postaci odznaczony / zaznaczony. | Zakładka ukryta / widoczna, kolor jak „Specjalne Bonusy Frakcji”. |
| Kolejność | — | `… SPECJALNE BONUSY FRAKCJI · MUTACJE · IMPLANTY ASTARTES …` |
| Kolumny | 1920 px. | Jak w 7.3; bez przewijania w bok. |
| Sortowanie, filtry, formatowanie | — | LP; 3 wartości stopnia; `CHAOS` na czerwono, pogrubienia, zwijanie. |
| Telefon | < 720 px. | 3 grupy: Subtelne, Pomniejsze, Ciężkie. |

### 14.4 Etap 3 — GeneratorNPC

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Start | Otwórz po imporcie. | „Załadowano: … Modlitwy (13), Mutacje (34).” |
| Pozycja | „Moduły aktywne”. | „Mutacje — lista mutacji.” pod „Modlitwy”, odznaczony. |
| Karta wyboru | Zaznacz moduł. | „Wybór Mutacji” pod „Wybór Modlitw”. |
| Lista | — | 34 pozycje w kolejności LP, z odsyłaczami „Rzut na tabeli …”. |
| Filtr | Wpisz `skora`. | „Jedwabna skóra”, „Zwierzęca skóra”; etykieta niebieska. |
| Karta | Generuj bez i z pełnym opisem. | Sekcja „MUTACJE” pod „MODLITWY”: nazwy / `Nazwa — Efekt: …`. |
| Wyłączenie | Wyłącz moduł, generuj. | Brak sekcji, pusta lista po ponownym włączeniu. |
| Ulubione | Zapis, Reset, wczytanie; wczytanie wpisu sprzed zmiany. | Odtworzone / bez mutacji. |
| Język EN | — | Teksty z 10.3. |

---

## 15. Ryzyka

| Ryzyko | Prawdopodobieństwo | Skutek | Ograniczenie |
| --- | --- | --- | --- |
| Generowanie z nieoczyszczonego pliku | wysokie, jeśli krok 3.0 zostanie pominięty | ~1 min zamrożonej strony | 6.4; Etap 4 |
| Kod GeneratorNPC „Mutacji” przed importem danych | średnie | GeneratorNPC nie ładuje danych | kolejność 10.7 |
| Odznaczenie modułu przez pomyłkę kasuje wybór | średnie | trzeba wybrać ponownie | świadomy wybór (P1); opis w README |
| Usunięcie reguły CSS zmienia wygląd | niskie | inny wygląd zakładki | audyt przed/po (14.2) |
| Dokumentacja wyglądu znów rozjedzie się z CSS | średnie | mylące instrukcje | wartości wyłącznie z audytu; zasada w `DetaleLayout.md` §7 |
| Zmiana arkusza „Mutacje” po zapisaniu ulubionych | niskie | ulubiony wskaże inne mutacje | istniejące ograniczenie wszystkich modułów |

---

## 16. Pytania otwarte

| # | Pytanie | Rekomendacja |
| --- | --- | --- |
| P1 | Czy **odznaczenie modułu ma kasować jego wybór** (oraz filtr i checkbox opisu)? Alternatywa: wybór zostaje ukryty i wraca po ponownym zaznaczeniu, ale nie trafia na kartę, dopóki moduł jest wyłączony. | **Tak, kasować** — to, co widać, jest dokładnie tym, co trafia na kartę i do ulubionych; zgodne z krokiem I scenariusza. |
| P2 | Czy `Strona` w `Notatki` i 7 zakładkach pojazdów ma być — jak wszędzie — **do lewej** (wariant B), czy zostać wyśrodkowana? | **Do lewej** — jedna reguła w całej aplikacji, zgodnie z D5. |

---

## 17. Pozostałe obserwacje

1. **Puste rekordy w `Specjalne Bonusy Wrogów`:** wiersze LP 8–11 mają wpisany tylko numer `LP`, pozostałe kolumny są puste. Parser słusznie traktuje je jako rekordy, więc w tej zakładce (tylko tryb admina) widać 4 puste wiersze. Do poprawy w Excelu (usunąć numery albo uzupełnić dane).
2. **`DetaleLayout.md`** ma także sekcje „Aktualizacja …” dla innych modułów (Main, Infoczytnik, Kalkulator); `AGENTS.md` §8 wymaga opisu stanu bieżącego. Poza zakresem tego zadania.
3. **Parser XLSX** — „rekordy-widma” z samego formatowania, pusty pierwszy wiersz, brak widocznego postępu generowania (`setStatus()` pisze tylko do konsoli) — opisane w `Analizy/datavault-parser-xlsx-puste-wiersze-wydajnosc.md`, rozdz. 10 i 12.

---

## 18. Następne kroki

1. Odpowiedzieć na P1 i P2.
2. Etap 1 (pilny) — implementacja i wdrożenie.
3. Etap 2 — porządki CSS i dokumentów.
4. Krok 3.0 — oczyszczenie `Repozytorium.xlsx`; potem Etap 3 z importem danych przed kodem GeneratorNPC.
5. Etap 4 — osobne zadanie (parser).

---

## 19. Załącznik A — metoda pomiarów

Wszystkie pliki robocze powstały w katalogu tymczasowym sesji i nie są częścią repozytorium.

- **Kopia oczyszczona XLSX:** skrypt usunął z `xl/worksheets/sheet12.xml` elementy `<row>` bez `<v>` i `<is>` (zostało 35) i ustawił `<dimension ref="A1:H35"/>`.
- **Generator — Python:** `python3 DataVault/build_json.py <plik> <wynik>`; czas i RSS przez `resource.getrusage`.
- **Generator — przeglądarka:** Chromium (Playwright), JSZip 3.10.1, `DataVault/xlsxCanonicalParser.js` bez zmian, funkcje `replacePolishQuotes`, `norm`, `mergeTraits`, `mergeRange`, `buildDataJsonFromSheets` wycięte 1:1 z `app.js`; wynik `JSON.stringify(data, null, 2)`.
- **Porównanie danych:** `cmp` i SHA-256.
- **Makieta „Mutacji”:** prawdziwy `style.css` + blok z 7.3, DOM jak w `buildTableSkeleton()`/`renderRow()`, dane z `data.json`; 1920 × 1080 i 1366 × 768.
- **Audyt obliczonych stylów:** strona z tabelami wszystkich 39 zakładek (kolumny z `_meta.columnOrder`, bez `LP`/`Stan`), `getComputedStyle` dla nagłówka i komórki: `min-width`, `max-width`, `text-align`, `white-space`; przeliczenie pikseli na `ch` sondą `width:1ch` w komórce; 1920 px i 400 px.
- **Audyt reguł:** arkusz stylów wczytany do strony, dla każdej reguły `[data-sheet] th|td[data-col]` (poza `@media`) porównanie każdej deklaracji z wartością obliczoną elementu, którego dotyczy; zaokrąglenie do pełnych `ch`.
- **Warianty CSS:** kopie `style.css` z usuniętymi liniami z 8.2 (A: 27 linii, A+: 49 linii, B: A+ i reguły `Strona` w `Notatki`/pojazdach) oraz z usuniętymi liniami 324–330; porównanie audytów przed i po.
- **Zakładki grupy:** przyciski `.tab.tab--character` (zwykły i aktywny), `.tab--combat`, `.tab` — porównanie koloru, przezroczystości, tła, ramki i cienia przed i po.
- **`Kolumny.md` / `DetaleLayout.md`:** automatyczne odczytanie tabel i list z plików i porównanie z audytem.
- **Paski karty:** odwzorowanie `splitEntries()` na tekście `Nazwa — Efekt: …` z `buildModuleEntries()`.

Czasy zmierzono w kontenerze chmurowym (Linux); na komputerze użytkownika wartości bezwzględne będą inne.

---

## 20. Załącznik B — wzorcowa tabela kolumn DataVault

Stan docelowy po Etapach 2 i 3, odczytany audytem z `style.css` po usunięciu martwych reguł i dodaniu bloku „Mutacji”. Kolumna `✓` (zaznaczanie) ma we wszystkich zakładkach 5ch (min = max = szerokość), wyśrodkowana. `Strona` w `Notatki` i zakładkach pojazdów — według odpowiedzi na P2 (poniżej stan dzisiejszy: środek). Kolejność zakładek jak w `_meta.sheetOrder`.

Oznaczenia: `L` — do lewej, `Ś` — do środka, `nw` — bez łamania (`white-space: nowrap`), `max` — `max-width`; `auto` — brak reguły szerokości.

| Zakładka | Kolumny (min-width / wyrównanie) |
| --- | --- |
| Notatki | Nazwa 26ch/L; Opis 56ch/L; Podręcznik 17ch/L; Strona 6ch/Ś |
| Bestiariusz | Typ 14ch/L; Nazwa 26ch/L; Zagrożenie 5ch/Ś; Słowa Kluczowe 28ch/L; S 3ch/Ś; Wt 3ch/Ś; Zr 3ch/Ś; I 3ch/Ś; SW 3ch/Ś; Int 3ch/Ś; Ogd 3ch/Ś; Odporność (w tym WP) 3ch/Ś; Wartość Pancerza 3ch/Ś; Obrona 3ch/Ś; Żywotność 3ch/Ś; Odporność Psychiczna 3ch/Ś; Umiejętności 28ch/L; Premie 60ch/L; Zdolności 60ch/L; Atak 50ch/L; Zdolności Hordy 60ch/L; Opcje Hordy 60ch/L; Upór 3ch/Ś; Odwaga 3ch/Ś; Szybkość 3ch/Ś; Rozmiar 7ch/Ś; Podręcznik 17ch/L; Strona 6ch/L |
| Hordy | Nazwa zasady 26ch/L; Opis zasady 60ch/L; Przykład 60ch/L |
| Specjalne Bonusy Wrogów | Frakcja 26ch/L; Rodzaj 26ch/L; Nazwa 26ch/L; Opis 56ch/L; Efekt 26ch/L |
| Tabela Rozmiarów | Rozmiar 8ch/L; Modyfikator Testu Ataku 26ch/Ś; Zmniejszenie Poziomu Ukrycia 26ch/Ś; Przykłady 85ch/L |
| Gatunki | Gatunek 26ch/L; Koszt PD 4ch/Ś; Atrybuty 26ch/L; Umiejętności 26ch/L; Szybkość 4ch/Ś; Rozmiar 10ch/Ś; Zdolności gatunkowe 46ch/L |
| Archetypy | Poziom 2ch/Ś; Frakcja 26ch/L; Nazwa 26ch/L; Gatunek 26ch/L; Koszt PD 4ch/Ś; Słowa Kluczowe 26ch/L; Atrybuty Archetypu 26ch/L; Umiejętności Archetypu 26ch/L; Zdolność Archetypu 46ch/L; Ekwipunek 46ch/L; Inne 10ch/L; Podręcznik 17ch/L; Strona 6ch/L |
| Pakiety Wyniesienia | Nazwa 26ch/L; Opis 56ch/L; Koszt PD 26ch/L; Wymagania 26ch/L; Słowa Kluczowe 26ch/L; Premia Wpływu 26ch/L; Pamiętna historia 46ch/L; Ekwipunek 46ch/L; Podręcznik 17ch/L; Strona 6ch/L |
| Premie z Przeszłości Frakcji | Frakcja 26ch/L; Premia 1 56ch/L; Premia 2 56ch/L; Premia 3 56ch/L |
| Słowa Kluczowe Frakcji | Frakcja 28ch/L; Słowo Kluczowe 28ch/L; Opis 26ch/L; Efekt 56ch/L |
| Specjalne Bonusy Frakcji | Frakcja 26ch/L; Rodzaj 26ch/L; Nazwa 26ch/L; Opis 56ch/L; Efekt 26ch/L |
| Mutacje | Rzut k66 6ch/Ś nw; Stopień Nasilenia Mutacji 22ch/L; Nazwa 26ch/L; Opis 56ch/L; Efekt 56ch/L; Podręcznik 17ch/L; Strona 6ch/L |
| Implanty Astartes | Numer 4ch/Ś; Nazwa 26ch/L; Opis 26ch/L |
| Zakony Pierwszego Powołania | Nazwa 26ch/L; Opis 56ch/L; Zaleta 26ch/L; Wada 26ch/L |
| Cechy | Typ 14ch/L; Nazwa 26ch/L; Opis 56ch/L |
| Stany | Typ 14ch/L; Nazwa 26ch/L; Opis 56ch/L |
| Słowa Kluczowe | Typ 14ch/L; Nazwa 26ch/L; Opis 56ch/L |
| Talenty | Typ 14ch/L; Nazwa 26ch/L; Koszt PD 4ch/Ś; Wymagania 26ch/L; Opis 26ch/L; Efekt 56ch/L; Podręcznik 17ch/L; Strona 6ch/L |
| Modlitwy | Typ 14ch/L; Nazwa 26ch/L; Koszt PD 4ch/Ś; Wymagania 26ch/L; Efekt 56ch/L; Podręcznik 17ch/L; Strona 6ch/L |
| Psionika | Typ 14ch/L; Nazwa 26ch/L; Koszt PD 4ch/Ś; ST 10ch/Ś; Aktywacja 10ch/L; Czas Trwania 15ch/L; Zasięg 8ch/Ś; Wiele Celów 4ch/Ś; Słowa Kluczowe 28ch/L; Efekt 56ch/L; Wzmocnienie 26ch/L; Podręcznik 17ch/L; Strona 6ch/L |
| Augumentacje | Typ 14ch/L; Nazwa 26ch/L; Opis 56ch/L; Efekt 26ch/L; Koszt 3ch/Ś; Dostępność 3ch/Ś; Słowa Kluczowe 28ch/L; Koszt IM 8ch/Ś; Podręcznik 17ch/L; Strona 6ch/L |
| Ekwipunek | Typ 14ch/L; Nazwa 26ch/L; Opis 56ch/L; Efekt 26ch/L; Koszt 3ch/Ś; Dostępność 3ch/Ś; Słowa Kluczowe 28ch/L; Koszt IM 8ch/Ś; Podręcznik 17ch/L; Strona 6ch/L |
| Pancerze | Typ 14ch/L; Nazwa 26ch/L; WP 4ch/Ś; Cechy 32ch/L; Koszt 4ch/Ś; Dostępność 4ch/Ś; Słowa Kluczowe 28ch/L; Koszt IM 8ch/Ś; Podręcznik 17ch/L; Strona 6ch/L |
| Bronie | Rodzaj 14ch/L; Typ 14ch/L; Nazwa 26ch/L; Obrażenia auto/Ś; DK auto/Ś; PP auto/Ś; Zasięg 18ch/Ś nw; Szybkostrzelność 8ch/Ś; Cechy 32ch/L; Koszt 4ch/Ś; Dostępność 4ch/Ś; Słowa Kluczowe 28ch/L; Koszt IM 8ch/Ś; Podręcznik 17ch/L; Strona 6ch/L |
| Obrzędy | Rodzaj 14ch/L; Typ 18ch/L; Nazwa 26ch/L; Opis 56ch/L; Efekt 56ch/L; Koszt 4ch/Ś; Dostępność 4ch/Ś; Koszt IM 8ch/Ś; Podręcznik 17ch/L; Strona 6ch/L |
| Trafienia Krytyczne | Rzut k66 6ch/Ś nw; Opis 56ch/L; Efekt 26ch/L; Chwała 26ch/L |
| Groza Osnowy | Rzut k66 6ch/Ś nw; Efekt 56ch/L |
| Skrót Zasad | Typ 32ch/L; Nazwa 20ch/L; Opis 56ch/L; Strona 6ch/L |
| Tryby Ognia | Nazwa 20ch/L; Opis 56ch/L |
| Kary do ST | Ile celów/akcji 20ch/Ś max 20ch; Kara do ST 20ch/Ś max 20ch (tabela `table-layout: fixed`, szerokość `max-content`) |
| Uszkodzenia Pojazdów | Rzut k66 6ch/Ś nw; Efekt 56ch/L |
| Eksplozje Pojazdów | Rozmiar Pojazdu 20ch/L max 20ch; Zasięg Rażenia 14ch/Ś max 14ch; Obrażenia 14ch/Ś max 14ch (tabela `table-layout: fixed`, szerokość `max-content`) |
| Role W Pojeździe | Rola 14ch/L; Akcje Pojazdu 60ch/L; Podręcznik 17ch/L; Strona 6ch/Ś |
| Akcje Pojazdu | Nazwa 26ch/L; Opis 56ch/L; Przykład 56ch/L; Podręcznik 17ch/L; Strona 6ch/Ś |
| Stany Pojazdów | Nazwa 26ch/L; Opis 56ch/L; Podręcznik 17ch/L; Strona 6ch/Ś |
| Cechy Pojazdów | Typ 22ch/L; Nazwa 26ch/L; Opis 56ch/L; Podręcznik 17ch/L; Strona 6ch/Ś |
| Pojazdy | Typ 14ch/L; Nazwa 30ch/L; Koszt 10ch/Ś; Dostępność 10ch/Ś; Szybkość 10ch/Ś; Manewrowość 10ch/Ś; Odporność 10ch/Ś; Żywotność 10ch/Ś; Rozmiar 10ch/Ś; Słowa Kluczowe 28ch/L; Skład Załogi 22ch/L; Cechy 32ch/L; Uzbrojenie 36ch/L; Wyposażenie 32ch/L; Koszt IM 8ch/Ś; Podręcznik 17ch/L; Strona 6ch/Ś |
| Bronie Pojazdów | Rodzaj 14ch/L; Typ 14ch/L; Nazwa 26ch/L; Obrażenia 8ch/Ś; DK 8ch/Ś; PP 8ch/Ś; Zasięg 18ch/Ś nw; Szybkostrzelność 8ch/Ś; Cechy 32ch/L; Koszt 8ch/Ś; Dostępność 8ch/Ś; Słowa Kluczowe 28ch/L; Koszt IM 8ch/Ś; Podręcznik 17ch/L; Strona 6ch/Ś |
| Ekwipunek Pojazdów | Typ 14ch/L; Nazwa 26ch/L; Opis 48ch/L; Efekt 56ch/L; Koszt 8ch/Ś; Dostępność 8ch/Ś; Słowa Kluczowe 28ch/L; Koszt IM 8ch/Ś; Podręcznik 17ch/L; Strona 6ch/Ś |

Uwagi do tabeli: wartości komórek i nagłówków są takie same we wszystkich zakładkach; nagłówki bez własnej reguły są wyrównane do lewej (domyślna reguła `.dataTable th`). Na telefonie (< 720 px) szerokości kolumn nie obowiązują — tabela zamienia się w karty.

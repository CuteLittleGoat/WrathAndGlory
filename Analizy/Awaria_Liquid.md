# Strona GitHub Pages nie publikowała zmian od 11 października (błąd Liquid w pliku analizy) — analiza

- **Data analizy:** 2026-10-20
- **Temat:** dlaczego po wdrożeniu poprawki generatora DataVault (projekt L) nagłówki zdolności nadal nie były pogrubione
- **Dotyczy:** publikacji całej strony https://cutelittlegoat.github.io/WrathAndGlory/ (wszystkie moduły); widoczny skutek: generator danych w DataVault, a przez dane — karty GeneratorNPC
- **Stan:** przyczyna usunięta (commit `34fc5be`), strona opublikowana 2026-10-20 06:25:37 UTC; zabezpieczenie przed powtórką wdrożone 2026-10-25 — pusty plik `.nojekyll` w katalogu głównym repozytorium (rozdz. 14), na `main` od commitu `dd1574d`; strona opublikowana bez Jekylla 2026-10-25 08:59:35 UTC i sprawdzona (rozdz. 14.5)
- **Aktualizacja:** 2026-10-25 — wybór zabezpieczenia (rozdz. 13.1), jego wdrożenie i weryfikacja (rozdz. 14)

> Uwaga redakcyjna: plik powstał, gdy GitHub Pages przepuszczał każdy plik `.md` przez silnik szablonów Liquid (rozdz. 6). Dlatego każda para klamer otwierających jest w nim zapisana encją HTML `&#123;` (GitHub wyświetla ją jako zwykłą klamrę), a w kodzie i komunikatach z taką parą użyto znaczników `<code>` / `<pre>` zamiast odwrotnych apostrofów. Od wdrożenia `.nojekyll` (rozdz. 14) strona publikuje ten plik bez przetwarzania, jako surowy tekst, w którym encje widać dosłownie. Zapis zostaje bez zmian, bo dzięki niemu plik pozostaje bezpieczny także po ewentualnym ponownym włączeniu Jekylla.

---

## 1. Prompt użytkownika (zachowany w całości)

Zgłoszenie problemu, z dwoma załącznikami: `Repozytorium.xlsx` (aktualne dane) i `firebase-import.json` (plik wygenerowany przed chwilą w DataVault):

> Coś nie zadziałało. Załączam aktualny plik XLSX oraz wygenerowany plik json.
>
> Wpis w module nadal nie jest pogrubiony.

Polecenie przygotowania tej analizy:

> Przygotuj w Analizy/ plik MD dokładnie opisujący problem. Kwestia zabezpieczenia projektu przed powtórką błędu to będzie osobne zadanie.

Oba załączniki zostały użyte wyłącznie do diagnozy i nie trafiły do repozytorium.

Pytanie o zabezpieczenia (2026-10-25, odpowiedź udzielona w czacie; jej wnioski i dane są w rozdz. 13.1):

> Przeczytaj analizę Analizy/Awaria_Liquid.md a następnie w chacie wytłumacz mi (jak osobie nie znającej zagadnień informatycznych) jakie rozwiązania problemu proponujesz i z czym to się wiąże. O ile dobrze rozumiem problem to skłaniam się ku wyłączeniu folderu "Analizy" z budowania strony, ale czy to w pełni rozwiąże problem?

Polecenie wdrożenia zabezpieczenia (2026-10-25):

> Wprowadź rekomendowane rozwiązanie .nojekyll i zaktualizuj analizę Analizy/Awaria_Liquid.md o sposób naprawy.

---

## 2. Zakres analizy

- ustalenie, dlaczego po wypchnięciu poprawki generatora na `main` (projekt L z analizy `Analizy/pogrubienie-naglowkow-zdolnosci-generatornpc-2026-10-11.md`) wpis Bestiariusza LP 180 nadal nie był pogrubiony;
- przyczyna, mechanizm, oś czasu i skutki;
- wykonana naprawa i jej weryfikacja;
- dlaczego problem nie został wykryty wcześniej;
- procedura rozpoznania tego samego problemu w przyszłości;
- możliwe zabezpieczenia (2026-10-20 — zestawienie opcji bez wyboru);
- (2026-10-25) porównanie zabezpieczeń, w tym odpowiedź, czy wyłączenie folderu `Analizy` z budowania strony w pełni usuwa ryzyko;
- (2026-10-25) wdrożenie wybranego zabezpieczenia — pliku `.nojekyll` — i jego weryfikacja.

Poza zakresem: jakiekolwiek zmiany w kodzie modułów (zabezpieczenie nie zmienia żadnego pliku aplikacji; zmieniona jest tylko dokumentacja modułu Main, która opisuje publikację strony).

---

## 3. Odpowiedź w skrócie

1. **Kod był poprawny, ale strona go nie zawierała.** Nowy generator był na `main` od 2026-10-19 14:34 UTC (commit `558420e`), lecz strona GitHub Pages wciąż serwowała pliki z 2026-10-11 13:38 UTC.
2. **GitHub Pages od 11 października przerywał każde budowanie strony.** Od commitu `223a3e3` (2026-10-11 14:05 UTC) wszystkie cztery próby publikacji zakończyły się błędem, więc strona została w ostatniej udanej wersji — bez nowego generatora.
3. **Przyczyna:** w pliku `Analizy/pogrubienie-naglowkow-zdolnosci-generatornpc-2026-10-11.md` (rozdz. 12, kod odrzuconego wariantu B) stał fragment JavaScriptu <code>s.includes("&#123;&#123;")</code>. GitHub Pages przetwarza pliki Markdown silnikiem Jekyll, a ten przepuszcza je przez szablony Liquid, w których dwie klamry otwierające rozpoczynają zmienną. Ta „zmienna” nie miała poprawnego zamknięcia, więc Liquid zgłosił błąd składni i całe budowanie strony zostało przerwane.
4. **Plik wygenerowany przez użytkownika 2026-10-20 06:11 UTC był bajt w bajt wynikiem starego generatora** — przeglądarka dostała ze strony stary `DataVault/xlsxCanonicalParser.js`.
5. **Naprawa:** commit `34fc5be` (2026-10-20 06:24 UTC) zapisuje ten sam warunek bez dwóch klamer obok siebie: `/\{\{/.test(s)`. Budowanie przeszło, strona została opublikowana o 06:25:37 UTC, a generator uruchomiony z plików pobranych z żywej strony daje wynik bajtowo identyczny z nowym `build_json.py`.
6. **Dane nie zostały uszkodzone.** W Firebase jest zapis starego generatora — taki sam jak przed wdrożeniem. Po ponownym wygenerowaniu i imporcie zostanie zastąpiony poprawnym.
7. **Zabezpieczenie przed powtórką (2026-10-25):** w katalogu głównym repozytorium jest pusty plik `.nojekyll`. GitHub Pages przestaje uruchamiać Jekylla, więc pliki `.md` nie przechodzą przez Liquid i żadna ich treść nie może już zatrzymać publikacji. Samo wyłączenie folderu `Analizy` by nie wystarczyło: dokumentacja modułów zawiera 273 podwójne klamry otwierające, a jedna dopisana linia kodu wystarcza, żeby odtworzyć awarię (rozdz. 13.1). Pliki aplikacji publikowane są bez zmian; znikają tylko automatycznie generowane wersje HTML dokumentów, z których żaden moduł nie korzysta (rozdz. 14).

---

## 4. Objaw

- 2026-10-19 poprawka generatora (projekt L) trafiła na `main`.
- 2026-10-20 użytkownik wygenerował pliki w DataVault (`firebase-import.json`, pole `createdAt` = `2026-10-20T06:11:08.741Z`) i zgłosił, że wpis nadal nie jest pogrubiony.
- Bestiariusz LP 180 „Kanoptek Skarabeusz”, kolumna „Zdolności”, w załączonym pliku:
  <code>…o +1.\n&#123;&#123;B}}\nANIHILACJA: Protokoły ożywienia&#123;&#123;/B}}\nKiedy t…</code>
  — to zapis **starego** generatora (pogrubiony enter przed nagłówkiem). Nowy generator zapisuje to samo pole jako:
  <code>…o +1.\n\n&#123;&#123;B}}ANIHILACJA: Protokoły ożywienia&#123;&#123;/B}}\nKiedy t…</code>
- Ten sam stary zapis miały pozostałe wpisy z listy naprawianej przez projekt L (np. LP 34 „Karzełkowiec”).

---

## 5. Diagnoza krok po kroku

### 5.1. Kod w repozytorium był poprawny

- `origin/main` wskazywał `558420e`; pliki `DataVault/` na `main` były identyczne z wersją zweryfikowaną w poprzedniej analizie.
- Nowy `build_json.py` uruchomiony na załączonym `Repozytorium.xlsx` daje dla LP 180 poprawny zapis.

### 5.2. Plik użytkownika powstał starym generatorem

- `dataJson` z załączonego `firebase-import.json` jest identyczny (porównanie obiektów JSON) z wynikiem **starego** `build_json.py` (wersja z commitu `3a3d417`) uruchomionego na załączonym `Repozytorium.xlsx`, a różny od wyniku nowego.
- Stary `build_json.py` i stary parser przeglądarkowy dają bajtowo identyczne pliki (sprawdzone w poprzedniej analizie), więc to dowód, że przeglądarka użytkownika wykonała stary `xlsxCanonicalParser.js`.

### 5.3. Strona serwowała pliki z 11 października

Odpowiedź serwera dla `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/xlsxCanonicalParser.js` (2026-10-20 06:19 UTC):

| Nagłówek / sprawdzenie | Wartość |
|---|---|
| `last-modified` | `Sun, 11 Oct 2026 13:38:22 GMT` |
| `cache-control` | `max-age=600` |
| `x-cache` | `MISS` (odpowiedź prosto z serwera GitHub Pages, nie z pamięci podręcznej) |
| nowa funkcja `wrapWithMarkers` w treści pliku | brak |
| plik identyczny z repozytorium | nie |

To wyklucza pamięć podręczną przeglądarki: sam serwer miał starą wersję pliku. `DataVault/index.html` miał tę samą datę `last-modified`.

### 5.4. Historia budowania GitHub Pages

Repozytorium publikuje stronę „z gałęzi” `main` przez automatyczny workflow GitHuba **pages build and deployment** (w repozytorium nie ma katalogu `.github/workflows`, pliku `_config.yml` ani pliku `.nojekyll`). Każde wypchnięcie na `main` uruchamia jedno budowanie:

| Przebieg | Commit | Start (UTC) | Wynik | Co zawierał commit |
|---|---|---|---|---|
| 1613 | `356f924` | 2026-10-11 13:37 | **sukces** — strona opublikowana 13:38:22 | pierwsza wersja analizy pogrubienia |
| 1614 | `223a3e3` | 2026-10-11 14:05 | **błąd** | poprawki analizy — **dodany fragment z rozdz. 12** |
| 1615 | `43f0edc` | 2026-10-12 17:15 | **błąd** | analiza, część II (wraz z wcześniejszym `a8f89bb`) |
| 1616 | `3a3d417` | 2026-10-12 17:18 | **błąd** | analiza — decyzja użytkownika |
| 1617 | `558420e` | 2026-10-19 14:35 | **błąd** | **nowy generator** (`167936c`) i dokumentacja DataVault (`d080d56`, `2c21200`, `8355289`, `558420e`) |
| 1618 | `34fc5be` | 2026-10-20 06:24 | **sukces** — strona opublikowana 06:25:37 | naprawa opisana w rozdz. 9 |

W każdym nieudanym przebiegu zadanie `build` kończyło się błędem w kroku **Build with Jekyll**, krok **Upload artifact** był pomijany, a zadanie `deploy` — pomijane. Strona nie była więc w ogóle aktualizowana.

### 5.5. Komunikat błędu z budowania

<pre><code>Liquid Exception: Liquid syntax error (line 398): Variable '&#123;&#123;")) return s; const openersBeforeBreak = /((?:\{\{(?:RED|B|I|S)\}' was not properly terminated with regexp: /\}\}/ in Analizy/pogrubienie-naglowkow-zdolnosci-generatornpc-2026-10-11.md</code></pre>

Środowisko budowania (z dziennika GitHuba): obraz `jekyll-build-pages v1.0.13`, `github-pages v232`, `jekyll v3.10.0`, `liquid 4.0.4`, motyw `jekyll-theme-primer`, `Configuration file: none`, wtyczki m.in. `jekyll-optional-front-matter`, `jekyll-readme-index`, `jekyll-relative-links`, `jekyll-titles-from-headings`, `jekyll-default-layout`.

### 5.6. Odtworzenie lokalne

Budowanie zostało odtworzone lokalnie dokładnie tą samą wersją narzędzi (gem `github-pages` 232, czyli Jekyll 3.10.0 i Liquid 4.0.4) na kopii repozytorium ze stanu `558420e`: **ten sam błąd Liquid, w tym samym pliku i linii**. Następnie parser Liquid 4.0.4 został uruchomiony osobno na każdym pliku `.md` w repozytorium (47 plików; plików HTML z nagłówkiem front matter, które Jekyll też przetwarza, nie ma): **błąd miał tylko ten jeden plik**. Pozostałe pliki, także dokumentacja DataVault pełna znaczników formatowania, dawały co najwyżej ostrzeżenia.

---

## 6. Mechanizm

### 6.1. Jak GitHub Pages publikował to repozytorium (do wdrożenia `.nojekyll`)

Opis w rozdz. 6 dotyczy stanu sprzed wdrożenia zabezpieczenia. Od pierwszej publikacji z plikiem `.nojekyll` GitHub Pages nie uruchamia Jekylla ani Liquid (rozdz. 14).

- Pliki HTML, JS, CSS, obrazy i inne pliki bez nagłówka front matter są kopiowane na stronę bez zmian — stąd moduły działają jako zwykłe pliki statyczne.
- Każdy plik `.md` (dzięki wtyczce `jekyll-optional-front-matter` — także bez front matter) jest traktowany jako strona: przechodzi przez **Liquid**, potem przez konwerter Markdown, i powstaje jego wersja `.html` (np. `AGENTS.html`, `DataVault/docs/ZasadyFormatowania.html`, a katalog z `README.md` i bez `index.html` dostaje stronę główną z README). Surowy plik `.md` też jest publikowany bez zmian — z tego korzysta strona główna, która w trakcie działania pobiera `Main/ZmienneHiperlacza.md`.
- **Błąd krytyczny w jednym pliku przerywa całe budowanie.** Nic nie jest publikowane, a strona zostaje w ostatniej udanej wersji. Aplikacje działają dalej normalnie — w starej wersji — i nigdzie na stronie nie pojawia się żaden komunikat.

### 6.2. Jak Liquid czyta dwie klamry

W Liquid dwie klamry otwierające rozpoczynają **zmienną**, która musi kończyć się dwiema klamrami zamykającymi (a klamra z procentem rozpoczyna **tag**). Tokenizer Liquid 4 szuka zamknięcia zmiennej od miejsca otwarcia do **pierwszej klamry zamykającej** (opcjonalnie podwójnej). Jekyll uruchamia Liquid w trybie `warn`, więc część błędów to tylko ostrzeżenia — ale nie wszystkie:

| Tekst w pliku `.md` | Co robi Liquid | Skutek |
|---|---|---|
| <code>&#123;&#123;B}}</code>, <code>&#123;&#123;RED}}</code> | zmienna o nazwie `B` / `RED` (nie istnieje) → pusty tekst | w wersji `.html` znacznik znika; budowanie trwa |
| <code>&#123;&#123;/B}}</code>, <code>&#123;&#123;/RED}}</code> | niepoprawna nazwa zmiennej → **ostrzeżenie** „Unexpected character /” | w wersji `.html` znacznik znika; budowanie trwa |
| <code>s.includes("&#123;&#123;")) return s;</code>, a w następnej linii pierwsza klamra zamykająca to pojedyncze `\}` w wyrażeniu regularnym | zmienna kończy się pojedynczą klamrą zamykającą → **błąd krytyczny** „was not properly terminated” | **budowanie przerwane, strona nieopublikowana** |

Dlatego setki poprawnych znaczników w analizach i dokumentacji nie przeszkadzały w publikacji (budowanie ze stanu `356f924` daje 92 ostrzeżenia, ze stanu `34fc5be` — 198, wszystkie niekrytyczne), a jeden niedomknięty zapis zatrzymał całą stronę. Numer linii w komunikacie (398) to numer linii w pliku `.md`.

### 6.3. Skąd się wziął błędny zapis

- Fragment dodał commit `223a3e3` (2026-10-11 14:05 UTC, „Analiza pogrubienia GeneratorNPC: poprawki po weryfikacji”) jako część kodu **wariantu B** w rozdz. 12 analizy — poprawki po stronie wyświetlania, której ostatecznie nie wdrożono (wybrany został projekt L).
- Kod JavaScriptu był poprawny; problemem było wyłącznie to, że plik analizy jest jednocześnie publikowany jako strona i przetwarzany przez Liquid.

### 6.4. Skutek uboczny bez znaczenia dla aplikacji: zniekształcone wersje HTML dokumentacji

Wersje `.html` plików Markdown publikowane przez Jekyll nie zawierają znaczników formatowania, bo Liquid zamienia je na pusty tekst. Przykład z żywej strony: `DataVault/docs/ZasadyFormatowania.md` zawiera 30 wystąpień <code>&#123;&#123;B}}</code> (i jest identyczny z repozytorium), a `DataVault/docs/ZasadyFormatowania.html` — 0. Moduły nie korzystają z tych stron; dokumentację czyta się w repozytorium na GitHubie, gdzie Markdown jest wyświetlany bez Liquid. Od wdrożenia `.nojekyll` te wersje `.html` w ogóle nie powstają (rozdz. 14.4).

---

## 7. Oś czasu (UTC)

| Czas | Zdarzenie |
|---|---|
| 2026-10-11 13:38 | ostatnia udana publikacja strony (`356f924`) — ta wersja była serwowana do 2026-10-20 06:25 |
| 2026-10-11 14:05 | `223a3e3` dodaje fragment z rozdz. 12 → pierwsze nieudane budowanie |
| 2026-10-12 17:15–17:18 | kolejne commity analizy → dwa nieudane budowania |
| 2026-10-12 17:33 | `167936c` — nowy generator (na gałęzi roboczej) |
| 2026-10-13 03:32 | użytkownik generuje pliki w DataVault do weryfikacji — jeszcze przed wdrożeniem, więc stary generator jest tu oczekiwany |
| 2026-10-19 14:34–14:35 | `167936c`…`558420e` trafiają na `main` → nieudane budowanie; nowy generator nie zostaje opublikowany |
| 2026-10-20 06:11 | użytkownik generuje pliki w DataVault → wynik starego generatora; zgłoszenie problemu |
| 2026-10-20 06:19 | diagnoza: serwowany plik ma `last-modified` z 2026-10-11; historia budowania pokazuje błędy od `223a3e3` |
| 2026-10-20 06:24 | `34fc5be` — naprawa → udane budowanie (06:24:53–06:25:41) |
| 2026-10-20 06:25:37 | nowa wersja plików na stronie (`last-modified` serwowanego `xlsxCanonicalParser.js`) |

---

## 8. Skutki

- **Jedyna zmiana aplikacji, która czekała na publikację:** generator danych DataVault (`DataVault/xlsxCanonicalParser.js`; `DataVault/build_json.py` jest skryptem lokalnym i na stronie nie jest używany) oraz dokumentacja DataVault. Wszystkie pozostałe commity w okresie 2026-10-11 14:05 – 2026-10-19 dotyczyły wyłącznie folderu `Analizy/`.
- **Pliki generowane w DataVault od 2026-10-19 do 2026-10-20 06:25** powstawały starym generatorem. Dane w Firebase mają stary zapis — dokładnie taki jak przed wdrożeniem; nic nie zostało uszkodzone ani utracone.
- **`build_json.py` uruchamiany lokalnie** nie był dotknięty problemem — działa z plików repozytorium, nie ze strony.
- **Brak jakiegokolwiek widocznego błędu:** moduły działały normalnie w starej wersji.

---

## 9. Naprawa (commit `34fc5be`)

Jedna linia w `Analizy/pogrubienie-naglowkow-zdolnosci-generatornpc-2026-10-11.md` (rozdz. 12, kod wariantu B):

| Przed | Po |
|---|---|
| <code>if (!s.includes("&#123;&#123;")) return s;</code> | `if (!/\{\{/.test(s)) return s;` |

- Oba warunki dają ten sam wynik dla każdego napisu (oba sprawdzają, czy w tekście występują dwie klamry otwierające obok siebie); sprawdzone na przykładowych napisach.
- W nowym zapisie między klamrami stoją ukośniki wsteczne, więc Liquid nie widzi dwóch klamer obok siebie.
- Kod wariantu B nie jest używany przez żaden moduł; żaden inny plik nie został zmieniony.

---

## 10. Weryfikacja naprawy

| Sprawdzenie | Wynik |
|---|---|
| Lokalne budowanie `github-pages` 232 dla stanu `558420e` | ten sam błąd Liquid co na GitHubie (odtworzenie przyczyny) |
| Parser Liquid 4.0.4 na każdym pliku `.md` (47) przed naprawą | błąd krytyczny tylko w jednym pliku |
| Lokalne budowanie po naprawie | kod wyjścia 0; 198 ostrzeżeń, wszystkie niekrytyczne |
| Lista plików zbudowanej strony a budowanie ze stanu `356f924` | identyczna (żadnego pliku więcej ani mniej) |
| Pliki aplikacji w zbudowanej stronie a repozytorium | bajtowo identyczne: `DataVault/xlsxCanonicalParser.js`, `DataVault/app.js`, `DataVault/index.html`, `DataVault/build_json.py`, `GeneratorNPC/index.html`, `Main/index.html`, `Main/ZmienneHiperlacza.md`, `shared/firebase-data-loader.js` |
| Budowanie na GitHubie (przebieg 1618) | **sukces** |
| Pliki na żywej stronie a repozytorium | bajtowo identyczne: `DataVault/xlsxCanonicalParser.js`, `DataVault/app.js`, `DataVault/index.html`, `GeneratorNPC/index.html`, `Main/index.html`, `shared/firebase-data-loader.js` |
| Generator z plików pobranych z żywej strony (prawdziwa strona DataVault w Chromium) na najnowszym `Repozytorium.xlsx` | wynik **bajtowo identyczny** z nowym `build_json.py`; LP 180 ma zapis <code>…o +1.\n\n&#123;&#123;B}}ANIHILACJA: Protokoły ożywienia&#123;&#123;/B}}\nKiedy t…</code> |
| Stary a nowy generator na najnowszym `Repozytorium.xlsx` | 81 zmienionych pól (Archetypy 17, Bestiariusz 14, Premie z Przeszłości Frakcji 40, Specjalne Bonusy Frakcji 1, Słowa Kluczowe Frakcji 8, Talenty 1); widoczny tekst bez zmian; `_meta` identyczne; pola z parą znaczników obejmującą enter: 81 (140 par) → 0 |
| Wygląd tych pól (prawdziwe funkcje wyświetlania GeneratorNPC i DataVault) | 1069 znaków zyskuje styl, 0 traci; liczba pasków na kartach bez zmian; zmiana wyglądu w 14 polach Bestiariusza (karta i tabele) i 2 polach „Słów Kluczowych Frakcji” (tabele); zmiany w Archetypach i Talentach dotyczą tylko położenia znaczników przy enterach i spacjach |

Najnowszy plik ma 81 zmienionych pól zamiast 63 z poprzedniej analizy, bo jego treść się zmieniła (nowe i poprawione wpisy). Wśród naprawianych nagłówków doszedł Bestiariusz LP 194 „ZGUBA: Wykrywacz celu”.

---

## 11. Dlaczego problem nie został wykryty wcześniej

1. **Nieudane budowanie nie daje żadnego sygnału na stronie.** Strona dalej serwuje ostatnią udaną wersję, a aplikacje działają normalnie. Błąd widać tylko w zakładce **Actions** repozytorium (czerwony status „pages build and deployment”) i ewentualnie w powiadomieniach GitHuba — zależnie od ustawień konta.
2. **Przez pierwszy tydzień brak publikacji nie miał widocznych skutków.** Od 2026-10-11 do 2026-10-19 na `main` trafiały wyłącznie pliki analiz.
3. **Weryfikacja poprawki generatora sprawdzała kod, a nie publikację.** Testy z 12–19 października uruchamiały stronę DataVault w Chromium z plików na dysku. Potwierdziły poprawność kodu, ale nie obejmowały tego, co faktycznie serwuje GitHub Pages. Po wypchnięciu na `main` 2026-10-19 nie został sprawdzony ani status budowania, ani wersja pliku na żywej stronie; instrukcja dla użytkownika zakładała, że publikacja nastąpi w ciągu kilku minut.
4. **Nic nie wskazywało na ryzyko.** Analizy i dokumentacja zawierają setki znaczników z dwiema klamrami, które dają tylko ostrzeżenia; dopiero jeden niedomknięty zapis jest krytyczny.

---

## 12. Jak rozpoznać ten problem

Przy obecnym pliku `.nojekyll` (rozdz. 14) kroki 3–4 mają znaczenie tylko wtedy, gdy plik zostanie usunięty albo Jekyll zostanie włączony ponownie. Kroki 1–2 warto wykonywać zawsze przy ważnych zmianach, bo publikacja może się nie udać także z przyczyn niezwiązanych z treścią plików (rozdz. 14.7).

1. **Status publikacji:** repozytorium → zakładka **Actions** → workflow **pages build and deployment**. Ostatni przebieg dla `main` powinien mieć status sukcesu. Przy błędzie: zadanie `build` → krok **Build with Jekyll** → wiersz `Liquid Exception: … in` z nazwą pliku i numerem linii.
2. **Wersja pliku na stronie:** nagłówek `last-modified` dowolnego pliku strony (np. `DataVault/xlsxCanonicalParser.js`) powinien odpowiadać czasowi ostatniej publikacji; można też porównać treść pliku ze strony z plikiem w repozytorium.
3. **Odtworzenie lokalne:** Ruby i gem `github-pages` w tej samej wersji co na GitHubie (dziennik budowania podaje wersję). Jekyll zatrzymuje się na pierwszym błędzie, więc żeby znaleźć wszystkie, warto sprawdzić każdy plik `.md` osobno samym parserem Liquid.

   ```text
   # Gemfile
   source "https://rubygems.org"
   gem "github-pages", "232", group: :jekyll_plugins
   gem "webrick"

   # instalacja i budowanie kopii repozytorium (bez zapisywania wyniku w repozytorium);
   # LC_ALL=C.UTF-8 jest konieczne, inaczej Jekyll przerywa na polskich znakach
   bundle install
   LC_ALL=C.UTF-8 PAGES_REPO_NWO=CuteLittleGoat/WrathAndGlory \
     bundle exec github-pages build --source KOPIA_REPOZYTORIUM --destination KATALOG_WYNIKOWY
   ```

   Skrypt sprawdzający każdy plik osobno (uruchamiany przez `bundle exec ruby liquid_check.rb KOPIA_REPOZYTORIUM`):

   ```ruby
   require "liquid"
   Liquid::Template.error_mode = :warn   # tak jak Jekyll (liquid.error_mode domyślnie "warn")
   root = ARGV[0]
   bad = 0
   Dir.glob(File.join(root, "**", "*.{md,markdown,html}")).sort.each do |f|
     rel = f.sub(root + "/", "")
     src = File.read(f, encoding: "UTF-8")
     # Liquid dotyczy plików .md oraz plików HTML z nagłówkiem front matter
     next if f.end_with?(".html") && !src.start_with?("---")
     begin
       Liquid::Template.parse(src, line_numbers: true)
     rescue => e
       bad += 1
       puts "BŁĄD  #{rel}: #{e.message[0, 160].gsub("\n", " ")}"
     end
   end
   puts "plików z błędem Liquid: #{bad}"
   ```

4. **W pliku wskazanym w komunikacie** szukamy dwóch klamer otwierających (albo klamry z procentem), po których nie ma poprawnego zamknięcia — najczęściej we fragmentach kodu, wyrażeniach regularnych i napisach w cudzysłowie.

---

## 13. Możliwe zabezpieczenia i wybór

Zestawienie opcji przygotowane w ramach diagnozy (2026-10-20), wtedy bez rekomendacji wyboru. Wybór — rozdz. 13.1, wdrożenie — rozdz. 14.

| Opcja | Co daje | Skutki uboczne / ograniczenia |
|---|---|---|
| plik `.nojekyll` w katalogu głównym repozytorium | GitHub publikuje pliki bez Jekylla — pliki `.md` w ogóle nie przechodzą przez Liquid | znikają wersje `.html` plików `.md` (np. `AGENTS.html`, `DataVault/docs/ZasadyFormatowania.html`) i strony katalogów z `README.md`; surowe pliki `.md` zostają, więc `Main/ZmienneHiperlacza.md` działa dalej; pliki i foldery zaczynające się od `_` zaczęłyby być publikowane (dziś takich nie ma) |
| `_config.yml` z wykluczeniem folderu `Analizy` | analizy nie przechodzą przez Jekylla | analizy przestają być publikowane na stronie; dokumentacja modułów nadal przechodzi przez Liquid, więc błędny zapis w niej nadal może zatrzymać publikację; nowy plik konfiguracji strony |
| zasada pisania plików `.md` | np. dwie klamry zapisywane encją `&#123;` (jak w tym pliku) | wymaga stałej dyscypliny przy każdej analizie i dokumentacji; łatwo przeoczyć |
| kontrola po każdym wypchnięciu na `main` | sprawdzenie statusu w Actions albo `last-modified` na stronie (rozdz. 12) | wykrywa problem, ale mu nie zapobiega |
| kontrola Liquid przed commitem | skrypt z rozdz. 12 | wymaga Ruby i gemów w środowisku pracy |

### 13.1. Wybór zabezpieczenia (2026-10-25)

Użytkownik rozważał wyłączenie folderu `Analizy` z budowania strony i zapytał, czy to w pełni rozwiąże problem. Odpowiedź: **nie w pełni** — wyłączenie usuwa najbardziej ryzykowne źródło, ale nie całe ryzyko. Sprawdzenie na stanie `2642b0b`, przed wdrożeniem zabezpieczenia:

| Sprawdzenie | Wynik |
|---|---|
| Pliki `.md` poza `Analizy/` zawierające dwie klamry otwierające obok siebie | 5 plików, 273 wystąpienia: `DataVault/docs/Documentation.md` 122, `DataVault/docs/ZasadyFormatowania.md` 110, `DetaleLayout.md` 23, `GeneratorNPC/docs/Documentation.md` 16, `DataVault/docs/README.md` 2; klamry z procentem — 0 |
| Pliki `.md` w `Analizy/` zawierające dwie klamry otwierające obok siebie | 0 (cztery obecne analizy) |
| Parser Liquid 4.0.4 na każdym pliku `.md` (skrypt z rozdz. 12) | 0 błędów krytycznych; 125 ostrzeżeń w 4 plikach — wszystkie poza `Analizy/` |
| Pełne lokalne budowanie `github-pages` 232 | sukces, 125 ostrzeżeń — strona publikowała się poprawnie |
| Symulacja: do **kopii** `DataVault/docs/Documentation.md` dopisana jedna linia kodu takiego jak w awarii (warunek z dwiema klamrami w cudzysłowie, a w następnej linii wyrażenie regularne z pojedynczą klamrą zamykającą) | błąd krytyczny „Variable … was not properly terminated” — ten sam, który zatrzymał stronę |

Wnioski:

- Dokumentacja DataVault z natury opisuje znaczniki formatowania z dwiema klamrami, a zasady repozytorium wymagają jej aktualizacji przy każdej zmianie kodu modułu. Po wyłączeniu samego folderu `Analizy` ta dokumentacja nadal przechodziłaby przez Liquid i mogłaby zatrzymać publikację tak samo jak analiza z 11 października.
- Wyłączanie kolejnych folderów wymagałoby pamiętania o każdym nowym miejscu z plikami `.md` i nie mogłoby obejmować `Main/ZmienneHiperlacza.md`, który strona główna pobiera w trakcie działania.
- Plik `.nojekyll` usuwa przyczynę dla wszystkich plików naraz, nie wymaga dyscypliny przy pisaniu, a jego skutki uboczne nie dotyczą działania modułów (rozdz. 14.4).
- Opcji `.nojekyll` i `_config.yml` nie da się połączyć: przy `.nojekyll` Jekyll nie działa, więc `_config.yml` nie jest czytany. Ukrycie analiz na stronie nie jest celem tego zabezpieczenia — analizy są dalej publikowane jako surowe pliki `.md`, tak jak przed zmianą.

**Wybrane zabezpieczenie: plik `.nojekyll`** (polecenie użytkownika z 2026-10-25, rozdz. 1).

---

## 14. Wdrożone zabezpieczenie: plik `.nojekyll` (2026-10-25)

### 14.1. Zmiana

- Nowy pusty plik `.nojekyll` (0 bajtów) w katalogu głównym repozytorium, obok `manifest.webmanifest`. Liczą się tylko nazwa i położenie pliku, treść nie ma znaczenia.
- Dokumentacja modułu Main opisuje publikację strony i rolę pliku: `Main/docs/Documentation.md` (rozdział „Publikacja w GitHub Pages i plik `.nojekyll`”, tabela struktury plików, procedura odtworzenia, testy kontrolne) oraz `Main/docs/README.md` (rozdział „Jak zmiany trafiają na stronę” i wiersz w tabeli typowych problemów).
- Żaden plik aplikacji nie został zmieniony. W repozytorium nie powstały `_config.yml` ani `.github/workflows`.
- Zmiana trafiła na `main` w commicie `dd1574d` (2026-10-25 08:59 UTC), bezpośrednio po commicie `ed42f5b` (zmiany modułu Audio, bez wspólnych plików z tą zmianą).

### 14.2. Jak działa

- GitHub Pages publikujący „z gałęzi” sprawdza, czy w katalogu źródłowym jest plik `.nojekyll`. Jeśli jest, pomija Jekylla i publikuje pliki repozytorium bez przetwarzania (mechanizm opisany w dokumentacji GitHub Pages, w części o Jekyllu i generatorach stron statycznych).
- Skutek: Liquid w ogóle nie czyta plików `.md`. Podwójne klamry, znaczniki formatowania i fragmenty kodu w analizach, instrukcjach i dokumentacji nie mają wpływu na publikację — ani teraz, ani w przyszłych plikach.
- Workflow **pages build and deployment** nadal uruchamia się po każdym wypchnięciu na `main`; zmienia się tylko to, że strona nie jest budowana Jekyllem.

### 14.3. Weryfikacja przed wdrożeniem

Porównanie wykonane lokalnie na stanie `2642b0b` (gem `github-pages` 232, czyli Jekyll 3.10.0 i Liquid 4.0.4 — ta sama wersja co na GitHubie):

| Sprawdzenie | Wynik |
|---|---|
| Strona zbudowana dotychczasowym sposobem (Jekyll) | sukces, 125 ostrzeżeń, 223 pliki wynikowe |
| Pliki repozytorium, czyli to, co GitHub publikuje przy `.nojekyll` | 184 pliki (plus sam `.nojekyll`) |
| Pliki obecne w obu zestawach | 180, wszystkie **bajtowo identyczne** — Jekyll i tak kopiował je bez zmian; dotyczy to wszystkich plików HTML, JS, CSS, JSON i obrazów modułów oraz surowych plików `.md`, w tym `Main/ZmienneHiperlacza.md` |
| Pliki, które znikają ze strony | 43, wyłącznie generowane przez Jekylla: 34 wersje `.html` plików `.md`, 8 stron folderów `*/docs/index.html` tworzonych z `README.md` i arkusz stylów motywu `assets/css/style.css` |
| Pliki, które mogą dojść | pliki zaczynające się od kropki, które Jekyll pomijał: `.gitignore` i trzy puste pliki `.gitkeep` (`Analizy/`, `Infoczytnik/assets/`, `Kalkulator/vendor/`); bez danych wrażliwych |
| Odwołania modułów do znikających plików | brak — przeszukanie plików HTML, JS, CSS, JSON i `manifest.webmanifest`: jedynym plikiem `.md` używanym przez aplikacje jest `Main/ZmienneHiperlacza.md`, pobierany w surowej postaci; nic nie prowadzi do wersji `.html` dokumentów ani do stron `docs/` |
| Adresy folderów używane w linkach (`Kalkulator/`, `GeneratorNPC/`, `Infoczytnik/`) | każdy folder ma własny `index.html`, więc działa bez Jekylla |
| Katalog główny strony | nie ma `index.html` ani `README.md` — adres główny strony zwraca 404 tak samo przed zmianą, jak po niej; punktem wejścia jest `Main/index.html` (także w `manifest.webmanifest`) |
| Pliki, które Jekyll by pominął (nazwy zaczynające się od `_`, `#`, kończące się `~`), dowiązania symboliczne, pliki `.scss` / `.sass` / `.coffee`, pliki HTML z front matter | brak w repozytorium |

### 14.4. Skutki uboczne

| Element strony | Przed (Jekyll) | Po (`.nojekyll`) |
|---|---|---|
| Pliki aplikacji (HTML, JS, CSS, JSON, obrazy) | kopiowane bez zmian | kopiowane bez zmian |
| Surowe pliki `.md` (np. `Main/ZmienneHiperlacza.md`) | publikowane | publikowane bez zmian |
| Wersje `.html` plików `.md` (np. `AGENTS.html`, `DataVault/docs/ZasadyFormatowania.html`) | publikowane, zniekształcone — bez znaczników formatowania (rozdz. 6.4) | nie powstają, adres zwraca 404 |
| Strony folderów z `README.md` (np. `DataVault/docs/`) | publikowane | nie powstają, adres zwraca 404 |
| `assets/css/style.css` (styl motywu `jekyll-theme-primer` dla powyższych stron) | publikowany | nie powstaje |
| Analizy | publikowane jako `.md` i `.html` | publikowane jako `.md` |
| Dokumentacja w repozytorium na GitHubie | wyświetlana normalnie | wyświetlana normalnie (GitHub nie używa Liquid) |

### 14.5. Kontrola po wypchnięciu na `main`

Procedura kontrolna:

1. Zakładka **Actions** → najnowszy przebieg **pages build and deployment** dla commitu ze zmianą kończy się sukcesem.
2. `Main/index.html` na stronie: przyciski „Mapa” i „Obrazki” mają adresy z `Main/ZmienneHiperlacza.md`; nagłówek `last-modified` pliku odpowiada czasowi publikacji.
3. Adres `AGENTS.html` na stronie zwraca 404 — potwierdzenie, że Jekyll nie przetwarza plików.
4. Pliki aplikacji pobrane ze strony (np. `DataVault/xlsxCanonicalParser.js`) są identyczne z repozytorium.

Wynik kontroli dla commitu `dd1574d` (2026-10-25):

| Sprawdzenie | Wynik |
|---|---|
| Przebieg **pages build and deployment** nr 1633 | **sukces**; zadanie `build` miało tylko kroki **Checkout** i **Upload artifact** — kroku **Build with Jekyll** nie było, co potwierdza, że GitHub honoruje `.nojekyll` |
| `last-modified` serwowanego `Main/index.html` | `Sun, 25 Oct 2026 08:59:35 GMT` |
| Pliki pobrane z żywej strony a repozytorium | bajtowo identyczne: `Main/index.html`, `Main/ZmienneHiperlacza.md`, `DataVault/xlsxCanonicalParser.js`, `DataVault/app.js`, `DataVault/index.html`, `GeneratorNPC/index.html`, `shared/firebase-data-loader.js`, `Audio/app.js`, `Audio/style.css`, `manifest.webmanifest`, `Analizy/Awaria_Liquid.md`, `DataVault/docs/ZasadyFormatowania.md` |
| Adresy folderów `Kalkulator/`, `GeneratorNPC/`, `Infoczytnik/` | 200 |
| `AGENTS.html`, `DataVault/docs/`, `DataVault/docs/ZasadyFormatowania.html`, `assets/css/style.css` | 404 — strony generowane przez Jekylla już nie powstają |
| `.nojekyll` | 200 — plik jest publikowany (pusty, bez znaczenia dla działania strony) |
| Prawdziwa strona `Main/index.html` w Chromium | przyciski „Mapa” i „Obrazki” mają adresy z `Main/ZmienneHiperlacza.md` |

### 14.6. Jak cofnąć

Usunięcie pliku `.nojekyll` z `main`. Następna publikacja znów użyje Jekylla — wracają wtedy wersje `.html` dokumentów, ale też ryzyko opisane w rozdz. 6.

### 14.7. Ograniczenia

`.nojekyll` usuwa przyczyny związane z Jekyllem: składnię Liquid, front matter i przetwarzanie Markdown. Publikacja może nadal się nie udać z przyczyn po stronie GitHuba (np. awaria usługi albo przekroczenie limitów GitHub Pages). Wtedy strona też zostaje w poprzedniej wersji bez komunikatu, dlatego przy ważnych zmianach warto sprawdzić status publikacji (rozdz. 12, pkt 1–2).

---

## 15. Ryzyka

| Ryzyko | Ocena | Uwagi |
|---|---|---|
| Powtórka: kolejny plik `.md` z niedomkniętą parą klamer (albo klamrą z procentem) zatrzyma publikację bez widocznego komunikatu | wyeliminowane, dopóki `.nojekyll` leży w katalogu głównym `main` | wraca po usunięciu `.nojekyll` albo po przejściu na publikację z Jekyllem (np. własny workflow) |
| Usunięcie `.nojekyll` przy porządkowaniu repozytorium | niskie | plik jest pusty, a jego nazwa zaczyna się od kropki, więc łatwo go uznać za zbędny; jego rola jest opisana w dokumentacji technicznej i instrukcji modułu Main |
| Nieudana publikacja z przyczyn niezwiązanych z treścią plików | niskie | rozdz. 14.7; strona zostaje wtedy w poprzedniej wersji bez komunikatu |
| Pamięć podręczna po publikacji | niskie | pliki strony mają `max-age=600`; przez ok. 10 minut po publikacji przeglądarka może używać starej wersji — pomaga twarde odświeżenie (`Ctrl` + `F5`, na Macu `Cmd` + `Shift` + `R`) |
| Zniekształcone wersje HTML dokumentacji na stronie | nie dotyczy | rozdz. 6.4 i 14.4; od wdrożenia `.nojekyll` te strony nie powstają |
| Ten plik analizy | sprawdzone | zapisany bez dwóch klamer obok siebie; sprawdzony parserem Liquid i pełnym lokalnym budowaniem strony |

---

## 16. Następne kroki

1. **Użytkownik — ponowne wygenerowanie danych:**
   1. otworzyć `DataVault/index.html?admin=1` i odświeżyć stronę z pominięciem pamięci podręcznej (`Ctrl` + `F5`, na Macu `Cmd` + `Shift` + `R`);
   2. kliknąć „Generuj pliki danych” i wskazać `Repozytorium.xlsx` (plik z 2026-10-20 06:11 powstał starym generatorem i trzeba go wygenerować ponownie);
   3. **przed odświeżeniem strony** sprawdzić Bestiariusz LP 180 „Kanoptek Skarabeusz” — nagłówek „ANIHILACJA: Protokoły ożywienia” ma być pogrubiony (opcjonalnie: polecenie kontrolne z `DataVault/docs/README.md`, wynik — pusta tabela);
   4. zaimportować nowy `firebase-import.json` do Firebase Realtime Database na poziomie głównym `/`;
   5. odświeżyć GeneratorNPC i wygenerować kartę Kanopteka.
2. **Zabezpieczenie:** wykonane — `.nojekyll` jest na `main`, strona opublikowana i sprawdzona (rozdz. 14.5). Pliku nie usuwać.
3. **Na co dzień:** przy ważnych zmianach nadal sprawdzać status publikacji (rozdz. 12, pkt 1–2), bo `.nojekyll` nie chroni przed awariami po stronie GitHuba (rozdz. 14.7).

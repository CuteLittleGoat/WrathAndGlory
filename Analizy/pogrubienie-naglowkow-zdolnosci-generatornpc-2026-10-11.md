# Brak pogrubienia części nagłówków w sekcji „Zdolności” na karcie GeneratorNPC — analiza

> **Data:** 11 października 2026
> **Temat:** dlaczego na karcie „Kanoptek Skarabeusz” (LP 180) nagłówek „ANIHILACJA: Protokoły ożywienia” wychodzi zwykłą czcionką, choć w `Repozytorium.xlsx` jest pogrubiony, a na karcie „Rozdzieracz” (LP 185) ten sam nagłówek wygląda prawidłowo
> **Charakter dokumentu:** analiza przyczyny. Kod nie został zmieniony — zgodnie z poleceniem użytkownika
> **Moduły, których dotyczy:** GeneratorNPC (karta i tabela podglądu), DataVault (generator danych i tabela)

---

## 1. Prompt użytkownika (zachowany w całości)

> Zapoznaj się z repo "WrathAndGlory" a w szczególności z modułem "GeneratorNPC".
> Czemu przy niektórych wpisach, np. "Kanoptek Skarabeusz" (LP 180) tekst "ANIHILACJA: Protokoły ożywienia" nie jest pogrubiony, mimo, że w pliku XLSX z którego generowany jest plik json jest pogrubiony tekst?
>
> W innych, np. "Rozdzieracz" (LP 185) wyświetla się prawidłowo.
>
> Nie poprawiaj jeszcze nic. Przeprowadź dokładną analizę. Plik z analizą wrzuć na Main.

Do polecenia dołączone były cztery zrzuty ekranu:

1. karta GeneratorNPC „KANOPTEK SKARABEUSZ” — w sekcji „Zdolności” pogrubione są „DETERMINACJA” i „ZGUBA: Autodestrukcja”, a „ANIHILACJA: Protokoły ożywienia” jest zwykłą czcionką;
2. arkusz Excela, kolumny T („Premie”) i U („Zdolności”) wiersza „Rozdzieracz” — nagłówki zdolności pogrubione;
3. karta GeneratorNPC „ROZDZIERACZ” — wszystkie nagłówki zdolności, łącznie z „ANIHILACJA: Protokoły ożywienia”, pogrubione;
4. arkusz Excela, kolumny R–U wiersza „Kanoptek Skarabeusz” — „DETERMINACJA:”, „ZGUBA: Autodestrukcja” i „ANIHILACJA: Protokoły ożywienia” pogrubione.

---

## 2. Zakres analizy

- Droga tekstu od komórki XLSX do karty: parsery `DataVault/xlsxCanonicalParser.js` i `DataVault/build_json.py`, budowa `data.json` / `firebase-import.json` w `DataVault/app.js`, wczytanie przez `shared/firebase-data-loader.js`, renderowanie w `GeneratorNPC/index.html`.
- Odtworzenie błędu na **prawdziwym kodzie** (funkcje wycięte ze źródeł bez przepisywania) w Node oraz na **prawdziwej stronie GeneratorNPC** uruchomionej w Chromium (z podstawionymi danymi zamiast Firebase).
- Sprawdzenie archiwalnych wersji `Repozytorium.xlsx` i `data.json` odzyskanych z historii gita (pliki usunięto z repozytorium 12 maja 2026; ostatnia wersja z 27 kwietnia 2026 zawiera 66 wpisów Bestiariusza).
- Przegląd hipotez alternatywnych i ich wykluczenie.
- Skala zjawiska w archiwalnych danych oraz inne miejsca, w których ten sam błąd jest widoczny.
- Warianty naprawy (bez wdrażania).

**Ograniczenie:** aktualny `Repozytorium.xlsx` ani aktualne dane z Firebase (`/datavault/live`) nie są dostępne z poziomu repozytorium — baza wymaga logowania i App Check. Wpisu LP 180 nie dało się więc obejrzeć bezpośrednio. Wniosek opiera się na: dokładnym dopasowaniu objawów, odtworzeniu mechanizmu na prawdziwym kodzie oraz identycznych przypadkach w archiwalnym pliku XLSX. Rozdział 10 opisuje, jak potwierdzić go na aktualnych danych w minutę.

---

## 3. Odpowiedź w skrócie

**Przyczyna leży w tym, jak w komórce Excela zapisane jest pogrubienie — konkretnie w niewidocznym znaku nowej linii (enterze) przed nagłówkiem.**

W komórce „Kanoptek Skarabeusz” pogrubienie nagłówka „ANIHILACJA: Protokoły ożywienia” **zaczyna się o jeden znak za wcześnie**: obejmuje także enter kończący pustą linię nad nagłówkiem. W Excelu tego nie widać (enter nie ma kształtu, więc pogrubiony enter wygląda tak samo jak zwykły), ale w pliku XLSX pogrubiony fragment zaczyna się od „nowa linia + ANIHILACJA…”.

DataVault zamienia pogrubienie na znaczniki `{{B}}` … `{{/B}}` i stawia je dokładnie tam, gdzie zaczyna się i kończy pogrubiony fragment. Powstaje tekst:

```
…zwiększa DK i Cechę Wybuchowa o +1.
{{B}}
ANIHILACJA: Protokoły ożywienia{{/B}}
Kiedy to Zagrożenie ginie, rzuć 1k6. …
```

Znacznik otwierający `{{B}}` wylądował w **osobnej linii, nad nagłówkiem**. GeneratorNPC dzieli sekcję „Zdolności” na osobne paski (wpisy) według linii i formatuje każdy pasek niezależnie:

- samotna linia `{{B}}` zostaje doklejona na koniec poprzedniego paska (ZGUBA) — tam nie ma po niej żadnego tekstu, więc nic nie pogrubia;
- pasek „ANIHILACJA…” dostaje tylko znacznik zamykający `{{/B}}` bez otwierającego — taki znacznik jest ignorowany, więc nagłówek wychodzi **zwykłą czcionką**.

W komórce „Rozdzieracz” enter przed „ANIHILACJA” nie jest pogrubiony, więc znacznik `{{B}}` stoi bezpośrednio przed słowem „ANIHILACJA” w tej samej linii i pogrubienie działa.

To nie jest jednorazowy przypadek: ten sam układ występuje w archiwalnym pliku XLSX przy wpisach **Genokrad (LP 43)** i **Karzełkowiec (LP 34)**, a w styczniu 2026 występował przy **Termagancie** — tam usunięto go samą poprawką formatowania w Excelu (rozdz. 7.4).

**Szybka naprawa danych (bez zmian w kodzie):** w Excelu zdjąć pogrubienie z entera przed „ANIHILACJA”, wygenerować dane w DataVault i zaimportować je do Firebase (rozdz. 11). **Trwała naprawa:** uodpornić kod, żeby taki układ nie psuł karty (rozdz. 12).

---

## 4. Jak tekst trafia z komórki XLSX na kartę

| Krok | Plik i miejsce | Co się dzieje z tekstem |
|---|---|---|
| 1 | `Repozytorium.xlsx` (`xl/sharedStrings.xml`) | Komórka z mieszanym formatowaniem jest zapisana jako ciąg fragmentów (`<r>`). Każdy fragment ma własne ustawienia (`<rPr>`, np. `<b/>` = pogrubienie) i własny tekst (`<t>`), **razem ze znakami nowej linii** |
| 2 | `DataVault/xlsxCanonicalParser.js:57-87` (`wrapWithMarkers`, `richTextToString`) — w przeglądarce; `DataVault/build_json.py:82-111` (`_wrap_with_markers`, `_rich_text_to_string`) — w wierszu poleceń | Każdy fragment jest owijany w znaczniki **w całości**: `{{B}}` + tekst fragmentu + `{{/B}}`. Nowe linie wewnątrz fragmentu zostają wewnątrz znaczników. Oba parsery dają identyczny wynik |
| 3 | `xlsxCanonicalParser.js:126-139` (`rowsToRecords`), `build_json.py:113-123` | Cała komórka jest przycinana (`trim`) i zamieniane są polskie cudzysłowy. Znaczniki w środku tekstu nie są przesuwane |
| 4 | `DataVault/app.js:1251-1262` (`buildFirebaseImportJson`) | Gotowy `data.json` jest zapisywany jako jeden napis `dataJson` w `firebase-import.json` (import ręczny do `/datavault/live`) |
| 5 | `shared/firebase-data-loader.js` (`loadDataVaultLive`) | GeneratorNPC pobiera `/datavault/live` przy każdym wczytaniu strony i rozpakowuje `dataJson` bez zmian |
| 6 | `GeneratorNPC/index.html:3024` | `abilities = toDisplayString(getRecordValue(record, "Zdolności"))` — surowy napis ze znacznikami |
| 7 | `GeneratorNPC/index.html:3051-3066` | Sekcje „paskowe” (Premie, Zdolności, Atak, Zdolności Hordy, Opcje Hordy, moduły) przechodzą przez `splitEntries` (3055) i `formatSectionEntries` (3058) |
| 8 | `GeneratorNPC/index.html:2269-2298` (`splitEntries`) | Tekst jest dzielony na linie (`split(/\r?\n/)`), linie są przycinane, puste odrzucane. Nowy pasek zaczyna się, gdy linia pasuje do `entryStartRegex` (2274-2275), np. „COŚ: ” na początku; w przeciwnym razie linia jest doklejana spacją do bieżącego paska |
| 9 | `GeneratorNPC/index.html:2300-2306` (`formatSectionEntries`) → `1075-1169` (`formatInlineHTML`) | **Każdy pasek jest formatowany osobno**, z pustym stosem znaczników. Zamknięcie bez otwarcia jest pomijane, otwarcie bez zamknięcia działa tylko do końca tego paska |

Kluczowe jest zestawienie kroku 2 i kroku 9: parser dopuszcza, by para `{{B}}…{{/B}}` obejmowała znak nowej linii, a karta formatuje każdy pasek niezależnie i nie przenosi otwartych znaczników z linii na linię.

---

## 5. Mechanizm błędu krok po kroku (Kanoptek Skarabeusz)

### 5.1. Komórka w Excelu

Widoczny tekst końcówki komórki (dla porządku: `⏎` = znak nowej linii z Alt+Enter):

```
Każdy kolejny wybuchający skarabeusz zwiększa DK i Cechę Wybuchowa o +1.⏎
⏎
ANIHILACJA: Protokoły ożywienia⏎
Kiedy to Zagrożenie ginie, rzuć 1k6. …
```

Prawdopodobny podział na fragmenty w pliku XLSX (tak samo jak w archiwalnych wpisach Genokrad i Karzełkowiec, rozdz. 7.3):

| Fragment | Pogrubiony? | Tekst fragmentu |
|---|---|---|
| … | nie | `…Wybuchowa o +1.⏎` |
| **n** | **tak** | `⏎ANIHILACJA: Protokoły ożywienia` |
| n+1 | nie | `⏎Kiedy to Zagrożenie ginie, rzuć 1k6. …` |

Pogrubiony fragment zaczyna się od drugiego entera (tego, który kończy pustą linię). Wariant, w którym pogrubione są oba entery (`⏎⏎ANIHILACJA…`), działa identycznie.

### 5.2. Tekst po przejściu przez DataVault

```
…Wybuchowa o +1.\n{{B}}\nANIHILACJA: Protokoły ożywienia{{/B}}\nKiedy to Zagrożenie ginie, …
```

### 5.3. Podział na paski (`splitEntries`)

Linie po podziale i przycięciu:

1. `…Wybuchowa o +1.` — doklejana do paska ZGUBA,
2. `{{B}}` — **nie** pasuje do `entryStartRegex`, więc też jest doklejana do paska ZGUBA,
3. `ANIHILACJA: Protokoły ożywienia{{/B}}` — pasuje (`ANIHILACJA: `), więc otwiera nowy pasek,
4. `Kiedy to Zagrożenie ginie, …` — doklejana do paska ANIHILACJA.

Wynik (prawdziwy kod, uruchomiony w Node):

```
[0] "DETERMINACJA: Wydaj 1 punkt Zguby, aby rzucić 2k6."
[1] "{{B}}ZGUBA: Autodestrukcja{{/B}} Wydaj 1 punkt Zguby, … o +1. {{B}}"
[2] "ANIHILACJA: Protokoły ożywienia{{/B}} Kiedy to Zagrożenie ginie, rzuć 1k6."
```

### 5.4. Formatowanie pasków (`formatInlineHTML`)

- Pasek [1]: `{{B}}` na samym końcu nie ma po sobie tekstu — nic nie zmienia. „ZGUBA: Autodestrukcja” jest pogrubione, bo ma własną, kompletną parę znaczników.
- Pasek [2]: `{{/B}}` nie ma pary, więc jest pomijany. Wynik HTML:

```html
<div class="entry">ANIHILACJA: Protokoły ożywienia Kiedy to Zagrożenie ginie, rzuć 1k6.</div>
```

— bez `<span class="inline-bold">`, czyli zwykłą czcionką. Dokładnie to widać na zrzucie ekranu użytkownika.

### 5.5. Dlaczego „Rozdzieracz” działa

W komórce „Rozdzieracz” oba entery przed „ANIHILACJA” należą do niepogrubionego fragmentu. Po DataVault:

```
…o ST 3.\n\n{{B}}ANIHILACJA: Protokoły ożywienia{{/B}}\nKiedy to Zagrożenie ginie, …
```

Linia `{{B}}ANIHILACJA: Protokoły ożywienia{{/B}}` zawiera pełną parę znaczników, pasuje do `entryStartRegex` i jest renderowana jako:

```html
<div class="entry"><span class="inline-bold">ANIHILACJA: Protokoły ożywienia</span> Kiedy to Zagrożenie ginie, …</div>
```

### 5.6. Które ułożenia znaczników psują kartę

Sprawdzone na prawdziwym kodzie GeneratorNPC (karta) i DataVault (tabela):

| Wariant w danych | Karta GeneratorNPC | Tabela GeneratorNPC / DataVault |
|---|---|---|
| `\n\n{{B}}ANIHILACJA…{{/B}}\nKiedy` (pogrubienie bez enterów — jak Rozdzieracz) | pogrubione | pogrubione |
| `\n{{B}}\nANIHILACJA…{{/B}}\nKiedy` (pogrubiony enter przed nagłówkiem) | **zwykłe** | **zwykłe** |
| `{{B}}\n\nANIHILACJA…{{/B}}\nKiedy` (pogrubione oba entery przed nagłówkiem) | **zwykłe** | **zwykłe** |
| `\n\n{{B}}ANIHILACJA…\n{{/B}}Kiedy` (pogrubiony enter **po** nagłówku) | pogrubione | pogrubione |
| `{{B}}\nANIHILACJA…\n{{/B}}Kiedy` (pogrubione entery z obu stron) | **zwykłe** | **zwykłe** |

Szkodzi wyłącznie **pogrubiony enter przed** nagłówkiem. Pogrubiony enter za nagłówkiem jest nieszkodliwy, bo znacznik otwierający zostaje w tej samej linii co tekst.

---

## 6. Dlaczego w Excelu nic nie widać

- Enter nie ma kształtu, więc pogrubiony enter wygląda identycznie jak zwykły. W archiwalnym pliku pogrubione i zwykłe fragmenty mają tę samą czcionkę i rozmiar (Calibri 8), więc nawet wysokość linii się nie zmienia.
- Po usunięciu znaczników tekst komórki „zepsutej” i „poprawnej” jest identyczny znak w znak — różni się tylko tym, do którego fragmentu należy enter.
- Najczęstsze sposoby, w jakie powstaje taki układ (wniosek ze struktury pliku, nie da się go odczytać z samego XLSX):
  - zaznaczenie w trybie edycji komórki od końca pustej linii do końca nagłówka i naciśnięcie Ctrl+B;
  - włączenie pogrubienia (Ctrl+B) przed drugim Alt+Enter i dopiero potem wpisanie nagłówka;
  - wklejenie tekstu z Worda lub innej komórki, w której pogrubienie obejmowało znak akapitu.

---

## 7. Dowody

### 7.1. Odtworzenie na prawdziwym kodzie (Node)

Funkcje `normalizeText`, `escapeHtml`, `formatInlineHTML`, `formatTextHTML`, `hasMeaningfulValue`, `splitEntries`, `formatSectionEntries` wycięto bez zmian z `GeneratorNPC/index.html` (linie 992-995, 1060-1066, 1075-1187, 1260-1263, 2269-2306), a odpowiedniki z `DataVault/app.js` (836-957). Wyniki dla wariantów z tabeli 5.6 są opisane wyżej. `formatTextHTML` z GeneratorNPC i z DataVault dały bajtowo identyczny wynik we wszystkich przypadkach.

### 7.2. Odtworzenie na prawdziwej stronie GeneratorNPC (Chromium)

Niezmieniony `GeneratorNPC/index.html` uruchomiono w Chromium (Playwright). Firebase i `shared/firebase-data-loader.js` podmieniono tak, by zwracały archiwalny `data.json` z dopisanymi testowymi rekordami Kanoptek / Rozdzieracz. Kliknięto prawdziwy przycisk „Generuj kartę” (procedura `openPrintableCard` → `buildPrintableCardHTML`) i odczytano wynikową kartę:

- wariant z pogrubionym enterem przed „ANIHILACJA”: pasek ANIHILACJA ma obliczoną grubość czcionki **400** (zwykła), a ZGUBA i DETERMINACJA są pogrubione — obraz identyczny z pierwszym zrzutem użytkownika;
- wariant poprawny: grubość **700** (pogrubiona) — obraz identyczny z trzecim zrzutem użytkownika.

### 7.3. Ten sam układ w archiwalnym pliku XLSX

Archiwalny `Repozytorium.xlsx` (commit `7933720`, 27 kwietnia 2026) zawiera ten sam wzorzec. Fragment `xl/sharedStrings.xml` dla wpisu **Genokrad (LP 43)**, kolumna „Zdolności”:

```xml
<r><rPr><sz val="8"/>…</rPr><t xml:space="preserve">
Zagrożenie Przejmuje inicjatywę … w ramach tej Szarży.
</t></r>
<r><rPr><b/><sz val="8"/>…</rPr><t xml:space="preserve">
DETERMINACJA: Błyskawiczny refleks</t></r>
<r><rPr><sz val="8"/>…</rPr><t xml:space="preserve">
Wydaj 1 punkt Zguby, aby rzucić 6k6. …</t></r>
```

Pogrubiony fragment (`<b/>`) zaczyna się od znaku nowej linii. W archiwalnym `data.json` (commit `1bcfd6e`) ten wpis wygląda tak:

```
…Szarży.\n{{B}}\nDETERMINACJA: Błyskawiczny refleks{{/B}}\nWydaj 1 punkt Zguby…
```

Analogicznie **Karzełkowiec (LP 34)**: `…Testu ataku.\n{{B}}\nRozmiar ma znaczenie: {{/B}}Horda grotów…`. Na karcie wygenerowanej przez prawdziwą stronę oba nagłówki („DETERMINACJA: Błyskawiczny refleks”, „Rozmiar ma znaczenie:”) wychodzą zwykłą czcionką — to dokładnie ten sam błąd co w Kanopteku.

Oba parsery (`build_json.py` i `xlsxCanonicalParser.js` uruchomiony w Chromium) uruchomione na archiwalnym pliku dają wynik identyczny ze sobą i z archiwalnym `data.json` dla tych wierszy. Na syntetycznym pliku XLSX z komórką zbudowaną jak Kanoptek oba parsery również dały bajtowo identyczny wynik.

### 7.4. Naprawa w danych już raz zadziałała (Termagant)

W historii `data.json`:

- commit `ac12396` (styczeń 2026): Termagant — `…zamiast umiera.\n{{B}}\nDETERMINACJA{{/B}}: …` (błędny układ);
- commit `383907c` (30 stycznia 2026): `…zamiast umiera.\n\n{{B}}DETERMINACJA{{/B}}: …` (poprawny układ).

Commit `383907c` zmienił wyłącznie `DataVault/data.json` i dokumentację, bez kodu. Układ poprawiono więc samym przeformatowaniem komórki w Excelu — to potwierdza, że przyczyna leży w formatowaniu komórki i że da się ją usunąć po stronie danych.

### 7.5. Dlaczego problem pojawia się dopiero od kwietnia 2026 w tej postaci

Do 10 kwietnia 2026 DataVault generował dane starszym mechanizmem (HTML komórek z biblioteki SheetJS), który wstawiał nowe linie **poza** znacznikami. Commit `9398266` (10 kwietnia 2026, „switch UI generation to canonical in-browser XLSX parser”) przełączył generowanie na obecny parser, który owija cały fragment razem z enterami. Wpis Genokrad przed tą zmianą miał postać `…Szarży.\n\n{{B}}DETERMINACJA: Błyskawiczny refleks{{/B}}`, a po niej `…Szarży.\n{{B}}\nDETERMINACJA…`. Ta informacja historyczna wyjaśnia, dlaczego w części starszych notatek przypadki tego typu mogły nie być widoczne; nie zmienia wniosku.

---

## 8. Rozważone i wykluczone hipotezy

| Hipoteza | Ocena | Uzasadnienie |
|---|---|---|
| **Pogrubiony enter przed nagłówkiem w komórce XLSX** | **przyczyna** | Odtwarza dokładnie objaw (ZGUBA pogrubiona, ANIHILACJA nie, na tej samej karcie); ten sam układ potwierdzony w archiwalnym XLSX (Genokrad, Karzełkowiec, wcześniej Termagant) |
| Nieaktualne dane w Firebase (XLSX poprawiony, ale nie zaimportowany ponownie) | mało prawdopodobna, do wykluczenia jednym spojrzeniem | Daje ten sam objaw tylko wtedy, gdy przy ostatnim imporcie nagłówek był niepogrubiony. Przeglądarka nie przechowuje kopii danych — `loadDataVaultLive` pobiera `/datavault/live` przy każdym wczytaniu, GeneratorNPC trzyma w `localStorage` wyłącznie ulubione. Sposób rozróżnienia: rozdz. 10, krok 2 |
| Karta otwarta z „ulubionych” ze starą kopią tekstu | wykluczona | Ulubione przechowują indeks rekordu, nazwę, nadpisania liczb / Umiejętności / Słów kluczowych, notatki i moduły (`buildFavoritePayload`, `GeneratorNPC/index.html:2531-2566`). „Zdolności” są zawsze czytane z bieżącego rekordu (3024) |
| Pogrubienie zapisane inaczej niż `<b/>` (np. `<b val="1"/>`, pogrubienie całej komórki w stylu, czcionka typu „Arial Black”) | wykluczona w praktyce | `<b val="1"/>` i `<b val="true"/>` są obsługiwane poprawnie. Pogrubienie całej komórki przy mieszanym formatowaniu nie występuje w plikach zapisanych przez Excel (w archiwalnym pliku: 0 przypadków). Ciężka czcionka bez `<b/>` oznaczałaby wyłączony przycisk „B” w Excelu |
| Wyrażenie `entryStartRegex` (limit 40 znaków, dwukropek, twarda spacja) | wykluczona | „ANIHILACJA: ” pasuje do wzorca. Gdyby nie pasowało, nagłówek trafiłby do paska ZGUBA razem z `{{B}}` i byłby **pogrubiony** — taka usterka mogłaby problem ukryć, nie wywołać |
| Normalizacja tekstu, zamiana cudzysłowów, wyszukiwanie klucza „Zdolności” | wykluczona | `splitEntries` działa na surowym napisie; `normalizeText` służy tylko do sprawdzenia, czy pole nie jest puste; przycinanie dotyczy końców całej komórki |
| Style CSS / paski naprzemienne | wykluczona | `.inline-bold { font-weight: 700; }` działa tak samo w `.entry` i `.entry-alt`; DETERMINACJA w pasku tego samego typu co ANIHILACJA jest pogrubiona |
| Stara wersja kodu w pamięci przeglądarki | wykluczona | Logika `splitEntries` i `formatInlineHTML` nie zmieniała się od miesięcy; każda wersja traktowałaby Kanopteka i Rozdzieracza tak samo |
| Znaki `\r\n` / `_x000D_` | wykluczona jako osobna przyczyna | `\r\n` wewnątrz pogrubionego fragmentu to ten sam mechanizm; `_x000D_` byłoby widoczne na karcie jako tekst, czego użytkownik nie zgłasza |
| Nagłówek rozbity na kilka fragmentów (np. „ANIHI” + „LACJA”) | wykluczona | Sąsiednie pogrubione fragmenty renderują się poprawnie; zwykłą czcionką wychodzi tylko fragment zaczynający się od entera |

---

## 9. Skala zjawiska

### 9.1. Archiwalne dane (ostatnia wersja z 27 kwietnia 2026)

Przeskanowano wszystkie pola tekstowe wszystkich arkuszy prawdziwym kodem renderującym:

- 1245 pól zawiera znaczniki formatowania; w 52 polach jakaś para znaczników obejmuje znak nowej linii;
- **widoczny błąd** (utrata pogrubienia lub kursywy) występuje w 5 polach:

| Arkusz | LP / nazwa | Pole | Co ginie | Gdzie widać |
|---|---|---|---|---|
| Bestiariusz | 34 Karzełkowiec | Zdolności | pogrubienie „Rozmiar ma znaczenie:” | karta i tabela GeneratorNPC, tabela DataVault |
| Bestiariusz | 43 Genokrad | Zdolności | pogrubienie „DETERMINACJA: Błyskawiczny refleks” | karta i tabela GeneratorNPC, tabela DataVault |
| Słowa Kluczowe Frakcji | 11 Aeldari | Opis | pogrubienie „Sunblitz Brotherhood” | tabela DataVault |
| Słowa Kluczowe Frakcji | 11 Aeldari | Efekt | kursywa „[dane utajnione]” (5×) i pogrubienie „Sunblitz Brotherhood” | tabela DataVault |
| Talenty | 45 Operator broni specjalnej | Efekt | pogrubienie drugiej linii fragmentu „* Miotacz ognia [Podręcznik Główny” | tabele GeneratorNPC i DataVault |

- Pozostałe 47 pól z parą obejmującą enter renderuje się poprawnie — to głównie układ `{{I}}lub\n{{/I}}` w „Premie Frakcji” (znacznik zamykający w następnej linii), który jest nieszkodliwy.
- Błąd może wyłącznie **zgubić** formatowanie — nigdy nie „rozlewa” pogrubienia na dalszy tekst (sprawdzone na prawdziwych danych i na 30 000 losowych napisów).

### 9.2. Aktualne dane

Aktualny Bestiariusz ma co najmniej 185 wpisów (archiwalny: 66), więc przypadków jest prawdopodobnie więcej niż dwa. W historii archiwalnych wersji błąd dotyczył 2–4 wpisów Bestiariusza na 62–70, co przy obecnej liczbie wpisów daje szacunkowo kilka–kilkanaście wpisów (szacunek orientacyjny). Dokładną listę da skan aktualnego `data.json` (rozdz. 13).

### 9.3. Gdzie ten sam błąd jest widoczny

Znaczniki czytają tylko dwa moduły: **GeneratorNPC** i **DataVault**.

- **GeneratorNPC — karta, sekcje paskowe** (`splitEntries` + `formatSectionEntries`, osobno dla każdego paska): Premie, Zdolności, Atak, Zdolności Hordy, Opcje Hordy oraz sekcje modułów (Augumentacje, Ekwipunek, Talenty, Psionika, Modlitwy).
- **GeneratorNPC — formatowanie linia po linii** (`formatTextHTML`, osobno dla każdej linii): sekcja Umiejętności na karcie, tabela „Podgląd bazowy” (Bestiariusz) i tabele modułów.
- **DataVault — tabela i widoki szczegółów** (`formatTextHTML`, linia po linii).
- **Nie dotyczy:** Słowa kluczowe, cechy pancerza i opisy cech pancerza na karcie (formatowane jako jeden napis) oraz pola bez interpretacji znaczników.

Wniosek praktyczny: jeśli hipoteza jest prawdziwa, nagłówek „ANIHILACJA: Protokoły ożywienia” Kanopteka jest **zwykłą czcionką także w tabeli „Podgląd bazowy” w GeneratorNPC i w tabeli Bestiariusza w DataVault**.

---

## 10. Jak potwierdzić przyczynę na aktualnych danych

Każdy z poniższych kroków wystarcza osobno.

1. **Tabela podglądu.** W GeneratorNPC wybrać „Kanoptek Skarabeusz” i obejrzeć wiersz „Zdolności” w tabeli „Podgląd bazowy” (kolumny „Klucz” / „Wartość”) albo ten sam wpis w DataVault. Jeśli „ANIHILACJA: Protokoły ożywienia” jest tam również niepogrubiona — przyczyna potwierdzona. Jeśli jest pogrubiona — przyczyna jest inna i analizę trzeba wznowić.
2. **Plik `data.json`.** W DataVault (tryb admina) kliknąć „Generuj pliki danych”, wskazać aktualny `Repozytorium.xlsx`, otworzyć pobrany `data.json` w edytorze tekstu i wyszukać „Protokoły ożywienia” we wpisie Kanopteka:
   - `{{B}}\nANIHILACJA` albo `+1.{{B}}\n\nANIHILACJA` — przyczyna potwierdzona (pogrubiony enter);
   - `\n\n{{B}}ANIHILACJA: Protokoły ożywienia{{/B}}` — dane w XLSX są poprawne, czyli w Firebase są nieaktualne dane i wystarczy ponowny import;
   - brak `{{B}}` przy nagłówku — pogrubienie w Excelu nie jest zwykłym pogrubieniem (bardzo mało prawdopodobne).

   W `firebase-import.json` ten sam tekst jest zapisany z podwójnym ukośnikiem: `{{B}}\\nANIHILACJA`.
3. **Excel.** Wejść w edycję komórki (F2), ustawić kursor tuż przed literą „A” w „ANIHILACJA” i nacisnąć Shift+Strzałka w lewo (zaznacza się enter). Jeśli przycisk „Pogrubienie” (B) na wstążce jest podświetlony — enter jest pogrubiony.

---

## 11. Naprawa danych bez zmian w kodzie (do wykonania od razu)

1. Otworzyć `Repozytorium.xlsx`, arkusz „Bestiariusz”, komórkę „Zdolności” wpisu „Kanoptek Skarabeusz”.
2. Wejść w edycję komórki (F2 albo dwuklik).
3. Zaznaczyć **tylko** pustą linię nad „ANIHILACJA” razem z enterami (np. kursor na końcu linii „…o +1.”, potem Shift+Strzałka w prawo dwa razy) i zdjąć pogrubienie (Ctrl+B — tak, by przycisk B zgasł).
4. Upewnić się, że sam nagłówek „ANIHILACJA: Protokoły ożywienia” nadal jest pogrubiony.
5. Zapisać plik. W DataVault kliknąć „Generuj pliki danych”, wskazać zapisany plik, a pobrany `firebase-import.json` zaimportować do Firebase Realtime Database (tak samo jak przy każdej aktualizacji).
6. Odświeżyć GeneratorNPC i wygenerować kartę ponownie.

Tak samo należy poprawić Genokrada (LP 43) i Karzełkowca (LP 34), jeśli w aktualnym pliku nadal mają ten układ, oraz pozostałe wpisy wskazane przez skan (rozdz. 13).

Wada tej drogi: Excel nie pokazuje problemu, więc przy kolejnych edycjach układ może pojawić się ponownie. Dlatego rekomendowana jest też poprawka w kodzie (rozdz. 12).

---

## 12. Warianty trwałej naprawy w kodzie

Żaden z wariantów nie został wdrożony. Prototypy sprawdzono wyłącznie poza repozytorium.

### Wariant A — tylko dane (Excel)

Opisany w rozdz. 11. Nie wymaga zmian w kodzie, ale nie chroni przed ponownym wystąpieniem problemu: Excel go nie pokazuje, więc ten sam układ może powstać przy każdej edycji.

### Wariant B — wyrównanie znaczników przy wyświetlaniu (GeneratorNPC i DataVault) — **rekomendowany**

**Idea:** przed podziałem tekstu na linie / paski przejść przez cały napis, śledząc otwarte znaczniki, i przy każdym znaku nowej linii zamknąć wszystkie otwarte style, a po nim otworzyć je ponownie. Każda linia staje się samowystarczalna, więc dzielenie na linie i paski przestaje gubić formatowanie.

Przykład działania:

```
przed: …o +1.\n{{B}}\nANIHILACJA: Protokoły ożywienia{{/B}}\nKiedy…
po:    …o +1.\n{{B}}{{/B}}\n{{B}}ANIHILACJA: Protokoły ożywienia{{/B}}\nKiedy…
```

Linia `{{B}}{{/B}}` nie zawiera tekstu, więc nic nie wyświetla. Linia z nagłówkiem ma pełną parę znaczników i zaczyna nowy pasek jak dotąd.

**Szkic funkcji pomocniczej** (do wstawienia osobno w `GeneratorNPC/index.html` i `DataVault/app.js`, zgodnie z obecnym podejściem, w którym każdy moduł ma własną kopię funkcji formatujących):

```js
// --- Wyrównanie znaczników na granicach linii / Rebalance markers at line breaks ---
// PL: Zamyka style otwarte przed każdym "\n" i otwiera je ponownie po nim, żeby każda linia miała
//     komplet znaczników. Chroni przed pogrubieniem obejmującym enter (np. "{{B}}\nNAGŁÓWEK{{/B}}"),
//     które przy formatowaniu linia po linii gubiło styl nagłówka.
// EN: Closes styles still open before every "\n" and re-opens them after it, so every line carries
//     a complete marker set. Protects against bold spanning a line break (e.g. "{{B}}\nHEADER{{/B}}"),
//     which made per-line formatting drop the header style.
const balanceMarkersPerLine = (raw) => {
  const s = String(raw ?? "");
  const re = /{{(\/?)(RED|B|I|S)}}|\r?\n/g;
  const stack = [];
  let out = "";
  let cursor = 0;
  let m;
  while ((m = re.exec(s))) {
    out += s.slice(cursor, m.index);
    cursor = re.lastIndex;
    if (m[0].endsWith("\n")) {
      const closers = [...stack].reverse().map((n) => `{{/${n}}}`).join("");
      const openers = stack.map((n) => `{{${n}}}`).join("");
      out += closers + m[0] + openers;
      continue;
    }
    if (m[1]) {
      const i = stack.lastIndexOf(m[2]);
      if (i !== -1) stack.splice(i, 1);
    } else {
      stack.push(m[2]);
    }
    out += m[0];
  }
  return out + s.slice(cursor);
};
```

**Miejsca wywołania:**

| Moduł | Funkcja | Zmiana |
|---|---|---|
| GeneratorNPC | `splitEntries` (`index.html:2269`) | `const value = balanceMarkersPerLine(String(raw ?? ""));` zamiast `String(raw ?? "")` — naprawia paski karty (Premie, Zdolności, Atak, Zdolności Hordy, Opcje Hordy, moduły) |
| GeneratorNPC | `formatTextHTML` (`index.html:1171`) | podział `balanceMarkersPerLine(s).split(/\r?\n/)` — naprawia „Podgląd bazowy”, tabele modułów i sekcję Umiejętności na karcie |
| DataVault | `formatTextHTML` (`app.js:908`) | jak wyżej — naprawia tabelę, okienko opisu cechy i widok porównania (wszystkie korzystają z `formatTextHTML`) |
| DataVault | `formatFactionKeywordHTML` (`app.js:970`) | jak wyżej — ten sam podział linia po linii w arkuszu „Słowa Kluczowe Frakcji” |

**Sprawdzenie prototypu na archiwalnych danych (1245 pól ze znacznikami):**

- formatowanie linia po linii (`formatTextHTML`): HTML zmienia się w **dokładnie 5 polach** — tych z wadą z rozdz. 9.1 — i w każdym z nich odzyskuje utracone pogrubienie lub kursywę;
- karta GeneratorNPC: wygląd widocznych znaków zmienia się w **dokładnie 2 polach** (Karzełkowiec, Genokrad — odzyskane pogrubienie nagłówków); w pozostałych 50 polach z parą obejmującą enter zmienia się wyłącznie styl spacji (niewidoczny), a liczba pasków pozostaje taka sama;
- warianty Kanopteka z pogrubionym enterem przed nagłówkiem dają po zmianie pogrubiony nagłówek; warianty poprawne (Rozdzieracz) pozostają bez zmian.

**Zalety:** naprawia wyświetlanie od razu, także dla danych już zaimportowanych do Firebase — bez ponownego generowania i importu. Nie dotyka parserów DataVault ani struktury danych, czyli obszaru szczególnie chronionego przez AGENTS.md (punkt 14). Chroni również przed przyszłymi przypadkami.

**Wady:** dwie kopie tej samej funkcji (GeneratorNPC i DataVault) trzeba utrzymywać zgodnie. W danych nadal zostaje „nieestetyczny” układ znaczników — nie ma to skutków widocznych.

### Wariant C — normalizacja w parserach DataVault

**Idea:** w `wrapWithMarkers` (`xlsxCanonicalParser.js:57`) i `_wrap_with_markers` (`build_json.py:82`) nie obejmować znakami `{{…}}` znaków nowej linii — zamykać i otwierać znaczniki wokół każdego `\n` wewnątrz fragmentu albo wynosić początkowe i końcowe białe znaki poza znaczniki.

**Zalety:** czyste dane dla każdego odbiorcy, także przyszłego.

**Wady i ryzyka:**

- zmiana w plikach chronionych przez AGENTS.md (punkt 14): obie implementacje muszą dawać bajtowo identyczny wynik, a wynik trzeba porównać na całym skoroszycie;
- zmienia surową treść wielu pól (w archiwalnych danych co najmniej 52 pola z parą obejmującą enter; przy wynoszeniu białych znaków — więcej), także tam, gdzie dziś nic nie jest zepsute;
- działa dopiero po ponownym wygenerowaniu danych i imporcie do Firebase;
- sam w sobie nie poprawia już zaimportowanych danych.

### Dodatkowa, niezależna decyzja — `entryStartRegex` ignorujący znaczniki

Sprawdzanie początku paska na tekście bez znaczników (`entryStartRegex.test(line.replace(/{{\/?(?:RED|B|I|S)}}/g, ""))`) usunęłoby usterkę z rozdz. 14 pkt 1 (pogrubiony dwukropek skleja paski). To **zmiana widoczna** — część kart dostałaby więcej pasków — więc wymaga osobnej decyzji i nie jest potrzebna do naprawy pogrubienia.

### Rekomendacja

1. **Wariant B** jako trwała poprawka w GeneratorNPC i DataVault.
2. **Wariant A** dla Kanopteka (i pozostałych wpisów ze skanu), jeśli poprawka w kodzie ma poczekać — albo po prostu dla porządku w danych.
3. Wariant C nie jest potrzebny, jeśli wdrożony zostanie wariant B.
4. Niezależnie od wybranego wariantu dopisać w `DataVault/docs/ZasadyFormatowania.md` (tabela „Typowe błędy w danych źródłowych”) wiersz o pogrubionym enterze przed nagłówkiem.

Przy wdrożeniu wariantu B należy — zgodnie z AGENTS.md — zaktualizować `GeneratorNPC/docs/Documentation.md`, `GeneratorNPC/docs/README.md`, `DataVault/docs/Documentation.md`, `DataVault/docs/README.md` oraz w `DataVault/docs/ZasadyFormatowania.md` rozdział „Zachowanie podziałów linii”. `DetaleLayout.md` nie wymaga zmian: style (kolory, fonty, odstępy) się nie zmieniają, zmienia się tylko to, czy klasa `.inline-bold` trafia na właściwy tekst.

---

## 13. Ryzyka

| Ryzyko | Ocena | Ograniczenie |
|---|---|---|
| Wniosek oparty na danych archiwalnych, nie na aktualnym wpisie LP 180 | niskie — mechanizm odtworzony 1:1, objaw identyczny | potwierdzenie w minutę według rozdz. 10 |
| Nieaktualne dane w Firebase jako druga, nakładająca się przyczyna | niskie | rozdz. 10 krok 2 rozróżnia oba przypadki |
| Naprawa tylko w Excelu wróci przy kolejnych edycjach | średnie | wariant B w kodzie |
| Wariant B: rozbieżność kopii funkcji w dwóch modułach | niskie | ta sama funkcja i te same testy w obu modułach; opis w `Documentation.md` obu modułów |
| Wariant B: celowo niedomknięty znacznik wpisany ręcznie w XLSX rozleje się na kolejne linie (dziś działa tylko do końca linii) | niskie — w archiwalnych danych 0 niedomkniętych znaczników | zalecenie z `ZasadyFormatowania.md`: domykać znaczniki |
| Wariant C: zmiana generowanych danych i konieczność importu | średnie | nie wdrażać, jeśli wdrożony jest wariant B; w przeciwnym razie pełne porównanie wyników obu parserów |

---

## 14. Obserwacje poboczne (niezwiązane bezpośrednio z pogrubieniem ANIHILACJI)

1. **Dwukropek wewnątrz pogrubienia skleja paski.** `entryStartRegex` (`GeneratorNPC/index.html:2274-2275`) nie pomija znaczników. Linia `{{B}}DETERMINACJA:{{/B}} Wydaj…` (dwukropek pogrubiony razem ze słowem) nie zaczyna nowego paska, bo po dwukropku stoi `{{`, a nie spacja — trafia do poprzedniego paska. Pogrubienie działa, ale podział na paski jest błędny. Na kartach ze zrzutów ekranu ten przypadek nie występuje (DETERMINACJA ma osobny pasek), więc w aktualnych danych dwukropek przy DETERMINACJI najpewniej nie jest pogrubiony.
2. **Opis cechy w okienku podpowiedzi pokazuje surowe znaczniki.** `popoverDescription.textContent = resolveTraitDescription(traitName)` (`GeneratorNPC/index.html:3469`) wstawia opis cechy bez interpretacji znaczników, więc np. „[{{B}}Podręcznik Główny{{/B}} (str. 189)]” byłoby widoczne dosłownie (wniosek z kodu, nie sprawdzono w przeglądarce).
3. **Wielowierszowa czerwona komórka bez formatowania mieszanego.** Gdy cała komórka ma czerwony styl i nie ma fragmentów, parser owija cały tekst jedną parą `{{RED}}…{{/RED}}` (`xlsxCanonicalParser.js:163-179`). Przy kilku liniach widoki „linia po linii” zgubiłyby czerwień od drugiej linii. W archiwalnych danych nie wystąpiło.
4. **Bezwzględne ścieżki w pliku XLSX.** Oba parsery budują ścieżkę arkusza jako `xl/` + `Target` (`build_json.py:284`, `xlsxCanonicalParser.js:217`), więc nie odczytają pliku z bezwzględnymi ścieżkami (zapisuje je np. openpyxl). Excel zapisuje ścieżki względne, więc dla `Repozytorium.xlsx` nie ma to znaczenia.

---

## 15. Następne kroki

1. **Potwierdzenie (użytkownik, ok. 1 minuty):** rozdz. 10 — najprościej obejrzeć „Zdolności” Kanopteka w tabeli „Podgląd bazowy” GeneratorNPC albo wyszukać `{{B}}\nANIHILACJA` w świeżo wygenerowanym `data.json`.
2. **Decyzja o wariancie naprawy:** rekomendowany wariant B (rozdz. 12), opcjonalnie wraz z poprawką danych w Excelu (wariant A).
3. **Skan aktualnych danych:** po wygenerowaniu aktualnego `data.json` przeskanować wszystkie pola pod kątem par znaczników obejmujących enter, żeby uzyskać pełną listę wpisów z tym samym problemem (w archiwalnych danych: Karzełkowiec, Genokrad, Aeldari w „Słowach Kluczowych Frakcji”, Talent „Operator broni specjalnej”).
4. **Osobne decyzje (niezwiązane z pogrubieniem):** sklejanie pasków przy pogrubionym dwukropku (rozdz. 14 pkt 1) i surowe znaczniki w okienku opisu cechy (rozdz. 14 pkt 2).

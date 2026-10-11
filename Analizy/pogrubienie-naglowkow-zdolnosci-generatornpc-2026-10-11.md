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

**Ograniczenie:** aktualny `Repozytorium.xlsx` ani aktualne dane z Firebase (`/datavault/live`) nie są dostępne z poziomu repozytorium — baza wymaga logowania i App Check. Wpisu LP 180 nie dało się więc obejrzeć bezpośrednio. Wniosek opiera się na: dokładnym dopasowaniu objawów, odtworzeniu mechanizmu na prawdziwym kodzie oraz identycznych przypadkach w archiwalnym pliku XLSX. Jedyną alternatywą, której nie da się wykluczyć bez dostępu do danych, jest nieaktualny import w Firebase — daje on na karcie identyczny obraz. Rozdział 10 opisuje, jak w kilka minut rozstrzygnąć to na aktualnych danych.

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

Jedyna alternatywa, której nie da się wykluczyć bez wglądu w aktualne dane — nieaktualny import w Firebase (nagłówek pogrubiony w Excelu dopiero po ostatnim imporcie) — daje na karcie dokładnie ten sam obraz. Rozstrzyga ją jedno sprawdzenie z rozdz. 10.

**Szybka naprawa danych (bez zmian w kodzie):** w Excelu zdjąć pogrubienie z entera przed „ANIHILACJA”, wygenerować dane w DataVault i zaimportować je do Firebase (rozdz. 11). **Trwała naprawa:** uodpornić wyświetlanie w GeneratorNPC i DataVault, żeby taki układ nie psuł karty ani tabel (rozdz. 12, wariant B).

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

### 7.5. Zależność od sposobu generowania danych

Wadliwy układ jest w danych od dawna — np. Genokrad ma postać `…Szarży.\n{{B}}\nDETERMINACJA…` we wszystkich zachowanych wersjach `data.json` od 21 stycznia 2026 do 27 kwietnia 2026. Jedyny wyjątek to dwie wersje z 10 kwietnia 2026 (commity `7016010` i `f686eae`), wygenerowane starszym mechanizmem w przeglądarce, który budował znaczniki z HTML komórek (biblioteka SheetJS) i wstawiał nowe linie **poza** znacznikami: tam Genokrad ma postać `…Szarży.\n\n{{B}}DETERMINACJA…`. Commit `9398266` z tego samego dnia („switch UI generation to canonical in-browser XLSX parser”) przełączył generowanie w przeglądarce na obecny parser, który działa tak samo jak `build_json.py` — owija cały fragment razem z enterami.

Wniosek: problem nie jest nowy i nie zależy od tego, którą drogą (przeglądarka czy `build_json.py`) generuje się dziś dane — obie dają ten sam wynik.

---

## 8. Rozważone hipotezy

| Hipoteza | Ocena | Uzasadnienie |
|---|---|---|
| **Pogrubiony enter przed nagłówkiem w komórce XLSX** | **przyczyna** | Odtwarza dokładnie objaw (ZGUBA pogrubiona, ANIHILACJA nie, na tej samej karcie); ten sam układ potwierdzony w archiwalnym XLSX (Genokrad, Karzełkowiec, wcześniej Termagant) |
| Nieaktualne dane w Firebase (nagłówek pogrubiony w XLSX dopiero po ostatnim imporcie) | mniej prawdopodobna, ale **niewykluczalna bez wglądu w dane** | Daje na karcie i w obu tabelach **identyczny** obraz, więc samym wyglądem nie da się jej odróżnić. Mniej prawdopodobna, bo opisany układ formatowania ma w tym skoroszycie potwierdzone wystąpienia (Genokrad, Karzełkowiec, wcześniej Sukkub i Termagant). Przeglądarka nie przechowuje kopii danych — `loadDataVaultLive` pobiera `/datavault/live` przy każdym wczytaniu, GeneratorNPC trzyma w `localStorage` wyłącznie ulubione — więc nieaktualność mogłaby dotyczyć tylko samej bazy. Rozstrzyga surowy tekst wpisu: rozdz. 10, krok 1 i 2 |
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

Aktualny Bestiariusz ma co najmniej 185 wpisów (archiwalny: 66), więc przypadków jest prawdopodobnie więcej niż dwa. W historii archiwalnych wersji błąd dotyczył 2–4 wpisów Bestiariusza na 62–70, co przy obecnej liczbie wpisów daje szacunkowo kilka–kilkanaście wpisów (szacunek orientacyjny). Dokładną listę daje polecenie z rozdz. 10, krok 4.

### 9.3. Gdzie ten sam błąd jest widoczny

Znaczniki czytają tylko dwa moduły: **GeneratorNPC** i **DataVault**.

- **GeneratorNPC — karta, sekcje paskowe** (`splitEntries` + `formatSectionEntries`, osobno dla każdego paska): Premie, Zdolności, Atak, Zdolności Hordy, Opcje Hordy oraz sekcje modułów (Augumentacje, Ekwipunek, Talenty, Psionika, Modlitwy).
- **GeneratorNPC — formatowanie linia po linii** (`formatTextHTML`, osobno dla każdej linii): sekcja Umiejętności na karcie, tabela „Podgląd bazowy” (Bestiariusz) i tabele modułów.
- **DataVault — tabela i widoki szczegółów** (`formatTextHTML`, linia po linii).
- **Nie dotyczy:** Słowa kluczowe, cechy pancerza i opisy cech pancerza na karcie (formatowane jako jeden napis) oraz pola bez interpretacji znaczników.

Przy pogrubionym enterze nagłówek „ANIHILACJA: Protokoły ożywienia” Kanopteka jest zwykłą czcionką także w tabeli „Podgląd bazowy” w GeneratorNPC (długa komórka jest zwinięta — trzeba ją rozwinąć napisem „Kliknij aby rozwinąć”) i w tabeli Bestiariusza w DataVault. Ten objaw jest **oczekiwany**, ale sam w sobie niczego nie dowodzi: przy tych samych danych tabela pokazuje nagłówek zwykłą czcionką zawsze wtedy, gdy robi to karta — także wtedy, gdy przyczyną byłby nieaktualny import w Firebase (rozdz. 8 i 10).

Wyjątek, o którym warto wiedzieć: jeśli linia z nagłówkiem **nie** zaczyna nowego paska (np. dwukropek pogrubiony razem ze słowem: `{{B}}\nDETERMINACJA:{{/B}} Wydaj…`), na karcie zostaje doklejona do poprzedniego paska razem z samotnym `{{B}}` i wychodzi **pogrubiona**, a w tabelach — zwykła. Nagłówek „ANIHILACJA: ” zaczyna nowy pasek, więc Kanoptek tego wyjątku nie dotyczy.

---

## 10. Jak potwierdzić przyczynę na aktualnych danych

**Ważne:** nieaktualne dane w Firebase dają na karcie i w obu tabelach dokładnie ten sam obraz co pogrubiony enter. Dlatego wygląd tabeli „Podgląd bazowy” w GeneratorNPC ani tabeli w DataVault **nie rozstrzyga** przyczyny. Rozstrzyga wyłącznie surowy tekst wpisu — sprawdzany w kroku 1 albo 2.

### Krok 1 — dane, z których korzysta GeneratorNPC (to, co jest dziś w Firebase)

1. Otworzyć DataVault, zalogować się i poczekać, aż dane wczytają się z Firebase. **Nie** klikać „Generuj pliki danych”.
2. Nacisnąć F12 (narzędzia deweloperskie) i przejść do zakładki „Console”.
3. Wkleić poniższą linię i nacisnąć Enter:

   ```js
   JSON.stringify(DB.sheets["Bestiariusz"].find(r => String(r.LP) === "180")["Zdolności"])
   ```

4. Odczytać znaki tuż przed słowem „ANIHILACJA”:
   - `{{B}}\nANIHILACJA` albo `+1.{{B}}\n\nANIHILACJA` — **przyczyna potwierdzona**: w danych pogrubienie obejmuje enter;
   - przed „ANIHILACJA” nie ma `{{B}}` — w Firebase nagłówek nie jest pogrubiony, czyli dane są nieaktualne (albo pogrubienie w Excelu nie jest zwykłym pogrubieniem); przejść do kroku 2;
   - `\n\n{{B}}ANIHILACJA` — wynik sprzeczny z odtworzeniem (karta byłaby pogrubiona); analizę trzeba wznowić.

   Jeśli polecenie zwróci błąd (np. inna nazwa arkusza lub kolumny), wystarczy krok 2.

### Krok 2 — aktualny plik XLSX (czy wystarczy ponowny import)

1. W DataVault (tryb admina) kliknąć „Generuj pliki danych” i wskazać aktualny `Repozytorium.xlsx`.
2. Otworzyć pobrany `data.json` w edytorze tekstu i wyszukać „Protokoły ożywienia” we wpisie Kanopteka:
   - `{{B}}\nANIHILACJA` albo `+1.{{B}}\n\nANIHILACJA` — pogrubiony enter jest w samej komórce Excela; **sam ponowny import nie pomoże**, trzeba poprawić komórkę (rozdz. 11) albo kod (rozdz. 12);
   - `\n\n{{B}}ANIHILACJA: Protokoły ożywienia{{/B}}` — komórka jest poprawna, a Firebase ma nieaktualne dane; **wystarczy zaimportować** nowy `firebase-import.json`;
   - brak `{{B}}` przy nagłówku — pogrubienie w Excelu nie jest zwykłym pogrubieniem (bardzo mało prawdopodobne).

   W `firebase-import.json` ten sam tekst ma podwójne ukośniki: `{{B}}\\nANIHILACJA`.

Szybsza odmiana bez otwierania pliku: zaraz po „Generuj pliki danych”, **przed** odświeżeniem strony, DataVault pokazuje dane świeżo wygenerowane z pliku. Jeśli w tym momencie „ANIHILACJA” w Bestiariuszu (LP 180) jest zwykłą czcionką — enter jest pogrubiony w Excelu; jeśli jest pogrubiona — Firebase ma nieaktualne dane. Po odświeżeniu DataVault znów pokazuje dane z Firebase.

### Krok 3 — Excel (opcjonalnie)

Wejść w edycję komórki (F2), ustawić kursor tuż przed literą „A” w „ANIHILACJA” i nacisnąć Shift+Strzałka w lewo (zaznacza się enter). Jeśli przycisk „Pogrubienie” (B) na wstążce jest podświetlony — enter jest pogrubiony. (Tego kroku nie dało się sprawdzić w trakcie analizy — brak Excela.)

### Krok 4 — lista wszystkich wpisów z tym samym problemem

W DataVault po wczytaniu danych (jak w kroku 1) wkleić w konsoli:

```js
(() => { const re = /\{\{(?:RED|B|I|S)\}\}(?:[ \t]*\r?\n)+/; const hits = []; for (const [sheet, rows] of Object.entries(DB.sheets)) rows.forEach((r) => { for (const [kolumna, v] of Object.entries(r)) if (typeof v === "string" && re.test(v)) hits.push({ sheet, LP: r.LP, Nazwa: r.Nazwa, kolumna }); }); console.table(hits); })();
```

Polecenie tylko czyta dane i wypisuje tabelę: arkusz, LP, nazwa, kolumna — dla każdego pola, w którym znacznik otwierający stoi tuż przed enterem. Na archiwalnych danych zwraca 5 pozycji: Karzełkowiec, Genokrad, „Słowa Kluczowe Frakcji” LP 11 (Opis, Efekt) oraz „Specjalne Bonusy Frakcji” LP 15 Kamuflaż (ten ostatni jest nieszkodliwy — pogrubiony jest sam enter, bez tekstu). Nie wyłapuje przypadku, w którym pogrubiony tekst ciągnie się przez dwie linie (Talenty LP 45).

---

## 11. Naprawa danych bez zmian w kodzie (do wykonania od razu)

1. Otworzyć `Repozytorium.xlsx`, arkusz „Bestiariusz”, komórkę „Zdolności” (kolumna U) wpisu „Kanoptek Skarabeusz”.
2. Wejść w edycję komórki (F2 albo dwuklik; pasek formuły można rozwinąć Ctrl+Shift+U).
3. Ustawić kursor zaraz za kropką w „…Cechę Wybuchowa o +1.” i nacisnąć Shift+Strzałka w prawo tyle razy, ile jest enterów przed „ANIHILACJA” (zwykle 2), tak aby zaznaczone były **tylko** entery, bez litery „A”.
4. Zdjąć pogrubienie z zaznaczenia (przycisk B albo Ctrl+B — tak, by przycisk B zgasł).
5. Sprawdzić, że sam nagłówek „ANIHILACJA: Protokoły ożywienia” nadal jest pogrubiony. Dla porządku można tak samo zdjąć pogrubienie z entera tuż za „Protokoły ożywienia” (on akurat nie szkodzi).
6. Zatwierdzić Enterem i zapisać plik. W DataVault kliknąć „Generuj pliki danych”, wskazać zapisany plik, a pobrany `firebase-import.json` zaimportować do Firebase Realtime Database (tak samo jak przy każdej aktualizacji).
7. Odświeżyć GeneratorNPC, wybrać Kanopteka z listy i wygenerować kartę ponownie.

Tak samo należy poprawić pozostałe wpisy wskazane w rozdz. 10, krok 4 (w archiwalnych danych: Genokrad LP 43, Karzełkowiec LP 34, Aeldari w „Słowach Kluczowych Frakcji” LP 11).

Wada tej drogi: Excel nie pokazuje problemu i nie umie wyszukiwać formatowania pojedynczych znaków, więc przy kolejnych edycjach układ może pojawić się ponownie. Dlatego rekomendowana jest też poprawka w kodzie (rozdz. 12).

---

## 12. Warianty trwałej naprawy w kodzie

Żaden z wariantów nie został wdrożony. Prototypy sprawdzono wyłącznie poza repozytorium, na prawdziwych funkcjach wyciętych ze źródeł i na archiwalnym skoroszycie.

### Wariant A — tylko dane (Excel)

Opisany w rozdz. 11. Nie wymaga zmian w kodzie, ale nie chroni przed ponownym wystąpieniem problemu.

### Wariant B — przeniesienie enterów poza znaczniki przy wyświetlaniu (GeneratorNPC i DataVault) — **rekomendowany**

**Idea:** zanim tekst zostanie podzielony na linie lub paski, przesunąć znacznik otwierający **za** entery stojące tuż po nim, a znacznik zamykający **przed** entery stojące tuż przed nim. Styl nigdy nie zostaje rozszerzony na nowy tekst — zmienia się tylko to, po której stronie entera stoi znacznik.

```
przed: …o +1.\n{{B}}\nANIHILACJA: Protokoły ożywienia{{/B}}\nKiedy…
po:    …o +1.\n\n{{B}}ANIHILACJA: Protokoły ożywienia{{/B}}\nKiedy…
```

To dokładnie ten tekst, który powstałby z poprawnie sformatowanej komórki (jak u Rozdzieracza).

**Szkic funkcji** (osobna kopia w `GeneratorNPC/index.html` i w `DataVault/app.js` — tak jak dziś każdy z modułów ma własne `formatInlineHTML` / `formatTextHTML`):

```js
// --- Przeniesienie enterów poza znaczniki stylu / Move line breaks out of style markers ---
// PL: Przesuwa znaczniki otwierające za entery stojące tuż po nich, a zamykające przed entery stojące
//     tuż przed nimi. Dzięki temu pogrubienie obejmujące w XLSX enter przed nagłówkiem
//     ("{{B}}\nNAGŁÓWEK{{/B}}") nie gubi się przy formatowaniu linia po linii. Styl nigdy nie
//     obejmuje nowego tekstu, więc nie ma ryzyka „rozlania” pogrubienia.
// EN: Moves opening markers past the line breaks right after them and closing markers before the line
//     breaks right before them. Bold that in the XLSX includes the line break before a header
//     ("{{B}}\nHEADER{{/B}}") is therefore no longer lost by per-line formatting. A style never
//     covers new text, so bold cannot leak.
const moveLineBreaksOutOfMarkers = (raw) => {
  let s = String(raw ?? "");
  if (!s.includes("{{")) return s;
  const openersBeforeBreak = /((?:\{\{(?:RED|B|I|S)\}\})+)((?:[ \t]*\r?\n)+)/g;
  const closersAfterBreak = /((?:\r?\n[ \t]*)+)((?:\{\{\/(?:RED|B|I|S)\}\})+)/g;
  let previous;
  do {
    previous = s;
    s = s.replace(openersBeforeBreak, "$2$1").replace(closersAfterBreak, "$2$1");
  } while (s !== previous);
  return s;
};
```

**Miejsca wywołania:**

| Moduł | Funkcja | Zmiana |
|---|---|---|
| GeneratorNPC | `splitEntries` (`index.html:2269`) | `const value = moveLineBreaksOutOfMarkers(raw);` zamiast `String(raw ?? "")` — paski karty (Premie, Zdolności, Atak, Zdolności Hordy, Opcje Hordy, moduły) |
| GeneratorNPC | `formatTextHTML` (`index.html:1171`) | `const s = moveLineBreaksOutOfMarkers(raw);` — „Podgląd bazowy”, tabele modułów, sekcja Umiejętności na karcie |
| DataVault | `formatTextHTML` (`app.js:908`) | jak wyżej — tabela, okienko opisu cechy, widok porównania (wszystkie korzystają z `formatTextHTML`) |
| DataVault | `formatFactionKeywordHTML` (`app.js:970`) | jak wyżej — arkusz „Słowa Kluczowe Frakcji” |

**Sprawdzenie na archiwalnych danych (1245 pól ze znacznikami):**

- warianty Kanopteka z pogrubionym enterem przed nagłówkiem (jednym lub dwoma) dają pogrubiony nagłówek; wariant poprawny (Rozdzieracz) pozostaje bez zmian;
- karta GeneratorNPC: wygląd widocznych znaków zmienia się w **dokładnie 2 polach** (Karzełkowiec, Genokrad — odzyskane pogrubienie); liczba pasków nie zmienia się w żadnym polu;
- formatowanie linia po linii: zmiana w **dokładnie 4 polach** (Karzełkowiec, Genokrad, „Słowa Kluczowe Frakcji” LP 11 Opis i Efekt — odzyskane pogrubienie i kursywa);
- funkcja jest idempotentna (drugie wywołanie nic nie zmienia), a na danych już poprawionych w Excelu lub parserze nic nie zmienia;
- wynik wyświetlania jest identyczny z wynikiem poprawki w parserach (wariant D) — 0 różnic na archiwalnych danych.

**Zalety:** działa od razu, także na danych już zaimportowanych do Firebase — bez ponownego generowania i importu. Nie dotyka parserów DataVault ani struktury danych (obszar szczególnie chroniony przez AGENTS.md, punkt 14). Nie może rozszerzyć stylu na tekst, który nie był sformatowany.

**Ograniczenia:**

- nie poprawia przypadku, w którym pogrubiony fragment ma tekst w dwóch liniach (Talenty LP 45: druga linia traci pogrubienie w tabelach) — to robi dopiero wariant C;
- jeśli pogrubienie obejmowałoby enter przed linią przypisu `*[n] …`, po poprawce linia zaczynałaby się od `{{B}}` i nie byłaby rozpoznana jako przypis (to samo ograniczenie dotyczy dziś poprawnie pogrubionych linii `{{B}}*[n]…`; w archiwalnych danych brak takich przypadków);
- dwie kopie funkcji w dwóch modułach trzeba utrzymywać zgodnie.

### Wariant C — pełne wyrównanie znaczników w każdej linii (rozszerzenie wariantu B)

**Idea:** przy każdym enterze zamknąć wszystkie style otwarte, a po nim otworzyć je ponownie. Każda linia dostaje komplet znaczników, więc poprawny jest także przypadek z tekstem w dwóch liniach (Talenty LP 45).

**Sprawdzenie (prosta wersja jednoprzebiegowa):** formatowanie linia po linii zmienia się w dokładnie 5 polach (4 z wariantu B + Talenty LP 45), karta — w tych samych 2 polach co w wariancie B.

**Ryzyko:** w prostej wersji niedomknięty znacznik (wpisany ręcznie w XLSX) rozlałby styl na wszystkie kolejne linie — dziś działa tylko do końca linii. Wersja dwuprzebiegowa (przenosi do następnej linii tylko style, które zostaną dalej zamknięte) usuwa to ryzyko; jej prototyp dał wynik identyczny z parserem dzielącym fragmenty na linie. Więcej kodu w czterech funkcjach; potrzebne tylko wtedy, gdy wieloliniowe formatowanie ma być odwzorowane linia po linii.

### Wariant D — normalizacja w parserach DataVault

**Idea:** w `richTextToString` (`xlsxCanonicalParser.js:69-87`) i `_rich_text_to_string` (`build_json.py:94-111`) przed owinięciem fragmentu znacznikami wynieść poza znaczniki entery z początku i końca fragmentu (razem ze stykającymi się z nimi spacjami i tabulatorami), a fragmentów złożonych z samych białych znaków nie owijać wcale.

Prototyp funkcji dla przeglądarki (Python — ta sama logika jako `_split_run_edges`):

```js
// --- Podział fragmentu na brzegowe entery i treść / Split a run into edge line breaks and content ---
function splitRunEdges(text){
  const isWs = (ch)=>ch === " " || ch === "\t" || ch === "\r" || ch === "\n";
  const isBreak = (ch)=>ch === "\r" || ch === "\n";
  let headEnd = 0;
  while (headEnd < text.length && isWs(text[headEnd])) headEnd += 1;
  if (headEnd === text.length) return null;
  let leadEnd = 0;
  for (let i = 0; i < headEnd; i += 1){ if (isBreak(text[i])) leadEnd = i + 1; }
  let tailStart = text.length;
  while (tailStart > 0 && isWs(text[tailStart - 1])) tailStart -= 1;
  let trailStart = text.length;
  for (let i = tailStart; i < text.length; i += 1){ if (isBreak(text[i])){ trailStart = i; break; } }
  return {lead: text.slice(0, leadEnd), core: text.slice(leadEnd, trailStart), trail: text.slice(trailStart)};
}
// W richTextToString zamiast parts.push(wrapWithMarkers(text, {...})):
//   const edges = splitRunEdges(text);
//   if (!edges){ parts.push(text); continue; }
//   parts.push(`${edges.lead}${wrapWithMarkers(edges.core, {red, bold, italic, strike})}${edges.trail}`);
```

**Wyniki prototypu:**

- na archiwalnym skoroszycie zmienia się 51 pól (Premie Frakcji 40, Słowa Kluczowe Frakcji 8, Bestiariusz 2, Specjalne Bonusy Frakcji 1); widoczny tekst jest identyczny we wszystkich, `_meta` bez zmian;
- wersja przeglądarkowa i `build_json.py` dają bajtowo identyczny wynik na archiwalnym skoroszycie, na dwóch skoroszytach z przypadkami brzegowymi i na 30 000 losowych napisów;
- wszystkie widoczne zmiany wyświetlania to naprawy (Genokrad, Karzełkowiec, Aeldari) — bez regresji.

**Warunki i ryzyka:**

- zmianę trzeba wprowadzić **tylko** dla fragmentów rich text, a nie we wspólnej funkcji `wrapWithMarkers` — ta obsługuje też czerwone komórki bez fragmentów; zmiana tam zamieniłaby czerwoną komórkę z samą spacją w pusty tekst i zmieniła czerwone komórki zaczynające się lub kończące enterem;
- odrzucone odmiany: wynoszenie samych `\n` (nie łapie ` \n\nANIHILACJA`), wynoszenie wszystkich białych znaków (zmienia podział na paski, np. `{{B}}bagnet: {{/B}}5 + 2 DK` → `{{B}}bagnet:{{/B}} 5 + 2 DK` w kolumnie Atak), samo pomijanie fragmentów z białych znaków (nie naprawia błędu);
- fragment złożony z samej spacji traci styl — czerwona lub przekreślona spacja między słowami przestałaby być czerwona / przekreślona (w archiwalnych danych brak);
- nazwy cech i stanów w `_meta` mogłyby się zmienić, gdyby komórka „Nazwa” zaczynała się lub kończyła sformatowanym enterem (w archiwalnych danych brak — sprawdzić na aktualnym pliku);
- działa dopiero po „Generuj pliki danych” i imporcie do Firebase;
- dotyczy plików chronionych przez AGENTS.md (punkt 14): przed wdrożeniem trzeba uruchomić obie wersje na aktualnym `Repozytorium.xlsx`, porównać pliki `data.json` bajt w bajt i porównać pole po polu stary i nowy `data.json` (oczekiwane: wyłącznie przesunięcia znaczników).

### Rekomendacja

1. **Wariant B** w GeneratorNPC i DataVault jako trwała poprawka: działa od razu na istniejących danych, nie wymaga importu, nie dotyka parserów i nie może rozlać stylu.
2. **Wariant A** dla Kanopteka i pozostałych wpisów z listy z rozdz. 10, krok 4 — dla porządku w danych źródłowych (po wdrożeniu B nie jest konieczny).
3. **Wariant D** jest poprawną alternatywą „u źródła” (czyste dane dla każdego przyszłego odbiorcy), ale wymaga pełnego porównania wyników obu parserów i ponownego importu. Jeśli zostanie wdrożony później, wariant B pozostaje nieszkodliwy (na poprawionych danych nic nie zmienia).
4. **Wariant C** tylko wtedy, gdy wieloliniowe formatowanie (jak Talenty LP 45) ma być odwzorowane linia po linii — i wtedy w wersji dwuprzebiegowej.
5. Niezależnie od wyboru dopisać w `DataVault/docs/ZasadyFormatowania.md` (tabela „Typowe błędy w danych źródłowych”) wiersz: pogrubiony enter przed nagłówkiem → nagłówek traci pogrubienie na karcie i w tabelach → zdjąć pogrubienie z entera.

Dokumentacja do aktualizacji przy wdrożeniu (zgodnie z AGENTS.md):

- wariant B lub C: `GeneratorNPC/docs/Documentation.md`, `GeneratorNPC/docs/README.md`, `DataVault/docs/Documentation.md`, `DataVault/docs/README.md`, `DataVault/docs/ZasadyFormatowania.md` (rozdział „Zachowanie podziałów linii”);
- wariant D: `DataVault/docs/Documentation.md` (parser, zgodność JS/Python), `DataVault/docs/README.md`, `DataVault/docs/ZasadyFormatowania.md` (rozdział „Rich text z XLSX”);
- `DetaleLayout.md` nie wymaga zmian w żadnym wariancie: kolory, fonty, odstępy i klasy CSS pozostają te same.

---

## 13. Ryzyka

| Ryzyko | Ocena | Ograniczenie |
|---|---|---|
| Wniosek oparty na danych archiwalnych, nie na aktualnym wpisie LP 180 | niskie — mechanizm odtworzony 1:1 na prawdziwym kodzie, objaw identyczny | rozstrzyga rozdz. 10, krok 1 lub 2 |
| Nieaktualny import w Firebase jako przyczyna albo druga, nakładająca się przyczyna | niskie, ale niewykluczalne bez dostępu do danych | rozdz. 10, krok 1 i 2 rozróżniają oba przypadki; przy nieaktualnych danych wystarczy ponowny import |
| Naprawa tylko w Excelu wróci przy kolejnych edycjach | średnie | wariant B |
| Wariant B: rozbieżność kopii funkcji w dwóch modułach | niskie | ta sama funkcja i te same przypadki testowe w obu modułach; opis w `Documentation.md` obu modułów |
| Wariant B: linia przypisu `*[n]` poprzedzona pogrubionym enterem przestaje być rozpoznawana jako przypis | bardzo niskie (brak przypadków w archiwalnych danych) | wariant A dla takiej komórki |
| Wariant C (wersja prosta): niedomknięty, ręcznie wpisany znacznik rozlewa styl na kolejne linie | niskie (0 niedomkniętych znaczników w archiwalnych danych) | wersja dwuprzebiegowa |
| Wariant D: zmiana generowanych danych, konieczność importu, zmiana plików chronionych | średnie | pełne porównanie wyników obu parserów przed wdrożeniem; nie jest potrzebny, jeśli wdrożony zostanie wariant B |

---

## 14. Obserwacje poboczne (niezwiązane bezpośrednio z pogrubieniem ANIHILACJI)

1. **Dwukropek wewnątrz pogrubienia skleja paski.** `entryStartRegex` (`GeneratorNPC/index.html:2274-2275`) nie pomija znaczników. Linia `{{B}}DETERMINACJA:{{/B}} Wydaj…` (dwukropek pogrubiony razem ze słowem) nie zaczyna nowego paska, bo po dwukropku stoi `{{`, a nie spacja — trafia do poprzedniego paska. Pogrubienie działa, ale podział na paski jest błędny. To samo dotyczy linii typu `{{B}}Monstrualne tnące pazury{{/B}}: 15 + 4 DK` (dwukropek poza pogrubieniem, ale tuż za znacznikiem). Na kartach ze zrzutów ekranu DETERMINACJA ma osobny pasek, więc w aktualnych danych tych wpisów ten przypadek nie dotyczy. Sprawdzanie początku paska na tekście bez znaczników usunęłoby usterkę, ale to **zmiana widoczna**: w archiwalnych danych inaczej podzieliłoby się 6 pól (Bestiariusz: Zwiadowca Skitarii LP 51, Karnifeks LP 65, Psychneuein LP 66; Hordy LP 3; Słowa Kluczowe LP 55 i 64), więc wymaga osobnej decyzji i nie jest potrzebne do naprawy pogrubienia.
2. **Opis cechy w okienku podpowiedzi pokazuje surowe znaczniki.** `popoverDescription.textContent = resolveTraitDescription(traitName)` (`GeneratorNPC/index.html:3469`) wstawia opis cechy bez interpretacji znaczników, więc np. „[{{B}}Podręcznik Główny{{/B}} (str. 189)]” byłoby widoczne dosłownie. W archiwalnych danych znaczniki zawiera 7 z 32 opisów cech (wniosek z kodu i danych; nie oglądano tego w przeglądarce).
3. **Wielowierszowa czerwona komórka bez formatowania mieszanego.** Gdy cała komórka ma czerwony styl i nie ma fragmentów, parser owija cały tekst jedną parą `{{RED}}…{{/RED}}` (`xlsxCanonicalParser.js:163-179`). Przy kilku liniach widoki „linia po linii” zgubiłyby czerwień od drugiej linii. W archiwalnych danych nie wystąpiło.
4. **Bezwzględne ścieżki w pliku XLSX.** Oba parsery budują ścieżkę arkusza jako `xl/` + `Target` (`build_json.py:284`, `xlsxCanonicalParser.js:217`), więc nie odczytają pliku z bezwzględnymi ścieżkami (zapisuje je np. openpyxl). Excel zapisuje ścieżki względne, więc dla `Repozytorium.xlsx` nie ma to znaczenia.

---

## 15. Następne kroki

1. **Potwierdzenie (użytkownik, kilka minut):** rozdz. 10 — krok 1 (polecenie w konsoli DataVault na danych z Firebase) albo krok 2 (wyszukanie `{{B}}\nANIHILACJA` w świeżo wygenerowanym `data.json`). Wygląd tabel nie rozstrzyga przyczyny.
2. **Decyzja o wariancie naprawy:** rekomendowany wariant B (rozdz. 12), opcjonalnie wraz z poprawką danych w Excelu (wariant A).
3. **Lista wszystkich wpisów z tym samym problemem:** polecenie z rozdz. 10, krok 4 (w archiwalnych danych: Karzełkowiec, Genokrad, Aeldari w „Słowach Kluczowych Frakcji”; osobno Talent „Operator broni specjalnej” z pogrubieniem przez dwie linie).
4. **Osobne decyzje (niezwiązane z pogrubieniem):** sklejanie pasków przy pogrubionym dwukropku (rozdz. 14 pkt 1) i surowe znaczniki w okienku opisu cechy (rozdz. 14 pkt 2).

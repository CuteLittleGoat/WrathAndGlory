# Brak pogrubienia części nagłówków w sekcji „Zdolności” na karcie GeneratorNPC — analiza

> **Data:** 11 października 2026
> **Temat:** dlaczego na karcie „Kanoptek Skarabeusz” (LP 180) nagłówek „ANIHILACJA: Protokoły ożywienia” wychodzi zwykłą czcionką, choć w `Repozytorium.xlsx` jest pogrubiony, a na karcie „Rozdzieracz” (LP 185) ten sam nagłówek wygląda prawidłowo
> **Charakter dokumentu:** analiza przyczyny. Kod nie został zmieniony — zgodnie z poleceniem użytkownika
> **Moduły, których dotyczy:** GeneratorNPC (karta i tabela podglądu), DataVault (generator danych i tabela)
> **Stan na dziś:** przyczyna **potwierdzona na oryginalnych plikach** użytkownika (`Repozytorium.xlsx` i `firebase-import.json`). Użytkownik wybrał poprawkę **generatora danych** w DataVault; jej projekt i wyniki testów na prawdziwym pliku — **część II (rozdz. 16 i dalsze)**. Rozdziały 1–15 to pierwotna analiza wykonana bez dostępu do aktualnych danych

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

> **Uwaga:** po analizie oryginalnych plików użytkownik wybrał poprawkę **generatora danych** (wariant D w rozwiniętej postaci). Aktualna rekomendacja, kod i wyniki testów — rozdz. 20–24. Poniższe warianty pozostają jako tło decyzji.

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

> **Uwaga:** kroki z tego rozdziału zostały zastąpione przez rozdz. 24 i 25 (część II).

1. **Potwierdzenie (użytkownik, kilka minut):** rozdz. 10 — krok 1 (polecenie w konsoli DataVault na danych z Firebase) albo krok 2 (wyszukanie `{{B}}\nANIHILACJA` w świeżo wygenerowanym `data.json`). Wygląd tabel nie rozstrzyga przyczyny.
2. **Decyzja o wariancie naprawy:** rekomendowany wariant B (rozdz. 12), opcjonalnie wraz z poprawką danych w Excelu (wariant A).
3. **Lista wszystkich wpisów z tym samym problemem:** polecenie z rozdz. 10, krok 4 (w archiwalnych danych: Karzełkowiec, Genokrad, Aeldari w „Słowach Kluczowych Frakcji”; osobno Talent „Operator broni specjalnej” z pogrubieniem przez dwie linie).
4. **Osobne decyzje (niezwiązane z pogrubieniem):** sklejanie pasków przy pogrubionym dwukropku (rozdz. 14 pkt 1) i surowe znaczniki w okienku opisu cechy (rozdz. 14 pkt 2).

---
---

# Część II — analiza na oryginalnych plikach i projekt poprawki generatora

## 16. Prompt użytkownika do części II (zachowany w całości)

Pierwsza wiadomość, z dwoma załącznikami: `Repozytorium.xlsx` (oryginalne dane) i `firebase-import.json` (plik wygenerowany z tego XLSX i zaimportowany do Firebase):

> Załączam plik xlsx z oryginalnymi danymi oraz plik json, który został z niego wygenerowany i wrzucony do Firebase.
> Popraw sposób generowania pliku json, żeby zabezpieczyć się przed tego typu problemem w przyszłości.
> Jak poprawisz mechanizm, to wygeneruję nowe pliki json.
> Jeszcze nie zmieniaj nic w kodzie. Rozbuduj tylko analizę mając do dyspozycji oryginalne pliki.

Druga wiadomość (doprecyzowanie wymagania):

> Po poprawce pogrubienie musi działać zarówno jeżeli pogrubienie w xlsx zaczyna się od entera oraz jak zaczyna się od litery. Czyli oba przypadki muszą być obsłużone.

Oba pliki zostały użyte wyłącznie do analizy. Nie trafiły do repozytorium (DataVault celowo nie przechowuje w nim danych).

---

## 17. Potwierdzenie przyczyny na oryginalnych plikach

### 17.1. Dane w Firebase

`firebase-import.json`: `schemaVersion` = `datavault-firebase-import-v1`, `createdAt` = `2026-10-08T10:26:41.502Z`, 38 arkuszy, Bestiariusz — 217 wpisów. Pole „Zdolności”:

- **LP 180 Kanoptek Skarabeusz:** `…zwiększa DK i Cechę Wybuchowa o +1.\n{{B}}\nANIHILACJA: Protokoły ożywienia{{/B}}\nKiedy t…` — dokładnie układ przewidziany w rozdz. 5.2 (pogrubiony enter przed nagłówkiem);
- **LP 185 Rozdzieracz:** `…musi wykonać Test Strachu o ST 3.\n\n{{B}}ANIHILACJA: Protokoły ożywienia{{/B}}\nKiedy t…` — układ poprawny.

### 17.2. Komórka w pliku XLSX

Fragment `xl/sharedStrings.xml` komórki Kanopteka:

```xml
…K i Cechę Wybuchowa o +1.
</t></r><r><rPr><b/><sz val="8"/><color theme="1"/><rFont val="Calibri"/>…</rPr><t xml:space="preserve">
ANIHILACJA: Protokoły ożywienia</t></r><r><rPr><sz val="8"/>…
```

Pogrubiony fragment (`<b/>`) zaczyna się od znaku nowej linii — zgodnie z rozdz. 5.1.

### 17.3. Dane w Firebase nie są nieaktualne

Obecny `DataVault/build_json.py` uruchomiony na załączonym `Repozytorium.xlsx` daje dane **identyczne** z zawartością `firebase-import.json` (wszystkie arkusze i `_meta`). Firebase zawiera więc dokładnie to, co generator robi dziś z aktualnego pliku. Hipoteza o nieaktualnym imporcie (rozdz. 8) jest **obalona**; jedyną przyczyną jest opisany w rozdz. 3–5 sposób zamiany formatowania na znaczniki.

Ten wynik jest też punktem odniesienia dla poprawki: wszystkie porównania w kolejnych rozdziałach liczone są względem danych, które są dziś w Firebase.

---

## 18. Wszystkie wpisy z tym samym problemem w aktualnych danych

Skan wszystkich pól tekstowych prawdziwym kodem wyświetlającym (karta GeneratorNPC, tabela GeneratorNPC, tabela DataVault):

- 2265 pól zawiera znaczniki formatowania;
- w 63 polach co najmniej jedna para znaczników obejmuje znak nowej linii (122 pary) — w większości nieszkodliwie (np. `{{I}}lub\n{{/I}}` w „Premiach Frakcji”);
- **widoczna utrata formatowania** występuje w poniższych polach.

### 18.1. Karta GeneratorNPC (i obie tabele) — 13 wpisów Bestiariusza

| LP | Nazwa | Kolumna | Nagłówek, który traci pogrubienie |
|---|---|---|---|
| 34 | Karzełkowiec | Zdolności | „Rozmiar ma znaczenie:” |
| 43 | Genokrad | Zdolności | „DETERMINACJA: Błyskawiczny refleks” |
| 77 | Wyjąca Banshee | Atak | „Ostrze banshee” |
| 78 | Wyjąca Banshee Egzarcha | Atak | „Kat” |
| 98 | Agent Losu | Premie | „Peleryna maskująca” |
| 127 | Burszuj | Zdolności | „REAKCJA: Niepokonany! Jak ork!” |
| 132 | Komandoz | Opcje Hordy | „Duża szczelba” |
| 147 | Morkanauta | Premie | „Wielki i miażdżący” |
| 176 | Chronomanta | Zdolności | „REAKCJA: Chronomacki” |
| 178 | Nekron Wojownik | Zdolności | „ANIHILACJA: Protokoły ożywienia” |
| **180** | **Kanoptek Skarabeusz** | **Zdolności** | **„ANIHILACJA: Protokoły ożywienia”** |
| 184 | Gwardzista-Licz | Zdolności | „REAKCJA: Protokoły strażnicze” |
| 196 | Shas'ui w Maskującym Kombinezonie bojowym XV25 | Zdolności | „ZGUBA: Skok odrzutowy” |

We wszystkich 13 przypadkach mechanizm jest ten sam: pogrubiony fragment w XLSX zaczyna się od entera.

### 18.2. Tylko tabele (arkusze, których GeneratorNPC nie pokazuje na karcie)

| Arkusz | LP | Kolumna | Co traci formatowanie | Przyczyna |
|---|---|---|---|---|
| Słowa Kluczowe Frakcji | 11 (Aeldari, Koteria) | Opis | pogrubienie „Sunblitz Brotherhood” | fragment zaczyna się od entera |
| Słowa Kluczowe Frakcji | 11 (Aeldari, Koteria) | Efekt | pogrubienie „Sunblitz Brotherhood”, kursywa „[dane utajnione]” (5×) | fragmenty zaczynają się od entera |
| Talenty | 45 (Operator broni specjalnej) | Efekt | pogrubienie drugiej linii pogrubionego fragmentu | pogrubiony fragment ma tekst w dwóch liniach |

---

## 19. Wymaganie użytkownika i zestaw testów akceptacyjnych

**Wymaganie:** po poprawce formatowanie musi działać tak samo, gdy pogrubienie w XLSX zaczyna się **od litery** i gdy zaczyna się **od entera** — na karcie GeneratorNPC, w tabeli GeneratorNPC i w tabeli DataVault.

Do sprawdzenia tego wymagania przygotowano skoroszyt testowy (zapisany jak przez Excel — z tabelą wspólnych tekstów i znacznikiem `<b/>`). Każdy wiersz ma ten sam widoczny tekst, różni się tylko tym, gdzie zaczyna się i kończy formatowanie:

| Wiersz | Przypadek | Obecny generator: karta / tabela GeneratorNPC / tabela DataVault |
|---|---|---|
| R1 | pogrubienie od litery (jak Rozdzieracz) | OK / OK / OK |
| R2 | pogrubienie od 1 entera (jak Kanoptek) | **źle / źle / źle** |
| R3 | pogrubienie od 2 enterów | **źle / źle / źle** |
| R4 | pogrubienie od spacji i 2 enterów | **źle / źle / źle** |
| R5 | enter po nagłówku w pogrubieniu | OK / OK / OK |
| R6 | entery w pogrubieniu z obu stron nagłówka | **źle / źle / źle** |
| R7 | pogrubienie od kropki kończącej poprzednią linię | **źle / źle / źle** |
| R8 | pogrubiony tekst w dwóch liniach | OK / **źle / źle** |
| R9 | kursywa od entera | **źle / źle / źle** |
| R10 | czerwony kolor od entera | **źle / źle / źle** |
| R11 | pogrubienie z kursywą od entera | **źle / źle / źle** |
| R12 | pierwszy fragment komórki zaczyna się od entera | **źle / źle / źle** |

Wynik „OK” oznacza, że każdy widoczny znak ma na ekranie dokładnie ten styl, jaki ma w Excelu. Przeglądarkowy parser i `build_json.py` dają na tym skoroszycie identyczny wynik.

**Kryterium akceptacji poprawki:** wszystkie 12 wierszy „OK” we wszystkich trzech widokach, w obu generatorach (przeglądarka i `build_json.py`), przy bajtowo identycznym wyniku obu generatorów.

---

## 20. Projekty poprawki generatora i ich porównanie

Zasada, którą poprawka ma zagwarantować: **żadna para znaczników (`{{B}}…{{/B}}`, `{{I}}…{{/I}}`, `{{RED}}…{{/RED}}`, `{{S}}…{{/S}}`) w wygenerowanych danych nie obejmuje znaku nowej linii.** Wtedy każda linia ma komplet znaczników, a sposób wyświetlania w GeneratorNPC i DataVault (każda linia lub pasek formatowany osobno) przestaje gubić formatowanie — bez względu na to, czy pogrubienie w Excelu zaczyna się od litery, od entera, czy obejmuje kilka linii.

Zmiana dotyczy wyłącznie dwóch generatorów, które muszą dawać identyczny wynik (AGENTS.md, punkt 14): `DataVault/xlsxCanonicalParser.js` (przycisk „Generuj pliki danych”) i `DataVault/build_json.py`. Wyświetlanie w GeneratorNPC i DataVault pozostaje bez zmian.

Rozważono dwa projekty, oba sprawdzone na oryginalnym `Repozytorium.xlsx` w obu językach:

| | **E — „krawędziowy”** | **L — „liniowy”** (rekomendowany) |
|---|---|---|
| Idea | entery z **brzegów** każdego fragmentu wychodzą poza znaczniki | tekst z enterami jest dzielony na linie i **każda linia** dostaje własną parę znaczników |
| Gdzie w kodzie | tylko obsługa fragmentów rich text (`richTextToString` / `_rich_text_to_string`) | wspólna funkcja owijania (`wrapWithMarkers` / `_wrap_with_markers`) — obejmuje też komórki czerwone w całości |
| Zestaw R1–R12 (rozdz. 19) | 10 / 12 — **nie przechodzą R7 i R8** | **12 / 12** |
| 13 kart Bestiariusza | naprawione | naprawione |
| Aeldari (Słowa Kluczowe Frakcji LP 11) | naprawione | naprawione |
| Talenty LP 45 (pogrubienie przez dwie linie) | **nie naprawione** | naprawione |
| Pola z parą znaczników przez enter po poprawce | 1 | **0** |
| Zmienione pola na prawdziwym pliku | 62 | 63 |
| Zmiana widocznego tekstu / `_meta` / podziału kart na paski | brak / brak / brak | brak / brak / brak |
| Pogorszenia wyświetlania | 0 | 0 |
| Zgodność przeglądarka = `build_json.py` | bajtowo identyczne | bajtowo identyczne |

Projekt E spełnia samo wymaganie „od litery = od entera” dla typowych przypadków, ale zostawia luki (pogrubienie zaczynające się od ostatniego znaku poprzedniej linii, pogrubiony tekst w kilku liniach). Projekt L zamyka je wszystkie jedną regułą, więc to on jest rekomendowany jako zabezpieczenie „na przyszłość”.

---

## 21. Rekomendowana poprawka — projekt L

### 21.1. Reguły

Funkcja owijająca tekst znacznikami (ta sama w obu generatorach) działa tak:

1. **Brak stylu** → tekst bez zmian.
2. **Tekst bez entera** → cały tekst w jednej parze znaczników — **dokładnie jak dziś**. Dzięki temu pola jednoliniowe, w tym pogrubienie zaczynające się od litery (R1), nie zmieniają się ani o znak.
3. **Tekst z enterami** → dzielony na linie (enter = `\r\n`, `\n` albo samotne `\r`). W każdej linii spacje i tabulatory **stykające się z enterem** zostają poza znacznikami, niepusta reszta linii dostaje własną parę znaczników, a linia pusta (albo z samych spacji) zostaje bez znaczników. Spacji, które nie stykają się z enterem, funkcja nie rusza — od nich zależy podział karty na paski (np. `{{B}}bagnet: {{/B}}5 + 2 DK`).
4. **Tekst złożony tylko z enterów, spacji i tabulatorów** → pusta para znaczników przed tekstem (np. `{{B}}{{/B}}\n`). Pusta para nic nie wyświetla, a pole nie staje się puste po przycięciu, więc żaden wiersz nie znika z danych.

Ponieważ reguły działają we wspólnej funkcji owijającej, obejmują zarówno fragmenty rich text, jak i komórki czerwone w całości (dziś w pliku nie ma wieloliniowych komórek tego typu, ale po poprawce nie mogą już sprawić kłopotu).

### 21.2. Jak zmienia się zapis (przykłady z prawdziwego pliku)

| Pole | Dziś | Po poprawce |
|---|---|---|
| Bestiariusz LP 180, Zdolności | `…o +1.\n{{B}}\nANIHILACJA: Protokoły ożywienia{{/B}}` | `…o +1.\n\n{{B}}ANIHILACJA: Protokoły ożywienia{{/B}}` |
| Bestiariusz LP 34, Zdolności | `…ataku.\n{{B}}\nRozmiar ma znaczenie: {{/B}}Horda` | `…ataku.\n\n{{B}}Rozmiar ma znaczenie: {{/B}}Horda` |
| Premie z Przeszłości Frakcji LP 1, Premia 1 | `Odwaga {{I}}lub\n{{/I}}Determinacja` | `Odwaga {{I}}lub{{/I}}\nDeterminacja` |
| Słowa Kluczowe Frakcji LP 11, Efekt | `{{I}}\n[dane utajnione]\n\n{{/I}}` | `\n{{I}}[dane utajnione]{{/I}}\n\n` |
| Talenty LP 45, Efekt | `{{B}} (str. 217)].\n* Miotacz ognia [Podręcznik Główny{{/B}}` | `{{B}} (str. 217)].{{/B}}\n{{B}}* Miotacz ognia [Podręcznik Główny{{/B}}` |
| Specjalne Bonusy Frakcji LP 15, Opis | `…wyglądu\n{{B}}\n{{/B}}Zyskujesz` | `…wyglądu\n{{B}}{{/B}}\nZyskujesz` |

Zapis dla Kanopteka po poprawce jest **znak w znak taki sam** jak zapis Rozdzieracza, czyli jak pogrubienie zaczynające się od litery.

### 21.3. Kod — `DataVault/build_json.py`

Zastępuje obecną funkcję `_wrap_with_markers` (linie 82–91). Moduł już importuje `re`.

```python
# Złamanie linii dla owijania markerami: CRLF, samotne LF albo samotne CR (najdłuższe dopasowanie
# pierwsze). Parsery XML (ElementTree i DOMParser) zamieniają dosłowne CRLF/CR z pliku na LF, więc CR
# może tu trafić tylko z odwołania &#13;. Celowo NIE używamy str.splitlines(), bo ta dzieli też na
# U+2028, U+2029, \x0b, \x0c, \x1c-\x1e i \x85, a renderery i xlsxCanonicalParser.js tego nie robią.
# Line break used for marker wrapping: CRLF, a lone LF or a lone CR (longest match first). The XML
# parsers (ElementTree and DOMParser) turn literal CRLF/CR from the file into LF, so a CR can only arrive
# here from a &#13; reference. str.splitlines() is deliberately NOT used: it also splits on U+2028, U+2029,
# \x0b, \x0c, \x1c-\x1e and \x85, which the renderers and xlsxCanonicalParser.js do not do.
_LINE_BREAK_RE = re.compile(r"(\r\n|\r|\n)")


def _wrap_with_markers(text: str, *, red=False, bold=False, italic=False, strike=False) -> str:
  """Owija tekst markerami tak, aby żadna para markerów nie zawierała złamania linii.

  Renderery DataVault (formatTextHTML, formatFactionKeywordHTML) i GeneratorNPC (formatTextHTML,
  splitEntries + formatSectionEntries) formatują każdą linię albo pasek osobno, z pustym stosem stylów.
  Para markerów przechodząca przez złamanie linii gubi więc styl na kolejnych liniach, np. run
  "\\nANIHILACJA: ..." dawał "{{B}}\\nANIHILACJA: ...{{/B}}" i nagłówek był zwykłym tekstem.
  Zasady (identyczne jak wrapWithMarkers w DataVault/xlsxCanonicalParser.js):
  1. Brak stylu -> tekst bez zmian.
  2. Tekst bez złamania linii -> cały tekst w jednej parze markerów (także pusty i z samych spacji),
     dokładnie jak dotąd, więc pola jednolinijkowe i puste czerwone komórki się nie zmieniają.
  3. Tekst ze złamaniami linii -> dzielimy go na linie; spacje i tabulatory dotykające złamania linii
     zostają poza markerami, niepusta reszta linii dostaje własną parę markerów, linia z samych
     spacji/tabulatorów zostaje bez markerów. Spacji, które nie dotykają złamania linii, nie ruszamy,
     bo od nich zależy podział na paski w splitEntries (np. "{{B}}bagnet: {{/B}}5").
  4. Tekst złożony wyłącznie ze spacji, tabulatorów i złamań linii -> jedna pusta para markerów przed
     tekstem. Wynik pozostaje niepusty po trim() tak samo jak dotąd, więc rows_to_records nie pomija
     wiersza, a pole nie staje się puste; pusta para nie renderuje żadnego elementu.

  Wraps text in markers so that no marker pair contains a line break.

  The DataVault renderers (formatTextHTML, formatFactionKeywordHTML) and the GeneratorNPC renderers
  (formatTextHTML, splitEntries + formatSectionEntries) format every line or stripe separately, with an
  empty style stack. A marker pair that crosses a line break therefore loses its style on the following
  lines, e.g. the run "\\nANIHILACJA: ..." produced "{{B}}\\nANIHILACJA: ...{{/B}}" and the header was
  rendered as plain text. Rules (identical to wrapWithMarkers in DataVault/xlsxCanonicalParser.js):
  1. No style -> the text is returned unchanged.
  2. Text without a line break -> the whole text in one marker pair (also empty and space-only text),
     exactly as before, so single-line fields and empty red cells do not change.
  3. Text with line breaks -> it is split into lines; spaces and tabs touching a line break stay outside
     the markers, the non-empty rest of each line gets its own marker pair, a line made only of spaces/tabs
     stays unmarked. Spaces that do not touch a line break are left alone, because splitEntries stripe
     splitting depends on them (e.g. "{{B}}bagnet: {{/B}}5").
  4. Text made only of spaces, tabs and line breaks -> one empty marker pair before the text. The result
     stays non-blank after trim() exactly as before, so rows_to_records does not skip the row and the field
     does not become empty; an empty pair renders no element.
  """
  markers = [
    ("{{RED}}", "{{/RED}}", red),
    ("{{B}}", "{{/B}}", bold),
    ("{{I}}", "{{/I}}", italic),
    ("{{S}}", "{{/S}}", strike),
  ]
  start = "".join(op for op,_,use in markers if use)
  end = "".join(cl for _,cl,use in reversed(markers) if use)
  # Reguła 1: bez stylu nie dodajemy markerów / Rule 1: no style, no markers
  if not start:
    return text
  # Reguła 2: tekst jednolinijkowy owijamy w całości, jak dotąd / Rule 2: single-line text is wrapped whole, as before
  if "\n" not in text and "\r" not in text:
    return f"{start}{text}{end}"
  # Reguła 3: na pozycjach parzystych są linie, na nieparzystych złamania linii
  # Rule 3: even positions hold lines, odd positions hold the line breaks
  parts = _LINE_BREAK_RE.split(text)
  last = len(parts) - 1
  out = []
  wrapped = False
  for i, part in enumerate(parts):
    if i % 2 == 1:
      out.append(part)
      continue
    lo, hi = 0, len(part)
    # Spacje/tabulatory tuż za złamaniem linii zostają przed markerem otwierającym
    # Spaces/tabs right after a line break stay before the opening marker
    if i > 0:
      while lo < hi and part[lo] in " \t":
        lo += 1
    # Spacje/tabulatory tuż przed złamaniem linii zostają za markerem zamykającym
    # Spaces/tabs right before a line break stay after the closing marker
    if i < last:
      while hi > lo and part[hi - 1] in " \t":
        hi -= 1
    if hi > lo:
      out.append(f"{part[:lo]}{start}{part[lo:hi]}{end}{part[hi:]}")
      wrapped = True
    else:
      # Linia pusta albo z samych spacji/tabulatorów zostaje bez markerów
      # An empty or spaces/tabs-only line stays unmarked
      out.append(part)
  # Reguła 4: nic nie zostało owinięte -> pusta para markerów przed tekstem (bez złamania linii w środku)
  # Rule 4: nothing was wrapped -> an empty marker pair before the text (no line break inside it)
  if not wrapped:
    return f"{start}{end}{text}"
  return "".join(out)
```

### 21.4. Kod — `DataVault/xlsxCanonicalParser.js`

Zastępuje obecną funkcję `wrapWithMarkers` (linie 57–67), wewnątrz bloku `(function(global){ … })(window);`.

```js
// --- Owijanie tekstu markerami bez pary markerów przechodzącej przez złamanie linii / Wrapping text in markers so that no marker pair crosses a line break ---
// Renderery DataVault (formatTextHTML, formatFactionKeywordHTML) i GeneratorNPC (formatTextHTML,
// splitEntries + formatSectionEntries) formatują każdą linię albo pasek osobno, z pustym stosem stylów.
// Para markerów przechodząca przez złamanie linii gubi więc styl na kolejnych liniach, np. run
// "\nANIHILACJA: ..." dawał "{{B}}\nANIHILACJA: ...{{/B}}" i nagłówek był zwykłym tekstem.
// Zasady (identyczne jak _wrap_with_markers w DataVault/build_json.py):
// 1. Brak stylu -> tekst bez zmian.
// 2. Tekst bez złamania linii -> cały tekst w jednej parze markerów (także pusty i z samych spacji),
//    dokładnie jak dotąd, więc pola jednolinijkowe i puste czerwone komórki się nie zmieniają.
// 3. Tekst ze złamaniami linii (CRLF, LF albo samotne CR) -> dzielimy go na linie; spacje i tabulatory
//    dotykające złamania linii zostają poza markerami, niepusta reszta linii dostaje własną parę markerów,
//    linia z samych spacji/tabulatorów zostaje bez markerów. Spacji, które nie dotykają złamania linii,
//    nie ruszamy, bo od nich zależy podział na paski w splitEntries (np. "{{B}}bagnet: {{/B}}5").
// 4. Tekst złożony wyłącznie ze spacji, tabulatorów i złamań linii -> jedna pusta para markerów przed
//    tekstem. Wynik pozostaje niepusty po trim() tak samo jak dotąd, więc rowsToRecords nie pomija
//    wiersza, a pole nie staje się puste; pusta para nie renderuje żadnego elementu.
// The DataVault renderers (formatTextHTML, formatFactionKeywordHTML) and the GeneratorNPC renderers
// (formatTextHTML, splitEntries + formatSectionEntries) format every line or stripe separately, with an
// empty style stack. A marker pair that crosses a line break therefore loses its style on the following
// lines, e.g. the run "\nANIHILACJA: ..." produced "{{B}}\nANIHILACJA: ...{{/B}}" and the header was
// rendered as plain text. Rules (identical to _wrap_with_markers in DataVault/build_json.py):
// 1. No style -> the text is returned unchanged.
// 2. Text without a line break -> the whole text in one marker pair (also empty and space-only text),
//    exactly as before, so single-line fields and empty red cells do not change.
// 3. Text with line breaks (CRLF, LF or a lone CR) -> it is split into lines; spaces and tabs touching a
//    line break stay outside the markers, the non-empty rest of each line gets its own marker pair, a line
//    made only of spaces/tabs stays unmarked. Spaces that do not touch a line break are left alone,
//    because splitEntries stripe splitting depends on them (e.g. "{{B}}bagnet: {{/B}}5").
// 4. Text made only of spaces, tabs and line breaks -> one empty marker pair before the text. The result
//    stays non-blank after trim() exactly as before, so rowsToRecords does not skip the row and the field
//    does not become empty; an empty pair renders no element.
function wrapWithMarkers(text, {red=false, bold=false, italic=false, strike=false} = {}){
  const markers = [
    ["{{RED}}", "{{/RED}}", red],
    ["{{B}}", "{{/B}}", bold],
    ["{{I}}", "{{/I}}", italic],
    ["{{S}}", "{{/S}}", strike],
  ];
  const start = markers.filter((m)=>m[2]).map((m)=>m[0]).join("");
  const end = markers.slice().reverse().filter((m)=>m[2]).map((m)=>m[1]).join("");
  const value = `${text}`;
  // Reguła 1: bez stylu nie dodajemy markerów / Rule 1: no style, no markers
  if (!start) return value;
  // Reguła 2: tekst jednolinijkowy owijamy w całości, jak dotąd / Rule 2: single-line text is wrapped whole, as before
  if (!value.includes("\n") && !value.includes("\r")) return `${start}${value}${end}`;
  // Reguła 3: na pozycjach parzystych są linie, na nieparzystych złamania linii (najdłuższe dopasowanie
  // pierwsze; U+2028/U+2029 nie są złamaniem linii, tak jak w rendererach i w build_json.py)
  // Rule 3: even positions hold lines, odd positions hold the line breaks (longest match first;
  // U+2028/U+2029 are not line breaks, as in the renderers and in build_json.py)
  const parts = value.split(/(\r\n|\r|\n)/);
  const last = parts.length - 1;
  const isSpaceOrTab = (ch)=>ch === " " || ch === "\t";
  let out = "";
  let wrapped = false;
  for (let i = 0; i < parts.length; i += 1){
    const part = parts[i];
    if (i % 2 === 1){
      out += part;
      continue;
    }
    let lo = 0;
    let hi = part.length;
    // Spacje/tabulatory tuż za złamaniem linii zostają przed markerem otwierającym
    // Spaces/tabs right after a line break stay before the opening marker
    if (i > 0){
      while (lo < hi && isSpaceOrTab(part[lo])) lo += 1;
    }
    // Spacje/tabulatory tuż przed złamaniem linii zostają za markerem zamykającym
    // Spaces/tabs right before a line break stay after the closing marker
    if (i < last){
      while (hi > lo && isSpaceOrTab(part[hi - 1])) hi -= 1;
    }
    if (hi > lo){
      out += `${part.slice(0, lo)}${start}${part.slice(lo, hi)}${end}${part.slice(hi)}`;
      wrapped = true;
    } else {
      // Linia pusta albo z samych spacji/tabulatorów zostaje bez markerów
      // An empty or spaces/tabs-only line stays unmarked
      out += part;
    }
  }
  // Reguła 4: nic nie zostało owinięte -> pusta para markerów przed tekstem (bez złamania linii w środku)
  // Rule 4: nothing was wrapped -> an empty marker pair before the text (no line break inside it)
  return wrapped ? out : `${start}${end}${value}`;
}
```

Wywołania (`richTextToString` / `_rich_text_to_string` oraz obsługa komórek czerwonych w całości) **nie wymagają zmian** — korzystają z poprawionej funkcji.

---

## 22. Wyniki projektu L na oryginalnych plikach

Wszystkie porównania liczone względem danych, które są dziś w Firebase (rozdz. 17.3).

| Sprawdzenie | Wynik |
|---|---|
| Przeglądarka (prawdziwy `xlsxCanonicalParser.js` + `buildDataJsonFromSheets` w Chromium) vs `build_json.py` | **bajtowo identyczne** pliki `data.json` |
| Walidacja `firebase-import.json` (`validateFirebaseImportObject`) | przechodzi |
| Zmienione pola | **63** (Bestiariusz 13, Premie z Przeszłości Frakcji 40, Słowa Kluczowe Frakcji 8, Specjalne Bonusy Frakcji 1, Talenty 1) |
| Widoczny tekst (po usunięciu znaczników) | identyczny we wszystkich 63 polach |
| `_meta` (cechy, stany, kolejność arkuszy i kolumn) | identyczne |
| Pola z parą znaczników przez enter | 63 → **0** |
| Karta GeneratorNPC | naprawione **13 z 13**, pogorszenia 0 |
| Tabela GeneratorNPC i tabela DataVault | naprawione wszystkie pola z wadą (13 Bestiariusza, Aeldari ×2, Talenty LP 45), pogorszenia 0 |
| Kolumna „Słowo Kluczowe” w „Słowach Kluczowych Frakcji” (osobny sposób wyświetlania w DataVault) | 5 zmienionych pól, wygląd identyczny |
| Liczba pasków na kartach | bez zmian we wszystkich polach |
| Prawdziwa strona GeneratorNPC w przeglądarce (13 wpisów z rozdz. 18.1) | dziś: grubość czcionki nagłówka 400 w tabeli i na karcie (13 / 13); po poprawce: **700** (13 / 13); liczba pasków identyczna; 0 błędów strony |
| Zestaw R1–R12 | **12 / 12 OK** w obu generatorach; R2, R3, R5, R6 dają zapis bajtowo identyczny z R1 |
| Losowe napisy (60 000 przypadków: spacje, tabulatory, `\r`, `\n`, `\r\n`, twarde spacje, U+2028, emoji, polskie litery) | 0 różnic JS / Python, 0 zmian widocznego tekstu, 0 par przez enter |

**Co zobaczysz po ponownym imporcie:** pogrubione nagłówki na kartach i w tabelach 13 wpisów z rozdz. 18.1, poprawione pogrubienie i kursywę w „Słowach Kluczowych Frakcji” LP 11 (DataVault) oraz pogrubienie w Talentach LP 45 dokładnie tak, jak w Excelu. Uwaga do Talentów LP 45 (komórka `Talenty!G46`): w Excelu pogrubiony jest tam fragment „ (str. 217)].” i cała linia „* Miotacz ognia [Podręcznik Główny”, podczas gdy w pozostałych liniach tej komórki pogrubione jest tylko „Podręcznik Główny”. To wygląda na przypadkowe formatowanie w Excelu — po poprawce będzie ono widoczne, bo generator odda je wiernie. Warto tę komórkę poprawić w Excelu.

Żadne inne pole nie zmieni wyglądu.

---

## 23. Dodatkowe zabezpieczenia — ocena

### 23.1. Kontrola po wygenerowaniu danych — **odrzucona przez użytkownika**

> **Decyzja użytkownika:** generator **nie** ma wyświetlać żadnego ostrzeżenia. Kontroli opisanej poniżej nie wdrażamy; opis zostaje wyłącznie jako tło decyzji.

Po zbudowaniu `data.json` oba generatory mogłyby sprawdzić każde pole tekstowe (arkusze i `_meta`): czy znaczniki są domknięte i poprawnie zagnieżdżone oraz czy żadna para nie obejmuje entera. Prototyp takiej kontroli (JS i Python, identyczne raporty) zgłasza na dzisiejszych danych 63 pola (122 pary, 16 pól z widocznym skutkiem), a na danych po poprawce L — **0**.

Rekomendacja: kontrola **tylko ostrzega** (wpis w dzienniku DataVault i komunikat w konsoli `build_json.py`), a pliki są generowane normalnie. Po poprawce L ostrzeżenie może się pojawić wyłącznie przy błędzie w kodzie generatora albo przy znacznikach wpisanych ręcznie w Excelu — w obu przypadkach dane nadal da się wczytać, a ostrzeżenie mówi, co sprawdzić. Blokowanie generowania utrudniłoby pracę bez realnej korzyści.

Przykładowy komunikat (na dzisiejszych danych): „UWAGA: kontrola formatowania — pola z problemami: 63, z widocznym skutkiem: 16. Plik data.json został zapisany.” z listą pól (arkusz, LP, nazwa, kolumna, fragment).

### 23.2. Raport „wskazówek formatowania” dla Excela — niezalecany

Lista komórek, w których formatowanie zaczyna się lub kończy enterem, byłaby głównie szumem (104 kursywy `lub⏎` w „Premiach z Przeszłości Frakcji”), a po poprawce L takie formatowanie nie ma już żadnego skutku. Wyjątek wart ręcznego przejrzenia: Talenty LP 45 (rozdz. 22).

### 23.3. Zabezpieczenie po stronie wyświetlania (GeneratorNPC, DataVault) — niepotrzebne

Wszystkie dane trafiają do GeneratorNPC i DataVault przez generator, więc po poprawce L i ponownym imporcie wyświetlanie dostaje wyłącznie poprawny zapis. Ulubione w GeneratorNPC przechowują nadpisania tylko dla Umiejętności i Słów kluczowych — w tych kolumnach nie ma dziś żadnej pary znaczników przez enter, więc zapisane ulubione nie wymagają poprawek. Wariant B z rozdz. 12 pozostaje możliwy jako niezależne, dodatkowe zabezpieczenie, ale nie jest potrzebny do rozwiązania problemu.

---

## 24. Plan wdrożenia i procedura dla użytkownika

### 24.1. Zmiany w kodzie (do wykonania po akceptacji)

1. `DataVault/build_json.py` — nowa funkcja `_wrap_with_markers` z rozdz. 21.3.
2. `DataVault/xlsxCanonicalParser.js` — nowa funkcja `wrapWithMarkers` z rozdz. 21.4.
3. **Bez** kontroli i ostrzeżeń po wygenerowaniu danych — decyzja użytkownika (rozdz. 23.1). `DataVault/app.js` i funkcja `main` w `build_json.py` pozostają bez zmian.
4. Porównanie wymagane przez AGENTS.md (punkt 14), na aktualnym `Repozytorium.xlsx`:
   - `build_json.py` i przycisk „Generuj pliki danych” muszą dać bajtowo identyczny `data.json`;
   - porównanie pole po polu z danymi z Firebase: oczekiwane dokładnie 63 zmienione pola, identyczny widoczny tekst, identyczne `_meta`, 0 par znaczników przez enter;
   - zestaw R1–R12: 12 / 12.
5. Dokumentacja (AGENTS.md, punkty 1–4 i 15; obie wersje językowe):
   - `DataVault/docs/Documentation.md` — rozdziały „Kanoniczny parser XLSX” / „Canonical XLSX parser” (reguły owijania znacznikami, zgodność JS / Python), „Zgodność trzech ścieżek generowania danych” i „Formatowanie tekstu” / „Text formatting”;
   - `DataVault/docs/ZasadyFormatowania.md` — „Rich text z XLSX” / „XLSX rich text” (entery nigdy nie trafiają między znaczniki), „Zachowanie podziałów linii” / „Line break behavior”, „Typowe błędy w danych źródłowych” / „Common source data errors” (pogrubiony enter nie jest już błędem);
   - `DataVault/docs/README.md` — „Generowanie plików danych — tylko admin” / „Generating data files — admin only” (co sprawdzić po wygenerowaniu danych);
   - `GeneratorNPC/docs/*` i `DetaleLayout.md` — bez zmian (kod GeneratorNPC i wygląd się nie zmieniają).

### 24.2. Kroki użytkownika po wdrożeniu

1. Otworzyć DataVault w trybie admina, kliknąć „Generuj pliki danych” i wskazać aktualny `Repozytorium.xlsx`. Pobiorą się `data.json` i `firebase-import.json`.
2. **Przed odświeżeniem strony** DataVault pokazuje świeżo wygenerowane dane. Szybka kontrola: w Bestiariuszu wpis LP 180 „Kanoptek Skarabeusz” — nagłówek „ANIHILACJA: Protokoły ożywienia” ma być pogrubiony.
3. Dokładniejsza kontrola (opcjonalnie): F12 → „Console”, wkleić poniższe polecenie i nacisnąć Enter. Wynik powinien być **pustą tabelą** (dziś: 16 pozycji).

   ```js
   (() => { const tok = /\{\{(\/?)(RED|B|I|S)\}\}/g; const hits = []; for (const [sheet, rows] of Object.entries(DB.sheets)) rows.forEach((r) => { for (const [kolumna, v] of Object.entries(r)) { if (typeof v !== "string" || !v.includes("\n")) continue; const open = []; let m; tok.lastIndex = 0; while ((m = tok.exec(v))) { if (!m[1]) { open.push({ name: m[2], end: tok.lastIndex }); continue; } let i = open.length - 1; while (i >= 0 && open[i].name !== m[2]) i--; if (i < 0) continue; const o = open.splice(i, 1)[0]; const inner = v.slice(o.end, m.index).replace(/\{\{\/?(?:RED|B|I|S)\}\}/g, ""); const nl = inner.indexOf("\n"); if (nl >= 0 && /\S/.test(inner.slice(nl + 1))) hits.push({ sheet, LP: r.LP, Nazwa: r.Nazwa ?? r.Frakcja, kolumna, styl: m[2], fragment: inner.slice(0, 60) }); } } }); console.table(hits); })();
   ```

4. Zaimportować `firebase-import.json` do Firebase Realtime Database (jak przy każdej aktualizacji).
5. Odświeżyć GeneratorNPC, wybrać Kanopteka z listy i wygenerować kartę — wszystkie nagłówki zdolności powinny być pogrubione. Tak samo pozostałe wpisy z rozdz. 18.1.

Poprawiać komórek w Excelu nie trzeba — po poprawce generatora pogrubienie zaczynające się od entera i od litery daje ten sam wynik. Jedyna komórka warta przejrzenia to Talenty LP 45 (rozdz. 22).

---

## 25. Ryzyka i następne kroki (część II)

| Ryzyko | Ocena | Ograniczenie |
|---|---|---|
| Rozbieżność generatora przeglądarkowego i `build_json.py` | niskie | identyczne reguły w obu językach; bajtowa zgodność na prawdziwym pliku, zestawie R1–R12 i 60 000 losowych napisów; porównanie z punktu 14 AGENTS.md przed wdrożeniem |
| Zmiana wyglądu pól, które dziś wyglądają dobrze | bardzo niskie | na prawdziwym pliku 0 pogorszeń w karcie, obu tabelach i widoku słów kluczowych frakcji; 0 zmian liczby pasków |
| Talenty LP 45 zacznie pokazywać pogrubienie, które w Excelu wygląda na przypadkowe | pewne, ale wierne Excelowi | poprawić komórkę `Talenty!G46` w Excelu |
| Linia przypisu `*[n]` poprzedzona pogrubionym enterem nie zostanie rozpoznana jako przypis | teoretyczne (0 przypadków w pliku) | to samo dzieje się dziś przy pogrubieniu zaczynającym się od `*`; ograniczenie wyświetlania, nie generatora |
| Poprawka nie zadziała bez ponownego wygenerowania i importu danych | pewne | kroki z rozdz. 24.2 |

**Następne kroki:**

1. Projekt L (rozdz. 21) zaakceptowany; kontrola po wygenerowaniu danych odrzucona (rozdz. 23.1).
2. Wdrożenie zmian w kodzie i dokumentacji według rozdz. 24.1 wraz z porównaniem z punktu 14 AGENTS.md.
3. Wygenerowanie i import nowych plików przez użytkownika według rozdz. 24.2.
4. Opcjonalnie: poprawa komórki `Talenty!G46` w Excelu.

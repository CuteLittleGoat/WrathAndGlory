# Audyt kodu aplikacji WrathAndGlory — 2026-09-10

> **UWAGA WSTĘPNA — ten plik trafia do repozytorium publicznego.**
> Repozytorium `CuteLittleGoat/WrathAndGlory` jest **publiczne** (sprawdzone przez API GitHuba: `"visibility": "public"`, `"has_pages": true`).
> Dlatego w rozdziale 9 (bezpieczeństwo bazy danych) **świadomie nie ma** gotowych poleceń, skryptów ani przykładów „jak to wykorzystać".
> Opisuję **co** jest odsłonięte i **jak to naprawić**, bez instrukcji nadużycia.
> Wszystkie fakty i tak wynikają wprost z plików, które w tym repozytorium są już jawne.
> Patrz pytanie 7 w rozdziale 12 — do rozważenia, czy ten dokument ma zostać w repozytorium publicznym.

---

## 1. Metryka

| | |
|---|---|
| **Data analizy** | 10 września 2026 |
| **Temat** | Audyt kodu: błędy, martwy kod, pozostałości po przeróbkach, duplikacja, bezpieczeństwo bazy danych |
| **Zakres** | Wszystkie moduły: `Main`, `DataVault`, `GeneratorNPC`, `Kalkulator`, `DiceRoller`, `GeneratorNazw`, `Infoczytnik`, `Audio`, `shared/` |
| **Poza zakresem** | `Main/Gilead.html` i `Main/Galaktyka.html` — pliki powstały poza tym projektem i decyzją właściciela repozytorium nie podlegają analizie. `WebView_FCM_Cloudflare_Worker/` (folder chroniony przed edycją wg `AGENTS.md` §17), `Kalkulator/Old/`, `WebView_FCM_Cloudflare_Worker/Archiwalne/`. Literówki w danych źródłowych (`DoZrobienia.md` poz. 2) — poprawiane ręcznie w `Repozytorium.xlsx`, patrz rozdz. 8 |
| **Metoda** | Odczyt kodu, analiza statyczna (ESLint 9 z regułami poprawnościowymi na wszystkich plikach `.js` oraz na skryptach osadzonych w HTML), skanowanie nieużywanych klas CSS, porównanie dwóch niezależnych implementacji parsera XLSX, nieinwazyjne sondowanie reguł dostępu do bazy |
| **Dane wejściowe** | `Repozytorium.xlsx`, `data.json`, `firebase-import.json` (przesłane 10 września) — użyte do porównania obu ścieżek generowania danych, rozdz. 7 |
| **Zmiany w kodzie** | **Żadne.** Ten dokument tylko opisuje i proponuje. |
| **Analiza siostrzana** | `Analizy/responsywnosc-aplikacji-2026-09-10.html` (responsywność, wygląd) |

### Główny wniosek

Potwierdzam Twoją obserwację: **aplikacja działa**. Nie znalazłem żadnego błędu, który psułby funkcję widoczną dla użytkownika w normalnym użyciu. Znalazłem natomiast:

- **1 usterkę pewną**, która na każdym uruchomieniu DataVault generuje nieudane pobranie pliku i czerwony błąd w konsoli (rozdz. 3.1),
- **4 usterki utajone** — kod, który dziś działa przez przypadek albo jest maskowany przez inną usterkę (rozdz. 3),
- **ok. 510 linii martwego kodu i martwego CSS**, w tym całą nieużywaną ścieżkę parsowania XLSX (rozdz. 4),
- **wyraźne pozostałości po przeróbkach**, w tym blok bramki dostępu wklejony przez pomyłkę do szablonu karty NPC do druku (rozdz. 5),
- **jeden potwierdzony rozjazd między dwiema implementacjami parsera** — zweryfikowany na Twoich prawdziwych plikach (rozdz. 7),
- **realny problem bezpieczeństwa bazy danych** — częściowo inny, niż zakładałeś (rozdz. 9).

---

## 2. Pełny prompt użytkownika

Zapisany bez skracania, zgodnie z zasadą 10 z `AGENTS.md`. Prompt przyszedł w kilku wiadomościach.

> **Wiadomość 1**
>
> Zapoznaj się z repo.
> Repo zawiera kilka modułów składających się na aplikację pomocniczą do TTRPG.
> Twoim zadaniem będzie przeprowadzenie dwóch analiz i zapisanie ich wyników w folderze Analizy/
> W AGENTS.md jest informacja, że analizy mają być plikami MD. Na potrzeby tego zadania zignoruj tę zasadę. Chcę, żebyś (przynajmniej pierwszą analizę) utworzył jako plik HTML i zawarł w nim screeny z wizualizacją po zmianie.
>
> Pierwsza analiza ma dotyczyć responsywności.
> Aplikacja ma dobrze wyglądać i działać zarówno na telefonie, PC i tablecie.
> Załączam screen rzeczy jaką chciałbym poprawić:
> W module GeneratorNPC w sekcji dotyczącej statystyk przeciwnika jest poziomy pasek przewijania. Można skrócić pole z wyświetlanym tekstem lub jakoś go dopasować do szerokości ekranu. Niech tekst się zawija w komórce. Przewijanie powinno się pojawiać jak ilość tekstu (głównie dotyczy "Zdolności" i "Atak") jest tak obszerna, że bez przewijania całość byłaby nieczytelna.
> Zaproponuj rozwiązanie.
>
> To tylko jeden z przykładów. Przeanalizuj całą aplikację, wszystkie moduły i znajdź różne takie rzeczy, które mogą zaburzać czytelność.
> Ważna uwaga! W module "DataVault" w niektórych zakładkach istnieje kolumna "zasięg". Celowo tam nie ma łamania wiersza.
>
> Miej na uwadze, że aplikacja dalej będzie rozbudowywana. W szczególności moduł DataVault. W tym roku spodziewany jest jeszcze jeden duży dodatek zawierający kilkadziesiąt pozycji dotyczących archetypów, ekwipunku, umiejętności itd.
>
> Druga analiza (tu już może być zwykły plik MD) ma dotyczyć ogólnie kodu aplikacji.
> Sprawdź czy nie ma tam jakiś błędów. Sprawdź czy nie ma martwego kodu. Sprawdź czy po wielu przeróbkach i modyfikacjach nie zostało wiele śmieci. Ogólnie aplikacja działa. Testowałem wszystkie funkcje i działają one tak jak powinny. Tylko ja widzę efekt końcowy - Ty sprawdź po stronie kodu czy nie ma potrzeby, żeby coś naprawić (ale tak, żeby nie zmienić działania widocznego ze strony użytkownika).
>
> Jeżeli potrzebujesz jakiś dodatkowych plików (np. Repozytorium.xlsx albo data.json) to napisz. Wrzucę do czata albo do repo.
>
> Na tym etapie prac, poza utworzeniem plików z analizami, nie zmieniaj nic w kodzie aplikacji.
> Jeżeli będziesz mieć jakieś pytania to formułuj je w taki sposób, żeby zrozumiała je osoba nie mająca żadnej wiedzy informatycznej.

> **Wiadomość 2** (wraz z trzema zrzutami ekranu z modułu GeneratorNPC)
>
> screeny z "GeneratorNPC"

> **Wiadomość 3**
>
> Zadanie wykonuj na poziomie "ultracode". Pliki z analizami wrzuć na gałęzi "main".

> **Wiadomość 4** (wraz z dwoma plikami MD: `Instrukcja_AppCheck_20260907.md` oraz `Bezpieczenstwo_Firestore_20260907.md`)
>
> DODATKOWA INFORMACJA - trzeba będzie to zawrzeć w analizie dotyczącej kodu. Załączam dwa pliki MD dotyczące innej aplikacji w innym repo. Tam, podobnie jak tu, korzystam z Firestore. Obecnie wszystkie "Rules" mam ustawione jako allow write wszędzie. Trzeba będzie to zmienić, żeby modyfikacja Firestore była możliwa tylko poprzez aplikację WrathAndGlory.

> **Wiadomość 5**
>
> Zmiana Firestore też ma być na poziomie "Ultracode".

> **Wiadomość 6**
>
> Na potrzeby analizy zmieniłem hasło do wyświetlania danych. […] Wyciek haseł w tej rozmowie nie jest problemem - hasła zostaną zmienione po zakończeniu prac.

> **Wiadomość 7**
>
> nie zapisuj jednak haseł w plikach z analizą.

> **Wiadomość 8** (wraz z plikami `Repozytorium.xlsx`, `data.json`, `firebase-import.json`, `AudioManifest.xlsx`)
>
> Najpierw załączam pliki z danymi wsadowymi.
> Możesz, jeżeli trzeba, zaktualizować pliki z analizą.
>
> Kanał Infoczytnika (dataslate) jest otwarty dla każdego - to do rozważenia. W trakcie sesji gracze mają otwartą na tablecie stronę do odczytu a ja na PC stronę do wpisywania wiadomości. Czy tutaj potrzeba jakiś dodatkowych zabezpieczeń?
> Kreator postaci - zakładam, że i tak jedna osoba jednocześnie będzie robić postać, więc nadpisywanie to nie problem.
>
> Rozumiem, że App Check rozwiązuje te problemy?
> I tak - w trakcie tworzenia aplikacji przy module do Audio użyłem innego Firebase niż do reszty. Jednak nie mam teraz potrzeby zmiany. Zrobię po prostu 2x wymagane operacje.
>
> Nie czytałem jeszcze pełnej analizy i dopiero napiszę Ci odpowiedzi na pytania. Póki nie będziemy mieli wszystkiego ustalonego i wyjaśnionego nie zmieniamy kodu aplikacji - tylko pliki z analizami.

> **Wiadomość 9**
>
> Pliki:
> Main/Galaktyka.html
> Main/Gilead.html
> są poza zakresem tej analizy. Pliki te powstały w innym miejscu i ich kod nie podlega pod analizę.
>
> Literówki (błąd opisany jako Poprawić brak polskich liter w "Repozytorium" w pliku DoZrobienia.md) też są poza zakresem tej analizy. Problem dotyczy danych w pliku wsadowym a nie działania aplikacji. Poprawka musi być ręczna w pliku Repozytorium.xlsx a następnie aplikacja ma przerobić na plik json, który wgram do Firebase. Mechanizm przerabiania działa poprawnie.

> **Wiadomość 10**
>
> Plik z analizą Analizy/responsywnosc-aplikacji-2026-09-10.html nie musi trzymać kolorystyki reszty aplikacji (zielona).

**Uwaga do wiadomości 6 i 7.** Hasła nie zostały zapisane w żadnym pliku w repozytorium. Próbowałem użyć ich do pobrania prawdziwych danych, żeby oprzeć analizę na realnym zbiorze — środowisko, w którym pracuję, zablokowało logowanie hasłem, więc **nie udało się i nie korzystałem z prawdziwych danych.** Wszystkie wnioski w tym dokumencie opierają się wyłącznie na kodzie w repozytorium. Niezależnie od tego rekomenduję zmianę obu haseł po zakończeniu prac, tak jak zapowiedziałeś.

---

## 3. Błędy

Podzielone na **pewne** (dają obserwowalny skutek już dziś) i **utajone** (dziś nie szkodzą, bo coś je maskuje albo warunek nie zachodzi — ale są miną).

### 3.1. 🔴 PEWNY — DataVault pobiera bibliotekę, której nie ma na świecie

**Plik:** `DataVault/index.html`, linia 138

```html
<!-- XLSX opcjonalnie (legacy path) -->
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.19.3/dist/xlsx.full.min.js"></script>
```

**Co sprawdziłem:**

| Adres | Odpowiedź |
|---|---|
| `jszip@3.10.1` (używany naprawdę) | **200 OK**, 97 630 bajtów |
| `xlsx@0.19.3` ← **z kodu** | **404 Not Found** |
| `xlsx@0.18.5` | 200 OK |
| Rejestr npm dla pakietu `xlsx` | najnowsza opublikowana wersja to **0.18.5** |

Wersja `0.19.3` **nigdy nie została opublikowana w npm** — SheetJS po 0.18.5 przeniósł dystrybucję na własny serwer. Czyli przy każdym otwarciu DataVault przeglądarka wykonuje żądanie zakończone błędem 404 i wypisuje czerwony komunikat w konsoli.

**Dlaczego to nic nie psuje:** nic w kodzie nie używa `XLSX` w czasie normalnej pracy. Odwołania do `XLSX.utils` są tylko w funkcji `extractSheetRowsWithFormatting` (`app.js:1228`), która **nie jest nigdzie wywoływana** (patrz rozdz. 4.1). Generowanie danych z `Repozytorium.xlsx` idzie w całości przez własny parser `xlsxCanonicalParser.js` oparty na JSZip.

**Rekomendacja:** usunąć linię 138 wraz z komentarzem. Zero wpływu na działanie, minus jedno nieudane żądanie sieciowe przy każdym wejściu.

> **Ostrożnie — `AGENTS.md` §15.** Ta zmiana dotyczy modułu DataVault i pliku związanego z parsowaniem XLSX. Formalnie wymaga porównania wyniku generowania danych przed i po. W praktyce ryzyko jest zerowe (usuwamy skrypt, który i tak zwraca 404), ale warto wykonać jedno kontrolne generowanie `data.json` z `Repozytorium.xlsx` i porównać z poprzednim plikiem.

### 3.2. 🟠 UTAJONY — zmienna `m` bez deklaracji w DataVault

**Plik:** `DataVault/app.js`, funkcja `formatInlineHTML`, linie 671–672

```js
const refs = [];
reRefParen.lastIndex = 0;
while ((m = reRefParen.exec(combined))){     // <-- brak "let m"
  refs.push({start: m.index, end: m.index + m[0].length});
}
```

Zmienna `m` nie jest nigdzie zadeklarowana. W trybie swobodnym (a `app.js` jest zwykłym skryptem, bez `"use strict"`) JavaScript po cichu tworzy wtedy zmienną **globalną** — czyli `window.m`. ESLint zgłasza to jako 4 błędy `no-undef`.

**Dlaczego dziś nie szkodzi:** nic innego nie używa nazwy `m` w zasięgu globalnym, więc kolizji nie ma.

**Dlaczego to jest mina:**

1. Wystarczy, że ktoś kiedyś doda `"use strict"` albo przerobi `app.js` na moduł ES (`<script type="module">`) — wtedy przypisanie do niezadeklarowanej zmiennej rzuca `ReferenceError` i **formatowanie wszystkich komórek przestaje działać**.
2. Analogiczna funkcja w `GeneratorNPC/index.html` (linia 978) jest w module ES i tam ta sama pętla ma prawidłowo zadeklarowaną zmienną `match`. Czyli jedna kopia kodu jest poprawna, a druga nie.

**Poprawka (bez zmiany działania):**

```js
const refs = [];
let m;                                        // <-- dodać
reRefParen.lastIndex = 0;
while ((m = reRefParen.exec(combined))){
```

### 3.3. 🟠 UTAJONY — DataVault: dwa nagłówki tabeli mają się nie nakładać, a nakładają

Opisane szczegółowo w analizie responsywności (rozdz. 4.2), tutaj tylko strona kodowa, bo to jest błąd logiczny, a nie kosmetyka.

**Pliki:** `DataVault/style.css` (`--header-row-height: 36px`) oraz `DataVault/app.js` (`buildTableSkeleton`)

Drugi wiersz nagłówka (pola filtrów) przykleja się na wysokości **wpisanej na sztywno na 36 px**, podczas gdy pierwszy wiersz ma `white-space: normal` i przy dłuższych nazwach kolumn rośnie do **59 px**. Różnica 23 px to nakładanie się wierszy.

Dziś tego nie widać, bo maskuje to inna usterka: `.tableViewport` nigdy nie dostaje ograniczonej wysokości, więc nigdy się nie przewija i przyklejanie w ogóle nie działa (zmierzone: `scrollHeight === clientHeight === 1068 px` na każdej szerokości ekranu).

**Wniosek dla kodu:** wartość, która zależy od zawijania tekstu, nie może być wpisana jako stała. Poprawka to zmierzenie wiersza w `buildTableSkeleton()` — ok. 8 linii, treść w analizie responsywności, rozdz. 4.4.

### 3.4. 🟡 UTAJONY — Prosty Kreator Postaci: przełącznik języka kasuje wyliczone PD

**Plik:** `Kalkulator/TworzeniePostaci.html`, funkcja `updateLanguage`, linia 674

```js
document.getElementById('xpRemainingLabel').innerHTML =
  `${t.labels.remainingXP} <strong id="xpRemaining">155</strong>`;
```

Ta linia robi dwie rzeczy naraz: podmienia etykietę **i** wpisuje na sztywno liczbę `155`, kasując wyliczoną wartość pozostałych PD. Dodatkowo **niszczy i tworzy od nowa element** `#xpRemaining`.

**Dlaczego dziś nie szkodzi:** wszystkie trzy wywołania `updateLanguage()` są natychmiast po nich naprawiane:

| Miejsce wywołania | Co następuje zaraz potem |
|---|---|
| `updateLanguage(currentLanguage)` — start, linia 1259 | `recalcXP()` w linii 1260 |
| `applySavedState()` — po wczytaniu z bazy, linia 921 | `recalcXP()` w linii 924 |
| zmiana języka w liście, linia 1189 | `resetAll()` w linii 1190 |

Do tego przełącznik języka jest ukryty (`.language-switcher select { display: none }`), więc trzeciej ścieżki użytkownik i tak nie uruchomi.

**Dlaczego to jest mina:** poprawność zależy od tego, że *ktoś pamiętał* o dopisaniu `recalcXP()` w trzech różnych miejscach. Czwarte wywołanie `updateLanguage` bez tego dopisku da cichy błąd — użytkownik zobaczy „Pozostało PD: 155" niezależnie od tego, co wydał. Poza tym każdy kod, który zapamiętałby sobie referencję do `#xpRemaining`, po zmianie języka trzymałby wskazanie na element usunięty z dokumentu.

**Poprawka (bez zmiany działania):** zmieniać tylko tekst etykiety, nie ruszając elementu z liczbą — np. opakować napis w osobny `<span id="xpRemainingText">` i podmieniać wyłącznie jego treść.

**Przy okazji — niezgodność napisów.** W HTML (linia 293) jest `Pozostało:`, a w tłumaczeniach `remainingXP: 'Pozostało PD:'`. Ponieważ `updateLanguage()` uruchamia się przy starcie, użytkownik zawsze widzi wersję z tłumaczeń. Napis w HTML jest martwy i wprowadza w błąd przy czytaniu kodu.

### 3.5. 🟡 UTAJONY — DataVault: okno porównania nie dostaje swoich stylów

**Plik:** `DataVault/app.js`, funkcja `openCompareModal`, linie 2108–2131 oraz `DataVault/style.css`

CSS definiuje komplet stylów dla tabeli porównania:

```css
.compareTable{width:100%; border-collapse:collapse}
.compareTable th,.compareTable td{border-bottom:1px solid var(--div); padding:8px; vertical-align:top}
.compareTable th{color:var(--code); background:rgba(22,198,12,.04)}
.compareTable tbody tr:nth-child(odd){background:var(--zebra-odd)}
.compareTable tbody tr:nth-child(even){background:var(--zebra-even)}
.compareTable tbody tr:hover{background:var(--hover)}
.compareDiff{color:#E6B35C}
```

Ale kod generuje tabelę **bez klasy `compareTable`**, a wiersze z różnicami oznacza klasą `diff`, której w CSS nie ma:

```js
htmlRows.push(`<tr class="${diff ? "diff" : ""}"> ... `);
const html = `<div style="overflow:auto; max-height:70vh"><table> ... </table></div>`;
```

**Skutek:** tabela porównania rysuje się w stylu domyślnym przeglądarki (bez ramek, bez naprzemiennych tł), a **pola, które się różnią, nie są w żaden sposób wyróżnione** — mimo że to jest cały sens funkcji „Porównaj zaznaczone".

**To jest jedyne miejsce w audycie, gdzie poprawka ZMIENI wygląd widoczny dla użytkownika.** Zaznaczam to wyraźnie, bo prosiłeś, żeby nie zmieniać działania widocznego z zewnątrz. Masz trzy możliwości:

- **(a)** Dopisać klasy do generowanego HTML (`class="compareTable"`, `class="compareDiff"`) — okno porównania zacznie wyglądać jak reszta aplikacji, a różnice się podświetlą. **To był najwyraźniej pierwotny zamiar.**
- **(b)** Usunąć siedem nieużywanych reguł z CSS — wygląd bez zmian, mniej martwego kodu.
- **(c)** Zostawić bez zmian.

*Rekomendacja: (a).* To wygląda na niedokończoną przeróbkę, a nie na świadomą decyzję.

### 3.6. 🟡 UTAJONY — DataVault: obserwatory rozmiaru tworzone bez ograniczenia

**Plik:** `DataVault/app.js`, funkcja `renderRow`, linie 1873–1990

Dla każdej komórki, która okaże się dłuższa niż 9 linii, kod tworzy **osobny** `ResizeObserver`:

```js
if (!resizeHandle){
  resizeHandle = new ResizeObserver(()=>requestAnimationFrame(evaluateClamp));
  resizeHandle.observe(div);
}
```

`renderBody()` jest wywoływane przy **każdym naciśnięciu klawisza** w polu wyszukiwania globalnego i w każdym filtrze kolumny. Każde wywołanie czyści `tbodyEl.innerHTML` i buduje wiersze od nowa — więc każde naciśnięcie klawisza tworzy nowy komplet obserwatorów, a stare zostają podpięte do elementów już usuniętych z dokumentu.

**Dlaczego dziś nie szkodzi:** obserwator i jego funkcja zwrotna tworzą zamknięty cykl odwołań, a nowoczesne odśmiecanie pamięci radzi sobie z cyklami — więc pamięć finalnie wraca. Przy tej skali danych efekt jest niezauważalny.

**Dlaczego warto poprawić:** GeneratorNPC rozwiązuje ten sam problem lepiej — ma **jeden wspólny** `ResizeObserver` i `WeakMap` z funkcjami sprawdzającymi (`index.html`, linie 885–892). To ten sam autor, ten sam mechanizm, dwa różne rozwiązania — warto ujednolicić na to lepsze, zwłaszcza że DataVault ma urosnąć.

**Drobiazg przy okazji:** `renderBody()` używa `renderToken`, żeby przerwać rysowanie porcji wierszy, gdy w międzyczasie przyszło nowe zapytanie. Ale funkcje uruchamiane przez `requestAnimationFrame` wewnątrz `renderRow` **nie sprawdzają tego znacznika** i wykonują się także dla wierszy z przerwanego rysowania.

### 3.7. 🟡 UTAJONY — `build_json.py`: sprawdzanie prawdziwościowe elementu XML

**Plik:** `DataVault/build_json.py`, linia 224

```python
is_node = cell.find("main:is", ns) or cell
```

W bibliotece `ElementTree` element **bez elementów potomnych jest fałszywy** w kontekście logicznym. Od Pythona 3.12 takie użycie zgłasza `DeprecationWarning`, a docelowo zachowanie ma się zmienić na „element zawsze prawdziwy".

**Dlaczego dziś nie szkodzi:** węzeł `<is>` w praktyce zawsze zawiera `<t>` albo `<r>`, więc jest prawdziwy; a gdyby był pusty, ścieżka zapasowa i tak zwraca ten sam wynik (pusty tekst).

**Poprawka:**

```python
node = cell.find("main:is", ns)
is_node = node if node is not None else cell
```

---

## 4. Martwy kod

Kod, który nie jest wywoływany z żadnego miejsca, oraz style, które nie mają czego dotyczyć. Wszystko poniżej sprawdzone dwoma niezależnymi metodami: analizą statyczną (ESLint, reguła `no-unused-vars`) i wyszukiwaniem tekstowym po całym repozytorium.

### 4.1. DataVault — cała nieużywana ścieżka odczytu XLSX przez SheetJS

**Plik:** `DataVault/app.js`, linie 1041–1052 oraz 1126–1275 (~160 linii)

| Funkcja | Linia | Kto ją wywołuje |
|---|---|---|
| `ensureSheetJS` | 1041 | **nikt** |
| `extractSheetRowsWithFormatting` | 1228 | **nikt** |
| `getCellTextWithMarkers` | 1208 | tylko `extractSheetRowsWithFormatting` |
| `isCellStyledRed` | 1185 | tylko `getCellTextWithMarkers` |
| `hasInlineFormattingRuns` | 1201 | tylko `getCellTextWithMarkers` |
| `htmlToStyleMarkers` | 1137 | tylko `getCellTextWithMarkers` |
| `isRedColorValue` | 1126 | tylko `htmlToStyleMarkers` i `isCellStyledRed` |

To jest kompletna, spójna, **odcięta od reszty programu** implementacja czytania arkusza przez bibliotekę SheetJS. Zastąpił ją własny parser `xlsxCanonicalParser.js` (JSZip + bezpośredni odczyt XML), do którego prowadzi jedyne wejście: `loadXlsxFromRepo()` → `ensureJSZip()` → `window.XlsxCanonicalParser.loadXlsxMinimal()`.

Razem z martwym znacznikiem `<script>` z rozdz. 3.1 to **~170 linii kodu plus jedna nieistniejąca zależność zewnętrzna**.

> **Ostrożnie — `AGENTS.md` §15** wymienia parsery XLSX jako obszar szczególnie wrażliwy i zabrania upraszczania ich „bez sprawdzenia, czy wynik generowania danych pozostaje identyczny". Dlatego **nie rekomenduję usunięcia tego bloku bez wykonania procedury z rozdz. 7.7**: wygenerować `data.json` z `Repozytorium.xlsx` przed zmianą, wykonać zmianę, wygenerować ponownie i porównać oba pliki bajt po bajcie. Jeśli są identyczne — usunięcie jest bezpieczne.

### 4.2. DataVault — pojedyncze nieużywane elementy

| Co | Plik / linia | Uwaga |
|---|---|---|
| `deriveColumnOrderFromHeader()` | `app.js:317` | ~24 linie. Zastąpiona przez `deriveColumnOrder()` w `xlsxCanonicalParser.js`, gdzie logika jest identyczna |
| `headerBuiltFor` | `app.js:1447` | zmienna, do której nikt nic nie zapisuje i nikt jej nie czyta |
| parametr `title` w `openModal()` | `app.js:2091` | funkcja zaczyna się od `void title;` — czyli od jawnego zignorowania własnego argumentu. Wywołanie w linii 2129 przekazuje starannie przygotowany tytuł, który jest wyrzucany |
| zmienna `key` w `renderRow()` | `app.js:1908` | przesłonięta przez identyczną deklarację 8 linii niżej, wewnątrz `requestAnimationFrame` (ESLint: `no-shadow`) |
| `.filebtn input{display:none}` | `style.css` | klasa `filebtn` nie występuje w żadnym pliku |
| `.compareTable`, `.compareDiff` | `style.css` | 7 reguł — patrz rozdz. 3.5 |
| parametry `maxLines` i `appendHint` | `app.js:721, 783, 845` | trzy funkcje formatujące przyjmują te opcje, budują na ich podstawie klucz pamięci podręcznej — a **nigdy nie są przekazywane**. Pozostałość po poprzednim sposobie zwijania komórek, zanim zastąpiło go zwijanie przez CSS |

### 4.3. GeneratorNPC — nieużywane wyszukiwanie „na wyczucie"

**Plik:** `GeneratorNPC/index.html`, linie 1231–1326 (~96 linii)

Trzy funkcje tworzące razem heurystykę szukania arkusza w dowolnie zagnieżdżonej strukturze danych:

- `getSectionName` (1231) — próbuje odgadnąć nazwę sekcji z dziesięciu różnych możliwych pól (`name`, `nazwa`, `Nazwa`, `title`, `Tytul`, `Tytuł`, `sheet`, `sheetName`, `Arkusz`, `arkusz`),
- `looksLikeRecordArray` (1249) — zgaduje, czy tablica wygląda na listę rekordów,
- `findCollectionInNode` (1259) — przeszukuje strukturę rekurencyjnie, z zabezpieczeniem przed zapętleniem.

**`findCollectionInNode` wywołuje sama siebie w trzech miejscach i nie jest wywoływana znikąd indziej.** Cały blok jest odcięty.

Zastąpiła go funkcja `getRequiredCollection` (1337), a **komentarz tuż nad nią wprost to potwierdza**:

```js
// --- Generator używa wyłącznie dokładnych nazw wymaganych arkuszy DataVault ---
```

Czyli: moduł świadomie przeszedł ze zgadywania na dokładne nazwy arkuszy, ale stary mechanizm został.

### 4.4. GeneratorNPC — 51 z 81 reguł szerokości kolumn nie ma czego dotyczyć

**Plik:** `GeneratorNPC/style.css`, linie 551–792

Reguły mają postać `.data-table[data-sheet="X"] .min-col-y { min-width: Nch }`. Klasę `min-col-*` nadaje funkcja `getColumnClass(label)` (linia 971), wywoływana **wyłącznie** z `renderOrderedTable` (linia 1853). Wystarczy więc zestawić listę reguł z listami kolumn, które ten moduł faktycznie rysuje:

| | Liczba |
|---|---|
| Reguł `.data-table[data-sheet] .min-col-*` w pliku | **81** |
| Reguł osiągalnych (arkusz naprawdę rysowany z tą kolumną) | 30 |
| **Reguł martwych** | **51** |

Rozkład martwych reguł według arkusza:

| Arkusz | Martwych reguł | Dlaczego |
|---|---|---|
| `Archetypy` | 5 | GeneratorNPC w ogóle nie rysuje tego arkusza |
| `Cechy` | 3 | j.w. |
| `Stany` | 3 | j.w. |
| `Slowa_Kluczowe` | 3 | j.w. |
| `Bestiariusz` | 6 | rysowany, ale `renderBestiaryTable` (linia 1865) woła `createClampCell` **bez** nazwy klasy kolumny — komórki nigdy nie dostają klas `min-col-*` |
| `Augumentacje`, `Ekwipunek` | po 6 | rysowane, ale tylko dwie kolumny: `Nazwa` i `Efekt` |
| `Bronie` | 6 | kolumny `Typ`, `Rodzaj`, `Dostępność`, `Koszt`, `Koszt IM` nie są w liście `weaponColumns` |
| `Pancerze` | 5 | analogicznie |
| `Psionika`, `Talenty` | po 3 | analogicznie |
| `Modlitwy` | 2 | analogicznie |

To pozostałość po skopiowaniu arkusza stylów z DataVault. **Ma to znaczenie praktyczne**: reguły `min-col-zdolnosci: 60ch`, `min-col-atak: 50ch` i `min-col-premie: 60ch` wyglądają na przyczynę zgłoszonego przez Ciebie paska przewijania, a nią nie są — patrz analiza responsywności, rozdz. 3.4.

### 4.5. GeneratorNPC — cztery nieużywane klasy CSS

`.card-features`, `.feature-list`, `.notice`, `.data-source-link` (`style.css`, linie 218–221 i 434–467, ~30 linii). Żadna nie występuje w HTML ani w JS.

`.data-source-link` jest szczególnie szkoda — zawiera `overflow-wrap: anywhere`, czyli dokładnie tę regułę, której brakuje w Infoczytniku (patrz analiza responsywności, rozdz. 6.1).

### 4.6. Pozostałe drobne martwe style

| Plik | Klasa | Uwaga |
|---|---|---|
| `Kalkulator/index.html` | `.note` | 6 linii, skopiowane z `Main/index.html`, gdzie klasa jest używana; tutaj nie ma takiego elementu |
| `Kalkulator/TworzeniePostaci.html` | `.subtitle` | 1 linia |
| `GeneratorNazw/style.css` | `.topbar`, `.topbar h1`, `.subtitle` | 12 linii; w HTML tego modułu nie ma paska tytułowego |

### 4.7. Podsumowanie martwego kodu

| Obszar | Szacunkowo linii |
|---|---|
| DataVault — ścieżka SheetJS (rozdz. 4.1) | ~170 |
| DataVault — drobne (rozdz. 4.2) | ~45 |
| GeneratorNPC — wyszukiwanie „na wyczucie" (rozdz. 4.3) | ~96 |
| GeneratorNPC — martwe `min-col-*` (rozdz. 4.4) | ~150 |
| GeneratorNPC — martwe klasy (rozdz. 4.5) | ~30 |
| Pozostałe (rozdz. 4.6) | ~19 |
| **Razem** | **~510 linii** |

---

## 5. Pozostałości po przeróbkach („śmieci")

To odpowiedź wprost na Twoje pytanie, czy „po wielu przeróbkach i modyfikacjach nie zostało wiele śmieci". Zostało — i część z nich pokazuje, gdzie dokładnie przeróbka się urwała.

### 5.1. 🔴 Bramka dostępu wklejona do szablonu karty NPC do druku

**Plik:** `GeneratorNPC/index.html`, linia **2880**

Funkcja `buildPrintableCardHTML` buduje kompletny dokument HTML karty przeciwnika, otwierany potem w nowym oknie do wydruku (`openPrintableCard`, linia 2941). Zaraz po znaczniku `<body>` tego szablonu znajduje się **dokładna kopia bloku bramki dostępu** — tego samego, który jest w linii 14 pliku:

```html
<body>
  <div id="accessGate" class="accessGate" hidden>
    <div class="accessGate__card">
      <img class="accessGate__icon" src="../IkonaPowiadomien2.png" ...>
      <h2 data-i18n="accessTitle">Dostęp do danych z klauzulą tajności K.O.Z.A.</h2>
      ...
      <form id="accessForm">
        <input id="accessPassword" type="password" autocomplete="current-password">
        <button class="btn primary accessGate__submit" type="submit">Rozpocznij Rytuał</button>
      </form>
    </div>
  </div>
  <div class="card">        <!-- tu zaczyna się prawdziwa karta NPC -->
```

**Jak to powstało:** wygląda na globalną zamianę „wstaw bramkę po każdym `<body>`" wykonaną przy dodawaniu ekranu dostępu. Zamiana trafiła też w `<body>` schowany wewnątrz tekstowego szablonu w JavaScripcie.

**Dlaczego dziś nic nie psuje:** blok ma atrybut `hidden`, a okno wydruku nie ładuje `access-gate.css` ani żadnego skryptu, więc nic się nie wyświetla i nic się nie uruchamia.

**Dlaczego to jest problem:**

1. Do każdej wygenerowanej karty NPC trafia **formularz z polem hasła** — z atrybutem `autocomplete="current-password"`. Menedżery haseł i przeglądarki reagują na takie pola.
2. Odwołanie `src="../IkonaPowiadomien2.png"` jest względne, a okno powstaje przez `document.write` do `about:blank` — więc adres i tak się nie rozwiąże.
3. W pliku źródłowym powstają zduplikowane identyfikatory `accessGate`, `accessForm`, `accessPassword`, `accessError` (potwierdzone wyszukiwaniem duplikatów `id` we wszystkich plikach HTML — to jedyne takie miejsce w repozytorium).

**Rekomendacja:** usunąć linię 2880. Zero wpływu na to, co widzi użytkownik.

### 5.2. Komentarze opisujące kod, którego nie ma

**Plik:** `DataVault/app.js`, linie 1449–1451 i 1827–1832

```js
/* Legacy renderer (z przewijaniem i klamrowaniem) — zostawiony do wglądu
function buildTableSkeleton(){...}
*/
```

```js
/* Legacy renderer (z klamrowaniem i rozwijaniem) — pozostawiony w komentarzu
function renderBody(){...}
function renderRow(){...}
function measureRenderedLines(){...}
function updateClampableHints(){...}
*/
```

Oba komentarze mówią, że „stara wersja została zostawiona do wglądu" — ale **treści nie ma**, są tylko nazwy funkcji. Co gorsza, `buildTableSkeleton`, `renderBody` i `renderRow` to nazwy funkcji **aktualnie działających**, zdefiniowanych bezpośrednio pod tymi komentarzami. Czytający kod może uznać, że patrzy na wersję archiwalną.

`AGENTS.md` §7 mówi wprost: *„Nie wolno zostawiać komentarzy opisujących stare lub nieistniejące zachowanie."* Rekomendacja: usunąć oba bloki.

### 5.3. Funkcja `norm()` w DataVault robi jedną rzecz, która nic nie robi

**Plik:** `DataVault/app.js`, linia 298

```js
function norm(s){
  return String(s ?? "").replace(/\s+/g, " ").trim().replace(" :", ":").replace(": ",": ");
}
```

Ostatnie wywołanie zamienia `": "` na `": "` — czyli na dokładnie ten sam ciąg. To operacja pusta.

Przedostatnie (`" :"` → `":"`) działa, ale z argumentem tekstowym zamienia **tylko pierwsze wystąpienie** w całym ciągu, co przy tekście wielolinijkowym prawie na pewno nie jest tym, o co chodziło. Jeśli intencją było normalizowanie odstępów przed dwukropkiem, powinno to być wyrażenie regularne z flagą globalną.

Ma to znaczenie także dla rozdziału 7 — bo `norm()` po stronie przeglądarki i `norm()` w `build_json.py` **nie robią tego samego**.

### 5.4. Infoczytnik — plik produkcyjny rozjechał się z testowym

Zgodnie z `Infoczytnik/AGENTS.md` zmiany robi się w plikach `*_test.html`, a produkcyjne aktualizujesz ręcznie. Stan na dziś:

| Para plików | Czy identyczne | Różnica |
|---|---|---|
| `GM.html` = `GM_backup.html` = `GM_test.html` | **tak**, co do bajtu | — |
| `Infoczytnik_backup.html` = `Infoczytnik_test.html` | **tak** | — |
| `Infoczytnik.html` vs `Infoczytnik_test.html` | **nie** | jedna linia + zakończenia wierszy |

Jedyna różnica merytoryczna to linia 145:

```js
// Infoczytnik.html (produkcja):
el.bg.src = d.backgroundFile || 'assets/backgrounds/WnG.png';
// Infoczytnik_test.html (test):
el.bg.src = d.backgroundFile || 'assets/backgrounds/DataSlate_04.png';
```

Różne domyślne tło, gdy panel GM nie poda pliku. Może to być świadoma decyzja — ale ponieważ pliki mają być kopią, warto potwierdzić.

**Do tego:** `Infoczytnik.html` jest **jedynym plikiem w całym repozytorium** z zakończeniami wierszy w stylu Windows (CRLF). Wszystkie pozostałe 40 plików źródłowych używa LF. Skutek: każda przyszła zmiana w tym pliku pokaże się w historii jako „zmieniono wszystkie 237 linii", nawet jeśli zmieniono jedno słowo. Rekomendacja: znormalizować do LF (i ewentualnie dodać `.gitattributes` z `* text=auto eol=lf`).

### 5.5. Napisy niezgodne między HTML a tłumaczeniami

**Plik:** `DataVault/index.html` linia 102 vs `DataVault/app.js` linia 62

```html
<!-- HTML: -->
Brak danych do wyświetlenia. Zaloguj się, aby pobrać dane z prywatnej bazy,
albo w trybie admina wygeneruj pliki danych i zaimportuj firebase-import.json do Firebase.
```
```js
// translations.pl.labels.emptyText:
"Brak danych do wyświetlenia. W trybie admina użyj <b>Generuj pliki danych</b>."
// translations.en.labels.emptyText:
"No data to display. Sign in to load data from the private database, or in admin
 mode generate data files and import firebase-import.json into Firebase."
```

Wersja angielska odpowiada treści w HTML, a **polska jest krótsza i pomija informację o logowaniu** — czyli akurat tę, która jest najbardziej potrzebna zwykłemu graczowi widzącemu pusty ekran. Ponieważ `applyLanguage("pl")` uruchamia się przy starcie, użytkownik zawsze widzi wersję krótszą.

Rekomendacja: ujednolicić polską wersję z angielską i z HTML. To zmiana widocznego napisu, więc wymaga Twojej decyzji (pytanie 3 w rozdz. 12).

### 5.6. Nieużywane zmienne po uproszczeniach

Wykryte przez analizę statyczną; każda to ślad po fragmencie, który został skrócony, ale nie posprzątany.

| Plik | Zmienna | Linia |
|---|---|---|
| `GeneratorNazw/script.js` | `e` (w `catch`) | 1296 |
| `Audio/index.html` | `error` w 11 blokach `catch` | różne |
| `GeneratorNPC/index.html` | `error` w 3 blokach `catch` | 1834, 1864, 2651 |

Nieużywane zmienne w `catch` to zwykle świadome „nie interesuje mnie treść błędu". Warto jednak wiedzieć, że w nowoczesnym JavaScripcie można to zapisać wprost: `catch { ... }` bez nawiasów.

### 5.7. Drobne, ale warte odnotowania

| Co | Gdzie | Uwaga |
|---|---|---|
| `DataVault/app.js` używa `String.replace` z argumentem tekstowym tam, gdzie chodzi o wszystkie wystąpienia | `norm()` | patrz 5.3 |
| Zbędny znak ucieczki w wyrażeniu regularnym | `app.js:1089` — `/[.$#[\]\/]/` | `\/` wewnątrz klasy znaków nie wymaga ucieczki (ESLint: `no-useless-escape`) |
| Zbędny znak ucieczki | `Infoczytnik/GM_test.html:218` | `\-` wewnątrz klasy znaków w `/[\s_\-]+/` |
| `DataVault/app.js` dokleja właściwość do tablicy | `buildTableSkeleton`: `DB.sheets[currentSheet]._cols = cols` | działa, ale tablica przestaje być „tylko listą wierszy"; czystsze byłoby trzymanie tego w osobnej mapie |
| Podwójne wywołanie przeliczania | `TworzeniePostaci.html:1198–1200` | każde pole ma podpięte i `input`, i `change` do tej samej funkcji — przy zmianie wartości przelicza się dwa razy |

---

## 6. Duplikacja między modułami

To nie jest błąd, ale jest źródłem przyszłych błędów — bo poprawka trafia do jednej kopii, a druga zostaje.

### 6.1. ~200 linii formatowania tekstu w dwóch kopiach

Te same funkcje istnieją osobno w `DataVault/app.js` i w `GeneratorNPC/index.html`:

| Funkcja | DataVault | GeneratorNPC | Czy identyczne |
|---|---|---|---|
| `escapeHtml` | `app.js:387` | `index.html:963` | inna implementacja, ten sam wynik |
| `parseInlineSegments` | `app.js:737` | wtopione w `formatInlineHTML` | logika ta sama |
| `formatInlineHTML` | `app.js:654` | `index.html:978` | **różnią się** — patrz niżej |
| `formatTextHTML` | `app.js:721` | `index.html:1074` | **różnią się** — patrz niżej |
| `formatRangeHTML` | `app.js:833` | `index.html:1092` | identyczne |
| `formatKeywordHTML` | `app.js:845` | `index.html:1106` | inny podpis, ta sama logika |

**Rozjazd 1 — rozpoznawanie odnośników do stron:**

```js
// DataVault (app.js:657) — rozpoznaje też warianty angielskie:
/\(([^)]*(?:\bstr\.?\b|\bstr\b|\bstrona\b|\bpage\b|\bp\.)[^)]*)\)/ig

// GeneratorNPC (index.html:980) — tylko polskie:
/\(([^)]*(?:\bstr\.?\b|\bstr\b|\bstrona\b)[^)]*)\)/gi
```

Skutek: po przełączeniu na angielski odnośnik `(page 42)` zostanie podświetlony w DataVault, a w GeneratorNPC nie. Dziś przełącznik języka jest ukryty w obu modułach (`.language-switcher--hidden`), więc nie widać tego — ale jeśli kiedyś go odsłonisz, różnica wyjdzie.

**Rozjazd 2 — lista arkuszy z neutralnymi przecinkami w słowach kluczowych:**

```js
// DataVault — 11 arkuszy:
["Bestiariusz","Archetypy","Psionika","Augumentacje","Ekwipunek","Pancerze","Bronie",
 "Pakiety Wyniesienia","Pojazdy","Bronie Pojazdów","Ekwipunek Pojazdów"]
// GeneratorNPC — 6 arkuszy:
["Bestiariusz","Psionika","Augumentacje","Ekwipunek","Pancerze","Bronie"]
```

Dziś bez skutku, bo GeneratorNPC nie rysuje pozostałych pięciu arkuszy. Ale to jest właśnie ten rodzaj rozjazdu, który uderza po dodaniu nowej zakładki.

**Rozjazd 3 — zachowanie parametru `appendHint`:** DataVault dokleja podpowiedź zawsze, gdy została podana, i opakowuje ją w `<span class="clampHint">`; GeneratorNPC dokleja ją tylko, gdy tekst faktycznie został przycięty, i nie opakowuje. Dziś bez znaczenia, bo parametr nie jest przekazywany w żadnym z modułów (rozdz. 4.2).

**Rekomendacja:** wydzielić te funkcje do `shared/text-format.js` — dokładnie tak, jak już zrobiono z `shared/firebase-data-loader.js` i `shared/access-gate.css`. Wzorzec współdzielenia jest w repozytorium ustalony, wystarczy go zastosować. **To jest jednak zmiana wpływająca na wygląd tekstu w obu modułach**, więc wymaga porównania wyniku przed i po (patrz rozdz. 11).

### 6.2. Konfiguracja Firebase powielona w czterech plikach

| Plik | Projekt |
|---|---|
| `shared/firebase-config.js` | `wh40k-data-slate` |
| `Kalkulator/config/firebase-config.js` | `wh40k-data-slate` — **identyczna zawartość** |
| `Infoczytnik/config/firebase-config.js` | `wh40k-data-slate` — **identyczna zawartość** |
| `GeneratorNPC/config/firebase-config.js` | `audiorpg-2eb6f` |
| `Audio/config/firebase-config.js` | `audiorpg-2eb6f` — **identyczna zawartość** |

Trzy pliki mają bajt w bajt tę samą treść dla projektu `wh40k-data-slate`, dwa kolejne dla `audiorpg-2eb6f`. Zmiana projektu Firebase wymaga dziś edycji pięciu plików i pamiętania, który należy do której pary. To realne ryzyko przy przenoszeniu aplikacji na inny serwer — a komentarze w tych plikach wprost mówią, że każda grupa ma podstawić swoje klucze.

Warto też odnotować niespójność: `DataVault/config/FirebaseREADME.md` opisuje, że DataVault **nie** ma własnego pliku konfiguracji i korzysta ze wspólnego — i to jest prawda. Ale trzy inne moduły mają swoje kopie mimo istnienia `shared/`.

---

## 7. Porównanie dwóch implementacji parsera XLSX

`AGENTS.md` §15 wymaga zgodności między generowaniem przez `build_json.py`, generowaniem przez aplikację w przeglądarce i strukturą importowaną do Firebase. Najpierw porównałem obie implementacje linia po linii w kodzie i sformułowałem trzy przewidywania. Po otrzymaniu Twoich plików **sprawdziłem je praktycznie**: uruchomiłem `build_json.py` na Twoim `Repozytorium.xlsx` i porównałem wynik z Twoim `data.json` (wygenerowanym przez aplikację w przeglądarce).

### 7.1. Wynik w skrócie

| Co porównywałem | Wynik |
|---|---|
| Liczba arkuszy | **38 = 38** ✅ |
| Wartości komórek — wszystkie arkusze, wszystkie kolumny, 1530 wierszy | **0 różnic** ✅ |
| `_meta.sheetOrder` (kolejność zakładek) | **identyczna** ✅ |
| `_meta.columnOrder` (kolejność kolumn) — wszystkie 38 arkuszy | **identyczna** ✅ |
| `_meta.states`, `vehicleTraits`, `vehicleWeaponTraits`, `vehicleStates` | **identyczne** ✅ |
| **Kolejność pól w rekordach — arkusze `Bronie` i `Bronie Pojazdów`** | **RÓŻNA** ❌ |

**Wniosek najważniejszy: obie ścieżki produkują dokładnie te same dane.** Ani jedna wartość w 1530 wierszach się nie różni. To jest mocne potwierdzenie, że mechanizm przerabiania XLSX → JSON działa poprawnie — i to niezależnie od tego, którą drogą się go uruchomi.

Została jedna, czysto strukturalna różnica, opisana niżej.

### 7.2. Potwierdzona różnica — odwrotna kolejność scalania kolumn

Przewidziałem to z kodu i sprawdziło się co do joty.

```python
# build_json.py:335 — najpierw zasięg, potem cechy
recs = [merge_traits(merge_range(r)) for r in recs]
```
```js
// DataVault/app.js:1029 (buildDataJsonFromSheets) — najpierw cechy, potem zasięg
processed = processed.map(r => mergeRange(mergeTraits(r)));
```

Obie operacje usuwają swoje kolumny źródłowe (`Zasięg 1..3`, `Cecha 1..N`) i dopisują scaloną na końcu rekordu. Kolejność wywołań decyduje więc o kolejności pól w zapisanym rekordzie. Zmierzone na Twoich danych:

| Arkusz | Ostatnie pola z `build_json.py` | Ostatnie pola z przeglądarki | Zgodne |
|---|---|---|---|
| `Bronie` | `…, Strona, Zasięg, Cechy` | `…, Strona, Cechy, Zasięg` | **nie** |
| `Bronie Pojazdów` | `…, Strona, Zasięg, Cechy` | `…, Strona, Cechy, Zasięg` | **nie** |
| `Pancerze` | — | — | tak |
| `Pojazdy` | — | — | tak |

`Pancerze` i `Pojazdy` są zgodne, bo tam scalane są tylko cechy — nie ma dwóch operacji, więc nie ma czego zamienić kolejnością. Dokładnie tak wynikało z kodu.

**Wpływ na aplikację: żaden.** Kolejność wyświetlania kolumn bierze się z `_meta.columnOrder`, a ta jest w obu ścieżkach identyczna (sprawdzone dla wszystkich 38 arkuszy).

**Wpływ na możliwość sprawdzania: duży.** Dwa pliki `data.json` wygenerowane różnymi drogami nigdy nie będą identyczne, więc **nie da się użyć zwykłego porównania plików jako testu zgodności** — a właśnie takiego testu wymaga `AGENTS.md` §15. To jedyna rzecz, która dziś stoi na przeszkodzie, żeby taki test wprowadzić.

**Rekomendacja:** ujednolicić kolejność — proponuję dopasować JavaScript do Pythona, bo `build_json.py` jest w komentarzu opisany jako ścieżka referencyjna. To zmiana jednego wyrażenia w jednym miejscu:

```js
// było:  processed = processed.map(r => mergeRange(mergeTraits(r)));
// ma być: processed = processed.map(r => mergeTraits(mergeRange(r)));
```

Ta sama zamiana dotyczy `transformSheet` (`app.js:923`), żeby obie funkcje w tym samym pliku robiły to samo.

### 7.3. Różnica teoretyczna, dziś nieaktywna — trzy różne funkcje `norm()`

| Gdzie | Co robi |
|---|---|
| `build_json.py:28` | zamiana polskich cudzysłowów → scalenie białych znaków → przycięcie |
| `xlsxCanonicalParser.js:16` | zamiana polskich cudzysłowów → przycięcie → scalenie białych znaków |
| `DataVault/app.js:298` | scalenie → przycięcie → `" :"`→`":"` → `": "`→`": "` (operacja pusta) — **bez zamiany cudzysłowów** |

Dwie pierwsze dają ten sam wynik. Trzecia jest inna i **to ona buduje słowniki `_meta.traits` i `_meta.states`**.

**Sprawdzone praktycznie: dziś nie powoduje żadnej różnicy.** W Twoich danych żadna nazwa cechy ani stanu nie zawiera ciągu `" :"`, a polskie cudzysłowy w tych nazwach nie występują. Słowniki `states`, `vehicleTraits`, `vehicleWeaponTraits` i `vehicleStates` wyszły identycznie w obu ścieżkach.

Zostaje to jednak jako mina na przyszłość: wystarczy jedna nazwa cechy ze spacją przed dwukropkiem, żeby przeglądarka zapisała ją inaczej niż Python — a to bezpośrednio wpływa na to, czy kliknięcie tagu cechy odnajdzie jej opis. **Rekomendacja:** jedna funkcja `norm()` w jednym miejscu, używana przez wszystkie trzy ścieżki (dla Pythona — świadomie utrzymywany odpowiednik z komentarzem, że musi być zgodny).

### 7.4. Różnica w przypadku brzegowym — arkusz bez powiązania z plikiem

```python
# build_json.py:265 — arkusz jest pomijany całkowicie
if not target:
  continue
```
```js
// xlsxCanonicalParser.js:209 — arkusz trafia do wyniku jako pusty
if (!target) { sheets[name] = []; continue; }
```

Dla uszkodzonego lub nietypowego skoroszytu Python pominie arkusz w `sheets` (ale zostawi jego nazwę w `sheetOrder`), a przeglądarka doda pustą listę. W Twoim pliku ten przypadek nie występuje — wszystkie 38 arkuszy mają poprawne powiązania. Różnica pozostaje realna, ale bez praktycznego znaczenia przy zdrowym pliku.

### 7.5. Wynik uboczny — przesłane pliki są z różnych momentów

Przy porównaniu wyszła jedna różnica, która **nie jest błędem parsera**, tylko informacją o samych plikach:

| Plik | Cech w arkuszu `Cechy` |
|---|---|
| `data.json` (wygenerowany przez aplikację, znacznik `2026-09-01`) | 34 |
| wynik z przesłanego `Repozytorium.xlsx` | 33 |

Brakująca pozycja to cecha **„Mrożąca"** (LP 34, „Niektóre rodzaje broni Kosmicznych Wilków wykorzystują niszczycielskie pole energii o temperaturze poniżej zera…"). Sprawdziłem: tego wpisu **nie ma w ogóle** w przesłanym `Repozytorium.xlsx` — nie występuje nawet w tekstach źródłowych pliku. Czyli **przesłany XLSX jest starszy niż przesłany `data.json`**.

Praktyczna konsekwencja, warta odnotowania: gdybyś dziś wygenerował dane z tego właśnie pliku XLSX i zaimportował je do Firebase, **opis cechy „Mrożąca" zniknąłby z bazy**. Na razie nic by się nie zepsuło, bo sprawdziłem — żadna broń w bazie nie ma jeszcze tej cechy przypisanej, więc jest to na razie osierocona definicja. Ale warto upewnić się, że pracujesz na najnowszej wersji arkusza.

### 7.6. Round-trip do Firebase — bez zastrzeżeń ✅

Sprawdziłem też przesłany `firebase-import.json`:

| Sprawdzenie | Wynik |
|---|---|
| Struktura: tylko klucz `datavault` → `live` | ✅ poprawna |
| `schemaVersion` = `datavault-firebase-import-v1` | ✅ |
| `dataJson` jest tekstem | ✅ (1 048 762 znaki) |
| **Po odczytaniu `dataJson` z powrotem = `data.json` co do znaku, z zachowaniem kolejności kluczy** | ✅ |
| Klucze niedozwolone przez Firebase (`.` `$` `#` `[` `]` `/`) | ✅ brak |

Czyli funkcje `buildFirebaseImportJson` i `validateFirebaseImportObject` robią dokładnie to, co obiecują. **Ta część nie wymaga żadnych zmian.**

### 7.7. Procedura na przyszłość

Teraz, kiedy mam Twoje pliki, ta procedura jest już wykonalna i stanowi warunek etapu B:

1. Wygeneruj `data.json` przez tryb admina w przeglądarce z bieżącego `Repozytorium.xlsx`.
2. Wygeneruj `data.json` przez `python build_json.py Repozytorium.xlsx data-python.json`.
3. Porównaj oba pliki. **Dziś różnią się kolejnością pól w `Bronie` i `Bronie Pojazdów`** (rozdz. 7.2) — po ujednoliceniu powinny być identyczne, co da wreszcie prosty test „porównaj pliki".
4. Wykonaj zmianę w kodzie.
5. Powtórz kroki 1–2 i sprawdź, że wynik nie zmienił się względem punktu 3.
6. Zaimportuj `firebase-import.json` na kopii testowej i sprawdź, że aplikacja pokazuje te same zakładki, kolumny i liczby wierszy.

Punkt odniesienia dla kroku 5 mam już policzony: **38 arkuszy, 1531 wierszy** (dla `data.json` z 1 września), słowniki `_meta`: 34 cechy, 14 stanów, 12 cech pojazdów, 3 cechy broni pojazdów, 5 stanów pojazdów.

## 8. Spójność dokumentacji i konfiguracji

| Co | Gdzie | Uwaga |
|---|---|---|
| Reguła dla `character_builder/test-v2` | `Kalkulator/config/firestore.rules:21` | Komentarz mówi: *„Tymczasowy odczyt starego dokumentu testowego umożliwia jednorazową migrację do v2"*. Sprawdziłem: **ciąg `test-v2` nie występuje w żadnym pliku kodu**. Migracja się odbyła, reguła została. Do usunięcia |
| Plik reguł nie opisuje wszystkiego, co jest wgrane | `Kalkulator/config/firestore.rules` | Plik opisuje tylko trzy dokumenty `character_builder/*` i regułę odmowy dla reszty. Tymczasem kolekcja `dataslate` (Infoczytnik) też jest dostępna — czyli **wgrane reguły zawierają więcej niż plik w repozytorium**. Szczegóły w rozdz. 9.6 |
| Brak pliku reguł dla drugiego projektu | — | Dla projektu `audiorpg-2eb6f` (GeneratorNPC, Audio) **nie ma w repozytorium żadnego pliku reguł** |
| Reguły leżą w folderze jednego modułu | `Kalkulator/config/firestore.rules` | Reguły dotyczą całego projektu Firebase, z którego korzystają trzy moduły. Umieszczenie ich w `Kalkulator/` sugeruje, że dotyczą tylko kalkulatora. Naturalniejsze miejsce: `shared/` |
| `DoZrobienia.md` — pozycja 1 | „poprawić tooltipy w DataVault (miejsce wyświetlania)" | Zdiagnozowane i wycenione w analizie responsywności, rozdz. 6.6 |
| `DoZrobienia.md` — pozycja 2 | „Poprawić brak polskich liter w Repozytorium" | **Poza zakresem tej analizy** — decyzja właściciela repozytorium: problem dotyczy danych w pliku wsadowym, nie działania aplikacji, i będzie poprawiony ręcznie w `Repozytorium.xlsx`. Odnotowuję jedno potwierdzenie od strony kodu: porównanie obu ścieżek generowania na Twoich prawdziwych plikach wykazało **zero różnic w wartościach komórek** (rozdz. 7.5), czyli **mechanizm przerabiania XLSX → JSON działa poprawnie** i niczego nie gubi ani nie zniekształca |
| `DoZrobienia.md` — pozycja 3 | „Sprawdzić efekt Flicker w Infoczytniku" | Poza zakresem tego audytu — wymaga uruchomienia obu ekranów naraz |
| `Kolumny.md` | katalog główny | Ręcznie utrzymywana dokumentacja 455 reguł CSS. Patrz analiza responsywności, rozdz. 8 — po przejściu na typy kolumn ten plik mógłby być generowany |

---

## 9. Bezpieczeństwo bazy danych (Firestore i Realtime Database)

To jest odpowiedź na wiadomości 4 i 5 z rozdziału 2.

### 9.1. Najpierw sprostowanie Twojego założenia

Napisałeś: *„Obecnie wszystkie »Rules« mam ustawione jako allow write wszędzie."*

**Sprawdziłem to praktycznie i rzeczywistość jest inna — miejscami lepsza, niż zakładałeś, ale w jednym miejscu gorsza.** To ważne, bo od tego zależy, co trzeba zrobić i w jakiej kolejności.

Aplikacja korzysta z **dwóch osobnych projektów Firebase**, a nie z jednego:

| Projekt Firebase | Używany przez | Usługa |
|---|---|---|
| `wh40k-data-slate` | DataVault, Kalkulator (oba kreatory), Infoczytnik | Realtime Database + Firestore + Authentication |
| `audiorpg-2eb6f` | GeneratorNPC, Audio | Firestore |

### 9.2. Jak to sprawdziłem — i czego celowo nie sprawdzałem

Nie poprzestałem na przeczytaniu pliku z regułami, bo plik w repozytorium może się różnić od tego, co jest naprawdę wgrane do Firebase. Wykonałem test praktyczny.

**Metoda.** Poprosiłem bazę — z zewnątrz, bez żadnego logowania — o **dokument, który na pewno nie istnieje**. Firestore odpowiada wtedy inaczej w zależności od reguł:

- reguła **zabrania** dostępu → odpowiedź `403`,
- reguła **pozwala** → odpowiedź `404` (dostęp przyznany, tylko dokumentu nie ma).

Dzięki temu odpowiedź jest jednoznaczna, a **żadne prawdziwe dane nie zostały pobrane**.

**Wyniki:**

| Projekt | Zapytanie o nieistniejący dokument | Odpowiedź | Wniosek |
|---|---|---|---|
| `wh40k-data-slate` | w `character_builder` | `404` | dostęp **przyznany** |
| `wh40k-data-slate` | w `dataslate` | `404` | dostęp **przyznany** |
| `wh40k-data-slate` | w kolekcji spoza reguł (test kontrolny) | `403` | **zabroniony** — test działa poprawnie |
| `audiorpg-2eb6f` | w `generatorNpc` | `403` | dostęp **zabroniony** |
| `audiorpg-2eb6f` | w `audio` | `403` | dostęp **zabroniony** |
| `audiorpg-2eb6f` | w kolekcji spoza reguł (test kontrolny) | `403` | zabroniony |
| `wh40k-data-slate` — **Realtime Database** | ścieżka nieistniejąca, bez logowania | `401` | **wymaga zalogowania** |

Test kontrolny jest tu istotny: dowodzi, że metoda faktycznie rozróżnia „wolno" od „nie wolno", więc wyniki `404` nie są przypadkiem.

**Czego celowo NIE zrobiłem.** Nie testowałem zapisu. Zapis oznaczałby zmodyfikowanie Twojej produkcyjnej bazy, a Infoczytnik nasłuchuje zmian na żywo — testowy wpis mógłby się komuś wyświetlić na ekranie w trakcie sesji. Uprawnienie do zapisu jest w regułach zapisane **w tej samej sekcji** co odczyt, więc skoro odczyt działa, zapis niemal na pewno też. Gdybyś chciał mieć na to twardy dowód, mogę wykonać kontrolowany zapis do specjalnie utworzonej, nieużywanej nazwy kolekcji i natychmiast po nim posprzątać — ale potrzebuję na to wyraźnej zgody (pytanie 5).

### 9.3. Co z tego wynika

#### 🟢 Dobra wiadomość — dane DataVault są chronione naprawdę

Baza Realtime Database, w której leży cały `datavault/live` (czyli wszystkie arkusze z `Repozytorium.xlsx`), **odrzuca odczyt bez zalogowania** (`401`). Mechanizm „Litanii Dostępu" nie jest ozdobą — to prawdziwa bramka oparta na Firebase Authentication. Ten kawałek jest zrobiony dobrze i nie wymaga zmian.

#### 🟢 Dobra wiadomość — projekt `audiorpg-2eb6f` też odrzuca obcych

Ulubione z GeneratorNPC i ustawienia z Audio odrzucają zapytania bez uwierzytelnienia.

**Ale tu potrzebuję Twojego potwierdzenia**, bo odpowiedź `403` ma dwa możliwe wyjaśnienia i z zewnątrz nie da się ich odróżnić:

- **(a)** reguły w tym projekcie wymagają zalogowania (np. `if request.auth != null`), albo
- **(b)** klucz API tego projektu ma ograniczenie do domeny `cutelittlegoat.github.io` i odrzuca zapytania spoza niej.

Ma to znaczenie praktyczne: jeżeli zachodzi **(a)**, to warto sprawdzić, jak GeneratorNPC się loguje, bo w kodzie tego modułu **nie widzę żadnego logowania** do projektu `audiorpg-2eb6f` — a mimo to ulubione działają. Jeżeli zachodzi **(b)**, to reguły mogą być otwarte, a chroni je tylko ograniczenie klucza, które nie jest zabezpieczeniem (patrz 9.7). **Proszę o zajrzenie do Firebase Console → Firestore → Rules w projekcie `audiorpg-2eb6f`** (pytanie 4).

#### 🔴 Zła wiadomość — kanał Infoczytnika jest otwarty dla każdego

Kolekcja `dataslate` w projekcie `wh40k-data-slate` odpowiada `404`, czyli **wpuszcza każdego, bez logowania**.

Co to jest: `dataslate/current` to jeden dokument, przez który panel GM przekazuje treść na ekran Infoczytnika. Panel zapisuje (`GM_test.html:508` — `currentRef.set(getPayload(type), {merge:false})`), a ekran gracza nasłuchuje na żywo (`Infoczytnik_test.html:223` — `ref.onSnapshot(...)`).

Konsekwencje, uszeregowane wg wagi:

1. **🔴 Podszycie się pod MG.** Skoro odczyt jest otwarty, a zapis jest w tej samej regule, to osoba z zewnątrz może nadpisać ten dokument. Ponieważ ekran gracza nasłuchuje na żywo, dowolna treść pojawiłaby się **natychmiast na ekranie w trakcie sesji**. Zapis używa `{merge:false}`, czyli nadpisuje całość — więc równie dobrze można wyczyścić to, co MG właśnie wysłał.
2. **🟠 Podgląd tego, co MG wysyła.** Każdy, kto zna identyfikator projektu (a jest on jawny w repozytorium — i tak być musi), może odczytywać treści przekazywane graczom.
3. **🟡 Koszty.** Otwarta kolekcja pozwala dowolnej osobie generować odczyty i zapisy bez ograniczenia. Na darmowym planie skończy się to zablokowaniem po przekroczeniu limitu.

#### 🟠 Kreatory postaci są otwarte dla każdego

`character_builder/current` (Prosty Kreator) i `character_builder/v2` (Zaawansowany Kreator) odpowiadają `404` — czyli reguły z pliku `Kalkulator/config/firestore.rules` (`allow read, write: if true`) są faktycznie wgrane i działają dokładnie tak, jak napisano.

Zawartość to arkusz postaci: atrybuty, umiejętności, talenty, słowa kluczowe, nazwa gatunku i archetypu. Nie ma tam haseł ani danych osobowych, więc waga jest niższa niż przy Infoczytniku — ale **każdy może to odczytać, nadpisać i skasować**.

Przy okazji zauważyłem, że **oba kreatory zapisują do jednego, wspólnego dokumentu** — nie ma dokumentu na gracza ani na postać. Zgłosiłem to i potwierdziłeś, że **jest to w porządku**, bo z założenia postać tworzy jedna osoba naraz. Zamykam temat i niczego tu nie proponuję.

### 9.4. Odpowiedź wprost na Twoje pytanie o Infoczytnik

Opisałeś realny scenariusz: *„W trakcie sesji gracze mają otwartą na tablecie stronę do odczytu, a ja na PC stronę do wpisywania wiadomości. Czy tutaj potrzeba jakichś dodatkowych zabezpieczeń?"*

**Krótko: tak, jedno — App Check. Nic ponad to.** Poniżej dlaczego, bo warto rozumieć, przed czym to chroni, a przed czym nie.

#### Co dokładnie jest dziś otwarte

Panel GM i ekran gracza porozumiewają się przez **jeden dokument** w bazie: `dataslate/current`. Panel go nadpisuje, ekran gracza nasłuchuje zmian na żywo. Ten dokument jest dziś dostępny dla każdego, kto zna identyfikator projektu — a identyfikator jest jawny w kodzie strony i musi taki być, żeby aplikacja działała.

#### Jak wygląda realne ryzyko przy Twoim sposobie użycia

| Scenariusz | Czy jest realny | Uwaga |
|---|---|---|
| Ktoś przypadkiem trafia na Twój ekran Infoczytnika | 🟢 znikome | Trzeba znać identyfikator projektu i wiedzieć, czego szukać |
| Automat skanujący internet natrafia na otwartą bazę | 🟠 realne | Otwarte bazy Firebase są masowo skanowane. Automat nie wie, co znalazł, ale może zapisywać i generować koszty |
| Ktoś celowo psuje Wam sesję | 🟡 mało prawdopodobne | Wymaga, żeby ktoś wiedział o istnieniu aplikacji i chciał zaszkodzić — czyli praktycznie ktoś z kręgu znajomych |
| Ktoś czyta, co wysyłasz graczom | 🟡 mało prawdopodobne | Ale technicznie możliwe bez żadnej przeszkody |

Czyli: **prawdopodobieństwo jest niskie, ale skutek byłby bardzo widoczny** — treść na ekranie graczy w środku sesji to jedyne miejsce w całej aplikacji, gdzie obca ingerencja byłaby natychmiast widoczna dla wszystkich naraz.

#### Dlaczego mimo to nie proponuję niczego więcej niż App Check

Rozważyłem trzy dodatkowe zabezpieczenia i **wszystkie trzy odrzucam** przy Twoim modelu użycia:

| Pomysł | Dlaczego odpada |
|---|---|
| Osobne hasło do panelu GM | Panel GM jest u Ciebie na komputerze i nikt inny go nie otwiera. Hasło chroniłoby przed kimś, kto już i tak musiałby ominąć App Check |
| Logowanie graczy na tablecie | Ekran Infoczytnika ma być „włącz i połóż na stole". Wymuszanie logowania psuje jedyną rzecz, która ma tu być bezobsługowa |
| Podpisywanie wiadomości | Realne zabezpieczenie, ale to osobny mechanizm do napisania i utrzymania. Nieproporcjonalne do ryzyka przy grupie znajomych |

**App Check trafia dokładnie w to, co jest tutaj problemem:** odcina wszystko, co nie jest Twoją aplikacją — a więc i automaty skanujące internet, i kogoś, kto chciałby napisać własny skrypt piszący do tego dokumentu. To jedno ustawienie, bez zmian w sposobie pracy przy stole.

#### Jedno zawężenie reguł przy okazji

Warto przy tym zawęzić regułę z całej kolekcji `dataslate` do jednego dokumentu `current` — bo tylko z niego aplikacja korzysta. To nic nie kosztuje i jest w propozycji reguł w rozdz. 9.8.

### 9.5. Odpowiedź wprost: czy App Check rozwiązuje te problemy?

Zapytałeś: *„Rozumiem, że App Check rozwiązuje te problemy?"*. Odpowiedź brzmi **tak dla trzech z czterech** — i chcę być precyzyjny, które to.

| Problem | Czy App Check to rozwiązuje |
|---|---|
| Ktoś z zewnątrz pisze do kanału Infoczytnika w trakcie sesji | ✅ **Tak** — to jest dokładnie to, do czego App Check służy |
| Ktoś z zewnątrz czyta lub nadpisuje arkusze postaci | ✅ **Tak** |
| Automaty skanujące internet generują koszty na Twojej bazie | ✅ **Tak** |
| Osoba, która normalnie korzysta z Twojej aplikacji, sięga po dane przez narzędzia przeglądarki | ❌ **Nie** — jej przeglądarka ma ważny znacznik |

Ostatni wiersz nie jest wadą App Check, tylko granicą tego, co ten mechanizm w ogóle obiecuje. Żeby go zamknąć, trzeba by prawdziwych kont użytkowników i ról — co przy grupie znajomych jest nieproporcjonalne, i co świadomie odrzuciłeś już w projekcie `Karty`.

**Przy Twoim modelu użycia — kilka osób, które się znają — App Check jest właściwym i wystarczającym rozwiązaniem.** Nie proponuję niczego ponad to.

### 9.6. Plik reguł w repozytorium nie odpowiada temu, co jest wgrane

`Kalkulator/config/firestore.rules` opisuje trzy dokumenty `character_builder/*` i kończy regułą odmowy dla wszystkiego pozostałego:

```
match /{document=**} { allow read, write: if false; }
```

Gdyby to były wszystkie wgrane reguły, kolekcja `dataslate` musiałaby zwrócić `403`. Zwraca `404`. **Wniosek: we wgranych regułach jest co najmniej jeszcze jedna sekcja, której nie ma w repozytorium.**

To jest problem sam w sobie, niezależny od bezpieczeństwa: nie ma jednego, wersjonowanego, kompletnego pliku reguł. Nie da się przejrzeć historii zmian ani odtworzyć stanu po pomyłce. Rekomendacja: przenieść **pełny, aktualny** zestaw reguł obu projektów do repozytorium (proponowane miejsca: `shared/firestore-wh40k-data-slate.rules` i `shared/firestore-audiorpg.rules`) i od tej pory zmieniać je tylko przez ten plik.

### 9.7. Trzy rzeczy, które warto od razu odkłamać

**„Klucz `apiKey` jest w publicznym repozytorium — to wyciek, trzeba go pilnie zmienić."**
Nie. `apiKey` w Firebase **z założenia jest jawny** — musi być w kodzie strony, żeby przeglądarka mogła się połączyć. To nie jest hasło, tylko identyfikator projektu. Google projektuje to celowo. Zmiana klucza **niczego nie poprawi**, a popsuje działającą aplikację. Problemem nie jest jawny klucz, tylko reguły.

**„Ograniczenie klucza API do mojej domeny wystarczy."**
Nie. Ograniczenie sprawdza nagłówek `Referer`, który wysyła przeglądarka — a więc coś, co nadawca w pełni kontroluje. To utrudnienie, nie zabezpieczenie. Prawdziwą odpowiedź na pytanie „czy to zapytanie przyszło z mojej aplikacji" daje dopiero App Check.

**„Repozytorium jest publiczne, więc dlatego dane są odsłonięte."**
Nie. Nawet w prywatnym repozytorium `apiKey` i identyfikator projektu byłyby widoczne w kodzie strony u każdego użytkownika. Publiczne repozytorium **ułatwia** znalezienie projektu i pokazuje strukturę bazy, ale **nie jest przyczyną**. Przyczyną są reguły.

### 9.8. Co dokładnie zrobić — plan

Twój cel brzmiał: *„żeby modyfikacja Firestore była możliwa tylko poprzez aplikację WrathAndGlory"*. To jest dokładnie zadanie dla **App Check** — tego samego mechanizmu, który wdrożyłeś w projekcie `Karty` i który masz opisany w `Instrukcja_AppCheck_20260907.md`. Poniżej to, co w tej aplikacji jest **inne** niż tam.

#### Różnica 1 — dwa projekty, dwa klucze reCAPTCHA

W `Karty` był jeden projekt Firebase i jeden klucz. Tutaj są dwa projekty, a klucz reCAPTCHA Enterprise należy do projektu Google Cloud — więc **potrzebujesz dwóch osobnych kluczy**:

| Projekt Firebase | Klucz reCAPTCHA | Domena w kluczu |
|---|---|---|
| `wh40k-data-slate` | nowy, np. o nazwie `WrathAndGlory-DataSlate` | `cutelittlegoat.github.io` |
| `audiorpg-2eb6f` | nowy, np. o nazwie `WrathAndGlory-AudioRPG` | `cutelittlegoat.github.io` |

#### Różnica 2 — dobra wiadomość: po jednej aplikacji webowej na projekt

W `Karty` był kłopot z dwiema bliźniaczymi aplikacjami `Karty-Web` i trzeba było rejestrować obie. Tutaj tego problemu nie ma — sprawdziłem identyfikatory aplikacji we wszystkich pięciu plikach konfiguracyjnych:

| Identyfikator aplikacji | Używany przez |
|---|---|
| `1:382792444120:web:9eb27e2…` | DataVault, Kalkulator (oba kreatory), Infoczytnik |
| `1:848367463263:web:500bdf5…` | GeneratorNPC, Audio |

Czyli **rejestrujesz dokładnie dwie aplikacje webowe — po jednej na projekt** — a to automatycznie obejmuje wszystkie sześć modułów.

#### Różnica 3 — trzeba objąć także Realtime Database

DataVault czyta dane z **Realtime Database**, nie z Firestore. App Check ma dla niej osobny przełącznik wymuszania. Jeżeli włączysz wymuszanie tylko dla Firestore, DataVault zostanie poza ochroną. W zakładce **App Check → APIs** trzeba więc włączyć wymuszanie dla **obu**: `Cloud Firestore` i `Realtime Database`.

#### Różnica 4 — kod trzeba dopisać w sześciu miejscach

W `Karty` kod był już przygotowany. Tutaj **nie ma jeszcze żadnej obsługi App Check** — sprawdziłem, w całym repozytorium nie występuje ani `appCheck`, ani `recaptcha`. Trzeba dodać inicjalizację w każdym module, który łączy się z Firebase:

| Moduł | Plik | Sposób ładowania Firebase |
|---|---|---|
| DataVault | `shared/firebase-data-loader.js` | moduł ES, wersja 12.6.0 |
| GeneratorNPC | `GeneratorNPC/index.html` | moduł ES, wersja 12.6.0 |
| Audio | `Audio/index.html` | moduł ES, wersja 12.6.0 |
| Infoczytnik | `Infoczytnik/GM_test.html`, `Infoczytnik_test.html` | wersja zgodnościowa (compat) 8.x |
| Kalkulator — Prosty Kreator | `Kalkulator/TworzeniePostaci.html` | wersja zgodnościowa 8.10.1 |
| Kalkulator — Zaawansowany Kreator | `Kalkulator/TworzeniePostaci_v2-firebase.js` | wersja zgodnościowa 8.10.1 |

> **Uwaga techniczna, ważna dla wyceny.** Cztery moduły używają Firebase w wersji zgodnościowej **8.10.1**, a trzy w nowoczesnej **12.6.0**. Obsługa App Check wygląda w nich inaczej i trzeba ją napisać dwa razy, w dwóch odmianach. To warto uwzględnić w planowaniu — a przy okazji rozważyć ujednolicenie wersji Firebase w całej aplikacji, bo dziś przeglądarka pobiera dwie różne generacje tej samej biblioteki.

#### Różnica 5 — Infoczytnik ma własną zasadę pracy z plikami

Zmiany w tym module wolno robić wyłącznie w `GM_test.html` i `Infoczytnik_test.html`, z aktualizacją `INF_VERSION` w obu (`Infoczytnik/AGENTS.md`). Pliki produkcyjne aktualizujesz ręcznie Ty. Trzeba to wpisać w plan, bo inaczej po włączeniu wymuszania **produkcyjny Infoczytnik przestanie działać**, podczas gdy testowy będzie działał.

#### Proponowane reguły — po włączeniu App Check

Poniższe reguły mówią: *„wpuść tylko zapytania niosące ważny znacznik App Check i tylko do tych trzech dokumentów; wszystko inne — odmowa"*. Warunek `request.app != null` jest spełniony wtedy i tylko wtedy, gdy zapytanie przyszło z zarejestrowanej aplikacji.

Dla projektu **`wh40k-data-slate`**:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Zapytanie musi nieść ważny znacznik App Check, czyli musi pochodzić
    // z zarejestrowanej aplikacji WrathAndGlory.
    // The request must carry a valid App Check token, i.e. it must originate
    // from the registered WrathAndGlory application.
    function zAplikacji() {
      return request.app != null;
    }

    // Prosty Kreator Postaci / Simple character creator
    match /character_builder/current { allow read, write: if zAplikacji(); }

    // Zaawansowany Kreator Postaci / Advanced character creator
    match /character_builder/v2      { allow read, write: if zAplikacji(); }

    // Kanał panelu GM -> ekran Infoczytnika / GM panel -> reader screen channel
    match /dataslate/current         { allow read, write: if zAplikacji(); }

    // Wszystko inne pozostaje niedostępne / Everything else stays inaccessible
    match /{document=**} { allow read, write: if false; }
  }
}
```

Dla projektu **`audiorpg-2eb6f`** — do uzupełnienia po sprawdzeniu, co jest tam wgrane dziś (pytanie 4); szkielet:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function zAplikacji() { return request.app != null; }

    // Ulubione zestawy GeneratorNPC / GeneratorNPC favourite sets
    match /generatorNpc/favorites { allow read, write: if zAplikacji(); }

    // Ustawienia modułu Audio / Audio module settings
    match /audio/favorites        { allow read, write: if zAplikacji(); }

    match /{document=**} { allow read, write: if false; }
  }
}
```

Zmiany wobec dzisiejszego stanu, poza samym App Check:

- **usunięta reguła dla `character_builder/test-v2`** — migracja dawno się odbyła, a w kodzie nie ma śladu po tym dokumencie (rozdz. 8),
- **`dataslate` zawężone do konkretnego dokumentu `current`** zamiast całej kolekcji — to jedyny dokument, którego aplikacja używa.

#### 🔴 Kolejność jest krytyczna

To jest najważniejszy akapit w tym rozdziale.

Warunek `request.app != null` **sam w sobie jest wymuszaniem**. Jeżeli wgrasz te reguły, zanim aplikacja zacznie wysyłać znaczniki App Check, **wszystkie moduły przestaną działać natychmiast** — dla wszystkich, naraz.

Właściwa kolejność:

| Krok | Co | Czy coś może przestać działać |
|---|---|---|
| 1 | Utwórz dwa klucze reCAPTCHA Enterprise (po jednym na projekt), domena `cutelittlegoat.github.io` | nie |
| 2 | Zarejestruj po jednej aplikacji webowej w App Check w każdym projekcie, TTL `1 days` | nie |
| 3 | Dodaj inicjalizację App Check w sześciu modułach i wypchnij na `main` | nie — aplikacja wysyła znaczniki, ale nic ich jeszcze nie sprawdza |
| 4 | **Obserwuj przez kilka dni** zakładkę App Check → APIs, aż ruch będzie „zweryfikowany" | nie |
| 5 | Dopiero teraz: włącz wymuszanie dla `Cloud Firestore` **i** `Realtime Database` w obu projektach | **tak** — od tego momentu obce narzędzia są odcinane |
| 6 | Dopiero teraz: wgraj powyższe reguły z `request.app != null` | **tak** |

Hamulec bezpieczeństwa: w tym samym miejscu, gdzie klikasz **Enforce**, jest **Unenforce**. Działa natychmiast i nie wymaga zmian w kodzie. Firebase trzyma też historię reguł, więc powrót do poprzedniej wersji to jedno kliknięcie.

### 9.9. Czego App Check NIE zrobi — żeby nie było rozczarowania

- ✅ **Odcina obce programy, skrypty i automatyczne skanowanie internetu.** To jest dokładnie Twój cel: „modyfikacja tylko przez aplikację WrathAndGlory".
- ✅ Realnie zamyka opisany wyżej problem podszywania się pod MG w Infoczytniku.
- ❌ **Nie chroni przed osobą, która normalnie korzysta z aplikacji.** Jej przeglądarka ma ważny znacznik, więc przez narzędzia deweloperskie sięgnie po te same dane co aplikacja. Przy grupie znajomych to jest akceptowalne — tak samo uznano w analizie dla `Karty`.
- ❌ **Nie chroni przed pomyłką.** Nikt nie zabroni nadpisać arkusza postaci własną pomyłką. Na to odpowiada wyłącznie kopia zapasowa.
- ❌ **Nie rozróżnia użytkowników.** Nie ma „ten gracz widzi swoje postacie". To wymagałoby prawdziwych kont, czego świadomie nie robimy.

### 9.10. Kwestia, której nie ma w `Karty` — brak kopii zapasowej

Odnotowuję, bo w analizie dla `Karty` uznałeś ochronę przed przypadkowym skasowaniem za cel nadrzędny, a tutaj sytuacja jest inna:

| Dane | Czy da się je odtworzyć po skasowaniu |
|---|---|
| `datavault/live` (Realtime Database) | **TAK** — źródłem jest `Repozytorium.xlsx` na Twoim dysku; wystarczy wygenerować `firebase-import.json` i zaimportować ponownie |
| `character_builder/current`, `character_builder/v2` | **NIE** — arkusze postaci istnieją tylko w bazie |
| `generatorNpc/favorites` | **częściowo** — GeneratorNPC ma zapas w pamięci przeglądarki (`loadFavoritesFromLocal`), ale tylko na tym urządzeniu, na którym były zapisane |
| `audio/favorites` | **NIE** |
| `dataslate/current` | nieistotne — to bufor bieżącej wiadomości |

Czyli największa i najcenniejsza część danych (DataVault) **jest odtwarzalna z pliku XLSX** — i to jest bardzo dobra własność tej architektury, warta świadomego utrzymania. Nieodtwarzalne są arkusze postaci i ulubione. Czy warto dla nich budować przycisk kopii zapasowej — pytanie 9.

### 9.11. Uwaga na marginesie — sekret usunięty z plików, ale nie z historii

Przy okazji przeglądania repozytorium sprawdziłem stan pliku `WebView_FCM_Cloudflare_Worker/TRIGGER_TOKEN`, o którym mowa w starszej analizie `Analizy/KonfiguracjaCloudflareAudio.md`.

**Dobra wiadomość:** plik zawiera dziś **wartość zastępczą**, nie prawdziwy token. Zalecenie z tamtej analizy zostało wykonane — zatwierdzenie `773828e` („Bezpieczenstwo: usun jawny TRIGGER_TOKEN z plikow repozytorium").

**Ale jest jedna rzecz, o której łatwo zapomnieć.** Git przechowuje **całą historię** zmian. Sprawdziłem: ten plik ma w historii dwie różne wersje zawartości — czyli poprzednią, prawdziwą wartość **nadal da się odczytać** z historii repozytorium, a repozytorium jest publiczne. Usunięcie sekretu z bieżącej wersji plików **nie usuwa go z przeszłości**.

Praktyczny wniosek jest prosty i dotyczy każdego sekretu, który kiedykolwiek trafił do repozytorium publicznego:

> **Jedyne, co naprawdę pomaga, to zmiana wartości sekretu po stronie usługi.** Sprzątanie pliku jest potrzebne, żeby nie powielać błędu, ale samo z siebie nic nie odwraca.

Jeżeli `TRIGGER_TOKEN` został już zmieniony w panelu Cloudflare (starsza analiza przewidywała to w sekcji 4) — sprawa jest zamknięta i ten akapit jest tylko potwierdzeniem. Jeżeli **nie** został zmieniony, to jest to najpilniejsza rzecz z całego tego dokumentu, pilniejsza niż App Check. **Nie potrafię tego sprawdzić z zewnątrz** — panel Cloudflare jest chroniony Twoim logowaniem (pytanie 10).

To samo dotyczy pliku `WebView_FCM_Cloudflare_Worker/google-services.json`, który jest śledzony przez gita. W jego przypadku nie ma powodu do niepokoju: zawiera te same jawne z założenia identyfikatory projektu co `firebase-config.js` (patrz 9.7) — nie jest to sekret.

> **Zastrzeżenie.** Folder `WebView_FCM_Cloudflare_Worker/` jest oznaczony w `AGENTS.md` §17 jako chroniony przed edycją, więc niczego w nim nie zmieniałem ani nie proponuję zmieniać. Powyższe to wyłącznie informacja.

### 9.12. Podsumowanie rozdziału prostym językiem

Baza danych ma dwa wejścia. Pierwsze to panel Firebase Console, do którego wchodzisz loginem i hasłem Google — to wejście jest zamknięte prawidłowo. Drugie to takie, z którego korzysta sama aplikacja w przeglądarce gracza. Żeby aplikacja działała, adres tego wejścia musi być zapisany w kodzie strony, więc każdy może go odczytać. To normalne i tak ma być.

Sprawdziłem, co się dzieje, gdy ktoś podejdzie do tego drugiego wejścia bez logowania:

- do **danych DataVault** (arkusze z Repozytorium) — **nie wejdzie**, bramka działa,
- do **ulubionych GeneratorNPC i ustawień Audio** — **nie wejdzie** (choć nie wiem, czy dzięki regułom, czy dzięki ograniczeniu klucza — stąd pytanie 5),
- do **arkuszy postaci z obu kreatorów** — **wejdzie i może je zmienić**,
- do **kanału, przez który MG wysyła treść na ekran Infoczytnika** — **wejdzie, może podejrzeć, a najprawdopodobniej także wysłać graczom dowolną treść w trakcie sesji**.

To ostatnie jest jedynym miejscem, które uważam za wymagające reakcji. Reszta to porządki.

Rozwiązanie, o które pytasz — App Check — jest właściwe i wystarczające dla tego zastosowania. Trzeba je tylko wdrożyć w **odpowiedniej kolejności**, bo zrobione odwrotnie wyłączy całą aplikację wszystkim naraz.

---

## 10. Ryzyka

| Ryzyko | Waga | Jak je ograniczyć |
|---|---|---|
| **Włączenie App Check w złej kolejności wyłączy całą aplikację** wszystkim naraz | 🔴 wysoka | Trzymać się kolejności z rozdz. 9.8. Zapamiętać ścieżkę do przycisku **Unenforce** — to hamulec bezpieczeństwa całej operacji |
| **Usunięcie ścieżki SheetJS bez porównania wyniku** narusza `AGENTS.md` §15 | 🟠 średnia | Wykonać procedurę z rozdz. 7.7 — pliki wejściowe są już dostępne, punkt odniesienia policzony |
| **Wydzielenie wspólnych funkcji formatujących** zmieni wygląd tekstu w dwóch modułach naraz — trzy udokumentowane rozjazdy trzeba świadomie rozstrzygnąć | 🟠 średnia | Najpierw ustalić, która wersja jest właściwa (rozdz. 6.1), potem porównać wynik na kilkunastu rekordach przed i po |
| **Poprawka okna porównania (3.5) zmieni wygląd widoczny dla użytkownika** | 🟡 niska | Decyzja należy do Ciebie — pytanie 2 |
| **Ujednolicenie napisu „Brak danych" (5.5) zmieni widoczny tekst** | 🟡 niska | Decyzja należy do Ciebie — pytanie 3 |
| **Zmiany w Infoczytniku wykonane w niewłaściwych plikach** | 🟡 niska | `Infoczytnik/AGENTS.md`: wyłącznie `*_test.html` + aktualizacja `INF_VERSION` w obu |
| **Normalizacja zakończeń wierszy w `Infoczytnik.html`** pokaże w historii zmianę wszystkich 237 linii | 🟡 niska | Zrobić to osobnym zatwierdzeniem, opisanym jako sama zmiana zakończeń wierszy |
| **Przesłany `Repozytorium.xlsx` jest starszy niż przesłany `data.json`** (rozdz. 7.5) | 🟡 niska | Przed generowaniem danych upewnić się, że pracujesz na najnowszej wersji arkusza — inaczej cofniesz jedną cechę |
| **Nie testowałem zapisu do bazy** — świadomie | 🟡 niska | Wniosek o możliwości zapisu jest wyprowadzony z reguł, nie zmierzony. Pytanie 6 |

---

## 11. Proponowana kolejność prac

Ułożone tak, żeby to, co nie może niczego zepsuć, szło pierwsze.

### Etap A — sprzątanie bez żadnego ryzyka (~2 h)

Zmiany, po których nie da się zauważyć różnicy w działaniu.

| # | Co | Plik | Rozdz. |
|---|---|---|---|
| A1 | Usunąć znacznik `<script>` z nieistniejącą biblioteką `xlsx@0.19.3` | `DataVault/index.html:138` | 3.1 |
| A2 | Dodać `let m;` w `formatInlineHTML` | `DataVault/app.js:671` | 3.2 |
| A3 | Usunąć blok bramki dostępu z szablonu karty do druku | `GeneratorNPC/index.html:2880` | 5.1 |
| A4 | Usunąć dwa komentarze „Legacy renderer" | `DataVault/app.js:1449, 1827` | 5.2 |
| A5 | Usunąć operację pustą z `norm()` | `DataVault/app.js:298` | 5.3 |
| A6 | Poprawić sprawdzanie elementu XML | `build_json.py:224` | 3.7 |
| A7 | Usunąć nieużywane: `deriveColumnOrderFromHeader`, `headerBuiltFor`, parametr `title` w `openModal`, przesłoniętą zmienną `key` | `DataVault/app.js` | 4.2 |
| A8 | Usunąć wyszukiwanie „na wyczucie" (3 funkcje, ~96 linii) | `GeneratorNPC/index.html:1231–1326` | 4.3 |
| A9 | Usunąć martwe klasy CSS | `GeneratorNPC/style.css`, `Kalkulator/index.html`, `TworzeniePostaci.html`, `GeneratorNazw/style.css` | 4.5, 4.7 |
| A10 | Usunąć regułę dla `character_builder/test-v2` | `Kalkulator/config/firestore.rules:21` | 8 |
| A11 | Znormalizować zakończenia wierszy w `Infoczytnik.html` (osobne zatwierdzenie) | `Infoczytnik/Infoczytnik.html` | 5.4 |

### Etap B — sprzątanie wymagające sprawdzenia (~4 h)

> **Odblokowane.** Pliki `Repozytorium.xlsx` i `data.json` otrzymałem 10 września, porównanie obu ścieżek generowania jest wykonane (rozdz. 7). Warunek z `AGENTS.md` §15 da się teraz spełnić.

| # | Co | Warunek |
|---|---|---|
| B1 | Usunąć nieużywaną ścieżkę SheetJS (~170 linii) | wykonać procedurę z 7.7 |
| B2 | Ujednolicić kolejność scalania kolumn (7.2) — **potwierdzona różnica** | j.w.; dopiero to umożliwi test „porównaj oba pliki" |
| B3 | Ujednolicić `norm()` w trzech miejscach (7.3) — dziś nieaktywne, ale to mina | j.w. |
| B4 | Usunąć 51 martwych reguł `min-col-*` | wykonać razem z etapem 1 analizy responsywności, żeby raz przejrzeć ten plik |

### Etap C — bezpieczeństwo bazy (~1–2 dni robocze rozłożone na kilka dni kalendarzowych)

| # | Co | Uwaga |
|---|---|---|
| C1 | Sprawdzić w Firebase Console faktyczne reguły **obu** projektów i przenieść je do repozytorium | pytanie 4; to jest warunek wstępny dla całej reszty |
| C2 | Utworzyć dwa klucze reCAPTCHA Enterprise | rozdz. 9.8 |
| C3 | Zarejestrować po jednej aplikacji webowej w App Check w każdym projekcie, TTL `1 days` | rozdz. 9.8 |
| C4 | Dodać inicjalizację App Check w sześciu modułach (dwie odmiany: nowoczesna i zgodnościowa) | rozdz. 9.8, różnica 4 |
| C5 | **Odczekać kilka dni** i obserwować zakładkę APIs | krok, którego nie wolno pominąć |
| C6 | Włączyć wymuszanie dla Firestore **i** Realtime Database w obu projektach | rozdz. 9.8, różnica 3 |
| C7 | Wgrać zawężone reguły z `request.app != null` | dopiero po C6 |

### Etap D — porządki architektoniczne (osobny temat)

| # | Co | Uwaga |
|---|---|---|
| D1 | Wydzielić wspólne funkcje formatujące do `shared/text-format.js` | rozdz. 6.1; wymaga rozstrzygnięcia trzech rozjazdów |
| D2 | Ujednolicić pliki konfiguracji Firebase (5 plików → 2) | rozdz. 6.2 |
| D3 | Ujednolicić wersję Firebase (dziś 8.10.1 i 12.6.0 równolegle) | rozdz. 9.8, uwaga techniczna |
| D4 | Jeden wspólny `ResizeObserver` w DataVault, jak w GeneratorNPC | rozdz. 3.6 |
| D5 | Przejść na typy kolumn w DataVault | analiza responsywności, rozdz. 8 — **przed dodatkiem** |

**Kolejność względem analizy responsywności.** Etap A tego audytu i etapy 1–3 analizy responsywności są niezależne i można je robić równolegle. Etap B4 warto połączyć z etapem 1 analizy responsywności (ten sam plik). Etap C jest niezależny od wszystkiego i można go zacząć w dowolnym momencie — ale ze względu na krok C5 („odczekać kilka dni") warto zacząć wcześniej niż później.

---

## 12. Ustalenia i pytania otwarte

### 12.1. Co już zostało ustalone

| # | Sprawa | Decyzja |
|---|---|---|
| 1 | `Repozytorium.xlsx`, `data.json`, `firebase-import.json` | **Otrzymane 10 września.** Porównanie obu ścieżek generowania wykonane — wyniki w rozdz. 7.5 |
| 2 | `Main/Gilead.html`, `Main/Galaktyka.html` | **Poza zakresem** — pliki powstały poza tym projektem. Usunięte z analizy |
| 3 | Literówki w `Repozytorium.xlsx` (`DoZrobienia.md` poz. 2) | **Poza zakresem** — poprawka ręczna w pliku źródłowym. Potwierdzam od strony kodu, że mechanizm przerabiania XLSX → JSON działa poprawnie (rozdz. 7.5) |
| 4 | Wspólny dokument obu kreatorów postaci | **Nie jest problemem** — z założenia postać tworzy jedna osoba naraz. Nie proponuję zmiany |
| 5 | Dwa osobne projekty Firebase | **Zostają.** Operacje wdrożeniowe wykonywane dwukrotnie, po razie na projekt |
| 6 | Kolorystyka pliku z analizą responsywności | Nie musi być zgodna z zieloną paletą aplikacji |
| 7 | Zmiany w kodzie aplikacji | **Wstrzymane** do czasu ustalenia całości. Na razie zmieniane są wyłącznie pliki analiz |

### 12.2. Pytania otwarte

Napisane bez języka technicznego. Przy każdym podaję, co zrobię, jeśli nie odpowiesz.

**Pytanie 1 — czy możesz zajrzeć do Firebase Console i sprawdzić reguły obu projektów?**
Potrzebuję zobaczyć, co jest **naprawdę wgrane** w projektach `wh40k-data-slate` i `audiorpg-2eb6f` (Firestore → Rules oraz Realtime Database → Rules). Powód: reguły zapisane w repozytorium nie odpowiadają temu, co zmierzyłem, a dla drugiego projektu w repozytorium w ogóle nie ma pliku z regułami. Bez tego nie napiszę kompletnego zestawu reguł — mogę tylko zgadywać.
*Domyślnie: **czekam z etapem C** do czasu otrzymania obecnych reguł. Wystarczy skopiować tekst z okna i wkleić do czatu.*

**Pytanie 2 — czy okno „Porównaj zaznaczone" ma zacząć wyróżniać różnice?**
Dziś, gdy porównujesz dwa wpisy, tabela wyświetla się bez ramek i bez kolorów, a pola, które się różnią, **nie są w żaden sposób oznaczone** — mimo że w kodzie są przygotowane style, żeby świeciły na pomarańczowo. Wygląda to na niedokończoną przeróbkę. Poprawka sprawi, że okno zacznie wyglądać jak reszta aplikacji, a różnice będą widoczne na pierwszy rzut oka. **To jedyna poprawka w tym audycie, która zmieni wygląd.**
*Domyślnie: **tak, poprawiam** — wygląda na przeoczenie, a nie na decyzję.*

**Pytanie 3 — czy poprawić polski komunikat „Brak danych" w DataVault?**
Gdy nie ma danych do pokazania, po polsku wyświetla się krótszy komunikat niż po angielsku — brakuje w nim informacji, że trzeba się zalogować. Czyli akurat tej najbardziej potrzebnej.
*Domyślnie: **tak, ujednolicam z wersją angielską**.*

**Pytanie 4 — czy token `TRIGGER_TOKEN` został już zmieniony w panelu Cloudflare?**
W repozytorium plik z tym tokenem zawiera dziś wartość zastępczą — to jest zrobione dobrze. Ale poprzednia, prawdziwa wartość nadal jest zapisana w historii zmian repozytorium, a repozytorium jest publiczne. Usunięcie z pliku nie usuwa z przeszłości. Jedyne, co naprawdę zamyka sprawę, to nadanie nowej wartości w panelu Cloudflare. Nie mam jak tego sprawdzić — panel jest chroniony Twoim logowaniem.
*Domyślnie: **zakładam, że zostało zmienione** (starsza analiza to przewidywała). Jeśli nie — to jest najpilniejsza rzecz z całego dokumentu.*

**Pytanie 5 — czy mogę wykonać kontrolowany test zapisu do bazy?**
Potwierdziłem, że dane da się z bazy **odczytać** bez logowania. Nie sprawdzałem, czy da się je **zmienić**, bo to znaczyłoby ruszanie Twoich prawdziwych danych, a Infoczytnik pokazuje zmiany na żywo — testowy wpis mógłby się komuś wyświetlić na ekranie. Gdybyś chciał mieć pewność, mogę zapisać jeden wpis do specjalnie utworzonej, nieużywanej nazwy i natychmiast go skasować. Nic z tego nie pojawi się w aplikacji.
*Domyślnie: **nie robię tego** bez wyraźnej zgody.*

**Pytanie 6 — czy ten dokument ma zostać w publicznym repozytorium?**
Repozytorium `CuteLittleGoat/WrathAndGlory` jest publiczne. Ten plik opisuje, które elementy bazy są otwarte. Celowo nie ma tu żadnych gotowych poleceń ani instrukcji, jak to wykorzystać — ale sama informacja też ma pewną wartość dla kogoś niepożądanego. Jednocześnie wszystko, co tu napisałem, wynika wprost z plików, które w tym repozytorium już są jawne.
- **(a)** Zostawić — po wykonaniu etapu C problem i tak przestanie istnieć.
- **(b)** Trzymać analizy bezpieczeństwa poza repozytorium publicznym.
- **(c)** Zmienić repozytorium na prywatne. **Uwaga: to prawdopodobnie wyłączy stronę**, bo aplikacja jest publikowana przez GitHub Pages, a to na darmowym koncie wymaga repozytorium publicznego.
*Domyślnie: **(a) zostawiam**, ale zwracam uwagę i decyzja należy do Ciebie.*

**Pytanie 7 — czy potrzebna jest kopia zapasowa danych z bazy?**
Największa część danych (arkusze z Repozytorium) **jest bezpieczna** — odtworzysz je w każdej chwili z pliku `Repozytorium.xlsx`; potwierdziłem to praktycznie, generując `data.json` z Twojego pliku (rozdz. 7.5). Nie da się natomiast odtworzyć zapisanych arkuszy postaci i ulubionych zestawów z GeneratorNPC. W projekcie `Karty` zdecydowałeś się na przycisk kopii zapasowej.
*Domyślnie: **nie proponuję tego tutaj** — zakres nieodtwarzalnych danych jest mały, a najcenniejsze dane masz w pliku XLSX na dysku. Ale jeśli zapisane postacie są dla Ciebie ważne, można to dorobić.*

**Pytanie 8 — czy sprzątanie ma iść przed poprawkami responsywności, czy po?**
Etap A tego audytu i pierwsze etapy analizy responsywności nie kolidują ze sobą i mogą iść równolegle. Jest jednak jeden punkt styku: 51 martwych reguł szerokości kolumn w GeneratorNPC leży w tym samym pliku, który poprawiamy przy zawijaniu tekstu.
*Domyślnie: **najpierw poprawka zgłoszona przez Ciebie** (zawijanie tekstu w GeneratorNPC), a sprzątanie martwych reguł od razu po niej, w tym samym pliku.*

---

## 13. Podsumowanie

**Aplikacja jest w dobrym stanie.** Nie znalazłem żadnego błędu, który psułby funkcję widoczną dla użytkownika — Twoje testy się zgadzają. Kod ma czytelną strukturę, dwujęzyczne komentarze, wydzieloną warstwę wspólną w `shared/` i zauważalną dyscyplinę w dokumentacji.

**Dwie rzeczy, które udało się potwierdzić na prawdziwych danych i które wypadły dobrze:**

- **Mechanizm przerabiania XLSX → JSON działa poprawnie.** Uruchomiłem obie niezależne implementacje na Twoim `Repozytorium.xlsx` i porównałem wynik z Twoim `data.json`: **zero różnic w wartościach komórek** w 1530 wierszach, identyczna kolejność zakładek i kolumn, identyczne słowniki cech i stanów.
- **Import do Firebase jest bez zarzutu.** Zawartość `firebase-import.json` po odczytaniu z powrotem odpowiada `data.json` co do znaku, a struktura nie zawiera kluczy zakazanych przez Firebase.

**Najpilniejsze trzy rzeczy:**

1. **Kanał Infoczytnika jest otwarty dla każdego** (rozdz. 9.3). To jedyne miejsce, gdzie widzę realną możliwość zaszkodzenia — ktoś z zewnątrz mógłby wysłać graczom dowolną treść w trakcie sesji. App Check to zamyka i jest to jedyne zabezpieczenie, jakiego tu potrzeba (rozdz. 9.4).
2. **DataVault przy każdym uruchomieniu próbuje pobrać bibliotekę, której nie ma** (rozdz. 3.1). Nieszkodliwe, ale to jednolinijkowa poprawka.
3. **Blok bramki dostępu wkleił się do szablonu karty NPC do druku** (rozdz. 5.1). Też jedna linia.

**Co do „śmieci po przeróbkach" — tak, jest ich sporo:** około 510 linii martwego kodu i martwego CSS, w tym cała nieużywana ścieżka czytania plików XLSX oraz 51 z 81 reguł szerokości kolumn w GeneratorNPC, które nie mają czego dotyczyć. Nic z tego nie szkodzi, ale wszystko utrudnia czytanie kodu i sprzyja przyszłym pomyłkom.

**Jedna rzecz, którą uważam za ważniejszą, niż wygląda:** dwie implementacje parsera XLSX **rozjeżdżają się w kolejności pól** dla arkuszy `Bronie` i `Bronie Pojazdów` — potwierdzone pomiarem. Różnica nie zmienia niczego, co widzi użytkownik, ale sprawia, że nie da się użyć zwykłego porównania obu plików jako testu zgodności — a właśnie takiego testu wymaga zasada 15 z `AGENTS.md`. To zmiana jednego wyrażenia w jednym miejscu i warto ją zrobić przed zapowiedzianym dodatkiem, bo dopiero wtedy sprzątanie w parserze da się sprawdzić automatycznie.

---

*Analiza wykonana 10 września 2026, uzupełniona o wyniki na prawdziwych danych po przesłaniu plików wsadowych. W kodzie aplikacji nie wprowadzono żadnych zmian.*
*Analiza siostrzana: `Analizy/responsywnosc-aplikacji-2026-09-10.html`*

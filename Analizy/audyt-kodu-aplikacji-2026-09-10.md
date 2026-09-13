# Audyt kodu aplikacji WrathAndGlory — 2026-09-10

> **UWAGA WSTĘPNA — ten plik trafia do repozytorium publicznego.**
> Repozytorium `CuteLittleGoat/WrathAndGlory` jest **publiczne** (sprawdzone przez API GitHuba: `"visibility": "public"`, `"has_pages": true`).
> Dlatego w rozdziale 9 (bezpieczeństwo bazy danych) **świadomie nie ma** gotowych poleceń, skryptów ani przykładów „jak to wykorzystać".
> Opisuję **co** jest odsłonięte i **jak to naprawić**, bez instrukcji nadużycia.
> Wszystkie fakty i tak wynikają wprost z plików, które w tym repozytorium są już jawne.
> Rozstrzygnięte 13 września (pytanie 6 w rozdz. 12.2): dokument zostaje w repozytorium publicznym.

---

## 1. Metryka

| | |
|---|---|
| **Data analizy** | 10 września 2026 · **uzupełnione 13 września** o Twoje odpowiedzi na pytania, prawdziwe reguły Firebase i sprostowanie rozdz. 9.2 |
| **Temat** | Audyt kodu: błędy, martwy kod, pozostałości po przeróbkach, duplikacja, bezpieczeństwo bazy danych |
| **Zakres** | Wszystkie moduły: `Main`, `DataVault`, `GeneratorNPC`, `Kalkulator`, `DiceRoller`, `GeneratorNazw`, `Infoczytnik`, `Audio`, `shared/` |
| **Poza zakresem** | `Main/Gilead.html` i `Main/Galaktyka.html` — pliki powstały poza tym projektem i decyzją właściciela repozytorium nie podlegają analizie. `WebView_FCM_Cloudflare_Worker/` (folder chroniony przed edycją wg `AGENTS.md` §17), `Kalkulator/Old/`, `WebView_FCM_Cloudflare_Worker/Archiwalne/`. Literówki w danych źródłowych (`DoZrobienia.md` poz. 2) — poprawiane ręcznie w `Repozytorium.xlsx`, patrz rozdz. 8 |
| **Metoda** | Odczyt kodu, analiza statyczna (ESLint 9 z regułami poprawnościowymi na wszystkich plikach `.js` oraz na skryptach osadzonych w HTML), skanowanie nieużywanych klas CSS, porównanie dwóch niezależnych implementacji parsera XLSX, sondowanie reguł dostępu do bazy oraz — za zgodą właściciela — jeden kontrolowany test zapisu do osobnego dokumentu, po którym nie została żadna pozostałość (rozdz. 9.2) |
| **Dane wejściowe** | `Repozytorium.xlsx`, `data.json`, `firebase-import.json` (przesłane 10 września) — użyte do porównania obu ścieżek generowania danych, rozdz. 7 |
| **Zmiany w kodzie** | **Żadne.** Ten dokument tylko opisuje i proponuje. |
| **Instrukcja wykonawcza** | `Analizy/instrukcja-appcheck-2026-09-13.md` — App Check krok po kroku, dla obu projektów Firebase |
| **Analiza siostrzana** | `Analizy/responsywnosc-aplikacji-2026-09-10.html` (responsywność, wygląd) |

### Główny wniosek

Potwierdzam Twoją obserwację: **aplikacja działa**. Nie znalazłem żadnego błędu, który psułby funkcję widoczną dla użytkownika w normalnym użyciu. Znalazłem natomiast:

- **1 usterkę pewną**, która na każdym uruchomieniu DataVault generuje nieudane pobranie pliku i czerwony błąd w konsoli (rozdz. 3.1),
- **4 usterki utajone** — kod, który dziś działa przez przypadek albo jest maskowany przez inną usterkę (rozdz. 3),
- **ok. 510 linii martwego kodu i martwego CSS**, w tym całą nieużywaną ścieżkę parsowania XLSX (rozdz. 4),
- **wyraźne pozostałości po przeróbkach**, w tym blok bramki dostępu wklejony przez pomyłkę do szablonu karty NPC do druku (rozdz. 5),
- **jeden potwierdzony rozjazd między dwiema implementacjami parsera** — zweryfikowany na Twoich prawdziwych plikach (rozdz. 7),
- **realny problem bezpieczeństwa bazy danych** — po otrzymaniu prawdziwych reguł okazał się **szerszy**, niż opisałem w pierwszej wersji: otwarte są oba projekty Firebase, a nie jeden, i potwierdziłem to nie tylko odczytem, ale i zapisem (rozdz. 9).

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

> **Wiadomość 11** (13 września — odpowiedzi na pytania z rozdz. 12)
>
> Poniżej moje odpowiedzi na pytania z Analizy/audyt-kodu-aplikacji-2026-09-10.md. Zapisz je w analizie, ale jeszcze bez zmian w kodzie.
>
> 1. [wklejona treść reguł wgranych w obu projektach Firebase — odtworzona poniżej co do struktury i uprawnień]
>
>    Projekt `wh40k-data-slate`:
>
>        rules_version = '2';
>        service cloud.firestore {
>          match /databases/{database}/documents {
>            match /dataslate/{document=**}         { allow read, write: if true; }
>            match /character_builder/{document=**} { allow read, write: if true; }
>            match /{document=**}                   { allow read, write: if false; }
>          }
>        }
>
>    Projekt `audiorpg-2eb6f`:
>
>        rules_version = '2';
>        service cloud.firestore {
>          match /databases/{database}/documents {
>            match /audio/favorites        { allow read, write: if true; }
>            match /generatorNpc/favorites { allow read, write: if true; }
>            match /DS2/progress           { allow read, write: if true; }
>            match /{document=**}          { allow read, write: if false; }
>          }
>        }
>
>    Projekt Dark Souls II został zakończony. Kolekcja została usunięta. Można to skasować w nowej wersji Rules.
> 2. Mam wątpliwości do wyróżniania różnic. Dwa talenty czy dwie psioniki zawsze będą się różnić pełnym tekstem. Może przy statystykach broni to ma sens, ale nie jestem przekonany — raczej skłaniam się ku usunięciu tej funkcjonalności, ale sprawdź to jeszcze raz.
> 3. Zgoda.
> 4. Zrobione.
> 5. Możesz robić testowe zapisy w Infoczytniku. Testowymi wpisami nic mi nie zepsujesz. W przyszłości planuję rozbudowę modułu o listę ulubionych.
> 6. Zostaw.
> 7. Ulubione w GeneratorNPC to dane testowe. Listy ulubionych są odtwarzalne, tylko czasochłonne.
> 8. Zgodnie z rekomendacją.
>
> Zmiany w kodzie będziemy wprowadzać dopiero jak odpowiem na wszystkie pytania i rozwiążemy wszystkie kwestie sporne z obu analiz.
>
> Zmodyfikowałem AGENTS.md — nie musisz już wrzucać plików do rozmowy ani pisać w analizie sekcji o zmianach w kodzie.
>
> Potrzebuję jeszcze pliku MD w Analizy/ z instrukcją krok po kroku, co i gdzie kliknąć, żeby ustawić App Check. Na obu kontach Firebase zakładka App Check jest pusta.

> **Wiadomość 12**
>
> Nie robimy jeszcze zmian w kodzie. Tylko analizy i przygotowanie app check.

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

> **Ostrożnie — `AGENTS.md` §14.** Ta zmiana dotyczy modułu DataVault i pliku związanego z parsowaniem XLSX. Formalnie wymaga porównania wyniku generowania danych przed i po. W praktyce ryzyko jest zerowe (usuwamy skrypt, który i tak zwraca 404), ale warto wykonać jedno kontrolne generowanie `data.json` z `Repozytorium.xlsx` i porównać z poprzednim plikiem.

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

**To jest jedyne miejsce w audycie, gdzie poprawka ZMIENI wygląd widoczny dla użytkownika.** Zaznaczam to wyraźnie, bo prosiłeś, żeby nie zmieniać działania widocznego z zewnątrz.

#### Rozstrzygnięcie po Twojej odpowiedzi (pytanie 2) — sprawdzone pomiarem

Napisałeś, że masz wątpliwość do podświetlania różnic (*„dwa talenty czy dwie psioniki zawsze będą się różnić pełnym tekstem […] raczej skłaniam się ku usunięciu tej funkcjonalności — ale sprawdź to jeszcze raz"*). Sprawdziłem na Twoich danych. **Okazuje się, że to są dwie osobne sprawy i mają dwie różne odpowiedzi.**

**Sprawa pierwsza — brak stylów. To jest usterka i trzeba ją naprawić niezależnie od decyzji o podświetlaniu.**

Zmierzyłem, jak okno wygląda dziś, na prawdziwym porównaniu dwóch broni boltowych:

| | Dziś (brak klasy `compareTable`) | Po nadaniu klasy |
|---|---|---|
| Odstęp wewnętrzny komórki | **1 px** (wartość domyślna przeglądarki) | 8 px |
| Odstęp między treścią sąsiednich kolumn | **2 px** | 16 px |
| Linia oddzielająca wiersze | **brak** | 1 px |
| Naprzemienne tła wierszy | brak | tak |

Skutek jest taki, że **treść sąsiednich kolumn skleja się w jeden ciąg znaków** — w zrzucie, który zrobiłem, w jednym wierszu widać „Szybkostrzelność1", a w drugim „PistoletBrutalna". To nie jest kwestia gustu, tylko nieczytelność. **Nadanie klasy `compareTable` naprawia to i nie ma nic wspólnego z podświetlaniem różnic.**

**Sprawa druga — podświetlanie różnic. Twoja intuicja jest trafna dla kolumn tekstowych i nietrafna dla kolumn liczbowych.**

Wziąłem 2258 realistycznych par do porównania — czyli takich, które ktoś rzeczywiście może chcieć zestawić: dwa wpisy z tej samej zakładki i tego samego `Typ`/`Rodzaj`. Policzyłem, jaki procent kolumn faktycznie się różni:

| Zakładka | Par | Kolumn różnych — ogółem | Kolumny krótkie (parametry) | Kolumny tekstowe (Opis, Efekt) |
|---|---:|---:|---:|---:|
| Bronie | 399 | 56% | **47%** | 81% |
| Pancerze | 76 | 57% | **44%** | 86% |
| Psionika | 216 | 57% | **39%** | 69% |
| Pojazdy | 753 | 65% | **49%** | 80% |
| Ekwipunek | 454 | 70% | **53%** | 94% |
| Talenty | 360 | 73% | **52%** | 94% |

Jak to czytać:

- **Miałeś rację co do talentów i psionik.** W kolumnach opisowych różni się 69–94% treści. Podświetlenie zapaliłoby prawie całą tabelę, więc nie niosłoby żadnej informacji — świecąca się cała kolumna mówi dokładnie tyle samo, co niepodświetlona.
- **Ale w kolumnach parametrycznych jest odwrotnie, niż zakładałeś.** Przy broniach różni się tylko 47% parametrów — czyli **ponad połowa jest identyczna**. Konkretny przykład z Twoich danych: pistolet boltowy i karabin boltowy mają identyczne *Rodzaj*, *Typ*, *Obrażenia* i *DK*, a różnią się zasięgiem, szybkostrzelnością i cechami. Tu podświetlenie mówiłoby dokładnie to, czego się szuka: „te cztery parametry są takie same, tymi trzema się różnią".
- **W żadnej z 2258 par nie różniły się wszystkie kolumny naraz.** Sytuacja „i tak wszystko będzie się różnić" nie wystąpiła ani razu.

#### Rekomendacja — trzy poziomy do wyboru

| Wariant | Co obejmuje | Uwaga |
|---|---|---|
| **(a) Minimum — zalecane bezwzględnie** | Nadać klasę `compareTable`. Usunąć nieużywaną regułę `.compareDiff` i klasę `diff` z generowanego HTML | Naprawia sklejone kolumny. Podświetlania nie ma — zgodnie z Twoją skłonnością. Ubywa martwego kodu |
| **(b) Minimum + podświetlanie tylko parametrów** | To co wyżej, plus podświetlenie różnic **wyłącznie w kolumnach krótkich** (bez *Opis*, *Efekt*, *Przykład*) | Wykorzystuje jedyny przypadek, w którym podświetlanie realnie pomaga — porównywanie broni i pojazdów |
| **(c) Wszystko jak było zamierzone** | Podświetlanie we wszystkich kolumnach | **Nie polecam** — w Talentach i Ekwipunku zapala 94% tabeli |

*Moja rekomendacja: **(a)**, bo to jest zgodne z Twoją decyzją i naprawia realną usterkę. Wariant (b) proponuję odłożyć jako osobny, drobny pomysł na później — nie jest to poprawka błędu, tylko nowa funkcja, a Ty świadomie zdecydowałeś, że tego nie chcesz.*

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

> **Ostrożnie — `AGENTS.md` §14** wymienia parsery XLSX jako obszar szczególnie wrażliwy i zabrania upraszczania ich „bez sprawdzenia, czy wynik generowania danych pozostaje identyczny". Dlatego **nie rekomenduję usunięcia tego bloku bez wykonania procedury z rozdz. 7.7**: wygenerować `data.json` z `Repozytorium.xlsx` przed zmianą, wykonać zmianę, wygenerować ponownie i porównać oba pliki bajt po bajcie. Jeśli są identyczne — usunięcie jest bezpieczne.

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

Rekomendacja: ujednolicić polską wersję z angielską i z HTML. **Zgoda otrzymana** (pytanie 3, rozdz. 12.2).

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

`AGENTS.md` §14 wymaga zgodności między generowaniem przez `build_json.py`, generowaniem przez aplikację w przeglądarce i strukturą importowaną do Firebase. Najpierw porównałem obie implementacje linia po linii w kodzie i sformułowałem trzy przewidywania. Po otrzymaniu Twoich plików **sprawdziłem je praktycznie**: uruchomiłem `build_json.py` na Twoim `Repozytorium.xlsx` i porównałem wynik z Twoim `data.json` (wygenerowanym przez aplikację w przeglądarce).

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

**Wpływ na możliwość sprawdzania: duży.** Dwa pliki `data.json` wygenerowane różnymi drogami nigdy nie będą identyczne, więc **nie da się użyć zwykłego porównania plików jako testu zgodności** — a właśnie takiego testu wymaga `AGENTS.md` §14. To jedyna rzecz, która dziś stoi na przeszkodzie, żeby taki test wprowadzić.

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

> **Drobiazg zauważony 13 września — numeracja w `AGENTS.md`.** Po Twojej porządkowej zmianie z 13 września sekcje idą w kolejności: … 14, 15, **17**, **16**. Punkt „Foldery chronione przed edycją" zachował dawny numer 17, a „Modyfikowanie plików AGENTS.md" dostał 16 — więc dwa ostatnie punkty są zamienione miejscami i jeden numer (17) wypada poza kolejnością. Nie ma to żadnego wpływu na działanie aplikacji i **nie mogę tego poprawić sam** (§16 zabrania mi edytowania `AGENTS.md`), ale zgłaszam, bo w `DoZrobienia.md` masz już pozycję 4 o sprawdzeniu tego pliku. W tym dokumencie odwołuję się do numerów tak, jak są dziś zapisane.

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

> **Aktualizacja z 13 września.** Przysłałeś treść reguł wgranych w obu projektach, więc ten rozdział nie opiera się już na wnioskowaniu z zewnątrz. Reguły potwierdziły część moich ustaleń i **obaliły jedno**, które opisałem błędnie — sprostowanie jest w 9.2. Poniżej to, co jest naprawdę wgrane, w skrócie:
>
> | Projekt | Ścieżka w regułach | Uprawnienia |
> |---|---|---|
> | `wh40k-data-slate` | `dataslate/{document=**}` | `allow read, write: if true` |
> | `wh40k-data-slate` | `character_builder/{document=**}` | `allow read, write: if true` |
> | `wh40k-data-slate` | wszystko pozostałe | odmowa |
> | `audiorpg-2eb6f` | `audio/favorites` | `allow read, write: if true` |
> | `audiorpg-2eb6f` | `generatorNpc/favorites` | `allow read, write: if true` |
> | `audiorpg-2eb6f` | `DS2/progress` | `allow read, write: if true` — projekt Dark Souls II zakończony, kolekcja skasowana |
> | `audiorpg-2eb6f` | wszystko pozostałe | odmowa |
>
> Czyli Twoje pierwotne zdanie — *„wszystkie »Rules« mam ustawione jako allow write wszędzie"* — było **trafne co do istoty**: wszystkie ścieżki, z których aplikacja faktycznie korzysta, są otwarte dla każdego. Nietrafne było tylko słowo „wszędzie": poza tymi ścieżkami reguły odmawiają dostępu, i **Realtime Database, w której leży cały DataVault, jest zamknięta naprawdę**.

### 9.2. Jak to sprawdziłem — metoda, sprostowanie i test zapisu

Nie poprzestałem na przeczytaniu pliku z regułami, bo plik w repozytorium może się różnić od tego, co jest naprawdę wgrane do Firebase. Wykonałem test praktyczny.

**Metoda.** Poprosiłem bazę — z zewnątrz, bez żadnego logowania — o **dokument, który na pewno nie istnieje**. Firestore odpowiada wtedy inaczej w zależności od reguł:

- reguła **zabrania** dostępu → odpowiedź `403`,
- reguła **pozwala** → odpowiedź `404` (dostęp przyznany, tylko dokumentu nie ma).

Dzięki temu odpowiedź jest jednoznaczna, a **żadne prawdziwe dane nie zostały pobrane**.

#### 🔺 Sprostowanie mojego wcześniejszego błędu

W pierwszej wersji tego rozdziału napisałem, że projekt `audiorpg-2eb6f` **odrzuca zapytania z zewnątrz**, i podałem dwa możliwe wyjaśnienia (wymóg logowania albo ograniczenie klucza API). **To było błędne** i chcę wprost powiedzieć, na czym polegał mój błąd, bo prowadził do zaniżenia wagi problemu.

Metoda z pytaniem o *nieistniejący* dokument ma pułapkę, której wtedy nie uwzględniłem: **działa tylko wtedy, gdy reguła obejmuje całą kolekcję.** Reguły w projekcie `audiorpg-2eb6f` są napisane pod **konkretne dokumenty** (`match /audio/favorites`), a nie pod kolekcję (`match /audio/{document=**}`). Zapytanie o `audio/cokolwiek-innego` nie pasuje więc do żadnej reguły i dostaje `403` — nie dlatego, że dostęp wymaga logowania, tylko dlatego, że pytałem o dokument, którego żadna reguła nie opisuje.

Gdy zapytałem o **prawdziwe** ścieżki, odpowiedź była jednoznaczna.

**Wyniki — stan zweryfikowany 13 września, bez żadnego logowania:**

| Projekt | Zapytanie | Odpowiedź | Wniosek |
|---|---|---|---|
| `wh40k-data-slate` | `dataslate/current` | `200` | **odczyt otwarty dla każdego** |
| `wh40k-data-slate` | `character_builder/current` | `200` | **odczyt otwarty dla każdego** |
| `wh40k-data-slate` | `character_builder/v2` | `200` | **odczyt otwarty dla każdego** |
| `wh40k-data-slate` | `dataslate/dokument-nieistniejący` | `404` | reguła obejmuje całą kolekcję — dostęp przyznany |
| `wh40k-data-slate` | kolekcja spoza reguł (test kontrolny) | `403` | zabroniony — metoda działa poprawnie |
| `audiorpg-2eb6f` | `audio/favorites` | **`200`** | **odczyt otwarty dla każdego** |
| `audiorpg-2eb6f` | `generatorNpc/favorites` | **`200`** | **odczyt otwarty dla każdego** |
| `audiorpg-2eb6f` | `DS2/progress` | `404` | reguła nadal jest, ale dokument już skasowany |
| `audiorpg-2eb6f` | `audio/dokument-nieistniejący` | `403` | ← **to jest ten wynik, który mnie wcześniej zmylił** |
| `wh40k-data-slate` — **Realtime Database** | `datavault/live` | `401` „Permission denied" | **wymaga zalogowania — zamknięte poprawnie** |

**Czyli oba projekty są otwarte, nie jeden.** Ulubione zestawy GeneratorNPC i ustawienia modułu Audio są dziś dostępne dla każdego, kto zna identyfikator projektu.

#### Test zapisu — wykonany, bo pozwoliłeś (pytanie 5)

W pierwszej wersji zapisałem, że zapisu nie testuję i że „skoro odczyt działa, zapis niemal na pewno też". Zgodziłeś się na kontrolowany test, więc zamieniłem to przypuszczenie na dowód.

**Co dokładnie zrobiłem — bez logowania, z zewnątrz:**

| Krok | Operacja | Odpowiedź |
|---|---|---|
| 1 | Utworzenie dokumentu `dataslate/audyt-test-2026-09-13` | `200` — **utworzony** |
| 2 | Odczytanie go z powrotem | `200` — treść zgodna z zapisaną |
| 3 | Skasowanie go | `200` — **skasowany** |
| 4 | Sprawdzenie, że zniknął | `404` — potwierdzone |
| 5 | Sprawdzenie, że `dataslate/current` jest nietknięty | `200`, data ostatniej zmiany nadal 6 czerwca 2026 |

**Wniosek jest teraz twardy, a nie prawdopodobny: dowolna osoba z internetu może w Twojej bazie utworzyć, odczytać, nadpisać i skasować dokument — bez logowania i bez żadnej przeszkody.**

Test celowo dotyczył **osobnej nazwy dokumentu**, z której aplikacja nie korzysta. Infoczytnik nasłuchuje wyłącznie `dataslate/current`, więc na żadnym ekranie nic się nie pojawiło, a produkcyjny dokument nie został dotknięty — potwierdza to niezmieniona data jego ostatniej modyfikacji. Po teście nie została żadna pozostałość.

### 9.3. Co z tego wynika

#### 🟢 Dobra wiadomość — dane DataVault są chronione naprawdę

Baza Realtime Database, w której leży cały `datavault/live` (czyli wszystkie arkusze z `Repozytorium.xlsx`), **odrzuca odczyt bez zalogowania** (`401`). Mechanizm „Litanii Dostępu" nie jest ozdobą — to prawdziwa bramka oparta na Firebase Authentication. Ten kawałek jest zrobiony dobrze i nie wymaga zmian.

#### 🟠 Zła wiadomość — projekt `audiorpg-2eb6f` jest otwarty tak samo

**To jest miejsce, w którym się wcześniej pomyliłem** (sprostowanie w 9.2). Ulubione zestawy GeneratorNPC (`generatorNpc/favorites`) i ustawienia modułu Audio (`audio/favorites`) odpowiadają `200` bez żadnego logowania — czyli są otwarte dla każdego do odczytu i zapisu, dokładnie tak jak dokumenty w drugim projekcie.

Rozwiązuje się przy okazji zagadka, którą wtedy zgłosiłem: pytałem, jak GeneratorNPC loguje się do tego projektu, skoro w kodzie nie widać żadnego logowania. Odpowiedź brzmi: **nie loguje się wcale i nie musi** — reguły nikogo o to nie pytają.

Waga jest tu niższa niż przy Infoczytniku, bo chodzi o listy ulubionych, a nie o treść wyświetlaną graczom na żywo — i potwierdziłeś, że ulubione w GeneratorNPC to dane testowe, a listy da się odtworzyć (pytanie 7). Ale rozwiązanie jest to samo i wykonuje się je równolegle: **App Check w obu projektach**.

#### 🔴 Zła wiadomość — kanał Infoczytnika jest otwarty dla każdego

Reguła `match /dataslate/{document=**} { allow read, write: if true; }` **wpuszcza każdego, bez logowania** — potwierdzone i odczytem (`200`), i zapisem (rozdz. 9.2).

Co to jest: `dataslate/current` to jeden dokument, przez który panel GM przekazuje treść na ekran Infoczytnika. Panel zapisuje (`GM_test.html:508` — `currentRef.set(getPayload(type), {merge:false})`), a ekran gracza nasłuchuje na żywo (`Infoczytnik_test.html:223` — `ref.onSnapshot(...)`).

Konsekwencje, uszeregowane wg wagi:

1. **🔴 Podszycie się pod MG.** Osoba z zewnątrz może nadpisać ten dokument — **to nie jest już przypuszczenie, tylko rzecz sprawdzona** (test zapisu w 9.2). Ponieważ ekran gracza nasłuchuje na żywo, dowolna treść pojawiłaby się **natychmiast na ekranie w trakcie sesji**. Zapis używa `{merge:false}`, czyli nadpisuje całość — więc równie dobrze można wyczyścić to, co MG właśnie wysłał.
2. **🟠 Podgląd tego, co MG wysyła.** Każdy, kto zna identyfikator projektu (a jest on jawny w repozytorium — i tak być musi), może odczytywać treści przekazywane graczom.
3. **🟡 Koszty.** Otwarta kolekcja pozwala dowolnej osobie generować odczyty i zapisy bez ograniczenia. Na darmowym planie skończy się to zablokowaniem po przekroczeniu limitu.

#### 🟠 Kreatory postaci są otwarte dla każdego

`character_builder/current` (Prosty Kreator) i `character_builder/v2` (Zaawansowany Kreator) odpowiadają `200` — wgrana reguła obejmuje całą kolekcję `character_builder` i brzmi `allow read, write: if true`.

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

**Potwierdzone po otrzymaniu prawdziwych reguł.** Rozbieżności są trzy i idą w obie strony:

| Co | W repozytorium (`Kalkulator/config/firestore.rules`) | Naprawdę wgrane |
|---|---|---|
| Kreatory postaci | trzy osobne dokumenty: `character_builder/current`, `character_builder/v2`, `character_builder/test-v2` | **cała kolekcja**: `character_builder/{document=**}` — czyli szerzej, niż mówi plik |
| Kanał Infoczytnika | **brak jakiejkolwiek wzmianki** | `dataslate/{document=**}`, otwarte dla każdego |
| Drugi projekt (`audiorpg-2eb6f`) | **brak pliku w ogóle** | trzy reguły dokumentowe, w tym jedna po skasowanym projekcie Dark Souls II |

Najgroźniejszy jest wiersz drugi: **najbardziej wrażliwa reguła w całej aplikacji nie istnieje w żadnym pliku w repozytorium.** Ktoś, kto chciałby sprawdzić stan zabezpieczeń, czytając kod, dostałby obraz bezpieczniejszy niż rzeczywisty.

To jest problem sam w sobie, niezależny od bezpieczeństwa: nie ma jednego, wersjonowanego, kompletnego pliku reguł. Nie da się przejrzeć historii zmian ani odtworzyć stanu po pomyłce. Rekomendacja: przenieść **pełny, aktualny** zestaw reguł obu projektów do repozytorium (proponowane miejsca: `shared/firestore-wh40k-data-slate.rules` i `shared/firestore-audiorpg.rules`) i od tej pory zmieniać je tylko przez ten plik.

### 9.7. Trzy rzeczy, które warto od razu odkłamać

**„Klucz `apiKey` jest w publicznym repozytorium — to wyciek, trzeba go pilnie zmienić."**
Nie. `apiKey` w Firebase **z założenia jest jawny** — musi być w kodzie strony, żeby przeglądarka mogła się połączyć. To nie jest hasło, tylko identyfikator projektu. Google projektuje to celowo. Zmiana klucza **niczego nie poprawi**, a popsuje działającą aplikację. Problemem nie jest jawny klucz, tylko reguły.

**„Ograniczenie klucza API do mojej domeny wystarczy."**
Nie. Ograniczenie sprawdza nagłówek `Referer`, który wysyła przeglądarka — a więc coś, co nadawca w pełni kontroluje. To utrudnienie, nie zabezpieczenie. Prawdziwą odpowiedź na pytanie „czy to zapytanie przyszło z mojej aplikacji" daje dopiero App Check.

**„Repozytorium jest publiczne, więc dlatego dane są odsłonięte."**
Nie. Nawet w prywatnym repozytorium `apiKey` i identyfikator projektu byłyby widoczne w kodzie strony u każdego użytkownika. Publiczne repozytorium **ułatwia** znalezienie projektu i pokazuje strukturę bazy, ale **nie jest przyczyną**. Przyczyną są reguły.

### 9.8. Co dokładnie zrobić — plan

> **Instrukcja krok po kroku jest w osobnym pliku:** `Analizy/instrukcja-appcheck-2026-09-13.md`. Ten rozdział mówi *co* i *dlaczego*; tamten plik mówi *gdzie kliknąć*, ekran po ekranie, dla obu projektów.

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

DataVault czyta dane z **Realtime Database**, nie z Firestore. App Check ma dla niej osobny przełącznik wymuszania. Jeżeli włączysz wymuszanie tylko dla Firestore, DataVault zostanie poza ochroną. W zakładce **App Check → APIs** trzeba więc włączyć wymuszanie dla `Cloud Firestore` **i** `Realtime Database` — ale **tylko w projekcie `wh40k-data-slate`**. Projekt `audiorpg-2eb6f` nie ma Realtime Database i pozycja ta się tam nie pojawi; to nie jest usterka.

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

Dla projektu **`audiorpg-2eb6f`** — teraz już nie szkielet, tylko komplet, bo znam wgrane reguły:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function zAplikacji() { return request.app != null; }

    // Ulubione zestawy GeneratorNPC / GeneratorNPC favourite sets
    match /generatorNpc/favorites { allow read, write: if zAplikacji(); }

    // Ustawienia modułu Audio / Audio module settings
    match /audio/favorites        { allow read, write: if zAplikacji(); }

    // Reguła dla DS2/progress usunięta — projekt Dark Souls II zakończony,
    // kolekcja skasowana (potwierdzone: dokument zwraca 404).
    // The DS2/progress rule is gone — the Dark Souls II project is finished
    // and its collection was deleted (verified: the document returns 404).

    match /{document=**} { allow read, write: if false; }
  }
}
```

Zmiany wobec dzisiejszego stanu, poza samym App Check:

- **`dataslate` zawężone do dokumentu `current`** zamiast całej kolekcji — to jedyny dokument, którego aplikacja używa. Warto zrobić to od razu: mój test zapisu z rozdz. 9.2 utworzył dokument o innej nazwie w tej samej kolekcji właśnie dlatego, że dzisiejsza reguła na to pozwala.
- **`character_builder` zawężone do dwóch konkretnych dokumentów** (`current` i `v2`) zamiast całej kolekcji. Reguła dla `character_builder/test-v2` z pliku w repozytorium nie jest w ogóle wgrana i nie ma po niej śladu w kodzie (rozdz. 8) — nie przenoszę jej.
- **`DS2/progress` usunięte** — zgodnie z Twoją informacją, że projekt Dark Souls II został zakończony, a kolekcja skasowana. Sprawdziłem: dokument zwraca `404`, więc reguła nie ma już czego chronić.
- **Realtime Database bez zmian w regułach** — jest zamknięta poprawnie (wymaga zalogowania). Dochodzi jej tylko wymuszanie App Check, i to **wyłącznie w projekcie `wh40k-data-slate`**, bo tylko on ma tę bazę.

> **Uwaga o kolejności zawężania.** Zawężenie reguł można zrobić **od razu, przed App Check** — samo w sobie niczego nie psuje, bo aplikacja i tak korzysta wyłącznie z tych trzech dokumentów. Dopiero dopisanie `request.app != null` musi poczekać na kroki 1–5 poniżej. Jeżeli chcesz zmniejszyć ryzyko już dziś, jednym ruchem: zamień `{document=**}` na konkretne nazwy dokumentów i skasuj `DS2/progress`, zostawiając na razie `if true`.

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

> **Zamknięte 13 września (pytanie 7).** Potwierdziłeś, że ulubione w GeneratorNPC to dane testowe, a listy ulubionych są odtwarzalne — tylko czasochłonne. Rozdział zostaje jako opis stanu, ale **nie proponuję tu żadnego działania**.

Odnotowuję, bo w analizie dla `Karty` uznałeś ochronę przed przypadkowym skasowaniem za cel nadrzędny, a tutaj sytuacja jest inna:

| Dane | Czy da się je odtworzyć po skasowaniu |
|---|---|
| `datavault/live` (Realtime Database) | **TAK** — źródłem jest `Repozytorium.xlsx` na Twoim dysku; wystarczy wygenerować `firebase-import.json` i zaimportować ponownie |
| `character_builder/current`, `character_builder/v2` | **NIE** — arkusze postaci istnieją tylko w bazie |
| `generatorNpc/favorites` | **częściowo** — GeneratorNPC ma zapas w pamięci przeglądarki (`loadFavoritesFromLocal`), ale tylko na tym urządzeniu, na którym były zapisane |
| `audio/favorites` | **NIE** |
| `dataslate/current` | nieistotne — to bufor bieżącej wiadomości |

Czyli największa i najcenniejsza część danych (DataVault) **jest odtwarzalna z pliku XLSX** — i to jest bardzo dobra własność tej architektury, warta świadomego utrzymania. Nieodtwarzalne są arkusze postaci i ulubione, ale potwierdziłeś, że są to dane testowe i odtwarzalne ręcznie — więc przycisku kopii zapasowej nie proponuję.

### 9.11. Uwaga na marginesie — sekret usunięty z plików, ale nie z historii

> **Zamknięte 13 września (pytanie 4).** Potwierdziłeś, że `TRIGGER_TOKEN` został zmieniony w panelu Cloudflare. Stara wartość w historii repozytorium przestała cokolwiek otwierać. Rozdział zostaje jako opis mechanizmu, ale **nie jest już zadaniem do wykonania**.

Przy okazji przeglądania repozytorium sprawdziłem stan pliku `WebView_FCM_Cloudflare_Worker/TRIGGER_TOKEN`, o którym mowa w starszej analizie `Analizy/KonfiguracjaCloudflareAudio.md`.

**Dobra wiadomość:** plik zawiera dziś **wartość zastępczą**, nie prawdziwy token. Zalecenie z tamtej analizy zostało wykonane — zatwierdzenie `773828e` („Bezpieczenstwo: usun jawny TRIGGER_TOKEN z plikow repozytorium").

**Ale jest jedna rzecz, o której łatwo zapomnieć.** Git przechowuje **całą historię** zmian. Sprawdziłem: ten plik ma w historii dwie różne wersje zawartości — czyli poprzednią, prawdziwą wartość **nadal da się odczytać** z historii repozytorium, a repozytorium jest publiczne. Usunięcie sekretu z bieżącej wersji plików **nie usuwa go z przeszłości**.

Praktyczny wniosek jest prosty i dotyczy każdego sekretu, który kiedykolwiek trafił do repozytorium publicznego:

> **Jedyne, co naprawdę pomaga, to zmiana wartości sekretu po stronie usługi.** Sprzątanie pliku jest potrzebne, żeby nie powielać błędu, ale samo z siebie nic nie odwraca.

`TRIGGER_TOKEN` **został zmieniony w panelu Cloudflare** — potwierdziłeś to 13 września. Stara wartość zapisana w historii repozytorium przestała więc cokolwiek otwierać i sprawa jest zamknięta. Ten akapit zostaje jako opis mechanizmu: usunięcie sekretu z pliku nigdy nie usuwa go z przeszłości repozytorium — jedyne, co naprawdę zamyka sprawę, to nadanie nowej wartości po stronie usługi.

To samo dotyczy pliku `WebView_FCM_Cloudflare_Worker/google-services.json`, który jest śledzony przez gita. W jego przypadku nie ma powodu do niepokoju: zawiera te same jawne z założenia identyfikatory projektu co `firebase-config.js` (patrz 9.7) — nie jest to sekret.

> **Zastrzeżenie.** Folder `WebView_FCM_Cloudflare_Worker/` jest oznaczony w `AGENTS.md` §17 jako chroniony przed edycją, więc niczego w nim nie zmieniałem ani nie proponuję zmieniać. Powyższe to wyłącznie informacja.

### 9.12. Podsumowanie rozdziału prostym językiem

Baza danych ma dwa wejścia. Pierwsze to panel Firebase Console, do którego wchodzisz loginem i hasłem Google — to wejście jest zamknięte prawidłowo. Drugie to takie, z którego korzysta sama aplikacja w przeglądarce gracza. Żeby aplikacja działała, adres tego wejścia musi być zapisany w kodzie strony, więc każdy może go odczytać. To normalne i tak ma być.

Sprawdziłem, co się dzieje, gdy ktoś podejdzie do tego drugiego wejścia bez logowania:

- do **danych DataVault** (arkusze z Repozytorium) — **nie wejdzie**, bramka działa,
- do **ulubionych GeneratorNPC i ustawień Audio** — **wejdzie bez przeszkód**; wcześniej napisałem tu odwrotnie i była to pomyłka, którą prostuję w rozdz. 9.2,
- do **arkuszy postaci z obu kreatorów** — **wejdzie i może je zmienić**,
- do **kanału, przez który MG wysyła treść na ekran Infoczytnika** — **wejdzie, może podejrzeć i może wysłać graczom dowolną treść w trakcie sesji**.

Ostatni punkt nie jest już przypuszczeniem: wykonałem kontrolowany test zapisu (za Twoją zgodą) i **utworzenie, odczytanie i skasowanie dokumentu w tej bazie z zewnątrz, bez logowania, udało się w całości** (rozdz. 9.2). To jest jedyne miejsce, które uważam za wymagające reakcji. Reszta to porządki.

Rozwiązanie, o które pytasz — App Check — jest właściwe i wystarczające dla tego zastosowania. Trzeba je tylko wdrożyć w **odpowiedniej kolejności**, bo zrobione odwrotnie wyłączy całą aplikację wszystkim naraz.

---

## 10. Ryzyka

| Ryzyko | Waga | Jak je ograniczyć |
|---|---|---|
| **Włączenie App Check w złej kolejności wyłączy całą aplikację** wszystkim naraz | 🔴 wysoka | Trzymać się kolejności z rozdz. 9.8. Zapamiętać ścieżkę do przycisku **Unenforce** — to hamulec bezpieczeństwa całej operacji |
| **Usunięcie ścieżki SheetJS bez porównania wyniku** narusza `AGENTS.md` §14 | 🟠 średnia | Wykonać procedurę z rozdz. 7.7 — pliki wejściowe są już dostępne, punkt odniesienia policzony |
| **Wydzielenie wspólnych funkcji formatujących** zmieni wygląd tekstu w dwóch modułach naraz — trzy udokumentowane rozjazdy trzeba świadomie rozstrzygnąć | 🟠 średnia | Najpierw ustalić, która wersja jest właściwa (rozdz. 6.1), potem porównać wynik na kilkunastu rekordach przed i po |
| **Poprawka okna porównania (3.5) zmieni wygląd widoczny dla użytkownika** | 🟡 niska | **Ustalone:** style naprawiamy (sklejone kolumny to usterka), podświetlania różnic nie dodajemy — rozdz. 3.5 |
| **Ujednolicenie napisu „Brak danych" (5.5) zmieni widoczny tekst** | 🟡 niska | **Ustalone:** zgoda otrzymana |
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

> **Odblokowane.** Pliki `Repozytorium.xlsx` i `data.json` otrzymałem 10 września, porównanie obu ścieżek generowania jest wykonane (rozdz. 7). Warunek z `AGENTS.md` §14 da się teraz spełnić.

| # | Co | Warunek |
|---|---|---|
| B1 | Usunąć nieużywaną ścieżkę SheetJS (~170 linii) | wykonać procedurę z 7.7 |
| B2 | Ujednolicić kolejność scalania kolumn (7.2) — **potwierdzona różnica** | j.w.; dopiero to umożliwi test „porównaj oba pliki" |
| B3 | Ujednolicić `norm()` w trzech miejscach (7.3) — dziś nieaktywne, ale to mina | j.w. |
| B4 | Usunąć 51 martwych reguł `min-col-*` | wykonać razem z etapem 1 analizy responsywności, żeby raz przejrzeć ten plik |

### Etap C — bezpieczeństwo bazy (~1–2 dni robocze rozłożone na kilka dni kalendarzowych)

| # | Co | Uwaga |
|---|---|---|
| C1 | ✅ **Zrobione** — reguły obu projektów otrzymane 13 września (rozdz. 9.1). Zostaje przeniesienie ich do repozytorium jako kompletnych plików | warunek wstępny spełniony |
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

Uzupełnienia z 13 września są w rozdz. 12.3.

### 12.2. Odpowiedzi na pytania — stan na 13 września

Wszystkie osiem pytań ma odpowiedź. Poniżej Twoja decyzja i to, co zrobiłem albo zrobię w konsekwencji.

**Pytanie 1 — reguły obu projektów Firebase → ✅ ODPOWIEDZIANE**

Przysłałeś pełną treść reguł z obu projektów. To zmieniło ten rozdział istotnie:

- potwierdziło otwarty kanał Infoczytnika i otwarte kreatory postaci,
- **obaliło moje twierdzenie**, że projekt `audiorpg-2eb6f` odrzuca obcych — jest otwarty tak samo (sprostowanie i przyczyna mojej pomyłki: rozdz. 9.2),
- pozwoliło napisać **kompletne** proponowane reguły dla obu projektów zamiast szkieletu (rozdz. 9.8),
- ujawniło trzecią rozbieżność między repozytorium a stanem wgranym (rozdz. 9.6).

Dopisałeś też: *„Projekt Dark Souls II został zakończony. Kolekcja została usunięta. Można to skasować w nowej wersji Rules."* — sprawdziłem, `DS2/progress` zwraca `404`, więc reguła nie ma już czego chronić. Usunięta z propozycji w 9.8.

**Pytanie 2 — okno „Porównaj zaznaczone" → ✅ ODPOWIEDZIANE, z jednym uściśleniem**

Skłaniałeś się ku usunięciu podświetlania różnic i poprosiłeś, żebym sprawdził to jeszcze raz. Sprawdziłem na 2258 realistycznych parach z Twoich danych. Wynik: **Twoja intuicja jest trafna dla kolumn opisowych** (w Talentach i Ekwipunku różni się 94% treści, więc podświetlenie zapaliłoby prawie całą tabelę), **ale nietrafna dla kolumn parametrycznych** (przy broniach ponad połowa parametrów jest identyczna).

Osobno wyszło coś, o czym wcześniej nie wiedziałem: **okno ma dziś realną usterkę czytelności niezależną od podświetlania** — treść sąsiednich kolumn dzieli 2 px i nie ma żadnej linii, więc napisy się sklejają („Szybkostrzelność1", „PistoletBrutalna"). Pełne wyliczenia, tabela z pomiarami i trzy warianty do wyboru: rozdz. 3.5. **Rekomendacja zgodna z Twoją decyzją: naprawić style, podświetlanie usunąć.**

**Pytanie 3 — komunikat „Brak danych" w DataVault → ✅ ZGODA**

Ujednolicam polski komunikat z angielskim, czyli dopisuję informację o konieczności zalogowania. Zmiana wyłącznie w treści napisu.

**Pytanie 4 — token `TRIGGER_TOKEN` → ✅ ZROBIONE**

Potwierdziłeś, że token został zmieniony w panelu Cloudflare. To zamyka najpilniejszą pozycję z całego dokumentu. Rozdz. 9.11 zostaje jako opis stanu, ale nie jest już zadaniem do wykonania.

**Pytanie 5 — test zapisu do bazy → ✅ ZGODA, TEST WYKONANY**

Napisałeś: *„Możesz robić testowe zapisy w Infoczytniku. […] testowymi wpisami nic mi nie zepsujesz."* Wykonałem test w minimalnej możliwej formie: utworzenie osobnego dokumentu, odczyt, skasowanie, sprawdzenie, że zniknął, i sprawdzenie, że produkcyjny `dataslate/current` jest nietknięty. **Wszystkie cztery operacje udały się bez logowania.** Przebieg i wyniki: rozdz. 9.2.

Test celowo nie dotknął dokumentu `current`, więc na ekranie Infoczytnika nic się nie pojawiło. Po teście nie została żadna pozostałość.

Wspomniałeś też o planach rozbudowy Infoczytnika o listę ulubionych (jest to teraz punkt 5 w `DoZrobienia.md`). Uwaga do tamtej pracy, wynikająca z tego audytu: **listy ulubionych będą kolejnymi dokumentami w kolekcji `dataslate`** — warto zaprojektować dla nich nazwy zanim zawęzimy reguły do samego `current`, żeby nie trzeba było wracać do reguł dwa razy.

**Pytanie 6 — czy dokument ma zostać w publicznym repozytorium → ✅ ZOSTAJE**

Wybrałeś wariant (a). Odnotowuję jedno: dokument opisuje teraz nie tylko *że* baza jest otwarta, ale też *sprawdzony* sposób, w jaki to potwierdziłem. Celowo nie ma tu gotowych poleceń do skopiowania. Po wykonaniu etapu C problem i tak przestaje istnieć — a to jest argument, żeby etapu C nie odkładać.

**Pytanie 7 — kopia zapasowa danych → ✅ NIEPOTRZEBNA**

Potwierdziłeś, że ulubione w GeneratorNPC to dane testowe, a listy ulubionych są odtwarzalne — tylko czasochłonne. Zamykam temat: **nie proponuję przycisku kopii zapasowej.** Rozdz. 9.10 zostaje jako informacja, że taka luka istnieje, ale bez rekomendacji działania.

**Pytanie 8 — kolejność prac → ✅ ZGODNIE Z REKOMENDACJĄ**

Najpierw poprawka zgłoszona przez Ciebie (zawijanie tekstu w GeneratorNPC), a sprzątanie 51 martwych reguł szerokości kolumn od razu po niej, w tym samym pliku.

### 12.3. Ustalenia dodatkowe z 13 września

| # | Sprawa | Ustalenie |
|---|---|---|
| 8 | Moment rozpoczęcia zmian w kodzie | *„Zmiany w kodzie będziemy wprowadzać dopiero jak odpowiem na wszystkie pytania i rozwiążemy wszystkie kwestie sporne z obu analiz."* — **nadal wstrzymane** |
| 9 | `AGENTS.md` — dawna zasada 12 | **Usunięta.** Nie dopisuję już do plików analiz sekcji „Zmiany wykonane w kodzie". Usunięta też zasada o zapisywaniu plików „w rozmowie" |
| 10 | Instrukcja App Check | Utworzona jako osobny plik: `Analizy/instrukcja-appcheck-2026-09-13.md` — krok po kroku, dla obu projektów, bo w obu kontach zakładka App Check jest pusta |
| 11 | `DoZrobienia.md` | Rozszerzony o punkty 4–14, w tym listy ulubionych w Infoczytniku (poz. 5), audyt trzech repozytoriów z wersją demo (poz. 6 i 8) oraz ukrycie przełącznika języka (poz. 13) |

> **Uwaga do punktu 13 z `DoZrobienia.md`.** Zapowiadasz ukrycie przełącznika języka we wszystkich modułach tego repozytorium. Ma to wpływ na dwie pozycje tego audytu: pytanie 3 (komunikat „Brak danych") i rozdz. 5.5 (napisy niezgodne między HTML a tłumaczeniami). Jeżeli w tym repozytorium zostaje wyłącznie polski, to **rozbieżności w tłumaczeniach angielskich przestają być widoczne dla użytkownika** — ale nadal będą widoczne w repozytoriach z wersją demo, gdzie przełącznik ma być domyślnie po angielsku (poz. 13). Czyli: poprawić warto, ale priorytet przenosi się z tego repozytorium na tamte.

### 12.4. Kwestie nadal otwarte

Zostały **dwie**, obie wymagające tylko Twojej decyzji, nie dodatkowych ustaleń:

1. **Wariant A czy B dla opisu kolumn w DataVault** — rozpisany na Twoją prośbę w `Analizy/responsywnosc-aplikacji-2026-09-10.html`, rozdz. 12.6. To decyzja, która wpływa na kolejność prac przed dodatkiem.
2. **Czy zawęzić reguły Firestore od razu, czy dopiero razem z App Check** — zawężenie (`{document=**}` → konkretne dokumenty, skasowanie `DS2/progress`) można zrobić dziś, bez ryzyka i bez zmian w kodzie. Dopisanie `request.app != null` musi poczekać na kroki 1–5 z instrukcji. Szczegóły w rozdz. 9.8.

---

## 13. Podsumowanie

**Aplikacja jest w dobrym stanie.** Nie znalazłem żadnego błędu, który psułby funkcję widoczną dla użytkownika — Twoje testy się zgadzają. Kod ma czytelną strukturę, dwujęzyczne komentarze, wydzieloną warstwę wspólną w `shared/` i zauważalną dyscyplinę w dokumentacji.

**Dwie rzeczy, które udało się potwierdzić na prawdziwych danych i które wypadły dobrze:**

- **Mechanizm przerabiania XLSX → JSON działa poprawnie.** Uruchomiłem obie niezależne implementacje na Twoim `Repozytorium.xlsx` i porównałem wynik z Twoim `data.json`: **zero różnic w wartościach komórek** w 1530 wierszach, identyczna kolejność zakładek i kolumn, identyczne słowniki cech i stanów.
- **Import do Firebase jest bez zarzutu.** Zawartość `firebase-import.json` po odczytaniu z powrotem odpowiada `data.json` co do znaku, a struktura nie zawiera kluczy zakazanych przez Firebase.

**Najpilniejsze trzy rzeczy:**

1. **Kanał Infoczytnika jest otwarty dla każdego** (rozdz. 9.3) — i po teście zapisu z 13 września nie jest to już przypuszczenie, tylko rzecz sprawdzona: z zewnątrz, bez logowania, udało się w tej bazie utworzyć, odczytać i skasować dokument. To jedyne miejsce, gdzie widzę realną możliwość zaszkodzenia — ktoś z zewnątrz może wysłać graczom dowolną treść w trakcie sesji. App Check to zamyka i jest to jedyne zabezpieczenie, jakiego tu potrzeba (rozdz. 9.4), a kroki wykonawcze są w `Analizy/instrukcja-appcheck-2026-09-13.md`.
2. **DataVault przy każdym uruchomieniu próbuje pobrać bibliotekę, której nie ma** (rozdz. 3.1). Nieszkodliwe, ale to jednolinijkowa poprawka.
3. **Blok bramki dostępu wkleił się do szablonu karty NPC do druku** (rozdz. 5.1). Też jedna linia.

**Co do „śmieci po przeróbkach" — tak, jest ich sporo:** około 510 linii martwego kodu i martwego CSS, w tym cała nieużywana ścieżka czytania plików XLSX oraz 51 z 81 reguł szerokości kolumn w GeneratorNPC, które nie mają czego dotyczyć. Nic z tego nie szkodzi, ale wszystko utrudnia czytanie kodu i sprzyja przyszłym pomyłkom.

**Jedna rzecz, którą uważam za ważniejszą, niż wygląda:** dwie implementacje parsera XLSX **rozjeżdżają się w kolejności pól** dla arkuszy `Bronie` i `Bronie Pojazdów` — potwierdzone pomiarem. Różnica nie zmienia niczego, co widzi użytkownik, ale sprawia, że nie da się użyć zwykłego porównania obu plików jako testu zgodności — a właśnie takiego testu wymaga zasada 14 z `AGENTS.md`. To zmiana jednego wyrażenia w jednym miejscu i warto ją zrobić przed zapowiedzianym dodatkiem, bo dopiero wtedy sprzątanie w parserze da się sprawdzić automatycznie.

---

**Co się zmieniło 13 września.** Otrzymałem Twoje odpowiedzi na wszystkie osiem pytań oraz prawdziwą treść reguł obu projektów Firebase. Skutki dla tego dokumentu:

- **sprostowałem błąd**: napisałem wcześniej, że projekt `audiorpg-2eb6f` odrzuca obcych — nie odrzuca; przyczyna mojej pomyłki jest opisana w rozdz. 9.2,
- **zamieniłem przypuszczenie na dowód**: wykonałem za Twoją zgodą kontrolowany test zapisu i po nim posprzątałem (rozdz. 9.2),
- **rozstrzygnąłem pomiarem** kwestię okna „Porównaj zaznaczone" — Twoja intuicja okazała się trafna dla kolumn opisowych, ale przy okazji wyszła osobna, realna usterka czytelności (rozdz. 3.5),
- **domknąłem** pytania o `TRIGGER_TOKEN` i o kopię zapasową — oba przestały być zadaniami,
- **napisałem kompletne reguły** dla obu projektów zamiast szkieletu i dodałem osobną instrukcję krok po kroku dla App Check.

**Otwarte zostały dwie decyzje**, obie wypisane w rozdz. 12.4.

---

*Analiza wykonana 10 września 2026, uzupełniona 13 września o odpowiedzi użytkownika, prawdziwe reguły Firebase i wynik kontrolowanego testu zapisu. W kodzie aplikacji nie wprowadzono żadnych zmian.*
*Analiza siostrzana: `Analizy/responsywnosc-aplikacji-2026-09-10.html` · Instrukcja wykonawcza: `Analizy/instrukcja-appcheck-2026-09-13.md`*

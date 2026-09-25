# Szczelina w nagłówku tabeli DataVault — analiza

## 1. Metryka

| | |
|---|---|
| **Data analizy** | 21 września 2026; **aktualizacja 25 września 2026** (rozdz. 14, na podstawie wiadomości 8 i 9) |
| **Temat** | Szczeliny (prześwity) w paśmie nagłówka tabeli w module `DataVault`: między paskiem zakładek a nagłówkiem, między wierszem nazw kolumn a wierszem filtrów oraz na krawędziach nagłówka; przesuwanie się tekstów nagłówka przy przewijaniu. Od 25 września także: szczelina widoczna tylko w Firefoksie w trybie pełnoekranowym oraz nagłówek, który nie przykleja się na telefonie w poziomie |
| **Moduł** | `DataVault` |
| **Zakres** | `DataVault/style.css` — reguły `.tabs`, `.tableWrap`, `.tableFrame`, `.tableViewport`, `.dataTable`, `.dataTable thead`, `.dataTable thead th`, `@media (max-height: 520px)`; zachowanie przyklejonego nagłówka przy przewijaniu; wpływ wysokości okna i skalowania ekranu; różnice między silnikami przeglądarek (Chromium i Gecko) |
| **Poza zakresem** | Zmiany z commita `409cde3` (filtr globalny, barwy sygnałów, własne pole wyboru) — użytkownik wyraźnie zastrzegł, żeby ich nie ruszać. Widok kart na telefonie w pionie (`@media (max-width: 720px)`) — tam `thead` jest ukryty, więc problem nie występuje |
| **Metoda** | Pomiar geometrii (`getBoundingClientRect`) oraz sonda pikselowa: zrzut pasma nagłówka i odczyt średniej barwy każdego wiersza device-pikseli; kontrolowane wyłączanie pojedynczych deklaracji CSS i kolorowanie poszczególnych elementów, żeby ustalić, który element maluje który piksel; test przecieku z wierszami przemalowanymi na jaskrawą czerwień. W rozdz. 14 dodatkowo: odczyt barw piksel po pikselu z zrzutów ekranu użytkownika oraz próba odtworzenia w prawdziwym Firefoksie, z przewijaniem prawdziwym kółkiem myszy |
| **Konfiguracje testowe** | Rozdz. 3–13: silnik Chromium, 8 rozmiarów okna od 1280×610 do 1920×1080, skalowanie 100%, 125%, 150% i 200%, 4–5 pozycji przewinięcia. Rozdz. 14: Firefox 156.0.1 (Linux) — 10 położeń krawędzi obszaru przewijania względem pikseli ekranu, skalowanie 100%, 125% i 150%, tryb okna i tryb pełnoekranowy, przewijanie z kodu i prawdziwym kółkiem |
| **Stan repozytorium w chwili diagnozy** | `HEAD` = `38d7668` (gałąź `claude/charming-meitner-45xuh7`, zsynchronizowana z `main`). Aktualizacja z 25 września: `HEAD` = `801b456` (gałąź `claude/wonderful-ramanujan-0h0dv8`) — kod `DataVault/style.css` bez zmian od rozdz. 12 |
| **Status** | **Wznowiony 25 września 2026** (wiadomość 8). Część dotycząca przeglądarek na silniku Chromium (Chrome, Edge) pozostaje zamknięta — rozdz. 13. **Otwarte:** szczelina E w Firefoksie na Windows w trybie pełnoekranowym (rozdz. 14.2–14.4). **Rozstrzygnięte:** nagłówek na telefonie w poziomie zostaje bez zmian — decyzja użytkownika z wiadomości 9 (rozdz. 14.5). Naprawa szczeliny E wstrzymana do testów na tablecie i testów T1–T3 w Firefoksie — użytkownik zapowiedział ich wykonanie |
| **Zmiany w kodzie** | **Wdrożone** w `DataVault/style.css`, w dwóch etapach: rozdz. 11 (szczelina C i przeskok nagłówka) oraz rozdz. 12 (szczelina D). Etap z rozdz. 14: **bez zmian w kodzie** — zgodnie z wiadomością 8 |
| **Analiza siostrzana** | `Analizy/responsywnosc-aplikacji-2026-09-10.html`, rozdział 14 — pierwszy opis szczelin w przyklejonym nagłówku; rozdział 13.7–13.8 — decyzja o progu `max-height: 520px` dla telefonu w poziomie, która tłumaczy obserwację z rozdz. 14.5 |

### Główny wniosek

Poprawka z commita `38d7668` **zamknęła przeciek treści wierszy** — po niej w żadnej z 8 przebadanych konfiguracji nie przecieka ani jeden piksel wiersza. Ale **nie usunęła przyczyny**, tylko ją przykryła, i wprowadziła nowy, widoczny skutek uboczny.

Zostały dwa objawy, oba mające **to samo źródło**: górne obramowanie tabeli (`.dataTable{border:1px solid var(--div)}`) przy `border-collapse:collapse` przesuwa górną krawędź `<thead>` o **pół piksela** w dół względem krawędzi obszaru przewijania.

1. **Ciemna szczelina 1 px** między jasną linią obramowania a nazwą kolumny. Widoczna **tylko wtedy, gdy górna krawędź `.tableFrame` wypada na pełnym pikselu** — a to zależy od wysokości okna. Stąd obserwacja użytkownika, że na pełnym ekranie szczelina jest, a w oknie jej nie ma.
2. **Nagłówek przeskakuje o 1,5 px w górę** w chwili przyklejenia. To bezpośredni skutek poprawki `top:-1px` i występuje w **każdej** konfiguracji. To jest dokładnie to, co użytkownik opisał jako „teksty nagłówków delikatnie jakby przesuwały się w górę".

Rekomendowane rozwiązanie (rozdz. 8) usuwa **oba** objawy jednocześnie, bo likwiduje półpikselowe przesunięcie zamiast je maskować. Zmierzone: przesunięcie nagłówka 0,00 px i zero przeciekających pikseli we wszystkich 8 konfiguracjach.

Rekomendacja ma swoją cenę: nad nazwami kolumn zostają dwie poziome linie zamiast trzech. Cena została policzona w rozdz. 8.3, a w **rozdz. 8.4 opisana prostym językiem, bez żargonu**.

> **Stan na dziś (25 września 2026): temat wznowiony.** W przeglądarkach na silniku Chromium (Chrome, Edge) wszystkie zgłoszone objawy są usunięte — użytkownik nie odtworzył tam usterki. **W Firefoksie na Windows, w trybie pełnoekranowym, nadal widać szczelinę między paskiem zakładek a nazwami kolumn** — to szczelina E, opisana w **rozdz. 14**. Jej mechanizm jest inny niż mechanizmy szczelin A–D: układ strony jest poprawny co do piksela, przeciekają wyłącznie litery przewijanych wierszy (bez ich tła), a przeciek powstaje najpewniej dopiero na etapie, w którym Firefox składa gotowy obraz na ekranie. Według wiadomości 9 większość wcześniejszych obserwacji użytkownik robił w Firefoksie, a zamknięcie tematu 21 września opierało się na sprawdzeniu w Edge — szczelina E była więc najpewniej widoczna w Firefoksie przez cały czas (rozdz. 14.4). Osobno opisano, dlaczego na telefonie w poziomie nagłówek się nie przykleja (rozdz. 14.5) — to skutek świadomie przyjętego progu, niezwiązany ze szczeliną E; użytkownik zdecydował zostawić to bez zmian.
>
> Rozdziały 3–7 opisują diagnozę i stan sprzed wdrożenia — są zapisem tego, jak ustalono przyczynę, i celowo zostają w dokumencie. Aktualny stan kodu opisują **rozdz. 11 i 12**, podsumowanie etapu zamkniętego 21 września **rozdz. 13**, a ustalenia po wznowieniu **rozdz. 14**.

---

## 2. Pełne prompty użytkownika

Zapisane bez skracania, zgodnie z zasadą 10 z `AGENTS.md`.

> **Wiadomość 1 — zlecenie poprawki**
>
> Możesz jeszcze "załatać" lukę między nagłówkiem kolumny a panelem zakładek? Przed chwilą były też poprawki w repo dotyczące filtrów, kolorów itp - tego nie ruszaj. Napraw tylko jedną szczelinę.

> **Wiadomość 2 — zlecenie tej analizy**
>
> PPrzygotuj nową analizę o nazwie "Szczelina.md" w folderze "Analizy". Zapisz tam wszystkie ustalenia dotyczące problemu oraz tego jak go naprawiałeś. Do analizy dopisz też, że problem nie zniknął całkowicie. Obecnie szczelina jest między nazwą kolumny a przyciskami do zmiany zakładek. Załączam screeny. Dodatkowo coś dziwnego dzieje się z nagłówkiem tabeli. Przy użyciu scrolla jakby delikatnie zmieniał pozycję. Załączam dwa screeny. Jeden jak scroll jest maksymalnie w górę (tak jak jest od razu po wejściu w zakładkę) i drugi po użyciu scrolla w dół. Teksty nagłówków delikatnie jakby przesuwały się w górę. Dopisz to do analizy.

> **Wiadomość 3 — uzupełnienie obserwacji**
>
> Jeszcze jedna uwaga - wygląda, że ta szczelina jest widoczna tylko w na pełnym ekranie przeglądarki. Przy widoku w oknie wygląda ok. Ale wciąż teksty kolumn przesuwają się nieco w górę.

> **Wiadomość 4 — prośba o wyjaśnienie prostym językiem**
>
> Zapoznaj się z analizą Analizy/Szczelina.md
>
> Wyjaśnij mi co dokładnie znaczy "Zmiana wyglądu nieprzewiniętej tabeli" oraz o co dokładnie chodzi z kosztem wizualnym w 8.3
> Napisz to prostym językiem dla osoby bez wiedzy informatycznej.
> Zaktualizuj analizę (pisz tylko po polsku). Nie zmieniaj jeszcze kodu aplikacji póki wszystkiego nie wyjaśnimy.

> **Wiadomość 5 — zgoda na wdrożenie**
>
> czy zgoda na to, żeby zielona linia nad nazwami kolumn była cieńsza o jeden punkt ekranu — w zamian za trwałe zniknięcie ciemnej szczeliny i za to, żeby nazwy kolumn przestały drgać przy przewijaniu?
>
> * Masz moją zgodę. Wprowadź zmiany w kodzie. Zaktualizuj analizę i dokumentację.

> **Wiadomość 6 — zgłoszenie kolejnej szczeliny**
>
> Poprawka dotycząca "skakania nagłówka" zadziałała.
> Nic teraz nie drga. Zarówno w trybie pełnoekranowym jak i w oknie.
>
> Jest jednak kolejna szczelina do załatania. Pomiędzy nagłówkiem kolumny a polem do wpisania filtra. Załączam screena z widocznym czerwonym fragmentem.
>
> *(Do wiadomości dołączony zrzut ekranu: kolumna „SŁOWA KLUCZOWE", pod nazwą kolumny widoczny czerwony fragment treści wiersza, poniżej pole filtra, a jeszcze niżej wiersz z czerwonym tekstem „IMPERIUM, OSTRZE, SZUMOWINY".)*

> **Wiadomość 7 — potwierdzenie i zamknięcie tematu**
>
> Na moje oko jest już ok. Przy przewijaniu, jeżeli jest luka po bokach, to jest niewidoczna przy użytkowaniu. Zaktualizuj analizę i uznajemy problem za zakończony.

> **Wiadomość 8 — wznowienie tematu (25 września 2026)**
>
> Zapoznaj się z dokumentacją Analizy/Szczelina.md
> Problem jednak wciąż występuje.
> Z nieznanych mi powodów szczelina pojawia się tylko na przeglądarce Firefox i tylko w trybie pełnoekranowym.
> Problemu nie udało mi się odtworzyć na Edge i Chrome.
> Nie testowałem jeszcze na tablecie.
> Na telefonie natomiast, jak ustawię poziomio i w opcjach włączę "tryb na komputer" (androidowa przeglądarka Chrome) to nagłówek tabel się nie przewija. Zostaje u góry jak w poprzedniej wersji aplikacji.
> Nie wprowadzaj zmian w kodzie. Zaktualizuj analizę Analizy/Szczelina.md o nowe ustalenia.
> Niedługo przeprowadzę testy na tablecie. Wtedy dopiszesz kolejne ustalenia i podejmiemy kroki w kierunku naprawy. Obecnie skup się na aktualizacji
>
> *(Do wiadomości dołączone trzy zrzuty ekranu — opis niżej, w „Materiale dowodowym”.)*

> **Wiadomość 9 — odpowiedzi na pytania z rozdz. 14 (25 września 2026)**
>
> Wydaje mi się, że większość rzeczy sprawdzałem na Firefox. Ostatnią poprawkę dotyczącą szczeliny sprawdziłem na Edge, ponieważ myslałem, że Firefox trzyma starą wersję w pamięci. Dlatego napisałem, że problem rozwiązany a potem (po resecie przeglądarki) zobaczyłem, że w Firefox dziwnie się wyświetla. Co do telefonu poziomo i braku przyklejenia nagłówka możemy to tak zostawić. Napisałem tę uwagę bo nie byłem pewien czy to w jakiś sposób nie jest powiązane z wyświetlaniem tej jednej linii pixeli. W niedługim czasie przeprowadzę wszystkie testy opisane w analizie.

> **Wiadomość 10 — wynik pierwszej próby testu T1, tryb okna (25 września 2026)**
>
> '{"okno":"1920x191","ekran":"1920x1080","skala":1,"tresc_na_ekranie_od":139,"rzedy_zakladek":1,"pasek_kompaktowy":true,"zakladki_dol":481.2,"ramka_gora":481.2,"obszar_gora":482.2,"naglowek_gora":482.2,"ulamek":0.2,"przewiniecie":0}'
>
> *(Do wiadomości dołączony zrzut ekranu: u góry pasek górny `DataVault` w trybie admina i panel „NARZĘDZIA” z polem filtru globalnego rozciągnięte na całą szerokość; poniżej narzędzia programisty Firefoksa zadokowane na dole okna, karta „Konsola”, fragment T1 wklejony w edytorze wielowierszowym i powyższy wynik. W konsoli widać też komunikaty aplikacji o wczytaniu danych z prywatnej bazy. Zrzut zawiera dane konta użytkownika — celowo nie zostały tu przepisane, zgodnie z zasadą 12 z `AGENTS.md`.)*

> **Wiadomość 11 — wynik drugiej próby testu T1, tryb pełnoekranowy (25 września 2026)**
>
> A to jest screen z konsoli po wciśnięciu F11
>
> *(Do wiadomości dołączony zrzut ekranu: ta sama konsola po przełączeniu na pełny ekran, narzędzia programisty nadal zadokowane na dole; nad nimi widoczne tylko trzy linijki podpowiedzi pod tabelą. Wynik: `{"okno":"1920x378","ekran":"1920x1080","skala":1,"tresc_na_ekranie_od":0,"rzedy_zakladek":1,"pasek_kompaktowy":true,"zakladki_dol":481.2,"ramka_gora":481.2,"obszar_gora":482.2,"naglowek_gora":482.2,"ulamek":0.2,"przewiniecie":0}`.)*

Wiadomości 10 i 11 omówiono w rozdz. 14.7.1.

### Materiał dowodowy od użytkownika

Do wiadomości 2 dołączono zrzuty ekranu. Pokazywały:

- pasmo między przyciskami zakładek a wierszem z nazwami kolumn, z widoczną cienką ciemną linią biegnącą przez całą szerokość tabeli;
- dwa zrzuty tej samej zakładki do porównania: pierwszy przy przewinięciu maksymalnie w górę (stan zaraz po wejściu w zakładkę), drugi po przewinięciu w dół. Napisy w nagłówku na drugim zrzucie stoją odrobinę wyżej niż na pierwszym.

Obie obserwacje udało się odtworzyć pomiarem i obie zostały potwierdzone liczbowo w rozdziale 7.

Do wiadomości 8 dołączono trzy zrzuty ekranu:

1. **Pasek zakładek z aktywną zakładką „Słowa kluczowe”** (957×80 pikseli). Pod przyciskami zakładek, tuż nad nazwami kolumn „TYP”, „NAZWA”, „OPIS”, biegnie przez całą szerokość tabeli cienki pasek, w którym widać ucięte fragmenty liter przewijanych wierszy — jasnozielonych i czerwonych.
2. **Powiększony wycinek tego samego miejsca** (73×68 pikseli): koniec przycisku „…Z”, przycisk „HORDY” i nazwa kolumny „NAZWA”. W pasku nad nazwą kolumny widać rząd czerwonych kropek — to fragmenty czerwonego tekstu wiersza.
3. **Tabela z zakładki „Notatki” obok okna „O programie Mozilla Firefox”** (1361×433 pikseli). Kolumny „✓”, „NAZWA”, „OPIS”, wiersze „Wzrost” i „Zwiększenie rangi”; nad nazwami kolumn ten sam pasek z fragmentami liter. Okno informacyjne pokazuje: **Firefox 155.0.1 (64 bity)** oraz komunikat „Aktualizacje zablokowane przez Twoją organizację”.

Wszystkie trzy zrzuty zostały zmierzone piksel po pikselu — wyniki w rozdz. 14.2.

---

## 3. Anatomia pasma nagłówka — co maluje który piksel

Żeby mówić o szczelinie precyzyjnie, trzeba wiedzieć, z czego składa się pasmo kilku pikseli między dolną krawędzią przycisków zakładek a pierwszą literą nazwy kolumny. Ustalono to metodą kolorowania: każdemu podejrzanemu elementowi po kolei nadano jaskrawą barwę i sprawdzono, który wiersz device-pikseli zmienił kolor.

Pomiar przy oknie 1536×700, skalowanie 100%, tabela nieprzewinięta, górna krawędź `.tableFrame` na `y = 153`:

| y | Co tam jest | Zmierzona barwa (R,G,B) | Element odpowiedzialny |
|---|---|---|---|
| 151 | tło obszaru roboczego | `1,6,0` | `.tableWrap{background: linear-gradient(...)}` |
| 152 | linia dolna paska zakładek | `4,40,2` | `.tabs{border-bottom:1px solid var(--div)}` |
| 153 | linia górna ramki tabeli | `4,36,2` | `.tableFrame{border-top:1px solid var(--div)}` |
| 154 | własne obramowanie tabeli | `4,45,2` | `.dataTable{border:1px solid var(--div)}` + `.tableFrame{box-shadow: inset ...}` |
| **155** | **pierwszy wiersz tła nagłówka — ciemniejszy niż reszta** | **`1,11,0`** | **`.dataTable thead th{background-image: linear-gradient(...)}`** |
| 156 | tło nagłówka, wartość docelowa | `2,15,1` | to samo tło |
| 157 | tło nagłówka | `2,15,1` | to samo tło |

Kluczowy wiersz to **155**. Test kolorowania pokazał, że maluje go tło komórki nagłówka (po przemalowaniu `th` na żółto wiersz 155 zrobił się żółty razem z 156 i 157). A mimo to jest **ciemniejszy** od dwóch wierszy pod nim: `11` zamiast `15` w kanale zielonym. Gradient tła nagłówka biegnie od jaśniejszego do ciemniejszego, więc jego **pierwszy** wiersz powinien być **najjaśniejszy**, nie najciemniejszy.

To odchylenie to właśnie szczelina. Jest to wiersz o **częściowym pokryciu**, powstający dlatego, że górna krawędź `<thead>` nie wypada na pełnym pikselu, tylko pół piksela niżej.

### Skąd bierze się pół piksela

```css
.dataTable{
  border-collapse:collapse;       /* scalanie obramowań */
  border:1px solid var(--div);    /* obramowanie należy do tabeli, nie do komórek */
}
```

Przy `border-collapse: collapse` obramowanie zewnętrzne **należy do tabeli**, a sąsiadujące z nim obramowania komórek są z nim scalane. Przeglądarka rysuje taką scaloną krawędź **wyśrodkowaną na granicy pudełka tabeli**, więc połowa jej grubości wypada nad pierwszym wierszem, a połowa pod nim.

Skutek jest mierzalny i zawsze taki sam:

```
.tableViewport górna krawędź treści  = 154,0
.dataTable     górna krawędź pudełka = 154,0
.dataTable thead górna krawędź       = 154,5   ← pół piksela niżej
```

Te **pół piksela** to całe źródło problemu. Wszystko poniżej jest już tylko jego konsekwencją.

---

## 4. Historia problemu — trzy szczeliny, trzy poprawki

Problem był zgłaszany etapami i naprawiany etapami. Dla porządku cała historia w jednym miejscu.

### 4.1 Szczelina A — górny margines obszaru przewijania

**Objaw:** przy przewijaniu tuż pod paskiem przycisków przejeżdżały fragmenty wierszy, w paśmie o wysokości kilku pikseli.

**Przyczyna:** `.tableViewport` miał górny margines wewnętrzny (`padding-top`). Element przyklejony (`position: sticky`) zatrzymuje się na **wewnętrznej krawędzi treści** pojemnika przewijanego, a nie na jego widocznej krawędzi. Margines górny odsuwał więc nagłówek w dół o swoją wysokość i zostawiał nad nim odsłonięte pasmo, przez które widać było przewijaną zawartość.

**Poprawka:** usunięcie górnego marginesu:

```css
.tableViewport{ padding: 0 4px 4px; }
```

Brak górnego marginesu jest **celowy** i tak też jest opisany w komentarzu w pliku. To nie jest przeoczenie i nie należy go „poprawiać".

### 4.2 Szczelina B — między wierszem nazw kolumn a wierszem filtrów

**Objaw:** włos między dwoma wierszami nagłówka, przez który widać było przejeżdżającą treść.

**Przyczyna:** oba wiersze nagłówka były przyklejane **niezależnie od siebie** — pierwszy na `top: 0`, drugi na `top: var(--header-row-height)`, gdzie wysokość pierwszego wiersza była mierzona w JavaScripcie przez `ResizeObserver` i wpisywana do zmiennej CSS. Zmierzona wartość była zaokrąglana, a rzeczywista wysokość wiersza nie. Różnica rzędu ułamka piksela wystarczała, żeby między wierszami został prześwit.

**Poprawka:** przyklejenie **całego `<thead>`** jako jednego bloku zamiast każdego wiersza osobno. Wtedy oba wiersze poruszają się razem i nie mają jak się rozjechać:

```css
.dataTable thead{ position:sticky; top:0; z-index:3; background-color:var(--panel); }
.dataTable thead th{ position:static; }   /* komórki nie mogą mieć własnego przyklejania */
```

Usunięto przy tym `--header-row-height` z `:root`, `ResizeObserver` mierzący wysokość wiersza oraz regułę `top:` na drugim wierszu nagłówka. Zmierzony efekt: szczelina **0,00 px**, i tak pozostało do dziś.

### 4.3 Szczelina C — pasmo pod paskiem zakładek (commit `38d7668`)

**Objaw:** przy przewijaniu na samej górze obszaru przewijania widać było linię przejeżdżającego wiersza o pełnej szerokości tabeli. Pomiar: 1 px przy skalowaniu 100% i 1,3 px przy 150%.

**Przyczyna:** opisane w rozdziale 3 pół piksela. Tło nagłówka zaczynało się na `154,5`, a krawędź obszaru przewijania była na `154,0`. W paśmie `154,0–154,5` nie było **żadnego** elementu nagłówka, który mógłby je zakryć, więc przejeżdżał tamtędy wiersz.

**Poprawka:** przyklejenie nagłówka o piksel wyżej, tak żeby jego nieprzezroczyste tło sięgnęło do samej krawędzi:

```css
.dataTable thead{
  top:-1px;      /* było: top:0 */
  z-index:3;
  background-color:var(--panel);
}
```

**Weryfikacja poprawki:** wiersze tabeli przemalowano na jaskrawą czerwień i policzono czerwone piksele w paśmie nad nagłówkiem. Przed poprawką: 490 przeciekających pikseli przy skalowaniu 100% i 1468 przy 150%. Po poprawce: **0** przy skalowaniu 100%, 125%, 150% i 200%, przy czterech pozycjach przewinięcia. Szczelina B pozostała na 0,00 px.

**Odrzucony wariant:** rozważano usunięcie górnego obramowania tabeli (`.dataTable{border-top:0}`). Zamykało szczelinę równie skutecznie, ale zmieniało wygląd tabeli nieprzewiniętej, więc odpadło. **Ta decyzja okazała się błędna i rozdział 8 ją odwraca** — patrz rozdz. 8.3, gdzie policzono, jak duża naprawdę jest ta zmiana wyglądu, oraz rozdz. 8.4, gdzie opisano ją prostym językiem.

---

## 5. Co zostało po poprawce — objaw 1: ciemna szczelina przy nazwie kolumny

Poprawka `top:-1px` działa **tylko wtedy, gdy nagłówek jest przyklejony**, czyli przy `scrollTop > 0`. Przy tabeli nieprzewiniętej reguła `top` nie ma żadnego zastosowania i nagłówek stoi tam, gdzie wynika to z układu — czyli na `154,5`, pół piksela poniżej krawędzi.

I dokładnie tam, w stanie spoczynku, siedzi ciemny wiersz o częściowym pokryciu z rozdziału 3.

### 5.1 Dlaczego tylko na pełnym ekranie

To najciekawsza część i obserwacja użytkownika okazała się trafna. Ciemny wiersz pojawia się **tylko wtedy, gdy górna krawędź `.tableFrame` wypada na pełnej wartości piksela**. Jeżeli wypada na ułamku, przeglądarka i tak rozkłada barwę na dwa wiersze device-pikseli i odchylenie rozmywa się na tyle, że przestaje być widoczne jako linia.

Pomiar przy 16 konfiguracjach okna (kolumna „profil" to średnia kanału zielonego w kolejnych wierszach device-pikseli, zaczynając od wiersza z dolną linią paska zakładek):

| Okno | `.tableFrame` górna krawędź | Ułamek | Profil przy `scrollTop = 0` | Ciemna szczelina |
|---|---|---|---|---|
| 1280×700 | 193,000 | 0,000 | 40 · 36 · 45 · **11** · 15 · 15 | **TAK** |
| 1280×864 | 290,813 | 0,813 | 40 · 36 · 45 · 15 · 15 · 15 | nie |
| 1366×700 | 153,000 | 0,000 | 40 · 36 · 45 · **11** · 15 · 15 | **TAK** |
| 1366×864 | 290,813 | 0,813 | 40 · 36 · 45 · 15 · 15 · 15 | nie |
| 1440×700 | 153,000 | 0,000 | 40 · 36 · 45 · **11** · 15 · 15 | **TAK** |
| 1440×864 | 244,813 | 0,813 | 40 · 36 · 45 · 15 · 15 · 15 | nie |
| 1536×700 | 153,000 | 0,000 | 40 · 36 · 45 · **11** · 15 · 15 | **TAK** |
| 1536×864 | 244,813 | 0,813 | 40 · 36 · 45 · 15 · 15 · 15 | nie |
| 1600×700 | 153,000 | 0,000 | 40 · 36 · 45 · **12** · 16 · 15 | **TAK** |
| 1600×864 | 244,813 | 0,813 | 40 · 36 · 45 · 16 · 15 · 15 | nie |
| 1680×700 | 153,000 | 0,000 | 40 · 36 · 45 · **11** · 15 · 15 | **TAK** |
| 1680×864 | 244,813 | 0,813 | 40 · 36 · 45 · 15 · 15 · 15 | nie |
| 1728×700 | 115,000 | 0,000 | 40 · 36 · 45 · **12** · 16 · 15 | **TAK** |
| 1728×864 | 244,813 | 0,813 | 40 · 36 · 45 · 16 · 15 · 15 | nie |
| 1920×700 | 115,000 | 0,000 | 40 · 36 · 45 · **12** · 16 · 15 | **TAK** |
| 1920×864 | 184,813 | 0,813 | 40 · 36 · 45 · 16 · 15 · 15 | nie |

Wzór jest jednoznaczny i **nie zależy od szerokości okna, tylko od jego wysokości**. Punktem przełączenia jest zapytanie medialne, które przełącza pasek górny w tryb kompaktowy:

```css
@media (max-height: 760px){
  .topbar{ padding:8px 16px; gap:8px }
  .actionsNote{ display:none }
  .sigil{ width:32px; height:32px }
  .btn{ padding:7px 10px }
}
```

Przy wysokości okna do 760 px pasek górny jest niższy i zbudowany z samych pełnych pikseli, więc `.tableFrame` ląduje na okrągłej wartości → **szczelina widoczna**. Powyżej 760 px wchodzi pasek pełnowymiarowy, w którym wysokości wierszy tekstu dają ułamek `0,813` → **szczelina rozmyta i niewidoczna**.

Przełączanie okna przeglądarki między pełnym ekranem a oknem zmienia wysokość obszaru widoku o wysokość pasków przeglądarki — czyli przesuwa użytkownika przez tę granicę albo zmienia ułamek. To wyjaśnia, dlaczego szczelina pojawia się w jednym trybie, a w drugim nie. Gdzie dokładnie leży granica na danym komputerze, zależy jeszcze od skalowania ekranu w Windows (100%, 125%, 150%, 175%), które dzieli wysokość fizyczną ekranu przez współczynnik skalowania. **Mechanizm jest ten sam, zmienia się tylko próg.**

To jest istotne, bo oznacza, że **problem jest losowy z punktu widzenia użytkownika**: ta sama aplikacja na tym samym komputerze wygląda dobrze albo źle w zależności od tego, czy okno jest zmaksymalizowane, czy nie.

---

## 6. Co zostało po poprawce — objaw 2: nagłówek przeskakuje przy przewijaniu

To jest **bezpośredni koszt poprawki `top:-1px`** i występuje zawsze, w każdej konfiguracji.

### 6.1 Rachunek

| Stan | Gdzie stoi górna krawędź `<thead>` | Dlaczego |
|---|---|---|
| `scrollTop = 0` (tabela nieprzewinięta) | `154,5` | Reguła `top` nie działa, bo nagłówek nie jest jeszcze przyklejony. Stoi tam, gdzie wypada z układu: pół piksela poniżej krawędzi pudełka tabeli, przez scalone obramowanie |
| `scrollTop > 0` (nagłówek przyklejony) | `153,0` | Reguła `top:-1px` przypina pudełko nagłówka **jeden piksel powyżej** krawędzi treści obszaru przewijania (`154,0`) |
| **Różnica** | **−1,5 px** | Nagłówek razem z napisami przeskakuje w górę o półtora piksela w chwili ruszenia rolką |

Półtora, a nie jeden, bo pokonuje dwie rzeczy naraz: pół piksela scalonego obramowania **plus** cały piksel ujemnego `top`.

### 6.2 Pomiar

Zmierzono położenie górnej krawędzi pierwszej komórki nagłówka względem jej położenia przy `scrollTop = 0`, przy pięciu pozycjach przewinięcia (1, 37, 120, 400 i 900 px):

| Okno | Skalowanie | Przesunięcie nagłówka |
|---|---|---|
| 1536×730 | 100% | −1 · −1,5 · −1,5 · −1,5 · −1,5 px |
| 1536×864 | 100% | −1 · −1,5 · −1,5 · −1,5 · −1,5 px |
| 1920×1080 | 100% | −1 · −1,5 · −1,5 · −1,5 · −1,5 px |
| 1366×768 | 100% | −1 · −1,5 · −1,5 · −1,5 · −1,5 px |
| 1536×864 | 125% | −1 · −1,5 · −1,5 · −1,5 · −1,5 px |
| 1536×864 | 150% | −1 · −1,5 · −1,5 · −1,5 · −1,5 px |
| 1280×610 | 100% | −1 · −1,5 · −1,5 · −1,5 · −1,5 px |
| 1280×720 | 200% | −1 · −1,5 · −1,5 · −1,5 · −1,5 px |

Przy przewinięciu o 1 px przesunięcie wynosi dokładnie −1 px, bo nagłówek jeszcze nie odkleił się na całą wartość; od 37 px wzwyż stabilizuje się na −1,5 px i już się nie zmienia.

Warto zauważyć, że **przed** poprawką `38d7668` ten sam pomiar dawał −0,5 px. Czyli nagłówek przeskakiwał także wcześniej, tylko trzy razy słabiej i przez to niezauważalnie. Poprawka nie stworzyła zjawiska od zera — **wzmocniła je trzykrotnie**, aż stało się widoczne gołym okiem.

### 6.3 Drugi, mniej oczywisty skutek

Przy `scrollTop = 0` nad nagłówkiem widać jasną linię `45` — własne obramowanie tabeli. Po przewinięciu nagłówek ze swoim nieprzezroczystym tłem **zakrywa tę linię** i profil zmienia się z `40 · 36 · 45 · 15` na `40 · 36 · 15`. Czyli przy przewijaniu nie tylko napisy idą w górę, ale też **znika jedna z linii poziomych** nad nagłówkiem. To dokłada się do wrażenia, że „coś dziwnego dzieje się z nagłówkiem".

Zjawisko występuje we wszystkich 16 przebadanych konfiguracjach okna, także tych, w których ciemnej szczeliny nie widać. To tłumaczy, dlaczego użytkownik napisał, że w oknie szczeliny nie ma, ale **teksty i tak się przesuwają**.

---

## 7. Zestawienie pomiarów — trzy warianty obok siebie

Trzy warianty zmierzone tą samą metodą, w tych samych 8 konfiguracjach. „Przeciek" to liczba czerwonych pikseli w paśmie nad nagłówkiem po przemalowaniu wierszy tabeli na jaskrawą czerwień, zsumowana z czterech pozycji przewinięcia.

**Wariant E — stan sprzed commita `38d7668`** (`.dataTable{border:1px}` + `thead{top:0}`):

| Okno | Skalowanie | Przesunięcie nagłówka | Przeciek |
|---|---|---|---|
| 1536×730 | 100% | −0,5 px | **2556** |
| 1536×864 | 100% | −0,5 px | 0 |
| 1920×1080 | 100% | −0,5 px | 0 |
| 1366×768 | 100% | −0,5 px | 0 |
| 1536×864 | 125% | −0,5 px | 0 |
| 1536×864 | 150% | −0,5 px | 0 |
| 1280×610 | 100% | −0,5 px | **2044** |
| 1280×720 | 200% | −0,5 px | **8176** |

Widać tu ten sam wzór co w rozdziale 5: przeciek pojawiał się tylko przy wysokościach okna do 760 px, gdzie krawędź ramki wypada na pełnym pikselu.

**Wariant A — stan obecny** (`.dataTable{border:1px}` + `thead{top:-1px}`):

| Okno | Skalowanie | Przesunięcie nagłówka | Przeciek |
|---|---|---|---|
| 1536×730 | 100% | **−1,5 px** | 0 |
| 1536×864 | 100% | **−1,5 px** | 0 |
| 1920×1080 | 100% | **−1,5 px** | 0 |
| 1366×768 | 100% | **−1,5 px** | 0 |
| 1536×864 | 125% | **−1,5 px** | 0 |
| 1536×864 | 150% | **−1,5 px** | 0 |
| 1280×610 | 100% | **−1,5 px** | 0 |
| 1280×720 | 200% | **−1,5 px** | 0 |

Przeciek zamknięty w komplecie, ale przesunięcie nagłówka urosło trzykrotnie i występuje wszędzie.

**Wariant F — wdrożony** (`.dataTable{border-top:0}` + `thead{top:0}`):

| Okno | Skalowanie | Przesunięcie nagłówka | Przeciek |
|---|---|---|---|
| 1536×730 | 100% | **0 px** | 0 |
| 1536×864 | 100% | **0 px** | 0 |
| 1920×1080 | 100% | **0 px** | 0 |
| 1366×768 | 100% | **0 px** | 0 |
| 1536×864 | 125% | **0 px** | 0 |
| 1536×864 | 150% | **0 px** | 0 |
| 1280×610 | 100% | **0 px** | 0 |
| 1280×720 | 200% | **0 px** | 0 |

Zero i zero we wszystkich ośmiu konfiguracjach.

Ten sam wariant sprawdzony na pełnym zestawie 16 rozmiarów okna z rozdziału 5 — profil pasma nagłówka jest **identyczny w stanie spoczynku i po przewinięciu**, w każdym rozmiarze, i nigdzie nie ma ciemnego wiersza:

| Okno | Ułamek krawędzi | Profil `scrollTop = 0` | Profil `scrollTop = 400` | Ciemna szczelina |
|---|---|---|---|---|
| 1280×700 | 0,000 | 40 · 36 · 16 · 15 · 15 | 40 · 36 · 16 · 15 · 15 | nie |
| 1366×700 | 0,000 | 40 · 36 · 16 · 15 · 15 | 40 · 36 · 16 · 15 · 15 | nie |
| 1536×700 | 0,000 | 40 · 36 · 16 · 15 · 15 | 40 · 36 · 16 · 15 · 15 | nie |
| 1920×700 | 0,000 | 40 · 36 · 16 · 15 · 15 | 40 · 36 · 16 · 15 · 15 | nie |
| 1280×864 | 0,813 | 40 · 36 · 15 · 15 · 15 | 40 · 36 · 15 · 15 · 15 | nie |
| 1536×864 | 0,813 | 40 · 36 · 15 · 15 · 15 | 40 · 36 · 15 · 15 · 15 | nie |
| 1920×864 | 0,813 | 40 · 36 · 15 · 15 · 15 | 40 · 36 · 15 · 15 · 15 | nie |
| 1536×864 @150% | 0,813 | 40 · 21 · 36 · 15 · 15 | 40 · 21 · 36 · 15 · 15 | nie |

---

## 8. Rekomendacja

### 8.1 Proponowana zmiana

Dwie deklaracje w `DataVault/style.css`:

```css
.dataTable{
  width:100%;
  border-collapse:collapse;
  font-size:13px;
  border:1px solid var(--div);
  border-top:0;              /* ← DODANE */
  box-shadow:var(--glow);
}

.dataTable thead{
  position:sticky;
  top:0;                     /* ← ZMIANA z -1px z powrotem na 0 */
  z-index:3;
  background-color:var(--panel);
}
```

Razem z tym trzeba wymienić komentarz dwujęzyczny przy `thead{top}`, bo obecny opisuje rozwiązanie z `-1px`, którego już nie będzie (zasada 7 z `AGENTS.md`: nie wolno zostawiać komentarzy opisujących nieistniejące zachowanie).

### 8.2 Dlaczego to działa

Zabiera **przyczynę**, a nie skutek. Bez górnego obramowania tabeli nie ma scalonej krawędzi do podzielenia na pół, więc:

```
.tableViewport górna krawędź treści  = 154,0
.dataTable     górna krawędź pudełka = 154,0
.dataTable thead górna krawędź       = 154,0   ← bez przesunięcia
```

Skoro nagłówek stoi dokładnie na krawędzi obszaru przewijania już w spoczynku, to `top:0` niczym go nie rusza w chwili przyklejenia. Stąd przesunięcie 0,00 px. I skoro nie ma półpikselowego przesunięcia, to nie ma też wiersza o częściowym pokryciu — stąd brak ciemnej szczeliny niezależnie od wysokości okna.

### 8.3 Koszt wizualny — policzony, nie oszacowany

W commicie `38d7668` ten wariant odrzucono z uzasadnieniem, że „zmienia wygląd nieprzewiniętej tabeli". To była prawda, ale bez liczby. Liczba jest taka:

| | Przed | Po |
|---|---|---|
| Linia dolna paska zakładek (`.tabs`) | zielony **40** | zielony **40** — bez zmiany |
| Linia górna ramki (`.tableFrame`) | zielony **36** | zielony **36** — bez zmiany |
| Własne obramowanie tabeli | zielony **45** | zielony **16** — **znika** |
| Pierwszy wiersz tła nagłówka | zielony **11** (ciemna szczelina) | zielony **15–16** — poprawnie |

Znika **trzecia z rzędu linia pozioma** o grubości 1 px, stojąca bezpośrednio pod dwiema innymi liniami tej samej barwy `var(--div)` — pod dolną krawędzią paska zakładek i górną krawędzią ramki tabeli. Górna krawędź tabeli jest więc nadal zamknięta, tyle że dwiema liniami zamiast trzema. W zamian znika ciemna szczelina, która stała tuż pod tą linią i była **bardziej rzucająca się w oczy** niż sama linia — bo ciemna przerwa w jasnym paśmie widać lepiej niż o jedną jasną linię mniej.

Przy skalowaniu 125% i 150%, gdzie trzy zbiegające się linie i tak zlewają się w rozmyte pasmo, różnica jest praktycznie nie do zauważenia.

**Zmiana dotyczy tylko górnej krawędzi.** Boczne i dolne obramowanie tabeli zostaje bez zmian, bo `border-top:0` po `border:1px` kasuje wyłącznie górną krawędź.

### 8.4 Wyjaśnienie prostym językiem — co to znaczy „zmiana wyglądu nieprzewiniętej tabeli" i czym jest koszt wizualny

Rozdziały 8.2 i 8.3 są napisane językiem technicznym. Ten rozdział mówi to samo bez żargonu, bo decyzja z rozdziału 10 należy do użytkownika i musi być podjęta ze zrozumieniem, co dokładnie zmieni się na ekranie.

#### 8.4.1 Trzy słowa, które trzeba najpierw wyjaśnić

**Piksel.** Ekran składa się z bardzo małych kwadratowych punktów świetlnych. Jeden taki punkt to piksel. Wszystko, co w tej analizie ma rozmiar „1 px", jest grubości jednego takiego punktu — to najcieńsza linia, jaką ekran w ogóle potrafi narysować. Człowiek widzi ją jako włos.

**Tabela nieprzewinięta.** To tabela w stanie, w jakim widać ją **zaraz po wejściu w zakładkę**, zanim użytkownik ruszy kółkiem myszy — czyli przewinięta maksymalnie do góry. Dokładnie ten stan pokazywał pierwszy ze zrzutów ekranu dołączonych do wiadomości 2.

**Tabela przewinięta.** To ta sama tabela po ruszeniu kółkiem w dół, kiedy wiersze jadą do góry, a nazwy kolumn zostają przyklejone na swoim miejscu.

To rozróżnienie jest tu kluczowe, bo **cała omawiana zmiana wyglądu dotyczy wyłącznie stanu nieprzewiniętego**. W stanie przewiniętym nic się nie zmieni — i to jest najważniejszy argument z całego tego rozdziału, rozwinięty w punkcie 8.4.5.

#### 8.4.2 Co dziś jest nad nazwami kolumn

Między dolną krawędzią przycisków zakładek a pierwszą literą nazwy kolumny jest pasemko o wysokości czterech punktów ekranu. Każdy z nich maluje co innego:

| Który punkt od góry | Co to jest | Jak wygląda |
|---|---|---|
| 1. | dolna krawędź panelu z przyciskami zakładek | cienka, przygaszona zielona linia |
| 2. | górna krawędź ramki, w której siedzi tabela | cienka, przygaszona zielona linia — **tej samej barwy** |
| 3. | własne obramowanie samej tabeli | cienka, przygaszona zielona linia — **znów tej samej barwy** |
| 4. | pierwszy punkt tła nagłówka | **ciemna szczelina** — to jest usterka zgłoszona przez użytkownika |

Trzy pierwsze linie mają **identyczny kolor** (w kodzie to jedna wspólna wartość `var(--div)` — przygaszona zieleń) i **stykają się ze sobą bez przerwy**. Oko nie widzi trzech osobnych linii. Oko widzi **jedną linię o grubości trzech punktów**. Sprawdzenie tego na własne oczy wymagałoby powiększenia zrzutu ekranu kilkunastokrotnie.

Czwarty punkt psuje ten obraz: zamiast być jaśniejszy od tła nagłówka (tak wynika z projektu — tło nagłówka jest gradientem od jaśniejszego do ciemniejszego), jest od niego **ciemniejszy**. Przez to wygląda jak cienka czarna rysa biegnąca przez całą szerokość tabeli tuż pod zieloną linią. To jest właśnie „szczelina", którą użytkownik zobaczył i zgłosił.

#### 8.4.3 Co zmieni proponowana poprawka

Poprawka z rozdziału 8.1 kasuje **punkt trzeci** — własne obramowanie tabeli na jej górnej krawędzi. Wraz z nim znika przyczyna ciemnej szczeliny, więc **punkt czwarty też przestaje być ciemny** i staje się normalnym, jednolitym tłem nagłówka.

```
DZIŚ — tabela nieprzewinięta            PO ZMIANIE — tabela nieprzewinięta

   [ PRZYCISKI ZAKŁADEK ]                  [ PRZYCISKI ZAKŁADEK ]
 ─────────────────────────  linia 1      ─────────────────────────  linia 1
 ─────────────────────────  linia 2      ─────────────────────────  linia 2
 ─────────────────────────  linia 3
 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ciemna
                             szczelina
   NAZWA KOLUMNY                            NAZWA KOLUMNY
```

Mówiąc jednym zdaniem: **zielona linia nad nazwami kolumn będzie o jeden punkt cieńsza, a ciemna rysa pod nią zniknie**. Tyle. Nic się nie rozjeżdża, nic się nie otwiera, tabela nadal jest domknięta od góry — tyle że dwiema stykającymi się liniami zamiast trzech.

#### 8.4.4 Co oznacza słowo „koszt" i skąd te liczby w tabeli 8.3

„Koszt wizualny" to po prostu **cena, jaką płaci się za naprawę**. Poprawka nie jest całkowicie darmowa: usuwa dwie usterki, ale przy okazji o włos zmienia wygląd. Rozdział 8.3 nazywa tę cenę dokładnie, żeby użytkownik dowiedział się o niej **przed** wdrożeniem, a nie odkrył ją sam po fakcie.

Liczby w tabeli 8.3 („zielony 40", „zielony 45", „zielony 16") to **zmierzona jasność zieleni** w danym punkcie ekranu, w skali od 0 do 255, gdzie 0 to zupełna czerń. Tło nagłówka ma wartość **15**. Stąd czytelna interpretacja:

| Wartość | Co oznacza w praktyce |
|---|---|
| **45** | wyraźnie jaśniejsze od tła → widoczna zielona linia |
| **16** | praktycznie tyle samo co tło (15) → oko nie odróżnia, linia zniknęła |
| **11** | **ciemniejsze** od tła → widoczna ciemna rysa, czyli szczelina |

Czyli wiersz tabeli 8.3 „własne obramowanie tabeli: 45 → 16" znaczy dokładnie tyle: *jedna z trzech zielonych linii przestaje być widoczna*. A wiersz „pierwszy wiersz tła nagłówka: 11 → 15–16" znaczy: *ciemna rysa przestaje być widoczna*.

**Bilans zmiany:**

| Co się traci | Co się zyskuje |
|---|---|
| Zielona linia nad nazwami kolumn jest cieńsza o jeden punkt ekranu (3 → 2) | Znika ciemna rysa pod tą linią — we **wszystkich** rozmiarach okna, także na pełnym ekranie |
| — | Nazwy kolumn przestają podskakiwać o 1,5 punktu w chwili ruszenia kółkiem (rozdz. 6) |
| — | Przestaje znikać i pojawiać się jedna z linii nad nagłówkiem przy przewijaniu (rozdz. 6.3) |

**Czego zmiana nie dotyka w ogóle:** boków i dołu tabeli (obramowanie zostaje), linii między wierszami i kolumnami, barw, czcionek, wielkości liter, odstępów, wysokości wierszy, szerokości kolumn, paska zakładek, przycisków, filtrów, widoku kart na telefonie oraz wszystkich zmian z commita `409cde3`, których użytkownik zastrzegł nie ruszać.

#### 8.4.5 Dlaczego ten koszt jest niewielki

Cztery powody, w kolejności od najmocniejszego:

1. **Ten „nowy" wygląd użytkownik już dziś ogląda.** W obecnej wersji, gdy tylko ruszy się kółkiem, nagłówek swoim nieprzezroczystym tłem zasłania trzecią linię — i nad nazwami kolumn zostają **dwie linie zamiast trzech** (zmierzone, rozdz. 6.3). Tabela już teraz wygląda raz tak, raz tak, zależnie od położenia suwaka. Proponowana zmiana niczego nie wymyśla od nowa — ustala na stałe ten wygląd, który tabela i tak przyjmuje po pierwszym ruchu kółka, i **ujednolica oba stany**. Dzisiejsze migotanie linii przy przewijaniu też przez to znika.

2. **Znika jedna z trzech linii identycznego koloru, stykających się ze sobą.** To nie jest usunięcie linii, którą oko rozpoznaje jako osobny element wykończenia. To zmiana grubości jednego pasemka z trzech punktów na dwa. Gdyby to była jedyna zielona linia nad tabelą, sprawa wyglądałaby zupełnie inaczej — ale nie jest.

3. **W zamian znika coś bardziej rzucającego się w oczy.** Ciemna rysa w jasnym pasemku to przerwa w ciągłości — a oko wyłapuje przerwy dużo łatwiej niż to, że jasna linia jest o włos cieńsza. Potwierdza to najlepszy możliwy dowód: **użytkownik sam zauważył i zgłosił ciemną szczelinę**, bez żadnej podpowiedzi. Nikt natomiast nigdy nie zgłosił, że linia nad tabelą jest za cienka.

4. **Przy skalowaniu 125% i 150% różnica jest praktycznie nie do zauważenia.** Przy takim ustawieniu Windows jeden punkt układu jest malowany na 1,25 lub 1,5 punktu ekranu, więc przeglądarka rozmywa linie na sąsiednie punkty. Trzy zbiegające się linie zlewają się wtedy w jedno rozmyte pasmo i odjęcie jednej z nich nie robi widocznej różnicy. Efekt jest w pełni zauważalny tylko przy skalowaniu 100%.

#### 8.4.6 Co dokładnie trzeba zdecydować

Pytanie do użytkownika brzmi: **czy zgoda na to, żeby zielona linia nad nazwami kolumn była cieńsza o jeden punkt ekranu — w zamian za trwałe zniknięcie ciemnej szczeliny i za to, żeby nazwy kolumn przestały drgać przy przewijaniu?**

Jeżeli tak — wdrażane jest rozwiązanie z rozdziału 8.1. Jeżeli nie — zostaje stan obecny z rozdziału 8.4.2, czyli trzy linie, ciemna szczelina przy części wysokości okna i drganie nagłówka przy każdym przewinięciu. Trzeciej możliwości nie ma: wszystkie warianty pośrednie zostały sprawdzone pomiarem i odrzucone (rozdz. 8.5).

### 8.5 Warianty odrzucone

| Wariant | Dlaczego odpada |
|---|---|
| Zostawić `top:-1px` i pogodzić się z przeskokiem | Przeskok jest widoczny gołym okiem, użytkownik zgłosił go samodzielnie, bez podpowiedzi. Nie znika przy żadnej wysokości okna |
| `top:-0.5px` zamiast `-1px` | Skasowałoby przeskok, ale pozostawia przyczynę: nagłówek dalej stoi na półpikselowej granicy, więc wiersz o częściowym pokryciu i ciemna szczelina zostają. Poza tym wartości ułamkowe w `top` zachowują się różnie w różnych przeglądarkach |
| Usunąć `.tableFrame{border-top}` zamiast obramowania tabeli | Nie pomaga. Ta linia leży **poza** obszarem przewijania, więc nie ma żadnego wpływu na pozycję nagłówka. Zmierzone: ciemny wiersz zostaje |
| Usunąć `.tableFrame{box-shadow: inset}` | Jw. — zmierzone, jasna linia ściemnia się z 45 do 36, ciemny wiersz zostaje |
| `border-collapse: separate` na tabeli | Rozwiązuje półpikselowe przesunięcie, ale przebudowuje **wszystkie** obramowania w tabeli: podwójne linie między komórkami, inna siatka, inny wygląd całego modułu. Nieproporcjonalnie duża zmiana jak na jeden piksel |
| Dodatkowy element zasłaniający pasmo (np. `::before` na `.tableFrame`) | Maskowanie objawu kolejną warstwą. Nie usuwa przeskoku nagłówka, a dokłada element do utrzymania |

---

## 9. Ryzyka

| Ryzyko | Ocena | Uzasadnienie |
|---|---|---|
| Zmiana wyglądu nieprzewiniętej tabeli (czyli tabeli przewiniętej maksymalnie do góry, tak jak zaraz po wejściu w zakładkę) | **Niskie, ale realne** | Znika jedna z trzech sąsiadujących linii poziomych nad nagłówkiem, przez co pasemko nad nazwami kolumn jest cieńsze o 1 px (rozdz. 8.3, wyjaśnienie prostym językiem w rozdz. 8.4). Zauważalne przy skalowaniu 100%, praktycznie niewidoczne przy 125% i 150%. Dotyczy wyłącznie stanu nieprzewiniętego — po przewinięciu tabela już dziś wygląda dokładnie tak, jak będzie wyglądać po zmianie (rozdz. 6.3). Wymaga akceptacji użytkownika przed wdrożeniem |
| Konflikt ze zmianami z commita `409cde3` | **Brak** | Sprawdzone: commit `409cde3` (filtr globalny, barwy sygnałów, pole wyboru) nie dotyka geometrii nagłówka. Zmiana z rozdz. 8.1 obejmuje dwie deklaracje w regułach `.dataTable` i `.dataTable thead`, których tamten commit nie modyfikował |
| Wpływ na widok kart na telefonie | **Brak** | W `@media (max-width: 720px)` obowiązuje `.dataTable thead{display:none}` — nagłówka nie ma, więc ani `top`, ani `border-top` nie mają tam zastosowania |
| Wpływ na szczelinę B (między wierszami nagłówka) | **Brak** | Szczelina B wynika z przyklejenia całego `<thead>` jako jednego bloku, co zostaje bez zmian. Zmierzona wartość 0,00 px pozostaje |
| Regresja przecieku przy nietypowej wysokości okna | **Niskie** | Wariant F sprawdzony na 8 konfiguracjach z pomiarem przecieku i 16 konfiguracjach z profilem barwnym, w tym w obu przypadkach ułamka krawędzi (0,000 i 0,813). Wszędzie zero |
| Inna przeglądarka niż silnik Chromium | **Średnie — zmaterializowane** | Pomiary wykonano na silniku Chromium. Model scalonych obramowań jest w standardzie CSS, więc zachowanie powinno być takie samo, ale zaokrąglanie subpikselowe bywa różne. Warto obejrzeć wynik także w Firefoksie, jeżeli jest używany. **Stan z 25 września:** ryzyko się zmaterializowało — w Firefoksie na Windows, w trybie pełnoekranowym, widać szczelinę E (rozdz. 14). Geometria nagłówka jest w Firefoksie poprawna; przeciek powstaje przy składaniu obrazu na ekranie |

---

## 10. Następne kroki

1. ~~**Decyzja użytkownika** co do kosztu wizualnego z rozdz. 8.3.~~ **Wykonane** — zgoda udzielona w wiadomości 5.
2. ~~Wdrożenie zmiany z rozdz. 8.1.~~ **Wykonane** — patrz rozdz. 11.
3. ~~Aktualizacja `DetaleLayout.md`.~~ **Wykonane** — patrz rozdz. 11.3.
4. ~~Sprawdzenie na sprzęcie użytkownika w obu trybach — pełny ekran i okno.~~ **Wykonane** — użytkownik potwierdził w wiadomości 6: „Nic teraz nie drga. Zarówno w trybie pełnoekranowym jak i w oknie”.
5. Do rozważenia niezależnie od powyższego: próg `max-height: 760px` przełącza pasek górny skokowo i to on odpowiada za to, że układ raz wypada na pełnym pikselu, a raz na ułamku. Nie jest to błąd, ale warto o tym pamiętać przy każdej przyszłej zmianie wysokości paska górnego — przesunięcie progu przesunie też granicę, na której zmienia się zachowanie subpikselowe.
6. Po wznowieniu tematu 25 września (wiadomość 8) aktualna lista następnych kroków jest w **rozdz. 14.9**.

---

## 11. Wdrożenie i weryfikacja

Użytkownik zatwierdził koszt wizualny z rozdz. 8.3 (wiadomość 5), więc rekomendacja z rozdz. 8.1 została wprowadzona.

### 11.1 Co zmieniono w kodzie

Jeden plik: `DataVault/style.css`, dwie deklaracje.

```css
.dataTable{
  border:1px solid var(--div);
  border-top:0;              /* DODANE — kasuje przyczynę półpikselowego przesunięcia */
  ...
}

.dataTable thead{
  position:sticky;
  top:0;                     /* ZMIENIONE z -1px */
  z-index:3;
  background-color:var(--panel);
}
```

Kolejność ma znaczenie: `border-top:0` musi stać **po** skrócie `border`, bo inaczej skrót przywróci górną krawędź.

Wymieniono też komentarze dwujęzyczne, zgodnie z zasadą 7 z `AGENTS.md`:

- przy `.dataTable` dodano komentarz wyjaśniający, dlaczego brak górnej krawędzi jest celowy i czego nie wolno zrobić (przywrócić jej ani rozdzielić obu deklaracji);
- przy `.dataTable thead{top}` zastąpiono opis rozwiązania z `-1px` opisem stanu aktualnego;
- w komentarzu blokowym nad `.dataTable thead` poprawiono zdanie o „obszarze scalonych obramowań tabeli", bo scalonego obramowania na górnej krawędzi już nie ma.

### 11.2 Pomiary kontrolne

Pomiar powtórzono tą samą metodą co w rozdziale 7, na silniku Chromium, na strukturze DOM identycznej z tą, którą buduje `buildTableSkeleton()`. Dla każdej konfiguracji zmierzono trzy rzeczy: położenie górnej krawędzi `<thead>` względem krawędzi treści obszaru przewijania, przesunięcie nagłówka przy pięciu pozycjach przewinięcia (1, 37, 120, 400, 900 px) oraz przeciek (liczba czerwonych pikseli nad nagłówkiem po przemalowaniu wierszy na jaskrawą czerwień, zsumowana z czterech pozycji przewinięcia).

| Okno | Skalowanie | `thead` vs krawędź — przed | `thead` vs krawędź — po | Przesunięcie — przed | Przesunięcie — po | Przeciek po |
|---|---|---|---|---|---|---|
| 1536×730 | 100% | 0,50 px | **0,00 px** | −1 · −1,5 · −1,5 · −1,5 · −1,5 px | **0 · 0 · 0 · 0 · 0 px** | 0 |
| 1536×864 | 100% | 0,50 px | **0,00 px** | −1 · −1,5 · −1,5 · −1,5 · −1,5 px | **0 · 0 · 0 · 0 · 0 px** | 0 |
| 1920×1080 | 100% | 0,50 px | **0,00 px** | −1 · −1,5 · −1,5 · −1,5 · −1,5 px | **0 · 0 · 0 · 0 · 0 px** | 0 |
| 1366×768 | 100% | 0,50 px | **0,00 px** | −1 · −1,5 · −1,5 · −1,5 · −1,5 px | **0 · 0 · 0 · 0 · 0 px** | 0 |
| 1536×864 | 125% | 0,50 px | **0,00 px** | −1 · −1,5 · −1,5 · −1,5 · −1,5 px | **0 · 0 · 0 · 0 · 0 px** | 0 |
| 1536×864 | 150% | 0,50 px | **0,00 px** | −1 · −1,5 · −1,5 · −1,5 · −1,5 px | **0 · 0 · 0 · 0 · 0 px** | 0 |
| 1280×610 | 100% | 0,50 px | **0,00 px** | −1 · −1,5 · −1,5 · −1,5 · −1,5 px | **0 · 0 · 0 · 0 · 0 px** | 0 |
| 1280×720 | 200% | 0,50 px | **0,00 px** | −1 · −1,5 · −1,5 · −1,5 · −1,5 px | **0 · 0 · 0 · 0 · 0 px** | 0 |

Kolumna „przed" jest tu istotna jako **kontrola negatywna**: ten sam harness uruchomiony na kodzie sprzed zmiany odtworzył półpikselowe przesunięcie i przeskok −1,5 px co do liczby, zgodnie z rozdziałami 3 i 6.2. Gdyby harness był na te zjawiska ślepy, zera w kolumnie „po" nic by nie znaczyły.

Profil barwny pasma nagłówka (średnia kanału zielonego w kolejnych wierszach device-pikseli, licząc od tła nad paskiem zakładek):

| Okno | Ułamek krawędzi | Przed, `scrollTop = 0` | Przed, `scrollTop = 400` | Po, `scrollTop = 0` | Po, `scrollTop = 400` |
|---|---|---|---|---|---|
| 1536×700 | 0,000 | 6 · 40 · 36 · 45 · **11** · 15 | 6 · 40 · 36 · 15 · 15 · 15 | 6 · 40 · 36 · 16 · 15 · 15 | 6 · 40 · 36 · 16 · 15 · 15 |
| 1366×700 | 0,000 | 6 · 40 · 36 · 45 · **11** · 15 | 6 · 40 · 36 · 15 · 15 · 15 | 6 · 40 · 36 · 16 · 15 · 15 | 6 · 40 · 36 · 16 · 15 · 15 |
| 1920×700 | 0,000 | 6 · 40 · 36 · 45 · **11** · 15 | 6 · 40 · 36 · 15 · 15 · 15 | 6 · 40 · 36 · 16 · 15 · 15 | 6 · 40 · 36 · 16 · 15 · 15 |
| 1536×864 | 0,813 | 6 · 40 · 36 · 45 · 15 · 15 | 6 · 40 · 36 · 15 · 15 · 15 | 6 · 40 · 36 · 15 · 15 · 15 | 6 · 40 · 36 · 15 · 15 · 15 |
| 1920×864 | 0,813 | 6 · 40 · 36 · 45 · 15 · 15 | 6 · 40 · 36 · 15 · 15 · 15 | 6 · 40 · 36 · 15 · 15 · 15 | 6 · 40 · 36 · 15 · 15 · 15 |

Trzy rzeczy do odczytania z tej tabeli:

1. **Ciemny wiersz `11` zniknął** przy każdej wysokości okna, w której wcześniej występował. To objaw 1 z rozdziału 5.
2. **Profil „po" jest identyczny w stanie nieprzewiniętym i po przewinięciu**, w każdej konfiguracji. Wcześniej te dwa profile różniły się od siebie — to właśnie migotanie linii opisane w rozdziale 6.3.
3. **Koszt wizualny wypadł dokładnie tak, jak policzono w rozdz. 8.3**: wartość `45` (własne obramowanie tabeli) zmieniła się na `16`, czyli na praktycznie nieodróżnialną od tła nagłówka o wartości `15`. Nic poza tą jedną wartością się nie zmieniło.

Warto zauważyć wiersz `1536×864` i `1920×864`: tam przed zmianą ciemnej szczeliny nie było, a linia `45` i tak znika. To są konfiguracje, w których użytkownik płaci koszt wizualny, nie odbierając w zamian zniknięcia szczeliny — ale nadal odbiera brak przeskoku nagłówka i brak migotania linii przy przewijaniu. Argument z rozdz. 8.4.5 pozostaje w mocy: wartość `45` znikała tam i tak po pierwszym ruchu kółka.

### 11.3 Zaktualizowana dokumentacja

| Plik | Co zmieniono |
|---|---|
| `DataVault/style.css` | Sama zmiana plus trzy komentarze dwujęzyczne (rozdz. 11.1) |
| `DetaleLayout.md` | Opis reguł `.dataTable` i `.dataTable thead` w sekcji „Komputer i tablet", w obu wersjach językowych. Do tabel „Zmierzony efekt" / „Measured effect" dopisano dwa wiersze: ciemny wiersz nad nazwami kolumn i przesunięcie nagłówka |
| `DataVault/docs/Documentation.md` | Sekcja „Przyklejone nagłówki na komputerze i tablecie" w obu wersjach językowych. Przy okazji usunięto opis mechanizmu, którego w kodzie już nie ma: punkt o zmiennej `--header-row-height` i mierzącym ją `ResizeObserverze` opisywał rozwiązanie zastąpione przy szczelinie B (rozdz. 4.2). Sekcja ma teraz cztery punkty zamiast trzech: łańcuch wysokości, przyklejanie całego `<thead>`, brak górnej krawędzi tabeli, nieprzezroczyste tło |
| `DataVault/docs/README.md` | Opis zachowania tabeli przy przewijaniu w obu wersjach językowych — dopisano, że nazwy kolumn stoją nieruchomo, i opisano, co użytkownik widzi nad nagłówkiem |

### 11.4 Co zostało do sprawdzenia po stronie użytkownika

Pomiary wykonano na silniku Chromium w środowisku bezgłowym. Były dwie rzeczy, których nie dało się sprawdzić zdalnie:

1. ~~**Obejrzenie wyniku na sprzęcie użytkownika w obu trybach** — pełny ekran i okno.~~ **Zamknięte** — potwierdzone w wiadomości 6, w obu trybach.
2. ~~**Firefox**, jeżeli jest używany. Model scalonych obramowań jest w standardzie CSS, więc zachowanie powinno być takie samo, ale zaokrąglanie subpikselowe bywa różne między silnikami (rozdz. 9).~~ **Sprawdzone przez użytkownika** (wiadomość 8) — w Firefoksie na Windows w trybie pełnoekranowym usterka występuje. Opis i dalsze kroki: rozdz. 14.

Punkt 5 z rozdziału 10 — uwaga o progu `max-height: 760px` przy przyszłych zmianach wysokości paska górnego — pozostaje aktualny niezależnie od tej poprawki.

---

## 12. Szczelina D — prześwit na styku wiersza nazw kolumn z wierszem filtrów

Po wdrożeniu rozdziału 11 użytkownik zgłosił kolejny prześwit (wiadomość 6), tym razem **wewnątrz** nagłówka: między nazwą kolumny a polem filtra widać przejeżdżającą treść wiersza.

### 12.1 Czy to regresja po poprawce z rozdz. 11

**Nie.** Sprawdzono wprost: ten sam pomiar uruchomiony na kodzie sprzed zmiany z rozdz. 11 (commit `423d0bc`) daje przeciek co do piksela taki sam, a przy skalowaniu 150% nawet dwa razy większy.

| Okno | Skalowanie | Przeciek na styku — przed rozdz. 11 | Przeciek na styku — po rozdz. 11 |
|---|---|---|---|
| 1536×730 | 100% | 220 px | 220 px |
| 1536×864 | 100% | 220 px | 220 px |
| 1920×1080 | 100% | 220 px | 220 px |
| 1366×768 | 100% | 220 px | 220 px |
| 1536×864 | 125% | 275 px | 275 px |
| 1536×864 | 150% | **660 px** | 330 px |
| 1280×610 | 100% | 220 px | 220 px |
| 1280×720 | 200% | 880 px | 880 px |

Usterka istniała więc od początku. Nie wyszła wcześniej, bo **test przecieku z rozdziałów 7 i 11 mierzył wyłącznie pasmo *nad* nagłówkiem** — nigdy nie zaglądał do jego wnętrza. To jest błąd metody, nie kodu, i został naprawiony: obecny test skanuje całe pasmo `<thead>`.

### 12.2 Przyczyna

Styk jest **geometrycznie idealny**: dolna krawędź wiersza nazw kolumn i górna krawędź wiersza filtrów wypadają na tej samej wartości, szczelina `0,000 px` we wszystkich ośmiu konfiguracjach. To nie jest więc szczelina wymiarowa jak A, B czy C. To **szczelina przezroczystości**.

Winne jest obramowanie rozdzielające oba wiersze nagłówka:

```css
.dataTable thead th{ border-bottom:1px solid var(--div); }   /* var(--div) = rgba(22,198,12,.18) */
```

Składają się na to trzy fakty, każdy sprawdzony pomiarem:

1. Przy `border-collapse: collapse` obramowanie **należy do tabeli**, nie do komórki.
2. Przeglądarka maluje je w **warstwie tabeli**. Przyklejony `<thead>` ma własną warstwę (`position: sticky` plus `z-index: 3`), więc leży **nad** nią — a obramowanie zostaje pod spodem, razem z przewijanymi wierszami.
3. Tło komórki kończy się na krawędzi jej pudełka i **nie sięga pod takie obramowanie**.

W efekcie w tym jednopikselowym pasemku nie ma nic nieprzezroczystego z warstwy nagłówka, a jedyne, co je maluje, to półprzezroczysta linia o kryciu 18%. Pozostałe 82% to przejeżdżający wiersz.

**Test rozstrzygający** — cztery warianty, ten sam pomiar:

| Wariant | Przeciek na styku |
|---|---|
| Stan wyjściowy | **220 px** |
| Usunięcie `border-bottom` z wiersza nazw kolumn | 0 |
| Nieprzezroczyste tło na `thead tr` | **220 px** — bez zmiany |
| Zamiana obramowania na `box-shadow: inset` | 0 |
| Pokolorowanie obramowania na w pełni nieprzezroczyste | **220 px** — bez zmiany |

Dwa ostatnie wiersze są kluczowe. Gdyby problemem była sama półprzezroczystość barwy, pomogłoby jej skasowanie — nie pomaga. Gdyby problemem było tło wiersza, pomogłoby tło na `tr` — nie pomaga. Pomaga wyłącznie to, co **przestaje malować w warstwie tabeli**.

### 12.3 Poprawka

```css
.dataTable thead th{
  border-bottom:0;                        /* było: 1px solid var(--div) */
  box-shadow:inset 0 -1px 0 var(--div);   /* ta sama linia, malowana wewnątrz komórki */
}
```

Cień wewnętrzny maluje się wewnątrz komórki, na jej własnym nieprzezroczystym tle i w **tej samej warstwie** co ono, więc niczego nie przepuszcza. Idiom nie jest nowy w tym pliku — reguła `thead tr:first-child th.filter-active` od dawna rysuje tak akcent aktywnego filtra (`box-shadow: inset 0 -2px 0 var(--filter-on-glow)`). Ta reguła nadpisuje cień z reguły nadrzędnej, co jest poprawne: grubszy akcent zastępuje cienką linię w tym samym miejscu.

Poprawka zamyka **dwie** linie naraz, bo `thead th` obejmuje oba wiersze nagłówka: styk zgłoszony przez użytkownika oraz dolną krawędź nagłówka, która przeciekała tak samo.

### 12.4 Pomiary po poprawce

| Okno | Skalowanie | Styk wiersz nazw / wiersz filtrów | Przeciek na styku | Przesunięcie nagłówka | Przeciek nad nagłówkiem |
|---|---|---|---|---|---|
| 1536×730 | 100% | 0,000 px | **0** | 0,00 px | 0 |
| 1536×864 | 100% | 0,000 px | **0** | 0,00 px | 0 |
| 1920×1080 | 100% | 0,000 px | **0** | 0,00 px | 0 |
| 1366×768 | 100% | 0,000 px | **0** | 0,00 px | 0 |
| 1536×864 | 125% | 0,000 px | **0** | 0,00 px | 0 |
| 1536×864 | 150% | 0,000 px | **0** | 0,00 px | 0 |
| 1280×610 | 100% | 0,000 px | **0** | 0,00 px | 0 |
| 1280×720 | 200% | 0,000 px | **0** | 0,00 px | 0 |

Trzy ostatnie kolumny potwierdzają brak regresji poprawki z rozdziału 11.

**Koszt wizualny: brak.** Linia rozdzielająca ma tę samą barwę i tę samą grubość, stoi tylko o pół piksela wyżej, bo cień wewnętrzny leży wewnątrz komórki, a obramowanie leżało na jej krawędzi. Całe pasmo nagłówka jest przez to niższe o 1,5 px. Porównanie powiększonych zrzutów nieprzewiniętej tabeli nie pokazuje różnicy.

### 12.5 Resztka nierozwiązana — prawa krawędź nagłówka

Skan **całego** pasma nagłówka po poprawce wykazał jeszcze jeden przeciek tej samej klasy, którego ta zmiana nie obejmuje: **pionowa linia 1 px na prawej krawędzi tabeli**, na całej wysokości nagłówka.

Źródłem jest prawe obramowanie tabeli (`.dataTable{border:1px solid var(--div)}`) — dokładnie ten sam mechanizm co w 12.2, tyle że w pionie.

Pomiar kontrolny rozdziela to od artefaktów pomiaru:

| Warunki | Prawa krawędź | Wnętrze pasma |
|---|---|---|
| Wiersze przemalowane na czerwień, nagłówek przewinięty | **104 px** | 88 px |
| Wiersze przemalowane na czerwień, tabela nieprzewinięta | 0 px | 88 px |
| Wiersze w zwykłych barwach, nagłówek przewinięty | 0 px | 88 px |

Wartość „88 px" jest **identyczna we wszystkich trzech przypadkach**, także tam, gdzie nic nie może przeciekać — to antyaliasing podpikselowy tekstu samego nagłówka, nie usterka. Natomiast „104 px" pojawia się wyłącznie przy przewijaniu i odpowiada dokładnie wysokości nagłówka, czyli jest ciągłą linią.

**Dlaczego nie naprawiono tego od razu:** każdy znany sposób zamknięcia tej linii dotyka bocznych obramowań tabeli, a więc jest zmianą wyglądu wymagającą decyzji użytkownika — tak jak zmiana z rozdz. 8.1. Warianty do rozważenia:

| Wariant | Koszt |
|---|---|
| `.dataTable{border-right:0}` (analogicznie do `border-top:0` z rozdz. 8.1) | Znika pionowa linia na prawej krawędzi tabeli. Tuż obok biegnie krawędź `.tableFrame`, więc sytuacja jest taka sama jak przy górnej krawędzi: zostaje jedna linia zamiast dwóch |
| Przeniesienie bocznych linii na `.tableFrame` (`border-left`/`border-right`) | Linie przesuwają się o 4 px na zewnątrz, bo `.tableViewport` ma `padding: 0 4px 4px`. Ramka staje się domkniętym prostokątem |
| Zostawić bez zmian | Przy przewijaniu na prawej krawędzi nagłówka widać 1-pikselową pionową linię przejeżdżającej treści |

**Decyzja użytkownika (wiadomość 7): zostaje bez zmian.** Uzasadnienie użytkownika: „Przy przewijaniu, jeżeli jest luka po bokach, to jest niewidoczna przy użytkowaniu". Jest to świadomie przyjęta resztka, a nie przeoczenie — opisana tutaj po to, żeby przy przyszłej pracy nad tabelą nie została zdiagnozowana od zera jako nowa usterka. Gdyby kiedyś zaczęła przeszkadzać, pierwszy wariant z tabeli wyżej jest gotowy do wdrożenia i jest dokładną analogią poprawki z rozdz. 8.1.

### 12.6 Wniosek metodyczny

Szczelina D nie została wykryta wcześniej, mimo trzech rund pomiarów, bo każdy dotychczasowy test przecieku patrzył **tylko na pasmo nad nagłówkiem**. Kolejne testy w tym module powinny skanować **cały** obszar przyklejonego elementu, z rozbiciem na wiersze i kolumny pikseli, oraz zawsze mieć kontrolę negatywną — pomiar w warunkach, w których przeciek jest niemożliwy. To właśnie ta kontrola pozwoliła odróżnić prawdziwą linię przecieku od antyaliasingu tekstu w rozdziale 12.5.

---

## 13. Podsumowanie — stan zamknięcia

Temat zamknięty 21 września 2026 na podstawie wiadomości 7. Poniżej komplet w jednym miejscu, żeby przy przyszłej pracy nad nagłówkiem `DataVault` nie trzeba było odtwarzać ustaleń od zera.

> **Uwaga (25 września 2026):** to podsumowanie opisuje stan zmierzony na silniku Chromium i nadal jest dla tego silnika aktualne. Temat został wznowiony wiadomością 8, bo w Firefoksie na Windows w trybie pełnoekranowym widać kolejną szczelinę — szczelinę E. Jej opis jest w rozdz. 14, a uzupełnienie tabeli z rozdz. 13.1 — w rozdz. 14.4.

### 13.1 Cztery szczeliny i ich losy

| Szczelina | Objaw | Przyczyna | Rozstrzygnięcie |
|---|---|---|---|
| **A** | Pasmo przewijanych wierszy pod paskiem zakładek | Górny margines wewnętrzny `.tableViewport` — element przyklejony zatrzymuje się na wewnętrznej krawędzi treści | `padding: 0 4px 4px`, bez marginesu u góry (rozdz. 4.1) |
| **B** | Włos między wierszem nazw kolumn a wierszem filtrów | Oba wiersze przyklejane niezależnie, jeden według zaokrąglonej liczby pikseli, drugi według rzeczywistej wysokości | Przyklejenie całego `<thead>` jako jednego bloku; usunięte `--header-row-height` i `ResizeObserver` (rozdz. 4.2) |
| **C** | Ciemna rysa nad nazwami kolumn oraz przeskok nagłówka o 1,5 px przy przewijaniu | Scalone obramowanie górnej krawędzi tabeli przesuwa `<thead>` o pół piksela | `.dataTable{border-top:0}` plus `thead{top:0}` (rozdz. 8.1, 11) |
| **D** | Treść wiersza prześwitująca przez linie rozdzielające nagłówka | Obramowanie malowane w warstwie tabeli, pod przyklejonym `<thead>`; tło komórki nie sięga pod nie | `thead th{border-bottom:0}` plus `box-shadow: inset 0 -1px 0 var(--div)` (rozdz. 12) |

Wspólny mianownik C i D: **obie wynikały z `border-collapse: collapse`**, przy którym obramowanie należy do tabeli, a nie do komórki. Za każdym razem rozwiązaniem okazało się zabranie obramowania z tego miejsca, a nie maskowanie objawu.

### 13.2 Stan końcowy — zmierzony

Silnik Chromium, osiem konfiguracji okna od 1280×610 do 1920×1080, skalowanie 100%, 125%, 150% i 200%:

| Wielkość | Wartość |
|---|---|
| Górna krawędź `<thead>` względem krawędzi obszaru przewijania | 0,00 px |
| Przesunięcie nagłówka w chwili przyklejenia | 0,00 px |
| Przeciek nad nagłówkiem | 0 px |
| Przeciek na styku wierszy nagłówka | 0 px |
| Przeciek na dolnej krawędzi nagłówka | 0 px |
| Szczelina między wierszami nagłówka | 0,000 px |
| Przeciek na prawej krawędzi tabeli | 104 px — **przyjęty świadomie** (rozdz. 12.5) |

Potwierdzenie użytkownika: brak drgania nagłówka w trybie pełnoekranowym i w oknie (wiadomość 6), brak widocznej luki przy normalnym użytkowaniu (wiadomość 7).

### 13.3 Czego nie wolno ruszać bez ponownego pomiaru

Cztery deklaracje w `DataVault/style.css` trzymają się nawzajem. Zmiana którejkolwiek w pojedynkę otwiera jedną ze szczelin z powrotem:

| Deklaracja | Co się stanie po cofnięciu |
|---|---|
| `.tableViewport{padding:0 4px 4px}` — brak marginesu u góry | Wraca szczelina A |
| `.dataTable thead{position:sticky}` na całym `<thead>`, komórki `position:static` | Wraca szczelina B |
| `.dataTable{border-top:0}` razem z `thead{top:0}` | Wraca szczelina C — obu nie wolno rozdzielać |
| `.dataTable thead th{border-bottom:0}` razem z `box-shadow:inset 0 -1px 0 var(--div)` | Wraca szczelina D — obu nie wolno rozdzielać |

Każda z nich ma w pliku komentarz dwujęzyczny wyjaśniający powód. Komentarze są częścią zabezpieczenia, nie ozdobą.

### 13.4 Wnioski metodyczne na przyszłość

1. **Test przecieku musi skanować cały obszar elementu przyklejonego**, a nie tylko pasmo nad nim. Szczelina D przetrwała trzy rundy pomiarów wyłącznie dlatego, że nikt nie zajrzał do wnętrza nagłówka (rozdz. 12.1).
2. **Kontrola negatywna jest obowiązkowa.** Pomiar w warunkach, w których usterka jest niemożliwa, odróżnia prawdziwy przeciek od artefaktu — w rozdz. 12.5 pozwolił oddzielić realną linię na prawej krawędzi od antyaliasingu podpikselowego tekstu nagłówka, który dawał identyczny odczyt.
3. **Kontrola na kodzie sprzed zmiany jest równie obowiązkowa.** Sam wynik „zero" nic nie znaczy, dopóki nie wiadomo, że narzędzie w ogóle potrafi wykryć usterkę (rozdz. 11.2 i 12.1).
4. **Szczelina zerowa geometrycznie nadal może być widoczna.** Szczeliny A, B i C były wymiarowe, D była szczeliną przezroczystości przy idealnym styku 0,000 px. Sam pomiar geometrii jej nie wykrywa — potrzebna jest sonda pikselowa.
5. Próg `max-height: 760px` przełącza pasek górny skokowo i decyduje o tym, czy układ wypada na pełnym pikselu, czy na ułamku. Nie jest to błąd, ale każda przyszła zmiana wysokości paska górnego przesunie granicę, na której zmienia się zachowanie subpikselowe.

---

## 14. Wznowienie — szczelina E w Firefoksie i nagłówek na telefonie w poziomie (25 września 2026)

### 14.1 W skrócie, prostym językiem

- **Co widać.** W Firefoksie, na pełnym ekranie, między dolną linią paska z przyciskami zakładek a nazwami kolumn biegnie przez całą szerokość tabeli pasek grubości jednego punktu ekranu. Przy przewijaniu widać w nim ucięte kawałki liter z wierszy tabeli.
- **Gdzie dokładnie.** Ten pasek to miejsce, w którym stoi cienka zielona linia — górna krawędź ramki tabeli. Linia tam jest, tylko Firefox rysuje na niej litery przejeżdżających wierszy.
- **Czego to nie jest.** To nie jest powrót żadnej z czterech wcześniejszych szczelin. Nazwy kolumn stoją w Firefoksie dokładnie tam, gdzie powinny, co do tysięcznej części piksela — zmierzone. Poprawki z rozdz. 11 i 12 działają także w Firefoksie.
- **Co dokładnie przecieka.** Wyłącznie litery przewijanych wierszy. Tło wierszy nie przecieka — w tym rzędzie punktów widać czystą barwę linii ramki, a na niej same litery (rozdz. 14.2, ustalenie 5).
- **Skąd się bierze (najbardziej prawdopodobne).** Z ostatniego etapu pracy przeglądarki. Kiedy Firefox na Windows skleja gotowe warstwy strony w obraz na ekranie z pomocą karty graficznej, litery przewijanych wierszy są przycinane o jeden punkt ekranu luźniej niż prostokąty (tła wierszy, tło nagłówka). Ten jeden rząd punktów nad nagłówkiem niczym nie jest zasłonięty. W Firefoksie uruchomionym bez karty graficznej nie udało się tego odtworzyć w żadnej z kilkudziesięciu konfiguracji (rozdz. 14.3) — stąd wniosek, że winny jest właśnie ten etap, a nie kod aplikacji. To hipoteza, nie pewność. Rozstrzygną ją trzy proste testy na komputerze użytkownika (rozdz. 14.7).
- **Od kiedy.** Według wiadomości 9 większość wcześniejszych obserwacji powstała w Firefoksie, a ostatnią poprawkę (szczelina D) użytkownik sprawdził w Edge. Szczelina E była więc najpewniej widoczna w Firefoksie przez cały czas, a zamknięcie tematu 21 września zostało potwierdzone tylko na silniku Chromium (rozdz. 14.4).
- **Telefon w poziomie.** To, że nagłówek się tam nie przykleja, jest skutkiem świadomej decyzji z analizy o responsywności (próg 520 px wysokości okna), a nie nową usterką. Ze szczeliną E nie ma to związku. Użytkownik zdecydował zostawić to bez zmian (wiadomość 9). Szczegóły: rozdz. 14.5.
- **Co dalej.** Bez zmian w kodzie, zgodnie z wiadomością 8. Najpierw testy na tablecie (rozdz. 14.6) i trzy krótkie testy w Firefoksie (rozdz. 14.7), potem wybór naprawy (rozdz. 14.8). Pierwsza próba testu T1 została wykonana, ale w warunkach, które nie pokazują szczeliny — rozdz. 14.7.1.

### 14.2 Co pokazują zrzuty ekranu — pomiar piksel po pikselu

Każdy zrzut odczytano rząd po rzędzie: dla każdego rzędu punktów ekranu policzono, jakie barwy w nim występują i ile razy. Tabela pokazuje pasmo od dolnej krawędzi przycisków zakładek do tła nagłówka na zrzucie 1. Dwa pozostałe zrzuty dają ten sam układ; zrzut 3 jest w formacie JPEG, więc jego barwy są lekko zaszumione przez kompresję.

| Rząd | Barwa dominująca (R,G,B) | Co to jest |
|---|---|---|
| 47 | `6,52,3` | dolna krawędź przycisków zakładek |
| 48–57 | `1,6,0` (10 rzędów) | tło pod przyciskami — dolny margines wewnętrzny paska zakładek (`.tabs{padding:10px 10px}`) |
| 58 | `5,41,2` | dolna linia paska zakładek (`.tabs{border-bottom}`) |
| **59** | **`4,36,2` w 594 z 957 punktów, a na nim `156,240,156` w 164 punktach oraz odcienie pośrednie** | **górna linia ramki tabeli (`.tableFrame{border-top}`) — i na niej litery przewijanych wierszy** |
| 60 | `2,16,1` / `1,15,1` | pierwszy rząd tła nagłówka |
| 61 | `2,15,1` | tło nagłówka |

Na zrzucie 2 rząd z przeciekiem ma tę samą barwę bazową `4,36,2` (44 z 73 punktów), a na niej punkty `215,75,75` — to czerwone słowa kluczowe.

Z tych liczb wynikają cztery ustalenia:

1. **Przeciek ma wysokość dokładnie jednego rzędu punktów ekranu** i leży bezpośrednio pod dolną linią paska zakładek. Tak jest na każdym z trzech zrzutów, w dwóch różnych zakładkach („Słowa kluczowe” i „Notatki”), więc usterka nie zależy od danych.
2. **To jest rząd górnej linii ramki tabeli.** Barwa bazowa `4,36,2` to dokładnie `var(--div)` (`rgba(22,198,12,.18)`) nałożone na czarne tło `--panel` — i dokładnie ta sama wartość, którą w rozdz. 11.2 zmierzono na silniku Chromium dla linii `.tableFrame{border-top}` („36” w profilu).
3. **Litery są narysowane NA linii, a nie widać ich PRZEZ linię.** Punkty liter mają barwę równą barwie tekstu co do jednostki: `156,240,156` to `--text` (`#9cf09c`), a `215,75,75` to `--red` (`#d74b4b`). Gdyby półprzezroczysta linia leżała nad literami, byłyby przyciemnione i przybarwione na zielono — na przykład `132,232,130` zamiast `156,240,156`. Nie są, więc w tym rzędzie przewijana treść jest rysowana po linii ramki, na wierzchu, i nic jej nie zasłania.
4. **Sam nagłówek jest nienaruszony.** Rząd pod przeciekiem to pierwszy rząd tła nagłówka, o barwie takiej jak w Chromium po poprawce (`16`, potem `15`). Nie ma ciemnego rzędu z rozdz. 3, który był znakiem rozpoznawczym szczeliny C.
5. **Przeciekają wyłącznie litery, nie tło wierszy.** Każdy punkt rzędu z przeciekiem sklasyfikowano jako czystą barwę linii ramki `4,36,2`, mieszankę barwy litery z tą barwą albo „inny”. Wynik dla zrzutu 1: 595 punktów linii, 354 punkty liter (w tym ich wygładzone brzegi), 8 innych — wszystkie przy lewej krawędzi, na zaokrągleniu ramki. Dla zrzutu 2: 44 i 29, zero innych. Gdyby przeciekało tło przejeżdżającego wiersza, barwa bazowa rzędu zmieniłaby się z `4,36,2` na ok. `4,39,2` (wiersz nieparzysty, `--zebra-odd`), `6,55,3` (parzysty, `--zebra-even`) albo `7,62,4` (podświetlenie `--hover`). Nie zmienia się ani razu. Tła wierszy są więc przycinane poprawnie, a o jeden rząd punktów za daleko sięgają tylko litery. To ustalenie zawęża hipotezę H1 (rozdz. 14.4) i przesądza o kierunku naprawy (rozdz. 14.8).
6. **Wnętrze nagłówka jest szczelne, a Firefox wyświetla aktualną wersję stylów.** Na zrzucie 3 tabela jest przewinięta — świadczy o tym sam przeciek nad nagłówkiem, bo przy tabeli nieprzewiniętej pod nagłówkiem nie ma żadnych wierszy. Mimo to linia między wierszem nazw kolumn a wierszem filtrów oraz dolna krawędź nagłówka są jednolite, bez ani jednego punktu liter. Poprawka szczeliny D z rozdz. 12 działa więc także w Firefoksie na komputerze użytkownika, choć w wiadomości 7 sprawdzono ją tylko w Edge. Profil pasma nie ma też jasnej linii `45` — własnego obramowania tabeli, usuniętego w rozdz. 11. Oba fakty pokazują, że Firefox wyświetla aktualny plik stylów, a nie starą wersję z pamięci podręcznej, której obawiał się użytkownik (wiadomość 9).

Profil pasma w zestawieniu (średnia kanału zielonego w kolejnych rzędach, od tła pod przyciskami):

| Źródło | Profil |
|---|---|
| Chromium po poprawkach z rozdz. 11 i 12 (rozdz. 11.2) | 6 · 40 · 36 · 16 · 15 |
| Firefox 156 na Linuksie, prawdziwe okno, strona testowa z rozdz. 14.3 — bez usterki | 6 · 41 · 36 · 15 · 15 |
| **Zrzut użytkownika — Firefox 155 na Windows** | **6 · 41 · 36 + litery · 16 · 15** |

Układ linii jest identyczny we wszystkich trzech. Różnica dotyczy wyłącznie tego, co narysowano na linii ramki.

Dodatkowe informacje odczytane ze zrzutów:

- **Skala 100%.** Tekst w komórkach ma 7,5 punktu ekranu na znak, co odpowiada czcionce Consolas 13 px przy skalowaniu ekranu 100% i powiększeniu strony 100% (przy 125% byłoby ok. 9,4). Szczelina E nie wynika więc z ułamkowego skalowania ekranu ani z powiększenia strony w Firefoksie.
- **Windows.** Litery mają kolorowe obwódki typowe dla wygładzania ClearType.
- **Przyciski zakładek mają ok. 32 punkty wysokości** (od rzędu 16 do rzędu 47 na zrzucie 1). Ta liczba jest potrzebna w rozdz. 14.4.
- **Firefox 155.0.1, 64 bity, „Aktualizacje zablokowane przez Twoją organizację”.** Firefoksem zarządzają zasady (polityki) organizacji. Może to mieć znaczenie dla testów z rozdz. 14.7 — niektóre ustawienia i narzędzia mogą być zablokowane.

### 14.3 Próba odtworzenia w Firefoksie

W środowisku analizy nie ma Windowsa ani karty graficznej. Uruchomiono Firefox 156.0.1 w wersji dla Linuksa, który rysuje obraz programowo, bez karty graficznej. Strona testowa ładuje prawdziwy plik `DataVault/style.css` i ma strukturę DOM taką, jaką buduje `buildTableSkeleton()`: pasek zakładek, `.tableWrap` → `.tableFrame` → `.tableViewport` → `table.dataTable` z dwoma wierszami nagłówka i 200 wierszami treści. Wiersze tabeli przemalowano na czerwień i skanowano **całe** pasmo od paska zakładek do dolnej krawędzi nagłówka (wniosek 1 z rozdz. 13.4), z kontrolą negatywną (wniosek 2).

Położenie krawędzi obszaru przewijania względem pikseli ekranu zależy od wysokości paska górnego, liczby rzędów przycisków zakładek i czcionki. Żeby nie zgadywać, jaki ułamek piksela wypada u użytkownika, nad paskiem zakładek wstawiano niewidoczny odstęp o wysokości od 0,0 do 0,9 px. W ten sposób przebadano wszystkie położenia krawędzi — od „na pełnym pikselu” po „prawie o cały piksel dalej”.

| Seria | Warunki | Wynik |
|---|---|---|
| 1. Obraz zdjęty z pamięci strony, przewijanie z kodu | Skalowanie 100%: 10 położeń krawędzi (ułamek 0,0–0,9) × przewinięcie 0, 1, 37, 120 i 400 px, a dla dwóch położeń także 400,1–400,9 px. Skalowanie 125% i 150%: 5 położeń × przewinięcie 0, 37 i 400 px | **0** przeciekających punktów we wszystkich |
| 2. Prawdziwe okno na wirtualnym ekranie 1920×1080, prawdziwe kółko myszy, obraz zdjęty z ekranu | Skalowanie 100%. Tryb okna (obszar strony 815 px wysokości, zaczyna się 85 punktów od góry ekranu) i tryb pełnoekranowy (900 px, od samej góry ekranu). Ułamek krawędzi 0,0 / 0,2 / 0,4 / 0,6 / 0,8. 1, 3 i 10 obrotów kółka, zdjęcie w trakcie przewijania i po zatrzymaniu. Płynne przewijanie włączone | **0** we wszystkich |
| 3. Jak seria 2 | Skalowanie 125% (ułamek 0,000 / 0,375 / 0,750) i 150% (0,600 / 0,050 / 0,500), okno 1536×1000, 1 i 5 obrotów kółka | Brak linii przecieku. Przy 150% pojedynczy punkt w rzędzie napisów nagłówka — **ten sam punkt pojawia się w kontroli negatywnej**, bez czerwonych wierszy, więc to wygładzanie krawędzi liter nagłówka, nie przeciek |

Firefox zaokrągla przy tym położenie przewinięcia do pełnych pikseli: po ustawieniu 400,1–400,5 px odczyt wynosi 400, po 400,6–400,9 px — 401.

Geometria we wszystkich konfiguracjach: górna krawędź `<thead>` pokrywa się z górną krawędzią obszaru przewijania co do tysięcznej części piksela (np. `151,400` i `151,400`; `151,900` i `151,900`), w spoczynku i po przewinięciu. **Poprawka z rozdz. 11 działa więc w silniku Firefoksa tak samo jak w Chromium** — półpikselowego przesunięcia nie ma.

Seria 2 odtworzyła przy tym wygląd pasma ze zrzutów użytkownika co do wartości: `6 · 41 · 36 · 15 · 15`. Jedyne, czego nie odtworzyła, to litery na linii ramki.

**Co ten wynik wyklucza:**

1. **Błąd w układzie strony (CSS).** Geometria jest poprawna i taka sama w obu silnikach.
2. **Błąd w kolejności malowania warstw w samym silniku Firefoksa.** Ten sam Firefox, z tym samym plikiem stylów, maluje pasmo poprawnie w każdej z kilkudziesięciu konfiguracji.
3. **Sam ułamek położenia krawędzi jako wystarczającą przyczynę.** Przebadano pełen zakres od 0,0 do 0,9 bez żadnego przecieku.

**Co zostaje:** to, czego w teście nie było, a u użytkownika jest — **Firefox na Windows z przyspieszaniem sprzętowym**, czyli etap, w którym gotowe warstwy strony składa w obraz karta graficzna razem z systemowym kompozytorem Windows (DirectComposition). Na Linuksie ten etap przebiega inaczej i nie da się go tu odtworzyć.

**Zastrzeżenie:** wersja dla Linuksa to nie wersja dla Windows. Wynik negatywny nie dowodzi, że winny jest etap składania obrazu — czyni go najbardziej prawdopodobnym. Potwierdzić albo obalić to może tylko test na komputerze użytkownika (rozdz. 14.7, test T3).

### 14.4 Szczelina E — hipotezy

**Hipoteza H1 (najbardziej prawdopodobna): litery są przycinane o jeden punkt ekranu luźniej niż prostokąty.**

Przewijany obszar tabeli ma granicę, poza którą przewijanej treści nie wolno pokazywać, a nagłówek ma swoje nieprzezroczyste tło. Obie krawędzie leżą w układzie strony w tym samym miejscu (zmierzone, rozdz. 14.3). Ekran ma jednak tylko pełne piksele, więc przy składaniu obrazu każda krawędź, która wypada na ułamku piksela, musi zostać zaokrąglona. Ustalenie 5 z rozdz. 14.2 pokazuje, że tła przewijanych wierszy są przycinane poprawnie — w rzędzie linii ramki nie ma ich ani śladu. Za granicę wychodzą wyłącznie litery. Najprostsze wyjaśnienie: przy składaniu obrazu na Windows litery są przycinane inną drogą niż prostokąty i ich granica wypada o jeden rząd punktów wyżej. Możliwą przyczyną jest sposób rysowania liter z wygładzaniem ClearType, które rozszerza obrys liter o dodatkowe punkty na brzegach; tego nie da się jednak sprawdzić bez Windowsa. Rząd, do którego sięgają litery, to rząd, w którym ramka tabeli rysuje swoją górną linię — więc przewijane litery lądują na linii.

Zgodność z dowodami:

| Obserwacja | Czy H1 ją wyjaśnia |
|---|---|
| Dokładnie jeden rząd punktów | Tak — różnica dwóch zaokrągleń to najwyżej jeden piksel |
| Barwa bazowa rzędu = barwa linii ramki, bez domieszki tła wierszy | Tak — tła wierszy są przycięte poprawnie, więc linia zostaje nietknięta; wychodzą poza nią tylko litery |
| Litery w pełnej barwie, bez przyciemnienia | Tak — przewijana treść jest malowana po ramce, a nic nie leży nad nią |
| Nagłówek nienaruszony, jego wnętrze szczelne | Tak — dotyczy tylko jednego rzędu nad nagłówkiem, na granicy obszaru przewijania; wewnątrz nagłówka nie ma takiej granicy |
| Chrome i Edge bez usterki | Tak — inny silnik i inny sposób składania obrazu |
| Brak usterki w teście z rozdz. 14.3 | Tak — w teście nie było przyspieszania sprzętowego, kompozytora Windows ani wygładzania ClearType |

**Dlaczego tylko na pełnym ekranie** — dwie możliwe składowe, których nie da się rozdzielić bez danych z komputera użytkownika:

1. **Inne położenie krawędzi.** Tryb pełnoekranowy zmienia wymiary obszaru strony. Jeżeli w oknie coś zajmuje miejsce z boku (np. pasek boczny Firefoksa albo pionowe karty), to na pełnym ekranie strona jest szersza, przyciski zakładek mogą się inaczej zawijać, a każdy rząd przycisków przesuwa krawędź obszaru przewijania o wysokość przycisku plus 6 px odstępu. Wysokość przycisku zależy od czcionki: przyciski mają wysokość linii `normal` z arkusza stylów przeglądarki, a nie `1.45` z reguły `body` (zmierzone w Firefoksie: `line-height: normal`), więc ułamek piksela może się zmieniać z każdym rzędem. U użytkownika przycisk ma ok. 32 punkty (rozdz. 14.2). Tak samo działa próg `max-height: 760px` z rozdz. 5.1, jeżeli okno jest niższe niż 760 px, a pełny ekran wyższy. Według H1 przeciek pojawia się tylko przy części położeń krawędzi, więc zmiana położenia może go włączać i wyłączać.
2. **Inna droga wyświetlania.** Okno, które zajmuje cały ekran, Windows może wyświetlać inaczej niż zwykłe okno, a Firefox może wtedy składać obraz inną ścieżką.

Test T1 z rozdz. 14.7 rozstrzyga składową 1 (pokazuje położenie krawędzi w obu trybach), a test T3 — całą hipotezę H1.

Pierwsza próba T1 (rozdz. 14.7.1) wykluczyła już jedną odmianę składowej 1: obszar strony zaczyna się na ekranie na pełnym pikselu w obu trybach (139 punktów od góry w oknie, 0 na pełnym ekranie). Samo przełączenie trybu nie przesuwa więc strony o ułamek piksela. Jeżeli położenie krawędzi różni się między trybami, to tylko przez inne wymiary obszaru strony — tego pierwsza próba jeszcze nie pokazała.

**Hipoteza H2 (mało prawdopodobna): coś specyficznego dla tej instalacji Firefoksa** — dodatek, który wstrzykuje własne style, albo ustawienie narzucone przez zasady organizacji. Nic na zrzutach na to nie wskazuje; test T3 rozstrzygnie to przy okazji.

**Hipotezy odrzucone:**

| Hipoteza | Dlaczego odpada |
|---|---|
| Powrót szczeliny A (margines górny obszaru przewijania) | W kodzie `.tableViewport{padding:0 4px 4px}` bez zmian; w pomiarze nagłówek stoi na krawędzi co do tysięcznej piksela |
| Powrót szczeliny C (pół piksela ze scalonego obramowania) | Zmierzone w Firefoksie: przesunięcie 0,000 px. Na zrzutach brak ciemnego rzędu, który był znakiem rozpoznawczym C |
| Szczelina D (linie wewnątrz nagłówka) | Przeciek jest nad nagłówkiem, nie w jego wnętrzu |
| Powiększenie strony albo skalowanie ekranu inne niż 100% | Wykluczone odczytem szerokości znaków na zrzucie (rozdz. 14.2) i odczytem `skala: 1` w teście T1 (rozdz. 14.7.1) |
| Stara wersja stylów w pamięci podręcznej Firefoksa | Wykluczone pomiarem pikselowym: brak linii `45` i szczelne wnętrze nagłówka to cechy aktualnego pliku stylów (rozdz. 14.2, ustalenie 6) |
| Obszar strony położony na ekranie na ułamku piksela w jednym z trybów | Wykluczone testem T1: początek obszaru strony wypada na 139 (okno) i 0 (pełny ekran), czyli na pełnych pikselach (rozdz. 14.7.1) |

**Uzupełnienie tabeli z rozdz. 13.1:**

| Szczelina | Objaw | Przyczyna | Stan |
|---|---|---|---|
| **E** | Pasek grubości jednego punktu z literami przewijanych wierszy (bez ich tła) między paskiem zakładek a nazwami kolumn — tylko Firefox na Windows, tylko pełny ekran | Najprawdopodobniej litery przycinane przy składaniu obrazu o jeden punkt luźniej niż prostokąty (H1); układ strony poprawny | **Otwarta** — diagnoza do potwierdzenia testami z rozdz. 14.7, naprawa po testach na tablecie |

**Które obserwacje powstały w Firefoksie — odpowiedź z wiadomości 9.** Użytkownik większość rzeczy sprawdzał w Firefoksie. Ostatnią poprawkę (szczelina D, rozdz. 12) sprawdził w Edge, bo podejrzewał, że Firefox wyświetla starą wersję z pamięci podręcznej; po wyczyszczeniu Firefoksa zobaczył w nim szczelinę E. Z tego wynika:

| Wiadomość | Przeglądarka | Co to oznacza dziś |
|---|---|---|
| 2 i 3 — szczelina między nazwami kolumn a zakładkami, widoczna tylko na pełnym ekranie | najpewniej Firefox | Obserwacja z wiadomości 3 ma ten sam wzór co szczelina E: to samo miejsce, tylko pełny ekran. Wyjaśnienie z rozdz. 5.1 (próg 760 px) ustalono na silniku Chromium i dla Chromium pozostaje prawdziwe, ale **u użytkownika za „tylko na pełnym ekranie” najpewniej od początku odpowiadała szczelina E**. Nie da się już ustalić, czy ciemna linia ze zrzutu z wiadomości 2 była szczeliną C, czy E |
| 6 — „Nic teraz nie drga. Zarówno w trybie pełnoekranowym jak i w oknie” | najpewniej Firefox | Poprawka z rozdz. 11 usunęła przeskok nagłówka także w Firefoksie — zgodnie z pomiarem z rozdz. 14.3 |
| 7 — „Na moje oko jest już ok” | Edge | Zamknięcie tematu 21 września zostało potwierdzone tylko na silniku Chromium. Poprawka szczeliny D działa też w Firefoksie — potwierdza to zrzut z wiadomości 8 (rozdz. 14.2, ustalenie 6) |
| 8 — szczelina tylko w Firefoksie, tylko na pełnym ekranie | Firefox 155 po wyczyszczeniu pamięci | Aktualne pliki stylów — potwierdzone pomiarem pikselowym (rozdz. 14.2, ustalenie 6). To nie jest problem starej wersji w pamięci |

Wniosek: szczelina E nie jest skutkiem ubocznym żadnej z poprawek z rozdz. 11 i 12. Najpewniej istniała w Firefoksie od początku, obok szczelin wykrytych na silniku Chromium, i przetrwała, bo wszystkie pomiary robiono na Chromium, a końcowe potwierdzenie — w Edge.

### 14.5 Telefon w poziomie — dlaczego nagłówek się nie przykleja

**Jak odczytano zgłoszenie.** „Nagłówek tabel się nie przewija. Zostaje u góry” rozumiemy tak: nagłówek nie jedzie razem z przewijaniem, tylko zostaje na górze tabeli i przy przewijaniu w dół znika z ekranu razem z resztą strony — tak jak przed wprowadzeniem przyklejanych nagłówków. Jeżeli chodziło o coś innego, trzeba to doprecyzować przy testach na tablecie.

**Przyczyna: próg `max-height: 520px` — decyzja celowa.** W `DataVault/style.css` jest reguła opisana komentarzem „Bardzo niskie okno: powrót do przewijania strony”:

```css
@media (max-height: 520px){
  .app{height:auto; min-height:100dvh}
  .main{grid-template-columns:1fr}
  .panel{display:block; overflow:visible}
  .panelBody{overflow:visible; min-height:auto}
}
```

Wprowadzono ją w analizie `Analizy/responsywnosc-aplikacji-2026-09-10.html` (rozdz. 13.7–13.8). Telefon w poziomie ma tylko 320–420 px wysokości, a model „aplikacja na pełen ekran” ściskał wtedy panel filtrów i tabelę do kilkunastu pikseli — zamiast interfejsu był czarny pasek, a części zakładek nie dało się kliknąć. Dlatego poniżej 520 px wysokości okna aplikacja wraca do zwykłego przewijania całej strony.

W tym trybie przyklejanie nagłówka nie ma się do czego odnieść. Nagłówek przykleja się względem obszaru przewijania samej tabeli (`.tableViewport`), a ten obszar nie ma już ograniczonej wysokości — mieści całą tabelę i sam w pionie się nie przewija. Przewija się strona, a nagłówek jedzie razem z nią.

**Dlaczego tryb „na komputer” niczego nie zmienia.** W trybie komputerowym Chrome na Androidzie układa stronę tak, jakby ekran był szerszy — zwykle na ok. 980 px szerokości, pomijając wskazówki strony dla urządzeń mobilnych — i pomniejsza obraz, żeby się zmieścił. Wysokość rośnie przy tym w tej samej proporcji co szerokość. Telefon użytkownika w poziomie ma 869×329 punktów (zrzut z analizy o responsywności), czyli proporcje 2,64 : 1. Przy 980 px szerokości daje to ok. 371 px wysokości — nadal poniżej 520. Żeby przy tych proporcjach przekroczyć próg, strona musiałaby być układana na ok. 1373 px szerokości.

Pomiar (silnik Chromium, strona testowa z prawdziwym `style.css`, przewinięcie o 600 px):

| Wymiary okna | Sytuacja | Próg 520 px | Obszar tabeli przewija się sam | Nagłówek po przewinięciu |
|---|---|---|---|---|
| 869×329 | telefon w poziomie | włączony | nie | poza ekranem |
| 980×371 | telefon w poziomie, tryb „na komputer” | włączony | nie | poza ekranem |
| 1280×485 | tryb „na komputer” przy szerokości 1280 px | włączony | nie | poza ekranem |
| 1280×700 | typowy tablet w poziomie | wyłączony | tak | **przyklejony** — to samo miejsce przed przewinięciem i po nim |
| 800×1180 | typowy tablet w pionie | wyłączony | tak | **przyklejony** |

**Wniosek.** To nie jest regresja ani usterka w rozumieniu tej analizy. Aplikacja zachowuje się dokładnie tak, jak postanowiono w analizie o responsywności: telefon w poziomie dostaje układ, który działa, kosztem przyklejonego nagłówka. Ze szczeliną E nie ma to związku — na telefonie w poziomie nagłówek w ogóle nie jest przyklejany, więc nie ma gdzie powstać szczelina.

**Decyzja użytkownika (wiadomość 9): zostaje bez zmian.** Użytkownik zgłosił tę obserwację, bo nie był pewien, czy nie jest powiązana z wyświetlaniem jednej linii pikseli — nie jest (zob. wniosek wyżej). Poniższe warianty zostają zapisane wyłącznie na wypadek, gdyby temat kiedyś wrócił; w obecnym zadaniu nie są rozważane.

Warianty, gdyby przyklejony nagłówek na telefonie w poziomie okazał się kiedyś potrzebny:

| Wariant | Co daje | Koszt i trudność |
|---|---|---|
| Zostawić bez zmian | Telefon w poziomie działa jak zwykła strona | Nagłówek znika przy przewijaniu |
| Przyklejać nagłówek względem całej strony | Nagłówek zostaje u góry ekranu | Trudne: szeroka tabela musi przewijać się w bok, a w CSS obszar przewijany w bok staje się też obszarem przewijania w pionie — nagłówek nie może się wtedy przykleić do strony. Wymagałoby osobnego mechanizmu przewijania w bok |
| Ograniczona wysokość samej tabeli na telefonie w poziomie | Nagłówek przykleja się jak na komputerze | Przy ok. 330 px wysokości ekranu na tabelę zostaje bardzo mało miejsca; przewijany obszar wewnątrz przewijanej strony bywa na dotyku niewygodny |

### 14.6 Plan testów na tablecie

Z wymiarów wynika, że na tablecie nagłówek powinien się przyklejać w obu orientacjach (tabela w rozdz. 14.5). Tablet będzie więc pierwszym urządzeniem dotykowym, na którym szczeliny w ogóle mogą się pojawić. To jest prawdziwy test, a nie formalność, z dwóch powodów:

- tablety mają zwykle **ułamkową gęstość pikseli** (np. 1,5; 2,25; 2,625 punktu ekranu na piksel strony), a pomiary z rozdz. 11–12 obejmowały tylko 100%, 125%, 150% i 200%;
- Chrome na wielu większych tabletach z Androidem **domyślnie włącza tryb „na komputer”**, który dokłada własne pomniejszenie strony. Razem daje to położenia krawędzi, których dotąd nie mierzono.

Co zanotować przy każdym teście:

| Co | Po co |
|---|---|
| Model tabletu i wersja systemu | Gęstość pikseli ekranu |
| Przeglądarka i jej wersja | Silnik i sposób składania obrazu |
| Orientacja: pionowo czy poziomo | Inne wymiary okna, inne progi |
| Czy włączony jest tryb „na komputer” (menu przeglądarki) | Dodatkowe pomniejszenie strony |
| Widok gracza czy admina (`?admin=1`) | Inna wysokość paska górnego, więc inne położenie krawędzi |
| Czy nagłówek przykleja się przy przewijaniu | Potwierdzenie przewidywań z rozdz. 14.5 |
| Czy widać szczelinę nad nazwami kolumn albo między nazwami a filtrami | Szczeliny C, D i E |
| Zrzut ekranu tabeli nieprzewiniętej i przewiniętej | Pomiar piksel po pikselu, tak jak w rozdz. 14.2 |

Jeżeli na tablecie jest też Firefox, warto sprawdzić i jego. Firefox na Androidzie składa obraz inaczej niż Firefox na Windows, więc wynik pomoże ocenić hipotezę H1: przeciek na tablecie osłabiałby tezę, że winny jest kompozytor Windows.

### 14.7 Testy do wykonania w Firefoksie na komputerze — przed naprawą

Trzy krótkie testy, od najważniejszego. Żaden nie zmienia aplikacji ani danych. Zasady organizacji mogą blokować niektóre z nich — wtedy dany test należy pominąć i zanotować, że był zablokowany.

**Przed wszystkimi testami:** w `DataVault` nacisnąć **Ctrl+F5**. To odświeża stronę z pominięciem pamięci podręcznej, więc rozwiewa obawę z wiadomości 9, że Firefox pokazuje starą wersję. Pomiar z rozdz. 14.2 (ustalenie 6) pokazał wprawdzie, że Firefox wyświetla aktualne style, ale przy kolejnych testach ten krok kosztuje sekundę i usuwa wątpliwość.

**T1 — odczyt położenia krawędzi, w oknie i na pełnym ekranie.**

Ważne: narzędzia programisty (F12) zadokowane na dole okna zabierają stronie wysokość. Przy niskim obszarze strony aplikacja przechodzi w tryb przewijania całej strony (próg 520 px, rozdz. 14.5), w którym nagłówek w ogóle nie jest przyklejany — i pomiar nie dotyczy już szczeliny E. Tak stało się w pierwszej próbie (rozdz. 14.7.1). Dlatego fragment poniżej **czeka 10 sekund**, zanim cokolwiek zmierzy: przez ten czas należy zamknąć narzędzia i przewinąć tabelę.

1. Otworzyć `DataVault` w Firefoksie i wejść w zakładkę z tabelą — najlepiej tę, na której szczelina była widoczna.
2. Ustawić tryb, który ma być zmierzony: okno albo pełny ekran (klawisz **F11**).
3. Nacisnąć **F12** i wybrać kartę **Konsola**.
4. Wkleić poniższy fragment i nacisnąć **Enter** (w edytorze wielowierszowym — przycisk **Wykonaj**). Przy pierwszym wklejaniu Firefox może wyświetlić ostrzeżenie przed oszustwami i poprosić o wpisanie frazy potwierdzającej — należy wpisać dokładnie tę frazę, którą podaje ostrzeżenie, i wkleić fragment ponownie. Konsola od razu pokaże jakąś liczbę — to tylko numer odliczania, nie wynik.
5. **Od razu** nacisnąć **F12**, żeby zamknąć narzędzia, i kółkiem myszy przewinąć tabelę kawałek w dół — tak, żeby szczelina była widoczna.
6. Odczekać co najmniej 10 sekund, nie ruszając okna.
7. Nacisnąć **F12** jeszcze raz. W konsoli pojawi się wiersz zaczynający się od `POMIAR SZCZELINY:` — ten wiersz należy skopiować. Jeżeli go nie widać, wpisać w konsoli `pomiarSzczeliny` i nacisnąć Enter — wynik jest też tam zapisany.
8. Powtórzyć kroki 2–7 w drugim trybie.

```js
setTimeout(() => {
  const r = s => document.querySelector(s).getBoundingClientRect();
  const z = v => Math.round(v * 1000) / 1000;
  const vp = r('.tableViewport'), th = r('.dataTable thead'), fr = r('.tableFrame'), tb = r('.tabs');
  const rzedy = new Set([...document.querySelectorAll('.tabs .tab')]
    .map(t => Math.round(t.getBoundingClientRect().top))).size;
  const d = devicePixelRatio, y = window.mozInnerScreenY ?? 0;
  window.pomiarSzczeliny = JSON.stringify({
    okno: innerWidth + 'x' + innerHeight, ekran: screen.width + 'x' + screen.height, skala: d,
    tresc_na_ekranie_od: z(y), rzedy_zakladek: rzedy,
    pasek_kompaktowy: matchMedia('(max-height: 760px)').matches,
    zakladki_dol: z(tb.bottom), ramka_gora: z(fr.top), obszar_gora: z(vp.top), naglowek_gora: z(th.top),
    ulamek: z((y + vp.top) * d % 1),
    przewiniecie: z(document.querySelector('.tableViewport').scrollTop)
  });
  console.log('POMIAR SZCZELINY: ' + window.pomiarSzczeliny);
}, 10000);
```

Co robi ten fragment: odlicza 10 sekund, a potem wyłącznie **odczytuje** położenie elementów i zapisuje wynik w konsoli oraz w zmiennej `pomiarSzczeliny`. Niczego w aplikacji nie zmienia; po odświeżeniu strony nie zostaje po nim ślad. `mozInnerScreenY` to właściwość dostępna tylko w Firefoksie — podaje, w którym miejscu ekranu zaczyna się obszar strony; w innych przeglądarkach fragment przyjmuje w tym miejscu 0. Fragment sprawdzono w Firefoksie 156 na stronie testowej z rozdz. 14.3: od razu po uruchomieniu zwraca numer odliczania, po 10 sekundach wypisuje wynik, a zmienna `pomiarSzczeliny` zawiera ten sam wynik.

**Jak poznać, że pomiar jest ważny:** druga liczba w polu `okno` powinna być bliska wysokości ekranu (na pełnym ekranie 1080, w oknie mniej o paski przeglądarki), a pole `przewiniecie` powinno być większe od 0. Jeżeli `okno` ma wysokość poniżej 520 albo `przewiniecie` wynosi 0, pomiar nie dotyczy szczeliny E i trzeba go powtórzyć.

Co odczytamy z wyniku:

| Pole | Znaczenie |
|---|---|
| `okno`, `ekran`, `skala` | Wymiary obszaru strony, ekranu i skalowanie. Różnica pola `okno` między trybami pokazuje, co zmienia pełny ekran |
| `rzedy_zakladek` | W ilu rzędach układają się przyciski zakładek. Inna liczba w obu trybach oznacza inne położenie krawędzi (rozdz. 14.4, składowa 1) |
| `pasek_kompaktowy` | Czy działa próg 760 px z rozdz. 5.1 |
| `obszar_gora`, `naglowek_gora` | Górna krawędź obszaru przewijania i nagłówka. Powinny być równe — to potwierdzenie rozdz. 14.3 na sprzęcie użytkownika |
| `ulamek` | Ułamek piksela, na którym wypada krawędź obszaru przewijania na ekranie — **najważniejsza liczba**. Jeżeli różni się między trybami, a przeciek jest tylko w jednym z nich, składowa 1 z rozdz. 14.4 jest potwierdzona |

**T2 — informacja o grafice.**

Wpisać w pasku adresu `about:support`, znaleźć sekcję **Grafika** i przepisać (albo sfotografować zrzutem ekranu) wiersze opisujące składanie obrazu — w szczególności wiersz „Kompozycja” (w wersji angielskiej „Compositing”; wartość w rodzaju „WebRender” albo „WebRender (Software)”) oraz wiersze, w których pojawia się słowo „DirectComposition”. Nazwy wierszy mogą się nieznacznie różnić między wersjami Firefoksa. Ten odczyt pokazuje, czy Firefox składa obraz kartą graficzną — a to warunek hipotezy H1.

**T3 — test rozstrzygający: przyspieszanie sprzętowe.**

1. Ustawienia Firefoksa → **Ogólne** → sekcja **Wydajność**.
2. Odznaczyć pole o zalecanych ustawieniach wydajności, a potem pole o sprzętowym przyspieszaniu („…sprzętowego przyspieszania, jeśli jest dostępne”; dokładne brzmienie może się nieznacznie różnić).
3. Zamknąć Firefoksa i uruchomić go ponownie.
4. Wejść w `DataVault` na pełnym ekranie i przewinąć tabelę.
5. **Przywrócić oba ustawienia** i ponownie uruchomić Firefoksa.

| Wynik | Znaczenie |
|---|---|
| Bez przyspieszania szczeliny nie ma, po przywróceniu wraca | **H1 potwierdzona** — przeciek powstaje przy składaniu obrazu kartą graficzną |
| Szczelina jest także bez przyspieszania | H1 osłabiona; główną wskazówką staje się T1, czyli geometria właściwa dla tego komputera |
| Ustawienie zablokowane przez organizację | Zanotować; zostają T1 i T2 |

Wyłączenie przyspieszania nie jest proponowaną naprawą — to wyłącznie test diagnostyczny. Naprawa musi działać u każdego użytkownika bez zmieniania ustawień przeglądarki.

#### 14.7.1 Pierwsza próba T1 — wynik (wiadomości 10 i 11)

Użytkownik uruchomił pierwszą, natychmiastową wersję fragmentu T1 w obu trybach, z narzędziami programisty zadokowanymi na dole okna, w trybie admina:

| Pole | Tryb okna (wiadomość 10) | Pełny ekran (wiadomość 11) |
|---|---|---|
| `okno` | **1920×191** | **1920×378** |
| `ekran` | 1920×1080 | 1920×1080 |
| `skala` | 1 | 1 |
| `tresc_na_ekranie_od` | 139 | 0 |
| `rzedy_zakladek` | 1 | 1 |
| `pasek_kompaktowy` | true | true |
| `zakladki_dol` / `ramka_gora` | 481,2 / 481,2 | 481,2 / 481,2 |
| `obszar_gora` / `naglowek_gora` | 482,2 / 482,2 | 482,2 / 482,2 |
| `ulamek` | 0,2 | 0,2 |
| `przewiniecie` | **0** | **0** |

**Dlaczego ten pomiar nie dotyczy szczeliny E.** Zadokowane narzędzia zabrały stronie prawie całą wysokość: zostało 191 i 378 px. Oba wyniki leżą poniżej progu 520 px, więc aplikacja pracowała w trybie przewijania całej strony (rozdz. 14.5) — widać to na zrzucie z wiadomości 10, gdzie panel „NARZĘDZIA” zajmuje całą szerokość nad tabelą zamiast stać obok niej. W tym trybie obszar tabeli sam się nie przewija (`przewiniecie: 0`), a nagłówek nie jest przyklejany, więc warunek powstania szczeliny E w ogóle nie zachodzi. Z tego samego powodu oba tryby dały identyczny układ strony: przyciski zakładek w jednym rzędzie na pełnej szerokości, krawędź obszaru przewijania na `482,2`. To błąd pierwotnej instrukcji, a nie wykonania — instrukcja T1 została poprawiona (fragment z odliczaniem 10 sekund).

**Co ten pomiar mimo to ustalił:**

1. **Ekran 1920×1080, skala 1** — potwierdzenie odczytu ze zrzutów (rozdz. 14.2). Szczelina E nie wynika ze skalowania ekranu.
2. **`obszar_gora` = `naglowek_gora`** co do tysięcznej piksela — na sprzęcie użytkownika układ strony jest tak samo poprawny jak w pomiarze z rozdz. 14.3 (tu w trybie przewijania strony; w trybie z przyklejonym nagłówkiem potwierdzi to poprawiony T1).
3. **Obszar strony zaczyna się na pełnym pikselu w obu trybach** — 139 punktów od góry ekranu w oknie i 0 na pełnym ekranie. Przełączenie trybu nie przesuwa więc strony o ułamek piksela; ta odmiana składowej 1 z rozdz. 14.4 odpada.
4. **Panel przeglądarki nad stroną ma w trybie okna 139 punktów.** Na ekranie 1080 punktów obszar strony w oknie ma więc bez narzędzi programisty ok. 1080 − 139 − wysokość paska zadań Windows, czyli wyraźnie ponad 760 px. Próg `max-height: 760px` najpewniej nie przełącza się między trybami — oba powinny mieć pełnowymiarowy pasek górny. Rozstrzygnie to poprawiony T1 (pole `pasek_kompaktowy`).

**Co jest jeszcze potrzebne:** poprawiony T1 w obu trybach, z zamkniętymi narzędziami programisty i przewiniętą tabelą — przede wszystkim pola `rzedy_zakladek`, `obszar_gora` i `ulamek`.

### 14.8 Kierunki naprawy — wstępnie, do wyboru po testach

Nic z poniższego nie zostało wdrożone (wiadomość 8). Kolejność od najbardziej obiecującego:

| Kierunek | Na czym polega | Za | Przeciw |
|---|---|---|---|
| **K1 — nakładka na linię ramki, poza obszarem przewijania** | Element nałożony na górną linię ramki tabeli — np. pseudoelement `::before` na `.tableWrap` (który ma już `position:relative`), o wysokości 1 px, dokładnie w miejscu linii `.tableFrame{border-top}`, z **nieprzezroczystym** tłem w barwie tej linii (`var(--div)` na czarnym tle to `rgb(4,36,2)`) i ułożony nad przewijaną treścią. Z obu stron cofnięty o promień zaokrąglenia ramki (6 px), żeby nie zmieniać jej narożników | Leży poza obszarem przewijania, więc nie jest przycinany jego granicą i zasłania dokładnie ten rząd, w którym lądują litery — barwą, którą ten rząd i tak ma. W przeglądarkach bez usterki rysuje linię identyczną z tą, którą zasłania — wygląd bez zmian. Lewe i prawe 6 px nie są potrzebne: tekst zaczyna się co najmniej 13 px od brzegu (4 px marginesu `.tableViewport` + 9 px marginesu komórki) | To jest maskowanie; w rozdz. 8.5 podobny wariant odrzucono dla szczeliny C, bo tam przyczyna leżała w kodzie aplikacji i dała się usunąć. Tu przyczyna leży w przeglądarce — w kodzie nie ma czego usunąć. **Niezweryfikowane:** skuteczność da się sprawdzić tylko na komputerze użytkownika. Nakładka musi dokładnie pokrywać się z linią ramki; to trzeba zmierzyć w obu silnikach przed wdrożeniem |
| K2 — wymuszenie krawędzi na pełnym pikselu | Takie dobranie wysokości paska górnego i paska zakładek, żeby krawędź obszaru przewijania zawsze wypadała na pełnym pikselu | Usuwa warunek, przy którym H1 w ogóle może zadziałać | Kruche: zależy od czcionki, zawijania zakładek, skalowania i gęstości ekranu; w praktyce wymaga przeliczania w JavaScripcie przy każdej zmianie okna. Nie rekomendowane |
| K3 — zostawić i opisać | Uznać szczelinę E za znane ograniczenie przeglądarki, tak jak prawą krawędź z rozdz. 12.5 | Zero ryzyka regresji | Usterka zostaje widoczna u użytkownika, który zgłosił ją jako przeszkadzającą |

**Wariant odrzucony po ustaleniu 5 z rozdz. 14.2:** linia zabezpieczająca doczepiona do samego nagłówka, np. dodatkowy cień zewnętrzny nad komórkami pierwszego wiersza (pierwsza wersja kierunku K1). Nagłówek leży wewnątrz obszaru przewijania, więc taki cień jest prostokątem przycinanym granicą tego obszaru — tak samo jak tła wierszy, które, jak zmierzono, nie wychodzą poza granicę ani o punkt. Cień zostałby więc ucięty dokładnie tam, gdzie miał zasłaniać litery. Zasłona musi leżeć poza obszarem przewijania, stąd obecna postać K1.

Wybór kierunku nastąpi po wynikach T1–T3 i testów na tablecie. Jeżeli T3 potwierdzi H1, rekomendowany będzie K1, wdrożony tą samą procedurą co poprzednie poprawki: kontrola na kodzie sprzed zmiany, skan całego pasma nagłówka i kontrola negatywna (rozdz. 13.4), a na końcu potwierdzenie na sprzęcie użytkownika w oknie i na pełnym ekranie.

### 14.9 Ryzyka i następne kroki

| Ryzyko | Ocena | Uzasadnienie |
|---|---|---|
| Błędna diagnoza szczeliny E | **Średnie** | Usterki nie udało się odtworzyć w środowisku analizy; H1 opiera się na zrzutach i na wykluczeniu innych przyczyn. Test T3 obniża to ryzyko do niskiego |
| Naprawa skuteczna tylko w jednym trybie albo przy jednym położeniu krawędzi | **Średnie** | Szczelina zależy od położenia krawędzi (rozdz. 14.4). Każdą naprawę trzeba obejrzeć w oknie i na pełnym ekranie, a w miarę możliwości także przy innej liczbie rzędów zakładek (np. w węższym oknie) |
| Nowe szczeliny na tablecie | **Średnie** | Ułamkowa gęstość pikseli razem z trybem „na komputer” to warunki, których dotąd nie mierzono (rozdz. 14.6) |
| Zmiana zachowania telefonu w poziomie | **Brak** | Użytkownik zdecydował zostawić bez zmian (wiadomość 9, rozdz. 14.5) |
| Nieważny wynik T1 | **Niskie** po poprawce instrukcji | Pierwsza próba zmierzyła tryb przewijania strony zamiast trybu z przyklejonym nagłówkiem (rozdz. 14.7.1). Poprawiony fragment czeka 10 s, a instrukcja podaje, po czym poznać ważny pomiar |
| Testy zablokowane przez zasady organizacji | **Niskie** | Firefox jest zarządzany przez organizację. Jeżeli T1 lub T3 okażą się niedostępne, diagnoza zostanie oparta na pozostałych testach i zrzutach |

Następne kroki:

1. **Testy na tablecie** według rozdz. 14.6 — zapowiedziane przez użytkownika.
2. **Testy T1–T3 w Firefoksie** na komputerze według rozdz. 14.7 — zapowiedziane przez użytkownika (wiadomość 9). T1 w poprawionej wersji, z odliczaniem 10 sekund, w obu trybach; pierwsza próba (rozdz. 14.7.1) wymaga powtórzenia.
3. ~~**Potwierdzenie**, w jakiej przeglądarce powstały obserwacje z wiadomości 3, 6 i 7.~~ **Wykonane** — wiadomość 9; wnioski w rozdz. 14.4.
4. ~~**Decyzja użytkownika** co do telefonu w poziomie.~~ **Wykonane** — zostaje bez zmian (wiadomość 9, rozdz. 14.5).
5. Po zebraniu wyników — dopisanie ustaleń do tej analizy i wybór kierunku naprawy z rozdz. 14.8.

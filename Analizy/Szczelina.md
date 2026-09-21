# 🇵🇱 Szczelina w nagłówku tabeli DataVault — analiza (PL)

## 1. Metryka

| | |
|---|---|
| **Data analizy** | 21 września 2026 |
| **Temat** | Szczelina (prześwit) w pasmie między paskiem zakładek a nagłówkiem tabeli w module `DataVault`; przesuwanie się tekstów nagłówka przy przewijaniu |
| **Moduł** | `DataVault` |
| **Zakres** | `DataVault/style.css` — reguły `.tabs`, `.tableWrap`, `.tableFrame`, `.tableViewport`, `.dataTable`, `.dataTable thead`, `.dataTable thead th`; zachowanie przyklejonego nagłówka przy przewijaniu; wpływ wysokości okna i skalowania ekranu |
| **Poza zakresem** | Zmiany z commita `409cde3` (filtr globalny, barwy sygnałów, własne pole wyboru) — użytkownik wyraźnie zastrzegł, żeby ich nie ruszać. Widok kart na telefonie (`@media (max-width: 720px)`) — tam `thead` jest ukryty, więc problem nie występuje |
| **Metoda** | Pomiar geometrii (`getBoundingClientRect`) oraz sonda pikselowa: zrzut pasma nagłówka i odczyt średniej barwy każdego wiersza device-pikseli; kontrolowane wyłączanie pojedynczych deklaracji CSS i kolorowanie poszczególnych elementów, żeby ustalić, który element maluje który piksel; test przecieku z wierszami przemalowanymi na jaskrawą czerwień |
| **Konfiguracje testowe** | 8 rozmiarów okna od 1280×610 do 1920×1080, skalowanie 100%, 125%, 150% i 200%, 4–5 pozycji przewinięcia |
| **Stan repozytorium** | `HEAD` = `38d7668` (gałąź `claude/charming-meitner-45xuh7`, zsynchronizowana z `main`) |
| **Zmiany w kodzie** | **Żadne.** Ten dokument tylko opisuje i proponuje |
| **Analiza siostrzana** | `Analizy/responsywnosc-aplikacji-2026-09-10.html`, rozdział 14 — pierwszy opis szczelin w przyklejonym nagłówku |

### Główny wniosek

Poprawka z commita `38d7668` **zamknęła przeciek treści wierszy** — po niej w żadnej z 8 przebadanych konfiguracji nie przecieka ani jeden piksel wiersza. Ale **nie usunęła przyczyny**, tylko ją przykryła, i wprowadziła nowy, widoczny skutek uboczny.

Zostały dwa objawy, oba mające **to samo źródło**: górne obramowanie tabeli (`.dataTable{border:1px solid var(--div)}`) przy `border-collapse:collapse` przesuwa górną krawędź `<thead>` o **pół piksela** w dół względem krawędzi obszaru przewijania.

1. **Ciemna szczelina 1 px** między jasną linią obramowania a nazwą kolumny. Widoczna **tylko wtedy, gdy górna krawędź `.tableFrame` wypada na pełnym pikselu** — a to zależy od wysokości okna. Stąd obserwacja użytkownika, że na pełnym ekranie szczelina jest, a w oknie jej nie ma.
2. **Nagłówek przeskakuje o 1,5 px w górę** w chwili przyklejenia. To bezpośredni skutek poprawki `top:-1px` i występuje w **każdej** konfiguracji. To jest dokładnie to, co użytkownik opisał jako „teksty nagłówków delikatnie jakby przesuwały się w górę".

Rekomendowane rozwiązanie (rozdz. 8) usuwa **oba** objawy jednocześnie, bo likwiduje półpikselowe przesunięcie zamiast je maskować. Zmierzone: przesunięcie nagłówka 0,00 px i zero przeciekających pikseli we wszystkich 8 konfiguracjach.

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

### Materiał dowodowy od użytkownika

Do wiadomości 2 dołączono zrzuty ekranu. Pokazywały:

- pasmo między przyciskami zakładek a wierszem z nazwami kolumn, z widoczną cienką ciemną linią biegnącą przez całą szerokość tabeli;
- dwa zrzuty tej samej zakładki do porównania: pierwszy przy przewinięciu maksymalnie w górę (stan zaraz po wejściu w zakładkę), drugi po przewinięciu w dół. Napisy w nagłówku na drugim zrzucie stoją odrobinę wyżej niż na pierwszym.

Obie obserwacje udało się odtworzyć pomiarem i obie zostały potwierdzone liczbowo w rozdziale 7.

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

**Odrzucony wariant:** rozważano usunięcie górnego obramowania tabeli (`.dataTable{border-top:0}`). Zamykało szczelinę równie skutecznie, ale zmieniało wygląd tabeli nieprzewiniętej, więc odpadło. **Ta decyzja okazała się błędna i rozdział 8 ją odwraca** — patrz rozdz. 8.2, gdzie policzono, jak duża naprawdę jest ta zmiana wyglądu.

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

**Wariant F — propozycja** (`.dataTable{border-top:0}` + `thead{top:0}`):

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

### 8.4 Warianty odrzucone

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
| Zmiana wyglądu nieprzewiniętej tabeli | **Niskie, ale realne** | Znika jedna z trzech sąsiadujących linii poziomych nad nagłówkiem (rozdz. 8.3). Jest to zmiana zauważalna przy skalowaniu 100%, praktycznie niewidoczna przy 125% i 150%. Wymaga akceptacji użytkownika przed wdrożeniem |
| Konflikt ze zmianami z commita `409cde3` | **Brak** | Sprawdzone: commit `409cde3` (filtr globalny, barwy sygnałów, pole wyboru) nie dotyka geometrii nagłówka. Zmiana z rozdz. 8.1 obejmuje dwie deklaracje w regułach `.dataTable` i `.dataTable thead`, których tamten commit nie modyfikował |
| Wpływ na widok kart na telefonie | **Brak** | W `@media (max-width: 720px)` obowiązuje `.dataTable thead{display:none}` — nagłówka nie ma, więc ani `top`, ani `border-top` nie mają tam zastosowania |
| Wpływ na szczelinę B (między wierszami nagłówka) | **Brak** | Szczelina B wynika z przyklejenia całego `<thead>` jako jednego bloku, co zostaje bez zmian. Zmierzona wartość 0,00 px pozostaje |
| Regresja przecieku przy nietypowej wysokości okna | **Niskie** | Wariant F sprawdzony na 8 konfiguracjach z pomiarem przecieku i 16 konfiguracjach z profilem barwnym, w tym w obu przypadkach ułamka krawędzi (0,000 i 0,813). Wszędzie zero |
| Inna przeglądarka niż silnik Chromium | **Średnie** | Pomiary wykonano na silniku Chromium. Model scalonych obramowań jest w standardzie CSS, więc zachowanie powinno być takie samo, ale zaokrąglanie subpikselowe bywa różne. Warto obejrzeć wynik także w Firefoksie, jeżeli jest używany |

---

## 10. Następne kroki

1. **Decyzja użytkownika** co do kosztu wizualnego z rozdz. 8.3: czy zgoda na to, żeby nad nagłówkiem były dwie linie poziome zamiast trzech, w zamian za brak szczeliny i brak przeskoku nagłówka.
2. Po akceptacji: wdrożenie zmiany z rozdz. 8.1 (dwie deklaracje w `DataVault/style.css` plus wymiana komentarza dwujęzycznego przy `thead{top}`).
3. Aktualizacja `DetaleLayout.md` — obecnie opisuje rozwiązanie z `top:-1px` i zawiera dwa wiersze w tabelach „Zmierzony efekt" dotyczące tej poprawki. Zgodnie z zasadami 8 i 15 z `AGENTS.md` musi opisywać stan aktualny, nie historię.
4. Sprawdzenie na sprzęcie użytkownika w obu trybach — pełny ekran i okno — bo próg zapytania medialnego `max-height: 760px` wypada w innym miejscu przy każdym ustawieniu skalowania w Windows.
5. Do rozważenia niezależnie od powyższego: próg `max-height: 760px` przełącza pasek górny skokowo i to on odpowiada za to, że układ raz wypada na pełnym pikselu, a raz na ułamku. Nie jest to błąd, ale warto o tym pamiętać przy każdej przyszłej zmianie wysokości paska górnego — przesunięcie progu przesunie też granicę, na której zmienia się zachowanie subpikselowe.

---
---

# 🇬🇧 The slit in the DataVault table header — analysis (EN)

## 1. Record card

| | |
|---|---|
| **Date of analysis** | 21 September 2026 |
| **Topic** | A slit (light leak) in the band between the tab strip and the table header in the `DataVault` module; header texts shifting while scrolling |
| **Module** | `DataVault` |
| **Scope** | `DataVault/style.css` — the `.tabs`, `.tableWrap`, `.tableFrame`, `.tableViewport`, `.dataTable`, `.dataTable thead` and `.dataTable thead th` rules; sticky-header behaviour while scrolling; the effect of window height and display scaling |
| **Out of scope** | The changes from commit `409cde3` (global filter, signal colours, custom checkbox) — the user explicitly asked for them to be left alone. The phone card view (`@media (max-width: 720px)`) — `thead` is hidden there, so the problem cannot occur |
| **Method** | Geometry measurement (`getBoundingClientRect`) plus a pixel probe: a screenshot of the header band with the mean colour of every device-pixel row read back; controlled disabling of individual CSS declarations and colour-tagging of individual elements to establish which element paints which pixel; a leak test with table rows repainted bright red |
| **Test configurations** | 8 window sizes from 1280×610 to 1920×1080, scaling at 100%, 125%, 150% and 200%, 4–5 scroll positions |
| **Repository state** | `HEAD` = `38d7668` (branch `claude/charming-meitner-45xuh7`, in sync with `main`) |
| **Code changes** | **None.** This document only describes and proposes |
| **Sister analysis** | `Analizy/responsywnosc-aplikacji-2026-09-10.html`, chapter 14 — the first description of the sticky-header slits |

### Main conclusion

The fix in commit `38d7668` **closed the row-content leak** — after it, not a single row pixel leaks in any of the 8 configurations tested. But it **did not remove the cause**, only covered it, and it introduced a visible side effect.

Two symptoms remain, both from **the same source**: with `border-collapse:collapse`, the table's own top border (`.dataTable{border:1px solid var(--div)}`) pushes the top edge of `<thead>` **half a pixel** below the edge of the scrollport.

1. **A 1 px dark slit** between the bright border line and the column name. Visible **only when the top edge of `.tableFrame` lands on a whole pixel** — which depends on the window height. Hence the user's observation that the slit is there in fullscreen but not in a window.
2. **The header jumps 1.5 px upwards** the moment it sticks. This is a direct consequence of the `top:-1px` fix and it happens in **every** configuration. This is exactly what the user described as "the header texts seem to shift slightly upwards".

The recommended solution (chapter 8) removes **both** symptoms at once, because it eliminates the half-pixel offset instead of masking it. Measured: 0.00 px header shift and zero leaked pixels across all 8 configurations.

---

## 2. The user's prompts in full

Recorded without shortening, per rule 10 of `AGENTS.md`. The prompts were written in Polish; they are reproduced verbatim below, with a translation underneath each one.

> **Message 1 — the fix request**
>
> Możesz jeszcze "załatać" lukę między nagłówkiem kolumny a panelem zakładek? Przed chwilą były też poprawki w repo dotyczące filtrów, kolorów itp - tego nie ruszaj. Napraw tylko jedną szczelinę.
>
> *Translation: Could you also "patch" the gap between the column header and the tab panel? There were also fixes in the repo a moment ago about filters, colours and so on — do not touch those. Fix just the one slit.*

> **Message 2 — the request for this analysis**
>
> PPrzygotuj nową analizę o nazwie "Szczelina.md" w folderze "Analizy". Zapisz tam wszystkie ustalenia dotyczące problemu oraz tego jak go naprawiałeś. Do analizy dopisz też, że problem nie zniknął całkowicie. Obecnie szczelina jest między nazwą kolumny a przyciskami do zmiany zakładek. Załączam screeny. Dodatkowo coś dziwnego dzieje się z nagłówkiem tabeli. Przy użyciu scrolla jakby delikatnie zmieniał pozycję. Załączam dwa screeny. Jeden jak scroll jest maksymalnie w górę (tak jak jest od razu po wejściu w zakładkę) i drugi po użyciu scrolla w dół. Teksty nagłówków delikatnie jakby przesuwały się w górę. Dopisz to do analizy.
>
> *Translation: Prepare a new analysis called "Szczelina.md" in the "Analizy" folder. Record there all the findings about the problem and about how you were fixing it. Also add to the analysis that the problem has not gone away completely. Right now the slit is between the column name and the tab-switching buttons. Screenshots attached. In addition, something odd is happening with the table header. When using the scroll it seems to change position slightly. Two screenshots attached. One with the scroll fully up (as it is right after entering the tab) and one after scrolling down. The header texts seem to shift slightly upwards. Add this to the analysis.*

> **Message 3 — a further observation**
>
> Jeszcze jedna uwaga - wygląda, że ta szczelina jest widoczna tylko w na pełnym ekranie przeglądarki. Przy widoku w oknie wygląda ok. Ale wciąż teksty kolumn przesuwają się nieco w górę.
>
> *Translation: One more remark — it looks like the slit is visible only in browser fullscreen. In windowed view it looks fine. But the column texts still shift slightly upwards.*

### Evidence supplied by the user

Screenshots were attached to message 2. They showed:

- the band between the tab buttons and the row of column names, with a thin dark line visible across the full width of the table;
- two screenshots of the same tab for comparison: the first scrolled fully up (the state right after entering the tab), the second after scrolling down. The header captions in the second screenshot sit slightly higher than in the first.

Both observations were reproduced by measurement and both are confirmed numerically in chapter 7.

---

## 3. Anatomy of the header band — which element paints which pixel

To talk about the slit precisely, one needs to know what the few pixels between the bottom edge of the tab buttons and the first letter of a column name are made of. This was established by colour-tagging: each suspect element in turn was given a vivid colour and the device-pixel row that changed colour was recorded.

Measured at a 1536×700 window, 100% scaling, table unscrolled, top edge of `.tableFrame` at `y = 153`:

| y | What is there | Measured colour (R,G,B) | Element responsible |
|---|---|---|---|
| 151 | workspace background | `1,6,0` | `.tableWrap{background: linear-gradient(...)}` |
| 152 | bottom line of the tab strip | `4,40,2` | `.tabs{border-bottom:1px solid var(--div)}` |
| 153 | top line of the table frame | `4,36,2` | `.tableFrame{border-top:1px solid var(--div)}` |
| 154 | the table's own border | `4,45,2` | `.dataTable{border:1px solid var(--div)}` + `.tableFrame{box-shadow: inset ...}` |
| **155** | **first row of the header background — darker than the rest** | **`1,11,0`** | **`.dataTable thead th{background-image: linear-gradient(...)}`** |
| 156 | header background, target value | `2,15,1` | the same background |
| 157 | header background | `2,15,1` | the same background |

Row **155** is the key one. The colour-tagging test showed it is painted by the header cell background (after repainting `th` yellow, row 155 turned yellow along with 156 and 157). And yet it is **darker** than the two rows below it: `11` instead of `15` in the green channel. The header background gradient runs from lighter to darker, so its **first** row should be the **brightest**, not the darkest.

That deviation is the slit. It is a **partial-coverage** row, and it exists because the top edge of `<thead>` does not land on a whole pixel but half a pixel lower.

### Where the half pixel comes from

```css
.dataTable{
  border-collapse:collapse;       /* collapsed borders */
  border:1px solid var(--div);    /* the border belongs to the table, not to the cells */
}
```

With `border-collapse: collapse` the outer border **belongs to the table**, and adjacent cell borders are collapsed into it. The browser draws such a collapsed edge **centred on the table's box boundary**, so half its thickness falls above the first row and half below it.

The consequence is measurable and always the same:

```
.tableViewport content top edge   = 154.0
.dataTable     box top edge       = 154.0
.dataTable thead top edge         = 154.5   ← half a pixel lower
```

That **half pixel** is the entire source of the problem. Everything below follows from it.

---

## 4. History of the problem — three slits, three fixes

The problem was reported in stages and fixed in stages. For the record, the whole history in one place.

### 4.1 Slit A — the scrollport's top padding

**Symptom:** while scrolling, fragments of rows travelled past just under the button strip, in a band a few pixels high.

**Cause:** `.tableViewport` had top padding. A sticky element stops at the **inner content edge** of its scrolling container, not at its visible border. Top padding therefore pushed the header down by its own height and left an exposed band above it, through which the scrolling content was visible.

**Fix:** remove the top padding:

```css
.tableViewport{ padding: 0 4px 4px; }
```

The absent top padding is **deliberate** and is documented as such in a comment in the file. It is not an oversight and must not be "corrected".

### 4.2 Slit B — between the column-name row and the filter row

**Symptom:** a hairline between the two header rows, through which passing content was visible.

**Cause:** the two header rows were stuck **independently of each other** — the first at `top: 0`, the second at `top: var(--header-row-height)`, where the height of the first row was measured in JavaScript by a `ResizeObserver` and written into a CSS variable. The measured value was rounded, the real row height was not. A difference of a fraction of a pixel was enough to leave a gap between the rows.

**Fix:** stick the **whole `<thead>`** as a single block instead of each row separately. Both rows then move together and cannot drift apart:

```css
.dataTable thead{ position:sticky; top:0; z-index:3; background-color:var(--panel); }
.dataTable thead th{ position:static; }   /* cells must not be sticky themselves */
```

`--header-row-height` was removed from `:root`, along with the `ResizeObserver` measuring the row height and the `top:` rule on the second header row. Measured result: slit **0.00 px**, and it has stayed that way.

### 4.3 Slit C — the band under the tab strip (commit `38d7668`)

**Symptom:** while scrolling, a line of the passing row was visible at the very top of the scrollport, across the full width of the table. Measured: 1 px at 100% scaling and 1.3 px at 150%.

**Cause:** the half pixel described in chapter 3. The header background started at `154.5`, while the scrollport edge was at `154.0`. In the band `154.0–154.5` there was **no** header element that could cover it, so a row travelled through.

**Fix:** stick the header one pixel higher, so that its opaque background reaches the very edge:

```css
.dataTable thead{
  top:-1px;      /* was: top:0 */
  z-index:3;
  background-color:var(--panel);
}
```

**Verification of the fix:** the table rows were repainted bright red and the red pixels in the band above the header were counted. Before the fix: 490 leaked pixels at 100% scaling and 1468 at 150%. After the fix: **0** at 100%, 125%, 150% and 200% scaling, across four scroll positions. Slit B stayed at 0.00 px.

**Rejected variant:** removing the table's top border (`.dataTable{border-top:0}`) was considered. It closed the slit just as effectively but changed the look of the unscrolled table, so it was dropped. **That decision turned out to be wrong and chapter 8 reverses it** — see chapter 8.3, where the size of that visual change is actually quantified.

---

## 5. What remains after the fix — symptom 1: the dark slit next to the column name

The `top:-1px` fix works **only while the header is stuck**, that is at `scrollTop > 0`. With the table unscrolled the `top` rule does not apply at all and the header sits where the layout puts it — at `154.5`, half a pixel below the edge.

And that is exactly where, at rest, the partial-coverage dark row from chapter 3 sits.

### 5.1 Why only in fullscreen

This is the most interesting part, and the user's observation turned out to be accurate. The dark row appears **only when the top edge of `.tableFrame` lands on a whole pixel value**. If it lands on a fraction, the browser spreads the colour across two device-pixel rows anyway and the deviation blurs enough to stop reading as a line.

Measured across 16 window configurations (the "profile" column is the mean green channel of consecutive device-pixel rows, starting from the row holding the tab strip's bottom line):

| Window | `.tableFrame` top edge | Fraction | Profile at `scrollTop = 0` | Dark slit |
|---|---|---|---|---|
| 1280×700 | 193.000 | 0.000 | 40 · 36 · 45 · **11** · 15 · 15 | **YES** |
| 1280×864 | 290.813 | 0.813 | 40 · 36 · 45 · 15 · 15 · 15 | no |
| 1366×700 | 153.000 | 0.000 | 40 · 36 · 45 · **11** · 15 · 15 | **YES** |
| 1366×864 | 290.813 | 0.813 | 40 · 36 · 45 · 15 · 15 · 15 | no |
| 1440×700 | 153.000 | 0.000 | 40 · 36 · 45 · **11** · 15 · 15 | **YES** |
| 1440×864 | 244.813 | 0.813 | 40 · 36 · 45 · 15 · 15 · 15 | no |
| 1536×700 | 153.000 | 0.000 | 40 · 36 · 45 · **11** · 15 · 15 | **YES** |
| 1536×864 | 244.813 | 0.813 | 40 · 36 · 45 · 15 · 15 · 15 | no |
| 1600×700 | 153.000 | 0.000 | 40 · 36 · 45 · **12** · 16 · 15 | **YES** |
| 1600×864 | 244.813 | 0.813 | 40 · 36 · 45 · 16 · 15 · 15 | no |
| 1680×700 | 153.000 | 0.000 | 40 · 36 · 45 · **11** · 15 · 15 | **YES** |
| 1680×864 | 244.813 | 0.813 | 40 · 36 · 45 · 15 · 15 · 15 | no |
| 1728×700 | 115.000 | 0.000 | 40 · 36 · 45 · **12** · 16 · 15 | **YES** |
| 1728×864 | 244.813 | 0.813 | 40 · 36 · 45 · 16 · 15 · 15 | no |
| 1920×700 | 115.000 | 0.000 | 40 · 36 · 45 · **12** · 16 · 15 | **YES** |
| 1920×864 | 184.813 | 0.813 | 40 · 36 · 45 · 16 · 15 · 15 | no |

The pattern is unambiguous and **does not depend on the window's width, only on its height**. The switching point is the media query that puts the top bar into compact mode:

```css
@media (max-height: 760px){
  .topbar{ padding:8px 16px; gap:8px }
  .actionsNote{ display:none }
  .sigil{ width:32px; height:32px }
  .btn{ padding:7px 10px }
}
```

At a window height up to 760 px the top bar is shorter and built entirely of whole pixels, so `.tableFrame` lands on a round value → **slit visible**. Above 760 px the full-size bar takes over, and its text line heights produce the fraction `0.813` → **slit blurred and invisible**.

Toggling the browser between fullscreen and a window changes the viewport height by the height of the browser's own bars — which either carries the user across that boundary or changes the fraction. That explains why the slit shows in one mode and not the other. Exactly where the boundary falls on a given machine additionally depends on the Windows display scaling (100%, 125%, 150%, 175%), which divides the screen's physical height by the scaling factor. **The mechanism is the same; only the threshold moves.**

This matters, because it means the problem is **random from the user's point of view**: the same application on the same computer looks fine or broken depending on whether the window is maximised.

---

## 6. What remains after the fix — symptom 2: the header jumps while scrolling

This is the **direct cost of the `top:-1px` fix** and it happens always, in every configuration.

### 6.1 The arithmetic

| State | Where the top edge of `<thead>` sits | Why |
|---|---|---|
| `scrollTop = 0` (table unscrolled) | `154.5` | The `top` rule does not apply, because the header is not stuck yet. It sits where the layout puts it: half a pixel below the table box edge, because of the collapsed border |
| `scrollTop > 0` (header stuck) | `153.0` | `top:-1px` pins the header box **one pixel above** the scrollport's content edge (`154.0`) |
| **Difference** | **−1.5 px** | The header and its captions jump one and a half pixels up the moment the wheel moves |

One and a half, not one, because it covers two things at once: half a pixel of the collapsed border **plus** the full pixel of the negative `top`.

### 6.2 Measurement

The top edge of the first header cell was measured relative to its position at `scrollTop = 0`, at five scroll positions (1, 37, 120, 400 and 900 px):

| Window | Scaling | Header shift |
|---|---|---|
| 1536×730 | 100% | −1 · −1.5 · −1.5 · −1.5 · −1.5 px |
| 1536×864 | 100% | −1 · −1.5 · −1.5 · −1.5 · −1.5 px |
| 1920×1080 | 100% | −1 · −1.5 · −1.5 · −1.5 · −1.5 px |
| 1366×768 | 100% | −1 · −1.5 · −1.5 · −1.5 · −1.5 px |
| 1536×864 | 125% | −1 · −1.5 · −1.5 · −1.5 · −1.5 px |
| 1536×864 | 150% | −1 · −1.5 · −1.5 · −1.5 · −1.5 px |
| 1280×610 | 100% | −1 · −1.5 · −1.5 · −1.5 · −1.5 px |
| 1280×720 | 200% | −1 · −1.5 · −1.5 · −1.5 · −1.5 px |

At a 1 px scroll the shift is exactly −1 px, because the header has not yet detached by the full amount; from 37 px upwards it settles at −1.5 px and no longer changes.

It is worth noting that **before** the `38d7668` fix the same measurement gave −0.5 px. The header therefore jumped before as well, only three times less and so imperceptibly. The fix did not create the phenomenon from nothing — it **tripled it**, until it became visible to the naked eye.

### 6.3 A second, less obvious effect

At `scrollTop = 0` a bright `45` line is visible above the header — the table's own border. After scrolling, the header with its opaque background **covers that line** and the profile changes from `40 · 36 · 45 · 15` to `40 · 36 · 15`. So while scrolling, not only do the captions move up, but **one of the horizontal lines above the header disappears**. This adds to the impression that "something odd is happening with the header".

The phenomenon occurs in all 16 window configurations tested, including those where the dark slit is not visible. That explains why the user wrote that there is no slit in a window but the **texts still move**.

---

## 7. Measurements — three variants side by side

Three variants measured by the same method, in the same 8 configurations. "Leak" is the number of red pixels in the band above the header after the table rows were repainted bright red, summed over four scroll positions.

**Variant E — the state before commit `38d7668`** (`.dataTable{border:1px}` + `thead{top:0}`):

| Window | Scaling | Header shift | Leak |
|---|---|---|---|
| 1536×730 | 100% | −0.5 px | **2556** |
| 1536×864 | 100% | −0.5 px | 0 |
| 1920×1080 | 100% | −0.5 px | 0 |
| 1366×768 | 100% | −0.5 px | 0 |
| 1536×864 | 125% | −0.5 px | 0 |
| 1536×864 | 150% | −0.5 px | 0 |
| 1280×610 | 100% | −0.5 px | **2044** |
| 1280×720 | 200% | −0.5 px | **8176** |

The same pattern as in chapter 5 is visible here: the leak appeared only at window heights up to 760 px, where the frame edge lands on a whole pixel.

**Variant A — the current state** (`.dataTable{border:1px}` + `thead{top:-1px}`):

| Window | Scaling | Header shift | Leak |
|---|---|---|---|
| 1536×730 | 100% | **−1.5 px** | 0 |
| 1536×864 | 100% | **−1.5 px** | 0 |
| 1920×1080 | 100% | **−1.5 px** | 0 |
| 1366×768 | 100% | **−1.5 px** | 0 |
| 1536×864 | 125% | **−1.5 px** | 0 |
| 1536×864 | 150% | **−1.5 px** | 0 |
| 1280×610 | 100% | **−1.5 px** | 0 |
| 1280×720 | 200% | **−1.5 px** | 0 |

The leak is closed completely, but the header shift has tripled and occurs everywhere.

**Variant F — the proposal** (`.dataTable{border-top:0}` + `thead{top:0}`):

| Window | Scaling | Header shift | Leak |
|---|---|---|---|
| 1536×730 | 100% | **0 px** | 0 |
| 1536×864 | 100% | **0 px** | 0 |
| 1920×1080 | 100% | **0 px** | 0 |
| 1366×768 | 100% | **0 px** | 0 |
| 1536×864 | 125% | **0 px** | 0 |
| 1536×864 | 150% | **0 px** | 0 |
| 1280×610 | 100% | **0 px** | 0 |
| 1280×720 | 200% | **0 px** | 0 |

Zero and zero in all eight configurations.

The same variant checked across the full set of 16 window sizes from chapter 5 — the header band profile is **identical at rest and after scrolling**, at every size, and there is no dark row anywhere:

| Window | Edge fraction | Profile `scrollTop = 0` | Profile `scrollTop = 400` | Dark slit |
|---|---|---|---|---|
| 1280×700 | 0.000 | 40 · 36 · 16 · 15 · 15 | 40 · 36 · 16 · 15 · 15 | no |
| 1366×700 | 0.000 | 40 · 36 · 16 · 15 · 15 | 40 · 36 · 16 · 15 · 15 | no |
| 1536×700 | 0.000 | 40 · 36 · 16 · 15 · 15 | 40 · 36 · 16 · 15 · 15 | no |
| 1920×700 | 0.000 | 40 · 36 · 16 · 15 · 15 | 40 · 36 · 16 · 15 · 15 | no |
| 1280×864 | 0.813 | 40 · 36 · 15 · 15 · 15 | 40 · 36 · 15 · 15 · 15 | no |
| 1536×864 | 0.813 | 40 · 36 · 15 · 15 · 15 | 40 · 36 · 15 · 15 · 15 | no |
| 1920×864 | 0.813 | 40 · 36 · 15 · 15 · 15 | 40 · 36 · 15 · 15 · 15 | no |
| 1536×864 @150% | 0.813 | 40 · 21 · 36 · 15 · 15 | 40 · 21 · 36 · 15 · 15 | no |

---

## 8. Recommendation

### 8.1 The proposed change

Two declarations in `DataVault/style.css`:

```css
.dataTable{
  width:100%;
  border-collapse:collapse;
  font-size:13px;
  border:1px solid var(--div);
  border-top:0;              /* ← ADDED */
  box-shadow:var(--glow);
}

.dataTable thead{
  position:sticky;
  top:0;                     /* ← CHANGED back from -1px to 0 */
  z-index:3;
  background-color:var(--panel);
}
```

The bilingual comment at `thead{top}` must be replaced along with it, because the present one describes the `-1px` solution that will no longer exist (rule 7 of `AGENTS.md`: comments describing behaviour that no longer exists must not be left behind).

### 8.2 Why it works

It removes the **cause**, not the effect. Without the table's top border there is no collapsed edge to split in half, so:

```
.tableViewport content top edge   = 154.0
.dataTable     box top edge       = 154.0
.dataTable thead top edge         = 154.0   ← no offset
```

Since the header already sits exactly on the scrollport edge at rest, `top:0` does not move it when it sticks. Hence the 0.00 px shift. And since there is no half-pixel offset, there is no partial-coverage row either — hence no dark slit, whatever the window height.

### 8.3 The visual cost — measured, not estimated

In commit `38d7668` this variant was rejected on the grounds that it "changes the look of the unscrolled table". That was true, but without a number. The number is this:

| | Before | After |
|---|---|---|
| Bottom line of the tab strip (`.tabs`) | green **40** | green **40** — unchanged |
| Top line of the frame (`.tableFrame`) | green **36** | green **36** — unchanged |
| The table's own border | green **45** | green **16** — **disappears** |
| First row of the header background | green **11** (dark slit) | green **15–16** — correct |

What disappears is the **third consecutive 1 px horizontal line**, sitting directly beneath two other lines of the same `var(--div)` colour — the bottom edge of the tab strip and the top edge of the table frame. The top edge of the table is therefore still closed off, just by two lines instead of three. In exchange, the dark slit that stood directly beneath that line disappears — and it was **more conspicuous** than the line itself, because a dark break in a bright band shows up better than one bright line fewer.

At 125% and 150% scaling, where three converging lines blur into a single band anyway, the difference is practically unnoticeable.

**The change affects only the top edge.** The table's side and bottom borders stay as they are, because `border-top:0` after `border:1px` cancels the top edge alone.

### 8.4 Rejected variants

| Variant | Why it is out |
|---|---|
| Keep `top:-1px` and live with the jump | The jump is visible to the naked eye; the user reported it unprompted. It does not go away at any window height |
| `top:-0.5px` instead of `-1px` | It would cancel the jump but leaves the cause in place: the header still sits on a half-pixel boundary, so the partial-coverage row and the dark slit remain. Fractional `top` values also behave differently across browsers |
| Remove `.tableFrame{border-top}` instead of the table border | Does not help. That line lies **outside** the scrollport, so it has no influence whatsoever on the header position. Measured: the dark row stays |
| Remove `.tableFrame{box-shadow: inset}` | Likewise — measured, the bright line dims from 45 to 36, the dark row stays |
| `border-collapse: separate` on the table | It resolves the half-pixel offset but rebuilds **every** border in the table: double lines between cells, a different grid, a different look for the whole module. Disproportionately large a change for one pixel |
| An extra element covering the band (e.g. `::before` on `.tableFrame`) | Masking the symptom with yet another layer. It does not remove the header jump and adds an element to maintain |

---

## 9. Risks

| Risk | Assessment | Reasoning |
|---|---|---|
| Change to the look of the unscrolled table | **Low but real** | One of three adjacent horizontal lines above the header disappears (chapter 8.3). It is a noticeable change at 100% scaling and practically invisible at 125% and 150%. It needs the user's acceptance before implementation |
| Conflict with the changes from commit `409cde3` | **None** | Checked: commit `409cde3` (global filter, signal colours, checkbox) does not touch the header geometry. The change in chapter 8.1 covers two declarations in the `.dataTable` and `.dataTable thead` rules, which that commit did not modify |
| Effect on the phone card view | **None** | Inside `@media (max-width: 720px)` the rule `.dataTable thead{display:none}` applies — there is no header, so neither `top` nor `border-top` has any effect there |
| Effect on slit B (between the header rows) | **None** | Slit B is resolved by sticking the whole `<thead>` as one block, which stays unchanged. The measured 0.00 px remains |
| Leak regression at an unusual window height | **Low** | Variant F was checked across 8 configurations with a leak measurement and 16 configurations with a colour profile, including both edge-fraction cases (0.000 and 0.813). Zero everywhere |
| A browser other than the Chromium engine | **Medium** | The measurements were taken on the Chromium engine. The collapsed-border model is part of the CSS standard, so the behaviour should be the same, but sub-pixel rounding does vary. Worth looking at the result in Firefox too, if it is used |

---

## 10. Next steps

1. **A decision from the user** on the visual cost in chapter 8.3: whether it is acceptable to have two horizontal lines above the header instead of three, in exchange for no slit and no header jump.
2. Once accepted: implement the change from chapter 8.1 (two declarations in `DataVault/style.css` plus replacing the bilingual comment at `thead{top}`).
3. Update `DetaleLayout.md` — it currently describes the `top:-1px` solution and contains two rows in the "measured result" tables covering that fix. Under rules 8 and 15 of `AGENTS.md` it must describe the current state, not the history.
4. Check on the user's own hardware in both modes — fullscreen and windowed — because the `max-height: 760px` media query threshold falls in a different place for every Windows scaling setting.
5. Worth considering independently of the above: the `max-height: 760px` threshold switches the top bar abruptly, and it is what makes the layout land on a whole pixel in one case and on a fraction in another. This is not a bug, but it is worth remembering with every future change to the top bar's height — moving the threshold also moves the boundary at which the sub-pixel behaviour changes.

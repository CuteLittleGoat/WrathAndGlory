# Szczelina w nagłówku tabeli DataVault — analiza

## 1. Metryka

| | |
|---|---|
| **Data analizy** | 21 września 2026 |
| **Temat** | Szczeliny (prześwity) w paśmie nagłówka tabeli w module `DataVault`: między paskiem zakładek a nagłówkiem, między wierszem nazw kolumn a wierszem filtrów oraz na krawędziach nagłówka; przesuwanie się tekstów nagłówka przy przewijaniu |
| **Moduł** | `DataVault` |
| **Zakres** | `DataVault/style.css` — reguły `.tabs`, `.tableWrap`, `.tableFrame`, `.tableViewport`, `.dataTable`, `.dataTable thead`, `.dataTable thead th`; zachowanie przyklejonego nagłówka przy przewijaniu; wpływ wysokości okna i skalowania ekranu |
| **Poza zakresem** | Zmiany z commita `409cde3` (filtr globalny, barwy sygnałów, własne pole wyboru) — użytkownik wyraźnie zastrzegł, żeby ich nie ruszać. Widok kart na telefonie (`@media (max-width: 720px)`) — tam `thead` jest ukryty, więc problem nie występuje |
| **Metoda** | Pomiar geometrii (`getBoundingClientRect`) oraz sonda pikselowa: zrzut pasma nagłówka i odczyt średniej barwy każdego wiersza device-pikseli; kontrolowane wyłączanie pojedynczych deklaracji CSS i kolorowanie poszczególnych elementów, żeby ustalić, który element maluje który piksel; test przecieku z wierszami przemalowanymi na jaskrawą czerwień |
| **Konfiguracje testowe** | 8 rozmiarów okna od 1280×610 do 1920×1080, skalowanie 100%, 125%, 150% i 200%, 4–5 pozycji przewinięcia |
| **Stan repozytorium w chwili diagnozy** | `HEAD` = `38d7668` (gałąź `claude/charming-meitner-45xuh7`, zsynchronizowana z `main`) |
| **Status** | **Zamknięty.** Użytkownik potwierdził wynik na własnym sprzęcie w obu trybach wyświetlania i uznał temat za zakończony (wiadomości 6 i 7). Podsumowanie: rozdz. 13 |
| **Zmiany w kodzie** | **Wdrożone** w `DataVault/style.css`, w dwóch etapach: rozdz. 11 (szczelina C i przeskok nagłówka) oraz rozdz. 12 (szczelina D) |
| **Analiza siostrzana** | `Analizy/responsywnosc-aplikacji-2026-09-10.html`, rozdział 14 — pierwszy opis szczelin w przyklejonym nagłówku |

### Główny wniosek

Poprawka z commita `38d7668` **zamknęła przeciek treści wierszy** — po niej w żadnej z 8 przebadanych konfiguracji nie przecieka ani jeden piksel wiersza. Ale **nie usunęła przyczyny**, tylko ją przykryła, i wprowadziła nowy, widoczny skutek uboczny.

Zostały dwa objawy, oba mające **to samo źródło**: górne obramowanie tabeli (`.dataTable{border:1px solid var(--div)}`) przy `border-collapse:collapse` przesuwa górną krawędź `<thead>` o **pół piksela** w dół względem krawędzi obszaru przewijania.

1. **Ciemna szczelina 1 px** między jasną linią obramowania a nazwą kolumny. Widoczna **tylko wtedy, gdy górna krawędź `.tableFrame` wypada na pełnym pikselu** — a to zależy od wysokości okna. Stąd obserwacja użytkownika, że na pełnym ekranie szczelina jest, a w oknie jej nie ma.
2. **Nagłówek przeskakuje o 1,5 px w górę** w chwili przyklejenia. To bezpośredni skutek poprawki `top:-1px` i występuje w **każdej** konfiguracji. To jest dokładnie to, co użytkownik opisał jako „teksty nagłówków delikatnie jakby przesuwały się w górę".

Rekomendowane rozwiązanie (rozdz. 8) usuwa **oba** objawy jednocześnie, bo likwiduje półpikselowe przesunięcie zamiast je maskować. Zmierzone: przesunięcie nagłówka 0,00 px i zero przeciekających pikseli we wszystkich 8 konfiguracjach.

Rekomendacja ma swoją cenę: nad nazwami kolumn zostają dwie poziome linie zamiast trzech. Cena została policzona w rozdz. 8.3, a w **rozdz. 8.4 opisana prostym językiem, bez żargonu**.

> **Stan na dziś: temat zamknięty.** Wszystkie zgłoszone objawy zostały usunięte i potwierdzone przez użytkownika na jego sprzęcie. Rozdziały 3–7 opisują diagnozę i stan sprzed wdrożenia — są zapisem tego, jak ustalono przyczynę, i celowo zostają w dokumencie. Aktualny stan kodu opisują **rozdz. 11 i 12**, a podsumowanie całości **rozdz. 13**.

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
| Inna przeglądarka niż silnik Chromium | **Średnie** | Pomiary wykonano na silniku Chromium. Model scalonych obramowań jest w standardzie CSS, więc zachowanie powinno być takie samo, ale zaokrąglanie subpikselowe bywa różne. Warto obejrzeć wynik także w Firefoksie, jeżeli jest używany |

---

## 10. Następne kroki

1. ~~**Decyzja użytkownika** co do kosztu wizualnego z rozdz. 8.3.~~ **Wykonane** — zgoda udzielona w wiadomości 5.
2. ~~Wdrożenie zmiany z rozdz. 8.1.~~ **Wykonane** — patrz rozdz. 11.
3. ~~Aktualizacja `DetaleLayout.md`.~~ **Wykonane** — patrz rozdz. 11.3.
4. ~~Sprawdzenie na sprzęcie użytkownika w obu trybach — pełny ekran i okno.~~ **Wykonane** — użytkownik potwierdził w wiadomości 6: „Nic teraz nie drga. Zarówno w trybie pełnoekranowym jak i w oknie”.
5. Do rozważenia niezależnie od powyższego: próg `max-height: 760px` przełącza pasek górny skokowo i to on odpowiada za to, że układ raz wypada na pełnym pikselu, a raz na ułamku. Nie jest to błąd, ale warto o tym pamiętać przy każdej przyszłej zmianie wysokości paska górnego — przesunięcie progu przesunie też granicę, na której zmienia się zachowanie subpikselowe.

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
2. **Firefox**, jeżeli jest używany. Model scalonych obramowań jest w standardzie CSS, więc zachowanie powinno być takie samo, ale zaokrąglanie subpikselowe bywa różne między silnikami (rozdz. 9).

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

### 13.1 Cztery szczeliny i ich losy

| Szczelina | Objaw | Przyczyna | Rozstrzygnięcie |
|---|---|---|---|
| **A** | Pasmo przewijanych wierszy pod paskiem zakładek | Górny margines wewnętrzny `.tableViewport` — element przyklejony zatrzymuje się na wewnętrznej krawędzi treści | `padding: 0 4px 4px`, bez marginesu u góry (rozdz. 4.1) |
| **B** | Włos między wierszem nazw kolumn a wierszem filtrów | Oba wiersze przyklejane niezależnie, jeden według zaokrąglonej liczby pikseli, drugi według rzeczywistej wysokości | Przyklejenie całego `<thead>` jako jednego bloku; usunięte `--header-row-height` i `ResizeObserver` (rozdz. 4.2) |
| **C** | Ciemna rysa nad nazwami kolumn oraz przeskok nagłówka o 1,5 px przy przewijaniu | Scalone obramowanie górnej krawędzi tabeli przesuwa `<thead>` o pół piksela | `.dataTable{border-top:0}` plus `thead{top:0}` (rozdz. 8.1, 11) |
| **D** | Treść wiersza prześwitująca przez linie rozdzielające nagłówka | Obramowanie malowane w warstwie tabeli, pod przyklejonym `<thead>`; tło komórki nie sięga pod nie | `thead th{border-bottom:0}` plus `box-shadow: inset 0 -1px 0 var(--div)` (rozdz. 12) |

Wspólny mianownik C i D: **obie wynikały z `border-collapse: collapse`**, przy którym obramowanie należy do tabeli, a nie do komórki. Za każdym razem rozwiązaniem okazało się zabranie obramowania z tego miejsca, a nie maskowanie objawu.

### 13.2 Stan końcowy — zmierzony

Osiem konfiguracji okna od 1280×610 do 1920×1080, skalowanie 100%, 125%, 150% i 200%:

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

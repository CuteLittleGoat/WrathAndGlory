# Mapa Gilead — nawigacja nie działa w PWA na tablecie

> **Data:** 21 września 2026
> **Temat:** w aplikacji PWA uruchomionej na tablecie mapa układu Gilead nie daje się przesuwać ani przybliżać/oddalać, natomiast kliknięcia w planety i obszary działają normalnie. W przeglądarce Chrome na tym samym tablecie oraz w PWA na telefonie wszystko działa poprawnie.
> **Moduł:** `Main`, plik `Main/Gilead.html`
> **Charakter dokumentu:** analiza diagnostyczna. Opisuje stan kodu **sprzed** zmian i projekt naprawy. **Żaden plik aplikacji nie został w ramach tej analizy zmieniony** — powstał wyłącznie ten dokument.
> **Stan na dziś:** przyczyna ustalona i potwierdzona pomiarem zrzutów ekranu (rozdz. 5–6). Czeka na decyzje D1–D6 z rozdz. 13.

---

## Spis treści

1. [Prompt użytkownika (zachowany w całości)](#1-prompt-użytkownika-zachowany-w-całości)
2. [Zakres analizy i metoda](#2-zakres-analizy-i-metoda)
3. [Odpowiedź w skrócie](#3-odpowiedź-w-skrócie)
4. [Jak mapa działa dziś — mechanika kadru](#4-jak-mapa-działa-dziś--mechanika-kadru)
5. [Dowód ze zrzutów ekranu — pomiar](#5-dowód-ze-zrzutów-ekranu--pomiar)
6. [Przyczyna — łańcuch „NaN"](#6-przyczyna--łańcuch-nan)
7. [Dlaczego akurat tablet i akurat PWA](#7-dlaczego-akurat-tablet-i-akurat-pwa)
8. [Dlaczego klikanie działa, a nawigacja nie](#8-dlaczego-klikanie-działa-a-nawigacja-nie)
9. [Obejście natychmiastowe — co zrobić teraz, bez zmiany kodu](#9-obejście-natychmiastowe--co-zrobić-teraz-bez-zmiany-kodu)
10. [Co możesz sprawdzić — testy krok po kroku](#10-co-możesz-sprawdzić--testy-krok-po-kroku)
11. [Usterki drugorzędne znalezione przy okazji](#11-usterki-drugorzędne-znalezione-przy-okazji)
12. [Co dokładnie trzeba poprawić w `Gilead.html`](#12-co-dokładnie-trzeba-poprawić-w-gileadhtml)
13. [Decyzje do podjęcia przed naprawą](#13-decyzje-do-podjęcia-przed-naprawą)
14. [Plan testów po naprawie](#14-plan-testów-po-naprawie)
15. [Ryzyka](#15-ryzyka)
16. [Czego ta analiza nie rozstrzyga](#16-czego-ta-analiza-nie-rozstrzyga)
17. [Następne kroki](#17-następne-kroki)

---

## 1. Prompt użytkownika (zachowany w całości)

> Przeprowadź analizę poprawności działania pliku Gilead.html
>
> Mam problem z działaniem mapy na tablecie poprzez aplikację PWA. Jak uruchamiam przez aplikację to nie działa nawigacja (przesuwanie, pomniejszanie itd). Działają natomiast interaktywne elementy. Jak naciskam na planetę to wyświetla się jej opis.
>
> Problem ten nie występuje przy PWA uruchamianym na telefonie.
>
> Problem ten też nie występuje jak uruchamiam plik Gilead.html na tablecie przez wbudowaną przeglądarkę Chrome.
>
> Sprawdź co może być przyczyną.
>
> Sprawdź co mogę sprawdzić i jakie ewentualnie decyzję muszę podjąć, żebyś mógł to naprawić (zapisz to prostym językiem jak dla kogoś kto nie ma wiedzy informatycznej).
> Jeżeli problem leży w samym pliku Gilead.html to też dokładnie opisz to w analizie co w nim trzeba poprawić.
>
> Nie zmieniaj kodu aplikacji. Utwórz tylko nowy plik MD z analizą.

---

## 2. Zakres analizy i metoda

Przeanalizowano plik `Main/Gilead.html` (887 linii, ok. 1 MB — większość objętości to wklejone
ilustracje w formacie WebP). Sprawdzono również `Main/index.html` (stąd otwierana jest mapa),
`manifest.webmanifest` (definicja aplikacji PWA) oraz historię zmian pliku.

Metoda ustalenia przyczyny:

1. przeczytanie całej logiki nawigacji mapy (skrypt na końcu pliku, linie 626–885);
2. wyliczenie „na sucho", poza przeglądarką, jak zachowa się ta logika w kilku sytuacjach
   brzegowych (symulacja w Node.js);
3. **pomiar czterech dostarczonych zrzutów ekranu** — odczytanie ze zrzutów, w jakiej skali
   i w jakim miejscu narysowana jest mapa, i porównanie tego z liczbami, które powinny wyjść
   z kodu.

Punkt 3 okazał się rozstrzygający: zrzuty z PWA pokazują stan, który da się uzyskać **tylko
jednym sposobem** — i ten sposób wskazuje dokładnie na miejsce usterki. Nie jest to więc
hipoteza „coś może być nie tak", tylko wynik z potwierdzeniem liczbowym.

Co **nie** było możliwe: uruchomienie pliku na Twoim tablecie. Wszystko poniżej opiera się na
kodzie i na zrzutach, a nie na obserwacji urządzenia. Rozdz. 10 podaje testy, którymi możesz
potwierdzić diagnozę w 2 minuty.

---

## 3. Odpowiedź w skrócie

**Problem leży w pliku `Main/Gilead.html`.** To nie jest wina tabletu, Androida ani samego
mechanizmu PWA — te rzeczy tylko *wyzwalają* błąd, który w pliku tkwi od początku.

Najprościej, jak się da:

> Mapa przy starcie mierzy, jak duże jest okno, i z tego pomiaru wylicza swój **kadr** — czyli
> który fragment mapy pokazać i w jakim powiększeniu. W aplikacji PWA na tablecie zdarza się,
> że ten pomiar wypada w momencie, gdy okno **jeszcze nie ma żadnych wymiarów** (ma zero na
> zero pikseli — okno jest w trakcie otwierania, za ekranem powitalnym). Z dzielenia przez
> zero wychodzi wynik, który nie jest liczbą. Kadr zostaje wtedy ustawiony na „nie-liczbę"
> i — to jest sedno — **kod nie ma żadnej możliwości powrotu z tego stanu**. Każde późniejsze
> przesunięcie palcem dodaje coś do „nie-liczby" i nadal wychodzi „nie-liczba". Mapa stoi
> w miejscu.
>
> Jednocześnie przeglądarka, widząc nieprawidłowy kadr, po prostu go ignoruje i rysuje mapę
> „jak leci", w skali 1:1 od lewego górnego rogu. Dlatego mapa **wygląda** normalnie (jest
> widoczna, ładna, klikalna), tylko jest wycięta inaczej i nie da się nią ruszyć.
>
> Kliknięcia działają, bo one w ogóle nie korzystają z kadru — planeta to zwykły element
> strony, reaguje na dotknięcie niezależnie od tego, czy mapa umie się przesuwać.

Skrót techniczny: `plansza.getBoundingClientRect()` zwraca `0 × 0`, przez co
`dopasowanie()` liczy `900 * (0/0)` → `NaN`, cała struktura `vb` (kadr) staje się `NaN`,
`zastosuj()` wpisuje do SVG `viewBox="NaN NaN NaN NaN"`, przeglądarka odrzuca ten atrybut
jako niepoprawny i renderuje SVG bez `viewBox`, a `ogranicz()` — jedyna funkcja wołana przy
zmianie rozmiaru okna — nie potrafi z `NaN` wyjść, bo `Math.max(467.5, NaN)` to nadal `NaN`.

---

## 4. Jak mapa działa dziś — mechanika kadru

Mapa to jeden rysunek wektorowy (SVG) o stałych, wewnętrznych współrzędnych: obszar od
`x = -270` do `x = 1600` i od `y = 0` do `y = 900`. Słońce układu stoi w punkcie `(430, 470)`,
Nethreus w `(245,7; 478,9)`, Charybdion w `(559,4; 204,4)` i tak dalej. Te liczby nigdy się
nie zmieniają.

To, co widzisz na ekranie, jest wycinkiem tego rysunku. Wycinek opisują cztery liczby
przechowywane w zmiennej `vb` (`Main/Gilead.html:645`):

| pole | znaczenie |
|---|---|
| `vb.x`, `vb.y` | lewy górny róg wycinka we współrzędnych mapy |
| `vb.w`, `vb.h` | szerokość i wysokość wycinka |

Te cztery liczby są co chwilę wpisywane do atrybutu `viewBox` znacznika `<svg>` przez funkcję
`zastosuj()` (`:648`). Przesuwanie palcem zmienia `vb.x`/`vb.y`, szczypanie zmienia `vb.w`/`vb.h`.
**Cała nawigacja to wyłącznie modyfikacja tych czterech liczb.**

Kluczowe funkcje:

- **`dopasowanie()`** (`:652`) — liczy, jak szeroki musi być wycinek, żeby cała mapa zmieściła
  się w oknie. Wzór: `Math.max(1870, 900 * (szerokość_okna / wysokość_okna))`.
- **`widokDomyslny()`** (`:669`) — ustawia kadr startowy. **To jedyna funkcja, która nadaje
  `vb` całkiem nowe wartości**, nie wyprowadzone ze starych. Wołana jest w trzech miejscach:
  przy starcie (`:878`), po dwukliku/dwukrotnym stuknięciu w mapę (`:828`) i po naciśnięciu
  klawisza `Home` (`:843`).
- **`ogranicz()`** (`:659`) — pilnuje, żeby kadr nie wyszedł poza mapę i nie przekroczył
  granic powiększenia. Tylko **przycina** istniejące wartości, nigdy ich nie ustala od nowa.
- **obsługa zmiany rozmiaru okna** (`:880`) — wywołuje wyłącznie `ogranicz()` i `zastosuj()`.
  **Nie wywołuje `widokDomyslny()`.** To jest drugi filar problemu.

Wszystkie te funkcje mierzą okno przez `plansza.getBoundingClientRect()` i **żadna z nich nie
sprawdza, czy pomiar w ogóle się udał**.

---

## 5. Dowód ze zrzutów ekranu — pomiar

Z czwartego zrzutu (Chrome) i drugiego (PWA) dało się odczytać, że **gęstość pikseli na Twoim
tablecie wynosi 1,5** — panel karty planety ma w kodzie na sztywno 420 jednostek szerokości,
a na zrzucie mierzy 628 pikseli (628 / 420 = 1,495). Stąd szerokość robocza okna to
1920 / 1,5 = **1280 jednostek**.

### 5.1 Chrome na tablecie (zrzuty 1 i 4) — stan zdrowy

Podstawiając 1280 jednostek szerokości i ok. 487 jednostek wysokości obszaru mapy, kod powinien
ustawić `vb.w ≈ 1978`. Ze zrzutu, mierząc odległość między lewym a prawym pasem szrafury ramy
Szczeliny (te dwa zakreskowane słupki przy krawędziach), wychodzi `vb.w ≈ 1973`.
**Zgodność 99,7 %** — w przeglądarce kadr jest policzony prawidłowo.

### 5.2 PWA na tablecie (zrzuty 2 i 3) — stan uszkodzony

Tu kadr **nie** zgadza się z żadną wartością, którą kod potrafi wyliczyć. Za to wszystko
idealnie pasuje do jednej jedynej sytuacji: **SVG rysowany jest bez `viewBox`**, czyli
1 jednostka mapy = 1 jednostka ekranu, licząc od lewego górnego rogu obszaru mapy.

Porównanie — pozycje z kodu przeliczone wzorem `piksel = współrzędna × 1,5` (pion dodatkowo
+ 160 px na pasek systemowy i nagłówek) kontra pozycje odczytane ze zrzutu 3:

| obiekt | współrzędne w kodzie | wyliczone (px) | odczytane ze zrzutu (px) |
|---|---|---|---|
| Gwiazda | 430 ; 470 | 645 ; 865 | 645 ; 866 |
| NETHREUS | 245,7 ; 478,9 | 369 ; 878 | 368 ; 878 |
| ENOCH | 343,3 ; 292,0 | 515 ; 598 | 515 ; 598 |
| CHARYBDION | 559,4 ; 204,4 | 839 ; 467 | 838 ; 467 |
| AVACHRUS | 461,1 ; 533,8 | 692 ; 961 | 691 ; 961 |
| OSTIA | 641,3 ; 551,4 | 962 ; 987 | 962 ; 987 |
| GILEAD PRIMUS | 769,9 ; 339,1 | 1155 ; 669 | 1155 ; 670 |

Siedem obiektów, błąd maksymalnie 1 piksel. To nie jest zbieg okoliczności.

### 5.3 Trzy dodatkowe potwierdzenia widoczne gołym okiem

Wszystkie trzy wynikają z tego samego rysowania 1:1 i wszystkie trzy widać na Twoich zrzutach:

1. **Rama Szczeliny jest niekompletna.** Rama składa się z czterech zakreskowanych pasów:
   górnego (`y` od 0 do 46), dolnego, prawego (`x` od 1554) i lewego (`x` od -270).
   Przy rysowaniu 1:1 lewy pas ma ujemne `x`, więc wypada poza ekran, a prawy pas leży pod
   `x = 2331 px`, czyli też poza ekranem. **Zostaje tylko pas górny** — i dokładnie to widać
   na zrzutach 2 i 3: napis „CICARIX MALEDICTUM" na zakreskowanej belce u góry, a po bokach nic.
   Na zrzucie 1 (Chrome) widać pasy z lewej i z prawej, a górnej belki nie widać.
2. **Vulkaris i Trollius zniknęły.** Vulkaris siedzi w `(105 ; 780)`, Trollius w `(1027,5 ; 727,1)`.
   Przy rysowaniu 1:1 obie wypadają poniżej dolnej krawędzi obszaru mapy. Na zrzucie 1
   (Chrome) obie są widoczne, na zrzutach 2 i 3 (PWA) obu brak.
3. **Otwarcie karty planety nie zmienia skali mapy.** Na tablecie karta zabiera 420 jednostek
   z prawej strony, więc mapa powinna zostać ściśnięta i — przy ustawieniu
   `preserveAspectRatio="xMidYMid slice"` — powiększyć się. Na zrzucie 2 (karta Charybdiona
   otwarta) mapa ma identyczną skalę i identyczne pozycje jak na zrzucie 3 (karta zamknięta):
   jest po prostu **przykryta**, a nie przeskalowana. Tak zachowuje się SVG bez `viewBox`.

---

## 6. Przyczyna — łańcuch „NaN"

Przeglądarka odrzuca `viewBox` tylko wtedy, gdy wpisana wartość jest **niepoprawna**. Kod
składa ją tak (`:648`):

```js
svg.setAttribute('viewBox', vb.x.toFixed(1)+' '+vb.y.toFixed(1)+' '+
                            vb.w.toFixed(1)+' '+vb.h.toFixed(1));
```

W JavaScripcie `NaN.toFixed(1)` daje napis `"NaN"`. Czyli jedyny sposób, żeby powstał
niepoprawny `viewBox`, to żeby liczby kadru stały się `NaN` („nie-liczba").

Prześledźmy, kiedy to się dzieje. Wystarczy, że `plansza.getBoundingClientRect()` zwróci
szerokość **i** wysokość równe zeru:

| krok | kod | wynik |
|---|---|---|
| 1 | `dopasowanie()` → `Math.max(1870, 900*(0/0))` | `0/0` = `NaN`, a `Math.max(1870, NaN)` = **`NaN`** |
| 2 | `vb.w = Math.min(NaN, 0/0.647)` | **`NaN`** |
| 3 | `vb.h = vb.w * (0/0)` | **`NaN`** |
| 4 | `if (vb.w >= pelna)` → `NaN >= NaN` | zawsze fałsz → gałąź „za wąsko", `vb.x = 570 - NaN/2` = **`NaN`** |
| 5 | `ogranicz()` → `Math.max(467.5, Math.min(NaN, NaN))` | **`NaN`** |
| 6 | `zastosuj()` | `viewBox="NaN NaN NaN NaN"` → przeglądarka odrzuca atrybut |

Symulacja tej samej logiki poza przeglądarką potwierdza wynik:

```
plansza 1280 x 563  → viewBox = "-419.1 35.0 1978.2 870.1"   (stan prawidłowy)
plansza    0 x   0  → viewBox = "NaN NaN NaN NaN"            (stan uszkodzony)
```

**I teraz najważniejsze — dlaczego to się samo nie naprawia.** Po otwarciu okna tablet zgłasza
zdarzenie „zmiana rozmiaru", a obsługa tego zdarzenia (`:880`) robi tylko:

```js
window.addEventListener('resize', function(){
  clearTimeout(czekaj);
  czekaj = setTimeout(function(){ ogranicz(); zastosuj(); }, 120);
});
```

`ogranicz()` **nie wylicza kadru od nowa** — on tylko przycina to, co już jest.
A przycięcie `NaN` daje `NaN`:

- `Math.min(1978, NaN)` = `NaN`
- `Math.max(467.5, NaN)` = `NaN`

Ta sama symulacja: po „naprawieniu" wymiarów okna do 1280 × 563 i wywołaniu `ogranicz()`
kadr **nadal** brzmi `"NaN NaN NaN NaN"`. Po dołożeniu przesunięcia o 100 px — nadal
`"NaN NaN NaN NaN"`. Stan jest trwały aż do przeładowania strony.

I to jest pełna odpowiedź na pytanie „dlaczego nic nie da się zrobić palcem": kod obsługi
dotyku działa poprawnie, zdarzenia dochodzą, `vb.x -= dx` wykonuje się — tylko wynikiem
`NaN − 12,4` jest `NaN`.

---

## 7. Dlaczego akurat tablet i akurat PWA

Błąd tkwi w pliku niezależnie od urządzenia. Różni się tylko to, **czy wyścig o pomiar okna
zostanie przegrany**. Czynniki, które na tablecie w PWA działają na niekorzyść:

1. **Start aplikacji PWA przebiega inaczej niż otwarcie zakładki.** Zakładka Chrome dostaje
   stronę do okna, które już ma wymiary. PWA najpierw pokazuje ekran powitalny, dopiero potem
   tworzy i rozmieszcza okno. Skrypt mapy wykonuje się **natychmiast po wczytaniu treści**
   (`widokDomyslny()` w linii `:878`, bez żadnego czekania na `load` czy na pierwszą klatkę),
   więc może trafić dokładnie w tę szczelinę.
2. **Mapa otwiera się w osobnym oknie.** W `Main/index.html:228` przycisk Gilead ma
   `target="_blank"`. W aplikacji PWA oznacza to utworzenie **nowego okna aplikacji** —
   a nowe okno to dokładnie ten moment, w którym wymiary bywają jeszcze zerowe. W zwykłej
   przeglądarce nowa karta jest budowana inaczej i ryzyko jest mniejsze.
3. **Tablety mają okna zmienne.** Tryb wielookienkowy / dzielony ekran, zmiana orientacji,
   przejście do „ostatnich aplikacji" i powrót — każde z tych zdarzeń generuje zdarzenie
   „zmiana rozmiaru", a przy niektórych z nich okno przez moment ma wymiar zero.
   **Wystarczy jedno takie zdarzenie w dowolnym momencie pracy z mapą**, bo `ogranicz()`
   wywołane przy zerowych wymiarach psuje kadr tak samo skutecznie jak zły start
   (`Math.min(dopasowanie(), 0/0.647)` = `Math.min(NaN, 0)` = `NaN`).
4. **Telefon ma inne proporcje i inny przebieg startu**, przez co po prostu statystycznie
   rzadziej trafia w szczelinę. To nie znaczy, że jest odporny — znaczy, że jeszcze nie
   trafiło.

Innymi słowy: **to nie jest usterka „tabletu", tylko usterka losowa, która na tablecie
w PWA trafia się często, a gdzie indziej rzadko.** Prawdopodobnie zdarzało się już
sporadycznie także gdzie indziej, tylko przeładowanie strony w przeglądarce jest tak
naturalnym odruchem, że nikt tego nie zauważył. W oknie PWA nie ma przycisku odświeżania —
i dlatego tam problem wygląda na „trwały".

---

## 8. Dlaczego klikanie działa, a nawigacja nie

To rozróżnienie jest w kodzie bardzo wyraźne i dobrze tłumaczy Twoją obserwację:

| funkcja | z czego korzysta | stan przy uszkodzonym kadrze |
|---|---|---|
| dotknięcie planety → karta | zdarzenie `click` na grupie `.cog-hot`, potem kopiowanie gotowego HTML z ukrytego `#zrodlo` | **działa** — kadr w ogóle nie jest do tego potrzebny |
| przycisk INDEKS | pokazanie/ukrycie listy | **działa** |
| wybór pozycji z INDEKSU | otwarcie karty **plus** `pokazPunkt()` | karta się otwiera, ale **mapa nie dojedzie** do pozycji — `pokazPunkt()` operuje na `vb` |
| przesuwanie palcem | `vb.x -= dx` | **nie działa** |
| szczypanie (zoom) | `przyblizWokol()` → `vb.w *= mnożnik` | **nie działa** |
| kółko myszy, klawisze `+`/`−`/strzałki | te same funkcje | **nie działa** |
| dwuklik / dwukrotne stuknięcie | `widokDomyslny()` | **działa i naprawia stan** — patrz rozdz. 9 |

Zwróć uwagę na przedostatni wiersz i na ostatni: to są dwa najlepsze testy diagnostyczne,
które możesz wykonać w 10 sekund (rozdz. 10).

---

## 9. Obejście natychmiastowe — co zrobić teraz, bez zmiany kodu

**Stuknij dwa razy szybko w puste miejsce mapy** (nie w planetę, nie w podpis obszaru — np.
w czarne tło między orbitami).

Dwuklik wywołuje `widokDomyslny()` (`Main/Gilead.html:828`), a ta funkcja jako jedyna nadaje
kadrowi całkiem nowe wartości, mierząc okno **w tym momencie** — czyli już po tym, jak okno
ma normalne wymiary. Stan `NaN` znika, mapa wraca do widoku startowego i od tej chwili
przesuwanie oraz szczypanie działają normalnie.

Jeżeli podłączasz do tabletu klawiaturę, ten sam skutek ma klawisz **`Home`**.

To jest obejście, nie naprawa — po każdym ponownym otwarciu mapy trzeba je powtórzyć,
a jeśli w międzyczasie tablet przejdzie w tryb dzielonego ekranu, może być konieczne jeszcze raz.

---

## 10. Co możesz sprawdzić — testy krok po kroku

Napisane tak, żeby dało się je wykonać bez żadnej wiedzy technicznej. Każdy test ma podane,
co oznacza wynik.

### Test 1 — dwuklik (najważniejszy, 10 sekund)

1. Otwórz mapę w aplikacji PWA na tablecie, tak jak zwykle.
2. Sprawdź, że rzeczywiście nie da się jej przesunąć palcem.
3. Stuknij **dwa razy szybko** w ciemne, puste miejsce mapy (nie w planetę).
4. Spróbuj przesunąć mapę palcem.

- **Mapa zaczęła się przesuwać** → diagnoza z rozdz. 6 potwierdzona w 100 %. To dokładnie to,
  co opisuje ta analiza, i naprawa z rozdz. 12 usunie problem.
- **Nadal nic** → napisz o tym; trzeba będzie sprawdzić drugą ścieżkę (rozdz. 11.1).

### Test 2 — czy rama mapy jest kompletna

Porównaj to, co widzisz w aplikacji, z tym, co widzisz w Chrome.

1. W Chrome na tablecie: przy lewej i prawej krawędzi mapy są **pionowe zakreskowane pasy**
   (rama Szczeliny).
2. W aplikacji PWA: sprawdź, czy te pasy są.

- **W aplikacji pasów z boku brak, a jest za to zakreskowana belka na górze z napisem
  „CICARIX MALEDICTUM"** → kadr jest uszkodzony, potwierdzenie diagnozy.
- **Rama wygląda tak samo w obu** → kadr jest zdrowy, a problem byłby gdzie indziej.

### Test 3 — INDEKS a niewidoczna planeta

1. W aplikacji PWA otwórz **INDEKS**.
2. Wybierz **VULKARIS** (albo TROLLIUS) — pozycje, których w aplikacji nie widać na ekranie.

- **Karta Vulkarisa się otworzyła, ale mapa w tle ani drgnęła i Vulkarisa nadal nie widać**
  → kadr uszkodzony, potwierdzenie diagnozy.
- **Mapa dojechała do Vulkarisa** → kadr działa.

### Test 4 — karta planety a skala mapy

1. W aplikacji PWA, na tablecie trzymanym poziomo, dotknij planety, żeby otworzyć kartę
   z prawej strony.
2. Obserwuj mapę po lewej.

- **Mapa się nie zmieniła, karta ją tylko przykryła** → potwierdzenie diagnozy.
- **Mapa wyraźnie się powiększyła / przesunęła** → kadr działa (choć zachowanie samo w sobie
  jest niedopracowane — patrz rozdz. 11.3).

### Test 5 — czy to zależy od sposobu uruchomienia

1. Zamknij aplikację PWA **całkowicie** (usuń ją z listy ostatnich aplikacji, nie tylko
   przyciskiem wstecz).
2. Uruchom ją od zera i od razu wejdź w mapę.
3. Sprawdź nawigację, zanim cokolwiek innego zrobisz.

Potem powtórz to samo, ale przed wejściem w mapę:

4. obróć tablet z pionu na poziom i z powrotem;
5. albo przełącz się na inną aplikację i wróć;
6. albo włącz tryb dzielonego ekranu.

- **Za pierwszym razem działa, a psuje się dopiero po obróceniu / przełączeniu** →
  winowajcą jest ścieżka „zmiana rozmiaru okna" (rozdz. 7, punkt 3).
- **Nie działa zawsze, od pierwszej sekundy** → winowajcą jest start aplikacji (rozdz. 7,
  punkty 1–2).

To rozróżnienie nie zmienia naprawy (obie ścieżki naprawia ta sama poprawka), ale ułatwi
potwierdzenie, że poprawka zadziałała.

### Test 6 — dla pewności, czym w ogóle jest „aplikacja" na tablecie

Nie jest to konieczne do naprawy, ale warto wiedzieć:

1. Czy ikona aplikacji na tablecie została dodana z **Chrome** („Zainstaluj aplikację" /
   „Dodaj do ekranu głównego"), czy z innej przeglądarki (na tabletach Samsunga często jest
   to Samsung Internet)?
2. Czy na tablecie w Chrome masz włączoną opcję **„Witryna na komputer"**?

Odpowiedzi wpisz przy okazji zgłaszania wyników — pomagają wykluczyć przyczyny poboczne,
gdyby Test 1 wypadł negatywnie.

### Test 7 — twardy dowód (tylko jeśli masz pod ręką komputer)

1. Podłącz tablet kablem do komputera, włącz na tablecie „Debugowanie USB".
2. W Chrome na komputerze wejdź na `chrome://inspect`, znajdź stronę Gilead i kliknij „inspect".
3. Zajrzyj w zakładkę **Console**.

Jeżeli diagnoza jest trafna, zobaczysz tam komunikat w rodzaju:

```
Error: <svg> attribute viewBox: Expected number, "NaN NaN NaN NaN"
```

To jest dowód bezpośredni. Jeśli nie masz jak tego zrobić — nie szkodzi, Testy 1–4 wystarczą.

---

## 11. Usterki drugorzędne znalezione przy okazji

Poniższe rzeczy to osobne słabe punkty tego samego kodu. Żadna z nich nie tłumaczy Twojego
objawu tak dobrze jak rozdz. 6, ale każda może kiedyś wywołać podobne kłopoty i warto
naprawić je przy okazji.

### 11.1 Zablokowane palce — „duchy" wskaźników dotyku

Kod prowadzi rejestr aktywnych palców w obiekcie `wskazniki` (`:764`). Palec jest z rejestru
usuwany wyłącznie w funkcji `koniec()` (`:809`), podpiętej do zdarzeń `pointerup`
i `pointercancel` **na samym SVG**.

Jeżeli którekolwiek z tych zdarzeń nie dotrze (system Android przechwycił gest — np. gest
cofania od krawędzi ekranu, rozwinięcie paska powiadomień, przeciągnięcie okna w trybie
dzielonym), wpis w rejestrze **zostaje na zawsze**. Skutek przy następnym dotknięciu:

- `liczbaWskaznikow()` zwraca 2 zamiast 1 → kod wchodzi w gałąź „szczypanie" → `ciagniemy`
  nigdy nie zostaje ustawione → **przesuwanie jednym palcem przestaje działać**;
- obliczenie rozstawu miesza żywy palec z „duchem" → **zoom skacze albo nie robi nic**;
- **kliknięcia dalej działają bez zarzutu**.

To znaczy: **ta usterka daje dokładnie ten sam objaw, który zgłaszasz**, i też utrzymuje się
do przeładowania strony. Odróżnia je Test 1 — dwuklik naprawia stan `NaN`, ale **nie** czyści
rejestru palców. Jeżeli Test 1 wypadnie negatywnie, to jest druga podejrzana.

Kod nie ma ani jednego mechanizmu czyszczenia tego rejestru: nie reaguje na `lostpointercapture`,
na utratę widoczności strony (`visibilitychange`) ani na utratę fokusu okna, i nie zeruje
rejestru, gdy liczba palców wyjdzie poza 2.

### 11.2 `touch-action` ustawione tylko na SVG

Reguła `touch-action: none` (`:42`) stoi na elemencie `<svg id="mapa">`, a nie na
otaczającym go zwykłym kontenerze HTML `.cog-plansza`. Obsługa `touch-action` na elementach
SVG jest w silnikach przeglądarek historycznie niepewna; na zwykłym `<div>` jest gwarantowana.
Jeżeli reguła zostanie zignorowana, przeglądarka uzna gest za przewijanie strony, wyśle
`pointercancel` i przerwie przesuwanie. Brakuje też `overscroll-behavior: none` na
`html, body`, które blokuje „pociągnij, żeby odświeżyć".

### 11.3 Kadr nie jest przeliczany, gdy zmienia się kształt obszaru mapy

Obsługa zdarzenia „zmiana rozmiaru" reaguje tylko na zmianę rozmiaru **okna**. Tymczasem
obszar mapy zmienia kształt również wtedy, gdy:

- otwiera się lub zamyka karta planety (na szerokości ≥ 1024 jednostek zabiera 420 jednostek
  z prawej — czyli **na tablecie zawsze**),
- zmienia się widoczność ozdobników przy progach 700 i 560 jednostek.

W żadnym z tych przypadków nic nie przelicza `vb.h`, a ponieważ SVG używa
`preserveAspectRatio="xMidYMid slice"`, niezgodność proporcji między kadrem a pojemnikiem
powoduje **cichą zmianę skali i przycięcie mapy**. Dodatkowo funkcja `naMape()` (`:686`),
która przelicza punkt ekranu na punkt mapy, zakłada zgodność proporcji — przy niezgodności
zwraca złe wyniki, więc szczypanie „ucieka" od miejsca między palcami.

### 11.4 Brak widocznego przycisku powrotu do widoku domyślnego

Jedyne wyjścia awaryjne z popsutego kadru to dwuklik i klawisz `Home`. Obu trzeba się
domyślić — nigdzie nie są opisane. W oknie PWA nie ma nawet przycisku odświeżania strony.
Widoczny przycisk (np. `WIDOK` obok `INDEKS`) rozwiązywałby to raz na zawsze, a przy okazji
byłby dostępną alternatywą gestu dwukliku dla osób, które gestu nie wykonają.

### 11.5 `Gilead.html` nie ma metadanych PWA, które ma `Main/index.html`

`Main/index.html` deklaruje `viewport-fit=cover`, komplet `theme-color`, `color-scheme: dark`
oraz odwołanie do `manifest.webmanifest`. `Main/Gilead.html` ma tylko
`<meta name="viewport" content="width=device-width,initial-scale=1">` (`:5`) i nic poza tym.
Skutkiem jest m.in. to, że przy uruchomieniu w PWA obszary systemowe Androida mogą zachowywać
się inaczej niż na stronie głównej (`DetaleLayout.md`, sekcja „Aktualizacja layoutu PWA —
2026-03-29"), a wysokość dostępna dla mapy może się przez to różnić. To nie jest przyczyna
usterki, ale jest to niespójność z przyjętym standardem modułu `Main`.

### 11.6 Drobiazg — kasowanie znacznika przeciągania przez `setTimeout(...,0)`

W `koniec()` (`:819`) flaga `ciagniete` jest zerowana przez `setTimeout(..., 0)`, w nadziei,
że zdarzenie `click` dotrze wcześniej. To założenie o kolejności jest kruche; bezpieczniejsze
byłoby zerowanie flagi w samym `click`. Objaw przy pechowej kolejności: zakończenie
przeciągnięcia zamyka otwartą kartę.

---

## 12. Co dokładnie trzeba poprawić w `Gilead.html`

Poniżej opis zmian. **Nie zostały wprowadzone** — czekają na decyzje z rozdz. 13.
Numery linii odnoszą się do obecnej wersji pliku.

### P1 — nigdy nie zapisywać niepoprawnego kadru *(naprawa właściwa, konieczna)*

Funkcja `zastosuj()` (`:648`) ma przed zapisem sprawdzić, czy wszystkie cztery liczby są
skończone i dodatnie tam, gdzie muszą być. Jeżeli nie są — nie zapisywać nic i zamiast tego
przeliczyć kadr od nowa przez `widokDomyslny()`. To jedna bariera, która sama w sobie
usuwa objaw: nawet gdy pomiar wypadnie zerowy, SVG nie dostanie `viewBox="NaN NaN NaN NaN"`
i nigdy nie wpadnie w tryb rysowania 1:1.

### P2 — nie mierzyć okna, którego nie ma *(konieczna)*

Wprowadzić jedną wspólną funkcję pomiarową, np. `wymiary()`, która zwraca prostokąt tylko
wtedy, gdy `width > 0` **i** `height > 0`, a w przeciwnym razie zwraca `null`.
Funkcje `dopasowanie()` (`:652`), `ogranicz()` (`:659`), `widokDomyslny()` (`:669`),
`naMape()` (`:686`) i `przyblizWokol()` (`:690`) mają przy `null` **przerwać działanie bez
dotykania `vb`**, zamiast dzielić przez zero. Dziś żadna z nich nie sprawdza pomiaru.

### P3 — przeliczać kadr, gdy zmienia się obszar mapy, a nie tylko okno *(konieczna)*

Zastąpić nasłuch `resize` (`:880`) obserwatorem rozmiaru (`ResizeObserver`) założonym
na `#plansza`. Obserwator łapie wszystkie przypadki naraz: animację startu PWA, obrót,
dzielony ekran, a także otwarcie i zamknięcie karty planety (rozdz. 11.3).
W obsłudze:

- jeżeli zapamiętany kadr jest niepoprawny → `widokDomyslny()`;
- w przeciwnym razie → zachować środek i powiększenie, przeliczyć `vb.h` z nowych proporcji,
  potem `ogranicz()` i `zastosuj()`.

### P4 — pierwszy kadr liczyć po tym, jak układ strony naprawdę powstanie *(konieczna)*

Dziś `widokDomyslny()` jest wołane natychmiast (`:878`). Ma być wołane po pierwszej klatce
renderowania (`requestAnimationFrame`, najlepiej podwójnie), a dodatkowo kadr ma być
weryfikowany przy zdarzeniu `load` i przy powrocie strony do widoczności
(`visibilitychange`). Dzięki temu zimny start aplikacji PWA za ekranem powitalnym nie ma
szansy trafić w pusty pomiar.

### P5 — wyczyścić rejestr palców w każdej sytuacji awaryjnej *(zalecana, rozdz. 11.1)*

- nasłuch `pointerup` i `pointercancel` przenieść z `svg` na `window`, żeby zdarzenie
  zakończenia dotarło także wtedy, gdy palec został podniesiony poza mapą;
- dodać obsługę `lostpointercapture`;
- wyzerować cały rejestr przy `visibilitychange` (strona ukryta) i przy `blur` okna;
- dodać zabezpieczenie: jeżeli liczba wskaźników przekracza 2, zresetować cały stan gestu.

### P6 — przenieść `touch-action` na kontener HTML *(zalecana, rozdz. 11.2)*

Dopisać `touch-action: none` do reguły `.cog-plansza` (`:37`), zostawiając istniejącą regułę
na `#mapa`. Dodać `overscroll-behavior: none` do `html, body` (`:18`).

### P7 — widoczny przycisk powrotu do widoku domyślnego *(zalecana, rozdz. 11.4)*

Dodać w `.cog-narzedzia` (obok `INDEKS`) przycisk wywołujący `widokDomyslny()`.
Na wąskich ekranach ukrywać go tak, jak dziś ukrywane są ozdobniki, albo skrócić etykietę.

### P8 — uzupełnić metadane PWA *(opcjonalna, rozdz. 11.5)*

Doprowadzić `<head>` pliku `Gilead.html` do standardu z `Main/index.html`:
`viewport-fit=cover`, komplet `theme-color`, `color-scheme: dark`, odwołanie do manifestu.

### P9 — zerowanie flagi `ciagniete` *(opcjonalna, rozdz. 11.6)*

Przenieść zerowanie z `setTimeout(...,0)` (`:819`) do obsługi `click`.

### P10 — poza `Gilead.html`: `target="_blank"` w `Main/index.html`

Przycisk Gilead (`Main/index.html:228`) otwiera mapę w nowym oknie. W aplikacji PWA to
właśnie nowe okno jest najbardziej narażone na pusty pomiar (rozdz. 7, punkt 2). Po wdrożeniu
P1–P4 nie ma to już znaczenia dla poprawności, ale warto rozważyć, czy w trybie aplikacji
mapa ma się otwierać w osobnym oknie — to decyzja D5.

---

## 13. Decyzje do podjęcia przed naprawą

Poniżej pytania, na które potrzebuję Twojej odpowiedzi. Przy każdym jest rekomendacja —
jeżeli nie masz zdania, wystarczy napisać „rekomendacje".

### D1 — zakres naprawy

- **(a) Minimalna** — tylko P1–P4. Usuwa zgłoszony objaw i sprawia, że mapa nie może się już
  „zawiesić". Najmniej zmian, najmniejsze ryzyko.
- **(b) Pełna** *(rekomendacja)* — P1–P7. Dodatkowo domyka drugą możliwą przyczynę tego samego
  objawu (zablokowane palce), utwardza obsługę dotyku i daje widoczny przycisk ratunkowy.
- **(c) Pełna z kosmetyką** — P1–P9 plus uzupełnienie metadanych PWA.

### D2 — co ma się stać z widokiem, gdy zmieni się rozmiar obszaru mapy

Chodzi o obrót tabletu, dzielony ekran i otwarcie karty planety.

- **(a) Zachować to, co użytkownik ustawił** *(rekomendacja)* — mapa zostaje w tym samym
  miejscu i w tym samym powiększeniu, poprawiane są tylko proporcje. Pełne przeliczenie
  następuje wyłącznie wtedy, gdy kadr jest uszkodzony.
- **(b) Zawsze wracać do widoku domyślnego** — przewidywalne, ale irytujące: przy każdym
  otwarciu karty planety mapa „odskakuje" do stanu początkowego.

### D3 — widoczny przycisk powrotu do widoku mapy

- **(a) Tak, dodać przycisk obok INDEKS** *(rekomendacja)* — np. z etykietą `WIDOK` albo `RESET`.
  Zabiera trochę miejsca w nagłówku.
- **(b) Nie, zostawić sam dwuklik** — nagłówek pozostaje czysty, ale użytkownik nie ma
  żadnej widocznej drogi wyjścia, gdy coś pójdzie nie tak.

Jeśli (a) — podaj proszę preferowaną etykietę.

### D4 — zachowanie karty planety na tablecie

Dziś karta zachowuje się dwojako: na wąskim ekranie (telefon) przykrywa mapę na całość,
a na szerokim (tablet, komputer) ściska mapę do 420 jednostek z prawej.

- **(a) Zostawić jak jest** *(rekomendacja)* — widać mapę i kartę jednocześnie; po naprawie
  P3 mapa będzie się przy tym poprawnie przeliczać.
- **(b) Ujednolicić: karta zawsze przykrywa mapę** — prostsze, likwiduje całą klasę
  problemów ze zmianą proporcji, ale traci się jednoczesny podgląd mapy i karty na tablecie.

### D5 — sposób otwierania mapy ze strony głównej

- **(a) Zostawić `target="_blank"`** *(rekomendacja po wdrożeniu P1–P4)* — nowe okno,
  tak jak dziś; powrót do Przybornika przez przełączenie okna.
- **(b) Otwierać w tym samym oknie** — prostszy powrót przyciskiem wstecz i mniejsze ryzyko
  pustego pomiaru, ale zmienia się przyzwyczajenie i dotyka to `Main/index.html`,
  czyli pliku spoza zakresu zgłoszenia.

### D6 — dokumentacja

`AGENTS.md` wymaga aktualizacji `docs/Documentation.md` i `docs/README.md` po każdej zmianie
kodu modułu.

- **(a) Zaktualizować oba pliki `Main/docs/` przy okazji naprawy** *(rekomendacja)* —
  obecnie nie opisują one mapy Gilead w ogóle.
- **(b) Tylko `Documentation.md`.**
- **(c) Pominąć** (niezgodne z `AGENTS.md`).

---

## 14. Plan testów po naprawie

Do wykonania na tablecie w aplikacji PWA — czyli dokładnie tam, gdzie objaw występuje.

| # | Czynność | Oczekiwany wynik |
|---|---|---|
| 1 | Zimny start aplikacji, wejście w mapę, od razu przesunięcie palcem | Mapa się przesuwa |
| 2 | Szczypanie dwoma palcami | Mapa przybliża się i oddala płynnie, wokół punktu między palcami |
| 3 | Sprawdzenie ramy Szczeliny | Zakreskowane pasy widoczne z lewej i z prawej, tak jak w Chrome |
| 4 | INDEKS → VULKARIS | Mapa dojeżdża do Vulkarisa, karta się otwiera |
| 5 | Otwarcie karty planety na tablecie poziomo | Mapa zostaje ściśnięta i poprawnie przeskalowana, bez przycięcia ramy |
| 6 | Zamknięcie karty | Mapa wraca do poprzedniego kadru, bez skoku |
| 7 | Obrót tabletu pion ↔ poziom, potem przesunięcie palcem | Mapa nadal się przesuwa, kadr sensowny w obu orientacjach |
| 8 | Dzielony ekran: zmniejszenie okna aplikacji do połowy i z powrotem | Mapa nadal działa |
| 9 | Przełączenie na inną aplikację i powrót w trakcie trzymania palca na mapie | Mapa nadal działa (test P5) |
| 10 | Przeciągnięcie palcem od krawędzi ekranu (gest cofania) i powrót do mapy | Mapa nadal się przesuwa (test P5) |
| 11 | Dwuklik w puste miejsce mapy | Powrót do widoku domyślnego |
| 12 | Kliknięcie planety | Karta się otwiera — bez regresji |
| 13 | Przeciągnięcie zakończone na planecie | Karta **nie** otwiera się (przeciąganie nie jest kliknięciem) |
| 14 | To samo na telefonie w PWA | Bez regresji |
| 15 | To samo w Chrome na tablecie i na komputerze | Bez regresji |

---

## 15. Ryzyka

| Ryzyko | Ocena | Komentarz |
|---|---|---|
| `ResizeObserver` przelicza kadr zbyt często i mapa „drga" | niskie | Wymaga tłumienia (debounce), tak jak dziś działa `resize` z opóźnieniem 120 ms |
| Przeliczanie kadru przy otwarciu karty zmienia przyzwyczajenie użytkownika | średnie | Dotyczy decyzji D2 i D4; dziś zachowanie i tak jest niepoprawne, więc „zmiana" jest naprawą |
| Przeniesienie nasłuchu `pointerup` na `window` łapie zdarzenia spoza mapy | niskie | Filtrowane po `pointerId` — obsługiwane są wyłącznie palce zarejestrowane na mapie |
| Dodanie przycisku w nagłówku psuje układ na telefonie | niskie | Nagłówek ma już reguły ukrywania przy 700 i 560 jednostkach |
| Nie da się potwierdzić naprawy bez dostępu do tabletu | **wysokie** | Kluczowe: testy z rozdz. 14 musisz wykonać Ty. Bez tego naprawa pozostaje nieudowodniona |

---

## 16. Czego ta analiza nie rozstrzyga

Uczciwie, żeby nie było niedomówień:

1. **Nie uruchomiłem pliku na Twoim tablecie.** Diagnoza opiera się na kodzie i na pomiarach
   ze zrzutów ekranu. Zgodność pomiarów jest bardzo wysoka (rozdz. 5.2 — siedem obiektów
   z dokładnością do 1 piksela), ale to nadal wnioskowanie, nie obserwacja urządzenia.
   Test 1 z rozdz. 10 zamienia to w pewność.
2. **Nie wiem, który dokładnie moment powoduje zerowy pomiar** — czy jest to start okna PWA,
   czy zdarzenie zmiany rozmiaru już w trakcie pracy. Test 5 to rozstrzygnie. Dla samej
   naprawy nie ma to znaczenia: poprawki P1–P4 zamykają obie ścieżki.
3. **Nie wykluczyłem całkowicie usterki z rozdz. 11.1** (zablokowane „duchy" palców).
   Daje ona ten sam objaw. Test 1 je rozróżnia, a wariant naprawy (b) z decyzji D1 usuwa obie.
4. **Nie sprawdzałem innych plików modułu** poza `Main/index.html` i manifestem — analiza
   dotyczy zgłoszenia, czyli mapy Gilead.

---

## 17. Następne kroki

1. **Ty:** wykonaj Test 1 z rozdz. 10 (dwuklik). To zajmuje 10 sekund i potwierdza diagnozę.
2. **Ty:** jeżeli masz chwilę — Testy 2–5, zwłaszcza Test 5 (kiedy dokładnie się psuje).
3. **Ty:** odpowiedz na D1–D6 z rozdz. 13 (albo napisz „rekomendacje").
4. **Ja:** wprowadzam uzgodniony zakres poprawek w `Main/Gilead.html`.
5. **Ja:** aktualizuję `Main/docs/Documentation.md` i `Main/docs/README.md` zgodnie z decyzją D6.
6. **Ty:** testy akceptacyjne z rozdz. 14 na tablecie i na telefonie.

---

*Dokument opisuje stan repozytorium na 21 września 2026. Kod aplikacji pozostaje nietknięty.*

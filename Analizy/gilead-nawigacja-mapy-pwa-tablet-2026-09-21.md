# Mapa Gilead — nawigacja nie działa w PWA na tablecie

> **Data:** 21 września 2026 · **aneks:** 22 września 2026 (rozdz. 18–26)
> **Temat:** w aplikacji PWA uruchomionej na tablecie mapa układu Gilead nie daje się przesuwać ani przybliżać/oddalać, natomiast kliknięcia w planety i obszary działają normalnie. W przeglądarce Chrome na tym samym tablecie oraz w PWA na telefonie wszystko działa poprawnie.
> **Plik, którego dotyczy zgłoszenie:** rejestr światów systemu Gilead — w aplikacji widoczny jako `Main/Gilead.html` (moduł `Main`, repozytorium `WrathAndGlory`). **Jest to kopia wydania.** Plik źródłowy i miejsce nanoszenia poprawek to repozytorium `Scenariusze`, `Warhammer40k/Gilead/` — szczegóły w rozdz. 19.
> **Charakter dokumentu:** analiza diagnostyczna. Opisuje stan kodu **sprzed** zmian i projekt naprawy. **Żaden plik aplikacji ani skrypt budowania nie został w ramach tej analizy zmieniony** — powstał wyłącznie ten dokument.
> **Stan na dziś (22 września 2026):** przyczyna ustalona, potwierdzona pomiarem zrzutów ekranu (rozdz. 5–6) i **zweryfikowana niezależnym rachunkiem w repozytorium `Scenariusze`** (rozdz. 20). Decyzje D1–D6 podjęte (rozdz. 22). Zakres naprawy dla repozytorium `Scenariusze`: **P1–P6** (rozdz. 23). Zakres dla repozytorium aplikacji: **D5, D6 i rozdz. 24**. Kod czeka na wdrożenie.
>
> **Czytasz to w repozytorium aplikacji?** Zacznij od rozdz. 19 i 24 — mówią, czego w module `Main` robić **nie** wolno.

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

**Aneks z 22 września 2026 — weryfikacja w repozytorium `Scenariusze`**

18. [Polecenie użytkownika do aneksu, zakres i metoda](#18-polecenie-użytkownika-do-aneksu-zakres-i-metoda)
19. [Sprostowanie najważniejsze — `Gilead.html` jest plikiem **generowanym**](#19-sprostowanie-najważniejsze--gileadhtml-jest-plikiem-generowanym)
20. [Weryfikacja ustaleń analizy — punkt po punkcie](#20-weryfikacja-ustaleń-analizy--punkt-po-punkcie)
21. [Nowe ustalenia — czego w analizie nie ma](#21-nowe-ustalenia--czego-w-analizie-nie-ma)
22. [Decyzje użytkownika z 22 września 2026](#22-decyzje-użytkownika-z-22-września-2026)
23. [Zaktualizowany plan wdrożenia w repozytorium `Scenariusze`](#23-zaktualizowany-plan-wdrożenia-w-repozytorium-scenariusze)
24. [Zakres dla drugiego repozytorium (`WrathAndGlory`, moduł `Main`)](#24-zakres-dla-drugiego-repozytorium-wrathandglory-moduł-main)
25. [Czego ten aneks nie rozstrzyga](#25-czego-ten-aneks-nie-rozstrzyga)
26. [Następne kroki — stan na 22 września 2026](#26-następne-kroki--stan-na-22-września-2026)

> Rozdz. 1–17 to analiza z 21 września. Ich treść **nie została zmieniona** — dopisano
> jedynie trzy wyróżnione odsyłacze do aneksu, w rozdz. 12, 13 i 17. Wszystko, co po
> weryfikacji wymaga sprostowania albo doprecyzowania, jest w aneksie; rozdz. 20 wskazuje
> to miejsce po miejscu.

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

> **Odsyłacz dopisany 22 września 2026.** Ten rozdział opisuje poprawki trafnie, ale
> wskazuje **niewłaściwy plik**: `Gilead.html` jest generowany i nie wolno go edytować
> ręcznie. Zmiany nanosi się w `assemble.py` — przeliczenie numerów linii i przypisanie
> każdej poprawki do miejsca w generatorze: **rozdz. 19**. P3 wymaga doprecyzowania
> (**rozdz. 21.6**), P8 jest niewykonalny (**rozdz. 21.5**).

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

> **Odsyłacz dopisany 22 września 2026.** Wszystkie sześć decyzji zostało podjętych —
> zapis i konsekwencje w **rozdz. 22**. Rozdział poniżej zostaje w pierwotnym brzmieniu
> jako zapis pytań i rekomendacji.

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

> **Odsyłacz dopisany 22 września 2026.** Lista poniżej jest z 21 września i jest już
> częściowo wykonana. Stan bieżący — **rozdz. 26**.

1. **Ty:** wykonaj Test 1 z rozdz. 10 (dwuklik). To zajmuje 10 sekund i potwierdza diagnozę.
2. **Ty:** jeżeli masz chwilę — Testy 2–5, zwłaszcza Test 5 (kiedy dokładnie się psuje).
3. **Ty:** odpowiedz na D1–D6 z rozdz. 13 (albo napisz „rekomendacje").
4. **Ja:** wprowadzam uzgodniony zakres poprawek w `Main/Gilead.html`.
5. **Ja:** aktualizuję `Main/docs/Documentation.md` i `Main/docs/README.md` zgodnie z decyzją D6.
6. **Ty:** testy akceptacyjne z rozdz. 14 na tablecie i na telefonie.

---

*Dokument opisuje stan repozytorium na 21 września 2026. Kod aplikacji pozostaje nietknięty.*

---

# ANEKS z 22 września 2026 — weryfikacja w repozytorium `Scenariusze`

## 18. Polecenie użytkownika do aneksu, zakres i metoda

### 18.1 Polecenie użytkownika (zachowane w całości)

> Zapoznaj się z plikiem Analizy/gilead-nawigacja-mapy-pwa-tablet-2026-09-21.md
> Jest tam zgłoszony problem dotyczący pliku Warhammer40k/Gilead/Gilead.html
>
> Analiza powstała na potrzeby innego repo. Tam mam aplikację pomocniczą do gry TTRPG.
> Plik Gilead.html jest jego częścią. Aplikacja ma wersję PWA. Agent AI przeprowadzający
> analizę nie miał dostępu do repo "Scenariusze" i nie widział skryptów i instrukcji
> do budowania pliku Gilead.html — widział tylko kod ostatecznego pliku.
>
> Moje decyzje:
>
> D1 - zgodnie z rekomendacją
> D2 - zgodnie z rekomendacją
> D3 - wariant b -> nie chcę zaśmiecać mapy dodatkowymi przyciskami. Jak dalej będą
> problemy to się rozważy aktualizację.
> D4 - zgodnie z rekomendacją
> D5 - poza zakresem prac w repo "Scenariusze"
> D6 - poza zakresem prac w repo "Scenariusze"
>
> Sprawdź kod pliku Gilead.html. Zweryfikuj wnioski w analizie. Zaktualizuj analizę
> o własne spostrzeżenia i moje odpowiedzi.
> Po wdrożeniu poprawek ten sam plik z analizą wgram do drugiego repo i tam agent AI
> przeprowadzi zmiany w zakresie D5 i D6 plus ewentualnie to co Ty dopiszesz.
>
> Na tym etapie zajmij się tylko rozbudową analizy.

### 18.2 Co sprawdzono

Wszystko w repozytorium `Scenariusze`. **Żaden plik aplikacji nie został zmieniony** —
aneks dopisano wyłącznie do tego dokumentu.

| Plik | Po co |
|---|---|
| `Warhammer40k/Gilead/Gilead.html` | cały skrypt mapy i CSS — weryfikacja diagnozy wprost w kodzie |
| `Warhammer40k/Gilead/scripts/build/gilead/assemble.py` | **generator** pliku wynikowego: stałe `CSS` i `JS`, funkcja `kontrola()` |
| `Warhammer40k/Gilead/scripts/build/gilead/mapa.py`, `dane.py`, `obrazy.py` | ustalenie, czy naprawa ich dotyka (nie dotyka) |
| `Warhammer40k/Gilead/scripts/build/gilead/test_mapy.py` | istniejące badanie w przeglądarce (Playwright) |
| `Warhammer40k/Gilead/Instrukcja.md` | tryb przebudowy, zakazy, kontrola końcowa |
| `Analizy/Projekt_Mapa_Gilead/ProjektGileadHTML.md` | dokument sterujący projektu mapy: rejestr usterek, decyzje, changelog |
| `AGENTS.md` (główny i lokalne) | zasady pracy w repozytorium |

### 18.3 Metoda

1. **Odczyt kodu w miejscu.** Wszystkie numery linii z rozdz. 4–12 sprawdzono wobec
   bieżącego `Gilead.html` — zgadzają się co do linii.
2. **Symulacja logiki kadru poza przeglądarką.** Funkcje `zastosuj()`, `dopasowanie()`,
   `ogranicz()`, `widokDomyslny()`, `naMape()` i `przyblizWokol()` przepisano 1:1 do
   Node.js, podstawiając za `getBoundingClientRect()` zadany prostokąt. Powtórzono
   rachunek z rozdz. 6 i rozszerzono go o przypadki, których analiza nie rozważała.
3. **Przebudowa kontrolna.** `assemble.py` uruchomiono na kopii roboczej i porównano
   wynik z plikiem w repozytorium bajt po bajcie.
4. **Test kontroli G-6 na sucho.** Wzorce z funkcji `kontrola()` puszczono na próbkach
   kodu, który naprawa musiałaby dopisać — żeby sprawdzić, czy przejdą.

**Czego nadal nie zrobiono:** nie uruchomiono pliku na tablecie i nie widziano zrzutów
ekranu z rozdz. 5. Rozdz. 25 wymienia, co z tego wynika.

---

## 19. Sprostowanie najważniejsze — `Gilead.html` jest plikiem **generowanym**

To jest jedyna rzecz, przez którą analizy z 21 września **nie da się wykonać dosłownie**.
Nie podważa ona diagnozy ani jednym zdaniem. Zmienia wyłącznie **miejsce, w którym
nanosi się poprawki**.

### 19.1 Skąd bierze się plik

Źródłem prawdy jest repozytorium `Scenariusze`:

```
Warhammer40k/Gilead/scripts/build/gilead/assemble.py   ← generator (1346 linii)
       ├── dane.py    — treść kart rejestru
       ├── mapa.py    — geometria mapy
       └── html/gilead_obrazy.py — ilustracje WEBP w base64
                    ↓  python3 scripts/build/gilead/assemble.py
Warhammer40k/Gilead/Gilead.html                        ← wynik, 1,00 MB
```

`Instrukcja.md`, rozdz. 7, pierwsza pozycja listy „Czego nie robić":

> **Nie edytować ręcznie** `KompendiumGilead.html` ani `Gilead.html`.

Ten sam zakaz powtarza nagłówek `assemble.py`: *„Plik wynikowy jest **generowany** —
nigdy nie edytować go ręcznie"*.

### 19.2 Sprawdzono, że budowa odtwarza plik co do bajtu

Przebieg z 22 września 2026 na kopii roboczej:

```
Gilead.html · 1.00 MB (ilustracje 0.89 MB, znaczniki i kod 104 KB)
pozycji: 15 (8 światów + 7 obszarów) · hotspotów: 20
pola: poziom 1 = 111 · poziom 2 = 30 · poziom 3 (utajnione) = 39
kontrola G-6 i G-12: OK
```

`cmp` z plikiem w repozytorium: **identyczne co do bajtu**. Znaczy to dwie rzeczy:

- generator i plik wynikowy **nie rozjechały się** — kod, który agent czytał w analizie,
  jest dokładnie tym, który wychodzi z `assemble.py`, więc cała diagnoza stoi;
- ręczna poprawka w `Gilead.html` **zniknie przy pierwszej przebudowie**, po cichu
  i bez ostrzeżenia.

### 19.3 Gdzie naprawdę leżą linie z rozdz. 12

Przesunięcie jest stałe, bo generator wkleja dwa bloki w całości:

| warstwa | w `Gilead.html` | w `assemble.py` | przesunięcie |
|---|---|---|---|
| CSS (stała `CSS`) | 18…225 | 638…845 | **+620** |
| skrypt (stała `JS`) | 627…885 | 841…1099 | **+214** |

Sprawdzone na dziesięciu punktach zaczepienia, m.in.:

| element | `Gilead.html` | `assemble.py` |
|---|---|---|
| `html,body{margin…}` (P6) | `:18` | `:638` |
| `.cog-plansza{…}` (P6) | `:37` | `:657` |
| `#mapa{…touch-action:none…}` (P6) | `:42` | `:662` |
| `function zastosuj()` (P1) | `:648` | `:862` |
| `function dopasowanie()` (P2) | `:652` | `:866` |
| `function ogranicz()` (P2) | `:659` | `:873` |
| `function widokDomyslny()` (P2, P4) | `:669` | `:883` |
| `var wskazniki={…}` (P5) | `:764` | `:978` |
| `function koniec(ev)` (P5) | `:809` | `:1023` |
| `addEventListener('resize'…)` (P3) | `:880` | `:1094` |

### 19.4 Dokąd trafia każda poprawka

| Poprawka | Plik do zmiany | Uwaga |
|---|---|---|
| P1 — bariera przed niepoprawnym kadrem | `assemble.py`, stała `JS` | — |
| P2 — wspólna funkcja pomiarowa | `assemble.py`, stała `JS` | — |
| P3 — `ResizeObserver` na `#plansza` | `assemble.py`, stała `JS` | — |
| P4 — pierwszy kadr po pierwszej klatce | `assemble.py`, stała `JS` | — |
| P5 — czyszczenie rejestru palców | `assemble.py`, stała `JS` | — |
| P6 — `touch-action` na kontenerze | `assemble.py`, stała `CSS` | — |
| P7 — przycisk `WIDOK` | `assemble.py`, `CSS` + szablon nagłówka | **odpada** — decyzja D3 (b) |
| P8 — metadane PWA | — | **nie da się** — rozdz. 21.5 |
| P9 — flaga `ciagniete` | `assemble.py`, stała `JS` | poza zakresem D1 (b) |

`dane.py`, `mapa.py` i `obrazy.py` **nie są ruszane**: naprawa nie dotyka ani treści
kart, ani geometrii, ani ilustracji.

### 19.5 Co z tego wynika dla drugiego repozytorium

`Main/Gilead.html` w repozytorium aplikacji jest **kopią wydania**, nie plikiem
źródłowym. Poprawka naniesiona tam ręcznie:

- nie wróci do `Scenariusze`, więc zniknie przy następnym wydaniu rejestru;
- rozjedzie się z kontrolą G-6/G-12, która pilnuje wyłącznie wersji budowanej tutaj.

Cała naprawa nawigacji mapy — P1…P6 — należy więc do repozytorium `Scenariusze`.
Rozdz. 24 mówi, co zostaje dla drugiego repozytorium i czego tamtejszy agent robić
**nie ma**.

---

## 20. Weryfikacja ustaleń analizy — punkt po punkcie

Legenda: **✔ potwierdzone** (sprawdzone w kodzie albo rachunkiem) ·
**✔+ potwierdzone i rozszerzone** (patrz rozdz. 21) · **≈ niesprawdzalne tutaj**
(brak dostępu do materiału) · **✘ wymaga sprostowania**.

| Rozdz. | Ustalenie | Ocena | Komentarz |
|---|---|---|---|
| 4 | Opis mechaniki kadru, rola `vb`, trzy wywołania `widokDomyslny()`, `ogranicz()` tylko przycina | **✔** | Zgodne co do linii. `widokDomyslny()` istotnie jest jedyną funkcją nadającą `vb` wartości niewyprowadzone ze starych |
| 4 | Obsługa `resize` woła wyłącznie `ogranicz()` i `zastosuj()` | **✔** | `Gilead.html:880`, tłumienie 120 ms |
| 5 | Pomiar zrzutów, gęstość 1,5, `vb.w ≈ 1973` wobec 1978 | **≈** | Zrzutów nie ma w tym repozytorium. Liczba **1978,2** wychodzi z symulacji dla planszy 1280 × 563 — czyli rachunek analizy się zgadza. Sama zgodność ze zrzutem pozostaje na jej odpowiedzialność |
| 6 | Łańcuch `NaN`: `0/0` → `dopasowanie()` → `vb` → `viewBox="NaN NaN NaN NaN"` | **✔+** | Odtworzone rachunkiem. Nie jest to jednak jedyna droga — rozdz. 21.1 |
| 6 | Stan jest **trwały**: `ogranicz()` z `NaN` daje `NaN` | **✔** | `Math.max(467.5, NaN)` = `NaN`, `Math.min(1978, NaN)` = `NaN`. Po przywróceniu wymiarów 1280 × 563 kadr nadal `"NaN NaN NaN NaN"` |
| 6 | Przesunięcie palcem nie wychodzi ze stanu `NaN` | **✔** | Sprawdzone też dla szczypania i kółka myszy |
| 7 | Wyścig o pomiar; tablet i PWA przegrywają go częściej | **✔** (mechanizm) / **≈** (statystyka) | Mechanizm w kodzie jest — `widokDomyslny()` w `:878` wykonuje się natychmiast, bez `load` i bez `requestAnimationFrame`. Częstości nie da się sprawdzić bez urządzenia |
| 7 pkt 2 | `target="_blank"` w `Main/index.html` | **≈** | Plik spoza tego repozytorium |
| 7 pkt 3 | Jedno zdarzenie „zmiana rozmiaru" przy zerowym pomiarze psuje zdrowy kadr | **✔** | Sprawdzone: kadr zdrowy → jeden `resize` przy 0 × 0 → `"NaN NaN NaN NaN"` → powrót do 1280 × 563 nic nie naprawia |
| 8 | Tabela „co działa, co nie" | **✔** | Zgodna z kodem. Klik na hotspocie nie dotyka `vb` ani razu |
| 9 | Dwuklik naprawia stan | **✔** (w kodzie) / **≈** (na dotyku) | `widokDomyslny()` istotnie wyprowadza z `NaN`. Zastrzeżenie o samym geście — rozdz. 21.4 |
| 11.1 | „Duchy" wskaźników dotyku, brak jakiegokolwiek czyszczenia rejestru | **✔+** | Potwierdzone w `:764`…`:824`. Skutków jest więcej niż trzy — rozdz. 21.3 |
| 11.2 | `touch-action:none` tylko na `#mapa`, brak `overscroll-behavior` | **✔** | `#mapa` — `:42`; `.cog-plansza` (`:37`) nie ma `touch-action`; `html,body` (`:18`) nie ma `overscroll-behavior` |
| 11.3 | Kadr nie jest przeliczany przy zmianie kształtu planszy | **✔+** | Potwierdzone i **zmierzone**: przy planszy 1280 × 563 i otwartej karcie proporcja kadru wynosi 2,274, a proporcja planszy 1,528 — `slice` przycina. Rozdz. 21.6 |
| 11.4 | Brak widocznego wyjścia awaryjnego | **✔** | `.cog-narzedzia` (`:153`, `:224`) niesie wyłącznie przycisk `INDEKS` |
| 11.5 | `Gilead.html` nie ma metadanych PWA, które ma `Main/index.html` | **✔** (fakt) / **✘** (zalecenie P8) | Fakt się zgadza — `<head>` ma sam `viewport`. Ale **P8 w tym kształcie nie przejdzie budowy**: rozdz. 21.5 |
| 11.6 | `setTimeout(...,0)` kasujące `ciagniete` | **✔** | `:819`. Z „duchami" palców flaga w ogóle nie zostaje wyzerowana — rozdz. 21.3 |
| 12 | Kierunek poprawek P1…P6 | **✔** | Merytorycznie trafny. Zmienia się miejsce zmiany (rozdz. 19) i doprecyzowanie P3 (rozdz. 21.6) |
| 12 | P8 — metadane PWA | **✘** | Sprzeczne z zasadą „zero zasobów zewnętrznych" i odrzucane przez kontrolę G-6 |
| 15 | Ryzyko „nie da się potwierdzić naprawy bez tabletu" ocenione jako **wysokie** | **✔ z korektą w dół** | W repozytorium jest gotowe badanie w przeglądarce (`test_mapy.py`), którym da się odtworzyć **samą usterkę kadru** bez tabletu. Rozdz. 21.8 |
| 16 | Czego analiza nie rozstrzyga | **✔** | Do listy dochodzi jeden punkt: analiza nie wiedziała o istnieniu generatora ani badania |

**Wniosek: diagnoza z rozdz. 3 i 6 jest trafna i została potwierdzona niezależnym
rachunkiem.** Poprawek wymagają dwie rzeczy: miejsce nanoszenia zmian (rozdz. 19)
i poprawka P8 (rozdz. 21.5). Reszta stoi.

---

## 21. Nowe ustalenia — czego w analizie nie ma

### 21.1 Drogi zepsucia kadru są **trzy**, nie jedna

Analiza rozważa wyłącznie pomiar `0 × 0`. Plansza może jednak zgłosić zero na jednej
osi — dzieje się tak przy animacji układu, przy zwijaniu okna w trybie dzielonego ekranu
i przy `display:none` na przodku. Rachunek dla wszystkich trzech (start z `widokDomyslny()`,
potem powrót planszy do 1280 × 563 i `ogranicz()`):

| pomiar planszy | `viewBox` po pomiarze | co widać | czy mija samo |
|---|---|---|---|
| `0 × 0` | `"NaN NaN NaN NaN"` | mapa rysowana 1:1 od lewego górnego rogu, nawigacja martwa | **nie** — `"NaN NaN NaN NaN"` zostaje na zawsze |
| `1280 × 0` | `"-419.1 470.0 1978.2 0.0"` | **mapa znika całkowicie** (zerowa wysokość kadru wyłącza rysowanie elementu) | **tak** — pierwszy poprawny pomiar przywraca `"-419.1 465.0 1978.2 870.1"` |
| `0 × 563` | `"570.0 NaN 467.5 Infinity"` | to samo co przy `0 × 0`: atrybut niepoprawny, rysowanie 1:1 | **nie** — `vb.y` zostaje `NaN` na zawsze (`vb.w` i `vb.h` się odbudowują, ale to nie wystarcza) |

Wnioski praktyczne:

1. **Objaw zgłoszony przez użytkownika dają dwa przypadki, nie jeden** — `0 × 0`
   i `0 × 563`. Oba są trwałe i oba wyglądają identycznie.
2. Trzeci przypadek daje objaw **inny i mylący**: mapa na moment znika. Gdyby użytkownik
   kiedyś zgłosił „mapa czasem się nie pokazuje", to jest to samo źródło.
3. Wszystkie trzy zamyka ta sama bariera z P1 — pod warunkiem że sprawdza nie tylko
   `isFinite`, ale i **dodatniość** `w` oraz `h`. Sam test „czy to liczba" przepuści
   przypadek `1280 × 0`.

### 21.2 Kadr można zatruć **gestem**, nie tylko startem i zmianą rozmiaru

Analiza wymienia dwie drogi wejścia w stan `NaN`: zimny start i zdarzenie `resize`.
Jest trzecia, wcale nie egzotyczna: **`naMape()` i `przyblizWokol()` też mierzą planszę**
(`:687`, `:690`) i też nie sprawdzają pomiaru.

Sprawdzone: kadr zdrowy → szczypanie albo kółko myszy w chwili, gdy plansza mierzy
`0 × 0` → `"NaN NaN NaN NaN"` → powrót planszy do 1280 × 563 niczego nie naprawia.

Kiedy to realne: palec na mapie w momencie wejścia w tryb dzielonego ekranu, obrót
z palcem na ekranie, powrót z listy ostatnich aplikacji w trakcie gestu. Dla użytkownika
wygląda to jak „popsuło się w trakcie przesuwania", nie jak „popsuło się przy starcie".

**To samo dotyczy obsługi klawiatury** (`:839`) — `krok` liczy się z `vb.w`, a `+` i `−`
wołają `przyblizWokol()` z pomiarem planszy.

Wniosek dla P2: funkcję pomiarową trzeba wpiąć **we wszystkie sześć miejsc**
wymienionych w rozdz. 12, a nie tylko w te wołane przy starcie i przy `resize`.

### 21.3 Zablokowane palce — dwa skutki, których analiza nie wymienia

Do listy z rozdz. 11.1 dochodzi:

1. **Panel karty przestaje się zamykać stuknięciem w tło.** `koniec()` zeruje `ciagniete`
   tylko wtedy, gdy `liczbaWskaznikow()` spadnie do zera (`:812`). Z jednym „duchem"
   w rejestrze licznik nigdy nie dojdzie do zera, więc `ciagniete` zostaje `true`,
   a `svg.addEventListener('click', …)` (`:829`) wykonuje `zamknij()` tylko przy
   `!ciagniete`. Objaw: karta zamyka się już wyłącznie krzyżykiem albo klawiszem `Escape`.
2. **Przy dwóch „duchach" nie działa również zoom.** Przy trzech wskaźnikach
   `pointermove` nie wchodzi ani w gałąź szczypania (`n===2`), ani w gałąź przesuwania
   (`n!==1` → `return`). Mapa zamiera całkowicie, choć kadr jest zdrowy i `viewBox`
   poprawny — czyli **objaw identyczny jak przy `NaN`, ale z zupełnie innym zapisem
   w konsoli** (żadnego).

Drugi punkt jest ważny dla Testu 7 z rozdz. 10: brak komunikatu `viewBox: Expected number`
w konsoli **nie wyklucza usterki** — wyklucza tylko jej wersję kadrową.

### 21.4 Zastrzeżenie do obejścia z rozdz. 9 (dwuklik)

Obejście opiera się na zdarzeniu `dblclick`. Na dotyku zdarzenie to jest **syntezowane
przez przeglądarkę**, a strona ustawia `touch-action:none` na `#mapa`, co wyłącza
przeglądarkowe powiększanie dwustuknięciem. Z kodu nie da się rozstrzygnąć, czy Chrome
na Androidzie w oknie PWA nadal wyśle `dblclick` — bez urządzenia to pozostaje
prawdopodobne, ale niepotwierdzone.

Znaczenie praktyczne ma to **wyłącznie przed naprawą**, jako obejście. Po wdrożeniu
P1–P4 stan `NaN` jest nieosiągalny i wyjście awaryjne nie jest do niczego potrzebne —
o czym rozdz. 22.3 przy decyzji D3.

### 21.5 Kontrola G-6 odrzuci dwie naturalne poprawki — trzeba je obejść świadomie

`assemble.py` kończy budowę funkcją `kontrola()` (`:1196`), która przy jakimkolwiek
znalezisku **przerywa budowę** (`raise SystemExit(1)`). Dwa jej wzorce stoją dokładnie
na drodze poprawek z tej analizy. Sprawdzone przez puszczenie tych samych wyrażeń
regularnych na próbkach kodu:

| Kod, który naprawa chciałaby dopisać | Wynik kontroli |
|---|---|
| `<link rel="manifest" href="manifest.webmanifest">` | **BŁĄD** — `odwołania zewnętrzne: ['manifest.webmanifest']` |
| `<meta name="theme-color" content="#031605">` | OK |
| `function odswiezKadr(){…}` | **BŁĄD** — `pozostałość widoku listy: odswiez` |
| `function przelicz(){…}` | OK |
| `new ResizeObserver(function(){…})` | OK |
| `window.addEventListener('visibilitychange', …)` | OK |

Dwa wnioski:

1. **P8 w kształcie z rozdz. 12 jest niewykonalny w tym repozytorium.** Nie jest to
   kaprys walidatora: `Gilead.html` ma z założenia (G-D20, rozdz. 3 dokumentu sterującego
   projektu) być plikiem **samodzielnym**, działającym również z `file://` i z odciętą
   siecią — i badanie `test_mapy.py` sprawdza to jako test negatywny. Odwołanie do
   manifestu tę własność łamie. Z całego P8 przechodzą tylko `theme-color`,
   `color-scheme` i `viewport-fit=cover`, bo to czyste `<meta>`. Odwołanie do manifestu,
   jeśli w ogóle jest potrzebne, należy załatwić po stronie modułu `Main` (rozdz. 24),
   a nie w pliku rejestru.
2. **Nazwa nowej funkcji nie może zawierać ciągu `odswiez`.** Kontrola szuka go jako
   pozostałości po dawnym widoku listy i nie odróżnia kontekstu. To pułapka o tyle
   realna, że `odswiezKadr()` jest najbardziej naturalną polską nazwą dla funkcji z P3.
   Bezpieczne nazwy: `przelicz()`, `przelicz_kadr()`, `dopasujKadr()`.

### 21.6 Jak dokładnie „zachować widok" przy zmianie planszy (doprecyzowanie P3 i D2)

Rozdz. 12 opisuje P3 jako „zachować środek i powiększenie, przeliczyć `vb.h` z nowych
proporcji". Sformułowanie jest niejednoznaczne, a obie jego lektury dają **widocznie
różne zachowanie**. Rozstrzygnięto to rachunkiem — plansza 1280 × 563, karta zabiera
420 px:

| wariant | po otwarciu karty | po zamknięciu karty |
|---|---|---|
| **dziś** (nic się nie przelicza) | kadr bez zmian, skala skacze z 1,546 na 2,300 jedn./px, `slice` przycina mapę | wraca samo, bo nic się nie zmieniło |
| **naiwnie**: sam `ogranicz()` | skala zachowana (1,546), ale **środek ucieka** z `x = 570` na `x = 245,5` — mapa skacze w lewo | `vb.w` zostaje 1329 → skala 1,038 → **mapa zostaje przybliżona**, widok nie wraca |
| **środek pilnowany po `ogranicz()`** | skala 1,546, środek 570 ; 470 — poprawnie | `vb.w` nadal zostaje 1329 → **ten sam skok przy zamknięciu** |
| **skala pilnowana wprost** *(zalecane)* | skala 1,546, środek 570 ; 470 | `viewBox` **wraca dokładnie** do `"-419.1 35.0 1978.2 870.1"` |

Znaczenie ma trzeci wiersz: **wariant „zachowaj środek" nie wystarcza** i oblałby
punkt 6 planu testów z rozdz. 14 („zamknięcie karty → mapa wraca do poprzedniego
kadru, bez skoku"). Powodem jest to, że `ogranicz()` przycina `vb.w` w dół, gdy plansza
się zwęża, ale **nie rozciąga go z powrotem**, gdy plansza się poszerza.

Reguła, którą należy wdrożyć:

> Zapamiętaj `skala = vb.w / plansza.width`. Przy każdej zmianie rozmiaru planszy:
> zapamiętaj środek kadru, ustaw `vb.w = skala × nowa_szerokość`, odtwórz `vb.h`
> i środek, wywołaj `ogranicz()`, a potem **zapisz z powrotem** `skala = vb.w / nowa_szerokość`
> (bo `ogranicz()` mogło skalę przyciąć — i wtedy przycięta jest ta prawdziwa).

Sprawdzone na pełnym cyklu — skala 1,5455 jedn./px i środek 570 ; 470 utrzymują się
przez wszystkie przejścia, a każdy powrót odtwarza `viewBox` co do dziesiątej części
jednostki:

| przejście | `viewBox` | skala |
|---|---|---|
| start, karta zamknięta | `-419.1 35.0 1978.2 870.1` | 1,5455 |
| karta otwarta (1280 → 860) | `-94.5 35.0 1329.1 870.1` | 1,5455 |
| karta zamknięta (860 → 1280) | `-419.1 35.0 1978.2 870.1` | 1,5455 |
| obrót na pion (1280 × 563 → 563 × 1280) | `135.0 -519.1 870.1 1978.2` | 1,5455 |
| obrót na poziom | `-419.1 35.0 1978.2 870.1` | 1,5455 |
| dzielony ekran, pół szerokości | `75.5 35.0 989.1 870.1` | 1,5455 |
| powrót z dzielonego ekranu | `-419.1 35.0 1978.2 870.1` | 1,5455 |

### 21.7 `ogranicz()` już pilnuje celu dotykowego 44 px — i to działa na naszą korzyść

Warto to zapisać, bo wygląda na przypadek, a nie jest. Ograniczenie
`maxW = Math.min(dopasowanie(), r.width / SKALA_MIN)` wiąże szerokość kadru z szerokością
planszy tym samym współczynnikiem, którego pilnuje G-D23 (cel dotykowy ≥ 44 px).
Skutek: gdy plansza się zwęża, `maxW` maleje **proporcjonalnie**, czyli zachowanie skali
z rozdz. 21.6 nie jest dodatkowym wymaganiem dopisanym ręcznie — jest tym, do czego
istniejący ogranicznik i tak dąży. Przy planszy 860 px wychodzi `maxW = 1329,1`, a skala
1329,1 / 860 = 1,5455 jedn./px, czyli dokładnie tyle co przy 1280 px.

Praktycznie: poprawka P3 **nie może** zepsuć punktu kontroli mierzącego cele dotykowe
(`test_mapy.py`, pomiar przy 1024 px i 390 px), o ile trzyma się reguły z 21.6.

### 21.8 W repozytorium jest gotowe badanie w przeglądarce — i tu ono działa

`scripts/build/gilead/test_mapy.py` uruchamia `Gilead.html` w Chromium przez Playwright
i sprawdza m.in.: brak zapytań sieciowych przy odciętej sieci, osiągalność wszystkich
15 pozycji, kolejność `tab`, położenie napisów ramy Wyrwy przy czterech rozdzielczościach,
najmniejszy cel dotykowy przy 1024 px i 390 px oraz **zero błędów konsoli**. Ostatni
punkt jest kluczowy: `viewBox="NaN NaN NaN NaN"` daje wpis w konsoli, więc badanie
**złapie usterkę samo**, jeśli tylko doprowadzić do zerowego pomiaru.

Obniża to ryzyko oznaczone w rozdz. 15 jako **wysokie**. Nie da się tu odtworzyć
warunków tabletu ani startu okna PWA, ale da się odtworzyć **przyczynę**: wystarczy
na chwilę odebrać planszy wymiary (np. `display:none` na `.cog-scena`), wywołać
`resize`, przywrócić układ i sprawdzić, czy `viewBox` jest poprawny i czy mapa
reaguje na przesunięcie. `Instrukcja.md`, rozdz. 4.2 wymaga przy tym rzeczy, o której
łatwo zapomnieć:

> Ścieżkę innego wydania podaje się argumentem — to droga do **sprawdzenia badania
> wstecz**, czyli puszczenia go na kopii sprzed poprawki. Bez tego kroku nie wiadomo,
> czy nowy punkt kontroli cokolwiek wykrywa.

Czyli: nowy test najpierw musi **oblać** na dzisiejszym `Gilead.html`, a dopiero potem
przejść na poprawionym. Inaczej nie wiadomo, czy mierzy cokolwiek.

Zostaje przy tym w mocy to, czego badanie nie zastąpi: **testy 1–8 i 14–15 z rozdz. 14
musi wykonać użytkownik na tablecie.** Playwright nie odtworzy ani ekranu powitalnego
PWA, ani gestów systemowych Androida, ani trybu dzielonego ekranu.

### 21.9 Drobiazg do P4 — `widokDomyslny()` jest wołane przed obliczeniem myśli dnia

Kolejność w bloku startowym (`:873`…`:885`) jest taka: losowanie myśli dnia, potem
`widokDomyslny()`, potem podpięcie `resize`. Przy przenoszeniu pierwszego kadru do
`requestAnimationFrame` (P4) trzeba zostawić losowanie myśli tam, gdzie jest — jest
niezależne od układu i nie ma powodu go opóźniać. To uwaga wyłącznie redakcyjna,
żeby przy przenoszeniu nie zabrać w komplecie całego bloku.

---

## 22. Decyzje użytkownika z 22 września 2026

| # | Pytanie | Decyzja użytkownika | Co z tego wynika |
|---|---|---|---|
| **D1** | zakres naprawy | **zgodnie z rekomendacją → wariant (b), pełna: P1…P7** | P8 i P9 poza zakresem. P7 odpada przez D3 — patrz niżej |
| **D2** | zachowanie widoku przy zmianie rozmiaru planszy | **zgodnie z rekomendacją → wariant (a)** — zachować to, co użytkownik ustawił; pełne przeliczenie tylko przy kadrze uszkodzonym | Wdrożenie wg reguły z rozdz. 21.6 (skala pilnowana wprost), nie wg dosłownego brzmienia P3 |
| **D3** | widoczny przycisk powrotu do widoku | **wariant (b)** — nie dodawać przycisku. *„Nie chcę zaśmiecać mapy dodatkowymi przyciskami. Jak dalej będą problemy to się rozważy aktualizację"* | **P7 wypada z zakresu.** Nagłówek zostaje bez zmian. Konsekwencja niżej, 22.3 |
| **D4** | zachowanie karty planety na tablecie | **zgodnie z rekomendacją → wariant (a)** — zostawić jak jest (karta ściska mapę powyżej 1024 px, przykrywa poniżej) | Bez zmian w CSS karty. Poprawne przeliczanie zapewnia P3 |
| **D5** | sposób otwierania mapy ze strony głównej (`target="_blank"`) | **poza zakresem prac w repozytorium `Scenariusze`** | Przechodzi do drugiego repozytorium — rozdz. 24 |
| **D6** | aktualizacja `Main/docs/` | **poza zakresem prac w repozytorium `Scenariusze`** | Przechodzi do drugiego repozytorium — rozdz. 24 |

### 22.1 Zakres wynikowy dla repozytorium `Scenariusze`

**P1, P2, P3, P4, P5, P6.** Sześć poprawek, wszystkie w `assemble.py`.

D1 wybiera wariant (b), czyli P1–P7, a D3 usuwa z niego P7. Nie jest to sprzeczność —
D3 jest pytaniem szczegółowym o jedną z poprawek wariantu (b) i jego rozstrzygnięcie
ma pierwszeństwo. Zakres to więc **P1–P6**.

### 22.2 Poza zakresem — i dlaczego

| | Powód |
|---|---|
| **P7** (przycisk `WIDOK`) | decyzja D3 (b) |
| **P8** (metadane PWA) | poza wariantem D1 (b), a w części „manifest" **niewykonalne** — rozdz. 21.5 |
| **P9** (flaga `ciagniete`) | poza wariantem D1 (b). Zostaje w rejestrze usterek jako drobiazg do rozważenia |
| **P10 / D5, D6** | drugie repozytorium |

### 22.3 Konsekwencja decyzji D3 (b) — P5 przestaje być „zalecana"

Decyzja jest rozsądna i nie tworzy ryzyka, ale **przenosi ciężar**. Dziś jedynym wyjściem
z zawieszonej mapy jest dwuklik — gest, którego nikt nie dokumentuje, a którego działanie
na dotyku nie jest nawet pewne (rozdz. 21.4). Rezygnacja z widocznego przycisku znaczy,
że po naprawie **żadna ścieżka awaryjna nie może wymagać wiedzy użytkownika**, bo jej
po prostu nie będzie.

Dla kadru zapewniają to P1–P4: stan `NaN` staje się nieosiągalny, a gdyby mimo wszystko
powstał, P1 wymusza przeliczenie od nowa. Dla drugiej możliwej przyczyny tego samego
objawu — „duchów" palców z rozdz. 11.1 — zapewnia to **wyłącznie P5**: to on zeruje
rejestr przy `visibilitychange` i przy utracie fokusu, czyli sprawia, że zablokowana
mapa odblokowuje się sama po przełączeniu aplikacji i powrocie.

**Wniosek: przy D3 (b) poprawka P5 przestaje być „zalecana" i staje się konieczna.**
Mieści się w zakresie D1 (b), więc decyzji użytkownika to nie zmienia — zmienia priorytet:
P5 nie jest tą poprawką, którą wolno odłożyć, gdyby zakres trzeba było skrócić.

---

## 23. Zaktualizowany plan wdrożenia w repozytorium `Scenariusze`

Do wykonania w osobnym zadaniu — ten dokument niczego nie zmienia w kodzie.

### 23.1 Zmiany w kodzie

Wszystko w `Warhammer40k/Gilead/scripts/build/gilead/assemble.py`.

| Krok | Miejsce | Treść |
|---|---|---|
| **P2** | stała `JS`, przed `zastosuj()` | Funkcja `wymiary()` zwracająca prostokąt planszy tylko przy `width > 0` **i** `height > 0`, inaczej `null`. Wpiąć w **sześć** funkcji: `dopasowanie()`, `ogranicz()`, `widokDomyslny()`, `naMape()`, `przyblizWokol()` oraz obsługę klawiatury (rozdz. 21.2). Przy `null` — wyjście bez dotykania `vb` |
| **P1** | `zastosuj()` | Przed zapisem sprawdzić, że wszystkie cztery liczby są skończone **i** że `w > 0` oraz `h > 0` (rozdz. 21.1, przypadek `1280 × 0`). Przy niepowodzeniu — nie zapisywać, zamiast tego `widokDomyslny()`, z zabezpieczeniem przed nawrotem |
| **P4** | blok startowy (`JS`, koniec) | Pierwsze `widokDomyslny()` po podwójnym `requestAnimationFrame`; weryfikacja kadru przy `load` i przy powrocie strony do widoczności. Losowanie myśli dnia zostaje tam, gdzie jest (rozdz. 21.9) |
| **P3** | zamiast nasłuchu `resize` | `ResizeObserver` na `#plansza`, tłumienie 120 ms jak dziś. Kadr uszkodzony → `widokDomyslny()`; kadr zdrowy → reguła zachowania skali i środka z rozdz. 21.6. **Nazwa funkcji nie może zawierać `odswiez`** (rozdz. 21.5) |
| **P5** | obsługa wskaźników | `pointerup` i `pointercancel` na `window` z filtrem po `pointerId`; obsługa `lostpointercapture`; zerowanie rejestru przy `visibilitychange` i `blur`; reset stanu gestu, gdy wskaźników jest więcej niż dwa |
| **P6** | stała `CSS` | `touch-action:none` dopisane do `.cog-plansza` (`assemble.py:657`), reguła na `#mapa` zostaje; `overscroll-behavior:none` do `html,body` (`assemble.py:638`) |

### 23.2 Kontrola i badania

1. `python3 scripts/build/gilead/assemble.py` — musi wypisać `kontrola G-6 i G-12: OK`.
   Liczby pozycji, hotspotów i pól **nie mają prawa się zmienić**; rozmiar pliku urośnie
   o rząd jednego kilobajta.
2. Rozszerzyć kontrolę G-12 o **punkt 31**: kadr po sztucznie wymuszonym zerowym pomiarze.
   Badanie ma sprawdzać **skutek** — poprawny `viewBox` i reakcję mapy na przesunięcie —
   a nie obecność barier w kodzie.
3. Rozszerzyć `scripts/build/gilead/test_mapy.py` o ten sam przypadek oraz o test
   przeliczania przy otwarciu i zamknięciu karty (punkty 5 i 6 planu testów z rozdz. 14).
4. **Sprawdzić badanie wstecz** — puścić je na kopii `Gilead.html` sprzed poprawki
   (`test_mapy.py` przyjmuje ścieżkę argumentem). Ma **oblać**. `Instrukcja.md`, rozdz. 4.2.
5. Otworzyć plik i popatrzeć — `Instrukcja.md`, rozdz. 7: *„Nie ufać walidatorowi zamiast oczom"*.
6. Testy 1–8 i 14–15 z rozdz. 14 wykonuje **użytkownik na tablecie**. Bez tego naprawa
   pozostaje nieudowodniona tam, gdzie objaw wystąpił.

### 23.3 Dokumentacja projektu — czego wymaga to repozytorium

Mapa ma własny dokument sterujący: `Analizy/Projekt_Mapa_Gilead/ProjektGileadHTML.md`.
Naprawa musi się w nim zapisać, bo inaczej następna osoba zobaczy zmieniony skrypt bez
powodu. Numeracja ciągła — stan na 22 września 2026: ostatnia usterka **U-20**,
ostatnia decyzja **G-D62**, ostatnia niejasność **G-N11**, ostatni wpis changelogu **G-25**,
ostatni punkt kontroli G-12 — **30**.

| Miejsce | Wpis |
|---|---|
| rozdz. 19, rejestr usterek | **U-21** — nawigacja mapy zawiesza się po pomiarze planszy o zerowym wymiarze; opis z rozdz. 6 i 21.1 tej analizy |
| rozdz. 10, decyzje | **G-D63** — zachowanie widoku przy zmianie rozmiaru planszy: skala i środek pilnowane wprost (D2 (a), reguła z rozdz. 21.6). **G-D64** — brak widocznego przycisku powrotu do widoku (D3 (b)), wraz z uzasadnieniem z rozdz. 22.3 |
| rozdz. 9, changelog | **G-26** — co zmieniono, dlaczego i skąd wiadomo, że działa; wpisy od najnowszego |
| nowy rozdział (kolejność ciągła, po rozdz. 22) | **Etap VI — nawigacja mapy w oknie PWA**: diagnoza, pomiar, warianty, wdrożenie |
| `Instrukcja.md`, rozdz. 4.2 | zaktualizować blok „oczekiwany wynik", jeżeli zmieni się rozmiar pliku |

Zakaz z `AGENTS.md`, rozdz. 5b, dotyczy narzędzi budowania **scenariuszy** (`Template/`),
więc `Template/Problemy/` tej usterki nie obejmuje — `assemble.py` rejestru Gilead jest
osobnym mechanizmem, opisywanym w jego własnym dokumencie sterującym. Zostawiam to jako
świadome rozstrzygnięcie, nie przeoczenie.

---

## 24. Zakres dla drugiego repozytorium (`WrathAndGlory`, moduł `Main`)

Po wdrożeniu P1–P6 ten dokument wędruje do repozytorium aplikacji. Poniżej to, co
tamtejszy agent ma do zrobienia — decyzje D5 i D6 użytkownika plus to, co wyszło przy
tej weryfikacji.

### 24.1 Czego tamtejszy agent robić **nie ma**

> **`Main/Gilead.html` jest kopią wydania, nie plikiem źródłowym.** Powstaje z
> `Warhammer40k/Gilead/scripts/build/gilead/assemble.py` w repozytorium `Scenariusze`
> i jest odtwarzany co do bajtu przy każdej przebudowie. Każda ręczna poprawka w nim —
> nawet jednoznakowa, nawet oczywiście słuszna — **zniknie bez śladu przy następnym
> wydaniu rejestru** i nie wróci do źródła.

Dotyczy to w szczególności:

- poprawek nawigacji mapy (P1–P6) — są wykonywane w `Scenariusze`;
- metadanych PWA w `<head>` pliku rejestru (P8) — patrz 24.4;
- czegokolwiek w bloku `<script>` i w bloku `<style>` tego pliku.

Jeżeli przy pracach nad modułem `Main` wyjdzie usterka **w samym pliku rejestru**, należy
ją **zgłosić**, a nie naprawić na miejscu.

### 24.2 D5 — sposób otwierania mapy ze strony głównej

Decyzja użytkownika: **poza zakresem prac w `Scenariusze`**, czyli do rozstrzygnięcia
tutaj. Materiał z tej analizy:

- dziś `Main/index.html:228` otwiera mapę z `target="_blank"`, co w aplikacji PWA znaczy
  **nowe okno aplikacji** — a nowe okno jest dokładnie tym momentem, w którym wymiary
  bywają jeszcze zerowe (rozdz. 7 pkt 2);
- rekomendacja z rozdz. 13 brzmiała: **zostawić `target="_blank"` po wdrożeniu P1–P4**,
  bo poprawki zamykają przyczynę, a nie objaw;
- P1–P6 są wdrażane w `Scenariusze`, więc warunek tej rekomendacji zostaje spełniony.

**Do sprawdzenia tutaj, czego z tamtej strony nie dało się sprawdzić:** czy `Gilead.html`
mieści się w `scope` z `manifest.webmanifest` i jaki jest `display`. Jeżeli plik wypada
poza `scope`, otwiera się w oknie przeglądarki (albo w karcie niestandardowej), a nie
w oknie aplikacji — to zmienia zarówno diagnozę przebiegu startu, jak i sens samego D5.

### 24.3 D6 — dokumentacja modułu

Decyzja użytkownika: **poza zakresem prac w `Scenariusze`**. Rekomendacja z rozdz. 13
brzmiała (a) — zaktualizować oba pliki `Main/docs/`. Do opisania dochodzi rzecz,
o której tamta dokumentacja nie wie:

> `Main/Gilead.html` jest **kopią wydania** pliku generowanego w repozytorium
> `Scenariusze` (`Warhammer40k/Gilead/`). Nie edytuje się go w module `Main`.
> Zmiany zgłasza się do projektu rejestru; do `Main` trafia gotowy plik.

Bez tego zdania w `Main/docs/Documentation.md` scenariusz „ktoś poprawia mapę na miejscu,
poprawka znika przy następnym wydaniu" powtórzy się przy pierwszej okazji.

### 24.4 Metadane PWA pliku rejestru — rzecz do rozstrzygnięcia, nie do wykonania

Rozdz. 11.5 słusznie zauważa, że `Main/Gilead.html` nie ma metadanych, które ma
`Main/index.html`. Ale poprawki **nie wolno nanieść w pliku rejestru** — ani tutaj
(24.1), ani tam, bo odwołanie do manifestu łamie zasadę samodzielności pliku i jest
odrzucane przez kontrolę G-6 (rozdz. 21.5).

Możliwości, w kolejności od najmniej inwazyjnej:

1. **Nie robić nic.** Rejestr ma wtedy własne, przeglądarkowe tło i pasek systemowy —
   spójności modułu to nie łamie, bo plik i tak jest osobnym dokumentem.
2. **Dopisać do generatora same `<meta>`** — `theme-color`, `color-scheme:dark`,
   `viewport-fit=cover`. Przechodzą kontrolę G-6 (sprawdzone) i nie łamią samodzielności.
   To zmiana w `Scenariusze`, wymagająca osobnej decyzji użytkownika, bo wychodzi poza
   zakres D1 (b).
3. **Objąć plik manifestem od strony modułu `Main`** — przez `scope` i `start_url`,
   bez dotykania `<head>` rejestru.

Punkt 2 jest jedynym, który dotyka `Scenariusze`, i **nie jest zlecony**. Zapisany
tutaj jako opcja do ewentualnego późniejszego polecenia.

### 24.5 Co przekazać z powrotem

Jeżeli po wdrożeniu P1–P6 objaw **nadal wystąpi** na tablecie, potrzebne będą:

- wynik Testu 1 i Testu 5 z rozdz. 10 (dwuklik; kiedy dokładnie się psuje),
- zapis konsoli z `chrome://inspect`, jeśli jest dostępny — z zastrzeżeniem z rozdz. 21.3,
  że **brak komunikatu o `viewBox` nie wyklucza usterki**, tylko jej wersję kadrową,
- odpowiedź, czy karta planety zamyka się stuknięciem w tło mapy (rozdz. 21.3 pkt 1) —
  to najprostszy sposób odróżnienia „duchów" palców od uszkodzonego kadru.

---

## 25. Czego ten aneks nie rozstrzyga

1. **Nie uruchomiono pliku na tablecie.** Ograniczenie z rozdz. 16 pkt 1 zostaje w mocy
   w całości. Symulacja potwierdza, że logika kadru zachowuje się dokładnie tak, jak
   opisuje rozdz. 6 — ale że tablet podaje zerowy pomiar, nadal wiadomo wyłącznie
   z pomiaru zrzutów, którego tu nie powtórzono.
2. **Nie widziano zrzutów ekranu z rozdz. 5.** Ich pomiar przyjęto na wiarę. Przemawia
   za nim to, że jedyna liczba dająca się sprawdzić niezależnie — `vb.w = 1978,2` dla
   planszy 1280 px — wychodzi z symulacji dokładnie tak, jak podaje rozdz. 5.1.
3. **Nie sprawdzono niczego w repozytorium aplikacji.** `Main/index.html`,
   `manifest.webmanifest`, `Main/docs/` i `DetaleLayout.md` są poza tym repozytorium.
   W szczególności **nie wiadomo, czy `Main/Gilead.html` jest dziś zgodny z wydaniem
   budowanym w `Scenariusze`** — to pierwsza rzecz do sprawdzenia po tamtej stronie.
4. **Nie rozstrzygnięto, czy `dblclick` powstaje z dwustuknięcia w oknie PWA**
   (rozdz. 21.4). Znaczenie ma to tylko dla obejścia przed naprawą.
5. **Nie napisano ani nie uruchomiono nowego testu.** Rozdz. 23.2 opisuje, co ma badać;
   wykonanie należy do zadania wdrożeniowego, razem z wymogiem sprawdzenia badania wstecz.
6. **Nie zmieniono żadnego pliku aplikacji ani skryptu budowania.** Jedyną zmianą
   w repozytorium jest ten aneks.

---

## 26. Następne kroki — stan na 22 września 2026

| # | Kto | Co |
|---|---|---|
| 1 | ✔ **wykonane** | Decyzje D1–D6 podjęte (rozdz. 22) |
| 2 | ✔ **wykonane** | Weryfikacja diagnozy w repozytorium `Scenariusze` (rozdz. 20), ustalenie miejsca naprawy (rozdz. 19), doprecyzowanie P3 (rozdz. 21.6) |
| 3 | **agent, repo `Scenariusze`** | Wdrożenie P1–P6 w `assemble.py` wraz z przebudową, rozszerzeniem kontroli G-12 i `test_mapy.py` oraz zapisem U-21, G-D63/G-D64 i changelogu — rozdz. 23 |
| 4 | **użytkownik** | Testy 1–8 i 14–15 z rozdz. 14 na tablecie, w aplikacji PWA. Bez tego naprawa pozostaje nieudowodniona |
| 5 | **agent, repo aplikacji** | D5, D6 i punkty z rozdz. 24 |

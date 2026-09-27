# Mapa Gilead — nawigacja nie działa w PWA na tablecie

> **Data:** 21 września 2026 · **aneks:** 22 września 2026 (rozdz. 18–26) · **uzupełnienie:** 22 września 2026 (rozdz. 27) · **wykonanie:** 22 września 2026 (rozdz. 28) · **zamknięcie:** 22 września 2026 (rozdz. 29) · **lista dla użytkownika:** rozdz. 30 · **wyniki testów na tablecie i nowa usterka przesuwania:** 27 września 2026 (rozdz. 31–37) · **wykonanie N1–N3:** 27 września 2026 (rozdz. 38)
> **Temat:** w aplikacji PWA uruchomionej na tablecie mapa układu Gilead nie daje się przesuwać ani przybliżać/oddalać, natomiast kliknięcia w planety i obszary działają normalnie. W przeglądarce Chrome na tym samym tablecie oraz w PWA na telefonie wszystko działa poprawnie.
> **Plik, którego dotyczy zgłoszenie:** rejestr światów systemu Gilead — w aplikacji widoczny jako `Main/Gilead.html` (moduł `Main`, repozytorium `WrathAndGlory`). **Jest to kopia wydania.** Plik źródłowy i miejsce nanoszenia poprawek to repozytorium `Scenariusze`, `Warhammer40k/Gilead/` — szczegóły w rozdz. 19.
> **Charakter dokumentu:** analiza diagnostyczna wraz z zapisem wykonania. Rozdz. 1–27 opisują stan kodu **sprzed** zmian i projekt naprawy; **rozdz. 28 opisuje naprawę faktycznie wykonaną** w repozytorium `Scenariusze` 22 września 2026; **rozdz. 31–37 zapisują wyniki testów na tablecie z 27 września 2026 i przyczynę nowej usterki, którą ta naprawa wprowadziła; rozdz. 38 — poprawkę tej usterki, wykonaną tego samego dnia.**
> **Stan po wykonaniu N1–N3 (27 września 2026):** **poprawka przesuwania wykonana** w repozytorium `Scenariusze` (rozdz. 38). Badanie prawdziwym dotykiem w oknie tabletu i telefonu: mapa idzie za palcem w **100 %** drogi palca — na wydaniu sprzed poprawki **3 %**; szczypanie, stuknięcia i zabezpieczenia P5 działają. **Nowe wydanie: SHA-256 `3e0d89f5…`** — pełna suma w **rozdz. 38.4**, ta zastępuje sumę z rozdz. 28.8. N4 nie wykonane — czeka na decyzję D8. **Zostaje:** kopia do `Main/Gilead.html`, porównanie sumy, ponowny test według **rozdz. 36**, decyzja D8.
> **Stan po testach z 27 września 2026 (zapis sprzed wykonania N1–N3):** **pierwotna usterka usunięta — potwierdzone na tablecie** (zrzut po uruchomieniu zgadza się z poprawnie policzonym kadrem co do piksela, rozdz. 31.4). **Naprawa z 22 września wprowadziła jednak nową usterkę:** na każdym urządzeniu dotykowym — tablet i telefon, aplikacja i przeglądarka — przeciągnięcie jednym palcem przesuwa mapę tylko o próg 4 pikseli i gest się kończy; mysz działa. Przyczyną jest jeden wiersz dopisany w ramach P5 (nasłuch `lostpointercapture`, rozdz. 32). Usterka **odtworzona w przeglądarce z emulacją dotyku**, a poprawka jednowierszowa sprawdzona na kopii pliku — przesuwanie wraca do 100 %, zabezpieczenia P5 zostają (rozdz. 32.3). **Do zrobienia:** N1–N3 w repozytorium `Scenariusze`, nowe wydanie, kopia do `Main/Gilead.html`, ponowny test według **rozdz. 36**.
> **Stan na 22 września 2026 (zapis z tamtego dnia):** **naprawa wykonana.** Przyczyna ustalona, potwierdzona pomiarem zrzutów ekranu (rozdz. 5–6), zweryfikowana rachunkiem (rozdz. 20), a na koniec **odtworzona w przeglądarce**: badanie puszczone na pliku sprzed poprawki oblewa z komunikatem `viewBox: Expected number, "NaN NaN NaN NaN"`, czyli tym, który rozdz. 10 podawała jako twardy dowód możliwy tylko na tablecie (rozdz. 28.6). W repozytorium `Scenariusze` wdrożone **P1–P6** (rozdz. 28); kontrola G-6 i G-12 oraz badanie w przeglądarce przechodzą bez zastrzeżeń. Pytania otwarte z rozdz. 24.2 i 25 pkt 3 rozstrzygnięte w **rozdz. 27**. **D5, D6 i D7 wykonane** po stronie repozytorium aplikacji — rozdz. 29; kopia wydania w `Main/Gilead.html` potwierdzona sumą kontrolną co do bajtu (rozdz. 29.1). **Zostaje wyłącznie:** testy na tablecie po stronie użytkownika (rozdz. 14).
>
> **Masz sprawdzić mapę na tablecie?** Lista z rozdz. 30 została wykonana 27 września — wyniki są w rozdz. 31. **Po kolejnej poprawce sprawdzasz według rozdz. 36** — krótka, samowystarczalna lista tuż przed zapisem wykonania (rozdz. 38). Poprawka jest już wykonana — rozdz. 36 obowiązuje, gdy tylko nowe wydanie trafi do aplikacji.
>
> **Czytasz to w repozytorium aplikacji?** Zacznij od rozdz. 19 i 24 — mówią, czego w module `Main` robić **nie** wolno — potem od rozdz. 27 (sprawdzenia wykonane po tamtej stronie i wykaz decyzji otwartych, 27.9), a na koniec od **rozdz. 28.8**, gdzie jest suma kontrolna wydania do porównania po skopiowaniu pliku. **Nowa usterka przesuwania z 27 września:** przyczyna w rozdz. 32, zakres poprawki i to, co zostaje po tej stronie, w rozdz. 34, **suma kontrolna poprawionego wydania w rozdz. 38.4** — to z nią porównuje się kopię, nie z sumą z 28.8.

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

**Uzupełnienie agenta repozytorium `WrathAndGlory`**

27. [Uwagi agenta repozytorium aplikacji](#27-uwagi-agenta-repozytorium-aplikacji)

**Wykonanie — naprawa w repozytorium `Scenariusze`**

28. [Co dokładnie naprawiono](#28-co-dokładnie-naprawiono)

**Zamknięcie — wykonanie D5, D6 i D7 w repozytorium `WrathAndGlory`**

29. [Co zrobiono po stronie aplikacji](#29-co-zrobiono-po-stronie-aplikacji)

**Dla użytkownika — wszystko do sprawdzenia w jednym miejscu, na samym końcu dokumentu**

30. [**WSZYSTKO, CO MASZ SPRAWDZIĆ — W JEDNYM MIEJSCU**](#30-wszystko-co-masz-sprawdzić--w-jednym-miejscu)

**Wyniki testów z 27 września 2026 — nowa usterka przesuwania**

31. [Wyniki testów na tablecie — zapis](#31-wyniki-testów-na-tablecie--zapis)
32. [Dlaczego przesuwanie nie działa — przyczyna](#32-dlaczego-przesuwanie-nie-działa--przyczyna)
33. [Artefakty przy przybliżaniu (test B) — ocena](#33-artefakty-przy-przybliżaniu-test-b--ocena)
34. [Co trzeba poprawić — zakres dla repozytorium `Scenariusze`](#34-co-trzeba-poprawić--zakres-dla-repozytorium-scenariusze)
35. [Decyzja do podjęcia](#35-decyzja-do-podjęcia)
36. [**CO SPRAWDZIĆ PO POPRAWCE — LISTA DLA CIEBIE**](#36-co-sprawdzić-po-poprawce--lista-dla-ciebie)
37. [Ryzyka, czego ta część nie rozstrzyga, następne kroki](#37-ryzyka-czego-ta-część-nie-rozstrzyga-następne-kroki)

**Wykonanie z 27 września 2026 — N1–N3 w repozytorium `Scenariusze`**

38. [Co wykonano — N1–N3](#38-co-wykonano--n1n3)

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

> **Odsyłacz dopisany 22 września 2026.** Ten rozdział służył **rozpoznaniu** usterki,
> zanim było wiadomo, co się dzieje. Usterka jest rozpoznana i naprawiona, więc tych
> testów **już się nie wykonuje**. To, co z nich nadal ma sens, jest przeniesione
> do **rozdz. 30** na końcu dokumentu.

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

> **Odsyłacz dopisany 22 września 2026.** Fakt opisany niżej się zgadza, ale **waga jest
> mniejsza, niż tu napisano**: kolor pasków systemowych w oknie PWA bierze się z manifestu,
> który rejestr już obejmuje, a `viewport-fit=cover` byłoby tu wręcz ryzykiem. Rozstrzygnięcie
> i rekomendacja „nie robić nic" — **rozdz. 27.4**.

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
  obecnie nie opisują one mapy Gilead w ogóle. **← zdanie nieprawdziwe, sprostowane
  22 września 2026: opisują ją obszernie, tylko jako plik modułu `Main`. Rekomendacja (a)
  zostaje, ale zakres prac jest większy — rozdz. 27.3.**
- **(b) Tylko `Documentation.md`.**
- **(c) Pominąć** (niezgodne z `AGENTS.md`).

---

## 14. Plan testów po naprawie

> **Odsyłacz dopisany 22 września 2026.** Lista poniżej zostaje jako zapis planu.
> Wersja do wykonania — rozpisana krok po kroku, z zaznaczeniem, co sprawdzono już
> maszynowo, i z instrukcją na wypadek niepowodzenia — jest w **rozdz. 30**.

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
| 3 | ✔ **wykonane 22.09** | Wdrożenie P1–P6 w `assemble.py` wraz z przebudową, rozszerzeniem kontroli G-6 o punkt 31 i `test_mapy.py` oraz zapisem U-21, G-D63/G-D64 i changelogu — **rozdz. 28** |
| 4 | **użytkownik** | Testy 1–8 i 14–15 z rozdz. 14 na tablecie, w aplikacji PWA. Bez tego naprawa pozostaje nieudowodniona |
| 5 | ✔ **wykonane 22.09** | D5, D6 i D7 po stronie repozytorium aplikacji — **rozdz. 29** |
| 6 | **użytkownik** | Testy 1–8 i 14–15 z rozdz. 14 na tablecie — jedyna rzecz otwarta poza drobiazgiem P9 |

---

# UZUPEŁNIENIE z 22 września 2026 — sprawdzenia po stronie repozytorium `WrathAndGlory`

## 27. Uwagi agenta repozytorium aplikacji

Aneks z rozdz. 18–26 w dwóch miejscach wprost odsyła pytania do tego repozytorium:
rozdz. 24.2 („do sprawdzenia tutaj: czy `Gilead.html` mieści się w `scope`") i rozdz. 25
pkt 3 („nie wiadomo, czy `Main/Gilead.html` jest dziś zgodny z wydaniem budowanym
w `Scenariusze`"). Oba są poniżej rozstrzygnięte. Do tego dochodzi jedno **sprostowanie
mojego własnego błędu z rozdz. 13**, doprecyzowanie rozdz. 24.4 i jedna nowa decyzja
do podjęcia.

**Żaden plik aplikacji nie został zmieniony** — jedyną zmianą jest ten rozdział.

### 27.1 Odpowiedź na pytanie z rozdz. 24.2 — `scope` i `display` manifestu

Sprawdzone w `manifest.webmanifest` (leży w katalogu głównym repozytorium):

```json
"start_url": "./Main/index.html",
"scope": "./",
"display": "standalone",
"theme_color": "#031605"
```

Manifest jest podpięty wyłącznie z `Main/index.html` (`:9`, jako `../manifest.webmanifest`),
więc `scope: "./"` rozwija się względem **adresu manifestu**, czyli katalogu głównego:

| | adres |
|---|---|
| zasięg (`scope`) | `https://cutelittlegoat.github.io/WrathAndGlory/` |
| strona startowa | `https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html` |
| rejestr Gilead | `https://cutelittlegoat.github.io/WrathAndGlory/Main/Gilead.html` |

**`Main/Gilead.html` mieści się w zasięgu**, a tryb wyświetlania to `standalone`.
Założenie aneksu jest więc trafne: rejestr otwiera się **w oknie aplikacji**, nie w oknie
przeglądarki ani w karcie niestandardowej. Przesłanka decyzji D5 („nowe okno aplikacji
to moment, w którym wymiary bywają zerowe") zostaje w mocy.

Dwie rzeczy warte zapisania, bo łatwo się na nich potknąć:

1. **`Gilead.html` nie podpina manifestu i nie musi.** Zasięg jest własnością manifestu,
   a nie strony, do której się przechodzi. Brak `<link rel="manifest">` w rejestrze
   niczego tu nie psuje — i dobrze, bo dopisanie go jest w repozytorium `Scenariusze`
   niewykonalne (rozdz. 21.5).
2. **Zrzuty ekranu to potwierdzają.** Na zrzutach z przeglądarki widać dwie karty
   („Kozi Przybornik" i „Rejestr światów systemu Gi…") — `target="_blank"` otworzył
   drugą kartę. Na zrzutach z aplikacji nie ma ani paska kart, ani paska adresu —
   czyli rejestr został w oknie PWA.

### 27.2 Odpowiedź na pytanie z rozdz. 25 pkt 3 — czy kopia wydania jest zgodna

Rozdz. 19.2 podaje, co wypisuje przebudowa w `Scenariusze`. Zmierzyłem te same wielkości
na kopii leżącej tutaj:

| wielkość | raport budowy (rozdz. 19.2) | `Main/Gilead.html` | |
|---|---|---|---|
| rozmiar | 1,00 MB | 1 045 273 B = 1,00 MB | ✔ |
| pozycji | 15 (8 światów + 7 obszarów) | 15 różnych `data-cel`, 15 kart `#dane-*` | ✔ |
| hotspotów | 20 | 20 | ✔ |
| pola poziom 1 | 111 | 111 (180 wierszy `<tr>` minus `p2` i `p3`) | ✔ |
| pola poziom 2 | 30 | 30 (`tr.p2`) | ✔ |
| pola poziom 3 (utajnione) | 39 | 39 (`tr.p3`) | ✔ |

Wszystkie sześć wielkości zgadza się co do jednostki. Do porównania bajt po bajcie
podaję odcisk pliku:

```
SHA-256  dbddab910320a614ff8140c6acf0afeba8cbac885a79d03e834050f7fc4849c2
rozmiar  1045273 B
plik     Main/Gilead.html (repozytorium WrathAndGlory, gałąź main)
```

**Do wykonania po tamtej stronie:** `sha256sum Warhammer40k/Gilead/Gilead.html` przed
naniesieniem poprawek. Zgodność sumy zamyka pytanie z rozdz. 25 pkt 3 ostatecznie;
rozbieżność znaczy, że kopia wydania rozjechała się ze źródłem i trzeba to wyjaśnić
**przed** naprawą, a nie po niej.

Stan na teraz: **żadnego śladu rozjechania się.** Zgodność sześciu liczników jest mocną
poszlaką, ale poszlaką — dowodem jest dopiero suma kontrolna z obu stron.

### 27.3 Sprostowanie mojego błędu w rozdz. 13, decyzja D6

W rozdz. 13 napisałem przy wariancie (a): *„obecnie nie opisują one mapy Gilead w ogóle"*.
**To jest nieprawda.** Sprawdzone: `Main/docs/Documentation.md` wspomina Gilead 22 razy,
`Main/docs/README.md` — 20 razy.

Rzecz w tym, **jak** go opisują. Dokumentacja traktuje `Main/Gilead.html` jako zwykły
plik modułu `Main`:

| miejsce | co mówi dziś |
|---|---|
| `Documentation.md:45` / `:480` | tabela plików modułu: *„Samodzielna strona z rejestrem światów systemu Gilead"* — bez śladu informacji, że to wydanie z innego repozytorium |
| `Documentation.md:409` / `:844` | **procedura odtworzenia modułu 1:1** — krok 9 każe dodać linki do `Gilead.html`, ale nie mówi, skąd ten plik wziąć |
| `Documentation.md:112` / `:547` | *„`Gilead.html` otwierany w nowej karcie (`target="_blank"`)"* — dotyczy D5 |
| `README.md:95`, `:187` | instrukcja użytkownika i wiersz rozwiązywania problemów *„`Gilead` nie otwiera nowej karty"* |

Najpoważniejszy jest wiersz drugi. `AGENTS.md` rozdz. 3 wymaga, żeby `Documentation.md`
pozwalał **odtworzyć moduł 1:1 w razie utraty plików**. Dziś procedura odtworzenia
prowadzi do wniosku, że `Gilead.html` jest czymś, co się w module `Main` pisze — a jest
czymś, co się do niego **kopiuje z wydania**. Kto pójdzie tą procedurą, albo odtworzy
pusty plik, albo zacznie go pisać od zera.

**Skutek dla zakresu D6:** to nie jest „dopisanie jednego zdania", jak sugeruje rozdz. 24.3.
Trzeba ruszyć cztery miejsca (tabelę plików, procedurę odtworzenia, tabelę testów
i instrukcję użytkownika), w obu wersjach językowych — `AGENTS.md` rozdz. 5 wymaga pełnej
wersji polskiej i pełnej angielskiej, nie mieszania sekcja po sekcji. Rekomendacja (a)
z rozdz. 13 pozostaje słuszna, tylko pracy jest więcej, niż zapowiadałem.

### 27.4 Doprecyzowanie rozdz. 24.4 — wariant 3 nie zadziała tak, jak brzmi

Rozdz. 24.4 wymienia jako możliwość: *„objąć plik manifestem od strony modułu `Main` —
przez `scope` i `start_url`, bez dotykania `<head>` rejestru"*.

**Zasięg manifestu nie wstrzykuje do strony żadnych `<meta>`** — to dwie różne rzeczy.
Wariant 3 w tym brzmieniu nie da rejestrowi ani `color-scheme`, ani `viewport-fit`.
Daje natomiast coś innego, o czym warto wiedzieć, bo **to już działa**:

> Rejestr **jest** w zasięgu manifestu (rozdz. 27.1), a manifest niesie
> `"theme_color": "#031605"`. W oknie aplikacji obszary systemowe biorą kolor
> z manifestu, dopóki strona nie poda własnego `<meta name="theme-color">`.
> Czyli **w PWA problem koloru pasków systemowych jest już załatwiony** i brak
> `theme-color` w `Gilead.html` nie ma tam znaczenia. Ma znaczenie dopiero przy
> otwarciu pliku w zwykłej karcie przeglądarki.

Z całego P8 zostaje więc realnie:

| brakujący element | gdzie boli | ocena |
|---|---|---|
| `theme-color` | tylko w zwykłej karcie przeglądarki, nie w PWA | kosmetyka |
| `color-scheme: dark` | wygląd paska przewijania panelu karty | kosmetyka |
| `viewport-fit=cover` | **lepiej go nie dodawać** — patrz niżej | — |

Ostatni wiersz jest ostrzeżeniem, nie brakiem. `Gilead.html` układa całą stronę na
`.cog{position:fixed;inset:0}` (`:26`) i nigdzie nie używa `env(safe-area-inset-*)`.
Domyślne `viewport-fit=auto` trzyma treść **wewnątrz** obszaru bezpiecznego — czyli jest
tu ustawieniem bezpieczniejszym. Dodanie `cover` bez dopisania marginesów
`safe-area` wsunęłoby nagłówek i stopkę pod paski systemowe. `Main/index.html` może sobie
na `cover` pozwolić, bo ma dopisany dolny `safe-area` padding (`DetaleLayout.md`, sekcja
„Aktualizacja layoutu PWA — 2026-03-29"); rejestr takiego zabezpieczenia nie ma.

**Rekomendacja:** wariant 1 z rozdz. 24.4 — **nie robić nic**. Rzecz jest kosmetyczna,
a jedyny element, który wyglądał na istotny (kolor pasków systemowych), jest już
obsłużony przez manifest. To koryguje także wagę mojej własnej rozdz. 11.5: fakt się
zgadza, ale znaczenie jest mniejsze, niż tam napisałem.

### 27.5 Nowa decyzja do podjęcia — D7: `DetaleLayout.md`

`AGENTS.md` rozdz. 8 każe aktualizować `DetaleLayout.md` przy zmianach wyglądu, w tym
„responsywności" i „układu elementów". Poprawka **P6** dopisuje `touch-action:none`
do `.cog-plansza` i `overscroll-behavior:none` do `html,body`.

Sprawdzone: `DetaleLayout.md` opisuje dziś z całego rejestru **wyłącznie przyciski
`Galaktyka` i `Gilead` na stronie głównej** (`:164`, `:175`, `:182`) — czyli element
`Main/index.html`, a nie wnętrze rejestru. O układzie samej mapy nie ma tam ani słowa.

- **(a) Nie dopisywać nic** *(rekomendacja)* — `touch-action` i `overscroll-behavior`
  sterują obsługą gestów, a nie wyglądem: nie zmieniają ani jednego piksela. Dodatkowo
  `DetaleLayout.md` opisywałby wtedy wygląd pliku, którego to repozytorium nie jest
  właścicielem (rozdz. 24.1), co sprzyja rozjeżdżaniu się opisu ze źródłem.
- **(b) Dopisać krótką sekcję** o obsłudze gestów mapy — spójne z literalnym brzmieniem
  `AGENTS.md` rozdz. 8, kosztem duplikowania opisu należącego do `Scenariusze`.

### 27.6 Ograniczenie z `AGENTS.md` przy wykonywaniu D6

Do uwzględnienia przez agenta, który będzie robił D6, bo łatwo tu o odruch:

`AGENTS.md` rozdz. 11 zabrania opisywania folderu `Analizy` w `README.md`,
`Documentation.md` i w dokumentacji odtworzeniowej. Zdanie proponowane w rozdz. 24.3
ma więc podać **fakt** („to jest kopia wydania z repozytorium `Scenariusze`,
`Warhammer40k/Gilead/`; nie edytuje się go tutaj") i **nie** odsyłać do tego dokumentu.
Wyjątek z rozdz. 11 wymaga wyraźnej zgody użytkownika.

`AGENTS.md` rozdz. 13 zabrania też commitowania bez wyraźnej prośby — wdrożenie D6
kończy się więc pokazaniem zmian, a nie commitem z automatu.

### 27.7 Jak poprawiony plik dotrze na tablet

Rzecz praktyczna na etap 5 z rozdz. 26, bo jeśli to pominąć, wyjdzie fałszywy wniosek
„naprawa nie zadziałała":

1. **Nie trzeba przeinstalowywać aplikacji.** `Main/index.html` (`:291`) aktywnie
   **wyrejestrowuje** wszystkie Service Workery — aplikacja działa wyłącznie online,
   więc nie ma pamięci podręcznej offline, która trzymałaby starą wersję rejestru.
2. **Może za to zadziałać zwykła pamięć podręczna HTTP.** `Gilead.html` ma 1 MB;
   GitHub Pages podaje go z nagłówkami pozwalającymi na buforowanie. Jeżeli po wgraniu
   poprawionego pliku objaw nie zniknie, **zanim uzna się naprawę za nieudaną** należy
   wyczyścić dane witryny dla aplikacji (Android: Ustawienia → Aplikacje → *Kozi
   Przybornik* → Pamięć → Wyczyść dane) albo otworzyć rejestr raz w Chrome z twardym
   odświeżeniem.
3. **Najszybsze sprawdzenie, że nowy plik naprawdę się wczytał** — Test 2 z rozdz. 10
   (kompletność ramy Szczeliny). Jeżeli w aplikacji widać zakreskowane pasy z lewej
   i z prawej, to znaczy, że kadr jest liczony poprawnie, czyli że działa nowa wersja.
4. **Do odesłania po wydaniu** (uzupełnia rozdz. 24.5): suma `sha256sum Main/Gilead.html`
   po skopiowaniu wydania. Porównanie z sumą z rozdz. 27.2 mówi jednoznacznie, czy
   na tablecie jest już plik po naprawie, czy nadal ten sprzed niej.

### 27.8 Czego nie sprawdziłem po tej stronie

1. **Nie uruchomiłem niczego na tablecie.** Ograniczenie z rozdz. 16 pkt 1 i rozdz. 25
   pkt 1 zostaje w mocy w całości.
2. **Nie widziałem repozytorium `Scenariusze`** — `assemble.py`, `Instrukcja.md`,
   `test_mapy.py` ani dokumentu sterującego projektu. Rozdz. 19–23 przyjmuję jako opis
   stanu tamtej strony i nie weryfikowałem numerów linii w `assemble.py`.
3. **Nie sprawdziłem zachowania `target="_blank"` w praktyce** — to, że rejestr został
   w oknie aplikacji, odczytałem ze zrzutów, a nie z uruchomienia.
4. **Nie rozstrzygnąłem, czy manifest faktycznie nadaje kolor pasków systemowych
   w oknie PWA na tym konkretnym tablecie** (rozdz. 27.4). Tak to działa zgodnie
   ze specyfikacją i tak zachowuje się Chrome, ale bez urządzenia jest to oczekiwanie,
   nie pomiar. Ma to znaczenie wyłącznie dla kosmetyki i dla oceny wagi P8.
5. **Nie zmieniłem żadnego pliku aplikacji ani dokumentacji modułu.** D5, D6 i D7 czekają
   na decyzje i osobne zadanie.

### 27.9 Uzupełniony wykaz decyzji otwartych

> **Odsyłacz dopisany 22 września 2026.** Wszystkie pozycje tabeli poniżej zostały
> rozstrzygnięte i wykonane — stan końcowy w **rozdz. 29.7**.

| # | Pytanie | Stan |
|---|---|---|
| **D5** | `target="_blank"` przy przycisku `Gilead` | **otwarte** — rekomendacja: zostawić. Przesłanka potwierdzona w rozdz. 27.1, warunek („po wdrożeniu P1–P4") spełniony przez zakres z rozdz. 22.1 |
| **D6** | aktualizacja `Main/docs/` | **otwarte** — rekomendacja (a). Zakres większy, niż zapowiadałem: cztery miejsca w dwóch wersjach językowych (rozdz. 27.3) |
| **D7** | `DetaleLayout.md` | **nowe, otwarte** — rekomendacja (a): nie dopisywać (rozdz. 27.5) |
| **P8** | metadane PWA rejestru | **zamknięte rekomendacją** — wariant 1 z rozdz. 24.4: nie robić nic (rozdz. 27.4) |

---

# WYKONANIE z 22 września 2026 — naprawa w repozytorium `Scenariusze`

## 28. Co dokładnie naprawiono

### 28.1 Polecenie użytkownika (zachowane w całości)

> Przeczytaj zaktualizowaną analizę Analizy/gilead-nawigacja-mapy-pwa-tablet-2026-09-21.md
> Agent AI mający dostęp do repo "WrathAndGlory" (czyli tam gdzie siedzi kopia pliku
> Gilead.html i gdzie jest PWA) dopisał swoje uwagi i spostrzeżenia.
>
> Twoim celem teraz jest wykonanie dwóch kroków.
> 1. Naprawa pliku Gilead.html zgodnie z analizą (poprzez naprawę plików budujących
> poprzez skrypt).
> 2. Zaktualizowanie analizy o opis dokładnie dokonanych napraw
>
> Ja po swojej stronie skopiuję plik Gilead.html do repo "WrathAndGlory" oraz wkleję tam
> pełną treść tej analizy.
> Następnie agent AI mający dostęp do repo "WrathAndGlory" dokona tam korekt w kodzie.

### 28.2 Stan przed naprawą — suma kontrolna zgodna

Pierwsza czynność, zgodnie z rozdz. 27.2:

```
SHA-256  dbddab910320a614ff8140c6acf0afeba8cbac885a79d03e834050f7fc4849c2
rozmiar  1045273 B
plik     Warhammer40k/Gilead/Gilead.html (repozytorium Scenariusze, przed naprawą)
```

**Jest to co do znaku ta sama suma, którą agent repozytorium aplikacji zmierzył na
`Main/Gilead.html`.** Kopia wydania nie rozjechała się ze źródłem ani o bajt — pytanie
z rozdz. 25 pkt 3 jest tym samym zamknięte, już nie poszlaką, tylko dowodem.

### 28.3 Zakres wykonania

Wykonane **P1–P6**, zgodnie z rozdz. 22.1. Wszystko w
`Warhammer40k/Gilead/scripts/build/gilead/assemble.py` — stałe `CSS` i `JS`.
`dane.py`, `mapa.py` i `obrazy.py` **nietknięte**.

| | Stan | Uwaga |
|---|---|---|
| **P1** bariera przed niepoprawnym kadrem | ✔ wykonane | sprawdza **dodatniość**, nie samą skończoność — patrz 28.4 |
| **P2** jedna funkcja pomiarowa | ✔ wykonane | wpięta w sześć miejsc, w tym obsługę klawiatury |
| **P3** przeliczanie po zmianie planszy | ✔ wykonane | `ResizeObserver` plus przeliczenie wprost przy otwarciu i zamknięciu karty |
| **P4** pierwszy kadr po pierwszej klatce | ✔ wykonane | podwójne `requestAnimationFrame`, `load`, `visibilitychange` |
| **P5** czyszczenie rejestru palców | ✔ wykonane | `visibilitychange`, `blur`, `lostpointercapture`, trzeci wskaźnik, nasłuch na `window` |
| **P6** `touch-action` na kontenerze | ✔ wykonane | plus `overscroll-behavior:none` |
| **P7** przycisk powrotu do widoku | ✘ **nie wykonane** | decyzja D3 (b) użytkownika; zapisane jako G-D64 |
| **P8** metadane PWA | ✘ **nie wykonane** | poza D1 (b), a w części „manifest” niewykonalne — rozdz. 21.5 i 27.4 |
| **P9** flaga `ciagniete` | ✘ **nie wykonane** | poza D1 (b); zostaje jako drobiazg |

### 28.4 Zmiany w kodzie — co konkretnie doszło

Numery linii odnoszą się do **nowego** `Gilead.html`.

**P2 — `wymiary()` (`:668`).** Jedno miejsce pomiaru w całym skrypcie. Zwraca prostokąt
tylko przy `width > 0` **i** `height > 0`, inaczej `null`. Wpięte w `dopasowanie()`,
`ogranicz()`, `widokDomyslny()`, `naMape()`, `przyblizWokol()` oraz obsługę klawiatury.
Każda z nich przy `null` wychodzi **bez dotykania `vb`**. `dopasowanie()` przyjmuje teraz
prostokąt jako argument, więc pomiar nie powtarza się w tym samym wywołaniu.

Klawisz `Home` obsłużono przed sprawdzeniem pomiaru i wyprowadzono z łańcucha `else if` —
to jedyny klawisz, który ma działać także wtedy, gdy kadr jest policzony źle.

**P1 — `poprawny()` i bariera w `zastosuj()` (`:675`, `:685`).** Do SVG nie trafia kadr,
z którego nie da się wrócić. Sprawdzana jest skończoność wszystkich czterech liczb **oraz
dodatniość `w` i `h`** — bo pomiar o zerowej wysokości daje `vb.h = 0`, czyli atrybut
składniowo poprawny, który wyłącza rysowanie całego SVG. Przy niepowodzeniu `awaria()`
liczy widok od nowa; blokada `ratujemy` chroni przed kółkiem, gdy plansza nadal nie ma
wymiarów, a w atrybucie zostaje wtedy ostatni dobry kadr.

**P3 — `przelicz()` (`:749`) i obserwator rozmiaru (`:1031`).** `ResizeObserver` na
`#plansza` zamiast nasłuchu `resize`, tłumienie 120 ms bez zmian, z zapasowym `resize`
dla przeglądarek bez obserwatora. `przelicz()` zachowuje **skalę i środek** zgodnie
z regułą z rozdz. 21.6 i decyzją D2 (a).

**P4 — `domierz()` (`:1001`).** Pierwszy kadr liczony jak dotąd natychmiast — w zwykłej
przeglądarce plansza ma już wtedy wymiary i mapa nie mruga — a `domierz()` powtarza go
za podwójnym `requestAnimationFrame`, przy `load` i przy powrocie strony do widoczności.
Warunkiem jest `skala === null`, a nie `poprawny(vb)`: przy pustym pomiarze `vb` zostaje
przy wartościach początkowych, które są poprawne liczbowo, tylko nie mają nic wspólnego
z tym oknem. To rozróżnienie jest istotne — na `poprawny(vb)` sito by nie zadziałało.

**P5 — `zerujGest()` (`:860`).** Rejestr wskaźników czyszczony do zera przy
`visibilitychange` (strona ukryta), przy `blur` okna, przy `lostpointercapture` i wtedy,
gdy pojawia się trzeci wskaźnik. `pointerup` i `pointercancel` przeniesione z SVG na
`window`, z filtrem po `pointerId`, żeby palec podniesiony poza mapą też zamykał gest.

**P6 — CSS (`:21`, `:40`).** `overscroll-behavior:none` na `html,body`;
`touch-action:none` dopisane do `.cog-plansza`, reguła na `#mapa` zostaje.

### 28.5 Dwie rzeczy, które wyszły dopiero przy badaniu

Żadnej z nich nie dało się zobaczyć, czytając kod — obie wyszły z uruchomienia.

**Skala rozjeżdżała się przy każdym otwarciu karty.** Pierwsza wersja wyprowadzała skalę
z każdego `zastosuj()`. Tymczasem `pokazPunkt()` woła `zastosuj()` natychmiast po
odsłonięciu karty: plansza ma już nową, węższą szerokość, a kadr jeszcze starą. Zapisana
wtedy skala jest zawyżona, a błąd **mnoży się z każdym otwarciem karty**. Pomiar przy
oknie 1440 × 900:

| | `viewBox` |
|---|---|
| start | `-270.0 -71.3 1870.0 1042.7` |
| po 15 otwarciach karty, pierwsza wersja poprawki | `713.4 206.6 470.8 370.6` — maksymalne przybliżenie |
| po 15 otwarciach, wersja końcowa | `-270.0 -222.7 1870.0 1042.7` |
| po 30 otwarciach, wersja końcowa | `-67.0 -222.7 1870.0 1042.7` |

Szerokość kadru stoi na 1870,0; zmienia się wyłącznie położenie, i to za sprawą
`pokazPunkt()`, który dojeżdża do pozycji dostającej fokus — czyli zachowania sprzed
naprawy. Stąd `zapamietajSkale()` wołane **wyłącznie w trzech miejscach**, gdzie skala
powstaje z rozmysłu: `widokDomyslny()`, `przelicz()`, `przyblizWokol()`. Przesuwanie
i dojazd do pozycji skali nie zmieniają, więc nie mają czego zapisywać. Zapisane jako
G-D63 w dokumencie sterującym projektu.

**Karta zmienia szerokość planszy, a okno przy tym nie drga.** Tłumienie 120 ms, sensowne
przy obrocie i dzielonym ekranie, zostawiało przez ten czas kadr policzony dla poprzedniego
kształtu — i `slice` przycinał mapę. Dla człowieka to mgnienie; badanie klika szybciej
i potknęło się o to od razu. Zmianę, którą wywołujemy sami, `wybierz()` i `zamknij()`
przeliczają **natychmiast**; obserwator zostaje jako siatka bezpieczeństwa na wszystko,
czego sami nie wywołujemy.

### 28.6 Kontrola — punkt 31 i rozszerzone badanie

**Punkt 31 kontroli G-6** (`assemble.py`) sprawdza obecność dziesięciu barier w kodzie
i dwóch reguł CSS. Wyjątkowo bada **obecność**, a nie skutek, i powód jest zapisany przy
samym punkcie: usunięcie którejkolwiek z tych linii przy późniejszej edycji niczego by nie
zepsuło widocznie. Mapa działałaby normalnie na każdym biurku i psuła się wyłącznie tam,
gdzie plansza bywa mierzona bez wymiarów. Dokładnie tak ta wada powstała za pierwszym razem.
Punkt sprawdzono wstecz — usunięcie każdej z dwunastu pozycji jest wykrywane.

**`test_mapy.py`** bada skutek. Dopisane:

| Badanie | Co sprawdza |
|---|---|
| trzy warianty zerowego pomiaru | `display:none`, `width:0`, `height:0` na `.cog-scena`; po powrocie `viewBox` ma dać się odczytać jako cztery liczby **i** mapa ma reagować na przesunięcie |
| gest przy zerowym pomiarze | `wheel` w chwili, gdy plansza nie ma wymiarów (rozdz. 21.2) |
| punkt 5 planu testów | przy otwartej karcie proporcja kadru idzie za proporcją planszy, a skala zostaje bez zmian |
| punkt 6 planu testów | po zamknięciu karty kadr wraca dokładnie tam, gdzie był |

**Badanie sprawdzone wstecz** na kopii sprzed poprawki — oblewa, i to dokładnie tam,
gdzie powinno:

```
BŁĘDY:
  - U-21 (0x0): kadr nie do odczytania po powrocie: 'NaN NaN NaN NaN'
  - U-21 (0 x wysokość): kadr niezdrowy już przed badaniem: 'NaN NaN NaN NaN'
  - U-21 (szerokość x 0): kadr niezdrowy już przed badaniem: 'NaN NaN NaN NaN'
  - U-21 (gest przy zerowym pomiarze): kadr uszkodzony: 'NaN NaN NaN NaN'
  - po otwarciu karty proporcja kadru 1.894 wobec planszy 1.273
  - po otwarciu karty skala 2.1744 wobec 1.4609 jedn./px
  - błędy konsoli: Error: <svg> attribute viewBox: Expected number, "NaN NaN NaN NaN".
```

Ostatni wiersz zasługuje na osobne zdanie. To jest **dokładnie ten komunikat**, który
rozdz. 10 podaje w Teście 7 jako „twardy dowód” możliwy do zdobycia wyłącznie przez
podłączenie tabletu kablem do komputera. Okazało się, że da się go wywołać w repozytorium,
bez urządzenia — bo do jego wywołania wystarczy odtworzyć przyczynę, a nie warunki tabletu.
Diagnoza z rozdz. 6 jest tym samym potwierdzona obserwacją, a nie już tylko wnioskowaniem.

Przy okazji wyszła rzecz osobna: po P3 pomiar celów dotykowych zaczął mierzyć przybliżenie
przeniesione z poprzedniego kroku badania — 93,1 px przy 1024 px zamiast 44,0 px. Kryterium
nadal by przechodziło, tylko przestałoby badać to, o czym mówi G-D23. Dopisane `Home` przed
pomiarem, zgodnie z konwencją, którą badanie stosuje już w dwóch innych miejscach.

### 28.7 Wynik przebiegu kontrolnego

```
Gilead.html · 1.01 MB (ilustracje 0.89 MB, znaczniki i kod 113 KB)
pozycji: 15 (8 światów + 7 obszarów) · hotspotów: 20
pola: poziom 1 = 111 · poziom 2 = 30 · poziom 3 (utajnione) = 39
kontrola G-6 i G-12: OK
```

`test_mapy.py` (Chromium z `/opt/pw-browsers`): **BŁĘDY: brak**, **0 wpisów konsoli**.
Wszystkie badania sprzed naprawy przechodzą bez regresji: 15 pozycji osiągalnych, 6 na 6
podpisów struktur podświetla właściwy wiersz, 14 kart otwiera się od góry przy 1440 px
i 390 px, kolejność `tab` zgodna z rejestrową, napisy ramy w kadrze przy czterech
rozdzielczościach, najmniejszy cel dotykowy **44,0 px** przy 1024 px i przy 390 px.

Plik obejrzany na zrzutach: przy 1440 px rama Wyrwy kompletna z czterech stron i wszystkie
15 pozycji widoczne, w tym Vulkaris i Trollius; przy 1440 px z otwartą kartą mapa **nie jest
przeskalowana** — znaczniki mają tę samą wielkość co przy karcie zamkniętej, zmienia się
wyłącznie wycinek; przy 390 px widok domyślny przybliżony na Światy Centralne zgodnie z G-D23.

Zmiany objęły wyłącznie wielkość kodu: **1,00 → 1,01 MB**, znaczniki i kod **104 → 113 KB**.
Liczba pozycji, hotspotów i pól bez zmian.

### 28.8 Nowe wydanie — suma kontrolna do przeniesienia

```
SHA-256  4e5fe8f9c207f5d71570eeef49f324a277915cffef09608c860bd33c3c701df1
rozmiar  1054214 B
plik     Warhammer40k/Gilead/Gilead.html (repozytorium Scenariusze, po naprawie)
```

Zgodnie z rozdz. 27.7 pkt 4: po skopiowaniu wydania do modułu `Main` suma
`sha256sum Main/Gilead.html` ma dać **tę samą wartość**. Jeżeli na tablecie objaw nie
zniknie, a suma się zgadza, to znaczy, że na urządzeniu siedzi jeszcze stary plik
w pamięci podręcznej HTTP — rozdz. 27.7 pkt 2 podaje, jak ją wyczyścić, i **to trzeba
zrobić przed uznaniem naprawy za nieudaną**.

### 28.9 Dokumentacja projektu — co zapisano

Zgodnie z rozdz. 23.3 planu:

| Miejsce | Wpis |
|---|---|
| `ProjektGileadHTML.md`, rozdz. 19 | **U-21** w rejestrze usterek, ze stanem „wykonane 2026-09-22” |
| `ProjektGileadHTML.md`, rozdz. 10 | **G-D63** — kadr zachowuje skalę i środek, skala zapisywana w trzech miejscach. **G-D64** — brak widocznego przycisku powrotu do widoku, wraz z uzasadnieniem, dlaczego P5 przestaje być poprawką „zalecaną” |
| `ProjektGileadHTML.md`, rozdz. 9 | **G-26** w changelogu |
| `ProjektGileadHTML.md`, nowy rozdz. 23 | **Etap VI — nawigacja mapy w oknie PWA (U-21)**: objaw, przyczyna, trzy drogi zepsucia kadru, zakres zmian, dwie rzeczy z badania, kontrola, zastrzeżenia |
| `ProjektGileadHTML.md`, tabela etapów | wiersz **VI — nawigacja mapy** |
| `Instrukcja.md`, rozdz. 4.2 | zaktualizowany blok „oczekiwany wynik” (1,01 MB, kod 113 KB) oraz uwaga o ścieżce do Chromium — wzorzec `chromium-*` z instrukcji nie zawsze się rozwija, działająca ścieżka to `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` |

### 28.10 Czego to wykonanie nie rozstrzyga

1. **Nie uruchomiono pliku na tablecie.** Badanie odtwarza **przyczynę** — zerowy pomiar
   planszy — a nie warunki urządzenia. Playwright nie zrobi okna PWA za ekranem powitalnym,
   gestów systemowych Androida ani dzielonego ekranu. **Testy 1–8 i 14–15 z rozdz. 14
   wykonuje użytkownik.** Do tego czasu naprawa jest udowodniona co do przyczyny
   i nieudowodniona co do objawu na sprzęcie.
2. **Nie rozstrzygnięto, czy `dblclick` powstaje z dwustuknięcia w oknie PWA**
   (rozdz. 21.4). Po naprawie ma to znaczenie mniejsze niż przed nią — stan nie do
   naprawienia przestał być osiągalny — ale dwuklik nadal jest jedynym gestem powrotu
   do widoku domyślnego i warto przy Teście 11 sprawdzić, czy działa.
3. **Nie zmieniono niczego poza repozytorium `Scenariusze`.** D5, D6 i D7 czekają
   po tamtej stronie; rozdz. 24 i 27 opisują ich zakres.
4. **Nie wiadomo, czy `overscroll-behavior` i `touch-action` na kontenerze cokolwiek
   zmieniają na tym konkretnym tablecie.** Obie reguły są zabezpieczeniem wziętym
   z rozdz. 11.2, a nie odpowiedzią na zmierzony objaw — w Chromium na biurku nie dało
   się pokazać różnicy, bo tam reguła na SVG i tak działa.

---

# ZAMKNIĘCIE z 22 września 2026 — wykonanie D5, D6 i D7 w repozytorium `WrathAndGlory`

## 29. Co zrobiono po stronie aplikacji

Decyzje użytkownika: **D5, D6 i D7 zgodnie z rekomendacją.** Dwie z nich są rekomendacjami
„nie zmieniać", więc realną pracą było wyłącznie D6.

### 29.1 Weryfikacja wydania — kopia zgadza się co do bajtu

Pierwsza czynność, zgodnie z rozdz. 28.8:

```
oczekiwane (rozdz. 28.8)  4e5fe8f9c207f5d71570eeef49f324a277915cffef09608c860bd33c3c701df1
Main/Gilead.html          4e5fe8f9c207f5d71570eeef49f324a277915cffef09608c860bd33c3c701df1
rozmiar                   1 054 214 B — zgodny
```

**Wklejona kopia jest wydaniem po naprawie, bajt w bajt.** Przy okazji potwierdzone
w kodzie, że wszystkie sześć poprawek rzeczywiście w nim siedzi: `wymiary()` (`:668`),
`poprawny()` i `awaria()` (`:675`, `:679`), `zapamietajSkale()` (`:703`), `przelicz()`
(`:749`), `zerujGest()` (`:860`), `lostpointercapture` (`:937`), `domierz()` z podwójnym
`requestAnimationFrame` (`:1001`), `visibilitychange` (`:1013`), `ResizeObserver` (`:1031`),
`overscroll-behavior:none` na `html,body` (`:21`) i `touch-action:none` na `.cog-plansza`
(`:40`). Bariera w `zastosuj()` sprawdza dodatniość `w` i `h`, nie samą skończoność —
czyli zamyka także przypadek `1280 × 0` z rozdz. 21.1.

Sprawdzona też obsługa klawiatury, bo dokumentacja użytkownika miała ją opisać: `Home`
wyprowadzony przed sprawdzenie pomiaru i poza łańcuch `else if`, strzałki przesuwają,
`+` i `-` przybliżają, `Escape` zamyka kartę.

### 29.2 D5 — `target="_blank"` zostaje

**Bez zmian w kodzie.** Warunek rekomendacji z rozdz. 13 („zostawić po wdrożeniu P1–P4")
jest spełniony: P1–P6 są w wydaniu, więc przyczyna została zamknięta, a nie objaw.
Przesłanka potwierdzona w rozdz. 27.1 — rejestr mieści się w zasięgu manifestu i otwiera
się w oknie aplikacji.

`Main/index.html:228` zostaje w dotychczasowym brzmieniu. Opis w
`Main/docs/Documentation.md` („`Gilead.html` otwierany w nowej karcie") oraz wiersz
rozwiązywania problemów w `README.md` były i pozostają zgodne ze stanem faktycznym —
nie wymagały korekty.

### 29.3 D6 — dokumentacja modułu zaktualizowana

Wariant (a) z rozdz. 13, w zakresie rozpoznanym w rozdz. 27.3. Zmienione dwa pliki,
każdy w **obu wersjach językowych** — `AGENTS.md` rozdz. 5 wymaga pełnej wersji polskiej
i pełnej angielskiej, bez mieszania sekcja po sekcji.

**`Main/docs/Documentation.md`**

| Miejsce | Zmiana |
|---|---|
| tabela struktury plików (PL i EN) | wiersz `Main/Gilead.html` oznaczony jako **kopia wydania**, z odesłaniem do nowej sekcji |
| **nowa sekcja** „Pochodzenie pliku `Main/Gilead.html`" / „Where `Main/Gilead.html` comes from" | repozytorium źródłowe, katalog projektu, generator i plik wynikowy; zasada „nie edytować tutaj" wraz z uzasadnieniem, że poprawka znika przy następnym wydaniu; obowiązek zgłaszania usterek do projektu rejestru; sposób aktualizacji i weryfikacji sumą kontrolną |
| procedura odtworzenia modułu (PL i EN) | dopisany krok 13: rejestr **wstawia się kopiując bieżące wydanie**, nie odtwarza ręcznie. Dotychczasowy krok 13 („sprawdź tryb standardowy i admin") przesunięty na 14 |

Krok w procedurze odtworzenia był najpoważniejszą luką z rozdz. 27.3: `AGENTS.md` rozdz. 3
wymaga, żeby `Documentation.md` pozwalał odtworzyć moduł 1:1, a dotychczasowa procedura
kazała dodać link do `Gilead.html`, nie mówiąc, skąd ten plik wziąć.

**`Main/docs/README.md`**

Dopisana sekcja „Jak obsługiwać mapę rejestru" / „How to use the registry map" —
tabela: przesuwanie, przybliżanie, otwieranie i zamykanie kart, `INDEKS`, powrót do widoku
początkowego, obsługa klawiaturą. Plus dwa zdania o tym, że złoty narożnik znaczy
„można kliknąć", a czerwień niesie ostrzeżenie, nie brak klikalności.

Powód, dla którego to dołożono: `AGENTS.md` rozdz. 2 wymaga, żeby `README.md` wyjaśniał
każdą funkcję i każdą ważną mechanikę dostępną użytkownikowi. Obsługa mapy nie była opisana
nigdzie — a przy decyzji D3 (b) **dwuklik jest jedynym sposobem powrotu do widoku
domyślnego** i nie ma widocznego przycisku, który by o nim przypominał. Rozdz. 11.4
wskazywała to jako brak; skoro przycisku nie będzie, instrukcja jest na to jedyną
odpowiedzią. Sformułowania sprawdzone wobec kodu wydania, nie wobec pamięci.

**Dwie decyzje redakcyjne warte zapisania:**

1. **Suma kontrolna wydania nie została wpisana do dokumentacji.** Rotowałaby przy każdym
   wydaniu rejestru i po pierwszym przeoczeniu opisywałaby nieprawdę, co łamie `AGENTS.md`
   rozdz. 15. W dokumentacji jest **procedura** porównania sum między repozytoriami;
   konkretne wartości zostają w tej analizie (rozdz. 27.2, 28.2, 28.8, 29.1).
2. **Dokumentacja nie powtarza wewnętrznej budowy rejestru** — kadrowania, obsługi gestów
   ani mechaniki kart — tylko odsyła do dokumentacji projektu w repozytorium `Scenariusze`.
   Powtórzenie tego opisu tutaj oznaczałoby dwa opisy jednego pliku, rozjeżdżające się przy
   pierwszym wydaniu. Jest to świadome ograniczenie zakresu `Documentation.md`, nie
   przeoczenie.

Zgodnie z `AGENTS.md` rozdz. 11 żaden z dopisanych fragmentów nie odsyła do folderu
`Analizy` — podają sam fakt i adres repozytorium źródłowego.

### 29.4 D7 — `DetaleLayout.md` bez zmian

Wariant (a) z rozdz. 27.5. `touch-action` i `overscroll-behavior` sterują obsługą gestów,
a nie wyglądem — nie zmieniają ani jednego piksela, więc nie podpadają pod `AGENTS.md`
rozdz. 8. Dodatkowo `DetaleLayout.md` opisywałby wtedy wnętrze pliku, którego to
repozytorium nie jest właścicielem, co jest dokładnie tym rozjeżdżaniem się opisu ze
źródłem, przed którym ostrzega rozdz. 24.1.

`DetaleLayout.md` nadal opisuje z całego wątku Gilead wyłącznie przyciski CTA na stronie
głównej (`:164`, `:175`, `:182`) — czyli elementy `Main/index.html`, które są własnością
tego repozytorium. To jest stan zamierzony.

### 29.5 Co zostaje po stronie użytkownika

1. **Testy 1–8 i 14–15 z rozdz. 14, na tablecie, w aplikacji PWA.** Do tego czasu naprawa
   jest udowodniona co do przyczyny (rozdz. 28.6 — komunikat `viewBox: Expected number`
   odtworzony w przeglądarce) i **nieudowodniona co do objawu na sprzęcie**.
2. **Gdyby objaw nie zniknął mimo zgodnej sumy kontrolnej** — to nie znaczy, że naprawa
   zawiodła. Najpierw wyczyścić pamięć podręczną HTTP: rozdz. 27.7 pkt 2. Aplikacji
   **nie trzeba przeinstalowywać** — `Main/index.html` wyrejestrowuje Service Workery,
   więc nie ma pamięci offline, która trzymałaby stary rejestr.
3. **Najszybsze sprawdzenie, że wczytał się nowy plik** — Test 2 z rozdz. 10:
   rama Szczeliny kompletna z czterech stron, Vulkaris i Trollius widoczne.
4. **Test 11 (dwuklik)** wart osobnej uwagi mimo naprawy — rozdz. 28.10 pkt 2. Po P1–P6
   nie jest już ratunkiem, ale pozostaje jedynym gestem powrotu do widoku domyślnego,
   a `README.md` opisuje go teraz użytkownikowi jako obowiązujący sposób.

### 29.6 Czego nie zrobiono po tej stronie

1. **Nie uruchomiono niczego na tablecie ani w przeglądarce.** Zgodność wydania sprawdzona
   sumą kontrolną i obecność poprawek — odczytem kodu. Ograniczenie z rozdz. 16 pkt 1,
   25 pkt 1 i 28.10 pkt 1 zostaje w mocy.
2. **Nie zmieniono `Main/Gilead.html`** — zgodnie z rozdz. 24.1 plik jest kopią wydania
   i nie podlega edycji w tym repozytorium. Jedyną operacją na nim było policzenie sumy
   kontrolnej i odczyt kodu.
3. **Nie zmieniono `Main/index.html`** — D5 to rekomendacja „zostawić".
4. **Nie zmieniono `DetaleLayout.md`** — D7 to rekomendacja „nie dopisywać".
5. **Nie zweryfikowano zastrzeżenia z rozdz. 28.10 pkt 4** — czy `touch-action` na
   kontenerze i `overscroll-behavior` cokolwiek zmieniają na tym tablecie. Bez urządzenia
   nie da się tego rozstrzygnąć po żadnej ze stron.

### 29.7 Stan decyzji — zamknięcie

| # | Decyzja | Stan |
|---|---|---|
| **D1–D4** | zakres naprawy, zachowanie widoku, przycisk powrotu, karta na tablecie | **zamknięte** — wykonane w `Scenariusze` (rozdz. 28) |
| **D5** | `target="_blank"` przy przycisku `Gilead` | **zamknięte** — zostawione bez zmian (29.2) |
| **D6** | aktualizacja `Main/docs/` | **zamknięte** — wykonane (29.3) |
| **D7** | `DetaleLayout.md` | **zamknięte** — bez zmian (29.4) |
| **P8** | metadane PWA rejestru | **zamknięte** — nie robić nic (rozdz. 27.4) |
| **P9** | flaga `ciagniete` | **otwarte** — drobiazg poza zakresem D1 (b), zostaje w rejestrze usterek projektu rejestru |

Jedyne, co pozostaje otwarte poza P9, to **potwierdzenie objawu na tablecie** (29.5 pkt 1).

---

# 30. WSZYSTKO, CO MASZ SPRAWDZIĆ — W JEDNYM MIEJSCU

Ten rozdział jest samowystarczalny. **Nie musisz wracać do reszty dokumentu** — wszystko,
co trzeba zrobić, jest opisane tutaj od początku do końca, razem z tym, co ma się stać
i co zrobić, jeśli się nie stanie.

Jeżeli masz mało czasu — zrób sam **rozdz. 30.2**. To pięć minut i rozstrzyga najważniejsze.

> **Odsyłacz dopisany 27 września 2026.** Ta lista została wykonana — wyniki są
> w **rozdz. 31**, a przyczyna usterki, którą wykazała, w rozdz. 32. **Nie powtarzaj
> jej.** Po kolejnej poprawce obowiązuje krótsza lista z **rozdz. 36**.

> **Uwaga o starszych rozdziałach.** Testy z rozdz. 10 („Co możesz sprawdzić") były
> pisane po to, żeby **rozpoznać usterkę**, gdy jeszcze nie było wiadomo, co się dzieje.
> Usterka jest rozpoznana i naprawiona, więc **tamtych testów już nie wykonuj** — to,
> co z nich nadal ma sens, jest przeniesione niżej.

---

## 30.1 Zanim zaczniesz — jedna rzecz do upewnienia się

Na tablecie może jeszcze siedzieć **stary plik mapy** z pamięci podręcznej. Wtedy testy
pokażą starą usterkę, choć plik został naprawiony — i wyjdzie fałszywy wniosek, że naprawa
nie zadziałała.

**Sprawdzenie, że wczytał się nowy plik (15 sekund).** Zrób je na **tablecie trzymanym
poziomo**, **zaraz po otwarciu mapy** — zanim cokolwiek przesuniesz albo przybliżysz.

Najprostszy wskaźnik jest jeden:

> **Czy u góry mapy widzisz zakreskowaną belkę z napisem „CICARIX MALEDICTUM”?**
>
> - **Widzisz ją i da się przeczytać** → ❌ to **stary plik** albo stara usterka.
>   Przejdź do rozdz. 30.5.
> - **Nie widzisz jej wcale** → ✅ dobrze. Tak właśnie wygląda poprawnie policzony widok.

Brzmi odwrotnie, niż się wydaje, więc warto wiedzieć dlaczego: napis leży **nad** górną
krawędzią prawidłowego kadru i przy poprawnym widoku po prostu się w nim nie mieści.
Widać go dopiero wtedy, gdy mapa rysuje się „jak leci” — czyli w stanie uszkodzonym.

Dwa potwierdzenia dla pewności:

| Sprawdź | Poprawnie | Uszkodzone |
|---|---|---|
| Czy widać **VULKARIS** (lewy dół) i **TROLLIUS** (prawy dół)? | obie pozycje widoczne | obu brak |
| Czy przy **lewej** krawędzi biegnie pionowy zakreskowany pas? | biegnie | nie ma go |

Nie sugeruj się prawą krawędzią — przy szerokości Twojego tabletu prawy pas ramy wypada
tuż poza kadrem także przy poprawnym widoku. Na telefonie w pionie mapa otwiera się celowo
przybliżona na Światy Centralne i żaden z tych trzech wskaźników tam nie obowiązuje.

> **Sprostowanie dopisane 27 września 2026.** Kryterium „nie widzisz jej wcale” było
> za ostre. W oknie aplikacji na tym tablecie obszar mapy jest wyższy niż w karcie Chrome,
> więc przy **poprawnym** widoku u góry widać dolny skrawek belki z uciętymi do połowy
> literami — zrzut z 27 września pokazuje dokładnie to i zgadza się z poprawnym kadrem
> co do piksela (rozdz. 31.4). Rozstrzygają dwa pozostałe wskaźniki z tabeli: pionowy
> pas przy lewej krawędzi oraz widoczne VULKARIS i TROLLIUS. Uszkodzony widok pokazywał
> belkę **całą**, z napisem czytelnym w całości.

---

## 30.2 Szybki przebieg — 5 minut, najważniejsze

Na **tablecie**, w **aplikacji PWA**, trzymanym **poziomo**.

| # | Co zrobić | Co ma się stać |
|---|---|---|
| **A** | Zamknij aplikację całkowicie (usuń z listy ostatnich aplikacji), otwórz od nowa, wejdź w mapę i **od razu** przeciągnij palcem | Mapa się przesuwa |
| **B** | Zsuń i rozsuń dwa palce | Mapa oddala się i przybliża płynnie, wokół punktu między palcami |
| **C** | Naciśnij `INDEKS` (prawy górny róg) i wybierz **VULKARIS** | Mapa dojeżdża do Vulkarisa i otwiera jego opis |
| **D** | Obróć tablet na pion i z powrotem na poziom, potem przeciągnij palcem | Mapa nadal się przesuwa, obraz sensowny w obu orientacjach |
| **E** | Dotknij planety, żeby otworzyć opis, potem zamknij go krzyżykiem | Mapa zwęża się i rozszerza **bez skoku powiększenia**; po zamknięciu wraca dokładnie tam, gdzie była |

**Wszystkie pięć wyszło?** Naprawa działa na Twoim sprzęcie. Reszta (30.3) to dokładka
na spokojnie.

**Którykolwiek nie wyszedł?** Nie wyciągaj jeszcze wniosków — przejdź do **rozdz. 30.5**.

---

## 30.3 Pełna lista — 15 testów

Kolumna „kto" mówi, czy coś zostało już sprawdzone maszynowo po stronie repozytorium,
czy może to sprawdzić wyłącznie człowiek z tabletem w ręku.

| # | Co zrobić | Co ma się stać | Kto |
|---|---|---|---|
| 1 | Zimny start aplikacji, wejście w mapę, od razu przesunięcie palcem | Mapa się przesuwa | **tylko Ty** |
| 2 | Szczypanie dwoma palcami | Mapa przybliża się i oddala płynnie, wokół punktu między palcami | **tylko Ty** |
| 3 | Popatrz na mapę zaraz po otwarciu | Napisu „CICARIX MALEDICTUM” **nie widać**; widać Vulkaris i Trollius oraz pionowy zakreskowany pas przy lewej krawędzi (szczegóły w 30.1) | sprawdzone maszynowo, potwierdź |
| 4 | `INDEKS` → VULKARIS | Mapa dojeżdża do Vulkarisa, opis się otwiera | sprawdzone maszynowo, potwierdź |
| 5 | Otwórz opis planety, tablet poziomo | Mapa zostaje ściśnięta i **poprawnie przeskalowana**, bez przycięcia ramy | sprawdzone maszynowo, potwierdź |
| 6 | Zamknij opis | Mapa wraca do poprzedniego kadru, **bez skoku** | sprawdzone maszynowo, potwierdź |
| 7 | Obrót pion ↔ poziom, potem przesunięcie palcem | Mapa nadal się przesuwa, kadr sensowny w obu orientacjach | **tylko Ty** |
| 8 | Dzielony ekran: zmniejsz okno aplikacji do połowy i z powrotem | Mapa nadal działa | **tylko Ty** |
| 9 | Przełącz się na inną aplikację **w trakcie trzymania palca na mapie** i wróć | Mapa nadal działa | **tylko Ty** |
| 10 | Przeciągnij palcem od krawędzi ekranu (gest cofania), wróć do mapy | Mapa nadal się przesuwa | **tylko Ty** |
| 11 | Stuknij **dwa razy** w puste miejsce mapy | Powrót do widoku początkowego | **tylko Ty** |
| 12 | Dotknij planety | Opis się otwiera | sprawdzone maszynowo, potwierdź |
| 13 | Przeciągnij mapę i **zakończ ruch na planecie** | Opis **nie** otwiera się — przeciąganie to nie dotknięcie | sprawdzone maszynowo, potwierdź |
| 14 | Przejdź testy 1–13 **na telefonie** w PWA | Wszystko jak wcześniej, nic się nie zepsuło | **tylko Ty** |
| 15 | Przejdź testy 1–13 **w Chrome** na tablecie i na komputerze | Wszystko jak wcześniej, nic się nie zepsuło | **tylko Ty** |

**Testy 8, 9, 10 i 11 są najważniejsze**, bo dotyczą rzeczy, których żadna maszyna nie
odtworzy: gestów systemowych Androida, dzielonego ekranu i dwustuknięcia w oknie aplikacji.
Testy 9 i 10 sprawdzają zabezpieczenie przed „zablokowanymi palcami" — usterką, która daje
**ten sam objaw** co pierwotna (mapa stoi, opisy się otwierają), ale z zupełnie innej
przyczyny. Jeśli którykolwiek z nich zawiedzie, zapisz dokładnie, co robiłeś.

---

## 30.4 Jedna rzecz, o której warto wiedzieć przy teście 11

Powrót do widoku początkowego robi się **dwustuknięciem w puste miejsce mapy** —
nie ma na to przycisku, bo sam zdecydowałeś, żeby nie zaśmiecać mapy (decyzja D3).

Dwa zastrzeżenia:

- stukaj w **puste** miejsce, nie w planetę. Dwuklik w planetę otworzy i zamknie jej opis;
- nie jest w 100 % pewne, czy Android w oknie aplikacji wysyła to zdarzenie tak samo jak
  przeglądarka. Dlatego test 11 warto wykonać mimo naprawy. Jeśli dwuklik **nie** działa
  na tablecie, powiedz — to argument, żeby wrócić do pomysłu z widocznym przyciskiem.

Na klawiaturze ten sam skutek daje klawisz `Home`.

---

## 30.5 Coś nie działa — zanim uznasz naprawę za nieudaną

**Kolejność jest ważna.** Najczęstsza przyczyna „nie zadziałało" to stary plik w pamięci
podręcznej, a nie wada naprawy.

**Krok 1 — wyczyść pamięć podręczną.**
Android: `Ustawienia` → `Aplikacje` → **Kozi Przybornik** → `Pamięć` → `Wyczyść dane`.
Potem otwórz aplikację od nowa.

**Aplikacji nie trzeba przeinstalowywać.** Strona główna sama usuwa stare mechanizmy
działania offline, więc nie ma tam żadnej ukrytej kopii, która trzymałaby starą mapę.

**Krok 2 — powtórz sprawdzenie z rozdz. 30.1** (napis „CICARIX MALEDICTUM” u góry mapy).

**Krok 3 — jeśli napis nadal widać:** na tablet nie dotarł nowy plik. To problem
z wgraniem albo z serwerem, nie z naprawą.

**Krok 4 — jeśli rama jest kompletna, a mapa mimo to stoi:** to nowa informacja i warto
ją zebrać. Sprawdź jedną rzecz, która rozróżnia dwie możliwe przyczyny:

> **Czy opis planety zamyka się dotknięciem pustego miejsca mapy?**
>
> - **Zamyka się** → kadr mapy jest zdrowy, problem leży gdzie indziej.
> - **Nie zamyka się** (trzeba użyć krzyżyka albo `Escape`) → to objaw „zablokowanych
>   palców": w pamięci mapy został ślad po palcu, który nigdy nie został zwolniony.

Ta jedna odpowiedź jest najbardziej wartościową informacją, jaką możesz przekazać.

---

## 30.6 Co mi odesłać

Niezależnie od wyniku — krótko, punktami:

1. **Które testy z 30.3 przeszły, a które nie** (wystarczą numery).
2. Jeżeli coś nie przeszło: **co dokładnie robiłeś** i **czy przed tym obracałeś tablet,
   używałeś dzielonego ekranu albo przełączałeś się na inną aplikację**.
3. Odpowiedź na pytanie z **rozdz. 30.5, krok 4** — czy opis zamyka się dotknięciem tła.
4. Czy **dwuklik** (test 11) działa na tablecie.
5. Jeżeli wykonałeś czyszczenie pamięci podręcznej — czy coś to zmieniło.

Jeżeli masz pod ręką komputer i chcesz dać twardy dowód, podłącz tablet kablem, włącz
`Debugowanie USB`, wejdź w Chrome na komputerze na `chrome://inspect`, znajdź stronę
Gilead, kliknij `inspect` i zajrzyj w zakładkę `Console`. **Nie jest to konieczne** —
punkty 1–5 wystarczą. Gdybyś to jednak zrobił: brak komunikatów w konsoli **nie** znaczy,
że wszystko gra — objaw „zablokowanych palców" nie zostawia w konsoli żadnego śladu.

---

## 30.7 Czego ta naprawa nie obejmuje

Żeby nie było niespodzianek:

1. **Nikt nie uruchomił mapy na Twoim tablecie.** Przyczyna została odtworzona i naprawiona
   w warunkach laboratoryjnych, z potwierdzeniem w przeglądarce. **Objaw na Twoim sprzęcie
   pozostaje niepotwierdzony, dopóki nie wykonasz testów z 30.2.** To jedyna rzecz, której
   nie da się zrobić bez Ciebie.
2. **Dwa zabezpieczenia dołożono „na wszelki wypadek"** — blokada gestów przewijania na
   kontenerze mapy i odcięcie „pociągnij, żeby odświeżyć". Nie wiadomo, czy na Twoim
   tablecie cokolwiek zmieniają; nie szkodzą, a zamykają jedną z możliwych dróg usterki.
3. **Jeden drobiazg został świadomie nienaprawiony** — sposób kasowania znacznika
   przeciągania. W najgorszym razie zakończenie przeciągnięcia mogłoby zamknąć otwarty opis.
   Jeśli to zauważysz, powiedz — jest zapisane jako znana sprawa do rozważenia.

---

# WYNIKI TESTÓW z 27 września 2026 — nowa usterka przesuwania

## 31. Wyniki testów na tablecie — zapis

### 31.1 Polecenie użytkownika (zachowane w całości)

> Zapoznaj się z plikiem Analizy/gilead-nawigacja-mapy-pwa-tablet-2026-09-21.md
> Poniżej moje wyniki testów. Dopisz je do analizy.
>
> 30.1 Zanim zaczniesz — jedna rzecz do upewnienia się
> - Załączam screena jak wygląda aplikacja po uruchomieniu
>
> 30.2 Szybki przebieg — 5 minut, najważniejsze
> A - przesuwa, ale bardzo laguje. W stopniu, który uniemożliwia korzystanie z aplikacji. Na telefonie, przez przeglądarkę też jest taki problem. Mapa działa tylko na PC.
>
> B - samo przybliżanie i oddalanie działa. Jest nawet mniej więcej płynnie. Przy powiększaniu i oddalaniu pojawiają się czasem dziwne artefakty graficzne - jakaś pozioma kreska. Dodatkowo przy zoomie pojawia się czerwone wypełnienie pola "Wrakowisko". Załączam screena.
>
> C - działa bez zarzutów. Uruchamia się planeta Vulkaris i pojawia się jej opis. Przewijanie informacji na karcie jest płynne.
>
> D - sytuacja jak w B. Przybliżanie i oddalanie działa, ale przesuwanie jest niezwykle utrudnione.
>
> E - działa bez zarzutów.
>
> 30.3 Pełna lista — 15 testów
>
> 1 - Mapa przesuwa się odrobinę. O kilka pixeli. Trzeba ponownie palcem przesunąć. Patrz: 30.2 punkty A i D.
>
> 2 - Działa.
>
> 3 - załączam screena.
>
> 4 - działa
>
> 5 - działa
>
> 6 - O ile dobrze rozumiem to działa
>
> 7 - poza błędem z przsuwaniem jest ok.
>
> 8 - działa
>
> 9 - działa
>
> 10 - u mnie są inaczej ustawione gesty
>
> 11 - działa
>
> Dopisz moje odpowiedzi do analizy a następnie sprawdź czemu nie działa przewijanie. Dopisz swoje wnioski i do analizy.

W trakcie pracy użytkownik dopisał: „Kontynuuj pracę”.

Do polecenia dołączone były trzy zrzuty ekranu z tabletu — aplikacja PWA, układ poziomy,
1920 × 1200 px, nawigacja systemowa trzema przyciskami:

| zrzut | godzina | co pokazuje |
|---|---|---|
| 1 | 16:45 | mapa zaraz po uruchomieniu — do punktu 30.1 i testu 3 |
| 2 | 16:49 | mapa przybliżona na Gilead Primus i Wrakowisko — do testu B |
| 3 | 16:50 | mapa przybliżona na Przystanek i Wrakowisko — do testu B |

### 31.2 Zakres i metoda tej części

1. Zapis odpowiedzi użytkownika 1:1 i ocena każdej wobec kryterium z rozdz. 30.
2. Pomiar zrzutu 1 wobec kadru, który kod wydania liczy dla tego okna — tą samą metodą,
   co w rozdz. 5.
3. Porównanie obsługi gestów sprzed naprawy (`git show 5ff6c17:Main/Gilead.html`, SHA-256
   `dbddab91…` — zgodny z rozdz. 27.2) z obecnym wydaniem (`4e5fe8f9…` — zgodny
   z rozdz. 28.8).
4. **Odtworzenie w Chromium z emulacją dotyku.** Playwright 1.56 i Chromium 1194
   z `/opt/pw-browsers`; dotyk przez polecenie protokołu DevTools `Input.dispatchTouchEvent`.
   To jest prawdziwe wejście dotykowe przeglądarki, a nie zdarzenia wygenerowane skryptem
   strony — Chromium traktuje je jak palec, łącznie z niejawnym przechwyceniem (rozdz. 32.2).
   Trzy pliki: sprzed naprawy, obecne wydanie oraz obecne wydanie z poprawką N1 (kopia
   robocza poza repozytorium). Dwa okna: „tablet” 1280 × 720 przy gęstości 1,5 i „telefon”
   390 × 844 przy gęstości 3. Ruch palca krokami co 1 px, jak przy prawdziwym przeciąganiu.
5. Ocena artefaktów z testu B — pomiar położenia ich granic na zrzutach 2 i 3.

**Żaden plik aplikacji nie został zmieniony.** `Main/Gilead.html` jest kopią wydania
(rozdz. 19, 24.1), więc poprawka jest opisana do wykonania w repozytorium `Scenariusze`
(rozdz. 34). Jedyną zmianą w repozytorium jest ten dokument.

### 31.3 Odpowiedzi użytkownika

W poleceniu pada słowo „przewijanie”; z opisu testów wynika, że chodzi o **przesuwanie
mapy palcem** — i tak jest to rozumiane niżej.

**Szybki przebieg (rozdz. 30.2)**

| # | Co miało się stać | Odpowiedź (dosłownie) | Ocena |
|---|---|---|---|
| A | Po zimnym starcie mapa od razu się przesuwa | „przesuwa, ale bardzo laguje. W stopniu, który uniemożliwia korzystanie z aplikacji. Na telefonie, przez przeglądarkę też jest taki problem. Mapa działa tylko na PC.” | ❌ — nowa usterka, rozdz. 32 |
| B | Szczypanie płynnie oddala i przybliża | „samo przybliżanie i oddalanie działa. Jest nawet mniej więcej płynnie. Przy powiększaniu i oddalaniu pojawiają się czasem dziwne artefakty graficzne - jakaś pozioma kreska. Dodatkowo przy zoomie pojawia się czerwone wypełnienie pola "Wrakowisko". Załączam screena.” | ✅ z uwagą — artefakty, rozdz. 33 |
| C | `INDEKS` → VULKARIS: dojazd i opis | „działa bez zarzutów. Uruchamia się planeta Vulkaris i pojawia się jej opis. Przewijanie informacji na karcie jest płynne.” | ✅ |
| D | Obrót pion ↔ poziom, potem przesunięcie | „sytuacja jak w B. Przybliżanie i oddalanie działa, ale przesuwanie jest niezwykle utrudnione.” | ❌ w części „przesunięcie” — ta sama usterka co A; sam obrót niczego nie psuje |
| E | Otwarcie i zamknięcie opisu bez skoku powiększenia | „działa bez zarzutów.” | ✅ |

**Pełna lista (rozdz. 30.3)**

| # | Test | Odpowiedź (dosłownie) | Ocena |
|---|---|---|---|
| 1 | zimny start, od razu przesunięcie | „Mapa przesuwa się odrobinę. O kilka pixeli. Trzeba ponownie palcem przesunąć. Patrz: 30.2 punkty A i D.” | ❌ — rozdz. 32. To zdanie było kluczem do przyczyny: opisuje dokładnie ruch o drogę progu i koniec gestu |
| 2 | szczypanie | „Działa.” | ✅ |
| 3 | wygląd zaraz po otwarciu | „załączam screena.” | ✅ — kadr poprawny co do piksela, rozdz. 31.4 |
| 4 | `INDEKS` → VULKARIS | „działa” | ✅ |
| 5 | opis planety — mapa ściśnięta i przeskalowana | „działa” | ✅ |
| 6 | zamknięcie opisu — powrót bez skoku | „O ile dobrze rozumiem to działa” | ✅ |
| 7 | obrót, potem przesunięcie | „poza błędem z przsuwaniem jest ok.” | ✅ obrót / ❌ przesunięcie (rozdz. 32) |
| 8 | dzielony ekran | „działa” | ✅ |
| 9 | przełączenie aplikacji z palcem na mapie | „działa” | ✅ |
| 10 | gest cofania od krawędzi | „u mnie są inaczej ustawione gesty” | nie dotyczy — na zrzutach widać nawigację trzema przyciskami (☰ ○ ←), więc gestu od krawędzi na tym tablecie nie ma. Zastępnik: test 6 w rozdz. 36.2 |
| 11 | dwustuknięcie w puste miejsce | „działa” | ✅ — **rozstrzyga pytanie z rozdz. 21.4 i 28.10 pkt 2**: dwustuknięcie w oknie aplikacji daje `dblclick`, powrót do widoku początkowego działa |
| 12 | stuknięcie w planetę | bez osobnej odpowiedzi | ✅ — potwierdzony testem E |
| 13 | przeciągnięcie zakończone na planecie | bez odpowiedzi | do sprawdzenia po poprawce (test 4 w rozdz. 36.2) |
| 14 | wszystko na telefonie | bez osobnej odpowiedzi; z testu A: „Na telefonie, przez przeglądarkę też jest taki problem” | ❌ przesuwanie — ta sama usterka |
| 15 | wszystko w Chrome na tablecie i na komputerze | bez osobnej odpowiedzi; z testu A: „Mapa działa tylko na PC.” | ✅ komputer / ❌ przesuwanie na tablecie |

Pytanie z rozdz. 30.5 krok 4 (czy opis zamyka się dotknięciem tła) zostało bez odpowiedzi
i nie jest już potrzebne — przyczyna jest ustalona inną drogą (rozdz. 32).

### 31.4 Zrzut 1 — kadr po uruchomieniu zgadza się co do piksela

Obszar mapy na zrzucie zajmuje y = 160–1028 px przy pełnej szerokości 1920 px. Przy gęstości
1,5 (rozdz. 5) to 1280 × 578,7 jednostki. Dla takiego okna kod wydania liczy:

- pełny widok wymagałby kadru szerokiego na 1990,8 jednostki, a cel dotykowy 44 px pozwala
  najwyżej na 1280 / (44/68) = 1978,2 — kadr jest więc minimalnie **węższy niż cała mapa**
  i `widokDomyslny()` idzie gałęzią „za wąsko na całość”: środek na Światach Centralnych
  (570 ; 470);
- kadr: **`viewBox="-419.1 22.8 1978.2 894.3"`**.

| element | wyliczone z kadru (px zrzutu) | odczytane ze zrzutu 1 (px) |
|---|---|---|
| czarne tło przy lewej krawędzi (poza mapą) | 0 – 145 | 0 – 145 |
| lewy zakreskowany pas ramy | 145 – 189 | 145 – 190 |
| górna belka — widoczny tylko dolny skrawek | 160 – 182 | 160 – 183 |
| dolna belka | 967 – 1011 | 967 – 1011 |
| gwiazda | 824 ; 594 | 823 ; 594 |
| NETHREUS | 645 ; 603 | 645 ; 602 |
| CHARYBDION | 950 ; 336 | 949 ; 336 |
| GILEAD PRIMUS | 1154 ; 467 | 1154 ; 467 |
| VULKARIS | 509 ; 895 | 508 ; 895 |
| TROLLIUS | 1404 ; 844 | 1404 ; 844 |

Dziesięć pomiarów, błąd najwyżej 1 piksel. Wnioski:

1. **Na tablecie jest nowe wydanie i kadr startowy jest w oknie aplikacji policzony
   poprawnie.** Pierwotna usterka jest naprawiona na sprzęcie, nie tylko w badaniu.
   Stan uszkodzony wyglądałby zupełnie inaczej: rysunek 1:1 od lewego górnego rogu,
   bez lewego pasa, bez Vulkarisa i Trolliusa (rozdz. 5.2–5.3). Potwierdza to też test 1:
   przy kadrze „NaN” mapa nie drgnęłaby wcale, a teraz przesuwa się o kilka pikseli.
2. **Napis „CICARIX MALEDICTUM” przy poprawnym kadrze częściowo widać.** Napis stoi na
   wysokości 29 jednostek, kadr zaczyna się na 22,8 — widać dolne ok. 6 px liter.
   Kryterium z rozdz. 30.1 było za ostre; sprostowanie dopisane tam.
3. **Czarny pas przy lewej krawędzi nie jest błędem.** Kadr sięga 149 jednostek na lewo od
   ramy, bo jest wyśrodkowany na Światach Centralnych, a nie na całej mapie — tak działa
   reguła celu dotykowego (G-D23) przy tym oknie.

### 31.5 Bilans

| | Stan po testach z 27 września |
|---|---|
| pierwotna usterka — kadr „NaN” w oknie aplikacji | **usunięta**, potwierdzone na tablecie (31.4) |
| przybliżanie, karta planety, `INDEKS`, dzielony ekran, przełączanie aplikacji, obrót, dwustuknięcie | **działają** |
| **przesuwanie jednym palcem** | **nie działa na żadnym urządzeniu dotykowym** — nowa usterka wprowadzona naprawą, rozdz. 32 |
| artefakty przy przybliżaniu | kosmetyka, rozdz. 33 |

---

## 32. Dlaczego przesuwanie nie działa — przyczyna

### 32.1 W skrócie — bez języka technicznego

> Kiedy kładziesz palec na mapie, przeglądarka od razu „przypina” go do tego, co jest pod
> nim — do tła, orbity albo podpisu. Gdy palec przejedzie 4 piksele, mapa uznaje, że to
> przeciąganie, a nie stuknięcie, i **przejmuje palec na siebie** — żeby dalszy ruch
> trafiał do niej, nawet gdy palec zjedzie na planetę albo poza mapę. Przejęcie wygląda
> tak: tło „oddaje” palec, mapa go „bierze”.
>
> Naprawa z 22 września dołożyła zabezpieczenie: *„jeśli mapa straci palec, zakończ
> gest”* — na wypadek, gdyby Android zabrał gest dla siebie. Kłopot w tym, że to
> zabezpieczenie słyszy również **„oddanie palca” przez tło** i bierze je za utratę palca
> przez mapę. Gest kończy się dokładnie w chwili, w której miał się naprawdę zacząć.
> Mapa zdąży przesunąć się o te 4 piksele progu i staje. Żeby przesunąć dalej, trzeba
> podnieść palec i przeciągnąć od nowa — i znowu tylko kilka pikseli. To właśnie wygląda
> jak ogromne „lagowanie”.
>
> Myszka tego problemu nie ma, bo przeglądarka nie „przypina” kursora myszy do niczego —
> dlatego na komputerze wszystko działa. Szczypanie działa, bo przy dwóch palcach mapa
> niczego nie przejmuje. Telefon i przeglądarka są dotknięte tak samo jak aplikacja na
> tablecie, bo chodzi o dotyk, a nie o PWA.

**Problem leży w pliku mapy, a nie w tablecie, telefonie ani ustawieniach.** Naprawa jest
jednowierszowa i została już sprawdzona na kopii pliku (32.3).

### 32.2 Mechanizm techniczny

Składają się na niego trzy rzeczy. Dwie istniały przed naprawą, trzecia doszła w P5.

**1. Niejawne przechwycenie dotyku.** Specyfikacja Pointer Events każe przeglądarce przy
`pointerdown` palca zachować się tak, jakby wywołano `setPointerCapture()` na elemencie
trafionym pod palcem. W tej mapie to prawie zawsze element **wewnątrz** SVG: tło (`rect`),
orbita (`ellipse.cog-orbita`), siatka (`line`), pole trafienia (`rect.cog-traf`), podpis.
Mysz tego nie ma.

**2. Przejęcie po progu** (`Main/Gilead.html:905–907`, było już przed naprawą):

```js
ciagniete=true;
svg.classList.add('cog-ciagniemy');
if(svg.setPointerCapture){svg.setPointerCapture(ev.pointerId);przechwycony=ev.pointerId;}
```

Przy dotyku nie jest to nadanie przechwycenia, tylko jego **przeniesienie** z elementu pod
palcem na SVG. Przeglądarka realizuje je przy następnym zdarzeniu tego palca: wysyła
`lostpointercapture` do dotychczasowego właściciela, potem `gotpointercapture` do SVG.

**3. Nasłuch dopisany w P5** (`:935–937`):

```js
/* Przechwycenie odebrane przez przeglądarkę bywa jedynym, co dostaniemy:
   `pointerup` po geście systemowym Androida potrafi już nie przyjść. */
svg.addEventListener('lostpointercapture',koniec);
```

`lostpointercapture` **bąbelkuje**. Zdarzenie wysłane do tła wewnątrz SVG dochodzi do tego
nasłuchu, a `koniec()` nie odróżnia „SVG stracił palec” od „tło oddało palec SVG-owi”.
Filtr po `pointerId` w `koniec()` (`:918`) nie pomaga — to ten sam palec. `koniec()` usuwa
palec z rejestru, zeruje `ciagniemy` i zwalnia przechwycenie SVG. Każde następne
`pointermove` odpada na pierwszym wierszu obsługi (`:890`,
`if(!wskazniki[ev.pointerId]) return;`).

Kolejność zdarzeń zapisana w badaniu — dotyk, obecne wydanie, start na tle mapy:

```
pointerdown@rect → gotpointercapture@rect     niejawne przechwycenie dotyku
pointermove@rect                               próg przekroczony → svg.setPointerCapture();
                                               mapa przesuwa się o drogę progu — jedyny ruch
lostpointercapture@rect                        bąbelkuje do SVG → koniec() → rejestr pusty
gotpointercapture@svg
pointermove@svg                                ignorowane — palca nie ma w rejestrze
lostpointercapture@svg                         koniec() sam zwolnił przechwycenie
pointermove@rect, @circle.cog-traf, @text.cog-etykieta …   ignorowane
```

Ten sam gest na pliku sprzed naprawy — przeniesienie przebiega identycznie, tylko nikt go
nie słucha:

```
pointerdown@rect → gotpointercapture@rect → pointermove@rect → lostpointercapture@rect
→ gotpointercapture@svg → pointermove@svg ×19 → pointerup@svg
```

W żadnym z zapisów nie ma `pointercancel` — **przeglądarka niczego nie przejmuje, gest
kończy sam skrypt mapy.** Dlatego ta usterka nie ma związku z `touch-action`
ani `overscroll-behavior` (rozdz. 28.10 pkt 4).

**Dlaczego „kilka pikseli”.** Ruch zatrzymuje się po pierwszym zdarzeniu za progiem
`PROG=4` (`:850`) — czyli po 4 jednostkach CSS z niewielkim naddatkiem. Na tym tablecie to
ok. 6 pikseli fizycznych, na telefonie o gęstości 3 ok. 12. Dokładnie to opisuje test 1.

**Dlaczego szczypanie działa.** Gałąź dwóch palców (`:893`) kończy się przed kodem
przejęcia: `setPointerCapture()` nie jest wołane, więc nie ma przeniesienia ani
`lostpointercapture`. Jednym palcem zaraz po szczypaniu mapa nadal się nie przesuwa
(badanie: 4 %) — zgodnie z testem D.

**Dlaczego komputer działa.** Przy myszy nie ma niejawnego przechwycenia, więc
`setPointerCapture()` tylko nadaje przechwycenie: przychodzi `gotpointercapture@svg`,
bez żadnego `lostpointercapture` na elemencie podrzędnym.

**Dlaczego przed naprawą Chrome na tablecie działał.** Nasłuchu z `:937` nie było. Jest to
więc **regresja wprowadzona przez P5**, a nie usterka wcześniej ukryta.

**To nie jest kwestia wydajności.** Szczypanie wykonuje przy każdym ruchu palca tę samą
pracę co przesuwanie (nowy kadr i przerysowanie mapy), a nawet więcej rachunków — i jest
„mniej więcej płynne”. Wynik badania nie zależy od szybkości urządzenia: ruch kończy się
zawsze po jednym kroku za progiem.

### 32.3 Odtworzenie w przeglądarce — dowód

Przeciągnięcie palcem o 120 px w 120 krokach po 1 px, z sześciu różnych punktów startu.
Wynik: przesunięcie kadru jako odsetek drogi palca (100 % = mapa idzie za palcem).

| plik | tablet 1280 × 720, gęstość 1,5 | telefon 390 × 844, gęstość 3 | mysz, 1280 × 800 |
|---|---|---|---|
| sprzed naprawy (`dbddab91…`) | 100 % we wszystkich sześciu | 100 % we wszystkich sześciu | 100 % |
| **obecne wydanie** (`4e5fe8f9…`) | **3 % we wszystkich sześciu** | **3 % we wszystkich sześciu** | 100 % |
| obecne wydanie + poprawka N1 | 100 % we wszystkich sześciu | 100 % we wszystkich sześciu | 100 % |

Punkty startu trafiały w różne elementy — tło, orbitę, siatkę, pole trafienia planety.
Wynik od tego nie zależy, bo każdy z nich leży wewnątrz SVG.

Pozostałe sprawdzenia — okno „tablet”. W oknie „telefon” powtórzono szczypanie, przesuwanie
zaraz po szczypaniu, stuknięcie w planetę i przeciągnięcie zakończone na planecie; wyniki
są te same.

| sprawdzenie | sprzed naprawy | obecne wydanie | obecne + N1 |
|---|---|---|---|
| szczypanie | działa | działa | działa |
| jeden palec zaraz po szczypaniu | 100 % | **4 %** | 100 % |
| przesuwanie przy otwartym opisie planety | — | **3 %** | 100 %, opis zostaje otwarty |
| stuknięcie w planetę otwiera opis | tak | tak | tak |
| stuknięcie w tło zamyka opis | — | tak | tak |
| przeciągnięcie zakończone na planecie **nie** otwiera opisu | tak | tak | tak |
| gest przerwany `touchcancel`, potem nowy gest | 100 % | 4 % | 100 % |
| gest przerwany utratą fokusu okna (`blur`), potem nowy gest | **0 %** | 4 % | 100 % |
| gest przerwany zejściem strony w tło, potem nowy gest | **0 %** | 4 % | 100 % |
| SVG traci przechwycenie w trakcie gestu → gest ma się skończyć | ✘ trwa dalej | ✔ | ✔ |
| element pod palcem oddaje przechwycenie → gest ma **trwać** | ✔ | ✘ kończy się | ✔ |
| błędy w konsoli | 0 | 0 | 0 |

Co z tego wynika:

1. **Poprawka N1 przywraca przesuwanie w całości** i niczego nie psuje: szczypanie,
   stuknięcia, zamykanie opisu stuknięciem w tło i blokada „przeciągnięcie to nie
   stuknięcie” działają.
2. **Zabezpieczenia P5 zostają.** Wiersze `blur` i „strona w tle” pokazują przy okazji,
   po co P5 powstało: plik sprzed naprawy zostawiał w rejestrze „ducha” palca i następny
   gest jednym palcem szedł w gałąź szczypania (0 %). Z N1 — 100 %.
3. Dwa przedostatnie wiersze pokazują różnicę wprost: N1 odróżnia **utratę** przechwycenia
   przez SVG (koniec gestu — zabezpieczenie P5) od jego **przekazania** z elementu pod
   palcem (początek przeciągania).

Uwaga o metodzie: „utratę przechwycenia przez SVG” sprawdzono zdarzeniem wysłanym wprost do
SVG w trakcie gestu. Wcześniejsza próba — zwolnienie przechwycenia skryptem przy wciąż
trzymanym palcu — okazała się niemiarodajna (emulator nie wysyła wtedy żadnego zdarzenia
dla pierwszego palca, więc następny palec liczy się jako drugi) i nie jest brana pod uwagę.

### 32.4 Dlaczego badania z 22 września tego nie wykryły

Rozdz. 28.6–28.7: `test_mapy.py` przeszedł „bez błędów”, a obecne wydanie przy dotyku oblewa
za każdym razem. Przeciąganie w tamtym badaniu nie szło więc drogą dotyku zaczynającego się
na elemencie wewnątrz SVG. Najbardziej prawdopodobnie gesty były prowadzone myszą albo
zdarzeniami syntetycznymi — żadna z tych dróg nie ma niejawnego przechwycenia, więc
przeniesienie w ogóle nie zachodzi. **Pliku `test_mapy.py` nie widziałem;** to wniosek
z wyniku, nie odczyt.

Pomysł P5 był trafny — komentarz przy `:935` dobrze opisuje, po co nasłuch jest potrzebny.
Zabrakło tylko uwzględnienia, że zdarzenie bąbelkuje i że przy dotyku samo przejęcie palca
je wywołuje.

To jest dokładnie ryzyko, które rozdz. 28.10 pkt 1 nazywał wprost: „naprawa udowodniona co
do przyczyny i nieudowodniona co do objawu na sprzęcie”. Test na tablecie zrobił to, czego
badanie nie mogło. Wniosek na przyszłość jest w N3: badanie gestów musi mieć ścieżkę
dotykową.

---

## 33. Artefakty przy przybliżaniu (test B) — ocena

### 33.1 Czerwień Wrakowiska jest zamierzona — nierówne pasy nie są

Wrakowisko jest rysowane jako obszar ostrzegawczy: czerwona przerywana obwódka i bardzo
słabe czerwone wypełnienie (`.cog-wrak`, `Main/Gilead.html:60`:
`fill:rgba(255,95,95,.05)` przy `opacity:.5`, czyli ok. 2,5 % czerwieni). To wypełnienie
widać także bez przybliżenia — na zrzucie 1 Wrakowisko, Głębia i Cieśnina Andraste mają
ciemnobrązowy odcień. Czerwień niesie treść „zakaz wstępu / ostrzeżenie” (G-D15, G-D25)
i sama w sobie nie jest błędem.

Błędem jest to, co widać na zrzutach 2 i 3: **w obrębie jednego obszaru czerwień jest
mocniejsza w poziomym pasie** o prostych, poziomych krawędziach, niezwiązanych z kształtem
obszaru. Kontur obszaru przechodzi przez te krawędzie bez przesunięcia — geometria jest
ta sama, różni się tylko odcień wypełnienia.

### 33.2 Granice pasów leżą na siatce kafelków rysowania

| zrzut | jaśniejszy pas | granice pasa (px) |
|---|---|---|
| 2 | od górnej krawędzi mapy do y ≈ 345 | 345 |
| 3 | y ≈ 345 – 630 | 345 i 630 |

Granica 345 leży w tym samym miejscu na dwóch różnych zrzutach, przy innym przybliżeniu
i innym położeniu mapy — nie jest więc związana z treścią mapy, tylko z ekranem. Granice
są od siebie odległe o 285–286 px, a od górnej krawędzi strony (y ≈ 59, pod paskiem
systemowym) o 286 i 572 px.

To zgadza się z tym, jak Chrome na Androidzie rysuje stronę przy rasteryzacji na karcie
graficznej: warstwę dzieli na kafelki szerokości ekranu i wysokości ok. ¼ okna, liczone od
górnej krawędzi warstwy — tu okno ok. 1051 px daje kafelek 288 px, z czego 2 px to
zakładka, czyli krok 286 px. Wniosek: **artefakt powstaje przy rysowaniu kafelków przez
przeglądarkę** — sąsiednie kafelki oddają to samo, bardzo słabe półprzezroczyste
wypełnienie w różny sposób albo z różnych chwil. Siatka zaczyna się od góry strony, a nie
od góry mapy, więc mapa jest rysowana w warstwie całej strony i każda zmiana kadru każe
przerysować wszystkie kafelki. Przemijająca „pozioma kreska” to najpewniej ten sam
mechanizm w trakcie ruchu: przez ułamek sekundy sąsiednie kafelki pokazują różne klatki.

**Pewność: umiarkowana.** Zgodność liczb jest wyraźna, ale mechanizmu wewnątrz przeglądarki
nie da się podejrzeć bez urządzenia i narzędzi deweloperskich. Artefaktu nie próbowano
odtwarzać — Chromium na serwerze rysuje programowo, bez karty graficznej, więc wynik nie
miałby wartości dowodowej.

### 33.3 Co z tym zrobić

- To jest **kosmetyka**, niezależna od usterki przesuwania. Nie przeszkadza w korzystaniu
  z mapy i nie jest błędem w danych.
- **Najpierw naprawa przesuwania.** Po niej przesuwanie zacznie przerysowywać mapę tak samo
  często jak szczypanie, więc obraz artefaktu może się zmienić. Ocena ma sens dopiero po
  ponownym teście (rozdz. 36.3).
- Jeżeli po ponownym teście będzie przeszkadzał — opcja N4 (rozdz. 34): przerysowanie mapy
  najwyżej raz na klatkę obrazu zamiast przy każdym zdarzeniu palca. Zmniejsza liczbę
  przerysowań kafelków w trakcie gestu; czy usunie artefakt w całości, nie wiadomo.
- Mocniejsze środki — przesuwanie mapy transformacją CSS w trakcie gestu z ustawieniem kadru
  dopiero na końcu albo osobna warstwa kompozycji dla SVG — zmieniają sposób działania
  nawigacji lub zużycie pamięci. Przy objawie czysto kosmetycznym **nie rekomenduję**.

---

## 34. Co trzeba poprawić — zakres dla repozytorium `Scenariusze`

Miejsce: `Warhammer40k/Gilead/scripts/build/gilead/assemble.py`, stała `JS` (rozdz. 19.3,
28.3). **Nie w `Main/Gilead.html`** — tam poprawka zniknęłaby przy następnym wydaniu
(rozdz. 19, 24.1).

### N1 — nasłuch `lostpointercapture` tylko dla samego SVG *(konieczna)*

Obecnie (`Main/Gilead.html:935–937`):

```js
  /* Przechwycenie odebrane przez przeglądarkę bywa jedynym, co dostaniemy:
     `pointerup` po geście systemowym Androida potrafi już nie przyjść. */
  svg.addEventListener('lostpointercapture',koniec);
```

Proponowane — dokładnie ten wariant, który sprawdzono w badaniu z rozdz. 32.3:

```js
  /* Przechwycenie odebrane przez przeglądarkę bywa jedynym, co dostaniemy:
     `pointerup` po geście systemowym Androida potrafi już nie przyjść.
     Liczy się WYŁĄCZNIE utrata przechwycenia przez samo SVG. Zdarzenie
     bąbelkuje, a przy dotyku przeglądarka przechwytuje palec niejawnie na
     elemencie pod nim (tło, orbita, podpis); `setPointerCapture()` po progu
     przenosi go na SVG i wysyła tamtemu elementowi `lostpointercapture`.
     To jest przekazanie palca, nie koniec gestu — bez tego warunku
     przeciąganie palcem kończyło się na progu 4 px. */
  svg.addEventListener('lostpointercapture',function(ev){
    if(ev.target===svg) koniec(ev);
  });
```

**Co robi:** przepuszcza do `koniec()` tylko zdarzenie, którego celem jest samo SVG.
**Gdzie działa:** w obsłudze gestów, obok `pointerup` i `pointercancel` nasłuchiwanych na
`window`. **Dlaczego tak, a nie inaczej:**

- **Usunięcie nasłuchu** (powrót do stanu sprzed P5) też przywróciłoby przesuwanie, ale
  odebrałoby zabezpieczenie na przypadek, gdy Android zabiera gest bez `pointerup` —
  wiersz „SVG traci przechwycenie” w tabeli 32.3 znów by oblewał.
- **Przechwytywanie już przy `pointerdown`** usunęłoby przeniesienie, ale jest powód, dla
  którego tak nie jest — komentarz przy `:877–881`: przechwycenie przekierowuje `click`
  i stuknięcie w planetę przestałoby działać.
- Dodatkowy warunek `ev.pointerId===przechwycony` jest dopuszczalny, ale zbędny: `koniec()`
  i tak filtruje po rejestrze palców (`:918`).

### N2 — punkt 31 kontroli G-6 ma pilnować warunku *(konieczna)*

Punkt 31 sprawdza obecność barier, bo ich usunięcie nie psuje niczego, co widać na biurku
(rozdz. 28.6). Warunek z N1 jest przypadkiem tego samego rodzaju: jego **brak** psuje
wyłącznie urządzenia dotykowe, a na komputerze nie widać nic. Do listy punktu 31 należy
dopisać obecność warunku `ev.target===svg` w nasłuchu `lostpointercapture` i sprawdzić
wstecz, że usunięcie warunku jest wykrywane.

### N3 — badanie dotykowe w `test_mapy.py` *(konieczna)*

Bez niego ta sama klasa usterki wróci niezauważona. Wymagania oparte na badaniu
z rozdz. 32.3:

| # | Badanie | Kryterium |
|---|---|---|
| 1 | przeciągnięcie jednym palcem, 120 px w krokach po 1 px, z co najmniej trzech punktów startu trafiających w różne elementy SVG | przesunięcie kadru ≥ 95 % drogi palca |
| 2 | jak 1, zaraz po szczypaniu | jak 1 |
| 3 | jak 1, przy otwartym opisie planety | jak 1, a opis zostaje otwarty |
| 4 | szczypanie dwoma palcami | szerokość kadru maleje |
| 5 | stuknięcie w planetę | opis się otwiera |
| 6 | przeciągnięcie zakończone na planecie | opis się **nie** otwiera |
| 7 | w trakcie gestu `lostpointercapture` wysłane do SVG | gest się kończy — dalszy ruch palca nie przesuwa mapy |
| 8 | w trakcie gestu `lostpointercapture` wysłane do elementu wewnątrz SVG | gest trwa — dalszy ruch przesuwa mapę w 100 % |

Technika: kontekst przeglądarki z `has_touch=True`, sesja protokołu DevTools
(`context.new_cdp_session(page)`) i polecenie `Input.dispatchTouchEvent`
(`touchStart` / `touchMove` / `touchEnd`; przy szczypaniu dwa punkty). Na potrzeby punktów
1–6 **nie** `page.mouse` i **nie** `dispatchEvent(new PointerEvent(...))` — żadna z tych
dróg nie wywołuje niejawnego przechwycenia, czyli dokładnie tego, co zepsuło mapę.
Punkty 7–8 wymagają zdarzenia syntetycznego, bo przejęcia gestu przez Androida emulator
nie odtworzy.

Sprawdzenie wstecz: na obecnym wydaniu (`4e5fe8f9…`) punkty 1, 2, 3 i 8 mają oblać
(ok. 3–4 % drogi palca; gest kończy się po przekazaniu przechwycenia).

### N4 — przerysowanie najwyżej raz na klatkę *(opcjonalna, zależna od decyzji D8)*

`pointermove` zapisuje tylko położenie palców i zamawia jedno `requestAnimationFrame`;
dopiero w nim liczony jest kadr i wołane `zastosuj()`. Dziś kadr jest liczony i wpisywany
do SVG przy każdym zdarzeniu palca, a tych na nowszych ekranach bywa więcej niż klatek
obrazu. Zysk: mniej przerysowań w trakcie gestu — płynność i możliwe ograniczenie
artefaktów z rozdz. 33. Koszt: zmiana w miejscu, które właśnie okazało się delikatne, nowe
przypadki do badania (gest zakończony między zdarzeniem a klatką), aktualizacja punktu 31
kontroli. **Rekomendacja: nie robić razem z N1–N3** — rozdz. 35.

### Po stronie repozytorium `WrathAndGlory`

1. Po nowym wydaniu — skopiować plik do `Main/Gilead.html` i porównać sumę `sha256sum`
   z sumą podaną przez `Scenariusze` (rozdz. 27.7 pkt 4).
2. **Dokumentacja modułu `Main` nie wymaga zmian.** `Main/docs/README.md` (`:106`) opisuje
   przesuwanie palcem jako działające — tak ma być po poprawce; opis dotyczy zamierzonego
   działania, nie usterki. `Main/docs/Documentation.md` celowo nie powtarza wewnętrznej
   obsługi gestów rejestru (rozdz. 29.3, decyzja redakcyjna 2).
3. `DetaleLayout.md` bez zmian — N1–N3 nie zmieniają wyglądu.

---

## 35. Decyzja do podjęcia

N1–N3 są konieczne i nie wymagają decyzji — bez nich mapa na urządzeniach dotykowych jest
nie do używania. Otwarta zostaje jedna sprawa.

### D8 — artefakty przy przybliżaniu

- **(a) Poczekać na ponowny test po N1–N3** *(rekomendacja)*. Artefakt jest kosmetyczny,
  a po naprawie przesuwania jego obraz może się zmienić. Decyzję podjąć na podstawie tego,
  co zobaczysz w rozdz. 36.3.
- **(b) Dołożyć N4 od razu, w tym samym wydaniu co N1–N3.** Szybciej, ale jeśli coś pójdzie
  źle, trudniej będzie ustalić, która zmiana to spowodowała.
- **(c) Zostawić artefakt na stałe** — jeśli po ponownym teście okaże się rzadki i nie
  przeszkadza.

Prostym językiem: *czy dziwne pasy przy przybliżaniu poprawiamy od razu, razem
z przesuwaniem, czy najpierw naprawiamy przesuwanie i sprawdzamy, czy pasy nadal
przeszkadzają?* Rekomenduję to drugie.

---

## 36. CO SPRAWDZIĆ PO POPRAWCE — LISTA DLA CIEBIE

Ten rozdział jest samowystarczalny. Wykonaj go **dopiero po nowym wydaniu mapy** — kiedy
w repozytorium `Scenariusze` zostanie naprawione przesuwanie, a nowy plik trafi do
aplikacji. Wcześniej wyniki będą takie same jak 27 września.

> **Stan na 27 września 2026, po południu: przesuwanie naprawione, nowe wydanie gotowe**
> (rozdz. 38). Poprawiony `Gilead.html` ma sumę SHA-256
> `3e0d89f5d216a736c1946df0e9e4c5a924d39b34abeea48929471e8206147d31` (1 054 700 B).
> Po skopiowaniu do `Main/Gilead.html` suma kopii ma być **dokładnie taka sama** — dopiero
> wtedy wyniki testów niżej mówią coś o poprawce. Stara suma `4e5fe8f9…` znaczy, że w
> aplikacji jest jeszcze wydanie z usterką.

### 36.1 Zanim zaczniesz

Tablet **poziomo**, aplikacja, mapa **zaraz po otwarciu**. Powinien być widoczny **pionowy
zakreskowany pas przy lewej krawędzi** oraz **VULKARIS** (lewy dół) i **TROLLIUS** (prawy
dół). U góry może być widać dolny skrawek belki z uciętym do połowy napisem — to jest
w porządku.

Tego, czy na tablecie jest już **nowy** plik, z wyglądu nie rozpoznasz — obecna i poprawiona
wersja wyglądają przy starcie tak samo. Rozpozna to test 1 niżej. Jeżeli mapa znów przesuwa
się tylko o kilka pikseli, najpierw wyczyść dane aplikacji (`Ustawienia` → `Aplikacje` →
**Kozi Przybornik** → `Pamięć` → `Wyczyść dane`), otwórz ją od nowa i spróbuj jeszcze raz —
**zanim** uznasz, że poprawka nie działa. Aplikacji nie trzeba przeinstalowywać.

### 36.2 Testy

| # | Co zrobić | Co ma się stać |
|---|---|---|
| 1 | Zamknij aplikację całkowicie, otwórz, wejdź w mapę i przeciągnij palcem przez pół ekranu | Mapa **jedzie za palcem przez całą drogę**, nie zatrzymuje się po kilku pikselach |
| 2 | Zsuń i rozsuń dwa palce, potem od razu przeciągnij jednym | Przybliżanie działa jak dotąd, potem mapa jedzie za palcem |
| 3 | Obróć tablet na pion i z powrotem, przeciągnij | Mapa jedzie za palcem w obu orientacjach |
| 4 | Przeciągnij mapę tak, żeby **zakończyć ruch na planecie** | Opis planety **nie** otwiera się |
| 5 | Otwórz opis planety i przeciągnij mapę obok niego | Mapa jedzie za palcem, opis zostaje otwarty |
| 6 | Trzymając palec na mapie, drugą ręką ściągnij z góry ekranu pasek powiadomień, schowaj go i przeciągnij mapę | Mapa jedzie za palcem. Ten test zastępuje test 10 z rozdz. 30 — na Twoim tablecie nie ma gestu cofania od krawędzi |
| 7 | Przełącz się na inną aplikację z palcem na mapie, wróć, przeciągnij | Mapa jedzie za palcem |
| 8 | Testy 1 i 2 **na telefonie** — w aplikacji i w przeglądarce | Mapa jedzie za palcem |
| 9 | Testy 1 i 2 **w Chrome na tablecie** | Mapa jedzie za palcem |
| 10 | Na komputerze: przeciągnij myszą, pokręć kółkiem | Działa jak dotąd |
| 11 | Przez kilkanaście sekund przybliżaj, oddalaj i przesuwaj, patrząc na Wrakowisko i Głębię | Tylko obserwacja — rozdz. 36.3 |

Testów, które 27 września przeszły i których ta poprawka nie dotyka — `INDEKS`, zamykanie
opisu krzyżykiem, dzielony ekran, dwustuknięcie — **nie trzeba powtarzać**.

### 36.3 Artefakty — na co patrzeć

Przy przybliżaniu i przesuwaniu zwróć uwagę, czy pojawiają się **poziome pasy**, w których
czerwone wypełnienie Wrakowiska (albo Głębi czy Cieśniny Andraste) jest mocniejsze niż
obok, albo **pozioma kreska** przecinająca mapę. Samo słabe czerwone wypełnienie tych
obszarów jest zamierzone — oznacza strefę ostrzeżenia.

Odpowiedz jednym z trzech: **nie widać** / **widać rzadko, nie przeszkadza** / **widać
często albo przeszkadza**. Od tej odpowiedzi zależy decyzja D8 (rozdz. 35).

### 36.4 Co mi odesłać

1. Numery testów z 36.2, które przeszły, i te, które nie.
2. Przy teście, który nie przeszedł: co dokładnie robiłeś i czy wcześniej czyściłeś dane
   aplikacji.
3. Odpowiedź z 36.3 — artefakty.
4. Decyzję D8, jeżeli już ją masz.

---

## 37. Ryzyka, czego ta część nie rozstrzyga, następne kroki

### 37.1 Ryzyka

| Ryzyko | Ocena |
|---|---|
| N1 okaże się niewystarczające na prawdziwym tablecie | **niskie** — emulacja w Chromium odtwarza objaw dokładnie (ruch o drogę progu i koniec gestu), a poprawka usuwa go w 100 %; niejawne przechwycenie dotyku działa tak samo w każdej przeglądarce opartej na Chromium |
| Przeglądarka spoza rodziny Chromium (Firefox, Safari na iPadzie) zachowa się inaczej | **niskie dla N1** — warunek `ev.target===svg` jest poprawny niezależnie od tego, czy przeglądarka przechwytuje dotyk niejawnie; nie badane |
| Po naprawie przesuwania artefakty z rozdz. 33 staną się częstsze | **średnie** — przesuwanie będzie przerysowywać mapę tak jak szczypanie; kosmetyka, decyzja D8 |
| Stary plik w pamięci podręcznej po wydaniu | jak w rozdz. 27.7 — objaw identyczny z nienaprawionym; stąd instrukcja czyszczenia w 36.1 |
| Kolejna zmiana w obsłudze gestów bez badania dotykowego | **wysokie**, jeżeli N3 nie zostanie zrobione — ta usterka jest tego dowodem |

### 37.2 Czego ta część nie rozstrzyga

1. **Nie uruchomiono niczego na tablecie.** Przyczyna przesuwania jest odtworzona
   w emulacji dotyku i zgadza się z każdą obserwacją użytkownika, ale potwierdzenie poprawki
   na sprzęcie da dopiero rozdz. 36.
2. **Mechanizm artefaktów wewnątrz przeglądarki** to wniosek z położenia granic pasów,
   nie obserwacja (rozdz. 33.2).
3. **`test_mapy.py` i `assemble.py` nie były oglądane** — rozdz. 32.4 i 34 opierają się na
   opisie z rozdz. 19 i 28.
4. **Zastrzeżenie z rozdz. 28.10 pkt 4** — czy `touch-action` na kontenerze
   i `overscroll-behavior` coś zmieniają na tym tablecie — nadal otwarte. Z usterką
   przesuwania nie ma związku: w zapisie zdarzeń nie ma `pointercancel`, gest kończy sam
   skrypt (rozdz. 32.2).

### 37.3 Następne kroki

| Etap | Kto | Co |
|---|---|---|
| 1 | Ty | przekazać tę analizę agentowi repozytorium `Scenariusze`, tak jak przy poprzednich etapach; ewentualnie z decyzją D8 |
| 2 | agent `Scenariusze` | N1–N3 w `assemble.py` i `test_mapy.py`; sprawdzenie wstecz badania dotykowego na obecnym wydaniu; nowe wydanie i jego suma SHA-256; wpis w dokumencie projektu (rejestr usterek — regresja po U-21) — **✔ wykonane 27 września 2026, rozdz. 38** |
| 3 | Ty | skopiować nowe wydanie do `Main/Gilead.html` |
| 4 | agent `WrathAndGlory` | porównać sumę kontrolną kopii z sumą wydania; dokumentacja modułu bez zmian (rozdz. 34) |
| 5 | Ty | testy z rozdz. 36 i odpowiedź według 36.4 |
| 6 | — | zależnie od wyniku 36.3 i decyzji D8: zamknięcie albo N4 |

---

# WYKONANIE z 27 września 2026 — N1–N3 w repozytorium `Scenariusze`

## 38. Co wykonano — N1–N3

### 38.1 Polecenie użytkownika (zachowane w całości)

> Zapoznaj się z analizą Analizy/gilead-nawigacja-mapy-pwa-tablet-2026-09-21.md i wprowadź
> poprawki do skryptu budującego plik Gilead.html oraz zbuduj nowy i poprawiony plik.
> Zmiany wrzuć na main. Równolegle w repo są też przeprowadzane inne prace, ale w innych
> folderach.

W trakcie pracy użytkownik dopisał:

> Po wprowadzeniu zmian zaktualizuj też plik z analizą. Wkleje go do drugiego repo i tam
> zrobię testy.

oraz dwukrotnie: „Kontynuuj pracę” / „kontynuuj pracę”.

**Gdzie trafiły zmiany:** jeden commit na gałęzi `main` repozytorium `Scenariusze`
(„Gilead: przesuwanie palcem na ekranach dotykowych (U-22, N1-N3)”), osadzony na bieżącym
`main` — równoległe prace w `Warhammer40k/Scenariusz_Halloween/` nie dotykały żadnego
z plików tej poprawki. Zmienione pliki: `Warhammer40k/Gilead/Gilead.html`,
`Warhammer40k/Gilead/Instrukcja.md`, `Warhammer40k/Gilead/scripts/build/gilead/assemble.py`,
`Warhammer40k/Gilead/scripts/build/gilead/test_mapy.py`,
`Analizy/Projekt_Mapa_Gilead/ProjektGileadHTML.md` i ten dokument.

### 38.2 Stan przed poprawką — suma zgodna

`Warhammer40k/Gilead/Gilead.html` przed zmianą: SHA-256 `4e5fe8f9…`, 1 054 214 B — ta sama
suma co w rozdz. 28.8, czyli to samo wydanie, które użytkownik testował na tablecie.
`assemble.py` uruchomione przed zmianą odtwarza ten plik **co do bajtu**. Analiza z rozdz.
32–34 opisuje więc dokładnie ten kod, który wychodzi z generatora.

### 38.3 Zakres wykonania

| | Stan | Gdzie |
|---|---|---|
| **N1** warunek `ev.target===svg` w nasłuchu `lostpointercapture` | ✔ wykonane — dokładnie wariant z rozdz. 34 | `assemble.py`, stała `JS`; w wydaniu `Gilead.html:935–945` |
| **N2** punkt 31 kontroli G-6 pilnuje warunku | ✔ wykonane | `assemble.py`, funkcja `kontrola()` |
| **N3** badanie dotykowe w `test_mapy.py` | ✔ wykonane — wszystkie osiem punktów z tabeli w rozdz. 34 | `test_mapy.py` |
| **N4** przerysowanie raz na klatkę | ✘ **nie wykonane** | czeka na decyzję D8 (rozdz. 35); rekomendacja (a) — najpierw ponowny test |

`dane.py`, `mapa.py` i `obrazy.py` nietknięte. Treść rejestru, geometria mapy i ilustracje
bez zmian.

**N2 — co dokładnie sprawdza.** Dwie rzeczy: że nasłuch ma postać
`svg.addEventListener('lostpointercapture',function(ev){ if(ev.target===svg) koniec(ev); …`
oraz że **nigdzie** w pliku nie ma nasłuchu `lostpointercapture` podpiętego wprost pod
funkcję. Sprawdzone wstecz na pięciu wariantach psujących nowe wydanie — stary nasłuch
podpięty wprost, warunek usunięty, warunek odwrócony, dodatkowy nasłuch wprost na innym
elemencie, nasłuch usunięty w całości: każdy wykryty. Na wydaniu `4e5fe8f9…` kontrola
zgłasza oba błędy.

**N3 — jak zrobione.** Tak, jak opisuje rozdz. 34: kontekst z `has_touch=True`, sesja
protokołu DevTools, `Input.dispatchTouchEvent`, krok 1 px, droga 120 px. Dwa okna: tablet
1280 × 720 przy gęstości 1,5 i telefon 390 × 844 przy gęstości 3. Punkty startu badanie
wyszukuje samo — przeszukuje planszę i bierze pierwszy punkt dla każdego **innego**
elementu wewnątrz SVG, do sześciu, z wymogiem co najmniej trzech. Planetę do stuknięcia
i do „przeciągnięcia zakończonego na planecie” też wybiera samo spośród widocznych
w kadrze, bo na telefonie widok domyślny jest przybliżony. Punkt 3 (przy otwartej karcie)
tylko w oknie tabletu — poniżej 1024 px karta przykrywa mapę w całości.

**Sprostowanie rozdz. 32.4 i 37.2 pkt 3.** `test_mapy.py` jest już obejrzany. Wniosek
z rozdz. 32.4 się potwierdza, i to mocniej, niż tam zapisano: dotychczasowe badanie
**w ogóle nie przeciągało mapy**. Przesunięcie sprawdzało klawiszem `ArrowRight`,
przybliżanie — zdarzeniem `WheelEvent` wysłanym skryptem, kliknięcia — myszą Playwrighta.
Ścieżki, na której powstała usterka, nie dotykało żadne z nich.

### 38.4 Kontrola i nowe wydanie

**Badanie sprawdzone wstecz** na wydaniu `4e5fe8f9…` — oblewa punkty 1, 2, 3 i 8, dokładnie
jak przewidywał rozdz. 34, i w przewidzianym tam przedziale 3–4 % drogi palca (rozdz. 32.3
podaje 4 % dla jednego palca po szczypaniu; tu wyszło 3 % — o jedno zdarzenie ruchu mniej
za progiem, co przy tej mierze nie ma znaczenia):

| punkt | tablet — wydanie `4e5fe8f9…` | telefon — wydanie `4e5fe8f9…` | tablet i telefon — nowe wydanie |
|---|---|---|---|
| 1 — jeden palec, sześć różnych elementów pod palcem | **3 %** z każdego | **3 %** z każdego | **100 %** z każdego |
| 2 — jeden palec zaraz po szczypaniu | **3 %** | **3 %** | **100 %** |
| 3 — przy otwartej karcie | **3 %**, karta otwarta | — | **100 %**, karta otwarta (tablet) |
| 4 — szczypanie | przybliża | przybliża | przybliża |
| 5 — stuknięcie w planetę | otwiera kartę | otwiera kartę | otwiera kartę |
| 6 — przeciągnięcie zakończone na planecie | karta się nie otwiera | karta się nie otwiera | karta się nie otwiera |
| 7 — SVG traci przechwycenie | gest się kończy (0 %) | gest się kończy (0 %) | gest się kończy (0 %) |
| 8 — element wewnątrz SVG oddaje przechwycenie | **gest się kończy (0 %)** | **gest się kończy (0 %)** | **gest trwa (100 %)** |

Elementy pod palcem w punkcie 1 — tablet: `rect`, `line`, `path.cog-obszar`,
`ellipse.cog-pas`, `circle` oraz `path.cog-naroznik` albo `text.cog-etykieta` (szósty
element zależy od przebiegu: stopka losuje myśl dnia o jednym albo dwóch wierszach, co
zmienia wysokość planszy i kadr); telefon: `rect`, `circle`, `ellipse.cog-pas`,
`circle.cog-traf`, `path.cog-naroznik`, `line`.

Wynik budowy:

```
Gilead.html · 1.01 MB (ilustracje 0.89 MB, znaczniki i kod 114 KB)
pozycji: 15 (8 światów + 7 obszarów) · hotspotów: 20
pola: poziom 1 = 111 · poziom 2 = 30 · poziom 3 (utajnione) = 39
kontrola G-6 i G-12: OK
```

`test_mapy.py` na nowym wydaniu: **BŁĘDY: brak**, 0 wpisów konsoli. Wszystkie dotychczasowe
badania — 15 pozycji, podświetlenie wierszy, przewijanie kart, kolejność `tab`, napisy ramy,
cele dotykowe 44,0 px, trzy warianty zerowego pomiaru z U-21, karta i powrót kadru —
przechodzą bez zmian. Zrzut przy 1440 px obejrzany: mapa rysuje się tak samo jak przed
poprawką.

**Nowe wydanie — suma kontrolna do przeniesienia** (zastępuje rozdz. 28.8):

```
SHA-256  3e0d89f5d216a736c1946df0e9e4c5a924d39b34abeea48929471e8206147d31
rozmiar  1054700 B
plik     Warhammer40k/Gilead/Gilead.html (repozytorium Scenariusze, po N1–N3)
```

Różnica wobec poprzedniego wydania: +486 B — sam komentarz i warunek w nasłuchu.

### 38.5 Dokumentacja projektu

| Miejsce | Wpis |
|---|---|
| `ProjektGileadHTML.md`, rozdz. 19 | **U-22** w rejestrze usterek — regresja po U-21, „wykonane 2026-09-27” |
| `ProjektGileadHTML.md`, rozdz. 9 | **G-27** w changelogu |
| `ProjektGileadHTML.md`, nowy rozdz. 24 | **Etap VII — przesuwanie palcem na ekranach dotykowych (U-22)**; w rozdz. 23 odsyłacz do niego |
| `ProjektGileadHTML.md`, tabela etapów | wiersz **VII — przesuwanie palcem** |
| `Instrukcja.md`, rozdz. 4.2 | blok „oczekiwany wynik” (kod 114 KB, przebieg 2026-09-27) oraz zasada: **gesty mapy bada się dotykiem, nie myszą** |

### 38.6 Co dalej

| Etap | Kto | Co |
|---|---|---|
| 1 | Ty | skopiować nowe wydanie do `Main/Gilead.html` w repozytorium `WrathAndGlory` |
| 2 | agent `WrathAndGlory` | porównać `sha256sum Main/Gilead.html` z sumą z rozdz. 38.4; dokumentacja modułu bez zmian (rozdz. 34) |
| 3 | Ty | wyczyścić dane aplikacji na tablecie, jeśli mapa nadal przesuwa się o kilka pikseli (rozdz. 36.1), i wykonać testy z **rozdz. 36** |
| 4 | Ty | odpowiedź według rozdz. 36.4, w tym ocena artefaktów (36.3) i decyzja **D8** |
| 5 | — | zależnie od D8: zamknięcie albo N4 |

**Czego to wykonanie nie rozstrzyga:** pliku nie uruchomiono na tablecie — emulacja
dotyku odtwarza objaw i jego usunięcie, potwierdzenie na sprzęcie da dopiero rozdz. 36.
Artefakty z rozdz. 33 nie były ruszane. Zastrzeżenie z rozdz. 28.10 pkt 4 (`touch-action`
na kontenerze, `overscroll-behavior`) pozostaje otwarte i z tą usterką nie ma związku.

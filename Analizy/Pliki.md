# Analiza plików `vehicle-extra.css` i `vehicle-tabs-extension.js`

**Repozytorium:** `CuteLittleGoat/WrathAndGlory`  
**Moduł:** `DataVault`  
**Data analizy:** 2026-06-17  
**Zakres:** wyjaśnienie roli plików:

- `DataVault/vehicle-extra.css`
- `DataVault/vehicle-tabs-extension.js`

oraz ocena, czy ich zawartość może zostać przeniesiona do głównych plików modułu:

- `DataVault/app.js`
- `DataVault/style.css`

Analiza nie zmienia kodu aplikacji. Ten dokument jest jedynym dodanym plikiem.

---

## 1. Krótka odpowiedź

Oba pliki są dodatkowymi nakładkami dla nowych arkuszy pojazdów:

- `vehicle-extra.css` odpowiada wyłącznie za szerokości i wyrównania kolumn w tabelach `Uszkodzenia Pojazdów` oraz `Eksplozje Pojazdów`.
- `vehicle-tabs-extension.js` odpowiada za ukrywanie/pokazywanie zakładek `Uszkodzenia Pojazdów` i `Eksplozje Pojazdów` w taki sposób, aby działały jak zakładki pojazdowe i jednocześnie były dostępne tylko w trybie admina.

Technicznie ich zawartość **może** być przeniesiona do `DataVault/style.css` i `DataVault/app.js`.

Architektonicznie, jeżeli te arkusze są stałą częścią modułu DataVault, docelowo lepsze byłoby włączenie tej logiki do głównych plików:

- CSS do `style.css`, najlepiej przy istniejącej sekcji konfiguracji kolumn pojazdów.
- JS do `app.js`, najlepiej nie przez kopiowanie całej nakładki, tylko przez dopisanie nowych arkuszy do istniejących zbiorów `VEHICLE_SHEETS` i `ADMIN_ONLY_SHEETS`.

Obecne osobne pliki są sensowne jako szybka, mało inwazyjna nakładka albo etap przejściowy, ale zwiększają liczbę miejsc, w których trzeba pamiętać o tej samej funkcji.

---

## 2. Jak te pliki są podłączone

W `DataVault/index.html` główny arkusz stylów i główny skrypt są ładowane razem z dodatkowymi plikami:

```html
<link rel="stylesheet" href="style.css"/>
<link rel="stylesheet" href="vehicle-extra.css"/>
...
<script src="app.js"></script>
<script src="vehicle-tabs-extension.js"></script>
```

To oznacza:

1. `vehicle-extra.css` ładuje się **po** `style.css`.
2. `vehicle-tabs-extension.js` ładuje się **po** `app.js`.

Ta kolejność jest ważna, bo oba pliki działają jako rozszerzenie istniejącego modułu, a nie jako jego podstawa.

---

## 3. `DataVault/vehicle-extra.css`

### 3.1. Co zawiera

Plik zawiera tylko selektory CSS dla dwóch arkuszy:

- `Uszkodzenia Pojazdów`
- `Eksplozje Pojazdów`

Konfiguruje konkretne kolumny tych tabel:

#### `Uszkodzenia Pojazdów`

- `Rzut k66`
  - `min-width: 6ch`
  - wyrównanie do środka
  - bez zawijania tekstu
- `Efekt`
  - `min-width: 56ch`
  - wyrównanie do lewej

#### `Eksplozje Pojazdów`

- `Rozmiar Pojazdu`
  - `min-width: 18ch`
  - wyrównanie do lewej
- `Zasięg Rażenia`
  - `min-width: 14ch`
  - wyrównanie do środka
  - bez zawijania tekstu
- `Obrażenia`
  - `min-width: 14ch`
  - wyrównanie do środka
  - bez zawijania tekstu

### 3.2. Po co istnieje

Ten plik istnieje po to, aby dodać brakującą konfigurację wyglądu dla dwóch nowych tabel bez ruszania głównego `style.css`.

W `style.css` są już rozbudowane reguły dla wielu arkuszy DataVault, w tym duża sekcja pojazdowa. `vehicle-extra.css` dopowiada tylko brakujący fragment dla dwóch nowych arkuszy.

### 3.3. Czy może być w `style.css`

Tak. To jest czysty CSS i nie ma technicznej przeszkody, żeby przenieść te reguły do `DataVault/style.css`.

Najbardziej naturalne miejsce to koniec istniejącej sekcji:

```text
Konfiguracja kolumn arkuszy pojazdów / Vehicle sheet column configuration
```

Wtedy wszystkie reguły kolumn pojazdów byłyby w jednym pliku i jednym miejscu.

### 3.4. Na co uważać przy ewentualnym przenoszeniu

Obecnie `vehicle-extra.css` ładuje się po `style.css`, więc ma późniejszą pozycję w kaskadzie CSS. Jeżeli reguły zostaną przeniesione do `style.css`, najlepiej umieścić je pod koniec sekcji pojazdowej albo ogólnie po bazowych regułach tabel.

W praktyce ryzyko konfliktu jest niskie, bo selektory są bardzo konkretne:

```css
.tableWrap table[data-sheet="..."] th[data-col="..."]
.tableWrap table[data-sheet="..."] td[data-col="..."]
```

ale utrzymanie ich przy pozostałych regułach pojazdów będzie czytelniejsze.

---

## 4. `DataVault/vehicle-tabs-extension.js`

### 4.1. Co zawiera

Plik jest samowykonującą się nakładką JS. Definiuje dwie dodatkowe zakładki:

```js
const EXTRA_VEHICLE_SHEETS = ["Uszkodzenia Pojazdów", "Eksplozje Pojazdów"];
```

Następnie traktuje obie jako zakładki tylko dla admina:

```js
const ADMIN_ONLY_EXTRA_SHEETS = new Set(["Uszkodzenia Pojazdów", "Eksplozje Pojazdów"]);
```

To jest istotne: w aktualnym rozszerzeniu **obie** zakładki są admin-only. Nie tylko `Uszkodzenia Pojazdów`, ale również `Eksplozje Pojazdów`.

### 4.2. Jak działa widoczność

Funkcja `shouldShowSheet(sheetName)` wymaga jednocześnie dwóch warunków:

1. Checkbox pojazdów `#toggleVehicleTabs` musi być zaznaczony.
2. Strona musi działać w trybie admina, czyli URL musi mieć `?admin=1`.

W efekcie:

| Tryb | Checkbox pojazdów odznaczony | Checkbox pojazdów zaznaczony |
| --- | --- | --- |
| Użytkownik | zakładki ukryte | zakładki ukryte |
| Admin | zakładki ukryte | zakładki widoczne |

### 4.3. Dlaczego taki plik był potrzebny przy obecnym `app.js`

W aktualnym `DataVault/app.js` istnieje już system grup zakładek:

- zakładki tworzenia postaci,
- zakładki zasad walki,
- zakładki pojazdów,
- zakładki admin-only.

Istnieje też checkbox `toggleVehicleTabs`, stan `uiState.showVehicleTabs` i zbiór `VEHICLE_SHEETS`.

Problem polega na tym, że w aktualnym `app.js` zbiór `VEHICLE_SHEETS` obejmuje dotychczasowe arkusze pojazdowe:

```js
"Role W Pojeździe"
"Akcje Pojazdu"
"Stany Pojazdów"
"Cechy Pojazdów"
"Pojazdy"
"Bronie Pojazdów"
"Ekwipunek Pojazdów"
```

ale nie obejmuje:

```js
"Uszkodzenia Pojazdów"
"Eksplozje Pojazdów"
```

W aktualnym `app.js` te dwa arkusze nie są też dopisane do głównego `ADMIN_ONLY_SHEETS`.

Gdyby więc dane z Firebase zawierały te arkusze, a `vehicle-tabs-extension.js` nie istniał, aplikacja potraktowałaby je jak zwykłe arkusze:

- nie byłyby zależne od checkboxa pojazdów,
- mogłyby pojawić się użytkownikowi bez trybu admina,
- nie dostałyby automatycznie klasy `tab--vehicle`, bo `app.js` nie rozpoznawałby ich jako pojazdowych.

`vehicle-tabs-extension.js` naprawia to z zewnątrz, bez zmieniania `app.js`.

### 4.4. Jak dokładnie robi tę korektę

Plik:

1. Szuka przycisków zakładek w `#tabs`.
2. Odczytuje tekst zakładki i porównuje go z nazwami `Uszkodzenia Pojazdów` oraz `Eksplozje Pojazdów`.
3. Dodaje takim zakładkom klasę `tab--vehicle`.
4. Ustawia `hidden` i `style.display`, jeśli zakładka nie powinna być widoczna.
5. Jeżeli ukrywana zakładka była aktywna, klika pierwszą dostępną zakładkę zastępczą.
6. Dopina się do checkboxa `#toggleVehicleTabs`.
7. Obserwuje `#tabs` przez `MutationObserver`, żeby ponownie zsynchronizować stan po przebudowie zakładek.
8. Próbuje opakować `window.initUI`, aby synchronizacja wykonała się po każdym przebudowaniu UI przez aplikację.

To jest typowy mechanizm nakładki/pluginu: zamiast zmieniać logikę źródłową, poprawia efekt końcowy w DOM.

---

## 5. Czy `vehicle-tabs-extension.js` może być w `app.js`

Tak, ale nie warto przenosić go 1:1.

Lepszy wariant integracji z `app.js` polegałby na usunięciu potrzeby istnienia tej nakładki.

Docelowo w `app.js` wystarczyłoby, aby dwa nowe arkusze były ujęte w głównych zbiorach sterujących widocznością.

### 5.1. Logika pojazdów

Oba arkusze powinny trafić do `VEHICLE_SHEETS`, jeśli mają reagować na checkbox:

```js
"Uszkodzenia Pojazdów"
"Eksplozje Pojazdów"
```

Wtedy istniejąca logika:

```js
visibleSheets = uiState.showVehicleTabs
  ? visibleSheets
  : visibleSheets.filter(name => !isVehicleSheet(name));
```

sama ukryje je, gdy checkbox pojazdów jest odznaczony.

### 5.2. Logika admin-only

Jeżeli aktualne zachowanie rozszerzenia jest zamierzone, czyli **obie** zakładki mają być dostępne tylko w trybie admina, wtedy obie powinny trafić również do `ADMIN_ONLY_SHEETS`.

Jeżeli `Eksplozje Pojazdów` mają być widoczne dla zwykłego użytkownika po zaznaczeniu checkboxa pojazdów, wtedy do `ADMIN_ONLY_SHEETS` powinny trafić tylko `Uszkodzenia Pojazdów`.

To jest decyzja funkcjonalna, a nie techniczna. Obecny plik `vehicle-tabs-extension.js` jasno implementuje wariant: **oba arkusze admin-only**.

### 5.3. Co stałoby się po integracji

Po dopisaniu arkuszy do właściwych zbiorów w `app.js` nie byłoby potrzebne:

- opakowywanie `initUI`,
- `MutationObserver`,
- ręczne ustawianie `hidden`,
- ręczne ustawianie `style.display`,
- rozpoznawanie zakładek po `textContent`,
- dodatkowy listener checkboxa tylko dla tych dwóch arkuszy.

Wszystko obsłużyłaby główna logika modułu.

---

## 6. Zalety obecnego rozdzielenia plików

Obecne osobne pliki mają kilka praktycznych zalet:

1. **Minimalna ingerencja w działający moduł**  
   Nie trzeba było dotykać dużego `app.js` ani dużego `style.css`.

2. **Łatwy rollback**  
   Można usunąć dwa linki z `index.html` albo same pliki, żeby cofnąć funkcję.

3. **Mniejsze ryzyko konfliktu przy szybkim wdrożeniu**  
   Przy dużym pliku `app.js` nawet mała zmiana może być bardziej ryzykowna niż zewnętrzna nakładka.

4. **Czytelna izolacja funkcji przejściowej**  
   Od razu widać, że chodzi o dodatkowe arkusze pojazdowe.

5. **Brak potrzeby przebudowy istniejącej logiki**  
   Rozszerzenie wykorzystuje gotowy DOM i gotowe checkboxy.

---

## 7. Wady obecnego rozdzielenia plików

Długoterminowo obecny wariant ma jednak istotne minusy.

### 7.1. Dwa źródła prawdy

`app.js` ma własną listę `VEHICLE_SHEETS` i `ADMIN_ONLY_SHEETS`, ale dwa nowe arkusze są definiowane osobno w `vehicle-tabs-extension.js`.

To oznacza, że informacja „co jest zakładką pojazdową” i „co jest admin-only” jest rozproszona po dwóch plikach.

### 7.2. Logika DOM zamiast logiki danych

Główny `app.js` buduje listę zakładek na podstawie nazw arkuszy w danych. Rozszerzenie działa dopiero po fakcie, na gotowych przyciskach w DOM.

To jest mniej eleganckie i bardziej kruche niż decyzja podjęta w `initUI()` przed wyrenderowaniem zakładek.

### 7.3. Rozpoznawanie po tekście zakładki

Rozszerzenie rozpoznaje zakładkę po jej `textContent`, przekształconym do wielkich liter.

To działa przy obecnym UI, ale jest bardziej podatne na problemy, jeśli kiedyś:

- nazwy zakładek zostaną przetłumaczone,
- format etykiety zakładki się zmieni,
- do tekstu zakładki trafi dodatkowy znacznik lub licznik,
- nazwy arkuszy zostaną zmienione w XLSX.

Logika w `app.js` oparta na nazwie arkusza jest stabilniejsza.

### 7.4. Możliwy chwilowy błysk zakładek

Ponieważ `vehicle-tabs-extension.js` działa po `app.js`, teoretycznie może wystąpić krótki moment, w którym zakładki zostaną utworzone przez aplikację, a dopiero potem ukryte przez rozszerzenie.

W praktyce ryzyko jest małe, bo rozszerzenie ładuje się zaraz po `app.js`, a dane są pobierane asynchronicznie. Nadal jest to jednak cecha nakładki DOM, której nie byłoby przy integracji w `app.js`.

### 7.5. Większa złożoność niż potrzeba docelowo

`MutationObserver`, opakowywanie `initUI` i ręczne klikanie zakładki fallback są potrzebne tylko dlatego, że rozszerzenie działa z zewnątrz.

Gdyby arkusze były wpisane w główne zbiory `app.js`, te mechanizmy byłyby zbędne.

---

## 8. Ocena: zostawić osobno czy przenieść

### 8.1. Zostawić osobno, jeśli...

Warto zostawić `vehicle-extra.css` i `vehicle-tabs-extension.js` jako osobne pliki, jeżeli:

- to jest rozwiązanie tymczasowe,
- chcesz ograniczyć ryzyko zmian w dużych plikach,
- planujesz jeszcze zmienić decyzję, czy `Eksplozje Pojazdów` mają być admin-only,
- chcesz łatwo wyłączyć tę funkcję bez ruszania rdzenia modułu,
- moduł DataVault ma być rozwijany przez małe dodatki/pluginy.

### 8.2. Przenieść do głównych plików, jeśli...

Warto przenieść logikę do `app.js` i `style.css`, jeżeli:

- oba arkusze są już stałą częścią DataVault,
- zachowanie admin-only jest ustalone,
- zależy Ci na jednym źródle prawdy,
- chcesz zmniejszyć liczbę plików ładowanych przez `index.html`,
- chcesz uniknąć DOM-owej nakładki i polegać na głównej logice `initUI()`.

### 8.3. Moja rekomendacja

Dla stanu docelowego rekomenduję integrację:

1. Reguły z `vehicle-extra.css` przenieść do `DataVault/style.css` w sekcji pojazdowej.
2. Zamiast przenosić całe `vehicle-tabs-extension.js`, dopisać odpowiednie nazwy arkuszy do zbiorów w `DataVault/app.js`:
   - `VEHICLE_SHEETS`,
   - `ADMIN_ONLY_SHEETS` zgodnie z decyzją, czy admin-only ma dotyczyć jednego czy obu arkuszy.
3. Po integracji usunąć ładowanie `vehicle-extra.css` i `vehicle-tabs-extension.js` z `index.html` oraz usunąć same pliki, ale dopiero w osobnym, świadomym kroku refaktoryzacyjnym.

W ramach tej analizy nie wykonuję tych zmian, bo polecenie brzmiało: nie wprowadzać zmian w kodzie aplikacji.

---

## 9. Ważna decyzja funkcjonalna przed ewentualnym refaktorem

Trzeba potwierdzić, czy `Eksplozje Pojazdów` mają być admin-only.

Obecny stan `vehicle-tabs-extension.js` mówi:

```text
Uszkodzenia Pojazdów = admin-only
Eksplozje Pojazdów = admin-only
```

Jeżeli to jest zgodne z intencją, integracja do `app.js` powinna zachować ten stan.

Jeżeli jednak `Eksplozje Pojazdów` mają być tabelą dostępną dla użytkowników/graczy po zaznaczeniu checkboxa pojazdów, obecne rozszerzenie jest zbyt restrykcyjne i należałoby to poprawić przy refaktorze.

---

## 10. Minimalny zakres przyszłego przeniesienia

Jeżeli zapadnie decyzja o włączeniu tej logiki do głównych plików, minimalny zakres przyszłych zmian byłby taki:

### `DataVault/style.css`

Dodać reguły kolumn dla:

- `Uszkodzenia Pojazdów`,
- `Eksplozje Pojazdów`.

Najlepiej przy istniejących regułach pojazdowych.

### `DataVault/app.js`

Dodać oba arkusze do `VEHICLE_SHEETS`.

Dodać do `ADMIN_ONLY_SHEETS`:

- oba arkusze, jeśli obecne zachowanie ma zostać zachowane,
- albo tylko `Uszkodzenia Pojazdów`, jeśli `Eksplozje Pojazdów` mają być dostępne dla zwykłego widoku.

### `DataVault/index.html`

Po przeniesieniu usunąć:

```html
<link rel="stylesheet" href="vehicle-extra.css"/>
<script src="vehicle-tabs-extension.js"></script>
```

### Pliki do ewentualnego usunięcia

Po potwierdzeniu, że integracja działa:

- `DataVault/vehicle-extra.css`,
- `DataVault/vehicle-tabs-extension.js`.

---

## 11. Testy po ewentualnej integracji

Po przyszłym przeniesieniu logiki do głównych plików należałoby sprawdzić:

1. Widok bez `?admin=1`, checkbox pojazdów odznaczony:
   - brak dodatkowych zakładek pojazdów.
2. Widok bez `?admin=1`, checkbox pojazdów zaznaczony:
   - zachowanie zależne od decyzji o `Eksplozje Pojazdów`,
   - `Uszkodzenia Pojazdów` powinny pozostać ukryte, jeśli są admin-only.
3. Widok `?admin=1`, checkbox pojazdów odznaczony:
   - dodatkowe zakładki pojazdów ukryte.
4. Widok `?admin=1`, checkbox pojazdów zaznaczony:
   - dodatkowe zakładki widoczne zgodnie z decyzją.
5. Kolor zakładek:
   - nowe zakładki powinny mieć styl `tab--vehicle`.
6. Tabele:
   - kolumny `Rzut k66`, `Efekt`, `Rozmiar Pojazdu`, `Zasięg Rażenia`, `Obrażenia` powinny mieć oczekiwane szerokości i wyrównania.
7. Przełączanie checkboxa, gdy aktywna jest zakładka pojazdowa:
   - po ukryciu aktywnej zakładki aplikacja powinna przejść na bezpieczny fallback.
8. Odświeżenie strony:
   - stan checkboxów i widoku powinien zachowywać się zgodnie z `sessionStorage`.

---

## 12. Podsumowanie końcowe

`DataVault/vehicle-extra.css` i `DataVault/vehicle-tabs-extension.js` są dodatkowymi plikami rozszerzającymi DataVault o obsługę dwóch nowych arkuszy pojazdowych bez bezpośredniego ruszania dużych plików rdzeniowych.

Ich istnienie jest uzasadnione jako rozwiązanie ostrożne albo przejściowe.

Nie ma jednak technicznej konieczności, aby zostały osobno. Dla trwałego, czystszego układu modułu lepiej byłoby przenieść:

- CSS do `DataVault/style.css`,
- decyzje o widoczności zakładek do `DataVault/app.js`.

Najważniejsza rzecz do potwierdzenia przed takim refaktorem: czy `Eksplozje Pojazdów` mają pozostać admin-only, bo obecne rozszerzenie właśnie tak je traktuje.

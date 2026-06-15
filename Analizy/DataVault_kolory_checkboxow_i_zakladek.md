# Analiza wdrożeniowa — DataVault: kolory checkboxów i zakładek grup specjalnych

**Repozytorium:** `CuteLittleGoat/WrathAndGlory`  
**Moduł:** `DataVault`  
**Zakres:** wyłącznie wygląd interfejsu: checkboxy w panelu filtrów oraz obramowanie / glow zakładek.  
**Status:** analiza przygotowana bez zmian w kodzie modułu.  
**Rekomendowany typ wdrożenia:** mała poprawka CSS, bez zmian mechanizmów działania aplikacji.

---

## 1. Cel zmiany

Celem jest ujednolicenie kodowania kolorami trzech grup zakładek specjalnych w DataVault:

1. zakładki dotyczące tworzenia postaci,
2. zakładki dotyczące zasad walki,
3. zakładki dotyczące pojazdów.

Obecnie pożądane zachowanie istnieje dla pojazdów i w dużej mierze dla zasad walki, natomiast grupa tworzenia postaci wizualnie zlewa się ze zwykłymi zielonymi zakładkami. Dodatkowo checkboxy w panelu filtrów nie są w pełni spójne z kolorem tekstu komunikatu.

Wymaganie docelowe:

* checkbox pojazdów pozostaje stalowo-szary;
* checkbox zasad walki ma być czerwony, tak jak tekst komunikatu;
* checkbox tworzenia postaci ma być w kolorze pasującym do tekstu komunikatu;
* aktywne zakładki zasad walki pozostają czerwone;
* aktywne zakładki pojazdów pozostają stalowo-szare;
* aktywne zakładki tworzenia postaci mają dostać własne obramowanie i glow pasujące do koloru tekstu, zamiast używać zwykłego zielonego efektu.

---

## 2. Aktualny stan struktury HTML

W `DataVault/index.html` istnieją trzy checkboxy sterujące widocznością grup zakładek:

```html
<label class="checkboxRow">
  <input type="checkbox" id="toggleCharacterTabs" />
  <span class="checkboxLabel" data-i18n="toggleCharacterTabs">Czy wyświetlić zakładki dotyczące tworzenia postaci?</span>
</label>
<label class="checkboxRow checkboxRow--combat">
  <input type="checkbox" id="toggleCombatTabs" />
  <span class="checkboxLabel checkboxLabel--combat" data-i18n="toggleCombatTabs">Czy wyświetlić zakładki dotyczące zasad walki?</span>
</label>
<label class="checkboxRow checkboxRow--vehicle">
  <input type="checkbox" id="toggleVehicleTabs" />
  <span class="checkboxLabel checkboxLabel--vehicle" data-i18n="toggleVehicleTabs">Czy wyświetlić zakładki dotyczące pojazdów?</span>
</label>
```

Wniosek:

* grupa pojazdów ma osobny modyfikator `checkboxRow--vehicle`;
* grupa zasad walki ma osobny modyfikator `checkboxRow--combat`;
* grupa tworzenia postaci nie ma osobnego modyfikatora i korzysta z bazowego wyglądu `.checkboxRow` oraz `.checkboxLabel`.

To tłumaczy, dlaczego tworzenie postaci jest mniej odróżnione wizualnie od zwykłych elementów interfejsu.

---

## 3. Aktualny stan logiki zakładek

W `DataVault/app.js` grupy specjalne są już rozpoznawane logicznie. Istnieją zestawy:

```js
CHARACTER_CREATION_SHEETS
COMBAT_RULES_SHEETS
VEHICLE_SHEETS
```

Podczas budowania zakładek aplikacja dodaje klasy:

```js
.tab--character
.tab--combat
.tab--vehicle
```

Wniosek:

Nie trzeba zmieniać mechanizmu budowania zakładek, filtrowania widoczności, zapisu w `sessionStorage`, tłumaczeń ani stanu UI. Klasy potrzebne do ostylowania grup już istnieją.

---

## 4. Aktualny stan CSS — checkboxy

Bazowa reguła dla checkboxów jest następująca:

```css
.checkboxRow input{
  width:16px;
  height:16px;
  accent-color:var(--accent);
  cursor:pointer;
}
```

Dla zasad walki istnieje reguła:

```css
.checkboxRow--combat input{
  accent-color:var(--red);
}
```

Problem polega na kolejności reguł: reguła `.checkboxRow--combat input` znajduje się przed późniejszą regułą bazową `.checkboxRow input`. Obie mają podobną siłę selektora w praktycznym zastosowaniu dla tego elementu, a późniejsza reguła bazowa może przejąć `accent-color`. To jest prawdopodobna przyczyna, dla której checkbox zasad walki wygląda jak zwykły zielony checkbox, mimo czerwonego tekstu.

Dla pojazdów reguła znajduje się później, w końcowej części pliku CSS:

```css
.checkboxRow--vehicle input{accent-color:var(--steel)}
```

Dlatego pojazdy zachowują się poprawnie i nie wymagają zmiany.

---

## 5. Aktualny stan CSS — zakładki

Bazowy aktywny stan zakładki jest zielony:

```css
.tab.active{
  background:rgba(22,198,12,.10);
  border-color:var(--b);
  box-shadow:0 0 0 2px rgba(22,198,12,.10);
}
```

Zakładki zasad walki mają czerwony tekst:

```css
.tab.tab--combat{
  color:var(--red);
}
```

oraz później osobny aktywny styl czerwony:

```css
.tab.tab--combat.active{
  border-color:rgba(215,75,75,.55);
  box-shadow:0 0 0 2px rgba(215,75,75,.18), 0 0 18px rgba(215,75,75,.28);
  background:rgba(215,75,75,.10);
}
```

Zakładki pojazdów mają kompletną osobną paletę stalowo-srebrną:

```css
.tab.tab--vehicle{...}
.tab.tab--vehicle:hover,
.tab.tab--vehicle:focus{...}
.tab.tab--vehicle.active{...}
```

Zakładki tworzenia postaci mają tylko kolor tekstu:

```css
.tab.tab--character{
  color:var(--code);
  opacity:.9;
}
.tab.tab--character.active{
  color:var(--code);
}
```

Brakuje im odpowiednika czerwonego lub stalowo-srebrnego stylu aktywnego. W efekcie aktywna zakładka tworzenia postaci zachowuje zielone obramowanie i zielony glow z `.tab.active`, przez co wygląda jak zwykła zakładka typu `Notatki`, `Ekwipunek`, `Bronie` itp.

---

## 6. Rekomendowana strategia wdrożenia

Najbezpieczniejsza ścieżka to poprawka CSS bez zmian w `app.js` i bez zmiany mechaniki działania modułu.

### 6.1. Nie ruszać logiki

Nie zmieniać:

* `CHARACTER_CREATION_SHEETS`,
* `COMBAT_RULES_SHEETS`,
* `VEHICLE_SHEETS`,
* `uiState`,
* `initUI()`,
* `selectSheet()`,
* zapisu i odtwarzania `sessionStorage`,
* tłumaczeń PL/EN,
* sposobu generowania zakładek.

Logika już dostarcza właściwe klasy `.tab--character`, `.tab--combat`, `.tab--vehicle`.

### 6.2. Checkbox zasad walki

Najprostsza poprawka: przenieść lub dopisać regułę po bazowej regule `.checkboxRow input`, tak aby późniejsza reguła wygrała kaskadę CSS.

Rekomendowany kierunek:

```css
#toggleCombatTabs{
  accent-color:var(--red);
}
```

albo:

```css
.checkboxRow--combat input{
  accent-color:var(--red);
}
```

pod warunkiem, że ta reguła znajdzie się po bazowej definicji `.checkboxRow input`.

Selektor po `id` jest najpewniejszy i nie wymaga zmiany HTML.

### 6.3. Checkbox tworzenia postaci

Ponieważ tekst checkboxa tworzenia postaci korzysta obecnie z koloru `var(--code)`, checkbox powinien używać tej samej lub bardzo zbliżonej barwy.

Rekomendowany kierunek:

```css
#toggleCharacterTabs{
  accent-color:var(--code);
}
```

To zachowuje obecny kolor tekstu i nie wymaga dodawania nowych klas w HTML.

Opcjonalnie można wprowadzić semantyczne zmienne:

```css
:root{
  --character:var(--code);
  --character-border:rgba(210,250,210,.55);
  --character-glow:rgba(210,250,210,.35);
  --character-bg:rgba(210,250,210,.08);
  --character-bg-active:rgba(210,250,210,.14);
}
```

Ten wariant jest bardziej czytelny, bo rozdziela „kolor kodu” od „koloru grupy tworzenia postaci”, nawet jeśli na start oba są takie same.

### 6.4. Zakładki tworzenia postaci

Należy dodać aktywny styl dla `.tab.tab--character.active`, analogiczny do istniejących stylów `.tab.tab--combat.active` oraz `.tab.tab--vehicle.active`.

Rekomendowany kierunek:

```css
.tab.tab--character{
  color:var(--code);
  background:rgba(210,250,210,.05);
  border-color:rgba(210,250,210,.20);
  opacity:1;
}

.tab.tab--character:hover,
.tab.tab--character:focus{
  color:var(--code);
  border-color:rgba(210,250,210,.45);
  box-shadow:0 0 0 2px rgba(210,250,210,.10);
}

.tab.tab--character.active{
  color:var(--code);
  background:rgba(210,250,210,.12);
  border-color:rgba(210,250,210,.55);
  box-shadow:0 0 0 2px rgba(210,250,210,.16), 0 0 18px rgba(210,250,210,.30);
}
```

Dzięki temu:

* zwykłe zakładki pozostaną zielone;
* zakładki walki pozostaną czerwone;
* zakładki pojazdów pozostaną stalowo-srebrne;
* zakładki tworzenia postaci będą miały własny jasny, kremowo-zielony / jasny terminalowy akcent zgodny z tekstem.

---

## 7. Alternatywa semantyczna — drobna zmiana HTML

Można też dodać osobne klasy do checkboxa tworzenia postaci:

```html
<label class="checkboxRow checkboxRow--character">
  <input type="checkbox" id="toggleCharacterTabs" />
  <span class="checkboxLabel checkboxLabel--character" data-i18n="toggleCharacterTabs">Czy wyświetlić zakładki dotyczące tworzenia postaci?</span>
</label>
```

Wtedy CSS byłby bardziej równoległy:

```css
.checkboxRow--character,
.checkboxRow--character .checkboxLabel{...}
.checkboxRow--character input{...}
```

Nie jest to jednak konieczne. Ponieważ celem jest wygląd bez zmian mechanizmów, wariant CSS-only jest mniej inwazyjny.

---

## 8. Ryzyka i uwagi

### 8.1. `accent-color` zależy od przeglądarki

`accent-color` styluje natywne checkboxy, ale ostateczny wygląd znacznika wyboru może się różnić między przeglądarkami i systemami operacyjnymi. Dla obecnego DataVault jest to akceptowalne, bo pojazdy już korzystają z tego mechanizmu i wyglądają poprawnie.

Nie rekomenduję budowania customowego checkboxa, bo to byłaby większa zmiana UI i wymagałaby dodatkowej obsługi dostępności.

### 8.2. Bardzo jasny kolor checkboxa tworzenia postaci

`var(--code)` jest jasny. Na ciemnym tle powinien być czytelny, ale natywny checkbox może wyglądać jaśniej niż pozostałe elementy. Jeśli po wdrożeniu okaże się zbyt blady, można zamiast `var(--code)` użyć osobnego koloru pośredniego, np. jasnej zieleni terminalowej między `--text` i `--code`.

### 8.3. Kolejność CSS jest kluczowa

Reguły dla grup specjalnych powinny znajdować się po regułach bazowych `.checkboxRow input` i `.tab.active`. Inaczej bazowy zielony styl może ponownie nadpisać style specjalne.

Najlepsze miejsce: końcowa sekcja stylów grup specjalnych, obok obecnych reguł pojazdów.

---

## 9. Proponowany minimalny zakres przyszłej poprawki

W przyszłym wdrożeniu wystarczy zmienić `DataVault/style.css`.

Nie powinno być potrzeby zmieniać:

* `DataVault/index.html`,
* `DataVault/app.js`,
* `DataVault/data.json`,
* generatorów JSON,
* dokumentacji działania mechanizmów.

Minimalny zestaw zmian CSS:

```css
/* Checkboxy grup specjalnych */
#toggleCharacterTabs{
  accent-color:var(--code);
}

#toggleCombatTabs{
  accent-color:var(--red);
}

/* Zakładki tworzenia postaci — jasny akcent zgodny z tekstem */
.tab.tab--character{
  color:var(--code);
  background:rgba(210,250,210,.05);
  border-color:rgba(210,250,210,.20);
  opacity:1;
}

.tab.tab--character:hover,
.tab.tab--character:focus{
  color:var(--code);
  border-color:rgba(210,250,210,.45);
  box-shadow:0 0 0 2px rgba(210,250,210,.10);
}

.tab.tab--character.active{
  color:var(--code);
  background:rgba(210,250,210,.12);
  border-color:rgba(210,250,210,.55);
  box-shadow:0 0 0 2px rgba(210,250,210,.16), 0 0 18px rgba(210,250,210,.30);
}
```

Reguły pojazdów należy zostawić bez zmian.

---

## 10. Lista testów po wdrożeniu

Po późniejszym wdrożeniu CSS należy sprawdzić:

1. Czy checkbox „Czy wyświetlić zakładki dotyczące pojazdów?” nadal jest stalowo-szary.
2. Czy checkbox „Czy wyświetlić zakładki dotyczące zasad walki?” po zaznaczeniu jest czerwony.
3. Czy checkbox „Czy wyświetlić zakładki dotyczące tworzenia postaci?” po zaznaczeniu jest w kolorze zgodnym z jasnym tekstem komunikatu.
4. Czy zakładki walki nadal mają czerwone aktywne obramowanie i czerwony glow.
5. Czy zakładki pojazdów nadal mają stalowo-szare aktywne obramowanie i glow.
6. Czy zakładki tworzenia postaci mają jasne obramowanie i glow, a nie zwykły zielony efekt.
7. Czy zwykłe zakładki, np. `Notatki`, `Bestiariusz`, `Ekwipunek`, `Bronie`, nadal pozostają zielone.
8. Czy przełączanie checkboxów nadal tylko pokazuje / ukrywa grupy zakładek i nie zmienia filtrów tabel.
9. Czy stan checkboxów nadal zapisuje się w sesji tak jak wcześniej.
10. Czy wygląd pozostaje czytelny w widoku desktopowym z szeroką listą zakładek.

---

## 11. Rekomendacja końcowa

Rekomenduję wdrożyć tę zmianę jako mały patch w `DataVault/style.css`, bez ruszania `DataVault/app.js`.

Najważniejsze są dwie rzeczy:

1. dopisać końcowe reguły `accent-color` dla `#toggleCharacterTabs` i `#toggleCombatTabs`, aby nie przegrywały z bazową regułą checkboxa;
2. dodać pełny aktywny styl `.tab.tab--character.active`, bo obecnie grupa tworzenia postaci ma tylko zmieniony kolor tekstu, ale dziedziczy zielone obramowanie i zielony glow ze zwykłych zakładek.

To rozwiąże wskazany problem wizualny bez zmian w mechanizmach DataVault.

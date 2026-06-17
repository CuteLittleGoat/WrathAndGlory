# Analiza rozbudowy DataVault — dodatkowe zakładki pojazdów

**Repozytorium:** `CuteLittleGoat/WrathAndGlory`  
**Moduł:** `DataVault`  
**Plik wejściowy:** załączony `Repozytorium(9).xlsx`  
**Zakres analizy:** dodanie zakładek `Uszkodzenia Pojazdów` i `Eksplozje Pojazdów`, ich powiązanie z checkboxem pojazdów, widoczność admin/użytkownik, style, szerokości kolumn oraz aktualizacja dokumentacji.

---

## 1. Podsumowanie decyzji wdrożeniowych

Do modułu należy dodać dwie nowe zakładki:

1. `Uszkodzenia Pojazdów`
2. `Eksplozje Pojazdów`

Obie zakładki powinny należeć do grupy pojazdów, czyli powinny być sterowane checkboxem:

```text
Czy wyświetlić zakładki dotyczące pojazdów?
```

W praktyce oznacza to dodanie obu nazw do `VEHICLE_SHEETS` w `DataVault/app.js`.

Dodatkowo `Uszkodzenia Pojazdów` ma być widoczna wyłącznie w widoku admina. Oznacza to, że ta zakładka powinna być jednocześnie:

- zakładką pojazdową, aby reagowała na checkbox pojazdów;
- zakładką admin-only, aby nie pojawiała się w widoku użytkownika.

Rekomendowana konfiguracja:

```js
const ADMIN_ONLY_SHEETS = new Set([
  "Bestiariusz",
  "Trafienia Krytyczne",
  "Groza Osnowy",
  "Hordy",
  "Specjalne Bonusy Wrogów",
  "Notatki",
  "Uszkodzenia Pojazdów",
]);

const VEHICLE_SHEETS = new Set([
  "Uszkodzenia Pojazdów",
  "Eksplozje Pojazdów",
  "Role W Pojeździe",
  "Akcje Pojazdu",
  "Stany Pojazdów",
  "Cechy Pojazdów",
  "Pojazdy",
  "Bronie Pojazdów",
  "Ekwipunek Pojazdów",
]);
```

`Eksplozje Pojazdów` nie została opisana przez użytkownika jako zakładka admin-only. Rekomenduję więc pozostawić ją widoczną również w widoku użytkownika, ale tylko po zaznaczeniu checkboxa pojazdów. Jeżeli intencją jest ukrycie obu nowych zakładek przed użytkownikiem, wtedy `Eksplozje Pojazdów` należy dopisać także do `ADMIN_ONLY_SHEETS`.

---

## 2. Stan obecny kodu DataVault

### 2.1. Checkbox pojazdów już istnieje

W `DataVault/index.html` istnieje checkbox:

```html
<input type="checkbox" id="toggleVehicleTabs" />
<span class="checkboxLabel checkboxLabel--vehicle" data-i18n="toggleVehicleTabs">Czy wyświetlić zakładki dotyczące pojazdów?</span>
```

W `DataVault/app.js` istnieje już stan:

```js
showVehicleTabs: false
```

oraz obsługa checkboxa `toggleVehicleTabs`.

### 2.2. Grupa pojazdów już istnieje

Obecnie `VEHICLE_SHEETS` obejmuje siedem arkuszy:

```js
const VEHICLE_SHEETS = new Set([
  "Role W Pojeździe",
  "Akcje Pojazdu",
  "Stany Pojazdów",
  "Cechy Pojazdów",
  "Pojazdy",
  "Bronie Pojazdów",
  "Ekwipunek Pojazdów",
]);
```

Nowe arkusze wystarczy dopisać do tego zbioru.

### 2.3. Logika widoczności obsłuży przypadek admin-only + checkbox

Aktualny przepływ w `initUI()` najpierw tworzy `baseVisible` zależnie od `ADMIN_MODE`, a dopiero potem filtruje grupy checkboxów:

```js
const baseVisible = ADMIN_MODE ? available : available.filter(name => !ADMIN_ONLY_SHEETS.has(name));

visibleSheets = uiState.showVehicleTabs
  ? visibleSheets
  : visibleSheets.filter(name => !isVehicleSheet(name));
```

To oznacza, że zakładka obecna jednocześnie w `ADMIN_ONLY_SHEETS` i `VEHICLE_SHEETS` będzie zachowywać się dokładnie zgodnie z wymaganiem:

| Tryb | Checkbox pojazdów odznaczony | Checkbox pojazdów zaznaczony |
| --- | --- | --- |
| Użytkownik | zakładka ukryta | zakładka ukryta, bo admin-only |
| Admin | zakładka ukryta | zakładka widoczna |

### 2.4. Kolor i glow zakładek pojazdów są już gotowe

`app.js` dodaje klasę `tab--vehicle`, jeżeli `isVehicleSheet(name)` zwraca `true`.

W `DataVault/style.css` istnieją już reguły dla pojazdów:

```css
.tab.tab--vehicle{color:var(--steel); background:var(--steel-bg); border-color:rgba(174,183,194,.22)}
.tab.tab--vehicle:hover,
.tab.tab--vehicle:focus{color:var(--steel-bright); border-color:var(--steel-border); box-shadow:0 0 0 2px rgba(174,183,194,.10)}
.tab.tab--vehicle.active{color:var(--steel-bright); background:var(--steel-bg-active); border-color:var(--steel-border); box-shadow:0 0 0 2px rgba(174,183,194,.16), 0 0 18px var(--steel-glow)}
```

Po dopisaniu nowych nazw do `VEHICLE_SHEETS` obie zakładki automatycznie otrzymają stalowo-srebrny kolor i glow pozostałych zakładek pojazdów.

---

## 3. Analiza arkusza `Uszkodzenia Pojazdów`

### 3.1. Struktura danych z XLSX

Arkusz zawiera kolumny:

| Kolumna | Rola |
| --- | --- |
| `LP` | techniczna kolejność rekordów, niewidoczna w UI |
| `Rzut k66` | zakres rzutu, analogicznie do `Groza Osnowy` |
| `Efekt` | opis wyniku/uszkodzenia |

Liczba rekordów danych: **12**.

Zakres z danymi:

```text
A1:C13
```

### 3.2. Podobieństwo do `Groza Osnowy`

Wymaganie użytkownika mówi, aby wyrównanie i szerokości kolumn zastosować podobnie jak w zakładce `Groza Osnowy`.

Aktualne reguły CSS dla `Groza Osnowy` są następujące:

```css
.tableWrap table[data-sheet="Groza Osnowy"] th[data-col="Rzut k66"],
.tableWrap table[data-sheet="Groza Osnowy"] td[data-col="Rzut k66"]{min-width:6ch; text-align:center; white-space:nowrap}

.tableWrap table[data-sheet="Groza Osnowy"] th[data-col="Efekt"],
.tableWrap table[data-sheet="Groza Osnowy"] td[data-col="Efekt"]{min-width:56ch; text-align:left}
```

Rekomenduję skopiować tę logikę dla `Uszkodzenia Pojazdów`.

### 3.3. Rekomendowane reguły CSS

```css
.tableWrap table[data-sheet="Uszkodzenia Pojazdów"] th[data-col="Rzut k66"],
.tableWrap table[data-sheet="Uszkodzenia Pojazdów"] td[data-col="Rzut k66"]{
  min-width:6ch;
  text-align:center;
  white-space:nowrap;
}

.tableWrap table[data-sheet="Uszkodzenia Pojazdów"] th[data-col="Efekt"],
.tableWrap table[data-sheet="Uszkodzenia Pojazdów"] td[data-col="Efekt"]{
  min-width:56ch;
  text-align:left;
}
```

Nie trzeba dodawać reguł dla `LP`, ponieważ `LP` jest już kolumną techniczną ukrywaną systemowo przez `HIDDEN_COLUMNS`.

### 3.4. Uwaga merytoryczna do danych

W danych arkusza `Uszkodzenia Pojazdów` widać potencjalne nakładanie się zakresów `Rzut k66`:

```text
42-45  Dziura w pancerzu
44-51  Ogień
```

DataVault potraktuje te wartości jako zwykły tekst, więc nie jest to problem techniczny dla renderowania. Warto jednak sprawdzić, czy zakresy mają się nakładać, czy jeden z nich wymaga korekty w XLSX.

---

## 4. Analiza arkusza `Eksplozje Pojazdów`

### 4.1. Struktura danych z XLSX

Arkusz zawiera kolumny:

| Kolumna | Rola |
| --- | --- |
| `LP` | techniczna kolejność rekordów, niewidoczna w UI |
| `Rozmiar Pojazdu` | kategoria rozmiaru pojazdu |
| `Zasięg Rażenia` | promień / zasięg rażenia eksplozji |
| `Obrażenia` | obrażenia eksplozji |

Liczba rekordów danych: **4**.

Zakres z danymi:

```text
A1:D5
```

Dane:

| Rozmiar Pojazdu | Zasięg Rażenia | Obrażenia |
| --- | ---: | --- |
| Średni | 6 | 8 |
| Duży | 10 | 10 |
| Wielki | 20 | 10 + 2 DK |
| Ogromny | 30 | 10 + 4 DK |

### 4.2. Wymagania wyrównania

Użytkownik wskazał:

- `Rozmiar Pojazdu` ma być wyrównany do lewej;
- `Zasięg Rażenia` ma być wyrównany do środka;
- `Obrażenia` mają być wyrównane do środka.

### 4.3. Propozycja szerokości kolumn

Rekomendowane szerokości:

| Kolumna | Min-width | Wyrównanie | Łamanie |
| --- | --- | --- | --- |
| `Rozmiar Pojazdu` | `18ch` | lewo | standard |
| `Zasięg Rażenia` | `14ch` | środek | `nowrap` |
| `Obrażenia` | `14ch` | środek | `nowrap` |

Uzasadnienie:

- `18ch` dla `Rozmiar Pojazdu` mieści nagłówek i wartości typu `Ogromny`, nie rozpychając tabeli.
- `14ch` dla `Zasięg Rażenia` mieści dłuższy nagłówek oraz wartości liczbowe.
- `14ch` dla `Obrażenia` mieści wartości `10 + 4 DK` i podobne krótkie zapisy mechaniczne.
- `nowrap` przy kolumnach liczbowo-mechanicznych zapobiega łamaniu krótkich zapisów typu `10 + 4 DK`.

### 4.4. Rekomendowane reguły CSS

```css
.tableWrap table[data-sheet="Eksplozje Pojazdów"] th[data-col="Rozmiar Pojazdu"],
.tableWrap table[data-sheet="Eksplozje Pojazdów"] td[data-col="Rozmiar Pojazdu"]{
  min-width:18ch;
  text-align:left;
}

.tableWrap table[data-sheet="Eksplozje Pojazdów"] th[data-col="Zasięg Rażenia"],
.tableWrap table[data-sheet="Eksplozje Pojazdów"] td[data-col="Zasięg Rażenia"]{
  min-width:14ch;
  text-align:center;
  white-space:nowrap;
}

.tableWrap table[data-sheet="Eksplozje Pojazdów"] th[data-col="Obrażenia"],
.tableWrap table[data-sheet="Eksplozje Pojazdów"] td[data-col="Obrażenia"]{
  min-width:14ch;
  text-align:center;
  white-space:nowrap;
}
```

---

## 5. Wpływ na parser XLSX i generowanie danych

Nie trzeba zmieniać `xlsxCanonicalParser.js` dla tych dwóch arkuszy.

Powody:

1. Parser już czyta wszystkie arkusze z workbooka.
2. Parser zapisuje kolejność arkuszy do `_meta.sheetOrder`.
3. Parser wyprowadza kolejność kolumn do `_meta.columnOrder`.
4. Parser pomija `LP` w `columnOrder`.
5. `app.js` i tak traktuje `LP` jako kolumnę ukrytą przez `HIDDEN_COLUMNS`.
6. Nowe arkusze nie wymagają scalania `Cecha N` ani `Zasięg N`.

`buildDataJsonFromSheets(...)` również nie wymaga dedykowanej logiki dla tych arkuszy. Funkcja przejdzie po `rawSheets`, zachowa arkusze w `sheets`, a specjalne transformacje zastosuje tylko tam, gdzie już są potrzebne, np. `Bronie`, `Bronie Pojazdów`, `Pancerze`, `Pojazdy`.

---

## 6. Kolejność zakładek

W załączonym XLSX kolejność arkuszy w części końcowej jest następująca:

```text
Trafienia Krytyczne
Groza Osnowy
Skrót Zasad
Tryby Ognia
Kary do ST
Uszkodzenia Pojazdów
Eksplozje Pojazdów
Role W Pojeździe
Akcje Pojazdu
Stany Pojazdów
Cechy Pojazdów
Pojazdy
Bronie Pojazdów
Ekwipunek Pojazdów
```

Nie trzeba hardkodować tej kolejności w `app.js`, bo `getSheetOrder(...)` korzysta z `_meta.sheetOrder`, a `_meta.sheetOrder` pochodzi z XLSX.

Dopóki nowy `data.json` / `firebase-import.json` zostanie wygenerowany z aktualnego XLSX, kolejność zakładek powinna wynikać z workbooka.

---

## 7. Aktualizacja `Kolumny.md`

`Kolumny.md` wymaga aktualizacji, ponieważ obecnie sekcja pojazdowa opisuje siedem arkuszy pojazdów. Należy dodać dwa nowe arkusze.

Rekomendowane dopisanie w sekcji:

```md
### `Uszkodzenia Pojazdów`
- `Rzut k66`: min. `6ch`, tekst wyśrodkowany, bez zawijania.
- `Efekt`: min. `56ch`, tekst do lewej.

### `Eksplozje Pojazdów`
- `Rozmiar Pojazdu`: min. `18ch`, tekst do lewej.
- `Zasięg Rażenia`: min. `14ch`, tekst wyśrodkowany, bez zawijania.
- `Obrażenia`: min. `14ch`, tekst wyśrodkowany, bez zawijania.
```

Warto też zaktualizować nagłówek opisowy sekcji, aby obejmowała dziewięć arkuszy pojazdów, a nie tylko dotychczasowe siedem.

Dodatkowa uwaga do dokumentu:

```md
`Uszkodzenia Pojazdów` należy jednocześnie do grupy pojazdów i do zakładek admin-only, więc w widoku admina pojawia się dopiero po zaznaczeniu checkboxa pojazdów, a w widoku użytkownika nie pojawia się wcale.
```

---

## 8. Aktualizacja `DataVault/docs/Documentation.md`

Dokumentacja techniczna wymaga aktualizacji w co najmniej trzech miejscach.

### 8.1. Lista zakładek admin-only

Obecnie dokumentacja opisuje admin-only jako między innymi:

```text
Bestiariusz
Trafienia Krytyczne
Groza Osnowy
Hordy
Specjalne Bonusy Wrogów
Notatki
```

Należy dopisać:

```text
Uszkodzenia Pojazdów
```

Rekomendowana uwaga:

```md
`Uszkodzenia Pojazdów` jest zakładką admin-only i jednocześnie należy do grupy pojazdów, dlatego wymaga zarówno trybu `?admin=1`, jak i zaznaczonego checkboxa pojazdów.
```

### 8.2. Lista `VEHICLE_SHEETS`

W sekcji `### Pojazdy` należy zaktualizować listę z siedmiu do dziewięciu arkuszy:

```md
`VEHICLE_SHEETS` obejmuje:

- `Uszkodzenia Pojazdów`,
- `Eksplozje Pojazdów`,
- `Role W Pojeździe`,
- `Akcje Pojazdu`,
- `Stany Pojazdów`,
- `Cechy Pojazdów`,
- `Pojazdy`,
- `Bronie Pojazdów`,
- `Ekwipunek Pojazdów`.
```

### 8.3. Opis CSS arkuszy pojazdów

W części opisującej konfigurację CSS pojazdów należy dopisać:

```md
Dodatkowe tabele zasad pojazdów używają następujących reguł:

- `Uszkodzenia Pojazdów`: `Rzut k66` min. `6ch`, środek, bez zawijania; `Efekt` min. `56ch`, lewo.
- `Eksplozje Pojazdów`: `Rozmiar Pojazdu` min. `18ch`, lewo; `Zasięg Rażenia` min. `14ch`, środek, bez zawijania; `Obrażenia` min. `14ch`, środek, bez zawijania.
```

---

## 9. Pliki do zmiany

Minimalny zestaw plików do aktualizacji:

```text
DataVault/app.js
DataVault/style.css
Kolumny.md
DataVault/docs/Documentation.md
```

### 9.1. `DataVault/app.js`

Zmiany:

- dopisać `Uszkodzenia Pojazdów` do `ADMIN_ONLY_SHEETS`;
- dopisać `Uszkodzenia Pojazdów` i `Eksplozje Pojazdów` do `VEHICLE_SHEETS`;
- nie dodawać tych arkuszy do `COMBAT_RULES_SHEETS`, mimo że `Uszkodzenia Pojazdów` jest podobne układem do `Groza Osnowy`;
- nie dodawać tych arkuszy do `KEYWORD_SHEETS_COMMA_NEUTRAL`, bo nie mają kolumny `Słowa Kluczowe`.

### 9.2. `DataVault/style.css`

Zmiany:

- dodać reguły kolumn dla `Uszkodzenia Pojazdów`;
- dodać reguły kolumn dla `Eksplozje Pojazdów`;
- nie trzeba dodawać osobnych reguł koloru/glow zakładek, bo zapewnia to `tab--vehicle`.

### 9.3. `Kolumny.md`

Zmiany:

- dodać sekcje obu nowych arkuszy;
- opisać szerokości i wyrównania;
- zaznaczyć admin-only dla `Uszkodzenia Pojazdów`.

### 9.4. `DataVault/docs/Documentation.md`

Zmiany:

- uaktualnić listę `ADMIN_ONLY_SHEETS`;
- uaktualnić listę `VEHICLE_SHEETS`;
- dopisać opis reguł CSS dla nowych arkuszy.

---

## 10. Niepotrzebne zmiany

Nie rekomenduję zmian w poniższych obszarach:

### 10.1. `DataVault/index.html`

Checkbox pojazdów już istnieje. Nie trzeba dodawać nowego elementu UI.

### 10.2. Tłumaczenia UI

Klucz i18n `toggleVehicleTabs` już istnieje w PL i EN. Nowe nazwy arkuszy pochodzą z XLSX i nie są tłumaczone przez DataVault.

### 10.3. Resolver cech i popoverów

Nowe arkusze nie mają kolumn `Cechy`, `Słowa Kluczowe`, `Stany` ani specjalnych odwołań wymagających resolvera. Nie trzeba dopisywać nowych źródeł tooltipów.

### 10.4. Parser XLSX

Nowe arkusze mają prostą strukturę. Nie wymagają scalania kolumn ani specjalnej normalizacji.

---

## 11. Plan testów po wdrożeniu

### 11.1. Test danych

1. Uruchomić `DataVault/index.html?admin=1`.
2. Wygenerować dane z aktualnego `Repozytorium.xlsx`.
3. Sprawdzić, czy w wygenerowanym `data.json` istnieją arkusze:
   - `Uszkodzenia Pojazdów`,
   - `Eksplozje Pojazdów`.
4. Sprawdzić, czy `_meta.sheetOrder` zawiera oba nowe arkusze w kolejności z XLSX.
5. Sprawdzić, czy `_meta.columnOrder` dla nowych arkuszy nie zawiera `LP`.

### 11.2. Test widoku admina

1. Wejść w `DataVault/index.html?admin=1`.
2. Upewnić się, że przy odznaczonym checkboxie pojazdów nowe zakładki są ukryte.
3. Zaznaczyć checkbox pojazdów.
4. Sprawdzić, czy widoczne są:
   - `Uszkodzenia Pojazdów`,
   - `Eksplozje Pojazdów`,
   - pozostałe zakładki pojazdów.
5. Sprawdzić, czy obie nowe zakładki mają stalowo-srebrny kolor i aktywny glow.
6. Sprawdzić wyrównania i szerokości kolumn.
7. Sprawdzić, czy `LP` nie jest wyświetlane.

### 11.3. Test widoku użytkownika

1. Wejść w `DataVault/index.html` bez `?admin=1`.
2. Zaznaczyć checkbox pojazdów.
3. Sprawdzić, czy `Eksplozje Pojazdów` jest widoczne.
4. Sprawdzić, czy `Uszkodzenia Pojazdów` pozostaje ukryte.
5. Sprawdzić, czy pozostałe nie-adminowe zakładki pojazdów działają jak dotąd.

Jeżeli finalna decyzja będzie taka, że `Eksplozje Pojazdów` też ma być admin-only, wtedy punkt 3 powinien zostać odwrócony: zakładka nie powinna być widoczna w widoku użytkownika.

### 11.4. Test stanu sesji

1. Zaznaczyć checkbox pojazdów.
2. Wejść w jedną z nowych zakładek.
3. Odświeżyć stronę.
4. Sprawdzić, czy checkbox i zakładki odtwarzają się z `sessionStorage`.
5. Odznaczyć checkbox, będąc na zakładce pojazdowej.
6. Sprawdzić, czy aplikacja wybiera bezpieczną zakładkę fallback.

---

## 12. Ryzyka i uwagi

### 12.1. Potencjalna niespójność danych `Rzut k66`

W arkuszu `Uszkodzenia Pojazdów` do sprawdzenia jest potencjalne nakładanie się zakresów `42-45` i `44-51`. Technicznie UI działa bez problemu, ale merytorycznie tabela k66 zwykle powinna mieć jednoznaczne zakresy.

### 12.2. Zakładka jednocześnie pojazdowa i admin-only

`Uszkodzenia Pojazdów` będzie pierwszą zakładką, która należy do grupy pojazdów i jednocześnie jest admin-only. Obecna logika aplikacji to obsługuje, ale warto jasno opisać ten przypadek w dokumentacji, żeby później nie uznać tego za błąd.

### 12.3. Firebase musi dostać nowe dane

Zmiana kodu nie wystarczy, jeśli prywatna baza Firebase nadal zawiera stary `dataJson`. Po wdrożeniu należy wygenerować nowy `firebase-import.json` z aktualnego XLSX i zaimportować go do Firebase Realtime Database pod root zgodnie z obecnym procesem DataVault.

---

## 13. Rekomendowana kolejność wdrożenia

1. Zaktualizować `DataVault/app.js`.
2. Zaktualizować `DataVault/style.css`.
3. Zaktualizować `Kolumny.md`.
4. Zaktualizować `DataVault/docs/Documentation.md`.
5. Wygenerować nowe pliki danych z załączonego XLSX w trybie admina.
6. Zaimportować nowy `firebase-import.json` do Firebase.
7. Wykonać testy z sekcji 11.

---

## 14. Konkluzja

Rozbudowa jest niewielka i dobrze pasuje do obecnej architektury DataVault. Najważniejsze jest dopisanie dwóch nazw arkuszy do `VEHICLE_SHEETS`, dopisanie `Uszkodzenia Pojazdów` do `ADMIN_ONLY_SHEETS` oraz dodanie kilku reguł CSS kolumn.

Nie trzeba przebudowywać parsera XLSX, modelu danych, resolverów popoverów ani HTML panelu filtrów. Największą uwagę warto zwrócić na poprawne udokumentowanie nietypowej kombinacji: `Uszkodzenia Pojazdów` jest zakładką pojazdową, ale widoczną wyłącznie w adminie.

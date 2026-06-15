# Analiza — dopasowanie koloru checkboxa `Czy wyświetlić zdezaktualizowane wpisy?` w GeneratorNPC do DataVault

**Repozytorium:** `CuteLittleGoat/WrathAndGlory`  
**Moduł docelowy:** `GeneratorNPC`  
**Plik do zmiany:** `GeneratorNPC/style.css`  
**Zakres:** wyłącznie styl checkboxa `Czy wyświetlić zdezaktualizowane wpisy?` w module `GeneratorNPC`.

---

## 1. Cel zmiany

W module `GeneratorNPC` checkbox:

```text
Czy wyświetlić zdezaktualizowane wpisy?
```

ma wyglądać tak samo kolorystycznie jak analogiczny checkbox w module `DataVault`.

Zmiana dotyczy dwóch elementów:

1. koloru napisu przy checkboxie;
2. koloru samej ikonki checkboxa.

Nie należy zmieniać logiki działania checkboxa, filtrowania rekordów `old`, listy `Bestiariusz · Nazwa`, ani danych w `state.bestiary`.

---

## 2. Obecny stan w GeneratorNPC

W `GeneratorNPC/index.html` checkbox jest zbudowany jako:

```html
<label class="checkbox-line bestiary-show-old-toggle" for="bestiary-show-old">
  <input type="checkbox" id="bestiary-show-old" />
  <span data-i18n="bestiaryShowOldToggle">Czy wyświetlić zdezaktualizowane wpisy?</span>
</label>
```

W `GeneratorNPC/style.css` istnieje obecnie styl:

```css
.bestiary-show-old-toggle {
  margin-top: 10px;
  color: var(--text2);
}
```

oraz ogólny styl dla checkboxów:

```css
.checkbox input,
.checkbox-line input {
  margin-top: 2px;
}
```

Problem: styl ustawia kolor kontenera, ale nie ustawia osobno koloru tekstu w `span` ani `accent-color` dla inputa. W efekcie ikonka checkboxa może przyjmować domyślny kolor przeglądarki, na przykład niebieski.

---

## 3. Wzorzec z DataVault

W module `DataVault` analogiczny checkbox używa układu:

```html
<label class="checkboxRow checkboxRow--bestiaryOld" id="toggleBestiaryOldGroup" hidden>
  <input type="checkbox" id="toggleOldBestiaryEntries" />
  <span class="checkboxLabel" data-i18n="toggleOldBestiaryEntries">Czy wyświetlić zdezaktualizowane wpisy?</span>
</label>
```

Jego styl jest określony przez reguły:

```css
.checkboxRow .checkboxLabel {
  color: var(--code);
  opacity: .9;
}

.checkboxRow input {
  width: 16px;
  height: 16px;
  accent-color: var(--accent);
  cursor: pointer;
}
```

To oznacza, że w `GeneratorNPC` należy użyć tych samych wartości kolorystycznych:

```css
color: var(--code);
opacity: 0.9;
accent-color: var(--accent);
```

---

## 4. Rekomendowana zmiana

W pliku:

```text
GeneratorNPC/style.css
```

pod istniejącym blokiem:

```css
.bestiary-show-old-toggle {
  margin-top: 10px;
  color: var(--text2);
}
```

należy dodać:

```css
.bestiary-show-old-toggle span {
  color: var(--code);
  opacity: 0.9;
}

#bestiary-show-old {
  accent-color: var(--accent);
}
```

---

## 5. Pełny fragment po zmianie

Docelowy fragment w `GeneratorNPC/style.css` powinien wyglądać tak:

```css
.bestiary-show-old-toggle {
  margin-top: 10px;
  color: var(--text2);
}

.bestiary-show-old-toggle span {
  color: var(--code);
  opacity: 0.9;
}

#bestiary-show-old {
  accent-color: var(--accent);
}
```

---

## 6. Uzasadnienie

Ta zmiana:

1. dopasowuje kolor tekstu checkboxa w `GeneratorNPC` do koloru tekstu checkboxa w `DataVault`;
2. dopasowuje kolor ikonki checkboxa do zielonego akcentu używanego w `DataVault`;
3. nie ingeruje w logikę JavaScript;
4. nie zmienia struktury HTML;
5. nie wpływa na filtrowanie rekordów `old`;
6. nie wpływa na kolorowanie rekordów `old` w selectcie `Bestiariusz · Nazwa`;
7. nie wpływa na klasę `bestiary-select-old`;
8. nie zmienia działania pozostałych checkboxów w module `GeneratorNPC`.

---

## 7. Kryteria akceptacji

Zmiana jest poprawna, jeśli po wdrożeniu:

1. napis `Czy wyświetlić zdezaktualizowane wpisy?` w `GeneratorNPC` ma taki sam kolor jak analogiczny napis w `DataVault`;
2. zaznaczona ikonka checkboxa w `GeneratorNPC` ma zielony kolor `var(--accent)`, tak jak w `DataVault`;
3. checkbox nadal działa jak wcześniej;
4. rekordy `old` nadal są domyślnie ukryte;
5. po zaznaczeniu checkboxa rekordy `old` nadal pojawiają się na liście;
6. po odznaczeniu checkboxa rekordy `old` nadal są ukrywane;
7. pozostałe checkboxy w `GeneratorNPC` nie zmieniają wyglądu przez tę poprawkę.

---

## 8. Zakres bez zmian

Nie należy zmieniać:

```text
GeneratorNPC/index.html
```

Nie należy zmieniać:

```text
GeneratorNPC/app.js
```

Nie należy zmieniać:

```text
DataVault/index.html
DataVault/style.css
DataVault/app.js
```

Zmiana powinna ograniczyć się do dopisania dwóch małych reguł CSS w:

```text
GeneratorNPC/style.css
```

# Analiza poprawki — wpisy `old` w DataVault / Bestiariusz bez pochylenia fontu

**Repozytorium:** `CuteLittleGoat/WrathAndGlory`  
**Moduł:** `DataVault`  
**Zakres zmiany:** usunięcie pochylenia fontu z wpisów `old` w zakładce `Bestiariusz`, przy zachowaniu istniejącego oznaczenia kolorem archiwalnym.

---

## 1. Kontekst

W module `DataVault` działa już mechanizm obsługi zdezaktualizowanych wpisów w zakładce `Bestiariusz`.

Obecne zachowanie:

1. checkbox `Czy wyświetlić zdezaktualizowane wpisy?` jest widoczny tylko w trybie admina;
2. checkbox jest domyślnie odznaczony;
3. wpisy z `Stan = old` są domyślnie ukryte;
4. po zaznaczeniu checkboxa wpisy `old` pojawiają się w tabeli;
5. kolumny techniczne `LP` i `Stan` pozostają ukryte;
6. stare wpisy są oznaczane wizualnie tylko w kolumnach `Nazwa` i `Typ`.

Problem dotyczy wyłącznie sposobu oznaczania wizualnego wpisów `old`.

---

## 2. Obecny problem

Wpisy `old` w zakładce `Bestiariusz`, po pokazaniu ich przez checkbox admina, wyświetlają wartości w kolumnach `Nazwa` i `Typ` pochylonym fontem.

Na zrzucie widać przykładowo wpisy:

- `Orkowie` / `Chopak`
- `Orkowie` / `Komandoz`

Ich nazwa i typ są obecnie zapisane kursywą.

Użytkownik chce, aby wpisy z `old` **nie wyświetlały się pochylonym fontem**.

---

## 3. Przyczyna techniczna

Przyczyną jest reguła CSS w pliku:

```text
DataVault/style.css
```

Obecny fragment:

```css
/* W Bestiariuszu tylko pola Nazwa i Typ starego wpisu dostają wyróżnienie / In Bestiary only Name and Type of an old entry receive highlighting */
.dataTable tbody tr.row-old--bestiary td.bestiary-old-identity,
.dataTable tbody tr.row-old--bestiary td.bestiary-old-identity .celltext,
.dataTable tbody tr.row-old--bestiary td.bestiary-old-identity .keyword-comma,
.dataTable tbody tr.row-old--bestiary td.bestiary-old-identity .ref,
.dataTable tbody tr.row-old--bestiary td.bestiary-old-identity .caretref,
.dataTable tbody tr.row-old--bestiary td.bestiary-old-identity .slash{
  color:var(--text-old);
  font-style:italic;
}
```

To właśnie deklaracja:

```css
font-style:italic;
```

powoduje pochylenie tekstu w kolumnach `Nazwa` i `Typ`.

---

## 4. Rekomendowana zmiana

Należy usunąć `font-style:italic;` z reguły odpowiedzialnej za stylowanie wpisów `old` w Bestiariuszu.

Nowy fragment powinien wyglądać tak:

```css
/* W Bestiariuszu tylko pola Nazwa i Typ starego wpisu dostają wyróżnienie / In Bestiary only Name and Type of an old entry receive highlighting */
.dataTable tbody tr.row-old--bestiary td.bestiary-old-identity,
.dataTable tbody tr.row-old--bestiary td.bestiary-old-identity .celltext,
.dataTable tbody tr.row-old--bestiary td.bestiary-old-identity .keyword-comma,
.dataTable tbody tr.row-old--bestiary td.bestiary-old-identity .ref,
.dataTable tbody tr.row-old--bestiary td.bestiary-old-identity .caretref,
.dataTable tbody tr.row-old--bestiary td.bestiary-old-identity .slash{
  color:var(--text-old);
}
```

---

## 5. Efekt po zmianie

Po zmianie:

1. wpisy `old` nadal będą domyślnie ukryte;
2. checkbox admina nadal będzie działał bez zmian;
3. po zaznaczeniu checkboxa wpisy `old` nadal będą widoczne;
4. kolumny `Nazwa` i `Typ` nadal będą oznaczone kolorem archiwalnym `var(--text-old)`;
5. tekst w kolumnach `Nazwa` i `Typ` nie będzie już pochylony;
6. pozostałe komórki wiersza nie zostaną objęte stylem archiwalnym;
7. kolumny `LP` i `Stan` pozostaną ukryte.

---

## 6. Zakres zmian w plikach

Do zmiany potrzebny jest tylko jeden plik:

```text
DataVault/style.css
```

Nie trzeba zmieniać:

```text
DataVault/index.html
DataVault/app.js
DataVault/data.json
DataVault/firebase-import.json
```

Logika filtrowania, checkbox admina, rozpoznawanie `Stan = old` oraz ukrywanie kolumn technicznych działają już poprawnie.

---

## 7. Uwaga o innych źródłach kursywy

Ta poprawka usuwa kursywę wynikającą z klasy starego wpisu Bestiariusza.

Jeżeli jakiś konkretny tekst wewnątrz komórki nadal będzie pochylony, przyczyną może być osobne formatowanie treści, na przykład marker obsługiwany przez klasę:

```css
.inline-italic
```

Tego nie należy usuwać w ramach tej poprawki, ponieważ byłoby to niezależne formatowanie treści, a nie styl wpisu `old`.

---

## 8. Test po wdrożeniu

Po zapisaniu zmiany należy sprawdzić:

1. Otworzyć `DataVault` w trybie admina.
2. Wejść do zakładki `Bestiariusz`.
3. Upewnić się, że checkbox `Czy wyświetlić zdezaktualizowane wpisy?` jest domyślnie odznaczony.
4. Zaznaczyć checkbox.
5. Sprawdzić, że wpisy `old` są widoczne.
6. Sprawdzić, że `Nazwa` i `Typ` mają kolor archiwalny.
7. Sprawdzić, że `Nazwa` i `Typ` nie są pochylone.
8. Sprawdzić, że pozostałe komórki wiersza nie zostały przypadkowo objęte stylem archiwalnym.
9. Odznaczyć checkbox i potwierdzić, że wpisy `old` znów znikają.

---

## 9. Podsumowanie

Problem nie wymaga zmian w JavaScripcie ani HTML.

Wystarczy usunąć jedną deklarację CSS:

```css
font-style:italic;
```

z reguły stylującej:

```css
.dataTable tbody tr.row-old--bestiary td.bestiary-old-identity
```

Dzięki temu wpisy `old` w Bestiariuszu pozostaną oznaczone kolorem archiwalnym, ale nie będą już wyświetlane pochylonym fontem.

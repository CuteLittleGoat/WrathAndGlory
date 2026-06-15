# Analiza i propozycja rozbudowy — oznaczanie rekordów `old` na liście Bestiariusza w GeneratorNPC

**Repozytorium:** `CuteLittleGoat/WrathAndGlory`
**Moduł:** `GeneratorNPC`
**Główne pliki:** `GeneratorNPC/index.html`, `GeneratorNPC/style.css`
**Proponowany plik analizy:** `Analizy/Rozbudowa_GeneratorNPC_Old_Select.md`
**Zakres:** rozbudowa listy rozwijanej `Bestiariusz · Nazwa` tak, aby rekordy z wartością `old` w kolumnie `Stan` były oznaczone wizualnie już na etapie wyboru rekordu.
**Status:** analiza wykonalności i propozycja wdrożenia.

---

## 1. Cel zadania

Celem zadania jest rozbudowa modułu `GeneratorNPC`, aby rekordy bestiariusza oznaczone w danych jako stare/archiwalne były widoczne już na liście wyboru bazowego.

Obecnie użytkownik widzi oznaczenie starego rekordu dopiero po jego wybraniu, w sekcji:

```text
Podgląd bazowy
```

Dla rekordu z wartością:

```text
Stan = old
```

komórki `LP`, `Typ` i `Nazwa` są wyświetlane szarym kolorem. To zachowanie jest prawidłowe i powinno zostać zachowane.

Nowa funkcjonalność ma rozszerzyć ten mechanizm tak, aby ten sam stan był widoczny wcześniej, bez konieczności wybierania rekordu z listy.

---

## 2. Obecny stan

### 2.1. Lista wyboru bazowego

W panelu bocznym `Wybór bazowy` znajduje się pole:

```text
Bestiariusz · Nazwa
```

Technicznie jest to natywny element HTML:

```html
<select id="bestiary">
```

Lista jest uzupełniana dynamicznie po wczytaniu danych z prywatnego DataVault.

---

### 2.2. Źródło danych

GeneratorNPC pobiera dane z prywatnego DataVault przez Firebase.

Dane bestiariusza są wczytywane z arkusza:

```text
Bestiariusz
```

i trafiają do:

```js
state.bestiary
```

Moduł używa obecnie dokładnych nazw arkuszy DataVault. Ta zasada powinna zostać zachowana.

Nie należy przy tej zmianie przebudowywać źródła danych, struktury DataVault ani logiki importu danych.

---

### 2.3. Rozpoznawanie rekordów `old`

W kodzie istnieje już helper rozpoznający stare rekordy bestiariusza:

```js
const isOldBestiaryRecord = (record) =>
  normalizeText(getRecordValueByLabels(record, ["Stan", "stan"])).toLowerCase() === "old";
```

Oznacza to, że nie trzeba projektować nowego mechanizmu rozpoznawania statusu rekordu.

Należy wykorzystać istniejącą funkcję.

---

### 2.4. Obecne szare oznaczenie w Podglądzie bazowym

Dla rekordu `old` obecna logika dodaje klasę:

```css
.bestiary-old-key
```

do wybranych pól:

```text
LP
Typ
Nazwa
```

Klasa korzysta z istniejącej zmiennej CSS:

```css
--text-old
```

oraz reguły:

```css
.bestiary-old-key {
  color: var(--text-old);
}
```

To zachowanie powinno pozostać bez zmian.

---

## 3. Wniosek z analizy

Rozbudowa jest możliwa bez dużej przebudowy.

Najprostszy wariant wymaga zmian tylko w:

```text
GeneratorNPC/index.html
GeneratorNPC/style.css
```

Nie jest potrzebna zmiana:

* struktury danych;
* Firebase;
* DataVault;
* importera XLSX;
* plików JSON;
* sposobu sortowania bestiariusza;
* logiki generowania karty NPC;
* obecnego działania sekcji `Podgląd bazowy`.

---

## 4. Ważne ograniczenie techniczne

Lista `Bestiariusz · Nazwa` jest natywnym elementem HTML `<select>`.

Stylowanie elementów `<option>` jest możliwe, ale ma ograniczenia zależne od przeglądarki i systemu operacyjnego.

Oznacza to, że:

* kolor tekstu opcji powinien działać w większości typowych sytuacji;
* przeglądarka może nadpisywać kolory podczas hover, focus lub podświetlenia aktywnej opcji;
* wygląd listy może nie być identyczny w każdej przeglądarce;
* nie należy oczekiwać pełnej kontroli wizualnej takiej jak przy własnym komponencie dropdown.

To ograniczenie nie blokuje zadania, jeżeli celem jest proste oznaczenie rekordów `old` innym kolorem.

---

## 5. Rekomendowany wariant wdrożenia

Rekomendowany jest wariant lekki:

```text
Natywny select + klasa CSS dodawana do option dla rekordów old.
```

Ten wariant jest wystarczający dla obecnego celu i nie wymaga przebudowy UI.

---

## 6. Proponowana implementacja

### 6.1. Rozszerzenie funkcji `setSelectOptions`

Obecna funkcja `setSelectOptions` tworzy opcje dla list wyboru.

Należy rozszerzyć ją o opcjonalny parametr pozwalający nadać klasę CSS pojedynczej opcji.

Proponowany kierunek:

```js
const setSelectOptions = (
  select,
  items,
  placeholder,
  { disableOption, disabledTitle, optionClass } = {}
) => {
  select.innerHTML = "";

  if (!items.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = translations[currentLanguage].messages.noDataOption;
    option.disabled = true;
    option.selected = true;
    select.append(option);
    select.disabled = true;
    return;
  }

  if (!select.multiple) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = placeholder;
    option.disabled = true;
    option.selected = true;
    select.append(option);
  } else if (placeholder) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = placeholder;
    option.disabled = true;
    select.append(option);
  }

  items.forEach((record, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = getRecordName(record, index);

    const className = optionClass?.(record, index);
    if (className) {
      option.classList.add(className);
    }

    if (disableOption?.(record, index)) {
      option.disabled = true;
      option.title = disabledTitle || "";
    }

    select.append(option);
  });

  select.disabled = false;
};
```

Zmiana jest wstecznie zgodna, ponieważ:

* istniejące wywołania bez `optionClass` zachowują obecne działanie;
* obecny mechanizm `disableOption` dla pancerzy pozostaje bez zmian;
* funkcja nadal obsługuje zarówno zwykłe listy, jak i listy `multiple`.

---

### 6.2. Zmiana wywołania dla bestiariusza

Obecne wywołanie:

```js
setSelectOptions(bestiarySelect, state.bestiary, translations[currentLanguage].messages.selectBestiary);
```

należy zastąpić wersją z `optionClass`:

```js
setSelectOptions(bestiarySelect, state.bestiary, translations[currentLanguage].messages.selectBestiary, {
  optionClass: (record) => isOldBestiaryRecord(record) ? "bestiary-option-old" : ""
});
```

Dzięki temu tylko opcje na liście bestiariusza dostaną specjalną klasę.

Pozostałe listy, takie jak broń, pancerze, talenty, psionika i modlitwy, pozostaną bez zmian.

---

### 6.3. Dodanie stylu CSS

Do `GeneratorNPC/style.css` należy dodać klasę:

```css
#bestiary option.bestiary-option-old {
  color: var(--text-old);
}
```

Rekomendowane miejsce: okolice istniejącej klasy:

```css
.bestiary-old-key {
  color: var(--text-old);
}
```

Można też dodać komentarz opisujący przeznaczenie klasy:

```css
/* Rekordy archiwalne w natywnej liście wyboru Bestiariusza. */
#bestiary option.bestiary-option-old {
  color: var(--text-old);
}
```

---

## 7. Alternatywny wariant — własny dropdown

Jeżeli w przyszłości potrzebna będzie pełna kontrola wyglądu listy, można zastąpić natywny `<select>` własnym komponentem typu combobox/listbox.

Taki wariant umożliwiłby:

* pełne stylowanie rekordów `old`;
* dodanie etykiety `[OLD]`;
* dodanie przekreślenia;
* dodanie ikonki;
* osobne tło dla rekordów archiwalnych;
* jednolity wygląd we wszystkich przeglądarkach;
* lepsze wyszukiwanie po nazwie;
* grupowanie rekordów według typu lub stanu.

Ten wariant oznacza jednak większą przebudowę.

Wymagałby obsługi:

* otwierania i zamykania listy;
* nawigacji klawiaturą;
* focusu;
* dostępności ARIA;
* synchronizacji wartości z `state.selectedBestiaryIndex`;
* resetu;
* ulubionych;
* możliwych przyszłych tłumaczeń;
* zachowania na urządzeniach mobilnych.

Na potrzeby obecnego zadania ten wariant nie jest rekomendowany.

---

## 8. Proponowane nazewnictwo

### 8.1. Klasa CSS dla opcji

```text
bestiary-option-old
```

Uzasadnienie:

* nazwa jest specyficzna dla bestiariusza;
* nie koliduje z istniejącą klasą `bestiary-old-key`;
* jasno wskazuje, że dotyczy elementu listy wyboru, nie tabeli.

---

### 8.2. Opcjonalny parametr funkcji

```text
optionClass
```

Uzasadnienie:

* jest neutralny i może być użyty w przyszłości przez inne listy;
* nie wymusza logiki specyficznej dla bestiariusza wewnątrz `setSelectOptions`;
* zachowuje separację odpowiedzialności.

---

## 9. Zakres zmian

### 9.1. `GeneratorNPC/index.html`

Wymagane zmiany:

1. Rozszerzyć sygnaturę `setSelectOptions` o `optionClass`.
2. Podczas tworzenia każdej opcji wywołać `optionClass?.(record, index)`.
3. Jeżeli callback zwróci nazwę klasy, dodać ją do elementu `<option>`.
4. Zmienić wywołanie `setSelectOptions` dla `bestiarySelect`, aby rekordy `old` dostawały klasę `bestiary-option-old`.

---

### 9.2. `GeneratorNPC/style.css`

Wymagane zmiany:

1. Dodać regułę CSS dla:

```css
#bestiary option.bestiary-option-old
```

2. Użyć istniejącej zmiennej:

```css
var(--text-old)
```

---

### 9.3. Dokumentacja

Opcjonalnie warto uzupełnić:

```text
GeneratorNPC/docs/Documentation.md
```

o krótką informację, że:

* rekordy `old` są oznaczane w Podglądzie bazowym;
* rekordy `old` są dodatkowo oznaczane kolorem na liście `Bestiariusz · Nazwa`;
* oznaczenie listy jest zależne od możliwości stylowania natywnego `<select>` przez przeglądarkę.

---

## 10. Czego nie zmieniać

W ramach tej rozbudowy nie należy zmieniać:

* struktury arkusza `Bestiariusz`;
* wartości w kolumnie `Stan`;
* sposobu rozpoznawania `old`;
* sortowania rekordów bestiariusza;
* logiki `Podglądu bazowego`;
* mechanizmu ulubionych;
* generowania karty NPC;
* źródła danych Firebase/DataVault;
* nazw arkuszy wymaganych przez GeneratorNPC;
* logiki modułów broni, pancerzy, ekwipunku, talentów, psioniki i modlitw.

---

## 11. Kryteria akceptacji

Zmiana jest poprawna, jeżeli spełnione są poniższe warunki.

### 11.1. Lista Bestiariusza

* Rekordy z `Stan = old` mają inny kolor tekstu na liście `Bestiariusz · Nazwa`.
* Rekordy bez `Stan = old` zachowują dotychczasowy kolor.
* Placeholder listy nie jest oznaczony jako `old`.
* Kolejność rekordów na liście nie zmienia się.
* Wartości `option.value` nadal odpowiadają indeksom rekordów w `state.bestiary`.

---

### 11.2. Podgląd bazowy

* Po wybraniu rekordu `old` pola `LP`, `Typ` i `Nazwa` nadal są szare.
* Kolumna `Stan` nadal nie jest wyświetlana w tabeli.
* Edytowalne pola liczbowe nadal działają jak wcześniej.
* Edycja `Umiejętności` i `Słowa Kluczowe` nadal działa jak wcześniej.

---

### 11.3. Pozostałe listy

* Lista pancerzy nadal blokuje rekordy z niedozwolonym WP zgodnie z obecną logiką.
* Listy broni, augumentacji, ekwipunku, talentów, psioniki i modlitw działają bez zmian.
* Wielokrotne listy wyboru nadal obsługują placeholdery i zaznaczenia jak wcześniej.

---

### 11.4. Ulubione

* Zapisanie ulubionego profilu nadal zapisuje `selectedBestiaryIndex`.
* Wczytanie ulubionego profilu nadal wybiera właściwy rekord.
* Oznaczenie kolorem na liście nie wpływa na zapis ani odczyt ulubionych.

---

### 11.5. Reset

* Przycisk `Reset` nadal czyści wybór bazowy i ustawienia modułów.
* Po ponownym załadowaniu danych klasy opcji są odtwarzane zgodnie z aktualnymi danymi.

---

## 12. Testy ręczne

Po wdrożeniu należy wykonać następujące testy.

### 12.1. Test rekordu aktywnego

1. Otworzyć `GeneratorNPC`.
2. Poczekać na załadowanie prywatnych danych.
3. Rozwinąć listę `Bestiariusz · Nazwa`.
4. Sprawdzić rekordy, które w DataVault mają `Stan = old`.
5. Potwierdzić, że są wyświetlane kolorem `--text-old`.
6. Wybrać taki rekord.
7. Potwierdzić, że w `Podglądzie bazowym` pola `LP`, `Typ` i `Nazwa` są szare.

---

### 12.2. Test rekordu zwykłego

1. Rozwinąć listę `Bestiariusz · Nazwa`.
2. Wybrać rekord bez `Stan = old`.
3. Potwierdzić, że jego nazwa na liście ma zwykły kolor.
4. Potwierdzić, że `LP`, `Typ` i `Nazwa` w `Podglądzie bazowym` nie są szare.

---

### 12.3. Test regresji pancerzy

1. Rozwinąć listę pancerzy.
2. Sprawdzić, czy dotychczas blokowane opcje nadal są zablokowane.
3. Potwierdzić, że dodanie `optionClass` nie uszkodziło mechanizmu `disableOption`.

---

### 12.4. Test ulubionych

1. Wybrać rekord `old`.
2. Dodać konfigurację do ulubionych.
3. Odświeżyć stronę.
4. Wczytać ulubiony profil.
5. Potwierdzić, że właściwy rekord został wybrany.
6. Potwierdzić, że jego opcja nadal ma oznaczenie `old`.

---

### 12.5. Test przeglądarek

Ze względu na ograniczenia natywnego `<select>` warto sprawdzić przynajmniej:

* Firefox;
* Chrome;
* Edge.

Należy zwrócić uwagę, czy kolor jest widoczny:

* na zamkniętej liście po wybraniu rekordu;
* na rozwiniętej liście;
* podczas podświetlenia opcji.

Różnice w stanie hover/focus są akceptowalne, jeżeli normalny stan opcji nadal pozwala odróżnić rekord `old`.

---

## 13. Ryzyka

### 13.1. Ograniczenia natywnego `<select>`

Największym ryzykiem jest niepełna kontrola wyglądu `<option>` przez CSS.

Niektóre przeglądarki lub systemy mogą częściowo ignorować kolor opcji w określonych stanach.

Ryzyko jest akceptowalne dla lekkiego oznaczenia wizualnego.

---

### 13.2. Dostępność

Samo oznaczenie kolorem może być niewystarczające dla części użytkowników.

Jeżeli oznaczenie `old` ma mieć znaczenie krytyczne, w przyszłości warto rozważyć dodatkowe oznaczenie tekstowe, np.:

```text
Chopak [OLD]
```

Na tym etapie nie jest to rekomendowane jako domyślna zmiana, ponieważ zmieniłoby widoczne nazwy na liście.

---

### 13.3. Przyszłe sortowanie i filtrowanie

Jeżeli w przyszłości powstanie wyszukiwarka lub grupowanie rekordów bestiariusza, oznaczenie `old` powinno zostać zachowane jako właściwość rekordu, nie jako ręcznie dopisywany tekst.

Dlatego rekomendowane jest dodawanie klasy CSS na podstawie danych, a nie modyfikowanie samej nazwy rekordu.

---

## 14. Możliwa przyszła rozbudowa

W przyszłości można rozważyć dodatkowe opcje:

1. Przełącznik „Ukryj rekordy archiwalne”.
2. Przełącznik „Pokaż tylko rekordy archiwalne”.
3. Dopisek `[OLD]` przy nazwie rekordu.
4. Tooltip na opcji, np. `Rekord archiwalny`.
5. Osobną sekcję lub grupę `Archiwalne` na liście.
6. Własny komponent dropdown z wyszukiwaniem.

Te funkcje nie są częścią obecnego zakresu.

---

## 15. Rekomendacja końcowa

Rekomendowane jest wdrożenie lekkiego wariantu:

```text
optionClass w setSelectOptions + klasa bestiary-option-old + CSS color: var(--text-old)
```

Uzasadnienie:

* wykorzystuje istniejącą funkcję `isOldBestiaryRecord`;
* wykorzystuje istniejącą zmienną `--text-old`;
* nie zmienia danych;
* nie zmienia obecnego Podglądu bazowego;
* nie wymaga przebudowy UI;
* jest mało ryzykowne;
* zachowuje możliwość przyszłej rozbudowy.

Wdrożenie powinno być traktowane jako mała zmiana front-endowa w `GeneratorNPC`.

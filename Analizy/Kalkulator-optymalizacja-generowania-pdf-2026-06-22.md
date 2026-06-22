# Optymalizacja czasu generowania PDF — moduł Kalkulator

Data analizy: 2026-06-22  
Data wdrożenia: 2026-06-22  
Zakres: `Kalkulator/TworzeniePostaci_v2-pdf.js` oraz dokumentacja techniczna w `Analizy/`.

## 1. Status

Analiza została zakończona, a rekomendowane optymalizacje o najlepszej relacji zysku do ryzyka zostały wdrożone w pliku:

```text
Kalkulator/TworzeniePostaci_v2-pdf.js
```

Nie zmieniono:

- szablonu `Kalkulator/pdf/pl.pdf`,
- mapowania pól PDF,
- zasad obliczeń kalkulatora,
- struktury danych postaci,
- integracji Firebase,
- wyglądu interfejsu,
- sposobu aktualizacji wyglądu wypełnianych pól tekstowych,
- logiki checkboxów Spaczenia.

Commit wdrażający optymalizację kodu:

```text
c3109fa48a318efbd2b645f23eecd0a94455005c
```

## 2. Pierwotnie zidentyfikowane wąskie gardła

Przed wdrożeniem eksport wykonywał kolejno między innymi:

1. ładowanie `pdf-lib`,
2. ładowanie `fontkit`,
3. pobieranie `pl.pdf` z `cache: 'no-store'`,
4. ładowanie szablonu przez `PDFDocument.load()`,
5. ponowne pobieranie fontu Noto Sans,
6. osadzanie pełnego fontu z `subset: false`,
7. aktualizację wyglądu wielu pól formularza,
8. czyszczenie i aktualizację wyglądu pól, które następnie były usuwane,
9. wielokrotne pomiary tych samych fragmentów tekstu podczas szukania układu kolumn,
10. zapis dokumentu przez `pdfDoc.save()`.

Największy potencjalny koszt stanowiły operacje sieciowe, analiza i osadzanie pełnego fontu oraz serializacja wynikowego dokumentu.

## 3. Changelog wdrożenia

### 2026-06-22 — optymalizacja eksportu PDF

Zmodyfikowany plik:

```text
Kalkulator/TworzeniePostaci_v2-pdf.js
```

Wdrożono:

- cache bajtów szablonu `pl.pdf`,
- cache bajtów fontu Noto Sans,
- usunięcie `cache: 'no-store'`,
- równoległe ładowanie `pdf-lib` i `fontkit`,
- równoległe pobieranie zależności, szablonu i fontu,
- wstępne ładowanie zasobów po interakcji z przyciskiem eksportu,
- osadzanie fontu jako podzbioru przez `subset: true`,
- usuwanie pól formularza bez wcześniejszego generowania pustego wyglądu,
- cache pomiarów szerokości tekstu,
- wcześniejsze przerywanie nieudanych prób układu tekstu,
- pomiary czasu poszczególnych etapów generowania PDF w konsoli przeglądarki.

## 4. Dokładny opis zmian

### 4.1. Wspólna stała ścieżki szablonu

Dodano:

```js
const TEMPLATE_URL = './pdf/pl.pdf';
```

Ścieżka szablonu nie jest już powtarzana bezpośrednio w funkcji eksportu. Ułatwia to cache, obsługę błędów i późniejsze utrzymanie kodu.

### 4.2. Cache bajtów szablonu i fontu

Dodano fabrykę loaderów:

```js
const createArrayBufferLoader = (url, errorMessage) => {
  let promise = null;
  return async () => {
    if (!promise) {
      promise = fetch(url)
        .then(response => {
          if (!response.ok) throw new Error(errorMessage);
          return response.arrayBuffer();
        })
        .catch(error => {
          promise = null;
          throw error;
        });
    }
    return promise;
  };
};
```

Na jej podstawie utworzono:

```js
const loadTemplateBytes = createArrayBufferLoader(TEMPLATE_URL, ...);
const loadFontBytes = createArrayBufferLoader(FONT_URL, ...);
```

Działanie:

- pierwsze wywołanie pobiera zasób i zapisuje Promise,
- kolejne wywołania w tej samej karcie korzystają z tego samego wyniku,
- `ArrayBuffer` szablonu i fontu nie jest ponownie pobierany przy każdym eksporcie,
- jeżeli pobranie zakończy się błędem, Promise jest zerowany i następna próba może ponowić żądanie.

To oznacza, że drugi i kolejne eksporty w tej samej karcie nie powinny ponownie pobierać `pl.pdf` ani Noto Sans.

### 4.3. Usunięcie `cache: 'no-store'`

Usunięto wcześniejsze wywołanie:

```js
fetch('./pdf/pl.pdf', { cache: 'no-store' })
```

Szablon jest teraz pobierany zwykłym `fetch()`, dzięki czemu:

- przeglądarka może korzystać ze standardowego cache HTTP,
- dodatkowo działa cache `ArrayBuffer` w pamięci modułu,
- każde kliknięcie eksportu nie wymusza nowego żądania do serwera.

### 4.4. Równoległe ładowanie bibliotek

Wcześniej `pdf-lib` i `fontkit` były ładowane sekwencyjnie:

```js
if (!window.PDFLib) await loadScript(PDF_LIB_URL);
if (!window.fontkit) await loadScript(FONTKIT_URL);
```

Aktualnie brakujące biblioteki są zbierane do tablicy i ładowane równolegle:

```js
const pending = [];
if (!window.PDFLib) pending.push(loadScript(PDF_LIB_URL));
if (!window.fontkit) pending.push(loadScript(FONTKIT_URL));
if (pending.length) await Promise.all(pending);
```

Pierwszy eksport nie musi czekać na zakończenie pobierania jednej biblioteki, zanim rozpocznie pobieranie drugiej.

### 4.5. Równoległe pobieranie zależności i zasobów

Eksport uruchamia równocześnie:

- `ensureDependencies()`,
- `loadTemplateBytes()`,
- `loadFontBytes()`.

Kod czeka na wszystkie zadania przez `Promise.all()`.

Dzięki temu podczas pierwszego eksportu pobieranie bibliotek, szablonu i fontu może odbywać się jednocześnie, zamiast w pełni sekwencyjnie.

### 4.6. Wstępne ładowanie po interakcji z przyciskiem

Dodano funkcję:

```js
warmPdfExport()
```

Jest uruchamiana jednokrotnie po:

- `pointerenter`,
- `focus`,
- `touchstart`.

Zasoby mogą zacząć się ładować jeszcze przed właściwym kliknięciem przycisku eksportu.

Rozwiązanie nie pobiera zasobów automatycznie natychmiast po otwarciu strony. Wstępne ładowanie zaczyna się dopiero po interakcji użytkownika związanej z przyciskiem PDF.

### 4.7. Osadzanie podzbioru fontu

Zmieniono:

```js
{ subset: false }
```

na:

```js
{ subset: true }
```

Do dokumentu powinny trafiać tylko glify rzeczywiście użyte w wygenerowanym PDF, zamiast całego fontu Noto Sans.

Oczekiwane skutki:

- mniej danych przetwarzanych podczas osadzania fontu,
- krótszy zapis dokumentu,
- mniejszy wynikowy PDF,
- mniejsze zużycie pamięci podczas serializacji.

Pozostawiono aktualizację wyglądu osobno dla każdego wypełnianego pola:

```js
field.updateAppearances(font);
```

Nie przywrócono globalnego `form.updateFieldAppearances(font)`, ponieważ wcześniejsza dokumentacja projektu wskazuje na problemy WinAnsi przy takim podejściu.

### 4.8. Usuwanie pól bez generowania pustego wyglądu

Wcześniej `removeTextField()` wykonywało:

```js
field.setText('');
field.updateAppearances(font);
form.removeField(field);
```

Aktualnie funkcja wykonuje wyłącznie:

```js
form.removeField(form.getTextField(name));
```

Dotyczy to:

- ośmiu pól `Zdolności i talenty`,
- pola `Notatki 1`,
- pola `Przeszłość`.

Kod nie generuje już pustych strumieni wyglądu dla pól, które natychmiast potem są usuwane.

### 4.9. Cache pomiarów szerokości tekstu

Funkcja `wrap()` może otrzymać `widthCache`.

Klucz cache składa się z:

- rozmiaru fontu,
- mierzonego tekstu.

Przykład:

```js
const key = `${size}\u0000${value}`;
```

Jeżeli ten sam fragment tekstu jest mierzony ponownie dla tego samego rozmiaru fontu, wynik `font.widthOfTextAtSize()` jest pobierany z `Map`, zamiast obliczany od nowa.

Cache jest lokalny dla pojedynczego procesu dopasowania obszaru, dzięki czemu nie rośnie między kolejnymi eksportami.

### 4.10. Wcześniejsze przerwanie nieudanej próby układu

Dodano funkcję:

```js
wrapEntries(entries, font, size, width, widthCache, limit)
```

Podczas sprawdzania konkretnej liczby kolumn i rozmiaru fontu znana jest maksymalna pojemność obszaru.

Jeżeli liczba przygotowanych linii przekroczy tę pojemność, dalsze zawijanie pozostałych wpisów nie jest potrzebne dla tej próby. Algorytm przerywa ją wcześniej i przechodzi do kolejnego wariantu.

Nie zmieniono:

- kolejności wpisów,
- minimalnego i maksymalnego rozmiaru fontu,
- liczby dozwolonych kolumn,
- położenia obszarów na stronie,
- sposobu obcinania nadmiarowych linii w wariancie końcowym.

### 4.11. Pomiary czasu generowania

Dodano pomiary oparte o `performance.now()`, z awaryjnym użyciem `Date.now()`.

Po udanym eksporcie konsola przeglądarki otrzymuje wpis:

```text
[TworzeniePostaci_v2 PDF] Czasy generowania [ms]
```

Raport obejmuje:

| Pole | Znaczenie |
| --- | --- |
| `dependencies` | przygotowanie `pdf-lib` i `fontkit` |
| `assets` | uzyskanie bajtów szablonu i fontu |
| `loadTemplate` | `PDFDocument.load()` |
| `embedFont` | rejestracja i osadzenie Noto Sans |
| `populate` | wypełnianie pól, usuwanie pól i rysowanie obszarów |
| `save` | `pdfDoc.save()` |
| `total` | cały czas od rozpoczęcia eksportu do utworzenia wyniku |

Przy drugim eksporcie wartości `dependencies` i `assets` powinny być znacznie niższe, ponieważ Promise i bajty zasobów pozostają w pamięci.

## 5. Elementy celowo pozostawione bez zmian

### 5.1. Checkboxy

Nie ograniczono aktualizacji checkboxów tylko do zaznaczonych pól.

Powód:

- poprawność wymaga potwierdzenia stanu domyślnego każdego checkboxa w `pl.pdf`,
- zysk wydajnościowy byłby prawdopodobnie niewielki,
- pełne `check()` albo `uncheck()` gwarantuje jednoznaczny wynik każdego nowego dokumentu.

### 5.2. Globalna aktualizacja wyglądu formularza

Nie zastosowano:

```js
form.updateFieldAppearances(font)
```

Pozostawiono aktualizację per pole, aby nie przywrócić wcześniejszych błędów kodowania polskich znaków.

### 5.3. Lokalny font i lokalny `fontkit`

Nie przeniesiono zależności CDN do katalogu `vendor`.

Jest to osobne zagadnienie dotyczące pracy offline i niezależności od CDN. Aktualne wdrożenie przyspiesza ponowne użycie zasobów w tej samej karcie, ale pierwszy eksport nadal może zależeć od czasu odpowiedzi CDN.

### 5.4. Szablon PDF

Nie spłaszczono ani nie przebudowano `pl.pdf`. Nie zmieniono jego pól, grafiki ani zawartości.

## 6. Walidacja techniczna

Wykonano:

### 6.1. Kontrola składni JavaScript

```text
node --check Kalkulator/TworzeniePostaci_v2-pdf.js
```

Wynik:

```text
OK — brak błędów składni.
```

### 6.2. Test inicjalizacji i cache w środowisku mock

Uruchomiono skrypt z atrapami:

- `window`,
- `document`,
- przycisku eksportu,
- `fetch()`,
- dostępnych `PDFLib` i `fontkit`.

Sprawdzono:

- rejestrację listenerów `click`, `pointerenter`, `focus` i `touchstart`,
- jednokrotne pobranie dwóch zasobów podczas wielokrotnego wywołania rozgrzewania,
- działanie cache Promise.

Wynik:

```text
Mock initialization/cache test: OK
```

### 6.3. Weryfikacja pliku po zapisie do repozytorium

Po commicie ponownie odczytano plik z gałęzi `main` i potwierdzono obecność:

- `TEMPLATE_URL`,
- loaderów `ArrayBuffer`,
- `subset: true`,
- uproszczonego `removeTextField()`,
- cache szerokości tekstu,
- pomiarów czasu,
- listenerów rozgrzewających.

Blob SHA aktualnego pliku:

```text
7cc015845483718a00338ab2530a79a4bcace2c7
```

## 7. Testy wymagane w przeglądarce

W tym środowisku nie wykonano pełnego eksportu z rzeczywistym `pl.pdf`, `pdf-lib`, `fontkit` i podglądem przeglądarkowym. Przed uznaniem zmiany za w pełni zweryfikowaną wizualnie należy wykonać test ręczny.

Minimalny zestaw:

1. Otworzyć `TworzeniePostaci_v2.html` po `Ctrl+F5`.
2. Wygenerować PDF z danymi domyślnymi.
3. Sprawdzić polskie znaki, między innymi:
   - `Średni`,
   - `Zakon Żeński`,
   - `Czujność`,
   - `Umiejętności`,
   - `Przeszłość`,
   - `Ź`, `Ć`, `Ń`, `Ł`, `Ó`, `Ą`, `Ę`.
4. Sprawdzić wszystkie wartości atrybutów i sum umiejętności.
5. Sprawdzić checkboxy dla kilku wartości Spaczenia.
6. Sprawdzić jedną i dwie linie słów kluczowych.
7. Wygenerować dokument z dużą liczbą talentów i zasad.
8. Wygenerować drugi PDF bez odświeżania strony.
9. Porównać dane pierwszego i drugiego pliku, aby wykluczyć przenikanie danych.
10. Otworzyć konsolę i porównać raporty czasów pierwszego i drugiego eksportu.

Szczególnie ważny jest test `subset: true`, ponieważ jest to zmiana o największym potencjale wydajnościowym, ale również jedyna z wdrożonych zmian wymagająca pełnego sprawdzenia wyglądu wszystkich polskich znaków w rzeczywistym PDF.

## 8. Oczekiwany efekt wydajnościowy

### Pierwszy eksport

Powinien skorzystać z:

- równoległego ładowania bibliotek,
- równoległego pobierania szablonu i fontu,
- wcześniejszego rozpoczęcia ładowania po najechaniu, fokusie lub dotknięciu przycisku,
- mniejszego podzbioru fontu,
- mniejszej liczby zbędnych aktualizacji formularza,
- szybszego dopasowania długich sekcji tekstowych.

### Drugi i kolejne eksporty w tej samej karcie

Powinny dodatkowo skorzystać z:

- gotowych bibliotek,
- gotowego `ArrayBuffer` szablonu,
- gotowego `ArrayBuffer` fontu,
- braku kolejnych żądań o te zasoby.

Największa różnica pomiędzy pierwszym a kolejnym eksportem powinna być widoczna w polach:

```text
dependencies
assets
```

Największy wpływ `subset: true` powinien być widoczny przede wszystkim w:

```text
embedFont
save
```

## 9. Podsumowanie

Wdrożono wszystkie rekomendowane zmiany o niskim ryzyku oraz dwie kontrolowane optymalizacje algorytmiczne:

- cache zasobów,
- równoległość pobierania,
- interakcyjne rozgrzewanie eksportera,
- podzbiór fontu,
- usunięcie zbędnych aktualizacji pól,
- cache pomiarów tekstu,
- wcześniejsze odrzucanie niepasujących wariantów układu,
- diagnostykę czasów.

Nie zmieniono logiki danych ani mapowania PDF. Pełny test wizualny wygenerowanego dokumentu pozostaje wymagany w prawdziwej przeglądarce, przede wszystkim dla `subset: true` i polskich znaków.

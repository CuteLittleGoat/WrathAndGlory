# Eksport PDF — podgląd w przeglądarce zamiast wymuszonego pobrania

Data: 2026-06-19
Zakres: `Kalkulator/test.html`, eksport PL PDF.

---

## 1. Decyzja

Eksport PDF w wersji testowej ma nadal generować prawdziwy plik PDF na podstawie szablonu `pdf/pl.pdf`, ale domyślnie nie wymusza już pobrania pliku na dysk.

Zamiast tego PDF otwiera się w nowej karcie przeglądarki jako podgląd.

---

## 2. Powód

To rozwiązanie zachowuje dotychczasowy mechanizm mapowania pól PDF i osadzania fontu, ale poprawia wygodę testowania:

- karta postaci od razu otwiera się w przeglądarce,
- użytkownik nie musi za każdym razem usuwać pobranych plików,
- zapis pliku nadal jest możliwy ręcznie z poziomu przeglądarkowego podglądu PDF.

---

## 3. Implementacja

Przycisk `Eksportuj PDF` otwiera pustą kartę natychmiast po kliknięciu:

```js
const previewWindow = window.open('', '_blank');
```

Jest to ważne, ponieważ przeglądarki mogą blokować `window.open()`, jeżeli wywołanie nastąpi dopiero po zakończeniu operacji asynchronicznych.

Po wygenerowaniu PDF aplikacja tworzy obiekt `File` lub `Blob` i przekierowuje otwartą kartę na lokalny `blob:` URL:

```js
const pdfFile = window.File
  ? new File([out], fileName, { type: 'application/pdf' })
  : new Blob([out], { type: 'application/pdf' });

const url = URL.createObjectURL(pdfFile);
previewWindow.location.replace(url);
```

---

## 4. Nazwa pliku

Nazwa pliku nadal jest tworzona w formacie:

```text
PL-YYYY-MM-DD-HHmm.pdf
```

Przykład:

```text
PL-2026-06-19-1435.pdf
```

Uwaga: w podglądzie przeglądarkowym przeglądarka może różnie traktować nazwę pliku przy ręcznym zapisie z podglądu PDF. Obiekt `File` zwiększa szansę zachowania nazwy, ale nie daje pełnej gwarancji we wszystkich przeglądarkach.

---

## 5. Obsługa blokady popupów

Jeżeli przeglądarka zablokuje nowe okno lub kartę, aplikacja zapisuje komunikat w technicznym logu PDF:

```text
PDF generated, but the browser blocked the preview window. Allow pop-ups for this page and try again.
```

Mechanizm logu pozostaje ukryty w UI, ale zostaje w kodzie jako narzędzie diagnostyczne.

---

## 6. Test ręczny

Po `Ctrl+F5` należy sprawdzić:

1. kliknięcie `Eksportuj PDF`,
2. otwarcie nowej karty z komunikatem generowania,
3. zastąpienie tej karty podglądem PDF,
4. brak automatycznego pobierania pliku,
5. możliwość ręcznego zapisania PDF z poziomu podglądu przeglądarki,
6. zachowanie edytowalności pól PDF.

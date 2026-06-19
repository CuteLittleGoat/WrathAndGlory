# Poprawka fontu PDF PL — aktualizacja wyglądu per-pole

Data: 2026-06-19
Zakres: `Kalkulator/test.html`, `Kalkulator/vendor/pdf-lib.min.js`.

---

## 1. Problem po pierwszej próbie z fontem

Pierwsza poprawka dodawała `fontkit` i osadzała `Noto Sans Regular`, ale używała globalnego wywołania:

```js
form.updateFieldAppearances(polishFont);
```

W testach nadal pojawiał się błąd:

```text
Error: WinAnsi cannot encode "Ś" (0x015a)
```

Stos wskazywał, że `pdf-lib` podczas globalnej aktualizacji wyglądu pól nadal próbował używać domyślnego fontu WinAnsi dla co najmniej jednego pola.

---

## 2. Nowe podejście

Zamiast globalnego:

```js
form.updateFieldAppearances(polishFont);
```

`Kalkulator/test.html` aktualizuje wygląd tylko tych pól tekstowych, które sam wypełnia:

```js
field.setText(text);
field.updateAppearances(polishFont);
```

Następnie formularz jest spłaszczany bez automatycznego ponownego generowania wyglądu:

```js
form.flatten({ updateFieldAppearances: false });
```

A PDF jest zapisywany również bez automatycznej aktualizacji wyglądu:

```js
pdfDoc.save({ updateFieldAppearances: false });
```

---

## 3. Dlaczego tak

To omija sytuację, w której `pdf-lib` próbuje globalnie przejść po wszystkich polach PDF i wygenerować wygląd przy użyciu domyślnego WinAnsi.

Wypełniane pola dostają wygląd jawnie, przez osadzony font `Noto Sans Regular`.

Pola, których kalkulator nie wypełnia, nie są dotykane przez globalną aktualizację wyglądu.

---

## 4. Status loadera

`Kalkulator/vendor/pdf-lib.min.js` ładuje obecnie tymczasowo:

```text
pdf-lib@1.17.1
@pdf-lib/fontkit@1.1.1
```

Docelowo należy rozważyć wersję offline:

```text
Kalkulator/vendor/pdf-lib.min.js
Kalkulator/vendor/fontkit.umd.min.js
Kalkulator/vendor/fonts/NotoSans-Regular.ttf
```

---

## 5. Test ręczny

Po `Ctrl+F5` testować eksport z polskimi znakami, np.:

```text
Rozmiar: Średni
Słowa Kluczowe: Zakon Żeński
```

Oczekiwany wynik:

- brak błędu `WinAnsi cannot encode "Ś"`,
- PDF generuje się,
- wypełnione pola są widoczne z polskimi znakami,
- log PDF pokazuje tylko ewentualne błędy mapowania pól, nie błąd fontu.

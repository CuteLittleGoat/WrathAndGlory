# Obsługa polskich znaków w eksporcie PDF PL

Data: 2026-06-19
Zakres: `Kalkulator/test.html`, `Kalkulator/vendor/pdf-lib.min.js`.

---

## 1. Problem

Podczas eksportu PDF `pdf-lib` zgłaszał błąd przy zapisie formularza:

```text
encodeUnicodeCodePoint
encodeTextAsGlyphs
updateFieldAppearances
pdfDoc.save
```

Przyczyną było użycie domyślnej czcionki PDF, która nie obsługuje znaków spoza podstawowego zakresu WinAnsi/ASCII.

Problem pojawiał się nawet przy domyślnych danych, ponieważ pole `Rozmiar` miało wartość:

```text
Średni
```

Ten sam problem wystąpiłby dla danych takich jak:

```text
Zakon Żeński
Czujność
Umiejętności
Przeszłość
Słowa Kluczowe
```

Nie należy rozwiązywać tego transliteracją typu `Żeński -> Zenski`, ponieważ użytkownik potrzebuje poprawnych polskich znaków na karcie.

---

## 2. Przyjęte rozwiązanie

Eksport PDF PL powinien osadzać font z obsługą polskich znaków.

Dla testu użyty został:

```text
Noto Sans Regular
```

W `Kalkulator/test.html` dodano adres fontu:

```js
const polishFontUrl = 'https://cdn.jsdelivr.net/gh/notofonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Regular.ttf';
```

W eksporcie PDF wykonywane są kroki:

```js
pdfDoc.registerFontkit(window.fontkit);
const response = await fetch(polishFontUrl);
const polishFont = await pdfDoc.embedFont(await response.arrayBuffer(), { subset: true });
form.updateFieldAppearances(polishFont);
form.flatten({ updateFieldAppearances: false });
const out = await pdfDoc.save({ updateFieldAppearances: false });
```

Dzięki temu wygląd pól formularza jest generowany fontem, który obsługuje polskie znaki.

---

## 3. Fontkit

`pdf-lib` wymaga `fontkit`, aby osadzać zewnętrzne fonty TTF/OTF.

Dlatego tymczasowy loader w:

```text
Kalkulator/vendor/pdf-lib.min.js
```

ładuje obecnie zarówno:

```text
pdf-lib@1.17.1
@pdf-lib/fontkit@1.1.1
```

Aktualny loader nadal jest rozwiązaniem tymczasowym CDN.

---

## 4. Docelowe rozwiązanie offline

Docelowo, jeśli eksport ma działać bez internetu, należy dodać lokalnie:

```text
Kalkulator/vendor/pdf-lib.min.js
Kalkulator/vendor/fontkit.umd.min.js
Kalkulator/vendor/fonts/NotoSans-Regular.ttf
```

albo inne równoważne ścieżki w ramach ustalonej struktury projektu.

Wtedy `test.html` powinien pobierać font lokalnie zamiast z CDN.

---

## 5. Aktualny stan testowy

Aktualnie `Kalkulator/test.html`:

- pozostaje odpięty od Firebase,
- zapisuje dane tylko lokalnie przez `localStorage`,
- mapuje eksport PL po rzeczywistych nazwach pól PDF,
- używa `Noto Sans Regular` do wyglądu pól PDF,
- spłaszcza formularz po aktualizacji wyglądu pól,
- zapisuje PDF z `updateFieldAppearances: false`, żeby `pdf-lib` nie próbował ponownie generować wyglądu domyślnym fontem.

---

## 6. Test ręczny

Po `Ctrl+F5` sprawdzić eksport z polskimi znakami, np.:

```text
Rozmiar: Średni
Słowa Kluczowe: Zakon Żeński
```

Oczekiwany wynik:

- PDF generuje się bez błędu `encodeUnicodeCodePoint`,
- polskie znaki są widoczne na wygenerowanej karcie,
- log PDF nie zawiera błędów fontu.

# Pola tekstowe — stały rozmiar, scroll i zmniejszanie fontu

Data: 2026-06-19
Zakres: `Kalkulator/test.html`.

---

## 1. Cel zmiany

W wersji testowej pola tekstowe można było ręcznie rozszerzać, a rozmiar fontu pozostawał stały.

Docelowo pola tekstowe mają zachowywać się jak w wersji produkcyjnej:

- pole ma stały rozmiar,
- nie można ręcznie rozszerzać pola,
- przy większej ilości tekstu font w polu zmniejsza się,
- gdy treść nadal się nie mieści, w polu pojawia się pionowy scroll.

---

## 2. Zakres

Zmiana obejmuje wszystkie pola `textarea` w `Kalkulator/test.html`, w tym pola w modalu `Cechy i zasady specjalne`:

```text
Gatunek
Frakcja
Archetyp
Słowa Kluczowe
Nazwa zasad specjalnych
Nazwa talentów
```

Pola `Gatunek`, `Frakcja` i `Archetyp` zostały zmienione z jednowierszowych `input` na `textarea`, ponieważ mają działać tak samo jak pozostałe pola tekstowe.

---

## 3. Brak wpływu na eksport PDF

Zmiana jest prezentacyjna.

Identyfikatory pól pozostały bez zmian:

```text
character_speciesName
character_factionName
character_archetypeName
```

Funkcja `getCharacter()` nadal odczytuje wartości przez `.value.trim()`, więc zmiana typu HTML z `input` na `textarea` nie powinna wpływać na przenoszenie danych do PDF.

---

## 4. Implementacja CSS

Dodano stałe wysokości i scroll:

```css
textarea {
  resize: none;
  text-align: left;
  height: 64px;
  min-height: 64px;
  max-height: 64px;
  overflow-y: auto;
  line-height: 1.25;
  font-size: 1rem;
}

#characterRulesModal textarea {
  height: 46px;
  min-height: 46px;
  max-height: 46px;
}

#specialRulesTable textarea,
#talentsTable textarea {
  height: 78px;
  min-height: 78px;
  max-height: 78px;
}
```

Dodano klasy zmniejszające font:

```css
textarea.fit-small { font-size: .86rem; }
textarea.fit-smaller { font-size: .74rem; }
textarea.fit-tiny { font-size: .64rem; }
```

---

## 5. Implementacja JS

Dodano funkcje:

```js
fitTextArea(el)
fitAllTextAreas()
```

Funkcje działają tylko na wygląd pola i nie zmieniają jego wartości.

Font jest zmniejszany na podstawie długości treści oraz faktycznego przepełnienia pola (`scrollHeight > clientHeight`).

---

## 6. Test ręczny

Po `Ctrl+F5` sprawdzić:

1. pola nie dają się ręcznie rozszerzać,
2. długi tekst zmniejsza font,
3. bardzo długi tekst powoduje scroll,
4. pola `Gatunek`, `Frakcja`, `Archetyp` zachowują się tak samo jak pozostałe pola tekstowe,
5. eksport PDF nadal przenosi wartości tych pól poprawnie.

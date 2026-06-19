# Modal Maksymalne wartości atrybutów — korekta stylów

Data: 2026-06-19
Zakres: `Kalkulator/test.html`.

---

## 1. Problem

Po poprawieniu nazw kolumn w modalu `Maksymalne wartości atrybutów` nadal były widoczne różnice między wersją testową i produkcyjną:

- szerokości kolumn / wyrównanie przy kolumnie `WYTRZYMAŁOŚĆ` wyglądały inaczej,
- nazwy gatunków wyglądały jaśniej lub mocniej niż w produkcji,
- tło tabeli wydawało się jaśniejsze.

---

## 2. Przyczyny

W `Kalkulator/test.html` istniały różnice względem produkcyjnego `TworzeniePostaci.html`:

1. `--panel2` było ustawione na lekko zielonkawe `#020902`, a w produkcji jest czarne `#000`.
2. `body` w wersji testowej wymuszał font systemowy, zamiast używać monospace jak produkcja.
3. Dialog i wrapper miały szerokość `1120px`, a produkcja używa `1100px`.
4. Tabela `speciesMaxTable` nie miała produkcyjnych reguł:
   - `white-space: nowrap`,
   - pogrubienie pierwszej kolumny `600`,
   - wyrównanie pierwszej kolumny do lewej.

---

## 3. Wprowadzone korekty

W `Kalkulator/test.html` zmieniono:

```css
--panel2: #000;
```

oraz font strony:

```css
body {
  font-family: "Consolas", "Fira Code", "Source Code Pro", monospace;
}
```

Szerokości kontenerów dostosowano do produkcji:

```css
.wrapper {
  width: min(1100px, 96vw);
}

.modal__dialog {
  width: min(1100px, 96vw);
}
```

Dla tabeli `speciesMaxTable` dodano reguły odpowiadające produkcyjnemu modalowi:

```css
#speciesMaxTable th,
#speciesMaxTable td {
  text-align: center;
  white-space: nowrap;
}

#speciesMaxTable td:first-child {
  font-weight: 600;
  text-align: left;
  color: var(--text);
}
```

---

## 4. Test ręczny

Po `Ctrl+F5` sprawdzić modal:

```text
Maksymalne wartości atrybutów
```

Oczekiwany rezultat:

- pełne nazwy kolumn,
- nazwy gatunków pogrubione podobnie jak w produkcji,
- ciemniejsze tło tabeli zgodne z produkcją,
- wyrównanie i szerokości kolumn bliższe wersji produkcyjnej.

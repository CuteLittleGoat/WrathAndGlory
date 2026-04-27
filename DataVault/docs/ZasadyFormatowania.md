# DataVault — Zasady formatowania tekstu

## Cel dokumentu
Ten dokument jest **wycinkiem dokumentacji technicznej** i opisuje wyłącznie reguły renderowania oraz interpretacji formatowania tekstu stosowane przez moduł DataVault.

> Pełny opis techniczny (architektura, ładowanie danych, UI, filtrowanie, sortowanie, clamp, parser XLSX itd.) znajduje się w `DataVault/docs/Documentation.md`.

---

## 1. Pipeline formatowania (kolejność ma znaczenie)

1. Tekst z danych wejściowych (`data.json`) trafia do parsera markerów inline (`{{RED}}`, `{{B}}`, `{{I}}`, `{{S}}`).
2. Segmenty tekstu otrzymują style inline (`czerwony`, `bold`, `italic`, `strike`) na podstawie aktualnego stanu markerów.
3. W tym samym przebiegu wykrywane są referencje stron w nawiasach `(...)` zawierające `str`, `str.` lub `strona` i dostają klasę `.ref`.
4. Następnie nakładane są reguły semantyczne per kolumna/arkusz:
   - `Słowa Kluczowe` (globalna czerwień + wyjątki przecinków),
   - `Słowa Kluczowe Frakcji` (tokeny `-`, `lub`, `[ŚWIAT-KUŹNIA]`),
   - `Zasięg` (separator `/` jako `.slash`).
5. Na końcu działają reguły prezentacyjne (np. przycięcie podglądu do `maxLines`, hint `.clampHint`, styl archiwalny `row-old`).

---

## 2. Markery inline i ich interpretacja

Obsługiwane markery w treści:
- `{{RED}}...{{/RED}}` → czerwony (`.inline-red`)
- `{{B}}...{{/B}}` → pogrubienie (`.inline-bold`)
- `{{I}}...{{/I}}` → kursywa (`.inline-italic`)
- `{{S}}...{{/S}}` → przekreślenie (`.inline-strike`)

Ważne zasady:
- Markery mogą być zagnieżdżone.
- Parser działa stosowo (stack), więc zachowuje kolejność otwarć/zamknięć.
- Jeśli style się łączą, segment dostaje wiele klas jednocześnie (np. `inline-red inline-bold`).

---

## 3. Źródło markerów (XLSX → data.json)

Markery są generowane z `Repozytorium.xlsx`:
- parser rich text rozpoznaje style runów i mapuje je na `RED/B/I` (oraz wspierane `S`),
- `<br>` i podziały linii są zachowane jako nowe linie,
- gdy komórka ma czerwony styl i brak runów stylowanych, cała wartość może zostać opakowana w `{{RED}}...{{/RED}}`.

Kolor czerwony jest wykrywany m.in. dla:
- `red`, `#f00`, `#ff0000`, `#ffff0000`, `rgb(255,0,0)`, `rgba(255,0,0,1)`.

---

## 4. Referencje stron i linie specjalne

### 4.1 Referencje w nawiasach
Fragment `(...)` otrzymuje `.ref`, jeśli wewnątrz nawiasu występuje `str`, `str.` lub `strona` (case-insensitive).

Przykłady:
- `(str. 123)`
- `(STR 88)`
- `(zob. strona 45)`

### 4.2 Linie pomocnicze `*[n]`
Linia pasująca do wzorca `^\*\s*\[(\d+)\]\s*(.*)$` jest renderowana jako `.caretref` (jaśniejszy kolor linii).

Reguły:
- Gwiazdka i `[n]` pozostają widoczne.
- Działa per linia po podziale po `\n`.

---

## 5. Reguły dla kolumn „Słowa Kluczowe”

### 5.1 Arkusz `Słowa Kluczowe` / kolumna `Nazwa`
Zawsze pełna czerwień (`.keyword-red`) dla całej treści.

### 5.2 Arkusze z neutralnym przecinkiem
W kolumnie `Słowa Kluczowe` dla arkuszy:
- `Bestiariusz`
- `Archetypy`
- `Psionika`
- `Augumentacje`
- `Ekwipunek`
- `Pancerze`
- `Bronie`

cała treść jest czerwona, ale każdy przecinek `,` jest zastępowany przez:
`<span class="keyword-comma">,</span>`

Efekt: słowa czerwone, przecinek w kolorze bazowym tekstu.

### 5.3 Wyjątek: `Pakiety Wyniesienia` / `Słowa Kluczowe`
Mimo że arkusz figuruje w zbiorze arkuszy „comma-neutral”, `formatDataCellHTML` ma nadrzędny wyjątek:
- **nie** nakłada globalnego wrappera `.keyword-red`,
- renderuje komórkę jak zwykły tekst (`getFormattedCellHTML`),
- czerwony kolor pochodzi tylko z markerów inline (`{{RED}}...{{/RED}}`) przeniesionych z XLSX.

---

## 6. Reguły specjalne: `Słowa Kluczowe Frakcji` / `Słowo Kluczowe`

W `formatFactionKeywordHTML` obowiązuje tokenizacja:
1. Domyślnie tekst jest czerwony (`.keyword-red`).
2. Token `-` jest neutralny (bez `.keyword-red`).
3. Słowo `lub` (dowolna wielkość liter) jest neutralne.
4. `[ŚWIAT-KUŹNIA]` to wyjątek nadrzędny: cały token zawsze czerwony (wraz z myślnikiem).
5. Style `{{B}}` i `{{I}}` są zachowane, więc np. neutralne `lub` może pozostać kursywą.

---

## 7. Reguła dla kolumny `Zasięg`

Wartość dzielona po `/`:
- część tekstowa pozostaje standardowa,
- separator `/` dostaje klasę `.slash` (jaśniejszy kolor).

---

## 8. Clamp i render wieloliniowy

- `formatTextHTML(..., { maxLines })` może ograniczyć render do pierwszych `N` linii.
- `appendHint` dopina linię z klasą `.clampHint`.
- Właściwe rozwijanie/zwijanie komórek nie zmienia semantyki formatowania; dotyczy wyłącznie prezentacji.

---

## 9. Styl „archiwalny” (`row-old`) i priorytety kolorów

Dla wierszy ze stanem `old` (`row-old`):
- domyślny kolor tekstu przechodzi na `var(--text-old)`,
- klasy `.keyword-comma`, `.ref`, `.caretref`, `.slash` dziedziczą ten sam kolor archiwalny,
- `.inline-strike` używa `text-decoration: line-through` i koloru `var(--text-old)`.

Priorytet koloru dla przekreślenia:
- `.inline-strike.inline-red` przywraca czerwony (`var(--red)`),
- dzięki temu kombinacja `RED + S` pozostaje czerwona mimo stylu archiwalnego.

---

## 10. Klasy CSS używane przez formatowanie

- `.inline-red`
- `.inline-bold`
- `.inline-italic`
- `.inline-strike`
- `.keyword-red`
- `.keyword-comma`
- `.ref`
- `.caretref`
- `.slash`
- `.clampHint`

---

## 11. Checklista dla przygotowania `Repozytorium.xlsx`

1. Czerwony kolor, który ma przetrwać do UI, ustawiaj jako realny styl fontu (obsługiwane warianty czerwieni).
2. Jeśli tekst ma być pogrubiony/kursywą/przekreślony, ustaw to bezpośrednio w rich text komórki.
3. Referencje stron zapisuj najlepiej w nawiasach z tokenami `str.`, `str`, `strona`.
4. Linie pomocnicze zaczynaj od `*[liczba]`, jeśli mają być pokazane jaśniejszym tonem.
5. W `Słowa Kluczowe Frakcji` pamiętaj, że `-` i `lub` są neutralne, a `[ŚWIAT-KUŹNIA]` jest zawsze czerwone.
6. W `Pakiety Wyniesienia / Słowa Kluczowe` nie licz na automatyczną pełną czerwień — kolor wynika tylko z inline styli z XLSX.

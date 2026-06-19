# Patch notes — Kalkulator / eksport PDF / modal zasad

Data: 2026-06-19
Cel: roboczy opis zmian do wdrożenia w `Kalkulator/TworzeniePostaci.html` oraz materiał przenośny do późniejszego użycia w innym repozytorium.

Uzupełnienie szczegółowe:

```text
Analizy/Kalkulator-logika-eksportu-pdf-2026-06-19.md
```

---

## 1. Zakres patcha

Patch dotyczy istniejącego pliku:

```text
Kalkulator/TworzeniePostaci.html
```

Nie tworzyć nowej strony. Rozszerzyć istniejący widok tworzenia postaci.

Główne elementy:

1. dodać przycisk `Cechy i zasady specjalne`,
2. dodać przycisk `Eksportuj PDF`,
3. dodać jeden modal `Cechy i zasady specjalne`,
4. dodać stan modala do stanu kalkulatora,
5. dodać obliczanie cech pochodnych,
6. rozszerzyć zapis/wczytanie,
7. przygotować eksport PDF przez `pdf-lib`,
8. spłaszczać wynikowy PDF,
9. eksportować teksty do bucketów `Zdolności i Talenty`, `Notatki`, `Przeszłość`,
10. dodać ostrzeżenia dla zbyt niskich wartości surowych.

---

## 2. Przyciski na głównej stronie

Dodać na głównej stronie kalkulatora, po istniejących sekcjach:

```html
<div class="data-actions character-creation-actions">
  <button type="button" id="openCharacterRulesModalButton">Cechy i zasady specjalne</button>
  <button type="button" id="exportCharacterPdfButton">Eksportuj PDF</button>
</div>
```

Zasady:

- `Cechy i zasady specjalne` otwiera modal,
- `Eksportuj PDF` nie znajduje się w modalu,
- żaden z tych przycisków nie powinien naruszać istniejącej logiki PD.

---

## 3. Modal

Dodać jeden modal:

```html
<div id="characterRulesModal" class="character-rules-modal" aria-hidden="true">
  <div class="character-rules-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="characterRulesModalTitle">
    <div class="character-rules-modal__header">
      <h2 id="characterRulesModalTitle">Cechy i zasady specjalne</h2>
      <button type="button" id="closeCharacterRulesModalButton" class="character-rules-modal__close" aria-label="Zamknij">×</button>
    </div>

    <h3 class="section-title">Dane postaci do obliczeń i eksportu</h3>
    <!-- tabela character-details-table -->

    <h3 class="section-title">Cechy obliczalne</h3>
    <!-- tabela derived-stats-table -->

    <h3 class="section-title">Cechy i zasady specjalne</h3>
    <!-- tabela special-rules-table -->

    <div class="data-actions special-rules-actions">
      <button type="button" id="addSpecialRuleButton">Dodaj zasadę</button>
      <button type="button" id="removeSpecialRuleButton">Usuń zasadę</button>
    </div>
  </div>
</div>
```

Nie dodawać do modala:

- `Imię gracza`,
- `Imię postaci`,
- `Ranga`,
- `Opis na kartę`,
- `Eksportuj do`,
- `Aktywne`,
- `Usuń puste wiersze`.

---

## 4. Dane postaci w modalu

Pola:

- `Poziom Gry`,
- `Gatunek`,
- `Rozmiar`,
- `Frakcja`,
- `Archetyp`,
- `Słowa Kluczowe`.

`Poziom Gry`:

- liczba całkowita `1..5`,
- nie ustawia automatycznie puli PD,
- wpływa na obliczenia: Żywotność maksymalna, Odporność Psychiczna, Majątek.

`Rozmiar`:

- dropdown,
- domyślnie `Średni`,
- `Malutki`: `+2 Obrona`,
- `Mały`: `+1 Obrona`,
- pozostałe: `0 Obrona`,
- nie wiązać automatycznie gatunku z rozmiarem.

---

## 5. Cechy obliczalne

Liczyć:

| Cecha | Wzór bazowy | Minimum |
| --- | --- | ---: |
| Żywotność maksymalna | `Wt + (2 × Poziom Gry) + bonusy` | 1 |
| Odporność Psychiczna | `SW + Poziom Gry + bonusy` | 1 |
| Determinacja | `Wt + bonusy` | 1 |
| Obrona | `I - 1 + modyfikator Rozmiaru + bonusy` | 1 |
| Odporność | `Wt + 1 + bonusy` | 1 |
| Upór | `SW + bonusy` | 1 |
| Odwaga | `SW - 1 + bonusy` | 1 |
| Wpływy | `wybrany atrybut bazowy - 1 + bonusy` | 1 |
| Majątek | `Poziom Gry + bonusy` | 1 |
| Spaczenie | `wartość ręczna + bonusy` | 0 |

Nie liczyć:

- `WP Pancerza`,
- `Odporność suma`,
- osobnej `Odporności bazowej` poza polem `Odporność`,
- `Maks. Trauma`.

Zaokrąglać w górę.

---

## 6. Wartości ujemne i ostrzeżenia

Kolumna `Wartość` musi dopuszczać liczby ujemne.

Obliczenia mają wykonywać się zawsze, gdy wpis modyfikuje cechę, także dla wartości ujemnych.

Dodać ostrzeżenia na podstawie wartości surowej po bonusach, ale przed wymuszeniem minimum:

- dla wszystkich cech poza `Spaczenie`: ostrzeżenie, jeśli wartość wynosi `0` lub mniej,
- dla `Spaczenie`: ostrzeżenie, jeśli wartość wynosi mniej niż `0`.

Minimum nadal obowiązuje:

- `1` dla cech poza `Spaczenie`,
- `0` dla `Spaczenie`.

---

## 7. Zasady specjalne — typy i eksport

Typy:

1. `Zdolności Gatunkowe`,
2. `Zdolność Archetypu`,
3. `Premia z przeszłości`,
4. `Bonusy Słów Kluczowych`,
5. `Specjalne Bonusy Frakcji`,
6. `Inne`.

Eksport tekstu z pola `Nazwa`:

| Typ / źródło | Warunek | Eksport tekstu |
| --- | --- | --- |
| Główna sekcja talentów | dowolny wpis z nazwą | `Zdolności i Talenty` |
| `Zdolność Archetypu` | `Opis` / `Brak — tylko opis` / `none` | `Zdolności i Talenty` |
| `Zdolność Archetypu` | modyfikuje cechę | `Notatki` |
| `Premia z przeszłości` | dowolny wpis | `Przeszłość` |
| `Zdolności Gatunkowe` | dowolny wpis | `Notatki` |
| `Bonusy Słów Kluczowych` | dowolny wpis | `Notatki` |
| `Specjalne Bonusy Frakcji` | dowolny wpis | `Notatki` |
| `Inne` | dowolny wpis | `Notatki` |

Eksportować same nazwy, bez etykiet i bez kosztów.

Kolejność w polu `Zdolności i Talenty`:

1. najpierw nazwy z głównej sekcji talentów,
2. potem opisowe wpisy typu `Zdolność Archetypu`.

---

## 8. Stan i zapis/wczytanie

Stan rozszerzyć o:

```js
const calculatorState = {
  character: {},
  derived: {},
  specialRules: []
};
```

Do zapisu dodać co najmniej:

- `character.gameTier`,
- `character.speciesName`,
- `character.size`,
- `character.factionName`,
- `character.archetypeName`,
- `character.keywords`,
- `derived.influenceAttribute`,
- `derived.corruptionBase`,
- `specialRules[]`.

Zamykanie modala przez `X` ma synchronizować dane ze stanem kalkulatora. Ponowne otwarcie ma pokazywać te same dane.

---

## 9. PDF — biblioteka

Użyć `pdf-lib`.

Rekomendowany wariant:

```text
Kalkulator/vendor/pdf-lib.min.js
```

Powód: mniej zależności od internetu, lepsze działanie lokalne/offline.

---

## 10. PDF — profile PL/EN

PDF-y znajdują się w:

```text
Kalkulator/pdf/
```

Potwierdzone pliki:

```text
Kalkulator/pdf/pl.pdf
Kalkulator/pdf/en.pdf
```

Ustawić:

```js
const pdfProfiles = {
  pl: {
    templatePath: "./pdf/pl.pdf",
    fields: {
      species: "...",
      faction: "...",
      archetype: "...",
      keywords: "...",
      woundsMax: "...",
      shock: "...",
      determination: "...",
      defence: "...",
      resilience: "...",
      resolve: "...",
      conviction: "...",
      influence: "...",
      wealth: "...",
      corruption: "...",
      abilitiesAndTalents: "...",
      notes: "...",
      background: "..."
    }
  },
  en: {
    templatePath: "./pdf/en.pdf",
    fields: {
      species: "...",
      size: "...",
      faction: "...",
      archetype: "...",
      keywords: "...",
      woundsMax: "...",
      shock: "...",
      determination: "...",
      defence: "...",
      resilience: "...",
      resolve: "...",
      conviction: "...",
      influence: "...",
      wealth: "...",
      corruption: "...",
      abilitiesAndTalents: "...",
      notes: "...",
      background: "..."
    }
  }
};
```

Nie mapować pól pozycyjnie. Mapować po logicznych kluczach i realnych nazwach pól PDF.

---

## 11. PDF — spłaszczenie

Po wypełnieniu pól wykonać:

```js
form.flatten();
```

przed:

```js
const pdfBytes = await pdfDoc.save();
```

Wynikowy PDF ma być gotowym, spłaszczonym dokumentem.

---

## 12. Minimalny pseudokod eksportu tekstów

```js
function buildExportTextBuckets(talentRows, specialRules) {
  const buckets = {
    abilitiesAndTalents: [],
    notes: [],
    background: []
  };

  talentRows.forEach((talent) => {
    const name = String(talent.name || "").trim();
    if (name) buckets.abilitiesAndTalents.push(name);
  });

  specialRules.forEach((rule) => {
    const name = String(rule.name || "").trim();
    if (!name) return;

    if (rule.type === "backgroundBonus") {
      buckets.background.push(name);
      return;
    }

    if (rule.type === "archetypeAbility") {
      if (rule.target === "none") {
        buckets.abilitiesAndTalents.push(name);
      } else {
        buckets.notes.push(name);
      }
      return;
    }

    buckets.notes.push(name);
  });

  return {
    abilitiesAndTalents: buckets.abilitiesAndTalents.join("\n"),
    notes: buckets.notes.join("\n"),
    background: buckets.background.join("\n")
  };
}
```

---

## 13. Testy regresji

Po wdrożeniu sprawdzić:

- czy PD nadal liczy się jak wcześniej,
- czy istniejąca sekcja talentów działa bez zmian,
- czy modal otwiera się i zamyka,
- czy dane modala nie znikają po zamknięciu,
- czy zapis/wczytanie obejmuje dane modala,
- czy główna sekcja talentów trafia do `Zdolności i Talenty`, bez kosztów,
- czy opisowa `Zdolność Archetypu` trafia do `Zdolności i Talenty`,
- czy modyfikująca `Zdolność Archetypu` trafia do `Notatki` i wpływa na obliczenia,
- czy `Premia z przeszłości` trafia do `Przeszłość`,
- czy `Zdolności Gatunkowe` trafiają do `Notatki`,
- czy `Specjalne Bonusy Frakcji` trafiają do `Notatki`,
- czy wartości ujemne działają w obliczeniach,
- czy ostrzeżenie pojawia się przy surowej wartości 0 lub mniej, a dla `Spaczenie` poniżej 0,
- czy PDF generuje się dla PL i EN,
- czy PDF jest spłaszczony,
- czy w konsoli nie ma błędów.

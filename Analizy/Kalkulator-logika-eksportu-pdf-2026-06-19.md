# Logika eksportu PDF — Kalkulator / Tworzenie Postaci

Data: 2026-06-19
Zakres: doprecyzowanie mapowania wpisów z kalkulatora do pól PDF oraz ostrzeżeń dla wartości obliczalnych.

Ten dokument uzupełnia:

- `Analizy/Kalkulator.md`,
- `Analizy/Kalkulator-changelog-2026-06-19.md`,
- `Analizy/Kalkulator-patch-2026-06-19.md`,
- `Analizy/Kalkulator-mapowanie-pol-pdf-2026-06-19.md`.

Szczegółowe mapowanie widocznych pól karty PDF znajduje się w:

```text
Analizy/Kalkulator-mapowanie-pol-pdf-2026-06-19.md
```

---

## 1. Pliki PDF

Potwierdzone pliki kart PDF:

```text
Kalkulator/pdf/pl.pdf
Kalkulator/pdf/en.pdf
```

Ścieżki używane z poziomu `Kalkulator/TworzeniePostaci.html`:

```js
"./pdf/pl.pdf"
"./pdf/en.pdf"
```

---

## 2. Główne buckety eksportu tekstowego

Na potrzeby eksportu PDF należy traktować teksty jako osobne buckety:

```js
const exportTextBuckets = {
  abilitiesAndTalents: [],
  notes: [],
  background: []
};
```

Znaczenie bucketów:

| Bucket | Widoczne pole PDF |
| --- | --- |
| `abilitiesAndTalents` | `Zdolności i Talenty` / odpowiednik EN |
| `notes` | `Notatki` / odpowiednik EN |
| `background` | `Przeszłość` / odpowiednik EN |

---

## 3. Główna sekcja talentów z kalkulatora

Sekcja główna:

```text
Talenty, wiara, moce psioniczne, archetypy, pakiety wyniesienia i inne
```

Eksport:

- eksportować tylko pole `Nazwa`,
- nie eksportować pola `Koszt`,
- pomijać puste nazwy,
- wpisy trafiają do bucketu `abilitiesAndTalents`, czyli do pola `Zdolności i Talenty`.

Kolejność w polu `Zdolności i Talenty`:

1. najpierw nazwy z głównej sekcji talentów,
2. potem opisowe wpisy typu `Zdolność Archetypu`.

Nie dodawać etykiet typu `Talent:` ani `Zdolność Archetypu:`. W PDF ma pojawić się sama nazwa wpisu.

---

## 4. Zdolność Archetypu

Typ:

```text
Zdolność Archetypu
```

ma zachowanie zależne od kolumny `Modyfikuje`.

### 4.1. Wariant opisowy

Jeżeli użytkownik wybierze wariant opisowy:

```text
Opis
Brak — tylko opis
none
```

albo inny techniczny odpowiednik braku modyfikatora, wtedy:

- nazwa wpisu trafia do `abilitiesAndTalents`, czyli do pola `Zdolności i Talenty`,
- wartość nie wpływa na obliczenia,
- w PDF pojawia się sama nazwa, bez etykiety.

### 4.2. Wariant modyfikujący cechę

Jeżeli użytkownik wybierze inną opcję w kolumnie `Modyfikuje`, np.:

```text
Majątek
Odwaga
Żywotność
Obrona
```

wtedy:

- wartość z kolumny `Wartość` wpływa na obliczenia,
- nazwa wpisu trafia do `notes`, czyli do pola `Notatki`,
- nazwa wpisu nie trafia do `Zdolności i Talenty`,
- w PDF pojawia się sama nazwa, bez etykiety.

Obliczenia mają wykonywać się zawsze, gdy wpis modyfikuje cechę. Dotyczy to także wartości ujemnych.

---

## 5. Premia z przeszłości

Typ:

```text
Premia z przeszłości
```

Eksport:

- nazwa wpisu zawsze trafia do `background`, czyli do pola `Przeszłość`,
- dotyczy to zarówno wpisów opisowych, jak i mechanicznych,
- jeśli wpis modyfikuje cechę, jego wartość wpływa na obliczenia,
- nazwa nie trafia do `Notatek`,
- nazwa nie trafia do `Zdolności i Talenty`.

Przykłady dopuszczalnych wpisów:

```text
+1 do Majątku
Nowe słowo kluczowe
Kontakt w Administratum
```

---

## 6. Zdolności Gatunkowe

Typ:

```text
Zdolności Gatunkowe
```

Eksport:

- nazwa wpisu trafia do `notes`, czyli do pola `Notatki`,
- jeśli wpis modyfikuje cechę, jego wartość wpływa na obliczenia,
- nazwa nie trafia do `Zdolności i Talenty`,
- nazwa nie trafia do `Przeszłość`.

---

## 7. Pozostałe typy

Pozostałe typy:

```text
Bonusy Słów Kluczowych
Specjalne Bonusy Frakcji
Inne
```

Eksport:

- nazwa wpisu trafia do `notes`, czyli do pola `Notatki`,
- jeśli wpis modyfikuje cechę, jego wartość wpływa na obliczenia.

---

## 8. Suma umiejętności

Kolumna `Suma` w sekcji `Umiejętności` PDF nie zostaje pusta.

Dla każdej umiejętności obowiązuje wzór:

```text
Suma umiejętności = wartość umiejętności + wartość powiązanego atrybutu
```

Przykład:

```text
Czujność (Int) -> Czujność + Int
```

Jeżeli:

```text
Int = 1, Czujność = 0 -> Suma Czujności = 1
Int = 1, Czujność = 1 -> Suma Czujności = 2
Int = 2, Czujność = 1 -> Suma Czujności = 3
Int = 2, Czujność = 3 -> Suma Czujności = 5
```

Atrybut `Szybkość` nie jest powiązany z żadną umiejętnością i nie bierze udziału w obliczaniu sum umiejętności.

Ta sama zasada obowiązuje w wersji EN. Różnią się tylko nazwy i położenie pól na PDF oraz w kalkulatorze.

---

## 9. Pasywna Czujność

`Pasywna Czujność` jest liczona z sumy umiejętności `Czujność`.

Wzór równoważny:

```js
PasywnaCzujnosc = Math.ceil((Inteligencja + Czujnosc) / 2);
PasywnaCzujnosc = Math.ceil(SumaCzujnosci / 2);
```

---

## 10. Wartości ujemne

Kolumna `Wartość` musi dopuszczać wartości ujemne.

Przykład:

```text
Modyfikuje: Majątek
Wartość: -1
```

Wartości ujemne muszą wpływać na obliczenia tak samo jak dodatnie. Kalkulator nie powinien blokować ujemnej wartości tylko dlatego, że obniża cechę.

---

## 11. Ostrzeżenia dla wartości obliczalnych

Kalkulator nadal stosuje minima:

- wszystkie cechy poza `Spaczenie`: minimum `1`,
- `Spaczenie`: minimum `0`.

Jednocześnie należy dodać ostrzeżenia, żeby użytkownik widział, że suma bonusów obniżyła wartość poniżej bezpiecznego poziomu.

### 11.1. Cechy poza Spaczeniem

Dla każdej cechy obliczalnej poza `Spaczenie` pokazywać ostrzeżenie, jeżeli surowa wartość po uwzględnieniu bonusów, ale przed wymuszeniem minimum, wynosi:

```text
0 lub mniej
```

Przykład:

```text
Odwaga = SW - 1 + bonusy = 0
```

Wartość wyświetlana może nadal zostać podniesiona do minimum `1`, ale ostrzeżenie powinno poinformować, że obliczenia sprowadziły cechę do `0` albo niżej.

### 11.2. Spaczenie

Dla `Spaczenie` pokazywać ostrzeżenie, jeżeli surowa wartość po uwzględnieniu bonusów wynosi:

```text
mniej niż 0
```

Przykład:

```text
Spaczenie = wartość ręczna + bonusy = -1
```

Wartość wyświetlana może nadal zostać podniesiona do minimum `0`, ale ostrzeżenie powinno pozostać widoczne.

Dodać także osobne ostrzeżenie, jeżeli wartość `Spaczenie` po obliczeniach przekracza liczbę dostępnych slotów czaszek na karcie PDF.

---

## 12. Proponowana funkcja agregująca teksty do PDF

Szkic logiczny:

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

## 13. Co użytkownik musi wskazać ręcznie, a co można odczytać technicznie

Asystent / implementujący może technicznie odczytać rzeczywiste nazwy pól formularza PDF z plików `pl.pdf` i `en.pdf`, jeżeli ma dostęp do samych plików PDF jako danych binarnych albo lokalnych plików.

Użytkownik nie musi ręcznie przepisywać technicznych nazw pól formularza, o ile narzędzie do inspekcji PDF może je wypisać.

Użytkownik powinien natomiast potwierdzić znaczenie widocznych pól, gdy istnieje ryzyko niejednoznaczności. Aktualne znaczenie widocznych pól zostało rozpisane w:

```text
Analizy/Kalkulator-mapowanie-pol-pdf-2026-06-19.md
```

Na poziomie projektu aktualnie przyjęto, że mapowanie ma być wykonywane po rzeczywistych nazwach pól formularza PDF, a nie po pozycji pola na stronie.

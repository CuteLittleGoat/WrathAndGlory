# Cechy i zasady specjalne — domyślne typy i placeholdery

Data: 2026-06-19
Zakres: `Kalkulator/test.html`.

---

## 1. Domyślne typy wierszy

W modalu `Cechy i zasady specjalne` domyślny zestaw pięciu wierszy ma teraz odpowiadać układowi z testów wizualnych.

Domyślne typy:

```text
1. Zdolności Gatunkowe
2. Zdolność Archetypu
3. Premia z przeszłości
4. Bonusy Słów Kluczowych
5. Inne
```

W kodzie zapisano to jako:

```js
const defaultSpecialRules = [
  { type: 'speciesAbility', name: '', target: 'none', value: 0 },
  { type: 'archetypeAbility', name: '', target: 'none', value: 0 },
  { type: 'backgroundBonus', name: '', target: 'none', value: 0 },
  { type: 'keywordBonus', name: '', target: 'none', value: 0 },
  { type: 'other', name: '', target: 'none', value: 0 }
];
```

`Specjalne Bonusy Frakcji` nadal pozostają dostępne na liście typów, ale nie są już jednym z domyślnych pięciu wierszy startowych.

---

## 2. Placeholdery

Placeholdery pozostają zależne od typu wiersza:

```text
Zdolności Gatunkowe
np. Honor Zakonu, Orczy, Łasuch, Intensywne emocje

Zdolność Archetypu
np. Oddane współczucie, Płomienna zachęta, +1 do Wpływy

Premia z przeszłości
np. +1 do Żywotności, [DOWOLNE] Słowo Kluczowe

Bonusy Słów Kluczowych
np. Stalowy Legion Armageddonu, Ordo Hereticus, Zakon Uświęconej Tarczy

Specjalne Bonusy Frakcji
np. Ścieżki Asuryani (Ścieżka przebudzenia), Mutacja Krootów (Ludojad)

Inne
np. Zakony Pierwszego Powołania, Homebrew
```

---

## 3. Zmniejszony font podpowiedzi

Font placeholderów w kolumnie `Nazwa` został zmniejszony, żeby dłuższe podpowiedzi były czytelniejsze i mniej dominowały wizualnie.

Dodano regułę CSS:

```css
#specialRulesTable textarea::placeholder {
  font-size: .84rem;
  line-height: 1.25;
  letter-spacing: .02em;
}
```

---

## 4. Uwagi testowe

Po `Ctrl+F5` należy sprawdzić:

- czy domyślne typy pojawiają się w kolejności z pkt. 1,
- czy placeholder zmienia się po zmianie typu wiersza,
- czy mniejszy font placeholdera nie pogarsza czytelności na małych ekranach.

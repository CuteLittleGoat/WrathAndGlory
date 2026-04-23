# Analiza rozbudowy `Kalkulator/KalkulatorXP.html` — maksymalne wartości atrybutów i umiejętności

## Prompt użytkownika
> Przeprowadź analizę rozbudowy Kalkulator/KalkulatorXP.html
>
> Planuję dodać informację o maksymalnych wartościach jakie może wpisać gracz.
> Dla "Umiejętności" będzie to 8
> Dla "Atrybuty" będzie to zależne od rodzaju atrybutu oraz rasy jaką gracz wybierze.
> Przykładowo
> Człowiek będzie mieć maksymalną siłę 8 a Konstrukt Upiorytowy będzie mieć maksymalną siłę 12.
> Wszystkie nazwy ras i nazwy atrybutów będą musiały być zależne od wybranej wersji językowej.
> Atrybutów w grze jest 8.
> Załączam przykładową tabelę z podręcznika po angielsku i innego podręcznika po polsku.
> Pełną tabelę (z nazwami po polsku i angielsku) przygotuję później.
>
> Informacje o maksymalnych wartościach mogłyby być pod tabelami "Atrybuty" i "Umiejętności".
>
> Przeprowadź analizę rozbudowy.

---

## 1) Stan obecny (diagnoza)

Na podstawie aktualnego `KalkulatorXP.html`:

- Tabela **Atrybuty** ma aktualnie 4 wiersze wejściowe i stały limit `max="12"` na inputach.
- Tabela **Umiejętności** ma 4 wiersze wejściowe i stały limit `max="8"` na inputach.
- Walidacja oraz przeliczanie kosztu dla atrybutów jest wykonywana globalnie przez `recalcTable(..., min=0, max=12)`.
- Walidacja umiejętności jest globalna przez `recalcTable(..., min=0, max=8)`.
- Tłumaczenia są już obsłużone przez obiekt `translations` (`pl`/`en`) i `applyLanguage(lang)`.

Wniosek: obecny kod wspiera limity globalne per tabela, ale **nie wspiera limitów per-konkretny-atrybut + per-rasa**.

---

## 2) Wymagana zmiana funkcjonalna

### 2.1. Umiejętności
- Utrzymać limit maksymalny = **8** (globalny).
- Dodać pod tabelą komunikat informacyjny (PL/EN), np.:
  - PL: „Maksymalna wartość umiejętności: 8”
  - EN: „Maximum skill value: 8”

### 2.2. Atrybuty
- Atrybutów ma być **8** (w UI oraz modelu danych).
- Maksymalna wartość ma zależeć od:
  1. wybranej rasy,
  2. konkretnego atrybutu.
- Dodać sekcję pod tabelą Atrybutów z czytelną informacją o limitach (np. mini-tabela albo lista 8 pozycji dla wybranej rasy).
- Nazwy ras i atrybutów muszą być lokalizowane wg wybranego języka.

---

## 3) Proponowany model danych (docelowy)

Rekomendacja: odseparować dane „reguł” od logiki UI.

### 3.1. Słowniki nazw (i18n)
- `attributes`: 8 kluczy technicznych, np.:
  - `strength`, `toughness`, `agility`, `initiative`, `willpower`, `intellect`, `fellowship`, `speed`
- `species`: klucze techniczne, np.:
  - `human`, `aeldari`, `ork`, `wraith_construct`, ...
- Tłumaczenia:
  - `translations.pl.attributes.<key>`
  - `translations.en.attributes.<key>`
  - `translations.pl.species.<key>`
  - `translations.en.species.<key>`

### 3.2. Tabela limitów atrybutów
Jedno źródło prawdy (na start może być w JS, docelowo JSON):

```js
const attributeMaximumsBySpecies = {
  human: {
    strength: 8,
    toughness: 8,
    agility: 8,
    initiative: 8,
    willpower: 8,
    intellect: 8,
    fellowship: 8,
    speed: 8
  },
  wraith_construct: {
    strength: 12,
    toughness: 12,
    agility: 8,
    initiative: 8,
    willpower: 12,
    intellect: 10,
    fellowship: 4,
    speed: 8
  }
};
```

To pozwala:
- dynamicznie ustawiać `input.max` dla każdego wiersza atrybutu,
- wyświetlać pod tabelą aktualne maksima,
- zachować spójność z przyszłymi rasami.

---

## 4) Proponowane zmiany UI/UX

### 4.1. Wybór rasy
Dodać nad tabelą Atrybutów (lub w nagłówku panelu) `select`:
- label PL: „Rasa”
- label EN: „Species”
- opcje lokalizowane z `translations.*.species`

### 4.2. Widok informacji pod tabelami

Pod **Atrybuty**:
- blok „Maksymalne wartości dla wybranej rasy” (PL) / „Maximum values for selected species” (EN),
- najlepiej forma 8-wierszowej listy: „Nazwa atrybutu: wartość max”.

Pod **Umiejętności**:
- prosty blok informacyjny: stałe `8`.

### 4.3. Zachowanie walidacji
Po zmianie rasy:
1. przeliczyć limity per wiersz,
2. zaktualizować atrybut `max` inputów,
3. przyciąć (`clamp`) wartości, jeśli aktualna/docelowa > nowego maksimum,
4. ponownie przeliczyć XP.

To zabezpieczy przypadki typu: gracz miał 12 dla Siły, zmienia rasę na taką, gdzie max=8.

---

## 5) Wpływ na aktualną strukturę kodu

Najmniejsze, bezpieczne kroki:

1. **Rozszerzyć HTML tabeli Atrybutów do 8 wierszy** (obecnie są 4).
2. Dodać identyfikatory techniczne atrybutów do wierszy (`data-attribute="strength"` itd.).
3. Dodać `select` rasy (`id="speciesSelect"`) oraz kontener na info o limitach.
4. Rozszerzyć `translations` o:
   - nazwy ras,
   - nazwy atrybutów,
   - nowe etykiety sekcji „maksima”.
5. W JS dodać funkcję np. `getAttributeMax(species, attributeKey)`.
6. Zmienić `recalcTable` dla atrybutów tak, by używał max per wiersz zamiast jednego `max=12`.
7. Dodać funkcję renderującą blok informacyjny o maksimach.

---

## 6) Ryzyka i pułapki

1. **Niespójność nazw** (np. w danych `willpower`, a w DOM `siłaWoli`) — konieczne jednolite klucze techniczne.
2. **Zmiana języka**: nie może zmieniać kluczy danych, tylko labelki.
3. **Brak pełnej tabeli ras** teraz — warto wdrożyć strukturę i 2–3 przykładowe rasy, a pełne dane dołożyć później bez ruszania logiki.
4. **Koszty XP a limity**: koszt ma dalej wynikać z aktualnej tabeli kosztów, ale wejścia muszą być skutecznie ograniczane maxem rasy.

---

## 7) Rekomendowana kolejność wdrożenia

1. Refaktoryzacja danych (klucze atrybutów/ras + translacje).
2. Rozbudowa UI o wybór rasy i 8 atrybutów.
3. Implementacja dynamicznych limitów per atrybut.
4. Render sekcji informacyjnych pod tabelami.
5. Testy manualne (PL/EN, zmiana rasy, clamp wartości, reset).

---

## 8) Kryteria akceptacji (Definition of Done)

- [ ] W tabeli Atrybutów są 8 pozycje odpowiadające 8 atrybutom gry.
- [ ] Użytkownik może wybrać rasę.
- [ ] Każdy atrybut ma poprawny max zależny od rasy.
- [ ] Wartości wpisane powyżej max są automatycznie przycinane.
- [ ] Pod tabelą Atrybutów widoczna jest sekcja aktualnych maksimów (PL/EN).
- [ ] Pod tabelą Umiejętności widoczna jest informacja o limicie 8 (PL/EN).
- [ ] Zmiana języka przełącza nazwy ras, atrybutów i etykiety sekcji.
- [ ] Reset działa poprawnie po zmianie rasy i języka.

---

## 9) Sugestia techniczna na później

Gdy przygotujesz pełną tabelę ras i limitów (PL/EN), najlepiej:
- trzymać dane limitów w osobnym pliku JSON (np. `Kalkulator/data/attributeMaximums.json`),
- tłumaczenia nazw utrzymać w `translations` (UI),
- mapować wszystko po stabilnych kluczach technicznych.

To uprości dalsze aktualizacje bez ingerencji w logikę kalkulatora.

---

## 10) Wariant alternatywny: brak wyboru rasy w UI, statyczna informacja pod tabelami

Zgodnie z nowym podejściem:
- **nie dodajemy menu wyboru rasy** (brak `select` w interfejsie),
- pod tabelami wyświetlamy **statyczną informację** o limitach,
- **same tabele, sposób liczenia, walidacja i UX wpisywania wartości pozostają bez zmian**,
- zmieniamy tylko warstwę informacyjną i tłumaczenia nazw widocznych w tej informacji.

### 10.1. Konsekwencje funkcjonalne

1. Kalkulator dalej działa na obecnych limitach wejściowych (Atrybuty globalnie, Umiejętności = 8), bez dynamicznego przełączania limitu per rasa.
2. Informacja pod tabelą Atrybutów ma charakter **opisowy** (referencyjny), a nie sterujący logiką inputów.
3. Nazwy ras oraz atrybutów w sekcji informacyjnej są zależne od języka (PL/EN), ale wartości wprowadzane przez użytkownika nie są automatycznie mapowane do wybranej rasy, ponieważ rasa nie jest wybierana w UI.

### 10.2. Rekomendowana forma sekcji pod tabelą Atrybutów

Najprostsza i najczytelniejsza forma:
- nagłówek lokalizowany (PL/EN),
- jedna lub więcej mini-tabel „Rasa → maksima 8 atrybutów”,
- pełne nazwy ras i atrybutów pobierane z tłumaczeń.

Przykład układu:
- **PL**: „Maksymalne wartości atrybutów (informacyjne)”
- **EN**: „Maximum attribute values (reference)”

Dane mogą być renderowane z tej samej struktury technicznej kluczy (`species`, `attributes`), ale bez podpinania jej do walidacji pól formularza.

### 10.3. Zakres zmian w kodzie (minimalny)

1. Dodać pod tabelą Atrybutów blok informacyjny (kontener HTML + render w JS).
2. Rozszerzyć `translations` o:
   - etykietę nagłówka sekcji informacyjnej,
   - nazwy ras,
   - nazwy atrybutów (jeżeli nie są jeszcze kompletne).
3. Dodać prostą funkcję renderującą statyczne zestawienie limitów.
4. **Nie zmieniać** mechanizmu `recalcTable` ani obecnych ograniczeń inputów.

### 10.4. Plusy i minusy wariantu

**Plusy**
- najmniejsza ingerencja w istniejący kod,
- niskie ryzyko regresji w logice obliczeń XP,
- szybkie wdrożenie i prostsze testy.

**Minusy**
- brak automatycznego pilnowania limitów zależnych od rasy,
- użytkownik sam musi dopilnować zgodności wpisanych wartości z tabelą referencyjną,
- większe ryzyko błędu danych wejściowych względem faktycznej rasy postaci.

### 10.5. Doprecyzowane kryteria akceptacji dla tego wariantu

- [ ] Nie ma pola wyboru rasy w interfejsie.
- [ ] Pod tabelą Atrybutów widoczna jest statyczna sekcja informacyjna z limitami rasowymi.
- [ ] Nazwy ras i atrybutów w tej sekcji przełączają się poprawnie między PL i EN.
- [ ] Tabele wejściowe i logika obliczeń działają jak dotychczas (bez zmian funkcjonalnych).
- [ ] Pod tabelą Umiejętności pozostaje informacja o limicie 8.

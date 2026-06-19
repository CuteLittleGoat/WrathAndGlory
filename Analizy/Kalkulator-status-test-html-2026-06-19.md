# Status `Kalkulator/test.html` — etap testowy

Data: 2026-06-19
Zakres: stan po poprawkach UI i odpięciu pliku testowego od Firebase.

---

## 1. Zakres edycji

W ramach testów wolno edytować tylko:

```text
Analizy/*
Kalkulator/vendor/pdf-lib.min.js
Kalkulator/test.html
```

Nie modyfikować innych plików repozytorium.

---

## 2. Odpięcie od Firebase

`Kalkulator/test.html` ma być traktowany jako plik testowy i nie powinien zapisywać niczego w produkcyjnej Firebase.

Aktualna zasada dla `test.html`:

- brak zapisu do Firestore,
- brak odczytu z Firestore,
- zapis testowy tylko lokalnie w przeglądarce przez `localStorage`,
- przyciski zapisu/wczytania w wersji testowej dotyczą wyłącznie lokalnego stanu przeglądarki.

W opisie strony dodano informację, że wersja testowa jest odpięta od Firebase i zapisuje dane tylko lokalnie.

---

## 3. Sekcja talentów

Sekcja:

```text
Talenty, wiara, moce psioniczne, archetypy, pakiety wyniesienia i inne
```

ma teraz działać dynamicznie.

Ustalenia:

- domyślnie widoczny jest tylko jeden wiersz, czyli dwa pola talentów w układzie dwukolumnowym,
- przycisk `Dodaj pola talentów` dodaje kolejną parę pól,
- przycisk `Usuń pola talentów` usuwa ostatnią parę pól,
- gdy zostaje minimum, czyli jeden wiersz / dwa pola, przycisk `Usuń pola talentów` ma znikać,
- liczba pól talentów jest zapisywana w lokalnym stanie jako `talentCount`.

---

## 4. Log eksportu PDF

Komunikaty dotyczące mapowania i eksportu PDF mają być przeniesione na dół strony.

Aktualny podział komunikatów:

- górny czerwony blok błędów: błędy kalkulatora, np. przekroczenie puli PD albo błędy zasad,
- górny żółty blok ostrzeżeń: ostrzeżenia cech obliczalnych,
- dolny panel `Log eksportu PDF`: błędy i ostrzeżenia dotyczące PDF, np. `Nie znaleziono pola PDF...`.

---

## 5. Biblioteka PDF

`Kalkulator/vendor/pdf-lib.min.js` pozostaje tymczasowym loaderem CDN dla `pdf-lib@1.17.1`.

Docelowo plik powinien zostać zastąpiony pełnym lokalnym buildem `pdf-lib.min.js`, jeżeli test ma działać offline i bez CDN.

---

## 6. Najbliższe testy ręczne

Po twardym odświeżeniu strony (`Ctrl+F5`) sprawdzić:

1. Czy `test.html` nie pokazuje już placeholdera ani uszkodzonej treści.
2. Czy domyślnie w sekcji talentów są tylko dwa pola.
3. Czy przycisk `Usuń pola talentów` jest ukryty przy jednym wierszu.
4. Czy po dodaniu pary pól przycisk usuwania wraca.
5. Czy zapis/wczytanie lokalne nie dotyka Firebase.
6. Czy błędy PDF trafiają do dolnego panelu `Log eksportu PDF`.
7. Czy czerwone błędy PD pozostają na górze.

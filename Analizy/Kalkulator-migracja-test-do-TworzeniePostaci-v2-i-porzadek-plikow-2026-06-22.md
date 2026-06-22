# Migracja `test.html` do `TworzeniePostaci_v2.html` i uporządkowanie plików Kalkulatora

**Data analizy:** 2026-06-22  
**Data wdrożenia:** 2026-06-22  
**Repozytorium:** `CuteLittleGoat/WrathAndGlory`  
**Moduł:** `Kalkulator`  
**Status:** wdrożono rekomendowaną architekturę wersji 2; wymagane są testy ręczne w przeglądarce i opublikowanie reguł Firestore

---

## 1. Oryginalny pełny prompt analityczny użytkownika

> Sprawdziłem zapis i odczyt w pliku "test.html". Zapisuje się i wczytuje prawidłowo z Firebase. Przyciski "zapisz lokalnie", "wczytaj lokalnie" oraz "reset" nie są potrzebne. Układ przycisków w "test.html" ma być podobny jak w pliku produkcyjnym "TworzeniePostaci.html".
> Z tym, że dwa nowe przyciski "Cechy i zasady specjalne" oraz "Eksportuj PDF" mają być obok napisu "Atrybuty".
> Trzeba usunąć też żółty komunikat "Zapisano w Firebase: character_builder/test-v2. Produkcyjny dokument current nie został zmieniony." i zastąpić go modalem jak w "TworzeniePostaci.html" (załączam screena).
> Kasujemy też dopisek " — test" przy tytule "Tworzenie Postaci".
> Zmieniamy też nazwę pliku z test.html na "TworzeniePostaci_v2.html" - trzeba to poprawić też w innych plikach, które odnoszą się do starej nazwy "test.html".
> Trzeba przeprowadzić analizę modyfikacji "test" na "TworzeniePostaci_v2.html".
> Docelowo oba kalkulatory będą utrzymywane równolegle.
> Z pliku index.html będzie przejście do starej lub nowej wersji.
>
> Przeprowadź też analizę zrobienia porządku w plikach związanych z testami. Czy potrzebny jest dodatkowy loader?
> Chciałbym, żeby TworzeniePostaci_v2.html było możliwie małą i lekką aplikacją.
> Wyniki analizy zapisz w nowym pliku w folderze Analizy/

Do promptu dołączono dwa zrzuty ekranu przedstawiające układ produkcyjnego `TworzeniePostaci.html` oraz modal potwierdzenia zapisu.

---

## 2. Pełny prompt wdrożeniowy użytkownika

> Wykonaj rekomendowane zmiany opisane w Analizy/Kalkulator-migracja-test-do-TworzeniePostaci-v2-i-porzadek-plikow-2026-06-22.md
>
> 1. Tytuł karty to ma być "Zaawansowany Kreator Postaci"
> 2. Nie zmieniaj nic w dokumentacji (punkt 10.2. Dokumentacja aktywna)
> 3. 10.3. Nawigacja - Przycisk został już dodany do Kalkulator/index.html
> 4. Możesz zaktualizować plik DetaleLayout.md
> 5. W pliku TworzeniePostaci_v2.html przełącznik wyboru wersji językowej ma być ukryty.
>
> a następnie zaktualizuj plik Analizy/Kalkulator-migracja-test-do-TworzeniePostaci-v2-i-porzadek-plikow-2026-06-22.md

---

## 3. Cel i zakres wykonanych prac

Wersja robocza oparta na `test.html`, `test-loader.js` i `test-core.html` została przekształcona w osobną aplikację utrzymywaną równolegle z klasycznym kreatorem.

Docelowe punkty wejścia:

```text
Kalkulator/TworzeniePostaci.html
Kalkulator/TworzeniePostaci_v2.html
```

Wersja klasyczna nie została zmodyfikowana. Wersja 2 otrzymała oddzielny HTML, rdzeń aplikacji, integrację Firebase oraz moduł eksportu PDF.

Zgodnie z poleceniem użytkownika nie modyfikowano:

```text
Kalkulator/index.html
Kalkulator/docs/README.md
Kalkulator/docs/Documentation.md
Kalkulator/config/FirebaseREADME.md
Kalkulator/config/FirebaseTestREADME.md
```

Plik `Kalkulator/index.html` zawierał już przed wdrożeniem odnośnik do `TworzeniePostaci_v2.html`.

---

## 4. Wniosek dotyczący loadera

Dodatkowy loader całej strony nie jest potrzebny.

Usunięto architekturę:

```text
test.html
  -> test-loader.js
      -> fetch(test-core.html)
          -> modyfikacja HTML przez replaceExactlyOnce
              -> document.write()
```

Nowa wersja jest otwierana bezpośrednio:

```text
TworzeniePostaci_v2.html
  -> TworzeniePostaci_v2-core.js
  -> TworzeniePostaci_v2-firebase.js
  -> TworzeniePostaci_v2-pdf.js
```

Korzyści:

- brak dodatkowego pobierania dokumentu HTML;
- brak ekranu przejściowego „Uruchamianie wersji testowej”;
- brak `document.open()`, `document.write()` i `document.close()`;
- brak zależności od dokładnych fragmentów HTML wykorzystywanych przez `replaceExactlyOnce`;
- prostsza diagnostyka;
- możliwość niezależnego buforowania skryptów;
- możliwość leniwego ładowania ciężkich bibliotek.

Pozostawiono wyłącznie małe loadery zależności wewnątrz modułów Firebase i PDF. Nie są one loaderem strony: pobierają odpowiednie biblioteki dopiero przy pierwszym użyciu funkcji.

---

## 5. Aktualna struktura wersji 2

```text
Kalkulator/
├── TworzeniePostaci.html
├── TworzeniePostaci_v2.html
├── TworzeniePostaci_v2-core.js
├── TworzeniePostaci_v2-firebase.js
├── TworzeniePostaci_v2-pdf.js
├── kalkulatorxp.css
├── config/
│   ├── firebase-config.js
│   └── firestore.rules
├── pdf/
│   └── pl.pdf
└── vendor/
    └── pdf-lib.min.js
```

### Odpowiedzialność plików

| Plik | Odpowiedzialność |
| --- | --- |
| `TworzeniePostaci_v2.html` | struktura interfejsu, style właściwe dla wersji 2, modale i punkty podłączenia skryptów |
| `TworzeniePostaci_v2-core.js` | tabele, obliczenia PD, Drzewo Nauki, talenty, zasady specjalne, cechy pochodne i modale |
| `TworzeniePostaci_v2-firebase.js` | zapis i odczyt Firestore, migracja starego zapisu i komunikaty modalne |
| `TworzeniePostaci_v2-pdf.js` | leniwe ładowanie zależności PDF, mapowanie danych i generowanie polskiej karty |
| `vendor/pdf-lib.min.js` | plik zgodności; nie zawiera już kodu aplikacyjnego |

---

## 6. Interfejs użytkownika po zmianach

### 6.1. Tytuły

Tytuł karty przeglądarki:

```text
Zaawansowany Kreator Postaci
```

Widoczny nagłówek strony:

```text
Tworzenie Postaci
```

Usunięto dopisek:

```text
— test
```

### 6.2. Górny układ

Układ jest zbliżony do klasycznego kreatora:

- tytuł, pula PD i pozostałe PD znajdują się po lewej;
- `Zapisz` i `Wczytaj` znajdują się pod pulą PD;
- `Instrukcja`, `Strona Główna` i `Maksymalne wartości atrybutów` znajdują się w prawej kolumnie;
- na wąskim ekranie kolumny układają się pionowo.

### 6.3. Sekcja Atrybuty

Przyciski:

```text
Cechy i zasady specjalne
Eksportuj PDF
```

znajdują się w tym samym wierszu co nagłówek `Atrybuty`. Przy szerokości do `760px` akcje zawijają się pod nagłówek.

### 6.4. Przełącznik języka

Element `#languageSelect` pozostaje technicznie w HTML, lecz jest ukryty przez:

```css
.language-switcher select {
  display: none !important;
}
```

Ma ustawione:

```html
aria-hidden="true"
tabindex="-1"
```

Wersja 2 działa obecnie po polsku.

### 6.5. Lokalny zapis i reset

Usunięto z interfejsu i nowego rdzenia:

```text
Zapisz lokalnie
Wczytaj lokalnie
Reset
localStorage
wng-test-character-calculator-v1
```

Stan jest zapisywany przez Firebase.

---

## 7. Modale Firebase

Usunięto żółty komunikat techniczny:

```text
Zapisano w Firebase: character_builder/test-v2. Produkcyjny dokument current nie został zmieniony.
```

Zapis i odczyt korzystają z modala wzorowanego na `TworzeniePostaci.html`:

- tytuł operacji;
- pytanie potwierdzające;
- ilustracja `Modal_Icon.png`;
- przyciski `Tak` i `Nie`;
- po zakończeniu osobny modal sukcesu albo błędu;
- brak prezentowania użytkownikowi technicznej ścieżki Firestore.

---

## 8. Firebase i izolacja dwóch kreatorów

Klasyczny kreator pozostaje przy dokumencie:

```text
character_builder/current
```

Zaawansowany kreator docelowo używa:

```text
character_builder/v2
```

Kod wersji 2 nie odczytuje ani nie zapisuje `character_builder/current`.

### 8.1. Migracja i zgodność przejściowa

Do czasu wdrożenia nowych reguł Firestore wersja 2 ma bezpieczny fallback do dawnego, również odizolowanego dokumentu:

```text
character_builder/test-v2
```

Zachowanie:

1. zapis próbuje najpierw `character_builder/v2`;
2. przy błędzie uprawnień zapisuje do `character_builder/test-v2`;
3. odczyt próbuje najpierw `v2`;
4. jeżeli `v2` nie istnieje albo nie jest jeszcze dostępne, odczytuje `test-v2`;
5. po odczycie starego formatu podejmuje próbę zapisania danych do `v2`;
6. brak wdrożonych reguł `v2` nie blokuje użytkownikowi odczytu starego zapisu.

Walidowane identyfikatory modułu:

```text
Kalkulator/TworzeniePostaci_v2
Kalkulator/test
```

Pierwszy jest formatem docelowym, drugi służy wyłącznie zgodności migracyjnej.

### 8.2. Reguły Firestore

Plik `Kalkulator/config/firestore.rules` został rozszerzony o:

```text
character_builder/v2
```

Pozostawiono tymczasowy dostęp do:

```text
character_builder/test-v2
```

w celu migracji. Pozostałe dokumenty są blokowane przez regułę domyślną.

**Ważne:** zapis pliku reguł w repozytorium nie publikuje go automatycznie w Firebase. Reguły trzeba wdrożyć w Firebase Console albo Firebase CLI. Do tego czasu aplikacja użyje fallbacku `test-v2`.

---

## 9. Lekkość aplikacji

### 9.1. Start strony

Przy otwarciu nie są ładowane biblioteki Firebase ani biblioteki PDF. Ładuje się HTML i trzy niewielkie moduły aplikacyjne.

### 9.2. Firebase

Skrypty:

```text
firebase-app.js
firebase-firestore.js
config/firebase-config.js
```

są pobierane dopiero po kliknięciu `Zapisz` albo `Wczytaj`.

### 9.3. PDF

Skrypty:

```text
pdf-lib@1.17.1
@pdf-lib/fontkit@1.1.1
NotoSans-Regular.ttf
```

są pobierane dopiero po kliknięciu `Eksportuj PDF`.

Kod eksportu nie znajduje się już w `vendor/pdf-lib.min.js`, lecz w jednoznacznie nazwanym pliku:

```text
TworzeniePostaci_v2-pdf.js
```

---

## 10. Eksport PDF

Zachowano polski profil PDF:

```text
./pdf/pl.pdf
```

Eksport obejmuje:

- dane postaci;
- atrybuty;
- wartości i sumy umiejętności;
- cechy pochodne;
- pasywną Czujność;
- pola Spaczenia;
- dynamiczny układ kolumnowy `Zdolności i Talenty`;
- dynamiczny układ kolumnowy `Notatki`;
- pole `Przeszłość`;
- font Noto Sans z obsługą polskich znaków;
- podgląd w nowej karcie;
- nazwę `PL-YYYY-MM-DD-HHmm.pdf`.

Formularz PDF pozostaje edytowalny, zgodnie z późniejszą decyzją projektową.

---

## 11. Usunięte pliki testowe

Po utworzeniu bezpośredniego punktu wejścia usunięto:

```text
Kalkulator/test.html
Kalkulator/test-loader.js
Kalkulator/test-firebase.js
Kalkulator/test-core.html
```

Historyczne analizy zawierające nazwę `test.html` pozostają bez zmian, ponieważ opisują rzeczywisty wcześniejszy etap projektu.

---

## 12. Pliki świadomie niezmienione

Zgodnie z poleceniem użytkownika nie aktualizowano aktywnej dokumentacji wskazanej w punkcie 10.2 pierwotnej analizy.

Nie zmieniano także:

```text
Kalkulator/index.html
Kalkulator/TworzeniePostaci.html
Kalkulator/config/firebase-config.js
```

`Kalkulator/index.html` miał już gotowy przycisk `Zaawansowany Kreator Postaci` prowadzący do `TworzeniePostaci_v2.html`.

---

## 13. Zmiany wykonane w kodzie

### Plik: `Kalkulator/TworzeniePostaci_v2.html`

Lokalizacja: cały nowy plik, szczególnie `<head>`, `.page-head`, `.section-heading-row` i modale.

Było:

```text
Brak samodzielnego pliku wersji 2. test.html uruchamiał loader pobierający test-core.html.
```

Jest:

```text
Bezpośredni, samodzielny punkt wejścia Zaawansowanego Kreatora Postaci.
```

Wprowadzono:

- tytuł karty `Zaawansowany Kreator Postaci`;
- widoczny nagłówek bez dopisku testowego;
- ukryty przełącznik języka;
- układ akcji podobny do klasycznego kreatora;
- przyciski zasad specjalnych i PDF obok `Atrybuty`;
- modale Firebase;
- brak lokalnego zapisu i resetu;
- responsywny breakpoint `760px`.

### Plik: `Kalkulator/TworzeniePostaci_v2-core.js`

Lokalizacja: cały nowy plik.

Było:

```text
Logika była osadzona wewnątrz test-core.html i zawierała localStorage.
```

Jest:

```text
Oddzielny rdzeń aplikacji bez localStorage i bez zależności od loadera HTML.
```

Rdzeń odpowiada za:

- renderowanie atrybutów, umiejętności i talentów;
- dynamiczne pary talentów;
- koszty PD;
- kontrolę Drzewa Nauki;
- dane postaci;
- zasady specjalne;
- cechy pochodne i ostrzeżenia;
- wspólne modale;
- publiczne API `window.WNGCreatorV2` dla Firebase i PDF.

### Plik: `Kalkulator/TworzeniePostaci_v2-firebase.js`

Lokalizacja: cały nowy plik.

Było:

```text
test-firebase.js zapisywał character_builder/test-v2 i wyświetlał techniczne komunikaty w warningMessage.
```

Jest:

```text
Moduł wersji 2 używa modali, docelowego character_builder/v2 i przejściowego fallbacku test-v2.
```

Firebase jest ładowane leniwie i nie dotyka `character_builder/current`.

### Plik: `Kalkulator/TworzeniePostaci_v2-pdf.js`

Lokalizacja: cały nowy plik.

Było:

```text
Kod biblioteki, loadery CDN oraz logika aplikacyjna eksportu były połączone w vendor/pdf-lib.min.js.
```

Jest:

```text
Cała logika eksportu aplikacji znajduje się w osobnym module i ładuje ciężkie zależności dopiero na żądanie.
```

### Plik: `Kalkulator/vendor/pdf-lib.min.js`

Lokalizacja: cały plik.

Było:

```text
Loader CDN, modyfikacja window.open, obliczenia, mapowanie PDF i eksport.
```

Jest:

```text
Mały plik zgodności informujący, że wersja 2 korzysta z TworzeniePostaci_v2-pdf.js.
```

### Plik: `Kalkulator/config/firestore.rules`

Lokalizacja: reguły `character_builder`.

Było:

```text
Dozwolone były character_builder/current i character_builder/test-v2.
```

Jest:

```text
Dozwolone są current, docelowe v2 oraz tymczasowe test-v2; pozostałe dokumenty są blokowane.
```

### Usunięte pliki

```text
Kalkulator/test.html
Kalkulator/test-loader.js
Kalkulator/test-firebase.js
Kalkulator/test-core.html
```

Usunięcie nastąpiło po utworzeniu bezpośredniego punktu wejścia i nowych modułów.

---

## 14. Testy wykonane i pozostałe testy ręczne

Kod nowych plików JavaScript został sprawdzony pod kątem składni przed zapisaniem.

Nie wykonano pełnego testu integracyjnego w prawdziwej przeglądarce z aktywnym projektem Firebase. Należy ręcznie sprawdzić:

1. otwarcie `Kalkulator/TworzeniePostaci_v2.html`;
2. brak widocznego selektora języka;
3. responsywny układ górnego panelu i nagłówka `Atrybuty`;
4. przeliczanie PD;
5. Drzewo Nauki;
6. dodawanie i usuwanie talentów;
7. dodawanie i usuwanie zasad specjalnych;
8. obliczenia cech pochodnych;
9. zapis i odczyt przy obecnych regułach przez fallback `test-v2`;
10. zapis i odczyt po wdrożeniu reguł `character_builder/v2`;
11. generowanie PDF;
12. poprawność polskich znaków i rozmieszczenia pól PDF;
13. brak zmian w `character_builder/current`;
14. niezależne działanie klasycznego `TworzeniePostaci.html`.

---

## 15. Następne kroki

1. Opublikować `Kalkulator/config/firestore.rules` w projekcie Firebase.
2. Przeprowadzić testy ręczne wersji 2.
3. Po potwierdzeniu migracji danych usunąć fallback oraz regułę dla `character_builder/test-v2`.
4. Dopiero po potwierdzeniu kompletnej wersji angielskiej można odsłonić `#languageSelect`.
5. Aktywną dokumentację modułu można zaktualizować w osobnym zadaniu, ponieważ w tym wdrożeniu użytkownik wyraźnie zabronił jej modyfikowania.

---

## 16. Wniosek końcowy

Wersja testowa została przekształcona w osobny, równolegle utrzymywany **Zaawansowany Kreator Postaci**. Nie używa dodatkowego loadera strony, nie zawiera lokalnego zapisu ani resetu, a ciężkie zależności Firebase i PDF są ładowane dopiero wtedy, gdy użytkownik faktycznie korzysta z odpowiadającej im funkcji.

Klasyczny kreator i jego dokument `character_builder/current` pozostają odseparowane od wersji 2.

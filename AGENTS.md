# AGENTS.md — instrukcje dla agentów pracujących w repozytorium `WrathAndGlory`

Repozytorium `WrathAndGlory` jest zbiorem modułów, czyli osobnych aplikacji umieszczonych w oddzielnych folderach.

Moduł `Main` zawiera stronę główną służącą do uruchamiania pozostałych modułów.

Niektóre moduły mogą korzystać ze wspólnych plików.

Przykład: `DataVault` i `GeneratorNPC` mogą korzystać z tego samego pliku `data.json` z tej samej lokalizacji.

Liczba modułów może się zmieniać. Przy każdej zmianie należy sprawdzić aktualną strukturę repozytorium, zamiast zakładać, że lista modułów jest stała.

---

## 1. Aktualizacja dokumentacji po zmianach w kodzie

Po każdej zmianie kodu któregokolwiek modułu należy zaktualizować dokumentację w odpowiednim folderze modułu:

- `docs/Documentation.md`
- `docs/README.md`

Jeżeli moduł nie ma jeszcze tych plików, należy je utworzyć.

Dokumentacja musi opisywać aktualny stan modułu po zmianach. Nie może opisywać nieaktualnego zachowania.

---

## 2. Zasady dla plików `README.md`

Pliki `README.md` mają zawierać szczegółową instrukcję użytkownika.

Instrukcja ma być napisana dla osoby, która nie zna programowania. Należy unikać technicznego języka, jeżeli nie jest potrzebny do korzystania z modułu.

`README.md` musi wyjaśniać:

- do czego służy dany moduł;
- jak go uruchomić;
- co i gdzie kliknąć;
- co powinno się stać po kliknięciu każdego przycisku;
- jak działa każda funkcja dostępna dla użytkownika;
- jak działa każda ważna mechanika modułu;
- co oznaczają komunikaty, pola, przełączniki i widoki;
- jak użytkownik powinien postępować w typowych sytuacjach;
- co zrobić, jeżeli pojawi się błąd lub pusty stan.

Celem `README.md` jest to, aby dowolna osoba po przeczytaniu instrukcji była w stanie w pełni korzystać z danego modułu.

---

## 3. Zasady dla plików `Documentation.md`

Pliki `Documentation.md` mają zawierać szczegółową dokumentację techniczną.

Dokumentacja techniczna może używać języka technicznego. Jej odbiorcą jest programista lub agent odtwarzający aplikację.

`Documentation.md` musi zawierać informacje o:

- strukturze plików modułu;
- stylach i layoutach;
- użytych kolorach, fontach, odstępach i zasadach responsywności;
- funkcjach JavaScript;
- logice działania modułu;
- sposobach obliczeń;
- mechanikach interfejsu;
- integracjach z Firebase;
- strukturze danych;
- zależnościach między plikami;
- zależnościach między modułami;
- skryptach pomocniczych, jeżeli występują;
- skryptach Node.js lub innych skryptach odtwarzających strukturę danych, jeżeli dotyczą modułu;
- procedurach odtworzenia modułu 1:1 w przypadku utraty plików.

Dokumentacja techniczna może zawierać fragmenty kodu, ale każdy fragment powinien być opisany:

- co robi;
- gdzie jest używany;
- dlaczego jest potrzebny.

Celem `Documentation.md` jest to, aby dowolny programista mający do dyspozycji tylko ten plik był w stanie odtworzyć cały moduł.

---

## 4. Dokumentacja nie jest changelogiem

Pliki `README.md` i `Documentation.md` mają zawierać wyłącznie aktualne informacje.

Nie należy dopisywać historii zmian w stylu:

- „wcześniej działało to inaczej”;
- „dodano nową funkcję”;
- „zmieniono zachowanie”;
- „stara wersja używała innego rozwiązania”.

Te pliki nie są changelogiem.

Jeżeli informacja historyczna nie jest potrzebna do korzystania z modułu lub odtworzenia aktualnej wersji, należy ją pominąć.

---

## 5. Układ wersji językowych

Dokumenty użytkowe muszą być podzielone na dwie główne części językowe:

1. pełna wersja polska;
2. pełna wersja angielska.

Nie wolno mieszać języków sekcja po sekcji.

Przy każdej wersji językowej musi znajdować się emotka z flagą oznaczającą dany język.

Poprawny układ:

```markdown
# 🇵🇱 Instrukcja dla użytkownika (PL)

Cała treść po polsku.

# 🇬🇧 User instructions (EN)

Full English version.
```

Niepoprawny układ:

```markdown
# Sekcja 1 PL

Treść po polsku.

# Section 1 EN

English text.

# Sekcja 2 PL

Treść po polsku.

# Section 2 EN

English text.
```

---

## 6. Zasady językowe

Nie wolno mieszać języka polskiego i angielskiego w jednej sekcji, jeżeli dokument ma osobne wersje językowe.

Wersja polska ma być kompletna sama w sobie.

Wersja angielska ma być kompletna sama w sobie.

Nie należy tworzyć dokumentów, w których każdy akapit polski jest natychmiast tłumaczony pod spodem na angielski.

---

## 7. Komentarze w plikach kodu

Pliki kodu muszą zawierać dokładne komentarze w języku polskim i angielskim.

Dotyczy to szczególnie plików:

- `*.html`
- `*.js`
- `*.css`

Komentarze powinny wyjaśniać funkcję danego fragmentu kodu, a nie tylko powtarzać nazwę zmiennej.

Przykład poprawnego komentarza:

```js
// --- Funkcja aktualizująca teksty w wybranym języku / Function to update texts in the selected language ---
```

Przykład poprawnego komentarza opisującego warunek:

```js
// Jeśli XP jest w normie, pokazujemy błąd "Drzewa Nauki" tylko wtedy, gdy zasada nie jest spełniona
// If XP is valid, show the "Tree of Learning" error only when the rule is broken
```

Komentarze powinny być aktualizowane razem z kodem.

Nie wolno zostawiać komentarzy opisujących stare lub nieistniejące zachowanie.

---

## 8. Zmiany layoutu, fontów i kolorów

Jeżeli zmiana dotyczy wyglądu aplikacji, należy zaktualizować plik:

- `DetaleLayout.md`

Dotyczy to w szczególności zmian w:

- fontach;
- kolorach;
- ikonach;
- tłach;
- ramkach;
- cieniach;
- odstępach;
- szerokościach;
- wysokościach;
- responsywności;
- układzie elementów;
- wyglądzie przycisków;
- wyglądzie formularzy;
- wyglądzie komunikatów.

`DetaleLayout.md` powinien opisywać aktualny wygląd aplikacji, a nie historię zmian.

---

## 9. Analizy niezwiązane bezpośrednio ze zmianą kodu

Jeżeli polecenie użytkownika nie dotyczy zmiany kodu, tylko analizy, należy zapisać wnioski w folderze:

- `Analizy`

Dla każdej analizy należy utworzyć nowy plik o nazwie adekwatnej do tematu analizy.

Nazwa pliku powinna jasno wskazywać, czego dotyczy analiza.

Przykład:

```text
Analizy/audyt-datavault-parser-xlsx.md
```

---

## 10. Kontekst promptu w plikach analitycznych

Jeżeli zapisywany jest plik z wynikami analizy, należy uwzględnić w nim prompt użytkownika.

Celem jest zachowanie kontekstu odpowiedzi i umożliwienie zrozumienia, dlaczego dana analiza została wykonana.

Plik analityczny powinien zawierać przynajmniej:

- datę analizy;
- temat analizy;
- oryginalny prompt użytkownika;
- zakres analizy;
- wnioski;
- rekomendacje;
- ewentualne ryzyka;
- ewentualne następne kroki.

---

## 11. Folder `Analizy` a dokumentacja użytkowa i techniczna

Folderu `Analizy` nie należy uwzględniać w dokumentacjach i instrukcjach modułów.

Nie należy opisywać folderu `Analizy` w:

- `README.md`;
- `Documentation.md`;
- instrukcjach użytkownika;
- dokumentacji odtworzeniowej modułów.

Wyjątek: można odwołać się do konkretnej analizy tylko wtedy, gdy użytkownik wyraźnie o to poprosi albo gdy analiza jest częścią wykonywanego zadania.

---

## 12. Zmiany kodu wykonywane na podstawie pliku analitycznego

Jeżeli polecenie użytkownika dotyczy zmiany kodu na podstawie pliku z analizą, po realizacji zadania należy zaktualizować ten plik analityczny.

Do pliku należy dopisać sekcję opisującą wszystkie wykonane zmiany w kodzie.

Sekcja musi zawierać:

- nazwę zmienionego pliku;
- numer linii lub możliwie dokładną lokalizację;
- opis stanu przed zmianą;
- opis stanu po zmianie.

Format zapisu:

````markdown
## Zmiany wykonane w kodzie

### Plik: `Second/app.js`

Lokalizacja: linia 24

Było:

```js
return false;
```

Jest:

```js
return true;
```
````

Jeżeli numer linii nie jest stabilny albo nie można go jednoznacznie ustalić, należy podać najbliższą nazwę funkcji, selektora lub sekcji kodu.

---

## 13. Ochrona danych wrażliwych

Nie wolno zapisywać w repozytorium danych wrażliwych.

Dotyczy to między innymi:

- tokenów;
- haseł;
- prywatnych kluczy;
- sekretów API;
- `TRIGGER_TOKEN`;
- danych logowania;
- prywatnych konfiguracji środowiskowych;
- plików zawierających realne sekrety produkcyjne.

Jeżeli kod wymaga wartości sekretnej, należy użyć placeholdera i opisać, gdzie użytkownik ma samodzielnie uzupełnić wartość.

Przykład:

```env
TRIGGER_TOKEN=TU_WSTAW_WLASNY_TOKEN
```

Jeżeli sekret został przypadkowo zapisany w repozytorium, należy go usunąć z aktualnej wersji plików i poinformować użytkownika, że taki sekret powinien zostać zrotowany.

---

## 14. Zasady pracy z repozytorium

Przed zmianami należy sprawdzić aktualny stan plików.

Nie należy zakładać, że wcześniejsza analiza nadal jest aktualna, jeżeli użytkownik poinformował, że ręcznie usunął foldery, przeniósł pliki albo wyczyścił część repozytorium.

Nie należy commitować zmian bez wyraźnej prośby użytkownika.

Jeżeli użytkownik prosi o przygotowanie treści pliku, należy podać treść w odpowiedzi albo zapisać plik lokalnie w rozmowie, zgodnie z poleceniem użytkownika.

Jeżeli użytkownik wyraźnie prosi o zapisanie pliku „tutaj”, nie należy tworzyć commita w repozytorium.

---

## 15. Zasady bezpieczeństwa przy module `DataVault`

Moduł `DataVault` jest szczególnie wrażliwy, ponieważ odpowiada za generowanie i przetwarzanie danych używanych przez inne moduły.

Nie wolno upraszczać parserów, generatorów ani fallbacków bez sprawdzenia, czy wynik generowania danych pozostaje identyczny.

Przed usunięciem lub zmianą logiki dotyczącej plików:

- `DataVault/Repozytorium.xlsx`
- `DataVault/data.json`
- `DataVault/build_json.py`
- `DataVault/xlsxCanonicalParser.js`
- `firebase-import.json`

należy porównać wynik generowania danych po wszystkich istotnych ścieżkach.

Szczególnie ważne jest zachowanie zgodności między:

- generowaniem przez `build_json.py`;
- generowaniem przez aplikację w przeglądarce;
- strukturą danych importowaną do Firebase.

---

## 16. Priorytet aktualności nad historią

Wszystkie pliki instrukcji i dokumentacji mają opisywać aktualny stan repozytorium.

Jeżeli repozytorium zostało ręcznie uporządkowane, usunięto foldery albo przeniesiono sekrety, dokumentacja i instrukcje muszą odzwierciedlać nowy stan.

Nie wolno zostawiać w dokumentacji informacji o plikach, folderach lub mechanikach, które już nie istnieją.

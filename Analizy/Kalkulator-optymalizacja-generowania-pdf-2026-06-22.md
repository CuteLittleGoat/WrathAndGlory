# Optymalizacja czasu generowania PDF — moduł Kalkulator

Data: 2026-06-22  
Zakres analizy: dokumentacja w `Analizy/` oraz aktualny kod eksportu PDF w `Kalkulator/TworzeniePostaci_v2-pdf.js`.

## 1. Cel i ograniczenia analizy

Celem było sprawdzenie, czy czas potrzebny aplikacji na wygenerowanie PDF można skrócić bez zmiany działania kalkulatora i bez pogorszenia poprawności eksportu.

W ramach tej analizy:

- nie zmieniono żadnego pliku kodu,
- nie przeprowadzono wdrożenia optymalizacji,
- nie zmieniono szablonu `Kalkulator/pdf/pl.pdf`,
- nie zmieniono mapowania pól ani wyglądu wynikowego dokumentu.

## 2. Wniosek główny

Generowanie PDF da się przyspieszyć. Największe prawdopodobne źródła opóźnienia nie znajdują się w obliczeniach kalkulatora, lecz w operacjach związanych z przygotowaniem dokumentu PDF:

1. ponownym pobieraniu szablonu `pl.pdf`,
2. ponownym pobieraniu fontu Noto Sans,
3. osadzaniu całego fontu z ustawieniem `subset: false`,
4. generowaniu wyglądu wielu pól formularza pojedynczo,
5. zapisie rozbudowanego dokumentu przez `pdfDoc.save()`.

Najbardziej obiecujący kierunek to połączenie cache zasobów z ponownym sprawdzeniem możliwości użycia `subset: true`.

## 3. Aktualna ścieżka generowania PDF

Po kliknięciu przycisku eksportu kod wykonuje kolejno:

1. otwarcie pustej karty pod podgląd,
2. załadowanie `pdf-lib` i `fontkit`, jeśli nie są jeszcze dostępne,
3. pobranie `./pdf/pl.pdf`,
4. załadowanie szablonu przez `PDFDocument.load()`,
5. pobranie fontu Noto Sans,
6. rejestrację `fontkit`,
7. osadzenie fontu w dokumencie,
8. pobranie danych z kalkulatora,
9. wypełnienie pól tekstowych i checkboxów,
10. usunięcie wybranych pól formularza,
11. rozrysowanie sekcji tekstowych bezpośrednio na stronach,
12. zapis dokumentu przez `pdfDoc.save()`,
13. utworzenie obiektu `Blob` lub `File`,
14. otwarcie wyniku w nowej karcie.

## 4. Zidentyfikowane wąskie gardła

### 4.1. Szablon `pl.pdf` jest pobierany z `cache: 'no-store'`

Aktualny kod używa:

```js
fetch('./pdf/pl.pdf', { cache: 'no-store' })
```

To wymusza ponowne pobranie statycznego szablonu przy każdym eksporcie, zamiast pozwolić przeglądarce użyć cache.

Konsekwencje:

- każde generowanie wykonuje nowe żądanie HTTP,
- czas eksportu zależy od połączenia i odpowiedzi serwera,
- kolejne eksporty nie korzystają w pełni z wcześniej pobranego pliku.

Możliwe usprawnienie:

- usunięcie `cache: 'no-store'`,
- albo pobranie szablonu tylko raz i zachowanie jego `ArrayBuffer` w pamięci modułu.

Przy każdym eksporcie nadal trzeba utworzyć nowy `PDFDocument`, ale nie ma potrzeby ponownego pobierania tych samych bajtów.

Ryzyko: niskie.

### 4.2. Font Noto Sans jest pobierany przy każdym eksporcie

Funkcja `embedFont(pdfDoc)` każdorazowo wykonuje:

```js
const response = await fetch(FONT_URL);
const bytes = await response.arrayBuffer();
return pdfDoc.embedFont(bytes, { subset: false });
```

Nawet jeżeli przeglądarka ma font w cache HTTP, kod nadal:

- tworzy nową odpowiedź,
- odczytuje ją do nowego `ArrayBuffer`,
- przekazuje font do ponownej analizy przez `fontkit`.

Możliwe usprawnienie:

- zachowanie bajtów fontu w zmiennej modułu, np. jako `fontBytesPromise`,
- pobieranie fontu tylko podczas pierwszego eksportu,
- ponowne używanie jego bajtów w kolejnych eksportach.

Nie można współdzielić gotowego obiektu fontu pomiędzy różnymi instancjami `PDFDocument`, ale można uniknąć ponownego pobierania pliku.

Ryzyko: niskie.

### 4.3. Osadzany jest pełny font: `subset: false`

Aktualny kod używa:

```js
pdfDoc.embedFont(fontBytes, { subset: false })
```

Oznacza to osadzanie pełnego fontu Noto Sans, a nie tylko znaków rzeczywiście użytych w dokumencie.

Możliwe skutki:

- więcej danych przetwarzanych przez `fontkit`,
- większy dokument wynikowy,
- dłuższy etap `embedFont()`,
- dłuższy etap `pdfDoc.save()`.

W starszej dokumentacji projektu rozwiązanie z polskimi znakami przewidywało:

```js
{ subset: true }
```

Dotychczasowe problemy z WinAnsi były związane przede wszystkim z globalnym `form.updateFieldAppearances()`, a nie jednoznacznie z tworzeniem podzbioru fontu. Aktualny kod aktualizuje wygląd pól osobno, dlatego warto ponownie przetestować `subset: true` na obecnej wersji eksportera.

Test musi obejmować co najmniej:

- wszystkie polskie znaki,
- długie dane tekstowe,
- pola formularza,
- tekst rysowany przez `page.drawText()`,
- drugą linię słów kluczowych,
- kilka eksportów wykonywanych kolejno.

Ryzyko: średnie.  
Potencjalny zysk: wysoki.

### 4.4. Wygląd każdego pola tekstowego jest generowany osobno

Dla każdego wypełnianego pola wykonywane jest:

```js
field.setText(text);
field.updateAppearances(font);
```

Dotyczy to między innymi:

- danych postaci,
- atrybutów,
- wartości umiejętności,
- sum umiejętności,
- cech pochodnych,
- słów kluczowych.

Takie podejście zostało przyjęte celowo, ponieważ wcześniejsza globalna aktualizacja formularza powodowała błędy WinAnsi dla polskich znaków.

Nie należy bez testów wracać do:

```js
form.updateFieldAppearances(font)
```

Możliwe usprawnienia bez zmiany przyjętej architektury:

- pomijanie pustych pól,
- niewykonywanie aktualizacji dla pól, które zaraz zostaną usunięte,
- sprawdzenie, czy niektóre pola liczbowe mogą pozostać przy wyglądzie ze wzorca PDF.

Ostatnia opcja wymaga ostrożności, ponieważ może zmienić wygląd albo sposób kodowania pól.

Ryzyko: od niskiego do średniego, zależnie od wariantu.

### 4.5. Pola przeznaczone do usunięcia są wcześniej czyszczone i odświeżane

Funkcja `removeTextField()` wykonuje obecnie:

```js
field.setText('');
field.updateAppearances(font);
form.removeField(field);
```

Eksporter stosuje ją do:

- ośmiu pól `Zdolności i talenty`,
- pola `Notatki 1`,
- pola `Przeszłość`.

Generowanie pustego wyglądu pola bezpośrednio przed jego usunięciem prawdopodobnie jest zbędne.

Do sprawdzenia:

```js
form.removeField(field)
```

bez wcześniejszego `setText('')` i `updateAppearances(font)`.

Ryzyko: niskie, ale wymagany test wynikowego PDF.

### 4.6. Wszystkie checkboxy są każdorazowo aktualizowane

Eksporter zawsze przechodzi przez 30 checkboxów i dla każdego wykonuje:

```js
field.check();
// albo
field.uncheck();
field.updateAppearances();
```

Jeżeli szablon `pl.pdf` ma wszystkie checkboxy domyślnie odznaczone, można rozważyć aktualizowanie tylko tych pól, które mają zostać zaznaczone.

Przed taką zmianą należy potwierdzić:

- domyślny stan każdego checkboxa w szablonie,
- czy nowy dokument zawsze powstaje z czystego szablonu,
- czy pominięcie `uncheck()` nie pozostawia starego wyglądu pola.

Ryzyko: średnie.  
Przewidywany zysk: mały lub umiarkowany.

### 4.7. Algorytm dopasowania tekstu wykonuje wiele powtarzalnych pomiarów

Funkcje `layout()` i `wrap()` wielokrotnie sprawdzają różne kombinacje:

- liczby kolumn,
- rozmiaru fontu,
- szerokości tekstu.

Dla każdej kombinacji tekst jest ponownie zawijany, a `font.widthOfTextAtSize()` wywoływane wielokrotnie dla tych samych lub podobnych fragmentów.

Możliwe usprawnienia:

- cache wyników pomiarów tekstu,
- cache zawinięcia tekstu dla pary `rozmiar fontu + szerokość`,
- ograniczenie liczby pełnych prób układu,
- wcześniejsze przerwanie obliczeń po przekroczeniu pojemności obszaru.

Ryzyko: średnie, ponieważ nie można zmienić końcowego układu treści.  
Przewidywany zysk: mniejszy niż w przypadku fontu i cache zasobów.

### 4.8. Biblioteki są ładowane dopiero po kliknięciu eksportu

`pdf-lib` i `fontkit` są ładowane na żądanie. Pierwszy eksport ponosi koszt pobrania i uruchomienia bibliotek, natomiast kolejne eksporty w tej samej karcie korzystają z `dependenciesPromise` i nie ładują ich ponownie.

To rozwiązanie jest poprawne z punktu widzenia czasu startu aplikacji, ale oznacza wolniejszy pierwszy eksport.

Możliwe warianty:

- pozostawić obecne zachowanie,
- rozpocząć ładowanie bibliotek po zakończeniu inicjalizacji strony,
- rozpocząć ładowanie po pierwszej interakcji użytkownika z kalkulatorem,
- rozpocząć ładowanie po najechaniu lub uzyskaniu fokusu przez przycisk eksportu.

Takie wstępne ładowanie nie skraca całkowitej pracy, ale przenosi jej część przed kliknięcie przycisku, dzięki czemu użytkownik krócej czeka po rozpoczęciu eksportu.

Ryzyko: niskie.  
Wpływ: przede wszystkim na odczuwalny czas pierwszego eksportu.

## 5. Elementy, które prawdopodobnie nie są główną przyczyną

### 5.1. Obliczenia kalkulatora

`window.WNGCreatorV2.getComputedData()` wykonuje standardowe obliczenia na niewielkiej liczbie pól. W porównaniu z analizą fontu, aktualizacją pól PDF i serializacją dokumentu koszt tej operacji powinien być mały.

### 5.2. Budowanie bucketów eksportowych

`buildEntries(data)` przechodzi jedynie po talentach i zasadach specjalnych. Liczba elementów jest niewielka i nie powinna powodować zauważalnego opóźnienia.

### 5.3. Tworzenie obiektu `Blob` lub `File`

Utworzenie pliku z gotowych bajtów oraz `URL.createObjectURL()` powinno być szybkie w porównaniu z wcześniejszym etapem generowania PDF.

## 6. Zalecana kolejność optymalizacji

### Etap 1 — pomiary bez zmiany zachowania

Dodać tymczasowe pomiary czasu dla:

1. `ensureDependencies()`,
2. pobrania `pl.pdf`,
3. `PDFDocument.load()`,
4. pobrania fontu,
5. `embedFont()`,
6. `fillStandard()`,
7. usuwania pól,
8. `drawArea()`,
9. `pdfDoc.save()`.

Najprostszy wariant może użyć `performance.now()` albo `console.time()`.

Pomiary powinny rozróżniać:

- pierwszy eksport po otwarciu strony,
- drugi eksport w tej samej karcie,
- eksport po odświeżeniu strony.

### Etap 2 — cache zasobów

Wprowadzić:

- cache bajtów `pl.pdf`,
- cache bajtów fontu,
- rezygnację z `cache: 'no-store'` dla statycznego szablonu.

Jest to najbezpieczniejszy zestaw zmian i powinien szczególnie przyspieszyć drugi oraz kolejne eksporty.

### Etap 3 — test `subset: true`

Przetestować osadzanie podzbioru fontu na aktualnym kodzie.

Należy porównać:

- czas `embedFont()`,
- czas `pdfDoc.save()`,
- rozmiar pliku wynikowego,
- poprawność polskich znaków,
- wygląd wszystkich pól.

### Etap 4 — usunięcie zbędnych aktualizacji pól

Sprawdzić możliwość:

- usuwania pól bez wcześniejszego generowania pustego wyglądu,
- ograniczenia liczby aktualizowanych checkboxów,
- pomijania zbędnych wywołań `updateAppearances()`.

### Etap 5 — optymalizacja układu tekstu

Dopiero po wykonaniu wcześniejszych kroków warto optymalizować `wrap()` i `layout()`, ponieważ najprawdopodobniej nie są one głównym źródłem opóźnienia.

## 7. Priorytety według relacji zysku do ryzyka

| Priorytet | Zmiana | Ryzyko | Potencjalny zysk |
| --- | --- | --- | --- |
| 1 | Cache bajtów szablonu `pl.pdf` | niskie | umiarkowany, szczególnie przy kolejnych eksportach |
| 2 | Cache bajtów fontu | niskie | umiarkowany |
| 3 | Usunięcie `cache: 'no-store'` | niskie | umiarkowany, zależny od środowiska |
| 4 | `subset: true` | średnie | wysoki |
| 5 | Usuwanie pól bez `updateAppearances()` | niskie | mały lub umiarkowany |
| 6 | Wstępne ładowanie bibliotek | niskie | poprawa odczuwalnego czasu pierwszego eksportu |
| 7 | Ograniczenie aktualizacji checkboxów | średnie | mały |
| 8 | Cache pomiarów tekstu w `wrap()` i `layout()` | średnie | mały lub umiarkowany |

## 8. Zalecany zakres testów regresji

Po każdej optymalizacji należy sprawdzić:

- eksport z pustymi i domyślnymi danymi,
- eksport z polskimi znakami: `Ś`, `Ż`, `Ź`, `Ć`, `Ń`, `Ł`, `Ó`, `Ą`, `Ę`,
- długie nazwy gatunku, archetypu i frakcji,
- długą listę słów kluczowych,
- maksymalną liczbę talentów i zasad specjalnych,
- wszystkie poziomy Spaczenia i odpowiadające checkboxy,
- przepełnienie sekcji `Zdolności i Talenty`, `Notatki` i `Przeszłość`,
- drugi eksport wykonany bez odświeżania strony,
- kilka kolejnych eksportów z różnymi danymi,
- brak przenikania danych z poprzedniego eksportu,
- poprawne otwieranie podglądu w nowej karcie,
- rozmiar wygenerowanego pliku PDF.

## 9. Rekomendacja końcowa

Najpierw należy dodać dokładne pomiary etapów eksportu, a następnie wdrożyć cache bajtów szablonu i fontu. Są to zmiany o niskim ryzyku, które nie powinny wpływać na wynikowy dokument.

Następnie warto przetestować `subset: true`, ponieważ może ono istotnie skrócić osadzanie fontu i zapis dokumentu oraz zmniejszyć rozmiar pliku. Ta zmiana wymaga jednak pełnego testu regresji obsługi polskich znaków i wyglądu pól formularza.

Nie zaleca się zaczynania od przebudowy algorytmu układania tekstu ani od powrotu do globalnego `form.updateFieldAppearances()`. Pierwsze prawdopodobnie daje mniejszy zysk, a drugie może ponownie wywołać udokumentowane problemy z kodowaniem WinAnsi.

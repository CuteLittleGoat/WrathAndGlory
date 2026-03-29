# Analiza modyfikacji modułu Infoczytnik — layout „Inkwizycja” na podstawie `Draft/Test.png`

Data: 2026-03-29  
Moduł: `Infoczytnik`

## Prompt użytkownika
> Przeprowadź analizę modyfikacji modułu Infoczytnik.\nTrzeba będzie zmodyfikować obszar na którym jest wyświetlany tekst (oraz prefixy, suffixy, logo i prostokąt z cieniem do efektu Flicker) w pliku Infoczytnik/assets/layouts/inquisition/DataSlate_Inq.png\nLayout o nazwie Inkwizycja z niego korzysta.\nDodałem plik Infoczytnik/Draft/Test.png\nJest to identyczny obrazek co Infoczytnik/assets/layouts/inquisition/DataSlate_Inq.png tylko dorysowałem żółtą ramkę. Chcę, żeby obszar na którym wyświetlany jest tekst (plus inne elementy z panelu GM) były wyświetlane na tym obszarze. Możesz policzyć pixele i obliczyć gdzie ma być granica obszaru.\n\nZapisz mi w nowym pliku z analizą czy to jest możliwe do wykonania i jakie kroki należy zrobić.

---

## 1) Czy to jest możliwe?
Tak — **jest to w pełni wykonalne** bez przebudowy architektury modułu.

Układ „Inkwizycja” już ma dedykowane ustawienia obszaru roboczego przez `SCREEN_INSETS.inquisition` w `Infoczytnik/Infoczytnik_test.html`, więc wystarczy podmienić wartości granic na nowe zgodne z żółtą ramką.

---

## 2) Wynik pomiaru pikseli (na podstawie `Infoczytnik/Draft/Test.png`)

Wykryta żółta ramka ma granice:
- **x = 77..649**
- **y = 49..837**
- rozdzielczość obrazu: **707 × 1023 px**

Ramka ma grubość ok. 5 px, więc praktycznie mamy dwa sensowne warianty obszaru:

### Wariant A (po zewnętrznej krawędzi żółtej ramki)
- left = 77 px
- top = 49 px
- right = 57 px
- bottom = 185 px

W procentach (dla CSS insetów):
- **left: 10.89%**
- **top: 4.79%**
- **right: 8.06%**
- **bottom: 18.08%**

### Wariant B (po wewnętrznej krawędzi żółtej ramki — bez „wchodzenia” na obrys)
- left = 82 px
- top = 54 px
- right = 62 px
- bottom = 190 px

W procentach:
- **left: 11.60%**
- **top: 5.28%**
- **right: 8.77%**
- **bottom: 18.57%**

### Rekomendacja
Dla tekstu + prefix/suffix/logo + prostokąta cienia (flicker) najbezpieczniejszy jest **Wariant B (wewnętrzny)**, bo ogranicza ryzyko dotykania żółtej krawędzi/docelowego obramowania graficznego.

---

## 3) Różnica względem obecnej konfiguracji
Obecnie dla Inkwizycji ustawione jest:
- `top: 14%`
- `right: 14%`
- `bottom: 26%`
- `left: 18%`

To jest znacząco mniejszy i bardziej centralny obszar niż ten zaznaczony na `Test.png`. Dlatego po zmianie wartości obszar treści wyraźnie się powiększy i przesunie bliżej krawędzi wskazanych przez ramkę.

---

## 4) Kroki wdrożenia

1. W `Infoczytnik/Infoczytnik_test.html` zaktualizować `SCREEN_INSETS.inquisition` na wartości z wybranego wariantu (rekomendowany B).  
2. W `Infoczytnik/GM_test.html` upewnić się, że podgląd (live preview) nie zakłada starych proporcji obszaru (jeżeli są tam jakiekolwiek mapowania per-layout, zsynchronizować je z nowym insetem).  
3. Przetestować ręcznie na długim i krótkim tekście:  
   - zawijanie prefix/suffix,  
   - pozycję i centrowanie logo,  
   - czy prostokąt cienia/flicker nie wychodzi poza nowy obszar.  
4. Jeśli prostokąt cienia ma mieć minimalny margines wewnętrzny względem obszaru tekstu, dodać osobny offset tylko dla overlay (np. +1–2%).

---

## 5) Gotowe wartości do wklejenia

### Opcja rekomendowana (Wariant B — wewnętrzna granica)
```js
inquisition: { top:"5.28%", right:"8.77%", bottom:"18.57%", left:"11.60%" }
```

### Opcja alternatywna (Wariant A — zewnętrzna granica)
```js
inquisition: { top:"4.79%", right:"8.06%", bottom:"18.08%", left:"10.89%" }
```

---

## 6) Ocena ryzyka
Niskie/średnie:
- niskie dla samej zmiany insetów,
- średnie wizualnie (może wymagać drobnej korekty 0.3–1.0% po testach na różnych viewportach).

Funkcjonalnie nie powinno to wpływać na backend, komunikację push ani logikę losowania treści.

---

## 7) Podsumowanie
Zmiana jest możliwa i prosta do wdrożenia.  
Najlepiej przyjąć granicę **wewnętrzną** żółtej ramki (Wariant B), a następnie wykonać krótki test wizualny na urządzeniu desktop + mobile i ewentualnie doprecyzować wartości o ułamki procenta.

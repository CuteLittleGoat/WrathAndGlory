# Main – opis wdrożenia poprawnego wyświetlania logo (2026-04-22)

## Prompt użytkownika

> Zapisz mi nowy plik w "Analizy" w którym dokładnie opisujesz co zrobiłeś, żeby logo wyświetlało się poprawnie.

## Co zostało zrobione

W module `Main` wdrożono poprawkę stabilizującą układ strony podczas startu, tak aby przyciski nie „przeskakiwały” po dociągnięciu obrazka logo.

### 1) Dodanie natywnych wymiarów obrazka logo (`width` i `height`)

W pliku `Main/index.html` element logo został zmieniony z krótkiej postaci:

```html
<img class="logo" src="wrath-glory-logo-warhammer.png" alt="Logo Wrath & Glory">
```

na wersję z jawnymi wymiarami:

```html
<img
  class="logo"
  src="wrath-glory-logo-warhammer.png"
  alt="Logo Wrath & Glory"
  width="1366"
  height="768"
>
```

Dlaczego to działa:
- przeglądarka zna proporcje obrazu (1366:768, czyli ok. 16:9) jeszcze zanim PNG zostanie pobrany,
- dzięki temu rezerwuje właściwą wysokość miejsca dla logo już w pierwszym przebiegu layoutu,
- kontener `main` od początku ma stabilną wysokość, więc przyciski pod logo nie przesuwają się po załadowaniu bitmapy.

### 2) Doprecyzowanie responsywnego zachowania logo (`height: auto`)

W regule CSS `.logo` w `Main/index.html` dopisano:

```css
height: auto;
```

Dlaczego to zostało dodane:
- przy obecnym `width: 100%` obraz i tak zachowywał proporcje,
- zapis jawny poprawia czytelność kodu i jednoznacznie dokumentuje, że wysokość ma wynikać z proporcji obrazu,
- ułatwia utrzymanie i zmniejsza ryzyko przypadkowych regresji przy przyszłych zmianach stylów.

### 3) Aktualizacja dokumentacji modułu Main

Zgodnie z zasadami repo po zmianie kodu modułu zostały zaktualizowane:
- `Main/docs/README.md` – dodano wpis aktualizacji (PL/EN) opisujący wdrożenie i efekt,
- `Main/docs/Documentation.md` – dodano techniczne szczegóły (atrybuty logo, powód zmiany, efekt na layout/CLS).

## Efekt końcowy

Poprawka usuwa wizualny efekt chwilowego „skakania” przycisków na starcie strony głównej:
- logo ma od razu poprawnie zarezerwowaną przestrzeń,
- układ panelu nie zmienia wysokości po dociągnięciu obrazka,
- odczuwalna stabilność pierwszego renderu jest lepsza (mniejszy CLS).

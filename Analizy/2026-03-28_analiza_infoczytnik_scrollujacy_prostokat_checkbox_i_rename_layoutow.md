# Analiza modułu Infoczytnik — scrollujący prostokąt, nowy checkbox w Panelu GM i rename folderów layoutów pergaminowych

Data: 2026-03-28  
Moduł: `Infoczytnik`

## Prompt użytkownika
> Przeczytaj analizy Analizy/2026-03-28_analiza_infoczytnik_nowy_layout_i_audio.md i Analizy/2026-03-28_analiza_infoczytnik_prostokat_z_cieniem.md
> A następnie przygotuj nową analizę.
> Będę chciał zmodyfikować moduł Infoczytnik, tak, żeby:
>
> 1. Prostokąt o którym mowa w 2026-03-28_analiza_infoczytnik_prostokat_z_cieniem.md nie był przyklejony tylko przesuwał się razem ze scrollowaniem tekstu.
>
> 2. W Paneli GM dodać checkbox włączający i wyłączający ten efekt. Wyłączenie ma automatycznie odznaczyć checkbox Flicker. Chceckbox ma być domyślnie zaznaczony.
>
> 3. W dwóch layoutach o których mowa w /2026-03-28_analiza_infoczytnik_nowy_layout_i_audio.md, czyli Infoczytnik/assets/layouts/Pismo_odreczne i Infoczytnik/assets/layouts/Pismo_ozdobne ta opcja ma być wyłączona bez możliwości włączenia.
>
> Dodatkowo, w tym samym pliku, przeprowadź analizę dotyczącą zmiany nazwy folderów z "Pismo_ozdobne" na "pismo_ozdobne" i "Pismo_odreczne" na "pismo_odreczne - sprawdź w jakich miejscach kodu trzeba będzie zmienić odnośniki.
>
> 4. W nowym pliku w Analizy zapisz wnioski. Dodatkowo napisz dokładnie jakie linie kodu w którym pliku będziesz zmieniać, żeby wprowadzić powyższe zmiany. Napisz dokładnie Plik, Linia kodu, Jak jest obecnie, jak powinno być po zmianie.
>
> Pisząc zmiany w kodzie zadbaj o to, żeby były już nowe nazwy (pisane z małych liter, żeby zachować spójność z pozostałymi folderami w "layout"

---

## 1) Stan obecny (na bazie kodu)

### 1.1 „Przyklejony prostokąt” i flicker
- Efekt prostokąta jest realizowany przez `.screen::after` (overlay absolutny) i dlatego jest „przyklejony” do okna czytnika, a nie przesuwa się z treścią.
- Flicker (`@keyframes flickerBg`) jest przypisany do tej samej warstwy `.screen::after`.
- Wniosek: aktualnie „prostokąt” i flicker są technicznie sprzężone jedną warstwą CSS.

### 1.2 Ograniczenia dla layoutów pergaminowych
- Już istnieje mechanizm `isRestrictedLayout(faction)` dla `pismo_odreczne` i `pismo_ozdobne`.
- W trybie restricted wymuszane są m.in.: `showLogo=false`, `flicker=false`, brak prefix/suffix i `disableMessageAudio=true`.
- To znaczy, że wymaganie „w tych 2 layoutach opcja ma być wyłączona bez możliwości włączenia” da się dopiąć spójnie do istniejącej logiki.

### 1.3 Nazwy folderów layoutów
- Na dysku foldery nadal mają wielkie litery: `assets/layouts/Pismo_odreczne` i `assets/layouts/Pismo_ozdobne`.
- Kod layout key już używa małych liter (`pismo_odreczne`, `pismo_ozdobne`), ale ścieżki do plików tła nadal wskazują katalogi z wielkiej litery.

---

## 2) Analiza funkcjonalna planowanych zmian

## 2.1 Cel 1: „prostokąt” ma scrollować się razem z treścią

### Rekomendacja implementacyjna
Najmniej ryzykowna opcja:
1. Dodać klasę trybu na `.screen` (np. `scrolling-overlay`).
2. Dla tej klasy wyłączyć aktualny pseudo-element `.screen::after` (`content:none`).
3. Narysować analogiczną warstwę tła na elementach treści (`.prefixRow`, `.message`, `.suffixRow`) przez dodatkową klasę, np. `.with-overlay`.

Efekt:
- Cień/prostokąt staje się częścią przewijanego contentu, więc „jedzie” ze scrollowaniem.
- Zachowany zostaje wizualny charakter efektu (przy ewentualnej korekcie intensywności).

> Uwaga: To nie będzie już maska całego viewportu `.screen`, tylko dekoracja obszaru treści. Wizualnie zbliżona, ale nie piksel-w-piksel do starego efektu.

## 2.2 Cel 2: nowy checkbox w Panelu GM

Wymagania użytkowe:
- checkbox (domyślnie **zaznaczony**) sterujący efektem prostokąta,
- wyłączenie tego checkboxa ma automatycznie odznaczyć `Flicker`.

### Rekomendowana logika
- Dodać nowe pole dokumentu Firestore: `movingOverlay` (boolean).
- W `GM_test.html`:
  - dodać checkbox `movingOverlay` (default checked),
  - na `change` jeśli `movingOverlay=false` => `flicker.checked=false`.
- W `Infoczytnik_test.html`:
  - odczytać `d.movingOverlay` (domyślnie `true`),
  - jeśli `movingOverlay=false`, usunąć klasy odpowiedzialne za overlay i wymusić brak flickera (lub zignorować flicker).

### 2.2.1 Czy musisz coś ręcznie zmieniać w Firebase? (odpowiedź na pytanie)

Krótko: **w typowym scenariuszu — nie, nie musisz ręcznie dodawać pola w Firebase Console**.

Dlaczego:
1. Firestore jest schemaless — nowe pole `movingOverlay` pojawi się automatycznie w `dataslate/current`, gdy `GM_test.html` zapisze dokument przez `set(...)`.
2. Moduł i tak pracuje na dokumencie `dataslate/current` (to widać na Twoich screenach), więc nowe pole dojdzie do tego samego dokumentu razem z resztą payloadu.
3. W kodzie odbiornika plan zakłada fallback: jeśli `movingOverlay` nie istnieje, traktujemy to jak `true` (`d.movingOverlay !== false`), więc brak pola nie wywali aplikacji.

Co warto sprawdzić/przygotować:
- **Firestore Rules**: tylko jeśli masz bardzo restrykcyjne reguły walidujące *konkretną listę kluczy* w dokumencie, wtedy trzeba dopisać `movingOverlay` do listy dozwolonych pól.
- **Brak potrzeby zmian w `dataslate/config`**: na screenie masz też dokument konfiguracyjny audio; ta zmiana dotyczy runtime message (`dataslate/current`), nie globalnej konfiguracji audio.
- **Brak migracji historycznej**: nie trzeba uruchamiać skryptu migracyjnego dla starszych dokumentów, bo i tak pracujesz na jednym dokumencie `current`, a fallback obsługuje brak pola.

### 2.2.2 Minimalny check po wdrożeniu (Firebase Console)
1. Wyślij wiadomość z `GM_test.html` z zaznaczonym checkboxem nowego efektu.
2. Otwórz `dataslate/current` i potwierdź obecność pola `movingOverlay: true`.
3. Odznacz checkbox, wyślij ponownie:
   - `movingOverlay` powinien być `false`,
   - `flicker` powinien automatycznie zapisać się jako `false` (zgodnie z wymaganiem).
4. Przełącz layout na `pismo_odreczne` lub `pismo_ozdobne` i wyślij:
   - `movingOverlay: false`,
   - `flicker: false`,
   - kontrolki w GM powinny być zablokowane (disabled).

## 2.3 Cel 3: w layoutach pergaminowych opcja wyłączona i zablokowana

Dla `pismo_odreczne` i `pismo_ozdobne`:
- `movingOverlay` ma być zawsze `false` po stronie GM (wyszarzone disabled).
- `flicker` ma zostać `false` (jak obecnie) i również disabled.
- Po stronie Infoczytnika dodać hard-guard: dla restricted layoutów nie aktywować overlay nawet gdyby ktoś podał `movingOverlay:true` ręcznie.

Wniosek: najlepiej rozszerzyć istniejące `updateRestrictedLayoutUi()` i istniejącą serializację dokumentu `set(...)`.

---

## 3) Analiza rename folderów

Zakres rename:
- `Infoczytnik/assets/layouts/Pismo_odreczne` → `Infoczytnik/assets/layouts/pismo_odreczne`
- `Infoczytnik/assets/layouts/Pismo_ozdobne` → `Infoczytnik/assets/layouts/pismo_ozdobne`

## 3.1 Miejsca w kodzie wymagające aktualizacji odnośników

### Krytyczne (runtime)
1. `Infoczytnik/Infoczytnik_test.html`
   - `LAYOUT_BG.pismo_odreczne` ścieżka do `Pergamin.jpg`
   - `LAYOUT_BG.pismo_ozdobne` ścieżka do `Pergamin.jpg`

Bez tej zmiany layouty pergaminowe nie załadują tła po rename folderów (szczególnie na hostingu Linux case-sensitive).

### Dokumentacja (zalecane do spójności repo)
2. `Infoczytnik/docs/README.md`
3. `Infoczytnik/docs/Documentation.md`

W tych plikach są wpisy z `Pismo_odreczne` i `Pismo_ozdobne`; po rename powinny zostać zaktualizowane do małych liter.

---

## 4) Dokładna lista planowanych zmian „Plik / Linia / Jak jest / Jak będzie”

Poniżej jest plan pod **wdrożenie kodowe** (to jeszcze nie jest wykonanie zmian):

| Plik | Linia(e) | Jak jest obecnie | Jak powinno być po zmianie |
|---|---:|---|---|
| `Infoczytnik/Infoczytnik_test.html` | 134–145 | `.screen::after` rysuje overlay i ma `animation: flickerBg 9s infinite;` | Overlay ma być aktywowany warunkowo klasą (np. `.screen.scrolling-overlay .contentLayer::before`) tak, aby był częścią przewijanego contentu. |
| `Infoczytnik/Infoczytnik_test.html` | 147–149 | `.screen.no-flicker::after { animation: none; }` | Przenieść wyłączanie animacji na nową warstwę (np. `.screen.no-flicker .contentLayer::before { animation:none; }`) lub wygasić cały overlay. |
| `Infoczytnik/Infoczytnik_test.html` | 283 | `pismo_odreczne: assets/layouts/Pismo_odreczne/Pergamin.jpg` | `pismo_odreczne: assets/layouts/pismo_odreczne/Pergamin.jpg` |
| `Infoczytnik/Infoczytnik_test.html` | 284 | `pismo_ozdobne: assets/layouts/Pismo_ozdobne/Pergamin.jpg` | `pismo_ozdobne: assets/layouts/pismo_ozdobne/Pergamin.jpg` |
| `Infoczytnik/Infoczytnik_test.html` | 530–535 | `restricted`, `showLogo`, `flicker` wyliczane bez `movingOverlay` | Dodać `movingOverlay` z guardem restricted: `const movingOverlay = restricted ? false : (d.movingOverlay !== false);` i zastosować do klas CSS. |
| `Infoczytnik/Infoczytnik_test.html` | okolice 399–405 | `setFlickerState(shouldFlicker)` steruje tylko klasą `no-flicker` | Rozszerzyć o zależność od `movingOverlay` (brak overlay => brak flickera niezależnie od flagi). |
| `Infoczytnik/GM_test.html` | 208–217 | Są tylko checkboxy `showLogo` i `flicker` | Dodać checkbox `movingOverlay` (domyślnie checked) obok istniejących opcji. |
| `Infoczytnik/GM_test.html` | 269–303 | Brak referencji `movingOverlay` w `el` | Dodać `movingOverlay: document.getElementById("movingOverlay")`. |
| `Infoczytnik/GM_test.html` | 525–537 | `updateRestrictedLayoutUi()` wyłącza `showLogo` i `flicker` | Rozszerzyć o `movingOverlay` (dla restricted: `checked=false`, `disabled=true`). |
| `Infoczytnik/GM_test.html` | 640–665 | `set(...)` dla message zapisuje `showLogo`, `flicker`, `disableMessageAudio` | Dodać `movingOverlay: restricted ? false : !!el.movingOverlay.checked`; jeśli `movingOverlay=false` wymusić `flicker:false`. |
| `Infoczytnik/GM_test.html` | 699–716 | `set(...)` dla ping zapisuje `showLogo`, `flicker` | Dodać `movingOverlay` + analogiczne wymuszenie `flicker:false` gdy `movingOverlay=false`. |
| `Infoczytnik/GM_test.html` | sekcja event-listeners (okolice końca pliku) | Brak synchronizacji overlay→flicker | Dodać listener `movingOverlay.change`: przy odznaczeniu automatycznie odznaczyć `flicker` i odświeżyć preview. |
| `Infoczytnik/docs/README.md` | 381, 388 | Ścieżki do `assets/layouts/Pismo_*` | Zmienić na `assets/layouts/pismo_*`. |
| `Infoczytnik/docs/Documentation.md` | 282–283, 786–787, 808–809 | Ścieżki do `assets/layouts/Pismo_*` | Zmienić na `assets/layouts/pismo_*`. |

---

## 5) Kolejność wdrożenia (proponowana)

1. Rename katalogów w `assets/layouts` na małe litery.
2. Natychmiastowa podmiana ścieżek w `LAYOUT_BG` (`Infoczytnik_test.html`) i test ładowania teł.
3. Dodanie checkboxa `movingOverlay` w `GM_test.html` + zapis pola do Firestore.
4. Refaktor CSS/JS w `Infoczytnik_test.html`, by overlay scrollował wraz z contentem.
5. Wymuszenia restricted layout (`pismo_odreczne`, `pismo_ozdobne`) po obu stronach.
6. Aktualizacja dokumentacji modułu (`docs/README.md`, `docs/Documentation.md`) po wykonaniu kodu.

---

## 6) Ryzyka i uwagi

1. **Sprzężenie flickera z warstwą overlay**  
   Zmiana architektury overlay może zmienić charakter animacji. Trzeba testować na krótkich i długich wiadomościach (z/bez scrolla).

2. **Case sensitivity po rename folderów**  
   Na Windows lokalnie może „działać przypadkiem”, na Linuxie produkcyjnym nie. Dlatego ścieżki muszą być 1:1 zgodne z nazwą katalogu.

3. **Spójność GM ↔ Infoczytnik**  
   Musi być podwójny guard: UI (disabled) + hard-guard w odbiorniku.

4. **Wymaganie użytkownika „odznacz flicker automatycznie”**  
   Należy zaimplementować wprost na event `movingOverlay` (nie tylko przy zapisie `set(...)`).

---

## 7) Podsumowanie

- Zmiana jest **wykonalna** bez przebudowy całego modułu, ale wymaga kontrolowanego refaktoru warstwy CSS overlay.
- Najbezpieczniejszy kierunek: nowa flaga `movingOverlay` + istniejący mechanizm restricted layout.
- Rename folderów do małych liter jest sensowny i wymaga obowiązkowo podmiany ścieżek runtime w `Infoczytnik_test.html`; dodatkowo warto zaktualizować dokumentację.
- W planie wdrożenia i tabeli powyżej wskazane są konkretne pliki i linie do edycji.

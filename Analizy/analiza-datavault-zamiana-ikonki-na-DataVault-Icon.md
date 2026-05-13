# Analiza: DataVault — zamiana ikonki "⟦⟧" na `DataVault/Icon.png`

## Data analizy
2026-05-13 (UTC)

## Temat analizy
Ocena zakresu i sposobu wdrożenia kosmetycznej zmiany w module `DataVault`: zastąpienie tekstowej ikonki `⟦⟧` obrazem `DataVault/Icon.png` w zielonym kwadracie z zachowaniem stałych wymiarów kontenera, tak aby nie występowało „skakanie” layoutu podczas doczytywania zasobów z serwera. Zmiana ma objąć zarówno widok administratora, jak i użytkownika.

## Oryginalny pełny prompt użytkownika
Przeprowadź analizę modyfikacji DataVault.
Nie będziemy zmieniać żadnej zasadniczej mechaniki czy sposobu działania strony, tylko kosmetykę.
W rogu aplikacji jest ikonka ⟦⟧
Chciałbym, żeby zamiast niej w zielonym kwadracie wyświetlała się ikona DataVault/Icon.png
Zadbaj o to, żeby pole na ikonę miało stałe rozmiary, żeby przy doczytywaniu z serwera nic nie "skakało" po ekranie. Podobny mechanizm istnieje np. w module Main.
Zmiana ma dotyczyć widoku administratora i użytkownika.

Przeprowadź analizę wprowadzenia takiej 
zmiany.

## Zakres analizy
- Identyfikacja miejsca renderowania ikonki w nagłówku `DataVault`.
- Weryfikacja stylów odpowiadających za rozmiar i zachowanie pola ikony.
- Ocena wpływu na tryb admin/user.
- Wskazanie minimalnego i bezpiecznego zakresu zmian (HTML/CSS) bez ingerencji w logikę danych, parsery i mechaniki działania.
- Ocena ryzyk (layout, dostępność, wydajność, cache).

## Stan obecny (na podstawie kodu)
1. Ikonka rogu nagłówka jest obecnie tekstem `⟦⟧` renderowanym w elemencie:
   - `DataVault/index.html` → `<div class="sigil">⟦⟧</div>` wewnątrz sekcji `.brand` w `.topbar`.
2. Kontener `.sigil` ma już stały rozmiar i zielony styl:
   - `width:44px; height:44px; display:grid; place-items:center; border:1px solid var(--b); background:rgba(22,198,12,.04); ...`
   - To jest dobra baza do osadzenia obrazka bez zmiany mechaniki UI.
3. Plik docelowej ikony istnieje:
   - `DataVault/Icon.png`.
4. Widok admin/user wykorzystuje wspólny nagłówek (`.topbar`) i ten sam blok `.brand`, więc pojedyncza zmiana w tym miejscu obejmie oba tryby bez dodatkowych warunków JS.

## Proponowany sposób wdrożenia (bez zmiany mechaniki)
### 1) Zmiana HTML (minimalna)
Zastąpić tekst `⟦⟧` obrazem w istniejącym kontenerze `.sigil`, np.:

- kontener pozostaje `<div class="sigil">...</div>`
- wewnątrz dodać `<img class="sigilIcon" src="Icon.png" alt="DataVault" width="32" height="32" decoding="async" loading="eager">`

Uwagi:
- `width` i `height` w znaczniku `<img>` rezerwują miejsce zanim obraz się wyrenderuje, co ogranicza CLS.
- `loading="eager"` dla małej ikony w topbarze jest uzasadnione (element above-the-fold).
- ścieżka względna `Icon.png` jest poprawna dla `DataVault/index.html`.

### 2) Zmiana CSS (stabilność i brak „skakania”)
Dodać styl np.:
- `.sigil { overflow:hidden; }`
- `.sigilIcon { width:32px; height:32px; display:block; object-fit:contain; }`

Opcjonalnie, gdyby ikona miała nieregularne marginesy wewnętrzne PNG:
- dopracować do `30px` lub `34px` bez zmiany zewnętrznego `44x44`.

### 3) Brak zmian JS
Nie ma potrzeby modyfikacji `app.js`, ponieważ:
- brak zależności logicznych od znaku `⟦⟧`;
- element jest czysto prezentacyjny.

## Dlaczego zmiana obejmie administratora i użytkownika
Nagłówek z `.brand` jest wspólny niezależnie od trybu pracy (admin/player). Tryby przełączają funkcje i kontrolki, ale nie duplikują struktury topbara. W praktyce jedna modyfikacja w `index.html` + `style.css` pokrywa oba przypadki.

## Wpływ na mechaniki krytyczne DataVault
Brak wpływu na:
- generowanie `data.json` i `firebase-import.json`,
- parser kanoniczny XLSX,
- ładowanie danych z Firebase,
- logikę filtrów, zakładek, porównań i tłumaczeń.

Zmiana jest wyłącznie kosmetyczna i dotyczy warstwy prezentacji nagłówka.

## Ryzyka i punkty kontrolne
1. **Czytelność ikony na zielonym tle**
   - Jeśli `Icon.png` ma ciemną paletę, może być słabo widoczna; wtedy doprecyzować rozmiar lub subtelny kontrast tła `.sigil`.
2. **Różnice renderowania na mobile/desktop**
   - Sprawdzić, czy przy zwijaniu topbara ikona nie powoduje przesunięć wysokości rzędu.
3. **Cache przeglądarki**
   - Przy podmianie assetu o tej samej nazwie możliwe opóźnione odświeżenie. W tym przypadku używamy istniejącego pliku, więc zalecany test hard refresh.
4. **Fallback przy błędzie ładowania obrazka**
   - Opcjonalnie można zostawić fallback tekstowy przez pseudo-element lub `onerror`, ale nie jest to wymagane dla zmiany kosmetycznej.

## Rekomendacje wdrożeniowe
1. Wykonać minimalny patch w `DataVault/index.html` i `DataVault/style.css`.
2. Zachować stały kontener 44x44 i jawne wymiary obrazka (np. 32x32).
3. Po wdrożeniu zweryfikować:
   - widok administratora,
   - widok użytkownika,
   - brak skoków layoutu przy pierwszym ładowaniu.
4. Zgodnie z zasadami repo, po wdrożeniu kodu zaktualizować:
   - `DataVault/docs/README.md`,
   - `DataVault/docs/Documentation.md`,
   - oraz `DetaleLayout.md` (bo zmiana dotyczy ikony/warstwy wizualnej).

## Następne kroki
- Jeśli zatwierdzasz analizę, kolejnym krokiem będzie implementacja zgodnie z powyższym planem (HTML+CSS), testy UI i aktualizacja dokumentacji modułu.

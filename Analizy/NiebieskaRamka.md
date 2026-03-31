# Analiza: Niebieska ramka / obszar tekstowy / zasady przewijania

**Data:** 2026-03-31  
**Moduł:** `Infoczytnik` (`GM_test.html`, `Infoczytnik_test.html`)  
**Zakres:** wyłącznie analiza (bez zmian w kodzie)

## Prompt użytkownika (zachowanie kontekstu)

> Przeczytaj analizę:
> Analizy/Infoczytnik_analiza_przebudowy_layout_i_dropdown_2026-03-30.md
>
> zwłaszcza w zakresie ustawienia pola tekstowego na obrazkach tła.
>
> Prostokąt cienia powinien obejmować pole niebieskiej ramki.
> Wszystkie pozostałe elementy (wiadomość, prefixy, suffixy, logo) powinny być wewnątrz obszaru "prostokąt cienia".
>
> Mapowanie plików tła do plików z zaznaczoną niebieską ramką masz w Infoczytnik/Draft/Mapowanie.xlsx
>
> Powtórzę wymagania:
>
> 1. Prefixy i suffixy mają mieć wycentrowanie do środka w poziomie i do góry w pionie (względem obszaru wyznaczonego przez niebieską ramkę)
> 2. Prefixy mają być tuż pod górną krawędzią miejsca wyznaczonego przez ramkę
> 3. Logo zawsze ma mieć swoje miejsce obok prefixów w prawym górnym rogu wyznaczonym przez pole niebieskiej ramki
> 4. Jeżeli prefix jest długi to nie może nachodzić na logo. Musi się zawijać do nowej linii.
> 5. Jeżeli nie ma logo to prefix może zajmować cały obszar od lewej do prawej strony pola wyznaczonego przez niebieskie pole.
> 6. Treść wiadomości musi być wycentrowana do lewej w poziomie i do góry w pionie (względem obszaru wyznaczonego przez niebieską ramkę)
> 7. Pod treścią wiadomości ma byc wyświetlany suffix.
> 8. Suffix ma być wycentrowany do środka w poziomie i do dołu w pionie (względem obszaru wyznaczonego przez niebieską ramkę)
> 9. Prostokąt cienia musi zajmować całe pole wyznaczone przez niebieską ramkę.
> 10. Prefixy i suffixy w przypadku długich treści mogą się łamać na nowe linie
> 11. Łamanie nowych linii nie może dzielić wyrazów.
> 12. Między polem na prefixy i suffixy a polem na treść wiadomości musi być symetrycznie równy odstęp.
> 13. Wysokość pola na prefixy i suffixy może się zmieniać w zależności od liczby linii (ustalane w panelu GM)
>
> Dodałem plik Infoczytnik/Draft/Obszary.jpg ze schematem jak ma to wyglądać:
> - Białe tło symbolizuje obszar obrazka tła
> - Niebieska ramka oznacza zobszar zaznaczony niebieską ramką zgodnie z mapowaniem w Infoczytnik/Draft/Mapowanie.xlsx
> - Pole z żółtą ramką to miejsca na prefixy i suffixy.
> - Szare tło symbolizuje obszar prostokąta cienia
> - Pole z pomarańczową ramką to miejsce na logo
> - Pole z zieloną ramką to miejsce na treść wiadomości.
>
> Zasady przewijania:
> 1. Obszar cienia nie może się przewijać. Musi być zawsze widoczny (jeżeli jest aktywny poprzez zaznaczony checkbox)
> 2. Prefixy i logo mają się przewijać. Czyli jak użytkownik przescrolluje w dół to mają zniknąć ponad górną krawędzią ekranu
> 3. Podobna zasada ma dotyczyć suffixów. Pojawią się dopiero jak użytkownik przescrolluje w dół do końca treści wiadomości.
> 4. Nie powinno być scrollowania w lewo i prawo.
> 5. Treść wiadomości ma się zawijać, ale bez dzielenia wyrazów.
>
> Dodatkowa zasada checkboxów:
> 1. Jeżeli użytkownik odznaczy checkbox "Prostokąt cienia" to automatycznie odznacza się "Flicker" i nie da się go włączyć. Dodaj komunikatinformacyjny, że do działania jest wymagany prostokąt cienia
> 2. Jeżeli użytkownik zaznaczy "Prostokąt cienia" to może zaznaczyć lub odznaczyć "Flicker".
>
> Wyniki analizy zapisz w nowym pliku "NiebieskaRamka.md"
> Nie zmieniaj nic w kodzie. Przygotuj dokładną analizę kodu na stan obecny oraz jakie zmiany są potrzebne, żeby wprowadzić opisane wyżej funkcjonalności.

---

## 1. Co jest teraz (stan aktualny kodu)

## 1.1. Geometria obszaru ramki / prostokąta cienia

W `Infoczytnik_test.html` pozycja i rozmiar obszaru tekstowego (`#overlay`) są wyliczane procentowo z mapy `CONTENT_RECTS_BY_BACKGROUND_ID` (dla ID tła 1..9). Sam obszar jest prawidłowo dopasowywany do renderowanego obrazu tła (`object-fit: contain`) przez `fitOverlayToBackground()`.

To znaczy:
- techniczny fundament „obszar zależny od niebieskiej ramki” już istnieje,
- ale nie jest jeszcze wdrożony układ wewnętrzny zgodny ze schematem `Obszary.jpg`.

## 1.2. Struktura elementów wewnątrz overlay

Aktualnie `#overlay` zawiera `.box`, a w nim trzy bloki pionowo:
1) `#prefix`,
2) `#msg`,
3) `#suffix`.

Logo (`#logo`) jest **poza** `#overlay` i pozycjonowane absolutnie osobno.

Konsekwencja:
- wymóg „wszystko wewnątrz prostokąta cienia” nie jest spełniony 1:1,
- logo nie uczestniczy w tym samym flow układu co prefix, więc łatwo o nachodzenie.

## 1.3. Zachowanie przewijania

Aktualnie ekran używa:
- `.screen { overflow: hidden; }`
- `.overlay { overflow: hidden; }`
- `.box { overflow: hidden; }`

Czyli nie ma realnego pionowego scrolla treści wiadomości. Prefix, message i suffix są „zamknięte” w statycznym bloku.

Konsekwencja:
- wymagania o scrollu (prefix/logo znikają przy przewijaniu, suffix pojawia się na dole) nie są obecnie możliwe bez przebudowy struktury.

## 1.4. Łamanie linii i dzielenie wyrazów

W `.box` jest `white-space: pre-line`, co zachowuje nowe linie, ale brak jawnych zasad typu:
- `overflow-wrap: normal` / `word-break: normal` / `hyphens: manual`.

Efekt:
- zachowanie zależy od domyślnych reguł przeglądarki,
- brak gwarancji „nie dziel wyrazów”.

## 1.5. Checkbox „Prostokąt cienia” vs „Flicker” w GM

W `GM_test.html` checkboksy istnieją, ale brak logiki zależności:
- odznaczenie `movingOverlay` NIE wyłącza automatycznie `flicker`,
- `flicker` nie jest blokowany (`disabled`) gdy `movingOverlay=false`,
- brak komunikatu informacyjnego.

## 1.6. Mapowanie tła do ramki

`Infoczytnik/Draft/Mapowanie.xlsx` zawiera pełną tabelę 1..9 (`ID`, `Nazwa`, `Plik`, `Ramka`) i jest zgodne z listą teł runtime (`assets/data/data.json`).

Wniosek:
- mapowanie źródłowe jest kompletne,
- można bezpośrednio utrzymać/skalibrować `CONTENT_RECTS_BY_BACKGROUND_ID` pod każdy background.

---

## 2. Macierz zgodności: wymaganie vs stan obecny

1. **Prefix/suffix centrowane poziomo, przy górze** → **częściowo** (centrowanie jest, ale brak dedykowanego górnego regionu prefix/suffix).
2. **Prefix tuż pod górną krawędzią ramki** → **nie** (brak dedykowanego top-area i kolizji z logo).
3. **Logo obok prefixów w prawym górnym rogu pola** → **częściowo** (prawy górny róg jest, ale logo jest poza overlay-flow).
4. **Długi prefix nie nachodzi na logo, zawija się** → **nie** (brak układu rezerwującego miejsce na logo).
5. **Bez logo prefix używa całej szerokości** → **niepełne** (nie ma warunkowego grid/flex-obszaru).
6. **Treść wiadomości: left + top** → **częściowo** (left jest; top zależny od flow, bez dedykowanego regionu).
7. **Suffix pod treścią** → **tak/niepełne** (jest pod treścią w DOM, ale nie wg wymaganego modelu przewijania).
8. **Suffix: center + dół** → **nie** (brak bottom-area i logiki „pojawia się na końcu scrolla”).
9. **Prostokąt cienia = całe niebieskie pole** → **tak** geometrycznie; **niepełne** logicznie (zawartość i logo nie są w pełni „w środku” architektury).
10. **Prefix/suffix mogą się łamać** → **częściowo**.
11. **Bez dzielenia wyrazów** → **niegwarantowane**.
12. **Symetryczny odstęp między fillerami i treścią** → **nie** (brak jawnie rozdzielonych stref).
13. **Wysokość pola prefix/suffix zależna od liczby linii z GM** → **nie** (obecnie jest tylko liczba linii losowanych treści, bez sterowania wysokością strefy).

Scroll:
1. cień zawsze widoczny → **tak** (brak scrolla);
2. prefix/logo przewijają się i znikają → **nie**;
3. suffix pojawia się na końcu → **nie**;
4. brak scrolla poziomego → **tak**;
5. treść zawija bez dzielenia wyrazów → **niegwarantowane**.

Checkbox:
1. `Prostokąt cienia OFF` => `Flicker OFF + disabled + info` → **nie**,
2. `Prostokąt cienia ON` => `Flicker` możliwy → **częściowo** (jest możliwy, ale brak reguły sterującej).

---

## 3. Minimalny zakres zmian potrzebnych do wdrożenia

## 3.1. Przebudowa DOM/CSS po stronie `Infoczytnik_test.html`

Trzeba zmienić strukturę `#overlay` na trzy strefy logiczne (zgodnie z `Obszary.jpg`):

1) **Top band (żółta strefa górna):**
- lewa część: `prefix` (wielolinijkowy),
- prawa część: `logo` (stałe miejsce).

2) **Message region (zielona strefa środkowa):**
- właściwa treść wiadomości,
- wyrównanie lewo + góra,
- zawijanie bez łamania wyrazów,
- pionowy scroll tylko w osi Y.

3) **Bottom band (żółta strefa dolna):**
- `suffix` wyśrodkowany poziomo,
- osadzenie przy dole strefy.

Dodatkowo:
- `#logo` powinno zostać przeniesione do wnętrza `#overlay` (lub „slotowane” do top band),
- sam `#overlay` dalej odpowiada za obszar cienia (100% obszaru niebieskiej ramki).

## 3.2. Model przewijania (kluczowy)

Aby spełnić wymagania scrolla:
- `#overlay` (obszar cienia) ma być **fixed geometry** względem ramki i nie scrolluje się,
- wewnątrz `#overlay` wprowadzamy kontener scrollowalny tylko pionowo (`overflow-y: auto; overflow-x: hidden;`),
- `prefix + logo` umieszczamy na początku zawartości scrollowanej,
- `suffix` umieszczamy na końcu tej zawartości.

Wtedy naturalnie:
- na starcie widoczne są prefix/logo,
- przy scrollu w dół znikają nad górną krawędzią,
- suffix pojawia się dopiero przy dolnych partiach treści.

## 3.3. Warunek „prefix nie nachodzi na logo”

Top band powinien działać w trybie:
- z logo: dwie kolumny (`prefix area` + `logo slot`),
- bez logo: jedna kolumna pełnej szerokości dla prefix.

Niezbędne reguły:
- `prefix` ma `white-space: pre-wrap`,
- `overflow-wrap: break-word` **nie** (to może łamać słowa),
- preferowane `overflow-wrap: normal; word-break: normal; hyphens: manual;`.

Jeżeli konieczne, szerokość slotu logo kontrolowana procentowo, np. `logoCol = clamp(56px, 14%, 120px)`.

## 3.4. Symetryczne odstępy i dynamiczna wysokość stref fillerów

Wymagana jest nowa wartość runtime (np. `fillerAreaLines` lub `fillerAreaFactor`) wysyłana z GM. Obecne `fillerLineCount` steruje tylko ilością wylosowanych linii, nie wysokością strefy.

Propozycja:
- dodać osobny parametr wysokości strefy `fillerBandHeightPx` **albo** obliczenie z liczby linii i `line-height`,
- top band i bottom band mają tę samą wysokość (symetria),
- message region = pozostała przestrzeń między nimi.

## 3.5. Uporządkowanie pozycjonowania logo

Po przeniesieniu do `overlay` należy usunąć niezależne wyliczanie `logo.top/left` w `fitOverlayToBackground()`. Obecne liczenie absolutne będzie konfliktować z nowym układem stref.

## 3.6. Reguły checkboxów w `GM_test.html`

Dodać logikę sterowania:
- jeśli `movingOverlay=false`:
  - automatycznie `flicker=false`,
  - `flicker.disabled=true`,
  - komunikat „Flicker wymaga włączonego prostokąta cienia”.
- jeśli `movingOverlay=true`:
  - `flicker.disabled=false`.

Ta sama reguła powinna być wymuszana także przy budowie payloadu (ochrona przed ręcznym obejściem UI).

## 3.7. Ujednolicenie zasad zawijania tekstu

Dla `prefix`, `msg`, `suffix` ustawić jawnie:
- `white-space: pre-wrap;`
- `word-break: normal;`
- `overflow-wrap: normal;`
- `hyphens: manual;`
- `overflow-x: hidden;`

To daje zawijanie do nowych linii bez dzielenia słów i bez poziomego scrolla.

---

## 4. Weryfikacja mapowania i gotowość danych

`Mapowanie.xlsx` zawiera komplet 9 rekordów i paruje się z aktualnym `backgroundId` 1..9 używanym w kodzie. To pozwala na:
1. utrzymanie obecnych procentowych `CONTENT_RECTS_BY_BACKGROUND_ID` jako etap przejściowy,
2. lub pełną regenerację tych wartości na podstawie plików `*_ramka.png` (jak w wcześniejszej analizie).

Rekomendacja techniczna:
- przechowywać recty procentowo (`x,y,w,h`) — to już jest zgodne z obecnym mechanizmem skalowania i dobrze wspiera różne viewporty.

---

## 5. Kolejność wdrożenia (bez ryzyka regresji)

1. **Etap A (layout):** przebudować DOM/CSS overlay na top/message/bottom + logo w top band.  
2. **Etap B (scroll):** włączyć pionowy scroll w obszarze treści overlay i wyłączyć poziomy.  
3. **Etap C (reguły tekstu):** twarde zasady zawijania bez dzielenia wyrazów.  
4. **Etap D (GM):** zależność `Prostokąt cienia -> Flicker` + komunikat + walidacja payloadu.  
5. **Etap E (strojenie):** kalibracja wysokości bandów prefix/suffix i odstępów symetrycznych wg danych z panelu GM.

---

## 6. Ryzyka i punkty kontrolne testów

1. **Bardzo długie prefixy:** czy zawijają się i nie nachodzą na logo.  
2. **Brak logo:** czy prefix rozszerza się na pełną szerokość.  
3. **Długi message:** czy pojawia się wyłącznie scroll pionowy.  
4. **Suffix:** czy pojawia się dopiero w dolnej partii scrolla.  
5. **OFF prostokąt cienia:** czy flicker gaśnie, blokuje się i pokazuje komunikat.  
6. **Zmiana tła 1..9:** czy overlay stale pokrywa pole niebieskiej ramki.  
7. **Responsywność:** desktop + tablet + telefon (szczególnie pozycja logo i wysokości stref).

---

## 7. Podsumowanie

Stan aktualny jest dobrą bazą geometryczną (overlay w obszarze ramki), ale nie spełnia kluczowych wymagań funkcjonalnych dotyczących:
- wspólnego obszaru dla wszystkich elementów (zwłaszcza logo),
- modelu przewijania (prefix/logo i suffix względem scrolla),
- zależności checkboxów `Prostokąt cienia` / `Flicker`,
- jawnych reguł zawijania bez dzielenia wyrazów,
- dynamicznej wysokości stref fillerów sterowanej z GM.

Do wdrożenia potrzebna jest przede wszystkim przebudowa **wewnętrznej architektury overlay** (DOM+CSS+scroll), a nie zmiana samego mechanizmu pozycjonowania overlay względem tła.

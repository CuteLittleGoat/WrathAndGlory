# Analiza modyfikacji modułu Infoczytnik – podgląd tła

## Prompt użytkownika
> Przeprowadź analizę modyfikacji modułu Infoczytnik.
>
> Przygotowałem screeny widoku z Panelu GM:
> Analizy/01.jpg
> Analizy/02.jpg
> Analizy/03.jpg
> Analizy/04.jpg
>
> Trzeba zmodyfikować sposób wyświetlania podglądu wybranego pliku tła.
> Obecnie w okienku podglądu jest wyświetlany tylko fragment.
> To jest niewystarczające, ponieważ mogą być dwa pliki tła różniące się np. jednym detalem w górnej części obrazka.
> Zaproponuj kilka rozwiązań, żeby podgląd był użyteczniejszy.
>
> Plik z analizą nazwij "Podgląd.md"

## Kontekst problemu (na podstawie screenów 01–04)
W panelu GM mini-podgląd pokazuje tylko wycinek tła (obszar z tekstem komunikatu), a nie cały obraz. Przy wyborze teł o podobnej stylistyce taki podgląd utrudnia porównanie, ponieważ:
- nie widać górnej i dolnej części grafiki,
- nie widać pełnego układu ramek/ornamentów,
- detale różnicujące warianty mogą być poza aktualnym wycinkiem.

## Cele UX dla nowego podglądu
1. Użytkownik ma szybko odróżnić podobne tła.
2. Podgląd ma nadal pokazywać „realny wygląd” wiadomości (tekst, fillery, logo).
3. Zmiana nie może znacząco obniżyć czytelności panelu i wydajności.

---

## Proponowane rozwiązania

### 1) Tryb przełączany: „Wycinek / Całość” (rekomendowane jako baza)
**Opis:**
- Dodać prosty przełącznik przy podglądzie: `Podgląd: [Wycinek] [Całość]`.
- `Wycinek` = obecne zachowanie (pixel-perfect względem okna gracza).
- `Całość` = cały obraz tła skalowany do rozmiaru ramki podglądu (`contain`).

**Zalety:**
- Minimalna ingerencja w obecny workflow.
- Użytkownik ma oba tryby: weryfikacja detali + kontrola finalnego kadru.
- Niskie ryzyko regresji.

**Wady:**
- W trybie „Całość” realny obszar tekstu jest mniejszy i mniej czytelny.

**Wniosek:**
Najbardziej praktyczny pierwszy krok do wdrożenia.

---

### 2) Podgląd podzielony (split preview): „Cały obraz + podgląd finalny”
**Opis:**
- Pokazać dwa boksy obok siebie (lub jeden pod drugim):
  - **A. Pełne tło** – miniatura całego obrazka.
  - **B. Finalny kadr** – obecny wycinek z naniesioną treścią.
- W wariancie rozszerzonym: na miniaturze „Całość” nałożyć ramkę pokazującą obszar kadrowania finalnego widoku.

**Zalety:**
- Najlepsza informacyjnie forma (pełna orientacja + finalny efekt).
- Bardzo dobre porównywanie podobnych wariantów.

**Wady:**
- Zajmuje więcej miejsca w panelu.
- Wymaga dopracowania responsywności.

**Wniosek:**
Docelowo najlepszy UX, jeśli panel ma wystarczającą przestrzeń.

---

### 3) Lupa/powiększenie na hover nad miniaturą „Całość”
**Opis:**
- Gdy użytkownik najedzie na miniaturę całego tła, pojawia się lupa (zoom x2/x3).
- Można dodać skrót klawiaturowy (np. Alt) uruchamiający tryb precyzyjnego porównania detali.

**Zalety:**
- Umożliwia sprawdzanie drobnych różnic (np. detali w górnej części).
- Nie wymaga stałego zwiększania rozmiaru podglądu.

**Wady:**
- Dodatkowa złożoność implementacji.
- Część użytkowników może nie odkryć funkcji bez podpowiedzi UI.

**Wniosek:**
Dobry „upgrade” po wdrożeniu trybu Całość.

---

### 4) Szybki podgląd pełnoekranowy / modal „Porównaj tła”
**Opis:**
- Przycisk „Powiększ” otwiera modal z dużym podglądem całego tła.
- Opcjonalnie: nawigacja strzałkami po tłach i tryb „przed/po” (A/B).

**Zalety:**
- Bardzo wygodne porównanie przy dużej liczbie podobnych teł.
- Najlepsza widoczność szczegółów.

**Wady:**
- Większy koszt implementacji.
- Przerywa pracę w formularzu (wejście/wyjście z modala).

**Wniosek:**
Warto jako funkcja premium, ale niekonieczna na pierwszy etap.

---

### 5) Pasek miniatur wszystkich teł pod selektorem
**Opis:**
- Pod polem wyboru tła pokazać miniatury całych obrazów (filmstrip).
- Kliknięcie miniatury wybiera tło i odświeża główny podgląd.

**Zalety:**
- Błyskawiczne skanowanie wizualne wariantów.
- Ogranicza „przeklikiwanie” listy rozwijanej.

**Wady:**
- Potrzebna optymalizacja obrazów (lazy loading, cache).
- Wymaga miejsca i przewijania przy wielu tłach.

**Wniosek:**
Świetne przy większej bibliotece teł.

---

## Rekomendacja wdrożenia etapami

### Etap 1 (szybki, niski koszt)
- Wdrożyć **przełącznik „Wycinek/Całość”**.
- Zapamiętywać wybór trybu (np. localStorage), żeby GM nie przełączał za każdym razem.

### Etap 2 (największy zysk UX)
- Dodać **split preview** (cały obraz + finalny kadr).
- Na miniaturze „Całość” dodać prostokąt obszaru kadrowania.

### Etap 3 (opcja zaawansowana)
- Dodać **lupę** albo **modal porównawczy A/B**, jeśli nadal występują problemy z odróżnianiem bardzo podobnych teł.

## Kryteria akceptacji (proponowane)
1. Użytkownik może zobaczyć cały plik tła bez opuszczania panelu GM.
2. Użytkownik może nadal sprawdzić finalny wygląd wiadomości na tle (tekst + fillery + elementy dodatkowe).
3. Różnice w górnej części dwóch podobnych teł są możliwe do zauważenia w max 2 interakcjach.
4. Przełączanie teł i podglądów nie powoduje zauważalnych opóźnień UI.

## Podsumowanie
Najlepszym kompromisem jest rozpoczęcie od trybu **„Wycinek/Całość”**, a następnie przejście do **split preview**. To zapewnia szybkie wdrożenie i jednocześnie realnie rozwiązuje problem niewidocznych detali poza obecnym kadrem.

---

## Spis wprowadzonych zmian w kodzie (wdrożenie rozwiązania 1)
1. **`Infoczytnik/GM_test.html`**
   - Dodano przełącznik radiowy `Podgląd: Wycinek / Całość` nad mini-podglądem (`livePreviewBox`).
   - Dodano funkcje:
     - `getPreviewMode()` — odczyt bieżącego trybu,
     - `setPreviewMode(mode)` — przełączanie renderu tła:
       - `Wycinek` → `background-size: cover`,
       - `Całość` → `background-size: contain`,
     - `loadSavedPreviewMode()` — odczyt i przywrócenie trybu z `localStorage`.
   - Dodano trwałość ustawienia pod kluczem `infoczytnik.gm.previewMode`.
   - Rozszerzono `DEFAULT_FORM_STATE` o `previewMode:'crop'`.
   - `restoreDefaults()` przywraca domyślny tryb `Wycinek`.
   - Eventy `input/change` dla kontrolek trybu od razu aktualizują podgląd.

2. **Wersjonowanie cache-bust**
   - Podniesiono `INF_VERSION` do `2026-03-31_15-02-48` w:
     - `Infoczytnik/GM_test.html`,
     - `Infoczytnik/Infoczytnik_test.html`.

3. **Dokumentacja modułu**
   - Zaktualizowano `Infoczytnik/docs/README.md` (PL/EN) o instrukcję użycia nowego trybu `Wycinek / Całość`.
   - Zaktualizowano `Infoczytnik/docs/Documentation.md` o szczegóły implementacyjne (funkcje, localStorage, zmiany stanu domyślnego i wersji).

---

## Rozszerzenie analizy – nowe wymaganie (2026-03-31)

## Prompt użytkownika (doprecyzowanie)
> Przeanalizuj plik z analizą: Analizy/Podgląd.md
>
> I rozbuduj go o nowe wymaganie.
>
> Chcę zmienić nazwy i działanie kontrolek:
> Napis: "Wycinek" zmień na "Treść".
> Napis: "Całość" zmień na "Tło".
>
> Kliknięcie przycisku "Treść" (domyślnie zaznaczony) ma skutkować wyświetleniem treści (plus ewentualnie prefixy i suffixy i ewentualnie tło) ale bez tła.
>
> Kliknięcie na "Tło" ma skutkować wyświetleniem się miniatury pliku tła (ale jednego a nie kilku obok siebie jak to jest obecnie). Ponieważ pole jest prostokątne obrazek tła może być przekręcony o 90 stopni w lewo.
>
> Przeprowadź analizę wprowadzenia takiego rozwiązania.

## Interpretacja wymagania
Nowe wymaganie zmienia semantykę kontrolek z „trybów kadrowania” na „tryby celu podglądu”:
- **Treść** = podgląd kompozycji treści (tekst + prefix/suffix + elementy UI), bez ekspozycji samej miniatury tła jako głównego obiektu porównania.
- **Tło** = podgląd **pojedynczej miniatury** pliku tła, skupiony na grafice, bez prezentacji kilku miniatur jednocześnie.

Dodatkowo nazewnictwo ma być bardziej intuicyjne domenowo (co chcę sprawdzić: „Treść” albo „Tło”, a nie „Wycinek”/„Całość”).

## Analiza UX

### 1) Zmiana etykiet
- „Wycinek” → **„Treść”**
- „Całość” → **„Tło”**

**Efekt:**
- Użytkownik szybciej rozumie, co kontrolka pokazuje.
- Mniejsze ryzyko błędnej interpretacji, że chodzi wyłącznie o skalowanie/kadrowanie.

### 2) Zachowanie trybu „Treść” (domyślny)
Wymaganie wskazuje: „wyświetlenie treści (…) ale bez tła”.
Najbezpieczniejsza interpretacja implementacyjna:
- renderować tekst i elementy kompozycji,
- tło ustawić na brak grafiki (np. `background-image: none`) lub neutralny kolor techniczny,
- zachować identyczny układ pozycji treści, żeby widok był nadal WYSIWYG dla warstw tekstowych.

**Korzyść:**
- Czytelna kontrola treści niezależnie od kontrastu i ornamentów tła.

**Ryzyko:**
- część użytkowników może oczekiwać, że „Treść” pokaże też finalny efekt z tłem.

**Mitigacja:**
- dodać krótki opis pod przełącznikiem, np. „Treść: podgląd warstwy tekstowej bez grafiki tła”.

### 3) Zachowanie trybu „Tło”
Wymaganie: pokazać **jedną** miniaturę wybranego pliku tła.

To oznacza, że w tym trybie:
- wyłączamy układ wielu miniatur/duplikacji,
- pokazujemy dokładnie jeden `<img>` (lub jeden blok z backgroundem),
- źródło grafiki = aktualnie wybrane tło z selektora,
- zmiana wyboru tła aktualizuje tę samą miniaturę (bez klonowania elementów).

**Korzyść:**
- jednoznaczny podgląd aktualnego assetu,
- eliminacja chaosu wizualnego i problemu „kilku obrazków obok siebie”.

### 4) Obrót miniatury o 90° w lewo
Wymaganie dopuszcza obrót, bo kontener jest prostokątny.

Rekomendacja:
- stosować obrót warunkowo (tylko w trybie „Tło”) przez klasę CSS, np. `transform: rotate(-90deg)`.
- zadbać o dopasowanie (`object-fit: contain`) i wyśrodkowanie.
- zapewnić fallback: jeśli obraz po obrocie jest mniej czytelny, można dodać mały przełącznik „Obróć”, ale to opcja rozszerzona (niekonieczna na etap 1).

**Uwaga techniczna:**
po obrocie zmieniają się proporcje osi – warto kontrolować maksymalną szerokość/wysokość wrappera, aby obraz nie był ucinany.

## Wpływ na architekturę front-end

### Stan i logika
Aktualny stan `previewMode` (`crop/full`) powinien zostać zastąpiony semantycznym, np.:
- `content` (Treść),
- `background` (Tło).

Do aktualizacji:
- wartości domyślne stanu formularza,
- mapowanie localStorage (z migracją starych wartości),
- logika renderu podglądu (osobna ścieżka dla treści i tła).

### Render podglądu
- Tryb `content`: render warstwy tekstowej, bez obrazka tła.
- Tryb `background`: render pojedynczej miniatury aktualnego pliku tła, opcjonalnie obracanej o -90°.

### CSS
- nowe klasy/stany dla dwóch trybów,
- klasa obrotu miniatury,
- ograniczenie do jednej instancji miniatury w kontenerze.

## Kompatybilność i migracja
Jeśli użytkownicy mają zapisane stare ustawienie (`crop`/`full`), rekomendowana migracja:
- `crop` → `content`,
- `full` → `background`.

Dzięki temu po wdrożeniu nie „zgubimy” preferencji użytkownika, tylko zmapujemy je na nową semantykę.

## Ryzyka i działania zapobiegawcze
1. **Niejasność znaczenia „Treść”**
   - Dodać podpowiedź tekstową (tooltip/opis).
2. **Ucinanie obrazu po obrocie**
   - Ustawić `contain`, testy na skrajnych proporcjach grafik.
3. **Regresja: wiele miniatur w trybie „Tło”**
   - Wymusić czyszczenie kontenera przed renderem i test e2e dla pojedynczego elementu.
4. **Spadek czytelności treści bez tła**
   - Użyć neutralnego tła technicznego z odpowiednim kontrastem.

## Proponowane kryteria akceptacji dla nowego wymagania
1. W UI widoczne są etykiety **Treść** i **Tło** zamiast **Wycinek** i **Całość**.
2. Po wejściu do panelu domyślnie aktywny jest tryb **Treść**.
3. Tryb **Treść** pokazuje tekst/prefix/suffix i elementy kompozycji bez grafiki tła.
4. Tryb **Tło** pokazuje dokładnie **jedną** miniaturę aktualnie wybranego pliku tła.
5. Miniatura w trybie **Tło** może być obrócona o 90° w lewo i pozostaje w całości widoczna w kontenerze.
6. Przełączanie trybów działa bez migotania, duplikowania elementów i bez zauważalnych opóźnień.

## Rekomendacja wdrożeniowa (minimalny bezpieczny zakres)
**Etap 1 (obowiązkowy):**
- podmiana etykiet,
- nowa semantyka trybów (`content/background`),
- domyślny tryb `content`,
- pojedyncza miniatura w trybie `background`.

**Etap 2 (stabilizacja):**
- migracja wartości localStorage ze starych nazw,
- testy regresyjne dla przełączania i odświeżania stanu.

**Etap 3 (opcjonalny UX):**
- przełącznik „obrót miniatury” lub auto-obrót zależny od proporcji obrazu.

## Podsumowanie rozszerzenia
Nowe wymaganie jest spójne i wykonalne bez przebudowy całego modułu. Najważniejsza zmiana polega na przejściu z „trybów kadrowania” na „tryby intencji podglądu” (Treść/Tło). Kluczowe technicznie jest rozdzielenie renderu warstwy tekstowej od renderu pojedynczej miniatury tła oraz usunięcie obecnego efektu wielokrotnego wyświetlania obrazów w trybie tła.

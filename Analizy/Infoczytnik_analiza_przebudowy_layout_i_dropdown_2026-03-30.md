# Analiza modułu Infoczytnik — przebudowa layoutu na niezależne dropdowny

**Data analizy:** 2026-03-30  
**Moduł:** Infoczytnik (`GM_test.html` + `Infoczytnik_test.html`)  

## Prompt użytkownika (zachowanie kontekstu)

> Przeprowadź mi analizę modułu Infoczytnik.  
> Obecnie font, prefixy i suffixy oraz tło są spięte razem w jeden layout.  
> Chciałbym zmienić koncepcję.  
> Chciałbym w panelu GM mieć kilka pól typu dropdown menu.  
> W jednym bym wybierał plik tła  
> W drugim bym wybierał logo  
> W trzecim bym wybierał zestaw prefixów i suffixów  
> W czwartym bym wybierał rodzaj fontu.  
> W piątym bym wybierał dźwięki nadchodzącej wiadomości  
>  
> Przy checkboxach "Dodaj logo" (trzeba zmienić nazwę na "Logo"), "Prostokąt cienia", "Flicker" należałoby dodać jeszcze dwa: "Fillery" oraz "Audio".  
> Zaznaczenie "Fillery" skutkowałoby dodaniem prefixów i suffixów (w licznie takiej jak wpisane w "Ilość linii fillerów" - przy odznaczeniu checkboxa pole byłoby nieaktywne, wyszarzone, i byłby stosowny komunikat).  
> Zaznaczenie i odznaczenie checkboxa "Audio" skutkuje odtworzeniem dźwięku wiadomości lub wyciszeniem. Dźwięk Ping zawsze się odtwarza po naciśnięciu przycisku.  
>  
> Podgląd prefixów i suffixów nad i pod polem "Treść komunikatu" byłaby zbędna. Podgląd jest w polu "Lorem Ipsum". Trzeba tylko jakoś zmodyfikować i dodać podgląd wybranego rodzaju tła i logo.  
>  
> Musiałby się też zmienić struktura katalogów w folderze assets.  
> Foldery nazywałby się:  
> assets/backgrounds (tutaj będą pliki tła)  
> assets/logos (tutaj będą pliki logo)  
> assets/audios (tutaj będą pliki audio przychodzącej wiadomości)  
> assets/audios/ping (tutaj będzie plik audio do odtworzenia Ping - zawsze będzie to jeden plik assets/audios/ping/Ping.mp3)  
>  
> W menu dropdown miałbym listę plików w poszczególnych katalogach, np. po kliknięciu w menu do wyboru tła miałbym do wyboru dowolny plik znajdujący się w assets/backgrounds. Mają się tam wyświetlać dokładne nazwy wraz z rozszerzeniem.  
>  
> Jeżeli chodzi o rodzaj fontu to należy zrobić dwie nazwy. Nazwa obecnego Layout a w nawiasie nazwa fontu, np: "Adeptus Mechanicus (Share Tech Mono)", "Pismo odręczne (Caveat)". Każda nazwa ma być wyświetlana tym fontem.  
>  
> W menu dropdown dotyczącym zestawu prefixów i suffixów zostają obecnie używane nazwy (np. Nurgle, Khorne).  
>  
> Dodatkowo trzeba przebudować sposób wyboru koloru fontu dla głównej treści wiadomości. Trzeba dodac opcję wpisania rgba. Panel wyboru koloru głównego tekstu musi być taki sam jak panel "Kolor Prefix + Suffix (wspólny)"  
>  
> Przeprowadź bardzo wnikliwą analizę kodu i wprowadzenia powyższych funkcjonalności. Jeżeli wymaga to rozbudowy Firabase to to napisz.

---

## 1) Stan obecny (co jest teraz spięte i gdzie)

### 1.1. Główne sprzężenie „layout = wszystko”
Aktualnie pojedyncze pole `faction` determinuje równocześnie:
- tło (`LAYOUT_BG`),
- font (`FONT_STACK`),
- zestaw fillerów (`LAYOUTS` / `FILLERS`),
- zachowania ograniczone dla layoutów „pismo_*”.

To sprzężenie występuje równolegle w GM i Infoczytniku (duplikacja logiki po obu stronach), co utrudnia niezależny wybór tła/logo/fontu/fillerów/audio.

### 1.2. Audio
- Ping i Message mają ścieżki domyślne wpisane „na sztywno” (`assets/audio/global/...`).
- Odtwarzanie message można globalnie blokować przez `disableMessageAudio`, ale nie ma dedykowanego checkboxa „Audio” w GM.

### 1.3. Fillery
- Fillery losowane są z zestawu wynikającego z wybranego `faction`.
- W GM istnieją dwa dodatkowe preview (`prefixPreview`, `suffixPreview`) poza „Lorem Ipsum”, które wg nowej koncepcji są zbędne.

### 1.4. Kolor głównej wiadomości
- Dla głównego tekstu jest tylko `input type="color"` + chipsy.
- Brak pola tekstowego akceptującego `rgba(...)` (jak w panelu Prefix+Suffix).

---

## 2) Wymagana zmiana modelu danych (Firestore: `dataslate/current`)

Aby rozpiąć obecny monolit layoutowy, dokument powinien przechowywać niezależne pola konfiguracyjne:

### 2.1. Proponowane nowe pola
- `backgroundFile` — np. `DataSlate_04.png`
- `logoFile` — np. `Inquisition.png`
- `fillerSet` — np. `nurgle`, `khorne`
- `fontPreset` — np. `mechanicus`, `pismo_odreczne`
- `messageAudioFile` — np. `Message_02.mp3`
- `fillersEnabled` — `true/false`
- `audioEnabled` — `true/false`
- `showLogo` — `true/false` (checkbox „Logo”)
- `movingOverlay` — `true/false`
- `flicker` — `true/false`
- `messageColor` — string (hex lub rgba)

### 2.2. Zasada kompatybilności wstecznej
W pierwszym etapie należy zachować fallback do istniejącego `faction`, żeby stare dokumenty i starsze panele nadal działały:
- jeśli nowe pola są puste → użyj starej logiki `faction`.

---

## 3) Zmiana UI panelu GM (zakres funkcjonalny)

## 3.1. Dropdowny (5 szt.)
1. **Tło**: lista plików z `assets/backgrounds`
2. **Logo**: lista plików z `assets/logos`
3. **Zestaw fillerów**: nazwy obecne (`mechanicus`, `nurgle`, ...)
4. **Font**: etykieta „Nazwa layoutu (Nazwa fontu)” + podgląd opcji renderowanym fontem
5. **Audio wiadomości**: lista plików z `assets/audios`

## 3.2. Checkboxy
- Zmiana nazwy: **„Dodaj logo” → „Logo”**.
- Dodanie: **„Fillery”** oraz **„Audio”**.

### Zachowanie „Fillery”
- OFF: brak prefix/suffix, blokada `Ilość linii fillerów` + wyszarzenie + komunikat.
- ON: losowanie prefix/suffix jak teraz, ale z wybranego `fillerSet`.

### Zachowanie „Audio”
- OFF: nie odtwarza się audio wiadomości (`message`),
- ON: odtwarza się wybrany plik z dropdowna,
- **Ping zawsze gra** (stały `assets/audios/ping/Ping.mp3`).

## 3.3. Preview w GM
- Usunąć osobne `prefixPreview` i `suffixPreview`.
- Rozszerzyć `livePreviewBox` o:
  - mini-podgląd tła (thumbnail lub nazwa + tło kontenera),
  - mini-podgląd logo (ikona w rogu, analogicznie do ekranu graczy).

## 3.4. Kolor treści wiadomości
Panel dla głównego tekstu ma zostać zrównany z panelem Prefix+Suffix:
- `input text` (hex/rgba),
- `input color` jako pomocniczy picker,
- spójna walidacja i synchronizacja.

---

## 4) Zmiana UI modułu gracza (Infoczytnik)

Należy przejść z mapowania po `faction` na niezależne źródła:
- tło z `backgroundFile`,
- logo z `logoFile` (gdy `showLogo=true`),
- font z `fontPreset`,
- fillery z `fillerSet` + `fillersEnabled`,
- audio z `audioEnabled` + `messageAudioFile`.

Dodatkowo:
- `resolveLocalAudioUrl` i walidacja ścieżek muszą obsługiwać nowe katalogi (`assets/audios/...`).
- ping powinien ignorować `audioEnabled` i zawsze odtwarzać `assets/audios/ping/Ping.mp3`.

---

## 5) Struktura katalogów assets — wpływ techniczny

Docelowa struktura:
- `assets/backgrounds/*`
- `assets/logos/*`
- `assets/audios/*`
- `assets/audios/ping/Ping.mp3`

### Konsekwencje
- Trzeba przepiąć wszystkie referencje z:
  - `assets/layouts/...` → `assets/backgrounds/...`
  - `assets/audio/global/...` → `assets/audios/...` lub `assets/audios/ping/...`
- Jeżeli zachowasz stare pliki równolegle (okres migracji), potrzebne są fallbacki.

---

## 6) Najważniejszy punkt: skąd brać listę plików do dropdownów?

Użytkownik chce dynamiczną listę plików z katalogów. W czystym statycznym HTML/JS przeglądarka **nie ma bezpośredniego API do listowania plików w folderze serwera**.

### Opcja A (najprostsza, bez rozbudowy Firebase): manifest JSON/JS
- Tworzysz np. `assets/asset-manifest.json` z listami `backgrounds`, `logos`, `audios`.
- GM ładuje manifest i buduje dropdowny.
- Plus: brak zmian w Firebase i backendzie.
- Minus: manifest trzeba aktualizować przy każdym dodaniu pliku (ręcznie lub skryptem build).

### Opcja B (rozbudowa Firebase — tylko jeśli chcesz pełną dynamiczność)
- Przeniesienie assetów do **Firebase Storage**.
- GM pobiera listy przez SDK (`listAll`) lub przez backend endpoint.
- Wymaga:
  - konfiguracji `storageBucket`,
  - reguł bezpieczeństwa Storage,
  - ewentualnie CORS,
  - przebudowy ładowania assetów i cache bustingu.

### Opcja C (własny backend endpoint)
- Endpoint (np. Node) zwraca listę plików z lokalnych katalogów.
- GM pobiera listę przez `fetch('/api/assets')`.
- Wymaga utrzymania backendu tam, gdzie dziś front może być hostowany statycznie.

## Wniosek Firebase
**Rozbudowa Firebase nie jest wymagana**, jeśli akceptujesz manifest statyczny (Opcja A).  
**Jest wymagana**, jeśli listy mają być „same z siebie” dynamiczne bez aktualizacji manifestu i bez backendu (Opcja B — Firebase Storage).

---

## 7) Zakres refaktoryzacji i ryzyka

### 7.1. Refaktoryzacja konieczna
- Rozdzielenie „presetów layoutu” na niezależne konfiguracje:
  - `BACKGROUND_OPTIONS`, `LOGO_OPTIONS`, `FILLER_SETS`, `FONT_PRESETS`, `AUDIO_OPTIONS`.
- Ujednolicenie źródła prawdy między GM i Infoczytnik (obecnie duplikaty obiektów).
  - rekomendacja: wydzielić wspólny plik konfiguracyjny, importowany przez oba widoki.

### 7.2. Ryzyka
- Rozjazd opcji między GM a Infoczytnikiem (jeżeli mapy zostaną dalej duplikowane).
- Błędy przy migracji ścieżek assetów.
- Błędy regresji w trybach „pismo_*” (dotąd miały twarde ograniczenia).
- Brak obsługi starych rekordów bez fallbacku.

---

## 8) Plan wdrożenia (kolejność minimalizująca ryzyko)

1. **Etap 1 – model danych i fallback**
   - dodać nowe pola do zapisu w GM,
   - Infoczytnik odczytuje nowe pola, a przy braku używa starego `faction`.

2. **Etap 2 – nowy UI GM**
   - 5 dropdownów,
   - 2 nowe checkboxy,
   - zmiana panelu koloru głównej treści na text+picker,
   - usunięcie dodatkowych preview prefix/suffix,
   - dodanie preview tła/logo w live preview.

3. **Etap 3 – migracja assets**
   - przepięcie ścieżek,
   - przygotowanie manifestu (lub wdrożenie Storage/backend).

4. **Etap 4 – testy regresji**
   - wysyłka message/ping/clear,
   - ON/OFF fillers,
   - ON/OFF audio,
   - logo ON/OFF,
   - wszystkie warianty fontów,
   - odczyt starych dokumentów.

---

## 9) Ocena złożoności

- **Frontend GM:** średnio-duża przebudowa (UI + logika + i18n).
- **Frontend Infoczytnik:** średnia przebudowa (mapowanie nowych pól, audio, layout).
- **Backend/Firebase:**
  - brak konieczności zmian przy wariancie manifest,
  - średnia rozbudowa przy wariancie Firebase Storage.

Szacunkowo jest to refaktor funkcjonalny, nie „kosmetyczna poprawka”, bo dotyka modelu danych i kontraktu między dwoma aplikacjami.

---

## 10) Rekomendacja końcowa

Najbezpieczniej wdrożyć to w dwóch krokach:
1. najpierw **nowe pola + fallback**,
2. potem **migracja assets i dynamiczne listy**.

Jeżeli priorytetem jest prostota i szybkie wdrożenie, wybierz **manifest plików (bez rozbudowy Firebase)**.  
Jeżeli priorytetem jest pełna automatyzacja list dropdown bez ręcznej aktualizacji, wybierz **Firebase Storage** (to jest realna rozbudowa Firebase).


---

## 11) Rozbudowa analizy — dodatkowe wymagania z dnia 2026-03-30

### 11.1. Prompt użytkownika (uzupełnienie kontekstu)

> Rozbuduj analizę: Analizy/Infoczytnik_analiza_przebudowy_layout_i_dropdown_2026-03-30.md  
> Nie wprowadzaj zmian w kodzie. Dodaj tylko te informacje do pliku z analizą i zaktualizuj go  
>  
> Dodatkowe informacje:  
> 1. Obecnie Layouty "Pismo odręczne" i "Pismo ozdobne" maja blokadę na dodawanie logo, prostokąta i flicker.  
> W nowym modelu ta blokada nie będzie potrzebna.  
>  
> 2. Trzeba będzie zmodyfikować działania przycisków "Wyczyść ekran" i "Wyczyść pole".  
> Zastąpimy je "Wyczyść komunikat" oraz "Przywróć domyślne".  
> Wyczyść komunikat = ma czyścić treść z pola "Treść komunikatu" bez zmiany pozostałych opcji  
> Przywróć domyślne = ma czyścić treść z pola "Treść komunikatu" oraz przywracać wartości domyślne we wszystkich polach (czyli domyślny wybór z menu Dropdown oraz stan checkboxów).  
> Domyślne wartości zostaną przygotowane potem.  
>  
> 3. W aplikacji jest dużo tekstów pomocniczych, komunikatów błęów itp. Trzeba będzie zadbać, żeby wszystkie informacje były aktualne po modyfikacji panelu.

### 11.2. Usunięcie historycznych blokad dla layoutów „Pismo odręczne” i „Pismo ozdobne”

W nowym modelu konfiguracja jest rozdzielona na niezależne dropdowny i checkboxy, więc dotychczasowe ograniczenia per layout należy usunąć:
- brak wymuszania `showLogo = false` dla `pismo_odreczne` i `pismo_ozdobne`,
- brak wymuszania `movingOverlay = false` dla tych presetów,
- brak wymuszania `flicker = false` dla tych presetów.

#### Konsekwencja architektoniczna
`fontPreset` ma odpowiadać wyłącznie za typografię (font stack + ewentualne subtelne parametry renderingu), a nie za blokowanie efektów wizualnych. Ograniczenia, jeśli będą potrzebne w przyszłości, powinny wynikać z jawnej walidacji reguł (np. tabela kompatybilności), a nie z „ukrytych” wyjątków osadzonych w kodzie.

### 11.3. Przebudowa semantyki przycisków czyszczenia

Obecne przyciski:
- „Wyczyść ekran”,
- „Wyczyść pole”.

Docelowe przyciski:
- **„Wyczyść komunikat”**,
- **„Przywróć domyślne”**.

#### Nowa logika operacyjna

1. **Wyczyść komunikat**
   - czyści wyłącznie pole „Treść komunikatu”,
   - nie zmienia dropdownów,
   - nie zmienia checkboxów,
   - nie resetuje kolorów i innych ustawień.

2. **Przywróć domyślne**
   - czyści pole „Treść komunikatu”,
   - resetuje wszystkie dropdowny do wartości domyślnych,
   - resetuje wszystkie checkboxy do stanów domyślnych,
   - resetuje pozostałe pola konfiguracyjne do wartości domyślnych (np. kolory, liczba linii fillerów — zgodnie z finalną definicją domyślnych).

#### Ważny detal wdrożeniowy
Ponieważ „domyślne wartości zostaną przygotowane potem”, warto już teraz przewidzieć jeden centralny obiekt konfiguracyjny, np. `DEFAULT_FORM_STATE`, używany przez:
- inicjalizację formularza,
- przycisk „Przywróć domyślne”,
- ewentualną walidację spójności przy migracjach.

To ograniczy regresje i ryzyko rozjazdu między „domyślnym widokiem po otwarciu” a „domyślnym widokiem po kliknięciu resetu”.

### 11.4. Aktualizacja tekstów pomocniczych, walidacyjnych i błędów

Po przebudowie panelu konieczny będzie pełny przegląd copy/UI textów:
- etykiety pól (dropdowny, checkboxy, przyciski),
- podpowiedzi i opisy kontekstowe,
- komunikaty błędów walidacji (np. dla `rgba(...)`),
- komunikaty stanów nieaktywnych (np. wyłączone fillery),
- ewentualne toasty/alerty potwierdzające akcje.

#### Zakres synchronizacji komunikatów
Należy zsynchronizować treści co najmniej w trzech miejscach:
1. UI panelu GM,
2. logika komunikatów runtime (walidacja, błędy ładowania assetów, fallbacki),
3. dokumentacja użytkowa i techniczna modułu (na etapie implementacji zmian kodu).

#### Rekomendacja jakościowa
Warto przygotować checklistę „tekstów po zmianie panelu”, aby uniknąć sytuacji, gdzie nazwy dawnych kontrolek („Wyczyść ekran”, „Wyczyść pole”, „Dodaj logo”) pozostaną w komunikatach po wdrożeniu nowej semantyki.

### 11.5. Wpływ na wcześniejszy plan etapów

Dodatkowe wymagania rozszerzają plan z sekcji 8 o dwa punkty:

- **Nowy etap 2a (reguły UI):**
  - usunąć twarde blokady efektów dla `pismo_odreczne` i `pismo_ozdobne`,
  - potwierdzić, że font preset nie wyłącza logo/prostokąta/flicker.

- **Nowy etap 2b (akcje formularza i copy):**
  - podmienić logikę przycisków na „Wyczyść komunikat” i „Przywróć domyślne”,
  - ujednolicić wszystkie teksty pomocnicze/komunikaty błędów po zmianie nazewnictwa i zachowań.

W praktyce oznacza to, że testy regresji muszą objąć nie tylko funkcjonalność, ale też zgodność treści komunikatów z aktualnym działaniem panelu.

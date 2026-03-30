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

Decyzja docelowa: **Opcja A** (bez rozbudowy Firebase), ale manifest źródłowy ma być utrzymywany w pliku **XLSX**.

### Opcja A (docelowa): manifest XLSX + konwersja do JSON
- Źródłem edycyjnym dla treści będzie `Infoczytnik/DataSlate_manifest.xlsx`.
- Aplikacja frontowa nie powinna czytać XLSX bezpośrednio w runtime (to zwiększa ciężar frontu i komplikuje walidację), więc rekomendowany jest etap pośredni:
  1. skrypt konwersji (`DataSlate_manifest.xlsx` → `data.json`),
  2. strona GM/Infoczytnik czyta gotowy JSON.
- To jest spójne z Twoim wymaganiem „najprościej, bez rozbudowy Firebase” i z mechanikami znanymi z modułów DataVault/Audio.

### Czy rozbudowa Firebase jest potrzebna?
**Nie.** Przy modelu XLSX→JSON nie ma potrzeby wdrażania Firebase Storage ani backendowego listowania katalogów.

### Uwaga implementacyjna (ważna)
Przeglądarka nie listuje plików katalogu hostingu statycznego, więc dropdowny **nie mogą** bazować na automatycznym skanie `assets/*` bez warstwy pośredniej. Manifest (po konwersji do JSON) jest właściwą i stabilną ścieżką.

### Wariant „przycisk generuj/importuj data.json”
Jeżeli wybierzesz przepływ podobny do DataVault, analiza przewiduje dwa równoważne tryby:
- **Tryb A (offline/build-time):** skrypt uruchamiany lokalnie (np. Node/Python) generuje `data.json` z XLSX, a plik jest commitowany do repo.
- **Tryb B (w panelu GM):** przycisk „Importuj manifest / Generuj data.json” pozwala wybrać lokalny plik `.xlsx`, parser JS odczytuje arkusze i buduje obiekt runtime (opcjonalnie eksport do `data.json`).

Rekomendacja praktyczna: wdrożyć oba, gdzie:
- build-time daje stabilność i powtarzalność,
- przycisk importu przyspiesza iterację bez ręcznego przepisywania danych.

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


### 11.6. Aktualizacja analizy wg decyzji użytkownika (2026-03-30)

#### 11.6.1. Brak fallbacków i brak migracji plików
Przyjęte założenie: wdrożenie „od zera”, bez okresu przejściowego.

Konsekwencja dla planu:
- można usunąć etap kompatybilności wstecznej oparty o `faction` jako mechanizm ratunkowy,
- wdrożenie powinno od razu zapisywać i odczytywać nowy model (dropdowny + checkboxy),
- testy regresji muszą być prowadzone na nowej strukturze danych i nowych ścieżkach assetów.

#### 11.6.2. Ocena formatu `DataSlate_manifest.xlsx` (prefix/suffix + pozostałe zakładki)
Na podstawie struktury arkuszy (`backgrounds`, `logos`, `audios`, `fonts`, `fillers`) format jest **wystarczający jako MVP** dla nowego panelu:
- `backgrounds/logos/audios`: `WyswietlanaNazwa`, `Link`, `NazwaPliku`,
- `fonts`: `WyswietlanaNazwa`, `NazwaFontu`,
- `fillers`: `WyswietlanaNazwa`, `Prefix`, `Suffix` (lista rozdzielona średnikiem).

Lista `Prefix`/`Suffix` w jednej komórce (separator `;`) jest technicznie poprawna i łatwa do parsowania.

#### 11.6.3. Reguła automatycznego dodawania „+++”
Wymaganie „aplikacja sama dodaje `+++` na początku i końcu linii” jest wykonalne i powinno być zaimplementowane na etapie konwersji/parsowania:
- wejście z XLSX przechowuje „czysty” tekst (bez dekoratorów),
- normalizator tworzy finalny format: `+++ ${tekst.trim()} +++`.

To upraszcza utrzymanie treści i usuwa ryzyko niespójnego formatowania między zestawami.

#### 11.6.4. Czy obecny manifest pokrywa wszystko, co dziś jest zaszyte w kodzie?
**Prawie wszystko, ale nie w 100%.**

Pokryte:
- lista teł,
- lista logo,
- lista audio wiadomości,
- lista zestawów fillerów,
- lista fontów.

Elementy, które nadal są zaszyte poza manifestem i wymagają jawnej decyzji:
1. stały plik ping (`assets/audios/ping/Ping.mp3`) – zwykle jako stała systemowa (bez dropdownu),
2. mapowanie technicznych kluczy (`mechanicus`, `inquisition`, itd.) na rekordy manifestu,
3. wartości domyślne formularza (wybory dropdown + stany checkboxów),
4. ustawienia niefajlowe (np. domyślne kolory, limity linii fillerów, zachowania ON/OFF),
5. ewentualne aliasy i polityka walidacji URL/ścieżek.

Dodatkowa obserwacja: w kodzie historycznie istnieją też layouty „pismo_odreczne” i „pismo_ozdobne” (oraz ich reguły), więc trzeba jednoznacznie określić ich odwzorowanie w nowym manifeście (np. jako pozycje font/background albo jawnie wycofane).

#### 11.6.5. Czy potrzebne są dodatkowe zakładki w manifeście?
Dla MVP – **nie są bezwzględnie konieczne**. Obecne 5 zakładek wystarcza do uruchomienia nowego modelu dropdownów.

Rekomendowane opcjonalne rozszerzenia (jeśli chcesz pełną konfigurację bez „zaszywek”):
- `defaults` – domyślne wybory i stany checkboxów,
- `settings` – limity, flagi UI, wartości globalne,
- `i18n` – etykiety/komunikaty PL/EN,
- `routing` lub `keys` – stabilne klucze techniczne i aliasy nazw.

Jeśli celem jest prostota na start, zostań przy 5 zakładkach i dodaj tylko minimalną walidację (wymagalność kolumn, brak duplikatów nazw, poprawne URL/ścieżki).


### 11.7. Doprecyzowania użytkownika do sekcji 3.4, 2.1–2.6 i 11.6.5 (aktualizacja 2026-03-30)

#### 11.7.1. 3.4 Kolor treści wiadomości — pełna niezależność od Prefix/Suffix
Decyzja użytkownika:
- kolor `Prefix+Suffix` i kolor głównej treści wiadomości mają działać **niezależnie**,
- użytkownik musi móc ustawić różne wartości równocześnie (np. złoty dla `Prefix+Suffix` oraz zielony dla treści),
- panel wyboru koloru ma być wizualnie ujednolicony.

Wniosek implementacyjny:
- należy utrzymać **dwa osobne pola stanu** (np. `prefixSuffixColor` i `messageColor`) oraz dwa niezależne zestawy walidacji/synchronizacji,
- „ujednolicenie panelu” dotyczy UI/UX komponentu (ten sam typ kontrolek, ten sam układ, ta sama walidacja), a **nie** współdzielenia jednej wartości.

---

#### 11.7.2. Doprecyzowanie elementów „zaszytych poza manifestem”

##### 2.1. Stały plik ping
Potwierdzone: **TAK, ping jest stały**.
- Przyjąć jako stałą systemową: `assets/audios/ping/Ping.mp3`.
- Nie umieszczać pingu w dropdownie audio wiadomości.

##### 2.2. Mapowanie technicznych kluczy — wyjaśnienie
To warstwa identyfikatorów stabilnych dla kodu, niezależnych od nazwy wyświetlanej dla użytkownika.

Przykład idei:
- klucz techniczny: `mechanicus_dark`,
- nazwa dla użytkownika: `Adeptus Mechanicus (Share Tech Mono)`.

Po co to jest:
1. Nazwa wyświetlana może się zmieniać (copy, język, kosmetyka), a klucz pozostaje stały.
2. Zapisy w Firestore i logika aplikacji odwołują się do klucza, dzięki czemu refaktor etykiet nie psuje danych historycznych.
3. Ułatwia walidację i wykrywanie duplikatów.

Minimalna rekomendacja:
- każdy rekord w manifeście powinien mieć stabilne `id`/`key`,
- UI pokazuje `WyswietlanaNazwa`, ale zapisuje klucz techniczny.

##### 2.3. Wartości domyślne formularza
Status: użytkownik dostarczy później, gdy manifest będzie finalny.

Wniosek:
- na etapie implementacji przygotować tylko mechanizm (`DEFAULT_FORM_STATE`),
- właściwe wartości domyślne podstawić później bez zmiany architektury.

##### 2.4. Ustawienia niefajlowe — wyjaśnienie
To **nie jest dokładnie to samo** co 2.3, choć obszary się stykają.

Różnica:
- 2.3 = „co jest domyślnie wybrane po starcie/reset” (konkretne wartości formularza),
- 2.4 = globalne reguły działania, które nie wskazują pliku (np. limity, flagi funkcjonalne, polityki walidacji, zachowanie kontrolek).

Praktycznie: tak — warto przygotować listę domyślnych wartości i ustawień, ale rozdzieloną na:
- `defaults` (stany startowe formularza),
- `settings` (reguły i parametry globalne).

##### 2.5. Aliasy i polityka walidacji URL/ścieżek — wyjaśnienie
- **Aliasy**: dodatkowe nazwy wskazujące na ten sam rekord (np. stara nazwa historyczna + nowa nazwa docelowa), przydatne przy migracjach i kompatybilności.
- **Polityka walidacji URL/ścieżek**: zestaw reguł, co uznajemy za poprawny link/ścieżkę w manifeście.

Przykładowe reguły walidacji:
1. dozwolone rozszerzenia (`.png`, `.jpg`, `.webp`, `.mp3`, `.wav`),
2. zakaz ścieżek wychodzących poza moduł (`../`),
3. brak pustych wartości w kolumnach wymaganych,
4. wykrywanie duplikatów kluczy i nazw,
5. fallback przy brakującym pliku (np. pierwszy poprawny rekord z listy).

##### 2.6. Reguły „pismo odręczne” i „pismo ozdobne”
Decyzja użytkownika:
- wszystkie specjalne reguły dla layoutów „pismo odręczne” i „pismo ozdobne” mają zostać usunięte,
- w nowym modelu są to zwykłe pliki tła i fontu,
- brak audio/prostokąta cienia ma być realizowany checkboxami, nie ukrytymi blokadami layoutu.

---

#### 11.7.3. Doprecyzowanie sekcji 11.6.5 (defaults/settings/i18n/routing-keys)

##### 3.1. Czy `defaults` mogą zostać w kodzie z fallbackiem?
Decyzja: **tak, mogą zostać w kodzie**.

Rekomendowany model:
- źródło domyślnych w kodzie (np. `DEFAULT_FORM_STATE`),
- podczas inicjalizacji sprawdzenie, czy wybrane rekordy istnieją w aktualnym manifeście,
- jeśli rekord nie istnieje (np. plik tła został usunięty), automatyczny fallback do **pierwszego poprawnego wpisu** z danej listy.

To jest bezpieczne i zgodne z założeniem prostego MVP.

##### 3.2. `settings` — wyjaśnienie
`settings` to sekcja na parametry globalne aplikacji, które nie są pojedynczymi rekordami assetów.

Przykłady:
- limity (np. maksymalna liczba linii fillerów),
- flagi UI (np. czy pokazywać podgląd miniatur),
- polityki walidacyjne (np. czy dopuszczamy URL zewnętrzne),
- wartości systemowe niezależne od wyboru dropdown.

Wersja minimalistyczna: `settings` może pozostać w kodzie na start i zostać przeniesione do manifestu dopiero, gdy pojawi się potrzeba edycji bez zmian w repo.

##### 3.3. `i18n` — decyzja użytkownika
Przyjęto:
- dane (nazwy i rekordy) będą pobierane z manifestu,
- tłumaczona będzie wyłącznie strona i etykiety UI,
- nazwy z manifestu nie będą tłumaczone runtime,
- dla innego języka należy przygotować osobny manifest.

Konsekwencja techniczna:
- logika i18n pozostaje po stronie UI,
- manifest jest traktowany jako językowo „zamrożony” zbiór danych.

##### 3.4. `routing` / `keys` — wyjaśnienie
To mechanizm stabilnych identyfikatorów i mapowania używany przez kod:
- `keys` = unikalne klucze rekordów (np. `bg_adeptus_01`, `font_caveat`),
- `routing` = zasady, jak aplikacja znajduje rekord po kluczu (oraz ewentualnie po aliasie).

Po co:
1. nie uzależniać logiki od tekstu wyświetlanego,
2. uprościć zapisy/odczyty z Firestore,
3. bezpiecznie obsłużyć zmianę nazw bez utraty spójności danych.

Dla MVP można uprościć to do jednego pola `id` w każdej zakładce i prostego słownika `id -> rekord` budowanego po wczytaniu manifestu.


### 11.8. Aktualizacja analizy po zmianie `DataSlate_manifest.xlsx` (dodana kolumna `ID` w każdej zakładce) — 2026-03-30

#### 11.8.1. Prompt użytkownika (uzupełnienie kontekstu)

> Zaktualizowałem plik DataSlate_manifest.xlsx. Do każdej zakładki dodałem kolumnę ID.  
> Zasady walidacji:  
> 1) ID unikatowe w obrębie zakładki; przy duplikacie bierzemy pierwszy rekord i pokazujemy błąd w panelu GM.  
> 2) Nie może być pustych kolumn — jeśli rekord ma pustą kolumnę, pomijamy rekord.  
> 3) Nie walidować linków „na twardo”; dodać obsługę błędów (zły link/brak pliku).  
> Czy to rozwiązuje: 2.2, 2.4, 2.5, 3.4?  
> Zostawić w kodzie: 2.3, 2.1, 3.2.  
> Dodatkowo: obszary tekstu są teraz zaszyte w kodzie i po aktualizacji modelu będą przygotowane ponownie jako dwa zestawy plików (tło + wariant z narysowaną ramką/cieniem).  
> Czy coś jeszcze trzeba wyjaśnić przed wdrożeniem?  
> Dopisać też wszystkie obecnie używane fonty i przypisanie do layoutów.

---

#### 11.8.2. Ocena: czy nowa kolumna `ID` i podane reguły rozwiązują punkty 2.2 / 2.4 / 2.5 / 3.4?

##### A) 2.2. Mapowanie technicznych kluczy — **TAK, w dużej mierze rozwiązane**
Dodanie kolumny `ID` w każdej zakładce praktycznie realizuje warstwę kluczy technicznych (stabilnych identyfikatorów), o ile:
- `ID` jest traktowane jako klucz zapisywany do Firestore,
- `WyswietlanaNazwa` pozostaje tylko etykietą UI,
- parser buduje słownik `id -> rekord` per zakładka.

Wniosek: punkt 2.2 można uznać za **zamknięty funkcjonalnie** dla MVP.

##### B) 2.4. Ustawienia niefajlowe — **NIE, to nadal osobna decyzja**
Nowe `ID` porządkuje rekordy assetów, ale nie definiuje ustawień globalnych (limity, flagi, polityki działania kontrolek).

Ponieważ chcesz zostawić `settings` w kodzie (3.2), punkt 2.4 jest rozwiązany przez decyzję architektoniczną „w kodzie”, ale **nie przez samą zmianę w XLSX**.

##### C) 2.5. Aliasy i polityka URL/ścieżek — **CZĘŚCIOWO**
- Aliasy: nadal opcjonalne; sama kolumna `ID` ich nie zastępuje (choć zmniejsza potrzebę aliasów).
- Polityka URL/ścieżek: Twoja decyzja „bez twardej walidacji linków, z obsługą błędów runtime” jest spójna i wystarczająca dla MVP.

Czyli 2.5 jest domknięte jako **minimalna polityka operacyjna**:
1. parser sprawdza kompletność pól (w tym `ID`),
2. rekord z brakami jest pomijany,
3. linki/ścieżki nie blokują importu,
4. błąd ładowania assetu jest raportowany w panelu GM i/lub logu.

##### D) 3.4. routing / keys — **TAK (dla MVP)**
Jeśli `ID` jest unikatowe per zakładka i na nim opiera się zapis/odczyt, to routing po kluczach technicznych jest zapewniony.

Warunek praktyczny:
- rozróżniać przestrzenie kluczy per zakładka (`backgrounds`, `logos`, `audios`, `fonts`, `fillers`),
- komunikaty walidacyjne muszą wskazywać konkretną zakładkę i `ID`.

---

#### 11.8.3. Doprecyzowanie Twoich reguł walidacji (wersja wykonawcza)

1. **Duplikat `ID` w zakładce**
   - parser bierze **pierwszy rekord** wystąpienia `ID`,
   - kolejne rekordy z tym samym `ID` są ignorowane,
   - do panelu GM trafia komunikat typu:  
     `W zakładce backgrounds istnieją dwa wpisy o ID=4`.

2. **Puste kolumny**
   - rekord z jakimkolwiek pustym polem wymaganym dla danej zakładki jest pomijany,
   - panel GM dostaje raport: zakładka + numer wiersza + brakujące pola.

3. **Brak walidacji linków „na twardo”**
   - import nie odrzuca rekordu tylko dlatego, że URL wygląda podejrzanie,
   - dopiero przy użyciu assetu obsługa runtime:
     - `onerror` obrazu,
     - błąd `audio.play()` / brak pliku,
     - fallback do pierwszego poprawnie ładującego się rekordu lub bezpiecznej wartości systemowej,
     - komunikat diagnostyczny w panelu GM.

---

#### 11.8.4. Potwierdzenie elementów, które zostają w kodzie

Zgodnie z Twoją decyzją, bez przenoszenia do manifestu na tym etapie:
- **2.1 stały ping** (`assets/audios/ping/Ping.mp3`) — zostaje stałą systemową,
- **2.3 domyślne wartości formularza** — zostają w kodzie (docelowo z podmianą na ID, np. background=3, logo=2),
- **3.2 settings** — zostają w kodzie jako globalne parametry.

Ta decyzja jest spójna z MVP i skraca zakres zmian.

---

#### 11.8.5. Obszary tekstu po aktualizacji modelu — wpływ na wdrożenie

Doprecyzowanie o dwóch zestawach plików (jak w analizie z 2026-03-29) jest bardzo ważne i **wystarczające koncepcyjnie**:
- plik A: czyste tło,
- plik B: to samo tło z naniesioną ramką/obszarem/cieniem referencyjnym.

Wniosek architektoniczny:
- geometrię obszaru tekstu warto utrzymywać jako dane przypięte do rekordu tła (docelowo per `background ID`),
- wizualny plik referencyjny B służy tylko jako materiał kalibracyjny i kontrolny.

---

#### 11.8.6. Co jeszcze trzeba doprecyzować przed wejściem w kod? (krótka checklista)

Żeby implementacja poszła bez blokad, brakuje już tylko kilku decyzji wykonawczych:

1. **Zakres „pustych kolumn” per zakładka**  
   (czy np. w `fonts` wymagamy `ID+WyswietlanaNazwa+NazwaFontu`, a w `fillers` `ID+WyswietlanaNazwa+Prefix+Suffix` — obecnie sugerowane: tak).

2. **Format `ID`**  
   (liczba całkowita dodatnia vs string; rekomendacja: liczba całkowita dodatnia, bez znaków specjalnych).

3. **Sposób raportowania błędów w GM**  
   (lista zbiorcza po imporcie + status ostrzeżeń przy użyciu rekordu).

4. **Polityka fallbacku runtime**  
   (przy braku pliku: czy zawsze pierwszy poprawny rekord z listy, czy „brak assetu + ostrzeżenie” bez podmiany).

Poza tym zakres jest już opisany na tyle precyzyjnie, że można bezpiecznie przejść do implementacji.

---

#### 11.8.7. Aktualna lista fontów używanych w kodzie i przypisanie do layoutów

Na dziś mapowanie `layout/faction -> font` jest spójne w GM i w Infoczytniku (wersje testowe i główne) i wygląda następująco:

- `mechanicus` → **Share Tech Mono**
- `inquisition` → **Cinzel**
- `militarum` → **Rajdhani**
- `khorne` → **Black Ops One**
- `nurgle` → **Staatliches**
- `tzeentch` → **Orbitron**
- `slaanesh` → **Questrial**
- `chaos_undivided` → **Russo One**
- `pismo_odreczne` → **Caveat**
- `pismo_ozdobne` → **Great Vibes**

Fallback techniczny dla każdego mapowania: `Calibri, Arial, sans-serif`.

Dodatkowo wszystkie powyższe fonty są ładowane z Google Fonts we wspólnym imporcie CSS, więc manifest może je bezpośrednio referować przez nazwę rodziny fontu.

---

#### 11.8.8. Krótka odpowiedź na pytanie „czy to już wszystko wyjaśnia?”

**Tak — praktycznie wszystko kluczowe jest już wyjaśnione do startu prac kodowych.**  
Do pełnej gotowości wdrożeniowej zostały 4 krótkie decyzje z checklisty 11.8.6 (głównie format `ID`, dokładny zakres pól wymaganych i fallback przy brakującym pliku).

---

#### 11.8.9. Odpowiedzi do checklisty 11.8.6 (aktualizacja 2026-03-30)

### 11.8.9.1. Prompt użytkownika (doprecyzowanie kontekstu)

> Zaktualizuj analizę: Analizy/Infoczytnik_analiza_przebudowy_layout_i_dropdown_2026-03-30.md  
> Nie wprowadzaj zmian w kodzie. Zaktualizuj tylko plik z analizą.  
> Nie usuwaj nic z pliku Analizy/Infoczytnik_analiza_przebudowy_layout_i_dropdown_2026-03-30.md tylko dodaj nowe informacje.  
>  
> Dodaj odpowiedzi do 11.8.6.  
> 1. Zakres „pustych kolumn” per zakładka  
> Doprecyzuję.  
> To co jest obecnie w przykładowym pliku DataSlate_manifest.xlsx traktujemy teraz jako wzór.  
> W przyszłości w pliku może być więcej kolumn, ale aplikacja ma ich nie brać pod uwagę (np. komentarz użytkownika)  
> Wymogiem jest, żeby były te kolumny co są obecnie (chociaż mogą być w różnej kolejności).  
> Wymogiem jest, żeby te obecnie zawarte kolumny były unikatowe - np. jeżeli są dwie kolumny w zakładce background o nazwie Link to aplikacja ma zwrócić błąd bez importu danych.  
> Jeżeli w jakimś rekordzie przynajmniej jedna z obecnych kolumn (czyli wymaganych do działania aplikacji) jest pusta (np. jest ID, WyswietlanaNazwa, Link ale nie ma NazwaPliku to aplikacja pominie ten rekord przy imporcie i zwróci komunikat błędu.  
>  
> 2. Format ID  
> Liczby całkowite dodatnie bez znaków specjalnych.  
>  
> 3. Sposób raportowania błędów w GM  
> Rozwiązanie lista zbiorcza po imporcie + status ostrzeżeń przy użyciu rekordu jest akceptowalne  
>  
> 4. Polityka fallbacku runtime  
> Pierwszy poprawny plik z listy plus ostrzeżenie w panelu z dokładnym opisem błędu.  
>  
> Dodatkowo - trzeba w UI Panelu GM przygotować pole "Log importu" i tam wyświetlać błędy. W takiej formie, żeby dało się zaznaczyć całość i skopiować do notatnika.  
>  
> WAŻNE - fallback fontów zapisz w kodzie. Dla każdego fontu będzie taki sam.  
>  
> Czy (poza brakiem finalnego pliku DataSlate_manifest.xlsx oraz wskazaniem plików z narysowaną ramką - 11.8.5) jesteśmy gotowi do wprowadzania zmian w plikach testowych (zgodnie z wymogiem Infoczytnik/Agents.md) aplikacji?

### 11.8.9.2. Zamknięcie punktów 11.8.6 — decyzje finalne

1. **Zakres „pustych kolumn” per zakładka — ustalone**
   - `DataSlate_manifest.xlsx` w obecnej postaci jest wzorcem kolumn wymaganych.
   - Kolejność kolumn może być dowolna.
   - Dodatkowe kolumny są dozwolone i mają być ignorowane przez importer.
   - Kolumny wymagane muszą być **unikatowe w obrębie zakładki** (np. podwójny nagłówek `Link` => błąd krytyczny i przerwanie importu całej zakładki / importu całości wg polityki importera).
   - Jeśli rekord ma pustą wartość w dowolnej kolumnie wymaganej, rekord jest pomijany i wpisywany do logu błędów importu.

2. **Format `ID` — ustalone**
   - `ID` = dodatnia liczba całkowita (`1,2,3...`), bez znaków specjalnych, bez tekstów.
   - Rekomendowane walidacje: brak duplikatów `ID` w obrębie zakładki, brak wartości `0`, brak wartości ujemnych, brak wartości niecałkowitych.

3. **Raportowanie błędów w GM — ustalone**
   - Model: lista zbiorcza po imporcie + ostrzeżenia użycia rekordu runtime.
   - Dodatkowy wymóg UI: w panelu GM ma powstać pole **„Log importu”** (read-only), które:
     - pokazuje pełną listę błędów/ostrzeżeń,
     - pozwala zaznaczyć i skopiować całość (np. `textarea`/`pre` z obsługą zaznaczenia),
     - zachowuje szczegóły: zakładka, `ID`, kolumna, opis błędu.

4. **Polityka fallbacku runtime — ustalone**
   - Przy błędzie assetu: wybór **pierwszego poprawnego pliku z listy**.
   - Jednocześnie: jawne ostrzeżenie w panelu GM z dokładnym opisem problemu (źródło, rekord, powód, zastosowany fallback).

### 11.8.9.3. Fallback fontów — decyzja implementacyjna

Potwierdzone wymaganie:
- fallback fontów ma być zapisany bezpośrednio w kodzie,
- fallback ma być identyczny dla każdego fontu.

Przyjęta zasada:
- niezależnie od wybranego `NazwaFontu`, końcówka stacku fallback pozostaje wspólna (np. `..., Calibri, Arial, sans-serif`).
- importer manifestu mapuje tylko font podstawowy, a fallback dopina warstwa runtime/UI.

### 11.8.9.4. Odpowiedź na pytanie o gotowość do wdrożenia

**Tak — jesteśmy gotowi do wejścia w zmiany plików testowych**, z dwoma znanymi brakami wskazanymi przez Ciebie:
1. finalna wersja `DataSlate_manifest.xlsx`,
2. komplet wskazanych plików referencyjnych z narysowaną ramką (sekcja 11.8.5).

Poza tym decyzje wykonawcze do 11.8.6 są domknięte i można rozpoczynać implementację zgodnie z wymaganiami `Infoczytnik/AGENTS.md`.

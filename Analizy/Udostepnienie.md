# Analiza wdrożenia modelu „DoPublikacji” dla wszystkich modułów

## Prompt użytkownika (kontekst)

> Przeprowadź analizę i zapisz jej wyniki jako Analizy/Udostepnienie.md
>
> Planuję przygotować aplikację (wszystkie moduły) do udostępnienia dla innych graczy.
> Każda z grupy graczy będzie miała własną kopię aplikacji na własnym serwerze.
> Planuję stworzyć folder "DoPublikacji".
> W tym folderze byłby kopie wszystkich modułów:
>
> 1. Hiperłącza do strony głównej byłby czyste. Nie przenosiłby nigdzie. W kodzie i pliku README musi być informacja, że należy to uzupełnić.
> 2. W module DataVault nie będzie pliku "Repozytorium.xlsx". Będzie też utworzony nowy plik data.json zawierający tylko przykładowe dane. Każda grupa musi sobie własnoręcznie przygotować plik wsadowy.
> 3. Podobnie jak w pkt2 w module Audio nie będzie pliku "AudioManifest.xlsx"
> 4. Pliki "firebase-config.js" w każdym z modułów nie będzie zawierać prawdziwych danych typu apiKey, authDomain, projectId itd. Zamiast tego będzie placeholder "ENTER FIREBASE CONFIG HERE" (lub inny o lepszej treści)
> 5. W niektórych modułach jest menu do zmiany języka. Domyślnie jest polski. W kopiach do udostępnienia domyślnie ma być angielski.
> 6. W plikach dokumentacji (README.md i Documentation.md) najpierw ma być angielska wersja językowa a następnie polska wersja językowa.
> 7. W kopii do udostępnienia ma nie być śladów po tworzeniu aplikacji PWA oraz funkcji wyświetlania powiadomień
> 8. W kopii w pliku Main/ZmienneHiperlacza.md musi zawierać placeholdery zamiast prawdziwych linków.
> 9. W kopii nie będą potrzebne pliki AGENST.md, DetaleLayout.md, DoZrobienia.md, Kolumny.md oraz WebView_FCM_Cloudflare_Worker (jest to powiązane z wymaganiem z pkt7)
> 10. W wielu miejscach aplikacji są ładowane obrazki, grafiki itd. One będą skopiowane do folderu "DoPublikacji". Sprawdź czy jak ktoś skopiuje np. moduł Kalkulator na swój serwer (razem z obrazkami) to będą się one prawidłowo ładować czy odnośniki będą wczytywać pliki z mojego GitHuba.
> 11. W module DataVault oraz Audio jest mechanizm tworzenia pliku json. Sprawdź czy on zadziała po przeniesieniu modułu do innej lokalizacji.
>
> Celem jest stworzenie kopii plików, które każdy będzie mógł wgrać na swój serwer a następnie (po uzupełnieniu Firebase i hiperłączy) korzystać w swojej grupie bez "przeszkadzania sobie" wzajemnie z innymi grupami. Sprawdź czy są jeszcze jakieś zagrożenia związane z udostępnieniem. Wnioski te zapisz też w analizie.
>
> W analizę przygotuj mi też treść nowego pliku DoPublikacji/AGENTS.md
> Plik ten ma zawierać instrukcję, że jakieś zmiany, aktualizacje, poprawki w głównym module musi też mieć odzwierciedlenie w jego kopii "DoPublikacji" poza danymi, które trzeba będzie ręcznie poprawić dla nowej grupy (np. hiperłącza czy powiązania z Firebase).
>
> Przeprowadź analizę wprowadzenia takiego rozwiązania.

---

## Wniosek ogólny

Tak — koncepcja folderu `DoPublikacji` jest sensowna i realna do wdrożenia. Trzeba jednak potraktować ją jako **wariant „sanityzowany” (bez danych prywatnych, bez endpointów produkcyjnych, bez linków do Twojej infrastruktury)**, z własnym zestawem zasad publikacji.

Największe ryzyka nie dotyczą samej kopii plików, tylko:
1. pozostawionych linków do Twojego GitHuba i usług,
2. konfiguracji Firebase/Web Push,
3. zależności od brakujących plików wsadowych (XLSX),
4. domyślnych ustawień języka oraz kolejności dokumentacji,
5. synchronizacji zmian między „wersją główną” i „DoPublikacji”.

---

## Ocena punkt po punkcie (1–11)

### 1) „Czyste” hiperłącza na stronie głównej
**Status analizy:** wymagane i zasadne.

W `Main/index.html` część linków jest na stałe podpięta do `cutelittlegoat.github.io` (DataVault, GeneratorNPC, Kalkulator, także warianty admin). To spowoduje przekierowanie użytkownika do Twojej instancji zamiast do kopii grupowej. Wersja `DoPublikacji` powinna mieć placeholdery oraz czytelną instrukcję uzupełnienia.

### 2) DataVault bez `Repozytorium.xlsx`, z przykładowym `data.json`
**Status analizy:** poprawne podejście, ale trzeba opisać konsekwencje.

Mechanizm DataVault pobiera `Repozytorium.xlsx` lokalnie (`fetch("Repozytorium.xlsx")`) przy generowaniu nowego `data.json`. Jeśli plik nie będzie obecny, generator nie zadziała (to oczekiwane). Dlatego konieczna jest jasna instrukcja: „wgraj własny XLSX do katalogu modułu”.

### 3) Audio bez `AudioManifest.xlsx`
**Status analizy:** poprawne podejście, z tym samym warunkiem jak w pkt 2.

Audio ładuje manifest przez `fetch("AudioManifest.xlsx")`. Bez pliku moduł nie zbuduje listy dźwięków. To jest akceptowalne dla „pustej” wersji publikacyjnej, ale musi być komunikat i instrukcja onboardingowa.

### 4) Placeholdery w `firebase-config.js`
**Status analizy:** krytyczne i obowiązkowe.

W repo są realne konfiguracje Firebase w kilku modułach (`Kalkulator`, `Audio`, `GeneratorNPC`, `Infoczytnik`). Dla `DoPublikacji` trzeba je zastąpić neutralnym szkieletem (placeholderami) i ewentualnie fail-fast (czytelny komunikat, że konfiguracja nieuzupełniona).

### 5) Domyślny język EN w kopii publikacyjnej
**Status analizy:** możliwe, wymaga przeglądu modułów.

W wielu modułach domyślna wartość jest ustawiona jako `"pl"` (np. DataVault, Audio, DiceRoller, GeneratorNazw, GeneratorNPC, Kalkulator). Zmiana w `DoPublikacji` jest możliwa, ale powinna objąć zarówno `currentLanguage`, jak i atrybut `<html lang="...">` tam, gdzie to potrzebne.

### 6) Kolejność językowa dokumentacji: EN -> PL
**Status analizy:** wykonalne, ale pracochłonne.

Obecnie dokumenty często zaczynają się od polskiej wersji. W `DoPublikacji` trzeba uporządkować wszystkie `docs/README.md` i `docs/Documentation.md` w każdej aplikacji według Twojej reguły.

### 7) Usunięcie śladów PWA i powiadomień
**Status analizy:** zasadne, wymaga pełnego cięcia.

PWA/push są obecne m.in. przez `manifest.webmanifest`, `service-worker.js`, rejestrację SW, przycisk „Włącz powiadomienia” i ładowanie `Infoczytnik/config/web-push-config.js` w `Main/index.html`. Wersja publikacyjna musi to usunąć spójnie (HTML + JS + pliki konfiguracyjne + folder workerów).

### 8) Placeholdery w `Main/ZmienneHiperlacza.md`
**Status analizy:** obowiązkowe.

Aktualnie są tam realne linki (Owlbear/Discord). W kopii publikacyjnej powinny być jawne placeholdery do ręcznego podmiany.

### 9) Usunięcie wskazanych plików/folderów z kopii
**Status analizy:** poprawne.

Wersja `DoPublikacji` nie powinna zawierać plików organizacyjnych i deweloperskich, których użytkownicy końcowi nie potrzebują (`AGENTS.md`, `DetaleLayout.md`, `DoZrobienia.md`, `Kolumny.md`, `WebView_FCM_Cloudflare_Worker`).

### 10) Ładowanie obrazków/grafik po skopiowaniu modułów
**Status analizy:** mieszane wyniki.

- **Kalkulator**: obrazy lokalne (`Skull.png`, `Koza.gif`) są referencjami względnymi, więc po skopiowaniu modułu z plikami będą działać.
- **Main**: logo jest lokalne, ale część linków modułów jest zewnętrzna (GitHub Pages), więc nawigacja nie będzie lokalna bez podmiany.
- **Infoczytnik**: `assets/data/data.json` zawiera bezwzględne URL-e do `cutelittlegoat.github.io`, więc zasoby będą ładowane z Twojego hosta, nie z kopii grupy.
- **GeneratorNPC**: odwołuje się do `DATA_URL = https://cutelittlegoat.github.io/.../DataVault/data.json`, więc będzie ciągnąć dane z Twojej instancji.

Wniosek: samo „kopiowanie obrazków” nie wystarczy — trzeba usunąć hardcoded URL-e do Twojego hostingu.

### 11) Czy generowanie JSON w DataVault/Audio działa po przeniesieniu
**Status analizy:** tak, warunkowo.

- **DataVault**: mechanizm jest oparty o pliki lokalne (`Repozytorium.xlsx`, `data.json`) i nie zależy od konkretnej domeny; zadziała po przeniesieniu, jeśli pliki istnieją i biblioteki CDN są dostępne.
- **Audio**: mechanizm odczytu manifestu jest lokalny (`AudioManifest.xlsx`), więc również zadziała po przeniesieniu; adresy audio zależą jednak od danych w kolumnie `LinkDoFolderu` — jeśli tam będą stare bezwzględne URL-e, odtwarzanie pójdzie do starego hosta.

---

## Dodatkowe zagrożenia (poza pkt 1–11)

1. **Cross-group contamination danych przez Firebase**
   - Jeżeli dwie grupy użyją tego samego projektu Firebase, będą widzieć wspólne dane (ulubione/listy/ustawienia zależnie od modułu).
   - Należy wymusić „1 grupa = 1 projekt Firebase”.

2. **Niejednolity poziom izolacji modułów**
   - Część modułów jest gotowa do pracy lokalnej, część ma hardcoded URL-e do Twojej infrastruktury.
   - Potrzebny jeden wspólny standard: zero URL-i zależnych od autora w `DoPublikacji`.

3. **Zależność od CDN (SheetJS/Firebase/Google Fonts)**
   - Moduły polegają na zasobach zewnętrznych; przy blokadach sieci część funkcji nie działa.
   - W analizie wdrożeniowej warto rozważyć tryb „offline bundle” jako osobny etap.

4. **Brak automatycznej weryfikacji „czystości” paczki**
   - Bez skryptu walidującego łatwo omyłkowo zostawić sekrety/linki produkcyjne.
   - Rekomendacja: dodać checklistę/smoke test przed publikacją.

5. **Ryzyko niespójności między gałęzią główną i `DoPublikacji`**
   - Każda zmiana funkcjonalna w głównych modułach musi mieć lustrzane odzwierciedlenie w kopii publikacyjnej (poza ręcznymi danymi grupy).

---

## Rekomendowany model wdrożenia `DoPublikacji`

1. Budować `DoPublikacji` jako **artefakt publikacyjny**, nie ręcznie klejoną kopię.
2. W kroku publikacji wykonywać automatycznie:
   - podmianę linków na placeholdery,
   - podmianę firebase-config na template,
   - usunięcie PWA/push,
   - usunięcie plików deweloperskich,
   - ustawienie domyślnego języka EN,
   - weryfikację, że nie zostały URL-e do Twojego hostingu.
3. Dodać prosty raport „PASS/FAIL” z publikacji (co zostało zanonimizowane, co wymaga ręcznego działania).

---

## Proponowana treść pliku `DoPublikacji/AGENTS.md`

```md
# Zasady utrzymania kopii DoPublikacji

Folder `DoPublikacji` jest publikacyjną kopią aplikacji WrathAndGlory, przeznaczoną do wdrażania przez niezależne grupy graczy na własnych serwerach.

## Zasada nadrzędna
Każda zmiana funkcjonalna, poprawka błędu, aktualizacja UI/UX lub refaktoryzacja wykonana w modułach głównych repozytorium MUSI zostać odzwierciedlona także w odpowiadających plikach w `DoPublikacji`.

## Wyjątki (dane celowo nieprzenoszone 1:1)
Nie kopiujemy 1:1 danych, które każda grupa musi uzupełnić samodzielnie:
- hiperłącza grupowe (np. `Main/ZmienneHiperlacza.md`),
- konfiguracje Firebase (`firebase-config.js`),
- pliki wsadowe i ich zawartość (np. `Repozytorium.xlsx`, `AudioManifest.xlsx`, dane prywatne grupy),
- inne dane środowiskowe/specyficzne dla serwera danej grupy.

## Wymagany standard dla DoPublikacji
1. Brak prawdziwych sekretów i konfiguracji produkcyjnych autora.
2. Brak twardych odwołań do prywatnej infrastruktury autora (linki, endpointy, hostowane dane).
3. Domyślny język użytkowy ustawiony na EN (jeśli moduł wspiera wybór języka).
4. Brak elementów PWA/Web Push, chyba że dokument publikacyjny wyraźnie dopuszcza inaczej.
5. Dokumentacja modułu (`docs/README.md`, `docs/Documentation.md`) aktualna i zgodna z wersją publikacyjną.

## Kontrola przed wydaniem
Przed udostępnieniem nowej wersji `DoPublikacji` należy wykonać kontrolę:
- czy wszystkie moduły działają lokalnie po podaniu własnych danych grupy,
- czy nie ma odwołań do starego hostingu,
- czy placeholdery wymagające ręcznej konfiguracji są czytelnie opisane w README.
```

---

## Podsumowanie końcowe

Plan `DoPublikacji` jest dobry i zwiększy bezpieczeństwo oraz niezależność grup, ale wymaga dyscypliny: **sanityzacja konfiguracji + usunięcie twardych URL-i + synchronizacja zmian między wersją główną i publikacyjną**. Jeśli te trzy elementy będą egzekwowane, grupy będą mogły działać całkowicie niezależnie „bez przeszkadzania sobie”.

---

## Doprecyzowanie: Infoczytnik i `DataSlate_manifest.xlsx` (2026-04-29)

### Prompt użytkownika (kontekst)

> Przeczytaj pliki:
> Analizy/Hardcoded_URL_Audyt_2026-04-28.md
> Analizy/Udostepnienie.md
>
> Mam pytanie odnośnie modułu Infoczytnik. Tam jest plik DataSlate_manifest.xlsx zawierający ścieżki do assetów (tło, audio, itd.) Czy nic się nie popsuje w przypadku modyfikacji tego modułu? Nie wystarczy w pliku DataSlate_manifest.xlsx wpisać nowych ścieżek do plików?
> Jak dokładnie ma wyglądać zmiana linków? W pliku z manifestem będę miał dalej zapisane dokładne linki bezpośrednio do pliku?
>
> Wnioski dopisz do pliku Analizy/Hardcoded_URL_Audyt_2026-04-28.md oraz do pliku Analizy/Udostepnienie.md

### Odpowiedź operacyjna

Dla Infoczytnik samo uzupełnienie `DataSlate_manifest.xlsx` jest poprawnym krokiem, **ale niewystarczającym**, jeśli nie zostanie odświeżony finalny plik danych ładowany przez frontend (`Infoczytnik/assets/data/data.json`).

Innymi słowy: o tym, czy moduł działa po zmianie, decyduje finalny JSON używany w runtime, a nie sam plik XLSX jako źródło pośrednie.

### Rekomendowany standard dla „DoPublikacji”

1. W manifeście wpisywać ścieżki niezależne od domeny autora.
2. Preferować ścieżki względne do plików w obrębie `Infoczytnik/assets/...`.
3. Po każdej zmianie manifestu przebudować JSON i sprawdzić działanie modułu.
4. Nie zostawiać URL-i absolutnych do starego hostingu, jeśli celem jest pełna niezależność grup.

### Czy można zostawić „dokładne linki bezpośrednio do pliku”?

Tak, ale zalecane jest, aby były to „dokładne ścieżki względne”, a nie absolutne URL-e `https://...`.

- Absolutne URL-e: wygodne, ale wiążą kopię z jednym hostem.
- Relatywne ścieżki: również precyzyjne, a jednocześnie przenośne między środowiskami.

### Minimalna checklista bezpieczeństwa zmiany

- zaktualizowano `DataSlate_manifest.xlsx`,
- wygenerowano/odświeżono `data.json` używany przez Infoczytnik,
- wszystkie assety (tła/logo/audio) ładują się bez błędów 404,
- w finalnym JSON nie ma linków do domeny autora.

Wniosek: zmiana jest bezpieczna, jeśli traktujesz ją jako proces **manifest + regeneracja danych + test runtime**, a nie tylko edycję jednego arkusza.

---

## Etap 1 wykonany (2026-04-29): przejście na ścieżki względne

Poniżej pełna lista linków poprawionych w kodzie (Było → Jest):

1. `Main/index.html`
- `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html` → `../DataVault/index.html`
- `https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNPC/` → `../GeneratorNPC/`
- `https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/` → `../Kalkulator/`
- `https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/index.html` → `../Infoczytnik/index.html`
- `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html?admin=1` → `../DataVault/index.html?admin=1`

2. `GeneratorNPC/index.html`
- `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json` → `../DataVault/data.json`

3. `GeneratorNPC/docs/Documentation.md`
- `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json` → `../DataVault/data.json`

4. `Infoczytnik/assets/data/data.json` (wygenerowane ponownie z nowego `DataSlate_manifest.xlsx`)
- linki absolutne `https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/...` → ścieżki względne `assets/...`
- audio: `.../assets/audios/Message.mp3` → `assets/audios/KeyboardTyping.mp3`


---

## Weryfikacja gotowości do przygotowania kopii `DoPublikacji` (2026-04-29)

### Prompt użytkownika (kontekst)

> Przeczytaj analizę Analizy/Udostepnienie.md a następnie sprawdź kod aplikacji. Czy wszystko już jest gotowe do przygotowania kopii wszystkich modułów do DoPublikacji?
> Kopia modułu DataVault ma zawierać data.json będący kopią pliku Analizy/test.json
> Wnioski analizy dopisz do pliku Analizy/Udostepnienie.md

### Wynik krótkiej kontroli

**Nie — na ten moment repozytorium nie jest jeszcze w pełni gotowe do finalnego przygotowania kompletnej kopii wszystkich modułów do `DoPublikacji`.**

Najważniejszy brak blokujący:
- W folderze `DoPublikacji` znajduje się obecnie tylko `DoPublikacji/AGENTS.md` (brak skopiowanych modułów).
- Nie istnieje `DoPublikacji/DataVault/data.json`, więc wymaganie „kopia `Analizy/test.json`” nie jest jeszcze spełnione.

### Co już jest przygotowane, a co nadal wymaga pracy

1. **Relatywne ścieżki między modułami**
   - Część zmian została już wykonana (wcześniejszy etap z URL-ami względnymi).
   - To dobry fundament do kopiowania modułów między serwerami.

2. **Domyślny język EN w kopii publikacyjnej**
   - W kodzie nadal występują ustawienia domyślne PL (`<html lang="pl">`, `currentLanguage = "pl"`) w wielu modułach.
   - Przed publikacją kopii należy je przełączyć na EN w wariancie `DoPublikacji`.

3. **Usunięcie śladów PWA / Web Push**
   - W kodzie nadal występują elementy Web Push / SW (m.in. `web-push-config.js`, rejestracja `service-worker.js`).
   - Wersja publikacyjna powinna mieć te elementy usunięte zgodnie z założeniami.

4. **DataVault: wymagany `data.json` z `Analizy/test.json`**
   - Warunek jest jednoznaczny: do kopii publikacyjnej modułu DataVault trzeba wstawić `data.json` jako kopię `Analizy/test.json`.
   - Na teraz ten krok nie został jeszcze wykonany, bo nie ma jeszcze struktury modułu DataVault w `DoPublikacji`.

### Wniosek operacyjny

Repo jest **w fazie przygotowania**, ale **nie w stanie „gotowe do publikacji”**.
Aby osiągnąć gotowość, trzeba najpierw utworzyć kompletną strukturę modułów w `DoPublikacji`, a następnie wykonać sanityzację zgodną z wcześniejszą analizą (placeholdery, EN default, usunięcie PWA/push, podmiana danych wsadowych), w tym obowiązkowo:

- utworzyć `DoPublikacji/DataVault/data.json` jako kopię `Analizy/test.json`.

---

## Realizacja zadania: oznaczenie miejsc rozbudowy językowej (2026-04-30)

### Prompt użytkownika (kontekst)

> Przeczytaj plik Analizy/Udostepnienie.md
> ... Aktualizuj tylko dokumentację oraz dodaj komentarze w kodzie.
> Informacje o dokonanych zmianach dopisz do pliku Analizy/Udostepnienie.md

### Zakres wykonanych zmian

1. Dodano dwujęzyczne komentarze techniczne **„MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT”** w kodzie modułów:
   - `Main/index.html`
   - `DataVault/app.js`
   - `Audio/index.html`
   - `DiceRoller/script.js`
   - `GeneratorNazw/script.js`
   - `GeneratorNPC/index.html`
   - `Kalkulator/KalkulatorXP.html`
   - `Kalkulator/TworzeniePostaci.html`

2. Uzupełniono instrukcje użytkowe i techniczne o sekcję dodawania nowych wersji językowych we wszystkich modułach (`docs/README.md` i `docs/Documentation.md`):
   - `Main`, `DataVault`, `Audio`, `DiceRoller`, `GeneratorNazw`, `GeneratorNPC`, `Kalkulator`, `Infoczytnik`.

### Zmiany w kodzie – format „Było / Jest”

- Plik `DataVault/app.js`
  - Było: `const translations = {`
  - Jest: `// --- MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT ---` + komentarze instrukcyjne + `const translations = {`

- Plik `Audio/index.html`
  - Było: `const translations = {`
  - Jest: `// --- MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT ---` + komentarze instrukcyjne + `const translations = {`

- Plik `DiceRoller/script.js`
  - Było: `const translations = {`
  - Jest: `// --- MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT ---` + komentarze instrukcyjne + `const translations = {`

- Plik `GeneratorNazw/script.js`
  - Było: `const translations = {`
  - Jest: `// --- MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT ---` + komentarze instrukcyjne + `const translations = {`

- Plik `GeneratorNPC/index.html`
  - Było: `const translations = {`
  - Jest: `// --- MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT ---` + komentarze instrukcyjne + `const translations = {`

- Plik `Kalkulator/KalkulatorXP.html`
  - Było: `const translations = {`
  - Jest: `// --- MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT ---` + komentarze instrukcyjne + `const translations = {`

- Plik `Kalkulator/TworzeniePostaci.html`
  - Było: `const translations = {`
  - Jest: `// --- MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT ---` + komentarze instrukcyjne + `const translations = {`

- Plik `Main/index.html`
  - Było: `<main>`
  - Jest: `<main>` + komentarz HTML z informacją, że stałe etykiety trzeba aktualizować ręcznie przy nowym języku.

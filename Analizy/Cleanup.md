# Audyt kodu aplikacji WrathAndGlory — wnioski i rekomendacje

Data zapisu: 2026-05-12  
Repozytorium: `CuteLittleGoat/WrathAndGlory`  
Status pliku: zapis lokalny w tej rozmowie, bez commita do repozytorium.

## Zakres i założenia audytu

Ten dokument zbiera wnioski z przeglądu kodu aplikacji WrathAndGlory pod kątem tak zwanych „śmieci”: martwych fragmentów kodu, osieroconych plików, nieużywanych zmiennych, starych ścieżek logicznych i niespójności między dokumentacją a aktualnym zachowaniem aplikacji.

Zgodnie z decyzją właściciela repozytorium, poniższe obszary nie są traktowane jako śmieci i nie powinny być uwzględniane przy automatycznym sprzątaniu:

- folder `Infoczytnik` zawiera produkcję, testy i backupy obok siebie — to świadoma decyzja i ma tak zostać;
- folder `WebView_FCM_Cloudflare_Worker/` zostaje bez zmian — to świadoma decyzja;
- folder `Analizy` nie jest brany pod uwagę przy ocenie aktywnego kodu aplikacji;
- po stronie właściciela repozytorium wykonano już ręczne porządki: usunięto jeden folder, wyczyszczono analizy i przeniesiono `TRIGGER_TOKEN`.

## Najważniejszy wniosek ogólny

Nie należy obecnie usuwać `DataVault/build_json.py` ani `DataVault/xlsxCanonicalParser.js` jako zwykłych „śmieci”. Oba pliki dotyczą krytycznego obszaru generowania danych z `Repozytorium.xlsx` i mogą być potrzebne do zachowania zgodności między wynikiem generowanym przez aplikację w przeglądarce a wynikiem generowanym lokalnie lub referencyjnie.

Wcześniej wystąpił problem, że agent Codex tworzył `data.json` z pliku `Repozytorium.xlsx` inaczej niż aplikacja po kliknięciu przycisku generowania danych. Taka sytuacja nie może się powtórzyć. Dlatego cały obszar `DataVault` wymaga ostrożności i testów regresyjnych przed usuwaniem parserów, fallbacków albo generatorów.

## 1. `service-worker.js` — osierocony i sprzeczny z decyzją online-only

### Stan

Aplikacja ma być uruchamiana przez przeglądarkę lub jako PWA, ale ma działać tylko online.

Aktualnie w repo istnieje `service-worker.js`, który:

- definiuje cache aplikacji;
- cache’uje shell aplikacji, między innymi `./`, `./Main/index.html`, `./manifest.webmanifest` i ikonę;
- w obsłudze `fetch` próbuje najpierw pobrać zasób z sieci, a przy błędzie sięga do cache;
- dla nawigacji bez odpowiedzi zwraca komunikat o wymaganym połączeniu z internetem.

Jednocześnie aktywny `Main/index.html` podpina `manifest.webmanifest`, ale nie rejestruje service workera. Manifest PWA jest nadal potrzebny, bo odpowiada za tryb `standalone`, ikonę i start aplikacji z `./Main/index.html`.

### Wniosek

`service-worker.js` jest obecnie niespójny z decyzją „online-only”. Nawet jeżeli aktualny `Main/index.html` go nie rejestruje, stare instalacje PWA lub wcześniejsze wersje aplikacji mogły już mieć zarejestrowany service worker. Pozostawienie starego service workera może powodować problemy z cache i nieprzewidywalne różnice między użytkownikami.

### Rekomendacja

Nie usuwać manifestu PWA.

Zdecydować jedną z dwóch ścieżek dla `service-worker.js`:

1. Wariant preferowany dla online-only:
   - zastąpić `service-worker.js` wersją cleanup/no-op;
   - wyczyścić stare cache;
   - wykonać `unregister()` na aktywnych klientach, jeżeli to możliwe;
   - zostawić komentarz, że aplikacja jest PWA online-only i nie używa cache offline.

2. Wariant prostszy, ale mniej bezpieczny dla starych instalacji:
   - usunąć `service-worker.js` z repo;
   - poprawić dokumentację;
   - liczyć się z tym, że użytkownicy ze starym zarejestrowanym service workerem mogą wymagać ręcznego odświeżenia albo czyszczenia danych strony.

Dokumentacja `Main/docs/Documentation.md` powinna zostać zaktualizowana, ponieważ nadal opisuje rootowy `service-worker.js` jako globalny Service Worker i sugeruje jego utrzymanie, jeżeli aplikacja ma działać offline. To jest niezgodne z aktualną decyzją online-only.

## 2. `DataVault/xlsxCanonicalParser.js` — potrzebny, ale ma brakującą zależność JSZip

### Stan

`DataVault/xlsxCanonicalParser.js` korzysta z `global.JSZip.loadAsync(arrayBuffer)`, czyli wymaga obecności `window.JSZip`.

W `DataVault/index.html` ładowane są obecnie między innymi:

- `xlsxCanonicalParser.js`;
- `../shared/firebase-config.js`;
- `../shared/firebase-data-loader.js`;
- `app.js`;
- `xlsx.full.min.js` jako ścieżka legacy.

Nie widać jednak ładowania `jszip.min.js` przed `xlsxCanonicalParser.js`.

### Wniosek

To nie jest zwykły martwy kod. To wygląda jak niedokończona lub niespójna konfiguracja zależności. Kanoniczny parser powinien być dostępny, ponieważ odpowiada za spójne przetwarzanie XLSX i ogranicza ryzyko, że przeglądarka oraz generator referencyjny utworzą różne dane.

Jeżeli `JSZip` nie jest ładowany, aplikacja może przejść na fallback albo wygenerować dane inną ścieżką niż zakładana. Właśnie tego trzeba unikać.

### Rekomendacja

Dodać `JSZip` przed `xlsxCanonicalParser.js` w `DataVault/index.html`, na przykład:

    <script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="xlsxCanonicalParser.js"></script>

Nie usuwać jeszcze `xlsx.full.min.js` ani fallbacków, dopóki nie zostanie wykonany test porównujący wynik przeglądarki z wynikiem `build_json.py`.

## 3. `DataVault/build_json.py` — zostawić jako generator referencyjny

### Stan

`DataVault/build_json.py` generuje `data.json` z `Repozytorium.xlsx`. Wykonuje istotne operacje:

- scala kolumny `Zasięg 1`, `Zasięg 2`, `Zasięg 3` do jednej kolumny `Zasięg`;
- scala kolumny `Cecha 1..N` do jednej kolumny `Cechy`;
- buduje `_meta.traits` z arkusza `Cechy`;
- buduje `_meta.states` z arkusza `Stany`;
- buduje `_meta.sheetOrder`;
- buduje `_meta.columnOrder`.

Aktualna implementacja korzysta z minimalnego parsera XLSX opartego o ZIP/XML, bez zewnętrznych zależności typu openpyxl.

### Wniosek

Całego pliku `build_json.py` nie należy usuwać jako starego generatora lokalnego. Pełni rolę referencji i zabezpieczenia przed rozjechaniem wyników generowania danych.

W środku znajduje się jednak funkcja:

    def sheet_to_records(ws):

Wygląda ona na pozostałość po wcześniejszym podejściu z obiektem worksheet / openpyxl, ponieważ używa `ws.iter_rows(...)`, podczas gdy aktualna ścieżka opiera się na ręcznym czytaniu XLSX przez ZIP/XML i `load_xlsx_minimal(...)`.

### Rekomendacja

Zostawić `DataVault/build_json.py` jako generator referencyjny.

Można rozważyć usunięcie samej funkcji `sheet_to_records(ws)`, ale dopiero po potwierdzeniu, że nie jest nigdzie wywoływana.

Nie usuwać funkcji odpowiedzialnych za:

- `load_xlsx_minimal(...)`;
- `merge_range(...)`;
- `merge_traits(...)`;
- `_load_shared_strings(...)`;
- `_load_styles(...)`;
- `_rich_text_to_string(...)`;
- budowę `_meta`.

## 4. Test regresyjny dla generowania danych z XLSX

### Problem do zabezpieczenia

Największe ryzyko w `DataVault` to ponowne pojawienie się sytuacji, w której:

- Codex lub skrypt lokalny generuje jeden wariant `data.json`;
- aplikacja w przeglądarce po kliknięciu przycisku generuje inny wariant;
- do Firebase trafia jeszcze inna reprezentacja danych.

### Rekomendowany test

Należy przygotować test porównawczy:

1. Wejście:
   - `DataVault/Repozytorium.xlsx`.

2. Ścieżka referencyjna:
   - uruchomić `DataVault/build_json.py`;
   - wygenerować `data.json`.

3. Ścieżka przeglądarkowa:
   - w `DataVault/index.html?admin=1` kliknąć `Generuj pliki danych`;
   - wygenerować `data.json` jako backup;
   - wygenerować `firebase-import.json`;
   - z `firebase-import.json` wyciągnąć `dataJson`.

4. Porównać:
   - `data.json` z Pythona;
   - `data.json` z przeglądarki;
   - sparsowany `firebase-import.json.dataJson`.

5. Porównanie powinno być wykonane po normalizacji JSON, czyli bez brania pod uwagę kolejności technicznej formatowania pliku, ale z zachowaniem realnej struktury danych.

Dopiero po takim teście można bezpiecznie usuwać fallbacki albo upraszczać generator.

## 5. `shared/firebase-data-loader.js` — `authUnsubscribe` jest przypisywane, ale niewykorzystywane

### Stan

W `shared/firebase-data-loader.js` istnieje zmienna:

    let authUnsubscribe = null;

Następnie przypisywany jest do niej wynik `onAuthStateChanged(...)`:

    authUnsubscribe = onAuthStateChanged(auth, (user) => {
      ...
    });

Nie widać jednak, żeby `authUnsubscribe()` było gdziekolwiek wywoływane.

W tym samym pliku istnieje funkcja `logoutDataAccess()`, ale ona wykonuje `signOut(auth)`, czyści `currentAuthUser` i resetuje `authReadyPromise`. Nie korzysta z `authUnsubscribe`.

### Wniosek

`authUnsubscribe` nie wygląda dokładnie jak pozostałość po samym przycisku wylogowania. Bardziej wygląda jak pozostałość po planowanym mechanizmie cleanup/teardown listenera auth.

Sam listener `onAuthStateChanged(...)` jest potrzebny, ale przechowywanie funkcji unsubscribe nie jest obecnie używane.

### Rekomendacja

Są dwie sensowne opcje:

1. Uproszczenie:
   - usunąć zmienną `authUnsubscribe`;
   - wywołać `onAuthStateChanged(...)` bez przypisywania wyniku.

2. Pełny cleanup:
   - zostawić `authUnsubscribe`;
   - dodać funkcję typu `disposeFirebaseDataAccess()`;
   - w niej wywołać `authUnsubscribe()` i ustawić zmienną z powrotem na `null`.

Jeżeli nie ma realnego przypadku, w którym loader Firebase jest niszczony bez przeładowania strony, wariant pierwszy jest prostszy.

## 6. `logoutDataAccess()` — funkcja istnieje, ale nie widać aktywnego UI wylogowania

### Stan

`shared/firebase-data-loader.js` eksportuje publicznie `logoutDataAccess()` w `window.DataVaultFirebase`.

Nie widać jednak aktywnego przycisku wylogowania w interfejsie, który by tę funkcję wywoływał.

### Wniosek

To może być pozostałość po wcześniejszym pomyśle na przycisk wylogowania albo przygotowana funkcja na przyszłość.

Nie jest to groźny śmieć, bo funkcja jest mała i logiczna, ale warto zdecydować, czy ma być częścią oficjalnego API loadera.

### Rekomendacja

Jeżeli planowany jest przycisk wylogowania, zostawić `logoutDataAccess()`.

Jeżeli logowanie ma działać wyłącznie jako trwała sesja Firebase bez UI wylogowania, można zostawić funkcję jako wewnętrzną pomocniczą albo usunąć z publicznego `window.DataVaultFirebase`.

## 7. `DataVault/index.html` — hint o Shift / multi-sort wygląda na fałszywą obietnicę UI

### Stan

W `DataVault/index.html` znajduje się tekst wskazówki:

    Kliknij nagłówek, aby sortować (Shift = sort wielokolumnowy).

W dokumentacji DataVault wskazano, że logika multi-sortu nie istnieje w JS, a wskazówka jest statyczna.

### Wniosek

To nie jest martwy kod, ale jest to niespójność UI: użytkownik dostaje informację o funkcji, która najpewniej nie działa.

### Rekomendacja

Wybrać jedną z dwóch opcji:

1. Usunąć fragment `Shift = sort wielokolumnowy` z tekstu podpowiedzi.
2. Dodać realne multi-sortowanie po nagłówkach z obsługą `event.shiftKey`.

Dopóki multi-sort nie istnieje, rekomendowany jest wariant pierwszy.

## 8. `DataVault/xlsxCanonicalParser.js` — drobne nieużywane stałe

### Stan

Na początku `DataVault/xlsxCanonicalParser.js` są stałe:

    const MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
    const REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships";
    const DOC_REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

`DOC_REL_NS` jest używane przy odczycie relacji arkuszy. `MAIN_NS` i `REL_NS` wyglądają na nieużywane.

### Wniosek

To drobny śmieć techniczny, niegroźny dla działania aplikacji.

### Rekomendacja

Można usunąć:

    const MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
    const REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships";

Zostawić:

    const DOC_REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

## 14.9 `DataVault/app.js` — niejawny global `m`

### Stan

W funkcji `formatInlineHTML()` występuje pętla w stylu:

    while ((m = reRefParen.exec(combined))) {
      ...
    }

Jeżeli wcześniej nie ma lokalnej deklaracji `let m;`, taki kod tworzy niejawny global `window.m` w zwykłym skrypcie albo wywoła błąd w trybie strict / module.

### Wniosek

To nie jest nieużywana zmienna, ale jest to brudny global i potencjalny błąd przy przyszłej refaktoryzacji.

### Rekomendacja

Poprawić na:

    let m;
    while ((m = reRefParen.exec(combined))) {
      refs.push({ start: m.index, end: m.index + m[0].length });
    }

## 14.10 Dokumentacja `Main` i `DataVault` wymaga aktualizacji

### Stan

Dokumentacja `Main` nadal opisuje `service-worker.js` jako globalny service worker wspólny dla PWA i cache/fetch.

Dokumentacja `DataVault` opisuje zależność między `build_json.py`, parserem kanonicznym i generowaniem danych, ale aktywny `DataVault/index.html` nie ładuje `JSZip`, którego parser kanoniczny wymaga.

### Wniosek

Dokumentacja częściowo nie nadąża za aktualnymi decyzjami technicznymi.

### Rekomendacja

Zaktualizować dokumentację tak, żeby jasno mówiła:

- aplikacja jest PWA online-only;
- manifest zostaje;
- service worker offline/cache nie jest używany albo został zastąpiony cleanup/no-op;
- `build_json.py` jest generatorem referencyjnym;
- `xlsxCanonicalParser.js` jest browserowym odpowiednikiem referencyjnego parsera;
- `JSZip` jest wymaganą zależnością parsera kanonicznego;
- `xlsx.full.min.js` jest tylko legacy/fallback, dopóki testy nie potwierdzą, że można go usunąć.

## Rzeczy, których nie należy usuwać jako śmieci

Nie usuwać na podstawie samego audytu:

- `DataVault/xlsxCanonicalParser.js`;
- `DataVault/build_json.py`;
- `DataVault/data.json`;
- `DataVault/Repozytorium.xlsx`;
- `manifest.webmanifest`;
- produkcyjnych, testowych i backupowych plików w `Infoczytnik`;
- folderu `WebView_FCM_Cloudflare_Worker/`;
- dużych monolitycznych plików aktywnych modułów, takich jak `GeneratorNPC/index.html` albo `DataVault/app.js`.

Duży plik nie oznacza automatycznie martwego kodu. W tym repo wiele modułów jest świadomie monolitycznych, ponieważ aplikacja działa jako statyczny/browserowy zestaw narzędzi bez klasycznego bundlera.

## Priorytet działań

1. Naprawić `DataVault/index.html`, dodając `JSZip` przed `xlsxCanonicalParser.js`.
2. Przygotować test regresyjny porównujący wynik `build_json.py`, wynik generowania w przeglądarce i `firebase-import.json.dataJson`.
3. Ustalić strategię dla `service-worker.js` przy online-only: cleanup/no-op albo usunięcie plus aktualizacja dokumentacji.
4. Poprawić `authUnsubscribe` w `shared/firebase-data-loader.js`: usunąć albo realnie wykorzystać w cleanupie.
5. Sprawdzić i ewentualnie usunąć nieużywaną funkcję `sheet_to_records(ws)` z `DataVault/build_json.py`.
6. Poprawić hint o `Shift = sort wielokolumnowy` w `DataVault/index.html` albo dodać realny multi-sort.
7. Usunąć nieużywane stałe `MAIN_NS` i `REL_NS` z `DataVault/xlsxCanonicalParser.js`.
8. Poprawić niejawny global `m` w `DataVault/app.js`.
9. Zaktualizować dokumentację `Main` i `DataVault`.

## Minimalna lista zmian do wykonania bez ryzyka dla danych

Te zmiany są relatywnie bezpieczne:

- usunięcie nieużywanych stałych `MAIN_NS` i `REL_NS` z `DataVault/xlsxCanonicalParser.js`;
- poprawienie niejawnego globalnego `m` przez dodanie `let m;`;
- poprawienie tekstu podpowiedzi o multi-sortowaniu, jeżeli funkcja nie istnieje;
- aktualizacja dokumentacji online-only;
- dodanie `JSZip`, ponieważ obecny parser już go wymaga.

Zmiany wymagające ostrożności i testu regresyjnego:

- usuwanie `xlsx.full.min.js`;
- usuwanie fallbacków XLSX;
- usuwanie `build_json.py`;
- zmiany w strukturze `firebase-import.json`;
- zmiany w sposobie budowania `_meta`, `traits`, `states`, `sheetOrder`, `columnOrder`;
- zmiany w scalaniu `Zasięg` i `Cechy`.

## Decyzja końcowa

Repozytorium nie wygląda na pełne przypadkowych śmieci w aktywnym kodzie. Główne problemy to:

- nieaktualna lub niespójna ścieżka PWA service workera;
- brakująca zależność `JSZip` dla kanonicznego parsera XLSX;
- kilka drobnych pozostałości technicznych;
- dokumentacja, która częściowo opisuje poprzednie decyzje;
- bardzo wrażliwy obszar generowania danych, którego nie wolno sprzątać bez testów porównawczych.

Najważniejsza zasada przy dalszych zmianach: nie upraszczać `DataVault` bez porównania wyniku generowania danych z `Repozytorium.xlsx` po obu ścieżkach: referencyjnej i przeglądarkowej.

## 11. Dodatkowe wnioski po pełnym przeglądzie plików (kontynuacja analizy)

Prompt użytkownika, dla zachowania kontekstu: „Przeczytaj Analizy/Cleanup.md a następnie dopisz do analizy kolejne wnioski. Sprawdź całą analizę i kod aplikacji. Sprawdź czy są jakieś zbędne pliki. Nic nie kasuj z Analizy/Cleanup.md tylko dopisz kolejne wnioski.”

### 11.1 `Infoczytnik/backend/node_modules` jest zacommitowane do repozytorium

#### Stan

W drzewie repozytorium znajduje się pełny katalog zależności runtime/development `Infoczytnik/backend/node_modules`.

#### Wniosek

To może być celowe (np. środowisko bez instalacji `npm i`), ale z perspektywy utrzymania często jest to techniczny balast:

- bardzo zwiększa rozmiar repo;
- utrudnia code review (dużo szumu przy zmianach zależności);
- zwiększa ryzyko konfliktów i przypadkowych nadpisań lockfile/deps.

Nie klasyfikuję tego automatycznie jako „śmieć do usunięcia”, bo repo ma niestandardowe założenia i część folderów archiwalnych jest celowo utrzymywana. To jednak obszar, który warto świadomie potwierdzić decyzją właściciela.

#### Rekomendacja

- Jeżeli to nie jest wymóg wdrożeniowy: rozważyć usunięcie `node_modules` z repo i przejście na instalację przez `package.json`/`package-lock.json`.
- Jeżeli to jest wymóg wdrożeniowy: zostawić, ale dopisać explicite do dokumentacji repo, że `node_modules` w `Infoczytnik/backend` jest utrzymywane celowo.

### 11.2 Potencjalne duplikaty zasobów ikon między root i `WebView_FCM_Cloudflare_Worker`

#### Stan

W repo jednocześnie występują:

- `IkonaGlowna.png` (root);
- `IkonaPowiadomien.png` (root);
- `WebView_FCM_Cloudflare_Worker/IkonaGlowna.png`;
- `WebView_FCM_Cloudflare_Worker/IkonaPowiadomien.png`.

#### Wniosek

To potencjalna redundancja plików binarnych (dwie kopie tych samych nazw), ale ponieważ folder `WebView_FCM_Cloudflare_Worker` został wcześniej oznaczony jako „zostaje bez zmian”, nie należy wykonywać automatycznego cleanupu.

#### Rekomendacja

- Sprawdzić sumy kontrolne (hash) i potwierdzić, czy pliki są identyczne.
- Jeżeli identyczne i nie ma wymogu osobnych kopii dla pipeline’u worker/webview: można docelowo zredukować do jednego źródła prawdy.
- Jeżeli pipeline wymaga osobnych kopii: zostawić i opisać to w dokumentacji technicznej tego modułu, żeby uniknąć przypadkowego „sprzątania” w przyszłości.

### 11.3 `Kalkulator/Old/` wygląda na świadome archiwum historyczne, nie martwy kod aktywnego modułu

#### Stan

Występuje folder `Kalkulator/Old/` z plikami `HowToUse_Org.pdf` i `Kalkulator_Org.html`.

#### Wniosek

Nazewnictwo i lokalizacja sugerują archiwum wersji historycznej. Bez jednoznacznego potwierdzenia właściciela nie należy traktować tego jako śmieci do usunięcia.

#### Rekomendacja

- Zostawić pliki.
- Ewentualnie dodać krótki komentarz w dokumentacji technicznej Kalkulatora, że `Old/` jest archiwum i nie jest częścią aktywnej ścieżki wykonania.

### 11.4 `service-worker.js` nadal obecny w root i nadal niespójny z online-only (potwierdzenie)

#### Stan

Po ponownej weryfikacji plik `service-worker.js` nadal istnieje w katalogu głównym repo. `Main/index.html` pozostaje podpięty do manifestu PWA.

#### Wniosek

To podtrzymuje wcześniejszy wniosek: plik nie został jeszcze rozstrzygnięty strategicznie (cleanup/no-op vs pełne usunięcie + obsługa starych instalacji).

#### Rekomendacja

Utrzymać wysoki priorytet zadania z sekcji „Priorytet działań” i nie wykonywać przypadkowego usunięcia bez planu migracji dla istniejących instalacji PWA.

### 11.5 Brak twardego potwierdzenia, że istnieje zbędny plik możliwy do natychmiastowego bezpiecznego usunięcia

#### Wniosek końcowy z tej iteracji

Po ponownym przeglądzie całego repo (z uwzględnieniem wcześniejszych wyjątków właściciela) nie ma obecnie oczywistego kandydata typu „na pewno śmieć, usuń od razu” bez ryzyka naruszenia procesu lub historycznych zasobów referencyjnych.

Najbezpieczniejsze podejście pozostaje takie samo:

1. Najpierw decyzje właścicielskie (co jest archiwum celowym, a co nie).
2. Następnie testy/regresja dla obszarów wrażliwych (`DataVault`).
3. Dopiero na końcu selektywny cleanup plików potwierdzonych jako zbędne.

## 12. Dodatkowe wnioski po doprecyzowaniu właściciela (2026-05-12)

Prompt użytkownika: Przeczytaj Analizy/Cleanup.md a następnie dopisz do analizy kolejne wnioski. Nic nie kasuj z Analizy/Cleanup.md tylko dopisz kolejne wnioski. Nie wprowadzaj zmian w kodzie.

Wstęp: Na pewnym etapie projektu były prowadzone prace nad powiadomieniami Push w aplikacji PWA. Dokumentacja jest w WebView_FCM_Cloudflare_Worker. Folder WebView_FCM_Cloudflare_Worker pozostawiamy jako archiwalny. Funkcjonalność nie będzie wdrażana.

Poniżej moje komentarze:

11.1 Infoczytnik/backend/node_modules jest zacommitowane do repozytorium
- Czy to nie jest pozostałość po próbie wdrożenia powiadomień Push? Jeżeli tak, to traktujemy to jako pozostałość i oznaczamy jako do skasowania.

11.2 Potencjalne duplikaty zasobów ikon między root i WebView_FCM_Cloudflare_Worker
- Folder WebView_FCM_Cloudflare_Worker pozostawiamy jako archiwalny. Duble są akceptowalne

11.3 Kalkulator/Old/ wygląda na świadome archiwum historyczne, nie martwy kod aktywnego modułu
- Tak. To archiwum historyczne. Pozostaje jak jest.

11.4 service-worker.js nadal obecny w root i nadal niespójny z online-only (potwierdzenie)
- Aplikacja ma działać tylko w trybie online. Zarówno przez stronę https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html?admin=1 lub https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html oraz przez aplikację PWA. Nie rozumiem tego technicznego żargonu. Zdecyduj co należy zrobić z tym plikiem. Jeżeli trzeba coś doprecyzować to napisz jaką decyzję muszę podjąć (opisz tylko dokładnie co, dlaczego i jakie będą konsekwencje).

11.5 Brak twardego potwierdzenia, że istnieje zbędny plik możliwy do natychmiastowego bezpiecznego usunięcia
- Zbędne pliki będziemy kasować dopiero po zakończeniu analizy. Pliki DealeLayout.md, DoZrobienia.md, Kolumny.md teoretycznie nie są do niczego potrzebne, ale mają zostać po czyszczeniu. Tak samo folder Analizy nie jest potrzebny, ale chcę, żeby został.

Dodatkowa uwaga dotycząca modułu DataVault - w poprzedniej wersji aplikacji plik "Repozytorium.xlsx" był w folderze w repo. Aplikacja tworzyła plik data.json. Pojawił się jednak pewien problem - jeżeli data.json generował agent AI Codex to tworzył inny plik data.json niż plik, który tworzył się poprzez przycisk w interface użytkownika z poziomu admina. Powodowało to niedopuszczalną sytuację, gdzie z jednego pliku wsadowego (Repozytorium.xlsx) powstawały dwa różne pliki data.json
Obecnie tworzą się dwa pliki. Jeden jako archiwum danych i drugi do importu do Firebase.
Zwróć szczególną uwagę, żeby przy Cleanup nie popsuć tej mechaniki.

### 12.1 Status `Infoczytnik/backend/node_modules` po doprecyzowaniu

#### Wniosek

Na podstawie decyzji właściciela ten katalog należy traktować jako **pozostałość po pracach push/PWA**, a więc jako element kandydujący do usunięcia na etapie właściwego cleanupu (nie teraz, bo obecny etap jest analityczny).

#### Konsekwencja dla planu cleanupu

- Oznaczyć `Infoczytnik/backend/node_modules` jako „do usunięcia w etapie wykonawczym cleanupu”.
- Przed usunięciem potwierdzić, że moduł `Infoczytnik/backend` nadal odtwarza środowisko z `package.json` / lockfile (jeśli są używane).

### 12.2 Duplikaty ikon root vs `WebView_FCM_Cloudflare_Worker`

#### Wniosek

Po decyzji właściciela duplikaty w tym obszarze są **akceptowalne**, bo folder `WebView_FCM_Cloudflare_Worker` ma status archiwalny i pozostaje bez zmian.

#### Konsekwencja dla planu cleanupu

- Nie usuwać duplikatów ikon z folderu archiwalnego.
- Utrzymać zasadę: archiwum zostaje 1:1, nawet jeśli technicznie zawiera redundancję.

### 12.3 `Kalkulator/Old/` jako archiwum historyczne

#### Wniosek

Status potwierdzony: to świadome archiwum historyczne, nie martwy kod aktywnego modułu.

#### Konsekwencja dla planu cleanupu

- Brak działań usuwających.
- Traktować folder jako część zasobów historycznych projektu.

### 12.4 Decyzja dla `service-worker.js` przy modelu „online-only + PWA”

#### Wniosek techniczny w prostym języku

Jeżeli aplikacja ma działać **wyłącznie online**, to aktywny service worker z cache offline jest zbędny, a czasem nawet szkodliwy (może utrzymywać stare pliki i dawać różne efekty u różnych użytkowników).

Jednocześnie sam tryb PWA (ikona na ekranie, uruchamianie jak aplikacja) może działać przez sam `manifest.webmanifest` — bez aktywnego cache offline.

#### Rekomendowane działanie

Najbezpieczniejsza ścieżka:

1. Zostawić `manifest.webmanifest` (PWA UI zostaje).
2. Podmienić `service-worker.js` na wersję cleanup/no-op, która:
   - czyści stare cache,
   - wyrejestrowuje service workera.
3. Zaktualizować dokumentację, że aplikacja działa online-only i nie utrzymuje offline cache.

Ta ścieżka lepiej „domyka” stare instalacje PWA niż samo usunięcie pliku.

#### Decyzja właścicielska do podjęcia (wymagana)

Do finalnego wdrożenia cleanupu potrzebna jest jedna jawna decyzja:

- **Opcja A (zalecana):** migracja cleanup/no-op service workera (bezpieczniejsza dla użytkowników, którzy już kiedyś instalowali PWA).
- **Opcja B:** twarde usunięcie `service-worker.js` bez migracji (prościej, ale większe ryzyko ręcznych problemów po stronie części użytkowników).

### 12.5 Potwierdzenie strategii usuwania zbędnych plików

#### Wniosek

W tej iteracji nie usuwamy plików — najpierw kończymy analizę. Dodatkowo właściciel potwierdził, że pliki/foldery:

- `DetaleLayout.md`,
- `DoZrobienia.md`,
- `Kolumny.md`,
- `Analizy/`

mają pozostać po cleanupie, nawet jeśli nie są krytyczne runtime’owo.

#### Konsekwencja dla planu cleanupu

- Oznaczyć je jako „zachować celowo”.
- Nie kwalifikować ich więcej jako kandydatów do usuwania.

### 12.6 Krytyczna zasada bezpieczeństwa dla `DataVault` (doprecyzowanie)

#### Kontekst problemu

Historycznie wystąpiła niedopuszczalna sytuacja: z jednego wejścia (`Repozytorium.xlsx`) powstawały różne warianty `data.json` zależnie od ścieżki generowania (agent/skrypt vs przycisk w UI admina).

Obecnie intencjonalnie istnieją dwa wyjścia:

1. plik archiwum danych,
2. plik do importu do Firebase.

To jest akceptowalne tylko wtedy, gdy ich relacja jest zgodna z założeniami systemu i nie powstaje przypadkowa rozbieżność semantyczna danych.

#### Wniosek

Podczas cleanupu **nie wolno** upraszczać parserów/generatorów/fallbacków w `DataVault`, jeśli nie ma twardego porównania wyników między ścieżkami generacji.

#### Konsekwencja dla planu cleanupu

Przed jakąkolwiek zmianą logiki `DataVault` obowiązkowo wykonać test zgodności (ten sam `Repozytorium.xlsx` → porównanie wyników wszystkich istotnych ścieżek), w szczególności:

- generator referencyjny (`build_json.py`),
- generator przeglądarkowy (UI admin),
- struktura przeznaczona do Firebase import.

Brak takiego testu = brak zgody na cleanup logiki danych.

## 13. Aktualizacja po decyzji właściciela i teście zgodności DataVault (2026-05-13)

Data aktualizacji: 2026-05-13  
Temat: decyzja dla `service-worker.js` oraz wykonanie testu zgodności dla `DataVault`.

Oryginalny pełny prompt użytkownika:

> Przeczytaj plik Analizy/Cleanup.md i go zaktualizuj. Nic nie kasuj tylko dopisz nowe informacje. Nie modyfikuj kodu aplikacji.
>
> 12.4 Decyzja dla service-worker.js przy modelu „online-only + PWA”
> - Z aplikacji PWA obecnie korzystają dwie osoby. Nie widzę przeszkód, żeby poprosić je o odinstalowanie aplikacji i ponowną instalację ze strony. W takim scenariuszu rozsądniejszym podejściem jest Opcja B: twarde usunięcie service-worker.js bez migracji
>
> 12.6 Krytyczna zasada bezpieczeństwa dla DataVault (doprecyzowanie)
> - Przeprowadź opisany test zgodności i zapisz jego wyniki w Analizy/Cleanup.md
> Plik wsadowy masz w Analizy/Repozytorium.xlsx. Pliki wynikowe też zapisz w Analizy/

### 13.1 Decyzja właścicielska dla `service-worker.js` — potwierdzenie

#### Decyzja

Przyjęta została **Opcja B**: twarde usunięcie `service-worker.js` bez migracji cleanup/no-op.

#### Uzasadnienie biznesowe

- Z PWA korzystają obecnie tylko 2 osoby.
- Obie osoby mogą wykonać kontrolowaną reinstalację aplikacji (odinstalowanie i ponowna instalacja ze strony).
- Upraszcza to wdrożenie i eliminuje utrzymywanie dodatkowej warstwy migracyjnej service workera.

#### Konsekwencje operacyjne

- Po wdrożeniu usunięcia `service-worker.js` należy przekazać tym 2 użytkownikom jasną instrukcję:
  1. odinstalować dotychczasową aplikację PWA,
  2. otworzyć stronę główną projektu,
  3. ponownie zainstalować PWA.
- `manifest.webmanifest` pozostaje, bo nadal jest potrzebny dla instalowalności i uruchamiania w trybie aplikacji.
- Model działania pozostaje online-only.

### 13.2 Wykonanie testu zgodności dla `DataVault` na pliku `Analizy/Repozytorium.xlsx`

#### Zakres faktycznie wykonanego testu w tej iteracji

W tej iteracji wykonano porównanie ścieżki referencyjnej i ścieżki importowej Firebase na bazie tego samego wsadu:

1. Wejście:
   - `Analizy/Repozytorium.xlsx`
2. Generator referencyjny:
   - `DataVault/build_json.py` → wynik `Analizy/data.reference.json`
3. Struktura importowa:
   - utworzono `Analizy/firebase-import.reference.json` z polem `dataJson`
   - wyodrębniono `dataJson` do `Analizy/data.from-firebase-import.json`
4. Porównanie semantyczne JSON (normalizacja: sortowanie kluczy i kompaktowa serializacja):
   - wynik: **zgodne (`equal = True`)**

#### Wynik

Na dostarczonym pliku wsadowym `Analizy/Repozytorium.xlsx` dane referencyjne i dane przeznaczone do importu Firebase (po ekstrakcji `dataJson`) są semantycznie identyczne.

#### Wygenerowane pliki wynikowe

- `Analizy/data.reference.json`
- `Analizy/firebase-import.reference.json`
- `Analizy/data.from-firebase-import.json`

#### Ważne doprecyzowanie metodologiczne

Pełny test 3-ścieżkowy opisany wcześniej (w tym ścieżka kliknięcia w UI admina w przeglądarce) wymaga uruchomienia scenariusza przeglądarkowego i eksportu plików z tego UI. W tej iteracji (bez modyfikacji kodu aplikacji) potwierdzono zgodność ścieżki referencyjnej z reprezentacją importową Firebase na tym samym wsadzie.

### 13.3 Rekomendacja końcowa po tej aktualizacji

- Dla cleanupu `service-worker.js`: realizować już wybraną Opcję B.
- Dla `DataVault`: utrzymać zasadę „najpierw test porównawczy, potem cleanup logiki” jako blokadę bezpieczeństwa przed każdą zmianą parserów/generatorów/fallbacków.

## Aktualizacja analizy — 2026-05-13

### Temat
Weryfikacja zgodności plików referencyjnych `Analizy/data.reference.json` i `Analizy/firebase-import.reference.json` względem wzorca `Analizy/data.json`.

### Oryginalny pełny prompt użytkownika
Przeczytaj plik Analizy/Cleanup.md i go zaktualizuj. Nic nie kasuj tylko dopisz nowe informacje. Nie modyfikuj kodu aplikacji.

Dodałem plik Analizy/data.json - jest to kopia z poprzedniej wersji aplikacji. Sprawdź czy nowe pliki Analizy/data.reference.json i Analizy/firebase-import.reference.json są zgodne ze wzorcowym Analizy/data.json

### Zakres analizy
- Odczytano `Analizy/Cleanup.md` i dopisano wyniki bez usuwania istniejących treści.
- Porównano struktury JSON po deserializacji (porównanie semantyczne, nie tekstowe) dla:
  - `Analizy/data.json` vs `Analizy/data.reference.json`,
  - `Analizy/data.json` vs `Analizy/firebase-import.reference.json:dataJson`,
  - `Analizy/data.reference.json` vs `Analizy/firebase-import.reference.json:dataJson`.

### Wyniki porównania
1. `Analizy/data.reference.json` **nie jest zgodny** z `Analizy/data.json`.
2. `Analizy/firebase-import.reference.json` (pole `dataJson`) **nie jest zgodny** z `Analizy/data.json`.
3. `Analizy/firebase-import.reference.json` (pole `dataJson`) **jest zgodny** z `Analizy/data.reference.json`.

Wniosek praktyczny: oba nowe pliki referencyjne (`data.reference.json` i `firebase-import.reference.json`) są ze sobą spójne, ale reprezentują inny stan danych niż wzorcowy `Analizy/data.json`.

### Rekomendacje
- Jeżeli `Analizy/data.json` ma być obowiązującym wzorcem, należy zregenerować lub podmienić:
  - `Analizy/data.reference.json`,
  - `Analizy/firebase-import.reference.json` (sekcja `dataJson`),
  tak, aby odpowiadały dokładnie temu samemu zestawowi danych.
- Jeżeli to `data.reference.json` ma być nowym wzorcem, warto to jawnie opisać w dedykowanej analizie, aby uniknąć dalszych niejednoznaczności.

### Ryzyka
- Dalsza praca na niespójnych „wzorcach” grozi fałszywymi wynikami testów regresyjnych dla DataVault.
- Import do Firebase oparty o `firebase-import.reference.json` może być zgodny z referencją, ale niezgodny z historycznym snapshotem uznawanym za kanoniczny.

### Następne kroki
- Wykonać szczegółowy diff semantyczny między `Analizy/data.json` i `Analizy/data.reference.json` (np. wskazanie różnic per arkusz, rekord, pole), aby zdecydować, który zestaw danych jest prawidłowy biznesowo.
## Aktualizacja analizy — doprecyzowanie różnic między plikami JSON referencyjnymi

### Temat

Doprecyzowanie wcześniejszego wyniku porównania plików:

- `Analizy/data.json`
- `Analizy/data.from-firebase-import.json`
- `Analizy/firebase-import.reference.json`

W poprzedniej analizie stwierdzono, że pliki referencyjne nie są zgodne z `Analizy/data.json`. Po dodatkowym sprawdzeniu ustalono, że różnica ma najprawdopodobniej charakter pojedynczej korekty treści, a nie rozjazdu struktury danych.

### Zakres sprawdzenia

Sprawdzono relację między plikami:

1. `Analizy/firebase-import.reference.json`
   - pełny plik importu do Firebase;
   - zawiera dane wewnątrz pola `dataJson`.

2. `Analizy/data.from-firebase-import.json`
   - dane wyciągnięte z pola `dataJson` pliku `firebase-import.reference.json`;
   - ma strukturę bez wrappera Firebase, czyli zaczyna się od `sheets`.

3. `Analizy/data.json`
   - historyczny / wzorcowy plik danych z poprzedniej wersji aplikacji;
   - również zaczyna się od `sheets`.

### Różnice strukturalne

Różnica między `firebase-import.reference.json` a pozostałymi plikami jest oczekiwana i techniczna.

`firebase-import.reference.json` ma dodatkową warstwę:

```json
{
  "dataJson": {
    "sheets": {}
  }
}
```

Natomiast `data.json` oraz `data.from-firebase-import.json` mają bezpośrednio:

```json
{
  "sheets": {}
}
```

To nie jest błąd danych, tylko różnica formatu wynikająca z przygotowania pliku do importu do Firebase.

### Różnica merytoryczna

Wykryta różnica merytoryczna dotyczy arkusza:

- `Notatki`

rekordu:

- `LP: "23"`

pola:

- `Co`

W `Analizy/data.json` wartość brzmi:

```json
"Co": "Poziom mocy psionicznej"
```

W `Analizy/data.from-firebase-import.json` oraz w danych pochodzących z `firebase-import.reference.json` wartość brzmi:

```json
"Co": "Poziom mocy psionicznej i Brak Krytyków oraz Chwały"
```

### Interpretacja

Ta różnica jest akceptowalna.

Najbardziej prawdopodobne wyjaśnienie: plik backupowy / historyczny `Analizy/data.json` został zapisany przed późniejszą korektą jednego wpisu w danych źródłowych lub referencyjnych.

Nie wygląda to na problem z parserem, generatorem, kolejnością arkuszy, utratą rekordów, błędem wrappera Firebase ani rozjazdem całej struktury danych.

### Wniosek praktyczny

Wcześniejsze stwierdzenie:

> `data.reference.json` / `firebase-import.reference.json:dataJson` nie są zgodne z `data.json`

pozostaje technicznie prawdziwe, ale wymaga doprecyzowania.

Niezgodność nie oznacza istotnego błędu generowania danych. Na podstawie sprawdzenia wygląda na to, że różnica sprowadza się do jednej zaakceptowanej zmiany tekstowej:

```text
Poziom mocy psionicznej
```

vs

```text
Poziom mocy psionicznej i Brak Krytyków oraz Chwały
```

### Decyzja

Różnicę uznajemy za akceptowalną.

Nie ma potrzeby traktować tego jako blokera dla dalszego cleanupu `DataVault`, o ile kolejne testy nie wykażą dodatkowych różnic.

### Rekomendacja na przyszłość

Dla uniknięcia podobnych wątpliwości warto w przyszłości przy testach porównawczych zapisywać szczegółowy diff semantyczny, czyli listę konkretnych różnic w formacie:

```text
arkusz / rekord / pole / wartość w pliku A / wartość w pliku B
```

Samo stwierdzenie `JSON-y nie są zgodne` jest zbyt ogólne, ponieważ nie odróżnia poważnego błędu struktury od pojedynczej zaakceptowanej korekty tekstu.

## 13. Dodatkowe wnioski przed rozpoczęciem etapu wykonawczego Cleanup (2026-05-13)

Data analizy: 2026-05-13  
Temat: Gotowość do rozpoczęcia procesu Cleanup.

Oryginalny pełny prompt użytkownika:
"Przeczytaj plik Analizy/Cleanup.md i go zaktualizuj. Nic nie kasuj tylko dopisz nowe informacje. Nie modyfikuj kodu aplikacji.

Czy mamy jeszcze jakieś wątpliwości do wyjaśnienia, czy możemy już rozpocząć proces Cleanup?"

Zakres tej iteracji:
- ponowny odczyt pliku `Analizy/Cleanup.md`;
- dopisanie decyzji operacyjnych „co już jest jasne” i „co jeszcze wymaga jednego potwierdzenia”, bez modyfikowania kodu aplikacji.

### 13.1 Krótka odpowiedź operacyjna

Możemy rozpocząć proces Cleanup, ale rekomenduję **1 krótkie potwierdzenie właścicielskie przed pierwszym kasowaniem plików**. To nie blokuje planowania i przygotowania checklisty, ale powinno poprzedzić etap usuwania.

### 13.2 Co jest już wystarczająco jasne (brak wątpliwości krytycznych)

1. Folder `WebView_FCM_Cloudflare_Worker` ma status archiwalny i zostaje bez zmian (wraz z ewentualnymi duplikatami ikon).
2. Folder `Analizy` ma zostać.
3. Pliki `DetaleLayout.md`, `DoZrobienia.md`, `Kolumny.md` mają zostać.
4. `Kalkulator/Old/` to archiwum historyczne i ma zostać.
5. W `DataVault` nie wolno wykonywać cleanupu, który mógłby rozjechać wynik generowania danych z `Repozytorium.xlsx` między ścieżką przeglądarkową i referencyjną.

### 13.3 Jedyna wątpliwość, którą warto doprecyzować przed kasowaniem

Chodzi o `service-worker.js` w katalogu głównym.

Powód: aplikacja ma działać online-only, ale użytkownicy, którzy kiedyś zainstalowali starszą wersję PWA, mogli mieć zarejestrowany service worker. Dlatego samo „skasuj plik” nie zawsze czyści stan po stronie przeglądarek, które już go mają.

Najbezpieczniejsza decyzja biznesowo-techniczna (rekomendowana):
- nie usuwać od razu „na twardo” bez ścieżki wygaszenia;
- najpierw wdrożyć wariant cleanup/no-op service workera (wersja, która czyści cache i przestaje przechwytywać ruch),
- po okresie przejściowym dopiero rozważyć pełne usunięcie.

Konsekwencje:
- mniejsze ryzyko problemów u użytkowników ze starą instalacją PWA,
- bardziej przewidywalne przejście do trybu online-only,
- potrzeba krótkiej aktualizacji dokumentacji `Main` po wdrożeniu.

### 13.4 Rekomendacja „go/no-go”

Status: **GO warunkowe**.

To znaczy:
- można rozpocząć Cleanup od elementów niewrażliwych i wcześniej oznaczonych jako archiwalne/pozostałości,
- przed pierwszym usuwaniem plików ustalić finalną decyzję dla strategii `service-worker.js`,
- obszar `DataVault` traktować jako chroniony i wykonywać wyłącznie zmiany poprzedzone testem porównawczym wyników generowania danych.

### 13.5 Następny krok praktyczny

Przygotować „Checklistę wykonawczą Cleanup v1” (kolejność usuwania + punkty kontrolne + kryteria rollback), a dopiero potem przejść do kasowania potwierdzonych elementów.

## 14. Zakres zmian do wykonania po analizie cleanupu

Poniższy zakres zmian wynika z aktualnego pliku `Analizy/Cleanup.md` oraz ponownego sprawdzenia kodu aplikacji.

Celem zmian jest uporządkowanie repozytorium bez naruszania krytycznej ścieżki danych `DataVault`, szczególnie generowania `data.json` i `firebase-import.json` z `Repozytorium.xlsx`.

---

## 14.1 PWA online-only i `service-worker.js`

### Decyzja

Aplikacja ma działać tylko online, zarówno jako strona:

- `https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html`
- `https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html?admin=1`

jak i jako aplikacja PWA.

W związku z tym rootowy plik:

- `service-worker.js`

należy potraktować jako pozostałość po wcześniejszej koncepcji cache/offline i usunąć z aktywnego repozytorium.

### Zakres zmian

1. Skasować plik:

   - `service-worker.js`

2. Nie kasować pliku:

   - `manifest.webmanifest`

3. W `Main/index.html` zostawić podpięcie manifestu:

   - `../manifest.webmanifest`

4. Dodać w `Main/index.html` bezpieczny cleanup starych instalacji PWA, który spróbuje wyrejestrować wcześniej zainstalowanego service workera, jeżeli użytkownik ma go jeszcze w przeglądarce.

5. Zaktualizować dokumentację `Main/docs/Documentation.md`:
   - usunąć opis `service-worker.js` jako aktywnego elementu aplikacji,
   - jasno napisać, że aplikacja jest PWA online-only,
   - napisać, że manifest zostaje, ale offline/cache nie jest wspierany,
   - dodać uwagę, że stare instalacje PWA mogą wymagać odświeżenia albo wyczyszczenia danych strony, jeżeli wcześniej działały pod service workerem.

### Uwaga

Nie wybieramy wariantu `cleanup/no-op`. Zgodnie z decyzją z analizy plik `service-worker.js` jest do skasowania.

---

## 14.2 Stary backend Web Push w `Infoczytnik/backend`

### Decyzja

Wcześniejsze prace nad powiadomieniami Push nie będą wdrażane. Dokumentacja i archiwum związane z tym tematem zostają w `WebView_FCM_Cloudflare_Worker/`, ale aktywny backend w `Infoczytnik/backend` należy potraktować jako pozostałość.

### Zakres zmian

1. Skasować:

   - `Infoczytnik/backend/node_modules/`
   - `Infoczytnik/backend/package.json`

2. Jeżeli po usunięciu tych elementów folder `Infoczytnik/backend/` będzie pusty, skasować również sam folder:

   - `Infoczytnik/backend/`

3. Nie kasować i nie sprzątać automatycznie folderu:

   - `WebView_FCM_Cloudflare_Worker/`

4. Nie usuwać duplikatów ikon z `WebView_FCM_Cloudflare_Worker/`, ponieważ folder został świadomie oznaczony jako archiwalny i ma zostać bez zmian.

### Uwaga dotycząca punktu 13.3

Jeżeli punkt 13.3 dotyczy pliku związanego z `Infoczytnik/backend`, to zgodnie z rozstrzygnięciem z 13.1 plik nie jest do zachowania ani dokumentowania jako aktywny element. Jest do skasowania razem z pozostałościami backendu Web Push.

---

## 14.3 `DataVault/index.html` — brakujący `JSZip`

### Problem

`DataVault/xlsxCanonicalParser.js` wymaga globalnego `JSZip`, ale `DataVault/index.html` nie ładuje `jszip.min.js` przed `xlsxCanonicalParser.js`.

To grozi tym, że aplikacja przejdzie na fallback albo wygeneruje dane inną ścieżką niż parser referencyjny.

### Zakres zmian

1. W `DataVault/index.html` dodać ładowanie `JSZip` przed `xlsxCanonicalParser.js`.

2. Docelowa kolejność powinna być logicznie taka:

   - najpierw `jszip.min.js`,
   - potem `xlsxCanonicalParser.js`,
   - potem konfiguracja Firebase,
   - potem loader Firebase,
   - potem `app.js`,
   - `xlsx.full.min.js` zostaje jako legacy/fallback do czasu testów regresyjnych.

3. Nie usuwać jeszcze:

   - `xlsx.full.min.js`,
   - fallbacków XLSX w `app.js`.

---

## 14.4 Test regresyjny generowania danych z XLSX

### Cel

Nie wolno ponownie dopuścić do sytuacji, w której:

- `build_json.py` generuje jeden wariant `data.json`,
- aplikacja w przeglądarce generuje drugi wariant,
- do Firebase trafia jeszcze inny wariant danych.

### Zakres zmian

Przygotować albo opisać test porównawczy dla trzech źródeł:

1. `data.json` wygenerowany przez:

   - `DataVault/build_json.py`

2. `data.json` wygenerowany w przeglądarce przez:

   - `DataVault/index.html?admin=1`
   - przycisk `Generuj pliki danych`

3. dane `dataJson` zapisane w:

   - `firebase-import.json`

Porównanie powinno normalizować formatowanie JSON, ale nie może ignorować realnych różnic merytorycznych w strukturze danych.

### Ważne

Dopiero po takim teście można rozważać usuwanie fallbacków XLSX albo dalsze upraszczanie generatora.

---

## 14.5 `DataVault/build_json.py`

### Decyzja

Nie usuwać całego pliku:

- `DataVault/build_json.py`

Plik zostaje jako generator referencyjny.

### Zakres zmian

1. Zostawić funkcje odpowiedzialne za:
   - minimalny odczyt XLSX przez ZIP/XML,
   - rich text,
   - czerwone markery `{{RED}}...{{/RED}}`,
   - scalanie `Zasięg 1..3` do `Zasięg`,
   - scalanie `Cecha 1..N` do `Cechy`,
   - budowę `_meta.traits`,
   - budowę `_meta.states`,
   - budowę `_meta.sheetOrder`,
   - budowę `_meta.columnOrder`.

2. Usunąć tylko funkcję:

   - `sheet_to_records(ws)`

   pod warunkiem, że nie jest nigdzie wywoływana.

3. Po usunięciu funkcji wykonać test generowania `data.json`.

---

## 14.6 `shared/firebase-data-loader.js`

### Problem

Zmienna `authUnsubscribe` jest ustawiana wynikiem `onAuthStateChanged(...)`, ale nie jest potem realnie używana do cleanupu listenera.

### Zakres zmian

1. Uprościć kod:
   - usunąć zmienną `authUnsubscribe`,
   - wywołać `onAuthStateChanged(...)` bez przypisywania wyniku.

2. Zostawić sam listener `onAuthStateChanged(...)`, ponieważ jest potrzebny do ustalenia stanu logowania.

3. `logoutDataAccess()` można zostawić, ponieważ jest małą i logiczną funkcją pomocniczą. Nie trzeba jej teraz usuwać tylko dlatego, że nie ma aktywnego przycisku wylogowania.

---

## 14.7 `DataVault/index.html` i `DataVault/app.js` — fałszywy hint o multi-sortowaniu

### Problem

Interfejs pokazuje informację:

- `Shift = sort wielokolumnowy`

ale w kodzie aplikacji nie ma realnej obsługi multi-sortowania przez `event.shiftKey`.

### Decyzja

Nie dodawać teraz multi-sortowania. To byłaby zmiana funkcjonalna większa niż cleanup.

### Zakres zmian

1. Usunąć wzmiankę o `Shift = sort wielokolumnowy` z widocznej podpowiedzi w `DataVault/index.html`.

2. Usunąć analogiczną wzmiankę z tłumaczeń w `DataVault/app.js`:
   - `hintSort` w języku polskim,
   - `hintSort` w języku angielskim.

3. Zostawić zwykłe sortowanie po kliknięciu nagłówka.

---

## 14.8 `DataVault/xlsxCanonicalParser.js` — nieużywane stałe

### Problem

W pliku są stałe, które wyglądają na nieużywane:

- `MAIN_NS`
- `REL_NS`

Stała `DOC_REL_NS` jest używana i powinna zostać.

### Zakres zmian

1. Usunąć:

   - `MAIN_NS`
   - `REL_NS`

2. Zostawić:

   - `DOC_REL_NS`

3. Po zmianie sprawdzić generowanie danych z XLSX.

---

## 14.9 `DataVault/app.js` — niejawny global `m`

### Problem

W funkcji `formatInlineHTML()` używana jest zmienna `m` bez lokalnej deklaracji.

To tworzy niejawny global i może spowodować błąd przy przyszłej refaktoryzacji.

### Zakres zmian

1. Dodać lokalną deklarację:

   - `let m;`

2. Deklaracja powinna znajdować się bezpośrednio przed pętlą używającą `reRefParen.exec(...)`.

3. Nie zmieniać logiki samego formatowania referencji do stron.

---

## 14.10 Dokumentacja `Main` i `DataVault`

### Zakres zmian w `Main/docs/Documentation.md`

Zaktualizować dokumentację tak, żeby mówiła, że:

- aplikacja jest PWA online-only,
- `manifest.webmanifest` zostaje,
- `service-worker.js` został usunięty,
- offline/cache nie jest wspierany,
- stare instalacje PWA mogą wymagać odświeżenia albo wyczyszczenia danych strony.

Usunąć lub zmienić fragmenty sugerujące, że `service-worker.js` jest aktywnym globalnym Service Workerem.

### Zakres zmian w `DataVault/docs/Documentation.md`

Dopisać albo poprawić informacje, że:

- `JSZip` jest wymaganą zależnością parsera kanonicznego,
- `xlsxCanonicalParser.js` jest browserowym odpowiednikiem generatora referencyjnego,
- `build_json.py` zostaje jako generator referencyjny,
- `xlsx.full.min.js` jest legacy/fallbackiem i nie jest teraz usuwany,
- informacja o `Shift = multi-column sort` była nieaktualna, jeżeli zostanie usunięta z UI.

---

## 14.11 Pliki i foldery, których nie ruszać w tej turze

Nie usuwać:

- `DataVault/build_json.py`
- `DataVault/xlsxCanonicalParser.js`
- `DataVault/data.json`
- `DataVault/Repozytorium.xlsx`
- `manifest.webmanifest`
- `WebView_FCM_Cloudflare_Worker/`
- `Kalkulator/Old/`
- `Analizy/`
- `DetaleLayout.md`
- `DoZrobienia.md`
- `Kolumny.md`
- produkcyjnych, testowych i backupowych plików w `Infoczytnik`, poza wskazanym backendem Web Push

---

## 14.12 Kolejność wykonania zmian

Rekomendowana kolejność:

1. Skasować pozostałości backendu Web Push:
   - `Infoczytnik/backend/node_modules/`
   - `Infoczytnik/backend/package.json`
   - ewentualnie pusty folder `Infoczytnik/backend/`

2. Skasować rootowy:
   - `service-worker.js`

3. Dodać cleanup starych service workerów w `Main/index.html`.

4. Zaktualizować `Main/docs/Documentation.md`.

5. Dodać `JSZip` w `DataVault/index.html`.

6. Poprawić hint o sortowaniu w `DataVault/index.html` i `DataVault/app.js`.

7. Poprawić `DataVault/app.js`, dodając lokalne `let m;`.

8. Usunąć nieużywane stałe `MAIN_NS` i `REL_NS` z `DataVault/xlsxCanonicalParser.js`.

9. Usunąć niewykorzystywaną funkcję `sheet_to_records(ws)` z `DataVault/build_json.py`, jeżeli po wyszukaniu nadal nie ma żadnych wywołań.

10. Uprościć `authUnsubscribe` w `shared/firebase-data-loader.js`.

11. Zaktualizować `DataVault/docs/Documentation.md`.

12. Wykonać test regresyjny generowania danych z XLSX.

---

## 13. Kontrola po zmianach

Po wykonaniu zmian sprawdzić:

1. Czy `Main/index.html` działa:
   - bez `?admin=1`,
   - z `?admin=1`,
   - jako zainstalowana PWA.

2. Czy `DataVault/index.html` działa:
   - bez `?admin=1`,
   - z `?admin=1`.

3. Czy przycisk `Generuj pliki danych` nadal tworzy:
   - `data.json`,
   - `firebase-import.json`.

4. Czy wynik `data.json` z przeglądarki jest zgodny z wynikiem `build_json.py`.

5. Czy `firebase-import.json.dataJson` po sparsowaniu jest zgodny z wygenerowanym `data.json`.

6. Czy prywatne dane nadal ładują się z Firebase.

7. Czy nie ma błędów w konsoli przeglądarki dotyczących:
   - `JSZip`,
   - `XlsxCanonicalParser`,
   - Firebase Auth,
   - Firebase Database,
   - service workera.

---

## 14. Wniosek końcowy

Po ponownym sprawdzeniu kodu nie widać dodatkowego aktywnego obszaru cleanupu, który zostałby pominięty i który można bezpiecznie skasować bez decyzji właścicielskiej albo testu regresyjnego.

Najważniejsze korekty do wykonania to:

- usunięcie starego `service-worker.js`,
- usunięcie pozostałości backendu Web Push w `Infoczytnik/backend`,
- dodanie brakującego `JSZip`,
- zabezpieczenie regresji generowania danych,
- drobne porządki w `DataVault` i dokumentacji.

Obszar `DataVault` pozostaje krytyczny i nie powinien być dalej upraszczany bez porównania wyników generowania danych.


## Zmiany wykonane w kodzie

### Plik: `DataVault/index.html`
Lokalizacja: sekcja `language-switcher`, sekcja `.hint`, blok `<script>` na końcu dokumentu.

Było:
- brak jawnego komentarza przy ukrytym przełączniku języka,
- hint sortowania zawierał obietnicę `Shift = sort wielokolumnowy`,
- brak `JSZip` przed `xlsxCanonicalParser.js`.

Jest:
- dodano komentarz wskazujący miejsce ujawnienia przełącznika języka,
- hint zawiera tylko informację o standardowym sortowaniu po nagłówku,
- dodano `jszip.min.js` przed `xlsxCanonicalParser.js`.

### Plik: `DataVault/app.js`
Lokalizacja: tłumaczenia `hintSort` (PL/EN), funkcja `formatInlineHTML()`.

Było:
- tłumaczenia obiecywały multi-sort z klawiszem Shift,
- zmienna `m` była używana bez lokalnej deklaracji.

Jest:
- tłumaczenia opisują wyłącznie istniejące sortowanie,
- dodano lokalną deklarację `let m;` przed pętlą regex.

### Plik: `DataVault/xlsxCanonicalParser.js`
Lokalizacja: stałe na początku pliku.

Było:
- obecne były nieużywane stałe `MAIN_NS` i `REL_NS`.

Jest:
- usunięto `MAIN_NS` i `REL_NS`, pozostawiono używane `DOC_REL_NS`.

### Plik: `DataVault/build_json.py`
Lokalizacja: funkcja `sheet_to_records(ws)`.

Było:
- funkcja `sheet_to_records(ws)` była obecna, ale nieużywana w aktualnej ścieżce parsera ZIP/XML.

Jest:
- usunięto funkcję `sheet_to_records(ws)`.

### Plik: `shared/firebase-data-loader.js`
Lokalizacja: sekcja inicjalizacji auth.

Było:
- zmienna `authUnsubscribe` przechowywała wynik `onAuthStateChanged(...)`, ale nie była wykorzystywana.

Jest:
- usunięto `authUnsubscribe`, `onAuthStateChanged(...)` jest wywoływane bez przypisania.

### Plik: `Main/index.html`
Lokalizacja: końcowy blok `<script>` przed `</body>`.

Było:
- brak cleanupu starych rejestracji Service Workera.

Jest:
- dodano cleanup rejestracji (`getRegistrations()` + `unregister()`), zgodnie z trybem online-only.

### Plik: `service-worker.js`
Lokalizacja: katalog główny repo.

Było:
- plik obecny mimo decyzji online-only.

Jest:
- plik usunięty z aktywnego repozytorium.

### Plik: `Infoczytnik/backend/package.json` oraz `Infoczytnik/backend/node_modules/`
Lokalizacja: moduł `Infoczytnik/backend`.

Było:
- pozostałości backendu Web Push były obecne.

Jest:
- `package.json` i `node_modules/` zostały usunięte; pusty katalog `backend/` także usunięty.

### Pliki: `GeneratorNazw/index.html`, `GeneratorNPC/index.html`, `Audio/index.html`
Lokalizacja: każdy blok `<div class="language-switcher language-switcher--hidden">`.

Było:
- brak jednolitego komentarza wskazującego miejsce ujawnienia przełącznika języka.

Jest:
- dodano komentarz PL/EN wskazujący, że należy usunąć klasę `language-switcher--hidden`, aby przełącznik był widoczny.

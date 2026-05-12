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

## 9. `DataVault/app.js` — niejawny global `m`

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

## 10. Dokumentacja `Main` i `DataVault` wymaga aktualizacji

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

Prompt użytkownika (oryginalny, skrócony): prośba o dopisanie kolejnych wniosków do `Analizy/Cleanup.md` bez kasowania treści, z doprecyzowaniem statusu archiwum `WebView_FCM_Cloudflare_Worker`, statusu `Infoczytnik/backend/node_modules`, decyzji dla `service-worker.js` i dodatkowym ostrzeżeniem o mechanice `DataVault` (dwa różne wyjścia danych z jednego `Repozytorium.xlsx`).

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

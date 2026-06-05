# Analiza rozbudowy modułu Audio o opcję „Loop”

## Data analizy

2026-06-05

## Temat analizy

Rozbudowa modułu `Audio` o przycisk „Loop”, który uruchamia zapętlone odtwarzanie wybranego dźwięku, wybiera losowe warianty przy dźwiękach zgrupowanych oraz pozwala wyłączyć pętlę ponownym kliknięciem.

## Oryginalny pełny prompt użytkownika

```text
Przeprowadź analizę rozbudowy modułu Audio.
Chciałbym dodać opcję "Loop" do odtwarzania.
Jego naciśnięcie spowodowałoby odtwarzanie danego dźwięku w pętli. Jeżeli jest kilka dźwięków podpiętych to mają się odtwarzać w losowej kolejności.

Efektem praktycznym naciśnięcia przycisku Loop ma być tak, jakby użytkownik nacisnął ponownie odtwarzanie dźwięku tuż po jego zakończeniu.
Ponowne naciśnięcie przycisku Loop ma wyłączyć odtwarzanie dźwięków.
W czasie bycia aktywnym przycisk Loop ma być czerwony.
```

Do promptu dołączono obraz przedstawiający przykładowy kafel z zieloną ramką, nazwą „Unholy Wind Loop”, tagiem „Sanctum” i suwakiem głośności; aktywny napis „Loop” ma być czerwonym przyciskiem/stanie aktywnym.

## Zakres analizy

Analiza obejmuje:

- aktualną strukturę modułu `Audio`;
- obecny przepływ odtwarzania dźwięku;
- sposób grupowania wielu plików pod jednym wpisem;
- miejsca w kodzie wymagające zmian dla przycisku „Loop”;
- wpływ na CSS, JavaScript, dokumentację użytkową, dokumentację techniczną i layout;
- ryzyka wdrożenia oraz rekomendowaną kolejność prac.

Analiza nie wprowadza zmian w kodzie modułu. Jej celem jest przygotowanie planu implementacji.

## Aktualny stan modułu Audio

### Pliki modułu

Moduł `Audio` jest aplikacją typu single page umieszczoną głównie w pliku `Audio/index.html`. Ten plik zawiera HTML, lokalny CSS oraz JavaScript modułowy. Dane źródłowe dźwięków pochodzą z `Audio/AudioManifest.xlsx`, a ustawienia list, widoku głównego i aliasów mogą być synchronizowane przez Firebase albo zapisywane lokalnie.

Istotne pliki:

- `Audio/index.html` — główny plik interfejsu, stylów i logiki;
- `Audio/AudioManifest.xlsx` — manifest dźwięków;
- `Audio/config/firebase-config.js` — konfiguracja Firebase;
- `Audio/docs/README.md` — instrukcja użytkownika wymagająca aktualizacji przy implementacji;
- `Audio/docs/Documentation.md` — dokumentacja techniczna wymagająca aktualizacji przy implementacji;
- `DetaleLayout.md` — dokument layoutu wymagający aktualizacji, ponieważ aktywny czerwony stan przycisku Loop jest zmianą wyglądu.

### Obecny model danych po wczytaniu manifestu

Manifest jest parsowany w funkcji `parseManifest()`. Każdy wiersz manifestu dostarcza między innymi nazwę sampla, nazwę pliku oraz link do folderu. Kod tworzy wpisy pośrednie, a następnie grupuje warianty, jeżeli nazwy pasują do zasad grupowania.

Kluczowe pola elementu audio po zbudowaniu `groupMap`:

- `id` — identyfikator używany w UI i listach;
- `label` — nazwa prezentowana użytkownikowi;
- `groupCount` — liczba zgrupowanych wariantów, gdy dotyczy;
- `alias` — alias zapisany w ustawieniach;
- `filename` — nazwa pliku lub nazwa pierwszego pliku z dopiskiem `(+n)`;
- `folderUrl` — źródłowy folder;
- `tags`, `tag2`, `tagPaths` — tagi i ścieżki tagów;
- `variants` — lista wariantów z polami `filename` i `fullUrl`.

To oznacza, że wymóg „jeżeli jest kilka dźwięków podpiętych” jest już częściowo obsługiwany przez istniejącą strukturę `variants`. Obecnie pojedyncze naciśnięcie odtwarzania wybiera jeden wariant losowo.

### Obecny przepływ odtwarzania

Obecna logika odtwarzania składa się z kilku funkcji:

1. `pickRandomVariant(item)` wybiera losowy adres `fullUrl` z tablicy `item.variants`.
2. `togglePlayback(itemId, playbackRoot)` sprawdza, czy dany element już gra.
3. Jeżeli element gra, wywoływany jest `stopPlayback(playbackRoot)`.
4. Jeżeli element nie gra, wywoływany jest `startPlayback(item, playbackRoot)`.
5. `startPlayback()` tworzy `new Audio(fullUrl)`, podpina Web Audio API dla głośności, zapisuje odtwarzacz w `activePlayers`, ustawia stan UI i uruchamia `audio.play()`.
6. Po zdarzeniu `ended` wywoływane jest `stopPlayback(playbackRoot)`, czyli obecnie zakończenie dźwięku zawsze wyłącza stan aktywny.

Mapa `activePlayers` używa jako klucza elementu DOM `playbackRoot`, a nie samego `itemId`. To pozwala jednocześnie odtwarzać ten sam dźwięk z różnych miejsc interfejsu, jeżeli użytkownik ma go w więcej niż jednym widoku.

### Obecne miejsca uruchamiania odtwarzania w UI

Odtwarzanie jest aktualnie wywoływane z kilku miejsc:

- w panelu admina z listy SFX przez przycisk `data-action="play"`;
- w panelu admina z list ulubionych przez przycisk `data-action="fav-play"`;
- w adminowym „Głównym widoku” przez kliknięcie nazwy lub tagu elementu z `data-playback-root="true"`;
- w użytkowym widoku głównym przez kliknięcie nazwy lub tagu karty;
- w użytkowym widoku ulubionych przez kliknięcie nazwy lub tagu karty.

Suwak głośności jest obecny w widoku użytkownika i w adminowym „Głównym widoku”. Główna lista admina oraz adminowe listy ulubionych używają klasycznych przycisków Play/Stop bez suwaka albo z ograniczonym UI.

## Wnioski funkcjonalne dla opcji Loop

### Definicja zachowania

Przycisk „Loop” powinien działać jako przełącznik dla konkretnego widocznego elementu odtwarzania:

- pierwsze kliknięcie `Loop`:
  - aktywuje tryb pętli;
  - natychmiast uruchamia odtwarzanie dźwięku, jeżeli nie gra;
  - jeżeli dźwięk już gra, pozostawia go grającym i ustawia kontynuację po zakończeniu;
  - kolor przycisku zmienia się na czerwony;
- zakończenie aktualnego pliku w aktywnej pętli:
  - nie wywołuje końcowego `stopPlayback()`;
  - wybiera następny wariant przez tę samą logikę co manualne naciśnięcie Play;
  - uruchamia kolejny plik automatycznie;
- kolejne kliknięcie `Loop`:
  - wyłącza tryb pętli;
  - zatrzymuje aktualnie grający dźwięk;
  - przywraca przycisk do zwykłego zielonego stanu.

Najbliższa semantyka względem promptu: aktywny Loop powinien symulować „ponowne naciśnięcie odtwarzania tuż po zakończeniu”, a nie używać natywnego `audio.loop = true`, ponieważ natywna pętla odtwarzałaby cały czas ten sam plik i nie losowałaby kolejnych wariantów.

### Losowa kolejność przy wielu wariantach

Istniejąca funkcja `pickRandomVariant(item)` już losuje wariant z `item.variants`. Do pętli można ją wykorzystać bez zmiany danych.

Decyzja projektowa do rozważenia:

1. **Proste losowanie z powtórzeniami** — każdy kolejny cykl losuje wariant niezależnie. Ten sam wariant może pojawić się dwa razy pod rząd.
2. **Losowanie bez natychmiastowej powtórki** — jeżeli wariantów jest więcej niż jeden, kolejny wariant nie powinien być taki sam jak poprzedni.
3. **Tasowana kolejka wariantów** — aplikacja tworzy losową kolejność wszystkich wariantów, odtwarza ją do końca, potem tasuje ponownie.

Prompt mówi o „losowej kolejności”, nie zakazuje powtórek. Najprostsza implementacja zgodna z obecnym kodem to wariant 1. Najlepsze doświadczenie użytkownika da jednak wariant 2, bo ogranicza wrażenie, że pętla „utknęła” na jednym pliku. Wariant 3 jest najbardziej przewidywalny, ale wymaga dodatkowego stanu kolejki.

Rekomendacja: wdrożyć wariant 2 jako kompromis — przy `item.variants.length > 1` losować ponownie, jeżeli wylosowany `fullUrl` jest taki sam jak poprzedni, z bezpiecznym limitem prób.

## Rekomendowana architektura implementacji

### 1. Rozszerzenie stanu odtwarzacza

Obecnie `activePlayers` przechowuje obiekt w stylu:

```js
{ audio, gainNode }
```

Dla Loop warto rozszerzyć wpis do postaci:

```js
{
  item,
  audio,
  gainNode,
  loop: true,
  lastUrl: fullUrl,
  manuallyStopped: false
}
```

Pole `item` pozwoli po zakończeniu pliku uruchomić kolejny wariant bez ponownego szukania po `itemId`. Pole `lastUrl` ułatwi unikanie natychmiastowej powtórki. Pole `loop` rozdzieli zwykłe Play od Loop.

Alternatywnie można trzymać osobną mapę `loopPlayers`, ale prostsze i mniej podatne na rozjazd stanu będzie użycie jednej mapy `activePlayers` z flagą `loop`.

### 2. Rozdzielenie startu jednorazowego i startu loop

Proponowane funkcje:

- `startPlayback(item, playbackRoot, options = {})`:
  - przyjmuje `options.loop`;
  - wybiera wariant;
  - tworzy audio;
  - zapisuje pełniejszy obiekt odtwarzacza;
  - aktualizuje stan Play/Stop i stan Loop;
- `startNextLoopIteration(playbackRoot)`:
  - pobiera wpis z `activePlayers`;
  - jeżeli `entry.loop` nadal jest aktywne, tworzy nowy element `Audio` dla kolejnego wariantu;
  - zachowuje aktualną wartość suwaka głośności;
  - ponownie podpina zdarzenia;
- `toggleLoop(itemId, playbackRoot)`:
  - jeżeli aktywny wpis ma `loop: true`, wywołuje zatrzymanie i wyłącza stan Loop;
  - jeżeli dźwięk gra jednorazowo, przestawia go na `loop: true` bez restartu lub restartuje w zależności od decyzji UX;
  - jeżeli nic nie gra, startuje odtwarzanie z `loop: true`.

Najbardziej zgodne z promptem jest: kliknięcie Loop uruchamia dźwięk od razu, a ponowne kliknięcie Loop zatrzymuje całość.

### 3. Zmiana obsługi zdarzenia `ended`

Obecnie zakończenie audio zawsze wywołuje `stopPlayback(playbackRoot)`. Dla Loop potrzebna jest logika warunkowa:

```js
audio.addEventListener("ended", () => {
  const entry = activePlayers.get(playbackRoot);
  if (entry?.loop) {
    startNextLoopIteration(playbackRoot);
    return;
  }
  stopPlayback(playbackRoot);
});
```

Ważne: przed startem kolejnej iteracji trzeba usunąć albo zastąpić stary obiekt audio tak, aby stary element nie został przypadkiem ponownie zatrzymany po zmianie mapy. Najbezpieczniej tworzyć pomocniczą funkcję `replaceActiveAudio(entry, audio, gainNode, fullUrl)` albo budować nowy wpis i nadpisywać mapę dopiero po prawidłowym przygotowaniu odtwarzacza.

### 4. Aktualizacja UI

Należy dodać przycisk `Loop` do każdego miejsca, z którego użytkownik ma korzystać z pętli. Są dwie możliwe interpretacje:

- **Minimalna**: przycisk Loop tylko w widokach użytkownika, bo obraz pokazuje kafel użytkownika.
- **Spójna**: przycisk Loop we wszystkich miejscach, w których można uruchomić dźwięk.

Rekomendacja: wdrożyć spójnie w widoku użytkownika, adminowym „Głównym widoku” i adminowej liście SFX. W adminowych listach ulubionych można również dodać Loop obok Play, aby nie było niespójności z przyciskiem `fav-play`.

Proponowane atrybuty:

```html
<button class="btn loop-btn" data-action="loop">Loop</button>
```

Dla wariantów adminowych, gdzie akcje mają prefiksy, można użyć jednolitego `data-action="loop"`, `data-action="fav-loop"` i `data-action="main-loop"`, ale prostsza obsługa zdarzeń będzie możliwa, jeśli wszystkie przyciski użyją `data-action="loop"`, a `itemId` zostanie pobrany z najbliższego root elementu.

### 5. Czerwony aktywny stan przycisku

Obecnie czerwony kolor aktywnego odtwarzania jest ustawiany na `.sample-card.is-playing .sample-trigger` oraz `.fav-item.is-playing .sample-trigger`. Dla Loop należy dodać osobny stan, na przykład:

```css
.btn.loop-btn.is-looping,
.btn.loop-btn[aria-pressed="true"] {
  background: rgba(255, 95, 95, 0.22);
  border-color: var(--danger);
  color: #ffd6d6;
  box-shadow: 0 0 12px rgba(255, 95, 95, 0.35);
}
```

Dla dostępności warto użyć `aria-pressed="true"` na aktywnym przycisku Loop. Wtedy styl i semantyka przełącznika są zsynchronizowane.

### 6. Aktualizacja etykiet językowych

W obiekcie `translations` należy dodać co najmniej:

- `buttonLoop: "Loop"` dla PL;
- `buttonLoop: "Loop"` dla EN;
- opcjonalnie `buttonLoopStop: "Wyłącz Loop"` / `"Stop Loop"`, jeżeli tekst przycisku ma się zmieniać.

Rekomendacja: zostawić stały napis `Loop` i zmieniać tylko kolor oraz `aria-pressed`, bo prompt wymaga czerwonego aktywnego stanu, a nie zmiany etykiety.

### 7. Obsługa odświeżenia renderu

Ważne ryzyko obecnej architektury: `activePlayers` używa elementu DOM jako klucza. Funkcje `renderAllViews()`, `renderSamples()`, `renderFavorites()` i podobne mogą przebudować HTML, przez co stary element DOM znika, a wpis w `activePlayers` pozostaje powiązany z elementem, którego użytkownik już nie widzi.

Przy implementacji Loop należy rozważyć jedną z opcji:

1. **Przed większym renderem zatrzymywać odtwarzanie aktywnych elementów** — najprostsze, ale może przerywać dźwięki przy zmianie danych.
2. **Zostawić obecną architekturę i zaakceptować ograniczenie** — najmniej zmian, ale Loop może wyglądać na nieaktywny po re-renderze mimo dalszego grania.
3. **Zmienić klucz mapy na stabilny identyfikator widoku** — najlepsze technicznie, lecz większa przebudowa.

Rekomendacja dla pierwszego wdrożenia: zachować obecną architekturę, ale przy każdym renderowaniu kart ustalać stan przycisku Loop na podstawie `activePlayers` tylko dla istniejącego `playbackRoot`. Dodatkowo warto dodać funkcję `stopAllPlaybackBeforeRender()` tylko dla operacji, które radykalnie przebudowują listę, jeżeli testy pokażą problem.

## Proponowany zakres zmian w plikach przy implementacji

### `Audio/index.html`

Zmiany JavaScript:

- dodać etykietę `buttonLoop` w obu językach;
- rozszerzyć model wpisu w `activePlayers`;
- dodać `toggleLoop(itemId, playbackRoot)`;
- zmienić `startPlayback()` tak, aby przyjmowała opcję `{ loop: true/false }`;
- zmienić obsługę `ended` tak, aby aktywna pętla startowała kolejny losowy wariant zamiast wywoływać `stopPlayback()`;
- dodać funkcję aktualizującą stan przycisku Loop, np. `updateLoopButtonState(playbackRoot, isLooping)`;
- podpiąć obsługę kliknięć `data-action="loop"` w tych samych miejscach, gdzie działa Play;
- dopilnować, aby suwak głośności wpływał także na kolejne iteracje Loop.

Zmiany HTML generowanego w JS:

- dodać przycisk Loop w `renderSamples()`;
- dodać przycisk Loop w `renderFavorites()`;
- dodać przycisk Loop w `renderMainViewAdmin()`;
- dodać przycisk Loop w `renderUserMainView()`;
- dodać przycisk Loop w `renderUserFavorites()`.

Zmiany CSS:

- dodać klasę `.loop-btn`;
- dodać aktywny czerwony stan `.loop-btn.is-looping` lub `.loop-btn[aria-pressed="true"]`;
- sprawdzić układ `.sample-actions` i `.fav-item-actions`, aby przycisk mieścił się obok suwaka na szerokościach desktopowych i mobilnych.

### `Audio/docs/README.md`

Po implementacji trzeba zaktualizować instrukcję użytkownika w pełnej wersji polskiej i pełnej wersji angielskiej. Dokument powinien wyjaśniać:

- czym różni się kliknięcie nazwy dźwięku/Play od kliknięcia Loop;
- że Loop działa do ponownego kliknięcia;
- że czerwony przycisk Loop oznacza aktywną pętlę;
- że przy kilku wariantach aplikacja wybiera kolejne pliki losowo;
- co zrobić, gdy dźwięk się nie odtwarza.

### `Audio/docs/Documentation.md`

Po implementacji trzeba uzupełnić dokumentację techniczną o:

- nowy stan odtwarzacza;
- opis funkcji `toggleLoop`, zmian w `startPlayback`, zmian w obsłudze `ended`;
- opis działania losowania wariantów w pętli;
- opis klas CSS i atrybutów `aria-pressed`;
- opis zależności między przyciskiem Loop, suwakiem głośności i `activePlayers`.

### `DetaleLayout.md`

Ponieważ czerwony aktywny przycisk Loop jest zmianą wyglądu, należy dopisać aktualny opis:

- kolor aktywnego przycisku Loop;
- obwódkę i cień aktywnego stanu;
- zachowanie w układzie kafla;
- zachowanie responsywne, jeżeli przycisk zmieni rozmieszczenie elementów.

## Rekomendowany algorytm Loop

Poniższy pseudokod pokazuje docelową logikę bez przepisywania całego modułu:

```js
const startPlayback = (item, playbackRoot, options = {}) => {
  const previous = activePlayers.get(playbackRoot);
  const fullUrl = pickRandomVariantAvoiding(item, previous?.lastUrl);
  const audio = new Audio(fullUrl);
  const player = {
    item,
    audio,
    gainNode,
    loop: Boolean(options.loop),
    lastUrl: fullUrl
  };

  activePlayers.set(playbackRoot, player);
  applyPlayerVolume(player, getPlaybackVolumeValue(playbackRoot));
  updatePlaybackLabel(playbackRoot, true);
  updateLoopButtonState(playbackRoot, player.loop);

  audio.addEventListener("ended", () => {
    const current = activePlayers.get(playbackRoot);
    if (current?.audio !== audio) return;
    if (current.loop) {
      startPlayback(current.item, playbackRoot, { loop: true });
      return;
    }
    stopPlayback(playbackRoot);
  });

  audio.play().catch(() => stopPlayback(playbackRoot));
};
```

Najważniejszy szczegół to sprawdzenie `current?.audio !== audio`. Chroni to przed sytuacją, w której starszy element audio kończy się po tym, jak użytkownik zdążył już uruchomić inny wariant albo wyłączyć pętlę.

## Ryzyka

1. **Natywne `audio.loop` nie spełni wymagań** — będzie powtarzać ten sam plik, więc nie wolno oprzeć całej funkcji wyłącznie na tej właściwości.
2. **Re-render może odłączyć stan od widocznego DOM** — obecna mapa `activePlayers` jest kluczowana elementem DOM.
3. **Wiele widocznych kopii tego samego dźwięku** — ten sam `itemId` może istnieć w głównej liście, widoku głównym i ulubionych. Trzeba zdecydować, czy Loop jest niezależny dla każdego widocznego kafla/przycisku. Obecny model sugeruje niezależność per widoczny element.
4. **Autoplay i Web Audio API** — przeglądarki mogą blokować audio, jeśli odtwarzanie nie jest wynikiem gestu użytkownika. Kolejne iteracje po `ended` zwykle powinny działać, ponieważ łańcuch zaczyna się od kliknięcia, ale trzeba to przetestować w docelowej przeglądarce/WebView.
5. **Nakładanie się eventów `ended` i ręcznego stopu** — potrzebne jest sprawdzanie, czy zdarzenie dotyczy aktualnego obiektu audio.
6. **Głośność powyżej 100% przez Web Audio API** — obecny suwak obsługuje wartości od `-100` do `+100`, co jest mapowane na gain `0..2`. Kolejne iteracje muszą tworzyć nowy `gainNode` i ponownie stosować bieżącą wartość suwaka.
7. **Brak wariantów lub uszkodzony URL** — Loop powinien wyłączać się i pokazywać błąd analogicznie do obecnego Play.

## Rekomendowane testy po implementacji

### Testy manualne

1. Uruchomić moduł `Audio` w widoku użytkownika.
2. Kliknąć `Loop` na dźwięku z jednym wariantem.
3. Sprawdzić, że przycisk jest czerwony i dźwięk startuje.
4. Poczekać do końca dźwięku i sprawdzić, że zaczyna się ponownie.
5. Kliknąć `Loop` ponownie i sprawdzić, że dźwięk się zatrzymuje, a przycisk wraca do zwykłego stanu.
6. Uruchomić `Loop` na dźwięku z kilkoma wariantami.
7. Sprawdzić w narzędziach deweloperskich lub słuchowo, że kolejne odtworzenia wybierają warianty losowo.
8. Zmienić suwak głośności w trakcie aktywnego Loop i sprawdzić, że następna iteracja używa aktualnej głośności.
9. Włączyć zwykłe Play, a następnie Loop dla tego samego kafla — sprawdzić, że nie powstają dwa równoległe odtworzenia tego samego kafla.
10. Włączyć Loop w jednym kaflu i zwykłe Play w innym — sprawdzić, że równoległe odtwarzanie nadal działa.
11. Sprawdzić widok admina `?admin=1`, szczególnie główną listę SFX, listy ulubionych i adminowy „Główny widok”.
12. Sprawdzić zachowanie po błędnym lub pustym URL w manifeście.

### Testy programistyczne

Repozytorium nie zawiera obecnie standardowego `package.json` dla modułu Audio, więc testy będą głównie manualne i statyczne. Po implementacji warto wykonać:

```bash
python3 -m http.server 8000
```

Następnie otworzyć:

- `http://localhost:8000/Audio/`;
- `http://localhost:8000/Audio/?admin=1`.

Dodatkowo warto uruchomić prostą kontrolę składni HTML/JS przez przeglądarkę i konsolę DevTools, ponieważ kod JS jest osadzony bezpośrednio w `Audio/index.html` jako moduł.

## Rekomendowana kolejność wdrożenia

1. Dodać etykiety tłumaczeń `buttonLoop`.
2. Dodać CSS dla `.loop-btn` i aktywnego czerwonego stanu.
3. Dodać przyciski Loop w renderowanych kartach i listach.
4. Rozszerzyć strukturę `activePlayers`.
5. Dodać `toggleLoop()` i warunkową obsługę `ended`.
6. Upewnić się, że zwykłe Play/Stop nadal działa identycznie jak przed zmianą.
7. Przetestować losowanie wariantów i brak natychmiastowej powtórki, jeżeli zostanie wdrożona rekomendowana wersja.
8. Zaktualizować `Audio/docs/README.md`, `Audio/docs/Documentation.md` i `DetaleLayout.md`.
9. Wykonać testy manualne w widoku użytkownika i admina.

## Konkluzja

Rozbudowa modułu `Audio` o przycisk „Loop” jest technicznie prosta do wykonania, ponieważ moduł ma już:

- strukturę zgrupowanych wariantów `item.variants`;
- funkcję losującą wariant `pickRandomVariant(item)`;
- centralną mapę aktywnych odtwarzaczy `activePlayers`;
- jednolity mechanizm start/stop dla większości widoków;
- istniejące czerwone zmienne kolorystyczne przez `--danger`.

Najważniejsze jest, aby nie używać samego `audio.loop = true`, tylko po zdarzeniu `ended` uruchamiać kolejny wariant tak, jakby użytkownik ponownie nacisnął odtwarzanie. Dzięki temu funkcja spełni wymóg losowej kolejności dla kilku podpiętych dźwięków.

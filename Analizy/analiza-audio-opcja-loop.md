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

Przycisk `Loop` ma być dostępny tylko w prawdziwym widoku użytkownika uruchomionym bez parametru `?admin=1`. W panelu admina nie należy renderować przycisku `Loop` na liście SFX, w listach „Ulubione”, w adminowym panelu „Główny widok” ani w adminowym podglądzie widoku użytkownika.

Decyzja aktualna po doprecyzowaniu wymagania: pętla jest funkcją gracza/użytkownika, a panel admina pozostaje miejscem zarządzania listami, aliasami i szybkim odsłuchem przez **Odtwórz/Zatrzymaj**.

Proponowane atrybuty:

```html
<button class="btn loop-btn" data-action="loop">Loop</button>
```

Atrybut `data-action="loop"` wystarczy dla kart użytkownika. Wariant `data-action="fav-loop"` nie jest potrzebny, ponieważ adminowe listy ulubionych nie renderują już przełącznika pętli.

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
- podpiąć obsługę kliknięć `data-action="loop"` tylko dla zwykłego widoku użytkownika;
- dopilnować, aby suwak głośności wpływał także na kolejne iteracje Loop.

Zmiany HTML generowanego w JS:

- nie dodawać przycisku Loop w `renderSamples()`;
- nie dodawać przycisku Loop w `renderFavorites()`;
- nie dodawać przycisku Loop w `renderMainViewAdmin()`;
- renderować przycisk Loop w `renderUserMainView()` wyłącznie, gdy aplikacja nie działa w `ADMIN_MODE`;
- renderować przycisk Loop w `renderUserFavorites()` wyłącznie, gdy aplikacja nie działa w `ADMIN_MODE`.

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
3. Renderować przyciski Loop tylko w prawdziwym widoku użytkownika bez `?admin=1`, a nie w panelach admina.
4. Rozszerzyć strukturę `activePlayers`.
5. Dodać `toggleLoop()` i warunkową obsługę `ended`.
6. Upewnić się, że zwykłe Play/Stop nadal działa identycznie jak przed zmianą.
7. Przetestować losowanie wariantów i brak natychmiastowej powtórki, jeżeli zostanie wdrożona rekomendowana wersja.
8. Zaktualizować `Audio/docs/README.md`, `Audio/docs/Documentation.md` i `DetaleLayout.md`.
9. Wykonać testy manualne w widoku użytkownika i admina, potwierdzając obecność Loop tylko bez `?admin=1`.

## Konkluzja

Rozbudowa modułu `Audio` o przycisk „Loop” jest technicznie prosta do wykonania, ponieważ moduł ma już:

- strukturę zgrupowanych wariantów `item.variants`;
- funkcję losującą wariant `pickRandomVariant(item)`;
- centralną mapę aktywnych odtwarzaczy `activePlayers`;
- jednolity mechanizm start/stop dla większości widoków;
- istniejące czerwone zmienne kolorystyczne przez `--danger`.

Najważniejsze jest, aby nie używać samego `audio.loop = true`, tylko po zdarzeniu `ended` uruchamiać kolejny wariant tak, jakby użytkownik ponownie nacisnął odtwarzanie. Dzięki temu funkcja spełni wymóg losowej kolejności dla kilku podpiętych dźwięków.

## Zmiany wykonane w kodzie

### Plik: `Audio/index.html`

Lokalizacja: style `.loop-btn` w sekcji CSS, okolice linii 362-368

Było:

```css
.sample-card.is-playing .sample-trigger,
.fav-item.is-playing .sample-trigger {
  color: var(--danger);
}
```

Jest:

```css
.sample-card.is-playing .sample-trigger,
.fav-item.is-playing .sample-trigger {
  color: var(--danger);
}

.loop-btn.is-looping,
.loop-btn[aria-pressed="true"] {
  background: rgba(255, 95, 95, 0.22);
  border-color: var(--danger);
  color: #ffd6d6;
  box-shadow: 0 0 12px rgba(255, 95, 95, 0.35);
}
```

### Plik: `Audio/index.html`

Lokalizacja: obiekt `translations`, okolice linii 741-813

Było:

```js
buttonPlay: "Odtwórz",
buttonStop: "Zatrzymaj",
```

oraz:

```js
buttonPlay: "Play",
buttonStop: "Stop",
```

Jest:

```js
buttonPlay: "Odtwórz",
buttonStop: "Zatrzymaj",
buttonLoop: "Loop",
```

oraz:

```js
buttonPlay: "Play",
buttonStop: "Stop",
buttonLoop: "Loop",
```

### Plik: `Audio/index.html`

Lokalizacja: funkcje odtwarzania `pickRandomVariant`, `startPlayback`, `stopPlayback`, `togglePlayback`, `toggleLoop`, okolice linii 1204-1399

Było:

```js
const pickRandomVariant = (item) => {
  const index = Math.floor(Math.random() * item.variants.length);
  return item.variants[index]?.fullUrl || "";
};

const startPlayback = (item, playbackRoot) => {
  const fullUrl = pickRandomVariant(item);
  const player = { audio, gainNode };
  activePlayers.set(playbackRoot, player);
  audio.addEventListener("ended", () => stopPlayback(playbackRoot));
};
```

Jest:

```js
const pickRandomVariant = (item, previousUrl = "") => {
  // przy wielu wariantach unika natychmiastowej powtórki, jeżeli dostępny jest inny URL
};

const startPlayback = (item, playbackRoot, options = {}) => {
  const player = { item, audio, gainNode, loop: Boolean(options.loop), lastUrl: fullUrl };
  activePlayers.set(playbackRoot, player);
  audio.addEventListener("ended", () => {
    const current = activePlayers.get(playbackRoot);
    if (current?.audio !== audio) return;
    if (current.loop) {
      startPlayback(current.item, playbackRoot, { loop: true, previousUrl: current.lastUrl });
      return;
    }
    stopPlayback(playbackRoot);
  });
};

const toggleLoop = (itemId, playbackRoot) => {
  // uruchamia pętlę, przełącza aktywne Play w Loop albo zatrzymuje aktywną pętlę
};
```

### Plik: `Audio/index.html`

Lokalizacja: funkcje renderujące i obsługa kliknięć, okolice linii 1582-1740 oraz 2072-2240

Było:

```html
<button class="btn" data-action="play">Odtwórz</button>
<input class="volume-slider" data-role="volume" type="range" min="-100" max="100" value="0" />
```

oraz kliknięcia Play używały bezpośrednio przycisku jako `playbackRoot` w adminowych listach.

Jest:

```html
<button class="btn" data-action="play">Odtwórz</button>
<button class="btn loop-btn" data-action="loop" aria-pressed="false">Loop</button>
<input class="volume-slider" data-role="volume" type="range" min="-100" max="100" value="0" />
<button class="btn loop-btn" data-action="loop" aria-pressed="false">Loop</button>
```

Renderowane karty i elementy list otrzymują `data-playback-root="true"`, a obsługa kliknięć kieruje Play i Loop do tego samego korzenia widoku, aby zwykłe odtwarzanie i pętla nie tworzyły dwóch równoległych odtworzeń tego samego widocznego elementu.

### Plik: `Audio/docs/README.md`

Lokalizacja: sekcje „Jak odtwarzać dźwięki”, „Co oznaczają elementy na kafelku dźwięku”, „Przyciski specjalne” oraz ich angielskie odpowiedniki, okolice linii 18-57 i 122-162

Było: instrukcja opisywała kliknięcie nazwy dźwięku, zatrzymywanie ponownym kliknięciem i suwak głośności.

Jest: instrukcja opisuje zwykłe odtwarzanie, przycisk **Loop**, czerwony stan aktywnej pętli, losowy wybór wariantów, wyłączanie pętli ponownym kliknięciem oraz wpływ suwaka głośności na kolejne iteracje.

### Plik: `Audio/docs/Documentation.md`

Lokalizacja: sekcje architektury, layoutu, CSS, renderowania i akcji użytkownika, okolice linii 9-13, 75-87, 127-132 oraz 198-219

Było: dokumentacja techniczna opisywała wyłącznie zwykły przepływ Play/Stop i aktywny stan `.is-playing`.

Jest: dokumentacja techniczna opisuje stan `loop`, `lastUrl`, funkcję `toggleLoop`, unikanie natychmiastowej powtórki wariantu, `aria-pressed`, czerwony styl `.loop-btn` oraz renderowanie Loop w widokach użytkownika i admina.

### Plik: `DetaleLayout.md`

Lokalizacja: sekcja „Moduł — Audio”, okolice linii 572-576

Było: layout modułu Audio opisywał aktywny stan odtwarzania `.is-playing` i suwak `.volume-slider`.

Jest: layout modułu Audio opisuje także przycisk `.loop-btn`, jego czerwony aktywny stan, `aria-pressed="true"`, obramowanie, kolor tekstu i cień.

## Aktualizacja analizy — 2026-06-08

### Temat aktualizacji

Ukrycie przycisku `Loop` w panelu admina modułu `Audio` i pozostawienie go tylko w zwykłym widoku użytkownika bez parametru `?admin=1`.

### Oryginalny pełny prompt użytkownika

```text
Przeczytaj analizę Analizy/analiza-audio-opcja-loop.md
Trzeba wprowadzić jedną poprawkę.

W widoku admina przycisk "Loop" nie jest potrzebny na liście plików SFX. Przycisk "loop" jest potrzebny tylko w widoku użytkownika (bez dopisku ?admin=1).
Tak samo w widoku admina przycisk "Loop" nie jest potrzebny przy widoku ulubionych.
Po wprowadzeniu poprawek zaktualizuj plik Analizy/analiza-audio-opcja-loop.md o ten prompt oraz zmiany jakie wprowadziłeś.
```

Do promptu dołączono zrzut ekranu panelu admina pokazujący przyciski `Loop` na liście SFX oraz w panelu „Ulubione”; te miejsca wskazują elementy do usunięcia z adminowego UI.

### Zakres aktualizacji

- sprawdzenie aktualnego renderowania przycisków `Loop` w `Audio/index.html`;
- usunięcie przycisku `Loop` z adminowej listy SFX;
- usunięcie przycisku `Loop` z adminowego panelu „Ulubione”;
- usunięcie przycisku `Loop` z adminowego panelu „Główny widok” i adminowego podglądu widoku użytkownika, zgodnie z zasadą, że `Loop` ma działać tylko bez `?admin=1`;
- aktualizacja dokumentacji modułu `Audio` i opisu layoutu.

### Wnioski po aktualizacji

- `Loop` pozostaje przełącznikiem pętli dla kart użytkownika w `Audio/index.html` uruchomionym bez `?admin=1`.
- Panel admina zachowuje przyciski odsłuchu **Odtwórz/Zatrzymaj**, ale nie pokazuje przełącznika `Loop` ani na liście SFX, ani przy pozycjach ulubionych, ani w adminowym „Głównym widoku”.
- Adminowy podgląd widoku użytkownika również nie renderuje `Loop`, ponieważ działa pod adresem z `?admin=1`.

### Rekomendacje po aktualizacji

- Testować `Loop` w zwykłym widoku użytkownika bez `?admin=1`.
- W panelu admina testować tylko odsłuch jednorazowy, dodawanie do list, zmianę kolejności, zmianę nazw i usuwanie pozycji.
- Nie dodawać ponownie `fav-loop` dla panelu admina, jeśli nie pojawi się nowe wymaganie biznesowe.

### Ryzyka

- Jeżeli osoba korzystająca z panelu admina potrzebuje pętli podczas przygotowywania list, musi otworzyć zwykły widok użytkownika bez `?admin=1`.
- Ukrycie `Loop` w adminowym podglądzie jest celowe, ale może wymagać przypomnienia w instrukcji użytkownika, że podgląd admina nie jest tym samym co realny widok gracza.

### Następne kroki

- Po wdrożeniu uruchomić stronę w dwóch wariantach adresu: `Audio/index.html?admin=1` oraz `Audio/index.html`.
- W `?admin=1` potwierdzić brak tekstu/przycisku `Loop` w adminowych panelach.
- Bez `?admin=1` potwierdzić obecność i działanie przycisku `Loop` w widoku głównym i ulubionych użytkownika.

## Zmiany wykonane w kodzie

### Plik: `Audio/index.html`

Lokalizacja: funkcja `updateLoopButtonState()`

Było:

```js
const loopButton = playbackRoot.matches?.("button[data-action=\"loop\"], button[data-action=\"fav-loop\"]")
  ? playbackRoot
  : playbackRoot.querySelector("button[data-action=\"loop\"], button[data-action=\"fav-loop\"]");
```

Jest:

```js
const loopButton = playbackRoot.matches?.("button[data-action=\"loop\"]")
  ? playbackRoot
  : playbackRoot.querySelector("button[data-action=\"loop\"]");
```

### Plik: `Audio/index.html`

Lokalizacja: funkcja `renderSamples()`

Było:

```html
<button class="btn" data-action="play">...</button>
<button class="btn loop-btn" data-action="loop" aria-pressed="false">...</button>
<select class="fav-select">...</select>
```

Jest:

```html
<button class="btn" data-action="play">...</button>
<select class="fav-select">...</select>
```

### Plik: `Audio/index.html`

Lokalizacja: funkcja `renderFavorites()`

Było:

```html
<button class="btn" data-action="fav-play">...</button>
<button class="btn loop-btn" data-action="fav-loop" aria-pressed="false">...</button>
<button class="btn" data-action="fav-up">▲</button>
```

Jest:

```html
<button class="btn" data-action="fav-play">...</button>
<button class="btn" data-action="fav-up">▲</button>
```

### Plik: `Audio/index.html`

Lokalizacja: funkcja `renderMainViewAdmin()`

Było:

```html
<input class="volume-slider" data-role="volume" type="range" min="-100" max="100" value="0" />
<button class="btn loop-btn" data-action="loop" aria-pressed="false">...</button>
<button class="btn" data-action="main-up">▲</button>
```

Jest:

```html
<input class="volume-slider" data-role="volume" type="range" min="-100" max="100" value="0" />
<button class="btn" data-action="main-up">▲</button>
```

### Plik: `Audio/index.html`

Lokalizacja: funkcje `renderUserMainView()` i `renderUserFavorites()`

Było:

```html
<button class="btn loop-btn" data-action="loop" aria-pressed="false">...</button>
```

Jest:

```js
const loopControlHtml = ADMIN_MODE
  ? ""
  : `<button class="btn loop-btn" data-action="loop" aria-pressed="false">${translations[currentLanguage].labels.buttonLoop}</button>`;
```

### Plik: `Audio/index.html`

Lokalizacja: obsługa kliknięć `samplesGrid`, `favoritesPanel`, `mainViewPanel`

Było:

```js
// Adminowe listenery obsługiwały akcje `loop` albo `fav-loop`.
```

Jest:

```js
// Adminowe listenery nie obsługują już `loop` ani `fav-loop`, ponieważ te przyciski nie są renderowane w panelu admina.
```

### Plik: `Audio/docs/README.md`

Lokalizacja: sekcje PL i EN opisujące przyciski specjalne oraz dobre praktyki

Było: instrukcja opisywała `Loop` jako przycisk dostępny także w panelu admina.

Jest: instrukcja wyjaśnia, że `Loop` jest dostępny tylko w zwykłym widoku użytkownika bez `?admin=1`, a panel admina służy do odsłuchu przez **Odtwórz/Zatrzymaj**.

### Plik: `Audio/docs/Documentation.md`

Lokalizacja: opis architektury, renderowania oraz logiki funkcjonalnej

Było: dokumentacja techniczna opisywała `Loop` przy adminowej liście SFX, listach „Ulubione”, panelu „Główny widok” i widoku użytkownika.

Jest: dokumentacja techniczna opisuje `Loop` jako element renderowany tylko w zwykłym widoku użytkownika bez `?admin=1`; adminowe panele nie renderują tego przycisku.

### Plik: `DetaleLayout.md`

Lokalizacja: sekcja `Audio` → `Layout i elementy UI`

Było: opis rozmieszczał `.loop-btn` w obszarze akcji kafla/listy także w kontekście adminowego panelu „Główny widok”.

Jest: opis wskazuje, że `.loop-btn` występuje wyłącznie w zwykłym widoku użytkownika bez `?admin=1`, z zachowaniem czerwonego stanu aktywnej pętli.


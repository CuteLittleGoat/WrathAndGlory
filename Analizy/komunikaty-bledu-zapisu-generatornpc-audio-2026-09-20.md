# Komunikaty o nieudanym zapisie w modułach GeneratorNPC i Audio — analiza przed wdrożeniem

> **Data:** 20 września 2026
> **Temat:** co dokładnie dzieje się dziś, gdy zapis do Firestore się nie powiedzie, i jak rozbudować oba moduły, żeby użytkownik się o tym dowiedział
> **Geneza:** awaria z 20 września, opisana w `Analizy/awaria-regul-appcheck-2026-09-20.md`. Ulubiony potwór utworzony w GeneratorNPC nie zapisał się do bazy, a moduł nie dał tego po sobie poznać
> **Charakter dokumentu:** analiza przedwdrożeniowa. **Nie wprowadza żadnych zmian w kodzie**

---

## 1. Prompt użytkownika (zachowany w całości)

> Kwestia komunikatu o błędzie zapisu to będzie osobny projekt.
> Przygotuj analizę wprowadzenia takiego rozwiązania i rozbudowy obu modułów.

Kontekst, z którego wyrasta to polecenie — ustalenie z końca poprzedniej pracy:

> **GeneratorNPC i moduł Audio nie informują o nieudanym zapisie.** To właśnie dlatego ulubiony potwór zniknął bez śladu. Infoczytnik pokazał `alert` i tylko dzięki temu awaria została zauważona.

---

## 2. Zakres analizy

Analiza obejmuje obsługę niepowodzenia zapisu i odczytu Firestore w dwóch modułach: **GeneratorNPC** i **Audio**. Obejmuje też wzorzec z Infoczytnika jako punkt odniesienia.

Poza zakresem: sama konfiguracja App Check (zamknięta), moduł DataVault (czyta z Realtime Database, nie zapisuje) oraz oba Kreatory Postaci (osobny temat, inna odmiana zapisu Firebase).

---

## 3. Sprostowanie wobec pierwszej oceny

W podsumowaniu awarii napisałem, że oba moduły „nie informują o nieudanym zapisie". **Po przeczytaniu kodu to zdanie jest nieścisłe i trzeba je poprawić**, bo oba moduły zachowują się inaczej, a jeden z nich robi coś gorszego niż milczenie.

- **GeneratorNPC informuje**, tylko komunikat jest łagodny w treści i słaby wizualnie, a moduł po cichu przechodzi na pamięć lokalną — przez co zapis *wygląda* na udany.
- **Audio rzeczywiście milczy**, i to w sposób, który nie zapisuje danych nigdzie.

Różnica jest istotna, bo prowadzi do dwóch różnych zakresów prac.

---

## 4. Stan obecny — GeneratorNPC

### Co jest zaimplementowane

| Miejsce | Zachowanie przy błędzie |
|---|---|
| `saveFavorites`, linie 2162–2180 | `try/catch` wokół `setDoc`. W `catch`: komunikat `firestoreSaveError`, `usingFirestore = false`, zapis do `localStorage` |
| Nasłuch `onSnapshot`, linie 2192–2212 | Pełna obsługa błędu trzecim argumentem: komunikat `firestoreNoAccess`, `usingFirestore = false`, wczytanie danych z `localStorage` |
| `setFavoritesStatus`, linie 935–938 | Ustawia tekst w jednej linii statusu i przełącza klasę `text-red` |

Czyli moduł **nie ignoruje błędu** — przewiduje go i ma zaplanowaną reakcję.

### Trzy powody, dla których to nie zadziałało

**1. Komunikat brzmi jak informacja, nie jak ostrzeżenie.** Dzisiejsze teksty:

```
firestoreSaveError: "Błąd zapisu w Firestore. Zapis lokalny włączony."
firestoreNoAccess:  "Brak dostępu do Firestore. Używam pamięci lokalnej."
```

Druga połowa każdego zdania unieważnia pierwszą. „Używam pamięci lokalnej" czyta się jak *„poradziłem sobie"*, a nie jak *„Twoje dane nie trafią na inne urządzenia"*. Dla tej aplikacji to jest różnica zasadnicza, bo Firestore jest tu **wyłącznie** po to, żeby dane były wspólne — lokalna kopia nie zastępuje niczego.

**2. Komunikat jest wizualnie słaby.** To jedna linijka tekstu, która zmienia kolor na czerwony. Nie zatrzymuje pracy, nie wymaga potwierdzenia, nie wraca. Użytkownik patrzy w tym momencie na listę ulubionych, a nie na linię statusu.

**3. Zapis naprawdę się udaje — tyle że lokalnie.** To jest sedno. Potwór pojawia się na liście, lista wygląda poprawnie, nic nie wskazuje na problem. Dopiero drugie urządzenie pokazuje prawdę.

### Ukryta strata danych przy powrocie łączności

Ten punkt jest poważniejszy niż sam brak komunikatu.

Gdy dostęp do Firestore wraca i moduł zostaje otwarty na nowo, `onSnapshot` wczytuje stan z bazy i **nadpisuje nim stan lokalny**. Dane zapisane w czasie awarii do `localStorage` nie są nigdzie wysyłane — `usingFirestore` przestawia się na `false` i wraca na `true` wyłącznie przy ponownej inicjalizacji (linia 2190), a żadna ścieżka nie przenosi lokalnych zmian do bazy.

**Skutek: praca wykonana w czasie awarii znika bez śladu i bez komunikatu.** Dokładnie to spotkało ulubionego potwora z 20 września.

---

## 5. Stan obecny — Audio

Tutaj sytuacja jest wyraźnie gorsza i ma trzy odrębne usterki.

### Usterka 1 — nasłuch bez obsługi błędu

Linia 2036:

```js
onSnapshot(state.favoritesDoc, (snapshot) => { ... });
```

Brakuje trzeciego argumentu, czyli funkcji obsługi błędu. Otaczający `try/catch` (linie 2035–2060) łapie **wyłącznie błędy synchroniczne przy zakładaniu nasłuchu**, a odmowa dostępu przychodzi asynchronicznie, już po jego założeniu. Wtedy nie dzieje się nic: błąd ląduje w konsoli przeglądarki, interfejs zostaje z pustym stanem początkowym.

To jest dokładnie objaw zgłoszony 20 września: brak list ulubionych, przycisk „Odblokuj Archiwum" mignął i zniknął.

### Usterka 2 — zapis bez zabezpieczenia

Linie 1882–1898:

```js
const saveSettings = async () => {
  const payload = { ... };
  if (state.usingFirestore && state.favoritesDoc) {
    await setDoc(state.favoritesDoc, payload);
    return;
  }
  localStorage.setItem(AUDIO_SETTINGS_STORAGE_KEY, JSON.stringify({ ... }));
};
```

Nie ma `try/catch`. Gdy `setDoc` odpada, funkcja kończy się odrzuconą obietnicą i **nie wykonuje nawet zapisu lokalnego z drugiej gałęzi** — bo `usingFirestore` nadal jest `true`. Dane nie trafiają zatem nigdzie: ani do bazy, ani do pamięci lokalnej.

### Usterka 3 — dwanaście wywołań bez obsługi odrzucenia

Wywołania `await saveSettings()` znajdują się w dwunastu miejscach (linie 2333–2471), w funkcjach obsługi zdarzeń: dodanie listy, dodanie pozycji do listy, przesunięcie listy, zmiana nazwy i tak dalej. Żadne z nich nie ma `try/catch`.

Skutek jest podwójny:

1. Odrzucenie przerywa funkcję **przed** `renderAllViews()`, więc interfejs nie odświeża się i zostaje w stanie sprzed operacji albo w stanie niespójnym z danymi.
2. Odrzucona obietnica nie jest nigdzie łapana — trafia do konsoli jako nieobsłużony błąd, którego nikt nie ogląda.

Jedyne wywołanie z obsługą to linia 2042 — `saveSettings().catch(console.error)` — i ono również kończy się wyłącznie wpisem w konsoli.

### Skala różnicy między modułami

| | GeneratorNPC | Audio |
|---|---|---|
| Nieudany odczyt | komunikat + zejście na pamięć lokalną | **nic** |
| Nieudany zapis | komunikat + zapis lokalny | **nic, dane przepadają natychmiast** |
| Ślad dla użytkownika | słaby, ale jest | żaden |
| Ślad w konsoli | jest | jest |

---

## 6. Wzorzec z Infoczytnika — co warto przenieść, a czego nie

Infoczytnik zachował się najlepiej z trzech modułów i tylko dzięki niemu awaria została w ogóle zauważona. Warto jednak zobaczyć, **która część jego kodu za to odpowiada**, bo nie cały moduł jest wzorem.

| Miejsce | Zachowanie | Ocena |
|---|---|---|
| Wysłanie wiadomości, `GM.html:1177` | `.catch(e => { setStatus('statusError'); alert(e.message); })` | ✅ zadziałało — okno `alert` jest nie do przeoczenia |
| Nasłuch ulubionych, `GM.html:1056` | ustawia wyłącznie podpowiedź przy przycisku | ⚠️ ta sama słabość co w GeneratorNPC |

**Wniosek:** przenosimy zasadę „nieudany zapis musi zatrzymać użytkownika", ale **nie przenosimy `alert` jako środka**. Okno `alert` blokuje całą stronę, pokazuje surową treść błędu po angielsku (`Missing or insufficient permissions`) i nie mówi użytkownikowi, co ma z tym zrobić. Sprawdza się jako hamulec bezpieczeństwa, nie jako docelowy sposób komunikacji.

---

## 7. Czego brakuje — lista wymagań

Z powyższego wynika sześć wymagań wobec docelowego rozwiązania:

1. **Każda nieudana operacja zapisu musi zostawić widoczny ślad** — taki, którego nie da się przeoczyć, patrząc na listę ulubionych.
2. **Komunikat musi rozróżniać trzy sytuacje**, bo znaczą co innego: *nie zapisano nic*, *zapisano tylko lokalnie, na tym urządzeniu*, *nie udało się wczytać danych*.
3. **Komunikat musi mówić, co robić.** Najczęstsze przyczyny są dwie i obie mają proste rozwiązanie: blokada `google.com/recaptcha` w przeglądarce oraz odmowa uprawnień po stronie bazy. Opis rozpoznawania jest w rozdz. 11a instrukcji App Check.
4. **Tryb lokalny musi być widoczny stale, a nie raz.** Dopóki moduł pracuje na pamięci lokalnej, użytkownik ma to widzieć — inaczej po chwili o tym zapomni.
5. **Audio musi dostać zejście na pamięć lokalną**, którego dziś nie ma, żeby nieudany zapis nie kasował pracy od razu.
6. **Oba moduły muszą przestać milcząco gubić dane zapisane w trybie lokalnym** — albo przez ich odesłanie do bazy, albo przez wyraźne ostrzeżenie przed nadpisaniem.

---

## 8. Proponowane rozwiązanie

### Wspólny moduł zamiast dwóch osobnych implementacji

Proponuję nowy plik `shared/firebase-write-status.js` — zwykły moduł ES, tak jak `shared/firebase-app-check.js`, obsługujący oba moduły. Powód jest ten sam, dla którego klucze App Check trafiły do jednego pliku: inaczej te same teksty, te same kody błędów i ta sama logika powstaną dwa razy i rozjadą się przy pierwszej poprawce.

Moduł miałby trzy zadania:

**1. Rozpoznanie przyczyny.** Firestore zwraca kod w polu `error.code`. Mapowanie na sytuację zrozumiałą dla użytkownika:

| Kod Firestore | Co to znaczy | Co pokazać |
|---|---|---|
| `permission-denied` | odmowa reguł albo brak znacznika App Check | „Baza odrzuciła zapis" + podpowiedź o blokadzie reCAPTCHA |
| `unauthenticated` | brak wymaganego logowania | „Sesja wygasła, zaloguj się ponownie" |
| `unavailable` | brak połączenia z siecią | „Brak połączenia. Dane czekają na tym urządzeniu" |
| `failed-precondition`, pozostałe | rzadkie przypadki | komunikat ogólny z kodem błędu do przekazania |

**2. Jeden sposób pokazania.** Pasek u góry modułu, w kolorystyce obu modułów, z treścią zależną od sytuacji. Nie znika sam — użytkownik go zamyka albo znika, gdy zapis wreszcie się powiedzie. Do tego stały znacznik trybu pracy: *dane wspólne* albo *tylko to urządzenie*.

**3. Teksty po polsku i po angielsku**, w układzie zgodnym z tym, co oba moduły już mają w swoich słownikach tłumaczeń.

### Trzy warianty zakresu

| | Zakres | Co rozwiązuje | Czego nie rozwiązuje |
|---|---|---|---|
| **W1 — minimalny** | Dołożyć brakujące `try/catch` w Audio, obsługę błędu nasłuchu i mocniejsze teksty w obu modułach | Ciszę w module Audio. Najtańsze, najmniej ryzykowne | Zostają dwie osobne implementacje. Nie rozwiązuje utraty danych z trybu lokalnego |
| **W2 — wspólny moduł** *(rekomendowany)* | W1 plus `shared/firebase-write-status.js`, widoczny pasek, stały znacznik trybu pracy, zejście Audio na pamięć lokalną | Wymagania 1–5. Użytkownik wie, co się stało i co zrobić | Wymaganie 6 — dane z trybu lokalnego nadal nie wracają do bazy |
| **W3 — z ponowną synchronizacją** | W2 plus kolejka zmian lokalnych i odesłanie ich do bazy po odzyskaniu dostępu | Wszystkie sześć wymagań | Wprowadza problem, którego dziś nie ma — patrz niżej |

**Rekomendacja: W2, z W3 jako osobną decyzją na później.**

### Dlaczego nie od razu W3

Oba moduły zapisują **cały dokument naraz** — GeneratorNPC całą tablicę `favorites`, Audio komplet ustawień razem z listami i aliasami. Przy takiej strukturze „odesłanie lokalnych zmian" oznacza nadpisanie całego dokumentu, czyli **skasowanie tego, co w międzyczasie zapisał ktoś inny albo Ty z drugiego urządzenia**.

Zrobienie tego bezpiecznie wymaga scalania na poziomie pojedynczych list i pozycji, a więc zmiany struktury danych — to jest osobny projekt, nie rozszerzenie tego. Do czasu jego wykonania uczciwszym rozwiązaniem jest **jasne ostrzeżenie** („masz niezapisane zmiany z tego urządzenia, otwarcie modułu je nadpisze") niż ciche scalanie, które może skasować cudzą pracę.

---

## 9. Zakres prac

### Etap 1 — Audio, usterki krytyczne

Ten etap ma sens nawet wykonany osobno, bo moduł Audio traci dziś dane natychmiast i bez śladu.

- dodać obsługę błędu nasłuchu jako trzeci argument `onSnapshot` (linia 2036);
- otoczyć `setDoc` w `saveSettings` blokiem `try/catch` i przy niepowodzeniu przełączyć moduł na pamięć lokalną, tak jak robi to GeneratorNPC (linie 1882–1898);
- zabezpieczyć dwanaście wywołań `await saveSettings()` tak, żeby odrzucenie nie przerywało odświeżania widoku (linie 2333–2471).

### Etap 2 — wspólny moduł komunikatów

- napisać `shared/firebase-write-status.js` wraz z mapowaniem kodów błędów i tekstami PL/EN;
- dodać styl paska do `shared/` — obok istniejącego `shared/access-gate.css`, który jest precedensem na wspólny styl dzielony przez moduły.

### Etap 3 — wpięcie w oba moduły

- GeneratorNPC: zastąpić `setFavoritesStatus` w ścieżkach błędu wywołaniem wspólnego modułu, przepisać teksty, dodać stały znacznik trybu pracy;
- Audio: wpiąć ten sam moduł w miejsca z etapu 1.

### Etap 4 — sprawdzenie

Awarię da się odtworzyć bez ruszania konfiguracji App Check: wystarczy **tymczasowo** wgrać w regułach Firestore projektu `audiorpg-2eb6f` warunek `if false` dla jednej ze ścieżek, sprawdzić zachowanie i cofnąć regułę z historii. Drugi sposób, bez dotykania bazy: zablokować adres `firestore.googleapis.com` w narzędziach deweloperskich przeglądarki.

> ⚠️ **Do testów nie używać warunku `request.app != null`.** Odcina on wszystko niezależnie od znacznika i nie odwzorowuje żadnej realnej sytuacji — powód w `Analizy/awaria-regul-appcheck-2026-09-20.md`.

### Etap 5 — dokumentacja, wymagana przez `AGENTS.md`

- `GeneratorNPC/docs/Documentation.md` i `GeneratorNPC/docs/README.md`;
- `Audio/docs/Documentation.md` i `Audio/docs/README.md`;
- `DetaleLayout.md` — jeżeli pasek wprowadzi nowe kolory, odstępy albo komponent;
- komentarze PL/EN w nowych i zmienianych plikach.

---

## 10. Ryzyka

| Ryzyko | Ocena i przeciwdziałanie |
|---|---|
| **Fałszywe alarmy** | Przy chwilowym braku sieci `unavailable` pojawi się przy zwykłym korzystaniu. Pasek nie powinien straszyć w tym przypadku — stąd osobny, łagodniejszy komunikat dla tego kodu |
| **Pasek zasłaniający interfejs** | Oba moduły mają gęsty układ. Pasek musi być wąski i nie przesuwać zawartości w sposób psujący widok na telefonie; wymaga sprawdzenia responsywności |
| **Rozjazd tłumaczeń** | Oba moduły mają własne słowniki. Teksty komunikatów trzymać w jednym miejscu, we wspólnym module, a nie kopiować do obu słowników |
| **Regresja w module Audio** | Etap 1 dotyka dwunastu funkcji obsługi zdarzeń. Każdą trzeba sprawdzić ręcznie: dodanie i usunięcie listy, dodanie pozycji, przesunięcie, zmiana nazwy, zmiana aliasu |
| **Zakres pełzający w stronę W3** | Ponowna synchronizacja wygląda na drobne rozszerzenie, a wymaga zmiany struktury danych. Trzymać ją poza tym projektem jako osobną decyzję |

---

## 11. Następne kroki

1. Decyzja o wariancie — proponowany **W2**.
2. Decyzja, czy etap 1 (Audio) wykonać od razu, niezależnie od reszty. Uzasadnienie: to jedyny moduł, który dziś traci dane natychmiast i bez jakiegokolwiek śladu.
3. Decyzja o wyglądzie paska — czy ma być wspólny dla obu modułów, czy dopasowany osobno do każdego.
4. Dopiero po tych trzech decyzjach: praca w kodzie, w kolejności etapów z rozdz. 9.

---

## 12. Uwaga na koniec

Ta awaria kosztowała jednego ulubionego potwora, bo trwała czterdzieści minut i została zauważona. Ten sam mechanizm przy dłuższej i mniej oczywistej usterce — wygasły klucz reCAPTCHA, zmieniona domena, przekroczony darmowy limit sprawdzeń — działałby tak samo cicho, tylko dłużej. **Wartością tego projektu nie jest ładniejszy komunikat, tylko to, że następnym razem dowiesz się o problemie w dniu, w którym wystąpi.**

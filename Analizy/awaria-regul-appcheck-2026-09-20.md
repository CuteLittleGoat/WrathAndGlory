# Awaria aplikacji po wgraniu reguł z `request.app != null` — diagnoza

> **Data:** 20 września 2026
> **Temat:** dlaczego po wykonaniu kroku 6 z `Analizy/instrukcja-appcheck-2026-09-13.md` przestały działać wszystkie moduły korzystające z Cloud Firestore, mimo poprawnie działającego App Check
> **Stan na koniec analizy:** ✅ **oba projekty przywrócone.** `wh40k-data-slate` cofnięty o 18:19, `audiorpg-2eb6f` o 18:41. Infoczytnik i moduł Audio potwierdzone jako sprawne. GeneratorNPC czeka jeszcze na sprawdzenie (rozdz. 10, punkt 1)
> **Analizy powiązane:** `Analizy/instrukcja-appcheck-2026-09-13.md` (rozdz. 9 — krok 6), `Analizy/audyt-kodu-aplikacji-2026-09-10.md` (rozdz. 9.8 — źródło treści reguł)

---

## 1. Prompty użytkownika (zachowane w całości)

> Aplikacja przestała działać. Zwraca błąd w module Infoczytnik (GM). W panelu podglądu nie łąduje się obrazek. Reszty jeszcze nie sprawdzałem.

*(w załączeniu zrzut ekranu: okno dialogowe „Komunikat ze strony cutelittlegoat.github.io — Missing or insufficient permissions.")*

> wklej mi dokłądnie jakie rules mam wkleić. Zwraca mi jakiś błąd składni.

*(zrzut: edytor reguł z błędem „Error saving rules - Line 2: Expected ''." i samotnym `{` w linii 1)*

> Dalej coś jest nie tak.

*(zrzut: ekran **Realtime Database → Rules** z błędem „Error saving rules - Line 1: Parse error." i wklejonymi regułami Firestore)*

> Wklejam stan "na teraz" jaki mam w obu projektach.

*(trzy zrzuty: `audiorpg-2eb6f` → Firestore Rules z `zAplikacji()` z dziś 18:03; `wh40k-data-slate` → Firestore Rules z `if true` z dziś 18:19; `wh40k-data-slate` → Realtime Database Rules — nietknięte)*

> Rzeczy jakie zrobiłem:
> 1. Otworzyłem nową kartę incognito
> 2. Wszedłem na stronę https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html?admin=1
> 3. Otworzyłem moduł Infoczytnik.
> 4. W panelu GM wpisałem wiadomość.
> 5. Wiadomość wyświetliła się prawidłowo
> 6. Sprawdziłem też zapis ulubionej wiadomości - prawidłowo się zapisuje.
> 7. Wszedłem w moduł GeneratorNPC.
> 8. Podałem poprawne hasło.
> 9. Utworzyłem ulubionego potwora.
> 10. Na telefonie otwieram moduł GeneratorNPC - nie widzę dodanego ulubionego potwora.
> 11. Na PC resetuję przeglądarkę i powtarzam kroki 1, 2, 7 i 8
> 12. Nie widzę potwora dodanego w punkcie 9.
> 13. Otwieram moduł Audio.
> 14. Wpisuję poprawne hasło.
> 15. Na ekranie https://cutelittlegoat.github.io/WrathAndGlory/Audio/index.html nie widzę wcześniej dodanych list ulubionych. Przez chwilę widać przycisk "Odblokuj Archiwum" i po chwili on znika.
> 16. W widoku admina modułu Audio też nie widzę wcześniej dodanych list.
> 17. Listy ulubionych są widoczne z poziomu widoku konsoli Firebase - chociaż są to starsze wpisy. W Audio jest jakiś wpis z dziś.

*(w załączeniu trzy zrzuty konsoli Firebase: `audio/favorites` z polem `updatedAt: September 20, 2026 at 5:33:45 PM UTC+2` oraz `generatorNpc/favorites` z polem `updatedAt: September 16, 2026 at 9:37:04 AM UTC+2`)*

> wszystkie te ustalenia zapisz w nowym pliku w Analizy.

> Ulubione w Infoczytniku zapisały się w firebase.

> są też ulubione, które dodałem w tamtym tygodniu.

> analizę wrzuć na Main. W audio podmieniłem Rules. Listy ulubionych w module Audio się pojawiły.

*(zrzuty: historia reguł `audiorpg-2eb6f` z nową wersją „Today · 6:41 PM" zawierającą `if true`, oraz ekran modułu Audio z widoczną sekcją „Listy ulubionych" i pozycjami RICO i EPILOG)*

*(zrzuty konsoli Firebase: `dataslate/current` z polem `ts: September 20, 2026 at 6:26:35 PM UTC+2`, dokument `dataslate_favorites/BqgtzX7elKCNxVwGPuBH` z polem `zaktualizowano: September 20, 2026 at 6:26:20 PM UTC+2` oraz dokument `dataslate_favorites/pmoebauYj8mVpJnaMSMh` z polem `zaktualizowano: September 14, 2026 at 8:51:10 AM UTC+2`. Kolekcja `dataslate_favorites` zawiera cztery dokumenty)*

---

## 2. Zakres analizy

Analiza obejmuje wyłącznie zdarzenie z 20 września 2026 po godzinie 18:00 — wgranie reguł Firestore z warunkiem `request.app != null` (krok 6 instrukcji App Check) i wynikającą z tego niedostępność danych we wszystkich modułach korzystających z Firestore.

Poza zakresem pozostaje sama konfiguracja App Check (klucze, rejestracja aplikacji, wymuszanie), która — jak pokazuje ta analiza — działa poprawnie i nie wymaga zmian.

---

## 3. Oś czasu zdarzenia

| Godzina (20 września) | Co się stało | Skutek |
|---|---|---|
| — (14 września) | kod sześciu modułów zaczyna wysyłać znaczniki App Check | brak, wymuszanie jeszcze wyłączone |
| wcześniej tego dnia | włączone wymuszanie: RTDB i Firestore w `wh40k-data-slate`, Firestore w `audiorpg-2eb6f` | aplikacja działa, metryki 100% zweryfikowanych w oknie 24 h |
| **17:33** | moduł Audio **skutecznie zapisuje** dane do `audio/favorites` | dowód, że przy wymuszaniu i regułach `if true` zapis działa |
| **18:03** | krok 6 wgrany w `audiorpg-2eb6f` | GeneratorNPC i Audio przestają czytać i zapisywać |
| **18:04** | krok 6 wgrany w `wh40k-data-slate` | Infoczytnik zwraca `Missing or insufficient permissions` |
| **18:19** | reguły `wh40k-data-slate` cofnięte do wersji z kroku 0 (`if true`) | **Infoczytnik wraca do pełnej sprawności** |
| **18:26** | Infoczytnik zapisuje `dataslate/current` i nowy dokument w `dataslate_favorites` | **potwierdzenie w bazie, że po cofnięciu reguł zapis działa** |
| po 18:19 | testy użytkownika (rozdz. 1, punkty 1–17) | patrz niżej |
| **18:41** | reguły `audiorpg-2eb6f` cofnięte do wersji z kroku 0 (`if true`) | **moduł Audio wraca do sprawności — listy ulubionych znów się wczytują** |

Godziny 18:03 i 18:04 pochodzą z historii reguł w konsoli Firebase, godzina 17:33 z pola `updatedAt` dokumentu `audio/favorites`.

---

## 4. Objawy w poszczególnych modułach

| Moduł | Projekt | Reguły w chwili testu | Zachowanie |
|---|---|---|---|
| Infoczytnik (panel GM) | `wh40k-data-slate` | `if true` (po cofnięciu) | ✅ wiadomość wysyła się i wyświetla, zapis ulubionej działa — potwierdzone w bazie: `dataslate/current` z godziny 18:26:35 i nowy dokument w `dataslate_favorites` z 18:26:20 |
| GeneratorNPC | `audiorpg-2eb6f` | `zAplikacji()` | ❌ ulubiony potwór „zapisuje się" bez błędu, ale nie ma go w bazie ani na innym urządzeniu |
| Audio | `audiorpg-2eb6f` | `zAplikacji()` | ❌ listy ulubionych nie wczytują się, przycisk „Odblokuj Archiwum" pojawia się i znika |
| Audio | `audiorpg-2eb6f` | `if true` (po cofnięciu o 18:41) | ✅ listy ulubionych wczytują się poprawnie |

**Dane w bazie są nienaruszone.** Konsola Firebase pokazuje komplet dokumentów. Najnowszy zapis w `generatorNpc/favorites` pochodzi z **16 września** — czyli potwór utworzony dziś w punkcie 9 nigdy nie trafił do bazy. Najnowszy zapis w `audio/favorites` pochodzi z **dziś, 17:33** — czyli sprzed wgrania reguł.

> ⚠️ **Najgroźniejszy objaw: awaria jest cicha.** GeneratorNPC nie pokazał żadnego błędu przy tworzeniu ulubionego potwora. Użytkownik zobaczył potwierdzenie zapisu, a zapis nie nastąpił. Bez sprawdzenia na drugim urządzeniu strata danych byłaby niezauważona. Infoczytnik zachował się lepiej — pokazał komunikat — bo jego kod obsługuje błąd zapisu okienkiem `alert`.

---

## 5. Test rozstrzygający i co z niego wynika

Testy zostały tak dobrane, żeby rozdzielić dwie niezależne warstwy ochrony, które zostały włączone tego samego dnia:

- **warstwa 1 — przełącznik *Enforce*** w App Check, działający po stronie usługi;
- **warstwa 2 — warunek `request.app != null`** w regułach, działający po stronie reguł.

| Warunki | Wynik |
|---|---|
| Wymuszanie **włączone**, reguły `if true` (Infoczytnik, po 18:19) | ✅ działa |
| Wymuszanie **włączone**, reguły `if true` (Audio, 17:33) | ✅ działa |
| Wymuszanie **włączone**, reguły `zAplikacji()` (Infoczytnik, 18:04–18:19) | ❌ odmowa |
| Wymuszanie **włączone**, reguły `zAplikacji()` (GeneratorNPC i Audio, od 18:03) | ❌ odmowa |

**Interpretacja.** Pierwszy wiersz jest kluczowy. Przy włączonym wymuszaniu usługa odrzuca każde zapytanie **bez ważnego znacznika App Check, zanim w ogóle dojdzie do reguł**. Skoro Infoczytnik przy regułach `if true` działa, to znaczy, że **jego zapytania niosą ważny znacznik i przechodzą warstwę 1**. Potwierdzają to metryki App Check: 100% zweryfikowanych w oknie 24-godzinnym przed zmianą.

A mimo to warunek `request.app != null` te same zapytania odrzuca.

**Wniosek: `request.app` nie jest wypełniane dla zapytań tej aplikacji, mimo że znacznik App Check jest obecny i ważny.** Warunek zachowuje się jak `if false` — odcina wszystko, niezależnie od znacznika.

Zjawisko wystąpiło w obu projektach i w obu odmianach zapisu Firebase naraz — w zgodnościowej 9.6.8 (Infoczytnik) i w nowoczesnej 12.6.0 (GeneratorNPC, Audio). To wyklucza błąd w jednym module, w jednej wersji biblioteki albo w jednym kluczu.

---

## 6. Czego nie udało się ustalić

Uczciwie: **nie znam przyczyny, dla której `request.app` pozostaje puste.** Sprawdzenie dokumentacji Firebase w trakcie tej analizy nie dało jednoznacznej odpowiedzi — strony opisujące reguły Firestore wymieniają `request.auth`, `request.method`, `request.path` i `request.resource`, natomiast `request.app` nie jest tam opisane. Dokumentacja App Check opisuje wyłącznie przełącznik wymuszania i zdanie *„wszystkie niezweryfikowane zapytania do produktu zostaną odrzucone"* — bez wzmianki o regułach.

Możliwości, których ta analiza nie rozstrzyga:

1. `request.app` nie jest wspierane w regułach Cloud Firestore i odwołanie do nieistniejącego pola kończy się błędem obliczenia reguły, a błąd oznacza odmowę.
2. `request.app` jest wspierane, ale wymaga czegoś, czego ta aplikacja nie spełnia.

**Dla podjęcia decyzji ta różnica nie ma znaczenia** — w obu przypadkach warunek jest w tej aplikacji bezużyteczny i szkodliwy, a ochronę i tak daje przełącznik wymuszania. Gdyby kiedyś warto było to rozstrzygnąć, jedyną drogą jest ponowne wgranie warunku **na jednej, nieużywanej ścieżce** i obserwacja, a nie na całej bazie naraz.

---

## 7. Wniosek

**Krok 6 z instrukcji App Check był zbędny i szkodliwy. Należy go trwale porzucić.**

Ochrona, o którą chodziło w audycie, jest już osiągnięta dwoma innymi środkami, które działają i są sprawdzone:

1. **Zawężone ścieżki (krok 0).** Reguły wymieniają pięć konkretnych dokumentów plus kolekcję `dataslate_favorites`, a wszystko poza nimi ma `if false`. Obcy nie może tworzyć dowolnych dokumentów — a mógł, co audyt udowodnił testem w rozdz. 9.2.
2. **Wymuszanie App Check (krok 5).** Usługa odrzuca każde zapytanie bez ważnego znacznika, zanim dojdzie do reguł. To jest dokładnie ta ochrona, którą warunek `request.app != null` miał rzekomo dodać — i jedyna, która w tej aplikacji faktycznie działa.

Warunek w regułach nie dokładał trzeciej warstwy. Dublował warstwę drugą, w sposób, który w tej aplikacji nie działa.

---

## 8. Wykonane przywrócenie

Oba projekty zostały cofnięte do reguł z kroku 0. Poniżej treść, która jest w nich wgrana — zarazem wersja docelowa, bo warunku `zAplikacji()` nie wracamy już wgrywać.

**`audiorpg-2eb6f`** — wgrane 20 września o 18:41, moduł Audio potwierdzony jako sprawny:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /generatorNpc/favorites { allow read, write: if true; }
    match /audio/favorites { allow read, write: if true; }
    match /{document=**} { allow read, write: if false; }
  }
}
```

**`wh40k-data-slate`** — wgrane 20 września o 18:19, Infoczytnik potwierdzony jako sprawny:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /dataslate/current { allow read, write: if true; }
    match /dataslate_favorites/{document=**} { allow read, write: if true; }
    match /character_builder/current { allow read, write: if true; }
    match /character_builder/v2 { allow read, write: if true; }
    match /{document=**} { allow read, write: if false; }
  }
}
```

Wymuszanie App Check pozostaje **włączone** we wszystkich trzech miejscach i to ono odcina obce programy. Reguły wróciły wyłącznie do stanu sprzed kroku 6, czyli do zawężonych ścieżek z kroku 0.

> 🔻 **Pułapka przy wklejaniu, na którą użytkownik trafił dwa razy.** Reguły Firestore i reguły Realtime Database to dwa różne ekrany z dwoma różnymi językami. Ekran **Realtime Database** ma zakładki *Data · Rules · Backups · Usage*, a jego treść zaczyna się od `{`. Ekran **Cloud Firestore** ma zakładki *Data · Rules · Indexes · Usage*, a jego treść zaczyna się od `rules_version = '2';`. Wklejenie treści Firestore na ekranie Realtime Database daje „Parse error" w linii 1.

---

## 9. Ryzyka

| Ryzyko | Ocena |
|---|---|
| **Utrata danych zapisanych w czasie awarii** | Zrealizowane w minimalnym zakresie. Nie zapisał się wyłącznie ulubiony potwór utworzony w GeneratorNPC po 18:03 — trzeba go utworzyć ponownie. **Wszystkie starsze dane ocalały**: w `dataslate_favorites` są cztery dokumenty, w tym jeden z 14 września, a w `audio/favorites` wpis z dziś z godziny 17:33. Awaria blokowała dostęp, nie kasowała danych |
| **Cicha awaria zapisu w GeneratorNPC i Audio** | Otwarte. Te moduły nie informują użytkownika o nieudanym zapisie. Przy każdej przyszłej zmianie reguł albo wymuszania ta sama sytuacja powtórzy się niezauważona |
| **Powtórzenie błędu z dokumentacji** | Otwarte do czasu poprawienia plików wymienionych w rozdz. 11. Instrukcja i audyt nadal zalecają krok 6 jako docelowy |
| **Obniżenie poziomu ochrony po cofnięciu reguł** | Znikome. Wymuszanie App Check zostaje włączone i to ono odcina obce programy. Reguły wracają do stanu z kroku 0, czyli zawężonych ścieżek |

---

## 10. Następne kroki

1. **Sprawdzić GeneratorNPC** — jako jedyny moduł nie został jeszcze potwierdzony po cofnięciu reguł o 18:41. Utworzyć ulubionego potwora i sprawdzić, czy jest widoczny po odświeżeniu oraz na drugim urządzeniu.
2. **Poprawić dokumentację** — wykaz w rozdz. 11.
3. **Rozważyć głośną obsługę błędu zapisu** w GeneratorNPC i module Audio. Dziś nieudany zapis do Firestore nie daje żadnego znaku na ekranie. Infoczytnik pokazuje `alert` i to właśnie dzięki temu awaria została w ogóle zauważona.
4. **Rozważyć widoczny komunikat o braku App Check.** Kod celowo pomija App Check, gdy nie uda się go uruchomić (`shared/firebase-app-check.js`, `shared/firebase-app-check-compat.js`). Przy wyłączonym wymuszaniu to była zaleta. Przy włączonym oznacza, że moduł wystartuje normalnie i dopiero przy zapisie dostanie odmowę — bez żadnej wskazówki, że chodzi o App Check.
5. **Odtworzyć ulubionego potwora** utworzonego po 18:03.
6. **Sprawdzić osobno brak obrazka w podglądzie panelu GM.** Podgląd rysuje się z lokalnego pliku `assets/data/data.json` i plików graficznych, nie z Firestore, więc jest to najpewniej usterka niezwiązana z App Check. Po cofnięciu reguł objaw nie został ponownie zgłoszony — wymaga potwierdzenia.

---

## 10a. Obserwacja poboczna — dwa nieużywane miejsca w bazie

Przy okazji przeglądania bazy w konsoli widać w projekcie `wh40k-data-slate` dwie rzeczy, do których **żaden moduł się nie odwołuje**:

| Miejsce | Stan |
|---|---|
| kolekcja `admin_security` | w kodzie całego repozytorium nie ma ani jednego odwołania do tej nazwy |
| dokument `dataslate/config` | reguły dopuszczają wyłącznie `dataslate/current`; do `config` kod nigdzie nie sięga |

Obecne reguły blokują oba miejsca warunkiem `match /{document=**} { allow read, write: if false; }` i **robią to od kroku 0, czyli od 14 września** — a przez ten czas nic z tego powodu nie przestało działać. To potwierdza, że są nieużywane, i jednocześnie wyklucza je jako przyczynę tej awarii.

Nie są one problemem i nie wymagają działania. Warto tylko wiedzieć, że istnieją, zanim ktoś zacznie sprzątać bazę albo zastanawiać się, czemu reguły ich nie wymieniają.

---

## 11. Poprawki do istniejącej dokumentacji

Dwa pliki zalecają dziś rozwiązanie, które zostało obalone doświadczalnie:

| Plik | Co jest nieaktualne |
|---|---|
| `Analizy/instrukcja-appcheck-2026-09-13.md` | Rozdz. 3 wymienia krok 6 jako „domknięcie tematu". Rozdz. 9 zawiera gotowe reguły z `zAplikacji()` i opisuje je jako wersję docelową. Rozdz. 12 odhacza krok 6 jako wykonany. Nagłówek mówi „temat zamknięty" |
| `Analizy/audyt-kodu-aplikacji-2026-09-10.md` | Rozdz. 9.8 jest źródłem treści tych reguł i opisuje `request.app != null` jako cel |
| `shared/firestore-wh40k-data-slate.rules` | Zawiera wersję z `zAplikacji()`, a w konsoli jest już wersja z `if true` — rozjazd między repozytorium a stanem faktycznym |
| `shared/firestore-audiorpg.rules` | Zawiera wersję z `zAplikacji()`, a w konsoli od 18:41 jest wersja z `if true` — ten sam rozjazd co wyżej |

Plik `shared/rtdb-wh40k-data-slate.rules.json` pozostaje aktualny — reguły Realtime Database nie były zmieniane i nie mają odpowiednika `request.app`, więc cała ta sprawa ich nie dotyczy.

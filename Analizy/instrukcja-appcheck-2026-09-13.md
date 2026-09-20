# App Check — instrukcja krok po kroku dla aplikacji WrathAndGlory

> **Data:** 13 września 2026 — *ostatnia aktualizacja: 20 września 2026*
> **Dla kogo:** dla Ciebie, do klikania w przeglądarce. Nie trzeba nic umieć programować.
> **Stan pierwotny (13 września):** w obu projektach Firebase zakładka **App Check** jest pusta — widać w niej tylko ekran powitalny z przyciskiem **Get started**. Czyli zaczynamy od zera.
> **✅ Stan na 20 września:** ochrona jest **włączona**. Wymuszanie działa w trzech miejscach: w projekcie `wh40k-data-slate` dla **Realtime Database** i **Cloud Firestore**, w projekcie `audiorpg-2eb6f` dla **Cloud Firestore**. Usługa **Authentication** została świadomie zostawiona w trybie *Monitoring* — uzasadnienie i plan w rozdz. 9a. Do zrobienia został już tylko **krok 6**, czyli dopisanie `request.app != null` do reguł Firestore w obu projektach.
> **Analizy powiązane:** `Analizy/audyt-kodu-aplikacji-2026-09-10.md` (rozdz. 9 — dlaczego to robimy), `Analizy/responsywnosc-aplikacji-2026-09-10.html`

---

## 1. Prompt użytkownika (zachowany dla kontekstu)

> Dodatkowo proszę, żebyś w Analizy/ utworzył mi plik MD opisujący krok po kroku co i gdzie mam klikać, żeby utworzyć App Check. Sprawdziłem i w na obu kontach o których mowa w pkt 1 nie mam nic w zakładce "App Check". Załączam screena z jednego z kont (na obu wygląda to tak samo).

Wcześniejsze ustalenia, na których opiera się ta instrukcja:

> Rozumiem, że App Check rozwiązuje te problemy?
> I tak - w trakcie tworzenia aplikacji przy module do Audio użyłem innego Firebase niż do reszty. Jednak nie mam teraz potrzeby zmiany. Zrobię po prostu 2x wymagane operacje.

> Nie robimy jeszcze zmian w kodzie. Tylko analizy i przygotowanie app check

---

## 2. Zanim zaczniesz — co to jest i po co

**App Check sprawdza, czy zapytanie do bazy przychodzi z Twojej aplikacji, a nie z jakiegoś obcego programu.** Nie sprawdza, kim jest użytkownik — od tego jest Litania Dostępu.

Dziś Twoja baza wygląda tak: każdy, kto zna identyfikator projektu (a jest on jawny w kodzie strony i **musi** taki być), może czytać i zapisywać w tych miejscach:

| Projekt | Co jest otwarte dla każdego |
|---|---|
| `wh40k-data-slate` | cała kolekcja `dataslate` (kanał Infoczytnika) i cała kolekcja `character_builder` (oba kreatory postaci) |
| `audiorpg-2eb6f` | dokumenty `audio/favorites` i `generatorNpc/favorites` |

Po włączeniu App Check te same miejsca zostaną dostępne **wyłącznie dla Twojej aplikacji**.

> **Co App Check zrobi:** odetnie obce skrypty, automaty skanujące internet i kogoś, kto chciałby napisać własny program piszący do Twojej bazy.
> **Czego App Check nie zrobi:** nie ochroni przed osobą, która normalnie korzysta z aplikacji i otworzy w przeglądarce narzędzia deweloperskie. Przy grupie znajomych to jest w porządku.

---

## 3. Najważniejsze: kolejność

To jest jedyny fragment tej instrukcji, którego **nie wolno** przestawić.

```
KROK 1  Klucze reCAPTCHA (Google Cloud)         — nic nie przestaje działać
KROK 2  Rejestracja aplikacji (Firebase)        — nic nie przestaje działać
KROK 3  Kod aplikacji wysyła znaczniki          — nic nie przestaje działać
KROK 4  Obserwacja przez kilka dni              — nic nie przestaje działać
KROK 5  Włączenie wymuszania                    — OD TEGO MOMENTU obce programy są odcinane
KROK 6  Zawężenie reguł bazy                    — domknięcie tematu
```

**Dlaczego to takie ważne:** jeśli włączysz wymuszanie (krok 5) zanim aplikacja zacznie wysyłać znaczniki (krok 3), **aplikacja przestanie działać wszystkim naraz** — Tobie i graczom. Kroki 1–4 są całkowicie bezpieczne i możesz je robić bez pośpiechu.

> ### 🛑 Hamulec bezpieczeństwa — zapamiętaj to teraz
> W tym samym miejscu, w którym klikniesz **Enforce** (Wymuś), jest przycisk **Unenforce** (Wyłącz wymuszanie).
> Działa **natychmiast**, nie wymaga żadnej zmiany w kodzie i cofa całą operację.
> Ścieżka: **Firebase Console → App Check → zakładka APIs → kliknij usługę → Unenforce.**

---

## 4. Co dokładnie robimy dwa razy

Masz dwa osobne projekty Firebase, a klucz reCAPTCHA należy do konkretnego projektu. Dlatego **kroki 1, 2 i 5 wykonujesz dwa razy** — raz dla każdego projektu.

| | Projekt 1 | Projekt 2 |
|---|---|---|
| Nazwa w konsoli | **WH40k-Data-Slate** | projekt modułu Audio |
| Identyfikator | `wh40k-data-slate` | `audiorpg-2eb6f` |
| Z czego korzystają moduły | DataVault, Kalkulator (oba kreatory), Infoczytnik | GeneratorNPC, Audio |
| Ile aplikacji webowych do zarejestrowania | **1** | **1** |
| Identyfikator tej aplikacji | kończy się na `…9eb27e2ed29109ac838fad` | kończy się na `…500bdf5c394ac786e2e4ea` |
| Co wymusić w kroku 5 | **Cloud Firestore** oraz **Realtime Database** | **tylko Cloud Firestore** |

**Dobra wiadomość:** w każdym projekcie jest tylko **jedna** aplikacja webowa i obsługuje ona wszystkie korzystające z niego moduły. Nie ma tu pułapki z dwiema bliźniaczymi aplikacjami, którą znasz z projektu `Karty`.

**Uwaga o Realtime Database:** DataVault czyta dane z Realtime Database, a nie z Firestore. To osobna usługa z osobnym przełącznikiem wymuszania. Gdybyś włączył wymuszanie tylko dla Firestore, DataVault zostałby poza ochroną.

---

## 4a. KROK 0 — zawężenie reguł, do zrobienia od razu

> **Stan na 13 września: kroki 1 i 2 masz już wykonane** (klucze reCAPTCHA `WrathAndGlory-DataSlate` i `WrathAndGlory-AudioRPG` utworzone dla domeny `cutelittlegoat.github.io`, obie aplikacje webowe zarejestrowane w App Check ze statusem *Registered*). Zdecydowałeś też, że reguły zawężamy od razu — poniżej gotowy tekst do wklejenia.

Ten krok **nie wymaga żadnych zmian w kodzie i nie może niczego zepsuć.** Nie dopisujemy jeszcze warunku `request.app != null` (ten czeka na krok 6). Zmieniamy wyłącznie **ścieżki**: z „cała kolekcja" na „te konkretne dokumenty, których aplikacja naprawdę używa".

**Sprawdziłem w kodzie, że aplikacja korzysta dziś dokładnie z pięciu dokumentów** — i z niczego więcej:

| Projekt | Dokument | Kto go używa |
|---|---|---|
| `wh40k-data-slate` | `dataslate/current` | panel GM ↔ ekran Infoczytnika |
| `wh40k-data-slate` | `character_builder/current` | Prosty Kreator Postaci |
| `wh40k-data-slate` | `character_builder/v2` | Zaawansowany Kreator Postaci |
| `audiorpg-2eb6f` | `generatorNpc/favorites` | ulubione zestawy GeneratorNPC |
| `audiorpg-2eb6f` | `audio/favorites` | ustawienia modułu Audio |

**Do tego dokładamy z góry miejsce na listy ulubionych Infoczytnika** (`DoZrobienia.md` poz. 5), żeby nie trzeba było wracać do reguł przy tamtej pracy. Szczegóły i uzasadnienie doboru nazwy są pod tabelą z regułami.

Ścieżka: Firebase Console → **Firestore Database** → zakładka **Rules** → zaznacz całość, wklej poniższe → **Publish**.

**Projekt `wh40k-data-slate`:**

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // --- Infoczytnik ---

    // Kanał panelu GM -> ekran Infoczytnika. Jeden dokument, nadpisywany na żywo.
    // GM panel -> reader screen channel. A single document, overwritten live.
    match /dataslate/current { allow read, write: if true; }

    // Zapisane wiadomości (listy ulubionych). Kolekcja jeszcze nie istnieje —
    // regula jest przygotowana z góry, żeby nie wracać tu przy rozbudowie modułu.
    // Saved messages (favourite lists). The collection does not exist yet —
    // the rule is prepared in advance so this file needs no edit later.
    match /dataslate_favorites/{document=**} { allow read, write: if true; }

    // --- Kreatory postaci / Character creators ---

    // Prosty Kreator Postaci / Simple character creator
    match /character_builder/current { allow read, write: if true; }

    // Zaawansowany Kreator Postaci / Advanced character creator
    match /character_builder/v2 { allow read, write: if true; }

    // --- Wszystko inne niedostępne / Everything else inaccessible ---
    match /{document=**} { allow read, write: if false; }
  }
}
```

#### Dlaczego akurat `dataslate_favorites` i dlaczego `{document=**}` tylko tam

Rozważyłem trzy układy i wybrałem ten, bo jest najprostszy do zaprogramowania i najtrudniejszy do zepsucia:

| Układ | Jak wygląda ścieżka | Ocena |
|---|---|---|
| **Osobna kolekcja** (wybrany) | `dataslate_favorites/{id}` | Najprostszy w kodzie: `collection(db, 'dataslate_favorites')`. Nazwa w stylu istniejącego `character_builder`. Kanał na żywo zostaje ściśle jednym dokumentem |
| Podkolekcja pod `dataslate` | `dataslate/favorites/items/{id}` | Ładniej grupuje, ale tworzy „pusty" dokument-rodzica, który w konsoli wyświetla się szarym kursywą i bywa mylący |
| Kolejne dokumenty w `dataslate` | `dataslate/ulubione-1`, `-2`, … | **Odrzucone** — wymagałoby otwarcia całej kolekcji `dataslate`, czyli cofnięcia tego, co właśnie zawężamy |

**Dlaczego `{document=**}`, skoro w tym kroku właśnie usuwamy takie zapisy?** Bo to nie to samo miejsce. `{document=**}` na kolekcji `dataslate` było groźne, bo w tej kolekcji leży kanał na żywo — i faktycznie udało mi się dopisać tam obcy dokument (rozdz. 9.2 audytu). Kolekcja `dataslate_favorites` jeszcze nie istnieje, będzie zawierać wyłącznie Twoje zapisane wiadomości i nic poza modułem Infoczytnika nie będzie z niej korzystać. Zapis z gwiazdką oznacza tu: *„cokolwiek zbudujesz w środku tej jednej szuflady, reguła to obejmie"* — więc przy programowaniu list ulubionych **nie będziesz musiał w ogóle wracać do reguł**, także jeśli struktura okaże się zagnieżdżona.

Jeżeli wolisz wariant maksymalnie ścisły, zamień tę jedną linię na `match /dataslate_favorites/{id}` — obsłuży płaską listę dokumentów, ale przy zagnieżdżeniu trzeba będzie regułę poprawić.

> **Co przekazać przy programowaniu list ulubionych:** kolekcja nazywa się `dataslate_favorites`, jeden dokument = jedna zapisana wiadomość, a pola nazwy i kolejności (`nazwa`, `kolejnosc`) trzymamy w samym dokumencie — dzięki temu nie potrzeba osobnego dokumentu z indeksem i nie ma czego synchronizować. Dokument `dataslate/current` zostaje bez zmian i nadal działa tak jak dziś, zgodnie z punktem 5d z `DoZrobienia.md`.

**Projekt `audiorpg-2eb6f`:**

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Ulubione zestawy GeneratorNPC / GeneratorNPC favourite sets
    match /generatorNpc/favorites { allow read, write: if true; }

    // Ustawienia modułu Audio / Audio module settings
    match /audio/favorites { allow read, write: if true; }

    // Regula dla DS2/progress usunieta - projekt zakonczony, kolekcja skasowana
    // The DS2/progress rule is gone - project finished, collection deleted

    match /{document=**} { allow read, write: if false; }
  }
}
```

**Co to daje już teraz.** Obcy nadal może czytać i nadpisywać te pięć dokumentów — na to dopiero App Check. Ale **przestaje móc tworzyć w Twojej bazie dowolne nowe dokumenty**, a to jest dokładnie to, co udało mi się zrobić w teście z rozdz. 9.2 audytu. Znika też martwa reguła po Dark Souls II.

**Jak sprawdzić, że nic nie ucierpiało.** Po kliknięciu *Publish* otwórz z adresu internetowego: Infoczytnik (panel GM wyślij testową wiadomość), oba Kreatory Postaci, GeneratorNPC (dodaj i usuń ulubiony zestaw) i moduł Audio. Jeśli któryś przestanie działać — w zakładce **Rules** jest historia i powrót to jedno kliknięcie.

> ✅ **Rozbudowa Infoczytnika o listy ulubionych jest już uwzględniona.** Reguła dla `dataslate_favorites` czeka gotowa, więc przy tamtej pracy nie trzeba wracać do tego pliku ani do konsoli Firebase. Jedyne, o czym trzeba pamiętać, to trzymać się tej nazwy kolekcji.

---

## 5. KROK 1 — utwórz klucz reCAPTCHA (dla każdego projektu osobno)

Robisz to w **Google Cloud**, nie w Firebase. To ta sama firma i to samo logowanie, tylko inna strona.

1. Wejdź na **https://console.cloud.google.com/security/recaptcha**
   Zaloguj się tym samym kontem Google, na którym masz Firebase.
2. **Na samej górze strony sprawdź, który projekt jest wybrany.** Ma tam być `wh40k-data-slate` (albo `audiorpg-2eb6f`, jeśli robisz właśnie drugi). Jeśli jest inny — kliknij i wybierz właściwy z listy.
   *To najczęstszy błąd na tym etapie: utworzenie klucza w niewłaściwym projekcie.*
3. Jeśli konsola poprosi o włączenie API (przycisk **Enable** przy „reCAPTCHA Enterprise API") — kliknij i poczekaj kilkanaście sekund.
   - **To nie włącza płatności.** Projekt bez płatności dostaje darmowy tryb *Essentials*.
   - Gdyby Google poprosił o kartę płatniczą — zatrzymaj się i daj znać. Nie powinien.
4. Kliknij **Create key** (Utwórz klucz).
5. Wypełnij formularz:

   | Pole | Co wpisać |
   |---|---|
   | **Display name** | `WrathAndGlory-DataSlate` (dla drugiego projektu: `WrathAndGlory-AudioRPG`) |
   | **Application type / Platform** | **Website** / **Web** |
   | **Domains** | kliknij *Add a domain* i wpisz dokładnie: `cutelittlegoat.github.io` |

   - Wpisujesz **samą domenę** — bez `https://`, bez `/WrathAndGlory`, bez ukośnika na końcu.
   - **Sprawdzanie domen zostaw włączone.** Jeśli zobaczysz przełącznik *„Do not verify domains"* — **nie włączaj go**.
   - **`localhost` NIE dodawaj.** Do testów z dysku jest osobny mechanizm — patrz rozdział 10.
   - Jeśli zobaczysz opcję **„Use checkbox challenge"** (zaznaczanie „nie jestem robotem") — **zostaw niezaznaczoną**. App Check potrzebuje klucza działającego w tle, bez pokazywania czegokolwiek graczom.
   - Sekcji „Additional settings" nie ruszaj.
6. Kliknij **Create key**.
7. Na liście pojawi się Twój klucz. **Skopiuj jego identyfikator** — długi ciąg zaczynający się od `6L…`. Wklej go do notatnika i podpisz, do którego projektu należy.

**Powtórz cały krok 1 dla drugiego projektu.** Na koniec masz mieć **dwa różne klucze**.

> **Czy ten klucz to sekret?** Nie. To tzw. *klucz witryny* i jest jawny z założenia — dokładnie tak samo jak `apiKey`, który już jest w repozytorium. Może spokojnie trafić do kodu. W wariancie Enterprise nie ma żadnego „klucza tajnego", więc nie da się ich pomylić.

---

> 🔶 **W projekcie `wh40k-data-slate` jest druga aplikacja — zignoruj ją.** Na liście *Apps* obok zarejestrowanej `DataSlate (Web App)` stoi `Kozi Przybornik` (`com.cutelittlegoat.wrathandglory`) z przyciskiem **Register** i statusem „–".
>
> To pozostałość po **zamkniętym projekcie powiadomień push** (dokumentacja: `WebView_FCM_Cloudflare_Worker/`). Potwierdziłeś, że projekt nie będzie kontynuowany. **Nigdy nie klikaj tam „Register"** — nie ma czego rejestrować, a rejestracja aplikacji Android i tak wymagałaby innego dostawcy niż reCAPTCHA (Play Integrity).
>
> Wymuszanie z kroku 5 dotyczy wyłącznie **Cloud Firestore** i **Realtime Database**, więc ta aplikacja nie ma z nim żadnego związku. Napis „Register remaining apps to get all the benefits of App Check" u góry ekranu możesz spokojnie zamknąć przyciskiem **Dismiss** — nie zniknie sam, dopóki jakaś aplikacja jest niezarejestrowana.
>
> *Opcjonalnie, kiedyś:* skoro projekt jest zamknięty, tę aplikację można w ogóle usunąć z Firebase (Ustawienia projektu → Twoje aplikacje → **⋮** → Usuń aplikację). Zniknie wtedy i z listy App Check, i z ostrzeżenia. To nie jest konieczne i nie wpływa na nic w WrathAndGlory — decyzja należy do Ciebie, a folder `WebView_FCM_Cloudflare_Worker/` jest chroniony i niczego w nim nie ruszam.

## 6. KROK 2 — zarejestruj aplikację w App Check (dla każdego projektu osobno)

Teraz wracasz do **Firebase Console**.

1. Wejdź na **https://console.firebase.google.com** i wybierz projekt **WH40k-Data-Slate**.
2. W lewym menu kliknij **App Check**. (Masz go w skrótach projektu — widać na Twoim zrzucie ekranu.)
3. Zobaczysz ekran powitalny z przyciskiem **Get started**. Kliknij go.
   *Jeśli zamiast tego od razu widzisz listę — przejdź do zakładki **Apps**.*
4. Na liście aplikacji znajdź swoją aplikację webową (ikona `</>`), tę o identyfikatorze kończącym się na `…9eb27e2ed29109ac838fad`.
   *Identyfikator sprawdzisz w: **Settings → Project settings → General → Your apps**.*
5. Kliknij **Register** przy tej aplikacji.
6. Zobaczysz do wyboru dostawców. Kliknij `+` przy **reCAPTCHA Enterprise** (górna pozycja).
   - **Wybierasz Enterprise, nie zwykłą reCAPTCHA.** Google wycofuje tę drugą i konsola może już nie pozwolić jej użyć.
7. W polu na klucz wklej **klucz witryny z kroku 1** — ten zaczynający się od `6L…`, właściwy dla tego projektu.
   - Jeśli pole jest nieaktywne — odśwież stronę klawiszem **F5**. Konsola czasem musi „zobaczyć", że klucz w Google Cloud już istnieje.
8. **Advanced settings** — zostaw domyślne. Ustawienie *App risk: Medium (0.5)* jest w porządku i mieści się w darmowym planie. **Nie podnoś go** — grozi to blokowaniem własnych graczy.
9. Pole **Token time to live (TTL)** — ustaw **`1`** + **`days`**.
   - Domyślnie konsola proponuje 1 godzinę. Dzień jest lepszy: mniej sprawdzeń, więcej zapasu w darmowym limicie.
   - Dopuszczalny zakres to od 30 minut do 7 dni.
10. Kliknij **Save**.

**Powtórz cały krok 2 dla drugiego projektu**, wklejając **jego** klucz (nie ten sam!).

> **Nie klikaj jeszcze niczego o nazwie „Enforce" ani „Wymuś".** Do tego wracamy w kroku 5.

Po zapisaniu przy aplikacji pojawi się status **Registered**. Na tym etapie **nic się jeszcze nie zmieniło** — App Check tylko istnieje, ale niczego nie sprawdza.

---

## 7. KROK 3 — zmiany w kodzie aplikacji

> ⚠️ **Przeczytaj najpierw sprostowanie na końcu tego rozdziału** — moduły nie są w tej sprawie równe i dwa z nich wymagają dodatkowej pracy.

> ### ▶️ Ten krok jest ODBLOKOWANY od 14 września
> Wstrzymanie zostało zdjęte: wszystkie pytania mają odpowiedzi, a ostatnia decyzja techniczna — wersja Firebase w Kreatorach Postaci — zapadła (wariant **W3**, patrz rozstrzygnięcie na końcu tego rozdziału). Kroki 1 i 2 są wykonane, krok 0 też. Ten rozdział opisuje zakres pracy w kodzie.

Do każdego modułu, który łączy się z Firebase, trzeba dopisać kilka linii uruchamiających App Check. Modułów jest sześć:

| Moduł | Plik | Wersja Firebase |
|---|---|---|
| DataVault | `shared/firebase-data-loader.js` | nowoczesna (12.6.0) |
| GeneratorNPC | `GeneratorNPC/index.html` | nowoczesna (12.6.0) |
| Audio | `Audio/index.html` | nowoczesna (12.6.0) |
| Infoczytnik — panel GM | `Infoczytnik/GM_test.html` | zgodnościowa **9.6.8** — bez zmiany wersji |
| Infoczytnik — ekran gracza | `Infoczytnik/Infoczytnik_test.html` | zgodnościowa **9.6.8** — bez zmiany wersji |
| Kalkulator — Prosty Kreator | `Kalkulator/TworzeniePostaci.html` | zgodnościowa 8.10.1 → **12.6.0 compat** |
| Kalkulator — Zaawansowany Kreator | `Kalkulator/TworzeniePostaci_v2-firebase.js` | zgodnościowa 8.10.1 → **12.6.0 compat** |

**Ważne dwie rzeczy:**

1. **Aplikacja używa trzech różnych wersji biblioteki Firebase** — 12.6.0 w zapisie nowoczesnym, 9.6.8 w zgodnościowym i 8.10.1 w zgodnościowym. Obsługę App Check trzeba więc napisać w dwóch odmianach (nowoczesnej i zgodnościowej), a w dwóch plikach Kreatorów dodatkowo podnieść wersję. To nie jest trudne, ale podwaja pracę i podwaja liczbę miejsc do sprawdzenia.
2. **Infoczytnik ma własną zasadę pracy** (`Infoczytnik/AGENTS.md`): zmiany wolno robić **wyłącznie** w plikach `GM_test.html` i `Infoczytnik_test.html`, z aktualizacją `INF_VERSION` w obu na ten sam znacznik czasu. Pliki produkcyjne (`GM.html`, `Infoczytnik.html`) aktualizujesz ręcznie Ty.
   **Jeśli o tym zapomnisz, po włączeniu wymuszania produkcyjny Infoczytnik przestanie działać, a testowy będzie działał** — i to jest dokładnie ten rodzaj usterki, który najtrudniej zdiagnozować.

**Gdzie trafią klucze witryny — ustalone 14 września.** Oba klucze idą do **jednego pliku w `shared/`**, wspólnego dla całej aplikacji, a nie do plików konfiguracyjnych poszczególnych modułów. Powód jest praktyczny: klucz jest przypisany do projektu Firebase, a projekty są dwa i korzysta z nich sześć modułów. Przy powieleniu kluczy po modułach każda przyszła zmiana klucza albo domeny wymagałaby edycji pięciu plików i pamiętania, który należy do której pary — a to jest dokładnie ten sam problem, który audyt opisuje w rozdz. 6.2 dla plików `firebase-config.js`. Nie powielamy go przy okazji App Check.

*(Wcześniejsza wersja tego akapitu mówiła o dopisaniu kluczy do `shared/firebase-config.js`, `GeneratorNPC/config/firebase-config.js` i `Audio/config/firebase-config.js`. Nie obowiązuje.)*

---

> 🔺 **Sprostowanie z 14 września — jeden z modułów wymaga więcej niż dopisania kodu.** Twoje klucze to reCAPTCHA **Enterprise**, a nie reCAPTCHA v3, i nie każda wersja Firebase to obsługuje. Sprawdziłem trzy wersje realnym uruchomieniem w przeglądarce:
>
> | Wersja Firebase | Obsługa reCAPTCHA Enterprise | Kto jej używa |
> |---|:---:|---|
> | 12.6.0 | ✅ | DataVault, GeneratorNPC, Audio |
> | 9.6.8 | ✅ | Infoczytnik |
> | 8.10.1 | ❌ | **oba Kreatory Postaci** |
>
> Czyli cztery z sześciu modułów są gotowe na App Check od ręki. **Oba Kreatory Postaci wymagają najpierw podniesienia wersji biblioteki** — bez tego nie da się w nich użyć Twoich kluczy. Sprawdziłem, że całe API, którego te pliki używają, działa tak samo w 9.6.8 i w 12.6.0, więc podniesienie jest wykonalne; wybór wersji i ocena ryzyka są w audycie, rozdz. 9.8, sprostowanie z 14 września.
>
> **Dla Ciebie w praktyce:** krok 3 nie jest jednym zadaniem, tylko trzema, i Kreatory Postaci wejdą do obserwacji później niż reszta. Nie włączaj wymuszania (krok 5), dopóki **wszystkie sześć** modułów nie będzie wysyłać znaczników — inaczej Kreatory przestaną działać.

---

> 🔻 **Rozstrzygnięcie z 14 września — Kreatory Postaci idą na 12.6.0 compat (wariant W3).**
>
> Weryfikacja została powtórzona niezależnie i pokazała, że **możliwości są trzy, nie dwie**. Wersja 12.6.0 ma — obok plików w zapisie nowoczesnym — także pliki w zapisie zgodnościowym, czyli dokładnie takim, jakiego oba Kreatory używają dziś. Sprawdzone uruchomieniem: obsługują reCAPTCHA Enterprise i przyjmują ten sam zapis co dotąd.
>
> **Co to znaczy w praktyce:** podniesienie wersji **nie wymaga przepisywania** sposobu zapisu i odczytu postaci. Zmieniają się nazwy i wersja wczytywanych plików biblioteki, i tyle. Sposób działania obu Kreatorów pozostaje bez zmian.
>
> **Wybrałeś ten wariant**, uzasadniając to tym, że masz backup całego repozytorium: *„Jak coś przestanie działać to będziemy porównywać z backupem."*
>
> | | Dziś | Po zmianie |
> |---|---|---|
> | Wersja | 8.10.1 | **12.6.0** |
> | Plik z podstawą biblioteki | `firebase-app.js` | `firebase-app-compat.js` |
> | Plik z obsługą bazy | `firebase-firestore.js` | `firebase-firestore-compat.js` |
> | Plik z App Check | — | `firebase-app-check-compat.js` *(nowy)* |
>
> ⚠️ **Uwaga, która ratuje przed najłatwiejszym błędem:** samo podmienienie numeru wersji w adresie **nie zadziała**. Od wersji 9 plik `firebase-app.js` to zupełnie inny rodzaj pliku — sprawdziłem, wczytany po staremu daje błąd w konsoli i przyciski zapisu oraz wczytania postaci przestają cokolwiek robić. Muszą się zmienić także nazwy plików, tak jak w tabeli wyżej.
>
> Pełne wyniki sprawdzenia — łącznie z testem zapisu i odczytu obu dokumentów postaci we wszystkich trzech wersjach — są w audycie, rozdz. 9.8, „Rozstrzygnięcie z 14 września".


## 8. KROK 4 — obserwacja (kilka dni)

Ten krok polega głównie na czekaniu, ale **nie wolno go pominąć**.

1. Otwórz aplikację **z adresu internetowego**: `https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html`
   *(nie z pliku na dysku — o tym w rozdziale 10)*
2. Pokorzystaj z niej normalnie: wejdź do DataVault, zaloguj się Litanią Dostępu, otwórz kilka zakładek, otwórz GeneratorNPC, wyślij testową wiadomość z panelu GM.
3. Wróć do Firebase Console → **App Check** → zakładka **APIs**.
4. Kliknij **Cloud Firestore**, potem **Realtime Database**.
5. Na wykresie interesuje Cię, żeby rosła liczba **zweryfikowanych** (*Verified*), a nie *Unverified*.

**Szybka kontrola w przeglądarce (opcjonalnie):** naciśnij **F12** → zakładka **Console**. Jeśli zobaczysz czerwony błąd zawierający `appCheck` albo `recaptcha` — coś jest nie tak z kluczem albo z domeną. Najczęstsza przyczyna: w kluczu w Google Cloud brakuje domeny `cutelittlegoat.github.io` albo klucz został wklejony z literówką.

**Daj temu działać kilka dni normalnego użytkowania**, żeby wszyscy gracze zdążyli wejść na nową wersję strony. Dopiero gdy praktycznie cały ruch jest zweryfikowany, przechodzisz dalej.

### 8a. Jak czytać wykres — cztery kategorie nie są równoważne *(dopisane 20 września)*

Na ekranie metryk są cztery pozycje i **każda znaczy co innego**. Przy podejmowaniu decyzji o wymuszaniu to jest ważniejsze niż sam procent zweryfikowanych.

| Kategoria | Co dokładnie znaczy | Jak to traktować |
|---|---|---|
| **Verified** (niebieski) | Zapytanie przyszło z poprawnym znacznikiem | To, do czego dążysz |
| **Outdated client** (pomarańczowy) | Znacznika brak, ale zapytanie wygląda na wysłane przez bibliotekę Firebase | Zwykle strona z pamięci podręcznej przeglądarki, sprzed wgrania App Check. Najłagodniejsza z trzech — mija sama, gdy ludzie odświeżą stronę |
| **Unknown origin** (różowy) | Znacznika brak i zapytanie nie wygląda na wysłane przez bibliotekę Firebase | Obcy program albo zapytanie wysłane „ręcznie". Dokładnie to, co App Check ma odcinać |
| **Invalid** (turkusowy) | Znacznik **był wysłany, ale został odrzucony** | Najważniejsza do zrozumienia. Nie jest przypadkowa: ktoś miał klucz i dostał znacznik, tylko ten znacznik nie pasował |

> 🔍 **Najważniejsza zasada przy czytaniu wykresu: patrz na datę, nie na sumę.** Okno *Last 7 days* obejmuje też dni **sprzed** wgrania kodu, więc pokazuje historię, a nie stan bieżący. Zanim zdecydujesz, przestaw zakres dat na **Last 24 hours** — dopiero to mówi, jak jest teraz. Przy Firestore w projekcie `wh40k-data-slate` różnica wyniosła 80% w oknie 7-dniowym wobec **100% w oknie 24-godzinnym**, a cały kolorowy ruch okazał się garbem z 14–16 września, czyli z okna wdrożenia kodu.

> ⚠️ **Kategoria *invalid* po włączeniu wymuszania znaczy co innego niż przed.** Przed wymuszaniem, w trakcie wdrożenia, jest niegroźna: najczęstsza przyczyna to otwieranie strony **z pliku na dysku** albo z adresu spoza domeny wpisanej do klucza (rozdz. 10) — reCAPTCHA wystawia wtedy znacznik, którego App Check nie uznaje. Ale jeśli *invalid* pojawi się **po** wymuszeniu, przy normalnym korzystaniu z adresu internetowego, to nie jest przypadek, tylko sygnał, że coś jest nie tak **z kluczem albo z domeną** — i wtedy szukasz w Google Cloud, a nie w regułach bazy.

---

## 9. KROK 5 i 6 — włączenie ochrony

### Krok 5 — wymuszanie

> ### ✅ WYKONANE 20 września — wymuszanie włączone w trzech miejscach
>
> | Projekt | Usługa | Status |
> |---|---|---|
> | `wh40k-data-slate` | **Realtime Database** | ✅ *Enforced* |
> | `wh40k-data-slate` | **Cloud Firestore** | ✅ *Enforced* |
> | `wh40k-data-slate` | Authentication *(PREVIEW)* | ⏸️ *Monitoring* — świadomie, rozdz. 9a |
> | `audiorpg-2eb6f` | **Cloud Firestore** | ✅ *Enforced* |
> | `audiorpg-2eb6f` | Realtime Database | — nieużywana, nic do wymuszania |
>
> **Metryki, na podstawie których zapadła decyzja** (odczyt z 20 września; okno 7-dniowe obejmuje dni sprzed wgrania kodu, dlatego liczy się kolumna 24-godzinna):
>
> | Usługa | Ostatnie 7 dni | Ostatnie 24 h | Rozbicie niezweryfikowanych w oknie 7-dniowym |
> |---|---|---|---|
> | RTDB, `wh40k-data-slate` | 96% (45/47) | — | outdated client 2, unknown origin 0, invalid 0 |
> | Firestore, `wh40k-data-slate` | 80% (141/177) | **100% (17/17)** | outdated client 7, unknown origin 15, invalid 14 |
> | Authentication, `wh40k-data-slate` | 96% (27/28) | — | unknown origin 1, reszta 0 |
> | Firestore, `audiorpg-2eb6f` | 84% | *nie odczytano* | *nie odczytano — ekran APIs pokazuje tylko sumę* |
>
> Cały kolorowy ruch na wykresach mieści się w garbie **14–16 września**, czyli w oknie wdrażania kodu. Od 17 września jest czysto, a okno 24-godzinne dla Firestore pokazało 100% zweryfikowanych przy zerze w każdej z trzech pozostałych kategorii. Jak czytać te kategorie — rozdz. 8a.

To jest moment, w którym baza faktycznie zaczyna odrzucać obce programy.

**W projekcie `wh40k-data-slate`:**
1. Firebase Console → **App Check** → zakładka **APIs**.
2. Kliknij **Cloud Firestore** → **Enforce** → potwierdź.
3. Kliknij **Realtime Database** → **Enforce** → potwierdź.

**W projekcie `audiorpg-2eb6f`:**
4. To samo, ale **tylko Cloud Firestore** (ten projekt nie używa Realtime Database).

Po każdym kliknięciu **sprawdź aplikację**: otwórz DataVault i GeneratorNPC z adresu internetowego i zobacz, czy dane się ładują. Jeśli nie — **Unenforce** i wracamy do diagnozy.

> ### 🔻 Runda sprawdzająca po włączeniu wymuszania *(dopisane 20 września)*
>
> Dwa moduły — **GeneratorNPC** i **Audio** — należą do projektu `audiorpg-2eb6f`, którego metryki 24-godzinnej nie odczytano przed kliknięciem *Enforce*. Dlatego pierwsza runda po wymuszeniu jest tam ważniejsza niż gdzie indziej. Wszystko z **adresu internetowego**, nie z dysku:
>
> | Moduł | Co zrobić | Czego dotyczy |
> |---|---|---|
> | DataVault | zaloguj się Litanią Dostępu, otwórz kilka zakładek z danymi | RTDB + Auth, `wh40k-data-slate` |
> | Infoczytnik | wyślij wiadomość z panelu GM i sprawdź, czy pojawia się na ekranie gracza | Firestore, `wh40k-data-slate` |
> | Prosty Kreator Postaci | zapisz postać i wczytaj ją z powrotem | Firestore, `wh40k-data-slate` |
> | Zaawansowany Kreator Postaci | to samo — zapis i wczytanie | Firestore, `wh40k-data-slate` |
> | **GeneratorNPC** | dodaj i usuń ulubiony zestaw | Firestore, `audiorpg-2eb6f` |
> | **Audio** | zmień i zapisz ustawienia modułu | Firestore, `audiorpg-2eb6f` |
>
> Infoczytnik sprawdzaj w wersji **produkcyjnej** (`GM.html`, `Infoczytnik.html`), a nie testowej — to jest ta pułapka z rozdz. 7. Na 20 września pliki produkcyjne i testowe są identyczne i mają to samo `INF_VERSION = 2026-09-14_11-12-07`, ale sprawdzenie i tak rób na produkcyjnych.

> ⚠️ **Wymuszaj tylko te dwie pozycje.** W zakładce *APIs* będą też inne usługi, m.in. **Firebase Cloud Messaging**, **Storage**, **Firebase AI Logic** i **SQL Connect**. Zostaw je bez wymuszania — nie korzysta z nich żaden moduł WrathAndGlory, a włączanie ochrony tam, gdzie nie ma czego chronić, tylko utrudnia późniejszą diagnozę. Przy nieużywanych usługach konsola i tak nie pokazuje przycisku, tylko napis *„Start using … to enable App Check"*.
>
> **Jeden wyjątek wymaga osobnego namysłu: Authentication.** To jedyna z pozostałych pozycji, z której aplikacja **naprawdę korzysta** (Litania Dostępu w DataVault), więc argument „nie ma czego chronić" jej nie dotyczy. Dlatego dostała własny rozdział — **9a**.

### Krok 6 — zawężenie reguł bazy

Dopiero **po** kroku 5. Reguły z warunkiem `request.app != null` same w sobie są wymuszaniem, więc wgranie ich wcześniej wyłączyłoby aplikację.

Ścieżka: Firebase Console → **Firestore Database** → zakładka **Rules** → wklej → **Publish**.

Gotowe reguły są w `Analizy/audyt-kodu-aplikacji-2026-09-10.md`, rozdz. 9.8. W skrócie zmieniają się trzy rzeczy:

- warunek `if true` (wpuść każdego) zamienia się na `if request.app != null` (wpuść tylko moją aplikację),
- reguły dla `dataslate` i `character_builder` zawężają się z całych kolekcji do konkretnych dokumentów, z których aplikacja naprawdę korzysta,
- z drugiego projektu znika reguła dla `DS2/progress` — projekt Dark Souls II jest zakończony, kolekcja usunięta, a w kodzie WrathAndGlory nie ma do niej żadnego odwołania (sprawdzone).

> Firebase trzyma historię reguł, więc powrót do poprzedniej wersji to jedno kliknięcie w zakładce **Rules**.

> 🔻 **Uzupełnienie z 20 września — krok 6 dotyczy wyłącznie Firestore, i to jest w porządku.** Reguły Realtime Database to osobny język, w którym **nie istnieje odpowiednik `request.app`**. Dla RTDB App Check włącza się wyłącznie przełącznikiem w konsoli — a ten jest już włączony. Czyli po stronie Realtime Database **nie ma nic więcej do zrobienia**: temat jest domknięty przełącznikiem z kroku 5. Krok 6 zostaje do wykonania w dwóch miejscach: reguły Firestore w `wh40k-data-slate` i reguły Firestore w `audiorpg-2eb6f`.

> ### ▶️ Od 20 września to jest **jedyny pozostały krok** — i wreszcie wolno go zrobić
>
> Blokada, która wywróciła próbę z 14 września, zniknęła. Wtedy reguły z `request.app != null` zostały wgrane, **zanim** kod zaczął wysyłać znaczniki, i wszystkie pięć dokumentów zaczęło zwracać `403` (opis zdarzenia: audyt, rozdz. 9.8). Dziś kod wysyła znaczniki, wymuszanie jest włączone, a metryki pokazują 100% zweryfikowanych — czyli warunek, którego wtedy brakowało, jest spełniony.
>
> Zawężenie ścieżek i skasowanie `DS2/progress` masz już zrobione w kroku 0. **Do wykonania zostaje wyłącznie podmiana `if true` na wywołanie `zAplikacji()`** w dwóch miejscach. Gotowy tekst do wklejenia:
>
> **`wh40k-data-slate`** → Firestore Database → Rules → zaznacz całość → wklej → **Publish**:
>
> ```
> rules_version = '2';
>
> service cloud.firestore {
>   match /databases/{database}/documents {
>
>     // Zapytanie musi nieść ważny znacznik App Check, czyli musi pochodzić
>     // z zarejestrowanej aplikacji WrathAndGlory.
>     // The request must carry a valid App Check token, i.e. it must originate
>     // from the registered WrathAndGlory application.
>     function zAplikacji() { return request.app != null; }
>
>     // Kanał panelu GM -> ekran Infoczytnika / GM panel -> reader screen channel
>     match /dataslate/current { allow read, write: if zAplikacji(); }
>
>     // Zapisane wiadomości Infoczytnika (listy ulubionych), przygotowane z góry
>     // Saved reader messages (favourite lists), reserved in advance
>     match /dataslate_favorites/{document=**} { allow read, write: if zAplikacji(); }
>
>     // Prosty Kreator Postaci / Simple character creator
>     match /character_builder/current { allow read, write: if zAplikacji(); }
>
>     // Zaawansowany Kreator Postaci / Advanced character creator
>     match /character_builder/v2 { allow read, write: if zAplikacji(); }
>
>     // Wszystko inne pozostaje niedostępne / Everything else stays inaccessible
>     match /{document=**} { allow read, write: if false; }
>   }
> }
> ```
>
> **`audiorpg-2eb6f`** → to samo miejsce:
>
> ```
> rules_version = '2';
>
> service cloud.firestore {
>   match /databases/{database}/documents {
>
>     function zAplikacji() { return request.app != null; }
>
>     // Ulubione zestawy GeneratorNPC / GeneratorNPC favourite sets
>     match /generatorNpc/favorites { allow read, write: if zAplikacji(); }
>
>     // Ustawienia modułu Audio / Audio module settings
>     match /audio/favorites        { allow read, write: if zAplikacji(); }
>
>     match /{document=**} { allow read, write: if false; }
>   }
> }
> ```
>
> **Po wklejeniu przejdź rundę sprawdzającą z rozdz. 9** — te reguły dotyczą pięciu dokumentów w czterech modułach, a błąd w nich objawia się odmową zapisu, nie białą stroną.
>
> 🔻 **Nie zapomnij o kopiach w repozytorium.** Pliki `shared/firestore-wh40k-data-slate.rules` i `shared/firestore-audiorpg.rules` zawierają dziś wersję z kroku 0, czyli z `if true`. Po wgraniu nowych reguł w konsoli **trzeba poprawić oba pliki**, inaczej repozytorium będzie pokazywać nieaktualny stan bazy — a to jest dokładnie ten rodzaj rozjazdu, który później myli przy diagnozie.

> 💡 **Dwie z tych trzech zmian możesz zrobić choćby dziś, przed całą resztą.** Zawężenie reguł do konkretnych dokumentów i skasowanie `DS2/progress` **nie psuje niczego** — aplikacja i tak korzysta wyłącznie z `dataslate/current`, `character_builder/current`, `character_builder/v2`, `generatorNpc/favorites` i `audio/favorites`. Zostawiasz na razie `if true` i zmieniasz tylko ścieżki. Zyskujesz tyle, że obcy nie może już tworzyć w Twojej bazie dowolnych nowych dokumentów — a że może, jest sprawdzone (rozdz. 9.2 audytu). Warunek `request.app != null` dopisujesz dopiero tutaj, w kroku 6.

---

## 9a. Authentication — dlaczego zostaje na *Monitoring* *(dopisane 20 września)*

W zakładce *APIs* projektu `wh40k-data-slate` jest też pozycja **Authentication** z etykietą `PREVIEW`. Jej metryki wyglądają dobrze — 27/28 zweryfikowanych, zero *invalid*, jeden *unknown origin* z 15 września, czyli z tego samego garbu wdrożeniowego co reszta. Mimo to **20 września świadomie jej nie wymuszono.** Poniżej powód, żeby za pół roku nie zastanawiać się, czy to przeoczenie.

### To nie jest ten sam przypadek co Cloud Messaging

Instrukcja mówi „zostaw pozostałe usługi w spokoju", ale uzasadnia to tym, że **nic z nich nie korzysta**. Z Authentication aplikacja korzysta naprawdę: Firebase Auth występuje w całym repozytorium w dokładnie jednym miejscu — `shared/firebase-data-loader.js` (`signInWithEmailAndPassword`), czyli **Litania Dostępu w DataVault**. Nie ma go w żadnym innym module.

Wymuszanie na Authentication dałoby więc realną korzyść: **ochronę przed zgadywaniem hasła do Litanii przez obcy skrypt.** Tego nie załatwia ani wymuszanie na Firestore, ani zawężone reguły bazy. Więc to jest „kiedyś tak", a nie „nigdy".

### Cztery powody, dla których to osobny termin, a nie ten sam klik

1. **Awaria byłaby całkowita, nie częściowa.** Gdy wymuszanie na Firestore coś zepsuje, przestaje działać zapis postaci albo wiadomość w Infoczytniku — ale widzisz aplikację i widzisz błąd. Gdy zepsuje się Authentication, **nie wejdziesz do DataVault w ogóle**, bo nie ma się gdzie zalogować.
2. **Trzy przyciski naraz to zgadywanka przy diagnozie.** Gdy po kliknięciu wszystkich trzech coś przestaje działać, nie wiadomo, który z nich odpowiada.
3. **Skutek może być opóźniony — i to jest najważniejszy powód.** Kod ustawia `browserLocalPersistence`, czyli raz zalogowany zostaje zalogowany. Po kliknięciu *Enforce* otworzyłbyś DataVault, zobaczył, że działa, i uznał temat za zamknięty — bo Twoja sesja już trwa i nikt nie pyta o hasło. Usterka ujawniłaby się dopiero **przy następnym prawdziwym logowaniu**, u kogoś innego i kilka godzin później. *(Czy wymuszanie obejmuje też odnawianie trwającej sesji, czy wyłącznie samo logowanie — nie zostało sprawdzone. W wersji `PREVIEW` nie ma sensu tego zgadywać.)*
4. **Etykieta `PREVIEW`.** Wersja zapoznawcza — zachowanie może się zmienić bez uprzedzenia.

### Jak to zrobić, kiedy już przyjdzie pora

Najwcześniej kilka dni po tym, jak Firestore i RTDB okażą się stabilne, i **w momencie, w którym masz kwadrans na sprawdzenie** — nie przed wyjściem z domu.

1. Firebase Console → App Check → APIs → **Authentication** → **Enforce**.
2. Sprawdź logowanie **w oknie prywatnym przeglądarki**. To jedyny sposób, żeby wymusić prawdziwe logowanie zamiast odtworzenia sesji, która już trwa — zwykłe okno nic nie udowodni.
3. Sprawdź też z telefonu, gdzie masz osobną sesję.
4. Pamiętaj, że od tego momentu logowanie ze strony otwartej z dysku przestanie działać tak samo jak reszta (rozdz. 10).

Odwrót jest ten sam co wszędzie: **Unenforce** działa natychmiast.

---

## 10. Praca z dysku po włączeniu wymuszania

Po kroku 5 otwarcie pliku HTML **bezpośrednio z dysku przestanie działać** — reCAPTCHA nie rozpozna takiego „adresu". Jeśli tak testujesz, potrzebny jest tzw. token debugowania:

1. Otwórz aplikację lokalnie i naciśnij **F12** → zakładka **Console**.
2. Znajdź komunikat z długim tokenem (ciąg cyfr i liter z myślnikami). Skopiuj go.
3. Firebase Console → **App Check** → **Apps** → przy swojej aplikacji kliknij **⋮** → **Manage debug tokens** → **Add debug token**, wklej i nadaj nazwę.

> 🔴 **Tego tokenu nie wrzucaj do repozytorium.** Działa jak przepustka omijająca App Check, a repozytorium `WrathAndGlory` jest publiczne. Najbezpieczniej: testuj wyłącznie na adresie internetowym i w ogóle nie używaj tokenu debugowania.

---

## 11. Na co uważać

| Rzecz | Co warto wiedzieć |
|---|---|
| **Darmowy limit** | 10 000 sprawdzeń miesięcznie na projekt. Przy TTL ustawionym na 1 dzień i kilku graczach to około 1 000–1 500 sprawdzeń — mieścisz się z dużym zapasem |
| **Po przekroczeniu limitu** | Przy **włączonym** wymuszaniu aplikacja przestałaby działać do końca miesiąca. Ratunek: **Unenforce** |
| **Zmiana adresu strony** | Gdybyś kiedyś przeszedł na własną domenę, trzeba dopisać ją do klucza w Google Cloud, inaczej aplikacja przestanie działać pod nowym adresem |
| **Klucz w repozytorium** | To nie jest wyciek. Klucz witryny jest jawny z założenia, tak samo jak `apiKey` |
| **Własne skrypty pomocnicze** | Po włączeniu wymuszania każde narzędzie spoza aplikacji przestanie działać — łącznie z ewentualnymi Twoimi skryptami sięgającymi do bazy |
| **Generowanie danych DataVault** | Bez zmian. Tryb admina czyta plik XLSX z dysku i tworzy pliki lokalnie — nie dotyka bazy. Import do Firebase robisz z konsoli, a konsola nie podlega App Check |
| **Strona z pamięci podręcznej** | Kto ma otwartą starą wersję strony sprzed 14 września, zostanie odcięty do czasu odświeżenia. Lekarstwo: **Ctrl+F5**. Infoczytnik radzi sobie z tym sam (`INF_VERSION`), DataVault nie ma takiego mechanizmu |
| **Blokada reCAPTCHA w przeglądarce** | Dodatek blokujący reklamy albo filtr w sieci może zablokować adres `google.com/recaptcha`. Skutek po wymuszaniu: moduł przestaje zapisywać dane, choć wygląda na sprawny. Szczegóły w rozdz. 11a |

---

## 11a. Gdy coś przestanie działać — pierwszy podejrzany *(dopisane 20 września)*

**App Check jest w kodzie celowo „niekrytyczny".** Gdy biblioteka reCAPTCHA się nie wczyta, kod zapisuje ostrzeżenie w konsoli i **uruchamia moduł dalej, bez znacznika** — tak to jest napisane w `shared/firebase-app-check.js` i w `Kalkulator/TworzeniePostaci_v2-firebase.js`. Zrobiono to świadomie: dopóki wymuszanie było wyłączone, brak znacznika niczego nie psuł, a moduł miał działać jak dotąd.

**Od 20 września ta sama właściwość ma drugą stronę.** Przy włączonym wymuszaniu moduł, który nie zdobył znacznika, wystartuje normalnie, pokaże interfejs i **dopiero przy zapisie albo odczycie dostanie odmowę uprawnień**. Czyli objaw wygląda na awarię bazy albo błąd reguł, a przyczyna jest w przeglądarce.

> 🔍 **Przy zgłoszeniu „przestało mi działać zapisywanie" pierwszym podejrzanym jest blokada `google.com/recaptcha` w przeglądarce — dodatek blokujący reklamy, filtr rodzinny albo firmowa sieć.** Nie baza, nie reguły, nie klucz.

**Jak to rozstrzygnąć w pół minuty.** F12 → zakładka **Console** i szukasz ostrzeżenia zaczynającego się od `[AppCheck]`:

| Co widać w konsoli | Co to znaczy |
|---|---|
| `[AppCheck] reCAPTCHA Enterprise nie jest wczytana` | Biblioteka zablokowana lub niedostępna → to jest ta przyczyna. Wyłącz dodatek blokujący dla tej strony albo spróbuj z innej sieci |
| `[AppCheck] Brak klucza witryny dla projektu` | Do modułu nie dotarł plik `shared/appcheck-config.js` — problem po stronie kodu, nie przeglądarki |
| `[AppCheck] Pominięto App Check` (Zaawansowany Kreator) | To samo co wyżej, tylko z drugiej ścieżki ładowania |
| brak jakiegokolwiek `[AppCheck]`, a mimo to odmowa zapisu | Znacznik poszedł i został odrzucony — szukaj w metrykach kategorii *invalid* (rozdz. 8a), czyli sprawdzaj klucz i domenę w Google Cloud |

W ostateczności zawsze zostaje **Unenforce** — działa natychmiast i przywraca stan sprzed wymuszania, bez zmian w kodzie.

---

## 12. Lista kontrolna

**Stan na 20 września. Kroki 0–5 są wykonane w obu projektach. Do zrobienia został krok 6 i kilka drobiazgów kontrolnych.**

Pozycje oznaczone *(sprawdzone w kodzie)* zostały potwierdzone odczytem repozytorium 20 września, a nie tylko odhaczone z pamięci.

**Projekt 1 — `wh40k-data-slate`**
- [x] Klucz reCAPTCHA `WrathAndGlory-DataSlate` utworzony, typ WEB, domena `cutelittlegoat.github.io`
- [x] Aplikacja webowa `DataSlate` zarejestrowana w App Check — dostawca reCAPTCHA Enterprise, status *Registered*
- [ ] Sprawdzić, czy TTL jest ustawione na `1` + `days` (widoczne po kliknięciu **⋮** przy aplikacji) — **wciąż niesprawdzone**
- [x] **KROK 0** — zawężone reguły Firestore wgrane (rozdz. 4a), nadal z `if true` — sprawdzone, wszystkie dokumenty odpowiadają `200`
- [x] **KROK 3a** — App Check w DataVault *(sprawdzone w kodzie: `shared/firebase-data-loader.js`, `activateAppCheck` przed `getAuth` i `getDatabase`)*
- [x] **KROK 3b** — App Check w Infoczytniku, compat 9.6.8 bez zmiany wersji *(sprawdzone w kodzie: `INF_VERSION = 2026-09-14_11-12-07` zgodne w plikach testowych i produkcyjnych)*
- [x] **KROK 3c** — Kreatory Postaci: 8.10.1 → **12.6.0 compat** (wariant W3) + App Check *(sprawdzone w kodzie: `firebase-app-compat.js`, `firebase-firestore-compat.js`, `firebase-app-check-compat.js` w wersji 12.6.0)*
- [x] **KROK 4** — obserwacja 14–20 września, ruch zweryfikowany (metryki w rozdz. 9)
- [x] **KROK 5** — wymuszanie włączone dla **Cloud Firestore**
- [x] **KROK 5** — wymuszanie włączone dla **Realtime Database**
- [ ] **KROK 6** — reguły Firestore uzupełnione o `request.app != null` (gotowy tekst w rozdz. 9)
- [x] *(świadomie zostawione na `Monitoring`)* **Authentication** — decyzja z 20 września wraz z planem na później, rozdz. 9a
- [x] *(świadomie pominięte na stałe)* Aplikacja Android `Kozi Przybornik` — pozostałość po zamkniętym projekcie push, nie rejestrujemy jej nigdy (rozdz. 6)

**Projekt 2 — `audiorpg-2eb6f`**
- [x] Osobny klucz reCAPTCHA `WrathAndGlory-AudioRPG` utworzony, typ WEB, ta sama domena
- [x] Aplikacja webowa `AudioRPG` zarejestrowana — reCAPTCHA Enterprise, status *Registered*
- [ ] Sprawdzić TTL `1 days` — **wciąż niesprawdzone**
- [x] **KROK 0** — zawężone reguły Firestore wgrane, bez `DS2/progress` (rozdz. 4a)
- [x] **KROK 3a** — App Check w GeneratorNPC i w module Audio *(sprawdzone w kodzie: oba pliki wczytują `shared/appcheck-config.js` i bibliotekę reCAPTCHA)*
- [x] **KROK 5** — wymuszanie włączone dla **Cloud Firestore** (Realtime Database nieużywana)
- [ ] **Runda sprawdzająca po wymuszeniu — GeneratorNPC i Audio** (rozdz. 9). W tym projekcie nie odczytano metryki 24-godzinnej przed kliknięciem *Enforce*, więc sprawdzenie jest tu ważniejsze niż gdzie indziej
- [ ] **KROK 6** — reguły Firestore uzupełnione o `request.app != null` (gotowy tekst w rozdz. 9)

**Po wszystkim**
- [x] Pliki produkcyjne Infoczytnika (`GM.html`, `Infoczytnik.html`) zaktualizowane ręcznie *(sprawdzone w kodzie 20 września: identyczne z testowymi, różnią się wyłącznie zakończeniami wierszy)*
- [ ] Sprawdzone z telefonu, tabletu i komputera, że wszystko działa — **po włączeniu wymuszania to sprawdzenie jest ważniejsze niż przed**
- [ ] Kompletne reguły obu projektów zapisane w repozytorium (patrz audyt, rozdz. 9.6). Pliki `shared/firestore-wh40k-data-slate.rules` i `shared/firestore-audiorpg.rules` istnieją, ale zawierają wersję z kroku 0 — do poprawienia razem z krokiem 6
- [x] Oba klucze witryny w **jednym** pliku w `shared/` *(sprawdzone w kodzie: klucze występują wyłącznie w `shared/appcheck-config.js`, nie są powielone po modułach)*

---

## 13. Podsumowanie w trzech zdaniach

> **Stan na 20 września:** poniższy opis jest już wykonany aż do kliknięcia **Enforce** włącznie. Zostało ostatnie zdanie — wgranie zawężonych reguł z `request.app != null` w obu projektach (rozdz. 9) — oraz decyzja o Authentication, świadomie odłożona na później (rozdz. 9a).

Zakładasz **dwa klucze reCAPTCHA Enterprise** — po jednym w każdym projekcie Google Cloud, oba dla domeny `cutelittlegoat.github.io`. Wklejasz każdy klucz w Firebase Console → App Check przy jedynej aplikacji webowej danego projektu, ustawiając TTL na 1 dzień. Potem dopisujemy kilka linii do kodu sześciu modułów, obserwujesz przez kilka dni zakładkę APIs, a gdy ruch jest zweryfikowany — klikasz **Enforce** (Firestore w obu projektach, dodatkowo Realtime Database w pierwszym) i na koniec wgrywasz zawężone reguły.

---

## 14. Źródła

- [Get started using App Check with reCAPTCHA Enterprise in web apps](https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider)
- [Create score-based reCAPTCHA keys](https://firebase.google.com/docs/app-check/recaptcha-keys) — tworzenie klucza, typ „Web", domeny, zakaz dodawania `localhost`
- [App Check — Realtime Database](https://firebase.google.com/docs/app-check/web/custom-resource) — osobne wymuszanie dla RTDB
- [reCAPTCHA billing information](https://docs.cloud.google.com/recaptcha/docs/billing-information) — tryb Essentials, 10 000 sprawdzeń miesięcznie bez płatności

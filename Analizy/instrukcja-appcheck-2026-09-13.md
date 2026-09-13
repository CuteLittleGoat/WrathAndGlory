# App Check — instrukcja krok po kroku dla aplikacji WrathAndGlory

> **Data:** 13 września 2026
> **Dla kogo:** dla Ciebie, do klikania w przeglądarce. Nie trzeba nic umieć programować.
> **Stan na dziś:** w obu projektach Firebase zakładka **App Check** jest pusta — widać w niej tylko ekran powitalny z przyciskiem **Get started**. Czyli zaczynamy od zera.
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

> ### ⏸️ Ten krok jest na razie WSTRZYMANY
> Zgodnie z Twoją decyzją nie wprowadzamy jeszcze żadnych zmian w kodzie. Ten rozdział opisuje, co będzie do zrobienia, żebyś wiedział, jaki to zakres pracy — ale **kroki 1 i 2 możesz wykonać już teraz** i nic się nie stanie, jeśli krok 3 poczeka.

Do każdego modułu, który łączy się z Firebase, trzeba dopisać kilka linii uruchamiających App Check. Modułów jest sześć:

| Moduł | Plik | Wersja Firebase |
|---|---|---|
| DataVault | `shared/firebase-data-loader.js` | nowoczesna (12.6.0) |
| GeneratorNPC | `GeneratorNPC/index.html` | nowoczesna (12.6.0) |
| Audio | `Audio/index.html` | nowoczesna (12.6.0) |
| Infoczytnik — panel GM | `Infoczytnik/GM_test.html` | zgodnościowa (8.x) |
| Infoczytnik — ekran gracza | `Infoczytnik/Infoczytnik_test.html` | zgodnościowa (8.x) |
| Kalkulator — Prosty Kreator | `Kalkulator/TworzeniePostaci.html` | zgodnościowa (8.10.1) |
| Kalkulator — Zaawansowany Kreator | `Kalkulator/TworzeniePostaci_v2-firebase.js` | zgodnościowa (8.10.1) |

**Ważne dwie rzeczy:**

1. **Aplikacja używa dwóch różnych generacji biblioteki Firebase.** Obsługę App Check trzeba więc napisać w dwóch odmianach. To nie jest trudne, ale podwaja pracę i podwaja liczbę miejsc do sprawdzenia.
2. **Infoczytnik ma własną zasadę pracy** (`Infoczytnik/AGENTS.md`): zmiany wolno robić **wyłącznie** w plikach `GM_test.html` i `Infoczytnik_test.html`, z aktualizacją `INF_VERSION` w obu na ten sam znacznik czasu. Pliki produkcyjne (`GM.html`, `Infoczytnik.html`) aktualizujesz ręcznie Ty.
   **Jeśli o tym zapomnisz, po włączeniu wymuszania produkcyjny Infoczytnik przestanie działać, a testowy będzie działał** — i to jest dokładnie ten rodzaj usterki, który najtrudniej zdiagnozować.

Klucze witryny trafią do plików konfiguracyjnych: klucz projektu 1 do `shared/firebase-config.js`, klucz projektu 2 do `GeneratorNPC/config/firebase-config.js` i `Audio/config/firebase-config.js`.

---

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

---

## 9. KROK 5 i 6 — włączenie ochrony

### Krok 5 — wymuszanie

To jest moment, w którym baza faktycznie zaczyna odrzucać obce programy.

**W projekcie `wh40k-data-slate`:**
1. Firebase Console → **App Check** → zakładka **APIs**.
2. Kliknij **Cloud Firestore** → **Enforce** → potwierdź.
3. Kliknij **Realtime Database** → **Enforce** → potwierdź.

**W projekcie `audiorpg-2eb6f`:**
4. To samo, ale **tylko Cloud Firestore** (ten projekt nie używa Realtime Database).

Po każdym kliknięciu **sprawdź aplikację**: otwórz DataVault i GeneratorNPC z adresu internetowego i zobacz, czy dane się ładują. Jeśli nie — **Unenforce** i wracamy do diagnozy.

### Krok 6 — zawężenie reguł bazy

Dopiero **po** kroku 5. Reguły z warunkiem `request.app != null` same w sobie są wymuszaniem, więc wgranie ich wcześniej wyłączyłoby aplikację.

Ścieżka: Firebase Console → **Firestore Database** → zakładka **Rules** → wklej → **Publish**.

Gotowe reguły są w `Analizy/audyt-kodu-aplikacji-2026-09-10.md`, rozdz. 9.8. W skrócie zmieniają się trzy rzeczy:

- warunek `if true` (wpuść każdego) zamienia się na `if request.app != null` (wpuść tylko moją aplikację),
- reguły dla `dataslate` i `character_builder` zawężają się z całych kolekcji do konkretnych dokumentów, z których aplikacja naprawdę korzysta,
- z drugiego projektu znika reguła dla `DS2/progress` — projekt Dark Souls II jest zakończony, kolekcja usunięta, a w kodzie WrathAndGlory nie ma do niej żadnego odwołania (sprawdzone).

> Firebase trzyma historię reguł, więc powrót do poprzedniej wersji to jedno kliknięcie w zakładce **Rules**.

> 💡 **Dwie z tych trzech zmian możesz zrobić choćby dziś, przed całą resztą.** Zawężenie reguł do konkretnych dokumentów i skasowanie `DS2/progress` **nie psuje niczego** — aplikacja i tak korzysta wyłącznie z `dataslate/current`, `character_builder/current`, `character_builder/v2`, `generatorNpc/favorites` i `audio/favorites`. Zostawiasz na razie `if true` i zmieniasz tylko ścieżki. Zyskujesz tyle, że obcy nie może już tworzyć w Twojej bazie dowolnych nowych dokumentów — a że może, jest sprawdzone (rozdz. 9.2 audytu). Warunek `request.app != null` dopisujesz dopiero tutaj, w kroku 6.

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

---

## 12. Lista kontrolna

Odhaczaj po kolei. Kroki 1–2 możesz zrobić już dziś.

**Projekt 1 — `wh40k-data-slate`**
- [ ] Klucz reCAPTCHA utworzony, domena `cutelittlegoat.github.io`, klucz zapisany w notatniku
- [ ] Aplikacja webowa (`…838fad`) zarejestrowana w App Check z dostawcą reCAPTCHA Enterprise
- [ ] TTL ustawione na `1` + `days`
- [ ] *(wstrzymane)* Kod czterech modułów wysyła znaczniki
- [ ] Kilka dni obserwacji zakładki APIs — ruch zweryfikowany
- [ ] Wymuszanie włączone dla **Cloud Firestore**
- [ ] Wymuszanie włączone dla **Realtime Database**
- [ ] Nowe reguły Firestore wgrane

**Projekt 2 — `audiorpg-2eb6f`**
- [ ] Osobny klucz reCAPTCHA utworzony, ta sama domena
- [ ] Aplikacja webowa (`…e2e4ea`) zarejestrowana, TTL `1 days`
- [ ] *(wstrzymane)* Kod dwóch modułów wysyła znaczniki
- [ ] Kilka dni obserwacji
- [ ] Wymuszanie włączone dla **Cloud Firestore** (Realtime Database nieużywana)
- [ ] Nowe reguły Firestore wgrane, bez `DS2/progress`

**Po wszystkim**
- [ ] Pliki produkcyjne Infoczytnika (`GM.html`, `Infoczytnik.html`) zaktualizowane ręcznie
- [ ] Sprawdzone z telefonu, tabletu i komputera, że wszystko działa
- [ ] Kompletne reguły obu projektów zapisane w repozytorium (patrz audyt, rozdz. 9.6)

---

## 13. Podsumowanie w trzech zdaniach

Zakładasz **dwa klucze reCAPTCHA Enterprise** — po jednym w każdym projekcie Google Cloud, oba dla domeny `cutelittlegoat.github.io`. Wklejasz każdy klucz w Firebase Console → App Check przy jedynej aplikacji webowej danego projektu, ustawiając TTL na 1 dzień. Potem dopisujemy kilka linii do kodu sześciu modułów, obserwujesz przez kilka dni zakładkę APIs, a gdy ruch jest zweryfikowany — klikasz **Enforce** (Firestore w obu projektach, dodatkowo Realtime Database w pierwszym) i na koniec wgrywasz zawężone reguły.

---

## 14. Źródła

- [Get started using App Check with reCAPTCHA Enterprise in web apps](https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider)
- [Create score-based reCAPTCHA keys](https://firebase.google.com/docs/app-check/recaptcha-keys) — tworzenie klucza, typ „Web", domeny, zakaz dodawania `localhost`
- [App Check — Realtime Database](https://firebase.google.com/docs/app-check/web/custom-resource) — osobne wymuszanie dla RTDB
- [reCAPTCHA billing information](https://docs.cloud.google.com/recaptcha/docs/billing-information) — tryb Essentials, 10 000 sprawdzeń miesięcznie bez płatności

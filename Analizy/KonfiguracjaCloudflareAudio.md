# Konfiguracja Cloudflare dla modułu `Audio` — instrukcja krok po kroku

- **Data:** 2026-09-02
- **Temat:** uruchomienie darmowej bramki dostępowej dla chronionych plików audio
- **Dla kogo:** osoba bez doświadczenia technicznego
- **Dokument powiązany:** `Analizy/UtajnienieAudio.md` (analiza, dlaczego robimy to w ten sposób)

---

## 1. Oryginalny prompt użytkownika

> Przygotuj mi nowy plik MD w Analizy i bardzo dokładnie opisz co mam zrobić w Cloudflare i jakich danych potrzebujesz. Napisz to tak jak dla osoby, która zupełnie się na tym nie zna i musi mieć dokładne instrukcje co i gdzie klikać.

Doprecyzowania przekazane w trakcie pracy nad dokumentem:

> Dodatkowa uwaga - przeczytaj pliki WebView_FCM_Cloudflare_Worker/Archiwalne - kiedyś już próbowałem coś robić w CloudFlare, ale projekt został porzucony.

> być może coś z tamtego projektu zostało.

> Coś jeszcze tam jest na moim koncie.
> *(wraz ze zrzutami ekranu panelu Cloudflare)*

> mogę skasować i zrobić nowy, albo edytować.

Pytanie poprzedzające, z tej samej rozmowy:

> Czy wariant C jest możliwy do wprowadzenia już teraz przez Ciebie czy ja muszę coś jeszcze ustawiać i konfigurować?

---

## 2. Zakres dokumentu

Dokument opisuje **wyłącznie czynności, które musisz wykonać samodzielnie**, ponieważ wymagają Twojego konta i haseł, do których nie mam i nie powinienem mieć dostępu.

Kod (Worker, skrypty, zmiany w module `Audio`) napiszę ja.

---

## 3. Co już masz — ustalenia z archiwum i zrzutów ekranu

Po przeczytaniu `WebView_FCM_Cloudflare_Worker/Archiwalne/` oraz przesłanych zrzutów ekranu okazuje się, że **nie zaczynasz od zera**. To dobra wiadomość — odpada połowa roboty.

| Element | Stan | Znaczenie dla nas |
| --- | --- | --- |
| Konto Cloudflare | **Istnieje** | Nie zakładasz nowego. Nie podajesz karty. |
| Subdomena `workers.dev` | **`tarczynski-pawel`** | Adres przyszłej bramki znam już z góry. |
| Worker `wrathandglory-push-api` | Działa, 3 żądania, ostatnia zmiana 5 mies. temu | **Nie ruszamy go.** Patrz sekcja 5. |
| KV `PUSH_SUBSCRIPTIONS` | Istnieje, 2 subskrypcje | Nie ruszamy. |
| KV `FCM_TOKENS` | Istnieje, pusty | Nie ruszamy. |
| Doświadczenie z panelem | **Masz je** — wklejałeś kod i dodawałeś sekrety | Zmienia rekomendację, patrz sekcja 6. |

### 3.1. Adres bramki jest już znany

Skoro Twoja subdomena to `tarczynski-pawel`, nowa bramka będzie pod adresem:

```
https://audio-gate.tarczynski-pawel.workers.dev
```

**Nie musisz mi go przysyłać.** Wpiszę go do modułu od razu. Wystarczy, że potwierdzisz, że nazwałeś Workera dokładnie `audio-gate`.

---

## 4. ⚠️ PILNE — jeden problem bezpieczeństwa do naprawienia

Podczas przeglądania archiwum znalazłem realny wyciek.

### 4.1. Co znalazłem

Plik **`WebView_FCM_Cloudflare_Worker/TRIGGER_TOKEN`** zawiera prawdziwy, działający token w postaci jawnej. Jest **śledzony przez gita i opublikowany w publicznym repozytorium `WrathAndGlory`** — czyli może go odczytać każdy.

Z `Notatki.txt` wynika, że to nie jest atrapa: `TRIGGER_TOKEN` to jeden z sekretów Workera `wrathandglory-push-api`, chroniący endpoint `POST /api/push/trigger`.

### 4.2. Co to praktycznie oznacza

Osoba postronna może wysyłać powiadomienia push do Twoich subskrybentów. Skala szkody jest dziś niewielka (2 subskrypcje, projekt porzucony), ale token jest **aktywny**.

### 4.3. Co masz zrobić

1. Wejdź w panelu Cloudflare do Workera **`wrathandglory-push-api`** → **Settings** → **Variables and Secrets**.
2. Przy pozycji `TRIGGER_TOKEN` wybierz edycję i wpisz nową, losową wartość. Nową wygenerujesz komendą z sekcji 8.2 albo dowolnym generatorem haseł.
3. **Deploy.**
4. Usuń plik `WebView_FCM_Cloudflare_Worker/TRIGGER_TOKEN` z repozytorium (albo wpisz w nim placeholder w rodzaju `TU_WSTAW_WLASNY_TOKEN`, zgodnie z §13 `AGENTS.md`).

> **Dlaczego nie zrobiłem tego za Ciebie:** folder `WebView_FCM_Cloudflare_Worker/` jest objęty zakazem edycji przez agentów AI (`AGENTS.md` §17 oraz lokalny `AGENTS.md` w tym folderze). Mogę go czytać, ale nie mogę w nim niczego zmienić — nawet po to, żeby usunąć sekret.

> **Uwaga o historii gita:** sama zmiana pliku nie usuwa tokenu z historii repozytorium. Dlatego **rotacja wartości w Cloudflare jest krokiem obowiązkowym** — usunięcie pliku bez rotacji niczego nie naprawia.

### 4.4. Co sprawdziłem i co jest w porządku

| Sprawdzenie | Wynik |
| --- | --- |
| Klucz prywatny konta serwisowego Firebase w repo | **Brak.** W plikach są tylko nazwy pól i kod, który zdejmuje nagłówek PEM. |
| Klucze VAPID w repo | **Brak zapisanych wartości.** |
| `google-services.json` | Zawiera androidowy klucz API Firebase. To identyfikator przeznaczony do umieszczania w aplikacjach, chroniony nazwą pakietu — **nie jest to wyciek**. Zostaw. |

---

## 5. Czego NIE robić

Zapytałeś, czy skasować istniejącego Workera i zrobić nowego, czy go edytować.

**Odpowiedź: ani jedno, ani drugie. Zostaw `wrathandglory-push-api` w spokoju i utwórz obok drugiego Workera.**

Powody:

1. **Kasowanie jest nieodwracalne.** Razem z Workerem znikną trzy sekrety Firebase, w tym klucz konta serwisowego. Odtworzenie oznacza generowanie nowego klucza w Firebase.
2. **Edycja miesza dwie niezależne rzeczy.** Błąd w kodzie audio położyłby też powiadomienia — i odwrotnie.
3. **Nie ma po co oszczędzać.** Darmowy plan pozwala mieć **100 Workerów**. Drugi nic nie kosztuje.
4. **Łatwiej się wycofać.** Gdyby coś poszło nie tak, kasujesz tylko nowego Workera, a stary stan pozostaje nietknięty.

Jedyna rzecz, którą **masz** zmienić w starym Workerze, to rotacja `TRIGGER_TOKEN` z sekcji 4.

---

## 6. Zmiana rekomendacji — czytaj przed startem

W `UtajnienieAudio.md` rekomendowałem wariant A (kopia plików w Cloudflare). **Po ustaleniu, że masz już doświadczenie z panelem Cloudflare, zmieniam rekomendację na wariant C.** Wyjaśniam uczciwie, dlaczego.

| | **Wariant C** *(teraz polecany)* | **Wariant A** |
| --- | --- | --- |
| Gdzie leżą pliki | Zostają w `AudioRPG` | Kopia w Cloudflare |
| Co musisz umieć | Wkleić kod w panelu i dodać sekrety — **robiłeś to już** | Zainstalować Node.js, nauczyć się `wrangler` |
| Instalacja czegokolwiek | **Nic** | Node.js + wrangler |
| Czas | ~15 minut | ~40 minut |
| Dodawanie nowych plików | Wrzucasz do repo i gotowe | Trzeba wysłać ponownie 358 MB |
| Dodatkowy sekret | Token GitHub (odnawiany co 90 dni) | Brak |
| Szybkość pierwszego odtworzenia | Nieco wolniejsza | Nieco szybsza |

**Dlaczego zmieniam zdanie:** wariant C robi się w całości w przeglądarce, dokładnie tą samą drogą, którą przeszedłeś przy Workerze push. Wariant A wymaga narzędzi, których nie masz i których musiałbyś się uczyć. Przewaga techniczna A jest realna, ale niewielka — a różnica w trudności wdrożenia jest duża.

**Różnica w szybkości nie będzie dokuczliwa:** bramka zapamiętuje pobrany plik, więc opóźnienie dotyczy wyłącznie pierwszego odtworzenia danego dźwięku.

**Nic nie zamykasz.** Przejście z C na A później nie wymaga zmian w module `Audio` — podmienia się tylko wnętrze bramki.

> **Cała dalsza część instrukcji opisuje wariant C i nie wymaga instalowania niczego.** Jeżeli mimo to wolisz wariant A, napisz — przygotuję osobną wersję z instalacją Node.js i wranglera.

---

## 7. KROK 1 — Utwórz nowego Workera

1. Wejdź na **https://dash.cloudflare.com** i zaloguj się na swoje konto.
2. W menu po lewej wybierz **Compute & AI** → **Workers & Pages**.

   > To ta sama strona, na której widziałeś `wrathandglory-push-api`.

3. Kliknij niebieski przycisk **Create application** w prawym górnym rogu.
4. Wybierz **Workers** → **Start with Hello World!** (albo podobnie brzmiącą opcję z najprostszym przykładem).
5. W polu nazwy wpisz **dokładnie**:

   ```
   audio-gate
   ```

   > Nazwa jest ważna — to od niej zależy adres, który wpiszę do modułu. Jeżeli wpiszesz inną, daj mi znać jaką.

6. Kliknij **Deploy**.
7. Poczekaj kilka sekund. Cloudflare pokaże adres:

   ```
   https://audio-gate.tarczynski-pawel.workers.dev
   ```

8. **Sprawdź, że żyje.** Otwórz ten adres w nowej karcie. Powinieneś zobaczyć `Hello World!`.

✅ Jeżeli widzisz `Hello World!` — najtrudniejsze masz za sobą.

---

## 8. KROK 2 — Przygotuj trzy wartości

Bramka potrzebuje trzech tajnych wartości. Przygotuj je teraz, wgrasz je w kroku 3.

| Nazwa | Do czego służy | Skąd ją weźmiesz |
| --- | --- | --- |
| `GROUP_PASSWORD` | Hasło, które podadzą gracze przy pierwszym uruchomieniu | Wymyślasz sam |
| `SIGNING_KEY` | Klucz, którym bramka podpisuje linki. Nikt go nie wpisuje | Losujesz |
| `GITHUB_TOKEN` | Pozwala bramce czytać pliki z `AudioRPG` | Generujesz na GitHubie (sekcja 9) |

### 8.1. Hasło grupy

Wymyśl je sam. Zasady:

- Minimum 12 znaków.
- **Nie używaj hasła, którego używasz gdziekolwiek indziej.**
- Może być łatwe do podyktowania, np. `bolter-kadia-2026-mlot`. Długość jest ważniejsza od dziwnych znaków.

Zapisz je — będziesz je podawać graczom.

### 8.2. Klucz podpisujący

Potrzebujesz długiego, losowego ciągu. Wybierz dowolny sposób:

**Sposób 1 — w przeglądarce (nic nie instalujesz):**

1. Naciśnij `F12`, żeby otworzyć narzędzia deweloperskie.
2. Przejdź do zakładki **Console**.
3. Wklej to i naciśnij Enter:

   ```js
   btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
   ```

4. Skopiuj wynik w cudzysłowie, np. `"K7d2mXqR9vN4pL1sT8wY3zA6bC5eF0gH2jI4kM7nO9Q="` — **bez cudzysłowów**.

**Sposób 2 — generator haseł:** dowolny menedżer haseł, ustaw długość 40+ znaków.

Zapisz wynik tymczasowo w Notatniku. Usuniesz go po kroku 3.

> Ten ciąg **nie jest** hasłem dla graczy. Nikt go nigdy nie wpisuje ręcznie.

---

## 9. KROK 3 — Wygeneruj token GitHub

1. Wejdź na **https://github.com/settings/personal-access-tokens/new**

   (Zalogowany jako `CuteLittleGoat`.)

2. **Token name:** wpisz `audio-gate`

3. **Expiration:** wybierz **90 days**.

   > Można wybrać dłużej, ale wtedy dłużej działałby też token, gdyby wyciekł. Przy 90 dniach zapisz sobie przypomnienie w kalendarzu.

4. **Repository access:** zaznacz **Only select repositories** → z listy wybierz **AudioRPG**.

   > ⚠️ **Nie wybieraj „All repositories”.** Token ma widzieć jedno repozytorium i nic więcej.

5. **Permissions** → rozwiń **Repository permissions** → znajdź na liście **Contents** → ustaw na **Read-only**.

   > ⚠️ Tylko to jedno uprawnienie. Wszystkie pozostałe zostaw na **No access**. Token ma umieć wyłącznie czytać, nigdy zapisywać.

6. Zjedź na dół, kliknij **Generate token**.

7. GitHub pokaże token zaczynający się od `github_pat_...`. **Skopiuj go teraz — zobaczysz go tylko raz.**

Wklej tymczasowo do tego samego Notatnika co klucz podpisujący.

---

## 10. KROK 4 — Wgraj trzy sekrety do Workera

Robisz to dokładnie tak samo, jak przy Workerze push.

1. Panel Cloudflare → **Workers & Pages** → kliknij **audio-gate**.
2. Zakładka **Settings**.
3. Sekcja **Variables and Secrets** → **Add**.
4. Dla każdej z trzech pozycji:
   - **Type:** wybierz **Secret** (nie *Text* / nie *Plaintext*).
   - **Variable name:** wpisz nazwę z tabeli poniżej — **dokładnie tak, wielkimi literami**.
   - **Value:** wklej wartość.
   - Kliknij **Deploy**.

| Variable name | Value |
| --- | --- |
| `GROUP_PASSWORD` | hasło grupy z sekcji 8.1 |
| `SIGNING_KEY` | losowy ciąg z sekcji 8.2 |
| `GITHUB_TOKEN` | token `github_pat_...` z sekcji 9 |

5. Dodaj jeszcze **jedną zmienną, ale typu zwykłego** (nie sekret):

| Type | Variable name | Value |
| --- | --- | --- |
| **Text** / **Plaintext** | `ALLOWED_ORIGIN` | `https://cutelittlegoat.github.io` |

   > To adres, z którego wolno korzystać z bramki. Ta sama zasada, której użyłeś w Workerze push.

### 10.1. Sprawdź

W sekcji **Variables and Secrets** powinny być **cztery** pozycje:

- `GROUP_PASSWORD` — Secret
- `SIGNING_KEY` — Secret
- `GITHUB_TOKEN` — Secret
- `ALLOWED_ORIGIN` — Text

Przy sekretach zobaczysz tylko nazwy. Wartości nie są pokazywane nigdy — i tak ma być.

### 10.2. Posprzątaj

**Usuń plik z Notatnika**, w którym trzymałeś klucz podpisujący i token GitHub. Obie wartości są już w Cloudflare, lokalna kopia to tylko ryzyko.

Hasło grupy zachowaj — będziesz je podawać graczom.

---

## 11. Co mi przysłać

Dzięki zrzutom ekranu potrzebuję już bardzo niewiele.

### 11.1. Napisz mi po prostu

| Co | Przykładowa odpowiedź |
| --- | --- |
| Czy Worker nazywa się `audio-gate` | „tak” albo podaj inną nazwę |
| Czy adres pokazuje `Hello World!` | „tak” |
| Czy są cztery zmienne z sekcji 10.1 | „są cztery” |
| Czy `TRIGGER_TOKEN` został zrotowany (sekcja 4) | „zrobione” |

### 11.2. Odpowiedz na cztery pytania

Przy każdym podaję propozycję. Jeżeli wszystkie Ci pasują, napisz „wszystko domyślnie”.

| Pytanie | Propozycja |
| --- | --- |
| Jak długo ma trwać zalogowanie, zanim aplikacja znów spyta o hasło? | **30 dni** |
| Jak długo ma być ważny pojedynczy link do dźwięku? | **5 minut** |
| Czy moduł ma się otwierać bez logowania i pytać o hasło dopiero przy pierwszym chronionym dźwięku? | **Tak** — demo działa od razu, jak dziś |
| Czy zostajemy przy wariancie C? | **Tak** |

### 11.3. NIGDY mi tego nie przysyłaj

- ❌ Hasła grupy (`GROUP_PASSWORD`)
- ❌ Klucza podpisującego (`SIGNING_KEY`)
- ❌ Tokenu GitHub (`GITHUB_TOKEN`)
- ❌ Account ID Cloudflare
- ❌ Tokenu API Cloudflare
- ❌ Nowej wartości `TRIGGER_TOKEN`
- ❌ Zrzutów ekranu, na których widać którąkolwiek z powyższych wartości

> Zrzuty ekranu z sekcji 3 były w porządku — widać na nich tylko nazwy i adresy, żadnych wartości sekretów.

> Gdyby któraś z tych wartości przypadkiem trafiła do rozmowy — napisz mi o tym. Trzeba ją wtedy wymienić na nową, a ja podam jak.

---

## 12. Lista kontrolna

- [ ] `TRIGGER_TOKEN` zrotowany w Workerze `wrathandglory-push-api` (sekcja 4)
- [ ] Plik `WebView_FCM_Cloudflare_Worker/TRIGGER_TOKEN` wyczyszczony lub usunięty
- [ ] Worker `wrathandglory-push-api` **nie został skasowany ani przerobiony**
- [ ] Nowy Worker `audio-gate` utworzony
- [ ] `https://audio-gate.tarczynski-pawel.workers.dev` pokazuje `Hello World!`
- [ ] Token GitHub: tylko `AudioRPG`, tylko `Contents: Read-only`
- [ ] Cztery zmienne wgrane (3 sekrety + 1 tekstowa)
- [ ] Hasło grupy zapisane w bezpiecznym miejscu
- [ ] Notatnik z kluczem i tokenem usunięty
- [ ] **Nigdzie nie podałem danych karty płatniczej**

---

## 13. Kiedy coś nie działa

| Objaw | Przyczyna | Co zrobić |
| --- | --- | --- |
| Nie widzę **Create application** | Jesteś na podstronie Workera, nie na liście | Kliknij **Workers & Pages** w menu po lewej. |
| Nazwa `audio-gate` jest zajęta | Utworzyłeś ją już wcześniej | Otwórz istniejącego `audio-gate` zamiast tworzyć nowego. |
| Adres daje błąd 404 | Wdrożenie się nie powiodło | Wróć do Workera i kliknij **Deploy** jeszcze raz. |
| Nie widzę **Variables and Secrets** | Jesteś w niewłaściwej zakładce | Worker → **Settings**. Sekcja jest niżej na stronie. |
| Nie mogę znaleźć **Contents** w uprawnieniach GitHuba | Sekcja jest zwinięta | Rozwiń **Repository permissions**. Lista jest alfabetyczna. |
| Zgubiłem token GitHub przed wklejeniem | Pokazywany tylko raz | Wygeneruj nowy (sekcja 9). Stary skasuj na liście tokenów. |
| Panel prosi o kartę płatniczą | Trafiłeś na ekran usługi płatnej | Cofnij się. Karta nie jest potrzebna w żadnym kroku. |
| Panel wygląda inaczej niż w opisie | Cloudflare zmienia nazwy menu | Szukaj podobnych napisów: **Workers**, **Compute**, **Settings**, **Variables**. Kolejność działań pozostaje ta sama. |

---

## 14. Dlaczego to kosztuje 0 zł

| Pozycja | Darmowy limit | Twoje zużycie |
| --- | --- | --- |
| Liczba Workerów | 100 | 2 (push + audio) |
| Odwołania do bramki | 100 000 dziennie | sesja RPG to kilkaset |
| Przechowywanie | nie dotyczy — pliki zostają na GitHubie | 0 |
| Odczyty z API GitHuba | 5000 na godzinę | z zapasem |

Darmowy plan Workers **nie nalicza opłat po przekroczeniu limitu** — po prostu przestaje odpowiadać do północy. Nie ma możliwości, żeby przyszedł rachunek, bo do konta nie jest podpięta karta.

---

## 15. Zasady bezpieczeństwa

1. **Sekrety nie trafiają do repozytorium.** Wyłącznie przez panel Cloudflare. Wynika to wprost z §13 `AGENTS.md` — i z tego, co znaleźliśmy w sekcji 4.
2. **Token GitHub tylko do odczytu i tylko do `AudioRPG`.** Gdyby wyciekł, nikt nic nie zapisze ani nie sięgnie do innych repozytoriów.
3. **Hasło grupy przekazuj bezpiecznym kanałem.** Prywatna wiadomość — tak. Publiczny kanał Discorda — nie.
4. **Zmiana hasła grupy wylogowuje wszystkich.** To działa na Twoją korzyść, gdy ktoś odchodzi z grupy.
5. **Przestań przełączać `AudioRPG` na publiczne.** Po uruchomieniu bramki to obejście przestaje być potrzebne. Dopóki go używasz, cała chroniona biblioteka jest przez ten czas dostępna dla każdego — nie dodawaj wtedy plików płatnych.

---

## 16. Ryzyka

| Ryzyko | Waga | Ograniczenie |
| --- | --- | --- |
| **`TRIGGER_TOKEN` pozostanie niezrotowany** | **Wysoka — do zrobienia teraz** | Sekcja 4. Token jest publicznie widoczny i aktywny. |
| Przypadkowe skasowanie Workera push | Wysoka | Sekcja 5. Nie ruszaj go — twórz drugiego obok. |
| Wygaśnięcie tokenu GitHub po 90 dniach | Średnia | Zapisz przypomnienie. Objaw: wszystkie chronione dźwięki przestają grać naraz. |
| Utrata hasła grupy | Niska | Ustawiasz nowe w panelu. Nic nie trzeba wdrażać od nowa. |
| Utrata dostępu do konta Cloudflare | Średnia | Zapisz hasło w menedżerze. Rozważ dwuskładnikowe logowanie. |
| Gracz udostępni hasło osobie postronnej | Średnia | Technicznie nie do usunięcia. Zmiana hasła unieważnia dostęp wszystkim naraz. |
| Przekroczenie 100 000 odwołań dziennie | Bardzo niska | Bramka milknie do północy. **Nie generuje kosztu.** |
| Zmiana wyglądu panelu Cloudflare | Niska | Sekcja 13, ostatni wiersz. |

---

## 17. Co dalej

**Po Twojej stronie — teraz:**

1. Zrotuj `TRIGGER_TOKEN` (sekcja 4). To pilne i niezależne od reszty.
2. Wykonaj kroki 1–4 (sekcje 7–10).
3. Przejdź listę kontrolną z sekcji 12.
4. Napisz mi odpowiedzi z sekcji 11.

**Po mojej stronie — kiedy to dostanę:**

5. Napiszę kod bramki, wygeneruję ukryty manifest i przerobię moduł `Audio`.
6. Dam Ci gotowy kod do wklejenia w edytorze Workera — jedna operacja *zaznacz wszystko, wklej, Deploy*.
7. Zaktualizuję dokumentację modułu oraz `Analizy/UtajnienieAudio.md`.

**Wspólnie na koniec:**

8. Test: dźwięk demo gra **bez logowania**, dźwięk chroniony pyta o hasło **raz**, a po zamknięciu i ponownym otwarciu przeglądarki **nie pyta ponownie**.
9. Po udanym teście `AudioRPG` zostaje prywatne **na stałe**.

---

## 18. Źródła

Stan na 2 września 2026.

- [Cloudflare Workers — Get started guide](https://developers.cloudflare.com/workers/get-started/guide/)
- [Cloudflare Workers — Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare Workers — Platform limits](https://developers.cloudflare.com/workers/platform/limits/)
- [GitHub — tworzenie fine-grained personal access token](https://github.com/settings/personal-access-tokens/new)
- [GitHub Docs — REST API: repository contents](https://docs.github.com/en/rest/repos/contents)

Ustalenia o stanie konta pochodzą z `WebView_FCM_Cloudflare_Worker/Archiwalne/Notatki.txt`, `kod-wrathandglory-push-api.txt` oraz zrzutów ekranu panelu Cloudflare przesłanych przez użytkownika. Pomiary repozytorium `AudioRPG` (358 MB, 1551 plików, zgodność 1551/1551 ze ścieżkami z manifestu) wykonano na sklonowanej kopii w ramach tej sesji.

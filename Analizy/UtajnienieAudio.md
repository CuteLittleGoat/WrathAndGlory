# Utajnienie plików audio w module `Audio`

- **Data analizy:** 2026-09-02
- **Moduł:** `Audio`
- **Typ dokumentu:** analiza koncepcyjna (bez zmian w kodzie)
- **Status:** rekomendacja do decyzji

---

## 1. Oryginalny prompt użytkownika

Poniżej pełna, nieskrócona treść polecenia oraz doprecyzowań przekazanych w trakcie analizy.

### 1.1. Polecenie główne

> Zapoznaj się z repo WrathAndGlory a w szczególności z modułem Audio.
>
> Moduł ten służy do obsługi plików audio, tworzenia playlist itp.
> Chciałbym tylko, żeby dane o plikach były ukryte.
> Obecnie linki są w Audio/AudioManifest.xlsx
> Docelowo chcę, żeby pliki audio nie był publicznie dostępne. Chcę tam wgrać pliki audio chronione prawami autorskimi. W związku z tym będzie potrzebny jakiś inny mechanizm.
> Próbowałem wcześniej wrzucić pliki do CloudFlare do jakigoś rodzaju bazy dostępnego za darmo, ale aplikacja pytała o hasło za każdym razem jak odczytywała jakiś plik - czyli przy każdym odtworzeniu co uniemożliwiało realnie korzystanie.
>
> Masz pełen dostęp do internetu na potrzeby analizy. Znajdź mi jakieś rozwiązanie dostępne za darmo (czyli bez dodatkowych opłat np za GitHub czy Cloudflare albo Firebase.)
>
> Przeprowadź analizę i zapisz jej wyniki w Analizy/UtajnienieAudio.md
> Nie zmieniaj nic w kodzie.
>
> Jeżeli masz jakieś dodatkowe pytania co do zadania i zakresu analizy to zadaj je przed utworzeniem pliku.

### 1.2. Doprecyzowania przekazane w trakcie analizy

> Jedno doprecyzowanie - pliki audio muszą być gdzieś dostępne online.

> Obecnie suma plików Audio to ok 400 MB. Zakładam, ze powyżej 5GB nie będzie.

> Część plików audio (WH40k_Boltgun) celowo są dostępne publicznie. To darmowe pliki używane jako "Demo" do bliźniaczej aplikacji.
> Pozostałe pliki są obecnie w repo prywatnym. Dlatego jest zwracany błąd. Jak zmieniam na publiczny to pliki audio się odtwarzają - ale to rozwiązanie mnie nie satysfakcjonuje - zwłaszcza jak będę dodawać chronione i płatne pliki.

### 1.3. Pytania zadane użytkownikowi i udzielone odpowiedzi

| Pytanie | Odpowiedź użytkownika |
| --- | --- |
| Jaki będzie docelowy rozmiar biblioteki audio? | „Nie wiem jeszcze”, uzupełnione następnie: ok. 400 MB obecnie, docelowo nie więcej niż 5 GB. |
| Czy akceptujesz konto wymagające danych karty płatniczej, jeżeli rachunek pozostaje 0 zł? | „Tylko jeżeli da się ustawić limit wydatków 0 zł”. |
| Jakiego poziomu ochrony plików potrzebujesz? | „Nie znam się na tym. Repo i moduł Audio są publicznie dostępne. Obecnie pliki są w prywatnym repo. Chcę, żeby postronna osoba mając dostęp do linków nie mogła odtworzyć plików audio.” |
| Czy aplikacja Audio musi zostać na GitHub Pages? | „Musi zostać na GitHub Pages”. |

---

## 2. Zakres analizy

Analiza obejmuje:

1. Rozpoznanie aktualnego działania modułu `Audio` w zakresie budowania adresów i odtwarzania plików.
2. Inwentaryzację zawartości `Audio/AudioManifest.xlsx`.
3. Weryfikację, które pliki są dziś realnie publicznie dostępne w internecie.
4. Ustalenie technicznej przyczyny, dla której poprzednia próba z Cloudflare pytała o hasło przy każdym odtworzeniu.
5. Sformułowanie wymagań wynikających z odpowiedzi użytkownika.
6. Przegląd darmowych mechanizmów hostingu i kontroli dostępu dostępnych we wrześniu 2026.
7. Porównanie wariantów i wskazanie rekomendacji.
8. Wskazanie miejsc w kodzie, których zmiana będzie konieczna przy wdrożeniu (bez wykonywania tych zmian).
9. Ryzyka i kolejne kroki.

Analiza **nie obejmuje** implementacji. Zgodnie z poleceniem w kodzie nie wprowadzono żadnych zmian.

---

## 3. Stan obecny

### 3.1. Jak moduł buduje adresy i odtwarza dźwięk

Moduł jest pojedynczą stroną `Audio/index.html` (2425 linii, CSS i JS osadzone w pliku).

Ścieżka danych wygląda dziś tak:

1. `parseManifest()` (`Audio/index.html:1971`) pobiera manifest:

   ```js
   const response = await fetch("AudioManifest.xlsx", { cache: "no-store" });
   ```

   Plik jest parsowany biblioteką SheetJS (`XLSX.read` → `XLSX.utils.sheet_to_json`).

2. Z każdego wiersza czytane są trzy kolumny (`Audio/index.html:1988-1990`):

   ```js
   const label     = String(row.NazwaSampla   || "").trim();
   const filename  = String(row.NazwaPliku    || "").trim();
   const folderUrl = String(row.LinkDoFolderu || "").trim();
   ```

3. `normalizeUrl()` (`Audio/index.html:943`) skleja gotowy adres pliku:

   ```js
   return `${folder}/${file}`;
   ```

4. `startPlayback()` (`Audio/index.html:1311`) tworzy odtwarzacz:

   ```js
   const audio = new Audio(fullUrl);
   const context = getAudioContext();
   if (context) {
     const source = context.createMediaElementSource(audio);
     gainNode = context.createGain();
     source.connect(gainNode);
     gainNode.connect(context.destination);
   }
   ```

**Kluczowa obserwacja:** moduł używa Web Audio API (`createMediaElementSource`) do sterowania głośnością. Element `<audio>` nie ma ustawionego atrybutu `crossOrigin`. Dziś to nie przeszkadza, ponieważ aplikacja (`cutelittlegoat.github.io/WrathAndGlory/Audio/`) i pliki audio (`cutelittlegoat.github.io/AudioRPG/...`) leżą na **tym samym origin**. Po przeniesieniu plików na inną domenę ta sama konstrukcja spowoduje, że graf Web Audio zostanie „skażony” (tainted) i **odtwarzanie będzie ciche**. To najważniejsza pułapka techniczna całego przedsięwzięcia — szczegóły w sekcji 8.

### 3.2. Zawartość `Audio/AudioManifest.xlsx`

| Metryka | Wartość |
| --- | --- |
| Wierszy danych | 1793 |
| Unikalnych folderów (`LinkDoFolderu`) | 128 |
| Plików `.ogg` | 1699 |
| Plików `.mp3` | 94 |
| Wierszy bez nazwy pliku lub folderu | 0 |
| Host we wszystkich adresach | `https://cutelittlegoat.github.io` |
| Deklarowany rozmiar biblioteki | ok. 400 MB (docelowo ≤ 5 GB) |

Podział na zbiory treści:

| Zbiór | Liczba wierszy | Prefiks ścieżki |
| --- | --- | --- |
| TabletopAudio | 1489 | `/AudioRPG/TabletopAudio/...` |
| WH40k Boltgun | 242 | `/AudioExample/WH40k_Boltgun/...` |
| Grimdark Audio | 62 | `/AudioRPG/GrimdarkAudio/...` |

### 3.3. Co jest dziś realnie dostępne publicznie — weryfikacja

Wykonano zapytania HTTP (`HEAD` oraz `GET` z nagłówkiem `Range`) na losowej próbce adresów z manifestu, a następnie zapytania o katalogi główne:

| Adres | Wynik HTTP | Interpretacja |
| --- | --- | --- |
| `/AudioExample/` | `200` | Opublikowana strona projektu — repozytorium **publiczne**. |
| `/AudioExample/WH40k_Boltgun/...` | `200` / `206` | Pliki dostępne publicznie, serwer obsługuje `Range`. |
| `/AudioRPG/` | `404` | Brak opublikowanej strony — repozytorium **prywatne**. |
| `/AudioRPG/TabletopAudio/...` | `404` | Pliki niedostępne, bo strona nie jest opublikowana. |
| `/AudioRPG/GrimdarkAudio/...` | `404` | Jak wyżej. |
| `/` (katalog główny) | `404` | Brak repozytorium strony użytkownika — każdy zbiór to osobna strona projektu. |

Zmierzone rozmiary przykładowych plików Boltgun: od 7,5 kB do ok. 302 kB.

Żadne zapytanie o katalog nie zwraca listingu — GitHub Pages go nie generuje.

#### Biblioteka składa się z dwóch warstw

Wynik `404` dla `AudioRPG` **nie oznacza martwych linków**. Oznacza, że repozytorium jest prywatne, więc GitHub Pages nie publikuje strony. Biblioteka nie jest jednorodna — to dwa zbiory o różnym przeznaczeniu, w dwóch osobnych repozytoriach:

| Warstwa | Repozytorium | Wpisów | Folderów | Status | Przeznaczenie |
| --- | --- | --- | --- | --- | --- |
| **Demo** | `AudioExample` (publiczne) | 242 | 83 | publiczne **celowo** | darmowe pliki, materiał demonstracyjny dla bliźniaczej aplikacji |
| **Chroniona** | `AudioRPG` (prywatne) | 1551 | 45 | niedostępne | materiały objęte prawami autorskimi, docelowo także płatne |

Publiczna dostępność warstwy demo jest **zamierzona i musi zostać zachowana** — korzysta z niej druga aplikacja. Nie jest to przeoczenie ani wyciek i nie wymaga żadnego działania naprawczego.

#### Kluczowa obserwacja: GitHub Pages daje wyłącznie przełącznik dwustanowy

Po przełączeniu repozytorium `AudioRPG` na publiczne pliki zaczynają się odtwarzać. To znaczy, że dziś osiągalne są dokładnie dwa stany — i żaden nie jest zadowalający:

| Stan repozytorium `AudioRPG` | Strona Pages | Pliki chronione | Ocena |
| --- | --- | --- | --- |
| prywatne | nie istnieje | nie odtworzy ich nikt — **także uprawniona grupa** | moduł nie działa |
| publiczne | opublikowana | odtworzy je **każdy**, kto zna adres | zerowa ochrona |

Stanu pośredniego nie da się uzyskać także w planach płatnych: publikowanie Pages z repozytorium prywatnego (dostępne od planu Pro) **nie czyni opublikowanej strony prywatną**, a kontrola dostępu do Pages istnieje wyłącznie w GitHub Enterprise Cloud.

To jest sedno problemu i uzasadnienie całej dalszej analizy. Potrzebny jest **trzeci stan — „dostępne wyłącznie dla uprawnionych”** — którego GitHub Pages nie zapewni na żadnym planie realnym w tym projekcie. Musi go dostarczyć warstwa pośrednicząca opisana w sekcji 6. Przełączanie repozytorium na publiczne na czas sesji jest obejściem, które przy plikach płatnych oznacza ich pełne upublicznienie na ten czas — łącznie z możliwością zindeksowania i pobrania hurtem.

### 3.4. Wyciek metadanych przez manifest

`Audio/AudioManifest.xlsx` znajduje się w publicznym repozytorium `WrathAndGlory`. Zawiera wpisy obu warstw naraz — i tylko jedna z nich stanowi problem:

| Zakres | Wpisów | Ocena |
| --- | --- | --- |
| Warstwa demo (`AudioExample`) | 242 | Bez zastrzeżeń. Pliki są publiczne celowo, więc jawność ich adresów niczego nie ujawnia. |
| Warstwa chroniona (`AudioRPG`) | 1551 | **Wyciek metadanych.** |

W części dotyczącej warstwy chronionej manifest publikuje:

- 1551 nazw sampli,
- 1551 nazw plików,
- strukturę 45 folderów źródłowych, w tym nazwy pakietów płatnych (`... SoundPad Patreon`, `Cthulhu SoundPad Patreon Version`, `Vikings SoundPad Patreon`).

Nawet przy repozytorium `AudioRPG` ustawionym jako prywatne manifest sam w sobie publikuje kompletny katalog posiadanych materiałów chronionych prawem autorskim wraz ze wskazaniem ich płatnego pochodzenia — a także gotowe adresy, które zadziałają w momencie przełączenia repozytorium na publiczne. To jest dokładnie ten „wyciek danych o plikach”, który polecenie każe wyeliminować.

### 3.5. Ograniczenia GitHub Pages

| Limit | Wartość |
| --- | --- |
| Maksymalny rozmiar opublikowanej strony | 1 GB |
| Miękki limit transferu | 100 GB / miesiąc |
| Kontrola dostępu do opublikowanej strony | tylko GitHub Enterprise Cloud |

Dodatkowo regulamin GitHub Pages zastrzega, że usługa nie jest przeznaczona do pełnienia roli darmowego hostingu plików ani CDN.

Konsekwencje:

- 400 MB mieści się w limicie 1 GB, ale docelowe 5 GB **już nie**.
- Warstwa demo (242 pliki) mieści się w tych limitach bez zastrzeżeń i **może zostać na GitHub Pages** w obecnej formie.
- Dla warstwy chronionej GitHub Pages nie oferuje żadnego stanu pośredniego między „wszystko publiczne” a „nic nie działa” (sekcja 3.3).
- GitHub Pages jest więc odpowiedni dla **aplikacji** oraz dla **warstwy demo**, ale nie dla **plików chronionych**.

---

## 4. Diagnoza: dlaczego poprzednia próba z Cloudflare pytała o hasło przy każdym odtworzeniu

To najważniejszy punkt analizy, bo determinuje wybór mechanizmu.

Opisany objaw — „aplikacja pytała o hasło za każdym razem jak odczytywała jakiś plik” — jest klasycznym skutkiem zastosowania **interaktywnego** mechanizmu uwierzytelnienia do zasobów ładowanych przez element `<audio>` z innej domeny. Możliwe są dwa źródła, oba dają ten sam objaw:

### 4.1. Cloudflare Access (Zero Trust)

Cloudflare Access po zalogowaniu ustawia ciasteczko `CF_Authorization` **na chronionej domenie**. Gdy aplikacja działa na `cutelittlegoat.github.io`, a pliki leżą na domenie chronionej przez Access, każde żądanie o plik jest żądaniem **cross-origin**. W takiej sytuacji:

- ciasteczko `CF_Authorization` jest ciasteczkiem **third-party** i jest blokowane przez współczesne przeglądarki,
- dokumentacja Cloudflare wprost odnotowuje, że żądanie CORS do domeny chronionej przez Access bez zalogowania kończy się błędem CORS, a żądanie `OPTIONS` zwraca `403` **niezależnie od tego, czy użytkownik jest zalogowany**, ponieważ przeglądarka nigdy nie dołącza ciasteczek do `OPTIONS`,
- efektem jest przekierowanie na stronę logowania albo błąd — przy każdym pliku z osobna.

### 4.2. HTTP Basic Auth

Jeżeli bramka odpowiadała `401` z nagłówkiem `WWW-Authenticate`, przeglądarka z definicji wyświetla natywne okno logowania. Przy żądaniach cross-origin bez `credentials` poświadczenia nie są ponawiane automatycznie, więc okno pojawia się przy każdym pliku.

### 4.3. Wniosek diagnostyczny

Problemem **nie było** to, że pliki są chronione. Problemem był **typ ochrony**: mechanizm interaktywny (przekierowanie na logowanie lub `WWW-Authenticate`) jest fundamentalnie niekompatybilny z elementem `<audio>` ładującym zasób z innej domeny.

Rozwiązanie musi być **nieinteraktywne**: autoryzacja przenoszona w adresie URL (podpisany token) albo w nagłówku żądania kontrolowanego przez JavaScript — nigdy przez wyzwanie uwierzytelnienia przeglądarki ani przez third-party cookie.

To jest dokładnie ta różnica, której zabrakło w poprzedniej próbie, i jest ona naprawialna.

---

## 5. Wymagania wynikające z odpowiedzi użytkownika

| Nr | Wymaganie | Źródło |
| --- | --- | --- |
| W1 | Pliki audio są hostowane online (nie lokalnie na urządzeniu). | doprecyzowanie użytkownika |
| W2 | Pliki nie są publicznie dostępne. | polecenie główne |
| W3 | Osoba postronna, **która ma link**, nie może odtworzyć pliku. | odpowiedź na pytanie o poziom ochrony |
| W4 | Hasło podawane raz, nie przy każdym odtworzeniu. | polecenie główne |
| W5 | Koszt 0 zł z twardym limitem wydatków; karta akceptowalna tylko przy limicie 0 zł. | odpowiedź na pytanie o kartę |
| W6 | Aplikacja pozostaje na GitHub Pages. | odpowiedź na pytanie o hosting |
| W7 | Dane o plikach (nazwy, ścieżki) ukryte, nie w publicznym repo. | polecenie główne |
| W8 | Skala: ok. 400 MB / 1793 pliki dziś, docelowo ≤ 5 GB. | doprecyzowanie użytkownika |
| W9 | Warstwa demo (242 pliki `WH40k_Boltgun`) pozostaje publiczna i działa bez logowania — korzysta z niej bliźniacza aplikacja. | doprecyzowanie użytkownika |

Wymaganie **W3 jest rozstrzygające**. Wyklucza ono rozwiązania oparte na „nieodgadywalnym adresie” (zahaszowane ścieżki, `unlisted` hosting), ponieważ tam posiadanie linku **jest** równoznaczne z dostępem. Wymusza więc jedno z dwóch:

- **serwer weryfikuje uprawnienie przed wydaniem każdego pliku**, albo
- **plik jest zaszyfrowany i sam link jest bezużyteczny bez klucza**.

Wymaganie W3 w praktycznej wersji oznacza: link może istnieć, ale musi **wygasać**. Podpisany URL ważny 60–300 sekund spełnia W3 w sposób operacyjnie sensowny — po tym czasie skopiowany link jest martwy.

Wymaganie **W9 zmienia kształt rozwiązania**: docelowa architektura nie może traktować biblioteki jednorodnie. Musi obsłużyć jednocześnie zbiór publiczny (bez logowania, bez podpisów, bez zmian) i zbiór chroniony (za bramką). Szczegóły w sekcji 6.3.

---

## 6. Wzorzec rozwiązania

Wszystkie sensowne warianty mają tę samą architekturę trójwarstwową. Różnią się wyłącznie tym, gdzie fizycznie leżą pliki.

```
┌─────────────────────────────────────────────────────────────┐
│  A. MAGAZYN (prywatny)                                      │
│     bucket / prywatne repo — brak publicznego adresu        │
└──────────────────────────┬──────────────────────────────────┘
                           │ dostęp tylko z sekretem
┌──────────────────────────▼──────────────────────────────────┐
│  B. BRAMKA (Cloudflare Worker)                              │
│     jedyny publiczny endpoint; przechowuje sekrety;         │
│     wystawia: /login, /manifest, /sign (lub /a/<id>)        │
└──────────────────────────┬──────────────────────────────────┘
                           │ token sesji + podpisane URL-e
┌──────────────────────────▼──────────────────────────────────┐
│  C. KLIENT (Audio/index.html na GitHub Pages)               │
│     logowanie RAZ → token w localStorage (np. 30 dni)       │
└─────────────────────────────────────────────────────────────┘
```

### 6.1. Przepływ działania

1. **Start modułu.** Klient sprawdza `localStorage` pod kluczem np. `audio.session`.
2. **Brak lub wygasła sesja.** Moduł pokazuje **własne** pole hasła (nie okno przeglądarki) i wysyła `POST /login` z hasłem grupy. Bramka odpowiada tokenem sesji (JWT lub podpis HMAC) ważnym np. 30 dni. Token trafia do `localStorage`.
3. **Pobranie manifestu.** `GET /manifest` z tokenem w nagłówku `Authorization`. Bramka zwraca JSON zawierający wyłącznie identyfikatory, nazwy widoczne w UI, tagi i liczbę wariantów — **bez ścieżek i nazw plików**.
4. **Odtworzenie.** Klik w kafelek → `GET /sign?id=<id>` z tokenem → bramka zwraca `{ url, exp }`, gdzie `url` jest ważny 60–300 sekund. Moduł tworzy `new Audio(url)`.
5. **Pętla (`Loop`).** Przy każdym zdarzeniu `ended` moduł bierze kolejny wariant i — jeżeli poprzedni podpis wygasł — pobiera świeży. Podpisy warto trzymać w pamięci do czasu `exp`, żeby nie mnożyć żądań.

### 6.2. Dlaczego to rozwiązuje problem z sekcji 4

- Hasło pojawia się **raz na 30 dni na urządzenie**, w interfejsie modułu, a nie w oknie przeglądarki.
- Autoryzacja pliku jedzie w **query stringu** podpisanego URL-a — nie ma ciasteczka, nie ma nagłówka `WWW-Authenticate`, nie ma przekierowania na logowanie.
- Third-party cookies są całkowicie poza obiegiem, więc blokady przeglądarek nie mają na co zadziałać.

### 6.3. Obsługa dwóch warstw biblioteki

Wymaganie W9 oznacza, że manifest wydawany przez bramkę musi rozróżniać typ wpisu. Najprostsza forma to jedno dodatkowe pole:

| Pole | Warstwa demo | Warstwa chroniona |
| --- | --- | --- |
| `access` | `"public"` | `"protected"` |
| adres pliku | gotowy, stały URL do `AudioExample` na GitHub Pages | brak — klient musi poprosić bramkę o podpis |

Zachowanie klienta:

- wpis `public` → moduł odtwarza bezpośrednio, **bez** wywołania `/sign`, dokładnie tak jak dziś,
- wpis `protected` → moduł pobiera podpisany URL z bramki.

Konsekwencje takiego podziału:

1. **Bliźniacza aplikacja pozostaje nietknięta.** Repozytorium `AudioExample` i jego adresy nie zmieniają się w ogóle.
2. **Oszczędność limitu żądań.** 242 pliki demo w ogóle nie obciążają limitu 100 000 żądań na dobę w Workerze.
3. **Warstwa demo nie wymaga CORS.** Pozostaje na `cutelittlegoat.github.io`, czyli na tym samym origin co aplikacja — Web Audio działa tam bez `crossOrigin` i bez nagłówków (sekcja 8 dotyczy wyłącznie warstwy chronionej).
4. **Możliwy tryb bez logowania.** Moduł może wystartować na samej warstwie demo i poprosić o hasło dopiero przy pierwszej próbie odtworzenia pliku chronionego. Dla osoby postronnej moduł wygląda wtedy jak działające demo, a nie jak ekran logowania.
5. **Manifest publiczny może zostać rozdzielony.** Część demo (242 wpisy) może pozostać w repozytorium jako plik statyczny, skoro niczego nie ujawnia; z repozytorium znika wyłącznie część chroniona (1551 wpisów). To upraszcza wdrożenie i ogranicza zakres zmian w `parseManifest()`.

---

## 7. Warianty rozwiązania

### 7.1. Wariant A — Cloudflare Workers Static Assets + Worker jako bramka **(REKOMENDOWANY)**

**Idea:** pliki audio i bramka są jednym wdrożeniem Workera. Pliki są wgrane jako static assets, a reguła `run_worker_first` sprawia, że żądanie o plik zawsze najpierw trafia do kodu Workera, który sprawdza podpis i dopiero wtedy oddaje bajty przez `env.ASSETS.fetch()`.

**Limity planu Workers Free (stan na wrzesień 2026):**

| Limit | Wartość | Nasza sytuacja |
| --- | --- | --- |
| Liczba plików statycznych na wersję Workera | 20 000 | 1551 plików chronionych — zapas ponad 12× |
| Maksymalny rozmiar pojedynczego pliku | 25 MiB | największy zmierzony sampel ~302 kB |
| Koszt przechowywania assetów | brak dodatkowego kosztu | — |
| Żądania do Workera | 100 000 / dzień | patrz niżej |
| Czas CPU na żądanie | 10 ms | strumieniowanie ciała to I/O, nie CPU |
| Podżądania na żądanie | 50 | wystarcza |
| Rozmiar skryptu Workera (spakowany) | 3 MB | bramka to kilkaset linii |

**Kluczowa cecha dla wymagania W5:** plan Workers Free **nie nalicza opłat po przekroczeniu limitu — zwraca `429 Too Many Requests`**. To jest twardy limit 0 zł z definicji, bez konieczności ustawiania czegokolwiek i **bez podawania karty płatniczej** (Cloudflare deklaruje rejestrację bez karty). Dokumentacja Cloudflare wprost ostrzega, że żądania objęte `run_worker_first` po wyczerpaniu darmowego limitu dostaną `429` — czyli usługa się zatrzymuje, a nie generuje rachunek.

**Zgodność z regulaminem:** warunki szczegółowe Cloudflare zezwalają na serwowanie przez Workers i Pages treści nie-HTML, w tym **plików audio** — wyłączone są pliki wideo. Nasz przypadek mieści się w dozwolonym użyciu.

**Zalety:**

- Zero karty płatniczej, twardy limit 0 zł.
- Jedno wdrożenie = magazyn + bramka. Najmniej ruchomych części.
- Pełna kontrola nagłówków odpowiedzi → można ustawić `Access-Control-Allow-Origin: https://cutelittlegoat.github.io`, co jest **konieczne** dla Web Audio (sekcja 8).
- Warstwa chroniona (1551 plików, podzbiór 400 MB) mieści się z bardzo dużym zapasem.

**Wady i ograniczenia:**

- Aktualizacja biblioteki = ponowny deploy przez `wrangler`. Przy 400 MB to operacja kilkuminutowa, nie codzienna.
- Cloudflare nie dokumentuje limitu **sumarycznego** rozmiaru assetów (tylko liczbę plików i rozmiar pojedynczego). Przy 400 MB nie ma powodu do obaw, ale przy zbliżaniu się do 5 GB należy to zweryfikować praktycznie.
- Każde odtworzenie zużywa żądania Workera. Element `<audio>` potrafi wykonać 2–4 żądania na plik (żądanie wstępne + `Range`). Przy limicie 100 000/dzień daje to rząd **25 000–50 000 odtworzeń dziennie** — dla grupy RPG to zapas nierealny do wyczerpania.

### 7.2. Wariant B — Cloudflare R2 + Worker

**Idea:** pliki w prywatnym buckecie R2. Worker generuje presigned URL (S3, Signature V4) i oddaje go klientowi — bajty lecą prosto z R2, z pominięciem Workera.

**Limity darmowego progu R2:**

| Pozycja | Darmowy próg |
| --- | --- |
| Przechowywanie | 10 GB-miesiąc |
| Operacje klasy A (zapis/lista) | 1 mln / miesiąc |
| Operacje klasy B (odczyt) | 10 mln / miesiąc |
| Egress (transfer wyjściowy) | **darmowy, bez limitu** |
| Maksymalna ważność presigned URL | 7 dni |

**Zalety:**

- Zerowy koszt transferu to model wręcz stworzony pod strumieniowanie audio.
- 10 GB pokrywa deklarowany cel 5 GB z dwukrotnym zapasem.
- Presigned URL zdejmuje ruch z Workera — limit 100 000 żądań/dzień dotyczy wtedy tylko podpisywania, nie bajtów.
- Wygodna aktualizacja biblioteki (`rclone`, `wrangler r2 object put`, S3 API) bez redeployu.

**Wady — i powód, dla którego to nie jest rekomendacja podstawowa:**

- Aktywacja R2 wymaga przejścia przez **checkout subskrypcji** w panelu Cloudflare. Dokumentacja mówi wprost: „You need a Cloudflare account with an R2 subscription”.
- **Cloudflare nie oferuje twardego limitu wydatków.** Są powiadomienia i alerty budżetowe, ale nie ma mechanizmu, który zatrzyma usługę na kwocie 0 zł. Po przekroczeniu 10 GB naliczana jest opłata (rzędu 0,015 USD za GB-miesiąc — groszowa, ale niezerowa).
- To bezpośrednio koliduje z wymaganiem W5 w brzmieniu podanym przez użytkownika („tylko jeżeli da się ustawić limit wydatków 0 zł”).
- Presigned URL wskazuje na `*.r2.cloudflarestorage.com`, więc dla Web Audio konieczna jest **konfiguracja CORS na buckecie**. Znana pułapka: w R2 `AllowedHeaders: "*"` bywa zawodne — należy podać `content-type` jawnie.

**Kiedy wybrać B:** jeżeli po weryfikacji użytkownik uzna ryzyko groszowej nadpłaty za akceptowalne, wariant B jest technicznie najczystszy przy dużej i często aktualizowanej bibliotece.

### 7.3. Wariant C — prywatne repozytorium GitHub + Worker jako bramka

**Idea:** pliki zostają dokładnie tam, gdzie są dziś — w prywatnym repozytorium `AudioRPG`, które pozostaje prywatne **na stałe**. Worker przechowuje fine-grained PAT (uprawnienia: tylko odczyt `Contents`, tylko to jedno repo) i pośredniczy w dostępie. Zamiast przełącznika „prywatne / publiczne” z sekcji 3.3 pojawia się brakujący trzeci stan: repozytorium zostaje prywatne, a dostęp dostaje wyłącznie bramka.

Dwa podwarianty:

**C1 — proxy przez Workera.** Worker pobiera plik z API GitHuba i przekazuje strumień do klienta, dodając własne nagłówki CORS.

**C2 — przekierowanie na podpisany URL GitHuba.** Pliki wgrane jako *release assets*. Worker odpytuje API, dostaje `302` i przekazuje klientowi docelowy adres.

**Weryfikacja empiryczna C2 (wykonana w ramach analizy):**

Zapytanie o asset release'a zwraca `302` z przekierowaniem na `release-assets.githubusercontent.com` z parametrami `sig=`, `se=` (czas wygaśnięcia) oraz `jwt=` z własnym `exp`. Adres jest więc **z natury podpisany i czasowo ograniczony** (ok. 1 godziny) — dokładnie taki mechanizm, jakiego wymaga W3.

Nagłówki odpowiedzi końcowej:

```
HTTP/1.1 200 OK
Content-Length: 10702247
Accept-Ranges: bytes                    ← Range działa
Content-Disposition: attachment; ...
Content-Type: application/octet-stream
Server: Windows-Azure-Blob/1.0
```

**Brak nagłówka `Access-Control-Allow-Origin`** — sprawdzone z nagłówkiem `Origin: https://cutelittlegoat.github.io`.

Konsekwencja jest twarda: w wariancie C2 `createMediaElementSource()` **skazi graf Web Audio i dźwięk będzie cichy**. C2 wymagałby albo rezygnacji z Web Audio na rzecz `audio.volume` (moduł ma już taką ścieżkę awaryjną, ale kosztem wzmocnienia powyżej 100%), albo zejścia do C1.

**Limity GitHuba:**

| Pozycja | Wartość |
| --- | --- |
| Repozytoria prywatne w planie Free | bez limitu liczby |
| Zalecany rozmiar repozytorium | < 1 GB (mocno zalecane < 5 GB) |
| Twardy limit pojedynczego pliku | 100 MiB |
| Release assets — suma rozmiarów | GitHub nie limituje sumy ani transferu |
| Rate limit API z tokenem | 5000 żądań / godzinę |

**Zalety:**

- **Zero migracji plików** — są już w prywatnym repozytorium `AudioRPG`, a struktura folderów z manifestu pozostaje aktualna.
- Znika potrzeba przełączania repozytorium na publiczne przed sesją — obecne obejście przestaje być potrzebne.
- Zero karty, twardy limit 0 zł z definicji (brak konta rozliczeniowego = brak możliwości naliczenia opłaty).
- Release assets nie liczą się do rozmiaru repozytorium i nie mają limitu sumy — jedyna z analizowanych opcji, która skaluje się powyżej 10 GB bez żadnej opłaty.

**Wady:**

- 400 MB jako zwykłe pliki mieści się w zaleceniu < 1 GB, ale przy 5 GB repozytorium robi się nieporęczne (klon, historia). Wtedy obowiązkowo release assets.
- C1 przepuszcza wszystkie bajty przez Workera — mocniej zużywa limit 100 000 żądań/dzień.
- C2 nie nadaje się do obecnej konstrukcji Web Audio (brak CORS, patrz wyżej).
- Rate limit 5000 żądań/h na API GitHuba — przy C2 dotyczy tylko podpisywania, więc nie jest wąskim gardłem, ale trzeba go pamiętać.
- Zależność od dwóch dostawców jednocześnie (GitHub + Cloudflare).

### 7.4. Wariant D — szyfrowanie plików po stronie klienta (AES-GCM)

**Idea:** pliki są zaszyfrowane przed wgraniem i leżą na **dowolnym publicznym** hostingu statycznym. Przeglądarka pobiera zaszyfrowany blob, odszyfrowuje go w pamięci kluczem podanym raz przy logowaniu (wyprowadzonym z hasła przez PBKDF2), tworzy `Blob URL` i odtwarza.

**Zalety:**

- **Nie wymaga żadnego konta, żadnej karty i żadnego serwera.** Najniższy próg wejścia z całej listy.
- Spełnia W3 w najmocniejszej formie: link do zaszyfrowanego pliku jest **całkowicie bezużyteczny** bez klucza. Nie wygasa — po prostu nic nie znaczy.
- `Blob URL` jest **same-origin**, więc Web Audio działa **bez żadnej konfiguracji CORS**. To eliminuje pułapkę z sekcji 8.
- Może działać na istniejącym GitHub Pages (przy 400 MB — poniżej limitu 1 GB).

**Wady:**

- Brak strumieniowania: cały plik musi zostać pobrany i odszyfrowany **przed** rozpoczęciem odtwarzania. Dla krótkich SFX (kilkadziesiąt–kilkaset kB) to niezauważalne. Dla długich pętli ambientowych oznacza wyraźne opóźnienie startu.
- Brak przewijania w pliku (`Range` nie ma zastosowania).
- Zużycie pamięci: odszyfrowany blob w całości w RAM.
- AES-GCM weryfikuje integralność całości, więc nie da się częściowo odszyfrować. Strumieniowanie wymagałoby AES-CTR z podziałem na fragmenty — istotnie bardziej złożone.
- Klucz trafia do przeglądarki. Kto zna hasło, może wydobyć klucz i odszyfrować całość. (Uwaga: to ograniczenie dotyczy **wszystkich** wariantów — kto ma dostęp, ten ma dostęp.)
- Trzymanie 400 MB zaszyfrowanych blobów na GitHub Pages ociera się o zakaz używania Pages jako hostingu plików.

**Kiedy wybrać D:** jako rozwiązanie awaryjne, gdyby użytkownik nie chciał zakładać konta Cloudflare, albo jako uzupełnienie wariantu A dla szczególnie wrażliwych pozycji.

---

## 8. Pułapka krytyczna: Web Audio i CORS

Ten punkt zasługuje na osobną sekcję, ponieważ jego przeoczenie da objaw „wszystko działa, tylko nie ma dźwięku” — trudny do zdiagnozowania.

**Mechanizm.** `Audio/index.html:1330` wykonuje:

```js
const source = context.createMediaElementSource(audio);
```

Specyfikacja Web Audio wymaga, aby media podłączane do grafu audio były pozyskane **zgodnie z CORS**. Element `<audio>` załadowany z innej domeny **bez** atrybutu `crossOrigin` skutkuje „skażeniem” (tainting): `createMediaElementSource` zwraca węzeł, który emituje **ciszę**. Przeglądarka nie zgłasza przy tym błędu odtwarzania — plik ładuje się i „gra”, tylko nic nie słychać.

**Dlaczego dziś nie ma problemu.** Aplikacja i pliki są na tym samym origin (`cutelittlegoat.github.io`), więc CORS nie ma zastosowania.

**Co się zmieni.** Wymaganie W6 (aplikacja zostaje na GitHub Pages) w połączeniu z przeniesieniem plików gdziekolwiek indziej oznacza, że **każde** odtworzenie stanie się cross-origin.

**Co jest konieczne przy wdrożeniu:**

1. Po stronie klienta — ustawić atrybut **przed** przypisaniem źródła:

   ```js
   const audio = new Audio();
   audio.crossOrigin = "anonymous";   // musi być przed przypisaniem src
   audio.src = fullUrl;
   ```

   Obecny kod używa konstruktora `new Audio(fullUrl)`, który przypisuje `src` natychmiast — samo dopisanie `crossOrigin` po tej linii **nie zadziała**.

2. Po stronie serwera — odpowiedź musi zawierać:

   ```
   Access-Control-Allow-Origin: https://cutelittlegoat.github.io
   ```

   To eliminuje wariant C2 (GitHub release assets nie wysyłają tego nagłówka) i wymaga konfiguracji CORS w wariancie B (R2). W wariancie A nagłówek ustawia własny kod Workera — pełna kontrola. W wariancie D problem nie występuje (Blob URL jest same-origin).

**Ścieżka awaryjna, która już istnieje w module.** `applyPlayerVolume` obsługuje przypadek braku `AudioContext` i wtedy używa `audio.volume` ograniczonego do zakresu 0–1. Rezygnacja z Web Audio jest więc technicznie możliwa, ale kosztuje utratę wzmocnienia powyżej 100% (obecne `volumeToGain` mapuje suwak −100…100 na wzmocnienie 0…2).

---

## 9. Rozwiązania rozważone i odrzucone

| Rozwiązanie | Powód odrzucenia |
| --- | --- |
| **Firebase Storage** | Od 3 lutego 2026 wymaga planu Blaze (konto rozliczeniowe z kartą) niezależnie od wielkości użycia. Projekt na planie Spark nie ma dostępu do żadnego bucketu — wywołania API zwracają `402`/`403`. Sprzeczne z W5. |
| **Firebase Hosting** | Limit transferu **360 MB na dobę** — jedna sesja z pętlami ambientowymi go wyczerpie. Dodatkowo pliki są publiczne, co łamie W2 i W3. |
| **Supabase Storage** | Darmowy próg to 1 GB przestrzeni i 5 GB transferu — nie starcza na cel 5 GB. Projekty pauzują po 7 dniach bezczynności, co dla sporadycznych sesji RPG oznacza „nie działa, gdy potrzebne”. |
| **Backblaze B2** | 10 GB za darmo, ale **karta wymagana przy zakładaniu konta**, a transfer ponad 3× średniego magazynu jest płatny. Sprzeczne z W5. |
| **Cloudflare Access / HTTP Basic Auth** | To jest bezpośrednia przyczyna pierwotnego problemu (sekcja 4). Odrzucone z definicji. |
| **GitHub Pages z prywatnego repozytorium** | Opublikowana strona pozostaje publiczna. Kontrola dostępu do Pages istnieje wyłącznie w GitHub Enterprise Cloud. Łamie W2 i W3. |
| **Nieodgadywalne adresy (hashowane ścieżki)** | Nie spełnia W3: kto ma link, ten odtwarza. Użytkownik wprost postawił ten warunek. |
| **Google Drive + konto serwisowe** | 15 GB za darmo bez karty, ale Drive stosuje nieudokumentowane limity pobrań („download quota exceeded”) przy intensywnym udostępnianiu jednego pliku. Nieprzewidywalne dla odtwarzania na żywo podczas sesji. |
| **Vercel / Netlify** | Regulaminy planów darmowych ograniczają serwowanie mediów; ochrona hasłem katalogów jest funkcją płatną. |

---

## 10. Rekomendacja

### 10.1. Wybór podstawowy: Wariant A

**Cloudflare Workers Static Assets + Worker jako bramka**, z manifestem serwowanym przez bramkę.

Uzasadnienie punkt po punkcie:

| Wymaganie | Jak wariant A je spełnia |
| --- | --- |
| W1 — pliki online | Pliki leżą w infrastrukturze Cloudflare, dostępne przez HTTPS. |
| W2 — nie publiczne | `run_worker_first` gwarantuje, że **żadne** żądanie nie ominie kontroli podpisu. |
| W3 — link nie wystarczy | Podpis HMAC z czasem wygaśnięcia 60–300 s. Skopiowany link umiera po minucie. |
| W4 — hasło raz | Token sesji w `localStorage`, ważność 30 dni. Zero okien przeglądarki. |
| W5 — twarde 0 zł | Plan Workers Free nie nalicza nadpłat — zwraca `429`. Bez karty płatniczej. |
| W6 — aplikacja na Pages | Aplikacja zostaje bez zmian; Worker jest wyłącznie źródłem danych i plików. |
| W7 — ukryte dane | `AudioManifest.xlsx` wypada z publicznego repozytorium; bramka wydaje manifest bez ścieżek. |
| W8 — skala | Do bramki trafia 1551 plików chronionych z limitu 20 000; 400 MB przy limicie 25 MiB/plik. Zapas rzędu 10×. |
| W9 — warstwa demo | Wpisy `public` w manifeście omijają bramkę. `AudioExample` i bliźniacza aplikacja bez zmian. |

### 10.2. Plan awaryjny

- Jeżeli biblioteka przekroczy wygodę pojedynczego deployu (orientacyjnie > 2–3 GB) → **Wariant C1** (prywatne repo GitHub + proxy przez Workera), nadal bez karty i bez opłat.
- Jeżeli użytkownik po analizie ryzyka zaakceptuje groszową nadpłatę powyżej 10 GB → **Wariant B** (R2), technicznie najczystszy przy dużej i często aktualizowanej bibliotece.
- Jeżeli użytkownik nie chce zakładać konta Cloudflare w ogóle → **Wariant D** (szyfrowanie AES-GCM), z akceptacją braku strumieniowania.

### 10.3. Zakres bramki (Worker)

Minimalny zestaw endpointów:

| Endpoint | Metoda | Działanie |
| --- | --- | --- |
| `/login` | `POST` | Przyjmuje hasło grupy, porównuje w czasie stałym (`timingSafeEqual`), zwraca token sesji ważny 30 dni. |
| `/manifest` | `GET` | Weryfikuje token, zwraca JSON: `id`, `label`, `tags`, `tag2`, `groupCount`, liczba wariantów. **Bez** `filename` i `folderUrl`. |
| `/sign` | `GET` | Weryfikuje token, zwraca podpisany URL do wariantu o podanym `id`, ważny 60–300 s. |
| `/a/<hash>` | `GET` | Objęty `run_worker_first`. Weryfikuje podpis i `exp`, przy powodzeniu zwraca plik z `env.ASSETS.fetch()` plus nagłówki CORS. |

Sekrety (hasło grupy, klucz HMAC) przechowywane wyłącznie jako sekrety Workera (`wrangler secret put`) — **nigdy w repozytorium**, zgodnie z §13 `AGENTS.md`.

---

## 11. Konsekwencje dla kodu modułu (do wykonania w osobnym zadaniu)

Poniższa lista jest **inwentaryzacją**, nie zestawem wykonanych zmian. Zgodnie z poleceniem w kodzie nic nie zmieniono.

| Lokalizacja | Stan obecny | Wymagana zmiana |
| --- | --- | --- |
| `Audio/index.html:1972` — `parseManifest()` | `fetch("AudioManifest.xlsx")` + parsowanie SheetJS | `fetch("<worker>/manifest")` z nagłówkiem `Authorization`; JSON zamiast XLSX. Import SheetJS staje się zbędny w ścieżce produkcyjnej. |
| `Audio/index.html:943` — `normalizeUrl()` | Skleja `folder + "/" + plik` | Zastąpić rozwiązywaniem `id` → podpisany URL z bramki. |
| `Audio/index.html:1988-1990` | Odczyt `NazwaSampla` / `NazwaPliku` / `LinkDoFolderu` | Odczyt pól z JSON-a bramki; pola ze ścieżkami znikają. |
| `Audio/index.html:970` — `extractTags()` | Wyprowadza tagi ze ścieżki folderu | Tagi muszą przyjść gotowe z bramki — inaczej ścieżki wracają do klienta i W7 jest złamane. Dotyczy wyłącznie warstwy chronionej; dla wpisów `public` ścieżka może zostać. |
| `Audio/index.html:1205` / `1311` — rozgałęzienie po typie wpisu | Brak — wszystkie wpisy traktowane jednakowo | Dodać obsługę pola `access`: `public` → URL wprost z manifestu, `protected` → URL z `/sign` (sekcja 6.3). |
| `Audio/index.html:1322` — `new Audio(fullUrl)` | Konstruktor przypisuje `src` od razu | Rozdzielić: `new Audio()` → `audio.crossOrigin = "anonymous"` → `audio.src = url`. **Bez tego Web Audio da ciszę** (sekcja 8). |
| `Audio/index.html:1311` — `startPlayback()` | URL statyczny, ważny bezterminowo | URL wygasa — potrzebny cache podpisów z czasem `exp` i odświeżanie przed użyciem. |
| `Audio/index.html:1345` — obsługa `ended` w pętli | Kolejna iteracja bierze URL z manifestu | Kolejna iteracja musi mieć ważny podpis; przy 300 s ważności i pętli ambientowej to oznacza odświeżanie w trakcie. |
| `Audio/index.html:1205` — `pickRandomVariant()` | Losuje po `variants[].fullUrl` | Losuje po identyfikatorach wariantów; URL powstaje dopiero po podpisaniu. |
| Nowy element UI | Brak | Ekran/pole logowania (własne, nie natywne okno przeglądarki) + obsługa wygaśnięcia sesji. |
| `Audio/AudioManifest.xlsx` | W publicznym repozytorium | Usunąć z repozytorium, dodać do `.gitignore`. Trzymać lokalnie jako źródło do generowania manifestu bramki. |
| `Audio/config/firebase-config.js` | Firestore dla list ulubionych | Bez zmian — Firestore na planie Spark obsługuje ustawienia (50 000 odczytów/dobę, 1 GiB) i pozostaje darmowy z twardym limitem. |
| `Audio/docs/README.md`, `Audio/docs/Documentation.md` | Opisują XLSX i publiczne adresy | Aktualizacja obowiązkowa po wdrożeniu (§1 i §3 `AGENTS.md`). |

---

## 12. Ryzyka

### 12.1. Ryzyka wymagające działania niezależnie od wybranego wariantu

| Ryzyko | Opis | Zalecane działanie |
| --- | --- | --- |
| **Przełączanie `AudioRPG` na publiczne** | Obejście stosowane dziś, żeby moduł zagrał, upublicznia na ten czas **całą** warstwę chronioną — z możliwością zindeksowania i pobrania hurtem. Przy plikach płatnych ryzyko rośnie nieproporcjonalnie. | Traktować jako rozwiązanie tymczasowe i zaprzestać go po wdrożeniu bramki. Nie dodawać plików płatnych, dopóki obejście jest w użyciu. |
| **Regresja warstwy demo** | Zmiany w module mogą przypadkiem skierować wpisy `WH40k_Boltgun` przez bramkę albo naruszyć adresy, z których korzysta bliźniacza aplikacja. | Objąć testem odbiorczym: warstwa demo działa **bez zalogowania**, a repozytorium `AudioExample` pozostaje nietknięte. |
| **Historia gita** | Usunięcie `AudioManifest.xlsx` z HEAD **nie usuwa go z historii repozytorium**, z forków ani z pamięci podręcznych wyszukiwarek. | Świadoma decyzja: albo przepisanie historii (`git filter-repo`) z konsekwencjami dla klonów, albo akceptacja, że dotychczasowy katalog pozostaje ujawniony. Warto pamiętać, że i tak wskazuje on na adresy, które przestaną działać. |
| **Prawa autorskie** | Mechanizm techniczny ogranicza krąg odbiorców, ale **nie tworzy licencji**. Nazwy folderów wskazują na materiały z płatnych pakietów (Patreon). | Zweryfikować warunki licencji każdego pakietu. Prywatny użytek grupowy bywa dozwolony, redystrybucja — zwykle nie. |

### 12.2. Ryzyka wdrożeniowe

| Ryzyko | Wpływ | Ograniczenie |
| --- | --- | --- |
| Cisza zamiast dźwięku po migracji | Wysoki — objaw mylący, trudny do diagnozy | Sekcja 8. Przetestować `crossOrigin` + CORS na **jednym** pliku, zanim przeniesie się całą warstwę chronioną. |
| Sekret w repozytorium | Krytyczny | Wyłącznie `wrangler secret put`. Zgodnie z §13 `AGENTS.md`. |
| Token w `localStorage` | Średni | Kto ma odblokowane urządzenie, ma dostęp. Akceptowalne dla grupy RPG; ograniczyć ważność do 30 dni. |
| Zmiana hasła grupy | Niski | Rotacja klucza HMAC unieważnia **wszystkie** sesje — każdy loguje się ponownie. Zaplanować poza sesją. |
| Wyczerpanie 100 000 żądań/dobę | Niski | Zwraca `429`, nie rachunek. Ograniczać przez cache podpisów po stronie klienta i nagłówki `Cache-Control` na plikach. |
| Brak udokumentowanego limitu sumy assetów | Niski przy 400 MB, średni przy 5 GB | Zweryfikować praktycznie przy pierwszym dużym deployu. |
| Awaria bramki = cisza na sesji | Średni | Rozważyć lokalny cache najczęściej używanych dźwięków (Cache API / IndexedDB) na czas sesji. |
| Zależność od jednego dostawcy | Niski | Manifest źródłowy (XLSX) trzymany lokalnie pozwala odtworzyć całość u innego dostawcy. |

---

## 13. Następne kroki

### Etap 0 — decyzje (przed jakimkolwiek kodem)

1. Zatwierdzić wariant: **A** (rekomendowany), **B**, **C1** lub **D**.
2. Potwierdzić podział na warstwy z sekcji 6.3 i to, że warstwa demo ma działać bez logowania.
3. Rozstrzygnąć kwestię historii gita dla `AudioManifest.xlsx`.
4. Ustalić model logowania: jedno wspólne hasło grupy (prostsze) czy kody per osoba (możliwość odebrania dostępu pojedynczej osobie).

### Etap 1 — weryfikacja techniczna na małej próbce

5. Założyć konto Cloudflare (plan Free, bez karty).
6. Wdrożyć minimalny Worker z **jednym** plikiem testowym: `/login`, `/sign`, `/a/<hash>` + nagłówki CORS.
7. **Test rozstrzygający:** odtworzyć ten plik ze strony na `cutelittlegoat.github.io` przez `createMediaElementSource` z ustawionym `crossOrigin = "anonymous"`. Potwierdzić, że **słychać dźwięk** i że suwak głośności działa.
8. Potwierdzić, że podpisany URL przestaje działać po upływie `exp`.
9. Potwierdzić, że po zamknięciu i ponownym otwarciu przeglądarki **nie pojawia się pytanie o hasło**.

Dopiero pozytywny wynik kroków 7–9 uzasadnia przejście dalej.

### Etap 2 — migracja

10. Przygotować skrypt generujący z `AudioManifest.xlsx`: manifest JSON z polem `access` (`public` / `protected`, sekcja 6.3) + mapowanie `id` → ścieżka pliku dla warstwy chronionej.
11. Wgrać **wyłącznie warstwę chronioną** (1551 plików). Warstwa demo zostaje w `AudioExample` bez zmian.
12. Zmierzyć czas deployu i potwierdzić brak problemów z limitem sumarycznym.

### Etap 3 — zmiany w module

13. Wykonać zmiany z sekcji 11 (osobne zadanie, osobny commit).
14. Usunąć `AudioManifest.xlsx` z repozytorium i dodać do `.gitignore`.
15. Zaktualizować `Audio/docs/README.md` i `Audio/docs/Documentation.md` zgodnie z §1 i §3 `AGENTS.md`.
16. Dopisać do niniejszego pliku sekcję „Zmiany wykonane w kodzie” zgodnie z §12 `AGENTS.md`.

### Etap 4 — test na żywo

17. Przeprowadzić próbną sesję: widok główny, listy ulubionych, pętle ambientowe, kilka dźwięków równocześnie.
18. Sprawdzić zużycie żądań Workera względem limitu 100 000/dobę.
19. **Test regresji warstwy demo:** otworzyć moduł bez zalogowania i potwierdzić, że pliki `WH40k_Boltgun` grają. Potwierdzić, że bliźniacza aplikacja działa bez zmian.
20. Po potwierdzeniu, że bramka działa, **zaprzestać przełączania `AudioRPG` na publiczne** i pozostawić to repozytorium prywatnym na stałe.

---

## 14. Źródła

Stan na 2 września 2026.

- [Cloudflare Workers — Platform limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Cloudflare Workers — Static assets](https://developers.cloudflare.com/workers/static-assets/)
- [Cloudflare Workers — Static assets: billing and limitations](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- [Cloudflare Workers — Sign requests](https://developers.cloudflare.com/workers/examples/signing-requests/)
- [Cloudflare Workers — Protect against timing attacks](https://developers.cloudflare.com/workers/examples/protect-against-timing-attacks/)
- [Cloudflare R2 — Pricing](https://developers.cloudflare.com/r2/pricing/)
- [Cloudflare R2 — Get started](https://developers.cloudflare.com/r2/get-started/)
- [Cloudflare R2 — Presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)
- [Cloudflare Workers KV — Limits](https://developers.cloudflare.com/kv/platform/limits/)
- [Cloudflare One — Authorization cookie: CORS](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/cors/)
- [Cloudflare — Goodbye, section 2.8 and hello to Cloudflare's new terms of service](https://blog.cloudflare.com/updated-tos)
- [GitHub Docs — GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [GitHub Docs — About large files on GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)
- [GitHub Docs — REST API: Releases / Assets](https://docs.github.com/en/rest/releases/assets)
- [Firebase — Default bucket and billing requirements for Cloud Storage after September 2024](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024)
- [Firebase — Hosting usage, quotas and pricing](https://firebase.google.com/docs/hosting/usage-quotas-pricing)
- [Firestore — Usage and limits](https://firebase.google.com/docs/firestore/quotas)
- [Backblaze — B2 Cloud Storage pricing](https://www.backblaze.com/cloud-storage/pricing)
- [Google Drive API — Usage limits](https://developers.google.com/workspace/drive/api/guides/limits)

Pomiary własne wykonane w ramach analizy (zapytania HTTP do `cutelittlegoat.github.io` oraz `github.com/*/releases/download/*`, parsowanie `Audio/AudioManifest.xlsx`) opisano w sekcjach 3.2, 3.3 i 7.3.

---

## Zmiany wykonane w kodzie

Wdrożenie z 2 września 2026. Zrealizowano **wariant C** (pliki pozostają w prywatnym repozytorium `AudioRPG`, bramka Cloudflare Worker), zgodnie z decyzją użytkownika. Ustalenia: sesja 30 dni, ważność podpisanego linku 1 godzina (wyrównana do pełnej godziny), start modułu bez logowania.

### Pliki nowe

| Plik | Rola |
| --- | --- |
| `Audio/worker/audio-gate.js` | Kod bramki dostępu (430 linii). Endpointy `/health`, `/login`, `/manifest`, `/sign`, `/a`. |
| `Audio/tools/build-manifests.mjs` | Generator manifestów (270 linii). Powiela logikę identyfikatorów modułu. |
| `Audio/AudioManifestDemo.json` | Manifest warstwy publicznej, 112 pozycji / 242 warianty. |

### Pliki usunięte z repozytorium

| Plik | Powód |
| --- | --- |
| `Audio/AudioManifest.xlsx` | Zawierał pełny katalog materiałów chronionych. Przeniesiony poza repozytorium, dodany do `.gitignore`. |

### Plik: `Audio/index.html`

Lokalizacja: `<head>`, po arkuszu Google Fonts

Było: brak.

Jest: `<link rel="stylesheet" href="../shared/access-gate.css"/>` — podpięcie wspólnego arkusza bramki, tego samego co w `DataVault` i `GeneratorNPC`.

---

Lokalizacja: sekcja `<style>`, przed `.btn-danger`

Było: brak klasy `.btn.primary`.

Jest: `.btn.primary` z `background: var(--text)`, `color: #04140a`, `border-color: rgba(22, 198, 12, 0.35)` oraz `:hover` z `filter: brightness(1.08)`. Bez tej klasy przycisk „Rozpocznij Rytuał" byłby obrysowany zamiast wypełnionego i odbiegałby wyglądem od DataVault.

---

Lokalizacja: znaczniki, przed skryptem modułu

Było: brak.

Jest: blok `#accessGate` odwzorowujący układ z `DataVault/index.html` — `.accessGate__card`, `.accessGate__iconSlot` z ikoną `../IkonaPowiadomien2.png`, nagłówek, opis, `#accessForm` z siatką `.accessGate__credentials`, `.accessGate__error`.

---

Lokalizacja: znaczniki, pasek statusów i toolbar

Było: trzy statusy (`manifestStatus`, `firebaseStatus`, `favoritesStatus`), toolbar z `reloadManifest`.

Jest: dodatkowo `#libraryStatus` oraz przyciski `#unlockLibrary` (toolbar admina) i `#unlockLibraryUser` (panel nawigacji widoku użytkownika).

---

Lokalizacja: znaczniki, przed skryptem modułu

Było: `<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>`

Jest: usunięte. Moduł nie parsuje już arkusza XLSX, więc zależność od SheetJS zniknęła.

---

Lokalizacja: linia 1029, po `TAG_IGNORE_SEGMENTS`

Było: brak.

Jest: stałe konfiguracyjne bramki:

```js
const AUDIO_GATE_BASE = "https://audio-gate.tarczynski-pawel.workers.dev";
const DEMO_MANIFEST_URL = "AudioManifestDemo.json";
const AUDIO_SESSION_STORAGE_KEY = "audio.session";
```

---

Lokalizacja: obiekt `state`

Było: bez pól sesji.

Jest: dodane `session: null` oraz `libraryUnlocked: false`.

---

Lokalizacja: linia 1325, funkcja `pickRandomVariant`

Było:

```js
const pickRandomVariant = (item, previousUrl = "") => {
  ...
  return item.variants[0]?.fullUrl || "";
```

Jest: funkcja zwraca **obiekt wariantu**, nie gotowy adres, i porównuje warianty przez `getVariantKey()` zamiast przez URL. Adres warstwy chronionej powstaje dopiero po podpisaniu przez bramkę, więc musi być pobierany asynchronicznie.

---

Lokalizacja: linia 1419, nowe funkcje po `pickRandomVariant`

Było: brak.

Jest: obsługa sesji (`loadSession`, `storeSession`, `hasValidSession`), pamięć podpisów `signedUrlCache`, `requestSignedUrl(path)` oraz `resolveVariantUrl(item, variant)`.

---

Lokalizacja: linia 1527

Było: brak.

Jest: mapa `playbackGeneration` i funkcja `bumpGeneration`. Zabezpieczenie przed wyścigiem: adres warstwy chronionej pobierany jest asynchronicznie, więc między kliknięciem a startem użytkownik może kliknąć coś innego na tym samym kafelku. `stopPlayback` również zwiększa numer pokolenia, żeby unieważnić trwające przygotowanie.

---

Lokalizacja: linia 1536, funkcja `startPlayback`

Było: funkcja synchroniczna, tworząca `new Audio(fullUrl)`.

Jest: funkcja asynchroniczna. Pobiera adres przez `resolveVariantUrl`, sprawdza numer pokolenia, obsługuje `gate_unauthorized` pokazaniem bramki.

---

Lokalizacja: linia 1584, w `startPlayback`

Było:

```js
const audio = new Audio(fullUrl);
```

Jest:

```js
const audio = new Audio();
if (item?.access !== "public") {
  audio.crossOrigin = "anonymous";
}
audio.src = fullUrl;
```

To najważniejsza zmiana z punktu widzenia działania. Konstruktor `new Audio(url)` przypisuje `src` natychmiast, a atrybut `crossOrigin` musi być ustawiony **przed** przypisaniem. Bez tego `createMediaElementSource` skaziłby graf Web Audio i dźwięk z bramki byłby cichy — bez żadnego błędu w konsoli.

---

Lokalizacja: linia 1807, funkcja `initFirebase`

Było: wywołania `initializeApp`, `getFirestore` i `onSnapshot` bez `try/catch`.

Jest: oba bloki opakowane w `try/catch` z przejściem na ustawienia lokalne, a wywołanie `initFirebase()` w bootstrapie także objęte `try/catch`.

Uzasadnienie: wykryte podczas testu w przeglądarce. Wyjątek z SDK Firebase (brak sieci, blokada w przeglądarce, zła konfiguracja) przerywał bootstrap **przed** wczytaniem manifestu, więc moduł zostawał całkiem pusty ze statusem „Manifest: brak danych". Błąd istniał przed tą zmianą.

---

Lokalizacja: linia 2311, dawniej `parseManifest`

Było: `parseManifest()` — pobranie `AudioManifest.xlsx`, parsowanie SheetJS, grupowanie wariantów, budowa tagów i identyfikatorów w przeglądarce (96 linii).

Jest: `loadManifests()` wraz z `fetchDemoManifest()`, `fetchProtectedManifest()` i `applyItems()`. Manifesty przychodzą gotowe, pogrupowane, z wyliczonymi identyfikatorami. Awaria warstwy chronionej nie blokuje warstwy demo.

---

Lokalizacja: linia 2685, przed bootstrapem

Było: brak.

Jest: logika bramki — `showAccessGate`, `hideAccessGate`, `submitAccessLitany`, `sealArchive`, `handleUnlockClick` oraz podpięcie zdarzeń.

---

Lokalizacja: obiekt `translations`, obie wersje językowe

Było: brak etykiet bramki.

Jest: `accessTitle`, `accessDescription`, `accessPasswordLabel`, `accessUnlockButton`, `accessWorking`, `accessEmpty`, `accessRejected`, `accessSilent`, `accessExpired`, `unlockLibrary`, `lockLibrary`, `libraryDemoOnly`, `libraryUnlocked`. Komunikaty błędów przeniesione dosłownie z `shared/firebase-data-loader.js`, żeby brzmiały identycznie jak w DataVault.

### Weryfikacja

| Test | Zakres | Wynik |
| --- | --- | --- |
| Zgodność identyfikatorów | Porównanie 1346 pozycji wygenerowanych przez generator z wynikiem oryginalnych funkcji wyciągniętych z `index.html`. | **0 różnic** w `id`, `label`, `groupCount`, `filename`, `tags`, `tagPaths`, `tag2` i liczbie wariantów. Zapisane listy ulubionych i aliasy zachowują powiązanie. |
| Testy bramki | 35 przypadków w Node z zaślepionym GitHubem: logowanie, ochrona endpointów, walidacja ścieżek, podpisy, wygasanie, `Range`, cache. | 35/35 |
| Testy w przeglądarce | 22 przypadki w Chromium (Playwright) na realnie serwowanym module. | 22/22 |
| Spójność danych | Porównanie 1551 ścieżek z manifestu z zawartością sklonowanego repozytorium `AudioRPG`. | 1551/1551, zero braków, zero plików osieroconych |

### Zaktualizowana dokumentacja

- `Audio/docs/README.md` — instrukcja użytkownika, obie wersje językowe: dwie warstwy biblioteki, Rytuał Dostępu, komunikaty, statusy.
- `Audio/docs/Documentation.md` — dokumentacja techniczna, obie wersje językowe: architektura bramki, endpointy, podpisy, pułapka `crossOrigin`, generowanie manifestów, procedura odtworzenia.
- `DetaleLayout.md` — sekcja bramki i statusów w module Audio, klasa `.btn.primary`, dopisanie modułu Audio do listy korzystających ze wspólnego arkusza.

### Do wykonania poza repozytorium

1. Wgranie `audio-manifest.json` do katalogu głównego prywatnego repozytorium `AudioRPG`.
2. Wklejenie `Audio/worker/audio-gate.js` do Workera `audio-gate` i wdrożenie.
3. Test na żywo zgodnie z sekcją „Testy kontrolne" w `Audio/docs/Documentation.md`.

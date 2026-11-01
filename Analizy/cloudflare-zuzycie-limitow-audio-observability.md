# Cloudflare — zużycie darmowych limitów przez moduł Audio i zmiana cennika Observability od 1 grudnia 2026 — analiza

> **Data:** 1 listopada 2026 (prompt otwierający: 29 października 2026; uzupełnienie o zrzuty ekranu po sesji: 1 listopada 2026; rozbudowa o rozdz. 10 — token GitHuba wyjaśniony prostym językiem: 1 listopada 2026)
> **Moduł:** `Audio` — bramka dostępowa `audio-gate` (Cloudflare Worker, kod w `Audio/worker/audio-gate.js`) oraz porzucony Worker `wrathandglory-push-api` (archiwum w `WebView_FCM_Cloudflare_Worker/`)
> **Stan kodu:** commit `b935527` (gałąź `main`)
> **Charakter dokumentu:** analiza bez zmian w kodzie, konfiguracji i danych. Pomiary pochodzą ze zrzutów ekranu panelu Cloudflare przesłanych przez użytkownika, limity — z oficjalnej dokumentacji Cloudflare, GitHuba i Google (stan na 1 listopada 2026, rozdz. 16).
> **Odpowiedź w jednym zdaniu:** **tak, zmieścisz się** — najcięższy zarejestrowany dzień zużył ok. 0,4% dziennego limitu żądań Workerów i odpowiadałby ok. 0,5% nowego dziennego limitu logów, a na planie darmowym nie da się dostać rachunku.
> **Stan po działaniach użytkownika (1 listopada 2026):** token GitHuba wymieniony na nowy, bez daty ważności; stary token i Worker `wrathandglory-push-api` usunięte; dźwięki z archiwum grają — rozdz. 15.

---

## Spis treści

1. [Prompty użytkownika (zachowane w całości)](#1-prompty-użytkownika-zachowane-w-całości)
2. [Zakres](#2-zakres)
3. [Podsumowanie](#3-podsumowanie)
4. [Co mówi mail od Cloudflare](#4-co-mówi-mail-od-cloudflare)
5. [Jak moduł Audio korzysta z Cloudflare](#5-jak-moduł-audio-korzysta-z-cloudflare)
6. [Porzucony Worker `wrathandglory-push-api`](#6-porzucony-worker-wrathandglory-push-api)
7. [Dane z panelu Cloudflare (zrzuty 1–5)](#7-dane-z-panelu-cloudflare-zrzuty-15)
8. [Szacunek zużycia](#8-szacunek-zużycia)
9. [GitHub i Firebase w module Audio](#9-github-i-firebase-w-module-audio)
10. [Token GitHuba — wyjaśnienie prostym językiem](#10-token-githuba--wyjaśnienie-prostym-językiem)
11. [Ryzyka](#11-ryzyka)
12. [Rekomendacje](#12-rekomendacje)
13. [Możliwe usprawnienia na przyszłość (obecnie niepotrzebne)](#13-możliwe-usprawnienia-na-przyszłość-obecnie-niepotrzebne)
14. [Następne kroki](#14-następne-kroki)
15. [Stan po działaniach użytkownika (1 listopada 2026)](#15-stan-po-działaniach-użytkownika-1-listopada-2026)
16. [Źródła](#16-źródła)

---

## 1. Prompty użytkownika (zachowane w całości)

Treść słowna promptów jest przepisana bez skrótów. Znaczniki załączonych obrazów zastąpiono numerami zrzutów ekranu — ich opis i odczyt są w rozdz. 7. Mail od Cloudflare (załącznik PDF) jest streszczony w rozdz. 4.

### 1.1 Prompt otwierający (29 października 2026)

> @"/root/.claude/uploads/1df13918-1b17-5e85-b4d4-a80e662476d8/ab60cd55-Cloudflare.pdf" Przeczytaj załączonego maila a następnie sprawdź kod modułu Audio.
> Miałem też kiedyś ustawionego workera do powiadomień push, ale nigdy nie dokończyłem projektu i nie będzie on kontynuowany. Detale masz w WebView_FCM_Cloudflare_Worker
>
>
> Przeprowadź bardzo dokładną analizę i oszacuj zużycie. Nie zamierzam przechodzić na płatny plan. Cała aplikacja ma działać na darmowych planach (zarówno GitHub, Firebase i Cloudflare). Nie zmieniaj nic w kodzie i przeprowadź tylko analizę.
> W najbliższych dniach planuję prowadzić jedną krótką przygodę w trakcie której będę kilkadziesiąt razy korzystać z plików audio.
> Po wszystkim porobię screeny z dashboarda mojego konta i uzupełnisz analizę. Tymczasem załączam kilka screenów z dashboarda i aktualny stan.
> [zrzut ekranu nr 1][zrzut ekranu nr 2][zrzut ekranu nr 3]

### 1.2 Uzupełnienie po sesji (1 listopada 2026)

> Załączam jeszcze dwa screeny po pełnej sesji (rozbita była na kilka dni) gry.
> [zrzut ekranu nr 4][zrzut ekranu nr 5]

### 1.3 Polecenie wysłane w trakcie pracy

> Kontynuuj pracę. Przeprowadź analizę i oszacuj czy zmieszczę się w darmowym limicie.

### 1.4 Polecenie publikacji analizy (1 listopada 2026)

> Wrzuć na main

### 1.5 Prośba o rozbudowę o kwestię tokenu (1 listopada 2026)

> Rozbuduj (na Main) analizę o kwestie tokena. Czy jego wygaśnięcie spowoduje tylko, się muszę ponownie wpisać hasło (takie działanie jest akceptowalne) czy wszystko przestanie działać i zawsze co 90dni będę musiał powtarzać operację (i czy muszę coś aktualizować w kodzie aplikacji?). Ten rozdział napisz jak dla osoby bez wiedzy informatycznej - prostym językiem.

Odpowiedź na to pytanie zawiera rozdz. 10.

### 1.6 Relacja z wykonanych kroków (1 listopada 2026)

> Wklejam screeny z kroków jakie wykonałem. Przygotowałem nowy token (bez daty).
> Usunąłem starego workera.
> W GITHUB_TOKEN wkleiłem nowy sekret.
> Uruchomiłem moduł Audio i uruchomiłem dźwięki - działa.
> [zrzuty ekranu nr 6–10]

### 1.7 Uzupełnienie relacji (1 listopada 2026)

> Usunąłem stary token.
> [zrzut ekranu nr 11]

Opis zrzutów nr 6–11 i stan po tych krokach zawiera rozdz. 15.

---

## 2. Zakres

Przeanalizowano:

| Obszar | Co dokładnie |
| --- | --- |
| Mail od Cloudflare | „[Notice] Cloudflare Observability pricing changes starting December 1, 2026” z 29 października 2026 (PDF, 3 strony). |
| Kod modułu `Audio` | `Audio/app.js` — bramka i sesja, podpisy adresów, odtwarzanie (Play, Loop, warianty), manifesty, Firebase i App Check; `Audio/worker/audio-gate.js` — wszystkie endpointy, nagłówki CORS i cache, pamięć podręczna Workera, obsługa zakresów bajtów; `Audio/AudioManifest.json` — warstwa demo. |
| Archiwum Workera push | `WebView_FCM_Cloudflare_Worker/Archiwalne/Notatki.txt`, `Archiwalne/kod-wrathandglory-push-api.txt`, `RotacjaTRIGGER_TOKEN.md`, plik `TRIGGER_TOKEN` (zawiera placeholder `TU_WSTAW_WLASNY_TOKEN`). Folder był **wyłącznie czytany** — jest chroniony przed edycją lokalnym `AGENTS.md`. |
| Dawne analizy z historii gita | `Analizy/KonfiguracjaCloudflareAudio.md` i `Analizy/UtajnienieAudio.md` (2 września 2026, usunięte z bieżącej wersji repozytorium) — dane o rozmiarze biblioteki `AudioRPG` i o sposobie założenia bramki. |
| Panel Cloudflare | Zrzuty ekranu nr 1–5 (rozdz. 7). |
| Limity | Cloudflare Workers Free, Workers Logs / Observability (obecne i od 1 grudnia 2026), Workers KV, GitHub (REST API, Contents API, Pages, repozytoria), Firebase Spark (Firestore), reCAPTCHA Enterprise (App Check). |

Poza zakresem: zużycie Firebase przez pozostałe moduły (DataVault, GeneratorNPC, Infoczytnik, Kreatory Postaci) nie było mierzone. Wspomniano tylko o limicie App Check, który jest wspólny dla wszystkich modułów (rozdz. 9.2).

W ramach tej analizy niczego nie zmieniono w kodzie, w konfiguracji Cloudflare, GitHuba ani Firebase, ani w danych.

---

## 3. Podsumowanie

1. **Mail nie zmienia kosztów tego konta.** Konto nie ma planu Workers Paid, więc od 1 grudnia 2026 zostaje na darmowym planie Observability, który — cytując mail — „will not be charged for Observability”. Zmienia się tylko miara limitu logów: zamiast 200 000 zdarzeń dziennie będzie 0,5 GB dziennie, a czas przechowywania logów wydłuża się z 3 do 7 dni.
2. **Observability to wyłącznie dziennik żądań w panelu Cloudflare.** Po wyczerpaniu dziennego limitu logi przestają się zapisywać do 00:00 UTC (01:00 czasu polskiego zimą, 02:00 latem), ale **bramka `audio-gate` działa dalej** — odtwarzanie dźwięków nie zależy od logów.
3. **Zmierzone zużycie jest znikome.** Najcięższy zarejestrowany dzień (24 października) to ok. 420 żądań. Cała wielodniowa sesja dała łącznie ok. 350–450 zdarzeń logu, czyli ok. 2,2–2,9 MB. Średnie zdarzenie ma 6,3–6,4 kB, średni czas CPU to 1,16 ms na żądanie, błędów: 0.
4. **Limit, od którego zależy działanie modułu,** to 100 000 żądań na dobę na całe konto. Najcięższy dzień wykorzystał z niego ok. 0,4%.
5. **Żeby przekroczyć którykolwiek limit,** trzeba by w ciągu jednej doby uruchomić ok. 10 000–26 000 dźwięków (limit logów) albo 12 500–33 000 (limit żądań) — to 200–500 razy więcej niż planowana przygoda. Nawet nieprzerwane klikanie przez 24 godziny w tempie najintensywniejszej minuty sesji (ok. 57 żądań na minutę) nie wyczerpałoby limitu żądań.
6. **Rachunek jest niemożliwy.** Plan darmowy nie ma dopłat za nadwyżki: po przekroczeniu limitu usługa zatrzymuje się do północy UTC, a konto nie ma podpiętej płatności.
7. **GitHub i Firebase** w części używanej przez moduł Audio też mają duży zapas (rozdz. 9).
8. **Dwie sprawy warte uwagi, niezwiązane z limitami Cloudflare:**
   - token `GITHUB_TOKEN` bramki — jeżeli został utworzony 2 września 2026 z ważnością 90 dni (tak zalecała instrukcja konfiguracji), **wygaśnie około 1 grudnia 2026** i wtedy wszystkie chronione dźwięki przestaną grać naraz. Ponowne wpisanie hasła nie pomoże. Naprawa nie wymaga zmian w kodzie, zajmuje ok. 5 minut, a przy odnowieniu można wybrać ważność do roku albo bez daty wygaśnięcia (rozdz. 10);
   - porzucony Worker `wrathandglory-push-api` nie zużywa limitów w odczuwalny sposób, ale przechowuje klucz konta serwisowego Firebase i być może niezrotowany `TRIGGER_TOKEN` — warto go usunąć ze względów bezpieczeństwa (rozdz. 6).

**Stan na koniec 1 listopada 2026:** obie sprawy z punktu 8 są załatwione — token wymieniony na nowy, bez daty ważności, a stary Worker usunięty (rozdz. 15).

### 3.1 Zmierzone zużycie a limity — tabela zbiorcza

| Limit (plan darmowy) | Wartość limitu | Najcięższy zarejestrowany dzień | Wykorzystanie | Zapas |
| --- | --- | --- | --- | --- |
| Żądania Workerów (całe konto) | 100 000 / doba | ok. 420 żądań | ok. 0,42% | ok. 240 razy |
| Logi Workers Logs — do 30.11.2026 | 200 000 zdarzeń / doba | ok. 420 zdarzeń | ok. 0,21% | ok. 475 razy |
| Logi Observability — od 1.12.2026 | 0,5 GB / doba | ok. 2,7 MB | ok. 0,54% | ok. 185 razy |
| Czas CPU | 10 ms na jedno żądanie | średnio 1,16 ms | ok. 12% pojedynczego żądania | — |
| API GitHuba (token bramki) | 5 000 / godzina | górne oszacowanie ok. 190 / godzina | ok. 4% | ok. 25 razy |
| Firestore — odczyty (moduł Audio) | 50 000 / doba | kilkadziesiąt | poniżej 0,1% | — |

---

## 4. Co mówi mail od Cloudflare

### 4.1 Treść w skrócie

Od 1 grudnia 2026 Cloudflare Observability (logi i ślady wykonania zapisywane w Cloudflare) przechodzi na rozliczanie według **objętości danych** (GB przyjętych i GB-miesięcy przechowywanych), zamiast liczby zdarzeń. Observability staje się osobną subskrypcją, niezależną od planu Workers.

Mail rozróżnia trzy przypadki:

| Przypadek | Co się dzieje |
| --- | --- |
| Workers Paid | Konto dostaje automatycznie płatną subskrypcję Observability; nadwyżki ponad pakiet są płatne. |
| **Brak Workers Paid i brak umowy Enterprise** | „your account stays on the Free Observability plan and will not be charged for Observability. Ingestion pauses when the daily limit is reached and resumes when it resets.” |
| Enterprise | Nowe zasady od odnowienia umowy. |

Tabela planów z maila:

| Plan | W cenie | Ponad pakiet |
| --- | --- | --- |
| Free | 0,5 GB przyjętych danych na dobę, retencja 7 dni | niedostępne |
| Paid | 50 GB przyjętych danych i 10 GB-miesięcy przechowywania na okres rozliczeniowy | 0,25 USD za każdy dodatkowy GB i 0,10 USD za GB-miesiąc |

Pakiet jest wspólny dla zbiorów: Cloudflare Traces, Workers Logs, Workers Traces, Containers logs, R2 Data Access Logs, AI Gateway logs, Issues. Z tej listy konto używa wyłącznie **Workers Logs** (Workers Traces są domyślnie wyłączone — rozdz. 4.4).

### 4.2 Który przypadek dotyczy tego konta

Drugi — **plan darmowy, bez opłat**. Potwierdzają to zrzuty ekranu:

- przycisk **Upgrade** w prawym górnym rogu panelu Workers (konto nie ma planu płatnego),
- panel **Billing Dashboard**: „$0.00 — No billable usage incurred yet”,
- baner w Observability: „You're on the free plan with 200K events per day”.

Mail sam stwierdza: „No action is required to transition to the new pricing”. **Nic nie trzeba robić przed 1 grudnia.**

### 4.3 Jak liczona jest objętość

Według dokumentacji Observability: „Ingestion includes the event body, the default enriched attributes, and custom attributes. Ingestion is pre-compression and does not include dropped events.” Właściwą miarą jest więc kolumna **Avg event size** ze strony Observability → Usage (zrzut nr 4): **6,3–6,4 kB na zdarzenie**.

Przeliczenie (Cloudflare liczy GB dziesiętnie): 0,5 GB = 500 000 kB, więc 500 000 kB ÷ 6,4 kB ≈ **78 000 zdarzeń na dobę**. W przeliczeniu na zdarzenia nowy limit jest ok. 2,5 raza ciaśniejszy od obecnego (200 000), ale nadal ok. 185 razy większy od najcięższego zarejestrowanego dnia.

### 4.4 Czego mail nie zmienia

- Limitu **100 000 żądań na dobę** dla Workerów — to osobny limit planu Workers Free i to on decyduje, czy bramka odpowiada.
- Limitu 10 ms CPU na żądanie, 128 MB pamięci i pozostałych limitów Workerów.
- Workers Traces pozostają opcją do włączenia ręcznie (`observability.traces.enabled = true` w konfiguracji wranglera). Bramka ich nie ma i nie potrzebuje. Włączenie zwiększyłoby objętość danych, bo każde żądanie zapisywałoby dodatkowo ślad wykonania.

### 4.5 Dzienny reset

Zarówno limit żądań Workerów, jak i (od 1 grudnia) limit logów odnawiają się o **00:00 UTC**. W Polsce to **01:00** w czasie zimowym (od 25 października 2026) i **02:00** w czasie letnim.

---

## 5. Jak moduł Audio korzysta z Cloudflare

### 5.1 Dwie warstwy dźwięków

| Warstwa | Skąd pochodzi | Czy dotyka Cloudflare |
| --- | --- | --- |
| **Demo (publiczna)** | Manifest `Audio/AudioManifest.json` w tym repozytorium (112 dźwięków, 242 warianty); pliki z GitHub Pages repozytorium `AudioExample` (adresy `https://cutelittlegoat.github.io/AudioExample/...`). | **Nie.** Zero żądań do bramki. |
| **Chroniona** | Manifest `audio-manifest.json` i pliki z prywatnego repozytorium `AudioRPG` (wg pomiaru z 2 września 2026: 1551 plików, ok. 358 MB, średnio ok. 230 kB na plik). | **Tak.** Jedyną drogą do plików jest bramka `https://audio-gate.tarczynski-pawel.workers.dev`. |

Bramka nie przechowuje plików. Przy każdym pobraniu sięga do prywatnego repozytorium przez API GitHuba (tokenem `GITHUB_TOKEN` z uprawnieniem tylko do odczytu) i przekazuje bajty do przeglądarki.

### 5.2 Endpointy bramki

| Endpoint | Kto i kiedy go wywołuje | Pobranie z API GitHuba | Uwagi |
| --- | --- | --- | --- |
| `OPTIONS` (dowolna ścieżka) | Przeglądarka, automatycznie, przed `/login`, `/manifest` i `/sign` (tzw. preflight CORS — wymusza go nagłówek `Authorization` albo treść JSON) | nie | Wynik jest pamiętany osobno dla każdego pełnego adresu, łącznie z parametrem `p`; Chrome pamięta go najwyżej 2 godziny. Każdy preflight to osobne żądanie Workera. |
| `POST /login` | Okno bramki, raz na urządzenie | nie | Sesja jest bezterminowa (`localStorage`). |
| `GET /manifest` | Każde wejście do modułu z ważną sesją; przycisk „Wczytaj manifest ponownie” w panelu admina | tak, gdy brak w pamięci Workera | Odpowiedź ok. 0,5 MB. Nagłówek `max-age=300` pozwala przeglądarce użyć jej ponownie przez 5 minut. |
| `GET /sign?p=…` | Pierwsze odtworzenie danego pliku (wariantu) w okresie ważności podpisu | nie | Podpis ważny 1–2 godziny, wyrównany do pełnej godziny. Moduł trzyma go w pamięci (`signedUrlCache`) do 5 s przed wygaśnięciem; pamięć znika po odświeżeniu strony. |
| `GET /a?p=…&e=…&s=…` | Odtwarzacz `<audio>` przy każdym pobraniu pliku | tak, gdy brak w pamięci Workera | Zwykle 1 żądanie, czasem 2–3 (żądania zakresów bajtów, np. odczyt końca pliku OGG przy ustalaniu długości). Bez preflightu. |
| `GET /health` | Nikt z modułu; ręczna diagnostyka albo boty | nie | Publiczny. |
| inne adresy (np. `/robots.txt`) | Boty | nie | Odpowiedź `401`. |

Jedno żądanie Workera daje dokładnie **jedno zdarzenie logu** (log wywołania). Bramka nie zapisuje własnych logów poza nieobsłużonymi błędami (`console.error`). Potwierdza to zrzut nr 2: „Requests 36” i „Observability events 36”.

### 5.3 Ile żądań daje typowa czynność

| Czynność w module | Żądania do bramki | Komentarz |
| --- | --- | --- |
| Pierwsze podanie hasła na urządzeniu | 2 (+ wczytanie manifestu: 1–2) | Raz na urządzenie. |
| Otwarcie modułu z ważną sesją | 1–2 | Preflight + `/manifest`. |
| **Pierwsze „Play” danego pliku** | **3–5** | Preflight + `/sign` + 1–3 × `/a`. |
| Ponowne „Play” tego samego pliku w ciągu 1–2 godzin | 0–3 | `/sign` z pamięci modułu; `/a` zależnie od pamięci podręcznej przeglądarki. |
| „Play” dźwięku z kilkoma wariantami | jak pierwsze „Play”, dopóki losowane są nowe warianty | Każdy wariant to osobny plik z osobnym podpisem. |
| Każde okrążenie pętli („Loop”) | 0–3 (dla nowego wariantu: 3–5) | Moduł tworzy nowy element `Audio` na każde okrążenie i dla dźwięków wielowariantowych losuje inny wariant. |
| Dźwięk z warstwy demo | 0 | GitHub Pages. |
| Zatrzymanie, głośność, zakładki, edycja list i aliasów | 0 | Listy i aliasy idą do Firestore, nie do Cloudflare. |

Moduł niczego nie pobiera z wyprzedzeniem — żądania powstają wyłącznie po kliknięciu. **Robocze oszacowanie: średnio ok. 3–8 żądań na jedno uruchomienie dźwięku**, z uwzględnieniem wejść do modułu, żądań zakresów i pętli. Łączne liczby z sesji (rozdz. 7) są z tym zgodne.

### 5.4 Pamięć podręczna

**Przeglądarka.** Odpowiedź `/a` ma nagłówek `Cache-Control: public, max-age=31536000, immutable`, a podpisany adres jest identyczny przez całą godzinę zegarową. Przeglądarka może więc odtwarzać ten sam plik kolejny raz bez łączenia się z bramką. Odpowiedź nie ma natomiast nagłówków `ETag` ani `Last-Modified`, przez co niektóre przeglądarki mogą nie zachowywać odpowiedzi częściowych (kod 206) i pobierać plik ponownie — najbardziej byłoby to widać przy pętlach krótkich dźwięków. Zrzut nr 5 nie pokazuje ciągłego strumienia żądań, tylko krótkie serie, więc w praktyce pamięć przeglądarki działa (szczegóły i sposób sprawdzenia: rozdz. 8.5).

**Worker.** Bramka próbuje zapamiętywać pliki i manifest w `caches.default`. Dokumentacja Cloudflare gwarantuje działanie tej pamięci tylko Workerom pod własną domeną („Workers deployed to custom domains have access to functional cache operations”). O adresach `*.workers.dev` nie mówi tego wprost, a raporty użytkowników wskazują, że tam ta pamięć nie działa. Jeżeli nie działa, każde żądanie `/a` i `/manifest` oznacza jedno pobranie z API GitHuba. **Nie zmienia to zużycia limitów Cloudflare** (żądanie liczy się tak samo, a transfer danych z Workerów nie jest limitowany ani płatny). Wpływa tylko na zużycie limitu API GitHuba i na czas pierwszego odtworzenia. Własna domena, która uruchomiłaby tę pamięć, jest płatna — sprzeczne z założeniem „wszystko za darmo” i niepotrzebne przy tej skali.

---

## 6. Porzucony Worker `wrathandglory-push-api`

### 6.1 Co to jest

Według `Archiwalne/Notatki.txt` i `Archiwalne/kod-wrathandglory-push-api.txt`:

- backend powiadomień web push i Android FCM dla projektu Firebase `WH40k-Data-Slate`,
- dwa powiązania KV: `SUBSCRIPTIONS_KV` → `PUSH_SUBSCRIPTIONS` (2 stare subskrypcje) i `FCM_TOKENS` → `FCM_TOKENS` (pusty),
- siedem sekretów, w tym `TRIGGER_TOKEN`, klucze VAPID oraz **klucz prywatny konta serwisowego Firebase** (`FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PROJECT_ID`),
- endpointy: `GET /api/push/health`, `POST /api/push/subscribe`, `POST /api/fcm/register`, `POST /api/fcm/unregister`, `POST /api/push/trigger`.

### 6.2 Czy zużywa limity

| Pytanie | Odpowiedź |
| --- | --- |
| Czy ma zadania cykliczne (Cron), które same zużywałyby limit? | **Nie.** Kod ma tylko obsługę `fetch` — działa wyłącznie wtedy, gdy ktoś go wywoła. |
| Czy któryś moduł aplikacji go wywołuje? | **Nie.** W kodzie aplikacji nie ma jego adresu, a strona główna (`Main/index.html`) wyrejestrowuje wszystkie service workery. |
| Kto go wywołuje? | Boty indeksujące: `GET /robots.txt` mniej więcej raz na dobę (zrzut nr 3: 27.10 19:10, 28.10 11:11, 29.10 03:11). Odpowiedź `404`, czas CPU ok. 0,6 ms (zrzut nr 1). |
| Ile to daje? | Ok. 30 żądań i ok. 0,2 MB logów miesięcznie — pomijalnie mało. |
| KV | Zapytanie o `/robots.txt` nie dotyka KV. Operacje KV wykonują tylko endpointy push, których nikt nie używa. Zapisane dane to kilka kilobajtów przy limicie 1 GB. |

### 6.3 Dlaczego mimo to warto go usunąć

Powody nie dotyczą limitów, tylko bezpieczeństwa i porządku:

1. **Limit 100 000 żądań na dobę jest wspólny dla całego konta.** Każdy publiczny adres Workera to dodatkowy cel — zalanie żądaniami starego Workera wyłączyłoby do północy UTC także bramkę `audio-gate`. Usunięcie zbędnego Workera zmniejsza liczbę takich celów.
2. **Worker przechowuje klucz prywatny konta serwisowego Firebase** projektu `WH40k-Data-Slate` (z tego projektu korzystają DataVault, GeneratorNPC i Infoczytnik). Klucz daje uprawnienia administracyjne, a projekt, dla którego go utworzono, nie będzie kontynuowany.
3. **`TRIGGER_TOKEN`.** Według `RotacjaTRIGGER_TOKEN.md` stara wartość tokenu jest nadal widoczna w historii publicznego repozytorium, a jej wymiana w Cloudflare była „do wykonania przez użytkownika”. Jeżeli nie została wykonana, stary token nadal działa. Usunięcie Workera zamyka sprawę bez rotacji.

Usunięcie Workera nie wymaga żadnej zmiany w repozytorium — folder `WebView_FCM_Cloudflare_Worker/` zostaje jako archiwum (i jest chroniony przed edycją przez agentów AI).

---

## 7. Dane z panelu Cloudflare (zrzuty 1–5)

Godziny w panelu są podane w czasie CET (UTC+1).

| Nr | Co pokazuje | Odczyt | Wniosek |
| --- | --- | --- | --- |
| 1 | Workers & Pages, widok „Daily” | `audio-gate`: brak żądań tego dnia; `wrathandglory-push-api`: 1 żądanie, 0,6 ms | Stary Worker dostaje pojedyncze żądania od botów. |
| 2 | Workers & Pages, widok „This month” (okres rozliczeniowy 25 października – 25 listopada) | Requests 36, CPU time 41,63 ms, Observability events 36, Workers build mins 0/3k; Billing Dashboard: $0.00, „No billable usage incurred yet”; przycisk „Upgrade” | 1 żądanie = 1 zdarzenie logu. Średnio 1,16 ms CPU na żądanie. Konto na planie darmowym. |
| 3 | Observability → Overview, ostatnie 7 dni (23–29 października) | 456 zdarzeń, 0 błędów. Ok. 420 z nich 24 października (trzy słupki: ok. 165, ok. 125, ok. 130 w ciągu ok. 8 godzin), pozostałe pojedynczo. Na liście: `robots.txt` starego Workera i `GET …/a?p=TabletopAudio…` bramki (27.10 19:04–19:05). | **24 października to najcięższy zarejestrowany dzień: ok. 420 żądań.** Pozostałe ok. 36 zdarzeń w przybliżeniu zgadza się z licznikiem ze zrzutu nr 2. |
| 4 | Observability → Usage, okres rozliczeniowy (po sesji) | Workers Logs: 0,00 GB, 200 zdarzeń, śr. 6,4 kB. `audio-gate`: 0,00 GB, 257 zdarzeń, śr. 6,3 kB, udział „127%”. Słupki dzienne ok. 29 i 31 października. | Cały okres to ok. 1,3–1,6 MB logów. „0,00 GB” oznacza mniej niż 0,005 GB. |
| 5 | Observability → Overview, ostatnia godzina (1 listopada, filtr `NOT exists($metadata.error)`) | 189 zdarzeń, 0 błędów. Aktywność 07:37–07:57 w krótkich seriach; najintensywniejsza minuta ok. 57 zdarzeń. | Godzina intensywnej gry to ok. 1,2 MB logów. Brak ciągłego strumienia żądań. |

**Niespójność na zrzucie nr 4.** Wiersz zbioru pokazuje 200 zdarzeń, a wiersz samej bramki — 257, z udziałem 127%. Udział jest liczony z objętości: 257 × 6,3 kB ≈ 1,62 MB wobec 200 × 6,4 kB ≈ 1,28 MB, czyli ok. 127%. Najpewniej oba wiersze są sumowane w innych oknach czasowych albo z opóźnieniem (strona Usage prawdopodobnie nie uwzględniała jeszcze 1 listopada). Nie ma to wpływu na wnioski — obie liczby oznaczają ok. 1,3–1,6 MB.

**Cała sesja.** Licząc razem zrzut nr 4 (200–257 zdarzeń w okresie rozliczeniowym, w tym ok. 36 sprzed sesji) i zrzut nr 5 (189 zdarzeń 1 listopada), cała wielodniowa sesja dała ok. **350–450 zdarzeń, czyli ok. 2,2–2,9 MB logów**. To mniej niż 1% limitu **jednej** doby — nawet gdyby cała sesja odbyła się jednego dnia.

---

## 8. Szacunek zużycia

### 8.1 Limity planu darmowego Cloudflare

| Pozycja | Limit | Reset | Skutek przekroczenia |
| --- | --- | --- | --- |
| Żądania Workerów | 100 000 / doba, wspólne dla wszystkich Workerów konta | 00:00 UTC | Błąd 1027 — bramka nie odpowiada do resetu. Bez opłat. |
| Czas CPU | 10 ms na żądanie | — | Błąd 1102 dla tego żądania; sporadyczne przekroczenia są tolerowane. |
| Pamięć | 128 MB na izolat | — | Błąd 1102. |
| Podzapytania | 50 na żądanie | — | Bramka używa najwyżej 3 (`cache.match`, `fetch`, `cache.put`). |
| Liczba Workerów | 100 | — | Konto ma 2. |
| Logi — do 30.11.2026 | 200 000 zdarzeń / doba, retencja 3 dni | 00:00 UTC | Próbkowanie logów. |
| Logi i ślady Observability — od 1.12.2026 | 0,5 GB / doba, retencja 7 dni | 00:00 UTC | Zapisywanie logów wstrzymane do resetu; Workery działają dalej. Bez opłat i bez możliwości dokupienia. |
| Workers KV (dotyczy tylko starego Workera) | 100 000 odczytów, 1 000 zapisów, 1 000 usunięć, 1 000 list / doba; 1 GB danych | 00:00 UTC | Dana operacja zwraca błąd. |

### 8.2 Model zużycia na jedno uruchomienie dźwięku

- Żądania: średnio **3–8** (rozdz. 5.3).
- Logi: 3–8 zdarzeń × 6,4 kB = **ok. 19–51 kB** na jedno uruchomienie.
- API GitHuba: jedno pobranie na każde żądanie `/a`, jeżeli pamięć Workera nie działa na `workers.dev` (rozdz. 5.4).

### 8.3 Scenariusze

| Scenariusz | Uruchomień dźwięku w ciągu doby | Żądania / doba | % limitu żądań | Logi / doba | % limitu logów od 1.12 |
| --- | --- | --- | --- | --- | --- |
| Najcięższy zarejestrowany dzień (24.10) | — | ok. 420 | 0,42% | ok. 2,7 MB | 0,54% |
| Planowana krótka przygoda | 50 | 150–400 | 0,15–0,4% | 1,0–2,6 MB | 0,2–0,5% |
| Długa sesja z dużą liczbą efektów | 300 | 900–2 400 | 0,9–2,4% | 5,8–15,4 MB | 1,2–3,1% |
| Maraton (kilka sesji jednego dnia, kilka urządzeń) | 1 000 | 3 000–8 000 | 3–8% | 19–51 MB | 3,8–10,2% |
| Próg limitu logów | ok. 10 000–26 000 | ok. 78 000 | ok. 78% | 500 MB | 100% |
| Próg limitu żądań | ok. 12 500–33 000 | 100 000 | 100% | logi wstrzymane wcześniej | — |

**Ilustracja zapasu:** najintensywniejsza minuta sesji to ok. 57 żądań. Gdyby utrzymywać to tempo bez przerwy przez całą dobę, powstałoby 57 × 1 440 = ok. 82 000 żądań — **nadal poniżej limitu 100 000**. Wstrzymane zostałyby tylko logi, i to dopiero po ok. 23 godzinach (78 000 ÷ 57 ≈ 1 370 minut).

### 8.4 Co by się stało po przekroczeniu

| Przekroczony limit | Co widać w aplikacji | Kiedy wraca |
| --- | --- | --- |
| Logi (0,5 GB / doba) | **Nic.** Gracze niczego nie zauważą; w panelu przestają przybywać nowe logi. | 00:00 UTC (01:00 zimą, 02:00 latem) |
| Żądania (100 000 / doba) | Bramka zwraca błąd 1027. Moduł pokazuje „Brak połączenia z bramką dostępu…” albo „Nie udało się odtworzyć dźwięku. Bramka nie wydała pliku.”. Warstwa demo, listy i aliasy działają dalej. | 00:00 UTC (01:00 zimą, 02:00 latem) |

**W żadnym przypadku nie powstaje rachunek** — konto nie ma planu płatnego ani podpiętej płatności.

### 8.5 Scenariusz skrajny: pętla krótkiego dźwięku bez pamięci przeglądarki

To jedyna realna droga do zbliżenia się do jakiegokolwiek limitu — i to nie Cloudflare, tylko GitHuba.

Przykład: dwusekundowy dźwięk chroniony grający w pętli przez 4 godziny to 7 200 okrążeń. Gdyby przeglądarka przy każdym okrążeniu pobierała plik od nowa (1–2 żądania):

| Zasób | Zużycie | Ocena |
| --- | --- | --- |
| Żądania Cloudflare | 7 200–14 400 / dobę | 7–14% limitu — bez problemu |
| Logi | 46–92 MB / dobę | 9–18% limitu — bez problemu |
| API GitHuba (gdy pamięć Workera nie działa) | 1 800–3 600 / godzinę | 36–72% limitu 5 000 / godzinę — **dwie takie pętle naraz mogłyby go przekroczyć**, a wtedy do końca godziny dźwięki chronione kończyłyby się komunikatem „Nie udało się odtworzyć dźwięku. Bramka nie wydała pliku.” |

Dane z sesji nie wskazują, żeby tak się działo: na zrzucie nr 5 widać krótkie serie po kliknięciach, a nie równomierny strumień zdarzeń co kilka sekund.

**Jak to sprawdzić przy następnej sesji (bez zmian w kodzie):**

1. W panelu Cloudflare otwórz **Observability** i kliknij **Live**.
2. W module Audio włącz „Loop” na krótkim dźwięku chronionym (z jednym wariantem).
3. Obserwuj listę zdarzeń przez minutę:
   - jeden wpis `GET …/a?p=…` na początku, a potem cisza — przeglądarka korzysta z pamięci i wszystko jest w porządku;
   - nowy wpis `GET …/a?p=…` przy każdym okrążeniu — przeglądarka pobiera plik od nowa; nadal mieści się to w limitach, ale warto wtedy rozważyć usprawnienie z rozdz. 13.

---

## 9. GitHub i Firebase w module Audio

### 9.1 GitHub

| Pozycja | Limit (plan darmowy) | Zużycie przez moduł Audio | Ocena |
| --- | --- | --- | --- |
| REST API z tokenem bramki | 5 000 żądań / godzinę (limit osobisty konta, wspólny dla wszystkich tokenów osobistych); dodatkowo 900 punktów / minutę (żądanie GET = 1 punkt) i 100 żądań równoczesnych | górne oszacowanie: ok. 190 / godzinę, ok. 57 / minutę w szczycie | ✅ ok. 4% i ok. 6% |
| Pobranie pliku przez Contents API (typ raw) | do 100 MB na plik | biblioteka: średnio ok. 230 kB na plik | ✅ |
| Rozmiar repozytorium `AudioRPG` | zalecane poniżej 1 GB (mocno zalecane poniżej 5 GB); pojedynczy plik do 100 MiB | ok. 358 MB (wrzesień 2026) | ✅ (zapowiadane docelowe 5 GB przekroczy zalecenie 1 GB — wtedy potrzebna osobna analiza) |
| GitHub Pages (aplikacja i demo `AudioExample`) | strona do 1 GB, miękki limit transferu 100 GB / miesiąc, 10 publikacji / godzinę (miękki) | manifest demo 121 kB, pliki demo 7,5–302 kB | ✅ |
| **Ważność tokenu `GITHUB_TOKEN`** | instrukcja z 2 września 2026 zalecała 90 dni | — | ⚠️ **jeśli utworzony 2 września na 90 dni — wygasa ok. 1 grudnia 2026** (rozdz. 10) |

**Wygaśnięcie tokenu — skrót techniczny.** Pełne wyjaśnienie prostym językiem i instrukcja krok po kroku są w rozdz. 10.

- Po wygaśnięciu GitHub odpowiada bramce kodem `401`. Endpointy `/login` i `/sign` działają dalej (nie korzystają z GitHuba), ale `/manifest` zwraca `502` z treścią `{"ok":false,"error":"manifest_unavailable","status":401}`, a `/a` — `502 Upstream error`.
- Moduł pokazuje wtedy „Bramka nie znalazła manifestu archiwum (HTTP 401). Sprawdź, czy plik audio-manifest.json leży w katalogu głównym prywatnego repozytorium AudioRPG.”, a dźwięki z archiwum zamieniają się w kafelki z kłódką i napisem „(brak w manifeście)”. Kod **HTTP 401** w tym komunikacie oznacza wygasły lub unieważniony token, a nie brak pliku.
- Sesje urządzeń (podpisane kluczem `SIGNING_KEY`) i hasło grupy (`GROUP_PASSWORD`) pozostają ważne — ponowne logowanie niczego nie naprawia.
- Naprawa: nowy token (tylko repozytorium `AudioRPG`, uprawnienie `Contents: Read-only`) wklejony jako sekret `GITHUB_TOKEN` Workera `audio-gate`, potem **Deploy**. Kod modułu i bramki odwołuje się wyłącznie do nazwy `env.GITHUB_TOKEN`, więc nie wymaga zmian.
- Ważność tokenu fine-grained na koncie osobistym: do roku (366 dni) albo bez daty wygaśnięcia. GitHub unieważnia token automatycznie po roku nieużywania oraz po wykryciu go w publicznym repozytorium. Wygasłego tokenu nie da się przywrócić — trzeba utworzyć nowy.

### 9.2 Firebase (projekt `audiorpg-2eb6f`, plan Spark)

| Pozycja | Limit Spark | Zużycie przez moduł Audio | Ocena |
| --- | --- | --- | --- |
| Firestore — odczyty | 50 000 / doba | 1 na każde otwarcie modułu na urządzeniu (nasłuch dokumentu `audio/favorites`) + 1 na każdą zmianę ustawień na każdym otwartym urządzeniu | ✅ poniżej 0,1% |
| Firestore — zapisy | 20 000 / doba | tylko zmiany list i aliasów (panel admina) | ✅ |
| Firestore — dane | 1 GiB | jeden dokument z listami i aliasami (kilka–kilkadziesiąt kB) | ✅ |
| Transfer danych | 10 GiB / miesiąc | pomijalny | ✅ |
| Firebase Storage | — | **nieużywany** (przez żaden moduł) | ✅ wymóg planu Blaze dla Storage nie dotyczy aplikacji |
| App Check (reCAPTCHA Enterprise) | 10 000 ocen / miesiąc bez włączonych płatności, wspólne dla kluczy reCAPTCHA (według Google — w obrębie organizacji) | ok. 1 ocena przy otwarciu karty + odnowienie znacznika mniej więcej co 30–60 minut na każdą otwartą kartę (domyślna ważność znacznika to 1 godzina, moduł ma włączone automatyczne odnawianie) | ✅ przy normalnym użyciu; ⚠️ przy kartach otwartych całymi dniami |

Uwagi:

- Dzienne limity Firestore odnawiają się o północy czasu pacyficznego, czyli ok. **09:00 czasu polskiego** zimą.
- Limit App Check jest wspólny dla wszystkich modułów korzystających z Firebase (DataVault, GeneratorNPC, Infoczytnik, Kreatory Postaci) — ich zużycia ta analiza nie mierzyła. Bez włączonych płatności reCAPTCHA po 10 000 ocen w miesiącu zwraca błędy. Skutek zależy od tego, czy w konsoli Firebase włączono wymuszanie App Check: bez wymuszania — żadnego; z wymuszaniem — Firestore odrzucałby zapytania do końca miesiąca, a moduł Audio przechodziłby na pamięć lokalną (z komunikatem o awarii zapisu/odczytu).
- Reguła `match /audio/favorites { allow read, write: if true; }` (`shared/firestore-audiorpg.rules`) pozwala czytać i zapisywać dokument każdemu. W razie celowego nadużycia dzienny limit Firestore mógłby się wyczerpać — skutkiem byłaby praca na pamięci lokalnej do resetu limitu, nie opłata.

---

## 10. Token GitHuba — wyjaśnienie prostym językiem

Ten rozdział jest napisany dla osoby bez wiedzy informatycznej. Odpowiada na pytania z prośby 1.5: czy po wygaśnięciu tokenu wystarczy ponownie wpisać hasło, czy trzeba to będzie powtarzać co 90 dni i czy trzeba zmieniać kod aplikacji.

### 10.1 Krótkie odpowiedzi

| Pytanie | Odpowiedź |
| --- | --- |
| Czy po wygaśnięciu tokenu wystarczy ponownie wpisać hasło? | **Nie.** Hasło nadal będzie przyjmowane, ale dźwięki z archiwum i tak nie zagrają — u nikogo — dopóki nie wymienisz tokenu na nowy. |
| Czy wszystko przestanie działać? | **Nie wszystko.** Przestaną grać tylko dźwięki z archiwum (chronione). Dźwięki demo, listy, aliasy i ustawienia działają dalej i nic nie zostanie usunięte. |
| Czy co 90 dni trzeba będzie to powtarzać? | **Nie musi tak być.** 90 dni to była tylko ostrożna propozycja z instrukcji. Przy tworzeniu nowego tokenu możesz wybrać ważność do roku albo token bez daty ważności. |
| Czy trzeba coś zmieniać w kodzie aplikacji? | **Nie.** Token nie jest zapisany w kodzie. Wymiana to dwie czynności na stronach internetowych: utworzenie nowego tokenu na GitHubie i wklejenie go w ustawieniach bramki w Cloudflare. Zajmuje to ok. 5 minut. |
| Kiedy wygaśnie mój token? | Nie mam dostępu do Twojego konta, więc nie widzę daty. Jeżeli 2 września wybrałeś 90 dni (tak podpowiadała instrukcja), wypada to **około 1 grudnia 2026**. Datę sprawdzisz w kroku 1 z rozdz. 10.6. |

1 grudnia to także dzień zmiany cennika logów Cloudflare (rozdz. 4). To przypadek — te dwie sprawy nie mają ze sobą nic wspólnego.

### 10.2 Dwa różne klucze: hasło grupy i token

Najprościej wyobrazić to sobie tak:

- **Bramka** (`audio-gate`) to portier, który stoi między graczami a magazynem z nagraniami.
- **Hasło grupy** („Litania Dostępu”) to przepustka, którą gracze pokazują portierowi. Podaje się ją raz na urządzeniu.
- **Magazyn** to Twoje prywatne repozytorium `AudioRPG` na GitHubie, w którym leżą nagrania.
- **Token GitHuba** to klucz portiera do magazynu. Gracze nigdy go nie widzą i nie wpisują. To Ty wkleiłeś go we wrześniu w ustawieniach bramki w Cloudflare.

Gdy **klucz portiera traci ważność**, portier nadal sprawdza przepustki i wpuszcza graczy — hasło działa. Nie ma jednak czym otworzyć magazynu, więc nie przyniesie żadnego nagrania. Ponowne pokazywanie przepustki niczego nie zmieni. Trzeba dorobić portierowi nowy klucz.

| | Hasło grupy | Token GitHuba |
| --- | --- | --- |
| Kto go używa | gracze, raz na urządzeniu | tylko bramka, automatycznie |
| Gdzie jest zapisany | w ustawieniach bramki w Cloudflare (`GROUP_PASSWORD`) | w ustawieniach bramki w Cloudflare (`GITHUB_TOKEN`) |
| Czy ma datę ważności | nie | **tak** — taką, jaką wybrałeś przy tworzeniu |
| Co się dzieje, gdy się zmieni albo straci ważność | po zmianie gracze muszą poznać i wpisać nowe hasło | dźwięki z archiwum przestają grać u wszystkich, dopóki nie wkleisz nowego tokenu |

### 10.3 Co dokładnie zobaczysz, gdy token wygaśnie

Wszystko dzieje się **u wszystkich jednocześnie** — na każdym urządzeniu i u każdego gracza.

1. Dźwięki z archiwum na listach zamienią się w kafelki z kłódką 🔒 i napisem **„(brak w manifeście)”**. Pojawi się też przycisk **„🔒 Odblokuj archiwum”**.
2. Kliknięcie takiego kafelka otworzy okno z hasłem („Dostęp do danych z klauzulą tajności K.O.Z.A.”) i napisem: „Ten dźwięk nie należy do warstwy publicznej. Odblokuj archiwum, aby go wczytać.” **Wygląda to tak, jakby wystarczyło podać hasło — ale to złudzenie.**
3. Po wpisaniu hasła i kliknięciu **„Rozpocznij Rytuał”** okno nie zniknie, tylko pokaże komunikat:

   > Bramka nie znalazła manifestu archiwum (HTTP 401). Sprawdź, czy plik audio-manifest.json leży w katalogu głównym prywatnego repozytorium AudioRPG.

   Ten komunikat jest mylący. Plik jest na swoim miejscu — nie szukaj go. Ważne jest **„HTTP 401”**: oznacza, że GitHub nie wpuścił bramki, czyli w praktyce **wygasł token**.
4. Jeżeli moduł był otwarty jeszcze przed wygaśnięciem, kliknięcie dźwięku z archiwum pokaże: **„Nie udało się odtworzyć dźwięku. Bramka nie wydała pliku.”** Czasem dźwięk, który grał przed chwilą, zagra jeszcze raz, bo przeglądarka pamięta go przez jakiś czas. To nie znaczy, że problem minął.

**Co działa dalej:**

- dźwięki demo (warstwa publiczna, np. odgłosy z Boltguna),
- listy, aliasy i wszystkie ustawienia — **nic nie zostanie usunięte**; po wymianie tokenu dźwięki z archiwum wrócą na swoje miejsca na listach,
- hasło grupy i zalogowanie na urządzeniach — bez zmian; po wymianie tokenu **nikt nie musi wpisywać hasła ponownie**.

### 10.4 Czy trzeba to powtarzać co 90 dni?

**Nie musi być co 90 dni.** Długość ważności wybierasz sam przy tworzeniu tokenu. We wrześniu instrukcja proponowała 90 dni, bo krótszy termin to mniejsze ryzyko, gdyby token kiedyś wyciekł. Nie jest to wymóg GitHuba ani aplikacji.

Na koncie prywatnym GitHub pozwala wybrać:

| Wybór | Jak często wymieniasz | Plusy | Minusy |
| --- | --- | --- | --- |
| 90 dni (jak teraz) | co 3 miesiące | najmniejsze ryzyko | łatwo zapomnieć; 4 razy w roku |
| **ok. roku** (najdłuższa data, jaką GitHub pozwala ustawić — do 366 dni) | raz w roku | rozsądny kompromis | trzeba pamiętać raz w roku |
| bez daty ważności („No expiration”) | dopiero wtedy, gdy token przestanie działać z innego powodu | zero pilnowania | token działa, dopóki sam go nie usuniesz; GitHub i tak usunie go po roku nieużywania |

**Rekomendacja: ok. roku** i przypomnienie w kalendarzu na tydzień przed datą ważności. Wtedy wymiana wypada raz w roku i zajmuje ok. 5 minut.

Opcja bez daty ważności jest dozwolona i przy tym tokenie do przyjęcia, bo token potrafi wyłącznie **czytać** nagrania z jednego repozytorium (`AudioRPG`): nie może niczego zmienić, usunąć ani zajrzeć do innych repozytoriów, a jego wartość leży tylko w ustawieniach bramki w Cloudflare. Gdyby kiedyś wyciekł, najgorsze, co ktoś mógłby zrobić, to pobrać nagrania z archiwum. Token możesz w każdej chwili usunąć na GitHubie.

Dwie rzeczy, o których warto wiedzieć niezależnie od wyboru:

- **GitHub sam usuwa token, którego nikt nie użył przez rok.** Jeżeli przez cały rok nikt nie skorzysta z archiwum, po takiej przerwie trzeba będzie utworzyć nowy token.
- **GitHub sam unieważnia token, który trafi do publicznego repozytorium** (a `WrathAndGlory` jest publiczne). Wklejenie tokenu do kodu aplikacji nie tylko nie jest potrzebne, ale od razu by go zepsuło.

### 10.5 Czy trzeba coś zmieniać w kodzie aplikacji?

**Nie.** Token nie jest zapisany w żadnym pliku aplikacji:

- strona modułu Audio (to, co otwierają gracze) w ogóle nie zna tokenu,
- kod bramki zna tylko jego nazwę (`GITHUB_TOKEN`), a samą wartość bierze z ustawień w Cloudflare.

Przy wymianie tokenu **nic się nie zmienia** w kodzie, w repozytorium `WrathAndGlory`, w adresie strony, w haśle grupy, w Firebase ani na urządzeniach graczy. Wymiana to dwie czynności na stronach internetowych:

1. na GitHubie — utworzenie nowego tokenu,
2. w Cloudflare — wklejenie go w ustawieniach bramki.

### 10.6 Instrukcja krok po kroku

Najlepiej zrobić to **przed** datą ważności, w spokojnej chwili — wtedy nikt nie zauważy żadnej przerwy. Potrzebujesz dostępu do kont GitHub i Cloudflare. Wystarczy komputer albo telefon.

**Krok 1 — sprawdź, kiedy token wygasa (GitHub)**

1. Wejdź na **https://github.com** i zaloguj się.
2. Kliknij swoje zdjęcie (ikonę) w prawym górnym rogu → **Settings**.
3. W menu po lewej zjedź na sam dół → **Developer settings**.
4. **Personal access tokens** → **Fine-grained tokens**.
5. Znajdź token **`audio-gate`**. Przy nim powinna być data ważności (np. „Expires on …”). Jeżeli jej nie widać, kliknij nazwę tokenu.
6. Wpisz tę datę do kalendarza z przypomnieniem tydzień wcześniej.

**Krok 2 — utwórz nowy token (GitHub)**

1. Na tej samej stronie (**Fine-grained tokens**) kliknij **Generate new token**.
2. **Token name:** wpisz nazwę z datą, np. `audio-gate-2026-12` (GitHub może nie przyjąć nazwy, która już istnieje).
3. **Expiration:** wybierz ważność — zgodnie z rekomendacją z rozdz. 10.4 najdłuższy dostępny okres albo własną datę (zwykle opcja **Custom**) mniej więcej rok do przodu; ewentualnie **No expiration**.
4. **Resource owner:** zostaw swoje konto.
5. **Repository access:** zaznacz **Only select repositories** i wybierz z listy **AudioRPG**. Nie wybieraj „All repositories”.
6. **Permissions:** w uprawnieniach repozytorium znajdź (albo dodaj) **Contents** i ustaw **Read-only**. GitHub sam doda **Metadata: Read-only** — tak ma być. Innych uprawnień nie dodawaj.
7. Kliknij **Generate token** i potwierdź.
8. GitHub pokaże token zaczynający się od `github_pat_…`. **Skopiuj go od razu — zobaczysz go tylko raz.**

Jeżeli na stronie starego, jeszcze ważnego tokenu zobaczysz przycisk **Regenerate token**, możesz z niego skorzystać zamiast punktów 1–7 (zachowuje ustawienia i pozwala wybrać nową ważność). Tokenu, który już wygasł, nie da się przywrócić — wtedy zawsze tworzysz nowy według punktów 1–8.

**Krok 3 — wklej nowy token do bramki (Cloudflare)**

1. Wejdź na **https://dash.cloudflare.com** i zaloguj się.
2. W menu po lewej wybierz **Workers & Pages** (w grupie **Compute**) i kliknij **audio-gate**.
3. Zakładka **Settings** → sekcja **Variables and Secrets**.
4. Przy pozycji **`GITHUB_TOKEN`** (typ **Secret**) kliknij edycję (ikona ołówka albo **Edit**).
5. Wklej nowy token w miejsce starego. **Nie zmieniaj** pozostałych pozycji (`GROUP_PASSWORD`, `SIGNING_KEY`, `ALLOWED_ORIGIN`).
6. Kliknij **Deploy** (albo **Save and deploy**).

Dlaczego tylko ta jedna pozycja: zmiana `SIGNING_KEY` wylogowałaby wszystkie urządzenia, a zmiana `GROUP_PASSWORD` oznaczałaby nowe hasło dla graczy. Przy wymianie tokenu żadna z tych zmian nie jest potrzebna.

**Krok 4 — sprawdź, czy działa**

1. Otwórz moduł Audio i odśwież stronę.
2. Dźwięki z archiwum powinny znowu mieć zwykłe kafelki i grać. Nikt nie musi wpisywać hasła.
3. Gracze, którzy mieli moduł otwarty, muszą tylko odświeżyć stronę.

**Krok 5 — posprzątaj**

1. Na GitHubie, na liście **Fine-grained tokens**, usuń stary token (**Delete**). Jeżeli wymieniasz token przed wygaśnięciem, usuń stary dopiero po udanym kroku 4.
2. Usuń token z notatek i schowka, jeżeli go gdzieś wkleiłeś po drodze.
3. Wpisz do kalendarza datę ważności nowego tokenu z przypomnieniem tydzień wcześniej.

GitHub zwykle przypomina mailem o zbliżającym się wygaśnięciu tokenu, ale obecna dokumentacja tego nie gwarantuje — przypomnienie w kalendarzu jest pewniejsze.

**Czego nie robić z tokenem:** nie wklejaj go do kodu, do repozytorium, do czatu (także do rozmowy ze mną), na Discorda ani na zrzuty ekranu. Jedynym miejscem na token są ustawienia bramki w Cloudflare.

### 10.7 Co zrobić, jeśli token wygaśnie w trakcie sesji

1. Nie wpisuj hasła ponownie i nie zmieniaj hasła grupy — to nie pomoże.
2. Do czasu naprawy korzystaj z dźwięków demo; listy i aliasy są bezpieczne.
3. Na telefonie albo komputerze wykonaj kroki 2–4 z rozdz. 10.6 (ok. 5 minut).
4. Odśwież stronę modułu — dźwięki z archiwum wrócą.

### 10.8 Czy coś jeszcze ma datę ważności?

W konfiguracji modułu Audio token GitHuba jest **jedynym** elementem, który trzeba ręcznie odnawiać.

| Element | Czy wygasa | Uwagi |
| --- | --- | --- |
| Hasło grupy | nie | Zmienia się tylko wtedy, gdy sam je zmienisz. |
| Zalogowanie na urządzeniu | nie | Znika tylko po wyczyszczeniu danych przeglądarki albo po zmianie `SIGNING_KEY`. |
| Klucz podpisu (`SIGNING_KEY`) | nie | Zmieniasz go tylko wtedy, gdy chcesz wylogować wszystkie urządzenia naraz. |
| Adresy pojedynczych plików wydawane przez bramkę | tak, po 1–2 godzinach | Odnawiają się same, bez Twojego udziału. |
| **Token GitHuba (`GITHUB_TOKEN`)** | **tak** | Według ważności wybranej przy tworzeniu; dodatkowo GitHub usuwa token nieużywany przez rok. |

---

## 11. Ryzyka

| Ryzyko | Prawdopodobieństwo | Skutek | Ograniczenie |
| --- | --- | --- | --- |
| Wygaśnięcie `GITHUB_TOKEN` (ok. 1 grudnia 2026, jeśli 90 dni od 2 września) — **zamknięte 1 listopada 2026: nowy token bez daty ważności (rozdz. 15)** | wysokie, jeżeli tak ustawiono | Wszystkie dźwięki chronione przestają grać naraz; ponowne wpisanie hasła nie pomaga. | Sprawdzić datę teraz i odnowić token przed kolejną sesją (rozdz. 10.6); przy odnowieniu wybrać ważność ok. roku (rozdz. 10.4). |
| Celowe zalanie adresu któregoś Workera żądaniami | niskie | Bramka milczy do 00:00 UTC. Bez opłat. | Usunięcie zbędnego Workera push zmniejsza liczbę celów. Na `workers.dev` nie ma darmowych reguł ograniczania ruchu. |
| Pętle krótkich dźwięków pobierane od nowa przy każdym okrążeniu | niskie (dane tego nie pokazują) | Przekroczenie limitu API GitHuba → błędy odtwarzania do końca godziny. | Test z rozdz. 8.5; ewentualnie usprawnienie z rozdz. 13. |
| Niezrotowany `TRIGGER_TOKEN` i klucz konta serwisowego w porzuconym Workerze — **Worker usunięty 1 listopada 2026; zostało opcjonalne usunięcie klucza konta serwisowego (rozdz. 15.4)** | nieznane | Możliwość wysyłania powiadomień do 2 starych subskrypcji; dostęp administracyjny do projektu `WH40k-Data-Slate`, gdyby klucz kiedykolwiek wyciekł. | Usunąć Workera i wygenerowany dla niego klucz (rozdz. 12, pkt 5). |
| Przypadkowe przejście na plan płatny | niskie | Od tej chwili nadwyżki byłyby rozliczane. | Nie klikać „Upgrade”, nie podawać danych karty. |
| Bardzo duże pliki w `AudioRPG` (powyżej ok. 30–40 MB) | niskie | Przy żądaniach zakresów bramka trzyma w pamięci cały plik i jego wycinek; przy kilku takich żądaniach naraz grozi przekroczenie 128 MB → błąd 1102. | Długie ścieżki trzymać w rozsądnym rozmiarze (np. 10-minutowy OGG to ok. 5–10 MB). |
| Wyczerpanie miesięcznego limitu App Check (karty otwarte całymi dniami) | niskie | Zależnie od wymuszania App Check (rozdz. 9.2). | Zamykać karty po sesji; ewentualnie wydłużyć ważność znacznika App Check w konsoli Firebase. |
| Kolejne zmiany cenników usług | średnie w dłuższym czasie | — | Powtórzyć przegląd po następnym takim mailu. |

---

## 12. Rekomendacje

1. **Niczego nie zmieniać w kodzie ani w konfiguracji Cloudflare.** Do pozostania na planach darmowych nie jest to potrzebne.
2. **Nie klikać „Upgrade”** i nie dodawać metody płatności; nie aktywować płatnych usług (Workers Paid, R2). Funkcja „Add Budget Alert” dotyczy wyłącznie płatnego użycia, więc jest zbędna.
3. **Zostawić logi włączone.** Są darmowe i pozwalają zdiagnozować problem z bramką podczas sesji. Nie włączać Workers Traces. Próbkowanie logów (`head_sampling_rate`) ani wyłączanie logów wywołań (`invocation_logs = false`) nie jest potrzebne.
4. ⚠️ **Sprawdzić datę ważności tokenu `GITHUB_TOKEN`** i — jeżeli wypada ok. 1 grudnia — odnowić go przed kolejną sesją (instrukcja krok po kroku w rozdz. 10.6). Przy odnowieniu wybrać ważność ok. roku (rozdz. 10.4), żeby wymiana wypadała raz w roku zamiast co 90 dni. Zmiany w kodzie nie są potrzebne.
5. **Rozważyć usunięcie porzuconego Workera** `wrathandglory-push-api`:
   - w panelu Cloudflare: **Workers & Pages** → `wrathandglory-push-api` → **Settings** → na dole strony usunięcie Workera;
   - następnie dwie przestrzenie KV: `PUSH_SUBSCRIPTIONS` i `FCM_TOKENS` (sekcja magazynu KV w menu po lewej, zwykle **Storage & Databases** → **Workers KV**);
   - w konsoli Google Cloud projektu `WH40k-Data-Slate` (**IAM & Admin** → **Service Accounts** → konto `firebase-adminsdk…` → **Keys**) usunąć **tylko ten klucz**, który został wygenerowany dla Workera push (rozpoznasz go po dacie utworzenia). Innych kluczy nie ruszać, jeżeli są używane np. do importu danych.
   Zysk: bezpieczeństwo i porządek; dla limitów — kosmetyczny. Repozytorium nie wymaga przy tym żadnych zmian.
6. **Firebase:** zamykać karty modułów po sesji. Opcjonalnie sprawdzić w konsoli Firebase (sekcja App Check), czy wymuszanie jest włączone i ile ocen reCAPTCHA zużywa się w miesiącu.
7. **Po 1 grudnia** raz zajrzeć do **Observability** → **Usage**: dzienna ingestia powinna być rzędu tysięcznych części gigabajta (panel pokaże „0,00 GB”).

---

## 13. Możliwe usprawnienia na przyszłość (obecnie niepotrzebne)

Przy obecnym zużyciu żadne z nich nie daje odczuwalnej korzyści dla limitów. Każde wymagałoby osobnej decyzji i wdrożenia.

| Usprawnienie | Co daje | Kiedy ma sens |
| --- | --- | --- |
| Pętla dźwięku jednowariantowego na tym samym elemencie `Audio` (np. `audio.loop = true`) zamiast nowego elementu na każde okrążenie | Okrążenia pętli nie wymagają żadnego pobrania. | Gdy test z rozdz. 8.5 pokaże pobieranie przy każdym okrążeniu. |
| Nagłówek `ETag` w odpowiedzi `/a` (np. skrót ścieżki pliku) | Przeglądarki łatwiej zachowują i łączą odpowiedzi częściowe. | j.w. |
| Lokalna pamięć najczęściej używanych dźwięków na czas sesji (Cache Storage / IndexedDB) | Odporność na chwilowe problemy z bramką lub GitHubem. | Gdy bramka zacznie zawodzić podczas sesji. |

---

## 14. Następne kroki

**Po stronie użytkownika:**

1. ✅ *Wykonane 1 listopada 2026 (rozdz. 15).* Sprawdzić datę ważności `GITHUB_TOKEN` (rozdz. 10.6, krok 1) i odnowić token przed tą datą, wybierając ważność ok. roku (rozdz. 10.4). Użytkownik wybrał token bez daty ważności.
2. *Częściowo wykonane 1 listopada 2026 (rozdz. 15):* Worker `wrathandglory-push-api` usunięty; zostały jego przestrzenie KV i klucz konta serwisowego (rozdz. 15.4).
3. Przed 1 grudnia nic więcej nie trzeba robić.

**Opcjonalna weryfikacja po 1 grudnia 2026** — do uzupełnienia tej analizy wystarczą zrzuty ekranu:

- **Observability** → **Usage**: wykres „Ingestion by dataset” i tabela „Usage by dataset”,
- **Workers & Pages** → panel **Usage** w widoku „This month”,
- przy dniu sesji — widok „Daily” oraz **Observability** → **Overview** z zakresem obejmującym sesję.

**Opcjonalnie przy najbliższej sesji:** test pętli z rozdz. 8.5.

---

## 15. Stan po działaniach użytkownika (1 listopada 2026)

Po rozbudowie analizy użytkownik wymienił token i posprzątał konto Cloudflare (prompty 1.6 i 1.7, zrzuty ekranu nr 6–11).

### 15.1 Co zostało zrobione

| Działanie | Wynik | Podstawa |
| --- | --- | --- |
| Utworzenie nowego tokenu GitHuba `audio-gate-no-expiration` | ✅ Ustawienia zgodne z rozdz. 10.6: właściciel `CuteLittleGoat`, dostęp tylko do `CuteLittleGoat/AudioRPG`, uprawnienia `Contents: Read-only` i wymagane `Metadata: Read-only`, ważność **bez daty** („No expiration”). | zrzuty nr 6–8 |
| Wklejenie nowego tokenu jako sekretu `GITHUB_TOKEN` Workera `audio-gate` | ✅ | relacja użytkownika |
| Test w module Audio | ✅ Dźwięki z archiwum grają — nowy token działa. | relacja użytkownika |
| Usunięcie starego tokenu `audio-gate` | ✅ Na liście tokenów został wyłącznie nowy token (uwaga w rozdz. 15.3, pkt 1). | zrzuty nr 9 i 11 |
| Usunięcie Workera `wrathandglory-push-api` | ✅ | zrzut nr 10 i relacja użytkownika |

Zrzut nr 9 potwierdził datę ważności starego tokenu: „Expires on Tue, Dec 1 2026” — dokładnie tak, jak wynikało z wyliczenia w rozdz. 10.1.

| Nr | Co pokazuje |
| --- | --- |
| 6 | Tworzenie tokenu: nazwa `audio-gate-no-expiration`, właściciel `CuteLittleGoat`, ważność „No expiration” z ostrzeżeniem GitHuba o braku daty ważności. |
| 7 | Dostęp do repozytoriów: „Only select repositories” — wyłącznie `CuteLittleGoat/AudioRPG`. |
| 8 | Uprawnienia: `Contents` — „Read-only”, `Metadata` — „Read-only” (wymagane); przycisk „Generate token”. |
| 9 | Lista tokenów fine-grained: nowy `audio-gate-no-expiration` („Never used”, bez daty ważności) i stary `audio-gate` („Never used”, „Expires on Tue, Dec 1 2026”). |
| 10 | Panel Cloudflare: okno potwierdzenia usunięcia Workera `wrathandglory-push-api`. |
| 11 | Lista tokenów po usunięciu starego: tylko `audio-gate-no-expiration`; u góry komunikat „Your token was unable to be deleted”. |

### 15.2 Co to oznacza w praktyce

- **Problem 1 grudnia zniknął.** Nowy token nie ma daty ważności, więc nie trzeba go odnawiać ani co 90 dni, ani raz w roku. Nie trzeba było zmieniać kodu ani hasła, a gracze nie musieli logować się ponownie.
- **Kiedy token mimo to przestanie działać:** tylko gdy (1) nikt nie skorzysta z archiwum przez rok — GitHub sam usunie wtedy nieużywany token, (2) token trafi do publicznego repozytorium — GitHub od razu go unieważni, albo (3) sam go usuniesz. Objawy i naprawa: rozdz. 10.3 oraz kroki 2–4 z rozdz. 10.6.
- **Ostrzeżenie GitHuba** („GitHub strongly recommends that you set an expiration date for your token…”) to ogólne zalecenie. Przy tym tokenie — tylko odczyt jednego repozytorium, wartość zapisana wyłącznie w ustawieniach bramki — brak daty ważności jest do przyjęcia (rozdz. 10.4). Przy jakimkolwiek podejrzeniu wycieku: usunąć token na GitHubie i utworzyć nowy.
- **Cloudflare:** na koncie został jeden Worker (`audio-gate`). Razem ze starym Workerem zniknęły jego sekrety: `TRIGGER_TOKEN`, klucze VAPID i kopia klucza konta serwisowego Firebase. Sprawa `TRIGGER_TOKEN` opisana w `WebView_FCM_Cloudflare_Worker/RotacjaTRIGGER_TOKEN.md` jest zamknięta, bo endpoint, który ten token chronił, już nie istnieje. Żądania botów pod stary adres nie uruchamiają już żadnego Workera, więc nie liczą się do limitu.
- **Limity:** wnioski z rozdz. 3 i 8 się nie zmieniają — stary Worker dawał ok. 1 żądanie dziennie.

### 15.3 Uwagi do zrzutów ekranu

1. **„Your token was unable to be deleted” (zrzut nr 11).** Komunikat pojawił się, choć stary token zniknął z listy. Najbardziej prawdopodobne wyjaśnienie: drugie kliknięcie „Delete” po skutecznym pierwszym — przy drugim token już nie istniał. Sprawdzenie: odśwież stronę z listą tokenów. Jeżeli stary token nie wróci, jest usunięty. Gdyby jednak nadal istniał, nic złego się nie stanie: bramka go już nie używa, a 1 grudnia 2026 wygaśnie sam.
2. **„Never used” przy tokenach (zrzuty nr 9 i 11).** Napis był widoczny przy starym tokenie (który według instrukcji z września miał trafić do bramki) i przy nowym tokenie także po udanym teście. Wskaźnik ostatniego użycia na GitHubie najwyraźniej nie aktualizuje się od razu; możliwe też, że część plików bramka podała z pamięci podręcznej Cloudflare, bez pytania GitHuba. Dowodem, że token działa, jest to, że dźwięki z archiwum grają — nie ten napis.
3. **Na wszelki wypadek** warto zajrzeć na listę **Tokens (classic)** (to samo menu po lewej, pod „Fine-grained tokens”). Jeżeli jest tam token założony we wrześniu dla bramki, można go usunąć — bramka używa już nowego tokenu. Tokenów używanych do innych celów nie usuwać.

### 15.4 Co jeszcze zostało (opcjonalnie, bez pośpiechu)

| Zadanie | Gdzie | Dlaczego | Pilność |
| --- | --- | --- | --- |
| Usunąć dwie przestrzenie KV: `PUSH_SUBSCRIPTIONS` i `FCM_TOKENS` | panel Cloudflare, sekcja magazynu KV (zwykle **Storage & Databases** → **Workers KV**) | Usunięcie Workera nie kasuje jego przestrzeni KV. Leżą w nich 2 stare subskrypcje powiadomień. | niska — nic nie kosztują i nic nie zużywają |
| Usunąć klucz konta serwisowego Firebase wygenerowany dla Workera push | Google Cloud Console projektu `WH40k-Data-Slate` → **IAM & Admin** → **Service Accounts** → konto `firebase-adminsdk…` → **Keys** | Kopia w Cloudflare zniknęła razem z Workerem, ale sam klucz nadal działa (np. jako plik JSON pobrany wtedy na dysk). | niska. **Nie usuwać**, jeżeli ten sam plik JSON służy do skryptów importu danych opisanych w `FirebaseREADME.md`. W razie potrzeby nowy klucz można wygenerować w każdej chwili. |
| Sprawdzić listę **Tokens (classic)** | GitHub → **Settings** → **Developer settings** → **Personal access tokens** | rozdz. 15.3, pkt 3 | niska |
| Dopisać do instrukcji modułu (`Audio/docs/README.md`) wyjaśnienie komunikatu z „HTTP 401” | repozytorium | Instrukcja opisuje dziś tylko wariant „HTTP 404” tego komunikatu. | opcjonalnie, na życzenie |

---

## 16. Źródła

Stan na 1 listopada 2026.

**Cloudflare**

- [Observability — Pricing](https://developers.cloudflare.com/observability/pricing/) — plan Free od 1.12.2026: 0,5 GB / doba, retencja 7 dni, wstrzymanie zbierania po limicie, reset 00:00 UTC, definicja objętości.
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/) — obecne limity (Free: 200 000 zdarzeń / doba, 3 dni), `head_sampling_rate`, `invocation_logs = false`, maksymalny rozmiar logu 256 KB.
- [Workers Traces](https://developers.cloudflare.com/workers/observability/traces/) — ślady wykonania włączane ręcznie.
- [Workers — Limits](https://developers.cloudflare.com/workers/platform/limits/) — 100 000 żądań / doba z resetem o północy UTC, błąd 1027, 10 ms CPU, błąd 1102, 128 MB, 50 podzapytań, limity Cache API.
- [Workers — Pricing](https://developers.cloudflare.com/workers/platform/pricing/) — plan Free Workers, Workers Logs i Workers KV.
- [Workers — Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/) oraz [How the cache works](https://developers.cloudflare.com/workers/reference/how-the-cache-works/) — pamięć podręczna działa dla Workerów pod własną domeną, jest lokalna dla centrum danych.
- [Workers — Errors](https://developers.cloudflare.com/workers/observability/errors/) — kody 1027 i 1102.
- [Cloudflare Community — Cloudflare worker cache does not work](https://community.cloudflare.com/t/cloudflare-worker-cache-does-not-work/298125) — raport o braku działania Cache API na `workers.dev` (źródło nieoficjalne).

**GitHub**

- [Rate limits for the REST API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) — 5 000 żądań / godzinę dla tokenów osobistych, limity dodatkowe.
- [REST API — Repository contents](https://docs.github.com/en/rest/repos/contents) oraz [changelog z 3.05.2022](https://github.blog/changelog/2022-05-03-increased-file-size-limit-when-retrieving-file-contents-via-rest-api) — pliki do 100 MB w typie raw.
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) — 1 GB, 100 GB / miesiąc, 10 publikacji / godzinę.
- [Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) — ścieżka do listy tokenów (Settings → Developer settings → Personal access tokens → Fine-grained tokens), ważność tokenu fine-grained („Infinite lifetimes are allowed but may be blocked by a maximum lifetime policy set by your organization or enterprise owner”), usuwanie tokenów nieużywanych przez rok.
- [GitHub credential types](https://docs.github.com/en/organizations/managing-programmatic-access-to-your-organization/github-credential-types) — token fine-grained: „Configurable (up to 1 year, or no expiration)”; „Revoked automatically if pushed to a public repository or gist, or if unused for one year”.
- [Token expiration and revocation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/token-expiration-and-revocation) — „It is not possible to restore an expired or revoked token, you or the application will need to create a new token.”

**Google / Firebase**

- [Firebase pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans) — limity planu Spark.
- [reCAPTCHA — Compare tiers](https://docs.cloud.google.com/recaptcha/docs/compare-tiers) i [reCAPTCHA — Billing information](https://docs.cloud.google.com/recaptcha/docs/billing-information) — 10 000 ocen / miesiąc bez płatności, zachowanie po przekroczeniu.

**Repozytorium**

- `Audio/app.js`, `Audio/worker/audio-gate.js`, `Audio/AudioManifest.json`, `shared/firebase-app-check.js`, `shared/firestore-audiorpg.rules`, `Main/index.html`.
- `WebView_FCM_Cloudflare_Worker/Archiwalne/Notatki.txt`, `Archiwalne/kod-wrathandglory-push-api.txt`, `RotacjaTRIGGER_TOKEN.md` (tylko odczyt).
- Historia gita: `Analizy/KonfiguracjaCloudflareAudio.md` (commit sprzed `3a93f48`) i `Analizy/UtajnienieAudio.md` (commit sprzed `0cdaf31`).

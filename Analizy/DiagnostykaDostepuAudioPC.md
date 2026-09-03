# Analiza — błąd bramki audio na PC przy działającym telefonie oraz długość hasła grupy

**Data:** 3 września 2026
**Moduł:** `Audio`
**Zakres:** diagnoza komunikatu „Brak połączenia z bramką dostępu" występującego wyłącznie na komputerze, przy w pełni działającym module na telefonie; dodatkowo odpowiedź na pytanie o wymaganą długość hasła grupy.
**Charakter:** analiza. **W kodzie nie wprowadzono żadnych zmian.**

---

## 1. Pełna treść polecenia

> Przeprowadź analizę. Nie zmieniaj nic w kodzie. Zapisz wyniki w nowym pliku w Analizy/
>
> Jak robię Ctrl+F5 to na PC pojawia mi się błąd:
> Brak połączenia z bramką dostępu. Sprawdź internet oraz adres bramki w stałej AUDIO_GATE_BASE.
>
> Jak uruchamiam przez przeglądarkę na telefonie to wszystko działa. W panelu admina mam 1346 pozycji.
>
> Dla sprawdzenia poniżej wklejam aktualny kod workera:
>
> *(w poleceniu wklejona została pełna treść pliku `Audio/worker/audio-gate.js` — od nagłówka „Bramka dostępowa modułu Audio" po `export default { async fetch(request, env, ctx) { ... } }`)*
>
> Dodatkowo - czy hasło musi mieć 12 znaków? Mogę jakoś zmienić do 6?

---

## 2. Wniosek w jednym zdaniu

Bramka, worker, sekrety, manifesty i kod modułu są sprawne — dowodzi tego działający telefon z kompletem 1346 pozycji — a błąd na PC oznacza, że **żądanie do bramki nie wychodzi z tej konkretnej przeglądarki**; najbardziej prawdopodobną przyczyną jest otwieranie strony spod innego adresu niż `https://cutelittlegoat.github.io` (kopia lokalna, `file://`, Live Server), na drugim miejscu blokada przez rozszerzenie lub antywirusa.

Hasło **nie musi mieć 12 znaków** — w kodzie nie ma żadnej walidacji długości. Liczba 12 to moja rekomendacja z wcześniejszego przewodnika, nie wymóg techniczny.

---

## 3. Co zostało zweryfikowane

Wszystkie poniższe punkty sprawdzono na żywym środowisku w trakcie tej analizy, nie na podstawie założeń.

### 3.1. Bramka jest w pełni sprawna

| Sprawdzenie | Wynik |
| --- | --- |
| `GET /health` | `200`, `hasPassword: true`, `hasSigningKey: true`, `hasGithubToken: true` |
| `OPTIONS /login` (preflight) | `204` z kompletem nagłówków CORS |
| `POST /login` — błędne hasło | `401 invalid_password` |
| `POST /login` — treść niebędąca JSON-em | `400 bad_request` |
| `GET /manifest` bez tokenu | `401 unauthorized` |
| `GET /sign` bez tokenu | `401 unauthorized` |
| `GET /a` z podrobionym podpisem | `403 Forbidden` |

Worker nie rzuca wyjątkami i odpowiada poprawnym JSON-em na każdej ścieżce.

### 3.2. Wklejony kod workera jest identyczny z repozytorium

Porównano wszystkie stałe konfiguracyjne (`REPO`, `REF`, `MANIFEST_PATH`, `LINK_BUCKET_SECONDS`, `LINK_BUCKETS_AHEAD`, `MANIFEST_CACHE_SECONDS`, `ALLOWED_EXTENSIONS`) oraz kluczowe fragmenty logiki sesji. Wklejony kod to dokładnie ta wersja, która leży w `Audio/worker/audio-gate.js`: brak stałej `SESSION_TTL_SECONDS`, ładunek tokenu `{ iat: nowSeconds }`, `exp: null` w odpowiedzi `/login`. **Worker jest wdrożony poprawnie i nie wymaga żadnej zmiany.**

### 3.3. Pliki i strona są aktualne

| Zasób | Wynik |
| --- | --- |
| `…/WrathAndGlory/Audio/AudioManifest.json` | `200`, 121 323 B |
| `…/WrathAndGlory/Audio/AudioManifestDemo.json` | `404` (poprawnie — plik zmienił nazwę) |
| `…/WrathAndGlory/Audio/index.html` | `200`, zawiera już poprawkę rozdzielenia komunikatów |

### 3.4. Telefon dowodzi, że cały łańcuch działa

1346 pozycji w panelu admina to 112 pozycji warstwy publicznej plus 1234 pozycje warstwy chronionej. Żeby ta liczba się pojawiła, musiało zadziałać **wszystko naraz**: pobranie `AudioManifest.json`, logowanie w bramce, wydanie tokenu, pobranie `/manifest`, odczyt `audio-manifest.json` z prywatnego repozytorium przez token GitHuba oraz nagłówki CORS.

To jest najmocniejszy pojedynczy dowód w całej analizie. Wyklucza jednocześnie: awarię bramki, zły adres w `AUDIO_GATE_BASE`, wygasły token GitHuba, brak lub złą nazwę manifestu, błędny sekret `SIGNING_KEY`, błędną konfigurację CORS oraz błąd w kodzie modułu.

**Skoro serwer obsługuje telefon poprawnie, przyczyna leży po stronie komputera.**

---

## 4. Co dokładnie znaczy teraz ten komunikat

Po poprawce wdrożonej wcześniej tego samego dnia komunikat „Brak połączenia z bramką dostępu" **przestał być komunikatem zbiorczym**. Obecnie pojawia się w dokładnie jednym przypadku: gdy wywołanie `fetch()` pod adres `/login` **zakończyło się wyjątkiem**, czyli przeglądarka nie dostała żadnej odpowiedzi HTTP.

Gdyby bramka odpowiedziała czymkolwiek — nawet błędem 500 — zobaczyłbyś inny komunikat, z konkretnym kodem HTTP. Gdyby zawiódł manifest, zobaczyłbyś komunikat o liście publicznej albo o manifeście archiwum.

To zawężenie jest cenne diagnostycznie: **problem leży na poziomie sieci lub polityki przeglądarki, zanim jeszcze doszło do rozmowy HTTP z bramką.**

Wyjątek z `fetch()` powodują wyłącznie:

- nieudane rozwiązanie nazwy DNS,
- odrzucone lub zerwane połączenie TCP/TLS,
- zablokowanie żądania przez rozszerzenie, antywirusa albo politykę przeglądarki,
- **nieudana kontrola CORS**, w tym nieudany preflight `OPTIONS`.

---

## 5. Hipotezy, uporządkowane według prawdopodobieństwa

### Hipoteza 1 — strona na PC jest otwierana spod innego adresu niż GitHub Pages *(najbardziej prawdopodobna)*

Bramka wpuszcza **dokładnie jeden origin**. Sprawdzono to bezpośrednio, wysyłając preflight z czterech różnych origins:

| Origin w żądaniu | `Access-Control-Allow-Origin` w odpowiedzi |
| --- | --- |
| `https://cutelittlegoat.github.io` | `https://cutelittlegoat.github.io` |
| `http://localhost:8080` | `https://cutelittlegoat.github.io` |
| `null` (czyli `file://`) | `https://cutelittlegoat.github.io` |
| `http://127.0.0.1:5500` | `https://cutelittlegoat.github.io` |

Worker **zawsze** zwraca ten sam origin, niezależnie od pytającego — tak działa jego funkcja `corsHeaders()`, która wstawia stałą wartość ze zmiennej `ALLOWED_ORIGIN`. Dla przeglądarki oznacza to: jeżeli strona nie została otwarta spod `https://cutelittlegoat.github.io`, nagłówek nie pasuje do origins żądania i **przeglądarka blokuje odpowiedź, a `fetch()` rzuca wyjątkiem**.

Odtworzono to w kontrolowanym środowisku: strona podana z `http://localhost:5500` przy bramce zachowującej się dokładnie jak prawdziwa dała komunikat identyczny co do znaku:

```
Brak połączenia z bramką dostępu. Sprawdź internet oraz adres bramki w stałej AUDIO_GATE_BASE.
```

a w konsoli przeglądarki pojawił się prawdziwy powód:

```
Access to fetch at 'https://audio-gate.tarczynski-pawel.workers.dev/login'
from origin 'http://localhost:5500' has been blocked by CORS policy:
The 'Access-Control-Allow-Origin' header has a value 'https://cutelittlegoat.github.io'
that is not equal to the supplied origin.
```

**Dlaczego ta hipoteza tłumaczy różnicę PC/telefon:** na telefonie jedyną realną drogą do modułu jest opublikowany adres GitHub Pages. Na komputerze, na którym pracuje się z repozytorium, bardzo łatwo otworzyć plik lokalnie — podwójnym kliknięciem w `index.html` (`file://`), przez rozszerzenie Live Server w VS Code (domyślnie `127.0.0.1:5500`) albo przez własny serwer testowy. Wygląda to identycznie, a dla bramki jest to zupełnie inny origin.

Port 5500 użyty w teście nie jest przypadkowy — to domyślny port Live Servera.

### Hipoteza 2 — żądanie blokuje rozszerzenie przeglądarki albo antywirus

Domena `*.workers.dev` bywa obecna na listach blokujących używanych przez blokery reklam i pakiety antywirusowe, ponieważ bywa nadużywana do phishingu. Blokada rozszerzenia daje w konsoli charakterystyczny wpis `net::ERR_BLOCKED_BY_CLIENT`, a antywirus z inspekcją HTTPS — błąd certyfikatu albo zerwane połączenie.

Ta hipoteza również tłumaczy różnicę PC/telefon, bo rozszerzenia i pakiety ochronne siedzą zwykle tylko na komputerze.

### Hipoteza 3 — filtrowanie DNS w sieci komputera

Pi-hole, AdGuard Home, filtr operatora albo firmowy resolver mogą nie rozwiązywać `workers.dev`. W konsoli widać wtedy `net::ERR_NAME_NOT_RESOLVED`.

**Uwaga rozstrzygająca:** jeżeli telefon był w tej samej sieci Wi-Fi co komputer, ta hipoteza jest mało prawdopodobna. Jeżeli telefon działał na danych komórkowych, staje się bardzo prawdopodobna. To pytanie warto sobie zadać w pierwszej kolejności, bo odpowiedź od razu odcina albo potwierdza całą tę gałąź.

### Hipoteza 4 — polityka przeglądarki lub tryb prywatny

Zaostrzona ochrona przed śledzeniem, tryb „Blokuj wszystko" albo polityka firmowa mogą blokować żądania cross-origin. Mniej prawdopodobne niż powyższe, ale możliwe.

### Czego przyczyną **nie** jest

| Odrzucona przyczyna | Dowód |
| --- | --- |
| Zły adres w `AUDIO_GATE_BASE` | Telefon używa tego samego pliku `index.html` z tą samą stałą i działa. |
| Awaria lub zła konfiguracja workera | Siedem sprawdzeń bezpośrednich, wszystkie poprawne. |
| Wygasły token GitHuba | Telefon pobiera 1234 pozycje z prywatnego repozytorium. |
| Brak `audio-manifest.json` | Jak wyżej. |
| Stara wersja strony w cache | `Ctrl+F5` został wykonany, a żywy `index.html` zawiera już najnowszą poprawkę. |
| Błąd w kodzie modułu | Ten sam kod działa poprawnie na telefonie. |

---

## 6. Procedura diagnostyczna — jedna minuta, wynik rozstrzygający

### Krok 1 — sprawdź adres w pasku przeglądarki na PC

Musi zaczynać się dokładnie od:

```
https://cutelittlegoat.github.io/WrathAndGlory/Audio/index.html
```

Jeżeli widzisz `file:///`, `localhost`, `127.0.0.1` albo cokolwiek innego — **to jest cała przyczyna**. Otwórz adres opublikowany i problem zniknie.

### Krok 2 — otwórz w nowej karcie na PC

```
https://audio-gate.tarczynski-pawel.workers.dev/health
```

| Co widzisz | Co to znaczy |
| --- | --- |
| `{"ok":true,"hasPassword":true, …}` | Sieć i DNS są w porządku. Przyczyną jest CORS (hipoteza 1) albo blokada samych żądań XHR przez rozszerzenie. |
| Strona się nie ładuje, błąd DNS lub certyfikatu | Blokada na poziomie sieci, DNS albo antywirusa (hipotezy 2–3). |

### Krok 3 — zajrzyj do konsoli

Naciśnij `F12`, zakładka `Console`, powtórz próbę wpisania hasła. Wpis przy nieudanym żądaniu nazywa przyczynę wprost:

| Wpis w konsoli | Przyczyna |
| --- | --- |
| `blocked by CORS policy … not equal to the supplied origin` | Hipoteza 1 — zły origin |
| `net::ERR_BLOCKED_BY_CLIENT` | Hipoteza 2 — rozszerzenie blokujące |
| `net::ERR_NAME_NOT_RESOLVED` | Hipoteza 3 — DNS |
| `net::ERR_CERT_AUTHORITY_INVALID` | Hipoteza 2 — antywirus z inspekcją HTTPS |
| `net::ERR_CONNECTION_*` | Firewall albo zerwane połączenie |

### Krok 4 — test rozstrzygający dla hipotezy 2

Otwórz opublikowany adres w **oknie incognito z wyłączonymi rozszerzeniami**. Jeżeli zadziała, winne jest rozszerzenie — zostaje dodać `audio-gate.tarczynski-pawel.workers.dev` do wyjątków.

---

## 7. Odpowiedź na pytanie o długość hasła

### 7.1. Nie, hasło nie musi mieć 12 znaków

W kodzie **nie istnieje żadna walidacja długości hasła**. Sprawdzono oba miejsca, w których hasło jest w ogóle dotykane:

- **Worker**, funkcja `handleLogin()`: jedyne sprawdzenie to `timingSafeEqual(body?.password ?? "", env.GROUP_PASSWORD || "")`, czyli porównanie z sekretem w czasie stałym. Długość nie jest badana.
- **Moduł**, funkcja `submitAccessLitany()`: jedyne sprawdzenie to `if (!password)`, czyli „pole nie może być puste".

Cloudflare również nie narzuca minimalnej długości sekretu.

Liczba 12 pochodzi z mojego wcześniejszego przewodnika `Analizy/KonfiguracjaCloudflareAudio.md`, sekcja 8.1, gdzie napisałem „Minimum 12 znaków". **To była rekomendacja, nie wymóg**, i nie zaznaczyłem tego wtedy wyraźnie. Możesz ustawić hasło 6-znakowe i wszystko będzie działać.

### 7.2. Czy warto — ocena ryzyka

Bramka **nie ma żadnego ograniczenia liczby prób logowania**. Funkcja `handleLogin()` porównuje hasło i tyle; nie ma opóźnienia, blokady po serii nieudanych prób ani licznika. Jedynym realnym hamulcem jest limit 100 000 żądań dziennie na darmowym planie Cloudflare.

Co to oznacza w liczbach:

| Rodzaj hasła 6-znakowego | Liczba kombinacji | Czas przy 100 000 prób dziennie |
| --- | --- | --- |
| Słowo ze słownika (`bolter`, `kadia`) | ~10⁵ realistycznych kandydatów | **poniżej doby** |
| Same małe litery, losowe | 26⁶ ≈ 3,1 × 10⁸ | ok. 4 lata (średnio) |
| Litery i cyfry, losowe | 36⁶ ≈ 2,2 × 10⁹ | ok. 30 lat (średnio) |

Wniosek nie brzmi „6 znaków jest zawsze złe", tylko: **przy sześciu znakach o bezpieczeństwie decyduje wyłącznie to, czy hasło jest słowem**. Sześć losowych znaków to realnie przyzwoita ochrona w tym modelu zagrożeń. Sześcioznakowe słowo ze słownika to ochrona pozorna.

Jest jeszcze efekt uboczny, o którym warto wiedzieć: gdyby ktoś rzeczywiście prowadził atak słownikowy, wyczerpałby dzienny limit żądań i **bramka przestałaby działać także dla Ciebie** do końca doby.

### 7.3. Argument, który moim zdaniem przeważa

Sesja jest teraz **bezterminowa**. Hasło podaje się raz na urządzenie i nigdy więcej — nie przy każdym odtworzeniu, nie co 30 dni. Realna oszczędność z hasła 6-znakowego zamiast 12-znakowego to kilka sekund pisania, raz na urządzenie, na zawsze.

Za tę oszczędność płacisz jedyną warstwą, która chroni materiały objęte prawami autorskimi — bo to był cały cel tego wdrożenia.

### 7.4. Rekomendacja

Jeżeli 12 znaków jest niewygodne, lepszym kierunkiem niż skracanie jest **zmiana kształtu hasła, nie jego długości**. Trzy krótkie słowa oddzielone myślnikami dyktuje się przez telefon łatwiej niż sześć losowych znaków, a są nieporównanie mocniejsze:

```
mlot-kadia-swit
```

Piętnaście znaków, trzy sylabowe słowa, zero problemu z podyktowaniem.

Jeżeli mimo wszystko chcesz krótkie hasło, to **minimum rozsądku to sześć znaków, które nie są słowem** — na przykład `k7mR2q`. Kosztem jest to, że dyktuje się je gorzej niż trzy słowa.

**Nie używaj przykładu z przewodnika (`bolter-kadia-2026-mlot`) dosłownie** — leży on w publicznym repozytorium. Sprawdzono w trakcie tej analizy: obecne hasło grupy **nie jest** tą wartością, więc nic nie wyciekło.

### 7.5. Jak zmienić hasło i co się wtedy stanie

Zmiana polega na podmianie sekretu `GROUP_PASSWORD` w panelu Cloudflare. Warto znać dwie konsekwencje, bo nie są oczywiste:

- **Zmiana hasła nie wylogowuje nikogo.** Tokeny sesji są podpisywane kluczem `SIGNING_KEY`, a nie hasłem. Urządzenia, które już się zalogowały, będą działać dalej. Nowe hasło dotyczy wyłącznie nowych logowań.
- **Żeby unieważnić wszystkie sesje naraz**, trzeba zmienić `SIGNING_KEY`. Wtedy każde urządzenie musi podać hasło ponownie.

To rozdzielenie jest wygodne: hasło można zmienić bez uprzykrzania życia graczom, a w razie realnego wycieku ma się osobny, mocniejszy przycisk.

---

## 8. Ryzyka i obserwacje uboczne

| Ryzyko | Waga | Uwagi |
| --- | --- | --- |
| Brak ograniczenia prób logowania w bramce | średnia | Przy krótkim haśle staje się istotne. Przy dłuższym pozostaje teoretyczne. Dodanie limitu wymagałoby licznika w KV lub Durable Object — obie opcje są dostępne w darmowym planie, ale komplikują wdrożenie. |
| Sztywny pojedynczy `ALLOWED_ORIGIN` | niska–średnia | Jest to celowe zabezpieczenie i nie należy go rozluźniać. Skutek uboczny: praca na lokalnej kopii modułu zawsze skończy się tym błędem. Gdyby lokalne testy stały się potrzebne, właściwym rozwiązaniem jest obsługa listy dozwolonych origins, a nie `*`. |
| Komunikat nie odróżnia CORS od awarii sieci | niska | Przeglądarka celowo nie ujawnia skryptowi powodu odrzucenia CORS — to zabezpieczenie samej przeglądarki. Prawdziwy powód jest zawsze w konsoli. Można rozważyć dopisanie do komunikatu podpowiedzi „sprawdź konsolę (F12)". |
| Przykładowe hasło w publicznym repozytorium | niska | Wartość jest jawna z założenia jako przykład. Zweryfikowano, że nie jest używana. |

---

## 9. Następne kroki

1. **Sprawdź adres w pasku przeglądarki na PC** (sekcja 6, krok 1). To jedno spojrzenie rozstrzyga najbardziej prawdopodobną hipotezę.
2. Jeżeli adres jest poprawny — wykonaj kroki 2–4 i odczytaj wpis z konsoli. Tabela w sekcji 6 przypisuje każdemu wpisowi konkretną przyczynę.
3. Ustal, czy telefon działał na tym samym Wi-Fi, czy na danych komórkowych. To odcina albo potwierdza hipotezę o DNS.
4. W sprawie hasła: decyzja należy do Ciebie. Rekomendacja to trzy krótkie słowa zamiast skracania do sześciu znaków; jeżeli jednak wybierzesz sześć, niech nie będzie to słowo ze słownika.
5. Do rozważenia na później, poza zakresem tego zgłoszenia: dopisanie do komunikatu o braku połączenia podpowiedzi, żeby zajrzeć do konsoli.

---

## 10. Uwaga o zakresie

Zgodnie z poleceniem **w kodzie nie wprowadzono żadnych zmian**. Analiza opiera się na sprawdzeniach żywego środowiska, porównaniu wklejonego kodu workera z repozytorium oraz na dwóch kontrolowanych odtworzeniach błędu. Rekomendacja z sekcji 7.1 dotycząca „minimum 12 znaków" w pliku `Analizy/KonfiguracjaCloudflareAudio.md` pozostała nietknięta — jej ewentualne przeformułowanie na „rekomendacja, nie wymóg" wymaga osobnej decyzji.

# Audyt hardcoded URL do zmiany (DoPublikacji)

## Prompt użytkownika (kontekst)

> Przeczytaj plik Analizy/Udostepnienie.md a następnie zaktualizuj analizę Analizy/Hardcoded_URL_Audyt_2026-04-28.md o wypisanie wszystkich miejsc z hardcoded, jakie należy zmienić w aplikacji.

---

## Cel aktualizacji

Na bazie `Analizy/Udostepnienie.md` poniżej wypisane są **wszystkie miejsca z hardcoded URL, które należy zmienić** w aplikacji, aby kopia `DoPublikacji` była niezależna od infrastruktury autora.

---

## Metodologia

Wykorzystano wyszukiwanie po domenach i linkach wskazanych w analizie udostępnienia:

```bash
rg -n "cutelittlegoat\.github\.io|workers\.dev|owlbear|discord\.com/channels|DATA_URL\s*=\s*\"https://|Adres strony:\s*<code>https://" --glob '!**/node_modules/**' --glob '!Analizy/**'
```

---

## Wszystkie miejsca z hardcoded URL, które trzeba zmienić

## 1) Linki modułów i nawigacja (GitHub Pages autora)

1. `Main/index.html:173`  
   `href="https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html"`
2. `Main/index.html:180`  
   `href="https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNPC/"`
3. `Main/index.html:195`  
   `href="https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/"`
4. `Main/index.html:217`  
   `"https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/index.html"`
5. `Main/index.html:224`  
   `"https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html?admin=1"`
6. `Main/index.html:225`  
   `"https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html"`

**Do zmiany:** na ścieżki względne albo placeholdery do ręcznego uzupełnienia po wdrożeniu grupy.

---

## 2) Linki środowiskowe grupy (mają być placeholderami)

1. `Main/ZmienneHiperlacza.md:3`  
   `https://www.owlbear.rodeo/room/Iv_SzpbfiqUY/The%20Mad%20Joke`
2. `Main/ZmienneHiperlacza.md:4`  
   `https://discord.com/channels/820916809946628096/1434928498476191834`

**Do zmiany:** na jawne placeholdery (`ENTER_...`) w kopii publikacyjnej.

---

## 3) GeneratorNPC – źródło danych spięte z DataVault autora

1. `GeneratorNPC/index.html:38`  
   `href="https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json"`
2. `GeneratorNPC/index.html:39`  
   tekst linku: `cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json`
3. `GeneratorNPC/index.html:388`  
   `const DATA_URL = "https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json";`
4. `GeneratorNPC/docs/Documentation.md:26`  
   opis techniczny zawierający ten sam URL

**Do zmiany:** na lokalne/relatywne źródło danych lub konfigurowalny placeholder URL.

---

## 4) Infoczytnik – zasoby multimedialne wskazujące na hosting autora

`Infoczytnik/assets/data/data.json` (13 wystąpień):

1. `:6`   `.../assets/backgrounds/DataSlate_01.png`
2. `:11`  `.../assets/backgrounds/DataSlate_02.png`
3. `:16`  `.../assets/backgrounds/DataSlate_03.png`
4. `:21`  `.../assets/backgrounds/DataSlate_04.png`
5. `:26`  `.../assets/backgrounds/DataSlate_05.png`
6. `:31`  `.../assets/backgrounds/DataSlate_Inq.png`
7. `:36`  `.../assets/backgrounds/Litannie_Zagubionych.png`
8. `:41`  `.../assets/backgrounds/Notatnik.png`
9. `:46`  `.../assets/backgrounds/Pergamin.png`
10. `:51` `.../assets/backgrounds/WnG.png`
11. `:58` `.../assets/logos/Mechanicus.png`
12. `:63` `.../assets/logos/Inquisition.png`
13. `:70` `.../assets/audios/Message.mp3`

(każdy z powyższych wpisów ma prefiks: `https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/...`)

Dodatkowo:

14. `Infoczytnik/index.html:174`  
    `Adres strony: https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/`

**Do zmiany:** na ścieżki względne i neutralny opis URL aplikacji (bez domeny autora).

---

## 5) Push API (Cloudflare Worker autora)

1. `Infoczytnik/config/web-push-config.js:4`  
   `subscribeEndpoint: "https://wrathandglory-push-api.tarczynski-pawel.workers.dev/api/push/subscribe"`
2. `Infoczytnik/config/web-push-config.js:5`  
   `triggerEndpoint: "https://wrathandglory-push-api.tarczynski-pawel.workers.dev/api/push/trigger"`

**Do zmiany:** na placeholdery domeny grupy lub wyłączenie funkcji push w `DoPublikacji` (zgodnie z założeniami z `Udostepnienie.md`).

---

## 6) Archiwum WebView_FCM_Cloudflare_Worker (też zawiera hardcoded)

Jeśli ten folder pozostaje w repozytorium roboczym, również zawiera twarde URL-e autora:

- `WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html`: linie `1398, 1405, 1418, 1439, 1446, 1447, 2930, 2931, 2971`.
- Ten sam plik zawiera również tekstowe wskazanie domeny worker (`:66`).

**Do zmiany lub usunięcia z paczki publikacyjnej:** zgodnie z założeniem, że `WebView_FCM_Cloudflare_Worker` nie trafia do `DoPublikacji`.

---

## Podsumowanie (lista kontrolna)

Aby usunąć hardcoded zależności od infrastruktury autora, należy zmienić URL-e w:

1. `Main/index.html`
2. `Main/ZmienneHiperlacza.md`
3. `GeneratorNPC/index.html`
4. `GeneratorNPC/docs/Documentation.md`
5. `Infoczytnik/assets/data/data.json`
6. `Infoczytnik/index.html`
7. `Infoczytnik/config/web-push-config.js`
8. `WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html` (lub usunąć folder z paczki publikacyjnej)

To są miejsca bezpośrednio wpływające na izolację instancji i niezależność grup po wdrożeniu.

# Uzupełnienie analizy hardcoded URL (DoPublikacji)

## Prompt użytkownika (kontekst)

> Przeczytaj analizę Analizy/Hardcoded_URL_Audyt_2026-04-28.md i rozbuduj analizę o dodatkowe dane:
>
> Poniżej będę używać określeń "wersja produkcyjna" (czyli to co jest teraz) i "kopia" (czyli kopia jaka ma być przygotowana do udostępnienia)
>
> 1) Linki modułów i nawigacja (GitHub Pages autora)
> - Czy można zmienić je na ścieżki względne, żeby w wersji produkcyjnej (i aplikacji PWA) wciąż wszystko działało?
>
> 2) Linki środowiskowe grupy (mają być placeholderami)
> - W wersji produkcyjnej zostaje jak jest. W kopii będą placeholdery.
>
> 3) GeneratorNPC – źródło danych spięte z DataVault autora
> - nie rozumiem co to znaczy "na lokalne/relatywne źródło danych lub konfigurowalny placeholder URL."
> Czy może to być ścieżka względna jak w pkt1?
>
> 4) Infoczytnik – zasoby multimedialne wskazujące na hosting autora
> - Czy można zmienić je na ścieżki względne, żeby w wersji produkcyjnej wciąż wszystko działało?,
>
> 5) Push API (Cloudflare Worker autora)
> - W kopii nie będzie danych odnośnie funkcji powiadomień, więc tych plików nie będzie
>
> 6) Archiwum WebView_FCM_Cloudflare_Worker (też zawiera hardcoded)
> - W kopii nie będzie danych odnośnie funkcji powiadomień, więc tych plików nie będzie

---

## Zakres i sposób doprecyzowania

To uzupełnienie **nie zmienia kodu**, tylko doprecyzowuje decyzje wdrożeniowe dla dwóch wariantów:
- **Wersja produkcyjna** (obecne środowisko autora),
- **Kopia do udostępnienia** (bez danych autora i bez push).

Wnioski oparto o aktualne odwołania hardcoded zidentyfikowane w plikach `Main`, `GeneratorNPC`, `Infoczytnik` oraz `WebView_FCM_Cloudflare_Worker`.

---

## Odpowiedzi na pytania

### 1) Linki modułów i nawigacja (GitHub Pages autora)

**Tak — można zmienić je na ścieżki względne** i to jest rozwiązanie zalecane zarówno dla produkcji, jak i dla kopii.

### Dlaczego to zadziała w produkcji i PWA?
- Aplikacja działa jako zestaw modułów w jednym repo/strukturze katalogów.
- Linki typu `../DataVault/index.html`, `../GeneratorNPC/`, `../Kalkulator/`, `../Infoczytnik/index.html` są niezależne od domeny.
- W PWA (uruchomienie z tej samej domeny-origin) nawigacja relatywna jest stabilniejsza niż linki absolutne do konkretnej domeny autora.

### Warunek
- Trzeba zachować ten sam układ katalogów modułów względem `Main`.

### Rekomendacja praktyczna
- W obu wariantach (produkcja + kopia) przejść na ścieżki względne dla nawigacji między modułami.

---

### 2) Linki środowiskowe grupy (placeholdery)

Potwierdzenie: **zgodnie z Twoim założeniem**.

- **Produkcja:** zostają aktualne realne linki środowiskowe.
- **Kopia:** w `Main/ZmienneHiperlacza.md` wstawiane placeholdery (np. `ENTER_OWLBEAR_URL`, `ENTER_DISCORD_URL`).

To jest poprawne i spójne z celem publikacji kopii bez danych grupy/autora.

---

### 3) GeneratorNPC – źródło danych spięte z DataVault autora

Twoje pytanie: czy to może być ścieżka względna jak w pkt 1?

**Tak, może — i to jest najprostsza opcja, jeśli kopia zawiera lokalny moduł DataVault z `data.json` w przewidywalnym miejscu.**

#### Co znaczyło „lokalne/relatywne źródło danych lub konfigurowalny placeholder URL”?

To są **dwa równoważne warianty**:

1. **Relatywnie (lokalnie w paczce):**
   - `DATA_URL` wskazuje lokalny plik przez ścieżkę względną (np. `../DataVault/data.json`).
   - Plus: działa bez zewnętrznej domeny autora.
   - Minus: wymaga, aby `DataVault/data.json` faktycznie był dostępny w tym miejscu.

2. **Konfigurowalnie (placeholder):**
   - `DATA_URL` ma placeholder (np. `ENTER_DATA_URL`).
   - Plus: każda grupa podmienia URL na własne źródło (API/hosting JSON).
   - Minus: wymaga ręcznej konfiguracji po wdrożeniu.

#### Kiedy który wariant?
- Jeśli „kopia” ma być „odpal i działa”: **relatywny URL**.
- Jeśli „kopia” ma być szablonem dla wielu różnych wdrożeń: **placeholder URL**.

---

### 4) Infoczytnik – zasoby multimedialne na hostingu autora

**Tak — można zmienić na ścieżki względne i produkcja nadal będzie działać**, o ile pliki assetów zostają w repozytorium i w tej samej strukturze katalogów.

To dotyczy wpisów w `Infoczytnik/assets/data/data.json` (obrazy/logo/audio), które dziś są absolutnymi URL-ami do domeny autora.

#### Rekomendacja
- Zamienić wpisy na relatywne odwołania do lokalnych zasobów modułu Infoczytnik.
- Dodatkowo w `Infoczytnik/index.html` zmienić tekst „Adres strony”, aby nie pokazywał domeny autora (tekst neutralny lub dynamiczny).

---

### 5) Push API (Cloudflare Worker autora)

Potwierdzenie: jeśli w kopii **nie ma funkcji powiadomień**, to:
- pliki konfiguracyjne push mogą nie być dostarczane,
- logika UI/przycisków push powinna być wyłączona albo usunięta z kopii,
- brak tych plików jest zgodny z celem izolacji kopii.

W takim układzie hardcoded `workers.dev` przestaje być problemem dla kopii, bo ta funkcja nie istnieje w tym wariancie.

---

### 6) Archiwum WebView_FCM_Cloudflare_Worker

Potwierdzenie: skoro w kopii **nie będzie danych i funkcji powiadomień**, folder archiwum może nie trafić do kopii.

To poprawnie eliminuje hardcoded-y znajdujące się w tym archiwum (w tym URL-e autora i worker).

---

## Finalna matryca decyzji: produkcja vs kopia

| Obszar | Produkcja (obecna) | Kopia do udostępnienia |
|---|---|---|
| Linki modułów (Main) | Zalecana migracja na relatywne | Relatywne |
| Linki środowiskowe grupy | Realne linki | Placeholdery |
| GeneratorNPC `DATA_URL` | Relatywny lub obecny (docelowo relatywny) | Relatywny **lub** placeholder |
| Infoczytnik assety | Zalecane relatywne | Relatywne |
| Push API | Może zostać w produkcji | Usunięte/wyłączone |
| WebView_FCM_Cloudflare_Worker | Bez zmian (repo robocze) | Nie dołączamy |

---

## Krótkie doprecyzowanie ryzyk

1. Ścieżki względne są bezpieczne, ale tylko przy spójnej strukturze katalogów.
2. Jeśli `DATA_URL` przejdzie na relatywny plik, trzeba zapewnić dostępność `data.json` i zgodność CORS/origin (przy serwowaniu HTTP).
3. Usunięcie push z kopii wymaga dopilnowania, by UI nie próbował ładować nieistniejącej konfiguracji.

---

## Konkluzja

Na wszystkie pytania 1–4: **tak, ścieżki względne są poprawnym i zalecanym kierunkiem** (także dla produkcji i PWA), pod warunkiem zachowania struktury modułów.

Na pytania 5–6: **Twoje założenie jest poprawne** — jeśli kopia nie zawiera push, usunięcie plików push i archiwum całkowicie zamyka temat tych hardcoded-ów w kopii.



---

## Proponowane zmiany w kodzie

Założenie wdrożeniowe: w **wersji produkcyjnej** i w **kopii** przechodzimy na ścieżki względne tam, gdzie moduły i zasoby są częścią tej samej paczki katalogów.

### 1) `Main/index.html` — nawigacja między modułami

Zmienić linki absolutne GitHub Pages na relatywne:

- `href="https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html"` → `href="../DataVault/index.html"`
- `href="https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNPC/"` → `href="../GeneratorNPC/"`
- `href="https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/"` → `href="../Kalkulator/"`
- `"https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/index.html"` → `"../Infoczytnik/index.html"`
- `"https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html?admin=1"` → `"../DataVault/index.html?admin=1"`
- `"https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html"` → `"../DataVault/index.html"`

Efekt: brak zależności od domeny autora przy zachowaniu działania na tej samej strukturze katalogów.

### 2) `GeneratorNPC/index.html` — źródło `data.json`

Zamienić odwołania absolutne do DataVault na relatywne:

- `href="https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json"` → `href="../DataVault/data.json"`
- tekst pomocniczy `cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json` → `../DataVault/data.json`
- `const DATA_URL = "https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json";` → `const DATA_URL = "../DataVault/data.json";`

Efekt: `GeneratorNPC` działa z lokalnym `DataVault/data.json` w tej samej paczce modułów.

### 3) `Infoczytnik/assets/data/data.json` — media (obrazy, audio, logo)

Zamienić pełne URL-e na relatywne ścieżki do zasobów modułu, np.:

- `https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/backgrounds/DataSlate_01.png` → `../backgrounds/DataSlate_01.png`
- `https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/logos/Mechanicus.png` → `../logos/Mechanicus.png`
- `https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/audios/Message.mp3` → `../audios/Message.mp3`

Efekt: multimedia ładują się lokalnie z katalogu `Infoczytnik/assets/...`, bez stałej domeny.

### 4) `Infoczytnik/index.html` — opis adresu aplikacji

Zmienić statyczny tekst z adresem autora na neutralny komunikat (bez domeny), np.:

- `Adres strony: https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/`
- → `Adres strony: uruchomiono lokalną instancję modułu Infoczytnik`

Efekt: UI nie ujawnia ani nie wymaga konkretnego hostingu autora.

### 5) Pliki push i archiwum (tylko kopia)

Zgodnie z założeniami:
- w kopii nie dostarczamy funkcji push,
- folder `WebView_FCM_Cloudflare_Worker` nie trafia do kopii,
- `Infoczytnik/config/web-push-config.js` i zależna logika UI są usuwane lub wyłączane w kopii.

Efekt: brak zależności od `workers.dev` i brak danych środowiskowych autora.

### 6) Zmiana dokumentacji użytkowej wymagana dla GeneratorNPC

Dodać do `GeneratorNPC/docs/README.md` (PL i EN) informację:
- moduł działa poprawnie, jeśli obok katalogu `GeneratorNPC` znajduje się katalog `DataVault` z plikiem `data.json`.
- rekomendowana relacja katalogów: `../DataVault/data.json` względem `GeneratorNPC/index.html`.

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

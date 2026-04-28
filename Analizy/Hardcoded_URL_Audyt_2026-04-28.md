# Audyt hardcoded URL (izolacja modułów)

## Prompt użytkownika (kontekst)

> Przeczytaj analizę Analizy/Udostepnienie.md
>
> Sekcja "Dodatkowe zagrożenia (poza pkt 1–11)"
> Punkt 2. Niejednolity poziom izolacji modułów
> "Część modułów jest gotowa do pracy lokalnej, część ma hardcoded URL-e do Twojej infrastruktury."
>
> Przygotuj mi nowy plik z analizą i wypisz mi wszystkie miejsca, gdzie jest hardcoded URL.

---

## Zakres i metodologia

- Przeszukano repozytorium pod kątem wystąpień `https://` i `http://`.
- Wykluczono katalogi zależności: `**/node_modules/**`.
- Wykluczono folder analiz: `Analizy/**`.
- Komenda użyta do listowania:

```bash
rg -n "https://" --glob '!**/node_modules/**' --glob '!Analizy/**'
rg -n "http://" --glob '!**/node_modules/**' --glob '!Analizy/**'
```

---

## Wynik główny

Znaleziono hardcoded URL-e w kodzie aplikacji, plikach danych i dokumentacji.

Najważniejsze pod kątem izolacji grup (Twoja infrastruktura):

1. `cutelittlegoat.github.io` (nawigacja między modułami i zasoby danych/assetów):
   - `Main/index.html`
   - `GeneratorNPC/index.html`
   - `Infoczytnik/assets/data/data.json`
   - `Infoczytnik/index.html`
   - archiwalne pliki w `WebView_FCM_Cloudflare_Worker/Archiwalne/...`
2. `wrathandglory-push-api.tarczynski-pawel.workers.dev` (endpointy Web Push):
   - `Infoczytnik/config/web-push-config.js`
   - archiwalne pliki w `WebView_FCM_Cloudflare_Worker/Archiwalne/...`
3. Dodatkowe stałe linki środowiskowe/użytkowe:
   - `Main/ZmienneHiperlacza.md` (Owlbear/Discord).

---

## Pełna lista wszystkich miejsc z hardcoded URL

```text
### Wszystkie wystąpienia https://
Infoczytnik/GM.html:18:  <link rel="preconnect" href="https://fonts.googleapis.com">
Infoczytnik/GM.html:19:  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
Infoczytnik/GM.html:20:  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Cinzel:wght@400;700&family=Rajdhani:wght@400;600&family=IBM+Plex+Serif:wght@400;700&family=Open+Sans:wght@400;600;700&family=Noto+Serif:wght@400;700&family=DM+Serif+Display&family=IBM+Plex+Sans+Condensed:wght@400;600;700&family=Exo+2:wght@400;600;700&family=Black+Ops+One&family=Staatliches&family=Orbitron:wght@400;700&family=Questrial&family=Russo+One&family=Caveat:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet">
Infoczytnik/GM.html:131:<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js"></script>
Infoczytnik/GM.html:132:<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore-compat.js"></script>
Infoczytnik/GM.html:133:<script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>
Infoczytnik/index.html:174:      Adres strony: <code>https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/</code>
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:156:  <li><b>Dodaj logikę OAuth2 dla FCM HTTP v1:</b> Worker generuje JWT service account, pobiera access token z Google OAuth (<code>https://oauth2.googleapis.com/token</code>), a następnie wywołuje <code>https://fcm.googleapis.com/v1/projects/{PROJECT_ID}/messages:send</code>.</li>
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:1398:        &lt;a class=&quot;btn&quot; data-datavault-link href=&quot;https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html&quot; target=&quot;_self&quot;&gt;Skarbiec Danych&lt;/a&gt;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:1405:        &lt;a class=&quot;btn&quot; href=&quot;https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNPC/&quot; target=&quot;_self&quot;&gt;Generator NPC&lt;/a&gt;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:1418:        &lt;a class=&quot;btn&quot; href=&quot;https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/&quot; target=&quot;_self&quot;&gt;Kalkulator&lt;/a&gt;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:1439:        ? &quot;https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/index.html&quot;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:1446:        ? &quot;https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html?admin=1&quot;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:1447:        : &quot;https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html&quot;;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:1634:&lt;link rel=&quot;preconnect&quot; href=&quot;https://fonts.googleapis.com&quot;&gt;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:1635:&lt;link rel=&quot;preconnect&quot; href=&quot;https://fonts.gstatic.com&quot; crossorigin&gt;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:1636:&lt;link href=&quot;https://fonts.googleapis.com/css2?family=Share+Tech+Mono&amp;family=Cinzel:wght@400;700&amp;family=Rajdhani:wght@400;600&amp;family=Black+Ops+One&amp;family=Staatliches&amp;family=Orbitron:wght@400;700&amp;family=Questrial&amp;family=Russo+One&amp;display=swap&quot; rel=&quot;stylesheet&quot;&gt;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:1865:  import { initializeApp } from &quot;https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js&quot;;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:1866:  import { getFirestore, doc, onSnapshot } from &quot;https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js&quot;;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:2197:  &lt;link rel=&quot;preconnect&quot; href=&quot;https://fonts.googleapis.com&quot;&gt;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:2198:  &lt;link rel=&quot;preconnect&quot; href=&quot;https://fonts.gstatic.com&quot; crossorigin&gt;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:2199:  &lt;link href=&quot;https://fonts.googleapis.com/css2?family=Share+Tech+Mono&amp;family=Cinzel:wght@400;700&amp;family=Rajdhani:wght@400;600&amp;family=Black+Ops+One&amp;family=Staatliches&amp;family=Orbitron:wght@400;700&amp;family=Questrial&amp;family=Russo+One&amp;display=swap&quot; rel=&quot;stylesheet&quot;&gt;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:2427:  &lt;script src=&quot;https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js&quot;&gt;&lt;/script&gt;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:2428:  &lt;script src=&quot;https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore-compat.js&quot;&gt;&lt;/script&gt;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:2930:  subscribeEndpoint: &quot;https://wrathandglory-push-api.tarczynski-pawel.workers.dev/api/push/subscribe&quot;,
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:2931:  triggerEndpoint: &quot;https://wrathandglory-push-api.tarczynski-pawel.workers.dev/api/push/trigger&quot;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:2940:  subscribeEndpoint: &quot;https://twoja-domena.pl/api/push/subscribe&quot;,
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:2943:  triggerEndpoint: &quot;https://twoja-domena.pl/api/push/trigger&quot;
WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html:2971:ALLOWED_ORIGINS=https://cutelittlegoat.github.io,https://twojadomena.pl
WebView_FCM_Cloudflare_Worker/Archiwalne/kod-wrathandglory-push-api.txt:379:      subscription.endpoint.startsWith("https://") &&
WebView_FCM_Cloudflare_Worker/Archiwalne/kod-wrathandglory-push-api.txt:538:  const endpoint = `https://fcm.googleapis.com/v1/projects/${encodeURIComponent(
WebView_FCM_Cloudflare_Worker/Archiwalne/kod-wrathandglory-push-api.txt:618:    scope: "https://www.googleapis.com/auth/firebase.messaging",
WebView_FCM_Cloudflare_Worker/Archiwalne/kod-wrathandglory-push-api.txt:619:    aud: "https://oauth2.googleapis.com/token",
WebView_FCM_Cloudflare_Worker/Archiwalne/kod-wrathandglory-push-api.txt:639:  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
Infoczytnik/assets/data/data.json:6:      "file": "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/backgrounds/DataSlate_01.png"
Infoczytnik/assets/data/data.json:11:      "file": "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/backgrounds/DataSlate_02.png"
Infoczytnik/assets/data/data.json:16:      "file": "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/backgrounds/DataSlate_03.png"
Infoczytnik/assets/data/data.json:21:      "file": "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/backgrounds/DataSlate_04.png"
Infoczytnik/assets/data/data.json:26:      "file": "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/backgrounds/DataSlate_05.png"
Infoczytnik/assets/data/data.json:31:      "file": "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/backgrounds/DataSlate_Inq.png"
Infoczytnik/assets/data/data.json:36:      "file": "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/backgrounds/Litannie_Zagubionych.png"
Infoczytnik/assets/data/data.json:41:      "file": "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/backgrounds/Notatnik.png"
Infoczytnik/assets/data/data.json:46:      "file": "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/backgrounds/Pergamin.png"
Infoczytnik/assets/data/data.json:51:      "file": "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/backgrounds/WnG.png"
Infoczytnik/assets/data/data.json:58:      "file": "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/logos/Mechanicus.png"
Infoczytnik/assets/data/data.json:63:      "file": "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/logos/Inquisition.png"
Infoczytnik/assets/data/data.json:70:      "file": "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/assets/audios/Message.mp3"
GeneratorNPC/index.html:38:            <a class="link data-source-link" href="https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json">
GeneratorNPC/index.html:377:      import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
GeneratorNPC/index.html:385:      } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
GeneratorNPC/index.html:388:      const DATA_URL = "https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json";
GeneratorNPC/docs/Documentation.md:26:- `DATA_URL = "https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json"`.
GeneratorNPC/docs/README.md:52:1. Otwórz [https://console.firebase.google.com](https://console.firebase.google.com).
GeneratorNPC/docs/README.md:122:1. Open [https://console.firebase.google.com](https://console.firebase.google.com).
Infoczytnik/GM_backup.html:18:  <link rel="preconnect" href="https://fonts.googleapis.com">
Infoczytnik/GM_backup.html:19:  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
Infoczytnik/GM_backup.html:20:  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Cinzel:wght@400;700&family=Rajdhani:wght@400;600&family=Black+Ops+One&family=Staatliches&family=Orbitron:wght@400;700&family=Questrial&family=Russo+One&family=Caveat:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet">
Infoczytnik/GM_backup.html:131:<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js"></script>
Infoczytnik/GM_backup.html:132:<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore-compat.js"></script>
Infoczytnik/GM_backup.html:133:<script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>
Infoczytnik/Infoczytnik_test.html:21:  <link rel="preconnect" href="https://fonts.googleapis.com">
Infoczytnik/Infoczytnik_test.html:22:  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
Infoczytnik/Infoczytnik_test.html:23:  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Cinzel:wght@400;700&family=Rajdhani:wght@400;600&family=IBM+Plex+Serif:wght@400;700&family=Open+Sans:wght@400;600;700&family=Noto+Serif:wght@400;700&family=DM+Serif+Display&family=IBM+Plex+Sans+Condensed:wght@400;600;700&family=Exo+2:wght@400;600;700&family=Black+Ops+One&family=Staatliches&family=Orbitron:wght@400;700&family=Questrial&family=Russo+One&family=Caveat:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet">
Infoczytnik/Infoczytnik_test.html:64:<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js"></script>
Infoczytnik/Infoczytnik_test.html:65:<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore-compat.js"></script>
Infoczytnik/Infoczytnik_backup.html:18:  <link rel="preconnect" href="https://fonts.googleapis.com">
Infoczytnik/Infoczytnik_backup.html:19:  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
Infoczytnik/Infoczytnik_backup.html:20:  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Cinzel:wght@400;700&family=Rajdhani:wght@400;600&family=Black+Ops+One&family=Staatliches&family=Orbitron:wght@400;700&family=Questrial&family=Russo+One&family=Caveat:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet">
Infoczytnik/Infoczytnik_backup.html:58:<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js"></script>
Infoczytnik/Infoczytnik_backup.html:59:<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore-compat.js"></script>
Infoczytnik/docs/Documentation.md:229:  subscribeEndpoint: "https://.../api/push/subscribe",
Infoczytnik/docs/Documentation.md:230:  triggerEndpoint: "https://.../api/push/trigger"
Infoczytnik/docs/README.md:54:1. Otwórz [https://console.firebase.google.com](https://console.firebase.google.com).
Infoczytnik/docs/README.md:127:1. Open [https://console.firebase.google.com](https://console.firebase.google.com).
DataVault/app.js:943:  s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
DataVault/app.js:1106:  s.src = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
DataVault/index.html:120:  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.19.3/dist/xlsx.full.min.js"></script>
Audio/index.html:9:  <link rel="preconnect" href="https://fonts.googleapis.com">
Audio/index.html:10:  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
Audio/index.html:11:  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap" rel="stylesheet">
Audio/index.html:644:<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
Audio/index.html:650:    } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
Audio/index.html:657:    } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
Infoczytnik/config/web-push-config.production.example.js:7:  subscribeEndpoint: "https://twoja-domena.pl/api/push/subscribe",
Infoczytnik/config/web-push-config.production.example.js:10:  triggerEndpoint: "https://twoja-domena.pl/api/push/trigger"
Infoczytnik/config/web-push-config.js:4:  subscribeEndpoint: "https://wrathandglory-push-api.tarczynski-pawel.workers.dev/api/push/subscribe",
Infoczytnik/config/web-push-config.js:5:  triggerEndpoint: "https://wrathandglory-push-api.tarczynski-pawel.workers.dev/api/push/trigger"
Audio/docs/Documentation.md:26:https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap
Audio/docs/Documentation.md:32:https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
Audio/docs/Documentation.md:37:  - `https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js`
Audio/docs/Documentation.md:38:  - `https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js`
Infoczytnik/GM_test.html:21:  <link rel="preconnect" href="https://fonts.googleapis.com">
Infoczytnik/GM_test.html:22:  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
Infoczytnik/GM_test.html:23:  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Cinzel:wght@400;700&family=Rajdhani:wght@400;600&family=IBM+Plex+Serif:wght@400;700&family=Open+Sans:wght@400;600;700&family=Noto+Serif:wght@400;700&family=DM+Serif+Display&family=IBM+Plex+Sans+Condensed:wght@400;600;700&family=Exo+2:wght@400;600;700&family=Black+Ops+One&family=Staatliches&family=Orbitron:wght@400;700&family=Questrial&family=Russo+One&family=Caveat:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet">
Infoczytnik/GM_test.html:137:<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js"></script>
Infoczytnik/GM_test.html:138:<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore-compat.js"></script>
Infoczytnik/GM_test.html:139:<script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>
Audio/docs/README.md:59:1. Wejdź na [https://console.firebase.google.com](https://console.firebase.google.com).
Audio/docs/README.md:136:1. Open [https://console.firebase.google.com](https://console.firebase.google.com).
Infoczytnik/Infoczytnik.html:18:  <link rel="preconnect" href="https://fonts.googleapis.com">
Infoczytnik/Infoczytnik.html:19:  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
Infoczytnik/Infoczytnik.html:20:  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Cinzel:wght@400;700&family=Rajdhani:wght@400;600&family=IBM+Plex+Serif:wght@400;700&family=Open+Sans:wght@400;600;700&family=Noto+Serif:wght@400;700&family=DM+Serif+Display&family=IBM+Plex+Sans+Condensed:wght@400;600;700&family=Exo+2:wght@400;600;700&family=Black+Ops+One&family=Staatliches&family=Orbitron:wght@400;700&family=Questrial&family=Russo+One&family=Caveat:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet">
Infoczytnik/Infoczytnik.html:58:<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js"></script>
Infoczytnik/Infoczytnik.html:59:<script src="https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore-compat.js"></script>
Audio/config/Firebase-config.md:78:1. Wejdź do [https://console.firebase.google.com](https://console.firebase.google.com) i otwórz projekt.
Audio/config/Firebase-config.md:94:1. Open [https://console.firebase.google.com](https://console.firebase.google.com) and choose your project.
Audio/Disclaimer.md:3:https://grimdark-tabletop.pages.dev/audio-mixer/
Audio/Disclaimer.md:4:Sauce of inspiration (Reddit): https://www.reddit.com/r/40krpg/comments/1p5vhyx/as_promised_grimdark_audio_mixer_is_now_online/
Kalkulator/docs/README.md:55:1. Wejdź na stronę [https://console.firebase.google.com](https://console.firebase.google.com).
Kalkulator/docs/README.md:133:1. Go to [https://console.firebase.google.com](https://console.firebase.google.com).
Kalkulator/TworzeniePostaci.html:460:<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
Kalkulator/TworzeniePostaci.html:461:<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
Main/index.html:173:        <a class="btn" data-datavault-link href="https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html" target="_self">Skarbiec Danych</a>
Main/index.html:180:        <a class="btn" href="https://cutelittlegoat.github.io/WrathAndGlory/GeneratorNPC/" target="_self">Generator NPC</a>
Main/index.html:195:        <a class="btn" href="https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/" target="_self">Kalkulator</a>
Main/index.html:217:        ? "https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/index.html"
Main/index.html:224:        ? "https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html?admin=1"
Main/index.html:225:        : "https://cutelittlegoat.github.io/WrathAndGlory/DataVault/index.html";
Main/ZmienneHiperlacza.md:3:Mapa: https://www.owlbear.rodeo/room/Iv_SzpbfiqUY/The%20Mad%20Joke
Main/ZmienneHiperlacza.md:4:Obrazki: https://discord.com/channels/820916809946628096/1434928498476191834

### Wszystkie wystąpienia http://
DataVault/xlsxCanonicalParser.js:3:  const MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
DataVault/xlsxCanonicalParser.js:4:  const REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships";
DataVault/xlsxCanonicalParser.js:5:  const DOC_REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
DataVault/build_json.py:166:  ns = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
DataVault/build_json.py:180:  ns = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
DataVault/build_json.py:210:  ns = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
DataVault/build_json.py:263:    ns_main = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
DataVault/build_json.py:264:    ns_rel = {"rel": "http://schemas.openxmlformats.org/package/2006/relationships"}
DataVault/build_json.py:271:      rid = sheet.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
```

---

## Uwaga interpretacyjna

- Wykaz celowo zawiera **wszystkie** URL-e absolutne (również CDN, dokumentację, przykładowe placeholdery i przestrzenie nazw XML `http://schemas...`).
- Jeśli chcesz, w kolejnym kroku mogę przygotować wersję filtrowaną tylko do:
  - URL-i blokujących izolację instancji (np. `cutelittlegoat.github.io`, `workers.dev`),
  - URL-i wpływających na działanie po przeniesieniu modułów na inny serwer,
  - URL-i wymagających podmiany na placeholdery w `DoPublikacji`.

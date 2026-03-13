# Brakujące URL-e i backend do pełnego działania Web Push (stan na 2026-03-13)

## Prompt użytkownika (kontekst)
> Przeczytaj i zaktualizuj Analizy/Brakujace_URL_Firebase_i_Backend_WebPush_2026-03-13.md
> Na obecną chwilę nie mam żadnej konfiguracji na serwisie typu CloudFlare.
> Jedynie co mam repo na GitHub oraz skonfigurowany Firebase.
> Napisz mi czy to wystarcza do działania funkcjonalności.
> Jeżeli nie to uzupełnij analizę o BARDZO DOKŁADNE opisanie co i jak mam zrobić w CloudFlare, żeby ta funkcjonalność działała.
> Na obecną chwilę nie planuję migracji aplikacji z GitHub do CloudFlare, ale mogę tam zrobić jakiś backend jeżeli jest to wymagane.

---

## Krótka odpowiedź: czy GitHub + Firebase wystarcza?
**Nie, to nie wystarcza do pełnego działania obecnej funkcjonalności Web Push w tej architekturze.**

Dlaczego:
1. **GitHub Pages / statyczny hosting** nie uruchomi backendu Node/Express, który obsługuje endpointy:
   - `/api/push/subscribe`
   - `/api/push/trigger`
2. **Firebase skonfigurowany tylko jako „Web configuration + Web Push certificates”** nie zastępuje automatycznie Twojego własnego backendu używanego przez aktualny kod (z VAPID i zapisem subskrypcji).
3. W Twoim przepływie potrzebny jest **publicznie dostępny HTTPS endpoint backendowy** do zapisu subskrypcji i wysyłki pushy.

Wniosek: potrzebujesz jeszcze **warstwy backendowej** (może być bardzo lekka), np. na **Cloudflare Workers**.

---

## Co możesz zostawić bez zmian
- Repo i frontend mogą dalej zostać na GitHub/GitHub Pages.
- Firebase może pozostać skonfigurowany tak jak teraz (nie trzeba migrować aplikacji do Cloudflare).
- Cloudflare możesz użyć wyłącznie jako „mikro-backend API” do Web Push.

---

## Rekomendowana architektura bez migracji frontendu

### Cel
- Frontend: GitHub Pages (bez zmian)
- Backend push API: Cloudflare Worker
- (Opcjonalnie) Trwałe przechowywanie subskrypcji: Cloudflare KV lub D1

### Przepływ
1. Użytkownik w przeglądarce klika „Włącz powiadomienia”.
2. Frontend pobiera subskrypcję z Service Workera (`PushSubscription`).
3. Frontend wysyła subskrypcję do Worker endpointu `POST /api/push/subscribe`.
4. Worker zapisuje subskrypcję.
5. Gdy chcesz wysłać push (`POST /api/push/trigger`), Worker używa kluczy VAPID i wysyła push do zapisanych subskrypcji.

---

## Bardzo dokładnie: co zrobić w Cloudflare krok po kroku

## 0) Co przygotować przed startem
Przygotuj:
- konto Cloudflare,
- klucze VAPID, które już masz:
  - public key (Key pair),
  - private key,
- e-mail do `subject` VAPID (np. `mailto:admin@twojadomena.pl`).

> Uwaga bezpieczeństwa: klucz prywatny VAPID musi być tylko po stronie backendu (sekret), nigdy w kodzie frontendowym.

## 1) Załóż Worker (bez przenoszenia frontendu)
1. Zaloguj się do Cloudflare Dashboard.
2. Wejdź w **Workers & Pages**.
3. Kliknij **Create application** → **Create Worker**.
4. Nazwij np. `wrathandglory-push-api`.
5. Wybierz start od szablonu „Hello World” (potem podmienisz kod).

## 2) Dodaj sekrety (VAPID i token zabezpieczający trigger)
W Workerze przejdź do **Settings → Variables**:

### 2.1 Secrets (koniecznie jako secret)
Dodaj:
- `VAPID_PUBLIC_KEY` = Twój publiczny klucz,
- `VAPID_PRIVATE_KEY` = Twój prywatny klucz,
- `VAPID_SUBJECT` = np. `mailto:admin@twojadomena.pl`,
- `TRIGGER_TOKEN` = długi losowy string (min. 32 znaki) do autoryzacji endpointu trigger.

### 2.2 Environment variables (opcjonalnie)
- `ALLOWED_ORIGIN` = dokładny origin Twojego frontendu, np. `https://twoj-login.github.io`.

## 3) Dodaj storage na subskrypcje
Masz 2 opcje:

### Opcja prostsza: Cloudflare KV
1. W **Workers & Pages → KV** utwórz namespace, np. `PUSH_SUBSCRIPTIONS`.
2. Podłącz namespace do Workera jako binding, np. `SUBSCRIPTIONS_KV`.

### Opcja bardziej relacyjna: D1
Jeśli planujesz więcej logiki (użytkownicy, segmenty) – wybierz D1.
Na start KV zwykle wystarcza.

## 4) Wgraj kod Workera
W Workerze potrzebujesz endpointów:
- `POST /api/push/subscribe` – zapisuje subscription JSON,
- `POST /api/push/trigger` – wysyła push do zapisanych subscription,
- CORS preflight (`OPTIONS`).

Minimalne wymagania logiki:
1. Waliduj `Origin` (tylko Twój frontend).
2. Przy `subscribe` zapisuj subskrypcję pod kluczem hash endpointu.
3. Przy `trigger` wymagaj nagłówka autoryzacji, np. `Authorization: Bearer <TRIGGER_TOKEN>`.
4. Przy błędach 404/410 z endpointu push usuwaj nieaktualne subskrypcje.
5. Zwracaj poprawne nagłówki CORS (`Access-Control-Allow-Origin` dla Twojego originu).

> Technicznie możesz użyć biblioteki zgodnej z Web Push dla środowiska Workers lub wysyłki Web Push zgodnej ze specyfikacją (VAPID JWT + szyfrowanie payloadu). Jeśli implementacja „ręczna” okaże się zbyt złożona, praktycznie szybciej jest postawić mikroserwis Node na platformie serwerowej.

## 5) Wdróż Workera
1. Kliknij **Deploy**.
2. Otrzymasz URL typu:  
   `https://wrathandglory-push-api.<twoje-subdomain>.workers.dev`

To jest brakujący URL backendowy, którego potrzebuje frontend.

## 6) Skonfiguruj frontend, żeby używał Worker URL
W konfiguracji frontendu ustaw bazowy URL API na Worker, np.:
- `https://wrathandglory-push-api.<twoje-subdomain>.workers.dev/api/push/subscribe`
- `https://wrathandglory-push-api.<twoje-subdomain>.workers.dev/api/push/trigger`

Jeśli frontend ma endpointy relatywne (`/api/push/...`) i jest hostowany na GitHub Pages, to bez reverse proxy te ścieżki nie trafią do Workera – dlatego potrzebujesz jawnego URL lub własnej domeny z routingiem.

## 7) (Opcjonalnie) własna domena i ładne URL
Jeśli chcesz `https://api.twojadomena.pl`:
1. Dodaj domenę do Cloudflare DNS.
2. Dodaj route Workera dla `api.twojadomena.pl/*`.
3. Użyj tego adresu jako `PUSH_BACKEND_URL`.

To nie wymaga migracji frontendu z GitHub – tylko DNS + route dla API.

## 8) Testy po wdrożeniu (checklista)
1. `POST /api/push/subscribe` z frontendu zwraca 200/201.
2. W KV/D1 widać zapis subskrypcji.
3. `POST /api/push/trigger` z poprawnym tokenem zwraca sukces.
4. Powiadomienie przychodzi na Androidzie przy:
   - otwartej karcie,
   - zamkniętej karcie (service worker aktywny),
   - po ponownym wejściu do appki.
5. W konsoli brak błędów CORS i 401/403.

---

## Najczęstsze problemy i jak je rozpoznać
1. **CORS blocked** – zły `Access-Control-Allow-Origin` albo brak obsługi `OPTIONS`.
2. **401/403 trigger** – brak/niepoprawny `TRIGGER_TOKEN`.
3. **Push nie dochodzi mimo 200** – uszkodzona subskrypcja lub błąd VAPID (klucze/subject).
4. **Działa tylko lokalnie** – frontend nadal trafia w relatywne `/api/...`, a nie w URL Workera.
5. **Brak trwałości** – subskrypcje trzymane w pamięci zamiast KV/D1.

---

## Czy da się bez Cloudflare?
Tak, ale i tak potrzebujesz jakiegoś backendu HTTPS:
- Render / Railway / Fly.io / VPS / Firebase Functions.

Ponieważ pytasz konkretnie o Cloudflare i nie chcesz migracji frontendu – **Worker jako osobny backend** jest najczystszą opcją.

---

## Co konkretnie wystarczy, żeby ruszyć teraz
Minimalny zestaw produkcyjny:
1. Worker z `/api/push/subscribe` i `/api/push/trigger`.
2. Sekrety VAPID + `TRIGGER_TOKEN`.
3. KV na subskrypcje.
4. Frontend wskazujący na URL Workera.

Dopiero wtedy Twoje „GitHub + Firebase + VAPID” będzie domknięte jako działająca funkcjonalność end-to-end.

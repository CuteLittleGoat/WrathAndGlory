# Konfiguracja Firebase/FCM dla Android PWA — checklista i brakujące ustawienia

## Prompt użytkownika (kontekst)
> Sprawdź czy ta konfiguracja [Firebase/Firebase2.jpg] jest poprawna. Jeżeli muszę coś innego zrobić i ustawić (np. zmienić Rules, Alerts czy inne konfiguracje) to zrób mi nowy plik w Analizy i dokładnie opisz co dokładnie mam ustawić.

---

## 1) Ocena screenów Firebase

## 1.1 `Analizy/Firebase.jpg`
Na screenie widać, że w projekcie są:
- dodana aplikacja Android (`com.cutelittlegoat.wrathandglory`),
- dodana aplikacja Web (`DataSlate`).

**Ocena:** To jest poprawny kierunek. Dla PWA kluczowa jest aplikacja **Web** (tokeny web push i SW), a nie sama aplikacja Android natywna.

## 1.2 `Analizy/Firebase2.jpg`
Na screenie widać, że:
- **Firebase Cloud Messaging API (V1) = Enabled**,
- Legacy API = Disabled,
- sekcja **Web Push certificates** nie ma wygenerowanej pary kluczy (widoczny przycisk `Generate key pair`).

**Ocena:**
- API V1 włączone — **poprawnie**.
- Legacy wyłączone — **poprawnie**.
- Brak klucza Web Push — **niekompletne** dla web/PWA push.

---

## 2) Co dokładnie trzeba jeszcze ustawić

## 2.1 Obowiązkowe (minimum, żeby działało)

1. **Wygeneruj Web Push certificates (VAPID) w Firebase Console**
   - Firebase Console → Project settings → Cloud Messaging → Web configuration → Web Push certificates.
   - Kliknij `Generate key pair`.
   - Skopiuj **publiczny klucz VAPID**.

2. **Uzupełnij front config push**
   - W `Infoczytnik/config/web-push-config.js` wpisz:
     - `vapidPublicKey` (właśnie wygenerowany),
     - produkcyjne adresy `subscribeEndpoint` i `triggerEndpoint` (nie localhost).

3. **Uruchom backend push produkcyjnie** (jeżeli zostajesz przy obecnym backendzie)
   - Zmienna `WEB_PUSH_VAPID_PUBLIC_KEY` i `WEB_PUSH_VAPID_PRIVATE_KEY` musi istnieć na serwerze.
   - API `/api/push/subscribe` i `/api/push/trigger` musi być publicznie dostępne po HTTPS.

4. **Włącz i zweryfikuj Firebase Firestore (dane Infoczytnika)**
   - Kolekcja/dokument `dataslate/current` musi istnieć.
   - Reguły muszą umożliwiać odczyt userowi i kontrolowany zapis GM.

5. **HTTPS na produkcji**
   - PWA + Service Worker + Push wymagają HTTPS.
   - Bez HTTPS (poza localhost) push nie zadziała.

## 2.2 Silnie zalecane (stabilność produkcyjna)

6. **Ustaw App Check (dla Firebase usług)**
   - Ograniczy nadużycia w Firestore/Storage.
   - Dla web można użyć reCAPTCHA Enterprise/standard zależnie od planu.

7. **Dodaj monitoring i alerty**
   - Firebase/Google Cloud Monitoring:
     - alert na wzrost błędów 401/403/5xx z endpointów push,
     - alert na nagły spadek liczby dostarczonych powiadomień,
     - alert na nietypowy wzrost kosztów/wywołań.

8. **Obsłuż wygasłe tokeny/subskrypcje**
   - Już częściowo masz to w backendzie (404/410 cleanup); utrzymaj to w produkcji.

9. **Kontrola battery optimization na Androidzie (instrukcja dla użytkowników)**
   - W niektórych ROM-ach powiadomienia w tle są ubijane.
   - Dodaj do instrukcji użytkownika: wyłączyć agresywne oszczędzanie baterii dla przeglądarki/PWA.

---

## 3) Rules — co ustawić (propozycja startowa)

Poniżej bezpieczniejszy wariant niż całkowicie otwarte reguły.

## 3.1 Firestore Rules (propozycja)

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dataslate/current {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Wyjaśnienie
- `read: if true` — każdy klient Infoczytnika odczyta komunikat.
- `write: if request.auth != null` — zapis tylko po zalogowaniu (np. konto GM).

> Jeżeli dziś nie używasz logowania, technicznie można dać `allow write: if true`, ale to jest ryzykowne i niezalecane produkcyjnie.

## 3.2 Dodatkowe utwardzenie (opcjonalnie)
- Przenieś zapis do Cloud Function (HTTP callable) i podpisuj żądania sekretem GM.
- Ogranicz write tylko do serwera, a nie z frontendu.

---

## 4) Alerts — co ustawić

Minimalny zestaw alertów:
1. **Firestore usage spike** (nienormalny wzrost read/write).
2. **Cloud Functions / backend error rate** > ustalony próg (np. 5% przez 5 min).
3. **Push delivery failures** (z logów backendu: 401/403/410/5xx).
4. **Brak ruchu push** przez dłuższy czas w godzinach aktywności (anomalia operacyjna).

---

## 5) Czy obecna konfiguracja jest poprawna?

**Częściowo tak, ale nie jest kompletna do produkcji PWA push.**

- ✅ Poprawne: Android app dodana, Web app dodana, FCM API V1 włączone.
- ⚠️ Brakuje: wygenerowanego Web Push key pair i pełnego spięcia produkcyjnych endpointów push.
- ⚠️ Do dopracowania: reguły Firestore pod bezpieczeństwo + alerting + polityka baterii Android.

---

## 6) Rekomendacja końcowa (Android-first)

Ponieważ celem jest Android PWA (bez priorytetu iOS):
1. Domknij web push/FCM pod Chrome Android.
2. Przetestuj scenariusze A/B/C na realnym tablecie (z i bez aktywnej aplikacji).
3. Utrzymaj jedną stabilną ścieżkę wysyłki (albo obecny backend web-push, albo pełny FCM Web flow), bez mieszania kilku nieukończonych wariantów naraz.

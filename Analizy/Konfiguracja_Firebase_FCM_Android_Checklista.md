# Konfiguracja Firebase/FCM dla Android PWA — checklista i brakujące ustawienia

## Prompt użytkownika (kontekst)
> Sprawdź czy ta konfiguracja [Firebase/Firebase2.jpg] jest poprawna. Jeżeli muszę coś innego zrobić i ustawić (np. zmienić Rules, Alerts czy inne konfiguracje) to zrób mi nowy plik w Analizy i dokładnie opisz co dokładnie mam ustawić.

## Prompt użytkownika (aktualizacja kontekstu)
> Przeczytaj i zaktualizuj analizę: Analizy/Konfiguracja_Firebase_FCM_Android_Checklista.md. Utworzyłem Web Push certificates (Key pair: `BHEgyK2LpItiJFrT28XceIiHehAsbya5cg9v88hKDOUkCMcZciwBjgBeum5VQs247VTuSJceWwOaZas0WoI-eig`). Jeżeli alerty służą tylko np. powiadomieniu o samym działaniu Firebase i nie są konieczne do działania aplikacji to ich nie ustawiamy. Aplikacja ma prywatny, domowy i niekomercyjny użytek.

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
- sekcja **Web Push certificates** ma już wygenerowaną parę kluczy.

**Ocena:**
- API V1 włączone — **poprawnie**.
- Legacy wyłączone — **poprawnie**.
- Web Push key pair wygenerowany — **poprawnie** dla web/PWA push.
- Podany klucz (`BHEgyK2LpItiJFrT28XceIiHehAsbya5cg9v88hKDOUkCMcZciwBjgBeum5VQs247VTuSJceWwOaZas0WoI-eig`) traktuj jako **publiczny VAPID key** do konfiguracji frontu.

---

## 2) Co dokładnie trzeba jeszcze ustawić

## 2.1 Obowiązkowe (minimum, żeby działało)

1. **Wygeneruj Web Push certificates (VAPID) w Firebase Console**
   - ✅ Wykonane.
   - Firebase Console → Project settings → Cloud Messaging → Web configuration → Web Push certificates.
   - Publiczny klucz VAPID: `BHEgyK2LpItiJFrT28XceIiHehAsbya5cg9v88hKDOUkCMcZciwBjgBeum5VQs247VTuSJceWwOaZas0WoI-eig`.

2. **Uzupełnij front config push**
   - W `Infoczytnik/config/web-push-config.js` wpisz:
     - `vapidPublicKey` = `BHEgyK2LpItiJFrT28XceIiHehAsbya5cg9v88hKDOUkCMcZciwBjgBeum5VQs247VTuSJceWwOaZas0WoI-eig`,
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

## 2.2 Dla prywatnego, domowego użycia (Twój przypadek)

6. **Ustaw App Check (dla Firebase usług)**
   - Opcjonalne.
   - Przy aplikacji niepublicznej można to odłożyć, jeśli nie masz oznak nadużyć.

7. **Dodaj monitoring i alerty**
   - **Nieobowiązkowe** dla Twojego scenariusza (mała, prywatna grupa, brak publicznej ekspozycji).
   - Zgodnie z założeniem: jeśli alerty są tylko „administracyjne” i nie warunkują działania aplikacji, możesz ich nie konfigurować.
   - Wystarczy ręczne sprawdzenie logów, gdy zauważysz brak powiadomień.

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

W Twoim modelu użycia (domowy, prywatny, niekomercyjny) alerty **nie są wymagane** do poprawnego działania aplikacji.

Możesz zostawić je wyłączone i ewentualnie wrócić do tematu później, jeśli:
1. aplikacja zacznie być używana szerzej,
2. pojawią się losowe problemy z dostarczaniem push,
3. będziesz chciał szybciej wykrywać awarie bez ręcznego sprawdzania logów.

---

## 5) Czy obecna konfiguracja jest poprawna?

**Tak — po wygenerowaniu Web Push certificates konfiguracja jest kompletna na poziomie Firebase dla Android PWA push.**

- ✅ Poprawne: Android app dodana, Web app dodana, FCM API V1 włączone.
- ✅ Poprawne: Web Push key pair wygenerowany.
- ⚠️ Do domknięcia po stronie aplikacji: pełne spięcie produkcyjnych endpointów push i sprawdzenie reguł Firestore.
- ℹ️ Alerting możesz pominąć na obecnym etapie (zgodnie z profilem prywatnego użycia).

---

## 6) Rekomendacja końcowa (Android-first)

Ponieważ celem jest Android PWA (bez priorytetu iOS):
1. Domknij web push/FCM pod Chrome Android (frontend + endpointy serwera).
2. Przetestuj scenariusze A/B/C na realnym tablecie (z i bez aktywnej aplikacji).
3. Utrzymaj jedną stabilną ścieżkę wysyłki (albo obecny backend web-push, albo pełny FCM Web flow), bez mieszania kilku nieukończonych wariantów naraz.
4. Alerty zostaw jako opcję „na później” — nie są wymagane do startu w Twoim przypadku.

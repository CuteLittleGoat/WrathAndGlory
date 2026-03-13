# Brakujące URL-e do pełnego wdrożenia Web Push (Infoczytnik)

## Prompt użytkownika (kontekst)
> Przeczytaj analizę: Analizy/Projekt_PWA.md
>
> I wprowadź poprawki zgodnie z komentarzami:
> 3.2 Czego brakuje, aby uznać całość za „zapewnia obsługę wszystkich funkcjonalności”
> Poniżej załączam dane z Firebase z sekcji Web configuration, Web Push certificates (załączam screena)
>
> Key pair:
> BHEgyK2LpItiJFrT28XceIiHehAsbya5cg9v88hKDOUkCMcZciwBjgBeum5VQs247VTuSJceWwOaZas0WoI-eig
>
> Private key:
> jNxDs2rcrrFICZJsiPWAMHpyBhUMB9mfeFLPquSXZ3c
>
> Wprowadź te dane do kodu.
>
> Jeżeli wpisanie Key pair i Private key nie jest wystarczające to napisz mi w nowej analizie co mam zrobić.
>
> Jeżeli potrzebujesz ode mnie jakiegoś URL do Firebase to napisz mi w nowej analizie co i dokładnie potrzebujesz oraz gdzie mam to znaleźć.

---

## Czy samo wpisanie Key pair + Private key wystarcza?
Krótko: **nie w 100%**.

Po wpisaniu kluczy VAPID nadal potrzebny jest **docelowy URL backendu push** (albo konfiguracja reverse proxy), aby przepływ działał produkcyjnie na Androidzie w wariantach A/B/C.

## Co już zostało domknięte
1. Publiczny klucz VAPID jest wpisany w frontend (`web-push-config.js`).
2. Klucz prywatny VAPID został wpisany do konfiguracji backendu (`server.js` fallback + `.env.example`).
3. Frontend używa endpointów relatywnych `/api/push/subscribe` i `/api/push/trigger`.

## Czego brakuje od Ciebie (konkret)
Potrzebny jest **jeden URL wdrożeniowy backendu** lub potwierdzenie architektury hostingu:

### Opcja A (zalecana): jeden wspólny host frontend + backend
- Przykład: `https://twoja-domena.pl`
- Wymaganie: backend ma być podpięty pod:
  - `https://twoja-domena.pl/api/push/subscribe`
  - `https://twoja-domena.pl/api/push/trigger`

W tej opcji obecny kod (endpointy relatywne) będzie poprawny bez dalszych zmian frontendu.

### Opcja B: osobny host backendu
- Przykład backendu: `https://push.twoja-domena.pl`
- Wtedy trzeba będzie podmienić `web-push-config.js` na pełne URL-e backendu.

## Czy potrzebny jest „URL z Firebase”?
Do samego Web Push VAPID **nie** potrzebuję dodatkowego URL-a z Firebase (poza tym, co już jest w `firebase-config.js`).

Jeśli chcesz pełny audyt Firebase, mogę jeszcze sprawdzić czy w `firebase-config.js` są kompletne pola:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

Te wartości znajdziesz w: **Firebase Console → Project settings → Your apps → Web app → Firebase SDK snippet (Config)**.

## Następny krok dla Ciebie
Podaj proszę finalnie:
1. Czy backend push będzie na tym samym hostie co aplikacja (`TAK/NIE`).
2. Jeśli `NIE` — podaj pełny HTTPS URL backendu push.
3. Docelowy e-mail do `WEB_PUSH_VAPID_SUBJECT` (np. `mailto:admin@twoja-domena.pl`).

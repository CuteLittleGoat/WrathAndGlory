# Wyciek i neutralizacja `TRIGGER_TOKEN` — zapis archiwalny

- **Data:** 2026-09-02
- **Wykonawca zmian w repozytorium:** agent AI (Claude Code)
- **Zlecenie:** polecenie użytkownika wydane w rozmowie, po samodzielnym zdjęciu przez użytkownika lokalnej blokady `AGENTS.md` w tym folderze
- **Powód powstania dokumentu:** żądanie użytkownika, aby zachować archiwalną informację o tym, co dokładnie zostało zrobione

---

## 1. ⚠️ Stan na moment zapisu tego pliku

**Zmiany w repozytorium zostały wykonane. Rotacja tokenu po stronie Cloudflare — NIE.**

| Element | Stan |
| --- | --- |
| Usunięcie tokenu z plików repozytorium | ✅ Wykonane (opis w sekcji 4) |
| **Rotacja wartości sekretu w Cloudflare** | ❌ **DO WYKONANIA PRZEZ UŻYTKOWNIKA** (sekcja 5) |
| Usunięcie tokenu z historii gita | ❌ Niewykonane — decyzja użytkownika (sekcja 6) |

> **Najważniejsze zdanie tego dokumentu:** dopóki punkt drugi nie zostanie wykonany, **wyciek pozostaje aktywny**. Usunięcie tokenu z plików niczego nie naprawia — stara wartość jest nadal w historii gita, w kopiach, forkach i pamięciach podręcznych, i nadal działa w Cloudflare.

Agent AI **nie ma i nie powinien mieć** dostępu do konta Cloudflare użytkownika, dlatego rotacji nie mógł wykonać.

---

## 2. Na czym polegał problem

Plik `WebView_FCM_Cloudflare_Worker/TRIGGER_TOKEN` zawierał prawdziwy, działający token w postaci jawnej i był **śledzony przez gita w publicznym repozytorium `WrathAndGlory`**.

Z pliku `Archiwalne/Notatki.txt` wynika jednoznacznie, że nie była to wartość testowa ani atrapa:

- `TRIGGER_TOKEN` figuruje na liście sekretów Workera `wrathandglory-push-api`,
- chroni endpoint `POST /api/push/trigger`,
- kod Workera (`Archiwalne/kod-wrathandglory-push-api.txt`) porównuje go z nagłówkiem `Authorization: Bearer ...`.

### 2.1. Praktyczne konsekwencje

Dowolna osoba, która odczytała publiczne repozytorium, mogła wysyłać powiadomienia push do wszystkich zarejestrowanych subskrybentów aplikacji.

Skala szkody była ograniczona — w KV `PUSH_SUBSCRIPTIONS` zapisane były 2 subskrypcje, a projekt jest porzucony — ale **token pozostawał aktywny**.

### 2.2. Naruszona zasada

`AGENTS.md` §13 wymienia `TRIGGER_TOKEN` z nazwy jako przykład danych, których nie wolno zapisywać w repozytorium, i nakazuje użycie placeholdera.

---

## 3. Jak został wykryty

Wyciek znaleziono ubocznie, podczas przygotowywania instrukcji konfiguracji Cloudflare dla modułu `Audio`. Użytkownik poprosił o przeczytanie folderu `Archiwalne/`, żeby sprawdzić, czy z porzuconego projektu coś zostało na koncie Cloudflare.

Przy okazji lektury `Notatki.txt` okazało się, że nazwy sekretów z notatek pokrywają się z zawartością pliku `TRIGGER_TOKEN` leżącego piętro wyżej.

---

## 4. Co dokładnie zmieniono w repozytorium

### 4.1. Plik `WebView_FCM_Cloudflare_Worker/TRIGGER_TOKEN`

Lokalizacja: cała zawartość pliku (plik jednolinijkowy).

Stan przed zmianą:

```text
<32-znakowy token alfanumeryczny w postaci jawnej>
```

Metryki pliku przed zmianą, na potrzeby identyfikacji w historii:

- rozmiar: 33 bajty
- SHA-256: `a3b485de15738222416cd5db38e516290bb196a825890b8334053fdd87027cf5`

Stan po zmianie:

```text
TU_WSTAW_WLASNY_TOKEN
```

> Wartość tokenu celowo **nie jest przytoczona** w tym dokumencie. Zapisanie jej tutaj powtórzyłoby dokładnie ten sam błąd. Do identyfikacji służy powyższa suma kontrolna.

### 4.2. Plik `WebView_FCM_Cloudflare_Worker/Archiwalne/Projekt_Aplikacja.html`

Lokalizacja: linia 2757, przykład wywołania API w treści dokumentacji.

Stan przed zmianą:

```text
&quot;Authorization&quot;: &quot;Bearer <ten sam token w postaci jawnej>&quot;
```

Stan po zmianie:

```text
&quot;Authorization&quot;: &quot;Bearer TU_WSTAW_WLASNY_TOKEN&quot;
```

Było to jedyne wystąpienie tokenu w tym pliku.

### 4.3. Weryfikacja po zmianach

Przeszukano całe drzewo robocze repozytorium (z pominięciem katalogu `.git`) pod kątem starej wartości tokenu.

Wynik: **zero wystąpień**. Oba pliki wymienione powyżej były jedynymi miejscami.

### 4.4. Czego NIE zmieniono

| Plik / element | Dlaczego zostawiono |
| --- | --- |
| `google-services.json` | Zawiera androidowy klucz API Firebase. Ten klucz jest z założenia dystrybuowany wraz z aplikacją i chroniony nazwą pakietu oraz podpisem. **To nie jest wyciek.** |
| `Archiwalne/kod-wrathandglory-push-api.txt` | Odwołuje się wyłącznie do nazw zmiennych (`env.TRIGGER_TOKEN`). Nie zawiera żadnych wartości. |
| `Archiwalne/Notatki.txt` | Wymienia nazwy sekretów, ale żadnych wartości. Sprawdzono osobno. |
| Historia gita | Poza zakresem zmiany w plikach. Patrz sekcja 6. |

### 4.5. Kontrola pozostałych sekretów

Przy okazji sprawdzono całe repozytorium pod kątem innych wycieków wymienionych w `Notatki.txt`:

| Poszukiwana wartość | Wynik |
| --- | --- |
| Klucz prywatny konta serwisowego Firebase (`-----BEGIN PRIVATE KEY-----`) | **Brak.** Trafienia dotyczą wyłącznie nazw pól oraz kodu zdejmującego nagłówek PEM. |
| `VAPID_PRIVATE_KEY`, `VAPID_PUBLIC_KEY` | **Brak zapisanych wartości.** Wyłącznie nazwy zmiennych. |
| `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PROJECT_ID` | **Brak wartości** poza publicznym `project_id` w `google-services.json`. |

Wniosek: `TRIGGER_TOKEN` był **jedynym** rzeczywistym wyciekiem w tym folderze.

---

## 5. Co musi zrobić użytkownik — krok obowiązkowy

Zmiany opisane w sekcji 4 **nie unieważniają starego tokenu**. Nadal działa on w Cloudflare. Trzeba go wymienić ręcznie.

1. Wejdź na **https://dash.cloudflare.com** i zaloguj się.
2. Menu po lewej → **Compute & AI** → **Workers & Pages**.
3. Kliknij Workera **`wrathandglory-push-api`**.
4. Zakładka **Settings** → sekcja **Runtime variables and secrets**.
5. Odszukaj pozycję **`TRIGGER_TOKEN`** typu **Secret**.
6. Wpisz nową, losową wartość. Możesz ją wygenerować w konsoli przeglądarki (`F12` → **Console**):

   ```js
   btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(24))))
   ```

7. Zapisz i kliknij **Deploy**.
8. Jeżeli kiedykolwiek wrócisz do projektu powiadomień — wpisz nową wartość lokalnie, poza repozytorium.

### 5.1. Jak sprawdzić, że rotacja zadziałała

Wywołanie `POST /api/push/trigger` ze **starym** tokenem powinno zwrócić błąd autoryzacji. Endpoint `GET /api/push/health` działa bez tokenu i powinien odpowiadać jak wcześniej.

---

## 6. Sprawa historii gita — decyzja do podjęcia

Stary token pozostaje widoczny w historii repozytorium, w commicie:

```text
46d1e5e  2026-06-22  Usuń starą integrację Firebase wersji testowej
```

Możliwości:

| Opcja | Skutek | Ocena |
| --- | --- | --- |
| **Nic nie robić** *(zalecane)* | Token zostaje w historii, ale po rotacji z sekcji 5 jest bezwartościowy. | Wystarczające. Rotacja unieważnia wyciek skuteczniej niż czyszczenie historii. |
| Przepisać historię (`git filter-repo`) | Token znika z historii repozytorium. | Nie usuwa go z forków, klonów ani z pamięci podręcznych. Psuje wszystkie istniejące klony. Nieproporcjonalny nakład. |

**Rekomendacja: wykonać rotację z sekcji 5 i zostawić historię w spokoju.** Publiczny token, który już nie działa, nie jest zagrożeniem.

---

## 7. Wniosek na przyszłość

Sekrety nie trafiają do repozytorium — nawet do folderu opisanego jako archiwalny, nawet w projekcie porzuconym.

Właściwe miejsca:

- panel Cloudflare → **Settings** → **Runtime variables and secrets**, typ **Secret**,
- albo komenda `npx wrangler secret put NAZWA`.

W repozytorium zostaje wyłącznie placeholder, zgodnie z `AGENTS.md` §13:

```text
TRIGGER_TOKEN=TU_WSTAW_WLASNY_TOKEN
```

---

## 8. Dokumenty powiązane

- `Analizy/KonfiguracjaCloudflareAudio.md` — sekcja 4 opisuje ten sam problem z perspektywy konfiguracji nowej bramki audio
- `Analizy/UtajnienieAudio.md` — analiza utajnienia plików audio
- `WebView_FCM_Cloudflare_Worker/Archiwalne/Notatki.txt` — źródłowe podsumowanie konfiguracji Firebase i Cloudflare

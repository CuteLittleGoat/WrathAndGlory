# Prywatne audio na Cloudflare R2 + Worker (hasło + sesja)

## Cel
Chcę hostować pliki audio w Cloudflare R2 bez publicznego dostępu i udostępniać je tylko po **jednorazowym logowaniu hasłem**. Po poprawnym logowaniu użytkownik ma móc odtwarzać wiele plików **bez ponownego wpisywania hasła** przez określony czas (sesja).

## Skrót architektury
- **R2 (bucket: `audiorpg`)** – przechowuje pliki (prywatny bucket).
- **Cloudflare Worker (`audiorpg`)** – „bramka” autoryzacji i proxy do R2.
- **Sesja (cookie)** – po zalogowaniu użytkownik dostaje cookie i może odtwarzać pliki bez ponownego wpisywania hasła.

Adres Workera:
`https://audiorpg.tarczynski-pawel.workers.dev/`

Najważniejsze ścieżki:
- Logowanie: `/login`
- Pliki audio (proxy): `/a/<KLUCZ>`
- Wylogowanie: `/logout`

---

## A. Co już zostało zrobione (stan obecny)

### 1) Utworzony bucket R2
- **Bucket:** `audiorpg`
- Bucket jest prywatny (domyślne ustawienie R2).
- Do bucketa wrzucono testowy plik:
  - **Key:** `test/test.txt`

### 2) Utworzony Cloudflare Worker
- **Worker:** `audiorpg`
- **Adres:** `https://audiorpg.tarczynski-pawel.workers.dev/`

### 3) Podpięcie R2 do Workera (binding)
W ustawieniach Workera dodano R2 binding:
- **Variable name:** `AUDIO_BUCKET`
- **Bucket:** `audiorpg`

Dzięki temu kod Workera ma dostęp do R2 jako `env.AUDIO_BUCKET`.

### 4) Dodanie sekretów (Secrets)
W ustawieniach Workera dodano 2 sekrety:
- **`AUDIO_PASSWORD`** – hasło wpisywane przez użytkownika na `/login`.
- **`SESSION_SECRET`** – losowy klucz do podpisywania sesji (tokenów).

### 5) Wgranie kodu Workera
Kod Workera:
- udostępnia formularz logowania pod `/login`,
- po poprawnym haśle ustawia cookie sesyjne,
- serwuje pliki z R2 spod `/a/<klucz>`.

### 6) Test działania
Test przebiegł poprawnie:
- `/login` → formularz hasła,
- po logowaniu → przekierowanie,
- `/a/test/test.txt` → zwraca zawartość pliku.

Wniosek: **logowanie i sesja działają, a Worker poprawnie proxy’uje obiekty z R2.**

---

## B. Jak wygląda URL do pliku (ważne do AudioManifest.xlsx)
Pliki w R2 są identyfikowane przez **key** (ścieżkę), np.:
- `test/test.txt`
- `GrimdarkAudio/Ambience/intro.mp3`

Worker udostępnia je jako:
```
https://audiorpg.tarczynski-pawel.workers.dev/a/<KLUCZ>
```
Przykład:
- **key:** `test/test.txt`
- **URL:** `.../a/test/test.txt`

---

## C. Jak działa logowanie i ochrona
1. Użytkownik wchodzi na `/a/...`.
2. Jeśli **brak ważnej sesji** → przekierowanie na `/login`.
3. Użytkownik wpisuje hasło:
   - jeśli jest poprawne → Worker tworzy token sesji **ważny 24h**, zapisuje cookie `AUDSESS`, przekierowuje użytkownika na `/`.
4. Przez czas ważności cookie użytkownik może odtwarzać wszystkie pliki **bez ponownego hasła**.

---

## D. Wgrywanie właściwych plików audio
1. Wejdź w Cloudflare → R2 → bucket `audiorpg` → **Objects**.
2. Wgraj pliki w strukturze folderów, którą chcesz mieć w linkach.

**Klucze w R2 = ścieżki w URL.**

Przykład:
- R2 key: `audio/ambience/hall.mp3`
- URL: `https://audiorpg.tarczynski-pawel.workers.dev/a/audio/ambience/hall.mp3`

> Uwaga: „foldery” w R2 są logiczne (to część nazwy obiektu). Trzymaj spójną strukturę, żeby potem łatwo podmieniać base URL w manifestach.

---

## E. Jak sprawić, żeby aplikacja na GitHub Pages działała „jak chcesz”

### E1) Oczekiwane zachowanie
Aplikacja na GitHub Pages:
- wymusza logowanie **raz**,
- po zalogowaniu odtwarza audio normalnie,
- linki do audio są chronione hasłem.

### E2) Problem, który musisz znać (third‑party cookies)
Aplikacja działa na **innej domenie** (GitHub Pages), a audio na **workers.dev**.
To oznacza, że cookie sesji może być traktowane jako **third‑party cookie** i **blokowane** (szczególnie Safari i część ustawień Chrome/Edge).

Objawy:
- logowanie działa, ale audio z aplikacji **nie gra**,
- zamiast pliku widzisz przekierowanie na `/login`,
- w konsoli są komunikaty o blokowaniu cookies / CORS / przekierowaniach.

### E3) 3 warianty rozwiązania (wybierz jeden)

#### Wariant 1 — Najprostszy (czasem działa)
Dodaj w aplikacji przycisk:
**„Zaloguj do audio” → `.../login`**

Użytkownik:
1. loguje się w nowej karcie (first‑party dla workera),
2. wraca do aplikacji i odtwarza audio.

Jeśli wciąż nie działa → przejdź do wariantu 2 lub 3.

#### Wariant 2 — Pewny bez domeny (ale gorszy UX)
Odtwarzaj audio **bezpośrednio w domenie workera**:
- aplikacja otwiera nową kartę z `.../a/<key>`
- sesja jest first‑party → działa pewnie

Minus: odtwarzanie odbywa się poza aplikacją (osobna karta).

#### Wariant 3 — Docelowy (najlepszy UX)
Użyj **własnej domeny**:
- `app.twojadomena.pl` → aplikacja
- `audio.twojadomena.pl` → worker

Wtedy cookies i sesje działają pewniej.
Możesz też użyć Cloudflare Access zamiast własnego hasła.

---

## F. Wymagania techniczne dla `<audio>`
Jeśli aplikacja używa `<audio src="...">`, to:
- Worker musi zwracać poprawne nagłówki (robi to),
- **Range requests** muszą działać (kod je obsługuje),
- przeglądarka musi mieć dostęp do cookie sesji (kluczowy problem przy GitHub Pages).

---

## G. Checklist testowy
1. Otwórz w incognito:
   - `https://audiorpg.tarczynski-pawel.workers.dev/login`
2. Zaloguj się.
3. W tej samej karcie otwórz:
   - `https://audiorpg.tarczynski-pawel.workers.dev/a/test/test.txt`
4. Przejdź do aplikacji na GitHub Pages i spróbuj odtworzyć plik audio.
5. Jeśli nie działa – przeglądarka blokuje cookie → wybierz wariant 2 lub 3.

---

## H. Najważniejsze praktyczne zalecenie na teraz
Dodaj w aplikacji widoczny przycisk:
**„Zaloguj do audio” → `/login`**

Najpierw loguj się w workerze, **dopiero potem odtwarzaj dźwięki**.
Jeśli na części urządzeń nadal nie działa:
- odtwarzaj audio bezpośrednio z `workers.dev` (wariant 2) albo
- przejdź na własną domenę (wariant 3).

---

## Dane techniczne (Twoje konkretne)
- **R2 bucket:** `audiorpg`
- **Worker:** `audiorpg`
- **Worker URL:** `https://audiorpg.tarczynski-pawel.workers.dev/`
- **Logowanie:** `/login`
- **Pliki (proxy):** `/a/<key>`
- **Wylogowanie:** `/logout`

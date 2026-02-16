# Analiza konfiguracji Firestore — Infoczytnik (brak odczytu z zewnętrznych źródeł)

## Prompt użytkownika
"Załączam screeny mojej konfiguracji Firestore.\nSprawdź czy po zmianie logiki w Infoczytniku (brak odczytu z zewnętrznych źródeł) konfiguracja jest poprawna."

## Wnioski

Na podstawie przesłanych screenów i aktualnej logiki `Infoczytnik_test.html`:

1. **Struktura Firestore jest poprawna funkcjonalnie**
   - Kolekcja `dataslate` i dokument `current` są zgodne z kodem (to jedyne miejsce odczytu po stronie Infoczytnika).

2. **Dokument `dataslate/config` nie jest używany przez aktualny runtime Infoczytnika**
   - Obecnie kod słucha tylko `dataslate/current`, więc pola `audio.defaults.messageUrl` i `audio.defaults.pingUrl` w `config` nie wpływają na odtwarzanie.

3. **Zmiana „brak odczytu z zewnętrznych źródeł” działa po stronie Infoczytnika**
   - Dla `ping` i `message` URL audio przechodzą walidację lokalności.
   - Akceptowane są tylko ścieżki `assets/audio/...` (relatywne) albo URL z tym samym `origin` wskazujący na `assets/audio/...`.
   - URL zewnętrzny (np. Google Drive) jest odrzucany i zastępowany lokalnym fallbackiem.

4. **Twoje zewnętrzne URL-e na screenie (`drive.google.com`) są niezgodne z nową logiką**
   - Nie zepsują działania (zostaną zignorowane), ale są mylące konfiguracyjnie.
   - Rekomendacja: wyczyścić je albo zastąpić lokalnymi ścieżkami `assets/audio/...`.

## Rekomendowana minimalna konfiguracja

W praktyce wystarczy utrzymać poprawny dokument `dataslate/current` (co już masz).

Przykładowo:
- `type`: `message` / `ping` / `clear`
- `faction`, `text`, `color`/`fontColor`, `msgFontSize`, `prefixColor`, `suffixColor`, `prefixFontSize`, `suffixFontSize`, `showLogo`, `flicker`, `nonce`, `ts`
- opcjonalnie `pingUrl`, `msgUrl`/`messageUrl` **tylko lokalne** (`assets/audio/...`)

## Ograniczenia tej analizy

- Na screenach nie ma reguł Firestore, więc nie da się potwierdzić polityki bezpieczeństwa (`read/write`) — oceniona została wyłącznie zgodność struktury danych i pól z logiką aplikacji.

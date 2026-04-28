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

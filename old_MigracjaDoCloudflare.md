# Migracja do Cloudflare (plan darmowy) – analiza, ryzyka i plan działań

## Założenia
Poniższa analiza zakłada migrację publicznie dostępnej strony głównej repozytorium „WrathAndGlory” oraz powiązanych modułów do infrastruktury Cloudflare w planie **Free**. Uwzględnia działanie w roli DNS/proxy/CDN oraz możliwość hostingu statycznego (Cloudflare Pages), ale bez funkcji płatnych takich jak WAF Advanced, Load Balancing, Workers o podwyższonych limitach czy R2/Images.

---

## 1. Korzyści z migracji do Cloudflare (plan darmowy)

### 1.1. Wydajność i dostępność
- **CDN globalny** – statyczne zasoby (HTML/CSS/JS, obrazy) są cachowane na brzegu sieci, co poprawia czas ładowania.
- **HTTP/2 i HTTP/3 (QUIC)** – nowsze protokoły przyspieszają połączenia i redukują opóźnienia.
- **Cache statyczny** – darmowy cache na poziomie brzegowym dla zasobów statycznych.

### 1.2. Bezpieczeństwo
- **Ukrycie IP origin** (przez proxy DNS) – bezpośrednie IP serwera źródłowego może zostać ukryte.
- **Podstawowa ochrona DDoS** – w ramach planu Free jest dostępna podstawowa ochrona na poziomie sieci i aplikacji.
- **TLS/SSL** – darmowe certyfikaty i automatyczne odnawianie.

### 1.3. Operacyjność
- **Automatyzacja i centralne zarządzanie DNS** – prostsza konfiguracja DNS w jednym panelu.
- **Szybkie wdrożenie Pages** – prosta publikacja statycznych zasobów bez własnego serwera.
- **Analytics** – podstawowe statystyki ruchu.

---

## 2. Zagrożenia i ryzyka

### 2.1. Ryzyka techniczne
- **Błędna konfiguracja DNS/SSL** może spowodować przestój i nieprawidłowe działanie strony.
- **Nadmierne cachowanie** może powodować wyświetlanie nieaktualnych plików po wdrożeniu.
- **Ograniczenia planu Free** – brak części funkcji, które mogą być potrzebne w przyszłości.
- **Vendor lock‑in** – uzależnienie od dostawcy w warstwie DNS i ruchu.

### 2.2. Ryzyka operacyjne
- **Brak doświadczonego personelu** – błędy przy konfiguracji reguł, Page Rules/Cache Rules.
- **Złożoność integracji** z istniejącą infrastrukturą (np. dodatkowe subdomeny, zewnętrzne hosty).

### 2.3. Ryzyka prawne i zgodności
- **Transfer danych** poza UE (w zależności od lokalizacji PoP) – wymaga sprawdzenia polityk.
- **Cookies/analytics** – potrzeba zgodności z RODO przy użyciu CF Analytics.

---

## 3. Pełna lista rzeczy do przygotowania

### 3.1. Informacje techniczne
- Lista domen i subdomen do migracji.
- Aktualne rekordy DNS (A/AAAA/CNAME/TXT/MX/SRV).
- Informacja o origin (serwer hostingowy, IP, hosty, ścieżki).
- Wykaz aplikacji/modułów: Main, Audio, DataVault, DiceRoller, GeneratorNPC, Infoczytnik, Kalkulator.
- Wskazanie współdzielonych zasobów między modułami (np. wspólny plik `data.json` używany przez DataVault i GeneratorNPC) oraz ich docelowych ścieżek na hostingu.

### 3.2. Wymagania funkcjonalne
- Czy aplikacje są statyczne czy mają elementy dynamiczne.
- Czy wymagane są dodatkowe pliki uploadu (np. w Infoczytniku – layouty, dźwięki).
- Oczekiwany czas odświeżania cache (TTL).

### 3.3. Dostępy i konta
- Dostęp do panelu DNS u obecnego rejestratora.
- Konto Cloudflare (z odpowiednimi uprawnieniami).
- Uprawnienia do repozytorium i deployu (np. GitHub/GitLab).

### 3.4. Plan awaryjny
- Backup strefy DNS.
- Plan rollbacku (przywrócenie dawnych NS).

---

## 4. Pełna lista kroków migracji

### 4.1. Wariant samodzielny (manualny)
1. **Założenie konta Cloudflare** i dodanie domeny.
2. **Import rekordów DNS** – weryfikacja poprawności.
3. **Włączenie proxy** dla rekordów, które mają być cachowane.
4. **Konfiguracja SSL/TLS**:
   - Ustawienie trybu (najczęściej „Full” lub „Full (strict)”).
   - Weryfikacja certyfikatów na origin.
5. **Ustawienie reguł cache** (Cache Rules/Page Rules) dla statycznych zasobów.
6. **Testy działania** poprzez lokalny override DNS (hosts/resolve).
7. **Zmiana nameserverów** u rejestratora na Cloudflare.
8. **Monitoring** po zmianie NS – weryfikacja dostępności i cache.

### 4.2. Wariant z wykorzystaniem AI
1. **Analiza obecnych rekordów DNS** przez AI i przygotowanie checklisty.
2. **Weryfikacja konfiguracji SSL** (rekomendowany tryb i poprawność certyfikatów).
3. **Generowanie reguł cache** przez AI na podstawie struktury repo.
4. **Checklisty testowe** wygenerowane przez AI (np. testy dostępności plików statycznych).
5. **Monitorowanie logów i błędów** – AI weryfikuje problemy po migracji.

---

## 5. Ograniczenia Cloudflare Free
- Brak zaawansowanego WAF (tylko podstawowe reguły).
- Brak Image Optimization, Argo Smart Routing, Load Balancing.
- Ograniczone Workers (mniejsze limity czasu i zasobów).
- Brak dedykowanego wsparcia SLA.
- Ograniczone narzędzia analityczne.
- Brak logów HTTP w pełnym zakresie (część dostępna w Enterprise).

---

## 6. Jak wyglądałyby aktualizacje aplikacji po migracji

### 6.1. Aktualizacja aplikacji (ogólnie)
1. **Zmiana plików w repozytorium**.
2. **Deploy do origin lub do Cloudflare Pages**.
3. **Wymuszenie odświeżenia cache** (Purge Cache) – kluczowe dla nowych wersji.
4. **Weryfikacja** czy CDN podaje nowe pliki.

Ryzyko: brak purge cache = użytkownicy mogą widzieć starą wersję aplikacji.

---

## 7. Aktualizacja pliku „Repozytorium” po migracji

### Scenariusz
Jeżeli plik „Repozytorium” jest głównym entry point (np. `index.html` w katalogu głównym):
1. **Deploy nowej wersji** pliku do origin lub Pages.
2. **Purge Cache** dla tego pliku (lub całej domeny).
3. **Weryfikacja**, że nowy plik jest serwowany przez CDN.

Ryzyko: jeśli plik jest cachowany bez odpowiednich nagłówków, użytkownik zobaczy starą wersję.

---

## 8. Aktualizacja modułu „Infoczytnik” (dodawanie layoutów, dźwięków, plików)

### Scenariusz
W Infoczytniku dochodzą nowe pliki (layouty, dźwięki, obrazy):
1. **Dodanie nowych plików do repozytorium**.
2. **Deploy** (Pages lub origin).
3. **Purge Cache** dla nowej ścieżki katalogów (np. `/Infoczytnik/layouts/*`, `/Infoczytnik/sounds/*`).
4. **Sprawdzenie w przeglądarce**, czy nowe pliki są dostępne i nie blokowane przez reguły cache.

### Uwagi praktyczne
- Przy dużych plikach audio warto rozważyć nagłówki cache `Cache-Control: public, max-age=...`.
- Jeśli layouty są dynamiczne (np. JSON), warto krótszy TTL.

---

## 9. Aktualizacja współdzielonych zasobów (np. `data.json`)

### Scenariusz
Wspólny plik danych używany przez więcej niż jeden moduł (np. DataVault i GeneratorNPC) został zaktualizowany:
1. **Zaktualizowanie pliku w repozytorium** w jednej, stałej lokalizacji.
2. **Deploy** (Pages lub origin).
3. **Purge Cache** dla konkretnej ścieżki pliku (np. `/shared/data.json` lub innej faktycznej lokalizacji).
4. **Testy regresji** w każdym module, który używa współdzielonego zasobu.

Ryzyko: brak purge cache lub rozjazd ścieżek może powodować, że jeden moduł widzi nową wersję pliku, a inny starą.

---

## 10. Rekomendacje końcowe
- **Dla statycznych modułów** Cloudflare Free jest wystarczające.
- Dla rozbudowanej ochrony (WAF, logi, SLA) konieczny jest plan płatny.
- Kluczowa jest **procedura purge cache** po każdym wdrożeniu.

---

## 11. Checklisty operacyjne

### Przed migracją
- [ ] Backup DNS
- [ ] Lista subdomen
- [ ] Weryfikacja SSL
- [ ] Testy lokalne

### Po migracji
- [ ] Weryfikacja cache
- [ ] Weryfikacja SSL
- [ ] Testy wszystkich modułów
- [ ] Monitoring błędów

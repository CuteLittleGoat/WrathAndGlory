# Analiza modułu DataVault — aktualizacja danych w tabelach (2026-04-10)

## Prompt użytkownika
> Przeprowadź analizę modułu DataVault. Jak się odbywa aktualizacja danych w tabelach? Aplikacja automatycznie zaciąga dane z data.json czy po podmianie data.json należy jeszcze wykonać jakieś kroki?

## Krótka odpowiedź
- **Tak, aplikacja automatycznie ładuje `data.json` przy starcie** (w `boot()` wywoływane jest `loadJsonFromRepo()`).
- **Po podmianie `data.json` nie trzeba wykonywać dodatkowych kroków w samej aplikacji** poza odświeżeniem strony / ponownym wejściem do modułu.
- W kodzie użyto `fetch("data.json", { cache: "no-store" })`, więc frontend próbuje pobrać najświeższą wersję pliku.

## Jak działa aktualizacja danych (krok po kroku)

### 1) Standardowy tryb odczytu (użytkownik/gracz)
1. Aplikacja uruchamia się i wykonuje `boot()`.
2. `boot()` zawsze wywołuje `loadJsonFromRepo()`.
3. `loadJsonFromRepo()` pobiera `data.json` przez `fetch` i zasila nim obiekt `DB`.
4. Na bazie `DB` budowane są zakładki i renderowane tabele.

W praktyce oznacza to, że **tabele są odzwierciedleniem aktualnej zawartości `data.json`**.

### 2) Tryb administratora (`?admin=1`) i przycisk „Aktualizuj dane”
- Przycisk „Aktualizuj dane” uruchamia `loadXlsxFromRepo()`.
- Funkcja pobiera `Repozytorium.xlsx`, konwertuje go do struktury JSON i:
  1) od razu podmienia dane w bieżącej sesji (`DB = normaliseDB(data); initUI();`),
  2) oraz wymusza pobranie wygenerowanego pliku `data.json` lokalnie (download do przeglądarki).

To oznacza, że po kliknięciu „Aktualizuj dane” **publikacja nowego `data.json` na serwerze/GitHub Pages nadal jest osobnym krokiem operacyjnym** (trzeba podmienić plik w repozytorium/hostingu).

## Czy po podmianie `data.json` trzeba zrobić dodatkowe kroki?

### Jeśli pytanie dotyczy działania aplikacji
- **Nie** — po podmianie pliku i odświeżeniu widoku aplikacja ładuje nową zawartość automatycznie.

### Jeśli pytanie dotyczy procesu publikacji
- **Tak, organizacyjnie trzeba dopilnować wdrożenia pliku** (np. commit/push/deploy), aby nowy `data.json` był dostępny pod właściwym adresem modułu DataVault.
- Sama aplikacja nie „wypycha” pliku na serwer; ona go tylko pobiera i czyta.

## Wnioski końcowe
1. DataVault działa w modelu: **frontend-consumer `data.json`**.
2. Aktualizacja tabel następuje automatycznie po ponownym pobraniu `data.json` przy starcie aplikacji.
3. Po ręcznej podmianie `data.json` nie ma potrzeby dodatkowej akcji w UI poza odświeżeniem strony.
4. Przycisk „Aktualizuj dane” pomaga wygenerować nowe dane z XLSX, ale nie zastępuje kroku publikacji pliku na hostingu.

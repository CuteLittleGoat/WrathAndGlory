# Dokumentacja

## Przegląd projektu
Projekt to pojedyncza strona HTML działająca jako statyczny „hub” z odnośnikami do zewnętrznych narzędzi Wrath & Glory. Nie ma tu JavaScriptu, backendu ani dodatkowych zależności — całość to HTML + CSS.

## Struktura plików
- `index.html` – jedyny plik aplikacji zawierający strukturę strony i pełną stylizację wbudowaną w `<style>`.
- `wrath-glory-logo-warhammer.png` – logo wyświetlane w nagłówku strony.
- `docs/README.md` – instrukcja użytkownika i informacji o aktualizacji aplikacji.
- `docs/Documentation.md` – niniejszy dokument z opisem kodu.

## Szczegółowy opis `index.html`

### 1. Deklaracje dokumentu i nagłówek
- `<!DOCTYPE html>` – deklaruje HTML5.
- `<html lang="pl">` – język dokumentu ustawiony na polski.
- `<meta charset="UTF-8">` – kodowanie znaków UTF‑8.
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` – poprawne skalowanie na urządzeniach mobilnych.
- `<title>Kozi przybornik</title>` – tytuł karty przeglądarki.

### 2. Stylizacja (sekcja `<style>`)
Cała stylizacja jest osadzona w `index.html` i nie korzysta z zewnętrznych plików CSS.

#### 2.1 Zmienne CSS (`:root`)
Zmienne definiują motyw „zielonego terminala”:
- `--bg` – wielowarstwowe tło (gradienty radialne + kolor bazowy `#031605`).
- `--panel` – kolor tła panelu głównego (`#000`).
- `--border` – kolor ramki panelu i przycisków (`#16c60c`).
- `--text` – kolor tekstu (`#9cf09c`).
- `--accent`, `--accent-dark` – barwy akcentu wykorzystywane w efektach.
- `--glow` – cień panelu (zielona poświata).
- `--radius` – zaokrąglenie rogów panelu.

#### 2.2 Styl ogólny (`*`)
- Ustawia `box-sizing: border-box` dla przewidywalnych rozmiarów.
- Wymusza krój pisma monospace (`Consolas`, `Fira Code`, `Source Code Pro`).

#### 2.3 Układ strony (`body`, `main`)
- `body` – pełna wysokość widoku, wycentrowanie zawartości w pionie i poziomie, tło z `--bg`, marginesy wyzerowane.
- `main` – centralny panel:
  - maksymalna szerokość `min(860px, 100%)`,
  - czarne tło (`--panel`), zielona ramka (`--border`), poświata (`--glow`),
  - elastyczny układ kolumny z odstępami (`gap: 22px`).

#### 2.4 Logo (`.logo`)
- Skaluje obraz w zakresie `220px–320px` z zachowaniem proporcji (`max-width` + `width: 100%`).

#### 2.5 Sekcja akcji (`.actions`, `.stack`, `.stack.right`)
- `.actions` – siatka przycisków z automatycznym dopasowaniem liczby kolumn (`grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`).
- `.stack` – pionowe ułożenie elementów (przycisk + notka).
- `.stack.right` – rozszerza elementy na pełną szerokość w kolumnie.

#### 2.6 Przyciski (`.btn`)
- Stylizowane linki `<a>` jako przyciski:
  - obramowanie i tło w odcieniach zieleni,
  - `text-decoration: none` oraz `font-weight: 600` dla czytelności,
  - efekty `:hover` (lekka animacja w górę, poświata, jaśniejsze tło) i `:active`.

#### 2.7 Notatka pod Repozytorium (`.note`)
- Mały tekst pomocniczy z instrukcją dodania parametru `index.html?admin=1`.
- Ustawione `font-size: 13px`, `line-height: 1.35` i `word-break: break-word` dla poprawnego łamania.

### 3. Zawartość (`<body>`)
Struktura dokumentu składa się z:
- `<main>` – główny panel.
- `<img class="logo">` – logo z atrybutem `alt="Logo Wrath & Glory"`.
- `<div class="actions">` – sekcja przycisków:
  1. **Repozytorium** – link do `https://cutelittlegoat.github.io/Repozytorium/` z notką o parametrze admina.
  2. **Infoczytnik** – link do `https://cutelittlegoat.github.io/wh40k-data-slate/Infoczytnik.html`.
  3. **Kalkulator** – link do `https://cutelittlegoat.github.io/Kalkulator/index.html`.

Każdy przycisk otwiera się w nowej karcie (`target="_blank"`) z zabezpieczeniem `rel="noopener noreferrer"`.

## Aktualizacja treści
- **Zmiana adresów URL**: edytuj atrybuty `href` w przyciskach `<a class="btn">` w `index.html`.
- **Zmiana instrukcji admina**: zaktualizuj treść akapitu `.note` pod przyciskiem Repozytorium.
- **Zmiana stylu**: edytuj sekcję `<style>` w `index.html`.
- **Zmiana logo**: podmień plik `wrath-glory-logo-warhammer.png` i pozostaw tę samą nazwę, jeśli nie chcesz edytować HTML.

## Uruchamianie lokalne
Strona jest statyczna i działa bez serwera, ale dla testów można uruchomić lokalny serwer:

```bash
python -m http.server 8000
```

Następnie otwórz `http://localhost:8000/index.html`.

# Dokumentacja modułu Audio

## Przegląd
Moduł **Audio** to statyczna strona HTML pełniąca rolę placeholdera. Wyświetla komunikat „Strona w budowie” oraz krótką informację, że moduł jest w przygotowaniu. Styl graficzny jest identyczny z główną stroną projektu (zielony „terminalowy” motyw). Brak JavaScriptu oraz backendu.

## Struktura plików
- `Audio/index.html` – pojedynczy plik HTML z osadzonym CSS i treścią komunikatu.
- `Audio/docs/README.md` – instrukcja użytkownika (PL/EN).
- `Audio/docs/Documentation.md` – niniejszy opis kodu.

## Szczegółowy opis `Audio/index.html`

### 1. Deklaracje dokumentu i `<head>`
- `<!DOCTYPE html>` – deklaracja HTML5.
- `<html lang="pl">` – język dokumentu ustawiony na polski.
- `<meta charset="UTF-8">` – kodowanie UTF‑8.
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` – poprawne skalowanie na urządzeniach mobilnych.
- `<title>Audio | Kozi przybornik</title>` – tytuł karty przeglądarki.

### 2. Stylizacja (sekcja `<style>`)
Cały CSS jest wbudowany w dokument. Styl został skopiowany z głównej dokumentacji projektu, aby zachować spójny wygląd.

#### 2.1 Zmienne CSS (`:root`)
Motyw „zielonego terminala” opisany jest przez zestaw zmiennych:
- `--bg` – tło składające się z trzech warstw:
  1. `radial-gradient(circle at 20% 20%, rgba(0, 255, 128, 0.06), transparent 25%)`
  2. `radial-gradient(circle at 80% 0%, rgba(0, 255, 128, 0.08), transparent 35%)`
  3. kolor bazowy `#031605`
- `--panel` – kolor tła panelu: `#000`.
- `--border` – kolor ramki panelu: `#16c60c`.
- `--text` – kolor tekstu: `#9cf09c`.
- `--accent` – akcent zielony: `#16c60c`.
- `--accent-dark` – ciemniejszy akcent: `#0d7a07`.
- `--glow` – poświata panelu: `0 0 25px rgba(22, 198, 12, 0.45)`.
- `--radius` – zaokrąglenie panelu: `10px`.

#### 2.2 Ustawienia globalne (`*`)
- `box-sizing: border-box` – padding i border są wliczane w szerokość/ wysokość.
- `font-family` – wymuszone fonty monospace w kolejności: "Consolas", "Fira Code", "Source Code Pro", `monospace`.

#### 2.3 Układ strony (`body`, `main`)
- `body`
  - `margin: 0` – usuwa domyślny margines.
  - `min-height: 100vh` – pełna wysokość okna.
  - `display: flex`, `align-items: center`, `justify-content: center` – centrowanie panelu.
  - `padding: 24px` – margines od krawędzi okna.
  - `background: var(--bg)` – gradientowe tło.
  - `color: var(--text)` – domyślny kolor tekstu.
- `main`
  - `width: min(860px, 100%)` – maksymalnie 860px, zawsze dopasowane do ekranu.
  - `background: var(--panel)` – czarne tło panelu.
  - `border: 2px solid var(--border)` – zielona ramka.
  - `border-radius: var(--radius)` – zaokrąglenie rogów.
  - `box-shadow: var(--glow)` – zielona poświata.
  - `padding: 32px 32px 28px` – odstępy wewnętrzne.
  - `display: flex`, `flex-direction: column`, `align-items: center`, `gap: 22px` – pionowy układ treści.

#### 2.4 Typografia nagłówka i podtytułu
- `.title`
  - `margin: 0` – brak marginesów.
  - `font-size: clamp(22px, 3vw, 28px)` – płynny rozmiar zależny od szerokości okna.
  - `text-transform: uppercase` – tekst wielkimi literami.
  - `letter-spacing: 0.08em` – rozstrzelenie liter.
- `.subtitle`
  - `margin: 0` – brak marginesów.
  - `font-size: 15px` – stały rozmiar tekstu.
  - `color: var(--text)` – kolor zgodny z motywem.
  - `opacity: 0.9` – lekkie przygaszenie dla hierarchii wizualnej.

### 3. Zawartość (`<body>`)
Struktura dokumentu jest minimalna i składa się z jednego panelu:
- `<main>` – główny panel z zieloną ramką.
- `<h1 class="title">` – tekst „Strona w budowie”.
- `<p class="subtitle">` – komunikat „Moduł Audio jest w przygotowaniu.”

## Modyfikacje
- **Zmiana treści komunikatu**: edytuj teksty w `<h1 class="title">` i `<p class="subtitle">`.
- **Zmiana stylu**: edytuj wartości w sekcji `<style>` zgodnie z opisem powyżej.

## Uruchamianie lokalne
Strona jest statyczna. Możesz ją otworzyć bez serwera lub uruchomić lokalny serwer:

```bash
python -m http.server 8000
```

Następnie otwórz `http://localhost:8000/Audio/index.html`.

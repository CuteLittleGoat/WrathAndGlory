# Wrath & Glory / Kozi przybornik

Statyczna strona startowa (landing page) z linkami do narzędzi wspierających rozgrywki Wrath & Glory. Po uruchomieniu wyświetla logo oraz cztery przyciski prowadzące do zewnętrznych aplikacji.

---

## Instrukcja obsługi (PL)

### Dostępne narzędzia
- **Generator NPC**: https://cutelittlegoat.github.io/GeneratorNPC/index.html
- **Repozytorium**: https://cutelittlegoat.github.io/Repozytorium/
  - Aby wejść do panelu admina, dopisz parametr `index.html?admin=1` do adresu.
- **Infoczytnik**: https://cutelittlegoat.github.io/wh40k-data-slate/Infoczytnik.html
- **Kalkulator**: https://cutelittlegoat.github.io/Kalkulator/index.html

### Jak używać
1. Otwórz stronę startową w przeglądarce.
2. Kliknij jeden z przycisków, aby przejść do wybranego narzędzia.
3. Jeśli potrzebujesz panelu admina w Repozytorium, dopisz `index.html?admin=1` do adresu Repozytorium.

### Uruchamianie lokalne
To jest strona statyczna bez backendu. Możesz:
- po prostu otworzyć `index.html` w przeglądarce, albo
- uruchomić prosty serwer lokalny, np.:

```bash
python -m http.server 8000
```

Następnie przejdź do `http://localhost:8000/index.html`.

### Aktualizacja aplikacji
Aktualizacja polega na podmianie plików statycznych w miejscu hostingu (np. GitHub Pages):
1. Zaktualizuj treść w `index.html` (np. adresy URL przycisków, teksty).
2. Jeśli zmieniasz logo, podmień plik `wrath-glory-logo-warhammer.png`.
3. Wdróż zmiany w swoim hostingu (np. push do repozytorium obsługującego GitHub Pages).

### Pliki projektu
- `index.html` – główny plik strony z treścią i osadzonymi stylami.
- `wrath-glory-logo-warhammer.png` – logo wyświetlane na stronie.

### Disclaimer
To narzędzie jest nieoficjalnym, fanowskim projektem stworzonym jako pomoc dla MG w systemie Wrath & Glory. Aplikacja jest udostępniana za darmo wyłącznie do prywatnego, niekomercyjnego użytku. Projekt nie jest licencjonowany, nie jest powiązany ani wspierany przez Games Workshop, Cubicle 7 Entertainment Ltd. ani Copernicus Corporation.
Warhammer 40,000 oraz powiązane nazwy i znaki towarowe są własnością Games Workshop Limited; Wrath & Glory jest własnością odpowiednich właścicieli praw.

---

## User guide (EN)

### Available tools
- **NPC Generator**: https://cutelittlegoat.github.io/GeneratorNPC/index.html
- **Repository**: https://cutelittlegoat.github.io/Repozytorium/
  - To access the admin panel, append `index.html?admin=1` to the URL.
- **Infoczytnik**: https://cutelittlegoat.github.io/wh40k-data-slate/Infoczytnik.html
- **Calculator**: https://cutelittlegoat.github.io/Kalkulator/index.html

### How to use
1. Open the landing page in your browser.
2. Click one of the buttons to open the selected tool.
3. If you need the Repository admin panel, append `index.html?admin=1` to the Repository address.

### Running locally
This is a static page with no backend. You can:
- open `index.html` directly in your browser, or
- run a simple local server, e.g.:

```bash
python -m http.server 8000
```

Then go to `http://localhost:8000/index.html`.

### Updating the app
Updating consists of replacing static files in your hosting (e.g. GitHub Pages):
1. Update content in `index.html` (e.g. button URLs, text).
2. If you change the logo, replace `wrath-glory-logo-warhammer.png`.
3. Deploy the changes to your hosting (e.g. push to the repo serving GitHub Pages).

### Project files
- `index.html` – main page file with content and embedded styles.
- `wrath-glory-logo-warhammer.png` – logo displayed on the page.

### Disclaimer
This tool is an unofficial, fan-made project created to support Wrath & Glory game masters. It is provided free of charge for private, non-commercial use only. The project is not licensed, affiliated with, or endorsed by Games Workshop, Cubicle 7 Entertainment Ltd., or Copernicus Corporation.
Warhammer 40,000 and related names and trademarks are the property of Games Workshop Limited; Wrath & Glory is owned by its respective rights holders.

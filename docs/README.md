# Wrath & Glory / Kozi przybornik

Statyczna strona startowa (landing page) z linkami do narzędzi wspierających rozgrywki Wrath & Glory. Po uruchomieniu wyświetla logo oraz trzy przyciski prowadzące do zewnętrznych aplikacji.

## Dostępne narzędzia
- **Repozytorium**: https://cutelittlegoat.github.io/Repozytorium/
  - Aby wejść do panelu admina, dopisz parametr `index.html?admin=1` do adresu.
- **Infoczytnik**: https://cutelittlegoat.github.io/wh40k-data-slate/Infoczytnik.html
- **Kalkulator**: https://cutelittlegoat.github.io/Kalkulator/index.html

## Jak używać
1. Otwórz stronę startową w przeglądarce.
2. Kliknij jeden z przycisków, aby przejść do wybranego narzędzia.
3. Jeśli potrzebujesz panelu admina w Repozytorium, dopisz `index.html?admin=1` do adresu Repozytorium.

## Uruchamianie lokalne
To jest strona statyczna bez backendu. Możesz:
- po prostu otworzyć `index.html` w przeglądarce, albo
- uruchomić prosty serwer lokalny, np.:

```bash
python -m http.server 8000
```

Następnie przejdź do `http://localhost:8000/index.html`.

## Aktualizacja aplikacji
Aktualizacja polega na podmianie plików statycznych w miejscu hostingu (np. GitHub Pages):
1. Zaktualizuj treść w `index.html` (np. adresy URL przycisków, teksty).
2. Jeśli zmieniasz logo, podmień plik `wrath-glory-logo-warhammer.png`.
3. Wdróż zmiany w swoim hostingu (np. push do repozytorium obsługującego GitHub Pages).

## Pliki projektu
- `index.html` – główny plik strony z treścią i osadzonymi stylami.
- `wrath-glory-logo-warhammer.png` – logo wyświetlane na stronie.

## Disclaimer
To narzędzie jest nieoficjalnym, fanowskim projektem stworzonym jako pomoc dla MG w systemie Wrath & Glory. Aplikacja jest udostępniana za darmo wyłącznie do prywatnego, niekomercyjnego użytku. Projekt nie jest licencjonowany, nie jest powiązany ani wspierany przez Games Workshop, Cubicle 7 Entertainment Ltd. ani Copernicus Corporation.
Warhammer 40,000 oraz powiązane nazwy i znaki towarowe są własnością Games Workshop Limited; Wrath & Glory jest własnością odpowiednich właścicieli praw.

# Dokumentacja

## Struktura projektu
- `index.html` – główny plik strony z trzema odnośnikami: Repozytorium, Infoczytnik oraz Kalkulator. Sekcja notatek pod linkiem Repozytorium opisuje jak wejść do panelu admina (`index.html?admin=1`).
- `wrath-glory-logo-warhammer.png` – logo wyświetlane na stronie.

## Edycja i rozwój
- Do modyfikacji treści lub stylów edytuj `index.html`. Cała stylizacja (motyw zielonego terminala) jest zawarta w sekcji `<style>` w nagłówku dokumentu.
- Linki z przycisków prowadzą do zewnętrznych narzędzi hostowanych w domenie `cutelittlegoat.github.io`. Aktualne adresy są wpisane bezpośrednio w elementach `<a>`.
- Jeśli zmienisz któryś z adresów, upewnij się, że treść sekcji z instrukcją logowania do panelu admina pozostaje spójna z właściwą ścieżką.

## Uruchamianie lokalne
Jest to strona statyczna bez zależności backendowych. Do podglądu wystarczy otworzyć `index.html` w przeglądarce lub uruchomić prosty serwer, np.:

```bash
python -m http.server 8000
```

Po uruchomieniu wejdź na `http://localhost:8000/index.html`.

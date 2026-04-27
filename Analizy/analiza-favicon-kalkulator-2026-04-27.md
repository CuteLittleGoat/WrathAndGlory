# Analiza błędu konsoli Firefox dla `Kalkulator/index.html`

## Prompt użytkownika
> Sprawdź czemu jak wchodzę na stronę Kalkulator/index.html to konsola firefox zwraca mi błąd jak na załączniku
>
> Przeczytaj i zaktualizuj analizę Analizy/analiza-favicon-kalkulator-2026-04-27.md
>
> Do czego miałby służyć favicon.ico?

## Obserwacja
Na zrzucie widoczny jest błąd:
- `GET https://cutelittlegoat.github.io/favicon.ico` zakończony statusem `404`.

## Wniosek
To nie jest błąd logiki modułu Kalkulator, tylko brak pliku favicon pod domyślnym adresem domeny (`/favicon.ico`).

Firefox (jak i inne przeglądarki) automatycznie próbuje pobrać ikonę strony z `https://<domena>/favicon.ico`, nawet gdy w HTML nie ma jawnego `<link rel="icon">`.
Jeśli plik nie istnieje, w konsoli pojawia się 404.

## Potwierdzenie w kodzie
W `Kalkulator/index.html` nie ma deklaracji favicon (`<link rel="icon" ...>`), więc przeglądarka używa domyślnej ścieżki `/favicon.ico`.

## Rekomendowane rozwiązania
1. Dodać plik `favicon.ico` w katalogu głównym hosta GitHub Pages (tam, gdzie jest dostępny pod `https://cutelittlegoat.github.io/favicon.ico`).
2. Alternatywnie dodać jawny wpis w `<head>` strony, np.:
   - `<link rel="icon" href="./favicon.ico" type="image/x-icon">`
   i umieścić plik w module, jeśli strona ma działać jako niezależny podkatalog.
3. Jeśli błąd jest tylko estetyczny, można go zignorować (nie wpływa na działanie kalkulatora).

## Odpowiedź: do czego służy `favicon.ico`?
`favicon.ico` to mała ikona identyfikująca stronę/aplikację w interfejsie przeglądarki i systemu:
- karta przeglądarki (obok tytułu strony),
- lista zakładek / ulubionych,
- skróty do strony (np. na pasku, ekranie startowym, czasem w historii),
- czasami podgląd linku w niektórych narzędziach.

W praktyce:
- **nie jest potrzebna do działania logiki kalkulatora**,
- **poprawia UX i rozpoznawalność modułu**,
- **eliminuje 404 w konsoli** (jeśli plik istnieje pod właściwą ścieżką albo jest poprawnie podlinkowany).

# Analiza działania przycisków „GM (test)” i „Infoczytnik (test)”

## Prompt użytkownika
> https://cutelittlegoat.github.io/WrathAndGlory/Infoczytnik/index.html  
> Sprawdź czy przyciski "GM (test)" i "Infoczytnik (test)" wymuszają przejście do najnowszej wersji plików testowych.  
> Jak teraz wszedłem to uruchomiły się strony oznaczone wersją ?v=2026-03-12_12-00-00 a nie aktualną ?v=2026-03-12_18-10-00

## Wynik
Przyciski działają poprawnie i finalnie prowadzą do najnowszej wersji testowej `?v=2026-03-12_18-10-00`.

## Dowody
1. W `Infoczytnik/index.html` przyciski prowadzą do:
   - `./GM_test.html`
   - `./Infoczytnik_test.html`
2. W obu plikach testowych (`GM_test.html`, `Infoczytnik_test.html`) działa auto-cache-busting:
   - jeśli parametr `v` różni się od `INF_VERSION`, następuje `window.location.replace(...)` i podmiana na aktualną wartość.
   - aktualne `INF_VERSION` w obu plikach: `2026-03-12_18-10-00`.
3. Test przeglądarkowy (Playwright) wykonany na URL produkcyjnym potwierdził, że po kliknięciu:
   - `GM (test)` kończy na `.../GM_test.html?v=2026-03-12_18-10-00`
   - `Infoczytnik (test)` kończy na `.../Infoczytnik_test.html?v=2026-03-12_18-10-00`

## Wniosek praktyczny
Jeśli chwilowo otwiera się starszy URL (np. `?v=2026-03-12_12-00-00`), mechanizm na stronie testowej powinien go automatycznie nadpisać do `?v=2026-03-12_18-10-00`. Aktualny stan repozytorium i test kliknięcia nie potwierdzają utrwalonego problemu.

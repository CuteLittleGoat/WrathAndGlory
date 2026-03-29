# Analiza: skrót mobilny vs start_url PWA w `Main`
Data: 2026-03-29

## Prompt użytkownika
"Przeprowadź analizę tej zmiany i zapisz mi jej wyniki w Analizy.\n1. Czy jak utworzę skrót widoku użytkownika: https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html\n\nto utworzony skrót automatycznie uruchomi się z parametrem ?admin=1\n\nCelem oczekiwanym jest, że jak na urządzaniu mobilnym otworzę stronę https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html i utworzę skrót to otworzy się strona https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html\n\na jak otworzę stronę https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html?admin=1 i utworzę skrót to otworzy się strona https://cutelittlegoat.github.io/WrathAndGlory/Main/index.html?admin=1\n\nAplikacja zainstalowana przez PWA ma się zawsze otwierać tylko w trybie użytkownika (czyli bez zmian)."

---

## Zakres analizy
Analiza dotyczy zmiany, w której w `manifest.webmanifest` ustawiono:
- `start_url: "./Main/index.html?admin=1"`

oraz wpływu tej zmiany na:
1. "Utwórz skrót" (browser shortcut),
2. "Zainstaluj" (PWA install).

## Wnioski

### 1) Czy skrót utworzony z widoku użytkownika (`.../Main/index.html`) uruchomi się z `?admin=1`?
**To zależy od rodzaju skrótu wybranego na urządzeniu:**

- **Jeśli użytkownik wybierze „Zainstaluj” (PWA):**
  - start następuje z `manifest.start_url`,
  - przy obecnej zmianie będzie to `.../Main/index.html?admin=1`,
  - czyli **tak — uruchomi się w adminie**.

- **Jeśli użytkownik wybierze „Utwórz skrót” (skrót przeglądarkowy):**
  - skrót zwykle zachowuje bieżący URL (otwarcie w Chrome),
  - więc z `.../Main/index.html` powinien otworzyć `.../Main/index.html`.

### 2) Czy obecna zmiana realizuje Twój cel docelowy?
**Nie, nie realizuje w pełni.**

Twój cel:
- skrót z URL user -> uruchamia user,
- skrót z URL admin -> uruchamia admin,
- **instalowana aplikacja PWA zawsze user**.

Obecna zmiana (`start_url=?admin=1`) łamie trzeci punkt, bo instalowana PWA startuje jako admin.

### 3) Co technicznie powinno być ustawione, żeby spełnić cel?
Aby spełnić warunek „PWA zawsze user”, `manifest.start_url` powinien wskazywać URL bez admina, tj.:
- `./Main/index.html` (lub alternatywnie `./Main/index.html?pwa=1`, jeśli to było celowe rozróżnienie trybu PWA).

Wtedy:
- **Zainstaluj (PWA)** -> zawsze user,
- **Utwórz skrót** -> zależnie od aktualnego URL (user/admin), zgodnie z Twoim oczekiwaniem.

## Rekomendacja
1. Cofnąć zmianę `start_url` z `?admin=1` do user-only (`./Main/index.html` albo `./Main/index.html?pwa=1`).
2. Przetestować na Androidzie oba warianty z menu:
   - **Zainstaluj**,
   - **Utwórz skrót**,
   bo to dwa różne mechanizmy.
3. Dodać krótką notę UX na stronie admina, że „Instaluj” i „Utwórz skrót” zachowują się inaczej.

## Podsumowanie jednozdaniowe
Zmiana `start_url` na `?admin=1` powoduje, że instalowana PWA otwiera admina, więc jest sprzeczna z wymaganiem „PWA zawsze user”; aby osiągnąć oczekiwane zachowanie, `start_url` musi wrócić do URL użytkownika.

# Zasady pracy z modułem Infoczytnik

## 1. Pliki robocze

Wszystkie zmiany kodu w module `Infoczytnik` należy wykonywać wyłącznie w plikach:

- `GM_test.html`
- `Infoczytnik_test.html`

Nie wolno modyfikować plików:

- `GM.html`
- `Infoczytnik.html`
- `GM_backup.html`
- `Infoczytnik_backup.html`

Pliki produkcyjne i backupy są aktualizowane ręcznie przez właściciela repozytorium.

## 2. Wersja INF_VERSION

Po każdej zmianie w pliku `GM_test.html` i/lub `Infoczytnik_test.html` należy zaktualizować wartość `INF_VERSION` w obu plikach testowych.

Wersja musi mieć format:

`rrrr-MM-dd_HH-mm-ss`

Przykład:

`2026-03-13_08-16-00`

Godzina ma być podana według lokalnego czasu w Polsce.

Wartość `INF_VERSION` musi być taka sama w plikach:

- `GM_test.html`
- `Infoczytnik_test.html`

## 3. Test po zmianach

Po każdej zmianie wymagany jest test sprawdzający działanie plików testowych.

Minimalny test powinien obejmować:

- uruchomienie `GM_test.html`;
- uruchomienie `Infoczytnik_test.html`;
- wysłanie testowej wiadomości z panelu GM;
- sprawdzenie, czy wiadomość pojawia się na ekranie odbiorcy;
- sprawdzenie, czy wybrany layout/frakcja działa poprawnie;
- sprawdzenie, czy dźwięk działa po uzbrojeniu audio w przeglądarce;
- sprawdzenie konsoli lub debug overlay, jeżeli zmiana dotyczy Firebase, audio albo komunikacji między ekranami.

## 4. Dokumentacja

Po każdej zmianie kodu w plikach testowych należy zaktualizować dokumentację modułu:

- `Infoczytnik/docs/Documentation.md`
- `Infoczytnik/docs/README.md`

`README.md` ma zawierać instrukcję obsługi dla użytkownika.

`README.md` ma zawierać pełną wersję polską i pełną wersję angielską.

`Documentation.md` ma zawierać dokładny opis techniczny kodu, w tym:

- strukturę plików;
- funkcje JavaScript;
- użyte style;
- fonty;
- layouty;
- strukturę danych;
- integrację Firebase;
- obsługę audio;
- obsługę debug overlay;
- zasady działania poszczególnych elementów.

`Documentation.md` ma być wystarczająco szczegółowy, aby inny użytkownik lub programista mógł odtworzyć aplikację 1:1 wyłącznie na podstawie dokumentacji.

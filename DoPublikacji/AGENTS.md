\# Zasady utrzymania kopii DoPublikacji



Folder `DoPublikacji` jest publikacyjną kopią aplikacji WrathAndGlory, przeznaczoną do wdrażania przez niezależne grupy graczy na własnych serwerach.



\## Zasada nadrzędna

Każda zmiana funkcjonalna, poprawka błędu, aktualizacja UI/UX lub refaktoryzacja wykonana w modułach głównych repozytorium MUSI zostać odzwierciedlona także w odpowiadających plikach w `DoPublikacji`.



\## Wyjątki (dane celowo nieprzenoszone 1:1)

Nie kopiujemy 1:1 danych, które każda grupa musi uzupełnić samodzielnie:

\- hiperłącza grupowe (np. `Main/ZmienneHiperlacza.md`),

\- konfiguracje Firebase (`firebase-config.js`),

\- pliki wsadowe i ich zawartość (np. `Repozytorium.xlsx`, `AudioManifest.xlsx`, dane prywatne grupy),

\- inne dane środowiskowe/specyficzne dla serwera danej grupy.



\## Wymagany standard dla DoPublikacji

1\. Brak prawdziwych sekretów i konfiguracji produkcyjnych autora.

2\. Brak twardych odwołań do prywatnej infrastruktury autora (linki, endpointy, hostowane dane).

3\. Domyślny język użytkowy ustawiony na EN (jeśli moduł wspiera wybór języka).

4\. Brak elementów PWA/Web Push, chyba że dokument publikacyjny wyraźnie dopuszcza inaczej.

5\. Dokumentacja modułu (`docs/README.md`, `docs/Documentation.md`) aktualna i zgodna z wersją publikacyjną.



\## Kontrola przed wydaniem

Przed udostępnieniem nowej wersji `DoPublikacji` należy wykonać kontrolę:

\- czy wszystkie moduły działają lokalnie po podaniu własnych danych grupy,

\- czy nie ma odwołań do starego hostingu,

\- czy placeholdery wymagające ręcznej konfiguracji są czytelnie opisane w README.


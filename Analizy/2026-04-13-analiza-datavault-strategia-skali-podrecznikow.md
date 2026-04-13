# Analiza modułu DataVault — strategia skalowania danych z wielu podręczników

Data analizy: 2026-04-13

## Prompt użytkownika (oryginalny)
"Przeprowadź analizę modułu DataVault.
Moduł zawiera dużo informacji z tabel z podręczników TTRPG.
Jednak niebawem może pojawić się pewien problem. Podręczników zaczyna być dużo i są one specyficzne (np. podręcznik dla Aeldari, albo podręcznik dla konkretnego zakonu Space Marine).
Z jednej strony powinienem dopisać je do obecnych tabel - np. bronie tylko dla Aeldari.
Z drugiej będzie tego bardzo dużo i aplikacja może stać się nieczytelna.
Zaproponuj jakieś rozwiązanie.
Co zrobić, żeby z jednej strony tabele były czytelne i przejrzyste a z drugiej zawierały również wszystkie dane ze wszystkich podręczników (to był główny cel powstania modułu)."

## Cel analizy
Wypracowanie podejścia, które jednocześnie:
1. Zachowuje pełną bazę danych (wszystkie podręczniki).
2. Utrzymuje czytelność i szybkość pracy użytkownika.
3. Ogranicza chaos w zakładkach i tabelach przy rosnącej liczbie bardzo wyspecjalizowanych źródeł.

## Obserwacja problemu
Obecny model „jedna zakładka = jedna domena danych” działa dobrze przy umiarkowanej liczbie źródeł, ale skala publikacji tematycznych (Aeldari, konkretne zakony, subfrakcje) powoduje:
- wzrost liczby wierszy o niskiej przydatności dla aktualnie granej frakcji;
- trudniejsze filtrowanie (dużo szumu semantycznego);
- ryzyko mieszania treści „uniwersalnych” i „niszowych” bez jasnego kontekstu.

To klasyczny konflikt: **kompletność danych vs. użyteczność interfejsu**.

## Rekomendowana strategia (najlepszy kompromis)

### 1) Jeden wspólny magazyn danych + obowiązkowe metadane źródłowe
Nie rozdzielać bazy na oddzielne aplikacje. Zostawić jedną centralną bazę, ale każdy rekord powinien mieć zestaw metadanych:
- `Podręcznik` (np. Core, Aeldari, Space Marines, itd.),
- `Linia/Familia` (np. Imperium, Aeldari, Chaos, Xenos),
- `Frakcja` / `Subfrakcja` (jeżeli dotyczy),
- `Typ źródła` (Core / Dodatek frakcyjny / Dodatek kampanijny),
- `Status kanoniczności` (opcjonalnie: official / homebrew / deprecated),
- `Strona` (już obecna lub planowana).

Wniosek: kompletność zostaje, ale kontekst staje się jawny.

### 2) Profilowanie widoku zamiast mnożenia zakładek
Zamiast tworzyć nowe zakładki typu „Bronie Aeldari”, „Bronie Space Marines”, lepiej dodać **profile filtrów (presety)**:
- „Wszystko” (domyślnie pełna baza),
- „Core only”,
- „Imperium”,
- „Aeldari”,
- „Chaos”,
- „Moja kampania” (preset użytkownika).

Preset = zestaw filtrów na istniejących tabelach.
Dzięki temu interfejs pozostaje ten sam, ale użytkownik przełącza kontekst jednym kliknięciem.

### 3) Dwupoziomowe filtrowanie: globalne i kontekstowe
Warto dodać (lub formalnie ustandaryzować) dwa poziomy filtrów:
- **Globalne filtry źródła** (na poziomie całej aplikacji): Podręcznik/Frakcja/Typ źródła,
- **Filtry tabeli** (już istniejące): po kolumnach konkretnej zakładki.

Zasada UX:
- najpierw zawężasz „co w ogóle ma być widoczne”,
- potem doprecyzowujesz w obrębie tabeli.

To najmocniej redukuje nieczytelność przy dużym wolumenie danych.

### 4) Domyślnie pokazuj „minimum szumu”
Aby użytkownik nie tonął w danych od pierwszego uruchomienia:
- domyślny preset: „Core + najczęściej używane”,
- przełącznik „Pokaż wszystko (all sources)” jako świadoma decyzja.

To nie usuwa danych — tylko kontroluje „pierwsze wrażenie” i obciążenie poznawcze.

### 5) Etykiety i badge przy rekordach
W każdym wierszu warto wizualnie sygnalizować pochodzenie:
- badge `CORE`, `AELDARI`, `SM`, itp.,
- opcjonalnie kolor/ikona typu źródła.

Efekt: użytkownik od razu widzi, czy element jest uniwersalny czy niszowy, bez wchodzenia w szczegóły.

### 6) Technika „progressive disclosure” w tabelach
Nie wszystkie kolumny muszą być zawsze rozwinięte:
- kolumny „zaawansowane” (np. długie opisy, uwagi redakcyjne, powiązania) mogą być domyślnie zwinięte,
- przycisk „Pokaż kolumny zaawansowane” dla power-usera.

W ten sposób tabela pozostaje czytelna, a dane nadal są dostępne 1:1.

### 7) Wydajność i skalowanie danych
Przy dużej liczbie rekordów warto zaplanować:
- wirtualizację wierszy (render tylko widocznej części),
- cache wyników filtrów,
- lekkie indeksy po polach: `Podręcznik`, `Frakcja`, `Nazwa`.

To podniesie responsywność bez amputowania zakresu danych.

## Proponowany model organizacyjny danych (docelowo)

### Warstwa danych (kanoniczna)
Jeden `data.json`, ale ze stabilnym schematem metadanych źródłowych.

### Warstwa prezentacji
- te same zakładki domenowe (Bronie, Pancerze, Archetypy...),
- globalny panel „Kontekst źródeł” (presety + filtry globalne),
- lokalne filtry kolumnowe.

### Warstwa personalizacji
Zapis preferencji użytkownika:
- ostatni preset,
- widoczne kolumny,
- ulubione podręczniki/frakcje.

## Priorytet wdrożenia (kolejność)
1. Ujednolicić metadane źródłowe dla każdego rekordu.
2. Dodać globalne filtry (Podręcznik/Frakcja/Typ źródła).
3. Dodać preset „Core only” + „Wszystko”.
4. Dodać zapisywanie presetów użytkownika.
5. Dodać badge źródeł w tabelach.
6. (Opcjonalnie) wirtualizacja i indeksowanie, jeśli pojawią się lagi.

## Czego unikać
- Duplikowania zakładek per frakcja (szybko eksploduje liczba tabów).
- Ręcznego utrzymywania wielu plików `data-*.json` bez centralnego standardu.
- Ukrywania danych na stałe (to przeczy głównemu celowi modułu).

## Konkluzja
Najlepszym rozwiązaniem jest **architektura „single source of truth + warstwa kontekstu”**:
- wszystkie dane ze wszystkich podręczników pozostają w jednej bazie,
- czytelność uzyskujesz przez globalne filtry, profile (presety) i kontrolę widoczności kolumn,
- UI nie puchnie od kolejnych zakładek, a użytkownik pracuje na tym kontekście (frakcji/podręczniku), który faktycznie go interesuje.

To podejście najpełniej realizuje główny cel DataVault: kompletność danych bez utraty ergonomii.

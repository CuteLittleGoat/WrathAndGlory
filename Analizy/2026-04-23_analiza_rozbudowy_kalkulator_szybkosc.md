# Analiza rozbudowy `Kalkulator/TworzeniePostaci.html` o atrybut „Szybkość / Speed”

## Prompt użytkownika
> Przygotuj analizę rozbudowy Kalkulator/TworzeniePostaci.html
>
> Przy sekcji "Atrybuty" trzeba będzie dodać nowe pole o nazwie "Szybkość" (wersja PL) lub "Speed" (wersja Ang).
> Nic ma się nie zmieniać w sposobie obliczeń. Ma działać i się liczyć tak jak każde inne pole z sekcji "Atrybuty" i tak samo wpływać na ogólną pulę punktów doświadczenia do wydania.

## Cel zmiany
Dodać ósmy atrybut do sekcji „Atrybuty”, który:
1. jest widoczny w tabeli jako dodatkowa kolumna,
2. ma tłumaczenie etykiety zależne od języka (PL: „Szybkość”, EN: „Speed”),
3. ma identyczne zasady walidacji i naliczania kosztu jak pozostałe atrybuty (`min=1`, `max=12`, koszt z `attributeCosts`),
4. wpływa na `xpSpent` i `xpRemaining` dokładnie tak, jak obecne pola atrybutów,
5. resetuje się przy `resetAll()` do wartości `1`.

## Stan obecny (diagnoza kodu)
W `Kalkulator/TworzeniePostaci.html` sekcja atrybutów jest obecnie oparta o 7 kolumn (`attrLabel1..7` i `attr_S`, `attr_Wt`, `attr_Zr`, `attr_I`, `attr_SW`, `attr_Int`, `attr_Ogd`).

Kluczowe miejsca, które wymagają aktualizacji przy dodaniu nowego pola:

1. **HTML tabeli atrybutów**
   - Dodać nowy nagłówek `<th id="attrLabel8">...`.
   - Dodać nowe pole `<input type="number" id="attr_Speed" value="1" min="1" max="12">`.

2. **Tłumaczenia (`translations`)**
   - W `translations.pl.attributes` dodać pozycję „Szybkość”.
   - W `translations.en.attributes` dodać pozycję „Speed”.
   - Uwaga: obecnie tablice przechowują skróty (np. `S`, `Wt`, `Zr`...), więc decyzja projektowa:
     - albo przejść na pełne nazwy tylko dla nowego pola (mieszany styl),
     - albo zachować styl skrótów i użyć np. `Sz` / `Spd`.
   - Ponieważ wymaganie użytkownika mówi o nazwie „Szybkość/Speed”, rekomendowane jest użycie **pełnych nazw** dla nowego pola.

3. **Pętla aktualizacji etykiet atrybutów w `updateLanguage(lang)`**
   - Zmienić zakres pętli z `1..7` na `1..8`, aby nowy nagłówek był aktualizowany przy zmianie języka.

4. **Reset pól w `resetAll()`**
   - Rozszerzyć listę atrybutów resetowanych do 1 o nowy identyfikator (np. `Speed`).

5. **Kalkulacja XP w `recalcXP()`**
   - Rozszerzyć `attrIds` o `attr_Speed`.
   - Dzięki temu nowy atrybut automatycznie:
     - przejdzie walidację 1..12,
     - naliczy koszt z `attributeCosts`,
     - będzie wpływał na `xpSpent` i `xpRemaining`,
     - otrzyma klasę `attribute-high` dla wartości > 8.

6. **Walidacja pustych wartości (`attachDefaultOnBlur`)**
   - Nie wymaga zmian, bo działa po selektorze `input[id^='attr_']`, więc obejmie nowe pole automatycznie.

## Wpływ na logikę i ryzyko

### Wpływ funkcjonalny
- Dodanie nowego pola zwiększy możliwy łączny koszt inwestycji w atrybuty (co jest zgodne z wymaganiem).
- Mechanika liczenia pozostanie bez zmian (ta sama tabela kosztów i ten sam pipeline `recalcXP()`).

### Ryzyka techniczne
1. **Niespójność nazewnictwa etykiet**
   - Obecne etykiety są skrótami; nowa pełna etykieta może wyglądać inaczej wizualnie.
2. **Szerokość tabeli na węższych ekranach**
   - Dodanie 8. kolumny może pogorszyć czytelność na małych rozdzielczościach.
3. **Literówka w identyfikatorach**
   - Błąd typu `attr_speed` vs `attr_Speed` spowoduje brak naliczania kosztu lub brak resetu.

## Rekomendowany zakres implementacji (minimalny)
1. Dodać nową kolumnę w HTML (`attrLabel8`, `attr_Speed`).
2. Dodać tłumaczenia nazwy do obu języków.
3. Zmienić pętlę etykiet 7→8.
4. Dodać nowy identyfikator w `resetAll()`.
5. Dodać nowy identyfikator w `recalcXP()`.

Bez zmian w:
- `attributeCosts`,
- zasadach „Tree of Learning”,
- kosztach umiejętności i talentów,
- mechanice błędów.

## Proponowane testy po wdrożeniu
1. **Test naliczania**
   - Ustawić `Speed` z 1 na 2 i sprawdzić spadek `xpRemaining` o 4.
2. **Test granic**
   - Wpisać 0 i 13, upewnić się że wartości są korygowane odpowiednio do 1 i 12.
3. **Test resetu języka**
   - Zmienić język i potwierdzić reset, sprawdzić że nowe pole wraca do 1.
4. **Test tłumaczeń**
   - PL: etykieta „Szybkość”, EN: „Speed”.
5. **Test przekroczenia XP**
   - Podnieść kilka atrybutów + `Speed`, potwierdzić komunikat o przekroczeniu puli XP.

## Podsumowanie
Zmiana jest **niskiego ryzyka** i lokalna. Obecna architektura pliku już wspiera takie rozszerzenie (tablice ID + wspólna funkcja przeliczeń), więc dodanie „Szybkość/Speed” wymaga jedynie konsekwentnego dopięcia nowego pola we wszystkich miejscach, gdzie kod iteruje po atrybutach.

## Doprecyzowanie decyzji (odpowiedzi użytkownika)
1. **Decyzja dot. stylu etykiety nowego pola**
   - Wybrano **styl mieszany**.
   - Dotychczasowe pola pozostają skrótowe, a nowa nazwa ma być pełna: **„Szybkość” / „Speed”**.

2. **Niespójność nazewnictwa etykiet**
   - Uznano za wyjaśnioną przez pkt 1.
   - Niespójność wizualna jest w tym przypadku **akceptowalna**.

3. **Czytelność po dodaniu 8. kolumny**
   - Ryzyko pogorszenia czytelności na małych rozdzielczościach jest **akceptowalne**.

4. **Ryzyko literówki `attr_speed` vs `attr_Speed`**
   - Należy zadbać o pełną spójność identyfikatorów podczas rozbudowy, aby uniknąć braku naliczania kosztu lub braku resetu.

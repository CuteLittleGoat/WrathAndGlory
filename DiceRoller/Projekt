Założenia modułu "DiceRoller":

Ma on służyć do symulacji rzutu 6cio ścienną kością do gry.
Ma mieć dwa pola do wpisania przez użytkownika:
1. Pole o nazwie "Stopień Trudności". Użytkownik może tam wpisać liczbę od 1 do 99. Domyślna wartość 1. Powinny istnieć strzałki "góra-dół" do zmiany cyfry o jeden. W module "Kalkulator" jest podobna funkcjonalność. Możesz przeczytać Kalkulator/docs/Documentation.md po więcej informacji.

2. Pole o nazwie "Pula Kości". Użytkownik może tam wpisać liczbę od 1 do 99. Domyślna wartość 1. Powinny istnieć strzałki "góra-dół" do zmiany cyfry o jeden. W module "Kalkulator" jest podobna funkcjonalność. Możesz przeczytać Kalkulator/docs/Documentation.md po więcej informacji.

3. Pole o nazwie "Ilość Kości Furii". Użytkownik może tam wpisać liczbę od 1 do 99. Domyślna wartość 1. Powinny istnieć strzałki "góra-dół" do zmiany cyfry o jeden. W module "Kalkulator" jest podobna funkcjonalność. Możesz przeczytać Kalkulator/docs/Documentation.md po więcej informacji. Wpisana wartość nie może być wyższa niż wartość w polu "Pula Kości".


Dodatkowo ma być przycisk "Rzuć kośćmi!"

Następnie aplikacja wyświetla animację rzutu tyloma kośćmi ile użytkownik wpisał w pole o nazwie "Pula Kości".
Kolor kości zależy od wartości wpisanych w pola "Ilość Kości Furii".
Aplikacja będzie generować białe kości z czarnymi oczkami/kropkami oraz czerwone kości z białymi oczkami/kropkami.
Ilość czerwonych kości odpowiada wartości wpisanej w "Ilość Kości Furii". Pozostałe będą białe.
Przykładowo:
Wartość w polu "Pula Kości" = 1
Wartość w polu "Ilość Kości Furii" = 1
Aplikacja wygeneruje rzut jedną czerwoną kością.

Wartość w polu "Pula Kości" = 3
Wartość w polu "Ilość Kości Furii" = 1
Aplikacja wygeneruje rzut jedną kością czerwoną oraz dwiema białymi

Wartość w polu "Pula Kości" = 4
Wartość w polu "Ilość Kości Furii" = 2
Aplikacja wygeneruje rzut dwiema czerwonymi kośćmi oraz dwiema białymi.

Czyli:
Zawsze ilość czerwonych kości odpowiada wartości "Ilość Kości Furii".
Ilość białych kości odpowiada wynikowi "Pula Kości" minus "Ilość Kości Furii".
Wartości ujemne są niedozwolone, dlatego aplikacja nie pozwoli na wpisanie w pole "Ilość Kości Furii" większej wartości niż istnieje w polu "Pula Kości".

Po wygenerowaniu kości i wyświetleniu animacji rzutu wyświetl wyniki.
ZAŁOŻENIA:
Wyniki 1, 2 i 3 liczone są jako 0 punktów.
Wyniki 4 i 5 liczone są jako 1 punkt.
Wynik 6 jest liczony jako 2 punkty.

Jeżeli suma punktów jest niższa niż wartość wpisana w pole "Stopień Trudności" to wyświetl komunikat "Porażka!"
Jeżeli suma punktów jest równa lub wyższa wartości wpisanej w pole "Stopień Trudności" to wyświetl komunikat "Sukces!"

Jeżeli na przynajmniej jednej czerwonej kości wypadnie 1 to wyświetl również napis "Komplikacja Furii" z emotką smutnej buzi.
Jeżeli na wszystkich czerwonych kościach wypadnie 6 to wyświetl również napis "Krytyczna Furia" z emotką uśmiechniętej buzi.

Przykładowo:
W użytych są trzy czerwone kości.
Wypadają wyniki 2, 3, 4 - punkty liczone są na normalnych zasadach, ale żaden dodatkowy komunikat się nie pojawia ponieważ nie ma żadnej 1 ani wszystkie wyniki nie wynoszą 6
Wypadają wyniki 5, 6, 6 - punkty liczone są na normalnych zasadach, ale żaden dodatkowy komunikat się nie pojawia ponieważ nie ma żadnej 1 ani wszystkie wyniki nie wynoszą 6
Wypadają wyniki 1, 2, 3 - punkty liczone są na normalnych zasadach oraz pojawia się komunikat "Komplikacja Furii" ponieważ wypadła przynajmniej jedna 1
Wypadają wyniki 1, 1, 6 - punkty liczone są na normalnych zasadach oraz pojawia się komunikat "Komplikacja Furii" ponieważ wypadła przynajmniej jedna 1
Wypadają wyniki 6, 6, 6 - punkty liczone są na normalnych zasadach oraz pojawia się komunikat "Krytyczna Furia" ponieważ na wszystkich czerwonych kościach wypadły 6

W użyciu jest jedna czerwona kość.
Wypada wynik 1 - punkty liczone są na normalnych zasadach oraz pojawia się komunikat "Komplikacja Furii" ponieważ wypadła przynajmniej jedna 1
Wypada wynik 2 - punkty liczone są na normalnych zasadach, ale żaden dodatkowy komunikat się nie pojawia ponieważ nie ma żadnej 1 ani wszystkie wyniki nie wynoszą 6
Wypada wynik 6 - punkty liczone są na normalnych zasadach oraz pojawia się komunikat "Krytyczna Furia" ponieważ na wszystkich czerwonych kościach wypadły 6

Dodatkowo trzeba oprogramować funkcję "MożliwePrzeniesienie".
"Przeniesienie" oznacza, że nawet po usunięciu z wyników jakiś wynik 6 (warty 2 punkty) wciąż suma pozostałych kości wynosi wartość równą lub większą "Stopień Trudności". Przy przeniesieniu kolor kości nie ma znaczenia.

Przykładowo "Stopień Trudności" wynosi 3. Pula Kości wynosi 5.
Wypadają wyniki 1, 2, 3, 4, 5 - test zakończony porażką. Brak możliwości zastosowania Przeniesienia.
Wypadają wyniki 5, 5, 5, 5, 5 - test zakończony sukcesem. Brak możliwości zastosowania Przeniesienia, ponieważ nie ma żadnych "nadmiarowych" 6
Wypadają wyniki 4, 5, 5, 1, 6 - test zakończony sukcesem. Istnieje możliwość zastosowania Przeniesienia, ponieważ nawet bez 6 ilość punktów na pozostałych kościach jest równa lub wyższa Stopniowi Trudności.
Wypadają wyniki 4, 4, 6, 6, 6 - test zakończony sukcesem. Istnieje możliwość zastosowania Przeniesienia dla dwóch kości na których wypadło 6, ponieważ wyniki 4, 4 i 6 w sumie dają 4 punkty. Same kości z wynikami 4 i 4 nie wystarczają do osiągnięcia Stopnia Trudności, więc trzeba dodatkowo policzyć jedną kość na której wypadło 6. Dwie pozostałe kości na których wypadło 6 są "nadmiarowe" i mogą być użyte w Przeniesieniu.
Wypadają wyniki 1, 2, 3, 4, 6 - test zakończony sukcesem. Brak możliwości zastosowania Przeniesienia, ponieważ kość na której wypadło 6 jest niezbędna do osiągnięcia wartości wskazanej przez Stopień Trudności.

Przy podsumowaniu wyniku oprócz informacji "Porażka!" lub "Sukces!" z ewentualnym dopiskiem "Komplikacja Furii" lub "Krytyczna Furia" jeżeli możliwe jest zastosowanie Przeniesienia to napisz to i podaj ile kości na których wypadło 6 można przenieść. Przykładowo: "Możliwe Przeniesienie: 3" gdzie 3 to liczba kości na których wypadło 6 a które są "nadmiarowe", czyli bez tych kości z wyniku rzutu osiągnięto wymaganą lub wyższą niż Stopień Trudności liczbę punktów.

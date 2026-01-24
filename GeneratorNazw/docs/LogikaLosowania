1) Klocki: LUDZIE (Imperium)
HUMAN.upper – Klasa Wyższa

Służy do składania “szlachecko-gothic” imion i nazwisk.

givenA – początek imienia (np. Aure, Octa, Hadri)

givenB – koniec imienia (np. lian, tian, phine)

surRoot – rdzeń nazwiska (np. Vorn, Varro, Cairn)

surSuf – sufiks nazwiska (np. ius, ford, ward, ski)

Reguła:

imię = givenA + givenB

nazwisko = surRoot + surSuf

wynik = Imię Nazwisko

HUMAN.lower – Klasa Niższa

Służy do “hive/underhive” nazw: krótkich, ostrych, czasem z numerkiem.

givenA – imię/ksywa bazowa (Jax, Rook, Nox)

givenB – opcjonalny dopisek (często pusty, czasem -7, -21)

surRoot – rdzeń nazwiska/ksywy (Brask, Smog, Rivet)

surSuf – sufiks (często pusty, czasem -V, -IX, lub normalne jak son, ward)

Reguła:

imię = givenA + givenB

nazwisko = surRoot + surSuf

2) Klocki: ASTARTES
ASTARTES

Generuje “imię + bojowe nazwisko” w stylu Space Marines.

pre – początek imienia

mid – środek/łącznik imienia

end – koniec imienia

cognA – pierwszy człon przydomka/nazwiska (np. Iron, Void, Blood)

cognB – drugi człon (np. blade, guard, fist)

Reguła:

imię = pre + mid + end

nazwisko = cognA + cognB

wynik = Imię Nazwisko

3) Klocki: ADEPTUS MECHANICUS
MECH

Używane do budowania “techo-imion” i oznaczeń.

pre – początek techno-imienia (Ferr, Noos, Data)

mid – rdzeń/segment (itor, plex, gnosis, orithm)

suf – zakończenie (ix, us, -41, Prime, IV)

tag – prefiks oznaczenia (M-, KX-, Sigma-)

Reguły:

Tech-Kapłani: pre + mid + suf oraz (często) tag + liczba jako drugi człon

Skitarii: w tej wersji to proste unit + numer (nie z MECH, ale warto trzymać tu też kiedyś units)

4) Klocki: AELDARI
AELDARI.craft – Craftworld (Asuryani)

Sylaby melodyczne.

pre – start imienia

mid – środek (czasem łączony podwójnie)

end – zakończenie

Reguła:

imię = pre + mid (+ mid czasem) + end

czasem drugi człon (kolejne takie samo losowanie) ⇒ “imię dwuczłonowe”

AELDARI.drukh – Drukhari

Ostrzejsze, “kolczaste” brzmienie.

pre, mid, end – analogicznie, ale inne sylaby i zakończenia

AELDARI.harl – Harlequins

Bardziej “sceniczne” końcówki (mask, dance, gleam itd.).

5) Klocki: NECRON
NECRON

Chłodne, “metaliczne”, z częstymi zbitkami.

pre – start

mid – rdzeń (czasem podwajany)

end – zakończenie

Reguły:

zwykłe: pre + mid (+ mid) + end

lordowie: w kodzie jest “wzmocnienie” przez dokładanie dodatkowego pre i mid (bez tytułów)

6) Klocki: ORK
ORK

Brzmi “orkowo” przez zbitki i agresywne końcówki.

pre

mid

end

Reguła:

pre + mid + end

7) Klocki: CHAOS
CHAOS

Osobne “smaki” sylab dla:

undiv (Undivided)

khorne

nurgle

tzeent

slaan

Każdy ma:

pre, mid, end

Reguła (taka sama):

imię = pre + mid (+ mid czasem) + end

w tej wersji ZAWSZE zwraca tylko imię (bez tytułów i dopisków)

8) Klocki: MASZYNY BOJOWE (Imperium)
WAR

Używane do budowania krótkich nazw typu “chassis + nazwa”.

tanks – lista podwozi/typów (np. Leman Russ, Baneblade)

titans – klasy tytanów (Warhound, Warlord)

knights – wzorce rycerzy (Paladin, Crusader)

air – lotnictwo (Valkyrie, Vulture)

nounsPL – polskie nazwy-rdzenie (np. Triumf, Pokuta, Zemsta)

Reguły:

czołg: tanks + noun

tytan: "Tytan " + titans + noun

rycerz: "Rycerz " + knights + noun

lotnictwo: air + noun

9) Klocki: OKRĘTY GWIEZDNE
SHIP

Tu są zestawy klocków do stylu nazw okrętów.

imperialA, imperialB – łacińsko-gothic składniki dla Imperium

chaosA, chaosB – mroczne, agresywne słowa Chaosu

eldarA, eldarB – “mitologiczne” i “melodyczne” elementy Aeldari

orkA, orkB – orkowe, prostackie człony

Reguły (przykłady z kodu):

Imperium: A + B albo A of B

Chaos: A + B albo A of B

Aeldari/Drukhari: A's B albo B of A

Necroni: osobny generator “monolityczny” z wewnętrznych list (Obelisk, Tomb, Protocol…)

Orkowie: A + B

Astartes: Pride/Oath/... + Fenris/Noctis/... (osobna lista w funkcji)

Mechanicus: Omnissiah/Noosphere/... + Protocol/Axiom/... (osobna lista w funkcji)

10) Klocek techniczny: czyszczenie wyników
cleanName(s)

To jest “bezpiecznik”, który usuwa:

cudzysłowy typograficzne,

wszystko w nawiasach,

podwójne spacje,

trim.

Używaj tego po każdej generacji, żeby nigdy nie wracały dopiski, których nie chcesz.

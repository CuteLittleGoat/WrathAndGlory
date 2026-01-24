# Generator Nazw — logika segmentów nazw

Ten dokument opisuje **segmenty słowotwórcze** (fragmenty, z których składają się nazwy) używane w module Generator Nazw.  
W kodzie segmenty są przechowywane jako tablice (np. `givenA`, `givenB`, `surRoot`) i łączone według prostych reguł w `script.js`.

## 1) LUDZIE (Imperium)
### HUMAN.upper — klasa wyższa
Styl „szlachecko‑gothic”.

**Segmenty:**
- `givenA` — początek imienia (np. `Aure`, `Octa`, `Hadri`).
- `givenB` — zakończenie imienia (np. `lian`, `tian`, `phine`).
- `surRoot` — rdzeń nazwiska (np. `Vorn`, `Varro`, `Cairn`).
- `surSuf` — sufiks nazwiska (np. `ius`, `ford`, `ward`, `ski`).

**Reguła budowy:**
- imię = `givenA + givenB`
- nazwisko = `surRoot + surSuf`
- wynik = `Imię Nazwisko`

### HUMAN.lower — klasa niższa
Styl „hive/underhive” — krótsze, ostrzejsze formy, czasem z numerem.

**Segmenty:**
- `givenA` — baza imienia/ksywy (np. `Jax`, `Rook`, `Nox`).
- `givenB` — opcjonalny dopisek (często pusty; czasem `-7`, `-21`).
- `surRoot` — rdzeń nazwiska/ksywy (np. `Brask`, `Smog`, `Rivet`).
- `surSuf` — sufiks (często pusty; czasem `-V`, `-IX`, albo normalne `son`, `ward`).

**Reguła budowy:**
- imię = `givenA + givenB`
- nazwisko = `surRoot + surSuf`

## 2) ASTARTES
Generator „imię + bojowy przydomek”.

**Segmenty:**
- `pre` — początek imienia.
- `mid` — środek/łącznik.
- `end` — zakończenie imienia.
- `cognA` — pierwszy człon przydomka (np. `Iron`, `Void`, `Blood`).
- `cognB` — drugi człon przydomka (np. `blade`, `guard`, `fist`).

**Reguła budowy:**
- imię = `pre + mid + end`
- przydomek = `cognA + cognB`
- wynik = `Imię Przydomek`

## 3) ADEPTUS MECHANICUS
Techno‑imiona oraz oznaczenia.

**Segmenty:**
- `pre` — początek imienia (np. `Ferr`, `Noos`, `Data`).
- `mid` — rdzeń (np. `itor`, `plex`, `gnosis`, `orithm`).
- `suf` — zakończenie (np. `ix`, `us`, `-41`, `Prime`).
- `tag` — prefiks oznaczenia (np. `M-`, `KX-`, `Sigma-`).

**Reguły budowy:**
- Tech‑Kapłani: `pre + mid + suf`, często z dodatkowym tagiem (`tag + liczba`) jako drugi człon.
- Skitarii: w tej wersji to proste oznaczenia `unit + numer` (osobna lista jednostek).

## 4) AELDARI
### AELDARI.craft — Craftworld (Asuryani)
Melodyjne sylaby.

**Segmenty:** `pre`, `mid`, `end`.

**Reguła budowy:**
- imię = `pre + mid (+ mid czasem) + end`
- czasem dodatkowy drugi człon: powtórzenie tej samej reguły ⇒ imię dwuczłonowe.

### AELDARI.drukh — Drukhari
Ostrzejsze, „kolczaste” brzmienie. Segmenty analogiczne (`pre`, `mid`, `end`), ale inne listy.

### AELDARI.harl — Harlequins
Bardziej „sceniczne” zakończenia (np. `mask`, `dance`, `gleam`).

## 5) NECRON
Chłodne, „metaliczne” brzmienie z częstymi zbitkami.

**Segmenty:** `pre`, `mid`, `end`.

**Reguła budowy:**
- standard: `pre + mid (+ mid) + end`
- lordowie: „wzmocnione” formy, gdzie dokładany jest dodatkowy `pre` i `mid`.

## 6) ORK
Brzmienie „orkowe” dzięki agresywnym zbitkom.

**Segmenty:** `pre`, `mid`, `end`.

**Reguła budowy:** `pre + mid + end`.

## 7) CHAOS
Oddzielne „smaki” sylab dla:
- `undiv` (Undivided)
- `khorne`
- `nurgle`
- `tzeent`
- `slaan`

Każdy zestaw ma segmenty `pre`, `mid`, `end`.

**Reguła budowy:**
- imię = `pre + mid (+ mid czasem) + end`
- w tej wersji generator zwraca tylko imię (bez tytułów i dopisków).

## 8) MASZYNY BOJOWE (Imperium)
Krótka nazwa = **typ podwozia + rdzeń nazwy**.

**Segmenty:**
- `tanks` — typy czołgów (np. `Leman Russ`, `Baneblade`).
- `titans` — klasy tytanów (`Warhound`, `Warlord`).
- `knights` — wzorce rycerzy (`Paladin`, `Crusader`).
- `air` — lotnictwo (`Valkyrie`, `Vulture`).
- `nounsPL` — polskie rdzenie nazw (np. `Triumf`, `Pokuta`, `Zemsta`).

**Reguły budowy:**
- czołg: `tanks + noun`
- tytan: `"Tytan " + titans + noun`
- rycerz: `"Rycerz " + knights + noun`
- lotnictwo: `air + noun`

## 9) OKRĘTY GWIEZDNE
Zestawy segmentów zależne od frakcji.

**Segmenty:**
- `imperialA`, `imperialB` — łacińsko‑gothic składniki Imperium.
- `chaosA`, `chaosB` — mroczne, agresywne słowa Chaosu.
- `eldarA`, `eldarB` — melodyjne elementy Aeldari.
- `orkA`, `orkB` — orkowe, prostackie człony.

**Reguły budowy (przykłady):**
- Imperium: `A + B` **albo** `A of B`.
- Chaos: `A + B` **albo** `A of B`.
- Aeldari/Drukhari: `A's B` **albo** `B of A`.
- Necroni: osobny generator „monolityczny” (np. `Obelisk`, `Tomb`, `Protocol`).
- Orkowie: `A + B`.
- Astartes: `Pride/Oath/... + Fenris/Noctis/...` (osobna lista w funkcji).
- Mechanicus: `Omnissiah/Noosphere/... + Protocol/Axiom/...` (osobna lista w funkcji).

## 10) Czyszczenie wyników
### `cleanName(s)`
Funkcja sanitizująca wynik końcowy. Usuwa:
- cudzysłowy typograficzne,
- treść w nawiasach,
- podwójne spacje,
- zbędne spacje na początku/końcu.

**Zasada:** wywołuj po każdej generacji, aby nie wracały niepożądane dopiski.

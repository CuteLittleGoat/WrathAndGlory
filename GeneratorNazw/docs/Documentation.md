# 🇵🇱 Dokumentacja techniczna — Generator Nazw (PL)

## Cel modułu

`GeneratorNazw` jest statycznym modułem frontendowym generującym nazwy w klimacie Warhammer 40,000.

Moduł odpowiada za:

- prezentację formularza wyboru kategorii i opcji,
- generowanie listy nazw na podstawie słowników imion, sylab i fraz dopasowanych do konwencji frakcji,
- odrzucanie nazw zastrzeżonych dla unikatowych postaci i okrętów z lore,
- obsługę zwykłego losowania i powtarzalnego losowania z seedem,
- renderowanie wyników jako listy tekstowej,
- kopiowanie wyników do schowka,
- podstawową obsługę PL/EN w kodzie.

Moduł nie ma backendu, nie używa Firebase i nie zapisuje danych użytkownika.

## Punkty wejścia

Główny plik modułu:

```text
GeneratorNazw/index.html
```

Plik ładuje:

```html
<link rel="stylesheet" href="style.css" />
<script src="script.js"></script>
```

## Tryby działania

Moduł ma jeden tryb użytkownika.

Nie posiada:

- trybu admina,
- logowania,
- zapisu stanu,
- importu danych,
- eksportu plików,
- integracji Firebase.

W kodzie istnieje przełącznik języka `#languageSelect`, ale jego kontener ma klasę `language-switcher--hidden`, więc przełącznik jest ukryty w interfejsie.

## Struktura plików

| Plik | Rola |
| --- | --- |
| `GeneratorNazw/index.html` | Struktura interfejsu: formularz, przyciski, pole wyników, ukryty przełącznik języka. |
| `GeneratorNazw/style.css` | Motyw terminalowy, layout formularza, style pól, przycisków i wyników. |
| `GeneratorNazw/script.js` | RNG, słowniki nazw, listy nazw zastrzeżonych, funkcje generujące nazwy, obsługa UI i kopiowania. |
| `GeneratorNazw/docs/README.md` | Instrukcja użytkownika PL/EN. |
| `GeneratorNazw/docs/Documentation.md` | Niniejsza dokumentacja techniczna PL/EN. |

## Zależności

Moduł korzysta wyłącznie ze standardowych API przeglądarki:

- DOM API,
- `crypto.getRandomValues`,
- `navigator.clipboard`,
- `setTimeout`.

Moduł nie używa:

- Firebase,
- Firestore,
- Realtime Database,
- SheetJS,
- JSZip,
- zewnętrznych frameworków,
- `localStorage`,
- `sessionStorage`.

## Struktura HTML

Główny kontener:

```html
<main class="wrap">
  <section class="panel">
    ...
  </section>
</main>
```

Najważniejsze elementy DOM:

| Element | Rola |
| --- | --- |
| `.wrap` | Zewnętrzny kontener szerokości strony. |
| `.panel` | Główna karta generatora. |
| `.language-switcher.language-switcher--hidden` | Ukryty kontener przełącznika języka. |
| `#languageSelect` | Selektor języka, obecnie niewidoczny przez CSS. |
| `.grid` | Siatka pól formularza. |
| `#cat` | Lista kategorii. |
| `#opt` | Lista opcji zależna od kategorii. |
| `#seed` | Pole seeda. |
| `#count` | Liczba wyników: `type="number"`, `min=1`, `max=50`, `step=1`, `inputmode="numeric"`, wartość startowa `10`. Skrypt nie pozwala wpisać więcej niż 50 (sekcja „Pole liczby wyników”). |
| `#gen` | Przycisk generowania. |
| `#copy` | Przycisk kopiowania wyniku. |
| `#modePill` | Znacznik trybu losowania. |
| `#res` | Kontener wyników. |
| `#seedHint` | Podpowiedź wyjaśniająca seed. |

## Struktura CSS

### Zmienne motywu

W `:root` zdefiniowano:

| Zmienna | Znaczenie |
| --- | --- |
| `--bg` | Ciemnozielone tło bazowe. |
| `--bg-grad` | Tło z radialnymi poświatami. |
| `--panel` | Czarne tło panelu. |
| `--panel-soft` | Półprzezroczyste zielone tło pól i przycisków. |
| `--text` | Główny kolor tekstu. |
| `--muted` | Przygaszony tekst pomocniczy. |
| `--border` | Zielone obramowania. |
| `--accent` | Główny akcent. |
| `--accent-dark` | Ciemniejszy akcent focus. |
| `--glow` | Zielona poświata panelu. |
| `--divider` | Kolor separatorów. |

### Fonty

Globalny font-stack:

```text
"Consolas", "Fira Code", "Source Code Pro", monospace
```

### Layout

Najważniejsze reguły:

- `body` ma tło `--bg-grad`, kolor `--text`, `line-height: 1.45` i lekki `letter-spacing`.
- `.wrap` ma szerokość `min(1100px, 100%)`, automatyczne wyśrodkowanie i padding.
- `.panel` ma czarne tło, zieloną ramkę, zaokrąglenie `12px` i poświatę `--glow`.
- `.grid` ma układ `1.2fr 1fr 1fr 140px`.
- Przy szerokości do `960px` `.grid` przechodzi na jedną kolumnę.
- `.row` układa przyciski i znacznik trybu w elastyczny rząd.
- `.results` używa `white-space: pre-wrap`, aby zachować podziały linii.

### Ukrycie przełącznika języka

Przełącznik języka jest ukrywany przez:

```css
.language-switcher--hidden {
  display: none !important;
}
```

Usunięcie klasy `language-switcher--hidden` z kontenera
`<div class="language-switcher language-switcher--hidden">` w `GeneratorNazw/index.html` ponownie
pokaże selektor języka. Regułę CSS można zostawić, bo bez klasy nie ma na co działać. Nad elementem
stoi komentarz `MIEJSCE ZMIANY WIDOCZNOŚCI PRZEŁĄCZNIKA JĘZYKA`.

### Siatka i wyniki na wąskim ekranie

`.grid` używa `minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr) 140px`. Bez `minmax(0, …)` kolumna
`1fr` nie potrafi zejść poniżej szerokości swojej zawartości, więc lista rozwijana z długą nazwą
kategorii mogłaby rozepchnąć siatkę.

`.results` ma `overflow-wrap: anywhere` przy `white-space: pre-wrap`, dzięki czemu długa wygenerowana
nazwa bez spacji łamie się w panelu zamiast z niego wystawać.

## Dane generatora

Główna tablica danych to `DATA`.

Każdy element `DATA` ma strukturę:

```js
{
  key: "klucz_kategorii",
  name: "Nazwa PL",
  nameEn: "Name EN",
  options: [
    {
      key: "klucz_opcji",
      name: "Opcja PL",
      nameEn: "Option EN",
      gen: (r) => funkcjaGeneratora(r)
    }
  ]
}
```

Aktualne kategorie:

| `key` | Nazwa PL | Nazwa EN |
| --- | --- | --- |
| `humans` | `Imperium – Ludzie` | `Imperium - Humans` |
| `aeldari` | `Aeldari` | `Aeldari` |
| `necron` | `Necroni` | `Necrons` |
| `orks` | `Orkowie` | `Orks` |
| `sororitas` | `Adepta Sororitas` | `Adepta Sororitas` |
| `astartes` | `Astartes – imię i nazwisko bojowe` | `Astartes - battle name and surname` |
| `admech` | `Adeptus Mechanicus` | `Adeptus Mechanicus` |
| `chaos` | `Chaos` | `Chaos` |
| `warmachines` | `Maszyny bojowe (Imperium)` | `War machines (Imperium)` |
| `ships` | `Okręty gwiezdne` | `Starships` |
| `unitcodes` | `Kryptonimy oddziałów` | `Unit codenames` |
| `opcodes` | `Kryptonimy operacji` | `Operation codenames` |

### Opcje i widok domyślny

Kolejność elementów w `DATA` i w `options` jest kolejnością na listach rozwijanych. Po otwarciu strony
wybrana jest pierwsza kategoria (`humans`) i jej pierwsza opcja, czyli `lower` („Klasa Niższa”).

| Kategoria | Opcje w kolejności (`key` → funkcja) |
| --- | --- |
| `humans` | `lower` → `genHumanLower`, `upper` → `genHumanUpper` |
| `aeldari` | `craft` → `genAeldariCraft`, `druk` → `genAeldariDrukhari`, `har` → `genAeldariHarlequin` |
| `necron` | `warrior` → `genNecronWarrior`, `lord` → `genNecronLord` |
| `orks` | `boy` → `genOrk` |
| `sororitas` | `sister` → `genSororitas` |
| `astartes` | `standard` → `genAstartes` |
| `admech` | `tp` → `genAdMechTech`, `skit` → `genAdMechSkit` |
| `chaos` | `und`, `kho`, `nur`, `tze`, `sla` → `genChaos(r, "undiv" / "khorne" / "nurgle" / "tzeent" / "slaan")` |
| `warmachines` | `tank`, `titan`, `knight`, `air` → `genWarMachine(r, kind)` |
| `ships` | `imp`, `ast`, `mec`, `eld`, `drk`, `ork`, `nec`, `cha` → `genShip(r, "imperial" / "astartes" / "mechanicus" / "eldar" / "drukhari" / "ork" / "necron" / "chaos")` |
| `unitcodes` | `standard` → `genUnitCodename` |
| `opcodes` | `standard` → `genOperationCodename` |

## RNG i seed

Moduł ma dwa tryby losowania.

### Losowanie z seedem

Jeżeli `#seed` zawiera niepusty tekst:

1. `makeRng(seedStr)` przycina tekst przez `trim()`.
2. `xfnv1a()` zamienia tekst na 32-bitowy seed.
3. `mulberry32()` tworzy deterministyczną funkcję losującą.
4. Funkcja zwraca `{ rand, mode: "seed" }`.

Efekt: ten sam seed i te same ustawienia zwracają tę samą sekwencję wyników.

### Losowanie bez seeda

Jeżeli `#seed` jest puste:

1. `makeRng()` używa `cryptoRand`.
2. `cryptoRand()` pobiera losową wartość przez `crypto.getRandomValues`.
3. Funkcja zwraca `{ rand: cryptoRand, mode: "auto" }`.

Efekt: wynik nie jest deterministyczny.

## Najważniejsze funkcje pomocnicze

| Funkcja | Rola |
| --- | --- |
| `xfnv1a(str)` | Tworzy 32-bitowy hash tekstu seeda. |
| `mulberry32(a)` | Tworzy deterministyczny generator liczb pseudolosowych. |
| `cryptoRand()` | Zwraca losową wartość z `crypto.getRandomValues`. |
| `makeRng(seedStr)` | Wybiera RNG seedowany albo automatyczny. |
| `chance(p, rand)` | Zwraca prawdę z prawdopodobieństwem `p`. |
| `cap(s)` | Zmienia pierwszą literę tekstu na wielką. |
| `cleanName(s)` | Usuwa proste cudzysłowy `"`, nawiasy, nadmiar spacji i błędne odstępy. Polskie cudzysłowy `„”` zostają. |
| `pick(arr, rand)` | Losuje element tablicy bez wag. |
| `pickItem(arr, rand)` | Losuje z wagami i zwraca cały element (tekst albo obiekt `{ v, w, g }`). |
| `pickWeighted(arr, rand)` | Jak `pickItem`, ale zwraca sam tekst (`item.v` albo napis). |
| `rollInt(min, max, rand)` | Losuje liczbę całkowitą z zakresu domkniętego. |
| `isVowel(ch)` | Sprawdza, czy znak jest samogłoską. |
| `tidySegmentBoundary(a, b)` | Wygładza styk segmentów sylabowych (podwójna litera, zlane identyczne samogłoski). |
| `phoneticPolish(s)` | Skraca potrójne litery i podwójne samogłoski powstałe przy sklejaniu sylab. |
| `buildName(parts)` | Składa jedno słowo z segmentów sylabowych i wygładza granice. Nie jest używana dla angielskich złożeń. |
| `compoundWord(a, b, forceHyphen)` | Skleja przydomek `Iron` + `blade` → `Ironblade`. Myślnik pojawia się, gdy styk powtarza literę (`Shadow-whisper`), gdy pierwszy człon zaczyna się apostrofem (`'Ead-basha`) albo przy `forceHyphen`. |
| `normalizeForCheck(s)` | Tekst do porównań: małe litery, `ł` → `l`, bez diakrytyków, bez apostrofów i cudzysłowów, myślnik → spacja. |
| `sameRoot(a, b)` | Porównuje pierwsze 4 litery po normalizacji (np. `Świt` i `Świtu`). |
| `pickDifferentRoot(list, head, rand)` | Losuje dopełniacz o innym rdzeniu niż rzeczownik główny (do 8 prób). |
| `looksGood(s)` | Odrzuca wynik krótszy niż 3 znaki, z 7+ spółgłoskami z rzędu, potrójną samogłoską, `--`, `''`, podwójną spacją, słowem dłuższym niż 16 liter albo dwoma identycznymi słowami obok siebie. |
| `buildReservedIndex(list)` | Zamienia listę nazw zastrzeżonych na tablice słów po normalizacji. |
| `isReserved(name, index)` | Zwraca prawdę, jeśli nazwa zawiera całą zastrzeżoną sekwencję słów w tej samej kolejności. |
| `tryGenerate(fn, reservedIndex, tries)` | Do 30 prób: pomija wyniki puste i zastrzeżone, zwraca pierwszy, który przechodzi `looksGood`; w ostateczności pierwszy niezastrzeżony. |
| `formatNamedThing(classifier, core)` | Tworzy format `Klasyfikator „Nazwa”`. |
| `genderIndex(g)` | Zamienia rodzaj `m` / `f` / `n` na indeks formy przymiotnika `0` / `1` / `2`. |
| `latinPhrase(rand, nouns, genitives)` | Łacińska para mianownik + dopełniacz o różnych rdzeniach (`Ira Imperatoris`). |
| `polishPhrase(rand)` | Polska nazwa niskogotycka: 38% rzeczownik + dopełniacz, 40% przymiotnik + rzeczownik, 10% sam rzeczownik, 12% przymiotnik + rzeczownik + dopełniacz. |
| `syllableOk(word)` | Odrzuca słowo sylabowe z 3 samogłoskami `aeiou` z rzędu albo z powtórzoną zbitką 2+ liter (`Karkar`, `Lili`). |
| `syllableWord(pool, rand, midChance, secondMidChance)` | Składa słowo z `pool.pre` + opcjonalnie 1–2 × `pool.mid` + `pool.end`; do 12 prób, aż przejdzie `syllableOk`. |
| `epithet(preList, sufList, rand)` | Angielski przydomek z dwóch list; ponawia losowanie, gdy drugi człon zaczyna się od pierwszego (`Twist` + `twister`). |
| `mechDesignation(rand, excludeAlpha)` | Oznaczenie `Litera-liczba` (np. `Theta-7`); dla Skitarii bez `Alpha`. |

## Budowa nazw

### Zasada ogólna

Generatory zwracają wyłącznie nazwy własne. Nie dodają tytułów, stopni, funkcji ani zawodów (np. `Lord`,
`Brat Sierżant`, `Magos`, `Brygadzista`, `Siostra`, `Overlord`, `Nob`, `Czempion`). Numery i liczby
rzymskie występują tylko tam, gdzie należą do konwencji frakcji (Adeptus Mechanicus, znaczniki
kryptonimów operacji). Każdy generator osób i kryptonimów jest owinięty w `tryGenerate`, więc wynik
przechodzi filtr nazw zastrzeżonych i ocenę jakości.

Konwencje zostały dobrane na podstawie lore Warhammer 40,000 i porównania z publicznymi generatorami
nazw (Fantasy Name Generators, The Story Shack, Name Generator Central, Heresy & Heroes).

### Łączenie sylab

`syllableWord` jest używana przez Aeldari, Necronów, Orków, Chaos i Mechanicus. Pula bez flagi
`softVowels` usuwa pierwszą samogłoskę kolejnego segmentu, jeśli poprzedni kończy się samogłoską
(`Sau` + `okh` → `Saukh`). Flagę `softVowels: true` mają pule `AELDARI.craft`, `AELDARI.drukh`,
`AELDARI.harl`, `CHAOS.tzeent` i `CHAOS.slaan`, bo ich brzmienie opiera się na dwugłoskach (`ae`, `ia`).

### Ludzie – klasa niższa (`HUMAN_LOWER`, `genHumanLower`)

Styl wybierany z wagami `styles`:

| Styl | Waga | Budowa | Przykład |
| --- | --- | --- | --- |
| `hive` | 42 | `hiveGiven` + `hiveSurname` | `Dagg Kerrow` |
| `latin` | 13 | `latinGiven` + `hiveSurname` | `Quint Haskin` |
| `slavic` | 14 | imię męskie/żeńskie (35% żeńskie) + nazwisko; żeńskie nazwiska na `-ov/-ev/-in` dostają `a`; 25% z otczestwem | `Ilya Mikhailovich Morozov`, `Darya Zharkova` |
| `desert` | 10 | imię + nazwisko albo (30%) `ibn` / `bint` + imię ojca | `Malik Sahir`, `Amira bint Tarik` |
| `celtic` | 10 | `celticGiven` + `celticSurname` | `Niall Dorran` |
| `mono` | 6 | jedno krótkie imię z `mono` | `Slade` |
| `hiveSingle` | 5 | samo imię z `hiveGiven` | `Dunn` |

### Ludzie – klasa wyższa (`HUMAN_UPPER`, `genHumanUpper`)

Płeć imienia losowana 50/50 (`givenM` / `givenF`). Style: `plain` 45 (imię + nazwisko), `doubleGiven`
20 (dwa imiona tej samej płci + nazwisko), `particle` 20 (imię + `von` / `van` / `de` / `du` / `del` +
nazwisko), `doubleBarrel` 15 (imię + `Nazwisko-Nazwisko`, dwa różne człony).

### Adepta Sororitas (`SORORITAS`, `genSororitas`)

78% imię + nazwisko, 22% samo imię. Imiona zlatynizowane i świętych, nazwiska gotyckie o wydźwięku cnoty
lub cierpienia.

### Astartes (`ASTARTES`, `genAstartes`)

| Styl | Waga | Budowa |
| --- | --- | --- |
| `codex` | 45 | 65% imię + łaciński przydomek, 20% imię + gotycki przydomek (`gothicPre` + `gothicSuf`), 15% samo imię |
| `angelic` | 14 | 35% samo imię anielskie, 65% imię + łaciński przydomek |
| `nordic` | 13 | 25% samo imię, 75% imię + przydomek (`nordicPre` + `nordicSuf`) |
| `crusader` | 10 | 60% samo imię, 40% imię + gotycki przydomek |
| `salamander` | 9 | 45% imię z apostrofem (`A'b`), 30% imię z apostrofem + nazwisko, 25% imię + nazwisko |
| `scars` | 9 | 40% samo imię, 60% imię + nazwa klanu |

### Adeptus Mechanicus (`MECH`)

`genAdMechTech` – style `techStyles`: `givenCogn` 30 (imię + techno-łaciński przydomek), `givenGreek` 20
(imię + `Litera-liczba`), `givenNumCogn` 15 (`Imię-liczba Przydomek`), `proc` 20 (jedno słowo sylabowe),
`procGreek` 15 (słowo sylabowe + litera grecka albo `Litera-liczba`).

`genAdMechSkit` – style `skitStyles`: `greekNum` 30 (`Litera-liczba`, 40% z liczebnikiem łacińskim lub
rzymskim), `givenNumCogn` 30, `givenGreek` 25 (`Imię-Litera`, 50% z liczbą), `givenCogn` 15. Skitarii nie
dostają litery `Alpha`, aby oznaczenie nie przypominało stopnia „Alpha”.

### Aeldari (`AELDARI`)

- `genAeldariCraft`: 55% jedno imię, 20% dwa imiona sylabowe, 25% imię + przydomek (`epiPre` + `epiSuf`).
- `genAeldariDrukhari`: 50% imię + nazwisko rodowe, 28% samo imię, 12% `Imię-Człon` (`hyphenTail`),
  10% `Przedrostek'Imię` (`apostrophePre`).
- `genAeldariHarlequin`: 55% imię + teatralny przydomek, 25% samo imię, 20% dwa imiona.

### Necroni (`NECRON`)

- `genNecronWarrior`: `pre` + `end`, 15% z sylabą środkową.
- `genNecronLord`: 12% forma z apostrofem (`Pre+mid'end`), 15% imię + `z` + nazwa świata-grobowca
  (`pre` + `mid` + `placeEnd`, forma nieodmieniana), reszta imię 3-sylabowe.

### Orkowie (`ORK`, `genOrk`)

Style: `single` 45 (imię sylabowe), `epithet` 40 (imię + przydomek), `epithetOnly` 15 (sam przydomek).
Przydomek to `epiPre` + `epiSuf`, w 35% z myślnikiem (`Doom-burna`).

### Chaos (`CHAOS`, `genChaos`)

Każde bóstwo ma własne `pre`, `mid`, `end`, `epiPre`, `epiSuf`. Rozkład: 40% samo imię, 20% dwa słowa
sylabowe, 40% imię + przydomek (`Hexflayer`, `Plaguemother`, `Bloodhewer`).

### Maszyny bojowe (`WAR`, `PL`, `LATIN`, `genWarMachine`)

Wynik: `Klasyfikator „Nazwa”`. `WAR[kind].classifiers` zawiera typ i wzór (np. `Czołg superciężki
Baneblade`, `Kanonierka Valkyrie`, `Armiger Warglaive`). Nazwa jest łacińska z prawdopodobieństwem
`latinChance` (czołgi 0,2; tytany 0,6; rycerze 0,35; lotnictwo 0,25), w przeciwnym razie polska
(`polishPhrase`). Polskie przymiotniki mają trzy formy `[m, f, n]`, a rzeczowniki pole `g`, dzięki czemu
powstają formy zgodne gramatycznie (`Nieugięta Tarcza`, `Krwawe Proroctwo`). Filtr nazw zastrzeżonych
sprawdza tylko nazwę w cudzysłowie, a nie klasyfikator (`Rogal Dorn` jest nazwą podwozia).

### Okręty (`SHIP`, `genShip`)

Każda frakcja ma `patterns` z wagami i słowniki `adj`, `noun`, `head`, `of`, `owner`, `single`,
`compoundPre`, `compoundSuf`, `pairA`, `pairB`, `latinNouns`, `latinGenitives` (tylko potrzebne).

| Wzorzec | Wynik |
| --- | --- |
| `latin` | `latinPhrase` (`Gloria Terrae`) |
| `mechLatin` | `latinPhrase` ze słownikami Mechanicus (`Machina Veritatis`) |
| `adjNoun` | `Relentless Vigil` |
| `nounOf` | `Hammer of the Saints` |
| `possessive` | `Emperor's Hammer` |
| `single` | `Indefatigable` |
| `compound` | `Starwhisper` |
| `da` | `Da Big Kroozer` |
| `nounOfNecron` | `Scythe of Nephtar` (50% nazwa sylabowa Necronów, 50% `of`) |
| `necronPossessive` | `Sekhmar's Reaping` |
| `pair` | `Malice Gauntlet` albo `Gauntlet of Malice` |

### Kryptonimy oddziałów (`UNIT`, `genUnitCodename`)

35% rzeczownik męskoosobowy (`persons`), 65% niemęskoosobowy (`things`). Wzorce: `adjNoun` 55 (przymiotnik
w formie `[niemęskoosobowa, męskoosobowa]` → `Żelazne Ostrza`, `Żelaźni Bracia`), `nounGen` 30 (`Kruki
Popiołu`), `nounGreek` 15 (`Wilki Sigma`).

### Kryptonimy operacji (`OPERATION`, `genOperationCodename`)

`Przedrostek` + fraza + opcjonalny znacznik (`tags`, pusty z wagą 10). Wzorce: `adjNoun` 50 (przymiotnik
zgodny z rodzajem: `Czarny Świt`, `Martwa Cisza`, `Upadłe Słońce`), `noun` 18, `nounGen` 22 (dopełniacze z
`UNIT.genitives`), `pair` 10 (`Młot i Kowadło`).

## Nazwy zastrzeżone

`RESERVED_PERSON_NAMES` zawiera imiona unikatowych postaci z lore (Imperium, Sororitas, prymarchowie i
Astartes, Mechanicus, Aeldari, Necroni i C'tan, Orkowie, Chaos, imiona bóstw). `RESERVED_VESSEL_NAMES`
zawiera nazwy okrętów i maszyn z lore (np. `Vengeful Spirit`, `Fortress of Arrogance`, `Dies Irae`).

Zasada: wpis wielowyrazowy blokuje tylko całą kombinację (`Sebastian Yarrick` jest zablokowany,
`Sebastian Varro` i samo `Yarrick` są dozwolone). Wpis jednowyrazowy oznacza postać znaną pod jednym
imieniem (`Imotekh`, `Ghazghkull`, `Drazhar`) i blokuje to słowo w każdej pozycji. Porównanie odbywa się
po `normalizeForCheck`, więc `Khârn`, `Kharn` i `KHARN` są traktowane tak samo, a `Kelbor-Hal` odpowiada
`Kelbor Hal`.

Generatory osób używają `RESERVED_PERSON_INDEX`. Maszyny, okręty i kryptonimy używają
`RESERVED_VESSEL_INDEX` (okręt może nosić imię bóstwa, np. `Tear of Lileath`).

Aby zablokować kolejną nazwę, dopisz ją do odpowiedniej tablicy. Indeksy budują się przy starcie skryptu.

## Warstwa i18n

Obiekt `translations` ma klucze:

```js
translations.pl
translations.en
```

Każdy język zawiera `labels`, między innymi:

- `languageSelect`,
- `category`,
- `option`,
- `seed`,
- `count`,
- `generate`,
- `copy`,
- `randomAuto`,
- `randomSeed`,
- `resultsPlaceholder`,
- `seedHint`,
- `seedPlaceholder`,
- `copiedSuffix`,
- `copyError`.

Funkcja `applyLanguage(lang)`:

1. ustawia `currentLanguage`,
2. ustawia `document.documentElement.lang`,
3. aktualizuje etykiety pól,
4. aktualizuje przyciski,
5. aktualizuje placeholder seeda,
6. aktualizuje tekst podpowiedzi,
7. odtwarza listę kategorii i opcji w aktualnym języku,
8. zachowuje wybraną kategorię i opcję, o ile nadal istnieją.

## Obsługa UI

### `populateCats()`

Czyści `#cat` i tworzy elementy `option` na podstawie tablicy `DATA`.

Tekst opcji pochodzi z `getLocalizedName`.

### `populateOpts()`

Znajduje aktualną kategorię i tworzy listę opcji w `#opt`.

Jeżeli aktualna kategoria nie zostanie znaleziona, używa pierwszej kategorii z `DATA`.

### `generate()`

Przebieg:

1. Znajduje wybraną kategorię.
2. Znajduje wybraną opcję.
3. Tworzy RNG przez `makeRng(seedEl.value)`.
4. Ustawia `#modePill` na `randomAuto` albo `randomSeed`.
5. Parsuje pole `#count`.
6. Wyznacza liczbę wyników przez `clampCount(countEl.value)` (zakres `1..50`) i wpisuje ją z powrotem do `#count`.
7. Dla każdej z `n` pozycji wywołuje `opt.gen(rand)` do 12 razy, aż otrzyma nazwę, której nie ma jeszcze
   na liście (porównanie bez rozróżniania wielkości liter przez zbiór `seen`).
8. Czyści każdą nazwę przez `cleanName`.
9. Renderuje wyniki w `#res` jako tekst rozdzielony `\n`, każda linia z prefiksem `• `.
10. Ustawia `resEl.dataset.hasResults = "true"`.

Ponieważ ponowne próby zużywają kolejne liczby z tego samego `rand`, lista z seedem nadal jest w pełni
powtarzalna.

### Pole liczby wyników

Stałe `MIN_COUNT = 1` i `MAX_COUNT = 50` muszą zgadzać się z atrybutami `min` / `max` pola `#count` w
`index.html`. Funkcja `clampCount(value)` zamienia wartość na `Math.floor(Number(value))` (dzięki temu
wklejone `1e3` daje 1000), zwraca 1 dla pustej, niepoprawnej lub mniejszej niż 1 wartości i 50 dla
większej niż 50. Atrybut `max` ogranicza strzałki i kółko myszy, a listenery `keydown`, `input` i `change`
blokują ręczne wpisanie większej liczby.

### Kopiowanie

Listener przycisku `#copy`:

1. wywołuje `navigator.clipboard.writeText(resEl.textContent)`,
2. po sukcesie dopisuje do `#modePill` komunikat `skopiowano` / `copied`,
3. po `900 ms` przywraca poprzedni tekst,
4. po błędzie pokazuje `alert` z komunikatem `copyError`.

## Event listenery

| Element | Zdarzenie | Reakcja |
| --- | --- | --- |
| `#gen` | `click` | Uruchamia `generate()`. |
| `#copy` | `click` | Kopiuje wyniki do schowka. |
| `#cat` | `change` | Odświeża opcje i generuje wynik. |
| `#opt` | `change` | Generuje wynik. |
| `#count` | `keydown` | Blokuje `e`, `E`, `+`, `-`, `.`, `,`. |
| `#count` | `input` | Wartość powyżej 50, ułamkowa albo z zerami wiodącymi jest od razu poprawiana przez `clampCount`; puste pole jest dozwolone podczas wpisywania. |
| `#count` | `change` | Po opuszczeniu pola ustawia `clampCount(value)`, więc puste pole lub 0 daje 1. |
| `#languageSelect` | `change` | Zmienia język i generuje wynik. |

## Inicjalizacja

Na końcu `script.js` wykonywane są kroki:

1. `populateCats()`,
2. `populateOpts()`,
3. ustawienie `resEl.dataset.hasResults = "false"`,
4. `applyLanguage(currentLanguage)`,
5. podpięcie listenera zmiany języka.

Początkowy język to:

```js
let currentLanguage = "pl";
```

## Fallbacki i błędy

| Sytuacja | Zachowanie |
| --- | --- |
| Puste pole `Seed` | Używany jest tryb `auto` z `crypto.getRandomValues`. |
| Nieprawidłowa liczba wyników | Wartość jest sprowadzana do minimum 1. |
| Liczba wyników większa niż 50 | Pole od razu pokazuje 50, a moduł generuje 50 wyników. |
| Puste pole `Ile` albo 0 | Po opuszczeniu pola albo kliknięciu `Generuj` wartość zmienia się na 1. |
| Brak dostępu do schowka | Pokazywany jest `alert` z komunikatem o ręcznym kopiowaniu. |
| Brak wcześniejszych wyników | Pole wyników pokazuje placeholder. |

## Procedura odtworzenia modułu

1. Utwórz `GeneratorNazw/index.html`.
2. Dodaj panel `.panel` w kontenerze `.wrap`.
3. Dodaj ukryty `.language-switcher` z `#languageSelect`.
4. Dodaj pola `#cat`, `#opt`, `#seed`, `#count`.
5. Dodaj przyciski `#gen` i `#copy`.
6. Dodaj znacznik `#modePill`.
7. Dodaj kontener wyników `#res` i podpowiedź `#seedHint`.
8. Utwórz `style.css` z motywem terminalowym, gridem i responsywnością.
9. Utwórz `script.js`.
10. Zaimplementuj RNG: `xfnv1a`, `mulberry32`, `cryptoRand`, `makeRng`.
11. Zaimplementuj helpery czyszczenia, losowania i składania nazw (tabela „Najważniejsze funkcje
    pomocnicze”).
12. Odtwórz `RESERVED_PERSON_NAMES`, `RESERVED_VESSEL_NAMES`, `buildReservedIndex`, `isReserved` i
    `tryGenerate`.
13. Odtwórz słowniki `HUMAN_LOWER`, `HUMAN_UPPER`, `SORORITAS`, `ASTARTES`, `MECH`, `AELDARI`, `NECRON`,
    `ORK`, `CHAOS`, `PL`, `LATIN`, `WAR`, `SHIP`, `UNIT`, `OPERATION` oraz funkcje generatorów według
    sekcji „Budowa nazw”.
14. Odtwórz `DATA` z kategoriami i opcjami w kolejności z sekcji „Opcje i widok domyślny”.
15. Odtwórz obiekt `translations`.
16. Podłącz event listenery.
17. Sprawdź generowanie bez seeda, z seedem, zmianę kategorii, zmianę opcji i kopiowanie.

## Testy kontrolne

| Test | Kroki | Oczekiwany wynik |
| --- | --- | --- |
| Start modułu | Otwórz `GeneratorNazw/index.html`. | Widoczny jest panel generatora i placeholder wyników. Wybrane są `Imperium – Ludzie` i `Klasa Niższa`. |
| Brak tytułów | Wygeneruj po 20 nazw w każdej opcji kategorii osób. | Żadna nazwa nie zaczyna się tytułem, stopniem ani zawodem. |
| Klasa niższa bez numerów | Wygeneruj 20 nazw `Klasa Niższa`. | Brak cyfr, liczb rzymskich i końcówek typu `-X`. |
| Nazwy zastrzeżone | W konsoli: `isReserved("Sebastian Yarrick", RESERVED_PERSON_INDEX)` oraz `isReserved("Sebastian Varro", RESERVED_PERSON_INDEX)`. | `true` i `false`. |
| Brak powtórzeń | Wygeneruj 20 nazw w dowolnej opcji. | Każda linia jest inna. |
| Maszyny | Wybierz `Maszyny bojowe (Imperium)`. | Każda linia ma format `Klasyfikator „Nazwa”`. |
| Generowanie bez seeda | Zostaw `Seed` puste i kliknij `Generuj`. | Pojawia się lista nazw, `modePill` pokazuje tryb losowy. |
| Generowanie z seedem | Wpisz seed, ustaw kategorię i kliknij `Generuj`. | Pojawia się powtarzalna lista nazw. |
| Powtarzalność seeda | Użyj tego samego seeda i ustawień po odświeżeniu strony. | Lista wyników jest taka sama. |
| Limit wyników | Wpisz w `Ile` wartość `99`. | Pole natychmiast pokazuje `50`; `Generuj` tworzy 50 różnych nazw. |
| Znaki niedozwolone | Spróbuj wpisać `e`, `-`, `+`, `.` albo `,` w `Ile`. | Znak się nie pojawia. |
| Zmiana kategorii | Zmień `Kategoria`. | Lista `Opcja` zmienia się i wyniki są generowane ponownie. |
| Kopiowanie | Kliknij `Kopiuj wynik`. | Wyniki trafiają do schowka albo pojawia się komunikat błędu przeglądarki. |
| Ukryty język | Otwórz moduł. | Przełącznik języka nie jest widoczny, bo działa klasa `language-switcher--hidden`. |

---

# 🇬🇧 Technical documentation — Name Generator (EN)

## Module purpose

`GeneratorNazw` is a static frontend module that generates Warhammer 40,000-style names.

The module is responsible for:

- displaying the category and option form,
- generating name lists from given-name, syllable, and phrase dictionaries matched to faction conventions,
- rejecting names reserved for unique lore characters and ships,
- handling normal random generation and repeatable seeded generation,
- rendering results as a text list,
- copying results to the clipboard,
- basic PL/EN support in code.

The module has no backend, does not use Firebase, and does not save user data.

## Entry points

Main module file:

```text
GeneratorNazw/index.html
```

The file loads:

```html
<link rel="stylesheet" href="style.css" />
<script src="script.js"></script>
```

## Operating modes

The module has one user mode.

It does not have:

- admin mode,
- login,
- state saving,
- data import,
- file export,
- Firebase integration.

The code contains a `#languageSelect` language selector, but its container has the `language-switcher--hidden` class, so the selector is hidden in the interface.

## File structure

| File | Role |
| --- | --- |
| `GeneratorNazw/index.html` | Interface structure: form, buttons, results area, hidden language selector. |
| `GeneratorNazw/style.css` | Terminal theme, form layout, field, button, and result styles. |
| `GeneratorNazw/script.js` | RNG, name dictionaries, reserved-name lists, name generator functions, UI wiring, and copying. |
| `GeneratorNazw/docs/README.md` | PL/EN user guide. |
| `GeneratorNazw/docs/Documentation.md` | This PL/EN technical documentation. |

## Dependencies

The module uses only standard browser APIs:

- DOM API,
- `crypto.getRandomValues`,
- `navigator.clipboard`,
- `setTimeout`.

The module does not use:

- Firebase,
- Firestore,
- Realtime Database,
- SheetJS,
- JSZip,
- external frameworks,
- `localStorage`,
- `sessionStorage`.

## HTML structure

Main container:

```html
<main class="wrap">
  <section class="panel">
    ...
  </section>
</main>
```

Important DOM elements:

| Element | Role |
| --- | --- |
| `.wrap` | Outer page-width container. |
| `.panel` | Main generator card. |
| `.language-switcher.language-switcher--hidden` | Hidden language switcher container. |
| `#languageSelect` | Language selector, currently hidden by CSS. |
| `.grid` | Form field grid. |
| `#cat` | Category select. |
| `#opt` | Option select depending on category. |
| `#seed` | Seed input. |
| `#count` | Result count: `type="number"`, `min=1`, `max=50`, `step=1`, `inputmode="numeric"`, starting value `10`. The script does not allow entering more than 50 (section "Result count field"). |
| `#gen` | Generate button. |
| `#copy` | Copy result button. |
| `#modePill` | Random mode indicator. |
| `#res` | Result container. |
| `#seedHint` | Seed explanation hint. |

### The grid and results on a narrow screen

`.grid` uses `minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr) 140px`. Without `minmax(0, …)` a `1fr`
column cannot go below the width of its content, so a select holding a long category name could
stretch the grid.

`.results` has `overflow-wrap: anywhere` alongside `white-space: pre-wrap`, so a long generated name
without spaces wraps inside the panel instead of spilling out of it.

## CSS structure

### Theme variables

Defined in `:root`:

| Variable | Meaning |
| --- | --- |
| `--bg` | Dark green base background. |
| `--bg-grad` | Background with radial glow effects. |
| `--panel` | Black panel background. |
| `--panel-soft` | Semi-transparent green field/button background. |
| `--text` | Main text color. |
| `--muted` | Muted helper text. |
| `--border` | Green borders. |
| `--accent` | Main accent. |
| `--accent-dark` | Darker focus accent. |
| `--glow` | Green panel glow. |
| `--divider` | Divider color. |

### Fonts

Global font stack:

```text
"Consolas", "Fira Code", "Source Code Pro", monospace
```

### Layout

Important rules:

- `body` uses `--bg-grad`, `--text`, `line-height: 1.45`, and slight `letter-spacing`.
- `.wrap` uses `width: min(1100px, 100%)`, centered margin, and padding.
- `.panel` uses black background, green border, `12px` radius, and `--glow`.
- `.grid` uses `1.2fr 1fr 1fr 140px`.
- At widths up to `960px`, `.grid` switches to one column.
- `.row` lays out buttons and the mode indicator in a flexible row.
- `.results` uses `white-space: pre-wrap` to preserve line breaks.

### Hidden language selector

The language selector is hidden by:

```css
.language-switcher--hidden {
  display: none !important;
}
```

Removing the `language-switcher--hidden` class from the
`<div class="language-switcher language-switcher--hidden">` container in `GeneratorNazw/index.html`
reveals the selector again. The CSS rule can stay, because without the class it has nothing to act
on. A comment marked `LANGUAGE SWITCHER VISIBILITY CHANGE POINT` sits above the element.

## Generator data

The main data table is `DATA`.

Each `DATA` item has this structure:

```js
{
  key: "category_key",
  name: "Polish name",
  nameEn: "English name",
  options: [
    {
      key: "option_key",
      name: "Polish option",
      nameEn: "English option",
      gen: (r) => generatorFunction(r)
    }
  ]
}
```

Current categories:

| `key` | PL name | EN name |
| --- | --- | --- |
| `humans` | `Imperium – Ludzie` | `Imperium - Humans` |
| `aeldari` | `Aeldari` | `Aeldari` |
| `necron` | `Necroni` | `Necrons` |
| `orks` | `Orkowie` | `Orks` |
| `sororitas` | `Adepta Sororitas` | `Adepta Sororitas` |
| `astartes` | `Astartes – imię i nazwisko bojowe` | `Astartes - battle name and surname` |
| `admech` | `Adeptus Mechanicus` | `Adeptus Mechanicus` |
| `chaos` | `Chaos` | `Chaos` |
| `warmachines` | `Maszyny bojowe (Imperium)` | `War machines (Imperium)` |
| `ships` | `Okręty gwiezdne` | `Starships` |
| `unitcodes` | `Kryptonimy oddziałów` | `Unit codenames` |
| `opcodes` | `Kryptonimy operacji` | `Operation codenames` |

### Options and the default view

The order of items in `DATA` and in `options` is the order in the dropdowns. When the page opens, the
first category (`humans`) and its first option are selected, i.e. `lower` ("Klasa Niższa" / "Lower Class").

| Category | Options in order (`key` → function) |
| --- | --- |
| `humans` | `lower` → `genHumanLower`, `upper` → `genHumanUpper` |
| `aeldari` | `craft` → `genAeldariCraft`, `druk` → `genAeldariDrukhari`, `har` → `genAeldariHarlequin` |
| `necron` | `warrior` → `genNecronWarrior`, `lord` → `genNecronLord` |
| `orks` | `boy` → `genOrk` |
| `sororitas` | `sister` → `genSororitas` |
| `astartes` | `standard` → `genAstartes` |
| `admech` | `tp` → `genAdMechTech`, `skit` → `genAdMechSkit` |
| `chaos` | `und`, `kho`, `nur`, `tze`, `sla` → `genChaos(r, "undiv" / "khorne" / "nurgle" / "tzeent" / "slaan")` |
| `warmachines` | `tank`, `titan`, `knight`, `air` → `genWarMachine(r, kind)` |
| `ships` | `imp`, `ast`, `mec`, `eld`, `drk`, `ork`, `nec`, `cha` → `genShip(r, "imperial" / "astartes" / "mechanicus" / "eldar" / "drukhari" / "ork" / "necron" / "chaos")` |
| `unitcodes` | `standard` → `genUnitCodename` |
| `opcodes` | `standard` → `genOperationCodename` |

## RNG and seed

The module has two randomization modes.

### Seeded randomization

When `#seed` contains non-empty text:

1. `makeRng(seedStr)` trims the text.
2. `xfnv1a()` converts the text into a 32-bit seed.
3. `mulberry32()` creates a deterministic pseudorandom function.
4. The function returns `{ rand, mode: "seed" }`.

Result: the same seed and the same settings return the same result sequence.

### Randomization without seed

When `#seed` is empty:

1. `makeRng()` uses `cryptoRand`.
2. `cryptoRand()` reads a random value with `crypto.getRandomValues`.
3. The function returns `{ rand: cryptoRand, mode: "auto" }`.

Result: output is not deterministic.

## Important helper functions

| Function | Role |
| --- | --- |
| `xfnv1a(str)` | Creates a 32-bit hash from seed text. |
| `mulberry32(a)` | Creates a deterministic pseudorandom number generator. |
| `cryptoRand()` | Returns a random value from `crypto.getRandomValues`. |
| `makeRng(seedStr)` | Chooses seeded or automatic RNG. |
| `chance(p, rand)` | Returns true with probability `p`. |
| `cap(s)` | Capitalizes the first character. |
| `cleanName(s)` | Removes straight `"` quotes, parentheses, extra spaces, and wrong punctuation spacing. Polish `„”` quotes are kept. |
| `pick(arr, rand)` | Picks an array element without weights. |
| `pickItem(arr, rand)` | Weighted pick that returns the whole item (a string or a `{ v, w, g }` object). |
| `pickWeighted(arr, rand)` | Like `pickItem`, but returns only the text (`item.v` or the string). |
| `rollInt(min, max, rand)` | Returns an integer in an inclusive range. |
| `isVowel(ch)` | Checks whether a character is a vowel. |
| `tidySegmentBoundary(a, b)` | Smooths the joint of syllable segments (double letter, merged identical vowels). |
| `phoneticPolish(s)` | Shortens triple letters and double vowels created while joining syllables. |
| `buildName(parts)` | Builds one word from syllable segments and smooths joints. Not used for English compounds. |
| `compoundWord(a, b, forceHyphen)` | Joins an epithet `Iron` + `blade` → `Ironblade`. A hyphen appears when the joint repeats a letter (`Shadow-whisper`), when the first part starts with an apostrophe (`'Ead-basha`), or with `forceHyphen`. |
| `normalizeForCheck(s)` | Text for comparisons: lowercase, `ł` → `l`, no diacritics, no apostrophes or quotes, hyphen → space. |
| `sameRoot(a, b)` | Compares the first 4 letters after normalization (e.g. `Świt` and `Świtu`). |
| `pickDifferentRoot(list, head, rand)` | Picks a genitive with a different root than the head noun (up to 8 attempts). |
| `looksGood(s)` | Rejects results shorter than 3 characters, with 7+ consonants in a row, a triple vowel, `--`, `''`, a double space, a word longer than 16 letters, or two identical neighbouring words. |
| `buildReservedIndex(list)` | Turns a reserved-name list into normalized word arrays. |
| `isReserved(name, index)` | Returns true when the name contains a whole reserved word sequence in the same order. |
| `tryGenerate(fn, reservedIndex, tries)` | Up to 30 attempts: skips empty and reserved results, returns the first that passes `looksGood`; as a last resort the first non-reserved one. |
| `formatNamedThing(classifier, core)` | Creates the `Classifier „Name”` format. |
| `genderIndex(g)` | Maps gender `m` / `f` / `n` to adjective form index `0` / `1` / `2`. |
| `latinPhrase(rand, nouns, genitives)` | Latin nominative + genitive pair with different roots (`Ira Imperatoris`). |
| `polishPhrase(rand)` | Polish Low Gothic name: 38% noun + genitive, 40% adjective + noun, 10% noun alone, 12% adjective + noun + genitive. |
| `syllableOk(word)` | Rejects a syllabic word with 3 `aeiou` vowels in a row or a repeated 2+ letter chunk (`Karkar`, `Lili`). |
| `syllableWord(pool, rand, midChance, secondMidChance)` | Builds a word from `pool.pre` + optionally 1–2 × `pool.mid` + `pool.end`; up to 12 attempts until it passes `syllableOk`. |
| `epithet(preList, sufList, rand)` | English epithet from two lists; re-rolls when the second part starts with the first (`Twist` + `twister`). |
| `mechDesignation(rand, excludeAlpha)` | `Letter-number` designation (e.g. `Theta-7`); without `Alpha` for Skitarii. |

## Name construction

### General rule

Generators return proper names only. They add no titles, ranks, roles or jobs (e.g. `Lord`,
`Brother Sergeant`, `Magos`, `Foreman`, `Sister`, `Overlord`, `Nob`, `Champion`). Numbers and Roman numerals
appear only where they belong to the faction convention (Adeptus Mechanicus, operation codename tags).
Every person and codename generator is wrapped in `tryGenerate`, so each result passes the reserved-name
filter and the quality check.

The conventions follow Warhammer 40,000 lore and a comparison with public name generators (Fantasy Name
Generators, The Story Shack, Name Generator Central, Heresy & Heroes).

### Joining syllables

`syllableWord` is used by Aeldari, Necrons, Orks, Chaos, and Mechanicus. A pool without the `softVowels`
flag drops the first vowel of the next segment when the previous one ends with a vowel (`Sau` + `okh` →
`Saukh`). `softVowels: true` is set on `AELDARI.craft`, `AELDARI.drukh`, `AELDARI.harl`, `CHAOS.tzeent`,
and `CHAOS.slaan`, because their sound relies on diphthongs (`ae`, `ia`).

### Humans – lower class (`HUMAN_LOWER`, `genHumanLower`)

Style picked by the `styles` weights:

| Style | Weight | Structure | Example |
| --- | --- | --- | --- |
| `hive` | 42 | `hiveGiven` + `hiveSurname` | `Dagg Kerrow` |
| `latin` | 13 | `latinGiven` + `hiveSurname` | `Quint Haskin` |
| `slavic` | 14 | male/female given name (35% female) + surname; female surnames ending in `-ov/-ev/-in` get `a`; 25% with a patronymic | `Ilya Mikhailovich Morozov`, `Darya Zharkova` |
| `desert` | 10 | given name + surname, or (30%) `ibn` / `bint` + father's name | `Malik Sahir`, `Amira bint Tarik` |
| `celtic` | 10 | `celticGiven` + `celticSurname` | `Niall Dorran` |
| `mono` | 6 | one short name from `mono` | `Slade` |
| `hiveSingle` | 5 | given name from `hiveGiven` alone | `Dunn` |

### Humans – upper class (`HUMAN_UPPER`, `genHumanUpper`)

Given-name gender is 50/50 (`givenM` / `givenF`). Styles: `plain` 45 (given + surname), `doubleGiven` 20
(two given names of the same gender + surname), `particle` 20 (given + `von` / `van` / `de` / `du` / `del`
+ surname), `doubleBarrel` 15 (given + `Surname-Surname`, two different parts).

### Adepta Sororitas (`SORORITAS`, `genSororitas`)

78% given name + surname, 22% given name alone. Latinised and saintly given names, Gothic surnames
evoking virtue or suffering.

### Astartes (`ASTARTES`, `genAstartes`)

| Style | Weight | Structure |
| --- | --- | --- |
| `codex` | 45 | 65% given + Latin cognomen, 20% given + Gothic epithet (`gothicPre` + `gothicSuf`), 15% given alone |
| `angelic` | 14 | 35% angelic given name alone, 65% given + Latin cognomen |
| `nordic` | 13 | 25% given alone, 75% given + epithet (`nordicPre` + `nordicSuf`) |
| `crusader` | 10 | 60% given alone, 40% given + Gothic epithet |
| `salamander` | 9 | 45% apostrophe name (`A'b`), 30% apostrophe name + surname, 25% given + surname |
| `scars` | 9 | 40% given alone, 60% given + clan name |

### Adeptus Mechanicus (`MECH`)

`genAdMechTech` – `techStyles`: `givenCogn` 30 (given + techno-Latin cognomen), `givenGreek` 20 (given +
`Letter-number`), `givenNumCogn` 15 (`Given-number Cognomen`), `proc` 20 (one syllabic word), `procGreek` 15
(syllabic word + Greek letter or `Letter-number`).

`genAdMechSkit` – `skitStyles`: `greekNum` 30 (`Letter-number`, 40% with a Latin ordinal or Roman numeral),
`givenNumCogn` 30, `givenGreek` 25 (`Given-Letter`, 50% with a number), `givenCogn` 15. Skitarii never get
the letter `Alpha`, so a designation does not look like the "Alpha" rank.

### Aeldari (`AELDARI`)

- `genAeldariCraft`: 55% one name, 20% two syllabic names, 25% name + epithet (`epiPre` + `epiSuf`).
- `genAeldariDrukhari`: 50% given + house name, 28% single name, 12% `Name-Part` (`hyphenTail`),
  10% `Prefix'Name` (`apostrophePre`).
- `genAeldariHarlequin`: 55% name + theatrical epithet, 25% single name, 20% two names.

### Necrons (`NECRON`)

- `genNecronWarrior`: `pre` + `end`, 15% with a middle syllable.
- `genNecronLord`: 12% apostrophe form (`Pre+mid'end`), 15% name + `z` + tomb world name
  (`pre` + `mid` + `placeEnd`, undeclined), otherwise a 3-syllable name.

### Orks (`ORK`, `genOrk`)

Styles: `single` 45 (syllabic name), `epithet` 40 (name + epithet), `epithetOnly` 15 (epithet alone). The
epithet is `epiPre` + `epiSuf`, hyphenated in 35% of cases (`Doom-burna`).

### Chaos (`CHAOS`, `genChaos`)

Each god has its own `pre`, `mid`, `end`, `epiPre`, `epiSuf`. Distribution: 40% single name, 20% two
syllabic words, 40% name + epithet (`Hexflayer`, `Plaguemother`, `Bloodhewer`).

### War machines (`WAR`, `PL`, `LATIN`, `genWarMachine`)

Output: `Classifier „Name”`. `WAR[kind].classifiers` holds the type and pattern (e.g. `Czołg superciężki
Baneblade`, `Kanonierka Valkyrie`, `Armiger Warglaive`). The name is Latin with probability `latinChance`
(tanks 0.2, titans 0.6, knights 0.35, air 0.25), otherwise Polish (`polishPhrase`). Polish adjectives have
three forms `[m, f, n]` and nouns have a `g` field, which produces grammatically agreeing forms
(`Nieugięta Tarcza`, `Krwawe Proroctwo`). The reserved-name filter checks only the quoted name, not the
classifier (`Rogal Dorn` is a chassis name).

### Ships (`SHIP`, `genShip`)

Each faction has weighted `patterns` and word lists `adj`, `noun`, `head`, `of`, `owner`, `single`,
`compoundPre`, `compoundSuf`, `pairA`, `pairB`, `latinNouns`, `latinGenitives` (only those it needs).

| Pattern | Output |
| --- | --- |
| `latin` | `latinPhrase` (`Gloria Terrae`) |
| `mechLatin` | `latinPhrase` with Mechanicus lists (`Machina Veritatis`) |
| `adjNoun` | `Relentless Vigil` |
| `nounOf` | `Hammer of the Saints` |
| `possessive` | `Emperor's Hammer` |
| `single` | `Indefatigable` |
| `compound` | `Starwhisper` |
| `da` | `Da Big Kroozer` |
| `nounOfNecron` | `Scythe of Nephtar` (50% Necron syllabic name, 50% `of` list) |
| `necronPossessive` | `Sekhmar's Reaping` |
| `pair` | `Malice Gauntlet` or `Gauntlet of Malice` |

### Unit codenames (`UNIT`, `genUnitCodename`)

35% masculine-personal noun (`persons`), 65% non-personal noun (`things`). Patterns: `adjNoun` 55 (adjective
in form `[non-personal, masculine-personal]` → `Żelazne Ostrza`, `Żelaźni Bracia`), `nounGen` 30 (`Kruki
Popiołu`), `nounGreek` 15 (`Wilki Sigma`).

### Operation codenames (`OPERATION`, `genOperationCodename`)

`Prefix` + phrase + optional tag (`tags`, empty with weight 10). Patterns: `adjNoun` 50 (gender-agreeing
adjective: `Czarny Świt`, `Martwa Cisza`, `Upadłe Słońce`), `noun` 18, `nounGen` 22 (genitives from
`UNIT.genitives`), `pair` 10 (`Młot i Kowadło`).

## Reserved names

`RESERVED_PERSON_NAMES` holds the names of unique lore characters (Imperium, Sororitas, Primarchs and
Astartes, Mechanicus, Aeldari, Necrons and C'tan, Orks, Chaos, god names). `RESERVED_VESSEL_NAMES` holds
lore ship and war machine names (e.g. `Vengeful Spirit`, `Fortress of Arrogance`, `Dies Irae`).

Rule: a multi-word entry blocks only the whole combination (`Sebastian Yarrick` is blocked, while
`Sebastian Varro` and `Yarrick` alone are allowed). A single-word entry marks a character known by one name
(`Imotekh`, `Ghazghkull`, `Drazhar`) and blocks that word in any position. Comparison runs after
`normalizeForCheck`, so `Khârn`, `Kharn`, and `KHARN` are equal, and `Kelbor-Hal` matches `Kelbor Hal`.

Person generators use `RESERVED_PERSON_INDEX`. War machines, ships, and codenames use
`RESERVED_VESSEL_INDEX` (a ship may be named after a god, e.g. `Tear of Lileath`).

To block another name, add it to the matching array. The indexes are built when the script starts.

## i18n layer

The `translations` object has these keys:

```js
translations.pl
translations.en
```

Each language contains `labels`, including:

- `languageSelect`,
- `category`,
- `option`,
- `seed`,
- `count`,
- `generate`,
- `copy`,
- `randomAuto`,
- `randomSeed`,
- `resultsPlaceholder`,
- `seedHint`,
- `seedPlaceholder`,
- `copiedSuffix`,
- `copyError`.

`applyLanguage(lang)`:

1. sets `currentLanguage`,
2. sets `document.documentElement.lang`,
3. updates field labels,
4. updates buttons,
5. updates the seed placeholder,
6. updates the seed hint,
7. rebuilds the category and option lists in the active language,
8. preserves the selected category and option when still available.

## UI wiring

### `populateCats()`

Clears `#cat` and creates `option` elements from `DATA`.

Option text comes from `getLocalizedName`.

### `populateOpts()`

Finds the current category and creates the option list in `#opt`.

If the current category is not found, it uses the first category from `DATA`.

### `generate()`

Flow:

1. Finds the selected category.
2. Finds the selected option.
3. Creates RNG through `makeRng(seedEl.value)`.
4. Sets `#modePill` to `randomAuto` or `randomSeed`.
5. Parses `#count`.
6. Computes the result count with `clampCount(countEl.value)` (range `1..50`) and writes it back to `#count`.
7. For each of the `n` slots calls `opt.gen(rand)` up to 12 times until it gets a name that is not in the
   list yet (case-insensitive comparison through the `seen` set).
8. Cleans every name through `cleanName`.
9. Renders results in `#res` as text separated by `\n`, each line prefixed with `• `.
10. Sets `resEl.dataset.hasResults = "true"`.

Because retries consume further numbers from the same `rand`, a seeded list stays fully repeatable.

### Result count field

The constants `MIN_COUNT = 1` and `MAX_COUNT = 50` must match the `min` / `max` attributes of `#count` in
`index.html`. `clampCount(value)` converts the value with `Math.floor(Number(value))` (so a pasted `1e3`
becomes 1000), returns 1 for an empty, invalid, or below-1 value, and 50 for anything above 50. The `max`
attribute limits the arrow keys and mouse wheel, while the `keydown`, `input`, and `change` listeners block
typing a larger number by hand.

### Copying

The `#copy` listener:

1. calls `navigator.clipboard.writeText(resEl.textContent)`,
2. on success appends `skopiowano` / `copied` to `#modePill`,
3. after `900 ms` restores the previous text,
4. on error displays an `alert` with `copyError`.

## Event listeners

| Element | Event | Reaction |
| --- | --- | --- |
| `#gen` | `click` | Runs `generate()`. |
| `#copy` | `click` | Copies results to the clipboard. |
| `#cat` | `change` | Rebuilds options and generates a result. |
| `#opt` | `change` | Generates a result. |
| `#count` | `keydown` | Blocks `e`, `E`, `+`, `-`, `.`, `,`. |
| `#count` | `input` | A value above 50, a fraction, or leading zeros are corrected at once by `clampCount`; an empty field is allowed while typing. |
| `#count` | `change` | On leaving the field sets `clampCount(value)`, so an empty field or 0 becomes 1. |
| `#languageSelect` | `change` | Changes language and generates a result. |

## Initialization

At the end of `script.js`, the module runs:

1. `populateCats()`,
2. `populateOpts()`,
3. `resEl.dataset.hasResults = "false"`,
4. `applyLanguage(currentLanguage)`,
5. language change listener setup.

Initial language:

```js
let currentLanguage = "pl";
```

## Fallbacks and errors

| Situation | Behavior |
| --- | --- |
| Empty `Seed` field | Uses `auto` mode with `crypto.getRandomValues`. |
| Invalid result count | Value is reduced to minimum 1. |
| Result count greater than 50 | The field shows 50 immediately and the module generates 50 results. |
| Empty `How many` field or 0 | After leaving the field or clicking `Generate`, the value becomes 1. |
| Clipboard unavailable | Shows an `alert` with manual copy instructions. |
| No previous results | Result field shows the placeholder. |

## Module reconstruction procedure

1. Create `GeneratorNazw/index.html`.
2. Add `.panel` inside `.wrap`.
3. Add hidden `.language-switcher` with `#languageSelect`.
4. Add `#cat`, `#opt`, `#seed`, and `#count`.
5. Add `#gen` and `#copy`.
6. Add `#modePill`.
7. Add `#res` and `#seedHint`.
8. Create `style.css` with the terminal theme, grid, and responsive rules.
9. Create `script.js`.
10. Implement RNG: `xfnv1a`, `mulberry32`, `cryptoRand`, `makeRng`.
11. Implement helpers for cleaning, picking, and name composition (table "Important helper functions").
12. Recreate `RESERVED_PERSON_NAMES`, `RESERVED_VESSEL_NAMES`, `buildReservedIndex`, `isReserved`, and
    `tryGenerate`.
13. Recreate the `HUMAN_LOWER`, `HUMAN_UPPER`, `SORORITAS`, `ASTARTES`, `MECH`, `AELDARI`, `NECRON`, `ORK`,
    `CHAOS`, `PL`, `LATIN`, `WAR`, `SHIP`, `UNIT`, `OPERATION` dictionaries and the generator functions as
    described in "Name construction".
14. Recreate `DATA` with categories and options in the order from "Options and the default view".
15. Recreate the `translations` object.
16. Attach event listeners.
17. Test generation without seed, with seed, category changes, option changes, and copying.

## Control tests

| Test | Steps | Expected result |
| --- | --- | --- |
| Module start | Open `GeneratorNazw/index.html`. | Generator panel and result placeholder are visible. `Imperium – Ludzie` and `Klasa Niższa` are selected. |
| No titles | Generate 20 names in every option of the person categories. | No name starts with a title, rank, or job. |
| Lower class without numbers | Generate 20 `Klasa Niższa` names. | No digits, Roman numerals, or `-X` style endings. |
| Reserved names | In the console: `isReserved("Sebastian Yarrick", RESERVED_PERSON_INDEX)` and `isReserved("Sebastian Varro", RESERVED_PERSON_INDEX)`. | `true` and `false`. |
| No repeats | Generate 20 names in any option. | Every line is different. |
| War machines | Choose `Maszyny bojowe (Imperium)`. | Every line has the `Classifier „Name”` format. |
| Generate without seed | Leave `Seed` empty and click `Generate`. | A name list appears and `modePill` shows random mode. |
| Generate with seed | Enter a seed, choose settings, and click `Generate`. | A repeatable name list appears. |
| Seed repeatability | Use the same seed and settings after page refresh. | The result list is the same. |
| Result limit | Type `99` into `How many`. | The field immediately shows `50`; `Generate` creates 50 different names. |
| Disallowed characters | Try typing `e`, `-`, `+`, `.` or `,` into `How many`. | The character does not appear. |
| Category change | Change `Category`. | The `Option` list changes and results regenerate. |
| Copying | Click `Copy result`. | Results go to the clipboard or a browser error message appears. |
| Hidden language selector | Open the module. | The language selector is not visible because `language-switcher--hidden` is active. |

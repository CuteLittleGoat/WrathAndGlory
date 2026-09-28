// Plik logiki modułu: RNG, dane nazw, generatory, filtr nazw zastrzeżonych i obsługa zdarzeń / Module logic file: RNG, name data, generators, reserved-name filter, and event handling

/* =======================
   RNG (seed lub crypto) / RNG (seed or crypto)
   ======================= */

// --- Funkcja haszująca tekst seeda do liczby 32-bitowej (FNV-1a) / Function hashing seed text into a 32-bit number (FNV-1a) ---
function xfnv1a(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// --- Deterministyczny generator liczb pseudolosowych Mulberry32 (tryb seed) / Deterministic Mulberry32 pseudorandom generator (seed mode) ---
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Losowanie kryptograficzne przeglądarki (tryb bez seeda) / Browser cryptographic randomness (no-seed mode) ---
function cryptoRand() {
  const u = new Uint32Array(1);
  crypto.getRandomValues(u);
  return u[0] / 4294967296;
}

// --- Wybór trybu losowania: niepusty seed daje powtarzalne wyniki, pusty daje crypto / Pick the random mode: a non-empty seed gives repeatable results, an empty one uses crypto ---
function makeRng(seedStr) {
  if (seedStr && seedStr.trim().length) {
    const seed = xfnv1a(seedStr.trim());
    return { rand: mulberry32(seed), mode: "seed" };
  }
  return { rand: cryptoRand, mode: "auto" };
}

/* =======================
   Helpery / Helpers
   ======================= */

// --- Zwraca prawdę z prawdopodobieństwem p / Returns true with probability p ---
function chance(p, rand) {
  return rand() < p;
}

// --- Zmienia pierwszą literę na wielką / Capitalizes the first letter ---
function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// --- Czyści gotową nazwę: proste cudzysłowy, nawiasy, nadmiarowe spacje / Cleans a finished name: straight quotes, parentheses, extra spaces ---
function cleanName(s) {
  return String(s)
    .replace(/"/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

// --- Losuje element tablicy bez wag / Picks an array element without weights ---
function pick(arr, rand) {
  return arr[Math.floor(rand() * arr.length)];
}

// --- Losuje element z wagami; obsługuje ["A","B"] oraz [{ v, w }] i zwraca cały element / Weighted pick; supports ["A","B"] and [{ v, w }] and returns the whole item ---
function pickItem(arr, rand) {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  if (typeof arr[0] === "string") {
    return pick(arr, rand);
  }

  let total = 0;
  for (const item of arr) {
    total += Number(item.w || 1);
  }
  let roll = rand() * total;
  for (const item of arr) {
    roll -= Number(item.w || 1);
    if (roll <= 0) return item;
  }
  return arr[arr.length - 1];
}

// --- Losuje wartość tekstową z wagami (pole v albo sam tekst) / Weighted pick of the text value (field v or the plain string) ---
function pickWeighted(arr, rand) {
  const item = pickItem(arr, rand);
  if (typeof item === "string") return item;
  return item ? item.v : "";
}

// --- Losuje liczbę całkowitą z zakresu domkniętego / Returns an integer from an inclusive range ---
function rollInt(min, max, rand) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

// --- Sprawdza, czy znak jest samogłoską / Checks whether a character is a vowel ---
function isVowel(ch) {
  return /[aeiouyąęóAEIOUYĄĘÓ]/.test(ch || "");
}

// --- Wygładza styk dwóch segmentów sylabowych (podwójna litera, zlane samogłoski) / Smooths the joint of two syllable segments (double letter, merged vowels) ---
function tidySegmentBoundary(a, b) {
  if (!a) return b || "";
  if (!b) return a || "";

  const last = a[a.length - 1];
  const first = b[0];

  if (last.toLowerCase() === first.toLowerCase()) {
    return a + b.slice(1);
  }

  if (isVowel(last) && isVowel(first)) {
    // Lekkie wygładzenie styku identycznych samogłosek / Light smoothing of identical touching vowels
    if ((last + first).match(/aa|ee|ii|oo|uu|yy/i)) {
      return a + b.slice(1);
    }
  }

  return a + b;
}

// --- Redukuje niezgrabne zbitki powstałe przy sklejaniu sylab / Reduces awkward clusters created while joining syllables ---
function phoneticPolish(s) {
  let out = String(s);

  // Potrójne litery skracamy do podwójnych / Triple letters are shortened to double letters
  out = out
    .replace(/([A-Za-z])\1\1+/g, "$1$1")
    .replace(/-([ -])/g, "-")
    .replace(/\s{2,}/g, " ");

  // Podwójne samogłoski ze sklejania sylab skracamy / Double vowels from syllable joins are shortened
  out = out
    .replace(/aa/gi, "a")
    .replace(/ee/gi, "e")
    .replace(/ii/gi, "i")
    .replace(/oo/gi, "o")
    .replace(/uu/gi, "u")
    .replace(/yy/gi, "y");

  // Bez pustych myślników i podwójnych spacji / No empty hyphens or double spaces
  out = out
    .replace(/\s+-\s+/g, "-")
    .replace(/\s{2,}/g, " ")
    .trim();

  return cleanName(out);
}

// --- Składa jedno słowo z segmentów sylabowych (tylko dla nazw sylabowych, nie dla angielskich złożeń) / Builds one word from syllable segments (syllabic names only, not English compounds) ---
function buildName(parts) {
  let out = "";
  for (const part of parts) {
    if (!part) continue;
    if (!out) {
      out = String(part);
      continue;
    }

    const last = out[out.length - 1];
    const first = String(part)[0];

    // Jeśli oba końce są literami, wygładzamy styk / If both ends are letters, smooth the joint
    if (/[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż]/.test(last) && /[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż]/.test(first)) {
      out = tidySegmentBoundary(out, String(part));
    } else {
      out += String(part);
    }
  }
  return phoneticPolish(out);
}

// --- Skleja angielski przydomek z dwóch członów (np. Iron + blade = Ironblade); przy tej samej literze na styku używa myślnika / Joins an English epithet from two parts (e.g. Iron + blade = Ironblade); uses a hyphen when the joint repeats a letter ---
function compoundWord(a, b, forceHyphen = false) {
  const head = String(a);
  const tail = String(b).toLowerCase();
  const sameLetter = head.slice(-1).toLowerCase() === tail.charAt(0);
  if (forceHyphen || sameLetter || head.startsWith("'")) {
    return `${head}-${tail}`;
  }
  return `${head}${tail}`;
}

// --- Normalizuje tekst do porównań: bez diakrytyków, apostrofów i wielkich liter; myślnik = spacja / Normalizes text for comparisons: no diacritics, apostrophes or capitals; hyphen = space ---
function normalizeForCheck(s) {
  return String(s)
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[„”“"’'`]/g, "")
    .replace(/[-–—]/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// --- Sprawdza, czy dwa słowa mają ten sam rdzeń (pierwsze 4 litery), np. „Świt” i „Świtu” / Checks whether two words share a root (first 4 letters), e.g. "Świt" and "Świtu" ---
function sameRoot(a, b) {
  return normalizeForCheck(a).slice(0, 4) === normalizeForCheck(b).slice(0, 4);
}

// --- Losuje dopełniacz o innym rdzeniu niż rzeczownik główny, by uniknąć „Gniew Gniewu” / Picks a genitive with a different root than the head noun to avoid "Gniew Gniewu" ---
function pickDifferentRoot(list, head, rand) {
  let value = pickWeighted(list, rand);
  for (let i = 0; i < 8 && sameRoot(head, value); i++) {
    value = pickWeighted(list, rand);
  }
  return value;
}

// --- Ocena jakości kandydata: długość, zbitki spółgłosek, potrójne samogłoski, powtórzone słowa, zbyt długie słowa / Candidate quality check: length, consonant clusters, triple vowels, repeated words, overlong words ---
function looksGood(s) {
  if (!s || s.length < 3) return false;

  const bad = [
    /[bcdfghjklmnpqrstvwxz]{7,}/i,
    /([aeiouy])\1\1/i,
    /--/,
    /''/,
    /\s{2,}/,
  ];
  if (bad.some((rx) => rx.test(s))) return false;

  const words = s.split(" ");
  for (let i = 0; i < words.length; i++) {
    // Pojedyncze słowo dłuższe niż 16 znaków wygląda na błąd sklejania / A single word longer than 16 characters looks like a joining error
    if (words[i].replace(/[-']/g, "").length > 16) return false;
    // Dwa identyczne słowa obok siebie (np. „Grell Grell”) odrzucamy / Two identical neighbouring words (e.g. "Grell Grell") are rejected
    if (i > 0 && words[i].toLowerCase() === words[i - 1].toLowerCase()) return false;
  }
  return true;
}

/* =======================
   Nazwy zastrzeżone / Reserved names
   =======================
   Imiona i nazwy unikatowych postaci oraz okrętów z lore. Generator odrzuca wynik, jeśli zawiera całą
   zastrzeżoną sekwencję słów (np. „Sebastian Yarrick”). Same części („Sebastian”, „Yarrick”) są dozwolone,
   chyba że postać jest znana pod jednym imieniem (np. „Imotekh”, „Ghazghkull”) – wtedy wpis jest jednowyrazowy.
   Unique lore character and vessel names. The generator rejects a result that contains a whole reserved word
   sequence (e.g. "Sebastian Yarrick"). Single parts ("Sebastian", "Yarrick") stay allowed unless the character
   is known by one name only (e.g. "Imotekh", "Ghazghkull") – then the entry is a single word.
*/
const RESERVED_PERSON_NAMES = [
  // Imperium – ludzie / Imperium – humans
  "Sebastian Yarrick", "Ciaphas Cain", "Gregor Eisenhorn", "Gideon Ravenor", "Ibram Gaunt", "Ursarkar Creed",
  "Jarran Kell", "Sly Marbo", "Hekhtor Pask", "Amberley Vail", "Harlon Nayl", "Kara Swole", "Patience Kys",
  "Alizebeth Bequin", "Medea Betancore", "Midas Betancore", "Pontius Glaw", "Zygmunt Molotch", "Kal Jericho",
  "Yolanda Catallus", "Gerontius Helmawr", "Goge Vandire", "Macharius", "Torquemada Coteaz", "Fyodor Karamazov",
  "Katarinya Greyfax", "Hector Rex", "Kryptman", "Bronislaw Czevak", "Leontus", "Janus Draik",
  "Theodora von Valancius", "Abelard Werserian", "Cassia Orsellio", "Heinrix van Calox", "Idira Tlass",
  "Pasqal Haneumann", "Hadron Blackwood", "Grendyl", "Rannick", "Colm Corbec", "Elim Rawne", "Tona Criid",
  "Brin Milo", "Oan Mkoll", "Hlaine Larkin", "Gol Kolea", "Agun Soric", "Ana Curth", "Mkvenner", "Viktor Hark",
  "Severina Raine", "Ollanius Pius", "Ollanius Persson", "Euphrati Keeler", "Mersadie Oliton", "Kyril Sindermann",
  "Lotara Sarrin", "Malcador", "Chenkov",
  // Adepta Sororitas
  "Celestine", "Aestred Thurga", "Agathae Dolan", "Junith Eruita", "Morvenn Vahl", "Ephrael Stern",
  "Miriael Sabathiel", "Veridyan", "Amalia Novena", "Dogmata", "Alicia Dominica", "Argenta", "Sabbat",
  // Prymarchowie i Astartes / Primarchs and Astartes
  "Roboute Guilliman", "Guilliman", "Lion El'Jonson", "Leman Russ", "Rogal Dorn", "Jaghatai Khan", "Sanguinius",
  "Corvus Corax", "Ferrus Manus", "Horus Lupercal", "Horus", "Mortarion", "Angron", "Fulgrim", "Perturabo",
  "Lorgar", "Konrad Curze", "Alpharius", "Omegon", "Vulkan", "Marneus Calgar", "Cato Sicarius", "Uriel Ventris",
  "Varro Tigurius", "Severus Agemman", "Torias Telion", "Antaro Chronus", "Pasanius Lysane", "Ortan Cassius",
  "Darnath Lysander", "Tor Garadon", "Pedro Kantor", "Alessio Cortez", "Kayvaan Shrike", "Vulkan He'stan",
  "He'stan", "Tu'Shan", "Adrax Agatone", "Kor'sarro Khan", "Jubal Khan", "Qin Xa", "Shiban Khan",
  "Ragnar Blackmane", "Logan Grimnar", "Njal Stormcaller", "Harald Deathwolf", "Krom Dragongaze",
  "Canis Wolfborn", "Arjac Rockfist", "Sven Bloodhowl", "Gabriel Angelos", "Gabriel Seth", "Isador Akios",
  "Erasmus Tycho", "Mephiston", "Lemartes", "Astorath", "Corbulo", "Karlaen", "Donatus Aphael", "Azrael",
  "Asmodai", "Sammael", "Cypher", "Helbrecht", "Grimaldus", "Demetrian Titus", "Kardan Stronos", "Garviel Loken",
  "Nathaniel Garro", "Saul Tarvitz", "Tarik Torgaddon", "Iacton Qruze", "Horus Aximand",
  // Adeptus Mechanicus
  "Belisarius Cawl", "Arkhan Land", "Faustinius", "Scaevola", "Videx", "Tarkis Blaylock", "Lexell Kotov",
  "Vitali Tychon", "Linya Tychon", "Koriel Zeth", "Anacharis Scoria", "Urtzi Malevolus", "Kelbor-Hal",
  "Pellas Mir", "Inar Satarael", "Ipluvien Maximal", "Vettius Telok", "Kryptaestrex", "Azuramagelli",
  "Hexamath", "Galatea", "Haldron Stroika", "Omnissiah",
  // Aeldari, Drukhari, Harlequini / Aeldari, Drukhari, Harlequins
  "Eldrad Ulthran", "Eldrad", "Taldeer", "Illic Nightspear", "Yriel", "Macha", "Nuadhu Fireheart", "Irillyth",
  "Lhykhis", "Baharroth", "Fuegan", "Karandras", "Jain Zar", "Maugan Ra", "Asurmen", "Arhra", "Iyanna Arienal",
  "Yvraine", "Visarch", "Yncarne", "Kysaduras", "Idranel", "Korlandril", "Thirianna", "Aradryan",
  "Elarique Swiftblade", "Taec Silvereye", "Mehlendri Silversoul", "Sylandri Veilwalker", "Sylandri",
  "Idraesil Dreamspear", "Asdrubael Vect", "Vect", "Lelith Hesperax", "Hesperax", "Drazhar", "Urien Rakarth",
  "Kraillach", "Kruellagh", "Xelian", "Aestra Khromys", "Aurelia Malys", "Malys", "Kheradruakh", "Sliscus",
  "Vraesque Malidrach", "Nyos Yllithian", "Bellathonis", "El'Uriaq", "Motley", "Kharbyr", "Yaelindra",
  "Angevere", "Marazhai", "Kaeleth-Tul", "Asuryan", "Khaine", "Isha", "Kurnous", "Lileath", "Vaul", "Cegorach",
  "Morai-Heg", "Ynnead",
  // Necroni i C'tan / Necrons and C'tan
  "Imotekh", "Trazyn", "Szarekh", "Orikan", "Anrakyr", "Zahndrekh", "Obyron", "Szeras", "Kutlakh", "Toholk",
  "Thaszar", "Oltyx", "Zarathusa", "Mephet'ran", "Mag'ladroth", "Aza'gorod", "Iash'uddra", "Nyadra'zatha",
  "Llandu'gor",
  // Orkowie / Orks
  "Ghazghkull", "Thraka", "Uruk", "Makari", "Snikrot", "Zagstruk", "Nazdreg", "Wazdakka", "Grotsnik", "Badrukk",
  "Gorgutz", "Snagrod", "Zodgrod", "Ufthak", "Bluddflagg", "Mogrok", "Grukk", "Grukk Face-rippa", "Skarsnik",
  "Grimgor", "Gorbad", "Azhag", "Morglum", "Mozrog", "Zogwort", "Gork", "Mork", "Gorkamorka", "Red Gobbo",
  // Chaos i demony / Chaos and daemons
  "Abaddon", "Ezekyle Abaddon", "Kharn", "Ahriman", "Ahzek Ahriman", "Typhus", "Lucius the Eternal",
  "Fabius Bile", "Huron Blackheart", "Haarken Worldclaimer", "Kor Phaeron", "Erebus", "Argel Tal", "Zardu Layak",
  "Talos Valcoran", "Uzas", "Xarl", "Cyrion", "Variel", "Mercutian", "Iskandar Khayon", "Khayon", "Ashur-Kai",
  "Telemachon", "Lheor", "Falkus Kibre", "Kossolax", "Vashtorr", "Be'lakor", "Skarbrand", "Ka'Bandha",
  "An'ggrath", "Karanak", "Skulltaker", "Valkia", "Doombreed", "Kairos Fateweaver", "Fateweaver", "M'kachen",
  "Ku'gath", "Rotigus", "Epidemius", "Scabeiathrax", "Glottkin", "Ethrac", "Ghurk", "Otto Glott", "Gutrot Spume",
  "Gutrot", "Festus", "Morbidex", "Horticulous Slimux", "Orghotts Daemonspew", "Bloab Rotspawned", "N'Kari",
  "Shalaxi Helbane", "Syll'Esske", "Sigvald", "Xantine", "Eidolon", "Julius Kaesoron", "Vilitch", "Zhufor",
  "Scyla Anfingrimm", "Khorne", "Nurgle", "Tzeentch", "Slaanesh", "Malal",
];

// --- Zastrzeżone nazwy okrętów i maszyn z lore / Reserved lore ship and war machine names ---
const RESERVED_VESSEL_NAMES = [
  "Vengeful Spirit", "Phalanx", "Macragge's Honour", "Eternal Crusader", "Invincible Reason", "Terminus Est",
  "Conqueror", "Pride of the Emperor", "Endurance", "Iron Blood", "Covenant of Blood", "Echo of Damnation",
  "Speranza", "Imperius Dominatus", "Dies Irae", "Lupa Capitalina", "Blade of Vengeance", "Fortress of Arrogance",
  "Hand of Steel", "Canis Rex", "Planet Killer", "Solemnace Gallery",
  // Polskie odpowiedniki nazw z lore / Polish equivalents of lore names
  "Mściwy Duch", "Falanga", "Honor Macragge", "Wieczny Krzyżowiec", "Niezwyciężony Rozum", "Zdobywca",
  "Duma Imperatora", "Wytrzymałość", "Żelazna Krew", "Przymierze Krwi", "Echo Potępienia", "Ostrze Zemsty",
  "Forteca Arogancji", "Stalowa Ręka", "Zabójca Planet",
];

// --- Zamienia listę nazw na listę sekwencji słów do szybkiego porównania / Turns a name list into word sequences for fast comparison ---
function buildReservedIndex(list) {
  return list
    .map((name) => normalizeForCheck(name).split(" ").filter(Boolean))
    .filter((words) => words.length > 0);
}

const RESERVED_PERSON_INDEX = buildReservedIndex(RESERVED_PERSON_NAMES);
const RESERVED_VESSEL_INDEX = buildReservedIndex(RESERVED_VESSEL_NAMES);

// --- Sprawdza, czy nazwa zawiera zastrzeżoną sekwencję słów (całe słowa, w tej samej kolejności) / Checks whether a name contains a reserved word sequence (whole words, same order) ---
function isReserved(name, index) {
  const words = normalizeForCheck(name).split(" ").filter(Boolean);
  for (const reserved of index) {
    for (let start = 0; start + reserved.length <= words.length; start++) {
      let match = true;
      for (let k = 0; k < reserved.length; k++) {
        if (words[start + k] !== reserved[k]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
  }
  return false;
}

// --- Próbuje wygenerować nazwę, która nie jest zastrzeżona i przechodzi ocenę jakości / Tries to generate a name that is not reserved and passes the quality check ---
function tryGenerate(fn, reservedIndex = RESERVED_PERSON_INDEX, tries = 30) {
  let fallback = "";
  for (let i = 0; i < tries; i++) {
    const candidate = cleanName(fn());
    // Nazwa zastrzeżona nigdy nie trafia do wyniku / A reserved name never reaches the output
    if (!candidate || isReserved(candidate, reservedIndex)) continue;
    if (looksGood(candidate)) return candidate;
    if (!fallback) fallback = candidate;
  }
  return fallback;
}

/* =======================
   Dane – ludzie Imperium / Data – Imperial humans
   ======================= */

// --- Klasa niższa: robotnicy uli, gangerzy, szeregowi gwardziści, ludzie z pogranicza; bez tytułów i numerów / Lower class: hive workers, gangers, rank-and-file guardsmen, frontier folk; no titles or numbers ---
const HUMAN_LOWER = {
  // Style regionalne (zob. konwencje pułków: kadiańska, vostroyańska, tallarnijska itd.) / Regional styles (see regiment conventions: Cadian, Vostroyan, Tallarn etc.)
  styles: [
    { v: "hive", w: 42 },
    { v: "latin", w: 13 },
    { v: "slavic", w: 14 },
    { v: "desert", w: 10 },
    { v: "celtic", w: 10 },
    { v: "mono", w: 6 },
    { v: "hiveSingle", w: 5 },
  ],
  hiveGiven: [
    "Arno", "Bask", "Benno", "Bram", "Brusk", "Cort", "Dace", "Dagg", "Dray", "Emmet", "Fenn", "Garrik", "Gorin",
    "Hask", "Hobb", "Hollis", "Harl", "Ivo", "Jek", "Jorl", "Joss", "Kade", "Karsk", "Kolm", "Korlo", "Lenk", "Lorn",
    "Marl", "Merik", "Nalo", "Noll", "Orrin", "Oskar", "Pell", "Rask", "Rikard", "Rolan", "Ruddo", "Silas", "Sten",
    "Stosh", "Tamm", "Tev", "Tobin", "Tolly", "Ulf", "Venn", "Vik", "Voll", "Wendt", "Grell", "Hekk", "Dunn",
    "Aliza", "Anja", "Bex", "Brenna", "Cally", "Dessa", "Edda", "Elka", "Greta", "Hana", "Hild", "Ilse", "Ines",
    "Jessa", "Katja", "Lise", "Lotte", "Mara", "Marta", "Mira", "Nell", "Oda", "Petra", "Rikka", "Rosa", "Sella",
    "Tamsin", "Tessa", "Una", "Vena", "Wren", "Dagna", "Kesh", "Jura", "Tilde",
  ],
  hiveSurname: [
    "Ashby", "Brask", "Brenner", "Brock", "Callow", "Carrow", "Cole", "Corrick", "Dray", "Draeger", "Fell", "Fenwick",
    "Garrow", "Gorse", "Graff", "Hadley", "Hale", "Harrow", "Hekt", "Hollan", "Holt", "Kellan", "Kerrow", "Kessler",
    "Kord", "Krail", "Krenn", "Larch", "Marsh", "Mott", "Nagle", "Orlan", "Pike", "Pollard", "Quill", "Radek",
    "Rask", "Rook", "Rudd", "Scarrow", "Sedge", "Skell", "Sloane", "Stahl", "Stroud", "Sumpter", "Tallow", "Tarn",
    "Thorne", "Tolk", "Vane", "Voss", "Wardel", "Webb", "Wick", "Yarrow", "Zell", "Brandt", "Cinder", "Dunmore",
    "Gritt", "Haskin", "Jarrow", "Kilner", "Lathe", "Mercer", "Nock", "Pitt", "Sallow", "Slade", "Tanner", "Vetch",
    "Whitlock", "Grell", "Bracken", "Coker", "Drummel", "Flint", "Hewer", "Kopp", "Lugg", "Moss", "Renk", "Soot",
  ],
  latinGiven: [
    "Aulus", "Gaius", "Gallus", "Linus", "Lucan", "Marius", "Otho", "Quint", "Remus", "Rufus", "Sextus", "Tito",
    "Vito", "Decim", "Fausto", "Cato", "Livia", "Julia", "Tulia", "Flavia", "Lucia", "Marcia", "Nona", "Silvia",
    "Tertia", "Prisca", "Octa", "Varia",
  ],
  slavicGivenM: [
    "Aleksei", "Anton", "Boris", "Dmitri", "Fedor", "Grigor", "Ilya", "Kasimir", "Lev", "Mikhail", "Oleg", "Pavel",
    "Radomir", "Stanis", "Vasily", "Yuri", "Zoran", "Bogdan", "Miroslav", "Taras",
  ],
  slavicGivenF: [
    "Nadia", "Olena", "Raisa", "Tatya", "Vesna", "Yelena", "Zoya", "Irina", "Mila", "Katya", "Darya", "Lyuba",
  ],
  slavicSurname: [
    "Arkadin", "Belov", "Drazan", "Grekov", "Kovar", "Morozov", "Orlov", "Radov", "Sokolov", "Strakhov", "Tarasov",
    "Volkov", "Zharkov", "Barinov", "Lazarev", "Rudenko", "Sarkov", "Varenko", "Yaskov", "Dragomir", "Kurgan",
    "Zelenko", "Voronin", "Lebedev",
  ],
  slavicPatronymicM: [
    "Antonovich", "Borisovich", "Dmitrievich", "Fedorovich", "Grigorovich", "Ivanovich", "Leonidovich",
    "Mikhailovich", "Olegovich", "Pavlovich", "Vasilievich",
  ],
  slavicPatronymicF: [
    "Antonovna", "Borisovna", "Dmitrievna", "Fedorovna", "Grigorovna", "Ivanovna", "Mikhailovna", "Olegovna",
    "Pavlovna", "Vasilievna",
  ],
  desertGivenM: [
    "Asad", "Farid", "Hakim", "Idris", "Karim", "Nadir", "Rashid", "Samir", "Tarik", "Yusuf", "Zahir", "Hasim",
    "Jalal", "Malik", "Kadir", "Harun",
  ],
  desertGivenF: ["Amira", "Leila", "Samira", "Yasmin", "Zara", "Nadira", "Farah", "Soraya", "Dalia", "Rania"],
  desertSurname: [
    "Hadir", "Masoud", "Rahim", "Sadiq", "Tahir", "Zayed", "Nasri", "Qasim", "Faris", "Haddad", "Mansur", "Azim",
    "Karaj", "Sahir",
  ],
  celticGiven: [
    "Bran", "Cathal", "Declan", "Eamon", "Fergal", "Keir", "Lorcan", "Oran", "Ronan", "Cormac", "Niall", "Dermot",
    "Rory", "Conn", "Aileen", "Maev", "Rhian", "Siobhan", "Orla", "Brigid", "Caitrin", "Deirdre", "Moira", "Fionna",
  ],
  celticSurname: [
    "Carrick", "Mallen", "Rourke", "Tierney", "Flynn", "Keogh", "Donnal", "Hagan", "Quinlan", "Madden", "Garvey",
    "Kinnear", "Lorne", "Mulvey", "Brannock", "Callan", "Dorran", "Feeny", "Harkin", "Nolan",
  ],
  // Krótkie, twarde imiona używane samodzielnie (styl katachański / gangerski) / Short, hard names used alone (Catachan / ganger style)
  mono: [
    "Brakk", "Hook", "Slade", "Tusk", "Knox", "Brand", "Flint", "Mace", "Bull", "Stone", "Hatch", "Spike", "Rusk",
    "Stave", "Blaze", "Bolt", "Brick", "Crash", "Grease", "Gambit", "Nitro", "Rook", "Shade", "Skinner", "Stitch",
    "Styx", "Tank", "Trick", "Vex", "Ratch", "Dutch", "Jinx",
  ],
};

// --- Klasa wyższa: szlachta, dynastie Wolnych Handlarzy, wyżsi urzędnicy; wysoki gotyk bez tytułów / Upper class: nobles, Rogue Trader dynasties, high officials; High Gothic without titles ---
const HUMAN_UPPER = {
  // Warianty budowy nazwiska / Name structure variants
  styles: [
    { v: "plain", w: 45 },
    { v: "doubleGiven", w: 20 },
    { v: "particle", w: 20 },
    { v: "doubleBarrel", w: 15 },
  ],
  // Imiona męskie i żeńskie osobno, aby drugie imię miało tę samą płeć / Male and female given names kept apart so a second given name matches the gender
  givenM: [
    "Aldric", "Alaric", "Ambrosius", "Aurelian", "Balthasar", "Casimir", "Cassian", "Castor", "Cornelius", "Crispin",
    "Darius", "Demetrius", "Drusus", "Emeric", "Evander", "Florian", "Hadrian", "Horatio", "Ignatius", "Julian",
    "Justinian", "Leopold", "Lothar", "Lucian", "Marcellus", "Maximilian", "Nicodemus", "Octavian", "Orsino",
    "Percival", "Ptolemy", "Quintus", "Reinholt", "Sebastian", "Septimus", "Severin", "Silvanus", "Tancred",
    "Theodric", "Tiberius", "Valerian", "Vespasian", "Zacharias", "Anselm", "Benedikt", "Constantin", "Dietrich",
    "Godfrey", "Konrad", "Laurent", "Matthias", "Osric", "Ruprecht", "Ulrich", "Albrecht", "Ludovic",
  ],
  givenF: [
    "Aemilia", "Agrippina", "Alessandra", "Anastasia", "Aurelia", "Beatrix", "Cassandra", "Clementine", "Cordelia",
    "Drusilla", "Evangeline", "Flavia", "Helena", "Honoria", "Ignatia", "Iolanthe", "Isolde", "Josephine", "Justina",
    "Leontine", "Livia", "Lucretia", "Lysandra", "Magdalena", "Marcella", "Octavia", "Ophelia", "Perpetua",
    "Rosalind", "Sabina", "Seraphine", "Severina", "Theodora", "Valeria", "Veronika", "Vivienne", "Wilhelmina",
    "Xanthe", "Zenobia", "Adelheid", "Mathilde", "Ottilie", "Sidonie", "Katarina", "Amalthea",
  ],
  surname: [
    "Aldemar", "Ashcombe", "Castellane", "Corvanis", "Darrow", "Delacorte", "Drummond", "Everard", "Falkenrath",
    "Faulkner", "Gravenor", "Hesperan", "Ivensky", "Kastor", "Lanceret", "Lethbridge", "Malvern", "Montague",
    "Morvane", "Nordhaven", "Orlanov", "Ravensburg", "Rothmere", "Sarrazin", "Tancredi", "Thornwood", "Valcourt",
    "Varenhold", "Vessendorf", "Wyndham", "Xanthis", "Ardenne", "Draycott", "Glanvill", "Lorrimer", "Orsini",
    "Pembroke", "Tremaine", "Valcaster", "Vorlan", "Mordaunt", "Varro", "Aurigny", "Belmonte", "Carvallo",
    "Destrier", "Esterhaz", "Gallowmere", "Harkenfeld", "Istvanik", "Kallendor", "Lichtenau", "Marchetti",
    "Novarre", "Ostrand", "Quillon", "Rosenthal", "Severan", "Strakenburg", "Tolliver", "Umbrecht", "Vandermeer",
    "Wittelsbrand", "Arcturon", "Cavendar", "Halberd", "Montcalm", "Seyrin",
  ],
  // Partykuły szlacheckie / Noble particles
  particles: [{ v: "von", w: 3 }, { v: "van", w: 3 }, { v: "de", w: 2 }, { v: "du", w: 1 }, { v: "del", w: 1 }],
};

/* =======================
   Dane – Adepta Sororitas / Data – Adepta Sororitas
   ======================= */

// --- Imiona zlatynizowane, biblijne i świętych; nazwiska gotyckie o wydźwięku cnoty lub cierpienia / Latinised, biblical and saintly given names; Gothic surnames evoking virtue or suffering ---
const SORORITAS = {
  given: [
    "Agnes", "Aline", "Amalthea", "Aveline", "Beatrice", "Benedicta", "Casilda", "Cecilia", "Clemence", "Constance",
    "Dorothea", "Elspeth", "Emmanuelle", "Eudora", "Eulalia", "Euphemia", "Evangeline", "Fidelia", "Florentina",
    "Genevieve", "Gertrud", "Helena", "Hildegard", "Honorine", "Ignatia", "Imelda", "Isabeau", "Isolde", "Jehanne",
    "Josephine", "Juliana", "Leocadia", "Lucienne", "Madeleine", "Marguerite", "Mercia", "Mirabel", "Natalia",
    "Odile", "Ottilia", "Perpetua", "Philippa", "Priscilla", "Prudence", "Rosamund", "Sabine", "Seraphine",
    "Solange", "Sophronia", "Temperance", "Theodosia", "Ursula", "Valeria", "Verena", "Veronica", "Viviane",
    "Winifred", "Apollonia", "Bernadette", "Delphine", "Adrianna", "Ambrosia", "Lucia", "Silvana", "Dominica",
  ],
  surname: [
    "Aldane", "Ashwell", "Beaumont", "Dolorosa", "Mercator", "Vespertine", "Salvaris", "Hallowell", "Martyne",
    "Ravel", "Galloway", "Orison", "Sabbatine", "Severos", "Tallis", "Valois", "Crucis", "Eradice", "Argentis",
    "Candel", "Castimonia", "Dorneval", "Esperanc", "Fidelis", "Gravesend", "Hespera", "Ignis", "Lachrymae",
    "Maledon", "Novell", "Penitens", "Quietus", "Rosarius", "Sanctus", "Thornfield", "Umbrage", "Vigilans",
    "Ashgrove", "Cendre", "Deverell", "Inviolata", "Lamentia", "Mortain", "Pyrrhe", "Solemna", "Veritas",
  ],
};

/* =======================
   Dane – Astartes / Data – Astartes
   ======================= */

// --- Style zakonów: kodeksowy (łacina/greka), nordycki, anielski, krzyżowcy, nokturneński, czogoryjski / Chapter styles: Codex (Latin/Greek), Nordic, angelic, crusader, Nocturnean, Chogorian ---
const ASTARTES = {
  styles: [
    { v: "codex", w: 45 },
    { v: "angelic", w: 14 },
    { v: "nordic", w: 13 },
    { v: "crusader", w: 10 },
    { v: "salamander", w: 9 },
    { v: "scars", w: 9 },
  ],
  codexGiven: [
    "Aetius", "Arcadius", "Aulus", "Caelus", "Cato", "Decimus", "Drusus", "Galenus", "Gaius", "Hektor", "Janus",
    "Justus", "Lucan", "Lucius", "Macer", "Numerius", "Octavius", "Proculus", "Quintus", "Remus", "Sabinus", "Scipio",
    "Septimus", "Sergius", "Severus", "Sulla", "Tarquin", "Tertius", "Tullus", "Varus", "Vitellius", "Xanthus",
    "Aeneas", "Castor", "Corvinus", "Evander", "Nestor", "Pallas", "Marius", "Priam", "Brutus", "Camillus",
    "Horatius", "Orestes", "Agrippa", "Aurelius", "Cassian", "Kyrian", "Laertes", "Menelon", "Symeon", "Tobias",
  ],
  codexCognomen: [
    "Aemilian", "Arrius", "Calvus", "Decius", "Fabricius", "Gallus", "Lucanus", "Maximian", "Praxor", "Quintilian",
    "Rufinus", "Tiberian", "Valens", "Varrus", "Verus", "Vinicius", "Scaurus", "Tullian", "Maxentius", "Pertinax",
    "Galerius", "Aurion", "Vaelor", "Serapion", "Faustus", "Galba", "Metellus", "Priscus", "Castus", "Acastus",
    "Dolabella", "Flaminius", "Gracchus", "Laetus", "Messala", "Nerva", "Orsinus", "Sabinian", "Sextian",
    "Aquilon", "Hesperion", "Andronicus", "Castigon", "Drakon", "Ignatian", "Mordax", "Pyrrhus", "Stator",
    "Tarvos", "Vespian", "Corvantes", "Stratan",
  ],
  // Przydomki gotyckie (Iron + blade) dla stylów kodeksowego i krzyżowców / Gothic epithets (Iron + blade) for Codex and crusader styles
  gothicPre: [
    "Iron", "Steel", "Oath", "Storm", "Ash", "Stone", "Grim", "Dawn", "Night", "Blood", "Gold", "Fire", "Sword",
    "Pyre", "Faith", "Thunder", "Hammer", "Star", "Grave", "Sun",
  ],
  gothicSuf: [
    "blade", "hand", "guard", "heart", "ward", "fist", "helm", "vow", "shield", "brand", "mantle", "born", "bane",
    "watch", "strike", "fall", "sworn",
  ],
  angelicGiven: [
    "Abdiel", "Adriel", "Ambriel", "Anael", "Barachiel", "Cassiel", "Eremiel", "Gadriel", "Hadraniel", "Ithuriel",
    "Jegudiel", "Jophiel", "Kemuel", "Malchiel", "Nathanael", "Oriphiel", "Raguel", "Remiel", "Sariel", "Suriel",
    "Tamiel", "Uriel", "Zadkiel", "Zophiel", "Zuriel", "Amariel", "Baraqiel", "Caliel", "Haniel", "Machidiel",
    "Phanuel", "Varchiel", "Yerathel",
  ],
  nordicGiven: [
    "Arnvald", "Bjarki", "Brynjar", "Eirik", "Gunnar", "Haakon", "Halfdan", "Hjalmar", "Ingvar", "Jorund", "Ketil",
    "Leif", "Olvir", "Orm", "Ragnvald", "Sigurd", "Snorri", "Sveinn", "Thorolf", "Torvald", "Ulfar", "Vali", "Yngvar",
    "Arvid", "Hrolf", "Kolbein", "Starkad", "Grettir", "Egil", "Asbjorn", "Hallvard", "Thrain", "Vigfus", "Hafgrim",
  ],
  nordicPre: [
    "Ash", "Black", "Blood", "Frost", "Grey", "Iron", "Red", "Storm", "Wolf", "Winter", "Rune", "Skull", "Stone",
    "Thunder", "Fell", "Rime", "Bear", "Raven", "Doom", "Fang", "Ice", "Troll", "Wyrm", "Sky", "Snow",
  ],
  nordicSuf: [
    "mane", "fang", "claw", "howl", "hand", "heart", "tooth", "blade", "helm", "bane", "born", "pelt", "hide", "eye",
    "gaze", "fist", "shield", "axe", "hammer", "maw", "tongue", "jaw", "mantle",
  ],
  crusaderGiven: [
    "Adelard", "Amalric", "Baldwin", "Bertrand", "Bohemond", "Conrad", "Eustace", "Gaspard", "Geoffroi", "Godfrey",
    "Gottfried", "Guiscard", "Hugues", "Jocelin", "Lambert", "Raimund", "Reinhold", "Roland", "Tancred", "Thibault",
    "Walther", "Wolfram", "Anselm", "Gerlach", "Siegfried", "Dietmar", "Engelbert", "Folcard", "Hartwig", "Ortwin",
    "Ruprecht", "Theobald", "Ulbrecht", "Arnulf", "Everard", "Manfred", "Odo",
  ],
  // Nokturne: imiona z apostrofem (A'b) i twarde imiona bez apostrofu / Nocturne: apostrophe names (A'b) and hard names without one
  salamanderA: ["Ba", "Da", "He", "Ka", "Ko", "Ra", "Sha", "Tsu", "Va", "Xa", "Zu", "Ru", "Ti", "Na", "Mu", "Ek"],
  salamanderB: [
    "ken", "kir", "gan", "dak", "vek", "rhan", "tor", "lek", "van", "shak", "nar", "zul", "dar", "kan", "ruk", "gar",
    "tek",
  ],
  salamanderGiven: [
    "Arkon", "Daxos", "Ignus", "Keldar", "Morgar", "Narek", "Orzan", "Pyrus", "Rhazan", "Sarkon", "Tharek", "Ushar",
    "Barok", "Hekar", "Ixan",
  ],
  salamanderSurname: [
    "Aradox", "Ignar", "Korvan", "Moxar", "Pyron", "Sulvek", "Tharok", "Vargan", "Zhakar", "Draekon", "Kelvar",
    "Ushaan", "Moribar", "Tzukar",
  ],
  scarsGiven: [
    "Batu", "Chagan", "Jochi", "Temur", "Toqta", "Arslan", "Berke", "Chinua", "Dorgon", "Jebe", "Kaidu", "Nogai",
    "Orda", "Qutlugh", "Tolui", "Sechen", "Ganzorig", "Bayan", "Esen", "Altan", "Buri", "Subai", "Mukhali",
    "Borokhul", "Jelme", "Sorkan", "Boroqai", "Tarkhan", "Yesun", "Ariq", "Khadan", "Nokhai", "Toghrul", "Belgutei",
    "Bekter", "Shigi", "Munglik", "Daritai",
  ],
  scarsClan: [
    "Bataar", "Chagat", "Ergun", "Khasar", "Sartaq", "Temuge", "Oyrat", "Naiman", "Kerait", "Jalair", "Merkit",
    "Tayichi", "Borjin", "Qonggir", "Uriankh", "Khongirad", "Olkhunut", "Baarin", "Barulas", "Sunud", "Dorben",
    "Khatagin", "Saljiut",
  ],
};

/* =======================
   Dane – Adeptus Mechanicus / Data – Adeptus Mechanicus
   ======================= */

// --- Imiona łacińskie/greckie, techno-łacińskie przydomki, oznaczenia literami greckimi i numerami / Latin/Greek names, techno-Latin cognomens, Greek-letter and number designations ---
const MECH = {
  techStyles: [
    { v: "givenCogn", w: 30 },
    { v: "givenGreek", w: 20 },
    { v: "givenNumCogn", w: 15 },
    { v: "proc", w: 20 },
    { v: "procGreek", w: 15 },
  ],
  given: [
    "Aurex", "Arkos", "Cyprian", "Draxus", "Eudoxus", "Gallus", "Heron", "Kallistos", "Lysimachus", "Mettius",
    "Nestorius", "Ptolemaeus", "Quartus", "Rheon", "Stratos", "Tertullian", "Urbanus", "Xanthus", "Zosimus",
    "Anaximen", "Hypatia", "Theano", "Kallinike", "Aspasia", "Ptolema", "Sophronia", "Heronia", "Irenaeus",
    "Cassiodor", "Boethius", "Philon", "Archytas", "Eratos", "Ktesib", "Hieron", "Anthemius", "Isidora",
    "Vitruvia", "Demokrit", "Menaechma",
  ],
  cognomen: [
    "Anodus", "Axionis", "Cathodex", "Cogitex", "Dynamar", "Ferrox", "Galvanis", "Isotopus", "Kinetor", "Logarix",
    "Magnetus", "Noosar", "Ohmicus", "Photonis", "Radiax", "Syntaxis", "Tensor", "Thermis", "Torquex", "Vectris",
    "Voltaris", "Machinatus", "Integrex", "Fulcrum", "Hexadex", "Binarius", "Ferrovox", "Cogniton", "Aetherix",
    "Ignitor", "Rotorix", "Spectris", "Algorex", "Numerox", "Mechanis", "Ordinax",
  ],
  // Sylaby dla jednowyrazowych, podniosłych imion (np. w stylu Azuramagelli) / Syllables for single grandiose names (Azuramagelli style)
  pre: [
    "Azu", "Kry", "Hexa", "Noo", "Ferr", "Cogn", "Volt", "Syn", "Log", "Prax", "Aug", "Omni", "Xy", "Mag", "Rho",
    "Theo", "Cyb", "Vex", "Dyn", "Ohm", "Sil", "Ael", "Ist", "Tel", "Arc", "Zo",
  ],
  mid: [
    "pta", "ra", "ma", "ge", "ae", "stra", "lo", "ne", "the", "xa", "ri", "to", "me", "gi", "ta", "lu", "vo", "di",
  ],
  end: [
    "ex", "ix", "ax", "us", "on", "elli", "ius", "or", "ath", "is", "eon", "ic", "ux", "ium", "ator", "ides",
    "metrix", "gnis",
  ],
  greek: [
    "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu",
    "Xi", "Omicron", "Pi", "Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", "Psi", "Omega",
  ],
  // Skitarii: oznaczenia literowo-liczbowe albo imię z numerem; bez stopni i nazw oddziałów / Skitarii: letter-number designations or a name with a number; no ranks or unit types
  skitStyles: [
    { v: "greekNum", w: 30 },
    { v: "givenNumCogn", w: 30 },
    { v: "givenGreek", w: 25 },
    { v: "givenCogn", w: 15 },
  ],
  skitGiven: [
    "Arkon", "Brax", "Castor", "Dak", "Hekt", "Ixor", "Kaz", "Morv", "Oxil", "Rhen", "Sarn", "Tarsk", "Ulk", "Varn",
    "Vox", "Zell", "Doran", "Grax", "Kheb", "Lok", "Nox", "Quor", "Ryk", "Sull", "Thex", "Ursk", "Vrell", "Xer",
    "Zeb", "Tavor",
  ],
  skitCognomen: [
    "Dravik", "Oszak", "Pell", "Rusk", "Tarkov", "Vess", "Zorn", "Kallax", "Mordan", "Strell", "Vorn", "Hask",
    "Krenz", "Ostrik", "Ruhn", "Tesk", "Vaskar", "Yurin", "Braske", "Kovrin",
  ],
  ordinals: [
    "Primus", "Secundus", "Tertius", "Quartus", "Quintus", "Sextus", "Septimus", "Octavus", "Nonus", "Decimus",
    "II", "III", "IV", "V", "VI", "VII", "IX", "XI",
  ],
};

/* =======================
   Dane – Aeldari / Data – Aeldari
   ======================= */

// --- Asuryani: płynne, wielosylabowe imiona; czasem drugi człon lub przydomek (np. „Nightspear”) / Asuryani: flowing multi-syllable names; sometimes a second name or an epithet (e.g. "Nightspear") ---
const AELDARI = {
  craft: {
    // Imiona Aeldari lubią dwugłoski (ae, ia), więc nie usuwamy samogłosek na styku / Aeldari names like diphthongs (ae, ia), so joint vowels are kept
    softVowels: true,
    pre: [
      "A", "Ae", "Al", "Ara", "Ar", "Ath", "Cae", "Ela", "Eli", "Ell", "Fae", "Ia", "Idr", "Ili", "Iy", "Ka", "Ke",
      "Kel", "Kor", "La", "Lech", "Lia", "Mae", "Me", "Mor", "Na", "Ne", "Nu", "Sa", "Se", "Sha", "Ta", "Tha", "Thi",
      "Ul", "Va", "Ya", "Aur", "Cy", "Dyr", "Ea", "Fir", "Hae", "Il", "Lua", "Nir", "Oth", "Siv", "Tae", "Vae", "Yl",
    ],
    mid: [
      "la", "li", "lan", "len", "ra", "ri", "ran", "rian", "dra", "dri", "the", "thi", "ssa", "sa", "na", "ni", "nai",
      "ia", "ae", "io", "ya", "yl", "mi", "rha", "ven", "van", "vi", "ol", "lae", "thae", "lis",
    ],
    end: [
      { v: "dril", w: 2 }, { v: "ril", w: 2 }, { v: "iel", w: 3 }, { v: "ael", w: 3 }, { v: "anna", w: 2 },
      { v: "ath", w: 3 }, { v: "aith", w: 1 }, { v: "ain", w: 2 }, { v: "ion", w: 2 }, { v: "ir", w: 1 },
      { v: "yr", w: 1 }, { v: "yth", w: 1 }, { v: "ith", w: 2 }, { v: "iss", w: 1 }, { v: "eth", w: 2 },
      { v: "as", w: 1 }, { v: "ean", w: 1 }, { v: "ian", w: 2 }, { v: "uil", w: 1 }, { v: "wyn", w: 1 },
      { v: "thir", w: 1 }, { v: "nith", w: 1 }, { v: "eil", w: 1 }, { v: "anel", w: 1 }, { v: "oris", w: 1 },
      { v: "isa", w: 1 }, { v: "ara", w: 2 }, { v: "is", w: 1 }, { v: "en", w: 1 }, { v: "aen", w: 1 },
      { v: "ieth", w: 1 }, { v: "aris", w: 1 },
    ],
    epiPre: [
      "Night", "Star", "Moon", "Silver", "Swift", "Storm", "Fire", "Wind", "Dawn", "Shadow", "Sun", "Mist", "Dusk",
      "Soul", "Spirit", "Rune", "Wraith", "Ghost", "Frost", "Bright", "Sorrow",
    ],
    epiSuf: [
      "spear", "blade", "song", "wind", "heart", "eye", "runner", "walker", "strider", "soul", "flame", "shard",
      "whisper", "weaver", "brand", "fall", "light", "arrow", "bow", "seeker", "dream", "sight",
    ],
  },
  // Drukhari: ostre, syczące imiona z „x”, „th”, „y”; często imię i nazwisko rodowe / Drukhari: sharp, hissing names with "x", "th", "y"; often a given and a house name
  drukh: {
    softVowels: true,
    pre: [
      "As", "Bel", "Ae", "El", "Kae", "Kha", "Kra", "Kru", "Lel", "Mal", "Nyo", "Tra", "Ur", "Vha", "Vlo", "Vra", "Xe",
      "Xy", "Yae", "Yll", "Zyn", "Sy", "Ly", "Cyr", "Nae", "Shar", "Ix", "Hae", "Ves", "Thra", "Dyr", "Sel", "Zer",
    ],
    mid: [
      "dru", "ba", "lia", "the", "ri", "ka", "ra", "xa", "zy", "lly", "sh", "th", "lo", "ae", "ya", "ve", "sa", "ru",
      "kh", "ny", "qu",
    ],
    end: [
      "ael", "eth", "ax", "esh", "yx", "ith", "iel", "us", "ar", "ion", "ach", "agh", "ys", "oth", "yr", "esque",
      "ian", "ath", "ix", "arc", "iq", "ere", "iss", "issa", "yne", "ora",
    ],
    // Krótkie człony do form z myślnikiem (styl „Kaeleth-Tul”) / Short parts for hyphenated forms ("Kaeleth-Tul" style)
    hyphenTail: ["Tul", "Sar", "Khar", "Ys", "Ith", "Mor", "Zel", "Rak", "Vyr", "Esh", "Nyx", "Kel"],
    // Krótkie przedrostki do form z apostrofem (styl „El'Uriaq”) / Short prefixes for apostrophe forms ("El'Uriaq" style)
    apostrophePre: ["El", "Ae", "Ys", "Ix", "Yl", "Ur", "As", "Ka", "Vy", "Xe"],
  },
  // Harlequini: lekkie imiona i teatralne przydomki (styl „Veilwalker”) / Harlequins: light names and theatrical epithets ("Veilwalker" style)
  harl: {
    softVowels: true,
    pre: [
      "Cae", "Idra", "Ky", "Lye", "Mo", "Sae", "Tha", "Va", "Ere", "Ase", "Fae", "Nu", "Yl", "Ria", "Tae", "Lu", "Mi",
      "Dae", "Ilia", "Sia", "Vey",
    ],
    mid: ["la", "ra", "le", "ri", "lo", "ssa", "the", "ne", "li", "ae"],
    end: [
      "sil", "riel", "ael", "oth", "eon", "wyn", "iel", "ith", "ane", "ir", "ys", "ara", "is", "enne", "uin", "yth",
    ],
    epiPre: [
      "Veil", "Dream", "Shadow", "Mirth", "Masque", "Twilight", "Star", "Mirror", "Riddle", "Dusk", "Moon", "Whisper",
      "Tear", "Rune", "Flicker", "Night", "Silk", "Smoke", "Glass",
    ],
    epiSuf: [
      "walker", "dancer", "spear", "song", "blade", "weaver", "mask", "step", "strider", "whisper", "shroud", "veil",
      "fall", "glint", "jest", "smile", "tale",
    ],
  },
};

/* =======================
   Dane – Necroni / Data – Necrons
   ======================= */

// --- Egipsko brzmiące sylaby z metalicznymi końcówkami -ekh, -akh, -tekh, -at, -tar / Egyptian-sounding syllables with metallic endings -ekh, -akh, -tekh, -at, -tar ---
const NECRON = {
  pre: [
    "An", "Amen", "Ankh", "Djo", "Hekh", "Isk", "Kha", "Khep", "Men", "Meph", "Nak", "Neb", "Nekh", "Neph", "Nih",
    "Nov", "Ra", "Sau", "Sek", "Set", "Sho", "Tah", "Tep", "Thu", "Toh", "Zah", "Zar", "Ur", "Ok", "Ath", "Ish",
    "Kam", "Ark", "Hap", "Sen", "Shep", "Wen", "Iah", "Kheb", "Sut",
  ],
  mid: [
    "ka", "ra", "te", "ta", "men", "ne", "sa", "ho", "ze", "the", "mo", "nu", "ser", "tu", "mu", "khe", "pha", "ro",
    "sho", "ank",
  ],
  end: [
    { v: "ekh", w: 4 }, { v: "akh", w: 3 }, { v: "okh", w: 2 }, { v: "tekh", w: 3 }, { v: "rekh", w: 2 },
    { v: "nekh", w: 1 }, { v: "at", w: 2 }, { v: "et", w: 1 }, { v: "ut", w: 1 }, { v: "tar", w: 2 },
    { v: "tyr", w: 1 }, { v: "ryn", w: 1 }, { v: "ras", w: 1 }, { v: "eth", w: 1 }, { v: "esh", w: 1 },
    { v: "eph", w: 1 }, { v: "ot", w: 1 }, { v: "oth", w: 1 }, { v: "ankh", w: 1 }, { v: "khet", w: 2 },
    { v: "yx", w: 1 }, { v: "ar", w: 1 }, { v: "ir", w: 1 }, { v: "ys", w: 1 }, { v: "ahn", w: 1 }, { v: "ep", w: 1 },
  ],
  // Końcówki nazw światów-grobowców (forma nieodmieniana, np. „z Nephtaras”) / Tomb world endings (undeclined form, e.g. "z Nephtaras")
  placeEnd: ["as", "is", "ath", "ekh", "ar", "os", "un"],
};

/* =======================
   Dane – Orkowie / Data – Orks
   ======================= */

// --- Gardłowe imiona 2–3 sylaby oraz przechwałkowe przydomki (np. „Skullkrusha”) / Guttural 2–3 syllable names and boastful epithets (e.g. "Skullkrusha") ---
const ORK = {
  styles: [
    { v: "single", w: 45 },
    { v: "epithet", w: 40 },
    { v: "epithetOnly", w: 15 },
  ],
  pre: [
    "Bog", "Bol", "Dag", "Drog", "Gar", "Gaz", "Gor", "Grak", "Grub", "Kar", "Klag", "Krag", "Krug", "Lug", "Mag",
    "Mog", "Muk", "Nog", "Og", "Rag", "Ruk", "Skab", "Snag", "Thrag", "Ug", "Ur", "Uz", "Waz", "Zag", "Zog", "Zug",
    "Brog", "Blag", "Gub", "Hruk", "Krog", "Nak", "Skrag", "Snot", "Urg", "Yag", "Bruk",
  ],
  mid: ["a", "u", "ag", "ub", "ok", "ga"],
  end: [
    "dakka", "rukk", "gutz", "grod", "drek", "gob", "nak", "rok", "rog", "zak", "rag", "snik", "krump", "gul", "bad",
    "grim", "ul", "uk", "urk", "ug", "dreg", "krak", "snag", "gitz", "stomp", "bash", "gash", "zog", "mog", "lug",
    "zag", "tusk",
  ],
  epiPre: [
    "Doom", "Skull", "Git", "Gut", "Teef", "Face", "'Ead", "Bone", "Big", "'Ard", "Rok", "Wurld", "Humie", "Grot",
    "Beaky", "Scrap", "Blood", "Neck", "Toof",
  ],
  epiSuf: [
    "stompa", "krusha", "smasha", "rippa", "choppa", "kicka", "basha", "snappa", "eata", "killa", "burna", "slasha",
    "grabba", "hunta", "puncha", "loota", "bita", "splitta", "shoota", "stabba",
  ],
};

/* =======================
   Dane – Chaos / Data – Chaos
   ======================= */

// --- Dla każdego bóstwa: sylaby imion oraz dwa człony przydomków (np. „Blackheart”) / For each god: name syllables and two epithet parts (e.g. "Blackheart") ---
const CHAOS = {
  undiv: {
    pre: [
      "Ab", "Mor", "Vek", "Zar", "Bel", "Xar", "Dae", "Mal", "Kor", "Nex", "Var", "Tor", "Kha", "Ul", "Ash", "Ghor",
      "Sar", "Dra", "Vor", "Hel",
    ],
    mid: ["ra", "zu", "no", "the", "ur", "i", "o", "ae", "vor", "kar", "el", "ka", "ze", "go", "ru"],
    end: [
      "gon", "rax", "mord", "thar", "loth", "zeth", "vyr", "esh", "akor", "ion", "azar", "ith", "ul", "tor", "vex",
      "kul", "rath", "xis", "oth", "arn",
    ],
    epiPre: [
      "Black", "Blood", "Dread", "Doom", "Hell", "Skull", "Soul", "Night", "Void", "Ash", "Iron", "Grim", "Ruin",
      "Hex", "Bane", "Star", "Shadow", "Storm", "World",
    ],
    epiSuf: [
      "heart", "claw", "bane", "blade", "hand", "maw", "fang", "reaver", "render", "flayer", "splitter", "eater",
      "sworn", "born", "crown", "brand", "scar", "helm", "caller", "breaker", "reaper", "walker",
    ],
  },
  khorne: {
    pre: [
      "Kar", "Gor", "Rag", "Skar", "Bra", "Vra", "Ghar", "Ruk", "Dra", "Kha", "Zar", "Kor", "Gra", "Brak", "Uth",
      "Khar", "Vorn",
    ],
    mid: ["a", "o", "u", "ra", "ga", "zor", "rak", "th", "ur", "akh", "orr", "ag", "ek", "ul"],
    end: [
      "thar", "gor", "krag", "zakh", "gorn", "rakk", "skar", "drox", "khul", "mord", "rax", "zarr", "vorn", "gash",
      "rend", "grim", "dak", "uz", "kar", "oth",
    ],
    epiPre: ["Blood", "Skull", "Gore", "Brass", "Rage", "Bone", "Wrath", "Red", "Flesh", "Throat", "Axe"],
    epiSuf: [
      "reaver", "hand", "fist", "render", "splitter", "claw", "hunter", "brand", "crusher", "drinker", "cleaver",
      "maw", "ripper", "hewer", "sworn",
    ],
  },
  nurgle: {
    pre: [
      "Mog", "Pox", "Rot", "Glo", "Bub", "Muc", "Fet", "Gur", "Slud", "Mor", "Sour", "Mold", "Gul", "Gut", "Hork",
      "Blot", "Scab", "Pust", "Vom",
    ],
    mid: ["a", "o", "u", "ru", "lo", "mu", "gu", "dr", "ag", "ur", "og", "il", "en", "ub", "ib"],
    end: [
      "gus", "ulk", "ob", "ub", "ath", "otch", "ug", "ulch", "ax", "ius", "ex", "ogg", "um", "urb", "ix", "ulus",
      "idex", "olus",
    ],
    epiPre: [
      "Rot", "Plague", "Pox", "Blight", "Bile", "Fly", "Gut", "Pus", "Maggot", "Mire", "Filth", "Sore", "Rust",
      "Gall", "Phlegm", "Grub",
    ],
    epiSuf: [
      "belly", "gut", "maw", "bloat", "blister", "spawn", "father", "bringer", "gorge", "heart", "hand", "jaw",
      "monger", "bearer", "mother", "wallow",
    ],
  },
  tzeent: {
    softVowels: true,
    pre: [
      "Kai", "Zyn", "Xai", "Vex", "Syr", "Aza", "Cyr", "The", "My", "Ori", "Zae", "Quo", "Ixi", "Iri", "Tal", "Aml",
    ],
    mid: ["ae", "io", "y", "ra", "ze", "th", "qu", "vyr", "el", "an", "en", "or", "ith", "sa", "xi"],
    end: [
      "ith", "or", "ael", "vyr", "zeph", "quor", "hynn", "sael", "myr", "thir", "vian", "rael", "xyr", "loth",
      "ixis", "arion", "oz", "aphel",
    ],
    epiPre: [
      "Fate", "Change", "Flux", "Hex", "Glyph", "Warp", "Rune", "Spell", "Mirror", "Twist", "Wyrd", "Riddle", "Quill",
      "Star", "Ink",
    ],
    epiSuf: [
      "binder", "caller", "sight", "twister", "scribe", "eye", "tongue", "flame", "glass", "shaper", "spinner",
      "seer", "mind", "bearer", "weaver",
    ],
  },
  slaan: {
    softVowels: true,
    pre: [
      "Vel", "Ser", "Xan", "Sha", "Eli", "Vyr", "Cael", "Nai", "Zel", "Ase", "Lye", "Fae", "Rha", "Dex", "Ish", "Vex",
      "Lus",
    ],
    mid: ["ae", "ia", "io", "y", "la", "ra", "ve", "se", "th", "el", "an", "en", "or", "ith", "ce"],
    end: [
      "ar", "ath", "iel", "yra", "essa", "ion", "uar", "elis", "yss", "ane", "ine", "ixa", "ante", "ille", "ius",
      "aria", "ienne", "enne",
    ],
    epiPre: [
      "Silk", "Velvet", "Honey", "Pain", "Bliss", "Scarlet", "Lash", "Musk", "Sin", "Pale", "Jewel", "Rapture",
      "Sorrow", "Rose", "Ivory",
    ],
    epiSuf: [
      "tongue", "touch", "song", "kiss", "lash", "bane", "heart", "smile", "veil", "blade", "claw", "whisper", "sigh",
      "thorn",
    ],
  },
};

/* =======================
   Dane – nazwy polskie (niski gotyk) i łacińskie (wysoki gotyk) / Data – Polish (Low Gothic) and Latin (High Gothic) names
   ======================= */

// --- Polskie rzeczowniki z rodzajem gramatycznym (m, f, n) do nazw maszyn / Polish nouns with grammatical gender (m, f, n) for war machine names ---
const PL = {
  nouns: [
    { v: "Gniew", g: "m" }, { v: "Młot", g: "m" }, { v: "Wyrok", g: "m" }, { v: "Grom", g: "m" },
    { v: "Triumf", g: "m" }, { v: "Świt", g: "m" }, { v: "Zmierzch", g: "m" }, { v: "Miecz", g: "m" },
    { v: "Kieł", g: "m" }, { v: "Topór", g: "m" }, { v: "Sztandar", g: "m" }, { v: "Werdykt", g: "m" },
    { v: "Szturm", g: "m" }, { v: "Taran", g: "m" }, { v: "Żar", g: "m" }, { v: "Bastion", g: "m" },
    { v: "Psalm", g: "m" }, { v: "Dekret", g: "m" },
    { v: "Pokuta", g: "f" }, { v: "Zemsta", g: "f" }, { v: "Przysięga", g: "f" }, { v: "Krucjata", g: "f" },
    { v: "Litania", g: "f" }, { v: "Błyskawica", g: "f" }, { v: "Pięść", g: "f" }, { v: "Tarcza", g: "f" },
    { v: "Włócznia", g: "f" }, { v: "Czujność", g: "f" }, { v: "Furia", g: "f" }, { v: "Chwała", g: "f" },
    { v: "Kara", g: "f" }, { v: "Wola", g: "f" }, { v: "Pochodnia", g: "f" }, { v: "Duma", g: "f" },
    { v: "Odsiecz", g: "f" }, { v: "Rękawica", g: "f" }, { v: "Twierdza", g: "f" }, { v: "Modlitwa", g: "f" },
    { v: "Żelazo", g: "n" }, { v: "Ostrze", g: "n" }, { v: "Światło", g: "n" }, { v: "Słowo", g: "n" },
    { v: "Serce", g: "n" }, { v: "Kowadło", g: "n" }, { v: "Męstwo", g: "n" }, { v: "Oko", g: "n" },
    { v: "Zbawienie", g: "n" }, { v: "Proroctwo", g: "n" },
  ],
  // Przymiotniki w trzech rodzajach: [męski, żeński, nijaki] / Adjectives in three genders: [masculine, feminine, neuter]
  adjectives: [
    ["Żelazny", "Żelazna", "Żelazne"], ["Święty", "Święta", "Święte"], ["Niezłomny", "Niezłomna", "Niezłomne"],
    ["Ostatni", "Ostatnia", "Ostatnie"], ["Wieczny", "Wieczna", "Wieczne"], ["Gniewny", "Gniewna", "Gniewne"],
    ["Płonący", "Płonąca", "Płonące"], ["Stalowy", "Stalowa", "Stalowe"], ["Krwawy", "Krwawa", "Krwawe"],
    ["Sprawiedliwy", "Sprawiedliwa", "Sprawiedliwe"], ["Nieugięty", "Nieugięta", "Nieugięte"],
    ["Grzmiący", "Grzmiąca", "Grzmiące"], ["Złoty", "Złota", "Złote"], ["Czarny", "Czarna", "Czarne"],
    ["Nieubłagany", "Nieubłagana", "Nieubłagane"], ["Wierny", "Wierna", "Wierne"],
    ["Milczący", "Milcząca", "Milczące"], ["Szkarłatny", "Szkarłatna", "Szkarłatne"],
    ["Nieśmiertelny", "Nieśmiertelna", "Nieśmiertelne"], ["Srebrny", "Srebrna", "Srebrne"],
    ["Surowy", "Surowa", "Surowe"], ["Bezlitosny", "Bezlitosna", "Bezlitosne"],
    ["Niezwyciężony", "Niezwyciężona", "Niezwyciężone"], ["Pobożny", "Pobożna", "Pobożne"],
  ],
  // Dopełniacze („czyj? czego?”) / Genitives ("whose? of what?")
  genitives: [
    "Terry", "Imperatora", "Tronu", "Męczenników", "Świętych", "Sprawiedliwości", "Wiary", "Gwardii", "Pustki",
    "Burzy", "Ognia", "Świtu", "Nocy", "Stali", "Żelaza", "Zemsty", "Pokuty", "Przodków", "Poległych", "Niebios",
    "Imperium", "Wojny", "Zwycięstwa", "Gromu",
  ],
};

// --- Łacińskie mianowniki i dopełniacze – zawsze poprawne gramatycznie pary (np. „Ira Imperatoris”) / Latin nominatives and genitives – always grammatical pairs (e.g. "Ira Imperatoris") ---
const LATIN = {
  nouns: [
    "Ira", "Fides", "Lux", "Gladius", "Malleus", "Vindex", "Custos", "Fulmen", "Ignis", "Ultio", "Vox", "Manus",
    "Hasta", "Victoria", "Gloria", "Fortitudo", "Clipeus", "Corona", "Mors", "Iudicium", "Tonitrus", "Vigilia",
    "Poena", "Sanctitas", "Veritas", "Virtus", "Pugnus", "Ensis", "Aquila",
  ],
  genitives: [
    "Terrae", "Imperatoris", "Throni", "Martyrum", "Noctis", "Astrorum", "Veritatis", "Fidei", "Solis", "Belli",
    "Aeternitatis", "Sanguinis", "Hominum", "Sanctorum", "Iustitiae", "Caeli", "Ferri", "Victoriae", "Vindictae",
    "Imperii",
  ],
};

/* =======================
   Dane – maszyny bojowe / Data – war machines
   ======================= */

// --- Szansa na łacińską nazwę (wysoki gotyk) dla każdego rodzaju maszyny; reszta nazw jest polska / Chance of a Latin (High Gothic) name per machine kind; the remaining names are Polish ---
const WAR = {
  tank: { latinChance: 0.2 },
  titan: { latinChance: 0.6 },
  knight: { latinChance: 0.35 },
  air: { latinChance: 0.25 },
};

/* =======================
   Dane – okręty gwiezdne / Data – starships
   ======================= */

// --- Dla każdej frakcji: wzorce (patterns) i polskie słowniki; łacińskie nazwy zostają po łacinie / Per faction: patterns and Polish word lists; Latin names stay in Latin ---
// Rzeczowniki mają rodzaj (g: m/f/n), przymiotniki trzy formy [m, f, n], dopełniacze odpowiadają na „czego? kogo?”
// Nouns carry a gender (g: m/f/n), adjectives have three forms [m, f, n], genitives answer "of what? of whom?"
const SHIP = {
  imperial: {
    patterns: [{ v: "latin", w: 30 }, { v: "adjNoun", w: 30 }, { v: "nounGen", w: 30 }, { v: "single", w: 10 }],
    nouns: [
      { v: "Młot", g: "m" }, { v: "Miecz", g: "m" }, { v: "Gniew", g: "m" }, { v: "Wyrok", g: "m" },
      { v: "Strażnik", g: "m" }, { v: "Herold", g: "m" }, { v: "Sztandar", g: "m" }, { v: "Grom", g: "m" },
      { v: "Osąd", g: "m" }, { v: "Bastion", g: "m" }, { v: "Werdykt", g: "m" }, { v: "Płomień", g: "m" },
      { v: "Głos", g: "m" },
      { v: "Tarcza", g: "f" }, { v: "Pięść", g: "f" }, { v: "Włócznia", g: "f" }, { v: "Chwała", g: "f" },
      { v: "Czujność", g: "f" }, { v: "Pokuta", g: "f" }, { v: "Krucjata", g: "f" }, { v: "Pochodnia", g: "f" },
      { v: "Korona", g: "f" }, { v: "Ręka", g: "f" }, { v: "Przysięga", g: "f" }, { v: "Furia", g: "f" },
      { v: "Lanca", g: "f" }, { v: "Litania", g: "f" }, { v: "Wiara", g: "f" },
      { v: "Światło", g: "n" }, { v: "Oko", g: "n" }, { v: "Słowo", g: "n" }, { v: "Ostrze", g: "n" },
      { v: "Rozgrzeszenie", g: "n" }, { v: "Odkupienie", g: "n" },
    ],
    adjectives: [
      ["Nieubłagany", "Nieubłagana", "Nieubłagane"], ["Sprawiedliwy", "Sprawiedliwa", "Sprawiedliwe"],
      ["Nieugięty", "Nieugięta", "Nieugięte"], ["Czujny", "Czujna", "Czujne"], ["Niezłomny", "Niezłomna", "Niezłomne"],
      ["Bezlitosny", "Bezlitosna", "Bezlitosne"], ["Niezachwiany", "Niezachwiana", "Niezachwiane"],
      ["Wytrwały", "Wytrwała", "Wytrwałe"], ["Uświęcony", "Uświęcona", "Uświęcone"],
      ["Chwalebny", "Chwalebna", "Chwalebne"], ["Wierny", "Wierna", "Wierne"], ["Wieczny", "Wieczna", "Wieczne"],
      ["Szkarłatny", "Szkarłatna", "Szkarłatne"], ["Milczący", "Milcząca", "Milczące"],
      ["Nieustający", "Nieustająca", "Nieustające"], ["Żelazny", "Żelazna", "Żelazne"], ["Święty", "Święta", "Święte"],
      ["Nieskruszony", "Nieskruszona", "Nieskruszone"],
    ],
    genitives: [
      "Terry", "Tronu", "Imperatora", "Wiary", "Męczenników", "Świętych", "Sprawiedliwości", "Świtu", "Pustki",
      "Świętej Terry", "Złotego Tronu", "Wiernych", "Odkupienia", "Pokuty",
    ],
    single: [
      "Nieubłagany", "Niestrudzony", "Nieprzekupny", "Niezwyciężony", "Nieugięty", "Niezłomny", "Nieustępliwy",
      "Mężny", "Wytrwały", "Rozgrzeszenie", "Odkupienie", "Pokuta", "Skrucha", "Wyrzeczenie", "Wytrwałość",
    ],
  },
  astartes: {
    patterns: [{ v: "latin", w: 20 }, { v: "adjNoun", w: 30 }, { v: "nounGen", w: 40 }, { v: "single", w: 10 }],
    nouns: [
      { v: "Honor", g: "m" }, { v: "Gniew", g: "m" }, { v: "Młot", g: "m" }, { v: "Miecz", g: "m" },
      { v: "Szpon", g: "m" }, { v: "Herold", g: "m" }, { v: "Głos", g: "m" }, { v: "Obowiązek", g: "m" },
      { v: "Triumf", g: "m" },
      { v: "Duma", g: "f" }, { v: "Przysięga", g: "f" }, { v: "Tarcza", g: "f" }, { v: "Pięść", g: "f" },
      { v: "Włócznia", g: "f" }, { v: "Chwała", g: "f" }, { v: "Czujność", g: "f" }, { v: "Lanca", g: "f" },
      { v: "Rękawica", g: "f" }, { v: "Pamięć", g: "f" }, { v: "Zemsta", g: "f" },
      { v: "Braterstwo", g: "n" }, { v: "Męstwo", g: "n" }, { v: "Ostrze", g: "n" }, { v: "Poświęcenie", g: "n" },
    ],
    adjectives: [
      ["Niezłomny", "Niezłomna", "Niezłomne"], ["Żelazny", "Żelazna", "Żelazne"], ["Stoicki", "Stoicka", "Stoickie"],
      ["Nieustępliwy", "Nieustępliwa", "Nieustępliwe"], ["Czcigodny", "Czcigodna", "Czcigodne"],
      ["Czujny", "Czujna", "Czujne"], ["Niezłamany", "Niezłamana", "Niezłamane"], ["Gniewny", "Gniewna", "Gniewne"],
      ["Zaprzysiężony", "Zaprzysiężona", "Zaprzysiężone"], ["Wieczny", "Wieczna", "Wieczne"],
      ["Milczący", "Milcząca", "Milczące"], ["Dumny", "Dumna", "Dumne"], ["Ponury", "Ponura", "Ponure"],
      ["Nieugięty", "Nieugięta", "Nieugięte"], ["Niezachwiany", "Niezachwiana", "Niezachwiane"],
    ],
    genitives: [
      "Męstwa", "Prymarchy", "Imperatora", "Terry", "Poświęcenia", "Obowiązku", "Zemsty", "Honoru", "Żelaza", "Stali",
      "Gromu", "Krucjaty", "Zwycięstwa", "Poległych", "Braterstwa", "Zakonu",
    ],
    single: ["Niezłomny", "Nieustępliwy", "Niezłamany", "Nieugięty", "Czujność", "Zaprzysiężony", "Niezachwiany"],
  },
  mechanicus: {
    patterns: [{ v: "mechLatin", w: 35 }, { v: "adjNoun", w: 30 }, { v: "nounGen", w: 35 }],
    nouns: [
      { v: "Kantyk", g: "m" }, { v: "Aksjomat", g: "m" }, { v: "Schemat", g: "m" }, { v: "Wektor", g: "m" },
      { v: "Protokół", g: "m" }, { v: "Teoremat", g: "m" }, { v: "Algorytm", g: "m" }, { v: "Katechizm", g: "m" },
      { v: "Tygiel", g: "m" }, { v: "Silnik", g: "m" }, { v: "Hymn", g: "m" },
      { v: "Litania", g: "f" }, { v: "Kuźnia", g: "f" }, { v: "Formuła", g: "f" }, { v: "Maszyna", g: "f" },
      { v: "Wiedza", g: "f" },
      { v: "Równanie", g: "n" }, { v: "Przymierze", g: "n" }, { v: "Dominium", g: "n" }, { v: "Kowadło", g: "n" },
    ],
    adjectives: [
      ["Święty", "Święta", "Święte"], ["Błogosławiony", "Błogosławiona", "Błogosławione"],
      ["Nieskazitelny", "Nieskazitelna", "Nieskazitelne"], ["Logiczny", "Logiczna", "Logiczne"],
      ["Doskonały", "Doskonała", "Doskonałe"], ["Binarny", "Binarna", "Binarne"], ["Uświęcony", "Uświęcona", "Uświęcone"],
      ["Wieczny", "Wieczna", "Wieczne"], ["Wszechwiedzący", "Wszechwiedząca", "Wszechwiedzące"],
      ["Nieomylny", "Nieomylna", "Nieomylne"], ["Nieustanny", "Nieustanna", "Nieustanne"],
    ],
    genitives: [
      "Marsa", "Boga Maszyny", "Żelaza", "Stali", "Rozumu", "Kuźni", "Czystych Danych", "Noosfery",
      "Poszukiwania Wiedzy", "Świętej Maszyny",
    ],
    latinNouns: [
      "Machina", "Cognitio", "Ferrum", "Scientia", "Ratio", "Fabrica", "Motus", "Numerus", "Mensura", "Vis", "Anima",
      "Lex", "Ordo",
    ],
    latinGenitives: [
      "Martis", "Machinae", "Omnissiae", "Ferri", "Rationis", "Scientiae", "Numeri", "Veritatis", "Dei Mechanici",
      "Aeternitatis",
    ],
  },
  eldar: {
    patterns: [{ v: "adjNoun", w: 35 }, { v: "nounGen", w: 45 }, { v: "nounAdj", w: 20 }],
    nouns: [
      { v: "Szept", g: "m" }, { v: "Sen", g: "m" }, { v: "Lament", g: "m" }, { v: "Cień", g: "m" }, { v: "Świt", g: "m" },
      { v: "Pieśń", g: "f" }, { v: "Łza", g: "f" }, { v: "Mgła", g: "f" }, { v: "Włócznia", g: "f" },
      { v: "Gwiazda", g: "f" }, { v: "Zasłona", g: "f" }, { v: "Nić", g: "f" }, { v: "Łaska", g: "f" },
      { v: "Klinga", g: "f" }, { v: "Tęsknota", g: "f" },
      { v: "Echo", g: "n" }, { v: "Lustro", g: "n" }, { v: "Skrzydło", g: "n" }, { v: "Wspomnienie", g: "n" },
    ],
    adjectives: [
      ["Cichy", "Cicha", "Ciche"], ["Gasnący", "Gasnąca", "Gasnące"], ["Wieczny", "Wieczna", "Wieczne"],
      ["Odległy", "Odległa", "Odległe"], ["Srebrny", "Srebrna", "Srebrne"], ["Gwiezdny", "Gwiezdna", "Gwiezdne"],
      ["Księżycowy", "Księżycowa", "Księżycowe"], ["Blady", "Blada", "Blade"], ["Ukryty", "Ukryta", "Ukryte"],
      ["Wędrowny", "Wędrowna", "Wędrowne"], ["Zagubiony", "Zagubiona", "Zagubione"], ["Żałobny", "Żałobna", "Żałobne"],
      ["Zmierzchowy", "Zmierzchowa", "Zmierzchowe"],
    ],
    genitives: [
      "Ishy", "Asuryana", "Zmierzchu", "Zagubionych Gwiazd", "Gasnących Słońc", "Ciszy", "Księżyca",
      "Dawnych Ścieżek", "Pamięci", "Jesieni", "Odległych Gwiazd",
    ],
  },
  drukhari: {
    patterns: [{ v: "adjNoun", w: 45 }, { v: "nounGen", w: 45 }, { v: "nounAdj", w: 10 }],
    nouns: [
      { v: "Kolec", g: "m" }, { v: "Hak", g: "m" }, { v: "Nóż", g: "m" }, { v: "Kieł", g: "m" }, { v: "Bicz", g: "m" },
      { v: "Jad", g: "m" }, { v: "Głód", g: "m" }, { v: "Wrzask", g: "m" }, { v: "Cierń", g: "m" },
      { v: "Sztylet", g: "m" },
      { v: "Udręka", g: "f" }, { v: "Męka", g: "f" }, { v: "Brzytwa", g: "f" }, { v: "Złośliwość", g: "f" },
      { v: "Zawiść", g: "f" }, { v: "Plaga", g: "f" }, { v: "Pajęczyna", g: "f" }, { v: "Agonia", g: "f" },
      { v: "Okrucieństwo", g: "n" }, { v: "Żądło", g: "n" }, { v: "Cierpienie", g: "n" }, { v: "Ostrze", g: "n" },
    ],
    adjectives: [
      ["Wykwintny", "Wykwintna", "Wykwintne"], ["Czarny", "Czarna", "Czarne"], ["Ząbkowany", "Ząbkowana", "Ząbkowane"],
      ["Jadowity", "Jadowita", "Jadowite"], ["Okrutny", "Okrutna", "Okrutne"], ["Krzyczący", "Krzycząca", "Krzyczące"],
      ["Cichy", "Cicha", "Ciche"], ["Nieskończony", "Nieskończona", "Nieskończone"],
      ["Łaknący", "Łaknąca", "Łaknące"], ["Gorzki", "Gorzka", "Gorzkie"], ["Kolczasty", "Kolczasta", "Kolczaste"],
      ["Mroczny", "Mroczna", "Mroczne"], ["Północny", "Północna", "Północne"], ["Zatruty", "Zatruta", "Zatrute"],
    ],
    genitives: [
      "Mrocznego Miasta", "Bólu", "Krzyku", "Rozpaczy", "Wiecznej Nocy", "Cieni", "Noży", "Cierpienia", "Zawiści",
      "Pustki", "Agonii",
    ],
  },
  ork: {
    // Orkowy niski gotyk po polsku: prostackie przymiotniki i „czyja” łajba / Orkish Low Gothic in Polish: crude adjectives and "whose" ship
    patterns: [{ v: "adjNoun", w: 50 }, { v: "nounGen", w: 35 }, { v: "adjNounGen", w: 15 }],
    nouns: [
      { v: "Krążownik", g: "m" }, { v: "Wrak", g: "m" }, { v: "Kadłub", g: "m" }, { v: "Rozwalacz", g: "m" },
      { v: "Siekacz", g: "m" }, { v: "Tupacz", g: "m" }, { v: "Kieł", g: "m" }, { v: "Złom", g: "m" },
      { v: "Kopniak", g: "m" }, { v: "Łom", g: "m" },
      { v: "Łajba", g: "f" }, { v: "Balia", g: "f" }, { v: "Barka", g: "f" }, { v: "Puszka", g: "f" },
      { v: "Skrzynia", g: "f" }, { v: "Pięść", g: "f" }, { v: "Szczęka", g: "f" }, { v: "Kupa Złomu", g: "f" },
      { v: "Rozwałka", g: "f" },
      { v: "Pudło", g: "n" }, { v: "Działo", g: "n" }, { v: "Wiadro", g: "n" },
    ],
    adjectives: [
      ["Wielgachny", "Wielgachna", "Wielgachne"], ["Czerwony", "Czerwona", "Czerwone"], ["Wredny", "Wredna", "Wredne"],
      ["Głośny", "Głośna", "Głośne"], ["Szybki", "Szybka", "Szybkie"], ["Twardy", "Twarda", "Twarde"],
      ["Porządny", "Porządna", "Porządne"], ["Rozwalający", "Rozwalająca", "Rozwalające"],
      ["Tupiący", "Tupiąca", "Tupiące"], ["Łupiący", "Łupiąca", "Łupiące"], ["Wkurzony", "Wkurzona", "Wkurzone"],
      ["Zardzewiały", "Zardzewiała", "Zardzewiałe"], ["Dakkowy", "Dakkowa", "Dakkowe"],
      ["Gorkowy", "Gorkowa", "Gorkowe"], ["Morkowy", "Morkowa", "Morkowe"],
    ],
    genitives: ["Gorka", "Morka", "Szefa", "Wielkiego Meka", "Grota", "Bossa", "Dakki", "Złomu"],
  },
  necron: {
    patterns: [{ v: "adjNoun", w: 40 }, { v: "nounGen", w: 30 }, { v: "nounNecron", w: 30 }],
    nouns: [
      { v: "Grobowiec", g: "m" }, { v: "Sarkofag", g: "m" }, { v: "Eon", g: "m" }, { v: "Zastój", g: "m" },
      { v: "Podbój", g: "m" }, { v: "Wyrok", g: "m" }, { v: "Sąd", g: "m" }, { v: "Monolit", g: "m" },
      { v: "Obelisk", g: "m" },
      { v: "Kosa", g: "f" }, { v: "Dynastia", g: "f" }, { v: "Cisza", g: "f" }, { v: "Wieczność", g: "f" },
      { v: "Korona", g: "f" }, { v: "Władza", g: "f" }, { v: "Niepamięć", g: "f" }, { v: "Nekropolia", g: "f" },
      { v: "Żniwo", g: "n" }, { v: "Panowanie", g: "n" }, { v: "Odzyskanie", g: "n" }, { v: "Królestwo", g: "n" },
    ],
    adjectives: [
      ["Wieczny", "Wieczna", "Wieczne"], ["Cichy", "Cicha", "Ciche"], ["Nieumierający", "Nieumierająca", "Nieumierające"],
      ["Nieśmiertelny", "Nieśmiertelna", "Nieśmiertelne"], ["Nieskończony", "Nieskończona", "Nieskończone"],
      ["Odwieczny", "Odwieczna", "Odwieczne"], ["Bezsenny", "Bezsenna", "Bezsenne"],
      ["Bezgwiezdny", "Bezgwiezdna", "Bezgwiezdne"], ["Bezlitosny", "Bezlitosna", "Bezlitosne"],
      ["Niezłamany", "Niezłamana", "Niezłamane"], ["Grobowy", "Grobowa", "Grobowe"],
      ["Ponadczasowy", "Ponadczasowa", "Ponadczasowe"],
    ],
    genitives: ["Wieczności", "Dynastii", "Gwiazd", "Eonów", "Zastoju", "Grobowca", "Pyłu", "Ciszy", "Wieków"],
  },
  chaos: {
    patterns: [{ v: "adjNoun", w: 45 }, { v: "nounGen", w: 43 }, { v: "single", w: 12 }],
    // Pojedyncze słowa na tyle mocne, by być nazwą okrętu / Single words strong enough to name a ship
    single: [
      "Zguba", "Ruina", "Herezja", "Zdrada", "Apostazja", "Anatema", "Potępienie", "Zbezczeszczenie", "Otchłań",
      "Plaga", "Klątwa", "Bluźnierstwo",
    ],
    nouns: [
      { v: "Stos", g: "m" }, { v: "Głód", g: "m" }, { v: "Sztylet", g: "m" }, { v: "Skowyt", g: "m" },
      { v: "Grymuar", g: "m" }, { v: "Pakt", g: "m" }, { v: "Herold", g: "m" }, { v: "Odłamek", g: "m" },
      { v: "Bicz", g: "m" }, { v: "Zwiastun", g: "m" }, { v: "Rekwiem", g: "n" },
      { v: "Zguba", g: "f" }, { v: "Ruina", g: "f" }, { v: "Zaraza", g: "f" }, { v: "Złośliwość", g: "f" },
      { v: "Klątwa", g: "f" }, { v: "Udręka", g: "f" }, { v: "Otchłań", g: "f" }, { v: "Furia", g: "f" },
      { v: "Herezja", g: "f" }, { v: "Zdrada", g: "f" }, { v: "Apostazja", g: "f" }, { v: "Plaga", g: "f" },
      { v: "Korona", g: "f" }, { v: "Rękawica", g: "f" }, { v: "Paszcza", g: "f" }, { v: "Anatema", g: "f" },
      { v: "Potępienie", g: "n" }, { v: "Zbezczeszczenie", g: "n" }, { v: "Ścierwo", g: "n" }, { v: "Ostrze", g: "n" },
    ],
    adjectives: [
      ["Żarłoczny", "Żarłoczna", "Żarłoczne"], ["Bluźnierczy", "Bluźniercza", "Bluźniercze"],
      ["Przeklęty", "Przeklęta", "Przeklęte"], ["Plugawy", "Plugawa", "Plugawe"], ["Krwawiący", "Krwawiąca", "Krwawiące"],
      ["Wyjący", "Wyjąca", "Wyjące"], ["Płonący", "Płonąca", "Płonące"], ["Bezbożny", "Bezbożna", "Bezbożne"],
      ["Nieskończony", "Nieskończona", "Nieskończone"], ["Wrzeszczący", "Wrzeszcząca", "Wrzeszczące"],
      ["Zdradziecki", "Zdradziecka", "Zdradzieckie"], ["Czarny", "Czarna", "Czarne"],
      ["Szkarłatny", "Szkarłatna", "Szkarłatne"], ["Porzucony", "Porzucona", "Porzucone"], ["Gnijący", "Gnijąca", "Gnijące"],
    ],
    genitives: [
      "Ruiny", "Osnowy", "Mrocznych Bogów", "Bluźnierstwa", "Oka", "Rozpaczy", "Zdrady", "Popiołu", "Krzyku",
      "Cierpienia", "Nienawiści", "Potępienia", "Chaosu",
    ],
  },
};

/* =======================
   Dane – kryptonimy / Data – codenames
   ======================= */

// --- Kryptonimy oddziałów: przymiotnik w dwóch formach liczby mnogiej (niemęskoosobowa, męskoosobowa) / Unit codenames: adjective in two plural forms (non-personal, masculine-personal) ---
const UNIT = {
  patterns: [{ v: "adjNoun", w: 55 }, { v: "nounGen", w: 30 }, { v: "nounGreek", w: 15 }],
  adjectives: [
    ["Żelazne", "Żelaźni"], ["Czarne", "Czarni"], ["Popielne", "Popielni"], ["Purpurowe", "Purpurowi"],
    ["Milczące", "Milczący"], ["Ślepe", "Ślepi"], ["Ukryte", "Ukryci"], ["Złamane", "Złamani"], ["Siódme", "Siódmi"],
    ["Dziewiąte", "Dziewiąci"], ["Krwawe", "Krwawi"], ["Szare", "Szarzy"], ["Ostatnie", "Ostatni"],
    ["Nocne", "Nocni"], ["Stalowe", "Stalowi"], ["Zimne", "Zimni"], ["Wierne", "Wierni"], ["Samotne", "Samotni"],
    ["Martwe", "Martwi"], ["Bezimienne", "Bezimienni"], ["Szkarłatne", "Szkarłatni"], ["Pierwsze", "Pierwsi"],
    ["Trzecie", "Trzeci"], ["Blade", "Bladzi"], ["Wściekłe", "Wściekli"], ["Głodne", "Głodni"], ["Dzikie", "Dzicy"],
    ["Srebrne", "Srebrni"],
  ],
  // Rzeczowniki niemęskoosobowe (łączą się z formą „-e”) / Non-personal nouns (take the "-e" form)
  things: [
    "Ostrza", "Młoty", "Włócznie", "Straże", "Sępy", "Wilki", "Noże", "Pięści", "Cienie", "Kły", "Szpony", "Kruki",
    "Psy", "Węże", "Skorpiony", "Topory", "Tarcze", "Miecze", "Bagnety", "Ogary", "Szakale", "Jastrzębie", "Widma",
    "Kosy", "Gromy", "Iskry", "Żmije", "Szczury", "Sowy", "Sokoły", "Wrony",
  ],
  // Rzeczowniki męskoosobowe (łączą się z formą męskoosobową) / Masculine-personal nouns (take the personal form)
  persons: [
    "Łowcy", "Myśliwi", "Żniwiarze", "Włócznicy", "Strażnicy", "Jeźdźcy", "Pokutnicy", "Mściciele", "Grabarze",
    "Tropiciele", "Zwiadowcy", "Bracia", "Synowie", "Wartownicy", "Szermierze", "Krzyżowcy", "Wygnańcy", "Pielgrzymi",
  ],
  genitives: [
    "Świtu", "Nocy", "Popiołu", "Burzy", "Pustki", "Imperatora", "Terry", "Tronu", "Żelaza", "Gniewu", "Zmierzchu",
    "Pokuty", "Grzmotu", "Ognia", "Krwi", "Rdzy", "Cienia", "Zimy", "Stali", "Mgły", "Otchłani", "Kości", "Cierni",
    "Wojny",
  ],
  greek: [
    "Alfa", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Theta", "Jota", "Kappa", "Lambda", "Sigma", "Tau", "Omega",
  ],
};

// --- Kryptonimy operacji: rzeczowniki w liczbie pojedynczej z rodzajem i przymiotniki w trzech rodzajach / Operation codenames: singular nouns with gender and adjectives in three genders ---
const OPERATION = {
  patterns: [{ v: "adjNoun", w: 50 }, { v: "noun", w: 18 }, { v: "nounGen", w: 22 }, { v: "pair", w: 10 }],
  nouns: [
    { v: "Świt", g: "m" }, { v: "Zmierzch", g: "m" }, { v: "Horyzont", g: "m" }, { v: "Młot", g: "m" },
    { v: "Tron", g: "m" }, { v: "Płomień", g: "m" }, { v: "Wyrok", g: "m" }, { v: "Całun", g: "m" },
    { v: "Grom", g: "m" }, { v: "Mróz", g: "m" }, { v: "Popiół", g: "m" }, { v: "Welon", g: "m" },
    { v: "Kieł", g: "m" }, { v: "Sztylet", g: "m" }, { v: "Kielich", g: "m" }, { v: "Labirynt", g: "m" },
    { v: "Sierp", g: "m" }, { v: "Kamień", g: "m" }, { v: "Wiatr", g: "m" }, { v: "Monolit", g: "m" },
    { v: "Cisza", g: "f" }, { v: "Zasłona", g: "f" }, { v: "Litania", g: "f" }, { v: "Pochodnia", g: "f" },
    { v: "Rękawica", g: "f" }, { v: "Włócznia", g: "f" }, { v: "Kotwica", g: "f" }, { v: "Burza", g: "f" },
    { v: "Noc", g: "f" }, { v: "Zima", g: "f" }, { v: "Tarcza", g: "f" }, { v: "Korona", g: "f" },
    { v: "Przysięga", g: "f" }, { v: "Kurtyna", g: "f" }, { v: "Mgła", g: "f" }, { v: "Róża", g: "f" },
    { v: "Iglica", g: "f" }, { v: "Czaszka", g: "f" }, { v: "Gwiazda", g: "f" }, { v: "Brama", g: "f" },
    { v: "Niebo", g: "n" }, { v: "Żelazo", g: "n" }, { v: "Ostrze", g: "n" }, { v: "Światło", g: "n" },
    { v: "Słońce", g: "n" }, { v: "Echo", g: "n" }, { v: "Lustro", g: "n" }, { v: "Serce", g: "n" },
    { v: "Oko", g: "n" }, { v: "Sanktuarium", g: "n" }, { v: "Kowadło", g: "n" }, { v: "Żądło", g: "n" },
  ],
  adjectives: [
    ["Czarny", "Czarna", "Czarne"], ["Martwy", "Martwa", "Martwe"], ["Żelazny", "Żelazna", "Żelazne"],
    ["Ostatni", "Ostatnia", "Ostatnie"], ["Krwawy", "Krwawa", "Krwawe"], ["Pusty", "Pusta", "Puste"],
    ["Szary", "Szara", "Szare"], ["Czysty", "Czysta", "Czyste"], ["Zimny", "Zimna", "Zimne"],
    ["Szkarłatny", "Szkarłatna", "Szkarłatne"], ["Milczący", "Milcząca", "Milczące"], ["Złoty", "Złota", "Złote"],
    ["Blady", "Blada", "Blade"], ["Wieczny", "Wieczna", "Wieczne"], ["Święty", "Święta", "Święte"],
    ["Ślepy", "Ślepa", "Ślepe"], ["Srebrny", "Srebrna", "Srebrne"], ["Upadły", "Upadła", "Upadłe"],
    ["Rozbity", "Rozbita", "Rozbite"], ["Północny", "Północna", "Północne"], ["Głęboki", "Głęboka", "Głębokie"],
    ["Długi", "Długa", "Długie"], ["Popielny", "Popielna", "Popielne"], ["Szklany", "Szklana", "Szklane"],
    ["Nocny", "Nocna", "Nocne"], ["Ukryty", "Ukryta", "Ukryte"],
  ],
  tags: [
    { v: "", w: 10 }, { v: "Omega", w: 1 }, { v: "Sigma", w: 1 }, { v: "Kappa", w: 1 }, { v: "Delta", w: 1 },
    { v: "IX", w: 1 }, { v: "VII", w: 1 },
  ],
};

/* =======================
   Generatory pomocnicze / Helper generators
   ======================= */

// --- Indeks formy przymiotnika dla rodzaju: m → 0, f → 1, n → 2 / Adjective form index for a gender: m → 0, f → 1, n → 2 ---
function genderIndex(g) {
  if (g === "f") return 1;
  if (g === "n") return 2;
  return 0;
}

// --- Łacińska para „mianownik + dopełniacz” o różnych rdzeniach / Latin "nominative + genitive" pair with different roots ---
function latinPhrase(rand, nouns = LATIN.nouns, genitives = LATIN.genitives) {
  const noun = pickWeighted(nouns, rand);
  const gen = pickDifferentRoot(genitives, noun, rand);
  return `${noun} ${gen}`;
}

// --- Polska nazwa (niski gotyk): rzeczownik + dopełniacz, przymiotnik + rzeczownik, sam rzeczownik albo pełna fraza / Polish name (Low Gothic): noun + genitive, adjective + noun, noun alone, or a full phrase ---
function polishPhrase(rand) {
  const noun = pickItem(PL.nouns, rand);
  const adj = pickItem(PL.adjectives, rand)[genderIndex(noun.g)];
  const roll = rand();

  if (roll < 0.38) {
    return `${noun.v} ${pickDifferentRoot(PL.genitives, noun.v, rand)}`;
  }
  if (roll < 0.78) {
    return `${adj} ${noun.v}`;
  }
  if (roll < 0.88) {
    return noun.v;
  }
  return `${adj} ${noun.v} ${pickDifferentRoot(PL.genitives, noun.v, rand)}`;
}

// --- Ocena słowa sylabowego: bez 3 samogłosek z rzędu i bez powtórzonej zbitki (np. „Karkar”, „Lili”) / Syllabic word check: no 3 vowels in a row and no repeated chunk (e.g. "Karkar", "Lili") ---
function syllableOk(word) {
  return !/[aeiou]{3,}/i.test(word) && !/([a-z]{2,})\1/i.test(word);
}

// --- Buduje sylabowe słowo z puli {pre, mid, end} z zadaną szansą na 1 lub 2 środkowe sylaby / Builds a syllabic word from a {pre, mid, end} pool with a given chance of 1 or 2 middle syllables ---
// Pula bez flagi softVowels usuwa samogłoskę na styku samogłoska+samogłoska (Sau + okh → Saukh)
// A pool without the softVowels flag drops the vowel at a vowel+vowel joint (Sau + okh → Saukh)
function syllableWord(pool, rand, midChance = 0.5, secondMidChance = 0) {
  let word = "";
  for (let attempt = 0; attempt < 12; attempt++) {
    const parts = [pickWeighted(pool.pre, rand)];
    if (chance(midChance, rand)) parts.push(pickWeighted(pool.mid, rand));
    if (chance(secondMidChance, rand)) parts.push(pickWeighted(pool.mid, rand));
    parts.push(pickWeighted(pool.end, rand));

    if (!pool.softVowels) {
      for (let i = 1; i < parts.length; i++) {
        const prev = parts[i - 1];
        if (/[aeiouy]$/i.test(prev) && /^[aeiou]/i.test(parts[i]) && parts[i].length > 1) {
          parts[i] = parts[i].slice(1);
        }
      }
    }

    word = cap(buildName(parts));
    if (syllableOk(word)) return word;
  }
  return word;
}

// --- Angielski przydomek z dwóch list (np. Night + spear); człony nie mogą się powtarzać („Twist-twister”) / English epithet from two lists (e.g. Night + spear); parts must not repeat ("Twist-twister") ---
function epithet(preList, sufList, rand) {
  let pre = pickWeighted(preList, rand);
  let suf = pickWeighted(sufList, rand);
  for (let i = 0; i < 6 && suf.toLowerCase().startsWith(pre.toLowerCase()); i++) {
    pre = pickWeighted(preList, rand);
    suf = pickWeighted(sufList, rand);
  }
  return compoundWord(pre, suf);
}

/* =======================
   Generatory – ludzie Imperium / Generators – Imperial humans
   ======================= */

// --- Klasa niższa: imię + nazwisko w jednym ze stylów regionalnych, bez tytułów, zawodów i numerów / Lower class: given name + surname in a regional style, no titles, jobs or numbers ---
function genHumanLower(rand) {
  return tryGenerate(() => {
    const style = pickWeighted(HUMAN_LOWER.styles, rand);

    if (style === "latin") {
      return `${pick(HUMAN_LOWER.latinGiven, rand)} ${pick(HUMAN_LOWER.hiveSurname, rand)}`;
    }

    if (style === "slavic") {
      const female = chance(0.35, rand);
      const given = pick(female ? HUMAN_LOWER.slavicGivenF : HUMAN_LOWER.slavicGivenM, rand);
      let surname = pick(HUMAN_LOWER.slavicSurname, rand);
      // Żeńska forma nazwisk na -ov/-ev/-in (Volkov → Volkova) / Feminine form of -ov/-ev/-in surnames (Volkov → Volkova)
      if (female && /(ov|ev|in)$/.test(surname)) surname += "a";
      if (chance(0.25, rand)) {
        const patronymic = pick(female ? HUMAN_LOWER.slavicPatronymicF : HUMAN_LOWER.slavicPatronymicM, rand);
        return `${given} ${patronymic} ${surname}`;
      }
      return `${given} ${surname}`;
    }

    if (style === "desert") {
      const female = chance(0.35, rand);
      const given = pick(female ? HUMAN_LOWER.desertGivenF : HUMAN_LOWER.desertGivenM, rand);
      // Czasem zamiast nazwiska pojawia się imię ojca: ibn / bint / Sometimes the father's name replaces the surname: ibn / bint
      if (chance(0.3, rand)) {
        return `${given} ${female ? "bint" : "ibn"} ${pick(HUMAN_LOWER.desertGivenM, rand)}`;
      }
      return `${given} ${pick(HUMAN_LOWER.desertSurname, rand)}`;
    }

    if (style === "celtic") {
      return `${pick(HUMAN_LOWER.celticGiven, rand)} ${pick(HUMAN_LOWER.celticSurname, rand)}`;
    }

    if (style === "mono") {
      return pick(HUMAN_LOWER.mono, rand);
    }

    if (style === "hiveSingle") {
      return pick(HUMAN_LOWER.hiveGiven, rand);
    }

    return `${pick(HUMAN_LOWER.hiveGiven, rand)} ${pick(HUMAN_LOWER.hiveSurname, rand)}`;
  });
}

// --- Klasa wyższa: wysoki gotyk, drugie imię, partykuła szlachecka albo nazwisko dwuczłonowe; bez tytułów / Upper class: High Gothic, second given name, noble particle or double-barrelled surname; no titles ---
function genHumanUpper(rand) {
  return tryGenerate(() => {
    const style = pickWeighted(HUMAN_UPPER.styles, rand);
    const givenList = chance(0.5, rand) ? HUMAN_UPPER.givenF : HUMAN_UPPER.givenM;
    const given = pick(givenList, rand);
    const surname = pick(HUMAN_UPPER.surname, rand);

    if (style === "doubleGiven") {
      // Drugie imię z tej samej listy płci / Second given name from the same gender list
      return `${given} ${pick(givenList, rand)} ${surname}`;
    }
    if (style === "particle") {
      return `${given} ${pickWeighted(HUMAN_UPPER.particles, rand)} ${surname}`;
    }
    if (style === "doubleBarrel") {
      let second = pick(HUMAN_UPPER.surname, rand);
      for (let i = 0; i < 5 && second === surname; i++) second = pick(HUMAN_UPPER.surname, rand);
      return `${given} ${surname}-${second}`;
    }
    return `${given} ${surname}`;
  });
}

/* =======================
   Generatory – Sororitas i Astartes / Generators – Sororitas and Astartes
   ======================= */

// --- Sororitas: imię i nazwisko albo samo imię (jak w lore), bez „Siostra” i stopni / Sororitas: given name and surname or the given name alone (as in lore), without "Sister" or ranks ---
function genSororitas(rand) {
  return tryGenerate(() => {
    const given = pick(SORORITAS.given, rand);
    if (chance(0.22, rand)) return given;
    return `${given} ${pick(SORORITAS.surname, rand)}`;
  });
}

// --- Astartes: styl zakonu podany przez podkategorię albo (dla „Ogólne”) losowany z wagami; bez stopni (Brat, Sierżant, Kapitan) / Astartes: chapter style given by the subcategory or (for "General") picked by weight; no ranks (Brother, Sergeant, Captain) ---
function genAstartes(rand, forcedStyle) {
  return tryGenerate(() => {
    const style = forcedStyle || pickWeighted(ASTARTES.styles, rand);
    const roll = rand();

    if (style === "angelic") {
      const given = pick(ASTARTES.angelicGiven, rand);
      return roll < 0.35 ? given : `${given} ${pick(ASTARTES.codexCognomen, rand)}`;
    }

    if (style === "nordic") {
      const given = pick(ASTARTES.nordicGiven, rand);
      return roll < 0.25 ? given : `${given} ${epithet(ASTARTES.nordicPre, ASTARTES.nordicSuf, rand)}`;
    }

    if (style === "crusader") {
      const given = pick(ASTARTES.crusaderGiven, rand);
      return roll < 0.6 ? given : `${given} ${epithet(ASTARTES.gothicPre, ASTARTES.gothicSuf, rand)}`;
    }

    if (style === "salamander") {
      const apostropheName = `${pick(ASTARTES.salamanderA, rand)}'${pick(ASTARTES.salamanderB, rand)}`;
      if (roll < 0.45) return apostropheName;
      if (roll < 0.75) return `${apostropheName} ${pick(ASTARTES.salamanderSurname, rand)}`;
      return `${pick(ASTARTES.salamanderGiven, rand)} ${pick(ASTARTES.salamanderSurname, rand)}`;
    }

    if (style === "scars") {
      const given = pick(ASTARTES.scarsGiven, rand);
      return roll < 0.4 ? given : `${given} ${pick(ASTARTES.scarsClan, rand)}`;
    }

    // Styl kodeksowy: imię + łaciński przydomek, czasem gotycki przydomek albo samo imię / Codex style: given + Latin cognomen, sometimes a Gothic epithet or the given name alone
    const given = pick(ASTARTES.codexGiven, rand);
    if (roll < 0.65) return `${given} ${pick(ASTARTES.codexCognomen, rand)}`;
    if (roll < 0.85) return `${given} ${epithet(ASTARTES.gothicPre, ASTARTES.gothicSuf, rand)}`;
    return given;
  });
}

/* =======================
   Generatory – Adeptus Mechanicus / Generators – Adeptus Mechanicus
   ======================= */

// --- Oznaczenie z literą grecką i liczbą (np. „Theta-7”) / Designation with a Greek letter and number (e.g. "Theta-7") ---
function mechDesignation(rand, excludeAlpha = false) {
  let letter = pick(MECH.greek, rand);
  while (excludeAlpha && letter === "Alpha") letter = pick(MECH.greek, rand);
  return `${letter}-${rollInt(1, 99, rand)}`;
}

// --- Tech-kapłani: imię z przydomkiem, oznaczeniem albo numerem; bez tytułów (Magos, Enginseer) / Tech-priests: name with a cognomen, designation or number; no titles (Magos, Enginseer) ---
function genAdMechTech(rand) {
  return tryGenerate(() => {
    const style = pickWeighted(MECH.techStyles, rand);
    const given = pick(MECH.given, rand);

    if (style === "givenGreek") return `${given} ${mechDesignation(rand)}`;
    if (style === "givenNumCogn") return `${given}-${rollInt(2, 99, rand)} ${pick(MECH.cognomen, rand)}`;
    if (style === "proc") return syllableWord(MECH, rand, 0.75, 0.25);
    if (style === "procGreek") {
      const core = syllableWord(MECH, rand, 0.6);
      return chance(0.5, rand) ? `${core} ${pick(MECH.greek, rand)}` : `${core} ${mechDesignation(rand)}`;
    }
    return `${given} ${pick(MECH.cognomen, rand)}`;
  });
}

// --- Skitarii: oznaczenia literowo-liczbowe, imię z numerem albo zwykłe imię i nazwisko; bez stopni i typów oddziałów / Skitarii: letter-number designations, a name with a number, or a plain name; no ranks or unit types ---
function genAdMechSkit(rand) {
  return tryGenerate(() => {
    const style = pickWeighted(MECH.skitStyles, rand);
    const given = pick(MECH.skitGiven, rand);

    if (style === "greekNum") {
      const core = mechDesignation(rand, true);
      return chance(0.4, rand) ? `${core} ${pick(MECH.ordinals, rand)}` : core;
    }
    if (style === "givenNumCogn") return `${given}-${rollInt(2, 99, rand)} ${pick(MECH.skitCognomen, rand)}`;
    if (style === "givenGreek") {
      let letter = pick(MECH.greek, rand);
      while (letter === "Alpha") letter = pick(MECH.greek, rand);
      return chance(0.5, rand) ? `${given}-${letter} ${rollInt(2, 99, rand)}` : `${given}-${letter}`;
    }
    return `${given} ${pick(MECH.skitCognomen, rand)}`;
  });
}

/* =======================
   Generatory – Aeldari / Generators – Aeldari
   ======================= */

// --- Asuryani: imię sylabowe, czasem drugie imię albo przydomek; bez tytułów (Farseer, Autarcha) / Asuryani: syllabic name, sometimes a second name or an epithet; no titles (Farseer, Autarch) ---
function genAeldariCraft(rand) {
  return tryGenerate(() => {
    const name = syllableWord(AELDARI.craft, rand, 0.7, 0.2);
    const roll = rand();
    if (roll < 0.55) return name;
    if (roll < 0.75) return `${name} ${syllableWord(AELDARI.craft, rand, 0.5)}`;
    return `${name} ${epithet(AELDARI.craft.epiPre, AELDARI.craft.epiSuf, rand)}`;
  });
}

// --- Drukhari: imię i nazwisko rodowe, samo imię, forma z myślnikiem albo apostrofem; bez tytułów (Archont) / Drukhari: given and house name, a single name, a hyphen or apostrophe form; no titles (Archon) ---
function genAeldariDrukhari(rand) {
  return tryGenerate(() => {
    const pool = AELDARI.drukh;
    const name = syllableWord(pool, rand, 0.6, 0.15);
    const roll = rand();
    if (roll < 0.5) return `${name} ${syllableWord(pool, rand, 0.55)}`;
    if (roll < 0.78) return name;
    if (roll < 0.9) return `${name}-${pick(pool.hyphenTail, rand)}`;
    return `${pick(pool.apostrophePre, rand)}'${syllableWord(pool, rand, 0.4)}`;
  });
}

// --- Harlequini: imię z teatralnym przydomkiem, samo imię albo dwa imiona; bez ról (Solitaire, Death Jester) / Harlequins: name with a theatrical epithet, a single name or two names; no roles (Solitaire, Death Jester) ---
function genAeldariHarlequin(rand) {
  return tryGenerate(() => {
    const pool = AELDARI.harl;
    const name = syllableWord(pool, rand, 0.6);
    const roll = rand();
    if (roll < 0.55) return `${name} ${epithet(pool.epiPre, pool.epiSuf, rand)}`;
    if (roll < 0.8) return name;
    return `${name} ${syllableWord(pool, rand, 0.5)}`;
  });
}

/* =======================
   Generatory – Necroni i Orkowie / Generators – Necrons and Orks
   ======================= */

// --- Necroni – wojownicy: krótsze imiona 2-sylabowe / Necrons – warriors: shorter 2-syllable names ---
function genNecronWarrior(rand) {
  return tryGenerate(() => syllableWord(NECRON, rand, 0.15));
}

// --- Necroni – lordowie: dłuższe imiona, czasem z apostrofem albo światem-grobowcem („z …”); bez tytułów (Overlord, Phaeron) / Necrons – lords: longer names, sometimes with an apostrophe or tomb world ("z …"); no titles (Overlord, Phaeron) ---
function genNecronLord(rand) {
  return tryGenerate(() => {
    const roll = rand();
    if (roll < 0.12) {
      return `${cap(buildName([pickWeighted(NECRON.pre, rand), pickWeighted(NECRON.mid, rand)]))}'${pickWeighted(NECRON.end, rand)}`;
    }
    const name = syllableWord(NECRON, rand, 0.85, 0.1);
    if (roll < 0.27) {
      const place = cap(buildName([
        pickWeighted(NECRON.pre, rand),
        pickWeighted(NECRON.mid, rand),
        pick(NECRON.placeEnd, rand),
      ]));
      return `${name} z ${place}`;
    }
    return name;
  });
}

// --- Orkowie: gardłowe imię, imię z przechwałkowym przydomkiem albo sam przydomek; bez tytułów (Nob, Boss, Mek) / Orks: guttural name, name with a boastful epithet, or the epithet alone; no titles (Nob, Boss, Mek) ---
function genOrk(rand) {
  return tryGenerate(() => {
    const style = pickWeighted(ORK.styles, rand);
    const name = syllableWord(ORK, rand, 0.15);
    const boast = compoundWord(pick(ORK.epiPre, rand), pick(ORK.epiSuf, rand), chance(0.35, rand));
    if (style === "epithet") return `${name} ${boast}`;
    if (style === "epithetOnly") return cap(boast);
    return name;
  });
}

/* =======================
   Generatory – Chaos / Generators – Chaos
   ======================= */

// --- Chaos: imię sylabowe w stylu bóstwa, imię i nazwisko albo imię z mrocznym przydomkiem; bez tytułów (Czempion, Czarownik) / Chaos: syllabic name in the god's style, given + surname or given + dark epithet; no titles (Champion, Sorcerer) ---
function genChaos(rand, sub) {
  return tryGenerate(() => {
    const pool = CHAOS[sub];
    const name = syllableWord(pool, rand, 0.55, 0.1);
    const roll = rand();
    if (roll < 0.4) return name;
    if (roll < 0.6) return `${name} ${syllableWord(pool, rand, 0.45)}`;
    return `${name} ${epithet(pool.epiPre, pool.epiSuf, rand)}`;
  });
}

/* =======================
   Generatory – maszyny, okręty, kryptonimy / Generators – machines, ships, codenames
   ======================= */

// --- Maszyny bojowe: sama nazwa własna (polska albo łacińska), bez typu maszyny i bez cudzysłowów / War machines: the proper name only (Polish or Latin), without the machine type or quotes ---
function genWarMachine(rand, kind) {
  const data = WAR[kind] || WAR.air;
  return tryGenerate(
    () => (chance(data.latinChance, rand) ? latinPhrase(rand) : polishPhrase(rand)),
    RESERVED_VESSEL_INDEX
  );
}

// --- Polska fraza „przymiotnik + rzeczownik” z formą zgodną z rodzajem / Polish "adjective + noun" phrase with the gender-matching form ---
function adjNounPhrase(pool, rand) {
  const noun = pickItem(pool.nouns, rand);
  return `${pick(pool.adjectives, rand)[genderIndex(noun.g)]} ${noun.v}`;
}

// --- Okręty: wzorzec losowany z wag frakcji; nazwy polskie, łacińskie zostają po łacinie / Ships: pattern picked from faction weights; Polish names, Latin ones stay in Latin ---
function genShip(rand, faction) {
  const pool = SHIP[faction];

  return tryGenerate(() => {
    const pattern = pickWeighted(pool.patterns, rand);
    const noun = pickItem(pool.nouns, rand);

    if (pattern === "latin") return latinPhrase(rand);
    if (pattern === "mechLatin") return latinPhrase(rand, pool.latinNouns, pool.latinGenitives);
    if (pattern === "single") return pick(pool.single, rand);
    if (pattern === "noun") return noun.v;
    if (pattern === "nounGen") return `${noun.v} ${pickDifferentRoot(pool.genitives, noun.v, rand)}`;
    // Poetycki szyk odwrócony: rzeczownik + przymiotnik („Pieśń Gwiezdna”) / Poetic inverted order: noun + adjective ("Pieśń Gwiezdna")
    if (pattern === "nounAdj") return `${noun.v} ${pick(pool.adjectives, rand)[genderIndex(noun.g)]}`;
    if (pattern === "adjNounGen") {
      return `${pick(pool.adjectives, rand)[genderIndex(noun.g)]} ${noun.v} ${pickDifferentRoot(pool.genitives, noun.v, rand)}`;
    }
    // Rzeczownik + imię Necrona w dopełniaczu (imiona kończą się spółgłoską, więc dopisujemy „a”: Nebkatekh → Nebkatekha) / Noun + Necron name in the genitive (names end with a consonant, so "a" is added)
    if (pattern === "nounNecron") return `${noun.v} ${syllableWord(NECRON, rand, 0.5)}a`;
    return adjNounPhrase(pool, rand);
  }, RESERVED_VESSEL_INDEX);
}

// --- Kryptonimy oddziałów: przymiotnik zgodny z rodzajem, rzeczownik z dopełniaczem albo litera grecka / Unit codenames: gender-agreeing adjective, noun with a genitive, or a Greek letter ---
function genUnitCodename(rand) {
  return tryGenerate(() => {
    const pattern = pickWeighted(UNIT.patterns, rand);
    const personal = chance(0.35, rand);
    const noun = pick(personal ? UNIT.persons : UNIT.things, rand);

    if (pattern === "nounGen") return `${noun} ${pickDifferentRoot(UNIT.genitives, noun, rand)}`;
    if (pattern === "nounGreek") return `${noun} ${pick(UNIT.greek, rand)}`;
    const adj = pick(UNIT.adjectives, rand)[personal ? 1 : 0];
    return `${adj} ${noun}`;
  }, RESERVED_VESSEL_INDEX);
}

// --- Kryptonimy operacji: sama fraza z poprawnym rodzajem + opcjonalny znacznik, bez słowa „Operacja” / Operation codenames: gender-correct phrase + optional tag only, without the word "Operacja" ---
function genOperationCodename(rand) {
  return tryGenerate(() => {
    const pattern = pickWeighted(OPERATION.patterns, rand);
    const noun = pickItem(OPERATION.nouns, rand);
    let core;

    if (pattern === "noun") {
      core = noun.v;
    } else if (pattern === "nounGen") {
      core = `${noun.v} ${pickDifferentRoot(UNIT.genitives, noun.v, rand)}`;
    } else if (pattern === "pair") {
      let second = pickItem(OPERATION.nouns, rand);
      for (let i = 0; i < 5 && second.v === noun.v; i++) second = pickItem(OPERATION.nouns, rand);
      core = `${noun.v} i ${second.v}`;
    } else {
      core = `${pickItem(OPERATION.adjectives, rand)[genderIndex(noun.g)]} ${noun.v}`;
    }

    const tag = pickWeighted(OPERATION.tags, rand);
    return tag ? `${core} ${tag}` : core;
  }, RESERVED_VESSEL_INDEX);
}

/* =======================
   Kategorie i opcje UI / UI categories and options
   ======================= */
// Kolejność kategorii i opcji to kolejność na listach; po otwarciu wybrana jest pierwsza opcja pierwszej kategorii (Ludzie → Klasa Niższa)
// Category and option order is the list order; on open the first option of the first category is selected (Humans → Lower Class)
const DATA = [
  {
    key: "humans",
    name: "Ludzie",
    nameEn: "Humans",
    options: [
      { key: "lower", name: "Klasa Niższa", nameEn: "Lower Class", gen: (r) => genHumanLower(r) },
      { key: "upper", name: "Klasa Wyższa", nameEn: "Higher Class", gen: (r) => genHumanUpper(r) },
    ],
  },
  {
    key: "admech",
    name: "Adeptus Mechanicus",
    nameEn: "Adeptus Mechanicus",
    options: [
      { key: "tp", name: "Tech-Kapłani", nameEn: "Tech-Priests", gen: (r) => genAdMechTech(r) },
      { key: "skit", name: "Skitarii", nameEn: "Skitarii", gen: (r) => genAdMechSkit(r) },
    ],
  },
  {
    key: "astartes",
    name: "Adeptus Astartes",
    nameEn: "Adeptus Astartes",
    // „Ogólne” miesza wszystkie style; pozostałe podkategorie wymuszają jeden styl zakonu / "General" mixes all styles; the other subcategories force one chapter style
    options: [
      { key: "standard", name: "Ogólne", nameEn: "General", gen: (r) => genAstartes(r) },
      { key: "codex", name: "Kodeksowe (Ultramarines)", nameEn: "Codex (Ultramarines)", gen: (r) => genAstartes(r, "codex") },
      { key: "nordic", name: "Nordyckie (Kosmiczne Wilki)", nameEn: "Nordic (Space Wolves)", gen: (r) => genAstartes(r, "nordic") },
      { key: "angelic", name: "Anielskie (Mroczne i Krwawe Anioły)", nameEn: "Angelic (Dark and Blood Angels)", gen: (r) => genAstartes(r, "angelic") },
      { key: "crusader", name: "Krzyżowcy (Czarni Templariusze)", nameEn: "Crusader (Black Templars)", gen: (r) => genAstartes(r, "crusader") },
      { key: "salamander", name: "Nokturne (Salamandry)", nameEn: "Nocturne (Salamanders)", gen: (r) => genAstartes(r, "salamander") },
      { key: "scars", name: "Czogoris (Białe Blizny)", nameEn: "Chogoris (White Scars)", gen: (r) => genAstartes(r, "scars") },
    ],
  },
  {
    key: "sororitas",
    name: "Adepta Sororitas",
    nameEn: "Adepta Sororitas",
    options: [{ key: "sister", name: "Sororitas", nameEn: "Sororitas", gen: (r) => genSororitas(r) }],
  },
  {
    key: "chaos",
    name: "Chaos",
    nameEn: "Chaos",
    options: [
      { key: "und", name: "Undivided", nameEn: "Undivided", gen: (r) => genChaos(r, "undiv") },
      { key: "kho", name: "Khorne", nameEn: "Khorne", gen: (r) => genChaos(r, "khorne") },
      { key: "nur", name: "Nurgle", nameEn: "Nurgle", gen: (r) => genChaos(r, "nurgle") },
      { key: "tze", name: "Tzeentch", nameEn: "Tzeentch", gen: (r) => genChaos(r, "tzeent") },
      { key: "sla", name: "Slaanesh", nameEn: "Slaanesh", gen: (r) => genChaos(r, "slaan") },
    ],
  },
  {
    key: "aeldari",
    name: "Aeldari",
    nameEn: "Aeldari",
    options: [
      { key: "craft", name: "Craftworld (Asuryani)", nameEn: "Craftworld (Asuryani)", gen: (r) => genAeldariCraft(r) },
      { key: "druk", name: "Drukhari", nameEn: "Drukhari", gen: (r) => genAeldariDrukhari(r) },
      { key: "har", name: "Harlequins", nameEn: "Harlequins", gen: (r) => genAeldariHarlequin(r) },
    ],
  },
  {
    key: "orks",
    name: "Orkowie",
    nameEn: "Orks",
    options: [
      { key: "boy", name: "Orkowie", nameEn: "Orks", gen: (r) => genOrk(r) },
    ],
  },
  {
    key: "necron",
    name: "Nekroni",
    nameEn: "Necrons",
    options: [
      { key: "warrior", name: "Wojownicy", nameEn: "Warriors", gen: (r) => genNecronWarrior(r) },
      { key: "lord", name: "Lordowie", nameEn: "Lords", gen: (r) => genNecronLord(r) },
    ],
  },
  {
    key: "ships",
    name: "Okręty Gwiezdne",
    nameEn: "Starships",
    options: [
      { key: "imp", name: "Imperium (Navy)", nameEn: "Imperium (Navy)", gen: (r) => genShip(r, "imperial") },
      { key: "ast", name: "Astartes", nameEn: "Astartes", gen: (r) => genShip(r, "astartes") },
      { key: "mec", name: "Adeptus Mechanicus", nameEn: "Adeptus Mechanicus", gen: (r) => genShip(r, "mechanicus") },
      { key: "eld", name: "Aeldari", nameEn: "Aeldari", gen: (r) => genShip(r, "eldar") },
      { key: "drk", name: "Drukhari", nameEn: "Drukhari", gen: (r) => genShip(r, "drukhari") },
      { key: "ork", name: "Orkowie", nameEn: "Orks", gen: (r) => genShip(r, "ork") },
      { key: "nec", name: "Nekroni", nameEn: "Necrons", gen: (r) => genShip(r, "necron") },
      { key: "cha", name: "Chaos", nameEn: "Chaos", gen: (r) => genShip(r, "chaos") },
    ],
  },
  {
    key: "warmachines",
    name: "Maszyny Bojowe (Imperium)",
    nameEn: "War machines (Imperium)",
    options: [
      { key: "tank", name: "Czołgi", nameEn: "Tanks", gen: (r) => genWarMachine(r, "tank") },
      { key: "titan", name: "Tytany", nameEn: "Titans", gen: (r) => genWarMachine(r, "titan") },
      { key: "knight", name: "Rycerze", nameEn: "Knights", gen: (r) => genWarMachine(r, "knight") },
      { key: "air", name: "Lotnictwo", nameEn: "Air Wing", gen: (r) => genWarMachine(r, "air") },
    ],
  },
  {
    key: "unitcodes",
    name: "Kryptonimy Oddziałów",
    nameEn: "Unit codenames",
    options: [
      { key: "standard", name: "Kryptonim oddziału", nameEn: "Unit codename", gen: (r) => genUnitCodename(r) },
    ],
  },
  {
    key: "opcodes",
    name: "Kryptonimy Operacji",
    nameEn: "Operation codenames",
    options: [
      { key: "standard", name: "Kryptonim operacji", nameEn: "Operation codename", gen: (r) => genOperationCodename(r) },
    ],
  },
];

/* =======================
   Obsługa UI / UI wiring
   ======================= */
// --- MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT ---
// Przy nowej wersji językowej dodaj słownik w translations i upewnij się, że wszystkie opisy generatora mają odpowiedniki.
// For a new language version, add a dictionary in translations and ensure every generator description has an equivalent.
const translations = {
  pl: {
    labels: {
      languageSelect: "Wersja językowa",
      category: "Kategoria",
      option: "Opcja",
      seed: "Seed",
      count: "Ile",
      generate: "Generuj",
      copy: "Kopiuj wynik",
      randomAuto: "Losowo: TAK",
      randomSeed: "Losowo: SEED",
      resultsPlaceholder: "Wybierz kategorię i kliknij „Generuj”.",
      seedHint: "Seed = te same ustawienia → te same wyniki. Brak seeda = prawdziwie losowe.",
      seedPlaceholder: "wpisz cokolwiek",
      copiedSuffix: "skopiowano",
      copyError: "Nie mogę skopiować (blokada przeglądarki). Zaznacz i skopiuj ręcznie.",
    },
  },
  en: {
    labels: {
      languageSelect: "Language version",
      category: "Category",
      option: "Option",
      seed: "Seed",
      count: "How many",
      generate: "Generate",
      copy: "Copy result",
      randomAuto: "Random: YES",
      randomSeed: "Random: SEED",
      resultsPlaceholder: "Choose a category and click “Generate”.",
      seedHint: "Seed = same settings → same results. No seed = truly random.",
      seedPlaceholder: "type anything",
      copiedSuffix: "copied",
      copyError: "Cannot copy (browser restriction). Select the text and copy it manually.",
    },
  },
};

// --- Referencje do elementów DOM / DOM element references ---
const catEl = document.getElementById("cat");
const optEl = document.getElementById("opt");
const seedEl = document.getElementById("seed");
const countEl = document.getElementById("count");
const resEl = document.getElementById("res");
const modePill = document.getElementById("modePill");
const languageSelect = document.getElementById("languageSelect");
const labelCategory = document.getElementById("labelCategory");
const labelOption = document.getElementById("labelOption");
const labelSeed = document.getElementById("labelSeed");
const labelCount = document.getElementById("labelCount");
const seedHint = document.getElementById("seedHint");
const generateButton = document.getElementById("gen");
const copyButton = document.getElementById("copy");

let currentLanguage = "pl";

// --- Zwraca nazwę kategorii/opcji w aktywnym języku / Returns the category/option name in the active language ---
function getLocalizedName(item) {
  if (currentLanguage === "en") {
    return item.nameEn || item.name;
  }
  return item.name;
}

// --- Funkcja aktualizująca teksty w wybranym języku i odtwarzająca listy z zachowaniem wyboru / Function updating texts in the selected language and rebuilding lists while keeping the selection ---
const applyLanguage = (lang) => {
  currentLanguage = lang;
  const t = translations[lang].labels;
  document.documentElement.lang = lang;
  languageSelect.value = lang;
  languageSelect.setAttribute("aria-label", t.languageSelect);
  labelCategory.textContent = t.category;
  labelOption.textContent = t.option;
  labelSeed.textContent = t.seed;
  labelCount.textContent = t.count;
  generateButton.textContent = t.generate;
  copyButton.textContent = t.copy;
  seedHint.textContent = t.seedHint;
  seedEl.placeholder = t.seedPlaceholder;

  if (resEl.dataset.hasResults !== "true") {
    resEl.textContent = t.resultsPlaceholder;
  }

  const selectedCategory = catEl.value;
  const selectedOption = optEl.value;
  populateCats();
  if (selectedCategory) {
    catEl.value = selectedCategory;
  }
  populateOpts();
  if (selectedOption) {
    optEl.value = selectedOption;
  }
};

// --- Wypełnia listę kategorii na podstawie DATA / Fills the category list from DATA ---
function populateCats() {
  catEl.innerHTML = "";
  for (const c of DATA) {
    const o = document.createElement("option");
    o.value = c.key;
    o.textContent = getLocalizedName(c);
    catEl.appendChild(o);
  }
}

// --- Wypełnia listę opcji dla wybranej kategorii (pierwsza opcja jest domyślna) / Fills the option list for the selected category (the first option is the default) ---
function populateOpts() {
  const cat = DATA.find((x) => x.key === catEl.value) || DATA[0];
  optEl.innerHTML = "";
  for (const op of cat.options) {
    const o = document.createElement("option");
    o.value = op.key;
    o.textContent = getLocalizedName(op);
    optEl.appendChild(o);
  }
}

// --- Limity pola „Ile” (muszą zgadzać się z atrybutami min/max w index.html) / "How many" field limits (must match the min/max attributes in index.html) ---
const MIN_COUNT = 1;
const MAX_COUNT = 50;

// --- Sprowadza wpisaną wartość do liczby całkowitej z zakresu MIN_COUNT..MAX_COUNT / Clamps the entered value to an integer in the MIN_COUNT..MAX_COUNT range ---
function clampCount(value) {
  // Number() rozumie też zapis wklejony z klawiatury, np. „1e3” = 1000 / Number() also understands pasted notation, e.g. "1e3" = 1000
  const n = Math.floor(Number(value));
  if (String(value).trim() === "" || !Number.isFinite(n) || n < MIN_COUNT) return MIN_COUNT;
  if (n > MAX_COUNT) return MAX_COUNT;
  return n;
}

// --- Blokada znaków, które pole liczbowe przyjmuje, ale nie są liczbą całkowitą (e, +, -, przecinek, kropka) / Blocks characters a number field accepts that are not an integer (e, +, -, comma, dot) ---
countEl.addEventListener("keydown", (event) => {
  if (["e", "E", "+", "-", ".", ","].includes(event.key)) {
    event.preventDefault();
  }
});

// --- Podczas wpisywania: wartość powyżej 50 od razu zamienia się na 50; puste pole jest dozwolone do czasu opuszczenia pola / While typing: a value above 50 immediately becomes 50; an empty field is allowed until the field loses focus ---
countEl.addEventListener("input", () => {
  if (countEl.value === "") return;
  const n = Number(countEl.value);
  if (!Number.isInteger(n) || n > MAX_COUNT || String(n) !== countEl.value) {
    countEl.value = String(clampCount(countEl.value));
  }
});

// --- Po opuszczeniu pola: puste lub mniejsze niż 1 zamienia się na 1 / On leaving the field: empty or below 1 becomes 1 ---
countEl.addEventListener("change", () => {
  countEl.value = String(clampCount(countEl.value));
});

// --- Generuje listę nazw bez powtórzeń w obrębie jednej listy / Generates a name list without repeats within one list ---
function generate() {
  const cat = DATA.find((x) => x.key === catEl.value);
  const opt = cat.options.find((x) => x.key === optEl.value);

  const { rand, mode } = makeRng(seedEl.value);
  const labels = translations[currentLanguage].labels;
  modePill.textContent = mode === "seed" ? labels.randomSeed : labels.randomAuto;

  // Liczba wyników zawsze w zakresie 1–50, a pole pokazuje faktycznie użytą wartość / Result count always within 1–50, and the field shows the value actually used
  const n = clampCount(countEl.value);
  countEl.value = String(n);

  const lines = [];
  const seen = new Set();
  for (let i = 0; i < n; i++) {
    let name = "";
    // Do 12 prób na pozycję, aby ta sama nazwa nie pojawiła się dwa razy na liście / Up to 12 attempts per slot so the same name does not appear twice in the list
    for (let attempt = 0; attempt < 12; attempt++) {
      name = cleanName(opt.gen(rand));
      if (name && !seen.has(name.toLowerCase())) break;
    }
    seen.add(name.toLowerCase());
    lines.push(`• ${name}`);
  }
  resEl.textContent = lines.join("\n");
  resEl.dataset.hasResults = "true";
}

// --- Obsługa przycisku generowania / Generate button handler ---
document.getElementById("gen").addEventListener("click", generate);

// --- Kopiowanie wyników do schowka z chwilowym potwierdzeniem w znaczniku trybu / Copy results to the clipboard with a short confirmation in the mode pill ---
document.getElementById("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(resEl.textContent);
    const prev = modePill.textContent;
    modePill.textContent = `${prev} | ${translations[currentLanguage].labels.copiedSuffix}`;
    setTimeout(() => {
      modePill.textContent = prev;
    }, 900);
  } catch (e) {
    alert(translations[currentLanguage].labels.copyError);
  }
});

// --- Zmiana kategorii odświeża opcje i generuje wynik; zmiana opcji generuje wynik / Category change rebuilds options and generates; option change generates ---
catEl.addEventListener("change", () => {
  populateOpts();
  generate();
});
optEl.addEventListener("change", generate);

// --- Inicjalizacja modułu / Module initialization ---
populateCats();
populateOpts();
resEl.dataset.hasResults = "false";
applyLanguage(currentLanguage);
languageSelect.addEventListener("change", (event) => {
  applyLanguage(event.target.value);
  generate();
});

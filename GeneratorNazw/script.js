/* =======================
   RNG (seed lub crypto)
   ======================= */
function xfnv1a(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function cryptoRand() {
  const u = new Uint32Array(1);
  crypto.getRandomValues(u);
  return u[0] / 4294967296;
}
function makeRng(seedStr) {
  if (seedStr && seedStr.trim().length) {
    const seed = xfnv1a(seedStr.trim());
    return { rand: mulberry32(seed), mode: "seed" };
  }
  return { rand: cryptoRand, mode: "auto" };
}

/* =======================
   Helpers
   ======================= */
function pick(arr, rand) {
  return arr[Math.floor(rand() * arr.length)];
}
function chance(p, rand) {
  return rand() < p;
}
function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
function cleanName(s) {
  // dodatkowe zabezpieczenie: usuń cudzysłowy, nawiasy, podwójne spacje
  return String(s)
    .replace(/[“”"]/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* =======================
   “Klocki” (proceduralne)
   – bez kanonu
   ======================= */

// LUDZIE: Wyższa vs Niższa (oddzielne brzmienie)
const HUMAN = {
  upper: {
    givenA: [
      "Aure",
      "Cassi",
      "Seve",
      "Octa",
      "Vale",
      "Lucia",
      "Domi",
      "Hadri",
      "Marce",
      "Serap",
      "Calpi",
      "Veri",
      "Honori",
      "Isol",
      "Adeli",
      "Celesti",
      "Corvi",
      "Gide",
      "Malach",
      "Eras",
    ],
    givenB: [
      "lian",
      "anus",
      "rin",
      "tian",
      "ria",
      "nius",
      "dric",
      "nora",
      "lius",
      "phine",
      "purnia",
      "tus",
      "oria",
      "dine",
      "line",
      "stine",
      "nus",
      "eon",
      "chai",
      "mus",
    ],
    surRoot: [
      "Vorn",
      "Kessel",
      "Varro",
      "Stroud",
      "Cald",
      "Ferr",
      "Thane",
      "Roth",
      "Serr",
      "Malk",
      "Cairn",
      "Bex",
      "Ulric",
      "Kov",
      "Garr",
      "Vayne",
      "Hale",
      "Mord",
      "Sable",
      "Praxis",
    ],
    surSuf: [
      "ius",
      "ian",
      "ov",
      "ski",
      "son",
      "hart",
      "wick",
      "ford",
      "croft",
      "borne",
      "vale",
      "lock",
      "ward",
      "more",
      "ley",
      "mere",
      "holt",
      "grim",
      "en",
      "an",
    ],
  },
  lower: {
    givenA: [
      "Jax",
      "Kade",
      "Rook",
      "Venn",
      "Orlo",
      "Sly",
      "Brann",
      "Kerr",
      "Mako",
      "Stenn",
      "Rafe",
      "Holt",
      "Cutter",
      "Nox",
      "Tarn",
      "Vik",
      "Rex",
      "Dane",
      "Skell",
      "Kellan",
    ],
    givenB: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "-7",
      "-9",
      "-13",
      "-21",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    surRoot: [
      "Brask",
      "Krail",
      "Drax",
      "Kane",
      "Voss",
      "Kerr",
      "Tarn",
      "Grit",
      "Sump",
      "Ragg",
      "Kord",
      "Nail",
      "Scrap",
      "Murk",
      "Gash",
      "Stitch",
      "Rivet",
      "Grim",
      "Smog",
      "Cinder",
    ],
    surSuf: ["", "", "", "", "", "", "-V", "-X", "-IX", "", "son", "en", "er", "", "lock", "", "ward", "", "", ""],
  },
};

// ASTARTES: krótko i “bojowo”
const ASTARTES = {
  pre: [
    "Var",
    "Cat",
    "Sev",
    "Tib",
    "Aq",
    "Dru",
    "Hel",
    "Gal",
    "Mor",
    "Val",
    "Ren",
    "Kas",
    "Bor",
    "Cor",
    "Sar",
    "Luc",
    "Mar",
    "Darn",
    "Rhen",
    "Acast",
  ],
  mid: [
    "ia",
    "o",
    "e",
    "u",
    "a",
    "i",
    "ae",
    "io",
    "or",
    "ar",
    "en",
    "an",
    "us",
    "on",
    "ir",
    "al",
    "ur",
    "is",
    "um",
    "el",
  ],
  end: [
    "nus",
    "rius",
    "dor",
    "lius",
    "tus",
    "ran",
    "mir",
    "kon",
    "dax",
    "vorn",
    "cai",
    "drak",
    "grimm",
    "noct",
    "sable",
    "thrax",
    "ferr",
    "uln",
    "kast",
    "vor",
  ],
  cognA: [
    "Iron",
    "Black",
    "Storm",
    "Void",
    "Ash",
    "Blood",
    "Stone",
    "Dawn",
    "Grim",
    "Star",
    "Night",
    "Oath",
    "Steel",
    "Frost",
    "Raven",
    "Wolf",
    "Spear",
    "Hammer",
    "Shield",
    "Gale",
  ],
  cognB: [
    "hand",
    "blade",
    "born",
    "guard",
    "reaver",
    "ward",
    "heart",
    "fist",
    "howl",
    "strike",
    "mantle",
    "watch",
    "crown",
    "hunt",
    "march",
    "breaker",
    "caller",
    "sunder",
    "mark",
    "claw",
  ],
};

// ADMECH: “binharic”/techno-łacina, bez tytułów i dopisków
const MECH = {
  pre: [
    "Ferr",
    "Cogn",
    "Omni",
    "Mach",
    "Volt",
    "Syn",
    "Noos",
    "Logi",
    "Cyt",
    "Prax",
    "Aug",
    "Data",
    "Rho",
    "Sigma",
    "Kappa",
    "Delta",
    "Theta",
    "Gamma",
    "Proto",
    "Hex",
  ],
  mid: [
    "um",
    "itor",
    "on",
    "ex",
    "aris",
    "eon",
    "aph",
    "or",
    "axis",
    "al",
    "ion",
    "atus",
    "et",
    "icus",
    "om",
    "orithm",
    "plex",
    "metry",
    "gnosis",
    "forge",
  ],
  suf: [
    "ix",
    "or",
    "a",
    "us",
    "is",
    "um",
    "eta",
    "-9",
    "-11",
    "-17",
    "-23",
    "-41",
    "-77",
    "-101",
    "Prime",
    "Secundus",
    "Tertius",
    "IV",
    "VII",
  ],
  tag: [
    "M-",
    "KX-",
    "VX-",
    "RX-",
    "TX-",
    "Sigma-",
    "Omni-",
    "Noos-",
    "Data-",
    "Hex-",
  ],
};

// AELDARI (Craftworld / Drukhari / Harlequin) – same nazwy
const AELDARI = {
  craft: {
    pre: [
      "Ae",
      "Ara",
      "Eli",
      "Ili",
      "Lia",
      "Mae",
      "Sha",
      "Yv",
      "Fae",
      "Dyr",
      "Kae",
      "Nai",
      "Syr",
      "Thal",
      "Vael",
      "Cyr",
      "Idr",
      "Ky",
      "Lath",
      "Nu",
    ],
    mid: [
      "ra",
      "li",
      "th",
      "sha",
      "ly",
      "na",
      "re",
      "v",
      "ss",
      "dr",
      "ae",
      "io",
      "yr",
      "el",
      "an",
      "en",
      "or",
      "ith",
      "sa",
      "qu",
    ],
    end: [
      "ion",
      "iel",
      "ar",
      "eth",
      "ael",
      "yra",
      "wyn",
      "ith",
      "as",
      "oriel",
      "essar",
      "mir",
      "niel",
      "thir",
      "vian",
      "rael",
    ],
  },
  drukh: {
    pre: [
      "As",
      "Dra",
      "Mal",
      "Vex",
      "Xae",
      "Zy",
      "Kha",
      "Naz",
      "Bel",
      "Ara",
      "Cru",
      "Sha",
      "Thra",
      "Lel",
      "Draz",
    ],
    mid: [
      "ru",
      "za",
      "x",
      "th",
      "sh",
      "el",
      "ae",
      "i",
      "o",
      "y",
      "rr",
      "kk",
      "zz",
      "v",
      "dr",
      "kr",
      "n",
    ],
    end: [
      "bael",
      "keth",
      "ax",
      "esh",
      "ar",
      "yx",
      "vrax",
      "ith",
      "zhar",
      "saar",
      "malys",
      "hesp",
      "vecth",
      "drah",
      "scar",
    ],
  },
  harl: {
    pre: [
      "Ky",
      "Mo",
      "D'ye",
      "Idra",
      "Ase",
      "Lye",
      "Va",
      "Sae",
      "Thae",
      "Yl",
      "Fae",
      "Cael",
      "Nu",
      "Ere",
      "Lle",
    ],
    mid: [
      "la",
      "ra",
      "e",
      "i",
      "o",
      "ae",
      "ss",
      "th",
      "lith",
      "mir",
      "rael",
      "quor",
      "hynn",
      "sael",
      "vyr",
    ],
    end: [
      "nil",
      "ley",
      "song",
      "spear",
      "blade",
      "shade",
      "wyn",
      "light",
      "mask",
      "dance",
      "whisper",
      "gleam",
    ],
  },
};

// NECRON – same nazwy
const NECRON = {
  pre: [
    "An",
    "Imo",
    "Tra",
    "Ori",
    "Sza",
    "Kam",
    "Zah",
    "Nek",
    "Pha",
    "Khep",
    "Men",
    "Set",
    "Nih",
    "Meph",
    "Nov",
    "Sek",
    "Cair",
    "Shrou",
    "Scy",
  ],
  mid: [
    "ka",
    "tekh",
    "ryn",
    "ra",
    "to",
    "ki",
    "sa",
    "rekh",
    "ph",
    "men",
    "oth",
    "ekh",
    "zar",
    "t",
    "khet",
    "mose",
    "sek",
    "sha",
    "cyr",
  ],
  end: [
    "ekh",
    "otekh",
    "ryn",
    "kar",
    "takh",
    "rekh",
    "khet",
    "zar",
    "sakh",
    "thor",
    "mose",
    "seth",
    "nih",
    "meph",
    "nov",
  ],
};

// ORK – same nazwy (bez “Warboss”, bez dopisków)
const ORK = {
  pre: [
    "Ghaz",
    "Snag",
    "Naz",
    "Waz",
    "Grog",
    "Skab",
    "Ugr",
    "Dreg",
    "Ruk",
    "Mog",
    "Zog",
    "Klaw",
    "Rippa",
    "Grim",
    "Badr",
    "Skull",
    "Krump",
    "Gitz",
  ],
  mid: [
    "g",
    "k",
    "z",
    "kr",
    "rag",
    "sm",
    "dakk",
    "sn",
    "gutz",
    "ur",
    "teef",
    "gob",
    "sk",
    "bash",
    "chop",
    "lug",
    "stomp",
  ],
  end: [
    "gull",
    "rod",
    "dreg",
    "dakka",
    "teef",
    "smek",
    "krumpa",
    "skull",
    "nob",
    "boss",
    "grot",
    "lugga",
    "stompa",
    "choppa",
    "gitz",
    "snagga",
  ],
};

// CHAOS – osobne “smaki” per bóg, ale wynik to zawsze samo imię
const CHAOS = {
  undiv: {
    pre: [
      "Ab",
      "Mor",
      "Vek",
      "Zar",
      "Bel",
      "Aza",
      "Xar",
      "Dae",
      "Mal",
      "Kor",
      "Nex",
      "Var",
      "Tor",
      "Kha",
      "Ul",
    ],
    mid: ["ra", "zu", "no", "the", "sse", "ur", "i", "o", "ae", "yx", "zz", "th", "vor", "kar", "el"],
    end: [
      "gon",
      "rax",
      "mord",
      "thar",
      "loth",
      "zeth",
      "vyr",
      "esh",
      "akor",
      "ion",
      "azar",
      "ith",
      "ul",
      "tor",
      "vex",
    ],
  },
  khorne: {
    pre: [
      "Kh",
      "Kar",
      "Gor",
      "Rag",
      "Skar",
      "Bra",
      "Khor",
      "Vra",
      "Ghar",
      "Ruk",
      "Dra",
      "Kha",
      "Zar",
      "Kor",
      "Gr",
    ],
    mid: ["a", "o", "u", "ra", "ga", "kha", "gru", "zor", "rak", "th", "zz", "ur", "akh", "orr", "rag"],
    end: [
      "thar",
      "gor",
      "krag",
      "zakh",
      "gorn",
      "rakk",
      "skar",
      "drox",
      "khul",
      "mord",
      "rax",
      "zarr",
      "vorn",
      "gash",
      "rend",
    ],
  },
  nurgle: {
    pre: [
      "Nur",
      "Mog",
      "Pox",
      "Rot",
      "Glo",
      "Bub",
      "Muc",
      "Fet",
      "Gur",
      "Slud",
      "Mor",
      "Plag",
      "Sour",
      "Vile",
      "Mold",
    ],
    mid: ["a", "o", "u", "ru", "lo", "mu", "gu", "zz", "dr", "th", "ag", "ur", "og", "il", "en"],
    end: [
      "mire",
      "rot",
      "pox",
      "gore",
      "slime",
      "mold",
      "blight",
      "filth",
      "drip",
      "reap",
      "gasp",
      "gul",
      "mur",
      "bog",
      "ooze",
    ],
  },
  tzeent: {
    pre: [
      "Tze",
      "Ahr",
      "Kai",
      "Zyn",
      "Xai",
      "Vex",
      "Syr",
      "Aza",
      "Cyr",
      "The",
      "My",
      "Ori",
      "Zae",
      "Quo",
      "Ixi",
    ],
    mid: ["ae", "io", "y", "ra", "ze", "th", "ss", "qu", "vyr", "el", "an", "en", "or", "ith", "sa"],
    end: [
      "ith",
      "or",
      "ael",
      "vyr",
      "zeph",
      "quor",
      "hynn",
      "sael",
      "myr",
      "niel",
      "thir",
      "vian",
      "rael",
      "xyr",
      "loth",
    ],
  },
  slaan: {
    pre: [
      "Sla",
      "Luc",
      "Vel",
      "Ser",
      "Xan",
      "Sha",
      "Eli",
      "Vyr",
      "Cael",
      "Nai",
      "Zel",
      "Ase",
      "Lye",
      "Fae",
      "Rha",
    ],
    mid: ["ae", "ia", "io", "y", "la", "ra", "ve", "se", "th", "ss", "el", "an", "en", "or", "ith"],
    end: [
      "ar",
      "ath",
      "iel",
      "yra",
      "essa",
      "ion",
      "uar",
      "elis",
      "oriel",
      "yss",
      "vane",
      "lure",
      "kiss",
      "rath",
      "veil",
    ],
  },
};

// MASZYNY BOJOWE – wynik krótki: “Chassis Nazwa”
const WAR = {
  tanks: ["Leman Russ", "Baneblade", "Chimera", "Hellhound", "Basilisk", "Manticore", "Rogal Dorn"],
  titans: ["Warhound", "Reaver", "Warlord", "Warbringer", "Warmaster", "Imperator"],
  knights: [
    "Paladin",
    "Errant",
    "Warden",
    "Crusader",
    "Gallant",
    "Preceptor",
    "Castellan",
    "Valiant",
  ],
  air: ["Valkyrie", "Vendetta", "Vulture", "Thunderbolt", "Lightning"],
  nounsPL: [
    "Triumf",
    "Pokuta",
    "Wyrok",
    "Odsiecz",
    "Błyskawica",
    "Zemsta",
    "Nieugiętość",
    "Cisza",
    "Przysięga",
    "Pochodnia",
    "Żelazo",
    "Grom",
    "Litania",
    "Żar",
    "Świt",
    "Zmierzch",
    "Krucjata",
    "Męstwo",
    "Zaciętość",
    "Czujność",
  ],
};

// OKRĘTY – wynik tylko nazwa
const SHIP = {
  imperialA: [
    "Gloria",
    "Vigil",
    "Penance",
    "Resolve",
    "Judgement",
    "Redemption",
    "Dominion",
    "Absolution",
    "Fidelity",
    "Tenacity",
    "Sanction",
    "Triumph",
    "Concord",
    "Aegis",
    "Providence",
  ],
  imperialB: [
    "Terrae",
    "Imperatoris",
    "Throni",
    "Martyrum",
    "Noctis",
    "Astrae",
    "Ultimae",
    "Veritatis",
    "Custodiae",
    "Sanguinis",
    "Lux",
    "Mortis",
    "Bellum",
    "Canticum",
    "Vindex",
  ],
  chaosA: [
    "Bane",
    "Ruin",
    "Blight",
    "Malice",
    "Damnation",
    "Rapture",
    "Desecration",
    "Ravage",
    "Torment",
    "Abyss",
    "Fury",
    "Heresy",
    "Night",
    "Ash",
    "Sorrow",
  ],
  chaosB: [
    "Oath",
    "Crown",
    "Dagger",
    "Pyre",
    "Gauntlet",
    "Whisper",
    "Howl",
    "Shard",
    "Spear",
    "Covenant",
    "Grimoire",
    "Requiem",
    "Hunger",
    "Gash",
    "Void",
  ],
  eldarA: [
    "Asuryan",
    "Khaine",
    "Isha",
    "Lileath",
    "Kurnous",
    "Morai",
    "Cegorach",
    "Ulth",
    "Alai",
    "Biel",
    "Saim",
    "Iyand",
    "Webway",
    "Moon",
    "Star",
  ],
  eldarB: [
    "Whisper",
    "Gleam",
    "Dawn",
    "Mist",
    "Song",
    "Spear",
    "Shade",
    "Gale",
    "Dream",
    "Thread",
    "Mirror",
    "Blade",
    "Echo",
    "Runes",
    "Silence",
  ],
  orkA: [
    "Da",
    "Big",
    "Red",
    "Mean",
    "Loud",
    "Krumpin",
    "Smashin",
    "Burnin",
    "Lootin",
    "Stompy",
    "Killin",
    "Ragin",
    "Gorky",
    "Morky",
    "Nasty",
  ],
  orkB: [
    "Kroozer",
    "Hulk",
    "Killship",
    "Ramskiff",
    "Dakka-Boat",
    "Smasha",
    "Choppa-Barge",
    "Stompa-Ark",
    "Boom-Tub",
    "Rok-Boat",
    "Scrap-Barge",
  ],
};

function genHumanUpper(rand) {
  const g = cap(pick(HUMAN.upper.givenA, rand) + pick(HUMAN.upper.givenB, rand));
  const s = cap(pick(HUMAN.upper.surRoot, rand) + pick(HUMAN.upper.surSuf, rand));
  return cleanName(`${g} ${s}`);
}
function genHumanLower(rand) {
  const g = cap(pick(HUMAN.lower.givenA, rand) + pick(HUMAN.lower.givenB, rand));
  const s = cap(pick(HUMAN.lower.surRoot, rand) + pick(HUMAN.lower.surSuf, rand));
  return cleanName(`${g} ${s}`);
}

function genAstartes(rand) {
  const first = cap(pick(ASTARTES.pre, rand) + pick(ASTARTES.mid, rand) + pick(ASTARTES.end, rand));
  const cogn = cap(pick(ASTARTES.cognA, rand) + pick(ASTARTES.cognB, rand));
  return cleanName(`${first} ${cogn}`);
}

function genAdMechTech(rand) {
  let core = cap(pick(MECH.pre, rand) + pick(MECH.mid, rand) + pick(MECH.suf, rand));
  // czasem “tag+numer” jako część nazwiska/oznaczenia, ale bez nawiasów i bez //forge
  if (chance(0.65, rand)) {
    const n = String(100 + Math.floor(rand() * 900));
    core = `${core} ${pick(MECH.tag, rand)}${n}`;
  }
  return cleanName(core);
}
function genAdMechSkit(rand) {
  const unit = pick(["Ranger", "Vanguard", "Infiltrator", "Ruststalker", "Skitarii Alpha"], rand);
  const n = `${String(100 + Math.floor(rand() * 900))}-${String(10 + Math.floor(rand() * 90))}`;
  // bez nawiasów i bez dopisków
  return cleanName(`${unit} ${n}`);
}

function genAeldariCraft(rand) {
  const pre = pick(AELDARI.craft.pre, rand);
  const mid = pick(AELDARI.craft.mid, rand) + (chance(0.35, rand) ? pick(AELDARI.craft.mid, rand) : "");
  const end = pick(AELDARI.craft.end, rand);
  let name = cap(pre + mid + end);
  // czasem drugi człon jako “byname” (bez myślników i bez nawiasów)
  if (chance(0.35, rand)) {
    const by = cap(pick(AELDARI.craft.pre, rand) + pick(AELDARI.craft.mid, rand) + pick(AELDARI.craft.end, rand));
    name = `${name} ${by}`;
  }
  return cleanName(name);
}
function genAeldariDrukhari(rand) {
  const pre = pick(AELDARI.drukh.pre, rand);
  const mid = pick(AELDARI.drukh.mid, rand) + (chance(0.45, rand) ? pick(AELDARI.drukh.mid, rand) : "");
  const end = pick(AELDARI.drukh.end, rand);
  let name = cap(pre + mid + end);
  if (chance(0.25, rand)) {
    const by = cap(pick(AELDARI.drukh.pre, rand) + pick(AELDARI.drukh.mid, rand) + pick(AELDARI.drukh.end, rand));
    name = `${name} ${by}`;
  }
  return cleanName(name);
}
function genAeldariHarlequin(rand) {
  const pre = pick(AELDARI.harl.pre, rand);
  const mid = pick(AELDARI.harl.mid, rand);
  const end = pick(AELDARI.harl.end, rand);
  let name = cap(pre + mid + end);
  if (chance(0.55, rand)) {
    const mask = cap(pick(AELDARI.harl.pre, rand) + pick(AELDARI.harl.mid, rand) + pick(AELDARI.harl.end, rand));
    name = `${name} ${mask}`;
  }
  return cleanName(name);
}

function genNecronCommon(rand) {
  const a = pick(NECRON.pre, rand);
  const b = pick(NECRON.mid, rand) + (chance(0.35, rand) ? pick(NECRON.mid, rand) : "");
  const c = pick(NECRON.end, rand);
  return cleanName(cap(a + b + c));
}
function genNecronLord(rand) {
  // “lordowskość” tylko przez brzmienie (dłuższe i bardziej “twarde”), ale bez tytułu
  const a = pick(NECRON.pre, rand) + pick(NECRON.pre, rand).toLowerCase();
  const b = pick(NECRON.mid, rand) + pick(NECRON.mid, rand);
  const c = pick(NECRON.end, rand);
  return cleanName(cap(a + b + c));
}

function genOrk(rand) {
  const a = pick(ORK.pre, rand);
  const b = pick(ORK.mid, rand);
  const c = pick(ORK.end, rand);
  return cleanName(cap(a + b + c));
}

function genSororitas(rand) {
  // “kościelny” styl, ale tylko imię+nazwisko
  const gA = [
    "Aure",
    "Celes",
    "Serap",
    "Ver",
    "Isol",
    "Honori",
    "Adeli",
    "Miri",
    "Domiti",
    "Lucia",
    "Sabin",
    "Calpurn",
    "Marci",
    "Hel",
    "Cass",
    "Valer",
    "Octav",
    "Sever",
    "Livi",
    "Lethe",
  ];
  const gB = [
    "a",
    "ine",
    "ina",
    "ella",
    "oria",
    "ia",
    "ette",
    "ana",
    "ene",
    "ara",
    "ina",
    "ine",
    "ia",
    "a",
    "e",
    "ia",
    "ina",
    "ine",
    "ia",
    "a",
  ];
  const sR = [
    "Vorn",
    "Kessel",
    "Varro",
    "Stroud",
    "Cald",
    "Ferr",
    "Thane",
    "Roth",
    "Serr",
    "Malk",
    "Cairn",
    "Bex",
    "Ulric",
    "Kov",
    "Garr",
    "Vayne",
    "Hale",
    "Mord",
    "Sable",
    "Praxis",
  ];
  const sS = [
    "ia",
    "ine",
    "ara",
    "ette",
    "elle",
    "is",
    "a",
    "e",
    "ia",
    "ine",
    "ara",
    "ette",
    "elle",
    "is",
    "a",
    "e",
    "ia",
    "ine",
    "ara",
    "is",
  ];
  return cleanName(`${cap(pick(gA, rand) + pick(gB, rand))} ${cap(pick(sR, rand) + pick(sS, rand))}`);
}

function genChaos(rand, sub) {
  const pool = CHAOS[sub];
  const name = cap(
    pick(pool.pre, rand) +
      pick(pool.mid, rand) +
      (chance(0.35, rand) ? pick(pool.mid, rand) : "") +
      pick(pool.end, rand)
  );
  return cleanName(name);
}

function genWarMachine(rand, kind) {
  const base = pick(WAR.nounsPL, rand);
  if (kind === "tank") {
    return cleanName(`${pick(WAR.tanks, rand)} ${base}`);
  }
  if (kind === "titan") {
    return cleanName(`Tytan ${pick(WAR.titans, rand)} ${base}`);
  }
  if (kind === "knight") {
    return cleanName(`Rycerz ${pick(WAR.knights, rand)} ${base}`);
  }
  return cleanName(`${pick(WAR.air, rand)} ${base}`);
}

function genShip(rand, faction) {
  // UWAGA: wynik to tylko nazwa, bez klasy i bez dopisków
  if (faction === "imperial") {
    // łacińskie brzmienie
    const a = pick(SHIP.imperialA, rand);
    const b = pick(SHIP.imperialB, rand);
    const form = chance(0.55, rand) ? `${a} ${b}` : `${a} of ${cap(b)}`;
    return cleanName(form);
  }
  if (faction === "chaos") {
    const a = pick(SHIP.chaosA, rand);
    const b = pick(SHIP.chaosB, rand);
    const form = chance(0.55, rand) ? `${a} ${b}` : `${a} of ${b}`;
    return cleanName(form);
  }
  if (faction === "eldar" || faction === "drukhari") {
    const a = pick(SHIP.eldarA, rand);
    const b = pick(SHIP.eldarB, rand);
    const form = chance(0.55, rand) ? `${a}'s ${b}` : `${b} of ${a}`;
    return cleanName(form);
  }
  if (faction === "necron") {
    // chłodne, “monolityczne”
    const a = pick(["Obelisk", "Tomb", "Cairn", "Monolith", "Crypt", "Eon", "Void", "Silence", "Sarcophagus", "World"], rand);
    const b = pick(["Engine", "Harvester", "Ark", "Spire", "Reaper", "Anvil", "Gate", "Crown", "Spear", "Protocol"], rand);
    return cleanName(`${a} ${b}`);
  }
  if (faction === "ork") {
    const a = pick(SHIP.orkA, rand);
    const b = pick(SHIP.orkB, rand);
    return cleanName(`${a} ${b}`);
  }
  if (faction === "astartes") {
    // heroiczne, bez klasy
    const a = pick(["Pride", "Oath", "Glory", "Vigil", "Wrath", "Aegis", "Resolve", "Triumph", "Judgement", "Requital"], rand);
    const b = pick(["Fenris", "Noctis", "Dorn", "Aquila", "Terra", "Sanguis", "Vigilus", "Helion", "Calth", "Pharos"], rand);
    const form = chance(0.55, rand) ? `${a} of ${b}` : `${a} ${b}`;
    return cleanName(form);
  }
  // mechanicus
  const a = pick(["Omnissiah", "Ferrum", "Cognitio", "Machina", "Noosphere", "Volt", "Praxium", "Logis", "Data", "Hex"], rand);
  const b = pick(["Speranza", "Protocol", "Canticle", "Litany", "Axiom", "Schema", "Index", "Reliquary", "Vector", "Dominion"], rand);
  const form = chance(0.55, rand) ? `${a}'s ${b}` : `${a} ${b}`;
  return cleanName(form);
}

/* =======================
   Kategorie i opcje UI
   ======================= */
const DATA = [
  {
    key: "humans",
    name: "Imperium – Ludzie",
    nameEn: "Imperium - Humans",
    options: [
      { key: "upper", name: "Klasa Wyższa", nameEn: "Higher Class", gen: (r) => genHumanUpper(r) },
      { key: "lower", name: "Klasa Niższa", nameEn: "Lower Class", gen: (r) => genHumanLower(r) },
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
    key: "necron",
    name: "Necroni",
    nameEn: "Necrons",
    options: [
      { key: "common", name: "Necroni (zwykłe)", nameEn: "Necrons (common)", gen: (r) => genNecronCommon(r) },
      { key: "lord", name: "Necroni (Lordowie)", nameEn: "Necrons (lords)", gen: (r) => genNecronLord(r) },
    ],
  },
  {
    key: "orks",
    name: "Orkowie",
    nameEn: "Orks",
    options: [
      { key: "boy", name: "Orkowie (zwykłe)", nameEn: "Orks (common)", gen: (r) => genOrk(r) },
      { key: "boss", name: "Orkowie (bossowie)", nameEn: "Orks (bosses)", gen: (r) => genOrk(r) },
    ],
  },
  {
    key: "sororitas",
    name: "Adepta Sororitas",
    nameEn: "Adepta Sororitas",
    options: [{ key: "sister", name: "Sororitas", nameEn: "Sororitas", gen: (r) => genSororitas(r) }],
  },
  {
    key: "astartes",
    name: "Astartes – imię i nazwisko bojowe",
    nameEn: "Astartes - battle name and surname",
    options: [{ key: "standard", name: "Astartes", nameEn: "Astartes", gen: (r) => genAstartes(r) }],
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
    key: "warmachines",
    name: "Maszyny bojowe (Imperium)",
    nameEn: "War machines (Imperium)",
    options: [
      { key: "tank", name: "Czołgi", nameEn: "Tanks", gen: (r) => genWarMachine(r, "tank") },
      { key: "titan", name: "Tytany", nameEn: "Titans", gen: (r) => genWarMachine(r, "titan") },
      { key: "knight", name: "Rycerze", nameEn: "Knights", gen: (r) => genWarMachine(r, "knight") },
      { key: "valk", name: "Valkyrie / lotnictwo", nameEn: "Valkyrie / air wing", gen: (r) => genWarMachine(r, "air") },
    ],
  },
  {
    key: "ships",
    name: "Okręty gwiezdne",
    nameEn: "Starships",
    options: [
      { key: "imp", name: "Imperium (Navy)", nameEn: "Imperium (Navy)", gen: (r) => genShip(r, "imperial") },
      { key: "ast", name: "Astartes", nameEn: "Astartes", gen: (r) => genShip(r, "astartes") },
      { key: "mec", name: "Adeptus Mechanicus", nameEn: "Adeptus Mechanicus", gen: (r) => genShip(r, "mechanicus") },
      { key: "eld", name: "Aeldari", nameEn: "Aeldari", gen: (r) => genShip(r, "eldar") },
      { key: "drk", name: "Drukhari", nameEn: "Drukhari", gen: (r) => genShip(r, "drukhari") },
      { key: "ork", name: "Orkowie", nameEn: "Orks", gen: (r) => genShip(r, "ork") },
      { key: "nec", name: "Necroni", nameEn: "Necrons", gen: (r) => genShip(r, "necron") },
      { key: "cha", name: "Chaos", nameEn: "Chaos", gen: (r) => genShip(r, "chaos") },
    ],
  },
];

/* =======================
   UI wiring
   ======================= */
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

function getLocalizedName(item) {
  if (currentLanguage === "en") {
    return item.nameEn || item.name;
  }
  return item.name;
}

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

function populateCats() {
  catEl.innerHTML = "";
  for (const c of DATA) {
    const o = document.createElement("option");
    o.value = c.key;
    o.textContent = getLocalizedName(c);
    catEl.appendChild(o);
  }
}
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
function generate() {
  const cat = DATA.find((x) => x.key === catEl.value);
  const opt = cat.options.find((x) => x.key === optEl.value);

  const { rand, mode } = makeRng(seedEl.value);
  const labels = translations[currentLanguage].labels;
  modePill.textContent = mode === "seed" ? labels.randomSeed : labels.randomAuto;

  let n = parseInt(countEl.value, 10);
  if (!Number.isFinite(n) || n < 1) {
    n = 1;
  }
  if (n > 20) {
    n = 20;
  }

  const lines = [];
  for (let i = 0; i < n; i++) {
    lines.push(`• ${cleanName(opt.gen(rand))}`);
  }
  resEl.textContent = lines.join("\n");
  resEl.dataset.hasResults = "true";
}

document.getElementById("gen").addEventListener("click", generate);
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

catEl.addEventListener("change", () => {
  populateOpts();
  generate();
});
optEl.addEventListener("change", generate);

populateCats();
populateOpts();
resEl.dataset.hasResults = "false";
applyLanguage(currentLanguage);
languageSelect.addEventListener("change", (event) => {
  applyLanguage(event.target.value);
  generate();
});

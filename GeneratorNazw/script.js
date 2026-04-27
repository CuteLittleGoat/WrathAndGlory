// Plik logiki modułu: konfiguracja, funkcje i obsługa zdarzeń / Module logic file: configuration, functions, and event handling
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
function chance(p, rand) {
  return rand() < p;
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function cleanName(s) {
  return String(s)
    .replace(/[“”"]/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function pick(arr, rand) {
  return arr[Math.floor(rand() * arr.length)];
}

/* Obsługuje:
   - ["A","B","C"]
   - [{v:"A",w:5},{v:"B",w:1}]
*/
function pickWeighted(arr, rand) {
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
    if (roll <= 0) return item.v;
  }
  return arr[arr.length - 1].v;
}

function rollInt(min, max, rand) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function isVowel(ch) {
  return /[aeiouyąęóAEIOUYĄĘÓ]/.test(ch || "");
}

function tidySegmentBoundary(a, b) {
  if (!a) return b || "";
  if (!b) return a || "";

  const last = a[a.length - 1];
  const first = b[0];

  if (last.toLowerCase() === first.toLowerCase()) {
    return a + b.slice(1);
  }

  if (isVowel(last) && isVowel(first)) {
    // lekkie wygładzenie styku samogłosek
    if ((last + first).match(/aa|ee|ii|oo|uu|yy/i)) {
      return a + b.slice(1);
    }
  }

  return a + b;
}

function phoneticPolish(s) {
  let out = String(s);

  // Podstawowe czyszczenie zbyt dziwnych zlepków
  out = out
    .replace(/([A-Za-z])\1\1+/g, "$1$1")
    .replace(/-([ -])/g, "-")
    .replace(/\s{2,}/g, " ");

  // Korekty częstych niezgrabnych połączeń proceduralnych
  out = out
    .replace(/aa/gi, "a")
    .replace(/ee/gi, "e")
    .replace(/ii/gi, "i")
    .replace(/oo/gi, "o")
    .replace(/uu/gi, "u")
    .replace(/yy/gi, "y");

  // Nie chcemy pustych myślników/spacji
  out = out
    .replace(/\s+-\s+/g, "-")
    .replace(/\s{2,}/g, " ")
    .trim();

  return cleanName(out);
}

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

    // jeśli to normalne segmenty słowotwórcze, próbujemy wygładzić styk
    if (/[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż]/.test(last) && /[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż]/.test(first)) {
      out = tidySegmentBoundary(out, String(part));
    } else {
      out += String(part);
    }
  }
  return phoneticPolish(out);
}

function tryGenerate(fn, rand, tries = 8) {
  let best = "";
  for (let i = 0; i < tries; i++) {
    const candidate = cleanName(fn());
    if (looksGood(candidate)) {
      return candidate;
    }
    best = candidate;
  }
  return best;
}

function looksGood(s) {
  if (!s || s.length < 3) return false;
  if (/[a-ząćęłńóśźż]{5,}/i.test(s.replace(/[^A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż]/g, "")) === false && s.length < 4) {
    return false;
  }

  // odrzucamy niektóre bardzo niezgrabne zbitki
  const bad = [
    /[bcdfghjklmnpqrstvwxyz]{6,}/i,
    /([aeiouy])\1\1/i,
    /--/,
    /\s{2,}/,
  ];
  return !bad.some((rx) => rx.test(s));
}

function formatWithTitle(core, titles, rand, chanceValue = 0.7) {
  if (!titles || !titles.length || !chance(chanceValue, rand)) {
    return cleanName(core);
  }
  const title = pickWeighted(titles, rand);
  return cleanName(`${title} ${core}`);
}

function formatNamedThing(classifier, core) {
  return cleanName(`${classifier} "${core}"`);
}

/* =======================
   Dane
   ======================= */

const HUMAN = {
  upper: {
    givenA: [
      { v: "Aure", w: 5 }, { v: "Cassi", w: 4 }, { v: "Seve", w: 3 }, { v: "Octa", w: 4 }, { v: "Vale", w: 3 },
      { v: "Lucia", w: 4 }, { v: "Domi", w: 3 }, { v: "Hadri", w: 5 }, { v: "Marce", w: 3 }, { v: "Serap", w: 3 },
      { v: "Calpi", w: 2 }, { v: "Veri", w: 3 }, { v: "Honori", w: 2 }, { v: "Isol", w: 2 }, { v: "Adeli", w: 2 },
      { v: "Celesti", w: 2 }, { v: "Corvi", w: 2 }, { v: "Gide", w: 1 }, { v: "Malach", w: 1 }, { v: "Eras", w: 2 },
    ],
    givenB: [
      { v: "lian", w: 4 }, { v: "anus", w: 2 }, { v: "rin", w: 2 }, { v: "tian", w: 4 }, { v: "ria", w: 4 },
      { v: "nius", w: 3 }, { v: "dric", w: 1 }, { v: "nora", w: 2 }, { v: "lius", w: 4 }, { v: "phine", w: 1 },
      { v: "purnia", w: 1 }, { v: "tus", w: 3 }, { v: "oria", w: 3 }, { v: "dine", w: 1 }, { v: "line", w: 2 },
      { v: "stine", w: 1 }, { v: "nus", w: 2 }, { v: "eon", w: 1 }, { v: "chai", w: 1 }, { v: "mus", w: 1 },
    ],
    surRoot: [
      { v: "Vorn", w: 4 }, { v: "Kessel", w: 3 }, { v: "Varro", w: 5 }, { v: "Stroud", w: 1 }, { v: "Cald", w: 2 },
      { v: "Ferr", w: 4 }, { v: "Thane", w: 3 }, { v: "Roth", w: 3 }, { v: "Serr", w: 3 }, { v: "Malk", w: 2 },
      { v: "Cairn", w: 2 }, { v: "Bex", w: 1 }, { v: "Ulric", w: 2 }, { v: "Kov", w: 2 }, { v: "Garr", w: 2 },
      { v: "Vayne", w: 1 }, { v: "Hale", w: 1 }, { v: "Mord", w: 3 }, { v: "Sable", w: 2 }, { v: "Praxis", w: 1 },
    ],
    surSuf: [
      { v: "ius", w: 4 }, { v: "ian", w: 4 }, { v: "ov", w: 2 }, { v: "ski", w: 1 }, { v: "son", w: 1 },
      { v: "hart", w: 2 }, { v: "wick", w: 1 }, { v: "ford", w: 1 }, { v: "croft", w: 1 }, { v: "borne", w: 2 },
      { v: "vale", w: 2 }, { v: "lock", w: 1 }, { v: "ward", w: 2 }, { v: "more", w: 1 }, { v: "ley", w: 1 },
      { v: "mere", w: 1 }, { v: "holt", w: 1 }, { v: "grim", w: 1 }, { v: "en", w: 2 }, { v: "an", w: 2 },
    ],
    titles: [
      { v: "Lord", w: 3 },
      { v: "Lady", w: 2 },
      { v: "Prefekt", w: 2 },
      { v: "Kanclerz", w: 1 },
      { v: "Gubernator", w: 1 },
      { v: "Mistrz Dworu", w: 1 },
    ],
  },
  lower: {
    givenA: [
      { v: "Jax", w: 4 }, { v: "Kade", w: 3 }, { v: "Rook", w: 3 }, { v: "Venn", w: 2 }, { v: "Orlo", w: 1 },
      { v: "Sly", w: 2 }, { v: "Brann", w: 2 }, { v: "Kerr", w: 2 }, { v: "Mako", w: 2 }, { v: "Stenn", w: 2 },
      { v: "Rafe", w: 2 }, { v: "Holt", w: 1 }, { v: "Cutter", w: 2 }, { v: "Nox", w: 3 }, { v: "Tarn", w: 2 },
      { v: "Vik", w: 2 }, { v: "Rex", w: 1 }, { v: "Dane", w: 1 }, { v: "Skell", w: 2 }, { v: "Kellan", w: 1 },
    ],
    givenB: [
      { v: "", w: 14 },
      { v: "-7", w: 2 },
      { v: "-9", w: 1 },
      { v: "-13", w: 1 },
      { v: "-21", w: 1 },
    ],
    surRoot: [
      { v: "Brask", w: 2 }, { v: "Krail", w: 2 }, { v: "Drax", w: 2 }, { v: "Kane", w: 1 }, { v: "Voss", w: 1 },
      { v: "Kerr", w: 1 }, { v: "Tarn", w: 2 }, { v: "Grit", w: 3 }, { v: "Sump", w: 3 }, { v: "Ragg", w: 2 },
      { v: "Kord", w: 2 }, { v: "Nail", w: 2 }, { v: "Scrap", w: 3 }, { v: "Murk", w: 2 }, { v: "Gash", w: 2 },
      { v: "Stitch", w: 2 }, { v: "Rivet", w: 4 }, { v: "Grim", w: 2 }, { v: "Smog", w: 4 }, { v: "Cinder", w: 2 },
    ],
    surSuf: [
      { v: "", w: 12 },
      { v: "-V", w: 2 },
      { v: "-X", w: 2 },
      { v: "-IX", w: 1 },
      { v: "son", w: 1 },
      { v: "en", w: 1 },
      { v: "er", w: 1 },
      { v: "lock", w: 1 },
      { v: "ward", w: 1 },
    ],
    titles: [
      { v: "Brygadzista", w: 2 },
      { v: "Mistrz Złomu", w: 1 },
      { v: "Łowca Nagród", w: 1 },
      { v: "Sumpowy nożownik", w: 1 },
      { v: "Foreman", w: 1 },
    ],
  },
};

const ASTARTES = {
  pre: [
    { v: "Var", w: 3 }, { v: "Cat", w: 2 }, { v: "Sev", w: 3 }, { v: "Tib", w: 4 }, { v: "Aq", w: 1 },
    { v: "Dru", w: 2 }, { v: "Hel", w: 2 }, { v: "Gal", w: 2 }, { v: "Mor", w: 3 }, { v: "Val", w: 3 },
    { v: "Ren", w: 2 }, { v: "Kas", w: 2 }, { v: "Bor", w: 2 }, { v: "Cor", w: 3 }, { v: "Sar", w: 2 },
    { v: "Luc", w: 2 }, { v: "Mar", w: 2 }, { v: "Darn", w: 1 }, { v: "Rhen", w: 1 }, { v: "Acast", w: 1 },
  ],
  mid: [
    { v: "ia", w: 2 }, { v: "o", w: 3 }, { v: "e", w: 3 }, { v: "u", w: 2 }, { v: "a", w: 3 },
    { v: "i", w: 3 }, { v: "ae", w: 1 }, { v: "io", w: 1 }, { v: "or", w: 2 }, { v: "ar", w: 2 },
    { v: "en", w: 2 }, { v: "an", w: 2 }, { v: "us", w: 2 }, { v: "on", w: 2 }, { v: "ir", w: 1 },
    { v: "al", w: 1 }, { v: "ur", w: 1 }, { v: "is", w: 1 }, { v: "um", w: 1 }, { v: "el", w: 1 },
  ],
  end: [
    { v: "nus", w: 3 }, { v: "rius", w: 3 }, { v: "dor", w: 3 }, { v: "lius", w: 3 }, { v: "tus", w: 3 },
    { v: "ran", w: 2 }, { v: "mir", w: 2 }, { v: "kon", w: 2 }, { v: "dax", w: 1 }, { v: "vorn", w: 1 },
    { v: "cai", w: 1 }, { v: "drak", w: 1 }, { v: "grimm", w: 1 }, { v: "noct", w: 1 }, { v: "sable", w: 1 },
    { v: "thrax", w: 1 }, { v: "ferr", w: 1 }, { v: "uln", w: 1 }, { v: "kast", w: 1 }, { v: "vor", w: 1 },
  ],
  cognA: [
    { v: "Iron", w: 3 }, { v: "Black", w: 3 }, { v: "Storm", w: 3 }, { v: "Void", w: 2 }, { v: "Ash", w: 2 },
    { v: "Blood", w: 3 }, { v: "Stone", w: 3 }, { v: "Dawn", w: 2 }, { v: "Grim", w: 2 }, { v: "Star", w: 1 },
    { v: "Night", w: 2 }, { v: "Oath", w: 2 }, { v: "Steel", w: 3 }, { v: "Frost", w: 1 }, { v: "Raven", w: 1 },
    { v: "Wolf", w: 1 }, { v: "Spear", w: 2 }, { v: "Hammer", w: 2 }, { v: "Shield", w: 2 }, { v: "Gale", w: 1 },
  ],
  cognB: [
    { v: "hand", w: 2 }, { v: "blade", w: 4 }, { v: "born", w: 1 }, { v: "guard", w: 3 }, { v: "reaver", w: 1 },
    { v: "ward", w: 2 }, { v: "heart", w: 1 }, { v: "fist", w: 3 }, { v: "howl", w: 1 }, { v: "strike", w: 2 },
    { v: "mantle", w: 1 }, { v: "watch", w: 3 }, { v: "crown", w: 1 }, { v: "hunt", w: 1 }, { v: "march", w: 1 },
    { v: "breaker", w: 1 }, { v: "caller", w: 1 }, { v: "sunder", w: 1 }, { v: "mark", w: 1 }, { v: "claw", w: 1 },
  ],
  titles: [
    { v: "Brat", w: 4 },
    { v: "Brat Sierżant", w: 2 },
    { v: "Weteran", w: 1 },
    { v: "Kapitan", w: 1 },
    { v: "Kapelan", w: 1 },
    { v: "Bibliotekarz", w: 1 },
  ],
};

const MECH = {
  pre: [
    { v: "Ferr", w: 3 }, { v: "Cogn", w: 3 }, { v: "Omni", w: 2 }, { v: "Mach", w: 3 }, { v: "Volt", w: 2 },
    { v: "Syn", w: 2 }, { v: "Noos", w: 4 }, { v: "Logi", w: 3 }, { v: "Cyt", w: 1 }, { v: "Prax", w: 2 },
    { v: "Aug", w: 2 }, { v: "Data", w: 3 }, { v: "Rho", w: 1 }, { v: "Sigma", w: 2 }, { v: "Kappa", w: 1 },
    { v: "Delta", w: 1 }, { v: "Theta", w: 1 }, { v: "Gamma", w: 1 }, { v: "Proto", w: 1 }, { v: "Hex", w: 2 },
  ],
  mid: [
    { v: "um", w: 2 }, { v: "itor", w: 3 }, { v: "on", w: 2 }, { v: "ex", w: 2 }, { v: "aris", w: 2 },
    { v: "eon", w: 1 }, { v: "aph", w: 1 }, { v: "or", w: 3 }, { v: "axis", w: 3 }, { v: "al", w: 1 },
    { v: "ion", w: 2 }, { v: "atus", w: 2 }, { v: "et", w: 1 }, { v: "icus", w: 2 }, { v: "om", w: 1 },
    { v: "orithm", w: 3 }, { v: "plex", w: 2 }, { v: "metry", w: 2 }, { v: "gnosis", w: 3 }, { v: "forge", w: 1 },
  ],
  suf: [
    { v: "ix", w: 3 }, { v: "or", w: 2 }, { v: "a", w: 1 }, { v: "us", w: 3 }, { v: "is", w: 2 },
    { v: "um", w: 2 }, { v: "eta", w: 1 }, { v: "-9", w: 1 }, { v: "-11", w: 1 }, { v: "-17", w: 1 },
    { v: "-23", w: 1 }, { v: "-41", w: 2 }, { v: "-77", w: 1 }, { v: "-101", w: 1 },
    { v: "Prime", w: 2 }, { v: "Secundus", w: 1 }, { v: "Tertius", w: 1 }, { v: "IV", w: 1 }, { v: "VII", w: 1 },
  ],
  tag: [
    { v: "M-", w: 3 }, { v: "KX-", w: 2 }, { v: "VX-", w: 2 }, { v: "RX-", w: 2 }, { v: "TX-", w: 1 },
    { v: "Sigma-", w: 2 }, { v: "Omni-", w: 1 }, { v: "Noos-", w: 3 }, { v: "Data-", w: 2 }, { v: "Hex-", w: 1 },
  ],
  skitariiUnits: [
    { v: "Ranger", w: 4 },
    { v: "Vanguard", w: 4 },
    { v: "Infiltrator", w: 2 },
    { v: "Ruststalker", w: 2 },
    { v: "Skitarii Alpha", w: 1 },
  ],
  titles: [
    { v: "Magos", w: 4 },
    { v: "Magos Dominus", w: 2 },
    { v: "Logis", w: 2 },
    { v: "Biologis", w: 1 },
    { v: "Enginseer", w: 2 },
    { v: "Lexmechanic", w: 1 },
  ],
};

const AELDARI = {
  craft: {
    pre: [
      { v: "Ae", w: 3 }, { v: "Ara", w: 2 }, { v: "Eli", w: 3 }, { v: "Ili", w: 2 }, { v: "Lia", w: 2 },
      { v: "Mae", w: 2 }, { v: "Sha", w: 3 }, { v: "Yv", w: 1 }, { v: "Fae", w: 2 }, { v: "Dyr", w: 1 },
      { v: "Kae", w: 2 }, { v: "Nai", w: 2 }, { v: "Syr", w: 2 }, { v: "Thal", w: 2 }, { v: "Vael", w: 2 },
      { v: "Cyr", w: 1 }, { v: "Idr", w: 1 }, { v: "Ky", w: 1 }, { v: "Lath", w: 1 }, { v: "Nu", w: 1 },
    ],
    mid: [
      { v: "ra", w: 2 }, { v: "li", w: 3 }, { v: "th", w: 3 }, { v: "sha", w: 2 }, { v: "ly", w: 2 },
      { v: "na", w: 2 }, { v: "re", w: 2 }, { v: "v", w: 1 }, { v: "ss", w: 1 }, { v: "dr", w: 1 },
      { v: "ae", w: 1 }, { v: "io", w: 1 }, { v: "yr", w: 1 }, { v: "el", w: 2 }, { v: "an", w: 2 },
      { v: "en", w: 1 }, { v: "or", w: 1 }, { v: "ith", w: 1 }, { v: "sa", w: 1 }, { v: "qu", w: 1 },
    ],
    end: [
      { v: "ion", w: 2 }, { v: "iel", w: 4 }, { v: "ar", w: 2 }, { v: "eth", w: 3 }, { v: "ael", w: 3 },
      { v: "yra", w: 2 }, { v: "wyn", w: 2 }, { v: "ith", w: 2 }, { v: "as", w: 1 }, { v: "oriel", w: 2 },
      { v: "essar", w: 1 }, { v: "mir", w: 1 }, { v: "niel", w: 2 }, { v: "thir", w: 1 }, { v: "vian", w: 1 }, { v: "rael", w: 1 },
    ],
    titles: [
      { v: "Widzący", w: 1 },
      { v: "Warlock", w: 1 },
      { v: "Autarcha", w: 1 },
    ],
  },
  drukh: {
    pre: [
      { v: "As", w: 2 }, { v: "Dra", w: 4 }, { v: "Mal", w: 3 }, { v: "Vex", w: 3 }, { v: "Xae", w: 2 },
      { v: "Zy", w: 1 }, { v: "Kha", w: 2 }, { v: "Naz", w: 2 }, { v: "Bel", w: 1 }, { v: "Ara", w: 1 },
      { v: "Cru", w: 1 }, { v: "Sha", w: 2 }, { v: "Thra", w: 2 }, { v: "Lel", w: 1 }, { v: "Draz", w: 1 },
    ],
    mid: [
      { v: "ru", w: 2 }, { v: "za", w: 2 }, { v: "x", w: 1 }, { v: "th", w: 3 }, { v: "sh", w: 3 },
      { v: "el", w: 2 }, { v: "ae", w: 1 }, { v: "i", w: 2 }, { v: "o", w: 1 }, { v: "y", w: 1 },
      { v: "rr", w: 1 }, { v: "kk", w: 1 }, { v: "zz", w: 1 }, { v: "v", w: 1 }, { v: "dr", w: 2 }, { v: "kr", w: 2 }, { v: "n", w: 1 },
    ],
    end: [
      { v: "bael", w: 1 }, { v: "keth", w: 3 }, { v: "ax", w: 2 }, { v: "esh", w: 3 }, { v: "ar", w: 2 },
      { v: "yx", w: 1 }, { v: "vrax", w: 1 }, { v: "ith", w: 2 }, { v: "zhar", w: 2 }, { v: "saar", w: 1 },
      { v: "malys", w: 1 }, { v: "hesp", w: 1 }, { v: "vecth", w: 1 }, { v: "drah", w: 1 }, { v: "scar", w: 1 },
    ],
    titles: [
      { v: "Archont", w: 1 },
      { v: "Sybaryta", w: 1 },
      { v: "Mistrzyni Wych", w: 1 },
    ],
  },
  harl: {
    pre: [
      { v: "Ky", w: 2 }, { v: "Mo", w: 2 }, { v: "D'ye", w: 1 }, { v: "Idra", w: 1 }, { v: "Ase", w: 2 },
      { v: "Lye", w: 2 }, { v: "Va", w: 2 }, { v: "Sae", w: 2 }, { v: "Thae", w: 1 }, { v: "Yl", w: 1 },
      { v: "Fae", w: 1 }, { v: "Cael", w: 1 }, { v: "Nu", w: 1 }, { v: "Ere", w: 1 }, { v: "Lle", w: 1 },
    ],
    mid: [
      { v: "la", w: 2 }, { v: "ra", w: 2 }, { v: "e", w: 2 }, { v: "i", w: 2 }, { v: "o", w: 2 },
      { v: "ae", w: 1 }, { v: "ss", w: 1 }, { v: "th", w: 1 }, { v: "lith", w: 1 }, { v: "mir", w: 1 },
      { v: "rael", w: 1 }, { v: "quor", w: 1 }, { v: "hynn", w: 1 }, { v: "sael", w: 1 }, { v: "vyr", w: 1 },
    ],
    end: [
      { v: "nil", w: 2 }, { v: "ley", w: 2 }, { v: "song", w: 1 }, { v: "spear", w: 1 }, { v: "blade", w: 1 },
      { v: "shade", w: 1 }, { v: "wyn", w: 1 }, { v: "light", w: 1 }, { v: "mask", w: 2 }, { v: "dance", w: 2 },
      { v: "whisper", w: 1 }, { v: "gleam", w: 1 },
    ],
    titles: [
      { v: "Wędrowiec Maski", w: 1 },
      { v: "Wieszcz Cienia", w: 1 },
      { v: "Błazen Śmierci", w: 1 },
    ],
  },
};

const NECRON = {
  pre: [
    { v: "An", w: 3 }, { v: "Imo", w: 2 }, { v: "Tra", w: 3 }, { v: "Ori", w: 1 }, { v: "Sza", w: 2 },
    { v: "Kam", w: 1 }, { v: "Zah", w: 2 }, { v: "Nek", w: 2 }, { v: "Pha", w: 2 }, { v: "Khep", w: 2 },
    { v: "Men", w: 1 }, { v: "Set", w: 1 }, { v: "Nih", w: 1 }, { v: "Meph", w: 2 }, { v: "Nov", w: 1 },
    { v: "Sek", w: 1 }, { v: "Cair", w: 1 }, { v: "Shrou", w: 1 }, { v: "Scy", w: 1 },
  ],
  mid: [
    { v: "ka", w: 2 }, { v: "tekh", w: 4 }, { v: "ryn", w: 2 }, { v: "ra", w: 2 }, { v: "to", w: 2 },
    { v: "ki", w: 1 }, { v: "sa", w: 1 }, { v: "rekh", w: 3 }, { v: "ph", w: 1 }, { v: "men", w: 1 },
    { v: "oth", w: 1 }, { v: "ekh", w: 2 }, { v: "zar", w: 2 }, { v: "t", w: 1 }, { v: "khet", w: 2 },
    { v: "mose", w: 1 }, { v: "sek", w: 1 }, { v: "sha", w: 1 }, { v: "cyr", w: 1 },
  ],
  end: [
    { v: "ekh", w: 4 }, { v: "otekh", w: 3 }, { v: "ryn", w: 2 }, { v: "kar", w: 2 }, { v: "takh", w: 2 },
    { v: "rekh", w: 3 }, { v: "khet", w: 2 }, { v: "zar", w: 2 }, { v: "sakh", w: 1 }, { v: "thor", w: 1 },
    { v: "mose", w: 1 }, { v: "seth", w: 1 }, { v: "nih", w: 1 }, { v: "meph", w: 1 }, { v: "nov", w: 1 },
  ],
  warriorTitles: [
    { v: "Wojownik", w: 5 },
    { v: "Nieśmiertelny", w: 2 },
    { v: "Egzekutor", w: 1 },
  ],
  lordTitles: [
    { v: "Lord", w: 4 },
    { v: "Overlord", w: 3 },
    { v: "Phaeron", w: 1 },
    { v: "Cryptek", w: 1 },
  ],
};

const ORK = {
  pre: [
    { v: "Ghaz", w: 2 }, { v: "Snag", w: 2 }, { v: "Naz", w: 2 }, { v: "Waz", w: 2 }, { v: "Grog", w: 2 },
    { v: "Skab", w: 2 }, { v: "Ugr", w: 1 }, { v: "Dreg", w: 1 }, { v: "Ruk", w: 2 }, { v: "Mog", w: 2 },
    { v: "Zog", w: 2 }, { v: "Klaw", w: 1 }, { v: "Rippa", w: 1 }, { v: "Grim", w: 1 }, { v: "Badr", w: 1 },
    { v: "Skull", w: 1 }, { v: "Krump", w: 2 }, { v: "Gitz", w: 1 },
  ],
  mid: [
    { v: "g", w: 2 }, { v: "k", w: 2 }, { v: "z", w: 2 }, { v: "kr", w: 2 }, { v: "rag", w: 2 },
    { v: "sm", w: 1 }, { v: "dakk", w: 3 }, { v: "sn", w: 1 }, { v: "gutz", w: 1 }, { v: "ur", w: 1 },
    { v: "teef", w: 2 }, { v: "gob", w: 1 }, { v: "sk", w: 1 }, { v: "bash", w: 2 }, { v: "chop", w: 2 },
    { v: "lug", w: 1 }, { v: "stomp", w: 1 },
  ],
  end: [
    { v: "gull", w: 1 }, { v: "rod", w: 1 }, { v: "dreg", w: 1 }, { v: "dakka", w: 3 }, { v: "teef", w: 3 },
    { v: "smek", w: 1 }, { v: "krumpa", w: 2 }, { v: "skull", w: 1 }, { v: "nob", w: 2 }, { v: "boss", w: 2 },
    { v: "grot", w: 1 }, { v: "lugga", w: 1 }, { v: "stompa", w: 1 }, { v: "choppa", w: 2 }, { v: "gitz", w: 1 }, { v: "snagga", w: 2 },
  ],
  titles: [
    { v: "Nob", w: 2 },
    { v: "Boss", w: 2 },
    { v: "Mek", w: 1 },
    { v: "Painboy", w: 1 },
    { v: "Weirdboy", w: 1 },
  ],
};

const CHAOS = {
  undiv: {
    pre: [
      { v: "Ab", w: 2 }, { v: "Mor", w: 3 }, { v: "Vek", w: 2 }, { v: "Zar", w: 3 }, { v: "Bel", w: 2 },
      { v: "Aza", w: 1 }, { v: "Xar", w: 1 }, { v: "Dae", w: 1 }, { v: "Mal", w: 3 }, { v: "Kor", w: 2 },
      { v: "Nex", w: 1 }, { v: "Var", w: 2 }, { v: "Tor", w: 1 }, { v: "Kha", w: 1 }, { v: "Ul", w: 1 },
    ],
    mid: [
      { v: "ra", w: 2 }, { v: "zu", w: 2 }, { v: "no", w: 2 }, { v: "the", w: 2 }, { v: "sse", w: 1 },
      { v: "ur", w: 2 }, { v: "i", w: 2 }, { v: "o", w: 2 }, { v: "ae", w: 1 }, { v: "yx", w: 1 },
      { v: "zz", w: 1 }, { v: "th", w: 1 }, { v: "vor", w: 1 }, { v: "kar", w: 1 }, { v: "el", w: 1 },
    ],
    end: [
      { v: "gon", w: 2 }, { v: "rax", w: 2 }, { v: "mord", w: 2 }, { v: "thar", w: 2 }, { v: "loth", w: 1 },
      { v: "zeth", w: 1 }, { v: "vyr", w: 1 }, { v: "esh", w: 1 }, { v: "akor", w: 1 }, { v: "ion", w: 1 },
      { v: "azar", w: 1 }, { v: "ith", w: 1 }, { v: "ul", w: 1 }, { v: "tor", w: 1 }, { v: "vex", w: 1 },
    ],
    titles: [
      { v: "Czempion", w: 3 },
      { v: "Mroczny Apostoł", w: 1 },
      { v: "Heretyk", w: 1 },
      { v: "Wybraniec Chaosu", w: 1 },
    ],
  },
  khorne: {
    pre: [
      { v: "Kh", w: 2 }, { v: "Kar", w: 3 }, { v: "Gor", w: 3 }, { v: "Rag", w: 3 }, { v: "Skar", w: 3 },
      { v: "Bra", w: 2 }, { v: "Khor", w: 2 }, { v: "Vra", w: 1 }, { v: "Ghar", w: 1 }, { v: "Ruk", w: 1 },
      { v: "Dra", w: 2 }, { v: "Kha", w: 2 }, { v: "Zar", w: 1 }, { v: "Kor", w: 1 }, { v: "Gr", w: 1 },
    ],
    mid: [
      { v: "a", w: 3 }, { v: "o", w: 2 }, { v: "u", w: 2 }, { v: "ra", w: 3 }, { v: "ga", w: 2 },
      { v: "kha", w: 1 }, { v: "gru", w: 1 }, { v: "zor", w: 1 }, { v: "rak", w: 2 }, { v: "th", w: 1 },
      { v: "zz", w: 1 }, { v: "ur", w: 1 }, { v: "akh", w: 1 }, { v: "orr", w: 1 }, { v: "rag", w: 1 },
    ],
    end: [
      { v: "thar", w: 2 }, { v: "gor", w: 3 }, { v: "krag", w: 2 }, { v: "zakh", w: 1 }, { v: "gorn", w: 2 },
      { v: "rakk", w: 1 }, { v: "skar", w: 2 }, { v: "drox", w: 1 }, { v: "khul", w: 1 }, { v: "mord", w: 1 },
      { v: "rax", w: 1 }, { v: "zarr", w: 1 }, { v: "vorn", w: 1 }, { v: "gash", w: 1 }, { v: "rend", w: 2 },
    ],
    titles: [
      { v: "Rzeźnik", w: 2 },
      { v: "Czempion Khorne'a", w: 2 },
      { v: "Rozpruwacz", w: 1 },
      { v: "Nosiciel Czaszek", w: 1 },
    ],
  },
  nurgle: {
    pre: [
      { v: "Nur", w: 2 }, { v: "Mog", w: 2 }, { v: "Pox", w: 2 }, { v: "Rot", w: 3 }, { v: "Glo", w: 1 },
      { v: "Bub", w: 2 }, { v: "Muc", w: 1 }, { v: "Fet", w: 1 }, { v: "Gur", w: 1 }, { v: "Slud", w: 1 },
      { v: "Mor", w: 1 }, { v: "Plag", w: 2 }, { v: "Sour", w: 1 }, { v: "Vile", w: 1 }, { v: "Mold", w: 1 },
    ],
    mid: [
      { v: "a", w: 2 }, { v: "o", w: 2 }, { v: "u", w: 2 }, { v: "ru", w: 2 }, { v: "lo", w: 1 },
      { v: "mu", w: 1 }, { v: "gu", w: 1 }, { v: "zz", w: 1 }, { v: "dr", w: 1 }, { v: "th", w: 1 },
      { v: "ag", w: 1 }, { v: "ur", w: 1 }, { v: "og", w: 1 }, { v: "il", w: 1 }, { v: "en", w: 1 },
    ],
    end: [
      { v: "mire", w: 1 }, { v: "rot", w: 3 }, { v: "pox", w: 3 }, { v: "gore", w: 1 }, { v: "slime", w: 2 },
      { v: "mold", w: 2 }, { v: "blight", w: 2 }, { v: "filth", w: 2 }, { v: "drip", w: 1 }, { v: "reap", w: 1 },
      { v: "gasp", w: 1 }, { v: "gul", w: 1 }, { v: "mur", w: 1 }, { v: "bog", w: 1 }, { v: "ooze", w: 1 },
    ],
    titles: [
      { v: "Herold Plugastwa", w: 2 },
      { v: "Nosiciel Zarazy", w: 2 },
      { v: "Błogosławiony Nurgle'a", w: 1 },
      { v: "Rozsiewca Zgnilizny", w: 1 },
    ],
  },
  tzeent: {
    pre: [
      { v: "Tze", w: 2 }, { v: "Ahr", w: 2 }, { v: "Kai", w: 2 }, { v: "Zyn", w: 2 }, { v: "Xai", w: 1 },
      { v: "Vex", w: 1 }, { v: "Syr", w: 2 }, { v: "Aza", w: 1 }, { v: "Cyr", w: 1 }, { v: "The", w: 1 },
      { v: "My", w: 1 }, { v: "Ori", w: 1 }, { v: "Zae", w: 1 }, { v: "Quo", w: 1 }, { v: "Ixi", w: 1 },
    ],
    mid: [
      { v: "ae", w: 1 }, { v: "io", w: 2 }, { v: "y", w: 1 }, { v: "ra", w: 2 }, { v: "ze", w: 2 },
      { v: "th", w: 1 }, { v: "ss", w: 1 }, { v: "qu", w: 1 }, { v: "vyr", w: 1 }, { v: "el", w: 1 },
      { v: "an", w: 1 }, { v: "en", w: 1 }, { v: "or", w: 1 }, { v: "ith", w: 1 }, { v: "sa", w: 1 },
    ],
    end: [
      { v: "ith", w: 2 }, { v: "or", w: 1 }, { v: "ael", w: 2 }, { v: "vyr", w: 2 }, { v: "zeph", w: 1 },
      { v: "quor", w: 1 }, { v: "hynn", w: 1 }, { v: "sael", w: 1 }, { v: "myr", w: 1 }, { v: "niel", w: 1 },
      { v: "thir", w: 1 }, { v: "vian", w: 1 }, { v: "rael", w: 1 }, { v: "xyr", w: 1 }, { v: "loth", w: 1 },
    ],
    titles: [
      { v: "Czarownik", w: 3 },
      { v: "Wyrocznia Przemiany", w: 1 },
      { v: "Prorok Tzeentcha", w: 1 },
      { v: "Tkacz Losów", w: 1 },
    ],
  },
  slaan: {
    pre: [
      { v: "Sla", w: 1 }, { v: "Luc", w: 2 }, { v: "Vel", w: 2 }, { v: "Ser", w: 2 }, { v: "Xan", w: 1 },
      { v: "Sha", w: 2 }, { v: "Eli", w: 2 }, { v: "Vyr", w: 1 }, { v: "Cael", w: 1 }, { v: "Nai", w: 1 },
      { v: "Zel", w: 1 }, { v: "Ase", w: 1 }, { v: "Lye", w: 1 }, { v: "Fae", w: 1 }, { v: "Rha", w: 1 },
    ],
    mid: [
      { v: "ae", w: 1 }, { v: "ia", w: 2 }, { v: "io", w: 2 }, { v: "y", w: 1 }, { v: "la", w: 2 },
      { v: "ra", w: 2 }, { v: "ve", w: 1 }, { v: "se", w: 1 }, { v: "th", w: 1 }, { v: "ss", w: 1 },
      { v: "el", w: 1 }, { v: "an", w: 1 }, { v: "en", w: 1 }, { v: "or", w: 1 }, { v: "ith", w: 1 },
    ],
    end: [
      { v: "ar", w: 2 }, { v: "ath", w: 1 }, { v: "iel", w: 2 }, { v: "yra", w: 2 }, { v: "essa", w: 2 },
      { v: "ion", w: 1 }, { v: "uar", w: 1 }, { v: "elis", w: 1 }, { v: "oriel", w: 1 }, { v: "yss", w: 1 },
      { v: "vane", w: 1 }, { v: "lure", w: 1 }, { v: "kiss", w: 1 }, { v: "rath", w: 1 }, { v: "veil", w: 1 },
    ],
    titles: [
      { v: "Mistrz Rozkoszy", w: 1 },
      { v: "Wybraniec Slaanesha", w: 2 },
      { v: "Kusiciel", w: 1 },
      { v: "Sybaryta", w: 1 },
    ],
  },
};

const SORORITAS = {
  givenA: [
    { v: "Aure", w: 3 }, { v: "Celes", w: 2 }, { v: "Serap", w: 2 }, { v: "Ver", w: 2 }, { v: "Isol", w: 1 },
    { v: "Honori", w: 1 }, { v: "Adeli", w: 2 }, { v: "Miri", w: 2 }, { v: "Domiti", w: 1 }, { v: "Lucia", w: 3 },
    { v: "Sabin", w: 1 }, { v: "Calpurn", w: 1 }, { v: "Marci", w: 1 }, { v: "Hel", w: 1 }, { v: "Cass", w: 1 },
    { v: "Valer", w: 1 }, { v: "Octav", w: 1 }, { v: "Sever", w: 1 }, { v: "Livi", w: 1 }, { v: "Lethe", w: 1 },
  ],
  givenB: [
    { v: "a", w: 4 }, { v: "ine", w: 2 }, { v: "ina", w: 3 }, { v: "ella", w: 1 }, { v: "oria", w: 2 },
    { v: "ia", w: 3 }, { v: "ette", w: 1 }, { v: "ana", w: 1 }, { v: "ene", w: 1 }, { v: "ara", w: 1 },
  ],
  surRoot: [
    { v: "Vorn", w: 2 }, { v: "Kessel", w: 1 }, { v: "Varro", w: 3 }, { v: "Stroud", w: 1 }, { v: "Cald", w: 1 },
    { v: "Ferr", w: 2 }, { v: "Thane", w: 1 }, { v: "Roth", w: 2 }, { v: "Serr", w: 2 }, { v: "Malk", w: 1 },
    { v: "Cairn", w: 1 }, { v: "Bex", w: 1 }, { v: "Ulric", w: 1 }, { v: "Kov", w: 1 }, { v: "Garr", w: 1 },
    { v: "Vayne", w: 1 }, { v: "Hale", w: 1 }, { v: "Mord", w: 1 }, { v: "Sable", w: 1 }, { v: "Praxis", w: 1 },
  ],
  surSuf: [
    { v: "ia", w: 3 }, { v: "ine", w: 2 }, { v: "ara", w: 2 }, { v: "ette", w: 1 }, { v: "elle", w: 1 },
    { v: "is", w: 2 }, { v: "a", w: 2 }, { v: "e", w: 1 },
  ],
  titles: [
    { v: "Siostra", w: 5 },
    { v: "Siostra Przełożona", w: 1 },
    { v: "Kanoniczka", w: 1 },
    { v: "Palatyna", w: 1 },
  ],
};

const WAR = {
  tanks: [
    { v: "Leman Russ", w: 5 }, { v: "Baneblade", w: 2 }, { v: "Chimera", w: 4 }, { v: "Hellhound", w: 2 },
    { v: "Basilisk", w: 2 }, { v: "Manticore", w: 2 }, { v: "Rogal Dorn", w: 2 },
  ],
  titans: [
    { v: "Warhound", w: 3 }, { v: "Reaver", w: 3 }, { v: "Warlord", w: 3 }, { v: "Warbringer", w: 1 }, { v: "Warmaster", w: 1 }, { v: "Imperator", w: 1 },
  ],
  knights: [
    { v: "Paladin", w: 3 }, { v: "Errant", w: 3 }, { v: "Warden", w: 2 }, { v: "Crusader", w: 3 },
    { v: "Gallant", w: 2 }, { v: "Preceptor", w: 1 }, { v: "Castellan", w: 2 }, { v: "Valiant", w: 1 },
  ],
  air: [
    { v: "Valkyrie", w: 4 }, { v: "Vendetta", w: 2 }, { v: "Vulture", w: 2 }, { v: "Thunderbolt", w: 2 }, { v: "Lightning", w: 1 },
  ],
  nounsPL: [
    { v: "Triumf", w: 3 }, { v: "Pokuta", w: 3 }, { v: "Wyrok", w: 2 }, { v: "Odsiecz", w: 1 }, { v: "Błyskawica", w: 1 },
    { v: "Zemsta", w: 4 }, { v: "Nieugiętość", w: 2 }, { v: "Cisza", w: 1 }, { v: "Przysięga", w: 3 }, { v: "Pochodnia", w: 1 },
    { v: "Żelazo", w: 2 }, { v: "Grom", w: 2 }, { v: "Litania", w: 1 }, { v: "Żar", w: 1 }, { v: "Świt", w: 1 },
    { v: "Zmierzch", w: 1 }, { v: "Krucjata", w: 2 }, { v: "Męstwo", w: 1 }, { v: "Zaciętość", w: 1 }, { v: "Czujność", w: 1 },
  ],
};

const SHIP = {
  imperialA: [
    { v: "Gloria", w: 2 }, { v: "Vigil", w: 2 }, { v: "Penance", w: 2 }, { v: "Resolve", w: 2 }, { v: "Judgement", w: 2 },
    { v: "Redemption", w: 2 }, { v: "Dominion", w: 2 }, { v: "Absolution", w: 1 }, { v: "Fidelity", w: 1 }, { v: "Tenacity", w: 1 },
    { v: "Sanction", w: 1 }, { v: "Triumph", w: 1 }, { v: "Concord", w: 1 }, { v: "Aegis", w: 2 }, { v: "Providence", w: 1 },
  ],
  imperialB: [
    { v: "Terrae", w: 3 }, { v: "Imperatoris", w: 3 }, { v: "Throni", w: 2 }, { v: "Martyrum", w: 1 }, { v: "Noctis", w: 2 },
    { v: "Astrae", w: 2 }, { v: "Ultimae", w: 1 }, { v: "Veritatis", w: 1 }, { v: "Custodiae", w: 1 }, { v: "Sanguinis", w: 1 },
    { v: "Lux", w: 1 }, { v: "Mortis", w: 1 }, { v: "Bellum", w: 1 }, { v: "Canticum", w: 1 }, { v: "Vindex", w: 1 },
  ],
  chaosA: [
    { v: "Bane", w: 2 }, { v: "Ruin", w: 2 }, { v: "Blight", w: 2 }, { v: "Malice", w: 2 }, { v: "Damnation", w: 2 },
    { v: "Rapture", w: 1 }, { v: "Desecration", w: 1 }, { v: "Ravage", w: 2 }, { v: "Torment", w: 2 }, { v: "Abyss", w: 1 },
    { v: "Fury", w: 2 }, { v: "Heresy", w: 2 }, { v: "Night", w: 1 }, { v: "Ash", w: 1 }, { v: "Sorrow", w: 1 },
  ],
  chaosB: [
    { v: "Oath", w: 1 }, { v: "Crown", w: 1 }, { v: "Dagger", w: 2 }, { v: "Pyre", w: 2 }, { v: "Gauntlet", w: 1 },
    { v: "Whisper", w: 1 }, { v: "Howl", w: 2 }, { v: "Shard", w: 2 }, { v: "Spear", w: 1 }, { v: "Covenant", w: 1 },
    { v: "Grimoire", w: 1 }, { v: "Requiem", w: 1 }, { v: "Hunger", w: 2 }, { v: "Gash", w: 1 }, { v: "Void", w: 2 },
  ],
  eldarA: [
    { v: "Asuryan", w: 2 }, { v: "Khaine", w: 2 }, { v: "Isha", w: 2 }, { v: "Lileath", w: 1 }, { v: "Kurnous", w: 1 },
    { v: "Morai", w: 1 }, { v: "Cegorach", w: 1 }, { v: "Ulth", w: 1 }, { v: "Alai", w: 1 }, { v: "Biel", w: 1 },
    { v: "Saim", w: 1 }, { v: "Iyand", w: 1 }, { v: "Webway", w: 1 }, { v: "Moon", w: 1 }, { v: "Star", w: 1 },
  ],
  eldarB: [
    { v: "Whisper", w: 2 }, { v: "Gleam", w: 1 }, { v: "Dawn", w: 2 }, { v: "Mist", w: 2 }, { v: "Song", w: 2 },
    { v: "Spear", w: 2 }, { v: "Shade", w: 2 }, { v: "Gale", w: 1 }, { v: "Dream", w: 1 }, { v: "Thread", w: 1 },
    { v: "Mirror", w: 1 }, { v: "Blade", w: 2 }, { v: "Echo", w: 1 }, { v: "Runes", w: 1 }, { v: "Silence", w: 1 },
  ],
  orkA: [
    { v: "Da", w: 4 }, { v: "Big", w: 3 }, { v: "Red", w: 3 }, { v: "Mean", w: 2 }, { v: "Loud", w: 2 },
    { v: "Krumpin", w: 2 }, { v: "Smashin", w: 2 }, { v: "Burnin", w: 2 }, { v: "Lootin", w: 2 }, { v: "Stompy", w: 2 },
    { v: "Killin", w: 2 }, { v: "Ragin", w: 1 }, { v: "Gorky", w: 1 }, { v: "Morky", w: 1 }, { v: "Nasty", w: 1 },
  ],
  orkB: [
    { v: "Kroozer", w: 3 }, { v: "Hulk", w: 2 }, { v: "Killship", w: 2 }, { v: "Ramskiff", w: 1 }, { v: "Dakka-Boat", w: 3 },
    { v: "Smasha", w: 2 }, { v: "Choppa-Barge", w: 2 }, { v: "Stompa-Ark", w: 1 }, { v: "Boom-Tub", w: 1 }, { v: "Rok-Boat", w: 1 }, { v: "Scrap-Barge", w: 1 },
  ],
  necronA: [
    { v: "Obelisk", w: 2 }, { v: "Tomb", w: 2 }, { v: "Cairn", w: 2 }, { v: "Monolith", w: 2 }, { v: "Crypt", w: 2 },
    { v: "Eon", w: 1 }, { v: "Void", w: 2 }, { v: "Silence", w: 1 }, { v: "Sarcophagus", w: 1 }, { v: "World", w: 1 },
  ],
  necronB: [
    { v: "Engine", w: 1 }, { v: "Harvester", w: 2 }, { v: "Ark", w: 3 }, { v: "Spire", w: 1 }, { v: "Reaper", w: 2 },
    { v: "Anvil", w: 1 }, { v: "Gate", w: 2 }, { v: "Crown", w: 1 }, { v: "Spear", w: 1 }, { v: "Protocol", w: 1 },
  ],
  astartesA: [
    { v: "Pride", w: 2 }, { v: "Oath", w: 2 }, { v: "Glory", w: 2 }, { v: "Vigil", w: 2 }, { v: "Wrath", w: 2 },
    { v: "Aegis", w: 2 }, { v: "Resolve", w: 2 }, { v: "Triumph", w: 1 }, { v: "Judgement", w: 1 }, { v: "Requital", w: 1 },
  ],
  astartesB: [
    { v: "Fenris", w: 1 }, { v: "Noctis", w: 2 }, { v: "Dorn", w: 2 }, { v: "Aquila", w: 2 }, { v: "Terra", w: 3 },
    { v: "Sanguis", w: 2 }, { v: "Vigilus", w: 1 }, { v: "Helion", w: 1 }, { v: "Calth", w: 1 }, { v: "Pharos", w: 1 },
  ],
  mechanicusA: [
    { v: "Omnissiah", w: 3 }, { v: "Ferrum", w: 2 }, { v: "Cognitio", w: 2 }, { v: "Machina", w: 2 }, { v: "Noosphere", w: 3 },
    { v: "Volt", w: 1 }, { v: "Praxium", w: 1 }, { v: "Logis", w: 2 }, { v: "Data", w: 2 }, { v: "Hex", w: 1 },
  ],
  mechanicusB: [
    { v: "Speranza", w: 1 }, { v: "Protocol", w: 3 }, { v: "Canticle", w: 2 }, { v: "Litany", w: 2 }, { v: "Axiom", w: 2 },
    { v: "Schema", w: 2 }, { v: "Index", w: 1 }, { v: "Reliquary", w: 1 }, { v: "Vector", w: 2 }, { v: "Dominion", w: 1 },
  ],
};

const CODEX = {
  unitPrefix: [
    { v: "Szpony", w: 2 }, { v: "Widma", w: 1 }, { v: "Wilki", w: 1 }, { v: "Kruki", w: 1 }, { v: "Żelazne", w: 2 },
    { v: "Czarne", w: 2 }, { v: "Popielne", w: 1 }, { v: "Purpurowe", w: 1 }, { v: "Błyszczące", w: 1 }, { v: "Milczące", w: 2 },
    { v: "Ślepe", w: 1 }, { v: "Ukryte", w: 1 }, { v: "Złamane", w: 1 }, { v: "Siódme", w: 1 }, { v: "Dziewiąte", w: 1 },
  ],
  unitCore: [
    { v: "Ostrza", w: 3 }, { v: "Młoty", w: 2 }, { v: "Włócznie", w: 2 }, { v: "Straże", w: 3 }, { v: "Myśliwi", w: 2 },
    { v: "Łowcy", w: 2 }, { v: "Sępy", w: 1 }, { v: "Wilki", w: 1 }, { v: "Noże", w: 1 }, { v: "Sękate Pięści", w: 1 },
    { v: "Cienie", w: 2 }, { v: "Wektory", w: 1 }, { v: "Baterie", w: 1 }, { v: "Żniwiarze", w: 2 }, { v: "Włócznicy", w: 1 },
  ],
  operationPrefix: [
    { v: "Operacja", w: 6 },
    { v: "Protokół", w: 2 },
    { v: "Dyrektywa", w: 2 },
    { v: "Plan", w: 1 },
    { v: "Wariant", w: 1 },
  ],
  operationCore: [
    { v: "Popiół", w: 2 }, { v: "Czarny Świt", w: 2 }, { v: "Martwa Cisza", w: 2 }, { v: "Żelazna Zasłona", w: 2 },
    { v: "Ostatnia Litania", w: 1 }, { v: "Krwawy Horyzont", w: 1 }, { v: "Próg Nocy", w: 1 }, { v: "Pusty Tron", w: 1 },
    { v: "Szary Płomień", w: 1 }, { v: "Szkło i Popiół", w: 1 }, { v: "Czysty Wyrok", w: 1 }, { v: "Martwe Niebo", w: 1 },
    { v: "Pył i Żelazo", w: 1 }, { v: "Długi Zmierzch", w: 1 }, { v: "Pochodnia", w: 1 },
  ],
  operationTag: [
    { v: "", w: 8 },
    { v: "Omega", w: 1 },
    { v: "Sigma", w: 1 },
    { v: "Kappa", w: 1 },
    { v: "IX", w: 1 },
  ],
};

/* =======================
   Generatory – rdzenie i formaty
   ======================= */

function genHumanUpper(rand) {
  return tryGenerate(() => {
    const g = cap(buildName([pickWeighted(HUMAN.upper.givenA, rand), pickWeighted(HUMAN.upper.givenB, rand)]));
    const s = cap(buildName([pickWeighted(HUMAN.upper.surRoot, rand), pickWeighted(HUMAN.upper.surSuf, rand)]));
    const core = `${g} ${s}`;
    return formatWithTitle(core, HUMAN.upper.titles, rand, 0.55);
  }, rand);
}

function genHumanLower(rand) {
  return tryGenerate(() => {
    const g = cap(buildName([pickWeighted(HUMAN.lower.givenA, rand), pickWeighted(HUMAN.lower.givenB, rand)]));
    const s = cap(buildName([pickWeighted(HUMAN.lower.surRoot, rand), pickWeighted(HUMAN.lower.surSuf, rand)]));
    const roll = rand();

    if (roll < 0.18) {
      return formatWithTitle(g, HUMAN.lower.titles, rand, 0.65);
    }
    if (roll < 0.32) {
      return cleanName(`${g} ${s}`);
    }
    return formatWithTitle(`${g} ${s}`, HUMAN.lower.titles, rand, 0.35);
  }, rand);
}

function genAstartes(rand) {
  return tryGenerate(() => {
    const first = cap(buildName([
      pickWeighted(ASTARTES.pre, rand),
      pickWeighted(ASTARTES.mid, rand),
      pickWeighted(ASTARTES.end, rand),
    ]));
    const cogn = cap(buildName([
      pickWeighted(ASTARTES.cognA, rand),
      pickWeighted(ASTARTES.cognB, rand),
    ]));
    const core = chance(0.82, rand) ? `${first} ${cogn}` : first;
    return formatWithTitle(core, ASTARTES.titles, rand, 0.72);
  }, rand);
}

function genAdMechTech(rand) {
  return tryGenerate(() => {
    let core = cap(buildName([
      pickWeighted(MECH.pre, rand),
      pickWeighted(MECH.mid, rand),
      pickWeighted(MECH.suf, rand),
    ]));

    if (chance(0.58, rand)) {
      const n = String(rollInt(100, 999, rand));
      core = `${core} ${pickWeighted(MECH.tag, rand)}${n}`;
    }
    return formatWithTitle(core, MECH.titles, rand, 0.82);
  }, rand);
}

function genAdMechSkit(rand) {
  return tryGenerate(() => {
    const unit = pickWeighted(MECH.skitariiUnits, rand);
    const n = `${String(rollInt(100, 999, rand))}-${String(rollInt(10, 99, rand))}`;
    const titleChance = rand();

    if (titleChance < 0.18) {
      return cleanName(`Skitariusz Alfa ${unit} ${n}`);
    }
    if (titleChance < 0.36) {
      return cleanName(`Prefekt ${unit} ${n}`);
    }
    return cleanName(`${unit} ${n}`);
  }, rand);
}

function genAeldariCraft(rand) {
  return tryGenerate(() => {
    const mid1 = pickWeighted(AELDARI.craft.mid, rand);
    const mid2 = chance(0.28, rand) ? pickWeighted(AELDARI.craft.mid, rand) : "";
    let name = cap(buildName([
      pickWeighted(AELDARI.craft.pre, rand),
      mid1,
      mid2,
      pickWeighted(AELDARI.craft.end, rand),
    ]));

    if (chance(0.28, rand)) {
      const by = cap(buildName([
        pickWeighted(AELDARI.craft.pre, rand),
        pickWeighted(AELDARI.craft.mid, rand),
        pickWeighted(AELDARI.craft.end, rand),
      ]));
      name = `${name} ${by}`;
    }
    return formatWithTitle(name, AELDARI.craft.titles, rand, 0.22);
  }, rand);
}

function genAeldariDrukhari(rand) {
  return tryGenerate(() => {
    const mid1 = pickWeighted(AELDARI.drukh.mid, rand);
    const mid2 = chance(0.38, rand) ? pickWeighted(AELDARI.drukh.mid, rand) : "";
    let name = cap(buildName([
      pickWeighted(AELDARI.drukh.pre, rand),
      mid1,
      mid2,
      pickWeighted(AELDARI.drukh.end, rand),
    ]));

    if (chance(0.22, rand)) {
      const by = cap(buildName([
        pickWeighted(AELDARI.drukh.pre, rand),
        pickWeighted(AELDARI.drukh.mid, rand),
        pickWeighted(AELDARI.drukh.end, rand),
      ]));
      name = `${name} ${by}`;
    }
    return formatWithTitle(name, AELDARI.drukh.titles, rand, 0.28);
  }, rand);
}

function genAeldariHarlequin(rand) {
  return tryGenerate(() => {
    let name = cap(buildName([
      pickWeighted(AELDARI.harl.pre, rand),
      pickWeighted(AELDARI.harl.mid, rand),
      pickWeighted(AELDARI.harl.end, rand),
    ]));

    if (chance(0.52, rand)) {
      const mask = cap(buildName([
        pickWeighted(AELDARI.harl.pre, rand),
        pickWeighted(AELDARI.harl.mid, rand),
        pickWeighted(AELDARI.harl.end, rand),
      ]));
      name = `${name} ${mask}`;
    }
    return formatWithTitle(name, AELDARI.harl.titles, rand, 0.22);
  }, rand);
}

function genNecronWarrior(rand) {
  return tryGenerate(() => {
    const core = cap(buildName([
      pickWeighted(NECRON.pre, rand),
      pickWeighted(NECRON.mid, rand),
      chance(0.24, rand) ? pickWeighted(NECRON.mid, rand) : "",
      pickWeighted(NECRON.end, rand),
    ]));
    return formatWithTitle(core, NECRON.warriorTitles, rand, 0.82);
  }, rand);
}

function genNecronLord(rand) {
  return tryGenerate(() => {
    const core = cap(buildName([
      pickWeighted(NECRON.pre, rand),
      pickWeighted(NECRON.mid, rand),
      pickWeighted(NECRON.mid, rand),
      pickWeighted(NECRON.end, rand),
    ]));
    return formatWithTitle(core, NECRON.lordTitles, rand, 0.9);
  }, rand);
}

function genOrk(rand) {
  return tryGenerate(() => {
    const core = cap(buildName([
      pickWeighted(ORK.pre, rand),
      pickWeighted(ORK.mid, rand),
      pickWeighted(ORK.end, rand),
    ]));
    return formatWithTitle(core, ORK.titles, rand, 0.28);
  }, rand);
}

function genSororitas(rand) {
  return tryGenerate(() => {
    const g = cap(buildName([pickWeighted(SORORITAS.givenA, rand), pickWeighted(SORORITAS.givenB, rand)]));
    const s = cap(buildName([pickWeighted(SORORITAS.surRoot, rand), pickWeighted(SORORITAS.surSuf, rand)]));
    return formatWithTitle(`${g} ${s}`, SORORITAS.titles, rand, 0.78);
  }, rand);
}

function genChaos(rand, sub) {
  return tryGenerate(() => {
    const pool = CHAOS[sub];
    const name = cap(buildName([
      pickWeighted(pool.pre, rand),
      pickWeighted(pool.mid, rand),
      chance(0.28, rand) ? pickWeighted(pool.mid, rand) : "",
      pickWeighted(pool.end, rand),
    ]));
    return formatWithTitle(name, pool.titles, rand, 0.76);
  }, rand);
}

function genWarMachine(rand, kind) {
  const base = pickWeighted(WAR.nounsPL, rand);

  if (kind === "tank") {
    return formatNamedThing(`Czołg ${pickWeighted(WAR.tanks, rand)}`, base);
  }
  if (kind === "titan") {
    return formatNamedThing(`Tytan klasy ${pickWeighted(WAR.titans, rand)}`, base);
  }
  if (kind === "knight") {
    return formatNamedThing(`Rycerz wzorca ${pickWeighted(WAR.knights, rand)}`, base);
  }
  return formatNamedThing(`Statek powietrzny ${pickWeighted(WAR.air, rand)}`, base);
}

function genShip(rand, faction) {
  if (faction === "imperial") {
    const a = pickWeighted(SHIP.imperialA, rand);
    const b = pickWeighted(SHIP.imperialB, rand);
    return cleanName(`${a} ${b}`);
  }

  if (faction === "chaos") {
    const a = pickWeighted(SHIP.chaosA, rand);
    const b = pickWeighted(SHIP.chaosB, rand);
    return chance(0.55, rand) ? cleanName(`${a} ${b}`) : cleanName(`${b} ${a}`);
  }

  if (faction === "eldar" || faction === "drukhari") {
    const a = pickWeighted(SHIP.eldarA, rand);
    const b = pickWeighted(SHIP.eldarB, rand);
    return chance(0.55, rand) ? cleanName(`${a} ${b}`) : cleanName(`${b} ${a}`);
  }

  if (faction === "necron") {
    return cleanName(`${pickWeighted(SHIP.necronA, rand)} ${pickWeighted(SHIP.necronB, rand)}`);
  }

  if (faction === "ork") {
    return cleanName(`${pickWeighted(SHIP.orkA, rand)} ${pickWeighted(SHIP.orkB, rand)}`);
  }

  if (faction === "astartes") {
    const a = pickWeighted(SHIP.astartesA, rand);
    const b = pickWeighted(SHIP.astartesB, rand);
    return chance(0.5, rand) ? cleanName(`${a} ${b}`) : cleanName(`${b} ${a}`);
  }

  // mechanicus
  const a = pickWeighted(SHIP.mechanicusA, rand);
  const b = pickWeighted(SHIP.mechanicusB, rand);
  return cleanName(`${a} ${b}`);
}

function genUnitCodename(rand) {
  return tryGenerate(() => {
    if (chance(0.5, rand)) {
      return cleanName(`${pickWeighted(CODEX.unitPrefix, rand)} ${pickWeighted(CODEX.unitCore, rand)}`);
    }
    return cleanName(`${pickWeighted(CODEX.unitCore, rand)} ${pickWeighted(CODEX.unitPrefix, rand)}`);
  }, rand);
}

function genOperationCodename(rand) {
  return tryGenerate(() => {
    const prefix = pickWeighted(CODEX.operationPrefix, rand);
    const core = pickWeighted(CODEX.operationCore, rand);
    const tag = pickWeighted(CODEX.operationTag, rand);
    return tag ? cleanName(`${prefix} ${core} ${tag}`) : cleanName(`${prefix} ${core}`);
  }, rand);
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
      { key: "warrior", name: "Wojownicy", nameEn: "Warriors", gen: (r) => genNecronWarrior(r) },
      { key: "lord", name: "Lordowie", nameEn: "Lords", gen: (r) => genNecronLord(r) },
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
      { key: "air", name: "Lotnictwo", nameEn: "Air Wing", gen: (r) => genWarMachine(r, "air") },
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
  {
    key: "unitcodes",
    name: "Kryptonimy oddziałów",
    nameEn: "Unit codenames",
    options: [
      { key: "standard", name: "Kryptonim oddziału", nameEn: "Unit codename", gen: (r) => genUnitCodename(r) },
    ],
  },
  {
    key: "opcodes",
    name: "Kryptonimy operacji",
    nameEn: "Operation codenames",
    options: [
      { key: "standard", name: "Kryptonim operacji", nameEn: "Operation codename", gen: (r) => genOperationCodename(r) },
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
  if (!Number.isFinite(n) || n < 1) n = 1;
  if (n > 20) n = 20;

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

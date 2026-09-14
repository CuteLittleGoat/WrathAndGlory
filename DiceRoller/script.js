// Plik logiki modułu: konfiguracja, funkcje i obsługa zdarzeń / Module logic file: configuration, functions, and event handling
const difficultyInput = document.getElementById("difficulty");
const poolInput = document.getElementById("pool");
const wrathInput = document.getElementById("wrath");
const rollButton = document.getElementById("roll");
const diceContainer = document.getElementById("dice");
const summary = document.getElementById("summary");
const rollDetails = document.getElementById("rollDetails");
const rollDetailsToggle = document.getElementById("rollDetailsToggle");
const rollDetailsBody = document.getElementById("rollDetailsBody");
const subtitle = document.getElementById("subtitle");
const pageTitle = document.getElementById("pageTitle");
const difficultyLabel = document.getElementById("difficultyLabel");
const poolLabel = document.getElementById("poolLabel");
const wrathLabel = document.getElementById("wrathLabel");
const wrathHint = document.getElementById("wrathHint");
const languageSelect = document.getElementById("languageSelect");
const mainPageButton = document.getElementById("mainPageButton");

const MIN_VALUE = 1;
const MAX_VALUE = 99;
const DEFAULT_DIFFICULTY = 3;
const DEFAULT_POOL = 2;
const DEFAULT_WRATH = 1;
const ROLL_DURATION = 900;
// Podsumowanie ma stałą liczbę wierszy, żeby wynik nie przesuwał strony w pionie.
// The summary has a fixed number of rows so a result does not shift the page vertically.
const SUMMARY_LINES = 4;
// Ile kości mieści jedna kolumna tabeli detali; przy większej puli powstają kolejne kolumny.
// How many dice fit one details-table column; a larger pool produces further columns.
const DETAILS_ROWS_PER_COLUMN = 5;

// --- MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT ---
// Nowy język wymaga dopisania pełnego zestawu labels/messages w translations oraz aktualizacji opcji selecta języka w HTML.
// A new language requires a full labels/messages set in translations and an updated language select list in HTML.
const translations = {
  pl: {
    labels: {
      pageTitle: "DiceRoller",
      subtitle: "Symulacja rzutów kośćmi dla Wrath & Glory",
      difficulty: "Stopień Trudności",
      pool: "Pula Kości",
      wrath: "Ilość Kości Furii",
      wrathHint: "Nie większa niż Pula Kości.",
      roll: "Rzuć Kośćmi!",
      placeholderIdle: "Wpisz parametry i rzuć kośćmi, aby zobaczyć wynik.",
      placeholderRolling: "Rzut w toku...",
      languageSelect: "Wersja językowa",
      mainPageButton: "Strona Główna",
      rollDetails: "Detale rzutu",
    },
    messages: {
      success: "Sukces!",
      failure: "Porażka!",
      wrathCritical: "Krytyczna Furia",
      wrathComplication: "Komplikacja Furii",
      possibleShift: "Możliwe Przeniesienie",
      totalPoints: "Łączne punkty",
      difficultyNumber: "Stopień Trudności",
      dieLabel: "Kość",
      pointsLabel: "punkty",
      detailsDie: "Kość",
      detailsResult: "Wynik",
      detailsPoints: "Punkty",
      detailsWrathMark: "Furia",
      detailsEmpty: "Rzuć kośćmi, aby zobaczyć szczegóły poszczególnych kości.",
    },
  },
  en: {
    labels: {
      pageTitle: "DiceRoller",
      subtitle: "Dice Roll Simulation for Wrath & Glory",
      difficulty: "Difficulty Number",
      pool: "Dice Pool",
      wrath: "Number of Wrath Dice",
      wrathHint: "No greater than the Dice Pool.",
      roll: "Roll the dice!",
      placeholderIdle: "Enter your parameters and roll the dice to see the result.",
      placeholderRolling: "Rolling the dice...",
      languageSelect: "Language version",
      mainPageButton: "Main Page",
      rollDetails: "Roll details",
    },
    messages: {
      success: "Success!",
      failure: "Failure!",
      wrathCritical: "Wrath Critical",
      wrathComplication: "Wrath Complication",
      possibleShift: "Possible Shift",
      totalPoints: "Total points",
      difficultyNumber: "Difficulty Number",
      dieLabel: "Die",
      pointsLabel: "points",
      detailsDie: "Die",
      detailsResult: "Result",
      detailsPoints: "Points",
      detailsWrathMark: "Wrath",
      detailsEmpty: "Roll the dice to see the individual dice details.",
    },
  },
};

let currentLanguage = "pl";

const clampValue = (value, min = MIN_VALUE, max = MAX_VALUE) => {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
};

const sanitizeField = (input) => {
  const parsed = Number.parseInt(input.value, 10);
  const clamped = clampValue(parsed);
  input.value = clamped;
  return clamped;
};

const syncPoolAndWrath = () => {
  const pool = sanitizeField(poolInput);
  let wrath = sanitizeField(wrathInput);

  if (wrath > pool) {
    wrath = pool;
    wrathInput.value = wrath;
  }

  return { pool, wrath };
};

const createDieElement = (isWrath) => {
  const die = document.createElement("div");
  die.className = `die ${isWrath ? "red" : "white"} face-1`;

  const question = document.createElement("span");
  question.className = "die__question";
  question.textContent = "?";
  die.appendChild(question);

  for (let i = 1; i <= 7; i += 1) {
    const pip = document.createElement("span");
    pip.className = `pip pos-${i}`;
    die.appendChild(pip);
  }

  return die;
};

const setDieFace = (die, value) => {
  die.classList.remove("face-1", "face-2", "face-3", "face-4", "face-5", "face-6");
  die.classList.add(`face-${value}`);
};

const rollDie = () => Math.floor(Math.random() * 6) + 1;

const scoreValue = (value) => {
  if (value <= 3) {
    return 0;
  }
  if (value <= 5) {
    return 1;
  }
  return 2;
};

// Podsumowanie zawsze składa się z SUMMARY_LINES wierszy. Wiersz bez treści zostaje pusty, więc
// wysokość ramki jest stała niezależnie od tego, ile informacji ma dany rzut.
// The summary always consists of SUMMARY_LINES rows. A row with no content stays empty, so the box
// height is constant no matter how much information a given roll carries.
const renderSummaryLines = (lines) => {
  summary.innerHTML = "";
  for (let i = 0; i < SUMMARY_LINES; i += 1) {
    const line = lines[i];
    const node = document.createElement("p");
    node.className = "summary__line";
    if (line) {
      if (line.className) {
        node.className += ` ${line.className}`;
      }
      node.textContent = line.text;
    }
    summary.appendChild(node);
  }
};

// Komunikat startowy zajmuje jeden akapit rozciągnięty na wszystkie cztery wiersze siatki. Dzięki
// temu ramka ma dokładnie tę samą wysokość co przy pełnym wyniku, nawet gdy na wąskim ekranie
// komunikat złamie się na kilka linii.
// The starting message is a single paragraph stretched across all four grid rows. That gives the box
// exactly the same height as a full result, even when the message wraps onto several lines on a
// narrow screen.
const showSummaryPlaceholder = (text) => {
  summary.innerHTML = "";
  const node = document.createElement("p");
  node.className = "summary__line summary__placeholder";
  node.textContent = text;
  summary.appendChild(node);
};

// Tabela detali dzieli kości na kolumny po DETAILS_ROWS_PER_COLUMN wierszy, żeby przy dużej puli
// nie powstawała jedna bardzo długa lista. Wiersze Kości Furii mają czerwony font.
// The details table splits the dice into columns of DETAILS_ROWS_PER_COLUMN rows so that a large
// pool does not produce one very long list. Wrath dice rows use a red font.
const buildRollDetails = (results, wrathCount) => {
  const t = translations[currentLanguage].messages;
  rollDetailsBody.innerHTML = "";

  if (!results.length) {
    const empty = document.createElement("p");
    empty.className = "rollDetails__empty";
    empty.textContent = t.detailsEmpty;
    rollDetailsBody.appendChild(empty);
    return;
  }

  for (let start = 0; start < results.length; start += DETAILS_ROWS_PER_COLUMN) {
    const chunk = results.slice(start, start + DETAILS_ROWS_PER_COLUMN);
    const table = document.createElement("table");
    table.className = "rollDetails__table";

    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    [t.detailsDie, t.detailsResult, t.detailsPoints].forEach((label) => {
      const cell = document.createElement("th");
      cell.scope = "col";
      cell.textContent = label;
      headRow.appendChild(cell);
    });
    head.appendChild(headRow);
    table.appendChild(head);

    const body = document.createElement("tbody");
    chunk.forEach((value, offset) => {
      const index = start + offset;
      const isWrath = index < wrathCount;
      const row = document.createElement("tr");
      if (isWrath) {
        row.classList.add("rollDetails__row--wrath");
      }

      const name = document.createElement("th");
      name.scope = "row";
      name.textContent = isWrath
        ? `${t.dieLabel} ${index + 1} (${t.detailsWrathMark})`
        : `${t.dieLabel} ${index + 1}`;
      row.appendChild(name);

      const result = document.createElement("td");
      result.textContent = String(value);
      row.appendChild(result);

      const points = document.createElement("td");
      points.textContent = String(scoreValue(value));
      row.appendChild(points);

      body.appendChild(row);
    });
    table.appendChild(body);
    rollDetailsBody.appendChild(table);
  }
};

const buildSummary = ({
  totalPoints,
  difficulty,
  success,
  wrathMessage,
  transferable,
  results,
  wrathCount,
}) => {
  const t = translations[currentLanguage].messages;
  renderSummaryLines([
    { text: success ? t.success : t.failure, className: "summary__headline" },
    wrathMessage ? { text: wrathMessage, className: "summary__headline summary__headline--secondary" } : null,
    transferable > 0 ? { text: `${t.possibleShift}: ${transferable}`, className: "summary__transfer" } : null,
    { text: `${t.totalPoints}: ${totalPoints} (${t.difficultyNumber}: ${difficulty})`, className: "summary__detail" },
  ]);
  buildRollDetails(results, wrathCount);
};

const resetState = () => {
  difficultyInput.value = DEFAULT_DIFFICULTY;
  poolInput.value = DEFAULT_POOL;
  wrathInput.value = DEFAULT_WRATH;
  diceContainer.innerHTML = "";
  showSummaryPlaceholder(translations[currentLanguage].labels.placeholderIdle);
  rollDetails.open = false;
  buildRollDetails([], 0);
};

const updateLanguage = (lang) => {
  currentLanguage = lang;
  const t = translations[lang];
  document.documentElement.lang = lang;
  languageSelect.value = lang;
  languageSelect.setAttribute("aria-label", t.labels.languageSelect);
  pageTitle.textContent = t.labels.pageTitle;
  subtitle.textContent = t.labels.subtitle;
  difficultyLabel.textContent = t.labels.difficulty;
  poolLabel.textContent = t.labels.pool;
  wrathLabel.textContent = t.labels.wrath;
  wrathHint.textContent = t.labels.wrathHint;
  rollButton.textContent = t.labels.roll;
  mainPageButton.textContent = t.labels.mainPageButton;
  rollDetailsToggle.textContent = t.labels.rollDetails;
  resetState();
};

const handleRoll = () => {
  const difficulty = sanitizeField(difficultyInput);
  const { pool, wrath } = syncPoolAndWrath();
  const t = translations[currentLanguage].messages;

  diceContainer.innerHTML = "";
  showSummaryPlaceholder(translations[currentLanguage].labels.placeholderRolling);
  // Nowy rzut zawsze zwija detale poprzedniego, żeby nie sugerowały, że dotyczą bieżącego wyniku.
  // A new roll always collapses the previous details, so they cannot look like the current result.
  rollDetails.open = false;
  buildRollDetails([], 0);

  const diceElements = [];
  for (let i = 0; i < pool; i += 1) {
    const die = createDieElement(i < wrath);
    die.classList.add("rolling");
    setDieFace(die, rollDie());
    diceElements.push(die);
    diceContainer.appendChild(die);
  }

  const results = diceElements.map(() => rollDie());

  setTimeout(() => {
    diceElements.forEach((die, index) => {
      die.classList.remove("rolling");
      setDieFace(die, results[index]);
    });

    const totalPoints = results.reduce((sum, value) => sum + scoreValue(value), 0);
    const success = totalPoints >= difficulty;

    const wrathResults = results.slice(0, wrath);
    let wrathMessage = "";
    if (wrathResults.length > 0) {
      if (wrathResults.every((value) => value === 6)) {
        wrathMessage = `${t.wrathCritical} 🙂`;
      } else if (wrathResults.some((value) => value === 1)) {
        wrathMessage = `${t.wrathComplication} 🙁`;
      }
    }

    const totalSixes = results.filter((value) => value === 6).length;
    const margin = totalPoints - difficulty;
    const transferable = success
      ? Math.min(totalSixes, Math.floor(margin / 2))
      : 0;

    buildSummary({
      totalPoints,
      difficulty,
      success,
      wrathMessage,
      transferable,
      results,
      wrathCount: wrath,
    });
  }, ROLL_DURATION);
};

[difficultyInput, poolInput, wrathInput].forEach((input) => {
  input.addEventListener("change", () => {
    sanitizeField(input);
    if (input === poolInput || input === wrathInput) {
      syncPoolAndWrath();
    }
  });

  input.addEventListener("blur", () => {
    sanitizeField(input);
    if (input === poolInput || input === wrathInput) {
      syncPoolAndWrath();
    }
  });
});

rollButton.addEventListener("click", handleRoll);

languageSelect.addEventListener("change", (event) => {
  updateLanguage(event.target.value);
});

updateLanguage(currentLanguage);

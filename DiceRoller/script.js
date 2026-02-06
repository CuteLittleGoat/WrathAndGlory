const difficultyInput = document.getElementById("difficulty");
const poolInput = document.getElementById("pool");
const wrathInput = document.getElementById("wrath");
const rollButton = document.getElementById("roll");
const diceContainer = document.getElementById("dice");
const summary = document.getElementById("summary");
const subtitle = document.getElementById("subtitle");
const pageTitle = document.getElementById("pageTitle");
const difficultyLabel = document.getElementById("difficultyLabel");
const poolLabel = document.getElementById("poolLabel");
const wrathLabel = document.getElementById("wrathLabel");
const wrathHint = document.getElementById("wrathHint");
const languageSelect = document.getElementById("languageSelect");

const MIN_VALUE = 1;
const MAX_VALUE = 99;
const DEFAULT_DIFFICULTY = 3;
const DEFAULT_POOL = 2;
const DEFAULT_WRATH = 1;
const ROLL_DURATION = 900;

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

const buildSummary = ({
  totalPoints,
  difficulty,
  success,
  wrathMessage,
  transferable,
  results,
}) => {
  const t = translations[currentLanguage].messages;
  summary.innerHTML = "";

  const heading = document.createElement("h2");
  heading.classList.add("summary__headline");
  heading.textContent = success ? t.success : t.failure;
  summary.appendChild(heading);

  if (wrathMessage) {
    const wrath = document.createElement("p");
    wrath.classList.add("summary__headline", "summary__headline--secondary");
    wrath.textContent = wrathMessage;
    summary.appendChild(wrath);
  }

  if (transferable > 0) {
    const transfer = document.createElement("p");
    transfer.classList.add("summary__transfer");
    transfer.textContent = `${t.possibleShift}: ${transferable}`;
    summary.appendChild(transfer);

    const spacer = document.createElement("div");
    spacer.classList.add("summary__spacer");
    summary.appendChild(spacer);
  }

  const points = document.createElement("p");
  points.classList.add("summary__detail");
  points.textContent = `${t.totalPoints}: ${totalPoints} (${t.difficultyNumber}: ${difficulty})`;
  summary.appendChild(points);

  const list = document.createElement("ul");
  results.forEach((value, index) => {
    const item = document.createElement("li");
    item.textContent = `${t.dieLabel} ${index + 1}: ${value} (${t.pointsLabel} ${scoreValue(value)})`;
    list.appendChild(item);
  });
  summary.appendChild(list);
};

const resetState = () => {
  difficultyInput.value = DEFAULT_DIFFICULTY;
  poolInput.value = DEFAULT_POOL;
  wrathInput.value = DEFAULT_WRATH;
  diceContainer.innerHTML = "";
  summary.innerHTML = `<p class="summary__placeholder">${translations[currentLanguage].labels.placeholderIdle}</p>`;
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
  resetState();
};

const handleRoll = () => {
  const difficulty = sanitizeField(difficultyInput);
  const { pool, wrath } = syncPoolAndWrath();
  const t = translations[currentLanguage].messages;

  diceContainer.innerHTML = "";
  summary.innerHTML = `<p class="summary__placeholder">${translations[currentLanguage].labels.placeholderRolling}</p>`;

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

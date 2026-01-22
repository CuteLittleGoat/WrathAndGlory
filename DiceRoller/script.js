const difficultyInput = document.getElementById("difficulty");
const poolInput = document.getElementById("pool");
const furyInput = document.getElementById("fury");
const rollButton = document.getElementById("roll");
const diceContainer = document.getElementById("dice");
const summary = document.getElementById("summary");
const subtitle = document.getElementById("subtitle");
const difficultyLabel = document.getElementById("difficultyLabel");
const poolLabel = document.getElementById("poolLabel");
const furyLabel = document.getElementById("furyLabel");
const furyHint = document.getElementById("furyHint");
const languageSelect = document.getElementById("languageSelect");

const MIN_VALUE = 1;
const MAX_VALUE = 99;
const ROLL_DURATION = 900;

const translations = {
  pl: {
    subtitle: "Symulacja rzutów kośćmi dla Wrath & Glory",
    labels: {
      difficulty: "Stopień Trudności",
      pool: "Pula Kości",
      fury: "Ilość Kości Furii",
    },
    hints: {
      furyLimit: "Nie większa niż Pula Kości.",
    },
    buttons: {
      roll: "Rzuć Kośćmi!",
    },
    placeholders: {
      idle: "Wpisz parametry i rzuć kośćmi, aby zobaczyć wynik.",
      rolling: "Rzut w toku...",
    },
    messages: {
      success: "Sukces!",
      failure: "Porażka!",
      furyCritical: "Krytyczna Furia",
      furyComplication: "Komplikacja Furii",
      possibleShift: "Możliwe Przeniesienie",
      totalPoints: "Łączne punkty",
      difficultyNumber: "Stopień Trudności",
      dieLabel: "Kość",
      pointsLabel: "punkty",
    },
  },
  en: {
    subtitle: "Dice Roll Simulation for Wrath & Glory",
    labels: {
      difficulty: "Difficulty Number",
      pool: "Dice Pool",
      fury: "Number of Wrath Dice",
    },
    hints: {
      furyLimit: "No greater than the Dice Pool.",
    },
    buttons: {
      roll: "Roll the dice!",
    },
    placeholders: {
      idle: "Enter your parameters and roll the dice to see the result.",
      rolling: "Rolling the dice...",
    },
    messages: {
      success: "Success!",
      failure: "Failure!",
      furyCritical: "Wrath Complication",
      furyComplication: "Wrath Critical",
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

const syncPoolAndFury = () => {
  const pool = sanitizeField(poolInput);
  let fury = sanitizeField(furyInput);

  if (fury > pool) {
    fury = pool;
    furyInput.value = fury;
  }

  return { pool, fury };
};

const createDieElement = (isFury) => {
  const die = document.createElement("div");
  die.className = `die ${isFury ? "red" : "white"} face-1`;

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
  furyMessage,
  transferable,
  results,
}) => {
  const t = translations[currentLanguage].messages;
  summary.innerHTML = "";

  const heading = document.createElement("h2");
  heading.classList.add("summary__headline");
  heading.textContent = success ? t.success : t.failure;
  summary.appendChild(heading);

  if (furyMessage) {
    const fury = document.createElement("p");
    fury.classList.add("summary__headline", "summary__headline--secondary");
    fury.textContent = furyMessage;
    summary.appendChild(fury);
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
  difficultyInput.value = MIN_VALUE;
  poolInput.value = MIN_VALUE;
  furyInput.value = MIN_VALUE;
  diceContainer.innerHTML = "";
  summary.innerHTML = `<p class="summary__placeholder">${translations[currentLanguage].placeholders.idle}</p>`;
};

const updateLanguage = (lang) => {
  currentLanguage = lang;
  const t = translations[lang];
  document.documentElement.lang = lang;
  languageSelect.value = lang;
  subtitle.textContent = t.subtitle;
  difficultyLabel.textContent = t.labels.difficulty;
  poolLabel.textContent = t.labels.pool;
  furyLabel.textContent = t.labels.fury;
  furyHint.textContent = t.hints.furyLimit;
  rollButton.textContent = t.buttons.roll;
  resetState();
};

const handleRoll = () => {
  const difficulty = sanitizeField(difficultyInput);
  const { pool, fury } = syncPoolAndFury();
  const t = translations[currentLanguage].messages;

  diceContainer.innerHTML = "";
  summary.innerHTML = `<p class="summary__placeholder">${translations[currentLanguage].placeholders.rolling}</p>`;

  const diceElements = [];
  for (let i = 0; i < pool; i += 1) {
    const die = createDieElement(i < fury);
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

    const furyResults = results.slice(0, fury);
    let furyMessage = "";
    if (furyResults.length > 0) {
      if (furyResults.every((value) => value === 6)) {
        furyMessage = `${t.furyCritical} 🙂`;
      } else if (furyResults.some((value) => value === 1)) {
        furyMessage = `${t.furyComplication} 🙁`;
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
      furyMessage,
      transferable,
      results,
    });
  }, ROLL_DURATION);
};

[difficultyInput, poolInput, furyInput].forEach((input) => {
  input.addEventListener("change", () => {
    sanitizeField(input);
    if (input === poolInput || input === furyInput) {
      syncPoolAndFury();
    }
  });

  input.addEventListener("blur", () => {
    sanitizeField(input);
    if (input === poolInput || input === furyInput) {
      syncPoolAndFury();
    }
  });
});

rollButton.addEventListener("click", handleRoll);

languageSelect.addEventListener("change", (event) => {
  updateLanguage(event.target.value);
});

updateLanguage(currentLanguage);

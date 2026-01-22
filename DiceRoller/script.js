const difficultyInput = document.getElementById("difficulty");
const poolInput = document.getElementById("pool");
const furyInput = document.getElementById("fury");
const rollButton = document.getElementById("roll");
const diceContainer = document.getElementById("dice");
const summary = document.getElementById("summary");

const MIN_VALUE = 1;
const MAX_VALUE = 99;
const ROLL_DURATION = 900;

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
  summary.innerHTML = "";

  const heading = document.createElement("h2");
  heading.textContent = success ? "Sukces!" : "Porażka!";
  summary.appendChild(heading);

  if (furyMessage) {
    const fury = document.createElement("p");
    fury.textContent = furyMessage;
    summary.appendChild(fury);
  }

  const points = document.createElement("p");
  points.textContent = `Łączne punkty: ${totalPoints} (Stopień Trudności: ${difficulty})`;
  summary.appendChild(points);

  if (transferable > 0) {
    const transfer = document.createElement("p");
    transfer.textContent = `Możliwe Przeniesienie: ${transferable}`;
    summary.appendChild(transfer);
  }

  const list = document.createElement("ul");
  results.forEach((value, index) => {
    const item = document.createElement("li");
    item.textContent = `Kość ${index + 1}: ${value} (punkty ${scoreValue(value)})`;
    list.appendChild(item);
  });
  summary.appendChild(list);
};

const handleRoll = () => {
  const difficulty = sanitizeField(difficultyInput);
  const { pool, fury } = syncPoolAndFury();

  diceContainer.innerHTML = "";
  summary.innerHTML = "<p class=\"summary__placeholder\">Rzut w toku...</p>";

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
        furyMessage = "Krytyczna Furia 🙂";
      } else if (furyResults.some((value) => value === 1)) {
        furyMessage = "Komplikacja Furii 🙁";
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

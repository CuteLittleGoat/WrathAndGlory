const difficultyInput = document.getElementById("difficulty");
const poolInput = document.getElementById("pool");
const furyInput = document.getElementById("fury");
const rollButton = document.getElementById("roll");
const diceContainer = document.getElementById("dice");
const summary = document.getElementById("summary");

const MIN_VALUE = 1;
const MAX_VALUE = 99;
const ROLL_DURATION = 1400;
const ROLL_PADDING = 8;

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

const getRandomBetween = (min, max) => Math.random() * (max - min) + min;

const clampToBounds = (value, min, max) => Math.min(Math.max(value, min), max);

const createBouncePath = (bounds, dieSize) => {
  const maxX = Math.max(bounds.width - dieSize - ROLL_PADDING, 0);
  const maxY = Math.max(bounds.height - dieSize - ROLL_PADDING, 0);

  const start = {
    x: getRandomBetween(ROLL_PADDING, maxX),
    y: getRandomBetween(ROLL_PADDING, maxY),
  };

  const mid = {
    x: clampToBounds(start.x + getRandomBetween(-maxX * 0.6, maxX * 0.6), 0, maxX),
    y: clampToBounds(start.y + getRandomBetween(-maxY * 0.6, maxY * 0.6), 0, maxY),
  };

  const bounce = {
    x: clampToBounds(mid.x + getRandomBetween(-maxX * 0.7, maxX * 0.7), 0, maxX),
    y: clampToBounds(mid.y + getRandomBetween(-maxY * 0.7, maxY * 0.7), 0, maxY),
  };

  const end = {
    x: clampToBounds(bounce.x + getRandomBetween(-maxX * 0.5, maxX * 0.5), 0, maxX),
    y: clampToBounds(bounce.y + getRandomBetween(-maxY * 0.5, maxY * 0.5), 0, maxY),
  };

  return { start, mid, bounce, end };
};

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

  const points = document.createElement("p");
  points.textContent = `Łączne punkty: ${totalPoints} (Stopień Trudności: ${difficulty})`;
  summary.appendChild(points);

  if (furyMessage) {
    const fury = document.createElement("p");
    fury.textContent = furyMessage;
    summary.appendChild(fury);
  }

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
  diceContainer.classList.add("is-rolling");
  summary.innerHTML = "<p class=\"summary__placeholder\">Rzut w toku...</p>";

  const diceElements = [];
  for (let i = 0; i < pool; i += 1) {
    const die = createDieElement(i < fury);
    die.classList.add("die--rolling");
    setDieFace(die, rollDie());
    diceElements.push(die);
    diceContainer.appendChild(die);
  }

  const results = diceElements.map(() => rollDie());

  requestAnimationFrame(() => {
    const bounds = diceContainer.getBoundingClientRect();
    diceElements.forEach((die) => {
      const dieBounds = die.getBoundingClientRect();
      const dieSize = Math.max(dieBounds.width, dieBounds.height);
      const path = createBouncePath(bounds, dieSize);

      die.style.setProperty("--x-start", `${path.start.x}px`);
      die.style.setProperty("--y-start", `${path.start.y}px`);
      die.style.setProperty("--x-mid", `${path.mid.x}px`);
      die.style.setProperty("--y-mid", `${path.mid.y}px`);
      die.style.setProperty("--x-bounce", `${path.bounce.x}px`);
      die.style.setProperty("--y-bounce", `${path.bounce.y}px`);
      die.style.setProperty("--x-end", `${path.end.x}px`);
      die.style.setProperty("--y-end", `${path.end.y}px`);
      die.style.setProperty("--x-stop", `${path.end.x}px`);
      die.style.setProperty("--y-stop", `${path.end.y}px`);
    });
  });

  setTimeout(() => {
    diceElements.forEach((die, index) => {
      die.classList.remove("die--rolling");
      die.style.removeProperty("--x-start");
      die.style.removeProperty("--y-start");
      die.style.removeProperty("--x-mid");
      die.style.removeProperty("--y-mid");
      die.style.removeProperty("--x-bounce");
      die.style.removeProperty("--y-bounce");
      die.style.removeProperty("--x-end");
      die.style.removeProperty("--y-end");
      die.style.removeProperty("--x-stop");
      die.style.removeProperty("--y-stop");
      setDieFace(die, results[index]);
    });
    diceContainer.classList.remove("is-rolling");

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

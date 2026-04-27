# DiceRoller — Documentation (technical)

## 1. Files
- `DiceRoller/index.html` — UI layout and controls.
- `DiceRoller/style.css` — theme and responsive presentation.
- `DiceRoller/script.js` — dice logic, scoring, i18n, animation.

## 2. Logic model
- Inputs: `difficulty`, `pool`, `wrath`.
- Values are clamped by helper functions (`sanitizeField`, `clampValue`).
- Wrath count is synchronized not to exceed dice pool.
- Roll generation: `Math.random()` with range 1–6 per die.

## 3. Scoring
- `scoreValue(value)` converts die faces to points per module rule-set.
- Total points are compared against difficulty.
- Additional flags calculated:
  - critical/special states,
  - complication from wrath outcomes,
  - transferable icons/effects when applicable.

## 4. UI rendering flow
1. Reset previous result state.
2. Build die nodes in DOM.
3. Apply temporary rolling animation (`ROLL_DURATION`).
4. Commit final faces and compose summary block.

## 5. i18n
- `translations` object contains full PL/EN labels/messages.
- `updateLanguage(lang)` updates:
  - title/subtitle,
  - labels,
  - hints,
  - button texts,
  - aria attributes.

## 6. Rebuild checklist
1. Recreate inputs + roll button + result container.
2. Recreate clamp/sanitize helpers.
3. Implement dice generation + scoring map.
4. Implement summary generation with all status branches.
5. Reconnect bilingual dictionary and language switch events.

# Kalkulator — Documentation (technical)

## 1. File structure
- `Kalkulator/index.html` — launcher page for subtools.
- `Kalkulator/KalkulatorXP.html` — XP/PD delta calculator.
- `Kalkulator/TworzeniePostaci.html` — full character sheet with validations.
- `Kalkulator/kalkulatorxp.css` — shared visual system.
- `Kalkulator/HowToUse/pl.pdf`, `Kalkulator/HowToUse/en.pdf` — user manuals opened from UI.

## 2. Common UI style
- Green terminal palette with CSS variables.
- Shared button/table/input styling from `kalkulatorxp.css`.
- `TworzeniePostaci.html` extends with local modal and layout rules.

## 3. `index.html` behavior
- Two navigation buttons route to calculator and character sheet.
- Includes secret CTA opening `Koza.gif` overlay.
- Overlay supports close by button, outside click, and `Escape`.

## 4. `KalkulatorXP.html` engine
### Inputs and constraints
- Attributes: min 0, max 12.
- Skills: min 0, max 8.
- Fields clamped in JS before calculations.

### Cost tables
- Attribute and skill costs defined as cumulative lookup maps.
- Row cost = `cost[target] - cost[current]` when target is higher.
- Grand total = sum of all row costs.

### Auxiliary reference section
- `attributeMaximumRows` stores per-species max values.
- Rendered into `#maxAttributesTable`.
- Labels translated with PL/EN dictionaries.

## 5. `TworzeniePostaci.html` engine
- Tracks XP/PD pool and current spend.
- Computes costs from attributes, skills, and extra entries.
- Validates:
  - remaining pool not negative,
  - skill progression rule (“Tree of Learning”).
- Supports language switch with full label refresh.
- Opens PDF manual based on active language.
- Includes modal with species max attributes.

## 6. Data reset rules
- Reset restores default values.
- Special case: `Speed` defaults to `6`; other attributes return to baseline defaults.

## 7. Rebuild checklist
1. Recreate lookup-based XP/PD cost engine.
2. Recreate table scanning + subtotal/total updates.
3. Recreate character-sheet validators and error message slots.
4. Recreate modal reference table and language dictionaries.
5. Reconnect manual button to language-specific PDF files.

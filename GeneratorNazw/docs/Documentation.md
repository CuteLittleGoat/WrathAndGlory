# GeneratorNazw — Documentation (technical)

## 1. Files
- `GeneratorNazw/index.html` — controls (category, option, seed, count, output).
- `GeneratorNazw/script.js` — generator engine and language handling.
- `GeneratorNazw/style.css` — visual styling.

## 2. RNG architecture
`script.js` supports deterministic and non-deterministic modes:
- seeded hashing (`xfnv1a`),
- seeded PRNG (`mulberry32`),
- crypto fallback/random mode (`cryptoRand`).
`makeRng(seedStr)` selects deterministic stream when seed text is provided.

## 3. Name assembly engine
Main helper groups:
- selection (`pick`, `pickWeighted`, `chance`, `rollInt`),
- cleanup (`cleanName`, `cap`),
- phonetic smoothing (`tidySegmentBoundary`, `phoneticPolish`),
- composition (`buildName`, `formatWithTitle`, `formatNamedThing`).

## 4. Domain datasets
The script embeds weighted dictionaries for multiple factions/domains, including (examples):
- HUMAN,
- ASTARTES,
- MECH,
- AELDARI,
- NECRON,
- ORK,
- CHAOS,
- SORORITAS,
- WAR,
- SHIP,
- CODEX.

Each dataset defines syllables, roots, suffixes, and optional titles/classifiers.

## 5. Quality control
`tryGenerate` and `looksGood` perform repeated attempts to avoid malformed strings and reject undesirable combinations.

## 6. UI flow
1. Select category.
2. Populate option dropdown according to category.
3. Generate `count` rows using current RNG.
4. Render as text block in `#res`.
5. Clipboard copy via button handler.

## 7. Rebuild checklist
1. Recreate dictionaries and weighted structures.
2. Recreate deterministic RNG path.
3. Recreate assembly + cleanup helpers.
4. Recreate category/option mapping in UI.
5. Recreate PL/EN labels and copy-to-clipboard behavior.

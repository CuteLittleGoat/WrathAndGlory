# GeneratorNPC — Documentation (technical)

## 1. Purpose
GeneratorNPC is a browser-based builder that composes a printable/readable NPC card from shared game datasets. It consumes `DataVault/data.json` and optionally synchronizes favorites with Firebase.

## 2. Files
- `GeneratorNPC/index.html` — UI structure + inlined application logic.
- `GeneratorNPC/style.css` — styling.
- `GeneratorNPC/config/firebase-config.js` — Firebase bootstrap.
- `GeneratorNPC/config/Firebase-config.md` — Firebase setup notes.

## 3. Data source integration
- Primary source URL is `https://cutelittlegoat.github.io/WrathAndGlory/DataVault/data.json`.
- On load, module parses required sheets and fills all select controls.
- If source is unavailable, UI exposes loading/error text in status blocks.

## 4. UI composition
Major zones:
- top action bar (language, reset, generate),
- core NPC source section (bestiary + notes),
- content sections for weapon/armor/augmentations/equipment/talents/psionics/prayers,
- generated summary tables,
- trait popover with contextual descriptions,
- favorites panel (alias + save/refresh/list).

## 5. Behavior and calculation flow
1. Read selected base entity from bestiary.
2. Merge selected supplementary records from other lists.
3. Render each section table body.
4. Resolve trait tags and optionally display extended descriptions.
5. Persist/retrieve favorite presets using Firebase document layer.

## 6. i18n
- `data-i18n` keys map UI labels for PL/EN.
- Placeholder translations use `data-i18n-placeholder`.
- Language selector updates visible text and status labels at runtime.

## 7. Firebase
- Uses modular Firebase CDN imports (`firebase-app`, `firebase-firestore`).
- Requires valid `window.firebaseConfig` object.
- Persists favorite builds with alias metadata.

## 8. Rebuild checklist
1. Recreate sheet parser for shared `data.json`.
2. Recreate section selectors and generated table bodies.
3. Recreate trait tooltip/popover resolver.
4. Recreate favorites save/load path via Firestore.
5. Recreate language dictionaries and dynamic text replacement.

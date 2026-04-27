# Infoczytnik — Documentation (technical)

## 1. Module scope
Infoczytnik contains:
- selection menu (`index.html`),
- GM control panel (production/test),
- player display screen (production/test),
- Firebase realtime synchronization,
- optional Web Push backend support.

## 2. Critical files
- `Infoczytnik/index.html` — launcher between production and test pages.
- `Infoczytnik/GM_test.html` / `Infoczytnik/Infoczytnik_test.html` — editable/test pair.
- `Infoczytnik/GM.html` / `Infoczytnik/Infoczytnik.html` — production pair.
- `Infoczytnik/config/firebase-config.js` — Firebase credentials.
- `Infoczytnik/config/web-push-config.js` — push endpoint/config.
- `Infoczytnik/assets/data/data.json` + `DataSlate_manifest.xlsx` — content/manifest assets.
- `Infoczytnik/backend/*` — Node backend for push subscription handling.

## 3. Versioning in test files
`GM_test.html` and `Infoczytnik_test.html` contain `INF_VERSION` cache-bust stamp in format `YYYY-MM-DD_HH-mm-ss` (Polish local time requirement in project policy).

## 4. Firebase realtime contract
- Both pages initialize Firestore and use document `dataslate/current`.
- GM writes payload with message, styling, toggles, and metadata (`nonce`).
- Player page listens with `onSnapshot` and redraws immediately.
- `nonce` deduplicates repeated updates.

## 5. GM panel functional areas
- Visual selection: backgrounds, logo, font preset, audio choice.
- Style controls: content color, prefix/suffix color, font sizes.
- Behavior toggles: logo visibility, flicker, fillers, audio.
- Live preview with content/background modes.
- Message actions: send, ping, clear, restore defaults, reroll fillers.
- XLSX update utility writes import diagnostics to log area.

## 6. Player display rendering
- Background image fills viewport.
- Overlay rectangle is calculated from per-background mapping (`CONTENT_RECTS_BY_BACKGROUND_ID`) or default fallback.
- Typography and spacing scale with viewport size.
- Prefix/message/suffix are rendered independently.
- Audio playback triggered for message and ping events (subject to browser autoplay restrictions).

## 7. Backend/push outline
- Node backend stores push subscriptions (see `backend/data/subscriptions.json`).
- Main module push CTA and Infoczytnik config cooperate on same origin.
- Push click opens DataSlate destination page.

## 8. Rebuild checklist
1. Recreate GM + player HTML pairs with shared Firestore schema.
2. Recreate versioned cache-bust logic in test files.
3. Recreate overlay-fit algorithm based on background natural dimensions + mapped rect.
4. Recreate preview/update controls and default-state restoration.
5. Recreate backend subscription endpoints and push payload sender.

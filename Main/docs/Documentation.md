# Main — Documentation (technical)

## 1. Purpose
`Main/index.html` is a static launcher for all WrathAndGlory modules. It has no backend and no build step. It provides:
- module navigation,
- user/admin visibility switch via URL parameter,
- dynamic external link loading for Map and Images,
- push subscription button.

## 2. Files
- `Main/index.html` — full UI, CSS, and JS logic.
- `Main/ZmienneHiperlacza.md` — text source for dynamic hyperlinks (`Mapa: ...`, `Obrazki: ...`).
- `Main/wrath-glory-logo-warhammer.png` — logo.
- `Main/docs/README.md` — end-user guide.
- `Main/docs/Documentation.md` — this technical description.

## 3. Runtime behavior
### 3.1 Admin switch
- JS reads `admin` from query string.
- `admin=1` enables admin mode.
- Nodes marked with `data-admin-only="true"` are removed in user mode.

### 3.2 Context-sensitive links
- Infoczytnik and DataVault links are adjusted based on admin state.
- External links (Map/Images) use `target="_blank"`; application links use same-tab behavior.

### 3.3 Dynamic map/images URL source
- Script loads `Main/ZmienneHiperlacza.md`.
- Parser reads lines and matches keys.
- UI anchors with `data-map-link` and `data-images-link` receive resolved URLs.

### 3.4 Push notifications bootstrap
- `Main/index.html` imports `../Infoczytnik/config/web-push-config.js`.
- The button `#pushBtn` starts subscription flow.
- Manifest and service worker integration are configured on the app root level (`manifest.webmanifest`, `service-worker.js`).

## 4. Styling
- Green terminal palette via CSS custom properties (`--bg`, `--border`, `--text`, etc.).
- Responsive grid for action buttons.
- Separate red CTA styling for push button.
- Consolas/Fira Code/Source Code Pro fallback stack.

## 5. Rebuild checklist (1:1 restore)
1. Recreate `index.html` with:
   - `<main>` panel,
   - module buttons,
   - admin-only wrappers,
   - push CTA button.
2. Add parser logic for `ZmienneHiperlacza.md`.
3. Add query-param admin toggle.
4. Reconnect push config script and permission/subscription flow.
5. Restore exact color variables and spacing values from stylesheet block.

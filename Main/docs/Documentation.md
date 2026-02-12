# Main — Documentation (technical)

## 1. Module goal and scope
The `Main` module is a static entry application for the WrathAndGlory toolset. It does not implement gameplay logic itself; it routes the user to other modules and exposes two UI modes:
- user mode (default),
- admin mode (`?admin=1`).

Source of truth for this module is `Main/index.html` with embedded CSS and JavaScript.

## 2. File structure
- `Main/index.html` — complete page (HTML structure, styles, runtime logic).
- `Main/ZmienneHiperlacza.md` — runtime-configurable links for **Map** and **Images**.
- `Main/wrath-glory-logo-warhammer.png` — logo displayed on the landing page.
- `Main/docs/README.md` — UI user manual (PL/EN).
- `Main/docs/Documentation.md` — this technical specification.

## 3. Rendering and layout architecture

### 3.1 Document shell
`index.html` defines a single-screen landing layout. The body uses full-viewport centering and contains one primary card (`<main>`), which contains:
- logo image,
- responsive action grid,
- action stacks (button + optional note).

### 3.2 Visual system
The stylesheet is embedded in `<style>` and uses CSS custom properties for theme consistency:
- background and panel shades,
- text and border accents,
- glow/shadow behaviors,
- spacing tokens and radius.

The module uses:
- neon-green accent on dark background,
- responsive widths through `clamp(...)`,
- grid auto-fit for action tiles,
- hover/active transforms for button feedback.

### 3.3 Typography and assets
The module relies on system/web-safe font fallbacks defined in CSS (no backend font loading pipeline). Logo is loaded as a local static asset from the `Main` directory.

## 4. UI composition model

### 4.1 Action grid
Buttons are grouped in a grid where each cell is either:
- standalone action button,
- or stacked action (`.stack`) with a note (`.note`).

### 4.2 Visibility model
Visibility is driven by a semantic marker:
- elements with `data-admin-only="true"` are considered admin-only.

At runtime, the script removes these elements from DOM in user mode.

### 4.3 Dynamic links
Several anchors are resolved dynamically:
- `data-infoczytnik-link` — destination differs for user/admin mode,
- `data-datavault-link` — destination differs for user/admin mode,
- `data-map-link` and `data-images-link` — destinations resolved from `ZmienneHiperlacza.md`.

## 5. Runtime logic (JavaScript)

### 5.1 Mode detection
Mode is determined by:
- `new URLSearchParams(window.location.search).get("admin") === "1"`.

Result is stored in a boolean (`isAdmin`) and used by all conditional branches.

### 5.2 DOM pruning for user mode
When `isAdmin` is false:
- every node marked `data-admin-only="true"` is removed from the DOM tree.

This guarantees hidden admin actions are not only visually hidden but structurally absent in user mode.

### 5.3 Link resolution by mode
Script mutates selected anchor `href` values:
- Infoczytnik link switches between user reader and admin menu entry.
- DataVault link switches between standard and admin query variant.

This behavior centralizes entrypoint switching without duplicating HTML blocks.

### 5.4 External config ingestion (`ZmienneHiperlacza.md`)
The script performs a fetch of `Main/ZmienneHiperlacza.md`, then parses plain-text lines.

Expected format per line:
- `Mapa: <URL>`
- `Obrazki: <URL>`

Parser logic:
1. split text into lines,
2. match each line with regex shaped as key + colon + non-space URL,
3. assign URL to matching anchor data targets.

Failure strategy:
- if fetch or parse fails, script logs a warning and leaves fallback `href` values unchanged (`#` in source markup).

## 6. Navigation contract with other modules
Main is a router-like launcher with hardwired external/internal endpoints. Its contract is:
- expose user-safe subset by default,
- expose full toolset for admins,
- keep configurable URLs for Map and Images outside HTML code.

It references sibling modules (DataVault, Infoczytnik, Kalkulator, Audio, generators, DiceRoller) through absolute or relative links.

## 7. Security and browser behavior
- External links intended for new tabs use `target="_blank"` + `rel="noopener noreferrer"`.
- No credential storage, cookie auth, or local persistence in this module.
- No inline eval or dynamic script loading from remote sources.

## 8. Rebuild instructions (1:1 recreation)
To recreate this module exactly:
1. Build a single static `index.html` with:
   - centered card layout,
   - neon-on-dark theme via CSS variables,
   - responsive grid of action buttons,
   - admin notes under selected actions.
2. Add logo file and reference it from page markup.
3. Add data attributes for dynamic anchors and admin-only elements.
4. Implement script with:
   - URL param admin detection,
   - admin-only DOM removal in user mode,
   - per-mode href switching,
   - fetch+parse pipeline for markdown link config.
5. Create `ZmienneHiperlacza.md` with two key-value lines for map/images URLs.

## 9. Operational limitations
- This is a frontend-only static module; behavior depends on reachable target URLs.
- If `ZmienneHiperlacza.md` is unavailable in deployment path, map/images links stay unresolved fallback.
- Admin mode is URL-parameter based and is not an authentication mechanism.

## 10. Maintenance checklist
When changing this module:
1. Update action labels/links in `Main/index.html`.
2. Verify mode switching (`default` vs `?admin=1`).
3. Verify parsing of `ZmienneHiperlacza.md` for both keys.
4. Update `Main/docs/README.md` (UI instructions PL/EN).
5. Update `Main/docs/Documentation.md` (technical behavior).

# Audio — Documentation (technical)

## 1. Purpose
Audio module provides:
- SFX catalog from manifest source,
- admin curation of favorites lists,
- user-facing playback view,
- Firestore synchronization.

## 2. Files
- `Audio/index.html` — complete UI + JS module logic.
- `Audio/config/firebase-config.js` — Firebase project bootstrap object.
- `Audio/config/Firebase-config.md` — configuration instruction.
- `Audio/AudioManifest.xlsx` — source manifest definition.

## 3. Application modes
- Default user mode: simplified playback UI.
- Admin mode (`?admin=1`): manifest reload, tag panel, list curation tools.
- Mode switch toggles visibility of `.admin-only` / `.user-only` sections.

## 4. Data model and persistence
- Manifest entries include at least display name, file name, and source folder link.
- Favorites lists are persisted in Firestore.
- Status pills display current manifest/firebase/favorites state.

## 5. Feature components
- Search field for SFX filtering.
- Hierarchical tag filter with menu search/select-all/clear-all actions.
- Favorites panels:
  - admin list management,
  - main-view projection for end users,
  - user navigation tabs.

## 6. Firebase integration
- Imports Firebase App + Firestore SDK (modular CDN).
- Initializes from `window.firebaseConfig`.
- Reads/writes list documents and view metadata.
- UI updates react to async operation results and error states.

## 7. Rebuild checklist
1. Recreate dual-mode layout with admin/user sections.
2. Recreate manifest loading and normalization pipeline.
3. Recreate tag-based filtering + text search.
4. Recreate favorites CRUD + “main user view” assignment.
5. Recreate Firestore sync and status-pill reporting.
6. Recreate PL/EN dictionaries and switch handling.

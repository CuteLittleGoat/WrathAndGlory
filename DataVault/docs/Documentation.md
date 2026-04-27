# DataVault — Documentation (technical)

## 1. Purpose
DataVault is a client-side data exploration module for canonical Wrath & Glory datasets. It supports bilingual UI, tabular browsing, column filtering, multi-sort, row comparison modal, and admin-side regeneration of `data.json` from XLSX.

## 2. File map
- `DataVault/index.html` — application shell and UI containers.
- `DataVault/style.css` — visual layer.
- `DataVault/app.js` — full state, rendering, i18n, filters, compare, admin features.
- `DataVault/xlsxCanonicalParser.js` — parser for canonical XLSX extraction.
- `DataVault/build_json.py` — helper generation script.
- `DataVault/data.json` — runtime dataset consumed by app.
- `DataVault/Repozytorium.xlsx` — source spreadsheet for admin regeneration.

## 3. Core architecture
- Single-page app without framework.
- DOM refs centralized in `els` object.
- Runtime language dictionary (`translations.pl/en`) drives labels/placeholders/aria/messages.
- Global state tracks current sheet/tab, active filters, selection set, and view mode.

## 4. Data loading flow
1. App attempts to load `data.json`.
2. Parsed payload is normalized into sheet-based structures.
3. Tabs are rendered dynamically from available sheets.
4. Current sheet rows are rendered into HTML table inside `#tableWrap`.

## 5. Filtering/sorting/comparison
- Global filter: single input matching across visible fields.
- Per-column filters: generated second header row.
- Sorting: header click toggles order; Shift enables multi-column sort.
- Comparison: selected rows rendered into `#modal` with field-by-field matrix.

## 6. Admin-only features
- Admin mode detected by query param (`admin=1`).
- `Generate data.json` triggers XLSX load + canonical parse + JSON download/update flow.
- Uses JSZip/XLSX ecosystem when available; exposes status messages for missing libs and parsing errors.

## 7. i18n
- `applyLanguage(lang)` updates:
  - static labels,
  - placeholders,
  - aria labels,
  - button titles,
  - dynamic render fragments.
- Default language is Polish.

## 8. Recreate 1:1 checklist
1. Restore shell layout (`topbar`, `panel`, `workspace`, `tabs`, `tableWrap`).
2. Re-implement dictionary-driven i18n.
3. Recreate table engine with:
   - dynamic columns,
   - global + column filters,
   - sorting,
   - checkbox selection,
   - compare modal.
4. Recreate admin parser path for XLSX → `data.json`.
5. Re-apply status messaging and empty-state UX.

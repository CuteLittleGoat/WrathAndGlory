/* Administratum Data Vault — bez Tabulatora (zero zależności UI).
   Źródło danych: data.json (GitHub Pages) lub aktualizacja z Repozytorium.xlsx (admin).
*/
const els = {
  tabs: document.getElementById("tabs"),
  wrap: document.getElementById("tableWrap"),
  global: document.getElementById("globalSearch"),
  btnUpdateData: document.getElementById("btnUpdateData"),
  updateDataGroup: document.getElementById("updateDataGroup"),
  btnCompare: document.getElementById("btnCompare"),
  btnMainPage: document.getElementById("btnMainPage"),
  btnReset: document.getElementById("btnReset"),
  btnDefaultView: document.getElementById("btnDefaultView"),
  pop: document.getElementById("popover"),
  popTitle: document.getElementById("popoverTitle"),
  popBody: document.getElementById("popoverBody"),
  popClose: document.getElementById("popoverClose"),
  modal: document.getElementById("modal"),
  modalBody: document.getElementById("modalBody"),
  modalClose: document.getElementById("modalClose"),
  filterMenu: document.getElementById("filterMenu"),
  toggleCharacterTabs: document.getElementById("toggleCharacterTabs"),
  toggleCombatTabs: document.getElementById("toggleCombatTabs"),
  languageSelect: document.getElementById("languageSelect"),
};

const translations = {
  pl: {
    labels: {
      pageTitle: "ADMINISTRATUM DATA VAULT",
      updateDataButton: "Generuj data.json",
      updateNoteFull: "Kliknięcie przycisku wygeneruje nowy plik <code>data.json</code>. Plik <code>Repozytorium.xlsx</code> musi istnieć w module DataVault obok <code>index.html</code>, a wygenerowany <code>data.json</code> trzeba tam wgrać, aby zaktualizować dane w aplikacji.",
      mainPageButton: "Strona Główna",
      fullViewButton: "Pełen Widok",
      defaultViewButton: "Widok Domyślny",
      viewButtonsNote: "Część danych jest domyślnie ukryta.",
      compareButton: "Porównaj zaznaczone",
      filtersTitle: "FILTRY",
      globalSearchLabel: "Szukaj (globalnie)",
      toggleCharacterTabs: "Czy wyświetlić zakładki dotyczące tworzenia postaci?",
      toggleCombatTabs: "Czy wyświetlić zakładki dotyczące zasad walki?",
      hintSort: "▸ Kliknij nagłówek, aby sortować (Shift = sort wielokolumnowy).",
      hintFilters: "▸ Drugi wiersz nagłówka: filtry per kolumna (fragment / liczby).",
      hintCompare: "▸ Zaznacz 2+ wiersze, aby porównać.",
      hintTooltip: "Jeśli tooltipy cech nie wyskakują na telefonie: stuknij w tag cechy.",
      emptyTitle: "Brak danych",
      emptyText: "Brak danych do wyświetlenia. W trybie admina użyj <b>Generuj data.json</b>.",
      resultsEmptyTitle: "BRAK WYNIKÓW",
      resultsEmptyText: "Zmień filtry lub wyczyść widok.",
      comparisonTitle: "Porównanie",
      comparisonField: "Pole",
      comparisonRecord: "Rekord",
    },
    placeholders: {
      globalSearch: "np. Pist, Brutalna, IMPERIUM, Zatrucie (5)...",
      columnFilter: "filtr...",
      filterSearch: "Szukaj na liście…",
    },
    titles: {
      fullView: "Pokaż pełny widok danych (bez ukryć domyślnych)",
      defaultView: "Przywróć domyślny widok danych (z ukryciami)",
    },
    aria: {
      close: "Zamknij",
      languageSelect: "Wersja językowa",
    },
    messages: {
      filterTitle: "FILTR",
      selectAll: "Zaznacz wszystko",
      clearAll: "Wyczyść",
      filterButtonTitle: "Filtr listy",
      collapse: "Kliknij aby zwinąć",
      expand: "Kliknij aby rozwinąć",
      statusLoadJson: "Ładowanie data.json...",
      statusLoadOk: "OK — załadowano data.json",
      statusLoadError: "Błąd ładowania data.json",
      statusXlsxError: "Błąd ładowania XLSX",
      statusRepoDownload: "Pobieranie Repozytorium.xlsx...",
      statusRepoUpdated: "OK — zaktualizowano dane i wygenerowano data.json",
      statusRepoError: "Błąd aktualizacji danych",
      statusCanonicalStart: "Generowanie data.json kanonicznym parserem XLSX (styles.xml/sharedStrings.xml)...",
      statusCanonicalUnavailable: "Brak biblioteki parsera kanonicznego (JSZip/xlsxCanonicalParser). Sprawdź połączenie z CDN.",
      modeAdmin: "ADMIN",
      modePlayer: "GRACZ",
      invocationLabel: "CECHA: WYWOŁANIE",
      stateLabel: "STAN",
      invocationTitle: "Wywołanie",
      traitLabel: "CECHA",
      noDescriptionLabel: "BRAK OPISU",
      traitNotFound: "Nie znaleziono tej cechy w zakładce Cechy.",
      stateNotFound: "Nie znaleziono tego stanu w zakładce Stany.",
    },
  },
  en: {
    labels: {
      pageTitle: "ADMINISTRATUM DATA VAULT",
      updateDataButton: "Generate data.json",
      updateNoteFull: "Clicking the button generates a new <code>data.json</code> file. <code>Repozytorium.xlsx</code> must exist in the DataVault module next to <code>index.html</code>, and the generated <code>data.json</code> must be uploaded there to update app data.",
      mainPageButton: "Main Page",
      fullViewButton: "Full View",
      defaultViewButton: "Default View",
      viewButtonsNote: "Some data is hidden by default.",
      compareButton: "Compare selected",
      filtersTitle: "FILTERS",
      globalSearchLabel: "Search (global)",
      toggleCharacterTabs: "Show tabs related to character creation?",
      toggleCombatTabs: "Show tabs related to combat rules?",
      hintSort: "▸ Click a header to sort (Shift = multi-column sort).",
      hintFilters: "▸ Second header row: filters per column (fragment / numbers).",
      hintCompare: "▸ Select 2+ rows to compare.",
      hintTooltip: "If trait tooltips do not appear on mobile: tap a trait tag.",
      emptyTitle: "No data",
      emptyText: "No data to display. In admin mode use <b>Generate data.json</b>.",
      resultsEmptyTitle: "NO RESULTS",
      resultsEmptyText: "Adjust filters or clear the view.",
      comparisonTitle: "Comparison",
      comparisonField: "Field",
      comparisonRecord: "Record",
    },
    placeholders: {
      globalSearch: "e.g. Pist, Brutal, IMPERIUM, Poison (5)...",
      columnFilter: "filter...",
      filterSearch: "Search the list…",
    },
    titles: {
      fullView: "Show the full data view (without default hiding)",
      defaultView: "Restore the default data view (with hidden values)",
    },
    aria: {
      close: "Close",
      languageSelect: "Language version",
    },
    messages: {
      filterTitle: "FILTER",
      selectAll: "Select all",
      clearAll: "Clear",
      filterButtonTitle: "Filter list",
      collapse: "Click to collapse",
      expand: "Click to expand",
      statusLoadJson: "Loading data.json...",
      statusLoadOk: "OK — data.json loaded",
      statusLoadError: "Error loading data.json",
      statusXlsxError: "Error loading XLSX",
      statusRepoDownload: "Downloading Repozytorium.xlsx...",
      statusRepoUpdated: "OK — data updated and data.json generated",
      statusRepoError: "Error updating data",
      statusCanonicalStart: "Generating data.json using canonical XLSX parser (styles.xml/sharedStrings.xml)...",
      statusCanonicalUnavailable: "Canonical parser library unavailable (JSZip/xlsxCanonicalParser). Check CDN connectivity.",
      modeAdmin: "ADMIN",
      modePlayer: "PLAYER",
      invocationLabel: "TRAIT: INVOCATION",
      stateLabel: "STATE",
      invocationTitle: "Invocation",
      traitLabel: "TRAIT",
      noDescriptionLabel: "NO DESCRIPTION",
      traitNotFound: "Trait not found in the Traits sheet.",
      stateNotFound: "State not found in the States sheet.",
    },
  },
};

let currentLanguage = "pl";

const applyLanguage = (lang) => {
  currentLanguage = lang;
  const t = translations[lang];
  document.documentElement.lang = lang;
  if (els.languageSelect) {
    els.languageSelect.value = lang;
    els.languageSelect.setAttribute("aria-label", t.aria.languageSelect);
  }
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key in t.labels) {
      if (key === "emptyText" || key === "updateNoteFull") {
        el.innerHTML = t.labels[key];
      } else {
        el.textContent = t.labels[key];
      }
    }
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (key === "fullViewTitle") el.setAttribute("title", t.titles.fullView);
    if (key === "defaultViewTitle") el.setAttribute("title", t.titles.defaultView);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (key in t.aria) {
      el.setAttribute("aria-label", t.aria[key]);
    }
  });
  if (els.global) {
    els.global.placeholder = t.placeholders.globalSearch;
  }
  document.querySelectorAll(".tableFilters .input").forEach((input) => {
    input.placeholder = t.placeholders.columnFilter;
  });
  document.querySelectorAll(".filterBtn").forEach((button) => {
    button.title = t.messages.filterButtonTitle;
  });
  if (tbodyEl && currentSheet) {
    renderBody();
  }
};

const KEYWORD_SHEETS_COMMA_NEUTRAL = new Set(["Bestiariusz", "Archetypy", "Psionika", "Augumentacje", "Ekwipunek", "Pancerze", "Bronie"]);
const KEYWORD_SHEET_ALL_RED = "Słowa Kluczowe";
const ADMIN_ONLY_SHEETS = new Set(["Bestiariusz", "Trafienia Krytyczne", "Groza Osnowy", "Hordy", "Specjalne Bonusy Wrogów"]);
const CHARACTER_CREATION_SHEETS = new Set([
  "Tabela Rozmiarów",
  "Gatunki",
  "Archetypy",
  "Premie Frakcji",
  "Słowa Kluczowe Frakcji",
  "Specjalne Bonusy Frakcji",
  "Implanty Astartes",
  "Zakony Pierwszego Powołania",
]);
const COMBAT_RULES_SHEETS = new Set(["Trafienia Krytyczne", "Groza Osnowy", "Skrót Zasad", "Tryby Ognia"]);
const CHARACTER_CREATION_SHEET_KEYS = new Set([...CHARACTER_CREATION_SHEETS].map(name => canonKey(name)));
const COMBAT_RULES_SHEET_KEYS = new Set([...COMBAT_RULES_SHEETS].map(name => canonKey(name)));

let DB = null;          // {sheets: {name:{rows, cols}}, _meta:{traits, states, traitIndex, stateIndex}}
let currentSheet = null;

const SESSION_VIEW_KEY = "datavault_session_view_v2";
const DEFAULT_VIEW_CONFIG = {
  "Archetypy": { "Frakcja": ["Adepta Sororitas", "Adeptus Astartes", "Adeptus Astra Telepathica", "Adeptus Mechanicus", "Adeptus Ministorum", "Astra Militarum", "Dynastie Wolnych Kupców", "Inkwizycja", "Szumowiny"] },
  "Premie Frakcji": { "Frakcja": ["Adepta Sororitas", "Adeptus Astartes", "Adeptus Astra Telepathica", "Adeptus Mechanicus", "Adeptus Ministorum", "Astra Militarum", "Chaos", "Dynastie Wolnych Kupców", "Inkwizycja", "Ogryn", "Szczurak", "Szumowiny"] },
  "Psionika": { "Typ": ["Uniwersalne Zdolności Psioniczne", "Pomniejsze Moce Psioniczne", "Uniwersalna Dyscyplina Psioniczna", "Dyscyplina Biomancji", "Dyscyplina Dywinacji", "Dyscyplina Piromancji", "Dyscyplina Telekinezy", "Dyscyplina Telepatii"] },
  "Augumentacje": { "Typ": ["Ulepszenia", "Wszczepy", "Mechadendryt"] },
  "Ekwipunek": { "Typ": ["Ulepszenia Broni", "Amunicja", "Ekwipunek Imperium"] },
  "Pancerze": { "Typ": ["Zwykłe", "Wspomagane", "Energetyczne", "Astartes", "Auxilla"] },
  "Bronie": { "Typ": ["Adeptus Mechanicus", "Boltowa", "Broń biała", "Broń biała Adeptus Mechanicus", "Broń biała Ogrynów", "Broń dystansowa", "Broń dystansowa Adeptus Mechnicus", "Broń dystansowa Milczących Sióstr", "Broń dystansowa Militarum Auxilla", "Broń energetyczna", "Broń łańcuchowa", "Broń łańcuchowa Astartes", "Broń psioniczna", "Egzotyczna broń biała", "Granaty i Wyrzutnie", "Imperialna broń biała", "Laserowa", "Ogniowa", "Palna", "Plazmowa", "Termiczna"] },
};

const uiState = {
  showCharacterTabs: false,
  showCombatTabs: false
};
const viewBySheet = {};
let view = createSheetViewState();

const RENDER_CHUNK_SIZE = 80; // liczba wierszy renderowanych w jednym kroku (progressive rendering)

const ADMIN_MODE = new URLSearchParams(location.search).get("admin") === "1";
if (els.btnMainPage) {
  els.btnMainPage.addEventListener("click", () => {
    window.location.href = "../Main/index.html";
  });
  if (ADMIN_MODE) {
    els.btnMainPage.style.display = "none";
  }
}
const HIDDEN_COLUMNS = new Set(["lp"]);

/* ---------- Utilities ---------- */
function norm(s){
  return String(s ?? "").replace(/\s+/g, " ").trim().replace(" :", ":").replace(": ",": ");
}

function isHiddenColumn(name){
  return HIDDEN_COLUMNS.has(String(name ?? "").trim().toLowerCase());
}

function resolveLpKey(rows){
  for (const row of rows || []){
    for (const key of Object.keys(row || {})){
      if (isHiddenColumn(key)){
        return key;
      }
    }
  }
  return null;
}

function deriveColumnOrderFromHeader(header){
  const order = [];
  let hasRange = false;
  let hasTraits = false;
  for (const raw of header || []){
    const col = norm(raw);
    if (!col) continue;
    if (isHiddenColumn(col)) continue;
    if (/^Zasi[eę]g\s*\d+$/i.test(col)){
      if (!hasRange){
        order.push("Zasięg");
        hasRange = true;
      }
      continue;
    }
    if (/^Cecha\s*\d+$/i.test(col)){
      if (!hasTraits){
        order.push("Cechy");
        hasTraits = true;
      }
      continue;
    }
    order.push(col);
  }
  return order;
}

function getSheetOrder(available){
  const metaOrder = DB?._meta?.sheetOrder;
  const base = Array.isArray(metaOrder) ? metaOrder : available;
  const inOrder = base.filter(name => available.includes(name));
  const rest = available.filter(name => !inOrder.includes(name));
  return inOrder.concat(rest);
}

function getColumnOrder(rows, sheetName){
  const set = new Set();
  for (const r of rows){
    for (const k of Object.keys(r)){
      if (k === "__id" || k.startsWith("__")) continue;
      if (isHiddenColumn(k)) continue;
      set.add(k);
    }
  }
  const metaOrder = DB?._meta?.columnOrder?.[sheetName];
  const baseOrder = Array.isArray(metaOrder)
    ? metaOrder
    : (rows[0] ? Object.keys(rows[0]).filter(k => k !== "__id" && !k.startsWith("__")) : []);
  const cols = [];
  for (const col of baseOrder){
    if (isHiddenColumn(col)) continue;
    if (set.has(col)){
      cols.push(col);
      set.delete(col);
    }
  }
  const rest = [...set].sort((a,b)=>a.localeCompare(b,"pl",{numeric:true,sensitivity:"base"}));
  return cols.concat(rest);
}

function getDefaultSort(sheet){
  const lpKey = resolveLpKey(DB?.sheets?.[sheet]);
  if (lpKey){
    return {col: lpKey, dir: "asc"};
  }
  if (sheet === "Archetypy"){
    return {col: "Poziom", dir: "asc", secondary: {col: "Frakcja", dir: "asc"}};
  }
  return null;
}
function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));
}
function stripMarkers(s){
  return String(s ?? "").replace(/{{\/?(?:RED|B|I)}}/g, "");
}
function setStatus(msg){ console.info(msg); }
function logLine(msg, isErr=false){
  const fn = isErr ? console.error : console.info;
  fn(msg);
}

/* Canonical key: ignore case, collapse spaces, and remove space before parentheses. */
function canonKey(s){
  return norm(s).toLowerCase().replace(/\s+\(/g,"(");
}

function isCharacterCreationSheet(name){
  return CHARACTER_CREATION_SHEET_KEYS.has(canonKey(name));
}

function isCombatRulesSheet(name){
  return COMBAT_RULES_SHEET_KEYS.has(canonKey(name));
}

function createSheetViewState(sheetName = null){
  return {
    sort: sheetName ? getDefaultSort(sheetName) : null,
    global: "",
    filtersText: {},
    filtersSet: {},
    selected: new Set(),
    expandedCells: new Set(),
  };
}

function uniqueValuesForColumnFromRows(rows, col){
  return [...new Set(rows.map(r => String(r[col] ?? "").trim() || "-"))]
    .sort((a,b)=>a.localeCompare(b,"pl",{numeric:true,sensitivity:"base"}));
}

function getDefaultConfigForSheet(sheetName){
  const sheetConfig = Object.entries(DEFAULT_VIEW_CONFIG).find(([sheet]) => canonKey(sheet) === canonKey(sheetName))?.[1];
  if (!sheetConfig) return null;
  return Object.fromEntries(
    Object.entries(sheetConfig).map(([col, values]) => [canonKey(col), values.map(v => String(v ?? "").trim() || "-")])
  );
}

function setCurrentSheetView(state){
  view = {
    sort: state.sort ? {...state.sort} : null,
    global: state.global || "",
    filtersText: {...(state.filtersText || {})},
    filtersSet: Object.fromEntries(
      Object.entries(state.filtersSet || {}).map(([col, set]) => [col, set instanceof Set ? new Set(set) : null])
    ),
    selected: state.selected instanceof Set ? new Set(state.selected) : new Set(),
    expandedCells: state.expandedCells instanceof Set ? new Set(state.expandedCells) : new Set(),
  };
}

function persistCurrentSheetView(){
  if (!currentSheet) return;
  viewBySheet[currentSheet] = {
    sort: view.sort ? {...view.sort} : null,
    global: view.global || "",
    filtersText: {...view.filtersText},
    filtersSet: Object.fromEntries(Object.entries(view.filtersSet).map(([col, set]) => [col, set instanceof Set ? [...set] : null])),
    selected: [...view.selected],
    expandedCells: [...view.expandedCells],
  };
}

function restoreSheetView(sheetName){
  const stored = viewBySheet[sheetName];
  if (!stored){
    const base = createSheetViewState(sheetName);
    viewBySheet[sheetName] = {
      ...base,
      filtersSet: {},
      selected: [],
      expandedCells: [],
    };
    setCurrentSheetView(base);
    return;
  }
  setCurrentSheetView({
    sort: stored.sort,
    global: stored.global,
    filtersText: stored.filtersText,
    filtersSet: Object.fromEntries(Object.entries(stored.filtersSet || {}).map(([col, set]) => [col, Array.isArray(set) ? new Set(set) : null])),
    selected: new Set(stored.selected || []),
    expandedCells: new Set(stored.expandedCells || []),
  });
}

function applyDefaultViewForSheet(sheetName){
  const rows = DB?.sheets?.[sheetName] || [];
  const cols = inferColumns(rows, sheetName);
  const config = getDefaultConfigForSheet(sheetName);
  const next = createSheetViewState(sheetName);
  next.sort = getDefaultSort(sheetName);
  for (const col of cols){
    const allVals = uniqueValuesForColumnFromRows(rows, col);
    const cfg = config?.[canonKey(col)];
    if (!cfg) continue;
    const allowed = allVals.filter(v => cfg.includes(v));
    if (allowed.length === allVals.length){
      next.filtersSet[col] = null;
    } else {
      next.filtersSet[col] = new Set(allowed);
    }
  }
  viewBySheet[sheetName] = {
    sort: next.sort,
    global: "",
    filtersText: {},
    filtersSet: Object.fromEntries(Object.entries(next.filtersSet).map(([col, set]) => [col, set instanceof Set ? [...set] : null])),
    selected: [],
    expandedCells: [],
  };
}

function applyFullViewForSheet(sheetName){
  const next = createSheetViewState(sheetName);
  next.sort = null;
  viewBySheet[sheetName] = {
    sort: next.sort,
    global: "",
    filtersText: {},
    filtersSet: {},
    selected: [],
    expandedCells: [],
  };
}

function saveSessionState(){
  if (!DB) return;
  persistCurrentSheetView();
  const payload = {
    sheetViews: viewBySheet,
    toggles: {...uiState},
    language: currentLanguage,
  };
  sessionStorage.setItem(SESSION_VIEW_KEY, JSON.stringify(payload));
}

function loadSessionState(){
  try{
    const raw = sessionStorage.getItem(SESSION_VIEW_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return false;
    for (const [sheetName, state] of Object.entries(parsed.sheetViews || {})){
      if (!DB?.sheets?.[sheetName]) continue;
      const rows = DB.sheets[sheetName] || [];
      const cols = inferColumns(rows, sheetName);
      const next = createSheetViewState(sheetName);
      if (state && typeof state === "object"){
        if (state.sort?.col && cols.includes(state.sort.col)){
          next.sort = {
            col: state.sort.col,
            dir: state.sort.dir === "desc" ? "desc" : "asc",
            secondary: state.sort.secondary?.col && cols.includes(state.sort.secondary.col)
              ? {
                  col: state.sort.secondary.col,
                  dir: state.sort.secondary.dir === "desc" ? "desc" : "asc",
                }
              : null,
          };
        }
        next.global = String(state.global || "");
        for (const [col, txt] of Object.entries(state.filtersText || {})){
          if (!cols.includes(col)) continue;
          next.filtersText[col] = String(txt || "");
        }
        for (const [col, rawSet] of Object.entries(state.filtersSet || {})){
          if (!cols.includes(col)) continue;
          if (rawSet === null){
            next.filtersSet[col] = null;
            continue;
          }
          if (!Array.isArray(rawSet)) continue;
          const allowed = new Set(uniqueValuesForColumnFromRows(rows, col));
          const selected = rawSet.map(v => String(v || "")).filter(v => allowed.has(v));
          if (selected.length === allowed.size){
            next.filtersSet[col] = null;
          } else {
            next.filtersSet[col] = new Set(selected);
          }
        }
      }
      viewBySheet[sheetName] = {
        sort: next.sort,
        global: next.global,
        filtersText: next.filtersText,
        filtersSet: Object.fromEntries(Object.entries(next.filtersSet).map(([col, set]) => [col, set instanceof Set ? [...set] : null])),
        selected: [],
        expandedCells: [],
      };
    }
    if (parsed.toggles){
      uiState.showCharacterTabs = Boolean(parsed.toggles.showCharacterTabs);
      uiState.showCombatTabs = Boolean(parsed.toggles.showCombatTabs);
    }
    if (parsed.language && translations[parsed.language]){
      applyLanguage(parsed.language);
    }
    return true;
  }catch{
    return false;
  }
}

function applyViewModeToAllSheets(mode){
  for (const sheetName of Object.keys(DB?.sheets || {})){
    if (mode === "default") applyDefaultViewForSheet(sheetName);
    if (mode === "full") applyFullViewForSheet(sheetName);
  }
  restoreSheetView(currentSheet);
  if (els.global) els.global.value = view.global || "";
  updateSortMarks();
  renderBody();
  saveSessionState();
}

/* ---------- Rich text formatting ---------- */
/* Highlights:
 - references in parentheses containing "str.", "str", or "strona"
 - lines beginning with "*[cyfra]" (rendered jaśniejszym fontem, gwiazdka jest widoczna)
 - keeps newlines
*/
function formatInlineHTML(raw){
  const s = String(raw ?? "");
  const reRefParen = /\(([^)]*(?:\bstr\.?\b|\bstr\b|\bstrona\b)[^)]*)\)/ig;
  const segments = parseInlineSegments(s);

  // Build global positions to allow refs to span across style segments
  const positions = [];
  let combined = "";
  for (const seg of segments){
    const start = combined.length;
    combined += seg.text;
    positions.push({seg, start, end: combined.length});
  }

  const refs = [];
  reRefParen.lastIndex = 0;
  while ((m = reRefParen.exec(combined))){
    refs.push({start: m.index, end: m.index + m[0].length});
  }

  const renderSegment = ({text, styles}, start, end) => {
    const overlaps = refs.filter(r => r.start < end && r.end > start);
    if (!overlaps.length){
      const classes = [];
      if (styles?.has("RED")) classes.push("inline-red");
      if (styles?.has("B")) classes.push("inline-bold");
      if (styles?.has("I")) classes.push("inline-italic");
      const inner = escapeHtml(text);
      return classes.length ? `<span class="${classes.join(" ")}">${inner}</span>` : inner;
    }

    let cursor = 0;
    const tokens = [];
    for (const ref of overlaps){
      const localStart = Math.max(0, ref.start - start);
      const localEnd = Math.min(text.length, ref.end - start);
      if (localStart > cursor){
        tokens.push({kind:"text", value:text.slice(cursor, localStart)});
      }
      if (localEnd > localStart){
        tokens.push({kind:"ref", value:text.slice(localStart, localEnd)});
      }
      cursor = Math.max(cursor, localEnd);
    }
    if (cursor < text.length){
      tokens.push({kind:"text", value:text.slice(cursor)});
    }

    const styleClasses = [];
    if (styles?.has("RED")) styleClasses.push("inline-red");
    if (styles?.has("B")) styleClasses.push("inline-bold");
    if (styles?.has("I")) styleClasses.push("inline-italic");

    return tokens.map(t => {
      const classes = [...styleClasses];
      if (t.kind === "ref") classes.push("ref");
      const inner = escapeHtml(t.value);
      return classes.length ? `<span class="${classes.join(" ")}">${inner}</span>` : inner;
    }).join("");
  };

  return positions.map(p => renderSegment(p.seg, p.start, p.end)).join("");
}

function formatTextHTML(raw, opts = {}){
  const {maxLines = null, appendHint = null} = opts;
  const s = String(raw ?? "");
  const lines = s.split(/\r?\n/);
  const picked = Number.isInteger(maxLines) ? lines.slice(0, maxLines) : lines;
  const htmlLines = picked.map(line => {
    const m = line.match(/^\*\s*\[(\d+)\]\s*(.*)$/);
    const highlight = Boolean(m);
    const text = highlight ? `*[${m[1]}] ${m[2]}` : line;
    const inner = formatInlineHTML(text);
    return highlight ? `<span class="caretref">${inner}</span>` : inner;
  });
  if (appendHint) htmlLines.push(`<span class="clampHint">${escapeHtml(appendHint)}</span>`);
  return htmlLines.join("<br>");
}

function parseInlineSegments(raw){
  const markerRegex = /{{\/?(?:RED|B|I)}}/g;
  const segments = [];
  const stack = [];
  let cursor = 0;
  let m;

  while ((m = markerRegex.exec(raw))){
    if (m.index > cursor){
      segments.push({text: raw.slice(cursor, m.index), styles: new Set(stack)});
    }
    const token = m[0];
    const isClose = token.startsWith("{{/");
    const name = token.includes("RED") ? "RED" : token.includes("B") ? "B" : "I";
    if (isClose){
      const idx = stack.lastIndexOf(name);
      if (idx !== -1) stack.splice(idx, 1);
    } else {
      stack.push(name);
    }
    cursor = markerRegex.lastIndex;
  }
  if (cursor < raw.length){
    segments.push({text: raw.slice(cursor), styles: new Set(stack)});
  }

  return segments;
}

function formatFactionKeywordHTML(raw, opts = {}){
  const {maxLines = null, appendHint = null} = opts;
  const s = String(raw ?? "");
  const lines = s.split(/\r?\n/);
  const picked = Number.isInteger(maxLines) ? lines.slice(0, maxLines) : lines;

  const htmlLines = picked.map(line => {
    if (!line) return "";
    const re = /(\[ŚWIAT-KUŹNIA\])|\b(lub)\b|-/gi;
    let out = "";
    const segments = parseInlineSegments(line);

    const renderPiece = (text, styles, isRed) => {
      if (!text) return "";
      const classes = [];
      if (isRed) classes.push("keyword-red");
      if (styles?.has("B")) classes.push("inline-bold");
      if (styles?.has("I")) classes.push("inline-italic");
      const inner = escapeHtml(text);
      return classes.length ? `<span class="${classes.join(" ")}">${inner}</span>` : inner;
    };

    for (const seg of segments){
      re.lastIndex = 0;
      let lastIndex = 0;
      let m;
      while ((m = re.exec(seg.text))){
        const before = seg.text.slice(lastIndex, m.index);
        if (before){
          out += renderPiece(before, seg.styles, true);
        }
        const match = m[0];
        const isSpecial = Boolean(m[1]);
        const isRed = isSpecial;
        out += renderPiece(match, seg.styles, isRed);
        lastIndex = m.index + match.length;
      }
      const rest = seg.text.slice(lastIndex);
      if (rest){
        out += renderPiece(rest, seg.styles, true);
      }
    }

    return out;
  });

  if (appendHint) htmlLines.push(`<span class="clampHint">${escapeHtml(appendHint)}</span>`);
  return htmlLines.join("<br>");
}

function formatRangeHTML(raw){
  const s = String(raw ?? "");
  if (!s) return "";
  const parts = s.split("/");
  if (parts.length === 1) return escapeHtml(s);
  return parts.map((p, idx) => {
    const seg = escapeHtml(p);
    if (idx === 0) return seg;
    return `<span class="slash">/</span>${seg}`;
  }).join("");
}

function formatKeywordHTML(row, col, opts = {}){
  const {commasNeutral = false, maxLines = null, appendHint = null} = opts;
  if (!row.__fmt) row.__fmt = {};
  const variant = `${commasNeutral ? "commas" : "all"}|${maxLines ?? "full"}|${appendHint ?? ""}`;
  const key = `${col}::kw::${variant}`;
  if (row.__fmt[key]) return row.__fmt[key];

  const base = formatTextHTML(row[col], {maxLines, appendHint});
  const body = commasNeutral ? base.replace(/,/g, '<span class="keyword-comma">,</span>') : base;
  const html = `<span class="keyword-red">${body}</span>`;
  row.__fmt[key] = html;
  return html;
}

function formatDataCellHTML(row, col, sheetName = currentSheet){
  const isKeywordName = sheetName === KEYWORD_SHEET_ALL_RED && col === "Nazwa";
  const isKeywordCommaNeutral = KEYWORD_SHEETS_COMMA_NEUTRAL.has(sheetName) && col === "Słowa Kluczowe";
  const isFactionKeyword = sheetName === "Słowa Kluczowe Frakcji" && col === "Słowo Kluczowe";

  if (isKeywordName){
    return formatKeywordHTML(row, col);
  }
  if (isFactionKeyword){
    return formatFactionKeywordHTML(row[col]);
  }
  if (isKeywordCommaNeutral){
    return formatKeywordHTML(row, col, {commasNeutral:true});
  }
  return getFormattedCellHTML(row, col);
}

function getFormattedCellHTML(row, col){
  if (!row.__fmt) row.__fmt = {};
  if (row.__fmt[col]) return row.__fmt[col];
  let html = "";
  if (col === "Zasięg") html = formatRangeHTML(row[col]);
  else html = formatTextHTML(row[col]);
  row.__fmt[col] = html;
  return html;
}

/* ---------- Data transform ---------- */
function mergeTraits(row){
  // merges Cecha 1..N => Cechy
  const keys = Object.keys(row).filter(k => /^Cecha\s*\d+$/i.test(k));
  if (!keys.length) return row;
  keys.sort((a,b)=>Number(a.split(" ")[1])-Number(b.split(" ")[1]));
  const traits = keys.map(k => norm(row[k])).filter(v => v && v !== "-");
  const out = {...row};
  for (const k of keys) delete out[k];
  out["Cechy"] = traits.length ? traits.join("; ") : "-";
  return out;
}

function mergeRange(row){
  // merges Zasięg 1..3 => Zasięg
  const k1 = Object.keys(row).find(k => /^Zasi[eę]g\s*1$/i.test(k));
  const k2 = Object.keys(row).find(k => /^Zasi[eę]g\s*2$/i.test(k));
  const k3 = Object.keys(row).find(k => /^Zasi[eę]g\s*3$/i.test(k));
  if (!k1 && !k2 && !k3) return row;
  const v1 = k1 ? norm(row[k1]) : "-";
  const v2 = k2 ? norm(row[k2]) : "-";
  const v3 = k3 ? norm(row[k3]) : "-";
  const out = {...row};
  if (k1) delete out[k1];
  if (k2) delete out[k2];
  if (k3) delete out[k3];
  out["Zasięg"] = `${v1 || "-"} / ${v2 || "-"} / ${v3 || "-"}`;
  return out;
}

function transformSheet(name, rows){
  let out = rows.map(stripPrivateFields);
  if (name === "Bronie"){
    out = out.map(r => mergeRange(mergeTraits(r)));
  }
  if (name === "Pancerze"){
    out = out.map(r => mergeTraits(r));
  }
  return out.map((r, idx) => ({__id: r.__id ?? `${name}:${idx+1}`, ...r}));
}

function stripPrivateFields(row){
  const clean = {};
  for (const [k,v] of Object.entries(row || {})){
    if (k === "__id") { clean.__id = v; continue; }
    if (k.startsWith("__")) continue;
    clean[k] = v;
  }
  return clean;
}

function inferColumns(rows, sheetName){
  return getColumnOrder(rows, sheetName);
}

/* ---------- Loading ---------- */
async function loadJsonFromRepo(){
  try{
    setStatus(translations[currentLanguage].messages.statusLoadJson);
    const res = await fetch("data.json", {cache:"no-store"});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    DB = normaliseDB(data);
    const restored = loadSessionState();
    if (!restored){
      for (const sheetName of Object.keys(DB.sheets || {})){
        applyDefaultViewForSheet(sheetName);
      }
    }
    initUI();
    saveSessionState();
    setStatus(translations[currentLanguage].messages.statusLoadOk);
  }catch(e){
    setStatus(translations[currentLanguage].messages.statusLoadError);
    logLine("BŁĄD: "+e.message, true);
  }
}

function buildDataJsonFromSheets(rawSheets, opts = {}){
  const {sheetOrder = null, columnOrder = null} = opts;
  const sheets = {};
  const traits = {};
  const states = {};

  for (const [name, rows] of Object.entries(rawSheets)){
    if (name === "Cechy"){
      for (const row of rows){
        const traitName = norm(row?.Nazwa);
        const desc = String(row?.Opis ?? "").trim();
        if (traitName && desc){
          traits[traitName] = desc;
        }
      }
    }
    if (name === "Stany"){
      for (const row of rows){
        const stateName = norm(row?.Nazwa);
        const desc = String(row?.Opis ?? row?.Efekt ?? "").trim();
        if (stateName && desc){
          states[stateName] = desc;
        }
      }
    }

    let processed = rows.map(r => ({...r}));
    if (name === "Bronie"){
      processed = processed.map(r => mergeRange(mergeTraits(r)));
    } else if (name === "Pancerze"){
      processed = processed.map(r => mergeTraits(r));
    }
    sheets[name] = processed;
  }

  const resolvedSheetOrder = Array.isArray(sheetOrder) ? sheetOrder : Object.keys(rawSheets);
  const resolvedColumnOrder = columnOrder && typeof columnOrder === "object" ? columnOrder : {};
  return {sheets, _meta:{traits, states, sheetOrder: resolvedSheetOrder, columnOrder: resolvedColumnOrder}};
}

function ensureSheetJS(cb){
  if (window.XLSX) return cb();
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
  s.onload = cb;
  s.onerror = () => {
    setStatus(translations[currentLanguage].messages.statusXlsxError);
    logLine("BŁĄD: nie udało się załadować biblioteki XLSX (CDN).", true);
  };
  document.head.appendChild(s);
}

function downloadDataJson(data){
  const jsonText = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonText], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "data.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function isRedColorValue(colorValue){
  const value = String(colorValue || "").replace(/\s+/g, "").toLowerCase();
  if (!value) return false;
  return value === "red"
    || value === "#f00"
    || value === "#ff0000"
    || value === "#ffff0000"
    || value === "rgb(255,0,0)"
    || value === "rgba(255,0,0,1)";
}

function htmlToStyleMarkers(html){
  if (!html || !String(html).trim()) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return "";

  const chunks = [];
  const walk = (node, state) => {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE){
      const text = node.textContent ?? "";
      if (!text) return;
      let marked = text;
      if (state.red) marked = `{{RED}}${marked}{{/RED}}`;
      if (state.bold) marked = `{{B}}${marked}{{/B}}`;
      if (state.italic) marked = `{{I}}${marked}{{/I}}`;
      chunks.push(marked);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const tag = node.tagName.toLowerCase();
    const styleAttr = node.getAttribute("style") || "";
    const inlineColor = styleAttr.match(/color\s*:\s*([^;]+)/i)?.[1] || "";
    const nextState = {
      bold: state.bold || tag === "b" || tag === "strong",
      italic: state.italic || tag === "i" || tag === "em",
      red: state.red || isRedColorValue(inlineColor),
    };

    if (tag === "br"){
      chunks.push("\n");
      return;
    }
    for (const child of node.childNodes){
      walk(child, nextState);
    }
  };

  walk(root, {bold: false, italic: false, red: false});
  return chunks.join("");
}

function isCellStyledRed(cell){
  const colorCandidates = [
    cell?.s?.fgColor?.rgb,
    cell?.s?.font?.color?.rgb,
    cell?.s?.font?.color?.theme,
    cell?.s?.font?.color?.indexed,
    cell?.style?.font?.color?.rgb,
  ];
  for (const candidate of colorCandidates){
    if (isRedColorValue(candidate)){
      return true;
    }
  }
  return false;
}

function hasInlineFormattingRuns(html){
  if (typeof html !== "string" || !html.trim()){
    return false;
  }
  return /<\/?(?:span|font|b|strong|i|em)\b|<br\s*\/?>/i.test(html);
}

function getCellTextWithMarkers(ws, addr){
  const cell = ws?.[addr];
  if (!cell) return "";
  const styleIsRed = isCellStyledRed(cell);

  if (typeof cell.h === "string" && cell.h.trim()){
    const withMarkers = htmlToStyleMarkers(cell.h).trim();
    if (styleIsRed && withMarkers && !withMarkers.includes("{{RED}}") && !hasInlineFormattingRuns(cell.h)){
      return `{{RED}}${withMarkers}{{/RED}}`;
    }
    return withMarkers;
  }
  const raw = cell.w ?? cell.v ?? "";
  const text = String(raw).trim();
  if (styleIsRed && text && !text.includes("{{RED}}")){
    return `{{RED}}${text}{{/RED}}`;
  }
  return text;
}

function extractSheetRowsWithFormatting(ws){
  const ref = ws?.["!ref"];
  if (!ref){
    return {header: [], rows: []};
  }
  const range = XLSX.utils.decode_range(ref);
  const headersByColumn = new Map();
  const header = [];

  for (let c = range.s.c; c <= range.e.c; c += 1){
    const addr = XLSX.utils.encode_cell({r: range.s.r, c});
    const key = norm(getCellTextWithMarkers(ws, addr));
    if (!key) continue;
    headersByColumn.set(c, key);
    header.push(key);
  }

  const rows = [];
  for (let r = range.s.r + 1; r <= range.e.r; r += 1){
    const row = {};
    let hasData = false;
    for (let c = range.s.c; c <= range.e.c; c += 1){
      const key = headersByColumn.get(c);
      if (!key) continue;
      const addr = XLSX.utils.encode_cell({r, c});
      const value = getCellTextWithMarkers(ws, addr);
      if (value !== "") hasData = true;
      row[key] = value;
    }
    if (hasData){
      rows.push(row);
    }
  }
  return {header, rows};
}

function ensureJSZip(cb){
  if (window.JSZip) return cb();
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
  s.onload = cb;
  s.onerror = () => {
    setStatus(translations[currentLanguage].messages.statusXlsxError);
    logLine("BŁĄD: nie udało się załadować biblioteki JSZip (CDN).", true);
  };
  document.head.appendChild(s);
}

function loadXlsxFromRepo(){
  ensureJSZip(()=>{
    (async ()=>{
      try{
        if (!window.XlsxCanonicalParser || !window.XlsxCanonicalParser.loadXlsxMinimal){
          throw new Error("XlsxCanonicalParser unavailable");
        }
        setStatus(translations[currentLanguage].messages.statusCanonicalStart);
        const xlsxRes = await fetch("Repozytorium.xlsx", {cache:"no-store"});
        if (!xlsxRes.ok){
          throw new Error(`HTTP ${xlsxRes.status} while fetching Repozytorium.xlsx`);
        }
        const xlsxBuffer = await xlsxRes.arrayBuffer();
        const {sheets: rawSheets, sheetOrder, columnOrder} = await window.XlsxCanonicalParser.loadXlsxMinimal(xlsxBuffer);
        const data = buildDataJsonFromSheets(rawSheets, {sheetOrder, columnOrder});
        downloadDataJson(data);
        DB = normaliseDB(data);
        const restored = loadSessionState();
        if (!restored){
          for (const sheetName of Object.keys(DB.sheets || {})){
            applyDefaultViewForSheet(sheetName);
          }
        }
        initUI();
        saveSessionState();
        setStatus(translations[currentLanguage].messages.statusRepoUpdated);
      }catch(e){
        setStatus(translations[currentLanguage].messages.statusRepoError);
        logLine(`${translations[currentLanguage].messages.statusCanonicalUnavailable}: ${e.message}`, true);
        logLine(`[CANONICAL PARSER] CLI fallback: python build_json.py Repozytorium.xlsx data.json`, true);
      }
    })();
  });
}

function normaliseDB(data){
  const sheetsIn = data.sheets || data;
  const sheets = {};
  for (const name of Object.keys(sheetsIn)){
    if (name.startsWith("_")) continue; // ignore meta/hidden sheets like _meta
    const rows = Array.isArray(sheetsIn[name]) ? sheetsIn[name] : (sheetsIn[name].rows || []);
    sheets[name] = transformSheet(name, rows);
  }
  const meta = data._meta || {};
  const traits = meta.traits || {};
  const states = meta.states || {};
  const sheetOrder = Array.isArray(meta.sheetOrder) ? meta.sheetOrder : Object.keys(sheetsIn);
  const columnOrder = meta.columnOrder && typeof meta.columnOrder === "object" ? meta.columnOrder : {};
  // build fast indexes (canonical keys)
  const traitIndex = {};
  for (const [k,v] of Object.entries(traits)){
    traitIndex[canonKey(k)] = v;
    // also support canonicalisation without space: "Name(X)" variant
    traitIndex[canonKey(k).replace(/\s+/g,"")] = v;
  }
  const stateIndex = {};
  for (const [k,v] of Object.entries(states)){
    stateIndex[canonKey(k)] = v;
  }
  return {sheets, _meta:{traits, states, traitIndex, stateIndex, sheetOrder, columnOrder}};
}

/* ---------- UI init ---------- */
function initUI(){
  // Tabs
  els.tabs.innerHTML = "";
  const available = Object.keys(DB.sheets);
  const baseVisible = ADMIN_MODE ? available : available.filter(name => !ADMIN_ONLY_SHEETS.has(name));
  let visibleSheets = uiState.showCharacterTabs
    ? baseVisible
    : baseVisible.filter(name => !isCharacterCreationSheet(name));
  visibleSheets = uiState.showCombatTabs
    ? visibleSheets
    : visibleSheets.filter(name => !isCombatRulesSheet(name));
  const order = getSheetOrder(available);
  const visibleOrder = order.filter(name => visibleSheets.includes(name));
  for (const name of visibleOrder){
    const b = document.createElement("button");
    b.className = "tab";
    b.textContent = name.toUpperCase();
    if (isCharacterCreationSheet(name)){
      b.classList.add("tab--character");
    }
    if (isCombatRulesSheet(name)){
      b.classList.add("tab--combat");
    }
    b.addEventListener("click", ()=>selectSheet(name));
    els.tabs.appendChild(b);
  }
  // select first
  const nextSheet = visibleOrder.includes(currentSheet) ? currentSheet : (visibleOrder[0] || visibleSheets[0]);
  if (nextSheet) selectSheet(nextSheet);

  if (els.toggleCharacterTabs){
    els.toggleCharacterTabs.checked = uiState.showCharacterTabs;
  }
  if (els.toggleCombatTabs){
    els.toggleCombatTabs.checked = uiState.showCombatTabs;
  }

  // Actions / admin visibility
  if (!ADMIN_MODE){
    // hide admin-only loaders (players just consume hosted data.json)
    els.updateDataGroup.style.display = "none";
  } else {
    els.updateDataGroup.style.display = "";
  }
}

/* ---------- Sheet selection ---------- */
let tableEl = null;
let tbodyEl = null;
let activeFilterCol = null;
let activeFilterBtn = null;
let filterMenuDocHandler = null;

function isFilterMenuOpen(){
  return els.filterMenu.getAttribute("aria-hidden") !== "true";
}
let headerBuiltFor = null;

/* Legacy renderer (z przewijaniem i klamrowaniem) — zostawiony do wglądu
function buildTableSkeleton(){...}
*/

function selectSheet(name){
  persistCurrentSheetView();
  currentSheet = name;
  restoreSheetView(name);
  els.btnCompare.disabled = true;
  if (els.global){
    els.global.value = view.global || "";
  }

  [...els.tabs.querySelectorAll(".tab")].forEach(t => t.classList.toggle("active", t.textContent === name.toUpperCase()));

  buildTableSkeleton();
  renderBody();
  saveSessionState();
}

function buildTableSkeleton(){
  const rows = DB.sheets[currentSheet] || [];
  const cols = inferColumns(rows, currentSheet);
  DB.sheets[currentSheet]._cols = cols;

  els.wrap.innerHTML = "";

  const frame = document.createElement("div");
  frame.className = "tableFrame";

  const viewport = document.createElement("div");
  viewport.className = "tableViewport";

  tableEl = document.createElement("table");
  tableEl.className = "dataTable";
  tableEl.dataset.sheet = currentSheet;

  const thead = document.createElement("thead");
  const trH = document.createElement("tr");
  const trF = document.createElement("tr");

  const th0 = document.createElement("th");
  th0.textContent = "✓";
  trH.appendChild(th0);

  const th0f = document.createElement("th");
  th0f.className = "noFilterCell";
  trF.appendChild(th0f);

  for (const col of cols){
    const th = document.createElement("th");
    th.dataset.col = col;
    const label = document.createElement("span");
    label.textContent = col;
    th.appendChild(label);

    const sortMark = document.createElement("span");
    sortMark.className = "sortMark";
    sortMark.style.marginLeft = "8px";
    sortMark.style.opacity = ".8";
    th.appendChild(sortMark);

    th.addEventListener("click", (e)=>{
      if (e.target && e.target.closest(".filterBtn")) return;
      toggleSort(col);
    });

    const thf = document.createElement("th");
    thf.dataset.col = col;
    const filters = document.createElement("div");
    filters.className = "tableFilters";

    const row = document.createElement("div");
    row.className = "filterRow";

    const input = document.createElement("input");
    input.className = "input";
    input.placeholder = translations[currentLanguage].placeholders.columnFilter;
    input.dataset.col = col;
    input.addEventListener("input", ()=>{
      view.filtersText[col] = input.value;
      renderBody();
      saveSessionState();
    });
    input.addEventListener("keydown", ev=>ev.stopPropagation());

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filterBtn";
    btn.textContent = "▾";
    btn.title = translations[currentLanguage].messages.filterButtonTitle;
    btn.addEventListener("click", (ev)=>{ ev.preventDefault(); ev.stopPropagation(); openFilterMenu(col, btn); });

    row.appendChild(input);
    row.appendChild(btn);
    filters.appendChild(row);
    thf.appendChild(filters);

    trH.appendChild(th);
    trF.appendChild(thf);
  }

  thead.appendChild(trH);
  thead.appendChild(trF);
  tableEl.appendChild(thead);

  tbodyEl = document.createElement("tbody");
  tableEl.appendChild(tbodyEl);

  viewport.appendChild(tableEl);
  frame.appendChild(viewport);
  els.wrap.appendChild(frame);

  updateSortMarks();
  updateFilterIndicators();
}

/* ---------- Sorting ---------- */
function toggleSort(col){
  if (!view.sort || view.sort.col !== col){
    view.sort = {col, dir:"asc"};
  } else if (view.sort.dir === "asc"){
    view.sort.dir = "desc";
  } else {
    view.sort = null; // third click clears
  }
  if (view.sort){
    view.sort.secondary = null;
  }
  updateSortMarks();
  renderBody();
  saveSessionState();
}

function updateSortMarks(){
  if (!tableEl) return;
  const marks = tableEl.querySelectorAll("thead tr:first-child th .sortMark");
  marks.forEach(m=>m.textContent="");
  if (!view.sort) return;
  const th = tableEl.querySelector(`thead tr:first-child th[data-col="${CSS.escape(view.sort.col)}"]`);
  if (th){
    const sm = th.querySelector(".sortMark");
    sm.textContent = view.sort.dir === "asc" ? "▲" : "▼";
  }
}

/* ---------- Filtering ---------- */
function uniqueValuesForColumn(col){
  const rows = DB.sheets[currentSheet] || [];
  const vals = new Set();
  for (const r of rows){
    vals.add(String(r[col] ?? "").trim() || "-");
  }
  return [...vals].sort((a,b)=>a.localeCompare(b,"pl",{numeric:true,sensitivity:"base"}));
}

function isColumnFilterActive(col){
  const textFilter = String(view.filtersText?.[col] ?? "").trim();
  if (textFilter) return true;
  const setFilter = view.filtersSet?.[col];
  if (!(setFilter instanceof Set)) return false;
  const allValuesCount = uniqueValuesForColumn(col).length;
  return setFilter.size < allValuesCount;
}

function updateFilterIndicators(){
  if (!tableEl) return;
  tableEl.querySelectorAll('thead tr:first-child th[data-col]').forEach((headerCell) => {
    const col = headerCell.dataset.col;
    const active = isColumnFilterActive(col);
    headerCell.classList.toggle("filter-active", active);
    const btn = tableEl.querySelector(`thead tr:nth-child(2) th[data-col="${CSS.escape(col)}"] .filterBtn`);
    if (btn){
      btn.classList.toggle("filter-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    }
  });
}

function openFilterMenu(col, anchorBtn){
  const menu = els.filterMenu;
  if (isFilterMenuOpen() && activeFilterCol === col && activeFilterBtn === anchorBtn){
    closeFilterMenu();
    return;
  }

  if (isFilterMenuOpen()){
    closeFilterMenu();
  }

  activeFilterCol = col;
  activeFilterBtn = anchorBtn;
  menu.innerHTML = "";

  const title = document.createElement("div");
  title.className = "fmTitle";
  title.textContent = `${translations[currentLanguage].messages.filterTitle}: ${col}`;
  menu.appendChild(title);

  const search = document.createElement("input");
  search.className = "input fmSearch";
  search.placeholder = translations[currentLanguage].placeholders.filterSearch;
  menu.appendChild(search);

  const actions = document.createElement("div");
  actions.className = "fmActions";
  const bAll = document.createElement("button");
  bAll.className = "btn secondary";
  bAll.textContent = translations[currentLanguage].messages.selectAll;
  const bNone = document.createElement("button");
  bNone.className = "btn secondary";
  bNone.textContent = translations[currentLanguage].messages.clearAll;
  actions.appendChild(bAll); actions.appendChild(bNone);
  menu.appendChild(actions);

  const list = document.createElement("div");
  list.className = "fmList";
  menu.appendChild(list);

  const allVals = uniqueValuesForColumn(col);
  const displayVals = allVals.map(v => stripMarkers(v));
  let visible = allVals;
  let visibleDisplay = displayVals;

  const selected = view.filtersSet[col] ? new Set(view.filtersSet[col]) : new Set(allVals);

  function renderList(){
    list.innerHTML = "";
    for (let idx = 0; idx < visible.length; idx++){
      const v = visible[idx];
      const display = visibleDisplay[idx];
      const item = document.createElement("div");
      item.className = "fmItem";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = selected.has(v);
      cb.addEventListener("change", ()=>{
        if (cb.checked) selected.add(v); else selected.delete(v);
        applySetFilter();
      });
      const lab = document.createElement("label");
      lab.appendChild(document.createTextNode(display));
      item.appendChild(cb); item.appendChild(lab);
      list.appendChild(item);
    }
  }

  function applySetFilter(){
    // if all selected -> no filter
    if (selected.size === allVals.length){
      view.filtersSet[col] = null;
    } else {
      view.filtersSet[col] = new Set(selected);
    }
    renderBody();
    saveSessionState();
  }

  search.addEventListener("input", ()=>{
    const q = search.value.toLowerCase().trim();
    if (!q){
      visible = allVals;
      visibleDisplay = displayVals;
    } else {
      visible = [];
      visibleDisplay = [];
      for (let i = 0; i < allVals.length; i++){
        const display = displayVals[i];
        if (display.toLowerCase().includes(q)){
          visible.push(allVals[i]);
          visibleDisplay.push(display);
        }
      }
    }
    renderList();
  });

  bAll.addEventListener("click", ()=>{
    selected.clear();
    for (const v of allVals) selected.add(v);
    applySetFilter();
    renderList();
  });
  bNone.addEventListener("click", ()=>{
    selected.clear();
    applySetFilter();
    renderList();
  });

  renderList();

  // position
  const rect = anchorBtn.getBoundingClientRect();
  menu.style.left = `${Math.min(rect.left, window.innerWidth-340)}px`;
  menu.style.top  = `${rect.bottom + 6}px`;
  menu.setAttribute("aria-hidden","false");

  // close handlers
  filterMenuDocHandler = (ev)=>{
    if (menu.contains(ev.target) || anchorBtn.contains(ev.target)) return;
    closeFilterMenu();
  };
  setTimeout(()=>{
    if (!isFilterMenuOpen()) return;
    document.addEventListener("mousedown", filterMenuDocHandler);
  }, 0);
}

function closeFilterMenu(){
  if (filterMenuDocHandler){
    document.removeEventListener("mousedown", filterMenuDocHandler);
    filterMenuDocHandler = null;
  }
  activeFilterCol = null;
  activeFilterBtn = null;
  els.filterMenu.setAttribute("aria-hidden","true");
  els.filterMenu.innerHTML = "";
}

/* ---------- Row filtering + sorting ---------- */
function numVal(x){
  const s = String(x ?? "").trim();
  if (!s || s==="-" ) return NaN;
  const m = s.match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : NaN;
}

function compareByColumn(a, b, col){
  const an = !Number.isNaN(numVal(a));
  const bn = !Number.isNaN(numVal(b));
  if (an && bn) return numVal(a) - numVal(b);
  return String(a ?? "").localeCompare(String(b ?? ""), "pl", {numeric:true, sensitivity:"base"});
}

function passesFilters(row, cols){
  // global
  const g = (view.global || "").toLowerCase().trim();
  if (g){
    const hay = cols.map(c => String(row[c] ?? "")).join(" | ").toLowerCase();
    if (!hay.includes(g)) return false;
  }
  // per-column text contains
  for (const [col, txt] of Object.entries(view.filtersText)){
    const q = String(txt ?? "").toLowerCase().trim();
    if (!q) continue;
    const v = String(row[col] ?? "").toLowerCase();
    if (!v.includes(q)) return false;
  }
  // per-column set filter
  for (const [col, set] of Object.entries(view.filtersSet)){
    if (!set || !(set instanceof Set)) continue;
    const v = String(row[col] ?? "").trim() || "-";
    if (!set.has(v)) return false;
  }
  return true;
}

function sortRows(rows){
  if (!view.sort) return rows;
  const {col, dir, secondary} = view.sort;
  const out = [...rows];
  out.sort((ra, rb)=>{
    const a = ra[col], b = rb[col];
    let cmp = compareByColumn(a, b, col);
    if (cmp === 0 && secondary?.col){
      const av = ra[secondary.col];
      const bv = rb[secondary.col];
      cmp = compareByColumn(av, bv, secondary.col);
      if (secondary.dir === "desc") cmp = -cmp;
    }
    return dir === "asc" ? cmp : -cmp;
  });
  return out;
}

/* ---------- Rendering body ---------- */
let renderToken = 0;

/* Legacy renderer (z klamrowaniem i rozwijaniem) — pozostawiony w komentarzu
function renderBody(){...}
function renderRow(){...}
function measureRenderedLines(){...}
function updateClampableHints(){...}
*/

function renderBody(){
  if (!DB || !currentSheet || !tbodyEl) return;
  const rowsAll = DB.sheets[currentSheet] || [];
  const cols = DB.sheets[currentSheet]._cols || inferColumns(rowsAll, currentSheet);
  updateFilterIndicators();

  const filtered = sortRows(rowsAll.filter(r => passesFilters(r, cols)));
  const token = ++renderToken;

  if (!filtered.length){
    tbodyEl.innerHTML = `<tr><td colspan="${cols.length + 1}" class="emptyState"><div class="emptyTitle">${translations[currentLanguage].labels.resultsEmptyTitle}</div><div class="emptyText">${translations[currentLanguage].labels.resultsEmptyText}</div></td></tr>`;
    els.btnCompare.disabled = true;
    return;
  }

  tbodyEl.innerHTML = "";
  let idx = 0;

  function renderChunk(){
    if (token !== renderToken) return;
    const frag = document.createDocumentFragment();

    for (let n = 0; n < RENDER_CHUNK_SIZE && idx < filtered.length; n++, idx++){
      frag.appendChild(renderRow(filtered[idx], cols));
    }

    tbodyEl.appendChild(frag);

    if (idx < filtered.length){
      requestAnimationFrame(renderChunk);
    } else {
      els.btnCompare.disabled = view.selected.size < 2;
    }
  }

  renderChunk();
}

function renderRow(r, cols){
  const tr = document.createElement("tr");
  tr.classList.toggle("row-selected", view.selected.has(r.__id));

  const td0 = document.createElement("td");
  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = view.selected.has(r.__id);
  cb.addEventListener("change", ()=>{
    if (cb.checked) view.selected.add(r.__id); else view.selected.delete(r.__id);
    tr.classList.toggle("row-selected", cb.checked);
    els.btnCompare.disabled = view.selected.size < 2;
  });
  td0.appendChild(cb);
  tr.appendChild(td0);

  for (const col of cols){
    const td = document.createElement("td");
    td.dataset.col = col;

    if (col === "Cechy"){
      td.appendChild(renderTraitsCell(r[col]));
    } else if (col === "Zasięg"){
      td.innerHTML = `<div class="celltext">${getFormattedCellHTML(r, col)}</div>`;
    } else {
      const div = document.createElement("div");
      div.className = "celltext";

      const key = `${currentSheet}|${r.__id}|${col}`;

      div.innerHTML = formatDataCellHTML(r, col, currentSheet);

      td.appendChild(div);

      // Clamp only when the rendered block exceeds 9 visual lines (not just explicit newlines).
      requestAnimationFrame(()=>{
        const key = `${currentSheet}|${r.__id}|${col}`;
        let hint = null;
        let resizeHandle = null;
        let lastLines = null;
        let lastLineHeight = null;

        const renderClampState = (lineHeight) => {
          if (!hint) return;
          const expanded = view.expandedCells.has(key);
          td.classList.add("clampable");
          td.title = expanded
            ? translations[currentLanguage].messages.collapse
            : translations[currentLanguage].messages.expand;
          div.style.maxHeight = expanded ? "" : `${lineHeight * 9}px`;
          div.style.overflow = expanded ? "" : "hidden";
          hint.textContent = expanded
            ? translations[currentLanguage].messages.collapse
            : translations[currentLanguage].messages.expand;
        };

        const evaluateClamp = () => {
          const lineHeight = parseFloat(getComputedStyle(div).lineHeight) || 16;
          const linesRendered = Math.round(div.scrollHeight / lineHeight);

          if (linesRendered === lastLines && lineHeight === lastLineHeight) return;
          lastLines = linesRendered;
          lastLineHeight = lineHeight;

          const isClampable = linesRendered > 9;
          if (!isClampable){
            td.classList.remove("clampable");
            td.title = "";
            div.style.maxHeight = "";
            div.style.overflow = "";
            if (hint){
              hint.remove();
              hint = null;
            }
            if (resizeHandle){
              resizeHandle.disconnect();
              resizeHandle = null;
            }
            return;
          }

          if (!hint){
            hint = document.createElement("div");
            hint.className = "clampHint";
            td.appendChild(hint);
            td.addEventListener("click", ()=>{
              const expanded = view.expandedCells.has(key);
              if (expanded) view.expandedCells.delete(key); else view.expandedCells.add(key);
              renderClampState(lineHeight);
            });
          }

          renderClampState(lineHeight);

          if (!resizeHandle){
            resizeHandle = new ResizeObserver(()=>requestAnimationFrame(evaluateClamp));
            resizeHandle.observe(div);
          }
        };

        evaluateClamp();
      });
    }

    tr.appendChild(td);
  }

  return tr;
}

function renderTraitsCell(v){
  const wrap = document.createElement("div");
  const s = String(v ?? "").trim();
  if (!s || s === "-"){
    wrap.textContent = "-";
    return wrap;
  }
  const parts = s.split(";").map(x => norm(x)).filter(Boolean);
  for (const p of parts){
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = p;
    tag.addEventListener("click", (ev) => { ev.stopPropagation(); openTraitPopover(p); });
    wrap.appendChild(tag);
  }
  return wrap;
}

/* ---------- Trait + state resolution ---------- */
function resolveTrait(traitText){
  const meta = DB?._meta || {};
  const traitIndex = meta.traitIndex || {};
  const stateIndex = meta.stateIndex || {};

  const t = norm(traitText);

  // 1) Wywołanie: Zatrucie (5) / Wywołanie (Zatrucie (5))
  const mCall = t.match(/^Wywołanie\s*(?::|\()\s*(.+)\s*$/i);
  if (mCall){
    const usesParen = /^Wywołanie\s*\(/i.test(t);
    let stRaw = norm(mCall[1]);
    if (usesParen && stRaw.endsWith(")")){
      stRaw = stRaw.slice(0, -1).trim();
    }
    const mLvl = stRaw.match(/^(.*)\s*\((\d+)\)\s*$/);
    const stateKeyFull = mLvl ? `${norm(mLvl[1])} (${mLvl[2]})` : stRaw;
    const stateKeyBase = mLvl ? norm(mLvl[1]) : stRaw;

    const traitTextTpl = "Wywołanie (Stan)";
    const traitDesc = traitIndex[canonKey(traitTextTpl)] || traitIndex[canonKey("Wywołanie(Stan)")] || null;

    const stDesc = stateIndex[canonKey(stateKeyFull)] || stateIndex[canonKey(stateKeyBase)] || null;

    const blocks = [];
    blocks.push({
      label: translations[currentLanguage].messages.invocationLabel,
      text: traitDesc || translations[currentLanguage].messages.traitNotFound,
    });
    blocks.push({
      label: `${translations[currentLanguage].messages.stateLabel}: ${stateKeyFull.toUpperCase()}`,
      text: stDesc || translations[currentLanguage].messages.stateNotFound,
    });
    return {title: `${translations[currentLanguage].messages.invocationTitle}: ${stateKeyFull}`, blocks};
  }

  // 2) Cechy parametryzowane: "Nieporęczny (2)" -> match "Nieporęczny (X)"
  const mNum = t.match(/^(.*?)(\s*)\((\d+)\)\s*$/);
  if (mNum){
    const baseName = norm(mNum[1]);
    const key1 = canonKey(`${baseName} (X)`);
    const key2 = canonKey(`${baseName}(X)`);
    const desc = traitIndex[key1] || traitIndex[key2] || null;
    if (desc){
      return {title: t, blocks:[{label: translations[currentLanguage].messages.traitLabel, text: desc}]};
    }
  }

  // 3) Exact match
  const desc = traitIndex[canonKey(t)] || traitIndex[canonKey(t).replace(/\s+/g,"")] || null;
  if (desc){
    return {title: t, blocks:[{label: translations[currentLanguage].messages.traitLabel, text: desc}]};
  }

  return {
    title: t,
    blocks: [{
      label: translations[currentLanguage].messages.noDescriptionLabel,
      text: translations[currentLanguage].messages.traitNotFound,
    }],
  };
}

function openTraitPopover(traitText){
  const r = resolveTrait(traitText);
  els.popTitle.textContent = r.title.toUpperCase();
  els.popBody.innerHTML = r.blocks.map(b => `
    <div class="popoverBlock">
      <div class="popoverLabel">${escapeHtml(b.label)}</div>
      <div class="celltext">${formatTextHTML(b.text)}</div>
    </div>`).join("");
  els.pop.setAttribute("aria-hidden","false");
}
function closePopover(){ els.pop.setAttribute("aria-hidden","true"); }
els.popClose.addEventListener("click", closePopover);

/* ---------- Modal ---------- */
function openModal(title, html){
  void title;
  els.modalBody.innerHTML = html;
  els.modal.setAttribute("aria-hidden","false");
}
function closeModal(){ els.modal.setAttribute("aria-hidden","true"); }
els.modalClose.addEventListener("click", closeModal);
document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") { closePopover(); closeModal(); closeFilterMenu(); } });

/* ---------- Compare ---------- */
els.btnCompare.addEventListener("click", () => {
  if (view.selected.size < 2) return;
  const rowsAll = DB.sheets[currentSheet] || [];
  const picked = [...view.selected].map(id => rowsAll.find(r => r.__id === id)).filter(Boolean);
  openCompareModal(picked);
});

function openCompareModal(rows){
  const cols = DB.sheets[currentSheet]._cols || inferColumns(DB.sheets[currentSheet] || [], currentSheet);
  const htmlRows = [];
  for (const col of cols){
    const vals = rows.map(r => r[col] ?? "");
    const uniq = new Set(vals.map(v => String(v)));
    const diff = uniq.size > 1;
    htmlRows.push(`
      <tr class="${diff ? "diff" : ""}">
        <th>${escapeHtml(col)}</th>
        ${rows.map(r => `<td>${col==="Cechy" ? escapeHtml(String(r[col]||"")) : formatDataCellHTML(r, col, currentSheet)}</td>`).join("")}
      </tr>`);
  }
  const html = `<div style="overflow:auto; max-height:70vh">
    <table>
      <thead><tr><th>${translations[currentLanguage].labels.comparisonField}</th>${rows
        .map((_, i) => `<th>${translations[currentLanguage].labels.comparisonRecord} ${i + 1}</th>`)
        .join("")}</tr></thead>
      <tbody>${htmlRows.join("")}</tbody>
    </table>
  </div>`;
  openModal(translations[currentLanguage].labels.comparisonTitle.toUpperCase(), html);
}

/* ---------- View presets ---------- */
els.btnReset.addEventListener("click", ()=>{
  applyViewModeToAllSheets("full");
});

if (els.btnDefaultView){
  els.btnDefaultView.addEventListener("click", ()=>{
    applyViewModeToAllSheets("default");
  });
}

/* ---------- Global search ---------- */
els.global.addEventListener("input", ()=>{
  view.global = els.global.value;
  renderBody();
  saveSessionState();
});
els.global.addEventListener("keydown", (ev)=>ev.stopPropagation());

if (els.toggleCharacterTabs){
  els.toggleCharacterTabs.addEventListener("change", ()=>{
    uiState.showCharacterTabs = els.toggleCharacterTabs.checked;
    initUI();
    saveSessionState();
  });
  uiState.showCharacterTabs = els.toggleCharacterTabs.checked;
}
if (els.toggleCombatTabs){
  els.toggleCombatTabs.addEventListener("change", ()=>{
    uiState.showCombatTabs = els.toggleCombatTabs.checked;
    initUI();
    saveSessionState();
  });
  uiState.showCombatTabs = els.toggleCombatTabs.checked;
}

if (els.languageSelect){
  els.languageSelect.addEventListener("change", (event)=>{
    applyLanguage(event.target.value);
    saveSessionState();
  });
}

applyLanguage(currentLanguage);

/* ---------- Loaders ---------- */
els.btnUpdateData.addEventListener("click", loadXlsxFromRepo);

/* ---------- Boot ---------- */
(async function boot(){
  logLine(`Tryb: ${ADMIN_MODE ? translations[currentLanguage].messages.modeAdmin : translations[currentLanguage].messages.modePlayer}`);
  // auto-load data.json (players)
  await loadJsonFromRepo();
})();

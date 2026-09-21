// Plik logiki modułu: konfiguracja, funkcje i obsługa zdarzeń / Module logic file: configuration, functions, and event handling
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
  sheetTools: document.getElementById("sheetTools"),
  quickSearch: document.getElementById("quickSearch"),
  btnSheetFilters: document.getElementById("btnSheetFilters"),
  filtersBadge: document.getElementById("filtersBadge"),
  btnSheetSort: document.getElementById("btnSheetSort"),
  rowCount: document.getElementById("rowCount"),
  activeChips: document.getElementById("activeChips"),
  filterModal: document.getElementById("filterModal"),
  filterModalTitle: document.getElementById("filterModalTitle"),
  filterModalScope: document.getElementById("filterModalScope"),
  filterModalBody: document.getElementById("filterModalBody"),
  filterModalApply: document.getElementById("filterModalApply"),
  filterModalCancel: document.getElementById("filterModalCancel"),
  filterModalDefaults: document.getElementById("filterModalDefaults"),
  filterModalClear: document.getElementById("filterModalClear"),
  sortSheet: document.getElementById("sortSheet"),
  sortSheetBody: document.getElementById("sortSheetBody"),
  sortSheetClose: document.getElementById("sortSheetClose"),
  toggleBestiaryOldGroup: document.getElementById("toggleBestiaryOldGroup"),
  toggleOldBestiaryEntries: document.getElementById("toggleOldBestiaryEntries"),
  toggleCharacterTabs: document.getElementById("toggleCharacterTabs"),
  toggleCombatTabs: document.getElementById("toggleCombatTabs"),
  toggleVehicleTabs: document.getElementById("toggleVehicleTabs"),
  accessGate: document.getElementById("accessGate"),
  accessForm: document.getElementById("accessForm"),
  accessPassword: document.getElementById("accessPassword"),
  accessError: document.getElementById("accessError"),
  languageSelect: document.getElementById("languageSelect"),
};

// --- MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT ---
// Przy dodawaniu nowej wersji językowej dodaj nowy klucz w obiekcie translations (np. fr/de),
// zaktualizuj nazwy zakładek oraz warunki kolorowania skrótu "str." powiązane z tekstami w wielu językach.
// When adding a new language version, add a new key to translations (e.g., fr/de),
// update tab names and update all "pg."/"str." coloring rules tied to multilingual text variants.
const translations = {
  pl: {
    labels: {
      pageTitle: "ADMINISTRATUM DATA VAULT",
      updateDataButton: "Generuj pliki danych",
      updateNoteFull: "Kliknij, aby wybrać lokalny plik <code>Repozytorium.xlsx</code>. Aplikacja wygeneruje <code>data.json</code> jako backup oraz <code>firebase-import.json</code> — plik gotowy do importu w root Firebase Realtime Database. Po imporcie dane zostaną umieszczone pod <code>/datavault/live</code>.",
      mainPageButton: "Strona Główna",
      fullViewButton: "Pełen Widok",
      defaultViewButton: "Widok Domyślny",
      viewButtonsNote: "Część danych jest domyślnie ukryta.",
      compareButton: "Porównaj zaznaczone",
      filtersTitle: "FILTRY",
      globalSearchLabel: "Szukaj (globalnie)",
      toggleOldBestiaryEntries: "Czy wyświetlić zdezaktualizowane wpisy?",
      toggleCharacterTabs: "Czy wyświetlić zakładki dotyczące tworzenia postaci?",
      toggleCombatTabs: "Czy wyświetlić zakładki dotyczące zasad walki?",
      toggleVehicleTabs: "Czy wyświetlić zakładki dotyczące pojazdów?",
      hintSort: "▸ Kliknij nagłówek, aby sortować.",
      hintFilters: "▸ Drugi wiersz nagłówka: filtry per kolumna (fragment / liczby).",
      hintCompare: "▸ Zaznacz 2+ wiersze, aby porównać.",
      hintTooltip: "Jeśli tooltipy cech nie wyskakują na telefonie: stuknij w tag cechy.",
      emptyTitle: "Brak danych",
      emptyText: "Brak danych do wyświetlenia. W trybie admina użyj <b>Generuj pliki danych</b>.",
      resultsEmptyTitle: "BRAK WYNIKÓW",
      resultsEmptyText: "Zmień filtry lub wyczyść widok.",
      comparisonTitle: "Porównanie",
      comparisonField: "Pole",
      comparisonRecord: "Rekord",
      filtersButton: "Filtry",
      sortButton: "Sortuj",
      cancelButton: "Anuluj",
      closeButton: "Zamknij",
      restoreDefaultsButton: "Przywróć domyślne",
      clearFiltersButton: "Wyczyść filtry",
      sortTitle: "Sortowanie",
    },
    placeholders: {
      globalSearch: "np. Pist, Brutalna, IMPERIUM, Zatrucie (5)...",
      columnFilter: "filtr...",
      filterSearch: "Szukaj na liście…",
      quickSearch: "Szukaj w tej zakładce...",
      columnTextFilter: "wpisz fragment...",
    },
    titles: {
      fullView: "Pokaż pełny widok danych (bez ukryć domyślnych). Działa na wszystkich zakładkach. Część danych jest domyślnie ukryta.",
      defaultView: "Przywróć domyślny widok danych (z ukryciami). Działa na wszystkich zakładkach. Część danych jest domyślnie ukryta.",
      updateData: "Kliknij, aby wybrać lokalny plik Repozytorium.xlsx. Aplikacja wygeneruje data.json jako backup oraz firebase-import.json — plik gotowy do importu w root Firebase Realtime Database. Po imporcie dane zostaną umieszczone pod /datavault/live.",
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
      statusLoadJson: "Ładowanie danych z prywatnej bazy...",
      statusLoadOk: "OK — załadowano dane z prywatnej bazy",
      statusLoadError: "Błąd ładowania danych z prywatnej bazy",
      statusXlsxError: "Błąd ładowania XLSX",
      statusRepoDownload: "Wskaż lokalny plik Repozytorium.xlsx...",
      statusRepoUpdated: "OK — wygenerowano data.json oraz root-ready firebase-import.json do importu w root Firebase Realtime Database",
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
      filterModalTitle: "Filtry",
      filterModalScope: "kolumn: {count}",
      applyFilters: "Zatwierdź — pokaż {shown} z {total}",
      rowCount: "Pokazano {shown} z {total}",
      allValues: "wszystkie wartości",
      someValues: "{shown} z {total} wartości",
      chipSearch: "Szukaj: „{text}”",
      chipText: "{col}: „{text}”",
      chipValues: "{col} — {shown} z {total}",
      chipDefault: "Widok domyślny: {col} — {shown} z {total}",
      dropFilter: "Zdejmij ten filtr",
      sortAsc: "rosnąco",
      sortDesc: "malejąco",
      sortNone: "bez sortowania",
      groupEmpty: "—",
      groupCount: "{count} poz.",
      groupSelected: "zaznaczone",
      expandGroup: "Rozwiń grupę",
      collapseGroup: "Zwiń grupę",
    },
  },
  en: {
    labels: {
      pageTitle: "ADMINISTRATUM DATA VAULT",
      updateDataButton: "Generate data files",
      updateNoteFull: "Click to choose a local <code>Repozytorium.xlsx</code> file. The app will generate <code>data.json</code> as a backup and <code>firebase-import.json</code> — a file ready to import at the Firebase Realtime Database root. After import, the data will be placed under <code>/datavault/live</code>.",
      mainPageButton: "Main Page",
      fullViewButton: "Full View",
      defaultViewButton: "Default View",
      viewButtonsNote: "Some data is hidden by default.",
      compareButton: "Compare selected",
      filtersTitle: "FILTERS",
      globalSearchLabel: "Search (global)",
      toggleOldBestiaryEntries: "Show outdated entries?",
      toggleCharacterTabs: "Show tabs related to character creation?",
      toggleCombatTabs: "Show tabs related to combat rules?",
      toggleVehicleTabs: "Show tabs related to vehicles?",
      hintSort: "▸ Click a header to sort.",
      hintFilters: "▸ Second header row: filters per column (fragment / numbers).",
      hintCompare: "▸ Select 2+ rows to compare.",
      hintTooltip: "If trait tooltips do not appear on mobile: tap a trait tag.",
      emptyTitle: "No data",
      emptyText: "No data to display. Sign in to load data from the private database, or in admin mode generate data files and import firebase-import.json into Firebase.",
      resultsEmptyTitle: "NO RESULTS",
      resultsEmptyText: "Adjust filters or clear the view.",
      comparisonTitle: "Comparison",
      comparisonField: "Field",
      comparisonRecord: "Record",
      filtersButton: "Filters",
      sortButton: "Sort",
      cancelButton: "Cancel",
      closeButton: "Close",
      restoreDefaultsButton: "Restore defaults",
      clearFiltersButton: "Clear filters",
      sortTitle: "Sorting",
    },
    placeholders: {
      globalSearch: "e.g. Pist, Brutal, IMPERIUM, Poison (5)...",
      columnFilter: "filter...",
      filterSearch: "Search the list…",
      quickSearch: "Search this sheet...",
      columnTextFilter: "type a fragment...",
    },
    titles: {
      fullView: "Show the full data view (without default hiding). Applies to every sheet. Some data is hidden by default.",
      defaultView: "Restore the default data view (with hidden values). Applies to every sheet. Some data is hidden by default.",
      updateData: "Click to pick a local Repozytorium.xlsx file. The application generates data.json as a backup and firebase-import.json, ready to import into the Firebase Realtime Database root. After the import the data lands under /datavault/live.",
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
      statusLoadJson: "Loading data from private database...",
      statusLoadOk: "OK — loaded data from private database",
      statusLoadError: "Error loading data from private database",
      statusXlsxError: "Error loading XLSX",
      statusRepoDownload: "Select local Repozytorium.xlsx file...",
      statusRepoUpdated: "OK — generated data.json and root-ready firebase-import.json for import at the Firebase Realtime Database root",
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
      filterModalTitle: "Filters",
      filterModalScope: "columns: {count}",
      applyFilters: "Apply — show {shown} of {total}",
      rowCount: "Showing {shown} of {total}",
      allValues: "all values",
      someValues: "{shown} of {total} values",
      chipSearch: "Search: \u201c{text}\u201d",
      chipText: "{col}: \u201c{text}\u201d",
      chipValues: "{col} — {shown} of {total}",
      chipDefault: "Default view: {col} — {shown} of {total}",
      dropFilter: "Remove this filter",
      sortAsc: "ascending",
      sortDesc: "descending",
      sortNone: "no sorting",
      groupEmpty: "—",
      groupCount: "{count} items",
      groupSelected: "selected",
      expandGroup: "Expand group",
      collapseGroup: "Collapse group",
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
    if (key === "updateDataTitle") el.setAttribute("title", t.titles.updateData);
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
  if (els.quickSearch) {
    els.quickSearch.placeholder = t.placeholders.quickSearch;
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

// --- MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT ---
// Domyślne filtry i reguły formatowania niżej działają na nazwach zakładek (sheetName) z data.json.
// Jeśli dodasz nowy język (np. fr/de), zapewnij mapowanie nazw zakładek do obecnych kluczy kanonicznych
// (np. przez canonKey + słownik aliasów) albo zaktualizuj każdy zbiór/warunek oparty o nazwę zakładki.
// Inaczej część domyślnych filtrów i zachowań (np. słowa kluczowe, widok domyślny, sortowanie) nie zadziała.
// Default filters and formatting rules below rely on sheet names (sheetName) from data.json.
// If you add a new language (e.g., fr/de), provide mapping from localized tab names to current canonical keys
// (for example via canonKey + alias dictionary) or update every set/condition that depends on tab names.
// Otherwise some default filters/behaviors (keywords, default view, sorting) will stop working.
const KEYWORD_SHEETS_COMMA_NEUTRAL = new Set(["Bestiariusz", "Archetypy", "Psionika", "Augumentacje", "Ekwipunek", "Pancerze", "Bronie", "Pakiety Wyniesienia", "Pojazdy", "Bronie Pojazdów", "Ekwipunek Pojazdów"]);
const KEYWORD_SHEET_ALL_RED = "Słowa Kluczowe";
const ADMIN_ONLY_SHEETS = new Set(["Bestiariusz", "Trafienia Krytyczne", "Groza Osnowy", "Hordy", "Specjalne Bonusy Wrogów", "Notatki", "Uszkodzenia Pojazdów", "Eksplozje Pojazdów"]);
const CHARACTER_CREATION_SHEETS = new Set([
  "Tabela Rozmiarów",
  "Gatunki",
  "Archetypy",
  "Premie z Przeszłości Frakcji",
  "Słowa Kluczowe Frakcji",
  "Pakiety Wyniesienia",
  "Specjalne Bonusy Frakcji",
  "Implanty Astartes",
  "Zakony Pierwszego Powołania",
]);
const COMBAT_RULES_SHEETS = new Set(["Trafienia Krytyczne", "Groza Osnowy", "Skrót Zasad", "Tryby Ognia", "Kary do ST"]);
const VEHICLE_SHEETS = new Set(["Role W Pojeździe", "Akcje Pojazdu", "Stany Pojazdów", "Cechy Pojazdów", "Pojazdy", "Bronie Pojazdów", "Ekwipunek Pojazdów", "Uszkodzenia Pojazdów", "Eksplozje Pojazdów"]);
const CHARACTER_CREATION_SHEET_KEYS = new Set([...CHARACTER_CREATION_SHEETS].map(name => canonKey(name)));
const COMBAT_RULES_SHEET_KEYS = new Set([...COMBAT_RULES_SHEETS].map(name => canonKey(name)));
const VEHICLE_SHEET_KEYS = new Set([...VEHICLE_SHEETS].map(name => canonKey(name)));

let DB = null;          // {sheets: {name:{rows, cols}}, _meta:{traits, states, traitIndex, stateIndex}}
let currentSheet = null;
// Stan runtime checkboxa Bestiariusza nie trafia do sessionStorage, aby po odświeżeniu zawsze wracał do bezpiecznego ukrycia / Runtime Bestiary checkbox state is not stored in sessionStorage, so refresh always returns to safe hiding
let showOldBestiaryEntries = false;

const SESSION_VIEW_KEY = "datavault_session_view_v2";
const DEFAULT_VIEW_CONFIG = {
  "Archetypy": {
    "Gatunek": ["Człowiek"]
  },
  "Premie z Przeszłości Frakcji": { "Frakcja": ["Adepta Sororitas", "Adeptus Astartes", "Adeptus Astra Telepathica", "Adeptus Mechanicus", "Adeptus Ministorum", "Astra Militarum", "Chaos", "Dynastie Wolnych Kupców", "Inkwizycja", "Ogryn", "Szczurak", "Szumowiny"] },
  "Psionika": { "Typ": ["Uniwersalne Zdolności Psioniczne", "Pomniejsze Moce Psioniczne", "Uniwersalna Dyscyplina Psioniczna", "Dyscyplina Biomancji", "Dyscyplina Dywinacji", "Dyscyplina Piromancji", "Dyscyplina Telekinezy", "Dyscyplina Telepatii"] },
  "Augumentacje": { "Typ": ["Ulepszenia", "Wszczepy", "Mechadendryt"] },
  "Ekwipunek": { "Typ": ["Ulepszenia Broni", "Amunicja", "Ekwipunek Imperium"] },
  "Pancerze": { "Typ": ["Zwykłe", "Wspomagane", "Energetyczne"] },
  "Bronie": { "Typ": ["Adeptus Mechanicus", "Boltowa", "Broń biała", "Broń biała Adeptus Mechanicus", "Broń dystansowa", "Broń dystansowa Adeptus Mechnicus", "Broń dystansowa Milczących Sióstr", "Broń energetyczna", "Broń łańcuchowa", "Broń łańcuchowa Astartes", "Broń psioniczna", "Egzotyczna broń biała", "Granaty i Wyrzutnie", "Imperialna broń biała", "Laserowa", "Ogniowa", "Palna", "Plazmowa", "Termiczna"] },
  "Talenty": { "Typ": ["Człowiek", "Imperium", "Inkwizycja", "Mechanicus", "Militarum", "Ogólne", "Sororitas"] },
  "Pojazdy": { "Typ": ["Imperium", "Adepta Sororitas", "Adeptus Mechanicus"] },
  "Bronie Pojazdów": { "Rodzaj": ["Imperium"] },
  "Ekwipunek Pojazdów": { "Typ": ["Ekwipunek Imperialny"] },
};

const uiState = {
  showCharacterTabs: false,
  showCombatTabs: false,
  showVehicleTabs: false
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
const HIDDEN_COLUMNS = new Set(["lp", "stan"]);
const STATUS_OLD_VALUE = "old";

/* ---------- Utilities ---------- */
// --- Normalizacja tekstu, wspólna dla wszystkich trzech ścieżek generowania danych / Text normalisation, shared by all three data-generation paths ---
// PL: Ta sama kolejność kroków co w DataVault/xlsxCanonicalParser.js i w DataVault/build_json.py:
//     zamiana polskich cudzysłowów, scalenie białych znaków, przycięcie. Wszystkie trzy muszą robić
//     dokładnie to samo, bo z tej funkcji powstają klucze słowników `_meta.traits` i `_meta.states`.
//     Gdyby się rozjechały, kliknięcie tagu cechy przestałoby odnajdywać jej opis — ale dopiero dla
//     tych nazw, które trafią na różnicę, więc błąd byłby cichy i trudny do namierzenia.
// EN: The same step order as in DataVault/xlsxCanonicalParser.js and DataVault/build_json.py:
//     replace Polish quotes, collapse whitespace, trim. All three must do exactly the same thing,
//     because this function produces the keys of the `_meta.traits` and `_meta.states` dictionaries.
//     Should they drift apart, clicking a trait tag would stop finding its description — but only for
//     the names that hit the difference, so the fault would be silent and hard to track down.
function replacePolishQuotes(text){
  return String(text ?? "").replace(/„/g, '"').replace(/”/g, '"');
}

function norm(s){
  return replacePolishQuotes(s).replace(/\s+/g, " ").trim();
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
  return String(s ?? "").replace(/{{\/?(?:RED|B|I|S)}}/g, "");
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

function isVehicleSheet(name){
  return VEHICLE_SHEET_KEYS.has(canonKey(name));
}

function isBestiarySheet(name){
  return canonKey(name) === canonKey("Bestiariusz");
}

function shouldShowRowInCurrentSystemView(row, sheetName){
  // Rekordy old są ukrywane systemowo tylko w Bestiariuszu, zanim zadziałają filtry użytkownika / Old rows are system-hidden only in Bestiary, before user filters run
  if (isBestiarySheet(sheetName) && isOldStatusRow(row) && !showOldBestiaryEntries) return false;
  return true;
}

function getSystemVisibleRows(sheetName){
  const rows = DB?.sheets?.[sheetName] || [];
  return rows.filter(row => shouldShowRowInCurrentSystemView(row, sheetName));
}

function pruneHiddenOldBestiarySelection(){
  if (!isBestiarySheet(currentSheet) || showOldBestiaryEntries || !view?.selected) return;
  const rows = DB?.sheets?.[currentSheet] || [];
  const hiddenOldIds = new Set(rows.filter(isOldStatusRow).map(row => row.__id));
  for (const id of [...view.selected]){
    if (hiddenOldIds.has(id)) view.selected.delete(id);
  }
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
  const rows = getSystemVisibleRows(sheetName);
  const cols = inferColumns(DB?.sheets?.[sheetName] || [], sheetName);
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
          const allowed = new Set(uniqueValuesForColumnFromRows(getSystemVisibleRows(sheetName), col));
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
      uiState.showVehicleTabs = Boolean(parsed.toggles.showVehicleTabs);
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
  if (mode === "default"){
    showOldBestiaryEntries = false;
    if (els.toggleOldBestiaryEntries) els.toggleOldBestiaryEntries.checked = false;
  }
  pruneHiddenOldBestiarySelection();
  restoreSheetView(currentSheet);
  if (els.global) els.global.value = view.global || "";
  updateSortMarks();
  renderBody();
  saveSessionState();
}

/* ---------- Rich text formatting ---------- */
/* Highlights:
 - references in parentheses containing "str.", "str", "strona", "page", or "p."
 - lines beginning with "*[cyfra]" (rendered jaśniejszym fontem, gwiazdka jest widoczna)
 - keeps newlines
*/
function formatInlineHTML(raw){
  const s = String(raw ?? "");
  // --- Wykrywanie odnośników do stron w PL i EN / Detect page references in PL and EN ---
  const reRefParen = /\(([^)]*(?:\bstr\.?\b|\bstr\b|\bstrona\b|\bpage\b|\bp\.)[^)]*)\)/ig;
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
  // Zmienna wyniku dopasowania musi być zadeklarowana, inaczej w trybie swobodnym powstaje zmienna
  // globalna, a w module ES ten sam zapis rzuca ReferenceError i formatowanie komórek przestaje działać.
  // The match variable must be declared; in sloppy mode it would silently become a global, and in an
  // ES module the same code throws a ReferenceError and cell formatting stops working.
  let m;
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
      if (styles?.has("S")) classes.push("inline-strike");
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
    if (styles?.has("S")) styleClasses.push("inline-strike");

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
  const markerRegex = /{{\/?(?:RED|B|I|S)}}/g;
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
    const name = token.includes("RED")
      ? "RED"
      : token.includes("B")
        ? "B"
        : token.includes("I")
          ? "I"
          : "S";
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

function isOldStatusRow(row){
  if (!row || typeof row !== "object") return false;
  const statusKey = Object.keys(row).find((key)=>{
    const normKey = String(key ?? "").trim().toLowerCase();
    return normKey === "stan";
  });
  if (!statusKey) return false;
  const value = stripMarkers(String(row[statusKey] ?? "")).trim().toLowerCase();
  return value === STATUS_OLD_VALUE;
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
  const isAscensionPackageKeyword = sheetName === "Pakiety Wyniesienia" && col === "Słowa Kluczowe";
  const isFactionKeyword = sheetName === "Słowa Kluczowe Frakcji" && col === "Słowo Kluczowe";

  if (isKeywordName){
    return formatKeywordHTML(row, col);
  }
  if (isFactionKeyword){
    return formatFactionKeywordHTML(row[col]);
  }
  if (isAscensionPackageKeyword){
    return getFormattedCellHTML(row, col);
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
  if (name === "Bronie" || name === "Bronie Pojazdów"){
    // Kolejnosc scalania musi byc taka sama jak w build_json.py: najpierw zasieg, potem cechy.
    // Obie operacje usuwaja swoje kolumny zrodlowe i dopisuja scalona na koncu rekordu, wiec kolejnosc
    // wywolan decyduje o kolejnosci pol w zapisanym rekordzie. Bez tego oba sposoby generowania
    // data.json daja pliki, ktorych nie da sie porownac zwyklym porownaniem plikow.
    // The merge order must match build_json.py: range first, then traits. Both operations remove their
    // source columns and append the merged one at the end of the record, so the call order decides the
    // field order in the stored record. Without this, the two ways of generating data.json produce files
    // that cannot be compared with a plain file diff.
    out = out.map(r => mergeTraits(mergeRange(r)));
  }
  if (name === "Pancerze" || name === "Pojazdy"){
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
function assertDataVaultShape(data){
  if (!data || typeof data !== "object") throw new Error("DATAVAULT_DATA_NOT_OBJECT");
  if (!data.sheets || typeof data.sheets !== "object") throw new Error("DATAVAULT_DATA_MISSING_SHEETS");
}

async function getFirebaseApi(){
  if (window.DataVaultFirebaseReady) return window.DataVaultFirebaseReady;
  await new Promise((resolve, reject)=>{
    const timeout = setTimeout(()=>reject(new Error("FIREBASE_LOADER_NOT_READY")), 8000);
    window.addEventListener("datavault-firebase-loader-ready", ()=>{ clearTimeout(timeout); resolve(); }, { once: true });
  });
  if (!window.DataVaultFirebaseReady) throw new Error("FIREBASE_LOADER_NOT_READY");
  return window.DataVaultFirebaseReady;
}

async function loadPrivateDataFromFirebase(){
  const firebaseApi = await getFirebaseApi();
  setStatus(translations[currentLanguage].messages.statusLoadJson);
  const data = await firebaseApi.loadDataVaultLive();
  assertDataVaultShape(data);
  DB = normaliseDB(data);
  const restored = loadSessionState();
  if (!restored){
    for (const sheetName of Object.keys(DB.sheets || {})){ applyDefaultViewForSheet(sheetName); }
  }
  initUI();
  saveSessionState();
  setStatus(translations[currentLanguage].messages.statusLoadOk);
}
function showAccessGate(message=""){ if (els.accessGate) els.accessGate.hidden=false; if (els.accessError) els.accessError.textContent=message; }
function hideAccessGate(){ if (els.accessGate) els.accessGate.hidden=true; if (els.accessError) els.accessError.textContent=""; if (els.accessPassword) els.accessPassword.value=""; }
function clearRuntimeData(){ DB=null; currentSheet=null; if (els.tabs) els.tabs.innerHTML=""; if (els.wrap) els.wrap.innerHTML=`<div class="emptyState"><div class="emptyTitle">${translations[currentLanguage].labels.emptyTitle}</div><div class="emptyText">${translations[currentLanguage].labels.emptyText}</div></div>`; }
async function startPrivateDataFlow(){ let firebaseApi; try{ firebaseApi = await getFirebaseApi(); await firebaseApi.initFirebaseDataAccess(); const user=await firebaseApi.waitForAuthReady(); if(!user){ clearRuntimeData(); showAccessGate(); return; } hideAccessGate(); await loadPrivateDataFromFirebase(); }catch(error){ clearRuntimeData(); const message = firebaseApi && firebaseApi.getReadableAccessError ? firebaseApi.getReadableAccessError(error,currentLanguage) : String(error && error.message ? error.message : error); showAccessGate(message); setStatus(message); logLine("BŁĄD FIREBASE: " + message, true); }}

function buildDataJsonFromSheets(rawSheets, opts = {}){
  const {sheetOrder = null, columnOrder = null} = opts;
  const sheets = {};
  const traits = {};
  const states = {};
  const vehicleTraits = {};
  const vehicleWeaponTraits = {};
  const vehicleStates = {};

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
    if (name === "Stany Pojazdów"){
      for (const row of rows){
        const stateName = norm(row?.Nazwa);
        const desc = String(row?.Opis ?? row?.Efekt ?? "").trim();
        if (stateName && desc){
          vehicleStates[stateName] = desc;
        }
      }
    }
    if (name === "Cechy Pojazdów"){
      for (const row of rows){
        const traitName = norm(row?.Nazwa);
        const desc = String(row?.Opis ?? "").trim();
        const type = norm(row?.Typ);
        if (traitName && desc && type === "Cecha Pojazdu") vehicleTraits[traitName] = desc;
        if (traitName && desc && type === "Cecha Broni Pojazdu") vehicleWeaponTraits[traitName] = desc;
      }
    }

    let processed = rows.map(r => ({...r}));
    if (name === "Bronie" || name === "Bronie Pojazdów"){
      processed = processed.map(r => mergeTraits(mergeRange(r)));
    } else if (name === "Pancerze" || name === "Pojazdy"){
      processed = processed.map(r => mergeTraits(r));
    }
    sheets[name] = processed;
  }

  const resolvedSheetOrder = Array.isArray(sheetOrder) ? sheetOrder : Object.keys(rawSheets);
  const resolvedColumnOrder = columnOrder && typeof columnOrder === "object" ? columnOrder : {};
  return {sheets, _meta:{traits, states, vehicleTraits, vehicleWeaponTraits, vehicleStates, sheetOrder: resolvedSheetOrder, columnOrder: resolvedColumnOrder}};
}

// --- Funkcja pobierająca dowolny plik JSON jako bezpieczny artefakt roboczy / Function that downloads any JSON file as a safe working artifact ---
function downloadJsonFile(filename, objectToDownload){
  const jsonText = JSON.stringify(objectToDownload, null, 2);
  const blob = new Blob([jsonText], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// --- Budowanie root-ready importu Firebase dla ścieżki /datavault/live / Build a root-ready Firebase import for the /datavault/live path ---
function buildFirebaseImportJson(dataJsonObject){
  return {
    datavault: {
      live: {
        schemaVersion: "datavault-firebase-import-v1",
        createdAt: new Date().toISOString(),
        source: "Repozytorium.xlsx",
        dataJson: JSON.stringify(dataJsonObject),
      },
    },
  };
}

// --- Sprawdzenie bezpiecznego obiektu Firebase bez zaglądania do kluczy wewnątrz dataJson-string / Check a safe Firebase object without inspecting keys inside the dataJson string ---
function assertFirebaseImportNode(node, label){
  if (!node || typeof node !== "object" || Array.isArray(node)){
    throw new Error(`firebase-import.json ${label} must be an object`);
  }

  // Firebase Realtime Database odrzuca puste klucze i znaki . $ # [ ] /, więc sprawdzamy tylko prawdziwe klucze drzewa importu.
  // Firebase Realtime Database rejects empty keys and . $ # [ ] / characters, so only real import-tree keys are checked.
  const forbidden = /[.$#[\]\/]/;
  for (const key of Object.keys(node)){
    if (!key || forbidden.test(key)){
      throw new Error(`firebase-import.json contains an invalid Firebase key at ${label}: ${key}`);
    }
  }
}

// --- Walidacja root-ready importu Firebase bez dotykania kluczy wewnątrz dataJson-string / Validate root-ready Firebase import without touching keys inside dataJson string ---
function validateFirebaseImportObject(firebaseImportObject, originalData){
  assertFirebaseImportNode(firebaseImportObject, "root");

  const rootKeys = Object.keys(firebaseImportObject);
  if (rootKeys.length !== 1 || !Object.prototype.hasOwnProperty.call(firebaseImportObject, "datavault")){
    throw new Error("firebase-import.json root must contain only the datavault key");
  }

  assertFirebaseImportNode(firebaseImportObject.datavault, "datavault");
  const datavaultKeys = Object.keys(firebaseImportObject.datavault);
  if (datavaultKeys.length !== 1 || !Object.prototype.hasOwnProperty.call(firebaseImportObject.datavault, "live")){
    throw new Error("firebase-import.json datavault node must contain only the live key");
  }

  const payload = firebaseImportObject.datavault.live;
  assertFirebaseImportNode(payload, "datavault/live");
  if (payload.schemaVersion !== "datavault-firebase-import-v1"){
    throw new Error("firebase-import.json payload schemaVersion is invalid");
  }
  if (typeof payload.dataJson !== "string"){
    throw new Error("firebase-import.json payload dataJson must be a string");
  }
  const restored = JSON.parse(payload.dataJson);
  if (JSON.stringify(restored) !== JSON.stringify(originalData)){
    throw new Error("firebase-import.json round-trip validation failed");
  }
}

// --- Wybór lokalnego pliku XLSX przez systemowe okno dialogowe / Select local XLSX file through a system file picker ---
async function pickLocalWorkbookFile(){
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xlsm,.xls";
    input.style.display = "none";
    input.addEventListener("change", async () => {
      try{
        const file = input.files && input.files[0];
        if (!file){
          reject(new Error("No workbook selected"));
          return;
        }
        const buffer = await file.arrayBuffer();
        resolve(buffer);
      }catch(err){ reject(err); }
      finally { input.remove(); }
    }, {once:true});
    document.body.appendChild(input);
    input.click();
  });
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
        const xlsxBuffer = await pickLocalWorkbookFile();
        const {sheets: rawSheets, sheetOrder, columnOrder} = await window.XlsxCanonicalParser.loadXlsxMinimal(xlsxBuffer);
        const data = buildDataJsonFromSheets(rawSheets, {sheetOrder, columnOrder});
        const firebaseImportObject = buildFirebaseImportJson(data);
        validateFirebaseImportObject(firebaseImportObject, data);
        downloadJsonFile("data.json", data);
        setTimeout(() => downloadJsonFile("firebase-import.json", firebaseImportObject), 150);
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
  const vehicleTraits = meta.vehicleTraits || {};
  const vehicleWeaponTraits = meta.vehicleWeaponTraits || {};
  const vehicleStates = meta.vehicleStates || {};
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
  const vehicleTraitIndex = {};
  for (const [k,v] of Object.entries(vehicleTraits)){ vehicleTraitIndex[canonKey(k)] = v; vehicleTraitIndex[canonKey(k).replace(/\s+/g,"")] = v; }
  const vehicleWeaponTraitIndex = {};
  for (const [k,v] of Object.entries(vehicleWeaponTraits)){ vehicleWeaponTraitIndex[canonKey(k)] = v; vehicleWeaponTraitIndex[canonKey(k).replace(/\s+/g,"")] = v; }
  const vehicleStateIndex = {};
  for (const [k,v] of Object.entries(vehicleStates)){ vehicleStateIndex[canonKey(k)] = v; }
  return {sheets, _meta:{traits, states, vehicleTraits, vehicleWeaponTraits, vehicleStates, traitIndex, stateIndex, vehicleTraitIndex, vehicleWeaponTraitIndex, vehicleStateIndex, sheetOrder, columnOrder}};
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
  visibleSheets = uiState.showVehicleTabs
    ? visibleSheets
    : visibleSheets.filter(name => !isVehicleSheet(name));
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
    if (isVehicleSheet(name)){
      b.classList.add("tab--vehicle");
    }
    b.addEventListener("click", ()=>selectSheet(name));
    els.tabs.appendChild(b);
  }
  // select first
  const preferredStartSheet = ADMIN_MODE ? "Notatki" : "Bronie";
  const fallbackSheet = visibleOrder[0] || visibleSheets[0];
  const nextSheet = visibleOrder.includes(currentSheet)
    ? currentSheet
    : (visibleOrder.includes(preferredStartSheet) ? preferredStartSheet : fallbackSheet);
  if (nextSheet) selectSheet(nextSheet);

  if (els.toggleBestiaryOldGroup){
    els.toggleBestiaryOldGroup.hidden = !ADMIN_MODE;
  }
  if (els.toggleOldBestiaryEntries){
    els.toggleOldBestiaryEntries.checked = showOldBestiaryEntries;
  }
  if (els.toggleCharacterTabs){
    els.toggleCharacterTabs.checked = uiState.showCharacterTabs;
  }
  if (els.toggleCombatTabs){
    els.toggleCombatTabs.checked = uiState.showCombatTabs;
  }
  if (els.toggleVehicleTabs){
    els.toggleVehicleTabs.checked = uiState.showVehicleTabs;
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
    // Pole odtwarza zapisany filtr, inaczej po powrocie na zakładkę filtr działa, ale pole jest puste.
    // The field restores the saved filter; otherwise the filter works after returning to a sheet
    // while the field looks empty.
    input.value = String(view.filtersText?.[col] ?? "");
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
  const rows = getSystemVisibleRows(currentSheet);
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

function renderBody(){
  if (!DB || !currentSheet || !tbodyEl) return;
  const rowsAll = getSystemVisibleRows(currentSheet);
  const cols = DB.sheets[currentSheet]._cols || inferColumns(DB.sheets[currentSheet] || [], currentSheet);
  pruneHiddenOldBestiarySelection();
  updateFilterIndicators();

  const filtered = sortRows(rowsAll.filter(r => passesFilters(r, cols)));
  const token = ++renderToken;

  updateSheetTools(filtered.length, rowsAll.length);

  if (!filtered.length){
    tbodyEl.innerHTML = `<tr><td colspan="${cols.length + 1}" class="emptyState"><div class="emptyTitle">${translations[currentLanguage].labels.resultsEmptyTitle}</div><div class="emptyText">${translations[currentLanguage].labels.resultsEmptyText}</div></td></tr>`;
    els.btnCompare.disabled = true;
    return;
  }

  // Plan rysowania: na telefonie lista kart jest podzielona na zwijane grupy, więc zamiast samych
  // wierszy przechodzimy po elementach, z których część to nagłówki grup.
  // Render plan: on a phone the card list is split into collapsible groups, so instead of plain rows
  // we walk a list of items, some of which are group headers.
  const plan = buildRenderPlan(filtered, cols);

  tbodyEl.innerHTML = "";
  let idx = 0;

  function renderChunk(){
    if (token !== renderToken) return;
    const frag = document.createDocumentFragment();

    for (let n = 0; n < RENDER_CHUNK_SIZE && idx < plan.length; n++, idx++){
      const item = plan[idx];
      frag.appendChild(item.group ? renderGroupHeader(item.group, cols) : renderRow(item.row, cols, item.inGroup));
    }

    tbodyEl.appendChild(frag);

    if (idx < plan.length){
      requestAnimationFrame(renderChunk);
    } else {
      els.btnCompare.disabled = view.selected.size < 2;
    }
  }

  renderChunk();
}

function renderRow(r, cols, inGroup = false){
  const tr = document.createElement("tr");
  tr.classList.toggle("inGroup", Boolean(inGroup));
  tr.classList.toggle("row-selected", view.selected.has(r.__id));
  const oldBestiaryRow = isBestiarySheet(currentSheet) && isOldStatusRow(r);
  tr.classList.toggle("row-old", isOldStatusRow(r));
  tr.classList.toggle("row-old--bestiary", oldBestiaryRow);

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
    // W Bestiariuszu wyróżniamy tylko tożsamość starego wpisu: Nazwa i Typ / In Bestiary only the old entry identity is highlighted: Name and Type
    if (oldBestiaryRow && ["nazwa", "typ"].includes(canonKey(col))){
      td.classList.add("bestiary-old-identity");
    }

    if (col === "Cechy"){
      td.appendChild(renderTraitsCell(r[col]));
    } else if (col === "Zasięg"){
      td.innerHTML = `<div class="celltext">${getFormattedCellHTML(r, col)}</div>`;
    } else {
      const div = document.createElement("div");
      div.className = "celltext";

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
function resolveTrait(traitText, sheetName = currentSheet){
  const meta = DB?._meta || {};
  const traitIndex = meta.traitIndex || {};
  const stateIndex = meta.stateIndex || {};
  const vehicleTraitIndex = meta.vehicleTraitIndex || {};
  const vehicleWeaponTraitIndex = meta.vehicleWeaponTraitIndex || {};
  const vehicleStateIndex = meta.vehicleStateIndex || {};

  const t = norm(traitText);

  // 1) Wywołanie: Zatrucie (5) / Wywołanie (Zatrucie (5))
  const mCall = t.match(/^Wywołanie\s*(?::|\()\s*(.+)\s*$/i);
  if (mCall){
    const usesParen = /^Wywołanie\s*\(/i.test(t);
    let stRaw = norm(mCall[1]);
    if (usesParen && stRaw.endsWith(")")){
      stRaw = stRaw.slice(0, -1).trim();
    }
    const mLvl = stRaw.match(/^(.*)\s*\((\d+)\)\s*$/) || stRaw.match(/^(Zatrucie)\s+(\d+)\s*$/i);
    const stateKeyFull = mLvl ? `${norm(mLvl[1])} (${mLvl[2]})` : stRaw;
    const stateKeyBase = mLvl ? norm(mLvl[1]) : stRaw;

    const traitTextTpl = "Wywołanie (Stan)";
    const traitDesc = traitIndex[canonKey(traitTextTpl)] || traitIndex[canonKey("Wywołanie(Stan)")] || null;

    const stDesc = vehicleStateIndex[canonKey(stateKeyFull)] || vehicleStateIndex[canonKey(stateKeyBase)] || stateIndex[canonKey(stateKeyFull)] || stateIndex[canonKey(stateKeyBase)] || null;

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
  const mNum = t.match(/^(.*?)(\s*)\(([^)]+)\)\s*$/);
  if (mNum){
    const baseName = norm(mNum[1]);
    const key1 = canonKey(`${baseName} (X)`);
    const key2 = canonKey(`${baseName}(X)`);
    const preferredTraitIndex = sheetName === "Pojazdy" ? vehicleTraitIndex : (sheetName === "Bronie Pojazdów" ? vehicleWeaponTraitIndex : traitIndex);
    const desc = preferredTraitIndex[key1] || preferredTraitIndex[key2] || (sheetName === "Bronie Pojazdów" ? (traitIndex[key1] || traitIndex[key2]) : null) || null;
    if (desc){
      return {title: t, blocks:[{label: translations[currentLanguage].messages.traitLabel, text: desc}]};
    }
  }

  // 3) Exact match
  const preferredTraitIndex = sheetName === "Pojazdy" ? vehicleTraitIndex : (sheetName === "Bronie Pojazdów" ? vehicleWeaponTraitIndex : traitIndex);
  const desc = preferredTraitIndex[canonKey(t)] || preferredTraitIndex[canonKey(t).replace(/\s+/g,"")] || (sheetName === "Bronie Pojazdów" ? (traitIndex[canonKey(t)] || traitIndex[canonKey(t).replace(/\s+/g,"")]) : null) || null;
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

function openTraitPopover(traitText, sheetName = currentSheet){
  const r = resolveTrait(traitText, sheetName);
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
function openModal(html){
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
    htmlRows.push(`
      <tr>
        <th>${escapeHtml(col)}</th>
        ${rows.map(r => `<td>${col==="Cechy" ? escapeHtml(String(r[col]||"")) : formatDataCellHTML(r, col, currentSheet)}</td>`).join("")}
      </tr>`);
  }
  // Klasa compareTable daje tabeli odstępy wewnętrzne, linie między wierszami i naprzemienne tła.
  // Bez niej sąsiednie kolumny dzieli domyślne 2 px i napisy sklejają się w jeden ciąg znaków.
  // The compareTable class gives the table cell padding, row separators and alternating backgrounds.
  // Without it neighbouring columns are 2 px apart by default and their texts run together.
  const html = `<div style="overflow:auto; max-height:70vh">
    <table class="compareTable">
      <thead><tr><th>${translations[currentLanguage].labels.comparisonField}</th>${rows
        .map((_, i) => `<th>${translations[currentLanguage].labels.comparisonRecord} ${i + 1}</th>`)
        .join("")}</tr></thead>
      <tbody>${htmlRows.join("")}</tbody>
    </table>
  </div>`;
  openModal(html);
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

if (els.toggleOldBestiaryEntries){
  els.toggleOldBestiaryEntries.checked = showOldBestiaryEntries;
  els.toggleOldBestiaryEntries.addEventListener("change", ()=>{
    showOldBestiaryEntries = ADMIN_MODE && els.toggleOldBestiaryEntries.checked;
    if (!showOldBestiaryEntries) pruneHiddenOldBestiarySelection();
    if (isFilterMenuOpen()) closeFilterMenu();
    renderBody();
    updateFilterIndicators();
    saveSessionState();
  });
}

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
if (els.toggleVehicleTabs){
  els.toggleVehicleTabs.addEventListener("change", ()=>{
    uiState.showVehicleTabs = els.toggleVehicleTabs.checked;
    initUI();
    saveSessionState();
  });
  uiState.showVehicleTabs = els.toggleVehicleTabs.checked;
}

if (els.languageSelect){
  els.languageSelect.addEventListener("change", (event)=>{
    applyLanguage(event.target.value);
    saveSessionState();
  });
}

applyLanguage(currentLanguage);


/* ===================================================================================
   PASEK NARZĘDZI ZAKŁADKI, GRUPOWANIE KART, MODAL FILTRÓW I ARKUSZ SORTOWANIA
   PER-SHEET TOOLBAR, CARD GROUPING, FILTER MODAL AND SORT SHEET

   PL: W układzie kart (telefon, szerokość do 720 px) nagłówek tabeli jest ukryty, a razem z nim
   znikają jedyne sterowniki filtrów i sortowania. Wszystko poniżej jest drugim wejściem do tego
   samego stanu `view`, z którego korzysta nagłówek na komputerze — funkcje passesFilters(),
   sortRows() i konfiguracja DEFAULT_VIEW_CONFIG pozostają nietknięte, więc nie powstaje druga,
   rozjeżdżająca się ścieżka filtrowania.
   EN: In the card layout (phone, up to 720 px wide) the table header is hidden, and with it the only
   filter and sort controls. Everything below is a second entry point into the same `view` state the
   desktop header uses — passesFilters(), sortRows() and the DEFAULT_VIEW_CONFIG stay untouched, so
   no second, diverging filtering path is created.
   =================================================================================== */

const CARD_LAYOUT_QUERY = "(max-width: 720px)";
// Poniżej tylu wierszy grupowanie nic nie daje i tylko dokłada klikania.
// Below this many rows grouping gains nothing and only adds taps.
const GROUPING_MIN_ROWS = 12;
// Gdy wyszukiwanie zawęzi listę do tylu wierszy, grupy z trafieniami rozwijają się same — po to się
// szuka. Przy szerokim zapytaniu, które niczego nie zawęża, zostaje przegląd kategorii.
// When the search narrows the list to at most this many rows, the groups holding matches expand on
// their own — that is the point of searching. A broad query that narrows nothing keeps the overview.
const GROUPING_AUTO_EXPAND_MAX = 40;

// Rozwinięte grupy nie trafiają do sessionStorage: po odświeżeniu zakładka ma zacząć od zwiniętej
// listy kategorii, bo to jest cel grupowania.
// Expanded groups are not persisted: after a refresh a sheet should start from the collapsed list of
// categories, which is the whole point of grouping.
const expandedGroupsBySheet = {};

function isCardLayout(){
  return window.matchMedia(CARD_LAYOUT_QUERY).matches;
}

function expandedGroupsFor(sheetName){
  if (!expandedGroupsBySheet[sheetName]) expandedGroupsBySheet[sheetName] = new Set();
  return expandedGroupsBySheet[sheetName];
}

// Podstawianie wartości w komunikatach słownika: "{shown} z {total}" -> "16 z 130".
// Value substitution in dictionary messages: "{shown} of {total}" -> "16 of 130".
function formatMessage(template, values){
  return String(template).replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}

/* ---------- Grupowanie kart / Card grouping ---------- */

// Kolumny grupującej nie trzeba konfigurować osobno: DEFAULT_VIEW_CONFIG już wskazuje po jednej
// kolumnie na zakładkę — tę, na której działa widok domyślny, czyli tę dzielącą dane na kategorie.
// Zakładki bez wpisu w konfiguracji dostają "Typ" albo "Rodzaj", jeżeli takie kolumny mają.
// The grouping column needs no separate configuration: DEFAULT_VIEW_CONFIG already designates one
// column per sheet — the one the default view filters on, i.e. the one splitting the data into
// categories. Sheets with no entry fall back to "Typ" or "Rodzaj" when they have such a column.
function groupingColumnFor(sheetName, cols){
  const config = getDefaultConfigForSheet(sheetName);
  if (config){
    const configured = cols.find(col => canonKey(col) in config);
    if (configured) return configured;
  }
  return cols.find(col => canonKey(col) === canonKey("Typ"))
      || cols.find(col => canonKey(col) === canonKey("Rodzaj"))
      || null;
}

function buildRenderPlan(filtered, cols){
  const flat = filtered.map(row => ({row}));
  if (!isCardLayout() || filtered.length < GROUPING_MIN_ROWS) return flat;

  const groupCol = groupingColumnFor(currentSheet, cols);
  if (!groupCol) return flat;

  // Grupy powstają PO przefiltrowaniu i posortowaniu, więc kolejność grup idzie za sortowaniem,
  // a wiersze wewnątrz grupy zachowują kolejność z sortRows().
  // Groups are built AFTER filtering and sorting, so their order follows the sorting and the rows
  // inside a group keep the order sortRows() gave them.
  const emptyLabel = translations[currentLanguage].messages.groupEmpty;
  const groups = new Map();
  for (const row of filtered){
    const key = String(row[groupCol] ?? "").trim() || emptyLabel;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  if (groups.size < 2) return flat;

  const expanded = expandedGroupsFor(currentSheet);
  const searching = Boolean(String(view.global || "").trim());
  const autoExpand = searching && filtered.length <= GROUPING_AUTO_EXPAND_MAX;
  const plan = [];
  for (const [name, rows] of groups){
    const open = autoExpand || expanded.has(name);
    plan.push({group:{
      name,
      rows: rows.length,
      open,
      hasSelection: rows.some(row => view.selected.has(row.__id)),
    }});
    if (open){
      for (const row of rows) plan.push({row, inGroup:true});
    }
  }
  return plan;
}

function renderGroupHeader(group, cols){
  const messages = translations[currentLanguage].messages;
  const tr = document.createElement("tr");
  tr.className = "groupRow";

  const td = document.createElement("td");
  td.colSpan = cols.length + 1;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "groupHead";
  button.setAttribute("aria-expanded", group.open ? "true" : "false");
  button.title = group.open ? messages.collapseGroup : messages.expandGroup;

  const caret = document.createElement("span");
  caret.className = "groupCaret";
  caret.textContent = group.open ? "▾" : "▸";
  button.appendChild(caret);

  const name = document.createElement("span");
  name.textContent = stripMarkers(group.name);
  button.appendChild(name);

  // Zwinięta grupa ukrywa zaznaczone wiersze, więc nagłówek musi o nich powiedzieć.
  // A collapsed group hides selected rows, so the header has to say they are there.
  if (group.hasSelection){
    const mark = document.createElement("span");
    mark.className = "groupMark";
    mark.textContent = "✓";
    mark.title = messages.groupSelected;
    button.appendChild(mark);
  }

  const count = document.createElement("span");
  count.className = "groupCount";
  count.textContent = formatMessage(messages.groupCount, {count: group.rows});
  button.appendChild(count);

  button.addEventListener("click", ()=>{
    const expanded = expandedGroupsFor(currentSheet);
    if (expanded.has(group.name)) expanded.delete(group.name); else expanded.add(group.name);
    renderBody();
  });

  td.appendChild(button);
  tr.appendChild(td);
  return tr;
}

/* ---------- Pasek narzędzi zakładki / Per-sheet toolbar ---------- */

function updateSheetTools(shown, total){
  const messages = translations[currentLanguage].messages;
  if (els.rowCount) els.rowCount.textContent = formatMessage(messages.rowCount, {shown, total});
  if (els.quickSearch && els.quickSearch.value !== (view.global || "")) els.quickSearch.value = view.global || "";
  renderActiveChips();
}

function makeChip(label, isDefault, onDrop){
  const messages = translations[currentLanguage].messages;
  const chip = document.createElement("span");
  chip.className = isDefault ? "chip chip--default" : "chip";
  const text = document.createElement("span");
  text.textContent = label;
  chip.appendChild(text);
  const drop = document.createElement("button");
  drop.type = "button";
  drop.className = "chipDrop";
  drop.textContent = "✕";
  drop.title = messages.dropFilter;
  drop.setAttribute("aria-label", `${messages.dropFilter}: ${label}`);
  drop.addEventListener("click", onDrop);
  chip.appendChild(drop);
  return chip;
}

// Żetony są jedyną informacją o tym, co jest odfiltrowane, gdy nagłówek tabeli jest ukryty —
// i jedynym sposobem, żeby zdjąć pojedynczy filtr bez kasowania reszty widoku.
// The chips are the only sign of what is filtered out while the table header is hidden — and the
// only way to drop a single filter without wiping the rest of the view.
function renderActiveChips(){
  if (!els.activeChips) return;
  const messages = translations[currentLanguage].messages;
  els.activeChips.innerHTML = "";
  if (!DB || !currentSheet){
    if (els.filtersBadge){ els.filtersBadge.textContent = ""; els.filtersBadge.classList.remove("is-on"); }
    return;
  }

  const cols = DB.sheets[currentSheet]?._cols || [];
  const defaults = getDefaultConfigForSheet(currentSheet);
  let activeFilters = 0;

  const search = String(view.global || "").trim();
  if (search){
    els.activeChips.appendChild(makeChip(formatMessage(messages.chipSearch, {text: search}), false, ()=>{
      view.global = "";
      if (els.global) els.global.value = "";
      if (els.quickSearch) els.quickSearch.value = "";
      renderBody();
      saveSessionState();
    }));
  }

  for (const col of cols){
    const text = String(view.filtersText?.[col] ?? "").trim();
    if (text){
      activeFilters++;
      els.activeChips.appendChild(makeChip(formatMessage(messages.chipText, {col, text}), false, ()=>{
        view.filtersText[col] = "";
        syncColumnFilterInput(col, "");
        renderBody();
        saveSessionState();
      }));
    }
    const set = view.filtersSet?.[col];
    if (!(set instanceof Set)) continue;
    const total = uniqueValuesForColumn(col).length;
    if (set.size >= total) continue;
    activeFilters++;
    const fromDefaults = Boolean(defaults && canonKey(col) in defaults);
    els.activeChips.appendChild(makeChip(
      formatMessage(fromDefaults ? messages.chipDefault : messages.chipValues, {col, shown:set.size, total}),
      fromDefaults,
      ()=>{
        view.filtersSet[col] = null;
        renderBody();
        saveSessionState();
      }));
  }

  if (els.filtersBadge){
    els.filtersBadge.textContent = activeFilters ? String(activeFilters) : "";
    els.filtersBadge.classList.toggle("is-on", activeFilters > 0);
  }
}

// Zdjęcie filtra żetonem musi być widoczne także w polu w nagłówku tabeli.
// Dropping a filter with a chip has to show in the field in the table header too.
function syncColumnFilterInput(col, value){
  if (!tableEl) return;
  const input = tableEl.querySelector(`thead tr:nth-child(2) th[data-col="${CSS.escape(col)}"] .input`);
  if (input) input.value = value;
}

/* ---------- Modal filtrów / Filter modal ---------- */

// Kopia robocza filtrów. Modal zmienia wyłącznie ją; dopiero „Zatwierdź” przepisuje ją do stanu
// widoku i jeden raz przerysowuje listę. Przy filtrowaniu na żywo każde stuknięcie kosztowało pełną
// przebudowę wszystkich wierszy — na Bestiariuszu setki milisekund, mimo że lista i tak jest wtedy
// zasłonięta przez modal.
// A working copy of the filters. The modal edits only this; "Apply" writes it into the view state and
// redraws the list once. With live filtering every tap cost a full rebuild of all rows — hundreds of
// milliseconds on the Bestiary, even though the list is covered by the modal at that moment.
let filterDraft = null;

function draftFromView(){
  return {
    filtersText: {...view.filtersText},
    filtersSet: Object.fromEntries(
      Object.entries(view.filtersSet).map(([col, set]) => [col, set instanceof Set ? new Set(set) : null])
    ),
  };
}

// Widok domyślny w postaci samych filtrów — ta sama reguła, którą stosuje applyDefaultViewForSheet(),
// ale bez ruszania sortowania, zaznaczeń i wyszukiwania.
// The default view expressed as filters only — the same rule applyDefaultViewForSheet() applies, but
// without touching sorting, selection or the search.
function defaultFiltersForSheet(sheetName){
  const rows = getSystemVisibleRows(sheetName);
  const cols = inferColumns(DB?.sheets?.[sheetName] || [], sheetName);
  const config = getDefaultConfigForSheet(sheetName);
  const filtersSet = {};
  for (const col of cols){
    const cfg = config?.[canonKey(col)];
    if (!cfg) continue;
    const allValues = uniqueValuesForColumnFromRows(rows, col);
    const allowed = allValues.filter(value => cfg.includes(value));
    filtersSet[col] = allowed.length === allValues.length ? null : new Set(allowed);
  }
  return filtersSet;
}

// Policzenie trafień bez dotykania DOM: podmieniamy filtry na czas jednego przebiegu i zaraz
// przywracamy. To kosztuje ułamek milisekundy, więc podgląd może się odświeżać po każdym stuknięciu.
// Counting matches without touching the DOM: the filters are swapped for a single pass and restored
// right away. It costs a fraction of a millisecond, so the preview can refresh on every tap.
function countDraftMatches(){
  if (!DB || !currentSheet || !filterDraft) return {shown:0, total:0};
  const cols = DB.sheets[currentSheet]?._cols || [];
  const rows = getSystemVisibleRows(currentSheet);
  const previousText = view.filtersText;
  const previousSet = view.filtersSet;
  view.filtersText = filterDraft.filtersText;
  view.filtersSet = filterDraft.filtersSet;
  let shown = 0;
  for (const row of rows) if (passesFilters(row, cols)) shown++;
  view.filtersText = previousText;
  view.filtersSet = previousSet;
  return {shown, total: rows.length};
}

function refreshApplyLabel(){
  if (!els.filterModalApply) return;
  const {shown, total} = countDraftMatches();
  els.filterModalApply.textContent =
    formatMessage(translations[currentLanguage].messages.applyFilters, {shown, total});
}

function isFilterModalOpen(){
  return els.filterModal?.getAttribute("aria-hidden") === "false";
}

function openFilterModal(){
  if (!DB || !currentSheet || !els.filterModal) return;
  filterDraft = draftFromView();
  buildFilterModalBody();
  els.filterModal.setAttribute("aria-hidden", "false");
}

function closeFilterModal(){
  filterDraft = null;
  if (els.filterModal) els.filterModal.setAttribute("aria-hidden", "true");
  if (els.filterModalBody) els.filterModalBody.innerHTML = "";
}

function applyFilterModal(){
  if (!filterDraft) return closeFilterModal();
  view.filtersText = filterDraft.filtersText;
  view.filtersSet = filterDraft.filtersSet;
  // Pola w nagłówku tabeli muszą pokazać to, co ustawiono w modalu.
  // The fields in the table header have to show what the modal set.
  const cols = DB?.sheets?.[currentSheet]?._cols || [];
  for (const col of cols) syncColumnFilterInput(col, String(view.filtersText[col] ?? ""));
  closeFilterModal();
  renderBody();
  saveSessionState();
}

function buildFilterModalBody(){
  if (!els.filterModalBody) return;
  const t = translations[currentLanguage];
  const cols = DB.sheets[currentSheet]?._cols || [];

  if (els.filterModalTitle){
    els.filterModalTitle.textContent = `${t.messages.filterModalTitle} — ${currentSheet}`;
  }
  if (els.filterModalScope){
    els.filterModalScope.textContent = formatMessage(t.messages.filterModalScope, {count: cols.length});
  }

  els.filterModalBody.innerHTML = "";
  for (const col of cols) els.filterModalBody.appendChild(buildFilterModalColumn(col));
  refreshApplyLabel();
}

function buildFilterModalColumn(col){
  const t = translations[currentLanguage];
  const allValues = uniqueValuesForColumn(col);

  const box = document.createElement("div");
  box.className = "filterCol";

  const name = document.createElement("div");
  name.className = "filterColName";
  name.textContent = col;
  box.appendChild(name);

  const input = document.createElement("input");
  input.className = "input";
  input.placeholder = t.placeholders.columnTextFilter;
  input.value = String(filterDraft.filtersText[col] ?? "");
  input.addEventListener("input", ()=>{
    filterDraft.filtersText[col] = input.value;
    refreshApplyLabel();
  });
  input.addEventListener("keydown", event => event.stopPropagation());
  box.appendChild(input);

  // Listy wartości są zwinięte. Sama kolumna „Typ” w Broniach ma 19 wartości; wszystkie listy
  // rozwinięte naraz zrobiłyby z modalu listę dłuższą niż ta, którą filtrujemy.
  // The value lists start collapsed. The "Typ" column in Weapons alone has 19 values; every list
  // expanded at once would make the modal longer than the list being filtered.
  const summary = document.createElement("button");
  summary.type = "button";
  summary.className = "filterColValues";
  const summaryText = document.createElement("span");
  const caret = document.createElement("span");
  caret.className = "groupCaret";
  caret.textContent = "▸";
  summary.appendChild(summaryText);
  summary.appendChild(caret);
  box.appendChild(summary);

  const list = document.createElement("div");
  list.className = "filterColList";
  list.hidden = true;
  box.appendChild(list);

  function selectedValues(){
    const set = filterDraft.filtersSet[col];
    return set instanceof Set ? set : new Set(allValues);
  }

  function refreshSummary(){
    const selected = selectedValues();
    const isOn = selected.size < allValues.length;
    summaryText.textContent = isOn
      ? formatMessage(t.messages.someValues, {shown: selected.size, total: allValues.length})
      : t.messages.allValues;
    summary.classList.toggle("is-on", isOn);
  }

  function setSelection(next){
    filterDraft.filtersSet[col] = next.size === allValues.length ? null : new Set(next);
    refreshSummary();
    refreshApplyLabel();
  }

  function buildList(){
    list.innerHTML = "";
    const actions = document.createElement("div");
    actions.className = "filterColActions";
    const all = document.createElement("button");
    all.type = "button";
    all.className = "btn secondary";
    all.textContent = t.messages.selectAll;
    all.addEventListener("click", ()=>{ setSelection(new Set(allValues)); buildList(); });
    const none = document.createElement("button");
    none.type = "button";
    none.className = "btn secondary";
    none.textContent = t.messages.clearAll;
    none.addEventListener("click", ()=>{ setSelection(new Set()); buildList(); });
    actions.appendChild(all);
    actions.appendChild(none);
    list.appendChild(actions);

    const selected = selectedValues();
    const counts = valueCountsForColumn(col);
    for (const value of allValues){
      const row = document.createElement("label");
      row.className = "filterValue";
      const box2 = document.createElement("input");
      box2.type = "checkbox";
      box2.checked = selected.has(value);
      box2.addEventListener("change", ()=>{
        const next = selectedValues();
        if (box2.checked) next.add(value); else next.delete(value);
        setSelection(next);
      });
      const label = document.createElement("span");
      label.textContent = stripMarkers(value);
      const count = document.createElement("em");
      count.textContent = formatMessage(t.messages.groupCount, {count: counts.get(value) || 0});
      row.appendChild(box2);
      row.appendChild(label);
      row.appendChild(count);
      list.appendChild(row);
    }
  }

  summary.addEventListener("click", ()=>{
    const open = list.hidden;
    if (open) buildList();
    list.hidden = !open;
    caret.textContent = open ? "▾" : "▸";
  });

  refreshSummary();
  return box;
}

function valueCountsForColumn(col){
  const counts = new Map();
  for (const row of getSystemVisibleRows(currentSheet)){
    const key = String(row[col] ?? "").trim() || "-";
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

/* ---------- Arkusz sortowania / Sort sheet ---------- */

function isSortSheetOpen(){
  return els.sortSheet?.getAttribute("aria-hidden") === "false";
}

function openSortSheet(){
  if (!DB || !currentSheet || !els.sortSheet) return;
  buildSortSheetBody();
  els.sortSheet.setAttribute("aria-hidden", "false");
}

function closeSortSheet(){
  if (els.sortSheet) els.sortSheet.setAttribute("aria-hidden", "true");
  if (els.sortSheetBody) els.sortSheetBody.innerHTML = "";
}

function buildSortSheetBody(){
  if (!els.sortSheetBody) return;
  const messages = translations[currentLanguage].messages;
  const cols = DB.sheets[currentSheet]?._cols || [];
  els.sortSheetBody.innerHTML = "";

  for (const col of cols){
    const option = document.createElement("button");
    option.type = "button";
    option.className = "sortOption";
    const active = view.sort?.col === col;
    option.classList.toggle("is-on", active);

    const name = document.createElement("span");
    name.textContent = col;
    option.appendChild(name);

    const state = document.createElement("em");
    state.textContent = active
      ? (view.sort.dir === "desc" ? messages.sortDesc : messages.sortAsc)
      : messages.sortNone;
    option.appendChild(state);

    // toggleSort() cyklicznie przełącza rosnąco, malejąco i brak sortowania — dokładnie tak samo,
    // jak kliknięcie w nagłówek kolumny na komputerze.
    // toggleSort() cycles ascending, descending and no sorting — exactly like clicking a column
    // header on a desktop.
    option.addEventListener("click", ()=>{
      toggleSort(col);
      buildSortSheetBody();
    });

    els.sortSheetBody.appendChild(option);
  }
}

/* ---------- Podpięcie zdarzeń / Event wiring ---------- */

if (els.quickSearch){
  els.quickSearch.addEventListener("input", ()=>{
    view.global = els.quickSearch.value;
    if (els.global) els.global.value = view.global;
    renderBody();
    saveSessionState();
  });
  els.quickSearch.addEventListener("keydown", event => event.stopPropagation());
}

if (els.btnSheetFilters) els.btnSheetFilters.addEventListener("click", openFilterModal);
if (els.btnSheetSort) els.btnSheetSort.addEventListener("click", openSortSheet);
if (els.filterModalCancel) els.filterModalCancel.addEventListener("click", closeFilterModal);
if (els.filterModalApply) els.filterModalApply.addEventListener("click", applyFilterModal);
if (els.sortSheetClose) els.sortSheetClose.addEventListener("click", closeSortSheet);

if (els.filterModalDefaults){
  els.filterModalDefaults.addEventListener("click", ()=>{
    if (!filterDraft) return;
    filterDraft.filtersText = {};
    filterDraft.filtersSet = defaultFiltersForSheet(currentSheet);
    buildFilterModalBody();
  });
}

if (els.filterModalClear){
  els.filterModalClear.addEventListener("click", ()=>{
    if (!filterDraft) return;
    filterDraft.filtersText = {};
    filterDraft.filtersSet = {};
    buildFilterModalBody();
  });
}

// Stuknięcie w przyciemnione tło zamyka okno bez zatwierdzania — tak samo jak „Anuluj”.
// Tapping the dimmed backdrop closes the window without applying — the same as "Cancel".
if (els.filterModal){
  els.filterModal.addEventListener("click", event => { if (event.target === els.filterModal) closeFilterModal(); });
}
if (els.sortSheet){
  els.sortSheet.addEventListener("click", event => { if (event.target === els.sortSheet) closeSortSheet(); });
}

document.addEventListener("keydown", (event)=>{
  if (event.key !== "Escape") return;
  if (isFilterModalOpen()) closeFilterModal();
  if (isSortSheetOpen()) closeSortSheet();
});

// Przejście między układem tabeli a układem kart zmienia to, czy grupowanie w ogóle działa,
// więc lista musi powstać od nowa.
// Switching between the table layout and the card layout changes whether grouping applies at all,
// so the list has to be rebuilt.
if (window.matchMedia){
  const cardLayoutWatcher = window.matchMedia(CARD_LAYOUT_QUERY);
  const onLayoutChange = ()=>{ if (tbodyEl && currentSheet) renderBody(); };
  if (cardLayoutWatcher.addEventListener) cardLayoutWatcher.addEventListener("change", onLayoutChange);
  else if (cardLayoutWatcher.addListener) cardLayoutWatcher.addListener(onLayoutChange);
}

/* ---------- Loaders ---------- */
els.btnUpdateData.addEventListener("click", loadXlsxFromRepo);

/* ---------- Boot ---------- */
(async function boot(){
  logLine(`Tryb: ${ADMIN_MODE ? translations[currentLanguage].messages.modeAdmin : translations[currentLanguage].messages.modePlayer}`);
  // auto-load data.json (players)
  await startPrivateDataFlow();
})();

if (els.accessForm){ els.accessForm.addEventListener("submit", async (event)=>{ event.preventDefault(); let firebaseApi; try{ firebaseApi = await getFirebaseApi(); if (els.accessError) els.accessError.textContent=""; await firebaseApi.loginWithGroupPassword(els.accessPassword?.value||""); hideAccessGate(); await loadPrivateDataFromFirebase(); }catch(error){ const message = firebaseApi && firebaseApi.getReadableAccessError ? firebaseApi.getReadableAccessError(error,currentLanguage) : String(error && error.message ? error.message : error); showAccessGate(message); setStatus(message); logLine("BŁĄD LOGOWANIA FIREBASE: " + message, true); }});}

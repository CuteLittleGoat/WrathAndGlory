/* Administratum Data Vault — bez Tabulatora (zero zależności UI).
   Źródło danych: data.json (GitHub Pages) lub aktualizacja z Repozytorium.xlsx (admin).
*/
const SHEETS_ORDER = [
  "Bestiariusz",
  "Archetypy",
  "Cechy",
  "Stany",
  "Slowa_Kluczowe",
  "Talenty",
  "Modlitwy",
  "Psionika",
  "Augumentacje",
  "Ekwipunek",
  "Pancerze",
  "Bronie",
];

const SHEET_COLUMN_ORDER = {
  "Bestiariusz":["Nazwa","Zagrożenie","Słowa Kluczowe","S","Wt","Zr","I","SW","Int","Ogd","Odporność (w tym WP)","Wartość Pancerza","Obrona","Żywotność","Odporność Psychiczna","Umiejętności","Premie","Zdolności","Atak","Zdolności Hordy","Opcje Hordy","Upór","Odwaga","Szybkość","Rozmiar","Podręcznik","Strona"],
  "Archetypy":["Poziom","Frakcja","Nazwa","Podręcznik","Strona"],
  "Cechy":["Typ","Nazwa","Opis"],
  "Stany":["Typ","Nazwa","Opis"],
  "Slowa_Kluczowe":["Typ","Nazwa","Opis"],
  "Ekwipunek":["Typ","Nazwa","Opis","Efekt","Koszt","Dostępność","Słowa Kluczowe","Koszt IM"],
  "Augumentacje":["Typ","Nazwa","Opis","Efekt","Koszt","Dostępność","Słowa Kluczowe","Koszt IM"],
  "Talenty":["Nazwa","Koszt PD","Wymagania","Opis","Efekt"],
  "Psionika":["Typ","Nazwa","Koszt PD","ST","Aktywacja","Czas Trwania","Zasięg","Wiele Celów","Słowa Kluczowe","Efekt","Opis","Wzmocnienie"],
  "Modlitwy":["Nazwa","Koszt PD","Wymagania","Efekt"],
  "Bronie":["Rodzaj","Typ","Nazwa","Obrażenia","DK","PP","Zasięg","Szybkostrzelność","Cechy","Koszt","Dostępność","Słowa Kluczowe","Koszt IM","Podręcznik","Strona"],
  "Pancerze":["Typ","Nazwa","WP","Cechy","Koszt","Dostępność","Słowa Kluczowe","Koszt IM","Podręcznik","Strona"],
};

const els = {
  tabs: document.getElementById("tabs"),
  wrap: document.getElementById("tableWrap"),
  global: document.getElementById("globalSearch"),
  btnUpdateData: document.getElementById("btnUpdateData"),
  updateDataGroup: document.getElementById("updateDataGroup"),
  btnCompare: document.getElementById("btnCompare"),
  btnReset: document.getElementById("btnReset"),
  pop: document.getElementById("popover"),
  popTitle: document.getElementById("popoverTitle"),
  popBody: document.getElementById("popoverBody"),
  popClose: document.getElementById("popoverClose"),
  modal: document.getElementById("modal"),
  modalBody: document.getElementById("modalBody"),
  modalClose: document.getElementById("modalClose"),
  filterMenu: document.getElementById("filterMenu"),
};

const KEYWORD_SHEETS_COMMA_NEUTRAL = new Set(["Bestiariusz", "Psionika", "Augumentacje", "Ekwipunek", "Pancerze", "Bronie"]);
const KEYWORD_SHEET_ALL_RED = "Slowa_Kluczowe";

let DB = null;          // {sheets: {name:{rows, cols}}, _meta:{traits, states, traitIndex, stateIndex}}
let currentSheet = null;

const view = {
  sort: null,              // {col, dir:'asc'|'desc'}
  global: "",
  filtersText: {},         // col -> contains text
  filtersSet: {},          // col -> Set(selected values) OR null
  selected: new Set(),     // row.__id
  expandedCells: new Set() // key sheet|rowid|col for clamp toggle
};

const RENDER_CHUNK_SIZE = 80; // liczba wierszy renderowanych w jednym kroku (progressive rendering)

const ADMIN_MODE = new URLSearchParams(location.search).get("admin") === "1";

/* ---------- Utilities ---------- */
function norm(s){
  return String(s ?? "").replace(/\s+/g, " ").trim().replace(" :", ":").replace(": ",": ");
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

/* ---------- Rich text formatting ---------- */
/* Highlights:
 - references in parentheses containing "str.", "str", or "strona"
 - lines beginning with "*[cyfra]" (rendered jaśniejszym fontem, gwiazdka jest widoczna)
 - keeps newlines
*/
function formatInlineHTML(raw){
  const s = String(raw ?? "");
  const reRefParen = /\(([^)]*(?:\bstr\.?\b|\bstr\b|\bstrona\b)[^)]*)\)/ig;
  const markerRegex = /{{\/?(?:RED|B|I)}}/g;
  const segments = [];
  const stack = [];
  let cursor = 0;
  let m;

  while ((m = markerRegex.exec(s))){
    if (m.index > cursor){
      segments.push({text: s.slice(cursor, m.index), styles: new Set(stack)});
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
  if (cursor < s.length){
    segments.push({text: s.slice(cursor), styles: new Set(stack)});
  }

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
  const set = new Set();
  for (const r of rows){
    for (const k of Object.keys(r)){
      if (k === "__id" || k.startsWith("__")) continue;
      set.add(k);
    }
  }
  const explicit = SHEET_COLUMN_ORDER[sheetName];
  const priority = explicit || ["Rodzaj","Typ","Nazwa","Poziom","Frakcja","Obrażenia","DK","PP","Zasięg","Szybkostrzelność","Cechy","Koszt","Dostępność","Koszt IM","Słowa Kluczowe","Podręcznik","Strona","Opis","Efekt"];
  const cols = [];
  for (const p of priority){
    if (set.has(p)) cols.push(p), set.delete(p);
  }
  const rest = [...set].sort((a,b)=>a.localeCompare(b,"pl",{numeric:true,sensitivity:"base"}));
  return cols.concat(rest);
}

/* ---------- Loading ---------- */
async function loadJsonFromRepo(){
  try{
    setStatus("Ładowanie data.json...");
    const res = await fetch("data.json", {cache:"no-store"});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    DB = normaliseDB(data);
    initUI();
    setStatus("OK — załadowano data.json");
  }catch(e){
    setStatus("Błąd ładowania data.json");
    logLine("BŁĄD: "+e.message, true);
  }
}

function buildDataJsonFromSheets(rawSheets){
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

  return {sheets, _meta:{traits, states}};
}

function ensureSheetJS(cb){
  if (window.XLSX) return cb();
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
  s.onload = cb;
  s.onerror = () => { setStatus("Błąd ładowania XLSX"); logLine("BŁĄD: nie udało się załadować biblioteki XLSX (CDN).", true); };
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

function loadXlsxFromRepo(){
  ensureSheetJS(async ()=>{
    try{
      setStatus("Pobieranie Repozytorium.xlsx...");
      const res = await fetch("Repozytorium.xlsx", {cache:"no-store"});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      const wb = XLSX.read(buf, {type:"array"});
      const sheets = {};
      for (const name of wb.SheetNames){
        const ws = wb.Sheets[name];
        const rows = XLSX.utils.sheet_to_json(ws, {defval:"", raw:false});
        sheets[name] = rows;
      }
      const data = buildDataJsonFromSheets(sheets);
      downloadDataJson(data);
      DB = normaliseDB(data);
      initUI();
      setStatus("OK — zaktualizowano dane i wygenerowano data.json");
    }catch(e){
      setStatus("Błąd aktualizacji danych");
      logLine("BŁĄD: "+e.message, true);
    }
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
  return {sheets, _meta:{traits, states, traitIndex, stateIndex}};
}

/* ---------- UI init ---------- */
function initUI(){
  // Tabs
  els.tabs.innerHTML = "";
  const available = Object.keys(DB.sheets);
  const visibleSheets = ADMIN_MODE ? available : available.filter(name => name !== "Bestiariusz");
  const order = SHEETS_ORDER.filter(x => available.includes(x)).concat(available.filter(x => !SHEETS_ORDER.includes(x)).sort());
  const visibleOrder = order.filter(name => visibleSheets.includes(name));
  for (const name of visibleOrder){
    const b = document.createElement("button");
    b.className = "tab";
    b.textContent = name.toUpperCase();
    b.addEventListener("click", ()=>selectSheet(name));
    els.tabs.appendChild(b);
  }
  // select first
  selectSheet(visibleOrder[0] || visibleSheets[0]);

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
let headerBuiltFor = null;

/* Legacy renderer (z przewijaniem i klamrowaniem) — zostawiony do wglądu
function buildTableSkeleton(){...}
*/

function selectSheet(name){
  currentSheet = name;
  view.sort = null;
  view.filtersText = {};
  view.filtersSet = {};
  view.selected.clear();
  view.expandedCells.clear();
  els.btnCompare.disabled = true;

  [...els.tabs.querySelectorAll(".tab")].forEach(t => t.classList.toggle("active", t.textContent === name.toUpperCase()));

  buildTableSkeleton();
  renderBody();
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
  th0f.innerHTML = "<span class=\"muted\">filtr</span>";
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
    input.placeholder = "filtr...";
    input.dataset.col = col;
    input.addEventListener("input", ()=>{ view.filtersText[col] = input.value; renderBody(); });
    input.addEventListener("keydown", ev=>ev.stopPropagation());

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filterBtn";
    btn.textContent = "▾";
    btn.title = "Filtr listy";
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
  updateSortMarks();
  renderBody();
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

function openFilterMenu(col, anchorBtn){
  const menu = els.filterMenu;
  menu.innerHTML = "";

  const title = document.createElement("div");
  title.className = "fmTitle";
  title.textContent = `FILTR: ${col}`;
  menu.appendChild(title);

  const search = document.createElement("input");
  search.className = "input fmSearch";
  search.placeholder = "Szukaj na liście…";
  menu.appendChild(search);

  const actions = document.createElement("div");
  actions.className = "fmActions";
  const bAll = document.createElement("button");
  bAll.className = "btn secondary";
  bAll.textContent = "Zaznacz wszystko";
  const bNone = document.createElement("button");
  bNone.className = "btn secondary";
  bNone.textContent = "Wyczyść";
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
  const onDoc = (ev)=>{
    if (menu.contains(ev.target) || anchorBtn.contains(ev.target)) return;
    closeFilterMenu();
  };
  setTimeout(()=>document.addEventListener("mousedown", onDoc, {once:true}), 0);
}

function closeFilterMenu(){
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
  const {col, dir} = view.sort;
  const out = [...rows];
  out.sort((ra, rb)=>{
    const a = ra[col], b = rb[col];
    const an = !Number.isNaN(numVal(a));
    const bn = !Number.isNaN(numVal(b));
    let cmp = 0;
    if (an && bn) cmp = numVal(a) - numVal(b);
    else cmp = String(a ?? "").localeCompare(String(b ?? ""), "pl", {numeric:true, sensitivity:"base"});
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

  const filtered = sortRows(rowsAll.filter(r => passesFilters(r, cols)));
  const token = ++renderToken;

  if (!filtered.length){
    tbodyEl.innerHTML = `<tr><td colspan="${cols.length+1}" class="emptyState"><div class="emptyTitle">BRAK WYNIKÓW</div><div class="emptyText">Zmień filtry lub wyczyść widok.</div></td></tr>`;
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

  const td0 = document.createElement("td");
  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = view.selected.has(r.__id);
  cb.addEventListener("change", ()=>{
    if (cb.checked) view.selected.add(r.__id); else view.selected.delete(r.__id);
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

      const linesCount = String(r[col] ?? "").split(/\r?\n/).length;
      const key = `${currentSheet}|${r.__id}|${col}`;
      const isClampable = linesCount > 10;

      const isKeywordName = currentSheet === KEYWORD_SHEET_ALL_RED && col === "Nazwa";
      const isKeywordCommaNeutral = KEYWORD_SHEETS_COMMA_NEUTRAL.has(currentSheet) && col === "Słowa Kluczowe";

      const renderCell = () => {
        if (!isClampable){
          if (isKeywordName){
            div.innerHTML = formatKeywordHTML(r, col);
          } else if (isKeywordCommaNeutral){
            div.innerHTML = formatKeywordHTML(r, col, {commasNeutral:true});
          } else {
            div.innerHTML = getFormattedCellHTML(r, col);
          }
          td.classList.remove("clampable");
          td.removeAttribute("title");
          return;
        }

        const expanded = view.expandedCells.has(key);
        td.classList.add("clampable");
        td.title = expanded ? "Kliknij aby zwinąć" : "Kliknij aby rozwinąć";
        if (isKeywordName){
          div.innerHTML = expanded
            ? formatKeywordHTML(r, col, {appendHint:"Kliknij aby zwinąć"})
            : formatKeywordHTML(r, col, {maxLines:9, appendHint:"Kliknij aby rozwinąć"});
        } else if (isKeywordCommaNeutral){
          div.innerHTML = expanded
            ? formatKeywordHTML(r, col, {commasNeutral:true, appendHint:"Kliknij aby zwinąć"})
            : formatKeywordHTML(r, col, {commasNeutral:true, maxLines:9, appendHint:"Kliknij aby rozwinąć"});
        } else {
          div.innerHTML = expanded
            ? formatTextHTML(r[col], {appendHint:"Kliknij aby zwinąć"})
            : formatTextHTML(r[col], {maxLines:9, appendHint:"Kliknij aby rozwinąć"});
        }
      };

      renderCell();

      if (isClampable){
        td.addEventListener("click", ()=>{
          const expanded = view.expandedCells.has(key);
          if (expanded) view.expandedCells.delete(key); else view.expandedCells.add(key);
          renderCell();
        });
      }

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
          td.title = expanded ? "Kliknij aby zwinąć" : "Kliknij aby rozwinąć";
          div.style.maxHeight = expanded ? "" : `${lineHeight * 9}px`;
          div.style.overflow = expanded ? "" : "hidden";
          hint.textContent = expanded ? "Kliknij aby zwinąć" : "Kliknij aby rozwinąć";
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
  const mCall = t.match(/^Wywołanie\s*[:(]\s*([^\)]+?)\s*\)?\s*$/i);
  if (mCall){
    const stRaw = norm(mCall[1]);
    const mLvl = stRaw.match(/^(.*)\s*\((\d+)\)\s*$/);
    const stateKeyFull = mLvl ? `${norm(mLvl[1])} (${mLvl[2]})` : stRaw;
    const stateKeyBase = mLvl ? norm(mLvl[1]) : stRaw;

    const traitTextTpl = "Wywołanie (Stan)";
    const traitDesc = traitIndex[canonKey(traitTextTpl)] || traitIndex[canonKey("Wywołanie(Stan)")] || null;

    const stDesc = stateIndex[canonKey(stateKeyFull)] || stateIndex[canonKey(stateKeyBase)] || null;

    const blocks = [];
    blocks.push({label:"CECHA: WYWOŁANIE", text: traitDesc || "Nie znaleziono tej cechy w zakładce Cechy."});
    blocks.push({label:`STAN: ${stateKeyFull.toUpperCase()}`, text: stDesc || "Nie znaleziono tego stanu w zakładce Stany."});
    return {title:`Wywołanie: ${stateKeyFull}`, blocks};
  }

  // 2) Cechy parametryzowane: "Nieporęczny (2)" -> match "Nieporęczny (X)"
  const mNum = t.match(/^(.*?)(\s*)\((\d+)\)\s*$/);
  if (mNum){
    const baseName = norm(mNum[1]);
    const key1 = canonKey(`${baseName} (X)`);
    const key2 = canonKey(`${baseName}(X)`);
    const desc = traitIndex[key1] || traitIndex[key2] || null;
    if (desc){
      return {title: t, blocks:[{label:"CECHA", text: desc}]};
    }
  }

  // 3) Exact match
  const desc = traitIndex[canonKey(t)] || traitIndex[canonKey(t).replace(/\s+/g,"")] || null;
  if (desc){
    return {title: t, blocks:[{label:"CECHA", text: desc}]};
  }

  return {title: t, blocks:[{label:"BRAK OPISU", text:"Nie znaleziono tej cechy w zakładce Cechy."}]};
}

function openTraitPopover(traitText){
  const r = resolveTrait(traitText);
  els.popTitle.textContent = r.title.toUpperCase();
  els.popBody.innerHTML = r.blocks.map(b => `
    <div style="margin-top:10px">
      <div style="color:var(--code); letter-spacing:.12em; text-transform:uppercase; font-size:11px">${escapeHtml(b.label)}</div>
      <div class="celltext">${formatTextHTML(b.text)}</div>
    </div>`).join("");
  els.pop.setAttribute("aria-hidden","false");
}
function closePopover(){ els.pop.setAttribute("aria-hidden","true"); }
els.popClose.addEventListener("click", closePopover);

/* ---------- Modal ---------- */
function openModal(title, html){
  els.modalBody.innerHTML = `<h3 style="margin:0 0 10px 0">${escapeHtml(title)}</h3>${html}`;
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
        ${vals.map(v => `<td>${col==="Cechy" ? escapeHtml(String(v||"")) : (col==="Zasięg" ? formatRangeHTML(v) : formatTextHTML(v))}</td>`).join("")}
      </tr>`);
  }
  const html = `<div style="overflow:auto; max-height:70vh">
    <table>
      <thead><tr><th>Pole</th>${rows.map((_,i)=>`<th>Rekord ${i+1}</th>`).join("")}</tr></thead>
      <tbody>${htmlRows.join("")}</tbody>
    </table>
  </div>`;
  openModal("PORÓWNANIE", html);
}

/* ---------- Reset view ---------- */
els.btnReset.addEventListener("click", ()=>{
  view.sort = null;
  view.global = "";
  view.filtersText = {};
  view.filtersSet = {};
  view.selected.clear();
  view.expandedCells.clear();
  // clear inputs
  els.global.value = "";
  if (tableEl){
    tableEl.querySelectorAll("thead tr:nth-child(2) input.input").forEach(inp => inp.value = "");
  }
  updateSortMarks();
  renderBody();
});

/* ---------- Global search ---------- */
els.global.addEventListener("input", ()=>{
  view.global = els.global.value;
  renderBody();
});
els.global.addEventListener("keydown", (ev)=>ev.stopPropagation());

/* ---------- Loaders ---------- */
els.btnUpdateData.addEventListener("click", loadXlsxFromRepo);

/* ---------- Boot ---------- */
(async function boot(){
  logLine(`Tryb: ${ADMIN_MODE ? "ADMIN" : "GRACZ"}`);
  // auto-load data.json (players)
  await loadJsonFromRepo();
})();

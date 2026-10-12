// Plik logiki modułu: konfiguracja, funkcje i obsługa zdarzeń / Module logic file: configuration, functions, and event handling
(function(global){
  const DOC_REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

  function parseXml(xmlText){
    return new DOMParser().parseFromString(xmlText, "application/xml");
  }

  function q(node, selector){ return node.querySelector(selector); }
  function qa(node, selector){ return Array.from(node.querySelectorAll(selector)); }

  function replacePolishQuotes(text){
    return String(text ?? "").replace(/„/g, '"').replace(/”/g, '"');
  }

  // Ta sama kolejnosc krokow co w DataVault/app.js i DataVault/build_json.py: zamiana polskich
  // cudzyslowow, scalenie bialych znakow, przyciecie.
  // The same step order as in DataVault/app.js and DataVault/build_json.py: replace Polish quotes,
  // collapse whitespace, trim.
  function norm(value){
    return replacePolishQuotes(value).replace(/\s+/g, " ").trim();
  }

  function deriveColumnOrder(header){
    const out = [];
    let hasRange = false;
    let hasTraits = false;
    for (const col of header){
      if (!col) continue;
      if (/^lp$/i.test(col.trim())) continue;
      if (/^zasi[eę]g\s*\d+$/i.test(col)){
        if (!hasRange){ out.push("Zasięg"); hasRange = true; }
        continue;
      }
      if (/^cecha\s*\d+$/i.test(col)){
        if (!hasTraits){ out.push("Cechy"); hasTraits = true; }
        continue;
      }
      out.push(col);
    }
    return out;
  }

  function isRedColor(colorNode){
    if (!colorNode) return false;
    const rgb = (colorNode.getAttribute("rgb") || "").replace(/^#/, "").toUpperCase();
    if (!rgb) return false;
    return rgb.endsWith("FF0000") || rgb === "FF0000" || rgb === "00FF0000" || rgb === "FFFF0000";
  }

  function isEnabled(node){
    if (!node) return false;
    const val = node.getAttribute("val");
    return val === null || !["0","false"].includes(String(val).toLowerCase());
  }

  // --- Owijanie tekstu markerami bez pary markerów przechodzącej przez złamanie linii / Wrapping text in markers so that no marker pair crosses a line break ---
  // Renderery DataVault (formatTextHTML, formatFactionKeywordHTML) i GeneratorNPC (formatTextHTML,
  // splitEntries + formatSectionEntries) formatują każdą linię albo pasek osobno, z pustym stosem stylów.
  // Para markerów przechodząca przez złamanie linii gubi więc styl na kolejnych liniach, np. run
  // "\nANIHILACJA: ..." dawał "{{B}}\nANIHILACJA: ...{{/B}}" i nagłówek był zwykłym tekstem.
  // Zasady (identyczne jak _wrap_with_markers w DataVault/build_json.py):
  // 1. Brak stylu -> tekst bez zmian.
  // 2. Tekst bez złamania linii -> cały tekst w jednej parze markerów (także pusty i z samych spacji),
  //    dokładnie jak dotąd, więc pola jednolinijkowe i puste czerwone komórki się nie zmieniają.
  // 3. Tekst ze złamaniami linii (CRLF, LF albo samotne CR) -> dzielimy go na linie; spacje i tabulatory
  //    dotykające złamania linii zostają poza markerami, niepusta reszta linii dostaje własną parę markerów,
  //    linia z samych spacji/tabulatorów zostaje bez markerów. Spacji, które nie dotykają złamania linii,
  //    nie ruszamy, bo od nich zależy podział na paski w splitEntries (np. "{{B}}bagnet: {{/B}}5").
  // 4. Tekst złożony wyłącznie ze spacji, tabulatorów i złamań linii -> jedna pusta para markerów przed
  //    tekstem. Wynik pozostaje niepusty po trim() tak samo jak dotąd, więc rowsToRecords nie pomija
  //    wiersza, a pole nie staje się puste; pusta para nie renderuje żadnego elementu.
  // The DataVault renderers (formatTextHTML, formatFactionKeywordHTML) and the GeneratorNPC renderers
  // (formatTextHTML, splitEntries + formatSectionEntries) format every line or stripe separately, with an
  // empty style stack. A marker pair that crosses a line break therefore loses its style on the following
  // lines, e.g. the run "\nANIHILACJA: ..." produced "{{B}}\nANIHILACJA: ...{{/B}}" and the header was
  // rendered as plain text. Rules (identical to _wrap_with_markers in DataVault/build_json.py):
  // 1. No style -> the text is returned unchanged.
  // 2. Text without a line break -> the whole text in one marker pair (also empty and space-only text),
  //    exactly as before, so single-line fields and empty red cells do not change.
  // 3. Text with line breaks (CRLF, LF or a lone CR) -> it is split into lines; spaces and tabs touching a
  //    line break stay outside the markers, the non-empty rest of each line gets its own marker pair, a line
  //    made only of spaces/tabs stays unmarked. Spaces that do not touch a line break are left alone,
  //    because splitEntries stripe splitting depends on them (e.g. "{{B}}bagnet: {{/B}}5").
  // 4. Text made only of spaces, tabs and line breaks -> one empty marker pair before the text. The result
  //    stays non-blank after trim() exactly as before, so rowsToRecords does not skip the row and the field
  //    does not become empty; an empty pair renders no element.
  function wrapWithMarkers(text, {red=false, bold=false, italic=false, strike=false} = {}){
    const markers = [
      ["{{RED}}", "{{/RED}}", red],
      ["{{B}}", "{{/B}}", bold],
      ["{{I}}", "{{/I}}", italic],
      ["{{S}}", "{{/S}}", strike],
    ];
    const start = markers.filter((m)=>m[2]).map((m)=>m[0]).join("");
    const end = markers.slice().reverse().filter((m)=>m[2]).map((m)=>m[1]).join("");
    const value = `${text}`;
    // Reguła 1: bez stylu nie dodajemy markerów / Rule 1: no style, no markers
    if (!start) return value;
    // Reguła 2: tekst jednolinijkowy owijamy w całości, jak dotąd / Rule 2: single-line text is wrapped whole, as before
    if (!value.includes("\n") && !value.includes("\r")) return `${start}${value}${end}`;
    // Reguła 3: na pozycjach parzystych są linie, na nieparzystych złamania linii (najdłuższe dopasowanie
    // pierwsze; U+2028/U+2029 nie są złamaniem linii, tak jak w rendererach i w build_json.py)
    // Rule 3: even positions hold lines, odd positions hold the line breaks (longest match first;
    // U+2028/U+2029 are not line breaks, as in the renderers and in build_json.py)
    const parts = value.split(/(\r\n|\r|\n)/);
    const last = parts.length - 1;
    const isSpaceOrTab = (ch)=>ch === " " || ch === "\t";
    let out = "";
    let wrapped = false;
    for (let i = 0; i < parts.length; i += 1){
      const part = parts[i];
      if (i % 2 === 1){
        out += part;
        continue;
      }
      let lo = 0;
      let hi = part.length;
      // Spacje/tabulatory tuż za złamaniem linii zostają przed markerem otwierającym
      // Spaces/tabs right after a line break stay before the opening marker
      if (i > 0){
        while (lo < hi && isSpaceOrTab(part[lo])) lo += 1;
      }
      // Spacje/tabulatory tuż przed złamaniem linii zostają za markerem zamykającym
      // Spaces/tabs right before a line break stay after the closing marker
      if (i < last){
        while (hi > lo && isSpaceOrTab(part[hi - 1])) hi -= 1;
      }
      if (hi > lo){
        out += `${part.slice(0, lo)}${start}${part.slice(lo, hi)}${end}${part.slice(hi)}`;
        wrapped = true;
      } else {
        // Linia pusta albo z samych spacji/tabulatorów zostaje bez markerów
        // An empty or spaces/tabs-only line stays unmarked
        out += part;
      }
    }
    // Reguła 4: nic nie zostało owinięte -> pusta para markerów przed tekstem (bez złamania linii w środku)
    // Rule 4: nothing was wrapped -> an empty marker pair before the text (no line break inside it)
    return wrapped ? out : `${start}${end}${value}`;
  }

  function richTextToString(node){
    const runs = qa(node, "r");
    if (!runs.length){
      const text = qa(node, "t").map((n)=>n.textContent || "").join("");
      return {text, hasRuns:false};
    }
    const parts = [];
    for (const run of runs){
      const text = qa(run, "t").map((n)=>n.textContent || "").join("");
      if (!text) continue;
      const rpr = q(run, "rPr");
      const red = isRedColor(rpr ? q(rpr, "color") : null);
      const bold = isEnabled(rpr ? q(rpr, "b") : null);
      const italic = isEnabled(rpr ? q(rpr, "i") : null);
      const strike = isEnabled(rpr ? q(rpr, "strike") : null);
      parts.push(wrapWithMarkers(text, {red, bold, italic, strike}));
    }
    return {text: parts.join(""), hasRuns:true};
  }

  async function loadSharedStrings(zip){
    const file = zip.file("xl/sharedStrings.xml");
    if (!file) return [];
    const xml = parseXml(await file.async("string"));
    const items = [];
    for (const si of qa(xml, "si")){
      items.push(richTextToString(si));
    }
    return items;
  }

  async function loadStyles(zip){
    const file = zip.file("xl/styles.xml");
    if (!file) return {cellXfRed:[]};
    const xml = parseXml(await file.async("string"));
    const fonts = qa(xml, "fonts > font").map((font)=>isRedColor(q(font, "color")));
    const cellXfRed = qa(xml, "cellXfs > xf").map((xf)=>{
      const fontId = Number(xf.getAttribute("fontId") || "0");
      return fontId >= 0 && fontId < fonts.length ? fonts[fontId] : false;
    });
    return {cellXfRed};
  }

  function styleIsRed(styles, idx){
    if (idx == null || Number.isNaN(idx)) return false;
    return idx < styles.cellXfRed.length && !!styles.cellXfRed[idx];
  }

  function colToIndex(ref){
    let idx = 0;
    for (const ch of ref){
      if (!/[A-Za-z]/.test(ch)) break;
      idx = idx * 26 + (ch.toUpperCase().charCodeAt(0) - 64);
    }
    return idx - 1;
  }

  function rowsToRecords(header, rows){
    const out = [];
    for (const row of rows){
      if (!row.some((x)=>x != null && String(x).trim() !== "")) continue;
      const rec = {};
      for (let i=0; i<header.length; i+=1){
        const h = header[i];
        if (!h) continue;
        rec[h] = i >= row.length || row[i] == null ? "" : replacePolishQuotes(String(row[i]).trim());
      }
      out.push(rec);
    }
    return out;
  }

  async function loadRowsFromXml(zip, path, sharedStrings, styles){
    const file = zip.file(path);
    if (!file) return [];
    const xml = parseXml(await file.async("string"));
    const rows = [];
    for (const rowNode of qa(xml, "worksheet > sheetData > row")){
      const cells = {};
      for (const cell of qa(rowNode, "c")){
        const ref = cell.getAttribute("r") || "";
        const match = ref.match(/^([A-Za-z]+)/);
        const col = match ? colToIndex(match[1]) : Object.keys(cells).length;
        const cellType = cell.getAttribute("t");
        const styleIdx = cell.getAttribute("s");
        const styleIdxInt = styleIdx != null && /^\d+$/.test(styleIdx) ? Number(styleIdx) : null;
        const isRedStyle = styleIsRed(styles, styleIdxInt);
        const vNode = q(cell, "v");
        let value = "";

        if (cellType === "s"){
          const idx = vNode?.textContent ? Number(vNode.textContent) : NaN;
          const item = Number.isNaN(idx) ? {text:"", hasRuns:false} : (sharedStrings[idx] || {text:"", hasRuns:false});
          value = item.text || "";
          if (isRedStyle && !item.hasRuns && !value.includes("{{RED}}")){
            value = wrapWithMarkers(value, {red:true});
          }
        } else if (cellType === "inlineStr"){
          const isNode = q(cell, "is") || cell;
          const item = richTextToString(isNode);
          value = item.text || "";
          if (isRedStyle && !item.hasRuns && !value.includes("{{RED}}")){
            value = wrapWithMarkers(value, {red:true});
          }
        } else if (cellType === "b"){
          const raw = vNode?.textContent || "";
          value = ["1","true","TRUE"].includes(raw) ? "TRUE" : "FALSE";
        } else {
          value = vNode?.textContent || "";
          if (isRedStyle && value && !String(value).includes("{{RED}}")){
            value = wrapWithMarkers(String(value), {red:true});
          }
        }
        cells[col] = value;
      }
      rows.push(cells);
    }

    const maxCol = rows.reduce((acc, row)=>Math.max(acc, ...Object.keys(row).map(Number), -1), -1);
    return rows.map((row)=>Array.from({length:Math.max(maxCol+1,0)}, (_,i)=>row[i] ?? ""));
  }

  async function loadXlsxMinimal(arrayBuffer){
    const zip = await global.JSZip.loadAsync(arrayBuffer);
    const sharedStrings = await loadSharedStrings(zip);
    const styles = await loadStyles(zip);

    const wbXml = parseXml(await zip.file("xl/workbook.xml").async("string"));
    const relsXml = parseXml(await zip.file("xl/_rels/workbook.xml.rels").async("string"));

    const ridToTarget = new Map();
    for (const rel of qa(relsXml, "Relationships > Relationship")){
      ridToTarget.set(rel.getAttribute("Id"), rel.getAttribute("Target"));
    }

    const sheets = {};
    const sheetOrder = [];
    const columnOrder = {};

    for (const sheet of qa(wbXml, "workbook > sheets > sheet")){
      const name = sheet.getAttribute("name") || "Sheet";
      sheetOrder.push(name);
      const rid = sheet.getAttributeNS(DOC_REL_NS, "id") || sheet.getAttribute("r:id");
      const target = ridToTarget.get(rid);
      if (!target) {
        sheets[name] = [];
        continue;
      }
      const rows = await loadRowsFromXml(zip, `xl/${target}`, sharedStrings, styles);
      if (!rows.length){
        sheets[name] = [];
        continue;
      }
      const header = rows[0].map((h)=>norm(h));
      columnOrder[name] = deriveColumnOrder(header);
      sheets[name] = rowsToRecords(header, rows.slice(1));
    }

    return {sheets, sheetOrder, columnOrder};
  }

  global.XlsxCanonicalParser = {loadXlsxMinimal};
})(window);

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""build_json.py — generuje data.json z Repozytorium.xlsx.

CEL:
- Bronie: scala Zasięg 1..3 -> Zasięg oraz Cecha 1..N -> Cechy
- Pancerze: scala Cecha 1..N -> Cechy
- Buduje słowniki:
  - _meta.traits (Cechy.Nazwa -> Cechy.Opis)
  - _meta.states (Stany.Nazwa -> Stany.Opis / Opis jeśli istnieje)
  - _meta.sheetOrder (kolejność arkuszy z XLSX)
  - _meta.columnOrder (kolejność kolumn z nagłówków XLSX po scaleniu Cecha/Zasięg)

Użycie:
  python build_json.py Repozytorium.xlsx data.json
Domyślnie:
  python build_json.py
"""

import sys, re, json
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET

def norm(s) -> str:
  return re.sub(r"\s+", " ", str(s or "").strip())

def derive_column_order(header):
  order = []
  has_range = False
  has_traits = False
  for col in header:
    if not col:
      continue
    if re.match(r"^Zasi[eę]g\s*\d+$", col, re.IGNORECASE):
      if not has_range:
        order.append("Zasięg")
        has_range = True
      continue
    if re.match(r"^Cecha\s*\d+$", col, re.IGNORECASE):
      if not has_traits:
        order.append("Cechy")
        has_traits = True
      continue
    order.append(col)
  return order


def _is_red_color(node) -> bool:
  if node is None:
    return False
  rgb = (node.attrib.get("rgb") or "").lstrip("#").upper()
  if rgb:
    return rgb.endswith("FF0000") or rgb in {"FF0000", "00FF0000", "FFFF0000"}
  # theme/indexed colors are ignored (treated as default palette)
  return False


def _is_enabled(tag) -> bool:
  if tag is None:
    return False
  val = tag.attrib.get("val")
  return val is None or str(val).lower() not in {"0", "false"}


def _wrap_with_markers(text: str, *, red=False, bold=False, italic=False) -> str:
  markers = [
    ("{{RED}}", "{{/RED}}", red),
    ("{{B}}", "{{/B}}", bold),
    ("{{I}}", "{{/I}}", italic),
  ]
  start = "".join(op for op,_,use in markers if use)
  end = "".join(cl for _,cl,use in reversed(markers) if use)
  return f"{start}{text}{end}"


def _rich_text_to_string(el, ns):
  runs = el.findall("main:r", ns)
  if not runs:
    plain = "".join(t.text or "" for t in el.findall(".//main:t", ns))
    return plain, False
  parts = []
  for r in runs:
    text = "".join(t.text or "" for t in r.findall("main:t", ns))
    if not text:
      continue
    rpr = r.find("main:rPr", ns)
    color = rpr.find("main:color", ns) if rpr is not None else None
    red = _is_red_color(color)
    bold = _is_enabled(rpr.find("main:b", ns) if rpr is not None else None)
    italic = _is_enabled(rpr.find("main:i", ns) if rpr is not None else None)
    parts.append(_wrap_with_markers(text, red=red, bold=bold, italic=italic))
  return "".join(parts), True

def sheet_to_records(ws):
  # first row is header
  rows = list(ws.iter_rows(values_only=True))
  if not rows: return []
  header = [norm(h) for h in rows[0]]
  return rows_to_records(header, rows[1:])


def rows_to_records(header, rows):
  out = []
  for r in rows:
    if not any(x is not None and str(x).strip() != "" for x in r):
      continue
    rec = {}
    for i,h in enumerate(header):
      if not h: continue
      rec[h] = "" if i>=len(r) or r[i] is None else str(r[i]).strip()
    out.append(rec)
  return out

def merge_range(rec: dict) -> dict:
  # Zasięg 1..3 -> Zasięg
  keys = {k.lower():k for k in rec.keys()}
  k1 = keys.get("zasięg 1") or keys.get("zasieg 1")
  k2 = keys.get("zasięg 2") or keys.get("zasieg 2")
  k3 = keys.get("zasięg 3") or keys.get("zasieg 3")
  if not (k1 or k2 or k3): 
    return rec
  v1 = norm(rec.get(k1,"-")) or "-"
  v2 = norm(rec.get(k2,"-")) or "-"
  v3 = norm(rec.get(k3,"-")) or "-"
  out = dict(rec)
  for k in [k1,k2,k3]:
    if k and k in out: del out[k]
  out["Zasięg"] = f"{v1} / {v2} / {v3}"
  return out

def merge_traits(rec: dict) -> dict:
  # Cecha 1..N -> Cechy ; separator "; "
  trait_cols = []
  for k in rec.keys():
    m = re.match(r"^Cecha\s*(\d+)$", k, re.IGNORECASE)
    if m:
      trait_cols.append((int(m.group(1)), k))
  if not trait_cols:
    return rec
  trait_cols.sort()
  traits = []
  for _,k in trait_cols:
    v = norm(rec.get(k,""))
    if v and v != "-":
      traits.append(v)
  out = dict(rec)
  for _,k in trait_cols:
    if k in out: del out[k]
  out["Cechy"] = "; ".join(traits) if traits else "-"
  return out


def _load_shared_strings(z: ZipFile):
  try:
    root = ET.fromstring(z.read("xl/sharedStrings.xml"))
  except KeyError:
    return []
  ns = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
  items = []
  for si in root.findall("main:si", ns):
    text, has_runs = _rich_text_to_string(si, ns)
    items.append({"text": text, "has_runs": has_runs})
  return items


def _load_styles(z: ZipFile):
  try:
    root = ET.fromstring(z.read("xl/styles.xml"))
  except KeyError:
    return {"cell_xf_red": []}

  ns = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
  fonts = []
  for font in root.findall("main:fonts/main:font", ns):
    color = font.find("main:color", ns)
    fonts.append(_is_red_color(color))

  cell_xf_red = []
  for xf in root.findall("main:cellXfs/main:xf", ns):
    font_id = int(xf.attrib.get("fontId", "0"))
    cell_xf_red.append(font_id < len(fonts) and fonts[font_id])

  return {"cell_xf_red": cell_xf_red}


def _style_is_red(styles, idx: int) -> bool:
  if idx is None:
    return False
  return idx < len(styles.get("cell_xf_red", [])) and styles["cell_xf_red"][idx]


def _col_to_index(ref: str) -> int:
  idx = 0
  for c in ref:
    if not c.isalpha():
      break
    idx = idx * 26 + (ord(c.upper()) - ord("A") + 1)
  return idx - 1


def _load_rows_from_xml(z: ZipFile, path: str, shared_strings, styles):
  ns = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
  root = ET.fromstring(z.read(path))
  rows = []
  for row in root.findall(".//main:sheetData/main:row", ns):
    cells = {}
    for cell in row.findall("main:c", ns):
      ref = cell.attrib.get("r", "")
      m = re.match(r"([A-Za-z]+)", ref) if ref else None
      col = _col_to_index(m.group(1)) if m else len(cells)
      cell_type = cell.attrib.get("t")
      style_idx = cell.attrib.get("s")
      style_idx_int = int(style_idx) if style_idx is not None and str(style_idx).isdigit() else None
      is_red_style = _style_is_red(styles, style_idx_int)
      val_node = cell.find("main:v", ns)
      if cell_type == "s":
        item = shared_strings[int(val_node.text)] if val_node is not None and val_node.text else {"text":"","has_runs":False}
        text = item.get("text", "")
        has_runs = item.get("has_runs", False)
        if is_red_style and not has_runs and "{{RED}}" not in text:
          text = _wrap_with_markers(text, red=True)
        val = text
      elif cell_type == "inlineStr":
        is_node = cell.find("main:is", ns) or cell
        text, has_runs = _rich_text_to_string(is_node, ns)
        if is_red_style and not has_runs and "{{RED}}" not in text:
          text = _wrap_with_markers(text, red=True)
        val = text
      elif cell_type == "b":
        val = "TRUE" if (val_node.text if val_node is not None else "") in ("1","true","TRUE") else "FALSE"
      else:
        val = val_node.text if val_node is not None else ""
        if is_red_style and isinstance(val, str) and val and "{{RED}}" not in val:
          val = _wrap_with_markers(val, red=True)
      cells[col] = val
    rows.append(cells)
  if not rows:
    return []
  max_col = max((max(r.keys()) for r in rows if r), default=-1)
  table = []
  for r in rows:
    table.append([r.get(i, "") for i in range(max_col+1)])
  return table


def load_xlsx_minimal(path: Path):
  """Minimal XLSX loader when openpyxl is unavailable (no external deps)."""
  sheets = {}
  sheet_order = []
  column_order = {}
  with ZipFile(path, "r") as z:
    shared_strings = _load_shared_strings(z)
    styles = _load_styles(z)
    wb_root = ET.fromstring(z.read("xl/workbook.xml"))
    ns_main = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    ns_rel = {"rel": "http://schemas.openxmlformats.org/package/2006/relationships"}
    rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
    rid_to_target = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels.findall("rel:Relationship", ns_rel)}

    for sheet in wb_root.findall("main:sheets/main:sheet", ns_main):
      name = sheet.attrib.get("name", "Sheet")
      sheet_order.append(name)
      rid = sheet.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
      target = rid_to_target.get(rid)
      if not target:
        continue
      path_xml = "xl/" + target
      rows = _load_rows_from_xml(z, path_xml, shared_strings, styles)
      if not rows:
        sheets[name] = []
        continue
      header = [norm(h) for h in rows[0]]
      column_order[name] = derive_column_order(header)
      sheets[name] = rows_to_records(header, rows[1:])
  return sheets, sheet_order, column_order

def main():
  xlsx = Path(sys.argv[1]) if len(sys.argv)>1 else Path("Repozytorium.xlsx")
  out  = Path(sys.argv[2]) if len(sys.argv)>2 else Path("data.json")

  raw_sheets, sheet_order, column_order = load_xlsx_minimal(xlsx)

  sheets = {}
  traits = {}
  states = {}

  # Traits meta from Cechy sheet
  if "Cechy" in raw_sheets:
    for r in raw_sheets["Cechy"]:
      name = norm(r.get("Nazwa",""))
      if not name:
        continue
      desc = (r.get("Opis") or "").strip()
      if desc:
        traits[name] = desc

  # States meta from Stany sheet (prefer Opis/Efekt if present)
  if "Stany" in raw_sheets:
    for r in raw_sheets["Stany"]:
      name = norm(r.get("Nazwa",""))
      if not name:
        continue
      desc = (r.get("Opis") or r.get("Efekt") or "").strip()
      if desc:
        states[name] = desc

  for name, recs in raw_sheets.items():
    if name == "Bronie":
      recs = [merge_traits(merge_range(r)) for r in recs]
    elif name == "Pancerze":
      recs = [merge_traits(r) for r in recs]
    sheets[name] = recs

  data = {
    "sheets": sheets,
    "_meta": {
      "traits": traits,
      "states": states,
      "sheetOrder": sheet_order,
      "columnOrder": column_order,
    }
  }
  out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
  print(f"OK: zapisano {out}")

if __name__ == "__main__":
  main()

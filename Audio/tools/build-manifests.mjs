// --- Generator manifestów modułu Audio / Audio module manifest generator ---
//
// Co robi / What it does:
//   Zamienia wiersze z AudioManifest.xlsx na dwa pliki:
//     1. AudioManifestDemo.json  — warstwa publiczna (AudioExample), zostaje w repozytorium
//     2. audio-manifest.json     — warstwa chroniona (AudioRPG), trafia do repo prywatnego
//   Turns AudioManifest.xlsx rows into two files: a public demo manifest that stays
//   in this repository and a protected manifest that belongs in the private repo.
//
// Dlaczego jest potrzebny / Why it is needed:
//   Identyfikatory `id` muszą powstawać dokładnie tą samą logiką co w Audio/index.html,
//   inaczej zapisane listy ulubionych, widok główny i aliasy przestałyby się wiązać
//   z dźwiękami. Dlatego funkcje slugify/getGroupingBaseLabel/extractTags są tu
//   skopiowane 1:1 z modułu i nie wolno ich rozjeżdżać.
//   The ids must be produced by exactly the same logic as Audio/index.html, otherwise
//   saved favourites, main view and aliases would stop matching their sounds.
//
// Użycie / Usage:
//   node Audio/tools/build-manifests.mjs <rows.json> <katalog-wyjsciowy>
//   gdzie rows.json to tablica obiektów { NazwaSampla, NazwaPliku, LinkDoFolderu }
//   odczytana z arkusza AudioManifest.xlsx.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// --- Stałe skopiowane z Audio/index.html / Constants copied from Audio/index.html ---
const TAG_IGNORE_FRAGMENTS = [
  "SoundPad",
  "SoundPad Patreon Version",
  "_Siege_SoundPad",
  "Patreon"
];
const TAG_IGNORE_SEGMENTS = ["AudioRPG"];

// Prefiks ścieżki publicznej warstwy demo / Public demo tier path prefix
const DEMO_PREFIX = "/AudioExample/";
// Prefiks ścieżki warstwy chronionej / Protected tier path prefix
const PROTECTED_PREFIX = "/AudioRPG/";

// --- Slug identyfikatora, kopia z modułu / Id slug, copy from the module ---
const slugify = (value, index) => {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
  return base || `sample-${index}`;
};

// --- Sklejenie adresu, kopia z modułu / URL join, copy from the module ---
const normalizeUrl = (folderUrl, filename) => {
  const folder = String(folderUrl || "").trim().replace(/\/+$/, "");
  const file = String(filename || "").trim().replace(/^\/+/, "");
  if (!folder || !file) {
    return "";
  }
  return `${folder}/${file}`;
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// --- Czyszczenie segmentu tagu, kopia z modułu / Tag segment cleanup, copy from the module ---
const cleanTagSegment = (segment) => {
  let cleaned = String(segment || "");
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch (error) {
    cleaned = String(segment || "");
  }
  cleaned = cleaned.trim();
  TAG_IGNORE_FRAGMENTS.forEach((fragment) => {
    const regex = new RegExp(escapeRegExp(fragment), "gi");
    cleaned = cleaned.replace(regex, "");
  });
  cleaned = cleaned.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned;
};

// --- Wyciągnięcie tagów ze ścieżki, kopia z modułu / Tag extraction, copy from the module ---
const extractTags = (folderUrl) => {
  let path = String(folderUrl || "").trim().replace(/\\/g, "/");
  if (!path) {
    return [];
  }
  try {
    if (path.includes("://")) {
      path = new URL(path).pathname;
    }
  } catch (error) {
    path = String(folderUrl || "").trim().replace(/\\/g, "/");
  }
  const segments = path
    .split("/")
    .filter(Boolean)
    .filter((segment) => !TAG_IGNORE_SEGMENTS.includes(segment));
  return segments.map(cleanTagSegment).filter(Boolean);
};

// --- Wyznaczenie nazwy bazowej grupy wariantów, kopia z modułu / Variant group base label ---
const getGroupingBaseLabel = (label) => {
  const trimmed = String(label || "").trim();
  if (!trimmed) {
    return { baseLabel: "", changed: false };
  }
  const suffixMatch = trimmed.match(/^(.*?)(?:\s*(\d+))$/);
  if (suffixMatch && suffixMatch[1].trim()) {
    const base = suffixMatch[1].trim();
    return { baseLabel: base, changed: base !== trimmed };
  }
  return { baseLabel: trimmed, changed: false };
};

// --- Ścieżka względna w repozytorium prywatnym / Path relative to the private repository ---
// Z pełnego adresu https://host/AudioRPG/TabletopAudio/... zostaje TabletopAudio/...
const toRepoPath = (folderUrl, filename) => {
  const full = normalizeUrl(folderUrl, filename);
  const index = full.indexOf(PROTECTED_PREFIX);
  if (index === -1) {
    return "";
  }
  return decodeURIComponent(full.slice(index + PROTECTED_PREFIX.length));
};

// --- Grupowanie wierszy w pozycje SFX, kopia logiki parseManifest z modułu ---
// --- Grouping rows into SFX items, mirrors parseManifest() from the module ---
const buildItems = (rows) => {
  const entries = [];
  const groupedCounts = new Map();

  rows.forEach((row, index) => {
    const label = String(row.NazwaSampla || "").trim();
    const filename = String(row.NazwaPliku || "").trim();
    const folderUrl = String(row.LinkDoFolderu || "").trim();
    if (!label) {
      return;
    }
    const grouping = getGroupingBaseLabel(label);
    const baseLabel = grouping.baseLabel || label;
    const isGroupCandidate = grouping.changed;
    entries.push({
      label,
      baseLabel,
      isGroupCandidate,
      filename,
      folderUrl,
      fullUrl: normalizeUrl(folderUrl, filename),
      repoPath: toRepoPath(folderUrl, filename),
      rowIndex: index + 1
    });
    if (isGroupCandidate) {
      const key = `${folderUrl}||${baseLabel}`;
      groupedCounts.set(key, (groupedCounts.get(key) || 0) + 1);
    }
  });

  const groupMap = new Map();
  const seen = new Set();

  entries.forEach((entry) => {
    const groupKeyBase = `${entry.folderUrl}||${entry.baseLabel}`;
    const groupSize = groupedCounts.get(groupKeyBase) || 0;
    const shouldGroup = entry.isGroupCandidate && groupSize > 1;
    const groupKey = shouldGroup
      ? groupKeyBase
      : `${entry.folderUrl}||${entry.label}||${entry.filename}||${entry.rowIndex}`;

    if (!groupMap.has(groupKey)) {
      const tags = extractTags(entry.folderUrl);
      const tag2 = tags[1] || "";
      const tagPaths = tags.map((_, i) => tags.slice(0, i + 1).join(" / "));
      let id = slugify(shouldGroup ? entry.baseLabel : entry.label, entry.rowIndex);
      if (seen.has(id)) {
        id = `${id}-${entry.rowIndex}`;
      }
      seen.add(id);
      groupMap.set(groupKey, {
        id,
        label: shouldGroup ? entry.baseLabel : entry.label,
        groupCount: shouldGroup ? groupSize : 0,
        filename: entry.filename,
        access: entry.folderUrl.includes(DEMO_PREFIX) ? "public" : "protected",
        tags,
        tag2,
        tagPaths,
        variants: []
      });
    }

    const group = groupMap.get(groupKey);
    group.variants.push({
      filename: entry.filename,
      fullUrl: entry.fullUrl,
      path: entry.repoPath
    });
  });

  return Array.from(groupMap.values()).map((item) => {
    if (item.variants.length > 1) {
      const suffix = item.variants.length - 1;
      const first = item.variants[0]?.filename || "";
      item.filename = suffix > 0 ? `${first} (+${suffix})` : first;
    }
    return item;
  });
};

// --- Wejście skryptu / Script entry point ---
const [, , rowsPath, outDir] = process.argv;
if (!rowsPath || !outDir) {
  console.error("Użycie: node build-manifests.mjs <rows.json> <katalog-wyjsciowy>");
  process.exit(1);
}

const rows = JSON.parse(readFileSync(rowsPath, "utf8"));
// Kolejność sortowania musi odpowiadać modułowi / Sort order must match the module
const items = buildItems(rows).sort((a, b) => a.label.localeCompare(b.label));

// Warstwa publiczna zachowuje gotowe adresy — pliki są jawnie dostępne
// The public tier keeps ready URLs because those files are intentionally public
const demo = items
  .filter((item) => item.access === "public")
  .map(({ id, label, groupCount, filename, tags, tag2, tagPaths, variants }) => ({
    id,
    label,
    groupCount,
    filename,
    access: "public",
    tags,
    tag2,
    tagPaths,
    variants: variants.map((variant) => ({ filename: variant.filename, url: variant.fullUrl }))
  }));

// Warstwa chroniona przechowuje wyłącznie ścieżki względne w repozytorium prywatnym
// The protected tier stores only paths relative to the private repository
const protectedItems = items
  .filter((item) => item.access === "protected")
  .map(({ id, label, groupCount, filename, tags, tag2, tagPaths, variants }) => ({
    id,
    label,
    groupCount,
    filename,
    access: "protected",
    tags,
    tag2,
    tagPaths,
    variants: variants.map((variant) => ({ filename: variant.filename, path: variant.path }))
  }));

const missing = protectedItems.flatMap((item) =>
  item.variants.filter((variant) => !variant.path).map(() => item.id)
);
if (missing.length) {
  console.error(`BŁĄD: ${missing.length} wariantów bez ścieżki w repozytorium prywatnym.`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "AudioManifestDemo.json"),
  `${JSON.stringify({ version: 1, access: "public", items: demo }, null, 2)}\n`
);
writeFileSync(
  join(outDir, "audio-manifest.json"),
  `${JSON.stringify({ version: 1, access: "protected", items: protectedItems })}\n`
);

console.log(`Pozycji łącznie: ${items.length}`);
console.log(`  warstwa publiczna (demo): ${demo.length}`);
console.log(`  warstwa chroniona:        ${protectedItems.length}`);

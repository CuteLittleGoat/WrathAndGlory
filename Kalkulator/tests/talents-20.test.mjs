// Test spójności sekcji talentów 2x10 oraz pętli TALENT_COUNT / Consistency test for talents section 2x10 and TALENT_COUNT loops
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../TworzeniePostaci.html', import.meta.url), 'utf8');

const ids = [...html.matchAll(/id="talent_(?:name|cost)_(\d+)"/g)].map((m) => Number(m[1]));
const maxId = Math.max(...ids);
const minId = Math.min(...ids);

if (minId !== 1 || maxId !== 20) {
  throw new Error(`Expected talent ids 1..20, got ${minId}..${maxId}`);
}

const uniqueNameCount = new Set([...html.matchAll(/id="talent_name_(\d+)"/g)].map((m) => m[1])).size;
const uniqueCostCount = new Set([...html.matchAll(/id="talent_cost_(\d+)"/g)].map((m) => m[1])).size;

if (uniqueNameCount !== 20 || uniqueCostCount !== 20) {
  throw new Error(`Expected 20 talent_name and 20 talent_cost fields, got ${uniqueNameCount} and ${uniqueCostCount}`);
}

if (!html.includes('const TALENT_COUNT = 20;')) {
  throw new Error('Missing TALENT_COUNT = 20 constant');
}

const loopMatches = html.match(/for \(let i = 1; i <= TALENT_COUNT; i\+\+\)/g) || [];
if (loopMatches.length < 3) {
  throw new Error(`Expected at least 3 TALENT_COUNT loops, got ${loopMatches.length}`);
}

console.log('OK: talents section and logic are configured for 20 fields.');

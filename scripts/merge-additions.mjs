// Merge an "additions" JSON file into data/. Used for batch research drops (e.g. from a Claude session
// that prepared several genres at once). Shape:
// { genres:[Genre], edges:[Edge], artistIndex:{name:[ids]}, modify:[{id, field, value}] }
//   modify.id = genre id → set `field` (or "traits[Key]" to replace one trait by key) to `value`
//   modify.id = "artistIndex" → field is the artist name; value ids are PREPENDED when the reason says
//   "prepend", otherwise appended.
// Usage: node scripts/merge-additions.mjs path/to/additions.json
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data');
const file = process.argv[2];
if (!file) { console.error('usage: node scripts/merge-additions.mjs additions.json'); process.exit(2); }
const add = JSON.parse(readFileSync(file, 'utf8'));
const rd = (p) => JSON.parse(readFileSync(path.join(dataDir, p), 'utf8'));
const wr = (p, v) => writeFileSync(path.join(dataDir, p), JSON.stringify(v, null, 2) + '\n');

const families = rd('families.json');
const genresByFam = Object.fromEntries(families.map((f) => [f.id, rd(`genres/${f.id}.json`)]));
const edges = rd('edges.json');
const artistIndex = rd('artist-index.json');
const allIds = new Set(Object.values(genresByFam).flat().map((g) => g.id));
const touched = new Set();

for (const g of add.genres || []) {
  if (allIds.has(g.id)) { console.warn(`skip genre ${g.id}: already exists`); continue; }
  if (!genresByFam[g.fam]) throw new Error(`genre ${g.id}: unknown fam ${g.fam}`);
  genresByFam[g.fam].push(g); allIds.add(g.id); touched.add(g.fam);
  console.log(`+ genre ${g.id} (${g.fam})`);
}
const edgeKey = (e) => `${e.from}>${e.to}`;
const existing = new Set(edges.map(edgeKey));
for (const e of add.edges || []) {
  if (existing.has(edgeKey(e))) { console.warn(`skip edge ${edgeKey(e)}: exists`); continue; }
  edges.push(e); existing.add(edgeKey(e));
}
console.log(`+ ${(add.edges || []).length} edges`);
for (const [name, ids] of Object.entries(add.artistIndex || {})) {
  if (artistIndex[name]) { for (const id of ids) if (!artistIndex[name].includes(id)) artistIndex[name].push(id); }
  else artistIndex[name] = ids;
}
const findGenre = (id) => { for (const f of Object.keys(genresByFam)) { const g = genresByFam[f].find((x) => x.id === id); if (g) { touched.add(f); return g; } } return null; };
for (const m of add.modify || []) {
  if (m.id === 'artistIndex') {
    const cur = artistIndex[m.field] || [];
    const fresh = m.value.filter((id) => !cur.includes(id));
    artistIndex[m.field] = /prepend/i.test(m.reason || '') ? [...fresh, ...cur] : [...cur, ...fresh];
    continue;
  }
  const g = findGenre(m.id); if (!g) throw new Error(`modify: unknown genre ${m.id}`);
  const tm = /^traits\[(.+)\]$/.exec(m.field);
  if (tm) { const i = g.traits.findIndex((t) => t.k === tm[1]); if (i >= 0) g.traits[i] = m.value; else g.traits.push(m.value); }
  else g[m.field] = m.value;
  console.log(`~ ${m.id}.${m.field}`);
}
for (const f of touched) wr(`genres/${f}.json`, genresByFam[f]);
wr('edges.json', edges);
wr('artist-index.json', Object.fromEntries(Object.entries(artistIndex)));
console.log('merged. Now run: npm run validate');

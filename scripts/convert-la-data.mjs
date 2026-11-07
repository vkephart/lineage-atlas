// One-off migration: evaluate the Claude Design dataset (design-handoff/project/la-data.js,
// which assigns globalThis.LA_DATA) and write it out as the JSON files under data/.
// Kept in the repo so the migration is reproducible; the JSON files are the source of truth now.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const src = process.argv[2] || path.join(root, 'design-handoff/project/la-data.js');
const outDir = path.join(root, 'data');

const ctx = { globalThis: null };
ctx.globalThis = ctx;
vm.runInNewContext(readFileSync(src, 'utf8'), ctx);
const D = ctx.LA_DATA;
if (!D) throw new Error('LA_DATA not defined after evaluating ' + src);

mkdirSync(path.join(outDir, 'genres'), { recursive: true });

const pretty = (v) => JSON.stringify(v, null, 2) + '\n';

// families keep their authored order via famOrder
const families = D.famOrder.map((id) => ({ id, ...D.families[id] }));
writeFileSync(path.join(outDir, 'families.json'), pretty(families));

for (const fam of D.famOrder) {
  const list = D.genres.filter((g) => g.fam === fam);
  writeFileSync(path.join(outDir, 'genres', fam + '.json'), pretty(list));
}
const orphans = D.genres.filter((g) => !D.famOrder.includes(g.fam));
if (orphans.length) throw new Error('genres with unknown family: ' + orphans.map((g) => g.id).join(', '));

writeFileSync(path.join(outDir, 'edges.json'), pretty(D.edges));
writeFileSync(path.join(outDir, 'journeys.json'), pretty(D.journeys));
writeFileSync(path.join(outDir, 'artist-index.json'), pretty(D.artistIndex));

console.log(`wrote ${families.length} families, ${D.genres.length} genres, ${D.edges.length} edges, ${D.journeys.length} journeys, ${Object.keys(D.artistIndex).length} artist-index entries to ${outDir}`);

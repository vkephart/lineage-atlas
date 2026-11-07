/**
 * Data integrity check for data/*.json. Run with `npm run validate`.
 * Exits non-zero on errors; warnings are printed but do not fail the build.
 */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Edge, Family, Genre, Journey, ArtistIndex, Rel, Role } from '../src/data/types';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data');
const read = <T,>(p: string): T => JSON.parse(readFileSync(path.join(dataDir, p), 'utf8')) as T;

const families = read<Family[]>('families.json');
const edges = read<Edge[]>('edges.json');
const journeys = read<Journey[]>('journeys.json');
const artistIndex = read<ArtistIndex>('artist-index.json');

const errors: string[] = [];
const warnings: string[] = [];
const err = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);

const ROLES: Role[] = ['foundational', 'branch', 'classic', 'hybrid', 'revival', 'rising'];
const RELS: Rel[] = ['origin', 'stylistic', 'production', 'scene', 'revival', 'bridge'];
const MIN_YEAR = -380;
const MAX_YEAR = 2026;

// ── families ──────────────────────────────────────────────────────────────
const famIds = new Set<string>();
families.forEach((f) => {
  if (famIds.has(f.id)) err(`duplicate family id "${f.id}"`);
  famIds.add(f.id);
  if (!/^#[0-9a-f]{6}$/i.test(f.color)) err(`family ${f.id}: color must be #rrggbb`);
  if (!/^\d{1,3},\d{1,3},\d{1,3}$/.test(f.rgb)) err(`family ${f.id}: rgb must be "r,g,b"`);
  if (typeof f.y !== 'number') err(`family ${f.id}: y must be a number`);
});
for (let i = 1; i < families.length; i++) {
  if (families[i].y <= families[i - 1].y) err(`family ${families[i].id}: y must increase in file order`);
}

// ── genres ────────────────────────────────────────────────────────────────
const genres: Genre[] = [];
const genreFiles = readdirSync(path.join(dataDir, 'genres')).filter((f) => f.endsWith('.json')).sort();
for (const file of genreFiles) {
  const fam = file.replace('.json', '');
  if (!famIds.has(fam)) err(`data/genres/${file}: no family "${fam}" in families.json`);
  const list = read<Genre[]>(`genres/${file}`);
  if (!Array.isArray(list)) { err(`data/genres/${file}: must be a JSON array`); continue; }
  list.forEach((g) => {
    if (g.fam !== fam) err(`genre ${g.id} in ${file} has fam "${g.fam}" (file is ${fam})`);
    genres.push(g);
  });
}

const byId = new Map<string, Genre>();
genres.forEach((g) => {
  const where = `genre "${g.id}"`;
  if (!g.id || !/^[a-z0-9]+$/.test(g.id)) err(`${where}: id must be lowercase letters/digits`);
  if (byId.has(g.id)) err(`${where}: duplicate id`);
  byId.set(g.id, g);
  if (!g.name) err(`${where}: missing name`);
  if (!famIds.has(g.fam)) err(`${where}: unknown fam "${g.fam}"`);
  if (g.fam2 !== undefined) {
    if (!famIds.has(g.fam2)) err(`${where}: unknown fam2 "${g.fam2}"`);
    if (g.fam2 === g.fam) warn(`${where}: fam2 equals fam`);
  }
  if (g.role === 'hybrid' && !g.fam2) warn(`${where}: hybrid without fam2 renders as a plain branch`);
  if (!ROLES.includes(g.role)) err(`${where}: unknown role "${g.role}"`);
  if (typeof g.year !== 'number' || g.year < MIN_YEAR || g.year > MAX_YEAR) err(`${where}: year ${g.year} out of range ${MIN_YEAR}..${MAX_YEAR}`);
  if (g.yOff !== undefined && typeof g.yOff !== 'number') err(`${where}: yOff must be a number`);
  if (!g.def || g.def.length < 40) err(`${where}: def missing or too short`);
  if (!g.why || g.why.length < 30) err(`${where}: why missing or too short`);
  if (!Array.isArray(g.traits) || g.traits.length < 2) err(`${where}: needs at least 2 traits`);
  else g.traits.forEach((t, i) => { if (!t.k || !t.v) err(`${where}: trait ${i} needs k and v`); });
  if (!Array.isArray(g.artists) || g.artists.length < 1) err(`${where}: needs representative artists`);
  if (!Array.isArray(g.albums)) err(`${where}: albums must be an array (may be empty)`);
  else g.albums.forEach((a, i) => { if (!a.t || !a.a) err(`${where}: album ${i} needs t and a`); });
  if (!Array.isArray(g.tracks) || g.tracks.length < 1) err(`${where}: needs representative tracks`);
  else {
    if (g.tracks.length !== 3) warn(`${where}: has ${g.tracks.length} tracks (convention is 3)`);
    g.tracks.forEach((t, i) => { if (!t.t || !t.a) err(`${where}: track ${i} needs t and a`); });
  }
  if (g.tempo !== undefined && !/BPM/.test(g.tempo)) warn(`${where}: tempo "${g.tempo}" does not mention BPM`);
});

// ── edges ─────────────────────────────────────────────────────────────────
const edgeKeys = new Set<string>();
const inDeg = new Map<string, number>();
edges.forEach((e, i) => {
  const where = `edge #${i} ${e.from}→${e.to}`;
  if (!byId.has(e.from)) err(`${where}: unknown from id "${e.from}"`);
  if (!byId.has(e.to)) err(`${where}: unknown to id "${e.to}"`);
  if (e.from === e.to) err(`${where}: self-loop`);
  if (!RELS.includes(e.rel)) err(`${where}: unknown rel "${e.rel}"`);
  if (typeof e.strength !== 'number' || e.strength <= 0 || e.strength > 1) err(`${where}: strength must be in (0,1]`);
  if (!e.note || e.note.length < 20) err(`${where}: note missing or too short`);
  const key = `${e.from}>${e.to}`;
  if (edgeKeys.has(key)) err(`${where}: duplicate edge (same from/to appears twice)`);
  edgeKeys.add(key);
  inDeg.set(e.to, (inDeg.get(e.to) ?? 0) + 1);
  const a = byId.get(e.from), b = byId.get(e.to);
  if (a && b) {
    if (e.rel === 'bridge' && a.fam === b.fam && a.fam2 !== b.fam && b.fam2 !== a.fam) warn(`${where}: bridge edge inside one family`);
    if (b.year < a.year - 5 && e.rel !== 'scene' && e.rel !== 'bridge') warn(`${where}: influence runs backwards in time (${a.year} → ${b.year})`);
  }
});

// Orphans: every genre should have at least one connection (true historical roots may have none incoming).
const touched = new Set<string>();
edges.forEach((e) => { touched.add(e.from); touched.add(e.to); });
genres.forEach((g) => { if (!touched.has(g.id)) err(`genre "${g.id}" has no edges at all`); });
genres.forEach((g) => { if (g.year >= 1900 && !(inDeg.get(g.id) ?? 0)) warn(`genre "${g.id}" (${g.year}) has no predecessors`); });

// ── journeys ──────────────────────────────────────────────────────────────
const jIds = new Set<string>();
journeys.forEach((j) => {
  const where = `journey "${j.id}"`;
  if (jIds.has(j.id)) err(`${where}: duplicate id`);
  jIds.add(j.id);
  if (!j.title || !j.subtitle) err(`${where}: needs title and subtitle`);
  if (!Array.isArray(j.steps) || j.steps.length < 2) err(`${where}: needs at least 2 steps`);
  else j.steps.forEach((s, i) => {
    if (!byId.has(s.id)) err(`${where}: step ${i} references unknown genre "${s.id}"`);
    if (!s.text || s.text.length < 30) err(`${where}: step ${i} text missing or too short`);
    if (i > 0) {
      const p = j.steps[i - 1].id;
      const linked = edgeKeys.has(`${p}>${s.id}`) || edgeKeys.has(`${s.id}>${p}`);
      if (!linked) warn(`${where}: steps ${p} → ${s.id} have no connecting edge, so the trail will not light up between them`);
    }
  });
});

// ── artist index ──────────────────────────────────────────────────────────
Object.entries(artistIndex).forEach(([name, ids]) => {
  if (!Array.isArray(ids) || !ids.length) err(`artist "${name}": must map to a non-empty array of genre ids`);
  else ids.forEach((id) => { if (!byId.has(id)) err(`artist "${name}": unknown genre id "${id}"`); });
});

// ── report ────────────────────────────────────────────────────────────────
const summary = `${families.length} families · ${genres.length} genres · ${edges.length} edges · ${journeys.length} journeys · ${Object.keys(artistIndex).length} indexed artists`;
if (warnings.length && process.env.QUIET !== '1') {
  console.log(`\n${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log('  ⚠ ' + w));
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  errors.forEach((e) => console.error('  ✖ ' + e));
  console.error(`\nvalidate-data: FAILED (${summary})`);
  process.exit(1);
}
console.log(`\nvalidate-data: OK — ${summary}`);

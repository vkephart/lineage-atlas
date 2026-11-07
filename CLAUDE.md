# The Music Genre Lineage Atlas — project guide for Claude Code

An interactive, dark-mode map of how music genres evolved and influenced one another (380 BCE → now).
Static site: Vite + React 19 + TypeScript, no backend. Deployed to GitHub Pages on every push to `main`.

## Layout

| Path | What it is |
|---|---|
| `data/families.json` | The 9 super-families (id, labels, colour, row position). Order = row order on the map. |
| `data/genres/<family>.json` | One array of genre records per family. **This is where genres are added.** |
| `data/edges.json` | All influence relationships (`from` → `to`, type, strength, one-sentence note). |
| `data/journeys.json` | Curated guided paths (ordered genre steps with narration). |
| `data/artist-index.json` | Artist name → genre ids, most specific first. Drives artist search. |
| `src/Atlas.tsx` | The whole interactive component (map, panels, search, journeys, gestures). |
| `src/atlas.css` | Global styles, keyframes, hover states and the `max-width:720px` mobile rules. |
| `src/data/types.ts` | TypeScript types for every data record. |
| `scripts/validate-data.ts` | Data integrity check. `npm run validate`. Runs in CI and before every build. |
| `scripts/merge-additions.mjs` | Applies a batch additions JSON (genres + edges + artists + edits) to `data/`. |
| `design-handoff/` | The original Claude Design export (prototype HTML, dataset, 50 chat transcripts). Reference only; never edited. |

## Commands

```bash
npm install          # once
npm run dev          # local dev server
npm run validate     # check data integrity (fails on broken references)
npm run build        # validate + typecheck + production build into dist/
```

## Adding or changing a genre (the usual task from a phone session)

1. **Research first.** Verify the emergence year, 3–5 representative artists, 1–2 gateway albums and
   exactly 3 representative tracks. Prefer the earliest canonical record for the year. Say in the reply which
   facts were verified by search and which came from memory.
2. **Pick the family file** (`data/genres/<fam>.json`) and append a record:
   ```json
   { "id": "lowercaseid", "name": "Display Name", "fam": "rock", "fam2": "soul", "year": 1971,
     "role": "branch", "yOff": 120, "aka": "Alt Name · Other Name",
     "def": "One or two sentences.", "traits": [{"k":"Rhythm / groove","v":"…"}, …4 items…],
     "why": "One sentence on why it sounds the way it does.",
     "artists": ["…"], "albums": [{"t":"Album","a":"Artist"}],
     "tracks": [{"t":"Track","a":"Artist","why":"optional one-liner"}, {…}, {…}],
     "tempo": "90–130 BPM", "tempoNote": "optional caveat when the range is wide" }
   ```
   - `role`: `foundational` | `branch` | `hybrid` (needs `fam2`) | `revival` | `rising` (pulsing, for current frontiers).
   - `yOff` is the vertical offset in px from the family row centre. The layout has an automatic de-overlap pass,
     so a plausible value (0, ±60 … ±300) is enough; avoid the exact `yOff` of a same-year neighbour.
   - Trait keys in use: `Rhythm / groove`, `Harmony`, `Melody`, `Texture / timbre`, `Vocal approach`,
     `Song structure`, `Production`, `Scene / context`.
   - Omit `tempo` where BPM is meaningless (ambient, drone, free jazz, classical traditions).
3. **Wire it in** with edges in `data/edges.json`. Every genre needs at least one edge, and anything after 1900
   should have a predecessor. `rel` is one of `origin` (direct historical descent), `stylistic`, `production`,
   `scene` (adjacency, not descent), `revival`, `bridge` (cross-family link). `strength` is 0.3–0.9.
   Never add a second edge with the same `from`/`to`; edit the existing one instead.
4. **Index the artists** in `data/artist-index.json` (specific genre first, then parents/roll-ups), including
   well-known acts whose micro-genre is not a node.
5. **Run `npm run validate`.** Fix every error; read the warnings (journeys whose consecutive steps have no
   edge will not light up, backwards-in-time influences, orphans).
6. Optional: add a journey in `data/journeys.json` when a lineage tells a story (6–10 steps, each step a genre id
   plus 1–2 sentences). Consecutive steps must be connected by an edge.
7. Commit with a message like `data: add Country Rock, Soft Rock; re-date New Post-Punk to 2017` and push to
   `main`. GitHub Pages redeploys automatically in about a minute.

For a batch of several genres, write one additions JSON (see the header comment in
`scripts/merge-additions.mjs` for the shape) and run `node scripts/merge-additions.mjs file.json`.

## Editorial tone

Concise and musicologically specific. Definitions name the sonic grammar (rhythm, harmony, texture, production,
scene), not hype. Nodes are genres with a shared sound, not scenes or cities: Madchester earns a node because it
had one sound; Laurel Canyon or Oxford do not, and live in a genre's `Scene / context` trait instead. Date a
genre to its first canonical records, not its naming or commercial peak. Keep "rising" for genres still forming.

## Design rules

- Dark, editorial, atmospheric. Fonts: Spectral (serif, definitions and titles), Schibsted Grotesk (UI),
  JetBrains Mono (labels and metadata). Family colours live in `data/families.json`; do not add new colours ad hoc.
- Edge style encodes the relation type (solid origin, dashed stylistic, dotted production, sparse dots scene,
  dash-dot revival, heavy dash bridge). Line weight encodes strength. Keep that mapping intact.
- The map transform, pinch/pan and hover highlighting are imperative DOM writes on purpose (see the comment at the
  top of `src/Atlas.tsx`); routing them through React state re-introduces visible flicker and iOS drag lag.
- Any visual or interaction change must be checked in a real browser at a desktop width (≥1200px) and a phone
  width (≤430px). Use Playwright screenshots; `npm run dev` then script against `http://localhost:5173`.
- Mobile rules live in the `@media (max-width:720px)` block of `src/atlas.css`; `isMobile` in the component is the
  same breakpoint.

## Deployment

`.github/workflows/deploy.yml` validates, builds and publishes `dist/` to GitHub Pages on push to `main`.
The base path is derived from the repository name (`/<repo>/`). To serve from a custom domain, add the domain to
`public/CNAME` (the workflow then builds with base `/`) and point DNS at GitHub Pages.
